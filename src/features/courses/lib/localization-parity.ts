/**
 * The rules a translated course must keep, checked against its English original. A Tagalog course is a
 * complete `Course` object (so TypeScript checks its shape), but only the words a learner reads may differ:
 * code, answers, ids, solutions, tests, links and numbers must be identical, or a translation could silently
 * change what an exercise accepts. `parityProblems` walks both trees and lists every difference that is not a
 * translatable text field.
 */

/** Keys whose string values are prose the translation is meant to change. */
const TEXT_KEYS = new Set([
  'title',
  'tagline',
  'description',
  'finishLine',
  'label',
  'summary',
  'text',
  'items',
  'caption',
  'steps',
  'why',
  'objectives',
  'prompt',
  'explanation',
  'hints',
  'story',
  'conceptLabel',
  'term',
  'definition',
  'note',
  'consequence',
  'situation',
  'feedback',
  'front',
  'back',
  'lineNote',
  'placeholder',
  'hint',
  'rubric',
  'body',
  'reasons',
  'headers',
  'rows',
  'terms',
  'meanings',
  'plans',
  'outcome',
]);

/** Fields a translation may add that the English original doesn't have. */
const FIL_ONLY_KEYS = new Set(['conceptLabel']);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

type Context = { translatable: boolean; protectChoices: boolean };

/** Differences between `en` and `fil` outside translatable text, as readable lines ("lessons[2].quiz[0].answer: 1 ≠ 2"). */
export function parityProblems(en: unknown, filInput: unknown, root = 'course'): string[] {
  // A translation that carries the level pieces must match the WHOLE English course (every level block, question, activity and step, in the
  // same places); one that doesn't (the starter) is compared with the shared part only, as before.
  return compare(hasLevelPieces(filInput) ? en : sharedOnly(en), filInput, root);
}

/** Whether a (translated) value carries any level piece: an `audience`, `taskExtra` or `rubricExtra` anywhere in it. */
export function hasLevelPieces(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasLevelPieces);
  if (value && typeof value === 'object') return Object.entries(value as Record<string, unknown>).some(([key, item]) => key === 'audience' || key === 'taskExtra' || key === 'rubricExtra' || hasLevelPieces(item));
  return false;
}

/**
 * The English course without its level pieces (anything carrying an `audience`, plus `taskExtra` and `rubricExtra`). A translation
 * without them gives the Tagalog learner the whole shared lesson, which stands on its own by rule (`lessonStructureProblems`), so it is
 * compared with the shared part of the English one (see `parityProblems`: a translation WITH the level pieces is compared with all of it).
 */
export function sharedOnly(value: unknown): unknown {
  if (Array.isArray(value)) return value.filter((item) => !(item && typeof item === 'object' && 'audience' in item)).map(sharedOnly);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (key === 'taskExtra' || key === 'rubricExtra') continue;
      out[key] = sharedOnly(item);
    }
    return out;
  }
  return value;
}

function compare(en: unknown, fil: unknown, root: string): string[] {
  const problems: string[] = [];
  const walk = (a: unknown, b: unknown, path: string, key: string | null, context: Context) => {
    if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b) || (a === null) !== (b === null)) {
      problems.push(`${path}: shape differs (${typeof a} vs ${typeof b})`);
      return;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        problems.push(`${path}: ${a.length} items in English, ${b.length} in Tagalog`);
        return;
      }
      a.forEach((item, index) => walk(item, b[index], `${path}[${index}]`, key, context));
      return;
    }
    if (isRecord(a) && isRecord(b)) {
      // The values of a map keyed by an answer (wrongNotes) are prose; its keys are the program's output and must match.
      const isNotesMap = key === 'wrongNotes';
      const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
      for (const name of keys) {
        if (!(name in a)) {
          if (!FIL_ONLY_KEYS.has(name)) problems.push(`${path}.${name}: not in the English original`);
          continue;
        }
        if (!(name in b)) {
          problems.push(`${path}.${name}: missing in Tagalog`);
          continue;
        }
        // A predict-output activity's `choices` are program output; a quiz question's are prose.
        const protectChoices = a.kind === 'predict-output' ? true : context.protectChoices && !('answer' in a);
        const translatable = isNotesMap ? true : TEXT_KEYS.has(name) || (name === 'choices' && !protectChoices);
        walk(a[name], b[name], `${path}.${name}`, name, { translatable, protectChoices });
      }
      return;
    }
    if (typeof a === 'string') {
      if (!context.translatable && a !== b) problems.push(`${path}: changed (${JSON.stringify(a.slice(0, 50))} → ${JSON.stringify(String(b).slice(0, 50))})`);
      else if (context.translatable && a.trim() !== '' && String(b).trim() === '') problems.push(`${path}: empty in Tagalog`);
      return;
    }
    if (a !== b) problems.push(`${path}: ${String(a)} ≠ ${String(b)}`);
  };
  walk(en, fil, root, null, { translatable: false, protectChoices: false });
  return problems;
}

/**
 * English left in a translation, or wording the style guide bans. Heuristic on purpose: it catches a paragraph
 * pasted untranslated and the stiff words the owner ruled out; it never reads code (only the translatable text
 * fields are passed in).
 */
const ENGLISH_WORDS = /\b(the|and|you|your|with|that|this|are|for|from|will|can|when|what|into|about|should|because)\b/gi;
export const BANNED_FORMAL = ['nakumpleto', 'matagumpay', 'paglalakbay', 'pagkatuto', 'ninyo', ' po ', ' po,', ' po.', 'kasanayan sa'];

export function textProblems(text: string, where: string): string[] {
  const problems: string[] = [];
  // Backticked code and bold markers aren't prose: drop them before counting English words.
  const prose = text.replace(/`[^`]*`/g, ' ').replace(/\*\*/g, '').replace(/https?:\/\/\S+/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean);
  const english = prose.match(ENGLISH_WORDS)?.length ?? 0;
  if (words.length >= 8 && english / words.length > 0.2) problems.push(`${where}: looks untranslated (${english} English words of ${words.length})`);
  const lower = ` ${prose.toLowerCase()} `;
  for (const word of BANNED_FORMAL) if (lower.includes(word)) problems.push(`${where}: uses "${word.trim()}", too formal (see the style guide)`);
  return problems;
}

/** Every translatable string in a value, with its path, for `textProblems`. */
export function translatableStrings(value: unknown, path = 'course', key: string | null = null, protect = false): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = [];
  const walk = (node: unknown, where: string, nodeKey: string | null, translatable: boolean, protectChoices: boolean) => {
    if (typeof node === 'string') {
      if (translatable) out.push({ path: where, text: node });
    } else if (Array.isArray(node)) node.forEach((item, index) => walk(item, `${where}[${index}]`, nodeKey, translatable, protectChoices));
    else if (isRecord(node)) {
      for (const [name, child] of Object.entries(node)) {
        const keep = node.kind === 'predict-output' ? true : protectChoices && !('answer' in node);
        const isText = nodeKey === 'wrongNotes' ? true : TEXT_KEYS.has(name) || (name === 'choices' && !keep);
        walk(child, `${where}.${name}`, name, isText, keep);
      }
    }
  };
  walk(value, path, key, false, protect);
  return out;
}
