import { readFileSync, writeFileSync } from 'node:fs';
import { KEY } from './lib.mjs';

const DIR = process.argv[2];
const JUDGE = process.argv[3] ?? 'gemini-3.1-flash-lite';
const REF = {
  en: "Hi! Let's look at what a prompt is. A prompt is just the instruction you give an AI tool, and a clear one gets a much better result.",
  fil: 'Hi! Tingnan natin kung ano ang prompt. Ang prompt ay ang instruction na ibinibigay mo sa AI tool, at kapag malinaw ito, mas maganda ang resulta. Subukan mong i-run ito sa Claude Code.',
};
const words = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/-/g, ' ').split(/\s+/).filter(Boolean);
function wer(ref, hyp) {
  const a = words(ref), b = words(hyp);
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return +(d[a.length][b.length] / a.length).toFixed(2);
}
const SCHEMA = { type: 'OBJECT', properties: { transcript: { type: 'STRING' }, speakerGender: { type: 'STRING', enum: ['male', 'female', 'unclear'] }, speakerAge: { type: 'STRING' }, naturalness: { type: 'INTEGER' }, tone: { type: 'STRING' }, accentOrPronunciation: { type: 'STRING' } }, required: ['transcript', 'speakerGender', 'naturalness'] };

const results = JSON.parse(readFileSync(`${DIR}/results.json`, 'utf8'));
const out = [];
for (const item of results) {
  const audio = readFileSync(item.file).toString('base64');
  const prompt = `Listen to this clip. Transcribe it verbatim, exactly as spoken, without correcting or improving it. Then describe the speaker: gender (male/female/unclear), apparent age range, tone in 2-4 words, how natural it sounds as a friendly young teacher (naturalness 1 robotic to 10 indistinguishable from a person), and any odd or non-native pronunciation you notice (say "none" if none). The language is ${item.lang === 'fil' ? 'Filipino (Tagalog) mixed with English technical terms' : 'English'}.`;
  let verdict = null;
  for (let attempt = 0; attempt < 3 && !verdict; attempt++) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${JUDGE}:generateContent`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY }, body: JSON.stringify({ contents: [{ parts: [{ inlineData: { mimeType: 'audio/wav', data: audio } }, { text: prompt }] }], generationConfig: { temperature: 0, responseMimeType: 'application/json', responseSchema: SCHEMA } }) });
    if (r.status === 429) { await new Promise((x) => setTimeout(x, 20000)); continue; }
    const b = await r.json();
    try { verdict = JSON.parse(b.candidates[0].content.parts.map((p) => p.text).join('')); } catch { verdict = { error: r.status + ' ' + JSON.stringify(b).slice(0, 120) }; break; }
  }
  const row = { ...item, wer: verdict?.transcript ? wer(REF[item.lang], verdict.transcript) : null, ...verdict };
  out.push(row);
  process.stdout.write('.');
  await new Promise((x) => setTimeout(x, 1500));
}
console.log();
writeFileSync(`${DIR}/judged.json`, JSON.stringify(out, null, 1));
