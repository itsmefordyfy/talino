import { defineStrings } from '@/lib/i18n';

/**
 * Discover's browse sections, suggestions, card actions and path details (2026-11-16). English only: the owner asked on 2026-11-15
 * that no Filipino text be written, so `fil` is the same English (listed in `strings-parity.test.ts`'s ENGLISH_ONLY).
 */
const en = {
  // Home sections
  startHereNoMatch: 'No course is about what you picked yet. These are good places to start while we add more.',
  levelsTitle: 'Browse by level',
  levelsBody: 'A course’s level is what it expects you to know about building with AI. Explore any level, whatever yours is.',
  levelTile: (label: string, count: number) => `${label}, ${count === 1 ? '1 course' : `${count} courses`}`,
  toolsTitle: 'Learn an AI tool',
  toolsBody: 'Courses that teach each tool in real work.',
  toolChip: (label: string, count: number) => `${label}, ${count === 1 ? '1 course' : `${count} courses`}`,
  shortTitle: 'Short courses',
  shortBody: 'Mini-courses and courses under 90 minutes.',
  newTitle: 'New courses',
  pathsTitle: 'Featured learning paths',
  pathsBody: 'Courses in a suggested order toward one outcome. A path is advice, never a lock.',
  interestsTitle: 'Based on your interests',
  improveTitle: 'Improve your skills',
  improveBody: 'Where your quiz results had room to grow.',
  improveReason: (category: string, percent: number) => `Your ${category} quizzes: ${percent}%`,
  nextLevelTitle: (level: string) => `Get ready for ${level}`,
  nextLevelBody: (level: string) => `Courses at the ${level} level, the ones you are ready for first.`,
  nextLevelReason: (level: string) => `${level} level`,
  // Path cards and screen
  pathLevels: (from: string, to: string) => (from === to ? from : `${from} → ${to}`),
  pathMeta: (levels: string, courses: number, duration: string) => `${levels} · ${courses === 1 ? '1 course' : `${courses} courses`} · ${duration}`,
  showAllPaths: (n: number) => `Show all ${n} paths`,
  pathFor: 'Who it’s for',
  pathGoals: 'Goals it serves',
  pathObjectives: 'What you’ll learn',
  pathOutcome: 'Where it leads',
  pathLevel: 'Level',
  pathDuration: 'Total time',
  // Course card
  cardNew: 'New',
  cardStart: 'Start learning',
  cardContinue: 'Continue',
  cardReview: 'Review',
  cardView: 'View course',
  // Search suggestions
  suggestionsLabel: 'Suggestions',
  tryTitle: 'Try one of these',
  suggestionKinds: { tool: 'AI tool', technology: 'Technology', category: 'Category', level: 'Level', topic: 'Topic', course: 'Course' },
  suggestionA11y: (kind: string, label: string, count: number | null) => (count === null ? `${kind}: ${label}. Opens the course` : `${kind}: ${label}, ${count === 1 ? '1 course' : `${count} courses`}`),
  // Course page
  levelDetail: (level: string) => `${level} level`,
  accessFree: 'Free',
  accessPro: 'Pro',
  buildTitle: 'What you’ll build',
  buildBody: 'The hands-on projects in this course. Tali reviews each one.',
  levelMeaning: 'Level',
  toolsFilter: 'AI tools',
  accessFilter: 'Free or Pro',
  progressFilter: 'Your progress',
};

export const browseStrings = defineStrings({ en, fil: en });
