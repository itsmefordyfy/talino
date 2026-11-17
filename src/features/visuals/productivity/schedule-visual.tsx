import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { DayPlanner, EMPTY_DAY, formatClock, MAX_TOOL_TASKS, productivityStrings, readDayState, removeTaskBlocks, Stepper, writeDayState, type DayToolState } from '@/features/productivity';
import { useLocalized } from '@/hooks/use-strings';
import { newId } from '@/lib/id';

import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { productivityVisualStrings } from './strings';

/** The day's hours move in half-hours. */
const HOURS_STEP = 30;
const MIN_DAY_SPAN = 60;
const MAX_BLOCKS = MAX_TOOL_TASKS * 3;

/**
 * The free daily schedule builder: the learner's own tasks, plan and day hours, kept on this phone and found again next time. Nothing here is
 * scored (there is no scenario); the planner shows clashes, long stretches of work and the free time left as plain advice.
 */
export function ScheduleVisual({ compact }: VisualProps) {
  const t = useLocalized(productivityStrings);
  const v = useLocalized(productivityVisualStrings).schedule;
  const query = useDbQuery(['productivity', 'day'], readDayState);
  const save = useDbMutation((db, next: DayToolState) => writeDayState(db, next), { notify: false });
  // What the learner sees is kept here and written on every change, so quick taps never build on a stale read.
  const [local, setLocal] = useState<DayToolState | null>(null);
  const day = local ?? query.data ?? null;

  const update = (next: DayToolState) => {
    setLocal(next);
    save.mutate(next);
  };

  let body;
  if (!day) {
    body = query.isError ? (
      <View style={styles.state}>
        <Notice tone="danger" message={t.dayToolLoadFailed} />
        <Button title={t.dayToolRetry} variant="secondary" size="small" onPress={() => void query.refetch()} />
      </View>
    ) : (
      <View style={styles.state} accessibilityLabel={t.dayTimeline} accessibilityRole="progressbar">
        <SkeletonBlock height={72} />
        <SkeletonBlock height={96} />
        <SkeletonBlock height={96} />
      </View>
    );
  } else {
    body = (
      <DayPlanner
        windowStart={day.windowStart}
        windowEnd={day.windowEnd}
        tasks={day.tasks}
        fixed={[]}
        blocks={day.blocks}
        onChange={({ blocks }) => {
          if (blocks.length > MAX_BLOCKS) return;
          update({ ...day, blocks });
        }}
        onAddTask={(task) => update({ ...day, tasks: [...day.tasks, { id: newId(), ...task }] })}
        onRemoveTask={(taskId) => update({ ...day, tasks: day.tasks.filter((task) => task.id !== taskId), blocks: removeTaskBlocks(day.blocks, taskId) })}
      />
    );
  }

  const hours = day && (
    <View style={styles.controls}>
      <View style={styles.hours}>
        <Stepper
          label={t.dayHoursStart}
          valueText={formatClock(day.windowStart)}
          decrementLabel={t.dayHoursEarlier(t.dayHoursStart)}
          incrementLabel={t.dayHoursLater(t.dayHoursStart)}
          canDecrement={day.windowStart > 0}
          canIncrement={day.windowStart + HOURS_STEP <= day.windowEnd - MIN_DAY_SPAN}
          onDecrement={() => update({ ...day, windowStart: Math.max(0, day.windowStart - HOURS_STEP) })}
          onIncrement={() => update({ ...day, windowStart: Math.min(day.windowEnd - MIN_DAY_SPAN, day.windowStart + HOURS_STEP) })}
        />
        <Stepper
          label={t.dayHoursEnd}
          valueText={formatClock(day.windowEnd)}
          decrementLabel={t.dayHoursEarlier(t.dayHoursEnd)}
          incrementLabel={t.dayHoursLater(t.dayHoursEnd)}
          canDecrement={day.windowEnd - HOURS_STEP >= day.windowStart + MIN_DAY_SPAN}
          canIncrement={day.windowEnd < 1440}
          onDecrement={() => update({ ...day, windowEnd: Math.max(day.windowStart + MIN_DAY_SPAN, day.windowEnd - HOURS_STEP) })}
          onIncrement={() => update({ ...day, windowEnd: Math.min(1440, day.windowEnd + HOURS_STEP) })}
        />
      </View>
      {save.isError && (
        <Notice tone="danger">
          <ThemedText type="secondary">{t.dayToolSaveFailed}</ThemedText>
          <Button title={t.dayToolRetry} variant="secondary" size="small" onPress={() => save.mutate(day)} />
        </Notice>
      )}
      {(day.tasks.length > 0 || day.blocks.length > 0) && (
        <Button
          title={t.dayToolClear}
          icon="delete"
          variant="ghost"
          size="small"
          onPress={() =>
            Alert.alert(t.dayToolClearTitle, t.dayToolClearBody, [
              { text: t.dayToolCancel, style: 'cancel' },
              { text: t.dayToolClear, style: 'destructive', onPress: () => update({ ...EMPTY_DAY, windowStart: day.windowStart, windowEnd: day.windowEnd }) },
            ])
          }
        />
      )}
      <ThemedText type="caption" themeColor="textSecondary">
        {`${t.dayToolSavedHere} ${t.dayToolNoCheck}`}
      </ThemedText>
    </View>
  );

  return (
    <VisualFrame title={v.title} description={v.description} compact={compact} caption={compact ? undefined : t.dayIntro} controls={hours || undefined}>
      {body}
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  state: { gap: Spacing.two, alignItems: 'stretch' },
  controls: { gap: Spacing.three },
  hours: { flexDirection: 'row', flexWrap: 'wrap', columnGap: Spacing.four, rowGap: Spacing.three },
});
