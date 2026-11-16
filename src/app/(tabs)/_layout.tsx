import AppTabs from '@/components/app-tabs';
import { FloatingTaliButton } from '@/components/tab-bar/floating-tali-button';
import { OnboardingFlow } from '@/features/onboarding';
import { selectOnboarded } from '@/features/settings/settings-slice';
import { useAppSelector } from '@/store/hooks';

/**
 * The five tabs, with Tali's face floating over the middle one (FloatingTaliButton). Until the welcome is
 * done it takes the tabs' place (no redirect: a redirect from the anchor screen to a screen above it would
 * land back here and redirect again).
 */
export default function TabLayout() {
  const onboarded = useAppSelector(selectOnboarded);
  if (!onboarded) return <OnboardingFlow />;
  return (
    <>
      <AppTabs />
      <FloatingTaliButton />
    </>
  );
}
