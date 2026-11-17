/**
 * The contract between the Soft Skills course content (lessons and projects, written as plain data) and the AI practice engine
 * (role-play with a simulated person, and the message coach). A lesson holds an activity of kind `roleplay` or `message-review` that names
 * a scenario or task by id; the scenario itself lives here, in `practice/scenarios/module-NN.ts`, so the **server builds the AI's
 * instructions from this catalog by id** and a modified app can't rewrite who the partner is or what the evaluator looks for.
 * Everything private to the AI (the partner's hidden worry, what a strong answer does, the common traps) is never sent to the
 * phone. Spec: docs/superpowers/specs/2026-11-17-soft-skills-course-design.md.
 */

/** What the learner is judged on. A scenario names 3 to 6 of these; the report scores only those. */
export const PRACTICE_CRITERIA = [
  'clarity',
  'tone',
  'grammar',
  'professionalism',
  'completeness',
  'empathy',
  'actionability',
  'listening',
  'accountability',
  'problem-solving',
  'structure',
  'relevance',
  'collaboration',
  'adaptability',
  'integrity',
  'negotiation',
] as const;
export type PracticeCriterion = (typeof PRACTICE_CRITERIA)[number];

/** Who the AI plays. */
export const PARTNER_ROLES = ['client', 'manager', 'coworker', 'team-leader', 'recruiter', 'interviewer', 'customer', 'stakeholder', 'audience'] as const;
export type PartnerRole = (typeof PARTNER_ROLES)[number];

export type PracticeDifficulty = 'gentle' | 'realistic' | 'demanding';

/** A conversation the learner holds with a simulated person. */
export type RoleplayScenario = {
  /** `<module-slug-prefix>-<kebab>`, unique, e.g. `comm-late-reply-client`. */
  id: string;
  kind: 'roleplay';
  title: string;
  /** Shown to the learner before they start: where they are, who they are talking to and what has happened (2 to 4 sentences). */
  setting: string;
  /** What the learner is trying to achieve in this conversation, one sentence ("Agree a new delivery date without losing the client's trust"). */
  goal: string;
  partner: {
    role: PartnerRole;
    /** First name only; never a real or famous person. */
    name: string;
    /** Their job or situation in a short phrase ("Owner of a small bakery, hired you to build her website"). */
    title: string;
    /** How they talk and behave, shown to the AI only ("brisk, hates long explanations, warms up when given a concrete next step"). */
    personality: string;
    /** What they privately want, fear or know that the learner does not (AI only). */
    private: string;
    /** How they react as the learner does well or badly, so replies adapt instead of following a script (AI only). */
    reactions: { good: string; poor: string };
  };
  /** The partner's first line, shown by the app (so the conversation opens the same way every time). */
  opening: string;
  /** The conversation may be evaluated after this many learner turns, and ends by itself at `maxTurns`. 3 to 5 and 6 to 12. */
  minTurns: number;
  maxTurns: number;
  criteria: PracticeCriterion[];
  /** What a strong learner does here (AI-only rubric; the AI never recites it during the conversation, and the report phrases it as feedback, not as an answer key). */
  strongSigns: string[];
  /** Typical mistakes to watch for (AI only). */
  traps: string[];
  difficulty: PracticeDifficulty;
  /** A scenario meant to be answered aloud: the app offers the read-aloud partner and keyboard dictation, and the report judges the words only. */
  speaking?: boolean;
};

/** A short piece of writing the learner produces and the message coach reviews. */
export type MessageTask = {
  id: string;
  kind: 'message';
  title: string;
  /** What happened and who the reader is (2 to 4 sentences), shown to the learner. */
  situation: string;
  /** What to write, in one sentence ("Reply to Dana, explain the delay and propose a new date"). */
  brief: string;
  channel: 'email' | 'chat' | 'update' | 'message';
  /** The message the learner is replying to, when there is one (shown to the learner). */
  received?: string;
  /** Facts or moves a complete answer must contain (AI only; 2 to 6, each short). */
  mustInclude: string[];
  /** Roughly how long a good answer is, in words. */
  targetWords: { min: number; max: number };
  criteria: PracticeCriterion[];
  difficulty: PracticeDifficulty;
};

/**
 * Generative AI course (spec docs/superpowers/specs/2026-11-17-generative-ai-course-design.md): the Prompt Playground, the AI Experiment Lab and
 * Model Comparison are one kind of practice item. The learner edits a prompt and runs it on the lab's material **live** (a real model call, badged
 * as such); the server reads this task by id, so `system`, `key`, `facts` and the tools' fixtures never reach the phone (`publicLab`).
 */
export const LAB_EXPERIMENTS = ['playground', 'text-generation', 'summarization', 'classification', 'document-analysis', 'structured-output', 'tool-use'] as const;
export type LabExperiment = (typeof LAB_EXPERIMENTS)[number];

/** One field a structured (JSON) answer must have; checked locally by `lab/check`, not by a model. */
export type LabField = { name: string; type: 'string' | 'number' | 'boolean' | 'string[]'; required?: boolean; /** The value must be one of these (strings only). */ oneOf?: string[] };

/** A tool the model may call in a `tool-use` lab. The server runs it against `fixtures` only (never the network, never code from the phone). */
export type LabTool = {
  name: string;
  description: string;
  params: { name: string; type: 'string' | 'number'; description: string }[];
  /** The answers the tool can give: a call whose arguments equal `args` returns `result`; any other call returns `{ error: "not found" }`. Server only. */
  fixtures: { args: Record<string, string | number>; result: Record<string, string | number | boolean> }[];
};

/** What a good prompt or answer is checked for: shown to the learner before they start (the checklist), and the review scores exactly these. */
export type LabCriterion = { id: string; label: string };

export type LabTask = {
  /** `lab-<kebab>`, unique across the course. */
  id: string;
  kind: 'lab';
  title: string;
  experiment: LabExperiment;
  /** Where the learner is and what they want from the model (2 to 4 sentences). */
  situation: string;
  /** What the learner should get the model to do, in one sentence. */
  goal: string;
  /** The text, data or document the model works on, shown to the learner and sent with their prompt as data (at most 3,000 characters). Required for summarization, classification, document-analysis, structured-output. */
  material?: string;
  /** The text already in the editor; the learner is expected to change it. */
  starterPrompt: string;
  /** Server only: how the model is framed (a short system instruction). It never tells the model what the learner's prompt should say. */
  system: string;
  /** Two prompts side by side on the same material (`prompts`), or one prompt on two model tiers, measured live (`models`). Omitted = a single prompt. */
  compare?: 'prompts' | 'models';
  /** How many runs one session allows (2 to 8); the session counts once against the allowance. */
  maxRuns: number;
  /** `json` means the model is asked for JSON and the reply is checked against `fields` by code. */
  output: { format: 'text' } | { format: 'json'; fields: LabField[] };
  /** Server only, for classification and structured output: the values a correct answer has (`expected[fieldName]`). Compared by code after the run; shown only after the learner's review, as "what the material says". */
  key?: Record<string, string | number | boolean | string[]>;
  /** Server only, document-analysis and summarization: facts the material states, so the review can tell supported claims from invented ones. */
  facts?: string[];
  /** Server only, tool-use labs: the tools the model may call (at most 3). */
  tools?: LabTool[];
  /** 3 to 6 things a strong prompt does here; shown as the checklist and scored by the review. */
  criteria: LabCriterion[];
  /** 3 to 5 prompt-improvement suggestions, public, shown after the first run (static text, never model output). */
  tips: string[];
  /** A hand-written example of a strong prompt and what its answer looks like. Public, always labelled "Illustration, not a real model's output". */
  example: { prompt: string; outcome: string };
  /** 2 to 4 things to check in ANY output of this task, public ("every number appears in the material"). */
  verify: string[];
  difficulty: PracticeDifficulty;
};

export type PracticeItem = RoleplayScenario | MessageTask | LabTask;
