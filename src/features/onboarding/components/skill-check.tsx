import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { CodeBlock } from '@/components/code-block';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { successFeedback, tapFeedback } from '@/lib/haptics';

import { assessmentLength, estimateLevel, nextQuestion, type AnsweredQuestion } from '../lib/assessment';
import type { ExperienceLevel } from '../lib/options';
import type { AssessmentResult } from '../lib/profile';
import { onboardingStrings } from '../strings';

export type SkillCheckProps = {
  experience: ExperienceLevel;
  /** The check finished (or was left early with what was answered): the result is saved by the caller. */
  onFinish: (result: AssessmentResult) => void;
  /** Left before answering anything. */
  onLeave: () => void;
  /** On a screen with no native header above it (onboarding): pad for the status bar. */
  headerless?: boolean;
  /** Replaces the result screen's single Continue button (Learning profile offers "Use this level" and "Keep my level"). */
  resultFooter?: (result: AssessmentResult) => ReactNode;
};

/**
 * The optional skill check: a short run of questions at the learner's level that climbs or eases as they
 * answer, an explanation after each one, then a friendly "here's where you start". It only ever raises or
 * tunes the starting point; nobody passes or fails.
 */
export function SkillCheck({ experience, onFinish, onLeave, headerless = false, resultFooter }: SkillCheckProps) {
  const strings = useLocalized(onboardingStrings);
  const theme = useTheme();
  const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const total = assessmentLength(experience);
  const question = nextQuestion(experience, answered);

  const finish = (all: readonly AnsweredQuestion[]) => {
    const correct = all.filter((entry) => entry.correct).length;
    const done: AssessmentResult = { level: estimateLevel(all), correct, total: all.length, at: new Date().toISOString() };
    successFeedback();
    setResult(done);
  };

  if (result) {
    const level = strings.checkLevels[result.level];
    return (
      <Screen variant={headerless ? 'tab' : 'stack'} footer={resultFooter ? resultFooter(result) : <Button title={strings.next} icon="arrow_forward" onPress={() => onFinish(result)} />}>
        <View style={styles.center}>
          <Tali size={200} tight mood={result.level === 'strong' ? 'celebrating' : result.level === 'comfortable' ? 'excited' : result.level === 'foundations' ? 'happy' : 'encouraging'} />
          <ThemedText type="title" style={styles.centerText} accessibilityRole="header">
            {strings.checkResultTitle}
          </ThemedText>
          <ThemedText type="stat" themeColor="primaryText" style={styles.centerText}>
            {level.label}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.centerText}>
            {level.body}
          </ThemedText>
          <ThemedText type="caption" themeColor="textTertiary" tabular>
            {strings.checkResultScore(result.correct, result.total)}
          </ThemedText>
        </View>
      </Screen>
    );
  }

  if (!question) {
    // Every question asked (or the bank ran out): the result comes from what was answered.
    finish(answered);
    return null;
  }

  const right = checked && selected === question.answer;
  const last = answered.length + 1 >= total;

  const check = () => {
    if (selected === null) return;
    tapFeedback();
    setChecked(true);
  };

  const next = () => {
    const entry: AnsweredQuestion = { id: question.id, tier: question.tier, correct: selected === question.answer };
    const all = [...answered, entry];
    setAnswered(all);
    setSelected(null);
    setChecked(false);
    if (all.length >= total) finish(all);
  };

  const footer = checked ? (
    <Button title={last ? strings.checkSeeResult : strings.checkNext} icon={last ? 'flag' : 'arrow_forward'} onPress={next} />
  ) : (
    <Button title={strings.checkAnswer} onPress={check} disabled={selected === null} />
  );

  return (
    <Screen variant={headerless ? 'tab' : 'stack'} footer={footer}>
      <View style={styles.topRow}>
        <ThemedText type="caption" themeColor="textSecondary" tabular>
          {strings.checkQuestion(answered.length + 1, total)}
        </ThemedText>
        <Button title={strings.checkLeave} variant="ghost" size="small" onPress={() => (answered.length === 0 ? onLeave() : finish(answered))} />
      </View>
      <ProgressBar fraction={answered.length / total} accessibilityLabel={strings.checkQuestion(answered.length + 1, total)} />
      <ThemedText type="section" accessibilityRole="header">
        {question.prompt}
      </ThemedText>
      {question.code && <CodeBlock code={question.code.text} language={question.code.language} label={question.code.language} copyable={false} />}
      <View style={styles.choices} accessibilityRole="radiogroup">
        {question.choices.map((choice, index) => {
          const isSelected = selected === index;
          const isAnswer = checked && index === question.answer;
          const isWrong = checked && isSelected && index !== question.answer;
          const border = isAnswer ? theme.statusOk : isWrong ? theme.statusDanger : isSelected ? theme.primary : theme.border;
          const background = isAnswer ? theme.statusOkSoft : isWrong ? theme.statusDangerSoft : isSelected ? theme.primarySoft : theme.backgroundElement;
          return (
            <Pressable
              key={choice}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected, disabled: checked }}
              disabled={checked}
              onPress={() => {
                tapFeedback();
                setSelected(index);
              }}
              style={({ pressed }) => [styles.choice, { borderColor: border, backgroundColor: background, borderWidth: isSelected || isAnswer ? 2 : 1 }, pressed && styles.pressed]}>
              <ThemedText type="body" style={styles.choiceText}>
                {choice}
              </ThemedText>
              {isAnswer ? <Icon name="check_circle" size={20} tint={theme.statusOk} /> : isWrong ? <Icon name="cancel" size={20} tint={theme.statusDanger} /> : null}
            </Pressable>
          );
        })}
      </View>
      {checked && (
        <View style={[styles.explanation, { backgroundColor: right ? theme.statusOkSoft : theme.statusWarnSoft }]} accessibilityLiveRegion="polite">
          <ThemedText type="secondarySemiBold" style={{ color: right ? theme.statusOk : theme.statusWarn }}>
            {right ? strings.checkRight : strings.checkWrong}
          </ThemedText>
          <ThemedText type="body">{question.explanation}</ThemedText>
        </View>
      )}
    </Screen>
  );
}


const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  choices: {
    gap: Spacing.two,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: MinTouchSize + Spacing.two,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
  },
  choiceText: {
    flex: 1,
  },
  pressed: {
    opacity: 0.9,
  },
  explanation: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
  },
  center: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  centerText: {
    textAlign: 'center',
  },
});
