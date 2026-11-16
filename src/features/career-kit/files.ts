/* eslint-disable @typescript-eslint/no-require-imports -- Metro bundles an asset only from a literal `require`, so the list can't be imports or built in a loop. */
/**
 * The career kit's template files, bundled with the app. Metro needs each `require` written out, so this is a list, and a test checks it
 * against `content.ts` and the files in `assets/career-kit`. Made by `scripts/career-kit/generate_docs.py` and `generate_decks.py`.
 */
export const KIT_FILES: Record<string, number> = {
  'resume-sidebar': require('@/assets/career-kit/resume-sidebar.docx'),
  'resume-header': require('@/assets/career-kit/resume-header.docx'),
  'resume-minimal': require('@/assets/career-kit/resume-minimal.docx'),
  'portfolio-spotlight': require('@/assets/career-kit/portfolio-spotlight.docx'),
  'portfolio-grid': require('@/assets/career-kit/portfolio-grid.docx'),
  'portfolio-story': require('@/assets/career-kit/portfolio-story.docx'),
  'case-study-bold': require('@/assets/career-kit/case-study-bold.pptx'),
  'case-study-clean': require('@/assets/career-kit/case-study-clean.pptx'),
  'case-study-dark': require('@/assets/career-kit/case-study-dark.pptx'),
  'proposal-tiers': require('@/assets/career-kit/proposal-tiers.docx'),
  'proposal-one-page': require('@/assets/career-kit/proposal-one-page.docx'),
  'proposal-letter': require('@/assets/career-kit/proposal-letter.docx'),
  'invoice-classic': require('@/assets/career-kit/invoice-classic.docx'),
  'invoice-modern': require('@/assets/career-kit/invoice-modern.docx'),
  'invoice-compact': require('@/assets/career-kit/invoice-compact.docx'),
};
