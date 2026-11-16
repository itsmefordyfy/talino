import type { SQLiteDatabase } from 'expo-sqlite';

import { clearAppState, readAppState, writeAppState } from '@/db/app-state';
import { runInTransaction } from '@/db/transaction';
import type { AudienceId } from '@/features/courses/data';
import { readProfile, saveProfile, type ProfileInput } from '@/features/resume/api/resume-repo';
import { demoId } from '@/lib/demo';

import { deleteCareerSample, insertCareerSample, SAMPLE_NAME, SAMPLE_PLACE } from './career-sample';
import { deleteLearningSample, insertLearningSample, type LearningSampleLog } from './learning-sample';

/** The Developer switch's whole state: this row exists while the demo data is in. Delete all data clears it with the rest. */
export const DEMO_KEY = 'demo:data';

/** Who the learner was before the sample renamed them (Redux), and what the résumé profile held, so turning it off puts both back. */
export type DemoState = {
  version: 1;
  learning: LearningSampleLog;
  previousName: string;
  previousGoal: AudienceId | null;
  /** The résumé profile as it was; null when there was none. */
  previousProfile: ProfileInput | null;
};

export type DemoApplied = { name: string; goal: AudienceId };
export type DemoRemoved = { name: string; goal: AudienceId | null };

export async function isDemoOn(db: SQLiteDatabase): Promise<boolean> {
  return (await readAppState<DemoState>(db, DEMO_KEY)) !== null;
}

const SAMPLE_PROFILE: ProfileInput = {
  headline: 'Frontend Developer',
  email: 'ford@example.com',
  phone: '+63 912 345 6789',
  location: SAMPLE_PLACE,
  website: 'https://ford.example.com',
  linkedin: 'linkedin.com/in/ford-dev',
  github: 'github.com/ford-dev',
  summary: 'Frontend developer from Naga City who builds fast, accessible React sites and apps, and is learning to work with AI tools every day.',
  career_goal: '',
  level: '',
};

const SAMPLE_PROJECTS = [
  { id: 'project-queue', title: 'Barangay Queue App', summary: 'A mobile app for taking a queue number at the barangay hall.', description: 'Residents pick a service and get a number and an estimate of the wait. Built with React Native and a small Node.js API.', role: 'Solo developer', tech: ['React Native', 'TypeScript', 'Node.js'], url: null, repoUrl: 'https://github.com/ford-dev/barangay-queue' },
  { id: 'project-cafe', title: 'Kape Naga Landing Page', summary: 'A fast landing page for a local café, with its menu and opening hours.', description: 'Designed in Figma and built in React. Loads in under a second on a mobile connection.', role: 'Freelance developer', tech: ['React', 'Figma'], url: 'https://kape-naga.example.com', repoUrl: null },
];

/**
 * One switch for the whole app (Settings → Developer, development builds only): Home's journey and streak, the finished and
 * in-progress courses with badges and a certificate, the Career tab, résumés, the résumé profile and the portfolio, all for "Ford from
 * Naga City". Does nothing when already on. Returns the name and goal to set in the settings (the caller owns Redux).
 */
export async function seedDemoData(db: SQLiteDatabase, now: Date, current: { name: string; goal: AudienceId | null }): Promise<DemoApplied | null> {
  if (await isDemoOn(db)) return null;
  await runInTransaction(db, async () => {
    const stamp = now.toISOString();
    await insertCareerSample(db, now);
    const learning = await insertLearningSample(db, now);
    const profile = await readProfile(db);
    const previousProfile: ProfileInput | null = profile ? { headline: profile.headline ?? '', email: profile.email ?? '', phone: profile.phone ?? '', location: profile.location ?? '', website: profile.website ?? '', linkedin: profile.linkedin ?? '', github: profile.github ?? '', summary: profile.summary ?? '', career_goal: profile.career_goal ?? '', level: profile.level ?? '' } : null;
    await saveProfile(db, SAMPLE_PROFILE);
    const top = ((await db.getFirstAsync<{ top: number | null }>('SELECT MAX(sort) AS top FROM portfolio_projects'))?.top ?? -1) + 1;
    for (const [index, project] of SAMPLE_PROJECTS.entries()) {
      await db.runAsync(
        `INSERT INTO portfolio_projects (id, title, summary, description, role, tech, url, repo_url, images, sort, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, ?, ?)`,
        demoId(project.id),
        project.title,
        project.summary,
        project.description,
        project.role,
        JSON.stringify(project.tech),
        project.url,
        project.repoUrl,
        top + index,
        stamp,
        stamp,
      );
    }
    const state: DemoState = { version: 1, learning, previousName: current.name, previousGoal: current.goal, previousProfile };
    await writeAppState(db, DEMO_KEY, state);
  });
  return { name: SAMPLE_NAME, goal: 'builder' };
}

/** Removes exactly what the switch added and puts the résumé profile back; everything the learner made themselves stays. */
export async function removeDemoData(db: SQLiteDatabase): Promise<DemoRemoved | null> {
  const state = await readAppState<DemoState>(db, DEMO_KEY);
  if (!state) return null;
  await runInTransaction(db, async () => {
    await deleteCareerSample(db);
    await db.runAsync('DELETE FROM portfolio_projects WHERE id LIKE ?', 'demo-%');
    await deleteLearningSample(db, state.learning);
    if (state.previousProfile) await saveProfile(db, state.previousProfile);
    else await db.runAsync("DELETE FROM resume_profile WHERE id = 'me'");
    await db.runAsync('DELETE FROM deleted_rows WHERE row_id LIKE ?', 'demo-%');
    await clearAppState(db, DEMO_KEY);
  });
  return { name: state.previousName, goal: state.previousGoal };
}
