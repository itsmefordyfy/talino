import { defineStrings } from '@/lib/i18n';

const en = {
  // Improving a job, project or study description
  styles: { professional: 'Rewrite professionally', concise: 'Make it concise', achievements: 'Highlight achievements' } as Record<string, string>,
  stylesLabel: 'How to improve it',
  improveAgain: 'Try again',
  // Headline and summary help in the résumé editor
  summaryTitle: 'Headline and summary with Tali',
  summaryBody: 'Tali drafts a headline and a short summary from what is in this résumé. You choose what to use.',
  summaryNeedFacts: 'Add a skill or an entry to this résumé first, so Tali has something true to write from.',
  summaryButton: 'Write with Tali',
  summaryWorking: 'Writing…',
  summaryHeadline: 'Headline',
  summarySummary: 'Summary',
  use: 'Use',
  used: 'Added',
  asks: 'Tali would like to know',
  headlineAlt: 'Another headline',
  unusable: 'Tali couldn’t write this from what’s in your profile yet. Add a few more details, like what you built and the tools you used, then try again.',
  outdated: 'This feature isn’t available on the server yet. Please update Talino and try again.',
};

/** What the learner reads when a drafting or review request fails in a way the shared AI messages don't cover. English only for now: the Filipino table repeats it. */
export const draftStrings = defineStrings({ en, fil: en });
