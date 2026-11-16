import { useLocalSearchParams } from 'expo-router';

import { BadgeScreen } from '@/features/me';

export default function BadgeRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BadgeScreen badgeId={id} />;
}
