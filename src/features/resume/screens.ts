import type { ScreenEntry } from '../screen-registry';
import type { ScreenPresets } from '@/navigation/presets';

import { screenTitles } from '../screen-titles';

/** The résumé, portfolio and templates' stack screens: forms and tailoring as sheets, the rest pushed. */
export function resumeScreens(presets: ScreenPresets): ScreenEntry[] {
  const titles = screenTitles[presets.language];
  return [
    { name: 'resume/index', options: presets.push(titles.resume) },
    { name: 'resume/create', options: presets.push(titles.resumeCreate) },
    { name: 'resume/import', options: presets.push(titles.resumeImport) },
    { name: 'resume/document/[id]', options: presets.push('') },
    { name: 'resume/profile', options: presets.pageSheet(titles.resumeProfile) },
    { name: 'resume/item/new', options: presets.pageSheet(titles.resumeAddEntry) },
    { name: 'resume/item/[id]', options: presets.pageSheet(titles.resumeEditEntry) },
    { name: 'resume/tailor', options: presets.pageSheet(titles.resumeTailor) },
    { name: 'portfolio', options: presets.push(titles.portfolio) },
    { name: 'templates/index', options: presets.push(titles.templates) },
    { name: 'templates/[id]', options: presets.push('') },
    { name: 'job-boards', options: presets.push(titles.jobBoards) },
    { name: 'career-kit/index', options: presets.push(titles.careerKit) },
    { name: 'career-kit/[id]', options: presets.push('') },
  ];
}
