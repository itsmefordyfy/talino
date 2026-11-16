import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { useLevelSuggestion } from '../hooks/use-level-suggestion';
import { levelControlStrings } from '../level-strings';
import { onboardingStrings } from '../strings';

/**
 * "Ready for the next level?": shown only when there is real evidence (see `suggestNextLevel`) and the learner hasn't said "Not now" to this
 * step. It never moves anyone by itself, never suggests a step down, and says plainly that progress stays as it is.
 */
export function LevelSuggestionCard() {
  const strings = useLocalized(levelControlStrings);
  const labels = useLocalized(onboardingStrings).experience;
  const { suggestion, accept, dismiss } = useLevelSuggestion();
  if (!suggestion) return null;
  const target = labels[suggestion.to].label;
  const reasons = suggestion.reasons.map((reason) => (reason.kind === 'courses' ? strings.suggestionCourses(reason.count, strings.tiers[reason.tier], Math.round(reason.average * 100)) : strings.suggestionSkillCheck));
  return (
    <Card accessibilityLabel={`${strings.suggestionTitle} ${strings.suggestionBody(target)}`}>
      <View style={styles.top}>
        <Tali size={72} mood="proud" />
        <View style={styles.flex}>
          <ThemedText type="cardTitle" accessibilityRole="header">
            {strings.suggestionTitle}
          </ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.suggestionBody(target)}
          </ThemedText>
        </View>
      </View>
      <View style={styles.reasons}>
        {reasons.map((reason) => (
          <ThemedText key={reason} type="secondary">
            {`• ${reason}`}
          </ThemedText>
        ))}
        <ThemedText type="caption" themeColor="textSecondary">
          {strings.progressStays}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <Button title={strings.moveUp(target)} icon="trending_up" size="small" onPress={accept} />
        <Button title={strings.notNow} variant="ghost" size="small" onPress={dismiss} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
    gap: Spacing.one,
  },
  reasons: {
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
