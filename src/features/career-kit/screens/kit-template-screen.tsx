import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { NotFoundState } from '@/components/ui/state-view';
import { Radius, Spacing } from '@/constants/theme';
import { openPaywall, useAccess } from '@/features/store';
import { useTemplateValues } from '@/features/templates';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { copyText } from '@/lib/clipboard';
import { tapFeedback } from '@/lib/haptics';
import { reportError } from '@/lib/monitoring';

import { getKitTemplate, KIT_FORMATS } from '../content';
import { shareKitFile } from '../lib/download';
import { buildKitPrompt } from '../lib/prompt';
import { kitStrings } from '../strings';
import { KitPreview } from '../components/kit-preview';
import { StylePicker } from '../components/style-picker';

/**
 * One template: the chosen look drawn large, the other looks to pick from, a way to have the learner's own AI write the text, three steps
 * and the button. Anyone can look, pick and copy the AI prompt; downloading the file (Word or PowerPoint, which opens in Word, Pages, Google
 * Docs, Canva and the like) is Talino Pro, and everyone else gets the paywall.
 */
export function KitTemplateScreen({ id }: { id?: string }) {
  const strings = useLocalized(kitStrings);
  const theme = useTheme();
  const access = useAccess();
  const { values } = useTemplateValues();
  const template = getKitTemplate(id);
  const [styleId, setStyleId] = useState<string | null>(null);
  const [message, setMessage] = useState<'error' | 'unavailable' | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!template) return <NotFoundState icon="palette" title={strings.notFound} message={strings.notFoundBody} />;
  const text = strings.templates[template.id];
  const look = template.styles.find((entry) => entry.id === styleId) ?? template.styles[0];
  const isPro = access.allAccess;
  const format = KIT_FORMATS[template.format];

  const download = async () => {
    tapFeedback();
    setMessage(null);
    setBusy(true);
    try {
      if (!(await shareKitFile(template, look))) setMessage('unavailable');
    } catch (error) {
      reportError(error, 'career', { step: 'kit-download', template: template.id, look: look.id });
      setMessage('error');
    } finally {
      setBusy(false);
    }
  };

  const copyPrompt = async () => {
    tapFeedback();
    setCopied(false);
    if (await copyText(buildKitPrompt({ template, style: look, title: text.title, values }))) setCopied(true);
  };

  const footer = !isPro ? (
    <Button title={strings.unlock} icon="lock" onPress={() => void openPaywall('kit')} />
  ) : (
    <Button title={strings.download} icon="download" loading={busy} onPress={() => void download()} />
  );

  return (
    <Screen footer={<View style={styles.footer}>{footer}</View>}>
      <Stack.Screen options={{ title: text.title }} />
      <View accessible accessibilityLabel={strings.previewLabel(text.title, look.name)} style={[styles.stage, { backgroundColor: theme.backgroundSelected }]}>
        <View style={styles.page}>
          <KitPreview layout={look.layout} accent={look.accent} />
        </View>
        {!isPro && (
          <View style={[styles.lock, { backgroundColor: theme.primary }]}>
            <Icon name="lock" size={16} tint={theme.onPrimary} filled />
          </View>
        )}
      </View>

      <View style={styles.block}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary" accessibilityRole="header">
          {strings.pickLook}
        </ThemedText>
        <StylePicker styles={template.styles} selectedId={look.id} onSelect={setStyleId} />
      </View>

      <View style={styles.block}>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.eyebrow}>
          {`${strings.kinds[template.kind]} · ${strings.formats[template.format]}`}
        </ThemedText>
        <ThemedText type="title" accessibilityRole="header">
          {text.title}
        </ThemedText>
        <ThemedText type="body" themeColor="textSecondary">
          {text.description}
        </ThemedText>
        <ThemedText type="caption" themeColor="textTertiary">
          {template.format === 'pptx' ? strings.deckLine(format.label) : strings.fileLine(format.label)}
        </ThemedText>
      </View>

      {!isPro && <Notice tone="info" message={strings.proNote} />}
      {message && <Notice tone="warning" message={message === 'unavailable' ? strings.shareUnavailable : strings.openError} />}

      <Card>
        <View style={styles.ai}>
          <View style={[styles.aiIcon, { backgroundColor: theme.primarySoft }]}>
            <Icon name="auto_awesome" size={20} color="primary" filled />
          </View>
          <View style={styles.aiText}>
            <ThemedText type="cardTitle">{strings.aiTitle}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary">
              {strings.aiBody}
            </ThemedText>
          </View>
        </View>
        <Button title={copied ? strings.copiedPrompt : strings.copyPrompt} icon="content_copy" variant="secondary" onPress={() => void copyPrompt()} style={styles.aiButton} />
      </Card>

      <View style={styles.block}>
        <ThemedText type="section" accessibilityRole="header">
          {strings.howTitle}
        </ThemedText>
        {strings.steps.map((step, index) => (
          <View key={step} style={styles.step}>
            <View style={[styles.number, { backgroundColor: theme.primary }]}>
              <ThemedText type="secondarySemiBold" themeColor="onPrimary">
                {index + 1}
              </ThemedText>
            </View>
            <ThemedText type="body" style={styles.stepText}>
              {step}
            </ThemedText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: { gap: Spacing.two },
  stage: { borderRadius: Radius.large, borderCurve: 'continuous', padding: Spacing.four, alignItems: 'center' },
  page: { width: '88%' },
  lock: { position: 'absolute', right: Spacing.three, top: Spacing.three, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  block: { gap: Spacing.two },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 0.6 },
  ai: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  aiIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  aiText: { flex: 1, gap: Spacing.one },
  aiButton: { marginTop: Spacing.three },
  step: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  number: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  stepText: { flex: 1, paddingTop: 3 },
});
