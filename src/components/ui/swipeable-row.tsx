import { useRef, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ReanimatedSwipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { ThemedText } from '@/components/themed-text';
import { HeroInk, Spacing } from '@/constants/theme';
import { useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { Icon, type IconName } from './icon';
import { SwipePressGuardContext, type SwipePressGuard } from './swipe-press-guard';

export type SwipeableRowProps = {
  children: ReactNode;
  /** Called when the revealed Remove is tapped (a caller that asks first shows its own question). The row closes either way. */
  onRemove: () => void;
  /** What's removed, for screen readers ("Remove Anti-rabies"). */
  accessibilityLabel?: string;
  /** The revealed action's word, when it isn't Remove (taking a food off a list keeps it). */
  removeLabel?: string;
  /** An action that keeps the item (moves it, archives it) isn't red and has its own glyph. */
  actionTone?: 'danger' | 'neutral';
  actionIcon?: IconName;
  /**
   * A card's corner radius: the swipe is clipped to the card's rounded shape, so Remove shows as
   * part of the card, not a block beside it. Leave out for rows inside a grouped card (it clips them).
   */
  radius?: number;
};

const ACTION_WIDTH = 88;
/** A drag that never reported settling (it should) stops blocking taps after this long. */
const DRAG_GUARD_MS = 1500;

/**
 * Swipe left to reveal Remove, like iOS Mail (the same row as CarMind's and Ulamin's). The red
 * sits behind the row, so the row slides off it; the gesture runs on the UI thread (Reanimated), so
 * it tracks the finger without JS-thread jank. The row's own press goes through `useGuardedPress`,
 * so a swipe never also taps it, and tapping an open row closes it. Screen readers get Remove as an action.
 */
export function SwipeableRow({ children, onRemove, accessibilityLabel, removeLabel, actionTone = 'danger', actionIcon = 'delete', radius }: SwipeableRowProps) {
  const strings = useStrings();
  const theme = useTheme();
  const label = removeLabel ?? strings.common.remove;
  const actionColor = actionTone === 'danger' ? theme.danger : theme.primary;
  const swipeable = useRef<SwipeableMethods>(null);
  // Whether a swipe is under way (from the drag starting until the row settles) and whether the
  // row is open: the row's own press reads them, so a swipe never opens or ticks the row.
  const dragStartedAt = useRef<number | null>(null);
  const isOpen = useRef(false);
  const guard: SwipePressGuard = {
    shouldIgnorePress: () => {
      if (dragStartedAt.current !== null && Date.now() - dragStartedAt.current < DRAG_GUARD_MS) return true;
      if (isOpen.current) {
        // Tapping a row left open closes it, as in iOS Mail, instead of opening it.
        swipeable.current?.close();
        return true;
      }
      return false;
    },
  };
  const dragStarted = () => {
    dragStartedAt.current = Date.now();
  };
  const settled = (open: boolean) => {
    dragStartedAt.current = null;
    isOpen.current = open;
  };

  const renderRemove = (_progress: unknown, _translation: unknown, methods: SwipeableMethods) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ? `${label} ${accessibilityLabel}` : label}
      onPress={() => {
        tapFeedback();
        methods.close();
        onRemove();
      }}
      style={({ pressed }) => [styles.action, { backgroundColor: actionColor }, pressed && styles.pressed]}>
      <Icon name={actionIcon} size={20} tint={HeroInk.text} />
      <ThemedText type="secondarySemiBold" style={styles.actionText}>
        {label}
      </ThemedText>
    </Pressable>
  );

  const row = (
    <ReanimatedSwipeable
      ref={swipeable}
      onSwipeableOpenStartDrag={dragStarted}
      onSwipeableCloseStartDrag={dragStarted}
      onSwipeableWillOpen={() => {
        isOpen.current = true;
      }}
      onSwipeableOpen={() => settled(true)}
      onSwipeableClose={() => settled(false)}
      friction={2}
      rightThreshold={ACTION_WIDTH / 2}
      overshootRight={false}
      renderRightActions={renderRemove}
      // The red behind the whole row: the row slides off it rather than pulling a separate button in.
      containerStyle={{ backgroundColor: actionColor }}
      childrenContainerStyle={{ backgroundColor: theme.backgroundElement }}>
      <View
        accessibilityActions={[{ name: 'remove', label }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'remove') onRemove();
        }}>
        <SwipePressGuardContext.Provider value={guard}>{children}</SwipePressGuardContext.Provider>
      </View>
    </ReanimatedSwipeable>
  );

  return radius ? <View style={[styles.clip, { borderRadius: radius }]}>{row}</View> : row;
}

const styles = StyleSheet.create({
  action: {
    width: ACTION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
  },
  actionText: {
    // On the danger fill in both themes, so fixed light ink rather than a theme color.
    color: HeroInk.text,
  },
  pressed: {
    opacity: 0.8,
  },
  clip: {
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
});
