import type { ApplicationKind } from '../types';

export type PracticeCopy = {
  practisePromptJob: (title: string, company: string) => string;
  practisePromptFreelance: (title: string, client: string) => string;
};

/** Tali's role for getting ready: the mock interviewer for a job, the proposal reviewer for a client call. */
export function practiceMode(kind: ApplicationKind): string {
  return kind === 'job' ? 'mock-interviewer' : 'proposal-reviewer';
}

export function practicePrompt(application: { kind: ApplicationKind; title: string; company: string }, copy: PracticeCopy): string {
  return application.kind === 'job' ? copy.practisePromptJob(application.title, application.company) : copy.practisePromptFreelance(application.title, application.company);
}

/**
 * Where practising opens, for a notification's `url`. A job interview opens the mock interview set up for that position (open to
 * everyone, with its own daily allowance); a client call keeps Tali's proposal reviewer.
 */
export function practiceUrl(application: { kind: ApplicationKind; title: string; company: string }, copy: PracticeCopy): string {
  if (application.kind === 'job') return `/interview/setup?position=${encodeURIComponent(application.title)}`;
  return `/coach?mode=${encodeURIComponent(practiceMode(application.kind))}&prompt=${encodeURIComponent(practicePrompt(application, copy))}`;
}
