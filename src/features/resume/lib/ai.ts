/**
 * The AI side of the résumé builder, shared by the server route (which asks Gemini) and the app (which reads and applies
 * the answers). No native imports.
 *
 * The rule everything here serves: the model may only reword what the learner gave. So it never returns a résumé: it
 * returns wording keyed by the ids of the learner's own entries, and the app builds the document from the learner's facts.
 * On top of that, every sentence it writes is checked against the facts (numbers and proper names must already be there).
 */

import { lineList, oneLine, parseContent, type DocEntry, type DocSection, type EntrySection, type ResumeContent, DOC_SECTIONS, ENTRY_SECTIONS, LIMITS } from './document';

// ---------------------------------------------------------------------------------------------
// The facts the model is given, and the checks against them

/** What the model reads: the learner's résumé as text, each entry led by its id. Contact details are left out on purpose. */
export function factsText(content: ResumeContent): string {
  const lines: string[] = [];
  if (content.headline) lines.push(`Headline: ${content.headline}`);
  if (content.summary) lines.push(`Summary: ${content.summary}`);
  if (content.skills.length > 0) lines.push(`Skills: ${content.skills.join(', ')}`);
  for (const section of ENTRY_SECTIONS) {
    const entries = content[section];
    if (entries.length === 0) continue;
    lines.push('', section.toUpperCase());
    for (const entry of entries) {
      const where = [entry.organization, entry.location].filter(Boolean).join(', ');
      const when = [entry.start, entry.current ? 'Present' : entry.end].filter(Boolean).join(' – ');
      lines.push(`[${entry.id}] ${entry.title}${where ? ` at ${where}` : ''}${when ? ` (${when})` : ''}`);
      for (const bullet of entry.bullets) lines.push(`- ${bullet}`);
    }
  }
  if (content.achievements.length > 0) lines.push('', 'ACHIEVEMENTS', ...content.achievements.map((line) => `- ${line}`));
  return lines.join('\n');
}

/** Every figure in a text, as digits without thousands separators ("1,200" → "1200"). */
export function numbersIn(text: string): string[] {
  return (text.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map((figure) => figure.replace(/,+$/, '').replace(/,/g, ''));
}

/** Generic words that need no source ("AI", "UI"); anything else capitalised mid-sentence is a name or a tool. */
const COMMON = new Set(['I', 'AI', 'API', 'APIs', 'UI', 'UX', 'QA']);

/**
 * Proper names and tools in `text` that `source` never mentions: capitalised words that don't start a sentence, and
 * tokens like "Node.js" or "C++". Case-insensitive against the source, so "React" in the facts supports "React Native".
 */
export function unsupportedTerms(text: string, source: string): string[] {
  const haystack = source.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const found: string[] = [];
  words.forEach((raw, index) => {
    const word = raw.replace(/^[("'[]+/, '').replace(/[,;:!?)"'\]]+$/, '').replace(/\.$/, '');
    if (!word || COMMON.has(word)) return;
    const startsSentence = index === 0 || /[.!?:]$/.test(words[index - 1]);
    const named = !startsSentence && /^[A-Z]/.test(word);
    const tool = /^[A-Za-z]+[.+#][A-Za-z0-9+#.]*$/.test(word);
    if (!named && !tool) return;
    const needle = word.toLowerCase().replace(/'s$/, '');
    if (!haystack.includes(needle) && !found.includes(word)) found.push(word);
  });
  return found;
}

/** A sentence the model wrote is allowed when every figure and every name in it is already in the learner's facts. */
export function supported(text: string, source: string): boolean {
  const known = new Set(numbersIn(source));
  return numbersIn(text).every((figure) => known.has(figure)) && unsupportedTerms(text, source).length === 0;
}

const sameText = (a: string, b: string) => a.toLowerCase().replace(/\s+/g, ' ').trim() === b.toLowerCase().replace(/\s+/g, ' ').trim();
const mentions = (source: string, quote: string) => quote.trim().length >= 3 && source.toLowerCase().replace(/\s+/g, ' ').includes(quote.toLowerCase().replace(/\s+/g, ' ').trim());

function json(text: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const records = (value: unknown): Record<string, unknown>[] => (Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null && !Array.isArray(item)) : []);

// ---------------------------------------------------------------------------------------------
// Generate and tailor: new wording for the learner's own entries

export type Generated = {
  headline: string;
  summary: string;
  entries: { id: string; bullets: string[] }[];
  skills: string[];
  suggestedSkills: { skill: string; evidence: string }[];
  keywords: string[];
  gaps: string[];
  questions: string[];
};

export function parseGenerated(text: string): Generated | null {
  const raw = json(text);
  if (!raw) return null;
  const summary = oneLine(raw.summary, LIMITS.summary);
  if (!summary) return null;
  return {
    headline: oneLine(raw.headline, 120),
    summary,
    entries: records(raw.entries).map((entry) => ({ id: oneLine(entry.id, 64), bullets: lineList(entry.bullets, LIMITS.bullets, LIMITS.bullet) })),
    skills: lineList(raw.skills, LIMITS.skills, 60),
    suggestedSkills: records(raw.suggestedSkills).map((item) => ({ skill: oneLine(item.skill, 60), evidence: oneLine(item.evidence, LIMITS.bullet) })),
    keywords: lineList(raw.keywords, 12, 60),
    gaps: lineList(raw.gaps, 4, 220),
    questions: lineList(raw.questions, 5, 220),
  };
}

export type GeneratedResult = {
  content: ResumeContent;
  /** Skills the résumé suggests but doesn't claim: each shows the line that supports it, and the learner adds it or not. */
  suggestedSkills: { skill: string; evidence: string }[];
  /** Terms from the job post that the résumé already supports. */
  keywords: string[];
  /** What the job post asks for that the résumé doesn't show. */
  gaps: string[];
  /** What the model needs to know before it can do better; shown to the learner, never guessed. */
  questions: string[];
};

/** The summary with every sentence the facts don't support removed; the learner's own summary if nothing is left. */
function safeSummary(proposed: string, own: string, source: string): string {
  const kept = (proposed.match(/[^.!?]+[.!?]*/g) ?? []).map((sentence) => sentence.trim()).filter((sentence) => sentence !== '' && supported(sentence, source));
  return kept.length > 0 ? kept.join(' ').slice(0, LIMITS.summary) : own;
}

/**
 * Builds the new document from the learner's own: entries come only from `base` (an id the model made up is ignored), new
 * bullets replace the old only when they pass the facts check, skills are only reordered, and a headline is taken only to fill a blank one.
 */
export function applyGenerated(base: ResumeContent, generated: Generated): GeneratedResult {
  const source = factsText(base);
  const byId = new Map(generated.entries.map((entry) => [entry.id, entry.bullets]));
  const reword = (entry: DocEntry): DocEntry => {
    const proposed = (byId.get(entry.id) ?? []).filter((bullet) => supported(bullet, source));
    return proposed.length > 0 ? { ...entry, bullets: proposed.slice(0, 6) } : entry;
  };

  const wanted = generated.skills.map((skill) => base.skills.find((own) => sameText(own, skill))).filter((skill): skill is string => skill !== undefined);
  const ordered = [...new Set(wanted)];
  const skills = [...ordered, ...base.skills.filter((skill) => !ordered.includes(skill))];

  const suggestedSkills = generated.suggestedSkills
    .filter((item) => item.skill !== '' && !base.skills.some((own) => sameText(own, item.skill)) && mentions(source, item.evidence))
    .slice(0, 8);

  return {
    content: {
      ...base,
      headline: base.headline || generated.headline,
      summary: safeSummary(generated.summary, base.summary, source),
      skills,
      experience: base.experience.map(reword),
      projects: base.projects.map(reword),
    },
    suggestedSkills,
    keywords: generated.keywords,
    gaps: generated.gaps,
    questions: generated.questions,
  };
}

// ---------------------------------------------------------------------------------------------
// Review and improve: suggestions the learner accepts or rejects

export type SuggestionTarget = { section: 'summary' } | { section: 'headline' } | { section: EntrySection; id: string; index: number } | { section: 'achievements'; index: number };

export type Suggestion =
  | { key: string; kind: 'rewrite'; target: SuggestionTarget; before: string; after: string; reason: string }
  | { key: string; kind: 'bullets'; section: EntrySection; id: string; before: string[]; after: string[]; reason: string }
  | { key: string; kind: 'skill'; skill: string; evidence: string; reason: string };

export type Review = {
  /** One or two sentences on where the résumé stands. */
  verdict: string;
  /** Sections that are weak or missing, with what to add. */
  weak: { section: DocSection; advice: string }[];
  suggestions: Suggestion[];
  questions: string[];
};

const isDocSection = (value: unknown): value is DocSection => (DOC_SECTIONS as readonly unknown[]).includes(value);
const isEntrySection = (value: unknown): value is EntrySection => (ENTRY_SECTIONS as readonly unknown[]).includes(value);

function rewriteOf(item: Record<string, unknown>, content: ResumeContent, source: string): Suggestion | null {
  const after = oneLine(item.after, item.section === 'summary' ? LIMITS.summary : LIMITS.bullet);
  const reason = oneLine(item.reason, 300);
  if (!after || !reason || !supported(after, source)) return null;
  const section = item.section;
  let target: SuggestionTarget;
  let before: string;
  if (section === 'summary') {
    target = { section };
    before = content.summary;
  } else if (section === 'headline') {
    target = { section };
    before = content.headline;
  } else if (section === 'achievements' && typeof item.index === 'number') {
    target = { section, index: item.index };
    before = content.achievements[item.index] ?? '';
  } else if (isEntrySection(section) && typeof item.id === 'string' && typeof item.index === 'number') {
    const entry = content[section].find((candidate) => candidate.id === item.id);
    target = { section, id: item.id, index: item.index };
    before = entry?.bullets[item.index] ?? '';
  } else return null;
  // There must be real text to replace, and the new text must be different.
  if (!before || sameText(before, after)) return null;
  const key = `rewrite:${section}:${'id' in target ? target.id : ''}:${'index' in target ? target.index : ''}`;
  return { key, kind: 'rewrite', target, before, after, reason };
}

export function parseReview(text: string, content: ResumeContent): Review | null {
  const raw = json(text);
  if (!raw) return null;
  const verdict = oneLine(raw.verdict, 400);
  if (!verdict) return null;
  const source = factsText(content);
  const seen = new Set<string>();
  const suggestions: Suggestion[] = [];
  for (const item of records(raw.suggestions)) {
    const suggestion = rewriteOf(item, content, source);
    if (suggestion && !seen.has(suggestion.key)) {
      seen.add(suggestion.key);
      suggestions.push(suggestion);
    }
  }
  for (const item of records(raw.skills)) {
    const skill = oneLine(item.skill, 60);
    const evidence = oneLine(item.evidence, LIMITS.bullet);
    const reason = oneLine(item.reason, 300);
    const key = `skill:${skill.toLowerCase()}`;
    if (!skill || !reason || content.skills.some((own) => sameText(own, skill)) || !mentions(source, evidence) || seen.has(key)) continue;
    seen.add(key);
    suggestions.push({ key, kind: 'skill', skill, evidence, reason });
  }
  return {
    verdict,
    weak: records(raw.weak)
      .flatMap((item) => (isDocSection(item.section) && oneLine(item.advice, 300) ? [{ section: item.section, advice: oneLine(item.advice, 300) }] : []))
      .slice(0, 6),
    suggestions: suggestions.slice(0, 20),
    questions: lineList(raw.questions, 5, 220),
  };
}

/** The résumé with one suggestion applied, or null when it no longer fits (the text changed since, or the skill is already there). */
export function applySuggestion(content: ResumeContent, suggestion: Suggestion): ResumeContent | null {
  if (suggestion.kind === 'skill') return content.skills.some((own) => sameText(own, suggestion.skill)) ? null : { ...content, skills: [...content.skills, suggestion.skill].slice(0, LIMITS.skills) };
  if (suggestion.kind === 'bullets') {
    const entry = content[suggestion.section].find((candidate) => candidate.id === suggestion.id);
    if (!entry || JSON.stringify(entry.bullets) !== JSON.stringify(suggestion.before)) return null;
    return { ...content, [suggestion.section]: content[suggestion.section].map((candidate) => (candidate.id === suggestion.id ? { ...candidate, bullets: suggestion.after } : candidate)) };
  }
  const { target, before, after } = suggestion;
  if (target.section === 'summary') return content.summary === before ? { ...content, summary: after } : null;
  if (target.section === 'headline') return content.headline === before ? { ...content, headline: after } : null;
  if (target.section === 'achievements') return content.achievements[target.index] === before ? { ...content, achievements: content.achievements.map((line, index) => (index === target.index ? after : line)) } : null;
  const { section, id, index } = target;
  const entry = content[section].find((candidate) => candidate.id === id);
  if (!entry || entry.bullets[index] !== before) return null;
  return { ...content, [section]: content[section].map((candidate) => (candidate.id === id ? { ...candidate, bullets: candidate.bullets.map((line, at) => (at === index ? after : line)) } : candidate)) };
}

export type Improved = { bullets: string[]; reason: string; questions: string[] };

/** The model's rewrite of one entry's rough description into bullets, kept only where the facts support it. */
export function parseImproved(text: string, source: string): Improved | null {
  const raw = json(text);
  if (!raw) return null;
  const bullets = lineList(raw.bullets, 6, LIMITS.bullet).filter((bullet) => supported(bullet, source));
  if (bullets.length === 0) return null;
  return { bullets, reason: oneLine(raw.reason, 300), questions: lineList(raw.questions, 4, 220) };
}

// ---------------------------------------------------------------------------------------------
// Import: facts copied out of an uploaded résumé

/** A résumé read out of a file, or null when nothing readable came out of it. */
export function parseImported(text: string): ResumeContent | null {
  const raw = json(text);
  if (!raw) return null;
  const content = parseContent(raw);
  const hasSomething = content.name !== '' || content.summary !== '' || content.skills.length > 0 || ENTRY_SECTIONS.some((section) => content[section].length > 0);
  return hasSomething ? content : null;
}
