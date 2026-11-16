import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useLandscape } from '@/hooks/use-landscape';

export type ShareActionsProps = {
  /** The lead button (the image or photo to share). */
  primary: ReactNode;
  /** The buttons beside each other under it (PDF, Print); each should be `flex: 1` (`ShareActions.half`). */
  secondary: ReactNode;
  /** The footer sits in a narrow column (half a wide window): always stacked, whatever the window's shape. */
  narrow?: boolean;
};

/**
 * The footer of a screen that shares or prints (emergency card, lost-pet poster): the lead button over a pair of
 * secondary ones on a tall window; all in one row on a wide, short one, where three stacked rows left
 * the form a few lines of screen (the Duo's open display, a phone on its side).
 */
export function ShareActions({ primary, secondary, narrow = false }: ShareActionsProps) {
  const wide = useLandscape() && !narrow;
  return (
    <View style={[styles.stack, wide && styles.row]}>
      <View style={wide && styles.lead}>{primary}</View>
      <View style={[styles.pair, wide && styles.rest]}>{secondary}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lead: {
    flex: 1,
  },
  pair: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rest: {
    flex: 2,
  },
});
