import { describe, expect, test } from '@jest/globals';
import { inflateRawSync } from 'node:zlib';

import { buildDocx } from './docx';
import { parseContent } from './document';
import { docHtml, photoOf } from './render';
import { defaultStyle, parseStyle } from './templates';
import { readZipEntry } from './zip';

const photo = `/9j/${'A'.repeat(400)}`;
const content = parseContent({ name: 'Ana Cruz', headline: 'Developer', summary: 'Builds apps.', photo });
const inflate = async (packed: Uint8Array) => new Uint8Array(inflateRawSync(packed));

describe('the profile picture on a résumé', () => {
  test('is kept only as a JPEG of a size the profile holds', () => {
    expect(content.photo).toBe(photo);
    expect(parseContent({ photo: 'data:image/png;base64,AAAA' }).photo).toBeUndefined();
    expect(parseContent({ photo: `/9j/${'A'.repeat(130_000)}` }).photo).toBeUndefined();
    expect(parseContent({ photo: '/9j/<script>' }).photo).toBeUndefined();
  });

  test('is off unless the style asks, and an older style reads as off', () => {
    expect(defaultStyle('modern').photo).toBe(false);
    expect(parseStyle({ template: 'modern' }).photo).toBe(false);
    expect(parseStyle({ template: 'modern', photo: true }).photo).toBe(true);
    expect(photoOf(content, defaultStyle('modern'))).toBe('');
    expect(photoOf(content, { ...defaultStyle('modern'), photo: true })).toBe(photo);
    expect(photoOf(parseContent({ name: 'Ana' }), { ...defaultStyle('modern'), photo: true })).toBe('');
  });

  test('prints in the PDF header only when asked: centred templates put it above the name, the others beside it', () => {
    expect(docHtml(content, defaultStyle('modern'))).not.toContain('<img');
    const left = docHtml(content, { ...defaultStyle('modern'), photo: true });
    expect(left).toContain('<header class="with-photo">');
    expect(left).toContain('data:image/jpeg;base64,');
    expect(left.indexOf('<h1>')).toBeLessThan(left.indexOf('<img'));
    const centred = docHtml(content, { ...defaultStyle('professional'), photo: true });
    expect(centred).not.toContain('<header class="with-photo"');
    expect(centred.indexOf('<img')).toBeLessThan(centred.indexOf('<h1>'));
  });

  test('goes into the Word file as a real image with its relationship, and is absent when off', async () => {
    const withPhoto = buildDocx(content, { ...defaultStyle('modern'), photo: true });
    const media = await readZipEntry(withPhoto, 'word/media/photo.jpg', inflate);
    expect(media?.length).toBeGreaterThan(100);
    const document = new TextDecoder().decode((await readZipEntry(withPhoto, 'word/document.xml', inflate)) ?? new Uint8Array());
    expect(document).toContain('r:embed="rId3"');
    const rels = new TextDecoder().decode((await readZipEntry(withPhoto, 'word/_rels/document.xml.rels', inflate)) ?? new Uint8Array());
    expect(rels).toContain('media/photo.jpg');

    const without = buildDocx(content, defaultStyle('modern'));
    expect(await readZipEntry(without, 'word/media/photo.jpg', inflate)).toBeNull();
    expect(new TextDecoder().decode((await readZipEntry(without, 'word/document.xml', inflate)) ?? new Uint8Array())).not.toContain('r:embed');
  });
});
