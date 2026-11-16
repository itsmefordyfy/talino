import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingTaliDock, FloatingTaliSize, SideBarCenterFromBottom, SideBarCenterInset, TabBarHeight, TopTabBarCenter, TopTaliSize } from '@/constants/theme';
import { useChromeLayout } from '@/hooks/use-chrome-layout';
import { useTabBarOnTop } from '@/hooks/use-tab-bar-on-top';
import { useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

/** Opens Tali, the chat sheet over the tabs. Shared by the button and the empty slot under it. */
export function openTali() {
  tapFeedback();
  router.push('/tali');
}

/**
 * Where Tali's button sits: centered over the tab bar's middle slot. On a phone it reaches a little into the bottom bar and rises
 * above it; on an iPad's top bar (owner, 2026-11-16: the center tab is the same as on the iPhone) it is centered on the bar's height.
 */
export function useFloatingTaliPlacement(): ViewStyle {
  const insets = useSafeAreaInsets();
  const barOnTop = useTabBarOnTop();
  const { vertical, side } = useChromeLayout();
  // The Duo's side bar: the button sits over the middle slot of the bar down the edge (owner, 2026-11-16: the same centre tab as the iPhone).
  if (vertical) return { position: 'absolute', [side]: SideBarCenterInset - TopTaliSize / 2, bottom: SideBarCenterFromBottom - TopTaliSize / 2, width: TopTaliSize, height: TopTaliSize, borderRadius: TopTaliSize / 2 };
  if (barOnTop) return { position: 'absolute', left: '50%', marginLeft: -TopTaliSize / 2, top: TopTabBarCenter - TopTaliSize / 2, width: TopTaliSize, height: TopTaliSize, borderRadius: TopTaliSize / 2 };
  return {
    position: 'absolute',
    left: '50%',
    marginLeft: -FloatingTaliSize / 2,
    bottom: insets.bottom + TabBarHeight - FloatingTaliDock,
  };
}

/**
 * Tali: a round button with the Talino app icon in the bar's middle slot, rising a little above the bar,
 * as the camera button does in Pawfetti. It floats over the system bar, which can't hold a custom
 * button; the slot under it is an empty, disabled tab (never selected, so no active background), and a
 * tap anywhere on the slot opens Tali, a sheet over the tabs, like the button.
 *
 * On a tab bar that runs along a side (the iPhone Duo) or across the top (an iPad) there is no bottom middle slot,
 * so the button isn't drawn and Tali is an ordinary tab with a name and icon.
 */
export function FloatingTaliButton() {
  const theme = useTheme();
  const strings = useStrings();
  const placement = useFloatingTaliPlacement();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={strings.tabs.coach}
      onPress={openTali}
      style={({ pressed }) => [
        styles.button,
        placement,
        // The page colour as a rim, so the icon reads against the bar and the content under it; a soft glow in the brand violet, like Pawfetti's.
        { backgroundColor: theme.primary, borderColor: theme.background, boxShadow: `0 0 22px ${theme.primary}66, 0 6px 14px ${theme.primary}40` },
        pressed && styles.pressed,
      ]}>
      <Image source={require('@/assets/images/icon.png')} style={styles.face} contentFit="cover" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: FloatingTaliSize,
    height: FloatingTaliSize,
    borderRadius: FloatingTaliSize / 2,
    borderWidth: 3,
    overflow: 'hidden',
  },
  face: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
