import { parseMermaidSubset } from '@/features/visuals/diagrams';

/** What the workbench shows for the text it last read. */
export type SourceView = {
  /** The text this view was made from. */
  source: string;
  /** The parser's line-numbered messages; empty when the text is valid or empty. */
  errors: string[];
  /** The newest text that parsed, kept so a typing mistake never blanks the drawing; null until one has. */
  goodSource: string | null;
};

/**
 * Reads the text once. Valid text becomes the drawn one; invalid text keeps the previous good drawing and brings the parser's messages; blank text clears the
 * drawing and says nothing, since an empty box is not a mistake.
 */
export function evaluateSource(source: string, previousGood: string | null): SourceView {
  if (source.trim() === '') return { source, errors: [], goodSource: null };
  const result = parseMermaidSubset(source);
  return result.ok ? { source, errors: [], goodSource: source } : { source, errors: result.errors, goodSource: previousGood };
}

/**
 * Phone keyboards turn straight quotes into curly ones and "..." into an ellipsis, and the diagram text only reads the straight kind, so typing
 * `Person(a, "Owner")` would fail for no visible reason. Put the plain characters back as the learner types or pastes.
 */
export function normalizeTyping(text: string): string {
  return text
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/…/g, '...')
    .replace(/[–—]/g, '-')
    .replace(/ /g, ' ');
}
