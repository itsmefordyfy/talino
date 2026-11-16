import { useLocalSearchParams } from 'expo-router';

import { ApplicationsScreen } from '@/features/career';

export default function ApplicationsRoute() {
  const { stage } = useLocalSearchParams<{ stage?: string }>();
  return <ApplicationsScreen stage={stage} />;
}
