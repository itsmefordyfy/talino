import type { CategoryId } from '../../content/types';
import { matchTarget } from './match';
import { isNewCourse, type CourseFacts } from '../catalog-facts';
import { LEARNING_LEVEL_INDEX, nextLearningLevel, type LearningLevel } from '../learning-level';
import { catalogIndex } from './catalog-index';
import { pickLearningPath, type PathPlan, type PathStep } from './path-plan';
import { INTEREST_TARGETS, type TopicInterestId } from './profile-mapping';
import { recommendCourses, type Recommendation } from './recommend';
import { fitsLevel, learnerExperience } from './score';
import type { LearnerSignals } from './signals';
import { NOT_SURE } from '../../../onboarding/lib/options';

/**
 * The sections of the Courses screen for one learner. Each is present only when it has something relevant to show (an empty
 * one is left out, never padded with filler), and what a section lists is about what the learner asked for: a course that only
 * sits in the same category, or only uses a tool every course uses, is not (owner, 2026-11-17: "do not show what is not related to the user's interest"), and a course appears in at most one section: a later section skips whatever an
 * earlier one already showed (continue, recommended, your path, explore, improve, next level, recently added). The one exception is the
 * path, which is a roadmap: it always lists all of its courses in order, and marks those shown above with `listedAbove`.
 *
 * There is deliberately no "popular" section: Talino has no accounts and so no enrollment data, and a "popular" list made
 * from anything else would be a guess presented as a fact. `CourseFacts.foundation` (how much of the catalog builds on a
 * course) is the only honest stand-in, and it already feeds the ranking.
 */

export type SectionKey = 'continueLearning' | 'recommended' | 'yourPath' | 'exploreInterests' | 'improveSkills' | 'nextLevel' | 'recentlyAdded';

export type ContinueItem = { facts: CourseFacts; fraction: number; lastActivityAt?: string };
/** Courses in a category whose quizzes had room to grow, with that category's quiz average (0 to 1). */
export type ImproveItem = Recommendation & { quizAverage: number };
export type NextLevelSection = { level: LearningLevel; courses: Recommendation[] };
export type YourPath = Omit<PathPlan, 'steps'> & { steps: (PathStep & { listedAbove?: SectionKey })[] };

export type DiscoverySections = {
  continueLearning?: ContinueItem[];
  recommended?: Recommendation[];
  yourPath?: YourPath;
  exploreInterests?: Recommendation[];
  /** "Improve your skills": categories where the learner's quiz average is below `IMPROVE_BELOW`. */
  improveSkills?: ImproveItem[];
  /** "Prepare for your next level": courses one learning level above the learner's current one. */
  nextLevel?: NextLevelSection;
  recentlyAdded?: Recommendation[];
};

export type SectionOptions = {
  /** The current time; injected so "recently added" is testable. Defaults to now. */
  now?: Date | number | string;
  recommendedLimit?: number;
  exploreLimit?: number;
  recentLimit?: number;
  improveLimit?: number;
  nextLevelLimit?: number;
  /** The learner's current learning level (Home's journey decides it); without it there is no "next level" section. */
  learnerLevel?: LearningLevel | null;
};

/** A category's quiz average under this (70%) means its skills have room to grow. */
export const IMPROVE_BELOW = 0.7;

/** Courses published within this many days before `now` count as new. */
export const RECENT_DAYS = 30;
/**
 * A course must be at least this relevant to what the learner asked for to be recommended (never padding). A single category hit is 2,
 * which only says "same shelf": it takes a goal, a technology or a tag on top of that, so someone who asked for game development is
 * not handed generic AI-coding courses.
 */
export const MIN_RELEVANCE = 3;
/** The lower bar for someone who named no goals or interests: what they have been opening (at most 2.4 of relevance) is all there is to go on. */
const ACTIVITY_MIN_RELEVANCE = 2;
const DAY_MS = 86_400_000;

function toTime(now: SectionOptions['now']): number {
  return now === undefined ? Date.now() : new Date(now).getTime();
}

/** Whole days from a `YYYY-MM-DD` publish date to the day of `now` (UTC); negative when published in the future. */
export function daysSincePublished(published: string, now: number): number {
  const publishedAt = Date.parse(`${published}T00:00:00Z`);
  if (Number.isNaN(publishedAt)) return Infinity;
  const today = Math.floor(now / DAY_MS) * DAY_MS;
  return Math.round((today - publishedAt) / DAY_MS);
}

export function buildDiscoverySections(signals: LearnerSignals, facts: readonly CourseFacts[], options: SectionOptions = {}): DiscoverySections {
  const index = catalogIndex(facts);
  const now = toTime(options.now);
  const sections: DiscoverySections = {};
  const shown = new Map<string, SectionKey>();
  const show = (id: string, section: SectionKey) => {
    if (!shown.has(id)) shown.set(id, section);
  };

  // Continue learning: started, not complete, most recent first.
  const continueItems: ContinueItem[] = [];
  for (const [id, started] of signals.started) {
    const course = index.byId.get(id);
    if (course && !signals.completed.has(id)) continueItems.push({ facts: course, fraction: started.fraction, lastActivityAt: started.lastActivityAt });
  }
  continueItems.sort((a, b) => (b.lastActivityAt ?? '').localeCompare(a.lastActivityAt ?? '') || b.fraction - a.fraction || (index.order.get(a.facts.id) ?? 0) - (index.order.get(b.facts.id) ?? 0));
  if (continueItems.length > 0) {
    sections.continueLearning = continueItems;
    for (const item of continueItems) show(item.facts.id, 'continueLearning');
  }

  // Everything still to take, best first. Only courses that are about what the learner asked for are recommended.
  const pool = recommendCourses(signals, facts, { scope: 'next' }).filter((entry) => entry.facts.availability === 'available');
  // A learner who named goals or interests is only shown courses about those (not ones they merely opened); one who named none is shown
  // what their own activity points at, and improve and next level (from real progress) stay as they were.
  const asked = signals.goals.length > 0 || signals.interests.some((interest) => interest !== NOT_SURE && interest in INTEREST_TARGETS);
  const aboutThem = (entry: Recommendation) => (asked ? entry.declared >= MIN_RELEVANCE : entry.relevance >= ACTIVITY_MIN_RELEVANCE);
  // About what they asked for, the courses at their own level first: an experienced developer is not led with beginner courses, nor a beginner
  // with advanced ones. The rest follow in the same order, so a thin list is still filled from what they asked for, never hidden.
  const experience = learnerExperience(signals, index);
  const aboutAsked = pool.filter(aboutThem);
  const relevant = [...aboutAsked.filter((entry) => fitsLevel(experience, entry.facts.level)), ...aboutAsked.filter((entry) => !fitsLevel(experience, entry.facts.level))];
  const aboutWhatTheyAsked = (entry: Recommendation) => !asked || aboutThem(entry);

  const recommended = relevant.filter((entry) => !shown.has(entry.facts.id)).slice(0, options.recommendedLimit ?? 6);
  if (recommended.length > 0) {
    sections.recommended = recommended;
    for (const entry of recommended) show(entry.facts.id, 'recommended');
  }

  // Your path: a roadmap, so it keeps all its courses and notes which ones are already shown above.
  const path = pickLearningPath(signals, facts);
  if (path) {
    sections.yourPath = { ...path, steps: path.steps.map((step) => ({ ...step, listedAbove: shown.get(step.facts.id) })) };
    for (const step of path.steps) show(step.facts.id, 'yourPath');
  }

  // Explore your interests: more courses about the topics they picked.
  const interests = signals.interests.filter((interest): interest is TopicInterestId => interest !== NOT_SURE && interest in INTEREST_TARGETS);
  if (interests.length > 0) {
    const aboutInterests = relevant
      .filter((entry) => !shown.has(entry.facts.id) && interests.some((interest) => matchTarget(entry.facts, INTEREST_TARGETS[interest], index.rarity).direct))
      .slice(0, options.exploreLimit ?? 6);
    if (aboutInterests.length > 0) {
      sections.exploreInterests = aboutInterests;
      for (const entry of aboutInterests) show(entry.facts.id, 'exploreInterests');
    }
  }

  // Improve your skills: where the learner's own quiz results were weakest, the gentlest courses they have not finished yet.
  const weak = [...(signals.quizAverageByCategory ?? new Map<CategoryId, number>())].filter(([, average]) => average < IMPROVE_BELOW).sort((a, b) => a[1] - b[1]);
  if (weak.length > 0) {
    const averageOf = new Map(weak);
    const improve = pool
      .filter((entry) => averageOf.has(entry.facts.category) && !shown.has(entry.facts.id) && aboutWhatTheyAsked(entry))
      .sort(
        (a, b) =>
          (averageOf.get(a.facts.category) ?? 1) - (averageOf.get(b.facts.category) ?? 1) ||
          LEARNING_LEVEL_INDEX[a.facts.learningLevel] - LEARNING_LEVEL_INDEX[b.facts.learningLevel] ||
          Number(b.readiness.ready) - Number(a.readiness.ready) ||
          b.score - a.score,
      )
      .slice(0, options.improveLimit ?? 6)
      .map((entry): ImproveItem => ({ ...entry, quizAverage: averageOf.get(entry.facts.category) ?? 0 }));
    if (improve.length > 0) {
      sections.improveSkills = improve;
      for (const entry of improve) show(entry.facts.id, 'improveSkills');
    }
  }

  // Prepare for your next level: one level above where the learner is, ready courses first.
  const next = options.learnerLevel ? nextLearningLevel(options.learnerLevel) : null;
  if (next) {
    const courses = pool
      .filter((entry) => entry.facts.learningLevel === next && !shown.has(entry.facts.id) && aboutWhatTheyAsked(entry))
      .sort((a, b) => Number(b.readiness.ready) - Number(a.readiness.ready) || b.score - a.score || (index.order.get(a.facts.id) ?? 0) - (index.order.get(b.facts.id) ?? 0))
      .slice(0, options.nextLevelLimit ?? 6);
    if (courses.length > 0) {
      sections.nextLevel = { level: next, courses };
      for (const entry of courses) show(entry.facts.id, 'nextLevel');
    }
  }

  // Recently added: published after the launch catalog and within the last 30 days, the ones most relevant to them first. The
  // launch catalog itself is never "recently added": every learner meets it on day one.
  const recent = pool
    .filter((entry) => !shown.has(entry.facts.id) && isNewCourse(entry.facts, now))
    .sort((a, b) => b.relevance - a.relevance || b.score - a.score)
    .slice(0, options.recentLimit ?? 6);
  if (recent.length > 0) sections.recentlyAdded = recent;

  return sections;
}

/** Every course id a section list shows as a card (the path's steps count only when not already listed above and not finished). Used to check that no course repeats. */
export function shownCourseIds(sections: DiscoverySections): string[] {
  return [
    ...(sections.continueLearning ?? []).map((item) => item.facts.id),
    ...(sections.recommended ?? []).map((entry) => entry.facts.id),
    ...(sections.yourPath?.steps.filter((step) => step.state !== 'done' && !step.listedAbove).map((step) => step.facts.id) ?? []),
    ...(sections.exploreInterests ?? []).map((entry) => entry.facts.id),
    ...(sections.improveSkills ?? []).map((entry) => entry.facts.id),
    ...(sections.nextLevel?.courses ?? []).map((entry) => entry.facts.id),
    ...(sections.recentlyAdded ?? []).map((entry) => entry.facts.id),
  ];
}
