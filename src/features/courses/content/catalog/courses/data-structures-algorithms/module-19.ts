import type { Lesson, Project } from '../../../types';

export const lessons: Lesson[] = [
  {
    id: 'data-structures-algorithms-69',
    day: 69,
    title: 'Plan the Smart Task Manager: Requirements and Data Structure Choices',
    summary: 'Turn ten feature requests into a plan: a data shape, one structure per requirement with its cost, and a test plan you write before any building.',
    intro: {
      objectives: [
        'Turn a list of features into the operations a program must perform',
        'Choose one data structure for each requirement and state its cost',
        'Write a task data shape and a function that checks it',
        'Write a test plan before building anything',
      ],
      why: 'When an AI assistant writes code for you, the structures it picks decide whether the app stays fast at 50,000 tasks. A plan you made yourself is the yardstick you hold its code against.',
    },
    minutes: 30,
    skills: ['choose-structure', 'complexity'],
    body: [
      {
        type: 'paragraph',
        text: 'For eighteen modules you studied structures one at a time. Now you will use them together, in one program: a Smart Task Management System. It creates, updates and deletes tasks, groups them in categories that can contain other categories, finds the most urgent task, searches and filters quickly, remembers every change, undoes and redoes, knows which tasks wait for others, and sorts by priority, deadline or creation date. Today you build nothing. You plan, because a plan is where your own reasoning matters most. If you let an assistant choose the structures, you will not be able to judge the code it writes later.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: "Picture a barangay hall's request desk. Every request gets a numbered folder in a cabinet, so the clerk can pull folder 482 without reading the others. The drawers are labelled by department, and some drawers hold smaller drawers. A logbook lists every change, in order, and nothing is erased from it. A tray holds the urgent requests on top. A corkboard has strings joining requests that cannot start until another one is finished.",
      },
      {
        type: 'paragraph',
        text: 'Each object on that desk does one job well, and none of them could do all the jobs. That is the whole idea of this module. The picture stops working in one place: a clerk can glance at a drawer, but a program has to keep every index up to date by hand whenever a task changes. Most bugs in this project will be an index that disagrees with the data.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'Start from the requirements, and turn each into the operation the program performs. A requirement such as "search tasks" is vague. "Given a word, return every task whose title contains it" is an operation you can attach a cost to. Then ask four questions of each operation: how often does it happen, how big can the data get, does order matter, and what must stay true afterwards?',
      },
      {
        type: 'paragraph',
        text: "Next, fix the **data shape**: the fields every task carries. We use `id` (a number the system hands out), `title`, `priority` (1 is urgent, 3 is low, so a smaller number sorts first), `due` (a date written `YYYY-MM-DD`, or `null`), `category` (a name), `created`, `status` (`'todo'` or `'done'`) and `dependsOn` (the ids of tasks that must be done first). Dates are plain strings in that order because such strings sort correctly as text, so we need no `Date` object.",
      },
      {
        type: 'table',
        headers: ['Requirement', 'The operation we perform', 'Structure', 'Cost'],
        rows: [
          [
            'Create, update, delete, open a task',
            'Find a task by its id',
            'Map from id to task',
            'O(1) average',
          ],
          [
            'Organize by category',
            'All tasks of a category',
            'Map from category name to a Set of ids',
            'O(1) to reach, then O(k) for k results',
          ],
          [
            'Hierarchical categories',
            'Path to the root, everything below a node',
            'Tree of nodes with a parent and children',
            'O(depth) and O(size of subtree)',
          ],
          [
            'Search and filter',
            'Tasks containing every typed word',
            'Map from word to a Set of ids',
            'O(k) for the smallest set, then intersect',
          ],
          [
            'Prioritize and schedule',
            'The most urgent open task',
            'Binary min-heap',
            'Peek O(1), insert and remove O(log n)',
          ],
          [
            'Task history',
            'Every change, per task',
            'Append-only array plus a Map from id to its entries',
            'O(1) per record',
          ],
          ['Undo and redo', 'Reverse the last change, or reapply it', 'Two stacks', 'O(1) each'],
          [
            'Dependencies',
            'Who waits for whom; refuse a circle',
            'Directed graph as adjacency lists',
            'O(1) per edge, cycle check O(V+E)',
          ],
          [
            'Sort three ways',
            'Order by priority, deadline or creation',
            'Array sort with a stable comparator',
            'O(n log n)',
          ],
        ],
        caption: 'The plan: one structure per operation, with the cost we will check by counting.',
      },
      {
        type: 'paragraph',
        text: 'Notice that tasks live in exactly one place, the Map by id. Everything else, the category sets, the word index, the heap, the graph, the history, is a *view* that must follow the Map. We keep them honest with one rule: the store announces every change as an event with a `before` and an `after` copy of the task, and each view listens. A view never changes tasks itself.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[TaskManager: the one door for the app] --> B[TaskStore: Map by id plus category and word indexes]
  B --> C[CategoryTree: names with parents and children]
  B -->|change events| D[History: log plus undo and redo stacks]
  B -->|change events| E[Scheduler: min-heap of open tasks]
  B -->|change events| F[DependencyGraph: prerequisites]
  A --> D
  A --> E
  A --> F`,
        caption: 'The architecture: the store owns the data and announces changes; four views listen. The manager is the only door the rest of the app uses.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: you are drawing the plan of a house before pouring any concrete. The plan says which room is for what and how big, so nobody builds a bedroom out of the kitchen. Here the "rooms" are the jobs the program must do, and the "materials" are data structures. Choosing one per job, and writing down roughly how much work each job costs, is the whole lesson.',
      },
      {
        type: 'paragraph',
        text: 'Last, write the test plan before the code. A test plan is a list of checks with the answer you expect, such as "after undo, the task is back to its old priority". Writing the answers first stops you from bending the tests to fit the code, and it gives you the exact sentence to hand an AI assistant when you ask it to review your work. You will run the whole plan in lesson 72.',
      },
      {
        type: 'table',
        headers: ['Check', 'What it proves'],
        rows: [
          [
            'Lookup by id returns the right task; a missing id returns null',
            'The Map and the not-found case',
          ],
          [
            'A category with deep: true includes its subcategories',
            'The tree and the category index agree',
          ],
          [
            'A two-word search returns only tasks containing both words',
            'The word index and the intersection',
          ],
          ['After create, update and delete, the indexes match the Map', 'No view has gone stale'],
          [
            'The scheduler offers the most urgent task and skips blocked ones',
            'Heap order plus dependencies',
          ],
          [
            'Undo restores the old task, redo reapplies it, a new action clears redo',
            'The two stacks',
          ],
          ['A dependency that closes a circle is refused', 'The graph check'],
          [
            'Sorting by deadline puts tasks with no deadline last, ties by priority',
            'A stable multi-key comparator',
          ],
        ],
        caption: 'The test plan we will run at the end. Each row becomes one or two check() calls.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'At scale this design is event-sourcing in miniature: one authoritative store, derived read models updated by change events, and an append-only log. The risks are the usual ones: derived views drifting from the source of truth, listener order mattering, unbounded growth of the log and of stale heap entries, and an undo model that is local to one process. State your invariants (every id in an index exists in the Map, and every task is in the indexes it should be in), then write an invariant checker. It is the cheapest test you will own, and the first thing to run against AI-generated changes.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Start with the data shape. Four sample tasks, one waiting for another and one with no deadline.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The task shape and the date trick',
        code: `const sampleTasks = [
  { id: 1, title: 'Pay electric bill', priority: 1, due: '2026-11-20', category: 'Bills', created: '2026-11-10', status: 'todo', dependsOn: [] },
  { id: 2, title: 'Draft the proposal', priority: 2, due: '2026-11-19', category: 'Launch', created: '2026-11-11', status: 'todo', dependsOn: [] },
  { id: 3, title: 'Review the proposal', priority: 1, due: '2026-11-20', category: 'Launch', created: '2026-11-12', status: 'todo', dependsOn: [2] },
  { id: 4, title: 'Clean the garage', priority: 3, due: null, category: 'Home', created: '2026-11-09', status: 'todo', dependsOn: [] },
];

console.log(sampleTasks[2].title, 'waits for', sampleTasks[2].dependsOn);
console.log(sampleTasks[3].due);
console.log('2026-11-09' < '2026-11-20');`,
      },
      {
        type: 'paragraph',
        text: 'The shape is a promise, so write a function that checks it. It returns a list of problems instead of throwing, so you can test it on its own.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Checking a task',
        code: `const isDigits = (text) => text.length > 0 && text.split('').every((ch) => '0123456789'.includes(ch));

function isDate(text) {
  return typeof text === 'string' && text.length === 10 && text[4] === '-' && text[7] === '-' && isDigits(text.slice(0, 4)) && isDigits(text.slice(5, 7)) && isDigits(text.slice(8, 10));
}

function taskProblems(task, categories) {
  const problems = [];
  if (typeof task.title !== 'string' || task.title.trim().length === 0) problems.push('title is missing');
  if (![1, 2, 3].includes(task.priority)) problems.push('priority must be 1, 2 or 3');
  if (task.due !== null && !isDate(task.due)) problems.push('due must be YYYY-MM-DD or null');
  if (!categories.has(task.category)) problems.push(\`unknown category \${task.category}\`);
  return problems;
}

const categories = new Set(['Bills', 'Launch', 'Home']);
console.log(taskProblems(sampleTasks[0], categories));
console.log(taskProblems({ title: '  ', priority: 5, due: '20-11-2026', category: 'Gym' }, categories));`,
      },
      {
        type: 'paragraph',
        text: 'Finally, the baseline that justifies the Map. Scanning an array of 2,000 tasks, we count how many tasks we look at; then we ask a Map for the same task.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The scan baseline',
        code: `function makeTasks(count) {
  const tasks = [];
  for (let id = 1; id <= count; id++) tasks.push({ id, title: \`Task \${id}\`, priority: (id % 3) + 1 });
  return tasks;
}

function findByScan(tasks, id) {
  let looked = 0;
  for (const task of tasks) {
    looked += 1;
    if (task.id === id) return { task, looked };
  }
  return { task: null, looked };
}

const tasks = makeTasks(2000);
const byId = new Map(tasks.map((task) => [task.id, task]));

console.log(findByScan(tasks, 1500).looked);
console.log(findByScan(tasks, 2000).looked);
console.log(byId.get(1500).title);`,
      },
      {
        type: 'paragraph',
        text: 'And a tiny test helper you will reuse in every lesson of this module.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The check helper',
        code: `function check(name, actual, expected) {
  const same = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(\`\${same ? 'PASS' : 'FAIL'} \${name}\${same ? '' : \` (got \${JSON.stringify(actual)}, wanted \${JSON.stringify(expected)})\`}\`);
  return same;
}

check('scan finds task 1500', findByScan(tasks, 1500).task.title, 'Task 1500');
check('Map finds task 1500', byId.get(1500).title, 'Task 1500');
check('a missing id gives null', byId.get(9999) ?? null, null);`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`sampleTasks[2].dependsOn` is `[2]`: task 3 waits for task 2. Task 4\'s `due` is `null`, which means "no deadline". The comparison `\'2026-11-09\' < \'2026-11-20\'` is `true` because JavaScript compares strings character by character and the year-month-day order puts the biggest unit first.',
          '`isDigits` splits a string into characters and asks whether every one is a digit. `isDate` checks the length (10), the two dashes at positions 4 and 7, and that the three parts are digits. It does not check that the month is 1 to 12: a real calendar library would, and our plan says so honestly.',
          '`taskProblems` collects messages. The valid task gives `[]`. The bad one gives four messages, because it breaks four rules: a blank title, priority 5, a date in the wrong order and an unknown category.',
          '`findByScan` adds 1 to `looked` for every task it examines. Task 1500 is at position 1500, so it prints `1500`. Task 2000 is last, so it prints `2000`: the worst case. The Map answers `Task 1500` after one hash lookup, whatever the size, on average.',
          '`check` compares two values by turning both into JSON text, so it works for numbers, strings, arrays and plain objects. It prints `PASS` or `FAIL` with both values. All three checks print `PASS`.',
        ],
      },
      {
        type: 'warning',
        text: '`JSON.stringify` compares key order, and it cannot compare a Map or a Set (both become `{}`). Convert them to arrays before you check them.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Before you ask, write your own table of requirements and the structure you would use for each, in your own words. Then give it to an assistant for a challenge, not for a redesign.',
      },
      {
        type: 'prompt',
        label: 'Challenge my plan',
        text: `I am planning a task manager in JavaScript (no framework). Below is my table: each requirement, the structure I chose and the cost I think it has. Do not give me a different design and do not write code. For each row in turn, ask me ONE question that makes me defend the choice (about sizes, order, or what must stay true). Wait for my answer before the next row. At the end, list any cost I stated wrongly.

[paste your table here]`,
      },
      {
        type: 'paragraph',
        text: 'Look at what comes back. Did each question make you think about a size or a case you had not considered? Check every cost it corrects by counting on a small example, as you did with the scan. An assistant may confidently suggest a heavier tool (a database, a library) or call a Map "always O(1)". Neither is wrong in every case, so decide with your own constraints: how big, how often, how fast.',
      },
      {
        type: 'takeaways',
        items: [
          'Turn every feature into an operation with a size and a frequency before you pick a structure.',
          'One structure per job: Map by id, Map of Sets for categories and words, a tree, a min-heap, two stacks, a graph, and a stable sort.',
          'Keep one source of truth (the Map by id) and let every other structure be a view that follows change events.',
          'Fix the data shape and write a function that checks it; strings in YYYY-MM-DD order sort correctly.',
          'Write the test plan, with the expected answers, before you write the code.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-69-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Questions to ask about every requirement',
          prompt: 'Tap each question to see why it decides the structure.',
          concept: 'planning data structures',
          cards: [
            {
              front: 'How often does this operation happen compared with the others?',
              back: 'A structure that makes a rare operation cheap and a daily one slow is the wrong trade. Opening a task by id happens all day; rebuilding an index happens only after a change.',
            },
            {
              front: 'How big can the data get?',
              back: 'At 20 tasks anything works, including scanning. At 50,000 a scan on every keystroke is noticeable, and the choice starts to matter.',
            },
            {
              front: 'Does order matter?',
              back: 'The heap gives the most urgent task first but not a fully sorted list; a Map keeps insertion order but not priority order. Know which order the screen needs.',
            },
            {
              front: 'What must stay true after every change?',
              back: 'This is the invariant, for example "every id in the word index exists in the Map". Name it now and you can write a checker for it later.',
            },
          ],
          hints: [],
          explanation: 'Frequency, size, order and invariants turn a vague feature into a choice you can defend, and each answer points to a cost you can count.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-69-match-1',
          kind: 'match',
          title: 'Which structure does the situation call for?',
          prompt: 'Match each situation from the task manager to the structure that handles it best.',
          concept: 'identify the appropriate data structure',
          labels: { terms: 'The situation', meanings: 'The structure' },
          pairs: [
            {
              term: 'A list of 20,000 tasks, and a tap on one must open its detail instantly',
              definition: 'A Map from id to task',
              note: 'You know the exact key, so hashing reaches the task without looking at the others.',
            },
            {
              term: 'The user presses Undo three times, then Redo once',
              definition: 'Two stacks, last in first out',
              note: 'The most recent change must be reversed first, which is the stack rule.',
            },
            {
              term: 'A screen must always show the single most urgent open task, even as tasks change',
              definition: 'A binary min-heap',
              note: 'The heap keeps the smallest item at the top and repairs itself in O(log n).',
            },
            {
              term: '"Send invoice" cannot start until "Get approval" is done',
              definition: 'A directed graph of prerequisites',
              note: 'Each task points at the tasks it waits for, and the graph can refuse a circle.',
            },
            {
              term: 'Show "Home" together with its subcategories "Bills" and "Garden"',
              definition: 'A tree of category nodes',
              note: 'Categories nest, and one node reaches everything below it.',
            },
          ],
          hints: [
            'Ask what the program already knows: an exact key, an order of arrival, an urgency or a relationship.',
            'Last in first out describes only one of these situations.',
            'Two situations are about relationships: one is nesting, the other is "must happen before".',
          ],
          explanation: 'The words in the situation point at the structure: an exact key means a Map, reversing the latest means a stack, "most urgent" means a heap, "must happen before" means a graph and "inside" means a tree.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-69-predict-output-1',
          kind: 'predict-output',
          title: 'Count the looks',
          prompt: 'This code first scans for id 60, counting how many ids it looks at, then asks a Map. What does it print?',
          concept: 'comparing a scan with a Map',
          language: 'javascript',
          code: `const ids = [10, 20, 30, 40, 50, 60, 70, 80];
let looked = 0;
for (const id of ids) {
  looked += 1;
  if (id === 60) break;
}
console.log(looked);
const index = new Map(ids.map((id, position) => [id, position]));
console.log(index.get(60));
console.log(index.get(65) ?? 'missing');`,
          expected: `6
5
missing`,
          choices: [
            `6
5
missing`,
            `5
5
missing`,
            `6
6
missing`,
            `6
5
undefined`,
          ],
          wrongNotes: {
            '5\n5\nmissing': 'The loop adds 1 before it tests the id, so by the time it reaches 60 it has looked at six ids, not five. Position 5 is the index, not the count.',
            '6\n6\nmissing': 'The Map stores each id with its position, and positions start at 0. The id 60 is at position 5.',
            '6\n5\nundefined': 'The last line uses ?? to replace undefined with a text, so it prints missing.',
          },
          hints: [
            'Count the loop turns: ids 10, 20, 30, 40, 50, 60.',
            'The Map stores [id, position], and positions start at 0.',
            'index.get(65) is undefined, and `??` replaces undefined.',
          ],
          explanation: 'The scan looks at six ids; the Map returns the stored position 5 in one lookup; a missing key gives undefined, which ?? turns into the text missing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-69-scenario-1',
          kind: 'scenario',
          title: 'Search as you type',
          prompt: 'Choose the plan that best fits the situation.',
          concept: 'choosing a structure for search',
          situation: 'Your app holds 50,000 tasks. Users type whole words into a search box and expect results at every keystroke. Tasks are edited far less often than they are searched. Titles have several words.',
          options: [
            {
              text: 'Keep a Map from each word to the Set of task ids that contain it, updated whenever a title changes.',
              consequence: 'A search reaches each word in one lookup and intersects small sets. You pay a little on every edit to keep the index right, which suits rare edits.',
              quality: 'best',
            },
            {
              text: 'Keep a trie of every word in every title.',
              consequence: 'It works and also gives prefix matching, but it costs more memory and code than whole-word search needs. A reasonable choice if you want autocomplete, too much if you do not.',
              quality: 'acceptable',
            },
            {
              text: 'Scan all tasks and test `title.includes(text)` on each keystroke.',
              consequence: 'Every keystroke looks at 50,000 titles. It is simple and fine for 100 tasks, but the cost grows with the data and the screen will lag.',
              quality: 'poor',
            },
            {
              text: 'Sort the tasks by title and binary search for the typed text.',
              consequence: 'Binary search finds one exact title, not the words inside many titles, so most matches are missed.',
              quality: 'poor',
            },
          ],
          hints: [
            'Which operation is frequent, searching or editing?',
            'Searching by a whole word is a question about a key.',
            'Paying a little on each rare edit to make every frequent search fast is a good trade.',
          ],
          explanation: 'When reads outnumber writes, an index that costs something on each edit and makes every search cheap is the right trade. The word index is that structure.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-69-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the task checker',
          prompt: "Complete `checkTask(task)`. It returns an array of problem messages, in this order: `'title is missing'` when the title is not a string or is blank after trim; `'priority must be 1, 2 or 3'` when the priority is not 1, 2 or 3; `'due must be YYYY-MM-DD or null'` when `due` is not null and `isDate` says no. A good task gives `[]`.",
          concept: 'validating a data shape',
          language: 'javascript',
          starter: `const isDigits = (text) => text.length > 0 && text.split('').every((ch) => '0123456789'.includes(ch));

function isDate(text) {
  return typeof text === 'string' && text.length === 10 && text[4] === '-' && text[7] === '-' && isDigits(text.slice(0, 4)) && isDigits(text.slice(5, 7)) && isDigits(text.slice(8, 10));
}

function checkTask(task) {
  const problems = [];
  // add one rule at a time
  return problems;
}`,
          solution: `const isDigits = (text) => text.length > 0 && text.split('').every((ch) => '0123456789'.includes(ch));

function isDate(text) {
  return typeof text === 'string' && text.length === 10 && text[4] === '-' && text[7] === '-' && isDigits(text.slice(0, 4)) && isDigits(text.slice(5, 7)) && isDigits(text.slice(8, 10));
}

function checkTask(task) {
  const problems = [];
  if (typeof task.title !== 'string' || task.title.trim().length === 0) problems.push('title is missing');
  if (![1, 2, 3].includes(task.priority)) problems.push('priority must be 1, 2 or 3');
  if (task.due !== null && !isDate(task.due)) problems.push('due must be YYYY-MM-DD or null');
  return problems;
}`,
          tests: {
            kind: 'function',
            fn: 'checkTask',
            cases: [
              {
                label: 'a good task',
                args: [{ title: 'Pay bill', priority: 1, due: '2026-11-20' }],
                expected: [],
              },
              {
                label: 'no deadline is fine',
                args: [{ title: 'Clean', priority: 3, due: null }],
                expected: [],
              },
              {
                label: 'a blank title',
                args: [{ title: '   ', priority: 1, due: null }],
                expected: ['title is missing'],
              },
              {
                label: 'two problems in order',
                args: [{ title: 'x', priority: 4, due: '2026-1-20' }],
                expected: ['priority must be 1, 2 or 3', 'due must be YYYY-MM-DD or null'],
              },
              {
                label: 'a title that is not text',
                args: [{ title: 42, priority: 2, due: null }],
                expected: ['title is missing'],
                hidden: true,
              },
              {
                label: 'all three problems',
                args: [{ title: '', priority: 0, due: 'soon' }],
                expected: ['title is missing', 'priority must be 1, 2 or 3', 'due must be YYYY-MM-DD or null'],
                hidden: true,
              },
            ],
          },
          hints: [
            'Push one message per broken rule, in the order the prompt lists them.',
            "A title is bad when `typeof task.title !== 'string'` or when `task.title.trim().length === 0`.",
            'The due rule is `task.due !== null && !isDate(task.due)`.',
          ],
          explanation: 'Each rule is one if statement that pushes a message. Because every rule runs, a task with several problems reports all of them in the listed order.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-69-q1',
        prompt: 'Which description is an operation you can attach a cost to?',
        choices: [
          'Search should be smart and understand what people mean when they type',
          'Given a word, return every task whose title contains it',
          'The app should feel fast enough that nobody ever notices any delay',
          'Tasks need to be organized well so that people find what they want',
        ],
        answer: 1,
        explanation: 'An operation names its input and its output, so you can count the work. The other three are wishes that do not say what the program does.',
      },
      {
        id: 'data-structures-algorithms-69-q2',
        prompt: 'The plan keeps tasks in one Map and treats the other structures as views that follow change events. What is the main benefit?',
        choices: [
          'The Map always uses less memory than an array of the same tasks would',
          'Each structure can be updated in any order without any of the others noticing',
          'Tasks can only be created and never deleted, so every view stays simple',
          'One source of truth: a stale view can be spotted by comparing with it',
        ],
        answer: 3,
        explanation: 'With one authoritative store, "every id in an index exists in the Map" is a rule you can test. If each structure held its own copy, nothing would say which one is right.',
      },
      {
        id: 'data-structures-algorithms-69-q3',
        prompt: 'Why are due dates stored as strings like `2026-11-20`?',
        choices: [
          'JavaScript has no way to store numbers that stand for calendar dates',
          'Year-month-day strings sort correctly as text, so no Date object is needed',
          'Strings always use less memory than the numbers that would stand for dates',
          'A string can hold a time zone, which a plain number cannot hold at all',
        ],
        answer: 1,
        explanation: 'The biggest unit comes first, so alphabetical order equals calendar order. That is why `<` works on these strings and why the in-app runner needs no dates.',
      },
      {
        id: 'data-structures-algorithms-69-q4',
        prompt: 'Your test plan says: "after undo, the task has its old priority". When should you write that check?',
        choices: [
          'After the code works, using whatever the code prints as the expected value',
          'Only if a bug is found later, once a user has complained about it',
          'Before the code, with the answer decided in advance',
          'Never, because undo is too simple a feature to need a test at all',
        ],
        answer: 2,
        explanation: "If you copy the code's output into the expected value, the test only proves the code agrees with itself. Deciding the answer first makes the test an independent judge.",
      },
      {
        id: 'data-structures-algorithms-69-q5',
        audience: { max: 'beginner' },
        prompt: 'In the barangay hall picture, which object matches "opening a task by its number"?',
        choices: [
          'The numbered folders in the cabinet',
          'The logbook that lists every change in order',
          'The tray where the urgent requests are kept on top',
          'The strings that join requests which wait for others',
        ],
        answer: 0,
        explanation: 'A numbered folder is reached by its number without reading the others, which is exactly what a Map by id does.',
      },
      {
        id: 'data-structures-algorithms-69-q6',
        audience: { min: 'advanced' },
        prompt: "A reviewer finds that, after an update, a task appears in the old category's index and the new one. What does your invariant checker report, and where is the likely bug?",
        choices: [
          'A stale id in the old category set: the update forgot to unindex',
          'A missing id in the Map; the update path forgot to store the new task in it',
          'A duplicate id in the heap; the scheduler pushed the same entry twice somewhere',
          'Nothing, because a Set cannot hold the same id twice, whatever the code does',
        ],
        answer: 0,
        explanation: 'An id that sits in a set for a category the task no longer has is a stale entry. It comes from an update that indexed the new version without removing the old one.',
      },
    ],
    task: {
      title: 'Write your own plan',
      minutes: 20,
      steps: [
        'On paper or in a file, list the ten required features of the task manager and rewrite each as an operation with an input and an output.',
        'For each operation write the structure you would use, its cost, and the one size at which a simple array scan would start to hurt.',
        'Copy the `taskProblems` code, run it, then add a rule that rejects a `dependsOn` that is not an array.',
        'Write five check() lines for your test plan with the answers decided first. They should fail now, because nothing is built yet.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Run the scan baseline with 200 tasks and then 2,000. Write down how many tasks the scan looks at for the last task each time, and notice how it grows.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Write the invariants of the design as three sentences (for example, "every id in byCategory exists in byId"), then decide which event each one could be violated by.',
        ],
      },
    ],
  },
  {
    id: 'data-structures-algorithms-70',
    day: 70,
    title: 'Build Tasks, Categories and Fast Search',
    summary: 'Build the core of the task manager: a Map of tasks, a category tree, two indexes that stay in step on every write, and search and filter that use them.',
    intro: {
      objectives: [
        'Build a category tree with a path, a subtree and a safe move',
        'Keep a Map of tasks and two indexes consistent through one write path',
        'Search by words and filter by category using the indexes',
        'Check the indexes with an invariant checker',
      ],
      why: 'Most slow apps are slow because they scan data they could have looked up. Building the indexes yourself shows what an AI-written version must also do, and how to catch it when an index goes stale.',
    },
    minutes: 30,
    skills: ['hashing', 'trees-heaps', 'choose-structure'],
    body: [
      {
        type: 'paragraph',
        text: "Yesterday's plan gave every operation a structure. Today you build the first three: tasks in a Map by id, categories in a tree, and two indexes that let you find tasks by category and by word without scanning. The new difficulty is not any single structure, since you know them all. It is keeping several structures telling the same story after every create, update and delete. We solve that by letting exactly one method change anything.",
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A cookbook has an index at the back: *rice* is on pages 12, 40 and 88. You never read the whole book to find the rice recipes. But if you write a new recipe into the book, the index is wrong until you add its page. If you move a recipe to another chapter, the old entry must also go. An index is fast to read and costs effort to keep correct.',
      },
      {
        type: 'paragraph',
        text: 'The picture stops at one point: a printed index is made once, while ours changes on every keystroke of every edit, so the work of keeping it correct has to be automatic and in one place.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'The **store** holds tasks in a `Map` from id to task. A task is never changed in place: an update builds a new task object and replaces the old one. We freeze each task with `Object.freeze` so a mistake that tries to change one fails loudly. This is the same idea as the immutable updates of module 17, and it makes a `before` and an `after` copy safe to keep.',
      },
      {
        type: 'paragraph',
        text: 'Two **indexes** sit beside the Map. `byCategory` maps a category name to a `Set` of task ids. `byWord` maps each lower-case word of a title to the `Set` of ids whose title contains it. Looking up a word or a category costs O(1) on average and returns exactly the candidates, so we never touch the other tasks.',
      },
      {
        type: 'paragraph',
        text: 'Every change goes through one method, `commit(id, after, origin)`. It reads the `before` task (or `null`), removes `before` from the indexes, adds `after` to them, stores or removes the task in the Map, and finally **announces** the change to listeners as an event with `before` and `after`. Create has no `before`, delete has no `after`, and update has both. Because create, update, delete and (next lesson) undo all use `commit`, no path can forget to update an index. Each write also gets a **version** from an increasing counter, which lesson 71 uses to recognise out-of-date entries.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: think of the Map as the filing cabinet and the two indexes as sticky labels on the cabinet front. Whenever you put a folder in, take one out or change what is written on it, you also fix the labels. If that job is done by exactly one person who follows one checklist, the labels never lie.',
      },
      {
        type: 'paragraph',
        text: "**Categories** form a tree. A node has a `name`, a `parent` and a list of `children`, and a `Map` from name to node gives O(1) access to any node. `path` walks up the parents until the root and builds the list. `subtree` is a depth-first walk, a recursion that visits a node and then each child. `move` re-parents a node, and must refuse to move a category inside itself, which would cut it off from the root: we detect that by checking whether the new parent's path already contains the category.",
      },
      {
        type: 'table',
        headers: ['Operation', 'How it runs', 'Cost'],
        rows: [
          ['Get a task by id', 'One Map lookup', 'O(1) average'],
          [
            'Create or delete a task with w distinct title words',
            'One Map write, one category index change, w word index changes',
            'O(w) average',
          ],
          ['Update a task', 'Remove old version from the indexes, add the new one', 'O(w) average'],
          [
            'Tasks of a category',
            'One lookup, or one per category of the subtree for deep',
            'O(1) + O(k) for k results',
          ],
          [
            'Search several words',
            'One lookup per word, then intersect starting from the smallest set',
            'O(size of the smallest set) per intersection',
          ],
          ['Subtree of a category', 'Depth-first walk', 'O(nodes in the subtree)'],
        ],
        caption: 'What the store costs. Averages assume the Map and Set behave as in module 8.',
      },
      {
        type: 'paragraph',
        text: '**Filtering** combines the indexes with plain checks. We ask the indexes for the smallest candidate pool (the words, the category, or both intersected), and only then test the remaining conditions (status, priority, due date) on each candidate. A counter, `examined`, records how many tasks we looked at, so you can show that an indexed filter looks at far fewer tasks than a scan would. A whole-word index cannot answer "tasks containing *elec*"; for prefixes you would add the trie of module 12.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'In a real codebase this is a secondary-index pattern, and the trade is write amplification: each write now touches the primary map and every index, so the cost of a write grows with the number of indexed fields. Key design questions are tokenization (here a plain split on spaces and lower-casing, which ignores punctuation and accents), whether intersections start from the smallest set (they do, which bounds work by the rarest word), and how memory grows with distinct words. Frozen records give cheap `before` and `after` snapshots, which is exactly what an undo log and an invariant checker need.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'First the small helpers. `addTo` and `removeFrom` maintain a Map of Sets, and `removeFrom` deletes a key once its set is empty so no empty sets pile up. `intersect` walks the smaller set.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Helpers',
        code: `const TODO = 'todo';
const DONE = 'done';

function words(text) {
  return text.toLowerCase().split(' ').filter((word) => word.length > 0);
}

function addTo(map, key, id) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(id);
}

function removeFrom(map, key, id) {
  const ids = map.get(key);
  if (!ids) return;
  ids.delete(id);
  if (ids.size === 0) map.delete(key);
}

function intersect(a, b) {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  const result = new Set();
  for (const id of small) if (large.has(id)) result.add(id);
  return result;
}`,
      },
      {
        type: 'paragraph',
        text: 'The category tree. Everything in it is a few lines, because the Map gives access to any node.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'CategoryTree',
        code: `class CategoryTree {
  constructor(rootName = 'All') {
    this.root = rootName;
    this.nodes = new Map();
    this.nodes.set(rootName, { name: rootName, parent: null, children: [] });
  }

  has(name) {
    return this.nodes.has(name);
  }

  add(name, parentName = this.root) {
    if (this.nodes.has(name)) throw new Error(\`Category already exists: \${name}\`);
    const parent = this.nodes.get(parentName);
    if (!parent) throw new Error(\`No such parent category: \${parentName}\`);
    this.nodes.set(name, { name, parent: parentName, children: [] });
    parent.children.push(name);
  }

  path(name) {
    const result = [];
    let node = this.nodes.get(name);
    while (node) {
      result.unshift(node.name);
      node = node.parent === null ? null : this.nodes.get(node.parent);
    }
    return result;
  }

  subtree(name) {
    const names = [];
    const visit = (current) => {
      names.push(current);
      for (const child of this.nodes.get(current).children) visit(child);
    };
    visit(name);
    return names;
  }

  move(name, newParentName) {
    if (name === this.root) throw new Error('The root cannot move');
    if (!this.nodes.has(newParentName)) throw new Error(\`No such parent category: \${newParentName}\`);
    if (this.path(newParentName).includes(name)) throw new Error(\`Cannot move \${name} inside itself\`);
    const node = this.nodes.get(name);
    const oldParent = this.nodes.get(node.parent);
    oldParent.children = oldParent.children.filter((child) => child !== name);
    node.parent = newParentName;
    this.nodes.get(newParentName).children.push(name);
  }
}`,
      },
      {
        type: 'paragraph',
        text: 'The store, in four pieces that all belong inside `class TaskStore { ... }`. First the constructor, the listeners and the one write path.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'TaskStore, part 1 (fragment: inside the class)',
        code: `  constructor(categories, today) {
    this.categories = categories;
    this.today = today;
    this.byId = new Map();
    this.byCategory = new Map();
    this.byWord = new Map();
    this.nextId = 1;
    this.clock = 0;
    this.listeners = [];
    this.examined = 0;
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  get(id) {
    return this.byId.get(id) ?? null;
  }

  validate(task) {
    if (typeof task.title !== 'string' || task.title.trim().length === 0) throw new Error('A task needs a title');
    if (![1, 2, 3].includes(task.priority)) throw new Error('Priority must be 1 (urgent), 2 or 3');
    if (task.due !== null && !isDate(task.due)) throw new Error(\`Due must be YYYY-MM-DD or null, got \${task.due}\`);
    if (!this.categories.has(task.category)) throw new Error(\`Unknown category: \${task.category}\`);
  }

  commit(id, after, origin) {
    const before = this.byId.get(id) ?? null;
    let stored = null;
    if (after !== null) {
      this.clock += 1;
      stored = Object.freeze({ ...after, id, version: this.clock });
    }
    if (before !== null) this.unindex(before);
    if (stored !== null) {
      this.index(stored);
      this.byId.set(id, stored);
    } else {
      this.byId.delete(id);
    }
    const type = before === null ? 'create' : stored === null ? 'delete' : 'update';
    const event = { type, id, before, after: stored, origin };
    for (const listener of this.listeners) listener(event);
    return stored;
  }`,
      },
      {
        type: 'paragraph',
        text: 'Then indexing, and the three ways to change a task. Each builds an `after` task and hands it to `commit`.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'TaskStore, part 2 (fragment: inside the class)',
        code: `  index(task) {
    addTo(this.byCategory, task.category, task.id);
    for (const word of new Set(words(task.title))) addTo(this.byWord, word, task.id);
  }

  unindex(task) {
    removeFrom(this.byCategory, task.category, task.id);
    for (const word of new Set(words(task.title))) removeFrom(this.byWord, word, task.id);
  }

  create(fields) {
    const task = {
      title: fields.title,
      priority: fields.priority ?? 2,
      due: fields.due ?? null,
      category: fields.category ?? this.categories.root,
      created: fields.created ?? this.today,
      status: TODO,
      dependsOn: Object.freeze([...(fields.dependsOn ?? [])]),
    };
    this.validate(task);
    const id = this.nextId;
    this.nextId += 1;
    return this.commit(id, task, 'user');
  }

  update(id, changes) {
    const current = this.get(id);
    if (current === null) throw new Error(\`No task \${id}\`);
    const next = { ...current, ...changes, id, created: current.created };
    if (changes.dependsOn) next.dependsOn = Object.freeze([...changes.dependsOn]);
    this.validate(next);
    return this.commit(id, next, 'user');
  }

  delete(id) {
    if (this.get(id) === null) throw new Error(\`No task \${id}\`);
    this.commit(id, null, 'user');
  }

  restore(id, snapshot, origin) {
    return this.commit(id, snapshot, origin);
  }`,
      },
      { type: 'paragraph', text: 'Then the queries that use the indexes.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'TaskStore, part 3 (fragment: inside the class)',
        code: `  idsInCategory(name, deep) {
    const names = deep ? this.categories.subtree(name) : [name];
    const ids = new Set();
    for (const each of names) for (const id of this.byCategory.get(each) ?? []) ids.add(id);
    return ids;
  }

  idsForText(text) {
    const sets = words(text).map((word) => this.byWord.get(word) ?? new Set());
    if (sets.length === 0) return new Set();
    sets.sort((a, b) => a.size - b.size);
    return sets.reduce((merged, set) => intersect(merged, set));
  }

  filter({ category, deep = false, text, status, maxPriority, dueBefore } = {}) {
    let pool = null;
    if (text !== undefined) pool = this.idsForText(text);
    if (category !== undefined) {
      const inCategory = this.idsInCategory(category, deep);
      pool = pool === null ? inCategory : intersect(pool, inCategory);
    }
    const ids = pool === null ? this.byId.keys() : pool;
    const found = [];
    this.examined = 0;
    for (const id of ids) {
      const task = this.byId.get(id);
      this.examined += 1;
      if (status !== undefined && task.status !== status) continue;
      if (maxPriority !== undefined && task.priority > maxPriority) continue;
      if (dueBefore !== undefined && (task.due === null || task.due >= dueBefore)) continue;
      found.push(task);
    }
    return found.sort((a, b) => a.id - b.id);
  }`,
      },
      {
        type: 'paragraph',
        text: 'And the invariant checker, which compares the indexes with the Map.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'TaskStore, part 4 (fragment: inside the class)',
        code: `  checkIndexes() {
    const problems = [];
    for (const task of this.byId.values()) {
      if (!this.byCategory.get(task.category)?.has(task.id)) problems.push(\`task \${task.id} missing from category index\`);
      for (const word of words(task.title)) if (!this.byWord.get(word)?.has(task.id)) problems.push(\`task \${task.id} missing from word "\${word}"\`);
    }
    for (const [name, ids] of this.byCategory) for (const id of ids) if (!this.byId.has(id) || this.byId.get(id).category !== name) problems.push(\`category \${name} lists stale id \${id}\`);
    for (const [word, ids] of this.byWord) for (const id of ids) if (!this.byId.has(id) || !words(this.byId.get(id).title).includes(word)) problems.push(\`word \${word} lists stale id \${id}\`);
    return problems;
  }
}`,
      },
      {
        type: 'paragraph',
        text: 'Put the four parts, in order, between `class TaskStore {` and a closing `}`, keep the lesson 69 `check` helper, and run a small scenario.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A scenario',
        code: `const categories = new CategoryTree();
categories.add('Home');
categories.add('Bills', 'Home');
categories.add('Work');
categories.add('Reports', 'Work');
categories.add('School');

const store = new TaskStore(categories, '2026-11-16');
store.create({ title: 'Pay electric bill', priority: 1, due: '2026-11-20', category: 'Bills', created: '2026-11-10' });
store.create({ title: 'Pay water bill', priority: 2, due: '2026-11-25', category: 'Bills', created: '2026-11-11' });
store.create({ title: 'Write monthly report', priority: 1, due: '2026-11-18', category: 'Reports', created: '2026-11-12' });
store.create({ title: 'Clean the garage', priority: 3, category: 'Home', created: '2026-11-12' });
store.create({ title: 'Study for the report quiz', priority: 2, due: '2026-11-19', category: 'School', created: '2026-11-13' });

console.log(categories.path('Bills'));
console.log(categories.subtree('Home'));
console.log(store.filter({ category: 'Home', deep: true }).map((task) => task.title));
console.log(store.filter({ text: 'report' }).map((task) => task.title));
console.log(store.filter({ text: 'pay bill', maxPriority: 1 }).map((task) => task.title), store.examined);`,
      },
      { type: 'paragraph', text: 'Then change the data and check the indexes again.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Update, delete, check',
        code: `store.update(1, { title: 'Pay Meralco bill', category: 'Home' });
store.delete(2);
console.log(store.filter({ text: 'bill' }).map((task) => task.title));
console.log(store.filter({ category: 'Bills' }).length);
console.log(store.checkIndexes());
check('indexes stay in step', store.checkIndexes(), []);`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          "`commit` is the heart. It finds `before` in the Map, stamps `after` with a new version (and freezes it), calls `unindex(before)` and `index(stored)`, writes the Map, then loops over `this.listeners`. The event's `type` is worked out from which of `before` and `after` exist.",
          "`create` fills defaults (priority 2, no deadline, the root category, today's date) and calls `validate`, which throws a clear error for a blank title, a priority outside 1 to 3, a bad date or an unknown category. Ids come from `nextId`, which only grows, so an id is never reused.",
          '`update` spreads the current task, then the changes, then forces `id` and `created` back, so a caller cannot change them. `delete` is `commit(id, null)`.',
          '`idsInCategory(name, true)` collects the ids of every category in `subtree(name)`. `idsForText` looks up one Set per word, sorts the sets by size and intersects from the smallest.',
          "`filter` builds a pool from `text` and `category`, then loops over the pool only. For the call with `text: 'pay bill'` and `maxPriority: 1`, the pool is the two bills and `examined` is 2, not 5.",
        ],
      },
      {
        type: 'table',
        headers: [
          'Step of update(1, { title: "Pay Meralco bill", category: "Home" })',
          'byCategory',
          'byWord',
        ],
        rows: [
          [
            'Before: task 1 is "Pay electric bill" in Bills',
            'Bills: 1 (with 2)',
            'pay: 1, 2; electric: 1; bill: 1, 2',
          ],
          ['unindex(before)', 'Bills: 2', 'pay: 2; bill: 2; electric removed (empty set)'],
          ['index(after)', 'Bills: 2, Home: 1 (with 4)', 'pay: 1, 2; meralco: 1; bill: 1, 2'],
          ['Map write, then the event goes to listeners', 'unchanged', 'unchanged'],
        ],
        caption: 'The old words and category leave before the new ones come in. Forgetting the first step leaves task 1 in Bills for ever.',
      },
      {
        type: 'warning',
        text: 'Every method that changes a task must go through `commit`. A shortcut such as `this.byId.set(id, task)` in one place is how an index silently goes stale, and AI-written code does it often: check every write.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Predict first. Read `commit` and write down, in one sentence each, what would break if `unindex(before)` were removed, and what would break if the listeners ran before the Map was written. Then ask for a check, not for the answer.',
      },
      {
        type: 'prompt',
        label: 'Make me test my own claim',
        text: 'Here is my TaskStore (JavaScript): [paste the commit, create, update and delete methods]. I think that if `unindex(before)` is removed, then ______, and that if listeners run before the Map is written, then ______. Do not tell me whether I am right. Give me one small input (a sequence of create/update calls) for each claim that I can run to find out, and tell me what output I should expect if I am right.',
      },
      {
        type: 'paragraph',
        text: 'Run both inputs. If the assistant\'s expected output differs from what the code prints, trust the code and find out why: either the claim or the input is wrong. Assistants sometimes describe an index as updating "automatically"; in this design it only happens because `commit` does it.',
      },
      {
        type: 'takeaways',
        items: [
          'Keep tasks in one Map by id and change them only through one write path, so every index is updated in one place.',
          'Immutable, frozen tasks make a before and an after snapshot safe to keep and compare.',
          'A Map of Sets gives O(1) access to a category or word; intersect from the smallest set to bound the work.',
          'A category tree is a Map of nodes with parents and children; path walks up, subtree walks down, move must refuse a cycle.',
          'Write an invariant checker that compares each index with the Map; run it after your tests.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-70-predict-output-1',
          kind: 'predict-output',
          title: 'Build a word index by hand',
          prompt: 'The code builds a word index for three titles. What does it print?',
          concept: 'trace a word index',
          language: 'javascript',
          code: `const titles = { 1: 'pay bill', 2: 'pay rent', 3: 'bill report' };
const byWord = new Map();
for (const id of [1, 2, 3]) {
  for (const word of titles[id].split(' ')) {
    if (!byWord.has(word)) byWord.set(word, new Set());
    byWord.get(word).add(id);
  }
}
console.log([...byWord.get('pay')]);
console.log(byWord.size);
const both = [...byWord.get('pay')].filter((id) => byWord.get('bill').has(id));
console.log(both);`,
          expected: `[ 1, 2 ]
4
[ 1 ]`,
          choices: [
            `[ 1, 2 ]
4
[ 1 ]`,
            `[ 1, 2 ]
5
[ 1 ]`,
            `[ 1, 2 ]
4
[ 1, 3 ]`,
            `[ 1, 2, 3 ]
4
[ 1 ]`,
          ],
          wrongNotes: {
            '[ 1, 2 ]\n5\n[ 1 ]': 'The Map has one key per distinct word. The words are pay, bill, rent and report, which is four. A repeated word does not add a key.',
            '[ 1, 2 ]\n4\n[ 1, 3 ]': 'The last line keeps only the ids that appear in both the pay set and the bill set. Id 3 has bill but not pay.',
            '[ 1, 2, 3 ]\n4\n[ 1 ]': 'Only titles 1 and 2 contain pay. Title 3 is bill report.',
          },
          hints: [
            'Write the title of each id and mark which words it contains.',
            'The size is the number of distinct words across all titles.',
            'The filter keeps ids that are in the pay set and in the bill set.',
          ],
          explanation: 'pay is in titles 1 and 2. The distinct words are pay, bill, rent and report. Only title 1 contains both pay and bill.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-70-fix-bug-1',
          kind: 'fix-bug',
          title: 'The task that stayed in two categories',
          prompt: 'Moving task 1 from Bills to Home should leave Bills holding only task 2, and Home holding task 1. The output is wrong. Tap the buggy line, then pick the fix.',
          concept: 'keeping an index in step',
          language: 'javascript',
          code: `const byCategory = new Map();
const task = { id: 1, category: 'Bills' };

function addTo(map, key, id) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(id);
}

function moveTask(task, newCategory) {
  addTo(byCategory, newCategory, task.id);
  byCategory.get(newCategory).delete(task.id);
  task.category = newCategory;
}

addTo(byCategory, 'Bills', 1);
addTo(byCategory, 'Bills', 2);
moveTask(task, 'Home');
console.log([...byCategory.get('Bills')]);
console.log([...byCategory.get('Home')]);`,
          bugLine: 11,
          fixes: [
            {
              line: '  byCategory.get(task.category).delete(task.id);',
              correct: true,
              why: 'It removes the id from the set of the category the task is leaving, which is still task.category at this point.',
            },
            {
              line: '  byCategory.delete(task.category);',
              correct: false,
              why: 'This removes the whole Bills entry, so task 2 would disappear from the index as well.',
            },
            {
              line: '  byCategory.get(task.category).clear();',
              correct: false,
              why: 'This empties the whole Bills set and loses task 2.',
            },
            {
              line: '  byCategory.get(newCategory).add(task.id);',
              correct: false,
              why: 'This adds the id to Home again and removes nothing from Bills.',
            },
          ],
          tests: { kind: 'output', expected: ['[ 2 ]', '[ 1 ]'] },
          lineNote: 'The output shows the task still in the old category and missing from the new one. Which line removes it from a set?',
          hints: [
            'Bills should lose task 1, and Home should keep it. Which set does the removing line touch?',
            'Line 11 deletes from the set of newCategory, right after line 10 added the id there.',
            'The id must leave the set of the category the task has now, `task.category`, before that changes.',
          ],
          explanation: 'The removal must hit the old category (task.category). Deleting from newCategory undoes the line before it, so the task stays in Bills and Home ends up empty.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-70-fill-blank-1',
          kind: 'fill-blank',
          title: 'Walk down the category tree',
          prompt: 'Complete the recursive `subtree` function: it returns the name followed by all names below it, parents before children.',
          concept: 'subtree traversal',
          language: 'javascript',
          code: `const children = { All: ['Home', 'Work'], Home: ['Bills'], Work: [], Bills: [] };

function subtree(name) {
  const names = [___];
  for (const child of children[___]) {
    names.push(...___(child));
  }
  return names;
}

console.log(subtree('Home'));
console.log(subtree('All'));`,
          blanks: [
            { answers: ['name'], feedback: 'The list starts with the node itself.' },
            { answers: ['name'], feedback: 'We loop over the children of the node we were given.' },
            {
              answers: ['subtree'],
              feedback: 'The function calls itself on each child, which is recursion.',
            },
          ],
          bank: ['name', 'name', 'child', 'subtree', 'children', 'names'],
          tests: {
            kind: 'output',
            expected: ["[ 'Home', 'Bills' ]", "[ 'All', 'Home', 'Bills', 'Work' ]"],
          },
          hints: [
            'The first element of the result is the node itself.',
            'children is an object keyed by category name, so you index it with the name you were given.',
            'The recursive call is the function you are writing, applied to each child.',
          ],
          explanation: "The result starts with the node, then for each child the function appends that child's whole subtree. That is a depth-first, parent-first walk.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-70-match-1',
          kind: 'match',
          title: 'Count the work',
          prompt: 'Match each operation to the work it does.',
          concept: 'compare complexity',
          labels: { terms: 'Operation', meanings: 'Work' },
          pairs: [
            {
              term: 'Reach the Set of ids for one category name',
              definition: 'One lookup, O(1) on average',
              note: 'Reaching a key in a Map does not depend on how many keys there are.',
            },
            {
              term: 'Intersect a word set of 3 ids with a word set of 40,000 ids',
              definition: 'About 3 checks, the size of the smaller set',
              note: 'The loop runs over the smaller set and asks the larger one O(1) questions.',
            },
            {
              term: 'List a category whose subtree has 12 categories',
              definition: '12 visits, one per node',
              note: 'A depth-first walk visits each node of the subtree once.',
            },
            {
              term: 'Update a task whose title has 4 distinct words',
              definition: 'About 4 word-index removals and 4 additions plus the Map write',
              note: 'Each distinct word is removed for the old title and added for the new one.',
            },
          ],
          hints: [
            'Ask what the work depends on: the size of the data, the size of a result, or something small.',
            'For an intersection, think about which set the loop walks.',
            'A tree walk does constant work per node it visits.',
          ],
          explanation: 'Costs come from what the loop walks over: nothing for a Map lookup, the smaller set for an intersection, each node for a subtree, each word for an update.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-70-code-challenge-1',
          kind: 'code-challenge',
          title: 'Build the word index',
          prompt: 'Write `buildWordIndex(tasks)`. `tasks` is an array of `{ id, title }`. Return a plain object that maps each lower-case word (titles split on spaces) to an ascending array of the ids whose title contains that word. A word repeated in one title still lists the id once.',
          concept: 'implementing an index',
          language: 'javascript',
          starter: `function buildWordIndex(tasks) {
  const index = new Map();
  // for every task, add its id to the Set of each word in its lower-case title
  const result = {};
  // turn each Set into a sorted array of ids
  return result;
}`,
          solution: `function buildWordIndex(tasks) {
  const index = new Map();
  for (const task of tasks) {
    for (const word of task.title.toLowerCase().split(' ')) {
      if (word.length === 0) continue;
      if (!index.has(word)) index.set(word, new Set());
      index.get(word).add(task.id);
    }
  }
  const result = {};
  for (const [word, ids] of index) result[word] = [...ids].sort((a, b) => a - b);
  return result;
}`,
          tests: {
            kind: 'function',
            fn: 'buildWordIndex',
            cases: [
              {
                label: 'two tasks sharing a word',
                args: [[{ id: 1, title: 'Pay bill' }, { id: 2, title: 'pay rent' }]],
                expected: { pay: [1, 2], bill: [1], rent: [2] },
              },
              { label: 'no tasks', args: [[]], expected: {} },
              {
                label: 'a repeated word counts once',
                args: [[{ id: 7, title: 'Call call Mom' }]],
                expected: { call: [7], mom: [7] },
              },
              {
                label: 'ids come out ascending',
                args: [[{ id: 9, title: 'Fix roof' }, { id: 3, title: 'fix sink' }]],
                expected: { fix: [3, 9], roof: [9], sink: [3] },
                hidden: true,
              },
              {
                label: 'extra spaces are ignored',
                args: [[{ id: 4, title: '  Buy   rice ' }]],
                expected: { buy: [4], rice: [4] },
                hidden: true,
              },
            ],
          },
          hints: [
            'Use a Map from word to a Set of ids; a Set ignores a repeated id for you.',
            'Lower-case the title, split it on a space, and skip empty pieces.',
            'At the end, copy each Set into a sorted array: `[...ids].sort((a, b) => a - b)`.',
          ],
          explanation: 'The Map of Sets is the index. The Set removes repeated words in one title, skipping empty pieces handles extra spaces, and sorting the ids at the end gives a stable answer.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-70-q1',
        prompt: 'Why do create, update and delete all call one `commit` method instead of changing the Map and indexes themselves?',
        choices: [
          'It makes each of those three operations run in O(1) time in the worst case',
          'One place updates everything, so no path can forget one',
          'JavaScript requires every Map write to happen inside a method called commit',
          'It lets two tasks share the same id without the indexes noticing at all',
        ],
        answer: 1,
        explanation: 'With one write path the rules live in one place. Three separate copies of the index code would drift, and the first forgotten unindex is a stale index.',
      },
      {
        id: 'data-structures-algorithms-70-q2',
        prompt: 'A search for "the report" finds 9,000 tasks containing "the" and 12 containing "report". About how many membership checks does the intersection make when it starts from the smaller set?',
        choices: ['About 9,012', 'About 108,000', 'About 9,000', 'About 12'],
        answer: 3,
        explanation: 'The loop walks the 12-id set and asks the large set, in O(1) each, whether it has each id. The rare word bounds the work.',
      },
      {
        id: 'data-structures-algorithms-70-q3',
        prompt: 'What does `store.filter({ category: "Home", deep: true })` return that `deep: false` would not?',
        choices: [
          'Only the tasks that are already marked as done in the whole store',
          'Tasks of Home and of every category below it, such as Bills',
          'Only the tasks of Home that have a deadline set on them',
          'Tasks in the parent of Home as well as those in Home itself',
        ],
        answer: 1,
        explanation: 'With deep, the store asks the tree for the subtree of Home and collects the ids of each category in it.',
      },
      {
        id: 'data-structures-algorithms-70-q4',
        prompt: 'Which statement about moving a category is true?',
        choices: [
          '`move` should accept a new parent inside the moved category, because trees allow moves like that',
          'A category can only ever move if it currently has no tasks in it at all',
          'A category must not move into its own subtree: it would lose its way to the root',
          'Moving a category changes the id of every task that is filed under it',
        ],
        answer: 2,
        explanation: "If A moves under its own child, nothing leads from the root to A any more. `move` detects it because the new parent's path already contains A.",
      },
      {
        id: 'data-structures-algorithms-70-q5',
        audience: { max: 'beginner' },
        prompt: 'In the cookbook picture, what does it mean when the index at the back is "stale"?',
        choices: [
          'It lists a page where the recipe is no longer, or misses one you added',
          'It is printed in a type that is much too small for anybody to read easily',
          'It lists the recipes in alphabetical order instead of the order of the pages',
          'It has more pages in it than the cookbook that it belongs to',
        ],
        answer: 0,
        explanation: 'A stale index disagrees with the book. In the task manager the same thing happens when an index lists a task in a category or word it no longer has.',
      },
      {
        id: 'data-structures-algorithms-70-q6',
        audience: { min: 'advanced' },
        prompt: 'Users now search for the prefix "elec" and expect "electric". Which change keeps writes and reads cheap?',
        choices: [
          'Scan every title with `includes` on each keystroke the user types in the box',
          'Add a trie over the distinct indexed words, updated in `index` and `unindex`',
          'Store every possible substring of every title as a key in the word Map',
          'Sort the tasks by id so that the typed prefix can be binary searched in them',
        ],
        answer: 1,
        explanation: 'A trie answers prefix queries in time proportional to the prefix and the matches, and the word index already gives the distinct words to put in it. A scan grows with the data, and storing every substring blows up memory.',
      },
    ],
    task: {
      title: 'Break an index, then catch it',
      minutes: 20,
      steps: [
        'Assemble the lesson code and run the scenario. Confirm `checkIndexes()` prints `[]`.',
        'Comment out `this.unindex(before)` inside `commit` and run again. Read what `checkIndexes()` reports for the update and the delete.',
        'Restore it. Add a method `countByCategory(name, deep)` that returns the number of tasks, using `idsInCategory`.',
        'Write two check() lines for it: one for a category with subcategories and one for a missing category name (what should it return?).',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Draw the cookbook index for your five favourite tasks on paper: one column of words, one of task numbers. Then change one title and fix your drawing the way `commit` would.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Add a `dueIndex`: a sorted array of due dates with ids, kept up to date in `index` and `unindex`. State the write cost, and decide whether `filter({ dueBefore })` can now use binary search.',
        ],
      },
    ],
  },
  {
    id: 'data-structures-algorithms-71',
    day: 71,
    title: 'Add Priorities, Scheduling, History and Undo and Redo',
    summary: 'Add a min-heap scheduler that always offers the most urgent open task, an append-only history for every change, and undo and redo with two stacks.',
    intro: {
      objectives: [
        'Write a binary min-heap with a comparator and use it as a priority queue',
        'Keep a heap correct while tasks change, using lazy deletion with versions',
        "Record every change in a history log and look up one task's history",
        'Implement undo and redo with two stacks, and explain why a new action clears redo',
      ],
      why: 'Prioritizing and undoing are the features users notice first, and both are easy to get subtly wrong. Knowing how a heap and two stacks behave lets you test an AI-written scheduler or undo feature instead of trusting it.',
    },
    minutes: 30,
    skills: ['trees-heaps', 'linked-structures', 'choose-structure'],
    body: [
      {
        type: 'paragraph',
        text: 'Your store from lesson 70 can hold tasks and find them fast, but it cannot yet answer the question every user asks: what should I do next? Today it learns that, and two more things that make an app feel trustworthy: it remembers what happened, and it can take a change back. All three attach to the store without the store knowing about them. They only listen to its change events.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A triage nurse at a clinic does not call patients in the order they arrived. She picks the most urgent slip from the pile, and when two are equally urgent, the one with the earlier deadline. Suppose a patient is discharged or a slip is rewritten with a new urgency. The nurse does not dig through the pile to remove the old slip. She leaves it, and when it reaches the top she notices it is out of date and throws it away.',
      },
      {
        type: 'paragraph',
        text: 'That is the scheduler. For undo, picture two trays on a desk: *done* and *taken back*. Undo moves the top slip from the first tray to the second after reversing it. Redo moves it back. Writing a brand new slip empties the second tray, because the future you undid no longer follows from the present. The picture breaks where slips are paper: our slips are frozen snapshots, so reversing one is just putting the old snapshot back.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'A **binary min-heap** is a complete binary tree stored in an array where every parent is no larger than its children, by a comparator we choose. The children of index `i` are at `2i + 1` and `2i + 2`, and the parent is at `Math.floor((i - 1) / 2)`. **Push** adds at the end and swaps upward while the new item beats its parent (sift up). **Pop** takes the root, moves the last item to the root, and swaps it downward with the smaller child while it loses (sift down). Peek is O(1); push and pop are O(log n), because the tree is about log2 n levels tall.',
      },
      {
        type: 'visual',
        id: 'heap-operations',
        caption: 'Press Next to watch a value sift up after an insert and sift down after an extract. Which swaps happen, and how many levels can there be at most?',
      },
      {
        type: 'paragraph',
        text: 'Our comparator, `compareUrgency`, ranks by priority (1 first), then due date (a task with no deadline comes last), then id, so two tasks are never tied. The scheduler stores small entries `{ id, version, priority, due }` rather than the tasks.',
      },
      {
        type: 'paragraph',
        text: "The heap cannot find an arbitrary entry quickly, so the scheduler never edits one. Whenever the store announces a write, the scheduler **pushes a new entry** for the task if it is open. Old entries stay behind. When one reaches the top, the scheduler checks it against the store: the task must exist, still be `todo`, and have the **same version** as the entry. Any other entry is stale and is dropped for good. This is **lazy deletion**. Versions are why the store's `commit` stamps each write with an increasing number: an undo that restores an old task still receives a new version, so only its fresh entry is valid.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[upcoming asks for k ready tasks] --> B[Pop the most urgent entry]
  B --> C{Is the task still open at this version?}
  C -->|no| D[Stale: drop it for good]
  C -->|yes| E{Is the task blocked?}
  E -->|yes| F[Set it aside to push back]
  E -->|no| G[Ready: keep it]
  D --> H[More needed?]
  F --> H
  G --> H
  H -->|yes| B
  H -->|no| I[Push every kept and set-aside entry back]`,
        caption: 'How the scheduler finds the next ready tasks. Blocked tasks are a hook for lesson 72; for now nothing is blocked.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: the heap is a pile that always keeps the most urgent slip on top without being fully sorted. When a task changes, we add a new slip and ignore the old one when we meet it. We never need to hunt through the pile.',
      },
      {
        type: 'paragraph',
        text: 'The **history** has two parts. The *log* is an append-only array of entries (a number, what changed in words, and who did it: the user, an undo or a redo). A `Map` from task id to its entries makes "the history of task 3" a direct lookup instead of a scan. The *two stacks* hold the events the user can undo and redo. An event carries the `before` and `after` snapshots, so **undo** restores `before` and **redo** restores `after`, both through the store\'s `commit` with an `origin`. Only events with origin `\'user\'` go on the undo stack; if undo itself were recorded as a user action, undo would undo itself. Any new user action empties the redo stack.',
      },
      {
        type: 'table',
        headers: ['Operation', 'Cost'],
        rows: [
          ['Peek the top entry', 'O(1)'],
          ['Push an entry or pop one', 'O(log n)'],
          ['upcoming(k) with s stale entries met on the way', 'O((k + s) log n)'],
          ['Record one history entry', 'O(1) (the log and the Map list)'],
          ['History of one task', 'O(entries of that task)'],
          ['Undo or redo', 'O(1) stack work plus one commit'],
        ],
        caption: 'Costs of lesson 71. A log that is never trimmed grows with every change.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Design notes for a real system. Lazy deletion trades memory for simplicity: stale entries accumulate until they surface, so a task edited a thousand times leaves a thousand entries, and a periodic rebuild from the store bounds the heap at O(n log n) or O(n) with a bottom-up heapify. An indexed heap with decrease-key avoids stale entries at the cost of a position map. The undo stack stores whole snapshots, which is simple and safe with immutable records; a command pattern stores deltas and is smaller but needs a correct inverse for every operation. This undo is local to one process: with several editors you need operational transforms or a server-ordered log, and the limit of 100 entries uses `shift`, which is O(n) in our model, fine at that size and the place a circular buffer would go.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'The heap first. It is generic: it only needs a comparator that returns a negative number when the first item should come out first.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Comparators and the MinHeap',
        code: `const compareText = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const compareDue = (a, b) => compareText(a === null ? '9999-99-99' : a, b === null ? '9999-99-99' : b);
const compareUrgency = (a, b) => a.priority - b.priority || compareDue(a.due, b.due) || a.id - b.id;

class MinHeap {
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  peek() {
    return this.items.length === 0 ? null : this.items[0];
  }

  push(item) {
    this.items.push(item);
    let child = this.items.length - 1;
    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      if (this.compare(this.items[child], this.items[parent]) >= 0) break;
      [this.items[child], this.items[parent]] = [this.items[parent], this.items[child]];
      child = parent;
    }
  }

  pop() {
    if (this.items.length === 0) return null;
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      let parent = 0;
      while (true) {
        const left = 2 * parent + 1;
        const right = left + 1;
        let smallest = parent;
        if (left < this.items.length && this.compare(this.items[left], this.items[smallest]) < 0) smallest = left;
        if (right < this.items.length && this.compare(this.items[right], this.items[smallest]) < 0) smallest = right;
        if (smallest === parent) break;
        [this.items[parent], this.items[smallest]] = [this.items[smallest], this.items[parent]];
        parent = smallest;
      }
    }
    return top;
  }
}`,
      },
      {
        type: 'paragraph',
        text: 'The scheduler listens to the store and pushes an entry for every open task it hears about. `isBlocked` is a function you can replace; lesson 72 plugs the dependency graph in.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The Scheduler',
        code: `class Scheduler {
  constructor(store, isBlocked = () => false) {
    this.store = store;
    this.isBlocked = isBlocked;
    this.heap = new MinHeap(compareUrgency);
    for (const task of store.byId.values()) this.offer(task);
    store.subscribe((event) => {
      if (event.after !== null) this.offer(event.after);
    });
  }

  offer(task) {
    if (task.status === TODO) this.heap.push({ id: task.id, version: task.version, priority: task.priority, due: task.due });
  }

  upcoming(limit) {
    const ready = [];
    const blocked = [];
    while (ready.length < limit && this.heap.size > 0) {
      const entry = this.heap.pop();
      const task = this.store.get(entry.id);
      if (task === null || task.version !== entry.version || task.status !== TODO) continue;
      (this.isBlocked(task) ? blocked : ready).push(entry);
    }
    for (const entry of [...ready, ...blocked]) this.heap.push(entry);
    return ready.map((entry) => this.store.get(entry.id));
  }

  next() {
    return this.upcoming(1)[0] ?? null;
  }
}`,
      },
      {
        type: 'paragraph',
        text: 'The history: a describing function, the log, and the two stacks.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'History',
        code: `function describeChange(event) {
  if (event.type === 'create') return \`created "\${event.after.title}"\`;
  if (event.type === 'delete') return \`deleted "\${event.before.title}"\`;
  const changed = [];
  for (const field of ['title', 'priority', 'due', 'category', 'status', 'dependsOn']) {
    const was = JSON.stringify(event.before[field]);
    const now = JSON.stringify(event.after[field]);
    if (was !== now) changed.push(\`\${field} \${was} -> \${now}\`);
  }
  return \`changed \${changed.join(', ')}\`;
}

class History {
  constructor(store, limit = 100) {
    this.store = store;
    this.limit = limit;
    this.log = [];
    this.byTask = new Map();
    this.undoStack = [];
    this.redoStack = [];
    store.subscribe((event) => this.record(event));
  }

  record(event) {
    const entry = { seq: this.log.length + 1, origin: event.origin, id: event.id, text: describeChange(event) };
    this.log.push(entry);
    if (!this.byTask.has(event.id)) this.byTask.set(event.id, []);
    this.byTask.get(event.id).push(entry);
    if (event.origin === 'user') {
      this.undoStack.push(event);
      if (this.undoStack.length > this.limit) this.undoStack.shift();
      this.redoStack = [];
    }
  }

  historyOf(id) {
    return (this.byTask.get(id) ?? []).map((entry) => \`\${entry.seq}. \${entry.text}\${entry.origin === 'user' ? '' : \` (\${entry.origin})\`}\`);
  }

  undo() {
    const event = this.undoStack.pop();
    if (!event) return false;
    this.store.restore(event.id, event.before, 'undo');
    this.redoStack.push(event);
    return true;
  }

  redo() {
    const event = this.redoStack.pop();
    if (!event) return false;
    this.store.restore(event.id, event.after, 'redo');
    this.undoStack.push(event);
    return true;
  }
}`,
      },
      {
        type: 'paragraph',
        text: 'Now use them together, with the lesson 70 code above. The scheduler and the history are created before any task, because a listener only hears what happens after it subscribes (the scheduler also loads existing tasks in its constructor, but the history does not).',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Scheduling and history',
        code: `const categories = new CategoryTree();
categories.add('Home');
categories.add('Work');
const store = new TaskStore(categories, '2026-11-16');
const scheduler = new Scheduler(store);
const history = new History(store);

store.create({ title: 'Pay electric bill', priority: 1, due: '2026-11-20', category: 'Home' });
store.create({ title: 'Write monthly report', priority: 1, due: '2026-11-18', category: 'Work' });
store.create({ title: 'Clean the garage', priority: 3, category: 'Home' });
store.create({ title: 'Call the plumber', priority: 2, due: '2026-11-17', category: 'Home' });

console.log(scheduler.upcoming(4).map((task) => task.title));
store.update(3, { priority: 1, due: '2026-11-16' });
console.log(scheduler.next().title);
store.update(3, { status: 'done' });
console.log(scheduler.next().title);
console.log(history.historyOf(3));`,
      },
      { type: 'paragraph', text: 'Then undo, redo and the rule about new actions.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Undo and redo',
        code: `history.undo();
console.log(store.get(3).status, scheduler.next().title);
history.undo();
console.log(store.get(3).priority, scheduler.next().title);
history.redo();
console.log(store.get(3).priority, scheduler.next().title);
store.delete(2);
console.log(history.redoStack.length, scheduler.upcoming(10).map((task) => task.id));
history.undo();
console.log(scheduler.upcoming(10).map((task) => task.id), history.undoStack.length, history.redoStack.length);`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`push` appends, then loops while the child is more urgent than its parent: swap, move up. `pop` keeps the root, puts the popped last item at index 0 and sifts it down, picking the smaller of the two children each time. `get size()` is a getter, so `heap.size` reads like a property.',
          '`compareUrgency` chains three comparisons with `||`. `a.priority - b.priority` is 0 when equal, and 0 is falsy, so the next comparison decides. Only when all three tie does `a.id - b.id` end it.',
          'In `upcoming`, `(this.isBlocked(task) ? blocked : ready).push(entry)` picks which list gets the entry. Everything kept, `ready` and `blocked`, is pushed back at the end, because asking what is next must not remove it.',
          'The first output lists the four tasks by urgency: the report (priority 1, due 18th), the electric bill (priority 1, due 20th), the plumber (priority 2) and the garage (priority 3). Changing task 3 to priority 1 with a due date of today puts it first: `Clean the garage`. Marking it done leaves its old entries stale, so `Write monthly report` is next.',
          '`historyOf(3)` shows three entries: the creation, the priority and date change, and the status change. The numbers 3, 5 and 6 are positions in the single log shared by all tasks.',
          'The first `undo` reverts `done`, so the garage is open again and first. The second reverts the priority, so the report is first. `redo` reapplies the priority change. `store.delete(2)` is a new user action, so `redoStack.length` becomes 0, and the upcoming ids no longer include 2. Undoing the delete brings task 2 back: the upcoming list has 2 again, with 5 undo entries and 1 redo entry left.',
        ],
      },
      {
        type: 'tip',
        text: "When something looks wrong in a scheduler, print the heap's entries and compare each with `store.get(id)`. Stale entries are normal; a valid entry whose task is missing from the output is the bug.",
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Predict first: on paper, draw the heap array after pushing priorities 5, 3, 8, 1 and then after one pop. Then ask for a trace to compare against, not for the answer.',
      },
      {
        type: 'prompt',
        label: 'Check my heap trace',
        text: 'I wrote a min-heap in JavaScript using an array, with parent at floor((i-1)/2). I believe that after pushing 5, 3, 8, 1 the array is [ ____ ] and after one pop it is [ ____ ]. Do not correct me directly. Ask me to explain my swaps one step at a time, and point me to the first step where I went wrong, if any. Then give me one tricky input (such as repeated values) to test my own heap code.',
      },
      {
        type: 'paragraph',
        text: 'Run the tricky input on your own code. An assistant may describe sift down as comparing with "the child" and forget it must pick the *smaller* child, or call the heap "sorted". It is not: only the root is guaranteed to be the minimum.',
      },
      {
        type: 'takeaways',
        items: [
          'A binary heap in an array gives O(1) peek and O(log n) push and pop; a comparator decides what "first" means.',
          'When items change, push a fresh entry with a version and discard stale ones as they surface (lazy deletion).',
          'Keep an append-only history log, plus a Map from task id to its entries for fast lookup.',
          'Undo and redo are two stacks of before and after snapshots, applied through the same commit with an origin.',
          'A new user action clears the redo stack, and undo or redo must never be recorded as a new user action.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-71-predict-output-1',
          kind: 'predict-output',
          title: 'Trace the heap',
          prompt: 'This code pushes four values into an array heap. What does the array look like at the end?',
          concept: 'trace heap insertion',
          language: 'javascript',
          code: `function push(heap, value) {
  heap.push(value);
  let child = heap.length - 1;
  while (child > 0) {
    const parent = Math.floor((child - 1) / 2);
    if (heap[parent] <= heap[child]) break;
    [heap[parent], heap[child]] = [heap[child], heap[parent]];
    child = parent;
  }
}

const heap = [];
for (const value of [5, 3, 8, 1]) push(heap, value);
console.log(heap);`,
          expected: '[ 1, 3, 8, 5 ]',
          choices: ['[ 1, 3, 8, 5 ]', '[ 1, 3, 5, 8 ]', '[ 5, 3, 8, 1 ]', '[ 1, 5, 8, 3 ]'],
          wrongNotes: {
            '[ 1, 3, 5, 8 ]': 'A heap is not fully sorted. Only each parent is no larger than its children, and 8 is not moved when it has nothing smaller than itself under it.',
            '[ 5, 3, 8, 1 ]': 'That is the order the values were added. Each push swaps the new value upward while it is smaller than its parent.',
            '[ 1, 5, 8, 3 ]': 'Check the second push: 3 is smaller than its parent 5, so they swap and 3 sits at index 0 before 1 arrives.',
          },
          hints: [
            'After pushing 5 and 3, the smaller one must be at index 0.',
            'Push 8 as a right child of index 0: 3 <= 8, so nothing moves.',
            'Push 1 at index 3: its parent is index 1 (value 5), then index 0 (value 3). It swaps with both.',
          ],
          explanation: 'The array goes [5], [3, 5], [3, 5, 8], then 1 is added at index 3 and swaps with 5 and then with 3, giving [1, 3, 8, 5].',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-71-fix-bug-1',
          kind: 'fix-bug',
          title: 'The redo that came back from the future',
          prompt: 'After actions A, B, D, two undos and a new action C, a redo must do nothing, so the undo stack should read `A,C`. It does not. Tap the buggy line and pick the fix.',
          concept: 'undo and redo with two stacks',
          language: 'javascript',
          code: `const undoStack = [];
let redoStack = [];

function act(name) {
  undoStack.push(name);
}

function undo() {
  if (undoStack.length > 0) redoStack.push(undoStack.pop());
}

function redo() {
  if (redoStack.length > 0) undoStack.push(redoStack.pop());
}

act('A');
act('B');
act('D');
undo();
undo();
act('C');
redo();
console.log(undoStack.join(','));`,
          bugLine: 5,
          fixes: [
            {
              line: `  undoStack.push(name);
  redoStack = [];`,
              correct: true,
              why: 'A new action starts a new future, so the redo stack is emptied.',
            },
            {
              line: `  undoStack.push(name);
  redoStack.pop();`,
              correct: false,
              why: 'This forgets only the newest undone action, so an older one (D) can still come back.',
            },
            {
              line: '  undoStack.unshift(name);',
              correct: false,
              why: 'This puts the action at the bottom of the undo stack and does nothing about redo.',
            },
          ],
          tests: { kind: 'output', expected: ['A,C'] },
          lineNote: 'Look for the place where a new action is recorded. What else must happen when one is?',
          hints: [
            'After undo, the redo stack holds actions from a future that no longer follows.',
            'Where does a brand new action enter the program?',
            'Inside `act`, besides pushing, empty the redo stack.',
          ],
          explanation: 'A new action replaces the undone future, so `act` must clear redoStack. Without it, redo replays an action (B) that no longer follows from the current state.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-71-scenario-1',
          kind: 'scenario',
          title: 'A task changes priority',
          prompt: 'Choose the best way for the scheduler to react.',
          concept: 'keeping a heap correct',
          situation: 'A task was priority 3 and a heap entry for it sits somewhere inside the heap. The user changes it to priority 1. The heap array cannot be searched quickly for a given id.',
          options: [
            {
              text: 'Push a new entry with the new version and priority, and drop the old entry when it reaches the top and its version no longer matches.',
              consequence: 'Each change costs one O(log n) push. Stale entries wait in the heap until they surface, which costs a little memory but keeps the code simple and fast.',
              quality: 'best',
            },
            {
              text: 'Scan the heap array for the old entry, rewrite it, and rebuild the heap order.',
              consequence: 'It works, but the scan is O(n) and the repair adds more work, for every single change.',
              quality: 'acceptable',
            },
            {
              text: 'Rebuild the whole heap from the store after every change.',
              consequence: 'Correct, but O(n log n) per change by repeated pushes. It is fine for a few dozen tasks and slow for thousands.',
              quality: 'poor',
            },
            {
              text: 'Leave the old entry and treat it as valid.',
              consequence: 'The task would still be offered at priority 3 and later again at priority 1, so it appears twice and in the wrong place.',
              quality: 'poor',
            },
          ],
          hints: [
            'Which operations on a heap are cheap, and which need a search?',
            'Can you tell an out-of-date entry from a current one without searching?',
            'A version number on each entry makes a stale entry recognisable on sight.',
          ],
          explanation: 'A heap supports cheap push and pop but not search. Versioned entries turn an update into a push and let stale entries be discarded when they are met.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-71-arrange-1',
          kind: 'arrange',
          title: 'Put undo in order',
          prompt: 'Arrange the lines of `undo` so that it takes the latest event off the undo stack, puts the old task back and keeps the event for redo.',
          concept: 'undo with two stacks',
          language: 'javascript',
          solution: [
            'function undo(store, undoStack, redoStack) {',
            '  const event = undoStack.pop();',
            '  if (!event) return false;',
            '  store.set(event.id, event.before);',
            '  redoStack.push(event);',
            '  return true;',
            '}',
          ],
          alternatives: [
            [
              'function undo(store, undoStack, redoStack) {',
              '  const event = undoStack.pop();',
              '  if (!event) return false;',
              '  redoStack.push(event);',
              '  store.set(event.id, event.before);',
              '  return true;',
              '}',
            ],
          ],
          reasons: [
            'The function header comes first.',
            'Take the latest event off the undo stack first: it is a stack, so the last one in comes out.',
            'If there was nothing to undo, stop before touching anything.',
            'Put back the task as it was before the event.',
            'Keep the event so that redo can reapply it.',
            'Report that something was undone.',
            'The closing brace ends the function.',
          ],
          hints: [
            'The event must be popped before anything can use it.',
            'The guard for an empty stack must come before the lines that use `event`.',
            'Restoring the task and pushing the event onto redo can happen in either order; both must come before the return.',
          ],
          explanation: 'Pop, guard against empty, restore the before snapshot, remember the event for redo, then report success.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-71-code-challenge-1',
          kind: 'code-challenge',
          title: 'Replay edits with undo and redo',
          prompt: "Write `replay(commands)`. The text starts as `''`. A command `'edit:hello'` sets the text to what follows `edit:`, `'undo'` goes back one edit and `'redo'` goes forward again. Use two stacks. Undo or redo with nothing to do changes nothing, and a new edit clears everything redo could bring back. Return the final text.",
          concept: 'implement undo and redo',
          language: 'javascript',
          starter: `function replay(commands) {
  let text = '';
  const undoStack = [];
  let redoStack = [];
  for (const command of commands) {
    if (command === 'undo') {
      // go back one step, if there is one
    } else if (command === 'redo') {
      // go forward one step, if there is one
    } else {
      // an edit looks like 'edit:hello'
    }
  }
  return text;
}`,
          solution: `function replay(commands) {
  let text = '';
  const undoStack = [];
  let redoStack = [];
  for (const command of commands) {
    if (command === 'undo') {
      if (undoStack.length > 0) {
        redoStack.push(text);
        text = undoStack.pop();
      }
    } else if (command === 'redo') {
      if (redoStack.length > 0) {
        undoStack.push(text);
        text = redoStack.pop();
      }
    } else {
      undoStack.push(text);
      text = command.slice(5);
      redoStack = [];
    }
  }
  return text;
}`,
          tests: {
            kind: 'function',
            fn: 'replay',
            cases: [
              { label: 'undo goes back one edit', args: [['edit:a', 'edit:b', 'undo']], expected: 'a' },
              { label: 'redo reapplies it', args: [['edit:a', 'undo', 'redo']], expected: 'a' },
              { label: 'undo with nothing to undo', args: [['undo']], expected: '' },
              {
                label: 'a new edit clears redo',
                args: [['edit:a', 'undo', 'edit:b', 'redo']],
                expected: 'b',
              },
              {
                label: 'two undos and two redos',
                args: [['edit:a', 'edit:b', 'undo', 'undo', 'redo', 'redo']],
                expected: 'b',
                hidden: true,
              },
              {
                label: 'redo with nothing to redo',
                args: [['edit:x', 'redo', 'redo']],
                expected: 'x',
                hidden: true,
              },
              {
                label: 'undo all the way',
                args: [['edit:a', 'edit:b', 'undo', 'undo', 'undo']],
                expected: '',
                hidden: true,
              },
            ],
          },
          hints: [
            'On an edit, push the current text on the undo stack, then set the text and empty the redo stack.',
            'On undo, if the undo stack has something, push the current text on the redo stack and pop the undo stack into the text.',
            'Redo is the mirror image of undo with the two stacks swapped. `command.slice(5)` removes `edit:`.',
          ],
          explanation: 'Each stack holds the texts you can reach in one direction. Undo and redo move the current text from one stack to the other, and a new edit clears the redo stack.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-71-q1',
        prompt: 'In an array-backed binary heap, where are the children of the item at index 4?',
        choices: ['Indexes 8 and 9', 'Indexes 2 and 3', 'Indexes 9 and 10', 'Indexes 5 and 6'],
        answer: 2,
        explanation: 'The children of index i are at 2i + 1 and 2i + 2, so for i = 4 they are 9 and 10. The parent of index 4 is at floor((4 - 1) / 2) = 1.',
      },
      {
        id: 'data-structures-algorithms-71-q2',
        prompt: 'A task is edited five times. Why does the scheduler hold several heap entries for it, and is that a bug?',
        choices: [
          'A bug: the heap should hold exactly one entry per task at every moment',
          'Not a bug: each edit pushed a new versioned entry; old ones are dropped at the top',
          'A bug: versions are only meant to exist for tasks that have been deleted',
          'Not a bug: the heap has to keep every old version of a task so undo can work',
        ],
        answer: 1,
        explanation: 'Lazy deletion trades a little memory for O(log n) updates. A stale entry is recognised by its version and removed when it surfaces. Undo uses the history, not the heap.',
      },
      {
        id: 'data-structures-algorithms-71-q3',
        prompt: 'You do A, B, undo, then C. Why must the redo stack now be empty?',
        choices: [
          'Because redo is only ever allowed once per session, however many undos came first',
          'Because C replaced the undone future, so bringing B back would not follow from now',
          'Because the undo stack is full and has no room left to take another action',
          'Because B was deleted from the log as soon as the undo took it off the stack',
        ],
        answer: 1,
        explanation: 'Redo means "reapply what I undid". After a new action the state has moved on, so reapplying B would mix two different histories.',
      },
      {
        id: 'data-structures-algorithms-71-q4',
        prompt: "Undo restores a task through `commit` with origin `'undo'`. What goes wrong if the history pushed such events onto the undo stack as it does for user actions?",
        choices: [
          'Nothing would go wrong, because a reversal is the same kind of thing as an action',
          'The log would lose its order, because entries could then be written twice at once',
          'The Map would stop being a Map, because its keys would be changed by the stacks',
          'Undo would stack its own reversal, so the next undo would undo the undo',
        ],
        answer: 3,
        explanation: 'Only user actions are things to take back. If the reversal of an action were itself an undoable action, undo would bounce between two states forever.',
      },
      {
        id: 'data-structures-algorithms-71-q5',
        audience: { max: 'beginner' },
        prompt: 'Three patients are waiting. The nurse picks the one she should see first. What decides it?',
        choices: [
          'Whoever arrived first, because waiting in line is always the fairest rule',
          'The most urgent one, then the earlier deadline when urgency is equal',
          'Whoever has the shortest name, because it is quickest to write on a slip',
          'Whoever was written down last, because that slip is on top of the pile',
        ],
        answer: 1,
        explanation: 'A priority queue gives the most urgent item first, not the oldest. The comparator spells out what urgent means, here priority and then deadline.',
      },
      {
        id: 'data-structures-algorithms-71-q6',
        audience: { min: 'advanced' },
        prompt: 'A scheduler has n valid entries and s stale ones, and `upcoming(k)` meets all s stale entries before finding k ready tasks. What is the cost?',
        choices: [
          'O(k), because only the k ready tasks are ever touched by the call',
          'O(n), because every entry of the heap is examined once by the call',
          'O((k + s) log n): each entry popped or pushed back costs O(log n)',
          'O(s), because a stale entry is removed from the heap in constant time',
        ],
        answer: 2,
        explanation: 'Each pop costs O(log n), and each ready entry is pushed back at the same cost. The stale ones are paid for once each, which is why a long-running scheduler needs an occasional rebuild.',
      },
    ],
    task: {
      title: 'Watch the stale entries pile up',
      minutes: 20,
      steps: [
        'Assemble the code of lessons 70 and 71 and run the demos. Print `scheduler.heap.size` after the demo.',
        "Update one task's priority 20 times in a loop, print the heap size again, and call `scheduler.next()`. Which entries are valid?",
        'Add a method `rebuild()` that creates a new heap and offers every task of the store, and call it. What is the heap size now, and what does it cost?',
        'Write two check() lines: the next task after a priority change, and the history of that task having one entry per change.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Play the two trays with real paper: write edits on slips, move them between the done tray and the taken-back tray for undo and redo, and empty the taken-back tray when you write a new slip.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Cap the undo stack at 5 and make the history log drop entries older than the oldest undoable event. Decide what `historyOf` should say for dropped entries and write down the trade-off.',
        ],
      },
    ],
  },
  {
    id: 'data-structures-algorithms-72',
    day: 72,
    title: 'Dependencies, Sorting and Explaining Your Trade-offs',
    summary: 'Finish the system with a dependency graph that refuses circles and orders tasks, stable multi-key sorting, a manager that guards the rules, and a written defence of every choice.',
    intro: {
      objectives: [
        'Store dependencies as a directed graph and refuse a dependency that would make a circle',
        'Order tasks with a topological sort that prefers urgent tasks',
        'Sort by priority, deadline or creation date with a stable multi-key comparator',
        'Run the full test plan and explain each structure, its cost and what it gave up',
      ],
      why: "Choosing a structure is only half of engineering: the other half is defending the choice with costs and trade-offs. That skill is what lets you review an AI assistant's design instead of accepting it.",
    },
    minutes: 30,
    skills: ['graphs', 'search-sort', 'choose-structure'],
    body: [
      {
        type: 'paragraph',
        text: 'Three pieces remain. Some tasks cannot start until others are done, so the system needs a graph. Users want their list sorted by priority, by deadline or by when it was created, and those sorts must behave sensibly with ties. And all the structures need a single door, so rules that span them, such as no circular dependencies, are enforced in one place. After that you will run the test plan from lesson 69 and write the explanation that is the real deliverable of this course: why each structure, what it costs and what you gave up.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Building a house has an order. You cannot paint a wall that is not plastered, and you cannot plaster before the frame stands. A foreman keeps a list of "needs": painting needs plastering, plastering needs the frame. Two things can be done in parallel when neither needs the other. If someone writes that the frame needs the paint, the foreman refuses at once, because no worker could ever start.',
      },
      {
        type: 'paragraph',
        text: 'The picture is a little too forgiving: a foreman sees a loop on sight, while a program has to search for it. Searching, and doing it before the bad dependency is saved, is the interesting part.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'Dependencies are a **directed graph**: an edge from a task to each task it waits for. We store them as two adjacency maps of Sets: `prereqs` (task to the tasks it waits for) and `dependents` (task to the tasks waiting for it). We do not store edges anywhere else. Each task carries its `dependsOn` ids as plain data, and the graph listens to store events: it removes the edges of the `before` task and adds those of the `after` task. So an undo that restores an old task restores its edges as well, with no extra code.',
      },
      {
        type: 'paragraph',
        text: '**Refusing a circle.** Before task `id` is allowed to wait for `prereq`, ask whether `prereq` already depends, directly or through others, on `id`. If it does, the new edge would close a loop. We answer with a depth-first search that starts at `prereq` and follows `prereqs`, using a `seen` set so no task is visited twice. If it reaches `id`, refuse. The cost is O(V + E) in the worst case, which is fine because it runs only when a dependency changes. A task waiting for itself is the smallest circle and is refused first.',
      },
      {
        type: 'paragraph',
        text: '**Blocked and ready.** A task is blocked while any of its prerequisites is still `todo`. The scheduler of lesson 71 already accepts an `isBlocked` function, so plugging in `blockers(id).length > 0` makes it skip blocked tasks and offer the most urgent *ready* one.',
      },
      {
        type: 'paragraph',
        text: "**Topological order** lists tasks so every task comes after the ones it waits for. We use Kahn's algorithm: count how many prerequisites of each task are inside the chosen set, start with the tasks that have none, and each time one is output, lower the count of its dependents, adding any that reach zero. Several orders are valid, so the frontier is a **min-heap with our urgency comparator**: among the tasks that are ready, the most urgent goes first. The cost is O((V + E) log V). If fewer tasks come out than went in, a circle exists, which the manager's checks should make impossible.",
      },
      {
        type: 'visual',
        id: 'graph-shortest-path',
        caption: 'Switch to the topological sort and press Next: watch which vertex becomes ready when the last vertex it waits for is output.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: every task points at what it needs first. Before we add a new arrow we walk backwards along the existing arrows from the new target. If that walk ever arrives at the task we are editing, the new arrow would make a loop, and we say no.',
      },
      {
        type: 'paragraph',
        text: '**Sorting.** `compareBy` builds one comparator from a list of fields and directions. It tries each field in turn, puts tasks with no deadline last whichever way you sort, compares text with `<` and `>`, and ends with the id so the order is fully determined. We call `Array.prototype.sort` on a copy. The specification has required `sort` to be stable since ECMAScript 2019, so tasks that tie keep their earlier order; sorting by deadline and then by priority in two passes gives the same result as one pass with a two-field comparator. Cost: O(n log n).',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Ask to add: task 1 waits for task 3] --> B{Is 1 the same task as 3?}
  B -->|yes| X[Refuse: a task cannot wait for itself]
  B -->|no| C[Start a search at task 3, following prerequisites]
  C --> D{Does the search reach task 1?}
  D -->|yes| Y[Refuse: it would close a circle]
  D -->|no| E[Save the change through the store]
  E --> F[Graph listener adds the edge]`,
        caption: 'The cycle check the manager makes before a dependency is saved. Nothing changes if it refuses.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'In a real system, dependency graphs show up as build tools, CI pipelines, spreadsheets and package managers, and they all face the same three questions: refuse or detect circles, order the work, and decide what to do with a deleted prerequisite. We refuse circles up front, because a late failure leaves bad data in the system, and we refuse to delete a task that others still need, to avoid dangling ids. For sorting at scale, comparator chains are fine for in-memory lists; for stored data you would sort in the database with an index. Note the consequences of the design: the cycle check is O(V + E) per dependency change, and both indexes and the graph are rebuilt cheaply from tasks, because tasks are the single source of truth.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'The graph, in three fragments that belong inside `class DependencyGraph { ... }`. First the edges and the questions about them.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'DependencyGraph, part 1 (fragment: inside the class)',
        code: `  constructor(store) {
    this.store = store;
    this.prereqs = new Map();
    this.dependents = new Map();
    for (const task of store.byId.values()) this.link(task);
    store.subscribe((event) => {
      if (event.before !== null) this.unlink(event.before);
      if (event.after !== null) this.link(event.after);
    });
  }

  link(task) {
    for (const prereq of task.dependsOn) {
      addTo(this.prereqs, task.id, prereq);
      addTo(this.dependents, prereq, task.id);
    }
  }

  unlink(task) {
    for (const prereq of task.dependsOn) {
      removeFrom(this.prereqs, task.id, prereq);
      removeFrom(this.dependents, prereq, task.id);
    }
  }

  dependentsOf(id) {
    return [...(this.dependents.get(id) ?? [])];
  }

  blockers(id) {
    return [...(this.prereqs.get(id) ?? [])].filter((prereq) => this.store.get(prereq)?.status === TODO);
  }`,
      },
      { type: 'paragraph', text: 'Then the cycle check, an iterative depth-first search.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'DependencyGraph, part 2 (fragment: inside the class)',
        code: `  wouldCreateCycle(id, prereq) {
    if (id === prereq) return true;
    const seen = new Set([prereq]);
    const stack = [prereq];
    while (stack.length > 0) {
      const current = stack.pop();
      for (const next of this.prereqs.get(current) ?? []) {
        if (next === id) return true;
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }
    return false;
  }`,
      },
      {
        type: 'paragraph',
        text: 'Then the topological order, closing the class with a final `}`.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'DependencyGraph, part 3 (fragment: inside the class)',
        code: `  order(ids) {
    const chosen = new Set(ids);
    const waiting = new Map();
    const frontier = new MinHeap(compareUrgency);
    for (const id of chosen) {
      const count = [...(this.prereqs.get(id) ?? [])].filter((prereq) => chosen.has(prereq)).length;
      waiting.set(id, count);
      if (count === 0) frontier.push(this.store.get(id));
    }
    const result = [];
    while (frontier.size > 0) {
      const task = frontier.pop();
      result.push(task.id);
      for (const next of this.dependents.get(task.id) ?? []) {
        if (!chosen.has(next)) continue;
        waiting.set(next, waiting.get(next) - 1);
        if (waiting.get(next) === 0) frontier.push(this.store.get(next));
      }
    }
    if (result.length < chosen.size) throw new Error('These tasks depend on each other in a circle');
    return result;
  }`,
      },
      { type: 'paragraph', text: 'The comparator builder and the three sort presets.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Stable multi-key sorting',
        code: `function compareBy(keys) {
  return (a, b) => {
    for (const [field, direction] of keys) {
      const x = a[field];
      const y = b[field];
      if (x === y) continue;
      if (x === null) return 1;
      if (y === null) return -1;
      const result = compareText(x, y);
      return direction === 'desc' ? -result : result;
    }
    return a.id - b.id;
  };
}

const SORTS = {
  priority: [['priority', 'asc'], ['due', 'asc'], ['created', 'asc']],
  deadline: [['due', 'asc'], ['priority', 'asc'], ['created', 'asc']],
  created: [['created', 'desc'], ['priority', 'asc']],
};`,
      },
      {
        type: 'paragraph',
        text: 'A quick look at stability: two passes against one comparator, and a descending sort.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Sorting demo',
        code: `const sample = [
  { id: 1, priority: 2, due: '2026-11-20', created: '2026-11-10' },
  { id: 2, priority: 1, due: '2026-11-22', created: '2026-11-11' },
  { id: 3, priority: 2, due: '2026-11-18', created: '2026-11-12' },
  { id: 4, priority: 1, due: '2026-11-19', created: '2026-11-13' },
  { id: 5, priority: 1, due: null, created: '2026-11-09' },
];
const twoPasses = [...sample].sort(compareBy([['due', 'asc']])).sort((a, b) => a.priority - b.priority);
const onePass = [...sample].sort(compareBy(SORTS.priority));
console.log(twoPasses.map((task) => task.id));
console.log(onePass.map((task) => task.id));
console.log([...sample].sort(compareBy(SORTS.deadline)).map((task) => task.id));
console.log([...sample].sort(compareBy([['due', 'desc']])).map((task) => task.id));`,
      },
      {
        type: 'paragraph',
        text: 'The manager is the single door. It is the only place that knows rules spanning several structures.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'TaskManager',
        code: `class TaskManager {
  constructor(today) {
    this.categories = new CategoryTree();
    this.store = new TaskStore(this.categories, today);
    this.history = new History(this.store);
    this.graph = new DependencyGraph(this.store);
    this.scheduler = new Scheduler(this.store, (task) => this.graph.blockers(task.id).length > 0);
  }

  checkPrereqs(id, prereqs) {
    for (const prereq of prereqs) {
      if (this.store.get(prereq) === null) throw new Error(\`Task \${prereq} does not exist\`);
      if (id !== null && this.graph.wouldCreateCycle(id, prereq)) throw new Error(\`Task \${id} cannot wait for task \${prereq}: that would be a circle\`);
    }
  }

  addTask(fields) {
    this.checkPrereqs(null, fields.dependsOn ?? []);
    return this.store.create(fields);
  }

  updateTask(id, changes) {
    if (changes.dependsOn) this.checkPrereqs(id, changes.dependsOn);
    return this.store.update(id, changes);
  }

  complete(id) {
    const waiting = this.graph.blockers(id);
    if (waiting.length > 0) throw new Error(\`Task \${id} is waiting for \${waiting.join(', ')}\`);
    return this.store.update(id, { status: DONE });
  }

  removeTask(id) {
    const needed = this.graph.dependentsOf(id);
    if (needed.length > 0) throw new Error(\`Task \${id} is needed by \${needed.join(', ')}\`);
    this.store.delete(id);
  }

  list(criteria = {}, sort = 'priority') {
    return this.store.filter(criteria).sort(compareBy(SORTS[sort]));
  }

  undo() { return this.history.undo(); }
  redo() { return this.history.redo(); }
}`,
      },
      {
        type: 'paragraph',
        text: 'A scenario that touches the graph, the scheduler, the history and the sorts.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Dependencies in action',
        code: `const manager = new TaskManager('2026-11-16');
const { categories } = manager;
categories.add('Home');
categories.add('Work');
categories.add('Launch', 'Work');

const draft = manager.addTask({ title: 'Draft the proposal', priority: 2, due: '2026-11-19', category: 'Launch', created: '2026-11-10' });
const review = manager.addTask({ title: 'Review the proposal', priority: 1, due: '2026-11-20', category: 'Launch', created: '2026-11-11', dependsOn: [draft.id] });
const send = manager.addTask({ title: 'Send the proposal', priority: 1, due: '2026-11-21', category: 'Launch', created: '2026-11-12', dependsOn: [review.id] });
const bill = manager.addTask({ title: 'Pay electric bill', priority: 1, due: '2026-11-18', category: 'Home', created: '2026-11-13' });
manager.addTask({ title: 'Clean the garage', priority: 3, category: 'Home', created: '2026-11-09' });

console.log(manager.scheduler.upcoming(5).map((t) => t.title));
console.log(manager.graph.order([...manager.store.byId.keys()]));
try { manager.complete(review.id); } catch (e) { console.log(e.message); }
try { manager.updateTask(draft.id, { dependsOn: [send.id] }); } catch (e) { console.log(e.message); }
try { manager.removeTask(review.id); } catch (e) { console.log(e.message); }
manager.complete(draft.id);
console.log(manager.scheduler.next().title);
console.log(manager.list({ category: 'Work', deep: true }, 'deadline').map((t) => t.id));
console.log(manager.list({}, 'created').map((t) => t.id));
manager.undo();
console.log(manager.store.get(draft.id).status);
manager.redo();
console.log(manager.store.get(draft.id).status);`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`link` and `unlink` add and remove one edge in both maps, using the `addTo` and `removeFrom` helpers from lesson 70. The listener calls `unlink(before)` then `link(after)`, so an update that changes `dependsOn` swaps the edges in one step. `blockers` keeps only the prerequisites whose task is still `todo`.',
          "`wouldCreateCycle` starts with a stack holding `prereq`. It pops a task, looks at that task's prerequisites, returns `true` if one is `id`, and otherwise pushes the unseen ones. If the stack empties, no path leads back to `id`.",
          "`order` counts, for each chosen task, the prerequisites also in the chosen set, seeds the heap with the zero counts, and repeatedly pops the most urgent ready task, outputs it and lowers its dependents' counts. In the demo the result `[ 4, 1, 2, 3, 5 ]` starts with the urgent electric bill, then the proposal chain in order (draft, review, send), with the low-priority garage last.",
          '`compareBy` loops over `[field, direction]` pairs. `x === y` moves on to the next field; a `null` loses to any value in either direction; `desc` flips only the result of the text comparison. In the sorting demo, `twoPasses` and `onePass` are both `[ 4, 2, 5, 3, 1 ]`: urgent tasks first, ordered by deadline with the task that has none last. The descending-deadline sort still puts task 5, which has no deadline, last.',
          "In the manager, `complete(2)` fails with `Task 2 is waiting for 1`. Making task 1 wait for task 3 fails with `Task 1 cannot wait for task 3: that would be a circle`. Removing task 2 fails with `Task 2 is needed by 3`. After `complete(1)` the scheduler's next task is the electric bill, and `undo` followed by `redo` flips task 1 between `todo` and `done`.",
        ],
      },
      {
        type: 'paragraph',
        text: 'Now the whole plan. This is the test suite that the lesson 69 table promised, run against a fresh manager with six sample tasks. Put it after all the classes.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The full test plan',
        code: `function buildSampleManager() {
  const manager = new TaskManager('2026-11-16');
  manager.categories.add('Home');
  manager.categories.add('Bills', 'Home');
  manager.categories.add('Work');
  manager.categories.add('Launch', 'Work');
  manager.addTask({ title: 'Pay electric bill', priority: 1, due: '2026-11-18', category: 'Bills', created: '2026-11-10' });
  manager.addTask({ title: 'Draft the proposal', priority: 2, due: '2026-11-19', category: 'Launch', created: '2026-11-11' });
  manager.addTask({ title: 'Review the proposal', priority: 1, due: '2026-11-20', category: 'Launch', created: '2026-11-12', dependsOn: [2] });
  manager.addTask({ title: 'Send the proposal', priority: 1, due: '2026-11-21', category: 'Launch', created: '2026-11-13', dependsOn: [3] });
  manager.addTask({ title: 'Clean the garage', priority: 3, category: 'Home', created: '2026-11-09' });
  manager.addTask({ title: 'Pay water bill', priority: 2, due: '2026-11-18', category: 'Bills', created: '2026-11-14' });
  return manager;
}

const throws = (fn) => {
  try {
    fn();
    return null;
  } catch (error) {
    return error.message;
  }
};

const m = buildSampleManager();
const titles = (tasks) => tasks.map((t) => t.title);
let passed = 0;
let total = 0;
const test = (name, actual, expected) => {
  total += 1;
  if (check(name, actual, expected)) passed += 1;
};

test('lookup by id', m.store.get(3).title, 'Review the proposal');
test('category with subtree', titles(m.list({ category: 'Home', deep: true }, 'deadline')), ['Pay electric bill', 'Pay water bill', 'Clean the garage']);
test('category exact', m.list({ category: 'Home' }).map((t) => t.id), [5]);
test('word search (AND)', titles(m.list({ text: 'pay bill' })), ['Pay electric bill', 'Pay water bill']);
test('filter by priority', m.list({ maxPriority: 1 }, 'deadline').map((t) => t.id), [1, 3, 4]);
test('scheduler skips blocked', titles(m.scheduler.upcoming(3)), ['Pay electric bill', 'Pay water bill', 'Draft the proposal']);
test('cycle refused', throws(() => m.updateTask(2, { dependsOn: [4] })), 'Task 2 cannot wait for task 4: that would be a circle');
test('complete blocked refused', throws(() => m.complete(3)), 'Task 3 is waiting for 2');
test('delete needed refused', throws(() => m.removeTask(2)), 'Task 2 is needed by 3');
test('topological order', m.graph.order([...m.store.byId.keys()]), [1, 6, 2, 3, 4, 5]);
m.complete(2);
test('unblocked after done', titles(m.scheduler.upcoming(3)), ['Pay electric bill', 'Review the proposal', 'Pay water bill']);
test('sort by deadline', m.list({ status: 'todo' }, 'deadline').map((t) => t.id), [1, 6, 3, 4, 5]);
test('sort by created', m.list({ status: 'todo' }, 'created').map((t) => t.id), [6, 4, 3, 1, 5]);
m.undo();
test('undo restores status', m.store.get(2).status, 'todo');
m.redo();
test('redo reapplies', m.store.get(2).status, 'done');
m.undo();
m.updateTask(1, { priority: 2 });
test('a new action clears redo', m.redo(), false);
test('history of a task', m.history.historyOf(2), ['2. created "Draft the proposal"', '7. changed status "todo" -> "done"', '8. changed status "done" -> "todo" (undo)', '9. changed status "todo" -> "done" (redo)', '10. changed status "done" -> "todo" (undo)']);
test('indexes consistent', m.store.checkIndexes(), []);
console.log(\`\${passed} of \${total} checks passed\`);`,
      },
      {
        type: 'paragraph',
        text: 'It prints 18 PASS lines and `18 of 18 checks passed`. Read each check as a sentence about the system, and for each one say which structure it exercises. That list of sentences is the skeleton of your explanation.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Write your explanation first, in your own words: for each structure, why you chose it, what it costs and what you gave up. Then ask an assistant to attack it, not to rewrite it.',
      },
      {
        type: 'prompt',
        label: 'Find the weak claims',
        text: 'Here is my written explanation of the data structures in my task manager (JavaScript): [paste your explanation]. Do not rewrite it and do not add new content. List up to five claims in it that are wrong, unsupported or missing a case (for example a cost that is only the average case, or a trade-off I did not name). For each one, ask me a question I could answer by counting operations or running a small test.',
      },
      {
        type: 'paragraph',
        text: 'Take each question and answer it by running something, not by asking again. An assistant may add true-sounding claims of its own, such as an exact speed or a statement about how the engine implements `Map`; accept none you cannot check by counting or in the language documentation.',
      },
      {
        type: 'takeaways',
        items: [
          "Dependencies are a directed graph; store edges as adjacency Sets built from each task's dependsOn, so undo restores them for free.",
          'Refuse a dependency that closes a circle by searching from the prerequisite for the task: O(V + E).',
          "Kahn's algorithm gives a topological order; a min-heap frontier makes it prefer the urgent tasks.",
          'Stable sort plus a comparator that tries fields in order gives priority, deadline or creation sorts; null deadlines go last.',
          'A manager is the one door that enforces rules across structures; your explanation names each structure, its cost and its trade-off.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-72-predict-output-1',
          kind: 'predict-output',
          title: 'Two stable passes',
          prompt: 'Sorting by deadline first and then by priority uses a stable sort. What does the code print?',
          concept: 'stable multi-key sorting',
          language: 'javascript',
          code: `const tasks = [
  { id: 1, p: 2, due: '2026-11-20' },
  { id: 2, p: 1, due: '2026-11-22' },
  { id: 3, p: 2, due: '2026-11-18' },
  { id: 4, p: 1, due: '2026-11-19' },
];
const byDue = [...tasks].sort((a, b) => (a.due < b.due ? -1 : 1));
const thenPriority = [...byDue].sort((a, b) => a.p - b.p);
console.log(byDue.map((task) => task.id).join(' '));
console.log(thenPriority.map((task) => task.id).join(' '));`,
          expected: `3 4 1 2
4 2 3 1`,
          choices: [
            `3 4 1 2
4 2 3 1`,
            `3 4 1 2
2 4 1 3`,
            `3 4 1 2
4 2 1 3`,
            `1 2 3 4
4 2 3 1`,
          ],
          wrongNotes: {
            '3 4 1 2\n2 4 1 3': 'The second sort keeps each priority group in the order the first sort left it. Priority 1 holds tasks 4 (due 19th) and 2 (due 22nd), in that order.',
            '3 4 1 2\n4 2 1 3': 'Within priority 2, task 3 (due 18th) comes before task 1 (due 20th), because the first sort put it earlier and a stable sort keeps ties in order.',
            '1 2 3 4\n4 2 3 1': 'The first sort orders by due date: 18th is task 3, 19th is task 4, 20th is task 1, 22nd is task 2.',
          },
          hints: [
            'Put the tasks in due-date order first: 18th, 19th, 20th, 22nd.',
            'The second sort only compares priority. Tasks with equal priority stay in the order they already have.',
            'Priority 1 holds 4 and 2; priority 2 holds 3 and 1.',
          ],
          explanation: 'The deadline sort gives 3, 4, 1, 2. The stable priority sort then groups priority 1 (4, 2) before priority 2 (3, 1) and keeps the deadline order inside each group.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-72-fix-bug-1',
          kind: 'fix-bug',
          title: 'Subtracting dates',
          prompt: 'The tasks should be sorted by due date, earliest first: 2, 3, 1. The output keeps the original order. Tap the buggy line and pick the fix.',
          concept: 'comparators on text dates',
          language: 'javascript',
          code: `const tasks = [
  { id: 1, due: '2026-11-20' },
  { id: 2, due: '2026-11-18' },
  { id: 3, due: '2026-11-19' },
];
tasks.sort((a, b) => a.due - b.due);
console.log(tasks.map((task) => task.id));`,
          bugLine: 6,
          fixes: [
            {
              line: 'tasks.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));',
              correct: true,
              why: 'It compares the date text and returns a negative, positive or zero number, which is what sort expects.',
            },
            {
              line: 'tasks.sort();',
              correct: false,
              why: 'The default sort turns each object into the text [object Object], so every pair ties and the order stays as it was.',
            },
            {
              line: 'tasks.sort((a, b) => a.id - b.id);',
              correct: false,
              why: 'This sorts by id, which is already the order, not by date.',
            },
          ],
          tests: { kind: 'output', expected: ['[ 2, 3, 1 ]'] },
          lineNote: 'The data and the printing are fine. Which line decides the order?',
          hints: [
            'What does subtracting one text from another give in JavaScript?',
            'The result is NaN, which sort treats like 0, so nothing moves.',
            'Compare the two strings with < and > and return -1, 1 or 0.',
          ],
          explanation: 'a.due - b.due is NaN for text, so every pair counts as a tie and a stable sort leaves the order unchanged. Comparing the strings with < and > works because year-month-day text sorts like a calendar.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-72-scenario-1',
          kind: 'scenario',
          title: 'A circular dependency',
          prompt: 'Choose how the manager should respond.',
          concept: 'refusing a cycle',
          situation: 'Task A waits for B and B waits for C. A user now asks for C to wait for A. If it is saved, none of the three could ever start.',
          options: [
            {
              text: 'Search from A along the prerequisites before saving. It reaches C, so refuse with a clear message and change nothing.',
              consequence: 'The data stays valid and the user learns why. The search costs O(V + E) only when a dependency changes.',
              quality: 'best',
            },
            {
              text: 'Save it, and report the circle later when someone asks for the topological order.',
              consequence: 'It works until then, but invalid data is stored, the scheduler may silently offer nothing, and the error appears far from its cause.',
              quality: 'acceptable',
            },
            {
              text: 'Save it, then quietly remove another dependency to break the loop.',
              consequence: "The user's data changes without their knowing, and the manager had to guess which edge to remove.",
              quality: 'poor',
            },
            {
              text: 'Save it and let the scheduler skip all three tasks for ever.',
              consequence: 'Three tasks silently disappear from the work list and nothing explains why.',
              quality: 'poor',
            },
          ],
          hints: [
            'Where is it cheapest and clearest to catch a bad request?',
            'Detecting late leaves invalid data in the store.',
            'Refusing at the door keeps every structure consistent.',
          ],
          explanation: 'Refusing at the door keeps the graph acyclic as an invariant, so the topological order and the scheduler never face a circle.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-72-code-challenge-1',
          kind: 'code-challenge',
          title: "Order the tasks with Kahn's algorithm",
          prompt: 'Complete `topoOrder(deps)`. `deps` maps each id to the array of ids it waits for. Return an array with every id after its prerequisites; when several are ready, take the smallest id first. If a circle makes that impossible, return `null`. The setup is written for you: finish the loop and the return.',
          concept: 'topological sort',
          language: 'javascript',
          starter: `function topoOrder(deps) {
  const ids = Object.keys(deps).map(Number).sort((a, b) => a - b);
  const waiting = {};
  const dependents = {};
  for (const id of ids) {
    waiting[id] = deps[id].length;
    for (const prereq of deps[id]) {
      if (!dependents[prereq]) dependents[prereq] = [];
      dependents[prereq].push(id);
    }
  }
  const ready = ids.filter((id) => waiting[id] === 0);
  const order = [];
  // while something is ready: take the smallest id, add it to order,
  // and lower the waiting count of each task that depends on it
  return order;
}`,
          solution: `function topoOrder(deps) {
  const ids = Object.keys(deps).map(Number).sort((a, b) => a - b);
  const waiting = {};
  const dependents = {};
  for (const id of ids) {
    waiting[id] = deps[id].length;
    for (const prereq of deps[id]) {
      if (!dependents[prereq]) dependents[prereq] = [];
      dependents[prereq].push(id);
    }
  }
  const ready = ids.filter((id) => waiting[id] === 0);
  const order = [];
  while (ready.length > 0) {
    ready.sort((a, b) => a - b);
    const id = ready.shift();
    order.push(id);
    for (const next of dependents[id] ?? []) {
      waiting[next] -= 1;
      if (waiting[next] === 0) ready.push(next);
    }
  }
  return order.length === ids.length ? order : null;
}`,
          tests: {
            kind: 'function',
            fn: 'topoOrder',
            cases: [
              { label: 'a chain', args: [{ '1': [], '2': [1], '3': [2] }], expected: [1, 2, 3] },
              {
                label: 'smaller id first when both are ready',
                args: [{ '1': [2], '2': [], '3': [] }],
                expected: [2, 1, 3],
              },
              { label: 'a circle gives null', args: [{ '1': [2], '2': [1] }], expected: null },
              {
                label: 'a diamond',
                args: [{ '1': [], '2': [1], '3': [1], '4': [2, 3] }],
                expected: [1, 2, 3, 4],
              },
              { label: 'no tasks', args: [{}], expected: [], hidden: true },
              {
                label: 'a circle behind a valid task',
                args: [{ '1': [], '2': [3], '3': [2] }],
                expected: null,
                hidden: true,
              },
            ],
          },
          hints: [
            'Loop while `ready` is not empty. Sort it, then take the first id with `shift()`.',
            'After you push the id into `order`, loop over `dependents[id] ?? []` and subtract 1 from each waiting count; push a task into `ready` when its count reaches 0.',
            'At the end, if `order.length` is smaller than `ids.length`, some tasks never became ready, so return `null`.',
          ],
          explanation: 'A task becomes ready when its count of unfinished prerequisites reaches zero. If a circle exists, the tasks in it never reach zero and the order comes out too short.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-72-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Defend your design',
          prompt: 'Tap each question an examiner might ask, then compare it with the points a good answer makes.',
          concept: 'explaining trade-offs',
          cards: [
            {
              front: 'Why a Map by id and not an array of tasks?',
              back: 'Opening, updating or deleting by id is a Map lookup, O(1) on average, where an array scan is O(n). The Map costs memory and gives up a built-in order by anything but insertion, so sorting uses a copy.',
            },
            {
              front: 'What happens to stale heap entries, and what does it cost?',
              back: 'They are discarded when they reach the top, because their version no longer matches. They cost memory until then, and a rebuild from the store bounds them. The gain is O(log n) updates without searching the heap.',
            },
            {
              front: 'Why refuse a circular dependency instead of detecting it later?',
              back: 'Refusing keeps the graph acyclic as an invariant, so the order and the scheduler never face a loop. It costs an O(V + E) search each time a dependency changes.',
            },
            {
              front: 'What did you give up with word search?',
              back: 'Only whole words match, and punctuation and accents are ignored. Prefix search would need a trie, at a cost in memory and in write time.',
            },
          ],
          hints: [],
          explanation: 'A strong explanation names the structure, its cost, and what the choice gave up. Each answer here has all three.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-72-q1',
        prompt: 'The manager is asked to make task 5 wait for task 9. How does `wouldCreateCycle(5, 9)` decide?',
        choices: [
          'It sorts every task by id and checks whether 5 comes before 9 in the sorted list',
          'It counts the dependencies of task 9 and refuses if there are more than three of them',
          'It searches from 9 along its prerequisites and refuses if it reaches 5',
          'It searches from task 5 along its dependents and accepts if it finds task 9 there',
        ],
        answer: 2,
        explanation: 'If 9 already depends on 5, directly or through others, then adding 5 depends on 9 closes a loop. The search from 9 over prerequisites finds exactly that.',
      },
      {
        id: 'data-structures-algorithms-72-q2',
        prompt: "In Kahn's algorithm, what happens right after a task is added to the order?",
        choices: [
          'Every other task is sorted again by priority before the next one is chosen',
          "Each dependent's waiting count goes down by one, and a task at zero is ready",
          'The task is deleted from the graph, together with every edge that touches it',
          'Its prerequisites are visited again to confirm that they were all finished',
        ],
        answer: 1,
        explanation: "A task is ready when all its prerequisites have been output. Lowering the dependents' counts is how the algorithm notices that.",
      },
      {
        id: 'data-structures-algorithms-72-q3',
        prompt: 'Why does the frontier of ready tasks live in a min-heap rather than a plain queue?',
        choices: [
          'A heap makes the whole algorithm run in O(V) time, which a queue cannot do',
          'A queue cannot hold more than one task at a time, but a heap can hold many',
          'A topological order is always unique, so any container gives the same result',
          'Several orders are valid, so the heap lets the most urgent ready task go first',
        ],
        answer: 3,
        explanation: 'When several tasks are ready, any choice respects the dependencies. The heap uses the urgency comparator to choose well, at the cost of a log factor.',
      },
      {
        id: 'data-structures-algorithms-72-q4',
        prompt: 'Two tasks have the same priority and the same deadline and so tie in the comparator chain. What does a stable sort guarantee, and what does `compareBy` add?',
        choices: [
          'Tied tasks keep their order; `compareBy` ends with the id so ties never remain',
          'Tied tasks are swapped with each other; `compareBy` then undoes that swap again',
          'Tied tasks are removed from the list; `compareBy` then restores them to it',
          'Tied tasks are sorted by title next; `compareBy` is therefore not needed here',
        ],
        answer: 0,
        explanation: 'Stable means equal items keep their order. Ending the comparator with the id means no two tasks ever tie, so the result does not depend on stability at all.',
      },
      {
        id: 'data-structures-algorithms-72-q5',
        audience: { max: 'beginner' },
        prompt: 'A recipe step says "ice the cake" needs "bake the cake", and "bake the cake" needs "ice the cake". What should the planner do?',
        choices: [
          'Do both steps at the same time, so neither has to wait for the other',
          'Skip the baking, because a cake can be iced without having been baked',
          'Refuse the instructions, because neither step could ever start',
          'Ice the cake first, then bake it afterwards and hope that it all works',
        ],
        answer: 2,
        explanation: 'Two steps that each need the other form a loop. The planner must refuse it, because no order exists that respects both rules.',
      },
      {
        id: 'data-structures-algorithms-72-q6',
        audience: { min: 'advanced' },
        prompt: 'A reviewer notes that `wouldCreateCycle` is O(V + E) and runs on every dependency change. Which response is sound?',
        choices: [
          'Remove the check and rely on the topological order to report any loops, since a circle is rare',
          'Accept it: edits are rare next to reads, and it protects an invariant used everywhere',
          'Replace it with a sort of all the tasks by id that runs again on every change',
          "Cache its result for ever, because a task's dependencies never change once saved",
        ],
        answer: 1,
        explanation: 'Writes that change dependencies are infrequent, and the cost buys a guarantee used everywhere else. Late detection leaves bad data in the store, and the cached result would go stale on every edit.',
      },
    ],
    task: {
      title: 'Run the plan, then break it',
      minutes: 20,
      steps: [
        'Assemble every class from lessons 70 to 72, add the final test plan and run it. Confirm 18 of 18 checks pass.',
        'Comment out the cycle check in `checkPrereqs`. Which check fails now, and what does the scheduler do when the circle is saved?',
        'Restore it. Add `blockedTasks()` to the manager returning the todo tasks that have blockers, and a check() for it.',
        'Write a first draft of your explanation: one short paragraph per structure with its cost and its trade-off. This is the core of your project submission.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Draw a small dependency picture with six tasks as arrows on paper, then list one valid order by hand, the way Kahn's algorithm would.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Compute the longest chain of dependent tasks (the critical path) using the topological order and one pass of dynamic programming. State its cost.',
        ],
      },
    ],
  },
];

export const project: Project | null = {
  id: 'data-structures-algorithms-p13',
  title: 'The Smart Task Management System',
  summary: 'Build the whole task manager in JavaScript from your own plan: tasks, a category tree, fast search, a priority scheduler, history with undo and redo, dependencies and stable sorting. Then defend every structure you chose.',
  outcome: 'A working program and a written design explanation that show you can choose data structures for real requirements, state what they cost and defend the trade-offs, which is the skill that lets you review AI-written code.',
  unlockAfterDay: 71,
  steps: [
    {
      id: 'data-structures-algorithms-p13-s1',
      text: 'Write your plan: the ten requirements as operations, the structure chosen for each with its cost, the task data shape, and a test plan with expected answers decided before any code (lesson 69).',
    },
    {
      id: 'data-structures-algorithms-p13-s2',
      audience: { max: 'beginner' },
      text: 'Start from the lesson code and make it run. Then change something small of your own, such as another category or a new priority rule, and write one check() for it.',
    },
    {
      id: 'data-structures-algorithms-p13-s3',
      text: 'Build tasks and categories: a Map by id, a category tree with path, subtree and move, a category index and a word index, all changed through one write path. Add an invariant checker and run it after your tests (lesson 70).',
    },
    {
      id: 'data-structures-algorithms-p13-s4',
      text: 'Add the scheduler (a binary min-heap with an urgency comparator and versioned, lazily deleted entries), the history log, and undo and redo with two stacks (lesson 71).',
    },
    {
      id: 'data-structures-algorithms-p13-s5',
      text: 'Add dependencies as a directed graph that refuses circles, a topological order that prefers urgent tasks, and sorting by priority, deadline and creation date with a stable comparator; put the cross-structure rules in one manager (lesson 72).',
    },
    {
      id: 'data-structures-algorithms-p13-s6',
      audience: { min: 'advanced' },
      text: 'Add one feature of your own that needs a structure the lessons did not use here (for example prefix search with a trie, or a sliding-window reminder limit). State its cost, add checks for it and show that the invariant checker still passes.',
    },
    {
      id: 'data-structures-algorithms-p13-s7',
      text: 'Run your whole test plan and paste the output. Then write the explanation: for each structure, why you chose it, what each operation costs (average and worst case where they differ) and what the choice gave up. Say where an AI assistant helped you and one thing you checked rather than trusted.',
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your code and your explanation',
    placeholder: 'Paste your code, the output of your test plan, and your written explanation of each structure, its cost and its trade-off.',
    hint: 'Include the code (or the key classes), the test plan output with every check named, and one short paragraph per structure covering why, cost and trade-off. Mention anything you verified yourself after asking an AI.',
  },
  rubric: [
    'Correctness: every required feature works, the test plan passes and the invariant checker reports no stale index.',
    'Efficiency: each operation uses the structure the plan chose, and the stated costs match what the code does (average and worst case are kept apart).',
    'Code organization: one write path, small classes with one job each, a single manager door for cross-structure rules, and readable names.',
    "Explaining trade-offs: for each structure the explanation says why it was chosen, what it costs and what it gave up, in the learner's own words.",
    'Testing: the test plan was written with expected answers first, and it covers empty, missing and refused cases, not only the happy path.',
  ],
  rubricExtra: [
    {
      audience: { max: 'beginner' },
      items: [
        'A smaller system is fine: tasks in a Map, categories, search and one of undo or the scheduler, working and explained, is a successful submission.',
      ],
    },
    {
      audience: { min: 'intermediate', max: 'intermediate' },
      items: [
        'The system handles invalid input (a bad date, an unknown category, a circular dependency) with clear errors and leaves the data unchanged.',
      ],
    },
    {
      audience: { min: 'advanced' },
      items: [
        'A scale note: what breaks first at 100,000 tasks (stale heap entries, history size, write amplification of the indexes), with the fix you would apply.',
        'A regression test that compares an indexed query with a plain scan over many generated cases.',
      ],
    },
  ],
};
