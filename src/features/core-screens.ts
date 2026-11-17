import type { ScreenEntry } from './screen-registry';
import type { ScreenPresets } from '@/navigation/presets';

import { withCompanionName } from './companion/lib/companions';
import { feedbackStrings } from './feedback/strings';
import { screenTitles } from './screen-titles';
import { whatsNewStrings } from './whats-new/strings';

/** Learning, Tali, the paywall, certificates, onboarding and settings. */
export function coreScreens(presets: ScreenPresets): ScreenEntry[] {
  const titles = withCompanionName(screenTitles[presets.language], presets.companion);
  return [
    { name: 'course/[id]', options: presets.push('') },
    { name: 'lesson/[id]', options: presets.push('') },
    { name: 'project/[id]', options: presets.push('') },
    { name: 'mission-complete', options: presets.pageSheet(titles.missionComplete) },
    { name: 'certificate/[courseId]', options: presets.push(titles.certificate) },
    { name: 'paywall', options: presets.pageSheet(titles.paywall) },
    { name: 'subscription', options: presets.push(titles.subscription) },
    { name: 'journey/[id]', options: presets.pageSheet('') },
    { name: 'journey/customize', options: presets.pageSheet('') },
    // My Learning: the courses Home can show, picked without leaving Home.
    { name: 'journey/courses', options: presets.pageSheet('') },
    { name: 'tali', options: presets.pageSheet(titles.tali) },
    { name: 'coach-history', options: presets.pageSheet(titles.coachHistory) },
    { name: 'recommend', options: presets.pageSheet(titles.recommend) },
    { name: 'badges', options: presets.push(titles.badges) },
    { name: 'badge/[id]', options: presets.pageSheet('') },
    { name: 'ai-tools', options: presets.push(titles.aiTools) },
    { name: 'ai-path-check', options: presets.pageSheet(titles.aiPathCheck) },
    { name: 'concept-lab/index', options: presets.push(titles.conceptLab) },
    { name: 'concept-lab/[id]', options: presets.push('') },
    { name: 'learning-profile', options: presets.push(titles.learningProfile) },
    { name: 'my-plan', options: presets.push(titles.myPlan) },
    { name: 'settings/index', options: presets.push(titles.settings) },
    { name: 'settings/backup', options: presets.push(titles.backup) },
    { name: 'whats-new', options: presets.pageSheet(whatsNewStrings[presets.language].title) },
    { name: 'settings/feedback', options: presets.pageSheet(feedbackStrings[presets.language].title) },
    // The photo crop (lib/crop-request): over a sheet or a page, with no header of its own; swiping down would lose the photo, so Cancel is the way out.
    { name: 'crop', options: { ...presets.fullScreen(), gestureEnabled: false } },
  ];
}
