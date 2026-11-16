import { router } from 'expo-router';

import { GlassIconButton } from '@/components/ui/glass-icon-button';
import { useStrings } from '@/hooks/use-strings';

/**
 * The gear in each tab's header: Settings lives here, keeping the tab bar to the main screens.
 * The app's one round button (GlassIconButton): Liquid Glass on iOS 26, a frosted circle elsewhere.
 */
export function SettingsButton() {
  const strings = useStrings();
  return <GlassIconButton icon="settings" iconSize={22} accessibilityLabel={strings.common.settings} onPress={() => router.push('/settings')} />;
}
