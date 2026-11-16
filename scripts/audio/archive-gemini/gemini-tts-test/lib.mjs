import { readFileSync, writeFileSync } from 'node:fs';

// Reads the key from the project's .env (run from the project root) without ever printing it.
const env = Object.fromEntries(readFileSync(`${process.cwd()}/.env`, 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]));
export const KEY = env.GEMINI_API_KEY;
const URL_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * The audio of a Gemini WAV: the `data` chunk, at the size its header declares. Gemini's file has a `C2PA` metadata chunk after it (about 8 KB of
 * provenance data): taking "everything after the 44-byte header" plays that as a burst of static at the end of every clip.
 */
export function pcmOfWav(buffer) {
  let at = 12;
  while (at + 8 <= buffer.length) {
    const id = buffer.toString('ascii', at, at + 4);
    const size = buffer.readUInt32LE(at + 4);
    if (id === 'data') return buffer.subarray(at + 8, Math.min(buffer.length, at + 8 + size));
    at += 8 + size + (size & 1);
  }
  throw new Error('no data chunk in the WAV');
}

export async function tts(model, voice, text) {
  const started = Date.now();
  const response = await fetch(`${URL_BASE}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text }] }], generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } } }),
  });
  const ms = Date.now() - started;
  const body = await response.json().catch(() => null);
  if (!response.ok) return { ok: false, status: response.status, ms, error: (body?.error?.message ?? '').slice(0, 160) };
  const part = body?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) return { ok: false, status: 200, ms, error: 'no audio part: ' + JSON.stringify(body).slice(0, 200) };
  return { ok: true, ms, mime: part.inlineData.mimeType, data: Buffer.from(part.inlineData.data, 'base64'), usage: body.usageMetadata };
}

/** Wraps raw 16-bit mono PCM in a WAV header (the API returns headerless L16 at 24 kHz). */
export function wav(pcm, rate = 24000) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVE', 8); header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/** Seconds, peak and RMS (0..1) of 16-bit PCM: a sanity check that the clip isn't silent or clipped. */
export function stats(pcm, rate = 24000) {
  const samples = pcm.length / 2;
  let peak = 0, sum = 0;
  for (let i = 0; i < samples; i++) { const v = pcm.readInt16LE(i * 2) / 32768; peak = Math.max(peak, Math.abs(v)); sum += v * v; }
  return { seconds: +(samples / rate).toFixed(2), peak: +peak.toFixed(2), rms: +Math.sqrt(sum / samples).toFixed(3) };
}
export const save = (name, buffer) => writeFileSync(name, buffer);
