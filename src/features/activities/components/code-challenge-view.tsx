import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CodeBlock } from '@/components/code-block';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { runJs } from '@/features/code-runner';
import { useTheme } from '@/hooks/use-theme';

import type { ActivitySession } from '../hooks/use-activity-session';
import { recordRobotCommands, simulateRobot } from '../lib/robot';
import type { CodeChallengeActivity, RobotOutcome } from '../types';
import { ActivityFrame } from './activity-frame';
import { CodeEditor } from './code-editor';
import { RobotGrid } from './robot-grid';

export type CodeChallengeViewProps = { activity: CodeChallengeActivity; session: ActivitySession };

type RunState = { output: string[]; error: string | null; world: RobotOutcome | null };

/** An editor with Run (see what the code prints, or watch the robot), Check (the tests) and Reset. */
export function CodeChallengeView({ activity, session }: CodeChallengeViewProps) {
  const theme = useTheme();
  const { text, done, result } = session;
  const [code, setCode] = useState(activity.starter);
  const [run, setRun] = useState<RunState | null>(null);
  const world = activity.tests.kind === 'robot' ? activity.tests.world : null;
  const detail = result?.detail?.kind === 'code-challenge' ? result.detail : null;

  const runIt = () => {
    if (world) {
      const recorded = recordRobotCommands(code, world, text.runner);
      if (!recorded.ok) return setRun({ output: recorded.output, error: text.codeError(recorded.error.line, recorded.error.message), world: null });
      const sim = simulateRobot(world, recorded.commands);
      return setRun({ output: recorded.output, error: null, world: { position: sim.position, collected: sim.collected, path: sim.path, stoppedAt: sim.stoppedAt, reachedGoal: sim.reachedGoal } });
    }
    const outcome = runJs(code, undefined, text.runner);
    setRun({ output: outcome.output, error: outcome.error ? text.codeError(outcome.error.line, outcome.error.message) : null, world: null });
  };

  const hidden = detail?.cases.filter((c) => c.hidden) ?? [];
  const visible = detail?.cases.filter((c) => !c.hidden) ?? [];

  return (
    <ActivityFrame session={session}>
      {world && (
        <View style={styles.block}>
          <ThemedText type="secondarySemiBold" themeColor="textSecondary">
            {text.robotGrid}
          </ThemedText>
          <RobotGrid world={world} outcome={run?.world ?? null} />
          <ThemedText type="caption" themeColor="textSecondary">
            {text.robotCommands}
          </ThemedText>
          <CodeBlock code={world.commands.map((name) => `${name}()`).join('\n')} language="javascript" copyable={false} />
        </View>
      )}
      <CodeEditor value={code} onChangeText={setCode} language="javascript" editable={!done} minLines={8} />
      <View style={styles.buttons}>
        <Button title={world ? text.robotRun : text.runCode} icon="play_arrow" variant="secondary" onPress={runIt} style={styles.button} />
        <Button title={text.resetCode} icon="restart_alt" variant="outline" onPress={() => { setCode(activity.starter); setRun(null); }} disabled={done || code === activity.starter} style={styles.button} />
      </View>
      {!done && <Button title={text.checkCode} icon="check" onPress={() => void session.check({ kind: 'code-challenge', code })} loading={session.checking} />}

      {run && (
        <View style={[styles.output, { backgroundColor: theme.codeBackground, borderColor: run.error ? theme.statusDanger : theme.codeBorder }]} accessibilityLiveRegion="polite">
          <ThemedText type="caption" themeColor="textSecondary">
            {text.output}
          </ThemedText>
          {run.output.length === 0 && !run.error ? (
            <ThemedText type="code" themeColor="textSecondary">
              {world ? '' : text.noOutput}
            </ThemedText>
          ) : (
            run.output.map((line, index) => (
              <ThemedText key={index} type="code" selectable>
                {line}
              </ThemedText>
            ))
          )}
          {run.error && (
            <View style={styles.errorRow}>
              <Icon name="error" size={16} color="danger" />
              <ThemedText type="code" themeColor="danger" style={styles.errorText}>
                {run.error}
              </ThemedText>
            </View>
          )}
        </View>
      )}

      {detail && detail.cases.length > 0 && (
        <View style={styles.cases} accessibilityLabel={text.checkCode}>
          {visible.map((c, index) => (
            <View key={index} style={styles.caseRow}>
              <Icon name={c.pass ? 'check_circle' : 'cancel'} size={18} color={c.pass ? 'statusOk' : 'danger'} />
              <View style={styles.caseText}>
                <ThemedText type="secondarySemiBold">{c.pass ? `${c.label}: ${text.checkPassed}` : `${c.label}: ${text.checkFailed}`}</ThemedText>
                {!c.pass && <ThemedText type="secondary" themeColor="textSecondary">{c.message}</ThemedText>}
              </View>
            </View>
          ))}
          {hidden.length > 0 && (
            <View style={styles.caseRow}>
              <Icon name="lock" size={18} color="textSecondary" />
              <ThemedText type="secondary" themeColor="textSecondary" style={styles.caseText}>
                {text.hiddenChecks(hidden.filter((c) => c.pass).length, hidden.length)}
              </ThemedText>
            </View>
          )}
        </View>
      )}
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  buttons: { flexDirection: 'row', gap: Spacing.two },
  button: { flex: 1 },
  output: { gap: Spacing.one, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 1 },
  errorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  errorText: { flex: 1 },
  cases: { gap: Spacing.two },
  caseRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  caseText: { flex: 1, gap: 2 },
});
