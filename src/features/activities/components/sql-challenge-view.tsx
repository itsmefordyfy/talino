import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CodeBlock } from '@/components/code-block';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { ActivitySession } from '../hooks/use-activity-session';
import { runSqlQuery } from '../lib/check';
import type { SqlChallengeActivity } from '../types';
import { ActivityFrame } from './activity-frame';
import { CodeEditor } from './code-editor';
import { ResultTable } from './result-table';

export type SqlChallengeViewProps = { activity: SqlChallengeActivity; session: ActivitySession };

type RunState = { result: Awaited<ReturnType<typeof runSqlQuery>>['result']; error: string | null };

/** The practice tables, an editor, Run (shows the result table) and Check (compares it with what was asked). */
export function SqlChallengeView({ activity, session }: SqlChallengeViewProps) {
  const theme = useTheme();
  const { text, done, result } = session;
  const [query, setQuery] = useState(activity.starter ?? '');
  const [run, setRun] = useState<RunState | null>(null);
  const [running, setRunning] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const execute = async () => {
    setRunning(true);
    try {
      const outcome = await runSqlQuery(activity.setup, query, text);
      setRun({ result: outcome.result, error: outcome.error === null ? null : text.sqlRunFailed(outcome.error) });
    } finally {
      setRunning(false);
    }
  };

  // After Check, show what Check ran, so the table always matches the verdict above it.
  const shown: RunState | null = run ?? (result?.detail?.kind === 'sql-challenge' && result.detail.result ? { result: result.detail.result, error: null } : null);

  return (
    <ActivityFrame session={session}>
      <Button title={text.sqlSetup} icon="visibility" variant="ghost" size="small" onPress={() => setShowSetup((current) => !current)} style={styles.toggle} />
      {showSetup && <CodeBlock code={activity.setup} language="sql" label={text.sqlSetup} copyable={false} />}
      <CodeEditor value={query} onChangeText={setQuery} language="sql" editable={!done} minLines={5} accessibilityLabel={text.queryEditor} />
      <View style={styles.buttons}>
        <Button title={text.runQuery} icon="play_arrow" variant="secondary" onPress={() => void execute()} loading={running} style={styles.button} />
        {!done && <Button title={text.checkQuery} icon="check" onPress={() => { setRun(null); void session.check({ kind: 'sql-challenge', query }); }} loading={session.checking} disabled={query.trim() === ''} style={styles.button} />}
      </View>
      {shown?.error && (
        <View style={[styles.error, { backgroundColor: theme.statusDangerSoft }]} accessibilityLiveRegion="polite">
          <Icon name="error" size={16} color="danger" />
          <ThemedText type="secondary" themeColor="danger" style={styles.errorText}>
            {shown.error}
          </ThemedText>
        </View>
      )}
      {shown?.result?.ok ? <ResultTable columns={shown.result.columns} rows={shown.result.rows} truncated={shown.result.truncated} /> : !shown && (
        <ThemedText type="caption" themeColor="textSecondary">
          {text.runFirst}
        </ThemedText>
      )}
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  toggle: { alignSelf: 'flex-start' },
  buttons: { flexDirection: 'row', gap: Spacing.two },
  button: { flex: 1 },
  error: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous' },
  errorText: { flex: 1 },
});
