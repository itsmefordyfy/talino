import { useLocalSearchParams } from 'expo-router';

import { ResumeItemScreen } from '@/features/resume';

export default function NewResumeItemRoute() {
  const { kind } = useLocalSearchParams<{ kind?: string }>();
  return <ResumeItemScreen kind={kind} />;
}
