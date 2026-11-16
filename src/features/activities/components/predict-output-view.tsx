import { StyleSheet, View } from 'react-native';

import { CodeBlock } from '@/components/code-block';
import { ThemedText } from '@/components/themed-text';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';

import type { ActivitySession } from '../hooks/use-activity-session';
import { useActivityDraft } from '../lib/draft';
import type { PredictOutputActivity } from '../types';
import { ActivityFrame, CheckBar } from './activity-frame';
import { ChoiceCard, type ChoiceState } from './choice-card';

export type PredictOutputViewProps = { activity: PredictOutputActivity; session: ActivitySession };

/** A snippet to read, and the output to predict: picked from choices or typed. */
export function PredictOutputView({ activity, session }: PredictOutputViewProps) {
  const { text, done } = session;
  const [typed, setTyped] = useActivityDraft(activity.id, 'typed', '');
  const [picked, setPicked] = useActivityDraft<number | null>(activity.id, 'picked', null);
  const answer = activity.choices ? (picked === null ? '' : activity.choices[picked]) : typed;

  return (
    <ActivityFrame session={session}>
      <CodeBlock code={activity.code} language={activity.language} copyable={false} />
      {activity.choices ? (
        <View style={styles.choices} accessibilityRole="radiogroup">
          <ThemedText type="secondarySemiBold" themeColor="textSecondary">
            {text.pickOutput}
          </ThemedText>
          {activity.choices.map((choice, index) => {
            // After a check the pick says whether it was right; Try again clears it.
            const state: ChoiceState = picked !== index ? 'idle' : done ? 'correct' : session.result && !session.result.correct ? 'incorrect' : 'selected';
            return <ChoiceCard key={index} title={choice} literal mode="single" state={state} disabled={done} onPress={() => setPicked(index)} />;
          })}
        </View>
      ) : (
        <TextField label={text.yourAnswer} hint={text.typeOutput} value={typed} onChangeText={setTyped} multiline editable={!done} autoCapitalize="none" autoCorrect={false} spellCheck={false} />
      )}
      <CheckBar
        session={session}
        canCheck={answer.trim() !== ''}
        onCheck={() => void session.check({ kind: 'predict-output', text: answer })}
        onRetry={activity.choices ? () => setPicked(null) : undefined}
      />
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  choices: { gap: Spacing.two },
});
