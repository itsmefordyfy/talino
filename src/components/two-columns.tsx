import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTwoUp } from '@/hooks/use-two-up';

export type TwoColumnsProps = {
  /** The main column (the one a phone shows first). */
  primary: ReactNode;
  /** The second column; under the first on a narrow window. */
  secondary: ReactNode;
  /** The second column's share of the width (0 to 1, default half). A fixed share keeps a side panel from growing with the window. */
  secondaryShare?: number;
  /** Put the secondary column first when the window is wide (a summary beside the list it summarises, on its left). */
  secondaryFirst?: boolean;
  columnStyle?: StyleProp<ViewStyle>;
};

/**
 * A tab's sections in two columns on a wide window (an iPad, `useTwoUp`) and one stack on a phone, in the order `primary`,
 * `secondary`. The caller decides what goes in which column, so each tab keeps its own reading order instead of a generic
 * masonry reshuffling it. Columns top-align and scroll with the page.
 */
export function TwoColumns({ primary, secondary, secondaryShare = 0.5, secondaryFirst = false, columnStyle }: TwoColumnsProps) {
  const wide = useTwoUp();
  if (!wide) {
    return (
      <View style={styles.stack}>
        {primary}
        {secondary}
      </View>
    );
  }
  const first = secondaryFirst ? secondary : primary;
  const second = secondaryFirst ? primary : secondary;
  const secondShare = secondaryFirst ? 1 - secondaryShare : secondaryShare;
  return (
    <View style={styles.row}>
      <View style={[styles.column, { flexGrow: 1 - secondShare, flexBasis: 0 }, columnStyle]}>{first}</View>
      <View style={[styles.column, { flexGrow: secondShare, flexBasis: 0 }, columnStyle]}>{second}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.four,
  },
  column: {
    gap: Spacing.four,
    minWidth: 0,
  },
});
