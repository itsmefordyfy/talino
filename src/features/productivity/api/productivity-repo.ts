import type { SQLiteDatabase } from 'expo-sqlite';

import { readAppState, writeAppState } from '@/db/app-state';
import { nowTimestamp } from '@/lib/id';

import { normalizeSettings, reviveTimer, type FocusSession, type PomodoroSettings, type TimerState } from '../lib/pomodoro';
import { parseDayState, parseMatrixState, type DayToolState, type MatrixToolState } from '../lib/state';

/**
 * What the productivity tools keep on this phone. Tool state is small JSON in `app_state` under `productivity:` keys (read back defensively);
 * finished focus rounds are rows of `focus_sessions`, made with an id on the phone so a double tap or a retry saves once. Nothing here is synced or backed up.
 */

export const TOOL_KEYS = {
  matrix: 'productivity:matrix',
  day: 'productivity:day',
  timer: 'productivity:timer',
  timerSettings: 'productivity:timer-settings',
  promptDraft: (templateId: string) => `productivity:prompt:${templateId}`,
} as const;

/** The longest prompt draft kept, so one tool can never fill the database. */
export const MAX_PROMPT_DRAFT = 6000;

export const readMatrixState = async (db: SQLiteDatabase): Promise<MatrixToolState> => parseMatrixState(await readAppState<unknown>(db, TOOL_KEYS.matrix));
export const writeMatrixState = (db: SQLiteDatabase, state: MatrixToolState) => writeAppState(db, TOOL_KEYS.matrix, state);

export const readDayState = async (db: SQLiteDatabase): Promise<DayToolState> => parseDayState(await readAppState<unknown>(db, TOOL_KEYS.day));
export const writeDayState = (db: SQLiteDatabase, state: DayToolState) => writeAppState(db, TOOL_KEYS.day, state);

export const readTimerSettings = async (db: SQLiteDatabase): Promise<PomodoroSettings> => normalizeSettings(await readAppState<Partial<PomodoroSettings>>(db, TOOL_KEYS.timerSettings));
export const writeTimerSettings = (db: SQLiteDatabase, settings: PomodoroSettings) => writeAppState(db, TOOL_KEYS.timerSettings, normalizeSettings(settings));

export async function readTimer(db: SQLiteDatabase, settings: PomodoroSettings): Promise<TimerState> {
  return reviveTimer(await readAppState<unknown>(db, TOOL_KEYS.timer), settings);
}
export const writeTimer = (db: SQLiteDatabase, timer: TimerState) => writeAppState(db, TOOL_KEYS.timer, timer);

export async function readPromptDraft(db: SQLiteDatabase, templateId: string): Promise<string | null> {
  const saved = await readAppState<unknown>(db, TOOL_KEYS.promptDraft(templateId));
  return typeof saved === 'string' ? saved.slice(0, MAX_PROMPT_DRAFT) : null;
}
export const writePromptDraft = (db: SQLiteDatabase, templateId: string, text: string) => writeAppState(db, TOOL_KEYS.promptDraft(templateId), text.slice(0, MAX_PROMPT_DRAFT));

export type FocusRow = { id: string; started_at: string; ended_at: string; minutes: number; task: string | null; created_at: string };
export type FocusLogEntry = FocusSession & { id: string; task: string | null };

/** Saves a finished focus round once, however many times it is reported. */
export async function recordFocusSession(db: SQLiteDatabase, input: { id: string; startedAt: number; endedAt: number; minutes: number; task?: string | null }): Promise<boolean> {
  const task = input.task?.trim().slice(0, 120) || null;
  const result = await db.runAsync(
    'INSERT OR IGNORE INTO focus_sessions (id, started_at, ended_at, minutes, task, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    input.id,
    new Date(input.startedAt).toISOString(),
    new Date(input.endedAt).toISOString(),
    Math.max(1, Math.round(input.minutes)),
    task,
    nowTimestamp(),
  );
  return result.changes > 0;
}

const toEntry = (row: FocusRow): FocusLogEntry => ({ id: row.id, startedAt: Date.parse(row.started_at), endedAt: Date.parse(row.ended_at), minutes: row.minutes, task: row.task });

/** The newest finished rounds first. */
export async function listFocusSessions(db: SQLiteDatabase, limit = 200): Promise<FocusLogEntry[]> {
  const rows = await db.getAllAsync<FocusRow>('SELECT * FROM focus_sessions ORDER BY ended_at DESC LIMIT ?', limit);
  return rows.map(toEntry).filter((entry) => Number.isFinite(entry.startedAt) && Number.isFinite(entry.endedAt));
}
