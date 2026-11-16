import { useLocalSearchParams } from 'expo-router';

import { TailorScreen } from '@/features/resume';

export default function TailorRoute() {
  const { docId } = useLocalSearchParams<{ docId?: string }>();
  return <TailorScreen docId={docId} />;
}
