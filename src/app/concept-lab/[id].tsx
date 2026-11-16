import { useLocalSearchParams } from 'expo-router';

import { VisualScreen } from '@/features/visuals';

export default function VisualRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <VisualScreen id={id ?? ''} />;
}
