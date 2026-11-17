/**
 * The practice engine: role-plays with a simulated person and the message coach (Soft Skills course). Scenarios and tasks are plain
 * data in the catalog; the server builds the AI's instructions from them by id; the learner's sessions are kept on this phone.
 * Screens import from here only.
 */
export { PRACTICE_ITEMS, findLab, findMessageTask, findPracticeItem, findScenario } from './catalog';
export { finishRoleplay, reviewMessage, sendLearnerTurn, type FinishRoleplayInput, type ReviewMessageInput, type SendTurnInput } from './api/flows';
export { practiceErrorCode, requestReport, requestReview, requestTurn, type ReportRequest, type ReviewRequest, type TurnRequest } from './api/client';
export {
  abandonSession,
  appendMessage,
  bestAndLatest,
  deleteSession,
  findActiveSession,
  finishSession,
  growthAreaOf,
  labResultsForProject,
  labResultsText,
  labSummariesForItems,
  listSessionsForItem,
  practiceSummaryForProject,
  practiceSummaryText,
  readSession,
  startSession,
  summaryForItems,
  type ItemScores,
  type LabSummary,
  type ItemSummary,
  type PracticeKind,
  type PracticeMessageRow,
  type PracticeStatus,
  type SessionDetail,
  type SessionRow,
  type SessionSummary,
  type StartInput,
} from './api/practice-repo';
export {
  practiceKeys,
  useAbandonPracticeSession,
  useActivePracticeSession,
  useDeletePracticeSession,
  useFinishRoleplay,
  useLabSummaries,
  usePracticeHistory,
  usePracticeScores,
  usePracticeSummaries,
  usePracticeSession,
  useProjectPracticeSummary,
  useReviewMessage,
  useSendLearnerTurn,
  useStartPracticeSession,
} from './hooks/use-practice';
export { CRITERION_GUIDE } from './lib/criteria';
export { PRACTICE_APP, PRACTICE_FREE_DAILY_LIMIT, PRACTICE_PRO_DAILY_LIMIT } from './lib/limits';
export { publicLab, publicScenario, publicTask, type PublicLab, type PublicScenario, type PublicTask } from './lib/public';
export { checkLabPrompts, labRunsOf, type LabInputCheck } from './lib/lab-input';
export { parseLabReview, readStoredLabReview, type LabReview } from './lib/lab-review';
export type { LabOutput, LabRun } from './lib/lab-run';
export { usePromptLab } from './hooks/use-prompt-lab';
export { MAX_LEARNER_CHARS, MAX_REVIEW_CHARS, wordCount, type PracticeMessage, type PracticeRole } from './lib/sanitize';
export { checkReviewText, minReviewWords, type ReviewInputCheck } from './lib/review-input';
export { parseReport, readStoredReport, tooShortReport, type Evidence, type PracticeReport } from './lib/report';
export { parseReview, readStoredReview, tooShortReview, type PracticeResult, type ReviewChange, type ReviewResult } from './lib/review';
export { ratingFor, type CriterionScore, type Rating } from './lib/scoring';
export { canEnd, judgeable, learnerLines, learnerTurns, phaseOf, roleplayComplete, turnsLeft, MIN_JUDGEABLE_WORDS, type Phase } from './lib/session';
export type { PartnerTurn } from './lib/turn';
export { practiceStrings } from './strings';
export { PARTNER_ROLES, PRACTICE_CRITERIA } from './types';
export type { LabCriterion, LabExperiment, LabField, LabTask, LabTool } from './types';
export type { MessageTask, PartnerRole, PracticeCriterion, PracticeDifficulty, PracticeItem, RoleplayScenario } from './types';
