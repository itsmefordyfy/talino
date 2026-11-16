import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { MinTouchSize } from '@/constants/theme';
import { useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { Icon } from './icon';

export type SortableListProps<T extends { key: string }> = {
  data: readonly T[];
  /** Every row has this height, so positions are computed without measuring. */
  rowHeight: number;
  renderRow: (item: T) => ReactNode;
  onReorder: (keys: string[]) => void;
  /** Called when a drag starts and ends, e.g. to pause the surrounding scroll view meanwhile. */
  onDragStateChange?: (dragging: boolean) => void;
};

type Positions = Record<string, number>;

function positionsOf(data: readonly { key: string }[]): Positions {
  return Object.fromEntries(data.map((item, index) => [item.key, index]));
}

/**
 * Drag a row by its handle to reorder. Dragging runs entirely on the UI thread
 * (Reanimated + Gesture Handler), so rows follow the finger at 60/120 fps; React
 * hears about the new order once, when the row is dropped.
 */
export function SortableList<T extends { key: string }>({
  data,
  rowHeight,
  renderRow,
  onReorder,
  onDragStateChange,
}: SortableListProps<T>) {
  const positions = useSharedValue<Positions>(positionsOf(data));

  // Keep in sync when the order changes from outside (e.g. "Reset to default").
  useEffect(() => {
    positions.set(positionsOf(data));
  }, [data, positions]);

  const drop = (next: Positions) => {
    onDragStateChange?.(false);
    onReorder(Object.keys(next).sort((a, b) => next[a] - next[b]));
  };
  const lift = () => onDragStateChange?.(true);

  return (
    <View style={{ height: data.length * rowHeight }}>
      {data.map((item) => (
        <SortableRow
          key={item.key}
          id={item.key}
          count={data.length}
          rowHeight={rowHeight}
          positions={positions}
          onLift={lift}
          onDrop={drop}>
          {renderRow(item)}
        </SortableRow>
      ))}
    </View>
  );
}

type SortableRowProps = {
  id: string;
  count: number;
  rowHeight: number;
  positions: SharedValue<Positions>;
  onLift: () => void;
  onDrop: (positions: Positions) => void;
  children: ReactNode;
};

function SortableRow({ id, count, rowHeight, positions, onLift, onDrop, children }: SortableRowProps) {
  const theme = useTheme();
  const l = useStrings().layout;
  const top = useSharedValue(positions.get()[id] * rowHeight);
  const startTop = useSharedValue(0);
  const active = useSharedValue(false);

  // Rows that aren't being dragged glide into the slot the dragged row vacated.
  useAnimatedReaction(
    () => positions.get()[id],
    (current, previous) => {
      if (current !== previous && !active.get()) top.set(withSpring(current * rowHeight, { damping: 20, stiffness: 220 }));
    },
  );

  const pan = Gesture.Pan()
    .onStart(() => {
      active.set(true);
      startTop.set(top.get());
      scheduleOnRN(onLift);
      scheduleOnRN(tapFeedback);
    })
    .onUpdate((event) => {
      const maxTop = (count - 1) * rowHeight;
      top.set(Math.min(Math.max(startTop.get() + event.translationY, 0), maxTop));
      const target = Math.round(top.get() / rowHeight);
      const from = positions.get()[id];
      if (target === from) return;
      const swapWith = Object.keys(positions.get()).find((key) => positions.get()[key] === target);
      if (!swapWith) return;
      positions.set({ ...positions.get(), [id]: target, [swapWith]: from });
      scheduleOnRN(tapFeedback);
    })
    .onFinalize(() => {
      top.set(withSpring(positions.get()[id] * rowHeight, { damping: 20, stiffness: 220 }));
      if (active.get()) scheduleOnRN(onDrop, positions.get());
      active.set(false);
    });

  // The same reorder without dragging, for VoiceOver and Switch Control: swipe up or down on the
  // handle (an adjustable control) to move the row one place.
  const move = (delta: number) => {
    const current = positions.get();
    const from = current[id];
    const to = from + delta;
    if (to < 0 || to >= count) return;
    const swapWith = Object.keys(current).find((key) => current[key] === to);
    if (!swapWith) return;
    const next = { ...current, [id]: to, [swapWith]: from };
    positions.set(next);
    top.set(withSpring(to * rowHeight, { damping: 20, stiffness: 220 }));
    tapFeedback();
    onDrop(next);
  };

  const rowStyle = useAnimatedStyle(() => ({
    top: top.get(),
    zIndex: active.get() ? 10 : 0,
    transform: [{ scale: withSpring(active.get() ? 1.03 : 1) }],
    boxShadow: active.get() ? '0 8px 20px rgba(17, 21, 28, 0.18)' : '0 0 0 rgba(0, 0, 0, 0)',
  }));

  return (
    <Animated.View style={[styles.row, { height: rowHeight, backgroundColor: theme.backgroundElement }, rowStyle]}>
      <View style={styles.content}>{children}</View>
      <GestureDetector gesture={pan}>
        <View
          style={styles.handle}
          accessibilityRole="adjustable"
          accessibilityLabel={l.reorder}
          accessibilityHint={l.reorderHint}
          accessibilityValue={{ text: l.position(positions.get()[id] + 1, count) }}
          accessibilityActions={[
            { name: 'increment', label: l.moveUp },
            { name: 'decrement', label: l.moveDown },
          ]}
          onAccessibilityAction={(event) => move(event.nativeEvent.actionName === 'increment' ? -1 : 1)}
          hitSlop={8}>
          <Icon name="drag_handle" size={20} color="textTertiary" />
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  handle: {
    width: MinTouchSize,
    height: MinTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
