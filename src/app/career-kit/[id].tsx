import { useLocalSearchParams } from 'expo-router';

import { KitTemplateScreen } from '@/features/career-kit';

export default function KitTemplateRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <KitTemplateScreen id={id} />;
}
