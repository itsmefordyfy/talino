import type { Lesson, Project } from '../../../types';

/**
 * Module 11, Heaps and Priority Queues (lessons 38 to 40, project p8). The heap property and the array layout, then sift up, sift down and
 * heapify, then heap sort and the priority queue with its applications. Every output printed in a code comment or a walkthrough was produced
 * by running the code with Node; the activities are run by the activity validator (the in-app runner).
 */

export const lessons: Lesson[] = [
  {
    id: 'data-structures-algorithms-38',
    day: 38,
    title: 'What Heaps Are: Min-Heaps, Max-Heaps and Array Representation',
    summary: 'A heap keeps the most urgent item at the top without sorting everything, and it fits in a plain array with simple index arithmetic.',
    minutes: 24,
    skills: ['trees-heaps'],
    intro: {
      objectives: [
        'Explain the heap property and the complete-tree shape, and why a heap is not a sorted array',
        'Tell a min-heap from a max-heap',
        'Work out the parent and the children of any index in an array-stored heap',
        'Write a function that checks whether an array is a valid min-heap',
      ],
      why: 'Whenever software keeps asking "what is the most urgent item right now?" while new items keep arriving, a heap is the usual answer. Knowing how it sits in an array lets you read, and check, any priority queue an AI assistant writes for you.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'In the lesson on priority queues you kept a line in order so the most urgent item was always at the front, and every new item had to find its place by shifting or scanning the others. That works, but the cost grows with the length of the line. A **heap** is the structure that fixes it. It does not keep everything sorted. It keeps just enough order that the most urgent item is always on top, and that small amount of order is cheap to maintain. This lesson is about what a heap is and how it sits inside an ordinary array. The next lesson adds and removes items.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Think of a small company chart. The owner is at the top, up to two people report to each manager, and one rule holds everywhere: **nobody is more senior than the person they report to**. So the owner is at least as senior as everyone, and each manager is at least as senior as their own team. Notice what the rule does not say. A junior manager in the sales team may be less senior than a team lead in finance, because they sit in different branches and the rule never compares them. A heap is exactly this: a strict rule between each person and their direct reports, and no rule between branches.',
      },
      {
        type: 'paragraph',
        text: 'The picture stops being honest in one place: real teams are uneven, one manager with five reports and another with none. A heap is stricter about its shape, as the next section shows.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'A **binary heap** is a binary tree (every node has at most two children, as in the Trees module) that follows two rules at the same time.',
      },
      {
        type: 'list',
        items: [
          '**The shape rule:** the tree is *complete*. Every level is full, except possibly the last one, and the last level is filled from the left with no gaps.',
          '**The heap property:** every node is ordered against its children in the same way. In a **min-heap** a parent is less than or equal to both of its children, so the smallest value is at the root. In a **max-heap** a parent is greater than or equal to its children, so the largest value is at the root.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Use a min-heap when a small number means "more urgent": priority 1 is more urgent than priority 3. Use a max-heap when a big number wins, such as the highest score. The two are mirror images, and everything in this module works for either by flipping one comparison.',
      },
      {
        type: 'paragraph',
        text: 'A heap is **not sorted**. Only the root is guaranteed to be the most urgent value, and the rest is ordered just enough along each parent-to-child line. The values 3 and 2 below sit next to each other in the wrong order, and that is fine, because neither is the parent of the other. This looseness is the whole point: sorting everything costs more than finding one winner, and a heap pays only for the winner.',
      },
      {
        type: 'paragraph',
        text: 'Because the shape is complete, a heap never needs node objects or references. Write the values level by level, left to right, into an array, and the position of a value tells you where it is in the tree. For a node at index `i` (counting from 0 as always):',
      },
      {
        type: 'table',
        headers: ['Relation', 'Index', 'Why'],
        rows: [
          ['Left child', '2 * i + 1', 'Level k holds twice as many nodes as level k - 1, so the children sit twice as far along'],
          ['Right child', '2 * i + 2', 'Right after the left child'],
          ['Parent', 'Math.floor((i - 1) / 2)', 'The inverse of the two rules above; the root (index 0) has no parent'],
        ],
        caption: 'The index arithmetic of a heap stored in an array that starts at 0',
      },
      {
        type: 'paragraph',
        text: 'Here is one min-heap of seven task priorities, as an array and as the tree it stands for:',
      },
      {
        type: 'table',
        headers: ['Index', 'Value', 'Parent index', 'Left child', 'Right child'],
        rows: [
          ['0', '1', 'none', '1', '2'],
          ['1', '3', '0', '3', '4'],
          ['2', '2', '0', '5', '6'],
          ['3', '7', '1', 'none', 'none'],
          ['4', '4', '1', 'none', 'none'],
          ['5', '8', '2', 'none', 'none'],
          ['6', '5', '2', 'none', 'none'],
        ],
        caption: 'The array [1, 3, 2, 7, 4, 8, 5]. A child index of "none" means it would be past the end of the array.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The same seven values as a tree. Every parent is less than or equal to its two children, but 3 and 2 are in no order against each other.',
        source: 'flowchart TD\n  N0[1 at index 0] --> N1[3 at index 1]\n  N0 --> N2[2 at index 2]\n  N1 --> N3[7 at index 3]\n  N1 --> N4[4 at index 4]\n  N2 --> N5[8 at index 5]\n  N2 --> N6[5 at index 6]',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: the array is just the chart written out as one long row, top level first, then the next level, left to right. Because no seat is ever left empty in the middle, you can find anyone by arithmetic. Seat 0 is the owner. Seat 1 and seat 2 are the owner\'s two reports. Seat 3 and seat 4 report to seat 1, and seat 5 and seat 6 report to seat 2. The formulas just continue that pattern: the reports of seat `i` sit at `2 * i + 1` and `2 * i + 2`. To go up from a seat, undo it: subtract 1, divide by 2 and drop any fraction (`Math.floor` does that).',
      },
      {
        type: 'paragraph',
        text: 'The complete shape has a second benefit. A complete tree with n nodes has only `Math.floor(Math.log2(n)) + 1` levels. Seven values fill 3 levels, a thousand values need 10, and a million values need only 20. Every operation in the next lesson walks along one path from the top to the bottom or back, so it takes at most about log n steps.',
      },
      { type: 'visual', id: 'heap-operations', caption: 'Look at the tree and the array together: they are the same heap. Find a value\'s parent in the tree, then find its index in the array and check it against the formula.' },
      {
        type: 'paragraph',
        text: 'It helps to compare a heap with the structures you have already met. All costs are in the model of this course, and the next lesson shows where the heap\'s costs come from.',
      },
      {
        type: 'table',
        headers: ['Way of keeping the most urgent item ready', 'See the most urgent', 'Add an item', 'Remove the most urgent'],
        rows: [
          ['Unsorted array', 'O(n): scan everything', 'O(1): append', 'O(n): find it, then remove it'],
          ['Array kept sorted', 'O(1)', 'O(n): shift to make room', 'O(1) from the right end, O(n) from the left'],
          ['Binary heap', 'O(1): index 0', 'O(log n)', 'O(log n)'],
        ],
        caption: 'Only the heap keeps all three cheap. It gives up searching for an arbitrary value, which stays O(n).',
      },
      {
        type: 'paragraph',
        text: 'A binary search tree answers a different question. Its rule (left smaller, right larger) lets you look for any value quickly, but its smallest value is at the far end of a branch, not on top. A heap cannot search for a value at all without scanning, because the rule never says which branch a value is in.',
      },
      {
        type: 'tip',
        text: 'The word "heap" has a second, unrelated meaning: the region of memory where a running program keeps its objects. A heap data structure has nothing to do with it. If someone says "heap" in a talk about memory, they mean that one.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: three small functions turn the table above into code. Each takes an index and returns an index.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Index arithmetic',
        code: `function parentOf(i) {
  return Math.floor((i - 1) / 2);
}

function leftOf(i) {
  return 2 * i + 1;
}

function rightOf(i) {
  return 2 * i + 2;
}`,
      },
      { type: 'paragraph', text: 'Step 2: use them on the heap from the table. A child index only exists if it is less than the length of the array.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Reading the family of every index (continues step 1)',
        code: `const heap = [1, 3, 2, 7, 4, 8, 5];

for (let i = 0; i < heap.length; i++) {
  const left = leftOf(i);
  const right = rightOf(i);
  console.log(
    'index', i, 'value', heap[i],
    'children', left < heap.length ? heap[left] : '-', right < heap.length ? heap[right] : '-'
  );
}
// index 0 value 1 children 3 2
// index 1 value 3 children 7 4
// index 2 value 2 children 8 5
// index 3 value 7 children - -
// index 4 value 4 children - -
// index 5 value 8 children - -
// index 6 value 5 children - -`,
      },
      { type: 'paragraph', text: 'Step 3: a function that checks the heap property. Every element except the root has exactly one parent, so one pass over the indexes from 1 upward is enough.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Is this array a min-heap? (continues step 1)',
        code: `function isMinHeap(values) {
  for (let i = 1; i < values.length; i++) {
    if (values[parentOf(i)] > values[i]) {
      return false;
    }
  }
  return true;
}

console.log(isMinHeap([1, 3, 2, 7, 4, 8, 5])); // true
console.log(isMinHeap([1, 3, 2, 7, 4, 1, 5])); // false: 1 sits under 2
console.log(isMinHeap([1, 2, 3, 4, 5, 6, 7])); // true: a sorted array is always a min-heap
console.log(isMinHeap([3, 1, 2])); // false
console.log(isMinHeap([])); // true: nothing can break the rule
console.log(isMinHeap([42])); // true`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** `leftOf` and `rightOf` are the two formulas from the table, and `parentOf` undoes them. `Math.floor` drops the fraction, so index 4 and index 3 both give parent 1.',
          '**Step 2.** The loop visits every index. For index 0 the children are at 1 and 2, which hold 3 and 2. For index 3 the left child would be at 7, which is not less than the length 7, so the program prints a dash instead of reading past the end. That check is what makes the leaves print dashes.',
          '**Step 3.** `isMinHeap` compares each value with its parent. One violation is enough to return `false`. The loop starts at 1 because the root has no parent. An empty array and a one-element array never enter the loop, so they are heaps. The sorted array shows that a sorted array is a valid min-heap, but a min-heap is usually not sorted.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Here is the check traced on `[1, 3, 2, 7, 4, 1, 5]`, the second array above, one index at a time:',
      },
      {
        type: 'table',
        headers: ['i', 'values[i]', 'parentOf(i)', 'values[parent]', 'parent > value?', 'Result so far'],
        rows: [
          ['1', '3', '0', '1', 'no', 'keep going'],
          ['2', '2', '0', '1', 'no', 'keep going'],
          ['3', '7', '1', '3', 'no', 'keep going'],
          ['4', '4', '1', '3', 'no', 'keep going'],
          ['5', '1', '2', '2', 'yes', 'return false'],
        ],
        caption: 'At index 5 the value 1 sits under the parent 2, so the heap property is broken and the loop stops.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'The 0-based formulas above are the ones most code uses, but a 1-based layout (index 0 left empty, children at `2i` and `2i + 1`, parent `i >> 1`) appears in many textbooks and algorithm write-ups, and mixing the two silently is a classic defect: a heap built with one convention and read with the other still looks plausible. A d-ary heap generalizes the layout: children of `i` at `d * i + 1` to `d * i + d`, parent `Math.floor((i - 1) / d)`. A larger d makes the tree shallower (cheaper sift up) but each sift down compares more children per level, so d is a tuning choice rather than a free win. Since all the information is in the array, a heap is also trivially serializable and copies with one `slice()`.',
      },
      {
        type: 'warning',
        text: 'Do not read a heap as if it were sorted. In `[1, 3, 2, 7, 4, 8, 5]` the second element, 3, is not the second smallest value: 2 is. Only index 0 is guaranteed to be the extreme value.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Make the assistant quiz you on the rule',
        text: 'I am learning binary heaps stored in a JavaScript array that starts at index 0. Give me an array of 7 or 8 numbers, and ask me to decide whether it is a valid min-heap. Do not tell me the answer. Ask me, one question at a time, for the parent index of a few positions and whether each parent is less than or equal to its child. After I answer, tell me whether I am right and why. Then repeat with a different array, one that is NOT a valid heap, without telling me that beforehand.',
      },
      {
        type: 'paragraph',
        text: 'In the answers, check three things yourself. First, the index formulas must be the 0-based ones from the table (children at `2i + 1` and `2i + 2`). An assistant sometimes mixes in the 1-based formulas from a textbook and gives wrong parents. Second, "valid" means every parent-child pair satisfies the rule, not only the root. Third, it may call a heap "sorted". It is not. If an answer disagrees with your own calculation, redo the arithmetic on paper before you trust either of you.',
      },
      {
        type: 'takeaways',
        items: [
          'A binary heap is a complete binary tree (every level full, the last one filled from the left) with the heap property: in a min-heap every parent is less than or equal to its children, in a max-heap greater than or equal.',
          'Only the root is guaranteed to be the extreme value. A heap is not sorted, and searching for an arbitrary value in it is still O(n).',
          'The complete shape lets a heap live in a plain array with no references: children of i at 2i + 1 and 2i + 2, parent at Math.floor((i - 1) / 2).',
          'A complete tree with n nodes has about log2(n) levels, which is why the heap operations in the next lesson cost O(log n).',
          'To see the most urgent item, add one and remove one, a heap costs O(1), O(log n) and O(log n); an unsorted or a sorted array pays O(n) for at least one of them.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-38-predict-output-1',
          kind: 'predict-output',
          title: 'Read the heap by index',
          prompt: 'This min-heap is stored in an array. Predict what the program prints. Work out each index with the formulas first.',
          concept: 'heap array indexes',
          language: 'javascript',
          code: `const heap = [2, 5, 3, 9, 6, 8, 4];
const i = 4;
console.log(heap[Math.floor((i - 1) / 2)]);
console.log(heap[2 * i + 1]);
console.log(heap[2 * 2 + 1], heap[2 * 2 + 2]);
console.log(heap.length);`,
          expected: '5\nundefined\n8 4\n7',
          choices: ['5\nundefined\n8 4\n7', '9\nundefined\n8 4\n7', '5\n8\n8 4\n7', '5\nundefined\n9 6\n7'],
          wrongNotes: {
            '9\nundefined\n8 4\n7': 'The parent of index 4 is at Math.floor((4 - 1) / 2) = 1, and heap[1] is 5. Index 3 holds 9, which is a sibling.',
            '5\n8\n8 4\n7': 'The left child of index 4 would be at 2 * 4 + 1 = 9, but the array only has indexes 0 to 6, so reading it gives undefined.',
            '5\nundefined\n9 6\n7': 'Those are the children of index 1 (at 3 and 4). The children of index 2 are at 2 * 2 + 1 = 5 and 2 * 2 + 2 = 6.',
          },
          hints: [
            'Write the indexes 0 to 6 above the seven values first.',
            'For the first line, the parent of index 4 is Math.floor(3 / 2). For the second, 2 * 4 + 1 is a big index: is it inside the array?',
            'Line 3 reads the children of index 2, at 5 and 6. The length is the number of elements.',
          ],
          explanation: 'The parent of index 4 is index 1, which holds 5. The left child of index 4 would be index 9, past the end of a 7-element array, so the read gives undefined. The children of index 2 are at 5 and 6, holding 8 and 4. The array has 7 elements.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-38-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the index formulas',
          prompt: 'Fill in the three numbers so the functions work for a heap stored in an array that starts at index 0.',
          concept: 'heap array indexes',
          language: 'javascript',
          code: `function parentOf(i) {
  return Math.floor((i - ___) / 2);
}

function leftOf(i) {
  return 2 * i + ___;
}

function rightOf(i) {
  return 2 * i + ___;
}

console.log(parentOf(5), leftOf(1), rightOf(1));`,
          blanks: [
            { answers: ['1'], feedback: 'Take one off before halving. Check it: the children of index 2 are 5 and 6, so the parent of 5 and 6 must both come out as 2.' },
            { answers: ['1'], feedback: 'The root (index 0) has its children at indexes 1 and 2, so the left child is one past 2 * i.' },
            { answers: ['2'], feedback: 'The right child comes right after the left child. For the root, the children are at 1 and 2.' },
          ],
          bank: ['1', '1', '2', '0', '3'],
          tests: { kind: 'output', expected: ['2 3 4'] },
          hints: [
            'Test with the root: its children are at indexes 1 and 2, so leftOf(0) should be 1.',
            'The parent formula undoes the child formulas: subtract the same offset the left child adds.',
            'The blanks are 1, 1 and 2, in that order.',
          ],
          explanation: 'The left child is at 2 * i + 1 and the right child at 2 * i + 2. The parent is Math.floor((i - 1) / 2). So parentOf(5) is 2, leftOf(1) is 3 and rightOf(1) is 4.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-38-fix-bug-1',
          kind: 'fix-bug',
          title: 'The checker that rejects a good heap',
          prompt: 'This function should say whether an array is a min-heap. It wrongly returns false for the valid heap [1, 3, 2], and it was written with a 1-based layout in mind. Tap the faulty line, then choose the fix.',
          concept: 'heap property check',
          language: 'javascript',
          code: `function isMinHeap(values) {
  for (let i = 1; i < values.length; i++) {
    const parent = Math.floor(i / 2);
    if (values[parent] > values[i]) {
      return false;
    }
  }
  return true;
}

console.log(isMinHeap([1, 3, 2]));
console.log(isMinHeap([3, 1, 2]));
console.log(isMinHeap([2, 1, 3]));
console.log(isMinHeap([1, 3, 2, 7, 4, 8, 5]));`,
          bugLine: 3,
          fixes: [
            { line: 'const parent = Math.floor((i - 1) / 2);', correct: true, why: 'In an array that starts at 0, the parent of index i is Math.floor((i - 1) / 2): index 2 now has parent 0, not 1.' },
            { line: 'const parent = Math.ceil(i / 2);', correct: false, why: 'Math.ceil(2 / 2) is 1, so index 2 still compares with index 1, which is its sibling.' },
            { line: 'const parent = Math.floor(i / 2) - 1;', correct: false, why: 'For index 1 this gives -1, and values[-1] is undefined, so the first comparison is skipped; index 3 also compares with the wrong parent.' },
            { line: 'const parent = Math.floor((i + 1) / 2);', correct: false, why: 'For index 2 this gives 1, the sibling again, and for index 1 it gives 1, the node itself.' },
          ],
          lineNote: 'The comparison logic is fine. Look at how the parent index is computed: for which i does it point at a sibling instead of the parent?',
          tests: { kind: 'output', expected: ['true', 'false', 'false', 'true'] },
          hints: [
            'Check the formula on index 2 of a 0-based array. Whose child is index 2?',
            'Index 1 and index 2 are both children of index 0, so the formula must give 0 for both.',
            'Math.floor((i - 1) / 2) gives 0 for i = 1 and i = 2.',
          ],
          explanation: 'The formula Math.floor(i / 2) belongs to a heap whose root is at index 1. In a 0-based array the parent of i is Math.floor((i - 1) / 2). With the wrong formula, index 2 was compared with its sibling at index 1 (3 > 2), so the valid heap [1, 3, 2] was rejected.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-38-scenario-1',
          kind: 'scenario',
          title: 'A help desk that never stops getting tickets',
          prompt: 'Choose the structure that suits the job best.',
          concept: 'choosing a priority structure',
          situation: 'A barangay help desk receives thousands of tickets a day, each with an urgency from 1 (emergency) to 5 (can wait). New tickets arrive constantly. Every few minutes an officer asks for the most urgent open ticket, and the desk never needs to look up a ticket by its number or list them all in order.',
          options: [
            { text: 'A min-heap ordered by urgency: the next ticket is at index 0, and adding or closing one costs about log n steps.', consequence: 'The officer always gets the most urgent ticket at once, and neither arrivals nor removals ever scan the whole pile. The unused features (searching by number, full sorted listing) are exactly the ones a heap does not offer, and this desk does not need them.', quality: 'best' },
            { text: 'An array kept sorted by urgency, inserting each new ticket in its place.', consequence: 'The most urgent ticket is cheap to read, but every arrival shifts many tickets. With thousands waiting, each insert costs O(n), so it works but does more work than the desk needs.', quality: 'acceptable' },
            { text: 'An unsorted array: append arrivals, and scan the whole array for the lowest urgency number each time.', consequence: 'Arrivals are fast, but every request scans all waiting tickets. With thousands waiting, each request costs O(n), and a busy desk spends most of its time scanning.', quality: 'poor' },
            { text: 'A Map keyed by ticket number.', consequence: 'A Map is excellent when you look a ticket up by its number, but it has no notion of "most urgent". Finding the lowest urgency means scanning every entry.', quality: 'poor' },
          ],
          hints: [
            'What are the only three things the desk does with the tickets: add one, look at the most urgent, remove it?',
            'Which structure in the comparison table keeps all three cheap?',
            'Searching by ticket number is not needed here, so a heap loses nothing.',
          ],
          explanation: 'The workload is "add, peek the most urgent, remove it", repeated forever. That is the heap\'s home ground: O(log n) to add, O(1) to peek and O(log n) to remove. A sorted array works for small piles, but its O(n) insert becomes the bottleneck as the pile grows.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-38-q1',
        prompt: 'Which array is a valid min-heap?',
        choices: ["[2, 5, 3, 9, 1, 8, 4]", "[5, 2, 3, 9, 6, 8, 4]", "[2, 5, 3, 9, 6, 8, 2, 7]", "[2, 5, 3, 9, 6, 8, 4]"],
        answer: 3,
        explanation: 'In the last array every parent is at most its children (2 at the top, 5 and 3 below it, and so on). In the first, 1 at index 4 sits under its parent 5. In the second, 5 is the root but 2 is its child. In the third, index 6 holds 2 and its parent, index 2, holds 3.',
      },
      {
        id: 'data-structures-algorithms-38-q2',
        prompt: 'A min-heap of 12 values is stored in an array. What can you say about the element at index 5?',
        choices: ["It has one child, at index 11, because 2 * 5 + 2 = 12 is past the end of the array", "It has two children, at indexes 10 and 11, because children always follow their parent directly", "It is a leaf with no children, because every index above half the length is a leaf", "Its parent is at index 3, because 5 divided by 2 is 2.5 and the result is rounded up"],
        answer: 0,
        explanation: 'The children of index 5 would be at 2 * 5 + 1 = 11 and 2 * 5 + 2 = 12. A 12-element array has indexes 0 to 11, so only the left child exists. Its parent is Math.floor(4 / 2) = 2.',
      },
      {
        id: 'data-structures-algorithms-38-q3',
        prompt: 'A teammate says: "I stored my tasks in a min-heap, so the element at index 1 is the second most urgent task." What is wrong with that claim?',
        choices: ["Nothing is wrong, because a heap is sorted from the root down and each index holds the next task", "The most urgent task is at index 1 and the second is at index 0, since the array is filled from the back", "It is at index 1 or 2: the second most urgent task is a root child, but the heap does not say which", "The second most urgent task is always the last element of the array, because new tasks are added at the end"],
        answer: 2,
        explanation: 'The heap property only orders each parent against its children. The second smallest value must be a child of the root, but which child depends on the data. A heap is not sorted.',
      },
      {
        id: 'data-structures-algorithms-38-q4',
        prompt: 'Why can a binary heap be stored in a plain array with no references between nodes?',
        choices: ["Because heap values are always whole numbers, and only whole numbers fit into array slots", "Because the shape is complete, with no gaps, so a position alone says where a node sits", "Because arrays are faster than objects in every language and in every possible situation", "Because every parent in a heap is smaller than its children, which fixes each position"],
        answer: 1,
        explanation: 'The shape rule fills every level from the left with no holes, so the nodes can be numbered level by level and the family of any node is found by arithmetic. The ordering rule is a separate matter and has nothing to do with the layout.',
      },
      {
        id: 'data-structures-algorithms-38-q5',
        audience: { max: 'beginner' },
        prompt: 'In the company-chart picture, what does the heap rule say?',
        choices: ["The whole company is listed in order from the most senior person down to the most junior one", "Every manager has exactly five reports, so every team in the chart is the same size", "The newest employee is always the one who sits at the very top of the whole chart", "Nobody outranks their own manager, and people in different branches are never compared"],
        answer: 3,
        explanation: 'The rule only compares each person with their direct manager. That is why the chart is not a full ranking: people in different branches are never compared.',
      },
      {
        id: 'data-structures-algorithms-38-q6',
        audience: { min: 'advanced' },
        prompt: 'An assistant writes: "To check whether a task id is in the priority queue, call the heap\'s lookup, which is O(log n) because the tree is shallow." What is the problem?',
        choices: ["A heap orders only parents and children, so finding an id is an O(n) scan; use an id-to-position Map", "Nothing: a heap is a search tree, so every look-up follows one path and takes O(log n)", "Look-up is O(1), because the heap is stored in an array and an array is indexed by position", "Look-up is O(n log n), because the heap would first have to be sorted before it can be searched"],
        answer: 0,
        explanation: 'The heap rule never says which branch a value is in, so a value can be anywhere. Real systems that need fast "is this id queued?" or "change this id\'s priority" keep a Map from id to array position next to the heap.',
      },
    ],
    task: {
      title: 'Draw your own heap',
      minutes: 12,
      steps: [
        'On paper, write seven priorities (numbers from 1 to 9, repeats allowed) in a row, then arrange them into a min-heap by hand: keep the smallest at the top, put a smaller number above larger ones where you can, and write the final array.',
        'Draw it as a tree (one value at the top, two below it, four on the last level). Write each value\'s index next to it and check each child\'s parent with Math.floor((i - 1) / 2).',
        'Type your array into any free JavaScript environment, paste in isMinHeap and the three helper functions from this lesson, and check that your array returns true. Then change one value so that a child is smaller than its parent and confirm it returns false.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain, line by line, what isMinHeap does with your array, then compare its explanation with the trace table in this lesson.'] },
      { audience: { min: 'advanced' }, steps: ['Generalize the checker to isHeap(values, before) where before(a, b) says whether a may sit above b, so one function handles both min-heaps and max-heaps, and test it with both.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-39',
    day: 39,
    title: 'Heap Insertion, Removal and Heapify',
    summary: 'Add and remove heap items by swapping along one path, and build a whole heap from an array faster than adding the items one by one.',
    minutes: 28,
    skills: ['trees-heaps'],
    intro: {
      objectives: [
        'Trace an insertion (sift up) and a removal of the root (sift down) on a min-heap',
        'Explain why each of them costs O(log n) and why removal swaps with the smaller child',
        'Build a heap from an array with heapify and compare its cost with inserting one value at a time',
        'Write insert and extract-min for an array-stored heap',
      ],
      why: 'Insert and extract are the two moves behind every priority queue, scheduler and top-k search. If you can trace them by hand, you can tell whether an AI-written heap is right, and why it is fast.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A heap has a shape (complete) and a rule (each parent at least as urgent as its children). The whole trick of this lesson is that you can add an item or remove the top item while breaking only one of the two rules, and then repair it by swapping along a single path from the bottom to the top, or the other way. A path in a heap is at most about log n steps long, so the repair is cheap. We write a min-heap, where a smaller number is more urgent. A max-heap is the same code with the comparisons flipped.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Go back to the company chart. A new hire takes the next free desk at the bottom of the chart, which keeps the chart evenly filled. If they are more senior than their manager, they swap places with that manager, then compare with the next manager up, and stop as soon as their boss is at least as senior as they are. That is **sift up**. When the owner leaves, the person in the very last desk is moved into the owner\'s chair so that the chart stays evenly filled. They probably do not belong there, so they trade places with the more senior of their two reports, again and again, until neither report is more senior. That is **sift down**.',
      },
      {
        type: 'paragraph',
        text: 'The picture is only a guide. Real people are not swapped like cards, and a real owner\'s successor is not picked by moving the newest employee in. A heap does it this way because it is the one move that keeps the shape complete.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: '**Insert.** First put the new value at the end of the array. That is the next free spot of the last level, so the shape stays complete, but the new value might be smaller than its parent, which breaks the heap property. Then sift up: while the value has a parent and the parent is larger, swap them. Stop when the parent is not larger, or when the value reaches the root. The values that move down were already at least as large as what sits below their old position, so nothing else is damaged. Each swap climbs one level, and there are about log n levels, so insert costs **O(log n)** in the worst case.',
      },
      {
        type: 'paragraph',
        text: '**Extract the top.** Reading the top is O(1): it is index 0. Removing it leaves a hole at the root, and filling the hole with a child would move the hole further down and break the shape. So take the **last** element of the array, put it at index 0 and shrink the array by one. The shape is complete again, but the new root is probably too large. Sift down: compare it with both children, swap it with the **smaller** of the two, and repeat from its new position. Stop when it is no larger than both children, or when it has no children. Extract also walks one path of about log n levels, so it costs **O(log n)**.',
      },
      {
        type: 'paragraph',
        text: 'Why the smaller child? Suppose the new root is 7 and its children are 2 and 5. Swapping with 5 puts 5 on top of 2, which breaks the rule between them. Swapping with 2 puts 2 on top of 5 and 7, which is correct. The smaller child is the only one that can safely become the parent of the other.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Extract the top of a min-heap. The loop on the decision node is sift down: each pass moves one level down the tree.',
        source: 'flowchart TD\n  A(Remember the root value to return) --> B[Move the last array element to index 0]\n  B --> C[Shrink the array by one]\n  C --> D{Is a child smaller than the item?}\n  D -->|yes| E[Swap the item with its smaller child]\n  E --> D\n  D -->|no| F(Done: the heap property holds again)',
      },
      { type: 'visual', id: 'heap-operations', caption: 'Press Next on an insert and watch the new value climb, then extract the top and watch the last value fall. Count the swaps and compare them with the number of levels in the tree.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: inserting is "join at the back, then move up while you are more urgent than the person in front of you". Removing the top is "the last person takes the front seat, then moves down while someone below is more urgent". You never search the whole heap, you only follow one line of seats from the top to the bottom, and that line is short even for a big heap: a million items need about 20 steps. The code below does exactly this with an array, using `swap` to trade two positions. The counter called `swaps` just adds one every time two values trade places, so you can see how much work was done.',
      },
      {
        type: 'paragraph',
        text: '**Heapify** answers a different question: you already have n values in an array in any order, and you want a heap. One way is to insert them one at a time, which costs n inserts of O(log n) each, so **O(n log n)**. A cleverer way builds the heap in place in **O(n)**. A leaf, a node with no children, is already a one-node heap. Half the nodes are leaves, so skip them. Start at the last parent, the parent of the last element, at index `Math.floor(n / 2) - 1`, sift it down, and walk backwards to index 0, sifting each one down. When you reach a node, both subtrees below it are already heaps, so a single sift down fixes it.',
      },
      {
        type: 'paragraph',
        text: 'Why is that O(n) when it looks like n sift downs of O(log n) each? Because a sift down costs only as much as the distance to the bottom, and most nodes are near the bottom. About n/2 nodes are leaves and cost nothing, about n/4 can move at most 1 level, n/8 at most 2, and only the root can move all the way. Add that up: n/4 times 1 plus n/8 times 2 plus n/16 times 3 and so on never exceeds n swaps in total. Insert one by one is the opposite: most nodes are near the bottom, so they have the longest way to climb. The code below measures it on the worst case for both, an array in descending order, where every inserted value climbs all the way to the root.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: insert. The `swaps` counter counts the work, as the counters did in the complexity module. After the insert the heap is `[1, 2, 5, 3, 4, 8, 6, 7]`: 2 was added at index 7, swapped with 7 and then with 3, and stopped under the 1.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Insert with sift up',
        code: `let swaps = 0;

function swap(a, i, j) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
  swaps += 1;
}

function siftUp(a, i) {
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    if (a[p] <= a[i]) break;
    swap(a, p, i);
    i = p;
  }
}

function insert(a, value) {
  a.push(value);
  siftUp(a, a.length - 1);
}

const h = [1, 3, 5, 7, 4, 8, 6];
insert(h, 2);
console.log(h.join(' ')); // 1 2 5 3 4 8 6 7
console.log(swaps); // 2`,
      },
      { type: 'paragraph', text: 'Step 2: extract the top with sift down. The function takes a `size` so it can later work on part of an array.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Extract the top with sift down (continues step 1)',
        code: `function siftDown(a, i, size) {
  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let smallest = i;
    if (left < size && a[left] < a[smallest]) smallest = left;
    if (right < size && a[right] < a[smallest]) smallest = right;
    if (smallest === i) break;
    swap(a, i, smallest);
    i = smallest;
  }
}

function extractMin(a) {
  if (a.length === 0) return undefined;
  const top = a[0];
  const last = a.pop();
  if (a.length > 0) {
    a[0] = last;
    siftDown(a, 0, a.length);
  }
  return top;
}

console.log(extractMin(h)); // 1
console.log(h.join(' ')); // 2 3 5 7 4 8 6
console.log(extractMin([])); // undefined`,
      },
      { type: 'paragraph', text: 'Step 3: heapify, and a measurement. `buildByInsert` inserts one value at a time; `buildByHeapify` copies the array and sifts down from the last parent to the root.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Heapify and a comparison (continues steps 1 and 2)',
        code: `function buildByInsert(values) {
  const heap = [];
  for (const v of values) {
    heap.push(v);
    siftUp(heap, heap.length - 1);
  }
  return heap;
}

function buildByHeapify(values) {
  const heap = values.slice();
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
    siftDown(heap, i, heap.length);
  }
  return heap;
}

console.log(buildByHeapify([9, 4, 7, 1, 6, 2, 8, 3, 5]).join(' ')); // 1 3 2 4 6 7 8 9 5

for (const n of [15, 127, 1023]) {
  const descending = [];
  for (let v = n; v >= 1; v--) descending.push(v);
  swaps = 0;
  buildByInsert(descending);
  const insertSwaps = swaps;
  swaps = 0;
  buildByHeapify(descending);
  console.log(n, insertSwaps, swaps);
}
// 15 34 11
// 127 642 120
// 1023 8194 1013`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** `insert` pushes 2 at index 7. `siftUp` finds its parent at index 3 (value 7), which is larger, so it swaps and moves up to index 3. The parent there is index 1 (value 3), also larger, so it swaps again. The parent of index 1 is the root, 1, which is not larger, so the loop breaks. Two swaps were counted.',
          '**Step 2.** `extractMin` remembers the top (1), pops the last element (7) and puts it at index 0. `siftDown` looks at its children, 2 and 5, and swaps with the smaller one, 2. At index 1 the children are 3 and 4, so it swaps with 3. At index 3 the children would be at 7 and 8, past the end, so neither condition holds, `smallest` stays at `i` and the loop breaks. Passing `size` to `siftDown` is what makes `left < size` the guard against reading past the end.',
          '**Step 3.** For nine values the last parent is at index 3, so the loop sifts down indexes 3, 2, 1 and 0 in that order. The table below follows it. The measurement then builds the same descending array both ways and prints the size and the two swap counts.',
        ],
      },
      {
        type: 'table',
        headers: ['i (sifted down)', 'Value moving', 'Smaller child', 'Swap?', 'Array after'],
        rows: [
          ['start', '', '', '', '9 4 7 1 6 2 8 3 5'],
          ['3', '1', '3 (index 7)', 'no, 1 is smaller', '9 4 7 1 6 2 8 3 5'],
          ['2', '7', '2 (index 5)', 'yes', '9 4 2 1 6 7 8 3 5'],
          ['1', '4', '1 (index 3)', 'yes, then again with 3', '9 1 2 3 6 7 8 4 5'],
          ['0', '9', '1 (index 1)', 'yes, then 3, then 4', '1 3 2 4 6 7 8 9 5'],
        ],
        caption: 'Heapify on [9, 4, 7, 1, 6, 2, 8, 3, 5]. Each row finishes one sift down.',
      },
      {
        type: 'table',
        headers: ['n (descending input)', 'Swaps, insert one by one', 'Swaps, heapify'],
        rows: [
          ['15', '34', '11'],
          ['127', '642', '120'],
          ['1,023', '8,194', '1,013'],
          ['10,000', '113,631', '9,992'],
        ],
        caption: 'Measured with the code above (the 10,000 row used the same functions). Heapify stays at about n swaps; inserting one by one grows like n log n.',
      },
      {
        type: 'table',
        headers: ['Operation', 'Cost', 'Why'],
        rows: [
          ['Peek at the top', 'O(1)', 'It is index 0'],
          ['Insert', 'O(log n)', 'At most one swap per level on the way up'],
          ['Extract the top', 'O(log n)', 'At most one swap per level on the way down'],
          ['Build from n values with heapify', 'O(n)', 'Most nodes are near the bottom and move very little'],
          ['Build by n inserts', 'O(n log n)', 'n inserts of O(log n) each'],
          ['Find a given value', 'O(n)', 'The heap property does not say which branch a value is in'],
        ],
        caption: 'The cost of every heap operation, worst case.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'The quoted bounds are worst cases. Insertion into a heap of randomly ordered data is far cheaper on average, because a new value usually stays near the bottom, so insert is often described as O(1) on average and O(log n) worst case; do not rely on the average for sorted or adversarial input, which a priority queue fed by timestamps or counters often is. Sift down does about two comparisons per level (child against child, then against the item), so extract does roughly 2 log n comparisons; variants such as bottom-up sift down trade that for fewer. Because the array is contiguous, both moves touch memory in a tight pattern near the top and a scattered one deep down, which matters for very large heaps. Heapify is O(n) but not stable, and the order of equal priorities after any operation is unspecified, so deterministic scheduling needs an explicit tie-breaker in the comparison.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Trace with me, one step at a time',
        text: 'I am learning how a min-heap stored in a JavaScript array works. The heap is [1, 3, 5, 7, 4, 8, 6]. Ask me to insert the value 2 by hand, one swap at a time, and wait for my answer before showing anything. After I finish, do the same for extracting the minimum. Do not give me the final arrays; check mine and give a hint if I am wrong. Finish by asking me to explain, in my own words, why extract swaps with the SMALLER child.',
      },
      {
        type: 'paragraph',
        text: 'Compare the assistant\'s checks with your own trace: after the insert you should have `1 2 5 3 4 8 6 7`, and after the extract `2 3 5 7 4 8 6`. An assistant can be confidently wrong in a few typical ways: sifting up from the wrong index, stopping a sift down one level early, or swapping with the larger child. It may also say that heapify is O(n log n) "because it does n sift downs". That reasoning ignores that most sift downs are very short. When an explanation and your trace disagree, trust the trace.',
      },
      {
        type: 'takeaways',
        items: [
          'Insert puts the value at the end of the array and sifts it up while its parent is larger; extract moves the last element to the root and sifts it down, always swapping with the smaller child.',
          'Both walk one root-to-leaf path of about log n levels, so insert and extract are O(log n) worst case, and peek is O(1).',
          'Moving the last element to the root (not a child) is what keeps the tree complete after a removal.',
          'Heapify builds a heap from n values in O(n) by sifting down from the last parent to the root: half the nodes are leaves, and most of the rest can move only a level or two.',
          'Inserting n values one at a time is O(n log n). Measured on a descending array, 1,023 values took 8,194 swaps that way and 1,013 with heapify.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-39-predict-output-1',
          kind: 'predict-output',
          title: 'Insert, then extract',
          prompt: 'The code inserts four values into an empty min-heap, then extracts the top. Predict the three lines it prints. Trace each insert by hand: where does 1 end up?',
          concept: 'sift up and sift down',
          language: 'javascript',
          code: `function swap(a, i, j) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function insert(a, value) {
  a.push(value);
  let i = a.length - 1;
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    if (a[p] <= a[i]) break;
    swap(a, p, i);
    i = p;
  }
}

function extractMin(a) {
  const top = a[0];
  const last = a.pop();
  if (a.length > 0) {
    a[0] = last;
    let i = 0;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < a.length && a[left] < a[smallest]) smallest = left;
      if (right < a.length && a[right] < a[smallest]) smallest = right;
      if (smallest === i) break;
      swap(a, i, smallest);
      i = smallest;
    }
  }
  return top;
}

const heap = [];
for (const v of [5, 3, 8, 1]) insert(heap, v);
console.log(heap.join(' '));
console.log(extractMin(heap));
console.log(heap.join(' '));`,
          expected: '1 3 8 5\n1\n3 5 8',
          choices: ['1 3 8 5\n1\n3 5 8', '5 3 8 1\n5\n3 8 1', '1 5 8 3\n1\n3 5 8', '1 3 8 5\n1\n5 3 8'],
          wrongNotes: {
            '5 3 8 1\n5\n3 8 1': 'That is the order the values were added in. The inserts sift up, so the smallest, 1, ends at the root.',
            '1 5 8 3\n1\n3 5 8': 'When 1 is added at index 3, its parent is index 1 (value 5), so they swap; then 1 swaps with the root 3. That leaves 3 at index 1 and 5 at index 3.',
            '1 3 8 5\n1\n5 3 8': 'After 1 is removed, the last value, 5, goes to the root; it is larger than both children 3 and 8, so it sifts down and swaps with the smaller child, 3.',
          },
          hints: [
            'Insert one at a time: after 5, 3 and 8 the heap is 3 5 8 (3 swapped with 5). Where does 1 go?',
            '1 starts at index 3. Its parent is index 1, which holds 5. Keep going up while the parent is larger.',
            'Extract: remember 1, move the last value (5) to the root, then swap it with the smaller child.',
          ],
          explanation: 'The heap after three inserts is 3 5 8. The value 1 is added at index 3, swaps with its parent 5 (index 1) and then with the root 3, giving 1 3 8 5. Extract returns 1, moves 5 to the root and swaps it with the smaller child, 3, leaving 3 5 8.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-39-fix-bug-1',
          kind: 'fix-bug',
          title: 'Sifting down the wrong way',
          prompt: 'This extract should return 1 and leave a valid min-heap, but afterwards a child is smaller than its parent. The faulty line decides which child to swap with. Tap it, then choose the fix.',
          concept: 'sift down with the smaller child',
          language: 'javascript',
          code: `function swap(a, i, j) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function extractMin(a) {
  const top = a[0];
  a[0] = a.pop();
  let i = 0;
  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let smallest = i;
    if (left < a.length && a[left] < a[smallest]) smallest = left;
    if (right < a.length && a[right] > a[smallest]) smallest = right;
    if (smallest === i) break;
    swap(a, i, smallest);
    i = smallest;
  }
  return top;
}

const heap = [1, 6, 2, 9, 7, 3, 4];
console.log(extractMin(heap));
console.log(heap.join(' '));
const second = [1, 2, 3, 9, 8, 7, 6];
extractMin(second);
console.log(second.join(' '));`,
          bugLine: 16,
          fixes: [
            { line: '    if (right < a.length && a[right] < a[smallest]) smallest = right;', correct: true, why: 'Now the right child wins only when it is smaller than the best so far (the item or the left child), so the item always swaps with the smaller child.' },
            { line: '    if (right < a.length && a[right] < a[i]) smallest = right;', correct: false, why: 'Comparing with a[i] ignores the left child: if the right child is smaller than the item but larger than the left child, it still wins and the larger child ends up above the smaller.' },
            { line: '    if (right < a.length && a[right] < a[smallest]) smallest = left;', correct: false, why: 'This asks the right question but then picks the left child, so a smaller right child is ignored.' },
            { line: '    if (right < a.length && a[right] >= a[smallest]) smallest = right;', correct: false, why: 'That still prefers the larger child, only now it also swaps on ties.' },
          ],
          lineNote: 'The line for the left child is right. Compare it with the line for the right child: what is the item being compared with, and which way does the comparison point?',
          tests: { kind: 'output', expected: ['1', '2 6 3 9 7 4', '2 6 3 9 8 7'] },
          hints: [
            'After the root 1 is removed, the last value, 4, moves to the root. Its children are 6 and 2. Which one should it swap with?',
            'The left-child line asks "is the left child smaller than the best so far?". The right-child line should ask the same thing.',
            'The comparison for the right child must be a[right] < a[smallest].',
          ],
          explanation: 'Sift down must swap with the smaller child so that the new parent is no larger than its other child. The bug used > for the right child, so a larger right child could be chosen. The correct version asks the same question for both children: is it smaller than the best candidate so far?',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-39-match-1',
          kind: 'match',
          title: 'What does each job cost?',
          prompt: 'Match each job on a heap of n items to its cost in the worst case.',
          concept: 'heap complexity',
          labels: { terms: 'Job', meanings: 'Cost' },
          pairs: [
            { term: 'A scheduler reads the next task without taking it', definition: 'O(1)', note: 'Reading index 0 needs no search and no swap.' },
            { term: 'A new task arrives and goes into the heap', definition: 'O(log n)', note: 'The new value climbs at most one level per swap, and there are about log n levels.' },
            { term: 'A worker takes the most urgent task out', definition: 'O(log n), after moving the last item to the root', note: 'The replacement sifts down along one path, at most one swap per level.' },
            { term: 'A day\'s 10,000 saved tasks are turned into a heap in one go', definition: 'O(n) with heapify', note: 'Heapify sifts down from the last parent and most nodes move only a little.' },
            { term: 'Someone asks whether task id 7731 is anywhere in the heap', definition: 'O(n)', note: 'The heap rule does not say which branch a value is in, so every item may have to be checked.' },
          ],
          hints: [
            'Ask for each job: does it walk one path of the tree, or look at every item?',
            'Reading the top and building a whole heap are the two special cases; the rest are one path.',
            'A heap cannot search, so looking for a given id is the slowest job.',
          ],
          explanation: 'Peek is a read of index 0. Insert and extract walk one path of about log n levels. Heapify touches every node but sifts most of them very little, so it totals O(n). A look-up by value has no shortcut in a heap.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-39-code-challenge-1',
          kind: 'code-challenge',
          title: 'Build a heap by inserting',
          prompt: 'Write buildHeap(values). It returns a new array that is a min-heap: start from an empty array and add the values one at a time, moving each new value up while its parent is larger. Do not sort the input and do not change it.',
          concept: 'insert with sift up',
          language: 'javascript',
          starter: `function buildHeap(values) {
  const heap = [];
  for (const value of values) {
    heap.push(value);
    // move the new value up while its parent is larger
  }
  return heap;
}`,
          tests: {
            kind: 'function',
            fn: 'buildHeap',
            cases: [
              { label: 'buildHeap([])', args: [[]], expected: [] },
              { label: 'buildHeap([5])', args: [[5]], expected: [5] },
              { label: 'buildHeap([5, 3, 8, 1])', args: [[5, 3, 8, 1]], expected: [1, 3, 8, 5] },
              { label: 'equal values stay put', args: [[4, 4, 4]], expected: [4, 4, 4] },
              { label: 'a descending run of 15 values', args: [[15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]], expected: [1, 6, 2, 9, 7, 5, 3, 15, 12, 13, 8, 14, 10, 11, 4] },
              {
                label: 'a hidden case with 40 values',
                args: [[0, 37, 33, 29, 25, 21, 17, 13, 9, 5, 1, 38, 34, 30, 26, 22, 18, 14, 10, 6, 2, 39, 35, 31, 27, 23, 19, 15, 11, 7, 3, 40, 36, 32, 28, 24, 20, 16, 12, 8]],
                expected: [0, 1, 3, 10, 2, 19, 7, 18, 12, 5, 9, 31, 23, 17, 11, 36, 22, 20, 13, 8, 6, 39, 35, 38, 33, 34, 27, 30, 21, 26, 15, 40, 37, 32, 28, 25, 24, 16, 14, 29],
                hidden: true,
              },
            ],
          },
          solution: `function buildHeap(values) {
  const heap = [];
  for (const value of values) {
    heap.push(value);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent] <= heap[i]) break;
      const temp = heap[parent];
      heap[parent] = heap[i];
      heap[i] = temp;
      i = parent;
    }
  }
  return heap;
}`,
          hints: [
            'After the push, the new value sits at index heap.length - 1. Keep an index i for it.',
            'Loop while i > 0: compute the parent, stop if the parent is not larger, otherwise swap and set i to the parent.',
            'The swap needs a temporary variable: temp = heap[parent]; heap[parent] = heap[i]; heap[i] = temp.',
          ],
          explanation: 'Each value is pushed at the end, which keeps the shape complete, and then sifts up along its path to the root. The loop stops when the parent is no larger (the heap property holds) or the value reaches index 0. The whole build is O(n log n) in the worst case.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-39-q1',
        prompt: 'The min-heap [2, 4, 3, 9, 6, 8, 5] receives the value 1. Where does 1 end up?',
        choices: ["At index 7, because it was added last and a heap never moves a new value", "At index 0, after swapping with 9, then 4, then 2", "At index 1, after swapping with 9 and then with 4", "At index 3, after one single swap with 9"],
        answer: 1,
        explanation: '1 starts at index 7. Its parent (index 3) holds 9, so they swap; then it meets 4 at index 1 and swaps; then 2 at the root and swaps. It stops at index 0 because the root has no parent.',
      },
      {
        id: 'data-structures-algorithms-39-q2',
        prompt: 'When the top of a heap is removed, the last element is moved to the root instead of promoting one of the root\'s children. Why?',
        choices: ["It is cheaper to read the last element of an array than to read either of the root's two children, which saves time", "The last element is always the largest value in the heap, so it already belongs at the bottom of the tree", "A child cannot be moved up without being deleted from the array first, which is very slow in practice", "Promoting a child would leave a gap lower down and break the shape, but the last element keeps it"],
        answer: 3,
        explanation: 'The array must stay free of gaps. Removing the last element shrinks the array by one slot at the end, so the shape stays complete, and sift down then repairs the order along a single path.',
      },
      {
        id: 'data-structures-algorithms-39-q3',
        prompt: 'During sift down in a min-heap, the item is 7 and its children are 2 and 5. Which swap is correct?',
        choices: ["With 2, the smaller child, so that the new parent is no larger than its other child", "With 5, the larger child, so that the left side of the tree stays shorter than the right side", "With either one, because both choices leave a valid heap as long as the item moves down", "With neither one, because 7 is larger than nothing and so it should stay where it is"],
        answer: 0,
        explanation: 'If 7 swapped with 5, then 5 would sit above 2 and the heap property would break. Swapping with 2 puts 2 above both 5 and 7.',
      },
      {
        id: 'data-structures-algorithms-39-q4',
        prompt: 'A developer builds a heap from 10,000 unsorted values by calling insert 10,000 times, and an AI assistant says "just use heapify instead". What is the best reason?',
        choices: ["Heapify returns a fully sorted array, so no later sorting step is needed at all", "Heapify makes every later extract O(1), because the array is already fully ordered", "It builds the heap in O(n), not O(n log n), because most sift downs are short", "Heapify uses no comparisons at all, because it only moves values to new positions"],
        answer: 2,
        explanation: 'Heapify sifts down from the last parent to the root, and about half the nodes are leaves that need nothing. The result is a heap, not a sorted array, and extract stays O(log n).',
      },
      {
        id: 'data-structures-algorithms-39-q5',
        audience: { max: 'beginner' },
        prompt: 'In the company-chart picture, what does "sift up" mean?',
        choices: ["The owner of the company swaps into a smaller office and a new owner is chosen", "Everyone in the chart is moved up one level at the same time, starting from the bottom", "A new person at the bottom swaps places with their manager while they are more senior", "The last person in the chart is removed from the company and the chart is closed up"],
        answer: 2,
        explanation: 'Sift up is the repair after an insert: the new item starts at the bottom and moves up while it is more urgent than its parent, stopping when its parent is at least as urgent.',
      },
      {
        id: 'data-structures-algorithms-39-q6',
        audience: { min: 'advanced' },
        prompt: 'A scheduler built on a heap must run equal-priority tasks in the order they arrived, but it sometimes runs them out of order. What is the cleanest fix?',
        choices: ["Switch to heapify so that equal values keep the order in which they arrived", "Replace the heap with an array that is re-sorted by priority after every single insert", "Insert every equal-priority task twice so that one copy lands in the right place", "Add an arrival number to each task and break priority ties with it in the comparison"],
        answer: 3,
        explanation: 'A heap compares only what the comparison tells it, and the order of equal items is unspecified. A tie-breaker such as an arrival counter makes the order total and deterministic without changing the O(log n) costs.',
      },
    ],
    task: {
      title: 'Trace by hand, then count',
      minutes: 15,
      steps: [
        'On paper, take the heap [1, 3, 5, 7, 4, 8, 6]. Insert 2 by hand, drawing the array after each swap, then extract the minimum and draw the array after each swap. Write the final arrays.',
        'In any free JavaScript environment, paste the code from steps 1 and 2 of this lesson, run it, and compare the results with your paper (you should get 1 2 5 3 4 8 6 7, then 2 3 5 7 4 8 6).',
        'Add step 3 and change the list of sizes to [31, 255, 2047]. Write down the swap counts for both builds and say, in one sentence, which one grows faster and why.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain your swap counts in plain words, then check whether its explanation says that most items in a heap are near the bottom.'] },
      { audience: { min: 'advanced' }, steps: ['Run both builds on an ascending array, a descending array and a shuffled one of 1,023 values, and explain from the swap counts which input each build finds hardest and why.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-40',
    day: 40,
    title: 'Heap Sort and Priority Queue Applications',
    summary: 'Sort an array in place with a heap, wrap a heap into a priority queue that works on any records, and use it for scheduling, top-k and merging.',
    minutes: 30,
    skills: ['trees-heaps', 'choose-structure'],
    intro: {
      objectives: [
        'Trace heap sort and state its time and space cost',
        'Build a priority queue on a heap with a comparison function, including a tie-breaker',
        'Use a size-k heap to find the k largest items without sorting everything',
        'Recognise a heap-shaped problem: scheduling, top-k and merging sorted lists',
      ],
      why: 'A priority queue is one of the most reused ideas in software, from schedulers to search engines. With a heap behind it you can state what each operation costs and say when a heap is the right tool and when it is not.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'You now have a heap that gives you the top item in O(1) and repairs itself in O(log n). This lesson puts it to work in two ways. First, repeatedly taking the top out of a heap hands you the values in order, which is a sorting algorithm, **heap sort**, that needs no second array. Second, wrapping the heap in a small class gives you a **priority queue**, the abstract idea from the lesson on queues (a queue where the most urgent item leaves first), now with real costs behind it. Then we look at three jobs where a heap is the natural answer: scheduling, finding the top k, and merging sorted lists.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A hospital emergency room does not treat people in the order they arrive. A patient who arrives last with a serious problem is seen first, and among equally urgent patients the one who has waited longest goes first. The waiting room is a priority queue. For heap sort, imagine a nurse who repeatedly picks the most urgent patient from the room and writes the names in a log from the bottom of the page upwards: when the room is empty, the page is in order. The picture is honest about the main limit as well. In a real room a patient\'s urgency can get worse while they wait. A plain heap cannot change the priority of an item that is already inside without extra help, as the depth note below explains.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: '**Heap sort** has two phases. Phase 1: heapify the array into a **max-heap** (the largest on top, the mirror image of what we built). Phase 2: repeat until one item is left. Swap the root, the largest, with the last item of the heap part of the array, then shrink the heap part by one, so the largest now sits just after it in its final place, and sift the new root down. The heap part gets shorter from the right and the sorted part grows from the right. We use a max-heap because the largest value must go to the last position, and the last position is what the heap gives up first.',
      },
      {
        type: 'paragraph',
        text: 'The cost: heapify is O(n). Then there are n - 1 rounds, each a sift down of O(log n), so phase 2 is O(n log n) and the total is **O(n log n) in the best, average and worst case**. All the work happens inside the original array, so the extra space is **O(1)**. Heap sort is **not stable**: records with equal keys can end up in a different order than they started, because the swaps jump over items. The sorting module compares heap sort with merge sort and quick sort, which win in different ways.',
      },
      {
        type: 'paragraph',
        text: 'A **priority queue** is an abstract idea: push an item, peek at the most urgent, pop the most urgent. A heap is its usual implementation. Real items are records such as tasks, not bare numbers, so the queue takes a **comparison function** as input. `compare(x, y)` returns a negative number when `x` should leave before `y`, a positive number when it should leave after, and 0 when they tie. This is the same convention the built-in `sort` uses; the sorting module explains it fully. A min-heap of urgencies is `(x, y) => x - y`, and a max-heap is `(x, y) => y - x`.',
      },
      {
        type: 'paragraph',
        text: 'One more rule matters in real schedulers: **ties**. A heap promises only that the top is the most urgent, not what happens among equals, so equal-priority tasks can come out in a surprising order. The fix is to build the tie-break into the comparison: priority first, then due date, then the order of arrival.',
      },
      {
        type: 'table',
        headers: ['Application', 'What the heap holds', 'Cost'],
        rows: [
          ['Task scheduling', 'All waiting tasks, most urgent on top', 'O(log n) per task added or started'],
          ['Top k of n items (the k largest)', 'A min-heap of the k best so far; its top is the weakest of them', 'O(n log k) time, O(k) extra space'],
          ['Merging k sorted lists', 'One front item per list; pop the smallest, push that list\'s next item', 'O(N log k) for N items in total'],
        ],
        caption: 'Three jobs a heap fits. In each, the program keeps asking "what is the best item right now?" while items change.',
      },
      { type: 'visual', id: 'heap-operations', caption: 'Switch to heap sort and watch the sorted part grow from the right while the heap part shrinks. Count the swaps for 8 values, then for the biggest size the visual offers.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: heap sort first arranges the numbers so the biggest is on top. Then it takes the biggest and puts it in the last place of the list, arranges what is left so the next biggest is on top, and puts that in the second-to-last place. It keeps going until nothing is left, and the list is in order from the smallest to the biggest. A priority queue is like a ticket machine with a smarter rule: instead of "who came first", the next person called is "who is most urgent", and if two are equally urgent, the one that has waited longer. The code below uses a comparison function to say what "most urgent" means.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: heap sort. `siftDownMax` is the sift down from the last lesson with both comparisons flipped, and it takes a `size` so that the sorted part at the right end is left alone.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Heap sort in place',
        code: `function swap(a, i, j) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function siftDownMax(a, i, size) {
  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let biggest = i;
    if (left < size && a[left] > a[biggest]) biggest = left;
    if (right < size && a[right] > a[biggest]) biggest = right;
    if (biggest === i) break;
    swap(a, i, biggest);
    i = biggest;
  }
}

function heapSort(a) {
  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDownMax(a, i, n);
  for (let end = n - 1; end > 0; end--) {
    swap(a, 0, end);
    siftDownMax(a, 0, end);
  }
}

const data = [9, 4, 7, 1, 6, 2, 8, 3, 5];
heapSort(data);
console.log(data.join(' ')); // 1 2 3 4 5 6 7 8 9`,
      },
      { type: 'paragraph', text: 'Step 2: a priority queue on a heap. It is the heap from the last lesson inside a class, with `compare` in place of `<`. Classes are the blueprints from the linked list lesson: one class, one array, five methods.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'A priority queue with a comparison function',
        code: `class PriorityQueue {
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  push(value) {
    this.items.push(value);
    this.siftUp(this.items.length - 1);
  }

  pop() {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  siftUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.items[parent], this.items[i]) <= 0) break;
      this.swap(parent, i);
      i = parent;
    }
  }

  siftDown(i) {
    const size = this.items.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let first = i;
      if (left < size && this.compare(this.items[left], this.items[first]) < 0) first = left;
      if (right < size && this.compare(this.items[right], this.items[first]) < 0) first = right;
      if (first === i) break;
      this.swap(i, first);
      i = first;
    }
  }

  swap(i, j) {
    const temp = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = temp;
  }
}`,
      },
      { type: 'paragraph', text: 'Step 3: a task scheduler. The comparison says: lower priority number first, then earlier due date, then the lower id (which is the order the tasks were created in).' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Scheduling tasks (continues step 2)',
        code: `function compareTasks(x, y) {
  if (x.priority !== y.priority) return x.priority - y.priority;
  if (x.due < y.due) return -1;
  if (x.due > y.due) return 1;
  return x.id - y.id;
}

const queue = new PriorityQueue(compareTasks);
queue.push({ id: 1, title: 'Pay electric bill', priority: 2, due: '2026-11-20' });
queue.push({ id: 2, title: 'Submit report', priority: 1, due: '2026-11-18' });
queue.push({ id: 3, title: 'Buy rice', priority: 3, due: '2026-11-19' });
queue.push({ id: 4, title: 'Renew registration', priority: 1, due: '2026-11-17' });
queue.push({ id: 5, title: 'Call plumber', priority: 2, due: '2026-11-19' });

console.log(queue.peek().title, queue.size); // Renew registration 5
while (queue.size > 0) {
  const task = queue.pop();
  console.log(task.id, task.title, task.priority, task.due);
}
// 4 Renew registration 1 2026-11-17
// 2 Submit report 1 2026-11-18
// 5 Call plumber 2 2026-11-19
// 1 Pay electric bill 2 2026-11-20
// 3 Buy rice 3 2026-11-19
console.log(queue.pop(), queue.size); // undefined 0`,
      },
      { type: 'paragraph', text: 'Step 4: the k largest items. Keep a min-heap that never holds more than k values: when it grows past k, throw away its smallest.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Top k with a size-k heap (continues step 2)',
        code: `function kLargest(nums, k) {
  const heap = new PriorityQueue((x, y) => x - y);
  for (const num of nums) {
    heap.push(num);
    if (heap.size > k) heap.pop();
  }
  const result = [];
  while (heap.size > 0) result.push(heap.pop());
  return result.reverse();
}

console.log(kLargest([40, 15, 90, 7, 62, 33, 90, 8], 3)); // [ 90, 90, 62 ]
console.log(kLargest([4, 2], 5)); // [ 4, 2 ]
console.log(kLargest([1], 0)); // []`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** The first loop heapifies into a max-heap. The second loop swaps the root (the largest) with `a[end]`, so the largest lands at its final position, then calls `siftDownMax(a, 0, end)`. Passing `end` as the size means the heap part is only indexes 0 to `end - 1`, so the sorted values at the right are never touched.',
          '**Step 2.** `push` and `pop` are the insert and extract of the last lesson, but every `<` has become `this.compare(...) < 0`, so the same code orders numbers, tasks or anything else the comparison understands. `size` is a getter, so the code reads `queue.size` without brackets. An empty queue returns `undefined` from `pop`.',
          '**Step 3.** Tasks 4 and 2 both have priority 1, so the earlier due date decides. Tasks 5 and 1 both have priority 2 and the due date decides again. Task 3 has the largest priority number, so it leaves last, even though it is due before task 1. The `id` line only matters if both priority and due date tie.',
          '**Step 4.** With k = 3, each new number is pushed and, when the heap holds four numbers, its smallest is popped, so the heap always keeps the three largest seen so far. At the end, popping returns them smallest first, so `reverse()` puts the largest first. If k is 0 the heap is emptied after every push; if k is larger than the list, nothing is ever discarded.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Heap sort traced on `[4, 1, 3, 2, 5]`. The vertical bar marks where the sorted part begins. Phase 1 gives the max-heap, and each round after it swaps, shrinks and sifts down:',
      },
      {
        type: 'table',
        headers: ['Step', 'Array', 'Heap part'],
        rows: [
          ['After heapify', '5 4 3 2 1', 'all five values'],
          ['Round 1: swap 5 with the last, sift 1 down', '4 2 3 1 | 5', 'first four'],
          ['Round 2: swap 4 with the last, sift 1 down', '3 2 1 | 4 5', 'first three'],
          ['Round 3: swap 3 with the last, sift 1 down', '2 1 | 3 4 5', 'first two'],
          ['Round 4: swap 2 with the last', '1 | 2 3 4 5', 'first one'],
        ],
        caption: 'The array is sorted when the heap part has one value left.',
      },
      {
        type: 'paragraph',
        text: 'The ties warning, measured. If six tasks of the same priority are pushed with ids 1 to 6 and the comparison looks only at priority, the queue pops them in the order `1 6 5 4 3 2`, not `1 2 3 4 5 6`. That is legal for a heap, since it only promises that the top is minimal, and it is exactly why `compareTasks` ends with the id.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'A heap has no cheap "decrease priority" or "remove this task", because finding the task is O(n). Production schedulers use one of two designs. Keep a Map from task id to array index, update it in every swap, and then change a priority or cancel a task in O(log n) by sifting up or down from that index. Or use lazy deletion: mark the task cancelled in a Set and skip it when it reaches the top, trading memory and some wasted pops for simplicity. Dijkstra\'s algorithm in the graph module is usually written with the second design. In practice, heap sort is rarely the fastest comparison sort on real hardware (its memory access jumps around), and it is not stable; its value is the guaranteed O(n log n) with O(1) extra space. JavaScript has no built-in priority queue, so a class like this, or a vetted library, is what production code uses.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Check an assistant\'s priority queue',
        text: 'I wrote a JavaScript PriorityQueue class that uses a binary min-heap and a compare(x, y) function. I will paste my class below. Review it as a careful reviewer: list any bug or edge case (empty pop, one item, equal priorities, compare returning NaN), and give me the time complexity of push, pop and peek with a one-sentence reason each. Do not rewrite my code. Ask me questions about the places you are unsure of, and ask me to explain why equal-priority tasks might come out in a different order than they were added.',
      },
      {
        type: 'paragraph',
        text: 'Paste your `PriorityQueue` from this lesson after the prompt, or ask the assistant to write its own and then review that one yourself. Look for: `pop` on an empty queue, sift down comparing against both children, and the complexities O(1), O(log n) and O(log n). An assistant may say the heap keeps tasks "sorted", say that equal priorities come out first in, first out, or call heap sort "stable". All three are wrong, and your trace of the tie example above shows why.',
      },
      {
        type: 'takeaways',
        items: [
          'Heap sort heapifies into a max-heap, then repeatedly swaps the root to the end and sifts down. It is O(n log n) in every case, O(1) extra space, and not stable.',
          'A priority queue is the abstract idea (push, peek, pop the most urgent); a heap with a comparison function is its usual implementation: O(1) peek, O(log n) push and pop.',
          'A heap guarantees only the top; equal priorities can come out in any order, so put tie-breakers (due date, then arrival) into the comparison.',
          'Top k of n items: keep a min-heap of size k and drop its smallest when it grows past k. O(n log k) time and O(k) space, and it works on a stream.',
          'A heap cannot search or change a stored item\'s priority quickly without help (an id-to-position Map, or lazy deletion).',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-40-predict-output-1',
          kind: 'predict-output',
          title: 'Follow the heap sort',
          prompt: 'This heap sort prints the array after building the max-heap and after each round. Predict the five lines. Build the max-heap by hand first.',
          concept: 'heap sort trace',
          language: 'javascript',
          code: `function swap(a, i, j) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function siftDownMax(a, i, size) {
  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let biggest = i;
    if (left < size && a[left] > a[biggest]) biggest = left;
    if (right < size && a[right] > a[biggest]) biggest = right;
    if (biggest === i) break;
    swap(a, i, biggest);
    i = biggest;
  }
}

const a = [4, 1, 3, 2, 5];
const n = a.length;
for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDownMax(a, i, n);
console.log(a.join(' '));
for (let end = n - 1; end > 0; end--) {
  swap(a, 0, end);
  siftDownMax(a, 0, end);
  console.log(a.join(' '));
}`,
          expected: '5 4 3 2 1\n4 2 3 1 5\n3 2 1 4 5\n2 1 3 4 5\n1 2 3 4 5',
          choices: [
            '5 4 3 2 1\n4 2 3 1 5\n3 2 1 4 5\n2 1 3 4 5\n1 2 3 4 5',
            '5 4 3 2 1\n4 3 2 1 5\n3 2 1 4 5\n2 1 3 4 5\n1 2 3 4 5',
            '1 2 3 4 5\n1 2 3 4 5\n1 2 3 4 5\n1 2 3 4 5\n1 2 3 4 5',
            '5 4 3 2 1\n1 4 3 2 5\n1 3 2 4 5\n1 2 3 4 5\n1 2 3 4 5',
          ],
          wrongNotes: {
            '5 4 3 2 1\n4 3 2 1 5\n3 2 1 4 5\n2 1 3 4 5\n1 2 3 4 5': 'After round 1 the root is 1 (moved from the end), and it sifts down: its children are 4 and 3, so it swaps with the larger one, 4, and then its only child inside the shorter heap is 2, so it swaps with 2 as well. That gives 4 2 3 1 5, not 4 3 2 1 5.',
            '1 2 3 4 5\n1 2 3 4 5\n1 2 3 4 5\n1 2 3 4 5\n1 2 3 4 5': 'The first line is printed after heapify, which makes a max-heap, not a sorted array. The sorted part only grows from the right, one value per round.',
            '5 4 3 2 1\n1 4 3 2 5\n1 3 2 4 5\n1 2 3 4 5\n1 2 3 4 5': 'The swapped-in value must be sifted down after every swap. Printing the array before the sift down would show that, but the code prints after it, so the 1 does not stay on top.',
          },
          hints: [
            'Heapify [4, 1, 3, 2, 5]: sift down index 1 (value 1, children 2 and 5), then the root (4). The array becomes 5 4 3 2 1.',
            'Round 1 swaps 5 (index 0) with the last value 1. The heap part is now the first four, 1 4 3 2, and 1 sifts down.',
            'In each later round, the new last-in-heap value goes to the root and sifts down inside a shorter heap part.',
          ],
          explanation: 'Heapify gives 5 4 3 2 1. Round 1 swaps 5 and 1 and sifts the 1 down through 4 and 2, giving 4 2 3 1 followed by the finished 5. The next rounds fix 4, then 3, then 2 in the same way. The last printed line is the sorted array.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-40-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the heap sort loops',
          prompt: 'Fill in the three blanks so that heapSort sorts the array from the smallest to the largest. The helper functions are already correct.',
          concept: 'heap sort',
          language: 'javascript',
          code: `function swap(a, i, j) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function siftDownMax(a, i, size) {
  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let biggest = i;
    if (left < size && a[left] > a[biggest]) biggest = left;
    if (right < size && a[right] > a[biggest]) biggest = right;
    if (biggest === i) break;
    swap(a, i, biggest);
    i = biggest;
  }
}

function heapSort(a) {
  const n = a.length;
  for (let i = Math.floor(n / 2) - ___; i >= 0; i--) siftDownMax(a, i, n);
  for (let end = n - 1; end > 0; end--) {
    swap(a, 0, ___);
    siftDownMax(a, 0, ___);
  }
}

const data = [30, 10, 50, 20, 40];
heapSort(data);
console.log(data.join(' '));`,
          blanks: [
            { answers: ['1'], feedback: 'The last parent is the parent of the last element, at index n / 2 rounded down, minus one.' },
            { answers: ['end'], feedback: 'The largest value moves to the last place of the heap part, which is the index end.' },
            { answers: ['end'], feedback: 'After the swap the value at index end is finished, so the heap part must now stop before it.' },
          ],
          bank: ['1', 'end', 'end', 'n', '0'],
          tests: { kind: 'output', expected: ['10 20 30 40 50'] },
          hints: [
            'Where is the last parent? Check with n = 5: its children are at 3 and 4, so the last parent is at index 1.',
            'Round by round, the root is swapped with the last place of the heap part; end counts down from n - 1.',
            'The answers are 1, end and end.',
          ],
          explanation: 'The last parent has index Math.floor(n / 2) - 1, and sifting down from there to 0 builds the max-heap. In every round the root, the largest of the heap part, is swapped to index end, and the heap part is shrunk to indexes 0 to end - 1 by passing end as the size.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-40-scenario-1',
          kind: 'scenario',
          title: 'The top 10 of a live stream',
          prompt: 'Choose how to keep the ten highest scores.',
          concept: 'choosing a structure for top-k',
          situation: 'A school quiz game receives about a million scores a day, one at a time, and the board shows only the ten highest scores so far. The server has little memory, and each new score must be handled as it arrives.',
          options: [
            { text: 'A min-heap that never holds more than 10 scores: push the new score and, if the heap is larger than 10, pop its smallest.', consequence: 'Each score costs O(log 10), a handful of steps, and the server only ever stores 10 values. The top of the heap is the lowest score still on the board, which is what a new score must beat.', quality: 'best' },
            { text: 'A sorted array of the best 10, inserting a new score by shifting.', consequence: 'This also works and keeps only 10 values. Each insert shifts up to 10 items, which is fine for k = 10 but would become slow if the board showed the top 100,000.', quality: 'acceptable' },
            { text: 'Store every score in an array and sort the whole array each time one arrives.', consequence: 'A million scores sorted again and again is far too slow, and it keeps every score in memory when only ten matter.', quality: 'poor' },
            { text: 'Store every score in a Map and count them.', consequence: 'A Map answers "how many times did this score occur?", not "which are the highest ten?". Finding the top ten would still require scanning or sorting everything.', quality: 'poor' },
          ],
          hints: [
            'How many values does the server really need to remember?',
            'When a new score arrives, which single value on the board is the one it has to beat?',
            'Which structure gives you that value in O(1) and replaces it in O(log k)?',
          ],
          explanation: 'Only the best k values can ever matter, and the weakest of them is the one a newcomer must beat. A min-heap of size k keeps exactly that on top. The cost is O(log k) per item, O(n log k) overall, with O(k) memory. A sorted array of 10 is acceptable at this size, but the heap keeps working when k grows.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-40-code-challenge-1',
          kind: 'code-challenge',
          title: 'Top k without sorting everything',
          prompt: 'Write kLargest(nums, k): the k largest numbers, largest first, using the PriorityQueue that is already in the starter code. Use a min-heap that never holds more than k numbers. (A sort-and-slice would pass the tests, but it keeps all n numbers in memory and does O(n log n) work. The heap version keeps only k.) Do not change the input.',
          concept: 'top-k with a size-k heap',
          language: 'javascript',
          starter: `class PriorityQueue {
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(value) {
    this.items.push(value);
    this.siftUp(this.items.length - 1);
  }

  pop() {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  siftUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.items[parent], this.items[i]) <= 0) break;
      this.swap(parent, i);
      i = parent;
    }
  }

  siftDown(i) {
    const size = this.items.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let first = i;
      if (left < size && this.compare(this.items[left], this.items[first]) < 0) first = left;
      if (right < size && this.compare(this.items[right], this.items[first]) < 0) first = right;
      if (first === i) break;
      this.swap(i, first);
      i = first;
    }
  }

  swap(i, j) {
    const temp = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = temp;
  }
}

function kLargest(nums, k) {
  // keep a min-heap of at most k numbers, then return them largest first
}`,
          tests: {
            kind: 'function',
            fn: 'kLargest',
            cases: [
              { label: 'kLargest([40, 15, 90, 7, 62, 33, 90, 8], 3)', args: [[40, 15, 90, 7, 62, 33, 90, 8], 3], expected: [90, 90, 62] },
              { label: 'k larger than the list', args: [[4, 2], 5], expected: [4, 2] },
              { label: 'k = 0', args: [[1], 0], expected: [] },
              { label: 'an empty list', args: [[], 3], expected: [] },
              { label: 'k = 1 on a short list', args: [[3, 9, 4], 1], expected: [9] },
              {
                label: 'a hidden case with 30 numbers',
                args: [[0, 17, 3, 20, 6, 23, 9, 26, 12, 29, 15, 1, 18, 4, 21, 7, 24, 10, 27, 13, 30, 16, 2, 19, 5, 22, 8, 25, 11, 28], 4],
                expected: [30, 29, 28, 27],
                hidden: true,
              },
            ],
          },
          solution: `class PriorityQueue {
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(value) {
    this.items.push(value);
    this.siftUp(this.items.length - 1);
  }

  pop() {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  siftUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.items[parent], this.items[i]) <= 0) break;
      this.swap(parent, i);
      i = parent;
    }
  }

  siftDown(i) {
    const size = this.items.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let first = i;
      if (left < size && this.compare(this.items[left], this.items[first]) < 0) first = left;
      if (right < size && this.compare(this.items[right], this.items[first]) < 0) first = right;
      if (first === i) break;
      this.swap(i, first);
      i = first;
    }
  }

  swap(i, j) {
    const temp = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = temp;
  }
}

function kLargest(nums, k) {
  const heap = new PriorityQueue((x, y) => x - y);
  for (const num of nums) {
    heap.push(num);
    if (heap.size > k) heap.pop();
  }
  const result = [];
  while (heap.size > 0) result.push(heap.pop());
  return result.reverse();
}`,
          hints: [
            'Make a PriorityQueue whose comparison is (x, y) => x - y, so the smallest number is on top.',
            'For every number: push it, and when heap.size is greater than k, pop once. The popped value is the smallest of the k + 1.',
            'At the end, pop everything into an array (smallest first) and reverse it.',
          ],
          explanation: 'The min-heap of size k always holds the k largest numbers seen so far. When a (k + 1)-th number arrives, the smallest of them cannot be among the k largest, so it is popped. Each number costs O(log k), so the total is O(n log k) time and O(k) extra space. Popping the survivors gives them smallest first, so the result is reversed.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-40-q1',
        prompt: 'Which statement about heap sort is correct?',
        choices: ["It is O(n) when the input is already sorted, in the same way as insertion sort", "It is O(n log n) in every case and sorts in place, but it is not stable", "It needs a second array of size n to hold the sorted output, like merge sort does", "It is stable, because equal values are never swapped with each other"],
        answer: 1,
        explanation: 'Heapify costs O(n) and then n - 1 sift downs cost O(log n) each, whatever the input, all inside the original array. The swaps between the root and the end jump over other values, so equal keys can change order.',
      },
      {
        id: 'data-structures-algorithms-40-q2',
        prompt: 'In heap sort that sorts ascending, why does the algorithm build a max-heap instead of a min-heap?',
        choices: ["The largest value must end at the last position, and a max-heap keeps it at the root", "A max-heap is cheaper to build than a min-heap, which is why heap sort always chooses it", "A min-heap cannot be stored in an array, only a max-heap can be laid out that way", "Sift down only works correctly on a max-heap and never on a min-heap"],
        answer: 0,
        explanation: 'Each round moves the current root to the end of the heap part. With a max-heap the root is the largest remaining value, so the array fills from the right with the largest values in order.',
      },
      {
        id: 'data-structures-algorithms-40-q3',
        prompt: 'You need the 100 best-selling products from a stream of 5 million sales records, one record at a time. What does the size-k heap approach cost?',
        choices: ["O(n log n) time and O(n) memory, the same as sorting everything first", "O(k log n) time and O(n) memory, because the heap must hold every record", "O(n log k) time and O(k) memory", "O(n) time and O(1) memory, because only one value is compared each time"],
        answer: 2,
        explanation: 'Each of the n items costs one push and at most one pop on a heap of at most k + 1 items, which is O(log k), and the heap holds only k values. That is why it also works on a stream you cannot store.',
      },
      {
        id: 'data-structures-algorithms-40-q4',
        prompt: 'Two support tickets have the same priority. Your queue sometimes serves the newer one first. What is the right fix?',
        choices: ["Add a second heap that holds only the equal-priority tickets and serve those first", "Re-sort the whole heap after every push so that equals settle into order", "Use a max-heap instead of a min-heap so that newer tickets lose", "Break the tie in the comparison, for example by creation time or arrival number"],
        answer: 3,
        explanation: 'A heap makes no promise about equals. Putting a tie-breaker in the comparison makes the order total, without changing the O(log n) costs.',
      },
      {
        id: 'data-structures-algorithms-40-q5',
        audience: { max: 'beginner' },
        prompt: 'What is the difference between a normal queue and a priority queue?',
        choices: ["A normal queue serves the oldest item first; a priority queue serves the most urgent", "A priority queue can hold more items than a normal queue, which is the only difference", "A normal queue is always kept sorted, while a priority queue is never sorted at all", "There is no difference, because both are names for the same first in, first out line"],
        answer: 0,
        explanation: 'A queue is first in, first out. A priority queue ignores arrival order and serves whatever the comparison says is most urgent, with ties broken by another rule such as arrival.',
      },
      {
        id: 'data-structures-algorithms-40-q6',
        audience: { min: 'advanced' },
        prompt: 'A job queue built on a heap must let users cancel a job by id. Cancelling is slow in a profile. What is the best fix that keeps the heap?',
        choices: ["Scan the heap array for the id and splice that entry out of the array, then rebuild the heap", "Keep a Map from id to heap position, updated on every swap, so removal is O(log n)", "Replace the heap with a linked list so that removing a job takes only O(1) work", "Sort the heap again after each cancel so that cancelled jobs fall to the end"],
        answer: 1,
        explanation: 'Finding an item in a heap is O(n), and splice on the array then shifts items and breaks the heap shape. A position Map gives O(log n) removal, and lazy deletion avoids the search entirely at the cost of carrying dead entries until they surface.',
      },
    ],
    task: {
      title: 'Your own scheduler and top 3',
      minutes: 20,
      steps: [
        'In any free JavaScript environment, paste the PriorityQueue class and compareTasks from this lesson. Add six tasks of your own (use your real chores) with priorities 1 to 3, and print them in the order they would be done.',
        'Change compareTasks so that priority is compared first and the earlier due date second, then remove the id line and add two tasks with the same priority and due date. Notice whether the order of those two changes when you add them in a different sequence. Put the id line back.',
        'Paste kLargest, write a list of 12 numbers (your daily spending, for example), and print the 3 largest. Then write the same thing as a sort followed by a slice and check that both give the same answer. Write one sentence on what the heap version saves.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain in plain words why heap sort uses a max-heap to sort from smallest to largest, then check its explanation against the heap sort trace in this lesson.'] },
      { audience: { min: 'advanced' }, steps: ['Add a Map from task id to heap position to PriorityQueue and implement remove(id) in O(log n). Test it by removing the root, a middle item and the last item, and check the heap property after each removal.'] },
    ],
  },
];

export const project: Project = {
  id: 'data-structures-algorithms-p8',
  title: 'A task scheduler that always does the urgent thing first',
  summary: 'Build a priority queue on a binary heap and use it to schedule tasks by priority, due date and arrival order, then measure what it saves over keeping a sorted array.',
  outcome: 'A small, tested scheduler built on a heap you wrote yourself, with measured operation counts and a written explanation of the cost of every operation, which is proof you can choose and justify a priority queue.',
  unlockAfterDay: 40,
  steps: [
    { id: 'data-structures-algorithms-p8-s1', text: 'Write down the shape of a task (id, title, priority from 1 to 3, due date as a string like "2026-11-20", and an arrival number) and create at least 10 sample tasks, with several that share a priority and at least two that share both priority and due date.' },
    { id: 'data-structures-algorithms-p8-s2', audience: { max: 'beginner' }, text: 'Start from the PriorityQueue class in lesson 40. Read it line by line and write a one-line comment above each method saying what it does. Change only the comparison function, so it orders by priority, then due date, then arrival number.' },
    { id: 'data-structures-algorithms-p8-s3', audience: { min: 'intermediate' }, text: 'Write your own PriorityQueue class from a blank file (a binary min-heap in an array with a comparison function, push, pop, peek and size), without copying the lesson code. Compare it with the lesson version afterwards.' },
    { id: 'data-structures-algorithms-p8-s4', text: 'Write addTask(task), nextTask() (look without removing), completeNext() (remove and return) and runAll() (print every task in the order it would be done). Keep the queue and these functions separate, so the queue knows nothing about tasks except what the comparison says.' },
    { id: 'data-structures-algorithms-p8-s5', text: 'Add a counter of swaps to the queue and print it for 10, 100 and 1,000 tasks pushed in a bad order (most urgent last). Write the same scheduler on a sorted array that inserts by shifting, count the shifts, and compare the two numbers. Do not time anything: count.' },
    { id: 'data-structures-algorithms-p8-s6', text: 'Test the edge cases and print the result of each: completeNext on an empty queue, a queue with one task, tasks with equal priority and due date (they must come out in arrival order), and tasks added while others are being completed.' },
    { id: 'data-structures-algorithms-p8-s7', audience: { min: 'advanced' }, text: 'Add cancel(id) and changePriority(id, priority) in O(log n), using a Map from task id to heap position that every swap keeps up to date. Add a check function that confirms the heap property after every operation in your tests.' },
    { id: 'data-structures-algorithms-p8-s8', text: 'Write the explanation: which structure you chose and why, the cost of push, peek, pop and building from n tasks, what the heap cannot do, and how your tie-breaking works.' },
  ],
  submission: {
    kind: 'text',
    label: 'Your code and your explanation',
    placeholder: 'Paste your PriorityQueue class, your scheduler functions, the output of your runAll and your operation counts, then your written explanation.',
    hint: 'Include: the code that runs, the printed order of your sample tasks, the swap and shift counts for 10, 100 and 1,000 tasks, the edge-case results, and a short explanation of the costs and trade-offs in your own words.',
  },
  rubric: [
    'Correctness: tasks come out by priority, then due date, then arrival order, and the edge cases (empty queue, one task, ties) behave sensibly.',
    'Structure: the heap is a real binary heap in an array (sift up on push, sift down on pop), not a sort of the whole array on every operation.',
    'Efficiency: operation counts for several sizes are shown and match what O(log n) per operation and O(n) per sorted-array insert predict.',
    'Code organization: the queue is separate from the task logic, names are clear, and each function does one job.',
    'Explanation: the learner states each operation\'s cost, why a heap was chosen over a sorted array, and what a heap cannot do.',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The learner can explain, in their own words, what sift up and sift down do on one traced example of their own data.'] },
    { audience: { min: 'advanced' }, items: ['cancel and changePriority run in O(log n) with a position Map, and tests show the heap property still holds after every operation.', 'The explanation discusses a trade-off beyond the basics (lazy deletion versus a position map, or the cost of ties).'] },
  ],
};
