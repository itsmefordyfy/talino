import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { getTemplate } from '../content';
import { TemplateAiCard, type TemplateAiDraft } from './template-ai-card';

type Request = { kind: string; draft: string; details: string; tone: string; language: string };
const mockRequest = jest.fn<(identity: unknown, input: Request) => Promise<{ text: string; questions: string[] }>>();
const mockReport = jest.fn();

jest.mock('react-native-safe-area-context', () => (jest.requireActual('react-native-safe-area-context/jest/mock') as { default: object }).default);
jest.mock('@/features/coach', () => ({ useCoachIdentity: () => ({ appUserId: 'user-1', entitlements: ['talino_pro'] }) }));
jest.mock('@/features/resume', () => ({
  TEMPLATE_TONES: ['friendly', 'professional', 'short'],
  requestTemplateDraft: (identity: unknown, input: Request) => mockRequest(identity, input),
  aiErrorKey: (error: unknown) => (error instanceof Error && error.message === 'offline' ? 'offline' : 'unknown'),
}));
jest.mock('@/lib/haptics', () => ({ tapFeedback: jest.fn(), successFeedback: jest.fn() }));
jest.mock('@/lib/monitoring', () => ({ reportError: (...args: unknown[]) => mockReport(...args) }));

store.dispatch(languageChanged('en'));

const values = { name: 'Ford Reyes', headline: 'a junior developer', skills: 'React and Python', topProject: 'Plant tracker', topProjectLink: 'https://plants.example', portfolioLink: 'https://ford.example', course: 'AI Basics for Tech' };
const template = getTemplate('cover-letter');
if (!template) throw new Error('the cover letter template is missing');

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
function tap(instance: TestInstance) {
  let fiber = instance.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error('nothing to press here');
  (fiber.memoizedProps?.onPress as () => void)();
}

const mounted: ReturnType<typeof createRoot>[] = [];
async function render(props: { canWrite: boolean; onUpgrade?: () => void; onDraft?: (draft: TemplateAiDraft | null) => void; hasDraft?: boolean }) {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <TemplateAiCard template={template as NonNullable<typeof template>} values={values} canWrite={props.canWrite} onUpgrade={props.onUpgrade ?? (() => undefined)} onDraft={props.onDraft ?? (() => undefined)} hasDraft={props.hasDraft ?? false} />
      </Provider>,
    );
  });
  return renderer;
}
const button = (renderer: ReturnType<typeof createRoot>, title: string) => renderer.container.queryAll((instance) => String(instance.type) === 'Text' && textOf(instance) === title)[0];

beforeEach(() => {
  mockRequest.mockReset();
  mockReport.mockReset();
});
afterEach(async () => {
  await act(async () => {
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});

describe('Write it with Tali', () => {
  test('without Pro it explains, offers the paywall, and never asks the AI', async () => {
    const onUpgrade = jest.fn();
    const renderer = await render({ canWrite: false, onUpgrade });
    expect(textOf(renderer.container)).toContain('part of Talino Pro');
    expect(button(renderer, 'Write with Tali')).toBeUndefined();
    await act(async () => tap(button(renderer, 'Write with Tali · Pro')));
    expect(onUpgrade).toHaveBeenCalledTimes(1);
    expect(mockRequest).not.toHaveBeenCalled();
  });

  test('the name and links never leave the phone: they go as tokens and are put back in the draft', async () => {
    mockRequest.mockResolvedValue({ text: 'Dear [hiring manager],\n\nI work with React. {{portfolioLink}}\n\nSincerely,\n{{name}}', questions: ['Who is the hiring manager?'] });
    const onDraft = jest.fn<(draft: TemplateAiDraft | null) => void>();
    const renderer = await render({ canWrite: true, onDraft });
    await act(async () => tap(button(renderer, 'Write with Tali')));

    const sent = mockRequest.mock.calls[0][1];
    expect(sent.draft).toContain('{{name}}');
    expect(sent.draft).toContain('{{portfolioLink}}');
    expect(sent.draft).toContain('{{topProjectLink}}');
    for (const secret of ['Ford Reyes', 'https://ford.example', 'https://plants.example']) expect(sent.draft).not.toContain(secret);
    // Things that aren't private are filled in for the model, so it writes from them.
    expect(sent.draft).toContain('React and Python');
    expect(sent.kind).toBe('cover letter');
    expect(sent.tone).toBe('friendly');

    const draft = onDraft.mock.calls[0][0];
    expect(draft?.text).toContain('Ford Reyes');
    expect(draft?.text).toContain('https://ford.example');
    expect(draft?.text).not.toContain('{{');
    expect(draft?.questions).toEqual(['Who is the hiring manager?']);
  });

  test('the notes and the chosen tone are what is sent', async () => {
    mockRequest.mockResolvedValue({ text: 'Dear Sir,\n\nA draft that is long enough.', questions: [] });
    const renderer = await render({ canWrite: true });
    const notes = renderer.container.queryAll((instance) => typeof instance.props?.onChangeText === 'function')[0];
    await act(async () => (notes.props.onChangeText as (text: string) => void)('  Junior Mobile Developer at Acme Labs  '));
    await act(async () => tap(button(renderer, 'Professional')));
    await act(async () => tap(button(renderer, 'Write with Tali')));
    expect(mockRequest.mock.calls[0][1]).toMatchObject({ details: 'Junior Mobile Developer at Acme Labs', tone: 'professional' });
  });

  test('when it fails, the learner is told and keeps the template (no draft is offered)', async () => {
    mockRequest.mockRejectedValue(new Error('offline'));
    const onDraft = jest.fn();
    const renderer = await render({ canWrite: true, onDraft });
    await act(async () => tap(button(renderer, 'Write with Tali')));
    expect(textOf(renderer.container)).toContain('You’re offline');
    expect(onDraft).not.toHaveBeenCalled();
    expect(mockReport).not.toHaveBeenCalled();
  });

  test('an unexpected failure is reported, and the learner can go back to the template after a draft', async () => {
    mockRequest.mockRejectedValue(new Error('boom'));
    const onDraft = jest.fn();
    const renderer = await render({ canWrite: true, onDraft, hasDraft: true });
    await act(async () => tap(button(renderer, 'Write it again')));
    expect(textOf(renderer.container)).toContain('couldn’t write this one');
    expect(mockReport).toHaveBeenCalledTimes(1);
    await act(async () => tap(button(renderer, 'Back to the template')));
    expect(onDraft).toHaveBeenCalledWith(null);
  });
});
