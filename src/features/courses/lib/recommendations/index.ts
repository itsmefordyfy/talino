export { catalogIndex, type CatalogIndex } from './catalog-index';
export { matchTarget, mentions, type TopicTarget } from './match';
export { pickLearningPath, planForPath, type PathPlan, type PathStep, type PathStepState } from './path-plan';
export { GOAL_TARGETS, goalCoverage, INTEREST_TARGETS, isTopicInterest, topicCoverage, type GoalTarget, type TopicCoverage, type TopicInterestId, type TopicStatus } from './profile-mapping';
export { recommendCourses, type Recommendation, type RecommendOptions } from './recommend';
export { learnerExperience, levelFit, readinessOf, relevanceReasons, scoreCourse, type CourseScore, type CourseStatus, type Readiness, type RecommendationReason } from './score';
export { buildDiscoverySections, daysSincePublished, IMPROVE_BELOW, RECENT_DAYS, shownCourseIds, type ContinueItem, type DiscoverGroup, type DiscoverySections, type ImproveItem, type NextLevelSection, type SectionKey, type SectionOptions, type YourPath } from './sections';
export { signalsFrom, type LearnerSignals, type SignalExtras, type SignalProfile, type SignalProgress, type StartedCourse } from './signals';
