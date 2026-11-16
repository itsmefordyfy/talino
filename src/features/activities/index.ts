/**
 * Interactive activities: things a learner does (predict, fix, arrange, fill, match, decide, code, query)
 * with real checking, progressive hints and immediate feedback. Code runs in the `code-runner` sandbox.
 */
export { ActivityView, type ActivityViewProps } from './components/activity-view';
export { CodeEditor, type CodeEditorProps } from './components/code-editor';
export { checkActivity } from './lib/check';
export { availableHints, nextHint, shouldOfferHint, shownHints, GUIDED_OFFER_AFTER_WRONG, type NextHint } from './lib/hints';
export { defineActivity, validateActivity, validateActivityDeep, validateActivitySet, validateStructure } from './lib/validate';
export { SAMPLE_ACTIVITIES } from './samples';
export type { AttemptEvent, SolvedEvent } from './hooks/use-activity-session';
export { ACTIVITY_KINDS, ROBOT_COMMANDS } from './types';
export type {
  Activity,
  ActivityAnswer,
  ActivityBase,
  ActivityKind,
  ArrangeActivity,
  BlankSpec,
  ChallengeTests,
  CheckDetail,
  CheckResult,
  CodeChallengeActivity,
  CodeTests,
  FillBlankActivity,
  FixBugActivity,
  FixOption,
  Guidance,
  MatchActivity,
  MatchPair,
  PredictOutputActivity,
  RobotCommand,
  RobotWorld,
  ScenarioActivity,
  ScenarioOption,
  SqlChallengeActivity,
  SqlExpectation,
  TapRevealActivity,
} from './types';
export { activityStrings } from './strings';
