import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import type { Lesson } from '../content/types';
import { courseStrings } from '../strings';
import { objectiveUnit } from '../lib/speech-segments';
import { SpeakFrame, SpokenText } from './listen-follow';

export type LessonIntroProps = { lesson: Pick<Lesson, 'summary' | 'intro'> };

/** The lesson's opening: what it covers, what the learner will be able to do, and why it matters. Without an intro (older patched content) it shows the one-line summary only. */
export function LessonIntro({ lesson }: LessonIntroProps) {
  const strings = useLocalized(courseStrings);
  const { intro, summary } = lesson;
  return (
    <Card tone="primarySoft" accessibilityLabel={strings.introTitle}>
      <View style={styles.stack}>
        <View style={styles.block}>
          <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrow}>
            {strings.introTitle}
          </ThemedText>
          <SpeakFrame unit="summary">
            <SpokenText unit="summary" type="bodySemiBold" text={summary} />
          </SpeakFrame>
        </View>
        {intro && (
          <>
            <View style={styles.block}>
              <SpeakFrame unit="objectives-label" marker="none">
                <SpokenText unit="objectives-label" type="secondarySemiBold" text={strings.objectivesTitle} />
              </SpeakFrame>
              {intro.objectives.map((objective, index) => (
                <SpeakFrame key={index} unit={objectiveUnit(index)} style={styles.objective}>
                  <Icon name="check_circle" size={20} color="primaryText" />
                  <SpokenText unit={objectiveUnit(index)} type="body" text={objective} style={styles.flex} keyTerms />
                </SpeakFrame>
              ))}
            </View>
            <View style={styles.block}>
              <SpeakFrame unit="why-label" marker="none">
                <SpokenText unit="why-label" type="secondarySemiBold" text={strings.whyTitle} />
              </SpeakFrame>
              <SpeakFrame unit="why">
                <SpokenText unit="why" type="body" text={intro.why} keyTerms />
              </SpeakFrame>
            </View>
          </>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  block: {
    gap: Spacing.one,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  objective: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
});
