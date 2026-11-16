import { describe, expect, jest, test } from '@jest/globals';
import { act, type ReactElement } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createRoot, type TestInstance } from 'test-renderer';

import { LEARNING_PATHS } from '@/features/courses/content/catalog/paths';
import { catalogFacts } from '@/features/courses/lib/catalog-facts';
import { searchSuggestions } from '@/features/courses/lib/discovery/suggest';
import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { initialDiscoverState } from '../discover-slice';
import { pathSummaries } from '../lib/browse';
import { CategoryGrid, LevelTiles, ToolChips } from './browse-blocks';
import { PathList } from './path-list';
import { SearchSuggestions } from './search-suggestions';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...args: unknown[]) => mockPush(...args) } }));
store.dispatch(languageChanged('en'));

const facts = catalogFacts();

function textOf(node: TestInstance | string): string {
  if (typeof node === 'string') return node;
  return node.children.map((child) => textOf(child)).join(' ');
}

async function mount(element: ReactElement) {
  const renderer = createRoot();
  await act(async () => {
    renderer.render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 402, height: 874 }, insets: { top: 62, bottom: 34, left: 0, right: 0 } }}>
        <Provider store={store}>{element}</Provider>
      </SafeAreaProvider>,
    );
  });
  return renderer;
}

type Fiber = { memoizedProps?: Record<string, unknown>; return: Fiber | null };

/** The element whose accessibility label starts with `label`, with the onPress of the component that owns it. */
function pressable(root: TestInstance, label: string): { props: { onPress: () => void } } {
  const [node] = root.queryAll((instance) => typeof instance.props.accessibilityLabel === 'string' && instance.props.accessibilityLabel.startsWith(label));
  if (!node) throw new Error(`No element labelled ${label}`);
  let fiber = (node as unknown as { unstable_fiber: Fiber | null }).unstable_fiber;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`${label} has no onPress`);
  return { props: { onPress: fiber.memoizedProps?.onPress as () => void } };
}

const resetDiscover = () => store.dispatch({ type: 'discover/discoverReset' });

describe('Discover browse blocks render the real catalog and lead somewhere', () => {
  test('Browse by level: four tiles with real counts; a tile opens All with that level only', async () => {
    resetDiscover();
    const renderer = await mount(<LevelTiles facts={facts} />);
    const text = textOf(renderer.container);
    for (const label of ['Beginner', 'Intermediate', 'Advanced', 'Expert']) expect(text).toContain(label);
    const expertCount = facts.filter((fact) => fact.learningLevel === 'expert').length;
    await act(async () => pressable(renderer.container, `Expert, ${expertCount} courses`).props.onPress());
    expect(store.getState().discover).toMatchObject({ tab: 'all', query: '', filters: { ...initialDiscoverState.filters, levels: ['expert'] } });
    await act(async () => renderer.unmount());
  });

  test('Browse by category: every category with courses; a tile opens its tab', async () => {
    resetDiscover();
    const renderer = await mount(<CategoryGrid facts={facts} />);
    expect(textOf(renderer.container)).toContain('Vibe Coding and App Building');
    const count = facts.filter((fact) => fact.category === 'ai-coding-tools').length;
    await act(async () => pressable(renderer.container, `AI Coding Tools, ${count} courses`).props.onPress());
    expect(store.getState().discover.tab).toBe('ai-coding-tools');
    await act(async () => renderer.unmount());
  });

  test('AI tools: chips for the tools the catalog teaches; one opens a clean list for it', async () => {
    resetDiscover();
    const renderer = await mount(<ToolChips facts={facts} />);
    expect(textOf(renderer.container)).toContain('Claude Code');
    await act(async () => pressable(renderer.container, 'AI tool: Cursor').props.onPress());
    expect(store.getState().discover).toMatchObject({ tab: 'all', filters: { ...initialDiscoverState.filters, tools: ['cursor'] } });
    await act(async () => renderer.unmount());
  });

  test('Learning paths: audience and computed level, courses and time; four first, then Show all', async () => {
    const summaries = pathSummaries(LEARNING_PATHS, facts, new Set());
    const renderer = await mount(<PathList summaries={summaries} initial={4} />);
    let text = textOf(renderer.container);
    expect(text).toContain(LEARNING_PATHS[0].audience);
    expect(text).toMatch(/Beginner → (Intermediate|Advanced|Expert) · \d+ courses ·/);
    expect(text).not.toContain(LEARNING_PATHS[5].audience);
    await act(async () => pressable(renderer.container, `Show all ${summaries.length} paths`).props.onPress());
    text = textOf(renderer.container);
    expect(text).toContain(LEARNING_PATHS[5].audience);
    await act(async () => renderer.unmount());
  });
});

describe('search suggestions', () => {
  test('a tool suggestion becomes a filter and clears the typed words; a course suggestion opens the course', async () => {
    resetDiscover();
    store.dispatch({ type: 'discover/queryChanged', payload: 'cla' });
    const suggestions = searchSuggestions(facts, 'cla');
    const renderer = await mount(<SearchSuggestions suggestions={suggestions} />);
    await act(async () => pressable(renderer.container, 'AI tool: Claude Code').props.onPress());
    expect(store.getState().discover.query).toBe('');
    expect(store.getState().discover.filters.tools).toEqual(['claude-code']);
    await act(async () => renderer.unmount());

    const course = searchSuggestions(facts, 'website').find((suggestion) => suggestion.kind === 'course');
    expect(course).toBeDefined();
    const second = await mount(<SearchSuggestions suggestions={course ? [course] : []} />);
    await act(async () => pressable(second.container, `Course: ${course?.label}`).props.onPress());
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/course/[id]', params: { id: course?.id } });
    await act(async () => second.unmount());
  });
});
