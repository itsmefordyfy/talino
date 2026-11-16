import { addDays, parseISODate, type ISODate } from '@/lib/dates';
import type { Language } from '@/lib/i18n';

export type DailyReminder = { id: string; date: Date; title: string; body: string };

export const DAILY_PREFIX = 'daily:';
const DAYS_AHEAD = 7;

/**
 * The daily lesson reminders for the next week, one a day at the learner's time, skipping today once
 * a lesson is done (a repeating trigger can't skip a day, so they are scheduled one by one and
 * planned again whenever progress changes or the app opens). The words follow the streak.
 */
export function planDailyReminders(input: { now: Date; today: ISODate; time: { hour: number; minute: number }; doneToday: boolean; streak: number; courseTitle: string | null; /** Weekdays to remind on (0 Sunday … 6 Saturday); empty or missing means every day. */ days?: readonly number[]; /** Minutes the learner gives a day, for the words. */ minutes?: number | null; /** The words' language; English when absent. A reminder is scheduled in the language chosen at that moment, so changing it plans them again. */ language?: Language }): DailyReminder[] {
  const fil = input.language === 'fil';
  const plan: DailyReminder[] = [];
  for (let offset = 0; offset < DAYS_AHEAD; offset += 1) {
    const day = addDays(input.today, offset);
    if (offset === 0 && input.doneToday) continue;
    const date = parseISODate(day);
    if (input.days && input.days.length > 0 && !input.days.includes(date.getDay())) continue;
    date.setHours(input.time.hour, input.time.minute, 0, 0);
    if (date <= input.now) continue;
    // A streak alive today is at risk only on the first reminder; later days just invite.
    const atRisk = offset === 0 && input.streak > 0;
    plan.push({
      id: `${DAILY_PREFIX}${day}`,
      date,
      title: fil ? (atRisk ? `Ingatan ang ${input.streak}-day streak mo` : `Ang ${input.minutes ?? 15} minuto mo para sa Talino`) : atRisk ? `Keep your ${input.streak}-day streak` : `Your ${input.minutes ?? 15} minutes with Talino`,
      body: fil
        ? input.courseTitle
          ? `Handa na ang lesson mo ngayon sa ${input.courseTitle}.`
          : 'Handa na ang lesson mo ngayon. Isang maikling lesson, isang maliit na task.'
        : input.courseTitle
          ? `Today’s lesson in ${input.courseTitle} is ready.`
          : 'Today’s lesson is ready. One short lesson, one small task.',
    });
  }
  return plan;
}
