import { useLocalSearchParams } from 'expo-router';

import { IncomeFormScreen } from '@/features/career';

export default function EditIncomeRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <IncomeFormScreen id={id} />;
}
