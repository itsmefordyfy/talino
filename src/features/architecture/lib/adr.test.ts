import { describe, expect, test } from '@jest/globals';

import {
  ADR_LIMITS,
  addOption,
  adrChallengePrompt,
  adrProblems,
  adrToContent,
  adrToMarkdown,
  isBlankDraft,
  isIsoDate,
  newAdrDraft,
  parseAdrContent,
  parseAdrDraft,
  realOptions,
  removeOption,
  renameOption,
  substantiveWords,
  todayIso,
  type AdrDraft,
  type AdrProblemId,
} from './adr';

const GOOD: AdrDraft = {
  title: 'Use PostgreSQL for tenant data',
  status: 'accepted',
  date: '2026-11-18',
  context: 'TindaTrack stores orders for many small shops. Each shop must never see another shop’s data. Two developers will run it, with no one on call at night.',
  drivers: ['Tenant data must be isolated', 'Two developers will operate it'],
  options: [
    { name: 'PostgreSQL with row-level security', pros: ['Isolation is enforced by the database'], cons: ['Policies are easy to get wrong'] },
    { name: 'One database per shop', pros: ['Strong isolation'], cons: ['Hundreds of databases to migrate'] },
  ],
  decision: { chosen: 'PostgreSQL with row-level security', reason: 'One database is within what two people can run, and row-level security enforces the isolation requirement.' },
  consequences: { good: ['One schema to migrate'], bad: ['We must test every policy'] },
  notes: '',
};

const ids = (draft: AdrDraft): AdrProblemId[] => adrProblems(draft).map((problem) => problem.id);
const with_ = (patch: Partial<AdrDraft>): AdrDraft => ({ ...GOOD, ...patch });

describe('newAdrDraft', () => {
  test('starts blank, proposed, with two empty options and the given date', () => {
    const draft = newAdrDraft('2026-11-18');
    expect(draft.status).toBe('proposed');
    expect(draft.date).toBe('2026-11-18');
    expect(draft.options).toHaveLength(2);
    expect(isBlankDraft(draft)).toBe(true);
  });

  test('a date that is not a date is left empty', () => {
    expect(newAdrDraft('tomorrow').date).toBe('');
    expect(newAdrDraft('2026-13-45').date).toBe('');
  });
});

describe('parseAdrDraft', () => {
  test('reads back what adrToContent wrote', () => {
    expect(parseAdrContent(adrToContent(GOOD))).toEqual(GOOD);
  });

  test('anything that is not an object is null', () => {
    for (const value of [null, undefined, 5, 'x', [], true]) expect(parseAdrDraft(value)).toBeNull();
    expect(parseAdrContent('not json')).toBeNull();
    expect(parseAdrContent('[1]')).toBeNull();
  });

  test('missing and wrong-typed fields become empty, and there are always two options', () => {
    const draft = parseAdrDraft({ title: 5, status: 'weird', date: 'x', options: 'no', drivers: [1, 'ok'], consequences: 'x', decision: null })!;
    expect(draft.title).toBe('');
    expect(draft.status).toBe('proposed');
    expect(draft.date).toBe('');
    expect(draft.drivers).toEqual(['ok']);
    expect(draft.options).toHaveLength(2);
    expect(draft.decision).toEqual({ chosen: '', reason: '' });
    expect(draft.consequences).toEqual({ good: [], bad: [] });
  });

  test('clips text and lists to the form limits and keeps at most five options', () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ name: `Option ${i}`, pros: Array(9).fill('p'.repeat(500)), cons: [] }));
    const draft = parseAdrDraft({ ...GOOD, title: 't'.repeat(500), context: 'c'.repeat(9000), options: many, drivers: Array(20).fill('d') })!;
    expect(draft.title).toHaveLength(ADR_LIMITS.title);
    expect(draft.context).toHaveLength(ADR_LIMITS.context);
    expect(draft.options).toHaveLength(5);
    expect(draft.options[0]!.pros).toHaveLength(ADR_LIMITS.proscons);
    expect(draft.options[0]!.pros[0]).toHaveLength(ADR_LIMITS.item);
    expect(draft.drivers).toHaveLength(ADR_LIMITS.drivers);
  });

  test('a completely full record is far below the store limit', () => {
    const full: AdrDraft = {
      title: 't'.repeat(ADR_LIMITS.title),
      status: 'accepted',
      date: '2026-11-18',
      context: '"'.repeat(ADR_LIMITS.context),
      drivers: Array(ADR_LIMITS.drivers).fill('d'.repeat(ADR_LIMITS.item)),
      options: Array.from({ length: 5 }, () => ({ name: 'n'.repeat(ADR_LIMITS.optionName), pros: Array(4).fill('p'.repeat(ADR_LIMITS.item)), cons: Array(4).fill('c'.repeat(ADR_LIMITS.item)) })),
      decision: { chosen: 'n'.repeat(ADR_LIMITS.optionName), reason: 'r'.repeat(ADR_LIMITS.reason) },
      consequences: { good: Array(5).fill('g'.repeat(ADR_LIMITS.item)), bad: Array(5).fill('b'.repeat(ADR_LIMITS.item)) },
      notes: 'n'.repeat(ADR_LIMITS.notes),
    };
    // Even with every quote character escaped in the JSON, the record stays under the 20,000-character limit.
    expect(adrToContent(parseAdrDraft(full)!).length).toBeLessThan(20_000);
  });
});

describe('editing helpers', () => {
  test('renaming the chosen option moves the decision with it', () => {
    const next = renameOption(GOOD, 0, 'Postgres with RLS');
    expect(next.options[0]!.name).toBe('Postgres with RLS');
    expect(next.decision.chosen).toBe('Postgres with RLS');
    expect(renameOption(GOOD, 1, 'Schema per shop').decision.chosen).toBe(GOOD.decision.chosen);
  });

  test('removing needs more than two options, and clears a decision that named the removed one', () => {
    expect(removeOption(GOOD, 0)).toBe(GOOD);
    const three = addOption(GOOD);
    const trimmed = removeOption(three, 0);
    expect(trimmed.options).toHaveLength(2);
    expect(trimmed.decision.chosen).toBe('');
  });

  test('there are never more than five options', () => {
    let draft = GOOD;
    for (let i = 0; i < 8; i += 1) draft = addOption(draft);
    expect(draft.options).toHaveLength(5);
  });
});

describe('adrProblems', () => {
  test('a complete, specific record has nothing to report', () => {
    expect(adrProblems(GOOD)).toEqual([]);
  });

  test('a blank record reports what is missing, in the order of the form', () => {
    const found = ids(newAdrDraft('2026-11-18'));
    expect(found).toEqual(['title-empty', 'context-empty', 'drivers-none', 'options-few', 'decision-none', 'reason-missing', 'good-none', 'bad-none']);
  });

  test('fewer than two real options: none, one, or the same name twice', () => {
    expect(ids(with_({ options: [{ name: '', pros: [], cons: [] }, { name: '  ', pros: [], cons: [] }] }))).toContain('options-few');
    const one = with_({ options: [GOOD.options[0]!, { name: '', pros: [], cons: [] }] });
    expect(ids(one)).toContain('options-few');
    const twin = with_({ options: [GOOD.options[0]!, { ...GOOD.options[0]!, name: ' postgresql WITH row-level security ' }] });
    expect(ids(twin)).toContain('options-few');
    expect(realOptions(twin)).toHaveLength(1);
  });

  test('an option with no pros or cons is pointed out by name', () => {
    const draft = with_({ options: [GOOD.options[0]!, { name: 'Document store', pros: [], cons: ['  '] }] });
    const problem = adrProblems(draft).find((p) => p.id === 'option-thin')!;
    expect(problem.optionIndex).toBe(1);
    expect(problem.message).toContain('Document store');
  });

  test('the decision must name one of the options', () => {
    expect(ids(with_({ decision: { ...GOOD.decision, chosen: '' } }))).toContain('decision-none');
    expect(ids(with_({ decision: { ...GOOD.decision, chosen: 'MongoDB' } }))).toContain('decision-unknown');
    // Case and spacing do not matter, and a longer phrase that contains an option's name counts.
    expect(ids(with_({ decision: { ...GOOD.decision, chosen: '  one database per SHOP ' } }))).toEqual([]);
    expect(ids(with_({ decision: { ...GOOD.decision, chosen: 'We go with one database per shop' } }))).toEqual([]);
  });

  test('a context that is empty or a single short line is flagged, two sentences are not', () => {
    expect(ids(with_({ context: '   ' }))).toContain('context-empty');
    expect(ids(with_({ context: 'We need a database.' }))).toContain('context-thin');
    expect(ids(with_({ context: 'We need a database for the shop orders and nothing else at all right now' }))).toContain('context-thin');
    expect(ids(with_({ context: 'Many shops use the app each day to track orders.\nEach shop must only see its own orders.' }))).not.toContain('context-thin');
  });

  test('no reason, and a reason that is only a vague claim', () => {
    expect(ids(with_({ decision: { ...GOOD.decision, reason: '' } }))).toContain('reason-missing');
    for (const reason of ['It is the best option.', 'Obviously the best.', 'It is the industry standard.', 'Everyone uses it, it is best practice.', 'Simple and popular.']) {
      expect(ids(with_({ decision: { ...GOOD.decision, reason } }))).toContain('reason-vague');
    }
  });

  test('a vague word inside a real reason is fine', () => {
    const reason = 'It is the best fit because the database enforces tenant isolation and two developers can run it.';
    expect(ids(with_({ decision: { ...GOOD.decision, reason } }))).toEqual([]);
    expect(substantiveWords('Because the team already knows it').length).toBeGreaterThanOrEqual(2);
  });

  test('no cost accepted says every decision costs something; a missing benefit is a lighter note', () => {
    const none = adrProblems(with_({ consequences: { good: ['One schema'], bad: [' '] } })).find((p) => p.id === 'bad-none')!;
    expect(none.severity).toBe('missing');
    expect(none.message).toContain('Every decision costs something');
    expect(adrProblems(with_({ consequences: { good: [], bad: ['A cost'] } })).find((p) => p.id === 'good-none')!.severity).toBe('improve');
  });

  test('TBD and TODO left in a field are reported once for each field', () => {
    const draft = with_({ context: `${GOOD.context} Hosting is TBD.`, notes: 'todo: ask the team', consequences: { good: ['One schema'], bad: ['To be decided'] } });
    const found = adrProblems(draft).filter((p) => p.id === 'tbd');
    expect(found.map((p) => p.field).sort()).toEqual(['bad', 'context', 'notes']);
  });

  test('a title that is a question, or too long, or empty', () => {
    expect(ids(with_({ title: 'Should we use PostgreSQL?' }))).toContain('title-question');
    expect(ids(with_({ title: 'Which database' }))).toContain('title-question');
    expect(ids(with_({ title: 'Use PostgreSQL' }))).toEqual([]);
    expect(ids(with_({ title: 'Use PostgreSQL '.repeat(8) }))).toContain('title-long');
    expect(ids(with_({ title: ' ' }))).toContain('title-empty');
  });

  test('a missing or badly written date is a gentle note', () => {
    expect(adrProblems(with_({ date: '' })).find((p) => p.id === 'date-missing')!.severity).toBe('improve');
    expect(ids(with_({ date: '18/11/2026' }))).toEqual(['date-format']);
    expect(ids(with_({ date: '2026-11-18' }))).toEqual([]);
  });

  test('today is written as year-month-day on the phone\'s own calendar', () => {
    expect(todayIso(new Date(2026, 10, 8, 23, 59))).toBe('2026-11-08');
    expect(isIsoDate(todayIso())).toBe(true);
  });

  test('every finding names its field and speaks plainly (no scolding, no jargon codes)', () => {
    for (const problem of adrProblems(newAdrDraft('2026-11-18'))) {
      expect(problem.field).toBeTruthy();
      expect(problem.message.length).toBeGreaterThan(20);
      expect(problem.message).not.toMatch(/\b(you must|wrong|bad record|error)\b/i);
    }
  });
});

describe('adrToMarkdown', () => {
  const markdown = adrToMarkdown(GOOD);

  test('has the MADR sections in order, with every field of the draft', () => {
    const order = ['# Use PostgreSQL for tenant data', '* Status: accepted', '* Date: 2026-11-18', '## Context and Problem Statement', '## Decision Drivers', '## Considered Options', '## Decision Outcome', '### Consequences', '## Pros and Cons of the Options'];
    let at = -1;
    for (const part of order) {
      const found = markdown.indexOf(part);
      expect(found).toBeGreaterThan(at);
      at = found;
    }
    const everyText = [GOOD.context, ...GOOD.drivers, ...GOOD.options.flatMap((o) => [o.name, ...o.pros, ...o.cons]), GOOD.decision.chosen, GOOD.decision.reason, ...GOOD.consequences.good, ...GOOD.consequences.bad];
    for (const part of everyText) expect(markdown).toContain(part);
    expect(markdown).toContain('Chosen option: "PostgreSQL with row-level security", because:');
    expect(markdown).toContain('* Good, because One schema to migrate');
    expect(markdown).toContain('* Bad, because We must test every policy');
  });

  test('notes appear as More Information only when written', () => {
    expect(markdown).not.toContain('More Information');
    expect(adrToMarkdown({ ...GOOD, notes: 'Revisit after launch.' })).toContain('## More Information\n\nRevisit after launch.');
  });

  test('a blank record still reads as a record, with plain placeholders', () => {
    const blank = adrToMarkdown(newAdrDraft(''));
    expect(blank).toContain('# Untitled decision');
    expect(blank).toContain('* Date: not set');
    expect(blank).toContain('No option chosen yet.');
    expect(blank).toContain('Not written yet.');
    expect(blank.endsWith('\n')).toBe(true);
  });

  test('is plain text: nothing is HTML-escaped, so a copy is what was typed', () => {
    const text = adrToMarkdown({ ...GOOD, context: 'Use <b>RLS</b> & "quotes" for tenants: a < b.' });
    expect(text).toContain('Use <b>RLS</b> & "quotes" for tenants: a < b.');
    expect(text).not.toContain('&amp;');
    expect(text).not.toContain('&lt;');
  });

  test('a field with line breaks cannot add headings or list items of its own', () => {
    const text = adrToMarkdown({ ...GOOD, title: 'Use X\n## Injected heading', drivers: ['one\n* two\n# three'], consequences: { good: [], bad: ['cost\n## More'] } });
    expect(text.split('\n').filter((line) => line.startsWith('# '))).toEqual(['# Use X ## Injected heading']);
    expect(text).toContain('* one * two # three');
    expect(text).not.toContain('\n## Injected heading');
    expect(text).toContain('* Bad, because cost ## More');
  });

  test('options without a name are left out of the lists', () => {
    const text = adrToMarkdown({ ...GOOD, options: [...GOOD.options, { name: '', pros: ['stray'], cons: [] }] });
    expect(text).not.toContain('stray');
  });
});

describe('adrChallengePrompt', () => {
  test('is the record as Markdown followed by the challenge, and does not ask to be rewritten', () => {
    const prompt = adrChallengePrompt(GOOD);
    expect(prompt).toContain('# Use PostgreSQL for tenant data');
    expect(prompt.trimEnd().endsWith('decide for me.')).toBe(true);
    expect(prompt).toContain('what assumption would make it wrong, what option is missing, and what consequence did I leave out');
  });

  test('a long record is clipped but the challenge is always kept, within the chat box limit', () => {
    const long = adrChallengePrompt({ ...GOOD, context: 'x'.repeat(ADR_LIMITS.context), notes: 'y'.repeat(ADR_LIMITS.notes), options: Array.from({ length: 5 }, (_, i) => ({ name: `Option ${i}`, pros: Array(4).fill('p'.repeat(160)), cons: Array(4).fill('c'.repeat(160)) })) });
    expect(long.length).toBeLessThanOrEqual(4000);
    expect(long).toContain('[…record shortened…]');
    expect(long).toContain('Challenge this decision');
  });
});
