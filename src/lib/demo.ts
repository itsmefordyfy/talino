/** Rows the Developer "Career demo data" switch adds all have ids starting with this, so backup, reminders and the switch itself can tell them from the learner's own. */
export const DEMO_ID_PREFIX = 'demo-';

export const demoId = (name: string): string => `${DEMO_ID_PREFIX}${name}`;

export const isDemoId = (id: unknown): boolean => typeof id === 'string' && id.startsWith(DEMO_ID_PREFIX);
