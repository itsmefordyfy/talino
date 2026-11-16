import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

export type HeaderActionsProps = { children: ReactNode };

/** Buttons side by side in a tab header's accessory slot, evenly spaced. */
export function HeaderActions({ children }: HeaderActionsProps) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
