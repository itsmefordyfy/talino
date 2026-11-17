import type { Lesson, Project } from '../../../types';

/**
 * Module 2 of Data Structures and Algorithms: Time and Space Complexity (days 5 to 9, no project; lesson 8's task is the practical activity).
 * Big O is introduced here by counting first and naming second. The `big-o-growth` visual is used in lesson 6. Plain objects and functions only:
 * classes arrive with linked lists (lesson 17). `Set` appears in lesson 8 as a black box (module 8 explains it).
 */
export const lessons: Lesson[] = [
  {
    id: 'data-structures-algorithms-05',
    day: 5,
    title: 'What Algorithm Complexity Is: Counting Operations',
    summary: 'Learn why we count steps instead of seconds, count the steps of three small functions at several input sizes, and see how a count grows with the input.',
    intro: {
      objectives: [
        'Explain why we count steps instead of timing a program with a stopwatch',
        'Count the steps a short function takes for a given input size',
        'Describe how a step count grows when the input grows',
      ],
      why: 'When an AI hands you code, "it ran fast on my test" tells you almost nothing about the day the data is a thousand times bigger. Counting steps is how you predict that day.',
    },
    minutes: 25,
    skills: ['complexity'],
    body: [
      {
        type: 'paragraph',
        text: 'How do you judge whether an algorithm is a good one? The obvious answer is to run it and time it. The trouble is that the time you get belongs to one phone, on one day, with other apps running, on one list of data. Change any of those and the number changes. What stays the same across phones and days is the **amount of work**: how many small steps the algorithm takes. **Complexity** is the study of that amount of work, and in particular of how it **grows when the input grows**. This lesson shows how to count, with nothing fancier than a counter variable.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A cashier at a store rings up groceries. How long it takes depends on how many items are in the basket far more than on whether she is a little quicker or slower today. Twelve items take about twice as long as six. A basket of one item takes almost no time. So we describe the job by the **number of items**, not by the stopwatch: "ringing up takes one scan per item".',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops working: scanning a barcode and weighing a bunch of bananas are not equal work. When we count steps, we pretend that every basic step costs the same and count only the steps that repeat most. That is a simplification, and a useful one, because it predicts how the work grows even when the exact times differ.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'Three ideas, in order. First, the **input size**, written `n`: the thing that makes the job bigger, such as the number of customers in a list. Second, a **step**: one basic operation, such as comparing two values, adding two numbers, assigning to a variable or reading one item from an array. Third, the **step count** as a function of `n`: if the list has 10 items, how many steps? 100 items? We write the count down for several values of `n` and look at how it changes.',
      },
      {
        type: 'paragraph',
        text: 'The counting rules are short. A single operation is one step, and a fixed number of operations is a fixed number of steps, however long the list is. A loop that runs `n` times and does one step per turn is `n` steps. Two loops one after the other add. A loop inside a loop multiplies: if the outer loop runs `n` times and the inner loop runs `n` times for each of them, that is `n × n` turns. If the inner loop only goes over the items after the current one, the total is `(n − 1) + (n − 2) + … + 1`, which equals `n × (n − 1) / 2`.',
      },
      {
        type: 'table',
        headers: ['What the code does', 'Steps for n = 5', 'n = 10', 'n = 20', 'n = 100'],
        rows: [
          ['Read the first item', '1', '1', '1', '1'],
          ['Add up every item (one step per item)', '5', '10', '20', '100'],
          ['Compare every item with each item after it', '10', '45', '190', '4,950'],
        ],
        caption: 'Counted by code in a moment. The first never changes, the second grows in step with n, the third grows much faster.',
      },
      {
        type: 'paragraph',
        text: 'Look at the last row. Going from 5 to 10 items (twice as many) took the count from 10 to 45. Going from 10 to 20 took it from 45 to 190. From 20 to 100 (five times as many) it went from 190 to 4,950. The count is **not** growing in step with `n`. Seeing how a count grows is what complexity is for, and the next lessons give those growth patterns names.',
      },
      {
        type: 'paragraph',
        text: 'This lesson counts **time**: how many steps. Memory has a count too, and you will meet it in lesson 9. When people say "time complexity" they mean this step count as a function of the input size.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: the **input size** `n` is "how much stuff the program has to deal with", such as the number of customers in a list. A **step** is one tiny thing the program does, such as looking at one customer. To **count steps**, you do not use a clock. You add a variable named `steps`, set it to 0, and add 1 every time the program does the tiny thing. At the end, the variable holds the count. The code below does this three times, for three different jobs, and prints the count for lists of 5, 10, 20 and 100 items. Notice how each job\'s numbers change as the list gets longer.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'First, a helper that builds a list of `n` numbers, so we can try different sizes.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A list of n numbers',
        code: `function makeList(n) {
  const list = [];
  for (let i = 1; i <= n; i++) {
    list.push(i);
  }
  return list;
}`,
      },
      {
        type: 'paragraph',
        text: 'Now three jobs, each with a `steps` counter that goes up whenever it does its repeated step.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Three jobs, three counters',
        code: `function stepsFirst(list) {
  let steps = 0;
  const first = list[0];
  steps += 1;
  return steps;
}

function stepsSum(list) {
  let steps = 0;
  let sum = 0;
  for (const value of list) {
    sum += value;
    steps += 1;
  }
  return steps;
}

function stepsPairs(list) {
  let steps = 0;
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      steps += 1;
    }
  }
  return steps;
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Try four sizes',
        code: `for (const n of [5, 10, 20, 100]) {
  const list = makeList(n);
  console.log('n = ' + n + ': first ' + stepsFirst(list) + ', sum ' + stepsSum(list) + ', pairs ' + stepsPairs(list));
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**`stepsFirst`** reads one item and counts one step. It does not matter how long the list is, so the count is **1** at every size.',
          '**`stepsSum`** adds each value to `sum` and counts one step per value, so the count equals the number of items: **5, 10, 20, 100**.',
          '**`stepsPairs`** has a loop inside a loop. The outer loop picks item `i`; the inner loop compares it with every item after it, counting one step each time. That is why the counts are **10, 45, 190, 4950**.',
          '**The loop at the bottom** runs the three functions for each size and prints one line per size. Run it and your output matches the table above.',
        ],
      },
      {
        type: 'table',
        headers: ['i (outer)', 'j values (inner)', 'Steps this round', 'Total so far'],
        rows: [
          ['0', '1, 2, 3', '3', '3'],
          ['1', '2, 3', '2', '5'],
          ['2', '3', '1', '6'],
          ['3', 'none', '0', '6'],
        ],
        caption: 'stepsPairs on a list of n = 4: 3 + 2 + 1 = 6, which is 4 × 3 / 2.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Counting steps is the unit-cost model: we assume each basic operation takes constant time, which makes analysis tractable and machine-independent. It is a model, not a measurement. Constant factors, cache behaviour, allocation and the real cost of different operations are invisible to it, so two algorithms with the same growth can differ a lot in practice, and one with worse growth can win on small inputs. The model earns its place by predicting how work scales as input grows, which is what breaks systems in production. Use counts to choose an approach, then measure on realistic data when the decision is close.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Count before you look',
        text: 'I am learning to count the steps of an algorithm. Show me a short JavaScript function with a loop (or two nested loops) and a steps counter. Do not tell me how many steps it takes. Ask me how many steps it takes for n = 5 and for n = 10, and wait for my answers. Then tell me whether I am right, and if I am wrong, give me a hint about which line I miscounted before telling me the number. Repeat with a slightly harder function.',
      },
      {
        type: 'list',
        items: [
          'Run the function yourself (in a browser console or any JavaScript environment) and compare its printed count with what you and the AI said. Running it is how you find out who is right.',
          'An AI may count the wrong thing, such as counting the loop\'s setup as repeated work. Check that the count matches what the code does each turn.',
          'If the AI says one function is "faster" because it ran in fewer milliseconds, remind it that this lesson counts steps, not time.',
        ],
      },
      {
        type: 'takeaways',
        items: [
          'We measure an algorithm by counting its steps, not by timing it, because counts do not change from one phone or day to the next.',
          'The input size n is what makes the job bigger; the step count is described as a function of n.',
          'A fixed number of operations is a fixed count; a loop over n items is n steps; a loop inside a loop multiplies; two loops one after the other add.',
          'What matters most is how the count grows when n grows.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-05-predict-output-1',
          kind: 'predict-output',
          title: 'Two loops, one after the other',
          prompt: 'Predict the two lines this prints. Remember: loops one after the other add their counts.',
          concept: 'counting steps in sequential loops',
          language: 'javascript',
          code: `function countSteps(n) {
  let steps = 0;
  for (let i = 0; i < n; i++) {
    steps += 1;
  }
  for (let j = 0; j < n; j++) {
    steps += 1;
  }
  return steps;
}
console.log(countSteps(5));
console.log(countSteps(10));`,
          choices: ['10\n20', '25\n100', '5\n10', '10\n40'],
          wrongNotes: {
            '25\n100': 'That would be the count if one loop were inside the other. Here the second loop starts only after the first one has ended.',
            '5\n10': 'There are two loops, each adding n steps. Did you count only one?',
            '10\n40': 'The second loop does not run once for each turn of the first, so the counts add rather than multiply.',
          },
          hints: [
            'How many times does the first loop add 1 for n = 5?',
            'The second loop is not inside the first, so its steps are added afterwards.',
            'n steps plus n steps is 2n: 10 for n = 5 and 20 for n = 10.',
          ],
          explanation: 'Each loop runs n times, adding one step per turn. Because the loops are one after the other, the counts add: n + n = 2n, which is 10 for n = 5 and 20 for n = 10.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-05-fill-blank-1',
          kind: 'fill-blank',
          title: 'Put the counter in the right place',
          prompt: 'This function should return how many items it looked at. Fill in the blank so the counter goes up once for every item in the list.',
          concept: 'counting steps with a counter',
          language: 'javascript',
          code: `function stepsToLook(list) {
  let steps = 0;
  for (const value of list) {
    ___
  }
  return steps;
}`,
          blanks: [{ answers: ['steps += 1;', 'steps = steps + 1;', 'steps++;'], feedback: 'The counter must go up by exactly one each turn: not set to a fixed number, and not by the item\'s value.' }],
          bank: ['steps += 1;', 'steps = 1;', 'steps += value;', 'steps -= 1;'],
          tests: { kind: 'function', fn: 'stepsToLook', cases: [{ args: [[7, 8, 9]], expected: 3 }, { args: [[]], expected: 0 }, { args: [[5]], expected: 1 }] },
          hints: [
            'The counter should be 0 for an empty list and 3 for a list of 3.',
            'It goes up by the same amount each time the loop body runs.',
            'Add one to steps.',
          ],
          explanation: 'Adding one per turn makes steps equal to the number of items looked at: 0 for an empty list, 3 for three items. Setting it to a fixed value, adding the item\'s value or subtracting would give other numbers.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-05-match-1',
          kind: 'match',
          title: 'How does the count grow?',
          prompt: 'Match each job to what happens to its step count when the list size doubles.',
          concept: 'how a step count grows',
          labels: { terms: 'The job', meanings: 'When the list doubles' },
          pairs: [
            { term: 'Return the first customer in the list', definition: 'The count stays the same', note: 'Reading the first item is one step whatever the list length.' },
            { term: 'Add up every price in the list', definition: 'The count doubles', note: 'One step per item means twice as many items, twice as many steps.' },
            { term: 'Compare every customer with every other customer', definition: 'The count roughly quadruples', note: 'A loop inside a loop gives about n × n steps, and doubling n makes that about four times bigger.' },
          ],
          hints: [
            'Think of the three functions you just counted.',
            'One of them reads one item no matter what, one reads each item once, and one has a loop inside a loop.',
            'Fixed count, one step per item, and a loop inside a loop.',
          ],
          explanation: 'A fixed number of steps does not change with n; one step per item doubles when n doubles; a loop inside a loop grows with n times n, which quadruples when n doubles.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-05-q1',
        prompt: 'Why do we count an algorithm\'s steps instead of timing it with a stopwatch?',
        choices: [
          'A stopwatch cannot measure anything shorter than a second, so fast programs cannot be timed',
          'Counting steps always gives a smaller number than timing, so it is easier to compare',
          'The count is the same on any phone on any day, so it describes the algorithm itself',
          'Timing only works for programs written in other languages',
        ],
        answer: 2,
        explanation: 'Seconds change with the machine and what else it is doing; a count of steps belongs to the algorithm. The other statements are not true.',
      },
      {
        id: 'data-structures-algorithms-05-q2',
        prompt: 'A function reads each item of a list once and does one comparison per item. The list has 250 items. How many comparisons does it make?',
        choices: ['125', '250', '500', '62,500'],
        answer: 1,
        explanation: 'One comparison per item over 250 items is 250 comparisons. A loop inside a loop would give 62,500, but there is only one loop here.',
      },
      {
        id: 'data-structures-algorithms-05-q3',
        prompt: 'The "compare every item with each item after it" loop is run on a list of n = 8 items. How many comparisons does it make?',
        choices: ['28', '64', '56', '8'],
        answer: 0,
        explanation: 'Each item is compared with the items after it: 7 + 6 + 5 + 4 + 3 + 2 + 1 = 28, which is 8 × 7 / 2. Not 64, which would compare every item with every item including itself and repeated pairs.',
      },
      {
        id: 'data-structures-algorithms-05-q4',
        prompt: 'A function does 7 steps of setup, then 3 steps for each of the n items in a list. How many steps does it take for n = 100?',
        choices: ['103', '300', '700', '307'],
        answer: 3,
        explanation: 'The setup is a fixed 7 and the loop is 3 × 100 = 300, so the total is 307. Counting only the loop (300) or only the setup and one pass (103) leaves out part of the work.',
      },
      {
        id: 'data-structures-algorithms-05-q5',
        audience: { max: 'beginner' },
        prompt: 'Two cashiers ring up the same 12 items, and one is a little faster. What does counting steps leave out?',
        choices: [
          'How fast each cashier works today: it counts the work, which is the same for both',
          'The number of items in the basket, because items cannot really be counted',
          'The work itself, because the cashier\'s speed is the only thing that matters here',
        ],
        answer: 0,
        explanation: 'The step count describes the job (12 items, 12 scans). It deliberately leaves out how quickly a particular cashier or phone does each step.',
      },
      {
        id: 'data-structures-algorithms-05-q6',
        audience: { min: 'advanced' },
        prompt: 'Two functions have the same step count as n grows, yet one is clearly faster on real data. What explains this best?',
        choices: [
          'The step count must have been calculated wrongly by whoever counted it, so recount',
          'The model ignores constant factors, memory behaviour and the different real costs of operations',
          'Step counts only apply to loops that are written with the keyword for in them',
        ],
        answer: 1,
        explanation: 'The model assumes all basic steps cost the same. Real costs differ, so equal counts do not guarantee equal times. The count is for predicting growth, not for ranking close competitors.',
      },
    ],
    task: {
      title: 'Count the steps of your own function',
      steps: [
        'In any free JavaScript environment, copy `makeList`, the three counting functions and the loop from the lesson. Run it and check your output against the table.',
        'Write a fourth function `stepsMax(list)` that finds the largest number in the list with a loop and counts how many items it looks at. Predict its count for n = 5, 10 and 100, then run it.',
        'Write one sentence for each of the four functions saying how its count changes when n doubles.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before you run `stepsMax`, count the steps for n = 5 on paper by writing the five items in a row and putting a tick under each one the loop looks at.'] },
      { audience: { min: 'advanced' }, steps: ['Add a counter for comparisons and a separate counter for assignments in `stepsMax`, and show that the two counts can differ by a constant factor while growing the same way as n grows.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-06',
    day: 6,
    title: 'Big O Notation: Constant, Logarithmic and Linear Time',
    summary: 'Name how a step count grows with Big O, dropping constants and smaller terms, and meet the three gentlest growth rates: constant, logarithmic and linear.',
    intro: {
      objectives: [
        'Explain Big O as a description of how a step count grows, not a measurement of time',
        'Simplify a step count by dropping constants and smaller terms',
        'Recognize constant, logarithmic and linear growth in a small piece of code',
      ],
      why: 'Big O is the shared language for talking about speed. When you read an AI\'s claim that a solution is "O(n)", or ask it to improve an "O(n²)" one, you need to know exactly what the words promise.',
    },
    minutes: 25,
    skills: ['complexity'],
    body: [
      {
        type: 'paragraph',
        text: 'In the last lesson you counted steps and saw that a count can stay fixed, grow in step with the input, or grow much faster. Counting every function at several sizes works, but it is slow to say. **Big O notation** is a short way of naming how a step count grows as the input size `n` grows. It is written `O(...)`, read "order of", with a simple expression inside. This lesson names three growth patterns: `O(1)`, `O(log n)` and `O(n)`. The rest come next lesson.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A taxi has a flag-down charge plus a rate per kilometre. For a 2 km trip the flag-down charge is a big share of the fare. For a 200 km trip you barely notice it: the per-kilometre part has taken over. Big O does the same thing to a step count. As `n` gets large, one part of the count (the part that grows) dominates, so we keep that part and drop the rest.',
      },
      {
        type: 'paragraph',
        text: 'A second picture, for the odd one out, `O(log n)`: the guessing game. "I am thinking of a number from 1 to 1,000. Higher or lower?" Each answer removes half of the remaining possibilities, so you find the number in 10 guesses, not 1,000. Where the pictures stop working: Big O deliberately ignores the flag-down charge, but on a short trip that charge is exactly what matters. Big O describes growth at large `n`; it is not a prediction of the stopwatch at small `n`.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'Suppose counting a function gives `3n + 5` steps. For `n = 10` that is 35; for `n = 100` it is 305; for `n = 1,000` it is 3,005; for `n = 1,000,000` it is 3,000,005. Look at the count divided by `n`: 3.5, 3.05, 3.005 and 3.000005. As `n` grows, the count behaves like `3n`, and the `+ 5` stops mattering. The `3` is a constant that depends on how we chose to count a step, and it does not change the way the count grows: doubling `n` still doubles the count. So Big O drops both: `3n + 5` is `O(n)`.',
      },
      {
        type: 'paragraph',
        text: 'The two rules: **drop constant factors** (`3n` becomes `n`) and **drop smaller terms** (`n + 50` becomes `n`, and later `n² + n` becomes `n²`). What is left is the part that grows fastest. Now the three growth patterns:',
      },
      {
        type: 'list',
        items: [
          '**`O(1)`, constant:** the count does not depend on `n`. Reading the first item, or an item by its position, is one step however long the list is.',
          '**`O(n)`, linear:** the count grows in step with `n`. One pass over a list, doing a fixed amount of work per item, is linear. Double the list, double the steps.',
          '**`O(log n)`, logarithmic:** the count grows very slowly, because each step throws away a fixed fraction of the work (usually half). Double `n` and you add just one more step. Here `log n` means "how many times can I halve `n` before I reach 1".',
        ],
      },
      {
        type: 'table',
        headers: ['n', 'O(1)', 'O(log n), about', 'O(n)'],
        rows: [
          ['10', '1', '3', '10'],
          ['100', '1', '7', '100'],
          ['1,000', '1', '10', '1,000'],
          ['1,000,000', '1', '20', '1,000,000'],
        ],
        caption: 'Steps for each growth pattern. A million items cost the logarithmic pattern about 20 steps.',
      },
      {
        type: 'visual',
        id: 'big-o-growth',
        caption: 'Under "Show", keep O(1), O(log n) and O(n) switched on. Use "Jump to n" to move n from 1 to 64 and watch each curve. Then switch the scale between linear and log: which curve flattens, and which keeps climbing?',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: Big O answers one question, "if I give this program ten times more data, how much more work does it do?" `O(1)` means no more work at all. `O(n)` means ten times more work. `O(log n)` means only a few more steps. The letter `n` is the amount of data. The brackets hold the rule for how the work grows. The `O` does not stand for anything you need to remember. Big O is not a stopwatch and it is not exact: `3n + 5` and `n` are both `O(n)` because they grow the same way. The code below counts how many times you can halve a number, which is where `log n` comes from, and prints the count for some big numbers.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'First, halving. `halvings(n)` counts how many times `n` can be cut in half, rounding down, before it reaches 1.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Counting halvings',
        code: `function halvings(n) {
  let steps = 0;
  let remaining = n;
  while (remaining > 1) {
    remaining = Math.floor(remaining / 2);
    steps += 1;
  }
  return steps;
}

for (const n of [8, 1000, 1000000, 1000000000]) {
  console.log(n, halvings(n));
}`,
      },
      {
        type: 'paragraph',
        text: 'Second, the "drop the constants" idea. A function whose count is `3n + 5`:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A count of 3n + 5',
        code: `const cost = (n) => 3 * n + 5;

for (const n of [10, 100, 1000, 1000000]) {
  console.log(n, cost(n));
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**`halvings`** keeps a value `remaining`, starting at `n`. Each turn it halves it (rounding down) and counts one step, and stops at 1. For `8`: 8, 4, 2, 1, which is **3** steps.',
          '**The first loop** prints `8 3`, `1000 9`, `1000000 19` and `1000000000 29`. A thousand million items need only 29 halvings: that is why `O(log n)` is so cheap.',
          '**`cost(n)`** is the function `3n + 5`. It prints `10 35`, `100 305`, `1000 3005` and `1000000 3000005`. The count is always about `3n`, so it grows exactly like `n`: that is `O(n)`.',
        ],
      },
      {
        type: 'table',
        headers: ['Step', 'remaining before', 'remaining after', 'steps so far'],
        rows: [
          ['1', '8', '4', '1'],
          ['2', '4', '2', '2'],
          ['3', '2', '1', '3'],
        ],
        caption: 'halvings(8): the loop stops once remaining reaches 1.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Formally, `f(n)` is `O(g(n))` if there are constants `c` and `n0` such that `f(n) ≤ c · g(n)` for all `n ≥ n0`. Big O is an upper bound, so a linear algorithm is also, technically, `O(n²)`; when people say `O(n)` they mean the tightest bound they can prove, and strictly that is Θ(n). The base of the logarithm does not matter, because logs of different bases differ by a constant factor. Big O is not worst case: it describes growth, and you apply it to best, average or worst case separately, which lesson 9 does. And remember what it hides: constants and lower terms decide the winner at the sizes you actually run.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'If you have built a few small projects, you have probably felt Big O already, just without its name: a list that was fine with ten items and sluggish with a thousand. Next time that happens, do not guess where the slowness is. Add a counter to the line you suspect, run it for 10 items and for 100, and compare the two counts. If the count grew about ten times, that line is linear. If it grew about a hundred times, it is quadratic. That one comparison tells you which growth rate you are dealing with before you change any code.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Test my reading of Big O',
        text: 'I am learning Big O notation. I will describe how the number of steps of a few functions changes, and you tell me whether I name the right growth (constant, logarithmic or linear). First ask me what O(1), O(n) and O(log n) mean in my own words, and wait for my answer. Then give me four short JavaScript functions, one at a time, with no comments about their speed, and ask me to name the Big O of each. Do not tell me the answer until I try. If I am wrong, ask me what happens to the steps when n doubles.',
      },
      {
        type: 'list',
        items: [
          'Check each of the AI\'s answers by doubling `n` in your head: if the steps stay the same it is `O(1)`, if they double it is `O(n)`, if they go up by one it is `O(log n)`.',
          'An AI may call something `O(log n)` because it "looks like binary search" when the loop actually runs `n` times. Count what the code does, not what it resembles.',
          'Ask the AI to show the constants it dropped. A good answer can say "this is 3n + 5, which is O(n)".',
        ],
      },
      {
        type: 'takeaways',
        items: [
          'Big O names how a step count grows with the input size n, not how many seconds a program takes.',
          'To simplify a count, drop constant factors and smaller terms: 3n + 5 is O(n).',
          'O(1) does not depend on n; O(n) grows in step with n; O(log n) grows very slowly because each step discards a fixed fraction of the work.',
          'Doubling n tells you the story: the same steps for O(1), twice as many for O(n), one more step for O(log n).',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-06-match-1',
          kind: 'match',
          title: 'Name the growth',
          prompt: 'Match each piece of work to its Big O.',
          concept: 'recognizing constant, linear and logarithmic growth',
          labels: { terms: 'The work', meanings: 'Big O' },
          pairs: [
            { term: 'Read the item at position 7 of an array', definition: 'O(1)', note: 'The address is computed in one step, whatever the array length.' },
            { term: 'Visit every customer in a list once, doing a fixed amount of work for each', definition: 'O(n)', note: 'One pass with a fixed cost per item grows in step with the list.' },
            { term: 'Cut the remaining range in half until one item is left', definition: 'O(log n)', note: 'Each step throws away half of what is left, so doubling n adds only one step.' },
          ],
          hints: [
            'Ask what happens to the steps when the list doubles.',
            'One stays the same, one doubles, and one goes up by a single step.',
            'Fixed work: O(1). One pass: O(n). Halving: O(log n).',
          ],
          explanation: 'A fixed number of steps is O(1), a pass over all the items is O(n), and a routine that discards half of what is left on each step is O(log n).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-06-predict-output-1',
          kind: 'predict-output',
          title: 'How many halvings?',
          prompt: 'Predict the three lines this prints. Work out the halvings by hand: 16 becomes 8, 4, 2, 1.',
          concept: 'logarithmic growth by counting',
          language: 'javascript',
          code: `function halvings(n) {
  let steps = 0;
  let remaining = n;
  while (remaining > 1) {
    remaining = Math.floor(remaining / 2);
    steps += 1;
  }
  return steps;
}
console.log(halvings(16));
console.log(halvings(100));
console.log(halvings(1));`,
          choices: ['4\n6\n0', '16\n100\n1', '4\n7\n1', '5\n7\n0'],
          wrongNotes: {
            '16\n100\n1': 'That would be the number of steps if it counted down one at a time. This function halves, so the counts are small.',
            '4\n7\n1': 'For 100 the sequence is 50, 25, 12, 6, 3, 1, with rounding down. Count the arrows. And a value of 1 needs no halving at all.',
            '5\n7\n0': '16 becomes 8, then 4, 2 and 1: count the halvings, not the numbers in the list.',
          },
          hints: [
            'For 16, write the values it passes through: 16, 8, 4, 2, 1. Count the steps between them.',
            'For 100 round down each time: 50, 25, 12, 6, 3, 1.',
            'When n is already 1 the loop does not run at all.',
          ],
          explanation: '16 takes 4 halvings (8, 4, 2, 1). 100 takes 6 (50, 25, 12, 6, 3, 1), because each halving rounds down. For 1, `remaining > 1` is false at the start, so there are 0.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-06-fill-blank-1',
          kind: 'fill-blank',
          title: 'Drop the constants',
          prompt: 'Fill in each blank with the Big O of the step count shown. Drop constants and smaller terms.',
          concept: 'simplifying a step count',
          language: 'text',
          code: `steps(n) = 4n + 10   ->   O(___)
steps(n) = 7         ->   O(___)`,
          blanks: [
            { answers: ['n'], feedback: 'The 4 is a constant factor and the 10 is a smaller term. What is left is the part that grows.' },
            { answers: ['1'], feedback: 'A count that never depends on n is constant.' },
          ],
          bank: ['n', '1', 'log n', 'n + 10'],
          hints: [
            'For each count, ask: does it change when n changes?',
            'In 4n + 10 only the 4n part grows with n. Drop the 4 and the 10.',
            'The first is linear and the second is constant.',
          ],
          explanation: '4n + 10 grows in step with n once the constant 4 and the smaller term 10 are dropped, so it is O(n). A fixed 7 never depends on n, so it is O(1).',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-06-q1',
        prompt: 'A function takes 5n + 20 steps. What is its Big O?',
        choices: ['O(20)', 'O(n)', 'O(5n)', 'O(n + 20)'],
        answer: 1,
        explanation: 'Drop the constant factor 5 and the smaller term 20. What is left, n, is the part that grows, so the function is O(n).',
      },
      {
        id: 'data-structures-algorithms-06-q2',
        prompt: 'Doubling the list adds exactly one more step to a function. Which growth does this describe?',
        choices: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
        answer: 3,
        explanation: 'Adding a fixed number of steps each time n doubles is the signature of halving, which is O(log n). O(1) would add none and O(n) would double the steps.',
      },
      {
        id: 'data-structures-algorithms-06-q3',
        prompt: 'A function reads the item at position 50 of an array. The array grows from 100 items to 100,000. What happens to its step count?',
        choices: ['It stays the same', 'It grows 1,000 times', 'It grows by about 10 steps'],
        answer: 0,
        explanation: 'Reading an item by its position is one step whatever the array length, so the count is constant, O(1).',
      },
      {
        id: 'data-structures-algorithms-06-q4',
        prompt: 'Roughly how many times can you halve one million before you reach 1?',
        choices: ['500,000', '1,000', 'About 20', '2'],
        answer: 2,
        explanation: 'The code printed 19 for 1,000,000 (rounding down at each step), so about 20. This is why logarithmic growth is so cheap.',
      },
      {
        id: 'data-structures-algorithms-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In O(n), what does the letter n stand for?',
        choices: ['The number of seconds the program takes to run on your phone', 'The name of the algorithm that is being studied here', 'The size of the input, such as the number of items in a list'],
        answer: 2,
        explanation: 'n is how much data the program has to deal with. Big O describes how the work grows as n grows.',
      },
      {
        id: 'data-structures-algorithms-06-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate says "an O(n) algorithm always beats an O(n²) one". What is the flaw?',
        choices: [
          'Big O is only defined for the sorting algorithms that are covered in module 15',
          'Big O hides constants and lower terms, so at small n worse growth can still be faster',
          'O(n²) algorithms always run at exactly the same speed as O(n) ones do',
        ],
        answer: 1,
        explanation: 'Big O describes growth at large n and drops constants. At small sizes, or with heavy constants, a worse-growing algorithm can win; so you also consider the sizes you really run.',
      },
    ],
    task: {
      title: 'See log n with your own numbers',
      steps: [
        'In any free JavaScript environment, run `halvings` for n = 10, 100, 1,000, 10,000 and 100,000. Write each result in a table with a column for n and one for the halvings.',
        'Next to it, write n itself. How does the second column compare with the first as n grows? Describe it in one sentence.',
        'Change `cost` to `(n) => 10 * n + 1000`. Run it for n = 10 and for n = 1,000,000. At which size does the `+ 1000` matter, and at which does it not? Write what that tells you about dropping smaller terms.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Play the "higher or lower" game with a friend for a number from 1 to 100 and count how many guesses it takes if you always guess the middle. Compare with `halvings(100)`.'] },
      { audience: { min: 'advanced' }, steps: ['Change `Math.floor(remaining / 2)` to `Math.floor(remaining / 3)` and compare the counts. Explain why the growth is still logarithmic even though the base changed.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-07',
    day: 7,
    title: 'Linearithmic and Quadratic Time: Understanding Growth Rates',
    summary: 'Meet O(n log n) and O(n²), compare every growth rate side by side, and learn what each means when the data gets bigger.',
    intro: {
      objectives: [
        'Recognize linearithmic O(n log n) and quadratic O(n²) growth in code',
        'Compare the growth rates from O(1) to O(n²) with real step counts',
        'Predict what happens to a step count when the input doubles',
      ],
      why: 'The difference between O(n log n) and O(n²) is the difference between an app that handles a million records and one that freezes at ten thousand. AI-written code lands in both, often without saying so.',
    },
    minutes: 25,
    skills: ['complexity'],
    body: [
      {
        type: 'paragraph',
        text: 'Last lesson you met three gentle growth rates. Two more cover most of the code you will meet: **`O(n log n)`**, called linearithmic, and **`O(n²)`**, called quadratic. Both are common, and they sit on opposite sides of a line that matters a great deal: one is the cost of doing a good job of something big, the other is the cost of an accidental nested loop. This lesson counts both, puts all five growth rates in one table, and teaches you the habit of asking "what happens when the input doubles?"',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A barangay fiesta has `n` guests. In the first version, every guest shakes hands with every other guest. With 10 guests that is 45 handshakes. With 20 guests it is 190. With 100 guests it is 4,950. Doubling the guests nearly **quadruples** the handshakes. That is quadratic growth.',
      },
      {
        type: 'paragraph',
        text: 'In the second version, each guest only has to find their own name on a sorted guest list at the door, by opening it in the middle and discarding half each time. That is a few looks per guest, about `log n`, and it happens once for each of the `n` guests: `n × log n` looks in total. Doubling the guests only a little more than doubles the work. That is linearithmic growth. Where the picture stops working: real fiestas have no neat counts, and the handshake count ignores that some guests are slower than others. The shape of the growth is the point.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: '**`O(n²)`, quadratic,** comes from a loop inside a loop where both loops run over the input. If the outer loop runs `n` times and the inner loop runs `n` times for each of those, that is `n × n`. The pair-comparing loop from lesson 5 does `n(n − 1)/2` steps, which is `n²/2 − n/2`. Drop the constant `1/2` and the smaller term `n/2` and you are left with `O(n²)`. So "half of n squared" is still quadratic.',
      },
      {
        type: 'paragraph',
        text: '**`O(n log n)`, linearithmic,** is a halving job repeated `n` times, or equivalently a job that is split in half again and again (about `log n` levels) with the whole list touched once at each level. The best general sorting algorithms land here: module 15 explains how. Until then, treat "sorting well" as costing about `n log n` steps, and just recognize the shape.',
      },
      {
        type: 'table',
        headers: ['n', 'log n, about', 'n', 'n log n, about', 'n²'],
        rows: [
          ['10', '3', '10', '33', '100'],
          ['100', '7', '100', '664', '10,000'],
          ['1,000', '10', '1,000', '9,966', '1,000,000'],
          ['10,000', '13', '10,000', '132,877', '100,000,000'],
        ],
        caption: 'The five growth rates side by side (O(1) is always 1). At 10,000 items n² is about 750 times bigger than n log n.',
      },
      {
        type: 'paragraph',
        text: 'The most useful habit is to **double the input and watch the count**. If it stays the same, the work is constant. If it doubles, it is linear. If it a bit more than doubles, it is linearithmic. If it quadruples, it is quadratic. You can do this with code or with a pencil, and it works even when you cannot name the growth.',
      },
      {
        type: 'paragraph',
        text: 'Why it matters in practice: suppose a feature takes about 2 seconds when you have 1,000 customers and its work is exactly quadratic. With 10,000 customers the work is 100 times larger, so it takes about 200 seconds, more than three minutes. With the linearithmic version it would take roughly 13 seconds. The exact speed depends on the machine, but the ratio does not.',
      },
      {
        type: 'details',
        summary: 'Growth rates worse than n squared (optional)',
        body: [
          'Some work grows much faster. A job that must try every subset of `n` items has `2^n` subsets: 1,024 for 10 items, 1,048,576 for 20 and 1,073,741,824 for 30. Adding one item doubles the work. That is **exponential** growth, written `O(2ⁿ)`. Trying every ordering of `n` items is worse still: `n!`, factorial growth. Both become hopeless for small `n`, which is why algorithm designers work so hard to avoid them (module 16 shows techniques that help).',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: some work grows gently with the amount of data and some grows wildly. If you ask 100 people to each shake hands with everyone else, you get thousands of handshakes. If you ask them each to look up a name in a sorted list, you get a few hundred looks. The code below counts both at several sizes. "Quadratic" means the work grows with the square of the amount of data: double the data and the work becomes four times bigger. "Linearithmic" is a clumsy word for "a little more than linear". Do not worry about memorizing the names. What matters is that you can look at two nested loops and say "this will get slow".',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Two functions that count steps. In the first, each of `n` turns halves a copy of `n` down to 1, which is about `log n` steps per turn. In the second, a loop inside a loop runs `n × n` times.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Counting n log n and n squared',
        code: `function stepsLinearithmic(n) {
  let steps = 0;
  for (let i = 0; i < n; i++) {
    let remaining = n;
    while (remaining > 1) {
      remaining = Math.floor(remaining / 2);
      steps += 1;
    }
  }
  return steps;
}

function stepsQuadratic(n) {
  let steps = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      steps += 1;
    }
  }
  return steps;
}`,
      },
      {
        type: 'paragraph',
        text: 'Now double the input again and again, and print both counts.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Double n and watch',
        code: `for (const n of [100, 200, 400, 1000, 2000]) {
  console.log(n, stepsLinearithmic(n), stepsQuadratic(n));
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**`stepsLinearithmic`:** for each of `n` values of `i`, the inner `while` halves `remaining` from `n` down to 1 and counts a step each time. For `n = 100` that is 6 halvings per turn, so `100 × 6 = 600` steps.',
          '**`stepsQuadratic`:** the inner loop runs `n` times for each of the outer loop\'s `n` turns, so the count is exactly `n × n`: `10,000` for `n = 100`.',
          '**The printed lines:** `100 600 10000`, `200 1400 40000`, `400 3200 160000`, `1000 9000 1000000`, `2000 20000 4000000`.',
        ],
      },
      {
        type: 'table',
        headers: ['n', 'n log n steps', 'Ratio to the previous', 'n² steps', 'Ratio to the previous'],
        rows: [
          ['100', '600', '', '10,000', ''],
          ['200', '1,400', 'about 2.3 times', '40,000', '4 times'],
          ['400', '3,200', 'about 2.3 times', '160,000', '4 times'],
        ],
        caption: 'Every time n doubles, the quadratic count quadruples and the linearithmic count only a little more than doubles.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Quadratic behaviour in production rarely looks like two visible nested loops. It hides in a loop that calls `Array.prototype.includes`, `indexOf`, `find`, `splice` or `slice` on the same collection (each is itself a pass over the data), in string concatenation inside a loop that copies the string each time, and in repeated "filter inside map" patterns. It tends to pass tests, since test data is small, and then fail at scale. Linearithmic is usually the price of a good comparison sort, or of an `n`-times lookup in a sorted structure, and is generally acceptable to millions of items. Know the pattern, count with a doubling test, and look at what each library call costs.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Predict, then check the doubling',
        text: 'I am learning to recognize O(n log n) and O(n²). Show me a short JavaScript function that has a loop inside a loop, without saying how slow it is. Ask me what happens to the number of steps if the input size doubles, and wait for my answer. Then show a second function with one loop that calls a halving step inside it, and ask me the same question. Finally, ask me to say which of the two I would worry about with 100,000 items and why. Give me hints before the answers.',
      },
      {
        type: 'list',
        items: [
          'Run both functions yourself with a counter at n and 2n. The doubling ratio (about 4 times, or a little over 2) is how you tell them apart.',
          'An AI may say a nested loop is always O(n²). If the inner loop runs a fixed number of times, such as 3, it is O(n). Look at what each loop goes over.',
          'Ask the AI to show its arithmetic for the steps at one size. If it cannot, it may be guessing.',
        ],
      },
      {
        type: 'takeaways',
        items: [
          'O(n²), quadratic, comes from a loop inside a loop where both go over the input; the "half" and the smaller terms are dropped.',
          'O(n log n), linearithmic, is a halving job repeated n times, or a split-in-half job that touches all n items at each level; good sorting algorithms live here.',
          'Doubling the input quadruples a quadratic count and slightly more than doubles a linearithmic one.',
          'At 10,000 items, n² is about 750 times bigger than n log n: this is why the difference decides whether a feature scales.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-07-predict-output-1',
          kind: 'predict-output',
          title: 'Double and square',
          prompt: 'Predict the two lines this prints. The second call has twice the input of the first.',
          concept: 'quadratic growth by counting',
          language: 'javascript',
          code: `function countPairsTwice(n) {
  let steps = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      steps += 1;
    }
  }
  return steps;
}
console.log(countPairsTwice(3));
console.log(countPairsTwice(6));`,
          choices: ['9\n36', '9\n18', '6\n12', '3\n6'],
          wrongNotes: {
            '9\n18': 'Doubling the input does not just double a nested loop\'s count. The inner loop doubles as well.',
            '6\n12': 'The loops are nested, so the count is n times n, not n plus n.',
            '3\n6': 'A single loop would give n. These loops are nested, so multiply.',
          },
          hints: [
            'Both loops run n times, and one is inside the other.',
            'The count is n times n: 3 × 3 for the first call.',
            '3 × 3 is 9 and 6 × 6 is 36.',
          ],
          explanation: 'A loop inside a loop gives n × n steps: 9 for n = 3 and 36 for n = 6. Doubling n made the count four times bigger, the quadratic signature.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-07-match-1',
          kind: 'match',
          title: 'Which growth is this?',
          prompt: 'Match each job to its Big O.',
          concept: 'recognizing growth rates',
          labels: { terms: 'The job', meanings: 'Big O' },
          pairs: [
            { term: 'Compare every customer with every other customer to find duplicates', definition: 'O(n²)', note: 'Every pair is checked: a loop inside a loop over the same data.' },
            { term: 'For each of n customers, find a place in a sorted list by repeatedly halving', definition: 'O(n log n)', note: 'About log n looks for each of the n customers.' },
            { term: 'Print each customer once', definition: 'O(n)', note: 'One pass with a fixed cost per customer.' },
          ],
          hints: [
            'Which job has a loop inside a loop over the same data?',
            'Which one repeats a halving job n times?',
            'Every pair is quadratic, halving for each is n log n, one pass is linear.',
          ],
          explanation: 'Comparing every pair is O(n²). Doing a halving search for each of n items is n times log n. One pass over the data is O(n).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-07-scenario-1',
          kind: 'scenario',
          title: 'The slow duplicate check',
          prompt: 'Choose the best reading of this situation.',
          concept: 'predicting growth before it hurts',
          situation: 'A feature that compares every customer with every other to find duplicate names takes about 2 seconds with 1,000 customers. The shop expects 10,000 customers next year. The work is quadratic.',
          options: [
            { text: 'Expect roughly 100 times longer, about 200 seconds, and look for a design that avoids comparing every pair', quality: 'best', consequence: 'Ten times the customers means a hundred times the pairs, so the check will take more than three minutes. Redesigning now avoids discovering it in production.' },
            { text: 'Wait until there are 10,000 customers, then measure how long it takes', quality: 'acceptable', consequence: 'You will find out, but only after the problem exists. The doubling test would have told you in advance.' },
            { text: 'Expect about 20 seconds, because 10 times the customers means 10 times the time', quality: 'poor', consequence: 'That is linear thinking. Quadratic work grows with the square: ten times the data is a hundred times the work.' },
          ],
          hints: [
            'How many pairs are there for 1,000 customers compared with 10,000?',
            'Ten times as many customers means ten times ten times as many pairs.',
            'The work becomes 100 times bigger, so plan for about 200 seconds.',
          ],
          explanation: 'Quadratic work grows with the square of the input: 10 times the customers is 100 times the pairs. Seeing that in advance is the whole point of counting growth.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-07-q1',
        prompt: 'The input to a quadratic algorithm doubles. About how many times more steps does it take?',
        choices: ['2 times as many', '8 times as many', '16 times as many', '4 times as many'],
        answer: 3,
        explanation: 'Quadratic means the work grows with the square of n, so doubling n multiplies the work by 2 × 2 = 4.',
      },
      {
        id: 'data-structures-algorithms-07-q2',
        prompt: 'A loop compares each of n items with only the items after it, for about n × (n − 1) / 2 comparisons. What is its Big O?',
        choices: [
          'O(n²), because the one half and the smaller term are dropped',
          'O(n²/2), because the half cannot be dropped',
          'O(n), because each loop is linear on its own',
          'O(2n), because every item is compared twice',
        ],
        answer: 0,
        explanation: 'n(n − 1)/2 is n²/2 − n/2. Dropping the constant 1/2 and the smaller term leaves n², so it is O(n²).',
      },
      {
        id: 'data-structures-algorithms-07-q3',
        prompt: 'A function repeats a halving search once for each of n items. Which growth does it have?',
        choices: ['O(log n)', 'O(n²)', 'O(n log n)'],
        answer: 2,
        explanation: 'About log n steps for each of n items is n × log n. The halving alone would be O(log n), but it happens n times.',
      },
      {
        id: 'data-structures-algorithms-07-q4',
        prompt: 'At n = 10,000, an n² algorithm does about 100,000,000 steps and an n log n one about 132,877. What is the fair conclusion?',
        choices: [
          'The two are about the same, because both contain n',
          'The n log n algorithm does roughly 750 times fewer steps, so it scales far better',
          'The n² algorithm is better, because its number is easier to write',
          'The n log n algorithm is slower, because it has an extra factor',
        ],
        answer: 1,
        explanation: '100,000,000 divided by about 133,000 is roughly 750. The extra factor in n log n is small compared with the extra factor of n in n².',
      },
      {
        id: 'data-structures-algorithms-07-q5',
        audience: { max: 'beginner' },
        prompt: 'At a fiesta, every guest shakes hands with every other guest. If the number of guests doubles, what happens to the handshakes?',
        choices: [
          'They stay about the same, since the guests are the same people',
          'They double exactly, because there are twice as many guests',
          'They become about four times as many',
        ],
        answer: 2,
        explanation: 'Every pair shakes hands, so the count grows with the square of the number of guests. Doubling the guests makes it about four times bigger.',
      },
      {
        id: 'data-structures-algorithms-07-q6',
        audience: { min: 'advanced' },
        prompt: 'A function has one loop over n items and, inside it, calls `items.includes(x)` on the same array. What is a good estimate of its growth?',
        choices: [
          'O(n²), because includes is itself a scan of the array',
          'O(n), because there is only one loop that you can see in the code',
          'O(n log n), because includes halves the array each time it runs',
        ],
        answer: 0,
        explanation: '`includes` checks items one by one, up to n of them, and it runs on each of the n turns. The hidden scan makes the whole thing quadratic.',
      },
    ],
    task: {
      title: 'Double the input and watch the count',
      steps: [
        'In any free JavaScript environment, copy `stepsLinearithmic`, `stepsQuadratic` and the printing loop. Run it and check the printed numbers against the lesson.',
        'Change the sizes to 500, 1,000, 2,000 and 4,000. For each pair of neighbouring sizes, divide the second count by the first and write down the ratio for both functions.',
        'Write two sentences: what ratio does a quadratic count show when n doubles, and what ratio does the linearithmic one show? Then say which you would be more worried about for 100,000 items.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Do the handshake count by hand for 2, 3, 4 and 5 guests (every pair once) and write the four numbers in a row. See if you can spot how each number is made from the one before.'] },
      { audience: { min: 'advanced' }, steps: ['Add a third function with three nested loops over n and show that doubling n multiplies the count by 8. Name its growth and give a real example where it can happen by accident.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-08',
    day: 8,
    title: 'Analyzing Loops and Comparing Two Solutions',
    summary: 'Learn the rules for reading a loop\'s cost, spot hidden loops, and compare two correct solutions by counting at growing input sizes.',
    intro: {
      objectives: [
        'Work out the Big O of sequential, nested and halving loops',
        'Spot a hidden loop inside a built-in method call',
        'Compare two correct solutions by counting their steps as the input grows',
      ],
      why: 'Most of the time you will not design an algorithm from scratch. You will read one that someone, or an AI, wrote, and decide whether it is good enough. Reading loops for their cost is the skill that decision rests on.',
    },
    minutes: 30,
    skills: ['complexity'],
    body: [
      {
        type: 'paragraph',
        text: 'You can now count steps and name growth rates. This lesson turns that into a method you can use on any code you read. First, a small set of rules for analyzing loops. Second, the places where cost hides, such as a method that looks like one step but is secretly a loop. Third, a way to compare two solutions to the same problem and decide between them. The practical task at the end of the lesson puts all three to work on two ways of searching.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A teacher wants to know whether any student\'s name appears twice on a 40-name attendance sheet. Way one: take every name and compare it with every other name on the sheet. Way two: read the names in order, and keep a second sheet where you write each name once you have seen it; before writing a name, check whether it is already on the second sheet. Both ways give the right answer. The first does 780 comparisons (each pair once) and the second does about 40 checks, but it needs a second sheet of paper.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops working: checking a name on the second sheet is only quick if the sheet is organized so you can find a name fast. That organization is a hash table, which module 8 teaches. For now, take it on trust and count the checks.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'To find a piece of code\'s Big O, follow four steps. Decide what `n` is (what grows). Find the work done in the innermost body. Work out how many times it runs, multiplying nested loops and adding sequential ones. Then drop constants and smaller terms. The table gives the rules for the shapes you will meet most.',
      },
      {
        type: 'table',
        headers: ['The code shape', 'Steps', 'Big O'],
        rows: [
          ['A fixed number of simple statements', 'A fixed number', 'O(1)'],
          ['One loop over n items', 'n', 'O(n)'],
          ['Two loops one after the other, both over n', 'n + n = 2n', 'O(n)'],
          ['A loop over n with a loop over n inside it', 'n × n', 'O(n²)'],
          ['A loop over n with a loop over a different size m inside it', 'n × m', 'O(n × m)'],
          ['A loop over n whose inner loop runs only up to i', 'about n²/2', 'O(n²)'],
          ['A loop that halves what is left each time', 'about log n', 'O(log n)'],
          ['A loop over n that calls a built-in that scans the same data', 'n × n', 'O(n²)'],
        ],
        caption: 'Sequential work adds, nested work multiplies. The larger part wins once constants and smaller terms are dropped.',
      },
      {
        type: 'paragraph',
        text: 'Pay special attention to the last row. A method such as `includes` or `indexOf` looks like one step, but it checks items one by one until it finds a match, so on a list of `n` items it can take up to `n` steps. Put one of them inside a loop over the same list and you have a nested loop without writing one. When you read code, always ask what each method call costs.',
      },
      {
        type: 'paragraph',
        text: 'To compare two solutions, first make sure they give the same answers. Then count each at several sizes, such as `n` and `10n`, and see how the counts grow. Then ask whether the one that grows slower costs something else: memory, readability, or code you cannot test. Pick the one that is fast enough at the sizes you really expect, and do not make code harder to read to save time you will never notice.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'How to decide between two solutions: correctness first, then growth, then everything else.',
        source: 'flowchart TD\n  A[Two solutions to one problem] --> B{Same answers on test cases?}\n  B -->|no| C[Fix the wrong one first]\n  B -->|yes| D[Count steps at n and at 10n]\n  D --> E{Is one growing much slower?}\n  E -->|no| F[Choose the simpler, clearer one]\n  E -->|yes| G{Memory or readability cost acceptable?}\n  G -->|yes| H[Choose the slower-growing one]\n  G -->|no| F',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: reading code for its cost means asking "how many times does the busiest line run, as the list gets longer?" A loop that goes over the list once runs its lines once per item. If a second loop sits inside the first, its lines run once per item for every item, which is many more times. When you compare two ways of doing the same job, you do not run them with a stopwatch. You count how many times the busy line runs for a small list and a bigger list and see which count grows faster. The code below does exactly this for the attendance-sheet problem, then for two ways of searching a list.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'First, the loop shapes. This function counts three loops: a single pass, a loop over `n` with a loop over `m` inside it, and a loop whose inner part only goes up to `i`.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Counting three loop shapes',
        code: `function loopShapes(n, m) {
  let one = 0;
  let nested = 0;
  let triangle = 0;
  for (let i = 0; i < n; i++) {
    one += 1;
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      nested += 1;
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      triangle += 1;
    }
  }
  console.log(one, nested, triangle);
}

loopShapes(10, 3);`,
      },
      {
        type: 'paragraph',
        text: 'Second, the attendance-sheet problem in two solutions. `duplicatesNested` compares every pair. `duplicatesWithSet` uses a `Set`, a built-in collection that remembers values and answers "have I seen this?" with `has`, and takes new ones with `add`. Module 8 explains how a `Set` works; here we count each `has` and `add` as one check.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Two solutions to the duplicate check',
        code: `function makeList(n) {
  const list = [];
  for (let i = 1; i <= n; i++) {
    list.push(i);
  }
  return list;
}

function duplicatesNested(list) {
  let checks = 0;
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      checks += 1;
      if (list[i] === list[j]) {
        return { found: true, checks };
      }
    }
  }
  return { found: false, checks };
}

function duplicatesWithSet(list) {
  const seen = new Set();
  let checks = 0;
  for (const value of list) {
    checks += 1;
    if (seen.has(value)) {
      return { found: true, checks };
    }
    seen.add(value);
  }
  return { found: false, checks };
}

for (const n of [10, 100, 1000]) {
  const list = makeList(n);
  console.log(n, duplicatesNested(list).checks, duplicatesWithSet(list).checks);
}`,
      },
      {
        type: 'version',
        text: 'A JavaScript Set is not guaranteed to be a hash table, but the language specification requires its operations to be, on average, faster than looking through every element (sublinear in the number of elements). MDN notes that the usual internal choice is a hash table with an average cost of one step per operation, and that a Set\'s has is on average faster than Array includes. This course uses "average O(1)" for Set and Map operations; module 8 shows when that average can break down.',
        checked: '2026-11-16',
        sources: [{ label: 'MDN: Set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set' }],
      },
      {
        type: 'paragraph',
        text: 'Third, two ways of searching a list that is already sorted, for the practical task. `linearSearch` checks from the front. `binarySearch` looks in the middle and discards half each time; module 14 explains it fully, but you can read its `checks` counter now.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Two searches, counted',
        code: `function linearSearch(list, target) {
  let checks = 0;
  for (let i = 0; i < list.length; i++) {
    checks += 1;
    if (list[i] === target) {
      return { index: i, checks };
    }
  }
  return { index: -1, checks };
}

function binarySearch(list, target) {
  let low = 0;
  let high = list.length - 1;
  let checks = 0;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    checks += 1;
    if (list[middle] === target) {
      return { index: middle, checks };
    }
    if (list[middle] < target) {
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return { index: -1, checks };
}

for (const n of [10, 100, 1000, 10000, 100000]) {
  const list = makeList(n);
  console.log(n, linearSearch(list, n + 1).checks, binarySearch(list, n + 1).checks);
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**`loopShapes(10, 3)`** prints `10 30 45`. The single pass runs 10 times. The nested loops run `10 × 3 = 30` times, because the inner loop goes over a different size, `m`. The third loop runs `0 + 1 + 2 + … + 9 = 45` times: the inner loop only goes up to `i`, which is about `n²/2`.',
          '**Duplicates:** on a list with no duplicates the worst happens, because both solutions must go all the way. `duplicatesNested` checks `45`, `4950` and `499500` pairs for 10, 100 and 1,000 items, which is `n(n − 1)/2`. `duplicatesWithSet` checks `10`, `100` and `1000`, one check per item. It pays for that by keeping a `Set` that may hold up to `n` values, so it uses extra memory.',
          '**Searches:** the target is `n + 1`, which is not in the list, so each search does its full work. `linearSearch` checks every item (**10, 100, 1000, 10000, 100000**). `binarySearch` checks **4, 7, 10, 14, 17**: each tenfold step in `n` adds only about three checks.',
        ],
      },
      {
        type: 'table',
        headers: ['n', 'Nested duplicates', 'Set duplicates', 'Linear search', 'Binary search'],
        rows: [
          ['10', '45', '10', '10', '4'],
          ['100', '4,950', '100', '100', '7'],
          ['1,000', '499,500', '1,000', '1,000', '10'],
          ['10,000', 'about 50 million', '10,000', '10,000', '14'],
        ],
        caption: 'Checks in the no-duplicates, target-absent case. The nested solution grows like n², the Set one like n, linear search like n and binary search like log n.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'When you analyse real code, cost hides in the standard library: `Array.prototype.includes`, `indexOf`, `find`, `filter`, `slice`, `splice` and `shift` are all passes over the data in the model this course uses (engines optimise some of them, but you reason with the model); spreading an array in a loop copies it each turn; building a string by repeated concatenation may copy; `sort` costs `n log n`. A Set or Map lookup is average O(1) but pays for hashing, and degrades if many keys collide. And remember what counts as `n`: with nested loops over different collections the honest bound is `O(n × m)`, not `O(n²)`. Always state which input each variable measures.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Review a loop for its cost',
        text: 'I am learning to read loops for their cost. Here is my plan: I will write a short JavaScript function that finds the customers in one list who also appear in another list, using a loop over the first list and `includes` on the second. First, ask me to state the Big O in terms of n and m (the two list sizes) and to explain where the cost comes from. Wait for my answer. Then ask me how I could reduce it, and again wait for my attempt. Do not give me the improved code until I have tried. Finally, ask me what the improved version costs in extra memory.',
      },
      {
        type: 'list',
        items: [
          'Check the AI\'s cost against the table in this lesson. A loop over one list with `includes` on the other is O(n × m), not O(n + m).',
          'An AI sometimes says a `Set` makes everything O(1) and forgets to mention the memory it uses. Ask it for both.',
          'If it proposes an improvement, count its steps at two sizes with a counter, as in this lesson, before you accept the claim.',
        ],
      },
      {
        type: 'takeaways',
        items: [
          'To analyze a loop: find n, find the work in the innermost body, multiply nested loops and add sequential ones, then drop constants and smaller terms.',
          'A built-in method that scans data (such as includes or indexOf) is a hidden loop: inside another loop it makes the work quadratic.',
          'To compare two solutions: check they give the same answers, count at several sizes, look at what the faster one costs in memory and readability, and choose for the sizes you will really see.',
          'Nested loops over different collections cost n × m, not n².',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-08-predict-output-1',
          kind: 'predict-output',
          title: 'Two shapes in one function',
          prompt: 'Predict the two lines printed. Work out the nested part and the single loop separately, then add them.',
          concept: 'adding and multiplying loop counts',
          language: 'javascript',
          code: `function countLoops(n, m) {
  let steps = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      steps += 1;
    }
  }
  for (let k = 0; k < n; k++) {
    steps += 1;
  }
  return steps;
}
console.log(countLoops(4, 5));
console.log(countLoops(10, 1));`,
          choices: ['24\n20', '20\n10', '9\n11', '24\n11'],
          wrongNotes: {
            '20\n10': 'The second loop adds n more steps after the nested loops. Did you leave it out?',
            '9\n11': 'The nested loops multiply n by m, they do not add them.',
            '24\n11': 'For n = 10 and m = 1 the nested part is 10 × 1 = 10, not 1.',
          },
          hints: [
            'The nested loops run n × m times. The loop after them runs n times.',
            'For n = 4, m = 5: 4 × 5 is 20, plus 4.',
            'For n = 10, m = 1: 10 × 1 is 10, plus 10.',
          ],
          explanation: 'Nested loops multiply (4 × 5 = 20 and 10 × 1 = 10) and the loop after them adds n more (4 and 10), giving 24 and 20.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-08-code-challenge-1',
          kind: 'code-challenge',
          title: 'Faster duplicate check',
          prompt: 'This `hasDuplicate` is correct but compares every pair. Rewrite it with a `Set` so it takes about one step per item: return `true` as soon as you see a value you have already seen, otherwise `false`. A hidden test uses a long list that the pair-comparing version cannot finish.',
          concept: 'replacing a nested scan with a Set',
          language: 'javascript',
          starter: `function hasDuplicate(list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i] === list[j]) {
        return true;
      }
    }
  }
  return false;
}`,
          solution: `function hasDuplicate(list) {
  const seen = new Set();
  for (const value of list) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}`,
          tests: {
            kind: 'function',
            fn: 'hasDuplicate',
            cases: [
              { label: 'no duplicates', args: [[4, 8, 15, 16]], expected: false },
              { label: 'a duplicate', args: [[4, 8, 15, 8]], expected: true },
              { label: 'empty list', args: [[]], expected: false },
              { label: 'a long list', args: [Array.from({ length: 1000 }, (_, i) => i)], expected: false, hidden: true },
            ],
          },
          hints: [
            'Create an empty `new Set()` before the loop. It is your "second sheet" of names already seen.',
            'For each value: if `seen.has(value)` is true, you have found a duplicate. Otherwise, `seen.add(value)`.',
            'Return false after the loop, because no value repeated.',
          ],
          explanation: 'One pass with a Set does a fixed number of checks per item, so the work grows with n instead of n². The cost is the memory for the Set, which may hold every value.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-08-match-1',
          kind: 'match',
          title: 'Read the loop',
          prompt: 'Match each description of code to its Big O.',
          concept: 'analysing loops',
          labels: { terms: 'The code', meanings: 'Big O' },
          pairs: [
            { term: 'One loop over n items, then another loop over the same n items', definition: 'O(n)', note: 'Sequential loops add: n + n = 2n, and the constant is dropped.' },
            { term: 'A loop over n customers that calls includes on the same list of n customers', definition: 'O(n²)', note: 'includes is itself a scan, so the cost is n turns times up to n steps.' },
            { term: 'A loop over n orders with a loop over m products inside it', definition: 'O(n × m)', note: 'Two different sizes multiply; they are not both n.' },
            { term: 'A loop that halves the remaining range on every turn', definition: 'O(log n)', note: 'Each turn discards half of what is left.' },
          ],
          hints: [
            'Sequential loops add, nested loops multiply.',
            'One of them hides a loop inside a method call.',
            'Two loops one after the other, a hidden scan, two different sizes, and halving.',
          ],
          explanation: 'Sequential work adds, nested work multiplies, a scanning method inside a loop counts as a nested loop, and different input sizes stay as separate letters.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-08-q1',
        prompt: 'A function has one loop over n items, followed by a second loop over the same n items. What is its Big O?',
        choices: [
          'O(n²), because there are two loops',
          'O(1), because there are only two loops',
          'O(2n²), because the loops run one after the other',
          'O(n), because the counts add and the constant is dropped',
        ],
        answer: 3,
        explanation: 'Sequential loops add their counts: n + n = 2n. Dropping the constant leaves O(n). Only a loop inside a loop gives n².',
      },
      {
        id: 'data-structures-algorithms-08-q2',
        prompt: 'A shop has n orders and m products. For each order a loop goes through every product. Which Big O is the honest one?',
        choices: ['O(n + m)', 'O(n²)', 'O(n × m)', 'O(log n)'],
        answer: 2,
        explanation: 'The loop over products runs m times for each of the n orders, so the work is n × m. Writing it as n² would assume both sizes are the same.',
      },
      {
        id: 'data-structures-algorithms-08-q3',
        prompt: 'A loop over n customers calls `customers.includes(id)` on the same array each turn. What does that do to the cost?',
        choices: [
          'Nothing changes: includes counts as just one step of work',
          'It makes the whole thing about n × n, since includes is itself a scan',
          'It makes the whole thing O(log n), because includes halves the array each time',
        ],
        answer: 1,
        explanation: '`includes` checks items one by one and may look at all n, so it is a hidden loop inside the visible one: about n × n steps.',
      },
      {
        id: 'data-structures-algorithms-08-q4',
        prompt: 'On 1,000 items with no duplicates, the pair-comparing solution makes 499,500 checks and the Set solution makes 1,000. What is the fair conclusion?',
        choices: [
          'The Set solution does far fewer checks but uses extra memory for the Set, so it is a trade-off worth knowing about',
          'The pair-comparing solution is better, because it needs no extra memory at all and memory is the only cost that matters',
          'The two solutions are the same, since both read every item',
          'Neither can be compared until you time them on a phone',
        ],
        answer: 0,
        explanation: 'Counts show the growth: 499,500 against 1,000. The Set pays for that speed in memory, so the choice depends on the sizes and the memory you have.',
      },
      {
        id: 'data-structures-algorithms-08-q5',
        audience: { max: 'beginner' },
        prompt: 'Two different solutions give the same correct answer. What do we compare to decide which scales better?',
        choices: [
          'How many steps each takes as the list gets longer',
          'Which one has more lines of code in it',
          'Which one was written first by the team',
        ],
        answer: 0,
        explanation: 'We count each one\'s steps at growing sizes and see which count grows more slowly. Line count and age say nothing about growth.',
      },
      {
        id: 'data-structures-algorithms-08-q6',
        audience: { min: 'advanced' },
        prompt: 'A reviewer wants to replace an `includes` inside a loop with a Set built once beforehand. For which case is the change least worthwhile?',
        choices: [
          'A list of millions of items, searched many times',
          'A request handler that runs for every user and handles large lists',
          'A list that always has fewer than ten items and is searched once',
        ],
        answer: 2,
        explanation: 'At ten items the scan is trivial and a Set adds memory and code for no visible gain. The change pays off when n is large and the search is repeated.',
      },
    ],
    task: {
      title: 'Compare two searches as the data grows',
      steps: [
        'In any free JavaScript environment, copy `makeList`, `linearSearch`, `binarySearch` and the printing loop. Run it and check your output against the table.',
        'Change the loop so that for each n in 10, 100, 1,000, 10,000 and 100,000 it prints the checks of both searches for three targets: the first item (target 1), the middle item and a missing item (target n + 1). Record the six numbers per size in a table.',
        'Open the Big O growth visual from lesson 6 (it only goes up to small n, so look at the shapes of the curves rather than the exact numbers). Describe in two or three sentences how your counts match O(n) and O(log n), and say which search you would use for 100,000 sorted items and why.',
        'Write down one thing the faster search needs that the slower one does not (hint: look at what both lists must be).',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before running anything, predict how many checks `linearSearch` needs for the list `[1, 2, 3, 4, 5, 6, 7, 8]` when looking for 6, then run it and check.'] },
      { audience: { min: 'advanced' }, steps: ['Add a third search that uses a `Set` built from the list, and count the cost of building it separately from the cost of each lookup. At how many searches does building the Set pay for itself?'] },
    ],
  },
  {
    id: 'data-structures-algorithms-09',
    day: 9,
    title: 'Space Complexity, Best, Average and Worst Cases, and Amortized Analysis',
    summary: 'Count memory as well as steps, describe an algorithm in its best, average and worst cases, and see why a growing array still costs a constant amount per append.',
    intro: {
      objectives: [
        'Describe an algorithm\'s extra memory use with Big O and spot the trade between time and space',
        'Give the best, average and worst case of linear search, and say which one is usually quoted and why',
        'Explain amortized analysis using a dynamic array that doubles its size',
      ],
      why: 'Speed is never the only cost. Memory runs out on phones, and "it is fast on average" can hide a slow moment that a user feels. These ideas let you ask the right follow-up questions about any solution.',
    },
    minutes: 30,
    skills: ['complexity'],
    body: [
      {
        type: 'paragraph',
        text: 'Until now every count has been a count of **steps**: time. This lesson adds three ideas that complete the picture. **Space complexity** counts memory the same way time complexity counts steps. **Best, average and worst cases** admit that the same algorithm can do very different amounts of work on different inputs of the same size. And **amortized analysis** explains an operation that is usually cheap and sometimes expensive, such as appending to a growing array, by spreading the occasional cost over all the operations. Together they let you describe a solution honestly.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Cooking a meal has two costs: how long it takes (time) and how much counter space and how many bowls you need (space). Frying with one pan and a spoon uses little space; preparing every ingredient in its own bowl first is quicker to finish but needs a crowded counter. You often trade one for the other.',
      },
      {
        type: 'paragraph',
        text: 'Now picture looking for your keys in your pockets, checking one at a time. **Best case:** they are in the first pocket you check. **Worst case:** they are in the last pocket, or not on you at all, and you have checked every pocket. **Average case:** if the keys are equally likely to be in any pocket, you will check about half of them. For amortized cost, picture a small shelf in a store that fills up. When it is full you move everything onto a shelf twice as long. That move is slow, but it happens rarely, and you get a lot of free space for it. Where the pictures stop working: a cook can see the whole counter at a glance, but a program\'s memory is invisible unless you count it.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: '**Space complexity** is how the **extra memory** an algorithm needs grows with the input size `n`. "Extra" means beyond the input itself. A function that reverses a list by building a new list of the same size needs `O(n)` extra space. One that swaps items inside the original list, using only a couple of variables, needs `O(1)` extra space. Often you can trade: a Set made the duplicate check from lesson 8 faster, and the price was `O(n)` extra space.',
      },
      {
        type: 'paragraph',
        text: 'The same algorithm can do different work on different inputs of the same size. Take linear search in a list of `n` items. In the **best case** the target is first: 1 check, `O(1)`. In the **worst case** the target is last or missing: `n` checks, `O(n)`. In the **average case**, if the target is present and equally likely to be in any position, you check `(n + 1) / 2` items: about half, which is still `O(n)` because the constant `1/2` is dropped. The average case always rests on an assumption about the inputs, so state the assumption.',
      },
      {
        type: 'table',
        headers: ['Case', 'What the input looks like', 'Checks for linear search', 'Big O'],
        rows: [
          ['Best', 'The target is the first item', '1', 'O(1)'],
          ['Average', 'The target is present, equally likely anywhere', 'about n / 2', 'O(n)'],
          ['Worst', 'The target is last, or not there', 'n', 'O(n)'],
        ],
        caption: 'Big O describes growth. Best, average and worst describe which input you applied it to.',
      },
      {
        type: 'paragraph',
        text: 'When a person says "this is O(n)" without saying which case, they usually mean the **worst case**, because it is a guarantee: no input of size `n` can make the algorithm do more work. The best case is rarely useful, since you cannot count on being lucky. The average case is useful when you know what typical inputs look like.',
      },
      {
        type: 'paragraph',
        text: '**Amortized analysis** is for an operation that is cheap most of the time and expensive occasionally. The classic example is a **dynamic array**: an array that grows when it fills up. In the model we use, a dynamic array has a capacity. Appending to it just writes into the next free cell. When it is full, it makes a new array with **double** the capacity, copies every item across and then writes the new item. That one append is expensive, `O(n)`, but afterwards there is room for as many appends again. Spread over all appends, the total copying for `n` appends stays under `2n`, so the **amortized cost per append is `O(1)`**.',
      },
      {
        type: 'paragraph',
        text: 'Amortized is not the same as average. An average case depends on assuming typical inputs. An amortized bound is a guarantee about any sequence of operations: the total is bounded, even if one operation is slow. Be honest about the model: real JavaScript engines pick their own growth strategies, and module 3 returns to dynamic arrays. The doubling picture is a model that explains why appending is cheap, not a claim about a particular engine.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: **space** is how much memory a program uses. If the program makes a whole new copy of your list, it needs as much memory again as the list itself. If it just shuffles items around inside the list, it needs almost no extra. The **best case** is the lucky input, the **worst case** is the unlucky one, and the **average case** is the typical one. **Amortized** means "averaged over a long run of the same operation": if you add items to a shelf one at a time and, every so often, must move everything to a bigger shelf, the moves are slow but rare, so each item added is still cheap on average. The code below counts each of these, so you can see the numbers.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Space first. Both functions reverse a list. `reverseCopy` builds a new list of the same length. `reverseInPlace` swaps pairs inside the original list and keeps only a few variables.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Reversing with extra space and without',
        code: `function reverseCopy(list) {
  const result = [];
  for (let i = list.length - 1; i >= 0; i--) {
    result.push(list[i]);
  }
  return result;
}

function reverseInPlace(list) {
  let left = 0;
  let right = list.length - 1;
  while (left < right) {
    const held = list[left];
    list[left] = list[right];
    list[right] = held;
    left += 1;
    right -= 1;
  }
  return list;
}

console.log(reverseCopy([1, 2, 3, 4]).join(' '));
const prices = [1, 2, 3, 4];
reverseInPlace(prices);
console.log(prices.join(' '));`,
      },
      {
        type: 'paragraph',
        text: 'Cases next. `checksToFind` returns how many items a linear search looks at. We ask it for every item in a 10-item list, and for one that is missing.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Best, average and worst for linear search',
        code: `function checksToFind(list, target) {
  let checks = 0;
  for (let i = 0; i < list.length; i++) {
    checks += 1;
    if (list[i] === target) {
      return checks;
    }
  }
  return checks;
}

const list = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const counts = [];
let total = 0;
for (const value of list) {
  const checks = checksToFind(list, value);
  counts.push(checks);
  total += checks;
}
console.log(counts.join(' '));
console.log(total / list.length);
console.log(checksToFind(list, 999));`,
      },
      {
        type: 'paragraph',
        text: 'Last, amortized cost. This simulates a dynamic array that starts with room for one item and doubles when full. It does not store anything; it only counts how many items would be copied.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A doubling array, counted',
        code: `function simulateAppends(n) {
  let capacity = 1;
  let size = 0;
  let copies = 0;
  for (let i = 0; i < n; i++) {
    if (size === capacity) {
      copies += size;
      capacity *= 2;
    }
    size += 1;
  }
  return { size, capacity, copies };
}

for (const n of [1, 2, 3, 5, 9, 17, 100, 1000, 100000]) {
  const result = simulateAppends(n);
  console.log(n, result.copies, result.capacity);
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Reversing:** both print `4 3 2 1`. `reverseCopy` pushes `n` items into a brand-new list, so it uses `O(n)` extra space. `reverseInPlace` only uses `left`, `right` and `held`, a fixed number of variables whatever `n` is, so `O(1)` extra space.',
          '**Cases:** the first print is `1 2 3 4 5 6 7 8 9 10`: finding the first item takes 1 check, the last takes 10. Their total is 55, so the average over the 10 positions is **5.5**, which is `(10 + 1) / 2`. The missing 999 takes **10** checks, the worst case.',
          '**Doubling:** each time `size` reaches `capacity`, the loop adds `size` to `copies` (every current item is copied) and doubles the capacity. The numbers printed show `copies` is always less than twice `n`: for 1,000 appends there are 1,023 copies, and for 100,000 appends there are 131,071.',
        ],
      },
      {
        type: 'table',
        headers: ['Append number', 'Full before it?', 'Items copied', 'Capacity after', 'Total copies'],
        rows: [
          ['1', 'No (room for 1)', '0', '1', '0'],
          ['2', 'Yes (1 of 1)', '1', '2', '1'],
          ['3', 'Yes (2 of 2)', '2', '4', '3'],
          ['4', 'No', '0', '4', '3'],
          ['5', 'Yes (4 of 4)', '4', '8', '7'],
          ['6 to 8', 'No', '0', '8', '7'],
          ['9', 'Yes (8 of 8)', '8', '16', '15'],
        ],
        caption: 'The expensive appends are the ones that find the array full, and they get rarer as it grows.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Amortized analysis is a guarantee over a worst-case sequence, with no probability involved (the aggregate method here, or the accounting and potential methods). With a doubling factor the total copy work for `n` appends is at most about `2n`, so each append is amortized `O(1)`; with a constant additive growth (say 10 slots at a time) the total is quadratic and the bound fails, which is why geometric growth is the rule. The catch in practice is latency: a single `O(n)` append can cause a visible pause, which matters in real-time or tail-latency-sensitive code, where amortized `O(1)` is not good enough. Also count space honestly: auxiliary space, recursion stack depth and output size are different things.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Argue the three cases',
        text: 'I am learning best, average and worst case and space complexity. Take this algorithm: linear search for a target in an array of n numbers. Ask me, one question at a time, for its best case, worst case and average case (and the assumption I make for the average). Then ask me what extra space it uses. Wait for my answer each time. After that, give me a second algorithm that has the same Big O in its best and worst case but a different space cost, and ask me to explain the trade-off. Do not answer for me: give me hints first.',
      },
      {
        type: 'list',
        items: [
          'Check that the AI separates the case from the notation. "O(n)" is growth; "worst case" says which input. It is common for AI explanations to blur the two.',
          'An AI may say "the average case is n/2, so it is O(n/2)". It is O(n): the constant is dropped. Ask it to explain why.',
          'Be careful with claims about what JavaScript does internally. Arrays and strings are optimised by engines, and an AI may state exact growth factors as fact. Treat the doubling model as a model.',
        ],
      },
      {
        type: 'takeaways',
        items: [
          'Space complexity counts the extra memory an algorithm needs beyond its input; making a copy costs O(n) space, working in place costs O(1).',
          'Time and space often trade: a faster solution frequently needs more memory.',
          'Best, average and worst case name the input you apply Big O to; the worst case is the usual guarantee, the average case needs a stated assumption.',
          'Amortized analysis spreads an occasional expensive operation over many cheap ones: a doubling dynamic array has O(1) amortized cost per append even though one append can cost O(n).',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-09-predict-output-1',
          kind: 'predict-output',
          title: 'Count the copies',
          prompt: 'This runs the doubling simulation for 6 appends. Predict the two numbers printed: items copied in total, then the capacity at the end. Use the table in the lesson to help.',
          concept: 'amortized cost of a dynamic array',
          language: 'javascript',
          code: `function simulateAppends(n) {
  let capacity = 1;
  let size = 0;
  let copies = 0;
  for (let i = 0; i < n; i++) {
    if (size === capacity) {
      copies += size;
      capacity *= 2;
    }
    size += 1;
  }
  return { size, capacity, copies };
}
const result = simulateAppends(6);
console.log(result.copies);
console.log(result.capacity);`,
          choices: ['7\n8', '6\n8', '7\n6', '3\n4'],
          wrongNotes: {
            '6\n8': 'The copies add up: 1 at the second append, 2 at the third, 4 at the fifth. What do those make?',
            '7\n6': 'The capacity is doubled each time the array is full, so it is a power of two, not the number of appends.',
            '3\n4': 'That is where things stand after 3 or 4 appends. The sixth append has not yet caused a copy, but the fifth did.',
          },
          hints: [
            'Write down the append numbers where size equals capacity. These are the appends that copy.',
            'The array is full before appends 2, 3 and 5 (capacities 1, 2, 4). Add the copies: 1 + 2 + 4.',
            'The capacity after the fifth append is 8, and the sixth fits without copying.',
          ],
          explanation: 'Appends 2, 3 and 5 find the array full and copy 1, 2 and 4 items, totalling 7. Capacity doubles each time, ending at 8. The sixth append finds room and copies nothing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-09-match-1',
          kind: 'match',
          title: 'Which case is it?',
          prompt: 'Match each situation in a linear search of a customer list to the case it describes.',
          concept: 'best, average and worst case',
          labels: { terms: 'The situation', meanings: 'The case' },
          pairs: [
            { term: 'The customer you want is the very first one in the list', definition: 'Best case', note: 'One check is the least work any input of that size can need.' },
            { term: 'The customer is not in the list at all', definition: 'Worst case', note: 'Every item had to be checked before giving up.' },
            { term: 'The customer is equally likely to be at any position, and you average over positions', definition: 'Average case', note: 'It depends on the assumption about where customers usually are.' },
          ],
          hints: [
            'Which input needs the least work? Which needs the most?',
            'One of them only makes sense once you state an assumption about the inputs.',
            'First item is best, missing is worst, and averaging over positions is the average.',
          ],
          explanation: 'Best case is the luckiest input, worst case the unluckiest, and the average case averages over a stated assumption about the inputs.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-09-scenario-1',
          kind: 'scenario',
          title: 'Time or space?',
          prompt: 'Choose the best approach for this budget app.',
          concept: 'trading time for space',
          situation: 'A budgeting app checks 50,000 transaction ids for duplicates every time it opens. The phone has plenty of free memory. The nested pair-comparing version takes a noticeable time.',
          options: [
            { text: 'Use a Set to remember the ids already seen, at the cost of extra memory for up to 50,000 ids', quality: 'best', consequence: 'The check does about one step per id instead of one for every pair, and the extra memory is small compared with what the phone has.' },
            { text: 'Keep the nested comparison, because it needs no extra memory', quality: 'acceptable', consequence: 'It uses the least memory, but with 50,000 ids it does over a billion comparisons and the delay stays. Saving memory the phone does not need is the wrong trade.' },
            { text: 'Copy the whole list before each comparison to keep the original safe', quality: 'poor', consequence: 'This adds a huge amount of copying and a lot of memory, and does not make the check any faster.' },
          ],
          hints: [
            'What does the phone have plenty of, and what is the app short of?',
            'One option pays memory to save time; one pays time to save memory.',
            'The memory for the ids is cheap here, so spend it to save time.',
          ],
          explanation: 'Time and space often trade. With plenty of memory and a slow check, spending a modest amount of memory on a Set to avoid comparing every pair is the sensible trade.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-09-q1',
        prompt: 'One function reverses a list by building a new list of the same length. Another reverses it by swapping items in the original with a couple of variables. What is each one\'s extra space?',
        choices: [
          'O(1) for the copy and O(n) for the in-place version',
          'Both O(n)',
          'Both O(1)',
          'O(n) for the copy and O(1) for the in-place version',
        ],
        answer: 3,
        explanation: 'The copy needs a second list as long as the first, which is O(n) extra space. Swapping in place uses a fixed number of variables, which is O(1).',
      },
      {
        id: 'data-structures-algorithms-09-q2',
        prompt: 'A target is present in a list of 100 items and is equally likely to be at any position. About how many items does a linear search check on average?',
        choices: ['1', 'About 50', '100', 'About 7'],
        answer: 1,
        explanation: 'On average you check about half the list, (100 + 1) / 2 = 50.5. About 7 is what halving would need and 100 is the worst case.',
      },
      {
        id: 'data-structures-algorithms-09-q3',
        prompt: 'Why is the worst case the one usually quoted when someone says an algorithm is O(n)?',
        choices: [
          'It is a guarantee: no input of that size can make the work larger',
          'It is the most common case in real programs and datasets',
          'It is always exactly equal to the average case of the algorithm',
        ],
        answer: 0,
        explanation: 'The worst case is an upper limit you can rely on. The best case is rarely useful and the average case needs assumptions about the inputs.',
      },
      {
        id: 'data-structures-algorithms-09-q4',
        prompt: 'After 1,000 appends to a doubling dynamic array, 1,023 items were copied in total. What does that say about the cost of an append?',
        choices: [
          'Every append copies about 1,000 items, so appending is O(n) each time',
          'Most appends copy nothing, so the total cannot be known',
          'About one copy per append on average, so the cost per append stays constant',
          'Appends cost O(log n), because the array doubles',
        ],
        answer: 2,
        explanation: 'The total copying is about the same as the number of appends, so spread over them it is about one copy each: amortized O(1), even though a single unlucky append copies everything.',
      },
      {
        id: 'data-structures-algorithms-09-q5',
        audience: { max: 'beginner' },
        prompt: 'You search your pockets one by one for your keys. Which situation is the best case?',
        choices: [
          'The keys are not on you at all',
          'The keys are in the first pocket you check',
          'The keys are in the very last pocket you check',
        ],
        answer: 1,
        explanation: 'The best case is the luckiest input: found immediately, with the least work. Missing keys or keys in the last pocket are the worst case.',
      },
      {
        id: 'data-structures-algorithms-09-q6',
        audience: { min: 'advanced' },
        prompt: 'Which statement correctly separates an amortized bound from an average-case bound?',
        choices: [
          'They are the same thing with two different names that people use',
          'An average case assumes typical inputs; an amortized bound holds for any sequence',
          'An amortized bound only holds when the operations are chosen at random order',
        ],
        answer: 1,
        explanation: 'Amortized analysis guarantees the total cost of any sequence of operations, with no probability. The average case depends on the inputs being typical in some stated way.',
      },
    ],
    task: {
      title: 'Watch a growing array pay its bill',
      steps: [
        'In any free JavaScript environment, run `simulateAppends` for n = 1,000, 10,000 and 100,000. Write down the number of copies for each, and divide by n to get the copies per append.',
        'Change `capacity *= 2` to `capacity += 10`: the array now grows by 10 slots at a time. Run the same three sizes again and compute copies per append for each.',
        'Write three sentences: how the copies per append behave with doubling, how they behave with growing by 10, and why that means doubling is the safer growth rule.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use coins or paper slips to act out the shelf that doubles: write the numbers 1 to 9 on slips, and every time the shelf is full, count how many slips you have to move. Check your total against the table.'] },
      { audience: { min: 'advanced' }, steps: ['Add a count of how many appends are expensive (those that copy) among the first n, and show it grows like log n. Then explain why a real-time system might still object to an amortized O(1) append.'] },
    ],
  },
];

export const project: Project | null = null;
