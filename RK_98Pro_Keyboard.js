export function Name() { return "RK R98 Pro"; }
export function Publisher() { return "Mizzen"; }
export function VendorId() { return  0x258a;}  //Device's USB Vendor Id in Hex
export function ProductId() { return 0x027c; } // RK R98 Pro (Sinowealth) - VID_258A/PID_027C
export function Size() { return [20, 6]; }
export function DeviceType() { return "keyboard"; }
export function DefaultPosition(){return [0, 5];}
export function DefaultScale(){return 12;}
/*
Protocolo reconstruido a partir de:
1) Captura USB real del R98 Pro (Wireshark + USBPcap) sobre la interfaz vendor (MI_01):
   - Control Transfer SET_REPORT, wValue=0x0309 (ReportID 9, Feature), wIndex=1, wLength=520.
   - Push de color EN VIVO (confirmado con una captura de color SOLIDO puesto desde el
     software oficial RK Keyboard, y luego validado probando en vivo con rojo/verde/azul):
     header 09 08 00 00 01 00 7a 01, y la tabla de colores arranca INMEDIATAMENTE en el
     byte 8, sin relleno de ceros. 7a 01 (little endian = 0x017a = 378) es el tamano de la
     tabla (126 slots x 3 bytes). Orden de canales confirmado: G,R,B (no R,G,B).
   - Un comando distinto (subcomando 0x0a, largo 0x01a4=420, con 20 bytes de relleno antes de
     la tabla) tambien existe pero corresponde a otra operacion -- probablemente guardar un
     perfil/efecto interno, no control directo de LEDs.
2) Plugin comunitario ya funcional para el RK R98 (no Pro, PID 0x0143, mismo VID 0x258A,
   mismo layout fisico 96%/98 teclas) encontrado en el Discord de SignalRGB: usa el mismo
   subcomando 0x08 (con su propio Report ID 6) y el mismo orden de canales G,R,B, y aporta el
   mapeo indice->tecla (vKeys/vKeyPositions) para las 99 teclas de este layout. Ese mapeo se
   reutiliza aca tal cual (misma familia de PCB/firmware Sinowealth).
NO CONFIRMADO TODAVIA: que el mapeo indice->tecla del R98 (no Pro) sea identico pixel a pixel
en el R98 Pro. Es la mejor hipotesis disponible; el color en si ya esta confirmado funcionando.
*/
export function ControllableParameters(){
	return [
		{"property":"shutdownColor", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}

// Nombres genericos (LedN) para evitar desalinear el mapeo real; cosmetico, no afecta el render.
const vKeyNames =
[
	"Led1", "Led2", "Led3", "Led4", "Led5", "Led6", "Led7", "Led8",
	"Led9", "Led10", "Led11", "Led12", "Led13", "Led14", "Led15",
	"Led16", "Led17", "Led18", "Led19", "Led20", "Led21", "Led22",
	"Led23", "Led24", "Led25", "Led26", "Led27", "Led28", "Led29",
	"Led30", "Led31", "Led32", "Led33", "Led34", "Led35", "Led36",
	"Led37", "Led38", "Led39", "Led40", "Led41", "Led42", "Led43",
	"Led44", "Led45", "Led46", "Led47", "Led48", "Led49", "Led50",
	"Led51", "Led52", "Led53", "Led54", "Led55", "Led56", "Led57",
	"Led58", "Led59", "Led60", "Led61", "Led62", "Led63", "Led64",
	"Led65", "Led66", "Led67", "Led68", "Led69", "Led70", "Led71",
	"Led72", "Led73", "Led74", "Led75", "Led76", "Led77", "Led78",
	"Led79", "Led80", "Led81", "Led82", "Led83", "Led84", "Led85",
	"Led86", "Led87", "Led88", "Led89", "Led90", "Led91", "Led92",
	"Led93", "Led94", "Led95", "Led96","Led97", "Led98", "Led99"
];

// Indices dentro de la tabla de colores (antes de multiplicar x3).
// Tomados tal cual del plugin comunitario del RK R98 (hermano de layout, mismo VID 0x258A).
const vKeys =
[
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
	17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 30, 31, 32,
	33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 48,
	49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
	63, 64, 65, 66, 67, 68, 69, 72, 73, 74, 78, 79, 80, 81,
	82, 83, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
	100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 112
];

const vKeyPositions = [
[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 0], [1, 1], [1, 2], [2, 3], [2, 4], [1, 5],
 [2, 0], [2, 1], [2, 2], [3, 3], [3, 4], [2, 5], [3, 0], [3, 1], [3, 2], [4, 3], [4, 4], [4, 0],
 [4, 1], [4, 2], [5, 3], [5, 4], [5, 0], [5, 1], [5, 2], [6, 3], [6, 4], [6, 5], [6, 0], [6, 1],
 [6, 2], [7, 3], [7, 4], [7, 0], [7, 1], [7, 2], [8, 3], [8, 4], [8, 0], [8, 1], [8, 2], [9, 3],
 [9, 4], [10, 5], [10, 0], [10, 1], [10, 2], [10, 3], [10, 4], [11, 5], [11, 0], [11, 1], [11, 2],
 [11, 3], [11, 4], [12, 5], [12, 0], [12, 1], [12, 2], [12, 3], [13, 0], [13, 1], [13, 2], [14, 0],
 [14, 1], [14, 2], [13, 3], [13, 4], [14, 5], [15, 4], [15, 5], [16, 0], [16, 1], [16, 2], [16, 3],
 [16, 4], [16, 5], [17, 0], [17, 1], [17, 2], [17, 3], [17, 4], [17, 5], [18, 0], [18, 1], [18, 2],
 [18, 3], [18, 4], [18, 5], [19, 0], [19, 1], [19, 3], [19, 5]
];

export function LedNames() {
	return vKeyNames;
}

export function LedPositions() {
	return vKeyPositions;
}

export function Initialize() {
	// El software oficial "RK Keyboard" hace 3 pasos antes de empezar a mandar color: reset,
	// leer el perfil actual y re-escribirlo igual (cambiando solo el subcomando 0x84 -> 0x04).
	// Paso 1: SET_REPORT subcomando 0x84 (reset/query), 520 bytes con el resto en cero.
	let step1 = [0x09, 0x84, 0x00, 0x00, 0x01, 0x00, 0x80, 0x00];
	step1 = step1.concat(new Array(520 - step1.length).fill(0));
	device.send_report(step1, 520);

	// Paso 2: GET_REPORT -- el dispositivo devuelve su tabla de perfil actual.
	const profile = device.get_report(step1, 520);

	// Paso 3: SET_REPORT re-escribiendo la MISMA tabla leida, cambiando solo el subcomando
	// de 0x84 a 0x04 (byte[1]). El software oficial no modifica el resto del contenido.
	if (profile && profile.length) {
		const step3 = Array.from(profile);
		step3[1] = 0x04;
		device.send_report(step3, 520);
	}
}

export function Render() {
	SendPacket();
}

export function Shutdown() {
	//Do nothing. Keeb reverts to hardware mode when streaming is stopped.
}

// Push de color en vivo, confirmado y funcionando contra el hardware real:
//   byte0 = 0x09 (Report ID)
//   byte1 = 0x08 (subcomando: push de color en vivo)
//   byte2-5 = 00 00 01 00 (fijo)
//   byte6-7 = 7a 01 (little endian 0x017a = 378 = tamano de la tabla, 126 slots x 3 bytes)
//   byte8 en adelante = tabla de colores INMEDIATAMENTE, SIN relleno de ceros, orden G,R,B
const TABLE_SIZE = 378;   // 0x017a, 126 slots x 3 bytes

function SendPacket()
{
	let rgbdata = grabColors();
	let packet = [0x09, 0x08, 0x00, 0x00, 0x01, 0x00, 0x7a, 0x01];
	packet = packet.concat(rgbdata);
	device.send_report(packet, 520);
	device.pause(1);
}

function grabColors()
{
	let rgbdata = new Array(TABLE_SIZE).fill(0);

	if (LightingMode === "Forced")
	{
		let color = hexToRgb(forcedColor);
		for (let i = 0; i < TABLE_SIZE; i += 3)
		{
			rgbdata[i] = color[1];     // G
			rgbdata[i + 1] = color[0]; // R
			rgbdata[i + 2] = color[2]; // B
		}
		return rgbdata;
	}

	for(let iIdx = 0; iIdx < vKeys.length; iIdx++)
	{
		let iPxX = vKeyPositions[iIdx][0];
		let iPxY = vKeyPositions[iIdx][1];
		let color = device.color(iPxX, iPxY);

		let iLedIdx = vKeys[iIdx] * 3;
		if (iLedIdx + 2 >= TABLE_SIZE) continue; // fuera de rango de la tabla real (126 slots)
		rgbdata[iLedIdx] = color[1];     // G
		rgbdata[iLedIdx + 1] = color[0]; // R
		rgbdata[iLedIdx + 2] = color[2]; // B
	}

	return rgbdata;
}

export function Validate(endpoint) {
	// El HID Report Descriptor real (294 bytes, interfaz 1) tiene VARIAS colecciones vendor:
	// Report ID 4 y Report ID 9 -> usage_page 0xFF02 (usage 0x0001)
	// Report ID 5 y Report ID 6 -> usage_page 0xFF00 (usage 0x0001)
	// La tabla de colores esta en el Report ID 9, que vive en la coleccion 0xFF02.
	// "collection" = 8 es contando nodos de colision anidados en orden del descriptor.
	return endpoint.interface === 1 && endpoint.usage === 0x0001 && endpoint.usage_page === 0xff02 && endpoint.collection === 0x0008;
}

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	const colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);

	return colors;
}

export function ImageUrl(){
	return "https://assets.signalrgb.com/devices/brands/royal-kludge/keyboards/rk84.png";
}
