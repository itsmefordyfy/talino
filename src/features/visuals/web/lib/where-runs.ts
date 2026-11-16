export const JOB_IDS = ['tap-button', 'layout', 'live-check', 'recheck-input', 'hash-password', 'db-query', 'api-secret', 'permissions', 'update-screen', 'send-email'] as const;
export type JobId = (typeof JOB_IDS)[number];
export type Place = 'frontend' | 'backend' | 'both';

/** Where each job runs. `both`: the frontend does it for the user's comfort and the backend must do it again to be safe. */
export const JOB_PLACE: Readonly<Record<JobId, Place>> = {
  'tap-button': 'frontend',
  layout: 'frontend',
  'live-check': 'both',
  'recheck-input': 'backend',
  'hash-password': 'backend',
  'db-query': 'backend',
  'api-secret': 'backend',
  permissions: 'backend',
  'update-screen': 'frontend',
  'send-email': 'backend',
};

export type QuizState = { index: number; picked: Place | null; right: number; finished: boolean };

export const START: QuizState = { index: 0, picked: null, right: 0, finished: false };

export function gradeAnswer(job: JobId, guess: Place): boolean {
  return JOB_PLACE[job] === guess;
}

/** Records the learner's answer for the current job (only the first answer counts). */
export function answerJob(state: QuizState, guess: Place): QuizState {
  if (state.finished || state.picked !== null) return state;
  return { ...state, picked: guess, right: state.right + (gradeAnswer(JOB_IDS[state.index], guess) ? 1 : 0) };
}

/** Moves to the next job once the current one is answered; after the last one the quiz is finished. */
export function nextJob(state: QuizState): QuizState {
  if (state.finished || state.picked === null) return state;
  if (state.index >= JOB_IDS.length - 1) return { ...state, finished: true };
  return { ...state, index: state.index + 1, picked: null };
}

/** Which diagram nodes to light for a place. */
export function nodesFor(place: Place): string[] {
  return place === 'both' ? ['frontend', 'backend'] : [place];
}
