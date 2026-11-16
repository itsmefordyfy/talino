import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { GlassIconButton } from './glass-icon-button';

export type ModalHeaderProps = {
  title: string;
  /** A second line under the title ("2 selected"). */
  subtitle?: string;
  onClose: () => void;
  /** What closing does, for screen readers (Close, Cancel). */
  closeLabel: string;
  /** The trailing action (Done), if any. */
  right?: ReactNode;
};

/**
 * The header of a sheet the app draws itself (a picker's Modal): the X as the app's round glass
 * button, the same as every other sheet's close and the back button (owner's call, 2026-10-23: it was
 * a plain white circle),
 * the title centered between two sides of the same width whatever sits in them, side padding
 * like the screen's, and the status bar's room on Android, where the sheet is full screen.
 */
export function ModalHeader({ title, subtitle, onClose, closeLabel, right }: ModalHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: process.env.EXPO_OS === 'android' ? insets.top + Spacing.two : Spacing.three }]}>
      <View style={[styles.side, styles.start]}>
        <GlassIconButton icon="close" accessibilityLabel={closeLabel} color="text" onPress={onClose} />
      </View>
      <View style={styles.title}>
        <ThemedText type="bodySemiBold" accessibilityRole="header" numberOfLines={1} style={styles.centered}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1} style={styles.centered}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      <View style={[styles.side, styles.end]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  side: {
    width: 88,
    flexDirection: 'row',
  },
  start: {
    justifyContent: 'flex-start',
  },
  end: {
    justifyContent: 'flex-end',
  },
  title: {
    flex: 1,
    alignItems: 'center',
  },
  centered: {
    textAlign: 'center',
  },
});
