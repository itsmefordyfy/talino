import type { LabTask, LabTool } from '../types';
import { cleanText } from './sanitize';

/**
 * Tool use in a lab, kept safe: the model may call a tool only from the lab's list, and the server answers **only from that tool's fixtures** (never
 * the network, never code from the phone). A call whose arguments match no fixture gets `{ error: "not found" }`, so an honest "I could not find it"
 * can be told from a guess. The steps the model took are returned as a trace the app draws.
 */

export type ToolValue = string | number | boolean;
export type ToolStep = { tool: string; arguments: Record<string, string | number>; result: Record<string, ToolValue> };

/** The model may ask for tools in at most this many rounds; the last round is asked to answer without them. */
export const MAX_TOOL_ROUNDS = 3;
/** Calls answered from one reply; any more in the same reply are ignored. */
export const MAX_CALLS_PER_ROUND = 3;
/** Steps kept in a trace (2 rounds with tools, 3 calls each). */
export const MAX_TOOL_STEPS = (MAX_TOOL_ROUNDS - 1) * MAX_CALLS_PER_ROUND;

const MAX_ARG_CHARS = 200;
const MAX_RESULT_CHARS = 300;
const NOT_FOUND: Record<string, ToolValue> = { error: 'not found' };

type Declaration = { name: string; description: string; parameters: { type: 'OBJECT'; properties: Record<string, { type: 'STRING' | 'NUMBER'; description: string }>; required: string[] } };

/** The tools in Gemini's function-declaration shape. Fixtures are never part of it. */
export const toolDeclarations = (tools: readonly LabTool[]): Declaration[] =>
  tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: {
      type: 'OBJECT',
      properties: Object.fromEntries(tool.params.map((param) => [param.name, { type: param.type === 'number' ? ('NUMBER' as const) : ('STRING' as const), description: param.description }])),
      required: tool.params.map((param) => param.name),
    },
  }));

const loose = (value: string): string => value.toLowerCase().replace(/\s+/g, ' ').trim();

/** The arguments the tool declares, as the right types; anything it does not declare is dropped. */
function cleanArguments(tool: LabTool, args: unknown): Record<string, string | number> {
  if (typeof args !== 'object' || args === null || Array.isArray(args)) return {};
  const given = args as Record<string, unknown>;
  const clean: Record<string, string | number> = {};
  for (const param of tool.params) {
    const value = given[param.name];
    if (param.type === 'number') {
      const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
      if (Number.isFinite(number)) clean[param.name] = number;
    } else if (typeof value === 'string' || typeof value === 'number') {
      const text = cleanText(String(value), MAX_ARG_CHARS);
      if (text) clean[param.name] = text;
    }
  }
  return clean;
}

const sameArgument = (fixture: string | number, given: string | number): boolean => (typeof fixture === 'number' ? Number(given) === fixture : loose(String(given)) === loose(String(fixture)));

/** Runs one call against the lab's fixtures. Never throws; an unknown tool or arguments are "not found". */
export function runLabTool(lab: Pick<LabTask, 'tools'>, name: unknown, args: unknown): ToolStep {
  const tool = (lab.tools ?? []).find((candidate) => candidate.name === name);
  if (!tool) return { tool: cleanText(name, 60), arguments: {}, result: { ...NOT_FOUND } };
  const clean = cleanArguments(tool, args);
  const hit = tool.fixtures.find((fixture) => {
    const keys = Object.keys(fixture.args);
    return keys.length === Object.keys(clean).length && keys.every((key) => key in clean && sameArgument(fixture.args[key], clean[key]));
  });
  return { tool: tool.name, arguments: clean, result: hit ? { ...hit.result } : { ...NOT_FOUND } };
}

function scalarRecord(value: unknown): Record<string, ToolValue> {
  const clean: Record<string, ToolValue> = {};
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return clean;
  for (const [key, item] of Object.entries(value as Record<string, unknown>).slice(0, 12)) {
    if (typeof item === 'string') clean[cleanText(key, 40)] = cleanText(item, MAX_RESULT_CHARS);
    else if (typeof item === 'boolean' || (typeof item === 'number' && Number.isFinite(item))) clean[cleanText(key, 40)] = item;
  }
  return clean;
}

function stepOf(value: unknown): { tool: string; arguments: Record<string, string | number>; result: Record<string, ToolValue> } | null {
  if (typeof value !== 'object' || value === null) return null;
  const entry = value as Record<string, unknown>;
  const tool = cleanText(entry.tool, 60);
  if (!tool) return null;
  const args: Record<string, string | number> = {};
  for (const [key, item] of Object.entries(scalarRecord(entry.arguments))) if (typeof item === 'string' || typeof item === 'number') args[key] = item;
  return { tool, arguments: args, result: scalarRecord(entry.result) };
}

/** The trace the phone sends back with a review: only the lab's own tools, scalar values, capped. It is data for the reviewer, never trusted. */
export function sanitizeToolSteps(lab: Pick<LabTask, 'tools'>, value: unknown): ToolStep[] {
  if (!Array.isArray(value)) return [];
  const names = new Set((lab.tools ?? []).map((tool) => tool.name));
  return value
    .slice(0, MAX_TOOL_STEPS)
    .map(stepOf)
    .filter((step): step is ToolStep => step !== null && names.has(step.tool));
}

/** A trace as the phone reads it back from the route (shape only). */
export const readToolSteps = (value: unknown): ToolStep[] =>
  (Array.isArray(value) ? value.slice(0, MAX_TOOL_STEPS) : []).map(stepOf).filter((step): step is ToolStep => step !== null);
