import { useLocalSearchParams } from 'expo-router';

import { ApplicationFormScreen } from '@/features/career';

export default function EditApplicationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ApplicationFormScreen id={id} />;
}
