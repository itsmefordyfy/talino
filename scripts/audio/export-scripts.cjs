/**
 * Writes what Listen reads for every lesson (`lessonScript`, src/features/courses/lib/plain-text.ts) to
 * scripts/audio/out/scripts/<lessonId>.txt, the same words cut into sentences (<lessonId>.segments.json), plus a manifest of lesson ids, titles and character counts.
 * The Kokoro generator (generate.py) turns these into audio. Run: node scripts/audio/export-scripts.cjs [lessonId ...]
 *
 * `--language fil` writes the Tagalog lessons instead (only courses with a complete translation, `content/fil/index.ts`) to
 * out/scripts-fil/, with Listen's own words in Tagalog too. Kokoro has no Filipino voice, so nothing records these any more (the Gemini pipeline that did is
 * in scripts/audio/archive-gemini/); the phone's own `fil-PH` voice reads Tagalog lessons.
 *
 * The app's code is TypeScript with "@/" imports, so it is transpiled on the fly with the project's own
 * `typescript` package; nothing is installed and nothing in src/ changes.
 */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..', '..');
const src = path.join(root, 'src');

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith('@/')) request = path.join(src, request.slice(2));
  return originalResolve.call(this, request, ...rest);
};
Module._extensions['.ts'] = function (module, filename) {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }, fileName: filename });
  module._compile(outputText, filename);
};
Module._extensions['.tsx'] = Module._extensions['.ts'];

const { COURSES } = require(path.join(src, 'features/courses/content/index.ts'));
const { lessonScript } = require(path.join(src, 'features/courses/lib/plain-text.ts'));
const { hashSegments, lessonSegments } = require(path.join(src, 'features/courses/lib/speech-segments.ts'));
const { FIL_COURSES } = require(path.join(src, 'features/courses/content/fil/index.ts'));

const args = process.argv.slice(2);
const languageAt = args.indexOf('--language');
const language = languageAt >= 0 ? args[languageAt + 1] : 'en';
if (language !== 'en' && language !== 'fil') throw new Error(`Unknown language: ${language}`);
const only = new Set(languageAt >= 0 ? args.filter((arg, index) => index !== languageAt && index !== languageAt + 1) : args);
const courses = language === 'fil' ? Object.values(FIL_COURSES) : COURSES;
const out = path.join(__dirname, 'out', language === 'en' ? 'scripts' : `scripts-${language}`);
fs.mkdirSync(out, { recursive: true });
const manifest = [];
for (const course of courses) {
  for (const lesson of course.lessons) {
    if (only.size && !only.has(lesson.id)) continue;
    const text = lessonScript(lesson, language).replace(/\n{3,}/g, '\n\n').trim();
    fs.writeFileSync(path.join(out, `${lesson.id}.txt`), `${text}\n`);
    // The same words cut into sentences (the app highlights and seeks by these): generate.py speaks them one at a time, so it knows exactly
    // when each starts and ends. `hash` ties a recording's timing file to these words.
    const segments = lessonSegments(lesson, language);
    fs.writeFileSync(path.join(out, `${lesson.id}.segments.json`), JSON.stringify({ hash: hashSegments(segments), segments: segments.map(({ text, pause }) => ({ text, pause })) }));
    manifest.push({ id: lesson.id, courseId: course.id, title: lesson.title, characters: text.length });
  }
}
fs.writeFileSync(path.join(out, '_manifest.json'), JSON.stringify(manifest, null, 1));
const total = manifest.reduce((sum, entry) => sum + entry.characters, 0);
console.log(`${language}: ${manifest.length} lessons, ${total} characters (about ${Math.round(total / 15 / 60)} minutes of speech at 15 characters a second)`);
