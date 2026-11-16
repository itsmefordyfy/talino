import { router } from 'expo-router';

import { useOpenLesson } from '@/features/courses';
import { useLocalized } from '@/hooks/use-strings';

import type { MilestoneState } from '../lib/types';
import { journeyStrings } from '../strings';

/**
 * What tapping Start, Continue or Ask Tali does for a milestone. One place, used by the map's header and the milestone's details, so
 * they can never lead somewhere different. Lessons open through `useOpenLesson`, which sends a learner without access to the paywall.
 *
 * `fromSheet`: the milestone's details are a page sheet, and a screen pushed from inside a sheet opens inside it. So from the sheet
 * every step first closes the sheet, then opens its screen full size on the main stack (owner, 2026-11-16: "when start learning it
 * should go to new screen instead of bottomsheet"); Back from it returns to the journey.
 */
export function useMilestoneActions({ fromSheet = false }: { fromSheet?: boolean } = {}) {
  const openLesson = useOpenLesson();
  const text = useLocalized(journeyStrings);

  /** Runs a navigation, closing the milestone sheet first when called from it. */
  const leave = (navigate: () => void) => {
    if (fromSheet && router.canDismiss()) router.dismiss();
    navigate();
  };

  /** Goes to the milestone's next step. Returns false when there is none to go to. */
  const go = (milestone: MilestoneState): boolean => {
    const next = milestone.next;
    // Nothing in a locked milestone opens until the course before it is finished.
    if (!next || milestone.status === 'locked') return false;
    leave(() => {
      if (next.type === 'lesson') openLesson(next.lessonId);
      else if (next.type === 'project') router.push({ pathname: '/project/[id]', params: { id: next.projectId } });
      else if (next.action === 'portfolio') router.push('/portfolio');
      else router.push('/resume');
    });
    return true;
  };

  /** Opens Tali with a question about the milestone, and with the lesson or project it is on when there is one, so the answer is about THAT. */
  const askTali = (milestone: MilestoneState | null) => {
    if (!milestone) {
      router.push('/tali');
      return;
    }
    const next = milestone.next;
    const focus = next?.type === 'lesson' ? `lesson:${next.lessonId}` : next?.type === 'project' ? `project:${next.projectId}` : undefined;
    router.push({ pathname: '/tali', params: focus ? { prompt: text.sheet.askPrompt(milestone.def.title), focus } : { prompt: text.sheet.askPrompt(milestone.def.title) } });
  };

  const open = (milestone: MilestoneState) => router.push({ pathname: '/journey/[id]', params: { id: milestone.id } });
  const customize = () => router.push('/journey/customize');
  return { go, askTali, open, customize, leave };
}
