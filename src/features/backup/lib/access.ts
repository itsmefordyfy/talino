/**
 * Who may use the manual backup file (create, history, export, import): Pro, which in Talino means All-Access or a
 * purchase of any course (`useAccess` from the store). Automatic backup and automatic restore are free for everyone.
 * One rule, here, so the screen and the actions never disagree. A plan that isn't known yet (the store hasn't
 * answered) never locks anyone out: the same rule as the rest of the app.
 */
export type AccessInput = { known: boolean; allAccess: boolean; anyPurchase: boolean };

export function canUseManualBackup({ known, allAccess, anyPurchase }: AccessInput): boolean {
  if (!known) return true;
  return allAccess || anyPurchase;
}
