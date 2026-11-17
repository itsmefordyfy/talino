import { compareSql, runCodeTests, runJs, validateSelect } from '@/features/code-runner';
import type { CodeTests } from '@/features/code-runner';
import { findPracticeItem } from '@/features/practice/catalog';
import { planningProblems } from '@/features/productivity/lib/planning';
import type { PracticeItem } from '@/features/practice/types';

import type { Activity, ArrangeActivity, CodeChallengeActivity, FillBlankActivity, FixBugActivity, PredictOutputActivity, SqlChallengeActivity, WorkflowBuilderActivity, WorkflowRule } from '../types';
import { expectedOutputOf, runSqlQuery } from './check';
import { recordRobotCommands, simulateRobot, validateWorld } from './robot';
import { countBlanks, fillBlanks, isKebabCase, normalizeCode, normalizeOutput, replaceLine } from './text';

const isJs = (language: string) => language.toLowerCase() === 'javascript';

function sameMultiset(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && [...a].sort().join('\u0000') === [...b].sort().join('\u0000');
}

/** Problems that need no code to run: structure, counts, ranges. An empty list means well formed. */
export function validateStructure(activity: Activity): string[] {
  const problems: string[] = [];
  const add = (message: string) => problems.push(message);

  if (!isKebabCase(activity.id ?? '')) add(`id "${activity.id}" is not kebab-case.`);
  if (!activity.title?.trim()) add('title is empty.');
  if (!activity.prompt?.trim()) add('prompt is empty.');
  if (!activity.explanation?.trim()) add('explanation is empty.');
  if (!activity.concept?.trim()) add('concept is empty.');
  if (activity.story !== undefined && !activity.story.trim()) add('story is empty (leave it out instead).');

  const minHints = activity.kind === 'tap-reveal' ? 0 : 2;
  if (!Array.isArray(activity.hints) || activity.hints.length < minHints) add(`needs at least ${minHints} hints, from gentle to nearly the answer.`);
  else {
    if (activity.hints.some((hint) => !hint.trim())) add('a hint is empty.');
    if (new Set(activity.hints.map((hint) => hint.trim())).size !== activity.hints.length) add('two hints are identical.');
  }

  switch (activity.kind) {
    case 'tap-reveal':
      if (activity.cards.length < 2) add('needs at least 2 cards.');
      if (activity.cards.some((card) => !card.front.trim() || !card.back.trim())) add('a card has an empty side.');
      break;
    case 'predict-output': {
      if (!activity.code.trim()) add('code is empty.');
      if (!isJs(activity.language) && activity.expected === undefined) add('expected is required when the language is not javascript.');
      if (activity.choices) {
        if (activity.choices.length < 2) add('choices needs at least 2 options.');
        if (new Set(activity.choices.map(normalizeOutput)).size !== activity.choices.length) add('two choices are the same.');
        if (activity.expected !== undefined && !activity.choices.some((choice) => normalizeOutput(choice) === normalizeOutput(activity.expected as string))) add('no choice equals expected.');
      }
      break;
    }
    case 'fix-bug': {
      const lines = activity.code.split('\n');
      if (!Number.isInteger(activity.bugLine) || activity.bugLine < 1 || activity.bugLine > lines.length) add(`bugLine ${activity.bugLine} is outside the code (1 to ${lines.length}).`);
      else if (!lines[activity.bugLine - 1].trim()) add('bugLine points at a blank line.');
      if (!activity.fixes.some((fix) => fix.correct)) add('needs at least one correct fix.');
      if (!activity.typed && activity.fixes.length < 2) add('needs at least 2 options to choose from.');
      if (!activity.typed && activity.fixes.filter((fix) => fix.correct).length > 1) add('more than one correct option to choose from: say which one is meant or mark the others wrong.');
      if (new Set(activity.fixes.map((fix) => normalizeCode(fix.line))).size !== activity.fixes.length) add('two fixes are the same line.');
      if (activity.fixes.some((fix) => !fix.why.trim())) add('a fix has no explanation.');
      if (activity.tests && !isJs(activity.language)) add('tests only work with javascript.');
      break;
    }
    case 'arrange': {
      if (activity.solution.length < 3) add('solution needs at least 3 lines.');
      if (activity.solution.some((line) => !line.trim())) add('solution has a blank line.');
      for (const [index, alternative] of (activity.alternatives ?? []).entries()) {
        if (!sameMultiset(alternative, activity.solution)) add(`alternative ${index + 1} is not a reordering of the solution.`);
      }
      if (activity.reasons && activity.reasons.length !== activity.solution.length) add(`reasons has ${activity.reasons.length} entries for ${activity.solution.length} lines.`);
      if (activity.tests && !isJs(activity.language)) add('tests only work with javascript.');
      break;
    }
    case 'fill-blank': {
      const count = countBlanks(activity.code);
      if (count < 1) add('code has no ___ blank.');
      if (count !== activity.blanks.length) add(`code has ${count} ___ blanks but blanks lists ${activity.blanks.length}.`);
      for (const [index, blank] of activity.blanks.entries()) {
        if (blank.answers.length === 0 || blank.answers.some((answer) => !answer.trim())) add(`blank ${index + 1} needs at least one non-empty answer.`);
        if (activity.bank && blank.answers[0] !== undefined && !activity.bank.includes(blank.answers[0])) add(`blank ${index + 1}'s answer "${blank.answers[0]}" is not in the word bank.`);
      }
      if (activity.bank) {
        if (activity.bank.length < activity.blanks.length) add('the word bank has fewer words than blanks.');
        const needed = activity.blanks.map((blank) => blank.answers[0]);
        for (const word of new Set(needed)) {
          const have = activity.bank.filter((item) => item === word).length;
          if (have < needed.filter((item) => item === word).length) add(`the word bank has "${word}" fewer times than the blanks need it.`);
        }
      }
      if (activity.tests && !isJs(activity.language)) add('tests only work with javascript.');
      break;
    }
    case 'match': {
      if (activity.pairs.length < 3) add('needs at least 3 pairs.');
      if (new Set(activity.pairs.map((pair) => pair.term)).size !== activity.pairs.length) add('two terms are the same.');
      if (new Set(activity.pairs.map((pair) => pair.definition)).size !== activity.pairs.length) add('two definitions are the same.');
      if (activity.pairs.some((pair) => !pair.term.trim() || !pair.definition.trim())) add('a pair has an empty side.');
      break;
    }
    case 'scenario': {
      if (!activity.situation.trim()) add('situation is empty.');
      if (activity.options.length < 2) add('needs at least 2 options.');
      const best = activity.options.filter((option) => option.quality === 'best').length;
      if (best !== 1) add(`needs exactly one "best" option (has ${best}).`);
      if (activity.options.some((option) => !option.text.trim() || !option.consequence.trim())) add('an option has no text or no consequence.');
      break;
    }
    case 'code-challenge': {
      if (activity.language !== 'javascript') add('code challenges are javascript.');
      if (!activity.starter.trim()) add('starter is empty.');
      if (!activity.solution.trim()) add('solution is empty.');
      if (activity.tests.kind === 'function') {
        if (activity.tests.cases.length === 0) add('tests has no cases.');
        if (!activity.tests.fn.trim()) add('tests.fn is empty.');
      } else if (activity.tests.kind === 'output') {
        if (activity.tests.expected.length === 0) add('tests.expected is empty.');
      } else {
        problems.push(...validateWorld(activity.tests.world));
      }
      break;
    }
    case 'sql-challenge': {
      if (!activity.setup.trim()) add('setup is empty.');
      if (!activity.solution.trim()) add('solution is empty.');
      if (activity.expected.rows.length === 0 && !activity.expected.columns) add('expected needs rows or columns.');
      break;
    }
    // Whether the id resolves in the practice catalog is checked by `validateActivity`, so a lesson can be authored before its scenario exists.
    case 'roleplay':
      if (!isKebabCase(activity.scenarioId ?? '')) add(`scenarioId "${activity.scenarioId}" is not a kebab-case id.`);
      break;
    case 'message-review':
      if (!isKebabCase(activity.taskId ?? '')) add(`taskId "${activity.taskId}" is not a kebab-case id.`);
      break;
    case 'prompt-lab':
      if (!isKebabCase(activity.labId ?? '')) add(`labId "${activity.labId}" is not a kebab-case id.`);
      break;
    case 'workflow-builder':
      validateWorkflowStructure(activity, add);
      break;
    case 'planning':
      for (const problem of planningProblems(activity.challenge)) add(problem);
      break;
  }
  return problems;
}

/** The Workflow Builder's own rules (no code runs): the palette, the rules and the reference solution must agree. */
export function workflowProblems(activity: WorkflowBuilderActivity): string[] {
  const problems: string[] = [];
  const ids = activity.parts.map((part) => part.id);
  if (new Set(ids).size !== ids.length) problems.push('two parts share an id.');
  if (activity.parts.length < 5) problems.push('needs at least 5 parts in the palette.');
  if (activity.parts.some((part) => !part.label.trim() || !part.detail.trim() || !isKebabCase(part.id))) problems.push('a part has an empty label or detail, or an id that is not kebab-case.');
  const lanes = new Set(activity.parts.map((part) => part.lane));
  if (!lanes.has('ai') || !lanes.has('human')) problems.push('the palette needs at least an AI step and a human review step.');
  if (!Number.isInteger(activity.minSteps) || !Number.isInteger(activity.maxSteps) || activity.minSteps < 3 || activity.maxSteps < activity.minSteps || activity.maxSteps > activity.parts.length) problems.push('minSteps and maxSteps must be whole numbers, 3 or more, within the palette.');
  if (activity.rules.length < 2) problems.push('needs at least 2 rules.');
  if (new Set(activity.rules.map((rule) => rule.id)).size !== activity.rules.length) problems.push('two rules share an id.');
  for (const rule of activity.rules) {
    if (!rule.message.trim()) problems.push(`rule ${rule.id} has no message.`);
    if (rule.parts.length === 0 || rule.parts.some((id) => !ids.includes(id))) problems.push(`rule ${rule.id} names a part that is not in the palette.`);
    if (rule.kind === 'before' && rule.parts.length !== 2) problems.push(`rule ${rule.id} ("before") needs exactly two parts.`);
  }
  if (!activity.rules.some((rule) => rule.kind === 'require')) problems.push('needs at least one "require" rule.');
  if (!activity.rules.some((rule) => rule.kind === 'forbid')) problems.push('needs at least one "forbid" rule (a tempting wrong step).');
  const broken = brokenWorkflowRules(activity.rules, activity.solution);
  if (new Set(activity.solution).size !== activity.solution.length || activity.solution.some((id) => !ids.includes(id))) problems.push('the solution repeats a part or names one that is not in the palette.');
  else if (activity.solution.length < activity.minSteps || activity.solution.length > activity.maxSteps) problems.push('the solution has fewer steps than minSteps or more than maxSteps.');
  else if (broken.length > 0) problems.push(`the reference solution breaks its own rules: ${broken.join(', ')}.`);
  const missing = activity.solution.filter((id) => !(id in activity.simulation.steps));
  if (missing.length > 0) problems.push(`the simulation has no line for: ${missing.join(', ')}.`);
  if (!activity.simulation.input.trim() || !activity.simulation.output.trim()) problems.push('the simulation needs an input and an output.');
  return problems;
}

/** Ids of the rules the ordered workflow breaks (pure; also used by the activity's check). */
export function brokenWorkflowRules(rules: readonly WorkflowRule[], order: readonly string[]): string[] {
  return rules
    .filter((rule) => {
      if (rule.kind === 'require') return !rule.parts.every((id) => order.includes(id));
      if (rule.kind === 'forbid') return rule.parts.some((id) => order.includes(id));
      const [a, b] = rule.parts;
      return order.includes(a) && order.includes(b) && order.indexOf(a) > order.indexOf(b);
    })
    .map((rule) => rule.id);
}

function validateWorkflowStructure(activity: WorkflowBuilderActivity, add: (message: string) => void) {
  for (const problem of workflowProblems(activity)) add(problem);
}

function passes(source: string, tests: CodeTests): string | null {
  const report = runCodeTests(source, tests);
  if (report.error) return `it errors: ${report.error.message}`;
  if (report.total === 0) return 'no test ran';
  if (report.passed !== report.total) {
    const failed = report.results.find((result) => !result.pass);
    return `${report.total - report.passed} of ${report.total} tests fail${failed ? ` (first: ${failed.label})` : ''}`;
  }
  return null;
}

function runsClean(source: string): string | null {
  const run = runJs(source);
  return run.ok && !run.error ? null : (run.error?.message ?? 'it stopped');
}

function validatePredict(activity: PredictOutputActivity, add: (message: string) => void) {
  if (isJs(activity.language)) {
    const run = runJs(activity.code);
    if (!run.ok || run.error) {
      add(`the snippet errors when run: ${run.error?.message ?? 'it stopped'}.`);
      return;
    }
    if (run.output.length === 0) add('the snippet prints nothing.');
    const actual = normalizeOutput(run.output.join('\n'));
    if (activity.expected !== undefined && normalizeOutput(activity.expected) !== actual) add(`expected "${activity.expected}" does not match what the snippet prints ("${actual}").`);
  }
  const expected = expectedOutputOf(activity);
  if (expected !== null && activity.choices) {
    const matching = activity.choices.filter((choice) => normalizeOutput(choice) === expected).length;
    if (matching !== 1) add(`${matching} choices equal the real output (needs exactly 1).`);
  }
}

function validateFix(activity: FixBugActivity, add: (message: string) => void) {
  if (!activity.tests || !isJs(activity.language)) return;
  const lines = activity.code.split('\n');
  if (activity.bugLine < 1 || activity.bugLine > lines.length) return;
  if (passes(activity.code, activity.tests) === null) add('the broken code already passes its tests, so the bug is not detectable.');
  for (const fix of activity.fixes) {
    const problem = passes(replaceLine(activity.code, activity.bugLine, fix.line), activity.tests);
    if (fix.correct && problem) add(`the correct fix "${fix.line.trim()}" does not pass the tests: ${problem}.`);
    if (!fix.correct && !problem) add(`the wrong fix "${fix.line.trim()}" passes the tests.`);
  }
}

function validateArrange(activity: ArrangeActivity, add: (message: string) => void) {
  if (!isJs(activity.language)) return;
  const orders = [activity.solution, ...(activity.alternatives ?? [])];
  for (const [index, order] of orders.entries()) {
    const name = index === 0 ? 'the solution' : `alternative ${index}`;
    const source = order.join('\n');
    const problem = activity.tests ? passes(source, activity.tests) : runsClean(source);
    if (problem) add(`${name} does not run correctly: ${problem}.`);
  }
}

function validateFill(activity: FillBlankActivity, add: (message: string) => void) {
  if (!isJs(activity.language) || countBlanks(activity.code) !== activity.blanks.length) return;
  const canonical = activity.blanks.map((blank) => blank.answers[0] ?? '');
  const problem = activity.tests ? passes(fillBlanks(activity.code, canonical), activity.tests) : runsClean(fillBlanks(activity.code, canonical));
  if (problem) add(`the program with the canonical answers does not run correctly: ${problem}.`);
  if (activity.tests) {
    for (const [index, blank] of activity.blanks.entries()) {
      for (const variant of blank.answers.slice(1)) {
        const values = [...canonical];
        values[index] = variant;
        const issue = passes(fillBlanks(activity.code, values), activity.tests);
        if (issue) add(`accepted variant "${variant}" for blank ${index + 1} fails: ${issue}.`);
      }
    }
  }
}

function validateChallenge(activity: CodeChallengeActivity, add: (message: string) => void) {
  if (activity.tests.kind === 'robot') {
    const world = activity.tests.world;
    if (validateWorld(world).length > 0) return;
    const solved = recordRobotCommands(activity.solution, world);
    if (!solved.ok) return add(`the solution errors: ${solved.error.message}.`);
    const sim = simulateRobot(world, solved.commands);
    if (!sim.reachedGoal || sim.itemsLeft > 0 || sim.stop) add('the reference solution does not finish the robot world.');
    const starter = recordRobotCommands(activity.starter, world);
    if (starter.ok) {
      const start = simulateRobot(world, starter.commands);
      if (start.reachedGoal && start.itemsLeft === 0 && !start.stop) add('the starter code already solves the challenge.');
    }
    return;
  }
  const problem = passes(activity.solution, activity.tests);
  if (problem) add(`the reference solution fails its own tests: ${problem}.`);
  if (passes(activity.starter, activity.tests) === null) add('the starter code already passes every test.');
}

/**
 * Everything wrong with an activity, from structure to running its code (a reference solution must pass
 * its own tests, a predict-output snippet must run, a Parsons solution must run). Returns [] when it is
 * good. SQL runs need a database: use `validateActivityDeep` for those.
 */
export function validateActivity(activity: Activity, findItem: (id: string) => PracticeItem | undefined = findPracticeItem): string[] {
  const problems = validateStructure(activity);
  if (problems.length > 0) return problems;
  const add = (message: string) => problems.push(message);
  switch (activity.kind) {
    case 'predict-output':
      validatePredict(activity, add);
      break;
    case 'fix-bug':
      validateFix(activity, add);
      break;
    case 'arrange':
      validateArrange(activity, add);
      break;
    case 'fill-blank':
      validateFill(activity, add);
      break;
    case 'code-challenge':
      validateChallenge(activity, add);
      break;
    case 'roleplay':
      if (findItem(activity.scenarioId)?.kind !== 'roleplay') add(findItem(activity.scenarioId) ? `"${activity.scenarioId}" is not a role-play scenario.` : `scenarioId "${activity.scenarioId}" is not in the practice catalog.`);
      break;
    case 'prompt-lab':
      if (findItem(activity.labId)?.kind !== 'lab') add(findItem(activity.labId) ? `"${activity.labId}" is not a prompt lab.` : `labId "${activity.labId}" is not in the practice catalog.`);
      break;
    case 'message-review':
      if (findItem(activity.taskId)?.kind !== 'message') add(findItem(activity.taskId) ? `"${activity.taskId}" is not a message task.` : `taskId "${activity.taskId}" is not in the practice catalog.`);
      break;
    default:
      break;
  }
  return problems;
}

async function validateSql(activity: SqlChallengeActivity, add: (message: string) => void) {
  const selected = validateSelect(activity.solution);
  if (!selected.ok) return add(`the reference query is not an allowed query: ${selected.reason}`);
  const { result, error } = await runSqlQuery(activity.setup, activity.solution);
  if (error !== null || result === null) return add(`the reference query does not run: ${error ?? 'no result'}.`);
  const compared = compareSql(result, activity.expected);
  if (!compared.pass) add(`the reference query does not match its expected result: ${compared.feedback}`);
  if (activity.starter) {
    const starter = await runSqlQuery(activity.setup, activity.starter);
    if (starter.result && compareSql(starter.result, activity.expected).pass) add('the starter query already gives the expected result.');
  }
}

/** `validateActivity` plus the checks that need a database (SQL reference queries). */
export async function validateActivityDeep(activity: Activity): Promise<string[]> {
  const problems = validateActivity(activity);
  if (problems.length > 0 || activity.kind !== 'sql-challenge') return problems;
  await validateSql(activity, (message) => problems.push(message));
  return problems;
}

/** Problems across a set: every id unique. Add each activity's own problems, prefixed with its id. */
export function validateActivitySet(activities: readonly Activity[]): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const activity of activities) {
    if (seen.has(activity.id)) problems.push(`duplicate activity id "${activity.id}".`);
    seen.add(activity.id);
  }
  return problems;
}

/**
 * Authoring helper: returns the activity unchanged, and in development throws at module load when its
 * structure is wrong (so a broken lesson fails the first time it is imported, not when a learner opens
 * it). The code-running checks live in `validateActivity` and the tests, not here, so import stays fast.
 */
export function defineActivity<T extends Activity>(activity: T): T {
  if (__DEV__) {
    const problems = validateStructure(activity);
    if (problems.length > 0) throw new Error(`Activity "${activity.id}": ${problems.join(' ')}`);
  }
  return activity;
}
