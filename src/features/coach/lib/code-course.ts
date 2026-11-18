import { aiAgentsSuggestionKey } from './ai-agents';
import { aiAutomationSuggestionKey } from './ai-automation';
import { architectureSuggestionKey } from './architecture';
import { isDsaLesson } from './dsa-course';
import type { CoachFocus } from './focus';
import { genAiSuggestionKey } from './gen-ai';
import { internationalClientsSuggestionKey } from './international-clients';
import { productivitySuggestionKey } from './productivity';
import { softSkillsSuggestionKey } from './soft-skills';

/**
 * Courses that teach programming itself (the ideas under every language), where a learner asks about a line, a value or a loop rather
 * than about building with AI. Tali's suggested questions and her instructions change for them (owner's brief, 2026-11-16).
 */
export const CODE_TEACHING_COURSES: ReadonlySet<string> = new Set(['programming-fundamentals']);

/** The course a lesson belongs to: ids are `<course-id>-<two digits>`. */
export function courseOfLessonId(lessonId: string): string {
  return lessonId.replace(/-\d{2}$/, '');
}

export function isCodeTeachingLesson(lessonId: string): boolean {
  return CODE_TEACHING_COURSES.has(courseOfLessonId(lessonId));
}

/** The key of `focusSuggestions` to use: the code-lesson set for a programming lesson, quiz question or exercise, else the focus kind. */
export function suggestionKey(focus: CoachFocus | null | undefined, kind: string): string {
  // Soft Skills has its own set (`lib/soft-skills.ts`).
  const soft = softSkillsSuggestionKey(focus, kind);
  if (soft) return soft;
  // Time Management and Productivity has its own set (`lib/productivity.ts`).
  const prod = productivitySuggestionKey(focus, kind);
  if (prod) return prod;
  // Finding International Clients has its own set (`lib/international-clients.ts`).
  const intl = internationalClientsSuggestionKey(focus, kind);
  if (intl) return intl;
  // Software Architecture with AI has its own set (`lib/architecture.ts`), and the Architecture Assistant its own.
  const arch = architectureSuggestionKey(focus, kind);
  if (arch) return arch;
  // AI Automation for Business and Everyday Work has its own set (`lib/ai-automation.ts`).
  const auto = aiAutomationSuggestionKey(focus, kind);
  if (auto) return auto;
  // Building AI Agents has its own set (`lib/ai-agents.ts`).
  const agents = aiAgentsSuggestionKey(focus, kind);
  if (agents) return agents;
  // Generative AI: From Fundamentals to Real-World Applications has its own set (`lib/gen-ai.ts`).
  const genAi = genAiSuggestionKey(focus, kind);
  if (genAi) return genAi;
  // The Data Structures and Algorithms course has its own set (`lib/dsa-course.ts`).
  if (focus && (focus.kind === 'lesson' || focus.kind === 'quiz' || focus.kind === 'activity') && isDsaLesson(focus.lessonId)) return `${kind}-dsa`;
  if (focus && (focus.kind === 'lesson' || focus.kind === 'quiz' || focus.kind === 'activity') && isCodeTeachingLesson(focus.lessonId)) return `${kind}-code`;
  return kind;
}

/** Added to Tali's instructions while the learner is in a programming lesson: how to answer questions about code without handing over solutions. */
export const CODE_TEACHING_INSTRUCTIONS =
  'This is a course about programming fundamentals for people who may never have coded. When they ask what a line means, walk through it step by step with the actual values ("after this line, total holds 24"), in plain words, and define any term the first time you use it. When they ask what happens if they change a value, work it out line by line and show what prints. Teach in JavaScript, the course\'s language, and say when an idea works the same in other languages. For an exercise, a quiz question or their own code: never give the finished answer first. Ask them to predict the result, point to the line that matters, give the next small hint, and only show a full solution if they ask for it after trying. Encourage them to run code and check, and to treat AI-written code as something to read and test, not to trust. Offer another example or a similar exercise (changed numbers or names, same idea) when they ask.';
