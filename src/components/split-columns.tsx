import { useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View, type HostInstance, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useFold } from '@/hooks/use-fold';

/** The least a column may be squeezed to by moving the gap onto the fold; narrower than this and the fold is ignored. */
const MIN_COLUMN_WIDTH = 240;

export type SplitColumnsProps = {
  left: ReactNode;
  right: ReactNode;
  /** The gap between the columns when the display isn't folded. */
  gap?: number;
  /** Applied to each column's wrapper (its own gap between sections, for one). */
  columnStyle?: StyleProp<ViewStyle>;
};

/**
 * Two equal columns side by side. While the open iPhone Duo is partly folded, the fold runs between them: the gap
 * moves onto the fold and is as wide as the system asks content to stay clear of it, and each column takes what is left
 * on its side, so nothing sits across the hinge. Anywhere else it is two equal columns.
 */
export function SplitColumns({ left, right, gap = Spacing.three, columnStyle }: SplitColumnsProps) {
  const fold = useFold();
  const ref = useRef<HostInstance>(null);
  const [frame, setFrame] = useState<{ x: number; width: number } | null>(null);

  const measure = () =>
    ref.current?.measureInWindow((x, _y, width) => setFrame((previous) => (previous && previous.x === x && previous.width === width ? previous : { x, width })));

  // The fold's x is in window points, so the columns' own window position says how wide each side is.
  const leftWidth = fold && frame ? fold.x - frame.x : null;
  const rightWidth = fold && frame ? frame.x + frame.width - (fold.x + fold.width) : null;
  const onFold = fold && leftWidth !== null && rightWidth !== null && leftWidth >= MIN_COLUMN_WIDTH && rightWidth >= MIN_COLUMN_WIDTH;

  return (
    <View
      ref={ref}
      onLayout={measure}
      style={[styles.row, { gap: onFold ? fold.width : gap }]}>
      <View style={[onFold ? { width: leftWidth } : styles.column, columnStyle]}>{left}</View>
      <View style={[onFold ? { width: rightWidth } : styles.column, columnStyle]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
  },
});
