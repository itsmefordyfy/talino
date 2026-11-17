import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon, type IconName } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import { Toggle } from '@/components/ui/toggle';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import {
  MAX_TASK_LENGTH,
  SETTING_LIMITS,
  formatCountdown,
  formatDuration,
  productivityStrings,
  usePomodoro,
  usePomodoroSaved,
  type FocusLogEntry,
  type Phase,
  type PomodoroSaved,
} from '@/features/productivity';
import { useStrings, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { tapFeedback } from '@/lib/haptics';

import { VisualFrame } from '../components/visual-frame';
import { NumberAdjust, Panel } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { Disclosure } from './disclosure';
import { productivityVisualStrings } from './strings';
import { TimerRing } from './timer-ring';

/** How many finished rounds the list shows; the counts above it cover them all. */
const LOG_SHOWN = 8;

const PHASE_TONE: Record<Phase, Tone> = { work: 'violet', short: 'mint', long: 'indigo' };
const PHASE_ICON: Record<Phase, IconName> = { work: 'bolt', short: 'coffee', long: 'local_cafe' };

const formatWhen = (time: number) => new Date(time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

/** The Pomodoro focus timer: it loads what is saved on this phone, then hands over to the working tool. */
export function PomodoroVisual({ compact }: VisualProps) {
  const t = useLocalized(productivityStrings);
  const v = useLocalized(productivityVisualStrings).pomodoro;
  const common = useStrings().common;
  const saved = usePomodoroSaved();
  if (saved.status === 'ready') return <PomodoroTool saved={saved.data} compact={compact} />;
  return (
    <VisualFrame title={t.timerTitle} description={v.description} compact={compact}>
      {saved.status === 'loading' ? (
        <View accessibilityState={{ busy: true }}>
          <SkeletonBlock height={220} />
        </View>
      ) : (
        <View style={styles.stack}>
          <Notice tone="danger" message={t.timerLoadError} />
          <Button title={common.tryAgain} variant="secondary" onPress={saved.retry} />
        </View>
      )}
    </VisualFrame>
  );
}

type PomodoroToolProps = { saved: PomodoroSaved; compact?: boolean };

function PomodoroTool({ saved, compact = false }: PomodoroToolProps) {
  const t = useLocalized(productivityStrings);
  const v = useLocalized(productivityVisualStrings).pomodoro;
  const common = useStrings().common;
  const theme = useTheme();
  const tones = useTones();
  const p = usePomodoro({ initial: saved });
  const { timer, settings } = p;

  const idle = timer.status === 'idle';
  const running = timer.status === 'running';
  const pristine = idle && timer.phase === 'work' && timer.cycle === 0;
  const phaseLabel = t.timerPhase[timer.phase];
  const color = tones[PHASE_TONE[timer.phase]].ink;
  const time = formatCountdown(p.remaining);
  const roundsDone = timer.phase === 'work' ? timer.cycle % settings.roundsBeforeLong : p.round;
  const caption = p.notice === 'focus' ? t.timerFocusDone : p.notice === 'break' ? t.timerBreakDone : compact ? undefined : t.timerIntro;

  const primary = () => {
    tapFeedback();
    if (running) p.pause();
    else p.start();
  };

  return (
    <VisualFrame
      title={t.timerTitle}
      description={v.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.stack}>
          <View style={styles.buttons}>
            <Button style={styles.primary} title={running ? t.timerPause : idle ? t.timerStart : t.timerResume} icon={running ? 'pause' : 'play_arrow'} onPress={primary} />
            <Button
              size="small"
              variant="outline"
              icon="restart_alt"
              title={t.timerReset}
              disabled={pristine}
              onPress={() => {
                tapFeedback();
                p.reset();
              }}
            />
            <Button
              size="small"
              variant="ghost"
              icon="skip_next"
              title={t.timerSkip}
              onPress={() => {
                tapFeedback();
                p.skip();
              }}
            />
          </View>
          <View style={styles.note}>
            <Icon name="info" size={16} color="textSecondary" />
            <ThemedText type="caption" themeColor="textSecondary" style={styles.noteText}>
              {t.timerKeepOpen}
            </ThemedText>
          </View>
          {p.saveError ? <Notice tone="warning" message={t.timerSaveError} /> : null}
          <Panel>
            <ThemedText type="secondarySemiBold">{t.timerToday(p.summary.today.sessions, formatDuration(p.summary.today.minutes))}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary">
              {t.timerWeek(p.summary.week.sessions, formatDuration(p.summary.week.minutes))}
            </ThemedText>
          </Panel>
          <Disclosure title={t.timerSettings} showLabel={t.sectionShow(t.timerSettings)} hideLabel={t.sectionHide(t.timerSettings)}>
            <View style={styles.settings}>
              <View style={styles.setting}>
                <NumberAdjust label={t.timerWork} value={settings.workMinutes} min={SETTING_LIMITS.workMinutes[0]} max={SETTING_LIMITS.workMinutes[1]} onChange={(value) => p.updateSettings({ workMinutes: value })} />
              </View>
              <View style={styles.setting}>
                <NumberAdjust label={t.timerShort} value={settings.shortBreakMinutes} min={SETTING_LIMITS.shortBreakMinutes[0]} max={SETTING_LIMITS.shortBreakMinutes[1]} onChange={(value) => p.updateSettings({ shortBreakMinutes: value })} />
              </View>
              <View style={styles.setting}>
                <NumberAdjust label={t.timerLong} value={settings.longBreakMinutes} min={SETTING_LIMITS.longBreakMinutes[0]} max={SETTING_LIMITS.longBreakMinutes[1]} onChange={(value) => p.updateSettings({ longBreakMinutes: value })} />
              </View>
              <View style={styles.setting}>
                <NumberAdjust label={t.timerRounds} value={settings.roundsBeforeLong} min={SETTING_LIMITS.roundsBeforeLong[0]} max={SETTING_LIMITS.roundsBeforeLong[1]} onChange={(value) => p.updateSettings({ roundsBeforeLong: value })} />
              </View>
            </View>
            <View style={styles.toggleRow}>
              <ThemedText type="body" style={styles.noteText}>
                {t.timerAuto}
              </ThemedText>
              <Toggle value={settings.autoStartNext} onValueChange={(value) => p.updateSettings({ autoStartNext: value })} accessibilityLabel={t.timerAuto} />
            </View>
          </Disclosure>
          {!compact ? <FocusLog entries={p.log.entries.slice(0, LOG_SHOWN)} total={p.log.entries.length} loading={p.log.isLoading} failed={p.log.isError} retry={p.log.retry} retryLabel={common.tryAgain} /> : null}
        </View>
      }>
      <View style={styles.stage}>
        <View style={styles.phaseRow} accessible={false}>
          <Icon name={PHASE_ICON[timer.phase]} size={20} tint={color} />
          <ThemedText type="cardTitle" style={{ color }}>
            {phaseLabel}
          </ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {`· ${t.timerStatus[timer.status]}`}
          </ThemedText>
        </View>
        <TimerRing fraction={p.fraction} size={compact ? 168 : 208} color={color} time={time} accessibilityLabel={`${t.timerRingLabel(phaseLabel, time)}. ${t.timerStatus[timer.status]}`} />
        <View style={styles.roundRow} accessibilityLabel={`${t.timerRound(p.round, settings.roundsBeforeLong)}. ${t.timerRoundsDone(roundsDone, settings.roundsBeforeLong)}`}>
          <ThemedText type="secondarySemiBold">{t.timerRound(p.round, settings.roundsBeforeLong)}</ThemedText>
          <View style={styles.dots} accessible={false}>
            {Array.from({ length: settings.roundsBeforeLong }, (_, index) => (
              <View key={index} style={[styles.dot, { borderColor: color, backgroundColor: index < roundsDone ? color : theme.backgroundElement }]} />
            ))}
          </View>
        </View>
        <TextField
          style={styles.task}
          label={t.timerTaskLabel}
          placeholder={t.timerTaskPlaceholder}
          value={p.task}
          onChangeText={p.setTask}
          onBlur={p.saveTask}
          onSubmitEditing={p.saveTask}
          maxLength={MAX_TASK_LENGTH}
          returnKeyType="done"
          autoCorrect={false}
        />
      </View>
    </VisualFrame>
  );
}

type FocusLogProps = { entries: readonly FocusLogEntry[]; total: number; loading: boolean; failed: boolean; retry: () => void; retryLabel: string };

/** The finished focus rounds, with all four states: loading, error with a retry, empty with a next step, and the list. */
function FocusLog({ entries, total, loading, failed, retry, retryLabel }: FocusLogProps) {
  const t = useLocalized(productivityStrings);
  const theme = useTheme();
  return (
    <View style={styles.log}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {t.timerLog}
      </ThemedText>
      {loading ? (
        <View accessibilityState={{ busy: true }}>
          <SkeletonBlock height={56} />
        </View>
      ) : failed ? (
        <View style={styles.stack}>
          <Notice tone="danger" message={t.timerLoadError} />
          <Button title={retryLabel} variant="secondary" size="small" onPress={retry} />
        </View>
      ) : entries.length === 0 ? (
        <EmptyState icon="timer" title={t.timerLogEmpty} message={t.timerLogEmptyNext} />
      ) : (
        <View style={[styles.logList, { borderColor: theme.border }]}>
          {entries.map((entry, index) => (
            <View key={entry.id} style={[styles.logRow, index > 0 && { borderTopColor: theme.border, borderTopWidth: StyleSheet.hairlineWidth }]} accessible accessibilityLabel={`${entry.task ?? t.timerNoTask}, ${formatDuration(entry.minutes)}, ${formatWhen(entry.endedAt)}`}>
              <Icon name="check_circle" size={20} color="statusOk" />
              <View style={styles.logText}>
                <ThemedText type="body" numberOfLines={2}>
                  {entry.task ?? t.timerNoTask}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary" tabular>
                  {formatWhen(entry.endedAt)}
                </ThemedText>
              </View>
              <ThemedText type="secondarySemiBold" tabular>
                {formatDuration(entry.minutes)}
              </ThemedText>
            </View>
          ))}
          {total > entries.length ? (
            <ThemedText type="caption" themeColor="textSecondary" style={styles.logMore}>
              {t.timerLogShown(entries.length)}
            </ThemedText>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  stage: { alignItems: 'center', gap: Spacing.three },
  phaseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap', justifyContent: 'center' },
  roundRow: { alignItems: 'center', gap: Spacing.two },
  dots: { flexDirection: 'row', gap: Spacing.two },
  dot: { width: Spacing.three, height: Spacing.three, borderRadius: Radius.pill, borderWidth: 2 },
  task: { alignSelf: 'stretch' },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
  primary: { flexGrow: 1, minWidth: 140 },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  noteText: { flex: 1 },
  settings: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  setting: { flexGrow: 1, minWidth: 140 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  log: { gap: Spacing.two },
  logList: { borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.three },
  logText: { flex: 1, gap: 2 },
  logMore: { padding: Spacing.three },
});
