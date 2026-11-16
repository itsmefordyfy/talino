import type { GitErrorCode, GitOutcome } from './git';
import type { SoftwareStrings } from '../strings';

/** The sentence that explains what a command did (or why it was refused). */
export function outcomeText(outcome: GitOutcome, words: SoftwareStrings['git']): string {
  if (!outcome.ok) return words.errors[outcome.error as GitErrorCode];
  const { detail } = outcome;
  switch (outcome.kind) {
    case 'commit':
      return words.outcome.commit(detail.id ?? '', detail.branch);
    case 'branch':
      return words.outcome.branch(detail.branch ?? '', detail.id ?? '');
    case 'switch':
      return words.outcome.switch(detail.branch ?? '');
    case 'detach':
      return words.outcome.detach(detail.id ?? '');
    case 'fast-forward':
      return words.outcome['fast-forward'](detail.onto ?? detail.branch ?? '');
    case 'merge-commit':
      return words.outcome['merge-commit'](detail.branch ?? '', detail.id ?? '');
    case 'up-to-date':
      return words.outcome['up-to-date'];
    case 'rebase':
      return words.outcome.rebase(detail.branch ?? '', detail.onto ?? '', detail.count ?? 0);
  }
}
