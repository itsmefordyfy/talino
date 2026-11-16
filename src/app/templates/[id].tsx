import { useLocalSearchParams } from 'expo-router';

import { TemplateScreen } from '@/features/templates';

export default function TemplateRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TemplateScreen id={id} />;
}
