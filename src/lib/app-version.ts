import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * The version and this platform's build number, as "1.0 (18)": iOS and Android count builds
 * separately, and the number tells apart two uploads of the same version. Read from the config
 * the build was made with, so it needs no native module.
 */
/** Just the version, "1.0": what release notes are keyed by (a new build of the same version has the same notes). */
export function releaseVersion(): string {
  return Constants.expoConfig?.version ?? '';
}

export function appVersion(): string {
  const config = Constants.expoConfig;
  const version = config?.version ?? '';
  const build = Platform.OS === 'ios' ? config?.ios?.buildNumber : Platform.OS === 'android' ? config?.android?.versionCode?.toString() : undefined;
  return build ? `${version} (${build})` : version;
}
