import { defineStrings } from '@/lib/i18n';

import type { AdrStatus } from '../lib/adr';

// Owner rule (2026-11-15): no Filipino is written. The `fil` table is the same English text, a placeholder and not a translation; it is listed in
// ENGLISH_ONLY of strings-parity.test.ts. Every sentence in the ADR builder's screen lives here, never in a component. (The wording of the checks themselves is in `lib/adr.ts`.)
const en = {
  intro: 'You write the decision; the builder only checks what a useful record needs and shapes it as Markdown. Nothing here calls an AI.',

  savedTitle: 'Your saved records',
  savedEmpty: 'No saved records yet. Fill in the form below and press Save.',
  savedLoadError: 'Your saved records could not be loaded.',
  savedRetry: 'Try again',
  open: 'Open',
  delete: 'Delete',
  savedOpen: (title: string) => `Open ${title}`,
  savedDelete: (title: string) => `Delete ${title}`,
  savedUntitled: 'Untitled decision',
  savedMeta: (status: string, date: string) => (date ? `${status} · ${date}` : status),
  savedProject: (label: string) => `Project: ${label}`,
  deleteAsk: (title: string) => `Delete "${title}"? This cannot be undone.`,
  deleteYes: 'Delete it',
  deleteKeep: 'Keep it',
  deleteFailed: 'That record could not be deleted. Try again.',
  openFailed: 'That record could not be read, so it was not opened.',

  discardAsk: 'This record has changes that are not saved. Leave it anyway?',
  discardYes: 'Leave without saving',
  discardKeep: 'Keep editing',
  newRecord: 'New record',
  editing: 'Editing a saved record',
  editingNew: 'New record',
  unsaved: 'Not saved yet',
  saved: 'Saved',

  titleLabel: 'Title',
  titlePlaceholder: 'The decision, in a phrase: "Use PostgreSQL for tenant data"',
  statusLabel: 'Status',
  status: { proposed: 'Proposed', accepted: 'Accepted', deprecated: 'Deprecated', superseded: 'Superseded' } satisfies Record<AdrStatus, string>,
  dateLabel: 'Date',
  datePlaceholder: 'YYYY-MM-DD',
  contextLabel: 'Context',
  contextHint: 'The situation: what the system is, what forces a decision now, and the limits you work within.',
  driversLabel: 'Decision drivers',
  driversHint: 'What the decision has to satisfy. Options are compared against these.',
  driverItem: 'Decision driver',
  driverPlaceholder: 'For example: tenant data must be isolated',
  driverAdd: 'Add a driver',

  optionsLabel: 'Options considered',
  optionsHint: 'Two to five real options, including the one you did not choose.',
  optionNumber: (n: number) => `Option ${n}`,
  optionNameLabel: (n: number) => `Name of option ${n}`,
  optionNamePlaceholder: 'A short name',
  optionPros: 'What it gives you',
  optionCons: 'What it costs',
  proItem: 'Pro',
  conItem: 'Con',
  proPlaceholder: 'A benefit',
  conPlaceholder: 'A cost or risk',
  proAdd: 'Add a benefit',
  conAdd: 'Add a cost',
  optionRemove: (n: number) => `Remove option ${n}`,
  optionAdd: 'Add an option',
  optionsFull: 'Five options is the most the builder keeps.',

  decisionLabel: 'The decision',
  decisionChoose: 'Which option did you choose?',
  decisionNeedOptions: 'Name your options above, then choose one here.',
  reasonLabel: 'Why this one?',
  reasonHint: 'Tie it to the context or a driver, in your own words.',
  consequencesLabel: 'Consequences',
  goodLabel: 'What gets easier',
  goodItem: 'Good consequence',
  goodPlaceholder: 'For example: one schema to migrate',
  goodAdd: 'Add a benefit',
  badLabel: 'What it costs you',
  badItem: 'Cost',
  badPlaceholder: 'For example: we must test every access policy',
  badAdd: 'Add a cost',
  notesLabel: 'Notes (optional)',
  notesHint: 'Links, when to revisit this, what replaced it.',
  projectLabel: 'Attach to a course project (optional)',
  projectNone: 'None',
  project: { 'software-architecture-ai-p1': 'Project 1', 'software-architecture-ai-p2': 'Project 2', 'software-architecture-ai-p3': 'Project 3' } as Record<string, string>,
  removeItem: (label: string, n: number) => `Remove ${label.toLowerCase()} ${n}`,
  itemLabel: (label: string, n: number) => `${label} ${n}`,

  checkTitle: 'Checklist',
  checkNoAi: 'Rules, not an AI',
  checkNote: 'These checks look at what is written, not whether the reasoning is right. You can save with items open.',
  checkClear: 'Every check passes. That does not mean the decision is right: ask Tali to challenge it.',
  checkSummary: (missing: number, improve: number) => {
    if (missing === 0 && improve === 0) return 'Nothing left to look at';
    const parts: string[] = [];
    if (missing > 0) parts.push(`${missing} to fill in`);
    if (improve > 0) parts.push(`${improve} that would make it stronger`);
    return parts.join(' and ');
  },
  severityMissing: 'To fill in',
  severityImprove: 'Would help',
  findingLabel: (field: string, severity: string, message: string) => `${field}. ${severity}. ${message}`,
  fields: { title: 'Title', date: 'Date', context: 'Context', drivers: 'Decision drivers', options: 'Options', decision: 'Decision', reason: 'Reason', good: 'Good consequences', bad: 'Costs', notes: 'Notes' },

  previewTitle: 'Markdown preview',
  previewNote: 'Plain text, ready to paste into a repository or a document.',

  save: 'Save record',
  saving: 'Saving…',
  saveBlank: 'Write something first',
  saveDone: 'Saved on this phone.',
  saveDoneMissing: (n: number, fields: string) => `Saved on this phone. ${n === 1 ? '1 thing is' : `${n} things are`} still missing: ${fields}.`,
  saveRefused: {
    empty: 'There is nothing to save yet. Write something in the form first.',
    too_long: 'This record is too long to save. Shorten the longest fields and try again.',
    limit: 'You have saved the most records the app keeps (60). Delete an old one to make room.',
    bad_kind: 'This record could not be saved.',
  },
  saveFailed: 'The record could not be saved. Try again.',
  copy: 'Copy Markdown',
  copied: 'Copied',
  copyFailed: 'Could not copy. Select the text in the preview and copy it by hand.',
  askTali: 'Ask Tali to challenge this decision',
  askTaliNote: 'Opens a chat with your record filled in. Tali asks questions; she does not rewrite it.',
};

export const adrStrings = defineStrings({ en, fil: en });
