import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { useCoachIdentity } from '@/features/coach';

import { finishRoleplay, reviewLabPrompt, reviewMessage, runLabPrompt, sendLearnerTurn, type FinishRoleplayInput, type ReviewLabInput, type ReviewMessageInput, type RunLabInput, type SendTurnInput } from '../api/flows';
import { abandonSession, bestAndLatest, deleteSession, findActiveSession, labSummariesForItems, listSessionsForItem, practiceSummaryForProject, readSession, startSession, summaryForItems, type StartInput } from '../api/practice-repo';

export const practiceKeys = {
  session: (id: string) => ['practice', 'session', id] as const,
  history: (itemId: string) => ['practice', 'history', itemId] as const,
  scores: (itemId: string) => ['practice', 'scores', itemId] as const,
  active: (itemId: string) => ['practice', 'active', itemId] as const,
  project: (itemIds: readonly string[]) => ['practice', 'project', ...itemIds] as const,
  summaries: (itemIds: readonly string[]) => ['practice', 'summaries', ...itemIds] as const,
  labs: (itemIds: readonly string[]) => ['practice', 'labs', ...itemIds] as const,
};

/** One session with its messages and its debrief or review. */
export const usePracticeSession = (id: string) => useDbQuery(practiceKeys.session(id), (db) => readSession(db, id));
/** Every try at an item, newest first: the History list on the activity. */
export const usePracticeHistory = (itemId: string) => useDbQuery(practiceKeys.history(itemId), (db) => listSessionsForItem(db, itemId));
/** Tries, best score and latest score for an item. */
export const usePracticeScores = (itemId: string) => useDbQuery(practiceKeys.scores(itemId), (db) => bestAndLatest(db, itemId));
/** The unfinished session of an item, if any, so the screen can offer to carry on. */
export const useActivePracticeSession = (itemId: string) => useDbQuery(practiceKeys.active(itemId), (db) => findActiveSession(db, itemId));
/** The text the project review reads about the practice items a project names (empty when it names none). */
export const useProjectPracticeSummary = (itemIds: readonly string[]) => useDbQuery(practiceKeys.project(itemIds), (db) => practiceSummaryForProject(db, itemIds));

/** Tries, best and latest score and one growth area for each of several items (the project screen's list). */
export const usePracticeSummaries = (itemIds: readonly string[]) => useDbQuery(practiceKeys.summaries(itemIds), (db) => summaryForItems(db, itemIds));

/** Tries, scores and the latest prompt of each prompt lab among the items a project names (the review's "Lab results"). */
export const useLabSummaries = (itemIds: readonly string[]) => useDbQuery(practiceKeys.labs(itemIds), (db) => labSummariesForItems(db, itemIds));

// Practice is private to this phone (not backed up or synced), so none of these starts a cloud backup.
export const useStartPracticeSession = () => useDbMutation((db, input: StartInput) => startSession(db, input), { notify: false });
export const useAbandonPracticeSession = () => useDbMutation((db, id: string) => abandonSession(db, id), { notify: false });
export const useDeletePracticeSession = () => useDbMutation((db, id: string) => deleteSession(db, id), { notify: false });

/** The learner says something in a role-play: saved, sent, and the partner's reply saved. Resolves with the reply and whether the partner ended the conversation. */
export function useSendLearnerTurn() {
  const identity = useCoachIdentity();
  return useDbMutation((db, input: SendTurnInput) => sendLearnerTurn(db, identity, input), { notify: false });
}

/** Ends a role-play and gets its debrief (a `tooShort` one when there was too little to judge). */
export function useFinishRoleplay() {
  const identity = useCoachIdentity();
  return useDbMutation((db, input: FinishRoleplayInput) => finishRoleplay(db, identity, input), { notify: false });
}

/** One message review, as a session of its own. */
export function useReviewMessage() {
  const identity = useCoachIdentity();
  return useDbMutation((db, input: ReviewMessageInput) => reviewMessage(db, identity, input), { notify: false });
}

/** One live run of a prompt lab: the prompt is asked of a real model and the prompt and its output are saved together when it came back. */
export function useRunLab() {
  const identity = useCoachIdentity();
  return useDbMutation((db, input: RunLabInput) => runLabPrompt(db, identity, input), { notify: false });
}

/** The prompt coach's review of a lab session's latest run. */
export function useReviewLab() {
  const identity = useCoachIdentity();
  return useDbMutation((db, input: ReviewLabInput) => reviewLabPrompt(db, identity, input), { notify: false });
}
