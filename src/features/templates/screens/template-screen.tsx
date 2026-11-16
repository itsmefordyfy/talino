import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListRow } from '@/components/ui/list-row';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SettingsGroup } from '@/components/ui/settings-group';
import { ErrorState, LoadingState, NotFoundState } from '@/components/ui/state-view';
import { FeatureTones, Spacing } from '@/constants/theme';
import { openPaywall, useAccess } from '@/features/store';
import { useLocalized } from '@/hooks/use-strings';
import { copyText } from '@/lib/clipboard';

import { TemplateAiCard, type TemplateAiDraft } from '../components/template-ai-card';
import { getTemplate } from '../content';
import { useTemplateValues } from '../hooks/use-template-values';
import { bracketBlanks, fillTemplate } from '../lib/fill';
import { templateStrings } from '../strings';

/** Templates for the learner's own profile and job application: Tali is told they are working on that (see features/coach/lib/focus.ts, `resume`). */
const PROFILE_TEMPLATES = new Set(['linkedin-headline', 'linkedin-about', 'cover-letter']);

/** One template filled in from the learner's details, to copy, share or have Tali improve. */
export function TemplateScreen({ id }: { id?: string }) {
  const strings = useLocalized(templateStrings);
  const template = getTemplate(id);
  const { isPending, isError, refetch, values } = useTemplateValues();
  const access = useAccess();
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState<TemplateAiDraft | null>(null);

  if (!template) return <NotFoundState icon="description" title={strings.notFound} message={strings.notFoundBody} />;
  const title = <Stack.Screen options={{ title: template.title }} />;
  if (isPending) return <LoadingState />;
  if (isError || !values) {
    return (
      <>
        {title}
        <ErrorState message={strings.loadError} onRetry={refetch} />
      </>
    );
  }

  const filled = fillTemplate(template.body, values);
  // Tali's draft, when there is one, replaces the template on screen: Copy, Share and Improve all work on what is shown.
  const shown = draft ? draft.text : filled.text;
  const blanks = draft ? bracketBlanks(draft.text) : filled.blanks;
  // The profile fills headline and links; worth pointing at when they're still blank.
  const profileGaps = !values.headline || !values.portfolioLink;

  const copy = async () => {
    if (await copyText(shown)) setCopied(true);
  };

  const footer = (
    <View style={styles.actions}>
      <View style={styles.row}>
        <Button title={copied ? strings.copied : strings.copy} icon="content_copy" style={styles.flex} onPress={() => void copy()} />
        <Button title={strings.share} icon="share" variant="secondary" style={styles.flex} onPress={() => void Share.share({ message: shown })} />
      </View>
      <Button
        title={strings.improve}
        icon="auto_awesome"
        variant="secondary"
        onPress={() => router.push({ pathname: '/tali', params: { mode: template.coachMode, prompt: strings.improvePrompt(template.kind, shown), ...(PROFILE_TEMPLATES.has(template.id) ? { focus: 'resume' } : {}) } })}
      />
    </View>
  );

  return (
    <Screen footer={footer}>
      {title}
      <ThemedText type="body" themeColor="textSecondary">
        {template.description}
      </ThemedText>
      {blanks.length > 0 && <Notice tone="info" message={strings.blanks(blanks.length)} />}
      <Card>
        {draft && (
          <ThemedText type="caption" themeColor="primaryText" style={styles.draftLabel}>
            {`${strings.ai.draftTitle} · ${strings.ai.draftNote}`}
          </ThemedText>
        )}
        <ThemedText type="body" selectable>
          {shown}
        </ThemedText>
      </Card>
      <TemplateAiCard
        template={template}
        values={values}
        canWrite={access.allAccess}
        onUpgrade={() => void openPaywall('resume')}
        hasDraft={draft !== null}
        onDraft={(next) => {
          setCopied(false);
          setDraft(next);
        }}
      />
      {profileGaps && (
        <SettingsGroup>
          <ListRow title={strings.completeProfile} subtitle={strings.completeProfileBody} icon="person" tone={FeatureTones.resume} onPress={() => router.push('/resume/profile')} />
        </SettingsGroup>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  draftLabel: {
    marginBottom: Spacing.two,
  },
});
