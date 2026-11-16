import { describe, expect, test } from '@jest/globals';
import { inflateRawSync } from 'node:zlib';

import { parseContent } from './document';
import { buildDocx, extractDocxText, xmlText } from './docx';
import { defaultStyle } from './templates';
import { readZipEntry } from './zip';

const inflate = (data: Uint8Array) => new Uint8Array(inflateRawSync(data));
const read = async (zip: Uint8Array, name: string) => {
  const data = await readZipEntry(zip, name, inflate);
  return data ? new TextDecoder().decode(data) : null;
};

const content = parseContent({
  name: 'Ana & Cruz',
  headline: 'Developer',
  email: 'ana@example.com',
  summary: 'Builds <apps>.',
  skills: ['React', 'SQL'],
  experience: [{ title: 'Developer', organization: 'Acme', start: 'Mar 2021', current: true, bullets: ['Built the app', 'Fixed bugs'] }],
  achievements: ['Hackathon finalist'],
});

describe('xmlText', () => {
  test('escapes markup and drops characters XML forbids', () => {
    expect(xmlText('a & b < c > "d"\u0000\u0008\u000b')).toBe('a &amp; b &lt; c &gt; &quot;d&quot;');
  });
});

describe('buildDocx', () => {
  test('is a zip with the parts Word needs', async () => {
    const zip = buildDocx(content, defaultStyle('modern'));
    for (const part of ['[Content_Types].xml', '_rels/.rels', 'word/document.xml', 'word/numbering.xml', 'word/styles.xml', 'word/_rels/document.xml.rels']) expect(await read(zip, part)).not.toBeNull();
  });

  test('holds the résumé text, escaped, with real bullets', async () => {
    const xml = (await read(buildDocx(content, defaultStyle('modern')), 'word/document.xml')) ?? '';
    expect(xml).toContain('Ana &amp; Cruz');
    expect(xml).toContain('Builds &lt;apps&gt;.');
    expect(xml).toContain('Built the app');
    expect(xml).toContain('<w:numPr>');
    expect(xml).toContain('Mar 2021 – Present');
  });

  test('uses the paper size and the style\'s order, and leaves hidden sections out', async () => {
    const a4 = (await read(buildDocx(content, { ...defaultStyle('modern'), paper: 'a4' }), 'word/document.xml')) ?? '';
    expect(a4).toContain('w:w="11906"');
    const letter = (await read(buildDocx(content, defaultStyle('modern')), 'word/document.xml')) ?? '';
    expect(letter).toContain('w:w="12240"');
    const hidden = (await read(buildDocx(content, { ...defaultStyle('modern'), hidden: ['achievements'] }), 'word/document.xml')) ?? '';
    expect(hidden).not.toContain('Hackathon finalist');
    expect(letter.indexOf('Experience')).toBeGreaterThan(letter.indexOf('Skills'));
  });

  test('what we write, we can read back as text', async () => {
    const text = (await extractDocxText(buildDocx(content, defaultStyle('modern')), inflate)) ?? '';
    expect(text).toContain('Ana & Cruz');
    expect(text).toContain('Developer\tMar 2021 – Present');
    expect(text.split('\n').filter(Boolean).length).toBeGreaterThan(6);
  });
});

describe('extractDocxText', () => {
  test('returns null for something that is not a Word file', async () => {
    expect(await extractDocxText(new TextEncoder().encode('plain text'), inflate)).toBeNull();
  });
});
