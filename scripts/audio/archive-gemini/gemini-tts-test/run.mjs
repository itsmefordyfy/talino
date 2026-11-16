import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { KEY, pcmOfWav, stats, tts, wav } from './lib.mjs';

const MODEL = process.argv[2] ?? 'gemini-3.8-flash-lite-tts';
const OUT = `samples-${MODEL}`;
mkdirSync(OUT, { recursive: true });

const TEXT = {
  en: "Hi! Let's look at what a prompt is. A prompt is just the instruction you give an AI tool, and a clear one gets a much better result.",
  fil: 'Hi! Tingnan natin kung ano ang prompt. Ang prompt ay ang instruction na ibinibigay mo sa AI tool, at kapag malinaw ito, mas maganda ang resulta. Subukan mong i-run ito sa Claude Code.',
};
const FEMALE = ['Kore', 'Leda', 'Aoede', 'Zephyr', 'Vindemiatrix', 'Sulafat', 'Despina', 'Erinome', 'Laomedeia', 'Autonoe'];
const MALE = ['Puck', 'Charon', 'Iapetus', 'Sadaltager', 'Achird', 'Orus', 'Zubenelgenubi', 'Sadachbia', 'Rasalgethi', 'Fenrir'];
const jobs = [...FEMALE.map((v) => ['F', v]), ...MALE.map((v) => ['M', v])].flatMap(([g, v]) => ['en', 'fil'].map((lang) => ({ g, voice: v, lang })));

async function one(job) {
  let r = await tts(MODEL, job.voice, TEXT[job.lang]);
  if (!r.ok) return { ...job, ok: false, status: r.status, error: r.error };
  const pcm = pcmOfWav(r.data);
  const file = `${OUT}/${job.g}-${job.voice}-${job.lang}.wav`;
  writeFileSync(file, wav(pcm));
  return { ...job, ok: true, file, latencyMs: r.ms, tokens: r.usage?.candidatesTokenCount, ...stats(pcm) };
}

const prior = existsSync(`${OUT}/results.json`) ? JSON.parse(readFileSync(`${OUT}/results.json`, 'utf8')).filter((r) => r.ok) : [];
const results = [...prior];
const todo = jobs.filter((job) => !prior.some((r) => r.g === job.g && r.voice === job.voice && r.lang === job.lang));
let next = 0;
// One at a time with a pause: the free tier allows only a few TTS requests a minute.
while (next < todo.length) {
  const job = todo[next++];
  let r = await one(job);
  if (!r.ok && r.status === 429) { await new Promise((x) => setTimeout(x, 35000)); r = await one(job); }
  results.push(r); process.stdout.write(r.ok ? '.' : 'x');
  await new Promise((x) => setTimeout(x, 4500));
}
console.log();
writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 1));
const failed = results.filter((r) => !r.ok);
console.log('ok', results.length - failed.length, 'failed', failed.length, failed.slice(0, 3));
