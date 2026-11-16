import type { VisualDefinition } from '../types';
import { AbstractionVisual } from './abstraction-visual';
import { ClassesVisual } from './classes-visual';
import { EncapsulationVisual } from './encapsulation-visual';
import { InheritanceVisual } from './inheritance-visual';
import { PolymorphismVisual } from './polymorphism-visual';
import { oopStrings } from './strings';


/** Object-oriented programming: classes and objects, inheritance, encapsulation, polymorphism, abstraction. */
const build = (en: typeof oopStrings.en): VisualDefinition[] => [
  { id: 'classes-objects', category: 'oop', title: en.classes.title, summary: en.classes.summary, description: en.classes.description, topics: en.classes.topics, Component: ClassesVisual },
  { id: 'inheritance', category: 'oop', title: en.inheritance.title, summary: en.inheritance.summary, description: en.inheritance.description, topics: en.inheritance.topics, Component: InheritanceVisual },
  { id: 'encapsulation', category: 'oop', title: en.encapsulation.title, summary: en.encapsulation.summary, description: en.encapsulation.description, topics: en.encapsulation.topics, Component: EncapsulationVisual },
  { id: 'polymorphism', category: 'oop', title: en.polymorphism.title, summary: en.polymorphism.summary, description: en.polymorphism.description, topics: en.polymorphism.topics, Component: PolymorphismVisual },
  { id: 'abstraction', category: 'oop', title: en.abstraction.title, summary: en.abstraction.summary, description: en.abstraction.description, topics: en.abstraction.topics, Component: AbstractionVisual },
];

export const oopVisuals = build(oopStrings.en);
/** The same visuals with their titles, summaries and descriptions in Tagalog (the components read their own language). */
export const oopVisualsFil = build(oopStrings.fil);
