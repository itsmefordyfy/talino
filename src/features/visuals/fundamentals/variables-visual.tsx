import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTones } from '@/hooks/use-tones';

import { VisualFrame } from '../components/visual-frame';
import type { VisualProps } from '../types';
import { Tag } from './parts';
import { fundamentalsStrings } from './strings';
import { assign, parseValue, type DataType, type TypeChoice, type Variable } from './variables';

const NAMES = [
  { name: 'age', raw: '25' },
  { name: 'userName', raw: 'Ana' },
  { name: 'price', raw: '19.99' },
  { name: 'isStudent', raw: 'true' },
  { name: 'score', raw: '90' },
] as const;

const TYPE_TONE: Record<DataType, Tone> = { integer: 'indigo', decimal: 'violet', text: 'mint', boolean: 'amber' };

export function VariablesVisual({ compact }: VisualProps) {
  const t = useLocalized(fundamentalsStrings).variables;
  const theme = useTheme();
  const tones = useTones();
  const [variables, setVariables] = useState<Variable[]>([]);
  const [name, setName] = useState<string>(NAMES[0].name);
  const [raw, setRaw] = useState<string>(NAMES[0].raw);
  const [choice, setChoice] = useState<TypeChoice>('auto');
  const [caption, setCaption] = useState(t.intro);
  const [failed, setFailed] = useState(false);

  const pick = (next: string) => {
    setName(next);
    setRaw(NAMES.find((entry) => entry.name === next)?.raw ?? '');
    setChoice('auto');
  };

  const submit = () => {
    const parsed = parseValue(raw, choice);
    if (!parsed.ok) {
      setFailed(true);
      setCaption(t.failures[parsed.reason]);
      return;
    }
    const outcome = assign(variables, name, parsed.value, t);
    setFailed(false);
    setVariables(outcome.variables);
    setCaption(outcome.caption);
  };

  return (
    <VisualFrame
      title={t.title}
      description={t.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={t.nameLabel} wrap value={name} onChange={pick} options={NAMES.map((entry) => ({ value: entry.name, label: entry.name }))} />
          <TextField label={t.valueLabel} value={raw} onChangeText={setRaw} autoCapitalize="none" autoCorrect={false} error={failed ? t.mismatch : null} hint={choice === 'auto' ? undefined : t.hints[choice]} />
          <ChipSelect label={t.typeLabel} wrap value={choice} onChange={setChoice} options={[{ value: 'auto', label: t.autoType }, ...(Object.keys(t.typeNames) as DataType[]).map((type) => ({ value: type, label: t.typeNames[type] }))]} />
          <View style={styles.row}>
            <Button title={t.assign} icon="edit" onPress={submit} />
            <Button title={t.clear} variant="ghost" disabled={variables.length === 0} onPress={() => { setVariables([]); setCaption(t.intro); setFailed(false); }} />
          </View>
        </View>
      }>
      <View style={styles.boxes}>
        {variables.length === 0 ? (
          <ThemedText type="secondary" themeColor="textSecondary">
            {t.empty}
          </ThemedText>
        ) : (
          variables.map((variable) => {
            const tone = tones[TYPE_TONE[variable.value.type]];
            return (
              <View key={variable.name} accessible accessibilityLabel={t.boxLabel(variable.name, variable.value.display, t.typeNames[variable.value.type])} style={[styles.box, { backgroundColor: theme.backgroundElement, borderColor: tone.ink }]}>
                <ThemedText type="codeInline" themeColor="textSecondary">
                  {variable.name}
                </ThemedText>
                <ThemedText type="statSmall" style={{ color: tone.ink }} numberOfLines={1}>
                  {variable.value.display}
                </ThemedText>
                <Tag text={`${t.typeWord}: ${t.typeNames[variable.value.type]}`} tone={TYPE_TONE[variable.value.type]} />
              </View>
            );
          })
        )}
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.three },
  row: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  boxes: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, minHeight: 56 },
  box: { flexGrow: 1, flexBasis: 130, gap: Spacing.one, padding: Spacing.two + 2, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 2 },
});
