import { Stack } from 'expo-router';
import type { ReactElement } from 'react';

import type { ScreenPresets } from '@/navigation/presets';

import { appScreenRegistry } from './screen-registry';

/**
 * Every stack screen outside the tabs, one list per feature (`features/<name>/screens.tsx`), so a
 * feature registers its own routes and presentation without touching the root layout.
 */
export function appScreens(presets: ScreenPresets): ReactElement[] {
  return appScreenRegistry.flatMap((register) => register(presets)).map((screen) => <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />);
}
