// Makes the two greetings the welcome plays for "Hear Tali" / "Hear Tala" with Gemini's voices (the same ones the chat answers use),
// as assets/audio/coach-<name>.m4a. Run from the project root: node scripts/audio/gemini-tts-test/coach-samples.mjs  (uses the owner's key; macOS afconvert).
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pcmOfWav, stats, tts, wav } from './lib.mjs';

const MODEL = 'gemini-3.8-flash-lite-tts';
const SAMPLES = {
  tali: ['Achird', "Hi, I'm Tali. I'm your coach here at Talino. I'll read your lessons aloud, and I'm right here whenever you get stuck."],
  tala: ['Sulafat', "Hi, I'm Tala. I'm your coach here at Talino. I'll read your lessons aloud, and I'm right here whenever you get stuck."],
};
const work = join(tmpdir(), 'coach-samples');
mkdirSync(work, { recursive: true });
for (const [name, [voice, text]] of Object.entries(SAMPLES)) {
  const result = await tts(MODEL, voice, text);
  if (!result.ok) throw new Error(`${name}: ${result.status} ${result.error}`);
  const pcm = pcmOfWav(result.data);
  const wavFile = join(work, `${name}.wav`);
  writeFileSync(wavFile, wav(pcm));
  const out = `assets/audio/coach-${name}.m4a`;
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', wavFile, out]);
  rmSync(wavFile);
  console.log(name, voice, stats(pcm), out);
}
