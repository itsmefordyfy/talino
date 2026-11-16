import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { SettingsGroup } from '@/components/ui/settings-group';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { useLocalized } from '@/hooks/use-strings';

import { useCareer } from '../hooks/use-career';
import { stageCounts } from '../lib/overview';
import { careerStrings } from '../strings';
import { isStage, STAGES, type Stage } from '../types';

type Filter = Stage | 'all';

export type ApplicationsScreenProps = {
  /** Preselected from the Career tab's pipeline. */
  stage?: string;
};

/** Every application and proposal, filtered by stage, newest change first. */
export function ApplicationsScreen({ stage }: ApplicationsScreenProps) {
  const strings = useLocalized(careerStrings);
  const career = useCareer();
  const [filter, setFilter] = useState<Filter>(isStage(stage) ? stage : 'all');

  if (career.isError) return <ErrorState onRetry={() => void career.refetch()} />;
  if (!career.data) return <LoadingState />;

  const { applications } = career.data;
  const counts = stageCounts(applications);
  const shown = filter === 'all' ? applications : applications.filter((row) => row.stage === filter);
  const options = [
    { value: 'all' as const, label: `${strings.allStages} ${applications.length}` },
    ...STAGES.map((value) => ({ value, label: `${strings.stageLabel(value, 'any')} ${counts[value]}` })),
  ];
  const add = <Button title={strings.newApplication} icon="add" onPress={() => router.push('/career/application/new')} />;

  return (
    <Screen footer={add}>
      <ChipSelect<Filter> options={options} value={filter} onChange={setFilter} />
      {shown.length === 0 ? (
        <EmptyState icon="work" title={applications.length === 0 ? strings.noApplications : strings.noneInStage} />
      ) : (
        <SettingsGroup>
          {shown.map((row) => (
            <ListRow
              key={row.id}
              icon={row.kind === 'job' ? 'work' : 'handshake'}
              tone={row.kind === 'job' ? 'teal' : 'mint'}
              title={row.title}
              subtitle={strings.applicationSubtitle(row.company, strings.stageLabel(row.stage, row.kind))}
              onPress={() => router.push({ pathname: '/career/application/[id]', params: { id: row.id } })}
            />
          ))}
        </SettingsGroup>
      )}
    </Screen>
  );
}
