/**
 * A small zip writer and reader, so a Word file can be made on the phone and read on the server without a library.
 * Writing stores entries uncompressed (Word accepts it, and a résumé is a few KB). Reading handles stored and
 * deflated entries; the caller supplies `inflate` because the phone and the server inflate differently.
 */

const TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export type ZipFile = { name: string; data: Uint8Array };

const u16 = (value: number) => [value & 0xff, (value >>> 8) & 0xff];
const u32 = (value: number) => [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];

/** 1 Jan 2024 00:00 in DOS format, so the same files always give the same bytes. */
const DOS_TIME = 0;
const DOS_DATE = ((2024 - 1980) << 9) | (1 << 5) | 1;

/** The files as one zip. With `compress`, entries are deflated (raw DEFLATE); without, stored. */
export function makeZip(files: readonly ZipFile[], compress?: (data: Uint8Array) => Uint8Array): Uint8Array {
  const encoder = new TextEncoder();
  const chunks: number[][] = [];
  const central: number[][] = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const packed = compress ? compress(file.data) : file.data;
    const method = compress ? 8 : 0;
    const crc = crc32(file.data);
    // Bit 11 says the name is UTF-8.
    const header = [...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(method), ...u16(DOS_TIME), ...u16(DOS_DATE), ...u32(crc), ...u32(packed.length), ...u32(file.data.length), ...u16(name.length), ...u16(0), ...name];
    chunks.push(header, Array.from(packed));
    central.push([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(method), ...u16(DOS_TIME), ...u16(DOS_DATE), ...u32(crc), ...u32(packed.length), ...u32(file.data.length), ...u16(name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...name]);
    offset += header.length + packed.length;
  }
  const directory = central.flat();
  const end = [...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(directory.length), ...u32(offset), ...u16(0)];
  return Uint8Array.from([...chunks.flat(), ...directory, ...end]);
}

export type Inflate = (data: Uint8Array) => Uint8Array | Promise<Uint8Array>;

/** The default most a single entry may inflate to (a zip bomb stays small). */
export const MAX_ENTRY_BYTES = 8 * 1024 * 1024;

/**
 * One entry of a zip, or null when the bytes are not a zip, the entry is missing, uses an unsupported method, is cut
 * short, or inflates past `maxBytes`. Never throws on bad input.
 */
export async function readZipEntry(zip: Uint8Array, name: string, inflate: Inflate, maxBytes: number = MAX_ENTRY_BYTES): Promise<Uint8Array | null> {
  try {
    const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
    let end = -1;
    for (let at = zip.length - 22; at >= Math.max(0, zip.length - 22 - 65_535); at -= 1) {
      if (view.getUint32(at, true) === 0x06054b50) {
        end = at;
        break;
      }
    }
    if (end < 0) return null;
    const count = view.getUint16(end + 10, true);
    let at = view.getUint32(end + 16, true);
    const decoder = new TextDecoder();
    for (let index = 0; index < count; index += 1) {
      if (view.getUint32(at, true) !== 0x02014b50) return null;
      const method = view.getUint16(at + 10, true);
      const packedSize = view.getUint32(at + 20, true);
      const size = view.getUint32(at + 24, true);
      const nameLength = view.getUint16(at + 28, true);
      const extraLength = view.getUint16(at + 30, true);
      const commentLength = view.getUint16(at + 32, true);
      const local = view.getUint32(at + 42, true);
      const entryName = decoder.decode(zip.subarray(at + 46, at + 46 + nameLength));
      at += 46 + nameLength + extraLength + commentLength;
      if (entryName !== name) continue;
      if (size > maxBytes) return null;
      if (view.getUint32(local, true) !== 0x04034b50) return null;
      const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
      if (start + packedSize > zip.length) return null;
      const packed = zip.subarray(start, start + packedSize);
      if (method === 0) return packed.slice();
      if (method !== 8) return null;
      const data = await inflate(packed);
      return data.length > maxBytes ? null : data;
    }
    return null;
  } catch {
    return null;
  }
}
