import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { Tag } from './parts';
import { evaluate, OPERATORS, typeOfOperand, type Language, type Operator } from './operators';
import { fundamentalsStrings } from './strings';

const EXAMPLES: readonly { label: string; left: string; op: Operator; right: string; language: Language }[] = [
  { label: "'5' + 3", left: "'5'", op: '+', right: '3', language: 'javascript' },
  { label: '0.1 + 0.2', left: '0.1', op: '+', right: '0.2', language: 'javascript' },
  { label: '7 / 2', left: '7', op: '/', right: '2', language: 'python' },
  { label: '7 // 2', left: '7', op: '//', right: '2', language: 'python' },
  { label: '-7 % 3', left: '-7', op: '%', right: '3', language: 'python' },
];

export function OperatorsVisual({ compact }: VisualProps) {
  const t = useLocalized(fundamentalsStrings).operators;
  const theme = useTheme();
  const tones = useTones();
  const [language, setLanguage] = useState<Language>('javascript');
  const [left, setLeft] = useState("'5'");
  const [right, setRight] = useState('3');
  const [op, setOp] = useState<Operator>('+');

  const result = evaluate(left, op, right, language);
  const expression = `${left.trim()} ${op} ${right.trim()}`;
  const leftType = typeOfOperand(left, language);
  const rightType = typeOfOperand(right, language);

  let caption: string;
  if (result.ok) caption = `${t.ok(expression, result.display, result.type)} ${result.note ? t.notes[result.note] : ''}`;
  else if (result.reason === 'operand') caption = result.side === 'left' ? t.badLeft : t.badRight;
  else caption = `${t.failed(expression, result.error)} ${result.note ? t.notes[result.note] : ''}`;

  const choose = (next: Language) => {
    setLanguage(next);
    if (!OPERATORS[next].includes(op)) setOp('+');
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={caption.trim()}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.languageLabel} value={language} onChange={choose} options={[{ value: 'javascript', label: t.languages.javascript }, { value: 'python', label: t.languages.python }]} />
          <View style={styles.operands}>
            <TextField label={t.leftLabel} value={left} onChangeText={setLeft} autoCapitalize="none" autoCorrect={false} style={styles.operand} />
            <TextField label={t.rightLabel} value={right} onChangeText={setRight} autoCapitalize="none" autoCorrect={false} style={styles.operand} />
          </View>
          <ThemedText type="caption" themeColor="textSecondary">
            {t.operandHint}
          </ThemedText>
          <ChipSelect label={t.operatorLabel} wrap value={op} onChange={setOp} options={OPERATORS[language].map((value) => ({ value, label: value }))} />
          <ChipSelect label={t.examplesLabel} value={null} onChange={(label) => {
            const example = EXAMPLES.find((entry) => entry.label === label);
            if (!example) return;
            setLanguage(example.language);
            setLeft(example.left);
            setRight(example.right);
            setOp(example.op);
          }} options={EXAMPLES.map((example) => ({ value: example.label, label: example.label }))} />
          <ThemedText type="caption" themeColor="textSecondary">
            {t.simplifiedNote}
          </ThemedText>
        </View>
      }>
      <View style={styles.stage}>
        <View style={styles.equation} accessible accessibilityLabel={expression}>
          <View style={styles.operandBox}>
            <ThemedText type="codeInline" numberOfLines={1}>{left.trim() || '?'}</ThemedText>
            <Tag text={leftType ? t.typeOfLeft(leftType) : '?'} tone={leftType ? 'indigo' : 'red'} />
          </View>
          <ThemedText type="statSmall" themeColor="primary">{op}</ThemedText>
          <View style={styles.operandBox}>
            <ThemedText type="codeInline" numberOfLines={1}>{right.trim() || '?'}</ThemedText>
            <Tag text={rightType ? t.typeOfRight(rightType) : '?'} tone={rightType ? 'indigo' : 'red'} />
          </View>
        </View>
        <View style={[styles.result, { backgroundColor: theme.backgroundElement, borderColor: result.ok ? tones.mint.ink : result.reason === 'error' ? tones.red.ink : theme.border }]}>
          <ThemedText type="caption" themeColor="textSecondary">
            {result.ok ? t.resultLabel : result.reason === 'error' ? t.errorLabel : t.resultLabel}
          </ThemedText>
          <ThemedText type="statSmall" selectable numberOfLines={3} style={{ color: result.ok ? tones.mint.ink : result.reason === 'error' ? tones.red.ink : theme.textSecondary }}>
            {result.ok ? `${result.display}` : result.reason === 'error' ? result.error : '?'}
          </ThemedText>
          {result.ok ? <Tag text={`${t.typeLabel}: ${result.type}`} tone="mint" outlined /> : null}
        </View>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.two },
  operands: { flexDirection: 'row', gap: Spacing.two },
  operand: { flex: 1 },
  stage: { gap: Spacing.three },
  equation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  operandBox: { flex: 1, alignItems: 'center', gap: Spacing.one },
  result: { gap: Spacing.one, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 2 },
});
