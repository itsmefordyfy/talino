import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { productivityStrings } from '../strings';
import { MatrixBoard, type MatrixBoardProps } from './matrix-board';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
store.dispatch(languageChanged('en'));

const t = productivityStrings.en;
const tasks = [
  { id: 'a', title: 'Send the invoice', detail: 'Due at 5 PM' },
  { id: 'b', title: 'Scroll the feed' },
];

type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };

function textOf(node: TestInstance | string): string {
  return typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join('');
}

const findAll = (renderer: ReturnType<typeof createRoot>, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
const has = (renderer: ReturnType<typeof createRoot>, label: string) => findAll(renderer, label).length > 0;

async function press(renderer: ReturnType<typeof createRoot>, label: string, index = 0) {
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

async function type(renderer: ReturnType<typeof createRoot>, label: string, value: string) {
  const [node] = findAll(renderer, label);
  const onChangeText = node.props.onChangeText as (text: string) => void;
  await act(async () => onChangeText(value));
}

async function mount(props: Partial<MatrixBoardProps> = {}) {
  const onMove = jest.fn();
  const renderer = createRoot();
  const merged: MatrixBoardProps = { tasks, placements: {}, onMove, ...props };
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <MatrixBoard {...merged} />
      </Provider>,
    );
  });
  return { renderer, onMove, text: () => textOf(renderer.container) };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('the matrix board', () => {
  test('shows the four boxes with their meaning, the tray, and every task with its detail', async () => {
    const view = await mount();
    const shown = view.text();
    for (const quadrant of ['do', 'plan', 'delegate', 'drop'] as const) {
      expect(shown).toContain(t.quadrants[quadrant].title);
      expect(shown).toContain(t.quadrants[quadrant].subtitle);
    }
    expect(shown).toContain(t.matrixUnplaced);
    expect(shown).toContain('Send the invoice');
    expect(shown).toContain('Due at 5 PM');
    expect(shown).toContain(t.matrixCount(0, 2));
    await act(async () => view.renderer.unmount());
  });

  test('tapping a task offers the four boxes, and choosing one moves it and closes the offer', async () => {
    const view = await mount();
    expect(has(view.renderer, t.quadrants.do.title)).toBe(false);
    await press(view.renderer, 'Send the invoice. Due at 5 PM');
    expect(view.text()).toContain(t.matrixMoveTo('Send the invoice'));
    for (const quadrant of ['do', 'plan', 'delegate', 'drop'] as const) expect(has(view.renderer, t.quadrants[quadrant].title)).toBe(true);
    // Nothing to take off the board while the task is not placed.
    expect(has(view.renderer, t.matrixClear)).toBe(false);
    await press(view.renderer, t.quadrants.do.title);
    expect(view.onMove).toHaveBeenCalledWith('a', 'do');
    expect(view.text()).not.toContain(t.matrixMoveTo('Send the invoice'));
    await act(async () => view.renderer.unmount());
  });

  test('a placed task sits in its box and can be taken off the board', async () => {
    const view = await mount({ placements: { a: 'plan' } });
    expect(has(view.renderer, t.matrixInBox('Send the invoice', t.quadrants.plan.title) + '. Due at 5 PM')).toBe(true);
    await press(view.renderer, t.matrixInBox('Send the invoice', t.quadrants.plan.title) + '. Due at 5 PM');
    await press(view.renderer, t.matrixClear);
    expect(view.onMove).toHaveBeenCalledWith('a', null);
    await act(async () => view.renderer.unmount());
  });

  test('verdicts show as text with an icon', async () => {
    const view = await mount({ placements: { a: 'do', b: 'do' }, verdicts: { a: 'right', b: 'wrong' } });
    expect(view.text()).toContain(t.matrixRight);
    expect(view.text()).toContain(t.matrixWrong);
    expect(has(view.renderer, `${t.matrixInBox('Scroll the feed', t.quadrants.do.title)}. ${t.matrixWrong}`)).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('read only: tasks cannot be selected or moved', async () => {
    const view = await mount({ readOnly: true });
    const [row] = findAll(view.renderer, 'Send the invoice. Due at 5 PM');
    expect(row.props.accessibilityState.disabled).toBe(true);
    expect(view.text()).not.toContain(t.matrixTapToSort);
    await act(async () => view.renderer.unmount());
  });

  test('adding: a typed title is passed up trimmed and the field clears; a blank one is not added', async () => {
    const onAdd = jest.fn();
    const view = await mount({ onAdd });
    const addButton = () => findAll(view.renderer, t.matrixAdd).find((node) => node.props.accessibilityRole === 'button')!;
    expect(addButton().props.accessibilityState.disabled).toBe(true);
    await type(view.renderer, t.matrixAddLabel, '   ');
    expect(addButton().props.accessibilityState.disabled).toBe(true);
    await type(view.renderer, t.matrixAddLabel, '  Book the dentist ');
    await press(view.renderer, t.matrixAdd);
    expect(onAdd).toHaveBeenCalledWith('Book the dentist');
    expect(addButton().props.accessibilityState.disabled).toBe(true);
    await act(async () => view.renderer.unmount());
  });

  test('without onAdd there is no add field; with onRemove a selected task can be removed', async () => {
    const plain = await mount();
    expect(findAll(plain.renderer, t.matrixAddLabel)).toHaveLength(0);
    await act(async () => plain.renderer.unmount());

    const onRemove = jest.fn();
    const view = await mount({ onRemove });
    await press(view.renderer, 'Scroll the feed');
    await press(view.renderer, t.matrixRemove('Scroll the feed'));
    expect(onRemove).toHaveBeenCalledWith('b');
    await act(async () => view.renderer.unmount());
  });

  test('the two questions suggest a box and can put the task there', async () => {
    const view = await mount();
    await press(view.renderer, 'Scroll the feed');
    await press(view.renderer, t.matrixAskOpen);
    expect(view.text()).toContain(t.matrixUrgent);
    expect(view.text()).toContain(t.matrixImportant);
    expect(view.text()).not.toContain(t.matrixSuggest(t.quadrants.delegate.title));
    // Urgent (yes) and important (no) is "hand it off".
    await press(view.renderer, t.matrixYes, 0);
    expect(view.text()).not.toContain(t.matrixSuggest(t.quadrants.delegate.title));
    await press(view.renderer, t.matrixNo, 1);
    expect(view.text()).toContain(t.matrixSuggest(t.quadrants.delegate.title));
    await press(view.renderer, t.matrixPutIn(t.quadrants.delegate.title));
    expect(view.onMove).toHaveBeenCalledWith('b', 'delegate');
    await act(async () => view.renderer.unmount());
  });
});
