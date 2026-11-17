import type { Lesson, Project } from '../../../types';

const CHECKED = '2026-11-16';

// Every page below was opened on CHECKED.
const DOCS = {
  mdnShift: { label: 'MDN: Array.prototype.shift()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift' },
};

export const lessons: Lesson[] = [
  {
    id: 'data-structures-algorithms-24',
    day: 24,
    title: 'What Queues Are: FIFO, Enqueue and Dequeue',
    summary: 'Keep things in the order they arrived: add at the back, remove from the front, and see why that promise is useful.',
    intro: {
      objectives: [
        'Explain first in, first out (FIFO) and name the operations enqueue, dequeue, peek, isEmpty and size',
        'Build a simple queue on top of an array and trace what it holds after each operation',
        'Choose between a queue and a stack for a real situation',
        'Say which operation of the array-backed queue is slow in our cost model, and why',
      ],
      why: 'Almost every app has a waiting line somewhere: messages to send, files to upload, jobs for a printer. If you can recognise a queue, you can ask an AI for the right structure, and you can tell when generated code quietly breaks the order of arrival.',
    },
    minutes: 25,
    skills: ['linked-structures', 'choose-structure'],
    body: [
      { type: 'paragraph', text: "You have met the stack, where the last thing in is the first thing out. This lesson is about its mirror image. A **queue** keeps things in the order they arrived: whoever has waited longest is served next. That one rule is behind print jobs, the messages your phone sends one after another, files waiting to upload, and the lines at a clinic or a jeepney terminal. Learning it well also prepares you for the rest of this module, because the next lessons make queues faster, give them two ends, and add priorities." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Think of the line at a barangay health center. You arrive and stand at the back. The nurse calls the person at the front. Nobody is served out of turn, and nobody walks into the middle of the line. The first person to arrive is the first person to leave, which is why a queue is called **FIFO**: first in, first out." },
      { type: 'paragraph', text: "Where the picture stops working: real people leave the line, cut in, or swap places with a friend. A queue in a program is stricter. You may only add at the back and only remove from the front, and that strictness is exactly what makes it useful and easy to make fast." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "A queue is an **abstract data type** (module 1): a description of what you can do, not of how it is stored. The two ends have names. Things join at the **back** and leave from the **front**. The operations are small:" },
      {
        type: 'table',
        headers: ['Operation', 'What it does', 'On an empty queue (in our version)'],
        rows: [
          ['enqueue(value)', 'Adds value at the back of the line', 'Works: the value becomes the front and the back'],
          ['dequeue()', 'Removes the front value and gives it back', 'Returns undefined'],
          ['peek()', 'Shows the front value and removes nothing', 'Returns undefined'],
          ['isEmpty()', 'Says whether anyone is waiting', 'true'],
          ['size()', 'Counts how many are waiting', '0'],
        ],
        caption: 'The five operations of a queue. Returning undefined for an empty queue is a choice we make; throwing an error is another valid choice.',
      },
      { type: 'paragraph', text: "Why only the two ends? Because a promise about order is only worth something if nothing can break it. A queue that let you pull items out of the middle would no longer guarantee that the item waiting longest goes next. The stack made the opposite promise with the same two-ends idea: it adds and removes at the same end, so the newest item leaves first. Queue and stack differ in one thing only: which end the removal happens at." },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a queue is a line. You put new things at the end of the line and take things from the start of the line. `enqueue` means \"join the line\". `dequeue` means \"the first one leaves\". `peek` means \"who is first? just look\". The order never changes, so if Nena joined before Ben, Nena always leaves before Ben. A computer keeps such a line in a list (an array) and has to be careful to add and remove at the right ends." },
      { type: 'visual', id: 'queue-fifo', caption: 'Press Next to enqueue and dequeue. Watch which end the new value joins and which end leaves, and read the caption after each step.' },
      { type: 'paragraph', text: "Now the cost. The goal is that every queue operation takes the same small amount of work however long the line is, which is O(1) (module 2). Each operation only touches an end, so that should be possible. With a plain JavaScript array, adding at the back with `push` is O(1) amortized (module 3). But removing from the front with `shift` makes every remaining item slide one place left, so in the model we use it costs O(n), where n is the number of waiting items. JavaScript engines may be smart about this in practice, and MDN's own wording says `shift()` shifts all values left by one, so we count it the honest, simple way. The next lesson shows how to make dequeue O(1)." },
      { type: 'version', text: "MDN's page for Array.prototype.shift() describes the method as shifting all values to the left by one and removing the first element, and says it returns undefined when the array is empty. That is the behaviour the array-backed queue below relies on. MDN gives no time complexity, so O(n) here is the cost in the model this course uses, not a promise about any engine.", checked: CHECKED, sources: [DOCS.mdnShift] },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "In a real system the interesting questions around a queue are about its edges. An unbounded in-memory queue is a memory leak waiting for a busy day: if producers enqueue faster than consumers dequeue, the queue grows without limit. The usual remedies are a bounded queue plus a policy for when it is full (reject, drop the oldest, or make the producer wait, which is called back-pressure), and metrics on length and age of the oldest item. Also decide the empty-queue contract once: returning undefined is simple but cannot tell an empty queue from a queue that holds undefined, so many libraries return a sentinel or throw." },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "Start with a plain array used as a line. `push` joins the back and `shift` removes the front." },
      {
        type: 'code',
        language: 'javascript',
        label: 'An array used as a line',
        code: `const line = [];
line.push('Aling Nena');
line.push('Mang Ben');
line.push('Ate Joy');
console.log(line.shift());
console.log(line);
console.log(line.length);`,
      },
      { type: 'paragraph', text: "That works, but nothing stops another part of the program from doing `line.pop()` or `line.splice(1, 0, 'Cutter')` and breaking the order. A class (a blueprint that creates objects with the same shape and methods, from module 5) fixes that by offering only the queue operations." },
      {
        type: 'code',
        language: 'javascript',
        label: 'A Queue class on top of an array',
        code: `class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(value) {
    this.items.push(value);
  }
  dequeue() {
    return this.items.shift();
  }
  peek() {
    return this.items[0];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
}

const clinic = new Queue();
clinic.enqueue('Aling Nena');
clinic.enqueue('Mang Ben');
clinic.enqueue('Ate Joy');
console.log(clinic.peek());
console.log(clinic.dequeue());
console.log(clinic.dequeue());
console.log(clinic.size());
console.log(clinic.dequeue());
console.log(clinic.dequeue());
console.log(clinic.isEmpty());`,
      },
      { type: 'paragraph', text: "Now use it the way a real program does: people arrive, and every second arrival a nurse serves someone. (`console.log` with two values prints them with a space between.)" },
      {
        type: 'code',
        language: 'javascript',
        label: 'Arrivals and serving, using the Queue class above',
        code: `const waiting = new Queue();
const arrivals = ['Nena', 'Ben', 'Joy', 'Rico', 'Lita'];
let count = 0;
for (const name of arrivals) {
  waiting.enqueue(name);
  count++;
  if (count % 2 === 0) {
    console.log('Served', waiting.dequeue(), '-', waiting.size(), 'still waiting');
  }
}
while (!waiting.isEmpty()) {
  console.log('Served', waiting.dequeue());
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          'The first block: three `push` calls build the line `Aling Nena, Mang Ben, Ate Joy`. `shift()` removes and returns `Aling Nena`, leaving two names, so it prints `Aling Nena`, the array with two names, then `2`.',
          'The Queue class prints `Aling Nena` for `peek()` (nothing removed), then `Aling Nena` and `Mang Ben` for the two dequeues, then `1` for the size. The next `dequeue` returns `Ate Joy`, and the one after it hits an empty array, so `shift()` gives `undefined`. `isEmpty()` is `true`.',
          'In the arrivals program the line is checked after every arrival. After Nena and Ben the count is 2, so Nena is served. After Joy and Rico the count is 4 and Ben is served. Lita joins last. The `while` loop then serves whoever is left, in arrival order.',
        ],
      },
      {
        type: 'table',
        headers: ['Event', 'Queue after it (front on the left)', 'Printed'],
        rows: [
          ['enqueue Nena', 'Nena', ''],
          ['enqueue Ben, then serve (count 2)', 'Ben', 'Served Nena - 1 still waiting'],
          ['enqueue Joy', 'Ben, Joy', ''],
          ['enqueue Rico, then serve (count 4)', 'Joy, Rico', 'Served Ben - 2 still waiting'],
          ['enqueue Lita', 'Joy, Rico, Lita', ''],
          ['the while loop', 'empty', 'Served Joy, Served Rico, Served Lita'],
        ],
        caption: 'A trace of the arrivals program: what the queue holds after each event.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Use any AI assistant you have. The aim is for it to test your thinking, so ask it to quiz you rather than to hand over answers." },
      { type: 'prompt', label: 'Queue or stack?', text: "I am learning queues in JavaScript. Give me five everyday or app situations, one at a time, and for each one ask me whether a queue or a stack fits and why. Do not give me the answer. Wait for my reply, tell me if I am right, and if I am wrong give me a hint before the answer." },
      { type: 'prompt', label: 'Trace a queue', text: "Write a short JavaScript snippet that uses an array as a queue with push and shift, with about six operations. Do not show the output. Ask me what the array holds after each line. Check my answers and explain any mistake in plain words. Then ask me which of the two operations is slower for a very long array, and wait for my answer." },
      { type: 'paragraph', text: "What to look for: the assistant should ask you questions and wait. One way it can mislead you is by saying a queue's dequeue is always O(1) because that is what a queue is meant to give. For the array-backed version above that is not true in our model, because `shift` slides the other items. Check any complexity claim against the code, not against the name of the structure." },
      {
        type: 'takeaways',
        items: [
          'A queue is first in, first out (FIFO): items join at the back and leave from the front, so arrival order is kept.',
          'The operations are enqueue, dequeue, peek, isEmpty and size; a queue offers no way to reach the middle.',
          'A stack and a queue use the same two-ends idea; they differ in which end removal happens at.',
          'An array-backed queue is easy to write, but its dequeue (shift) is O(n) in the model we use. Enqueue by push is O(1) amortized.',
          'Decide what an empty queue does when you dequeue (here: undefined) and keep to it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-24-predict-output-1',
          kind: 'predict-output',
          title: 'Follow the line',
          prompt: 'Predict exactly what this program prints. Keep track of what the array holds after every line.',
          concept: 'queue operations',
          language: 'javascript',
          code: `const q = [];
q.push('A');
q.push('B');
q.push('C');
console.log(q.shift());
q.push('D');
console.log(q.shift());
console.log(q[0]);
console.log(q.length);`,
          choices: ['A\nB\nC\n2', 'A\nB\nB\n3', 'C\nD\nC\n2', 'A\nB\nD\n2'],
          wrongNotes: {
            'A\nB\nB\n3': 'After the second shift, B has left the line, so it cannot still be at the front, and only two letters are left.',
            'C\nD\nC\n2': 'shift removes from the front, and the front is the oldest item, A, not the newest.',
            'A\nB\nD\n2': 'D joined at the back, behind C. The front after two shifts is C.',
          },
          hints: ['Write the array after each line: after the three pushes it is A, B, C.', 'shift removes from the front, so the first print is the oldest item. Then D joins the back.', 'After the second shift only C and D are left, and q[0] is the front of the line.'],
          explanation: 'The array is A,B,C. shift returns A (now B,C). D joins the back (B,C,D). shift returns B (now C,D). q[0] is C, the front, and two items are left.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-24-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the Queue',
          prompt: 'Fill in the three blanks so the queue works first in, first out. The program should print 1, false, 2, true.',
          concept: 'implementing a queue',
          language: 'javascript',
          code: `class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(value) {
    this.items.___(value);
  }
  dequeue() {
    return this.items.___();
  }
  isEmpty() {
    return this.items.length ___ 0;
  }
}
const q = new Queue();
q.enqueue(1);
q.enqueue(2);
console.log(q.dequeue());
console.log(q.isEmpty());
console.log(q.dequeue());
console.log(q.isEmpty());`,
          blanks: [
            { answers: ['push'], feedback: 'New values join the back of the array, and the back of an array is where push adds.' },
            { answers: ['shift'], feedback: 'The value that leaves is the one at the front, index 0. Which array method removes the first item?' },
            { answers: ['==='], feedback: 'A queue is empty when it holds zero items, so compare the length with 0 for equality.' },
          ],
          bank: ['push', 'pop', 'shift', 'unshift', '===', '>', '!=='],
          tests: { kind: 'output', expected: ['1', 'false', '2', 'true'] },
          hints: ['Enqueue adds at the back. Which array method adds to the end?', 'Dequeue removes the oldest item, which sits at the front of the array.', 'isEmpty must be true only when the length equals 0.'],
          explanation: 'push adds at the back, shift removes the front, and a length equal to 0 means empty. With those three the first value in (1) is the first value out.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-24-fix-bug-1',
          kind: 'fix-bug',
          title: 'Served in the wrong order',
          prompt: 'The clinic should serve Nena, then Ben, then Joy. Instead the newest person is served first. Tap the faulty line, then choose the fix.',
          concept: 'FIFO order',
          language: 'javascript',
          code: `class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(value) {
    this.items.push(value);
  }
  dequeue() {
    return this.items.pop();
  }
}
const q = new Queue();
q.enqueue('Nena');
q.enqueue('Ben');
q.enqueue('Joy');
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());`,
          bugLine: 9,
          fixes: [
            { line: '    return this.items.shift();', correct: true, why: 'shift removes and returns the front item, the one that has waited longest, so the order is first in, first out.' },
            { line: '    return this.items[0];', correct: false, why: 'This only looks at the front. It never removes it, so the same name would be printed three times.' },
            { line: '    return this.items.pop();', correct: false, why: 'This is the original line: pop removes from the back, which is how a stack behaves.' },
          ],
          tests: { kind: 'output', expected: ['Nena', 'Ben', 'Joy'] },
          hints: ['Which end of the array does pop take from? Which person is that?', 'A queue must remove from the opposite end to where it adds.', 'enqueue uses push, which adds at the back, so dequeue must remove at the front.'],
          explanation: 'The queue adds with push at the back, so it must remove at the front with shift. Using pop removes the newest item, which turns the queue into a stack.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-24-scenario-1',
          kind: 'scenario',
          title: 'Which structure for the uploads?',
          prompt: 'Pick the structure that fits.',
          concept: 'choosing a queue',
          situation: 'A photo app lets people tap many photos to upload while the signal is weak. Photos should be sent one at a time, and the photo that has been waiting the longest must be sent next, so nobody sees an old photo stuck forever.',
          options: [
            { text: 'A queue: add each new photo at the back and send from the front.', consequence: 'Correct. Arrival order is kept and the oldest waiting photo always goes next.', quality: 'best' },
            { text: 'A stack: add each new photo on top and send the top one.', consequence: 'The newest photo would always jump ahead, so under a weak signal an old photo could wait for ever.', quality: 'poor' },
            { text: 'A Set of photo names, sent in whatever order the Set gives them.', consequence: 'A Set removes duplicates but says nothing useful about who waited longest, so it does not guarantee the order you need.', quality: 'acceptable' },
          ],
          hints: ['What order must the photos leave in?', 'Which structure removes the item that arrived first?', 'The stack removes the newest item, the opposite of what is wanted.'],
          explanation: 'Whenever the rule is "the one that waited longest goes next", that is first in, first out, and a queue is the structure that promises it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-24-match-1',
          kind: 'match',
          title: 'Bakery line, queue operation',
          prompt: 'A bakery uses a numbered line. Match each moment to the queue operation it is.',
          concept: 'queue operations',
          labels: { terms: 'At the bakery', meanings: 'Queue operation' },
          pairs: [
            { term: 'A new customer joins the end of the line', definition: 'enqueue' },
            { term: 'The cashier calls the customer who has waited longest', definition: 'dequeue' },
            { term: 'The cashier glances at who is first without calling them', definition: 'peek' },
            { term: 'The owner checks if anyone is waiting before closing', definition: 'isEmpty' },
          ],
          hints: ['One of them changes the line by adding someone, one by removing someone. The other two change nothing.', 'The two that change nothing differ in what they report: a person or a yes-or-no answer.', 'Looking at the front without removing is peek. A yes or no about waiting is isEmpty.'],
          explanation: 'Joining adds at the back (enqueue); calling the next person removes from the front (dequeue); a glance at the front is peek; checking whether anybody waits is isEmpty.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-24-code-challenge-1',
          kind: 'code-challenge',
          title: 'Who gets served?',
          story: 'A shop records its line as a list of events.',
          prompt: 'Write `serveOrder(events)`. Each event is either `"in:Name"` (that person joins the back of the line) or `"out"` (the person at the front is served and leaves). Return an array of the names in the order they were served. If `"out"` happens when nobody is waiting, ignore it.',
          concept: 'using a queue',
          language: 'javascript',
          starter: `function serveOrder(events) {
  // Keep the line in an array: push to join, shift to serve.
  const served = [];
  return served;
}`,
          solution: `function serveOrder(events) {
  const line = [];
  const served = [];
  for (const event of events) {
    if (event === 'out') {
      if (line.length > 0) {
        served.push(line.shift());
      }
    } else {
      line.push(event.slice(3));
    }
  }
  return served;
}`,
          tests: {
            kind: 'function',
            fn: 'serveOrder',
            cases: [
              { label: 'two in, one out', args: [['in:Nena', 'in:Ben', 'out']], expected: ['Nena'] },
              { label: 'interleaved', args: [['in:Nena', 'out', 'in:Ben', 'in:Joy', 'out', 'out']], expected: ['Nena', 'Ben', 'Joy'] },
              { label: 'out on an empty line is ignored', args: [['out', 'in:Rico', 'out', 'out']], expected: ['Rico'] },
              { label: 'nobody', args: [[]], expected: [] },
              { label: 'people left waiting are not served', args: [['in:A', 'in:B', 'in:C', 'out']], expected: ['A'], hidden: true },
            ],
          },
          hints: ['Make two arrays: one for the people waiting, one for the people already served.', 'For "out", take the front with shift and push it onto the served list, but only if someone is waiting.', 'For "in:Name", the name is the text after the first three characters: event.slice(3).'],
          explanation: 'The waiting line is a queue: push joins the back and shift serves the front. Checking the length first makes an "out" on an empty line do nothing, and the served array records the order of service.',
        },
      },
      {
        type: 'activity',
        audience: { max: 'beginner' },
        activity: {
          id: 'data-structures-algorithms-24-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Queue or stack?',
          prompt: 'Tap each card to check yourself.',
          concept: 'queue versus stack',
          cards: [
            { front: 'People waiting to pay at a cashier', back: 'Queue: the one who has waited longest is served first.' },
            { front: 'The undo button in a drawing app', back: 'Stack: the last thing you did is the first thing undone.' },
            { front: 'Messages waiting to be sent when your phone has no signal', back: 'Queue: they should be sent in the order you wrote them.' },
            { front: 'A pile of plates in the canteen', back: 'Stack: you take the plate that was put on top last.' },
          ],
          hints: [],
          explanation: 'Ask one question: should the oldest thing leave first (queue) or the newest thing leave first (stack)?',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-24-q1',
        prompt: "A queue starts empty. You run enqueue('A'), enqueue('B'), dequeue(), enqueue('C'). Which value is at the front now?",
        choices: ['A', 'B', 'C', 'The queue is empty'],
        answer: 1,
        explanation: 'A and B join in that order, then dequeue removes A (the oldest). C joins at the back, behind B. So B is at the front.',
      },
      {
        id: 'data-structures-algorithms-24-q2',
        prompt: 'An upload screen holds files waiting to be sent, and the file waiting longest must go next. Which structure fits, and why?',
        choices: [
          'A stack, because the newest file is usually the most important',
          'A Set, because every file should appear only once in the list',
          'A sorted array, because uploads always need an alphabetical order',
          'A queue, because the file that waited longest leaves first',
        ],
        answer: 3,
        explanation: 'First in, first out is exactly the rule "the one waiting longest goes next". A stack would send the newest file first, and neither a Set nor a sort order promises arrival order.',
      },
      {
        id: 'data-structures-algorithms-24-q3',
        prompt: 'In the array-backed Queue class, which operation is the slow one in the model we use, and why?',
        choices: [
          'dequeue, because shift slides every remaining item left',
          'enqueue, because push has to copy the whole array every time it runs',
          'peek, because it must search the array for the front item first',
          'size, because it counts the items one by one every time it is called',
        ],
        answer: 0,
        explanation: 'shift removes index 0 and every other item moves down one index, so the work grows with the number of waiting items. push, peek and size are each a single step.',
      },
      {
        id: 'data-structures-algorithms-24-q4',
        prompt: 'You call dequeue() on an empty Queue from this lesson. What happens?',
        choices: [
          'It returns null, because there is nothing left to give back',
          'It throws an error and stops the whole program right away',
          'undefined, because shift() on an empty array gives undefined',
          'It returns the last value that was removed from the queue',
        ],
        answer: 2,
        explanation: 'The class simply returns what shift() returns for an empty array, which is undefined. A different design could throw an error instead, but this one does not.',
      },
      {
        id: 'data-structures-algorithms-24-q5',
        audience: { max: 'beginner' },
        prompt: 'What does "enqueue" mean?',
        choices: [
          'Remove the person at the front of the line',
          'Check whether the line is empty',
          'Add a new person at the back of the line',
          'Look at the person at the front without removing them',
        ],
        answer: 2,
        explanation: 'Enqueue is joining the line, at the back. Removing the front is dequeue, looking at the front is peek, and checking for nobody waiting is isEmpty.',
      },
      {
        id: 'data-structures-algorithms-24-q6',
        audience: { min: 'advanced' },
        prompt: 'A service puts jobs into an in-memory queue faster than workers take them out. What is the main risk, and a standard remedy?',
        choices: [
          'The jobs lose their order, so the queue has to be sorted again before every dequeue',
          'Memory grows without limit, so bound the queue and make producers wait or refuse',
          'Dequeue becomes O(log n) as the queue grows, so it should be replaced with a stack',
          'There is no real risk, because dequeue frees memory faster than enqueue uses it up',
        ],
        answer: 1,
        explanation: 'If arrivals outpace departures the queue keeps growing. A bounded queue with a clear full-queue policy (wait, reject or drop) puts a ceiling on memory and tells producers to slow down.',
      },
    ],
    task: {
      title: 'Simulate a clinic line',
      steps: [
        'Open Talino\'s code runner or any free JavaScript playground and paste the Queue class from this lesson.',
        'Write a loop that enqueues ten patient names, serving one person after every third arrival. Print who is served each time.',
        'After the loop, serve everyone left. Check that the printed order matches the order of arrival.',
        'Add a method `last()` that returns the back of the line without removing it. Write one sentence on why it is just as easy as peek here.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before you run it, write on paper the line after each of the first five events, front on the left. Then run the program and compare.', 'Ask an AI assistant to explain your program line by line and see whether it agrees with your paper trace.'] },
      { audience: { min: 'advanced' }, steps: ['Add a counter that counts how many items `shift` moves in total, assuming each dequeue moves the remaining items once. Run 100 enqueues then 100 dequeues and report the total.', 'Change dequeue so it throws an error on an empty queue, and list what every caller must now do.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-25',
    day: 25,
    title: 'Implementing Queues: Circular Queues and Deques',
    summary: 'Make dequeue cheap with a circular array or a linked list, then open both ends of the line with a deque.',
    intro: {
      objectives: [
        'Count how much work repeated shift calls cost and explain why a circular queue avoids it',
        'Write a circular queue with head, tail and size, and trace how its indexes wrap around',
        'Write a linked-list queue with head and tail references and say why it joins at the tail',
        'Describe a deque (double-ended queue) and use one to solve a problem',
      ],
      why: 'When an AI writes a queue with push and shift, it works on ten items and crawls on a million. Knowing the cheaper designs lets you spot that, ask for the right one, and check its edge cases: full, empty and wrap-around.',
    },
    minutes: 30,
    skills: ['linked-structures', 'complexity'],
    body: [
      { type: 'paragraph', text: "The queue from the last lesson is correct, but its dequeue is slow in the model we use, because `shift` slides every remaining item one place left. In this lesson you first count that cost, then meet three ways to avoid it: a circular array, a linked list with a head and a tail, and a deque, which lets you add and remove at both ends. Each is a small idea, and each shows how the same promise (first in, first out) can be kept by very different storage." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Picture a jeepney terminal with eight numbered loading bays in a row. Passengers' trips are called in order, bay 1, 2, 3 and so on up to 8. After bay 8 the next call goes back to bay 1, which has been empty for a while. Nobody moves the passengers along the row; only the pointer that says \"next to be called\" moves, and when it falls off the end it wraps to the start. That wrapping is a **circular queue**." },
      { type: 'paragraph', text: "The picture stops working in one way: a real terminal can add another bay. A circular queue made from an array has a fixed number of slots, called its **capacity**, so it must say \"full\" when every slot is taken." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "First count the problem. Removing the front of an array with `shift` moves every other item one place left, so a queue of n items costs about n - 1 moves per dequeue. The code below counts those moves while emptying a queue." },
      {
        type: 'code',
        language: 'javascript',
        label: 'Counting the slides done by shift',
        code: `function emptyByShifting(n) {
  const items = [];
  for (let i = 1; i <= n; i++) {
    items.push(i);
  }
  let moves = 0;
  while (items.length > 0) {
    moves += items.length - 1;
    items.shift();
  }
  return moves;
}
console.log(emptyByShifting(10));
console.log(emptyByShifting(100));
console.log(emptyByShifting(200));`,
      },
      { type: 'paragraph', text: "The output is 45, 4950 and 19900. Doubling the queue from 100 to 200 items made the work about four times larger. That is the signature of O(n²) for emptying the whole queue, which means each single dequeue is O(n) in this model. The cure is not to move the items at all. Keep a number, `head`, that says where the front is, and just add one to it when someone leaves. The items stay put and only the pointer moves." },
      { type: 'paragraph', text: "That trick wastes the slots behind `head`. A **circular queue** reuses them: it keeps three numbers, `head` (index of the front item), `tail` (index where the next item will go) and `size` (how many items it holds). Whenever `head` or `tail` would step past the last slot, the remainder operator `%` sends it back to 0: the next index is `(index + 1) % capacity`. The tail is always `(head + size) % capacity`, which is a handy way to check your work." },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The slots of a circular queue with capacity 4. After slot 3 the next index is slot 0 again, because (3 + 1) % 4 is 0.',
        source: 'flowchart LR\n  S0[slot 0] --> S1[slot 1]\n  S1 --> S2[slot 2]\n  S2 --> S3[slot 3]\n  S3 -->|wraps: 4 % 4 = 0| S0',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: instead of sliding everybody forward when the first person leaves, the circular queue leaves everybody where they are and moves two markers. One marker (`head`) points at the person at the front. The other (`tail`) points at the empty seat where the next person will sit. When a marker reaches the last seat it jumps to the first seat, which is free by then. That is what the `%` does. If every seat is taken, the queue is full and it says so instead of adding someone." },
      { type: 'paragraph', text: "The second design stores no array at all. A **linked-list queue** is a chain of nodes (module 5), where each node holds a value and a reference to the next node. It keeps references to both ends: `head` (the front) and `tail` (the back). It joins at the tail and leaves at the head, and both are a few reference changes, so both are O(1). It cannot do it the other way round: removing the tail of a singly linked list needs the node before it, and a node only knows its next node, so you would walk the whole list, which is O(n)." },
      { type: 'paragraph', text: "The third design opens both ends. A **deque** (said \"deck\", short for double-ended queue) lets you add and remove at the front and at the back: `addFront`, `addBack`, `removeFront`, `removeBack`. It is a queue and a stack in one. A doubly linked list (each node knows its previous and its next node) gives all four in O(1), because removing the tail only needs `tail.prev`. A JavaScript array is a half-deque: `push` and `pop` at the back are cheap (O(1) amortized), but `unshift` and `shift` at the front are O(n) in our model." },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "The circular queue first. Read `enqueue` and `dequeue` side by side: each one uses its marker, then moves it with `%`. (Here `size` is a field rather than a method; either is fine.)" },
      {
        type: 'code',
        language: 'javascript',
        label: 'A circular queue with head, tail and size',
        code: `class CircularQueue {
  constructor(capacity) {
    this.slots = new Array(capacity).fill(undefined);
    this.capacity = capacity;
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }
  enqueue(value) {
    if (this.size === this.capacity) {
      return false;
    }
    this.slots[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    this.size++;
    return true;
  }
  dequeue() {
    if (this.size === 0) {
      return undefined;
    }
    const value = this.slots[this.head];
    this.slots[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return value;
  }
}

const ring = new CircularQueue(4);
for (const letter of ['A', 'B', 'C', 'D', 'E']) {
  console.log('enqueue', letter, ring.enqueue(letter));
}
console.log('dequeue', ring.dequeue());
console.log('dequeue', ring.dequeue());
console.log('enqueue', 'E', ring.enqueue('E'));
console.log('enqueue', 'F', ring.enqueue('F'));
console.log(ring.slots.join(' '), 'head', ring.head, 'tail', ring.tail, 'size', ring.size);`,
      },
      { type: 'paragraph', text: "Now the linked-list queue. It reuses the idea of a node from module 5, a small object with a value and a `next` reference." },
      {
        type: 'code',
        language: 'javascript',
        label: 'A linked-list queue with head and tail',
        code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedQueue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
  enqueue(value) {
    const node = new Node(value);
    if (this.tail === null) {
      this.head = node;
    } else {
      this.tail.next = node;
    }
    this.tail = node;
    this.size++;
  }
  dequeue() {
    if (this.head === null) {
      return undefined;
    }
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) {
      this.tail = null;
    }
    this.size--;
    return value;
  }
}

const q = new LinkedQueue();
q.enqueue('Nena');
q.enqueue('Ben');
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.size, q.head, q.tail);`,
      },
      { type: 'paragraph', text: "Finally the deque, on a doubly linked list. The code is longer, but it is the same pattern four times. Pay attention to the two places where the list becomes empty or starts from empty: `head` and `tail` must both be updated." },
      {
        type: 'code',
        language: 'javascript',
        label: 'A deque on a doubly linked list, and a palindrome check',
        code: `class DNode {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class Deque {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
  addFront(value) {
    const node = new DNode(value);
    if (this.head === null) {
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
    }
    this.head = node;
    this.size++;
  }
  addBack(value) {
    const node = new DNode(value);
    if (this.tail === null) {
      this.head = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
    }
    this.tail = node;
    this.size++;
  }
  removeFront() {
    if (this.head === null) {
      return undefined;
    }
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) {
      this.tail = null;
    } else {
      this.head.prev = null;
    }
    this.size--;
    return value;
  }
  removeBack() {
    if (this.tail === null) {
      return undefined;
    }
    const value = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail === null) {
      this.head = null;
    } else {
      this.tail.next = null;
    }
    this.size--;
    return value;
  }
}

const d = new Deque();
d.addBack('B');
d.addBack('C');
d.addFront('A');
console.log(d.removeBack());
console.log(d.removeFront());
console.log(d.removeFront());
console.log(d.removeFront());
console.log(d.size);

function isPalindrome(word) {
  const letters = new Deque();
  for (const ch of word) {
    letters.addBack(ch);
  }
  while (letters.size > 1) {
    if (letters.removeFront() !== letters.removeBack()) {
      return false;
    }
  }
  return true;
}
console.log(isPalindrome('madam'));
console.log(isPalindrome('abca'));
console.log(isPalindrome('noon'));`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Circular queue.** Five enqueues into capacity 4: A, B, C and D succeed (the tail wraps from 3 to 0 after D) and E prints `false`, because the queue is full and nothing changes. Two dequeues return A and B, moving `head` to 2. Now E and F fit, written into slots 0 and 1, which A and B freed. The final line prints `E F C D head 2 tail 2 size 4`.',
          '**Linked queue.** The first `enqueue` sees `tail === null`, so the new node becomes the head too. Later nodes hang off `tail.next` and then become the tail. `dequeue` moves `head` to `head.next`; when that leaves nothing, `tail` is cleared as well, which is easy to forget. The third dequeue prints `undefined`, and the last line prints `0 null null`.',
          '**Deque.** `addBack` B, `addBack` C and `addFront` A give A, B, C. `removeBack` gives C, then `removeFront` gives A then B, and one more gives `undefined` with size 0. In `isPalindrome`, each round removes one letter from each end and compares them: `madam` prints `true`, `abca` fails on a and c and prints `false`, and `noon` prints `true`.',
        ],
      },
      {
        type: 'table',
        headers: ['Step', 'slots (_ is empty)', 'head', 'tail', 'size'],
        rows: [
          ['start', '_ _ _ _', '0', '0', '0'],
          ['enqueue A, B, C', 'A B C _', '0', '3', '3'],
          ['enqueue D (tail wraps)', 'A B C D', '0', '0', '4'],
          ['enqueue E (full: false)', 'A B C D', '0', '0', '4'],
          ['dequeue A, dequeue B', '_ _ C D', '2', '0', '2'],
          ['enqueue E, enqueue F', 'E F C D', '2', '2', '4'],
        ],
        caption: 'A trace of the circular queue. The tail wraps at D, and E and F reuse the slots that A and B left.',
      },
      {
        type: 'table',
        headers: ['Design', 'enqueue', 'dequeue', 'Notes'],
        rows: [
          ['Array with push and shift', 'O(1) amortized', 'O(n) in our model', 'Simplest; slows down as the queue grows'],
          ['Circular array (fixed capacity)', 'O(1)', 'O(1)', 'Fixed size; says "full"; doubling when full makes it amortized O(1)'],
          ['Singly linked list with head and tail', 'O(1)', 'O(1)', 'One extra reference per item; no size limit'],
          ['Doubly linked deque', 'O(1) at both ends', 'O(1) at both ends', 'Four operations; the most flexible'],
        ],
        caption: 'The same FIFO promise, four ways to keep it, and what each costs.',
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "In practice the choice is rarely about the big-O row alone. A circular array keeps items next to each other in memory, which is friendly to the processor's cache, and it allocates once. A linked queue allocates a node per item, which costs memory and garbage-collector work even though each operation is O(1). A common production compromise is an array with a moving `head` index that is compacted (the items copied down) once the dead prefix is large, which keeps dequeue O(1) amortized. JavaScript has no built-in deque, so real code uses a library or one of these designs; an engine may optimise `shift` on a given array, but you cannot design around that." },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Ask an assistant to check your thinking, not to build the structure for you." },
      { type: 'prompt', label: 'Test my circular queue', text: "I wrote a circular queue in JavaScript with head, tail, size and capacity (code below). Do not rewrite it. Ask me five questions about edge cases one at a time (a full queue, an empty queue, wrapping around, capacity 1, dequeue then enqueue). After each of my answers tell me whether it is right. At the end, give me a list of tests I should write.\n\n[paste your code here; do not paste anything private]" },
      { type: 'prompt', label: 'Compare the four designs', text: "Explain in plain words the difference between a queue made with an array and shift, a circular queue, a linked-list queue and a deque. For each, tell me the cost of enqueue and dequeue and say which one you would pick for a print queue that never holds more than 50 jobs. Then ask me to defend my own choice for a different case, and do not give your answer until I reply." },
      { type: 'paragraph', text: "What to look for: the assistant should give a cost for each design that matches the table, and the answer for the 50-job queue should mention that a fixed capacity fits. An assistant can mislead you by calling every queue \"O(1)\" without saying which of the operations moves items. Ask it which line of code does the moving, and check the line." },
      {
        type: 'takeaways',
        items: [
          'Repeated shift calls slide items and cost O(n) each in our model; emptying a queue of n items does about n²/2 moves.',
          'A circular queue keeps head, tail and size, moves them with (index + 1) % capacity and reuses freed slots; with a fixed capacity it must report "full".',
          'A linked-list queue joins at the tail and leaves at the head, both O(1); a singly linked list cannot remove the tail cheaply.',
          'A deque adds and removes at both ends; a doubly linked list gives O(1) for all four operations.',
          'Always test the edges: empty, full, one item, and the moment an index wraps around.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-25-predict-output-1',
          kind: 'predict-output',
          title: 'Where does the tail go?',
          prompt: 'A circular queue has capacity 5 and its tail is at index 3. This code moves the tail four times. Predict what it prints.',
          concept: 'wrap-around with the remainder',
          language: 'javascript',
          code: `const capacity = 5;
let tail = 3;
for (let i = 0; i < 4; i++) {
  console.log(tail);
  tail = (tail + 1) % capacity;
}`,
          choices: ['3\n4\n0\n1', '3\n4\n5\n6', '3\n4\n0\n0', '4\n0\n1\n2'],
          wrongNotes: {
            '3\n4\n5\n6': 'Index 5 does not exist in a queue of capacity 5 (the slots are 0 to 4). The remainder sends 5 back to 0.',
            '3\n4\n0\n0': 'After wrapping to 0, the next step is (0 + 1) % 5, which is 1, not 0.',
            '4\n0\n1\n2': 'The print comes before the tail moves, so the first number printed is the starting index, 3.',
          },
          hints: ['The print happens first, then the tail moves.', 'After index 4 comes (4 + 1) % 5. What is the remainder of 5 divided by 5?', 'Write the sequence: 3, then 4, then the wrap, then one step after the wrap.'],
          explanation: 'It prints 3, moves to 4, prints 4, then (4 + 1) % 5 = 0 wraps to the first slot, prints 0, then moves to 1 and prints 1.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-25-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the linked queue',
          prompt: 'Fill in the three blanks so that the linked-list queue joins at the tail and leaves at the head. It should print Nena, Ben, then undefined.',
          concept: 'linked-list queue',
          language: 'javascript',
          code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class LinkedQueue {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  enqueue(value) {
    const node = new Node(value);
    if (this.tail === null) {
      this.head = node;
    } else {
      this.tail.___ = node;
    }
    this.tail = node;
  }
  dequeue() {
    if (this.head === null) {
      return undefined;
    }
    const value = this.head.value;
    this.head = this.head.___;
    if (this.head === ___) {
      this.tail = null;
    }
    return value;
  }
}
const q = new LinkedQueue();
q.enqueue('Nena');
q.enqueue('Ben');
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());`,
          blanks: [
            { answers: ['next'], feedback: 'The old last node must point to the new node. Which field of a node points onward?' },
            { answers: ['next'], feedback: 'After the front leaves, the new front is the node that the old front pointed to.' },
            { answers: ['null'], feedback: 'When the last node leaves, head becomes empty, and an empty reference is null.' },
          ],
          bank: ['next', 'next', 'null', 'prev', 'tail', 'undefined'],
          tests: { kind: 'output', expected: ['Nena', 'Ben', 'undefined'] },
          hints: ['Each node has a value and one field that links it to the one behind it.', 'The first two blanks use the same field name.', 'The last blank checks whether the list has become empty; empty references in this code are written null.'],
          explanation: 'Joining sets tail.next to the new node; leaving moves head to head.next; and if head becomes null the queue is empty, so tail is cleared too.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-25-fix-bug-1',
          kind: 'fix-bug',
          title: 'The tail wraps at the wrong number',
          prompt: 'This circular queue has capacity 3. The program should print 1, 2, 3, 4, 5, but it prints strange values. Tap the faulty line, then choose the fix.',
          concept: 'wrap-around index',
          language: 'javascript',
          code: `class CircularQueue {
  constructor(capacity) {
    this.slots = new Array(capacity).fill(undefined);
    this.capacity = capacity;
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }
  enqueue(value) {
    this.slots[this.tail] = value;
    this.tail = (this.tail + 1) % this.size;
    this.size++;
  }
  dequeue() {
    const value = this.slots[this.head];
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return value;
  }
}
const q = new CircularQueue(3);
q.enqueue(1);
q.enqueue(2);
q.enqueue(3);
console.log(q.dequeue());
console.log(q.dequeue());
q.enqueue(4);
q.enqueue(5);
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());`,
          bugLine: 11,
          fixes: [
            { line: '    this.tail = (this.tail + 1) % this.capacity;', correct: true, why: 'The slots are numbered 0 to capacity - 1, so the index must wrap at the capacity, the number of slots.' },
            { line: '    this.tail = (this.tail + 1) % (this.capacity - 1);', correct: false, why: 'This wraps one slot too early, so the last slot is never used and new items overwrite old ones.' },
            { line: '    this.tail = (this.tail + 1) % this.size;', correct: false, why: 'This is the original line. size starts at 0, and a remainder by 0 is not a number, so the tail is broken from the first enqueue.' },
          ],
          tests: { kind: 'output', expected: ['1', '2', '3', '4', '5'] },
          hints: ['Run the first enqueue by hand: what is size at that moment, and what is x % 0?', 'The tail must go back to 0 after the last slot. How many slots does the queue have?', 'The number of slots is stored in this.capacity.'],
          explanation: 'Indexes wrap at the number of slots, which is the capacity. size changes as items come and go, so it is the wrong number to wrap by.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-25-scenario-1',
          kind: 'scenario',
          title: 'A music app\'s "Up next" list',
          prompt: 'Choose the structure that fits.',
          concept: 'choosing a deque',
          situation: 'A music app keeps an "Up next" list. Normal songs join at the end of the list. A "Play next" button puts a song at the very front. The player always takes the song at the front.',
          options: [
            { text: 'A deque: addBack for normal songs, addFront for "Play next", removeFront for the player.', consequence: 'Correct. Both ends are needed and a deque gives all of them in O(1) when built on a doubly linked list.', quality: 'best' },
            { text: 'A plain queue with only enqueue and dequeue.', consequence: 'A plain queue can only add at the back, so "Play next" could not put a song at the front.', quality: 'poor' },
            { text: 'An array where "Play next" uses unshift and everything else uses push and shift.', consequence: 'It gives the right behaviour, but unshift and shift are both O(n) in our model, so a long list gets slow. Fine for 20 songs, a poor choice as a pattern.', quality: 'acceptable' },
          ],
          hints: ['List the places a song is added and the place one is removed.', 'A plain queue allows adding only at one end.', 'Which structure lets you add at both ends and remove at the front without moving other items?'],
          explanation: 'Adding at both ends and removing at the front calls for a deque. An array can imitate it, but its front operations move items.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-25-match-1',
          kind: 'match',
          title: 'What does one dequeue cost?',
          prompt: 'Match each design to the work done by a single dequeue.',
          concept: 'comparing complexity',
          labels: { terms: 'Design', meanings: 'One dequeue' },
          pairs: [
            { term: 'Array with push and shift', definition: 'O(n) in our model: every remaining item slides one place left' },
            { term: 'Circular array', definition: 'O(1): read the head slot and move head one place, wrapping with %' },
            { term: 'Linked list with head and tail', definition: 'O(1): move head to head.next' },
            { term: 'Singly linked list, removing the tail', definition: 'O(n): walk to the node before the last one' },
          ],
          hints: ['Which designs move many items, and which only move a marker?', 'A singly linked node only knows the node after it.', 'To remove the last node you need the one before it, and the only way to find it is to start at the head.'],
          explanation: 'Moving a marker (head) is a constant amount of work, while sliding items or walking a list grows with its length.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-25-code-challenge-1',
          kind: 'code-challenge',
          title: 'Keep the last k',
          story: 'A search box remembers the most recent searches.',
          prompt: 'Write `lastK(values, k)`. It receives an array and a capacity k and acts like a circular buffer: every value is added in order, and when k values are already stored the oldest is overwritten. Return the stored values from oldest to newest. Use an array of k slots with a `head` index and a count, as in the lesson, and do not use shift.',
          concept: 'circular buffer',
          language: 'javascript',
          starter: `function lastK(values, k) {
  const slots = new Array(k).fill(undefined);
  let head = 0;
  let count = 0;
  // add every value; when the buffer is full the oldest value is overwritten
  return [];
}`,
          solution: `function lastK(values, k) {
  const slots = new Array(k).fill(undefined);
  let head = 0;
  let count = 0;
  for (const value of values) {
    if (count < k) {
      slots[(head + count) % k] = value;
      count++;
    } else {
      slots[head] = value;
      head = (head + 1) % k;
    }
  }
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(slots[(head + i) % k]);
  }
  return result;
}`,
          tests: {
            kind: 'function',
            fn: 'lastK',
            cases: [
              { label: 'fewer values than k', args: [[1, 2], 4], expected: [1, 2] },
              { label: 'exactly k', args: [[1, 2, 3], 3], expected: [1, 2, 3] },
              { label: 'overwrites the oldest', args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7] },
              { label: 'capacity 1', args: [['a', 'b', 'c'], 1], expected: ['c'] },
              { label: 'a long input', args: [Array.from({ length: 20000 }, (_, i) => i), 4], expected: [19996, 19997, 19998, 19999], hidden: true },
            ],
          },
          hints: ['While fewer than k values are stored, the next free slot is (head + count) % k.', 'When the buffer is full, the oldest value sits at head. Overwrite it and move head forward by one, wrapping with %.', 'To read oldest to newest, start at head and take count values, wrapping each index with %.'],
          explanation: 'Writing at (head + count) % k fills the free slots; once full, overwriting at head replaces the oldest and advances head. Reading from head for count steps gives oldest to newest, and no item is ever moved.',
        },
      },
      {
        type: 'activity',
        audience: { max: 'beginner' },
        activity: {
          id: 'data-structures-algorithms-25-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Four ideas in one line each',
          prompt: 'Tap each card for a short reminder.',
          concept: 'queue designs',
          cards: [
            { front: 'Why does a circular queue use %?', back: 'So that a marker that steps past the last slot goes back to slot 0 instead of falling off the end.' },
            { front: 'Why does a circular queue say "full"?', back: 'It has a fixed number of slots. When all are taken, adding one more would overwrite someone still waiting.' },
            { front: 'Why is a linked queue joined at the tail?', back: 'Because the tail is where the last node is, so a new node is attached in one step. Removing at the tail would need a walk.' },
            { front: 'What is a deque?', back: 'A line you can add to and remove from at both ends. It can act as a queue or as a stack.' },
          ],
          hints: [],
          explanation: 'Each design keeps first in, first out, but moves a marker or a reference instead of moving every item.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-25-q1',
        prompt: 'A circular queue has capacity 6. Its head is at index 4 and it holds 3 items. At which index will the next item be stored?',
        choices: ['0', '7', '1', '3'],
        answer: 2,
        explanation: 'The next free slot is (head + size) % capacity = (4 + 3) % 6 = 1. Index 7 does not exist; the remainder wraps it around to 1.',
      },
      {
        id: 'data-structures-algorithms-25-q2',
        prompt: 'A singly linked queue adds items at the tail and removes them at the head. Why not the reverse?',
        choices: [
          'The node before the tail cannot be reached without walking the whole list',
          'Adding at the head would force every node to be renumbered, taking O(n) time',
          'A head node is not allowed to hold a value, only a reference to the next one',
          'JavaScript objects cannot be linked from the back of a list to the front',
        ],
        answer: 0,
        explanation: 'To make the second-to-last node the new tail you must reach it, and in a singly linked list the only way is to start at the head and follow next. Adding at the head would be fine, but then removing would have to happen at the tail.',
      },
      {
        id: 'data-structures-algorithms-25-q3',
        prompt: 'Which two operations of a deque does the palindrome check in this lesson repeat in a loop?',
        choices: ['addFront and addBack in turn', 'removeFront and addFront together', 'peekFront and size, never removing', 'removeFront and removeBack'],
        answer: 3,
        explanation: 'Each round takes one letter from each end and compares them. A palindrome reads the same from both ends, so the pairs must match until the middle.',
      },
      {
        id: 'data-structures-algorithms-25-q4',
        prompt: 'In the circular queue of this lesson, what does enqueue do when every slot is already taken?',
        choices: [
          'It overwrites the oldest value and moves head forward',
          'It returns false and leaves the queue unchanged',
          'It doubles the size of the slots array',
          'It throws an error and stops the program',
        ],
        answer: 1,
        explanation: 'The version in this lesson refuses: it returns false. Overwriting the oldest (as in the lastK challenge) or growing the array are other designs, but they are not what this class does.',
      },
      {
        id: 'data-structures-algorithms-25-q5',
        audience: { max: 'beginner' },
        prompt: 'What does "circular" mean in a circular queue?',
        choices: [
          'The items are drawn as a circle on the screen so they are easier to read',
          'After the last slot it wraps to the first, so freed slots get reused',
          'Every item is served twice before it is finally allowed to leave the line',
          'The queue always serves the largest item first, then the next largest',
        ],
        answer: 1,
        explanation: 'The markers wrap around from the last slot back to the first. That lets the queue reuse the slots that earlier items left, without sliding anything.',
      },
      {
        id: 'data-structures-algorithms-25-q6',
        audience: { min: 'advanced' },
        prompt: 'You need an unbounded FIFO queue in JavaScript with O(1) amortized enqueue and dequeue, and you expect millions of items. Which is the most defensible design?',
        choices: [
          'An array with push and shift, because engines always make shift constant time',
          'A sorted array, so that the front is always at index 0 and never moves',
          'A circular array that doubles when full, or a linked-list queue',
          'A deque used only at its front, so that dequeue and enqueue share the same end',
        ],
        answer: 2,
        explanation: 'Both a growing circular array (resizing is amortized O(1), like a dynamic array) and a linked queue keep both operations O(1) amortized without relying on an engine optimisation. Using one end for both operations would make it a stack, not a queue.',
      },
    ],
    task: {
      title: 'Measure and compare queues',
      steps: [
        'Paste the `emptyByShifting` counter from this lesson into a free JavaScript playground and run it for n = 100, 200 and 400. Write the three numbers down.',
        'Paste the CircularQueue class. Create one with capacity 5 and enqueue 8 values, noting which enqueues return false.',
        'Dequeue twice, enqueue three more, and write on paper the contents of `slots`, `head`, `tail` and `size` after each step before you print them.',
        'Paste the Deque and add `peekFront()` and `peekBack()` methods that return a value without removing it.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw the capacity-4 circle of slots on paper and move two coins, one for head and one for tail, through the example trace in this lesson.', 'Ask an AI assistant to explain `(this.tail + 1) % this.capacity` using a clock face as the example, then check it against your coins.'] },
      { audience: { min: 'advanced' }, steps: ['Make the circular queue grow: when it is full, allocate a slots array of double capacity, copy the items in order starting at index 0, reset head to 0 and tail to size, then continue. Explain why the copy is O(n) but enqueue is still O(1) amortized.', 'Add a property-style test: after any random mix of enqueue and dequeue, your queue gives the same results as a plain array used as a queue.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-26',
    day: 26,
    title: 'Priority Queues, Task Scheduling and Real-World Queues',
    summary: 'Let urgent items skip ahead with a priority queue, share time fairly with round robin, and recognise queues in real software.',
    intro: {
      objectives: [
        'Explain how a priority queue differs from a plain queue and write one with a sorted insert',
        'Keep arrival order among items of equal priority',
        'Simulate first come first served and round robin scheduling with a queue',
        'Match real-world situations to the kind of queue they need',
      ],
      why: 'Help desks, job schedulers, notification systems and operating systems all decide what runs next. When an AI writes one, you can check whether urgent items really jump ahead, whether equal items stay fair, and what each operation costs.',
    },
    minutes: 30,
    skills: ['linked-structures', 'choose-structure'],
    body: [
      { type: 'paragraph', text: "A plain queue is fair in one way only: it serves people in the order they arrived. Real lines are not always like that. An ambulance does not wait behind a parked car, and a customer with a broken delivery matters more than one asking for opening hours. This lesson adds two ideas to the queue: a **priority queue**, where urgent items skip ahead, and **scheduling**, where a queue decides who gets a turn. Then we look at where queues really appear, so you can recognise them in software you did not write." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Think of the bank's counter with priority lanes. Most people join the ordinary line, but a senior citizen or a person with a disability is called next, ahead of earlier arrivals. Among the people who qualify, the one who arrived first is still called first. Two rules are at work: urgency first, then arrival order to break ties." },
      { type: 'paragraph', text: "The picture stops working for software in one place: a bank teller sees who is in the line. A program must be told each item's priority as a number and must decide itself what to do when two numbers are equal." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "A priority queue serves the **most urgent** item first, not the oldest. In this course a smaller number means more urgent, so priority 1 beats priority 3. The simplest way to build one is to keep the array **sorted** at all times: when a ticket arrives, walk from the front until you meet the first ticket that is less urgent than the new one, and insert just before it. Dequeue then just takes the front. The rule that keeps things fair is to stop only at a ticket that is *strictly* less urgent, so a new ticket lands behind existing tickets with the same priority and ties stay in arrival order." },
      { type: 'paragraph', text: "What does it cost? Walking to the right place takes up to n comparisons, and inserting into the middle of an array moves items, so enqueue is O(n). Dequeue takes the front item: with `shift` that is O(n) in our model, though the head-index idea from the last lesson makes it O(1). A sorted array is fine for a desk with a few dozen tickets. Module 11 builds a **heap**, a structure that makes both insert and removal O(log n), and that is what real priority queues use." },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a priority queue is a line where each person carries a number saying how urgent they are. When someone new arrives you do not put them at the back; you find their place by walking along the line until you reach someone less urgent, and you slip in just in front of that person. People with the same number stay in the order they came. The person at the front is always the most urgent one, so serving them is easy." },
      { type: 'paragraph', text: "Scheduling is the second idea. A computer has to share its processor among many jobs. The simplest plan is **first come first served**: run each job to the end in arrival order. It is fair about order, but one long job makes everyone behind it wait. **Round robin** gives each job a short turn, called a **time slice** or quantum, and a job that is not finished goes to the *back* of the queue. A short job now finishes sooner, and every job gets attention regularly." },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Round robin: take the job at the front, let it run for one time slice, and send it to the back if it still has work left.',
        source: 'flowchart TD\n  A[Take the job at the front of the queue] --> B[Run it for one time slice]\n  B --> C{Any work left?}\n  C -->|yes| D[Put it at the back of the queue]\n  C -->|no| E(Job is finished)\n  D --> A',
      },
      {
        type: 'table',
        headers: ['Where you meet it', 'Kind of queue', 'What leaves next'],
        rows: [
          ['A shared printer', 'Plain FIFO queue', 'The job that has waited longest'],
          ['A help desk with urgent and ordinary tickets', 'Priority queue', 'The most urgent ticket; the oldest among equals'],
          ['A system sharing one processor among programs (one classic way)', 'Round robin over a queue', 'The next program in turn, for a short slice, then it goes to the back'],
          ['An app retrying failed uploads', 'FIFO queue, often with a limit', 'The oldest failed upload'],
          ['A buffer holding the latest 50 readings', 'Circular queue', 'The oldest reading, which is overwritten when full'],
          ['Finding the fewest-stops route between places (module 13)', 'FIFO queue of places still to visit', 'The place discovered earliest, so nearer places are explored before farther ones'],
        ],
        caption: 'Real situations and the queue behind them.',
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "Two properties to design for. First, **starvation**: if urgent items keep arriving, a low-priority item may wait for ever. A common remedy is aging, where an item's priority improves the longer it waits. Second, **stability**: equal priorities must come out in arrival order, which is why the insert uses a strict comparison; heap-based queues do not give this for free, so production code often adds an arrival counter as a tie-breaker. Finally, remember the cost model: sorted insert is O(n) per item, so n inserts cost O(n²) in total, which is the reason to move to a heap when the queue is large." },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "First the priority queue with a sorted insert. It counts comparisons so you can see the cost. Tickets are small objects with an id, a customer and a priority (1 is most urgent)." },
      {
        type: 'code',
        language: 'javascript',
        label: 'A priority queue kept sorted by priority',
        code: `class PriorityQueue {
  constructor() {
    this.items = [];
    this.comparisons = 0;
  }
  enqueue(ticket) {
    let index = 0;
    while (index < this.items.length) {
      this.comparisons++;
      if (this.items[index].priority > ticket.priority) {
        break;
      }
      index++;
    }
    this.items.splice(index, 0, ticket);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

const desk = new PriorityQueue();
desk.enqueue({ id: 'T1', who: 'Aling Nena', priority: 2 });
desk.enqueue({ id: 'T2', who: 'Mang Ben', priority: 3 });
desk.enqueue({ id: 'T3', who: 'Ate Joy', priority: 1 });
desk.enqueue({ id: 'T4', who: 'Kuya Rico', priority: 2 });
desk.enqueue({ id: 'T5', who: 'Lita', priority: 1 });
console.log('comparisons while inserting:', desk.comparisons);
while (!desk.isEmpty()) {
  const t = desk.dequeue();
  console.log(t.id, t.who, 'priority', t.priority);
}`,
      },
      { type: 'paragraph', text: "(`splice(index, 0, ticket)` inserts `ticket` at `index` and removes nothing. It moves the items after it, which is part of the O(n) cost.) Now round robin. Three jobs need 5, 3 and 2 units of work, and each turn gives a job at most `quantum` units. The function returns who finished when, and a second call with a huge quantum shows first come first served, because every job then finishes in one turn." },
      {
        type: 'code',
        language: 'javascript',
        label: 'Round robin on a queue of jobs',
        code: `function roundRobin(jobs, quantum) {
  const line = jobs.map((job) => ({ name: job.name, left: job.time }));
  let clock = 0;
  const finished = [];
  while (line.length > 0) {
    const job = line.shift();
    const slice = Math.min(quantum, job.left);
    clock += slice;
    job.left -= slice;
    console.log('t=' + clock, job.name, 'ran', slice, job.left === 0 ? 'and finished' : 'and has ' + job.left + ' left');
    if (job.left > 0) {
      line.push(job);
    } else {
      finished.push(job.name + '@' + clock);
    }
  }
  return finished;
}
const jobs = [{ name: 'A', time: 5 }, { name: 'B', time: 3 }, { name: 'C', time: 2 }];
console.log(roundRobin(jobs, 2).join(' '));
console.log(roundRobin(jobs, 100).join(' '));`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Priority queue.** T1 (2) goes in an empty array. T2 (3) walks past T1 and lands behind it. T3 (1) stops at T1, which is less urgent, and goes first. T4 (2) walks past T3 and T1 (equal, so not strictly less urgent) and stops at T2, so it lands behind T1. T5 (1) walks past T3 and stops at T1, so it lands behind T3. The five inserts made 0 + 1 + 1 + 3 + 2 = 7 comparisons. The tickets leave as T3, T5, T1, T4, T2.',
          '**Round robin.** The line starts as A, B, C. A runs 2 and goes to the back (3 left), B runs 2 (1 left), C runs 2 and finishes at time 6. A runs 2 (1 left), then B finishes at 9, then A finishes at 10. The finish list is `C@6 B@9 A@10`.',
          '**Large quantum.** Each job finishes in its first turn, so the order is arrival order: `A@5 B@8 C@10`. Compare the two: round robin finished the short job C at time 6 instead of 10, and the long job A at 10 in both cases.',
        ],
      },
      {
        type: 'table',
        headers: ['Arrival', 'Ticket (priority)', 'Walks past', 'Queue after (front on the left)'],
        rows: [
          ['1', 'T1 (2)', 'nothing', 'T1'],
          ['2', 'T2 (3)', 'T1', 'T1, T2'],
          ['3', 'T3 (1)', 'nothing: T1 is less urgent', 'T3, T1, T2'],
          ['4', 'T4 (2)', 'T3, T1; stops at T2', 'T3, T1, T4, T2'],
          ['5', 'T5 (1)', 'T3; stops at T1', 'T3, T5, T1, T4, T2'],
        ],
        caption: 'A trace of the sorted insert. A new ticket stops at the first ticket that is strictly less urgent.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Use an assistant as a sparring partner. State your own answer first, then ask it to challenge you." },
      { type: 'prompt', label: 'Check my tie-break', text: "I am learning priority queues in JavaScript. My queue keeps an array sorted by priority, where a smaller number is more urgent, and inserts a new item before the first item that is strictly less urgent. Ask me to predict the order for three sets of tickets, including ones with equal priorities. Do not give the answer: wait for my reply and then tell me whether it is right and why." },
      { type: 'prompt', label: 'Round robin, my turn', text: "Give me a small round robin scheduling problem (three or four jobs with different lengths and a time slice of 2). Do not solve it. Ask me to write down the order in which jobs run and when each finishes. After I answer, check it step by step, and then ask me whether first come first served would finish the shortest job sooner or later, and why." },
      { type: 'paragraph', text: "What to look for: the assistant should check your trace line by line rather than just announce a result. It can mislead you by saying a priority queue always costs O(log n). That is true for a heap, not for the sorted-array version in this lesson, where insert is O(n). Ask which structure it means." },
      {
        type: 'takeaways',
        items: [
          'A priority queue serves the most urgent item first; among equal priorities it should serve the oldest, so insert behind equal items (a strict comparison).',
          'A sorted-array priority queue has O(n) insert; a heap (module 11) makes insert and removal O(log n).',
          'First come first served runs each job to the end; round robin gives each job a time slice and sends unfinished jobs to the back of the queue.',
          'Queues are everywhere: printers, help desks, retry lists, buffers, schedulers and the frontier of a route search.',
          'Fairness has a price: with priorities, low-priority items can starve unless something like aging helps them.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-26-predict-output-1',
          kind: 'predict-output',
          title: 'Where does each ticket land?',
          prompt: 'Predict what this program prints. A smaller number is more urgent, and equal priorities keep arrival order.',
          concept: 'priority queue insert',
          language: 'javascript',
          code: `const queue = [];
function add(name, priority) {
  let i = 0;
  while (i < queue.length && queue[i].priority <= priority) {
    i++;
  }
  queue.splice(i, 0, { name, priority });
}
add('A', 2);
add('B', 1);
add('C', 2);
add('D', 1);
console.log(queue.map((t) => t.name).join(''));`,
          choices: ['BDAC', 'BADC', 'DBAC', 'BDCA'],
          wrongNotes: {
            BADC: 'D has priority 1, the same as B, so D must stand behind B but in front of the priority 2 tickets.',
            DBAC: 'D arrived after B and they have equal priority, so B stays ahead of D.',
            BDCA: 'A and C both have priority 2 and A arrived first, so A comes before C.',
          },
          hints: ['Write the queue after each add. After A it is just A.', 'B has priority 1, which is more urgent than A, so it goes in front. C has the same priority as A, so it goes behind A.', 'D (priority 1) walks past B because 1 <= 1, then stops at A because 2 <= 1 is false.'],
          explanation: 'The queue goes A, then B A, then B A C, then B D A C. The loop passes every item whose priority is less than or equal to the new one, so equal priorities keep arrival order.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-26-fill-blank-1',
          kind: 'fill-blank',
          title: 'A round of round robin',
          prompt: 'Each turn a job runs for one unit (time slice 1). Fill in the blanks so unfinished jobs go to the back. It should print A B A A.',
          concept: 'round robin',
          language: 'javascript',
          code: `const line = [{ name: 'A', left: 3 }, { name: 'B', left: 1 }];
const order = [];
while (line.length > 0) {
  const job = line.___();
  order.push(job.name);
  job.left = job.left - 1;
  if (job.left ___ 0) {
    line.___(job);
  }
}
console.log(order.join(' '));`,
          blanks: [
            { answers: ['shift'], feedback: 'The next job to run is the one at the front, which an array gives up with shift.' },
            { answers: ['>'], feedback: 'A job goes back only while it still has work left, meaning left is more than zero.' },
            { answers: ['push'], feedback: 'An unfinished job joins the back of the line.' },
          ],
          bank: ['shift', 'pop', '>', '<', 'push', 'unshift'],
          tests: { kind: 'output', expected: ['A B A A'] },
          hints: ['Taking the front of a line and joining the back are the two queue operations.', 'The condition decides whether the job still has work left.', 'Trace it: A runs (2 left, back of line), B runs (done), A runs, A runs.'],
          explanation: 'shift takes the front job, push sends it to the back when it has work left (left > 0). The runs are A, B, A, A: B finishes after one turn, and A takes the rest.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-26-fix-bug-1',
          kind: 'fix-bug',
          title: 'Equal priorities jump the line',
          prompt: 'Tickets with the same priority should be served in arrival order, but the newest one is served first. The expected order is T2, T4, T1, T3. Tap the faulty line, then choose the fix.',
          concept: 'stable priority queue',
          language: 'javascript',
          code: `class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(ticket) {
    let index = 0;
    while (index < this.items.length) {
      if (this.items[index].priority >= ticket.priority) {
        break;
      }
      index++;
    }
    this.items.splice(index, 0, ticket);
  }
  dequeue() {
    return this.items.shift();
  }
}
const desk = new PriorityQueue();
desk.enqueue({ id: 'T1', priority: 2 });
desk.enqueue({ id: 'T2', priority: 1 });
desk.enqueue({ id: 'T3', priority: 2 });
desk.enqueue({ id: 'T4', priority: 1 });
for (let i = 0; i < 4; i++) {
  console.log(desk.dequeue().id);
}`,
          bugLine: 8,
          fixes: [
            { line: '      if (this.items[index].priority > ticket.priority) {', correct: true, why: 'Stopping only at a strictly less urgent ticket puts the new ticket behind those with equal priority, which keeps arrival order.' },
            { line: '      if (this.items[index].priority < ticket.priority) {', correct: false, why: 'This stops at a more urgent ticket, so urgent tickets end up behind less urgent ones.' },
            { line: '      if (this.items[index].priority === ticket.priority) {', correct: false, why: 'This only stops at an equal ticket, so a more urgent ticket is never moved ahead of a less urgent one.' },
          ],
          tests: { kind: 'output', expected: ['T2', 'T4', 'T1', 'T3'] },
          hints: ['Follow T4 (priority 1) when T2 (priority 1) is already in the queue. Where should T4 land?', 'The loop stops at the first ticket that makes the check true. Which ticket should T4 stop at?', 'It should stop only at a ticket that is strictly less urgent: a larger priority number.'],
          explanation: 'With >= the loop also stops at an equal ticket, so a new ticket lands in front of it. Using > makes the loop walk past equals and stop only at a less urgent ticket.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-26-scenario-1',
          kind: 'scenario',
          title: 'Which queue for the help desk?',
          prompt: 'Pick the best design.',
          concept: 'choosing a priority queue',
          situation: 'A small shop\'s help desk gets about 40 tickets a day, each marked urgent (1), normal (2) or low (3). Agents must always take the most urgent ticket, and among tickets with the same mark the one that has waited longest.',
          options: [
            { text: 'A priority queue (a sorted array with a strict comparison is enough at this size).', consequence: 'Correct. The most urgent comes first, ties keep arrival order, and with 40 tickets an O(n) insert is nothing.', quality: 'best' },
            { text: 'A plain FIFO queue.', consequence: 'Urgent tickets would wait behind everything that arrived earlier, which breaks the main rule.', quality: 'poor' },
            { text: 'Three separate plain queues, one per mark, serving the urgent one first and so on.', consequence: 'This also works: three FIFO queues keep arrival order inside each mark. It is more code to keep in step, but a fine answer when there are only a few fixed priorities.', quality: 'acceptable' },
          ],
          hints: ['Write down the two rules the agents follow, in order.', 'A plain queue knows nothing about urgency.', 'A priority queue with a strict comparison gives both rules at once.'],
          explanation: 'Two rules (urgency first, then arrival) are exactly what a priority queue with stable ties provides. At 40 tickets a day the simple sorted version is plenty.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-26-match-1',
          kind: 'match',
          title: 'Which queue does it need?',
          prompt: 'Match each situation to the kind of queue behind it.',
          concept: 'real-world queues',
          labels: { terms: 'Situation', meanings: 'Kind of queue' },
          pairs: [
            { term: 'A photocopy shop prints customers\' jobs one after another', definition: 'A plain FIFO queue' },
            { term: 'A clinic sees a patient with chest pain before earlier arrivals', definition: 'A priority queue' },
            { term: 'Several downloads each get a short turn in rotation until done', definition: 'Round robin: unfinished jobs go to the back' },
            { term: 'An app keeps only the 20 most recent sensor readings', definition: 'A circular queue that overwrites the oldest' },
          ],
          hints: ['Which situation lets someone skip ahead?', 'Which one has jobs that come back for another turn?', 'Which one has a fixed size where old items are replaced?'],
          explanation: 'Plain arrival order is FIFO; urgency adds priority; turns in rotation are round robin; a fixed-size buffer that replaces the oldest is a circular queue.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-26-code-challenge-1',
          kind: 'code-challenge',
          title: 'When does each job finish?',
          story: 'A tiny scheduler shares one worker between jobs.',
          prompt: 'Write `finishTimes(times, quantum)`. `times[i]` is the work that job `i` needs. The jobs line up in index order and use round robin: each turn a job runs for at most `quantum` units and, if unfinished, goes to the back of the line. Return an array where position `i` is the time job `i` finishes. Use a queue of job numbers.',
          concept: 'round robin scheduling',
          language: 'javascript',
          starter: `function finishTimes(times, quantum) {
  const left = times.slice();
  const finish = times.map(() => 0);
  // a queue holding the numbers of the jobs, in order
  return finish;
}`,
          solution: `function finishTimes(times, quantum) {
  const left = times.slice();
  const finish = times.map(() => 0);
  const line = [];
  for (let i = 0; i < times.length; i++) {
    line.push(i);
  }
  let clock = 0;
  let head = 0;
  while (head < line.length) {
    const job = line[head];
    head++;
    const slice = Math.min(quantum, left[job]);
    clock += slice;
    left[job] -= slice;
    if (left[job] > 0) {
      line.push(job);
    } else {
      finish[job] = clock;
    }
  }
  return finish;
}`,
          tests: {
            kind: 'function',
            fn: 'finishTimes',
            cases: [
              { label: 'the lesson example', args: [[5, 3, 2], 2], expected: [10, 9, 6] },
              { label: 'one job', args: [[4], 3], expected: [4] },
              { label: 'large quantum is first come first served', args: [[1, 1, 1], 5], expected: [1, 2, 3] },
              { label: 'quantum 1', args: [[2, 1], 1], expected: [3, 2] },
              { label: 'many jobs', args: [Array.from({ length: 300 }, () => 2), 1], expected: Array.from({ length: 300 }, (_, i) => 300 + i + 1), hidden: true },
            ],
          },
          hints: ['Put the job numbers 0, 1, 2... in a queue, and keep a separate array of how much work each job has left.', 'Each turn: take the front job, run it for min(quantum, left) units, and add that to a clock.', 'If the job still has work left, push its number to the back; otherwise record the clock as its finish time.'],
          explanation: 'The queue holds job numbers, so the order of turns is first in, first out. Each turn advances the clock by the slice used; a job that finishes records the clock, and an unfinished one rejoins the back.',
        },
      },
      {
        type: 'activity',
        audience: { max: 'beginner' },
        activity: {
          id: 'data-structures-algorithms-26-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Ties and turns',
          prompt: 'Tap each card for a quick check.',
          concept: 'priority and scheduling',
          cards: [
            { front: 'Two tickets have the same priority. Who goes first?', back: 'The one that arrived first. Equal priority keeps arrival order.' },
            { front: 'What does a priority queue keep at the front?', back: 'The most urgent item, which is not always the oldest.' },
            { front: 'In round robin, what happens to a job that is not finished after its turn?', back: 'It goes to the back of the queue and waits for another turn.' },
            { front: 'Why not let one long job run to the end first?', back: 'Everyone behind it would wait the whole time, even for a tiny job.' },
          ],
          hints: [],
          explanation: 'Priority decides who goes first; round robin decides how turns are shared.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-26-q1',
        prompt: 'Tickets A (priority 2), B (priority 1) and C (priority 2) arrive in that order at a priority queue where 1 is most urgent and ties keep arrival order. In what order are they served?',
        choices: ['A, B, C', 'B, A, C', 'B, C, A', 'C, A, B'],
        answer: 1,
        explanation: 'B is the most urgent and goes first. A and C tie at priority 2, and A arrived before C, so the order is B, A, C.',
      },
      {
        id: 'data-structures-algorithms-26-q2',
        prompt: 'In the sorted-array priority queue of this lesson, which part makes enqueue O(n)?',
        choices: [
          'Creating the ticket object, which copies every other ticket',
          'Checking isEmpty before every insert, which scans the array',
          'Sorting the whole array again from scratch after each insert',
          'Walking to the right place, then moving items to make room',
        ],
        answer: 3,
        explanation: 'The walk can pass every waiting ticket, and splice shifts the items behind the new one. There is no full sort, and creating a ticket costs one step.',
      },
      {
        id: 'data-structures-algorithms-26-q3',
        prompt: 'In round robin, a job uses its whole time slice and still has work left. What happens to it?',
        choices: [
          'It goes to the back of the queue and waits for another turn',
          'It stays at the front and keeps running until it is done, however long',
          'It is removed from the queue and has to be submitted all over again',
          'It moves to the front of the queue so that it can finish sooner',
        ],
        answer: 0,
        explanation: 'Sending it to the back is what makes the sharing fair: every other waiting job gets a turn before it runs again.',
      },
      {
        id: 'data-structures-algorithms-26-q4',
        prompt: 'The insert stops at the first ticket whose priority is greater than the new ticket\'s priority, not greater or equal. Why does that matter?',
        choices: [
          'It makes the loop run fewer times for every possible input',
          'It lets a new ticket jump ahead of tickets with the same priority',
          'A new ticket lands behind equal ones, so ties keep arrival order',
          'It keeps the tickets with higher priority numbers at the front',
        ],
        answer: 2,
        explanation: 'With a strict comparison the walk passes over equal tickets, so the new one is placed after them. Using >= would put it in front of them and reverse the arrival order.',
      },
      {
        id: 'data-structures-algorithms-26-q5',
        audience: { max: 'beginner' },
        prompt: 'In a priority queue, who is served first?',
        choices: [
          'The person who arrived last, however urgent the others are',
          'The person who has waited the longest, whatever their urgency',
          'The person with the longest name written on their ticket',
          'The most urgent person, even if others arrived earlier',
        ],
        answer: 3,
        explanation: 'Urgency decides. Only among equally urgent people does the one who waited longest go first.',
      },
      {
        id: 'data-structures-algorithms-26-q6',
        audience: { min: 'advanced' },
        prompt: 'A priority queue always serves the most urgent ticket, and urgent tickets keep arriving all day. What problem can this cause, and what is a standard remedy?',
        choices: [
          'The queue becomes unsorted by the end of the day, so sort it again every hour',
          'Dequeue becomes O(n²) over time, so the array should be replaced with a stack',
          'Low-priority tickets may starve; raise a ticket\'s priority as it ages',
          'Equal priorities are reordered randomly, so a random tie-breaker is needed',
        ],
        answer: 2,
        explanation: 'If something more urgent always arrives first, a low-priority item never reaches the front. Aging, which improves a waiting item\'s priority over time, bounds how long it can wait.',
      },
    ],
    task: {
      title: 'Compare two ways to schedule',
      steps: [
        'Paste the roundRobin function from this lesson into a free JavaScript playground and run it on jobs of 6, 2, 3 and 1 units with a quantum of 2.',
        'Run it again with a quantum of 100 so every job finishes in one turn. Write down the finish time of each job under both runs.',
        'For each run, add up the finish times and divide by the number of jobs to get the average finish time. Which scheduling gives the smaller average, and which gives the shortest job its answer sooner?',
        'Add a priority field to each job and write a short note on which part of the code you would change to make urgent jobs run first.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw the line of jobs on paper and move one coin as the "current job". Write each step of the first run before running the code and compare.', 'Ask an AI assistant to explain in plain words why a short job finishes sooner under round robin, and check its answer against your numbers.'] },
      { audience: { min: 'advanced' }, steps: ['Add aging to the PriorityQueue: every time a ticket is passed over, reduce its priority number by one down to 1. Show with a short example that a priority 3 ticket is eventually served even when priority 1 tickets keep arriving.', 'Count comparisons for 200 inserts of random priorities and for 400 inserts, and explain the ratio you see.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'data-structures-algorithms-p5',
  title: 'Customer service ticket queue',
  summary: 'Build the queue behind a small help desk: tickets join, urgent ones are served first, equal ones in arrival order, and a day of events is replayed as a log you can explain.',
  outcome: 'Working queue code, a printed log of a simulated day and a written explanation of which structure you chose and what each operation costs: evidence that you can pick and defend a queue design.',
  unlockAfterDay: 26,
  steps: [
    { id: 'data-structures-algorithms-p5-s1', text: 'On paper or in comments, define a ticket: an id (like "T1"), a customer name, an issue and a priority from 1 (urgent) to 3 (low). List the operations the desk needs (open a ticket, serve the next one, look at the next one, how many are waiting) and say what each does when the desk is empty.' },
    { id: 'data-structures-algorithms-p5-s2', text: 'Build the plain first-come-first-served desk as a class. Choose its storage (array with push and shift, circular array, or linked list), write open, next, peek and size, and write one sentence on why you chose it and what dequeue costs.' },
    { id: 'data-structures-algorithms-p5-s3', text: 'Make a second class, a priority desk, that serves the most urgent ticket first and, for equal priority, the one that arrived first. Test it with at least eight tickets that include ties, and print the order served.' },
    { id: 'data-structures-algorithms-p5-s4', text: 'Simulate a day. Use a counter (not a date) as the clock. Write a list of events such as "open T1 (priority 2)" and "serve", run them, and print one log line per serve: the ticket, its priority and how many clock ticks it waited.' },
    { id: 'data-structures-algorithms-p5-s5', text: 'Add a comparison counter to the priority desk. Run 100 and then 200 tickets, report the two totals, and say which operation is O(n) and what a heap (module 11) would change.' },
    { id: 'data-structures-algorithms-p5-s6', audience: { max: 'beginner' }, text: 'Keep it smaller: type in (do not paste) the Queue class from lesson 24 and the PriorityQueue from lesson 26, change the sample tickets to your own, and add a comment above each method explaining it in your own words. Skip the counting in step 5 and describe in two sentences why the priority desk is slower to insert into than the plain desk.' },
    { id: 'data-structures-algorithms-p5-s7', audience: { min: 'advanced' }, text: 'Add a bounded desk (a circular queue with capacity 20) that refuses new tickets when full and returns the refusal to the caller, and add round robin: a ticket that needs more work units than a time slice goes back into the queue. Compare the average waiting time of first come first served, priority, and round robin on the same ten tickets.' },
  ],
  submission: {
    kind: 'text',
    label: 'Your code and explanation',
    placeholder: 'Paste your code, the printed log of your simulated day, and your written explanation.',
    hint: 'Include: the code for both desks, the log, which structure you chose for each and why, the cost of enqueue and dequeue in each, how you keep equal priorities in arrival order, and what you would change for 100,000 tickets.',
  },
  rubric: [
    'Correctness: tickets are served first in first out in the plain desk, and by priority then arrival in the priority desk, including ties and an empty desk',
    'Efficiency: the cost of each operation is stated correctly (for example O(n) sorted insert, and why shift is slow in our model) and supported by a count',
    'Code organisation: small classes with clear method names, no duplicated logic, and sample data kept apart from the queue code',
    'Explanation of trade-offs: says why each structure was chosen, what its limits are and what would change at a much larger size',
    'The simulated-day log is readable and its waiting times can be checked by hand',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The code runs and prints the order tickets are served, and the explanation is in your own words, even if short'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['Includes at least five small tests (empty desk, one ticket, ties, all the same priority, reverse order) that print pass or fail'] },
    { audience: { min: 'advanced' }, items: ['The bounded desk reports a refusal when full and the explanation names a policy (reject, drop oldest or wait)', 'Compares first come first served, priority and round robin on the same data, using counts, and notes the starvation risk of priority'] },
  ],
};
