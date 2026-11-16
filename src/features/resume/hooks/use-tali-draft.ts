import { useState } from 'react';

import { useCoachIdentity } from '@/features/coach';
import { openPaywall, useAccess } from '@/features/store';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { ApiError } from '@/lib/api';
import { successFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { aiErrorKey, requestPortfolioDraft, requestPortfolioReview, type AiErrorKey } from '../api/ai-client';
import { builderStrings } from '../builder-strings';
import { draftStrings } from '../draft-strings';
import type { ResumeContent } from '../lib/document';
import type { Draft, DraftProject } from '../lib/portfolio-ai';
import type { PortfolioReview, ReviewInput } from '../lib/portfolio-review';
import { useMasterContent } from './use-documents';

export type DraftRequest = {
  /** The résumé to write from, when it is not the master profile (a document in the editor keeps its own content). */
  resume?: ResumeContent;
  /** What the words are for; a portfolio unless this is the résumé editor. */
  target?: 'portfolio' | 'resume';
  headline: string;
  about: string;
  projects: DraftProject[];
  want: { headline: boolean; about: boolean; projectIds: string[] };
};

/** The shared AI errors, plus the two a draft or review can add. */
export type DraftError = AiErrorKey | 'unusable' | 'outdated';

export type TaliTaskState<T> = { status: 'idle' } | { status: 'working' } | { status: 'done'; result: T } | { status: 'failed'; error: DraftError };
export type TaliDraftState = { status: 'idle' } | { status: 'working' } | { status: 'done'; draft: Draft } | { status: 'failed'; error: DraftError };

/** Sorts a failure into what the learner is told: the model's output couldn't be used, the server is older than the app, or one of the shared AI messages. */
export function draftErrorOf(caught: unknown): DraftError {
  if (caught instanceof ApiError) {
    if (caught.code === 'draft_unusable') return 'unusable';
    // The server refused the request's shape: an older server that doesn't know this mode.
    if (caught.code === 'bad_request' && caught.status === 400) return 'outdated';
  }
  return aiErrorKey(caught);
}

/** The words for a failed draft or review. */
export function useDraftErrorText(): (error: DraftError) => string {
  const builder = useLocalized(builderStrings);
  const own = useLocalized(draftStrings);
  return (error) => (error === 'unusable' ? own.unusable : error === 'outdated' ? own.outdated : builder.errors[error]);
}

/** The learner's facts for the model: the résumé without a name or contact details, and the skills. */
function useFacts() {
  const master = useMasterContent();
  const content = master.content;
  const resume = content ? { ...content, name: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', photo: undefined } : undefined;
  return { resume, skills: content?.skills ?? [], hasFacts: !!content && (content.skills.length > 0 || content.experience.length + content.projects.length + content.education.length > 0 || content.summary !== '') };
}

function useTask<T>() {
  const access = useAccess();
  const [state, setState] = useState<TaliTaskState<T>>({ status: 'idle' });
  const run = async (action: string, ask: () => Promise<T>) => {
    if (state.status === 'working') return;
    if (!access.allAccess) {
      void openPaywall('resume');
      return;
    }
    setState({ status: 'working' });
    try {
      const result = await ask();
      setState({ status: 'done', result });
      successFeedback();
    } catch (caught) {
      const error = draftErrorOf(caught);
      if (error === 'unknown') reportError(caught, 'portfolio', { action });
      setState({ status: 'failed', error });
    }
  };
  return { state, run, reset: () => setState({ status: 'idle' }) };
}

/**
 * Asks Tali (or Tala) to write wording. Free learners are sent to the paywall. The résumé goes along as facts only: no name and
 * no contact details leave the phone for this, and the server checks every sentence against what the learner gave.
 */
export function useTaliDraft() {
  const identity = useCoachIdentity();
  const language = useLanguage();
  const facts = useFacts();
  const task = useTask<Draft>();
  const state: TaliDraftState = task.state.status === 'done' ? { status: 'done', draft: task.state.result } : task.state;
  const run = ({ resume, ...request }: DraftRequest) => {
    // A résumé in the editor is its own snapshot: write from it, without the name, contact details or picture.
    const own = resume ? { ...resume, name: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', photo: undefined } : undefined;
    return task.run('tali-draft', () => requestPortfolioDraft(identity, { requestId: newId(), language, skills: resume?.skills ?? facts.skills, resume: (own ?? facts.resume) as never, ...request }));
  };
  return { state, run, reset: task.reset, hasFacts: facts.hasFacts };
}

export type ReviewRequest = Omit<ReviewInput, 'skills' | 'resume' | 'goal' | 'level'> & { goal?: string; level?: string };

/** Asks Tali (or Tala) to review the whole portfolio; the learner's facts and the portfolio's state go along. */
export function useTaliReview() {
  const identity = useCoachIdentity();
  const language = useLanguage();
  const facts = useFacts();
  const master = useMasterContent();
  const task = useTask<PortfolioReview>();
  const run = (request: ReviewRequest) =>
    task.run('tali-review', () => requestPortfolioReview(identity, { requestId: newId(), language, skills: facts.skills, resume: facts.resume as never, goal: master.goal, level: master.level ?? '', ...request }));
  return { state: task.state, run, reset: task.reset, hasFacts: facts.hasFacts };
}
