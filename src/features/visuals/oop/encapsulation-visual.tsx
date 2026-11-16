import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../components/visual-frame';
import { Arrow, NumberAdjust, Tag } from '../fundamentals/parts';
import type { VisualProps } from '../types';
import { act, START_BALANCE, type AccessMode, type Action, type Attempt } from './encapsulation';
import { oopStrings } from './strings';

const OUTCOME_TONE = { ok: 'mint', blocked: 'red', rejected: 'amber', invalid: 'red' } as const;
const OUTCOME_MARK = { ok: '✓', blocked: '✗', rejected: '✗', invalid: '⚠' } as const;

export function EncapsulationVisual({ compact }: VisualProps) {
  const t = useLocalized(oopStrings).encapsulation;
  const theme = useTheme();
  const tones = useTones();
  const [mode, setMode] = useState<AccessMode>('encapsulated');
  const [amount, setAmount] = useState(50);
  const [balance, setBalance] = useState(START_BALANCE);
  const [history, setHistory] = useState<Attempt[]>([]);
  const last = history[history.length - 1];

  const run = (action: Action) => {
    const attempt = act(balance, action, mode, t);
    setBalance(attempt.balance);
    setHistory([...history, attempt].slice(-5));
  };
  const reset = () => {
    setBalance(START_BALANCE);
    setHistory([]);
  };
  const broken = balance < 0;

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={last ? last.message : t.intro}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.modeLabel} value={mode} onChange={(next) => { setMode(next); reset(); }} options={[{ value: 'encapsulated', label: t.modes.encapsulated }, { value: 'open', label: t.modes.open }]} />
          <NumberAdjust label={t.amountLabel} value={amount} min={-100} max={500} step={10} onChange={setAmount} />
          <View style={styles.buttons}>
            <Button size="small" variant="danger" title={t.buttons.setDirect} onPress={() => run({ kind: 'setDirect', value: amount })} />
            <Button size="small" variant="outline" title={t.buttons.readDirect} onPress={() => run({ kind: 'readDirect' })} />
            <Button size="small" title={t.buttons.deposit} onPress={() => run({ kind: 'deposit', amount })} />
            <Button size="small" title={t.buttons.withdraw} onPress={() => run({ kind: 'withdraw', amount })} />
            <Button size="small" variant="secondary" title={t.buttons.getBalance} onPress={() => run({ kind: 'getBalance' })} />
            <Button size="small" variant="ghost" icon="refresh" title={t.buttons.reset} onPress={reset} />
          </View>
        </View>
      }>
      <View style={styles.stage}>
        <Tag text={t.outsideLabel} tone="neutral" outlined />
        <Arrow />
        <View style={[styles.object, { backgroundColor: theme.backgroundElement, borderColor: broken ? tones.red.ink : theme.border }]}>
          <ThemedText type="cardTitle">{t.objectLabel}</ThemedText>
          <View style={[styles.zone, { backgroundColor: broken ? tones.red.soft : tones.violet.soft, borderColor: broken ? tones.red.ink : tones.violet.ink }]}>
            <View style={styles.zoneHead}>
              {mode === 'encapsulated' ? <Icon name="lock" size={16} tint={tones.violet.ink} /> : null}
              <ThemedText type="caption" style={{ color: broken ? tones.red.ink : tones.violet.ink }}>{mode === 'encapsulated' ? t.privateLabel : t.modes.open}</ThemedText>
            </View>
            <ThemedText type="statSmall" tabular style={{ color: broken ? tones.red.ink : tones.violet.ink }}>{`${mode === 'encapsulated' ? '#balance' : 'balance'} = ${balance}`}</ThemedText>
            {broken ? <ThemedText type="caption" style={{ color: tones.red.ink }}>{`⚠ ${t.invalidLabel}`}</ThemedText> : null}
          </View>
          <View style={[styles.zone, { backgroundColor: tones.mint.soft, borderColor: tones.mint.ink }]}>
            <ThemedText type="caption" style={{ color: tones.mint.ink }}>{t.publicLabel}</ThemedText>
            <ThemedText type="code">{'deposit(amount)  withdraw(amount)  getBalance()'}</ThemedText>
          </View>
        </View>
        <ThemedText type="caption" themeColor="textSecondary">{t.rule}</ThemedText>
        <View style={styles.history} accessibilityLabel={t.historyLabel}>
          <ThemedText type="caption" themeColor="textSecondary">{`${t.lastLabel} / ${t.historyLabel}`}</ThemedText>
          {history.length === 0 ? <ThemedText type="secondary" themeColor="textTertiary">{t.noHistory}</ThemedText> : null}
          {[...history].reverse().map((attempt, index) => (
            <Tag key={`${history.length - index}`} text={`${t.routes[attempt.route]}: ${t.outcomes[attempt.outcome]}`} tone={OUTCOME_TONE[attempt.outcome]} outlined={index === 0} marker={OUTCOME_MARK[attempt.outcome]} dim={index > 0} />
          ))}
        </View>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.one, alignItems: 'flex-start' },
  object: { alignSelf: 'stretch', gap: Spacing.two, padding: Spacing.two, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 2 },
  zone: { gap: 2, padding: Spacing.two, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5 },
  zoneHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  history: { gap: Spacing.one, alignSelf: 'stretch', alignItems: 'flex-start' },
});
