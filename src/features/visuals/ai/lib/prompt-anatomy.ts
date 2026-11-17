/**
 * Prompt anatomy for one fixed scenario: six parts of a prompt that can each be on or off. The checklist is computed from which parts are on, and the note on
 * how the kind of answer changes is hand-written for each combination of the three parts that shape an answer most (context, format, limits). Nothing here
 * calls a model: the notes are illustrations.
 */

export const PART_IDS = ['role', 'context', 'task', 'format', 'constraints', 'example'] as const;
export type PartId = (typeof PART_IDS)[number];
export type PartSelection = Record<PartId, boolean>;

/** The order the parts appear in the assembled prompt (the same as `PART_IDS`: who, what you know, what to do, how, limits, a sample). */
export const START_SELECTION: PartSelection = { role: false, context: false, task: true, format: false, constraints: false, example: false };
export const ALL_ON: PartSelection = { role: true, context: true, task: true, format: true, constraints: true, example: true };

export function togglePart(selection: PartSelection, id: PartId): PartSelection {
  return { ...selection, [id]: !selection[id] };
}

export const onCount = (selection: PartSelection): number => PART_IDS.filter((id) => selection[id]).length;

export type PromptLine = { id: PartId; text: string };

/** The prompt as the parts that are on, in order, one line each, and as one text (blank line between parts is not added: each part is a sentence or two). */
export function assemblePrompt(selection: PartSelection, texts: Readonly<Record<PartId, string>>): { lines: PromptLine[]; text: string } {
  const lines = PART_IDS.filter((id) => selection[id]).map((id) => ({ id, text: texts[id] }));
  return { lines, text: lines.map((line) => line.text).join('\n') };
}

/** One check per part: each answers "is this said?", and `why` (in the strings) explains what the AI has to guess when it is not. */
export const CHECK_IDS = ['task', 'audience', 'format', 'limits', 'role', 'example'] as const;
export type CheckId = (typeof CHECK_IDS)[number];

/** Which part says each thing. The audience lives in the context part: the scenario's context names who the message is for. */
export const CHECK_PART: Record<CheckId, PartId> = { task: 'task', audience: 'context', format: 'format', limits: 'constraints', role: 'role', example: 'example' };

export type CheckItem = { id: CheckId; passed: boolean };

export function clarityChecklist(selection: PartSelection): CheckItem[] {
  return CHECK_IDS.map((id) => ({ id, passed: selection[CHECK_PART[id]] }));
}

export type ClarityLevel = 'vague' | 'fair' | 'strong';

/** 5 or 6 of 6 is strong, 3 or 4 fair, fewer vague; with no task there is nothing to be clear about, so it is vague whatever else is on. */
export function clarityLevel(selection: PartSelection): { passed: number; total: number; level: ClarityLevel } {
  const items = clarityChecklist(selection);
  const passed = items.filter((item) => item.passed).length;
  const level: ClarityLevel = !selection.task ? 'vague' : passed >= 5 ? 'strong' : passed >= 3 ? 'fair' : 'vague';
  return { passed, total: items.length, level };
}

/** The three-bit key of the parts that shape an answer most: context, format, limits (`1` = on). */
export type BaseKey = '000' | '100' | '010' | '001' | '110' | '101' | '011' | '111';
export const BASE_KEYS: readonly BaseKey[] = ['000', '100', '010', '001', '110', '101', '011', '111'];

export type AnswerProfile = { base: BaseKey | 'no-task'; role: boolean; example: boolean };

export function answerProfile(selection: PartSelection): AnswerProfile {
  const key = `${selection.context ? 1 : 0}${selection.format ? 1 : 0}${selection.constraints ? 1 : 0}` as BaseKey;
  return { base: selection.task ? key : 'no-task', role: selection.role, example: selection.example };
}
