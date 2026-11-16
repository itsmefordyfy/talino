import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { store } from '@/store';

import { ProfileHero, type ProfileHeroProps } from './profile-hero';

jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(' '));
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
/** Presses the nearest pressable at or above this element, the way a tap reaches it. */
function tap(instance: TestInstance) {
  let fiber = instance.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error('nothing to press here');
  (fiber.memoizedProps?.onPress as () => void)();
}

const mounted: ReturnType<typeof createRoot>[] = [];
afterEach(async () => {
  await act(async () => {
    for (const renderer of mounted.splice(0)) renderer.unmount();
  });
});

const base: ProfileHeroProps = {
  name: 'Ford',
  headline: 'Junior Web Developer · React & TypeScript',
  photo: null,
  percent: 67,
  label: 'Profile 67% complete',
  next: 'Next: add your city',
  onNext: jest.fn(),
  busy: false,
  problem: null,
  onChoosePhoto: jest.fn(),
  onRemovePhoto: jest.fn(),
};

async function render(props: Partial<ProfileHeroProps> = {}) {
  const renderer = createRoot();
  mounted.push(renderer);
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <ProfileHero {...base} {...props} />
      </Provider>,
    );
  });
  return renderer;
}
const byLabel = (renderer: ReturnType<typeof createRoot>, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);

describe('the profile hero', () => {
  test('shows who this is and how complete the profile is, once', async () => {
    const text = textOf((await render()).container);
    expect(text.match(/Ford/g)).toHaveLength(1);
    expect(text).toContain('Junior Web Developer');
    expect(text.match(/Profile 67% complete/g)).toHaveLength(1);
    expect(text).toContain('Next: add your city');
  });

  test('has one picture, not two (the header and the picture card used to show the same face twice)', async () => {
    const withPhoto = await render({ photo: '/9j/AAAA' });
    expect(withPhoto.container.queryAll((instance) => instance.type === 'Image')).toHaveLength(1);
    // With no picture it is the initials, drawn once.
    const without = await render();
    expect(textOf(without.container).match(/\bF\b/g)).toHaveLength(1);
  });

  test('with no picture the picture is the Add control (no separate button), with the reason for a clear headshot', async () => {
    const renderer = await render();
    const text = textOf(renderer.container);
    expect(byLabel(renderer, 'Add a photo')).toHaveLength(1);
    // The words "Add a photo" are not drawn as a second button.
    expect(text).not.toContain('Add a photo');
    expect(text).toContain('A clear headshot works best');
    expect(text).not.toContain('Remove photo');
  });

  test('with a picture the picture is the Change control, Remove is the one button, and the explanation goes', async () => {
    const renderer = await render({ photo: '/9j/AAAA' });
    const text = textOf(renderer.container);
    expect(byLabel(renderer, 'Change photo')).toHaveLength(1);
    expect(text).not.toContain('Change photo');
    expect(text).toContain('Remove photo');
    expect(text).not.toContain('A clear headshot works best');
  });

  test('tapping the picture, the add button or remove does what it says', async () => {
    const onChoosePhoto = jest.fn();
    const onRemovePhoto = jest.fn();
    const renderer = await render({ photo: '/9j/AAAA', onChoosePhoto, onRemovePhoto });
    // The picture itself is the control, with a label a screen reader can read.
    await act(async () => tap(byLabel(renderer, 'Change photo')[0]));
    expect(onChoosePhoto).toHaveBeenCalledTimes(1);
    const remove = renderer.container.queryAll((instance) => textOf(instance) === 'Remove photo' && instance.type === 'Text');
    await act(async () => tap(remove[0]));
    expect(onRemovePhoto).toHaveBeenCalledTimes(1);
  });

  test('while a picture is saving the picture control is busy', async () => {
    const renderer = await render({ photo: '/9j/AAAA', busy: true });
    const picture = byLabel(renderer, 'Change photo')[0];
    expect(picture.props.accessibilityState).toMatchObject({ busy: true });
  });

  test('a picture that could not be added says why, instead of the explanation', async () => {
    const text = textOf((await render({ problem: "That picture couldn't be made small enough. Try a different one." })).container);
    expect(text).toContain("couldn't be made small enough");
    expect(text).not.toContain('A clear headshot works best');
  });

  test('the next thing to add is a button that jumps to it; with nothing left it is plain text', async () => {
    const onNext = jest.fn();
    const renderer = await render({ onNext });
    await act(async () => tap(byLabel(renderer, 'Next: add your city')[0]));
    expect(onNext).toHaveBeenCalledTimes(1);

    const done = await render({ percent: 100, label: 'Profile 100% complete', next: 'Your profile is complete.', onNext: undefined });
    expect(byLabel(done, 'Your profile is complete.')).toHaveLength(0);
    expect(textOf(done.container)).toContain('Your profile is complete.');
  });
});
