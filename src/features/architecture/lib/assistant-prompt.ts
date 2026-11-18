/**
 * The Architecture Assistant launcher's pure logic. The assistant is Tali with the course focus (`coach/lib/architecture.ts`); this file only builds the text that is
 * prefilled in her chat. Nothing is sent from here: the learner reads the prompt in the chat box and chooses to send it.
 */

export const ASSISTANT_REQUEST_IDS = ['requirements', 'recommendation', 'components', 'database', 'api', 'security', 'scalability', 'cost', 'tradeoffs'] as const;
export type AssistantRequestId = (typeof ASSISTANT_REQUEST_IDS)[number];

export type AssistantRequest = {
  id: AssistantRequestId;
  label: string;
  /** One sentence: what this request gets the learner. */
  description: string;
  /** The line this request adds to the prompt. */
  instruction: string;
};

export const ASSISTANT_REQUESTS: readonly AssistantRequest[] = [
  {
    id: 'requirements',
    label: 'Requirements analysis',
    description: 'Turn the description into functional and quality requirements, and show what is still unknown.',
    instruction: 'Analyse the requirements: list the functional requirements, the quality requirements (performance, availability, security, cost, how easy it is to change), the people and systems involved, and the gaps or contradictions.',
  },
  {
    id: 'recommendation',
    label: 'Architecture recommendation',
    description: 'Propose an overall shape for the system, simplest first, with the reasons.',
    instruction: 'Recommend an overall architecture style and its main parts, starting with the simplest design that could work, and say what would have to be true before a more complex one is justified.',
  },
  {
    id: 'components',
    label: 'Component decomposition',
    description: 'Split the system into parts with clear responsibilities and boundaries.',
    instruction: 'Break the system into components: for each, its single responsibility, what it depends on and what depends on it, and where the boundaries should be. Point out any component that does too much.',
  },
  {
    id: 'database',
    label: 'Database design',
    description: 'Think through the data: what to store, where, and how the tenants or users are kept apart.',
    instruction: 'Review the data design: the main entities and how they relate, which kind of data store fits and why, how data is separated between tenants or users, and the indexing and consistency concerns to check.',
  },
  {
    id: 'api',
    label: 'API architecture',
    description: 'Shape the interfaces between the parts and with the outside world.',
    instruction: 'Review the API design: the contract style and why, how it is versioned, where authentication and authorisation happen, how errors and retries behave, and which integrations or events are involved.',
  },
  {
    id: 'security',
    label: 'Security recommendations',
    description: 'Find the trust boundaries and the design-level risks around them.',
    instruction: 'Review the design for security at the design level: the assets worth protecting, the trust boundaries, identity and access, secrets handling, and how users or tenants are isolated. Do not give exploit steps, and say which parts need a security professional.',
  },
  {
    id: 'scalability',
    label: 'Scalability assessment',
    description: 'Work out what would limit growth first, and how to find out by measuring.',
    instruction: 'Assess scalability: what is likely to become the bottleneck first, what I should measure to find out, what the simplest way to relieve each limit would be, and what I should not build until a measurement says I need it.',
  },
  {
    id: 'cost',
    label: 'Cost considerations',
    description: 'See what drives cost in relative terms, in people, operations and infrastructure.',
    instruction: 'Explain what would drive the cost of this system in relative terms (build effort, running it, people and on-call time, infrastructure), where money is easy to waste, and which choices are cheap to reverse. Do not quote prices.',
  },
  {
    id: 'tradeoffs',
    label: 'Trade-off comparison',
    description: 'Compare two or more options against the qualities that matter to you.',
    instruction: 'Compare the options I describe (or the main candidates if I name none) against the qualities that matter for this system. For each option give what it is good at, what it costs, and the condition under which it would be the wrong choice.',
  },
];

export const assistantRequest = (id: AssistantRequestId): AssistantRequest => ASSISTANT_REQUESTS.find((request) => request.id === id) ?? ASSISTANT_REQUESTS[0]!;

export const isAssistantRequestId = (value: unknown): value is AssistantRequestId => typeof value === 'string' && (ASSISTANT_REQUEST_IDS as readonly string[]).includes(value);

/** The most characters of each part sent along. The chat box takes 4,000 in all; with the fixed asks below this stays comfortably inside it. */
export const MAX_DESCRIPTION_CHARS = 1200;
export const MAX_CONSTRAINTS_CHARS = 600;
export const MAX_KNOWNS_CHARS = 600;
/** A description shorter than this gives the assistant too little to work from. */
export const MIN_DESCRIPTION_CHARS = 40;

export type AssistantPromptInput = {
  request: AssistantRequestId;
  /** What the application is, who uses it, what it must do. */
  description: string;
  /** Limits the design has to respect: team, budget, deadline, rules, existing systems. */
  constraints?: string;
  /** What is already decided or measured, so the assistant does not guess it. */
  knowns?: string;
};

const clip = (value: string, max: number) => {
  const trimmed = value.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trimEnd()}…` : trimmed;
};

/** The four things every request asks for, whatever the request type. */
export const ALWAYS_ASK: readonly string[] = [
  'List the assumptions you are making.',
  'Name the information you are missing, as questions I can answer.',
  'Explain your reasoning, tied to the requirements I stated.',
  'Give the simplest option that meets my stated requirements first, then what each alternative would cost me (in effort, money, complexity and risk).',
];

/**
 * The text prefilled for Tali: the learner's own description (clipped to 1,200 characters), the constraints and what is known, the request, and the standing asks
 * (assumptions, missing information, reasoning, the simplest option and the cost of the alternatives). The answer is a draft for the learner to check.
 */
export function buildAssistantPrompt({ request, description, constraints = '', knowns = '' }: AssistantPromptInput): string {
  const type = assistantRequest(request);
  const parts: string[] = ['I am working on the architecture of an application. Here is what I know.', '', 'My application:', clip(description, MAX_DESCRIPTION_CHARS) || '(not described yet)'];
  if (constraints.trim() !== '') parts.push('', 'Constraints:', clip(constraints, MAX_CONSTRAINTS_CHARS));
  if (knowns.trim() !== '') parts.push('', 'Already known or decided:', clip(knowns, MAX_KNOWNS_CHARS));
  parts.push('', `What I want from you (${type.label}): ${type.instruction}`, '', 'Whatever the request, please:', ...ALWAYS_ASK.map((line) => `- ${line}`), '', 'Treat your answer as a draft for me to check against my requirements, not as a guarantee. I will make the decision.');
  return parts.join('\n');
}

// ---- Checks before sending ----

export type AssistantPromptProblemId = 'description-empty' | 'description-short' | 'description-clipped' | 'private-email' | 'private-phone' | 'private-key';

/** `blocks`: the prompt would not give the assistant enough to work from. `reminder`: worth a look before sending; the learner decides. */
export type AssistantPromptProblem = { id: AssistantPromptProblemId; severity: 'blocks' | 'reminder'; message: string };

/** An email address anywhere in the text. */
const EMAIL = /[^\s@<>()]+@[^\s@<>()]+\.[A-Za-z]{2,}/;

/** A phone number: with a plus sign and country code, with separators between its groups, or an eleven-digit number starting with 0. Plain long numbers ("10000000 requests") are not phone numbers. */
const PHONE = [/\+\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}\b/, /\(?\b\d{3,4}\)?[\s.-]\d{3}[\s.-]\d{3,4}\b/, /\b0\d{10}\b/];

/**
 * Something that looks like a key or a password: well-known key prefixes, a private key block, "password: value" style pairs, or a long mixed run of letters and digits
 * (a token). A reminder, not a guarantee: it cannot see every kind of secret.
 */
const KEY_PATTERNS = [/\b(?:sk|pk|rk)[-_][A-Za-z0-9_-]{16,}/, /\b(?:ghp|gho|ghs|github_pat)_[A-Za-z0-9_]{16,}/, /\bxox[abprs]-[A-Za-z0-9-]{10,}/, /\bAKIA[0-9A-Z]{12,}\b/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./, /\b(?:password|passwd|passcode|secret|api[_ -]?key|access[_ -]?key|token)\s*[:=]\s*\S{6,}/i];

const looksLikeToken = (text: string) => (text.match(/[A-Za-z0-9_+/=-]{32,}/g) ?? []).some((run) => /[A-Za-z]/.test(run) && /\d/.test(run) && !/^[A-Za-z]+-[A-Za-z-]+$/.test(run));

export function holdsKeyLikeText(text: string): boolean {
  return KEY_PATTERNS.some((pattern) => pattern.test(text)) || looksLikeToken(text);
}

/** Whether the text holds an email address or a phone number. */
export const holdsEmail = (text: string) => EMAIL.test(text);
export const holdsPhone = (text: string) => PHONE.some((pattern) => pattern.test(text));

/**
 * What to look at before opening the assistant: a description too short to work from (blocks), and a reminder to remove an email address, a phone number or a
 * key-like string (the assistant's chat is a conversation with an AI service; real contact details and secrets do not belong in it).
 */
export function assistantPromptProblems({ description, constraints = '', knowns = '' }: Omit<AssistantPromptInput, 'request'>): AssistantPromptProblem[] {
  const out: AssistantPromptProblem[] = [];
  const own = description.trim();
  if (own === '') out.push({ id: 'description-empty', severity: 'blocks', message: 'Describe your application first: what it does, who uses it and what matters most.' });
  else if (own.length < MIN_DESCRIPTION_CHARS) out.push({ id: 'description-short', severity: 'blocks', message: `That is too short to work from (${own.length} of at least ${MIN_DESCRIPTION_CHARS} characters). Say what the application does, who uses it and roughly how many.` });
  if (own.length > MAX_DESCRIPTION_CHARS) out.push({ id: 'description-clipped', severity: 'reminder', message: `Only the first ${MAX_DESCRIPTION_CHARS.toLocaleString('en-US')} characters of the description are sent. Shorten it, or keep the most important parts first.` });

  const everything = `${description}\n${constraints}\n${knowns}`;
  if (holdsEmail(everything)) out.push({ id: 'private-email', severity: 'reminder', message: 'This looks like it holds an email address. Remove it: the assistant never needs real contact details.' });
  if (holdsPhone(everything)) out.push({ id: 'private-phone', severity: 'reminder', message: 'This looks like it holds a phone number. Remove it or replace it with an invented one.' });
  if (holdsKeyLikeText(everything)) out.push({ id: 'private-key', severity: 'reminder', message: 'This looks like it holds a key, token or password. Remove it. Real secrets never belong in a chat, and the design does not need them.' });
  return out;
}

/** True when the prompt can be sent to the assistant as it is (reminders do not stop it). */
export const canOpenAssistant = (problems: readonly AssistantPromptProblem[]) => problems.every((problem) => problem.severity !== 'blocks');
