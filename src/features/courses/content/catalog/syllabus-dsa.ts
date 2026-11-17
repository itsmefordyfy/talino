import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * Data Structures and Algorithms: From Fundamentals to Practical Problem Solving (owner's brief, 2026-11-16). The second deliberate
 * exception to "no standalone programming course" (CLAUDE.md, 2026-11-14), for the same reason as Programming Fundamentals: choosing a
 * structure and judging an algorithm's cost is what lets a learner direct, read and review AI-written code. JavaScript is the practice
 * language because the in-app code runner executes it. Nineteen modules, one lesson per topic in order; `modules` groups them (the
 * Adventure map's chapters and the course page read the grouping), `topics` is the flat list the rest of the catalog understands.
 * The curriculum's bullet points are folded into lessons (several related bullets each), so no bullet is dropped.
 */
export const DSA_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'introduction',
    title: 'Introduction to Data Structures and Algorithms',
    summary: 'What data structures and algorithms are, how a computer holds data, and how to start choosing between them.',
    topics: [
      'What Data Structures and Algorithms Are, and Why They Matter',
      'How Computers Store and Process Data',
      'Data Types, Abstract Data Types and the Shapes of Data',
      'Understanding Efficiency and Choosing the Right Data Structure',
    ],
  },
  {
    slug: 'complexity',
    title: 'Time and Space Complexity',
    summary: 'Measure how the work and the memory an algorithm needs grow with its input, by counting rather than by guessing.',
    topics: [
      'What Algorithm Complexity Is: Counting Operations',
      'Big O Notation: Constant, Logarithmic and Linear Time',
      'Linearithmic and Quadratic Time: Understanding Growth Rates',
      'Analyzing Loops and Comparing Two Solutions',
      'Space Complexity, Best, Average and Worst Cases, and Amortized Analysis',
    ],
  },
  {
    slug: 'arrays',
    title: 'Arrays and Dynamic Arrays',
    summary: 'The most common structure: how an array sits in memory, what each operation costs and the patterns that use it.',
    topics: [
      'What Arrays Are and How They Store Data',
      'Accessing, Updating, Inserting and Removing Elements',
      'Traversing, Searching and Multidimensional Arrays',
      'Dynamic Arrays and Common Array Patterns',
    ],
  },
  {
    slug: 'strings',
    title: 'Strings and String Manipulation',
    summary: 'Text as a sequence of characters: traverse it, search it, count it and build a small text analyzer.',
    topics: [
      'Strings: Representation, Access and Traversal',
      'Concatenation, Searching, Reversal and Palindromes',
      'Character Frequency Counting and Common String Algorithms',
    ],
  },
  {
    slug: 'linked-lists',
    title: 'Linked Lists',
    summary: 'Data connected by references instead of sitting side by side, and what that trades away and gains.',
    topics: [
      'What Linked Lists Are: Nodes, References and Arrays vs. Linked Lists',
      'Singly Linked Lists: Inserting, Removing, Searching and Traversing',
      'Doubly and Circular Linked Lists',
      'Reversing a Linked List, Detecting Cycles and Complexity',
    ],
  },
  {
    slug: 'stacks',
    title: 'Stacks',
    summary: 'Last in, first out: the structure behind undo, back buttons, balanced brackets and the call stack.',
    topics: [
      'What Stacks Are: LIFO, Push, Pop and Peek',
      'Implementing Stacks with Arrays and Linked Lists',
      'Stack Applications: Parentheses, Undo and Redo, Expressions and the Call Stack',
    ],
  },
  {
    slug: 'queues',
    title: 'Queues and Deques',
    summary: 'First in, first out: waiting lines, task schedulers, and the two-ended deque.',
    topics: [
      'What Queues Are: FIFO, Enqueue and Dequeue',
      'Implementing Queues: Circular Queues and Deques',
      'Priority Queues, Task Scheduling and Real-World Queues',
    ],
  },
  {
    slug: 'hash-tables',
    title: 'Hash Tables, Maps and Sets',
    summary: 'Find a value by its key in almost no time, and what happens when two keys want the same slot.',
    topics: [
      'What Hashing and Hash Functions Are',
      'Hash Tables: Key-Value Storage and Collisions',
      'Separate Chaining, Open Addressing and Hash Table Complexity',
      'Maps, Sets, and Choosing Between Objects, Maps and Sets',
    ],
  },
  {
    slug: 'recursion',
    title: 'Recursion',
    summary: 'A function that solves a problem by solving a smaller copy of it, and how to keep that safe.',
    topics: [
      'What Recursion Is: Base Cases, Recursive Cases and the Call Stack',
      'Recursion vs. Iteration and Common Recursion Mistakes',
      'Memoization and an Introduction to Backtracking',
    ],
  },
  {
    slug: 'trees',
    title: 'Trees',
    summary: 'Hierarchical data: terminology, the four traversals, binary search trees and why balance matters.',
    topics: [
      'What Trees Are: Terminology and Binary Trees',
      'Tree Traversal: Preorder, Inorder, Postorder and Level-Order',
      'Binary Search Trees: Searching, Inserting and Deleting',
      'Balanced vs. Unbalanced Trees and Hierarchical Data',
    ],
  },
  {
    slug: 'heaps',
    title: 'Heaps and Priority Queues',
    summary: 'Always get the most urgent item first: heaps in an array, heapify, heap sort and priority queues.',
    topics: [
      'What Heaps Are: Min-Heaps, Max-Heaps and Array Representation',
      'Heap Insertion, Removal and Heapify',
      'Heap Sort and Priority Queue Applications',
    ],
  },
  {
    slug: 'tries-specialized',
    title: 'Tries and Specialized Data Structures',
    summary: 'Prefix trees for autocomplete, union-find for groups, and how to tell when a special structure earns its place.',
    topics: [
      'Tries: Prefix Trees, Inserting and Searching Words',
      'Prefix Matching and Autocomplete Systems',
      'Union-Find and Choosing Specialized Data Structures',
    ],
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    summary: 'Things and the connections between them: representations, BFS and DFS, cycles, ordering and shortest paths.',
    topics: [
      'What Graphs Are: Vertices, Edges and Their Kinds',
      'Representing Graphs: Adjacency Matrix and Adjacency List',
      'Graph Traversal: Breadth-First and Depth-First Search',
      'Cycles, Connected Components and Topological Sorting',
      "Shortest Paths and Dijkstra's Algorithm",
    ],
  },
  {
    slug: 'searching',
    title: 'Searching Algorithms',
    summary: 'Finding things fast: linear and binary search, what binary search demands, and searching trees and hash tables.',
    topics: [
      'Linear Search and Binary Search',
      'Binary Search Requirements and Variations',
      'Searching Trees and Hash Tables, and Comparing Search Algorithms',
    ],
  },
  {
    slug: 'sorting',
    title: 'Sorting Algorithms',
    summary: 'Why order matters, the simple and the fast sorts, and how to choose between them.',
    topics: [
      'Why Sorting Matters and the Simple Sorts: Bubble, Selection and Insertion',
      'Merge Sort',
      'Quick Sort',
      'Heap Sort and Non-Comparison Sorts: Counting and Radix',
      'Stable vs. Unstable, In-Place vs. Out-of-Place and Choosing a Sort',
    ],
  },
  {
    slug: 'patterns',
    title: 'Problem-Solving Techniques and Algorithm Patterns',
    summary: 'Reusable patterns that turn a new problem into one you have already solved, from two pointers to dynamic programming.',
    topics: [
      'Breaking Down Algorithm Problems: Two Pointers and Sliding Window',
      'Prefix Sums, Frequency Counters and Fast and Slow Pointers',
      'Binary Search Patterns, Divide and Conquer and Greedy Algorithms',
      'Backtracking Patterns',
      'Dynamic Programming: Memoization vs. Tabulation',
    ],
  },
  {
    slug: 'real-applications',
    title: 'Applying Data Structures in Real Applications',
    summary: 'Where each structure shows up in web, mobile and backend software, and what choosing it costs in time and memory.',
    topics: [
      'Lists, Maps and Sets in Application State',
      'Queues, Stacks, Trees and Tries in Real Applications',
      'Graphs, Heaps, Backend Services and Large Datasets',
    ],
  },
  {
    slug: 'ai-assisted',
    title: 'AI-Assisted Algorithm Development',
    summary: 'Use an AI assistant to explain, generate, test and optimize algorithms while your own reasoning stays in charge.',
    topics: [
      'Asking AI to Explain Algorithms and Choose a Data Structure',
      'Generating, Reading and Testing Data Structure Code with AI',
      'Analyzing Complexity and Finding Bottlenecks with AI',
      'Catching Wrong AI Explanations and Reviewing AI Optimizations',
    ],
  },
  {
    slug: 'final-project',
    title: 'Final Project: A Smart Task Management System',
    summary: 'Combine hash maps, trees, heaps, stacks, queues, graphs and sorting into one working task manager, and defend your choices.',
    topics: [
      'Plan the Smart Task Manager: Requirements and Data Structure Choices',
      'Build Tasks, Categories and Fast Search',
      'Add Priorities, Scheduling, History and Undo and Redo',
      'Dependencies, Sorting and Explaining Your Trade-offs',
    ],
  },
];

export const SYLLABUS_DSA: readonly SyllabusEntry[] = [
  {
    id: 'data-structures-algorithms',
    title: 'Data Structures and Algorithms: From Fundamentals to Practical Problem Solving',
    level: 'intermediate',
    category: 'ai-coding-fundamentals',
    prerequisites: ['programming-fundamentals'],
    technologies: ['javascript', 'chatgpt', 'claude'],
    goals: ['learn-programming', 'become-developer', 'get-job'],
    tags: ['data structures', 'algorithms', 'dsa', 'big o', 'complexity', 'arrays', 'linked list', 'stack', 'queue', 'hash table', 'hash map', 'recursion', 'tree', 'binary search tree', 'heap', 'priority queue', 'trie', 'graph', 'bfs', 'dfs', 'dijkstra', 'sorting', 'searching', 'dynamic programming', 'interview', 'technical interview', 'problem solving', 'computer science'],
    volatile: false,
    scope: 'How software organizes and processes data: what each structure is, how it sits in memory, what each operation costs and when to choose it, shown in JavaScript because the in-app code runner runs it. Complexity analysis, arrays and strings, linked lists, stacks, queues, hash tables, recursion, trees, heaps, tries and union-find, graphs, searching and sorting, the reusable problem-solving patterns, where each structure appears in real web and mobile software, working with an AI assistant on algorithms, and a final smart task manager that uses many of them. It builds on Programming Fundamentals (recommended, not required) and complements object-oriented programming. It is not a framework, database or backend course, and it does not drill interview puzzles: it teaches why each structure works so you can choose and judge one, including in AI-written code.',
    modules: DSA_MODULES,
    topics: DSA_MODULES.flatMap((module) => module.topics),
  },
];
