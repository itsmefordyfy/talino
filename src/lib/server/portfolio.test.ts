import { describe, expect, test } from '@jest/globals';

import { cleanPortfolio, MAX_IMAGES_PER_PROJECT, MAX_IMAGES_TOTAL, portfolioDocument, portfolioImage, portfolioPhoto } from './portfolio';

const jpeg = (seed = 'a') => `/9j/${seed.repeat(400)}`;
const base = { name: 'Ana Cruz', headline: 'Developer', about: 'Hi.', location: 'Manila', links: [{ label: 'GitHub', url: 'https://github.com/ana' }] };

describe('cleanPortfolio projects', () => {
  test('keeps the details, the https links and the pictures; drops what the page must not show', () => {
    const cleaned = cleanPortfolio({
      ...base,
      projects: [
        {
          title: ' Queue   app ',
          summary: 'A queue app',
          description: 'One.\n\n\n\nTwo.',
          role: 'Solo',
          tech: ['Expo', '', 'Supabase'],
          url: 'https://queue.example.com',
          repoUrl: 'javascript:alert(1)',
          images: [jpeg(), 'data:image/png;base64,AAAA', '<script>', jpeg('b')],
        },
        { title: '' },
      ],
    });
    expect(cleaned.projects).toHaveLength(1);
    expect(cleaned.projects[0]).toMatchObject({ title: 'Queue app', description: 'One.\n\nTwo.', tech: ['Expo', 'Supabase'], url: 'https://queue.example.com/', repoUrl: '' });
    expect(cleaned.projects[0].images).toEqual([jpeg(), jpeg('b')]);
  });

  test('caps pictures per project and in total, and refuses an oversized one', () => {
    const many = Array.from({ length: 8 }, () => jpeg());
    const cleaned = cleanPortfolio({ ...base, projects: Array.from({ length: 10 }, (_, index) => ({ title: `P${index}`, images: many })) });
    expect(cleaned.projects[0].images).toHaveLength(MAX_IMAGES_PER_PROJECT);
    expect(cleaned.projects.reduce((total, project) => total + project.images.length, 0)).toBe(MAX_IMAGES_TOTAL);
    expect(cleanPortfolio({ ...base, projects: [{ title: 'Big', images: [`/9j/${'A'.repeat(300_000)}`] }] }).projects[0].images).toEqual([]);
  });

  test('an older saved page without the new fields still reads whole', () => {
    const cleaned = cleanPortfolio({ ...base, projects: [{ title: 'Old', course: 'AI', summary: 's', url: '' }] });
    expect(cleaned.projects[0]).toMatchObject({ description: '', role: '', tech: [], repoUrl: '', images: [] });
  });
});

describe('portfolioImage', () => {
  test('gives a picture back as bytes, and null for one that is not there', () => {
    const data = cleanPortfolio({ ...base, projects: [{ title: 'P', images: [jpeg()] }] });
    expect(portfolioImage(data, 0, 0)?.length).toBeGreaterThan(100);
    expect(portfolioImage(data, 0, 1)).toBeNull();
    expect(portfolioImage(data, 3, 0)).toBeNull();
  });
});

describe('portfolioDocument', () => {
  const data = cleanPortfolio({ ...base, about: 'I <build> apps.', skills: ['React'], projects: [{ title: 'Queue <app>', summary: 'Short', tech: ['Expo'], url: 'https://q.example.com', repoUrl: 'https://github.com/a/q', images: [jpeg(), jpeg('b')] }, { title: 'No pictures' }] });
  const html = portfolioDocument(data, 'ana-1234', '99');

  test('escapes what the learner wrote', () => {
    expect(html).toContain('I &lt;build&gt; apps.');
    expect(html).toContain('Queue &lt;app&gt;');
    expect(html).not.toContain('<build>');
  });

  test('shows screenshots from the image route, with a version, and a placeholder when there are none', () => {
    expect(html).toContain('/p/ana-1234/img/0-0.jpg?v=99');
    expect(html).toContain('/p/ana-1234/img/0-1.jpg?v=99');
    expect(html).toContain('class="ph"');
    expect(html).not.toContain('/9j/');
  });

  test('has live and source buttons for a project that has the links, and the profile links in the header', () => {
    expect(html).toContain('Live demo');
    expect(html).toContain('View my work');
    expect(html).toContain('Source code');
    expect(html).toContain('https://github.com/ana');
  });
});

describe('portfolioDocument as a website', () => {
  const data = cleanPortfolio({ ...base, skills: ['React'], projects: [{ title: 'One', images: [jpeg(), jpeg('b')] }, { title: 'Two' }], certificates: [{ title: 'AI Developer', issued: 'Nov 2026' }] });
  const html = portfolioDocument(data, 'ana-1234', '7');

  test('is a whole document with a bar linking to the sections that exist', () => {
    expect(html.startsWith('<!doctype html>')).toBe(true);
    for (const id of ['about', 'projects', 'skills', 'certificates']) expect(html).toContain(`href="#${id}"`);
    expect(html).not.toContain('Talino AI');
  });

  test('features the first project, with a gallery of thumbnails only when it has several pictures', () => {
    expect(html).toContain('class="proj feature"');
    expect(html).toContain('class="thumbs"');
    expect(portfolioDocument(cleanPortfolio({ ...base, projects: [{ title: 'Solo', images: [jpeg()] }] }), 's-1234', '1')).not.toContain('class="thumbs"');
  });

  test('leaves out sections it has nothing for', () => {
    const bare = portfolioDocument(cleanPortfolio({ name: 'Ana Cruz' }), 'a-1234', '1');
    for (const id of ['about', 'projects', 'skills', 'certificates']) expect(bare).not.toContain(`href="#${id}"`);
  });
});

describe('the profile picture on the portfolio', () => {
  const photo = `/9j/${'B'.repeat(400)}`;

  test('is kept only as a JPEG within the size cap, otherwise empty', () => {
    expect(cleanPortfolio({ ...base, photo }).photo).toBe(photo);
    for (const bad of ['', 'data:image/png;base64,AAAA', `/9j/${'A'.repeat(130_000)}`, '/9j/<x>', 42]) expect(cleanPortfolio({ ...base, photo: bad }).photo).toBe('');
    expect(cleanPortfolio(base).photo).toBe('');
  });

  test('is served as bytes, or null when the page has none', () => {
    expect(portfolioPhoto(cleanPortfolio({ ...base, photo }))?.length).toBeGreaterThan(100);
    expect(portfolioPhoto(cleanPortfolio(base))).toBeNull();
  });

  test('takes the place of the initials in the hero, from its own address, and the page needs no picture to render', () => {
    const withPhoto = portfolioDocument(cleanPortfolio({ ...base, photo }), 'ana-1234', '5');
    expect(withPhoto).toContain('/p/ana-1234/img/photo.jpg?v=5');
    expect(withPhoto).toContain('alt="Photo of Ana Cruz"');
    expect(withPhoto).not.toContain('/9j/');
    const without = portfolioDocument(cleanPortfolio(base), 'ana-1234', '5');
    expect(without).not.toContain('photo.jpg');
    expect(without).toContain('>AC<');
  });
});
