import { formatTime, parseISODate, toTimeString } from '@/lib/dates';
import { isDemoId } from '@/lib/demo';

import { ACTIVE_STAGES, type ApplicationRow } from '../types';
import { practiceUrl, type PracticeCopy } from './practice';

export type ReminderKind = 'follow-up' | 'eve' | 'hour';

export type CareerReminder = {
  identifier: string;
  date: Date;
  title: string;
  body: string;
  data: { url: string };
};

export type ReminderCopy = PracticeCopy & {
  followUpTitle: (title: string) => string;
  followUpBody: (company: string, kind: ApplicationRow['kind']) => string;
  eveTitle: (company: string, kind: ApplicationRow['kind']) => string;
  eveBody: (title: string, time: string) => string;
  hourTitle: (kind: ApplicationRow['kind']) => string;
  hourBody: (title: string, company: string, time: string) => string;
};

/** iOS keeps at most 64 pending local notifications for an app; the career tracker takes a share. */
export const MAX_CAREER_REMINDERS = 40;
export const REMINDER_PREFIX = 'career:';
const FOLLOW_UP_HOUR = 9;
const EVE_HOUR = 19;
const HOUR_MS = 3_600_000;

export function reminderId(applicationId: string, kind: ReminderKind): string {
  return `${REMINDER_PREFIX}${applicationId}:${kind}`;
}

/**
 * The notifications the tracker wants scheduled: a follow-up on its day at 9:00, and for an
 * interview the evening before at 19:00 (opening Tali to practise) and an hour before. Only for
 * applications still in play, only times still ahead, soonest first, at most 40.
 */
export function planCareerReminders(applications: readonly ApplicationRow[], now: Date, copy: ReminderCopy): CareerReminder[] {
  const plan: CareerReminder[] = [];
  for (const row of applications) {
    // The Developer demo data is for looking at, never for notifying.
    if (!ACTIVE_STAGES.includes(row.stage) || isDemoId(row.id)) continue;
    const detailUrl = `/career/application/${encodeURIComponent(row.id)}`;
    if (row.follow_up_on) {
      const date = parseISODate(row.follow_up_on);
      date.setHours(FOLLOW_UP_HOUR, 0, 0, 0);
      plan.push({ identifier: reminderId(row.id, 'follow-up'), date, title: copy.followUpTitle(row.title), body: copy.followUpBody(row.company, row.kind), data: { url: detailUrl } });
    }
    if (row.interview_at) {
      const at = new Date(row.interview_at);
      if (Number.isNaN(at.getTime())) continue;
      const time = formatTime(toTimeString(at));
      const eve = new Date(at.getFullYear(), at.getMonth(), at.getDate() - 1, EVE_HOUR, 0, 0, 0);
      plan.push({ identifier: reminderId(row.id, 'eve'), date: eve, title: copy.eveTitle(row.company, row.kind), body: copy.eveBody(row.title, time), data: { url: practiceUrl(row, copy) } });
      plan.push({ identifier: reminderId(row.id, 'hour'), date: new Date(at.getTime() - HOUR_MS), title: copy.hourTitle(row.kind), body: copy.hourBody(row.title, row.company, time), data: { url: detailUrl } });
    }
  }
  return plan
    .filter((reminder) => reminder.date.getTime() > now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, MAX_CAREER_REMINDERS);
}
