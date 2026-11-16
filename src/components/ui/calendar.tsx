import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { addMonths, isSelectable, monthGrid, monthOf, type CalendarMonth } from '@/lib/calendar';
import { todayISO, type ISODate } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';
import { activeLocale } from '@/lib/i18n';
import { firstWeekday } from '@/lib/region';

import { Icon } from './icon';
import { IconButton } from './icon-button';

export type CalendarProps = {
  /** The picked day, ringed; null for none yet. */
  value: ISODate | null;
  /** The month it opens on while nothing is picked; this month by default. */
  initialDate?: ISODate;
  minimumDate?: ISODate;
  maximumDate?: ISODate;
  onSelect: (date: ISODate) => void;
  /** Read out for the calendar as a whole. */
  accessibilityLabel: string;
};

const CELL = MinTouchSize;
/** The phone's first day of the week (Sunday in the Philippines and the US, Monday in much of Europe). */
const WEEK_START = firstWeekday();
/** That day, then six days on: the weekday names in the phone's language (2026-10-18 is a Sunday). */
const WEEK = Array.from({ length: 7 }, (_, index) => new Date(2026, 9, 18 + WEEK_START + index));
const MONTHS = Array.from({ length: 12 }, (_, index) => index);
/** Years per page in the year view: a birthday ten years back is two taps away. */
const YEARS_PAGE = 12;
/** A swipe turns the page past a quarter of its width, or when flung this fast (pt/s). */
const SWIPE_VELOCITY = 500;
/** How far a swipe in the month or year view travels before it flips the page. */
const FLIP_DISTANCE = 40;
/** How long an arrow's slide to the next month takes. */
const TURN_MS = 240;
/** The page settles without bouncing past its edge. */
const SETTLE = { damping: 26, stiffness: 260, overshootClamping: true };

const monthTitle = ({ year, month }: CalendarMonth) => new Date(year, month, 1).toLocaleDateString(activeLocale(), { month: 'long', year: 'numeric' });
const monthIndex = ({ year, month }: CalendarMonth) => year * 12 + month;
/** Room for six weeks, the most a month spans, so the card keeps one height whichever month slides in. */
const GRID_HEIGHT = 6 * CELL + 5 * Spacing.one;

/**
 * One calendar for every date in the app, the same on iPhone and Android (owner's reference,
 * 2026-10-16: the iOS popover calendar): the month and year on top (tap it to jump by month and
 * year), arrows for the month before and after, the week from Sunday, today in the brand colour
 * and the picked day on a soft brand circle. Days outside the field's own limits are greyed and
 * can't be picked; no field limits past dates unless it asks to. Every day is a 44 pt target.
 *
 * The days scroll sideways like pages (owner's call, 2026-10-18): the month follows the finger with
 * its neighbours beside it, and settles on the next or previous month past a quarter of the width
 * or on a flick (the arrows slide the same way). The month and year views flip at once on a swipe.
 */
export function Calendar({ value, initialDate, minimumDate, maximumDate, onSelect, accessibilityLabel }: CalendarProps) {
  const theme = useTheme();
  const today = todayISO();
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState<CalendarMonth>(() => monthOf(value ?? initialDate ?? today));
  // What the grid shows: the month's days, the year's months, or twelve years to jump between.
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  // The pages sit side by side from the month the strip was last started from, one width apart, so
  // a turn only moves the strip: the month arriving is already drawn where it lands.
  const [anchor, setAnchor] = useState<CalendarMonth>(shown);
  const [width, setWidth] = useState(0);
  const page = monthIndex(shown) - monthIndex(anchor);
  const position = useSharedValue(0);
  const dragStart = useSharedValue(0);
  const strip = useAnimatedStyle(() => ({ transform: [{ translateX: position.get() }] }));

  const picking = view !== 'days';
  const firstYear = shown.year - (((shown.year % YEARS_PAGE) + YEARS_PAGE) % YEARS_PAGE);
  const years = Array.from({ length: YEARS_PAGE }, (_, index) => firstYear + index);
  const yearOpen = (year: number) => (!maximumDate || `${year}-01-01` <= maximumDate) && (!minimumDate || `${year}-12-31` >= minimumDate);
  // A month is offered when any of its days is.
  const monthOpen = (month: number) => {
    const first = `${shown.year}-${String(month + 1).padStart(2, '0')}-01`;
    const last = `${shown.year}-${String(month + 1).padStart(2, '0')}-${new Date(shown.year, month + 1, 0).getDate()}`;
    return (!maximumDate || first <= maximumDate) && (!minimumDate || last >= minimumDate);
  };

  // A month picked in the month view starts the strip again from there.
  const jumpTo = (month: CalendarMonth) => {
    setShown(month);
    setAnchor(month);
    position.set(0);
  };
  // The page a slide is heading to: the title and the neighbours follow at once, while it moves.
  const turnTo = (target: number) => {
    tapFeedback();
    setShown(addMonths(anchor, target));
  };
  const step = (count: number) => {
    if (view === 'days') {
      const target = page + count;
      position.set(reduceMotion || width === 0 ? -target * width : withTiming(-target * width, { duration: TURN_MS }));
      turnTo(target);
      return;
    }
    tapFeedback();
    setShown((current) => (view === 'years' ? { year: current.year + count * YEARS_PAGE, month: current.month } : { year: current.year + count, month: current.month }));
  };

  // Horizontal only, and only once the finger has clearly moved sideways: a tap still picks its day
  // and an up or down drag is left alone. Once it takes over, the day under the finger isn't picked.
  const pager = Gesture.Pan()
    .enabled(view === 'days' && width > 0)
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onStart(() => {
      dragStart.set(position.get());
    })
    .onUpdate(({ translationX }) => {
      position.set(dragStart.get() + translationX);
    })
    .onEnd(({ translationX, velocityX }) => {
      const from = Math.round(-dragStart.get() / width);
      const direction = translationX <= -width / 4 || velocityX <= -SWIPE_VELOCITY ? 1 : translationX >= width / 4 || velocityX >= SWIPE_VELOCITY ? -1 : 0;
      const target = from + direction;
      position.set(reduceMotion ? -target * width : withSpring(-target * width, { ...SETTLE, velocity: velocityX }));
      if (direction !== 0) scheduleOnRN(turnTo, target);
    });
  const flip = Gesture.Pan()
    .enabled(view !== 'days')
    .runOnJS(true)
    .activeOffsetX([-16, 16])
    .failOffsetY([-16, 16])
    .onEnd(({ translationX, velocityX }) => {
      if (translationX <= -FLIP_DISTANCE || velocityX <= -SWIPE_VELOCITY) step(1);
      else if (translationX >= FLIP_DISTANCE || velocityX >= SWIPE_VELOCITY) step(-1);
    });

  const pages = [page - 1, page, page + 1];
  const days = (month: CalendarMonth) => (
    <View style={styles.grid}>
      {monthGrid(month, WEEK_START).map((week, index) => (
        <View key={index} style={styles.week}>
          {week.map((date, column) => {
            if (!date) return <View key={column} style={styles.cell} />;
            const selected = date === value;
            const open = isSelectable(date, minimumDate, maximumDate);
            const isToday = date === today;
            return (
              <Pressable
                key={date}
                accessibilityRole="button"
                accessibilityLabel={new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10))).toLocaleDateString(activeLocale(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                accessibilityState={{ selected, disabled: !open }}
                disabled={!open}
                onPress={() => {
                  tapFeedback();
                  onSelect(date);
                }}
                style={({ pressed }) => [styles.cell, styles.day, selected && { backgroundColor: theme.primarySoft }, pressed && !selected && { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText type={selected || isToday ? 'bodySemiBold' : 'body'} themeColor={selected || isToday ? 'primaryText' : open ? 'text' : 'textTertiary'} tabular style={!open && styles.disabled}>
                  {Number(date.slice(8, 10))}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );

  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.calendar}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: picking }}
          accessibilityLabel={view === 'years' ? `${years[0]}–${years[years.length - 1]}` : view === 'months' ? String(shown.year) : monthTitle(shown)}
          onPress={() => {
            tapFeedback();
            // The month and year → that year's months → twelve years; and back to the days, from the month shown.
            if (view === 'years') jumpTo(shown);
            setView((current) => (current === 'days' ? 'months' : current === 'months' ? 'years' : 'days'));
          }}
          style={({ pressed }) => [styles.title, pressed && styles.pressed]}>
          <ThemedText type="bodySemiBold">{view === 'years' ? `${years[0]}–${years[years.length - 1]}` : view === 'months' ? String(shown.year) : monthTitle(shown)}</ThemedText>
          <Icon name={picking ? 'expand_more' : 'chevron_right'} size={20} color="primary" />
        </Pressable>
        <IconButton icon="chevron_left" accessibilityLabel={view === 'years' ? String(firstYear - YEARS_PAGE) : view === 'months' ? String(shown.year - 1) : monthTitle(addMonths(shown, -1))} background="backgroundElement" color="text" iconSize={24} onPress={() => step(-1)} />
        <IconButton icon="chevron_right" accessibilityLabel={view === 'years' ? String(firstYear + YEARS_PAGE) : view === 'months' ? String(shown.year + 1) : monthTitle(addMonths(shown, 1))} background="backgroundElement" color="text" iconSize={24} onPress={() => step(1)} />
      </View>

      {view === 'years' ? (
        <GestureDetector gesture={flip}>
          <View collapsable={false} style={styles.months}>
            {years.map((year) => {
              const open = yearOpen(year);
              const current = year === shown.year;
              return (
                <Pressable
                  key={year}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !open, selected: current }}
                  disabled={!open}
                  onPress={() => {
                    tapFeedback();
                    setShown({ year, month: shown.month });
                    setView('months');
                  }}
                  style={({ pressed }) => [styles.month, current && { backgroundColor: theme.primarySoft }, pressed && styles.pressed, !open && styles.disabled]}>
                  <ThemedText type={current ? 'bodySemiBold' : 'body'} themeColor={current ? 'primaryText' : 'text'} tabular>
                    {year}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </GestureDetector>
      ) : view === 'months' ? (
        <GestureDetector gesture={flip}>
          <View collapsable={false} style={styles.months}>
            {MONTHS.map((month) => {
              const open = monthOpen(month);
              const current = month === shown.month;
              return (
                <Pressable
                  key={month}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !open, selected: current }}
                  disabled={!open}
                  onPress={() => {
                    tapFeedback();
                    jumpTo({ year: shown.year, month });
                    setView('days');
                  }}
                  style={({ pressed }) => [styles.month, current && { backgroundColor: theme.primarySoft }, pressed && styles.pressed, !open && styles.disabled]}>
                  <ThemedText type={current ? 'bodySemiBold' : 'body'} themeColor={current ? 'primaryText' : 'text'}>
                    {new Date(shown.year, month, 1).toLocaleDateString(activeLocale(), { month: 'short' })}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </GestureDetector>
      ) : (
        <>
          <View style={styles.week}>
            {WEEK.map((day) => (
              <ThemedText key={day.getDay()} type="caption" themeColor="textSecondary" style={styles.weekday}>
                {day.toLocaleDateString(activeLocale(), { weekday: 'short' }).toUpperCase()}
              </ThemedText>
            ))}
          </View>
          <GestureDetector gesture={pager}>
            <View
              collapsable={false}
              style={styles.viewport}
              onLayout={({ nativeEvent }) => {
                const next = nativeEvent.layout.width;
                if (next === width) return;
                setWidth(next);
                position.set(-page * next);
              }}>
              {width > 0 ? (
                <Animated.View style={[StyleSheet.absoluteFill, strip]}>
                  {pages.map((offset) => (
                    <View key={offset} style={[styles.page, { left: offset * width, width }]}>
                      {days(addMonths(anchor, offset))}
                    </View>
                  ))}
                </Animated.View>
              ) : (
                days(shown)
              )}
            </View>
          </GestureDetector>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    gap: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingBottom: Spacing.one,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
    minHeight: MinTouchSize,
    paddingHorizontal: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  // The months beside this one stay hidden until a swipe brings them in.
  viewport: {
    height: GRID_HEIGHT,
    overflow: 'hidden',
  },
  page: {
    position: 'absolute',
    top: 0,
  },
  grid: {
    gap: Spacing.one,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekday: {
    width: CELL,
    textAlign: 'center',
    fontWeight: 600,
  },
  cell: {
    width: CELL,
    height: CELL,
  },
  day: {
    borderRadius: CELL / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  months: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  month: {
    flexBasis: '30%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MinTouchSize,
    borderRadius: Radius.pill,
  },
});
