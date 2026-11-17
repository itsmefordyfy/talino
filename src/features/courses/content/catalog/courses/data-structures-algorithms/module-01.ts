import type { Lesson, Project } from '../../../types';

/**
 * Module 1 of Data Structures and Algorithms: Introduction (days 1 to 4, no project; the practical activity is lesson 4's task).
 * No Big O yet: this module only counts operations informally ("how many records were looked at"). Module 2 gives the vocabulary.
 * Plain objects and functions only: classes arrive with linked lists (lesson 17).
 */
export const lessons: Lesson[] = [
  {
    id: 'data-structures-algorithms-01',
    day: 1,
    title: 'What Data Structures and Algorithms Are, and Why They Matter',
    summary: 'Learn what a data structure and an algorithm are, how they work as a pair, and why the pair decides whether a program stays fast as its data grows.',
    intro: {
      objectives: [
        'Explain what a data structure is and what an algorithm is, in your own words',
        'Tell apart the question "how is the data kept?" from the question "what steps do I follow?"',
        'Name three reasons the choice of structure and algorithm matters when an AI writes code for you',
      ],
      why: 'An AI assistant can hand you code that works on ten records and crawls on ten million. Knowing what to ask for, and what to check in the answer, starts with these two ideas.',
    },
    minutes: 20,
    skills: ['choose-structure', 'ai-algorithms'],
    body: [
      {
        type: 'paragraph',
        text: 'Every program you will ever read, or ask an AI to write, does two things with information. It keeps the information somewhere, and it does something with it: finds it, adds to it, sorts it, removes it, combines it. This course is about those two jobs. The first has a name, **data structure**. The second has a name too, **algorithm**. Learn them together and you can look at a piece of code and ask the questions that matter: where does this keep its data, what steps does it take, and what happens when there is a thousand times more of it?',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Aling Nena runs a sari-sari store in Naga. Some of her suki (regular customers) buy on credit, and she writes each person\'s name and balance in a notebook. When Mang Dado walks in, she has to find his page before she can add today\'s purchase.',
      },
      {
        type: 'paragraph',
        text: 'Think about two things she controls. First, **how the notebook is arranged**: names in the order people first asked for credit, or in alphabetical order, or with a little index of tabs at the edge. Second, **what she does to find a page**: start at page one and read every name until she sees Mang Dado, or open the notebook in the middle and decide which half to ignore. The arrangement is the data structure. The routine is the algorithm.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops working: Aling Nena can glance at a whole page at once, but a computer looks at one stored item at a time, so for a computer the arrangement matters even more. And with 20 customers any arrangement works fine. The choice only starts to matter when the notebook grows.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'A **data structure** is a way of organizing many pieces of data so that the program can keep them, find them and change them. An **algorithm** is a precise list of steps that takes some input, does a job and always comes to an end with an answer. The two are partners: the arrangement of the data decides which steps are possible, and how short those steps can be.',
      },
      {
        type: 'table',
        headers: ['Everyday situation', 'The data structure (how it is kept)', 'The algorithm (what you do)'],
        rows: [
          ['Phone contacts', 'A list ordered by name', 'Jump to the first letter, then scan the few names near it'],
          ['Jeepneys waiting at a terminal', 'A line, first to arrive at the front', 'The jeepney at the front leaves next'],
          ['A recipe box', 'Cards grouped by dish type', 'Go to the group, then flip through its cards'],
          ['Roads between barangays', 'Places joined by roads', 'Try routes until you find one that reaches the destination'],
        ],
        caption: 'Every row has both halves. Change the left half and the best right half changes with it.',
      },
      {
        type: 'paragraph',
        text: 'Why does the choice matter? Three reasons come up again and again in this course. **Speed**: how much work the program does as the data grows from 20 records to 20 million. **Memory**: a phone has a limited amount, and some arrangements use far more than others. **Clarity**: the right structure often makes the code short and obvious, and the wrong one makes it tangled and full of special cases.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The cycle you will practise all course: describe the job, choose a structure, choose the steps, then check the result.',
        source: 'flowchart TD\n  A[Describe the job: what is stored, what is asked] --> B[Choose a data structure]\n  B --> C[Choose the algorithm steps]\n  C --> D{Right answers, fast enough, memory ok?}\n  D -->|no| B\n  D -->|yes| E[Done: write it, test it, explain it]',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: **data** is facts, such as a name, a price or a date. A **data structure** is the way those facts are arranged, like a shelf in a store where the rice is on one level and the canned goods on another, so you know where to reach. An **algorithm** is a recipe: numbered steps you can follow without having to think, which always finish. If you changed the shelf (put everything in one big pile) you would have to change the recipe for "find the sardines" too. That is the whole idea of this lesson. Nothing in this course asks you to memorize code; you will be asked to understand which arrangement and which steps fit a job.',
      },
      { type: 'heading', text: 'Walk through an example' },
      {
        type: 'paragraph',
        text: 'Take six customers and one question: where is Mang Dado? Here is Aling Nena\'s notebook in the order people first asked for credit, and what she does if she reads from the first page.',
      },
      {
        type: 'table',
        headers: ['Look at', 'Name on the page', 'Is it Mang Dado?'],
        rows: [
          ['1', 'Mang Tonyo', 'No, keep going'],
          ['2', 'Aling Nena', 'No, keep going'],
          ['3', 'Ate Joy', 'No, keep going'],
          ['4', 'Kuya Ben', 'No, keep going'],
          ['5', 'Aling Rosa', 'No, keep going'],
          ['6', 'Mang Dado', 'Yes, stop'],
        ],
        caption: 'An unordered notebook: six looks, because Mang Dado happens to be last.',
      },
      {
        type: 'paragraph',
        text: 'Now suppose the same six names were written in alphabetical order: Aling Nena, Aling Rosa, Ate Joy, Kuya Ben, Mang Dado, Mang Tonyo. She opens the notebook near the middle, at the third name, Ate Joy. Mang Dado comes later in the alphabet, so the first three pages can be ignored. The middle of what is left is Mang Dado. **Two looks instead of six.**',
      },
      {
        type: 'paragraph',
        text: 'Six names, two against six: it hardly matters. Now imagine 6,000 pages. Reading from the front could take 6,000 looks. Opening the middle and throwing away half each time takes at most 13. Same customers, same question, a different arrangement and a different routine. That gap is why this subject exists.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'For an engineer the framing is design under constraints: the access pattern (point lookups, range scans, inserts, deletes), the size and growth of the data, how often it changes, and the memory and latency budget. The structure usually fixes which algorithms are even available. When you review AI-generated code the most common problem is not a wrong answer but a correct one with an accidental scan: a search over a whole collection inside a loop over another collection. Module 2 gives you the vocabulary to say how much work that is; this module trains the habit of asking the question before it ships.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Use any AI assistant you have. The goal is to have the idea explained back to you in a different way, then be quizzed so you find out what you understood.',
      },
      {
        type: 'prompt',
        label: 'Explain, then quiz me',
        text: 'I am learning data structures and algorithms. Explain what a data structure is and what an algorithm is using the example of a sari-sari store notebook of customers who buy on credit. Then ask me three short questions about it, one at a time. Wait for my answer before you ask the next one. Do not give me the answers: if I get one wrong, give me a hint first.',
      },
      {
        type: 'list',
        items: [
          'Look for a clean split: the arrangement of the notebook is the structure, the routine for finding a page is the algorithm. If the AI mixes them up, say so and ask it to try again.',
          'Check its examples against the definitions in this lesson. An algorithm must be a precise list of steps that ends; a structure is a way of keeping data.',
          'An AI can sound sure and still be wrong. If it says something that does not match this lesson, ask "why?" and compare, instead of just accepting it.',
        ],
      },
      {
        type: 'takeaways',
        items: [
          'A data structure is how data is arranged so it can be kept, found and changed; an algorithm is a precise list of steps that ends with an answer.',
          'The two are partners: the arrangement decides which steps are possible and how short they can be.',
          'The choice matters for speed, memory and clarity, and it matters more as the data grows.',
          'AI-written code can be correct on small data and slow on large data, so you learn to ask how the work grows.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-01-match-1',
          kind: 'match',
          title: 'Structure, steps, or both?',
          prompt: 'Match each situation from Aling Nena\'s store to what it is mostly about.',
          concept: 'structure versus algorithm',
          labels: { terms: 'Situation', meanings: 'What it is mostly about' },
          pairs: [
            { term: 'She rewrites the notebook so the names are in alphabetical order', definition: 'A way of organizing the data (a data structure choice)', note: 'This changes how the data is arranged, not the steps of any one job.' },
            { term: 'Compare the next price with the cheapest so far, keep the smaller, repeat until none are left', definition: 'A list of steps that ends with an answer (an algorithm)', note: 'This is a routine with a clear start and end: steps, not arrangement.' },
            { term: 'She opens the alphabetical notebook in the middle and ignores the half that cannot hold the name', definition: 'Steps that only work because the data is arranged in order', note: 'The routine is an algorithm, but it depends on the arrangement being sorted.' },
          ],
          hints: [
            'Ask: is this about where and how things are kept, or about what you do step by step?',
            'One of the three is a routine that would be impossible with the unordered notebook.',
            'The first is the arrangement, the second is a plain list of steps, the third needs both.',
          ],
          explanation: 'A data structure is the arrangement; an algorithm is the routine. Some routines, like opening a notebook in the middle, only exist because the arrangement allows them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-01-arrange-1',
          kind: 'arrange',
          title: 'Find the cheapest price',
          prompt: 'Put the steps of this algorithm in the right order. It must end with the cheapest price from a list.',
          concept: 'an algorithm is steps in order',
          language: 'text',
          solution: [
            'Set cheapest to the first price in the list',
            'Look at the next price',
            'If this price is lower than cheapest, set cheapest to this price',
            'Repeat the last two steps until no prices are left',
            'Report cheapest',
          ],
          reasons: [
            'There must be a starting value to compare with.',
            'Only then can you take the next price.',
            'The comparison needs both a price and the current cheapest.',
            'The routine loops back so every price is checked, and it ends when none are left.',
            'The answer is only known once every price has been checked.',
          ],
          hints: [
            'What must exist before you can compare anything?',
            'Looking at a price comes before comparing it. The loop line comes after both.',
            'Start, look, compare, repeat, report.',
          ],
          explanation: 'An algorithm needs a clear start, ordered steps and a point where it ends. Here the loop makes sure every price is checked before the answer is reported.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-01-scenario-1',
          kind: 'scenario',
          title: 'The slow binder',
          prompt: 'Choose the best response to this problem.',
          concept: 'why the choice matters',
          situation: 'A barangay hall keeps 8,000 residents\' records in a binder, in the order people first registered. Clerks look up residents by name all day, and each lookup means reading through pages. Lookups are slow and the line is growing.',
          options: [
            { text: 'Arrange the records by name and add an index, so a lookup can skip most of the pages', quality: 'best', consequence: 'A lookup now ignores most of the pages instead of reading them. The records are the same; only the arrangement changed.' },
            { text: 'Hire another clerk so two people search the same binder at once', quality: 'acceptable', consequence: 'It helps, but every lookup still reads page after page. The work per lookup is the same; you only spread it over two people.' },
            { text: 'Ask clerks to read faster', quality: 'poor', consequence: 'Reading faster helps a little and then stops helping, and the line keeps growing as the binder grows.' },
          ],
          hints: [
            'The problem is the work each lookup needs, not the people.',
            'Which option reduces how many pages a single lookup must read?',
            'Change the arrangement of the data, not the speed of the reader.',
          ],
          explanation: 'Reorganizing the data lets each lookup do far less work. More people or faster reading only helps a little, because the amount of work per lookup stays the same.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-01-q1',
        prompt: 'A cashier compares each price to the cheapest one so far and keeps the smaller one until the list is finished. What is this best called?',
        choices: [
          'A data structure, because it stores the whole list of prices in one place',
          'An algorithm, because it is a precise list of steps that ends with an answer',
          'A data structure, because the cheapest price is kept in memory',
          'A bug, because it only looks at prices one at a time instead of all together',
        ],
        answer: 1,
        explanation: 'It is a list of steps that always ends with an answer, which is an algorithm. The list of prices it works on is the data; how those prices are kept is the data structure.',
      },
      {
        id: 'data-structures-algorithms-01-q2',
        prompt: 'The same 6,000 customers are kept two ways: in the order they joined, or in alphabetical order. What is the main thing that changes for a name lookup?',
        choices: [
          'Nothing at all, because the customers and the question are the same either way, so the work is too',
          'The list takes up less memory, so every program that uses it runs faster than before',
          'The sorted order lets each look rule out half of what is left, so far fewer records are examined',
          'The computer can see the whole list at once instead of looking at one record at a time',
        ],
        answer: 2,
        explanation: 'Sorted order makes a shorter routine possible: look at the middle, then ignore the half that cannot contain the name. Memory use and what the computer can see at once do not change.',
      },
      {
        id: 'data-structures-algorithms-01-q3',
        prompt: 'An AI writes code that checks every customer, one by one, to find one id. It works on your 20 test customers. Which question is the most useful before you trust it for 2 million customers?',
        choices: [
          'How much work does it do as the number of customers grows, and is there a way to keep the data so most of it is skipped?',
          'Does it use the newest JavaScript syntax, since newer code is always faster?',
          'Did the AI sound confident, since a confident answer is usually a correct design?',
          'Does it print the right answer once, since one correct run proves it scales?',
        ],
        answer: 0,
        explanation: 'Working on 20 records says nothing about 2 million. The useful question is how the work grows with the data, and whether a different arrangement avoids most of it.',
      },
      {
        id: 'data-structures-algorithms-01-q4',
        prompt: 'Which statement about data structures and algorithms is true?',
        choices: [
          'They are unrelated: you choose a structure and an algorithm completely separately',
          'An algorithm is just another word for a data structure',
          'The structure only matters for memory, never for how long a job takes',
          'The way data is arranged often decides which steps are possible and how short they can be',
        ],
        answer: 3,
        explanation: 'The pair is tied together: the arrangement decides which routines exist (opening a sorted notebook in the middle needs the sort) and how much work they take.',
      },
      {
        id: 'data-structures-algorithms-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In the picture of Aling Nena\'s credit notebook, what plays the role of the algorithm?',
        choices: [
          'The notebook itself, with all of its pages and the names on them',
          'The routine she follows to find a customer\'s page',
          'The balance written next to each name',
        ],
        answer: 1,
        explanation: 'The notebook and its arrangement are the data structure; what she does to find a page is the algorithm.',
      },
      {
        id: 'data-structures-algorithms-01-q6',
        audience: { min: 'advanced' },
        prompt: 'In review you find an AI-written loop over 50,000 orders that calls a search over the whole customers list for each order. It passes every test. What is the right comment?',
        choices: [
          'Approve it: passing tests proves the design is fine',
          'Ask for a smaller test set so the tests run faster, since runtime is not a design concern',
          'Ask to build a keyed lookup of customers once, so the loop looks up each customer directly instead of scanning the list every time',
        ],
        answer: 2,
        explanation: 'Each order triggers a scan of the whole customers list, so the work grows with orders times customers. Building a lookup once removes that repeated scan. Tests on small data do not show the problem.',
      },
    ],
    task: {
      title: 'Spot the structure and the steps around you',
      steps: [
        'On paper, list three collections of things from your day: for example your phone contacts, a grocery list and the jeepney routes you use.',
        'For each one write down how it is arranged (the structure) and the thing you do with it most often (the algorithm you follow, in plain steps).',
        'For each one, write one change to the arrangement that would make the most common action faster, or say honestly why it is already fine as it is.',
      ],
      minutes: 10,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw one of your three collections as boxes on paper, one box per item, and circle the item you look for most often. Is it easy to reach?'] },
      { audience: { min: 'advanced' }, steps: ['Pick one collection and write what would break first if it held 10 million items instead of 50: the speed of the most common action, the memory, or your ability to keep it correct.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-02',
    day: 2,
    title: 'How Computers Store and Process Data',
    summary: 'Picture memory as a long row of numbered cells, see what an address is, and learn why items side by side are quicker to reach than items scattered about.',
    intro: {
      objectives: [
        'Describe memory as numbered cells that hold values, and the processor as the part that works on them',
        'Explain the difference between holding a value and holding an address that points to it',
        'Say why items stored side by side can be reached faster than items you have to follow one link at a time',
      ],
      why: 'Every structure in this course is a decision about where things sit in memory and how to get from one to the next. Once you can see that picture, arrays, linked lists and hash tables stop being magic.',
    },
    minutes: 25,
    skills: ['choose-structure', 'arrays-strings'],
    body: [
      {
        type: 'paragraph',
        text: 'When your program runs, its data has to live somewhere, and the program has to be able to get to it. Almost everything about how fast a structure is comes from two facts: where its items sit in memory, and how a program finds the next one. You do not need to know how the hardware is built. You need a simple, honest model that you can reason with, and this lesson builds one.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Picture a long school hallway lined with lockers. Each locker has a number painted on it and holds exactly one thing. If someone tells you "locker 37", you walk straight to number 37. You do not open lockers 1 to 36 on the way. That is the whole idea of memory: **numbered cells, each holding one value, each reachable directly by its number.**',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops working: real memory is not a hallway you walk along. Reaching a cell is done by electronics, and the numbers are very large. Also, a locker holds anything, but a memory cell holds only a small number, so bigger things take several cells. The model keeps what matters: every cell has a number, and a number gets you there directly.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'Three parts do the work. The **processor** (the CPU) is the worker: it follows instructions, one tiny step at a time, such as "read this cell", "compare these two numbers", "write this value". **Memory** (RAM) is the work table: the data your running program is using sits here, in numbered cells. **Storage** (the phone\'s flash storage or a laptop\'s disk) is the cabinet: it keeps files when the power is off, but a program works on data after it has been loaded into memory.',
      },
      {
        type: 'paragraph',
        text: 'Each cell\'s number is its **address**. The value in a cell can be a number, one letter of text, or something else. A small value fits in one cell; a longer text or a big number is stored across several cells in a row. Because a program can compute an address (for example "the address of the first item plus 3") and go straight there, reaching a cell by address is one step, however many cells there are.',
      },
      {
        type: 'table',
        headers: ['Address', '2', '3', '4', '5', '7', '8', '10', '11'],
        rows: [
          ['Holds', '12', '8', '25', '40', 'value 25, next 10', 'value 12, next 11', 'value 40, next -1', 'value 8, next 7'],
        ],
        caption: 'Part of a toy memory. The prices 12, 8, 25 and 40 appear twice: side by side in cells 2 to 5, and again scattered, where each cell also says where the next one is (-1 means there is no next).',
      },
      {
        type: 'paragraph',
        text: 'Now see why the arrangement matters. To read the third price from the side-by-side copy, work out its address: start at cell 2, add 2, go to cell 4. **One read.** To read the third price from the scattered copy, you must begin at the first cell (8), read it to learn where the next one is (11), read that to learn the next (7), and only then reach the third. **Three reads.** The further along the item is, the more reads it costs.',
      },
      {
        type: 'paragraph',
        text: 'There is a second, hidden advantage to side by side. Processors usually fetch memory in blocks, so when a program reads one cell, its neighbours often arrive in the processor\'s fast nearby storage (the cache) at the same time. Walking over neighbouring cells is therefore usually quick, while hopping between faraway cells is usually slower. The exact numbers depend on the machine, so this course counts steps instead of timing, but the principle is real.',
      },
      {
        type: 'paragraph',
        text: 'One more idea: a **reference** is a value that holds an address. A big thing, such as an object with several fields, sits at some address, and a variable that "holds" it really holds the address of where it is. That is why, in JavaScript, two variables can end up pointing at the same object.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a **variable** is a name you give to a place in memory so you can find your value again. An **address** is the number of that place, like the number on a locker. When the value is small, the locker holds it. When the value is big (a whole customer record), the program keeps the record somewhere else and the locker holds a slip with its location written on it. That slip is a **reference**. In the code below, read each line as "put this in locker N" or "go to locker N and see what is inside". JavaScript hides the lockers from you, so the code builds a pretend row of them with a list, just so you can see the idea.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'JavaScript does not let you touch real addresses, so we build a toy memory: a list of 12 cells, where the position in the list is the address. The function `read` also counts how many cells we have read, because counting reads is how we compare arrangements.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A toy memory that counts reads',
        code: `const memory = [null, null, null, null, null, null, null, null, null, null, null, null];
let reads = 0;

function read(address) {
  reads += 1;
  return memory[address];
}`,
      },
      {
        type: 'paragraph',
        text: 'First arrangement: the four prices side by side, starting at address 2. The address of the item at position `i` is `start + i`.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Side by side: the address is computed',
        code: `const start = 2;
const prices = [12, 8, 25, 40];
for (let i = 0; i < prices.length; i++) {
  memory[start + i] = prices[i];
}
console.log(read(start + 2));
console.log(reads);`,
      },
      {
        type: 'paragraph',
        text: 'Second arrangement: the same prices scattered, where each cell holds its value and the address of the next cell. Reaching position `n` means following `n` links from the head, the address of the first cell.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Scattered: follow the links',
        code: `memory[8] = { value: 12, next: 11 };
memory[11] = { value: 8, next: 7 };
memory[7] = { value: 25, next: 10 };
memory[10] = { value: 40, next: -1 };

function readNth(head, n) {
  let cell = read(head);
  for (let step = 0; step < n; step++) {
    cell = read(cell.next);
  }
  return cell.value;
}

reads = 0;
console.log(readNth(8, 2));
console.log(reads);`,
      },
      {
        type: 'paragraph',
        text: 'Last, a reference. This block is separate from the toy memory: it shows the real JavaScript behaviour that objects are held by reference.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Two names, one object',
        code: `const a = { stock: 10 };
const b = a;
b.stock = 99;
console.log(a.stock);

const c = { stock: 10 };
const d = { stock: 10 };
console.log(c === d);
console.log(c === c);`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**`read(address)`** adds one to `reads` and returns what is in that cell. Every look at memory goes through it, so `reads` counts looks.',
          '**Side by side:** the loop stores each price at `start + i`, so 12, 8, 25, 40 land in cells 2, 3, 4, 5. `read(start + 2)` goes to cell 4 and prints **25**. `reads` is **1**: no other price was looked at.',
          '**Scattered:** `readNth(8, 2)` reads cell 8 (reads: 1) and learns the next address is 11. The loop runs twice: it reads cell 11 (reads: 2) and then cell 7 (reads: 3). The value in cell 7 is **25**, the same price, but `reads` is **3**.',
          '**Reference:** `b = a` copies the address, not the object. `b.stock = 99` changes the one object both names point to, so `a.stock` prints **99**. `c` and `d` look identical but are two separate objects at two addresses, so `c === d` prints **false**; `c === c` is **true**.',
        ],
      },
      {
        type: 'table',
        headers: ['Step in readNth(8, 2)', 'Cell read', 'What it said', 'reads so far'],
        rows: [
          ['Start at the head', '8', 'value 12, next 11', '1'],
          ['Loop, first time', '11', 'value 8, next 7', '2'],
          ['Loop, second time', '7', 'value 25, next 10', '3'],
        ],
        caption: 'Following the links: one read per cell passed.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'The contiguous layout versus a linked one is the difference between computing a location and chasing pointers. Contiguous access is predictable, which suits the hardware prefetcher, and its neighbours share cache lines; pointer chasing gives the processor a dependent load at each step. The language does not promise a layout: a JavaScript engine is free to store an array compactly and many do, but the specification says nothing about it, so treat this lesson\'s picture as a model for reasoning and measure when it matters. Also note that most of what a structure costs in a large system is allocation and memory traffic, not the arithmetic on each item, which is why this course counts accesses, not instructions.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Check my picture of memory',
        text: 'I am learning how computers store data. Here is my understanding: memory is a long row of numbered cells; each cell\'s number is its address; a variable holding an object really holds the address of the object; items stored side by side can be reached by adding to the start address, but items scattered in memory and linked together must be reached by following links one by one. Tell me what is right and what is oversimplified in this picture, then ask me two questions to test whether I can tell when following links costs more reads. Do not give me the answers; give hints.',
      },
      {
        type: 'list',
        items: [
          'Look for the AI to agree with the main ideas and to point out simplifications: real memory is managed by the operating system and the language, and the numbers are large. Those are fair corrections.',
          'Check any claim about speed. The AI may state exact timings or say a structure is "always faster". The honest answer depends on the machine and the data, and this course counts steps instead.',
          'If the AI says JavaScript lets you read memory addresses directly, it is wrong: JavaScript hides them.',
        ],
      },
      {
        type: 'takeaways',
        items: [
          'Memory is a long row of numbered cells; a cell\'s number is its address, and a computed address reaches a cell in one step.',
          'The processor works on data held in memory; storage keeps files when the power is off.',
          'Items stored side by side can be reached by arithmetic; items linked by "where is the next one" must be reached one link at a time.',
          'A reference holds an address, so two names can point to the same object, and two look-alike objects are still different.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-02-predict-output-1',
          kind: 'predict-output',
          title: 'Follow the links',
          prompt: 'This toy memory chains four letters. Predict the two lines it prints.',
          concept: 'following references through memory',
          language: 'javascript',
          code: `const memory = [null, null, null, null, null, null];
memory[0] = { value: 'a', next: 3 };
memory[3] = { value: 'b', next: 5 };
memory[5] = { value: 'c', next: 1 };
memory[1] = { value: 'd', next: -1 };

let reads = 0;
function read(address) {
  reads += 1;
  return memory[address];
}

let cell = read(0);
cell = read(cell.next);
cell = read(cell.next);
console.log(cell.value);
console.log(reads);`,
          choices: ['c\n3', 'b\n2', 'c\n6', 'd\n4'],
          wrongNotes: {
            'b\n2': 'Count how many times `read` is called: the first call reads cell 0, and each of the next two follows a `next`. Which letter is the third cell in the chain?',
            'c\n6': '`reads` counts calls to `read`, not the address of the cell. Count the calls.',
            'd\n4': 'The chain has four cells, but this code stops after reading three of them.',
          },
          hints: [
            'Start at cell 0 and write down the letter you find. Then follow its `next`.',
            'The code reads cell 0, then cell 3, then cell 5.',
            'The third cell read holds c, and read was called three times.',
          ],
          explanation: 'The program reads cell 0 (a), follows next to cell 3 (b), follows next to cell 5 (c) and stops. That is three calls to read, so it prints c and 3.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-02-fill-blank-1',
          kind: 'fill-blank',
          title: 'Compute the address',
          prompt: 'Items are stored side by side starting at address `start`. Fill in the blank so the function returns the address of the item at position `index` (counting from 0).',
          concept: 'computing an address',
          language: 'javascript',
          code: `function addressOf(start, index) {
  return ___;
}`,
          blanks: [{ answers: ['start + index', 'index + start'], feedback: 'Think about moving forward from the first cell by as many cells as the position. The first item (position 0) sits right at start.' }],
          bank: ['start + index', 'start * index', 'start - index', 'index + 1'],
          tests: { kind: 'function', fn: 'addressOf', cases: [{ args: [2, 0], expected: 2 }, { args: [2, 3], expected: 5 }, { args: [100, 7], expected: 107 }] },
          hints: [
            'Position 0 is the first item, which sits at the start address itself.',
            'Moving to the next item means moving to the next cell: add one cell for each position.',
            'Add the start address and the position.',
          ],
          explanation: 'Side by side, each item is one cell after the previous one, so position `index` is `index` cells past the first. The address is `start + index`, one calculation, however far along the item is.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-02-predict-output-2',
          kind: 'predict-output',
          title: 'Same object or a copy?',
          prompt: 'Predict the three lines printed. Think about which names point to the same object.',
          concept: 'references versus copies',
          language: 'javascript',
          code: `const jeep = { seats: 18 };
const other = jeep;
other.seats = 22;
const copy = { seats: jeep.seats };
copy.seats = 30;
console.log(jeep.seats);
console.log(other.seats);
console.log(copy.seats);`,
          choices: ['22\n22\n30', '18\n22\n30', '22\n22\n22', '18\n18\n30'],
          wrongNotes: {
            '18\n22\n30': '`other` is not a copy: `other = jeep` copies the address, so both names refer to one object.',
            '22\n22\n22': '`copy` is built as a new object with its own `seats` field, so changing it does not touch the first object.',
            '18\n18\n30': '`other.seats = 22` changes the one shared object, so `jeep.seats` sees it too.',
          },
          hints: [
            '`const other = jeep;` copies an address, not the object.',
            '`copy` is a brand-new object that only starts with the same number.',
            'jeep and other share one object (22). copy is separate (30).',
          ],
          explanation: '`other` and `jeep` hold the same address, so a change through one shows through the other: both print 22. `copy` is a new object at a new address, so its change to 30 stays there.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-02-q1',
        prompt: 'Four items sit side by side in memory. Why can a program reach the fourth without reading the first three?',
        choices: [
          'It keeps a sorted index of every item, which it searches first',
          'It reads the first three very quickly, so the cost of reading them does not show',
          'Its address can be computed from the start address and its position, so no other item needs to be read',
          'The processor remembers where every item is because it saw them being stored',
        ],
        answer: 2,
        explanation: 'Side by side, the item at position i is at start + i, a single calculation. A sorted index, quick reads or processor memory are not what makes this work.',
      },
      {
        id: 'data-structures-algorithms-02-q2',
        prompt: 'Each cell holds a value and the address of the next cell, and you only know the address of the first. How many cells must you read to reach the 5th item?',
        choices: ['5', '1', '4', '6'],
        answer: 0,
        explanation: 'You read the first cell to learn where the second is, and so on, so reaching the 5th item takes 5 reads. Following links costs one read per cell passed.',
      },
      {
        id: 'data-structures-algorithms-02-q3',
        prompt: 'After `const a = { n: 1 }; const b = a; b.n = 5;` what does `a.n` hold?',
        choices: ['1, because b is a copy of a', '5, because both names point to one object', 'It is undefined, because b was changed instead'],
        answer: 1,
        explanation: '`const b = a` copies the address, so `a` and `b` refer to the same object. Changing a field through `b` is visible through `a`.',
      },
      {
        id: 'data-structures-algorithms-02-q4',
        prompt: 'Which description of the parts of a computer fits this lesson\'s model?',
        choices: [
          'The processor stores your files for later and memory does the calculating',
          'Memory follows the instructions and the processor holds all of the data',
          'Storage does the calculating, and memory is used only when the power is off',
          'The processor follows instructions on data held in memory, and storage keeps files when the power is off',
        ],
        answer: 3,
        explanation: 'The processor does the work, memory holds the data being used right now, and storage keeps files for later.',
      },
      {
        id: 'data-structures-algorithms-02-q5',
        audience: { max: 'beginner' },
        prompt: 'In the picture of a hallway of lockers, what does the address of a cell correspond to?',
        choices: ['The thing that is kept inside the locker', 'The colour of the locker door and its size', 'The number painted on the locker'],
        answer: 2,
        explanation: 'The address is the cell\'s number, like the number on a locker. It tells the computer where to go; the value is what is found there.',
      },
      {
        id: 'data-structures-algorithms-02-q6',
        audience: { min: 'advanced' },
        prompt: 'Two loops each do n steps. One walks a large array of numbers; the other follows next references between objects allocated at scattered places. Why might the first still be faster in practice?',
        choices: [
          'Array loops are always compiled to faster instructions than any other loop',
          'Neighbouring items tend to arrive in the cache together, while chasing scattered references tends to miss the cache',
          'Following a reference costs more steps in the language specification than indexing',
        ],
        answer: 1,
        explanation: 'Both do the same number of steps, so the gap comes from memory behaviour: sequential neighbours share cache lines and are easy to prefetch, while scattered objects often are not. The specification itself promises neither.',
      },
    ],
    task: {
      title: 'Count reads in your own toy memory',
      steps: [
        'In any free JavaScript environment (a browser console works), copy the toy memory and the two arrangements from the lesson. Change the prices to five of your own, for example the fares of a route.',
        'Before running, predict how many reads it takes to get the fifth price from the side-by-side copy and from the scattered copy. Write both numbers down.',
        'Run it and compare with your predictions. If a number surprises you, find the line that made the difference.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain each line of `readNth` in plain words, then check its explanation against the table in the lesson that shows what each read returned.'] },
      { audience: { min: 'advanced' }, steps: ['Add a third arrangement: a copy where each cell\'s `next` points to the previous address, so you can walk backwards. Work out how many reads reaching the last item costs from each end.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-03',
    day: 3,
    title: 'Data Types, Abstract Data Types and the Shapes of Data',
    summary: 'Separate a data type from a data structure, learn what an abstract data type promises without saying how it is built, and name the shapes data can take.',
    intro: {
      objectives: [
        'Tell a data type from a data structure with an example of each',
        'Explain an abstract data type as a set of operations and what they do, apart from how they are built',
        'Classify a structure as linear or non-linear, and as static or dynamic',
      ],
      why: 'When you ask an AI for "a stack" or "a queue", you are asking for an idea, not a particular piece of code. Knowing the difference between the idea and its implementations lets you judge which implementation you were given.',
    },
    minutes: 25,
    skills: ['choose-structure'],
    body: [
      {
        type: 'paragraph',
        text: 'People use the words "data type", "data structure" and "abstract data type" as if they meant the same thing, and the mix-up causes real confusion when you read code or talk to an AI about it. They are three different layers. This lesson separates them, then gives you a small set of words for the shapes data can take, so that later lessons can say "this is a linear, dynamic structure" and you know exactly what is meant.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Think of a TV remote. The buttons are a promise: press "volume up" and the sound gets louder; press "channel down" and the channel goes down. You can use any brand\'s remote the same way, because the promise is the same. What happens inside the box is different for every brand: different chips, different wires. The buttons are an **abstract data type**. The chips and wires are an **implementation**.',
      },
      {
        type: 'paragraph',
        text: 'A second picture, from a carinderia: a pile of clean plates. You put a plate on top and you take one from the top. You never pull from the middle. "Put on top, take from top, count the plates" is a complete description of how the pile behaves, whether the plates sit on a shelf, in a rack or in a box. Where the pictures stop working: a remote\'s buttons say nothing about how fast it responds, and neither does an abstract data type say how fast its operations are. That depends on how it is built, which is why implementations still matter.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'A **data type** describes one kind of value and what you can do with it. A number can be added and compared. A string (text) can be joined and searched. A boolean is true or false. In JavaScript, `42`, `\'Naga\'` and `true` are values of three different types. A **data structure** organizes many values, often of different types, into one arrangement: an array of prices, an object with a customer\'s fields, a set of ids. The type says what a value is; the structure says how a group of values is held together.',
      },
      {
        type: 'paragraph',
        text: 'An **abstract data type** (ADT) goes one step up. It describes a collection only by the operations it offers and what they must do, and says nothing about how it is built. The classic first example is the **stack**, the plate pile: `push(value)` puts a value on top, `pop()` removes and returns the top value, `size()` says how many values are held, and the rule is **last in, first out** (the last value pushed is the first one popped). Module 6 studies stacks in depth. Here the point is only this: that description is an idea, and many different structures can build it.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'One abstract idea, several ways to build it. The code that uses a stack only calls push, pop and size.',
        source: 'flowchart TD\n  A[Stack: push, pop, size, last in first out] -->|built with| B[An array]\n  A -->|built with| C[An object plus a counter]\n  A -->|built with| D[Cells linked by references]',
      },
      {
        type: 'paragraph',
        text: 'Data also comes in **shapes**. In a **linear** structure the items sit in a line: each one has at most one item before it and one after it. Arrays, stacks and queues are linear. In a **non-linear** structure an item can relate to several others. A **tree** branches: a company has a boss, the boss has managers, each manager has a team. A **graph** is looser still: barangays joined by roads, where any place may connect to any number of others, and routes can loop back.',
      },
      {
        type: 'table',
        headers: ['Shape', 'The picture', 'Example structures', 'Everyday example'],
        rows: [
          ['Linear', 'Items in a row, one after another', 'Array, stack, queue', 'People waiting in line'],
          ['Hierarchical (non-linear)', 'Items branching downward from one start', 'Tree', 'Folders inside folders'],
          ['Network (non-linear)', 'Items joined to any number of others', 'Graph', 'Roads between towns'],
        ],
        caption: 'Linear versus non-linear describes how items relate to each other.',
      },
      {
        type: 'paragraph',
        text: 'One more pair of words. A **static** structure has a size that is fixed when it is created: in languages such as C and Java an array is made with a set length that cannot change. A **dynamic** structure can grow and shrink while the program runs. JavaScript arrays are dynamic: you can `push` onto them whenever you like. Static is simpler and can be tighter on memory; dynamic is more convenient but has to manage growing for you (module 3 shows what that costs).',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a **type** is the kind of thing a single value is: a number, a piece of text, a yes or no. A **structure** is a container that holds many values in some arrangement, like a tray with compartments. An **abstract data type** is only the list of what the container can do (add on top, take from top, say how many), like the buttons on a remote. How the container is actually built inside is a separate choice, and different builders can make it differently while it still behaves the same from the outside. In the code below you will see the same pile built two ways. Run both and you will find they behave exactly alike.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Here is the stack ADT built two ways. Version A holds its values in an array. Because classes come later in the course, each version is a plain object plus three small functions.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Version A: the pile is an array',
        code: `function newPileA() {
  return { items: [] };
}
function pushA(pile, value) {
  pile.items.push(value);
}
function popA(pile) {
  return pile.items.pop();
}`,
      },
      {
        type: 'paragraph',
        text: 'Version B holds its values in an object, with a counter that records how many there are, so the top is always at position `size - 1`.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Version B: the pile is an object with a counter',
        code: `function newPileB() {
  return { slots: {}, size: 0 };
}
function pushB(pile, value) {
  pile.slots[pile.size] = value;
  pile.size += 1;
}
function popB(pile) {
  pile.size -= 1;
  const value = pile.slots[pile.size];
  delete pile.slots[pile.size];
  return value;
}`,
      },
      {
        type: 'paragraph',
        text: 'Now use each exactly the same way: push three tasks, pop two.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Same use, two builds',
        code: `const pileA = newPileA();
pushA(pileA, 'Pay bill');
pushA(pileA, 'Buy rice');
pushA(pileA, 'Call Ate');
console.log(popA(pileA));
console.log(popA(pileA));

const pileB = newPileB();
pushB(pileB, 'Pay bill');
pushB(pileB, 'Buy rice');
pushB(pileB, 'Call Ate');
console.log(popB(pileB));
console.log(popB(pileB));
console.log(pileB.size);`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Version A** leans on the array\'s own `push` and `pop`. Pushing adds at the end; popping removes from the end, so the last value pushed comes out first.',
          '**Version B** does it by hand. `pushB` stores the value in slot `size`, then adds one to `size`. `popB` first subtracts one, so `size` now points at the top value, reads it, deletes that slot and returns the value.',
          '**The run:** each version gets three pushes, then two pops. The two prints from each version are the same: `Call Ate`, then `Buy rice`. The last print shows `pileB.size` is **1**: three pushed, two popped, one left.',
          '**The point:** the calling code only used push and pop. It cannot tell which build it is using, and that is exactly what an abstract data type promises.',
        ],
      },
      {
        type: 'table',
        headers: ['Step', 'Version A items', 'Version B slots and size', 'Returned'],
        rows: [
          ['push Pay bill', 'Pay bill', '0: Pay bill, size 1', ''],
          ['push Buy rice', 'Pay bill, Buy rice', '0: Pay bill, 1: Buy rice, size 2', ''],
          ['push Call Ate', 'Pay bill, Buy rice, Call Ate', '0, 1 and 2 filled, size 3', ''],
          ['pop', 'Pay bill, Buy rice', 'slot 2 deleted, size 2', 'Call Ate'],
          ['pop', 'Pay bill', 'slot 1 deleted, size 1', 'Buy rice'],
        ],
        caption: 'Different insides, the same visible behaviour.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'An ADT is an interface plus a behavioural contract, and the practical consequence is substitutability: code written against `push`, `pop` and `size` keeps working when you swap the representation, provided the contract holds. The contract does not include cost, so two correct implementations can differ widely in time and memory, and a leaky choice can surface later (a queue built on an array whose `shift` is slow, say). Write tests against the contract once, run them against every implementation, and treat complexity as a separate, documented property. When AI hands you a "stack", check that it honours last-in-first-out on empty and single-element cases before you look at how it is built.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Same idea, different builds',
        text: 'I am learning about abstract data types. Using a stack as the example, explain the difference between the idea of a stack (push, pop, size, last in first out) and two different ways to implement it. Then give me one short example of something that is an abstract data type and one that is a data type, and ask me to classify three more items you choose. Wait for my answer on each. Do not just tell me the answers: give a hint first.',
      },
      {
        type: 'list',
        items: [
          'Look for the AI to keep the idea (the operations and the rule) separate from the build (array, linked cells, counter). If it describes a stack only as "an array", it has merged them.',
          'Check how it classifies things. A single number or string is a data type; a collection with an arrangement is a data structure; a description of operations with no build is an abstract data type.',
          'An AI may use these terms loosely, or in a slightly different way from this lesson. Ask it to define each term before you accept a classification.',
        ],
      },
      {
        type: 'takeaways',
        items: [
          'A data type is a kind of single value (number, string, boolean); a data structure arranges many values.',
          'An abstract data type is a set of operations and what they must do, with nothing said about how they are built; a stack (push, pop, last in first out) is the classic example.',
          'Many different structures can implement the same abstract data type, and code that only uses the operations cannot tell them apart.',
          'Shapes: linear structures keep items in a row, non-linear ones (trees, graphs) let an item relate to several others. Static structures have a fixed size; dynamic ones grow and shrink.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-03-match-1',
          kind: 'match',
          title: 'Which layer is it?',
          prompt: 'Match each situation to what it shows.',
          concept: 'types, structures, abstract data types and shapes',
          labels: { terms: 'Situation', meanings: 'What it shows' },
          pairs: [
            { term: 'The undo button only promises that the last change you made is the first one undone', definition: 'An abstract data type: the behaviour, not the build', note: 'This describes what operations do and in what order, and says nothing about how it is made.' },
            { term: 'A developer keeps the undo history in an array and takes from its end', definition: 'An implementation: one way to build the idea', note: 'This chooses an actual structure to build the behaviour.' },
            { term: 'An org chart where every boss has people under them', definition: 'A non-linear shape: items branch', note: 'Each item can relate to several others below it, so it is not a single row.' },
            { term: 'People waiting at a till, each with one person ahead and one behind', definition: 'A linear shape: items in a row', note: 'Each item has at most one before and one after.' },
          ],
          hints: [
            'Two of them describe a shape and two describe a promise versus a build.',
            'Ask: does it say what the thing does, or how it is made?',
            'The first two are the promise and the build, the last two are the two shapes.',
          ],
          explanation: 'An abstract data type promises behaviour; an implementation is one build of it. Separately, a linear shape keeps items in a row and a non-linear shape lets items branch or connect.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-03-fix-bug-1',
          kind: 'fix-bug',
          title: 'A pile that breaks its promise',
          prompt: 'This pile should be last in, first out: popping after pushing a, b and c should give c and leave two values. It gives the wrong value. Tap the buggy line and pick the fix.',
          concept: 'honouring an abstract data type',
          language: 'javascript',
          code: `const pile = { items: [] };
function push(pile, value) {
  pile.items.push(value);
}
function pop(pile) {
  return pile.items.shift();
}
push(pile, 'a');
push(pile, 'b');
push(pile, 'c');
console.log(pop(pile));
console.log(pile.items.length);`,
          bugLine: 6,
          fixes: [
            { line: 'return pile.items.pop();', correct: true, why: '`pop` removes and returns the last value, which is the one pushed most recently: last in, first out.' },
            { line: 'return pile.items[0];', correct: false, why: 'It reads the first value, `a`, and does not remove it, so both the answer and the size are wrong.' },
            { line: 'return pile.items[pile.items.length - 1];', correct: false, why: 'It reads the right value, `c`, but does not remove it, so the pile still holds three values.' },
          ],
          tests: { kind: 'output', expected: ['c', '2'] },
          lineNote: 'The pile is built correctly; the line that takes from it is the one that breaks last in, first out. Which line takes a value out?',
          hints: [
            'Which end of the array does `shift` remove from?',
            'The pile\'s rule is that the most recently added value comes out first. Which end holds that value?',
            'Use the array method that removes the last value.',
          ],
          explanation: '`shift` removes the first value, which makes this a first-in, first-out line and breaks the stack\'s promise. `pop` removes the last value, so the most recent push comes out first and the size drops by one.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-03-predict-output-1',
          kind: 'predict-output',
          title: 'Run Version B by hand',
          prompt: 'Predict the three lines this prints. Track `size` and which slots hold values after every call.',
          concept: 'tracing an implementation of an abstract data type',
          language: 'javascript',
          code: `const pile = { slots: {}, size: 0 };
function push(pile, value) {
  pile.slots[pile.size] = value;
  pile.size += 1;
}
function pop(pile) {
  pile.size -= 1;
  const value = pile.slots[pile.size];
  delete pile.slots[pile.size];
  return value;
}
push(pile, 'x');
push(pile, 'y');
pop(pile);
push(pile, 'z');
console.log(pop(pile));
console.log(pop(pile));
console.log(pile.size);`,
          choices: ['z\nx\n0', 'y\nx\n0', 'z\ny\n1', 'z\nx\n1'],
          wrongNotes: {
            'y\nx\n0': 'The pop in the middle removed `y`, so it is gone when the last two pops run. What is pushed after it?',
            'z\ny\n1': '`y` was already popped by the call that is not printed.',
            'z\nx\n1': 'Count the pushes and the pops: three pushes, three pops. What is left?',
          },
          hints: [
            'After the first two pushes, x is in slot 0 and y in slot 1, and size is 2.',
            'The unprinted pop removes y. Then z is pushed into slot 1.',
            'The printed pops return z, then x, and size ends at 0.',
          ],
          explanation: 'Push x and y (size 2), pop removes y (size 1), push z goes into slot 1 (size 2). The two printed pops return z and then x, leaving size 0.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-03-q1',
        prompt: 'Your team agrees that a "task pile" must support push, pop and size with last-in-first-out behaviour, and each developer may build it however they like. What is that agreement?',
        choices: [
          'An implementation, because it says exactly what the code must do',
          'A data type, like a number or a string of text',
          'A static structure, because the rules of the pile never change',
          'An abstract data type, because it describes behaviour and leaves out how it is built',
        ],
        answer: 3,
        explanation: 'It describes operations and rules without saying how to build them, which is an abstract data type. Each developer\'s choice of array, object or linked cells is an implementation.',
      },
      {
        id: 'data-structures-algorithms-03-q2',
        prompt: 'One developer builds the task pile with an array and another with an object and a counter. A test pushes three values and pops once. What should be true?',
        choices: [
          'Both return the same value, because both follow the same contract, even if they differ in how much work each step takes',
          'They must return different values, because different builds behave differently',
          'Only the array version can be correct, because an object cannot hold ordered values',
          'The test is meaningless until you know which build is being used',
        ],
        answer: 0,
        explanation: 'The contract fixes the behaviour: the last value pushed comes out first. The two builds can differ in speed and memory, but not in what push and pop return.',
      },
      {
        id: 'data-structures-algorithms-03-q3',
        prompt: 'Which one is a non-linear shape?',
        choices: [
          'A queue of customers waiting at a till',
          'An array of prices stored one after another',
          'A set of folders that contain other folders',
        ],
        answer: 2,
        explanation: 'Folders inside folders branch: each folder can hold several others, so the items are not in a single row. The queue and the array are linear.',
      },
      {
        id: 'data-structures-algorithms-03-q4',
        prompt: 'In a language where an array is created with a length that cannot change, what kind of structure is that array?',
        choices: [
          'Dynamic, because you can still change what the array holds',
          'Static, because its size is fixed when it is created',
          'Non-linear, because it has a fixed number of slots in it',
          'Abstract, because its size is not part of its type at all',
        ],
        answer: 1,
        explanation: 'A static structure has a size that is fixed up front. JavaScript arrays are dynamic, but arrays in languages such as C and Java are static in size.',
      },
      {
        id: 'data-structures-algorithms-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In the remote-control picture, what do the buttons stand for?',
        choices: [
          'The chips and wires inside, which are the implementation',
          'The list of operations the thing promises, like an abstract data type',
          'The batteries, which decide how long it lasts',
        ],
        answer: 1,
        explanation: 'The buttons are what you can do and what happens when you do it, which is what an abstract data type describes. How the inside is built is the implementation.',
      },
      {
        id: 'data-structures-algorithms-03-q6',
        audience: { min: 'advanced' },
        prompt: 'A reviewer says "this ADT\'s contract is satisfied by both implementations, so choosing between them does not matter". What is the flaw?',
        choices: [
          'The contract covers behaviour, not cost, so the implementations can differ widely in time and memory and the choice still matters',
          'A contract can only be satisfied by one implementation at a time',
          'Implementations of the same ADT always have identical performance',
        ],
        answer: 0,
        explanation: 'An abstract data type fixes what operations do, not how long they take. Two correct implementations can have very different costs, so you still choose using your access pattern and data size.',
      },
    ],
    task: {
      title: 'Build the same idea two ways',
      steps: [
        'In any free JavaScript environment, copy Version A and Version B and the calls from the lesson. Run them and confirm the printed lines match your table.',
        'Add a function `sizeA(pile)` that returns the number of values in Version A, and a function `sizeB(pile)` for Version B. Check that after three pushes both report 3.',
        'Write a short test that calls push and pop in the same order on both versions and checks the values are equal. Then change one version so its `pop` takes from the wrong end and see the test catch it.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw a pile of three plates labelled with your tasks. Next to it draw Version B\'s slots 0, 1 and 2 and write size next to them. Cross out slots as you pop.'] },
      { audience: { min: 'advanced' }, steps: ['Make pop on an empty pile safe in both versions (return undefined and leave size at 0), and write the two edge-case tests for it: empty and single element.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-04',
    day: 4,
    title: 'Understanding Efficiency and Choosing the Right Data Structure',
    summary: 'Measure efficiency by counting how many records a lookup examines, compare three ways of storing customers, and use a decision table to choose a structure.',
    intro: {
      objectives: [
        'Count how many records an approach looks at to find one customer',
        'Compare an unsorted array, a sorted array and an object keyed by id using those counts',
        'Use a decision table to choose a structure from what a program does most often',
      ],
      why: 'Choosing a structure is mostly asking what the program will do most, and then counting. These counts are the evidence you will use all course to judge your own code and anything an AI writes.',
    },
    minutes: 30,
    skills: ['choose-structure', 'complexity'],
    body: [
      {
        type: 'paragraph',
        text: 'So far you have seen that the way data is kept changes how much work a job takes. This lesson makes that exact. **Efficiency** means how much work a program does and how much memory it uses to get its answer. We cannot measure work in seconds, because seconds change from one phone to the next, so we **count**: how many records were looked at, how many steps were taken. In this lesson you count one thing, the number of customer records examined while finding one customer, for three different ways of keeping the same customers. You count it by hand first and then let code do the counting. There is no special notation yet; module 2 gives you the vocabulary.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A bakery takes cake orders and writes each on a ticket. Three ways to keep the tickets: a **pile in the order orders arrived**; a **file sorted by customer id**; or a **wall of pigeonholes numbered by id**, where a ticket goes into the hole with its customer\'s number. To find a customer\'s ticket, the pile means reading tickets one by one. The sorted file lets you open it in the middle and discard half. The pigeonholes mean walking straight to the right number.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops working: each way has a price. A new ticket goes on the pile in one move, but into the sorted file it must go in the right place, so later tickets have to shift. The wall of pigeonholes needs a whole wall. The best arrangement depends on what the bakery does most often.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'The three approaches, in terms of JavaScript. **An unsorted array** holds the customers in the order they were added; to find one, **scan** from the front and look at each record until you reach the match or run out. **A sorted array** holds them in id order; to find one, look at the middle record, and if its id is too small, throw away the left half, otherwise the right half, and repeat. Halving only works because the array is sorted. **An object keyed by id** stores each customer under its id, so `byId[276]` goes straight to that customer. How JavaScript finds a key internally is the subject of module 8; for now we count customer records looked at, and for a keyed lookup that is one.',
      },
      {
        type: 'visual',
        id: 'searching-linear-binary',
        caption: 'Set "Number of values" to 15, pick "Last value" under "Try a target", then press Next repeatedly and watch both counters. Which search looks at fewer values? Now pick "Not in the list" and compare again.',
      },
      {
        type: 'paragraph',
        text: 'Counting is not only about finding. Each arrangement also has a price when you **add** a customer, and when you keep it in memory. Here is the comparison in words, before we count.',
      },
      {
        type: 'table',
        headers: ['What the program does', 'Unsorted array', 'Sorted array', 'Object keyed by id'],
        rows: [
          ['Find one customer by id', 'Reads up to every record', 'Halves what is left each look, so very few records', 'Goes straight to it: one record'],
          ['Add a new customer', 'Put it at the end: one move', 'Find its place and shift later records to make room', 'Store it under its id: one move'],
          ['Memory', 'Just the records', 'Just the records', 'The records plus the bookkeeping for the keys'],
          ['Customers in id order', 'Must be sorted first', 'Already in order', 'Not what it is for: sort the ids first'],
        ],
        caption: 'No approach wins every row. The right one depends on which row your program lives in.',
      },
      {
        type: 'paragraph',
        text: 'That table is a **decision table** in the making. To choose a structure, do not ask "which is best?" but "what does my program do most often?" and read the answer off a table like this one:',
      },
      {
        type: 'table',
        headers: ['If the program mostly...', 'Think about...', 'Where you will learn it'],
        rows: [
          ['Finds a record by its id or name, many times', 'An object (or Map) keyed by that id', 'Module 8'],
          ['Appends many records and reads them all later', 'A plain array', 'Module 3'],
          ['Keeps records in order and searches or lists by range', 'A sorted array', 'Modules 14 and 15'],
          ['Handles the oldest item first', 'A queue', 'Module 7'],
          ['Undoes the latest action', 'A stack', 'Module 6'],
          ['Always needs the most urgent item', 'A priority queue (a heap)', 'Module 11'],
          ['Stores things inside things, like folders', 'A tree', 'Module 10'],
          ['Stores connections, like roads between towns', 'A graph', 'Module 13'],
        ],
        caption: 'A decision table. The names on the right are previews; each has its own module.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: "records looked at" is the number of times the program has to open a customer\'s entry and read it. Scanning an unsorted list is like checking each ticket in the pile until you find the right one, so the number can be as high as the number of tickets. Halving a sorted list is like the "higher or lower" guessing game: each look removes half of the remaining possibilities. The keyed object is like pigeonholes: you go straight to the number. The code below counts these looks with a variable named `looked` that goes up by one every time a record is read, then prints the total.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Six customers, written in the order they joined. `findByScan` looks at one record at a time and returns the customer along with how many it looked at.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Scan an unsorted array and count',
        code: `const customers = [
  { id: 205, name: 'Mang Tonyo', city: 'Pili' },
  { id: 101, name: 'Aling Nena', city: 'Naga' },
  { id: 340, name: 'Ate Joy', city: 'Legazpi' },
  { id: 118, name: 'Kuya Ben', city: 'Naga' },
  { id: 276, name: 'Aling Rosa', city: 'Iriga' },
  { id: 150, name: 'Mang Dado', city: 'Pili' },
];

function findByScan(list, id) {
  let looked = 0;
  for (const customer of list) {
    looked += 1;
    if (customer.id === id) {
      return { customer, looked };
    }
  }
  return { customer: null, looked };
}

console.log(findByScan(customers, 101).looked);
console.log(findByScan(customers, 150).looked);
console.log(findByScan(customers, 999).looked);`,
      },
      {
        type: 'paragraph',
        text: 'Second approach: the same customers in an object keyed by id. The loop fills the object once; after that, a lookup is a single property read.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Keyed by id',
        code: `const byId = {};
for (const customer of customers) {
  byId[customer.id] = customer;
}
console.log(byId[276].name);
console.log(byId[999]);`,
      },
      {
        type: 'paragraph',
        text: 'Third approach: a sorted copy, and a function that halves. The first line sorts the customers by id (module 15 explains sorting; treat it as a black box here), and `findInSorted` is the "look in the middle, discard half" routine. Module 14 explains it carefully; for now only read the `looked` counter.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A sorted array, halved',
        code: `const sorted = [...customers].sort((x, y) => x.id - y.id);
console.log(sorted.map((c) => c.id).join(' '));

function findInSorted(list, id) {
  let low = 0;
  let high = list.length - 1;
  let looked = 0;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    looked += 1;
    if (list[middle].id === id) {
      return { customer: list[middle], looked };
    }
    if (list[middle].id < id) {
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return { customer: null, looked };
}

console.log(findInSorted(sorted, 101).looked);
console.log(findInSorted(sorted, 276).looked);
console.log(findInSorted(sorted, 999).looked);`,
      },
      {
        type: 'paragraph',
        text: 'Six customers prove little, so let code make bigger lists. Every customer gets the next id, and we look for the very last one.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Count at three sizes',
        code: `function makeCustomers(n) {
  const list = [];
  for (let i = 0; i < n; i++) {
    list.push({ id: 1000 + i, name: 'Customer ' + i, city: 'Naga' });
  }
  return list;
}

for (const n of [100, 1000, 10000]) {
  const list = makeCustomers(n);
  const lastId = list[n - 1].id;
  console.log(n, findByScan(list, lastId).looked, findInSorted(list, lastId).looked, 1);
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**`findByScan`:** `looked` goes up by one each time the loop reads a customer. Customer 101 is second in the list, so 2 are looked at. Customer 150 is last, so 6. Customer 999 is not there, so all 6 are looked at before giving up. The first three prints are **2, 6, 6**.',
          '**`byId`:** the loop runs once to fill the object. `byId[276].name` prints **Aling Rosa** with no scan. `byId[999]` prints **undefined**, because there is no such key.',
          '**`findInSorted`:** `sorted` prints `101 118 150 205 276 340`. For 101 it looks at the middle (150, too big, so keep the left half), then at 101: **2** looks. For 276 it looks at 150, then 276: **2**. For 999, which is not there, it takes **3** looks before the range is empty.',
          '**The three sizes:** the last line of each row has the list size, the scan count, the halving count and the keyed count. For 100, 1,000 and 10,000 customers the scan examines **100, 1000 and 10000** records; halving examines **7, 10 and 14**; the keyed lookup examines **1**.',
        ],
      },
      {
        type: 'table',
        headers: ['Customers', 'Scan (last customer)', 'Sorted, halved', 'Keyed by id'],
        rows: [
          ['6', '6', '3', '1'],
          ['100', '100', '7', '1'],
          ['1,000', '1,000', '10', '1'],
          ['10,000', '10,000', '14', '1'],
        ],
        caption: 'Records looked at to find the last customer. The scan grows as fast as the list; halving grows very slowly; the keyed lookup does not grow at all.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'These counts are the intuition behind complexity classes, but real choices weigh more than lookups. Write cost matters: keeping an array sorted under inserts moves records, and a keyed structure adds memory and the work of keeping the keys correct. Constants matter at small sizes, where a plain scan over a short array can beat a fancier structure, and cache behaviour favours contiguous data. Read-to-write ratio, whether you need ordered or range queries, and whether the data fits in memory all change the answer. A database index is exactly this trade made explicit: an extra structure, sorted or hashed, kept in sync so lookups skip most of the table, paid for by slower writes and more storage.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Argue the trade-offs with me',
        text: 'I have a program that stores customers and looks one up by id. I counted how many records are examined in three designs: an unsorted array (scan), a sorted array (halving) and an object keyed by id. Quiz me: give me three small situations, one at a time, such as "a shop adds 10,000 customers a day and rarely looks one up". For each, wait for me to say which design I would choose and why, then tell me whether my reasoning holds. Do not give me the answer before I try. Ask me what each design costs to keep up when a new customer is added.',
      },
      {
        type: 'list',
        items: [
          'A good answer separates finding from adding. If the AI only talks about lookups, ask it about the cost of adding a customer to each design.',
          'Check any number it quotes against your own counts from the code above. If it says halving looks at "half" of the records, that is wrong: it removes half of what is left each time, so the total is tiny.',
          'An AI may say one design is "always best". The decision table shows why that is wrong: the best choice depends on what the program does most.',
        ],
      },
      {
        type: 'takeaways',
        items: [
          'Efficiency means how much work and how much memory; we measure work by counting steps, such as records looked at, not by seconds.',
          'Scanning an unsorted array may look at every record; halving a sorted array looks at very few; a keyed lookup goes straight to the record.',
          'Each arrangement also has a price: sorted arrays shift records on insert, keyed structures use extra memory.',
          'To choose a structure, ask what the program does most often and read the answer off a decision table, then check it by counting.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-04-code-challenge-1',
          kind: 'code-challenge',
          title: 'Count the looks',
          prompt: 'Write `checksToFind(ids, target)` that scans the array from the left and returns how many ids it looked at to find `target`. If `target` is not in the array, every id was looked at, so return the array\'s length.',
          concept: 'counting records examined',
          language: 'javascript',
          starter: `function checksToFind(ids, target) {
  // count how many ids a scan from the left looks at
}`,
          solution: `function checksToFind(ids, target) {
  let looked = 0;
  for (const id of ids) {
    looked += 1;
    if (id === target) {
      return looked;
    }
  }
  return looked;
}`,
          tests: {
            kind: 'function',
            fn: 'checksToFind',
            cases: [
              { label: 'second id', args: [[205, 101, 340], 101], expected: 2 },
              { label: 'first id', args: [[205, 101, 340], 205], expected: 1 },
              { label: 'not in the list', args: [[205, 101, 340], 999], expected: 3 },
              { label: 'a long list, target last', args: [Array.from({ length: 1000 }, (_, i) => i), 999], expected: 1000, hidden: true },
            ],
          },
          hints: [
            'You need a counter that starts at 0 and goes up for every id you read.',
            'Add one to the counter first, then compare the id with the target and return the counter if it matches.',
            'If the loop finishes without a match, every id was read, so the counter already equals the length.',
          ],
          explanation: 'The counter goes up once per id read. A match returns it straight away; if the loop ends, the counter equals the array\'s length, which is the right answer for "not found".',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-04-scenario-1',
          kind: 'scenario',
          title: 'The canteen orders',
          prompt: 'Choose the arrangement that fits what this program does most.',
          concept: 'choosing a structure from the most common operation',
          situation: 'A school canteen app receives about 300 orders a day. Each order has a number. Staff look an order up by its number dozens of times while preparing it, and nobody ever needs a list in number order.',
          options: [
            { text: 'Keep the orders in an object keyed by order number', quality: 'best', consequence: 'Each lookup goes straight to the order, and adding an order is a single store. Order is not needed, so the keyed object loses nothing.' },
            { text: 'Keep the orders in an array in arrival order and scan it for each lookup', quality: 'acceptable', consequence: 'It works and is the simplest, but every lookup may read many orders, and staff do dozens of lookups per order.' },
            { text: 'Keep a sorted array and re-sort it every time a new order arrives', quality: 'poor', consequence: 'The sort order is never used, and keeping it costs work on every new order. You pay for an advantage nobody needs.' },
          ],
          hints: [
            'What does the program do most often: add, look up, or list in order?',
            'One option pays a price (keeping the order) for something the app never uses.',
            'Lookup by number is the common operation, and a keyed object answers it directly.',
          ],
          explanation: 'The most common operation is lookup by number, and order is not needed, so the keyed object is the best fit. A scan works but repeats work; sorting pays for an order nobody uses.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-04-match-1',
          kind: 'match',
          title: 'What does the program do most?',
          prompt: 'Match each program to the arrangement the decision table points to.',
          concept: 'choosing a structure',
          labels: { terms: 'The program mostly', meanings: 'Think about' },
          pairs: [
            { term: 'Looks up a product by its barcode, thousands of times a day', definition: 'An object keyed by the barcode', note: 'A keyed lookup goes straight to the record.' },
            { term: 'Logs thousands of sensor readings and only reads them all at the end of the day', definition: 'A plain array, appended at the end', note: 'Appending is one move and there are no searches to speed up.' },
            { term: 'Shows contacts in name order and finds a name by halving', definition: 'A sorted array', note: 'Both listing in order and halving need the data in sorted order.' },
          ],
          hints: [
            'Underline the verb in each: look up, log and read all, show in order and find.',
            'Which arrangement pays for order or for a key only when the program needs it?',
            'Lookup by key, append and read all, and order plus halving.',
          ],
          explanation: 'Each program has a dominant operation, and the matching arrangement makes that operation cheap: a key for lookups, an append for logging, sorted order for ordered listing and halving.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-04-q1',
        prompt: 'You scan an unordered array of 5,000 customers for the customer who happens to be last. Roughly how many customers are looked at?',
        choices: ['13', '5,000', '1', '2,500'],
        answer: 1,
        explanation: 'A scan looks at every record up to and including the match, and the match is the last one. Halving would look at about 13, but this array is unordered and a scan cannot skip.',
      },
      {
        id: 'data-structures-algorithms-04-q2',
        prompt: 'Why does the "look in the middle and discard half" routine need the array to be sorted?',
        choices: [
          'Because comparing the target with the middle tells you which half cannot contain it only if the values are in order',
          'Because an unsorted array has no middle element at all to look at',
          'Because sorted arrays are stored in a different place in memory from unsorted ones',
          'Because the routine counts looks by id, and ids only exist in sorted arrays',
        ],
        answer: 0,
        explanation: 'If the array is in order, a middle value that is too small means everything before it is too small too, so that half can be discarded. In an unordered array that conclusion is false.',
      },
      {
        id: 'data-structures-algorithms-04-q3',
        prompt: 'A shop adds 10,000 customers every day and almost never looks one up. Which arrangement saves the most work overall?',
        choices: [
          'A sorted array, so lookups are fast on the rare days they happen',
          'An object keyed by id, because it is always the fastest design',
          'An unsorted array that adds each customer at the end',
        ],
        answer: 2,
        explanation: 'The common operation is adding, and an append is one move. Keeping a sorted array means shifting records on every add, and a key store adds memory, both for lookups that hardly happen.',
      },
      {
        id: 'data-structures-algorithms-04-q4',
        prompt: 'A food-delivery app must always prepare the order that arrived first. Which row of the decision table points to the right idea?',
        choices: [
          'Always needs the most urgent item',
          'Finds a record by its id, many times',
          'Undoes the latest action',
          'Handles the oldest item first',
        ],
        answer: 3,
        explanation: 'First arrived, first prepared is "oldest item first", which is a queue. The most-urgent row is about priority, not arrival order, and undo takes the newest item.',
      },
      {
        id: 'data-structures-algorithms-04-q5',
        audience: { max: 'beginner' },
        prompt: 'When this lesson counts "records looked at", what is it measuring?',
        choices: [
          'How much work the program does to get its answer',
          'How many seconds the program takes on your phone',
          'How many customers are stored in the list',
        ],
        answer: 0,
        explanation: 'It measures work as a count of records examined. Seconds depend on the phone, and the size of the list is the input, not the work.',
      },
      {
        id: 'data-structures-algorithms-04-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate wants a keyed lookup structure in front of every list in the app "because lookups are fastest". What is the strongest objection?',
        choices: [
          'Keyed lookups are not actually faster than a scan at any size',
          'It cannot hold more than a few thousand records',
          'Each one costs extra memory and upkeep on every write, and gives nothing to code that mostly appends, lists in order or scans a small array',
        ],
        answer: 2,
        explanation: 'A keyed structure pays off only for key lookups. For write-heavy, ordered or tiny collections it adds memory and maintenance for no benefit, which is the same trade a database index makes.',
      },
    ],
    task: {
      title: 'Compare three ways to find a customer',
      steps: [
        'In any free JavaScript environment, put together the four code blocks from the lesson (`customers`, `findByScan`, `byId`, `sorted` with `findInSorted`, and `makeCustomers`). Confirm that you get the same counts as in the table.',
        'Change the target in the last block from the last customer to the first customer, then to a middle one, then to an id that is not in the list. For each target and for n = 100, 1,000 and 10,000, write down how many records the scan and the halving look at. The keyed lookup always looks at one.',
        'In three or four sentences, write which arrangement you would choose for a shop that looks customers up all day, and which for one that adds thousands of customers and rarely looks any up. Say what each costs to keep up when a customer is added.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Do the first part on paper with the six customers: write down how many customers a scan reads for each of the six ids, then add them up and divide by six to get the average number of looks.'] },
      { audience: { min: 'advanced' }, steps: ['Add a fourth design that keeps both the sorted array and the keyed object. Write what a lookup and an insert cost in it, and what bug appears if one structure is updated and the other is not.'] },
    ],
  },
];

export const project: Project | null = null;
