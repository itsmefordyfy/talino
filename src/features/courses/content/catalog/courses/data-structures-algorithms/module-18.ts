import type { Lesson, Project } from '../../../types';

export const lessons: Lesson[] = [
  {
    id: 'data-structures-algorithms-65',
    day: 65,
    title: 'Asking AI to Explain Algorithms and Choose a Data Structure',
    summary: 'Use an AI assistant as a partner for understanding and choosing: state your own answer first, check every explanation by tracing it, and give the assistant constraints instead of asking for a verdict.',
    intro: {
      objectives: [
        'Write down your own answer before you ask an assistant',
        'Check an explanation of an algorithm by tracing it on a small input',
        'Write a constraint card that describes what a structure must do',
        'Compare options by counting operations and decide for yourself',
      ],
      why: 'An assistant can explain almost any algorithm fluently, and fluent is not the same as correct. If you can check an explanation and state your constraints, you stay the person who decides, and the assistant becomes a faster way to learn.',
    },
    minutes: 25,
    skills: ['ai-algorithms', 'choose-structure'],
    body: [
      {
        type: 'paragraph',
        text: 'You now know the main structures and algorithms well enough to use an AI assistant for them the right way. The right way has one rule that runs through this whole module: **you are the reasoner and the assistant is the partner**. You state your own answer before you ask. You use the assistant to explain, question and check, and you decide. This first lesson covers two everyday uses: asking for an explanation of an algorithm, and choosing a data structure for a job.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Think of a driving instructor sitting beside you. You hold the wheel and make the decisions. The instructor says "mirror" or asks "what is the speed limit here?". If the instructor grabs the wheel every time, you never learn to drive. If you follow every instruction without looking, one wrong turn from the instructor puts you in the ditch too.',
      },
      {
        type: 'paragraph',
        text: 'The comparison is imperfect in one way: an instructor has passed a test and knows the road, while an assistant writes plausible text. It can be wrong in the same confident voice it is right in. That is why we do not trust an explanation until we have checked it.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'There are four habits. **State first**: before you ask, write your own answer, even a rough or wrong one, such as "I think binary search checks the middle and throws away half". Writing it shows you what you actually know, and it lets the assistant respond to your thinking instead of replacing it. **Ask for steps and questions**, not conclusions: ask it to explain one idea, give an example with small numbers, or quiz you. **Trace what you were told**: an explanation is a set of claims about what happens, and you can test each claim by running the algorithm on a small input and printing what the variables hold at every round. **Decide yourself**: use the assistant\'s trade-offs as input, and make the call with your own numbers.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: if a friend tells you how a card trick works, you do not just nod. You try the trick with a few cards and watch each step. Running the algorithm on a tiny list and printing what happens is that same test, and it works whatever the assistant says.',
      },
      {
        type: 'paragraph',
        text: 'Choosing a structure follows the same pattern. Before you ask, write a **constraint card**: the operations the program performs and how often each runs, how big the data gets, whether order matters, whether duplicates are allowed, and what must stay true. Then ask the assistant for questions you have not answered and for the trade-offs of two or three candidates. Finally, **estimate with counts**: multiply how often each operation runs by what it costs in that structure, as in module 2, and compare totals.',
      },
      {
        type: 'table',
        headers: ['Constraint', 'Example for a parcel counter'],
        rows: [
          [
            'Operations and how often',
            '20,000 look-ups by tracking number a day, 300 new parcels, removals when collected',
          ],
          ['Size', 'About 5,000 parcels at a time'],
          ['Order', 'Nobody needs them in any order'],
          ['Duplicates', 'A tracking number is unique'],
          ['Must stay true', 'A collected parcel can never be found again'],
        ],
        caption: 'A constraint card. Hand it to the assistant before asking which structure to use.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'In team use, treat the constraint card as the artefact worth keeping: it is a short specification that survives a change of tool, and it is what a reviewer checks the final structure against. Prefer asking the assistant to enumerate the constraints you have not stated (concurrency, memory limits, persistence, the worst-case input) over asking it for a verdict. When it names a structure, require the cost of each operation and the case (average or worst) it assumes, then verify with counters and a doubling test as in module 2. Explanations of well-known algorithms are usually right in outline and wrong in details such as an off-by-one bound or an unstated precondition, so trace the exact version of the algorithm you will ship.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Suppose an assistant explains binary search to you. Instead of trusting the text, instrument the algorithm so that each round prints what it looks at.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Tracing binary search',
        code: `function binarySearchTrace(sorted, target) {
  let low = 0;
  let high = sorted.length - 1;
  let round = 0;
  while (low <= high) {
    round += 1;
    const mid = Math.floor((low + high) / 2);
    console.log(\`round \${round}: low=\${low} high=\${high} mid=\${mid} value=\${sorted[mid]}\`);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

const ids = [3, 8, 12, 17, 21, 26, 30, 35, 41, 47, 52, 58, 63, 70, 77];
console.log(binarySearchTrace(ids, 47));
console.log(binarySearchTrace(ids, 50));`,
      },
      {
        type: 'paragraph',
        text: 'Now the estimate for the parcel counter. We count model steps, not seconds, for three candidate structures.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Comparing options by counting',
        code: `const n = 5000;
const lookups = 20000;
const inserts = 300;

const options = {
  'unsorted array': { lookup: n / 2, insert: 1 },
  'sorted array and binary search': { lookup: Math.ceil(Math.log2(n)), insert: n / 2 },
  'Map by tracking number': { lookup: 1, insert: 1 },
};

for (const [name, cost] of Object.entries(options)) {
  console.log(\`\${name}: \${lookups * cost.lookup + inserts * cost.insert}\`);
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`binarySearchTrace` is the binary search you wrote in module 14, plus a `round` counter and a `console.log` that prints `low`, `high`, `mid` and the value in the middle. Nothing else changed, so what it prints is exactly what the algorithm does.',
          'Searching for 47 in 15 sorted ids takes three rounds, and the window shrinks from positions 0 to 14, to 8 to 14, to 8 to 10. Each round the window is about half as big, which is the claim you wanted to test. The function returns 9, the position of 47.',
          'Searching for 50, which is not in the list, takes four rounds and ends when `low` passes `high`, then returns `-1`. The trace also shows the fourth round looking at 52 at position 10, where `low` and `high` meet. An explanation that says "it stops when it finds the value" is incomplete: you can see it must also stop when the window is empty.',
          'In the cost estimate, `n / 2` is the average number of items an unsorted scan looks at, `Math.ceil(Math.log2(n))` is the rounds of binary search (13 for 5,000), and a sorted array pays `n / 2` to shift items on each insert. The Map is counted as 1 per operation, which holds on average. The totals are 50,000,300, 1,010,000 and 20,300.',
          'These totals are not seconds and they hide constants, but they rank the options reliably. The Map wins because the job is mostly look-ups by an exact key. Change the numbers (say 300,000 inserts and 100 look-ups) and the ranking changes. That is why you write the card before choosing.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not paste secrets, passwords, customer records or private company code into an assistant. Use made-up data such as the sample tasks and customers in this course.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'First write your own explanation of binary search in two sentences. Then use a prompt that asks the assistant to question you, not replace you.',
      },
      {
        type: 'prompt',
        label: 'Explain after I try',
        text: 'I am learning binary search in JavaScript. My own explanation is: [your two sentences]. Do not give me a corrected version. Instead, (1) tell me which ONE part of my explanation you would test first, (2) give me a sorted array of 7 numbers and a target, and ask me to write down which positions are checked, in order, before you say anything else.',
      },
      {
        type: 'paragraph',
        text: "Then run the trace code on the array it gave you and compare your list of positions with the output. If the assistant's description of the algorithm differs from the trace, the trace wins. Also try this for choosing:",
      },
      {
        type: 'prompt',
        label: 'Constraint card',
        text: 'Here is my constraint card for a program: [paste your card with operations, frequencies, sizes, order and duplicates]. Do not choose for me. Ask me up to three questions about anything missing from the card, then list two or three candidate structures with the cost of each of my operations in each one, saying whether the cost is average or worst case. I will decide.',
      },
      {
        type: 'paragraph',
        text: 'What to look for: costs given without "average" or "worst", a structure recommended before it asked what the operations are, or a claim you can turn into a counter. An answer that sounds more certain than your card allows is a reason to ask what the assistant assumed.',
      },
      {
        type: 'takeaways',
        items: [
          'Write your own answer first; the assistant should respond to your thinking, not replace it.',
          'Ask for steps, examples and questions rather than conclusions, and decide yourself.',
          'Check an explanation by tracing the algorithm on a small input and printing what the variables hold.',
          'A constraint card (operations and frequencies, sizes, order, duplicates, what must stay true) is what you give an assistant before asking about structures.',
          'Compare candidates by multiplying how often each operation runs by its cost, and notice which numbers change the ranking.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-65-predict-output-1',
          kind: 'predict-output',
          title: 'Predict the trace',
          prompt: 'This code searches a sorted list of 7 numbers and prints what it looks at. What does it print?',
          concept: 'trace an algorithm',
          language: 'javascript',
          code: `const sorted = [2, 4, 6, 8, 10, 12, 14];
let low = 0;
let high = sorted.length - 1;
let rounds = 0;
while (low <= high) {
  rounds += 1;
  const mid = Math.floor((low + high) / 2);
  console.log(\`mid=\${mid} value=\${sorted[mid]}\`);
  if (sorted[mid] === 12) break;
  if (sorted[mid] < 12) low = mid + 1;
  else high = mid - 1;
}
console.log(rounds);`,
          expected: `mid=3 value=8
mid=5 value=12
2`,
          choices: [
            `mid=3 value=8
mid=5 value=12
2`,
            `mid=3 value=8
mid=5 value=12
3`,
            `mid=3 value=8
mid=4 value=10
mid=5 value=12
3`,
            `mid=6 value=14
mid=5 value=12
2`,
          ],
          wrongNotes: {
            'mid=3 value=8\nmid=5 value=12\n3': 'The counter increases once per round, and the search stops during the second round when it finds 12.',
            'mid=3 value=8\nmid=4 value=10\nmid=5 value=12\n3': 'After looking at 8 the window moves to positions 4 to 6, so the next middle is position 5, not 4.',
            'mid=6 value=14\nmid=5 value=12\n2': 'The first middle of positions 0 to 6 is position 3, not the last position.',
          },
          hints: [
            'The first middle is floor((0 + 6) / 2).',
            'Value 8 is smaller than 12, so `low` becomes mid + 1.',
            'The new window is positions 4 to 6, whose middle is floor((4 + 6) / 2).',
          ],
          explanation: 'The first round looks at position 3 (value 8) and moves low to 4. The second looks at position 5 (value 12), finds it and breaks after 2 rounds.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-65-match-1',
          kind: 'match',
          title: 'Turn a claim into a check',
          prompt: 'An assistant made each claim below. Match it to the quickest way to test it yourself.',
          concept: 'verifying explanations',
          labels: { terms: 'The claim', meanings: 'The check' },
          pairs: [
            {
              term: '"Binary search throws away half of the remaining positions each round."',
              definition: 'Print low and high every round on a sorted list of 15 and watch the window',
              note: 'The printed window shows directly how many positions are left each round.',
            },
            {
              term: '"A Map lookup beats scanning an array for a given id."',
              definition: 'Count the items a scan looks at for ids near the end, and compare with one Map get',
              note: 'Counting looks is the module 2 way to compare, and it works for any size.',
            },
            {
              term: '"This loop takes about log n rounds."',
              definition: 'Count rounds for n = 16 and n = 32 and see whether the count grows by about one',
              note: 'Doubling the input should add a constant if the claim is right.',
            },
            {
              term: '"Use a heap for this."',
              definition: 'Ask which operation needs the smallest or largest item again and again, and check that is on your card',
              note: 'A heap is for repeated minimum or maximum, so the card must contain that operation.',
            },
          ],
          hints: [
            'Ask what you could print or count to see the claim happen.',
            'A claim about growth is tested by running two sizes and comparing the counts.',
            'A claim about which structure to use is tested against the operations on your card.',
          ],
          explanation: 'Each claim describes what happens, and you can make it visible by printing a window, counting looks, doubling the input or checking the card.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-65-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the instrumented search',
          prompt: 'Fill the three blanks so that the search keeps its window correct and counts rounds.',
          concept: 'binary search window',
          language: 'javascript',
          code: `function search(sorted, target) {
  let low = 0;
  let high = sorted.length - 1;
  let rounds = 0;
  while (low <= high) {
    rounds += 1;
    const mid = Math.floor((low + ___) / 2);
    if (sorted[mid] === target) return \`found at \${mid} in \${rounds} rounds\`;
    if (sorted[mid] < target) low = ___ + 1;
    else high = ___ - 1;
  }
  return \`missing after \${rounds} rounds\`;
}

console.log(search([1, 3, 5, 7, 9, 11, 13], 11));
console.log(search([1, 3, 5, 7, 9, 11, 13], 4));`,
          blanks: [
            { answers: ['high'], feedback: 'The middle is halfway between low and high.' },
            {
              answers: ['mid'],
              feedback: 'The value in the middle was too small, so everything up to and including mid can be dropped.',
            },
            {
              answers: ['mid'],
              feedback: 'The value in the middle was too big, so everything from mid upward can be dropped.',
            },
          ],
          bank: ['high', 'mid', 'mid', 'low', 'rounds'],
          tests: { kind: 'output', expected: ['found at 5 in 2 rounds', 'missing after 3 rounds'] },
          hints: [
            'The middle uses the two ends of the window: low and the other end.',
            'When the middle value is too small, low moves to the position after the middle.',
            'When it is too big, high moves to the position before the middle.',
          ],
          explanation: 'The middle is floor((low + high) / 2). Moving low to mid + 1 or high to mid - 1 drops the middle position itself, so the window always shrinks.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-65-scenario-1',
          kind: 'scenario',
          title: 'The parcel counter',
          prompt: 'Choose the structure that best fits the constraint card.',
          concept: 'identify the appropriate data structure',
          situation: 'A counter holds about 5,000 parcels. Staff look a parcel up by its unique tracking number about 20,000 times a day. Around 300 parcels arrive daily and each leaves when collected. Nobody needs the parcels in any particular order.',
          options: [
            {
              text: 'A Map keyed by tracking number.',
              consequence: 'Look-ups, inserts and removals each cost one hash operation on average, so a day costs about 20,000 plus a few hundred steps.',
              quality: 'best',
            },
            {
              text: 'A sorted array of tracking numbers with binary search.',
              consequence: 'Look-ups are fast (about 13 steps) but every insert and removal shifts thousands of items, and nobody needed the order.',
              quality: 'acceptable',
            },
            {
              text: 'An unsorted array scanned from the start.',
              consequence: 'Each look-up looks at about 2,500 parcels on average, tens of millions of steps a day for a job a Map does directly.',
              quality: 'poor',
            },
            {
              text: 'A min-heap ordered by tracking number.',
              consequence: 'A heap gives the smallest item quickly but cannot find a given tracking number without scanning, and nobody asked for the smallest.',
              quality: 'poor',
            },
          ],
          hints: [
            'Which operation happens most often, and what does it know about the parcel?',
            'An exact unique key is the case a Map is built for.',
            'Does the card contain any operation that needs order?',
          ],
          explanation: "The card is dominated by look-ups by an exact key with no need for order, which is the Map's strength. Order-based structures pay for something the job never asks for.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-65-code-challenge-1',
          kind: 'code-challenge',
          title: 'Count the rounds',
          prompt: 'Write `roundsNeeded(sorted, target)`. It runs binary search and returns how many rounds it takes: one round for each time it looks at a middle value. It stops when it finds the target or when the window is empty. An empty list takes 0 rounds.',
          concept: 'instrumenting an algorithm',
          language: 'javascript',
          starter: `function roundsNeeded(sorted, target) {
  let low = 0;
  let high = sorted.length - 1;
  let rounds = 0;
  // count one round each time the middle value is looked at
  return rounds;
}`,
          solution: `function roundsNeeded(sorted, target) {
  let low = 0;
  let high = sorted.length - 1;
  let rounds = 0;
  while (low <= high) {
    rounds += 1;
    const mid = Math.floor((low + high) / 2);
    if (sorted[mid] === target) return rounds;
    if (sorted[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return rounds;
}`,
          tests: {
            kind: 'function',
            fn: 'roundsNeeded',
            cases: [
              { label: 'found in the middle', args: [[1, 3, 5, 7, 9, 11, 13], 7], expected: 1 },
              { label: 'found at the end', args: [[1, 3, 5, 7, 9, 11, 13], 13], expected: 3 },
              { label: 'not found', args: [[1, 3, 5, 7, 9, 11, 13], 2], expected: 3 },
              { label: 'empty list', args: [[], 4], expected: 0 },
              { label: 'one item, found', args: [[5], 5], expected: 1, hidden: true },
              {
                label: 'fifteen items, absent',
                args: [[3, 8, 12, 17, 21, 26, 30, 35, 41, 47, 52, 58, 63, 70, 77], 50],
                expected: 4,
                hidden: true,
              },
            ],
          },
          hints: [
            'Copy the loop of the traced search and keep the counter.',
            'Add 1 to `rounds` at the start of every turn of the loop, before looking at the middle value.',
            'Return `rounds` when the middle equals the target, and also after the loop ends.',
          ],
          explanation: 'A round is one look at a middle value. Counting at the start of each turn gives the number of looks, whether the search ends by finding the target or by emptying the window.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-65-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Weak and strong questions',
          prompt: 'Tap each weak request to see how to make it stronger.',
          concept: 'asking an assistant well',
          cards: [
            {
              front: 'Weak: "Explain quicksort."',
              back: 'Stronger: "Here is my two-sentence idea of quicksort. Ask me to sort [5, 2, 8, 1] by hand with a pivot of my choice, and tell me only after I answer where my idea breaks."',
            },
            {
              front: 'Weak: "Which data structure should I use?"',
              back: 'Stronger: paste your constraint card, say you will decide, and ask for the questions you have not answered and the cost of each of your operations in two or three candidates.',
            },
            {
              front: 'Weak: "Is this right?" (with your code)',
              back: 'Stronger: say what you believe the code does and what input you will try, and ask for a small input that would show whether you are wrong.',
            },
          ],
          hints: [],
          explanation: 'A stronger request contains your own answer or constraints, asks for questions or checks, and leaves the decision with you.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-65-q1',
        prompt: 'Why write down your own explanation before asking an assistant to explain an algorithm?',
        choices: [
          'The assistant answers faster, because it is given more text to read before it starts',
          'Assistants refuse to answer any request that has no draft attached',
          'It shows what you really understand, so the reply speaks to your thinking',
          'It guarantees that the explanation you get back will be correct',
        ],
        answer: 2,
        explanation: 'Your draft exposes the gaps you have, and a reply to your draft teaches more than a lecture. It guarantees nothing about correctness, so you still check the reply.',
      },
      {
        id: 'data-structures-algorithms-65-q2',
        prompt: 'An assistant says "binary search stops when it finds the value". Your trace for a missing value prints four rounds and then -1. What does the trace tell you?',
        choices: [
          'The explanation is incomplete: the search also ends when the window is empty',
          'The assistant is right and the trace must have been written wrongly',
          'Binary search never works on values that are missing from the list',
          'The list must have been unsorted, otherwise there would be no fourth round',
        ],
        answer: 0,
        explanation: 'The algorithm ends in two ways: it finds the target, or `low` passes `high` and the window is empty. A trace shows both, which is why tracing beats trusting.',
      },
      {
        id: 'data-structures-algorithms-65-q3',
        prompt: 'In the parcel counter estimate, which change would most likely make a sorted array beat a Map for look-ups?',
        choices: [
          'The Map holds 5,000 parcels instead of only 500 of them, as it did last year',
          'Parcels are removed from the counter as soon as they are collected',
          'Tracking numbers are unique, so no two parcels ever share the same one',
          'Staff must list every parcel in tracking number order, with few look-ups',
        ],
        answer: 3,
        explanation: 'Listing in order is a job a sorted array does for free and a Map cannot do. When the card changes, the costs change, which is why the card comes first.',
      },
      {
        id: 'data-structures-algorithms-65-q4',
        prompt: 'Which request keeps you the decision maker?',
        choices: [
          '"Pick the best structure for my app and write all of the code for it."',
          '"Here is my card. Ask what is missing and list each cost. I will decide."',
          '"Tell me which of these two is correct, and do not explain your reason."',
          '"Rewrite my explanation of the algorithm so that it becomes correct."',
        ],
        answer: 1,
        explanation: 'Asking for questions and costs gives you material to decide with. The other requests hand the decision, or the correction, to the assistant.',
      },
      {
        id: 'data-structures-algorithms-65-q5',
        audience: { max: 'beginner' },
        prompt: 'A friend explains a card trick. What is the best way to check the explanation?',
        choices: [
          'Believe it, because your friend sounded completely sure about it',
          'Ask three other friends to say that it is true, then believe it',
          'Wait for a week and then ask your friend to explain it again',
          'Try the trick with a few cards and watch each step',
        ],
        answer: 3,
        explanation: 'Running the trick on a small example shows each step. In the same way, tracing an algorithm on a tiny list shows whether an explanation matches what happens.',
      },
      {
        id: 'data-structures-algorithms-65-q6',
        audience: { min: 'advanced' },
        prompt: 'An assistant recommends a hash table and says the operations are O(1). What should your review require before you accept it?',
        choices: [
          'Nothing more: hash tables are O(1), so the claim can simply be accepted as it was stated',
          'A rewrite in another language, so that the claim can be tested again',
          'The case (average), the key distribution it assumes, and your own doubling test',
          'A balanced tree instead of the hash table, whatever the card says',
        ],
        answer: 2,
        explanation: 'O(1) is an average that depends on a good hash and a bounded load factor. Asking for the case, the assumption and a measurement turns a claim into a check.',
      },
    ],
    task: {
      title: 'Write a card, trace a search',
      minutes: 15,
      steps: [
        'Pick a small program idea of your own (a contact list, a queue at a clinic). Write its constraint card: operations and how often, size, order, duplicates, what must stay true.',
        'Estimate the cost of two candidate structures with the counting code from this lesson, changing the numbers to match your card.',
        'Run the binary search trace on an array of 7 numbers you choose. Before running, write down which positions will be checked, then compare.',
        'If you use an assistant, use one of the prompts above with your own card and write down one thing in its answer that you checked and one you could not.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the assistant to explain binary search with a guessing game (a number from 1 to 100) and play three rounds with it, writing down each guess and the window before the assistant tells you the next one.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Turn your constraint card into three executable checks (an operation counter for each critical operation at 10x the expected size) and keep them next to the code as the structure's acceptance test.",
        ],
      },
    ],
  },
  {
    id: 'data-structures-algorithms-66',
    day: 66,
    title: 'Generating, Reading and Testing Data Structure Code with AI',
    summary: 'Ask an assistant for an implementation the careful way: predict first, read every line, trace a small input, then test edge cases and properties to catch the bugs a single example hides.',
    intro: {
      objectives: [
        'Ask for generated code with the complexity, comments and tests you need',
        'Read generated code line by line and trace it with a small input',
        'Recognise five classic bugs in algorithm code and fix them',
        'Test with edge cases and property checks instead of one happy example',
      ],
      why: 'Generated code that runs once is not generated code that works. You will meet code written by an assistant every day, and the skill that keeps it out of trouble is reading it and testing it with the right inputs.',
    },
    minutes: 30,
    skills: ['ai-algorithms'],
    body: [
      {
        type: 'paragraph',
        text: 'An assistant can write a linked list, a heap or a sort in seconds. That is the easy part. The hard part is knowing whether what it wrote is correct, and the usual way people find out is that something breaks in front of a user. This lesson gives you a routine: predict, read, trace, test. It works for any code an assistant, a teammate or you wrote yesterday.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Imagine a carpenter hands you a finished cabinet and says "it is fine, I opened the top door and it works". You would not stop there. You would open every door and drawer, put a level on the shelves, and push on the corners. You would test the cases where cabinets fail, not just the one case that works.',
      },
      {
        type: 'paragraph',
        text: 'Code is harder than a cabinet in one way: you cannot see a missing screw. A bug may show only when the first item is the smallest, or when the list is empty, so you have to choose the inputs that would expose it.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: '**Ask well.** Name the structure and the operations, say what each should cost, and ask for comments and tests. A request such as "write a min-heap class with push, pop and peek, with a comment on the cost of each, and five tests including an empty heap" gives you something to check. Before you send it, write down your prediction: what will pop cost, which edge cases matter. The prediction is what you compare the answer with.',
      },
      {
        type: 'paragraph',
        text: '**Read before you run.** Go line by line and say what each line is for. If you cannot say, ask the assistant what that line is for, or delete it and see what breaks. Then **trace** the function by hand with a tiny input, such as three items, writing down the variables after each step. A table with a column per variable is the tool from module 2.',
      },
      {
        type: 'paragraph',
        text: '**Test with the right inputs.** One example proves little, and the example an assistant shows is chosen to work. Write your own list of cases: an empty input, a single item, duplicates, already sorted, reversed, all equal, and one large input made by a loop. Then add **property checks**: facts that must hold for any correct output. For a sort the output is in order (`isSorted`) and has exactly the same elements as the input (`sameElements`). A property check does not need the answer to be written in advance, so it works on a large generated input.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a test is a question with a known answer. If you only ask the questions the code was written to pass, it will pass them. The skill is in asking the awkward ones: nothing, one thing, the same thing twice, backwards.',
      },
      {
        type: 'table',
        headers: ['Classic bug', 'What it looks like', 'How to catch it'],
        rows: [
          [
            'Off-by-one',
            'The first or last item is skipped or handled wrongly',
            'A one-item, two-item and reversed input; print the loop bounds',
          ],
          [
            'Wrong base case',
            'A recursive function never stops or returns the wrong value for the smallest input',
            'Trace the call for n = 0 and n = 1',
          ],
          [
            'Changing a list while looping over it',
            'Some items are skipped (a `splice` inside a forward loop)',
            'An input with two equal neighbours',
          ],
          [
            'Comparing objects by reference',
            '`includes` or `===` says an identical-looking object is missing',
            'Compare ids or fields, not the objects',
          ],
          [
            'Empty input not handled',
            '`-Infinity`, `undefined` or a crash',
            'Always run the empty case first',
          ],
        ],
        caption: 'Five bugs worth recognising on sight. Each hides from a single happy-path example.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'For experienced engineers the useful frame is a review contract. Generated code is an untrusted contribution: ask for the invariant it relies on, require tests that fail on a wrong implementation (mutation-style: break the code on purpose and confirm a test notices), and prefer property checks and differential tests against a simple trusted version (such as the built-in `sort`) over hand-picked cases. Keep the generated tests separate from your own, because an assistant that writes both the code and its tests tends to write tests that agree with the code. Check complexity yourself, including the cost of built-ins used inside loops, and check that the code does not mutate its inputs unless it says it does.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Here is an insertion sort of the kind an assistant might produce. Its own example is a sorted list, which is the one input that cannot go wrong. Read it, then predict what it prints for the second call.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A generated insertion sort',
        code: `function insertionSort(items) {
  const result = [...items];
  for (let i = 1; i < result.length; i++) {
    const current = result[i];
    let j = i - 1;
    while (j > 0 && result[j] > current) {
      result[j + 1] = result[j];
      j -= 1;
    }
    result[j + 1] = current;
  }
  return result;
}

console.log(insertionSort([4, 5, 6]));
console.log(insertionSort([5, 2, 4, 1, 3]));`,
      },
      {
        type: 'paragraph',
        text: 'The first call looks right and the second does not. Now build the tests that would have told you: two property checks, a deterministic way to make a large input, and a list of edge cases.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Edge cases and property checks',
        code: `function isSorted(list) {
  for (let i = 1; i < list.length; i++) {
    if (list[i - 1] > list[i]) return false;
  }
  return true;
}

function sameElements(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Map();
  for (const value of a) counts.set(value, (counts.get(value) ?? 0) + 1);
  for (const value of b) {
    if (!counts.has(value) || counts.get(value) === 0) return false;
    counts.set(value, counts.get(value) - 1);
  }
  return true;
}

let seed = 7;
const next = () => {
  seed = (seed * 31 + 11) % 1009;
  return seed;
};
const large = [];
for (let i = 0; i < 200; i++) large.push(next());

const cases = {
  empty: [],
  'one item': [9],
  'already sorted': [1, 2, 3, 4],
  reversed: [4, 3, 2, 1],
  duplicates: [3, 1, 3, 2, 1],
  'all equal': [2, 2, 2],
  'two hundred values': large,
};

function runChecks(sortFn) {
  for (const [name, input] of Object.entries(cases)) {
    const copy = [...input];
    const output = sortFn(input);
    const ok = isSorted(output) && sameElements(input, output) && sameElements(copy, input);
    console.log(\`\${ok ? 'PASS' : 'FAIL'} \${name}\`);
  }
}

runChecks(insertionSort);`,
      },
      {
        type: 'paragraph',
        text: 'Add the generated function above this code and run it. Then fix the bug and run the same checks on the fixed version.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The fixed version',
        code: `function insertionSortFixed(items) {
  const result = [...items];
  for (let i = 1; i < result.length; i++) {
    const current = result[i];
    let j = i - 1;
    while (j >= 0 && result[j] > current) {
      result[j + 1] = result[j];
      j -= 1;
    }
    result[j + 1] = current;
  }
  return result;
}

runChecks(insertionSortFixed);`,
      },
      { type: 'paragraph', text: 'The other classic bugs are small enough to see at once.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Three quick bugs',
        code: `const tickets = [{ id: 1 }, { id: 2 }];
console.log(tickets.includes({ id: 1 }));
console.log(tickets.some((ticket) => ticket.id === 1));

const numbers = [1, 2, 2, 3];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] === 2) numbers.splice(i, 1);
}
console.log(numbers);

console.log(Math.max(...[]));`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          'In `insertionSort`, `current` is the item being placed and `j` walks left over the already sorted part, shifting bigger items one place to the right. The loop condition `j > 0` stops one step too early: position 0 is never compared, so a value smaller than everything before it cannot reach the front. `[5, 2, 4, 1, 3]` comes out as `[ 5, 1, 2, 3, 4 ]`.',
          'The checks print `FAIL` for reversed input, for duplicates and for the 200 generated values, and `PASS` for empty, one item, already sorted and all equal. Notice that all equal passes: the bug needs a smaller value to move to the front. A test list with only easy cases would have called the code correct.',
          '`isSorted` starts at index 1 and compares each item with the one before it. For an empty list or one item the loop never runs and the answer is `true`. `sameElements` counts each value in the first list and subtracts the second; it needs the counts because a sort can drop one of two equal values and keep the length the same only by adding another.',
          'The generator `next` is a tiny formula that gives the same 200 numbers every run, so a failure is repeatable. The fix is `j >= 0`: then position 0 is compared too, and every check prints `PASS`.',
          'In the bugs block: `includes({ id: 1 })` is `false` because the new object is a different object, while `some` with an id comparison is `true`. The `splice` inside the forward loop shifts the list left, so the next 2 is skipped and the output is `[ 1, 2, 3 ]`. `Math.max(...[])` is `-Infinity`.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not let the assistant write the code and the tests that judge it in the same request and then trust both. Write the edge-case list yourself first, then compare it with the tests it offers.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'This is the generate, explain, find-the-bug routine. First write your prediction: the structure, the operations, the cost you expect and three edge cases. Then ask.',
      },
      {
        type: 'prompt',
        label: 'Generate',
        text: 'Write a JavaScript function `removeDuplicates(list)` that returns the unique values in first-seen order, using a Set. Add a comment above it stating its time and space cost and whether the cost is average or worst case. Do not write tests yet. After the code, list the edge cases you think matter, in one line each.',
      },
      {
        type: 'paragraph',
        text: 'Compare its edge cases with your three. Then read the code line by line and trace it for [3, 1, 3, 2]. Only then ask:',
      },
      {
        type: 'prompt',
        label: 'Check my trace',
        text: 'Here is my trace of your function for [3, 1, 3, 2]: [your trace]. Do not give me the answer. Tell me only whether each line of my trace matches what the code does, and ask me one question about a line I got wrong or skipped.',
      },
      {
        type: 'paragraph',
        text: "What to look for: a claimed cost that ignores copying, a missing empty-input case, or code that mutates its argument. The assistant's own example may be the easy one, so run your edge cases and the two property checks yourself.",
      },
      {
        type: 'takeaways',
        items: [
          'Predict the structure, cost and edge cases before you ask, and ask for comments, tests and the cost of each operation.',
          'Read generated code line by line and trace a tiny input before trusting it.',
          'Test with your own list: empty, one item, duplicates, sorted, reversed, all equal and a large generated input.',
          'Property checks (output is in order and has the same elements) work on any input without a prepared answer.',
          'Know the five classic bugs: off-by-one, wrong base case, changing a list while looping, comparing objects by reference and unhandled empty input.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-66-fix-bug-1',
          kind: 'fix-bug',
          title: 'The sort that skipped the front',
          prompt: 'The sort should print `[ 1, 2, 3, 4, 5 ]`. It prints `[ 5, 1, 2, 3, 4 ]`. Tap the buggy line and pick the fix.',
          concept: 'off-by-one bug',
          language: 'javascript',
          code: `function insertionSort(items) {
  const result = [...items];
  for (let i = 1; i < result.length; i++) {
    const current = result[i];
    let j = i - 1;
    while (j > 0 && result[j] > current) {
      result[j + 1] = result[j];
      j -= 1;
    }
    result[j + 1] = current;
  }
  return result;
}

console.log(insertionSort([5, 2, 4, 1, 3]));`,
          bugLine: 6,
          fixes: [
            {
              line: '    while (j >= 0 && result[j] > current) {',
              correct: true,
              why: 'It lets j reach position 0, so the current item can be compared with the first item and move to the front.',
            },
            {
              line: '    while (j > 1 && result[j] > current) {',
              correct: false,
              why: 'This stops even earlier: positions 0 and 1 are never compared.',
            },
            {
              line: '    while (j > 0 || result[j] > current) {',
              correct: false,
              why: 'With ||, the loop keeps shifting for every j above 0 whether or not the item is bigger, so items are moved when they should stay.',
            },
          ],
          tests: { kind: 'output', expected: ['[ 1, 2, 3, 4, 5 ]'] },
          lineNote: 'The final loop of the sort walks left over the sorted part. Which line decides how far left it may go?',
          hints: [
            'Try the input by hand: where does the 1 end up, and what stopped it?',
            'The loop condition j > 0 never lets j be 0, which is the first position.',
            'The loop must also run when j is 0, so use a comparison that allows 0.',
          ],
          explanation: 'Position 0 is a real position, so the walk to the left must be allowed to reach it. With j > 0 the smallest values stop at index 1.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-66-predict-output-1',
          kind: 'predict-output',
          title: 'Changing a list while looping',
          prompt: 'The code removes every 20 from a list by splicing inside a forward loop. What does it print?',
          concept: 'mutating while iterating',
          language: 'javascript',
          code: `const prices = [10, 20, 20, 30, 20];
for (let i = 0; i < prices.length; i++) {
  if (prices[i] === 20) prices.splice(i, 1);
}
console.log(prices);
console.log(prices.length);`,
          expected: `[ 10, 20, 30 ]
3`,
          choices: [
            `[ 10, 30 ]
2`,
            `[ 10, 20, 30 ]
3`,
            `[ 10, 20, 30, 20 ]
4`,
            `[ 10, 30, 20 ]
3`,
          ],
          wrongNotes: {
            '[ 10, 30 ]\n2': 'That is what a correct removal would print. Splicing shifts the later items left, so the loop steps over the item that moved into the removed position.',
            '[ 10, 20, 30, 20 ]\n4': 'Two 20s are removed, not none: the first at index 1 and the last, which is reached after the shift.',
            '[ 10, 30, 20 ]\n3': 'The 20 that stays is the one that slid into the index just visited, which is the second of the two neighbours.',
          },
          hints: [
            'At index 1 the first 20 is removed and everything after it moves one place left.',
            'The next turn looks at index 2, which now holds 30. What happened to the second 20?',
            'The second 20 moved to index 1 and the loop already passed it.',
          ],
          explanation: 'After the first splice the second 20 sits at index 1, which the loop has already passed, so it stays. Only the last 20 is removed.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-66-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the property check',
          prompt: 'Complete `isSorted` so that an empty list and a one-item list count as sorted, equal neighbours are allowed and a smaller neighbour fails.',
          concept: 'property checks',
          language: 'javascript',
          code: `function isSorted(list) {
  for (let i = ___; i < list.length; i++) {
    if (list[i - 1] ___ list[i]) return false;
  }
  return ___;
}

console.log(isSorted([]));
console.log(isSorted([4]));
console.log(isSorted([1, 2, 2, 5]));
console.log(isSorted([3, 1]));`,
          blanks: [
            {
              answers: ['1'],
              feedback: 'We compare each item with the one before it, so the first item has nothing to compare with.',
            },
            {
              answers: ['>'],
              feedback: 'The previous item must not be bigger than the current one.',
            },
            { answers: ['true'], feedback: 'If no pair was out of order, the list is sorted.' },
          ],
          bank: ['1', '2', '>', '<', 'true', 'false'],
          tests: { kind: 'output', expected: ['true', 'true', 'true', 'false'] },
          hints: [
            'Start at the second item, because each comparison looks one place to the left.',
            'Equal neighbours are allowed, so only a previous item that is bigger is a problem.',
            'If the loop finishes without returning false, what should the function say?',
          ],
          explanation: 'Starting at 1 avoids comparing the first item with nothing, and `>` lets equal values pass. A list with no out-of-order pair, including an empty one, is sorted.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-66-match-1',
          kind: 'match',
          title: 'From symptom to cause',
          prompt: 'Match each symptom seen in generated code to the most likely cause.',
          concept: 'debugging algorithm code',
          labels: { terms: 'The symptom', meanings: 'The likely cause' },
          pairs: [
            {
              term: '`includes` says false for an object that prints exactly like one in the list',
              definition: 'Objects are compared by reference, not by their fields',
              note: 'Two objects with the same fields are still two objects.',
            },
            {
              term: 'Every second duplicate survives a removal loop',
              definition: 'The list is changed while the loop walks over it',
              note: 'Items shift left after a removal and the loop steps over one.',
            },
            {
              term: 'A maximum of an empty list is -Infinity',
              definition: 'The empty input was never considered',
              note: 'The code assumed at least one item.',
            },
            {
              term: 'A sort is right except for the first item',
              definition: 'A loop bound stops one position early (off-by-one)',
              note: 'The first position is never compared.',
            },
          ],
          hints: [
            'Think about where each symptom shows: one item, every second item, or an empty list.',
            'A symptom that depends on identical-looking things is about comparing.',
            'A bug at only one end of the list is usually about a bound.',
          ],
          explanation: 'Each symptom has a signature: identical-looking objects point to reference comparison, skipped neighbours to mutation, special values to empty input and a bad first or last item to a bound.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-66-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the same-elements check',
          prompt: 'Write `sameElements(a, b)`. It returns `true` when the two arrays hold the same values the same number of times, in any order, and `false` otherwise. Use a Map to count.',
          concept: 'property checks',
          language: 'javascript',
          starter: `function sameElements(a, b) {
  // true when a and b hold the same values the same number of times, in any order
  return false;
}`,
          solution: `function sameElements(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Map();
  for (const value of a) counts.set(value, (counts.get(value) ?? 0) + 1);
  for (const value of b) {
    if (!counts.has(value) || counts.get(value) === 0) return false;
    counts.set(value, counts.get(value) - 1);
  }
  return true;
}`,
          tests: {
            kind: 'function',
            fn: 'sameElements',
            cases: [
              { label: 'same values, different order', args: [[3, 1, 2], [1, 2, 3]], expected: true },
              { label: 'a value is missing', args: [[1, 2, 3], [1, 2]], expected: false },
              { label: 'a repeated value matters', args: [[1, 1, 2], [1, 2, 2]], expected: false },
              { label: 'both empty', args: [[], []], expected: true },
              {
                label: 'same length, one different value',
                args: [[4, 5, 6], [4, 5, 7]],
                expected: false,
                hidden: true,
              },
              {
                label: 'duplicates in different order',
                args: [[2, 1, 2, 3, 2], [2, 2, 3, 2, 1]],
                expected: true,
                hidden: true,
              },
            ],
          },
          hints: [
            'If the lengths differ, the answer is already false.',
            'Count each value of `a` in a Map, then subtract one for each value of `b`.',
            'If `b` has a value that is missing from the counts or already at zero, return false.',
          ],
          explanation: 'Counting handles repeated values: a value of `b` is allowed only while the counts of `a` still have some left. If every value of `b` is matched and the lengths are equal, the arrays hold the same elements.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-66-scenario-1',
          kind: 'scenario',
          title: 'The code arrived with one passing example',
          prompt: 'Choose the best first step.',
          concept: 'reviewing generated code',
          situation: 'An assistant gave you a function that removes duplicates from a customer list, together with one example that prints the right result. Your project needs it for lists of up to 10,000 customers, which may be empty and may contain repeats.',
          options: [
            {
              text: 'Read it line by line, trace a three-item input by hand, and run your own list of edge cases (empty, one, all equal, large) with property checks.',
              consequence: 'You learn what it does, you find the bug (if there is one) before users do, and you can say what it costs.',
              quality: 'best',
            },
            {
              text: 'Run it on two or three more normal-looking inputs and use it if they work.',
              consequence: 'Better than one, but normal inputs rarely include the empty list, all-equal lists or a large list, which is where bugs and slowness live.',
              quality: 'acceptable',
            },
            {
              text: 'Use it because the example printed the right result.',
              consequence: 'The example was chosen to work. You now depend on code you have not read, for inputs it has not seen.',
              quality: 'poor',
            },
            {
              text: 'Ask the assistant whether the code is correct and use its answer.',
              consequence: 'It will probably say yes, in the same confident voice, and you have learned nothing you can verify.',
              quality: 'poor',
            },
          ],
          hints: [
            'What would a bug need in order to hide from one example?',
            'Which of these steps give you evidence you can check yourself?',
            'Reading and testing with your own inputs is evidence; a verdict is not.',
          ],
          explanation: "You trust code to the extent you have read and tested it. Your own edge cases and property checks are evidence; an assistant's assurance is not.",
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-66-q1',
        prompt: 'An assistant shows a sort and one example that prints a correct result. Which fact makes you least ready to trust it?',
        choices: [
          'The function has comments that explain each of its steps',
          'The example input it was shown on was already sorted',
          'The function returns a new array rather than changing the old one',
          'The code is short and has only one loop in it',
        ],
        answer: 1,
        explanation: "A sorted input is the one input that hides most sorting bugs. An example chosen by the author is evidence of nothing but the author's choice.",
      },
      {
        id: 'data-structures-algorithms-66-q2',
        prompt: 'Why does a property check such as "the output is sorted and has the same elements" suit a 10,000-value test?',
        choices: [
          'It runs faster than any other kind of test that could be written',
          'It needs the correct answer to be written down in advance for each input that is tried',
          'It makes the code that is being tested run faster as well',
          'It states facts that hold for every correct output, so no stored answer is needed',
        ],
        answer: 3,
        explanation: 'A property describes what any correct output must satisfy. You can generate a large input, run the code and check the properties without ever writing the expected output.',
      },
      {
        id: 'data-structures-algorithms-66-q3',
        prompt: 'A removal loop deletes items with `splice(i, 1)` while moving `i` forward by one every turn. Which input exposes the bug?',
        choices: [
          'Two equal items next to each other, which should both be removed',
          'An empty list that has no items in it at all, which every function must handle',
          'A list of one item that is not equal to the value',
          'A list whose items are all different from each other',
        ],
        answer: 0,
        explanation: 'After the first removal the second item slides into the position just handled and the loop steps over it. With no equal neighbours, the shift does not matter.',
      },
      {
        id: 'data-structures-algorithms-66-q4',
        prompt: 'Your trace of a generated function disagrees with what the code prints. What is the right conclusion?',
        choices: [
          'The code is right, because a computer cannot make a mistake when it runs',
          'Your trace must be wrong, so write it again without looking at the code',
          'Find the first step where they differ: one of the two is wrong',
          'The assistant that wrote the code should decide which of the two is right',
        ],
        answer: 2,
        explanation: 'The running code tells you what happens; your trace tells you what you expect. A difference means one of the two is wrong, and finding the first step where they diverge tells you which.',
      },
      {
        id: 'data-structures-algorithms-66-q5',
        audience: { max: 'beginner' },
        prompt: 'Which of these is the best set of test inputs for a function that sorts a list?',
        choices: [
          "Only the list that was shown in the assistant's own example",
          'An empty list, a one-item list, a reversed list and one with repeats',
          'Three lists of different lengths that are all already in order',
          'One very long list that was made of random words from a book',
        ],
        answer: 1,
        explanation: 'The awkward cases are where bugs hide: nothing, one item, the opposite of sorted and repeats. Together they test more than any normal-looking list.',
      },
      {
        id: 'data-structures-algorithms-66-q6',
        audience: { min: 'advanced' },
        prompt: 'An assistant writes both a function and its unit tests, and all tests pass. How do you decide whether the tests are worth anything?',
        choices: [
          'Break the function on purpose and see whether any test notices',
          'Count the tests: a larger number of tests means more confidence',
          'Ask the assistant to review the tests that it wrote itself',
          'Check that every test has a comment that explains its purpose',
        ],
        answer: 0,
        explanation: 'A test that cannot fail when the code is wrong is worthless. Deliberately introducing a bug (mutation) shows whether the suite notices, independent of who wrote it.',
      },
    ],
    task: {
      title: 'Break it, then test it',
      minutes: 20,
      steps: [
        'Run the generated insertion sort and the checks. Write down which cases fail and which pass, and say why "all equal" passes.',
        'Fix the bug and run the checks again. Then re-introduce a different bug (for example start the outer loop at 2) and see which cases catch it.',
        'Add three cases of your own to the `cases` object, such as negative numbers or a list of two items.',
        'Write a function `reverseList(list)` yourself and test it with the same style: edge cases and a property (the output reversed again equals the input).',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask an assistant to explain the insertion sort line by line, then act it out on the list [3, 1, 2] on paper before looking at any output of the code.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Write a differential test: generate 500 pseudo-random lists, compare your sort with the built-in sort using a comparator, and report the first input that disagrees.',
        ],
      },
    ],
  },
  {
    id: 'data-structures-algorithms-67',
    day: 67,
    title: 'Analyzing Complexity and Finding Bottlenecks with AI',
    summary: 'Ask an assistant for a complexity analysis, then derive your own by counting, learn which built-in calls hide loops, and find a bottleneck by counting each stage.',
    intro: {
      objectives: [
        "Derive the cost of a function by counting and compare it with an assistant's claim",
        'Name the built-in calls that hide a loop, such as includes, splice and spread',
        'Find the bottleneck of a slow program by counting each stage',
        'Replace a repeated search with a Map or Set and confirm the improvement by count',
      ],
      why: 'Assistants write code that looks efficient and often is not, and they state costs with confidence. Counting is the skill that lets you find the one slow stage and prove that your fix worked.',
    },
    minutes: 30,
    skills: ['ai-algorithms', 'complexity'],
    body: [
      {
        type: 'paragraph',
        text: 'An assistant will happily tell you that a function is "O(n)". Sometimes that is true, and sometimes the function has a hidden loop inside a one-line call and is really O(n²). The fix is not to distrust the assistant but to do what you learned in module 2: count. In this lesson you will ask for a complexity analysis, derive your own and compare, then use counting to find the slow part of a program. This is also the lesson that introduces the module\'s project.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'You ask a clerk how long it will take to match two lists of 400 names, and the clerk says "one quick check per name". It sounds fast. But each check means walking to the back room and reading every line of the other list. The clerk counted the checks and forgot what each one costs.',
      },
      {
        type: 'paragraph',
        text: 'That is what a one-line call such as `includes` can hide. The picture stops at one point: the clerk can be asked to explain, while code cannot. The way to see what it really does is to count steps as it runs.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: '**Ask, then derive.** Before you ask for a complexity, write your own count for a small input, then for twice the input. Then ask the assistant, and compare. A **doubling test** is the quickest check: count the steps for n, 2n and 4n. If the count doubles each time the work is about linear; if it quadruples, it is quadratic (module 2). You get this from a counter variable, never from a clock.',
      },
      {
        type: 'visual',
        id: 'big-o-growth',
        caption: 'Compare the lines for n and n squared as the input doubles. Which one matches the slow version in the code below?',
      },
      {
        type: 'paragraph',
        text: '**Know what the built-ins cost.** A method call is one line but may be a loop. Inside a loop, that loop makes the whole function slower by a factor of n. The table lists the ones to know, in the model this course uses. Engines can optimise some of these, so treat the table as the cost you plan with and a counter as the cost you measure.',
      },
      {
        type: 'table',
        headers: ['Call', 'Cost in our model', 'Why it hides'],
        rows: [
          [
            '`list.includes(x)`, `indexOf`, `find`, `some`',
            'O(n) per call',
            'One call is a loop over the list; inside a loop it makes O(n²)',
          ],
          [
            '`list.slice(a, b)`',
            'O(k) for k items copied',
            'Copies, so slicing in a loop copies again each time',
          ],
          ['`list.splice(i, 1)`', 'O(n)', 'Shifts every later item'],
          [
            '`list.shift()`, `unshift(x)`',
            'O(n)',
            'Moves every item (engines may optimise, so measure)',
          ],
          [
            '`[...list]`, `concat`, `[...acc, x]` in a loop',
            'O(n) per copy',
            'A copy inside `reduce` makes O(n²) in total',
          ],
          [
            '`text += part` in a loop',
            'May be O(n²) in total',
            'Strings are immutable; collecting parts and using `join` is the safe habit',
          ],
          [
            '`list.sort(compare)`',
            'O(n log n)',
            'More than one pass; a sort inside a loop is expensive',
          ],
          [
            '`map.get`, `set.has`, `set.add`',
            'O(1) on average',
            'The reason to replace a repeated search with a Map or Set',
          ],
        ],
        caption: 'Where a loop can hide. Check these first when you count a one-liner.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a quick-looking line can contain a whole search. Whenever a loop contains a call from the top of this table, the real cost is the loop times that call. A Map or Set lets you ask "is it there?" in one step instead of reading the whole list.',
      },
      {
        type: 'paragraph',
        text: '**Find the bottleneck by counting.** A program is a pipeline of stages, and usually one stage does most of the work. Put a counter around each stage, run the program at a few sizes, and look at two things: which stage has the biggest count, and which grows fastest when the input doubles. Guessing is unreliable, because the stage that looks suspicious is often cheap. Then fix the one stage: find the nested scan, ask what the inner search is for, and replace it with a Map or a Set built once before the loop. Count again to confirm, and check that the output is unchanged.',
      },
      {
        type: 'paragraph',
        text: 'Assistants make predictable mistakes in complexity claims. Treat each as something to check, not as a statement about any tool: giving the cost of the visible loop and ignoring a call inside it; calling a cost "O(1)" or "O(n)" without saying whether it is average or worst case; forgetting the extra memory a Map or copy uses; and saying a function that sorts first is "O(n)" or "O(log n)" because the loop after the sort is. Ask which case, what is hidden in each call, and how much memory, then count.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'When reviewing a claimed complexity, ask for the recurrence or the loop structure behind it, not the label, and run a doubling test on your own inputs including adversarial ones (all keys colliding, data already sorted, one huge value). Distinguish time spent in your code from time spent in built-ins, and separate cost per call from cost amortized over a sequence. Space matters in a bottleneck fix: a Set built once removes a quadratic scan for O(n) extra memory, which is the usual trade, but should be stated. For production code, instrument with counters or a profiler, since an operation count ignores cache behaviour and allocation.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Two ways to find who is on both of two lists, written with counters so the work is visible. `countedIncludes` is what `includes` does, with a step counted for each item looked at.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Comparing two solutions by counting',
        code: `const counter = { steps: 0 };

function countedIncludes(list, value) {
  for (const item of list) {
    counter.steps += 1;
    if (item === value) return true;
  }
  return false;
}

function bothSlow(a, b) {
  return a.filter((value) => countedIncludes(b, value));
}

function bothSet(a, b) {
  const inB = new Set(b);
  counter.steps += b.length;
  const result = [];
  for (const value of a) {
    counter.steps += 1;
    if (inB.has(value)) result.push(value);
  }
  return result;
}

function ids(count, start) {
  const list = [];
  for (let i = 0; i < count; i++) list.push(start + i);
  return list;
}

for (const n of [50, 100, 200]) {
  const a = ids(n, 0);
  const b = ids(n, n / 2);
  counter.steps = 0;
  const slow = bothSlow(a, b);
  const slowSteps = counter.steps;
  counter.steps = 0;
  const fast = bothSet(a, b);
  console.log(\`n=\${n} slow=\${slowSteps} set=\${counter.steps} same=\${JSON.stringify(slow) === JSON.stringify(fast)}\`);
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`bothSlow` keeps each value of `a` that `countedIncludes(b, value)` finds in `b`. Each call walks `b` from the start until it meets the value, adding a step for every item. `bothSet` builds a Set of `b` once (counting `b.length` steps) and then asks the Set one question per value of `a`.',
          'For n = 50 the slow version takes 1,575 steps and the Set version 100. For n = 100 they take 6,275 and 200, and for n = 200 they take 25,050 and 400. Doubling n multiplies the slow count by about 4 (quadratic) and the Set count by 2 (linear). The sizes are small on purpose, so that the in-app code runner finishes; the pattern is the same at any size.',
          '`same=true` on every line shows the two return exactly the same values in the same order. An improvement that changes the answer is not an improvement.',
          'The Set version costs extra memory: a Set holding every value of `b`. That is the trade, and it is almost always worth it. A third way, sorting both lists and walking them together, costs about n log n and no Set, but changes the order unless you track positions.',
        ],
      },
      { type: 'heading', text: 'Your project starts here' },
      {
        type: 'paragraph',
        text: "Project 12 asks you to optimize a slow program with an assistant's help. This is the program: a small support-desk report. It makes customers and tickets, formats each ticket with its customer, lists the categories seen and counts tickets per customer, and counts steps in each stage. Copy it, run it, and read the numbers before you change anything.",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The slow ticket report (the project starting point)',
        code: `let steps = 0;

function makeCustomers(count) {
  const cities = ['Naga', 'Legazpi', 'Iriga'];
  const customers = [];
  for (let id = 1; id <= count; id++) customers.push({ id, name: \`Customer \${id}\`, city: cities[id % 3] });
  return customers;
}

function makeTickets(count, customerCount) {
  const categories = ['billing', 'delivery', 'refund', 'account'];
  const tickets = [];
  for (let id = 1; id <= count; id++) {
    tickets.push({ id, customerId: ((id * 7) % customerCount) + 1, category: categories[id % 4] });
  }
  return tickets;
}

function findCustomer(customers, id) {
  for (const customer of customers) {
    steps += 1;
    if (customer.id === id) return customer;
  }
  return null;
}

function ticketLines(tickets, customers) {
  return tickets.map((ticket) => \`\${ticket.id}: \${findCustomer(customers, ticket.customerId).name} (\${ticket.category})\`);
}

function slowIncludes(list, value) {
  for (const item of list) {
    steps += 1;
    if (item === value) return true;
  }
  return false;
}

function categoriesSeen(tickets) {
  const seen = [];
  for (const ticket of tickets) {
    if (!slowIncludes(seen, ticket.category)) seen.push(ticket.category);
  }
  return seen;
}

function ticketsPerCustomer(tickets, customers) {
  const totals = [];
  for (const customer of customers) {
    let total = 0;
    for (const ticket of tickets) {
      steps += 1;
      if (ticket.customerId === customer.id) total += 1;
    }
    totals.push({ id: customer.id, total });
  }
  return totals;
}

function stage(name, work, stages) {
  steps = 0;
  const result = work();
  stages[name] = steps;
  return result;
}

function report(customerCount) {
  const customers = makeCustomers(customerCount);
  const tickets = makeTickets(customerCount * 2, customerCount);
  const stages = {};
  const lines = stage('ticketLines', () => ticketLines(tickets, customers), stages);
  const categories = stage('categoriesSeen', () => categoriesSeen(tickets), stages);
  const totals = stage('ticketsPerCustomer', () => ticketsPerCustomer(tickets, customers), stages);
  const busiest = [...totals].sort((a, b) => b.total - a.total || a.id - b.id).slice(0, 3);
  return { stages, firstLine: lines[0], categories, busiest };
}

console.log(report(25));
console.log(report(50).stages);
console.log(report(100).stages);`,
      },
      {
        type: 'paragraph',
        text: 'Do not fix it yet. The project steps tell you what to do first: state your own hypothesis about the bottleneck, count, then ask an assistant to challenge your hypothesis. For the worked example above, the stage that does the most work was obvious from the numbers. In this program, look at both the size of each count and how it grows when you double the customers.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Pick a function of your own, such as the `bothSlow` function above, and write your own cost first: for 4 items and for 8 items, how many steps? Then ask:',
      },
      {
        type: 'prompt',
        label: 'Challenge my analysis',
        text: 'Here is a JavaScript function and my own analysis. The function is: [paste]. My analysis: for 4 items it does about ____ steps and for 8 about ____, so I think its cost is ____ in the worst case. Do not give me a final complexity. List every call inside a loop whose cost I might have ignored, and for each one tell me its cost and whether it is average or worst case. Then give me one input size pair to run a doubling test.',
      },
      {
        type: 'paragraph',
        text: 'Run the doubling test with a counter and compare with what you and the assistant said. If the assistant names a call you ignored, add a counter for it. If it states a cost without saying which case, ask which case it means. Never accept a complexity you could not reproduce with a counter.',
      },
      {
        type: 'takeaways',
        items: [
          "Derive the cost yourself by counting for n and 2n, then compare with an assistant's claim; a doubling test separates linear from quadratic.",
          'One-line calls can hide loops: includes, indexOf, find, slice, splice, shift and a spread or concat inside a loop.',
          'Assistants commonly ignore a call inside a loop, skip average versus worst case, forget memory and forget the cost of a sort.',
          'Find a bottleneck by putting a counter around each stage and looking at the biggest count and the fastest growth.',
          'Replace a repeated search with a Map or Set built once, then count again and check the output is unchanged.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-67-predict-output-1',
          kind: 'predict-output',
          title: 'Count the hidden steps',
          prompt: 'The code finds the values common to two lists using a counted `includes`. What does it print?',
          concept: 'counting a hidden loop',
          language: 'javascript',
          code: `let steps = 0;

function includesCounted(list, value) {
  for (const item of list) {
    steps += 1;
    if (item === value) return true;
  }
  return false;
}

const a = [1, 2, 3, 4];
const b = [3, 4, 5, 6];
const both = a.filter((value) => includesCounted(b, value));
console.log(both);
console.log(steps);`,
          expected: `[ 3, 4 ]
11`,
          choices: [
            `[ 3, 4 ]
4`,
            `[ 3, 4 ]
11`,
            `[ 3, 4 ]
16`,
            `[ 3, 4 ]
8`,
          ],
          wrongNotes: {
            '[ 3, 4 ]\n4': 'That counts only the four values of `a`. Each value starts its own walk through `b`.',
            '[ 3, 4 ]\n16': 'That is 4 × 4, which is the worst case. A search stops as soon as it finds the value.',
            '[ 3, 4 ]\n8': 'Values 1 and 2 are not in `b`, so each walks all 4 items. That alone is 8, and 3 and 4 add more.',
          },
          hints: [
            'Value 1 is not in b, so it looks at all 4 items.',
            'Value 3 is the first item of b: 1 step. Value 4 is the second: 2 steps.',
            'Add 4 + 4 + 1 + 2.',
          ],
          explanation: 'The values 1 and 2 each walk all 4 items of b (8 steps). The value 3 is found at once (1) and 4 after one more (2), for 11 steps in total.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-67-match-1',
          kind: 'match',
          title: 'What does the one-liner really cost?',
          prompt: 'Each line below runs inside a loop over n items. Match it to the total cost of the loop.',
          concept: 'compare complexity',
          labels: { terms: 'Inside the loop', meanings: 'Cost of the whole loop' },
          pairs: [
            {
              term: 'if (!seen.includes(item)) seen.push(item), with `seen` growing to n items',
              definition: 'O(n²): includes walks `seen` each time',
              note: 'The `includes` call is a loop, and it runs n times.',
            },
            {
              term: 'if (seenSet.has(item)) skip it, otherwise seenSet.add(item)',
              definition: 'O(n) on average: one hash operation each',
              note: 'Set operations take constant time on average.',
            },
            {
              term: 'result = [...result, item], starting from an empty array',
              definition: 'O(n²): each spread copies everything so far',
              note: 'The copy grows by one item each turn, so the total is about n²/2 copies.',
            },
            {
              term: 'result.push(item), starting from an empty array',
              definition: 'O(n) amortized: one append each',
              note: 'Appending is amortized constant time (module 3).',
            },
          ],
          hints: [
            'Ask what is hidden in each call: a walk, a copy or a single step?',
            'A walk or a copy that grows with n, inside a loop of n turns, gives n times n.',
            'A hash operation or an append is one step on average.',
          ],
          explanation: 'A loop multiplies the cost of what it contains. A walk or a copy of a growing list inside the loop makes the total quadratic; a hash operation or an append keeps it linear.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-67-fill-blank-1',
          kind: 'fill-blank',
          title: 'Count the pairs',
          prompt: 'Complete the nested loop so it counts every pair `(i, j)` with `i < j` exactly once, then predict how the count grows.',
          concept: 'counting nested loops',
          language: 'javascript',
          code: `function countPairs(n) {
  let steps = 0;
  for (let i = 0; i < n; i++) {
    for (let j = ___; j < ___; j++) {
      steps += 1;
    }
  }
  return steps;
}

console.log(countPairs(10));
console.log(countPairs(20));`,
          blanks: [
            { answers: ['i + 1'], feedback: 'To count each pair once, j starts just after i.' },
            { answers: ['n'], feedback: 'j runs to the end of the list.' },
          ],
          bank: ['i + 1', 'i', 'n', 'n - 1', '0'],
          tests: { kind: 'output', expected: ['45', '190'] },
          hints: [
            'Starting j at 0 counts every pair twice, and (i, i) as well. Where should j start so it only looks right of i?',
            'j must stay below n, so the last item is included.',
            'For n = 10 the count is 9 + 8 + ... + 1 = 45.',
          ],
          explanation: 'With j starting at i + 1 the count is n(n - 1) / 2: 45 for n = 10 and 190 for n = 20. Doubling n multiplied the count by about 4, the signature of quadratic growth.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-67-scenario-1',
          kind: 'scenario',
          title: 'The assistant says it is linear',
          prompt: 'Choose the best response.',
          concept: 'verifying a complexity claim',
          situation: 'An assistant gives you `names.filter((name) => blocked.includes(name))` and says "this is O(n), one pass". `names` has 5,000 items and `blocked` has 5,000. Your page lags when it runs.',
          options: [
            {
              text: 'Count steps with a counted includes for n = 100, 200 and 400. If the count about quadruples, ask what the inner call costs and replace `blocked` with a Set built once.',
              consequence: 'You reproduce the quadratic growth yourself, find the hidden loop and fix it, then count again to confirm.',
              quality: 'best',
            },
            {
              text: 'Ask the assistant again, in different words, whether it is really O(n).',
              consequence: 'You may get another confident answer, but you will not have evidence of your own.',
              quality: 'acceptable',
            },
            {
              text: 'Accept it: one filter is one pass, so the lag must be somewhere else.',
              consequence: 'The inner includes walks `blocked` for each name, so this is the cause. You look for the bug in the wrong place.',
              quality: 'poor',
            },
            {
              text: 'Replace filter with a for loop, since loops are faster than methods.',
              consequence: 'The same walk is still inside the loop. The cost does not change; only the syntax does.',
              quality: 'poor',
            },
          ],
          hints: [
            'What does `includes` do when it is called, and how many times is it called?',
            "A doubling test shows quadratic growth without anyone's opinion.",
            'A Set answers "is it there?" in one step on average.',
          ],
          explanation: 'Counting gives you evidence you can reproduce. The hidden `includes` makes the function quadratic; a Set built once makes the check one step on average.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-67-code-challenge-1',
          kind: 'code-challenge',
          title: 'Speed up the matching',
          prompt: "This `commonCount(a, b)` returns how many values appear in both lists (neither list has repeats), but it is too slow for long lists: the last tests use lists of 600 values. Rewrite it so it finishes within the runner's step budget and returns the same counts.",
          concept: 'optimize an inefficient solution',
          language: 'javascript',
          starter: `function commonCount(a, b) {
  // count the values that appear in both lists (each list has no repeats)
  let count = 0;
  for (const x of a) {
    for (const y of b) {
      if (x === y) {
        count += 1;
        break;
      }
    }
  }
  return count;
}`,
          solution: `function commonCount(a, b) {
  const inB = new Set(b);
  let count = 0;
  for (const x of a) {
    if (inB.has(x)) count += 1;
  }
  return count;
}`,
          tests: {
            kind: 'function',
            fn: 'commonCount',
            cases: [
              { label: 'two common values', args: [[1, 2, 3, 4], [3, 4, 5, 6]], expected: 2 },
              { label: 'nothing in common', args: [[1, 2], [3, 4]], expected: 0 },
              { label: 'an empty list', args: [[], [1, 2]], expected: 0 },
              { label: 'everything in common', args: [[7, 8, 9], [9, 8, 7]], expected: 3 },
              {
                label: 'long lists',
                args: [
                  [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
                    27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
                    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
                    77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
                    101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
                    121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140,
                    141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160,
                    161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
                    181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200,
                    201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220,
                    221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240,
                    241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260,
                    261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280,
                    281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300,
                    301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320,
                    321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340,
                    341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360,
                    361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380,
                    381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400,
                    401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420,
                    421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440,
                    441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460,
                    461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480,
                    481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500,
                    501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520,
                    521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540,
                    541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560,
                    561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580,
                    581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599,
                  ],
                  [
                    500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519,
                    520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539,
                    540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559,
                    560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579,
                    580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599,
                    600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619,
                    620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639,
                    640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659,
                    660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679,
                    680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699,
                    700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719,
                    720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738, 739,
                    740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759,
                    760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779,
                    780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799,
                    800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819,
                    820, 821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839,
                    840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859,
                    860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879,
                    880, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899,
                    900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914, 915, 916, 917, 918, 919,
                    920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939,
                    940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959,
                    960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979,
                    980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999,
                    1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015,
                    1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031,
                    1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047,
                    1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063,
                    1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079,
                    1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095,
                    1096, 1097, 1098, 1099,
                  ],
                ],
                expected: 100,
                hidden: true,
              },
              {
                label: 'long lists, nothing shared',
                args: [
                  [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
                    27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
                    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
                    77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
                    101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
                    121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140,
                    141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160,
                    161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
                    181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200,
                    201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220,
                    221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240,
                    241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260,
                    261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280,
                    281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300,
                    301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320,
                    321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340,
                    341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360,
                    361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380,
                    381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400,
                    401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420,
                    421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440,
                    441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460,
                    461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480,
                    481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500,
                    501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520,
                    521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540,
                    541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560,
                    561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580,
                    581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599,
                  ],
                  [
                    1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015,
                    1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031,
                    1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047,
                    1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063,
                    1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079,
                    1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095,
                    1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111,
                    1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1127,
                    1128, 1129, 1130, 1131, 1132, 1133, 1134, 1135, 1136, 1137, 1138, 1139, 1140, 1141, 1142, 1143,
                    1144, 1145, 1146, 1147, 1148, 1149, 1150, 1151, 1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159,
                    1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1170, 1171, 1172, 1173, 1174, 1175,
                    1176, 1177, 1178, 1179, 1180, 1181, 1182, 1183, 1184, 1185, 1186, 1187, 1188, 1189, 1190, 1191,
                    1192, 1193, 1194, 1195, 1196, 1197, 1198, 1199, 1200, 1201, 1202, 1203, 1204, 1205, 1206, 1207,
                    1208, 1209, 1210, 1211, 1212, 1213, 1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223,
                    1224, 1225, 1226, 1227, 1228, 1229, 1230, 1231, 1232, 1233, 1234, 1235, 1236, 1237, 1238, 1239,
                    1240, 1241, 1242, 1243, 1244, 1245, 1246, 1247, 1248, 1249, 1250, 1251, 1252, 1253, 1254, 1255,
                    1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271,
                    1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280, 1281, 1282, 1283, 1284, 1285, 1286, 1287,
                    1288, 1289, 1290, 1291, 1292, 1293, 1294, 1295, 1296, 1297, 1298, 1299, 1300, 1301, 1302, 1303,
                    1304, 1305, 1306, 1307, 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1319,
                    1320, 1321, 1322, 1323, 1324, 1325, 1326, 1327, 1328, 1329, 1330, 1331, 1332, 1333, 1334, 1335,
                    1336, 1337, 1338, 1339, 1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350, 1351,
                    1352, 1353, 1354, 1355, 1356, 1357, 1358, 1359, 1360, 1361, 1362, 1363, 1364, 1365, 1366, 1367,
                    1368, 1369, 1370, 1371, 1372, 1373, 1374, 1375, 1376, 1377, 1378, 1379, 1380, 1381, 1382, 1383,
                    1384, 1385, 1386, 1387, 1388, 1389, 1390, 1391, 1392, 1393, 1394, 1395, 1396, 1397, 1398, 1399,
                    1400, 1401, 1402, 1403, 1404, 1405, 1406, 1407, 1408, 1409, 1410, 1411, 1412, 1413, 1414, 1415,
                    1416, 1417, 1418, 1419, 1420, 1421, 1422, 1423, 1424, 1425, 1426, 1427, 1428, 1429, 1430, 1431,
                    1432, 1433, 1434, 1435, 1436, 1437, 1438, 1439, 1440, 1441, 1442, 1443, 1444, 1445, 1446, 1447,
                    1448, 1449, 1450, 1451, 1452, 1453, 1454, 1455, 1456, 1457, 1458, 1459, 1460, 1461, 1462, 1463,
                    1464, 1465, 1466, 1467, 1468, 1469, 1470, 1471, 1472, 1473, 1474, 1475, 1476, 1477, 1478, 1479,
                    1480, 1481, 1482, 1483, 1484, 1485, 1486, 1487, 1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495,
                    1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511,
                    1512, 1513, 1514, 1515, 1516, 1517, 1518, 1519, 1520, 1521, 1522, 1523, 1524, 1525, 1526, 1527,
                    1528, 1529, 1530, 1531, 1532, 1533, 1534, 1535, 1536, 1537, 1538, 1539, 1540, 1541, 1542, 1543,
                    1544, 1545, 1546, 1547, 1548, 1549, 1550, 1551, 1552, 1553, 1554, 1555, 1556, 1557, 1558, 1559,
                    1560, 1561, 1562, 1563, 1564, 1565, 1566, 1567, 1568, 1569, 1570, 1571, 1572, 1573, 1574, 1575,
                    1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591,
                    1592, 1593, 1594, 1595, 1596, 1597, 1598, 1599,
                  ],
                ],
                expected: 0,
                hidden: true,
              },
            ],
          },
          hints: [
            'The inner loop walks `b` for every value of `a`. What could answer "is x in b?" in one step?',
            'Build a `Set` from `b` once, before the loop.',
            'Then loop over `a` once, and add 1 when `inB.has(x)`.',
          ],
          explanation: 'The nested loop does up to 600 × 600 steps. A Set built once answers each membership question in one step on average, so the work is about 600 + 600.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-67-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Complexity claims to check',
          prompt: 'Tap each typical claim to see what to check before you accept it.',
          concept: 'analyzing complexity with AI',
          cards: [
            {
              front: '"There is one loop, so it is O(n)."',
              back: 'Look inside the loop. A call to includes, indexOf, splice, slice or a spread makes it a loop times that call.',
            },
            {
              front: '"Lookups are O(1)."',
              back: 'Ask which case. A hash lookup is O(1) on average, and the worst case can be O(n). Say which one you are planning with.',
            },
            {
              front: '"It is O(n) after sorting."',
              back: 'The sort itself costs O(n log n), which is bigger. The total is the larger cost, not the cost of the last loop.',
            },
            {
              front: '"No extra space is needed."',
              back: 'A Set, a Map or a copied array holds extra items. State the memory you spent to save time.',
            },
          ],
          hints: [],
          explanation: 'Each claim leaves out a case, a hidden call or a cost. Counting a small input and a doubled one exposes all of them.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-67-q1',
        prompt: 'You double n and the step count of a function goes up by about four times. What does that suggest?',
        choices: ['Linear growth', 'Constant cost', 'Quadratic growth', 'Logarithmic growth'],
        answer: 2,
        explanation: 'If doubling the input quadruples the work, the work grows with n squared. A linear function would double.',
      },
      {
        id: 'data-structures-algorithms-67-q2',
        prompt: 'A function loops over n users and calls `blockedList.includes(user.id)` each time. Its cost is closest to:',
        choices: [
          'O(n), because the loop runs only once over the users',
          'O(n log n), because includes is a kind of search',
          'O(1), because includes only returns true or false',
          'O(n × m): the loop times the length of blockedList',
        ],
        answer: 3,
        explanation: 'Each `includes` can walk the whole list, so the total is the number of users times the length of the list. A Set for blockedList would make each check one step on average.',
      },
      {
        id: 'data-structures-algorithms-67-q3',
        prompt: 'A program has three stages. Counting at n = 100 and n = 200 gives: stage A 400 then 800, stage B 5,000 then 20,000, stage C 900 then 1,800. Which stage is the bottleneck, and why?',
        choices: [
          'Stage A, because it is the first stage of the program that runs',
          'Stage B: biggest count, and it quadruples when n doubles',
          'Stage C, because its count is the second largest of the three',
          'None of them, since all three of the counts grow with n',
        ],
        answer: 1,
        explanation: 'B has the biggest count and the fastest growth. A and C double, so they stay manageable; B will dominate as n grows.',
      },
      {
        id: 'data-structures-algorithms-67-q4',
        prompt: 'After replacing a repeated search with a Set, your step count dropped sharply. What must you still check?',
        choices: [
          'That the output is unchanged, order included, and the memory is acceptable',
          'That the new code looks a good deal shorter than the old code did, line for line',
          'That the Set was created with the new keyword and not called',
          'Nothing, since fewer steps always means that the program is correct',
        ],
        answer: 0,
        explanation: 'An optimization that changes the answer or the order is a bug. You also state the cost of the improvement, here the memory for the Set.',
      },
      {
        id: 'data-structures-algorithms-67-q5',
        audience: { max: 'beginner' },
        prompt: 'Why is it risky to trust the line `names.filter((n) => other.includes(n))` as "fast, one line"?',
        choices: [
          'One line of code is always fast, whatever the line contains',
          'The filter method cannot be used on a list of names',
          'The includes call searches through the list again for every name',
          'The result of the line is always an empty list of names',
        ],
        answer: 2,
        explanation: 'The words "includes" and "filter" each hide a loop. A loop inside a loop is much more work than a single pass.',
      },
      {
        id: 'data-structures-algorithms-67-q6',
        audience: { min: 'advanced' },
        prompt: 'An assistant says a hash-based de-duplication is "O(n) time, O(1) space". What is wrong with the space claim?',
        choices: [
          'Hash sets use no memory, so the claim is correct as it stands',
          'The Set holds up to n distinct values, so extra space is O(n)',
          'It is correct, since JavaScript manages memory automatically anyway',
          'Time and space are always equal for the same algorithm',
        ],
        answer: 1,
        explanation: 'The Set stores up to n distinct values, so extra space is O(n). Trading space for time is the usual bargain, but it must be stated.',
      },
    ],
    task: {
      title: 'Count your way to the bottleneck',
      minutes: 20,
      steps: [
        'Run the comparison code and write the counts for n = 50, 100 and 200 in a small table. Check the "doubling gives four times" claim for the slow version.',
        'Add a third solution that sorts both lists and walks them with two pointers, and count its steps. Does it return the values in the same order?',
        'Copy the project starter and run it. For each of the three stages, write down its count at 25, 50 and 100 customers and the ratio between neighbouring sizes.',
        'Write one sentence guessing which stage is the bottleneck and why, before you read any hint. Keep it: it is the first step of your project.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Make two lists of 10 names on paper and find the names on both by checking each name against the whole other list. Count the checks you make, then do it again by crossing names off a sorted copy, and compare.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Replace the step counters of the project starter with a generic wrapper that counts calls to each helper, and report the call counts per stage at three sizes, including an adversarial input where every ticket belongs to one customer.',
        ],
      },
    ],
  },
  {
    id: 'data-structures-algorithms-68',
    day: 68,
    title: 'Catching Wrong AI Explanations and Reviewing AI Optimizations',
    summary: 'Turn confident claims into small tests you can run, catch the typical wrong explanations, and review an AI-suggested optimization for behaviour, speed, readability and order.',
    intro: {
      objectives: [
        'Turn a claim about an algorithm into a test that can prove it wrong',
        'Recognise typical confident mistakes about complexity, invariants, stability and search',
        'Review an optimization for behaviour, speed by count, readability and output order',
        'Compare an old and a new implementation on many inputs',
      ],
      why: 'The most useful thing you can do with an assistant\'s answer is try to break it. A learner who can catch a wrong explanation, or a "faster" function that quietly changes behaviour, is the person a team wants reviewing AI-written code.',
    },
    minutes: 30,
    skills: ['ai-algorithms'],
    body: [
      {
        type: 'paragraph',
        text: 'An assistant writes explanations in a steady, confident voice. When it is right and when it is wrong, the voice is the same. You cannot tell by tone, so you need a different habit: whenever an answer states something about what code does, turn it into a check you can run. In this lesson you will practise on the five mistakes that appear most often in explanations of algorithms, and then learn how to review a suggested optimization before it goes into your code.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A proofreader does not read for pleasure. They have a checklist, and for each sentence that states a fact, they ask "where is the receipt?". An auditor does the same with a ledger: a total that looks tidy is still added up again.',
      },
      {
        type: 'paragraph',
        text: 'Reviewing an "improvement" is like inspecting a renovation. The contractor says the new layout is better, and you walk through it: do the doors still open, is it really more spacious, and did anyone move the kitchen? The comparison fails on one point: a house shows a moved kitchen at a glance, while a changed output order in code shows only if you look for it.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: '**Claims become tests.** A claim about an algorithm says what happens for some input. Find an input where the claim would be false if it were wrong (a counter-example), run it, and look. This takes a few lines and is usually quicker than arguing. Here are five claims to check whenever you see them.',
      },
      {
        type: 'table',
        headers: ['A typical claim to check', 'What to test', 'What you find'],
        rows: [
          [
            '"A hash map lookup is always O(1)."',
            'Put many keys that share one slot and count probes',
            'It is O(1) on average; if every key collides, a lookup walks all of them (O(n))',
          ],
          [
            '"Binary search works on any list."',
            'Search for a value that is present in an unsorted list',
            'It can return -1 for a value that is there; it needs sorted data',
          ],
          [
            '"Selection sort is stable."',
            'Sort records with equal keys and watch their order',
            'Swapping can jump an item past an equal one, so it is not stable',
          ],
          [
            '"The loop runs while low < high."',
            'Search a one-item list and an item at the far end',
            'The invariant needs low <= high, or the last candidate is never examined',
          ],
          [
            '"This is O(n) because there is one loop."',
            'Count steps for n and 2n with a counter',
            'A call inside the loop may make it quadratic',
          ],
        ],
        caption: 'Five confident claims, each with a small test that can prove it wrong. The claims are things to check, not statements about any particular tool.',
      },
      {
        type: 'paragraph',
        text: '**Review an optimization with four questions.** Same behaviour: does it give the same output on empty input, one item, duplicates and every case that matters, including the order of the results? Faster by count: count steps before and after on the same inputs, and confirm the growth changed, not just the constant. Still readable: would you want to maintain it? Hidden costs: does it use more memory, mutate its input or depend on something fragile? The first question is the one assistants fail most quietly, because an "optimized" version that reorders its output looks identical on a short example.',
      },
      {
        type: 'paragraph',
        text: 'The tool for the first question is a small **comparison harness**: run the old and the new function on a list of inputs and report every input where the results differ. It is the same idea as the property checks of lesson 66, with the old function playing the trusted answer.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: when someone tells you a shortcut is just as good, you walk both routes. You check that you arrive at the same place, you time both, and you check the shortcut is not through someone's garden. Here, the harness walks both functions on the same inputs and tells you where they end up differently.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'In practice, treat suggested optimizations like any change: require a failing benchmark or counter that motivates it, a differential test against the previous implementation over generated and adversarial inputs, and a written invariant. Check the claimed complexity against the real data shape (a hash structure with a poor key distribution, a sort of nearly sorted data), watch for changed iteration order, stability and error behaviour on empty input, and for changes in memory and allocation. Prefer the smallest change that fixes the measured bottleneck: a Set in front of a scan beats a rewrite. Keep the old implementation in the test suite as the oracle while the new one is young.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Claim: binary search works on any list. Test it with a value that is definitely present.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Binary search on unsorted data',
        code: `function binarySearch(list, target) {
  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (list[mid] === target) return mid;
    if (list[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

const unsorted = [5, 1, 9, 3, 7];
console.log(binarySearch(unsorted, 3));
console.log(unsorted.includes(3));
console.log(binarySearch([1, 3, 5, 7, 9], 3));`,
      },
      {
        type: 'paragraph',
        text: 'Claim: selection sort is stable. Test it with two records that have the same level.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Is selection sort stable?',
        code: `function selectionSortBy(items, key) {
  const list = [...items];
  for (let i = 0; i < list.length - 1; i++) {
    let smallest = i;
    for (let j = i + 1; j < list.length; j++) {
      if (list[j][key] < list[smallest][key]) smallest = j;
    }
    [list[i], list[smallest]] = [list[smallest], list[i]];
  }
  return list;
}

const tickets = [{ id: 'A', level: 2 }, { id: 'B', level: 2 }, { id: 'C', level: 1 }];
console.log(selectionSortBy(tickets, 'level').map((ticket) => ticket.id).join(''));
console.log([...tickets].sort((x, y) => x.level - y.level).map((ticket) => ticket.id).join(''));`,
      },
      {
        type: 'paragraph',
        text: 'Claim: hash lookups are always O(1). Test it with a table that sends every key to the same slot, counting probes.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Counting hash probes',
        code: `const LETTERS = 'abcdefghijklmnopqrstuvwxyz0123456789-';

function spreadHash(key) {
  let hash = 7;
  for (const ch of key) hash = (hash * 31 + LETTERS.indexOf(ch) + 1) % 100003;
  return hash;
}

const sameSlotHash = () => 0;

function makeTable(hash) {
  return { hash, buckets: Array.from({ length: 64 }, () => []) };
}

function put(table, key) {
  table.buckets[table.hash(key) % 64].push(key);
}

function probes(table, key) {
  let steps = 0;
  for (const item of table.buckets[table.hash(key) % 64]) {
    steps += 1;
    if (item === key) break;
  }
  return steps;
}

const good = makeTable(spreadHash);
const bad = makeTable(sameSlotHash);
for (let i = 0; i < 200; i++) {
  put(good, \`id-\${i}\`);
  put(bad, \`id-\${i}\`);
}
console.log(probes(good, 'id-199') < 20);
console.log(probes(bad, 'id-199'));`,
      },
      {
        type: 'paragraph',
        text: 'Now a review. An assistant offered two "faster" ways to remove duplicates. The harness runs the old and each new version on the same inputs.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Reviewing two optimizations',
        code: `function uniqueOld(list) {
  return list.filter((value, index) => list.indexOf(value) === index);
}

function uniqueSet(list) {
  return [...new Set(list)];
}

function uniqueSorted(list) {
  const sorted = [...list].sort((a, b) => a - b);
  return sorted.filter((value, index) => index === 0 || value !== sorted[index - 1]);
}

function sameBehaviour(oldFn, newFn, inputs) {
  const mismatches = [];
  for (const input of inputs) {
    const before = JSON.stringify(oldFn(input));
    const after = JSON.stringify(newFn(input));
    if (before !== after) mismatches.push({ input, before, after });
  }
  return mismatches;
}

const inputs = [[], [5], [3, 1, 3, 2], [2, 2, 2], [1, 2, 3], [9, 8, 7, 8]];
console.log(sameBehaviour(uniqueOld, uniqueSet, inputs).length);
console.log(sameBehaviour(uniqueOld, uniqueSorted, inputs).map((m) => m.before + ' vs ' + m.after));`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          'The unsorted search prints `-1` even though `includes` finds the 3. Binary search decides which half to keep by comparing with the middle value, and on unsorted data that decision is meaningless. The same call on the sorted list prints `1`.',
          '`selectionSortBy` swaps the smallest item with the one at position `i`. With the three tickets, A and B (level 2) start in that order; when C (level 1) is swapped to the front, A jumps to the end, behind B. The result is `CBA`. The built-in `sort`, which the language requires to be stable, gives `CAB`.',
          'In the hash demo, `sameSlotHash` always returns 0, so all 200 keys share one bucket and finding the last key takes 200 steps. The table with a spread-out hash finds it in under 20 (the check prints `true`). Average O(1) depends on a good hash and a low load factor, the conditions from module 8.',
          'In the review, `uniqueSet` agrees with `uniqueOld` on every input (0 mismatches) and is faster: a Set remembers the order in which values were added. `uniqueSorted` is also fast, but it reports two mismatches: for `[3, 1, 3, 2]` the old version gives `[3,1,2]` and the sorted one `[1,2,3]`. It removed duplicates and silently changed the order.',
          'An optimization that is faster by count but changes the order passes a careless review: both outputs contain the same values. Only a comparison that looks at the order catches it. Whether the new order is acceptable is a requirement question, not a performance question, so ask whoever owns the requirement.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not accept "it is faster" without a count, and do not accept "it gives the same result" without a harness. Both are claims, and claims are what this lesson is about.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'A good way to practise spotting errors is to ask an assistant to plant one for you. State your own answer afterwards, not before: this is an exercise in checking.',
      },
      {
        type: 'prompt',
        label: 'Plant a mistake',
        text: 'Write a short explanation (about 120 words) of how a hash table lookup works and what it costs. Include exactly one mistake that sounds plausible. Do not tell me where it is or what kind it is. After my answer I will tell you which sentence I think is wrong and what test I would run, and you will tell me whether I found the planted mistake.',
      },
      {
        type: 'paragraph',
        text: 'Read the explanation, mark the sentence you suspect, and write down the test you would run (for example, count probes with one slot for every key). Run it. Be careful: the assistant may plant more than one mistake, or none, or describe a correct sentence as wrong. Whatever it says, your test decides.',
      },
      {
        type: 'prompt',
        label: 'Review an optimization',
        text: 'Here is my function and a faster version you gave me: [paste both]. I will paste three inputs. Do not tell me whether the new version is equivalent. For each input, ask me to write down what each version returns before you say anything, and then tell me only whether my predictions match what the code does.',
      },
      {
        type: 'takeaways',
        items: [
          'Turn every claim about what code does into a test: find an input that would show it to be false.',
          'Typical wrong claims: hash lookups are always O(1), binary search works on any list, selection sort is stable, a loop bound that skips the last candidate, and "one loop means O(n)".',
          'Review an optimization with four questions: same behaviour (including order), faster by count, still readable, no new hidden cost.',
          'A comparison harness runs old and new on many inputs and reports every difference.',
          'Faster and different is a bug; decide with the requirement whether a changed order is acceptable.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-68-predict-output-1',
          kind: 'predict-output',
          title: 'Is the selection sort stable?',
          prompt: 'Records A and C both have level 2, and B and D both have level 1. The code sorts by level in two ways. What does it print?',
          concept: 'stable vs unstable',
          language: 'javascript',
          code: `const records = [
  { id: 'A', level: 2 },
  { id: 'B', level: 1 },
  { id: 'C', level: 2 },
  { id: 'D', level: 1 },
];
const list = [...records];
for (let i = 0; i < list.length - 1; i++) {
  let smallest = i;
  for (let j = i + 1; j < list.length; j++) {
    if (list[j].level < list[smallest].level) smallest = j;
  }
  [list[i], list[smallest]] = [list[smallest], list[i]];
}
console.log(list.map((record) => record.id).join(''));
console.log([...records].sort((x, y) => x.level - y.level).map((record) => record.id).join(''));`,
          expected: `BDCA
BDAC`,
          choices: [
            `BDCA
BDAC`,
            `BDAC
BDAC`,
            `BDCA
BDCA`,
            `BDAC
BDCA`,
          ],
          wrongNotes: {
            'BDAC\nBDAC': 'The built-in sort is stable and gives BDAC. The selection sort swaps items over long distances, and the swap moves A behind C.',
            'BDCA\nBDCA': 'The second line uses the built-in sort, which is stable: equal levels keep their input order, so A stays before C.',
            'BDAC\nBDCA': 'The two lines are the other way round: the first is the selection sort and the second is the stable built-in sort.',
          },
          hints: [
            'Trace the selection sort: first swap the smallest (B) to the front, which sends A to position 1.',
            'The second pass finds D (level 1) and swaps it with the item at position 1, which is A.',
            'A lands at the end, behind C.',
          ],
          explanation: 'The swaps move A to the end, behind C, so the selection sort prints BDCA. The built-in sort keeps equal levels in input order, so it prints BDAC.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-68-fix-bug-1',
          kind: 'fix-bug',
          title: 'The invariant that skipped the last candidate',
          prompt: 'An assistant explained the loop as "keep going while `low < high`". The search should print 4 and then 0, but it prints -1 twice. Tap the buggy line and pick the fix.',
          concept: 'binary search invariant',
          language: 'javascript',
          code: `function binarySearch(list, target) {
  let low = 0;
  let high = list.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (list[mid] === target) return mid;
    if (list[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

console.log(binarySearch([1, 3, 5, 7, 9], 9));
console.log(binarySearch([4], 4));`,
          bugLine: 4,
          fixes: [
            {
              line: '  while (low <= high) {',
              correct: true,
              why: 'When low and high are equal there is one candidate left, and it must still be examined.',
            },
            {
              line: '  while (low < high - 1) {',
              correct: false,
              why: 'This stops even earlier and misses more candidates.',
            },
            {
              line: '  while (low !== high) {',
              correct: false,
              why: 'It stops in the same place as low < high, when one candidate is left, and can also skip it.',
            },
          ],
          tests: { kind: 'output', expected: ['4', '0'] },
          lineNote: 'The comparisons inside the loop are right. Which line decides when the search stops?',
          hints: [
            'Try the one-item list [4] by hand: what are low and high?',
            'When low equals high there is still one position that could hold the target.',
            'The loop must run while the window is non-empty, which includes low === high.',
          ],
          explanation: 'The invariant is: if the target is present, it is in positions low to high. The window is empty only when low passes high, so the loop must continue while low <= high.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-68-match-1',
          kind: 'match',
          title: 'Why the confident claim is wrong',
          prompt: 'Match each claim an assistant might make to what is wrong with it.',
          concept: 'detecting incorrect explanations',
          labels: { terms: 'The claim', meanings: 'What is wrong' },
          pairs: [
            {
              term: '"Looking up a key in a hash map is always O(1)."',
              definition: 'It is O(1) on average; many keys in one slot make it O(n)',
              note: 'Average and worst case differ, and the average depends on a good hash and a low load factor.',
            },
            {
              term: '"Selection sort keeps equal items in their original order."',
              definition: 'Its long-distance swaps can move an item past an equal one',
              note: 'Stability requires equal items to keep their relative order, and swapping across a gap can break it.',
            },
            {
              term: '"Binary search works fine if the list happens to be out of order."',
              definition: 'Its decision to discard half relies on sorted data',
              note: 'On unsorted data it can discard the half that holds the target.',
            },
            {
              term: '"This function is O(n) because it has one loop."',
              definition: 'A call inside the loop may be a loop itself',
              note: 'Count what the loop body costs, not only how many times it runs.',
            },
          ],
          hints: [
            'Each claim is correct in some situation. Which situation is it leaving out?',
            'Two of them are about a case (average, sorted data); two are about hidden work or order.',
            'Match each claim with the test from the lesson that would show it false.',
          ],
          explanation: 'Every wrong claim here is true in a narrow case and false in general. The test that exposes it is a counter-example from outside that case.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-68-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the stability detector',
          prompt: 'Write `isStableSortResult(input, output)`. Both are arrays of `{ key, id }` records. Return `true` only if the output has the same number of records, is sorted by `key` from smallest to largest, and for each key the ids appear in the same order as in the input.',
          concept: 'checking a sort for stability',
          language: 'javascript',
          starter: `function isStableSortResult(input, output) {
  // input and output are arrays of { key, id }.
  // true when output has the same records, is sorted by key,
  // and records with equal keys appear in the same order as in input
  return false;
}`,
          solution: `function isStableSortResult(input, output) {
  if (input.length !== output.length) return false;
  for (let i = 1; i < output.length; i++) {
    if (output[i - 1].key > output[i].key) return false;
  }
  const keys = new Set(input.map((record) => record.key));
  for (const key of keys) {
    const before = input.filter((record) => record.key === key).map((record) => record.id).join(',');
    const after = output.filter((record) => record.key === key).map((record) => record.id).join(',');
    if (before !== after) return false;
  }
  return true;
}`,
          tests: {
            kind: 'function',
            fn: 'isStableSortResult',
            cases: [
              {
                label: 'a stable result',
                args: [
                  [{ key: 2, id: 'A' }, { key: 2, id: 'B' }, { key: 1, id: 'C' }],
                  [{ key: 1, id: 'C' }, { key: 2, id: 'A' }, { key: 2, id: 'B' }],
                ],
                expected: true,
              },
              {
                label: 'equal keys swapped',
                args: [
                  [{ key: 2, id: 'A' }, { key: 2, id: 'B' }, { key: 1, id: 'C' }],
                  [{ key: 1, id: 'C' }, { key: 2, id: 'B' }, { key: 2, id: 'A' }],
                ],
                expected: false,
              },
              {
                label: 'not sorted',
                args: [[{ key: 1, id: 'A' }, { key: 2, id: 'B' }], [{ key: 2, id: 'B' }, { key: 1, id: 'A' }]],
                expected: false,
              },
              { label: 'empty', args: [[], []], expected: true },
              {
                label: 'a record was dropped',
                args: [[{ key: 1, id: 'A' }, { key: 2, id: 'B' }], [{ key: 1, id: 'A' }]],
                expected: false,
                hidden: true,
              },
              {
                label: 'several equal groups',
                args: [
                  [{ key: 3, id: 'P' }, { key: 1, id: 'Q' }, { key: 3, id: 'R' }, { key: 1, id: 'S' }],
                  [{ key: 1, id: 'Q' }, { key: 1, id: 'S' }, { key: 3, id: 'P' }, { key: 3, id: 'R' }],
                ],
                expected: true,
                hidden: true,
              },
            ],
          },
          hints: [
            'First check the lengths and that each neighbour is not bigger than the next.',
            'For each distinct key, list the ids in input order and the ids in output order.',
            'Compare the two lists, for example by joining each into a string with commas.',
          ],
          explanation: 'Sortedness is a pairwise check of neighbours. Stability is a per-key check that the ids keep their input order, which is exactly what "equal items keep their relative order" means.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-68-scenario-1',
          kind: 'scenario',
          title: 'A faster version arrives',
          prompt: 'Choose the best way to review it.',
          concept: 'reviewing AI-generated optimizations',
          situation: 'An assistant rewrote your de-duplication function and says "same result, much faster". The new version sorts the list first. Your report screen shows customers in the order they first appeared.',
          options: [
            {
              text: 'Run the old and the new function on the same inputs, including empty, one item and repeats, compare the outputs including their order, and count steps for both at n and 2n.',
              consequence: 'The comparison shows the new version reorders the output. You decide with whoever owns the report whether that matters, and you have counts to show the speed gain.',
              quality: 'best',
            },
            {
              text: 'Check that both return the same number of items.',
              consequence: 'The counts match, but the order changed and the screen would now look different.',
              quality: 'poor',
            },
            {
              text: 'Time it once on your laptop and accept it if it is faster.',
              consequence: 'A single timing says nothing about growth, and it does not check behaviour at all.',
              quality: 'poor',
            },
            {
              text: 'Ask the assistant to confirm that the behaviour is unchanged.',
              consequence: 'It may say yes. You still have no evidence that you can reproduce.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'Which part of the claim "same result" could hide a difference?',
            'Compare the outputs as a whole, not only their lengths.',
            'Counting steps at two sizes tells you whether the growth changed.',
          ],
          explanation: 'A review checks behaviour and speed separately and with evidence. Comparing whole outputs catches a changed order that a length check misses.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-68-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Four questions for any suggested optimization',
          prompt: 'Tap each question to see what a good review looks at.',
          concept: 'reviewing optimizations',
          cards: [
            {
              front: 'Does it keep the behaviour?',
              back: 'Run old and new on empty, one item, repeats and large inputs, and compare complete outputs, including the order of results and what happens on bad input.',
            },
            {
              front: 'Is it faster by count?',
              back: 'Count steps at n and 2n for both. A real improvement changes the growth (quadratic to linear), not just a constant.',
            },
            {
              front: 'Is it still readable?',
              back: 'A trick that saves a few steps but needs a comment to be understood is usually not worth it unless it fixes the measured bottleneck.',
            },
            {
              front: 'Did it add a hidden cost?',
              back: 'Look for extra memory (a Set or copy), changed order, a mutated input, or a new assumption such as sorted data.',
            },
          ],
          hints: [],
          explanation: 'Behaviour, speed, readability and hidden costs are four different ways an optimization can disappoint, and each needs its own check.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-68-q1',
        prompt: 'An assistant says "binary search works on any list, only slower when it is unsorted". Which test best shows the claim is wrong?',
        choices: [
          'Time the search on a big list and compare it with a linear one',
          'Ask the assistant to repeat its answer in some other words',
          'Read the code of the binary search again, one line at a time',
          'Search an unsorted list for a value that is plainly there',
        ],
        answer: 3,
        explanation: 'A counter-example is decisive. A present value that comes back as missing shows the algorithm cannot be relied on for unsorted data, however slowly.',
      },
      {
        id: 'data-structures-algorithms-68-q2',
        prompt: 'You sort tickets with equal levels using a hand-written selection sort and get CBA, while the built-in sort gives CAB. What does this show?',
        choices: [
          'The built-in sort is broken, because it disagrees with yours',
          'Both are correct, as the order of equal items never matters',
          'The selection sort is unstable: A and B swapped their order',
          'The records were already sorted before either sort ran',
        ],
        answer: 2,
        explanation: 'A and B had the same level and A came first in the input. A stable sort keeps it first; the selection sort moved A behind B.',
      },
      {
        id: 'data-structures-algorithms-68-q3',
        prompt: 'A comparison harness reports no mismatch between an old and a new function over six inputs: an empty list, one item and four short lists with repeats. What may you conclude?',
        choices: [
          'The two functions are equivalent for every possible input, including those nobody has tried',
          'They agree on those six inputs; large, sorted and adversarial ones remain untested',
          'The new function is faster than the old one on all inputs',
          'The old function must be correct, since nothing disagreed',
        ],
        answer: 1,
        explanation: 'Agreement on chosen inputs is evidence, not proof. Add inputs aimed at where the new version might differ, such as sorted and reversed lists, and large generated ones.',
      },
      {
        id: 'data-structures-algorithms-68-q4',
        prompt: 'An optimization drops the step count from about n² to about n log n but changes the order of the output. What is the right decision process?',
        choices: [
          'Ask whether order is a requirement; keep it, reject or record the decision',
          'Accept it at once, because faster is always better than slower',
          'Reject it at once, because good code never changes the order',
          'Accept it and tell nobody, since the values are all still there',
        ],
        answer: 0,
        explanation: 'Order may or may not matter to the users of the function. That is a requirement question, so it is answered by whoever owns the requirement, not by the benchmark.',
      },
      {
        id: 'data-structures-algorithms-68-q5',
        audience: { max: 'beginner' },
        prompt: 'A friend says a shortcut gets you home faster. What is the best way to check?',
        choices: [
          'Believe them, because they sounded very sure of themselves when they said it to you',
          'Walk both routes and compare where each ends and how long it takes',
          'Ask another friend what they think about the shortcut',
          'Pick the route that looks shorter when you see it on the map',
        ],
        answer: 1,
        explanation: 'Trying both and comparing the result and the time is the same as running the old and new code and comparing their output and their step counts.',
      },
      {
        id: 'data-structures-algorithms-68-q6',
        audience: { min: 'advanced' },
        prompt: 'A hash-based cache was described as "O(1) always". In review you find keys with poor distribution cause long chains under load. What is the sound change to the claim and to the design?',
        choices: [
          'Keep the claim as it is, since long chains are rare in practice',
          'Replace the hash table with a linear scan, which is predictable',
          'Remove the cache entirely, because it cannot be made safe',
          'Say "O(1) average, O(n) worst", document the hash assumptions, bound chains',
        ],
        answer: 3,
        explanation: 'The claim must carry its case and its assumptions. Designing for the worst case, for example with a better hash, a resize policy or a bound on chain length, keeps the average benefit and limits the risk.',
      },
    ],
    task: {
      title: 'Break three claims',
      minutes: 20,
      steps: [
        'Run the unsorted binary search, the stability test and the probe counter. Write down for each the claim it tests and the counter-example it uses.',
        'Make a new input for the stability test with three records at level 1 and two at level 2. Predict the selection sort order first, then run it.',
        'Add a third candidate to the review code: `uniqueFilter` using a Map of first positions. Run the harness and say whether it agrees with `uniqueOld`.',
        'Write a four-question review checklist in your own words that you could apply to the next optimization an assistant suggests.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the assistant to explain stable sorting with a deck of cards sorted by number, then lay out a few cards and sort them twice (once keeping equal numbers in order, once not) to see the difference yourself.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Turn the harness into a generated test: produce 300 pseudo-random lists with many repeats and compare old and new, printing the smallest list that disagrees (try shrinking a failing list by dropping elements).',
        ],
      },
    ],
  },
];

export const project: Project | null = {
  id: 'data-structures-algorithms-p12',
  title: 'Slow-Application Optimization with AI',
  summary: 'Take the slow support-desk report from lesson 67, find its bottleneck by counting, use an AI assistant to challenge your hypothesis, replace the slow structure yourself and measure the improvement by count.',
  outcome: 'A before-and-after report with operation counts that shows you can find a bottleneck, choose a better structure, verify the behaviour is unchanged and explain the trade-off, with an assistant as a partner and not a substitute.',
  unlockAfterDay: 67,
  steps: [
    {
      id: 'data-structures-algorithms-p12-s1',
      text: 'Copy the slow ticket report from lesson 67 and run it. Record the step count of each stage at 25, 50 and 100 customers in a table, and the ratio between neighbouring sizes.',
    },
    {
      id: 'data-structures-algorithms-p12-s2',
      audience: { max: 'beginner' },
      text: 'Work on one stage only: the one with the biggest count. Ignore the others until yours is done.',
    },
    {
      id: 'data-structures-algorithms-p12-s3',
      text: 'Before you ask any assistant, write your own hypothesis: which stage is the bottleneck, what is the nested scan inside it, and what you expect its cost to be as the input grows.',
    },
    {
      id: 'data-structures-algorithms-p12-s4',
      text: 'Ask an assistant to challenge your hypothesis, not to fix the program: give it the code and your hypothesis, ask which calls inside loops you may have ignored and for a doubling test. Note where it agreed, where it disagreed, and which of its claims you checked by counting.',
    },
    {
      id: 'data-structures-algorithms-p12-s5',
      text: 'Choose the structure yourself (a Map or Set built once is the usual candidate) and rewrite the slow stage. Keep the old function so you can compare.',
    },
    {
      id: 'data-structures-algorithms-p12-s6',
      text: 'Verify behaviour: run the old and new versions on at least six inputs (empty, one item, repeats, a large case) and show that the outputs, including their order, are identical. Then count the steps again at 25, 50 and 100 and give the before-and-after table.',
    },
    {
      id: 'data-structures-algorithms-p12-s7',
      audience: { min: 'advanced' },
      text: 'Find the second-largest bottleneck after your first fix and decide, with counts, whether it is worth fixing. Add a regression check that compares old and new results on 200 generated inputs.',
    },
    {
      id: 'data-structures-algorithms-p12-s8',
      text: 'Write your explanation: the bottleneck and how you found it, the structure you chose and why, the cost before and after (average versus worst case where they differ), the extra memory you spent, and one thing the assistant said that you checked instead of trusting.',
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your code, counts and explanation',
    placeholder: 'Paste your optimized code, your before-and-after table of step counts, the comparison of old and new outputs, and your written explanation.',
    hint: 'Include your hypothesis written before you asked an assistant, the before-and-after counts at three sizes, evidence the output is unchanged, and an explanation of the trade-off.',
  },
  rubric: [
    'Correctness: the optimized stage returns exactly the same results, in the same order, as the original on empty, small, repeated and large inputs.',
    'Efficiency: the step counts show a change in growth (from quadratic to linear), not only a smaller constant, and the table is measured by counting, not by a clock.',
    'Code organization: the original is kept for comparison, the change is small and readable, and the counters make each stage visible.',
    'Explaining trade-offs: the explanation names the bottleneck, the chosen structure, the cost before and after, and the memory spent.',
    'Working with AI: the hypothesis was written before asking, and the explanation says what the assistant claimed and what you verified yourself.',
  ],
  rubricExtra: [
    {
      audience: { max: 'beginner' },
      items: [
        'Fixing and explaining one stage well, with counts at two sizes, is a complete submission.',
      ],
    },
    {
      audience: { min: 'intermediate', max: 'intermediate' },
      items: [
        'The comparison covers an input where every ticket belongs to the same customer, and the explanation says whether the fix helps or hurts there.',
      ],
    },
    {
      audience: { min: 'advanced' },
      items: [
        'A regression check compares old and new over generated inputs, and the explanation covers the memory cost and what you would measure beyond step counts in production.',
      ],
    },
  ],
};
