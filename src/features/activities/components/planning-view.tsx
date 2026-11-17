import type { ActivitySession } from '../hooks/use-activity-session';
import type { PlanningActivity } from '../types';
import { ActivityFrame } from './activity-frame';
import { PlanningPrioritizePanel } from './planning-prioritize-panel';
import { PlanningSchedulePanel } from './planning-schedule-panel';

export type PlanningViewProps = { activity: PlanningActivity; session: ActivitySession };

/** The Productivity Challenge: sort a workload into the Eisenhower matrix, or build a day that survives a surprise. The mode picks the panel. */
export function PlanningView({ activity, session }: PlanningViewProps) {
  const { challenge } = activity;
  return (
    <ActivityFrame session={session}>
      {challenge.mode === 'prioritize' ? <PlanningPrioritizePanel activity={activity} challenge={challenge} session={session} /> : <PlanningSchedulePanel activity={activity} challenge={challenge} session={session} />}
    </ActivityFrame>
  );
}
