import { catalogFacts, getCourse, buildDiscoverySections, categoryLabel, fitsLevel, learnerExperience, MIN_RELEVANCE, recommendCourses, technologyLabel, type CourseFacts, type DiscoverySections, type Recommendation } from '@/features/courses';
// The hook by its path: the journey's index also exports its screens, which import this feature's parent screens back.
import { useJourney } from '@/features/journey/hooks/use-journey';
import { onboardingStrings } from '@/features/onboarding/strings';
import { useLanguage, useLocalized } from '@/hooks/use-strings';

import { discoverStrings } from '../strings';
import { memoByKey, signalsKey } from '../lib/learner';
import { reasonLine } from '../lib/reasons';
import { startHere } from '../lib/start-here';
import { useLearnerSignals } from './use-learner-signals';

const sectionsCache = memoByKey<DiscoverySections>();
const relevanceCache = memoByKey<ReadonlySet<string>>();

export type DiscoveryHome = {
  /** Only the sections that have something to show; an empty one is absent, never padded. */
  sections: DiscoverySections;
  /** Friendly first steps for a learner the engine has nothing relevant to recommend to (no answers yet, or answers that matched nothing). */
  startHere: CourseFacts[];
  /** The learner has shaped their picks (experience, goals or interests). False for someone who skipped onboarding. */
  personalized: boolean;
  /** Whether there is anything personal to show above the neutral catalog. */
  hasPicks: boolean;
  /** How many courses the learner has started and not finished. */
  startedCount: number;
  /** The learner named goals or interests, so a course unrelated to them would be noise. */
  askedForTopics: boolean;
  /** Whether a course is about what the learner asked for (their goals and interests); true for everything when they asked for nothing. */
  isRelevant: (courseId: string) => boolean;
  /** A list of courses with the ones at the learner's own level first (the order inside each part is kept); nothing is dropped. */
  orderByLevel: <T extends { id: string }>(courses: readonly T[]) => T[];
  /** A short human reason for a recommended course ("Because you want to become a software engineer"), or null. */
  reasonOf: (entry: Recommendation) => string | null;
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
};

/** A day number, so "recently added" is recomputed once a day and not on every render. */
const dayKey = () => Math.floor(Date.now() / 86_400_000);

/**
 * The personalised Discover home. It is built from the learner's onboarding answers, real progress and explored
 * technologies (`useLearnerSignals`), so it recomputes by itself when any of them changes. Hook for the Today dashboard too:
 * `sections.recommended`, `sections.continueLearning` and `sections.yourPath` are the same data Discover shows.
 */
export function useDiscoverySections(): DiscoveryHome {
  const learner = useLearnerSignals();
  const strings = useLocalized(discoverStrings);
  const language = useLanguage();
  const onboarding = useLocalized(onboardingStrings);
  const facts = catalogFacts();
  const { signals, personalized } = learner;
  // The learner's level is the one Home's journey shows them, so "Get ready for <next level>" agrees with Home.
  const journey = useJourney();
  const learnerLevel = journey.isPending ? null : (journey.state.currentStage?.def.level ?? null);

  const key = `${signalsKey(signals)}|${dayKey()}|${facts.length}|${learnerLevel ?? '-'}`;
  const built = sectionsCache(key, () => buildDiscoverySections(signals, facts, { learnerLevel }));
  // Someone who told us nothing has no interests to explore: friendly first steps instead.
  const sections: DiscoverySections = personalized ? built : { ...built, exploreInterests: undefined };
  // Every course the learner's goals and interests are about, for the blocks that list the catalog rather than the engine's picks (short courses).
  const asked = signals.goals.length > 0 || signals.interests.some((interest) => interest !== 'not-sure');
  const aboutThem = relevanceCache(key, () => new Set(recommendCourses(signals, facts, { scope: 'everything' }).filter((entry) => (asked ? entry.declared : entry.relevance) >= MIN_RELEVANCE).map((entry) => entry.facts.id)));
  // Improve and next level come from real progress, so they stay for someone who skipped the welcome too.
  const wantsStartHere = !sections.recommended && !sections.yourPath;

  // The level the learner works at (what they said, the skill check, courses they finished): the lists below put courses at that level first.
  const experience = learnerExperience(signals, facts);
  const levelOf = new Map(facts.map((fact) => [fact.id, fact.level]));
  const orderByLevel = <T extends { id: string }>(courses: readonly T[]): T[] => [...courses.filter((course) => fitsLevel(experience, levelOf.get(course.id) ?? 'beginner')), ...courses.filter((course) => !fitsLevel(experience, levelOf.get(course.id) ?? 'beginner'))];

  const reasonOf = (entry: Recommendation) =>
    reasonLine(entry.reasons, strings.reasons, {
      courseTitle: (id) => getCourse(id)?.title,
      interestLabel: (interest) => onboarding.interests[interest] ?? interest,
      technologyLabel,
      categoryLabel: (category) => categoryLabel(category, language),
    });

  const started = sections.continueLearning?.length ?? 0;
  return {
    sections,
    startHere: wantsStartHere ? startHere(facts, { completed: signals.completed, started: signals.started, experience }) : [],
    personalized,
    hasPicks: !!(sections.recommended || sections.yourPath || sections.exploreInterests || sections.continueLearning || sections.improveSkills || sections.nextLevel),
    startedCount: started,
    askedForTopics: asked,
    isRelevant: (courseId) => !asked || aboutThem.has(courseId),
    orderByLevel,
    reasonOf,
    isPending: learner.isPending,
    isError: learner.isError,
    refetch: learner.refetch,
  };
}
