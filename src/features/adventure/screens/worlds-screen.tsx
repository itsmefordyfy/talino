import { router, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { ErrorState } from '@/components/ui/state-view';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { COURSES, type CourseKind } from '@/features/courses/data';
import { useLanguage, useLocalized } from '@/hooks/use-strings';

import { useGame } from '../hooks/use-game';
import { worldThemeFor } from '../lib/world-themes';
import { adventureStrings } from '../strings';

const KINDS: CourseKind[] = ['starter', 'career', 'path', 'standard', 'mini'];

export type WorldsListProps = { onOpen?: (courseId: string) => void };

/**
 * Every course as a world with its progress. It is a list (not a screen) so the Courses tab can
 * place it inside its own `Screen`; `onOpen` defaults to opening the course page, where the map is.
 */
export function WorldsList({ onOpen = (courseId) => router.push({ pathname: '/course/[id]', params: { id: courseId } }) }: WorldsListProps) {
  const strings = useLocalized(adventureStrings);
  const language = useLanguage();
  const game = useGame();
  if (game.isError) return <ErrorState onRetry={game.refetch} />;
  if (game.isPending) {
    return (
      <View style={styles.stack}>
        <SkeletonBlock height={96} />
        <SkeletonBlock height={96} />
      </View>
    );
  }
  return (
    <>
      {KINDS.map((kind) => (
        <Section key={kind} title={strings.kindTitles[kind]}>
          <View style={styles.stack}>
            {COURSES.filter((course) => course.kind === kind).map((course) => {
              const theme = worldThemeFor(course, language);
              const world = game.worldFor(course.id);
              const percent = world?.percent ?? 0;
              return (
                <Card key={course.id} onPress={() => onOpen(course.id)} accessibilityLabel={strings.worldLabel(theme.name, percent)}>
                  <View style={styles.row}>
                    <IconTile icon={theme.icon} tone={theme.tone} />
                    <View style={styles.flex}>
                      <ThemedText type="cardTitle" numberOfLines={1}>
                        {theme.name}
                      </ThemedText>
                      <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={1}>
                        {course.title}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="textTertiary">
                        {strings.worldMissions(course.lessons.length)}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.progress}>
                    <ProgressBar fraction={world?.fraction ?? 0} done={world?.complete} accessibilityLabel={strings.worldProgress(percent)} />
                    <ThemedText type="caption" themeColor="textSecondary" tabular>
                      {world?.complete ? strings.worldComplete : strings.worldProgress(percent)}
                    </ThemedText>
                  </View>
                </Card>
              );
            })}
          </View>
        </Section>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  progress: {
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
});

/** All the worlds as a screen of their own (a route or a sheet); the Courses tab can embed `WorldsList` instead. */
export function WorldsScreen(props: WorldsListProps) {
  const strings = useLocalized(adventureStrings);
  return (
    <Screen>
      <Stack.Screen options={{ title: strings.worlds }} />
      <ThemedText type="secondary" themeColor="textSecondary">
        {strings.worldsSubtitle}
      </ThemedText>
      <WorldsList {...props} />
    </Screen>
  );
}
