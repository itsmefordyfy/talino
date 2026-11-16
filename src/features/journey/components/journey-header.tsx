import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GlassIconButton } from '@/components/ui/glass-icon-button';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTones } from '@/hooks/use-tones';

import { headerLine } from '../lib/tali-lines';
import type { JourneyState } from '../lib/types';
import { journeyStrings, type JourneyText } from '../strings';

export type JourneyHeaderProps = {
  state: JourneyState;
  coachName: string;
  streak: number;
  onContinue: () => void;
  continueLabel: string;
  onAsk: () => void;
  onCustomize: () => void;
};

/**
 * The top of Home, kept short: Tali and one motivating line, which stage the learner is in, how far through the whole journey they are
 * (from real lessons and projects), the milestone they are on, the streak, and the one button that continues.
 */
export function JourneyHeader({ state, coachName, streak, onContinue, continueLabel, onAsk, onCustomize }: JourneyHeaderProps) {
  const text = useLocalized(journeyStrings);
  const tones = useTones();
  const percent = Math.round(state.fraction * 100);
  const stage = state.currentStage;
  const stageLine = stage ? text.header.stage(stage.index + 1, state.stages.length, stage.def.title) : text.header.stageDone(state.stages.length);
  return (
    <Card tone="primarySoft" style={styles.card}>
      <View style={styles.top}>
        <Card onPress={onAsk} padded={false} accessibilityLabel={text.header.askTali(coachName)} style={styles.avatar}>
          <Tali size={64} tight mood={state.complete ? 'celebrating' : 'happy'} />
        </Card>
        <ThemedText type="bodySemiBold" style={styles.message}>
          {headerLine(state, text.header)}
        </ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText type="secondarySemiBold" numberOfLines={1} style={styles.flex}>
          {stageLine}
        </ThemedText>
        <ThemedText type="secondarySemiBold" themeColor="primaryText" tabular>
          {text.header.percent(percent)}
        </ThemedText>
      </View>
      <ProgressBar thick fraction={state.fraction} done={state.complete} accessibilityLabel={text.header.progressLabel(percent)} />
      <View style={styles.row}>
        <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1} style={styles.flex}>
          {nextLine(state, text.header)}
        </ThemedText>
        {streak > 0 && (
          <View style={styles.streak} accessible accessibilityLabel={text.header.streak(streak)}>
            <Icon name="local_fire_department" size={16} tint={tones.amber.ink} filled />
            <ThemedText type="caption" themeColor="textSecondary" tabular>
              {text.header.streak(streak)}
            </ThemedText>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <Button title={continueLabel} icon="play_arrow" onPress={onContinue} style={styles.flex} />
        <GlassIconButton icon="tune" iconSize={22} accessibilityLabel={text.customize.open} onPress={onCustomize} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  message: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
});

/** The next recommended course by name when the learner's next step is a lesson or project; else their milestone; at the end, the count. */
function nextLine(state: JourneyState, text: JourneyText['header']): string {
  const current = state.current;
  if (!current) return text.milestones(state.done, state.total);
  const next = current.next;
  const courseId = next?.type === 'lesson' ? next.courseId : next?.type === 'project' ? current.steps.find((step) => step.projectId === next.projectId)?.courseId : null;
  const course = courseId ? current.steps.find((step) => step.kind === 'learn' && step.courseId === courseId) : null;
  return course ? text.next(course.title) : text.current(current.def.title);
}
