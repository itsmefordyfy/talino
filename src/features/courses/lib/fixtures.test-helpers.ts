import type { Course, Lesson } from '../content/types';

/** A small course for tests: `lessons` lessons of 3 questions, projects after the given days. */
export function makeCourse(id: string, lessons: number, projectDays: number[] = [], kind: Course['kind'] = 'career'): Course {
  const lessonList: Lesson[] = Array.from({ length: lessons }, (_, index) => {
    const day = index + 1;
    const lessonId = `${id}-${String(day).padStart(2, '0')}`;
    return {
      id: lessonId,
      day,
      title: `Lesson ${day}`,
      summary: '',
      minutes: 15,
      skills: [day % 2 === 0 ? 'even' : 'odd'],
      body: [{ type: 'paragraph', text: 'x' }],
      quiz: [1, 2, 3].map((n) => ({ id: `${lessonId}-q${n}`, prompt: '?', choices: ['a', 'b', 'c'], answer: 0, explanation: '' })),
      task: { title: 't', steps: ['s'], minutes: 5 },
    };
  });
  return {
    id,
    kind,
    title: id,
    tagline: '',
    description: '',
    finishLine: [],
    audiences: ['fresh-grad'],
    skills: [
      { id: 'odd', label: 'Odd' },
      { id: 'even', label: 'Even' },
    ],
    lessons: lessonList,
    projects: projectDays.map((day, index) => ({
      id: `${id}-p${index + 1}`,
      title: 'P',
      summary: '',
      outcome: '',
      unlockAfterDay: day,
      steps: [{ id: `${id}-p${index + 1}-s1`, text: 'do it' }],
      submission: { kind: 'url', label: 'Link', placeholder: '', hint: '' },
      rubric: ['works'],
    })),
    icon: 'code',
    updated: '2026-11-13',
  };
}
