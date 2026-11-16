import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export type EmptyLayoutProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Places a tab's empty state (Sam, title, message, buttons) in the middle of the space under the
 * header (owner's calls: centered 2026-10-23, a little above the middle the same day, centered again
 * 2026-10-25). Fills its parent: the screen's content must grow.
 */
export function EmptyLayout({ children, style }: EmptyLayoutProps) {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.above} />
      {children}
      <View style={styles.below} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  above: {
    flexGrow: 1,
  },
  // The same room below as above (owner's call, 2026-10-25): centered on every tab. It was four
  // times as much below (2026-10-23) to keep Sam clear of the tab bar; the screen's own bottom
  // padding already clears the bar and the Scan button.
  below: {
    flexGrow: 1,
  },
});
