#!/usr/bin/env python3
"""Control RGB del RK R98 Pro en Linux via hidraw, sin SignalRGB.

Protocolo reconstruido en RK_98Pro_Keyboard.js (mismo repo): interfaz vendor
(interface 1, usage_page 0xFF02), Report ID 9, Feature report de 520 bytes.
Init: reset (subcomando 0x84) -> leer perfil -> reescribirlo con subcomando
0x04. Push de color: subcomando 0x08, tabla de 126 slots x 3 bytes en orden
G,R,B arrancando en el byte 8, sin relleno.

Requiere permisos de root sobre /dev/hidraw* del teclado -> correr con pkexec.
"""
import sys
import time

import hid

VID = 0x258A
PID = 0x027C
REPORT_LEN = 520
TABLE_SIZE = 378  # 126 slots x 3 bytes


def find_path() -> bytes:
    for d in hid.enumerate(VID, PID):
        if d["interface_number"] == 1 and d["usage_page"] == 0xFF02 and d["usage"] == 1:
            return d["path"]
    raise RuntimeError("No se encontro la interfaz vendor (interface 1, usage_page 0xFF02) del R98 Pro")


def open_device() -> "hid.device":
    dev = hid.device()
    dev.open_path(find_path())
    return dev


def init(dev: "hid.device") -> None:
    step1 = [0x09, 0x84, 0x00, 0x00, 0x01, 0x00, 0x80, 0x00]
    step1 += [0] * (REPORT_LEN - len(step1))
    dev.send_feature_report(bytes(step1))

    profile = dev.get_feature_report(0x09, REPORT_LEN)
    if profile:
        step3 = bytearray(profile)
        step3[1] = 0x04
        step3 += bytes(REPORT_LEN - len(step3))  # el device devuelve menos de 520; hay que rellenar igual
        dev.send_feature_report(bytes(step3))


def push_color(dev: "hid.device", r: int, g: int, b: int) -> None:
    table = [g, r, b] * (TABLE_SIZE // 3)
    packet = [0x09, 0x08, 0x00, 0x00, 0x01, 0x00, 0x7A, 0x01] + table
    packet += [0] * (REPORT_LEN - len(packet))
    dev.send_feature_report(bytes(packet))


def parse_color(arg: str) -> tuple[int, int, int]:
    if arg == "off":
        return 0, 0, 0
    arg = arg.lstrip("#")
    return int(arg[0:2], 16), int(arg[2:4], 16), int(arg[4:6], 16)


def main() -> None:
    args = sys.argv[1:]
    if not args or len(args) > 2 or (len(args) == 2 and args[1] != "--hold"):
        print("uso: rk98pro_rgb.py RRGGBB|off [--hold]", file=sys.stderr)
        sys.exit(1)

    hold = "--hold" in args
    r, g, b = parse_color(args[0])
    dev = open_device()
    try:
        init(dev)
        push_color(dev, r, g, b)
        if hold:
            # El color es un estado en vivo: si dejamos de mandarlo, el teclado
            # vuelve a su perfil/efecto interno. Reenviamos hasta Ctrl+C.
            print("manteniendo color, Ctrl+C para soltar...")
            try:
                while True:
                    time.sleep(2)
                    push_color(dev, r, g, b)
            except KeyboardInterrupt:
                pass
    finally:
        dev.close()
    print("listo")


if __name__ == "__main__":
    main()
