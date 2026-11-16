/** Feedback's shape and rules, and the email it becomes. */

export const FEEDBACK_KINDS = ['bug', 'feature', 'improvement', 'other'] as const;
export type FeedbackKind = (typeof FEEDBACK_KINDS)[number];

/** Long enough for steps to repeat a bug; the box counts down near the end. */
export const FEEDBACK_MAX_MESSAGE = 2000;
/** The most screenshots or photos one message takes (as in the other apps). */
export const FEEDBACK_MAX_PHOTOS = 5;
export type Feedback = { kind: FeedbackKind; message: string; /** Screenshots or photos to attach (file addresses), up to `FEEDBACK_MAX_PHOTOS`. */ photos?: readonly string[] };

/** App version, system and phone model: what helps trace a problem, added under the message. */
export type DeviceDetails = { appVersion: string; system: string; model: string | null };

export type FeedbackProblem = 'message_missing' | 'message_long';

/** What's wrong with the message, before anything is sent. */
export function feedbackProblems(message: string): FeedbackProblem[] {
  const problems: FeedbackProblem[] = [];
  const text = message.trim();
  if (text === '') problems.push('message_missing');
  else if (text.length > FEEDBACK_MAX_MESSAGE) problems.push('message_long');
  return problems;
}

/** Always in English, so the inbox sorts the same whatever language the learner uses. */
const SUBJECTS: Record<FeedbackKind, string> = { bug: 'Bug Report', feature: 'Feature Request', improvement: 'Improvement', other: 'Feedback' };

/**
 * The email for a piece of feedback: the message as written, then the details that help trace a bug. The mail app sends from the learner's
 * own account, so there is no separate reply address to ask for (owner, 2026-11-16).
 */
export function feedbackEmail(feedback: Feedback, device: DeviceDetails, language: 'en' | 'fil', sentAt: Date): { subject: string; body: string } {
  const details = [
    `Type: ${SUBJECTS[feedback.kind]}`,
    `Sent: ${sentAt.toISOString()}`,
    `Talino ${device.appVersion} · ${device.system}${device.model ? ` · ${device.model}` : ''} · ${language === 'fil' ? 'Tagalog' : 'English'}`,
  ];
  // Said in the body as well as attached, so the inbox shows at a glance that images were meant to come, even if the mail app drops them.
  if (feedback.photos && feedback.photos.length > 0) details.splice(2, 0, `Photos: ${feedback.photos.length} attached`);
  return { subject: `Talino Feedback - ${SUBJECTS[feedback.kind]}`, body: `${feedback.message.trim()}\n\n—\n${details.join('\n')}` };
}

/** The `mailto:` link that opens the phone's mail app with the feedback filled in. */
export function feedbackMailto(address: string, email: { subject: string; body: string }): string {
  return `mailto:${address}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
}

/**
 * The photos to attach after picking more: the earlier ones first, the new ones after them in the order picked, the same photo only once, and
 * never more than `max`. Returns a new list.
 */
export function addPhotos(current: readonly string[], picked: readonly string[], max: number): string[] {
  const all = [...current];
  for (const uri of picked) if (!all.includes(uri)) all.push(uri);
  return all.slice(0, max);
}
