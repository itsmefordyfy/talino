import type { ActivityAnswer, CheckResult, PlanningActivity } from '@/features/activities/types';

import { productivityStrings, type ProductivityText } from '../strings';
import { DEFAULT_PASS_RATIO, scoreMatrix } from './matrix';
import { scheduleProblems, scoreSchedule } from './schedule';
import { QUADRANTS, type PlanningChallenge } from '../types';

const defaultText = productivityStrings.en;

/** Everything wrong with a planning challenge's data, in plain words. Empty means the learner can be given it. */
export function planningProblems(challenge: PlanningChallenge): string[] {
  const problems: string[] = [];
  if (challenge.mode === 'prioritize') {
    const { tasks, passRatio } = challenge;
    if (tasks.length < 5 || tasks.length > 12) problems.push('a sorting exercise needs 5 to 12 tasks.');
    const ids = new Set<string>();
    for (const task of tasks) {
      if (ids.has(task.id)) problems.push(`duplicate task id "${task.id}".`);
      ids.add(task.id);
      if (!task.title.trim() || !task.why.trim()) problems.push(`task "${task.id}" needs a title and a reason.`);
      if (!QUADRANTS.includes(task.expected)) problems.push(`task "${task.id}" has an unknown box.`);
      if (task.alsoAcceptable?.includes(task.expected)) problems.push(`task "${task.id}" lists its best box as also acceptable.`);
    }
    // A sorting exercise that lets every task into one box teaches nothing.
    if (new Set(tasks.map((task) => task.expected)).size < 3) problems.push('the tasks should use at least three of the four boxes.');
    if (passRatio !== undefined && !(passRatio >= 0.5 && passRatio <= 1)) problems.push('passRatio must be between 0.5 and 1.');
    return problems;
  }
  return scheduleProblems(challenge.scenario, challenge.solution);
}

/** Checks a planning activity's answer by rules (`scoreMatrix`, `scoreSchedule`). Never throws; a wrong answer says why and may be tried again. */
export function checkPlanning(activity: PlanningActivity, answer: Extract<ActivityAnswer, { kind: 'planning' }>, text: ProductivityText = defaultText): CheckResult {
  const { challenge } = activity;
  if (challenge.mode === 'prioritize' && answer.mode === 'prioritize') {
    const result = scoreMatrix(challenge.tasks, answer.placements, challenge.passRatio ?? DEFAULT_PASS_RATIO);
    const total = challenge.tasks.length;
    const detail = { kind: 'planning' as const, mode: 'prioritize' as const, matrix: result };
    if (result.unplaced.length > 0) return { correct: false, partial: result.ratio, progress: true, feedback: text.sortUnplaced(result.unplaced.length), detail };
    const notes = result.wrong
      .slice(0, 3)
      .map((wrong) => {
        const task = challenge.tasks.find((candidate) => candidate.id === wrong.id)!;
        return text.sortWrongLine(task.title, task.why);
      })
      .join('\n');
    if (result.wrong.length === 0) return { correct: true, partial: 1, feedback: text.sortAllRight(total), detail };
    const lead = result.correct ? text.sortMostRight(result.right.length, total) : text.sortSomeRight(result.right.length, total);
    return { correct: result.correct, partial: result.ratio, feedback: `${lead}\n${notes}`, detail };
  }
  if (challenge.mode === 'schedule' && answer.mode === 'schedule') {
    const result = scoreSchedule(challenge.scenario, { blocks: answer.blocks, decisions: answer.decisions, afterInterruption: answer.afterInterruption });
    const order = [...result.blockers, ...result.findings.filter((finding) => finding.level === 'issue')];
    const feedback = result.passed ? text.planPassed : [text.planNotYet, ...order.slice(0, 4).map((finding) => text.findings(finding))].join('\n');
    return { correct: result.passed, partial: result.overall / 100, feedback, detail: { kind: 'planning', mode: 'schedule', schedule: result }, };
  }
  throw new Error(`The answer is for the "${answer.mode}" mode but the activity is "${challenge.mode}".`);
}
