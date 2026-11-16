import { useLocalSearchParams } from 'expo-router';

import { PathScreen } from '@/features/discover';

export default function PathRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PathScreen pathId={id} />;
}
