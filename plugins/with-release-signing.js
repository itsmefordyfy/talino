const { withAppBuildGradle } = require('expo/config-plugins');

const MARK = '// Upload key (plugins/with-release-signing.js)';

/**
 * Signs local release builds (`./gradlew bundleRelease`, `assembleRelease`) with the app's upload
 * key, so the .aab can go straight to Play Console. The key's path, alias and passwords come from
 * ~/.gradle/gradle.properties (<SLUG>_UPLOAD_*, e.g. TALINO_UPLOAD_STORE_FILE), never from the repo.
 * Without them (EAS, or a machine without the key) the build keeps the template's debug signing;
 * EAS signs its own builds. (The same plugin as Pawfetti's, CarMind's and Ulamin's, with the
 * property prefix taken from the app's slug; scripts/release-android.mjs derives the same prefix.)
 */
module.exports = function withReleaseSigning(config) {
  const prefix = `${String(config.slug).toUpperCase().replace(/[^A-Z0-9]/g, '_')}_UPLOAD`;
  return withAppBuildGradle(config, (mod) => {
    let gradle = mod.modResults.contents;
    if (gradle.includes(MARK)) return mod;

    const withConfig = gradle.replace(
      /signingConfigs \{\n/,
      `signingConfigs {
        ${MARK}
        if (findProperty('${prefix}_STORE_FILE')) {
            release {
                storeFile file(findProperty('${prefix}_STORE_FILE'))
                storePassword findProperty('${prefix}_STORE_PASSWORD')
                keyAlias findProperty('${prefix}_KEY_ALIAS')
                keyPassword findProperty('${prefix}_KEY_PASSWORD')
            }
        }
`,
    );
    const withRelease = withConfig.replace(
      /(release \{\n(?:\s*\/\/[^\n]*\n)*\s*)signingConfig signingConfigs\.debug/,
      `$1signingConfig findProperty('${prefix}_STORE_FILE') ? signingConfigs.release : signingConfigs.debug`,
    );
    // Fail the prebuild rather than silently ship a debug-signed release if the template changes.
    if (withConfig === gradle || withRelease === withConfig) {
      throw new Error('with-release-signing: android/app/build.gradle no longer matches; update the plugin.');
    }
    mod.modResults.contents = withRelease;
    return mod;
  });
};
