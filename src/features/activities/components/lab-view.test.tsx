import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { createTestDatabase } from '@/db/testing/node-database';
import { ALL_TEST_LABS, GOOD_PROMPT, LAB_CLASSIFY, LAB_COMPARE_MODELS, LAB_COMPARE_PROMPTS, LAB_MARKERS, LAB_SUMMARY, LAB_TOOLS, OTHER_GOOD_PROMPT } from '@/features/practice/lab-test-support';
import { keyChecksFor } from '@/features/practice/lib/lab-check';
import { parseLabReview, type LabReview } from '@/features/practice/lib/lab-review';
import { buildLabOutput, type LabRun } from '@/features/practice/lib/lab-run';
import type { LabTask } from '@/features/practice/types';
import { languageChanged } from '@/features/settings/settings-slice';
import { ApiError } from '@/lib/api';
import { store } from '@/store';

import type { PromptLabActivity } from '../types';
import { ActivityView } from './activity-view';

// ── The pieces with no Jest implementation, and the network (never the real server: nothing here calls Gemini).
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('react-native-svg', () => ({ __esModule: true, default: 'Svg', Svg: 'Svg', Circle: 'Circle' }));
const mockCopy = jest.fn<(text: string) => Promise<boolean>>();
jest.mock('@/lib/clipboard', () => ({ copyText: (text: string) => mockCopy(text) }));
let mockIds = 0;
jest.mock('@/lib/id', () => ({ newId: () => `test-id-${(mockIds += 1)}`, nowTimestamp: () => new Date().toISOString() }));
jest.mock('@/components/ui/skeleton', () => ({ SkeletonBlock: () => null }));
jest.mock('@/components/ui/typing-dots', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');
  return { TypingDots: ({ label }: { label: string }) => <Text>{label}</Text> };
});

let mockOnline = true;
jest.mock('@/hooks/use-is-online', () => ({ useIsOnline: () => mockOnline }));
let mockWide = false;
jest.mock('@/hooks/use-two-up', () => ({ useTwoUp: () => mockWide }));
const mockOpenPaywall = jest.fn();
jest.mock('@/features/store/lib/open-paywall', () => ({ openPaywall: (reason: string) => mockOpenPaywall(reason) }));

jest.mock('@/features/coach', () => ({ ...jest.requireActual<Record<string, unknown>>('@/features/coach/api/client'), useCoachIdentity: () => ({ appUserId: 'user-1', entitlements: [] }) }));
jest.mock('@/features/coach/components/composer', () => jest.requireActual('@/features/coach/components/composer'));

// The real labs are written by the course's authors; these tests give the catalog their own.
jest.mock('@/features/practice/catalog', () => {
  const real = jest.requireActual<Record<string, unknown>>('@/features/practice/catalog');
  const support = jest.requireActual<typeof import('@/features/practice/lab-test-support')>('@/features/practice/lab-test-support');
  return { ...real, findLab: support.findTestLab };
});

const mockRun = jest.fn<(identity: unknown, input: { prompts: string[]; runNumber: number; itemId: string }) => Promise<LabRun>>();
const mockReview = jest.fn<(identity: unknown, input: { prompts: string[]; outputs: string[]; toolSteps?: unknown[] }) => Promise<LabReview>>();
jest.mock('@/features/practice/api/client', () => ({
  ...jest.requireActual<Record<string, unknown>>('@/features/practice/api/client'),
  requestLabRun: (identity: unknown, input: never) => mockRun(identity, input),
  requestLabReview: (identity: unknown, input: never) => mockReview(identity, input),
}));

let mockDb: Awaited<ReturnType<typeof createTestDatabase>>;
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb }));

store.dispatch(languageChanged('en'));

const activity = (lab: LabTask, id = `test-${lab.id}`): PromptLabActivity => ({ id, kind: 'prompt-lab', labId: lab.id, title: 'Try a prompt', prompt: 'Improve the prompt and run it.', hints: ['Think about who reads it.'], explanation: 'A strong prompt names the reader.', concept: 'prompting' });

const outputOf = (lab: LabTask, output: string, label: 'A' | 'B' = 'A', extra: { steps?: { tool: string; arguments: Record<string, string | number>; result: Record<string, string | number | boolean> }[]; model?: string } = {}) =>
  buildLabOutput({ lab, label, text: output, tokens: { input: 21, output: 8 }, latencyMs: 1234, ...extra })!;
const runOf = (...outputs: ReturnType<typeof outputOf>[]): LabRun => ({ outputs });
const reviewOf = (lab: LabTask, prompts: string[], outputs: string[], overrides: Record<string, unknown> = {}): LabReview =>
  parseLabReview(
    JSON.stringify({
      summary: 'A clear request that names the reader.',
      criteria: lab.criteria.map((criterion, index) => ({ id: criterion.id, score: 80 - index * 30, quote: index === lab.criteria.length - 1 ? '' : prompts[prompts.length - 1].split(' ').slice(1, 4).join(' '), reason: `Reason for ${criterion.id}.` })),
      suggestions: ['Name what must not be lost.'],
      outputChecks: [],
      comparison: lab.compare ? 'The two outputs differ in length.' : '',
      nextStep: 'Run it again with the owners named.',
      ...overrides,
    }),
    { lab, prompts, outputs, keyChecks: keyChecksFor(lab, outputs) },
  )!;

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(' '));
let renderer: ReturnType<typeof createRoot>;
let clients: QueryClient[] = [];
const flush = async () => {
  for (let index = 0; index < 4; index += 1)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
};
async function mount(lab: LabTask, id?: string) {
  const onAttempt = jest.fn();
  const onSolved = jest.fn();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, networkMode: 'always', gcTime: 0 }, mutations: { retry: false, networkMode: 'always', gcTime: 0 } } });
  clients.push(client);
  renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <ActivityView activity={activity(lab, id)} courseId="generative-ai-applications" lessonId="generative-ai-applications-04" onAttempt={onAttempt} onSolved={onSolved} />
        </QueryClientProvider>
      </Provider>,
    );
  });
  await flush();
  return { onAttempt, onSolved };
}
const text = () => textOf(renderer.container);
const byLabel = (label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
const has = (label: string) => byLabel(label).length > 0;
const handlerOf = (label: string, name: 'onPress' | 'onChangeText') => {
  const [node] = byLabel(label);
  if (!node) throw new Error(`nothing labelled "${label}"; the screen shows: ${text().slice(0, 500)}`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.[name] !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no ${name}`);
  return fiber.memoizedProps?.[name] as (value?: string) => void;
};
const disabled = (label: string) => {
  const [button] = byLabel(label);
  return button.props.disabled === true || (button.props.accessibilityState as { disabled?: boolean } | undefined)?.disabled === true;
};
async function press(label: string) {
  const onPress = handlerOf(label, 'onPress');
  await act(async () => {
    onPress();
  });
  await flush();
}
async function type(label: string, value: string) {
  const onChangeText = handlerOf(label, 'onChangeText');
  await act(async () => {
    onChangeText(value);
  });
}

beforeEach(async () => {
  mockDb = await createTestDatabase();
  mockOnline = true;
  mockWide = false;
  mockRun.mockReset();
  mockReview.mockReset();
  mockCopy.mockReset();
  mockOpenPaywall.mockReset();
  mockCopy.mockImplementation(async () => true);
  mockRun.mockImplementation(async () => runOf(outputOf(LAB_SUMMARY, 'Dana sends the budget on Thursday.')));
  jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
    buttons?.find((button) => button.style !== 'cancel')?.onPress?.();
  });
});
afterEach(async () => {
  await act(async () => renderer?.unmount());
  for (const client of clients.splice(0)) client.clear();
  mockDb.close();
  jest.restoreAllMocks();
});

const shown = () => text();

describe('before the first run', () => {
  test('shows the situation, the goal, the material, the checklist and an editor with the starter prompt, and nothing private', async () => {
    await mount(LAB_SUMMARY);
    const shown = text();
    expect(shown).toContain(LAB_SUMMARY.title);
    expect(shown).toContain(LAB_SUMMARY.situation);
    expect(shown).toContain(LAB_SUMMARY.goal);
    expect(shown).toContain(LAB_SUMMARY.material);
    expect(shown).toContain('What a strong prompt does here');
    for (const criterion of LAB_SUMMARY.criteria) expect(shown).toContain(criterion.label);
    expect(byLabel('Your prompt')[0].props.value).toBe(LAB_SUMMARY.starterPrompt);
    expect(has('Copy prompt: Your prompt')).toBe(true);
    for (const marker of Object.values(LAB_MARKERS)) expect(shown).not.toContain(marker);
  });

  test('the starter prompt cannot be run: Run is disabled and says what to change', async () => {
    await mount(LAB_SUMMARY);
    expect(shown()).toContain('Change the starter prompt to run it.');
    expect(disabled('Run on a live model')).toBe(true);
    expect(shown()).toContain('Run 1 of 3');
    expect(mockRun).not.toHaveBeenCalled();
  });

  test('the tips and the verify list wait for the first run; the example is there, collapsed, and badged as an illustration', async () => {
    await mount(LAB_SUMMARY);
    const now = shown();
    expect(now).toContain('Example (illustration)');
    expect(now).toContain('Illustration, not a real model’s output');
    expect(now).not.toContain(LAB_SUMMARY.example.prompt);
    expect(now).not.toContain(LAB_SUMMARY.tips[0]);
    expect(now).not.toContain(LAB_SUMMARY.verify[0]);
    expect(now).not.toContain('Review my prompt');
    await press('Example (illustration). Show the example');
    expect(shown()).toContain(LAB_SUMMARY.example.prompt);
  });

  test('Copy prompt copies the text in the box', async () => {
    await mount(LAB_SUMMARY);
    await type('Your prompt', GOOD_PROMPT);
    await press('Copy prompt: Your prompt');
    expect(mockCopy).toHaveBeenCalledWith(GOOD_PROMPT);
    expect(shown()).toContain('Copied');
  });

  test('a prompt that is still short keeps Run disabled and says how long it needs to be', async () => {
    await mount(LAB_SUMMARY);
    await type('Your prompt', 'Make three bullets from it');
    expect(shown()).toContain('at least 8 words');
    expect(disabled('Run on a live model')).toBe(true);
  });
});

describe('a live run', () => {
  async function runOnce() {
    const handlers = await mount(LAB_SUMMARY);
    await type('Your prompt', GOOD_PROMPT);
    await press('Run on a live model');
    return handlers;
  }

  test('sends the prompt, shows the reply under a "Live model" badge with the measured numbers, and brings the tips', async () => {
    await runOnce();
    expect(mockRun).toHaveBeenCalledTimes(1);
    expect(mockRun.mock.calls[0][1]).toMatchObject({ prompts: [GOOD_PROMPT], runNumber: 1, itemId: LAB_SUMMARY.id });
    const now = shown();
    expect(now).toContain('Live model');
    expect(now).toContain('Dana sends the budget on Thursday.');
    expect(now).toContain('Measured on this run: 1,234 ms · 21 tokens in · 8 tokens out');
    expect(now).toContain(LAB_SUMMARY.tips[0]);
    expect(now).toContain(LAB_SUMMARY.verify[0]);
    expect(now).toContain('Review my prompt');
    expect(now).toContain('Run 2 of 3');
  });

  test('the prompt stays in the box, and a second run is the next run number under the same session', async () => {
    await runOnce();
    await type('Your prompt', `${GOOD_PROMPT} Also name every date.`);
    await press('Run again');
    expect(mockRun).toHaveBeenCalledTimes(2);
    expect(mockRun.mock.calls[1][1].runNumber).toBe(2);
    expect((mockRun.mock.calls[1][1] as unknown as { sessionId: string }).sessionId).toBe((mockRun.mock.calls[0][1] as unknown as { sessionId: string }).sessionId);
    expect(shown()).toContain('Run 3 of 3');
  });

  test('after the last allowed run Run is disabled and the learner is pointed to the review', async () => {
    await runOnce();
    for (const extra of ['one', 'two']) {
      await type('Your prompt', `${GOOD_PROMPT} Also ${extra} more thing.`);
      await press('Run again');
    }
    expect(shown()).toContain('You have used all 3 runs');
    expect(disabled('Run again')).toBe(true);
  });

  test('a failed run says so calmly, keeps the prompt, shows no reply, and offers a retry', async () => {
    mockRun.mockImplementation(async () => {
      throw new ApiError('busy', 503);
    });
    await mount(LAB_SUMMARY);
    await type('Your prompt', GOOD_PROMPT);
    await press('Run on a live model');
    expect(shown()).toContain('Practice is busy right now');
    expect(shown()).not.toContain('What the model said');
    expect(has('Try again')).toBe(true);
    mockRun.mockImplementation(async () => runOf(outputOf(LAB_SUMMARY, 'A calmer answer.')));
    await press('Try again');
    expect(shown()).toContain('A calmer answer.');
  });

  test('the day’s sessions used up offers Pro, with no retry', async () => {
    mockRun.mockImplementation(async () => {
      throw new ApiError('practice_limit', 429, { resetsAt: null });
    });
    await mount(LAB_SUMMARY);
    await type('Your prompt', GOOD_PROMPT);
    await press('Run on a live model');
    expect(shown()).toContain('A new practice session opens within 24 hours');
    expect(has('Try again')).toBe(false);
    await press('See Talino Pro');
    expect(mockOpenPaywall).toHaveBeenCalled();
  });

  test('offline: Run is disabled and the learner is told what needs the internet', async () => {
    mockOnline = false;
    await mount(LAB_SUMMARY);
    await type('Your prompt', GOOD_PROMPT);
    expect(disabled('Run on a live model')).toBe(true);
    expect(shown()).toContain('The prompt lab');
    expect(mockRun).not.toHaveBeenCalled();
  });
});

describe('the review', () => {
  async function runAndReview(lab: LabTask, output: string, prompts: string[] = [GOOD_PROMPT]) {
    mockRun.mockImplementation(async () => runOf(outputOf(lab, output)));
    mockReview.mockImplementation(async () => reviewOf(lab, prompts, [output]));
    const handlers = await mount(lab);
    await type('Your prompt', prompts[0]);
    await press('Run on a live model');
    await press('Review my prompt');
    return handlers;
  }

  test('sends the latest prompt and output, then shows the score, each item with the learner’s own words, and is labelled AI-assessed', async () => {
    const { onSolved } = await runAndReview(LAB_SUMMARY, 'Dana sends the budget on Thursday.');
    expect(mockReview.mock.calls[0][1]).toMatchObject({ prompts: [GOOD_PROMPT], outputs: ['Dana sends the budget on Thursday.'] });
    const now = shown();
    expect(now).toContain('AI-assessed, verify');
    expect(now).toContain('How your prompt did');
    for (const criterion of LAB_SUMMARY.criteria) expect(now).toContain(criterion.label);
    expect(now).toContain('In your prompt');
    expect(now).toContain('Nothing in your prompt does this yet.');
    expect(now).toContain('Name what must not be lost.');
    expect(now).toContain('Try another version');
    // Done: a run came back and the review arrived, whatever the score.
    expect(onSolved).toHaveBeenCalledTimes(1);
  });

  test('completes even with a low score', async () => {
    mockRun.mockImplementation(async () => runOf(outputOf(LAB_SUMMARY, 'x')));
    mockReview.mockImplementation(async () => reviewOf(LAB_SUMMARY, [GOOD_PROMPT], ['x'], { criteria: LAB_SUMMARY.criteria.map((criterion) => ({ id: criterion.id, score: 10, quote: '', reason: 'Not there.' })) }));
    const { onSolved } = await mount(LAB_SUMMARY);
    await type('Your prompt', GOOD_PROMPT);
    await press('Run on a live model');
    await press('Review my prompt');
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(shown()).toContain('10');
  });

  test('a lab with a key reveals what the material says, with Match or Different in words', async () => {
    await runAndReview(LAB_CLASSIFY, '{"category":"billing","urgent":true,"tags":["late","parcel"]}');
    const now = shown();
    expect(now).toContain('What the material says');
    expect(now).toContain('Correct: shipping');
    expect(now).toContain('Your run: billing');
    expect(now).toContain('Different');
    expect(now).toContain('Match');
  });

  test('a failed review keeps the runs and offers to ask again', async () => {
    mockReview.mockImplementation(async () => {
      throw new ApiError('unknown', 502);
    });
    await mount(LAB_SUMMARY);
    await type('Your prompt', GOOD_PROMPT);
    await press('Run on a live model');
    await press('Review my prompt');
    expect(shown()).toContain('That didn’t go through');
    expect(shown()).toContain('Dana sends the budget on Thursday.');
    mockReview.mockImplementation(async () => reviewOf(LAB_SUMMARY, [GOOD_PROMPT], ['Dana sends the budget on Thursday.']));
    await press('Try again');
    expect(shown()).toContain('AI-assessed, verify');
  });

  test('Try another version goes back to the editor, and the try appears in the history', async () => {
    await runAndReview(LAB_SUMMARY, 'Dana sends the budget on Thursday.');
    await press('Try another version');
    expect(shown()).toContain('Run 1 of 3');
    expect(shown()).toContain('Your earlier tries');
    expect(shown()).toContain('Try 1');
    expect(shown()).toContain('1 prompt');
  });
});

describe('comparisons and tools', () => {
  test('a comparison of prompts has two editors and shows both outputs', async () => {
    mockRun.mockImplementation(async () => runOf(outputOf(LAB_COMPARE_PROMPTS, 'Plain note.'), outputOf(LAB_COMPARE_PROMPTS, 'Friendly note.', 'B')));
    await mount(LAB_COMPARE_PROMPTS);
    expect(has('Prompt A (your starting point)')).toBe(true);
    expect(has('Prompt B (the improved one)')).toBe(true);
    await type('Prompt B (the improved one)', OTHER_GOOD_PROMPT);
    await press('Run both on a live model');
    expect(mockRun.mock.calls[0][1].prompts).toEqual([LAB_COMPARE_PROMPTS.starterPrompt, OTHER_GOOD_PROMPT]);
    const now = shown();
    expect(now).toContain('Output A');
    expect(now).toContain('Output B');
    expect(now).toContain('Plain note.');
    expect(now).toContain('Friendly note.');
  });

  test('two identical prompts cannot be compared', async () => {
    await mount(LAB_COMPARE_PROMPTS);
    await type('Prompt B (the improved one)', LAB_COMPARE_PROMPTS.starterPrompt);
    expect(disabled('Run both on a live model')).toBe(true);
  });

  test('a comparison of models names the tiers, shows measured numbers for each and says it is not a benchmark', async () => {
    mockRun.mockImplementation(async () => runOf(outputOf(LAB_COMPARE_MODELS, 'Short blurb.', 'A', { model: 'm-small' }), outputOf(LAB_COMPARE_MODELS, 'A longer blurb.', 'B', { model: 'm-large' })));
    await mount(LAB_COMPARE_MODELS);
    await type('Your prompt', GOOD_PROMPT);
    await press('Run both on a live model');
    const now = shown();
    expect(now).toContain('Model A (smaller tier)');
    expect(now).toContain('Model B (larger tier)');
    expect(now).toContain('Short blurb.');
    expect(now).toContain('A longer blurb.');
    expect(now.match(/Measured on this run/g)).toHaveLength(2);
    expect(now).toContain('not a benchmark');
    expect(now).not.toMatch(/better model|the best|winner/i);
  });

  test('a tool-use lab lists its tools without what they hold, and draws the model’s steps', async () => {
    mockRun.mockImplementation(async () =>
      runOf(outputOf(LAB_TOOLS, 'Your order shipped on Monday.', 'A', { steps: [{ tool: 'order_status', arguments: { order_id: '1042' }, result: { status: 'shipped', shipped: true } }] })),
    );
    await mount(LAB_TOOLS);
    const before = shown();
    expect(before).toContain('Tools the model can use');
    expect(before).toContain('order_status(order_id)');
    for (const marker of [LAB_MARKERS.fixtureResult, LAB_MARKERS.fixtureOther, LAB_MARKERS.fixtureHours]) expect(before).not.toContain(marker);
    await type('Your prompt', GOOD_PROMPT);
    await press('Run on a live model');
    const now = shown();
    expect(now).toContain('What the model did with its tools');
    expect(now).toContain('1. order_status(order_id: "1042")');
    expect(now).toContain('Result: status: "shipped", shipped: true');
  });

  test('a structured lab shows which fields pass, by code, without the right values', async () => {
    mockRun.mockImplementation(async () => runOf(outputOf(LAB_CLASSIFY, '{"category":"complaint","urgent":"yes"}')));
    await mount(LAB_CLASSIFY);
    await type('Your prompt', GOOD_PROMPT);
    await press('Run on a live model');
    const now = shown();
    expect(now).toContain('Field check');
    expect(now).toContain('Checked by code, not by a model');
    expect(now).toContain('Fails');
    expect(now).not.toContain('shipping');
    expect(now).not.toContain(LAB_MARKERS.keyValue);
  });

  test('every lab’s screen is free of its private text, before and after a run', async () => {
    for (const lab of ALL_TEST_LABS) {
      mockRun.mockImplementation(async () => runOf(outputOf(lab, lab.output.format === 'json' ? '{"category":"other","urgent":true}' : 'A plain answer.')));
      await mount(lab, `private-${lab.id}`);
      for (const marker of Object.values(LAB_MARKERS)) expect(text()).not.toContain(marker);
      await act(async () => renderer.unmount());
    }
  });
});

describe('an id this version does not know', () => {
  test('says so instead of crashing', async () => {
    await mount({ ...LAB_SUMMARY, id: 'lab-99-missing' });
    expect(text()).toContain('not available in this version');
  });
});
