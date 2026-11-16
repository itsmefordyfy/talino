import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { TextField } from '@/components/ui/text-field';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { ActivitySession } from '../hooks/use-activity-session';
import type { FixBugActivity } from '../types';
import { ActivityFrame, CheckBar } from './activity-frame';
import { ChoiceCard, type ChoiceState } from './choice-card';
import { CodeLine } from './code-lines';

export type FixBugViewProps = { activity: FixBugActivity; session: ActivitySession };

/** First tap the line that is wrong, then choose (or type) the line that fixes it. */
export function FixBugView({ activity, session }: FixBugViewProps) {
  const theme = useTheme();
  const { text, done } = session;
  const [foundLine, setFoundLine] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const lines = activity.code.split('\n');
  const fixAnswer = activity.typed ? typed : picked === null ? '' : activity.fixes[picked].line;

  const tapLine = async (line: number) => {
    if (foundLine !== null || done) return;
    tapFeedback();
    const result = await session.check({ kind: 'fix-bug', line });
    if (result?.detail?.kind === 'fix-bug' && result.detail.stage === 'fix') setFoundLine(line);
  };

  return (
    <ActivityFrame session={session}>
      <ThemedText type="secondarySemiBold" themeColor="textSecondary">
        {foundLine === null ? text.tapBuggyLine : activity.typed ? text.typeFix : text.chooseFix}
      </ThemedText>
      <View style={[styles.code, { backgroundColor: theme.codeBackground, borderColor: theme.codeBorder }]}>
        {lines.map((line, index) => {
          const number = index + 1;
          const isBug = foundLine === number || (done && number === activity.bugLine);
          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`${text.bugLineLabel(number)}: ${line.trim() || '-'}`}
              accessibilityState={{ selected: isBug, disabled: foundLine !== null || done }}
              disabled={foundLine !== null || done || line.trim() === ''}
              onPress={() => void tapLine(number)}
              style={({ pressed }) => [styles.line, isBug && { backgroundColor: theme.statusWarnSoft }, pressed && styles.pressed]}>
              <ThemedText type="code" style={[styles.number, { color: theme.codeComment }]}>
                {number}
              </ThemedText>
              <View style={styles.lineCode}>
                <CodeLine code={line} language={activity.language} />
              </View>
              {isBug && <Icon name="bug_report" size={18} color="statusWarn" />}
            </Pressable>
          );
        })}
      </View>

      {foundLine !== null && (
        <View style={styles.fix}>
          {activity.typed ? (
            <TextField label={text.typeFix} value={typed} onChangeText={setTyped} editable={!done} autoCapitalize="none" autoCorrect={false} spellCheck={false} />
          ) : (
            <View style={styles.options} accessibilityRole="radiogroup">
              {activity.fixes.map((fix, index) => {
                const state: ChoiceState = picked !== index ? 'idle' : done ? 'correct' : session.result && !session.result.correct && !session.result.progress ? 'incorrect' : 'selected';
                return <ChoiceCard key={index} title={fix.line.trim()} literal mode="single" state={state} disabled={done} onPress={() => setPicked(index)} />;
              })}
            </View>
          )}
          <CheckBar
            session={session}
            canCheck={fixAnswer.trim() !== ''}
            onCheck={() => void session.check({ kind: 'fix-bug', line: foundLine, fix: fixAnswer })}
            onRetry={activity.typed ? undefined : () => setPicked(null)}
          />
        </View>
      )}
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  code: { borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth, paddingVertical: Spacing.one, overflow: 'hidden' },
  line: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, minHeight: MinTouchSize - 4, paddingHorizontal: Spacing.three },
  number: { minWidth: 20, textAlign: 'right' },
  lineCode: { flex: 1 },
  fix: { gap: Spacing.three },
  options: { gap: Spacing.two },
  pressed: { opacity: 0.7 },
});
