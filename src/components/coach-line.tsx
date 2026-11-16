import { StyleSheet, View } from 'react-native';

import type { TaliMood } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Divider } from '@/components/ui/divider';
import { Spacing } from '@/constants/theme';
import { nameText } from '@/features/companion/lib/companions';
import { selectCompanion } from '@/features/settings/settings-slice';
import { useAppSelector } from '@/store/hooks';

export type CoachLineProps = {
  text: string;
  /** Accepted so a line written for `TaliSays` can be spread in unchanged; a plain line has no face to show it on. */
  mood?: TaliMood;
  /** A thin rule on the side that separates the line from the lesson (owner's reading layout: a plain paragraph, then a rule). */
  divider?: 'above' | 'below';
};

/**
 * What the coach says at the start and end of a lesson or course, as plain reading text: no speech bubble, no card, no face (owner,
 * 2026-11-15: "remove the bubble and make it like a normal reading page"). Words that answer something the learner did (a quiz answer, a
 * hint, a badge) still use `TaliSays`. The lines are written for Tali; Tala's learner reads them in her name.
 */
export function CoachLine({ text, divider }: CoachLineProps) {
  const spoken = nameText(text, useAppSelector(selectCompanion));
  return (
    <View style={styles.stack}>
      {divider === 'above' && <Divider />}
      <ThemedText type="body" style={styles.text}>
        {spoken}
      </ThemedText>
      {divider === 'below' && <Divider />}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  text: {
    // The same measure as the lesson's own paragraphs.
    lineHeight: 26,
  },
});
