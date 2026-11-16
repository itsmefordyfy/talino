import { Platform } from 'react-native';

import { useViewport } from '@/hooks/use-viewport';

/** From this window width an iPad shows the tab bar across the top (iPadOS 18+); narrower (Slide Over, a small Split View) it goes back to the bottom. */
export const TAB_BAR_ON_TOP_MIN_WIDTH = 700;

/** An iPad (any size or window). Not a width test: a Slide Over window on an iPad is still an iPad. */
export const IS_IPAD = Platform.OS === 'ios' && Platform.isPad;

/**
 * Whether the system tab bar floats at the top of the screen, as on an iPad in a regular-width window: then tab screens
 * need no room at the bottom for it, and Tali's button (which rises out of a bottom bar's middle slot) has no slot to sit
 * on. iPhone and Android: always false. Read from the window's width, so it follows Split View and Stage Manager resizing.
 */
export function useTabBarOnTop(): boolean {
  const { width } = useViewport();
  return IS_IPAD && width >= TAB_BAR_ON_TOP_MIN_WIDTH;
}
