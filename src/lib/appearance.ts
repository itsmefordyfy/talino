import { Appearance } from 'react-native';

export type AppearancePreference = 'light' | 'dark' | 'system';

/**
 * Overrides the color scheme for the whole app, so native parts we don't draw ourselves
 * (switches, the tab bar, alerts, keyboards, the status bar) match the chosen mode.
 * 'system' hands control back to the phone's setting.
 */
export function applyAppearance(preference: AppearancePreference): void {
  try {
    Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
  } catch {
    // Not supported on every platform (e.g. some web runtimes); the theme hook still applies it.
  }
}
