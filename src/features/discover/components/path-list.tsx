import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { formatDuration, learningLevelLabel, pathText } from '@/features/courses/data';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import type { PathSummary } from '../lib/browse';
import { browseStrings } from '../browse-strings';
import { discoverStrings } from '../strings';

export type PathListProps = {
  summaries: readonly PathSummary[];
  /** How many show before "Show all" (all by default). */
  initial?: number;
};

/**
 * Learning paths: who each is for, the levels it spans, its courses and total time (computed from the courses), and how far the
 * learner is. Opens the path screen.
 */
export function PathList({ summaries, initial = Number.POSITIVE_INFINITY }: PathListProps) {
  const strings = useLocalized(discoverStrings);
  const browse = useLocalized(browseStrings);
  const language = useLanguage();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? summaries : summaries.slice(0, initial);
  return (
    <View style={styles.list}>
      {shown.map(({ path, count, done, minutes, fromLevel, toLevel }) => {
        const meta = browse.pathMeta(browse.pathLevels(learningLevelLabel(fromLevel), learningLevelLabel(toLevel)), count, formatDuration(minutes));
        return (
        <Card
          key={path.id}
          onPress={() => router.push({ pathname: '/path/[id]', params: { id: path.id } })}
          accessibilityLabel={`${pathText(path, language).title}. ${path.audience} ${meta}. ${strings.pathRowProgress(done, count)}`}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
              <Icon name={path.icon as never} size={22} color="primary" />
            </View>
            <View style={styles.text}>
              <ThemedText type="cardTitle" numberOfLines={2}>
                {pathText(path, language).title}
              </ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={2}>
                {path.audience}
              </ThemedText>
              <ThemedText type="caption" themeColor="textTertiary" tabular numberOfLines={2}>
                {meta}
              </ThemedText>
              {done > 0 && <ProgressBar fraction={done / count} done={done === count} accessibilityLabel={strings.pathRowProgress(done, count)} />}
            </View>
            <Icon name="chevron_right" size={20} color="textTertiary" />
          </View>
        </Card>
        );
      })}
      {summaries.length > initial && (
        <Button
          title={expanded ? strings.showFewerTechnologies : browse.showAllPaths(summaries.length)}
          icon={expanded ? 'expand_less' : 'expand_more'}
          variant="ghost"
          size="small"
          onPress={() => setExpanded((open) => !open)}
          style={styles.more}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  more: {
    alignSelf: 'flex-start',
  },
});
