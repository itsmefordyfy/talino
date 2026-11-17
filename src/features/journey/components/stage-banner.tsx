import { Pressable, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { onToneSolid, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { tapFeedback } from '@/lib/haptics';

import type { StagePath } from '../lib/course-path';
import { LEVEL_TONE } from '../lib/level-tones';
import type { StageState } from '../lib/types';
import { journeyStrings } from '../strings';

export type StageTense = 'done' | 'current' | 'ahead' | 'skipped';

export type StageBannerProps = {
  stage: StageState;
  /** How many of the level's courses are done (the journey is courses now). */
  progress: StagePath;
  stageCount: number;
  tense: StageTense;
  /** The level the learner starts at (when it isn't simply the first). */
  isStart: boolean;
  open: boolean;
  /** A finished or skipped level folds away to this banner. */
  onToggle: (() => void) | null;
  top: number;
  height: number;
};

/** A level's banner across the map: which level, what it is for, how far through it the learner is, and Tali's face for a finished or coming one. */
export function StageBanner({ stage, progress, stageCount, tense, isStart, open, onToggle, top, height }: StageBannerProps) {
  const text = useLocalized(journeyStrings);
  const theme = useTheme();
  const tones = useTones();
  const look = LEVEL_TONE[stage.def.level];
  const tone = tones[look.tone];
  const done = tense === 'done';
  const current = tense === 'current';
  const eyebrow = [text.map.levelEyebrow(stage.index + 1, stageCount), done ? text.map.stageComplete : tense === 'skipped' ? text.map.skippedLevel : null].filter(Boolean).join(' · ');
  const body = (
    <View style={[styles.card, { top, height: height - 16, backgroundColor: current ? tone.soft : theme.backgroundElement, borderColor: current || isStart ? tone.solid : theme.border, borderWidth: current ? 2 : 1, boxShadow: current ? `0 0 22px ${tone.solid}55` : theme.shadowCard }]}>
      <View style={[styles.badge, { backgroundColor: look.solid || done ? tone.solid : tone.soft, borderColor: tone.solid }]}>
        <Icon name={done ? 'check' : stage.def.icon} size={26} tint={look.solid || done ? onToneSolid(look.tone) : tone.ink} filled />
      </View>
      <View style={styles.text}>
        <View style={styles.eyebrowRow}>
          <ThemedText type="caption" style={[styles.eyebrow, { color: tone.ink }]} numberOfLines={1}>
            {eyebrow}
          </ThemedText>
          {isStart && !done && (
            <View style={[styles.startTag, { backgroundColor: tone.solid }]}>
              <ThemedText type="caption" style={[styles.startText, { color: look.tone === 'mint' ? '#063B34' : '#FFFFFF' }]}>
                {text.map.startHere}
              </ThemedText>
            </View>
          )}
        </View>
        <ThemedText type="section" numberOfLines={1} accessibilityRole="header">
          {stage.def.title}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
          {stage.def.tagline}
        </ThemedText>
        <View style={styles.progress}>
          <View style={styles.bar}>
            <ProgressBar fraction={done ? 1 : progress.fraction} done={done} accessibilityLabel={text.map.stageCourses(progress.coursesDone, progress.coursesTotal)} />
          </View>
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {text.map.stageCourses(progress.coursesDone, progress.coursesTotal)}
          </ThemedText>
        </View>
      </View>
      {done ? <Tali size={52} tight mood="proud" /> : tense === 'ahead' ? <Tali size={48} tight mood="curious" /> : null}
      {onToggle && <Icon name={open ? 'expand_less' : 'expand_more'} size={22} color="textSecondary" />}
    </View>
  );
  if (!onToggle) return body;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text.map.toggleStage(`${stage.def.title}, ${eyebrow}`, open)}
      onPress={() => {
        tapFeedback();
        onToggle();
      }}
      style={styles.pressable}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 1,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
    flexShrink: 1,
  },
  startTag: {
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  startText: {
    fontWeight: '700',
    lineHeight: 16,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: 2,
  },
  bar: {
    flex: 1,
  },
});
