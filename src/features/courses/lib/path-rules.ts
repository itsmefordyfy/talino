import { AI_DEV_SYLLABUS, AI_DEV_TOOL_COURSES } from '../content/ai-dev/syllabus';
import type { Course, Lesson, LessonBlock } from '../content/types';

/**
 * Rules for a learning-path course, on top of the content rules every lesson already meets
 * (`lesson-structure.ts`): it follows its syllabus (one lesson per topic, its level and place in the
 * path), every lesson has an activity, and every statement about a product carries the date it was
 * checked and an official source. A tool course (ChatGPT, Claude, Claude Code, Cursor, Codex) has such
 * a note in every lesson, because almost everything in it can change with the product.
 */

/** Documentation hosts a version note may cite: the vendors' own docs and help centres, and the standards they implement. */
const OFFICIAL_HOSTS = [
  'anthropic.com',
  'claude.com',
  'claude.ai',
  'openai.com',
  'chatgpt.com',
  'cursor.com',
  'github.com',
  'github.blog',
  'google.dev',
  'google.com',
  'modelcontextprotocol.io',
  'git-scm.com',
  'owasp.org',
  'stripe.com',
  'react.dev',
  'reactnative.dev',
  'expo.dev',
  'nodejs.org',
  'expressjs.com',
  'developer.mozilla.org',
  'sqlite.org',
  'postgresql.org',
  'jestjs.io',
  'vitest.dev',
  'playwright.dev',
  'testing-library.com',
  'semver.org',
  'conventionalcommits.org',
  'choosealicense.com',
  'spdx.org',
  'nist.gov',
  // The wider catalog (2026-11-14): languages, frameworks, platforms, standards and security bodies, official pages only.
  'python.org',
  'pytest.org',
  'pypi.org',
  'typescriptlang.org',
  'ecma-international.org',
  'tc39.es',
  'nextjs.org',
  'vercel.com',
  'tailwindcss.com',
  'reactrouter.com',
  'tanstack.com',
  'vite.dev',
  'vitejs.dev',
  'zod.dev',
  'eslint.org',
  'npmjs.com',
  'flutter.dev',
  'dart.dev',
  'pub.dev',
  'microsoft.com',
  'dotnet.microsoft.com',
  'nuget.org',
  'mongodb.com',
  'supabase.com',
  'firebase.google.com',
  'firebase.com',
  'developers.google.com',
  'cloud.google.com',
  'docker.com',
  'kubernetes.io',
  'amazon.com',
  'cloudflare.com',
  'w3.org',
  'whatwg.org',
  'web.dev',
  'ietf.org',
  'rfc-editor.org',
  'openapis.org',
  'swagger.io',
  'json-schema.org',
  'graphql.org',
  'postman.com',
  'scrumguides.org',
  'scrum.org',
  'agilemanifesto.org',
  'atlassian.com',
  'mitre.org',
  'cisa.gov',
  'openid.net',
  'oauth.net',
  'fidoalliance.org',
  'passkeys.dev',
  'letsencrypt.org',
  'redis.io',
  'prisma.io',
  'huggingface.co',
  'pinecone.io',
  'qdrant.tech',
  'trychroma.com',
  'langchain.com',
  'langchain-ai.github.io',
  'llamaindex.ai',
  'apple.com',
  'android.com',
  'martinfowler.com',
  'gnu.org',
  'iso.org',
  'bir.gov.ph',
  'irs.gov',
  'chrome.com',
  'swmansion.com',
  'webkit.org',
  'dora.dev',
  'lovable.dev',
  'capacitorjs.com',
  'bolt.new',
  'replit.com',
  'v0.app',
  'kiro.dev',
  'formspree.io',
  'github.github.io',
  'mozilla.org',
];

/** True for an https link on an official documentation host (or a subdomain of one). */
export function isOfficialSource(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  const host = parsed.hostname.toLowerCase();
  return OFFICIAL_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

type VersionBlock = Extract<LessonBlock, { type: 'version' }>;

export function versionBlocks(lesson: Lesson): VersionBlock[] {
  return lesson.body.filter((block): block is VersionBlock => block.type === 'version');
}

const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

/** Everything wrong with a path course, in plain words; empty when it can ship. `today` is injectable for tests. */
export function pathCourseProblems(course: Course, today: Date = new Date()): string[] {
  const problems: string[] = [];
  const index = AI_DEV_SYLLABUS.findIndex((entry) => entry.id === course.id);
  const syllabus = AI_DEV_SYLLABUS[index];
  if (!syllabus) return [`${course.id} is not in the path syllabus`];

  if (course.kind !== 'path') problems.push(`${course.id} must be a path course`);
  if (course.level !== syllabus.level) problems.push(`${course.id} level must be ${syllabus.level}`);
  if (course.path?.id !== 'ai-dev' || course.path.order !== index + 1) problems.push(`${course.id} path order must be ${index + 1}`);
  if (course.lessons.length !== syllabus.topics.length) problems.push(`${course.id} needs ${syllabus.topics.length} lessons (one per syllabus topic), has ${course.lessons.length}`);
  if (course.projects.length < 1) problems.push(`${course.id} needs at least one project`);

  const toolCourse = !!AI_DEV_TOOL_COURSES[course.id];
  // A checked date is a calendar date with no time zone: an author in Manila (UTC+8) writes today's date while it is
  // still yesterday in UTC, so allow one day of leeway; anything later than that is a mistake.
  const latest = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) + 2 * 86_400_000;
  for (const lesson of course.lessons) {
    if (!lesson.body.some((block) => block.type === 'activity')) problems.push(`${lesson.id} has no activity`);
    const notes = versionBlocks(lesson);
    if (toolCourse && notes.length === 0) problems.push(`${lesson.id} needs a version note (a tool course states product facts in every lesson)`);
    for (const note of notes) {
      if (!isDate(note.checked)) problems.push(`${lesson.id} version note has no valid checked date`);
      else if (Date.parse(`${note.checked}T00:00:00Z`) >= latest) problems.push(`${lesson.id} version note is dated in the future`);
      if (note.sources.length === 0 || note.sources.some((source) => !isOfficialSource(source.url))) problems.push(`${lesson.id} version note must cite only official https documentation`);
      if (note.text.trim().length < 20) problems.push(`${lesson.id} version note says too little`);
    }
  }
  if (!toolCourse && course.lessons.every((lesson) => versionBlocks(lesson).length === 0)) problems.push(`${course.id} states no checked product facts at all`);
  return problems;
}
