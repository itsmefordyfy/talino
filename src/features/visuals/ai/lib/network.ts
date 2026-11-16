/**
 * A tiny neural network, computed for real: two inputs, two hidden neurons and one output. The weights
 * are numbers the learner can change; `forward` returns every intermediate value so it can all be shown.
 * The "umbrella" example and its numbers are an illustration, not a trained model.
 */

export type Activation = 'relu' | 'sigmoid';

export type Net = {
  /** w[i][j]: weight from input i to hidden neuron j. */
  w: [[number, number], [number, number]];
  /** Bias of each hidden neuron. */
  b: [number, number];
  /** Weight from each hidden neuron to the output. */
  v: [number, number];
  /** Bias of the output neuron. */
  c: number;
};

export type Inputs = [number, number];

export type Forward = {
  /** Weighted sums before the activation. */
  z: [number, number];
  /** Hidden outputs after the activation. */
  h: [number, number];
  /** The output neuron's weighted sum, and its output (always a sigmoid: a number between 0 and 1). */
  zo: number;
  out: number;
};

export const PARAMS = ['w11', 'w21', 'w12', 'w22', 'b1', 'b2', 'v1', 'v2', 'c'] as const;
export type ParamId = (typeof PARAMS)[number];

export const STEP = 0.5;
export const LIMIT = 3;

export const START_NET: Net = { w: [[1, 0.5], [2, -1]], b: [-0.5, 0.5], v: [1.5, 1], c: -1 };
export const START_INPUTS: Inputs = [0.8, 0.6];

export function relu(x: number): number {
  return Math.max(0, x);
}

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function activate(kind: Activation, x: number): number {
  return kind === 'relu' ? relu(x) : sigmoid(x);
}

/** One forward pass: hidden = activation(inputs · weights + bias), output = sigmoid(hidden · weights + bias). */
export function forward(net: Net, inputs: Inputs, activation: Activation): Forward {
  const z: [number, number] = [inputs[0] * net.w[0][0] + inputs[1] * net.w[1][0] + net.b[0], inputs[0] * net.w[0][1] + inputs[1] * net.w[1][1] + net.b[1]];
  const h: [number, number] = [activate(activation, z[0]), activate(activation, z[1])];
  const zo = h[0] * net.v[0] + h[1] * net.v[1] + net.c;
  return { z, h, zo, out: sigmoid(zo) };
}

export function getParam(net: Net, id: ParamId): number {
  switch (id) {
    case 'w11': return net.w[0][0];
    case 'w21': return net.w[1][0];
    case 'w12': return net.w[0][1];
    case 'w22': return net.w[1][1];
    case 'b1': return net.b[0];
    case 'b2': return net.b[1];
    case 'v1': return net.v[0];
    case 'v2': return net.v[1];
    case 'c': return net.c;
  }
}

/** Rounds to one decimal, so repeated +/- steps never show 0.30000000000000004. */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

export function setParam(net: Net, id: ParamId, value: number): Net {
  const v = round1(clamp(value, -LIMIT, LIMIT));
  const w: Net['w'] = [[...net.w[0]], [...net.w[1]]];
  const b: Net['b'] = [...net.b];
  const out: Net['v'] = [...net.v];
  let c = net.c;
  switch (id) {
    case 'w11': w[0][0] = v; break;
    case 'w21': w[1][0] = v; break;
    case 'w12': w[0][1] = v; break;
    case 'w22': w[1][1] = v; break;
    case 'b1': b[0] = v; break;
    case 'b2': b[1] = v; break;
    case 'v1': out[0] = v; break;
    case 'v2': out[1] = v; break;
    case 'c': c = v; break;
  }
  return { w, b, v: out, c };
}

export function setInput(inputs: Inputs, index: 0 | 1, value: number): Inputs {
  const next: Inputs = [inputs[0], inputs[1]];
  next[index] = round1(clamp(value, 0, 1));
  return next;
}

/** Which arrow of the diagram a parameter belongs to, as a position in the edge list (biases belong to a neuron, so none). */
export function edgeOf(id: ParamId): number | null {
  switch (id) {
    case 'w11': return 0;
    case 'w12': return 1;
    case 'w21': return 2;
    case 'w22': return 3;
    case 'v1': return 4;
    case 'v2': return 5;
    default: return null;
  }
}

export function fmt(value: number, digits = 2): string {
  return (Math.round(value * 10 ** digits) / 10 ** digits).toFixed(digits);
}
