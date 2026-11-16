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
import { TapRevealView } from './tap-reveal-view';

export type ActivityViewProps = {
  activity: Activity;
  guidance?: Guidance;
  /** Called for every check of an answer (a wrong try, a right one), with the hints used so far. */
  onAttempt: (event: AttemptEvent) => void;
  /** Called once, the first time the activity is solved. Not called again for practice of an already solved one. */
  onSolved: (event: SolvedEvent) => void;
  /** Already solved in an earlier visit. */
  solved?: boolean;
};

/** Renders any activity: the story, prompt, workspace, hints and feedback, and reports attempts and the solve. */
export function ActivityView({ activity, guidance = 'standard', onAttempt, onSolved, solved = false }: ActivityViewProps) {
  // Everything inside is keyed to the activity: moving to the next one starts clean.
  return <ActivityBody key={activity.id} activity={activity} guidance={guidance} onAttempt={onAttempt} onSolved={onSolved} solvedBefore={solved} />;
}

type ActivityBodyProps = { activity: Activity; guidance: Guidance; onAttempt: ActivityViewProps['onAttempt']; onSolved: ActivityViewProps['onSolved']; solvedBefore: boolean };

function ActivityBody({ activity, guidance, onAttempt, onSolved, solvedBefore }: ActivityBodyProps) {
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
  }
}
