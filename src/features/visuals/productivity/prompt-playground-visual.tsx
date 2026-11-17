import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import {
  MAX_PROMPT_DRAFT,
  PROMPT_TEMPLATES,
  checkPrompt,
  privacyRisks,
  productivityStrings,
  usePromptDraft,
  useSavedPromptDraft,
  type PromptTemplate,
} from '@/features/productivity';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { copyText } from '@/lib/clipboard';
import { tapFeedback } from '@/lib/haptics';

import { VisualFrame } from '../components/visual-frame';
import { Panel } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { Disclosure } from './disclosure';
import { productivityVisualStrings } from './strings';

/** How long "Copied" stays on the button before it goes back to "Copy prompt". */
const COPIED_MS = 2500;

/** The AI prompt playground: choose a template, edit it, copy it, and see what the structure check says. The check is a checklist, never an AI. */
export function PromptPlaygroundVisual({ compact }: VisualProps) {
  const t = useLocalized(productivityStrings);
  const v = useLocalized(productivityVisualStrings).promptPlayground;
  const [templateId, setTemplateId] = useState(PROMPT_TEMPLATES[0]!.id);
  const template = PROMPT_TEMPLATES.find((candidate) => candidate.id === templateId) ?? PROMPT_TEMPLATES[0]!;

  return (
    <VisualFrame title={t.promptTitle} description={v.description} compact={compact} caption={compact ? undefined : t.promptIntro}>
      <View style={styles.stack}>
        <ChipSelect label={t.promptPick} wrap value={templateId} onChange={setTemplateId} options={PROMPT_TEMPLATES.map((candidate) => ({ value: candidate.id, label: candidate.title }))} />
        <View style={styles.when}>
          <ThemedText type="secondarySemiBold" themeColor="textSecondary">
            {t.promptWhen}
          </ThemedText>
          <ThemedText type="body">{template.when}</ThemedText>
        </View>
        {/* Keyed by template: switching saves the edit in progress and opens the other prompt as it was left. */}
        <PromptEditor key={template.id} template={template} />
      </View>
    </VisualFrame>
  );
}

/** Loads the saved prompt for a template (loading and error states), then hands over to the editor. */
function PromptEditor({ template }: { template: PromptTemplate }) {
  const t = useLocalized(productivityStrings);
  const common = useStrings().common;
  const saved = useSavedPromptDraft(template.id);
  if (saved.status === 'loading') {
    return (
      <View accessibilityState={{ busy: true }}>
        <SkeletonBlock height={160} />
      </View>
    );
  }
  if (saved.status === 'error') {
    return (
      <View style={styles.stack}>
        <Notice tone="danger" message={t.promptLoadError} />
        <Button title={common.tryAgain} variant="secondary" onPress={saved.retry} />
      </View>
    );
  }
  return <PromptEditorBody template={template} initial={saved.data ?? template.text} />;
}

function PromptEditorBody({ template, initial }: { template: PromptTemplate; initial: string }) {
  const t = useLocalized(productivityStrings);
  const router = useRouter();
  const { text, setText, startAgain, saveError, flush } = usePromptDraft({ templateId: template.id, initial, original: template.text });
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle');
  const check = checkPrompt(text);
  const risks = privacyRisks(text);
  const present = check.parts.filter((part) => part.present).length;
  const empty = check.words === 0;

  // "Copied" goes back to "Copy prompt" by itself; the timer is cleared if the screen closes or the learner copies again.
  useEffect(() => {
    if (copied !== 'done') return;
    const id = setTimeout(() => setCopied('idle'), COPIED_MS);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    tapFeedback();
    setCopied((await copyText(text)) ? 'done' : 'failed');
  };

  return (
    <View style={styles.stack}>
      <TextField label={t.promptEdit} value={text} onChangeText={setText} onBlur={flush} multiline maxLength={MAX_PROMPT_DRAFT} autoCorrect={false} />
      {saveError ? <Notice tone="warning" message={t.promptSaveError} /> : null}
      <View style={styles.buttons}>
        <Button style={styles.primary} title={copied === 'done' ? t.promptCopied : t.promptCopy} icon={copied === 'done' ? 'check' : 'content_copy'} disabled={empty} onPress={() => void copy()} />
        <Button
          size="small"
          variant="outline"
          icon="restart_alt"
          title={t.promptReset}
          disabled={text === template.text}
          onPress={() => {
            tapFeedback();
            startAgain();
          }}
        />
        <Button
          size="small"
          variant="secondary"
          icon="forum"
          title={t.promptAskTali}
          disabled={empty}
          onPress={() => {
            tapFeedback();
            flush();
            router.push({ pathname: '/tali', params: { prompt: text } });
          }}
        />
      </View>
      {copied === 'failed' ? <Notice tone="warning" message={t.promptCopyFailed} /> : null}

      <Panel>
        <View style={styles.checkHeader}>
          <ThemedText type="cardTitle" accessibilityRole="header">
            {t.promptCheckTitle}
          </ThemedText>
          <View style={styles.noAi}>
            <Icon name="rule" size={16} color="textSecondary" />
            <ThemedText type="secondarySemiBold" themeColor="textSecondary">
              {t.promptNoAi}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="caption" themeColor="textSecondary">
          {t.promptCheckNote}
        </ThemedText>
        <ThemedText type="bodySemiBold" tabular>
          {t.promptScore(present, check.parts.length)}
        </ThemedText>
        <ProgressBar fraction={present / check.parts.length} accessibilityLabel={t.promptScore(present, check.parts.length)} done={present === check.parts.length} />
        {empty ? <Notice tone="info" message={t.promptEmptyText} /> : null}
        <View style={styles.parts}>
          {check.parts.map((part) => (
            <View key={part.id} style={styles.part} accessible accessibilityLabel={t.promptPartState(part.label, part.present)}>
              <Icon name={part.present ? 'check_circle' : 'cancel'} size={20} color={part.present ? 'statusOk' : 'danger'} />
              <ThemedText type="body" style={styles.partLabel}>
                {part.label}
              </ThemedText>
              <ThemedText type="secondarySemiBold" themeColor={part.present ? 'statusOk' : 'danger'}>
                {part.present ? t.promptPresent : t.promptMissing}
              </ThemedText>
            </View>
          ))}
        </View>
        {!empty ? (
          check.placeholders.length > 0 ? (
            <View style={styles.list}>
              <ThemedText type="secondarySemiBold">{t.promptPlaceholders(check.placeholders.length)}</ThemedText>
              {check.placeholders.map((placeholder) => (
                <ThemedText key={placeholder} type="codeInline" themeColor="textSecondary">
                  {`[${placeholder}]`}
                </ThemedText>
              ))}
            </View>
          ) : (
            <ThemedText type="secondary" themeColor="textSecondary">
              {t.promptBracketsNone}
            </ThemedText>
          )
        ) : null}
        {!empty ? (
          <View style={styles.list}>
            <ThemedText type="secondarySemiBold">{t.promptSuggestionsTitle}</ThemedText>
            {check.suggestions.length === 0 ? (
              <ThemedText type="secondary" themeColor="textSecondary">
                {t.promptSuggestionsNone}
              </ThemedText>
            ) : (
              check.suggestions.map((suggestion) => <Bullet key={suggestion} text={suggestion} />)
            )}
          </View>
        ) : null}
      </Panel>

      {risks.length > 0 ? (
        <Notice tone="warning">
          <ThemedText type="secondarySemiBold">{t.promptPrivacyLead}</ThemedText>
          {risks.map((risk) => (
            <ThemedText key={risk} type="secondary">
              {t.promptPrivacy[risk]}
            </ThemedText>
          ))}
          <ThemedText type="secondary">{t.promptPrivacyAdvice}</ThemedText>
        </Notice>
      ) : null}

      <Disclosure title={t.promptExplainTitle} showLabel={t.sectionShow(t.promptExplainTitle)} hideLabel={t.sectionHide(t.promptExplainTitle)}>
        {template.explain.map((item) => (
          <View key={item.part} style={styles.explain}>
            <ThemedText type="secondarySemiBold">{item.part}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary">
              {item.why}
            </ThemedText>
          </View>
        ))}
      </Disclosure>
      <Disclosure title={t.promptImproveTitle} showLabel={t.sectionShow(t.promptImproveTitle)} hideLabel={t.sectionHide(t.promptImproveTitle)}>
        {template.improve.map((idea) => (
          <Bullet key={idea} text={idea} />
        ))}
      </Disclosure>
      <Disclosure title={t.promptVerifyTitle} showLabel={t.sectionShow(t.promptVerifyTitle)} hideLabel={t.sectionHide(t.promptVerifyTitle)}>
        {template.verify.map((question) => (
          <Bullet key={question} text={question} />
        ))}
      </Disclosure>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.bullet}>
      <View style={[styles.bulletDot, { backgroundColor: theme.textTertiary }]} accessible={false} />
      <ThemedText type="secondary" style={styles.partLabel}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  when: { gap: Spacing.one },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
  primary: { flexGrow: 1, minWidth: 140 },
  checkHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  noAi: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  parts: { gap: Spacing.two },
  part: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, minHeight: Spacing.five },
  partLabel: { flex: 1 },
  list: { gap: Spacing.one },
  explain: { gap: 2 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  bulletDot: { width: 6, height: 6, borderRadius: Radius.pill, marginTop: Spacing.two },
});
