/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'watch-widget',
  name: 'TalinoWatchWidget',
  displayName: 'Talino',
  // com.fordytechsolutions.talino.watchkitapp.widget: the Watch app's id plus this (register it as an App ID before a release build).
  bundleIdentifier: '.watchkitapp.widget',
  deploymentTarget: '10.0',
  frameworks: ['SwiftUI', 'WidgetKit'],
  // The Watch app saves the phone's latest snapshot here for the complication, which runs in its own process.
  entitlements: { 'com.apple.security.application-groups': ['group.com.fordytechsolutions.talino'] },
};
