import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { FormSection } from '@/components/ui/form-section';
import type { IconName } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SettingsGroup } from '@/components/ui/settings-group';
import { TextField } from '@/components/ui/text-field';
import { Toggle } from '@/components/ui/toggle';
import { Spacing } from '@/constants/theme';
import { COMPANIONS } from '@/features/companion/lib/companions';
import { selectCompanion, selectLanguage } from '@/features/settings/settings-slice';
import { openPaywall } from '@/features/store';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized } from '@/hooks/use-strings';
import { newId } from '@/lib/id';
import { LANGUAGE_LABELS, shownLanguage, SHOWN_LANGUAGES } from '@/lib/i18n';
import { useAppSelector } from '@/store/hooks';

import { InterviewerPicker } from '../components/interviewer-picker';
import { interviewErrorCode } from '../api/client';
import { useCandidateText, useStartInterview } from '../hooks/use-interview';
import { canStart, DEFAULT_SETUP, INTERVIEW_DIFFICULTIES, INTERVIEW_LENGTHS, INTERVIEW_LEVELS, INTERVIEW_STYLES, INTERVIEW_TYPES, sanitizeSetup, type InterviewSetup } from '../lib/options';
import { interviewStrings } from '../strings';

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** The questions a past evaluation marked weak, sent as a JSON list in the link. Anything else is ignored. */
function practiseFrom(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const list: unknown = JSON.parse(value);
    return Array.isArray(list) ? list.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Sets up a mock interview. It can open filled in: for a position (from a tracked application), as a repeat of an earlier
 * interview, or with the questions someone struggled with. Every choice is checked again on the server.
 */
export function InterviewSetupScreen() {
  const params = useLocalSearchParams<{ position?: string; setup?: string; practise?: string }>();
  const strings = useLocalized(interviewStrings);
  const companion = useAppSelector(selectCompanion);
  const appLanguage = useAppSelector(selectLanguage);
  const online = useIsOnline();
  const candidate = useCandidateText();
  const start = useStartInterview();

  // One id for this form, so a second tap on Start (or a retry after a failure) is the same interview.
  const [interviewId] = useState(newId);
  const [setup, setSetup] = useState<InterviewSetup>(() => {
    let repeated: unknown = null;
    try {
      repeated = params.setup ? JSON.parse(params.setup) : null;
    } catch {
      repeated = null;
    }
    return sanitizeSetup({ ...DEFAULT_SETUP, companion, language: shownLanguage(appLanguage), ...(typeof repeated === 'object' && repeated !== null ? repeated : {}), ...(first(params.position) ? { position: first(params.position) } : {}), practise: practiseFrom(first(params.practise)) });
  });
  const [failure, setFailure] = useState<string | null>(null);
  const patch = (change: Partial<InterviewSetup>) => setSetup((current) => ({ ...current, ...change }));

  const submit = async () => {
    setFailure(null);
    try {
      const ready = sanitizeSetup(setup);
      await start.mutateAsync({ id: interviewId, setup: ready });
      router.replace({ pathname: '/interview/[id]', params: { id: interviewId } });
    } catch (error) {
      setFailure(interviewErrorCode(error));
    }
  };

  const interviewer = COMPANIONS[setup.companion].name;
  const option = <T extends string>(ids: readonly T[], labels: Record<T, { label: string; icon?: string }>) => ids.map((id) => ({ value: id, label: labels[id].label, icon: labels[id].icon as IconName | undefined }));

  const footer = (
    <View style={styles.footer}>
      {failure && (
        <View style={styles.failure}>
          <Notice tone={failure === 'network' ? 'info' : 'warning'} message={strings.startFailed[failure] ?? strings.startFailed.unknown} />
          {failure === 'interview_limit' && <Button title={strings.seePro} variant="secondary" size="small" onPress={() => void openPaywall('tali')} />}
        </View>
      )}
      <Button title={start.isPending ? strings.starting(interviewer) : strings.startInterview} icon="play_arrow" loading={start.isPending} disabled={!canStart(setup) || start.isPending || !online} onPress={() => void submit()} />
    </View>
  );

  return (
    <Screen footer={footer}>
      <FormSection title={strings.positionLabel} footer={strings.positionHint}>
        <TextField label={strings.positionLabel} labelHidden value={setup.position} onChangeText={(position) => patch({ position })} placeholder={strings.positionPlaceholder} autoCapitalize="words" maxLength={80} returnKeyType="done" />
      </FormSection>

      <FormSection title={strings.typeLabel}>
        <ChipSelect label={strings.typeLabel} wrap value={setup.type} options={option(INTERVIEW_TYPES, strings.types)} onChange={(type) => patch({ type })} />
        <ThemedText type="secondary" themeColor="textSecondary">
          {strings.types[setup.type].description}
        </ThemedText>
      </FormSection>

      <FormSection title={strings.levelLabel}>
        <ChipSelect label={strings.levelLabel} wrap value={setup.level} options={INTERVIEW_LEVELS.map((level) => ({ value: level, label: strings.levels[level] }))} onChange={(level) => patch({ level })} />
      </FormSection>

      <FormSection title={strings.difficultyLabel}>
        <ChipSelect label={strings.difficultyLabel} wrap value={setup.difficulty} options={option(INTERVIEW_DIFFICULTIES, strings.difficulties)} onChange={(difficulty) => patch({ difficulty })} />
        <ThemedText type="secondary" themeColor="textSecondary">
          {strings.difficulties[setup.difficulty].description}
        </ThemedText>
      </FormSection>

      <FormSection title={strings.whoLabel}>
        <InterviewerPicker label={strings.whoLabel} value={setup.companion} onChange={(value) => patch({ companion: value })} />
      </FormSection>

      <FormSection title={strings.styleLabel}>
        <ChipSelect label={strings.styleLabel} wrap value={setup.style} options={option(INTERVIEW_STYLES, strings.styles)} onChange={(style) => patch({ style })} />
        <ThemedText type="secondary" themeColor="textSecondary">
          {strings.styles[setup.style].description}
        </ThemedText>
      </FormSection>

      <FormSection title={strings.lengthLabel}>
        <ChipSelect label={strings.lengthLabel} wrap value={setup.length} options={option(INTERVIEW_LENGTHS, strings.lengths)} onChange={(length) => patch({ length })} />
        <ThemedText type="secondary" themeColor="textSecondary">
          {strings.lengths[setup.length].description}
        </ThemedText>
      </FormSection>

      {SHOWN_LANGUAGES.length > 1 && (
        <FormSection title={strings.languageLabel}>
          <ChipSelect label={strings.languageLabel} value={setup.language} options={SHOWN_LANGUAGES.map((language) => ({ value: language, label: LANGUAGE_LABELS[language] }))} onChange={(language) => patch({ language })} />
        </FormSection>
      )}

      <FormSection title={strings.jobDescriptionLabel} footer={strings.jobDescriptionHint}>
        <TextField label={strings.jobDescriptionLabel} labelHidden value={setup.jobDescription} onChangeText={(jobDescription) => patch({ jobDescription })} multiline numberOfLines={5} maxLength={4000} />
      </FormSection>

      <SettingsGroup footer={setup.useProfile && !candidate ? strings.useProfileEmpty : undefined}>
        <ListRow icon="badge" tone="sky" title={strings.useProfileTitle} subtitle={strings.useProfileBody} titleLines={2} trailing={<Toggle value={setup.useProfile} onValueChange={(useProfile) => patch({ useProfile })} accessibilityLabel={strings.useProfileTitle} />} />
      </SettingsGroup>

      {setup.practise.length > 0 && (
        <FormSection title={strings.practiseTitle} footer={strings.practiseBody}>
          {setup.practise.map((question) => (
            <ThemedText key={question} type="body">
              • {question}
            </ThemedText>
          ))}
        </FormSection>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.two,
  },
  failure: {
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
});
