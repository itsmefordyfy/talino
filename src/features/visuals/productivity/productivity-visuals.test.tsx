import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { createTestDatabase } from '@/db/testing/node-database';
import { PROMPT_TEMPLATES, productivityStrings, readPromptDraft } from '@/features/productivity';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { PomodoroVisual } from './pomodoro-visual';
import { PromptPlaygroundVisual } from './prompt-playground-visual';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('react-native-svg', () => ({ __esModule: true, default: 'Svg', Svg: 'Svg', Circle: 'Circle' }));
jest.mock('@/lib/id', () => ({ newId: () => 'id', nowTimestamp: () => new Date().toISOString() }));
jest.mock('@/components/ui/skeleton', () => ({ SkeletonBlock: () => null }));
const mockCopy = jest.fn<(text: string) => Promise<boolean>>();
jest.mock('@/lib/clipboard', () => ({ copyText: (text: string) => mockCopy(text) }));
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
let mockDb: Awaited<ReturnType<typeof createTestDatabase>>;
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb }));

store.dispatch(languageChanged('en'));
const t = productivityStrings.en;

function textOf(node: TestInstance | string): string {
  if (typeof node === 'string') return node;
  return node.children.map((child) => textOf(child)).join('');
}

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
type Renderer = ReturnType<typeof createRoot>;
const find = (renderer: Renderer, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
const has = (renderer: Renderer, label: string) => find(renderer, label).length > 0;

async function press(renderer: Renderer, label: string) {
  const [node] = find(renderer, label);
  if (!node) throw new Error(`nothing labelled "${label}"`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no onPress`);
  const onPress = fiber.memoizedProps?.onPress as () => void;
  await act(async () => onPress());
}

async function typeInto(renderer: Renderer, label: string, value: string) {
  const [node] = renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label && typeof instance.props.onChangeText === 'function');
  if (!node) throw new Error(`no input labelled "${label}"`);
  await act(async () => (node.props.onChangeText as (text: string) => void)(value));
}

async function mount(element: React.ReactElement) {
  const renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } })}>{element}</QueryClientProvider>
      </Provider>,
    );
  });
  // The saved data and the list of rounds are read asynchronously: let those reads finish.
  for (let round = 0; round < 3; round += 1) await act(async () => new Promise<void>((resolve) => setTimeout(resolve, 0)));
  return { renderer, text: () => textOf(renderer.container) };
}

beforeEach(async () => {
  mockCopy.mockReset().mockResolvedValue(true);
  mockPush.mockClear();
  mockDb = await createTestDatabase();
});
afterEach(() => mockDb.close());

describe('the prompt playground', () => {
  const first = PROMPT_TEMPLATES[0]!;

  test('shows the template, when to use it, the honest label and the structure check', async () => {
    const view = await mount(<PromptPlaygroundVisual />);
    const shown = view.text();
    expect(shown).toContain(first.when);
    expect(shown).toContain(t.promptNoAi);
    expect(shown).toContain(t.promptCheckNote);
    expect(shown).toContain(t.promptScore(checkedParts(first.text), 7));
    for (const template of PROMPT_TEMPLATES) expect(shown).toContain(template.title);
    expect(has(view.renderer, t.promptCopy)).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('Copy prompt copies the current text and confirms it, then goes back', async () => {
    const view = await mount(<PromptPlaygroundVisual />);
    jest.useFakeTimers();
    await press(view.renderer, t.promptCopy);
    expect(mockCopy).toHaveBeenCalledWith(first.text);
    expect(has(view.renderer, t.promptCopied)).toBe(true);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(has(view.renderer, t.promptCopy)).toBe(true);
    await act(async () => view.renderer.unmount());
    jest.useRealTimers();
  });

  test('says so when the copy is refused', async () => {
    mockCopy.mockResolvedValue(false);
    const view = await mount(<PromptPlaygroundVisual />);
    await press(view.renderer, t.promptCopy);
    expect(view.text()).toContain(t.promptCopyFailed);
    await act(async () => view.renderer.unmount());
  });

  test('the checklist follows the text: brackets, parts and the privacy reminder', async () => {
    const view = await mount(<PromptPlaygroundVisual />);
    const before = view.text();
    expect(before).toContain(t.promptPlaceholders(first.text.match(/\[[^\]]+\]/g)!.length));
    await typeInto(view.renderer, t.promptEdit, 'hello');
    const after = view.text();
    expect(after).toContain(t.promptScore(checkedParts('hello'), 7));
    expect(after).not.toContain(t.promptPrivacyLead);
    expect(after).toContain(t.promptBracketsNone);
    await typeInto(view.renderer, t.promptEdit, 'Email me at ana@example.com about [the plan]');
    const withRisk = view.text();
    expect(withRisk).toContain(t.promptPrivacyLead);
    expect(withRisk).toContain(t.promptPrivacy.email);
    expect(withRisk).toContain('[the plan]');
    await typeInto(view.renderer, t.promptEdit, '');
    expect(view.text()).toContain(t.promptEmptyText);
    expect(find(view.renderer, t.promptCopy)[0]!.props.accessibilityState).toMatchObject({ disabled: true });
    await act(async () => view.renderer.unmount());
  });

  test('an edit is kept for that template, Start again restores the template, and Ask Tali opens the coach with the prompt', async () => {
    const view = await mount(<PromptPlaygroundVisual />);
    jest.useFakeTimers();
    await typeInto(view.renderer, t.promptEdit, 'My own version');
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(await readPromptDraft(mockDb, first.id)).toBe('My own version');
    await press(view.renderer, t.promptAskTali);
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/tali', params: { prompt: 'My own version' } });
    await press(view.renderer, t.promptReset);
    expect(await readPromptDraft(mockDb, first.id)).toBe(first.text);
    await act(async () => view.renderer.unmount());
    jest.useRealTimers();
  });

  test('switching template saves the edit in progress and opens the other prompt as it was left', async () => {
    const second = PROMPT_TEMPLATES[1]!;
    const view = await mount(<PromptPlaygroundVisual />);
    await typeInto(view.renderer, t.promptEdit, 'Half typed');
    await press(view.renderer, second.title);
    expect(await readPromptDraft(mockDb, first.id)).toBe('Half typed');
    expect(view.text()).toContain(second.when);
    await press(view.renderer, first.title);
    const [input] = view.renderer.container.queryAll((instance) => instance.props.accessibilityLabel === t.promptEdit && typeof instance.props.onChangeText === 'function');
    expect(input!.props.value).toBe('Half typed');
    await act(async () => view.renderer.unmount());
  });
});

describe('the Pomodoro visual', () => {
  test('opens ready to start, with the honest note and an empty log that says what to do', async () => {
    const view = await mount(<PomodoroVisual />);
    const shown = view.text();
    expect(shown).toContain('25:00');
    expect(shown).toContain(t.timerPhase.work);
    expect(shown).toContain(t.timerRound(1, 4));
    expect(shown).toContain(t.timerKeepOpen);
    expect(shown).toContain(t.timerLogEmpty);
    expect(shown).toContain(t.timerLogEmptyNext);
    expect(has(view.renderer, t.timerStart)).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('Start turns into Pause and then Resume, and Reset goes back', async () => {
    const view = await mount(<PomodoroVisual />);
    jest.useFakeTimers();
    await press(view.renderer, t.timerStart);
    expect(has(view.renderer, t.timerPause)).toBe(true);
    expect(view.text()).toContain(t.timerStatus.running);
    await press(view.renderer, t.timerPause);
    expect(has(view.renderer, t.timerResume)).toBe(true);
    expect(view.text()).toContain(t.timerStatus.paused);
    await press(view.renderer, t.timerReset);
    expect(has(view.renderer, t.timerStart)).toBe(true);
    await act(async () => view.renderer.unmount());
    jest.useRealTimers();
  });

  test('compact leaves out the log but keeps the timer and its controls', async () => {
    const view = await mount(<PomodoroVisual compact />);
    expect(view.text()).not.toContain(t.timerLog);
    expect(has(view.renderer, t.timerStart)).toBe(true);
    await act(async () => view.renderer.unmount());
  });
});

function checkedParts(text: string): number {
  // Counted by the real check, so a change to its rules cannot leave this describing something else.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { checkPrompt } = require('@/features/productivity') as typeof import('@/features/productivity');
  return checkPrompt(text).parts.filter((part) => part.present).length;
}
