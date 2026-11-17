import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipSelect } from '@/components/ui/chip-select';
import { EmptyState } from '@/components/ui/empty-state';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';

import { addExtraBlock, dropDecisionsFor, moveBlock, placeTask, placedMinutes, removeBlock, resizeBlock, setDecision } from '../lib/day-plan';
import { formatClock, formatDuration } from '../lib/time';
import { productivityStrings } from '../strings';
import { DECISION_ACTIONS, DEFAULT_RULES, type Block, type Decision, type DecisionAction, type ScheduleResult, type ScheduleRules, type ScheduleScenario, type ScheduleTask } from '../types';
import { AddTaskForm } from './add-task-form';
import { DayResult } from './day-result';
import { DaySummaryCard } from './day-summary-card';
import { DayTaskList } from './day-task-list';
import { DayTimeline } from './day-timeline';

export type DayPlannerProps = {
  windowStart: number;
  windowEnd: number;
  /** What the learner has to do. In a graded scenario these are given; in the free tool the learner adds them (`onAddTask`). */
  tasks: ScheduleTask[];
  /** Commitments already in the day (meetings, meals, the interruption once it has happened); the learner cannot move them. */
  fixed: ScheduleScenario['fixed'];
  blocks: Block[];
  /** Decisions about tasks that are not in the day (graded scenario). Omit in the free tool. */
  decisions?: Decision[];
  onChange: (next: { blocks: Block[]; decisions: Decision[] }) => void;
  /** The free tool only. */
  onAddTask?: (task: { title: string; minutes: number; priority: ScheduleTask['priority'] }) => void;
  /** The free tool only. The owner of the state also drops that task's blocks. */
  onRemoveTask?: (taskId: string) => void;
  /** After a check: the findings are shown beside the plan. */
  result?: ScheduleResult | null;
  readOnly?: boolean;
  /** The day's rules, for the live advice (break needs, longest stretch, free time to keep). Defaults to the standard rules. */
  rules?: ScheduleRules;
};

/** Side by side (tasks left, day right) from this width of the planner itself, not the window: it sits in cards of every width. */
const SIDE_BY_SIDE_MIN_WIDTH = 600;

type DecisionChoice = DecisionAction | 'later';

/**
 * The daily schedule builder: the tasks, the day as a timeline, and the controls to place and move work, all with taps (quarter-hour steppers,
 * no dragging). It shows clashes and what is left over as they happen, so an overpacked day looks overpacked before anything is checked. In a graded
 * scenario it also asks what to do about each task that did not fit, and after a check it shows the scores and findings in words.
 */
export function DayPlanner({ windowStart, windowEnd, tasks, fixed, blocks, decisions, onChange, onAddTask, onRemoveTask, result = null, readOnly = false, rules = DEFAULT_RULES }: DayPlannerProps) {
  const t = useLocalized(productivityStrings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const wide = width >= SIDE_BY_SIDE_MIN_WIDTH;
  const scenario: ScheduleScenario = { dayLabel: '', windowStart, windowEnd, fixed, tasks };
  const currentDecisions = decisions ?? [];
  // Blocks of a task that was removed elsewhere (the free tool) are not shown as a selection.
  const selected = blocks.some((block) => block.id === selectedId) ? selectedId : null;

  const emit = (nextBlocks: Block[], nextDecisions: Decision[] = currentDecisions) => onChange({ blocks: nextBlocks, decisions: nextDecisions });

  const place = (task: ScheduleTask) => {
    const placement = placeTask(scenario, task, blocks, newId());
    if (!placement) {
      setNote(t.dayNoRoom);
      return;
    }
    const { block } = placement;
    setNote(placement.fits ? t.dayPlacedNote(task.title, formatClock(block.start)) : t.dayPlacedPart(task.title, formatClock(block.start), formatDuration(block.minutes)));
    setSelectedId(block.id);
    emit(placement.blocks, dropDecisionsFor(currentDecisions, [task.id]));
  };

  const adjust = (task: ScheduleTask) => {
    const first = blocks.filter((block) => block.kind === 'task' && block.taskId === task.id).sort((a, b) => a.start - b.start)[0];
    if (first) setSelectedId(first.id);
  };

  const addExtra = (kind: 'break' | 'buffer') => {
    tapFeedback();
    const added = addExtraBlock(scenario, kind, kind === 'break' ? t.dayBreak : t.dayBuffer, blocks, newId());
    setNote(null);
    setSelectedId(added.block.id);
    emit(added.blocks);
  };

  const addBreakAt = (start: number) => {
    const block: Block = { id: newId(), kind: 'break', title: t.dayBreak, start, minutes: 15 };
    setNote(null);
    setSelectedId(block.id);
    emit([...blocks, block]);
  };

  const unplaced = decisions ? tasks.filter((task) => placedMinutes(task, blocks) === 0) : [];

  const taskColumn = (
    <View style={styles.column}>
      <ThemedText type="section" accessibilityRole="header">
        {t.dayTasksTitle}
      </ThemedText>
      {tasks.length === 0 ? (
        <Card>
          <EmptyState icon="add_task" title={t.dayToolEmptyTitle} message={onAddTask ? t.dayToolEmptyBody : t.dayTasksEmpty} />
        </Card>
      ) : (
        <DayTaskList tasks={tasks} blocks={blocks} onPlace={place} onAdjust={adjust} onRemoveTask={onRemoveTask} readOnly={readOnly} />
      )}
      {onAddTask && !readOnly && <AddTaskForm onAdd={onAddTask} count={tasks.length} />}
      {unplaced.length > 0 && (
        <View style={styles.column}>
          <ThemedText type="section" accessibilityRole="header">
            {t.planDecisions}
          </ThemedText>
          {unplaced.map((task) => {
            const choice: DecisionChoice = currentDecisions.find((decision) => decision.taskId === task.id)?.action ?? 'later';
            return (
              <Card key={task.id}>
                <ChipSelect<DecisionChoice>
                  label={t.dayDecisionFor(task.title)}
                  wrap
                  value={choice}
                  onChange={(next) => {
                    if (readOnly) return;
                    tapFeedback();
                    emit(blocks, setDecision(currentDecisions, task.id, next === 'later' ? null : next));
                  }}
                  options={[...DECISION_ACTIONS.map((action) => ({ value: action as DecisionChoice, label: t.dayDecisions[action] })), { value: 'later' as DecisionChoice, label: t.dayNoDecision }]}
                />
              </Card>
            );
          })}
        </View>
      )}
    </View>
  );

  const dayColumn = (
    <View style={styles.column}>
      <ThemedText type="section" accessibilityRole="header">
        {t.dayTimeline}
      </ThemedText>
      <DayTimeline
        scenario={scenario}
        blocks={blocks}
        selectedId={selected}
        onSelect={setSelectedId}
        onMove={(id, delta) => emit(moveBlock(blocks, id, delta))}
        onResize={(id, delta) => emit(resizeBlock(blocks, id, delta))}
        onRemove={(id) => {
          setSelectedId(null);
          setNote(null);
          emit(removeBlock(blocks, id));
        }}
        onAddBreakAt={addBreakAt}
        readOnly={readOnly}
      />
      {blocks.length === 0 && (
        <ThemedText type="secondary" themeColor="textSecondary">
          {t.dayNothing}
        </ThemedText>
      )}
      {!readOnly && (
        <View style={styles.extras}>
          <Button title={t.dayAddBreak} icon="coffee" size="small" variant="outline" onPress={() => addExtra('break')} />
          <Button title={t.dayAddBuffer} icon="hourglass_empty" size="small" variant="outline" onPress={() => addExtra('buffer')} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.root} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <ThemedText type="caption" themeColor="textSecondary">
        {t.dayWindow(formatClock(windowStart), formatClock(windowEnd))}
      </ThemedText>
      <DaySummaryCard scenario={scenario} blocks={blocks} rules={rules} />
      {note && <Notice tone="info" message={note} />}
      {wide ? (
        <View style={styles.wide}>
          <View style={styles.tasksPane}>{taskColumn}</View>
          <View style={styles.dayPane}>{dayColumn}</View>
        </View>
      ) : (
        <>
          {taskColumn}
          {dayColumn}
        </>
      )}
      {result && <DayResult result={result} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  column: { gap: Spacing.two },
  wide: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.four },
  tasksPane: { flex: 2 },
  dayPane: { flex: 3 },
  extras: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
