import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { placedMinutes, remainingMinutes } from '../lib/day-plan';
import { formatClock, formatDuration } from '../lib/time';
import { productivityStrings } from '../strings';
import type { Block, Priority, ScheduleTask } from '../types';
import { PRIORITY_ICONS } from './day-kinds';

export type DayTaskListProps = {
  tasks: ScheduleTask[];
  blocks: Block[];
  onPlace: (task: ScheduleTask) => void;
  /** Selects the task's first block in the day so its time and length can be changed. */
  onAdjust: (task: ScheduleTask) => void;
  /** The free tool only. */
  onRemoveTask?: (taskId: string) => void;
  readOnly?: boolean;
};

const PRIORITY_LOOK: Record<Priority, { color: ThemeColor; background: ThemeColor }> = {
  high: { color: 'statusDanger', background: 'statusDangerSoft' },
  medium: { color: 'statusWarn', background: 'statusWarnSoft' },
  low: { color: 'textSecondary', background: 'backgroundSelected' },
};

/** "To do today": each task with its estimate, priority and whether (and where) it is placed in the day. */
export function DayTaskList({ tasks, blocks, onPlace, onAdjust, onRemoveTask, readOnly = false }: DayTaskListProps) {
  const t = useLocalized(productivityStrings);
  return (
    <View style={styles.list}>
      {tasks.map((task) => {
        const placed = placedMinutes(task, blocks);
        const left = remainingMinutes(task, blocks);
        const first = blocks.filter((block) => block.kind === 'task' && block.taskId === task.id).sort((a, b) => a.start - b.start)[0];
        const status = placed === 0 ? t.dayNotPlaced : left === 0 ? t.dayPlacedLine(formatDuration(placed), formatClock(first!.start)) : t.dayPartial(formatDuration(placed), formatDuration(task.minutes));
        const look = PRIORITY_LOOK[task.priority];
        return (
          <Card key={task.id} style={styles.card}>
            <View style={styles.head}>
              <ThemedText type="cardTitle" style={styles.title}>
                {task.title}
              </ThemedText>
              {onRemoveTask && !readOnly && <IconButton icon="close" accessibilityLabel={t.dayRemove(task.title)} color="textSecondary" onPress={() => onRemoveTask(task.id)} />}
            </View>
            <View style={styles.meta}>
              <ThemedText type="secondary" themeColor="textSecondary" tabular>
                {t.dayEstimate(formatDuration(task.minutes))}
              </ThemedText>
              {task.deadline !== undefined && (
                <ThemedText type="secondary" themeColor="textSecondary" tabular>
                  {t.dayDeadline(formatClock(task.deadline))}
                </ThemedText>
              )}
            </View>
            <View style={styles.badges}>
              <Badge label={t.dayPriorityTag(t.dayPriorities[task.priority])} color={look.color} background={look.background} />
              {task.mustDo && (
                <View style={styles.must}>
                  <Icon name={PRIORITY_ICONS.high} size={14} color="statusDanger" />
                  <ThemedText type="caption" themeColor="statusDanger">
                    {t.dayMust}
                  </ThemedText>
                </View>
              )}
            </View>
            <View style={styles.foot}>
              <View style={styles.status} accessible accessibilityLabel={`${task.title}: ${status}`}>
                <Icon name={left === 0 ? 'check_circle' : 'radio_button_unchecked'} size={18} color={left === 0 ? 'statusOk' : 'textSecondary'} />
                <ThemedText type="secondarySemiBold" themeColor={left === 0 ? 'statusOk' : 'textSecondary'} style={styles.statusText}>
                  {status}
                </ThemedText>
              </View>
              {!readOnly && (
                <View style={styles.actions}>
                  {placed > 0 && (
                    <Button
                      title={t.dayAdjust}
                      size="small"
                      variant="outline"
                      accessibilityLabel={`${t.dayAdjust} ${task.title}`}
                      onPress={() => {
                        tapFeedback();
                        onAdjust(task);
                      }}
                    />
                  )}
                  {left > 0 && (
                    <Button
                      title={t.dayPlace}
                      size="small"
                      variant="secondary"
                      icon="add_task"
                      accessibilityLabel={`${t.dayPlace}: ${task.title}`}
                      onPress={() => {
                        tapFeedback();
                        onPlace(task);
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  card: { gap: Spacing.two },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  title: { flex: 1 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', columnGap: Spacing.three },
  badges: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: Spacing.three, rowGap: Spacing.one },
  must: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  foot: { gap: Spacing.two },
  status: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  statusText: { flex: 1 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
