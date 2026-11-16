import type { LessonBlock } from '@/features/courses/content/types';

/**
 * Tali's reply (the simple Markdown the prompt allows) as lesson blocks, so replies draw like the
 * lesson cards, with Copy on code. Headings (#..####), bullet and numbered lists, fenced code,
 * pipe tables (a header row, a divider row, then rows), paragraphs. An unclosed fence (a reply cut off) still shows its code.
 *
 * The model doesn't always keep to the subset it is asked for, so what it tends to add anyway is handled here instead of showing as
 * raw symbols: `*italics*` lose their asterisks (lesson text draws only **bold** and `code`), `[text](url)` reads "text (url)", a `>` quote
 * becomes a tip, a horizontal rule is dropped, a bullet nested under an item joins that item (so a numbered list keeps counting), a
 * blank line between list items doesn't restart the list, and a ```json block that is really a diagram is drawn as one.
 */
const isTableRow = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isTableDivider = (line: string) => isTableRow(line) && /^[\s|:-]+$/.test(line) && line.includes('-');
const cells = (line: string) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());

const DIAGRAM_KINDS = ['flow', 'sequence', 'class', 'er', 'architecture'];
const BULLET = /^(\s*)[-*•]\s+(.+)$/;
const NUMBERED = /^(\s*)\d+[.)]\s+(.+)$/;
const RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;

/** A ```json block the model meant as a diagram (the prompt asks for ```diagram, which it forgets). */
function isDiagramJson(language: string, code: string): boolean {
  if (language !== 'json') return false;
  try {
    const value = JSON.parse(code) as unknown;
    return typeof value === 'object' && value !== null && DIAGRAM_KINDS.includes((value as { kind?: unknown }).kind as string);
  } catch {
    return false;
  }
}

/** Inline clean-up outside `code spans` (which are left exactly as written): italics and links become plain text. */
export function plainInline(text: string): string {
  return text
    .split(/(`[^`]*`)/)
    .map((part, index) =>
      index % 2 === 1
        ? part
        : part
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1 ($2)')
            .replace(/(^|[^*\w])\*([^*\s](?:[^*\n]*?[^*\s])?)\*(?![*\w])/g, '$1$2')
            .replace(/(^|[^_\w])_([^_\s](?:[^_\n]*?[^_\s])?)_(?![_\w])/g, '$1$2'),
    )
    .join('');
}

export function markdownToBlocks(text: string): LessonBlock[] {
  const blocks: LessonBlock[] = [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let paragraph: string[] = [];
  let quote: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) blocks.push({ type: 'paragraph', text: plainInline(paragraph.join(' ').trim()) });
    paragraph = [];
  };
  const flushQuote = () => {
    if (quote.length > 0) blocks.push({ type: 'tip', text: plainInline(quote.join(' ').trim()) });
    quote = [];
  };
  const flushList = () => {
    if (list && list.items.length > 0) blocks.push({ type: 'list', ordered: list.ordered, items: list.items.map(plainInline) });
    list = null;
  };
  const flushAll = () => {
    flushParagraph();
    flushQuote();
    flushList();
  };
  /** The next line that isn't blank, to tell a blank line inside a list from the end of it. */
  const nextText = (from: number) => lines.slice(from + 1).find((line) => line.trim() !== '');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fence = /^\s*```\s*([\w+#.-]*)\s*$/.exec(line);
    if (fence) {
      flushAll();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      const language = (fence[1] || 'code').toLowerCase();
      const source = code.join('\n');
      // A diagram the mentor drew: the app validates it before anything is drawn (and shows plain text if it isn't valid).
      if (language === 'diagram' || language === 'mermaid' || isDiagramJson(language, source)) blocks.push({ type: 'diagram', format: language === 'mermaid' ? 'mermaid' : 'json', source });
      else blocks.push({ type: 'code', language: fence[1] || 'code', code: source });
      continue;
    }
    // A pipe table: a header row, then a divider row (| --- | :-: |); the rows after it, up to the first line without a pipe.
    if (isTableRow(line) && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      flushAll();
      const headers = cells(line).map(plainInline);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(cells(lines[index]).map(plainInline));
        index += 1;
      }
      index -= 1;
      // Every row gets the header's width, so a short or long row from the model never breaks the table.
      blocks.push({ type: 'table', headers, rows: rows.map((row) => headers.map((_, column) => row[column] ?? '')) });
      continue;
    }
    const heading = /^\s{0,3}#{1,4}\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) {
      flushAll();
      blocks.push({ type: 'heading', text: plainInline(heading[1]) });
      continue;
    }
    if (RULE.test(line)) {
      flushAll();
      continue;
    }
    const quoted = /^\s*>\s?(.*)$/.exec(line);
    if (quoted) {
      flushParagraph();
      flushList();
      if (quoted[1].trim() !== '') quote.push(quoted[1].trim());
      continue;
    }
    flushQuote();
    const bullet = BULLET.exec(line);
    const numbered = NUMBERED.exec(line);
    if (bullet || numbered) {
      flushParagraph();
      const match = (bullet ?? numbered)!;
      const ordered = !!numbered;
      const current = list as { ordered: boolean; items: string[] } | null;
      // A bullet indented under an open item belongs to that item, so "1. Step" with its sub-points stays one item and the count carries on.
      if (current && bullet && match[1].length >= 2) {
        current.items[current.items.length - 1] += ` — ${match[2].trim()}`;
        continue;
      }
      if (!current || current.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      (list as unknown as { items: string[] }).items.push(match[2].trim());
      continue;
    }
    if (line.trim() === '') {
      flushParagraph();
      // A blank line between the items of a list doesn't end it (otherwise a numbered list starts over at 1).
      const upcoming = nextText(index);
      const open = list as { ordered: boolean } | null;
      const continues = !!open && !!upcoming && (open.ordered ? NUMBERED.test(upcoming) || /^\s{2,}[-*•]\s/.test(upcoming) : BULLET.test(upcoming));
      if (!continues) flushList();
      continue;
    }
    // A wrapped list item's next line joins it.
    const open = list as { items: string[] } | null;
    if (open && /^\s{2,}\S/.test(line)) {
      open.items[open.items.length - 1] += ` ${line.trim()}`;
      continue;
    }
    flushList();
    paragraph.push(line.trim());
  }
  flushAll();
  return blocks;
}
