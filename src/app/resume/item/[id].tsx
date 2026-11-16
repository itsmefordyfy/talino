import { useLocalSearchParams } from 'expo-router';

import { ResumeItemScreen } from '@/features/resume';

export default function EditResumeItemRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ResumeItemScreen id={id} />;
}
