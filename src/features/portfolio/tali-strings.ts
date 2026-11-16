import { defineStrings } from '@/lib/i18n';

const en = {
  // Review
  reviewTitle: 'Review my portfolio',
  reviewBody: 'Tali reads your page like a recruiter or a client would, then tells you what is missing and what to improve. You apply the changes you like.',
  reviewButton: 'Review with Tali',
  reviewing: 'Reviewing…',
  missingTitle: 'What’s missing',
  changesTitle: 'Suggested changes',
  optionsTitle: 'Other headlines',
  orderTitle: 'Project order',
  applyOrder: 'Apply order',
  orderApplied: 'Order applied',
  layoutTitle: 'What to lead with',
  skip: 'Skip',
  kinds: { headline: 'Headline', about: 'About', project_summary: 'Project summary', project_description: 'Project story' } as Record<string, string>,
  areas: { headline: 'Headline', about: 'About', projects: 'Projects', screenshots: 'Screenshots', links: 'Links', skills: 'Skills', certificates: 'Certificates', photo: 'Photo', other: 'Other' } as Record<string, string>,
  for: (title: string) => `For ${title}`,
  // In the project editor
  projectTitle: 'Write it up with Tali',
  projectBody: 'Jot a few rough words in “The story”. Tali turns them into a one-line summary and a clear write-up, using only what you wrote.',
  projectNeedTitle: 'Give the project a name first.',
  projectNeedNotes: 'Add a few rough words about it in “The story” first, so Tali has something true to write from.',
  button: 'Write with Tali',
  working: 'Writing…',
  again: 'Try again',
  summary: 'Summary',
  story: 'The story',
  headline: 'Headline',
  about: 'About',
  use: 'Use',
  used: 'Added',
  asks: 'Tali would like to know',
  // On the Portfolio screen
  pageTitle: 'Let Tali write your page',
  pageBody: 'Tali drafts your headline, About text and project write-ups from your résumé and your own words. You choose what to keep.',
  pageNothing: 'Add a skill, a résumé entry or a project first, so Tali has something true to write from.',
  pageDone: 'Everything on your page already has text. Clear a field or a project’s story to ask Tali for a new draft.',
  saveFailed: 'That couldn’t be saved. Try again.',
};

/** Tali (or Tala) helping with the portfolio's words. English only for now: the Filipino table repeats it. */
export const taliStrings = defineStrings({ en, fil: en });
