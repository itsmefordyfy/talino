import { StyleSheet, View } from 'react-native';

import { ScoreHero } from '@/components/score-hero';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { Evidence, PracticeReport } from '../lib/report';
import type { PracticeText } from '../strings';
import { CriteriaCard } from './criteria-card';

export type DebriefViewProps = {
  report: PracticeReport;
  text: PracticeText;
  /** A speaking scenario carries the honesty line under its feedback too. */
  speaking?: boolean;
};

/**
 * The role-play debrief: the overall score first, then each criterion the scenario names, what worked and what to work on (each quoting the
 * learner's own words), and one thing to try next time. A conversation too thin to judge says so and shows no score.
 */
export function DebriefView({ report, text, speaking = false }: DebriefViewProps) {
  if (report.tooShort || report.overall === null || report.rating === null) {
    return (
      <Card style={styles.card}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {text.ui.tooShortTitle}
        </ThemedText>
        <Notice tone="info" message={report.summary || text.tooShortRoleplay} />
      </Card>
    );
  }
  return (
    <View style={styles.stack}>
      <ScoreHero score={report.overall} rating={report.rating} ratingLabel={text.ratings[report.rating]} ratingLine={text.ui.ratingLines[report.rating]} outOf={text.ui.scoreOutOf} summary={report.summary} />
      <CriteriaCard title={text.ui.criteriaTitle} criteria={report.criteria} text={text} />
      <EvidenceCard title={text.ui.strengthsTitle} entries={report.strengths} label={text.ui.inYourWords} />
      <EvidenceCard title={text.ui.growthTitle} entries={report.growth} label={text.ui.inYourWords} />
      {report.nextStep ? (
        <Card style={styles.card}>
          <ThemedText type="cardTitle" accessibilityRole="header">
            {text.ui.nextStepTitle}
          </ThemedText>
          <ThemedText type="body">{report.nextStep}</ThemedText>
        </Card>
      ) : null}
      {speaking && <Notice tone="info" message={text.speakingNote} />}
      <ThemedText type="caption" themeColor="textTertiary">
        {text.ui.scoreNote}
      </ThemedText>
    </View>
  );
}

type EvidenceCardProps = { title: string; entries: readonly Evidence[]; label: string };

function EvidenceCard({ title, entries, label }: EvidenceCardProps) {
  const theme = useTheme();
  if (entries.length === 0) return null;
  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {title}
      </ThemedText>
      {entries.map((entry, index) => (
        <View key={index} style={styles.entry}>
          <View style={[styles.quote, { borderColor: theme.primary }]} accessible accessibilityLabel={`${label}: ${entry.quote}`}>
            <ThemedText type="caption" themeColor="textSecondary">
              {label}
            </ThemedText>
            <ThemedText type="body" style={styles.quoteText} selectable>
              “{entry.quote}”
            </ThemedText>
          </View>
          <ThemedText type="body">{entry.point}</ThemedText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  card: { gap: Spacing.three },
  entry: { gap: Spacing.two },
  quote: { gap: Spacing.half, paddingLeft: Spacing.three, borderLeftWidth: 3 },
  quoteText: { fontStyle: 'italic' },
});
