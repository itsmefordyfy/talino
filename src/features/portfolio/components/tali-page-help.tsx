import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { DraftLine, draftStrings, useDraftErrorText, useMasterContent, useSaveProfile, useTaliDraft, type ProfileInput, type ResumeProfile } from '@/features/resume';
import { useLocalized } from '@/hooks/use-strings';
import { reportError } from '@/lib/monitoring';

import { useSaveProject } from '../hooks/use-projects';
import type { PortfolioProject } from '../lib/projects';
import { taliStrings } from '../tali-strings';

export type TaliPageHelpProps = {
  profile: ResumeProfile | null;
  projects: readonly PortfolioProject[];
};

const text = (value: string | null | undefined) => value ?? '';

/** On the Portfolio screen: Tali (or Tala) drafts the headline, About and the write-ups of projects that lack them; each piece is saved only when the learner taps Use. */
export function TaliPageHelp({ profile, projects }: TaliPageHelpProps) {
  const t = useLocalized(taliStrings);
  const errorText = useDraftErrorText();
  const d = useLocalized(draftStrings);
  const master = useMasterContent();
  const tali = useTaliDraft();
  const saveProfile = useSaveProfile();
  const saveProject = useSaveProject();
  const [used, setUsed] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const working = tali.state.status === 'working';

  // Projects with something to say but a missing summary or story; the rest are left alone.
  const needing = projects.filter((project) => project.summary === '' || project.description === '');
  const content = master.content;
  const hasFacts = projects.length > 0 || (!!content && (content.skills.length > 0 || content.experience.length + content.projects.length + content.education.length > 0));

  const ask = () => {
    setUsed([]);
    setFailed(false);
    void tali.run({
      headline: text(profile?.headline),
      about: text(profile?.summary),
      projects: projects.map((project) => ({ id: project.id, title: project.title, role: project.role, tech: project.tech, notes: project.description || project.summary })),
      want: { headline: true, about: true, projectIds: needing.map((project) => project.id) },
    });
  };

  const saved = (key: string) => ({
    onSuccess: () => setUsed((current) => [...current, key]),
    onError: (error: unknown) => {
      setFailed(true);
      reportError(error, 'portfolio', { action: 'save-tali-draft' });
    },
  });
  const profileInput = (patch: Partial<ProfileInput>): ProfileInput => ({
    headline: text(profile?.headline),
    email: text(profile?.email),
    phone: text(profile?.phone),
    location: text(profile?.location),
    website: text(profile?.website),
    linkedin: text(profile?.linkedin),
    github: text(profile?.github),
    summary: text(profile?.summary),
    career_goal: text(profile?.career_goal),
    level: text(profile?.level),
    ...patch,
  });
  const applyToProject = (project: PortfolioProject, patch: { summary?: string; description?: string }, key: string) =>
    saveProject.mutate({ id: project.id, title: project.title, summary: patch.summary ?? project.summary, description: patch.description ?? project.description, role: project.role, tech: project.tech, url: project.url ?? '', repoUrl: project.repoUrl ?? '', images: project.images }, saved(key));

  const draft = tali.state.status === 'done' ? tali.state.draft : null;
  const nothingToAsk = needing.length === 0 && text(profile?.headline) !== '' && text(profile?.summary) !== '';

  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle">{t.pageTitle}</ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {!hasFacts ? t.pageNothing : nothingToAsk ? t.pageDone : t.pageBody}
      </ThemedText>
      <Button title={working ? t.working : draft || tali.state.status === 'failed' ? t.again : t.button} icon="auto_awesome" variant={tali.state.status === 'idle' ? 'primary' : 'secondary'} loading={working} disabled={working || !hasFacts} onPress={ask} />
      {tali.state.status === 'failed' && <Notice tone={tali.state.error === 'offline' ? 'info' : 'warning'} message={errorText(tali.state.error)} />}
      {failed && <Notice tone="warning" message={t.saveFailed} />}
      {draft && (
        <View style={styles.draft}>
          {draft.headline !== '' && <DraftLine label={t.headline} text={draft.headline} used={used.includes('headline')} useLabel={t.use} usedLabel={t.used} onUse={() => saveProfile.mutate(profileInput({ headline: draft.headline }), saved('headline'))} />}
          {draft.headlineOptions.map((option) => (
            <DraftLine key={option} label={d.headlineAlt} text={option} used={used.includes(`option:${option}`)} useLabel={t.use} usedLabel={t.used} onUse={() => saveProfile.mutate(profileInput({ headline: option }), saved(`option:${option}`))} />
          ))}
          {draft.about !== '' && <DraftLine label={t.about} text={draft.about} used={used.includes('about')} useLabel={t.use} usedLabel={t.used} onUse={() => saveProfile.mutate(profileInput({ summary: draft.about }), saved('about'))} />}
          {draft.projects.map((item) => {
            const project = projects.find((candidate) => candidate.id === item.id);
            if (!project) return null;
            return (
              <View key={item.id} style={styles.project}>
                <ThemedText type="bodySemiBold">{project.title}</ThemedText>
                {item.summary !== '' && <DraftLine label={t.summary} text={item.summary} used={used.includes(`${item.id}:summary`)} useLabel={t.use} usedLabel={t.used} onUse={() => applyToProject(project, { summary: item.summary }, `${item.id}:summary`)} />}
                {item.description !== '' && <DraftLine label={t.story} text={item.description} used={used.includes(`${item.id}:story`)} useLabel={t.use} usedLabel={t.used} onUse={() => applyToProject(project, { description: item.description }, `${item.id}:story`)} />}
              </View>
            );
          })}
          {draft.questions.length > 0 && (
            <View style={styles.questions}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {t.asks}
              </ThemedText>
              {draft.questions.map((question) => (
                <ThemedText key={question} type="secondary">{`• ${question}`}</ThemedText>
              ))}
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  draft: { gap: Spacing.three, marginTop: Spacing.one },
  project: { gap: Spacing.two },
  questions: { gap: Spacing.half },
  caps: { textTransform: 'uppercase', letterSpacing: 0.8 },
});
