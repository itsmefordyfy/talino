import type { VisualDefinition } from '../types';
import { EisenhowerVisual } from './eisenhower-visual';
import { PomodoroVisual } from './pomodoro-visual';
import { PromptPlaygroundVisual } from './prompt-playground-visual';
import { ScheduleVisual } from './schedule-visual';
import { productivityVisualStrings } from './strings';

/** The Time Management and Productivity course's tools: the learner's own tasks and settings, kept on the phone. */
const build = (en: typeof productivityVisualStrings.en): VisualDefinition[] => [
  { id: 'eisenhower-matrix', category: 'productivity', title: en.eisenhower.title, summary: en.eisenhower.summary, description: en.eisenhower.description, topics: en.eisenhower.topics, Component: EisenhowerVisual },
  { id: 'daily-schedule-builder', category: 'productivity', title: en.schedule.title, summary: en.schedule.summary, description: en.schedule.description, topics: en.schedule.topics, Component: ScheduleVisual },
  { id: 'pomodoro-timer', category: 'productivity', title: en.pomodoro.title, summary: en.pomodoro.summary, description: en.pomodoro.description, topics: en.pomodoro.topics, Component: PomodoroVisual },
  { id: 'ai-prompt-playground', category: 'productivity', title: en.promptPlayground.title, summary: en.promptPlayground.summary, description: en.promptPlayground.description, topics: en.promptPlayground.topics, Component: PromptPlaygroundVisual },
];

export const productivityVisuals = build(productivityVisualStrings.en);
/** The same visuals with their words in the `fil` table (English placeholders for now, by the owner's standing rule). */
export const productivityVisualsFil = build(productivityVisualStrings.fil);
