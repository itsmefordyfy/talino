import { useLocalSearchParams } from 'expo-router';

import { CertificateScreen } from '@/features/certificates';

export default function CertificateRoute() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  return <CertificateScreen courseId={courseId} />;
}
