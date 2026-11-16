/**
 * What Tali said while writing a résumé that isn't part of the résumé itself: questions she needs answered, skills she
 * suggests with their evidence, what a job post asks for that isn't shown. Held in memory for the screen that opens next
 * (the new résumé); never saved, because it is advice, not data.
 */
export type PendingNotes = {
  questions: string[];
  suggestedSkills: { skill: string; evidence: string }[];
  gaps: string[];
};

const notes = new Map<string, PendingNotes>();

export function holdNotes(documentId: string, value: PendingNotes): void {
  if (value.questions.length > 0 || value.suggestedSkills.length > 0 || value.gaps.length > 0) notes.set(documentId, value);
}

/** The notes for a résumé, once: reading them clears them. */
export function takeNotes(documentId: string): PendingNotes | null {
  const found = notes.get(documentId) ?? null;
  notes.delete(documentId);
  return found;
}
