import { describe, expect, test } from '@jest/globals';

import { TALI_MOODS } from '@/components/brand/tali';
import { CoverPalettes } from '@/constants/theme';

import { COURSES } from '../content';
import { CATALOG_SYLLABUS } from '../content/catalog/syllabus';
import { COURSE_COVERS, COVER_SCENES, coverFor } from './covers';

describe('course covers', () => {
  test('every course in the catalog and syllabus has its own cover', () => {
    for (const course of COURSES) expect(COURSE_COVERS[course.id]).toBeDefined();
    for (const entry of CATALOG_SYLLABUS) expect(COURSE_COVERS[entry.id]).toBeDefined();
  });

  test('every cover uses a real scene, palette and pose', () => {
    for (const art of Object.values(COURSE_COVERS)) {
      expect(COVER_SCENES).toContain(art.scene);
      expect(Object.keys(CoverPalettes)).toContain(art.palette);
      expect(TALI_MOODS).toContain(art.pose);
    }
  });

  test('covers name no course that does not exist', () => {
    // A syllabus course gets its cover before its lessons are written, so a cover may name a planned course too.
    const ids = new Set([...COURSES.map((course) => course.id), ...CATALOG_SYLLABUS.map((entry) => entry.id)]);
    for (const id of Object.keys(COURSE_COVERS)) expect(ids.has(id)).toBe(true);
  });

  test('neighbours in the catalog never share both scene and palette', () => {
    const arts = COURSES.map((course) => coverFor(course));
    for (let index = 1; index < arts.length; index += 1) {
      const same = arts[index].scene === arts[index - 1].scene && arts[index].palette === arts[index - 1].palette;
      expect(same).toBe(false);
    }
  });

  test('a course without a cover falls back to its kind', () => {
    expect(coverFor({ id: 'new-mini', kind: 'mini' }).scene).toBe('flow');
    expect(coverFor({ id: 'unknown', kind: 'other' }).scene).toBe('code');
  });
});
