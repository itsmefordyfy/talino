import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act, useState, type ComponentProps } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { arrangeStart } from '../lib/arrange';
import { clearAllActivityDrafts } from '../lib/draft';
import { stripInlineMarkup } from '../lib/text';
import { SAMPLE_ACTIVITIES } from '../samples';
import type { Activity, ArrangeActivity, CodeChallengeActivity, FillBlankActivity, FixBugActivity, MatchActivity, PredictOutputActivity, ScenarioActivity, TapRevealActivity } from '../types';
import { ActivityView } from './activity-view';
import { CodeEditor } from './code-editor';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('@/lib/clipboard', () => ({ copyText: async () => true }));
// These tests read English labels; the app itself starts in Tagalog, so the store is set to English once for this file.
store.dispatch(languageChanged('en'));
// Half-finished picks are kept between mounts on purpose; every test starts with none.
beforeEach(() => clearAllActivityDrafts());

function textOf(node: TestInstance | string): string {
  if (typeof node === 'string') return node;
  return node.children.map((child) => textOf(child)).join('');
}

describe('ActivityView renders every kind without crashing', () => {
  for (const activity of SAMPLE_ACTIVITIES) {
    test(`${activity.id}: shows its title, prompt and a hint button`, async () => {
      const renderer = createRoot();
      await act(async () => {
        renderer.render(
          <Provider store={store}>
            <ActivityView activity={activity} onAttempt={() => {}} onSolved={() => {}} />
          </Provider>,
        );
      });
      const text = textOf(renderer.container);
      expect(text).toContain(activity.title);
      if (activity.kind !== 'tap-reveal') expect(text).toMatch(/Show hint 1 of/);
      await act(async () => {
        renderer.unmount();
      });
    });
  }
});

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };

/** Presses the element a screen reader would find by this label: walks up to the component that owns onPress. */
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

async function mount(activity: Activity, extra: Partial<ComponentProps<typeof ActivityView>> = {}) {
  const onAttempt = jest.fn();
  const onSolved = jest.fn();
  const renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <ActivityView activity={activity} onAttempt={onAttempt} onSolved={onSolved} {...extra} />
      </Provider>,
    );
  });
  return { renderer, onAttempt, onSolved, text: () => textOf(renderer.container) };
}

const find = <T extends Activity>(id: string) => SAMPLE_ACTIVITIES.find((a) => a.id === id) as T;

describe('attempts, hints and the solve are reported', () => {
  test('scenario: every check is an attempt, the solve is reported once with the counts', async () => {
    const activity = find<ScenarioActivity>('sample-scenario-deadline');
    const view = await mount(activity);
    await press(view.renderer, activity.options[2].text);
    await press(view.renderer, 'Decide');
    expect(view.onAttempt).toHaveBeenLastCalledWith({ activityId: activity.id, correct: false, hintsUsed: 0 });
    expect(view.text()).toContain(activity.options[2].consequence);
    expect(view.onSolved).not.toHaveBeenCalled();

    await press(view.renderer, 'Try again');
    await press(view.renderer, activity.options[0].text);
    await press(view.renderer, 'Decide');
    expect(view.onAttempt).toHaveBeenCalledTimes(2);
    expect(view.onAttempt).toHaveBeenLastCalledWith({ activityId: activity.id, correct: true, hintsUsed: 0 });
    expect(view.onSolved).toHaveBeenCalledTimes(1);
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 2, wrong: 1, hintsUsed: 0 });
    expect(view.text()).toContain('Why it works');
    expect(view.text()).toContain(activity.explanation);
    await act(async () => view.renderer.unmount());
  });

  test('hints come one at a time, in order, and are counted', async () => {
    const activity = find<ScenarioActivity>('sample-scenario-deadline');
    const view = await mount(activity);
    expect(view.text()).not.toContain(activity.hints[0]);
    await press(view.renderer, 'Show hint 1 of 3');
    expect(view.text()).toContain(activity.hints[0]);
    expect(view.text()).not.toContain(activity.hints[1]);
    await press(view.renderer, 'Show hint 2 of 3');
    await press(view.renderer, 'Show hint 3 of 3');
    expect(view.text()).toContain(activity.hints[2]);
    expect(view.renderer.container.queryAll((i) => i.props.accessibilityLabel === 'Show hint 4 of 3')).toHaveLength(0);

    await press(view.renderer, activity.options[0].text);
    await press(view.renderer, 'Decide');
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 1, wrong: 0, hintsUsed: 3 });
    await act(async () => view.renderer.unmount());
  });

  test('independent learners only get the last two hints', async () => {
    const activity = find<ScenarioActivity>('sample-scenario-deadline');
    const view = await mount(activity, { guidance: 'independent' });
    await press(view.renderer, 'Show hint 1 of 2');
    expect(view.text()).toContain(activity.hints[1]);
    expect(view.text()).not.toContain(activity.hints[0]);
    await act(async () => view.renderer.unmount());
  });

  test('guided learners are offered a hint after two wrong tries', async () => {
    const activity = find<ScenarioActivity>('sample-scenario-deadline');
    const view = await mount(activity, { guidance: 'guided' });
    expect(view.text()).not.toContain('Tali has a hint ready');
    for (const index of [2, 1]) {
      await press(view.renderer, activity.options[index].text);
      await press(view.renderer, 'Decide');
      await press(view.renderer, 'Try again');
    }
    expect(view.text()).toContain('Tali has a hint ready');
    await act(async () => view.renderer.unmount());
  });

  test('an activity solved before can be practised without a second solve report', async () => {
    const activity = find<ScenarioActivity>('sample-scenario-deadline');
    const view = await mount(activity, { solved: true });
    expect(view.text()).toContain('You solved this one before');
    await press(view.renderer, activity.options[0].text);
    await press(view.renderer, 'Decide');
    expect(view.onAttempt).toHaveBeenCalledTimes(1);
    expect(view.onSolved).not.toHaveBeenCalled();
    await act(async () => view.renderer.unmount());
  });

  test('tap-reveal is solved by the last card, with one attempt', async () => {
    const activity = find<TapRevealActivity>('sample-tap-variables');
    const view = await mount(activity);
    for (const card of activity.cards) {
      expect(view.onSolved).not.toHaveBeenCalled();
      await press(view.renderer, `${stripInlineMarkup(card.front)}. Tap to reveal`);
    }
    expect(view.onAttempt).toHaveBeenCalledTimes(1);
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 1, wrong: 0, hintsUsed: 0 });
    await act(async () => view.renderer.unmount());
  });

  test('fix-bug: the right line is a step, not a try; a wrong line is a wrong try', async () => {
    const activity = find<FixBugActivity>('sample-fix-off-by-one');
    const view = await mount(activity);
    await press(view.renderer, `Line 1: ${activity.code.split('\n')[0].trim()}`);
    expect(view.onAttempt).toHaveBeenLastCalledWith({ activityId: activity.id, correct: false, hintsUsed: 0 });
    await press(view.renderer, `Line 3: ${activity.code.split('\n')[2].trim()}`);
    expect(view.onAttempt).toHaveBeenCalledTimes(1);
    expect(view.text()).toContain('Which line fixes it?');
    await press(view.renderer, activity.fixes[0].line);
    await press(view.renderer, 'Check');
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 2, wrong: 1, hintsUsed: 0 });
    await act(async () => view.renderer.unmount());
  });

  test('match: tap a card, pick its match; a wrong pick is a try and is marked; right ones lock in and the last solves it', async () => {
    const activity = find<MatchActivity>('sample-match-types');
    const view = await mount(activity);
    const card = (index: number) => `${String.fromCharCode(65 + index)}: ${stripInlineMarkup(activity.pairs[index].term)}`;
    const choice = (index: number) => stripInlineMarkup(activity.pairs[index].definition);

    // Nothing is a choice until a card is opened: the choices live under the card, not in a second list.
    expect(view.renderer.container.queryAll((instance) => instance.props.accessibilityLabel === choice(1))).toHaveLength(0);
    expect(view.text()).toContain('Tap a card to choose its match.');
    await press(view.renderer, card(0));
    expect(view.text()).toContain('Now choose what goes with A.');

    await press(view.renderer, choice(1));
    expect(view.onAttempt).toHaveBeenLastCalledWith({ activityId: activity.id, correct: false, hintsUsed: 0 });
    // The refused choice says why, on the choice itself: the meaning's own note when it has one.
    expect(activity.pairs[1].note).toBeTruthy();
    expect(view.text()).toContain(`Not this one. ${activity.pairs[1].note}`);
    // The refused choice is marked for that card and can't be tapped again there.
    expect(view.renderer.container.queryAll((instance) => instance.props.accessibilityLabel === `${choice(1)}, Not this one`)).toHaveLength(1);

    for (let index = 0; index < activity.pairs.length; index += 1) {
      if (index > 0) await press(view.renderer, card(index));
      await press(view.renderer, choice(index));
    }
    expect(view.onSolved).toHaveBeenCalledTimes(1);
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 2, wrong: 1, hintsUsed: 0 });
    expect(view.text()).toContain('Activity complete');
    expect(view.text()).toContain('All matched');
    await act(async () => view.renderer.unmount());
  });

  test('match: what was matched is still there after leaving for the lesson and coming back', async () => {
    const activity = find<MatchActivity>('sample-match-types');
    const first = await mount(activity);
    const card = (index: number) => `${String.fromCharCode(65 + index)}: ${stripInlineMarkup(activity.pairs[index].term)}`;
    await press(first.renderer, card(0));
    await press(first.renderer, stripInlineMarkup(activity.pairs[0].definition));
    await act(async () => first.renderer.unmount());

    const second = await mount(activity);
    expect(second.text()).toContain(`1 of ${activity.pairs.length} matched`);
    expect(second.renderer.container.queryAll((instance) => String(instance.props.accessibilityLabel ?? '').startsWith(`${card(0)}, A: matched with`))).toHaveLength(1);
    await act(async () => second.renderer.unmount());
  });

  test('every kind says what to do and how many answers it takes', async () => {
    const scenario = await mount(find<ScenarioActivity>('sample-scenario-deadline'));
    expect(scenario.text()).toContain('Pick one option, then press Decide.');
    await act(async () => scenario.renderer.unmount());
    const match = await mount(find<MatchActivity>('sample-match-types'));
    expect(match.text()).toContain('Tap a card, then choose its match. Every card has exactly one.');
    await act(async () => match.renderer.unmount());
  });

  test('moving to another activity starts clean', async () => {
    const first = find<ScenarioActivity>('sample-scenario-deadline');
    const second = find<ScenarioActivity>('sample-scenario-ai-code');
    const view = await mount(first);
    await press(view.renderer, 'Show hint 1 of 3');
    await act(async () => {
      view.renderer.render(
        <Provider store={store}>
          <ActivityView activity={second} onAttempt={() => {}} onSolved={() => {}} />
        </Provider>,
      );
    });
    expect(view.text()).toContain(second.title);
    expect(view.text()).not.toContain(first.hints[0]);
    await act(async () => view.renderer.unmount());
  });
});

async function typeInto(renderer: ReturnType<typeof createRoot>, label: string, value: string) {
  const [node] = renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label && typeof instance.props.onChangeText === 'function');
  if (!node) throw new Error(`no field labelled "${label}"`);
  await act(async () => {
    (node.props.onChangeText as (text: string) => void)(value);
  });
}

describe('the other kinds, by hand', () => {
  test('predict-output typed: a wrong answer then the right one', async () => {
    const activity = find<PredictOutputActivity>('sample-predict-array');
    const view = await mount(activity);
    await typeInto(view.renderer, 'Your answer', '4');
    await press(view.renderer, 'Check');
    expect(view.text()).toContain('prints 2 lines');
    expect(view.onSolved).not.toHaveBeenCalled();
    await typeInto(view.renderer, 'Your answer', '4\nBen');
    await press(view.renderer, 'Check');
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 2, wrong: 1, hintsUsed: 0 });
    await act(async () => view.renderer.unmount());
  });

  test('arrange: tap-to-swap puts the lines in order, and the check explains the first wrong line', async () => {
    const activity = find<ArrangeActivity>('sample-arrange-greeting');
    const view = await mount(activity);
    const current = arrangeStart(activity);
    const row = (index: number) => `Line ${index + 1}: ${current[index].trim()}`;

    await press(view.renderer, 'Check order');
    expect(view.text()).toMatch(/Line \d is not in the right place yet/);
    expect(view.onSolved).not.toHaveBeenCalled();

    for (let target = 0; target < activity.solution.length; target += 1) {
      const at = current.indexOf(activity.solution[target]);
      if (at === target) continue;
      await press(view.renderer, row(target));
      await press(view.renderer, row(at));
      [current[target], current[at]] = [current[at], current[target]];
    }
    await press(view.renderer, 'Check order');
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 2, wrong: 1, hintsUsed: 0 });
    await act(async () => view.renderer.unmount());
  });

  test('arrange: the move buttons work too', async () => {
    const activity = find<ArrangeActivity>('sample-arrange-greeting');
    const view = await mount(activity);
    const start = arrangeStart(activity);
    await press(view.renderer, 'Move line 1 down');
    await press(view.renderer, 'Check order');
    // The check explains where the first wrong line is; the order changed by one move, so it is still not solved.
    expect(view.onSolved).not.toHaveBeenCalled();
    expect(start).toHaveLength(activity.solution.length);
    await act(async () => view.renderer.unmount());
  });

  test('fill-blank with a word bank: wrong words are cleared on Try again, right ones stay', async () => {
    const activity = find<FillBlankActivity>('sample-fill-function');
    const view = await mount(activity);
    await press(view.renderer, 'Blank 1');
    await press(view.renderer, 'function');
    await press(view.renderer, 'const');
    await press(view.renderer, 'Check');
    expect(view.text()).toContain('1 of 2 blanks are right');
    await press(view.renderer, 'Try again');
    await press(view.renderer, 'return');
    await press(view.renderer, 'Check');
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 2, wrong: 1, hintsUsed: 0 });
    await act(async () => view.renderer.unmount());
  });

  test('fill-blank typed: Check waits until every blank has text', async () => {
    const activity = find<FillBlankActivity>('sample-fill-loop');
    const view = await mount(activity);
    await typeInto(view.renderer, 'Blank 1', '<=');
    const [check] = view.renderer.container.queryAll((i) => i.props.accessibilityLabel === 'Check');
    expect(check.props.accessibilityState).toMatchObject({ disabled: true });
    await typeInto(view.renderer, 'Blank 2', '+');
    await press(view.renderer, 'Check');
    expect(view.onSolved).toHaveBeenCalledTimes(1);
    await act(async () => view.renderer.unmount());
  });

  test('code-challenge: typing code, Run shows output, Check solves', async () => {
    const activity = find<CodeChallengeActivity>('sample-code-average');
    const view = await mount(activity);
    await press(view.renderer, 'Check');
    expect(view.text()).toContain('0 of 4 checks pass');
    await typeInto(view.renderer, 'Code editor', `${activity.solution}\nconsole.log(average(2, 4));`);
    await press(view.renderer, 'Run');
    expect(view.text()).toContain('3');
    await press(view.renderer, 'Check');
    expect(view.onSolved).toHaveBeenCalledWith({ activityId: activity.id, attempts: 2, wrong: 1, hintsUsed: 0 });
    expect(view.text()).toContain('hidden check: 1 passed');
    await act(async () => view.renderer.unmount());
  });

  test('code-challenge robot: Run draws the result, Check solves', async () => {
    const activity = find<CodeChallengeActivity>('sample-robot-star');
    const view = await mount(activity);
    await typeInto(view.renderer, 'Code editor', activity.solution);
    await press(view.renderer, 'Run the robot');
    await press(view.renderer, 'Check');
    expect(view.onSolved).toHaveBeenCalledTimes(1);
    await act(async () => view.renderer.unmount());
  });
});

describe('CodeEditor', () => {
  function Harness({ onValue }: { onValue: (value: string) => void }) {
    const [value, setValue] = useState('if (x) ');
    return (
      <Provider store={store}>
        <CodeEditor
          value={value}
          onChangeText={(next) => {
            setValue(next);
            onValue(next);
          }}
        />
      </Provider>
    );
  }

  test('the quick keys insert at the caret, which starts at the end', async () => {
    const seen: string[] = [];
    const renderer = createRoot();
    await act(async () => renderer.render(<Harness onValue={(value) => seen.push(value)} />));
    await press(renderer, 'Insert {');
    await press(renderer, 'Insert two spaces');
    expect(seen).toEqual(['if (x) {', 'if (x) {  ']);
    await act(async () => renderer.unmount());
  });

  test('the input layer is invisible and every layer shares one font setup', async () => {
    const renderer = createRoot();
    await act(async () => renderer.render(<Harness onValue={() => {}} />));
    const [input] = renderer.container.queryAll((i) => i.props.accessibilityLabel === 'Code editor' && typeof i.props.onChangeText === 'function');
    expect(input.props.autoCapitalize).toBe('none');
    expect(input.props.autoCorrect).toBe(false);
    expect(input.props.spellCheck).toBe(false);
    expect(input.props.keyboardType).toBe('ascii-capable');
    expect(input.props.multiline).toBe(true);
    const flat = (style: unknown): Record<string, unknown> => (Array.isArray(style) ? Object.assign({}, ...style.map(flat)) : ((style as Record<string, unknown>) ?? {}));
    const inputStyle = flat(input.props.style);
    expect(inputStyle.color).toBe('transparent');
    // The highlighted layer is the Text that holds the tokens; it must use the very same metrics.
    const layer = renderer.container.queryAll((i) => i.type === 'Text' && textOf(i).startsWith('if (x)'))[0];
    const layerStyle = flat(layer.props.style);
    for (const key of ['fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing', 'includeFontPadding'] as const) expect(layerStyle[key]).toBe(inputStyle[key]);
    await act(async () => renderer.unmount());
  });
});
