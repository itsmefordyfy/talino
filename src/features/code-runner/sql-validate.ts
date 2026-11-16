/**
 * Decides whether a learner's text is one harmless SELECT. It reads the text the way SQLite does
 * (strings, quoted names and comments are skipped, so nothing can hide in them) and refuses
 * everything that is not a read: more than one statement, writes, schema changes, PRAGMA,
 * ATTACH, extensions, and recursion that might never end.
 */
import { defaultRunnerText, type RunnerText } from './strings';

type Token = { kind: 'word' | 'string' | 'ident' | 'number' | 'punct'; text: string; start: number };

export type SqlAnalysis = { ok: true; sql: string; hasLimit: boolean } | { ok: false; reason: string };

const FORBIDDEN: ReadonlySet<string> = new Set([
  'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'VACUUM', 'PRAGMA', 'ATTACH', 'DETACH', 'REINDEX', 'ANALYZE',
  'BEGIN', 'COMMIT', 'ROLLBACK', 'SAVEPOINT', 'RELEASE', 'EXPLAIN', 'TRIGGER', 'VIRTUAL', 'LOAD_EXTENSION', 'ZEROBLOB', 'RANDOMBLOB',
  'READFILE', 'WRITEFILE', 'FTS3_TOKENIZER', 'EDIT',
]);

const WORD_START = /[A-Za-z_]/;
const WORD_PART = /[A-Za-z0-9_$]/;

function tokenize(source: string, text: RunnerText = defaultRunnerText): { tokens: Token[]; comments: [number, number][] } | string {
  const tokens: Token[] = [];
  const comments: [number, number][] = [];
  let i = 0;
  const n = source.length;
  while (i < n) {
    const c = source[i];
    if (/\s/.test(c)) {
      i++;
    } else if (c === '-' && source[i + 1] === '-') {
      let end = source.indexOf('\n', i);
      if (end === -1) end = n;
      comments.push([i, end]);
      i = end;
    } else if (c === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2);
      if (end === -1) return text.sql.commentOpen;
      comments.push([i, end + 2]);
      i = end + 2;
    } else if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      for (;;) {
        if (j >= n) return c === "'" ? text.sql.textOpen : text.sql.nameOpen;
        if (source[j] === c) {
          if (source[j + 1] === c) j += 2;
          else break;
        } else j++;
      }
      tokens.push({ kind: c === "'" ? 'string' : 'ident', text: source.slice(i, j + 1), start: i });
      i = j + 1;
    } else if (c === '[') {
      const end = source.indexOf(']', i + 1);
      if (end === -1) return text.sql.bracketOpen;
      tokens.push({ kind: 'ident', text: source.slice(i, end + 1), start: i });
      i = end + 1;
    } else if (WORD_START.test(c)) {
      let j = i + 1;
      while (j < n && WORD_PART.test(source[j])) j++;
      tokens.push({ kind: 'word', text: source.slice(i, j), start: i });
      i = j;
    } else if (/[0-9]/.test(c)) {
      let j = i + 1;
      while (j < n && /[0-9A-Za-z_.]/.test(source[j])) j++;
      tokens.push({ kind: 'number', text: source.slice(i, j), start: i });
      i = j;
    } else {
      tokens.push({ kind: 'punct', text: c, start: i });
      i++;
    }
  }
  return { tokens, comments };
}

/** Validates `query` and returns the text to run: comments blanked out, one trailing `;` removed. */
export function analyzeSelect(query: string, text: RunnerText = defaultRunnerText): SqlAnalysis {
  if (typeof query !== 'string' || query.trim() === '') return { ok: false, reason: text.sql.writeSelect };
  if (query.length > 5000) return { ok: false, reason: text.sql.tooLong };
  if (query.includes('\u0000')) return { ok: false, reason: text.sql.badCharacter };
  const lexed = tokenize(query, text);
  if (typeof lexed === 'string') return { ok: false, reason: lexed };
  const { tokens, comments } = lexed;
  if (tokens.length === 0) return { ok: false, reason: text.sql.writeSelect };

  const semicolon = tokens.findIndex((t) => t.kind === 'punct' && t.text === ';');
  if (semicolon !== -1 && semicolon !== tokens.length - 1) return { ok: false, reason: text.sql.oneStatement };
  const body = semicolon === -1 ? tokens : tokens.slice(0, -1);
  if (body.length === 0) return { ok: false, reason: text.sql.writeSelect };

  const first = body[0];
  const firstWord = first.kind === 'word' ? first.text.toUpperCase() : '';
  if (firstWord !== 'SELECT' && firstWord !== 'WITH') {
    return { ok: false, reason: text.sql.onlySelect(first.text.slice(0, 20)) };
  }
  let depth = 0;
  let hasLimit = false;
  let hasSelect = false;
  for (let i = 0; i < body.length; i++) {
    const t = body[i];
    if (t.kind === 'punct') {
      if (t.text === '(') depth++;
      else if (t.text === ')') depth--;
      continue;
    }
    if (t.kind !== 'word') continue;
    const word = t.text.toUpperCase();
    if (word === 'SELECT') hasSelect = true;
    if (word === 'LIMIT' && depth === 0) hasLimit = true;
    if (word === 'RECURSIVE') return { ok: false, reason: text.sql.recursive };
    if (word === 'REPLACE' && !(body[i + 1]?.kind === 'punct' && body[i + 1].text === '(')) {
      return { ok: false, reason: text.sql.replaceFunction };
    }
    if (FORBIDDEN.has(word)) return { ok: false, reason: text.sql.forbidden(word) };
  }
  if (!hasSelect) return { ok: false, reason: text.sql.withNeedsSelect };

  // Blank the comments out so what runs is exactly what was checked.
  let sql = '';
  let at = 0;
  for (const [from, to] of comments) {
    sql += `${query.slice(at, from)} `;
    at = to;
  }
  sql += query.slice(at);
  if (semicolon !== -1) {
    const cut = sql.lastIndexOf(';');
    sql = sql.slice(0, cut) + sql.slice(cut + 1);
  }
  return { ok: true, sql: sql.trim(), hasLimit };
}

export function validateSelect(query: string, text: RunnerText = defaultRunnerText): { ok: true } | { ok: false; reason: string } {
  try {
    const analysis = analyzeSelect(query, text);
    return analysis.ok ? { ok: true } : { ok: false, reason: analysis.reason };
  } catch {
    return { ok: false, reason: text.sql.unreadable };
  }
}

/** Setup text may only create tables, views, indexes and insert rows. Throws when it does anything else. */
export function assertSetupSql(setupSql: string) {
  const lexed = tokenize(setupSql);
  if (typeof lexed === 'string') throw new Error(`Invalid setup SQL: ${lexed}`);
  let statementStart = true;
  const { tokens } = lexed;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.kind === 'punct' && t.text === ';') {
      statementStart = true;
      continue;
    }
    if (!statementStart) continue;
    statementStart = false;
    const a = t.text.toUpperCase();
    const b = tokens[i + 1]?.text.toUpperCase() ?? '';
    const ok = (a === 'CREATE' && (b === 'TABLE' || b === 'VIEW' || b === 'INDEX')) || (a === 'INSERT' && b === 'INTO');
    if (!ok) throw new Error(`Invalid setup SQL: only CREATE TABLE/VIEW/INDEX and INSERT INTO are allowed, found "${a} ${b}".`);
  }
}
