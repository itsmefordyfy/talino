import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * Object-Oriented Programming: From Fundamentals to Practical Software Design (owner's brief, 2026-11-16). The third deliberate exception to
 * "no standalone programming course" (after Programming Fundamentals and Data Structures and Algorithms; CLAUDE.md, 2026-11-14): understanding how code is organised into
 * objects is what lets a learner read, direct and judge the architecture AI tools produce. It is concept-first and language-independent;
 * JavaScript is the practice language (the in-app runner executes classes, private fields, `super`, getters, static members and `try/catch`),
 * with TypeScript where compile-time ideas (access modifiers, interfaces, abstract classes) need it, and short comparisons with Java, Python
 * and C#. Fourteen modules, one lesson per topic in order; the spec's 100 or so bullets are grouped into 80 lessons (the module-course limit,
 * `MODULE_COURSE_MAX_LESSONS`) with every bullet covered by exactly one lesson.
 */
export const OOP_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'introduction-to-oop',
    title: 'Introduction to Object-Oriented Programming',
    summary: 'What OOP is, why it was invented, how it differs from procedural code, and when it is the right tool.',
    topics: [
      'What Is Object-Oriented Programming, and Why Does It Exist?',
      'Procedural vs. Object-Oriented Programming',
      'The Four Pillars of OOP',
      'Where OOP Is Used, Its Trade-Offs and When to Choose It',
    ],
  },
  {
    slug: 'classes-and-objects',
    title: 'Classes and Objects',
    summary: 'Model things as objects with state and behavior, and create them from classes.',
    topics: [
      'Objects: State, Properties and Behavior',
      'Classes: Blueprints for Objects',
      'Creating Classes and Instantiating Objects in JavaScript',
      'Multiple Instances, Object State and Methods',
      'The this Keyword',
      'Building a Student Management System',
    ],
  },
  {
    slug: 'constructors-and-initialization',
    title: 'Constructors and Object Initialization',
    summary: 'Start every object in a valid state, share data across a class, and see how JavaScript builds objects underneath.',
    topics: [
      'What Is a Constructor?',
      'Constructor Parameters and Default Values',
      'Instance Properties and Object Initialization',
      'Static Properties and Methods',
      'The Object Lifecycle: Creation, Use and Cleanup',
      'Factory Functions vs. Classes',
      'Prototypes: How JavaScript Classes Really Work',
    ],
  },
  {
    slug: 'encapsulation',
    title: 'Encapsulation',
    summary: 'Hide the inside of an object and let it guard its own rules.',
    topics: [
      'What Is Encapsulation, and Why It Matters',
      'Data Hiding: Public and Private Properties and Methods',
      'Getters and Setters',
      'Access Modifiers in TypeScript',
      'Protecting Object State: Validation Inside Classes',
      'Building a Bank Account That Protects Its Balance',
    ],
  },
  {
    slug: 'abstraction',
    title: 'Abstraction',
    summary: 'Show what an object does, hide how, and design interfaces that are simple to use.',
    topics: [
      'What Is Abstraction? Abstraction vs. Encapsulation',
      'Hiding Implementation Details Behind Public Interfaces',
      'Abstract Classes and Abstract Methods',
      'Interfaces in TypeScript and Designing Simple APIs',
      'Designing a Payment Processing Abstraction',
    ],
  },
  {
    slug: 'inheritance',
    title: 'Inheritance',
    summary: 'Share and specialize behavior through parent and child classes, and know when to stop.',
    topics: [
      'What Is Inheritance? Parent and Child Classes',
      'Extending Classes, the super Keyword and Method Overriding',
      'Types of Inheritance and Inheritance Hierarchies',
      'Advantages and Disadvantages of Inheritance',
      'When Inheritance Becomes a Problem',
      'Building an Employee Management System',
    ],
  },
  {
    slug: 'polymorphism',
    title: 'Polymorphism',
    summary: 'Treat different objects through one common interface and let each respond in its own way.',
    topics: [
      'What Is Polymorphism?',
      'Compile-Time vs. Runtime Polymorphism and Method Overloading',
      'Dynamic Method Dispatch and Polymorphism Through Interfaces',
      'Writing Flexible Code with Polymorphism',
      'Building a Notification System',
    ],
  },
  {
    slug: 'composition-and-relationships',
    title: 'Composition and Object Relationships',
    summary: 'Build bigger behavior by combining objects, and describe how objects relate and depend on each other.',
    topics: [
      'What Is Composition? Has-a vs. Is-a',
      'Association, Aggregation and Composition',
      'Dependency Relationships and Object Collaboration',
      'Dependency Injection Fundamentals',
      'Composition vs. Inheritance: Favoring Composition',
      'Building an Order Management System',
    ],
  },
  {
    slug: 'interfaces-and-abstract-classes',
    title: 'Interfaces and Abstract Classes',
    summary: 'Depend on contracts instead of concrete classes so systems can grow without breaking.',
    topics: [
      'What Is an Interface, and Why Do Interfaces Matter?',
      'Defining and Implementing Interfaces in TypeScript and JavaScript',
      'Abstract Classes vs. Interfaces and Multiple Implementations',
      'Depending on Abstractions: Designing Extensible Systems',
      'Designing a Reusable Storage Service',
    ],
  },
  {
    slug: 'solid-principles',
    title: 'SOLID Principles',
    summary: 'Five design principles learned from real problems: spot the smell, see why it hurts, and refactor it.',
    topics: [
      'Single Responsibility Principle',
      'Open/Closed Principle',
      'Liskov Substitution Principle',
      'Interface Segregation Principle',
      'Dependency Inversion Principle',
      'Applying SOLID: Recognizing Real Design Problems',
    ],
  },
  {
    slug: 'maintainable-oop',
    title: 'Writing Maintainable Object-Oriented Software',
    summary: 'Keep classes small, loosely coupled and tested, and improve a messy codebase safely.',
    topics: [
      'Understanding Coupling',
      'Understanding Cohesion and Separation of Concerns',
      'Single-Purpose, Reusable Classes and Avoiding God Objects',
      'Avoiding Deep Inheritance and Organizing Files and Modules',
      'Error Handling in Object-Oriented Code',
      'Unit Testing Classes',
      'Refactoring a Poorly Structured Application',
    ],
  },
  {
    slug: 'oop-in-real-applications',
    title: 'OOP in Real-World Application Development',
    summary: 'Where objects show up in front ends, back ends, databases, mobile apps and games, and how OOP fits with functional code.',
    topics: [
      'OOP in Frontend Applications',
      'OOP in Backend Applications, APIs and Service Layers',
      'OOP in Database and Domain Models',
      'OOP in Mobile Apps, Games and Enterprise Software',
      'OOP vs. Functional Programming, and Combining Them',
    ],
  },
  {
    slug: 'ai-assisted-oop',
    title: 'AI-Assisted Object-Oriented Development',
    summary: 'Use AI to design, explain, generate, review and refactor classes, and catch the design mistakes it makes.',
    topics: [
      'Asking AI to Identify Classes and Draw Class Diagrams',
      'Asking AI to Explain Existing Classes',
      'Generating Constructors and Methods, and Applying OOP Principles with AI',
      'Reviewing AI-Generated Inheritance and Detecting Unnecessary Abstraction',
      'Refactoring Procedural Code into OOP with AI',
      'Reviewing SOLID Compliance and Testing AI-Generated Classes',
      'Detecting Incorrect AI Design Decisions',
    ],
  },
  {
    slug: 'final-project-library',
    title: 'Final Project: A Library Management System',
    summary: 'Analyze, design and build a complete object-oriented application, then explain your decisions.',
    topics: [
      'Analyzing Requirements and Identifying Classes',
      'Designing the Class Diagram',
      'Building Books, Members and the Library',
      'Borrowing, Returning and Borrowing Records',
      'Validation, Errors, Tests and Explaining Your Design',
    ],
  },
];

export const SYLLABUS_OOP: readonly SyllabusEntry[] = [
  {
    id: 'object-oriented-programming',
    title: 'Object-Oriented Programming: From Fundamentals to Practical Software Design',
    level: 'intermediate',
    category: 'ai-coding-fundamentals',
    prerequisites: ['programming-fundamentals'],
    // TypeScript is a comparison thread inside some lessons, not what the course teaches, so it is not listed (a listed technology makes
    // the course rank for TypeScript learners).
    technologies: ['javascript', 'llm', 'chatgpt', 'claude'],
    goals: ['learn-programming', 'become-developer', 'get-job', 'learn-ai-dev', 'build-sell-app'],
    tags: ['oop', 'object oriented', 'classes', 'objects', 'encapsulation', 'abstraction', 'inheritance', 'polymorphism', 'composition', 'solid', 'design principles', 'refactoring', 'class diagram', 'uml', 'software design', 'clean code', 'library system'],
    volatile: false,
    scope: 'How to organize code into objects and classes and design maintainable, reusable software: classes and objects, constructors, encapsulation, abstraction, inheritance, polymorphism, composition, interfaces and abstract classes, the SOLID principles, coupling and cohesion, testing and refactoring classes, where OOP appears in front ends, back ends, mobile apps and games and how it sits next to functional programming, and using AI to design, review and refactor object-oriented code, ending with a Library Management System. It builds on Programming Fundamentals (variables, conditions, loops, functions, arrays and objects, debugging) and does not re-teach them. It is the second standalone programming course in the catalog, kept because the architecture AI tools generate is made of these ideas and a learner has to read, direct and judge it. It does not teach a framework, a database or a backend (the AI building courses do), and the AI courses cover prompting and agent workflows in general; here AI is used only for object-oriented design work.',
    modules: OOP_MODULES,
    topics: OOP_MODULES.flatMap((module) => module.topics),
  },
];
