import { StyleSheet, View } from 'react-native';

import type { TaliMood } from '@/components/brand/tali';
import { TaliSays } from '@/components/tali-says';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import type { MissionXp } from '../lib/xp';
import { adventureStrings } from '../strings';

export type SummaryAchievement = { id: string; title: string; description: string; icon: MaterialSymbolName; tone: Tone };

export type CompletionSummaryProps = {
  /** The mission (lesson) that was finished. */
  title: string;
  xp: MissionXp;
  /** Skill labels the lesson built. */
  concepts: readonly string[];
  achievements?: readonly SummaryAchievement[];
  levelUp?: { level: number; title: string } | null;
  /** The next mission, the boss, or nothing when the world is finished. */
  next: { kind: 'mission' | 'boss'; title: string } | null;
  onNext?: () => void;
  onDone: () => void;
  /** What Tali says to the learner about this lesson (the words and her expression). */
  message: { text: string; mood: TaliMood };
};

/**
 * What a finished mission earned: the XP and where it came from, anything unlocked, what was
 * learned, and the next step. Tali is a still picture. Rewards here are all real: nothing appears
 * that the learner did not earn.
 */
export function CompletionSummary({ title, xp, concepts, achievements = [], levelUp = null, next, onNext, onDone, message }: CompletionSummaryProps) {
  const strings = useLocalized(adventureStrings);
  const theme = useTheme();
  const tones = useTones();
  const lines: { label: string; value: number }[] = [
    { label: strings.breakdownLesson, value: xp.lesson },
    { label: strings.breakdownQuiz, value: xp.quizBonus },
    { label: strings.breakdownTask, value: xp.task },
    { label: strings.breakdownPractice, value: xp.activities },
  ].filter((line) => line.value > 0);
  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <TaliSays size="large" layout="stacked" {...message} />
        <ThemedText type="caption" themeColor="textSecondary" style={styles.eyebrow}>
          {strings.missionComplete}
        </ThemedText>
        <ThemedText type="title" style={styles.center} accessibilityRole="header">
          {title}
        </ThemedText>
        <View accessible accessibilityLabel={strings.rewardLabel(xp.total)} style={[styles.xpChip, { backgroundColor: tones.mint.soft }]}>
          <Icon name="bolt" size={22} tint={tones.mint.ink} filled />
          <ThemedText type="section" tabular style={{ color: tones.mint.ink }}>
            {strings.earnedXp(xp.total)}
          </ThemedText>
        </View>
      </View>

      {lines.length > 0 && (
        <Card>
          <View style={styles.lines}>
            {lines.map((line) => (
              <View key={line.label} style={styles.line}>
                <ThemedText type="body" style={styles.flex}>
                  {line.label}
                </ThemedText>
                <ThemedText type="bodySemiBold" tabular>
                  {strings.earnedXp(line.value)}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>
      )}

      {(levelUp || achievements.length > 0) && (
        <Card tone="primarySoft">
          <View style={styles.lines}>
            {levelUp && (
              <View style={styles.line}>
                <Icon name="military_tech" size={24} color="primaryText" filled />
                <ThemedText type="bodySemiBold" style={styles.flex}>
                  {strings.levelUp(levelUp.level, levelUp.title)}
                </ThemedText>
              </View>
            )}
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.line} accessible accessibilityLabel={`${strings.achievementUnlocked}. ${achievement.title}. ${achievement.description}`}>
                <Icon name={achievement.icon} size={24} tint={tones[achievement.tone].ink} filled />
                <View style={styles.flex}>
                  <ThemedText type="caption" themeColor="textSecondary">
                    {strings.achievementUnlocked}
                  </ThemedText>
                  <ThemedText type="bodySemiBold">{achievement.title}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}

      {concepts.length > 0 && (
        <View style={styles.concepts}>
          <ThemedText type="section" accessibilityRole="header">
            {strings.conceptsTitle}
          </ThemedText>
          <View style={styles.chips}>
            {concepts.map((concept) => (
              <View key={concept} style={[styles.chip, { backgroundColor: theme.backgroundSelected }]}>
                <Icon name="check" size={16} color="statusOk" />
                <ThemedText type="secondarySemiBold">{concept}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.actions}>
        {next ? (
          <>
            <ThemedText type="caption" themeColor="textSecondary">
              {next.kind === 'boss' ? strings.nextBossTitle : strings.nextMissionTitle}
            </ThemedText>
            <ThemedText type="cardTitle">{next.title}</ThemedText>
            {onNext && <Button title={next.kind === 'boss' ? strings.startBoss : strings.startNext} icon={next.kind === 'boss' ? 'rocket_launch' : 'play_arrow'} onPress={onNext} />}
            <Button title={strings.backToWorld} variant="outline" onPress={onDone} />
            <ThemedText type="caption" themeColor="textSecondary" style={styles.center}>
              {strings.takeBreak}
            </ThemedText>
          </>
        ) : (
          <>
            <ThemedText type="secondary" themeColor="textSecondary">
              {strings.worldFinished}
            </ThemedText>
            <Button title={strings.backToWorld} onPress={onDone} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  center: {
    textAlign: 'center',
  },
  xpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  lines: {
    gap: Spacing.three,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  concepts: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  actions: {
    gap: Spacing.two,
  },
});
