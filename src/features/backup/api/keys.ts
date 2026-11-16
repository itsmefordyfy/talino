/** The key-value store's keys for the backup's own memory (never part of a backup file). */
export const BACKUP_KEYS = {
  runState: 'backup:run:v1',
  autoRestore: 'backup:auto-restore:v1',
  profileId: 'backup:profile-id:v1',
} as const;
