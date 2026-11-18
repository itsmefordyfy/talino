import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, type ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { store } from '@/store';

/** Helpers shared by the architecture tools' render tests (not a test itself): mount with the app's providers, find by accessibility label, press and type. */
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };
export type Renderer = ReturnType<typeof createRoot>;

export const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
export const findAll = (renderer: Renderer, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);
export const has = (renderer: Renderer, label: string) => findAll(renderer, label).length > 0;

export const settle = (ms = 20) => act(async () => new Promise((resolve) => setTimeout(resolve, ms)));

export async function press(renderer: Renderer, label: string, index = 0) {
  const node = findAll(renderer, label)[index];
  if (!node) throw new Error(`nothing labelled "${label}"`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.onPress !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no onPress`);
  const onPress = fiber.memoizedProps?.onPress as () => void;
  await act(async () => {
    onPress();
  });
  await settle();
}

export async function typeInto(renderer: Renderer, label: string, value: string, index = 0) {
  const node = findAll(renderer, label)[index];
  if (!node) throw new Error(`nothing labelled "${label}"`);
  await act(async () => {
    (node.props.onChangeText as (text: string) => void)(value);
  });
}

export const clients: QueryClient[] = [];

export async function mount(element: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, networkMode: 'always', gcTime: 0 }, mutations: { retry: false, networkMode: 'always', gcTime: 0 } } });
  clients.push(client);
  const renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <QueryClientProvider client={client}>{element}</QueryClientProvider>
      </Provider>,
    );
  });
  await settle();
  return { renderer, text: () => textOf(renderer.container), unmount: () => act(async () => renderer.unmount()) };
}
