import { useEffect, useRef, useState } from 'react';

import { reportError } from '@/lib/monitoring';

import type { DocTarget, ResumeDocument } from '../api/document-repo';
import type { ResumeContent } from '../lib/document';
import type { ResumeStyle } from '../lib/templates';
import { useUpdateDocument } from './use-documents';

const SAVE_AFTER_MS = 700;

type Draft = { name: string; style: ResumeStyle; content: ResumeContent; target: DocTarget | null };

/**
 * The résumé being edited. Edits change this state at once (so the preview is live) and are saved to the phone 700 ms after the
 * last one, and again when the learner leaves the screen. Writing on every keystroke would start a cloud backup per letter.
 * The screen's own copy is the truth while it is open; the saved row only seeds it.
 */
export function useDocumentDraft(initial: ResumeDocument) {
  const update = useUpdateDocument();
  const [draft, setDraft] = useState<Draft>({ name: initial.name, style: initial.style, content: initial.content, target: initial.target });
  const saved = useRef(JSON.stringify(draft));
  const latest = useRef(draft);
  // Written after each render (not during it), so leaving the screen saves the very latest edit.
  useEffect(() => {
    latest.current = draft;
  });
  const failed = useRef(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const save = (value: Draft) => {
    const snapshot = JSON.stringify(value);
    if (snapshot === saved.current) return Promise.resolve();
    saved.current = snapshot;
    return update.mutateAsync({ id: initial.id, patch: value }).then(
      () => {
        if (failed.current) {
          failed.current = false;
          setSaveFailed(false);
        }
      },
      (error: unknown) => {
        // Not saved: forget that it was, so the next change (or leaving) tries again.
        saved.current = '';
        failed.current = true;
        setSaveFailed(true);
        reportError(error, 'career', { action: 'save-resume-document' });
      },
    );
  };

  useEffect(() => {
    if (JSON.stringify(draft) === saved.current) return;
    const timer = setTimeout(() => void save(draft), SAVE_AFTER_MS);
    return () => clearTimeout(timer);
    // `save` only reads refs and the stable mutation; the draft is what schedules it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  // Leaving the screen saves what is still waiting.
  useEffect(() => () => void save(latest.current), []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...draft,
    saveFailed,
    setContent: (content: ResumeContent) => setDraft((current) => ({ ...current, content })),
    setStyle: (style: ResumeStyle) => setDraft((current) => ({ ...current, style })),
    setName: (name: string) => setDraft((current) => ({ ...current, name })),
    setTarget: (target: DocTarget | null) => setDraft((current) => ({ ...current, target })),
    /** Saves now (before an export or a generation), resolving once it is on the phone. */
    flush: () => save(latest.current),
  };
}
