import { compareSql, createSqlSandbox, runCodeTests, runJs, validateSelect } from '@/features/code-runner';
import type { SqlRunResult, TestReport } from '@/features/code-runner';

import { activityStrings, type ActivityText } from '../strings';
import type {
  Activity,
  ActivityAnswer,
  ArrangeActivity,
  CaseOutcome,
  CheckResult,
  CodeChallengeActivity,
  FillBlankActivity,
  FixBugActivity,
  MatchActivity,
  PredictOutputActivity,
  ScenarioActivity,
  SqlChallengeActivity,
  TapRevealActivity,
} from '../types';
import { checkPlanning } from '@/features/productivity/lib/planning';
import { checkWorkflow } from './workflow';
import { recordRobotCommands, simulateRobot } from './robot';
import { formatValue, normalizeCode, normalizeOutput, replaceLine } from './text';

const defaultText = activityStrings.en;

/** The text a JavaScript predict-output snippet prints, found by running it; falls back to `expected`. Null when neither is available. */
export function expectedOutputOf(activity: PredictOutputActivity): string | null {
  if (activity.language.toLowerCase() === 'javascript') {
    const run = runJs(activity.code);
    if (run.ok && !run.error) return normalizeOutput(run.output.join('\n'));
  }
  return activity.expected !== undefined ? normalizeOutput(activity.expected) : null;
}

export function checkTapReveal(activity: TapRevealActivity, opened: readonly number[], text: ActivityText = defaultText): CheckResult {
  const seen = new Set(opened.filter((index) => index >= 0 && index < activity.cards.length));
  const remaining = activity.cards.length - seen.size;
  return remaining === 0
    ? { correct: true, partial: 1, feedback: text.tapRevealDone, detail: { kind: 'tap-reveal', remaining: 0 } }
    : { correct: false, partial: seen.size / activity.cards.length, progress: true, feedback: text.tapRevealLeft(remaining), detail: { kind: 'tap-reveal', remaining } };
}

export function checkPredictOutput(activity: PredictOutputActivity, answer: string, text: ActivityText = defaultText): CheckResult {
  const expected = expectedOutputOf(activity);
  const given = normalizeOutput(answer);
  const lines = (value: string) => (value === '' ? 0 : value.split('\n').length);
  if (expected === null) return { correct: false, feedback: text.predictWrong };
  if (given === expected) return { correct: true, partial: 1, feedback: text.predictRight, detail: { kind: 'predict-output', actualLines: lines(given), expectedLines: lines(expected) } };

  const detail = { kind: 'predict-output' as const, actualLines: lines(given), expectedLines: lines(expected) };
  const noted = Object.entries(activity.wrongNotes ?? {}).find(([key]) => normalizeOutput(key) === given);
  let feedback: string;
  if (noted) feedback = noted[1];
  else if (given === '') feedback = text.predictWrong;
  else if (lines(given) !== lines(expected)) feedback = text.predictLines(lines(expected), lines(given));
  else if (given.toLowerCase() === expected.toLowerCase()) feedback = text.predictCase;
  else if (given.replace(/\s+/g, '') === expected.replace(/\s+/g, '')) feedback = text.predictSpaces;
  else if (given.split('\n').map((line) => line.replace(/^(["'`])(.*)\1$/, '$2')).join('\n') === expected) feedback = text.predictQuotes;
  else feedback = text.predictWrong;
  return { correct: false, partial: 0, feedback, detail };
}

function firstTestFailure(report: TestReport, text: ActivityText): string {
  if (report.error) return text.codeErrorFeedback(report.error.line, report.error.message);
  const failed = report.results.find((result) => !result.pass && !result.hidden);
  if (!failed) return report.results.some((result) => !result.pass) ? text.hiddenFail : text.testsNone;
  return describeCase(failed, text).message;
}

export function checkFixBug(activity: FixBugActivity, answer: { line: number; fix?: string }, text: ActivityText = defaultText): CheckResult {
  if (answer.line !== activity.bugLine) {
    return { correct: false, partial: 0, feedback: activity.lineNote ?? text.fixLineWrong(answer.line), detail: { kind: 'fix-bug', stage: 'line' } };
  }
  if (answer.fix === undefined) {
    return { correct: false, partial: 0.5, progress: true, feedback: text.fixLineRight(activity.bugLine), detail: { kind: 'fix-bug', stage: 'fix' } };
  }
  const given = normalizeCode(answer.fix);
  const listed = activity.fixes.find((fix) => normalizeCode(fix.line) === given);
  if (listed?.correct) return { correct: true, partial: 1, feedback: listed.why, detail: { kind: 'fix-bug', stage: 'done' } };
  if (listed) return { correct: false, partial: 0.5, feedback: listed.why, detail: { kind: 'fix-bug', stage: 'fix' } };
  if (activity.tests && given !== '') {
    const report = runCodeTests(replaceLine(activity.code, activity.bugLine, answer.fix), activity.tests, undefined, text.runner);
    if (report.total > 0 && report.passed === report.total && !report.error) {
      return { correct: true, partial: 1, feedback: text.fixRight, detail: { kind: 'fix-bug', stage: 'done' } };
    }
    return { correct: false, partial: 0.5, feedback: text.fixTests(firstTestFailure(report, text)), detail: { kind: 'fix-bug', stage: 'fix' } };
  }
  return { correct: false, partial: 0.5, feedback: text.fixWrong, detail: { kind: 'fix-bug', stage: 'fix' } };
}

function matchesAt(order: readonly string[], target: readonly string[]): boolean[] {
  return target.map((line, index) => order[index] === line);
}

function prefixLength(flags: readonly boolean[]): number {
  const index = flags.indexOf(false);
  return index === -1 ? flags.length : index;
}

export function checkArrange(activity: ArrangeActivity, order: readonly string[], text: ActivityText = defaultText): CheckResult {
  const targets = [activity.solution, ...(activity.alternatives ?? [])];
  let best = { target: targets[0], flags: matchesAt(order, targets[0]) };
  for (const target of targets) {
    const flags = matchesAt(order, target);
    const better = prefixLength(flags) > prefixLength(best.flags) || (prefixLength(flags) === prefixLength(best.flags) && flags.filter(Boolean).length > best.flags.filter(Boolean).length);
    if (better) best = { target, flags };
  }
  const complete = order.length === best.target.length && best.flags.every(Boolean);
  if (complete) return { correct: true, partial: 1, feedback: text.arrangeRight, detail: { kind: 'arrange', firstWrong: null, inPlace: best.flags } };

  const firstWrong = prefixLength(best.flags);
  const reason = best.target === activity.solution ? activity.reasons?.[firstWrong] : undefined;
  const lead = firstWrong > 0 ? `${text.arrangePrefix(firstWrong)} ` : '';
  const feedback = `${lead}${text.arrangeWrong(firstWrong + 1)}${reason ? ` ${reason}` : ''}`;
  return { correct: false, partial: best.flags.filter(Boolean).length / best.target.length, feedback, detail: { kind: 'arrange', firstWrong, inPlace: best.flags } };
}

export function checkFillBlank(activity: FillBlankActivity, values: readonly string[], text: ActivityText = defaultText): CheckResult {
  const blanks = activity.blanks.map((blank, index) => {
    const given = normalizeCode(values[index] ?? '');
    if (given === '') return { correct: false, feedback: text.blankEmpty };
    if (blank.answers.some((answer) => normalizeCode(answer) === given)) return { correct: true, feedback: text.blankRight };
    return { correct: false, feedback: blank.feedback ?? text.blankWrong };
  });
  const right = blanks.filter((blank) => blank.correct).length;
  if (right === blanks.length) return { correct: true, partial: 1, feedback: text.fillRight, detail: { kind: 'fill-blank', blanks } };
  const firstWrong = blanks.findIndex((blank) => !blank.correct);
  const feedback = `${text.fillSome(right, blanks.length)} ${text.blankLabel(firstWrong + 1)}: ${blanks[firstWrong].feedback}`;
  return { correct: false, partial: right / blanks.length, feedback, detail: { kind: 'fill-blank', blanks } };
}

export function checkMatch(activity: MatchActivity, pairs: Readonly<Record<number, number>>, text: ActivityText = defaultText): CheckResult {
  const entries = Object.entries(pairs).map(([term, definition]) => [Number(term), definition] as const).filter(([term]) => term >= 0 && term < activity.pairs.length);
  const right = entries.filter(([term, definition]) => term === definition).map(([term]) => term);
  const wrong = entries.filter(([term, definition]) => term !== definition).map(([term]) => term);
  const partial = right.length / activity.pairs.length;
  if (right.length === activity.pairs.length) return { correct: true, partial: 1, feedback: text.matchRight, detail: { kind: 'match', right, wrong } };
  if (wrong.length === 0) return { correct: false, partial, progress: true, feedback: text.matchProgress(right.length, activity.pairs.length), detail: { kind: 'match', right, wrong } };
  const [term, definition] = entries.find(([t, d]) => t !== d) as readonly [number, number];
  const note = activity.pairs[definition]?.note;
  const feedback = `${text.matchWrong(activity.pairs[term].term, activity.pairs[definition]?.definition ?? '')}${note ? ` ${note}` : ''}`;
  return { correct: false, partial, feedback, detail: { kind: 'match', right, wrong } };
}

export function checkScenario(activity: ScenarioActivity, option: number, text: ActivityText = defaultText): CheckResult {
  const chosen = activity.options[option];
  if (!chosen) return { correct: false, feedback: text.notYet };
  if (chosen.quality === 'best') return { correct: true, partial: 1, feedback: `${chosen.consequence} ${text.scenarioBest}`, detail: { kind: 'scenario', quality: 'best' } };
  if (chosen.quality === 'acceptable') return { correct: false, partial: 0.6, feedback: `${chosen.consequence} ${text.scenarioAcceptable}`, detail: { kind: 'scenario', quality: 'acceptable' } };
  return { correct: false, partial: 0, feedback: `${chosen.consequence} ${text.scenarioPoor}`, detail: { kind: 'scenario', quality: 'poor' } };
}

/** A test result in plain language: what was asked, what the code gave, what it should give. */
export function describeCase(result: TestReport['results'][number], text: ActivityText = defaultText): CaseOutcome {
  if (result.pass) return { label: result.label, pass: true, hidden: result.hidden, message: text.checkPassed };
  if (result.hidden) return { label: result.label, pass: false, hidden: true, message: text.hiddenFail };
  if (result.error) return { label: result.label, pass: false, hidden: false, message: text.caseError(result.label, result.error) };
  return { label: result.label, pass: false, hidden: false, message: text.caseWrong(result.label, formatValue(result.actual), formatValue(result.expected)) };
}

function checkRobot(activity: CodeChallengeActivity, world: Extract<CodeChallengeActivity['tests'], { kind: 'robot' }>['world'], code: string, text: ActivityText): CheckResult {
  const recorded = recordRobotCommands(code, world, text.runner);
  if (!recorded.ok) {
    const feedback = text.codeErrorFeedback(recorded.error.line, recorded.error.message);
    return { correct: false, partial: 0, feedback, detail: { kind: 'code-challenge', passed: 0, total: 3, cases: [], output: recorded.output, error: feedback } };
  }
  const sim = simulateRobot(world, recorded.commands);
  const cases: CaseOutcome[] = [
    { label: text.robotReaches, pass: sim.reachedGoal, hidden: false, message: sim.reachedGoal ? text.checkPassed : text.robotNotGoal },
    { label: text.robotPicks, pass: sim.itemsLeft === 0, hidden: false, message: sim.itemsLeft === 0 ? text.checkPassed : text.robotItemsLeft(sim.itemsLeft) },
    {
      label: text.robotSafe,
      pass: sim.stop === null,
      hidden: false,
      message: sim.stop === null ? text.checkPassed : sim.stop.reason === 'wall' ? text.robotWall(sim.stop.index) : text.robotNothing(sim.stop.index),
    },
  ];
  const passed = cases.filter((c) => c.pass).length;
  const correct = passed === cases.length;
  // Why it stopped beats where it ended up: a bump explains the other two.
  const failing = cases.find((c) => !c.pass && c.label === text.robotSafe) ?? cases.find((c) => !c.pass);
  const feedback = correct ? text.robotRight : recorded.commands.length === 0 ? text.robotNoCommands : `${text.testsSome(passed, cases.length)} ${failing?.message ?? ''}`.trim();
  return {
    correct,
    partial: passed / cases.length,
    feedback,
    detail: { kind: 'code-challenge', passed, total: cases.length, cases, output: recorded.output, error: null, world: { position: sim.position, collected: sim.collected, path: sim.path, stoppedAt: sim.stoppedAt, reachedGoal: sim.reachedGoal } },
  };
}

export function checkCodeChallenge(activity: CodeChallengeActivity, code: string, text: ActivityText = defaultText): CheckResult {
  if (activity.tests.kind === 'robot') return checkRobot(activity, activity.tests.world, code, text);
  const report = runCodeTests(code, activity.tests, undefined, text.runner);
  const cases = report.results.map((result) => describeCase(result, text));
  const error = report.error ? text.codeErrorFeedback(report.error.line, report.error.message) : null;
  const detail = { kind: 'code-challenge' as const, passed: report.passed, total: report.total, cases, output: report.output, error };
  if (error) return { correct: false, partial: report.fraction, feedback: error, detail };
  if (report.total > 0 && report.passed === report.total) return { correct: true, partial: 1, feedback: text.testsPass, detail };
  if (report.total === 0) return { correct: false, partial: 0, feedback: text.testsNone, detail };
  const visible = cases.find((c) => !c.pass && !c.hidden);
  const feedback = `${text.testsSome(report.passed, report.total)} ${visible ? visible.message : text.hiddenFail}`;
  return { correct: false, partial: report.fraction, feedback, detail };
}

/** Runs a query in a fresh sandbox built from the activity's setup SQL. Never throws. */
export async function runSqlQuery(setup: string, query: string, text: ActivityText = defaultText): Promise<{ result: SqlRunResult | null; error: string | null }> {
  let sandbox: Awaited<ReturnType<typeof createSqlSandbox>> | null = null;
  try {
    const check = validateSelect(query, text.runner);
    if (!check.ok) return { result: null, error: check.reason };
    sandbox = await createSqlSandbox(setup, text.runner);
    const result = await sandbox.run(query);
    return { result, error: result.ok ? null : (result.error ?? text.runner.sql.queryFailed) };
  } catch (error) {
    return { result: null, error: error instanceof Error ? error.message : text.runner.sql.couldNotStart };
  } finally {
    await sandbox?.close().catch(() => {});
  }
}

export async function checkSqlChallenge(activity: SqlChallengeActivity, query: string, text: ActivityText = defaultText): Promise<CheckResult> {
  const { result, error } = await runSqlQuery(activity.setup, query, text);
  if (error !== null || result === null) {
    return { correct: false, partial: 0, feedback: error === null ? text.sqlUnavailable : text.sqlRunFailed(error), detail: { kind: 'sql-challenge', result } };
  }
  const compared = compareSql(result, activity.expected, text.runner);
  return compared.pass
    ? { correct: true, partial: 1, feedback: `${text.sqlRight}`, detail: { kind: 'sql-challenge', result } }
    : { correct: false, partial: 0, feedback: compared.feedback, detail: { kind: 'sql-challenge', result } };
}

/**
 * Checks what the learner submitted. One entry point for every kind; asynchronous because the SQL
 * kind starts a database. A wrong answer is never terminal: the result always says why and the
 * learner may try again. `text` defaults to English.
 */
export async function checkActivity(activity: Activity, answer: ActivityAnswer, text: ActivityText = defaultText): Promise<CheckResult> {
  if (answer.kind === 'tap-reveal' && activity.kind === 'tap-reveal') return checkTapReveal(activity, answer.opened, text);
  if (answer.kind === 'predict-output' && activity.kind === 'predict-output') return checkPredictOutput(activity, answer.text, text);
  if (answer.kind === 'fix-bug' && activity.kind === 'fix-bug') return checkFixBug(activity, answer, text);
  if (answer.kind === 'arrange' && activity.kind === 'arrange') return checkArrange(activity, answer.order, text);
  if (answer.kind === 'fill-blank' && activity.kind === 'fill-blank') return checkFillBlank(activity, answer.values, text);
  if (answer.kind === 'match' && activity.kind === 'match') return checkMatch(activity, answer.pairs, text);
  if (answer.kind === 'scenario' && activity.kind === 'scenario') return checkScenario(activity, answer.option, text);
  if (answer.kind === 'code-challenge' && activity.kind === 'code-challenge') return checkCodeChallenge(activity, answer.code, text);
  if (answer.kind === 'sql-challenge' && activity.kind === 'sql-challenge') return checkSqlChallenge(activity, answer.query, text);
  if (answer.kind === 'workflow-builder' && activity.kind === 'workflow-builder') return checkWorkflow(activity, answer.order);
  if (answer.kind === 'planning' && activity.kind === 'planning') return checkPlanning(activity, answer);
  throw new Error(`The answer is for "${answer.kind}" but the activity is "${activity.kind}".`);
}
