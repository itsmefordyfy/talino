#!/usr/bin/env node
/**
 * Uploads the finished Kokoro recordings to a Cloudflare R2 bucket (S3-compatible), where store builds download them
 * (`EXPO_PUBLIC_AUDIO_ORIGIN=<R2_PUBLIC_URL>`; the app asks for `<origin>/<voice>/<lessonId>.m4a`, `.peaks.json` and `.timing.json`).
 * A lesson is sent only when it has its recording AND its timing (the rule generate.py uses); a file already there with the same size is
 * skipped, so it is safe to run again after each batch. Run it from the project root:
 *
 *   node --env-file=.env scripts/audio/upload-r2.mjs --plan          what is finished and how big it is (no network, no keys needed)
 *   node --env-file=.env scripts/audio/upload-r2.mjs --dry-run       list the bucket and say what would be sent (nothing is written)
 *   node --env-file=.env scripts/audio/upload-r2.mjs                 send everything finished, both voices
 *   node --env-file=.env scripts/audio/upload-r2.mjs am_puck         one voice
 *
 * Needs five lines in `.env` (gitignored; never in the app): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET (default
 * talino-audio) and R2_PUBLIC_URL (the bucket's public https address, no trailing slash). Its own `package.json` here holds the S3
 * client, so run `npm install` in scripts/audio once; nothing here ships in the app.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('.', import.meta.url).pathname;
const OUT = join(ROOT, 'out');
const args = process.argv.slice(2);
const plan = args.includes('--plan');
const dryRun = args.includes('--dry-run');
const voices = args.filter((arg) => !arg.startsWith('--'));
const useVoices = voices.length > 0 ? voices : ['am_puck', 'af_heart'];
const ids = JSON.parse(readFileSync(join(OUT, 'scripts/_manifest.json'), 'utf8')).map((entry) => entry.id);
const SUFFIXES = ['.m4a', '.timing.json', '.peaks.json'];
const TYPES = { '.m4a': 'audio/mp4', '.json': 'application/json' };

/** Every finished lesson (recording and timing both there): { key, file, size }. */
function finished() {
  const files = [];
  for (const voice of useVoices) {
    for (const id of ids) {
      const base = join(OUT, 'audio', voice, id);
      if (!existsSync(`${base}.m4a`) || !existsSync(`${base}.timing.json`)) continue;
      for (const suffix of SUFFIXES) {
        const file = `${base}${suffix}`;
        if (existsSync(file)) files.push({ key: `${voice}/${id}${suffix}`, file, size: statSync(file).size, voice });
      }
    }
  }
  return files;
}

const mb = (bytes) => (bytes / 1048576).toFixed(1);
const files = finished();

if (plan) {
  for (const voice of useVoices) {
    const mine = files.filter((entry) => entry.voice === voice);
    const lessons = mine.filter((entry) => entry.key.endsWith('.m4a')).length;
    console.log(`${voice}: ${lessons} finished lessons, ${mine.length} files, ${mb(mine.reduce((sum, entry) => sum + entry.size, 0))} MB`);
  }
  console.log(`\nTotal: ${files.length} files, ${mb(files.reduce((sum, entry) => sum + entry.size, 0))} MB (R2's free allowance is about 10 GB of storage).`);
  process.exit(0);
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET = 'talino-audio', R2_PUBLIC_URL } = process.env;
const missing = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL'].filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing in .env: ${missing.join(', ')}. See the note at the top of this script.`);
  process.exit(1);
}
if (!/^https:\/\//.test(R2_PUBLIC_URL)) {
  console.error('R2_PUBLIC_URL must be an https address (a store build refuses plain http).');
  process.exit(1);
}

const { S3Client, ListObjectsV2Command, PutObjectCommand } = await import('@aws-sdk/client-s3');
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

/** What the bucket holds under each voice: key -> size in bytes. */
async function remoteSizes() {
  const sizes = new Map();
  for (const voice of useVoices) {
    let token;
    do {
      const page = await s3.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: `${voice}/`, ContinuationToken: token }));
      for (const object of page.Contents ?? []) sizes.set(object.Key, object.Size ?? 0);
      token = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (token);
  }
  return sizes;
}

const remote = await remoteSizes();
const todo = files.filter((entry) => remote.get(entry.key) !== entry.size);
const bytes = todo.reduce((sum, entry) => sum + entry.size, 0);
console.log(`${files.length} finished files, ${files.length - todo.length} already there, ${todo.length} to send (${mb(bytes)} MB).`);
if (dryRun || todo.length === 0) process.exit(0);

let sent = 0;
let failed = 0;
const queue = [...todo];
async function worker() {
  for (let entry = queue.shift(); entry; entry = queue.shift()) {
    const type = TYPES[entry.file.slice(entry.file.lastIndexOf('.'))] ?? 'application/octet-stream';
    try {
      await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: entry.key, Body: readFileSync(entry.file), ContentType: type, CacheControl: 'public, max-age=86400' }));
      sent += 1;
      if (sent % 50 === 0) console.log(`sent ${sent} of ${todo.length}`);
    } catch (error) {
      failed += 1;
      console.error(`failed ${entry.key}: ${error instanceof Error ? error.message : error}`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`\nSent ${sent} files, ${failed} failed.`);

// One look from outside: the public address must serve what was just stored, or phones will get nothing.
const sample = files.find((entry) => entry.key.endsWith('.m4a'));
if (sample) {
  const response = await fetch(`${R2_PUBLIC_URL.replace(/\/+$/, '')}/${sample.key}`, { method: 'HEAD' }).catch(() => null);
  console.log(response?.ok ? `Public check: ${R2_PUBLIC_URL}/${sample.key} answers ${response.status}.` : `Public check FAILED for ${sample.key} (${response?.status ?? 'no answer'}): the bucket's public access or domain isn't set up yet.`);
}
console.log(`EXPO_PUBLIC_AUDIO_ORIGIN=${R2_PUBLIC_URL.replace(/\/+$/, '')}`);
process.exit(failed > 0 ? 1 : 0);
