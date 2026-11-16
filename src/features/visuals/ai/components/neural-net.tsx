import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { DiagramView, PayloadBox } from '../../diagrams';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { edgeOf, fmt, forward, getParam, PARAMS, setInput, setParam, START_INPUTS, START_NET, STEP, type Activation, type Inputs, type Net, type ParamId } from '../lib/network';
import { networkSpec, workingLines } from '../lib/network-spec';
import { aiStrings } from '../strings';

const ACTIVATIONS: readonly Activation[] = ['relu', 'sigmoid'];

/** Which diagram node a bias belongs to, so choosing it lights that neuron. */
const BIAS_NODE: Partial<Record<ParamId, string>> = { b1: 'h1', b2: 'h2', c: 'out' };

/** A two-input network computed for real: change the inputs and any weight and the diagram, the working and the output follow. */
export function NeuralNetVisual({ compact }: VisualProps) {
  const s = useLocalized(aiStrings).network;
  const [net, setNet] = useState<Net>(START_NET);
  const [inputs, setInputs] = useState<Inputs>(START_INPUTS);
  const [activation, setActivation] = useState<Activation>('relu');
  const [param, setParam_] = useState<ParamId>('w11');
  const result = forward(net, inputs, activation);
  const spec = networkSpec(net, inputs, activation, s);
  const edge = edgeOf(param);
  const biasNode = BIAS_NODE[param];

  const nudgeParam = (delta: number) => {
    tapFeedback();
    setNet(setParam(net, param, getParam(net, param) + delta));
  };
  const nudgeInput = (index: 0 | 1, delta: number) => {
    tapFeedback();
    setInputs(setInput(inputs, index, inputs[index] + delta));
  };
  const reset = () => {
    setNet(START_NET);
    setInputs(START_INPUTS);
  };

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={s.verdict(result.out)}
      controls={
        <View style={styles.stack}>
          <ThemedText type="secondarySemiBold">{s.inputsTitle}</ThemedText>
          {([0, 1] as const).map((index) => (
            <View key={index} style={styles.row}>
              <ThemedText type="body" tabular style={styles.value}>
                {s.value(s.inputNames[index], fmt(inputs[index], 1))}
              </ThemedText>
              <Button title={`${s.down} ${s.inputNames[index]}`} icon="remove" size="small" variant="secondary" onPress={() => nudgeInput(index, -0.1)} />
              <Button title={`${s.up} ${s.inputNames[index]}`} icon="add" size="small" variant="secondary" onPress={() => nudgeInput(index, 0.1)} />
            </View>
          ))}
          <ChipSelect label={s.activationLabel} value={activation} onChange={setActivation} options={ACTIVATIONS.map((value) => ({ value, label: s.activations[value] }))} />
          <ChipSelect label={s.paramLabel} wrap value={param} onChange={setParam_} options={PARAMS.map((id) => ({ value: id, label: s.params[id] }))} />
          <View style={styles.row}>
            <ThemedText type="bodySemiBold" tabular style={styles.value}>
              {s.value(s.params[param], fmt(getParam(net, param), 1))}
            </ThemedText>
            <Button title={`${s.down} ${s.params[param]}`} icon="remove" size="small" onPress={() => nudgeParam(-STEP)} />
            <Button title={`${s.up} ${s.params[param]}`} icon="add" size="small" onPress={() => nudgeParam(STEP)} />
          </View>
          <View style={styles.row}>
            <Button title={s.reset} icon="refresh" size="small" variant="ghost" onPress={reset} />
          </View>
        </View>
      }>
      <View style={styles.stack}>
        <DiagramView spec={spec} highlightEdges={edge === null ? undefined : [edge]} highlightNodes={biasNode ? [biasNode] : undefined} hideNote hideHint />
        <PayloadBox title={s.workingTitle} lines={workingLines(net, inputs, activation, s)} tone="info" />
        <ThemedText type="caption" themeColor="textSecondary">
          {s.note}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two + 2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
  value: { minWidth: 120 },
});
