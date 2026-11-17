import type { Language } from '@/lib/language';

import type { Lesson, LessonBlock } from '../content/types';
import { splitLesson } from './lesson-structure';
import { speechPhrases } from './speech-phrases';

/**
 * Lesson text without its markup, for reading aloud (code is announced, not spelled out). It is exactly the text `parseInline` draws,
 * so a sentence on the screen and a sentence in the audio are cut from the same characters.
 */
export function stripInline(text: string): string {
  return parseInline(text)
    .map((part) => part.text)
    .join('');
}

/** One spoken piece; a `heading` marks where a section of the lesson begins (the Listen player's chapters). */
type SpeechPart = { text: string; heading?: boolean };

function speechParts(title: string, blocks: readonly LessonBlock[], language: Language): SpeechPart[] {
  const say = speechPhrases(language);
  const parts: SpeechPart[] = [{ text: title }];
  const add = (...texts: string[]) => parts.push(...texts.map((text) => ({ text })));
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        add(stripInline(block.text));
        break;
      case 'heading':
        parts.push({ text: stripInline(block.text), heading: true });
        break;
      case 'list':
        add(...block.items.map(stripInline));
        break;
      case 'tip':
        add(`${say.tip} ${stripInline(block.text)}`);
        break;
      case 'warning':
        add(`${say.warning} ${stripInline(block.text)}`);
        break;
      case 'prompt':
        add(say.prompt);
        break;
      case 'code':
        add(say.code(block.language));
        break;
      case 'details':
        add(stripInline(block.summary), ...block.body.map(stripInline));
        break;
      case 'takeaways':
        add(say.takeaways, ...block.items.map(stripInline));
        break;
      case 'table':
        add(block.caption ? say.tableWithCaption(stripInline(block.caption)) : say.table);
        break;
      case 'diagram':
      case 'visual':
        add(block.caption ? say.diagramWithCaption(stripInline(block.caption)) : say.diagram);
        break;
      case 'version':
        add(`${say.version(block.checked)} ${stripInline(block.text)}${block.plans ? ` ${say.plans(stripInline(block.plans))}` : ''}`);
        break;
      case 'toolComparison':
        add(say.toolComparison);
        break;
      case 'demo':
        add(say.demoIntro, `${say.demoPrompt} ${stripInline(block.prompt)}`, `${say.demoOutput} ${stripInline(block.output)}`, `${say.demoNotice} ${stripInline(block.notice)}`);
        break;
    }
  }
  return parts;
}

export function lessonSpeech(title: string, blocks: readonly LessonBlock[], language: Language = 'en'): string {
  return speechParts(title, blocks, language)
    .map((part) => part.text)
    .join('\n\n');
}

/**
 * What Listen reads for a lesson, in the order it is taught: the title, what the lesson covers, what the
 * learner will be able to do and why it matters, then the teaching and the key takeaways. Activities and
 * the quiz are not read (they are done on screen). The Kokoro audio files (`scripts/audio`) are made from
 * this same text, so the phone's voice and the recorded voice say the same words.
 */
type ScriptLesson = Pick<Lesson, 'title' | 'summary' | 'intro' | 'body'>;

function scriptParts(lesson: ScriptLesson, language: Language): SpeechPart[] {
  const say = speechPhrases(language);
  const intro: LessonBlock[] = [{ type: 'paragraph', text: lesson.summary }];
  if (lesson.intro) {
    intro.push({ type: 'paragraph', text: say.objectives }, { type: 'list', items: lesson.intro.objectives }, { type: 'paragraph', text: `${say.why} ${lesson.intro.why}` });
  }
  // Blocks written for particular levels (`audience`) are not read: the recordings (scripts/audio) are made from this text and cover the
  // lesson everybody shares, so they stay valid when a level piece is added or changed, and the phone's voice says the same words. The
  // pieces for a level are on the screen, in Tali's lesson, never in the audio.
  return speechParts(lesson.title, [...intro, ...splitLesson(lesson.body.filter((block) => !block.audience)).learn], language);
}

/** `language` is the lesson's language: the words Listen adds around its text ("Key takeaways.") are said in it. */
export function lessonScript(lesson: ScriptLesson, language: Language = 'en'): string {
  return scriptParts(lesson, language)
    .map((part) => part.text)
    .join('\n\n');
}

export type OutlineSection = { title: string; /** How far into the lesson it starts, 0 to 1, by the share of the spoken words (a good guide to the recording, not exact). */ at: number };

/** The lesson's sections for the Listen player: the lesson itself, then each heading, with where it begins in the recording. */
export function lessonOutline(lesson: ScriptLesson, language: Language = 'en'): OutlineSection[] {
  const parts = scriptParts(lesson, language);
  const total = parts.reduce((sum, part) => sum + part.text.length + 2, 0);
  const sections: OutlineSection[] = [{ title: lesson.title, at: 0 }];
  let spoken = 0;
  for (const part of parts) {
    if (part.heading && spoken > 0) sections.push({ title: part.text, at: spoken / total });
    spoken += part.text.length + 2;
  }
  return sections;
}

/** The section playing at a point in the lesson (0 to 1). */
export function sectionAt(outline: readonly OutlineSection[], fraction: number): OutlineSection | null {
  let current: OutlineSection | null = null;
  for (const section of outline) if (section.at <= fraction + 1e-9) current = section;
  return current;
}

export type InlinePart = { text: string; bold?: boolean; code?: boolean; italic?: boolean };

/**
 * Splits `**bold**`, `` `code` `` and `*emphasis*` out of a line; anything unmatched stays plain. Code inside bold (`**`x`, not `y`:**`) is both.
 * `*emphasis*` needs its opening star to follow a space or punctuation and be followed by a word character, and its closing star the
 * reverse, so maths and wildcards (`2 * 3`, `x*y*z`, `*.txt`) are never taken for it. The marks themselves are dropped: what is drawn and what
 * is read aloud is the words only (the voice used to say the stars).
 */
export function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const pattern = /\*\*(.+?)\*\*|`([^`]+)`|(?<![\w*])\*(?=[^\s*`])([^*`\n]+?)(?<=[^\s*])\*(?![\w*])/g;
  let last = 0;
  for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index) });
    if (match[1] !== undefined) {
      for (const inner of parseInline(match[1].replace(/\*\*/g, ''))) parts.push({ ...inner, bold: true });
    } else if (match[2] !== undefined) parts.push({ text: match[2], code: true });
    else parts.push({ text: match[3], italic: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
