import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../../components/visual-frame';
import { Panel, Tag, useMeasuredWidth } from '../../fundamentals/parts';
import type { VisualProps } from '../../types';
import { imagePromptStrings } from '../image-prompt-strings';
import { AVOID_IDS, buildImagePrompt, COMPOSITION_IDS, contradictionsOf, EMPTY_CHOICES, LIGHT_IDS, limitPicks, MAX_LIGHTS, MAX_STYLES, MOOD_IDS, sketchOf, specificityChecklist, specificityLevel, START_CHOICES, STYLE_IDS, SUBJECT_IDS, type ImageChoices } from '../lib/image-prompt';

const WIDE = 560;
const SKETCH = 160;

/**
 * The image prompt builder. Chips for the subject, style, composition, lighting, mood and one thing to avoid build the prompt text and a specificity
 * checklist (with contradictions). It never generates an image, says so on screen, and the small drawing is labelled a rough sketch of the idea.
 */
export function ImagePromptBuilderVisual({ compact }: VisualProps) {
  const t = useLocalized(imagePromptStrings);
  const theme = useTheme();
  const tones = useTones();
  const { width, onLayout } = useMeasuredWidth();
  const [choices, setChoices] = useState<ImageChoices>(START_CHOICES);
  const wide = width >= WIDE;

  const text = buildImagePrompt(choices, t.phrases);
  const checks = specificityChecklist(choices);
  const level = specificityLevel(choices);
  const levelName = t.levels[level.level];
  const clashes = contradictionsOf(choices);
  const sketch = sketchOf(choices);
  const palette = tones[sketch.palette];
  const levelTone = level.level === 'specific' ? 'mint' : level.level === 'fair' ? 'indigo' : level.level === 'vague' ? 'amber' : 'neutral';

  const clashText = (kind: 'style' | 'light' | 'avoid', a: string, b: string) => {
    if (kind === 'style') return t.contradiction.style(t.options.style[a as keyof typeof t.options.style], t.options.style[b as keyof typeof t.options.style]);
    if (kind === 'light') return t.contradiction.light(t.options.light[a as keyof typeof t.options.light], t.options.light[b as keyof typeof t.options.light]);
    return t.contradiction.avoid(t.options.subject[a as keyof typeof t.options.subject]);
  };

  const chips = (
    <View style={styles.groups}>
      <ChipSelect label={t.groups.subject} wrap value={choices.subject} onChange={(subject) => setChoices((current) => ({ ...current, subject }))} options={SUBJECT_IDS.map((id) => ({ value: id, label: t.options.subject[id] }))} />
      <ChipSelect multiple label={t.groups.style} wrap value={choices.styles} onChange={(styles) => setChoices((current) => ({ ...current, styles: limitPicks(styles, MAX_STYLES) }))} options={STYLE_IDS.map((id) => ({ value: id, label: t.options.style[id] }))} />
      <ChipSelect label={t.groups.composition} wrap value={choices.composition} onChange={(composition) => setChoices((current) => ({ ...current, composition }))} options={COMPOSITION_IDS.map((id) => ({ value: id, label: t.options.composition[id] }))} />
      <ChipSelect multiple label={t.groups.light} wrap value={choices.lights} onChange={(lights) => setChoices((current) => ({ ...current, lights: limitPicks(lights, MAX_LIGHTS) }))} options={LIGHT_IDS.map((id) => ({ value: id, label: t.options.light[id] }))} />
      <ChipSelect label={t.groups.mood} wrap value={choices.mood} onChange={(mood) => setChoices((current) => ({ ...current, mood }))} options={MOOD_IDS.map((id) => ({ value: id, label: t.options.mood[id] }))} />
      <ChipSelect label={t.groups.avoid} wrap value={choices.avoid} onChange={(avoid) => setChoices((current) => ({ ...current, avoid }))} options={AVOID_IDS.map((id) => ({ value: id, label: t.options.avoid[id] }))} />
    </View>
  );

  const results = (
    <View style={styles.results}>
      <Panel label={t.promptTitle}>
        <View accessible accessibilityLabel={text === '' ? t.promptEmpty : t.promptLabel(text)}>
          <ThemedText type="body" themeColor={text === '' ? 'textSecondary' : 'text'} selectable>
            {text === '' ? t.promptEmpty : text}
          </ThemedText>
        </View>
      </Panel>

      <Panel label={t.checklistTitle}>
        <View style={styles.levelRow}>
          <Tag text={levelName} tone={levelTone} outlined marker={level.level === 'specific' ? '✓' : level.level === 'fair' ? '◐' : '○'} />
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {t.scoreLabel(level.passed, level.total)}
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
        {clashes.length > 0 && (
          <Notice tone="warning">
            <ThemedText type="secondarySemiBold">{t.contradictionTitle}</ThemedText>
            {clashes.map((clash) => (
              <ThemedText key={`${clash.kind}-${clash.a}-${clash.b}`} type="secondary">
                {clashText(clash.kind, clash.a, clash.b)}
              </ThemedText>
            ))}
          </Notice>
        )}
      </Panel>

      <Panel label={t.sketchTitle}>
        <Badge label={t.sketchTitle} color="statusWarn" background="statusWarnSoft" />
        <View
          accessible
          accessibilityLabel={t.sketchLabel(
            choices.composition ? t.options.composition[choices.composition] : t.notChosen,
            choices.lights.length > 0 ? choices.lights.map((id) => t.options.light[id]).join(', ') : t.notChosen,
            choices.mood ? t.options.mood[choices.mood] : t.notChosen,
          )}
          style={styles.sketchBox}>
          <Svg width={SKETCH} height={SKETCH} viewBox="0 0 1 1" style={{ borderRadius: Radius.small }}>
            <Rect x={0} y={0} width={1} height={1} fill={palette.soft} />
            {sketch.horizon !== null && <Line x1={0} y1={sketch.horizon} x2={1} y2={sketch.horizon} stroke={palette.ink} strokeWidth={0.012} />}
            {sketch.light.map((spot, index) => (
              <Circle key={index} cx={spot.x} cy={spot.y} r={spot.r} fill={palette.solid} opacity={0.55} />
            ))}
            {sketch.subject ? (
              <Rect x={sketch.subject.x} y={sketch.subject.y} width={sketch.subject.w} height={sketch.subject.h} rx={0.04} fill="none" stroke={palette.ink} strokeWidth={0.02} strokeDasharray="0.05 0.04" />
            ) : null}
            <Rect x={0.005} y={0.005} width={0.99} height={0.99} fill="none" stroke={theme.textTertiary} strokeWidth={0.01} />
          </Svg>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.sketchNote}>
            {t.sketchNote}
          </ThemedText>
        </View>
      </Panel>
    </View>
  );

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={`${levelName}: ${level.passed} of ${level.total} checks pass.`}
      controls={
        <View style={styles.buttons}>
          <Button size="small" variant="secondary" icon="refresh" title={t.start} onPress={() => setChoices(START_CHOICES)} />
          <Button size="small" variant="ghost" icon="close" title={t.clear} disabled={choices === EMPTY_CHOICES} onPress={() => setChoices(EMPTY_CHOICES)} />
        </View>
      }>
      <View style={styles.stage} onLayout={onLayout}>
        {/* Said in the same place whatever the width: this screen never makes a picture. */}
        <Notice tone="info" message={t.noImage} />
        <View style={wide ? styles.wideRow : styles.column}>
          <View style={wide ? styles.half : undefined}>{chips}</View>
          <View style={wide ? styles.half : undefined}>{results}</View>
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
  column: { gap: Spacing.three },
  wideRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  half: { flex: 1 },
  groups: { gap: Spacing.three },
  results: { gap: Spacing.three },
  levelRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  checks: { gap: Spacing.two },
  check: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  checkText: { flex: 1, gap: Spacing.half },
  sketchBox: { gap: Spacing.two, alignItems: 'flex-start' },
  sketchNote: { alignSelf: 'stretch' },
});
