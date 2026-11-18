import type { SQLiteDatabase } from 'expo-sqlite';

import { readAppState, writeAppState } from '@/db/app-state';

import { MAX_CONSTRAINTS_CHARS, MAX_DESCRIPTION_CHARS, MAX_KNOWNS_CHARS, isAssistantRequestId, type AssistantRequestId } from '../lib/assistant-prompt';

/** The key in `app_state` (wiped by "reset all data", which clears that whole table). */
export const ASSISTANT_DRAFT_KEY = 'architecture:assistant-draft';

/** What the learner last typed in the Architecture Assistant launcher, kept so it survives a relaunch. */
export type AssistantDraft = { request: AssistantRequestId; description: string; constraints: string; knowns: string };

export const EMPTY_ASSISTANT_DRAFT: AssistantDraft = { request: 'requirements', description: '', constraints: '', knowns: '' };

const clip = (value: unknown, max: number) => (typeof value === 'string' ? value.slice(0, max) : '');

/** Reads a saved draft back whatever is in it: anything unusable is an empty draft. */
export function parseAssistantDraft(value: unknown): AssistantDraft {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return EMPTY_ASSISTANT_DRAFT;
  const record = value as Record<string, unknown>;
  return {
    request: isAssistantRequestId(record.request) ? record.request : EMPTY_ASSISTANT_DRAFT.request,
    description: clip(record.description, MAX_DESCRIPTION_CHARS),
    constraints: clip(record.constraints, MAX_CONSTRAINTS_CHARS),
    knowns: clip(record.knowns, MAX_KNOWNS_CHARS),
  };
}

export async function readAssistantDraft(db: SQLiteDatabase): Promise<AssistantDraft> {
  return parseAssistantDraft(await readAppState<unknown>(db, ASSISTANT_DRAFT_KEY));
}

export const writeAssistantDraft = (db: SQLiteDatabase, draft: AssistantDraft) => writeAppState(db, ASSISTANT_DRAFT_KEY, parseAssistantDraft(draft));
