import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { productivityStrings } from '@/features/productivity';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { clearAllActivityDrafts } from '../lib/draft';
import type { PlanningActivity } from '../types';
import { ActivityView } from './activity-view';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('react-native-svg', () => ({ __esModule: true, default: 'Svg', Svg: 'Svg', Circle: 'Circle' }));
let mockIds = 0;
// expo-crypto is native; ids that are unique for the run stand in.
jest.mock('@/lib/id', () => ({ newId: () => `test-id-${(mockIds += 1)}`, nowTimestamp: () => new Date().toISOString() }));
store.dispatch(languageChanged('en'));

const t = productivityStrings.en;
const H = (hours: number, minutes = 0) => hours * 60 + minutes;

const SECRET = 'THE-REFERENCE-SOLUTION-BLOCK-TITLE';
const activity: PlanningActivity = {
  id: 'test-planning-day',
  kind: 'planning',
  title: 'Plan a short Friday',
  prompt: 'Place the tasks in the day around the commitments.',
  concept: 'time-blocking',
  hints: ['Start with the must-do task.', 'Add a break.', 'Decide about what does not fit.'],
  explanation: 'A good plan has rest and room.',
  challenge: {
    mode: 'schedule',
    scenario: {
      dayLabel: 'A short Friday',
      windowStart: H(8),
      windowEnd: H(16),
      fixed: [
        { id: 'standup', title: 'Stand-up', start: H(9), minutes: 15, kind: 'meeting' },
        { id: 'lunch', title: 'Lunch', start: H(12), minutes: 60, kind: 'meal' },
      ],
      tasks: [
        { id: 'report', title: 'Finish the client report', minutes: 120, priority: 'high', mustDo: true, deadline: H(15) },
        { id: 'invoices', title: 'Send two invoices', minutes: 30, priority: 'medium' },
        { id: 'tidy', title: 'Tidy the desktop files', minutes: 60, priority: 'low', okActions: ['defer', 'decline'] },
      ],
      rules: { maxFocusRun: 90 },
      interruption: { id: 'call', title: 'Urgent call from the client', start: H(13), minutes: 60, note: 'The client needs you on a call right now.' },
    },
    solution: { blocks: [{ id: 's1', kind: 'task', taskId: 'report', title: SECRET, start: H(8), minutes: 60 }], decisions: [] },
  },
};

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
type Renderer = ReturnType<typeof createRoot>;
const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
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

async function mount(subject: PlanningActivity = activity) {
  const onAttempt = jest.fn();
  const onSolved = jest.fn();
  const renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <ActivityView activity={subject} onAttempt={onAttempt} onSolved={onSolved} />
      </Provider>,
    );
  });
  return { renderer, onAttempt, onSolved, text: () => textOf(renderer.container) };
}

const place = (title: string) => `${t.dayPlace}: ${title}`;

beforeEach(() => {
  mockIds = 0;
  clearAllActivityDrafts();
});

describe('the graded day (planning, schedule mode)', () => {
  test('shows the day, the commitments, the tasks and the rules in words (the scenario merged over the defaults) before planning, and never the solution', async () => {
    const view = await mount();
    const shown = view.text();
    expect(shown).toContain('A short Friday');
    expect(shown).toContain(t.dayWindow('8:00 AM', '4:00 PM'));
    expect(shown).toContain('Stand-up');
    expect(shown).toContain('Finish the client report');
    expect(shown).toContain(t.planDayRules);
    expect(shown).toContain(t.planRuleFocus('1 h 30 min'));
    expect(shown).toContain(t.planRuleBreak('30 min', '10 min'));
    expect(shown).toContain(t.planRuleSlack('20 min'));
    expect(shown).toContain(t.planRuleCap('6 h'));
    expect(shown).toContain(t.planRuleMust);
    expect(shown).toContain(t.planExplain);
    expect(shown).not.toContain(SECRET);
    // The surprise is hidden until the day starts.
    expect(shown).not.toContain('The client needs you on a call right now.');
    expect(shown).not.toContain('Urgent call from the client');
    await act(async () => view.renderer.unmount());
  });

  test('with an interruption, Check is not offered until the day starts; starting reveals it as a commitment and asks for a rebuild', async () => {
    const view = await mount();
    expect(has(view.renderer, t.planCheck)).toBe(false);
    expect(has(view.renderer, t.planStart)).toBe(true);
    await press(view.renderer, place('Finish the client report'));
    await press(view.renderer, t.planStart);
    const shown = view.text();
    expect(shown).toContain('The client needs you on a call right now.');
    expect(shown).toContain(t.planAfter);
    expect(shown).toContain(t.dayFixedKinds.interruption);
    expect(has(view.renderer, t.planCheck)).toBe(true);
    expect(has(view.renderer, t.planStart)).toBe(false);
    await act(async () => view.renderer.unmount());
  });

  test('Check sends the plan, the decisions and the interruption flag, shows the scores and findings in the plan, and keeps the plan after a failed check', async () => {
    const view = await mount();
    await press(view.renderer, place('Finish the client report'));
    await press(view.renderer, place('Send two invoices'));
    await press(view.renderer, t.dayDecisions.defer);
    await press(view.renderer, t.planStart);
    await press(view.renderer, t.planCheck);
    expect(view.onAttempt).toHaveBeenCalledTimes(1);
    expect(view.onAttempt).toHaveBeenCalledWith(expect.objectContaining({ activityId: 'test-planning-day', correct: false }));
    const shown = view.text();
    expect(shown).toContain(t.dayResultTitle);
    expect(shown).toContain(t.dimensions.interruptions);
    expect(shown).toContain(t.dimensions.realisticPlanning);
    // The plan is still there to fix, and there is a way to check again.
    expect(has(view.renderer, `${t.dayAdjust} Finish the client report`)).toBe(true);
    expect(has(view.renderer, t.planCheck)).toBe(true);
    expect(shown).not.toContain(SECRET);
    // Changing the plan afterwards says the result is for the older plan.
    await press(view.renderer, t.dayAddBreak);
    expect(view.text()).toContain(t.planChanged);
    await act(async () => view.renderer.unmount());
  });

  test('the plan, the decisions, the started day and the learner\'s own words survive leaving and coming back', async () => {
    const first = await mount();
    await press(first.renderer, place('Finish the client report'));
    await press(first.renderer, t.dayDecisions.decline, 1);
    await press(first.renderer, t.planStart);
    const [box] = findAll(first.renderer, t.planExplain);
    await act(async () => (box!.props.onChangeText as (text: string) => void)('I protected the report and gave up the tidy-up.'));
    await act(async () => first.renderer.unmount());

    const second = await mount();
    expect(has(second.renderer, `${t.dayAdjust} Finish the client report`)).toBe(true);
    expect(second.text()).toContain('The client needs you on a call right now.');
    expect(findAll(second.renderer, t.planExplain)[0]!.props.value).toBe('I protected the report and gave up the tidy-up.');
    await act(async () => second.renderer.unmount());
  });

  test('a scenario without an interruption can be checked straight away, as a finished day', async () => {
    const calm: PlanningActivity = { ...activity, id: 'test-planning-calm', challenge: { ...activity.challenge, mode: 'schedule', scenario: { ...(activity.challenge as Extract<PlanningActivity['challenge'], { mode: 'schedule' }>).scenario, interruption: undefined }, solution: { blocks: [], decisions: [] } } };
    const view = await mount(calm);
    expect(has(view.renderer, t.planStart)).toBe(false);
    await press(view.renderer, place('Finish the client report'));
    await press(view.renderer, t.planCheck);
    expect(view.onAttempt).toHaveBeenCalledTimes(1);
    expect(view.text()).toContain(t.dayResultTitle);
    expect(view.text()).not.toContain(t.dimensions.interruptions);
    await act(async () => view.renderer.unmount());
  });
});
