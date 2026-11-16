/**
 * A small, dependency-free syntax highlighter for the lesson and chat code blocks. It colors the
 * things a beginner needs to see (comments, strings, numbers, keywords, function calls) and leaves
 * everything else plain. It never throws and never drops text: joining every token's text gives the
 * input back, whatever the language or the mistakes in the code.
 */

export type TokenKind = 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'punctuation' | 'plain';
export type Token = { text: string; kind: TokenKind };

type Rule = { kind: TokenKind; pattern: RegExp };

const JS_KEYWORDS = 'const let var function return if else for while do switch case break continue new class extends import from export default async await try catch finally throw typeof instanceof in of this super null undefined true false void yield static get set interface type enum implements public private protected readonly as';
const PY_KEYWORDS = 'def return if elif else for while in not and or is None True False class import from as with try except finally raise lambda pass break continue yield global nonlocal async await del assert print';
const SH_KEYWORDS = 'if then else elif fi for do done while case esac function in echo cd ls cat npm npx git export sudo curl';
const SQL_KEYWORDS = 'select from where insert into values update set delete create table drop alter join left right inner outer on group by order having limit as and or not null primary key foreign references distinct count sum avg min max like in is';
const CSS_KEYWORDS = 'display flex grid color background margin padding border font width height position top left right bottom';
const HTML_KEYWORDS = 'html head body div span p a img ul ol li h1 h2 h3 button input form script style link meta title';

const words = (list: string, flags = '') => new RegExp(`\\b(?:${list.split(' ').join('|')})\\b`, flags);

const COMMON: Rule[] = [
  { kind: 'number', pattern: /\b\d+(?:\.\d+)?\b/y },
  { kind: 'punctuation', pattern: /[{}()[\];,.:<>=+\-*/%!&|?^~]+/y },
];

const LANGUAGES: Record<string, Rule[]> = {
  js: [
    { kind: 'comment', pattern: /\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y },
    { kind: 'string', pattern: /`(?:\\[\s\S]|[^`\\])*(?:`|$)|"(?:\\.|[^"\\\n])*(?:"|$)|'(?:\\.|[^'\\\n])*(?:'|$)/y },
    { kind: 'keyword', pattern: new RegExp(words(JS_KEYWORDS).source, 'y') },
    { kind: 'function', pattern: /[A-Za-z_$][\w$]*(?=\()/y },
    ...COMMON,
  ],
  python: [
    { kind: 'comment', pattern: /#[^\n]*/y },
    { kind: 'string', pattern: /"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*(?:"|$)|'(?:\\.|[^'\\\n])*(?:'|$)/y },
    { kind: 'keyword', pattern: new RegExp(words(PY_KEYWORDS).source, 'y') },
    { kind: 'function', pattern: /[A-Za-z_][\w]*(?=\()/y },
    ...COMMON,
  ],
  json: [
    { kind: 'function', pattern: /"(?:\\.|[^"\\\n])*"(?=\s*:)/y },
    { kind: 'string', pattern: /"(?:\\.|[^"\\\n])*(?:"|$)/y },
    { kind: 'keyword', pattern: /\b(?:true|false|null)\b/y },
    ...COMMON,
  ],
  shell: [
    { kind: 'comment', pattern: /#[^\n]*/y },
    { kind: 'string', pattern: /"(?:\\.|[^"\\\n])*(?:"|$)|'[^'\n]*(?:'|$)/y },
    { kind: 'keyword', pattern: new RegExp(words(SH_KEYWORDS).source, 'y') },
    { kind: 'function', pattern: /--?[A-Za-z][\w-]*/y },
    ...COMMON,
  ],
  sql: [
    { kind: 'comment', pattern: /--[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y },
    { kind: 'string', pattern: /'(?:''|[^'])*(?:'|$)/y },
    { kind: 'keyword', pattern: new RegExp(words(SQL_KEYWORDS, 'i').source, 'iy') },
    ...COMMON,
  ],
  html: [
    { kind: 'comment', pattern: /<!--[\s\S]*?(?:-->|$)/y },
    { kind: 'string', pattern: /"[^"\n]*(?:"|$)|'[^'\n]*(?:'|$)/y },
    { kind: 'keyword', pattern: new RegExp(`(?<=</?)(?:${HTML_KEYWORDS.split(' ').join('|')})\\b`, 'y') },
    { kind: 'function', pattern: /[a-z-]+(?==)/y },
    ...COMMON,
  ],
  css: [
    { kind: 'comment', pattern: /\/\*[\s\S]*?(?:\*\/|$)/y },
    { kind: 'string', pattern: /"[^"\n]*(?:"|$)|'[^'\n]*(?:'|$)/y },
    { kind: 'keyword', pattern: new RegExp(words(CSS_KEYWORDS).source, 'y') },
    { kind: 'number', pattern: /#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw)?/y },
    ...COMMON.slice(1),
  ],
};

const ALIASES: Record<string, string> = {
  javascript: 'js', jsx: 'js', ts: 'js', typescript: 'js', tsx: 'js', node: 'js', java: 'js', csharp: 'js', cs: 'js', swift: 'js', kotlin: 'js', go: 'js',
  py: 'python', python3: 'python',
  bash: 'shell', sh: 'shell', zsh: 'shell', terminal: 'shell', console: 'shell',
  postgres: 'sql', sqlite: 'sql', mysql: 'sql',
  htm: 'html', xml: 'html',
};

/** The language key the highlighter knows for a code fence's label, or null for plain text. */
export function languageKey(language: string | undefined | null): string | null {
  const name = (language ?? '').trim().toLowerCase();
  if (!name) return null;
  const key = ALIASES[name] ?? name;
  return key in LANGUAGES ? key : null;
}

/** Splits code into colored tokens. An unknown language comes back as one plain token. */
export function highlight(code: string, language?: string | null): Token[] {
  const key = languageKey(language);
  if (!key) return code === '' ? [] : [{ text: code, kind: 'plain' }];
  const rules = LANGUAGES[key];
  const tokens: Token[] = [];
  let plain = '';
  const flush = () => {
    if (plain) tokens.push({ text: plain, kind: 'plain' });
    plain = '';
  };
  let index = 0;
  while (index < code.length) {
    let matched: { kind: TokenKind; text: string } | null = null;
    for (const rule of rules) {
      rule.pattern.lastIndex = index;
      const found = rule.pattern.exec(code);
      if (found && found.index === index && found[0].length > 0) {
        matched = { kind: rule.kind, text: found[0] };
        break;
      }
    }
    if (matched) {
      flush();
      tokens.push(matched);
      index += matched.text.length;
    } else {
      // Identifiers are taken whole, so a keyword inside a longer name ("constant") isn't colored.
      const word = /[A-Za-z_$][\w$]*/y;
      word.lastIndex = index;
      const found = word.exec(code);
      const length = found && found.index === index ? found[0].length : 1;
      plain += code.slice(index, index + length);
      index += length;
    }
  }
  flush();
  return tokens;
}

/** The zero-width non-joiner: invisible, and it stops two neighbouring glyphs from fusing into a ligature. */
const ZWNJ = '‌';
const SYMBOL_PAIR = /(?<=[<>=!+\-*/&|:.?~^%#@$\\])(?=[<>=!+\-*/&|:.?~^%#@$\\])/g;

/**
 * JetBrains Mono draws `<=` as one `≤` and `++` as one mark. For a beginner who must type exactly what
 * they read, that is wrong: this puts an invisible separator between neighbouring symbol characters of
 * the text that is *shown* (the copied or edited text stays as it was), so every character is drawn on its own.
 */
export function breakLigatures(text: string): string {
  return text.replace(SYMBOL_PAIR, ZWNJ);
}
