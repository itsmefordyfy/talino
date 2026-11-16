import type { Language } from '@/lib/i18n';

type BadgeCopy = { title: string; description: string };

/**
 * Tagalog (`fil`) badge names and "how to earn it" lines, by badge id. The English lives in `badges.ts` next to the
 * rules; ids are stored and synced, so they never change. "Bug Hunter", "Logic Master", "Code Explorer", "Talino
 * Master", "AI Developer" and the streaks stay in English on purpose: they are titles in tech slang the learner also
 * sees as a profile title, like a game rank. Voice and glossary: `docs/i18n/tagalog-style-guide.md`.
 */
export const BADGE_COPY_FIL: Record<string, (targets: BadgeTargets) => BadgeCopy> = {
  'first-lesson': () => ({ title: 'Unang lesson', description: 'Tapusin ang una mong lesson.' }),
  'streak-7': () => ({ title: '7-day streak', description: 'Mag-aral nang 7 araw na sunod-sunod.' }),
  'streak-30': () => ({ title: '30-day streak', description: 'Mag-aral nang 30 araw na sunod-sunod.' }),
  'perfect-quiz': () => ({ title: 'Perfect quiz', description: 'Sagutin nang tama ang lahat ng tanong sa isang quiz.' }),
  'first-project': () => ({ title: 'Unang project, na-ship na', description: 'Ipasa ang review ni Tali sa isang project.' }),
  'first-ai-app': () => ({ title: 'Unang AI app', description: 'I-ship ang isang project na gumagamit ng AI model.' }),
  'first-proposal': () => ({ title: 'Unang client proposal', description: 'Magpadala ng unang proposal mo at ipasa ang review nito.' }),
  'starter-complete': () => ({ title: 'AI basics', description: 'Tapusin ang AI Basics for Tech.' }),
  'course-complete': () => ({ title: 'Tapos na ang course', description: 'Tapusin ang isang career course, kasama ang certificate.' }),
  master: () => ({ title: 'Talino Master', description: 'Tapusin ang lahat ng career course.' }),
  'first-application': () => ({ title: 'Sumabak na', description: 'Idagdag sa tracker ang una mong job application o proposal.' }),
  'first-interview': () => ({ title: 'Unang interview', description: 'Umabot sa interview stage.' }),
  'first-win': () => ({ title: 'Na-hire o nanalo', description: 'Makakuha ng offer o manalo ng client.' }),
  'first-income': () => ({ title: 'Unang kita', description: 'I-log ang una mong freelance income.' }),
  'bug-hunter': ({ bugs }) => ({ title: 'Bug Hunter', description: `Maghanap at mag-ayos ng ${bugs} bug sa mga practice activity.` }),
  'logic-master': ({ logic }) => ({ title: 'Logic Master', description: `Lutasin ang ${logic} logic activity: hulaan ang output, ayusin ang mga hakbang, o pag-isipan ang isang scenario.` }),
  'code-explorer': ({ languages }) => ({ title: 'Code Explorer', description: `Lutasin ang mga code o SQL challenge sa ${languages} magkaibang language.` }),
  'ai-developer': () => ({ title: 'AI Developer', description: 'Tapusin ang bawat course sa AI-Assisted Development path.' }),
  'ai-capstone': () => ({ title: 'Na-ship na ang Capstone', description: 'Gumawa ng kumpletong application gamit ang AI-assisted workflow at ipasa ang review nito.' }),
};

export type BadgeTargets = { bugs: number; logic: number; languages: number };

/** The "finish this mini-course / course" line of the badges that carry a course's own title. */
export function courseBadgeDescription(kind: 'mini' | 'path', courseTitle: string, language: Language): string {
  if (language === 'fil') return kind === 'mini' ? `Tapusin ang ${courseTitle} mini-course.` : `Tapusin ang ${courseTitle}.`;
  return kind === 'mini' ? `Finish the ${courseTitle} mini-course.` : `Finish ${courseTitle}.`;
}
