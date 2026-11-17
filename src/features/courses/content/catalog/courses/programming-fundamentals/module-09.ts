import type { Lesson, Project } from '../../../types';

/**
 * Module 9: Reading, Debugging and Testing Code (lessons 41 to 46, project p9).
 * Every program output and every Node error shown below was produced by running the code in Node.js v22 on 2026-11-16; where an error is
 * pasted, only the folder part of the file path was replaced (it is different on every computer).
 */
const CHECKED = '2026-11-16';

const DOCS = {
  mdnError: { label: 'MDN: Error (error types and the stack property)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error' },
  mdnDebugger: { label: 'MDN: The debugger statement', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger' },
  mdnIsNaN: { label: 'MDN: Number.isNaN()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN' },
  nodeErrors: { label: 'Node.js documentation: Errors (error.stack, Error.stackTraceLimit)', url: 'https://nodejs.org/api/errors.html' },
  nodeDebugger: { label: 'Node.js documentation: Debugger', url: 'https://nodejs.org/api/debugger.html' },
  gitBisect: { label: 'Git documentation: git-bisect', url: 'https://git-scm.com/docs/git-bisect' },
  nodeTest: { label: 'Node.js documentation: Test runner (node:test)', url: 'https://nodejs.org/api/test.html' },
  chromeJsRef: { label: 'Chrome for Developers: JavaScript debugging reference', url: 'https://developer.chrome.com/docs/devtools/javascript/reference' },
  chromeBreakpoints: { label: 'Chrome for Developers: Pause your code with breakpoints', url: 'https://developer.chrome.com/docs/devtools/javascript/breakpoints' },
};

export const lessons: Lesson[] = [
  {
    id: 'programming-fundamentals-41',
    day: 41,
    title: 'How to Read Code and Follow Its Execution Order',
    summary: 'Learn a repeatable way to read code you did not write: find where it starts, follow the jumps, and keep a trace table.',
    minutes: 25,
    skills: ['debug-test', 'problem-solving'],
    intro: {
      objectives: [
        'Name the three things that change the order in which lines run: calls, loops and conditions',
        'Find where a program starts running and what each function takes in and gives back',
        'Trace a short program line by line with a trace table',
      ],
      why: 'When you build with AI, most of your time goes into reading code you did not type. Reading is a method you can learn, and it is the skill that lets you say "yes, this does what I asked" or "no, it does not".',
    },
    body: [
      { type: 'paragraph', text: 'You have written code for forty lessons. Now the skill changes: you will often be handed code you did not write, from a teammate, from an old project, or from an AI assistant that produced forty lines in five seconds. Nobody can fix, trust or improve code they cannot read. The good news is that reading code is not a gift. It is a method, and this lesson gives you the first and most important part of it: knowing which line runs when.' },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: 'Think of a recipe card for pancakes. You read it from top to bottom: mix the flour, add the egg. Then a line says "make the syrup (see the back of the card)". You do not keep reading down; you flip the card, follow the syrup steps, and come back to the line right after "make the syrup". Another line says "for each pancake, flip it when bubbles show", so you repeat a few steps several times. A third says "if the batter is too thick, add milk", so you sometimes skip that step.' },
      { type: 'paragraph', text: 'Code follows a card in exactly the same way: mostly top to bottom, with three exceptions. Where the picture stops working: a cook can see the kitchen and use common sense when the card is vague. A computer cannot. It does exactly what each line says, in exactly the order the lines send it, so you have to follow the same order to understand it.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'By default, a program runs one line after the next, from the top. Three things change that order:' },
      {
        type: 'list',
        items: [
          '**A function call** jumps to the function\'s lines, runs them, and then comes back to the line after the call (like flipping to the syrup steps).',
          '**A loop** sends the program back up to repeat some lines, once for each turn.',
          '**A condition** (`if`) decides whether a group of lines runs at all.',
        ],
      },
      { type: 'paragraph', text: 'There is one trap that surprises almost every beginner. A function **definition** is only the recipe for the syrup written on the back of the card. Reading past it does not make the syrup. The function\'s lines run only when something **calls** it. So a function that is written on line 7 and called on line 21 does its work at the moment of line 21, not before.' },
      { type: 'paragraph', text: 'That tells you where a program really starts: the first line that is not inside a function and actually does something, such as creating a list or printing text. Everything written inside a function waits until it is called.' },
      { type: 'diagram', format: 'mermaid', caption: 'Calls go down into a function and returns come back up. The line after each call waits until the function has returned.', source: 'sequenceDiagram\n  participant Main as Main program\n  participant D as describeTotal\n  participant T as totalOf\n  Main->>D: describeTotal(expenses)\n  D->>T: totalOf(list)\n  T-->>D: returns 209\n  D-->>Main: returns the text' },
      { type: 'heading', text: 'A method for reading any code' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Read the names.** Good names and comments tell you the purpose: `totalOf`, `describeTotal`, `expenses`.',
          '**Find the start.** Look for the first line outside every function that does something.',
          '**Find the in and out of each function.** What does it take in (its parameters) and what does it give back (its `return`)?',
          '**Pick one small example** and follow it. Do not try to understand every possible input at once.',
          '**Write a trace table**: one row per step, with the line number and the value of each variable that changed.',
        ],
      },
      { type: 'paragraph', text: 'Why a table and not just "looking at it"? Your brain is very good at guessing what the answer should be, and guessing is exactly the habit that hides bugs. A trace table makes you write down what the computer holds after each step, so you follow the code instead of your expectation.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a program is a list of instructions, and the computer is a very literal helper that follows the list with a finger on the current line. Most of the time the finger moves one line down. When it meets a function call, the finger jumps to that function, works through it, and jumps back to just after the call. When it meets a loop, the finger goes back up and repeats. Reading code means putting your own finger on the page and moving it the way the computer would. A trace table is your notebook for what the computer is remembering at each stop: the names (like `total`) and what they hold right now.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'First, a tiny program with two functions. Before you read the output, try to say in what order the words will print.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Which line runs when?',
        code: `function rinse() {
  console.log('rinse');
}

function wash() {
  console.log('wash');
  rinse();
  console.log('washed');
}

console.log('start');
wash();
console.log('finish');`,
      },
      { type: 'code', language: 'text', label: 'Output (run with Node.js 22)', code: 'start\nwash\nrinse\nwashed\nfinish' },
      { type: 'paragraph', text: 'Now the running example of this course: the expense tracker. Read the names first. Then find where it starts, and what goes in and out of each function.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'The expense program we will trace',
        code: `const expenses = [
  { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' },
  { description: 'Rice meal', amount: 85, category: 'food', date: '2026-11-16' },
  { description: 'Load top-up', amount: 100, category: 'load', date: '2026-11-17' },
];

function totalOf(list) {
  let total = 0;
  for (const item of list) {
    total = total + item.amount;
  }
  return total;
}

function describeTotal(list) {
  const total = totalOf(list);
  return \`Spent \${total} pesos on \${list.length} items\`;
}

console.log('Start');
console.log(describeTotal(expenses));
console.log('End');`,
      },
      { type: 'code', language: 'text', label: 'Output (run with Node.js 22)', code: 'Start\nSpent 209 pesos on 3 items\nEnd' },
      { type: 'heading', text: 'Walk through the code' },
      { type: 'paragraph', text: 'In the first program, the two `function` blocks run nothing; they are only stored. The program really starts at `console.log(\'start\')`, which prints `start`. Then `wash()` is called: the finger jumps up to `wash`, prints `wash`, meets `rinse()`, jumps to `rinse` and prints `rinse`, comes back and prints `washed`, then returns to just after the call and prints `finish`.' },
      { type: 'paragraph', text: 'For the expense program, here is the trace table. Line numbers count from the first line of the code block, and `-` means the variable does not exist yet.' },
      {
        type: 'table',
        caption: 'Trace of the expense program. Read down: this is the order in which the computer works.',
        headers: ['Step', 'Line', 'What happens', 'item', 'total'],
        rows: [
          ['1', '1 to 5', '`expenses` is created with three items', '-', '-'],
          ['2', '7 to 13', '`totalOf` is stored. Nothing runs.', '-', '-'],
          ['3', '15 to 18', '`describeTotal` is stored. Nothing runs.', '-', '-'],
          ['4', '20', 'Prints Start', '-', '-'],
          ['5', '21 then 16', '`describeTotal(expenses)` is called, and its first line calls `totalOf(list)`', '-', '-'],
          ['6', '8', '`total` inside `totalOf` starts at 0', '-', '0'],
          ['7', '9 and 10', 'Loop turn 1: Jeepney fare', 'Jeepney fare', '24'],
          ['8', '9 and 10', 'Loop turn 2: Rice meal', 'Rice meal', '109'],
          ['9', '9 and 10', 'Loop turn 3: Load top-up', 'Load top-up', '209'],
          ['10', '12', '`return total` hands 209 back to line 16', '-', '209'],
          ['11', '16 and 17', '`describeTotal` keeps 209 in its own `total`, builds the text and returns it', '-', '209'],
          ['12', '21', 'The text is printed: Spent 209 pesos on 3 items', '-', '-'],
          ['13', '22', 'Prints End', '-', '-'],
        ],
      },
      { type: 'tip', text: 'Keep your trace table on paper or in a plain text file, not in your head. The moment you catch yourself writing "it probably gives 209" instead of working out 24 + 85 + 100, you have stopped tracing and started guessing.' },
      {
        type: 'details',
        summary: 'Reading code you do not know (for experienced developers)',
        body: [
          'In a real codebase you cannot trace everything. You choose one concrete case and follow the data, not the files: find an entry point (a main file, a route, a button handler), follow the calls for that one case, and note what each function receives and returns.',
          'Tests are the fastest map of intent: a test name and its expected value tell you what the author believed the function does. The call stack in a debugger (lesson 44) is a live version of the trace table.',
        ],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'The same method scales to a large codebase, with different tools. Start from an entry point or from a test, not from the top of a random file. Use go-to-definition and find-references to follow calls, and the version history (blame, log) to learn why a line exists. Keep one question in mind per session ("what happens to this request?") and trace that single path. Treat AI-generated diffs the same way: read the call graph they touch, check the unchanged callers, and run the changed path instead of trusting a summary. Reading speed comes from knowing which code you can skip because its contract is clear, not from skimming.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'An AI assistant is useful as a reading coach, as long as you commit to your own answer first. Paste a short program of your own (the `wash` and `rinse` code works well) into any assistant you have, such as ChatGPT, Claude or Gemini.' },
      {
        type: 'prompt',
        label: 'Make the AI quiz you before it explains',
        text: 'I am learning to read code. Below is a short JavaScript program. Do not explain it and do not tell me the output. First ask me, one question at a time, in what order the lines will run and what will print. Wait for my answer each time, then tell me whether I am right and give a hint if I am not.\n\n[paste the program here]',
      },
      { type: 'paragraph', text: 'What to look for: the assistant should ask you questions and wait, not lecture. When it gives you the output, run the program yourself to confirm. An AI reads code the way a person skims it, and it can state a wrong output with complete confidence. Your own run, and your own trace table, are the judges.' },
      {
        type: 'takeaways',
        items: [
          'Code runs top to bottom, except where a function call, a loop or a condition changes the path.',
          'A function definition only stores its steps; they run when the function is called, then control returns to the line after the call.',
          'To read unfamiliar code: read the names, find the start, find each function\'s in and out, pick one example, and trace it.',
          'A trace table (step, line, changed variables) makes you follow what the computer does instead of what you expect.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-41-predict-output-1',
          kind: 'predict-output',
          title: 'Which line prints when?',
          prompt: 'Predict exactly what this program prints, line by line. Remember that a function runs only when it is called.',
          concept: 'execution order',
          language: 'javascript',
          code: `function serve() {
  console.log('serve');
}

function cook() {
  console.log('cook');
  serve();
  console.log('cooked');
}

console.log('open');
cook();
console.log('close');`,
          choices: ['open\ncook\nserve\ncooked\nclose', 'serve\ncook\ncooked\nopen\nclose', 'open\ncook\ncooked\nserve\nclose', 'cook\nserve\ncooked\nopen\nclose'],
          wrongNotes: {
            'serve\ncook\ncooked\nopen\nclose': 'The functions are only stored when the computer reads them. Nothing prints until a line outside the functions runs.',
            'open\ncook\ncooked\nserve\nclose': 'When `cook` reaches `serve()`, the program jumps into `serve` and finishes it before the next line of `cook` runs.',
            'cook\nserve\ncooked\nopen\nclose': 'The program starts with the first line outside the functions, which prints something before `cook` is called.',
          },
          hints: ['Find the first line that is not inside a function. That is where the program starts.', 'When a line calls a function, the program jumps inside it and comes back afterwards.', 'The order is open, then everything inside cook (including the whole of serve in the middle), then close.'],
          explanation: 'The program starts at `console.log(\'open\')`. Calling `cook()` jumps into cook, which prints cook, then calls `serve()` (printing serve), returns, and prints cooked. Control then returns after the call, and close prints last.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-41-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the trace table',
          prompt: 'The loop adds each amount to `total`. Fill in what `total` holds after each loop turn, as you would in a trace table.',
          concept: 'trace table',
          language: 'text',
          code: `let total = 0;
for (const amount of [24, 85, 100]) {
  total = total + amount;
}

turn 1: amount = 24,  total = 24
turn 2: amount = 85,  total = ___
turn 3: amount = 100, total = ___`,
          bank: ['109', '209', '85', '185', '24'],
          blanks: [
            { answers: ['109'], feedback: 'Take the total after turn 1 (24) and add this turn\'s amount (85).' },
            { answers: ['209'], feedback: 'Take the total after turn 2 and add this turn\'s amount (100).' },
          ],
          hints: ['Each turn adds the new amount to the total from the turn before, not to zero.', 'Turn 2 is 24 + 85.', 'Turn 2 is 109. Turn 3 adds 100 to that.'],
          explanation: 'The total carries over from one turn to the next: 0 + 24 = 24, then 24 + 85 = 109, then 109 + 100 = 209. A trace table makes that carrying-over visible.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-41-arrange-1',
          kind: 'arrange',
          title: 'Order the reading method',
          prompt: 'Put the steps for reading unfamiliar code in a sensible order, from the first thing you do to the last.',
          concept: 'reading method',
          language: 'text',
          solution: [
            'Read the names and any comments to guess the purpose',
            'Find the first line outside every function: that is where it starts',
            'Note what each function takes in and what it returns',
            'Pick one small example input',
            'Trace that example line by line in a trace table',
            'Compare your trace with what the program really prints',
          ],
          reasons: [
            'Names and comments are the cheapest clues, so start there.',
            'You need the starting point before you can follow the order.',
            'The in and out of each function tell you what the calls mean.',
            'One small example is easier to follow than every possible input.',
            'The trace table is where you follow what the computer does.',
            'Running the code last checks your reading against the truth.',
          ],
          hints: ['Start with the cheapest clue and end with the check.', 'You have to know where the program starts before you can trace it.', 'Reading the names is first and comparing with the real output is last.'],
          explanation: 'Clues first (names), then structure (start, in and out), then one concrete example traced by hand, and finally a real run to check your reading.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-41-q1',
        prompt: 'A program defines `function greet()` on line 3 and calls `greet()` on line 10. When do the lines inside `greet` run?',
        choices: ['When the computer reads line 3 for the first time, because a definition is run as soon as it is read', 'When line 10 calls it, and then control returns to the line after line 10', 'Before every other line, because functions always run first', 'Only if a loop or an if statement mentions greet'],
        answer: 1,
        explanation: 'A function definition only stores the steps. They run when the function is called, and afterwards the program continues after the call.',
      },
      {
        id: 'programming-fundamentals-41-q2',
        prompt: 'You are given 40 unfamiliar lines. Which first move gives you the most understanding for the least effort?',
        choices: ['Find where the program starts and what each function takes in and returns', 'Read every line in file order and try to remember all of it before you think about what it does', 'Change a few values at random to see what breaks', 'Run it once and assume that a clean run means it is correct'],
        answer: 0,
        explanation: 'The start and the in and out of each function give you the structure. Random changes and "it ran" do not tell you what the code is meant to do.',
      },
      {
        id: 'programming-fundamentals-41-q3',
        prompt: 'What does this print? `let total = 10; total = total - 3; total = total * 2; console.log(total);`',
        choices: ['7', '4', '20', '14'],
        answer: 3,
        explanation: 'Each line works with the value left by the line before: 10, then 10 - 3 = 7, then 7 * 2 = 14.',
      },
      {
        id: 'programming-fundamentals-41-q4',
        prompt: 'Why is it better to write a trace table than to "just look at" a loop and say what it gives?',
        choices: ['The computer runs a loop faster when you have traced it first, because the trace works as a shortcut', 'A trace table is required before JavaScript will accept a loop', 'A table finds syntax errors automatically while you write it', 'Writing the values down makes you follow what the code does instead of what you expect it to do'],
        answer: 3,
        explanation: 'Guessing the answer is the habit that hides bugs. Writing what each variable holds after each step keeps you honest.',
      },
      {
        id: 'programming-fundamentals-41-q5',
        audience: { max: 'beginner' },
        prompt: 'In the recipe card picture, what does a function call match?',
        choices: ['Skipping a line because the batter is fine, and carrying on with the next line of the recipe', 'Reading the card once more from the top', 'Flipping to the syrup steps, doing them, and coming back to the line after "make the syrup"'],
        answer: 2,
        explanation: 'A call jumps to the function\'s steps and returns to just after the call, like flipping the card and coming back.',
      },
      {
        id: 'programming-fundamentals-41-q6',
        audience: { min: 'advanced' },
        prompt: 'You inherit a module with no documentation and must learn how one feature works. Which approach is most reliable?',
        choices: ['Read the files in alphabetical order until the feature appears', 'Pick one concrete case, start from its entry point or an existing test, follow the calls, and confirm with a run or a debugger', 'Ask an AI assistant to summarise the whole module and rely on the summary, because it has read more code than any person could', 'Rewrite the module so that you understand it from scratch'],
        answer: 1,
        explanation: 'Following one real path from an entry point, then confirming by running it, gives verified understanding. A summary can be wrong and a rewrite is costly.',
      },
    ],
    task: {
      title: 'Trace before you run',
      minutes: 15,
      steps: [
        'Copy the expense program from this lesson into any free JavaScript environment (your browser\'s developer console, an online JavaScript runner or Node.js). Do not run it yet.',
        'On paper, make a trace table with the columns step, line, what happens, item and total. Fill it in for the whole program.',
        'Now run the program and compare the three printed lines with your table.',
        'Change one amount in the list, predict the new total before you run it, then run it again.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Write one sentence under your table that says in your own words what `totalOf` takes in and what it gives back.'] },
      { audience: { min: 'advanced' }, steps: ['Open a function in a project you work on, pick one realistic call, and write the call chain and the values at each hop. Check it with a debugger or a test.'] },
    ],
  },
  {
    id: 'programming-fundamentals-42',
    day: 42,
    title: 'Syntax, Runtime and Logical Errors',
    summary: 'Tell the three kinds of error apart by when they appear and what they look like, so you know where to look first.',
    minutes: 25,
    skills: ['debug-test'],
    intro: {
      objectives: [
        'Name the three kinds of error: syntax, runtime and logic',
        'Recognise each one from what you see when the program runs',
        'Decide which error to fix first, and where to start looking',
      ],
      why: 'AI-written code almost always parses and usually runs. The errors that reach you are the runtime ones that stop it and the logic ones that stay silent, so telling the kinds apart tells you where to look.',
    },
    body: [
      { type: 'paragraph', text: 'A program that is not working can be failing in three very different ways, and each needs a different search. Learning to tell them apart is the first step of debugging, because it answers the question "where do I even start looking?" before you have read a single line of the code.' },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: 'Imagine three recipe cards handed to a cook who follows them without thinking. The first reads "Mix the flour, with. eggs 2 add the" and the cook cannot even begin: it is not a recipe a person can follow. The second says "add the egg" in step five, but the last egg was used in step two. The cook has already measured and mixed, and stops halfway with a half-made batter in the bowl. The third says "add 1 cup of salt" where the writer meant sugar. The cook follows it perfectly, the cake comes out of the oven looking fine, and it tastes terrible. Nobody complained along the way.' },
      { type: 'paragraph', text: 'Those are the three kinds of error. Where the picture stops working: a human cook would taste the batter and notice the salt. A computer never tastes anything. Only you can tell that the answer is wrong, which is why the third kind is the hardest.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'Before it runs anything, JavaScript reads the whole file to check that every line follows the grammar of the language. Then it runs the lines in order. That gives three places for a mistake to show itself.' },
      {
        type: 'table',
        caption: 'The three kinds of error',
        headers: ['Kind', 'When it shows', 'What you see', 'Where to look'],
        rows: [
          ['Syntax error', 'Before anything runs', 'No output at all, not even the lines before the mistake. A message that starts with SyntaxError and points at a line.', 'The line named, and the line just before it (a missing bracket is noticed one line late).'],
          ['Runtime error', 'While the program runs', 'Some output, then the program stops. A message with a name such as TypeError or ReferenceError and a line.', 'The line named, and the value that reached it.'],
          ['Logic error', 'Never announced', 'The program finishes normally and prints a wrong answer. There is no message.', 'Wherever the answer first goes wrong. You find it by comparing with what you expected.'],
        ],
      },
      { type: 'paragraph', text: 'A **syntax error** means the grammar is broken: a missing bracket, a missing quote, a stray symbol. Because JavaScript checks the grammar first, none of the program runs. A **runtime error** means the grammar is fine and the program started, but at one moment it was asked to do something impossible. The program stops right there, and everything printed before that point stays on the screen. A **logic error** is the program doing exactly what you told it, when what you told it was not what you meant.' },
      { type: 'paragraph', text: 'Runtime errors come with a name, and the name is a clue. A `ReferenceError` means the program used a name that does not exist, usually a typo. A `TypeError` means a value is the wrong kind for what you tried to do with it. The most common one in this course is asking `undefined` for something: "Cannot read properties of undefined (reading \'amount\')" says that the thing before the dot is `undefined`, and the part in brackets is the property you asked it for. A `RangeError` means a number is outside what is allowed; a function that keeps calling itself forever ends with "Maximum call stack size exceeded", which is one.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a syntax error is a sentence the computer cannot read, so it refuses to start. A runtime error is a sentence it understood but could not do, such as "add the egg" when there is no egg, so it stops on that step and tells you which one. A logic error is a sentence it understood and did perfectly, but the sentence was wrong, like salt instead of sugar. The computer says nothing, because from its side nothing went wrong. That is why you should always decide what the right answer is before you run the code: then you will notice when it is not what you get.',
      },
      { type: 'tip', text: 'Fix the errors in this order: syntax first, because nothing else can show while the file will not parse; runtime second, because the program has to get to the end before you can judge its answer; logic last. Fixing one often reveals the next.' },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Here is a syntax error. The closing bracket after `85` is missing. The first line is perfectly fine, yet it never runs.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'syn.js (fragment: a deliberate syntax error)',
        code: `console.log('Start');
const total = (24 + 85;
console.log(total);`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22; the folder part of the path differs on your computer, and the lines after the message are trimmed)', code: '/home/you/tracker/syn.js:2\nconst total = (24 + 85;\n                      ^\n\nSyntaxError: Unexpected token \';\'\n    at wrapSafe (node:internal/modules/cjs/loader:1713:18)\n    ...' },
      { type: 'paragraph', text: 'Notice that `Start` was never printed. Next, a runtime error. Here the `expense` object has no `category`, so `expense.category` is `undefined`.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'rt.js (a runtime error)',
        code: `const expense = { description: 'Jeepney fare', amount: 24 };
console.log('Start');
console.log(expense.category.toUpperCase());
console.log('End');`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22, trimmed after the first line of the trace)', code: 'Start\n/home/you/tracker/rt.js:3\nconsole.log(expense.category.toUpperCase());\n                             ^\n\nTypeError: Cannot read properties of undefined (reading \'toUpperCase\')\n    at Object.<anonymous> (/home/you/tracker/rt.js:3:30)\n    ...' },
      { type: 'paragraph', text: 'Finally, a logic error. This function should find the biggest amount, and nothing in it is a mistake the computer can see.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'lg.js (a logic error)',
        code: `function biggestAmount(list) {
  let biggest = 0;
  for (const item of list) {
    if (item.amount < biggest) {
      biggest = item.amount;
    }
  }
  return biggest;
}

const expenses = [
  { description: 'Jeepney fare', amount: 24 },
  { description: 'Rice meal', amount: 85 },
  { description: 'Load top-up', amount: 100 },
];
console.log(biggestAmount(expenses));`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22)', code: '0' },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**syn.js:** the caret `^` sits under the `;` where JavaScript first realised the line could not be finished. The bracket that is missing is the one before it, which is why you read the named line and the line before. Nothing ran, so `Start` is absent.',
          '**rt.js:** `Start` printed, so the program was running. Then `expense.category` produced `undefined`, and `.toUpperCase()` was asked of it. The message says the thing before the dot was `undefined` and that the property being read was `toUpperCase`. `End` never printed, because the program stopped.',
          '**lg.js:** there is no message. `biggest` starts at 0, and the condition `item.amount < biggest` is never true for positive amounts, so `biggest` is never changed and the function returns the 0 it started with. The expected answer was 100. Only someone who knew the right answer could tell the program was wrong.',
        ],
      },
      { type: 'warning', text: 'No error message does not mean no bug. AI assistants are very good at producing code that parses and runs, so the mistakes you will meet most are logic errors in code that looks right. Always decide the expected answer first, and compare.' },
      {
        type: 'version',
        text: 'The wording of an error message comes from the JavaScript engine, not from the language rules, and it can differ between engines and versions. The messages above were produced by Node.js 22 (which uses the V8 engine). Browsers use different engines and may word the same mistake differently, but the error names (SyntaxError, ReferenceError, TypeError, RangeError) are the same.',
        checked: CHECKED,
        sources: [DOCS.mdnError, DOCS.nodeErrors],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Classification also tells you how to catch each kind earlier. Syntax errors are caught by the parser, so an editor shows them as you type. Many runtime errors (typos in names, a property read on a value that might be undefined) can be caught before running by linters and by a type checker such as TypeScript. Logic errors need an oracle: tests with expected values, assertions at boundaries, and monitoring of outputs. The costly failures in production are the silent ones: NaN flowing through arithmetic, implicit coercion, or an exception swallowed by an empty catch block. Prefer failing loudly and early, close to the cause, over limping on with a wrong value.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'When you meet an error, an AI assistant is a good translator, but only if you ask it to teach and not to fix. Break the expense program on purpose (remove a bracket or misspell a variable), then paste the code and the complete error message into any assistant. Never paste passwords, keys or private information.' },
      {
        type: 'prompt',
        label: 'Translate the error without fixing it',
        text: 'Here is a short JavaScript program and the exact error it produced. Do not fix the code and do not show me a corrected version. Tell me, in plain words: (1) which kind of error this is (syntax, runtime or logic), (2) what the error name and message mean, and (3) which line I should look at first and why. Then ask me what I think the cause is.\n\n[paste the code]\n\n[paste the full error message]',
      },
      { type: 'paragraph', text: 'What to look for: a good answer names the kind, quotes the line from your own code, and asks you a question. Check its claim by looking at that line yourself. An AI sometimes blames a line that only looks suspicious, so confirm before you change anything.' },
      {
        type: 'takeaways',
        items: [
          'A syntax error breaks the grammar: nothing runs and no earlier line prints.',
          'A runtime error stops a running program at one moment, and its name (ReferenceError, TypeError, RangeError) and line are clues.',
          'A logic error runs to the end with no message and gives a wrong answer, so you need to know the expected answer.',
          'Fix syntax first, then runtime, then logic.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-42-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Decode three messages',
          prompt: 'Tap each card to read what that error message is telling you.',
          concept: 'reading error messages',
          cards: [
            { front: 'SyntaxError: missing ) after argument list', back: 'The grammar is broken: a closing bracket is missing, so the program never started. Look at the line shown and the line before it.' },
            { front: 'ReferenceError: totl is not defined', back: 'The program was running and met a name that does not exist. This is usually a typo for `total`, or a variable that was never created.' },
            { front: "TypeError: Cannot read properties of undefined (reading 'amount')", back: 'The thing before the dot is `undefined`. Something you expected to be there, such as an item in a list, is not there.' },
          ],
          hints: [],
          explanation: 'Each message names a kind of error and says what went wrong in that kind. Reading the name first and the details second tells you where to look.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-42-match-1',
          kind: 'match',
          title: 'Which kind of error is it?',
          prompt: 'Match what the learner notices to the kind of error behind it.',
          concept: 'kinds of error',
          labels: { terms: 'What you notice', meanings: 'Kind of error' },
          pairs: [
            { term: 'Not even the first console.log prints, and an error appears straight away', definition: 'A syntax error', note: 'If the very first line never runs, the file failed its grammar check before anything started.' },
            { term: 'Two lines print, then the program stops with a TypeError', definition: 'A runtime error', note: 'The program ran far enough to print, then met something it could not do and stopped.' },
            { term: 'A week of paid expenses is totalled as 0, and no message appears', definition: 'A logic error', note: 'With no message and a wrong answer, the computer did what it was told. The instructions were wrong.' },
          ],
          hints: ['Ask first: did anything print at all?', 'If some lines printed and then it stopped, the program had started.', 'If it finished without any message but the answer is wrong, nothing impossible was asked.'],
          explanation: 'Nothing runs for a syntax error, a runtime error stops a running program, and a logic error finishes quietly with a wrong answer.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-42-fix-bug-1',
          kind: 'fix-bug',
          title: 'Fix the syntax error',
          prompt: 'This program will not start, and Node says `SyntaxError: missing ) after argument list`. Tap the line with the mistake, then choose the corrected line.',
          concept: 'syntax errors',
          language: 'javascript',
          code: `const price = 24;
const quantity = 3;
console.log('Total: ' + (price * quantity);`,
          bugLine: 3,
          fixes: [
            { line: "console.log('Total: ' + (price * quantity));", correct: true, why: 'The bracket that opens before `price` is now closed, and the one that opens `console.log(` is closed too.' },
            { line: "console.log('Total: ' + (price * quantity)", correct: false, why: 'That closes the inner bracket but leaves `console.log(` open.' },
            { line: "console.log('Total: ' + price * quantity;", correct: false, why: 'That removes the extra bracket but leaves `console.log(` without its closing bracket.' },
            { line: "console.log('Total: ' + (price * quantity)));", correct: false, why: 'That closes one bracket too many. A closing bracket with nothing to close is another syntax error.' },
          ],
          lineNote: 'The earlier lines are complete sentences. The message talks about an argument list, which is what goes inside `console.log( ... )`.',
          hints: ['The message says a ) is missing after an argument list. Which line has brackets?', 'Count the opening brackets and the closing brackets on the last line.', 'The line opens two brackets and closes only one. Add the missing one before the semicolon.'],
          explanation: 'Two brackets were opened, `console.log(` and `(price * quantity`, and only one was closed. JavaScript noticed at the semicolon and reported a missing bracket.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-42-fix-bug-2',
          kind: 'fix-bug',
          title: 'Fix the logic error',
          prompt: 'This function should return the biggest amount in the list, but for amounts of 24, 85 and 100 it returns 0 and no error appears. Tap the line with the mistake and pick the fix.',
          concept: 'logic errors',
          language: 'javascript',
          code: `function biggestAmount(list) {
  let biggest = 0;
  for (const item of list) {
    if (item.amount < biggest) {
      biggest = item.amount;
    }
  }
  return biggest;
}`,
          bugLine: 4,
          fixes: [
            { line: 'if (item.amount > biggest) {', correct: true, why: 'An amount replaces `biggest` only when it is larger, so `biggest` ends as the largest.' },
            { line: 'if (item.amount <= biggest) {', correct: false, why: 'This still tests for smaller amounts. With positive amounts and a start of 0 it is never true.' },
            { line: 'if (item.amount !== biggest) {', correct: false, why: 'Almost every amount is different from `biggest`, so it just keeps the last amount in the list, which is not always the biggest.' },
            { line: 'if (item.amount === biggest) {', correct: false, why: 'This only fires for an amount equal to `biggest`, which never happens when `biggest` starts at 0.' },
          ],
          tests: {
            kind: 'function',
            fn: 'biggestAmount',
            cases: [
              { label: 'biggest is in the middle', args: [[{ amount: 24 }, { amount: 100 }, { amount: 85 }]], expected: 100 },
              { label: 'biggest is last', args: [[{ amount: 24 }, { amount: 85 }, { amount: 100 }]], expected: 100 },
              { label: 'one amount', args: [[{ amount: 60 }]], expected: 60 },
            ],
          },
          lineNote: 'The line that decides whether an amount replaces `biggest` is the one that has the wrong comparison.',
          hints: ['Run it in your head with 24, 85 and 100. Does `biggest` ever change?', 'The `if` decides when an amount should replace `biggest`. Is the comparison the right way round?', 'A new amount should replace `biggest` when it is greater than it.'],
          explanation: 'The comparison was backwards: it looked for amounts smaller than `biggest`, and nothing is smaller than 0. Flipping it to `>` makes `biggest` grow to the largest amount.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-42-q1',
        prompt: 'A file prints "Start" on line 1 and has a missing closing bracket on line 8. What happens when you run it?',
        choices: ['It prints Start and then stops with a runtime error on line 8', 'It prints Start, finishes, and ignores the missing bracket', 'Nothing is printed, and a syntax error is reported', 'It prints Start and then prints a wrong answer without any message'],
        answer: 2,
        explanation: 'JavaScript checks the grammar of the whole file before it runs anything, so a syntax error means no line runs, not even the first one.',
      },
      {
        id: 'programming-fundamentals-42-q2',
        prompt: 'A program prints "Start" and then stops with `ReferenceError: totl is not defined`. What is the best next step?',
        choices: ['Check the spelling of `totl` on the line named, since the program used a name it does not know', 'Rewrite the whole program, since a ReferenceError means the logic is wrong and the design must change', 'Ignore it, because "Start" printed and so the program works', 'Add more brackets around the line named in the message'],
        answer: 0,
        explanation: 'A ReferenceError names a variable that does not exist. It is most often a typo or a variable that was never created.',
      },
      {
        id: 'programming-fundamentals-42-q3',
        prompt: 'The tracker finishes with no error, but says the total of five paid expenses is 0. Which kind of error is it, and why is it the hardest to find?',
        choices: ['A syntax error, because the total is wrong', 'A logic error, because the program did what it was told and nothing announces the mistake', 'A runtime error, because the program printed a number', 'A logic error, because the computer always reports the line that holds the mistake in its message'],
        answer: 1,
        explanation: 'A wrong answer with no message is a logic error. The program ran correctly from its own point of view, so only comparing with the expected answer reveals it.',
      },
      {
        id: 'programming-fundamentals-42-q4',
        prompt: 'A program has a syntax error, a runtime error and a logic error. In which order should you fix them?',
        choices: ['Logic first, since it is the hardest, then runtime and then syntax', 'Runtime first, since it stops the program, then syntax and then logic', 'Whichever is on the lowest line number, since the order does not matter', 'Syntax first, then runtime, then logic, because each one hides the next'],
        answer: 3,
        explanation: 'A syntax error stops the program from starting, and a runtime error stops it before its answer can be judged. Only a program that runs to the end can show a logic error.',
      },
      {
        id: 'programming-fundamentals-42-q5',
        audience: { max: 'beginner' },
        prompt: 'In the three recipe cards, which one matches a logic error?',
        choices: ['The card that says "add 1 cup of salt" when the writer meant sugar, so the cake bakes and tastes wrong', 'The card with the words in a jumbled order, so the cook cannot follow it and cannot even start', 'The card that asks for an egg that has already been used up'],
        answer: 0,
        explanation: 'A logic error is followed perfectly and nothing stops, yet the result is wrong. The jumbled card is a syntax error and the missing egg is a runtime error.',
      },
      {
        id: 'programming-fundamentals-42-q6',
        audience: { min: 'advanced' },
        prompt: 'A report job adds up order totals. One bad input turns a value into NaN, and the job finishes and publishes "NaN" in a column nobody checks. What is the most useful lesson for the code?',
        choices: ['Wrap the whole job in an empty catch block so it never stops', 'Convert every value with Number() so NaN cannot appear', 'Validate inputs at the boundary and fail loudly near the cause, instead of letting a wrong value travel', 'Run the job twice and publish the larger answer, so that a smaller wrong value cannot reach the report'],
        answer: 2,
        explanation: 'Silent failures are the costly ones. Checking input where it enters, and stopping with a clear error close to the cause, turns a hidden logic problem into one you can see.',
      },
    ],
    task: {
      title: 'Break it on purpose',
      minutes: 15,
      steps: [
        'Copy the expense program from lesson 41 into a free JavaScript environment and run it once to confirm it prints three lines.',
        'Break it one way at a time. First remove one closing bracket. Run it, and write down what you see and what did not print.',
        'Put it back, then misspell `list` as `lst` inside `totalOf`. Run it, and write down the error name, the message and the line.',
        'Put it back again, then change `total + item.amount` to `total - item.amount`. Run it and note that there is no message. Write down what is wrong with the answer.',
        'For each of the three, write the kind of error and one sentence about how you could tell.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Write each error message in your own words, as if explaining it to a friend who has never coded.'] },
      { audience: { min: 'advanced' }, steps: ['Open the same file in an editor with a linter or a type checker and note which of the three mistakes it flags before you run the code, and which it does not.'] },
    ],
  },
  {
    id: 'programming-fundamentals-43',
    day: 43,
    title: 'Debugging Techniques and Console Logs',
    summary: 'Find a bug with a method instead of a guess: reproduce it, narrow it down, test one idea at a time, and use console.log as your window into the program.',
    minutes: 25,
    skills: ['debug-test', 'problem-solving'],
    intro: {
      objectives: [
        'Follow the six steps of debugging: reproduce, narrow, hypothesise, test, fix and confirm',
        'Use labelled console.log lines to see what a program holds while it runs',
        'Explain a problem clearly enough for a person or an AI assistant to help',
      ],
      why: 'Debugging is where most programming time goes, and it is where AI help is most useful or most misleading. With a method, you give the assistant what it needs and you can tell a good suggestion from a lucky guess.',
    },
    body: [
      { type: 'paragraph', text: 'Finding a bug can feel like magic that some people have and others do not. It is not. It is a method, and people who debug well do the same few things in the same order. Beginners tend to change code at random until the problem goes away, which sometimes works and teaches nothing. This lesson gives you the method, and the simplest tool for it: printing what the program is holding.' },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: 'A motorcycle will not start. A good mechanic does not replace parts at random. First they try it again to see that it really fails (reproduce). Then they split the problem: does it turn over but not fire, or does it not turn at all (narrow down)? They make a guess they can test: "I think there is no fuel" (hypothesis). They test it by looking in the tank (test). If they were right, they add fuel (fix), and they start the engine again to confirm it runs.' },
      { type: 'paragraph', text: 'Where the picture stops working: a mechanic can open the engine and look. Your program runs inside the computer, out of sight. To see inside it, you have to add your own windows, and the simplest window is a line that prints a value.' },
      { type: 'heading', text: 'How it works' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Reproduce.** Make the problem happen on purpose, every time, with the smallest input that still fails. A bug you cannot repeat, you cannot test a fix for.',
          '**Narrow down.** Find where the program first goes wrong. Check a value in the middle: if it is right there, the problem is further down; if it is already wrong, it is further up. Halve the search each time.',
          '**Form a hypothesis.** One specific guess you can prove wrong: "the `if` never matches", not "something is broken".',
          '**Test the hypothesis.** Look at the real values with a log or a check. Change nothing else yet.',
          '**Fix** the one thing the test pointed to.',
          '**Confirm.** Run the failing case again and the cases that used to work, then remove the debugging lines.',
        ],
      },
      { type: 'diagram', format: 'mermaid', caption: 'The debugging loop. A wrong guess is not a failure: it narrows the search.', source: 'flowchart TD\n  A[Reproduce: make it fail every time] --> B[Narrow down: where does it first go wrong?]\n  B --> C[Form one guess you can test]\n  C --> D[Test the guess with a log or a check]\n  D --> E{Was the guess right?}\n  E -->|no| B\n  E -->|yes| F[Fix that one thing]\n  F --> G[Confirm: rerun every case and remove the logs]' },
      { type: 'paragraph', text: 'Two more habits help. First, **explain the code out loud**, line by line, to anyone: a friend, a rubber duck on your desk, or an AI assistant. This is called rubber duck debugging. It works because you are forced to say what each line really does, and the gap between what you meant and what you wrote often shows up while you speak. Second, **change one thing at a time**. If you change three things and the bug disappears, you do not know which one fixed it, or whether you added a new bug.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: you cannot watch a program think, so you make it talk. A line such as `console.log(\'total after loop:\', total)` tells you what `total` holds at that moment, like asking "how much is in the jar right now?". You put a few of these in the places you doubt, run the program, and read what it says. If the jar holds what you expected, look further on. If not, the mistake is before that line. When you are finished, take the questions out again.',
      },
      { type: 'heading', text: 'Writing logs that help' },
      {
        type: 'list',
        items: [
          '**Label every log.** `console.log(\'total after loop:\', total)` is useful; a bare `console.log(total)` among ten others is not. `console.log` accepts several values separated by commas and prints them with a space between.',
          '**Log at the doors of a function:** the arguments when it starts, and the result just before it returns.',
          '**Log inside loops and branches** to see which turns and which branches really ran.',
          '**Log the type when unsure:** `console.log(\'amount is\', typeof amount)` catches the text "85" that looks like a number.',
          '**Remove them when you are done**, and never print passwords, keys or private information. Logs are easy to forget and easy to share by accident.',
        ],
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'The tracker must add up the food expenses. Two food items (85 and 60) should give 145, yet the program prints 0 and there is no error. That is a logic error, so there is no message to read. Step one is to reproduce it: the smallest failing call is the one below.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'totalFor: the problem, reproduced',
        code: `const expenses = [
  { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' },
  { description: 'Rice meal', amount: 85, category: 'food', date: '2026-11-16' },
  { description: 'Load top-up', amount: 100, category: 'load', date: '2026-11-17' },
  { description: 'Coffee', amount: 60, category: 'food', date: '2026-11-17' },
];

function totalFor(list, category) {
  let total = 0;
  for (const item of list) {
    if (item.category === category) {
      total = total + item.amount;
    }
  }
  return total;
}

console.log(totalFor(expenses, 'Food'));`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22)', code: '0' },
      { type: 'paragraph', text: 'The function is short, but the bug is not obvious by looking. Add labelled logs at the doors and in the loop, and change nothing else.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'totalFor with debugging logs',
        code: `function totalFor(list, category) {
  console.log('totalFor called with', list.length, 'items and category', category);
  let total = 0;
  for (const item of list) {
    console.log('checking', item.description, 'category', item.category);
    if (item.category === category) {
      console.log('  match, adding', item.amount);
      total = total + item.amount;
    }
  }
  console.log('total at the end:', total);
  return total;
}`,
      },
      { type: 'code', language: 'text', label: 'Output with the same call (Node.js 22)', code: 'totalFor called with 4 items and category Food\nchecking Jeepney fare category transport\nchecking Rice meal category food\nchecking Load top-up category load\nchecking Coffee category food\ntotal at the end: 0\n0' },
      { type: 'paragraph', text: 'Now the fix. `toLowerCase()` gives a copy of a piece of text in lowercase, like `toUpperCase()` from the strings lesson. Lowercasing the wanted category once, before the loop, makes `Food`, `food` and `FOOD` all match the stored `food`.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'totalFor, fixed',
        code: `function totalFor(list, category) {
  const wanted = category.toLowerCase();
  let total = 0;
  for (const item of list) {
    if (item.category === wanted) {
      total = total + item.amount;
    }
  }
  return total;
}

console.log(totalFor(expenses, 'Food'));
console.log(totalFor(expenses, 'food'));
console.log(totalFor(expenses, 'FOOD'));`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22)', code: '145\n145\n145' },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Reproduce:** `totalFor(expenses, \'Food\')` prints 0 every time. That is the smallest failing case.',
          '**Narrow down:** the first log shows the function received 4 items and the category `Food`. The loop log shows it checked every item, so the loop works and the items are fine.',
          '**Hypothesis:** the condition `item.category === category` never matches. The loop is not the problem; the comparison is.',
          '**Test:** the logs print `food` for the rice meal and `Food` came in as the argument. Capital F and small f are different text, so `===` is false. No match line ever printed.',
          '**Fix:** lowercase the wanted category once before the loop. Only one line changed.',
          '**Confirm:** three calls, with `Food`, `food` and `FOOD`, all give 145, and the logs are gone.',
        ],
      },
      { type: 'tip', text: 'When you ask anyone for help, including an AI assistant, bring four things: what you expected, what you got instead, the smallest code that shows it, and what you already tried. That is your reproduce step written down, and it is what a good helper needs.' },
      {
        type: 'version',
        text: 'Chrome DevTools has a breakpoint type called a logpoint, which prints a message when a line is reached without you editing the code. Git has a command, git bisect, that uses binary search over the commit history to find the commit that introduced a bug. Both were checked against their official documentation.',
        checked: CHECKED,
        sources: [DOCS.chromeBreakpoints, DOCS.gitBisect],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Experienced debugging is the same loop with better instruments. Reduce the failure to a minimal reproducible example, ideally as a failing test, so the fix is verifiable and stays verified. Narrow by bisecting: in the code with logs or assertions, and in time with `git bisect` when the bug appeared between two known commits. Prefer logpoints and conditional breakpoints to editing source, so you cannot ship a stray log. Beware heisenbugs, where the act of logging changes timing, and read the logs for what is absent as much as what is present. In production, structured logs with request identifiers replace console prints, and personal data in logs is a security and privacy problem.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'Use an AI assistant as a debugging partner, with the rule that it must help you test ideas rather than hand you a rewrite. Give it the four things from the tip above. Use any assistant you have, and keep passwords, keys and private data out of what you paste.' },
      {
        type: 'prompt',
        label: 'Ask for hypotheses and tests, not a rewrite',
        text: 'I have a JavaScript bug. Expected: [what you expected]. Actual: [what you got]. Here is the smallest code that shows it: [paste code]. I have already tried: [what you tried]. Do not rewrite my code. Give me three possible causes, ranked from most to least likely, and for each one tell me exactly which console.log line I could add to check it. Then wait for me to report what the logs said.',
      },
      { type: 'paragraph', text: 'What to look for: each suggested cause should come with a way to prove it wrong, and the ones that name a specific line of your code are better than general advice. A confident cause is still only a hypothesis. An assistant can point at a line that looks wrong but is not the reason, so run the log it suggests before you change anything.' },
      {
        type: 'takeaways',
        items: [
          'Debugging is a method: reproduce, narrow down, form one hypothesis, test it, fix one thing, and confirm.',
          'Halve the search: check a value in the middle to learn whether the bug is above or below.',
          'Labelled console.log lines at the doors of a function and inside loops and branches show what the program really holds.',
          'Change one thing at a time, remove the logs afterwards, and keep secrets and personal data out of them.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-43-arrange-1',
          kind: 'arrange',
          title: 'Order a debugging session',
          prompt: 'The tracker prints a food total of 0 instead of 145. Put the steps of this debugging session in a sensible order.',
          concept: 'debugging method',
          language: 'text',
          solution: [
            'Run totalFor(expenses, "Food") and see 0 where 145 is expected',
            'Guess that the comparison in the if never matches',
            'Log each item\'s category inside the loop',
            'Notice the log shows "food" while the call used "Food"',
            'Lowercase the wanted category before comparing',
            'Rerun the calls, confirm 145, and remove the logs',
          ],
          reasons: [
            'First you see the failure, so you know it is real and repeatable.',
            'A specific guess tells you what to look at.',
            'The log tests the guess without changing the behaviour.',
            'The log result confirms the guess and shows the exact cause.',
            'Only now do you change the code, and only one thing.',
            'Confirming and cleaning up come last.',
          ],
          hints: ['You cannot guess a cause before you have seen the failure.', 'The log comes before the fix, because it is what tells you what to fix.', 'The session starts with running the failing call and ends with rerunning it and removing the logs.'],
          explanation: 'See the failure, guess a cause, test it with a log, read what the log shows, change one thing, then confirm. Changing code before the log would be guessing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-43-predict-output-1',
          kind: 'predict-output',
          title: 'Read the logs',
          prompt: 'A learner added logs to find out which amounts count as big. Predict the lines this program prints, in order.',
          concept: 'console.log debugging',
          language: 'javascript',
          code: `const amounts = [24, 85, 100, 60];
let big = 0;
for (const amount of amounts) {
  if (amount > 50) {
    big = big + 1;
    console.log('big one:', amount, 'count now', big);
  } else {
    console.log('small one:', amount);
  }
}
console.log('big count', big);`,
          choices: [
            'small one: 24\nbig one: 85 count now 1\nbig one: 100 count now 2\nbig one: 60 count now 3\nbig count 3',
            'small one: 24\nbig one: 85 count now 1\nbig one: 100 count now 2\nsmall one: 60\nbig count 2',
            'big one: 24 count now 1\nbig one: 85 count now 2\nbig one: 100 count now 3\nbig one: 60 count now 4\nbig count 4',
            'small one: 24\nbig one: 85 count now 85\nbig one: 100 count now 185\nbig one: 60 count now 245\nbig count 245',
          ],
          wrongNotes: {
            'small one: 24\nbig one: 85 count now 1\nbig one: 100 count now 2\nsmall one: 60\nbig count 2': '60 is greater than 50, so it takes the `if` branch, not the `else` one.',
            'big one: 24 count now 1\nbig one: 85 count now 2\nbig one: 100 count now 3\nbig one: 60 count now 4\nbig count 4': '24 is not greater than 50, so it takes the `else` branch.',
            'small one: 24\nbig one: 85 count now 85\nbig one: 100 count now 185\nbig one: 60 count now 245\nbig count 245': '`big` goes up by 1 each time, not by the amount. It counts the big ones.',
          },
          hints: ['Test each amount against 50 one at a time. Which branch does it take?', 'Only 24 is 50 or smaller. 85, 100 and 60 are all greater than 50.', 'The count goes 1, 2, 3 for the three big amounts, and the last line prints big count 3.'],
          explanation: '24 fails `amount > 50` and prints the small line. 85, 100 and 60 pass it, and each adds 1 to `big`, so the count reaches 3. Logs inside branches show which branch ran, which is exactly why they help.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-43-code-challenge-1',
          kind: 'code-challenge',
          title: 'Fix totalFor for good',
          prompt: 'The function below only matches categories typed in exactly the same case as the stored ones. Change it so that `Food`, `food` and `FOOD` all give the food total. The expenses are stored with lowercase categories such as `food`.',
          concept: 'debugging a logic error',
          language: 'javascript',
          starter: `function totalFor(list, category) {
  let total = 0;
  for (const item of list) {
    if (item.category === category) {
      total = total + item.amount;
    }
  }
  return total;
}`,
          solution: `function totalFor(list, category) {
  const wanted = category.toLowerCase();
  let total = 0;
  for (const item of list) {
    if (item.category === wanted) {
      total = total + item.amount;
    }
  }
  return total;
}`,
          tests: {
            kind: 'function',
            fn: 'totalFor',
            cases: [
              { label: 'Food with a capital', args: [[{ amount: 24, category: 'transport' }, { amount: 85, category: 'food' }, { amount: 100, category: 'load' }, { amount: 60, category: 'food' }], 'Food'], expected: 145 },
              { label: 'food in lowercase', args: [[{ amount: 24, category: 'transport' }, { amount: 85, category: 'food' }, { amount: 100, category: 'load' }, { amount: 60, category: 'food' }], 'food'], expected: 145 },
              { label: 'FOOD in capitals', args: [[{ amount: 85, category: 'food' }, { amount: 60, category: 'food' }], 'FOOD'], expected: 145 },
              { label: 'transport', args: [[{ amount: 24, category: 'transport' }, { amount: 85, category: 'food' }], 'Transport'], expected: 24 },
              { label: 'a category with no expenses', args: [[{ amount: 24, category: 'transport' }], 'rent'], expected: 0 },
            ],
          },
          hints: ['The stored category is lowercase. Make the wanted category lowercase too before comparing.', '`category.toLowerCase()` gives a lowercase copy of the text. Do it once, before the loop.', 'Add `const wanted = category.toLowerCase();` and compare `item.category === wanted`.'],
          explanation: 'Comparing text with `===` is exact, so `Food` and `food` differ. Lowercasing the wanted category once, before the loop, makes the comparison case-insensitive without touching the stored data.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-43-q1',
        prompt: 'What is the right first step when a program gives a wrong answer?',
        choices: ['Rewrite the function from scratch, since a function that fails once is probably badly designed and cannot be trusted', 'Make the problem happen on purpose, every time, with the smallest input that still fails', 'Add console.log lines to every line of the program at once', 'Ask an AI assistant to produce a version that works'],
        answer: 1,
        explanation: 'A failure you can repeat is a failure you can test a fix against. Everything else in the method depends on reproducing it first.',
      },
      {
        id: 'programming-fundamentals-43-q2',
        prompt: 'A total prints 0. You suspect the loop never adds anything. What is the best next move?',
        choices: ['Change the starting value of total to 1 and see what happens', 'Delete the loop and write it again in a different style', 'Add a labelled log inside the loop and look at what it prints', 'Run the program ten times in case the result changes, because a bug may only show up some of the time'],
        answer: 2,
        explanation: 'A log inside the loop tests your guess directly: either it prints for each item, or it does not. Changing other things first would hide the answer.',
      },
      {
        id: 'programming-fundamentals-43-q3',
        prompt: 'Which debugging line will be easiest to read among many other lines of output?',
        choices: ['console.log(\'total after loop:\', total)', 'console.log(total, amount, item, list, date)', 'console.log(\'here\')', 'console.log(1)'],
        answer: 0,
        explanation: 'A label says where the line is and what the value means. A bare value or a vague word forces you to work out which log it was.',
      },
      {
        id: 'programming-fundamentals-43-q4',
        prompt: 'The failing case now gives the right answer after your change. What should you do before calling it fixed?',
        choices: ['Nothing, because the failing case passes', 'Delete the test input so the problem cannot come back', 'Change one more thing, in case there is a second bug hiding behind the first one you just fixed', 'Run the cases that used to work, and remove the debugging logs'],
        answer: 3,
        explanation: 'A fix can break something that worked. Confirming means rerunning the old cases as well, and the logs come out so they do not clutter later output or leak data.',
      },
      {
        id: 'programming-fundamentals-43-q5',
        audience: { max: 'beginner' },
        prompt: 'In the motorcycle picture, which step is the hypothesis?',
        choices: ['Starting the engine again at the end to see that it runs and that nothing else has broken', 'Guessing "there is no fuel" and then looking in the tank to check', 'Trying the starter again to see that it really fails'],
        answer: 1,
        explanation: 'A hypothesis is a specific guess that you can check. Trying again is reproducing, and starting at the end is confirming.',
      },
      {
        id: 'programming-fundamentals-43-q6',
        audience: { min: 'advanced' },
        prompt: 'A regression appeared somewhere in the last 40 commits, and a script can tell good from bad. What is the most efficient way to find the cause?',
        choices: ['Bisect the history: test the middle commit and halve the range each time, using the script', 'Read the diffs of all 40 commits from the oldest to the newest and look for anything that seems suspicious', 'Revert the 40 commits and add them back one by one without testing', 'Ask the person who made the most recent commit to explain it'],
        answer: 0,
        explanation: 'Binary search over the history finds the first bad commit in about six tests instead of forty. Git automates it with `git bisect` and a script that reports good or bad.',
      },
    ],
    task: {
      title: 'Debug with logs and write it down',
      minutes: 20,
      steps: [
        'Copy the expense list and the buggy `totalFor` from this lesson into any free JavaScript environment, and run `totalFor(expenses, \'Food\')` to reproduce the 0.',
        'Without fixing anything, add the three labelled logs shown in the lesson. Read the output and write one sentence about what it tells you.',
        'Make the one-line fix with `toLowerCase()`, then run the three calls (`Food`, `food`, `FOOD`) and confirm each gives 145.',
        'Remove every log. Then write the six steps of the method in your own words and say which line of your output belongs to which step.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Explain the bug out loud, line by line, as if to a rubber duck, before you add any log. Note whether you spotted the problem while explaining.'] },
      { audience: { min: 'advanced' }, steps: ['Write the failing case as a test first (a check that prints PASS or FAIL), confirm it fails, then fix the code and watch it pass. Keep the test.'] },
    ],
  },
  {
    id: 'programming-fundamentals-44',
    day: 44,
    title: 'Stack Traces and Breakpoints',
    summary: 'Read the error report a crashing program prints, and learn what a debugger lets you do: pause on a line, look inside, and step.',
    minutes: 25,
    skills: ['debug-test'],
    intro: {
      objectives: [
        'Read a stack trace: the message, the line where it stopped, and the chain of calls',
        'Explain why the line where a program crashed is not always the line that is wrong',
        'Describe what a breakpoint and the stepping buttons do, and when to use each',
      ],
      why: 'A crash prints exactly where it happened and how the program got there. Reading that report, and knowing a debugger can show the same thing live, saves hours of guessing, whether the code is yours or an AI wrote it.',
    },
    body: [
      { type: 'paragraph', text: 'When a program crashes, it prints a long block of text that most beginners skip because it looks like noise. It is the opposite. It is a report written by the computer itself, and it tells you what went wrong, where, and which calls led there. This lesson teaches you to read that report, and then shows the tool that gives you the same view while the program is still running: the debugger.' },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: 'Picture a sari-sari store on a busy afternoon. A customer asks Ate Lyn for a bottle of vinegar. She asks the helper, Kuya Ben, to fetch it. Kuya Ben goes to the back and asks the supplier\'s runner to check the shelf, and the shelf is empty. If the runner writes up what happened, the report reads from the bottom of the chain up: "Shelf empty. I was asked by Kuya Ben, who was asked by Ate Lyn, who was asked by the customer." Everyone in that chain is still waiting for an answer.' },
      { type: 'paragraph', text: 'A stack trace is that report. Where the picture stops working: the trace lists only the calls that are unfinished at the moment of the crash, not everything that ever happened before it.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'Every time a function is called, the computer puts that call on top of a pile of unfinished calls, called the **call stack**. When the function returns, its call comes off the pile and the one underneath continues. When an error stops the program, the computer prints the pile as it stood at that moment, with the most recent call on top. That printout is the **stack trace**.' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Find the message.** It has the error name and the detail, such as `TypeError: Cannot read properties of undefined (reading \'toUpperCase\')`.',
          '**Find the first line of the trace that is in your own file.** Each line starts with `at`, then the function name, then the file, line and column. The top one is the place where the program actually stopped.',
          '**Read downward.** Each line is the function that called the one above it. The last line of your own code is usually the main program, shown as `Object.<anonymous>`.',
          '**Ignore lines that mention `node:internal`.** They are Node\'s own startup code, not yours.',
          '**Ask where the bad value came from.** The crash is where the problem showed up, not always where it began.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: think of the call stack as a pile of sticky notes, each saying "I am waiting for the answer from the note above me". When the top note hits a problem, the program stops and prints the whole pile from the top down. The top note is where it happened, and each note below it is who was waiting. You read the message, find the top note that belongs to your own code, then look down the pile to see how the program got there.',
      },
      { type: 'paragraph', text: 'The last step matters most. Suppose the trace says the crash was inside `categoryLabel`, and `categoryLabel` looks perfectly fine. The function was handed an item with no category. The mistake is in the data, or in the code that made that data, and the trace shows you the callers to follow upward.' },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Here is the expense program again, with three functions calling each other. The second expense has no `category`, on purpose.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'tracker.js',
        code: `const expenses = [
  { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' },
  { description: 'Rice meal', amount: 85, date: '2026-11-16' },
];

function categoryLabel(item) {
  return item.category.toUpperCase();
}

function describeItem(item) {
  return \`\${item.description}: \${categoryLabel(item)}\`;
}

function printAll(list) {
  for (const item of list) {
    console.log(describeItem(item));
  }
}

printAll(expenses);`,
      },
      { type: 'code', language: 'text', label: 'Real output from Node.js v22 (only the folder part of the path was replaced)', code: 'Jeepney fare: TRANSPORT\n/home/you/tracker/tracker.js:7\n  return item.category.toUpperCase();\n                       ^\n\nTypeError: Cannot read properties of undefined (reading \'toUpperCase\')\n    at categoryLabel (/home/you/tracker/tracker.js:7:24)\n    at describeItem (/home/you/tracker/tracker.js:11:34)\n    at printAll (/home/you/tracker/tracker.js:16:17)\n    at Object.<anonymous> (/home/you/tracker/tracker.js:20:1)\n    at Module._compile (node:internal/modules/cjs/loader:1781:14)\n    at Object..js (node:internal/modules/cjs/loader:1913:10)\n    at Module.load (node:internal/modules/cjs/loader:1505:32)\n    at Function._load (node:internal/modules/cjs/loader:1309:12)\n    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)\n\nNode.js v22.23.1' },
      { type: 'heading', text: 'Walk through the code' },
      { type: 'table', caption: 'Reading the trace from top to bottom', headers: ['Part of the output', 'What it tells you'], rows: [
        ['Jeepney fare: TRANSPORT', 'The first item was fine and printed. The program was running normally.'],
        ['tracker.js:7 and the line with ^', 'The crash happened on line 7, and the caret points at the `.toUpperCase` that was asked of an undefined value.'],
        ['TypeError: Cannot read properties of undefined (reading \'toUpperCase\')', '`item.category` was `undefined`. The second expense has no category.'],
        ['at categoryLabel (tracker.js:7:24)', 'The top frame: the program stopped here, on line 7 column 24.'],
        ['at describeItem (tracker.js:11:34)', 'categoryLabel was called from line 11, inside describeItem.'],
        ['at printAll (tracker.js:16:17)', 'describeItem was called from line 16, inside the loop of printAll.'],
        ['at Object.<anonymous> (tracker.js:20:1)', 'printAll was called from the main program, on line 20.'],
        ['at Module._compile (node:internal/...) and below', 'Node\'s own machinery that loads and starts your file. Skip these.'],
      ] },
      { type: 'paragraph', text: 'The top frame says line 7, but line 7 is correct code. The real question is "why did the second item reach `categoryLabel` without a category?" The answer is in the list at the top of the file, or in whatever code built that list. The trace did its job: it told you which function, which line, and who called it.' },
      { type: 'heading', text: 'Breakpoints: the same view, live' },
      { type: 'paragraph', text: 'A stack trace is read after the crash. A **debugger** lets you look while the program is running. You set a **breakpoint** on a line, and when the program reaches it, it pauses. While it is paused you can see the value of every variable in view (a pane usually called Scope or Variables), the call stack, and you can watch expressions you choose. Then you move forward on your terms with the **stepping** controls.' },
      {
        type: 'table',
        caption: 'The stepping controls, as they are labelled in three common tools',
        headers: ['What it does', 'Chrome DevTools', 'VS Code', 'Node.js command line'],
        rows: [
          ['Run until the next breakpoint, or to the end', 'Resume', 'Continue', 'cont (or c)'],
          ['Run this line and stop at the next line in the same function, without going inside calls', 'Step over', 'Step Over', 'next (or n)'],
          ['Go inside the function that this line calls', 'Step into', 'Step Into', 'step (or s)'],
          ['Finish the current function and pause in the caller', 'Step out', 'Step Out', 'out (or o)'],
        ],
      },
      { type: 'paragraph', text: 'Here is what a debugging session on `tracker.js` could look like, with a breakpoint on line 16 (the `console.log` in the loop of `printAll`).' },
      {
        type: 'table',
        caption: 'A stepping session. The call stack is shown with the top of the pile first.',
        headers: ['Action', 'Paused at', 'Call stack', 'What you can see'],
        rows: [
          ['Run to the breakpoint', 'line 16, in printAll', 'printAll', 'item is Jeepney fare, and item.category is transport'],
          ['Step into', 'line 11, in describeItem', 'describeItem, printAll', 'the same item was passed down'],
          ['Step into', 'line 7, in categoryLabel', 'categoryLabel, describeItem, printAll', 'about to read item.category.toUpperCase()'],
          ['Step out', 'back in describeItem', 'describeItem, printAll', 'categoryLabel has returned TRANSPORT'],
          ['Resume', 'line 16 again, second turn', 'printAll', 'item is Rice meal, and the Scope pane shows it has no category property: the cause'],
        ],
      },
      { type: 'visual', id: 'scope-execution-flow', caption: 'Step through a small program and watch the call stack and the variables change. This is the same picture a debugger gives you for real code.' },
      { type: 'paragraph', text: 'You can also write the word `debugger` as a line in your code. When developer tools or another debugger are attached, the program pauses there like a breakpoint. When none is attached, the line does nothing.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'A debugger statement',
        code: `function categoryLabel(item) {
  debugger; // pauses here if a debugger is attached, otherwise does nothing
  return item.category.toUpperCase();
}`,
      },
      {
        type: 'version',
        text: 'The control names above are the labels used by Chrome DevTools\' JavaScript debugger and the Node.js command-line debugger (started with node inspect) at the time of checking, with Node.js 22 producing the traces shown. Tool interfaces and the exact wording of a trace can change between versions. The idea (pause, look, step in, over or out) is the stable part.',
        checked: CHECKED,
        sources: [DOCS.chromeJsRef, DOCS.chromeBreakpoints, DOCS.nodeDebugger, DOCS.nodeErrors, DOCS.mdnDebugger],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'The same tools go further. Conditional breakpoints pause only when an expression is true (for example on the 200th loop turn), and logpoints print without editing the source. Node keeps only a limited number of frames in a trace (the default for `Error.stackTraceLimit` is 10), so a deep call chain can be cut short. You can attach a debugger to a running Node process with the `--inspect` flag, and in bundled or minified code you rely on source maps to turn a trace back into your original file and line. In production, traces go to error monitoring with the release version attached, and a trace is evidence for a hypothesis, not a verdict: the failing frame is where the invariant was noticed, not necessarily where it was broken.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'An AI assistant reads traces well, which makes it a good tutor if you make it explain rather than fix. Run `tracker.js`, copy the complete error output, and use any assistant you like. Remove anything private from the paths and the code before you paste.' },
      {
        type: 'prompt',
        label: 'Have the AI teach you to read the trace',
        text: 'Here is a JavaScript program and the full error output it produced. Do not fix the code. Walk me through the stack trace one line at a time: what the message means, which line is the top frame, who called whom, and which lines I can ignore. Then ask me which function I should look at to find the real cause, and wait for my answer.\n\n[paste the code]\n\n[paste the complete error output]',
      },
      { type: 'paragraph', text: 'What to look for: the explanation should match your own reading of the table above, with the same top frame and the same chain of callers. If the assistant suggests the bug is in the top frame, ask yourself whether that function really looks wrong or whether the data it received is wrong. An assistant can also invent a line number, so find each line it mentions in your code.' },
      {
        type: 'takeaways',
        items: [
          'A stack trace is the pile of unfinished calls when the program stopped, printed with the most recent call first.',
          'Read the message, find the first frame in your own file, then read downward to see who called whom, and skip node:internal lines.',
          'The crash line is where the problem showed up, not always where it began: follow the callers and the data.',
          'A breakpoint pauses the program so you can see variables and the call stack; resume, step over, step into and step out move you forward.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-44-fill-blank-1',
          kind: 'fill-blank',
          title: 'Read the stack trace',
          prompt: 'Use the trace to complete the sentences about where the program stopped and who called whom.',
          concept: 'stack traces',
          language: 'text',
          code: `TypeError: Cannot read properties of undefined (reading 'amount')
    at priceOf (shop.js:3:24)
    at addUp (shop.js:9:18)
    at Object.<anonymous> (shop.js:14:1)

The program stopped inside the function ___ on line ___ of shop.js.
That function was called by ___, which the main program called on line 14.`,
          bank: ['priceOf', 'addUp', '3', '9', '14'],
          blanks: [
            { answers: ['priceOf'], feedback: 'The top frame, the first "at" line, is where the program stopped.' },
            { answers: ['3'], feedback: 'The numbers after the file name are the line and the column. Use the line from the top frame.' },
            { answers: ['addUp'], feedback: 'The frame below the top one is the function that called it.' },
          ],
          hints: ['The first "at" line is where the program stopped.', 'The format is function, then file:line:column. The frame underneath is the caller.', 'priceOf is the top frame at line 3, and it was called by the next frame down, addUp.'],
          explanation: 'The top frame, `priceOf (shop.js:3:24)`, is where the program stopped, on line 3. The next frame, `addUp`, called it, and the last frame, `Object.<anonymous>`, is the main program calling addUp on line 14.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-44-match-1',
          kind: 'match',
          title: 'Which button do you press?',
          prompt: 'You are paused in a debugger. Match what you want to do to the control that does it.',
          concept: 'breakpoints and stepping',
          labels: { terms: 'You are paused and want to', meanings: 'Press' },
          pairs: [
            { term: 'See what happens inside the function that the current line calls', definition: 'Step into', note: 'Going inside a call is what step into is for.' },
            { term: 'Run the current line, call included, and stop on the next line of this same function', definition: 'Step over', note: 'Step over treats a call as one move and stays in the current function.' },
            { term: 'You are deep inside a function whose rest looks fine, and want to be back in its caller', definition: 'Step out', note: 'Step out finishes the current function and pauses in whoever called it.' },
            { term: 'Let the program carry on until it hits the next breakpoint or ends', definition: 'Resume', note: 'Resume (also called Continue) is the one that runs freely until a breakpoint.' },
          ],
          hints: ['Think about whether you want to go inside a call, stay at this level, go up a level, or stop stepping.', 'Into goes down a level, out goes up a level, and over stays on the same level.', 'Resume is the only one that does not stop at the next line.'],
          explanation: 'Step into goes down into a call, step over stays on the same level, step out goes up to the caller, and resume runs freely until the next breakpoint.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-44-scenario-1',
          kind: 'scenario',
          title: 'The crash line looks fine',
          situation: 'A trace says the program stopped in `categoryLabel` on `item.category.toUpperCase()`, and the message says `item.category` is undefined. The function was written by a teammate and looks correct for any item that has a category. The list of expenses is built three calls further up.',
          prompt: 'What is the best next move?',
          concept: 'finding the cause behind the crash line',
          options: [
            { text: 'Follow the callers upward and look at the data: which item reached the function with no category, and where was it created?', consequence: 'You find the second expense in the list has no category. Now you can decide whether to fix the data, or to validate expenses when they are added.', quality: 'best' },
            { text: 'Make categoryLabel return "other" whenever category is missing, and move on', consequence: 'The crash goes away, but the expense with no category is now silently labelled "other", and the real problem in the data stays hidden.', quality: 'acceptable' },
            { text: 'Delete the toUpperCase call so the line cannot fail', consequence: 'The crash moves: the label is now undefined text, and you changed the output without understanding why.', quality: 'poor' },
            { text: 'Rewrite categoryLabel from scratch in a different style', consequence: 'The new function crashes in the same way, because the problem is not in how it was written.', quality: 'poor' },
          ],
          hints: ['The function is correct for a normal item. So what was different about the item it received?', 'The trace lists the callers for a reason. The bad value came from somewhere up the chain.', 'Find the item with no category, then decide where the problem should be fixed.'],
          explanation: 'The crash line is where the problem showed up. The value arrived from a caller or from the data, so following the chain upward finds the cause, while a quiet guard or a rewrite only hides or repeats it.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-44-q1',
        prompt: 'In a Node stack trace, which line shows where the program actually stopped?',
        choices: ['The last "at" line, which is the one closest to the bottom of the report', 'The line that mentions node:internal, since Node reports the crash', 'The line with Object.<anonymous>, since that is the program itself', 'The first "at" line under the message, which is the top frame'],
        answer: 3,
        explanation: 'The top frame is the most recent call, where the error happened. Lines further down are the callers, ending with the main program and Node\'s own startup code.',
      },
      {
        id: 'programming-fundamentals-44-q2',
        prompt: 'A trace lists, from the top, `at priceOf`, `at addUp` and `at Object.<anonymous>`. What does that tell you?',
        choices: ['The main program called addUp, and addUp called priceOf, where the error happened', 'priceOf called addUp, which called the main program', 'All three functions ran at the same time and priceOf finished first, because the trace lists them by finishing order', 'Only priceOf is in your code and the others are Node\'s own'],
        answer: 0,
        explanation: 'Each frame was called by the one below it. The main program called addUp, which called priceOf, and the error happened inside priceOf.',
      },
      {
        id: 'programming-fundamentals-44-q3',
        prompt: 'The top frame points at a function that looks correct. What is the most useful next step?',
        choices: ['Rewrite that function in a new way', 'Delete the line that crashed, so the program can carry on without that step and the error goes away', 'Look at the callers in the trace and at the values they passed in', 'Run the program again and hope it passes'],
        answer: 2,
        explanation: 'A correct function can still be given a bad value. The callers and their data are where the real cause usually sits.',
      },
      {
        id: 'programming-fundamentals-44-q4',
        prompt: 'You are paused on a line that calls `describeItem(item)`, and you trust that function. Which control runs it and stops on the next line in the same function?',
        choices: ['Step into', 'Step over', 'Step out', 'Resume'],
        answer: 1,
        explanation: 'Step over treats the call as one move. Step into would take you inside describeItem, step out would leave the current function, and resume would run on to the next breakpoint.',
      },
      {
        id: 'programming-fundamentals-44-q5',
        audience: { max: 'beginner' },
        prompt: 'In the sari-sari store picture, who is listed first in the report?',
        choices: ['The runner who found the empty shelf', 'The customer who asked for the vinegar', 'Ate Lyn, who is in charge of the store'],
        answer: 0,
        explanation: 'A stack trace starts with the place where the problem happened and then lists, in order, who was waiting on whom.',
      },
      {
        id: 'programming-fundamentals-44-q6',
        audience: { min: 'advanced' },
        prompt: 'A bug happens only on about the 200th turn of a loop that runs thousands of times. Which approach finds it with the least effort?',
        choices: ['Step over every line from the start until turn 200', 'Add a console.log in the loop and scroll through thousands of lines to find turn 200, then read around it', 'Remove the loop and test each turn by hand in a separate file', 'Set a conditional breakpoint, or a logpoint, that fires only when the condition is true'],
        answer: 3,
        explanation: 'Conditional breakpoints and logpoints stop or print only when you need them, without editing the code or stepping hundreds of times.',
      },
    ],
    task: {
      title: 'Read a real trace and step through it',
      minutes: 20,
      steps: [
        'Copy `tracker.js` from this lesson into a free JavaScript environment and run it so you see the real error. Copy the complete output into a notes file.',
        'Under the output, write the table of frames in your own words: which function stopped, who called it, and which lines you can ignore.',
        'Fix the problem where it begins: add a `category` to the second expense and run again.',
        'Now put the original problem back. Use whichever debugger you have (your browser\'s developer tools, your code editor\'s debug panel, or `node inspect tracker.js`), set a breakpoint on the `console.log` line in the loop, and step into the call until you see `category` is missing.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw the pile of sticky notes for the moment of the crash: one note per function, the top note first, and write what each one is waiting for.'] },
      { audience: { min: 'advanced' }, steps: ['Set a conditional breakpoint that pauses only when `item.category` is undefined, and note the call stack at that moment. Compare it with the stack trace.'] },
    ],
  },
  {
    id: 'programming-fundamentals-45',
    day: 45,
    title: 'Writing Basic Tests',
    summary: 'Write a tiny check function and small tests with expected and actual values, so you can prove a function does what you say it does.',
    minutes: 25,
    skills: ['debug-test'],
    intro: {
      objectives: [
        'Explain what a test is, and the difference between the expected and the actual value',
        'Write a small check function in plain JavaScript and use it to test a function',
        'Write good tests: one behaviour each, a clear name, and an expected value worked out by hand',
      ],
      why: 'Tests are how you judge code you did not write. When an AI assistant hands you a function, a few tests you wrote yourself tell you whether it does what you asked, and they keep telling you every time the code changes.',
    },
    body: [
      { type: 'paragraph', text: 'You have learned to read code, to find errors, and to debug. There is one more skill that makes all of them easier: proving, in a way you can repeat, that a function does what you say it does. Running the program once and looking at the answer is not enough, because you will forget what you looked at, and you will not look at the same cases next time. A test writes your expectation down and checks it for you, every time.' },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: 'Think of a teacher with an answer key. Before the quiz, the teacher already knows the right answer to each question. When a student hands in a paper, the teacher compares what the student wrote with the key, one question at a time, and marks each as right or wrong. The teacher does not need to solve the problems again for each student: the key does the judging.' },
      { type: 'paragraph', text: 'A test works the same way. The **expected** value is the answer in the key, and the **actual** value is what your function really gave. Where the picture stops working: if the key itself is wrong, the teacher will mark correct answers as wrong. A test is only as good as the expected value you wrote in it, so you must work that out carefully, by hand, and not by copying what your code printed.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'A test has four parts: a **name** that says what behaviour is being checked, an **input** to give the function, the **expected** result, and a comparison with the **actual** result. That comparison is often called an **assertion**: you assert that two things are the same, and the test passes or fails. You do not need any special software to start. A small function of your own can do all of it.' },
      { type: 'diagram', format: 'mermaid', caption: 'The life of one test. The expected value is decided before the code runs.', source: 'flowchart TD\n  A[Choose an input and work out the expected answer by hand] --> B[Call the function with that input]\n  B --> C[The result is the actual value]\n  C --> D{actual equals expected?}\n  D -->|yes| E[Print PASS and the test name]\n  D -->|no| F[Print FAIL with the expected and the actual value]' },
      {
        type: 'list',
        items: [
          '**One test, one behaviour.** "Total of no expenses" and "total of one expense" are two tests, so when one fails you know which behaviour broke.',
          '**Name the behaviour.** `total of no expenses` tells you what failed. `test 3` does not.',
          '**Work out the expected value by hand**, from the rule in your head, before you run the code. If you copy the answer the code printed, the test can only ever agree with the code, including its bugs.',
          '**Use small inputs** whose answer you can check at a glance.',
          '**Write the failing test first** when you are chasing a bug, and keep it afterwards. It proves the bug is fixed and warns you if it ever comes back.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a test is a question where you already know the answer. You ask the function, you compare what it says with the answer you wrote down, and the computer shouts PASS or FAIL. The point is not to catch the computer out. The point is to have a quick, repeatable way to ask "does it still work?" after every change, without doing the sums yourself each time. If a test fails, either the function or your written answer is wrong, and working the sum out by hand tells you which.',
      },
      { type: 'warning', text: 'The `===` comparison works well for numbers, text and true or false. It does not compare the contents of lists or objects: `[1, 2] === [1, 2]` is `false`, because they are two separate lists. In these basic tests, check a number or a piece of text from the result, such as its length or one property, instead of comparing a whole list.' },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'First the tiny tool. `check` takes a name, the actual value and the expected value, and reports.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'A tiny check function',
        code: `function check(name, actual, expected) {
  if (actual === expected) {
    console.log(\`PASS \${name}\`);
  } else {
    console.log(\`FAIL \${name}: expected \${expected}, got \${actual}\`);
  }
}`,
      },
      { type: 'paragraph', text: 'Now use it to test `totalOf`, the function that adds up the amounts of a list of expenses. Notice that each expected value comes from simple arithmetic, not from running the code.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Three tests for totalOf (put them under the check function)',
        code: `function totalOf(list) {
  let total = 0;
  for (const item of list) {
    total = total + item.amount;
  }
  return total;
}

const lunch = [{ amount: 85 }, { amount: 60 }];

check('total of two expenses', totalOf(lunch), 145);
check('total of no expenses', totalOf([]), 0);
check('total of one expense', totalOf([{ amount: 24 }]), 24);`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22)', code: 'PASS total of two expenses\nPASS total of no expenses\nPASS total of one expense' },
      { type: 'paragraph', text: 'Now suppose someone edits the function and changes `total = total + item.amount;` into `total = item.amount;`. The tests catch it at once.' },
      { type: 'code', language: 'text', label: 'Output after that mistake (Node.js 22)', code: 'FAIL total of two expenses: expected 145, got 60\nPASS total of no expenses\nPASS total of one expense' },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**check** receives the name, the actual value and the expected value. It compares them with `===` and prints PASS with the name, or FAIL with both values so you can see the difference.',
          '**lunch** is a small list built for the test. Its total is 85 + 60 = 145, which we worked out by hand.',
          '**The first test** calls `totalOf(lunch)`; that is the actual value. The expected value 145 is written next to it.',
          '**The second and third tests** check the behaviours "no expenses" and "one expense". They would pass even for the mistaken version, and that is fine: each test guards one behaviour.',
          '**After the mistake**, only the first test fails, and it says exactly what was expected and what came back (60, the last amount only). That points straight at the line that adds.',
        ],
      },
      { type: 'tip', text: 'Money is a good thing to test. Try `check(\'floats\', 0.1 + 0.2, 0.3)` and you get `FAIL floats: expected 0.3, got 0.30000000000000004`. That is the floating-point trap from the numbers lesson, and it is one reason the tracker keeps money as whole amounts.' },
      {
        type: 'version',
        text: 'The `check` function is a learning tool. In real projects people use a test runner. Node.js has a built-in one, the node:test module, which the Node.js 22 documentation marks as stable (stable since Node.js 20); tests are run with the command node --test. Other popular runners, such as Jest and Vitest, work on the same idea of a name, an input, an expected value and an assertion.',
        checked: CHECKED,
        sources: [DOCS.nodeTest],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Real suites add structure on top of the same idea: arrange the inputs, act by calling the code, assert on the result. They use deep-equality assertions for objects and arrays, keep tests deterministic (no real clock, randomness or network), and run in CI on every change. Tests also work as an executable specification, which is why they matter more with AI: giving an assistant a failing test and asking for the smallest change that makes it pass is a tight, reviewable loop. The risk to design against is a test that shares the implementation\'s misunderstanding. Tests an AI writes alongside its own code can encode the same wrong assumption, so derive expected values from the requirement, and review them first.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'Ask an assistant for test ideas, then judge them yourself. It is good at listing cases you forgot, and it is not allowed to be the judge of what is correct. Use any assistant you have, and do not paste private data.' },
      {
        type: 'prompt',
        label: 'Ask for test cases, then check the expected values',
        text: 'Here is a JavaScript function and a one-sentence description of what it should do: [paste function and description]. Do not change the function. Suggest eight test cases as a list of: a short test name, the input, and the expected result. Explain in one line how each expected result follows from the description, not from running the code. Tell me which two cases you are least sure about.',
      },
      { type: 'paragraph', text: 'What to look for: work out each expected value yourself before you read the explanation, and mark any that disagree. An assistant can produce an expected value that looks reasonable but is wrong, especially in sums and edge cases. The two cases it says it is least sure about are the best ones to check by hand.' },
      {
        type: 'takeaways',
        items: [
          'A test gives a function an input and compares the actual result with an expected result that you decided in advance.',
          'A small check(name, actual, expected) function that prints PASS or FAIL is enough to start testing.',
          'Write one test per behaviour, give it a name that says the behaviour, and work out the expected value by hand, never from the code under test.',
          'Keep your tests: they show that a bug is fixed and warn you when a later change breaks something.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-45-predict-output-1',
          kind: 'predict-output',
          title: 'Predict the test report',
          prompt: 'This version of `totalOf` has a mistake in its loop. Predict the three lines the tests print.',
          concept: 'reading test results',
          language: 'javascript',
          code: `function check(name, actual, expected) {
  if (actual === expected) {
    console.log(\`PASS \${name}\`);
  } else {
    console.log(\`FAIL \${name}: expected \${expected}, got \${actual}\`);
  }
}

function totalOf(list) {
  let total = 0;
  for (let i = 0; i < list.length - 1; i++) {
    total = total + list[i].amount;
  }
  return total;
}

check('total of two', totalOf([{ amount: 85 }, { amount: 60 }]), 145);
check('total of none', totalOf([]), 0);
check('total of one', totalOf([{ amount: 24 }]), 24);`,
          choices: [
            'FAIL total of two: expected 145, got 85\nPASS total of none\nFAIL total of one: expected 24, got 0',
            'PASS total of two\nPASS total of none\nPASS total of one',
            'FAIL total of two: expected 145, got 60\nPASS total of none\nPASS total of one',
            'FAIL total of two: expected 145, got 85\nFAIL total of none: expected 0, got 0\nFAIL total of one: expected 24, got 0',
          ],
          wrongNotes: {
            'PASS total of two\nPASS total of none\nPASS total of one': 'The loop stops one item early (`list.length - 1`), so it leaves out the last item.',
            'FAIL total of two: expected 145, got 60\nPASS total of none\nPASS total of one': 'The loop keeps the first items and drops the last one, so the two-item list gives only the first amount, 85.',
            'FAIL total of two: expected 145, got 85\nFAIL total of none: expected 0, got 0\nFAIL total of one: expected 24, got 0': 'The empty list gives 0 and the expected value is also 0, so that test passes.',
          },
          hints: ['The loop condition is `i < list.length - 1`. How many items does it visit for a list of two?', 'It visits only the first item. For a list of one it visits none.', 'Two items give 85, an empty list gives 0, and one item gives 0, so the first and third tests fail and the second passes.'],
          explanation: 'The loop skips the last item. The two-item list adds only 85 (fail), the empty list gives 0 as expected (pass), and the one-item list adds nothing, so it gives 0 instead of 24 (fail).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-45-fix-bug-1',
          kind: 'fix-bug',
          title: 'The test is the bug',
          prompt: 'One test reports FAIL, but `totalOf` is correct. The expected value in a test is wrong. Tap the line that has the mistake and choose its correction. Work the sum out by hand first.',
          concept: 'the expected value',
          language: 'javascript',
          code: `function check(name, actual, expected) {
  if (actual === expected) {
    console.log(\`PASS \${name}\`);
  } else {
    console.log(\`FAIL \${name}: expected \${expected}, got \${actual}\`);
  }
}

function totalOf(list) {
  let total = 0;
  for (const item of list) {
    total = total + item.amount;
  }
  return total;
}

check('rice and coffee', totalOf([{ amount: 85 }, { amount: 60 }]), 135);
check('no expenses', totalOf([]), 0);`,
          bugLine: 17,
          fixes: [
            { line: "check('rice and coffee', totalOf([{ amount: 85 }, { amount: 60 }]), 145);", correct: true, why: '85 + 60 is 145. The function was right and the key was wrong.' },
            { line: "check('rice and coffee', totalOf([{ amount: 85 }, { amount: 60 }]), 85);", correct: false, why: '85 is only the first amount. The total of both is more than that.' },
            { line: "check('rice and coffee', totalOf([{ amount: 85 }, { amount: 60 }]), 125);", correct: false, why: 'Add 85 and 60 again, carefully. The sum is not 125.' },
            { line: "check('rice and coffee', totalOf([{ amount: 85 }]), 135);", correct: false, why: 'This changes the input instead of the wrong expected value, and one amount of 85 does not total 135.' },
          ],
          tests: { kind: 'output', expected: ['PASS rice and coffee', 'PASS no expenses'] },
          lineNote: 'The function is correct. Look for the check call whose expected number does not match the input.',
          hints: ['The function is right, so the problem is in the expected value.', 'Add 85 and 60 yourself, without running anything.', 'The sum is 145, not 135.'],
          explanation: 'The test said 135, but 85 + 60 is 145. When a test fails, either the code or the expected value can be wrong, and working the answer out by hand is how you tell which.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-45-code-challenge-1',
          kind: 'code-challenge',
          title: 'Make the tests pass',
          prompt: 'The four tests below describe `countByCategory(list, category)`, which counts how many expenses have a category. Write the function so every test prints PASS. Do not change the tests.',
          concept: 'writing code to pass tests',
          language: 'javascript',
          starter: `function check(name, actual, expected) {
  if (actual === expected) {
    console.log(\`PASS \${name}\`);
  } else {
    console.log(\`FAIL \${name}: expected \${expected}, got \${actual}\`);
  }
}

function countByCategory(list, category) {
  // Count how many expenses have this category.
  return 0;
}

const expenses = [
  { description: 'Jeepney fare', amount: 24, category: 'transport' },
  { description: 'Rice meal', amount: 85, category: 'food' },
  { description: 'Coffee', amount: 60, category: 'food' },
];

check('two food expenses', countByCategory(expenses, 'food'), 2);
check('one transport expense', countByCategory(expenses, 'transport'), 1);
check('no load expenses', countByCategory(expenses, 'load'), 0);
check('empty list', countByCategory([], 'food'), 0);`,
          solution: `function check(name, actual, expected) {
  if (actual === expected) {
    console.log(\`PASS \${name}\`);
  } else {
    console.log(\`FAIL \${name}: expected \${expected}, got \${actual}\`);
  }
}

function countByCategory(list, category) {
  let count = 0;
  for (const item of list) {
    if (item.category === category) {
      count = count + 1;
    }
  }
  return count;
}

const expenses = [
  { description: 'Jeepney fare', amount: 24, category: 'transport' },
  { description: 'Rice meal', amount: 85, category: 'food' },
  { description: 'Coffee', amount: 60, category: 'food' },
];

check('two food expenses', countByCategory(expenses, 'food'), 2);
check('one transport expense', countByCategory(expenses, 'transport'), 1);
check('no load expenses', countByCategory(expenses, 'load'), 0);
check('empty list', countByCategory([], 'food'), 0);`,
          tests: { kind: 'output', expected: ['PASS two food expenses', 'PASS one transport expense', 'PASS no load expenses', 'PASS empty list'] },
          hints: ['Start a counter at 0 and add 1 each time an expense matches the category.', 'Loop over the list with `for (const item of list)` and compare `item.category === category`.', 'Add `let count = 0;` before the loop, `count = count + 1;` inside the `if`, and `return count;` after the loop.'],
          explanation: 'The counter starts at 0, goes up by 1 for each expense whose category matches, and is returned after the loop. An empty list never enters the loop, so it returns 0.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-45-q1',
        prompt: 'In `check(\'total of no expenses\', totalOf([]), 0)`, which is the expected value and which is the actual value?',
        choices: ['Expected is totalOf([]) and actual is 0', 'Both are the same value, written twice', 'Expected is 0 and actual is whatever totalOf([]) returns', 'Expected is the test name and actual is 0, because the name is written first in the call'],
        answer: 2,
        explanation: 'The expected value is what you decided in advance (0). The actual value is what the function really returns when it runs.',
      },
      {
        id: 'programming-fundamentals-45-q2',
        prompt: 'How should you decide the expected value of a test?',
        choices: ['Work it out by hand from the rule, before you run the code', 'Run the function once and copy what it printed', 'Ask the function itself what it expects', 'Use any number, since the test only needs to run and the real answer can be filled in later'],
        answer: 0,
        explanation: 'If you copy the code\'s own output, the test can only agree with the code, bugs included. The expected value has to come from the rule.',
      },
      {
        id: 'programming-fundamentals-45-q3',
        prompt: 'Which test name will help you most when it appears in a FAIL line?',
        choices: ['test number three for the totals', 'the totalOf function works', 'total of no expenses is 0', 'a general check of everything'],
        answer: 2,
        explanation: 'A name that states the behaviour tells you what broke without opening the code. Vague names make you hunt.',
      },
      {
        id: 'programming-fundamentals-45-q4',
        prompt: 'A new test reports FAIL. What does that tell you for certain?',
        choices: ['Only that the function has a bug, because the test was written down first so it cannot be wrong', 'Only that the test needs to be deleted', 'That the computer is broken, because a good function never fails', 'Either the code or the expected value is wrong, so work the answer out by hand'],
        answer: 3,
        explanation: 'A failing test is a disagreement. The code could be wrong, or the answer you wrote could be. Checking by hand settles it.',
      },
      {
        id: 'programming-fundamentals-45-q5',
        audience: { max: 'beginner' },
        prompt: 'In the teacher\'s answer-key picture, what is the "expected" value?',
        choices: ['The answer the student wrote on the paper, which the teacher then compares with the key', 'The right answer written in the key before the quiz', 'The number of questions on the quiz'],
        answer: 1,
        explanation: 'The key is the expected answer. The student\'s paper is the actual answer, and the teacher compares the two.',
      },
      {
        id: 'programming-fundamentals-45-q6',
        audience: { min: 'advanced' },
        prompt: 'An AI assistant generates a function and its tests, and every test passes. What is the main thing you should still check?',
        choices: ['Nothing, because passing tests prove that the function is correct for every possible input', 'That the expected values come from the requirement and not from the code', 'That the number of tests is at least ten', 'That the tests run faster than the function'],
        answer: 1,
        explanation: 'Passing tests only show agreement between the code and the tests. If both came from the same misunderstanding, they agree and are both wrong.',
      },
    ],
    task: {
      title: 'Test your own function',
      minutes: 20,
      steps: [
        'Copy the `check` function and `totalFor` (the fixed version from the debugging lesson) into any free JavaScript environment, together with the four-item expense list.',
        'Write four tests with expected values worked out by hand: `Food` gives 145, `food` gives 145, a category with no expenses gives 0, and an empty list gives 0. Give each a name that says the behaviour.',
        'Run them and confirm four PASS lines.',
        'Break the function on purpose (for example remove the `toLowerCase()`), run again, and read the FAIL lines. Then restore it and keep the tests in a file called `tests.js`.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Add one test whose expected value you deliberately get wrong, run it, and write a sentence about how you could tell that the test and not the function was at fault.'] },
      { audience: { min: 'advanced' }, steps: ['Rewrite the same tests with the node:test module and the node:assert module, run them with `node --test`, and compare the report with your own check output.'] },
    ],
  },
  {
    id: 'programming-fundamentals-46',
    day: 46,
    title: 'Edge Cases and Validation',
    summary: 'Think about the unusual inputs a function will meet (empty, zero, negative, huge, wrong type, duplicate) and check input before you trust it.',
    minutes: 30,
    skills: ['debug-test', 'data-and-operators'],
    intro: {
      objectives: [
        'Name six common edge cases and say what each can break',
        'Write a validation function that returns a list of problems',
        'Guard a function against an empty list and test it with check',
      ],
      why: 'Code written for the happy path works in the demo and breaks in real life. AI-generated code is especially likely to cover only the happy path, so asking "what about empty, zero, negative and wrong type?" is one of the most valuable questions you can ask of any code.',
    },
    body: [
      { type: 'paragraph', text: 'A function that works for the example you tried is not finished. The input it will meet in real life is messier: an empty list, a zero, a negative amount, a word where a number should be, the same entry saved twice. These are called edge cases, and most real bugs live there. This lesson gives you a checklist of them and the habit of validating input before you trust it.' },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: 'Imagine the cashier at a small store. On an ordinary afternoon, someone buys three items and pays with a 100-peso bill. But sometimes a customer buys nothing and asks only for change. Someone pays for a 5-peso candy with a 1,000-peso bill. Someone returns an item, which is a negative sale. Someone writes "two" instead of 2 on a form. Someone taps the pay button twice and the same sale is recorded twice. A good store has a rule for each of these, so that the till stays right.' },
      { type: 'paragraph', text: 'A program needs the same rules, written down in code. Where the picture stops working: a cashier uses judgement on the spot. A function has none. It does exactly what its lines say, so every unusual case needs a line, or it does something you never decided.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'An **edge case** is an input at the border of what a function accepts, or an unusual one that is still legitimate. There is a short checklist you can run over any function, and over any code an AI gives you.' },
      {
        type: 'table',
        caption: 'Six edge cases to ask about every function',
        headers: ['Edge case', 'Example in the tracker', 'What can go wrong'],
        rows: [
          ['Empty', 'A list with no expenses, or an empty description', 'Reading the first item of an empty list gives undefined and crashes. An average of nothing is 0 divided by 0, which is NaN.'],
          ['Zero', 'An amount of 0', 'A free item may be valid or may be a mistake. A divide by zero gives Infinity or NaN.'],
          ['Negative', 'An amount of -50', 'The total goes down. It might be a refund, or a typo.'],
          ['Very large', 'An amount of 99999999999', 'Probably a typing slip, and it ruins every total and chart.'],
          ['Wrong type', 'The text "85" or "abc" instead of the number 85', 'Adding "85" to a number joins text instead of adding. "abc" becomes NaN.'],
          ['Duplicate', 'The same fare saved twice', 'Totals are doubled and nobody notices.'],
        ],
      },
      { type: 'paragraph', text: '**Validation** means checking input before the rest of the program uses it. For each edge case you decide one of three things: **reject** it with a clear message, **fix** it (for example trim extra spaces), or **accept** it on purpose (a refund may be allowed). The important word is decide: an unhandled edge case is a decision you made by accident.' },
      { type: 'paragraph', text: 'Validate where data comes in, at the door: a form, a file, a network reply, or text an AI produced. Inside the program, you can then trust what you already checked. A good validation function reports all the problems at once, as a list, instead of stopping at the first one.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: do not assume the input will look like your example. Before using a value, ask "could this be empty? zero? negative? huge? text? a copy of one I already have?" Then decide what the program should do in each case, and write a line for it. A small function that checks a record and hands back a list of what is wrong (an empty list means all is well) is the simplest way to do this, and it never crashes on bad input, because crashing is what you are trying to avoid.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Here is a function that finds the biggest expense. It works for the example, and it has never been tried with an empty list.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'edge.js: biggestOf with no guard',
        code: `function biggestOf(list) {
  let biggest = list[0];
  for (const item of list) {
    if (item.amount > biggest.amount) {
      biggest = item;
    }
  }
  return biggest;
}

console.log(biggestOf([{ description: 'Rice meal', amount: 85 }, { description: 'Coffee', amount: 60 }]).description);
console.log(biggestOf([]).description);`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22; folder part of the path replaced, trace trimmed)', code: 'Rice meal\n/home/you/tracker/edge.js:12\nconsole.log(biggestOf([]).description);\n                         ^\n\nTypeError: Cannot read properties of undefined (reading \'description\')\n    at Object.<anonymous> (/home/you/tracker/edge.js:12:26)\n    ...' },
      { type: 'paragraph', text: 'There is no biggest expense in an empty list, so the honest answer is "nothing". A guard at the top returns `null`, the value that means "no value here on purpose", and the caller can check for it.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'biggestOf with a guard for the empty list',
        code: `function biggestOf(list) {
  if (list.length === 0) {
    return null;
  }
  let biggest = list[0];
  for (const item of list) {
    if (item.amount > biggest.amount) {
      biggest = item;
    }
  }
  return biggest;
}

console.log(biggestOf([{ description: 'Rice meal', amount: 85 }, { description: 'Coffee', amount: 60 }]));
console.log(biggestOf([]));`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22)', code: "{ description: 'Rice meal', amount: 85 }\nnull" },
      { type: 'paragraph', text: 'Now validation. Two things are new here. `typeof amount` gives the kind of a value as text, such as `\'number\'` or `\'string\'`. And `Number.isNaN(x)` is `true` only when `x` is `NaN` ("not a number", what you get from `Number(\'abc\')`). We need it because `NaN === NaN` is `false`, so `===` cannot test for it.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'validateExpense returns a list of problems',
        code: `function validateExpense(expense) {
  const problems = [];
  if (typeof expense.description !== 'string' || expense.description.trim() === '') {
    problems.push('Description is required.');
  }
  if (typeof expense.amount !== 'number' || Number.isNaN(expense.amount)) {
    problems.push('Amount must be a number.');
  } else if (expense.amount <= 0) {
    problems.push('Amount must be more than zero.');
  }
  return problems;
}

console.log(validateExpense({ description: 'Jeepney fare', amount: 24 }));
console.log(validateExpense({ description: '  ', amount: -50 }));
console.log(validateExpense({ description: 'Rice meal', amount: '85' }));
console.log(validateExpense({ description: 'Coffee', amount: 0 }));
console.log(validateExpense({ description: 'Coffee', amount: Number('abc') }));`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22)', code: "[]\n[ 'Description is required.', 'Amount must be more than zero.' ]\n[ 'Amount must be a number.' ]\n[ 'Amount must be more than zero.' ]\n[ 'Amount must be a number.' ]" },
      { type: 'paragraph', text: 'A duplicate check needs the list that is already saved, so it is a separate small function. Here two expenses count as the same when the description, the amount and the date all match.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'isDuplicate',
        code: `function isDuplicate(list, expense) {
  for (const item of list) {
    if (item.description === expense.description && item.amount === expense.amount && item.date === expense.date) {
      return true;
    }
  }
  return false;
}

const saved = [{ description: 'Rice meal', amount: 85, date: '2026-11-16' }];
console.log(isDuplicate(saved, { description: 'Rice meal', amount: 85, date: '2026-11-16' }));
console.log(isDuplicate(saved, { description: 'Rice meal', amount: 85, date: '2026-11-17' }));`,
      },
      { type: 'code', language: 'text', label: 'Output (Node.js 22)', code: 'true\nfalse' },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**The crash:** with an empty list, `list[0]` is `undefined`, so `biggest` is `undefined`. The final `.description` is asked of `undefined`, and the program stops. The loop never even ran.',
          '**The guard:** `list.length === 0` is true only for an empty list, and `return null` leaves the function right there, before the risky line. A caller that gets `null` knows there was nothing to find.',
          '**validateExpense:** it starts with an empty `problems` list and adds a message for each rule that fails. Checking `typeof` first matters: `\'85\'` is text, so it is rejected before any arithmetic. `else if` makes sure a text amount does not also get a "more than zero" message.',
          '**Reading the five results:** a good expense gives an empty list. Blank spaces and -50 gives two problems, text gives one, 0 gives one (zero is not more than zero), and `Number(\'abc\')` is `NaN`, which `Number.isNaN` catches.',
          '**isDuplicate:** it returns `true` as soon as it finds a saved expense with the same three fields, and `false` after the loop if none matched. The same meal on another date is a different expense.',
        ],
      },
      { type: 'warning', text: 'Validation in the app you can see (a form on a phone) is only a convenience. Anything that arrives from outside, from a person, a file or another service, can be wrong or hostile, so it must be checked again where the data is really used. Never trust input just because your own screen checked it.' },
      {
        type: 'version',
        text: 'Number.isNaN() returns true only for the value NaN and does not convert its argument first, unlike the older global isNaN() function, which converts the value to a number before testing it. Checked against MDN.',
        checked: CHECKED,
        sources: [DOCS.mdnIsNaN],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Validate at trust boundaries and treat what comes out as typed, trusted data. Distinguish validation (is this input acceptable?) from invariants (what the rest of the code may assume), and return structured errors that callers can act on. For anything user-facing, client-side checks are a convenience and the authoritative checks run on the server. Think about boundaries numerically too: off-by-one at limits, floating-point comparison, integer overflow in other languages, and Unicode and whitespace in strings. Property-based tests and fuzzing find the inputs you did not think of. Silent coercion is the enemy: reject ambiguous input rather than guessing what it meant.',
      },
      { type: 'heading', text: 'Project 9: the broken program' },
      { type: 'paragraph', text: 'Module 9 ends with a project that uses everything you have learned: reading, classifying errors, tracing, debugging with logs and stack traces, writing checks and thinking about edge cases. Below is a 28-line program for the expense tracker. It has exactly three mistakes, one syntax error, one runtime error and one logic error. When it is fixed, it must print exactly these three lines:' },
      { type: 'code', language: 'text', label: 'What the fixed program must print', code: 'Total: 269\nBiggest: Load top-up\nCount: 4' },
      { type: 'code', language: 'text', label: 'The broken program (copy it into a free JavaScript environment; the three mistakes are on purpose)', code: "const expenses = [\n  { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' },\n  { description: 'Rice meal', amount: 85, category: 'food', date: '2026-11-16' },\n  { description: 'Load top-up', amount: 100, category: 'load', date: '2026-11-17' },\n  { description: 'Coffee', amount: 60, category: 'food', date: '2026-11-17' },\n];\n\nfunction totalOf(list) {\n  let total = 0;\n  for (let i = 0; i <= list.length; i++) {\n    total = total + list[i].amount;\n  }\n  return total;\n}\n\nfunction biggestOf(list) {\n  let biggest = list[0];\n  for (const item of list) {\n    if (item.amount < biggest.amount) {\n      biggest = item;\n    }\n  }\n  return biggest;\n}\n\nconsole.log('Total: ' + totalOf(expenses);\nconsole.log(`Biggest: ${biggestOf(expenses).description}`);\nconsole.log(`Count: ${expenses.length}`);" },
      { type: 'paragraph', text: 'Do not hunt for them by eye. Use the methods of this module: run it, read what you see, decide which kind of error it is, fix one thing at a time, and check against the three lines above. The project page tells you what to hand in.' },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'Ask an assistant for the edge cases you might have missed. Use any assistant you have, and keep private data out of what you paste.' },
      {
        type: 'prompt',
        label: 'Ask which edge cases a function can not handle',
        text: 'Here is a JavaScript function: [paste function]. Do not rewrite it. For each of these six cases (empty input, zero, negative number, very large number, wrong type, duplicate), give me one concrete input, tell me what you expect the function to do with it today, and tell me whether you are sure. Then ask me which cases I want to handle and which I want to reject.',
      },
      { type: 'paragraph', text: 'What to look for: pick two of its predictions and run them yourself. An assistant can say that a function "handles" an empty list when it actually crashes, or the other way round, because it reasons about the code instead of running it. Your own run settles it, and your answer to its last question is a design decision that belongs to you.' },
      {
        type: 'takeaways',
        items: [
          'Edge cases are unusual inputs at the border of what a function accepts: empty, zero, negative, very large, wrong type and duplicate.',
          'An unhandled edge case is a decision made by accident. Decide to reject it, fix it or accept it, and write the line that does so.',
          'Validate input where it enters the program, and return a list of problems instead of crashing.',
          'Test edge cases with check, and ask any AI-written code the same six questions.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-46-match-1',
          kind: 'match',
          title: 'Name the edge case',
          prompt: 'Each situation in the tracker is one of the six edge cases. Match the situation to its kind.',
          concept: 'edge cases',
          labels: { terms: 'The situation', meanings: 'Kind of edge case' },
          pairs: [
            { term: 'Someone taps Save twice and the Rice meal of 85 pesos appears two times', definition: 'Duplicate', note: 'The same record has been entered more than once.' },
            { term: 'A person types abc into the amount box', definition: 'Wrong type', note: 'The value is not the kind of thing the function expects, a number.' },
            { term: 'A monthly report is requested for a month with no spending at all', definition: 'Empty', note: 'There are no items, so there is nothing to take a first or biggest item from.' },
            { term: 'Someone enters an amount of -250', definition: 'Negative', note: 'The number is on the wrong side of zero.' },
          ],
          hints: ['Look at what is unusual about each situation: how many, what kind, which side of zero.', 'The report with no spending is about having nothing at all.', 'abc is not a number, and Save pressed twice repeats a record.'],
          explanation: 'A repeated record is a duplicate, text where a number belongs is the wrong type, no items at all is empty, and a value below zero is negative.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-46-predict-output-1',
          kind: 'predict-output',
          title: 'What does the validator say?',
          prompt: 'Predict the two lines this program prints.',
          concept: 'validation',
          language: 'javascript',
          code: `function validateExpense(expense) {
  const problems = [];
  if (typeof expense.description !== 'string' || expense.description.trim() === '') {
    problems.push('Description is required.');
  }
  if (typeof expense.amount !== 'number' || Number.isNaN(expense.amount)) {
    problems.push('Amount must be a number.');
  } else if (expense.amount <= 0) {
    problems.push('Amount must be more than zero.');
  }
  return problems;
}

console.log(validateExpense({ description: 'Coffee', amount: 60 }));
console.log(validateExpense({ description: '', amount: '60' }));`,
          choices: [
            "[]\n[ 'Description is required.', 'Amount must be a number.' ]",
            "[]\n[ 'Description is required.' ]",
            "[ 'Amount must be more than zero.' ]\n[ 'Description is required.', 'Amount must be a number.' ]",
            "[]\n[ 'Description is required.', 'Amount must be a number.', 'Amount must be more than zero.' ]",
          ],
          wrongNotes: {
            "[]\n[ 'Description is required.' ]": 'The amount "60" is text, not a number, so the type rule fires too.',
            "[ 'Amount must be more than zero.' ]\n[ 'Description is required.', 'Amount must be a number.' ]": '60 is greater than zero, so a valid expense gives an empty list.',
            "[]\n[ 'Description is required.', 'Amount must be a number.', 'Amount must be more than zero.' ]": 'The "more than zero" rule is in an else branch, so it does not run when the type rule already fired.',
          },
          hints: ['Take the first call: description is text that is not blank, amount is a number above zero.', 'In the second call the description is empty, and the amount is the text "60".', 'An empty description fires the first rule, and a text amount fires "must be a number". The else branch is skipped.'],
          explanation: 'The first expense is valid, so its list is empty. The second has an empty description and a text amount, so two problems are added, and the `else if` stops a third one.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-46-fix-bug-1',
          kind: 'fix-bug',
          title: 'Zero slips through',
          prompt: 'The rule says an amount must be more than zero, but an amount of 0 is accepted. Tap the line with the mistake and choose the fix.',
          concept: 'boundary values',
          language: 'javascript',
          code: `function validateExpense(expense) {
  const problems = [];
  if (expense.amount < 0) {
    problems.push('Amount must be more than zero.');
  }
  return problems;
}`,
          bugLine: 3,
          fixes: [
            { line: 'if (expense.amount <= 0) {', correct: true, why: 'Now zero and every negative number are rejected, and any positive amount is accepted.' },
            { line: 'if (expense.amount < 1) {', correct: false, why: 'This rejects 0.5, which is a valid amount of 50 centavos.' },
            { line: 'if (expense.amount === 0) {', correct: false, why: 'This rejects 0 but now lets negative amounts through.' },
            { line: 'if (expense.amount <= 1) {', correct: false, why: 'This rejects the valid amount 1 as well as zero.' },
          ],
          tests: {
            kind: 'function',
            fn: 'validateExpense',
            cases: [
              { label: 'zero is rejected', args: [{ amount: 0 }], expected: ['Amount must be more than zero.'] },
              { label: 'negative is rejected', args: [{ amount: -5 }], expected: ['Amount must be more than zero.'] },
              { label: 'one is accepted', args: [{ amount: 1 }], expected: [] },
              { label: 'half a peso is accepted', args: [{ amount: 0.5 }], expected: [] },
              { label: 'a normal amount is accepted', args: [{ amount: 24 }], expected: [] },
            ],
          },
          lineNote: 'The comparison that decides whether an amount is rejected sits on the `if` line.',
          hints: ['Try the amount 0 against `expense.amount < 0`. Is it true?', 'The boundary itself, 0, must be rejected too, so the comparison has to include it.', 'Use `<=` so that 0 and anything below it is rejected.'],
          explanation: 'Zero is not less than zero, so `< 0` lets it through. The boundary value has to be included, which is what `<= 0` does. Boundaries like this are where off-by-one mistakes hide.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-46-code-challenge-1',
          kind: 'code-challenge',
          title: 'Guard the empty list',
          prompt: 'This function finds the biggest amount in a list of expenses, but it crashes on an empty list. Change it so an empty list returns `null`, and keep every other result the same.',
          concept: 'edge cases',
          language: 'javascript',
          starter: `function biggestAmount(list) {
  let biggest = list[0].amount;
  for (const item of list) {
    if (item.amount > biggest) {
      biggest = item.amount;
    }
  }
  return biggest;
}`,
          solution: `function biggestAmount(list) {
  if (list.length === 0) {
    return null;
  }
  let biggest = list[0].amount;
  for (const item of list) {
    if (item.amount > biggest) {
      biggest = item.amount;
    }
  }
  return biggest;
}`,
          tests: {
            kind: 'function',
            fn: 'biggestAmount',
            cases: [
              { label: 'an empty list gives null', args: [[]], expected: null },
              { label: 'the biggest of three', args: [[{ amount: 24 }, { amount: 85 }, { amount: 100 }]], expected: 100 },
              { label: 'the biggest is first', args: [[{ amount: 100 }, { amount: 24 }]], expected: 100 },
              { label: 'one amount', args: [[{ amount: 60 }]], expected: 60 },
            ],
          },
          hints: ['The crash comes from `list[0]` when the list is empty. Stop before that line.', 'Check `list.length === 0` first and return `null`.', 'Add at the top: `if (list.length === 0) { return null; }`.'],
          explanation: 'An empty list has no first item, so reading `list[0].amount` fails. A guard at the top returns `null` for "nothing here" before the risky line runs, and every other case behaves as before.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-46-q1',
        prompt: 'A function averages expenses as `total / list.length`. Which input is the edge case that breaks it?',
        choices: ['A list with one expense, since there is only one amount to add', 'A list with many expenses', 'A list whose amounts are all the same', 'An empty list, since 0 divided by 0 is NaN'],
        answer: 3,
        explanation: 'An empty list has a total of 0 and a length of 0, and 0 / 0 is NaN. The other lists all have at least one item to divide by.',
      },
      {
        id: 'programming-fundamentals-46-q2',
        prompt: 'In this lesson, what does `validateExpense` return for an expense that is fine?',
        choices: ['true', 'An empty list, meaning there are no problems', 'null', 'The expense itself, unchanged, so the caller can use it straight away'],
        answer: 1,
        explanation: 'It returns a list of problems. An empty list means nothing was wrong, and a non-empty list holds every message at once.',
      },
      {
        id: 'programming-fundamentals-46-q3',
        prompt: 'Someone types "abc" into the amount box. Where is the best place to catch it?',
        choices: ['At the door, before the value is used in any calculation', 'At the end, when the final total prints NaN and somebody notices that the number looks odd', 'Nowhere, because JavaScript converts it to 0 safely', 'Inside the loop that adds the totals, on every turn'],
        answer: 0,
        explanation: 'Validating where data enters keeps bad values out of the rest of the program, and lets you show a clear message to the person who typed it.',
      },
      {
        id: 'programming-fundamentals-46-q4',
        prompt: 'The rule is "an amount must be more than zero", and the code says `if (amount < 0)` to reject. Which value slips through by mistake?',
        choices: ['-1', '-1000', '0', '0.5'],
        answer: 2,
        explanation: 'Zero is not less than zero, so it passes the check. Boundary values are the usual place for this kind of mistake.',
      },
      {
        id: 'programming-fundamentals-46-q5',
        audience: { max: 'beginner' },
        prompt: 'What is an edge case?',
        choices: ['A mistake in the way a line of code is written, such as a missing bracket at the end of a line', 'The first line of a program', 'An unusual input at the border of what a function accepts, such as an empty list or a zero'],
        answer: 2,
        explanation: 'Edge cases are inputs that are rare or extreme but still possible. They are where programs that work in the demo fall over.',
      },
      {
        id: 'programming-fundamentals-46-q6',
        audience: { min: 'advanced' },
        prompt: 'A mobile app form already checks that an amount is a positive number before sending it to your API. What should the API do?',
        choices: ['Skip its own check, since the app already did it', 'Trust the value as long as the request carries a valid token', 'Validate the amount again, because requests can come from anything, not only your app', 'Check only that the field exists in the request, and let the database refuse any bad values later on'],
        answer: 2,
        explanation: 'Client-side checks are a convenience, and anyone can send a request without your app. The server must validate again at the real trust boundary.',
      },
    ],
    task: {
      title: 'Ask the six edge-case questions',
      minutes: 20,
      steps: [
        'Copy `biggestOf` (the unguarded version) and the `check` function from the last lesson into a free JavaScript environment.',
        'Write down one input for each of the six edge cases (empty, zero, negative, very large, wrong type, duplicate) and what you think `biggestOf` should do with it.',
        'Run each as a check or a quick call. Which ones crash, which give a wrong answer, and which are fine?',
        'Add a guard or a validation line for the worst two, and write a `check` for each so the fix stays proved.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Write the three messages of `validateExpense` in your own words, and add one new rule of your own, such as "description must not be longer than 40 characters".'] },
      { audience: { min: 'advanced' }, steps: ['Decide, and write down, which edge cases the tracker should reject, which it should fix, and which it should accept on purpose (for example refunds), and where in the program each decision lives.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'programming-fundamentals-p9',
  title: 'Fix the broken program',
  summary: 'Find and fix the syntax error, the runtime error and the logic error in the 28-line expense program at the end of lesson 46, and explain how you found each one.',
  outcome: 'A written debugging report that shows you can tell the three kinds of error apart, find each one with a method, fix it with the smallest change, and prove the fix.',
  unlockAfterDay: 46,
  steps: [
    { id: 'programming-fundamentals-p9-s1', text: 'Copy the broken program from lesson 46 into a free JavaScript environment and run it. Write down exactly what you see, and what is missing from the output compared with the three lines it should print.' },
    { id: 'programming-fundamentals-p9-s2', text: 'Find the syntax error. Write its line number, the message, and the fix, and say how you knew it was a syntax error and not another kind.' },
    { id: 'programming-fundamentals-p9-s3', text: 'Run it again. Read the stack trace of the next error: write the message, the top frame, the chain of callers, and the one-line fix. Say why the line the trace names is or is not the line that was really wrong.' },
    { id: 'programming-fundamentals-p9-s4', text: 'Run it once more and compare the output with the three expected lines. Use a trace table or labelled console.log lines to find the logic error, and write the line, the fix and the evidence that showed it.' },
    { id: 'programming-fundamentals-p9-s5', text: 'Write at least three tests with the check function from lesson 45 (expected values worked out by hand) that fail on the broken functions and pass on the fixed ones. Include one edge case.' },
    { id: 'programming-fundamentals-p9-s6', audience: { max: 'beginner' }, text: 'Work on one mistake at a time and keep a short log of each run (what you changed, what you saw). If you ask an AI assistant for help, ask it to explain the message or the kind of error, and do the fix yourself.' },
    { id: 'programming-fundamentals-p9-s7', audience: { min: 'advanced' }, text: 'Also say what happens when `totalOf` or `biggestOf` receives an empty list and what you would do about it, and name which of the three mistakes a linter, a type checker or a test would have caught before the program ran.' },
    { id: 'programming-fundamentals-p9-s8', text: 'Write your submission: for each of the three errors give the kind, the line, how you found it, the fix and why it happened, then paste the final program and its output.' },
  ],
  submission: {
    kind: 'text',
    label: 'Your debugging report',
    placeholder: 'Error 1 (syntax): line ... Message: ... How I found it: ... Fix: ... Why it happened: ...\nError 2 (runtime): ...\nError 3 (logic): ...\nMy three checks: ...\nFinal output: ...',
    hint: 'Name each error\'s kind, line, how you found it, the fix and, in your own words, why it happened. Paste your checks, the fixed program and its output. If you used an AI assistant, say what you asked and what you checked yourself.',
  },
  rubric: [
    'All three errors are found and correctly classified as syntax, runtime and logic, each with its line number',
    'Each fix is small and correct, and the fixed program prints exactly the three expected lines',
    'The report explains how each error was found (the message, the stack trace, a trace table or console.log lines), not only what the fix was',
    'The learner explains in their own words why each mistake happened, including why the stack trace line is not always the cause',
    'At least three checks with hand-worked expected values fail on the broken code and pass on the fixed code, and one covers an edge case',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['Can explain in plain words the difference between the three kinds of error, using the recipe picture or their own'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The checks cover at least two edge cases (for example an empty list and a one-item list) and the report says which are still unhandled'] },
    { audience: { min: 'advanced' }, items: ['The report names which tool (linter, type checker or test) would catch each error before running it', 'If an AI assistant was used, the report records its suggestions, which of them were wrong or unnecessary, and the evidence used to decide'] },
  ],
};

