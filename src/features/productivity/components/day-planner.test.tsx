import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act, useState } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { productivityStrings } from '../strings';
import type { Block, Decision, ScheduleResult, ScheduleTask } from '../types';
import { DayPlanner, type DayPlannerProps } from './day-planner';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
let mockIds = 0;
// expo-crypto is native; ids that are unique for the run stand in.
jest.mock('@/lib/id', () => ({ newId: () => `test-id-${(mockIds += 1)}`, nowTimestamp: () => new Date().toISOString() }));
store.dispatch(languageChanged('en'));

const t = productivityStrings.en;
const H = (hours: number, minutes = 0) => hours * 60 + minutes;

const tasks: ScheduleTask[] = [
  { id: 'report', title: 'Finish the report', minutes: 60, priority: 'high', mustDo: true, deadline: H(15) },
  { id: 'mail', title: 'Clear the inbox', minutes: 30, priority: 'low' },
];
const fixed: DayPlannerProps['fixed'] = [
  { id: 'standup', title: 'Stand-up', start: H(9), minutes: 15, kind: 'meeting' },
  { id: 'lunch', title: 'Lunch', start: H(12), minutes: 60, kind: 'meal' },
];

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
type Renderer = ReturnType<typeof createRoot>;

function textOf(node: TestInstance | string): string {
  return typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join('');
}
const findAll = (renderer: Renderer, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
const has = (renderer: Renderer, label: string) => findAll(renderer, label).length > 0;

async function press(renderer: Renderer, label: string, index = 0) {
  const node = findAll(renderer, label)[index];
  if (!node) throw new Error(`nothing labelled "${label}"`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no onPress`);
  const onPress = fiber.memoizedProps?.onPress as () => void;
  await act(async () => {
    onPress();
  });
}

async function type(renderer: Renderer, label: string, value: string) {
  const [node] = findAll(renderer, label);
  const onChangeText = node!.props.onChangeText as (text: string) => void;
  await act(async () => onChangeText(value));
}

type Change = { blocks: Block[]; decisions: Decision[] };

/** The planner holding its own plan, like its two owners do, and reporting each change. */
function Harness({ initialBlocks = [], withDecisions = false, extra, onChange }: { initialBlocks?: Block[]; withDecisions?: boolean; extra?: Partial<DayPlannerProps>; onChange: (change: Change) => void }) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  return (
    <DayPlanner
      windowStart={H(8)}
      windowEnd={H(16)}
      tasks={tasks}
      fixed={fixed}
      blocks={blocks}
      decisions={withDecisions ? decisions : undefined}
      onChange={(next) => {
        setBlocks(next.blocks);
        setDecisions(next.decisions);
        onChange(next);
      }}
      {...extra}
    />
  );
}

async function mount(props: Parameters<typeof Harness>[0] extends infer P ? Partial<P> : never = {}) {
  const onChange = jest.fn<(change: Change) => void>();
  const renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <Harness onChange={onChange} {...props} />
      </Provider>,
    );
  });
  return { renderer, onChange, text: () => textOf(renderer.container), last: () => onChange.mock.calls[onChange.mock.calls.length - 1]![0] };
}

const block = (id: string, taskId: string, start: number, minutes: number, title = 'Block'): Block => ({ id, kind: 'task', taskId, title, start, minutes });
const placeLabel = (title: string) => `${t.dayPlace}: ${title}`;

beforeEach(() => {
  mockIds = 0;
  jest.clearAllMocks();
});

describe('the day planner', () => {
  test('shows the tasks with estimate, priority and "not placed", the commitments with their kind, and the day in words', async () => {
    const view = await mount();
    const shown = view.text();
    expect(shown).toContain(t.dayTasksTitle);
    expect(shown).toContain('Finish the report');
    expect(shown).toContain(t.dayEstimate('1 h'));
    expect(shown).toContain(t.dayPriorityTag(t.dayPriorities.high));
    expect(shown).toContain(t.dayPriorityTag(t.dayPriorities.low));
    expect(shown).toContain(t.dayMust);
    expect(shown).toContain(t.dayNotPlaced);
    expect(shown).toContain('Stand-up');
    expect(shown).toContain(t.dayFixedKinds.meeting);
    expect(shown).toContain(t.dayFixedKinds.meal);
    expect(shown).toContain(t.dayWindow('8:00 AM', '4:00 PM'));
    // Lunch is an hour of rest; nothing is planned yet.
    expect(shown).toContain(t.daySummary('0 min', '1 h', '6 h 45 min'));
    expect(shown).toContain(t.dayFree('1 h'));
    await act(async () => view.renderer.unmount());
  });

  test('placing a task puts it in the free time on the timeline, marks it placed and updates the summary', async () => {
    const view = await mount();
    await press(view.renderer, placeLabel('Finish the report'));
    // The hour fits in the free stretch before the 9:00 stand-up, the first place with room.
    expect(view.last().blocks).toEqual([expect.objectContaining({ kind: 'task', taskId: 'report', start: H(8), minutes: 60 })]);
    const shown = view.text();
    expect(shown).toContain(t.dayRange('8:00 AM', '9:00 AM'));
    expect(shown).toContain(t.dayPlacedLine('1 h', '8:00 AM'));
    expect(shown).toContain(t.dayPlacedNote('Finish the report', '8:00 AM'));
    expect(shown).toContain(t.daySummary('1 h', '1 h', '5 h 45 min'));
    // Placed: the place button is gone, an adjust button takes its place, and nothing clashes.
    expect(has(view.renderer, placeLabel('Finish the report'))).toBe(false);
    expect(has(view.renderer, `${t.dayAdjust} Finish the report`)).toBe(true);
    expect(shown).not.toContain(t.dayConflictTag);
    await act(async () => view.renderer.unmount());
  });

  test('a placed block moves later and longer in quarter-hours, and a clash with a commitment is flagged in words', async () => {
    const view = await mount();
    await press(view.renderer, placeLabel('Finish the report'));
    // The new block is selected, so its steppers are showing.
    await press(view.renderer, t.dayLater('Finish the report'));
    expect(view.last().blocks[0]).toMatchObject({ start: H(8, 15), minutes: 60 });
    await press(view.renderer, t.dayLonger('Finish the report'));
    expect(view.last().blocks[0]).toMatchObject({ start: H(8, 15), minutes: 75 });
    expect(view.text()).toContain(`${t.dayConflictTag}: ${t.dayConflict('Finish the report', 'Stand-up')}`);
    expect(view.text()).toContain(t.dayAdviceLevel.problem);
    await press(view.renderer, t.dayShorter('Finish the report'));
    await press(view.renderer, t.dayEarlier('Finish the report'));
    expect(view.last().blocks[0]).toMatchObject({ start: H(8), minutes: 60 });
    expect(view.text()).not.toContain(t.dayConflictTag);
    await act(async () => view.renderer.unmount());
  });

  test('a block outside the day is flagged, and an overpacked day shows its problems before any check', async () => {
    const view = await mount({
      initialBlocks: [block('a', 'report', H(15, 30), 60, 'Finish the report'), block('b', 'mail', H(9, 15), 180, 'Clear the inbox')],
      extra: { rules: { maxFocusRun: 120, minBreakMinutes: 10, minBreakTotal: 30, maxPlannedMinutes: 200, minSlack: 20 } },
    });
    const shown = view.text();
    expect(shown).toContain(`${t.dayConflictTag}: ${t.dayOutside('Finish the report')}`);
    expect(shown).toContain(t.dayAdvice({ code: 'outside', level: 'problem', params: { count: 1 } }));
    expect(shown).toContain(t.dayAdvice({ code: 'overPacked', level: 'problem', params: { planned: 240, limit: 200 } }));
    expect(shown).toContain(t.dayAdvice({ code: 'longRun', level: 'problem', params: { minutes: 195, limit: 120 } }));
    expect(shown).toContain(t.dayWatchTitle);
    await act(async () => view.renderer.unmount());
  });

  test('adds a break and a buffer, and removes a block', async () => {
    const view = await mount();
    await press(view.renderer, t.dayAddBreak);
    expect(view.last().blocks).toEqual([expect.objectContaining({ kind: 'break', start: H(8), minutes: 15, title: t.dayBreak })]);
    await press(view.renderer, t.dayAddBuffer);
    expect(view.last().blocks.map((item) => item.kind)).toEqual(['break', 'buffer']);
    expect(view.last().blocks[1]!.start).toBe(H(8, 15));
    await press(view.renderer, t.dayRemove(t.dayBuffer));
    expect(view.last().blocks.map((item) => item.kind)).toEqual(['break']);
    await act(async () => view.renderer.unmount());
  });

  test('a free stretch can take a break right there', async () => {
    const view = await mount();
    await press(view.renderer, `${t.dayGapAdd}, ${t.dayRange('9:15 AM', '12:00 PM')}`);
    expect(view.last().blocks).toEqual([expect.objectContaining({ kind: 'break', start: H(9, 15) })]);
    await act(async () => view.renderer.unmount());
  });

  test('with decisions on, every task not in the day asks what to do, and a task placed no longer does', async () => {
    const view = await mount({ withDecisions: true });
    expect(view.text()).toContain(t.planDecisions);
    expect(view.text()).toContain(t.dayDecisionFor('Clear the inbox'));
    await press(view.renderer, t.dayDecisions.defer, 1);
    expect(view.last().decisions).toEqual([{ taskId: 'mail', action: 'defer' }]);
    await press(view.renderer, t.dayDecisions.decline, 1);
    expect(view.last().decisions).toEqual([{ taskId: 'mail', action: 'decline' }]);
    await press(view.renderer, t.dayNoDecision, 1);
    expect(view.last().decisions).toEqual([]);
    await press(view.renderer, t.dayDecisions.automate, 1);
    await press(view.renderer, placeLabel('Clear the inbox'));
    expect(view.last().decisions).toEqual([]);
    expect(view.text()).not.toContain(t.dayDecisionFor('Clear the inbox'));
    await act(async () => view.renderer.unmount());
  });

  test('without decisions (the free tool) there is no "not in your day" section', async () => {
    const view = await mount();
    expect(view.text()).not.toContain(t.planDecisions);
    await act(async () => view.renderer.unmount());
  });

  test('tells the learner when no free time is left to place a task in', async () => {
    const full = [block('a', 'x', H(8), 60), block('b', 'x', H(9, 15), 165), block('c', 'x', H(13), 180)];
    const view = await mount({ initialBlocks: full });
    await press(view.renderer, placeLabel('Finish the report'));
    expect(view.text()).toContain(t.dayNoRoom);
    expect(view.onChange).not.toHaveBeenCalled();
    await act(async () => view.renderer.unmount());
  });

  test('after a check the scores are bars with words and the findings are grouped, in sentences', async () => {
    const result: ScheduleResult = {
      scores: { prioritization: 90, timeAllocation: 40, realisticPlanning: 20, decisionMaking: 100 },
      overall: 62,
      blockers: [],
      findings: [
        { code: 'overlap', level: 'blocker', dimension: 'realisticPlanning', params: { a: 'Report', b: 'Stand-up' } },
        { code: 'tooShort', level: 'issue', dimension: 'timeAllocation', params: { task: 'Report', minutes: 30, estimate: 60 } },
        { code: 'allFit', level: 'good', dimension: 'decisionMaking', params: {} },
      ],
      passed: false,
      totals: { planned: 30, rest: 60, slack: 300 },
    };
    const view = await mount({ extra: { result } });
    const shown = view.text();
    expect(shown).toContain(t.planOverall(62));
    expect(shown).toContain(t.planScore(t.dimensions.timeAllocation, 40));
    expect(shown).not.toContain(t.dimensions.interruptions);
    expect(shown).toContain(t.dayScoreLow);
    expect(shown).toContain(t.dayScoreOk);
    expect(shown).toContain(t.planBlockers);
    expect(shown).toContain(t.findings(result.findings[0]!));
    expect(shown).toContain(t.planNotes);
    expect(shown).toContain(t.planGood);
    expect(has(view.renderer, `${t.planCheckStatus.blocker}: ${t.findings(result.findings[0]!)}`)).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('read only: no controls, but the plan and its flags are still shown', async () => {
    const view = await mount({ initialBlocks: [block('a', 'report', H(8, 30), 60, 'Finish the report')], extra: { readOnly: true } });
    expect(has(view.renderer, placeLabel('Finish the report'))).toBe(false);
    expect(view.text()).not.toContain(t.dayAddBreak);
    expect(view.text()).toContain(`${t.dayConflictTag}: ${t.dayConflict('Finish the report', 'Stand-up')}`);
    await act(async () => view.renderer.unmount());
  });
});

describe('the free tool: adding and removing tasks', () => {
  test('an empty list says what to do next and the form adds a task with name, estimate and priority', async () => {
    const onAddTask = jest.fn();
    const view = await mount({ extra: { tasks: [], onAddTask } });
    expect(view.text()).toContain(t.dayToolEmptyTitle);
    expect(view.text()).toContain(t.dayToolEmptyBody);
    await press(view.renderer, t.dayAddTask);
    expect(onAddTask).not.toHaveBeenCalled();
    expect(view.text()).toContain(t.dayNameRequired);
    await type(view.renderer, t.dayTaskName, '  Write the proposal ');
    expect(view.text()).not.toContain(t.dayNameRequired);
    await press(view.renderer, t.dayEstimateMore);
    await press(view.renderer, t.dayPriorities.high);
    await press(view.renderer, t.dayAddTask);
    expect(onAddTask).toHaveBeenCalledWith({ title: 'Write the proposal', minutes: 45, priority: 'high' });
    await act(async () => view.renderer.unmount());
  });

  test('a task can be removed', async () => {
    const onRemoveTask = jest.fn();
    const view = await mount({ extra: { onRemoveTask } });
    await press(view.renderer, t.dayRemove('Clear the inbox'));
    expect(onRemoveTask).toHaveBeenCalledWith('mail');
    await act(async () => view.renderer.unmount());
  });
});
