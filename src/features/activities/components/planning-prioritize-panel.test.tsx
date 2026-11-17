import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { PLANNING_SAMPLES } from '@/features/productivity/lib/samples';
import { productivityStrings } from '@/features/productivity/strings';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { clearAllActivityDrafts } from '../lib/draft';
import type { PlanningActivity } from '../types';
import { ActivityView } from './activity-view';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
store.dispatch(languageChanged('en'));
beforeEach(() => clearAllActivityDrafts());

const t = productivityStrings.en;
const activity = PLANNING_SAMPLES[0] as PlanningActivity;
if (activity.challenge.mode !== 'prioritize') throw new Error('the first sample is the sorting exercise');
const specs = activity.challenge.tasks;
const title = (id: string) => specs.find((task) => task.id === id)!.title;

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };

function textOf(node: TestInstance | string): string {
  return typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join('');
}

type Renderer = ReturnType<typeof createRoot>;
const findAll = (renderer: Renderer, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
const has = (renderer: Renderer, label: string) => findAll(renderer, label).length > 0;

async function press(renderer: Renderer, label: string) {
  const [node] = findAll(renderer, label);
  if (!node) throw new Error(`nothing labelled "${label}"`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no onPress`);
  const onPress = fiber.memoizedProps?.onPress as () => void;
  await act(async () => {
    onPress();
  });
}

/** Selects a task by its current label and moves it to a box. */
async function place(renderer: Renderer, taskId: string, box: 'do' | 'plan' | 'delegate' | 'drop', from?: 'do' | 'plan' | 'delegate' | 'drop', mark?: string) {
  await press(renderer, (from ? t.matrixInBox(title(taskId), t.quadrants[from].title) : title(taskId)) + (mark ? `. ${mark}` : ''));
  await press(renderer, t.quadrants[box].title);
}

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

const checkDisabled = (renderer: Renderer) => findAll(renderer, t.sortCheck).find((node) => node.props.accessibilityRole === 'button')!.props.accessibilityState.disabled as boolean;

describe('the sorting exercise panel', () => {
  test('shows every task as not sorted yet, and never the expected boxes or the reasons', async () => {
    const view = await mount();
    const shown = view.text();
    expect(shown).toContain(t.matrixUnplaced);
    for (const task of specs) {
      expect(shown).toContain(task.title);
      expect(shown).not.toContain(task.why);
    }
    expect(shown).toContain(t.sortWhyDisabled(5));
    expect(checkDisabled(view.renderer)).toBe(true);
    // The learner's own board has no way to add or remove the fixed tasks.
    expect(has(view.renderer, t.matrixAddLabel)).toBe(false);
    await act(async () => view.renderer.unmount());
  });

  test('Check stays disabled until every task is placed, and says why', async () => {
    const view = await mount();
    await place(view.renderer, 'invoice', 'do');
    await place(view.renderer, 'course', 'plan');
    await place(view.renderer, 'favour', 'delegate');
    await place(view.renderer, 'feed', 'drop');
    expect(view.text()).toContain(t.sortWhyDisabled(1));
    expect(checkDisabled(view.renderer)).toBe(true);
    await place(view.renderer, 'bill', 'do');
    expect(view.text()).not.toContain(t.sortWhyDisabled(1));
    expect(checkDisabled(view.renderer)).toBe(false);
    await act(async () => view.renderer.unmount());
  });

  test('a wrong try marks each task with text, keeps the board, gives the reason and not the answer, and a moved task loses its mark', async () => {
    const view = await mount();
    await place(view.renderer, 'invoice', 'drop');
    await place(view.renderer, 'bill', 'drop');
    await place(view.renderer, 'course', 'plan');
    await place(view.renderer, 'favour', 'delegate');
    await place(view.renderer, 'feed', 'drop');
    await press(view.renderer, t.sortCheck);
    const shown = view.text();
    expect(view.onAttempt).toHaveBeenLastCalledWith({ activityId: activity.id, correct: false, hintsUsed: 0 });
    expect(view.onSolved).not.toHaveBeenCalled();
    expect(has(view.renderer, `${t.matrixInBox(title('invoice'), t.quadrants.drop.title)}. ${t.matrixWrong}`)).toBe(true);
    expect(has(view.renderer, `${t.matrixInBox(title('course'), t.quadrants.plan.title)}. ${t.matrixRight}`)).toBe(true);
    // The feedback gives the reason for a wrong task, and the board stays as it was.
    expect(shown).toContain(specs.find((task) => task.id === 'invoice')!.why);
    expect(has(view.renderer, t.matrixInBox(title('bill'), t.quadrants.drop.title) + `. ${t.matrixWrong}`)).toBe(true);
    // Moving a marked task clears its mark: the mark described where it used to be.
    await place(view.renderer, 'invoice', 'do', 'drop', t.matrixWrong);
    expect(has(view.renderer, t.matrixInBox(title('invoice'), t.quadrants.do.title))).toBe(true);
    expect(has(view.renderer, `${t.matrixInBox(title('bill'), t.quadrants.drop.title)}. ${t.matrixWrong}`)).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('a good sorting is reported as solved and the board is locked', async () => {
    const view = await mount();
    await place(view.renderer, 'invoice', 'do');
    await place(view.renderer, 'course', 'plan');
    await place(view.renderer, 'favour', 'delegate');
    await place(view.renderer, 'feed', 'drop');
    await place(view.renderer, 'bill', 'do');
    await press(view.renderer, t.sortCheck);
    expect(view.onSolved).toHaveBeenCalledTimes(1);
    expect(view.text()).toContain(t.sortAllRight(5));
    const [row] = findAll(view.renderer, `${t.matrixInBox(title('invoice'), t.quadrants.do.title)}. ${t.matrixRight}`);
    expect(row.props.accessibilityState.disabled).toBe(true);
    await act(async () => view.renderer.unmount());
  });
});
