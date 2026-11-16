import type { DiagramSpec } from '../../diagrams';
import type { AiStrings } from '../strings';
import { fmt, forward, type Activation, type Inputs, type Net } from './network';

/** The network as a diagram: arrows carry the weights, nodes carry the values just computed. Edge order: w11, w12, w21, w22, v1, v2. */
export function networkSpec(net: Net, inputs: Inputs, activation: Activation, s: AiStrings['network']): DiagramSpec {
  const result = forward(net, inputs, activation);
  const weight = (value: number) => fmt(value, 1);
  return {
    kind: 'flow',
    title: s.diagramTitle,
    summary: s.diagramSummary,
    direction: 'TD',
    nodes: [
      { id: 'x1', label: s.nodeInput(s.inputNames[0], fmt(inputs[0], 1)), shape: 'rounded' },
      { id: 'x2', label: s.nodeInput(s.inputNames[1], fmt(inputs[1], 1)), shape: 'rounded' },
      { id: 'h1', label: s.nodeHidden(1, fmt(result.h[0])), shape: 'circle' },
      { id: 'h2', label: s.nodeHidden(2, fmt(result.h[1])), shape: 'circle' },
      { id: 'out', label: s.nodeOut(fmt(result.out)), shape: 'rounded' },
    ],
    edges: [
      { from: 'x1', to: 'h1', label: weight(net.w[0][0]) },
      { from: 'x1', to: 'h2', label: weight(net.w[0][1]) },
      { from: 'x2', to: 'h1', label: weight(net.w[1][0]) },
      { from: 'x2', to: 'h2', label: weight(net.w[1][1]) },
      { from: 'h1', to: 'out', label: weight(net.v[0]) },
      { from: 'h2', to: 'out', label: weight(net.v[1]) },
    ],
  };
}

/** The arithmetic behind the diagram, one line per value, with the real numbers filled in. */
export function workingLines(net: Net, inputs: Inputs, activation: Activation, s: AiStrings['network']): string[] {
  const r = forward(net, inputs, activation);
  const kind = activation === 'relu' ? 'ReLU' : 'sigmoid';
  return [
    s.zLine(1, fmt(inputs[0], 1), fmt(net.w[0][0], 1), fmt(inputs[1], 1), fmt(net.w[1][0], 1), fmt(net.b[0], 1), fmt(r.z[0])),
    s.hidden(1, fmt(r.z[0]), fmt(r.h[0]), kind),
    s.zLine(2, fmt(inputs[0], 1), fmt(net.w[0][1], 1), fmt(inputs[1], 1), fmt(net.w[1][1], 1), fmt(net.b[1], 1), fmt(r.z[1])),
    s.hidden(2, fmt(r.z[1]), fmt(r.h[1]), kind),
    s.outLine(fmt(r.h[0]), fmt(net.v[0], 1), fmt(r.h[1]), fmt(net.v[1], 1), fmt(net.c, 1), fmt(r.zo)),
    s.outSigmoid(fmt(r.zo), fmt(r.out)),
  ];
}
