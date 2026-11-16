#!/usr/bin/env node
/**
 * Builds a signed Android App Bundle for Google Play (and, with --apk, an installable APK for
 * direct testing), bumping the version first.
 *
 *   npm run release:android            keeps the version name, versionCode +1: 1.0 (3) → 1.0 (4)
 *   npm run release:android -- minor   1.0 → 1.1, versionCode +1
 *   npm run release:android -- major   1.4 → 2.0, versionCode +1
 *   npm run release:android -- --apk   also builds app-release.apk (same version and signing)
 *
 * The very first release (no versionCode in app.json yet) keeps the version name and uses
 * versionCode 1. Play rejects a versionCode it has already seen, so it only ever goes up; if the
 * build fails, app.json is put back so no number is skipped. (The same script as Pawfetti's,
 * CarMind's and Ulamin's; the upload key properties are <SLUG>_UPLOAD_*, from the app's slug, as
 * plugins/with-release-signing.js reads them. Server, RevenueCat and Sentry checks run only when
 * the app has src/app/api, react-native-purchases or @sentry/react-native.)
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const APP_JSON = join(ROOT, 'app.json');
const GRADLE_PROPERTIES = join(homedir(), '.gradle', 'gradle.properties');
const AAB = join(ROOT, 'android/app/build/outputs/bundle/release/app-release.aab');
const APK = join(ROOT, 'android/app/build/outputs/apk/release/app-release.apk');

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function run(command, cwd = ROOT) {
  execSync(command, { cwd, stdio: 'inherit', env: { ...process.env, EXPO_NO_GIT_STATUS: '1' } });
}

// ---------- Checks before anything changes ----------

const args = process.argv.slice(2);
const apk = args.includes('--apk');
const bump = args.find((arg) => !arg.startsWith('--')) ?? 'same';
if (!['same', 'minor', 'major'].includes(bump)) fail(`Unknown bump "${bump}". Use minor or major (or nothing, to keep the version).`);

const original = readFileSync(APP_JSON, 'utf8');
const config = JSON.parse(original).expo;
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const hasDependency = (name) => Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);

// The upload key lives outside the repo: its path, alias and passwords are in ~/.gradle/gradle.properties.
const prefix = `${String(config.slug).toUpperCase().replace(/[^A-Z0-9]/g, '_')}_UPLOAD`;
if (!existsSync(GRADLE_PROPERTIES)) fail(`${GRADLE_PROPERTIES} is missing: it holds the upload key's path and passwords (see docs/BUILD_AND_RELEASE.md).`);
const gradleProperties = readFileSync(GRADLE_PROPERTIES, 'utf8');
const storeFile = gradleProperties.match(new RegExp(`^${prefix}_STORE_FILE=(.+)$`, 'm'))?.[1]?.trim();
if (!storeFile) fail(`${prefix}_STORE_FILE is not set in ${GRADLE_PROPERTIES} (see docs/BUILD_AND_RELEASE.md).`);
if (!existsSync(storeFile)) fail(`The upload keystore isn't at ${storeFile}.`);
for (const name of [`${prefix}_KEY_ALIAS`, `${prefix}_STORE_PASSWORD`, `${prefix}_KEY_PASSWORD`]) {
  if (!new RegExp(`^${name}=\\S+`, 'm').test(gradleProperties)) fail(`${name} is not set in ${GRADLE_PROPERTIES}.`);
}

// Server routes (src/app/api): a release without EXPO_PUBLIC_API_ORIGIN can't reach the deployed server.
const productionEnv = join(ROOT, '.env.production.local');
const productionText = existsSync(productionEnv) ? readFileSync(productionEnv, 'utf8') : '';
if (existsSync(join(ROOT, 'src/app/api'))) {
  const apiOrigin = productionText.match(/^EXPO_PUBLIC_API_ORIGIN=(https:\/\/\S+)$/m)?.[1];
  if (!apiOrigin) fail('EXPO_PUBLIC_API_ORIGIN (https://…) is not set in .env.production.local: the app would not reach its server routes in this build. Deploy them (docs/BUILD_AND_RELEASE.md) and add their URL.');
}

// Pro is sold through RevenueCat's Google Play app, whose public SDK key starts with goog_. A Test
// Store key (test_) crashes a release build on purpose.
if (hasDependency('react-native-purchases')) {
  const revenueCatKey = productionText.match(/^EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=(\S*)$/m)?.[1];
  if (!revenueCatKey?.startsWith('goog_')) fail(`EXPO_PUBLIC_REVENUECAT_ANDROID_KEY in .env.production.local must be RevenueCat's Google Play public SDK key (goog_…, RevenueCat → Project settings → API keys). ${revenueCatKey ? `It is "${revenueCatKey.slice(0, 5)}…".` : 'It is not set.'}`);
}

// ---------- Bump the version ----------

if (!config.android?.package) fail('Set expo.android.package in app.json first.');

const currentCode = config.android?.versionCode;
const firstRelease = currentCode === undefined;
// Two-part versions (major.minor).
const [major, minor] = config.version.split('.').map(Number);
const version = firstRelease || bump === 'same' ? config.version : bump === 'major' ? `${major + 1}.0` : `${major}.${minor + 1}`;
const versionCode = firstRelease ? 1 : currentCode + 1;

// Only the two lines change, so the rest of app.json keeps its formatting.
let updated = original.replace(/^( {4}"version": )"[^"]+"/m, `$1"${version}"`);
updated = firstRelease
  ? updated.replace(/^( {6}"package": "[^"]+",\n)/m, `$1      "versionCode": ${versionCode},\n`)
  : updated.replace(/^( {6}"versionCode": )\d+/m, `$1${versionCode}`);
if (!updated.includes(`"versionCode": ${versionCode}`)) fail('Could not update versionCode in app.json.');
writeFileSync(APP_JSON, updated);
// Every new version shows its "What's new" once to each person (features/whats-new), so a new version needs its notes first:
// an entry in src/features/whats-new/lib/release-notes.ts (and its words in strings.ts). Without one the sheet stays empty.
if (version !== config.version) {
  const notes = readFileSync(join(ROOT, 'src/features/whats-new/lib/release-notes.ts'), 'utf8');
  if (!new RegExp(`^\\s*'${version.replace('.', '\\.')}': \\[`, 'm').test(notes)) {
    fail(`Version ${version} has no release notes. Add '${version}' to RELEASE_NOTES (src/features/whats-new/lib/release-notes.ts) and its words in src/features/whats-new/strings.ts, update assets/store/app-store/WHATS_NEW.md, then run this again.`);
  }
}

console.log(`\n${config.name} ${version} (versionCode ${versionCode})\n`);

// ---------- Build ----------

// Sentry reports only from store builds: the marker goes into this build's bundle, and the bundle
// is checked for it below (only when the app uses Sentry).
process.env.EXPO_PUBLIC_STORE_BUILD = `store-build-${versionCode}`;

try {
  run('npx expo prebuild --platform android --clean --no-install');
  run(`./gradlew bundleRelease${apk ? ' assembleRelease' : ''}`, join(ROOT, 'android'));
} catch {
  writeFileSync(APP_JSON, original);
  fail(`The build failed, so app.json is back to ${config.version}${firstRelease ? '' : ` (versionCode ${currentCode})`}.`);
}

// The AAB's JavaScript must carry this build's store marker, or Sentry would stay off in it.
if (hasDependency('@sentry/react-native')) {
  const bundle = execSync(`unzip -p "${AAB}" base/assets/index.android.bundle`, { maxBuffer: 512 * 1024 * 1024 }).toString('latin1');
  if (!bundle.includes(process.env.EXPO_PUBLIC_STORE_BUILD)) {
    writeFileSync(APP_JSON, original);
    fail(`The bundle has no store-build marker (${process.env.EXPO_PUBLIC_STORE_BUILD}), so Sentry would stay off. Stop Gradle (cd android && ./gradlew --stop) and run this again; app.json is back to ${config.version}.`);
  }
}

console.log(`
✔ Signed bundle: ${AAB}${apk ? `\n✔ Signed APK:    ${APK}` : ''}

Next:
  1. Upload the .aab in Play Console → Test and release (internal testing first).
  2. Commit the new version:  git commit -am "Release Android ${version} (${versionCode})"
`);
