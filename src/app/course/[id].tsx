import { useLocalSearchParams } from 'expo-router';

import { CourseScreen } from '@/features/courses';

export default function CourseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CourseScreen courseId={id} />;
}
