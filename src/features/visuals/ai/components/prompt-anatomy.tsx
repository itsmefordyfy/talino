import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Toggle } from '@/components/ui/toggle';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../../components/visual-frame';
import { Panel, Tag, useMeasuredWidth } from '../../fundamentals/parts';
import type { VisualProps } from '../../types';
import { ALL_ON, answerProfile, assemblePrompt, clarityChecklist, clarityLevel, PART_IDS, START_SELECTION, togglePart, type PartId } from '../lib/prompt-anatomy';
import { promptAnatomyStrings } from '../prompt-anatomy-strings';

const WIDE = 560;

/**
 * Prompt anatomy for one fixed scenario: six parts switched on and off, the prompt they build, a checklist computed from the parts, and a hand-written
 * note on how the kind of answer changes. The note is labelled an illustration; nothing here is a model's output.
 */
export function PromptAnatomyVisual({ compact }: VisualProps) {
  const t = useLocalized(promptAnatomyStrings);
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [selection, setSelection] = useState(START_SELECTION);
  const wide = width >= WIDE;

  const texts = Object.fromEntries(PART_IDS.map((id) => [id, t.parts[id].text])) as Record<PartId, string>;
  const prompt = assemblePrompt(selection, texts);
  const checks = clarityChecklist(selection);
  const clarity = clarityLevel(selection);
  const profile = answerProfile(selection);
  const levelName = t.levels[clarity.level];
  const answer = [t.answers.base[profile.base], profile.role ? t.answers.role : '', profile.example ? t.answers.example : ''].filter(Boolean).join(' ');
  const levelTone = clarity.level === 'strong' ? 'mint' : clarity.level === 'fair' ? 'indigo' : 'amber';

  const parts = (
    <Panel label={t.partsLabel}>
      <View style={styles.parts}>
        {PART_IDS.map((id) => {
          const on = selection[id];
          return (
            <View key={id} style={[styles.part, { backgroundColor: on ? theme.primarySoft : theme.backgroundElement, borderColor: on ? theme.primary : theme.border }]}>
              <View style={styles.partText}>
                <View style={styles.partHead}>
                  <ThemedText type="bodySemiBold">{t.parts[id].label}</ThemedText>
                  <ThemedText type="caption" themeColor={on ? 'primary' : 'textSecondary'}>
                    {on ? t.partOn : t.partOff}
                  </ThemedText>
                </View>
                <ThemedText type="secondary" themeColor="textSecondary">
                  {t.parts[id].text}
                </ThemedText>
              </View>
              <Toggle value={on} onValueChange={() => setSelection((current) => togglePart(current, id))} accessibilityLabel={t.toggleLabel(t.parts[id].label)} />
            </View>
          );
        })}
      </View>
    </Panel>
  );

  const result = (
    <View style={styles.results}>
      <Panel label={t.promptTitle}>
        <View accessible accessibilityLabel={t.promptLines(prompt.lines.map((line) => t.parts[line.id].label))} style={styles.promptBox}>
          {prompt.lines.length === 0 ? (
            <ThemedText type="secondary" themeColor="textSecondary">
              {t.promptEmpty}
            </ThemedText>
          ) : (
            prompt.lines.map((line) => (
              <View key={line.id} style={[styles.promptLine, { borderLeftColor: tones.violet.ink }]}>
                <ThemedText type="caption" themeColor="textSecondary">
                  {t.parts[line.id].label}
                </ThemedText>
                <ThemedText type="body" selectable>
                  {line.text}
                </ThemedText>
              </View>
            ))
          )}
        </View>
      </Panel>

      <Panel label={t.checklistTitle}>
        <View style={styles.levelRow}>
          <Tag text={levelName} tone={levelTone} outlined marker={clarity.level === 'strong' ? '✓' : clarity.level === 'fair' ? '◐' : '○'} />
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {t.scoreLabel(clarity.passed, clarity.total)}
          </ThemedText>
        </View>
        <View style={styles.checks}>
          {checks.map((item) => {
            const label = t.checks[item.id].label;
            const why = t.checks[item.id].missing;
            return (
              <View key={item.id} accessible accessibilityLabel={t.checkRow(label, item.passed, why)} style={styles.check}>
                <Icon name={item.passed ? 'check_circle' : 'cancel'} size={20} color={item.passed ? 'statusOk' : 'textSecondary'} filled={item.passed} />
                <View style={styles.checkText}>
                  <ThemedText type="secondarySemiBold">
                    {label} <ThemedText type="caption" themeColor={item.passed ? 'statusOk' : 'textSecondary'}>{item.passed ? t.yes : t.missing}</ThemedText>
                  </ThemedText>
                  {!item.passed && !compact && (
                    <ThemedText type="caption" themeColor="textSecondary">
                      {why}
                    </ThemedText>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </Panel>

      <Panel label={t.answersTitle}>
        <Badge label={t.answers.label} color="statusWarn" background="statusWarnSoft" />
        <ThemedText type="body">{answer}</ThemedText>
      </Panel>
    </View>
  );

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={t.levelCaption(levelName, clarity.passed, clarity.total)}
      controls={
        <View style={styles.buttons}>
          <Button size="small" icon="done_all" title={t.allOn} onPress={() => setSelection(ALL_ON)} disabled={PART_IDS.every((id) => selection[id])} />
          <Button size="small" variant="ghost" icon="refresh" title={t.reset} onPress={() => setSelection(START_SELECTION)} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        <View style={styles.scenario}>
          <ThemedText type="caption" themeColor="textSecondary">
            {t.scenarioTitle}
          </ThemedText>
          <ThemedText type="secondary">{t.scenario}</ThemedText>
        </View>
        <View style={wide ? styles.wideRow : styles.column}>
          <View style={wide ? styles.half : undefined}>{parts}</View>
          <View style={wide ? styles.half : undefined}>{result}</View>
        </View>
        <ThemedText type="caption" themeColor="textSecondary">
          {t.illustration}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.three },
  scenario: { gap: Spacing.half },
  column: { gap: Spacing.three },
  wideRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  half: { flex: 1 },
  parts: { gap: Spacing.two },
  part: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.two + 2, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 1.5, minHeight: 56 },
  partText: { flex: 1, gap: Spacing.half },
  partHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  results: { gap: Spacing.three },
  promptBox: { gap: Spacing.two },
  promptLine: { gap: Spacing.half, paddingLeft: Spacing.two, borderLeftWidth: 3 },
  levelRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  checks: { gap: Spacing.two },
  check: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  checkText: { flex: 1, gap: Spacing.half },
});
