/**
 * app.json stays the source of truth (the release scripts edit it). This only adds the Apple Watch app
 * (targets/watch and targets/watch-widget, through @bacons/apple-targets) when TALINO_WATCH=1 is set at prebuild:
 *
 *   TALINO_WATCH=1 npx expo prebuild --platform ios
 *
 * `release:ios` runs `expo prebuild --clean`, and a Watch app needs its own App IDs in the Apple Developer account
 * (<bundle id>.watchkitapp and .watchkitapp.widget, both with the App Group), so with the flag unset the App Store
 * build is the phone app alone (as in CarMind, Pawfetti, Ulamin and Bubblie). See docs/BUILD_AND_RELEASE.md.
 */
module.exports = ({ config }) => {
  if (process.env.TALINO_WATCH !== '1') return config;
  return { ...config, plugins: [...(config.plugins ?? []), '@bacons/apple-targets'] };
};
