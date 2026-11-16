/** A project's submission as stored on the phone: the link (for link projects) and the learner's note or pasted work. */
export type Submission = { link: string; note: string };

export function parseSubmission(value: string | null | undefined): Submission {
  if (!value) return { link: '', note: '' };
  try {
    const parsed = JSON.parse(value) as Partial<Submission>;
    return { link: typeof parsed.link === 'string' ? parsed.link : '', note: typeof parsed.note === 'string' ? parsed.note : '' };
  } catch {
    // Anything stored before this shape was plain text.
    return { link: '', note: value };
  }
}

export function serializeSubmission(submission: Submission): string {
  return JSON.stringify({ link: submission.link.trim(), note: submission.note.trim() });
}

/** A link Tali can open: a full https address. */
export function isValidLink(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && url.hostname.includes('.');
  } catch {
    return false;
  }
}
