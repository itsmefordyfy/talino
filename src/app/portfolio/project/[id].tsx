import { useLocalSearchParams } from 'expo-router';

import { ProjectScreen } from '@/features/portfolio';

export default function EditPortfolioProjectRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProjectScreen id={id} />;
}
