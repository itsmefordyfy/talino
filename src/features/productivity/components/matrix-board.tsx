import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect, type ChipOption } from '@/components/ui/chip-select';
import { Icon, type IconName } from '@/components/ui/icon';
import { TextField } from '@/components/ui/text-field';
import { MinTouchSize, Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { tapFeedback } from '@/lib/haptics';

import { quadrantFor } from '../lib/matrix';
import { MAX_TITLE } from '../lib/state';
import { productivityStrings } from '../strings';
import { QUADRANTS, type MatrixPlacements, type Quadrant } from '../types';

export type MatrixBoardProps = {
  /** The tasks on the board. A task with no placement is "not sorted yet". */
  tasks: { id: string; title: string; detail?: string }[];
  placements: MatrixPlacements;
  /** A task moved to a box, or taken off the board (`null`). */
  onMove: (taskId: string, to: Quadrant | null) => void;
  /** After a check: which tasks sit right or need another look. Shown with text and an icon, never by colour alone. */
  verdicts?: Record<string, 'right' | 'wrong'>;
  readOnly?: boolean;
  /** The free tool only: lets the learner add and remove their own tasks. The graded exercise passes neither. */
  onAdd?: (title: string) => void;
  onRemove?: (taskId: string) => void;
  /** The two-questions helper for a learner who is unsure (on by default). */
  helper?: boolean;
};

const BOX_LOOK: Record<Quadrant, { tone: Tone; icon: IconName }> = {
  do: { tone: 'red', icon: 'bolt' },
  plan: { tone: 'indigo', icon: 'event' },
  delegate: { tone: 'violet', icon: 'group_add' },
  drop: { tone: 'neutral', icon: 'do_not_disturb' },
};

/** Below this width (or with very large text) the four boxes stack in one column instead of two. */
const TWO_COLUMN_MIN_WIDTH = 300;
const LARGE_TEXT_SCALE = 1.35;

type Task = MatrixBoardProps['tasks'][number];
type Group = Quadrant | 'unplaced';

/**
 * The Eisenhower matrix: four boxes and a "not sorted yet" tray. There is no drag and drop: a task is tapped to select it, and a panel
 * right below its box offers the four boxes (plus "take it off the board"), so it works the same with a finger, a keyboard and a screen reader.
 */
export function MatrixBoard({ tasks, placements, onMove, verdicts, readOnly = false, onAdd, onRemove, helper = true }: MatrixBoardProps) {
  const t = useLocalized(productivityStrings);
  const { fontScale } = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const placed = (task: Task): Quadrant | null => {
    const box = placements[task.id];
    return box && (QUADRANTS as readonly string[]).includes(box) ? box : null;
  };
  const byGroup: Record<Group, Task[]> = { do: [], plan: [], delegate: [], drop: [], unplaced: [] };
  for (const task of tasks) byGroup[placed(task) ?? 'unplaced'].push(task);

  const selected = readOnly ? null : (tasks.find((task) => task.id === selectedId) ?? null);
  const selectedGroup: Group | null = selected ? (placed(selected) ?? 'unplaced') : null;
  const columns = fontScale >= LARGE_TEXT_SCALE || (width > 0 && width < TWO_COLUMN_MIN_WIDTH) ? 1 : 2;

  const rows: Quadrant[][] = [];
  for (let index = 0; index < QUADRANTS.length; index += columns) rows.push(QUADRANTS.slice(index, index + columns) as Quadrant[]);

  const toggle = (taskId: string) => setSelectedId((current) => (current === taskId ? null : taskId));
  const panel = selected ? (
    <MovePanel
      key={selected.id}
      task={selected}
      current={placed(selected)}
      helper={helper}
      onMove={(to) => {
        onMove(selected.id, to);
        setSelectedId(null);
      }}
      onRemove={
        onRemove
          ? () => {
              onRemove(selected.id);
              setSelectedId(null);
            }
          : undefined
      }
    />
  ) : null;

  const box = (quadrant: Quadrant) => (
    <Box key={quadrant} group={quadrant} tasks={byGroup[quadrant]} selectedId={selected?.id ?? null} verdicts={verdicts} readOnly={readOnly} onToggle={toggle} />
  );

  return (
    <View style={styles.root} onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}>
      {onAdd && !readOnly ? <AddRow onAdd={onAdd} /> : null}
      {tasks.length === 0 ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {t.matrixEmpty}
        </ThemedText>
      ) : readOnly ? null : (
        <ThemedText type="secondary" themeColor="textSecondary">
          {byGroup.unplaced.length > 0 ? `${t.matrixCount(tasks.length - byGroup.unplaced.length, tasks.length)}. ${t.matrixTapToSort}` : t.matrixCount(tasks.length, tasks.length)}
        </ThemedText>
      )}

      {byGroup.unplaced.length > 0 ? (
        <>
          <Box group="unplaced" tasks={byGroup.unplaced} selectedId={selected?.id ?? null} verdicts={verdicts} readOnly={readOnly} onToggle={toggle} />
          {selectedGroup === 'unplaced' ? panel : null}
        </>
      ) : null}

      {rows.map((row, index) => (
        <View key={index} style={styles.rowWrap}>
          <View style={styles.row}>{row.map(box)}</View>
          {selectedGroup && selectedGroup !== 'unplaced' && row.includes(selectedGroup) ? panel : null}
        </View>
      ))}
    </View>
  );
}

type BoxProps = {
  group: Group;
  tasks: Task[];
  selectedId: string | null;
  verdicts?: Record<string, 'right' | 'wrong'>;
  readOnly: boolean;
  onToggle: (taskId: string) => void;
};

function Box({ group, tasks, selectedId, verdicts, readOnly, onToggle }: BoxProps) {
  const t = useLocalized(productivityStrings);
  const theme = useTheme();
  const tones = useTones();
  const look = group === 'unplaced' ? null : BOX_LOOK[group];
  const tone = look ? tones[look.tone] : null;
  const title = group === 'unplaced' ? t.matrixUnplaced : t.quadrants[group].title;
  const subtitle = group === 'unplaced' ? null : t.quadrants[group].subtitle;
  return (
    <View
      style={[styles.box, group === 'unplaced' ? styles.tray : styles.cell, { backgroundColor: tone ? tone.soft : theme.backgroundElement, borderColor: tone ? tone.ink : theme.border }, group === 'unplaced' && styles.trayBorder]}>
      <View style={styles.boxHeader}>
        {look && tone ? <Icon name={look.icon} size={18} tint={tone.ink} /> : <Icon name="inbox" size={18} color="textSecondary" />}
        <View style={styles.boxTitles} accessible accessibilityRole="header" accessibilityLabel={t.matrixBoxLabel(title, subtitle ?? '', tasks.length)}>
          <ThemedText type="cardTitle" style={tone ? { color: tone.ink } : undefined}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText type="caption" themeColor="textSecondary">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
      </View>
      {tasks.length === 0 ? (
        <ThemedText type="secondary" themeColor="textTertiary">
          {t.matrixBoxEmpty}
        </ThemedText>
      ) : (
        <View style={styles.tasks}>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} box={group === 'unplaced' ? null : group} selected={selectedId === task.id} verdict={verdicts?.[task.id]} readOnly={readOnly} onPress={() => onToggle(task.id)} />
          ))}
        </View>
      )}
    </View>
  );
}

type TaskRowProps = { task: Task; box: Quadrant | null; selected: boolean; verdict?: 'right' | 'wrong'; readOnly: boolean; onPress: () => void };

function TaskRow({ task, box, selected, verdict, readOnly, onPress }: TaskRowProps) {
  const t = useLocalized(productivityStrings);
  const theme = useTheme();
  const verdictText = verdict === 'right' ? t.matrixRight : verdict === 'wrong' ? t.matrixWrong : null;
  const label = [box ? t.matrixInBox(task.title, t.quadrants[box].title) : task.title, task.detail, verdictText].filter(Boolean).join('. ');
  return (
    <Pressable
      accessibilityRole={readOnly ? 'text' : 'button'}
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: readOnly }}
      disabled={readOnly}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.task,
        { backgroundColor: selected ? theme.primarySoft : theme.backgroundElement, borderColor: selected ? theme.primary : theme.border },
        selected && styles.taskSelected,
        pressed && styles.pressed,
      ]}>
      <View style={styles.taskLine}>
        {selected ? <Icon name="check" size={16} color="primary" /> : null}
        <ThemedText type="bodySemiBold" style={styles.taskTitle}>
          {task.title}
        </ThemedText>
      </View>
      {task.detail ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {task.detail}
        </ThemedText>
      ) : null}
      {verdict ? (
        <View style={styles.verdict}>
          <Icon name={verdict === 'right' ? 'check_circle' : 'error'} size={16} color={verdict === 'right' ? 'statusOk' : 'statusWarn'} filled />
          <ThemedText type="caption" themeColor={verdict === 'right' ? 'statusOk' : 'statusWarn'}>
            {verdictText}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );
}

type MovePanelProps = { task: Task; current: Quadrant | null; helper: boolean; onMove: (to: Quadrant | null) => void; onRemove?: () => void };

function MovePanel({ task, current, helper, onMove, onRemove }: MovePanelProps) {
  const t = useLocalized(productivityStrings);
  const theme = useTheme();
  const [asking, setAsking] = useState(false);
  const [urgent, setUrgent] = useState<boolean | null>(null);
  const [important, setImportant] = useState<boolean | null>(null);
  const suggestion: Quadrant | null = urgent !== null && important !== null ? quadrantFor(urgent, important) : null;
  const options: ChipOption<Quadrant>[] = QUADRANTS.map((quadrant) => ({ value: quadrant, label: t.quadrants[quadrant].title, icon: BOX_LOOK[quadrant].icon, tone: BOX_LOOK[quadrant].tone }));
  const yesNo: ChipOption<'yes' | 'no'>[] = [
    { value: 'yes', label: t.matrixYes },
    { value: 'no', label: t.matrixNo },
  ];
  const answer = (value: boolean | null) => (value === null ? null : value ? 'yes' : 'no');
  return (
    <View style={[styles.panel, { backgroundColor: theme.backgroundElement, borderColor: theme.primary }]}>
      <ChipSelect label={t.matrixMoveTo(task.title)} value={current} onChange={(quadrant) => onMove(quadrant)} options={options} wrap />
      <View style={styles.panelButtons}>
        {current ? <Button size="small" variant="outline" icon="close" title={t.matrixClear} onPress={() => onMove(null)} /> : null}
        {onRemove ? <Button size="small" variant="danger" icon="delete" title={t.matrixRemoveTask} accessibilityLabel={t.matrixRemove(task.title)} onPress={onRemove} /> : null}
        {helper ? <Button size="small" variant="ghost" icon={asking ? 'close' : 'help'} title={asking ? t.matrixAskClose : t.matrixAskOpen} onPress={() => setAsking((open) => !open)} /> : null}
      </View>
      {helper && asking ? (
        <View style={styles.questions}>
          <ChipSelect label={t.matrixUrgent} value={answer(urgent)} onChange={(value) => setUrgent(value === 'yes')} options={yesNo} wrap />
          <ChipSelect label={t.matrixImportant} value={answer(important)} onChange={(value) => setImportant(value === 'yes')} options={yesNo} wrap />
          {suggestion ? (
            <View style={styles.suggestion} accessibilityLiveRegion="polite">
              <ThemedText type="bodySemiBold">{t.matrixSuggest(t.quadrants[suggestion].title)}</ThemedText>
              <Button size="small" title={t.matrixPutIn(t.quadrants[suggestion].title)} onPress={() => onMove(suggestion)} />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function AddRow({ onAdd }: { onAdd: (title: string) => void }): ReactNode {
  const t = useLocalized(productivityStrings);
  const [text, setText] = useState('');
  const submit = () => {
    const title = text.trim();
    if (!title) return;
    tapFeedback();
    onAdd(title.slice(0, MAX_TITLE));
    setText('');
  };
  return (
    <View style={styles.addRow}>
      <View style={styles.addField}>
        <TextField label={t.matrixAddLabel} value={text} onChangeText={setText} placeholder={t.matrixAddPlaceholder} maxLength={MAX_TITLE} returnKeyType="done" onSubmitEditing={submit} />
      </View>
      <Button title={t.matrixAdd} icon="add" onPress={submit} disabled={!text.trim()} style={styles.addButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  rowWrap: { gap: Spacing.three },
  row: { flexDirection: 'row', gap: Spacing.two, alignItems: 'stretch' },
  box: { gap: Spacing.two, padding: Spacing.two + 2, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  cell: { flex: 1, minWidth: 0 },
  tray: { alignSelf: 'stretch' },
  trayBorder: { borderStyle: 'dashed', borderWidth: 1 },
  boxHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.one + 2 },
  boxTitles: { flex: 1, gap: 0 },
  tasks: { gap: Spacing.two },
  task: { minHeight: MinTouchSize, gap: Spacing.half, paddingVertical: Spacing.two, paddingHorizontal: Spacing.two + 2, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1, justifyContent: 'center' },
  taskSelected: { borderWidth: 2 },
  taskLine: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  taskTitle: { flexShrink: 1 },
  verdict: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  pressed: { opacity: 0.7 },
  panel: { gap: Spacing.two + 2, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 1.5 },
  panelButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  questions: { gap: Spacing.two + 2 },
  suggestion: { gap: Spacing.two, alignItems: 'flex-start' },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  addField: { flex: 1 },
  addButton: { marginBottom: 0 },
});
