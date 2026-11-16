import type { ScreenEntry } from '../screen-registry';
import type { ScreenPresets } from '@/navigation/presets';

import { careerStrings } from './strings';

/** The career tracker's stack screens: lists push, forms open as page sheets. */
export function careerScreens(presets: ScreenPresets): ScreenEntry[] {
  const strings = careerStrings[presets.language];
  return [
    { name: 'career/applications', options: presets.push(strings.applicationsTitle) },
    { name: 'career/application/new', options: presets.pageSheet(strings.newApplication) },
    { name: 'career/application/[id]', options: presets.pageSheet(strings.editApplication) },
    { name: 'career/income/index', options: presets.push(strings.incomeListTitle) },
    { name: 'career/income/new', options: presets.pageSheet(strings.newIncome) },
    { name: 'career/income/[id]', options: presets.pageSheet(strings.editIncome) },
    { name: 'career/goal/new', options: presets.pageSheet(strings.newGoal) },
    { name: 'career/goal/[id]', options: presets.pageSheet(strings.editGoal) },
  ];
}
