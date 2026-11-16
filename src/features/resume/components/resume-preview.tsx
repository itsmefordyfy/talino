import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';

import type { ResumeData } from '../lib/build-resume';
import { entryHeading, resumeBlocks } from '../lib/resume-html';

export type ResumePreviewProps = {
  data: ResumeData;
  /** Shown beside the title when the version came from tailoring. */
  tailoredLabel: string;
};

/** A readable preview of exactly what the PDF prints, section by section. */
export function ResumePreview({ data, tailoredLabel }: ResumePreviewProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        {data.name !== '' && (
          <ThemedText type="section" selectable>
            {data.name}
          </ThemedText>
        )}
        <View style={styles.titleRow}>
          <ThemedText type="bodySemiBold" themeColor="primaryText" style={styles.flex} selectable>
            {data.jobTitle}
          </ThemedText>
          {data.tailored && <Badge label={tailoredLabel} color="secondaryText" background="primarySoft" />}
        </View>
        {data.contact.length > 0 && (
          <ThemedText type="secondary" themeColor="textSecondary" selectable>
            {data.contact.join(' · ')}
          </ThemedText>
        )}
      </View>
      {resumeBlocks(data).map((block) => (
        <View key={block.heading} style={styles.block}>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.heading} accessibilityRole="header">
            {block.heading}
          </ThemedText>
          {block.lines.map((line) => (
            <ThemedText key={line} type="body" selectable>
              {line}
            </ThemedText>
          ))}
          {block.bullets.map((line) => (
            <ThemedText key={line} type="body" selectable>
              {`•  ${line}`}
            </ThemedText>
          ))}
          {block.entries.map((entry, index) => (
            <View key={`${entry.title}-${index}`} style={styles.entry}>
              <ThemedText type="bodySemiBold" selectable>
                {entryHeading(entry)}
              </ThemedText>
              {entry.dates && (
                <ThemedText type="secondary" themeColor="textSecondary" tabular>
                  {entry.dates}
                </ThemedText>
              )}
              {entry.description && (
                <ThemedText type="secondary" selectable>
                  {entry.description}
                </ThemedText>
              )}
              {entry.link && (
                <ThemedText type="secondary" themeColor="primaryText" selectable numberOfLines={1}>
                  {entry.link}
                </ThemedText>
              )}
            </View>
          ))}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  head: {
    gap: Spacing.one,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  block: {
    gap: Spacing.one,
  },
  heading: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  entry: {
    gap: Spacing.half,
    marginTop: Spacing.one,
  },
});
