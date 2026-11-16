import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { AnswerFeedback, AnswerVerdict } from '../lib/report';

const TONE: Record<AnswerVerdict, { color: ThemeColor; background: ThemeColor }> = {
  strong: { color: 'statusOk', background: 'statusOkSoft' },
  ok: { color: 'statusWarn', background: 'statusWarnSoft' },
  weak: { color: 'statusDanger', background: 'statusDangerSoft' },
};

export type AnswerCardStrings = {
  answerNumber: (turn: number) => string;
  answerScore: (score: number) => string;
  verdicts: Record<AnswerVerdict, string>;
  whyLabel: string;
  yourAnswer: string;
  betterAnswer: string;
  betterNote: string;
  outlineLabel: string;
  outlineNote: string;
};

export type AnswerCardProps = {
  entry: AnswerFeedback;
  /** What the learner actually wrote for this answer, from the saved conversation. */
  original: string | null;
  strings: AnswerCardStrings;
  /** Only the question, the verdict and why: for the summary, where the full comparison is one tab away. */
  compact?: boolean;
};

/**
 * One answer reviewed: the question, how it scored and why, the learner's own words and a stronger version side by side, so the
 * difference is visible. The stronger answer is built only from what they said, and says where they need to add something real.
 */
export function AnswerCard({ entry, original, strings, compact = false }: AnswerCardProps) {
  const tone = TONE[entry.verdict];
  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary" style={styles.number}>
          {strings.answerNumber(entry.turn)}
        </ThemedText>
        <Badge label={`${strings.verdicts[entry.verdict]} · ${strings.answerScore(entry.score)}`} color={tone.color} background={tone.background} />
      </View>
      {entry.question ? <ThemedText type="cardTitle">{entry.question}</ThemedText> : null}
      <Block title={strings.whyLabel} text={entry.why} />
      {!compact && original ? <Block title={strings.yourAnswer} text={original} quiet /> : null}
      {!compact && entry.improved ? <Block title={entry.improvedKind === 'answer' ? strings.betterAnswer : strings.outlineLabel} text={entry.improved} note={entry.improvedKind === 'answer' ? strings.betterNote : strings.outlineNote} highlight /> : null}
    </Card>
  );
}

type BlockProps = { title: string; text: string; note?: string; quiet?: boolean; highlight?: boolean };

function Block({ title, text, note, quiet = false, highlight = false }: BlockProps) {
  const theme = useTheme();
  return (
    <View style={[styles.block, highlight && [styles.highlight, { borderLeftColor: theme.primary }]]}>
      <ThemedText type="caption" themeColor={highlight ? 'primaryText' : 'textSecondary'}>
        {title}
      </ThemedText>
      <ThemedText type="body" themeColor={quiet ? 'textSecondary' : 'text'} selectable>
        {text}
      </ThemedText>
      {note ? (
        <ThemedText type="caption" themeColor="textTertiary">
          {note}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  number: {
    flex: 1,
  },
  block: {
    gap: Spacing.one,
  },
  highlight: {
    paddingLeft: Spacing.three,
    borderLeftWidth: 3,
  },
});
