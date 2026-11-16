import { describe, expect, test } from '@jest/globals';

import { cleanDraftInput, draftSource, parseDraft, portfolioUserText } from './portfolio-ai';

const body = {
  headline: 'Junior Developer',
  about: '',
  skills: ['React Native', 'TypeScript'],
  resume: { name: 'Ford', experience: [{ id: 'e1', title: 'Junior Web Developer', organization: 'Pili Digital Studio', bullets: ['Built five client websites in React'] }] },
  projects: [{ id: 'p1', title: 'Barangay Queue App', role: 'Solo developer', tech: ['Expo', 'Supabase'], notes: 'Residents take a queue number from their phone instead of lining up.' }],
  want: { headline: true, about: true, projectIds: ['p1'] },
};

const input = () => {
  const cleaned = cleanDraftInput(body);
  if (!cleaned) throw new Error('input should be valid');
  return cleaned;
};
const reply = (value: unknown) => JSON.stringify(value);

describe('cleanDraftInput', () => {
  test('keeps what the learner gave and only the ids that exist', () => {
    const cleaned = cleanDraftInput({ ...body, want: { headline: false, about: false, projectIds: ['p1', 'ghost'] } });
    expect(cleaned?.want).toEqual({ headline: false, about: false, projectIds: ['p1'] });
    expect(cleaned?.projects[0]).toMatchObject({ title: 'Barangay Queue App', tech: ['Expo', 'Supabase'] });
  });

  test('nothing asked for, or nothing to write from, is refused', () => {
    expect(cleanDraftInput({ ...body, want: { headline: false, about: false, projectIds: [] } })).toBeNull();
    expect(cleanDraftInput({ projects: [], want: { about: true }, resume: {} })).toBeNull();
  });

  test('the source holds the learner’s words and no contact details', () => {
    const source = draftSource(input());
    expect(source).toContain('Residents take a queue number');
    expect(source).toContain('Pili Digital Studio');
    expect(portfolioUserText(input())).toContain('Write: headline, about, project p1.');
  });
});

describe('parseDraft', () => {
  test('keeps wording that stays inside the facts', () => {
    const draft = parseDraft(
      reply({ headline: 'Junior developer · React Native', about: 'I build mobile apps with React Native and TypeScript.', projects: [{ id: 'p1', summary: 'A queue number app for residents.', description: 'Residents take a number from their phone.\n\nI built it with Expo and Supabase.' }], questions: ['How many barangays use it?'] }),
      input(),
    );
    expect(draft).toMatchObject({ headline: 'Junior developer · React Native', questions: ['How many barangays use it?'] });
    expect(draft?.projects).toHaveLength(1);
    expect(draft?.projects[0].description).toContain('\n\n');
  });

  test('drops text that invents a number or a name, and keeps the rest', () => {
    const draft = parseDraft(
      reply({ headline: 'Junior developer', about: 'I built apps used by 5000 people at Google.', projects: [{ id: 'p1', summary: 'A queue number app.', description: 'Used by 12 barangays in Bicol.' }], questions: [] }),
      input(),
    );
    expect(draft?.about).toBe('');
    expect(draft?.projects[0]).toEqual({ id: 'p1', summary: 'A queue number app.', description: '' });
  });

  test('ignores what wasn’t asked for and ids that aren’t the learner’s', () => {
    const asked = { ...input(), want: { headline: false, about: false, projectIds: ['p1'] } };
    const draft = parseDraft(reply({ headline: 'Junior developer', about: 'I build apps.', projects: [{ id: 'other', summary: 'x', description: 'y' }, { id: 'p1', summary: 'A queue app.', description: '' }], questions: [] }), asked);
    expect(draft).toMatchObject({ headline: '', about: '' });
    expect(draft?.projects.map((project) => project.id)).toEqual(['p1']);
  });

  test('offers other headlines that stay inside the facts and differ from the first', () => {
    const draft = parseDraft(reply({ headline: 'Junior developer · React Native', headlineOptions: ['Mobile developer · Expo', 'Junior developer · React Native', 'Developer at Google', 'Junior Developer'], about: '', projects: [], questions: [] }), input());
    // Not the same as the first, not the learner's current one, and nothing with a name they never gave.
    expect(draft?.headlineOptions).toEqual(['Mobile developer · Expo']);
  });

  test('nothing usable, or not JSON, is null', () => {
    expect(parseDraft('not json', input())).toBeNull();
    expect(parseDraft(reply({ headline: '', about: '', projects: [], questions: [] }), input())).toBeNull();
  });
});
