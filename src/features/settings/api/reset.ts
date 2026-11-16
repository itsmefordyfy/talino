import type { SQLiteDatabase } from 'expo-sqlite';

import { clearAllListenPositions } from '@/features/courses/audio/listen-position';

/**
 * Every table holding the learner's data; the schema stays. `deleted_rows` goes last: the deletes above fire the triggers that
 * note a tombstone, and Delete all data starts from nothing, so those are cleared too.
 */
export const RESET_TABLES = ['interview_reports', 'interview_messages', 'interviews', 'coach_messages', 'coach_chats', 'income', 'applications', 'career_goals', 'resume_items', 'resume_versions', 'resume_profile', 'resume_documents', 'portfolio_projects', 'certificates', 'badges', 'learning_days', 'project_progress', 'lesson_progress', 'app_state', 'learner_profile', 'activity_progress', 'challenge_attempts', 'deleted_rows'];

export async function deleteAllData(db: SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    for (const table of RESET_TABLES) await db.runAsync(`DELETE FROM ${table}`);
  });
  // Where the learner stopped in each lesson's audio is data of theirs too.
  clearAllListenPositions();
}
