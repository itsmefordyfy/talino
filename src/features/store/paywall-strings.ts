import { AI_CHAT_PRO_DAILY_LIMIT } from '@/constants/ai-chat';
import { defineStrings } from '@/lib/i18n';

/**
 * The paywall's table and feature list (the layout of Ulamin's). English only for now: `fil` repeats the English, because the owner
 * asked for no new Filipino text (2026-11-15), and this table is listed in `ENGLISH_ONLY` in `lib/strings-parity.test.ts` until it is translated.
 */
const text = {
  badge: 'PRO',
  features: {
    courses: { title: 'Every course', hint: 'All courses and mini-courses, and new ones as they come.' },
    reviews: { title: 'Reviewed projects and certificates', hint: 'Your coach reviews each course project, and you earn a certificate for every course you finish.' },
    coach: { title: 'Far more time with your coach', hint: 'Chat with Tali or Tala whenever you are stuck, as often as you need (fair use applies).' },
    resume: { title: 'A résumé for every job', hint: 'Tailor your résumé to each job post, import one, and let your coach improve it.' },
    kit: { title: 'The career kit', hint: 'Résumé, portfolio, case-study, proposal and invoice templates, as files you can edit anywhere.' },
    backup: { title: 'A backup file you keep', hint: 'Save your progress as a file and restore it on any phone.' },
  },
  compare: {
    title: 'Free and Pro',
    free: 'Free',
    rows: {
      courses: 'Courses and mini-courses',
      reviews: 'Projects reviewed by your coach',
      certificates: 'Certificates',
      coach: 'Chats with Tali or Tala',
      tailor: 'Résumé tailoring and import',
      kit: 'Career kit templates',
      backupFile: 'Backup file',
    },
    starter: 'Starter',
    all: 'All',
    unlimited: 'Unlimited',
    perDay: (count: number) => `${count} a day`,
    included: 'Included',
    notIncluded: 'Not included',
  },
  fairUseNote: `Unlimited AI chat is subject to fair use: up to ${AI_CHAT_PRO_DAILY_LIMIT} new chats per rolling 24 hours.`,
  freeNote: 'Free also keeps the starter course, the résumé builder, the career tracker, job boards, the portfolio and automatic backup.',
  justPerWeek: (price: string) => `Just ${price} a week`,
};

export const paywallStrings = defineStrings({ en: text, fil: text });
