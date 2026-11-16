import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { KIT_TEMPLATES } from '../content';
import { KitTemplateScreen } from './kit-template-screen';

const mockPaywall = jest.fn<(reason: string) => Promise<void>>();
const mockShare = jest.fn<(template: unknown, style: { id: string }) => Promise<boolean>>();
const mockCopy = jest.fn<(text: string) => Promise<boolean>>();
const mockReport = jest.fn();
let mockPro = false;

jest.mock('expo-router', () => ({ Stack: { Screen: () => null }, router: { push: jest.fn() } }));
jest.mock('react-native-safe-area-context', () => (jest.requireActual('react-native-safe-area-context/jest/mock') as { default: object }).default);
jest.mock('@/features/store', () => ({ openPaywall: (reason: string) => mockPaywall(reason), useAccess: () => ({ allAccess: mockPro }) }));
jest.mock('@/features/templates', () => ({ useTemplateValues: () => ({ values: { name: 'Ford Reyes', headline: 'Junior developer', skills: 'React and Python', topProject: 'Plant tracker', topProjectLink: null, portfolioLink: null, course: null } }) }));
jest.mock('@/lib/clipboard', () => ({ copyText: (text: string) => mockCopy(text) }));
jest.mock('@/lib/haptics', () => ({ tapFeedback: jest.fn(), successFeedback: jest.fn() }));
jest.mock('@/lib/monitoring', () => ({ reportError: (...args: unknown[]) => mockReport(...args) }));
jest.mock('../lib/download', () => ({ shareKitFile: (template: unknown, style: { id: string }) => mockShare(template, style) }));

store.dispatch(languageChanged('en'));

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
function tap(instance: TestInstance) {
  let fiber = instance.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error('nothing to press here');
  (fiber.memoizedProps?.onPress as () => void)();
}

const mounted: ReturnType<typeof createRoot>[] = [];
async function render(id: string | undefined) {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <KitTemplateScreen id={id} />
      </Provider>,
    );
  });
  return renderer;
}
const button = (renderer: ReturnType<typeof createRoot>, title: string) => renderer.container.queryAll((instance) => String(instance.type) === 'Text' && textOf(instance) === title)[0];

beforeEach(() => {
  mockPaywall.mockReset().mockResolvedValue(undefined);
  mockShare.mockReset().mockResolvedValue(true);
  mockCopy.mockReset().mockResolvedValue(true);
  mockReport.mockReset();
  mockPro = false;
});
afterEach(async () => {
  await act(async () => {
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});

describe('a career kit template', () => {
  test('someone without Pro can look and pick, but the button is Subscribe, and nothing downloads', async () => {
    const renderer = await render('developer-resume');
    expect(textOf(renderer.container)).toContain('Developer résumé');
    expect(textOf(renderer.container)).toContain('Downloading the templates is part of Talino Pro.');
    expect(button(renderer, 'Download template')).toBeUndefined();
    await act(async () => tap(button(renderer, 'Subscribe to unlock')));
    expect(mockPaywall).toHaveBeenCalledWith('kit');
    expect(mockShare).not.toHaveBeenCalled();
  });

  test('the file type and where it opens are said plainly, with no mention that it needs a particular app', async () => {
    const renderer = await render('developer-resume');
    expect(textOf(renderer.container)).toContain('Word file · opens in Word, Pages, Google Docs and Canva');
    const deck = await render('case-study-deck');
    expect(textOf(deck.container)).toContain('PowerPoint file · opens in PowerPoint, Keynote, Google Slides and Canva');
  });

  test('a subscriber downloads the look that is picked: the Sidebar first, then the Header after picking it', async () => {
    mockPro = true;
    const renderer = await render('developer-resume');
    await act(async () => tap(button(renderer, 'Download template')));
    expect(mockShare).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'developer-resume' }), expect.objectContaining({ id: 'sidebar' }));
    const header = renderer.container.queryAll((instance) => instance.props.accessibilityRole === 'radio' && instance.props.accessibilityLabel === 'Header')[0];
    await act(async () => tap(header));
    await act(async () => tap(button(renderer, 'Download template')));
    expect(mockShare).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'developer-resume' }), expect.objectContaining({ id: 'header' }));
  });

  test('a device that cannot share says so; a failure is reported and shown, not swallowed', async () => {
    mockPro = true;
    mockShare.mockResolvedValueOnce(false);
    const renderer = await render('freelance-invoice');
    await act(async () => tap(button(renderer, 'Download template')));
    expect(textOf(renderer.container)).toContain('Sharing isn’t available on this device.');
    mockShare.mockRejectedValueOnce(new Error('boom'));
    await act(async () => tap(button(renderer, 'Download template')));
    expect(mockReport).toHaveBeenCalledTimes(1);
    expect(textOf(renderer.container)).toContain('The file couldn’t be shared.');
  });

  test('anyone can copy an AI prompt that carries their own details and names the look', async () => {
    const renderer = await render('developer-resume');
    await act(async () => tap(button(renderer, 'Copy AI prompt')));
    expect(mockCopy).toHaveBeenCalledTimes(1);
    const prompt = mockCopy.mock.calls[0][0];
    expect(prompt).toContain('- Name: Ford Reyes');
    expect(prompt).toContain('- Best project: Plant tracker');
    expect(prompt).toContain('downloadable Word file (.docx), the Sidebar look');
    expect(prompt).toContain('Never invent');
    expect(button(renderer, 'Copied')).toBeDefined();
  });

  test('every template opens', async () => {
    for (const template of KIT_TEMPLATES) {
      const renderer = await render(template.id);
      expect(textOf(renderer.container)).not.toContain('isn’t here any more');
    }
  });

  test('an unknown template says so', async () => {
    const renderer = await render('nope');
    expect(textOf(renderer.container)).toContain('This template isn’t here any more');
  });
});
