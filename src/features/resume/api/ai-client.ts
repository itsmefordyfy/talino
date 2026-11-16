import type { CoachIdentity } from '@/features/coach';
import { ApiError, postJson } from '@/lib/api';
import { deviceId } from '@/lib/device-id';
import { newId } from '@/lib/id';
import type { Language } from '@/lib/language';

import { parseGenerated, parseImported, type Generated, type Improved, type Review, type Suggestion } from '../lib/ai';
import type { ImproveInput } from '../lib/ai-prompts';
import type { ResumeContent } from '../lib/document';
import { parseDraft, type Draft, type DraftInput } from '../lib/portfolio-ai';
import { parseReview, type PortfolioReview, type ReviewInput } from '../lib/portfolio-review';
import type { ResumeLevel } from '../lib/templates';
import type { TemplateAiDraft, TemplateTone } from '../lib/template-ai';

/** The résumé as the server needs it: the picture is for printing on the phone and is never sent. */
const forServer = (content: ResumeContent): ResumeContent => ({ ...content, photo: undefined });

const who = (identity: CoachIdentity) => ({ deviceId: deviceId(), appUserId: identity.appUserId, entitlements: identity.entitlements });

/** What the learner is told when an AI action fails (the words are in the strings table under the same name). */
export type AiErrorKey = 'offline' | 'unavailable' | 'all_access_required' | 'resume_limit' | 'busy' | 'file_too_large' | 'unsupported_file' | 'unreadable_file' | 'unknown';

const KNOWN: readonly string[] = ['unavailable', 'all_access_required', 'resume_limit', 'busy', 'file_too_large', 'unsupported_file', 'unreadable_file'];

export function aiErrorKey(error: unknown): AiErrorKey {
  if (!(error instanceof ApiError)) return 'unknown';
  const { code, status } = error;
  if (code === 'network') return 'offline';
  if (code === 'quota_unavailable' || code === 'chat_in_progress') return 'busy';
  // A gateway or hosting error with no body of ours: the same "try again soon" as a busy model, or the allowance for a 429.
  if (code === 'unknown' && status === 429) return 'resume_limit';
  if (code === 'unknown' && (status === 503 || status === 504)) return 'busy';
  return KNOWN.includes(code) ? (code as AiErrorKey) : 'unknown';
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const strings = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);
const SECTIONS = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements'];

function readSuggestion(value: unknown): Suggestion | null {
  if (!isRecord(value) || typeof value.key !== 'string') return null;
  if (value.kind === 'skill' && typeof value.skill === 'string' && typeof value.evidence === 'string' && typeof value.reason === 'string') return { key: value.key, kind: 'skill', skill: value.skill, evidence: value.evidence, reason: value.reason };
  if (value.kind === 'rewrite' && isRecord(value.target) && typeof value.target.section === 'string' && typeof value.before === 'string' && typeof value.after === 'string' && typeof value.reason === 'string') {
    return { key: value.key, kind: 'rewrite', target: value.target as never, before: value.before, after: value.after, reason: value.reason };
  }
  if (value.kind === 'bullets' && typeof value.section === 'string' && typeof value.id === 'string' && typeof value.reason === 'string') {
    return { key: value.key, kind: 'bullets', section: value.section as never, id: value.id, before: strings(value.before), after: strings(value.after), reason: value.reason };
  }
  return null;
}

/** A review from the server, checked again here: anything malformed is dropped. (Applying a suggestion re-checks it against the résumé as it is then.) */
export function readReview(value: unknown): Review | null {
  if (!isRecord(value) || typeof value.verdict !== 'string' || value.verdict === '' || !Array.isArray(value.suggestions)) return null;
  return {
    verdict: value.verdict,
    weak: (Array.isArray(value.weak) ? value.weak : []).flatMap((item): Review['weak'] => (isRecord(item) && typeof item.section === 'string' && SECTIONS.includes(item.section) && typeof item.advice === 'string' ? [{ section: item.section as Review['weak'][number]['section'], advice: item.advice }] : [])),
    suggestions: value.suggestions.map(readSuggestion).filter((item): item is Suggestion => item !== null),
    questions: strings(value.questions),
  };
}

export function readImproved(value: unknown): Improved | null {
  if (!isRecord(value)) return null;
  const bullets = strings(value.bullets);
  return bullets.length > 0 ? { bullets, reason: typeof value.reason === 'string' ? value.reason : '', questions: strings(value.questions) } : null;
}

type Job = { title: string; description: string } | null;

export async function requestGenerated(identity: CoachIdentity, input: { requestId: string; content: ResumeContent; goal: string; level: ResumeLevel | null; job: Job; language: Language }): Promise<Generated> {
  const body = await postJson('/api/resume', { ...who(identity), mode: 'generate', ...input, content: forServer(input.content) }, { timeoutMs: 75_000 });
  // The server sends the checked answer; reading it through the same parser makes sure of its shape here too.
  const generated = parseGenerated(JSON.stringify(body.generated ?? null));
  if (!generated) throw new ApiError('unknown');
  return generated;
}

export async function requestReview(identity: CoachIdentity, input: { requestId: string; content: ResumeContent; job: Job; language: Language }): Promise<Review> {
  const review = readReview((await postJson('/api/resume', { ...who(identity), mode: 'review', ...input, content: forServer(input.content) }, { timeoutMs: 75_000 })).review);
  if (!review) throw new ApiError('unknown');
  return review;
}

export async function requestImproved(identity: CoachIdentity, input: ImproveInput & { requestId: string; language: Language }): Promise<Improved> {
  const improved = readImproved((await postJson('/api/resume', { ...who(identity), mode: 'improve', ...input }, { timeoutMs: 60_000 })).improved);
  if (!improved) throw new ApiError('unknown');
  return improved;
}

export type ImportSource = { kind: 'text'; text: string } | { kind: 'file'; name: string; mime: string; data: string };

export async function requestImport(identity: CoachIdentity, input: { requestId: string; source: ImportSource; language: Language }): Promise<ResumeContent> {
  const payload = input.source.kind === 'text' ? { text: input.source.text } : { file: { name: input.source.name, mime: input.source.mime, data: input.source.data } };
  const body = await postJson('/api/resume', { ...who(identity), mode: 'import', requestId: input.requestId, language: input.language, ...payload }, { timeoutMs: 120_000 });
  const imported = parseImported(JSON.stringify(body.imported ?? null));
  if (!imported) throw new ApiError('unreadable_file', 422);
  return imported;
}

/** A failure worth one more try: the model or the server was busy for a moment. Offline, a refusal or a bad request is not. */
const worthRetrying = (error: unknown) => error instanceof ApiError && (error.code === 'busy' || error.status === 502 || error.status === 503 || error.status === 504);

/** Runs a request, and once more with a new request id (the first one may still be counted) after a short pause when it failed in a way that can pass. */
async function withRetry<T>(firstId: string, run: (requestId: string) => Promise<T>): Promise<T> {
  try {
    return await run(firstId);
  } catch (error) {
    if (!worthRetrying(error)) throw error;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return run(newId());
  }
}

/** Tali's draft of the portfolio's wording, checked again here against the same facts the server used. */
export async function requestPortfolioDraft(identity: CoachIdentity, input: DraftInput & { requestId: string; language: Language }): Promise<Draft> {
  const { requestId, language, ...draftInput } = input;
  return withRetry(requestId, async (id) => {
    const body = await postJson('/api/resume', { ...who(identity), mode: 'portfolio', requestId: id, language, ...draftInput }, { timeoutMs: 75_000 });
    const draft = parseDraft(JSON.stringify(body.draft ?? null), draftInput);
    if (!draft) throw new ApiError('draft_unusable', 422);
    return draft;
  });
}

/** Tali's review of the whole portfolio, read again here with the same checks as the server's. */
export async function requestPortfolioReview(identity: CoachIdentity, input: ReviewInput & { requestId: string; language: Language }): Promise<PortfolioReview> {
  const { requestId, language, ...reviewInput } = input;
  return withRetry(requestId, async (id) => {
    const body = await postJson('/api/resume', { ...who(identity), mode: 'portfolio-review', requestId: id, language, ...reviewInput }, { timeoutMs: 90_000 });
    const review = parseReview(JSON.stringify(body.review ?? null), reviewInput);
    if (!review) throw new ApiError('draft_unusable', 422);
    return review;
  });
}

/** A message template (cover letter, proposal, follow-up…) rewritten for one situation. The text comes back as written; the app puts the learner's private details back in. */
export async function requestTemplateDraft(identity: CoachIdentity, input: { requestId: string; kind: string; draft: string; details: string; tone: TemplateTone; language: Language }): Promise<TemplateAiDraft> {
  const body = await postJson('/api/resume', { ...who(identity), mode: 'template', ...input }, { timeoutMs: 75_000 });
  const draft = isRecord(body.draft) ? body.draft : null;
  const text = draft && typeof draft.text === 'string' ? draft.text.trim() : '';
  if (!text) throw new ApiError('unknown');
  return { text, questions: strings(draft?.questions) };
}
