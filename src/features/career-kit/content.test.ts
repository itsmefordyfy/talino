import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

import { getKitTemplate, KIT_FORMATS, KIT_KINDS, KIT_TEMPLATES, kitAssetName, kitDownloadName, kitFileKey, templatesOfKind } from './content';

const ASSETS = path.join(__dirname, '..', '..', '..', 'assets', 'career-kit');
const files = fs.readFileSync(path.join(__dirname, 'files.ts'), 'utf8');

describe('career kit content', () => {
  test('ids are unique and every kind has a template with three looks to pick from', () => {
    expect(new Set(KIT_TEMPLATES.map((template) => template.id)).size).toBe(KIT_TEMPLATES.length);
    for (const kind of KIT_KINDS) expect(templatesOfKind(kind).length).toBeGreaterThanOrEqual(1);
    for (const template of KIT_TEMPLATES) {
      expect(template.styles.length).toBeGreaterThanOrEqual(3);
      expect(new Set(template.styles.map((style) => style.id)).size).toBe(template.styles.length);
      expect(new Set(template.styles.map((style) => style.layout)).size).toBeGreaterThanOrEqual(2);
    }
  });

  test('every look has its real file on disk, of the right type, and a non-empty one', () => {
    for (const template of KIT_TEMPLATES) {
      for (const style of template.styles) {
        const file = path.join(ASSETS, kitAssetName(template, style));
        expect(fs.existsSync(file)).toBe(true);
        const bytes = fs.readFileSync(file);
        expect(bytes.length).toBeGreaterThan(5_000);
        // .docx and .pptx are zip archives: they start with "PK".
        expect(bytes.subarray(0, 2).toString('latin1')).toBe('PK');
      }
    }
  });

  test('the bundled-file list matches the looks exactly: nothing missing, nothing left over', () => {
    const listed = [...files.matchAll(/'([a-z0-9-]+)': require\('@\/assets\/career-kit\/([a-z0-9-]+\.(?:docx|pptx))'\)/g)].map((match) => [match[1], match[2]]);
    const expected = KIT_TEMPLATES.flatMap((template) => template.styles.map((style) => [kitFileKey(template, style), kitAssetName(template, style)]));
    expect(listed.sort()).toEqual(expected.sort());
    expect(fs.readdirSync(ASSETS).sort()).toEqual(expected.map(([, name]) => name).sort());
  });

  test('the formats are Word and PowerPoint, which Pages, Google Docs, Keynote, Slides and Canva all open', () => {
    expect(Object.keys(KIT_FORMATS).sort()).toEqual(['docx', 'pptx']);
    expect(KIT_FORMATS.docx.mimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(KIT_FORMATS.pptx.mimeType).toBe('application/vnd.openxmlformats-officedocument.presentationml.presentation');
    // Only the case-study deck is slides; everything else is a document.
    expect(KIT_TEMPLATES.filter((template) => template.format === 'pptx').map((template) => template.kind)).toEqual(['case-study']);
  });

  test('a download is named for what it is, and no two looks share a name', () => {
    const names = KIT_TEMPLATES.flatMap((template) => template.styles.map((style) => kitDownloadName(template, style)));
    expect(new Set(names).size).toBe(names.length);
    const resume = KIT_TEMPLATES[0];
    expect(kitDownloadName(resume, resume.styles[0])).toBe('Talino Resume - Sidebar.docx');
    expect(kitAssetName(resume, resume.styles[0])).toBe('resume-sidebar.docx');
  });

  test('a template is found by id', () => {
    expect(getKitTemplate('developer-resume')?.kind).toBe('resume');
    expect(getKitTemplate('nope')).toBeUndefined();
    expect(getKitTemplate(undefined)).toBeUndefined();
  });
});
