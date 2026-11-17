/**
 * The shape of every course in Talino. Course content is plain data (one file per course in this
 * folder), so it can later be patched from the server without a release (the business plan's
 * "lessons stored as server content" fallback). Content files import these types relatively
 * (`./types`), never through `@/`, so they type-check on their own.
 */

import type { Activity } from '../../activities/types';
import type { Audience } from './levels';

export type { Audience, ExperienceLevel } from './levels';

/** Who a course is for; the starter quiz recommends a course from these. */
export type AudienceId =
  | 'fresh-grad'
  | 'experienced-dev'
  | 'career-changer'
  | 'educator'
  | 'builder';

/**
 * `path`: one course of the AI-Assisted Development path (`Course.path`), sized by its syllabus (7 to 15 lessons).
 * `standard`: a course of the wider catalog (programming, web, mobile, backend, AI, engineering, careers), sized by its entry
 * in `content/catalog/syllabus` (5 to 15 lessons); learning paths (`content/catalog/paths`) group them.
 */
export type CourseKind = 'starter' | 'career' | 'mini' | 'path' | 'standard';

/** How much a course assumes; shown on the course and used to order a path. */
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

/** The AI-Assisted Development path that `Course.path` describes. The wider learning paths are `content/catalog/paths`. */
export type PathId = 'ai-dev';

/** The categories of the catalog (the owner's direction, 2026-11-14: learn to build software with AI); every course has exactly one primary category (`content/catalog/meta`). */
export const CATEGORY_IDS = [
  'ai-coding-fundamentals',
  'vibe-coding',
  'ai-coding-tools',
  'ai-workflows',
  'advanced-ai-engineering',
  'build-and-monetize',
  'careers',
] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/** What a learner is trying to do; a course lists the goals it serves (`content/catalog/meta`). */
export const LEARNING_GOAL_IDS = ['learn-programming', 'build-website', 'build-mobile-app', 'learn-ai-dev', 'become-developer', 'get-job', 'freelance', 'build-sell-app', 'teach'] as const;
export type LearningGoalId = (typeof LEARNING_GOAL_IDS)[number];

/** Whether a course can be opened now. Every course has its content; `coming-soon` exists for a listed-but-unwritten course. */
export type Availability = 'available' | 'coming-soon';

/** A course's catalog metadata: one row per course, in `content/catalog/meta`. Lesson counts, minutes, skills and objectives are read from the course, never copied here. */
export type CourseMeta = {
  category: CategoryId;
  /** Free-form extra topics a search should find ("hooks", "interview", "pgvector"…), lower case. */
  tags: string[];
  /** Ids from `content/catalog/technologies`. */
  technologies: string[];
  goals: LearningGoalId[];
  /** Course ids that should come first; advice, never a lock. */
  prerequisites: string[];
  /** YYYY-MM-DD the course went into the catalog. */
  published: string;
  availability: Availability;
};

/** The AI development tools the AI-Assisted Development path compares (`content/ai-dev/tools.ts`). */
export type AiToolId = 'chatgpt' | 'claude' | 'claude-code' | 'codex' | 'cursor' | 'copilot' | 'gemini';

/** A link to an official documentation page that a version-sensitive statement was checked against. */
export type SourceLink = { label: string; url: string };

/**
 * What a developer should know about one AI tool, checked against its official documentation on
 * `checked`. Kept in one file so the comparison lesson, the AI tools guide and every course that
 * draws a `toolComparison` block update together when a product changes.
 */
export type AiTool = {
  id: AiToolId;
  name: string;
  maker: string;
  /** One short phrase: "Chat assistant", "Terminal coding agent", "AI code editor"… */
  kind: string;
  /** Development tasks it suits best (2 to 4 short items). */
  bestFor: string[];
  strengths: string[];
  limits: string[];
  /** How it gets context about your code (pasted, uploaded, the open repository, an index…). */
  context: string;
  /** What it can do on its own (edit files, run commands, open pull requests), and what it can't. */
  agent: string;
  /** Where it plugs in: editors, terminal, GitHub, MCP… */
  integrations: string;
  /** Which plans include what, in words; never a price figure, because prices change and differ by country. */
  plans: string;
  sources: SourceLink[];
  /** YYYY-MM-DD the entry was checked against `sources`. */
  checked: string;
};

/** One block of a lesson card, drawn in order. Text may use **bold** and `inline code`. */
/** The kinds of block a lesson body is made of (below). Any of them may carry an `audience`: see `LessonBlock`. */
export type LessonBlockKind =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  /** Code the learner can copy. `language` is a label only (no highlighting). */
  | { type: 'code'; language: string; code: string; label?: string }
  /** A prompt to paste into an AI assistant, with a Copy button. */
  | { type: 'prompt'; text: string; label?: string }
  | { type: 'tip'; text: string }
  /** Something that goes wrong often, or a safety/ethics point. */
  | { type: 'warning'; text: string }
  /** An interactive visual from the visuals library (`features/visuals`), by id: the learner presses buttons and watches it work. */
  | { type: 'visual'; id: string; caption?: string }
  /** Something the learner does: predict the output, fix the bug, arrange the lines… Validated, with hints; pays XP once. */
  | { type: 'activity'; activity: Activity }
  /** A deeper explanation tucked behind a "Show more" so the lesson stays short; the text is kept, never removed. */
  | { type: 'details'; summary: string; body: string[] }
  /** A diagram: `json` is a `DiagramSpec` (validated before it is drawn), `mermaid` a Mermaid flowchart, sequence, class or ER diagram (safe subset). A bad one falls back to its text summary. */
  | { type: 'diagram'; format: 'json' | 'mermaid'; source: unknown; caption?: string }
  /** The lesson's key points as a visual summary. */
  | { type: 'takeaways'; items: string[] }
  /** A comparison table (technologies, approaches): a header row and rows of the same width. */
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  /**
   * A version-sensitive statement about a product (a feature, a command, a setting, a plan), with the date
   * it was checked and the official pages it was checked against. Drawn as a dated note with its links,
   * so the learner knows it can change and where to look. `plans` names the plans a feature needs.
   */
  | { type: 'version'; text: string; checked: string; sources: SourceLink[]; plans?: string }
  /**
   * "AI in Action" (Generative AI course): a hand-written illustration of a prompt and the kind of answer it gets, with what to notice. It is NEVER a real
   * model's output and is always drawn with an "Illustration" badge saying so; a live model run is a `prompt-lab` activity instead.
   */
  | { type: 'demo'; title: string; prompt: string; output: string; notice: string }
  /** A comparison of AI tools drawn from `content/ai-dev/tools.ts`, so it stays current with that one file. */
  | { type: 'toolComparison'; tools: AiToolId[]; caption?: string };

/**
 * One block of a lesson. Any block may carry an `audience`: the range of learner experience levels it is written for
 * (`levels.ts`). A block with none is for everyone. A lesson keeps its shared explanation and adds, for example, a
 * plain-language walk-through for beginners (`{ max: 'beginner' }`) and an "in a real codebase" block for advanced
 * learners and professionals (`{ min: 'advanced' }`); the app shows the blocks that fit the learner and always offers
 * "Show everything", so no concept is ever withheld.
 */
export type LessonBlock = LessonBlockKind & { audience?: Audience };

export type QuizQuestion = {
  /** `<lessonId>-q<n>`, unique across the app. */
  id: string;
  /** The levels this question is written for. Shared questions have none; a lesson adds a gentler or a harder one by level. */
  audience?: Audience;
  prompt: string;
  /** 3 or 4 choices. */
  choices: string[];
  /** Index into `choices` of the one correct answer. */
  answer: number;
  /** Shown after answering: why the answer is right (one or two sentences). */
  explanation: string;
};

/** The small hands-on task at the end of a lesson, done on a laptop. */
export type LessonTask = {
  title: string;
  steps: string[];
  /** Rough minutes, 5–20. */
  minutes: number;
};

/**
 * The lesson's opening, shown before the content: what it is for and why the learner should care.
 * Written for every lesson (checked by `lib/lesson-structure.ts`), so a lesson never starts cold.
 */
export type LessonIntro = {
  /** Two to four things the learner will be able to do afterwards, each starting with a verb ("Write…", "Spot…"). */
  objectives: string[];
  /** One or two sentences: why this matters for the learner's own goal (a job, clients, students, their app). */
  why: string;
};

export type Lesson = {
  /** `<courseId>-<two-digit day>`, e.g. `developer-07`. Unique across the app. */
  id: string;
  /** 1-based position in the course (the "day"). */
  day: number;
  title: string;
  /** One sentence shown on the lesson list. */
  summary: string;
  /** Reading time plus task, about 15. */
  minutes: number;
  /** Skill ids from the course's `skills` that this lesson builds. */
  skills: string[];
  /** Objectives and why it matters (the "Lesson introduction"). Optional in the type so older patched content still loads; the content tests require it. */
  intro?: LessonIntro;
  /**
   * The teaching: explanations, visuals, code and the key takeaways (last). Activities can sit anywhere in
   * the list, but the app always draws them **after the quiz**, in the practice stage, so nothing is asked
   * before it has been taught (see `lib/lesson-structure.ts`).
   */
  body: LessonBlock[];
  /** 3 to 5 questions. */
  quiz: QuizQuestion[];
  task: LessonTask;
  /** Extra steps for a level, added after the shared task's steps (a scaffold for a complete beginner, a harder variation for a professional). */
  taskExtra?: { audience: Audience; steps: string[] }[];
};

export type ProjectStep = {
  /** `<projectId>-s<n>`. */
  id: string;
  /** The levels this step is for (an extra requirement for advanced learners, a scaffolded step for beginners). No range = everyone. */
  audience?: Audience;
  text: string;
  /** A starter link (template, docs page, tool) when one helps. */
  link?: string;
};

export type Project = {
  /** `<courseId>-p<n>`. */
  id: string;
  title: string;
  /** One or two sentences: what the learner makes. */
  summary: string;
  /** The proof it gives an employer, client or school (one sentence). */
  outcome: string;
  /** The project opens once this lesson day is done. */
  unlockAfterDay: number;
  /**
   * The practice items (role-plays and message tasks, ids in `features/practice/scenarios`) the steps name. The project screen shows how many the learner
   * has practised and the review is given a short, labelled summary of their saved results. Optional: only the Soft Skills projects use it.
   */
  practiceItemIds?: string[];
  steps: ProjectStep[];
  submission: {
    /** `url` for a repo, live site or profile link; `text` for pasted work (a proposal, a lesson plan). */
    kind: 'url' | 'text';
    label: string;
    placeholder: string;
    /** What a good submission contains, shown under the field. */
    hint: string;
  };
  /** What the coach checks when reviewing (3–6 short criteria). */
  rubric: string[];
  /**
   * Extra criteria for a level: the same project asks more of an advanced learner (tests, error handling, a security review) and
   * less of a complete beginner. The coach checks the shared rubric plus the items for the learner's level.
   */
  rubricExtra?: { audience: Audience; items: string[] }[];
};

/** The coach's extra role while this course is open (mock interviewer, code reviewer…). */
export type CoachRole = {
  id: string;
  label: string;
  /** One sentence shown to the learner. */
  description: string;
  /** Instructions added to the coach's system prompt for this role. */
  instructions: string;
};

/**
 * A run of consecutive lessons a long course groups together (Programming Fundamentals has twelve). `firstDay` and `lastDay` are
 * lesson days, inclusive; the modules of a course cover every lesson once, in order (`standardCourseProblems`). The Adventure map
 * draws one chapter per module, titled with it.
 */
export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  firstDay: number;
  lastDay: number;
};

export type Course = {
  id: string;
  kind: CourseKind;
  title: string;
  /** Short line under the title. */
  tagline: string;
  /** Two or three sentences for the course page. */
  description: string;
  /** The finish line: what the learner has at the end. */
  finishLine: string[];
  audiences: AudienceId[];
  /** Skill meter entries: id is kebab-case, unique within the course. */
  skills: { id: string; label: string }[];
  lessons: Lesson[];
  projects: Project[];
  /** Career courses have one; the starter course and mini-courses usually don't. */
  coachRole?: CoachRole;
  /** A sponsored mini-course is labelled as such. */
  sponsor?: string;
  /** Material Symbols name for the course tile. */
  icon: string;
  /** Last content review date, YYYY-MM-DD. */
  updated: string;
  /** What the course assumes. Every `path` and `standard` course has one. */
  level?: CourseLevel;
  /**
   * What the learner will be able to do, one verb-first line each (3 to 6). Standard courses have them; for the older
   * courses `finishLine` plays this part (`learningObjectives`).
   */
  objectives?: string[];
  /** A long standard course's modules, in order (see `CourseModule`). Most courses have none. */
  modules?: CourseModule[];
  /** The path this course belongs to and its place in it (1-based). Required for `path` courses. */
  path?: { id: PathId; order: number };
};
