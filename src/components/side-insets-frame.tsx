import { useRef, useState, type ReactNode } from 'react';
import { View, type HostInstance } from 'react-native';
import { useViewport } from '@/hooks/use-viewport';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Gives a screen only the side insets it actually overlaps. The safe-area values are the window's: on the
 * iPhone Duo the vertical bars take 84 pt of the right edge, but a page sheet is a card centered in the
 * window and never reaches that edge, so padding it by 84 pt left its content crooked (2026-10-25). The
 * frame measures where the screen sits and hands its children the left and right insets that remain; the top and
 * bottom stay the window's. A full-width screen overlaps everything, so nothing changes for it.
 */
export function SideInsetsFrame({ children }: { children: ReactNode }) {
  const parent = useSafeAreaInsets();
  const { width: windowWidth } = useViewport();
  const ref = useRef<HostInstance>(null);
  const [frame, setFrame] = useState<{ x: number; width: number } | null>(null);
  const insets = frame
    ? { ...parent, left: Math.max(0, parent.left - frame.x), right: Math.max(0, parent.right - (windowWidth - frame.x - frame.width)) }
    : parent;
  return (
    <View
      ref={ref}
      collapsable={false}
      style={{ flex: 1 }}
      onLayout={() => ref.current?.measureInWindow((x, _y, width) => setFrame((was) => (was && was.x === x && was.width === width ? was : { x, width })))}>
      <SafeAreaInsetsContext.Provider value={insets}>{children}</SafeAreaInsetsContext.Provider>
    </View>
  );
}
