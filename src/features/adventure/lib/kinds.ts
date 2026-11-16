/**
 * The kinds of in-lesson activity the game layer knows about. The activity screens (built elsewhere)
 * use these ids; a new kind is added here, in `xp.ts` (its base XP) and, if it counts toward an
 * achievement, in the sets below.
 */
export const ACTIVITY_KINDS = [
  'tap-reveal',
  'predict-output',
  'fix-bug',
  'arrange',
  'fill-blank',
  'match',
  'scenario',
  'code-challenge',
  'sql-challenge',
] as const;

export type ActivityKind = (typeof ACTIVITY_KINDS)[number];

export function isActivityKind(value: unknown): value is ActivityKind {
  return typeof value === 'string' && (ACTIVITY_KINDS as readonly string[]).includes(value);
}

/** Logic activities: reasoning about what code or a situation does (the Logic Master achievement). */
export const LOGIC_KINDS: ReadonlySet<ActivityKind> = new Set<ActivityKind>(['predict-output', 'arrange', 'scenario']);

/** Activities that run or write code (the Code Explorer achievement counts the languages they use). */
export const CODE_KINDS: ReadonlySet<ActivityKind> = new Set<ActivityKind>(['code-challenge', 'sql-challenge']);

/**
 * The language a code activity is in, for the Code Explorer achievement. There is no language column
 * in the database, so the convention is: a `sql-challenge` is always `sql`; a `code-challenge` is
 * `js` (the in-app sandbox runs a JavaScript subset) unless its id carries a language segment, e.g.
 * `developer-07-python-2` or `starter-03-js-1` (`<lesson id>-<language>-<n>`). Known aliases are
 * folded (`javascript` -> `js`, `py` -> `python`, `typescript` -> `ts`). Anything else is not a
 * language, so an arbitrary id can never invent a new one.
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'js',
  javascript: 'js',
  ts: 'ts',
  typescript: 'ts',
  python: 'python',
  py: 'python',
  sql: 'sql',
  html: 'html',
  css: 'css',
  bash: 'bash',
  shell: 'bash',
  json: 'json',
  java: 'java',
  go: 'go',
  rust: 'rust',
  csharp: 'csharp',
};

export function activityLanguage(kind: string, activityId: string): string | null {
  if (kind === 'sql-challenge') return 'sql';
  if (kind !== 'code-challenge') return null;
  for (const segment of activityId.toLowerCase().split('-')) {
    const language = LANGUAGE_ALIASES[segment];
    if (language) return language;
  }
  return 'js';
}
