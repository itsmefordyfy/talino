import type { LabTask } from '../types';
import { leaksLabFraming } from './guard';
import { checkLabOutput, readLabCheck, type LabCheckResult } from './lab-check';
import { readToolSteps, type ToolStep } from './lab-tools';
import { cleanText, MAX_LAB_OUTPUT_CHARS } from './sanitize';

/**
 * One live run of a lab as the route returns it and the phone reads it. Everything in it is measured or made by code: the text is whatever the
 * model said (capped, never edited), the tokens and the time come from the API response and the clock, the field check is code, and the tool
 * steps are the trace of what the fixtures answered. Nothing here is a ranking of models.
 */

export type LabOutput = {
  /** A for a single run; A and B for a comparison. */
  label: 'A' | 'B';
  output: string;
  format: 'text' | 'json';
  /** Only for a JSON lab: which fields passed. The key's values are never here. */
  check?: LabCheckResult;
  tokens: { input: number; output: number };
  latencyMs: number;
  /** The model that answered, for a comparison of models only. */
  model?: string;
  /** What the model asked its tools and what they answered, in order, for a tool-use lab. */
  toolSteps?: ToolStep[];
};

export type LabRun = { outputs: LabOutput[] };

export type BuildLabOutputInput = {
  lab: LabTask;
  label: 'A' | 'B';
  text: string;
  tokens: { input?: number; output?: number };
  latencyMs: number;
  model?: string;
  steps?: ToolStep[];
};

const count = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : 0);

/** The run's output, checked: null when the model repeated the lab's own framing (the route then gives the allowance back). */
export function buildLabOutput({ lab, label, text, tokens, latencyMs, model, steps }: BuildLabOutputInput): LabOutput | null {
  const output = cleanText(text, MAX_LAB_OUTPUT_CHARS);
  if (!output || leaksLabFraming(output, lab)) return null;
  const json = lab.output.format === 'json';
  return {
    label,
    output,
    format: json ? 'json' : 'text',
    ...(lab.output.format === 'json' ? { check: checkLabOutput(output, lab.output.fields) } : {}),
    tokens: { input: count(tokens.input), output: count(tokens.output) },
    latencyMs: count(latencyMs),
    ...(model ? { model } : {}),
    ...(steps && steps.length > 0 ? { toolSteps: steps } : {}),
  };
}

function outputOf(value: unknown): LabOutput | null {
  if (typeof value !== 'object' || value === null) return null;
  const entry = value as Record<string, unknown>;
  const output = cleanText(entry.output, MAX_LAB_OUTPUT_CHARS);
  const tokens = typeof entry.tokens === 'object' && entry.tokens !== null ? (entry.tokens as Record<string, unknown>) : {};
  if ((entry.label !== 'A' && entry.label !== 'B') || !output || (entry.format !== 'text' && entry.format !== 'json')) return null;
  const check = readLabCheck(entry.check);
  const steps = readToolSteps(entry.toolSteps);
  return {
    label: entry.label,
    output,
    format: entry.format,
    ...(check ? { check } : {}),
    tokens: { input: count(tokens.input), output: count(tokens.output) },
    latencyMs: count(entry.latencyMs),
    ...(typeof entry.model === 'string' ? { model: cleanText(entry.model, 80) } : {}),
    ...(steps.length > 0 ? { toolSteps: steps } : {}),
  };
}

/** A run as the phone reads it back from the route: one or two outputs, each well-formed; null when anything is damaged. */
export function readLabRun(value: unknown): LabRun | null {
  if (typeof value !== 'object' || value === null || !Array.isArray((value as Record<string, unknown>).outputs)) return null;
  const list = (value as { outputs: unknown[] }).outputs;
  if (list.length < 1 || list.length > 2) return null;
  const outputs = list.map(outputOf);
  return outputs.every((output): output is LabOutput => output !== null) ? { outputs } : null;
}
