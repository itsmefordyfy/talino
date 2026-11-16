#!/usr/bin/env node
/**
 * Archives the app for the App Store and uploads it to App Store Connect (TestFlight), bumping
 * the version first. Signing uses the Apple account signed in to Xcode (Settings → Accounts).
 *
 *   npm run release:ios                  keeps the version, build number +1: 1.0 (3) → 1.0 (4)
 *   npm run release:ios -- minor         1.0 → 1.1, build number +1
 *   npm run release:ios -- major         1.4 → 2.0, build number +1
 *   npm run release:ios -- --no-upload   archives only, and opens it in Xcode's Organizer
 *   npm run release:ios -- --dry-run     shows the next version and changes nothing
 *   npm run release:ios -- --without-keys   skips the server-URL and RevenueCat-key checks (first test build only)
 *
 * The very first release (no ios.buildNumber in app.json yet) keeps the version and uses build 1.
 * Every TestFlight upload can share a version; only the build number goes up (App Store Connect
 * rejects one it has seen for that version). Once a version is live on the App Store, Apple closes
 * it, so the next update needs minor or major.
 * If the archive fails, app.json is put back so no number is skipped. (The same script as
 * Pawfetti's, CarMind's and Ulamin's, minus their server, RevenueCat and Sentry checks: those run
 * here only when the app depends on react-native-purchases / @sentry/react-native, so Talino has
 * nothing to configure until it adds them.)
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const APP_JSON = join(ROOT, 'app.json');
const EXPORT_DIR = join(ROOT, 'ios/build/export');

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function run(command, cwd = ROOT) {
  execSync(command, { cwd, stdio: 'inherit', env: { ...process.env, EXPO_NO_GIT_STATUS: '1' } });
}

/**
 * Whether a real iOS build or pod install is running. Matches the programs themselves, not any process whose command line merely
 * mentions them (a shell waiting on a build, as an editor or an assistant leaves behind, contains "xcodebuild" and used to block this).
 */
function busy() {
  const running = (command) => {
    try {
      execSync(command, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  };
  return running('pgrep -x xcodebuild') || running('pgrep -f "/pod install"') || running('pgrep -f "/expo run:ios"');
}

// ---------- Checks before anything changes ----------

const args = process.argv.slice(2);
const upload = !args.includes('--no-upload');
const dryRun = args.includes('--dry-run');
// A first TestFlight build before the server and RevenueCat exist: skips those two checks (the app then shows server features as
// unavailable and sells nothing). Never for a build people pay for.
const withoutKeys = args.includes('--without-keys');
const bump = args.find((arg) => !arg.startsWith('--')) ?? 'same';
if (!['same', 'minor', 'major'].includes(bump)) fail(`Unknown bump "${bump}". Use minor or major (or nothing, to keep the version).`);

// Two builds at once (this app's, Pawfetti's, CarMind's or Ulamin's) corrupt each other's Pods cache and DerivedData.
if (!dryRun && busy()) fail('Another iOS build or pod install is running. Wait for it to finish, then run this again.');

const original = readFileSync(APP_JSON, 'utf8');
const config = JSON.parse(original).expo;
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const hasDependency = (name) => Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);

// Server routes (src/app/api): a release without EXPO_PUBLIC_API_ORIGIN can't reach the deployed server.
const productionEnv = join(ROOT, '.env.production.local');
const productionText = existsSync(productionEnv) ? readFileSync(productionEnv, 'utf8') : '';
if (!withoutKeys && existsSync(join(ROOT, 'src/app/api'))) {
  const apiOrigin = productionText.match(/^EXPO_PUBLIC_API_ORIGIN=(https:\/\/\S+)$/m)?.[1];
  if (!apiOrigin) fail('EXPO_PUBLIC_API_ORIGIN (https://…) is not set in .env.production.local: the app would not reach its server routes in this build. Deploy them (docs/BUILD_AND_RELEASE.md) and add their URL.');
}

// Pro is sold through RevenueCat's App Store app, whose public SDK key starts with appl_. A Test
// Store key (test_) crashes a release build on purpose.
const revenueCat = hasDependency('react-native-purchases');
const revenueCatKey = productionText.match(/^EXPO_PUBLIC_REVENUECAT_IOS_KEY=(\S*)$/m)?.[1];
if (!withoutKeys && revenueCat && !revenueCatKey?.startsWith('appl_')) fail(`EXPO_PUBLIC_REVENUECAT_IOS_KEY in .env.production.local must be RevenueCat's App Store public SDK key (appl_…, RevenueCat → Project settings → API keys). ${revenueCatKey ? `It is "${revenueCatKey.slice(0, 5)}…".` : 'It is not set.'}`);

// ---------- Bump the version ----------

const teamId = config.ios?.appleTeamId;
if (!teamId) fail('Set expo.ios.appleTeamId in app.json first.');
if (!config.ios?.bundleIdentifier) fail('Set expo.ios.bundleIdentifier in app.json first.');

const currentBuild = config.ios?.buildNumber;
const firstRelease = currentBuild === undefined;
// Two-part versions (major.minor).
const [major, minor] = config.version.split('.').map(Number);
const version = firstRelease || bump === 'same' ? config.version : bump === 'major' ? `${major + 1}.0` : `${major}.${minor + 1}`;
const buildNumber = String(firstRelease ? 1 : Number(currentBuild) + 1);

// Every new version shows its "What's new" once to each person (features/whats-new), so a new version needs its notes first:
// an entry in src/features/whats-new/lib/release-notes.ts (and its words in strings.ts). Without one the sheet stays empty.
if (version !== config.version) {
  const notes = readFileSync(join(ROOT, 'src/features/whats-new/lib/release-notes.ts'), 'utf8');
  if (!new RegExp(`^\\s*'${version.replace('.', '\\.')}': \\[`, 'm').test(notes)) {
    fail(`Version ${version} has no release notes. Add '${version}' to RELEASE_NOTES (src/features/whats-new/lib/release-notes.ts) and its words in src/features/whats-new/strings.ts, update assets/store/app-store/WHATS_NEW.md, then run this again.`);
  }
}

console.log(`\n${config.name} iOS ${version} (build ${buildNumber}), was ${config.version} (build ${currentBuild ?? 'none'})\n`);
if (dryRun) process.exit(0);

// Only the two lines change, so the rest of app.json keeps its formatting.
let updated = original.replace(/^( {4}"version": )"[^"]+"/m, `$1"${version}"`);
updated = firstRelease
  ? updated.replace(/^( {6}"bundleIdentifier": "[^"]+",\n)/m, `$1      "buildNumber": "${buildNumber}",\n`)
  : updated.replace(/^( {6}"buildNumber": )"[^"]*"/m, `$1"${buildNumber}"`);
if (!updated.includes(`"buildNumber": "${buildNumber}"`)) fail('Could not update ios.buildNumber in app.json.');
writeFileSync(APP_JSON, updated);

// ---------- Archive ----------

// Where Xcode keeps its own archives, so this one shows up in Window → Organizer.
const day = new Date().toISOString().slice(0, 10);
const archivesDir = join(homedir(), 'Library/Developer/Xcode/Archives', day);
const archivePath = join(archivesDir, `${config.name} ${version} (${buildNumber}).xcarchive`);

let archived = false;
try {
  // A clean ios/ with pod install, so the archive matches app.json and every config plugin.
  run('npx expo prebuild --platform ios --clean');
  // Expo names the workspace and the scheme after the app; read them rather than guess the spelling.
  const workspaceName = readdirSync(join(ROOT, 'ios')).find((name) => name.endsWith('.xcworkspace'));
  if (!workspaceName) throw new Error('prebuild produced no .xcworkspace in ios/.');
  const scheme = workspaceName.replace(/\.xcworkspace$/, '');
  // Sentry reports only from store builds: the marker goes into this build's bundle, and the bundle
  // is checked for it below (only when the app uses Sentry).
  process.env.EXPO_PUBLIC_STORE_BUILD = `store-build-${buildNumber}`;
  mkdirSync(archivesDir, { recursive: true });
  run(
    `xcodebuild -workspace "${join(ROOT, 'ios', workspaceName)}" -scheme ${scheme} -configuration Release ` +
      `-destination "generic/platform=iOS" -archivePath "${archivePath}" -allowProvisioningUpdates archive`,
  );
  // What ships is the bundle, not the env file.
  const bundle = readFileSync(join(archivePath, `Products/Applications/${scheme}.app/main.jsbundle`)).toString('latin1');
  if (revenueCat) {
    if (!bundle.includes(revenueCatKey)) throw new Error('The archived bundle has no RevenueCat App Store key.');
    const localEnv = join(ROOT, '.env.local');
    const testKey = existsSync(localEnv) ? readFileSync(localEnv, 'utf8').match(/^EXPO_PUBLIC_REVENUECAT_TEST_KEY=(test_\S+)$/m)?.[1] : undefined;
    if (bundle.includes('Mock store:') || (testKey && bundle.includes(testKey))) throw new Error('The archived bundle contains the mock store or the Test Store key.');
  }
  if (hasDependency('@sentry/react-native') && !bundle.includes(process.env.EXPO_PUBLIC_STORE_BUILD)) {
    throw new Error('The archived bundle has no store-build marker, so Sentry would stay off.');
  }
  archived = true;
} catch (error) {
  // Reported below, once ios/ is back to development.
  if (error instanceof Error && !('status' in error)) console.error(`\n✖ ${error.message}`);
}

// A Release build swaps the prebuilt React Native core, its dependencies and Expo's precompiled
// modules in ios/Pods to their release copies, and their markers can come back saying "debug"
// (2026-10-17): the next `npm run ios` then mixed debug and release code and failed to link
// (Sealable symbols) or crashed at launch (Props layout). A fresh ios/ puts the debug copies back;
// the archive (and its upload) doesn't need ios/ any more.
try {
  run('npx expo prebuild --platform ios --clean');
} catch {
  console.warn('\n⚠ ios/ couldn’t be reset for development. Run `npx expo prebuild --platform ios --clean` before `npm run ios`.\n');
}

if (!archived) {
  writeFileSync(APP_JSON, original);
  fail(`The archive failed, so app.json is back to ${config.version}${firstRelease ? '' : ` (build ${currentBuild})`}.`);
}

if (!upload) {
  run(`open "${archivePath}"`);
  console.log(`
✔ Archived: ${archivePath}

Next:
  1. In Xcode's Organizer (now open), select it → Distribute App → App Store Connect.
  2. Commit the new version:  git commit -am "Release iOS ${version} (${buildNumber})"
`);
  process.exit(0);
}

// ---------- Upload to App Store Connect ----------

const exportOptions = join(ROOT, 'ios/build/ExportOptions.plist');
mkdirSync(EXPORT_DIR, { recursive: true });
writeFileSync(
  exportOptions,
  `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key><string>app-store-connect</string>
  <key>destination</key><string>upload</string>
  <key>teamID</key><string>${teamId}</string>
  <key>signingStyle</key><string>automatic</string>
  <key>uploadSymbols</key><true/>
  <key>manageAppVersionAndBuildNumber</key><false/>
</dict>
</plist>
`,
);

try {
  run(`xcodebuild -exportArchive -archivePath "${archivePath}" -exportOptionsPlist "${exportOptions}" -exportPath "${EXPORT_DIR}" -allowProvisioningUpdates`);
} catch {
  // The archive is fine and Apple never saw this build number, so the bump stays.
  run(`open "${archivePath}"`);
  fail(`The upload failed. If Apple says the version is closed, ${version} is already on the App Store: run this
  again with minor (or major). Otherwise the archive is in Xcode's Organizer (now open): select it →
  Distribute App → App Store Connect.
  (The app must exist in App Store Connect first, with bundle ID ${config.ios.bundleIdentifier}.)
  Then commit the new version:  git commit -am "Release iOS ${version} (${buildNumber})"`);
}

console.log(`
✔ Uploaded ${config.name} ${version} (${buildNumber}) to App Store Connect.

Next:
  1. Wait for Apple's processing email (about 10–30 minutes), then it appears in TestFlight.
  2. Commit the new version:  git commit -am "Release iOS ${version} (${buildNumber})"
`);
