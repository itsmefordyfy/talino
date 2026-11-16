import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useContentWidth } from '@/components/content-width';
import { SplitMinWidth } from '@/constants/theme';
import { useViewport } from '@/hooks/use-viewport';

/**
 * Whether the window is wide enough to show a list beside its content (a lesson with its course outline): an iPad in
 * landscape or a large portrait window. Read from the window's width (never the device name, never the orientation setting), so
 * Split View, Slide Over and Stage Manager resizing switch it live; an iPhone, even on its side, never reaches it.
 */
export function useSplitView(minWidth: number = SplitMinWidth): boolean {
  const { width } = useViewport();
  const { left, right } = useSafeAreaInsets();
  // Inside a screen that measured itself (a tab beside an iPad's sidebar), its own width is the one that counts.
  const measured = useContentWidth();
  return (measured ?? width - left - right) >= minWidth;
}
