import { memo, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

export type TimeWheelsProps = {
  /** "HH:MM", 24-hour. */
  value: string;
  onChange: (value: string) => void;
};

const ITEM = 44;
const VISIBLE = 5;
const HOURS = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

const pad = (n: number) => String(n).padStart(2, '0');
/** How far a looping wheel reaches each side of the copy it rests on: more than one fling travels. */
const LOOP_REACH = 2500;

/**
 * Hour, minute and AM/PM wheels, drawn by the app so iPhone and Android look the same (owner's
 * call, 2026-10-17): each column scrolls and snaps to the band in the middle, or a row is tapped.
 * Hours and minutes go round like the system's wheels (11 → 12, 59 → 00): they used to stop at
 * the last row and bounce, which read as the picker not responding (2026-10-23).
 * Screen readers step each column with swipe up and down.
 */
export function TimeWheels({ value, onChange }: TimeWheelsProps) {
  const strings = useStrings();
  const theme = useTheme();
  const [h, m] = value.split(':').map(Number);
  const hour24 = Number.isFinite(h) ? h : 9;
  const minute = Number.isFinite(m) ? m : 0;
  const period = hour24 >= 12 ? 1 : 0;
  const hourIndex = hour24 % 12;
  const set = (nextHourIndex: number, nextMinute: number, nextPeriod: number) => onChange(`${pad((nextHourIndex % 12) + nextPeriod * 12)}:${pad(nextMinute)}`);
  return (
    <View style={styles.row}>
      <View pointerEvents="none" style={[styles.band, { backgroundColor: theme.backgroundSelected }]} />
      <Wheel label={strings.common.hour} items={HOURS} index={hourIndex} loop onChange={(i) => set(i, minute, period)} />
      <ThemedText type="section" style={styles.colon}>
        :
      </ThemedText>
      <Wheel label={strings.common.minute} items={MINUTES} index={minute} loop onChange={(i) => set(hourIndex, i, period)} />
      <Wheel label={strings.common.amPm} items={PERIODS} index={period} onChange={(i) => set(hourIndex, minute, i)} />
    </View>
  );
}

type WheelProps = { label: string; items: readonly string[]; index: number; loop?: boolean; onChange: (index: number) => void };

/**
 * One column. A looping one repeats its items, rests on the middle copy, and after each stop jumps
 * back to the same row there (unseen: the rows are identical), so it never reaches an end.
 */
function Wheel({ label, items, index, loop = false, onChange }: WheelProps) {
  const ref = useRef<ScrollViewInstance>(null);
  const placed = useRef(false);
  const count = items.length;
  const side = loop ? Math.ceil(LOOP_REACH / (count * ITEM)) : 0;
  const base = side * count;
  const rows = count * (side * 2 + 1);
  /** The row the wheel rests on (in any copy). */
  const row = useRef(base + index);
  const valueOf = (r: number) => ((r % count) + count) % count;
  const pick = (next: number) => {
    if (next === index) return;
    tapFeedback();
    onChange(next);
  };
  /** A finger is on this wheel: nothing moves it from the code until it lets go. */
  const touching = useRef(false);
  const settle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // A new drag began while the last one was still coasting: that one is the one to settle.
    if (touching.current) return;
    const offset = event.nativeEvent.contentOffset.y;
    const landed = Math.max(0, Math.min(rows - 1, Math.round(offset / ITEM)));
    const value = valueOf(landed);
    const home = base + value;
    // Only a wheel that has coasted into the first or last copy is moved back to the middle one: a jump
    // while a snap is still settling can leave the scroll view ignoring the next drag, so most stops make none.
    if (loop && (landed < count || landed >= rows - count) && landed !== home) {
      ref.current?.scrollTo({ y: home * ITEM, animated: false });
      row.current = home;
    } else {
      // Android's snapping can stop a little short (a fast fling): settle onto the row exactly.
      if (Math.abs(offset - landed * ITEM) > 1) ref.current?.scrollTo({ y: landed * ITEM, animated: true });
      row.current = landed;
    }
    pick(value);
  };
  const go = (target: number) => {
    const next = loop ? target : Math.max(0, Math.min(rows - 1, target));
    if (loop && (next < 0 || next >= rows)) return;
    row.current = next;
    ref.current?.scrollTo({ y: next * ITEM, animated: true });
    pick(valueOf(next));
  };
  // The rows get one function for good (so they can be memoized); it always runs the latest `go`.
  const latestGo = useRef(go);
  useEffect(() => {
    latestGo.current = go;
  });
  const [select] = useState(() => (target: number) => latestGo.current(target));
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: items[index] }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => go(row.current + (event.nativeEvent.actionName === 'increment' ? 1 : -1))}
      style={styles.wheel}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM}
        decelerationRate="fast"
        nestedScrollEnabled
        contentContainerStyle={styles.content}
        // Opens on the value (placed once, when it's laid out: Android has no contentOffset prop).
        onLayout={() => {
          if (placed.current) return;
          placed.current = true;
          ref.current?.scrollTo({ y: row.current * ITEM, animated: false });
        }}
        onScrollBeginDrag={() => {
          touching.current = true;
        }}
        onMomentumScrollEnd={settle}
        onScrollEndDrag={(event) => {
          touching.current = false;
          // A drag that lets go already on a row has no coasting to wait for, so no momentum event will come: settle now.
          // Any other release is still snapping to a row, and settles when that ends (onMomentumScrollEnd).
          const offset = event.nativeEvent.contentOffset.y;
          if (Math.abs(offset - Math.round(offset / ITEM) * ITEM) < 1) settle(event);
        }}>
        {Array.from({ length: rows }, (_, r) => {
          const value = valueOf(r);
          return <WheelRow key={r} row={r} text={items[value]} selected={value === index} onSelect={select} />;
        })}
      </ScrollView>
    </View>
  );
}

type WheelRowProps = { row: number; text: string; selected: boolean; onSelect: (row: number) => void };

/**
 * One row. Memoized on purpose (measured 2026-11-03): a looping wheel has 132 to 180 rows, and every
 * stop used to re-render all of them (~150 ms of frozen JavaScript on a simulator, so the card
 * stopped answering touches); now only the rows whose highlight changed re-render.
 */
const WheelRow = memo(function WheelRow({ row, text, selected, onSelect }: WheelRowProps) {
  return (
    <Pressable onPress={() => onSelect(row)} style={styles.item} importantForAccessibility="no">
      <ThemedText type={selected ? 'cardTitle' : 'body'} themeColor={selected ? 'primaryText' : 'textSecondary'} tabular>
        {text}
      </ThemedText>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: ITEM * VISIBLE,
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM * 2,
    height: ITEM,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
  },
  colon: {
    marginTop: -Spacing.one,
  },
  wheel: {
    width: 64,
    height: ITEM * VISIBLE,
  },
  content: {
    paddingVertical: ITEM * 2,
  },
  item: {
    height: ITEM,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
