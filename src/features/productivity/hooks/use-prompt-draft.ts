import { useEffect, useRef, useState } from 'react';

import { useSQLiteContext } from 'expo-sqlite';

import { readPromptDraft, writePromptDraft } from '../api/productivity-repo';
import { useReadOnce } from './use-read-once';

/** How long the editor waits after the last keystroke before it saves, so typing does not write on every letter. */
export const DRAFT_SAVE_DELAY_MS = 600;

/** The prompt saved for a template, read when the template is chosen; null when the learner has not edited it. */
export const useSavedPromptDraft = (templateId: string) => useReadOnce(`prompt:${templateId}`, (db) => readPromptDraft(db, templateId));

export type UsePromptDraftOptions = { templateId: string; /** The saved text, or the template's own. */ initial: string; /** The template's own text, for "Start again". */ original: string };

/**
 * The prompt being edited: the text, saved a moment after the last change (and at once when the editor closes or the learner switches template, so
 * nothing typed is lost), and a way back to the template's own text.
 */
export function usePromptDraft({ templateId, initial, original }: UsePromptDraftOptions) {
  const db = useSQLiteContext();
  const [text, setTextState] = useState(initial);
  const [saveError, setSaveError] = useState(false);
  const pending = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const value = pending.current;
    if (value === null) return;
    pending.current = null;
    writePromptDraft(db, templateId, value).then(
      () => setSaveError(false),
      () => setSaveError(true),
    );
  };
  const flushRef = useRef(flush);
  useEffect(() => {
    flushRef.current = flush;
  });
  // Leaving the editor (another template, the screen closing) saves what is waiting.
  useEffect(() => () => flushRef.current(), []);

  const setText = (next: string) => {
    setTextState(next);
    pending.current = next;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => flushRef.current(), DRAFT_SAVE_DELAY_MS);
  };
  const startAgain = () => {
    setTextState(original);
    pending.current = original;
    flush();
  };

  return { text, setText, startAgain, saveError, flush };
}
