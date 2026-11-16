/**
 * The course feature's public API without any screen or component: the catalog, the learner's progress, badges, levels, discovery
 * and localization. Features that a course screen itself imports (adventure, onboarding, notifications, companion) import from here,
 * not from `index.ts`: the index also exports `CourseScreen`, which imports them, and importing it back made a require cycle.
 */
export { AI_DEV_COURSES, CAREER_COURSES, COURSES, findLesson, findProject, getCourse, MINI_COURSES, STARTER_COURSE_ID } from './content';
export type { AiTool, AiToolId, AudienceId, Course, CourseKind, CourseLevel, Lesson, LessonBlock, Project } from './content/types';
export { canJumpBySentence, getListenSnapshot, loadAudio, skipSegment, speakReply, stopListening, subscribeListen, togglePlayPause } from './audio/listen-controller';
export { useAwardBadges, useLearning, useMarkBadgesSeen, useSaveReview, useSaveSubmissionDraft, useSetProjectSteps } from './hooks/use-learning';
export { badgeDefinitions, earnedBadges, type BadgeDefinition } from './lib/badges';
export { computeCourseProgress, parseStepsDone, type CourseProgress, type ProjectRow } from './lib/progress';
export { buildDiscoverySections, goalCoverage, pickLearningPath, planForPath, recommendCourses, scoreCourse, shownCourseIds, signalsFrom, topicCoverage, type ContinueItem, type DiscoverySections, type ImproveItem, type NextLevelSection, type LearnerSignals, type PathPlan, type Recommendation, type PathStep, type PathStepState, type RecommendationReason, type SectionKey } from './lib/recommendations';
export { courseForAudience, recommendCourse, recommendQuestions, RECOMMEND_QUESTIONS, type CareerCourseId } from './lib/recommend';
export { useCourseNotTranslated, useLocalizedCourse } from './hooks/use-localized-course';
export { courseHasLanguage, localizedCourse, localizedFound, localizedLesson, localizedProject } from './lib/localization';
export { courseStrings } from './strings';

// Catalog facts and discovery (search, filters, sorting), read by the Discover feature.
export { catalogFacts, factsFor, formatDuration, isNewCourse, learningObjectives, COURSE_ACCESS, LAUNCH_CATALOG_DATE, type CourseAccess, type CourseFacts, type CourseType, type DurationBucket } from './lib/catalog-facts';
export { LEARNING_LEVELS, LEARNING_LEVEL_INDEX, LEARNING_LEVEL_TEXT, isLearningLevel, learningLevelOf, nextLearningLevel, type LearningLevel } from './lib/learning-level';
export {
  ACCESS_LABELS,
  PROGRESS_LABELS,
  PROGRESS_STATUSES,
  isAiTool,
  learningLevelLabel,
  type FilterContext,
  type ProgressStatus,
  type QueryContext,
  searchSuggestions,
  starterSuggestions,
  type SearchSuggestion,
  CATEGORY_LABELS,
  COURSE_TYPE_LABELS,
  DIMENSION_LABELS,
  DURATION_LABELS,
  EMPTY_FILTERS,
  FILTER_DIMENSIONS,
  GOAL_LABELS,
  LEVEL_LABELS,
  SORT_OPTIONS,
  sortOptions,
  courseTypeLabel,
  dimensionLabel,
  durationLabel,
  activeFilterCount,
  activeFilterList,
  facetCounts,
  facetValues,
  filterLabel,
  hasActiveFilters,
  popularTechnologies,
  runDiscovery,
  technologyLabel,
  type ActiveFilter,
  type CatalogFilters,
  type DiscoveryResult,
  type FilterDimension,
  type SortKey,
} from './lib/discovery';
export { CATEGORIES, categoryLabel, categoryText, courseMeta, getCategory, getLearningPath, goalLabel, LEARNING_PATHS, levelLabel, localizedCategories, pathText, type LearningPathDef } from './content/catalog';
export type { CategoryId, LearningGoalId } from './content/types';

// Learner levels: lessons and projects adapt to the five programming-experience levels (docs/content/ADAPTATION_BRIEF.md). Never a lock.
export { adaptLesson, adaptProject, cleanLevel, inheritLevels, levelCoverage, levelsInAudience, rubricFor, suggestNextLevel, SUGGEST_MIN_AVERAGE, type AdaptedLesson, type AdaptedProject, type CompletedCourse, type LevelCoverage, type LevelSuggestion, type LevelSuggestionReason } from './lib/adaptation';
export { EXPERIENCE_LEVELS, EXPERIENCE_SUMMARY, difficultyFor, forLevel, inAudience, levelsSuitedTo, type Audience, type CourseDifficulty, type ExperienceLevel } from './content/levels';
export { levelStrings } from './level-strings';
