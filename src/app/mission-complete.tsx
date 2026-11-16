import { useLocalSearchParams } from 'expo-router';

import { MissionCompleteScreen } from '@/features/adventure';

export default function MissionCompleteRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  return <MissionCompleteScreen key={lessonId} lessonId={lessonId} />;
}
