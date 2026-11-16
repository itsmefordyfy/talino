import { useContentWidth } from '@/components/content-width';
import { useScreenPadding } from '@/components/ui/screen';
import { TwoUpMinWidth, WideContentMaxWidth } from '@/constants/theme';
import { useViewport } from '@/hooks/use-viewport';

/**
 * Whether a tab's content is wide enough for two columns (the iPhone Duo's open screen, a phone on its side, an iPad):
 * its content width is at least `TwoUpMinWidth`. Zero change on a phone held upright. Read from the viewport
 * (`useViewport`, which follows folding and opening the Duo) and the safe-area padding, so it follows the system's bars
 * and never the device's name.
 */
export function useTwoUp(): boolean {
  const { width } = useViewport();
  const padding = useScreenPadding('tab');
  // The width this screen is really drawn in (narrower than the window beside an iPad's sidebar), once it has measured itself.
  const measured = useContentWidth();
  return Math.min(measured ?? width, WideContentMaxWidth) - padding.paddingLeft - padding.paddingRight >= TwoUpMinWidth;
}
