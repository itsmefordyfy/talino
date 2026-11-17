import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTones } from '@/hooks/use-tones';

import { headerLine, headerMood } from '../lib/tali-lines';
import type { JourneyState } from '../lib/types';
import { journeyStrings } from '../strings';

export type JourneyHeaderProps = {
  state: JourneyState;
  coachName: string;
  streak: number;
  onAsk: () => void;
  onCustomize: () => void;
};

/**
 * The top of the All courses view: Tali and one motivating line, which level the learner is in and how far through the journey they are (from
 * real lessons and projects), the streak, and the way to customize the journey. Where the learner left off is My course, not here (owner,
 * 2026-11-17: the screen repeated itself).
 */
export function JourneyHeader({ state, coachName, streak, onAsk, onCustomize }: JourneyHeaderProps) {
  const text = useLocalized(journeyStrings);
  const tones = useTones();
  const percent = Math.round(state.fraction * 100);
  const stage = state.currentStage;
  const stageLine = stage ? text.header.stage(stage.index + 1, state.stages.length, stage.def.title) : text.header.stageDone(state.stages.length);
  // A plain card: on a tinted one the progress bar's track (the same tint) vanished, so 0% showed no bar at all.
  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <Card tone="primarySoft" onPress={onAsk} padded={false} accessibilityLabel={text.header.askTali(coachName)} style={styles.avatar}>
          <Tali size={60} tight mood={headerMood(state)} />
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

      {/* The streak (when there is one) and a named Customize action: a lone icon button in an empty row read as a stray control. */}
      <View style={styles.footer}>
        {streak > 0 && (
          <View style={styles.streak} accessible accessibilityLabel={text.header.streak(streak)}>
            <Icon name="local_fire_department" size={16} tint={tones.amber.ink} filled />
            <ThemedText type="caption" themeColor="textSecondary" tabular>
              {text.header.streak(streak)}
            </ThemedText>
          </View>
        )}
        <Button title={text.header.customize} accessibilityLabel={text.customize.open} icon="tune" variant="ghost" size="small" onPress={onCustomize} style={styles.customize} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: 68,
    height: 68,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  customize: {
    marginLeft: 'auto',
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
