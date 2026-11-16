// Learn more https://docs.expo.dev/guides/customizing-metro
// Sentry's config wraps Expo's own (getDefaultConfig) and adds the debug ids Sentry uses to match errors to source maps.
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);

// `expo export --platform web` (which builds the server routes for EAS Hosting) also bundles the web
// client, and expo-sqlite's web build imports a WebAssembly file Metro must treat as an asset.
config.resolver.assetExts.push('wasm');
// The career kit's templates are Word and PowerPoint files bundled as assets (`assets/career-kit`), shared out of the app as they are.
config.resolver.assetExts.push('docx', 'pptx');

// @sentry/react-native 8.28 looks for Expo Router's internal store at `expo-router/build/global-state/router-store`, a file expo-router 58
// no longer has, so Metro printed "invalid package.json configuration ... Falling back to file-based resolution" on every bundle.
// Sentry catches the failed lookup and goes on without the store (it only feeds `expoRouterIntegration`, which this app doesn't use:
// it uses `reactNavigationIntegration`), so an empty module in its place does exactly what happens today, without the warning.
// Remove this when @sentry/react-native follows expo-router's new layout.
const resolveUpstream = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-router/build/global-state/router-store') return { type: 'empty' };
  return (resolveUpstream ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
