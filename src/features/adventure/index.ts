/**
 * The game layer: worlds (courses as maps), XP and levels derived from real learning, practice
 * activity records, achievements for practice, adaptive guidance, and Tali's unlockable poses.
 */
export { activityBadgeStats, readActivityProgress, readAttempts, recordAttempt, type ActivityBadgeStats, type ActivityRow, type AttemptInput, type AttemptResult, type AttemptRow } from './api/activity-repo';
export { ActivityReward, type ActivityRewardProps } from './components/activity-reward';
export { AchievementGrid, type AchievementGridProps } from './components/achievement-grid';
export { CompletionSummary, type CompletionSummaryProps, type SummaryAchievement } from './components/completion-summary';
export { LevelBadge, type LevelBadgeProps } from './components/level-badge';
export { StreakChip, type StreakChipProps } from './components/streak-chip';
export { WorldHeader, type WorldHeaderProps } from './components/world-header';
export { WorldMap, type WorldMapProps } from './components/world-map';
export { XpCard, type XpCardProps } from './components/xp-card';
export { activitiesKey, attemptsKey, useGame, useMissionXp, useRecordAttempt, useWorld, type Game } from './hooks/use-game';
export { adaptiveSummary, baseGuidance, guidanceFor, type AdaptiveSummary, type ConceptMastery, type Guidance, type Recommendation } from './lib/adaptive';
export { conceptLabel, conceptOf } from './lib/concepts';
export { ACTIVITY_KINDS, activityLanguage, isActivityKind, type ActivityKind } from './lib/kinds';
export { badgesEarnedDuring, summaryChanges } from './lib/summary';
export { displayTitle, earnedTitles, PROFILE_TITLES, type ProfileTitle } from './lib/unlocks';
export { buildWorld, chapterSizes, nextAfter, type Boss, type Chapter, type Mission, type MissionState, type World, type WorldNext } from './lib/world';
export { worldThemeFor, WORLD_THEMES, type WorldTheme } from './lib/world-themes';
export { activityXp, ACTIVITY_BASE_XP, computeXp, LEVEL_TITLES, levelFor, levelTitle, missionXp, progressToNextLevel, xpForLevel, XP, type LevelProgress, type MissionXp, type XpBreakdown } from './lib/xp';
export { MissionCompleteScreen } from './screens/mission-complete-screen';
export { WorldsList, WorldsScreen, type WorldsListProps } from './screens/worlds-screen';
export { adventureStrings } from './strings';
export { ActivitySlot, type ActivitySlotProps } from './components/activity-slot';
