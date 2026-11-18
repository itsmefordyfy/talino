import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { selectCompanion, companionChanged, selectLanguage } from '@/features/settings/settings-slice';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { playCoachSample, stopCoachSample } from '../audio/coach-sample';
import { COMPANION_IDS, COMPANIONS, type CompanionId } from '../lib/companions';
import { companionStrings } from '../strings';

/** How long after the step opens the greeting starts. */
const AUTO_PLAY_DELAY_MS = 500;

const VOICE_LABEL = { tali: 'male', tala: 'female' } as const;

/**
 * Choose the coach: Tali (the young man, a male voice) or Tala (the young woman, a female voice), each with a "Hear" button for
 * their greeting. Picking one saves it at once (`settings.companion`), so the picture, the name and Listen's voice follow
 * everywhere. Used by the welcome and by Settings. With `autoPlay` (the welcome's coach step, owner 2026-11-16) the chosen coach greets the
 * learner as the step opens, so they hear a voice without tapping; the greeting stops when they leave the step.
 */
export type CompanionPickerProps = { autoPlay?: boolean };

export function CompanionPicker({ autoPlay = false }: CompanionPickerProps) {
  const dispatch = useAppDispatch();
  const chosen = useAppSelector(selectCompanion);
  const strings = companionStrings[useAppSelector(selectLanguage)];
  const [playing, setPlaying] = useState<CompanionId | null>(null);

  // A greeting never carries on after the picker is gone.
  useEffect(() => () => stopCoachSample(), []);

  // Once, a moment after the step has slid in, so the greeting doesn't start under the transition.
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(() => {
      setPlaying(chosen);
      void playCoachSample(chosen, () => setPlaying((current) => (current === chosen ? null : current)));
    }, AUTO_PLAY_DELAY_MS);
    return () => clearTimeout(timer);
    // Only on opening: picking another coach plays that one from the tap, not a second time from here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Starts a coach's greeting (any other one stops first). */
  const play = (id: CompanionId) => {
    setPlaying(id);
    void playCoachSample(id, () => setPlaying((current) => (current === id ? null : current)));
  };

  /** The Hear button: plays the greeting, or stops it when it is already playing. */
  const hear = (id: CompanionId) => {
    if (playing === id) {
      stopCoachSample();
      setPlaying(null);
      return;
    }
    play(id);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row} accessibilityRole="radiogroup">
        {COMPANION_IDS.map((id) => (
          <CompanionCard
            key={id}
            id={id}
            selected={chosen === id}
            voice={strings[VOICE_LABEL[id]]}
            hearLabel={playing === id ? strings.playing : strings.hear(COMPANIONS[id].name)}
            hearing={playing === id}
            onPick={() => {
              tapFeedback();
              // Choosing a coach makes them speak at once, so the learner hears who they picked. Tapping the one already chosen plays or stops their greeting.
              if (chosen === id) return hear(id);
              dispatch(companionChanged(id));
              play(id);
            }}
            onHear={() => hear(id)}
            accessibilityLabel={strings.choose(COMPANIONS[id].name, strings[VOICE_LABEL[id]])}
          />
        ))}
      </View>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.note}>
        {strings.voiceNote} {strings.changeAnytime}
      </ThemedText>
    </View>
  );
}

type CardProps = {
  id: CompanionId;
  selected: boolean;
  voice: string;
  hearLabel: string;
  hearing: boolean;
  accessibilityLabel: string;
  onPick: () => void;
  onHear: () => void;
};

function CompanionCard({ id, selected, voice, hearLabel, hearing, accessibilityLabel, onPick, onHear }: CardProps) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: selected ? theme.primarySoft : theme.backgroundElement, borderColor: selected ? theme.primary : theme.border, borderWidth: selected ? 2 : 1 }]}>
      <Pressable accessibilityRole="radio" accessibilityState={{ selected, checked: selected }} accessibilityLabel={accessibilityLabel} onPress={onPick} style={styles.pick}>
        <View style={styles.face}>
          {/* The picture is the coach's own, whoever is chosen: the card passes its coach to Tali. Tala's canvas is larger (328 against 310 px), so she is drawn proportionally larger to stand as tall as Tali. */}
          <Tali size={id === 'tala' ? 100 : 94} tight mood="happy" companion={id} />
        </View>
        <View style={styles.titleRow}>
          <ThemedText type="cardTitle">{COMPANIONS[id].name}</ThemedText>
          <View style={[styles.mark, { borderColor: selected ? theme.primary : theme.textTertiary, backgroundColor: selected ? theme.primary : 'transparent' }]}>
            {selected && <Icon name="check" size={14} tint={theme.onPrimary} />}
          </View>
        </View>
        <ThemedText type="caption" themeColor="textSecondary">
          {voice}
        </ThemedText>
      </Pressable>
      <Button title={hearLabel} size="small" variant={hearing ? 'primary' : 'secondary'} icon={hearing ? 'stop' : 'volume_up'} material="solid" onPress={onHear} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  card: {
    flex: 1,
    gap: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
  },
  pick: {
    alignItems: 'center',
    gap: Spacing.half,
    minHeight: MinTouchSize,
  },
  face: {
    // One height for both, so the names line up whichever picture is shorter.
    height: 76,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  mark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    textAlign: 'center',
  },
});
