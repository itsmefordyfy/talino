import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { clearAllActivityDrafts } from '../lib/draft';
import { SAMPLE_WORKFLOW as activity } from '../lib/workflow-sample';
import { workflowStrings } from '../workflow-strings';
import { ActivityView } from './activity-view';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('@/lib/clipboard', () => ({ copyText: async () => true }));
store.dispatch(languageChanged('en'));
beforeEach(() => clearAllActivityDrafts());

const text = workflowStrings.en;

function textOf(node: TestInstance | string): string {
  if (typeof node === 'string') return node;
  return node.children.map((child) => textOf(child)).join('');
}

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };

async function press(renderer: ReturnType<typeof createRoot>, label: string) {
  const [node] = renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
  if (!node) throw new Error(`nothing labelled "${label}"`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no onPress`);
  const onPress = fiber.memoizedProps?.onPress as () => void;
  await act(async () => {
    onPress();
  });
}

const has = (renderer: ReturnType<typeof createRoot>, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label).length > 0;

async function mount() {
  const onAttempt = jest.fn();
  const onSolved = jest.fn();
  const renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <ActivityView activity={activity} onAttempt={onAttempt} onSolved={onSolved} />
      </Provider>,
    );
  });
  return { renderer, onAttempt, onSolved, text: () => textOf(renderer.container) };
}

const partLabel = (id: string) => {
  const part = activity.parts.find((candidate) => candidate.id === id)!;
  return text.addPart(text.lanes[part.lane], part.label, part.detail);
};

async function addAll(renderer: ReturnType<typeof createRoot>, ids: string[]) {
  for (const id of ids) await press(renderer, partLabel(id));
}

describe('the workflow builder screen', () => {
  test('shows the situation, the counter, the lane-labelled palette and an empty workflow', async () => {
    const view = await mount();
    const shown = view.text();
    expect(shown).toContain(activity.situation);
    expect(shown).toContain(text.emptyWorkflow);
    expect(shown).toContain(text.stepCount(0, 4, 6));
    for (const lane of ['input', 'ai', 'tool', 'human', 'output'] as const) expect(shown).toContain(text.lanes[lane]);
    for (const part of activity.parts) expect(shown).toContain(part.label);
    expect(shown).toContain('Show hint 1 of 3');
    await act(async () => view.renderer.unmount());
  });

  test('tapping a part adds it once; it shows as added, and remove takes it out again', async () => {
    const view = await mount();
    await press(view.renderer, partLabel('read-message'));
    expect(view.text()).toContain(text.stepCount(1, 4, 6));
    expect(has(view.renderer, text.addedPart(text.lanes.input, 'Read the customer message', 1))).toBe(true);
    expect(has(view.renderer, partLabel('read-message'))).toBe(false);
    await press(view.renderer, text.remove(1, 'Read the customer message'));
    expect(view.text()).toContain(text.emptyWorkflow);
    expect(has(view.renderer, partLabel('read-message'))).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('move buttons reorder the steps', async () => {
    const view = await mount();
    await addAll(view.renderer, ['read-message', 'draft-reply']);
    await press(view.renderer, text.moveUp(2, 'Draft a reply with AI'));
    // The draft is now step 1: its row is labelled with its new number.
    expect(has(view.renderer, text.stepRow(1, text.lanes.ai, 'Draft a reply with AI'))).toBe(true);
    expect(has(view.renderer, text.stepRow(2, text.lanes.input, 'Read the customer message'))).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('stops adding at the maximum and says so on the parts that are left', async () => {
    const view = await mount();
    await addAll(view.renderer, ['read-message', 'draft-reply', 'check-price', 'owner-review', 'send-reply', 'log-order']);
    expect(view.text()).toContain(text.stepCount(6, 4, 6));
    expect(has(view.renderer, text.fullPart(text.lanes.ai, 'AI sends the reply by itself'))).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('a wrong check lists the broken rules in their own words, flags the steps, counts the try, and never shows the solution or the run', async () => {
    const view = await mount();
    await addAll(view.renderer, ['read-message', 'paste-password', 'send-direct', 'send-reply']);
    await press(view.renderer, text.checkWorkflow);
    const shown = view.text();
    expect(view.onAttempt).toHaveBeenLastCalledWith({ activityId: activity.id, correct: false, hintsUsed: 0 });
    expect(view.onSolved).not.toHaveBeenCalled();
    expect(shown).toContain(text.brokenTitle);
    for (const id of ['needs-ai', 'needs-review', 'no-password', 'no-auto-send']) expect(shown).toContain(activity.rules.find((rule) => rule.id === id)!.message);
    expect(shown).toContain(text.brokenSummary(4));
    // The two forbidden steps carry the warning; a step that breaks nothing does not.
    expect(has(view.renderer, `${text.stepRow(2, text.lanes.input, 'Paste the shop login into the prompt')}. ${text.flagged}`)).toBe(true);
    expect(has(view.renderer, text.stepRow(1, text.lanes.input, 'Read the customer message'))).toBe(true);
    expect(shown).not.toContain(text.simulationBadge);
    // Changing the workflow clears the findings: they described the old one.
    await press(view.renderer, text.remove(2, 'Paste the shop login into the prompt'));
    expect(view.text()).not.toContain(text.brokenTitle);
    await act(async () => view.renderer.unmount());
  });

  test('a passing check reports the solve once and shows the labelled simulated run, stepping through the learner steps', async () => {
    const view = await mount();
    await addAll(view.renderer, ['read-message', 'draft-reply', 'owner-review', 'send-reply', 'log-order']);
    await press(view.renderer, text.checkWorkflow);
    expect(view.onSolved).toHaveBeenCalledTimes(1);
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 1, wrong: 0, hintsUsed: 0 });
    const shown = view.text();
    expect(shown).toContain(text.simulationBadge);
    expect(shown).toContain(activity.simulation.input);
    // The palette is gone once solved, and the output waits for the last step.
    expect(shown).not.toContain(text.paletteHelp);
    expect(shown).not.toContain(activity.simulation.output);

    for (let step = 0; step < 5; step += 1) await press(view.renderer, text.runShowNext);
    const finished = view.text();
    expect(finished).toContain(activity.simulation.steps['draft-reply']);
    // The learner added a step the example has no line for: the generic line, marked.
    expect(finished).toContain(text.genericStep('Save the order in the log'));
    expect(finished).toContain(text.genericMark);
    expect(finished).toContain(activity.simulation.output);
    expect(has(view.renderer, text.runShowNext)).toBe(false);
    await act(async () => view.renderer.unmount());
  });

  test('keeps the workflow when the screen is left and opened again', async () => {
    const first = await mount();
    await addAll(first.renderer, ['read-message', 'draft-reply']);
    await act(async () => first.renderer.unmount());
    const second = await mount();
    expect(second.text()).toContain(text.stepCount(2, 4, 6));
    await act(async () => second.renderer.unmount());
  });
});
