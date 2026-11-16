import { defineStrings } from '@/lib/i18n';

/** The notes by id; `lib/release-notes.ts` says which version has which. English only (owner's standing rule: no Filipino text), so `fil` copies it. */
const en = {
  title: 'What’s new',
  version: (version: string) => `Version ${version}`,
  headline: 'What’s new in Talino',
  gotIt: 'Continue',
  empty: 'Nothing new to show for this version.',
  items: {
    aiJourney: { title: 'Your AI journey', body: 'Home is now a learning journey from Beginner to Expert: every course in the order that builds your skills, with the AI Expert certificate at the end.' },
    aiDevelopment: { title: 'AI-Assisted Development', body: 'A seven-course path on building real software with ChatGPT, Claude, Claude Code, Cursor and Codex, with an AI tools guide and a quick “where should I start?” check.' },
    betterCourses: { title: 'A better Courses tab', body: 'Browse by level, category and AI tool, find short courses, and search with suggestions and filters for level, tools, Free or Pro, and your progress.' },
    coach: { title: 'Choose your coach', body: 'Pick Tali or Tala. Each has their own look and their own voice that reads your lessons aloud.' },
    career: { title: 'Career tools', body: 'Track job applications, set goals, log freelance income, build a résumé and a shareable portfolio, and practise with a mock interview.' },
    ipad: { title: 'Talino on iPad', body: 'A layout built for the bigger screen, with your course outline beside the lesson. Works with Split View and Stage Manager.' },
    backup: { title: 'Backup & Restore', body: 'Your progress is backed up automatically to iCloud on iPhone, and you can export and import a backup file.' },
  },
};

export const whatsNewStrings = defineStrings({ en, fil: en });
