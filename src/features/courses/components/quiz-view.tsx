import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { TaliSays } from '@/components/tali-says';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { quizAnswerLine } from '@/features/companion/lib/messages';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { successFeedback, tapFeedback } from '@/lib/haptics';

import type { QuizQuestion } from '../content/types';
import { courseStrings } from '../strings';
import { InlineText } from './inline-text';

export type QuizViewProps = {
  /** The lesson's id: it seeds Tali's wording, so each lesson's answers don't all read alike. */
  lessonId: string;
  questions: readonly QuizQuestion[];
  /** Called once, after the last question is checked, with the questions that were answered wrongly (for the review list). */
  onFinish: (correct: number, total: number, missed: QuizQuestion[]) => void;
};

/** One question at a time: pick, check, see why, next. */
export function QuizView({ lessonId, questions, onFinish }: QuizViewProps) {
  const theme = useTheme();
  const strings = useLocalized(courseStrings);
  const language = useLanguage();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<QuizQuestion[]>([]);
  // Runs of right and wrong answers, so Tali can cheer a streak and be gentler after two misses.
  const [streak, setStreak] = useState(0);
  const [missedInRow, setMissedInRow] = useState(0);
  const question = questions[index];
  const last = index === questions.length - 1;
  const right = checked && selected === question.answer;

  const check = () => {
    if (selected === null) return;
    setChecked(true);
    if (selected === question.answer) {
      successFeedback();
      setCorrect((count) => count + 1);
      setStreak((count) => count + 1);
      setMissedInRow(0);
    } else {
      tapFeedback();
      setMissed((list) => [...list, question]);
      setStreak(0);
      setMissedInRow((count) => count + 1);
    }
  };

  const next = () => {
    if (last) {
      onFinish(correct, questions.length, missed);
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setChecked(false);
  };

  return (
    <View style={styles.quiz}>
      <View style={styles.header}>
        <ThemedText type="caption" themeColor="textSecondary">
          {strings.quizTitle(index + 1, questions.length)}
        </ThemedText>
        <ProgressBar fraction={(index + (checked ? 1 : 0)) / questions.length} accessibilityLabel={strings.quizTitle(index + 1, questions.length)} />
      </View>
      <InlineText type="cardTitle" text={question.prompt} accessibilityRole="header" />
      <View style={styles.choices} accessibilityRole="radiogroup">
        {question.choices.map((choice, choiceIndex) => {
          const isSelected = selected === choiceIndex;
          const isAnswer = choiceIndex === question.answer;
          const border = checked ? (isAnswer ? theme.statusOk : isSelected ? theme.statusDanger : theme.border) : isSelected ? theme.primary : theme.border;
          const background = checked ? (isAnswer ? theme.statusOkSoft : isSelected ? theme.statusDangerSoft : theme.backgroundElement) : isSelected ? theme.primarySoft : theme.backgroundElement;
          return (
            <Pressable
              key={choiceIndex}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected, disabled: checked }}
              accessibilityLabel={choice}
              disabled={checked}
              onPress={() => {
                tapFeedback();
                setSelected(choiceIndex);
              }}
              style={({ pressed }) => [styles.choice, { borderColor: border, backgroundColor: background }, pressed && styles.pressed]}>
              <View style={[styles.radio, { borderColor: isSelected || (checked && isAnswer) ? border : theme.textTertiary }]}>
                {checked && isAnswer ? <Icon name="check" size={14} tint={theme.statusOk} /> : checked && isSelected ? <Icon name="close" size={14} tint={theme.statusDanger} /> : isSelected ? <View style={[styles.dot, { backgroundColor: theme.primary }]} /> : null}
              </View>
              <InlineText type="body" text={choice} style={styles.choiceText} />
            </Pressable>
          );
        })}
      </View>
      {checked && (
        <View style={styles.feedback}>
          <TaliSays key={index} size="small" live {...quizAnswerLine({ lessonId, index, total: questions.length, correct: right, streak: right ? streak - 1 : 0, missedInRow, language })} />
          <View style={[styles.explanation, { backgroundColor: right ? theme.statusOkSoft : theme.statusWarnSoft }]}>
            <ThemedText type="secondarySemiBold" style={{ color: right ? theme.statusOk : theme.statusWarn }}>
              {right ? strings.correct : strings.notQuite}
            </ThemedText>
            <InlineText type="body" text={question.explanation} />
          </View>
        </View>
      )}
      {checked ? (
        <Button title={last ? strings.seeResult : strings.nextQuestion} icon={last ? 'flag' : 'arrow_forward'} onPress={next} />
      ) : (
        <Button title={strings.check} onPress={check} disabled={selected === null} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  quiz: {
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.two,
  },
  choices: {
    gap: Spacing.two,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchSize + 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: 1.5,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  choiceText: {
    flex: 1,
  },
  feedback: {
    gap: Spacing.three,
  },
  explanation: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
  },
  pressed: {
    opacity: 0.7,
  },
});
