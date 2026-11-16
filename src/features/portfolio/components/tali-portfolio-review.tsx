import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Radius, Spacing } from '@/constants/theme';
import { DraftLine, useDraftErrorText, useProfilePhoto, useSaveProfile, useTaliReview, type ProfileInput, type ResumeProfile, type ReviewSuggestion } from '@/features/resume';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { reportError } from '@/lib/monitoring';

import { useReorderProjects, useSaveProject } from '../hooks/use-projects';
import type { PortfolioPayload } from '../lib/build-portfolio';
import type { PortfolioProject } from '../lib/projects';
import { taliStrings } from '../tali-strings';

export type TaliPortfolioReviewProps = {
  profile: ResumeProfile | null;
  projects: readonly PortfolioProject[];
  /** What the page will show now, for its links and certificates. */
  portfolio: PortfolioPayload;
};

const text = (value: string | null | undefined) => value ?? '';

/** Tali (or Tala) reviews the whole page. Every suggestion is applied by its own button, and nothing changes without a tap. */
export function TaliPortfolioReview({ profile, projects, portfolio }: TaliPortfolioReviewProps) {
  const t = useLocalized(taliStrings);
  const theme = useTheme();
  const errorText = useDraftErrorText();
  const review = useTaliReview();
  const photo = useProfilePhoto();
  const saveProfile = useSaveProfile();
  const saveProject = useSaveProject();
  const reorder = useReorderProjects();
  const [done, setDone] = useState<string[]>([]);
  const [saveFailed, setSaveFailed] = useState(false);
  const working = review.state.status === 'working';
  const result = review.state.status === 'done' ? review.state.result : null;
  const empty = projects.length === 0 && text(profile?.headline) === '' && text(profile?.summary) === '';

  const ask = () => {
    setDone([]);
    setSaveFailed(false);
    void review.run({
      headline: text(profile?.headline),
      about: text(profile?.summary),
      linkLabels: portfolio.links.map((link) => link.label),
      certificates: portfolio.certificates.length,
      hasPhoto: Boolean(photo.data),
      projects: projects.map((project) => ({ id: project.id, title: project.title, role: project.role, tech: project.tech, summary: project.summary, description: project.description, shots: project.images.length, hasLink: Boolean(project.url || project.repoUrl) })),
    });
  };

  const settled = (key: string) => ({
    onSuccess: () => setDone((current) => [...current, key]),
    onError: (error: unknown) => {
      setSaveFailed(true);
      reportError(error, 'portfolio', { action: 'apply-review' });
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
  const setHeadline = (value: string, key: string) => saveProfile.mutate(profileInput({ headline: value }), settled(key));
  const apply = (suggestion: ReviewSuggestion) => {
    if (suggestion.kind === 'headline') return setHeadline(suggestion.after, suggestion.key);
    if (suggestion.kind === 'about') return saveProfile.mutate(profileInput({ summary: suggestion.after }), settled(suggestion.key));
    const project = projects.find((candidate) => candidate.id === suggestion.id);
    if (!project) return;
    saveProject.mutate(
      {
        id: project.id,
        title: project.title,
        summary: suggestion.kind === 'project_summary' ? suggestion.after : project.summary,
        description: suggestion.kind === 'project_description' ? suggestion.after : project.description,
        role: project.role,
        tech: project.tech,
        url: project.url ?? '',
        repoUrl: project.repoUrl ?? '',
        images: project.images,
      },
      settled(suggestion.key),
    );
  };
  const titleOf = (id: string) => projects.find((project) => project.id === id)?.title ?? id;

  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle">{t.reviewTitle}</ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {empty ? t.pageNothing : t.reviewBody}
      </ThemedText>
      <Button title={working ? t.reviewing : result || review.state.status === 'failed' ? t.again : t.reviewButton} icon="fact_check" variant={review.state.status === 'idle' ? 'primary' : 'secondary'} loading={working} disabled={working || empty} onPress={ask} />
      {review.state.status === 'failed' && <Notice tone={review.state.error === 'offline' ? 'info' : 'warning'} message={errorText(review.state.error)} />}
      {saveFailed && <Notice tone="warning" message={t.saveFailed} />}

      {result && (
        <View style={styles.result}>
          <View style={[styles.verdict, { backgroundColor: theme.primarySoft }]}>
            <Icon name="auto_awesome" size={20} color="primaryText" />
            <ThemedText type="bodySemiBold" style={styles.flex}>
              {result.verdict}
            </ThemedText>
          </View>

          {result.layout !== '' && (
            <View style={styles.block}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {t.layoutTitle}
              </ThemedText>
              <ThemedText type="secondary">{result.layout}</ThemedText>
            </View>
          )}

          {result.missing.length > 0 && (
            <View style={styles.block}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {t.missingTitle}
              </ThemedText>
              {result.missing.map((item) => (
                <ThemedText key={`${item.area}-${item.advice}`} type="secondary">{`• ${t.areas[item.area] ?? t.areas.other}: ${item.advice}`}</ThemedText>
              ))}
            </View>
          )}

          {result.suggestions.length > 0 && (
            <View style={styles.block}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {t.changesTitle}
              </ThemedText>
              {result.suggestions.map((suggestion) => (
                <View key={suggestion.key} style={styles.suggestion}>
                  <DraftLine
                    label={suggestion.id ? `${t.kinds[suggestion.kind]} · ${titleOf(suggestion.id)}` : t.kinds[suggestion.kind]}
                    text={suggestion.after}
                    used={done.includes(suggestion.key)}
                    useLabel={t.use}
                    usedLabel={t.used}
                    onUse={() => apply(suggestion)}
                  />
                  {suggestion.reason !== '' && (
                    <ThemedText type="caption" themeColor="textSecondary">
                      {suggestion.reason}
                    </ThemedText>
                  )}
                </View>
              ))}
            </View>
          )}

          {result.headlineOptions.length > 0 && (
            <View style={styles.block}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {t.optionsTitle}
              </ThemedText>
              {result.headlineOptions.map((option) => (
                <DraftLine key={option} label={t.headline} text={option} used={done.includes(`option:${option}`)} useLabel={t.use} usedLabel={t.used} onUse={() => setHeadline(option, `option:${option}`)} />
              ))}
            </View>
          )}

          {result.order && (
            <View style={styles.block}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {t.orderTitle}
              </ThemedText>
              {result.order.ids.map((id, index) => (
                <ThemedText key={id} type="secondary">{`${index + 1}. ${titleOf(id)}`}</ThemedText>
              ))}
              {result.order.reason !== '' && (
                <ThemedText type="caption" themeColor="textSecondary">
                  {result.order.reason}
                </ThemedText>
              )}
              <Button
                title={done.includes('order') ? t.orderApplied : t.applyOrder}
                icon={done.includes('order') ? 'check' : 'swap_vert'}
                variant="secondary"
                size="small"
                disabled={done.includes('order')}
                onPress={() => result.order && reorder.mutate(result.order.ids, settled('order'))}
              />
            </View>
          )}

          {result.questions.length > 0 && (
            <View style={styles.block}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {t.asks}
              </ThemedText>
              {result.questions.map((question) => (
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
  result: { gap: Spacing.three, marginTop: Spacing.one },
  verdict: { flexDirection: 'row', gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', alignItems: 'flex-start' },
  flex: { flex: 1 },
  block: { gap: Spacing.two },
  suggestion: { gap: Spacing.one },
  caps: { textTransform: 'uppercase', letterSpacing: 0.8 },
});
