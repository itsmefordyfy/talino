import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../../components/visual-frame';
import { NumberAdjust, Panel, Tag } from '../../fundamentals/parts';
import type { VisualProps } from '../../types';
import { contextWindowStrings } from '../context-window-strings';
import { ADDABLE_KINDS, addMessage, behaviourOf, canGoBack, currentOf, fitWindow, goBack, MAX_MESSAGES, MAX_WINDOW, MIN_WINDOW, pushState, resetHistory, setWindow, startHistory, TOKENS, WINDOW_STEP } from '../lib/context-window';

/**
 * The context window: a fixed-size window holds the newest messages and the oldest fall out, including the instruction at the start, which changes the
 * example reply. Every number and reply is an illustration (labelled so on screen); nothing here is a real model.
 */
export function ContextWindowVisual({ compact }: VisualProps) {
  const t = useLocalized(contextWindowStrings);
  const theme = useTheme();
  const tones = useTones();
  const [history, setHistory] = useState(() => startHistory());
  const state = currentOf(history);
  const fit = fitWindow(state.messages, state.windowSize);
  const behaviour = behaviourOf(state, fit);
  const droppedTokens = fit.dropped.reduce((sum, message) => sum + message.tokens, 0);
  const insideIds = new Set(fit.inside.map((message) => message.id));
  const full = state.messages.length >= MAX_MESSAGES;
  const share = Math.min(1, fit.used / state.windowSize);

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={t.behaviours[behaviour].note}
      controls={
        <View style={styles.controls}>
          <NumberAdjust label={t.windowLabel} value={state.windowSize} min={MIN_WINDOW} max={MAX_WINDOW} step={WINDOW_STEP} onChange={(size) => setHistory((current) => pushState(current, setWindow(currentOf(current), size)))} />
          <ThemedText type="caption" themeColor="textSecondary" accessibilityRole="header">
            {t.addLabel}
          </ThemedText>
          <View style={styles.buttons}>
            {ADDABLE_KINDS.map((kind) => (
              <Button
                key={kind}
                size="small"
                variant={kind === 'reminder' ? 'secondary' : 'primary'}
                icon={kind === 'reminder' ? 'notifications' : 'add'}
                title={t.add[kind]}
                disabled={full}
                accessibilityLabel={`${t.add[kind]}, ${t.tokensOf(TOKENS[kind])}`}
                onPress={() => setHistory((current) => pushState(current, addMessage(currentOf(current), kind, t.texts[kind].length)))}
              />
            ))}
          </View>
          {full && (
            <ThemedText type="caption" themeColor="textSecondary">
              {t.full(MAX_MESSAGES)}
            </ThemedText>
          )}
          <View style={styles.buttons}>
            <Button size="small" variant="secondary" icon="arrow_back" title={t.back} disabled={!canGoBack(history)} onPress={() => setHistory(goBack)} />
            <Button size="small" variant="ghost" icon="refresh" title={t.reset} disabled={!canGoBack(history)} onPress={() => setHistory(resetHistory)} />
          </View>
        </View>
      }>
      <View style={styles.stage}>
        <View style={styles.counters}>
          <Tag text={t.usedLabel(fit.used, state.windowSize)} tone="indigo" outlined />
          <Tag text={t.messagesLabel(state.messages.length)} tone="neutral" outlined />
          <Tag text={t.droppedLabel(fit.dropped.length, droppedTokens)} tone={fit.dropped.length > 0 ? 'amber' : 'neutral'} outlined marker={fit.dropped.length > 0 ? '▼' : undefined} />
        </View>

        {/* The meter: how full the window is. The number above says the same in words, so the bar is never the only signal. */}
        <View accessible accessibilityRole="progressbar" accessibilityLabel={t.meterLabel(fit.used, state.windowSize, fit.dropped.length)} accessibilityValue={{ min: 0, max: state.windowSize, now: fit.used }} style={[styles.meter, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
          <View style={[styles.meterFill, { width: `${Math.round(share * 100)}%`, backgroundColor: tones.indigo.solid }]} />
        </View>

        <Panel label={t.windowTitle}>
          <View style={styles.list}>
            {state.messages.map((message, index) => {
              const inside = insideIds.has(message.id);
              const name = t.kindNames[message.kind];
              const text = t.texts[message.kind][message.variant % t.texts[message.kind].length];
              const important = message.kind === 'instruction' || message.kind === 'reminder';
              const colors = tones[important ? 'violet' : 'neutral'];
              return (
                <View
                  key={message.id}
                  accessible
                  accessibilityLabel={t.messageLabel(index + 1, name, text, message.tokens, inside)}
                  style={[styles.message, { backgroundColor: inside ? colors.soft : 'transparent', borderColor: inside ? colors.ink : theme.textTertiary }, !inside && styles.dropped]}>
                  <View style={styles.messageHead}>
                    <ThemedText type="caption" style={{ color: inside ? colors.ink : theme.textSecondary }}>
                      {name}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textSecondary" tabular>
                      {t.tokensOf(message.tokens)}
                    </ThemedText>
                    <View style={styles.status}>
                      <Icon name={inside ? 'check_circle' : 'cancel'} size={14} color={inside ? 'statusOk' : 'textSecondary'} filled={inside} />
                      <ThemedText type="caption" themeColor={inside ? 'statusOk' : 'textSecondary'}>
                        {inside ? t.insideStatus : t.droppedStatus}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText type="secondary" themeColor={inside ? 'text' : 'textSecondary'} style={!inside && styles.struck}>
                    {text}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </Panel>

        <Panel label={t.behaviourTitle}>
          <Badge label={t.replyLabel} color="statusWarn" background="statusWarnSoft" />
          <ThemedText type="body">{t.behaviours[behaviour].reply}</ThemedText>
        </Panel>

        {!compact && (
          <View style={styles.idea}>
            <ThemedText type="secondarySemiBold">{t.ideaTitle}</ThemedText>
            <ThemedText type="secondary">{t.idea}</ThemedText>
          </View>
        )}
        <ThemedText type="caption" themeColor="textSecondary">
          {t.illustration}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.three },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  meter: { height: 14, borderRadius: Radius.pill, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  meterFill: { height: '100%', borderRadius: Radius.pill },
  list: { gap: Spacing.two },
  message: { gap: Spacing.one, padding: Spacing.two + 2, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  // Dropped messages are drawn with a dashed border and struck-through text as well as dimmed: never faded alone.
  dropped: { borderStyle: 'dashed', opacity: 0.8 },
  struck: { textDecorationLine: 'line-through' },
  messageHead: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  status: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginLeft: 'auto' },
  idea: { gap: Spacing.one },
});
