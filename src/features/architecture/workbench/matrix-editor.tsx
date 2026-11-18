import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { Stepper } from '@/features/productivity';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { addCriterion, addOption, MATRIX_LIMITS, removeCriterion, removeOption, renameCriterion, renameOption, setQuestion, setScore, setWeight, type MatrixState } from '../lib/tradeoff';
import { RatingButtons } from './rating-buttons';
import { architectureToolStrings } from './strings';

export type MatrixEditorProps = { state: MatrixState; onChange: (next: MatrixState) => void };

/** The learner's matrix as form controls: the decision, the options, and each quality with its weight and a 1 to 5 score per option. */
export function MatrixEditor({ state, onChange }: MatrixEditorProps) {
  const t = useLocalized(architectureToolStrings).matrix;
  const theme = useTheme();
  const canAddOption = state.options.length < MATRIX_LIMITS.maxOptions;
  const canRemoveOption = state.options.length > MATRIX_LIMITS.minOptions;
  const canAddCriterion = state.criteria.length < MATRIX_LIMITS.maxCriteria;
  const canRemoveCriterion = state.criteria.length > MATRIX_LIMITS.minCriteria;

  return (
    <View style={styles.root}>
      <TextField label={t.questionLabel} hint={t.questionHint} value={state.question} onChangeText={(text) => onChange(setQuestion(state, text))} maxLength={MATRIX_LIMITS.maxQuestion} multiline />

      <View style={styles.section}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {t.optionsHeading}
        </ThemedText>
        {state.options.map((option, index) => (
          <View key={option.id} style={styles.nameRow}>
            <TextField style={styles.grow} label={t.optionNameLabel(index + 1)} value={option.name} onChangeText={(text) => onChange(renameOption(state, option.id, text))} maxLength={MATRIX_LIMITS.maxName} />
            {canRemoveOption ? <Button size="small" variant="ghost" icon="delete" title={t.removeLabel} accessibilityLabel={t.removeOption(option.name)} onPress={() => onChange(removeOption(state, option.id))} /> : null}
          </View>
        ))}
        {canAddOption ? (
          <Button size="small" variant="secondary" icon="add" title={t.addOption} onPress={() => onChange(addOption(state, ''))} style={styles.start} />
        ) : (
          <ThemedText type="caption" themeColor="textSecondary">
            {t.optionsLimit}
          </ThemedText>
        )}
      </View>

      <View style={styles.section}>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {t.criteriaHeading}
        </ThemedText>
        {state.criteria.map((criterion, index) => (
          <View key={criterion.id} style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <View style={styles.nameRow}>
              <TextField style={styles.grow} label={t.criterionNameLabel(index + 1)} value={criterion.name} onChangeText={(text) => onChange(renameCriterion(state, criterion.id, text))} maxLength={MATRIX_LIMITS.maxName} />
              {canRemoveCriterion ? <Button size="small" variant="ghost" icon="delete" title={t.removeLabel} accessibilityLabel={t.removeCriterion(criterion.name)} onPress={() => onChange(removeCriterion(state, criterion.id))} /> : null}
            </View>
            <View style={styles.weight}>
              <Stepper
                label={t.weightLabel(criterion.name)}
                valueText={t.weightText(criterion.weight)}
                decrementLabel={t.weightDown(criterion.name)}
                incrementLabel={t.weightUp(criterion.name)}
                canDecrement={criterion.weight > MATRIX_LIMITS.minRating}
                canIncrement={criterion.weight < MATRIX_LIMITS.maxRating}
                onDecrement={() => onChange(setWeight(state, criterion.id, criterion.weight - 1))}
                onIncrement={() => onChange(setWeight(state, criterion.id, criterion.weight + 1))}
              />
              <ThemedText type="caption" themeColor="textSecondary" style={styles.weightWord}>
                {t.weightWords[criterion.weight - 1]}
              </ThemedText>
            </View>
            {state.options.map((option) => {
              const value = criterion.scores[option.id] ?? null;
              return (
                <View key={option.id} style={styles.score}>
                  <ThemedText type="secondarySemiBold" themeColor="textSecondary">
                    {`${option.name}${value === null ? '' : `: ${t.scoreWords[value - 1]}`}`}
                  </ThemedText>
                  <RatingButtons
                    value={value}
                    label={t.scoreLabel(option.name, criterion.name)}
                    valueText={t.scoreValue(value)}
                    hint={t.scoreHint}
                    buttonLabel={(rating) => t.scoreButton(option.name, criterion.name, rating, t.scoreWords[rating - 1] ?? '')}
                    onChange={(next) => onChange(setScore(state, criterion.id, option.id, next))}
                  />
                </View>
              );
            })}
          </View>
        ))}
        {canAddCriterion ? (
          <Button size="small" variant="secondary" icon="add" title={t.addCriterion} onPress={() => onChange(addCriterion(state, ''))} style={styles.start} />
        ) : (
          <ThemedText type="caption" themeColor="textSecondary">
            {t.criteriaLimit}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.four },
  section: { gap: Spacing.three },
  card: { gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  nameRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  grow: { flex: 1 },
  weight: { gap: Spacing.half },
  weightWord: { marginLeft: Spacing.half },
  score: { gap: Spacing.one },
  start: { alignSelf: 'flex-start' },
});
