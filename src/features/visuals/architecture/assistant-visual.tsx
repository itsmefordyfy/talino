import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import {
  ASSISTANT_REQUESTS,
  MAX_CONSTRAINTS_CHARS,
  MAX_DESCRIPTION_CHARS,
  MAX_KNOWNS_CHARS,
  assistantPromptProblems,
  assistantRequest,
  buildAssistantPrompt,
  canOpenAssistant,
} from '@/features/architecture/lib/assistant-prompt';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { assistantStrings } from '../../architecture/assistant/strings';
import { useAssistantDraftEditor, useSavedAssistantDraft } from '../../architecture/assistant/use-assistant-draft';
import type { AssistantDraft } from '../../architecture/assistant/assistant-draft';
import { VisualFrame } from '../components/visual-frame';
import { Panel } from '../fundamentals/parts';
import { Disclosure } from '../productivity/disclosure';
import type { VisualProps } from '../types';
import { architectureVisualStrings } from './strings';

/**
 * The Architecture Assistant launcher: the learner describes an application and picks one of nine requests, and Tali opens with a prompt prefilled from their words
 * (assumptions, missing information, reasoning, the simplest option and what the alternatives cost). It only builds text: nothing is sent until they press send in the chat.
 */
export function ArchitectureAssistantVisual({ compact }: VisualProps) {
  const v = useLocalized(architectureVisualStrings).assistant;
  const t = useLocalized(assistantStrings);
  const saved = useSavedAssistantDraft();

  return (
    <VisualFrame title={v.title} description={v.description} compact={compact} caption={compact ? undefined : t.intro}>
      {saved.status === 'loading' ? (
        <View accessibilityState={{ busy: true }} style={styles.stack}>
          <SkeletonBlock height={120} />
          <SkeletonBlock height={44} />
        </View>
      ) : saved.status === 'error' ? (
        <View style={styles.stack}>
          <Notice tone="danger" message={t.loadError} />
          <Button title={t.retry} variant="secondary" onPress={saved.retry} />
        </View>
      ) : (
        <Launcher initial={saved.draft} />
      )}
    </VisualFrame>
  );
}

function Launcher({ initial }: { initial: AssistantDraft }) {
  const t = useLocalized(assistantStrings);
  const router = useRouter();
  const { draft, change, flush, saveError } = useAssistantDraftEditor(initial);
  const problems = assistantPromptProblems(draft);
  const reminders = problems.filter((problem) => problem.severity === 'reminder');
  const blocking = problems.find((problem) => problem.severity === 'blocks');
  const ready = canOpenAssistant(problems);
  const prompt = buildAssistantPrompt(draft);
  const selected = assistantRequest(draft.request);

  return (
    <View style={styles.stack}>
      <View style={styles.field}>
        <TextField label={t.descriptionLabel} hint={t.descriptionHint} value={draft.description} onChangeText={(description) => change({ description })} onBlur={flush} placeholder={t.descriptionPlaceholder} multiline maxLength={MAX_DESCRIPTION_CHARS} />
        <ThemedText type="caption" themeColor="textSecondary" tabular>
          {t.counter(draft.description.length, MAX_DESCRIPTION_CHARS)}
        </ThemedText>
      </View>
      <TextField label={t.constraintsLabel} hint={t.constraintsHint} value={draft.constraints} onChangeText={(constraints) => change({ constraints })} onBlur={flush} placeholder={t.constraintsPlaceholder} multiline maxLength={MAX_CONSTRAINTS_CHARS} />
      <TextField label={t.knownsLabel} hint={t.knownsHint} value={draft.knowns} onChangeText={(knowns) => change({ knowns })} onBlur={flush} placeholder={t.knownsPlaceholder} multiline maxLength={MAX_KNOWNS_CHARS} />
      {saveError ? <Notice tone="warning" message={t.saveError} /> : null}

      <ChipSelect wrap label={t.requestLabel} value={draft.request} onChange={(request) => change({ request })} options={ASSISTANT_REQUESTS.map((request) => ({ value: request.id, label: request.label }))} />
      <ThemedText type="body" accessibilityLiveRegion="polite">
        {selected.description}
      </ThemedText>

      <Panel label={t.expectTitle}>
        <ExpectList title={t.willTitle} icon="check_circle" tone="statusOk" items={t.will} />
        <ExpectList title={t.wontTitle} icon="block" tone="textSecondary" items={t.wont} />
        <ThemedText type="secondary" themeColor="textSecondary">
          {t.noLiveCall}
        </ThemedText>
      </Panel>

      {reminders.length > 0 ? (
        <Notice tone="warning">
          <ThemedText type="secondarySemiBold">{t.reminderLead}</ThemedText>
          {reminders.map((problem) => (
            <ThemedText key={problem.id} type="secondary" accessibilityLabel={t.problemLabel(problem.message)}>
              {problem.message}
            </ThemedText>
          ))}
        </Notice>
      ) : null}
      {blocking && draft.description.trim() !== '' ? <Notice tone="info" message={blocking.message} /> : null}

      <Button
        icon="forum"
        title={ready ? t.openButton : t.openNeeds}
        accessibilityLabel={t.openButton}
        disabled={!ready}
        onPress={() => {
          if (!ready) return;
          tapFeedback();
          flush();
          router.push({ pathname: '/tali', params: { prompt, focus: 'architecture' } });
        }}
      />

      <Disclosure title={t.previewTitle} showLabel={`Show: ${t.previewTitle}`} hideLabel={`Hide: ${t.previewTitle}`}>
        <ThemedText type="caption" themeColor="textSecondary">
          {t.previewNote}
        </ThemedText>
        <ThemedText type="code" selectable>
          {prompt}
        </ThemedText>
      </Disclosure>
    </View>
  );
}

function ExpectList({ title, icon, tone, items }: { title: string; icon: 'check_circle' | 'block'; tone: 'statusOk' | 'textSecondary'; items: readonly string[] }) {
  return (
    <View style={styles.expect}>
      <ThemedText type="secondarySemiBold">{title}</ThemedText>
      {items.map((item) => (
        <View key={item} style={styles.expectRow}>
          <Icon name={icon} size={18} color={tone} />
          <ThemedText type="secondary" style={styles.expectText}>
            {item}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  field: { gap: Spacing.one },
  expect: { gap: Spacing.one },
  expectRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  expectText: { flex: 1 },
});
