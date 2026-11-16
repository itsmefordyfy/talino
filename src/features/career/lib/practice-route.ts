import { router } from 'expo-router';

import type { ApplicationRow } from '../types';
import { practiceMode, practicePrompt, type PracticeCopy } from './practice';

/** Opens practice for this interview: the mock interview for a job (the position filled in), Tali's proposal reviewer for a client call. */
export function openPractice(application: Pick<ApplicationRow, 'kind' | 'title' | 'company'>, copy: PracticeCopy): void {
  if (application.kind === 'job') {
    router.push({ pathname: '/interview/setup', params: { position: application.title } });
    return;
  }
  router.push({ pathname: '/tali', params: { mode: practiceMode(application.kind), prompt: practicePrompt(application, copy) } });
}
