import type { ComponentProps } from 'react';

import { useActivitySession, type AttemptEvent, type SolvedEvent } from '../hooks/use-activity-session';
import type { Activity, Guidance } from '../types';
import { ArrangeView } from './arrange-view';
import { CodeChallengeView } from './code-challenge-view';
import { FillBlankView } from './fill-blank-view';
import { FixBugView } from './fix-bug-view';
import { MatchView } from './match-view';
import { PredictOutputView } from './predict-output-view';
import { ScenarioView } from './scenario-view';
import { SqlChallengeView } from './sql-challenge-view';
import type { PracticeView as PracticeViewType } from './practice-view';
import { TapRevealView } from './tap-reveal-view';
import { PlanningView } from './planning-view';
import { WorkflowBuilderView } from './workflow-builder-view';

/**
 * The practice engine (role-play, message coach) pulls in the coach, the store and the database hooks. It is required when a learner reaches one of
 * its activities, not at import time, so the quiz-style kinds, and every module and test that only needs them, don't carry that whole graph (and its
 * import cycle with the coach and the courses) along.
 */
function LazyPracticeView(props: ComponentProps<typeof PracticeViewType>) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PracticeView } = require('./practice-view') as typeof import('./practice-view');
  return <PracticeView {...props} />;
}

export type ActivityViewProps = {
  activity: Activity;
  guidance?: Guidance;
  /** Called for every check of an answer (a wrong try, a right one), with the hints used so far. */
  onAttempt: (event: AttemptEvent) => void;
  /** Called once, the first time the activity is solved. Not called again for practice of an already solved one. */
  onSolved: (event: SolvedEvent) => void;
  /** Already solved in an earlier visit. */
  solved?: boolean;
  /** Where the activity sits. The practice activities (role-play, message coach) keep them with each saved try. */
  courseId?: string;
  lessonId?: string;
};

/** Renders any activity: the story, prompt, workspace, hints and feedback, and reports attempts and the solve. */
export function ActivityView({ activity, guidance = 'standard', onAttempt, onSolved, solved = false, courseId, lessonId }: ActivityViewProps) {
  // Everything inside is keyed to the activity: moving to the next one starts clean.
  return <ActivityBody key={activity.id} activity={activity} guidance={guidance} onAttempt={onAttempt} onSolved={onSolved} solvedBefore={solved} courseId={courseId} lessonId={lessonId} />;
}

type ActivityBodyProps = { activity: Activity; guidance: Guidance; onAttempt: ActivityViewProps['onAttempt']; onSolved: ActivityViewProps['onSolved']; solvedBefore: boolean; courseId?: string; lessonId?: string };

function ActivityBody({ activity, guidance, onAttempt, onSolved, solvedBefore, courseId, lessonId }: ActivityBodyProps) {
  const session = useActivitySession({ activity, guidance, onAttempt, onSolved, solvedBefore });
  switch (activity.kind) {
    case 'tap-reveal':
      return <TapRevealView activity={activity} session={session} />;
    case 'predict-output':
      return <PredictOutputView activity={activity} session={session} />;
    case 'fix-bug':
      return <FixBugView activity={activity} session={session} />;
    case 'arrange':
      return <ArrangeView activity={activity} session={session} />;
    case 'fill-blank':
      return <FillBlankView activity={activity} session={session} />;
    case 'match':
      return <MatchView activity={activity} session={session} />;
    case 'scenario':
      return <ScenarioView activity={activity} session={session} />;
    case 'code-challenge':
      return <CodeChallengeView activity={activity} session={session} />;
    case 'sql-challenge':
      return <SqlChallengeView activity={activity} session={session} />;
    // Completed by the practice session (turns and a debrief, or a reviewed message), not answered like a quiz.
    case 'workflow-builder':
      return <WorkflowBuilderView activity={activity} session={session} />;
    case 'planning':
      return <PlanningView activity={activity} session={session} />;
    case 'roleplay':
    case 'message-review':
    case 'prompt-lab':
      return <LazyPracticeView activity={activity} session={session} courseId={courseId} lessonId={lessonId} />;
  }
}
