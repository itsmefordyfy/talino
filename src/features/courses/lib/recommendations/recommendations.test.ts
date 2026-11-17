import { describe, expect, test } from '@jest/globals';

import { recommendCourses } from './recommend';
import { scoreCourse } from './score';
import { signalsFrom } from './signals';
import { FACTS, finished, idsOf, profileOf, signalsFor } from './recommendations.test-helpers';

const rankOf = (ids: readonly string[], id: string): number => ids.indexOf(id);
const ranking = (signals = signalsFor({})) => idsOf(recommendCourses(signals, FACTS, { scope: 'everything' }));
const course = (id: string) => {
  const found = FACTS.find((facts) => facts.id === id);
  if (!found) throw new Error(`no course ${id}`);
  return found;
};

/** The beginner basics of the AI-first catalog: what an experienced engineer should not be sent back to. */
const BEGINNER_BASICS = ['starter', 'ai-coding-beginners', 'prompt-engineering-dev', 'understanding-ai-code', 'debugging-with-ai', 'ai-coding-practices', 'ai-dev-intro'];

describe('a complete beginner interested in web development', () => {
  const signals = signalsFor({ experience: 'complete-beginner', goals: ['from-scratch', 'frontend'], interests: ['html-css', 'javascript', 'react'] });
  const list = recommendCourses(signals, FACTS);
  const ids = idsOf(list);

  test('starts with coding with AI for complete beginners, prompt engineering and building a website', () => {
    for (const id of ['ai-coding-beginners', 'prompt-engineering-dev', 'build-website-ai']) expect(rankOf(ids, id)).toBeGreaterThanOrEqual(0);
    // Programming Fundamentals (added 2026-11-16) is a good early pick for someone who names JavaScript, so the three sit in the first twelve.
    expect(ids.slice(0, 12)).toEqual(expect.arrayContaining(['ai-coding-beginners', 'prompt-engineering-dev', 'build-website-ai']));
    expect(ids[0]).toBe('ai-coding-beginners');
  });

  test('Build a Website comes after the beginner course it builds on, which is shown as not yet done', () => {
    expect(rankOf(ids, 'build-website-ai')).toBeGreaterThan(rankOf(ids, 'ai-coding-beginners'));
    const website = list.find((entry) => entry.facts.id === 'build-website-ai');
    expect(website?.readiness.ready).toBe(false);
    expect(website?.readiness.missing).toEqual(['ai-coding-beginners']);
    // The road behind the full-stack course is named too, so the screen can show all of it.
    const fullstack = list.find((entry) => entry.facts.id === 'build-fullstack-ai');
    expect(fullstack?.readiness.missing).toEqual(['build-website-ai']);
    expect(fullstack?.readiness.blockedBy).toContain('ai-coding-beginners');
  });

  test('nothing advanced early, and no intermediate course ahead of the beginner courses they need', () => {
    const top = list.slice(0, 10);
    expect(top.some((entry) => entry.facts.level === 'advanced')).toBe(false);
    const firstIntermediate = list.findIndex((entry) => entry.facts.level === 'intermediate');
    const lastBeginnerStep = Math.max(...['ai-coding-beginners', 'build-website-ai'].map((id) => rankOf(ids, id)));
    expect(firstIntermediate).toBeGreaterThan(lastBeginnerStep);
  });

  test('every course carries typed reasons the screen can word', () => {
    const beginners = list.find((entry) => entry.facts.id === 'ai-coding-beginners');
    expect(beginners?.reasons.length).toBeGreaterThan(0);
    expect(beginners?.reasons.some((reason) => reason.kind === 'goal' || reason.kind === 'interest')).toBe(true);
  });
});

describe('a web developer (intermediate; frontend and full-stack; React, Next.js, TypeScript)', () => {
  const signals = signalsFor({ experience: 'intermediate', goals: ['frontend', 'full-stack'], interests: ['react', 'nextjs', 'typescript'] });
  const list = recommendCourses(signals, FACTS);
  const ids = idsOf(list);

  test('the website and full-stack courses, AI-assisted UI/UX, backend and deployment rank high', () => {
    for (const id of ['build-website-ai', 'build-fullstack-ai', 'ai-ui-ux', 'ai-backend-dev', 'ai-deployment']) expect(rankOf(ids, id)).toBeLessThan(12);
    expect(rankOf(ids, 'build-fullstack-ai')).toBeLessThan(3);
  });

  test('is not pushed back to the beginner basics', () => {
    for (const id of ['build-website-ai', 'build-fullstack-ai']) {
      expect(rankOf(ids, id)).toBeLessThan(rankOf(ids, 'ai-coding-beginners'));
      expect(rankOf(ids, id)).toBeLessThan(rankOf(ids, 'starter'));
    }
  });

  test('beginner-level prerequisites are assumed known, so Build a Website is ready and the SaaS course is one step away', () => {
    expect(list.find((entry) => entry.facts.id === 'build-website-ai')?.readiness.ready).toBe(true);
    expect(list.find((entry) => entry.facts.id === 'build-saas-ai')?.readiness.missing).toEqual(['build-fullstack-ai']);
  });

  test('a language they named is not a course: it lifts the courses that use it instead', () => {
    // No course is about React or TypeScript; the courses that list React as a tool are the ones lifted.
    expect(rankOf(ids, 'build-website-ai')).toBeLessThan(rankOf(ids, 'ai-dev-claude-code'));
    expect(FACTS.some((facts) => /^(react|typescript|next\.?js)\b/i.test(facts.course.title))).toBe(false);
  });
});

describe('a mobile learner', () => {
  const beginner = idsOf(recommendCourses(signalsFor({ experience: 'beginner', goals: ['mobile'], interests: ['react-native', 'expo', 'flutter'] }), FACTS));

  test('Build a Mobile App with AI is at the top, right after the beginner course it builds on', () => {
    expect(rankOf(beginner, 'build-mobile-app-ai')).toBeLessThan(3);
    expect(rankOf(beginner, 'ai-coding-beginners')).toBeLessThan(rankOf(beginner, 'build-mobile-app-ai'));
  });

  test('someone who already codes goes straight to it, ready', () => {
    const list = recommendCourses(signalsFor({ experience: 'intermediate', goals: ['mobile'], interests: ['react-native', 'expo'] }), FACTS);
    expect(list[0].facts.id).toBe('build-mobile-app-ai');
    expect(list[0].readiness.ready).toBe(true);
  });

  test('the foundation the mobile course rests on is suggested too (prepares-for), not hidden', () => {
    const list = recommendCourses(signalsFor({ experience: 'beginner', goals: ['mobile'], interests: ['react-native'] }), FACTS);
    const foundation = list.find((entry) => entry.facts.id === 'ai-coding-beginners');
    expect(foundation?.reasons.some((reason) => reason.kind === 'prepares-for')).toBe(true);
    expect(idsOf(list)).toContain('ai-coding-beginners');
  });
});

describe('an AI enthusiast (goal AI; GenAI, RAG, LLMs, AI apps)', () => {
  const profile = { experience: 'intermediate' as const, goals: ['ai' as const], interests: ['genai' as const, 'rag' as const, 'llm' as const, 'ai-apps' as const] };
  const list = recommendCourses(signalsFor(profile), FACTS);
  const ids = idsOf(list);

  test('Build an AI-Powered Application, agents and the AI coding tools all appear near the top', () => {
    for (const id of ['build-ai-app', 'agentic-coding', 'ai-dev-claude-code', 'ai-dev-codex']) expect(rankOf(ids, id)).toBeLessThan(10);
    expect(rankOf(ids, 'ai-dev-cursor')).toBeLessThan(20);
    expect(rankOf(ids, 'build-ai-app')).toBeLessThan(rankOf(ids, 'build-website-ai'));
    expect(rankOf(ids, 'agentic-coding')).toBeLessThan(rankOf(ids, 'build-mobile-app-ai'));
  });

  test('multi-agent workflows are demoted until agentic coding is done, but stay visible', () => {
    const multi = list.find((entry) => entry.facts.id === 'multi-agent-dev');
    expect(multi?.readiness).toMatchObject({ ready: false });
    expect(multi?.readiness.missing).toEqual(['agentic-coding']);
    expect(rankOf(ids, 'multi-agent-dev')).toBeGreaterThan(rankOf(ids, 'agentic-coding'));

    const ready = scoreCourse(course('multi-agent-dev'), signalsFor(profile, finished('agentic-coding')), FACTS);
    expect(ready.readiness.ready).toBe(true);
    expect(ready.score).toBeGreaterThan(multi?.score ?? 0);
    expect(ready.reasons.some((reason) => reason.kind === 'next-after')).toBe(true);
  });
});

describe('an experienced developer (professional; improve skills, interview prep)', () => {
  const list = recommendCourses(signalsFor({ experience: 'professional', goals: ['improve-skills', 'interview-prep'] }), FACTS);
  const ids = idsOf(list);

  test('the AI coding tools, context engineering, spec-driven development, agentic coding, architecture and improving existing apps rank above the beginner basics', () => {
    for (const id of ['ai-dev-claude-code', 'ai-dev-cursor', 'ai-dev-codex', 'context-engineering', 'spec-driven-dev', 'agentic-coding', 'ai-architecture', 'improve-existing-ai']) {
      for (const basic of BEGINNER_BASICS) expect(rankOf(ids, id)).toBeLessThan(rankOf(ids, basic));
    }
  });

  test('the advanced courses lead, and prerequisites they would know do not hold them back', () => {
    expect(rankOf(ids, 'agentic-coding')).toBeLessThan(5);
    for (const id of ['context-engineering', 'spec-driven-dev', 'ai-architecture']) expect(rankOf(ids, id)).toBeLessThan(12);
    expect(list.slice(0, 8).every((entry) => entry.facts.level !== 'beginner')).toBe(true);
    const advanced = recommendCourses(signalsFor({ experience: 'professional', goals: ['improve-skills'] }), FACTS).find((entry) => entry.facts.id === 'ai-dev-advanced');
    expect(advanced?.readiness.ready).toBe(true);
  });
});

describe('goals the catalog serves with a course of its own', () => {
  test('freelance goes to the freelancing course and teaching to the educator course', () => {
    expect(ranking(signalsFor({ experience: 'beginner', goals: ['freelance'] }))[0]).toBe('freelancer');
    expect(ranking(signalsFor({ experience: 'professional', goals: ['teach'] }))[0]).toBe('educator');
  });
});

describe('personalizing the order never hides the catalog', () => {
  test('asked for everything, every course comes back exactly once, whoever is asking', () => {
    const everyone = [
      signalsFor({}),
      signalsFor({ experience: 'complete-beginner', goals: ['mobile'] }),
      signalsFor({ experience: 'professional', goals: ['improve-skills'], interests: ['cybersecurity'] }, finished('ai-coding-beginners', 'build-website-ai')),
    ];
    for (const signals of everyone) {
      const all = recommendCourses(signals, FACTS, { scope: 'everything' });
      expect(all).toHaveLength(FACTS.length);
      expect(new Set(idsOf(all))).toEqual(new Set(FACTS.map((facts) => facts.id)));
    }
  });

  test('"what to take next" leaves out only what is completed (and what is started, unless asked)', () => {
    const signals = signalsFor({ experience: 'beginner', goals: ['frontend'] }, [...finished('ai-coding-beginners'), { courseId: 'prompt-engineering-dev', fraction: 0.4, complete: false, started: true, quizAverage: null, lessonsDone: 2 }]);
    const next = idsOf(recommendCourses(signals, FACTS));
    expect(next).not.toContain('ai-coding-beginners');
    expect(next).not.toContain('prompt-engineering-dev');
    expect(next).toHaveLength(FACTS.length - 2);
    expect(idsOf(recommendCourses(signals, FACTS, { includeStarted: true }))).toContain('prompt-engineering-dev');
    const all = recommendCourses(signals, FACTS, { scope: 'everything' });
    expect(all.map((entry) => entry.status).slice(-1)).toEqual(['completed']);
    expect(all).toHaveLength(FACTS.length);
  });

  test('a course with unmet prerequisites is demoted, never removed, for every kind of learner', () => {
    for (const experience of ['complete-beginner', 'intermediate', 'professional'] as const) {
      const all = recommendCourses(signalsFor({ experience, goals: ['ai', 'full-stack'] }), FACTS, { scope: 'everything' });
      // An advanced course needs the advanced one before it for everyone; an intermediate one only for those not yet at that level.
      const multi = all.find((entry) => entry.facts.id === 'multi-agent-dev');
      expect(multi).toBeDefined();
      expect(multi?.readiness.ready).toBe(false);
    }
    const all = recommendCourses(signalsFor({ experience: 'beginner', goals: ['full-stack'] }), FACTS, { scope: 'everything' });
    expect(all.find((entry) => entry.facts.id === 'build-saas-ai')?.readiness.ready).toBe(false);
  });

  test('a limit only truncates the ranking', () => {
    expect(recommendCourses(signalsFor({ goals: ['ai'] }), FACTS, { limit: 3 })).toHaveLength(3);
  });
});

describe('for a beginner a course is never listed before the foundation it builds on', () => {
  test.each([['complete-beginner'], ['beginner']] as const)('%s', (experience) => {
    for (const goals of [['frontend'], ['full-stack', 'build-startup'], ['ai'], ['backend']] as const) {
      const ids = idsOf(recommendCourses(signalsFor({ experience, goals: [...goals] }), FACTS));
      for (const facts of FACTS) {
        for (const prerequisite of facts.prerequisites) {
          if (ids.includes(prerequisite) && ids.includes(facts.id)) expect(rankOf(ids, prerequisite)).toBeLessThan(rankOf(ids, facts.id));
        }
      }
    }
  });

  test('a more experienced learner is not reordered that way: the course they want leads', () => {
    const ids = idsOf(recommendCourses(signalsFor({ experience: 'intermediate', goals: ['full-stack'], interests: ['react'] }), FACTS));
    expect(rankOf(ids, 'build-fullstack-ai')).toBeLessThan(rankOf(ids, 'ai-coding-beginners'));
  });
});

describe('how the signals move the ranking', () => {
  const frontend = { experience: 'complete-beginner' as const, goals: ['frontend' as const, 'full-stack' as const] };

  test('finishing the beginner course and Build a Website opens the full-stack course, by goals', () => {
    const before = ranking(signalsFor(frontend));
    const afterSignals = signalsFor(frontend, finished('ai-coding-beginners', 'build-website-ai'));
    const after = recommendCourses(afterSignals, FACTS);
    const ids = idsOf(after);
    expect(ids).not.toContain('ai-coding-beginners');
    expect(ids).not.toContain('build-website-ai');
    expect(ids.indexOf('build-fullstack-ai')).toBeLessThan(4);
    expect(after.find((entry) => entry.facts.id === 'build-fullstack-ai')?.reasons).toContainEqual({ kind: 'next-after', courseId: expect.any(String) });
    expect(rankOf(ids, 'build-fullstack-ai')).toBeLessThan(rankOf(before, 'build-fullstack-ai'));
    // The same two courses lead a backend-minded learner to the backend course first, not to the full-stack one.
    const backend = idsOf(recommendCourses(signalsFor({ experience: 'complete-beginner', goals: ['backend'] }, finished('ai-coding-beginners', 'build-website-ai')), FACTS));
    expect(backend[0]).toMatch(/^ai-(api-integration|backend-dev)$/);
    expect(rankOf(backend, 'ai-backend-dev')).toBeLessThan(rankOf(backend, 'build-fullstack-ai'));
  });

  test('completing courses raises the level the learner is treated as', () => {
    const base = signalsFor({ experience: 'complete-beginner', goals: ['software-engineer'] });
    const experienced = signalsFor({ experience: 'complete-beginner', goals: ['software-engineer'] }, finished('ai-coding-beginners', 'prompt-engineering-dev', 'understanding-ai-code'));
    expect(scoreCourse(course('build-fullstack-ai'), experienced, FACTS).score).toBeGreaterThan(scoreCourse(course('build-fullstack-ai'), base, FACTS).score);
  });

  test('a passed skill check raises the starting point', () => {
    const declared = signalsFor({ experience: 'complete-beginner', goals: ['frontend'] });
    const checked = signalsFor({ experience: 'complete-beginner', goals: ['frontend'], assessment: { level: 'strong', correct: 7, total: 8, at: '2026-11-14' } });
    expect(scoreCourse(course('build-fullstack-ai'), checked, FACTS).score).toBeGreaterThan(scoreCourse(course('build-fullstack-ai'), declared, FACTS).score);
  });

  test('a weak quiz average favours the basics of that category, a strong one the next level', () => {
    const profile = { experience: 'beginner' as const, goals: ['software-engineer' as const] };
    const withQuiz = (average: number) => signalsFrom(profileOf(profile), [{ courseId: 'mini-ai-qa', fraction: 1, complete: true, started: true, quizAverage: average, lessonsDone: 6 }], { facts: FACTS });
    const weak = withQuiz(0.4);
    const strong = withQuiz(0.95);
    expect(weak.quizAverageByCategory?.get('ai-workflows')).toBeCloseTo(0.4);
    const basics = course('ai-ui-ux');
    const nextLevel = course('ai-code-review');
    expect(basics.category).toBe('ai-workflows');
    expect(nextLevel.category).toBe('ai-workflows');
    expect(basics.level).toBe('beginner');
    expect(nextLevel.level).not.toBe('beginner');
    expect(scoreCourse(basics, weak, FACTS).score).toBeGreaterThan(scoreCourse(basics, strong, FACTS).score);
    expect(scoreCourse(nextLevel, strong, FACTS).score).toBeGreaterThan(scoreCourse(nextLevel, weak, FACTS).score);
    expect(scoreCourse(basics, weak, FACTS).reasons).toContainEqual({ kind: 'quiz', category: 'ai-workflows', trend: 'strengthen' });
    expect(scoreCourse(nextLevel, strong, FACTS).reasons).toContainEqual({ kind: 'quiz', category: 'ai-workflows', trend: 'ready' });
    // Courses in other categories are untouched by it.
    expect(scoreCourse(course('build-website-ai'), weak, FACTS).score).toBe(scoreCourse(course('build-website-ai'), strong, FACTS).score);
  });

  test('technologies the learner explores lift the courses that use them', () => {
    const base = signalsFor({ experience: 'intermediate', goals: ['software-engineer'] });
    const curious = signalsFor({ experience: 'intermediate', goals: ['software-engineer'] }, [], { exploredTechnologies: { expo: 4 } });
    expect(scoreCourse(course('build-mobile-app-ai'), curious, FACTS).score).toBeGreaterThan(scoreCourse(course('build-mobile-app-ai'), base, FACTS).score);
    expect(scoreCourse(course('build-mobile-app-ai'), curious, FACTS).reasons).toContainEqual({ kind: 'explored', technology: 'expo' });
    expect(scoreCourse(course('ai-dev-claude-code'), curious, FACTS).score).toBe(scoreCourse(course('ai-dev-claude-code'), base, FACTS).score);
  });

  test('very little daily time gives short courses a small lift', () => {
    const profile = { experience: 'beginner' as const, goals: ['ai' as const] };
    const short = course('mini-ai-engineering');
    expect(short.minutes).toBeLessThanOrEqual(120);
    const tight = scoreCourse(short, signalsFor({ ...profile, dailyMinutes: 5 }), FACTS);
    const roomy = scoreCourse(short, signalsFor({ ...profile, dailyMinutes: 60 }), FACTS);
    expect(tight.score).toBeGreaterThan(roomy.score);
    expect(tight.score - roomy.score).toBeLessThan(1.5);
  });

  test('changing the interests changes the order and nothing else about the learner', () => {
    const progress = [...finished('ai-coding-beginners'), { courseId: 'prompt-engineering-dev', fraction: 0.5, complete: false, started: true, quizAverage: null, lessonsDone: 3 }];
    const web = signalsFor({ experience: 'beginner', goals: ['software-engineer'], interests: ['react', 'nextjs'] }, progress);
    const data = signalsFor({ experience: 'beginner', goals: ['software-engineer'], interests: ['python', 'sql'] }, progress);
    expect(idsOf(recommendCourses(web, FACTS)).slice(0, 5)).not.toEqual(idsOf(recommendCourses(data, FACTS)).slice(0, 5));
    expect([...web.completed]).toEqual([...data.completed]);
    expect([...web.started]).toEqual([...data.started]);
  });
});

describe('signalsFrom', () => {
  test('reads completed and started courses and averages quizzes per category by lessons done', () => {
    const signals = signalsFrom(
      profileOf({ experience: 'beginner', goals: ['ai'] }),
      [
        { courseId: 'ai-coding-beginners', fraction: 1, complete: true, started: true, quizAverage: 0.9, lessonsDone: 10 },
        { courseId: 'prompt-engineering-dev', fraction: 0.3, complete: false, started: true, quizAverage: 0.5, lessonsDone: 5 },
        { courseId: 'build-website-ai', fraction: 0, complete: false, started: false, quizAverage: null, lessonsDone: 0 },
      ],
      { facts: FACTS, lastActivityAt: { 'prompt-engineering-dev': '2026-11-13T10:00:00Z' } },
    );
    expect([...signals.completed]).toEqual(['ai-coding-beginners']);
    expect(signals.started.get('prompt-engineering-dev')).toEqual({ fraction: 0.3, lastActivityAt: '2026-11-13T10:00:00Z' });
    expect(signals.started.has('build-website-ai')).toBe(false);
    // (0.9 * 10 + 0.5 * 5) / 15, both courses being in AI coding fundamentals
    expect(signals.quizAverageByCategory?.get('ai-coding-fundamentals')).toBeCloseTo(11.5 / 15);
    expect(signals.assessmentLevel).toBeNull();
  });
});
