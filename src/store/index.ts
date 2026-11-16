import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { discoverSlice, hydrateDiscoverState } from '@/features/discover/discover-slice';
import { firstLaunchSettingsState, hydrateSettingsState, settingsSlice, type SettingsState } from '@/features/settings/settings-slice';

import { setActiveLanguage } from '@/lib/i18n';

import { hasSavedSlice, loadSlice, saveSlice } from './persistence';

const reducer = combineReducers({
  settings: settingsSlice.reducer,
  discover: discoverSlice.reducer,
});
type State = ReturnType<typeof reducer>;

/**
 * Persisted slices (an explicit allowlist): the storage key and what of the slice is saved. Discover keeps only the
 * technologies the learner explored, so typing a search never writes to storage.
 */
const PERSISTED = {
  settings: { key: 'settings:v1', pick: (state: State) => state.settings },
  discover: { key: 'discover:v1', pick: (state: State) => state.discover.exploredTechnologies },
} as const;

// Nothing saved yet means a fresh install: the phone's language and the welcome to show.
const settings = hasSavedSlice(PERSISTED.settings.key) ? hydrateSettingsState(loadSlice<Partial<SettingsState>>(PERSISTED.settings.key, {})) : firstLaunchSettingsState();
const discover = hydrateDiscoverState(loadSlice<Record<string, number>>(PERSISTED.discover.key, {}));

export const store = configureStore({
  reducer,
  preloadedState: { settings, discover },
});

// Dates and times are formatted outside React too (notifications, plain helpers): they follow the chosen language.
setActiveLanguage(settings.language);

// Write a slice only when it actually changed.
let lastState = store.getState();
store.subscribe(() => {
  const state = store.getState();
  if (state.settings.language !== lastState.settings.language) setActiveLanguage(state.settings.language);
  for (const { key, pick } of Object.values(PERSISTED)) {
    const saved = pick(state);
    if (saved !== pick(lastState)) saveSlice(key, saved);
  }
  lastState = state;
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
