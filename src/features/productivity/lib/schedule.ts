import {
  DECISION_ACTIONS,
  DEFAULT_RULES,
  DIMENSION_PASS,
  OVERALL_PASS,
  type Block,
  type Decision,
  type Finding,
  type FixedBlock,
  type PlanDimension,
  type Priority,
  type ScheduleAnswer,
  type ScheduleResult,
  type ScheduleRules,
  type ScheduleScenario,
  type ScheduleTask,
} from '../types';

/**
 * Scores a day plan by rules, never by a model. The aim is a plan a real person could live through: no overlaps, nothing outside the day, the
 * must-do work done in time, rest and slack kept, and an honest decision about what did not fit. **Hard failures (`blockers`) never pass**,
 * whatever the other scores are, so a schedule with no breaks or no room for the unexpected is never rewarded.
 */

type Span = { id: string; title: string; start: number; minutes: number };
const end = (span: Pick<Span, 'start' | 'minutes'>) => span.start + span.minutes;
const RANK: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

export const resolveRules = (scenario: ScheduleScenario): ScheduleRules => ({ ...DEFAULT_RULES, ...scenario.rules });

/** The commitments in the day: the fixed ones, plus the interruption once it has happened. */
export function allFixedBlocks(scenario: ScheduleScenario, afterInterruption: boolean): FixedBlock[] {
  const { interruption } = scenario;
  if (!afterInterruption || !interruption) return scenario.fixed;
  return [...scenario.fixed, { id: interruption.id, title: interruption.title, start: interruption.start, minutes: interruption.minutes, kind: 'interruption' }];
}

/** Pairs of items that share time. Items that only touch (one ends as the other starts) do not overlap. */
export function findOverlaps<T extends Span>(items: readonly T[]): [T, T][] {
  const pairs: [T, T][] = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const a = items[i]!;
      const b = items[j]!;
      if (a.start < end(b) && b.start < end(a)) pairs.push([a, b]);
    }
  }
  return pairs;
}

const isWork = (kind: string) => kind === 'task' || kind === 'meeting' || kind === 'class';

/** The stretches of work (tasks, meetings, classes) with no break between them, longest first by start. A gap or a break of `minBreak` minutes or more ends a stretch. */
export function focusRuns(scenario: ScheduleScenario, blocks: readonly Block[], minBreak: number, afterInterruption = false): { start: number; minutes: number }[] {
  const items = [
    ...blocks.filter((block) => block.kind === 'task').map((block) => ({ start: block.start, end: end(block) })),
    ...allFixedBlocks(scenario, afterInterruption).filter((fixed) => isWork(fixed.kind)).map((fixed) => ({ start: fixed.start, end: end(fixed) })),
  ].sort((a, b) => a.start - b.start);
  const rests = [
    ...blocks.filter((block) => block.kind === 'break' && block.minutes >= minBreak).map((block) => ({ start: block.start, end: end(block) })),
    ...allFixedBlocks(scenario, afterInterruption).filter((fixed) => !isWork(fixed.kind) && fixed.kind !== 'commute' && fixed.kind !== 'interruption').map((fixed) => ({ start: fixed.start, end: end(fixed) })),
  ];
  const runs: { start: number; minutes: number }[] = [];
  let current: { start: number; end: number } | null = null;
  for (const item of items) {
    const brokenBy = current ? rests.some((rest) => rest.start >= current!.end && rest.end <= item.start) : false;
    if (current && item.start - current.end < minBreak && !brokenBy) {
      current.end = Math.max(current.end, item.end);
    } else {
      if (current) runs.push({ start: current.start, minutes: current.end - current.start });
      current = { start: item.start, end: item.end };
    }
  }
  if (current) runs.push({ start: current.start, minutes: current.end - current.start });
  return runs;
}

/** Open time in the day between the commitments and the blocks, as {start, minutes}. Buffer blocks count as open time. */
export function freeGaps(scenario: ScheduleScenario, blocks: readonly Block[], afterInterruption = false): { start: number; minutes: number }[] {
  const busy = [...allFixedBlocks(scenario, afterInterruption), ...blocks.filter((block) => block.kind !== 'buffer')]
    .map((item) => ({ start: Math.max(item.start, scenario.windowStart), end: Math.min(end(item), scenario.windowEnd) }))
    .filter((span) => span.end > span.start)
    .sort((a, b) => a.start - b.start);
  const gaps: { start: number; minutes: number }[] = [];
  let cursor = scenario.windowStart;
  for (const span of busy) {
    if (span.start > cursor) gaps.push({ start: cursor, minutes: span.start - cursor });
    cursor = Math.max(cursor, span.end);
  }
  if (cursor < scenario.windowEnd) gaps.push({ start: cursor, minutes: scenario.windowEnd - cursor });
  return gaps;
}

const clean = (blocks: readonly Block[]) => blocks.filter((block) => Number.isFinite(block.start) && Number.isFinite(block.minutes) && block.minutes > 0);
const percent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function scoreSchedule(scenario: ScheduleScenario, answer: ScheduleAnswer): ScheduleResult {
  const rules = resolveRules(scenario);
  const fixed = allFixedBlocks(scenario, !!scenario.interruption && answer.afterInterruption);
  const blocks = clean(answer.blocks);
  const findings: Finding[] = [];
  const add = (finding: Finding) => findings.push(finding);
  const scores: Partial<Record<PlanDimension, number>> = {};

  // --- what each task got
  const taskBlocks = (task: ScheduleTask) => blocks.filter((block) => block.kind === 'task' && block.taskId === task.id);
  const given = scenario.tasks.map((task) => {
    const own = taskBlocks(task);
    return { task, minutes: own.reduce((sum, block) => sum + block.minutes, 0), first: own.length ? Math.min(...own.map((block) => block.start)) : null, last: own.length ? Math.max(...own.map((block) => end(block))) : null };
  });
  const scheduled = given.filter((entry) => entry.minutes > 0);
  const unscheduled = given.filter((entry) => entry.minutes === 0);

  // --- realistic planning
  let realistic = 100;
  const overlapPairs = findOverlaps([...blocks, ...fixed]).filter(([a, b]) => !(fixed.includes(a as FixedBlock) && fixed.includes(b as FixedBlock)));
  const seen = new Set<string>();
  for (const [a, b] of overlapPairs) {
    const withInterruption = [a, b].some((item) => (fixed as Span[]).includes(item) && (item as FixedBlock).kind === 'interruption');
    const key = [a.id, b.id].sort().join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    const other = (fixed as Span[]).includes(a) && (a as FixedBlock).kind === 'interruption' ? b : a;
    if (withInterruption) add({ code: 'interruptionOverlap', level: 'blocker', dimension: 'interruptions', params: { block: other.title, interruption: scenario.interruption?.title ?? '' } });
    else {
      add({ code: 'overlap', level: 'blocker', dimension: 'realisticPlanning', params: { a: a.title, b: b.title } });
      realistic -= 30;
    }
  }
  const outside = blocks.filter((block) => block.start < scenario.windowStart || end(block) > scenario.windowEnd);
  if (outside.length > 0) {
    add({ code: 'outsideWindow', level: 'blocker', dimension: 'realisticPlanning', params: { block: outside[0]!.title } });
    realistic -= 30;
  }
  const planned = blocks.filter((block) => block.kind === 'task').reduce((sum, block) => sum + block.minutes, 0);
  if (planned > rules.maxPlannedMinutes) {
    add({ code: 'overPacked', level: 'blocker', dimension: 'realisticPlanning', params: { planned, limit: rules.maxPlannedMinutes } });
    realistic -= 30;
  }
  const breakMinutes = blocks.filter((block) => block.kind === 'break').reduce((sum, block) => sum + block.minutes, 0);
  const fixedRest = fixed.filter((block) => block.kind === 'meal' || block.kind === 'rest').reduce((sum, block) => sum + block.minutes, 0);
  const restMinutes = breakMinutes + fixedRest;
  if (restMinutes === 0) {
    add({ code: 'noBreak', level: 'blocker', dimension: 'realisticPlanning', params: {} });
    realistic -= 40;
  } else if (restMinutes < rules.minBreakTotal) {
    add({ code: 'tooLittleBreak', level: 'issue', dimension: 'realisticPlanning', params: { rest: restMinutes, needed: rules.minBreakTotal } });
    realistic -= 25;
  }
  const longRuns = focusRuns(scenario, blocks, rules.minBreakMinutes, !!scenario.interruption && answer.afterInterruption).filter((run) => run.minutes > rules.maxFocusRun);
  for (const run of longRuns.slice(0, 2)) {
    add({ code: 'focusRunTooLong', level: 'blocker', dimension: 'realisticPlanning', params: { minutes: run.minutes, limit: rules.maxFocusRun } });
    realistic -= 25;
  }
  const slack = freeGaps(scenario, blocks, !!scenario.interruption && answer.afterInterruption).reduce((sum, gap) => sum + gap.minutes, 0);
  if (slack < rules.minSlack) {
    add({ code: 'noSlack', level: 'issue', dimension: 'realisticPlanning', params: { slack, needed: rules.minSlack } });
    realistic -= 20;
  }
  if (realistic === 100) add({ code: 'ruleKept', level: 'good', dimension: 'realisticPlanning', params: { rest: restMinutes, slack } });
  scores.realisticPlanning = percent(realistic);

  // --- time allocation
  let ok = 0;
  for (const { task, minutes, last } of scheduled) {
    let good = true;
    if (minutes < task.minutes * 0.9) {
      add({ code: 'tooShort', level: task.mustDo ? 'blocker' : 'issue', dimension: 'timeAllocation', params: { task: task.title, minutes, estimate: task.minutes } });
      good = false;
    } else if (minutes > task.minutes * 1.5) {
      add({ code: 'tooLong', level: 'issue', dimension: 'timeAllocation', params: { task: task.title, minutes, estimate: task.minutes } });
      good = false;
    }
    if (task.deadline !== undefined && last !== null && last > task.deadline) {
      add({ code: task.mustDo ? 'mustDoLate' : 'deadlineMissed', level: task.mustDo ? 'blocker' : 'issue', dimension: 'timeAllocation', params: { task: task.title } });
      good = false;
    }
    if (good) ok += 1;
  }
  scores.timeAllocation = scheduled.length === 0 ? 0 : percent((100 * ok) / scheduled.length);

  // --- prioritisation
  let pairs = 0;
  let inversions = 0;
  for (const high of scheduled) {
    for (const lower of scheduled) {
      if (RANK[high.task.priority] <= RANK[lower.task.priority]) continue;
      pairs += 1;
      const lowerHasEarlierDeadline = lower.task.deadline !== undefined && (high.task.deadline === undefined || lower.task.deadline < high.task.deadline);
      if (high.first! > lower.first! && !lowerHasEarlierDeadline) {
        inversions += 1;
        if (inversions <= 2) add({ code: 'inversion', level: 'issue', dimension: 'prioritization', params: { first: lower.task.title, later: high.task.title } });
      }
    }
  }
  let prioritization = pairs === 0 ? 100 : 100 * (1 - inversions / pairs);
  const highWaiting = unscheduled.filter((entry) => entry.task.priority === 'high');
  const lowDone = scheduled.filter((entry) => entry.task.priority === 'low');
  if (highWaiting.length > 0 && lowDone.length > 0) {
    add({ code: 'lowBeforeHigh', level: 'issue', dimension: 'prioritization', params: { low: lowDone[0]!.task.title, high: highWaiting[0]!.task.title } });
    prioritization -= Math.min(60, 30 * highWaiting.length);
  }
  scores.prioritization = scheduled.length === 0 ? 0 : percent(prioritization);

  // --- decisions about what did not fit
  const decisionFor = (task: ScheduleTask): Decision | undefined => answer.decisions.find((decision) => decision.taskId === task.id);
  let goodDecisions = 0;
  for (const { task } of unscheduled) {
    const decision = decisionFor(task);
    if (task.mustDo) {
      add({ code: decision ? 'mustDoDeferred' : 'mustDoMissing', level: 'blocker', dimension: 'decisionMaking', params: { task: task.title } });
    } else if (!decision) {
      add({ code: 'decisionMissing', level: 'issue', dimension: 'decisionMaking', params: { task: task.title } });
    } else if (!(task.okActions ?? DECISION_ACTIONS).includes(decision.action)) {
      add({ code: 'decisionPoor', level: 'issue', dimension: 'decisionMaking', params: { task: task.title, action: decision.action } });
    } else goodDecisions += 1;
  }
  if (unscheduled.length === 0) add({ code: 'allFit', level: 'good', dimension: 'decisionMaking', params: {} });
  scores.decisionMaking = unscheduled.length === 0 ? 100 : percent((100 * goodDecisions) / unscheduled.length);

  // --- the interruption
  if (scenario.interruption) {
    if (!answer.afterInterruption) {
      add({ code: 'interruptionUnhandled', level: 'blocker', dimension: 'interruptions', params: { interruption: scenario.interruption.title } });
      scores.interruptions = 0;
    } else {
      scores.interruptions = findings.some((finding) => finding.code === 'interruptionOverlap') ? 0 : 100;
    }
  }

  const present = Object.values(scores);
  const overall = present.length === 0 ? 0 : Math.round(present.reduce((sum, value) => sum + value, 0) / present.length);
  const blockers = findings.filter((finding) => finding.level === 'blocker');
  const passed = blockers.length === 0 && present.every((value) => value >= DIMENSION_PASS) && overall >= OVERALL_PASS;
  return { scores, overall, blockers, findings, passed, totals: { planned, rest: restMinutes, slack } };
}

/** Everything wrong with a scenario and its reference plan, in plain words. Empty means the scenario is well formed and its solution meets its own rules. */
export function scheduleProblems(scenario: ScheduleScenario, solution: { blocks: Block[]; decisions: Decision[] }): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const unique = (id: string, what: string) => {
    if (ids.has(id)) problems.push(`duplicate ${what} id "${id}".`);
    ids.add(id);
  };
  if (!scenario.dayLabel.trim()) problems.push('dayLabel is empty.');
  if (!(scenario.windowStart >= 0 && scenario.windowEnd <= 1440 && scenario.windowEnd - scenario.windowStart >= 240)) problems.push('the day window must be at least four hours inside 0 to 1440.');
  if (scenario.tasks.length < 3) problems.push('needs at least 3 tasks.');
  for (const task of scenario.tasks) {
    unique(task.id, 'task');
    if (!task.title.trim()) problems.push(`task ${task.id} has no title.`);
    if (!(task.minutes >= 15 && task.minutes <= 480)) problems.push(`task ${task.id} needs an estimate of 15 to 480 minutes.`);
    if (task.deadline !== undefined && task.deadline > scenario.windowEnd) problems.push(`task ${task.id} has a deadline after the day ends.`);
  }
  for (const block of scenario.fixed) {
    unique(block.id, 'fixed block');
    if (block.start < scenario.windowStart || end(block) > scenario.windowEnd) problems.push(`fixed block ${block.id} is outside the day.`);
  }
  if (scenario.interruption) {
    unique(scenario.interruption.id, 'interruption');
    if (scenario.interruption.start < scenario.windowStart || end(scenario.interruption) > scenario.windowEnd) problems.push('the interruption is outside the day.');
    if (!scenario.interruption.note.trim()) problems.push('the interruption has no note.');
  }
  if (findOverlaps(scenario.fixed).length > 0) problems.push('two fixed blocks overlap.');
  if (!scenario.tasks.some((task) => task.mustDo)) problems.push('needs at least one must-do task.');
  if (problems.length > 0) return problems;
  const result = scoreSchedule(scenario, { blocks: solution.blocks, decisions: solution.decisions, afterInterruption: true });
  if (!result.passed) {
    const why = result.blockers.length > 0 ? `blocked by ${result.blockers.map((finding) => finding.code).join(', ')}` : `overall ${result.overall}, ${JSON.stringify(result.scores)}`;
    problems.push(`the reference solution does not pass its own rules (${why}).`);
  }
  return problems;
}
