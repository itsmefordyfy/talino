import { describe, expect, test } from '@jest/globals';

import {
  applyGenerated,
  applySuggestion,
  factsText,
  numbersIn,
  parseGenerated,
  parseImported,
  parseImproved,
  parseReview,
  supported,
  unsupportedTerms,
} from './ai';
import { parseContent } from './document';

const base = parseContent({
  name: 'Ana Cruz',
  headline: '',
  summary: 'Developer who likes building apps.',
  skills: ['React', 'SQL', 'Figma'],
  experience: [{ id: 'job1', title: 'Developer', organization: 'Acme', start: 'Mar 2021', current: true, bullets: ['Built the booking app with React', 'Fixed bugs'] }],
  projects: [{ id: 'proj1', title: 'Budget tracker', bullets: ['Made a budget app for 40 classmates'] }],
  education: [{ id: 'edu1', title: 'BS Computer Science', organization: 'Bicol University', end: '2020' }],
  achievements: ['Hackathon finalist 2022'],
});

describe('guards', () => {
  test('numbersIn finds figures however they are written', () => {
    expect(numbersIn('Cut load time by 35% across 1,200 users in 2 weeks, 4.5 stars')).toEqual(['35', '1200', '2', '4.5']);
    expect(numbersIn('no figures here')).toEqual([]);
  });

  test('unsupportedTerms flags names and tools the source never mentioned, ignores sentence starts', () => {
    const source = 'Built the booking app with React. Worked with Acme.';
    expect(unsupportedTerms('Built a booking app with React for Acme', source)).toEqual([]);
    expect(unsupportedTerms('Built a booking app with Kubernetes and AWS', source)).toEqual(['Kubernetes', 'AWS']);
    expect(unsupportedTerms('Led a team. Delivered features.', source)).toEqual([]);
    expect(unsupportedTerms('Used Node.js and C++ daily', source)).toEqual(['Node.js', 'C++']);
  });

  test('supported needs every number and every proper term to come from the source', () => {
    const source = factsText(base);
    expect(supported('Built the booking app for Acme with React', source)).toBe(true);
    expect(supported('Built the booking app for 5000 users', source)).toBe(false);
    expect(supported('Built the booking app with Angular', source)).toBe(false);
    expect(supported('Made a budget app for 40 classmates', source)).toBe(true);
  });
});

describe('factsText', () => {
  test('lists every entry with its id so the model can answer by id', () => {
    const text = factsText(base);
    expect(text).toContain('[job1]');
    expect(text).toContain('[proj1]');
    expect(text).toContain('Built the booking app with React');
    expect(text).toContain('Skills: React, SQL, Figma');
  });
});

describe('parseGenerated + applyGenerated', () => {
  const answer = {
    headline: 'Software Developer',
    summary: 'Developer who builds apps with React and SQL.',
    entries: [
      { id: 'job1', bullets: ['Built and shipped the booking app using React', 'Fixed bugs reported by users'] },
      { id: 'invented', bullets: ['Ran a team of 50 engineers'] },
      { id: 'proj1', bullets: ['Built a budget app used by 400 classmates', 'Built a budget app for classmates'] },
    ],
    skills: ['SQL', 'React', 'Kubernetes'],
    suggestedSkills: [
      { skill: 'App development', evidence: 'Made a budget app for 40 classmates' },
      { skill: 'Leadership', evidence: 'Led the whole company' },
    ],
    keywords: ['React', 'SQL'],
    gaps: ['Testing'],
    questions: ['How many people use the booking app?'],
  };

  test('parse refuses text that is not JSON, or has no summary', () => {
    expect(parseGenerated('nope')).toBeNull();
    expect(parseGenerated(JSON.stringify({ ...answer, summary: '' }))).toBeNull();
    expect(parseGenerated(JSON.stringify(answer))).not.toBeNull();
  });

  test('the document is the learner\'s own entries: an id the model made up adds nothing', () => {
    const parsed = parseGenerated(JSON.stringify(answer));
    if (!parsed) throw new Error('parse');
    const { content } = applyGenerated(base, parsed);
    expect(content.experience.map((entry) => entry.id)).toEqual(['job1']);
    expect(content.projects.map((entry) => entry.id)).toEqual(['proj1']);
    expect(JSON.stringify(content)).not.toContain('50 engineers');
  });

  test('a bullet with a number or a tool the learner never gave is replaced by their own words', () => {
    const parsed = parseGenerated(JSON.stringify(answer));
    if (!parsed) throw new Error('parse');
    const { content } = applyGenerated(base, parsed);
    expect(content.experience[0].bullets).toEqual(['Built and shipped the booking app using React', 'Fixed bugs reported by users']);
    // 400 classmates is new (the source says 40), so that bullet is dropped; the supported one stays.
    expect(content.projects[0].bullets).toEqual(['Built a budget app for classmates']);
  });

  test('when every new bullet fails, the learner\'s own bullets stay', () => {
    const parsed = parseGenerated(JSON.stringify({ ...answer, entries: [{ id: 'job1', bullets: ['Led 12 engineers at Google'] }] }));
    if (!parsed) throw new Error('parse');
    expect(applyGenerated(base, parsed).content.experience[0].bullets).toEqual(['Built the booking app with React', 'Fixed bugs']);
  });

  test('skills: the model may order the learner\'s skills, not add to them; none is lost', () => {
    const parsed = parseGenerated(JSON.stringify(answer));
    if (!parsed) throw new Error('parse');
    expect(applyGenerated(base, parsed).content.skills).toEqual(['SQL', 'React', 'Figma']);
  });

  test('suggested skills need evidence found in the résumé and are never added on their own', () => {
    const parsed = parseGenerated(JSON.stringify(answer));
    if (!parsed) throw new Error('parse');
    const result = applyGenerated(base, parsed);
    expect(result.suggestedSkills).toEqual([{ skill: 'App development', evidence: 'Made a budget app for 40 classmates' }]);
    expect(result.content.skills).not.toContain('App development');
  });

  test('the summary is dropped back to the learner\'s own when it brings in a new figure or name', () => {
    const parsed = parseGenerated(JSON.stringify({ ...answer, summary: 'Developer with 8 years of experience.' }));
    if (!parsed) throw new Error('parse');
    expect(applyGenerated(base, parsed).content.summary).toBe('Developer who likes building apps.');
  });

  test('the headline is the learner\'s own when they have one; the model fills only a blank', () => {
    const parsed = parseGenerated(JSON.stringify(answer));
    if (!parsed) throw new Error('parse');
    expect(applyGenerated(base, parsed).content.headline).toBe('Software Developer');
    expect(applyGenerated({ ...base, headline: 'Web developer' }, parsed).content.headline).toBe('Web developer');
  });

  test('questions, keywords and gaps come back trimmed and limited', () => {
    const parsed = parseGenerated(JSON.stringify({ ...answer, questions: Array.from({ length: 9 }, (_, n) => `Q${n}?`) }));
    if (!parsed) throw new Error('parse');
    const result = applyGenerated(base, parsed);
    expect(result.questions).toHaveLength(5);
    expect(result.keywords).toEqual(['React', 'SQL']);
    expect(result.gaps).toEqual(['Testing']);
  });
});

describe('parseReview + applySuggestion', () => {
  const answer = {
    verdict: 'Solid start, the summary is vague.',
    weak: [{ section: 'projects', advice: 'Add what the budget app did for people.' }],
    suggestions: [
      { section: 'summary', after: 'Developer who builds apps with React and SQL.', reason: 'Names your real tools.' },
      { section: 'experience', id: 'job1', index: 1, after: 'Fixed bugs reported by users', reason: 'Clearer.' },
      { section: 'experience', id: 'job1', index: 0, after: 'Built the app for 9000 users', reason: 'Impact.' },
      { section: 'experience', id: 'nope', index: 0, after: 'x', reason: 'y' },
      { section: 'achievements', index: 0, after: 'Hackathon finalist 2022', reason: 'same text' },
    ],
    skills: [
      { skill: 'App development', evidence: 'Made a budget app for 40 classmates', reason: 'You built a real app.' },
      { skill: 'Rust', evidence: 'wrote Rust', reason: 'none' },
    ],
    questions: ['Which tools did you use for the budget app?'],
  };
  const parsed = parseReview(JSON.stringify(answer), base);

  test('keeps only suggestions that point at real text, differ from it and stay within the facts', () => {
    expect(parsed?.suggestions.map((item) => (item.kind === 'rewrite' ? `${item.target.section}:${item.before}` : item.kind))).toEqual(['summary:Developer who likes building apps.', 'experience:Fixed bugs', 'skill']);
  });

  test('skills need evidence from the résumé', () => {
    expect(parsed?.suggestions.filter((item) => item.kind === 'skill')).toMatchObject([{ skill: 'App development' }]);
  });

  test('carries the verdict, weak sections and questions', () => {
    expect(parsed?.verdict).toBe('Solid start, the summary is vague.');
    expect(parsed?.weak).toEqual([{ section: 'projects', advice: 'Add what the budget app did for people.' }]);
    expect(parsed?.questions).toHaveLength(1);
  });

  test('accepting a rewrite changes exactly that text, accepting a skill adds it once', () => {
    const [summary, bullet, skill] = parsed?.suggestions ?? [];
    const withSummary = applySuggestion(base, summary);
    expect(withSummary?.summary).toBe('Developer who builds apps with React and SQL.');
    expect(withSummary?.experience).toEqual(base.experience);
    expect(applySuggestion(base, bullet)?.experience[0].bullets).toEqual(['Built the booking app with React', 'Fixed bugs reported by users']);
    const withSkill = applySuggestion(base, skill);
    expect(withSkill?.skills).toEqual(['React', 'SQL', 'Figma', 'App development']);
    expect(applySuggestion(withSkill ?? base, skill)).toBeNull();
  });

  test('a suggestion goes stale once the text under it changed', () => {
    const summary = parsed?.suggestions[0];
    if (!summary) throw new Error('missing');
    expect(applySuggestion({ ...base, summary: 'Edited by hand.' }, summary)).toBeNull();
  });

  test('refuses an answer that is not review-shaped', () => {
    expect(parseReview('nope', base)).toBeNull();
    expect(parseReview(JSON.stringify({ verdict: '' }), base)).toBeNull();
  });
});

describe('parseImproved', () => {
  test('returns bullets within the facts, the reason, and the questions', () => {
    const facts = 'Built the booking app with React. Fixed bugs. Served 40 classmates.';
    const parsed = parseImproved(JSON.stringify({ bullets: ['Built the booking app with React', 'Rolled out to 5000 users', 'Fixed bugs quickly'], reason: 'Starts with a verb.', questions: ['How many people used it?'] }), facts);
    expect(parsed?.bullets).toEqual(['Built the booking app with React', 'Fixed bugs quickly']);
    expect(parsed?.reason).toBe('Starts with a verb.');
    expect(parsed?.questions).toEqual(['How many people used it?']);
  });

  test('needs at least one bullet that survives', () => {
    expect(parseImproved(JSON.stringify({ bullets: ['Served 9000 people'], reason: 'x', questions: [] }), 'Fixed bugs.')).toBeNull();
    expect(parseImproved('x', 'y')).toBeNull();
  });
});

describe('parseImported', () => {
  test('reads the résumé the model copied out of a file, with ids for every entry', () => {
    const imported = parseImported(JSON.stringify({ name: 'Ben Reyes', skills: ['Excel'], experience: [{ title: 'Clerk', organization: 'Shop', bullets: ['Counted stock'] }], education: [{ title: 'Diploma' }, { organization: 'no title' }] }));
    expect(imported?.name).toBe('Ben Reyes');
    expect(imported?.experience[0].id).toBeTruthy();
    expect(imported?.education).toHaveLength(1);
  });

  test('a file with nothing readable in it is an error, not an empty profile', () => {
    expect(parseImported('{}')).toBeNull();
    expect(parseImported('not json')).toBeNull();
    expect(parseImported(JSON.stringify({ name: '', summary: '', skills: [], experience: [] }))).toBeNull();
  });
});
