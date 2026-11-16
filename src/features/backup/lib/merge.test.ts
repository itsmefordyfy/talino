import { describe, expect, test } from '@jest/globals';

import { activity, application, at, attempt, badge, certificate, day, emptyTables, goal, income, learnerProfile, lesson, project, resumeItem, resumeProfile, resumeVersion } from '../test-support';
import type { Tombstone } from './format';
import { planRestore, summarizePlan } from './merge';
import type { Row, TableName } from './schema';

type Rows = Partial<Record<TableName, Row[]>>;

function run(local: Rows, remote: Rows, tombs: { local?: Tombstone[]; remote?: Tombstone[] } = {}) {
  return planRestore({ ...emptyTables(), ...local }, tombs.local ?? [], { tables: { ...emptyTables(), ...remote }, tombstones: tombs.remote ?? [] });
}

/** The row that results for a key: the update's row, the insert, or the local row left alone. */
function result(plan: ReturnType<typeof run>, table: TableName, local: Row[], key: string, keyColumn: string): Row | undefined {
  const t = plan.tables[table];
  const updated = t.updates.find((item) => item.key === key);
  if (updated) return updated.row;
  const inserted = t.inserts.find((row) => row[keyColumn] === key);
  if (inserted) return inserted;
  return local.find((row) => row[keyColumn] === key);
}

const tomb = (table: string, id: string, when: string): Tombstone => ({ table_name: table, row_id: id, deleted_at: when });

describe('lessons', () => {
  test('a completed lesson beats an open one, in either direction', () => {
    const open = lesson('l1', { completed_at: null, quiz_correct: 1, quiz_total: 5, updated_at: at(9) });
    const done = lesson('l1', { completed_at: at(6), quiz_correct: 3, quiz_total: 5, updated_at: at(6) });
    expect(result(run({ lesson_progress: [open] }, { lesson_progress: [done] }), 'lesson_progress', [open], 'l1', 'lesson_id')?.completed_at).toBe(at(6));
    const plan = run({ lesson_progress: [done] }, { lesson_progress: [open] });
    expect(plan.tables.lesson_progress.updates).toEqual([]);
    expect(plan.tables.lesson_progress.counts.keptLocal).toBe(1);
  });

  test('the better quiz result stays, task ticks are kept, the earliest completion wins', () => {
    const local = lesson('l1', { quiz_correct: 3, quiz_total: 5, task_done: 1, completed_at: at(8), updated_at: at(8) });
    const remote = lesson('l1', { quiz_correct: 5, quiz_total: 5, task_done: 0, completed_at: at(6), updated_at: at(6) });
    expect(result(run({ lesson_progress: [local] }, { lesson_progress: [remote] }), 'lesson_progress', [local], 'l1', 'lesson_id')).toMatchObject({ quiz_correct: 5, quiz_total: 5, task_done: 1, completed_at: at(6), updated_at: at(8) });
  });

  test('two phones ahead on different lessons end up with both (lesson 5 and lesson 9)', () => {
    const a = [1, 2, 3, 4, 5].map((n) => lesson(`l${n}`));
    const b = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => lesson(`l${n}`, n > 5 ? { completed_at: at(7) } : {}));
    const plan = run({ lesson_progress: a }, { lesson_progress: b });
    expect(plan.tables.lesson_progress.inserts.map((row) => row.lesson_id)).toEqual(['l6', 'l7', 'l8', 'l9']);
    expect(summarizePlan(plan)).toMatchObject({ newRows: 4, unchanged: 5, updatedRows: 0 });
  });
});

describe('projects', () => {
  test('a passed project never moves back; steps are the union', () => {
    const local = project('p1', { status: 'passed', steps_done: '["a","b"]', feedback: 'Passed!', reviewed_at: at(8), updated_at: at(8) });
    const remote = project('p1', { status: 'submitted', steps_done: '["b","c"]', submission: 'https://github.com/x/y', updated_at: at(9) });
    const merged = result(run({ project_progress: [local] }, { project_progress: [remote] }), 'project_progress', [local], 'p1', 'project_id');
    expect(merged).toMatchObject({ status: 'passed', steps_done: '["a","b","c"]', submission: 'https://github.com/x/y', feedback: 'Passed!', reviewed_at: at(8), updated_at: at(9) });
  });

  test('with the same status the newer edit wins the submission and feedback', () => {
    const local = project('p1', { status: 'needs_work', feedback: 'old', updated_at: at(6) });
    const remote = project('p1', { status: 'needs_work', feedback: 'new', submission: 'https://x.dev', updated_at: at(7) });
    expect(result(run({ project_progress: [local] }, { project_progress: [remote] }), 'project_progress', [local], 'p1', 'project_id')).toMatchObject({ feedback: 'new', submission: 'https://x.dev' });
  });
});

describe('days, badges, certificates', () => {
  test('learning days are a union with the larger count; badges keep the earlier date and the seen flag', () => {
    const plan = run(
      { learning_days: [day('2026-11-01', { lessons: 1 })], badges: [badge('b1', { earned_at: at(9), seen: 0 })] },
      { learning_days: [day('2026-11-01', { lessons: 3 }), day('2026-11-02')], badges: [badge('b1', { earned_at: at(6), seen: 1 }), badge('b2')] },
    );
    expect(plan.tables.learning_days.inserts).toHaveLength(1);
    expect(plan.tables.learning_days.updates[0].row.lessons).toBe(3);
    expect(plan.tables.badges.updates[0].row).toMatchObject({ earned_at: at(6), seen: 1 });
    expect(plan.tables.badges.inserts.map((row) => row.badge_id)).toEqual(['b2']);
  });

  test('a certificate is one per course: the verified one wins and this phone keeps its id', () => {
    const local = certificate('local-id', 'dev', { updated_at: at(9) });
    const remote = certificate('remote-id', 'dev', { verify_id: 'V1', verify_url: 'https://talino.example/c/V1', updated_at: at(6) });
    const plan = run({ certificates: [local] }, { certificates: [remote] });
    expect(plan.tables.certificates.inserts).toEqual([]);
    expect(plan.tables.certificates.updates[0]).toMatchObject({ key: 'local-id', row: { id: 'local-id', verify_id: 'V1', course_id: 'dev' } });
    const verifiedHere = certificate('local-id', 'dev', { verify_id: 'V1', verify_url: 'https://a.example/V1', updated_at: at(6) });
    expect(run({ certificates: [verifiedHere] }, { certificates: [certificate('remote-id', 'dev', { updated_at: at(9) })] }).tables.certificates.updates).toEqual([]);
  });
});

describe('activities', () => {
  test('a solved activity beats an open one and its XP stays the same solve’s', () => {
    const local = activity('a1', { solved: 1, xp: 10, solved_at: at(8), attempts: 2 });
    const remote = activity('a1', { solved: 1, xp: 15, solved_at: at(6), attempts: 3, wrong: 1 });
    const merged = result(run({ activity_progress: [local] }, { activity_progress: [remote] }), 'activity_progress', [local], 'a1', 'activity_id');
    // The earlier solve (and its XP) stays; tries and wrong answers keep the larger count.
    expect(merged).toMatchObject({ solved: 1, xp: 15, solved_at: at(6), attempts: 3, wrong: 1 });
    const open = activity('a1', { attempts: 5, hints_used: 2 });
    const solved = activity('a1', { solved: 1, xp: 10, solved_at: at(7), attempts: 1 });
    expect(result(run({ activity_progress: [open] }, { activity_progress: [solved] }), 'activity_progress', [open], 'a1', 'activity_id')).toMatchObject({ solved: 1, xp: 10, attempts: 5, hints_used: 2 });
  });

  test('restoring a solve this phone already has never raises XP', () => {
    const solved = activity('a1', { solved: 1, xp: 10, solved_at: at(6) });
    const plan = run({ activity_progress: [solved] }, { activity_progress: [{ ...solved, xp: 40, solved_at: at(7) }] });
    expect(plan.tables.activity_progress.updates).toEqual([]);
  });

  test('challenge attempts are a union by id', () => {
    const plan = run({ challenge_attempts: [attempt('c1')] }, { challenge_attempts: [attempt('c1', { correct: 0 }), attempt('c2')] });
    expect(plan.tables.challenge_attempts.inserts.map((row) => row.id)).toEqual(['c2']);
    expect(plan.tables.challenge_attempts.updates).toEqual([]);
  });
});

describe('the learner’s own records', () => {
  test('the newer edit wins, a tie keeps this phone', () => {
    const local = application('a1', { title: 'Mine', updated_at: at(7) });
    expect(result(run({ applications: [local] }, { applications: [application('a1', { title: 'Theirs', updated_at: at(8) })] }), 'applications', [local], 'a1', 'id')?.title).toBe('Theirs');
    expect(run({ applications: [local] }, { applications: [application('a1', { title: 'Theirs', updated_at: at(6) })] }).tables.applications.updates).toEqual([]);
    expect(run({ applications: [local] }, { applications: [application('a1', { title: 'Theirs', updated_at: at(7) })] }).tables.applications.updates).toEqual([]);
  });

  test('singleton profiles are by id; a finished welcome beats a half-done one', () => {
    const started = learnerProfile({ status: 'in_progress', step: 1, updated_at: at(9) });
    const finished = learnerProfile({ status: 'completed', completed_at: at(6), step: 7, updated_at: at(6) });
    expect(result(run({ learner_profile: [started] }, { learner_profile: [finished] }), 'learner_profile', [started], 'me', 'id')).toMatchObject({ status: 'completed', step: 7 });
    expect(run({ learner_profile: [finished] }, { learner_profile: [started] }).tables.learner_profile.updates).toEqual([]);
    expect(result(run({ resume_profile: [resumeProfile({ headline: 'old', updated_at: at(5) })] }, { resume_profile: [resumeProfile({ headline: 'new', updated_at: at(6) })] }), 'resume_profile', [], 'me', 'id')?.headline).toBe('new');
  });

  test('income whose application will not exist is kept, unlinked', () => {
    const plan = run({}, { income: [income('i1', { application_id: 'gone' }), income('i2', { application_id: 'a1' })], applications: [application('a1')] });
    expect(plan.tables.income.inserts.find((row) => row.id === 'i1')?.application_id).toBeNull();
    expect(plan.tables.income.inserts.find((row) => row.id === 'i2')?.application_id).toBe('a1');
  });
});

describe('tombstones', () => {
  test('a deleted application is not brought back by an old backup', () => {
    const plan = run({}, { applications: [application('a1', { updated_at: at(6) })] }, { local: [tomb('applications', 'a1', at(8))] });
    expect(plan.tables.applications.inserts).toEqual([]);
    expect(plan.tables.applications.counts.keptLocal).toBe(1);
  });

  test('a row edited after its deletion is kept and the tombstone dropped', () => {
    const plan = run({ applications: [application('a1', { updated_at: at(10) })] }, { applications: [application('a1', { updated_at: at(6) })] }, { local: [tomb('applications', 'a1', at(8))] });
    expect(plan.tombstoneDrops).toEqual([{ table_name: 'applications', row_id: 'a1' }]);
    // And the other way: the backup holds the row edited after this phone deleted it.
    const revived = run({}, { applications: [application('a1', { updated_at: at(10) })] }, { local: [tomb('applications', 'a1', at(8))] });
    expect(revived.tables.applications.inserts).toHaveLength(1);
    expect(revived.tombstoneDrops).toEqual([{ table_name: 'applications', row_id: 'a1' }]);
  });

  test('the backup’s tombstone removes a local row that was not edited since', () => {
    const plan = run({ career_goals: [goal('g1', { updated_at: at(6) }), goal('g2', { updated_at: at(9) })] }, {}, { remote: [tomb('career_goals', 'g1', at(7)), tomb('career_goals', 'g2', at(7))] });
    expect(plan.tables.career_goals.deletes).toEqual(['g1']);
    expect(plan.tombstoneWrites).toEqual([tomb('career_goals', 'g1', at(7))]);
    expect(plan.tombstoneDrops).toEqual([]);
  });

  test('a phone’s own tombstone never deletes a local row; it only blocks the backup', () => {
    const plan = run({ resume_items: [resumeItem('r1', { updated_at: at(6) })] }, {}, { local: [tomb('resume_items', 'r1', at(9))] });
    expect(plan.tables.resume_items.deletes).toEqual([]);
  });

  test('the later of two tombstones is kept, and résumé versions are keyed by goal', () => {
    const plan = run({}, { resume_versions: [resumeVersion('dev', { updated_at: at(5) })] }, { local: [tomb('resume_versions', 'dev', at(6))], remote: [tomb('resume_versions', 'dev', at(8)), tomb('resume_versions', 'other', at(5))] });
    expect(plan.tables.resume_versions.inserts).toEqual([]);
    expect(plan.tombstoneWrites).toEqual(expect.arrayContaining([tomb('resume_versions', 'dev', at(8)), tomb('resume_versions', 'other', at(5))]));
  });
});
