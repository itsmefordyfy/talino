import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { SettingsGroup } from '@/components/ui/settings-group';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { FeatureTones, Spacing } from '@/constants/theme';
// The strings file only (not the feature's index): the interview reads the résumé, so its index importing back would be a cycle.
import { interviewStrings } from '@/features/interview/strings';
import { useAccess } from '@/features/store';
import { useLocalized } from '@/hooks/use-strings';
import { formatDate } from '@/lib/dates';

import { builderStrings } from '../builder-strings';
import { useConvertOldVersions, useDocuments } from '../hooks/use-documents';
import { useResumeSources } from '../hooks/use-resume';
import { RESUME_ITEM_KINDS, type ResumeItemKind } from '../types';
import { resumeStrings } from '../strings';

const KIND_ICONS = {
  experience: 'work',
  education: 'school',
  project: 'deployed_code',
  skill: 'bolt',
  certification: 'verified',
  achievement: 'emoji_events',
} as const satisfies Record<ResumeItemKind, string>;

/** Résumés: create one with AI, upload an old one, open or manage the ones made, and keep the career profile every résumé is built from. */
export function ResumeScreen() {
  const s = useLocalized(builderStrings);
  const r = useLocalized(resumeStrings);
  const access = useAccess();
  const interview = useLocalized(interviewStrings);
  const sources = useResumeSources();
  const documents = useDocuments();
  useConvertOldVersions((goal) => s.home.convertedName(goal in s.home.goals ? s.home.goals[goal as keyof typeof s.home.goals] : goal));

  if (documents.isPending || sources.isPending) return <LoadingState />;
  if (documents.isError || sources.isError) return <ErrorState message={r.loadError} onRetry={() => void Promise.all([documents.refetch(), sources.refetch()])} />;

  const list = documents.data ?? [];
  const hasProfile = !!sources.profile || sources.items.length > 0;

  return (
    <Screen>
      <Card style={styles.hero}>
        <View style={styles.heroHead}>
          <Icon name="auto_awesome" size={22} color="primary" />
          <ThemedText type="section" style={styles.flex}>
            {s.home.heroTitle}
          </ThemedText>
        </View>
        <ThemedText type="secondary" themeColor="textSecondary">
          {hasProfile ? s.home.heroReturning : s.home.heroBody}
        </ThemedText>
        <Button title={s.home.create} icon="auto_awesome" onPress={() => router.push('/resume/create')} />
        <Button title={s.home.upload} icon="upload_file" variant="secondary" onPress={() => router.push('/resume/import')} />
        {!access.allAccess && (
          <ThemedText type="caption" themeColor="textSecondary">
            {s.home.freeNote}
          </ThemedText>
        )}
      </Card>

      {list.length > 0 ? (
        <SettingsGroup title={s.home.mine}>
          {list.map((doc) => (
            <ListRow
              key={doc.id}
              title={doc.name}
              subtitle={[s.templates[doc.style.template].name, doc.target?.jobTitle, s.home.updated(formatDate(doc.updated_at.slice(0, 10), { month: 'short', day: 'numeric' }))].filter(Boolean).join(' · ')}
              icon="description"
              tone={FeatureTones.resume}
              onPress={() => router.push({ pathname: '/resume/document/[id]', params: { id: doc.id } })}
            />
          ))}
        </SettingsGroup>
      ) : (
        <Card style={styles.empty}>
          <ThemedText type="bodySemiBold">{s.home.emptyTitle}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {s.home.emptyBody}
          </ThemedText>
        </Card>
      )}

      <SettingsGroup title={s.home.profileTitle} footer={s.home.profileFooter}>
        <ListRow title={r.profileRow} subtitle={sources.profile?.headline ?? r.profileEmpty} icon="person" tone={FeatureTones.resume} onPress={() => router.push('/resume/profile')} />
        {sources.items.map((item) => (
          <ListRow
            key={item.id}
            title={item.title}
            subtitle={[r.kinds[item.kind], item.organization].filter(Boolean).join(' · ')}
            icon={KIND_ICONS[item.kind]}
            tone={FeatureTones.resume}
            onPress={() => router.push({ pathname: '/resume/item/[id]', params: { id: item.id } })}
          />
        ))}
      </SettingsGroup>

      {hasProfile && (
        <SettingsGroup footer={interview.fromResumeBody}>
          <ListRow title={interview.fromResume} subtitle={interview.toolLabel} icon="record_voice_over" tone="indigo" onPress={() => router.push('/interview/setup')} />
        </SettingsGroup>
      )}

      <SettingsGroup title={r.addGroup}>
        {RESUME_ITEM_KINDS.map((kind) => (
          <ListRow key={kind} title={r.addKind[kind]} icon="add" onPress={() => router.push({ pathname: '/resume/item/new', params: { kind } })} />
        ))}
      </SettingsGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  hero: {
    gap: Spacing.three,
  },
  heroHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  empty: {
    gap: Spacing.one,
  },
});
