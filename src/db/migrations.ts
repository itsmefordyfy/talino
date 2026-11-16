import type { SQLiteDatabase } from 'expo-sqlite';

/** A step is SQL, or code when it has to look at the database first. */
type Migration = string | ((db: SQLiteDatabase) => Promise<void>);

/**
 * The learner's data, all of it on the phone. Append-only: a shipped migration is never edited, a
 * change is a new entry. Dates are local `YYYY-MM-DD` strings (lib/dates), timestamps ISO strings,
 * money integer minor units with its currency. Course content is not here: it is bundled data
 * (`features/courses/content`), and rows point at it by id.
 * Spec: docs/superpowers/specs/2026-11-13-talino-1.0-design.md.
 */
const MIGRATIONS: readonly Migration[] = [
  // v1 — learning, projects, badges, certificates, the career tracker, the résumé, Tali's chats
  `
  CREATE TABLE lesson_progress (
    lesson_id TEXT PRIMARY KEY NOT NULL,
    course_id TEXT NOT NULL,
    completed_at TEXT,
    quiz_correct INTEGER,
    quiz_total INTEGER,
    task_done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX idx_lesson_progress_course ON lesson_progress(course_id);

  CREATE TABLE project_progress (
    project_id TEXT PRIMARY KEY NOT NULL,
    course_id TEXT NOT NULL,
    steps_done TEXT NOT NULL DEFAULT '[]',
    submission TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    feedback TEXT,
    review_token TEXT,
    reviewed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX idx_project_progress_course ON project_progress(course_id);

  CREATE TABLE learning_days (
    day TEXT PRIMARY KEY NOT NULL,
    lessons INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE badges (
    badge_id TEXT PRIMARY KEY NOT NULL,
    earned_at TEXT NOT NULL,
    seen INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE certificates (
    id TEXT PRIMARY KEY NOT NULL,
    course_id TEXT NOT NULL UNIQUE,
    learner_name TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    verify_id TEXT,
    verify_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE applications (
    id TEXT PRIMARY KEY NOT NULL,
    kind TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    link TEXT,
    source TEXT,
    stage TEXT NOT NULL,
    applied_on TEXT,
    follow_up_on TEXT,
    interview_at TEXT,
    pay TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX idx_applications_stage ON applications(stage, updated_at);

  CREATE TABLE income (
    id TEXT PRIMARY KEY NOT NULL,
    client TEXT NOT NULL,
    application_id TEXT REFERENCES applications(id) ON DELETE SET NULL,
    amount_minor INTEGER NOT NULL,
    currency TEXT NOT NULL,
    received_on TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX idx_income_received ON income(received_on);

  CREATE TABLE career_goals (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    metric TEXT NOT NULL,
    target REAL NOT NULL,
    currency TEXT,
    due_on TEXT,
    done_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE resume_profile (
    id TEXT PRIMARY KEY NOT NULL,
    headline TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    website TEXT,
    linkedin TEXT,
    github TEXT,
    summary TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE resume_items (
    id TEXT PRIMARY KEY NOT NULL,
    kind TEXT NOT NULL,
    title TEXT NOT NULL,
    organization TEXT,
    start_on TEXT,
    end_on TEXT,
    description TEXT,
    sort INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX idx_resume_items_kind ON resume_items(kind, sort);

  CREATE TABLE resume_versions (
    goal TEXT PRIMARY KEY NOT NULL,
    job_title TEXT,
    summary TEXT,
    highlights TEXT NOT NULL DEFAULT '[]',
    keywords TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE coach_chats (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    mode TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE coach_messages (
    id TEXT PRIMARY KEY NOT NULL,
    chat_id TEXT NOT NULL REFERENCES coach_chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX idx_coach_messages_chat ON coach_messages(chat_id, created_at);

  CREATE TABLE app_state (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  `,

  // v2 — the personalized onboarding's learner profile: one row (id 'me', so there can never be two),
  // answers kept as small JSON lists, nothing that identifies a person. `step` and `status` let a closed app resume.
  `
  CREATE TABLE learner_profile (
    id TEXT PRIMARY KEY NOT NULL,
    experience TEXT,
    goals TEXT NOT NULL DEFAULT '[]',
    interests TEXT NOT NULL DEFAULT '[]',
    styles TEXT NOT NULL DEFAULT '[]',
    daily_minutes INTEGER,
    days TEXT NOT NULL DEFAULT '[]',
    time_of_day TEXT,
    weekly_goal INTEGER,
    assessment TEXT,
    plan TEXT,
    step INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'in_progress',
    started_at TEXT NOT NULL,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  `,

  // v3 — the game layer: one row per interactive activity (what the learner solved, how many tries and hints it took, the XP it earned)
  // and a log of every attempt, which adaptive difficulty reads. XP and levels are never stored as a counter: they are worked out from
  // these rows, the lesson and project rows and the badges, so there is no number to edit and nothing to award twice.
  `
  CREATE TABLE activity_progress (
    activity_id TEXT PRIMARY KEY NOT NULL,
    lesson_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    solved INTEGER NOT NULL DEFAULT 0,
    attempts INTEGER NOT NULL DEFAULT 0,
    wrong INTEGER NOT NULL DEFAULT 0,
    hints_used INTEGER NOT NULL DEFAULT 0,
    xp INTEGER NOT NULL DEFAULT 0,
    solved_at TEXT,
    last_attempt_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX idx_activity_progress_lesson ON activity_progress(lesson_id);
  CREATE INDEX idx_activity_progress_course ON activity_progress(course_id);

  CREATE TABLE challenge_attempts (
    id TEXT PRIMARY KEY NOT NULL,
    activity_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    correct INTEGER NOT NULL,
    hints_used INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER,
    created_at TEXT NOT NULL
  );
  CREATE INDEX idx_challenge_attempts_activity ON challenge_attempts(activity_id, created_at);
  CREATE INDEX idx_challenge_attempts_course ON challenge_attempts(course_id, created_at);
  `,

  // v4 — what the learner deleted, so a restored backup can never bring it back: every delete of a row the learner can remove
  // (a tracked application, income, a goal, a résumé item or version, a certificate) leaves a tombstone (the table, the row's id,
  // when it was deleted; a résumé version's id is its goal). Backups carry the tombstones; features/backup applies them. The
  // timestamp has the same shape as `nowTimestamp()` (ISO, UTC, milliseconds) so the two compare as plain text.
  `
  CREATE TABLE deleted_rows (
    table_name TEXT NOT NULL,
    row_id TEXT NOT NULL,
    deleted_at TEXT NOT NULL,
    PRIMARY KEY (table_name, row_id)
  );
  CREATE TRIGGER trg_applications_deleted AFTER DELETE ON applications BEGIN
    INSERT OR REPLACE INTO deleted_rows (table_name, row_id, deleted_at) VALUES ('applications', OLD.id, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
  END;
  CREATE TRIGGER trg_income_deleted AFTER DELETE ON income BEGIN
    INSERT OR REPLACE INTO deleted_rows (table_name, row_id, deleted_at) VALUES ('income', OLD.id, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
  END;
  CREATE TRIGGER trg_career_goals_deleted AFTER DELETE ON career_goals BEGIN
    INSERT OR REPLACE INTO deleted_rows (table_name, row_id, deleted_at) VALUES ('career_goals', OLD.id, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
  END;
  CREATE TRIGGER trg_resume_items_deleted AFTER DELETE ON resume_items BEGIN
    INSERT OR REPLACE INTO deleted_rows (table_name, row_id, deleted_at) VALUES ('resume_items', OLD.id, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
  END;
  CREATE TRIGGER trg_resume_versions_deleted AFTER DELETE ON resume_versions BEGIN
    INSERT OR REPLACE INTO deleted_rows (table_name, row_id, deleted_at) VALUES ('resume_versions', OLD.goal, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
  END;
  CREATE TRIGGER trg_certificates_deleted AFTER DELETE ON certificates BEGIN
    INSERT OR REPLACE INTO deleted_rows (table_name, row_id, deleted_at) VALUES ('certificates', OLD.id, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
  END;
  `,

  // v5 — the AI résumé builder: many résumés (each a snapshot of content + style, never rewritten by tailoring), a goal and a
  // situation on the master profile, and a place, a link and "dates as written" on the master entries (an imported "2019 – 2021"
  // must not become a month the résumé never said). Written to be re-runnable: it checks before it adds a column.
  async (db) => {
    const columns = async (table: string) => (await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`)).map((column) => column.name);
    const profile = await columns('resume_profile');
    for (const name of ['career_goal', 'level']) if (!profile.includes(name)) await db.execAsync(`ALTER TABLE resume_profile ADD COLUMN ${name} TEXT`);
    const items = await columns('resume_items');
    for (const name of ['location', 'link', 'dates_text']) if (!items.includes(name)) await db.execAsync(`ALTER TABLE resume_items ADD COLUMN ${name} TEXT`);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS resume_documents (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        template TEXT NOT NULL,
        style TEXT NOT NULL DEFAULT '{}',
        content TEXT NOT NULL DEFAULT '{}',
        target TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_resume_documents_updated ON resume_documents(updated_at);
      CREATE TRIGGER IF NOT EXISTS trg_resume_documents_deleted AFTER DELETE ON resume_documents BEGIN
        INSERT OR REPLACE INTO deleted_rows (table_name, row_id, deleted_at) VALUES ('resume_documents', OLD.id, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
      END;
    `);
  },
  // The portfolio's own projects: what the learner built, with details and screenshots (small JPEGs kept as base64 text, so a backup carries them).
  `
    CREATE TABLE IF NOT EXISTS portfolio_projects (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT '',
      tech TEXT NOT NULL DEFAULT '[]',
      url TEXT,
      repo_url TEXT,
      images TEXT NOT NULL DEFAULT '[]',
      sort INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_portfolio_projects_sort ON portfolio_projects(sort, created_at);
    CREATE TRIGGER IF NOT EXISTS trg_portfolio_projects_deleted AFTER DELETE ON portfolio_projects BEGIN
      INSERT OR REPLACE INTO deleted_rows (table_name, row_id, deleted_at) VALUES ('portfolio_projects', OLD.id, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
    END;
  `,
  // The learner's profile picture: one small square JPEG kept as base64 text on the profile row, so a backup carries it (as the portfolio's screenshots do).
  async (db) => {
    const profile = (await db.getAllAsync<{ name: string }>('PRAGMA table_info(resume_profile)')).map((column) => column.name);
    if (!profile.includes('photo')) await db.execAsync('ALTER TABLE resume_profile ADD COLUMN photo TEXT');
  },
  // Mock interviews, on this phone only (private conversations, like Tali's chats: not in the backup, not sent anywhere but to the
  // interviewer's route one turn at a time). An interview keeps its setup as JSON and the interviewer's running notes; the progress
  // is worked out from the messages' `kind`, never stored, so it can't disagree with the conversation. The evaluation is one row.
  `
    CREATE TABLE IF NOT EXISTS interviews (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      setup TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      ended_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_interviews_updated ON interviews(updated_at);
    CREATE TABLE IF NOT EXISTS interview_messages (
      id TEXT PRIMARY KEY NOT NULL,
      interview_id TEXT NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      text TEXT NOT NULL,
      kind TEXT,
      topic TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_interview_messages_interview ON interview_messages(interview_id, created_at);
    CREATE TABLE IF NOT EXISTS interview_reports (
      interview_id TEXT PRIMARY KEY NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      report TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `,
];

export const DATABASE_NAME = 'talino.db';
export const SCHEMA_VERSION = MIGRATIONS.length;

export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  while (version < MIGRATIONS.length) {
    const step = MIGRATIONS[version];
    await db.withTransactionAsync(async () => {
      if (typeof step === 'string') await db.execAsync(step);
      else await step(db);
    });
    version += 1;
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }
}
