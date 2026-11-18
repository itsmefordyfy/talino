#!/usr/bin/env node
/**
 * Frees disk space: deletes local Kokoro recordings (out/audio/<voice>/<lessonId>.m4a, .timing.json, .peaks.json) that are safely in the R2 bucket.
 * A lesson's three files are deleted only when ALL three are in the bucket with exactly the same size (listed through the S3 API, the bucket
 * itself, not a public address). Anything else is kept and reported. Dry run unless `--delete` is given.
 *
 *   node --env-file=.env scripts/audio/free-local-audio.mjs                       what would be deleted (nothing is touched)
 *   node --env-file=.env scripts/audio/free-local-audio.mjs --delete              delete what is safely hosted
 *   node --env-file=.env scripts/audio/free-local-audio.mjs --delete --except=building-ai-agents --except=data-structures-algorithms
 *   node --env-file=.env scripts/audio/free-local-audio.mjs --delete am_puck      one voice
 *
 * Keep a course OUT of the deletion (`--except=<course>`) while it is still being generated: generate.py skips a lesson only when its local
 * recording and timing exist, so deleting finished lessons of a half-made course makes the next run record them all again (hours).
 * Deleting a hosted lesson's local copy is otherwise safe: the app reads the bucket, and a lesson whose text changes is recorded again anyway.
 * Needs the same R2_* lines in .env as upload-r2.mjs. Voices other than am_puck and af_heart (old experiments) are never touched here.
 */
import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('.', import.meta.url).pathname;
const AUDIO = join(ROOT, 'out', 'audio');
const args = process.argv.slice(2);
const doDelete = args.includes('--delete');
const except = args.filter((arg) => arg.startsWith('--except=')).map((arg) => arg.slice('--except='.length));
const voices = args.filter((arg) => !arg.startsWith('--'));
const useVoices = voices.length > 0 ? voices : ['am_puck', 'af_heart'];
const SUFFIXES = ['.m4a', '.timing.json', '.peaks.json'];

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET = 'talino-audio' } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Missing R2_ACCOUNT_ID, R2_ACCESS_KEY_ID or R2_SECRET_ACCESS_KEY in .env. See upload-r2.mjs.');
  process.exit(1);
}
const { S3Client, ListObjectsV2Command } = await import('@aws-sdk/client-s3');
const s3 = new S3Client({ region: 'auto', endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY } });

async function remoteSizes(voice) {
  const sizes = new Map();
  let token;
  do {
    const page = await s3.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: `${voice}/`, ContinuationToken: token }));
    for (const object of page.Contents ?? []) sizes.set(object.Key, object.Size ?? 0);
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return sizes;
}

const mb = (bytes) => (bytes / 1048576).toFixed(1);
let freed = 0;
let removedLessons = 0;
for (const voice of useVoices) {
  const folder = join(AUDIO, voice);
  if (!existsSync(folder)) continue;
  const remote = await remoteSizes(voice);
  const ids = new Set(readdirSync(folder).filter((name) => name.endsWith('.m4a')).map((name) => name.slice(0, -'.m4a'.length)));
  let kept = 0;
  let skipped = 0;
  let bytes = 0;
  let lessons = 0;
  for (const id of [...ids].sort()) {
    if (except.some((course) => id.startsWith(`${course}-`))) {
      skipped += 1;
      continue;
    }
    const files = SUFFIXES.map((suffix) => ({ file: join(folder, `${id}${suffix}`), key: `${voice}/${id}${suffix}` })).filter((entry) => existsSync(entry.file));
    const hosted = files.length >= 2 && files.every((entry) => remote.get(entry.key) === statSync(entry.file).size);
    if (!hosted) {
      kept += 1;
      console.log(`kept (not fully in the bucket): ${voice}/${id}`);
      continue;
    }
    for (const entry of files) {
      bytes += statSync(entry.file).size;
      if (doDelete) unlinkSync(entry.file);
    }
    lessons += 1;
  }
  freed += bytes;
  removedLessons += lessons;
  console.log(`${voice}: ${doDelete ? 'deleted' : 'would delete'} ${lessons} lessons (${mb(bytes)} MB); kept ${kept} not fully hosted; left ${skipped} in excepted courses.`);
}
console.log(`\n${doDelete ? 'Freed' : 'Would free'} ${mb(freed)} MB across ${removedLessons} lessons.${doDelete ? '' : ' Nothing was deleted: add --delete.'}`);
