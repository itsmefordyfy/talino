import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { defineStrings } from '@/lib/i18n';

import type { Stepper } from './use-stepper';

const stepStrings = defineStrings({
  en: {
    step: (n: number, total: number) => `Step ${n} of ${total}`,
    back: 'Back',
    next: 'Next',
    reset: 'Reset',
    play: 'Play',
    pause: 'Pause',
    replay: 'Replay',
  },
  fil: {
    step: (n: number, total: number) => `Step ${n}/${total}`,
    back: 'Back',
    next: 'Next',
    reset: 'Reset',
    play: 'Play',
    pause: 'Pause',
    replay: 'Replay',
  },
});

export type StepControlsProps = {
  stepper: Pick<Stepper<unknown>, 'index' | 'count' | 'atStart' | 'atEnd' | 'playing' | 'next' | 'back' | 'reset' | 'toggle'>;
  /** Hide Play for visuals that only make sense one deliberate step at a time. */
  hidePlay?: boolean;
};

/** Back, Play/Pause, Next and Reset for a stepped visual, with "Step 3 of 8" read out. Every button is 44 pt or taller. */
export function StepControls({ stepper, hidePlay = false }: StepControlsProps) {
  const s = useLocalized(stepStrings);
  return (
    <View style={styles.wrap} accessibilityRole="toolbar">
      <ThemedText type="caption" themeColor="textSecondary" tabular accessibilityLiveRegion="polite">
        {s.step(stepper.index + 1, stepper.count)}
      </ThemedText>
      <View style={styles.row}>
        <Button title={s.back} icon="arrow_back" size="small" variant="secondary" disabled={stepper.atStart} onPress={stepper.back} />
        {!hidePlay && <Button title={stepper.playing ? s.pause : stepper.atEnd ? s.replay : s.play} icon={stepper.playing ? 'pause' : 'play_arrow'} size="small" variant="secondary" onPress={stepper.toggle} />}
        <Button title={s.next} icon="arrow_forward" size="small" disabled={stepper.atEnd} onPress={stepper.next} />
        <Button title={s.reset} icon="refresh" size="small" variant="ghost" disabled={stepper.atStart && !stepper.playing} onPress={stepper.reset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
