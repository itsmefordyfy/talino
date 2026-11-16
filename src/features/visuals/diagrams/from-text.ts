import type { DiagramResult } from './types';
import { validateDiagram } from './validate';

/** The JSON text inside a ```json fence if there is one, otherwise the text itself. AI answers often wrap JSON in a fence. */
export function extractJson(text: string): string {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  return (fenced ? fenced[1] : text).trim();
}

/** Reads a diagram from JSON text (optionally fenced) or an already parsed value, then validates it. Never throws. */
export function parseDiagramJson(input: unknown): DiagramResult {
  if (typeof input !== 'string') return validateDiagram(input);
  if (input.length > 40_000) return { ok: false, errors: ['The diagram data is too large'] };
  try {
    return validateDiagram(JSON.parse(extractJson(input)));
  } catch {
    return { ok: false, errors: ['The diagram data is not valid JSON'] };
  }
}

/** A plain-text summary to show when a diagram cannot be drawn: only a string `summary`, trimmed, single-spaced and clipped. */
export function fallbackSummary(input: unknown): string | null {
  try {
    const value = typeof input === 'string' ? JSON.parse(extractJson(input)) : input;
    if (typeof value !== 'object' || value === null) return null;
    const summary = (value as { summary?: unknown }).summary;
    if (typeof summary !== 'string') return null;
    const clean = summary.replace(/[\u0000-\u001F\u007F-\u009F]+/g, ' ').replace(/\s+/g, ' ').trim();
    return clean.length > 0 ? clean.slice(0, 400) : null;
  } catch {
    return null;
  }
}
