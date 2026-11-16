import { useAccess } from '@/features/store';

import { canUseManualBackup } from '../lib/access';

/** Whether the manual backup file (create, history, export, import) is open to this learner: any purchase or All-Access. The one place the rule is applied. */
export function useBackupAccess(): { manual: boolean; known: boolean } {
  const access = useAccess();
  return { manual: canUseManualBackup(access), known: access.known };
}
