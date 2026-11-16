import type { SQLiteDatabase } from 'expo-sqlite';

import { emptyContent, type DocEntry, type ResumeContent } from '@/features/resume/lib/document';
import { defaultStyle, type TemplateId } from '@/features/resume/lib/templates';
import { addDays, parseISODate, toISODate } from '@/lib/dates';
import { demoId, DEMO_ID_PREFIX } from '@/lib/demo';

import type { ApplicationKind, GoalMetric, Source, Stage } from '@/features/career/types';

const PLACE = 'Naga City, Philippines';

type DemoApplication = {
  kind: ApplicationKind;
  title: string;
  company: string;
  source: Source;
  stage: Stage;
  /** Days before today; null when it was only saved. */
  applied: number | null;
  /** Days from today (negative: overdue). */
  followUp?: number;
  /** [days from today, hour]. */
  interview?: [number, number];
  pay?: string;
  notes?: string;
  /** Days before today it last changed (Career's goals date a stage reached by this). */
  changed: number;
};

const APPLICATIONS: DemoApplication[] = [
  { kind: 'job', title: 'Junior Frontend Developer', company: 'Brightwave Digital', source: 'kalibrr', stage: 'saved', applied: null, pay: '₱35,000–45,000 / month', changed: 2 },
  { kind: 'job', title: 'React Developer', company: 'Pili Software Labs', source: 'jobstreet', stage: 'saved', applied: null, changed: 1 },
  { kind: 'job', title: 'Web Developer', company: 'Bicol Tech Hub', source: 'referral', stage: 'applied', applied: 9, followUp: -3, notes: 'Referred by a former classmate.', changed: 9 },
  { kind: 'job', title: 'QA Analyst (Remote)', company: 'Northpoint Systems', source: 'linkedin', stage: 'applied', applied: 6, followUp: 0, changed: 6 },
  { kind: 'freelance', title: 'Landing page for a café', company: 'Kape Naga', source: 'onlinejobs', stage: 'applied', applied: 4, followUp: 3, pay: '₱8,000 fixed', changed: 4 },
  { kind: 'job', title: 'Frontend Developer', company: 'Lumina Apps', source: 'linkedin', stage: 'interview', applied: 20, interview: [2, 10], notes: 'Technical interview: React and a small take-home.', changed: 12 },
  { kind: 'freelance', title: 'Shopify store setup', company: 'Maya Boutique', source: 'upwork', stage: 'interview', applied: 14, interview: [-3, 14], pay: '$300 fixed', changed: 3 },
  { kind: 'job', title: 'Junior Developer', company: 'Camarines Soft', source: 'company-site', stage: 'offer', applied: 31, followUp: 1, pay: '₱42,000 / month', notes: 'Offer received. Reply by end of week.', changed: 5 },
  { kind: 'freelance', title: 'Website for a clinic', company: 'Dr. Reyes Dental', source: 'referral', stage: 'won', applied: 52, pay: '₱25,000 fixed', changed: 38 },
  { kind: 'freelance', title: 'Social media scheduler (VA)', company: 'Orbit Marketing AU', source: 'onlinejobs', stage: 'won', applied: 40, pay: '$500 / month', changed: 25 },
  { kind: 'job', title: 'Backend Developer', company: 'Harbor Pay', source: 'kalibrr', stage: 'closed', applied: 28, notes: 'Went with another candidate.', changed: 15 },
  { kind: 'job', title: 'Support Engineer', company: 'Cloudline', source: 'jobstreet', stage: 'closed', applied: 35, notes: 'No reply after two follow-ups.', changed: 30 },
];

/** Client, days ago, amount in major units, currency, index of the won application it came from. */
const INCOME: [string, number, number, 'PHP' | 'USD', number | null][] = [
  ['Kape Naga', 150, 5500, 'PHP', null],
  ['Maya Boutique', 120, 8000, 'PHP', null],
  ['Naga Printing', 95, 12000, 'PHP', null],
  ['Bicol Bakers', 70, 6500, 'PHP', null],
  ['Studio Pili', 50, 9000, 'PHP', null],
  ['Dr. Reyes Dental', 36, 15000, 'PHP', 8],
  ['Dr. Reyes Dental', 30, 10000, 'PHP', 8],
  ['Orbit Marketing AU', 22, 250, 'USD', 9],
  ['Orbit Marketing AU', 8, 250, 'USD', 9],
  ['Kape Naga', 12, 4000, 'PHP', null],
];

/** Created 45 days ago, because a goal only counts what happened since it was set. */
const GOALS: { title: string; metric: GoalMetric; target: number; currency: string | null; dueIn: number }[] = [
  { title: 'Earn ₱40,000 from freelance work', metric: 'income', target: 40000, currency: 'PHP', dueIn: 30 },
  { title: 'Send 20 applications', metric: 'applications', target: 20, currency: null, dueIn: 45 },
  { title: 'Get 5 interviews', metric: 'interviews', target: 5, currency: null, dueIn: 20 },
];

const entry = (id: string, fields: Partial<DocEntry>): DocEntry => ({ id: demoId(id), title: '', organization: '', location: '', start: '', end: '', current: false, link: '', bullets: [], ...fields });

function resumeContent(headline: string, summary: string): ResumeContent {
  return {
    ...emptyContent(),
    name: 'Ford',
    headline,
    email: 'ford@example.com',
    phone: '+63 912 345 6789',
    location: PLACE,
    website: 'https://ford.example.com',
    github: 'github.com/ford-dev',
    summary,
    skills: ['React', 'TypeScript', 'React Native', 'Node.js', 'Figma', 'Client communication'],
    experience: [
      entry('exp-1', { title: 'Junior Web Developer', organization: 'Pili Digital Studio', location: PLACE, start: 'Jun 2024', current: true, bullets: ['Built and shipped five client websites in React.', 'Cut page load time by 40% on the studio’s busiest site.'] }),
      entry('exp-2', { title: 'Freelance Web Developer', organization: 'Self-employed', location: PLACE, start: 'Jan 2024', current: true, bullets: ['Delivered a clinic website and a café landing page for local clients.', 'Managed scope, invoices and revisions directly with clients.'] }),
    ],
    projects: [entry('proj-1', { title: 'Barangay Queue App', organization: 'Personal project', start: '2025', end: '2025', bullets: ['A mobile app that lets residents take a queue number for the barangay hall.'] })],
    education: [entry('edu-1', { title: 'BS Information Technology', organization: 'Bicol Institute of Technology', location: PLACE, start: '2019', end: '2023' })],
    certifications: [entry('cert-1', { title: 'AI Basics for Tech', organization: 'Talino', end: '2026' })],
    achievements: ['Won two freelance clients in his first year'],
  };
}

const RESUMES: { id: string; name: string; template: TemplateId; content: ResumeContent }[] = [
  { id: demoId('resume-developer'), name: 'Ford: Frontend Developer', template: 'developer', content: resumeContent('Frontend Developer', 'Frontend developer from Naga City who builds fast, accessible React sites and apps, and is learning to work with AI tools every day.') },
  { id: demoId('resume-freelance'), name: 'Ford: Freelance Web Developer', template: 'freelancer', content: resumeContent('Freelance Web Developer', 'Freelance web developer in Naga City helping small businesses get online: landing pages, online stores and simple booking sites.') },
];

const RESUME_ITEMS: { id: string; kind: string; title: string; organization: string | null; start: string | null; end: string | null; description: string | null; location: string | null }[] = [
  { id: 'item-exp-1', kind: 'experience', title: 'Junior Web Developer', organization: 'Pili Digital Studio', start: '2024-06-01', end: null, description: 'Built and shipped five client websites in React.', location: PLACE },
  { id: 'item-exp-2', kind: 'experience', title: 'Freelance Web Developer', organization: 'Self-employed', start: '2024-01-01', end: null, description: 'Landing pages and online stores for local businesses.', location: PLACE },
  { id: 'item-edu-1', kind: 'education', title: 'BS Information Technology', organization: 'Bicol Institute of Technology', start: '2019-06-01', end: '2023-04-01', description: null, location: PLACE },
  { id: 'item-skill-1', kind: 'skill', title: 'React and TypeScript', organization: null, start: null, end: null, description: null, location: null },
  { id: 'item-skill-2', kind: 'skill', title: 'Figma and UI design', organization: null, start: null, end: null, description: null, location: null },
  { id: 'item-proj-1', kind: 'project', title: 'Barangay Queue App', organization: 'Personal project', start: '2025-03-01', end: '2025-05-01', description: 'A mobile app for taking a queue number at the barangay hall.', location: null },
];

export const SAMPLE_NAME = 'Ford';
export const SAMPLE_PLACE = PLACE;

/**
 * Fills Career with Ford's job hunt and freelance income (applications, income, goals) and two résumés with their entries, all
 * with `demo-` ids and dates counted back from `now`. The caller wraps it in a transaction and keeps the switch's state.
 */
export async function insertCareerSample(db: SQLiteDatabase, now: Date): Promise<void> {
  const today = toISODate(now);
  const date = (daysAgo: number) => addDays(today, -daysAgo);
  const stamp = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86_400_000).toISOString();
  const at = (daysFromToday: number, hour: number) => {
    const day = parseISODate(addDays(today, daysFromToday));
    day.setHours(hour, 0, 0, 0);
    return day.toISOString();
  };

  for (const [index, app] of APPLICATIONS.entries()) {
    await db.runAsync(
      `INSERT INTO applications (id, kind, title, company, link, source, stage, applied_on, follow_up_on, interview_at, pay, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      demoId(`app-${index}`),
      app.kind,
      app.title,
      app.company,
      app.source,
      app.stage,
      app.applied === null ? null : date(app.applied),
      app.followUp === undefined ? null : addDays(today, app.followUp),
      app.interview ? at(app.interview[0], app.interview[1]) : null,
      app.pay ?? null,
      app.notes ?? null,
      stamp(app.applied ?? app.changed),
      stamp(app.changed),
    );
  }
  for (const [index, [client, daysAgo, amount, currency, from]] of INCOME.entries()) {
    await db.runAsync(
      'INSERT INTO income (id, client, application_id, amount_minor, currency, received_on, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)',
      demoId(`income-${index}`),
      client,
      from === null ? null : demoId(`app-${from}`),
      Math.round(amount * 100),
      currency,
      date(daysAgo),
      stamp(daysAgo),
      stamp(daysAgo),
    );
  }
  for (const [index, goal] of GOALS.entries()) {
    await db.runAsync(
      'INSERT INTO career_goals (id, title, metric, target, currency, due_on, done_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)',
      demoId(`goal-${index}`),
      goal.title,
      goal.metric,
      goal.target,
      goal.currency,
      addDays(today, goal.dueIn),
      stamp(45),
      stamp(45),
    );
  }
  for (const resume of RESUMES) {
    await db.runAsync(
      'INSERT INTO resume_documents (id, name, template, style, content, target, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NULL, ?, ?)',
      resume.id,
      resume.name,
      resume.template,
      JSON.stringify(defaultStyle(resume.template)),
      JSON.stringify(resume.content),
      stamp(20),
      stamp(resume.template === 'developer' ? 2 : 5),
    );
  }
  for (const [index, item] of RESUME_ITEMS.entries()) {
    await db.runAsync(
      `INSERT INTO resume_items (id, kind, title, organization, start_on, end_on, description, sort, location, link, dates_text, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?)`,
      demoId(item.id),
      item.kind,
      item.title,
      item.organization,
      item.start,
      item.end,
      item.description,
      index,
      item.location,
      stamp(20),
      stamp(20),
    );
  }
}

/** Removes exactly the career sample rows (and the delete markers their removal leaves); everything of the learner's own stays. */
export async function deleteCareerSample(db: SQLiteDatabase): Promise<void> {
  const like = `${DEMO_ID_PREFIX}%`;
  for (const table of ['income', 'applications', 'career_goals', 'resume_items', 'resume_documents']) await db.runAsync(`DELETE FROM ${table} WHERE id LIKE ?`, like);
  await db.runAsync('DELETE FROM deleted_rows WHERE row_id LIKE ?', like);
}
