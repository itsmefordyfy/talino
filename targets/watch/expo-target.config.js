/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'watch',
  name: 'TalinoWatch',
  displayName: 'Talino',
  // Appended to the iPhone app's id: com.fordytechsolutions.talino.watchkitapp (register it as an App ID before a release build).
  bundleIdentifier: '.watchkitapp',
  deploymentTarget: '10.0',
  // The home-screen icon: the plugin builds the AppIcon set from the app's own icon.
  icon: '../../assets/images/icon.png',
  frameworks: ['SwiftUI', 'WatchConnectivity', 'WidgetKit'],
  // Shared with the complication (targets/watch-widget); a group never crosses devices.
  entitlements: { 'com.apple.security.application-groups': ['group.com.fordytechsolutions.talino'] },
};
