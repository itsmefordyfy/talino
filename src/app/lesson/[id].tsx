import { useLocalSearchParams } from 'expo-router';

import { LessonScreen } from '@/features/courses';

export default function LessonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LessonScreen key={id} lessonId={id} />;
}
