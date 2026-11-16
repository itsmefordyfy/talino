import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { NotFoundState } from '@/components/ui/state-view';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { findVisual } from '../registry';
import { visualsStrings } from '../strings';

/** One interactive explainer, full screen, with its description and the keywords it covers. */
export function VisualScreen({ id }: { id: string }) {
  const strings = useLocalized(visualsStrings);
  const language = useLanguage();
  const theme = useTheme();
  const visual = findVisual(id, language);
  if (!visual) return <NotFoundState icon="science" title={strings.notFound} />;
  return (
    <Screen>
      <Stack.Screen options={{ title: visual.title }} />
      <ThemedText type="body" themeColor="textSecondary">
        {visual.summary}
      </ThemedText>
      <visual.Component />
      <View style={styles.topics}>
        <ThemedText type="caption" themeColor="textSecondary">
          {strings.relatedTopics}
        </ThemedText>
        <View style={styles.chips}>
          {visual.topics.map((topic) => (
            <View key={topic} style={[styles.chip, { backgroundColor: theme.primarySoft }]}>
              <ThemedText type="caption" themeColor="primaryText">
                {topic}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topics: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
});
