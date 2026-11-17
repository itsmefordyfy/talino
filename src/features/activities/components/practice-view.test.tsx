import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, type ComponentProps } from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { createTestDatabase } from '@/db/testing/node-database';
import { appendMessage, finishSession, startSession } from '@/features/practice/api/practice-repo';
import { findMessageTask, findScenario } from '@/features/practice/catalog';
import type { PracticeReport } from '@/features/practice/lib/report';
import type { ReviewResult } from '@/features/practice/lib/review';
import { PRIVATE_MARKERS } from '@/features/practice/test-support';
import { languageChanged } from '@/features/settings/settings-slice';
import { ApiError } from '@/lib/api';
import { store } from '@/store';

import type { MessageReviewActivity, RoleplayActivity } from '../types';
import { ActivityView } from './activity-view';

// ── The pieces with no Jest implementation, and the network (never the real server: nothing here calls Gemini).
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('react-native-svg', () => ({ __esModule: true, default: 'Svg', Svg: 'Svg', Circle: 'Circle' }));
jest.mock('@/lib/clipboard', () => ({ copyText: async () => true }));
let mockIds = 0;
// expo-crypto is native; ids that are unique for the run stand in.
jest.mock('@/lib/id', () => ({ newId: () => `test-id-${(mockIds += 1)}`, nowTimestamp: () => new Date().toISOString() }));
// The shimmer uses a Reanimated value Jest's mock doesn't implement; a plain block stands in.
jest.mock('@/components/ui/skeleton', () => ({ SkeletonBlock: () => null }));
jest.mock('@/components/ui/typing-dots', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');
  return { TypingDots: ({ label }: { label: string }) => <Text>{label}</Text> };
});

const mockSpeak = jest.fn<(text: string, options?: unknown) => void>();
jest.mock('expo-speech', () => ({ speak: (text: string, options?: unknown) => mockSpeak(text, options), stop: async () => {}, maxSpeechInputLength: 4000 }));

let mockOnline = true;
jest.mock('@/hooks/use-is-online', () => ({ useIsOnline: () => mockOnline }));
let mockWide = false;
jest.mock('@/hooks/use-two-up', () => ({ useTwoUp: () => mockWide }));

const mockOpenPaywall = jest.fn();
jest.mock('@/features/store/lib/open-paywall', () => ({ openPaywall: (reason: string) => mockOpenPaywall(reason) }));

// The coach feature's index pulls in screens and the purchases SDK; practice needs its error reading and the identity.
jest.mock('@/features/coach', () => ({ ...jest.requireActual<Record<string, unknown>>('@/features/coach/api/client'), useCoachIdentity: () => ({ appUserId: 'user-1', entitlements: [] }) }));
jest.mock('@/features/coach/components/composer', () => jest.requireActual('@/features/coach/components/composer'));

const mockTurn = jest.fn<(identity: unknown, input: { turn: number; messages: { role: string; text: string }[] }) => Promise<{ reply: string; end: boolean }>>();
const mockReport = jest.fn<(identity: unknown, input: unknown) => Promise<PracticeReport>>();
const mockReview = jest.fn<(identity: unknown, input: { text: string; previous?: string }) => Promise<ReviewResult>>();
jest.mock('@/features/practice/api/client', () => ({
  ...jest.requireActual<Record<string, unknown>>('@/features/practice/api/client'),
  requestTurn: (identity: unknown, input: never) => mockTurn(identity, input),
  requestReport: (identity: unknown, input: unknown) => mockReport(identity, input),
  requestReview: (identity: unknown, input: never) => mockReview(identity, input),
}));

let mockDb: Awaited<ReturnType<typeof createTestDatabase>>;
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb }));

store.dispatch(languageChanged('en'));

// ── Fixtures: real catalog items, so a change to a scenario can't leave these tests describing something that no longer exists.
const SCENARIO = findScenario('comm-listening-brief')!;
const SPEAKING = findScenario('speak-introduce-yourself')!;
const TASK = findMessageTask('comm-improve-email')!;
const roleplay = (scenarioId: string, id = 'test-roleplay'): RoleplayActivity => ({ id, kind: 'roleplay', scenarioId, title: 'Practice conversation', prompt: 'Talk it through.', hints: ['Think about what she needs.'], explanation: 'A strong conversation listens first.', concept: 'listening' });
const message = (taskId: string, id = 'test-message'): MessageReviewActivity => ({ id, kind: 'message-review', taskId, title: 'Practice message', prompt: 'Write it.', hints: ['Lead with the point.'], explanation: 'A strong message is clear.', concept: 'writing' });

const goodReport = (overall = 78): PracticeReport => ({
  kind: 'roleplay',
  tooShort: false,
  overall,
  rating: 'good',
  summary: 'You asked focused questions and confirmed the plan.',
  criteria: SCENARIO.criteria.map((id, index) => ({ id, score: 90 - index * 12, reason: `Reason for ${id}.` })),
  strengths: [{ quote: 'what the numbers are for', point: 'You asked about the purpose first.' }],
  growth: [{ quote: 'ok sure', point: 'You agreed before you had a date.' }],
  nextStep: 'End by saying the date back and asking if you got it right.',
});
const goodReview = (): ReviewResult => ({
  kind: 'message-review',
  tooShort: false,
  overall: 64,
  rating: 'fair',
  summary: 'Clear, but the options are hard to find.',
  criteria: TASK.criteria.map((id) => ({ id, score: 64, reason: `Reason for ${id}.` })),
  missing: ['The time zone for each option.'],
  improved: 'SUGGESTED-VERSION: Hi Greg, two options for the supplier call.',
  changes: [{ what: 'Named both options', why: 'So Greg can answer in one word.' }],
  nextStep: 'Add a time zone to each option.',
});

// ── Helpers.
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(' '));

let renderer: ReturnType<typeof createRoot>;
let clients: QueryClient[] = [];
const queryClient = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, networkMode: 'always', gcTime: 0 }, mutations: { retry: false, networkMode: 'always', gcTime: 0 } } });
  clients.push(client);
  return client;
};
const flush = async () => {
  for (let index = 0; index < 4; index += 1)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

async function mount(activity: RoleplayActivity | MessageReviewActivity, extra: Partial<ComponentProps<typeof ActivityView>> = {}) {
  const onAttempt = jest.fn();
  const onSolved = jest.fn();
  const client = queryClient();
  renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <ActivityView activity={activity} courseId="soft-skills-workplace" lessonId="soft-skills-workplace-04" onAttempt={onAttempt} onSolved={onSolved} {...extra} />
        </QueryClientProvider>
      </Provider>,
    );
  });
  await flush();
  return { onAttempt, onSolved };
}
const text = () => textOf(renderer.container);
const byLabel = (label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
const handlerOf = (label: string, name: 'onPress' | 'onChangeText') => {
  const [node] = byLabel(label);
  if (!node) throw new Error(`nothing labelled "${label}"; the screen shows: ${text().slice(0, 400)}`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.[name] !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no ${name}`);
  return fiber.memoizedProps?.[name] as (value?: string) => void;
};
const byPrefix = (prefix: string) => renderer.container.queryAll((instance) => typeof instance.props.accessibilityLabel === 'string' && instance.props.accessibilityLabel.startsWith(prefix));
const has = (label: string) => byLabel(label).length > 0;
async function pressStarting(prefix: string) {
  const [node] = byPrefix(prefix);
  if (!node) throw new Error(`nothing labelled "${prefix}…"`);
  await press(String(node.props.accessibilityLabel));
}
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
const SAY = (turn: number) => `Turn ${turn}: could you tell me what the numbers are for and when you need them, so I can plan my week around it?`;
async function say(turn: number) {
  await type('Say it in your own words', SAY(turn));
  await press('Send your reply');
}

beforeEach(async () => {
  mockDb = await createTestDatabase();
  mockOnline = true;
  mockWide = false;
  mockTurn.mockReset();
  mockReport.mockReset();
  mockReview.mockReset();
  mockSpeak.mockReset();
  mockOpenPaywall.mockReset();
  mockTurn.mockImplementation(async () => ({ reply: 'Fine. Go on.', end: false }));
  mockReport.mockImplementation(async () => goodReport());
  mockReview.mockImplementation(async () => goodReview());
  // A confirmation is answered with its confirming button, so the flow under test carries on.
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

describe('role-play: before it starts', () => {
  test('shows the scenario a learner may read, the partner, the goal and an empty history, and nothing private', async () => {
    await mount(roleplay(SCENARIO.id));
    const shown = text();
    expect(shown).toContain(SCENARIO.title);
    expect(shown).toContain(SCENARIO.setting);
    expect(shown).toContain(SCENARIO.goal);
    expect(shown).toContain(SCENARIO.partner.name);
    expect(shown).toContain(SCENARIO.partner.title);
    expect(shown).toContain('Start the conversation');
    expect(shown).toContain('Nothing here yet');
    for (const secret of [SCENARIO.partner.personality, SCENARIO.partner.private, SCENARIO.partner.reactions.good, SCENARIO.partner.reactions.poor, ...SCENARIO.strongSigns, ...SCENARIO.traps]) expect(shown).not.toContain(secret);
    expect(shown).not.toContain(PRIVATE_MARKERS.private);
    // The opening is only said once the conversation starts.
    expect(shown).not.toContain(SCENARIO.opening);
  });

  test('an id this version does not know says so instead of crashing', async () => {
    await mount(roleplay('no-such-scenario'));
    expect(text()).toContain('not available in this version');
  });
});

describe('role-play: the conversation', () => {
  test('starting shows the partner’s opening, the turn counter and no feedback button until the minimum', async () => {
    await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    const shown = text();
    expect(shown).toContain(SCENARIO.opening);
    expect(shown).toContain(`Turn 1 of ${SCENARIO.maxTurns}`);
    expect(shown).toContain(`${SCENARIO.minTurns} more turns before you can get feedback`);
    expect(has('End and get feedback')).toBe(false);
  });

  test('a turn is saved and answered; the counter moves; the feedback button appears at the minimum', async () => {
    await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    for (let turn = 1; turn <= SCENARIO.minTurns; turn += 1) await say(turn);
    expect(mockTurn).toHaveBeenCalledTimes(SCENARIO.minTurns);
    expect(mockTurn.mock.calls[0][1].messages).toEqual([{ role: 'user', text: SAY(1) }]);
    expect(text()).toContain('Fine. Go on.');
    expect(text()).toContain(`Turn ${SCENARIO.minTurns + 1} of ${SCENARIO.maxTurns}`);
    expect(has('End and get feedback')).toBe(true);
  });

  test('ending asks for the debrief: score, a row per named criterion with its word AND number, quotes of the learner’s own words, one next step, and the activity is completed once', async () => {
    const view = await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    for (let turn = 1; turn <= SCENARIO.minTurns; turn += 1) await say(turn);
    await press('End and get feedback');
    expect(mockReport).toHaveBeenCalledTimes(1);
    const shown = text();
    expect(shown).toContain('78');
    expect(shown).toContain('Good');
    expect(shown).toContain('out of 100');
    for (const [index, id] of SCENARIO.criteria.entries()) {
      const label = id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');
      expect(shown).toContain(`Reason for ${id}.`);
      expect(shown).toContain(String(90 - index * 12));
      expect(shown.toLowerCase()).toContain(label.toLowerCase());
    }
    expect(shown).toContain('what the numbers are for');
    expect(shown).toContain('You asked about the purpose first.');
    expect(shown).toContain('You agreed before you had a date.');
    expect(shown).toContain('End by saying the date back');
    expect(shown).toContain('Try again');
    expect(view.onSolved).toHaveBeenCalledTimes(1);
    expect(view.onAttempt).toHaveBeenCalledWith({ activityId: 'test-roleplay', correct: true, hintsUsed: 0 });
  });

  test('a conversation that reaches the maximum goes straight to the feedback', async () => {
    const view = await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    for (let turn = 1; turn <= SCENARIO.maxTurns; turn += 1) await say(turn);
    expect(mockTurn).toHaveBeenCalledTimes(SCENARIO.maxTurns);
    expect(mockReport).toHaveBeenCalledTimes(1);
    expect(text()).toContain('out of 100');
    expect(view.onSolved).toHaveBeenCalledTimes(1);
  });

  test('the partner ending it early, with too little said, is "not enough to judge": no score and the activity is not completed; Try again is offered', async () => {
    mockTurn.mockImplementation(async () => ({ reply: 'I have to go. Bye.', end: true }));
    mockReport.mockImplementation(async () => ({ kind: 'roleplay', tooShort: true, overall: null, rating: null, summary: 'There was too little to judge fairly.', criteria: [], strengths: [], growth: [], nextStep: '' }));
    const view = await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    await say(1);
    expect(mockReport).toHaveBeenCalledTimes(1);
    expect(text()).toContain('Not enough to judge yet');
    expect(text()).toContain('There was too little to judge fairly.');
    expect(text()).not.toContain('out of 100');
    expect(view.onSolved).not.toHaveBeenCalled();
    expect(has('Try again')).toBe(true);
  });

  test('Try again starts a fresh conversation and keeps the first in the history', async () => {
    await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    for (let turn = 1; turn <= SCENARIO.minTurns; turn += 1) await say(turn);
    await press('End and get feedback');
    await press('Try again');
    expect(text()).toContain(`Turn 1 of ${SCENARIO.maxTurns}`);
    const rows = (await mockDb.getAllAsync<{ attempt: number; status: string }>('SELECT attempt, status FROM practice_sessions ORDER BY attempt')).map((row) => [row.attempt, row.status]);
    expect(rows).toEqual([[1, 'finished'], [2, 'active']]);
  });
});

describe('role-play: when something goes wrong', () => {
  test('a failed request keeps the learner’s words, says so calmly, and Retry sends the very same message once', async () => {
    mockTurn.mockRejectedValueOnce(new ApiError('network'));
    await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    await say(1);
    expect(text()).toContain(SAY(1));
    expect(text()).toContain('You are offline. Your words are saved');
    await press('Try again');
    expect(mockTurn).toHaveBeenCalledTimes(2);
    expect(mockTurn.mock.calls[1][1].messages).toEqual([{ role: 'user', text: SAY(1) }]);
    expect(text()).toContain('Fine. Go on.');
    const saved = await mockDb.getAllAsync<{ text: string }>("SELECT text FROM practice_messages WHERE role = 'user'");
    expect(saved).toHaveLength(1);
  });

  test('the day’s practice running out says when it returns, offers Pro, offers no retry and stops the box', async () => {
    const later = new Date(Date.now() + 3 * 3_600_000).toISOString();
    mockTurn.mockRejectedValueOnce(new ApiError('practice_limit', 429, { resetsAt: later }));
    await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    await say(1);
    expect(text()).toMatch(/A new practice session opens (at|tomorrow at) /);
    expect(text()).toContain('Talino Pro gives you more practice each day.');
    expect(has('Try again')).toBe(false);
    await press('See Talino Pro');
    expect(mockOpenPaywall).toHaveBeenCalledWith('tali');
  });

  test('a failed debrief leaves the conversation open and can be asked for again', async () => {
    mockReport.mockRejectedValueOnce(new ApiError('busy'));
    const view = await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    for (let turn = 1; turn <= SCENARIO.minTurns; turn += 1) await say(turn);
    await press('End and get feedback');
    expect(text()).toContain('Your words are saved');
    expect(view.onSolved).not.toHaveBeenCalled();
    await press('Try again');
    expect(mockReport).toHaveBeenCalledTimes(2);
    expect(view.onSolved).toHaveBeenCalledTimes(1);
  });

  test('offline: the box is disabled and the learner is told, with the earlier sessions still readable', async () => {
    mockOnline = false;
    await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    expect(text()).toContain('Practice needs the internet');
    const [input] = byLabel('Say it in your own words');
    expect(input.props.editable).toBe(false);
  });

  test('the saved data failing to read shows a retry, not a blank screen', async () => {
    const real = mockDb.getFirstAsync.bind(mockDb);
    (mockDb as unknown as { getFirstAsync: unknown }).getFirstAsync = async () => {
      throw new Error('disk');
    };
    await mount(roleplay(SCENARIO.id));
    expect(text()).toContain('This practice could not open');
    (mockDb as unknown as { getFirstAsync: unknown }).getFirstAsync = real;
    await press('Try again');
    expect(text()).toContain('Start the conversation');
  });
});

describe('role-play: coming back', () => {
  test('an unfinished conversation resumes where it was left', async () => {
    await startSession(mockDb, { id: 'ps-resume-1', itemId: SCENARIO.id, kind: 'roleplay', opening: SCENARIO.opening });
    await appendMessage(mockDb, { id: 'm1', sessionId: 'ps-resume-1', role: 'user', text: 'EARLIER-LINE what is it for?' });
    await appendMessage(mockDb, { id: 'm1-reply', sessionId: 'ps-resume-1', role: 'assistant', text: 'It is for the report.' });
    await mount(roleplay(SCENARIO.id));
    expect(text()).toContain('EARLIER-LINE what is it for?');
    expect(text()).toContain('It is for the report.');
    expect(text()).toContain(`Turn 2 of ${SCENARIO.maxTurns}`);
    expect(text()).not.toContain('Start the conversation');
  });

  test('a message with no reply (the app closed mid-request) offers to send it again', async () => {
    await startSession(mockDb, { id: 'ps-stuck-1', itemId: SCENARIO.id, kind: 'roleplay', opening: SCENARIO.opening });
    await appendMessage(mockDb, { id: 'm1', sessionId: 'ps-stuck-1', role: 'user', text: 'STUCK-LINE hello' });
    await mount(roleplay(SCENARIO.id));
    expect(text()).toContain('STUCK-LINE hello');
    expect(text()).toContain('Your words are saved');
    await press('Try again');
    expect(mockTurn).toHaveBeenCalledTimes(1);
    expect(text()).toContain('Fine. Go on.');
  });

  test('the history lists earlier tries with their score; opening one shows its conversation and feedback', async () => {
    await startSession(mockDb, { id: 'ps-old-1', itemId: SCENARIO.id, kind: 'roleplay', opening: SCENARIO.opening });
    await appendMessage(mockDb, { id: 'o1', sessionId: 'ps-old-1', role: 'user', text: 'OLD-LINE tell me more' });
    await finishSession(mockDb, { id: 'ps-old-1', result: goodReport(82) });
    await mount(roleplay(SCENARIO.id));
    expect(text()).toContain('Try 1 · 82 out of 100');
    expect(text()).toContain('1 try so far · Best so far: 82 out of 100');
    await pressStarting('Try 1, 82 out of 100');
    expect(text()).toContain('OLD-LINE tell me more');
    expect(text()).toContain('You asked about the purpose first.');
  });
});

describe('speaking scenarios', () => {
  test('say plainly that only the words are judged, hint at dictation, and offer "Hear the reply" on the partner’s lines', async () => {
    await mount(roleplay(SPEAKING.id));
    expect(text()).toContain('Your words are judged, not your voice');
    expect(text()).toContain('microphone key');
    await press('Start the conversation');
    await press('Hear the reply');
    expect(mockSpeak).toHaveBeenCalled();
    expect(mockSpeak.mock.calls[0][0]).toContain(SPEAKING.opening.slice(0, 20));
    expect(text()).not.toMatch(/record(ing)? your voice|analy[sz]e your (voice|tone)/i);
  });

  test('an ordinary role-play has no read-aloud button and no speaking note', async () => {
    await mount(roleplay(SCENARIO.id));
    await press('Start the conversation');
    expect(has('Hear the reply')).toBe(false);
    expect(text()).not.toContain('Your words are judged');
  });
});

describe('message coach', () => {
  const WELL = 'Hi Greg, the supplier call clashes with the courier pickup next Thursday. I can move the call to Friday at 10:00 or Monday at 9:00, both Perth time. Which would you like? Please tell me by Tuesday at noon Perth time and I will confirm with the supplier right after.';

  test('shows the situation, the brief and the message being answered, and a live word counter against the target', async () => {
    await mount(message(TASK.id));
    const shown = text();
    expect(shown).toContain(TASK.situation);
    expect(shown).toContain(TASK.brief);
    expect(shown).toContain(TASK.received);
    expect(shown).toContain(`0 words · aim for ${TASK.targetWords.min} to ${TASK.targetWords.max}`);
    for (const secret of TASK.mustInclude) expect(shown).not.toContain(secret);
    await type('Write your message', 'one two three');
    expect(text()).toContain(`3 words · aim for ${TASK.targetWords.min} to ${TASK.targetWords.max}`);
  });

  test('a message that is too short, or the task’s own text pasted back, is stopped before anything is asked of the server', async () => {
    await mount(message(TASK.id));
    await type('Write your message', 'Hi Greg, how about Friday?');
    await press('Get feedback');
    expect(text()).toContain('The message is too short to review fairly. Write a little more');
    await type('Write your message', TASK.received!.repeat(2) + ' ' + TASK.brief + ' ' + TASK.situation);
    await press('Get feedback');
    expect(text()).toContain('Write the message in your own words');
    expect(mockReview).not.toHaveBeenCalled();
  });

  test('a review shows the scores with reasons, what is missing, the learner’s message beside the suggested version, why it changed, the model note, and completes the activity once', async () => {
    const view = await mount(message(TASK.id));
    await type('Write your message', WELL);
    await press('Get feedback');
    expect(mockReview).toHaveBeenCalledTimes(1);
    expect(mockReview.mock.calls[0][1].text).toBe(WELL);
    expect(mockReview.mock.calls[0][1].previous).toBeUndefined();
    const shown = text();
    expect(shown).toContain('64');
    expect(shown).toContain('Fair');
    for (const id of TASK.criteria) expect(shown).toContain(`Reason for ${id}.`);
    expect(shown).toContain('The time zone for each option.');
    expect(shown).toContain(WELL);
    expect(shown).toContain('SUGGESTED-VERSION');
    expect(shown).toContain('Named both options');
    expect(shown).toContain('So Greg can answer in one word.');
    expect(shown).toContain('It is a model, not an answer to copy');
    expect(shown).toContain('Rewrite it in your own words');
    expect(view.onSolved).toHaveBeenCalledTimes(1);
    expect(view.onAttempt).toHaveBeenCalledWith({ activityId: 'test-message', correct: true, hintsUsed: 0 });
    // Only the learner's own text is their work.
    const stored = await mockDb.getAllAsync<{ final_text: string }>('SELECT final_text FROM practice_sessions');
    expect(stored).toEqual([{ final_text: WELL }]);
  });

  test('it stays readable side by side on a wide screen', async () => {
    mockWide = true;
    await mount(message(TASK.id));
    await type('Write your message', WELL);
    await press('Get feedback');
    expect(text()).toContain(WELL);
    expect(text()).toContain('SUGGESTED-VERSION');
  });

  test('"Revise and review again" puts the learner’s own text back in the box and the second review carries it as the earlier version', async () => {
    await mount(message(TASK.id));
    await type('Write your message', WELL);
    await press('Get feedback');
    await press('Revise and review again');
    const [box] = byLabel('Write your message');
    expect(box.props.value).toBe(WELL);
    expect(text()).toContain('This is a second review');
    const revised = WELL + ' Thank you, and sorry for the trouble.';
    await type('Write your message', revised);
    await press('Review my revision');
    expect(mockReview).toHaveBeenCalledTimes(2);
    expect(mockReview.mock.calls[1][1]).toMatchObject({ text: revised, previous: WELL });
  });

  test('a failed review keeps the text in the box and retries as the same try; "too short to judge" from the coach does not complete', async () => {
    mockReview.mockRejectedValueOnce(new ApiError('busy'));
    const view = await mount(message(TASK.id));
    await type('Write your message', WELL);
    await press('Get feedback');
    expect(text()).toContain('Your words are saved');
    expect((byLabel('Write your message')[0]).props.value).toBe(WELL);
    mockReview.mockImplementationOnce(async () => ({ kind: 'message-review', tooShort: true, overall: null, rating: null, summary: 'The message is too short to review fairly.', criteria: [], missing: [], improved: '', changes: [], nextStep: '' }));
    await press('Try again');
    expect(text()).toContain('Not enough to judge yet');
    expect(view.onSolved).not.toHaveBeenCalled();
    const sessions = await mockDb.getAllAsync<{ id: string }>('SELECT id FROM practice_sessions');
    expect(sessions).toHaveLength(1);
  });

  test('the history lists past reviews; opening one shows the learner’s message and the review', async () => {
    await startSession(mockDb, { id: 'ps-msg-old', itemId: TASK.id, kind: 'message-review' });
    await finishSession(mockDb, { id: 'ps-msg-old', result: goodReview(), finalText: 'PAST-MESSAGE-TEXT hello Greg' });
    await mount(message(TASK.id));
    expect(text()).toContain('Try 1 · 64 out of 100');
    await pressStarting('Try 1, 64 out of 100');
    expect(text()).toContain('PAST-MESSAGE-TEXT hello Greg');
    expect(text()).toContain('SUGGESTED-VERSION');
  });

  test('offline disables Get feedback and says so', async () => {
    mockOnline = false;
    await mount(message(TASK.id));
    await type('Write your message', WELL);
    expect(text()).toContain('Practice needs the internet');
    // Off-line the button cannot be pressed (a screen reader hears it as disabled), so nothing is ever sent.
    const [button] = byLabel('Get feedback');
    expect(button.props.disabled === true || (button.props.accessibilityState as { disabled?: boolean } | undefined)?.disabled === true).toBe(true);
    expect(mockReview).not.toHaveBeenCalled();
  });
});
