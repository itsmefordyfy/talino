import { EMPTY_PROFILE, type LearnerProfile } from '../../../onboarding/lib/profile';
import { buildCourseFacts, type CourseFacts } from '../catalog-facts';
import { fullCatalog } from '../full-catalog.test-helpers';
import { signalsFrom, type LearnerSignals, type SignalProgress } from './signals';

/** The final catalog (real courses plus stubs for the ones not written yet), as facts. Tests run against it so they keep passing as stubs become courses. */
export const FACTS: readonly CourseFacts[] = buildCourseFacts(fullCatalog());

export const profileOf = (patch: Partial<LearnerProfile>): LearnerProfile => ({ ...EMPTY_PROFILE, ...patch });

export const finished = (...ids: string[]): SignalProgress[] => ids.map((courseId) => ({ courseId, fraction: 1, complete: true, started: true, quizAverage: null, lessonsDone: 5 }));

export function signalsFor(patch: Partial<LearnerProfile>, progress: SignalProgress[] = [], extras: { exploredTechnologies?: Record<string, number>; lastActivityAt?: Record<string, string> } = {}): LearnerSignals {
  return signalsFrom(profileOf(patch), progress, { facts: FACTS, ...extras });
}

export const idsOf = (list: readonly { facts: CourseFacts }[]): string[] => list.map((entry) => entry.facts.id);
