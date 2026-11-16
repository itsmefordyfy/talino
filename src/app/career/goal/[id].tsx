import { useLocalSearchParams } from 'expo-router';

import { GoalFormScreen } from '@/features/career';

export default function EditGoalRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <GoalFormScreen id={id} />;
}
