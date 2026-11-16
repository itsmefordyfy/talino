import { describe, expect, test } from '@jest/globals';

import { templateValues, type ValueSources } from './values';

const sources: ValueSources = {
  name: ' Ana ',
  headline: 'Junior developer',
  skills: ['React', 'SQL', 'Prompting', 'APIs', 'Git', 'Testing'],
  talinoProjects: [
    { title: 'Prompt kit', link: null },
    { title: 'AI app', link: 'https://app.example.com' },
  ],
  ownProjects: ['Own site'],
  portfolioLink: 'https://talino.example/p/ana',
  course: 'AI Developer',
};

describe('templateValues', () => {
  test('the newest Talino project leads; skills are capped at five', () => {
    expect(templateValues(sources)).toEqual({
      name: 'Ana',
      headline: 'Junior developer',
      skills: 'React, SQL, Prompting, APIs and Git',
      topProject: 'AI app',
      topProjectLink: 'https://app.example.com',
      portfolioLink: 'https://talino.example/p/ana',
      course: 'AI Developer',
    });
  });

  test('without Talino projects the learner’s own is used; blanks are null', () => {
    const values = templateValues({ ...sources, name: '', headline: '  ', skills: [], talinoProjects: [], portfolioLink: null, course: null });
    expect(values).toEqual({ name: null, headline: null, skills: null, topProject: 'Own site', topProjectLink: null, portfolioLink: null, course: null });
  });
});
