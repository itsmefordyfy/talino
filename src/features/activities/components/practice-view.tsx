import { Notice } from '@/components/ui/notice';
import { findLab, findMessageTask, findScenario } from '@/features/practice/catalog';
import { practiceStrings } from '@/features/practice/strings';
import { useLocalized } from '@/hooks/use-strings';

import type { ActivitySession } from '../hooks/use-activity-session';
import type { MessageReviewActivity, PromptLabActivity, RoleplayActivity } from '../types';
import { ActivityFrame } from './activity-frame';
import { LabView } from './lab-view';
import { MessageReviewView } from './message-review-view';
import { RoleplayView } from './roleplay-view';

export type PracticeViewProps = {
  activity: RoleplayActivity | MessageReviewActivity | PromptLabActivity;
  session: ActivitySession;
  /** Where the activity sits, kept with each saved try so the history and the project summary know. */
  courseId?: string;
  lessonId?: string;
};

/**
 * The two AI practice activities, one entry: a role-play with a simulated person, or a message the coach reviews. The scenario or task is the
 * practice catalog's, by id; an id this version of the app does not know says so instead of crashing.
 */
export function PracticeView({ activity, session, courseId, lessonId }: PracticeViewProps) {
  const text = useLocalized(practiceStrings);
  if (activity.kind === 'roleplay') {
    const scenario = findScenario(activity.scenarioId);
    if (scenario) return <RoleplayView activity={activity} scenario={scenario} session={session} courseId={courseId} lessonId={lessonId} />;
  } else if (activity.kind === 'prompt-lab') {
    const lab = findLab(activity.labId);
    if (lab) return <LabView activity={activity} lab={lab} session={session} courseId={courseId} lessonId={lessonId} />;
  } else {
    const task = findMessageTask(activity.taskId);
    if (task) return <MessageReviewView activity={activity} task={task} session={session} courseId={courseId} lessonId={lessonId} />;
  }
  return (
    <ActivityFrame session={session}>
      <Notice tone="warning" message={text.ui.unknownItem} />
    </ActivityFrame>
  );
}
