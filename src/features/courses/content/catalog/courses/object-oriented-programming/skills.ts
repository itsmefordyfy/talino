import type { Course } from '../../../types';

/** The course's skill meter. Every lesson's `skills` are ids from here (the first is its main skill), and every id is taught by some lesson. */
export const SKILLS: Course['skills'] = [
  { id: 'oop-thinking', label: 'Thinking in objects' },
  { id: 'classes-objects', label: 'Classes, objects and constructors' },
  { id: 'encapsulation', label: 'Encapsulation and data hiding' },
  { id: 'abstraction', label: 'Abstraction and interfaces' },
  { id: 'inheritance', label: 'Inheritance and polymorphism' },
  { id: 'composition', label: 'Composition and object relationships' },
  { id: 'solid', label: 'SOLID and design principles' },
  { id: 'maintainable-code', label: 'Maintainable code, testing and refactoring' },
  { id: 'oop-in-practice', label: 'OOP in real applications' },
  { id: 'ai-oop', label: 'Designing and reviewing OOP with AI' },
];
