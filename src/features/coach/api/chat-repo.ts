import type { SQLiteDatabase } from 'expo-sqlite';

import { newId, nowTimestamp } from '@/lib/id';

export type ChatRow = { id: string; title: string; mode: string; created_at: string; updated_at: string };
export type MessageRow = { id: string; chat_id: string; role: 'user' | 'assistant'; text: string; created_at: string };

export async function listChats(db: SQLiteDatabase): Promise<ChatRow[]> {
  return db.getAllAsync<ChatRow>('SELECT id, title, mode, created_at, updated_at FROM coach_chats ORDER BY updated_at DESC LIMIT 200');
}

export async function readChat(db: SQLiteDatabase, chatId: string): Promise<{ chat: ChatRow | null; messages: MessageRow[] }> {
  const chat = await db.getFirstAsync<ChatRow>('SELECT id, title, mode, created_at, updated_at FROM coach_chats WHERE id = ?', chatId);
  const messages = chat ? await db.getAllAsync<MessageRow>('SELECT id, chat_id, role, text, created_at FROM coach_messages WHERE chat_id = ? ORDER BY created_at, rowid', chatId) : [];
  return { chat, messages };
}

/** Saves one message, creating the chat (titled by its first question) the first time. */
export async function addMessage(db: SQLiteDatabase, input: { chatId: string; mode: string; role: 'user' | 'assistant'; text: string }): Promise<void> {
  const now = nowTimestamp();
  await db.withTransactionAsync(async () => {
    const title = input.text.replace(/\s+/g, ' ').trim().slice(0, 60);
    await db.runAsync('INSERT OR IGNORE INTO coach_chats (id, title, mode, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', input.chatId, title || 'Chat', input.mode, now, now);
    await db.runAsync('UPDATE coach_chats SET updated_at = ? WHERE id = ?', now, input.chatId);
    await db.runAsync('INSERT INTO coach_messages (id, chat_id, role, text, created_at) VALUES (?, ?, ?, ?, ?)', newId(), input.chatId, input.role, input.text, now);
  });
}

export async function deleteChat(db: SQLiteDatabase, chatId: string): Promise<void> {
  await db.runAsync('DELETE FROM coach_chats WHERE id = ?', chatId);
}
