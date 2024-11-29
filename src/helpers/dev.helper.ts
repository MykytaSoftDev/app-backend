export async function decodeFromBase64(referrer: string) {
	const binStr = atob(referrer)
	const u8 = new Uint8Array(binStr.length)
	for (let i = 0; i < binStr.length; i++) {
		u8[i] = binStr.charCodeAt(i)
	}
	return new TextDecoder().decode(u8)
}
