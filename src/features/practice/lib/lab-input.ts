import type { LabTask } from '../types';
import { wordCount } from './sanitize';

/**
 * When a lab prompt is worth running: long enough to be a prompt, and a real edit of the starter (not the starter handed back). Shared by the
 * screen (to enable Run) and the route (so a modified app can't spend a run on nothing). A comparison of prompts treats A as the baseline: it may
 * be the starter itself, and B has to be the edited one.
 */

export type LabInputProblem = 'lab_too_short' | 'lab_not_edited' | 'lab_same_prompts' | 'bad_prompts';
export type LabInputCheck = { ok: true } | { ok: false; reason: LabInputProblem; /** Which prompt (0 = A) the problem is about. */ index: number };

/** A prompt the learner is working to improve: a role, a task and a format take about this many words. */
export const MIN_LAB_PROMPT_WORDS = 8;
/** A comparison's baseline may be deliberately plain, but it is still a request. */
export const MIN_BASELINE_PROMPT_WORDS = 3;
/** Words added or removed against the starter before it counts as an edit; one polite word does not. */
export const MIN_REAL_EDIT_WORDS = 4;
/** Words that must differ between the two prompts of a comparison. */
export const MIN_DIFFERENT_WORDS = 2;

export const promptsPerRun = (lab: Pick<LabTask, 'compare'>): number => (lab.compare === 'prompts' ? 2 : 1);
export const outputsPerRun = (lab: Pick<LabTask, 'compare'>): number => (lab.compare ? 2 : 1);

const words = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

/** How many words differ between two texts, as a bag of words (order ignored, repeats counted). */
export function wordsChanged(a: string, b: string): number {
  const counts = new Map<string, number>();
  for (const word of words(a)) counts.set(word, (counts.get(word) ?? 0) + 1);
  for (const word of words(b)) counts.set(word, (counts.get(word) ?? 0) - 1);
  let changed = 0;
  for (const count of counts.values()) changed += Math.abs(count);
  return changed;
}

export function checkLabPrompts(lab: Pick<LabTask, 'compare' | 'starterPrompt'>, prompts: readonly string[]): LabInputCheck {
  if (prompts.length !== promptsPerRun(lab)) return { ok: false, reason: 'bad_prompts', index: 0 };
  const comparing = lab.compare === 'prompts';
  for (let index = 0; index < prompts.length; index += 1) {
    const text = prompts[index].trim();
    const baseline = comparing && index === 0;
    if (wordCount(text) < (baseline ? MIN_BASELINE_PROMPT_WORDS : MIN_LAB_PROMPT_WORDS)) return { ok: false, reason: 'lab_too_short', index };
    if (!baseline && wordsChanged(text, lab.starterPrompt) < MIN_REAL_EDIT_WORDS) return { ok: false, reason: 'lab_not_edited', index };
  }
  if (comparing && wordsChanged(prompts[0], prompts[1]) < MIN_DIFFERENT_WORDS) return { ok: false, reason: 'lab_same_prompts', index: 1 };
  return { ok: true };
}

/** Runs done so far, counted from the saved messages (a prompt is a user message), so the count can't disagree with what is saved. */
export const labRunsDone = (lab: Pick<LabTask, 'compare'>, messages: readonly { role: 'user' | 'assistant' }[]): number => Math.floor(messages.filter((message) => message.role === 'user').length / promptsPerRun(lab));

export type LabRunRecord = { prompts: string[]; outputs: string[] };

/**
 * The runs of a lab session, read back from its saved messages: each run is its prompt(s) then its output(s), in order. An incomplete tail (a
 * prompt saved without its output) is not a run.
 */
export function labRunsOf(lab: Pick<LabTask, 'compare'>, messages: readonly { role: 'user' | 'assistant'; text: string }[]): LabRunRecord[] {
  const prompts = promptsPerRun(lab);
  const outputs = outputsPerRun(lab);
  const size = prompts + outputs;
  const runs: LabRunRecord[] = [];
  for (let start = 0; start + size <= messages.length; start += size) {
    const chunk = messages.slice(start, start + size);
    if (chunk.slice(0, prompts).some((message) => message.role !== 'user') || chunk.slice(prompts).some((message) => message.role !== 'assistant')) break;
    runs.push({ prompts: chunk.slice(0, prompts).map((message) => message.text), outputs: chunk.slice(prompts).map((message) => message.text) });
  }
  return runs;
}
