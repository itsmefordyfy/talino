import { router } from 'expo-router';

import { Tali } from '@/components/brand/tali';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { LoadingState } from '@/components/ui/state-view';
import { useLocalized } from '@/hooks/use-strings';

import { PlanView } from '../components/plan-view';
import { useLearningPlan } from '../hooks/use-profile';
import { onboardingStrings } from '../strings';

/** Your learning plan, any time after onboarding: it follows the profile, the progress and the purchases. */
export function PlanScreen() {
  const strings = useLocalized(onboardingStrings);
  const { profile, plan, isPending } = useLearningPlan();
  if (isPending) return <LoadingState />;
  if (!plan || !profile) {
    return (
      <Screen>
        <EmptyState illustration={<Tali size={144} mood="curious" tight />} title={strings.setUpProfile} message={strings.setUpProfileBody} action={<Button title={strings.startOnboarding} onPress={() => router.replace('/learning-profile')} />} />
      </Screen>
    );
  }
  const step = plan.firstStep;
  const start = () => {
    if (step.kind === 'lesson') router.push({ pathname: '/lesson/[id]', params: { id: step.lessonId } });
    else router.push({ pathname: '/course/[id]', params: { id: step.courseId } });
  };
  return (
    <Screen>
      <PlanView plan={plan} profile={profile} onStart={start} />
    </Screen>
  );
}
