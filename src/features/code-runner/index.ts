/**
 * Safe, offline code execution for the playground and coding challenges: a JavaScript-subset
 * interpreter (no eval, no host access) and a read-only SQL sandbox over expo-sqlite.
 */
export type { CodeTests, RunError, RunLimits, RunResult, SqlExpectation, SqlRunResult, TestCase, TestReport } from './types';
export { runJs, runCodeTests, SUPPORTED_JS } from './run';
export { runnerStrings, type RunnerText } from './strings';
export { validateSelect, compareSql, createSqlSandbox } from './sql';
