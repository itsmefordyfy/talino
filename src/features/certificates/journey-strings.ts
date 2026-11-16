import { defineStrings } from '@/lib/i18n';

/** The AI Expert certificate and its Home card (2026-11-16). English only (owner, 2026-11-15): `fil` is the same English. */
const en = {
  title: 'AI Expert certificate',
  label: 'Certificate of mastery, Certified AI Expert',
  eyebrow: 'CERTIFICATE OF MASTERY',
  heading: 'AI EXPERT',
  certify: 'This is to certify that',
  completed: 'has completed every level of the',
  levelsLine: 'Beginner to Expert: every course, quiz and hands-on project',
  levelDone: (name: string) => `${name} level, complete`,
  dateIssued: 'Date issued',
  sealLabel: 'Talino AI Expert seal',
  highest: 'Talino’s highest certificate',
  // The card at the end of the journey on Home
  almostTitle: 'Your AI Expert certificate is almost here!',
  almostBody: 'Finish every level, Beginner to Expert, to earn Talino’s highest certificate.',
  levelsProgress: (done: number) => `${done} of 4 levels complete`,
  earnedTitle: 'You are a Certified AI Expert',
  earnedBody: 'You finished every level of the journey. Your certificate is ready to share.',
  view: 'View your certificate',
  fullAccess: 'Get full access',
  notYet: 'Finish every level of the journey to earn this certificate.',
  notYetBody: 'Complete Beginner, Intermediate, Advanced and Expert on Home. Your progress is kept as you go.',
  backToJourney: 'Go to my journey',
};

export const journeyCertificateStrings = defineStrings({ en, fil: en });
