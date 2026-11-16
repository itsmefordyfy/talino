import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { AppState, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';

import { SideInsetsFrame } from '@/components/side-insets-frame';
import { initDatabase } from '@/db/init';
import { DATABASE_NAME } from '@/db/migrations';
import { AppHosts } from '@/features/app-hosts';
import { appScreens } from '@/features/app-screens';
import { ListenBarFrame } from '@/features/courses';
import { selectAppearance, selectCompanion, selectLanguage } from '@/features/settings/settings-slice';
import { purchases } from '@/features/store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStackHeaderOptions } from '@/hooks/use-stack-header-options';
import { useTheme } from '@/hooks/use-theme';
import { applyAppearance } from '@/lib/appearance';
import { initMonitoring, navigationIntegration, Sentry } from '@/lib/monitoring';
import { makeScreenPresets } from '@/navigation/presets';
import { store } from '@/store';
import { useAppSelector } from '@/store/hooks';

// The fonts are embedded by the expo-font plugin, so the splash only waits for the database.
SplashScreen.preventAutoHideAsync();
// Starts RevenueCat before the first screen, so purchases are read while the app opens.
purchases.configure();
initMonitoring();
applyAppearance(store.getState().settings.appearance);
// Development only: lets Metro's debugger reach the store and router to check screens on a simulator, which takes no taps.
if (__DEV__) Object.assign(globalThis, { __talino: { store, router } });

/** A screen opened from outside the app (a reminder) gets the tabs underneath, so back goes home. */
export const unstable_settings = { anchor: '(tabs)' };

const globalForQueries = globalThis as typeof globalThis & { __talinoQueryClient?: QueryClient };
// Local SQLite reads: never stale until a write invalidates them, no retries, no network mode.
const queryClient = (globalForQueries.__talinoQueryClient ??= new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity, retry: false, networkMode: 'always', refetchOnWindowFocus: false },
    mutations: { networkMode: 'always' },
  },
}));

focusManager.setEventListener((setFocused) => {
  const subscription = AppState.addEventListener('change', (state) => setFocused(state === 'active'));
  return () => subscription.remove();
});

function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          {/* Renders children only after the schema is ready, so no screen reads a half-built database. */}
          <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDatabase}>
            <AppNavigator />
          </SQLiteProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

function AppNavigator() {
  const colorScheme = useColorScheme();
  const colors = useTheme();
  const headerOptions = useStackHeaderOptions();
  const appearance = useAppSelector(selectAppearance);
  const language = useAppSelector(selectLanguage);
  const companion = useAppSelector(selectCompanion);
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  // Sentry names the screen an error happened on from the navigation container.
  const navigationRef = useNavigationContainerRef();
  useEffect(() => {
    navigationIntegration.registerNavigationContainer(navigationRef);
  }, [navigationRef]);

  const navigationTheme = {
    ...baseTheme,
    colors: { ...baseTheme.colors, primary: colors.primaryText, background: colors.background, card: colors.background, text: colors.text, border: colors.border },
  };

  useEffect(() => {
    applyAppearance(appearance);
  }, [appearance]);
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  const presets = makeScreenPresets(colors, language, companion);

  return (
    <ThemeProvider value={navigationTheme}>
      {/* From the app's own scheme: "auto" follows the phone, and missed the in-app Dark choice. */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {/* The lesson audio's player bar sits above every screen while a lesson is being read aloud. */}
      <ListenBarFrame>
        <Stack screenOptions={headerOptions} screenLayout={({ children }) => <SideInsetsFrame>{children}</SideInsetsFrame>}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {appScreens(presets)}
        </Stack>
      </ListenBarFrame>
      <AppHosts />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Sentry.wrap(RootLayout);
