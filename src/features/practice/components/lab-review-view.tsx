import { StyleSheet, View } from 'react-native';

import { ScoreHero } from '@/components/score-hero';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { KeyCheck } from '../lib/lab-check';
import type { ClaimStatus, LabReview } from '../lib/lab-review';
import { ratingFor } from '../lib/scoring';
import type { PracticeText } from '../strings';

export type LabReviewViewProps = {
  review: LabReview;
  text: PracticeText;
  /** The two outputs are named (A, B); a single run needs no letter. */
  comparing: boolean;
};

const CLAIM_ICON: Record<ClaimStatus, 'check_circle' | 'cancel' | 'help'> = { supported: 'check_circle', 'not-in-material': 'cancel', unclear: 'help' };

/**
 * The prompt coach's review of a lab run: the score, how each item of the checklist did (with the learner's own words that earned it), what the
 * material really says (the key, compared by code and revealed only now), the claims of the output read against the material (an AI's reading,
 * labelled so), what to try next, and, for a comparison, the two outputs side by side in words. Everything the model wrote is badged AI-assessed.
 */
export function LabReviewView({ review, text, comparing }: LabReviewViewProps) {
  return (
    <View style={styles.stack}>
      <Badge label={text.lab.reviewBadge} color="statusWarn" background="statusWarnSoft" />
      <ScoreHero score={review.overall} rating={review.rating} ratingLabel={text.ratings[review.rating]} ratingLine={text.ui.ratingLines[review.rating]} outOf={text.ui.scoreOutOf} summary={review.summary} />

      <Card style={styles.card}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {text.lab.criteriaTitle}
        </ThemedText>
        {review.criteria.map((criterion) => {
          const rating = text.ratings[ratingFor(criterion.score)];
          const spoken = text.ui.criterionLabel(criterion.label, rating, criterion.score);
          return (
            <View key={criterion.id} style={styles.item}>
              <View style={styles.head} accessible accessibilityLabel={spoken}>
                <ThemedText type="bodySemiBold" style={styles.fill}>
                  {criterion.label}
                </ThemedText>
                <ThemedText type="secondary" themeColor="textSecondary">
                  {rating}
                </ThemedText>
                <ThemedText type="bodySemiBold" tabular>
                  {criterion.score}
                </ThemedText>
              </View>
              <ProgressBar fraction={criterion.score / 100} accessibilityLabel={spoken} done={criterion.score >= 70} />
              <ThemedText type="secondary" themeColor="textSecondary">
                {criterion.quote ? `${text.lab.inYourPrompt}: “${criterion.quote}”` : text.lab.nothingToQuote}
              </ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary">
                {criterion.reason}
              </ThemedText>
            </View>
          );
        })}
      </Card>

      {review.keyChecks.map((check) => (
        <KeyCheckCard key={check.label} check={check} text={text} named={comparing || review.keyChecks.length > 1} />
      ))}

      {review.outputChecks.length > 0 ? (
        <Card style={styles.card}>
          <View style={styles.head}>
            <ThemedText type="cardTitle" accessibilityRole="header" style={styles.fill}>
              {text.lab.claimsTitle}
            </ThemedText>
            <Badge label={text.lab.claimsBadge} color="statusWarn" background="statusWarnSoft" />
          </View>
          {review.outputChecks.map((check, index) => (
            <View key={index} style={styles.row} accessible accessibilityLabel={`${text.lab.claimStatus[check.status]}. ${check.claim}. ${check.note}`}>
              <Icon name={CLAIM_ICON[check.status]} size={18} color={check.status === 'supported' ? 'statusOk' : check.status === 'unclear' ? 'statusWarn' : 'danger'} filled />
              <View style={styles.fill}>
                <ThemedText type="bodySemiBold">{`${comparing ? `${check.output === 'A' ? text.lab.outputA : text.lab.outputB}: ` : ''}${text.lab.claimStatus[check.status]}`}</ThemedText>
                <ThemedText type="body">{`“${check.claim}”`}</ThemedText>
                <ThemedText type="secondary" themeColor="textSecondary">
                  {check.note}
                </ThemedText>
              </View>
            </View>
          ))}
        </Card>
      ) : null}

      {review.comparison ? (
        <Card style={styles.card}>
          <ThemedText type="cardTitle" accessibilityRole="header">
            {text.lab.comparisonTitle}
          </ThemedText>
          <ThemedText type="body">{review.comparison}</ThemedText>
        </Card>
      ) : null}

      <Card style={styles.card}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {text.lab.suggestionsTitle}
        </ThemedText>
        {review.suggestions.map((suggestion, index) => (
          <View key={index} style={styles.row}>
            <Icon name="lightbulb" size={18} color="primary" />
            <ThemedText type="body" style={styles.fill}>
              {suggestion}
            </ThemedText>
          </View>
        ))}
        {review.nextStep ? <ThemedText type="bodySemiBold">{`${text.ui.nextStepTitle}: ${review.nextStep}`}</ThemedText> : null}
      </Card>

      <ThemedText type="caption" themeColor="textTertiary">
        {text.lab.reviewNote}
      </ThemedText>
    </View>
  );
}

/** Each field of the lab's key against what the run said: the right value, the learner's, and Match or Different in words and by icon. */
function KeyCheckCard({ check, text, named }: { check: KeyCheck; text: PracticeText; named: boolean }) {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <ThemedText type="cardTitle" accessibilityRole="header" style={styles.fill}>
          {named ? `${text.lab.keyTitle} · ${check.label === 'A' ? text.lab.outputA : text.lab.outputB}` : text.lab.keyTitle}
        </ThemedText>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary" tabular>
          {text.lab.keySummary(check.matched, check.total)}
        </ThemedText>
      </View>
      <ThemedText type="caption" themeColor="textSecondary">
        {text.lab.keyNote}
      </ThemedText>
      {check.fields.map((field) => (
        <View key={field.name} style={[styles.panel, { backgroundColor: theme.backgroundSelected }]} accessible accessibilityLabel={`${text.lab.keyField(field.name)}. ${field.match ? text.lab.keyMatch : text.lab.keyDiffer}. ${text.lab.keyExpected}: ${field.expected}. ${text.lab.keyYours}: ${field.actual ?? text.lab.keyNothing}`}>
          <View style={styles.head}>
            <Icon name={field.match ? 'check_circle' : 'cancel'} size={18} color={field.match ? 'statusOk' : 'danger'} filled />
            <ThemedText type="bodySemiBold" style={styles.fill}>
              {`${text.lab.keyField(field.name)} · ${field.match ? text.lab.keyMatch : text.lab.keyDiffer}`}
            </ThemedText>
          </View>
          <ThemedText type="secondary" selectable>{`${text.lab.keyExpected}: ${field.expected}`}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary" selectable>{`${text.lab.keyYours}: ${field.actual ?? text.lab.keyNothing}`}</ThemedText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  card: { gap: Spacing.three },
  item: { gap: Spacing.two },
  head: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  fill: { flex: 1 },
  panel: { gap: Spacing.one, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous' },
});
