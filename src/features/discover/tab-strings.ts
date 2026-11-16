import type { CategoryId } from '@/features/courses/content/types';
import { defineStrings } from '@/lib/i18n';

/** The words of Discover's category tabs. The short names fit a tab; the full category names (with their description) head the list under them. */
export const tabStrings = defineStrings({
  en: {
    tabsLabel: 'Course categories',
    forYou: 'For you',
    all: 'All',
    short: {
      'ai-coding-fundamentals': 'Fundamentals',
      'vibe-coding': 'Vibe Coding',
      'ai-coding-tools': 'AI Tools',
      'ai-workflows': 'Workflows',
      'advanced-ai-engineering': 'Advanced',
      'build-and-monetize': 'Build & Sell',
      careers: 'Careers',
    } as Record<CategoryId, string>,
    tabA11y: (label: string, count: number | null) => (count === null ? label : `${label}, ${count === 1 ? '1 course' : `${count} courses`}`),
    allTitle: 'All courses',
    allNote: 'Every course in every category.',
    searchingAll: 'Searching all categories',
    levelSection: (level: string, count: number) => `${level} · ${count === 1 ? '1 course' : `${count} courses`}`,
    emptyCategoryTitle: (category: string) => `No ${category} courses yet`,
    emptyCategoryBody: 'Courses for this category are on the way and will appear here when they are published. Every other course is open to you.',
    showAllCourses: 'Show all courses',
    categoryOf: (category: string) => `In ${category}`,
  },
  fil: {
    tabsLabel: 'Mga category ng course',
    forYou: 'Para sa’yo',
    all: 'Lahat',
    short: {
      'ai-coding-fundamentals': 'Basics',
      'vibe-coding': 'Vibe Coding',
      'ai-coding-tools': 'AI Tools',
      'ai-workflows': 'Workflows',
      'advanced-ai-engineering': 'Advanced',
      'build-and-monetize': 'Build & Sell',
      careers: 'Careers',
    } as Record<CategoryId, string>,
    tabA11y: (label: string, count: number | null) => (count === null ? label : `${label}, ${count === 1 ? '1 course' : `${count} na course`}`),
    allTitle: 'Lahat ng course',
    allNote: 'Bawat course sa bawat category.',
    searchingAll: 'Hinahanap sa lahat ng category',
    levelSection: (level: string, count: number) => `${level} · ${count === 1 ? '1 course' : `${count} na course`}`,
    emptyCategoryTitle: (category: string) => `Wala pang course sa ${category}`,
    emptyCategoryBody: 'Parating na ang mga course para sa category na ito at lalabas dito kapag na-publish na. Bukas sa’yo ang lahat ng ibang course.',
    showAllCourses: 'Lahat ng course',
    categoryOf: (category: string) => `Nasa ${category}`,
  },
});
