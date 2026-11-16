const fs = require('fs');
const path = require('path');
const { withXcodeProject } = require('expo/config-plugins');

/**
 * Sentry's Xcode build phases upload source maps and debug symbols, and fail the archive without
 * an auth token. Shell variables don't reach a build started from Xcode's own Archive, and the
 * debug-symbols phase doesn't read ios/.xcode.env, so the switch is a build setting: Xcode
 * exports build settings to every script phase. It's set only when no token is available, so
 * adding one (SENTRY_AUTH_TOKEN, or .env.sentry-build-plugin at the project root) and running
 * prebuild again turns uploads back on, and crash reports get readable stack traces.
 */
function hasSentryToken(projectRoot) {
  if (process.env.SENTRY_AUTH_TOKEN) return true;
  const dotenv = path.join(projectRoot, '.env.sentry-build-plugin');
  return fs.existsSync(dotenv) && /^SENTRY_AUTH_TOKEN=\S+/m.test(fs.readFileSync(dotenv, 'utf8'));
}

module.exports = function withSentryUploadSwitch(config) {
  return withXcodeProject(config, (mod) => {
    const configurations = mod.modResults.pbxXCBuildConfigurationSection();
    const disable = !hasSentryToken(mod.modRequest.projectRoot);
    for (const [key, entry] of Object.entries(configurations)) {
      if (key.endsWith('_comment') || !entry.buildSettings) continue;
      if (disable) entry.buildSettings.SENTRY_DISABLE_AUTO_UPLOAD = 'true';
      else delete entry.buildSettings.SENTRY_DISABLE_AUTO_UPLOAD;
    }
    return mod;
  });
};
