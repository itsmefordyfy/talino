import { describe, expect, test } from '@jest/globals';

import { MAX_CAREER_REMINDERS, planCareerReminders, type ReminderCopy } from './reminder-plan';
import { makeApplication } from './test-rows';

const copy: ReminderCopy = {
  practisePromptJob: (title, company) => `Mock interview for ${title} at ${company}`,
  practisePromptFreelance: (title, client) => `Client call for ${title} with ${client}`,
  followUpTitle: (title) => `Follow up: ${title}`,
  followUpBody: (company) => `Check in with ${company}`,
  eveTitle: (company) => `Interview tomorrow at ${company}: practise with Tali`,
  eveBody: (title, time) => `${title} at ${time}`,
  hourTitle: () => 'Interview in an hour',
  hourBody: (title, company, time) => `${title} at ${company}, ${time}`,
};

const NOW = new Date(2026, 10, 13, 10, 0);

describe('planCareerReminders', () => {
  test('a follow-up at 9:00 on its day; an interview the evening before at 19:00 and an hour before', () => {
    const app = makeApplication({ id: 'a1', title: 'Frontend Dev', company: 'Acme', follow_up_on: '2026-11-14', interview_at: new Date(2026, 10, 16, 14, 30).toISOString() });
    const plan = planCareerReminders([app], NOW, copy);
    expect(plan.map((reminder) => [reminder.identifier, reminder.date.getTime()])).toEqual([
      ['career:a1:follow-up', new Date(2026, 10, 14, 9, 0).getTime()],
      ['career:a1:eve', new Date(2026, 10, 15, 19, 0).getTime()],
      ['career:a1:hour', new Date(2026, 10, 16, 13, 30).getTime()],
    ]);
    expect(plan[1].title).toBe('Interview tomorrow at Acme: practise with Tali');
    // A job interview's reminder opens the mock interview set up for that position (open to everyone), not the course-locked coach role.
    expect(plan[1].data.url).toBe(`/interview/setup?position=${encodeURIComponent('Frontend Dev')}`);
    expect(plan[0].data.url).toBe('/career/application/a1');
  });

  test('a freelance call opens the proposal reviewer', () => {
    const app = makeApplication({ id: 'f1', kind: 'freelance', title: 'Landing page', company: 'Bea', interview_at: new Date(2026, 10, 16, 14, 30).toISOString() });
    const [eve] = planCareerReminders([app], NOW, copy);
    expect(eve.data.url).toContain('mode=proposal-reviewer');
  });

  test('only future times, only active applications', () => {
    const today = makeApplication({ id: 'today', follow_up_on: '2026-11-13', interview_at: new Date(2026, 10, 13, 18, 0).toISOString() });
    const won = makeApplication({ id: 'won', stage: 'won', follow_up_on: '2026-11-20' });
    const closed = makeApplication({ id: 'closed', stage: 'closed', interview_at: new Date(2026, 10, 20, 9, 0).toISOString() });
    expect(planCareerReminders([today, won, closed], NOW, copy).map((reminder) => reminder.identifier)).toEqual(['career:today:hour']);
  });

  test('sorted and capped at 40', () => {
    const apps = Array.from({ length: 50 }, (_, index) => makeApplication({ id: `x${index}`, follow_up_on: `2026-12-${String((index % 28) + 1).padStart(2, '0')}` }));
    const plan = planCareerReminders(apps, NOW, copy);
    expect(plan).toHaveLength(MAX_CAREER_REMINDERS);
    for (let index = 1; index < plan.length; index += 1) expect(plan[index].date.getTime()).toBeGreaterThanOrEqual(plan[index - 1].date.getTime());
  });
});
