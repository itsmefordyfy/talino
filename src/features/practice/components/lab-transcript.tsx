import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';

import type { PracticeMessageRow } from '../api/practice-repo';
import { labRunsOf } from '../lib/lab-input';
import type { PracticeText } from '../strings';
import type { LabTask } from '../types';
import { LabOutputCard } from './lab-output-card';

export type LabTranscriptProps = {
  lab: Pick<LabTask, 'compare' | 'output'>;
  messages: readonly Pick<PracticeMessageRow, 'role' | 'text'>[];
  text: PracticeText;
};

/** The runs of one lab try, as saved: each run's prompt(s) and the live model's reply(ies). Read-only, so a reply is shown without numbers that were not kept. */
export function LabTranscript({ lab, messages, text }: LabTranscriptProps) {
  const runs = labRunsOf(lab, messages);
  const comparing = lab.compare !== undefined;
  const json = lab.output.format === 'json';
  return (
    <View style={styles.stack}>
      {runs.map((run, index) => (
        <View key={index} style={styles.stack}>
          <ThemedText type="section" accessibilityRole="header">
            {text.lab.savedRun(index + 1)}
          </ThemedText>
          {run.prompts.map((prompt, promptIndex) => (
            <Card key={promptIndex} tone="backgroundSelected" style={styles.card}>
              <ThemedText type="secondarySemiBold" themeColor="textSecondary">
                {lab.compare === 'prompts' ? (promptIndex === 0 ? text.lab.promptA : text.lab.promptB) : text.lab.yourPrompt}
              </ThemedText>
              <ThemedText type="body" selectable>
                {prompt}
              </ThemedText>
            </Card>
          ))}
          {run.outputs.map((output, outputIndex) => (
            <LabOutputCard key={outputIndex} title={comparing ? (lab.compare === 'models' ? (outputIndex === 0 ? text.lab.modelA : text.lab.modelB) : outputIndex === 0 ? text.lab.outputA : text.lab.outputB) : text.lab.outputTitle} output={output} text={text} json={json} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  card: { gap: Spacing.one },
});
