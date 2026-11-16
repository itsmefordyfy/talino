/**
 * Raw DEFLATE decompression with the web-standard `DecompressionStream` (the same on Node and on the hosting runtime),
 * so reading an uploaded Word file needs no library. Stops as soon as the output passes `maxBytes`, so a small upload can't
 * expand into memory (a zip bomb): it throws, and `readZipEntry` turns that into "unreadable".
 */
export async function inflateRaw(data: Uint8Array, maxBytes: number = 8 * 1024 * 1024): Promise<Uint8Array> {
  const reader = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error('too large');
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let at = 0;
  for (const chunk of chunks) {
    out.set(chunk, at);
    at += chunk.length;
  }
  return out;
}
