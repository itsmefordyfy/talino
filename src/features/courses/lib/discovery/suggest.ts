import { CATEGORIES } from '../../content/catalog/categories';
import { getTechnology } from '../../content/catalog/technologies';
import type { CategoryId } from '../../content/types';
import type { CourseFacts } from '../catalog-facts';
import { LEARNING_LEVELS, LEARNING_LEVEL_TEXT, type LearningLevel } from '../learning-level';
import { isAiTool } from './filters';

/**
 * Suggestions under the search box, built from the published catalog only: an AI tool or technology some course teaches, a
 * category, a learning level, a curated topic tag, or a course title. Each one (but a course) says how many courses it leads to,
 * so a suggestion never leads to an empty list. Choosing one is the UI's job: a tool sets the AI tools filter, a course opens it.
 */
export type SearchSuggestion =
  | { kind: 'tool' | 'technology'; id: string; label: string; count: number }
  | { kind: 'category'; id: CategoryId; label: string; count: number }
  | { kind: 'level'; id: LearningLevel; label: string; count: number }
  | { kind: 'topic'; id: string; label: string; count: number }
  | { kind: 'course'; id: string; label: string; count: 1 };

type Candidate = { suggestion: SearchSuggestion; words: string[] };

const MAX_SUGGESTIONS = 6;
const MAX_COURSES = 3;
/** The order of kinds when two suggestions match equally well: what narrows the catalog the most usefully first. */
const KIND_ORDER: Record<SearchSuggestion['kind'], number> = { tool: 0, category: 1, level: 2, technology: 3, topic: 4, course: 5 };

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9#+ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

let cache: { facts: readonly CourseFacts[]; candidates: Candidate[] } | null = null;

function candidatesFor(facts: readonly CourseFacts[]): Candidate[] {
  if (cache?.facts === facts) return cache.candidates;
  const candidates: Candidate[] = [];
  const techCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  for (const fact of facts) {
    for (const id of new Set(fact.technologies)) techCounts.set(id, (techCounts.get(id) ?? 0) + 1);
    for (const tag of new Set(fact.tags.map(normalize))) if (tag) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  for (const [id, count] of techCounts) {
    const technology = getTechnology(id);
    if (!technology) continue;
    candidates.push({ suggestion: { kind: isAiTool(id) ? 'tool' : 'technology', id, label: technology.label, count }, words: [technology.label, ...technology.aliases].map(normalize) });
  }
  for (const category of CATEGORIES) {
    const count = facts.filter((fact) => fact.category === category.id).length;
    if (count > 0) candidates.push({ suggestion: { kind: 'category', id: category.id, label: category.label, count }, words: [normalize(category.label)] });
  }
  for (const level of LEARNING_LEVELS) {
    const count = facts.filter((fact) => fact.learningLevel === level).length;
    if (count > 0) candidates.push({ suggestion: { kind: 'level', id: level, label: LEARNING_LEVEL_TEXT[level].label, count }, words: [normalize(LEARNING_LEVEL_TEXT[level].label)] });
  }
  // A topic is worth suggesting when it gathers several courses; a one-course tag is better found through the course itself.
  for (const [tag, count] of tagCounts) if (count >= 2) candidates.push({ suggestion: { kind: 'topic', id: tag, label: tag, count }, words: [tag] });
  for (const fact of facts) candidates.push({ suggestion: { kind: 'course', id: fact.id, label: fact.course.title, count: 1 }, words: [normalize(fact.course.title)] });
  cache = { facts, candidates };
  return candidates;
}

/** 3: the text starts the name. 2: it starts a word of the name. 1: it is inside the name (3+ letters). 0: no match. */
function quality(words: readonly string[], needle: string): number {
  let best = 0;
  for (const word of words) {
    if (word.startsWith(needle)) return 3;
    if (word.split(' ').some((part) => part.startsWith(needle))) best = Math.max(best, 2);
    else if (needle.length >= 3 && word.includes(needle)) best = Math.max(best, 1);
  }
  return best;
}

export function searchSuggestions(facts: readonly CourseFacts[], text: string): SearchSuggestion[] {
  const needle = normalize(text);
  if (!needle) return [];
  const scored = candidatesFor(facts)
    .map((candidate) => ({ candidate, quality: quality(candidate.words, needle) }))
    .filter((entry) => entry.quality > 0)
    .sort(
      (a, b) =>
        b.quality - a.quality ||
        KIND_ORDER[a.candidate.suggestion.kind] - KIND_ORDER[b.candidate.suggestion.kind] ||
        b.candidate.suggestion.count - a.candidate.suggestion.count ||
        a.candidate.suggestion.label.localeCompare(b.candidate.suggestion.label),
    );
  const out: SearchSuggestion[] = [];
  const seenLabels = new Set<string>();
  let courses = 0;
  for (const { candidate } of scored) {
    const { suggestion } = candidate;
    const label = normalize(suggestion.label);
    // The same words twice (a topic tag that repeats a tool or category name) add nothing.
    if (seenLabels.has(label)) continue;
    if (suggestion.kind === 'course') {
      if (courses >= MAX_COURSES) continue;
      courses += 1;
    }
    seenLabels.add(label);
    out.push(suggestion);
    if (out.length >= MAX_SUGGESTIONS) break;
  }
  return out;
}

/** What to offer when a search found nothing: the AI tools the most courses teach, and the Beginner level. */
export function starterSuggestions(facts: readonly CourseFacts[], tools = 4): SearchSuggestion[] {
  const candidates = candidatesFor(facts);
  const topTools = candidates
    .map((candidate) => candidate.suggestion)
    .filter((suggestion) => suggestion.kind === 'tool')
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, tools);
  const beginner = candidates.map((candidate) => candidate.suggestion).find((suggestion) => suggestion.kind === 'level' && suggestion.id === 'beginner');
  return beginner ? [...topTools, beginner] : topTools;
}
