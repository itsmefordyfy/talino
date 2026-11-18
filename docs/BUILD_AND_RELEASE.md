# Running and releasing Talino

The same setup as Pawfetti, CarMind, Ulamin and Bubblie: development builds run locally, and releases are
built on this Mac: `npm run release:android` for Google Play, `npm run release:ios` for App Store
Connect (EAS works too, see the end).

## Running the app on the iPhone 18 Pro

```bash
npm install
npm run ios        # builds the iOS development build on the iPhone 18 Pro simulator, starts Metro
npm run android    # the same for the Android emulator or a connected phone
```

After the first build, `npx expo start` is enough to work on JavaScript: open the installed
development build and it connects to Metro. Once the app uses native modules Expo Go doesn't
bundle, always use the development build.

**Changed native config** (app.json, a config plugin, icons, splash, fonts): `ios/` and `android/`
are generated (CNG) and gitignored, and `expo run:*` reuses an existing folder without re-applying
app.json. Regenerate first:

```bash
npx expo prebuild --platform ios --no-install      # or --platform android
npm run ios
```

**Release-like builds** (no dev tools, minified, as users get it):

```bash
npm run ios:prod
npm run android:prod
```

Never run two native builds at once (this app's or another of the owner's apps): Xcode's
DerivedData gets corrupted. If it happens, delete `~/Library/Developer/Xcode/DerivedData/talino-*`.

## Before any release

```bash
npm run check        # lint, typecheck
npx expo-doctor
```

## Android: Google Play

### One-time setup

1. The upload key lives outside the repo at `~/keys/talino-upload.keystore` (alias `talino`).
   **Back up the keystore and its password**: a lost upload key has to be reset through Play
   support.

   ```bash
   mkdir -p ~/keys
   keytool -genkeypair -v -storetype PKCS12 -keystore ~/keys/talino-upload.keystore \
     -alias talino -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Its path, alias and passwords go in `~/.gradle/gradle.properties` (never in the repo; the prefix
   is the app's slug in capitals):

   ```properties
   TALINO_UPLOAD_STORE_FILE=/Users/<you>/keys/talino-upload.keystore
   TALINO_UPLOAD_KEY_ALIAS=talino
   TALINO_UPLOAD_STORE_PASSWORD=...
   TALINO_UPLOAD_KEY_PASSWORD=...
   ```

   `plugins/with-release-signing.js` signs release builds with it; without these lines, release
   builds keep the template's debug signing (and Play rejects them).

3. In Play Console, create the app with package `com.fordytechsolutions.talino` and let Google
   manage the app signing key (Play App Signing); this key only uploads.

### Each release

```bash
npm run release:android            # same version, versionCode +1: 1.0 (3) → 1.0 (4)
npm run release:android -- minor   # 1.0 → 1.1, versionCode +1
npm run release:android -- major   # 1.4 → 2.0, versionCode +1
npm run release:android -- --apk   # also an installable APK for direct testing
```

It bumps the version in app.json, regenerates `android/`, and builds a signed, minified bundle
(R8, through expo-build-properties; `plugins/with-gradle-memory.js` gives Gradle the heap R8
needs). If the build fails, app.json goes back, so no versionCode is skipped. Then:

1. Upload `android/app/build/outputs/bundle/release/app-release.aab` in Play Console → Test and
   release (internal testing first, then production). With `--apk`, the APK is at
   `android/app/build/outputs/apk/release/app-release.apk` (`adb install` it on any phone).
2. Commit the version: `git commit -am "Release Android 1.0 (2)"`.

## iOS: App Store

### On this Mac

One-time setup: sign in to Xcode with the developer account (Xcode → Settings → Accounts, team
`M225MU29H3`), and create the app in App Store Connect with bundle ID
`com.fordytechsolutions.talino`. Signing is automatic.

```bash
npm run release:ios                  # same version, build number +1: 1.0 (3) → 1.0 (4)
npm run release:ios -- minor         # 1.0 → 1.1, build number +1
npm run release:ios -- major         # 1.4 → 2.0, build number +1
npm run release:ios -- --no-upload   # archive only, opens it in Xcode's Organizer
npm run release:ios -- --dry-run     # shows the next version, changes nothing
```

It bumps the version and `ios.buildNumber` in app.json, regenerates `ios/` with pods, archives (it
shows up in Xcode's Organizer) and uploads to App Store Connect. The first release keeps the
version and uses build 1. Versions are two-part (major.minor); every upload can share one until
it's live on the App Store, where Apple closes it, so the next update needs `minor` (or `major`).
If the archive fails, app.json goes back; if only the upload fails, the archive opens in the
Organizer to upload by hand (Distribute App → App Store Connect). Then commit the version:
`git commit -am "Release iOS 1.0 (2)"`.

It refuses to start while another iOS build or `pod install` runs: two at once corrupt the Pods
cache and DerivedData.

### Through EAS (no local signing setup)

```bash
npx eas-cli@latest init                                         # once: links the project to EAS
npx eas-cli@latest build --platform ios --profile production    # signs and builds in the cloud
npx eas-cli@latest submit --platform ios                        # uploads to App Store Connect
```

EAS keeps the iOS build number itself (`appVersionSource: remote`, `autoIncrement`). Bump
`expo.version` in app.json for a new App Store version.

## iPad (universal app, 2026-11-16)

`app.json` sets `ios.supportsTablet: true` and `requireFullScreen: false`, so the next iOS build is a universal app (iPhone stays
portrait, iPad rotates). Before submitting: a prebuild and native rebuild (`npm run prebuild:ios`; `expo prebuild` wipes `ios/` including
`Pods/`, so run `pod install` in `ios/` after it), and **13-inch iPad screenshots in App Store Connect** (required once a build supports
iPad). The 12.9" / 13" set is enough; the smaller sizes scale from it. A Watch build (`TALINO_WATCH=1`) is unaffected.

## Environment variables

`EXPO_PUBLIC_*` values (bundled into the app, not secret) go in `.env.local` for development and
`.env.production.local` for local release builds; server-only secrets (for Expo API routes) in
`.env`. All three are gitignored. For EAS builds, set them in EAS:
`npx eas-cli@latest env:create --environment production --name NAME --visibility secret`.

## Quick reference: npm scripts

| Script | What it does |
|---|---|
| `npm run ios` / `npm run android` | Development build on the iPhone 18 Pro simulator / Android emulator, starts Metro |
| `npm run ios:prod` / `npm run android:prod` | Release-like local build (no dev tools, minified) |
| `npm run ios:watch` | Regenerates `ios/` with the Apple Watch targets (`TALINO_WATCH=1`), then the iPhone development build |
| `npm run prebuild:ios` / `npm run prebuild:android` | Regenerates `ios/` or `android/` from app.json after a native config change |
| `npm run check` | Lint and typecheck (and tests, once Jest is set up) |
| `npm run doctor` | `expo-doctor` |
| `npm run release:ios` | Archive and upload to App Store Connect (phone app only); add `-- minor` / `-- major` |
| `npm run release:ios:watch` | The same with the Apple Watch app included |
| `npm run release:android` / `npm run release:android:apk` | Signed .aab for Play Console (the second also builds an APK) |

## Apple Watch app

**Built 2026-11-16 (v1: glance, complication, Listen remote; spec `docs/superpowers/specs/2026-11-16-apple-watch-design.md`).** The switch: `app.config.js` adds `@bacons/apple-targets` (targets in
`targets/watch` and `targets/watch-widget`, as in CarMind, Ulamin and Bubblie) only when
`TALINO_WATCH=1` is set at prebuild, so the App Store build you make without it is the phone app alone.

1. **Apple Developer → Identifiers:** register `com.fordytechsolutions.talino.watchkitapp` and
   `com.fordytechsolutions.talino.watchkitapp.widget`, and give both the App Group `group.com.fordytechsolutions.talino`.
2. **Development:** `npm run ios:watch` (or `TALINO_WATCH=1 npx expo prebuild --platform ios`, then
   `npx expo run:ios --no-bundler` with Metro already up). Build just the Watch app with
   `xcodebuild -project ios/<App>.xcodeproj -target <WatchTarget> -sdk watchsimulator -configuration Debug build`
   (not `-scheme`: the scheme name can resolve to a pod) and install it with
   `xcrun simctl install <watch udid> ios/build/Debug-watchsimulator/<WatchTarget>.app`.
3. **Release:** `npm run release:ios:watch` (the release script runs `prebuild --clean`, which would otherwise drop the
   Watch targets). A plain `npm run release:ios` ships the phone app alone.
4. **A paired simulator pair that shows the red "iPhone not connected" icon:** restart the phone simulator's
   WatchConnectivity daemon (`xcrun simctl spawn <phone udid> launchctl kickstart -k user/501/com.apple.wcd`),
   relaunch the phone app, then the Watch app.
5. **Looking at the Watch without a phone:** launch the Watch app with `-snapshotb64 <base64 of a snapshot JSON>` (and `-scrollTo goal|next|footer`), DEBUG builds only.

## iCloud and Android backup setup

Talino needs no account. Its learning data stays in SQLite on the phone, and `src/features/backup` keeps a
versioned snapshot of it (`*.talino-backup`, a JSON file: [BACKUP_FORMAT.md](BACKUP_FORMAT.md)) so a lost phone does not
lose the learner's progress. How that snapshot gets off the phone differs by platform.

### iPhone: iCloud Drive (automatic)

The native module `modules/icloud-backup` copies each snapshot into the app's own iCloud container, and iCloud Drive
uploads it. `app.json` already carries what the app needs (`ios.usesIcloudStorage`, and `NSUbiquitousContainers` for
`iCloud.com.fordytechsolutions.talino`). **One-time steps for the owner, in the Apple Developer portal:**

1. Certificates, Identifiers & Profiles → Identifiers → **iCloud Containers** → add `iCloud.com.fordytechsolutions.talino`.
2. Identifiers → the App ID `com.fordytechsolutions.talino` → enable **iCloud** (include **iCloud Documents**, not just
   key-value storage) and tick the container above. Save, then regenerate or refresh the provisioning profile
   (EAS does this by itself on the next build; a local build needs Xcode's "Automatically manage signing" to refresh).
3. If the Apple Watch build is used (`TALINO_WATCH=1`), the Watch App IDs do not need iCloud.
4. Prebuild and rebuild the native app (`npm run prebuild:ios`, then `npm run ios` or a release): the entitlement and the
   native module only exist after a prebuild. A build made before this change has no iCloud module; the app then shows
   "iCloud backup isn't available", keeps its snapshots on the phone, and never claims a cloud backup.

### Lock Screen goal card (Live Activity)

`expo-widgets` (plugin in `app.json`) adds a small widget extension that draws the daily-goal Live Activity. **One-time steps for the
owner:** register the App ID `com.fordytechsolutions.talino.widgets` with the App Group `group.com.fordytechsolutions.talino` (the same
group the Watch uses); `release:ios` runs `prebuild --clean` and signs the extension with `-allowProvisioningUpdates`. Then prebuild and
rebuild natively; a build made before this has no extension and simply shows no card. After installing or changing the layout, restart
Metro with `npx expo start --dev-client -c`, otherwise the layout stays a function and the card is skipped (a dev warning says so).

The learner must be signed in to iCloud with iCloud Drive on for Talino (Settings → [name] → iCloud → Drive → Talino).
The screen says so when it is off. A backup counts as done only after iCloud confirms the upload; until then it is shown
as waiting.

### Android: system Auto Backup (automatic, by the system)

`plugins/with-android-backup.js` turns on Android's Auto Backup and limits it to the folder `files/backups/`, where the
app writes its newest three snapshots. The live database is deliberately **not** backed up, so Android can never put a
raw database file over a newer app: after a reinstall or a new phone the app finds the restored snapshot and **merges**
it in (the same rules as every restore). Android cannot tell the app whether a backup ran or whether Backup is on, so
the screen says "snapshot saved on this phone; Android backs it up on its own schedule if Backup is on (Settings →
Google → All services → Backup)" and never says "backed up".

- Auto Backup runs for builds installed from Google Play (and in some cases from a signed local build). It needs the
  learner's Google backup on, a Wi-Fi connection, a charging idle phone, and happens about once a day. Device-to-device
  transfer (setting up a new Pixel or Samsung from the old phone) carries the same folder.
- Testing on an emulator or device with the Play build or a debug build and `adb`:
  `adb shell bmgr enabled` (should say enabled), `adb shell bmgr backupnow com.fordytechsolutions.talino`, then uninstall
  and reinstall the app and run `adb shell bmgr restore <token>` (list tokens with `adb shell bmgr list sets`), or
  `adb shell bmgr list transports` to check the Google transport. Launch the app: it should find the snapshot in
  `files/backups/` and restore the progress without a screen.
- Copying a `.talino-backup` file into the app's `files/backups/` folder on an emulator
  (`adb shell run-as com.fordytechsolutions.talino`) is a quick way to test the restore without a real backup.

### Backup files (Pro)

Any purchase or All-Access unlocks backup files: create a file, keep a history on the phone, export it with the share
sheet (iCloud Drive, Google Drive, Files, anywhere), and import one with the document picker. No Google Drive API or
account is used; the share sheet already saves to Drive. Nothing is uploaded to Talino's servers.

### Not verified in simulators

Everything below needs a real phone and was only checked by tests and reading: iCloud uploading, confirming and
listing (the simulator has no real iCloud Drive; use a device signed in to iCloud), Android Auto Backup and
restore (`bmgr`), the share sheet and the document picker (their results on a device, including saving to iCloud Drive
and Google Drive), and the screens themselves in light and dark mode.
