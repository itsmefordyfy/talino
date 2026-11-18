import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';

import { readAssistantDraft, writeAssistantDraft, type AssistantDraft } from './assistant-draft';

/** How long the launcher waits after the last keystroke before it saves, so typing does not write on every letter. */
export const ASSISTANT_DRAFT_SAVE_DELAY_MS = 600;

export type SavedAssistantDraft = { status: 'loading' } | { status: 'error'; retry: () => void } | { status: 'ready'; draft: AssistantDraft };

/**
 * The last description the learner typed, read once when the tool opens (never refreshed afterwards: the tool owns the text once it is on screen, and a refetch
 * after some other write must not overwrite what is being typed).
 */
export function useSavedAssistantDraft(): SavedAssistantDraft {
  const db = useSQLiteContext();
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState<{ attempt: number; draft: AssistantDraft | null } | null>(null);

  useEffect(() => {
    let alive = true;
    readAssistantDraft(db).then(
      (draft) => alive && setDone({ attempt, draft }),
      () => alive && setDone({ attempt, draft: null }),
    );
    return () => {
      alive = false;
    };
  }, [db, attempt]);

  if (!done || done.attempt !== attempt) return { status: 'loading' };
  if (done.draft === null) return { status: 'error', retry: () => setAttempt((count) => count + 1) };
  return { status: 'ready', draft: done.draft };
}

/**
 * The draft being edited: saved a moment after the last change, and at once when the tool closes or the learner opens the assistant, so nothing typed is lost.
 * `saveError` is true when the last write failed (the text is still on screen).
 */
export function useAssistantDraftEditor(initial: AssistantDraft) {
  const db = useSQLiteContext();
  const [draft, setDraftState] = useState(initial);
  const [saveError, setSaveError] = useState(false);
  const latest = useRef(draft);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (!dirty.current) return;
    dirty.current = false;
    writeAssistantDraft(db, latest.current).then(
      () => setSaveError(false),
      () => setSaveError(true),
    );
  };
  const flushRef = useRef(flush);
  useEffect(() => {
    flushRef.current = flush;
  });
  // Leaving the tool saves what is waiting.
  useEffect(() => () => flushRef.current(), []);

  const change = (patch: Partial<AssistantDraft>) => {
    const next = { ...latest.current, ...patch };
    latest.current = next;
    dirty.current = true;
    setDraftState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => flushRef.current(), ASSISTANT_DRAFT_SAVE_DELAY_MS);
  };

  return { draft, change, flush, saveError };
}
