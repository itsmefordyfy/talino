import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * Programming Fundamentals: Think Like a Programmer (owner's brief, 2026-11-16). The one deliberate exception to "no standalone
 * programming course" (CLAUDE.md, 2026-11-14): software is built with AI, and the learner has to understand programming logic to direct,
 * read and judge what the AI makes. It is concept-first and language-independent; JavaScript is the practice language because the
 * in-app code runner executes it. Twelve modules, one lesson per topic in order; `modules` groups them (the Adventure map's chapters and
 * the course page read the grouping), and `topics` is the flat list every other part of the catalog already understands.
 */
export const PROGRAMMING_FUNDAMENTALS_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'understanding-programming',
    title: 'Understanding Programming',
    summary: 'What programs are, how a computer follows them, and how software gets built, with and without AI.',
    topics: [
      'What Programming Is, and How to Think Like a Programmer',
      'How Computers Execute Instructions',
      'Programming Languages and How Applications Are Built',
      'How AI Is Changing Software Development',
    ],
  },
  {
    slug: 'computational-thinking',
    title: 'Computational Thinking and Problem Solving',
    summary: 'Break problems down, spot patterns, and design a solution on paper before any code.',
    topics: [
      'Breaking Problems into Smaller Pieces',
      'Pattern Recognition and Abstraction',
      'Logical Thinking: Inputs, Processes and Outputs',
      'Introduction to Algorithms',
      'Writing Pseudocode',
      'Creating Flowcharts and Testing an Algorithm Before Coding',
    ],
  },
  {
    slug: 'variables-data-types',
    title: 'Variables, Constants and Data Types',
    summary: 'How a program remembers things, and the kinds of values it can hold.',
    topics: [
      'Variables: Declaring, Assigning and Updating Values',
      'Constants and Naming Conventions',
      'Numbers: Integers and Floating-Point Values',
      'Strings, Booleans, Null and Undefined',
      'Type Conversion and Dynamic vs. Static Typing',
    ],
  },
  {
    slug: 'operators-expressions',
    title: 'Operators and Expressions',
    summary: 'Calculate, compare and combine values, and read an expression the way the computer does.',
    topics: [
      'Arithmetic and Assignment Operators',
      'Comparison and Logical Operators',
      'Expressions and Operator Precedence',
      'Working with Strings',
      'Common Operator Mistakes',
    ],
  },
  {
    slug: 'conditions',
    title: 'Conditions and Decision-Making',
    summary: 'Make a program choose what to do, and keep those choices easy to read.',
    topics: [
      'Boolean Logic and If Statements',
      'If/Else, Else If and Multiple Conditions',
      'Nested Conditions and Combining Conditions',
      'Switch/Case',
      'Avoiding Complex Conditional Logic',
    ],
  },
  {
    slug: 'loops',
    title: 'Loops and Repetition',
    summary: 'Repeat work without repeating code, and stop a loop at the right moment.',
    topics: [
      'Why Loops Are Needed: For Loops',
      'While and Do/While Loops',
      'Nested Loops',
      'Break and Continue',
      'Infinite Loops and Common Looping Mistakes',
    ],
  },
  {
    slug: 'functions',
    title: 'Functions and Reusable Logic',
    summary: 'Give a set of steps a name, feed it values, and get a result back.',
    topics: [
      'What Functions Are and Why They Matter',
      'Parameters, Arguments and Return Values',
      'Local and Global Scope',
      'Function Composition and Reusable Logic',
      'Introduction to Recursion',
    ],
  },
  {
    slug: 'data-structures',
    title: 'Data Structures Fundamentals',
    summary: 'Keep many values together, and pick the shape that fits the problem.',
    topics: [
      'What Data Structures Are: Arrays and Lists',
      'Accessing, Updating, Adding and Removing Elements',
      'Iterating Through Collections',
      'Objects and Key-Value Pairs',
      'Sets, Maps and Choosing the Right Data Structure',
    ],
  },
  {
    slug: 'reading-debugging-testing',
    title: 'Reading, Debugging and Testing Code',
    summary: 'Read code you did not write, find what is wrong, and prove it works.',
    topics: [
      'How to Read Code and Follow Its Execution Order',
      'Syntax, Runtime and Logical Errors',
      'Debugging Techniques and Console Logs',
      'Stack Traces and Breakpoints',
      'Writing Basic Tests',
      'Edge Cases and Validation',
    ],
  },
  {
    slug: 'how-languages-work',
    title: 'How Programming Languages Work',
    summary: 'What happens between the code you write and the screen you see, kept short and practical.',
    topics: [
      'High-Level and Low-Level Languages, Compilers and Interpreters',
      'How Code Runs: Typing, Memory and Variables',
      'How Programs Communicate: APIs',
      'Version Control and Git',
    ],
  },
  {
    slug: 'programming-with-ai',
    title: 'Programming with AI',
    summary: 'Use an AI coding assistant as a partner: explain, generate, review and test, without trusting it blindly.',
    topics: [
      'How AI Coding Assistants Work, and Learning Concepts with Them',
      'Generating Code from Requirements',
      'Understanding AI-Generated Code Line by Line',
      'Finding Bugs, Reviewing and Testing AI Solutions',
      'Hallucinations and Knowing When Not to Trust AI',
    ],
  },
  {
    slug: 'final-project',
    title: 'Final Project: A Personal Expense Tracker',
    summary: 'Build the logic of a real tracker step by step, from a flowchart to working, tested functions.',
    topics: [
      'Plan the Tracker: Requirements, Pseudocode and Flowchart',
      'Add and Categorize Expenses',
      'Store, Display and Total Expenses',
      'Filter Expenses, Validate Input and Handle Invalid Values',
      'Organize, Review and Explain Your Tracker',
    ],
  },
];

export const SYLLABUS_FOUNDATIONS: readonly SyllabusEntry[] = [
  {
    id: 'programming-fundamentals',
    title: 'Programming Fundamentals: Think Like a Programmer',
    level: 'beginner',
    category: 'ai-coding-fundamentals',
    prerequisites: [],
    technologies: ['javascript', 'git', 'llm'],
    goals: ['learn-programming', 'become-developer', 'learn-ai-dev'],
    tags: ['programming basics', 'fundamentals', 'logic', 'algorithms', 'pseudocode', 'flowchart', 'variables', 'loops', 'functions', 'data structures', 'debugging', 'computational thinking', 'no experience', 'complete beginner', 'problem solving'],
    volatile: false,
    scope: 'The ideas under every programming language, taught in JavaScript because the in-app code runner runs it: thinking in steps, variables and data types, operators, conditions, loops, functions, collections, reading, debugging and testing, how languages run, and working with an AI coding assistant, finishing with an expense tracker built step by step. It is the one standalone programming course in the catalog, kept because understanding the logic is what lets you direct, read and judge AI-written code. It does not teach web pages, a framework or a backend (the AI building courses do), and the Coding with AI for Complete Beginners course is the quick first win this one deepens.',
    modules: PROGRAMMING_FUNDAMENTALS_MODULES,
    topics: PROGRAMMING_FUNDAMENTALS_MODULES.flatMap((module) => module.topics),
  },
];
