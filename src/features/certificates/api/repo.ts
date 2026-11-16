import type { SQLiteDatabase } from 'expo-sqlite';

import { newId, nowTimestamp } from '@/lib/id';

export type CertificateRow = { id: string; course_id: string; learner_name: string; issued_at: string; verify_id: string | null; verify_url: string | null };

export async function readCertificates(db: SQLiteDatabase): Promise<CertificateRow[]> {
  return db.getAllAsync<CertificateRow>('SELECT id, course_id, learner_name, issued_at, verify_id, verify_url FROM certificates ORDER BY issued_at');
}

/** The certificate is earned on the phone the first time its course is complete (idempotent). */
export async function ensureCertificate(db: SQLiteDatabase, courseId: string, learnerName: string): Promise<void> {
  const now = nowTimestamp();
  await db.runAsync('INSERT OR IGNORE INTO certificates (id, course_id, learner_name, issued_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', newId(), courseId, learnerName, now, now, now);
}

export async function saveVerification(db: SQLiteDatabase, courseId: string, verifyId: string, verifyUrl: string | null, learnerName: string): Promise<void> {
  await db.runAsync('UPDATE certificates SET verify_id = ?, verify_url = ?, learner_name = ?, updated_at = ? WHERE course_id = ?', verifyId, verifyUrl, learnerName, nowTimestamp(), courseId);
}
