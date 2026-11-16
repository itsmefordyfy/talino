import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Toggle } from '@/components/ui/toggle';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { onboardingStrings } from '@/features/onboarding/strings';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import type { ExperienceLevel } from '../content/levels';
import { levelStrings } from '../level-strings';

export type LevelNoteProps = {
  /** The learner's level; null when none was chosen (only the shared content shows). */
  level: ExperienceLevel | null;
  showAll: boolean;
  onToggleAll: () => void;
  /** What is hidden right now, so the note can say so. */
  hiddenCount: number;
  /** A project has no "Show everything": its review criteria are the ones the learner sees. */
  hideToggle?: boolean;
  /** Overrides the sentence (a project's own). */
  message?: string;
};

/**
 * A short card near the top of a lesson or project that has pieces for particular levels. Who it is tailored for leads (with how
 * much is hidden underneath); below, "Show everything" is a switch, so it is clear whether it is on, and "Change level" is a
 * separate link on the other side. It is advice and a shortcut, never a gate: the switch is per view (not saved) and Change
 * level opens the Learning profile.
 */
export function LevelNote({ level, showAll, onToggleAll, hiddenCount, hideToggle = false, message }: LevelNoteProps) {
  const theme = useTheme();
  const strings = useLocalized(levelStrings);
  const labels = useLocalized(onboardingStrings).experience;
  const sentence = message ?? (showAll ? strings.allShown : level ? strings.tailoredFor(labels[level].label) : strings.sharedOnly);
  const change = level ? strings.changeLevel : strings.chooseLevel;
  return (
    <View style={[styles.note, { backgroundColor: theme.primarySoft, borderColor: theme.border }]} accessibilityRole="summary">
      <View style={styles.line}>
        <View style={[styles.badge, { backgroundColor: theme.background }]}>
          <Icon name="tune" size={18} color="primaryText" />
        </View>
        <View style={styles.text}>
          <ThemedText type="bodySemiBold">{sentence}</ThemedText>
          {!showAll && !hideToggle && hiddenCount > 0 && (
            <ThemedText type="secondary" themeColor="textSecondary">
              {strings.hiddenCount(hiddenCount)}
            </ThemedText>
          )}
        </View>
      </View>
      <View style={[styles.controls, { borderTopColor: theme.border }]}>
        {!hideToggle && (
          <View style={styles.switch}>
            <Toggle value={showAll} onValueChange={onToggleAll} accessibilityLabel={strings.showEverything} />
            <ThemedText type="secondarySemiBold">{strings.showEverything}</ThemedText>
          </View>
        )}
        <Pressable accessibilityRole="link" accessibilityLabel={change} onPress={() => router.push('/learning-profile')} hitSlop={Spacing.two} style={styles.change}>
          <ThemedText type="secondarySemiBold" themeColor="primaryText">
            {change}
          </ThemedText>
          <Icon name="chevron_right" size={18} color="primaryText" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: Spacing.three,
    rowGap: Spacing.one,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  change: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MinTouchSize,
    marginLeft: 'auto',
  },
});
