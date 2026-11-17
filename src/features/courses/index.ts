// UI (screens and components). Everything that holds no UI is in `./data`, re-exported here so this stays the one public API.
export * from './data';

// Opens a lesson or the paywall; it reads the store, so it lives here with the screens, not in `./data` (pure-logic tests import that).
export { useOpenLesson } from './hooks/use-open-lesson';
export { CourseCard, COURSE_TONES } from './components/course-card';
export { CourseHero } from './components/course-hero';
export { ListenBarFrame } from './components/listen-bar';
export { LessonBlocks } from './components/lesson-blocks';
export { ProgressRing } from '@/components/ui/progress-ring';
export { CourseScreen } from './screens/course-screen';
export { LessonScreen } from './screens/lesson-screen';
export { AiToolsScreen } from './screens/ai-tools-screen';
export { AiPlacementScreen } from './screens/ai-placement-screen';
export { LevelNote } from './components/level-note';
