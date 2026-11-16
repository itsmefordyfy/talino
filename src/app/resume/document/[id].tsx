import { useLocalSearchParams } from 'expo-router';

import { DocumentScreen } from '@/features/resume';

export default function ResumeDocumentRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DocumentScreen id={id} />;
}
