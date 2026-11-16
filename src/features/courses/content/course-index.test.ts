import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

import { COURSES } from './index';
import { CAREER_COURSE_INDEX, COURSE_INDEX, getCourseIndex } from './course-index';

const derived = COURSES.map((course) => ({ id: course.id, kind: course.kind, title: course.title, projects: course.projects.map((project) => ({ id: project.id, title: project.title })) }));

describe('the server’s course index', () => {
  test('matches the catalog (run UPDATE_COURSE_INDEX=1 npx jest course-index to regenerate it)', () => {
    if (process.env.UPDATE_COURSE_INDEX === '1') {
      const file = path.join(__dirname, 'course-index.data.ts');
      fs.writeFileSync(
        file,
        `// Generated from the catalog: run \`UPDATE_COURSE_INDEX=1 npx jest course-index\` after adding or renaming a course or project.\nimport type { CourseIndexEntry } from './course-index';\n\nexport const COURSE_INDEX_DATA: readonly CourseIndexEntry[] = ${JSON.stringify(derived, null, 2)};\n`,
      );
      return;
    }
    expect(COURSE_INDEX).toEqual(derived);
  });

  test('finds a course by id and lists the career courses', () => {
    expect(getCourseIndex('starter')?.kind).toBe('starter');
    expect(getCourseIndex('nope')).toBeUndefined();
    expect(CAREER_COURSE_INDEX.map((course) => course.id)).toEqual(COURSES.filter((course) => course.kind === 'career').map((course) => course.id));
  });
});
