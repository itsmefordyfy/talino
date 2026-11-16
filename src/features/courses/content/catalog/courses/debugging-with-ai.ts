import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * Debugging and Troubleshooting with AI. Every broken sample app in these lessons was created and run while this course was written
 * (Node.js 22, Python 3.13, headless Chrome); the error messages, stack traces, test output and git output shown are the real output
 * of those runs (only the folder part of file paths was shortened). Every "example AI answer" is written for this course and labelled
 * as such: it is not the output of a real model. Product statements live in dated `version` notes.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  ccBest: { label: 'Claude Code docs: Best practices', url: 'https://code.claude.com/docs/en/best-practices' },
  ccWorkflows: { label: 'Claude Code docs: Common workflows', url: 'https://code.claude.com/docs/en/common-workflows' },
  ccCheckpoint: { label: 'Claude Code docs: Checkpointing', url: 'https://code.claude.com/docs/en/checkpointing' },
  ccMemory: { label: 'Claude Code docs: How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory' },
  cursorDebug: { label: 'Cursor docs: Debug Mode', url: 'https://cursor.com/docs/agent/debug-mode' },
  copilotCheat: { label: 'GitHub Docs: GitHub Copilot Chat cheat sheet', url: 'https://docs.github.com/en/copilot/reference/chat-cheat-sheet' },
  codexPrompting: { label: 'Codex docs: Prompting (bug-fix and review workflows)', url: 'https://developers.openai.com/codex/workflows' },
  codexAgentsMd: { label: 'Codex docs: AGENTS.md', url: 'https://developers.openai.com/codex/guides/agents-md' },
  devtoolsConsole: { label: 'Chrome DevTools: Log messages in the Console', url: 'https://developer.chrome.com/docs/devtools/console/log' },
  ccChrome: { label: 'Claude Code docs: Use Claude Code with Chrome', url: 'https://code.claude.com/docs/en/chrome' },
  mdnDebugger: { label: 'MDN: the debugger statement', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger' },
  mdnConsole: { label: 'MDN: console', url: 'https://developer.mozilla.org/en-US/docs/Web/API/console' },
  mdnScript: { label: 'MDN: the script element (async and defer)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script' },
  mdnStatus: { label: 'MDN: HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status' },
  mdnCors: { label: 'MDN: Cross-Origin Resource Sharing (CORS)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS' },
  nodeGlobals: { label: 'Node.js 22 docs: Globals (fetch)', url: 'https://nodejs.org/docs/latest-v22.x/api/globals.html' },
  mdnAuth: { label: 'MDN: Authorization header', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization' },
  nodeErrors: { label: 'Node.js 22 docs: Errors (error.stack, error.cause)', url: 'https://nodejs.org/docs/latest-v22.x/api/errors.html' },
  nodeTest: { label: 'Node.js 22 docs: Test runner', url: 'https://nodejs.org/docs/latest-v22.x/api/test.html' },
  pythonErrors: { label: 'Python docs: Errors and Exceptions', url: 'https://docs.python.org/3/tutorial/errors.html' },
  gitBisect: { label: 'Git docs: git-bisect', url: 'https://git-scm.com/docs/git-bisect' },
  gitRestore: { label: 'Git docs: git-restore', url: 'https://git-scm.com/docs/git-restore' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'debugging-with-ai-01',
    day: 1,
    title: 'How debugging works: reproduce, isolate, fix and verify',
    summary: 'The four-step loop every bug fix follows, and why you decide what “right” looks like before you ask AI for help.',
    minutes: 22,
    skills: ['debug-loop', 'safe-undo'],
    intro: {
      objectives: [
        'Name the four steps of debugging: reproduce, isolate, fix and verify',
        'Write down a bug so that another person, or an AI, can make it happen again',
        'Check a fix against an answer you worked out before running anything',
      ],
      why: 'AI writes code faster than you can read it, so broken things are certain. The people who fix them quickly are not the ones who guess best; they are the ones who follow the same short loop every time.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **bug** is a gap between what you expected a program to do and what it actually did. Nothing more mysterious than that. The program is not “being weird”: it is doing exactly what its instructions say, and the instructions are not the ones you meant. **Debugging** is the work of finding that gap and closing it. Here is a real one. Ate Lorna runs a sari-sari store and has a small script that adds up a receipt. This is the script and what it printed when we ran it.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'receipt.js (a till script for a small store)',
        code: `const prices = { kape: 12, asin: 8, sabon: 25 };

function lineTotal(item) {
  return prices[item.name] * item.qty;
}

function receiptTotal(items) {
  let total = 0;
  for (const item of items) {
    total = total + lineTotal(item);
  }
  return total;
}

const order = [
  { name: 'kape', qty: 3 },
  { name: 'sabon', qty: 2 },
  { name: 'asin' },
];

console.log('Total: PHP ' + receiptTotal(order));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output of: node receipt.js',
        code: 'Total: PHP NaN',
      },
      {
        type: 'paragraph',
        text: '`NaN` means “not a number”: JavaScript’s way of saying a calculation produced something that is not a number at all. Nobody is going to pay “PHP NaN”. There is no error message, no red text, nothing to paste into an AI chat. Just a wrong answer. These quiet bugs are the hardest kind, and the loop below is what you use on them.',
      },
      { type: 'heading', text: 'The four steps' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Reproduce.** Make the bug happen on demand, the same way, every time. If you cannot make it happen, you cannot tell whether you fixed it.',
          '**Isolate.** Shrink the problem until you find the smallest piece that still goes wrong: one input, one function, one line.',
          '**Fix.** Change one thing, for a reason you can say out loud. Not “let’s try this and see”.',
          '**Verify.** Run the exact same reproduction again and compare the result with the answer you already worked out.',
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The debugging loop. If verify fails, you go around again with what you just learned.',
        source: `flowchart LR
  R[Reproduce: make it fail on demand] --> I[Isolate: shrink to the smallest failing case]
  I --> F[Fix: one change, for a reason]
  F --> V[Verify: rerun and compare with the expected answer]
  V -->|still wrong| R
  V -->|right| D(Done: keep the fix and note why)`,
      },
      { type: 'heading', text: 'The loop on Ate Lorna’s receipt' },
      {
        type: 'paragraph',
        text: '**Reproduce.** Run `node receipt.js`. It prints `Total: PHP NaN` every time. A bug that happens every single time is the easiest kind to chase. Write the reproduction down in one line: “run `node receipt.js` with this order, expect a peso total, get NaN”.',
      },
      {
        type: 'paragraph',
        text: '**Isolate.** The order has three items. Try them one at a time. `kape` alone gives 36 and `sabon` alone gives 50. The third item, `asin`, gives NaN. Look at it: `{ name: \'asin\' }` has no `qty`. So `prices[\'asin\'] * item.qty` is `8 * undefined`, which is NaN, and any number added to NaN stays NaN. That is why one bad line spoiled the whole total.',
      },
      {
        type: 'paragraph',
        text: '**Fix.** The order line is missing its quantity, so the smallest honest fix is to give it one: `{ name: \'asin\', qty: 1 }`. One change, and we can say why.',
      },
      {
        type: 'paragraph',
        text: '**Verify.** Here is the step people skip. Before you rerun, work out what the right answer is: 3 × 12 + 2 × 25 + 1 × 8 = 36 + 50 + 8 = **94**. Now rerun. If it prints 94, the fix is proven. If it printed 86 you would know something is still wrong, even though 86 “looks like a normal number”. Without the answer in your head first, you will accept whatever appears.',
      },
      {
        type: 'warning',
        text: 'Decide the expected result before you run the fix. A fix you “checked” by glancing at the output is a guess that happened to look fine.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of a leaking roof. The stain on your ceiling is where you *see* the problem, but the hole is somewhere else on the roof. Reproducing is making it rain on purpose. Isolating is checking one part of the roof at a time. Fixing is patching the hole. Verifying is making it rain again and checking the ceiling stays dry. In the receipt, the “stain” is `NaN` on the screen and the “hole” is a missing `qty` in the order. Reading the code above line by line: the first line is a price list; `lineTotal` multiplies one item’s price by how many were bought; `receiptTotal` adds all the line totals together using a loop (it repeats the same steps for each item in the list); the last line prints the result. A *variable* such as `total` is just a named box holding a value.',
      },
      { type: 'heading', text: 'Where AI fits in the loop' },
      {
        type: 'paragraph',
        text: 'AI can help at every step: it can suggest ways to reproduce, point at the suspicious line, propose a fix and write a test. What it cannot do is know what you *expected*, because that lives in your head. It also cannot feel the difference between “prints a number” and “prints the right number”. That is why you keep the first step (reproduce, in your words) and the last step (verify, against your answer) for yourself, and hand the middle to the AI. The next lessons teach how.',
      },
      {
        type: 'prompt',
        label: 'A first debugging prompt (you will improve it in lesson 3)',
        text: 'My receipt script prints "Total: PHP NaN" instead of a peso total. Run it with `node receipt.js`. The order is in receipt.js. I expect 94 (3 coffee at 12, 2 soap at 25, 1 salt at 8). Please explain why it prints NaN before you change anything.',
      },
      {
        type: 'paragraph',
        text: '**One safety habit before any AI touches your code:** make a restore point. If your project uses Git, run `git status` and commit what works (`git add -A` then `git commit -m "Working receipt"`). If it does not, copy the folder. Then a bad AI edit costs you ten seconds, not an evening. Lesson 6 shows how to read what the AI changed and undo it.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat each step as a hypothesis test. “Isolate” is a search: halve the input, the call path or the commit range, and keep only the half that still fails. Write the hypothesis and the observation that would refute it before you run anything, so a confirming result cannot be rationalised after the fact. When the bug is “it broke sometime this month”, let Git do the halving: `git bisect` does a binary search over history and, with a script that exits 0 for good and non-zero for bad, `git bisect run` automates it. An intermittent bug is a reproduction problem, not a fix problem: measure its rate (fails 1 in 5?) and look for what differs between the failing and passing runs before touching code.',
      },
      {
        type: 'code',
        language: 'text',
        audience: { min: 'advanced' },
        label: 'Real output: git bisect run found the commit that broke total.js (6 commits, check.js exits 1 when 12 x 3 is not 36)',
        code: `$ git bisect start HEAD HEAD~5
$ git bisect run node check.js
running 'node' 'check.js'
FAIL: got 15
bf5b8c2 is the first bad commit
    4 simplify total
 total.js | 4 +---
bisect found first bad commit`,
      },
      {
        type: 'version',
        text: 'The AI tools’ own guidance matches this loop. Claude Code’s docs advise giving the command that reproduces the issue, mentioning steps to reproduce, and saying whether the error is intermittent or consistent, and its best-practices page says to name the symptom and say what “fixed” looks like. Cursor’s Debug Mode docs describe the agent forming hypotheses, asking you to reproduce the bug, and offering a rerun to confirm the fix. Codex’s prompting guide says its bug-fix workflow is for a failing behaviour you can reproduce locally and that Codex should re-run the repro steps after the fix. Checked against Claude Code, Cursor and Codex documentation on this date; features and names change often.',
        checked: CHECKED,
        sources: [DOCS.ccWorkflows, DOCS.ccBest, DOCS.cursorDebug, DOCS.codexPrompting],
      },
      {
        type: 'version',
        text: 'git bisect marks one commit good and one bad, checks out a midpoint, and repeats until it reports the first bad commit; with git bisect run, a script’s exit code 0 means good, 1 to 127 (except 125) means bad, and 125 means “cannot test this commit”. Checked against the Git documentation on this date (Git 2.54 was used to produce the output above).',
        checked: CHECKED,
        sources: [DOCS.gitBisect],
      },
      {
        type: 'takeaways',
        items: [
          'A bug is a gap between what you expected and what happened; debugging closes the gap.',
          'The loop is reproduce, isolate, fix, verify, and verify means rerunning the same reproduction.',
          'Work out the right answer before you run the fix, or you will accept any output that looks plausible.',
          'Let AI help with the middle of the loop, but you own the reproduction and the verification.',
          'Make a restore point (a commit or a copied folder) before an AI changes your code.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-01-arrange-1',
          kind: 'arrange',
          title: 'Put the receipt rescue in order',
          prompt: 'These are the five things Ate Lorna did to rescue her receipt script. Put them in the order of the debugging loop, first at the top.',
          concept: 'debugging loop',
          language: 'text',
          solution: [
            'Run node receipt.js and see "Total: PHP NaN" every time',
            'Try the order one item at a time to find which item breaks it',
            'Notice the asin line has no qty, so 8 * undefined is NaN',
            'Add qty: 1 to the asin line',
            'Run it again and check the total matches the 94 worked out by hand',
          ],
          reasons: [
            'First make the bug happen on demand and write down what you see.',
            'Then shrink the problem: one item at a time shows which one fails.',
            'Understanding why that item fails comes from isolating it, before you change anything.',
            'Only now make one small change for a reason you can state.',
            'Last, rerun the same reproduction and compare with the answer you decided in advance.',
          ],
          hints: [
            'Which step has to come first, before you can tell whether a change helped?',
            'You cannot fix what you have not found, and you cannot find it before you can make it happen.',
            'The order is reproduce, isolate, understand, fix, verify.',
          ],
          explanation: 'Reproduce, isolate, understand, fix, verify. Verify comes last and uses the same reproduction as the first step, compared with the answer worked out before the fix.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-01-predict-output-1',
          kind: 'predict-output',
          title: 'How far does the bad value spread?',
          prompt: 'This loop adds up three order lines and prints the running total after each one. What does it print?',
          concept: 'NaN spreads through a calculation',
          language: 'javascript',
          code: `const prices = { kape: 12, asin: 8 };
let total = 0;
const order = [
  { name: 'kape', qty: 2 },
  { name: 'asin' },
  { name: 'kape', qty: 1 },
];
for (const item of order) {
  total = total + prices[item.name] * item.qty;
  console.log(total);
}`,
          choices: ['24\nNaN\nNaN', '24\n24\n36', '24\nNaN\n12', '24\n32\n44'],
          wrongNotes: {
            '24\n24\n36': 'That would be true if a missing quantity counted as zero. In JavaScript, 8 times undefined is NaN, not 0.',
            '24\nNaN\n12': 'The third line adds 12 to the running total, and the running total is already NaN. NaN plus anything is NaN, so the bad value never goes away.',
            '24\n32\n44': 'That treats the missing quantity as 1. JavaScript does not guess a quantity: undefined makes the multiplication NaN.',
          },
          hints: [
            'Work through the loop one line at a time and write down total after each turn.',
            'On the second turn, item.qty does not exist. What is 8 * undefined?',
            'Once total is NaN, adding 12 to it gives NaN again.',
          ],
          explanation: 'The first line gives 24. The asin line has no qty, so 8 * undefined is NaN and total becomes NaN. On the third turn NaN + 12 is still NaN. One bad value poisons everything added after it, which is why the whole receipt printed NaN.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-01-scenario-1',
          kind: 'scenario',
          title: 'A customer says “your page is broken”',
          prompt: 'Choose your first move.',
          concept: 'reproduce first',
          situation: 'Your friend runs an online order page you built with AI. She messages: “The total is wrong, it’s broken!” You are about to open your AI assistant.',
          options: [
            { text: 'Ask her which order, what she clicked and what total she expected, then try to make the same wrong total appear on your own screen.', consequence: 'You now have a reproduction and an expected answer. Any fix you or the AI make can be proven by rerunning it.', quality: 'best' },
            { text: 'Paste her message into the AI and ask it to fix “the wrong total”.', consequence: 'The AI has no order, no number and no code to look at. It will guess, and a guessed fix cannot be checked because nobody knows what “right” was.', quality: 'poor' },
            { text: 'Rewrite the total calculation from scratch so it is clean.', consequence: 'You may replace the bug with new ones, and you still do not know what caused hers, so you cannot tell whether it is gone.', quality: 'poor' },
            { text: 'Ask her for a screenshot of the wrong total.', consequence: 'Useful evidence, but a screenshot alone does not say what she clicked or what she expected, so you still cannot reproduce it.', quality: 'acceptable' },
          ],
          hints: [
            'What do you need before any fix can be checked?',
            'You need a way to make the problem happen yourself, and the answer that should have appeared.',
            'Reproduce first; the AI comes after you have something to show it.',
          ],
          explanation: 'Reproduce before you fix. A reproduction plus an expected answer is what makes a fix provable, and it is also exactly what you will hand to an AI in lesson 3.',
        },
      },
      {
        type: 'activity',
        activity: {
          audience: { max: 'beginner' },
          id: 'debugging-with-ai-01-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Four words to know',
          prompt: 'Tap each card to check you can say it in your own words.',
          concept: 'debugging vocabulary',
          cards: [
            { front: 'Bug', back: 'A gap between what you expected the program to do and what it did.' },
            { front: 'Reproduce', back: 'Make the problem happen on demand, with the same steps, so you can tell later whether it is gone.' },
            { front: 'Isolate', back: 'Shrink the problem to the smallest input or piece of code that still fails.' },
            { front: 'Verify', back: 'Rerun the same reproduction after the fix and compare with the answer you decided in advance.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'These four words are the vocabulary of every lesson that follows.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-01-q1',
        prompt: 'Why should you work out the right answer (94 in the receipt) before you run the fixed script?',
        choices: [
          'So the AI can write the fix faster',
          'Because the script cannot print numbers above 90',
          'So you can tell a real fix from output that merely looks plausible, like 86',
          'Because Git refuses to create a commit unless you have first written down the expected result of the program',
        ],
        answer: 2,
        explanation: 'Without an answer decided in advance you will accept any normal-looking number. 86 looks fine and is wrong, because one line is missing.',
      },
      {
        id: 'debugging-with-ai-01-q2',
        prompt: 'Which of these is the “isolate” step?',
        choices: [
          'Running the script again to see NaN a second time',
          'Trying the order one item at a time to find which item produces NaN',
          'Adding qty: 1 to the asin line so that the order has a quantity for every item',
          'Comparing the new total with 94',
        ],
        answer: 1,
        explanation: 'Isolating means shrinking the problem. Testing items one by one found the single line responsible. The other choices are reproduce, fix and verify.',
      },
      {
        id: 'debugging-with-ai-01-q3',
        prompt: 'A bug appears on roughly one run in five. What should you do before trying a fix?',
        choices: [
          'Fix it anyway and run it again; if the next run happens to pass, treat the problem as solved and move on',
          'Run it five times and keep the one that worked',
          'Find out what differs between the failing and passing runs so you can make it fail on demand',
          'Ask the AI to rewrite the whole file',
        ],
        answer: 2,
        explanation: 'A bug you cannot trigger on demand cannot be verified: one passing run proves nothing when it usually passes anyway. Reproduction comes first, even if it takes longer than the fix.',
      },
      {
        id: 'debugging-with-ai-01-q4',
        prompt: 'Your AI assistant says “Fixed! It should work now.” What counts as verification?',
        choices: [
          'The AI’s message, because it can read code',
          'Rerunning your original reproduction and comparing the result with your expected answer',
          'Checking that the file saved without a syntax error and that the editor shows no red underlines anywhere',
          'Asking the AI a second time whether it is sure',
        ],
        answer: 1,
        explanation: 'Only a rerun of the same steps, compared with an answer you decided before, is evidence. “Should work” is a prediction, not a result.',
      },
      {
        id: 'debugging-with-ai-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a bug?',
        choices: [
          'A virus or other harmful program that someone secretly planted on your computer to damage it',
          'A mistake in the instructions, so the program does something other than what you wanted',
          'A message the computer shows when it is turned off',
        ],
        answer: 1,
        explanation: 'A bug is not a mysterious force: the program follows its instructions exactly, and the instructions are not what you meant.',
      },
      {
        id: 'debugging-with-ai-01-q6',
        audience: { min: 'advanced' },
        prompt: 'A regression appeared somewhere in the last 400 commits and you have a script that exits non-zero when it is present. What is the most efficient approach?',
        choices: [
          'Read every commit message and guess the likely culprit',
          'Revert commits one at a time from the newest until it passes',
          'Run git bisect with a known good commit and let git bisect run drive the script, about nine steps',
          'Ask an AI agent to read all 400 diffs one by one and report which ones look suspicious to it, then trust its shortlist',
        ],
        answer: 2,
        explanation: 'Binary search halves the range each step, so 400 commits take about nine tests (2 to the power 9 is 512). It is mechanical, cheap and proves the culprit with a test rather than an opinion. An agent can help read the one guilty diff afterwards.',
      },
    ],
    task: {
      title: 'Rescue the receipt',
      minutes: 15,
      steps: [
        'Create a folder and save the receipt.js code from this lesson. Run `node receipt.js` and confirm you see `Total: PHP NaN`.',
        'Write the reproduction in one line: the command, the input and the output you expected (94).',
        'Isolate the cause by testing the order one item at a time. Write down which item breaks the total.',
        'Make one change, rerun the same command and compare with 94. Write one sentence saying why the fix works.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before you change anything, ask an AI assistant: “Explain this script line by line in plain words, as if I have never coded.” Check that its explanation of `item.qty` matches what you found.'] },
      { audience: { min: 'advanced' }, steps: ['Write down your hypothesis and what observation would disprove it before running. Then make a throwaway Git repo with six commits, break one in the middle, and find it with `git bisect run`.'] },
    ],
  },
  {
    id: 'debugging-with-ai-02',
    day: 2,
    title: 'Reading error messages and stack traces',
    summary: 'Split any error into its kind, message and place, and read a stack trace from the right end.',
    minutes: 24,
    skills: ['read-errors'],
    intro: {
      objectives: [
        'Find the kind, the message and the place in any error',
        'Read a stack trace to decide which of your own lines to open first',
        'Explain why the line an error points at is not always the line with the mistake',
      ],
      why: 'An error message is the best evidence you will ever get, and an AI answers far better when you give it whole and understand it yourself. Reading one calmly turns a red wall of text into a clue.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'When a program crashes it prints an **error message**: a report of what it was doing and what went wrong. It looks like a wall of red text, and most beginners skip it and go straight to asking for help. That wastes the best clue available. An error message is like the tracking slip on a parcel that did not arrive: it says what happened (“failed delivery”), where it stopped (“Pili hub”), and the route it took to get there. This lesson teaches you to read that slip. Here is a real crash from a version of Ate Lorna’s receipt program. An order contains an item typed as `Sabon` (capital S) but the price list only knows `sabon`.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'shop.js (line numbers added in the comments; the crash happens on line 9)',
        code: `const prices = { kape: 12, asin: 8, sabon: 25 };   // 1

function addItem(order, name, qtyText) {            // 3
  order.push({ name: name, qty: parseInt(qtyText) });
}

function lineTotal(item) {                          // 7
  const price = prices[item.name];                  // 8
  return Number(price.toFixed(2)) * item.qty;       // 9
}

function receiptTotal(order) {                      // 12
  let total = 0;
  for (const item of order) {
    total = total + lineTotal(item);                // 15
  }
  return total;
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of node run.js unknown (folder shortened; the last few Node-internal lines are left out)',
        code: `/Users/ana/tindahan/shop.js:9
  return Number(price.toFixed(2)) * item.qty;
                      ^

TypeError: Cannot read properties of undefined (reading 'toFixed')
    at lineTotal (/Users/ana/tindahan/shop.js:9:23)
    at receiptTotal (/Users/ana/tindahan/shop.js:15:21)
    at Object.<anonymous> (/Users/ana/tindahan/run.js:14:31)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)
    ...`,
      },
      { type: 'heading', text: 'Three things in every error' },
      {
        type: 'table',
        headers: ['Part', 'In this crash', 'What it tells you'],
        rows: [
          ['Kind', '`TypeError`', 'The family of mistake. A TypeError means a value was used in a way its type does not allow.'],
          ['Message', '`Cannot read properties of undefined (reading \'toFixed\')`', 'The details. Something before `.toFixed` is `undefined`, and you cannot read anything from `undefined`.'],
          ['Place', '`shop.js:9:23`', 'File, line and column where the program noticed the problem: line 9, character 23.'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Read the message slowly, like a sentence. “Cannot read properties of undefined (reading ‘toFixed’)” means: *the program tried to use `.toFixed` on something, and that something was `undefined`*. Line 9 is `price.toFixed(2)`, so `price` is `undefined`. Line 8 set `price` from `prices[item.name]`, so the price list had no entry for that item name. You can solve this crash from the message and the line alone, before any AI is involved.',
      },
      { type: 'heading', text: 'The stack trace: how the program got there' },
      {
        type: 'paragraph',
        text: 'The lines that start with `at` are the **stack trace**. A program is a chain of function calls: the main script called `receiptTotal`, which called `lineTotal`. Each `at` line is one link of that chain. In Node the **top** line is where the error happened (`lineTotal`, line 9), the next line is who called it (`receiptTotal`, line 15), and the next is who called that (`run.js`, line 14). Lines naming `node:internal` belong to Node itself and are almost never the problem. Your rule: read the first line of the message, then find the **first frame in your own file**, and open that line.',
      },
      {
        type: 'visual',
        id: 'scope-execution-flow',
        caption: 'Step through the “function” program and watch the call stack on the left grow when a function is called and shrink when it returns. A stack trace is a snapshot of that stack at the moment of the crash.',
      },
      {
        type: 'paragraph',
        text: 'Notice what the trace did **not** say: that the mistake is the capital `S` in `run.js`. The trace shows where the program *noticed* something wrong (it is where the error was created), not where the bad data first entered. The `Sabon` typo is further down the chain, in the frame for `run.js`. Reading upward from the crash line to the callers is how you find where the bad value came from.',
      },
      { type: 'heading', text: 'Python reads from the bottom' },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of python3 stock.py (Python 3.13, folder shortened)',
        code: `Checking the shelves...
Traceback (most recent call last):
  File "/Users/ana/tindahan/stock.py", line 12, in <module>
    for line in restock_report(["kape", "asin", "bigas", "sabon"]):
                ~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/ana/tindahan/stock.py", line 6, in restock_report
    count = stock[name]
            ~~~~~^^^^^^
KeyError: 'bigas'`,
      },
      {
        type: 'paragraph',
        text: 'Python prints the chain in the opposite order and says so in its first line: “most recent call last”. So the **last** line has the kind and message (`KeyError: \'bigas\'`: a dictionary was asked for the key `bigas`, which it does not have) and the frame just above it is where it happened (`stock.py`, line 6). Same three parts, different order. A dictionary is a list of labelled entries, like the shop’s price list; its `.get(key, default)` method returns the default instead of crashing when the key is missing.',
      },
      { type: 'heading', text: 'Words that show up in errors' },
      {
        type: 'list',
        items: [
          '**undefined** (JavaScript): a value that was never set, such as a missing `qty`. **null** is a value deliberately set to “nothing”.',
          '**JSON**: a plain-text format for data, like `{"name": "Kape", "price": 12}`. “Not valid JSON” means the text does not follow that format.',
          '**const**: a named value that cannot be changed after it is set.',
          '**module** or **library**: code someone else wrote that your program imports. “Not found” usually means it is not installed.',
          '**index**: the position of an item in a list, counting from 0. A list of three items has positions 0, 1 and 2.',
        ],
      },
      {
        type: 'table',
        headers: ['Kind of error', 'The question it is asking you'],
        rows: [
          ['TypeError', 'Is this value what I think it is (a function, an object, text)? Or is it undefined?'],
          ['ReferenceError', 'Does that name exist here, and is it spelled the same?'],
          ['SyntaxError', 'Is the code, or the text I am reading as JSON, well formed?'],
          ['KeyError / IndexError', 'Is the entry I asked for really in the dictionary or the list?'],
          ['ZeroDivisionError', 'Could the number I am dividing by be zero (for example the length of an empty list)?'],
          ['ModuleNotFoundError', 'Is the library installed in the environment where I ran this?'],
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine a courier slip that says “Parcel could not be delivered: house number does not exist. Route: Manila hub, Naga hub, Pili hub.” The *kind* is “delivery failed”, the *message* is “house number does not exist”, and the *route* is the stack trace. You would not stare at the whole slip; you would find the last hub and the reason. In our crash the reason is “price is undefined”, the last stop is `lineTotal` on line 9, and the stop before it, `receiptTotal`, tells you who sent the item there. If you want to know *why* the price was undefined, you walk back along the route, to the order that held the item named `Sabon`. When you do not understand a line of an error, paste it to an AI and ask it to explain in plain words, but still try to read the three parts first. It makes you faster at checking its answer.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** A trace records where an `Error` was constructed, so anything that rethrows or wraps loses the original site unless you chain it: pass `new Error(message, { cause })` and read `error.cause` (Node prints it when it inspects the error). Node keeps at most `Error.stackTraceLimit` frames, 10 by default, so a deep call chain can cut off the frame you need. Asynchronous code can drop the caller entirely when work resumes from the event loop. In browsers, a minified production bundle shows only `main.3f9a1c.js:1:48321`; the frame is unreadable without the source map for that exact release. Treat pasted traces as sensitive: they carry file paths, usernames and sometimes data, so redact before sharing outside your team.',
      },
      {
        type: 'version',
        text: 'In Node.js 22, error.stack starts with “<error class name>: <error message>”, followed by one “at” line per call site; the frame count is limited by Error.stackTraceLimit (default 10). error.cause holds the underlying error when one was passed to the Error constructor. Python prints a “Traceback (most recent call last)” whose last line names the exception type and detail; the output above was produced with Python 3.13, which draws ~~^^ markers under the failing part of the line. In Chrome’s console, expanding an error shows its stack trace, and console.trace() logs one on demand. Checked against Node.js, Python, MDN and Chrome DevTools documentation on this date.',
        checked: CHECKED,
        sources: [DOCS.nodeErrors, DOCS.pythonErrors, DOCS.mdnConsole, DOCS.devtoolsConsole],
      },
      {
        type: 'takeaways',
        items: [
          'Every error has a kind, a message and a place; read the message like a sentence.',
          'In a Node stack trace the top frame is where it crashed and the frames below are its callers; open the first frame in your own file.',
          'Python prints the chain the other way round: the kind and message are on the last line.',
          'The line in the trace is where the problem was noticed; the bad data may have entered further up the chain.',
          'Paste the whole error to an AI, not a summary, and redact secrets and personal data first.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-02-predict-output-1',
          kind: 'predict-output',
          title: 'What does it print before it fails?',
          prompt: 'This is the stock.py program from the lesson. It stops with a KeyError. What does it print before it stops? (Not the error text: only what appears on the screen from print.)',
          concept: 'reading what ran before the crash',
          language: 'python',
          code: `stock = {"kape": 20, "asin": 5, "sabon": 0}

def restock_report(items):
    lines = []
    for name in items:
        count = stock[name]
        if count < 10:
            lines.append(name + ": only " + str(count) + " left")
    return lines

print("Checking the shelves...")
for line in restock_report(["kape", "asin", "bigas", "sabon"]):
    print(line)`,
          expected: 'Checking the shelves...',
          choices: [
            'Checking the shelves...',
            'Checking the shelves...\nasin: only 5 left',
            'Checking the shelves...\nasin: only 5 left\nsabon: only 0 left',
            'Nothing: it fails before printing anything',
          ],
          wrongNotes: {
            'Checking the shelves...\nasin: only 5 left': 'The asin line is only added to a list called lines. It is printed by the loop at the bottom, which does not start until restock_report returns, and it never returns because of the crash on bigas.',
            'Checking the shelves...\nasin: only 5 left\nsabon: only 0 left': 'That is what a working run would print for the items it can find. The crash on bigas happens inside restock_report, before anything is printed from its results.',
            'Nothing: it fails before printing anything': 'The first print runs before restock_report is even called, so that line appears.',
          },
          hints: [
            'Read the program in the order the computer runs it, starting at the first line that is not a definition.',
            'Which print runs before the function is called, and which prints depend on the function finishing?',
            'The report lines are only printed after restock_report returns the list, and it crashes on "bigas" before returning.',
          ],
          explanation: 'Only the first print runs. restock_report collects its lines in a list and returns them; the crash on "bigas" happens before the return, so the loop that prints them never starts. Knowing what ran before the crash is part of reading the trace.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-02-fix-bug-1',
          kind: 'fix-bug',
          title: 'Report missing items as zero',
          prompt: 'The shop wants any item missing from the stock list to be reported as “only 0 left”. Tap the line that raises the KeyError, then choose the fix. (Hint: a dictionary’s `.get(key, default)` gives the default when the key is missing.)',
          concept: 'KeyError',
          language: 'python',
          code: `stock = {"kape": 20, "asin": 5, "sabon": 0}

def restock_report(items):
    lines = []
    for name in items:
        count = stock[name]
        if count < 10:
            lines.append(name + ": only " + str(count) + " left")
    return lines

print("Checking the shelves...")
for line in restock_report(["kape", "asin", "bigas", "sabon"]):
    print(line)`,
          bugLine: 6,
          fixes: [
            { line: '        count = stock.get(name, 0)', correct: true, why: 'get returns 0 when the key is missing, so bigas is reported as “only 0 left”. Running it prints asin: only 5 left, bigas: only 0 left and sabon: only 0 left.' },
            { line: '        count = stock[name] or 0', correct: false, why: 'The lookup stock[name] still runs first and still raises KeyError for bigas. The “or 0” only helps for values that exist and are 0.' },
            { line: '        count = stock[name.lower()]', correct: false, why: 'bigas is already lower case. The key is simply not in the dictionary, so this raises the same KeyError.' },
            { line: '        count = int(stock[name])', correct: false, why: 'The failure is the lookup itself, before int is called. The same KeyError appears.' },
          ],
          lineNote: 'That line works for every item that is in the dictionary. The traceback names the line that raised the KeyError: look at the frame just above the last line.',
          hints: [
            'The last line of the traceback names the kind; the frame above it names the line number.',
            'The error is raised where the dictionary is asked for an entry that is not there.',
            'Use the dictionary method that takes a default: stock.get(name, 0).',
          ],
          explanation: 'The traceback points at line 6, where stock[name] fails for "bigas". Square brackets raise KeyError for a missing key; .get(name, 0) returns the default instead. Each wrong option still performs the same failing lookup. Whether “missing means zero” is the right rule is a design choice, and lesson 7 comes back to choices like it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-02-match-1',
          kind: 'match',
          title: 'What should you check?',
          prompt: 'Each error message is new. Use the kind and the message, like a sentence, to match it with what the program is telling you.',
          concept: 'reading error messages',
          labels: { terms: 'Error message', meanings: 'What to check first' },
          pairs: [
            { term: 'TypeError: o.go is not a function', definition: 'The name go is missing from o, or holds something that is not a function: check the spelling and what o contains', note: 'The message says “not a function”: something was called like a function but is not one.' },
            { term: 'SyntaxError: Unexpected end of JSON input', definition: 'The text being read as JSON is empty or cut off: check what was actually received', note: '“End of JSON input” means the text stopped before a complete JSON value.' },
            { term: 'ModuleNotFoundError: No module named \'requests\'', definition: 'The program imports a library that is not installed where it runs: install it there', note: '“No module named” is about a library the program tries to import.' },
            { term: 'IndexError: list index out of range', definition: 'The code asked for a position beyond the last item of a list: check the list length', note: 'An index is a position in a list; “out of range” means past the end.' },
            { term: 'TypeError: Assignment to constant variable.', definition: 'The code tries to change a value declared with const, which cannot be reassigned', note: '“Constant” and “assignment” point at changing a const value.' },
          ],
          hints: [
            'Read each message as a sentence: what did the program try, and what did it find?',
            'Match the key words: “function”, “JSON”, “module”, “index”, “constant”.',
            'Each definition names the same word as one message; pair them by that word.',
          ],
          explanation: 'Every message has the same shape: a kind and a plain-language report. The key noun in the message (function, JSON, module, index, constant) points at what to check, which is the question to take to an AI as well.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-02-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Reading the trace, one slice at a time',
          prompt: 'Tap each card and say your answer out loud before you flip it.',
          concept: 'stack trace reading',
          cards: [
            { front: 'In `TypeError: Cannot read properties of undefined (reading \'toFixed\')`, what is the kind?', back: 'TypeError. The kind is the word before the colon.' },
            { front: 'In the same line, what is undefined?', back: 'The thing before `.toFixed`. Here that was `price`, because the price list had no entry for the item.' },
            { front: 'What does `at lineTotal (shop.js:9:23)` tell you?', back: 'The crash happened inside the function lineTotal, in shop.js, line 9, column 23.' },
          ],
          hints: ['Look back at the three-part table.'],
          explanation: 'Kind, message and place: three questions you can answer from any error.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-02-q1',
        prompt: 'In the Node crash, which line of the stack trace tells you which of your own lines to open first?',
        choices: [
          'at lineTotal (/Users/ana/tindahan/shop.js:9:23), the first frame in your own file',
          'at Module._compile (node:internal/modules/cjs/loader:1781:14), the one from Node',
          'at Object.<anonymous> (run.js:14:31), because the last line is always the cause',
          'Node.js v22.23.1, because it names the version that failed',
        ],
        answer: 0,
        explanation: 'Open the first frame in your own code: it is the place where the program noticed the problem. Frames from node:internal are Node’s own machinery.',
      },
      {
        id: 'debugging-with-ai-02-q2',
        prompt: 'In a Python traceback, where do you find the kind of error and its message?',
        choices: [
          'On the first line, “Traceback (most recent call last)”',
          'On the first File line, which is the failing function',
          'In the caret (^) markers under the code',
          'On the very last line, for example KeyError: \'bigas\'',
        ],
        answer: 3,
        explanation: 'Python lists the call chain with the most recent call last, so the exception type and detail are on the final line, with the failing code just above it.',
      },
      {
        id: 'debugging-with-ai-02-q3',
        prompt: 'The trace points at line 9 of shop.js, but the real mistake was typing `Sabon` in run.js. Why does the trace not point at the typo?',
        choices: [
          'Node cannot see the file run.js',
          'The trace shows where the program noticed the problem, not where the bad data first came from',
          'Stack traces ignore capital letters, so a trace can never point at the place where a name was typed',
          'The error kind was wrong, which is common in Node',
        ],
        answer: 1,
        explanation: 'The error is created at the moment `price.toFixed` fails. The bad value was created earlier, further along the chain of callers, so you walk back from the crash line to find where it entered.',
      },
      {
        id: 'debugging-with-ai-02-q4',
        prompt: 'What does “Cannot read properties of undefined (reading \'toFixed\')” tell you?',
        choices: [
          'toFixed was spelled wrong',
          'The program ran out of memory while formatting a number',
          'The value in front of `.toFixed` is undefined, so something earlier did not produce the value you expected',
          'toFixed was removed from this version of Node, so any call to it ends in an error like this one, and the message names it',
        ],
        answer: 2,
        explanation: 'The message names the property being read (toFixed) and the value it was read from (undefined). The fix is upstream: find out why that value was never set.',
      },
      {
        id: 'debugging-with-ai-02-q5',
        audience: { max: 'beginner' },
        prompt: 'The message says `ReferenceError: prices is not defined`. In everyday words, what happened?',
        choices: [
          'The program used the name prices, but nothing with that name exists in that place, or it is spelled differently',
          'The prices were too high',
          'The program is out of date and must be updated',
        ],
        answer: 0,
        explanation: '“Not defined” means a name was used that was never created where the code runs, often because of a typo or because the line that creates it was not reached.',
      },
      {
        id: 'debugging-with-ai-02-q6',
        audience: { min: 'advanced' },
        prompt: 'A production crash report shows only `at t.render (main.3f9a1c.js:1:48321)`. What do you need to make it useful?',
        choices: [
          'A longer Error.stackTraceLimit on the user’s phone',
          'The source map that was built together with that exact release, so the position can be mapped back to your source',
          'The latest version of the code from your main branch',
          'A screenshot of the page from the user, plus a description of what they were clicking when the crash happened, from memory',
        ],
        answer: 1,
        explanation: 'Minified bundles collapse the code into a few lines, so a column number means nothing without the source map from the same build. Mapping against a newer branch would point at the wrong code.',
      },
    ],
    task: {
      title: 'Read a real crash',
      minutes: 15,
      steps: [
        'Save shop.js from this lesson and a run.js that calls `addItem(order, \'Sabon\', \'2\')` and prints `receiptTotal(order)`. Run it to see a TypeError.',
        'On paper or in a note, copy out the kind, the message and the place. Then write in one sentence what you think happened.',
        'Paste the whole error into an AI assistant and ask: “Explain this error in plain words and tell me which line I should open first.” Compare its answer with your sentence.',
        'Write down one thing the stack trace did not tell you (hint: where the capital S came from).',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Print the error and use three colours of highlighter (or text colours) to mark the kind, the message and the place. Do this for a Python KeyError too.'] },
      { audience: { min: 'advanced' }, steps: ['Wrap the failing call in try/catch and rethrow with `new Error(\'Could not price \' + item.name, { cause: error })`. Run it and see how the chained cause appears in the output.'] },
    ],
  },
  {
    id: 'debugging-with-ai-03',
    day: 3,
    title: 'Giving the AI the right evidence: error, code and steps',
    summary: 'The four pieces of evidence that turn “it’s broken” into a question an AI can answer, and how to keep secrets out of it.',
    minutes: 22,
    skills: ['give-evidence', 'safe-undo'],
    intro: {
      objectives: [
        'List the four pieces of evidence a debugging prompt needs',
        'Rewrite a vague “it’s broken” message into a prompt a stranger could act on',
        'Redact secrets and personal data before pasting anything into an AI tool',
      ],
      why: 'An AI can only work with what you give it, and it cannot see your screen. The quality of the fix you get back is mostly decided by the quality of the evidence you send.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Imagine phoning a mechanic and saying only “my motorcycle is broken”. He cannot help you. If you say “it makes a clicking noise when I start it cold, the battery is new, and it began after the flood on Tuesday”, he can already guess. An AI assistant is in the same position, with one more handicap: it cannot see your screen, your files or your terminal unless you give them to it. It also never says “I need more information”; it fills the gaps with a confident guess. So your job is to remove the gaps. Four pieces of evidence do almost all of the work.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**The exact error.** Copy the whole message and the stack trace from the screen. Do not retype it and do not summarise it: one changed word can change the meaning.',
          '**The relevant code.** The function the trace points at, and whatever feeds it. Not one line with no context, and not your whole project.',
          '**What you did.** The command you ran or the buttons you clicked, in order, so the AI (and you) can reproduce it.',
          '**What you expected, and what happened instead.** The expected result is what lets the AI, and you, tell a fix from a different bug.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Add three optional extras when they matter: the **environment** (Node 22, macOS, Chrome), **what changed recently** (“it worked before I added run.js”) and **what you already tried** (so it does not suggest the same thing again). Now compare two messages about the crash from the last lesson.',
      },
      {
        type: 'table',
        headers: ['Weak prompt', 'What the AI has to do'],
        rows: [
          ['“My receipt program crashes, please fix it.”', 'Guess what the program is, guess why it crashes and invent a fix for code it has never seen.'],
          ['Pasting the whole 300-line project with “find the bug”.', 'Search for a bug without knowing what the symptom is, and mention whichever suspicious line it finds first.'],
          ['“TypeError: Cannot read properties of undefined. Fix.”', 'Guess where this happens; the message alone fits thousands of programs.'],
        ],
      },
      {
        type: 'prompt',
        label: 'A strong debugging prompt (copy and adapt)',
        text: `Bug: my receipt program crashes when an order contains an item that is not in the price list.

How to reproduce: in my project folder run  node run.js unknown
Expected: a peso total for the items it can price, or a clear message naming the item it could not price.
Actual: it crashes with this error:

TypeError: Cannot read properties of undefined (reading 'toFixed')
    at lineTotal (/Users/ana/tindahan/shop.js:9:23)
    at receiptTotal (/Users/ana/tindahan/shop.js:15:21)
    at Object.<anonymous> (/Users/ana/tindahan/run.js:14:31)

Relevant code (shop.js, lines 7 to 10):
function lineTotal(item) {
  const price = prices[item.name];
  return Number(price.toFixed(2)) * item.qty;
}
The order in run.js includes addItem(order, 'Sabon', '2') (capital S).

Environment: Node 22 on macOS. It worked before I added run.js.

Please: (1) explain the cause using the evidence above, (2) suggest the smallest fix and why, (3) give me the command to check it and the output I should see. Do not change any other file.`,
      },
      {
        type: 'paragraph',
        text: 'Every piece is there: the error as copied, the code the trace points at, the command, the expected and actual result, and a limit on what it may change. Notice the last line asks for the check command and expected output: that is lesson 1’s “verify” step, handed to the AI as a deliverable. Here is the kind of answer you should get back. It is **an example written for this course, not the output of a real model**.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Example AI answer (written for this lesson, not real model output)',
        code: `Cause: prices only has lower-case keys (kape, asin, sabon). For the item
"Sabon", prices[item.name] is undefined, so price.toFixed throws a TypeError
at shop.js:9. The trace shows where it failed; the bad name came from
run.js:14's order.

Smallest fix: make lineTotal fail with a message that names the item, so
the next typo is obvious:

  function lineTotal(item) {
    const price = prices[item.name];
    if (price === undefined) {
      throw new Error('No price for "' + item.name + '"');
    }
    return Number(price.toFixed(2)) * item.qty;
  }

Also correct the typo in run.js ('sabon').

Check: node run.js unknown
- With 'Sabon' you should now see: Error: No price for "Sabon"
- With 'sabon' you should see: Total: PHP 86  (3 x 12 + 2 x 25)`,
      },
      {
        type: 'paragraph',
        text: 'Now **check the answer like a reviewer**. Does it use your evidence (it names `shop.js:9` and the capital S)? Is the cause something you can confirm by looking at the code? Does it give a check you can run? And when you run it, do you get what it promised? We ran this example: with `Sabon` the program printed `Error: No price for "Sabon"`, and with `sabon` it printed `Total: PHP 86`. An answer that ignores your error text, or cannot say how to check it, is guessing.',
      },
      {
        type: 'warning',
        text: 'Never paste secrets into an AI tool: passwords, API keys, tokens (an `Authorization: Bearer …` header is a token), database addresses with passwords in them, or customers’ personal data. Replace each with a placeholder such as `<REDACTED>` before you copy. A stack trace can also contain your username in the file paths.',
      },
      {
        type: 'paragraph',
        text: 'A **coding agent** (Claude Code, Cursor’s agent, Codex) is different from a chat window: it can run the command itself and read the output. With an agent, give the *command that reproduces the bug* and the expected result, and let it run and read the error. You still say what you saw and what you expected, because it cannot know that. It is the same four pieces; the agent just fetches two of them for itself.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words, step by step.** A *terminal* is the window where you type commands to the computer (on a Mac it is called Terminal; on Windows, PowerShell or Command Prompt). When your program crashes, the error appears there. To copy it: select all the red text with your mouse (start at the first line of the error, end at the last), copy it, and paste it into your message. Then paste the function the error mentions. Then write two short sentences: “I ran this command” and “I expected this, but got this”. That is the whole recipe. If you are unsure which function to paste, ask the AI: “Which part of my code do you need to see?” and paste what it asks for. The strong prompt above is just those four pieces with labels.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the prompt as context engineering: the smallest set of facts that makes the right answer the likely one. Prefer a minimal reproduction (a ten-line file or a failing test) to a screenshot of the full app; it also makes your own isolation step explicit. State constraints (“do not change the public signature of `lineTotal`”) and acceptance criteria (“`node --test` passes and `npm run lint` is clean”). Offer a hypothesis as a hypothesis (“I suspect the keys are case-sensitive; check that before agreeing”), because a stated cause anchors the model. Include versions and the lockfile diff when a dependency may be involved, pass log lines with their request IDs (lesson 5), and redact. For an agent, put the standing facts (test command, how to run the app) in its instructions file so each prompt can be short.',
      },
      {
        type: 'version',
        text: 'Claude Code’s best-practices page says to name the file, describe the symptom and say what “fixed” looks like, and contrasts “fix the login bug” with a prompt that names the symptom, the folder, and asks for a failing test first; its common-workflows page adds: tell Claude the command to reproduce the issue and get a stack trace, and mention whether the error is intermittent. Cursor’s Debug Mode docs recommend error messages, stack traces, exact steps, and what you expected versus what happened. Codex’s prompting guide says the repro steps and constraints matter more than a high-level description. In Copilot Chat in an IDE, /fix proposes a fix for problems in the selected code (the exact commands vary by IDE and context). Checked against those documentation pages on this date.',
        checked: CHECKED,
        sources: [DOCS.ccBest, DOCS.ccWorkflows, DOCS.cursorDebug, DOCS.codexPrompting, DOCS.copilotCheat],
      },
      {
        type: 'takeaways',
        items: [
          'An AI cannot see your screen: it works from what you paste, and it guesses to fill gaps.',
          'The four pieces of evidence are the exact error, the relevant code, what you did, and what you expected versus what happened.',
          'Copy errors instead of describing them, and send the code the trace points at, not one line and not the whole project.',
          'Ask for a check command and its expected output, then run it yourself and compare.',
          'Redact secrets, tokens and personal data before pasting; an agent can run the reproduction itself if you give it the command.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-03-scenario-1',
          kind: 'scenario',
          title: 'What evidence do you give the AI?',
          prompt: 'Choose the message to send.',
          concept: 'evidence for the AI',
          situation: 'You built a little order page with AI. You open it in the browser, click “Add” on Barako coffee, and nothing happens. The page looks fine. You open the browser console and see a red message: “Uncaught TypeError: Cannot read properties of null (reading \'appendChild\')” pointing at app.js line 20. You open your AI assistant.',
          options: [
            { text: 'Paste the exact red message, the lines of app.js around line 20 and the line that creates `menu`, say “I open index.html and click Add; I expected the total to go from 0 to 45, it stays 0”, and add your browser name.', consequence: 'The AI can see the error, the code and the steps, and your expected result lets you check any fix. This is the answer you can act on.', quality: 'best' },
            { text: 'Paste the whole app.js and write “nothing happens when I click, can you find the bug?”.', consequence: 'You gave code but not the error or the expected result. The AI may spot something, but it is guessing at what “nothing happens” means and the red message that points straight at the cause was never sent.', quality: 'acceptable' },
            { text: 'Write “my button does not work, please fix it”.', consequence: 'No error, no code, no steps. The AI invents a typical button bug and a fix you cannot check.', quality: 'poor' },
            { text: 'Retype the error from memory as “something about null and appendChild”.', consequence: 'The summary drops the kind (TypeError), the property and the line number, which are exactly the clues that make the diagnosis fast.', quality: 'poor' },
          ],
          hints: [
            'Which message includes the error, the code and the steps?',
            'The expected result matters as much as the error: it is how you will check the fix.',
            'Copy the error exactly, add the code the error points at, then your steps and expectation.',
          ],
          explanation: 'The best message has all four pieces: the exact error, the relevant code, what you did, and what you expected versus what happened. The pasted-code-only version is better than nothing, but it leaves out the clearest clue.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-03-match-1',
          kind: 'match',
          title: 'What is each message missing?',
          prompt: 'Each message to an AI is missing one important piece of evidence. Match the message with the piece it needs.',
          concept: 'missing evidence',
          labels: { terms: 'The message you sent', meanings: 'What it is missing' },
          pairs: [
            { term: 'Here is my whole 900-line app.js. It crashes somewhere. Find it.', definition: 'The exact error text and stack trace, which says where it crashes', note: 'Without the error the AI must read 900 lines to guess; the trace would point at the line.' },
            { term: 'My total is wrong after I click Add twice. Please fix it.', definition: 'The expected total and the exact steps, so a fix can be checked', note: 'There is no number to compare against; “wrong” cannot be verified.' },
            { term: 'TypeError: Cannot read properties of undefined (reading \'name\'). Please fix.', definition: 'The code the error points at and how you triggered it', note: 'The message fits thousands of programs; the AI has no code to look at.' },
          ],
          hints: [
            'For each message, ask what the AI would have to guess.',
            'A huge file with no error needs the error; a vague symptom needs an expected value; a lone error needs code.',
            'Match “whole file, no error” with the error text, “wrong total” with the expected total and steps, and the lone error with the code.',
          ],
          explanation: 'Each message is missing the piece that would stop the AI guessing. Spotting the missing piece in your own messages is the habit this lesson builds.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-03-q1',
        prompt: 'Which is the strongest thing to send first when your program crashes?',
        choices: [
          'A summary in your own words, such as “something about prices crashes”',
          'A screenshot cropped to only the last line of the error',
          'Your whole project folder, zipped, so nothing is missing',
          'The full error text copied exactly, including the stack trace',
        ],
        answer: 3,
        explanation: 'The exact error carries the kind, the message and the place. Summaries lose details, a cropped screenshot loses the trace, and a whole project hides the clue among thousands of lines.',
      },
      {
        id: 'debugging-with-ai-03-q2',
        prompt: 'Why should a debugging prompt say what you expected to happen?',
        choices: [
          'It makes the AI answer more politely',
          'Because it lets you and the AI tell a real fix from a change that just hides the symptom, and check the result',
          'It is needed so the AI can run the code on its own server',
          'AI tools are built to refuse any debugging question that does not state the expected result in the very first message you send',
        ],
        answer: 1,
        explanation: 'Without an expected result nobody can say whether the output after the fix is right. It is the same “decide the answer first” rule from lesson 1.',
      },
      {
        id: 'debugging-with-ai-03-q3',
        prompt: 'Your error output includes a line with `Authorization: Bearer eyJhbGciOi…`. What should you do before pasting it?',
        choices: [
          'Paste it as is, because the AI needs the real token to see exactly how your sign-in request is failing and to reproduce the problem itself',
          'Delete the whole line and say nothing about it',
          'Replace the token with a placeholder such as <REDACTED> and keep the line so the AI sees the header exists',
          'Paste it but ask the AI to forget it afterwards',
        ],
        answer: 2,
        explanation: 'A token works like a password. Replace it with a placeholder; keeping the line (with its shape) still shows the AI that the header is sent. Asking a tool to forget is not a safeguard.',
      },
      {
        id: 'debugging-with-ai-03-q4',
        prompt: 'You use a coding agent that can run commands in your project. What is the best evidence to give it?',
        choices: [
          'Only a description, because agents read minds from the codebase',
          'The command that reproduces the bug, what you expected and what you saw, so it can run it and read the real output',
          'A photo of your screen, because agents cannot read text',
          'Nothing at all, because a coding agent always finds the bug itself by reading every file in the project folder before it answers',
        ],
        answer: 1,
        explanation: 'An agent can fetch the error itself if it knows the command. It still needs your expectation, because that exists only in your head.',
      },
      {
        id: 'debugging-with-ai-03-q5',
        audience: { max: 'beginner' },
        prompt: 'Your program prints a long red error in the terminal. What do you do with it?',
        choices: [
          'Retype the first line from memory, because the rest of the message is usually the same',
          'Copy all of it, from the first line to the last, and paste it into your message',
          'Ignore it and describe the problem instead',
        ],
        answer: 1,
        explanation: 'Copy the whole thing. The details you would drop when retyping are often the clue the AI needs.',
      },
      {
        id: 'debugging-with-ai-03-q6',
        audience: { min: 'advanced' },
        prompt: 'A bug only appears inside a 40-file service. Which evidence gives an AI the best chance of a correct, checkable fix?',
        choices: [
          'A repository-wide dump so the model can find its own context',
          'The model’s own guess about the cause, stated as a fact, so it can confirm it',
          'A description of the symptom and a screenshot of the dashboard',
          'A minimal reproduction (a short script or failing test), the exact command, versions, and constraints on what may change',
        ],
        answer: 3,
        explanation: 'A minimal reproduction fixes the evidence to the bug, doubles as your acceptance check, and keeps the context small. A stated cause anchors the model, and a huge dump buries the signal.',
      },
    ],
    task: {
      title: 'Rewrite a vague message',
      minutes: 15,
      steps: [
        'Write the vaguest message you can about the crash from lesson 2 (for example “my receipt crashes”). Send it to an AI assistant and note how it answers.',
        'Now write the strong version using the four pieces: the exact error, the relevant code, the command, and what you expected versus what happened. Redact anything private.',
        'Send it. Compare the two answers. Which one named the line and the cause? Which gave you a check you could run?',
        'Run the check the AI gave you and write down whether the output matched its promise.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Keep a note called “my debugging message” with the four labels (Error, Code, Steps, Expected) so next time you only fill in the blanks.'] },
      { audience: { min: 'advanced' }, steps: ['Reduce a real bug from one of your own projects to a minimal reproduction under 20 lines, give it to an agent with your acceptance command, and ask it to report the command it ran and its output.'] },
    ],
  },
  {
    id: 'debugging-with-ai-04',
    day: 4,
    title: 'Fixing a broken page together',
    summary: 'Use the browser console to find why a web page is blank, fix it with AI one bug at a time, and prove each fix by clicking.',
    minutes: 26,
    skills: ['web-debugging', 'give-evidence'],
    intro: {
      objectives: [
        'Open the browser console and read the error that explains a broken page',
        'Work with an AI to fix two bugs in order, re-testing after each one',
        'Verify a page fix by using the page and comparing with a total you worked out',
      ],
      why: 'Most things you build with AI first appear as a web page, and a broken page usually looks like nothing at all: a blank area, a button that does nothing. The browser already knows what went wrong; you just have to ask it.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A web page is made of two kinds of instructions. **HTML** describes the content and its structure (a heading, a list, a total). **JavaScript** is the code that makes the page react (fill the list, add up a total when you click). The browser reads the HTML from top to bottom, building the page as it goes, and runs the JavaScript when it reaches it. That order will turn out to matter. Here is a real broken page: a tiny order screen for “Kape ni Aling Nena”. It should list two drinks, each with an Add button, and keep a running total. Open it and you see the heading and “Order total: PHP 0”, but **no drinks at all**.',
      },
      {
        type: 'code',
        language: 'html',
        label: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Kape ni Aling Nena</title>
  <script src="app.js"></script>
</head>
<body>
  <h1>Kape ni Aling Nena</h1>
  <ul id="menu"></ul>
  <p>Order total: PHP <span id="total">0</span></p>
</body>
</html>`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'app.js (line numbers in the comments)',
        code: `const drinks = [                              // 1
  { name: 'Barako', price: '45' },
  { name: 'Iced Latte', price: '85' },
];

const menu = document.getElementById('menu');       // 6
const totalLabel = document.getElementById('total');
let total = 0;

for (const drink of drinks) {                       // 10
  const item = document.createElement('li');
  item.textContent = drink.name + ' - PHP ' + drink.price + ' ';
  const button = document.createElement('button');
  button.textContent = 'Add';
  button.addEventListener('click', function () {
    total = total + drink.price;
    totalLabel.textContent = total;
  });
  item.appendChild(button);
  menu.appendChild(item);                           // 20
}`,
      },
      { type: 'heading', text: 'Bug 1: reproduce and read the console' },
      {
        type: 'paragraph',
        text: '**Reproduce:** open `index.html` in Chrome (double-click the file). The list is empty. **Open the console:** press Command + Option + J on a Mac, or Control + Shift + J on Windows or Linux. The console is the browser’s error report for the page. Ours says:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real console output from headless Chrome',
        code: `Uncaught TypeError: Cannot read properties of null (reading 'appendChild')   app.js:20`,
      },
      {
        type: 'paragraph',
        text: 'Use lesson 2. Kind: `TypeError`. Place: `app.js`, line 20, which is `menu.appendChild(item)`. Message: the thing before `.appendChild` is `null`, so `menu` is `null`. Line 6 creates it with `document.getElementById(\'menu\')`, and that returns `null` when the page has no element with that id *at that moment*. Notice again that the error shows where the problem was **noticed** (line 20), while the cause is where `menu` was created (line 6) and what the page looked like when it ran.',
      },
      {
        type: 'paragraph',
        text: 'Why was there no `menu` yet? Because of the order. The `<script>` tag sits in the `<head>`, so the browser runs `app.js` **before** it has read the `<ul id="menu">` further down. It is like a waiter carrying an order to a table the restaurant has not built yet. Now you can write a strong prompt (lesson 3).',
      },
      {
        type: 'prompt',
        label: 'Prompt for bug 1',
        text: `My page index.html shows the heading but the drink list is empty. I open it in Chrome and click nothing yet. I expected two drinks with Add buttons.
Console error: Uncaught TypeError: Cannot read properties of null (reading 'appendChild') at app.js:20
index.html has <script src="app.js"></script> inside <head>, and the <ul id="menu"> is in <body>. app.js line 6 is: const menu = document.getElementById('menu');
Explain why menu is null and give me the smallest fix. Then tell me what I should see after reloading.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Example AI answer (written for this lesson, not real model output)',
        code: `menu is null because the script runs while the browser is still reading
<head>. The <ul id="menu"> has not been created yet, so getElementById
finds nothing and returns null. The error appears on line 20 because that
is the first place menu is used.

Smallest fix: add the defer attribute so the script waits until the whole
HTML has been read:

  <script src="app.js" defer></script>

Reload the page: you should see two drinks, each with an Add button, and
no red message in the console.`,
      },
      {
        type: 'paragraph',
        text: 'Is that answer right? Check it against what you know: it names the order of loading, it matches your error, and `defer` is a documented attribute that runs a script after the document is parsed. We applied it and ran the page in Chrome: the list now showed “Barako - PHP 45” and “Iced Latte - PHP 85” with their buttons, and the console was clean. **Bug 1 is fixed and verified.**',
      },
      { type: 'heading', text: 'Bug 2: the one that was hiding' },
      {
        type: 'paragraph',
        text: 'Verify properly: decide the answer first. Clicking Add on Barako (45) and then Iced Latte (85) should show **130**. We clicked both. The page showed **04585**. A second bug was hiding behind the first: a crash stops everything after it, so you cannot see problems further on until it is fixed. That is why you fix one thing and re-test before touching the next.',
      },
      {
        type: 'paragraph',
        text: 'No error this time, just a wrong answer, so use what you know. The prices are written as `\'45\'` and `\'85\'`: with quotes, so they are **text**, not numbers. In JavaScript, `+` adds numbers but **joins** text, and if either side is text the result is joined text: `0 + \'45\'` becomes `\'045\'`, and `\'045\' + \'85\'` becomes `\'04585\'`. The root cause is the data: prices were typed as text. The clean fix is at the source, in the list: `price: 45` and `price: 85`, with no quotes. We changed those two lines, reloaded and clicked both buttons: the total read **130**.',
      },
      {
        type: 'paragraph',
        text: '**Two habits to keep from this page.** One: fix one bug, then reproduce again before you start on the next, so you know which change did what. Two: when the AI proposes a fix, say what you expect to see afterwards and then actually look, in the page and in the console.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of the page as a stage show. The HTML builds the stage and sets out the props; the JavaScript is the stage crew that moves props when the audience presses a button. In our broken page the crew arrived before the props were on stage, so there was nothing to move and the crew gave up. `defer` is a note on the script that says “wait until the stage is set”. Reading `app.js`: `drinks` is a list of the two drinks; `getElementById(\'menu\')` asks the page for the thing labelled `menu`; the loop makes one list item and one button per drink; the click function adds that drink’s price to `total` and writes it on the page. The *console* is a text window in the browser where it reports problems and where code can print notes. If a number in quotes behaves strangely, it is text, and text “adds” by sticking together.',
      },
      {
        type: 'tip',
        audience: { min: 'intermediate' },
        text: 'You can pause a running page instead of guessing. Open the Sources panel in DevTools (clicking the file link next to a console message opens it at that line), or write `debugger;` in your code: while DevTools is open, the page stops there and you can read every variable. If no debugger is available the statement does nothing.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** `defer` runs classic scripts after parsing and before `DOMContentLoaded`, in document order; `async` runs as soon as the file arrives, so ordering is not guaranteed and a bug like this can pass on your machine and fail on a slow connection. Module scripts defer by default. The same shape returns in frameworks as hydration and data-loading races, so the habit that transfers is checking what is true at the moment the code runs. Close the loop with a check that a machine can repeat: a headless-browser test that loads the page, clicks both Add buttons and asserts the label reads 130 would have caught both bugs, and it is a good thing to ask an agent for (with an agent that can drive the browser, ask it to report the console output and the total it saw rather than “works”). Type the price as an integer number of centavos if the arithmetic ever includes tax or discounts.',
      },
      {
        type: 'version',
        text: 'Chrome DevTools: Command + Option + J (Mac) or Control + Shift + J (Windows, Linux) opens the Console; errors can be expanded to show their stack trace. Per MDN, a classic script with defer runs after the document is parsed and before DOMContentLoaded, in document order, while async runs as soon as the file is available with no ordering guarantee; module scripts defer by default. Claude Code can connect to Chrome (the Claude in Chrome extension, started with claude --chrome, for direct Anthropic plans) so it can read console errors and DOM state; this is one way a coding agent gets the console output without you pasting it. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.devtoolsConsole, DOCS.mdnScript, DOCS.ccChrome, DOCS.mdnDebugger],
      },
      {
        type: 'takeaways',
        items: [
          'The browser console is the error report for a page: open it first, then read the kind, message and place.',
          'The browser reads HTML top to bottom, so a script in the head that looks for an element further down finds null; defer fixes the order.',
          'The first bug can hide the second: fix one, reproduce again, then move on.',
          'A number written in quotes is text, and + joins text; fix the data at its source.',
          'Verify a page by using it and comparing with the answer you worked out first (130), not by looking at the code.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'Make the script wait for the page',
          prompt: 'This is the real index.html with the null error. Tap the line that makes app.js run too early, then pick the change that makes it reliably wait until the whole page is read.',
          concept: 'script loading order',
          language: 'html',
          code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Kape ni Aling Nena</title>
  <script src="app.js"></script>
</head>
<body>
  <h1>Kape ni Aling Nena</h1>
  <ul id="menu"></ul>
  <p>Order total: PHP <span id="total">0</span></p>
</body>
</html>`,
          bugLine: 6,
          fixes: [
            { line: '  <script src="app.js" defer></script>', correct: true, why: 'defer tells the browser to run the script after the whole document is parsed, so the menu list exists when app.js looks for it. We ran it in Chrome: the two drinks appear and the console is clean.' },
            { line: '  <script src="app.js" async></script>', correct: false, why: 'async runs the script as soon as the file arrives, and MDN gives no guarantee about when that is compared with parsing. It may happen to work on a fast local file and still fail somewhere else, so it hides the bug rather than fixing it.' },
            { line: '  <script src="app.js" type="text/plain"></script>', correct: false, why: 'This stops the browser treating the file as JavaScript, so it never runs. The error disappears because nothing runs at all: the page is still empty.' },
            { line: '  <script src="./app.js"></script>', correct: false, why: 'This is just another way to write the same path. The script still runs while the head is being read, so the same null error appears.' },
          ],
          lineNote: 'That line is fine. The error comes from app.js running before the list exists, and the line that decides when app.js runs is the script tag in the head.',
          hints: [
            'The error is about the order the browser reads things. Which line loads app.js?',
            'The script tag sits in the head, so it runs before the body exists. You want it to wait.',
            'There is a script attribute that means “run after the document has been parsed”: defer.',
          ],
          explanation: 'The script tag on line 6 makes the browser run app.js while it is still reading the head, before the menu list exists. Adding defer makes the script wait until the document is parsed. async looks similar but does not guarantee order, and the other two options either never run the script or change nothing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-04-predict-output-1',
          kind: 'predict-output',
          title: 'Why the total reads 04585',
          prompt: 'The prices are still text (in quotes), as in the broken page. What does this print?',
          concept: 'text versus numbers',
          language: 'javascript',
          code: `let total = 0;
const prices = ['45', '85'];
for (const price of prices) {
  total = total + price;
  console.log(total);
}`,
          choices: ['045\n04585', '45\n130', '45\n4585', '0\n0'],
          wrongNotes: {
            '45\n130': 'That is the answer you want, and what you get if the prices are numbers. With quotes they are text, and + joins text instead of adding.',
            '45\n4585': 'The first line would be 45 only if 0 were dropped. + keeps the starting 0 and joins it to the text, so the first line is 045.',
            '0\n0': 'The loop does change total. The text is joined onto it each turn, so it is never just 0 again.',
          },
          hints: [
            'Are the prices numbers or text? Look for the quotes.',
            'When one side of + is text, JavaScript joins the two sides into text.',
            '0 + \'45\' is \'045\'. What is \'045\' + \'85\'?',
          ],
          explanation: 'Because the prices are text, + joins instead of adding: 0 and \'45\' make \'045\', and then \'045\' and \'85\' make \'04585\'. That is exactly the wrong total the page showed. Writing 45 and 85 without quotes makes them numbers, and the total becomes 130.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-04-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Browser words to know',
          prompt: 'Tap each card, saying your answer first.',
          concept: 'browser vocabulary',
          cards: [
            { front: 'What is the browser console?', back: 'A text window in the browser where it reports errors for the page and where code can print notes.' },
            { front: 'What does null mean in “Cannot read properties of null”?', back: 'The code looked for something (here the menu list) and the page returned “nothing found”.' },
            { front: 'What does defer on a script tag do?', back: 'It makes the browser wait to run the script until it has read the whole page.' },
            { front: 'Why did the total show 04585 instead of 130?', back: 'The prices were text in quotes, and + sticks text together instead of adding.' },
          ],
          hints: ['Reread the section for the bug each card is about.'],
          explanation: 'These four ideas cover the two bugs on the page.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-04-q1',
        prompt: 'The console says `Cannot read properties of null (reading \'appendChild\')` at app.js:20. What is the real cause?',
        choices: [
          'appendChild was removed from browsers',
          'The Add button was never created, so the click handler failed',
          'The script ran before the `<ul id="menu">` existed, so getElementById returned null',
          'The prices are written as text instead of numbers, so adding them joins the digits together',
        ],
        answer: 2,
        explanation: 'Line 20 is only where `menu` was used. It was null because the script in the head ran before the browser had read the list. The text-price problem is real but is the second bug, and it makes no error.',
      },
      {
        id: 'debugging-with-ai-04-q2',
        prompt: 'After the first fix, clicking both Add buttons shows 04585. Why?',
        choices: [
          'The page is adding 45 and 85 correctly but displaying them with the wrong font',
          'The + operator joins text, and the prices were written as text in quotes',
          'The browser cached the earlier error',
          'defer changes numbers into text',
        ],
        answer: 1,
        explanation: 'With quotes the prices are text, so 0 + \'45\' is \'045\' and then \'045\' + \'85\' is \'04585\'. defer has nothing to do with it; this bug was only hidden behind the first one.',
      },
      {
        id: 'debugging-with-ai-04-q3',
        prompt: 'After fixing bug 1 you see a new wrong total. What is the right next step?',
        choices: [
          'Ask the AI to rewrite the whole page',
          'Revert the defer fix right away, since the new wrong total must have been caused by the change you just made',
          'Treat it as a new bug: reproduce it, state the expected total (130), isolate and fix',
          'Ignore it, because the console has no error',
        ],
        answer: 2,
        explanation: 'Fixing the first bug exposed a bug that was already there. Handle it with the same loop, starting with the exact steps and the expected answer.',
      },
      {
        id: 'debugging-with-ai-04-q4',
        prompt: 'Which is the best verification of the defer fix?',
        choices: [
          'Reading the new line and agreeing it looks right',
          'Reloading the page, checking the console is clean, then clicking both Add buttons and comparing with 130',
          'Asking the AI whether it is confident, and whether it would expect the fix to work in every browser and every device',
        ],
        answer: 1,
        explanation: 'Verification uses the page the way a person would, and compares with the answer you decided in advance. It also catches the second bug, which reading the line would not.',
      },
      {
        id: 'debugging-with-ai-04-q5',
        audience: { max: 'beginner' },
        prompt: 'What is the browser console for?',
        choices: [
          'Saving a copy of your page to the cloud so that other people can open it from anywhere',
          'Making the page load faster',
          'Seeing the browser’s error messages and notes for the page you have open',
        ],
        answer: 2,
        explanation: 'The console is where the browser reports problems with the page’s code, with the file and line, so you can read them or paste them to an AI.',
      },
      {
        id: 'debugging-with-ai-04-q6',
        audience: { min: 'advanced' },
        prompt: 'You fixed both bugs by hand. How do you stop them coming back unnoticed?',
        choices: [
          'Add a browser-level check that loads the page, clicks both Add buttons and asserts the total reads 130, run in your usual test pipeline',
          'Leave a code comment saying “do not move the script tag”',
          'Rely on code review to spot a missing defer attribute',
          'Replace the page with a framework so these problems cannot happen',
        ],
        answer: 0,
        explanation: 'A repeatable check turns “I looked at it once” into a guard: script-order and text-versus-number regressions both fail it. A comment and review depend on memory, and a framework just moves the same class of bug elsewhere.',
      },
    ],
    task: {
      title: 'Fix the page with AI, one bug at a time',
      minutes: 20,
      steps: [
        'Create a folder with index.html and app.js exactly as shown. Open index.html in Chrome and confirm the list is empty. Open the console and copy the error.',
        'Send the AI a strong prompt (error, code, steps, expected result). Apply only its fix for bug 1. Reload and check the console.',
        'Before you click, write down the total you expect for Barako then Iced Latte (130). Click both buttons. Is it right?',
        'Find and fix the second bug (with or without AI), then reload and click again. Write one sentence on each bug’s root cause.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain what defer does in one sentence and give an everyday example.” Then explain it back in your own words to someone else.'] },
      { audience: { min: 'advanced' }, steps: ['Ask an agent to add a headless-browser test that clicks both buttons and asserts 130. Confirm the test fails against the original two-bug page before you accept it.'] },
    ],
  },
  {
    id: 'debugging-with-ai-05',
    day: 5,
    title: 'Logs and the console: asking AI to add them',
    summary: 'When a bug makes no error, make the program narrate itself: where to put log lines, how to ask an AI for them, and how to clean up.',
    minutes: 22,
    skills: ['logging', 'safe-undo'],
    intro: {
      objectives: [
        'Place a log line to test one assumption about a value',
        'Ask an AI to add temporary logging and read the diff to confirm that is all it changed',
        'Read log output to find the first wrong value',
      ],
      why: 'The worst bugs print no error at all, just a wrong answer. Logging is how you watch the program work, and it gives you the evidence an AI needs to stop guessing.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The receipt from lesson 1 printed `Total: PHP NaN` with no error message to read. In that case there is nothing to paste and nothing to trace: you have to **watch the program run**. The simplest way is **logging**: adding lines that print a note about what the program is doing, so you can see values you cannot normally see. Think of a delivery rider who texts you at every stop (“left the hub”, “at the bridge”, “at your gate”). When the parcel is late, you read the texts and see exactly where the delay happened. In JavaScript the note-printing tool is `console.log`. In Python it is `print`.',
      },
      {
        type: 'paragraph',
        text: 'Here is lesson 1’s `receipt.js` with two log lines added (the added lines are marked `+` in the diff below). We ran it with the real order: kape ×3, sabon ×2, and an asin line with no quantity.',
      },
      {
        type: 'code',
        language: 'diff',
        label: 'Real git diff: the only change, two temporary log lines',
        code: `@@ -1,6 +1,7 @@
 const prices = { kape: 12, asin: 8, sabon: 25 };

 function lineTotal(item) {
+  console.log('lineTotal', item, 'price =', prices[item.name]);
   return prices[item.name] * item.qty;
 }

@@ -8,6 +9,7 @@ function receiptTotal(items) {
   let total = 0;
   for (const item of items) {
     total = total + lineTotal(item);
+    console.log('running total after', item.name, '=', total);
   }
   return total;
 }`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output with the log lines',
        code: `lineTotal { name: 'kape', qty: 3 } price = 12
running total after kape = 36
lineTotal { name: 'sabon', qty: 2 } price = 25
running total after sabon = 86
lineTotal { name: 'asin' } price = 8
running total after asin = NaN
Total: PHP NaN`,
      },
      {
        type: 'paragraph',
        text: 'Read it from the top and find the **first wrong value**. The first two lines are fine (36, then 86). On the third item the log shows `price = 8`, which is right, so the price is not the problem. But look at the item itself: `{ name: \'asin\' }` has no `qty`. The running total becomes NaN right after it. The logs proved in ten seconds what a lot of staring would not: the missing quantity is the culprit, and it enters before `lineTotal` is even called.',
      },
      { type: 'heading', text: 'How to log well' },
      {
        type: 'list',
        items: [
          '**One question per log line.** “Is `price` what I think?” is a log line. “Print everything” is noise.',
          '**Label every value.** Print `\'qty for\', item.name, \'is\', item.qty`, not just `item.qty`, so you can tell which line printed what.',
          '**Log at the edges.** The most useful places are where data goes into a function and where it comes out, because that is where the first wrong value shows up.',
          '**Find the first wrong value, then stop.** Everything after it is a consequence (like the NaN spreading).',
          '**Take the logs out afterwards.** They are scaffolding, not part of the building.',
        ],
      },
      {
        type: 'table',
        headers: ['Method', 'What it is for'],
        rows: [
          ['`console.log()`', 'A normal note.'],
          ['`console.warn()` and `console.error()`', 'Notes shown as a warning or an error, so they stand out and can be filtered.'],
          ['`console.table()`', 'A list of items shown as a table, handy for a list of order lines.'],
          ['`console.trace()`', 'Prints the call path that led to this line (a stack trace on demand).'],
          ['`console.assert()`', 'Prints an error only if the first argument is false, so it stays quiet when all is well.'],
        ],
      },
      { type: 'heading', text: 'Asking an AI to add the logs' },
      {
        type: 'paragraph',
        text: 'You do not have to write every log line yourself. Describe the symptom and ask for **temporary** logs with a recognisable prefix, and ask it to change nothing else. Then you run the program and send the output back. That is a loop where you supply the evidence and the AI helps interpret it.',
      },
      {
        type: 'prompt',
        label: 'Ask for temporary logging',
        text: `My receipt.js prints "Total: PHP NaN" and no error. I expect 94.
Add temporary console.log lines, each starting with "DEBUG", to find where the total first becomes NaN. Do not change any behaviour or any other code.
Tell me the command to run and what to look for. When I paste the output back, we will decide the next step. Afterwards I will ask you to remove every DEBUG line.`,
      },
      {
        type: 'paragraph',
        text: 'Then **read the diff** before you run anything. A *diff* is the list of exactly which lines were added (`+`) and removed (`-`); Git, your editor and most AI tools can show one, and the block above is a diff. Two things go wrong with AI-added logging. It sometimes changes real code at the same time (a “quick improvement”), and it sometimes prints things it should not, such as a customer’s phone number, a password or a token. If the diff shows more than log lines, or the logs print private data, stop and fix that first. When the bug is found, ask for the cleanup (“remove every DEBUG line and show me the diff”) and check the diff is empty of logging, ideally by comparing with your last commit.',
      },
      {
        type: 'warning',
        text: 'Logs are easy to copy and hard to take back. Never log passwords, tokens, card numbers or customers’ personal data, and remove debug lines before you commit or deploy.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Running a program with logs is like following a recipe while saying each step aloud: “adding the kape… the total is 36… adding the sabon… the total is 86…”. If the cake comes out wrong, you play back what you said and hear where it went off. In `receipt.js` the first new line prints the item and its price each time `lineTotal` runs; the second prints the running total after each item is added. A *log line* is just one of these printed notes. You run the program in the terminal with `node receipt.js`, and the notes appear there before the final result. If you are not sure where to put a log, ask the AI: “Where would a log help me find where this value goes wrong?”',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** In a service, printed lines from many requests interleave, so log structured records (one JSON object per line) with a level, a timestamp and a **correlation ID** that you generate at the edge and pass through every hop; then one request’s story is a single filter, across services. Decide levels deliberately (a debug log you cannot turn on without a deploy is a debug log you will not have), keep high-volume logging out of hot paths, and never put secrets or personal data in log fields. Logs say what happened; traces show the path and timing of one request and metrics show rates over time: reach for the one that answers your question. When you hand logs to an agent, give it the file path and a time window or request ID rather than the whole file, and ask it to quote the lines its conclusion rests on, so you can check the evidence rather than the story.',
      },
      {
        type: 'version',
        text: 'MDN documents console.log, warn, error, table, trace, assert, group and time as the standard console methods. Cursor’s Debug Mode works the same way: the agent proposes possible root causes, adds log statements that send data to a local debug server in the Cursor extension, asks you to reproduce the bug, analyses the captured logs, makes a targeted fix and, when you confirm, removes the instrumentation; its docs also say not to skip the reproduction steps. Debug Mode availability and plans are not stated on the docs page; check the current Cursor documentation. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.mdnConsole, DOCS.cursorDebug],
      },
      {
        type: 'takeaways',
        items: [
          'When a bug makes no error, logging lets you watch values change and find the first wrong one.',
          'Log one question at a time, label every value, and log where data enters and leaves a function.',
          'Ask the AI for temporary logs with a prefix, and read the diff to confirm it changed nothing else.',
          'Never log secrets or personal data, and remove the debug lines when the bug is fixed.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-05-predict-output-1',
          kind: 'predict-output',
          title: 'Read what the log says',
          prompt: 'You added this log line to find out why the asin line misbehaves. What does it print?',
          concept: 'reading log output',
          language: 'javascript',
          code: `const items = [{ name: 'kape', qty: 3 }, { name: 'asin' }];
for (const item of items) {
  console.log('qty for', item.name, 'is', item.qty);
}`,
          choices: ['qty for kape is 3\nqty for asin is undefined', 'qty for kape is 3\nqty for asin is 0', 'qty for kape is 3\nqty for asin is NaN', 'qty for kape is 3\nqty for asin is'],
          wrongNotes: {
            'qty for kape is 3\nqty for asin is 0': 'JavaScript does not fill in a missing property with 0. A property that was never set reads as undefined.',
            'qty for kape is 3\nqty for asin is NaN': 'NaN comes from a calculation. Here we only print the property, and it was never set, so it reads as undefined.',
            'qty for kape is 3\nqty for asin is': 'console.log prints the word undefined for a missing value; it does not leave a blank.',
          },
          hints: [
            'Go through the loop turn by turn. Which item has no qty?',
            'Reading a property that was never set gives the value undefined.',
            'console.log prints undefined as the word undefined.',
          ],
          explanation: 'The second item has no qty, so item.qty is undefined and console.log prints that word. This is the first wrong value, which is what a log line is for.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-05-code-challenge-1',
          kind: 'code-challenge',
          title: 'Add the log that shows the running total',
          prompt: 'Add one console.log inside the loop so the program prints the running total after each item, in the form `after kape: 36`. The final Total line is already there.',
          concept: 'adding a log line',
          language: 'javascript',
          starter: `const prices = { kape: 12, sabon: 25 };
const order = [
  { name: 'kape', qty: 3 },
  { name: 'sabon', qty: 2 },
];
let total = 0;
for (const item of order) {
  total = total + prices[item.name] * item.qty;
  // add your console.log here
}
console.log('Total: ' + total);`,
          tests: { kind: 'output', expected: ['after kape: 36', 'after sabon: 86', 'Total: 86'] },
          solution: `const prices = { kape: 12, sabon: 25 };
const order = [
  { name: 'kape', qty: 3 },
  { name: 'sabon', qty: 2 },
];
let total = 0;
for (const item of order) {
  total = total + prices[item.name] * item.qty;
  console.log('after ' + item.name + ': ' + total);
}
console.log('Total: ' + total);`,
          hints: [
            'The log goes inside the loop, after total has been updated.',
            'Build the text with + : the word after, the item name, a colon and space, and then the total.',
            'console.log(\'after \' + item.name + \': \' + total);',
          ],
          explanation: 'Putting the log after the update shows the running total for each item. Joining labelled pieces with + gives a line you can read at a glance: the label is what makes a log useful.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-05-scenario-1',
          kind: 'scenario',
          title: 'The AI added fourteen log lines',
          prompt: 'Choose what to do before you commit.',
          concept: 'reviewing AI-added logging',
          situation: 'You asked an AI to add logging to your order app and it did. The diff touches six files and adds fourteen console.log lines, one of which prints each customer’s full order including their phone number. The bug is now found. You are about to commit.',
          options: [
            { text: 'Read the whole diff, remove the debug lines (starting with the one that prints phone numbers), confirm no real code changed, then commit.', consequence: 'You keep the real fix, leave no scaffolding and no private data in the code or in the logs.', quality: 'best' },
            { text: 'Commit it all; you can clean it up later.', consequence: 'Later rarely comes. Phone numbers will appear in the logs of every customer’s order, and noise will hide the next real message.', quality: 'poor' },
            { text: 'Delete only the line that prints phone numbers and commit the other thirteen.', consequence: 'The immediate privacy problem is solved, but thirteen debug lines stay in six files, adding noise and possibly leaking other details.', quality: 'acceptable' },
            { text: 'Throw away the whole change including the fix and start again.', consequence: 'You lose the verified fix and the work to find it. The logs were meant to be temporary; the fix should be kept.', quality: 'poor' },
          ],
          hints: [
            'There are two jobs: keep the fix and remove the scaffolding.',
            'Reading the diff is the only way to be sure what changed, including the private data.',
            'Review the full diff, remove every debug line, check nothing else changed, and then commit.',
          ],
          explanation: 'AI-added logging is scaffolding. Read the diff, take all of it out (especially anything that prints personal data), and keep only the real fix.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-05-q1',
        prompt: 'When is adding log lines more useful than reading an error message?',
        choices: [
          'When the program gives no error but prints a wrong value, like NaN, so you need to watch the values',
          'When the program crashes with a clear TypeError and a line number you have not read yet',
          'When the AI has already told you the cause and you only want to double-check the spelling of a variable',
          'When the code has never been run, so there is nothing for it to print yet',
        ],
        answer: 0,
        explanation: 'Logging shows you values the program normally hides. If an error already names the line and the cause, read it first; if there is no error, logs are how you look inside.',
      },
      {
        id: 'debugging-with-ai-05-q2',
        prompt: 'In the real receipt log, what did the output prove?',
        choices: [
          'The price list was missing asin, so the lookup for that item failed and every later total was affected as well',
          'The loop ran more than once for each item',
          'The total was always NaN from the very first item',
          'The price of asin was fine (8) but the item had no qty, and the running total turned NaN right after it',
        ],
        answer: 3,
        explanation: 'The log for the asin line showed `price = 8` and an item with no qty; the next running total was NaN. That is the first wrong value: the missing quantity.',
      },
      {
        id: 'debugging-with-ai-05-q3',
        prompt: 'Which log line is the most useful?',
        choices: [
          'console.log("here")',
          'console.log("qty for", item.name, "is", item.qty)',
          'console.log(item, order, prices, total, lineTotal)',
          'console.log("done")',
        ],
        answer: 1,
        explanation: 'It asks one question, labels the value and names the item. A bare “here” does not show a value, and printing everything buries the answer.',
      },
      {
        id: 'debugging-with-ai-05-q4',
        prompt: 'An AI added fourteen log lines across six files. What should you do before keeping any of it?',
        choices: [
          'Run the app once; if it works, commit',
          'Ask the AI whether the logs are safe',
          'Read the diff, check nothing but logging changed and no private data is printed, then remove the debug lines when done',
          'Leave them all in permanently, because future bugs will be easier to find and extra logging never does any harm to anything',
        ],
        answer: 2,
        explanation: 'The diff is the only reliable record of what changed. AI-added logging can include real code changes or print personal data, and it should be removed after use.',
      },
      {
        id: 'debugging-with-ai-05-q5',
        audience: { max: 'beginner' },
        prompt: 'What does `console.log("price is", 12)` do?',
        choices: [
          'Prints a note, “price is 12”, in the terminal or console while the program runs',
          'Saves the price into a file called log.txt so that you can open it later and read it',
          'Changes the price to 12',
        ],
        answer: 0,
        explanation: 'console.log only prints a note for you to read. It does not change anything in the program.',
      },
      {
        id: 'debugging-with-ai-05-q6',
        audience: { min: 'advanced' },
        prompt: 'A service handles hundreds of requests at once and plain console.log lines are impossible to follow. What helps most?',
        choices: [
          'Add many more console.log lines so that every function prints its own name each time it is called, then run the service again',
          'Turn all logging off in production to reduce noise',
          'Structured (JSON) logs with a level and a correlation ID on every line, so one request can be filtered across services',
          'Print the logs in alphabetical order',
        ],
        answer: 2,
        explanation: 'A correlation ID turns interleaved output into one request’s story, and structure makes it searchable. More plain lines make the noise worse, and no logs means no evidence.',
      },
    ],
    task: {
      title: 'Make the receipt narrate itself',
      minutes: 15,
      steps: [
        'Save receipt.js from lesson 1. Ask an AI (using the “temporary logging” prompt) to add DEBUG log lines, and read the diff before running.',
        'Run `node receipt.js` and find the first wrong value in the output. Write down which line printed it.',
        'Fix the bug, rerun and compare with 94. Then ask the AI to remove every DEBUG line.',
        'Run `git diff` (or compare with your copy) and confirm no log lines are left and nothing else changed.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Add the two log lines yourself, without AI first, copying them from the diff in this lesson. Run the program and read the output out loud, line by line.'] },
      { audience: { min: 'advanced' }, steps: ['Replace the plain logs with one JSON line per request containing a generated request ID, a level and the values; write a one-line filter (grep or jq) that shows a single request from a mixed log.'] },
    ],
  },
  {
    id: 'debugging-with-ai-06',
    day: 6,
    title: 'When the AI goes in circles: breaking the loop',
    summary: 'Spot the signs of an AI stuck in a loop, undo safely with version control, and restart with better evidence instead of a third try.',
    minutes: 24,
    skills: ['break-loops', 'safe-undo'],
    intro: {
      objectives: [
        'Recognise the signs that an AI debugging session has stopped making progress',
        'Read a diff and undo a bad AI change before it piles up',
        'Restart with a fresh, evidence-based prompt that asks for hypotheses instead of another fix',
      ],
      why: 'Sooner or later an AI will fix, break, fix and break the same thing while sounding sure each time. Knowing how to stop, undo and change the question saves you evenings and, when an agent is running, money.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'You ask an AI to fix a bug. It changes something and says “this should work now”. It does not. You paste the new result. It changes something else, then changes it back, then explains more confidently than before. Welcome to the **loop**. Here is one, written for this course from the NaN receipt of lesson 1. Each row is a round of the conversation, and each number is real: we ran every variant.',
      },
      {
        type: 'table',
        headers: ['Round', 'You said', 'The AI did', 'Result'],
        rows: [
          ['1', '“The total is NaN. Fix it.”', 'Added `|| 0` around each line total', 'Prints 86: no more NaN, but wrong'],
          ['2', '“Still wrong, it should be 94.”', 'Changed `|| 0` to `|| 1`', 'Prints 87: a different wrong number'],
          ['3', '“Still wrong.”', 'Put `|| 0` back and added a log line', 'Prints 86 again: back where it started'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Three rounds, no progress, and the code is worse than before. Nobody in this conversation ever asked *why the quantity is missing*. Notice what is not happening: the AI is not getting smarter between rounds, because you gave it no new evidence, only “still wrong”. That is the first cause of loops.',
      },
      { type: 'heading', text: 'Why loops happen' },
      {
        type: 'list',
        items: [
          '**No new information.** The same input produces the same kind of answer, so “still wrong” gets another guess.',
          '**A crowded conversation.** Failed attempts pile up and the AI keeps re-reading them; Claude Code’s own advice is that a third correction mostly adds to a conversation already holding two failed attempts.',
          '**Stacked patches.** Each round edits on top of the last, so changes fight each other.',
          '**The wrong model of the problem.** The AI may be editing the wrong file, or treating a symptom (lesson 7).',
          '**No way to check.** In a chat window the AI cannot run your code, so “should work” is a prediction.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Signs you are in one:** the same fix keeps coming back after you rejected it; the changes get bigger each time; each result is a new wrong answer rather than a closer one; the AI says “that should work” without running anything; and you have asked about the same problem three times. Two failed rounds is the time to stop, not the fourth.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The decision at the heart of this lesson: after two failed tries, change the approach rather than ask again.',
        source: `flowchart TD
  A[AI proposes a fix] --> B[You verify against the expected answer]
  B -->|right| D(Done: keep it and note why)
  B -->|wrong| C{Second failure in a row?}
  C -->|no| A
  C -->|yes| E[Stop and undo to the last good state]
  E --> F[Collect new evidence: logs or a smaller reproduction]
  F --> G[Fresh prompt: facts, what is ruled out, ask for hypotheses]
  G --> A`,
      },
      { type: 'heading', text: 'Undo first: version control is your safety net' },
      {
        type: 'paragraph',
        text: 'Before you ask again, put the project back to a state you trust. **Git** records snapshots of your project called **commits**, so a commit is a save point in a video game. When the AI’s edits have not been committed, `git diff` shows exactly what it changed, and `git restore <file>` puts a file back to its last committed state. We did that with the round-1 patch on a real project. First, what changed:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: git status, git diff, then git restore',
        code: `$ git status --short
 M shop.js
$ git diff
@@ -12,7 +12,7 @@ function lineTotal(item) {
 function receiptTotal(order) {
   let total = 0;
   for (const item of order) {
-    total = total + lineTotal(item);
+    total = total + (lineTotal(item) || 0);
   }
   return total;
 }
$ git restore shop.js
$ git status --short
$`,
      },
      {
        type: 'paragraph',
        text: 'Reading a diff takes one minute and is the most valuable review habit you can build. Lines starting with `-` were removed and lines starting with `+` were added. This one-line change is a symptom patch: it silences the NaN by treating a broken line as zero, so the customer’s receipt is silently short. After `git restore`, the status shows nothing, meaning the project matches the last commit again.',
      },
      {
        type: 'warning',
        text: '`git restore <file>` throws away your uncommitted edits to that file, and Git cannot get them back. Commit the good work first so you only ever discard the AI’s attempt.',
      },
      { type: 'heading', text: 'Then restart with better evidence' },
      {
        type: 'paragraph',
        text: 'Open a **new chat** (or clear the session in a coding agent) so the failed attempts stop crowding the context, and write a prompt that carries over what you learned. Notice the last sentence: it asks for hypotheses, not another patch. That breaks the “propose a fix, fail, propose another” pattern.',
      },
      {
        type: 'prompt',
        label: 'Fresh-start prompt after two failed fixes',
        text: `Ignore any earlier attempts. Here is what we know.

Problem: node run.js blank prints "Total: PHP NaN". Expected 94 for kape x3, sabon x2, asin x1.
Evidence: logging shows lineTotal for { name: 'asin' } has price 8 but qty undefined (the order line has no quantity). The running total becomes NaN after that item.
Already tried and rejected: wrapping line totals in "|| 0" (gives 86, silently short) and "|| 1" (gives 87, invents a quantity).
Constraints: change as little as possible; do not edit run.js.

Do not write a fix yet. Give me three possible root causes, and for each one command or log line that would confirm or rule it out.`,
      },
      {
        type: 'paragraph',
        text: 'Three more ways out when you are stuck: **shrink the task** (ask for one function, not the feature); **change the kind of help** (ask the AI to explain the code to you before anyone edits it, or to draw the data flow); and **get a second opinion** from another tool or model, giving it the same evidence, then compare the diagnoses. Keep reading the diff every time.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine asking a driver for directions, and they keep taking the same wrong turn while saying “this is the way”. More shouting does not help. You stop the car, tell them *where you actually are* and what you can see, and ask for two or three possible routes before anyone drives. That is the fresh-start prompt. The restore point is the last junction you knew was right: Git remembers it, so you can drive back to it. If you do not use Git yet, copy your project folder before each AI session; that is a restore point too. `git status` lists what changed since the last commit; `git diff` shows the change line by line; `git restore` puts a file back. If those words are new, ask an AI to walk you through them on a practice folder before you rely on them.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** An agent loop is a control problem: give it a stop condition and a budget (for example, stop after two failed verifications and report what it learned) rather than relying on your attention. Be aware of the reverse failure too: a Stop hook that sends the agent back to work when a check fails keeps it going by design, so it needs a block limit. Prefer evidence an independent party can check: a fresh-context reviewer has no stake in the reasoning that produced the change. Use a separate worktree to try two approaches in parallel without them colliding, and record ruled-out hypotheses in a scratch note the next session reads, so a restart does not retry them. When repeated attempts fail, the usual cause is a wrong model of the system, so stop prompting and spend ten minutes tracing the real data flow yourself or by bisecting history.',
      },
      {
        type: 'version',
        text: 'Claude Code’s best-practices page says to press Esc to stop Claude mid-action, use /rewind (or Esc twice on an empty prompt) to roll code, conversation or both back to an earlier prompt, and, after two failed corrections, run /clear and write a better prompt instead of a third. Its checkpointing docs say checkpoints track Claude’s file-editing tools, do not track changes only made by Bash commands, subagent edits are usually not captured, edits you make outside Claude Code are normally not captured, and checkpoints are not a replacement for version control such as Git. A fresh-context review is available as /code-review in the terminal. Claude Code can run parallel sessions in separate Git worktrees with claude --worktree. We did not find a documented undo or checkpoint command in the Codex pages we read on this date, so treat Git as your undo there. git restore replaces the working-tree copy of a path with the version from the index (or --source), so uncommitted edits to that file are not recoverable through Git. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.ccBest, DOCS.ccCheckpoint, DOCS.ccWorkflows, DOCS.gitRestore, DOCS.codexPrompting],
      },
      {
        type: 'takeaways',
        items: [
          'Loops happen when the AI gets no new information, the conversation fills with failed attempts, or patches stack up.',
          'After two failed fixes, stop and change the approach instead of asking a third time.',
          'Read the diff, then undo to the last good commit (git restore) before trying again; commit good work first.',
          'Restart with a fresh prompt: what you know, what you ruled out, and a request for hypotheses with a check for each.',
          'Tool undo features (like /rewind) help but are not a replacement for Git.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-06-scenario-1',
          kind: 'scenario',
          title: 'Third attempt, still failing',
          prompt: 'Pick your next move.',
          concept: 'breaking an AI loop',
          situation: 'You have asked an AI chat to fix your order page three times. Each reply changes a different line and says “this should work”. The total is still wrong, and now the Add button has stopped responding too. Your last commit was this morning, before you started.',
          options: [
            { text: 'Look at the diff, restore the files to this morning’s commit, collect fresh evidence (the console error and the expected total), then start a new chat asking for three possible causes with a check for each.', consequence: 'You are back on solid ground, the old failed attempts no longer crowd the context, and a request for causes (not another patch) changes what the AI does.', quality: 'best' },
            { text: 'Reply “try again, think harder” and keep going in the same chat.', consequence: 'The conversation already holds three failed attempts and no new evidence. Another round of guessing is the most likely result.', quality: 'poor' },
            { text: 'Ask the AI to undo its own changes, then ask it for a fix once more.', consequence: 'The undo may be incomplete or touch the wrong lines, and the second request has no more information than the first three.', quality: 'poor' },
            { text: 'Restore this morning’s commit and ask again with the exact same message.', consequence: 'You are safe again, but the same input will draw the same kind of answer. The new evidence and the request for hypotheses are what change the outcome.', quality: 'acceptable' },
          ],
          hints: [
            'There are two jobs here: get back to a known good state and change what you give the AI.',
            'More attempts in the same chat usually repeat the same mistake.',
            'Undo with Git, gather new evidence and start fresh asking for hypotheses.',
          ],
          explanation: 'Undo to a trusted state, add real evidence, and change the question from “fix it” to “what could be the cause, and how do we check?”. That breaks the loop; asking again does not.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-06-match-1',
          kind: 'match',
          title: 'Which move breaks this loop?',
          prompt: 'Each situation shows a different way an AI session gets stuck. Match it with the best move.',
          concept: 'loop-breaking moves',
          labels: { terms: 'Situation', meanings: 'Best move' },
          pairs: [
            { term: 'The AI keeps re-adding a null check you rejected twice', definition: 'Start a fresh chat whose prompt lists the fixes already ruled out and why', note: 'The old attempts are crowding the context; a summary of what is ruled out resets it.' },
            { term: 'Two patches in, the app is worse than when you started', definition: 'Restore the last good commit, then retry with one small change', note: 'Stacked patches need undoing before anything else.' },
            { term: 'You do not know which of five files is involved and the AI edits a different one each time', definition: 'Ask for ranked hypotheses with a check for each before any edit', note: 'The AI is guessing where the problem is; hypotheses plus checks replace guesses with tests.' },
            { term: 'The AI says “should work now” but you never see the output', definition: 'Run it yourself, paste the real output back and ask why the last change had no effect', note: 'A prediction is not a result; real output is the new evidence.' },
          ],
          hints: [
            'For each situation, ask what is going wrong: clutter, stacking, guessing the location, or no result?',
            'Clutter needs a fresh start, stacking needs an undo, guessing needs hypotheses, a prediction needs real output.',
            'Pair the rejected null check with the fresh chat, and “worse than the start” with the restore.',
          ],
          explanation: 'Each loop has a different cause, so each has a different exit. Naming the cause (clutter, stacked patches, guessing, no evidence) tells you which move to use.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-06-q1',
        prompt: 'What is the most common reason an AI keeps proposing similar failed fixes?',
        choices: [
          'It is not trying hard enough yet, so you should tell it to think longer and slower on the next attempt',
          'The model gets tired after several messages in one chat',
          'Your project is too large for any AI to read',
          'It is being given no new information, so “still wrong” leads to another guess',
        ],
        answer: 3,
        explanation: 'More of the same input gives more of the same kind of answer. New evidence, such as real output or a smaller reproduction, is what changes the result.',
      },
      {
        id: 'debugging-with-ai-06-q2',
        prompt: 'Claude Code’s best-practices page says what to do after two failed corrections?',
        choices: [
          'Run /clear and write a better prompt instead of a third correction',
          'Switch to a larger model straight away and repeat the same message so it can try again from scratch',
          'Delete the project folder and begin again',
          'Send the same prompt three more times to be sure',
        ],
        answer: 0,
        explanation: 'A third correction adds to a conversation that already holds two failed attempts. Clearing and writing one better prompt that folds in what you learned works better.',
      },
      {
        id: 'debugging-with-ai-06-q3',
        prompt: 'You run `git restore shop.js` on a file with uncommitted edits you wanted to keep. What happens?',
        choices: [
          'Git saves the edits in a backup branch',
          'The edits are discarded and Git cannot recover them',
          'Git asks you to confirm, then merges the two versions',
          'Nothing: restore only changes committed files',
        ],
        answer: 1,
        explanation: 'git restore overwrites the working-tree copy, and uncommitted edits are not recoverable through Git. That is why you commit good work before letting an AI change things.',
      },
      {
        id: 'debugging-with-ai-06-q4',
        prompt: 'After restoring your project, what makes the best next prompt?',
        choices: [
          'The same message as before, with “please be careful” added',
          'What you know, what you ruled out, and a request for possible root causes with a check for each, before any fix',
          'Only “still broken” plus the newest error message',
          'A request to rewrite the whole module from scratch, in a cleaner style, so that the old problem cannot return, plus a promise to be careful',
        ],
        answer: 1,
        explanation: 'Evidence plus a ruled-out list stops the AI repeating itself, and asking for causes with checks turns the next step into something you can test.',
      },
      {
        id: 'debugging-with-ai-06-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a “restore point” for a coding project?',
        choices: [
          'A button in the AI chat that makes the AI forget everything you said so that it can start again fresh on a clean page',
          'A saved copy of your working project, such as a Git commit or a copied folder, that you can go back to',
          'The first line of the error message',
        ],
        answer: 1,
        explanation: 'It is your save point. If an AI edit makes things worse you can return to the last version that worked.',
      },
      {
        id: 'debugging-with-ai-06-q6',
        audience: { min: 'advanced' },
        prompt: 'A coding agent has failed verification three times in a row on an overnight run. Which design would have limited the damage?',
        choices: [
          'Letting it retry forever, because each attempt may be the one that works',
          'Turning off the test command so failures stop being reported',
          'Asking it, at the end, whether it believes the fix is correct',
          'A stop condition and budget in the instructions or hooks: stop after two failed verifications, revert to the last commit and write up what was learned',
        ],
        answer: 3,
        explanation: 'An unattended loop needs an explicit exit. Reverting and reporting leaves you a clean tree and evidence to restart from; unlimited retries or hidden failures just burn time and money.',
      },
    ],
    task: {
      title: 'Practise the undo',
      minutes: 15,
      steps: [
        'Make a practice folder with the shop.js code from lesson 2, run `git init`, and commit it.',
        'Ask an AI for a quick fix to the NaN receipt and let it edit the file. Run `git diff` and read every changed line: is it a root-cause fix or a patch that hides the symptom?',
        'Run `git restore shop.js` and confirm `git status` is clean.',
        'Write a fresh-start prompt (what you know, what you ruled out, ask for hypotheses with checks) and send it in a new chat.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you have never used Git, ask an AI to guide you through `git init`, `git add`, `git commit`, `git diff` and `git restore` on a practice folder, one command at a time, explaining each before you run it.'] },
      { audience: { min: 'advanced' }, steps: ['Write the stop condition and budget you would give an unattended agent for a bug fix (attempts, what it must report, what it may not touch), and add them to your instructions file or a hook.'] },
    ],
  },
  {
    id: 'debugging-with-ai-07',
    day: 7,
    title: 'Root cause, not symptom',
    summary: 'Tell a fix that hides a problem from a fix that removes it, walk back to where bad data is born, and make an AI do the same.',
    minutes: 26,
    skills: ['root-cause'],
    intro: {
      objectives: [
        'Explain the difference between a symptom and a root cause using a real example',
        'Ask “why?” repeatedly until you reach the place where the bad value is created',
        'Spot the common symptom-hiding patches that AI tools suggest, and ask for a root-cause fix instead',
      ],
      why: 'AI is very good at making an error message go away, and that is exactly the danger: a patch that silences the symptom leaves the bug in place, and in a shop it can quietly charge the wrong amount.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A tap is dripping onto the floor. You can keep mopping the floor, which handles the **symptom** (the water you see), or you can replace the washer inside the tap, which removes the **root cause** (the reason there is water at all). Mopping is quicker today. It is also the reason you will be mopping next week. In software, the symptom is what you notice (a wrong total, a crash, a blank page). The root cause is the earliest thing that, if you fix it, makes the symptom and its relatives stop for good. This lesson uses the NaN receipt again, in the version where quantities come from a text box, the way they would in a real till.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'shop.js: addItem reads the quantity the cashier typed',
        code: `function addItem(order, name, qtyText) {
  order.push({ name: name, qty: parseInt(qtyText) });
}`,
      },
      {
        type: 'paragraph',
        text: 'The cashier forgot to type a quantity for asin, so `qtyText` is an empty text, `\'\'`. `parseInt` reads a whole number from the start of some text, and with nothing to read it gives `NaN`. The receipt prints `Total: PHP NaN`. Now see what a symptom fix does to it. The AI’s quickest patch is the `|| 0` we met in lesson 6, which means “if this is NaN (or 0), use 0”. With it, the receipt prints **`Total: PHP 86`**: no NaN, no error, and the customer is charged nothing for the salt, and nobody ever finds out. The problem is now *invisible*, which is worse than before.',
      },
      { type: 'heading', text: 'Ask “why?” until you reach the birthplace' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Why does the receipt say NaN?** One line total is NaN, and NaN spreads through every addition after it.',
          '**Why is that line total NaN?** Its quantity is NaN, because `parseInt(\'\')` returns NaN.',
          '**Why was the quantity empty text?** The cashier left the box blank.',
          '**Why did the program accept a blank quantity?** `addItem` never checks what it is given. This is where the bad value is born.',
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Follow the bad value backwards. The root cause is the earliest link you can fix.',
        source: `flowchart LR
  S[Symptom: receipt prints NaN] --> A[A line total is NaN]
  A --> B[Its qty is NaN]
  B --> C[parseInt of empty text gives NaN]
  C --> D[Blank quantity accepted: addItem has no check]
  D --> R(Root cause: input is never validated)`,
      },
      {
        type: 'paragraph',
        text: 'Fix it at the end of that chain, where bad data enters, and refuse a blank or invalid quantity with a clear message. We added exactly that, ran the same blank-quantity order, and got an error that names the problem and the item, instead of a silent wrong receipt:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The root-cause fix: addItem checks its input',
        code: `function addItem(order, name, qtyText) {
  const qty = Number(qtyText);
  if (!Number.isInteger(qty) || qty < 1) {
    throw new Error('Quantity for ' + name + ' must be a whole number of 1 or more, got "' + qtyText + '"');
  }
  order.push({ name: name, qty: qty });
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of node run.js blank after the fix (folder shortened)',
        code: `/Users/ana/tindahan/shop.js:6
    throw new Error('Quantity for ' + name + ' must be a whole number of 1 or more, got "' + qtyText + '"');
    ^

Error: Quantity for asin must be a whole number of 1 or more, got ""
    at addItem (/Users/ana/tindahan/shop.js:6:11)
    at Object.<anonymous> (/Users/ana/tindahan/run.js:9:3)`,
      },
      {
        type: 'paragraph',
        text: 'Two small tools made that work, and they are worth knowing apart. `parseInt` is **lenient**: `parseInt(\'2.5\')` is 2 and `parseInt(\'3 pcs\')` is 3, which quietly accepts junk. `Number` is **strict**: `Number(\'abc\')` and `Number(\'3 pcs\')` are NaN, but note that `Number(\'\')` is 0, which is why the check also demands `qty < 1` to be refused. `Number.isInteger(x)` says whether `x` is a whole number. You will also see the shorthand `condition ? a : b`, which means “if the condition is true, a, otherwise b”.',
      },
      { type: 'heading', text: 'Red flags: patches that hide the symptom' },
      {
        type: 'table',
        headers: ['AI suggests…', 'What it hides'],
        rows: [
          ['`value || 0` or `value ?? 0` everywhere', 'Bad or missing data is quietly turned into a plausible number.'],
          ['An empty `try { … } catch { }`', 'The error still happens, you just never see it.'],
          ['`if (x == null) return;` at the top', 'The function silently does nothing when it should have said why.'],
          ['A delay, a retry or `setTimeout`', 'A timing or ordering problem, which will come back under load.'],
          ['Deleting or loosening the failing test', 'The alarm, not the fire.'],
          ['Turning off a lint or type check', 'The tool that found the problem.'],
        ],
      },
      {
        type: 'paragraph',
        text: 'A guard is not always wrong. After you have fixed the source, a second check in a deeper layer (“defence in depth”) can be sensible, as long as it **fails loudly** with a message instead of silently producing a made-up value. The test is simple: *after this change, will I find out if the bad data arrives again?* If the answer is no, it is a mop, not a washer.',
      },
      {
        type: 'prompt',
        label: 'Ask for a root-cause fix',
        text: `Receipts print NaN when the quantity box is blank. Before you suggest any code, trace the bad value back to where it is created and explain each step.
Then propose a fix at that source (not a fallback like "|| 0"), say what a symptom-only fix would look like and what it would hide, and tell me which test would fail before your fix and pass after it.
State how confident you are and what evidence would prove you wrong.`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine a school canteen where the cashier sometimes forgets to enter a number of meals. The total on the screen is garbage. Option one: make the screen show 0 whenever the total is garbage. Now the canteen loses money all week without noticing. Option two: make the till refuse to continue until the number is entered. The mistake is caught the moment it happens. Our `addItem` fix is option two: it checks the number *when it comes in* and stops with a clear message that names the item. The key habit is asking “*where* did this wrong value come from?” rather than “how do I make the wrong value look right?”. Reading the fix line by line: `Number(qtyText)` turns the typed text into a number; `Number.isInteger` asks “is this a whole number?”; `qty < 1` asks “is it too small?”; `throw new Error(...)` stops the program with a message; otherwise the item is added.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Write the incident down as a short root-cause note: the **trigger** (blank quantity entered), the **root cause** (no validation at the system boundary), **contributing factors** (a lenient parser, no test for blank input, a till that printed NaN instead of failing) and the **guardrails** you added (validation, a regression test, perhaps a type that cannot represent “no quantity”). “Five whys” is a prompt to keep asking, not a law: real incidents often have several causes, so keep branching until each branch ends at something you can change. Use `git bisect` when the question is *when* it started. With an agent, require evidence over assertion: ask it to cite the commit, log line or failing test each claim rests on, to say what would disprove its hypothesis, and to keep the fix minimal with a regression test. Keep the note blameless: the useful question is why the system allowed the mistake.',
      },
      {
        type: 'version',
        text: 'Claude Code’s best-practices page contrasts “fix the login bug” with a prompt that asks it to look at a named area, write a failing test that reproduces the problem, then fix it. Codex’s prompting guide lists example constraints for a bug-fix task such as keeping the fix minimal and adding a regression test if feasible. Cursor’s Debug Mode docs describe collecting runtime evidence about the real cause first and then making a targeted fix, often only a few lines. None of these tools guarantee a root-cause fix; the habit is yours. Checked against those pages on this date.',
        checked: CHECKED,
        sources: [DOCS.ccBest, DOCS.codexPrompting, DOCS.cursorDebug],
      },
      {
        type: 'takeaways',
        items: [
          'A symptom is what you see; the root cause is the earliest link in the chain that, when fixed, makes the problem stop for good.',
          'Ask “why?” and follow the bad value back to where it is created; fix it there.',
          'Patches such as `|| 0`, empty catch blocks and loosened tests hide a bug instead of fixing it.',
          'A good fix makes the next occurrence loud and visible, ideally with a message that names the problem.',
          'Ask the AI to trace the cause, state its confidence and what would prove it wrong, before it writes code.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-07-fix-bug-1',
          kind: 'fix-bug',
          title: 'Fix it where the bad value is born',
          prompt: 'readQty reads the quantity the cashier typed. It must return the whole number (1 or more), or `null` when the text is not a valid quantity (blank, letters, 0, a decimal or negative), so the till can ask again. Tap the line that lets bad text through and choose the fix that passes every case.',
          concept: 'validating input at the source',
          language: 'javascript',
          code: `function readQty(text) {
  return parseInt(text);
}`,
          bugLine: 2,
          fixes: [
            { line: '  return Number.isInteger(Number(text)) && Number(text) >= 1 ? Number(text) : null;', correct: true, why: 'Number is strict, so letters give NaN and 2.5 is not a whole number; the >= 1 check refuses 0, negatives and blank text (Number(\'\') is 0). Valid text such as \'3\' or \' 4 \' becomes a number; everything else is null.' },
            { line: '  return isNaN(parseInt(text)) ? null : parseInt(text);', correct: false, why: 'This catches blank text and letters, but parseInt(\'0\') is 0 and parseInt(\'2.5\') is 2, so a zero and a decimal still get through as valid quantities.' },
            { line: '  return parseInt(text) || 0;', correct: false, why: 'This turns blank text into 0, a plausible-looking number, instead of null. It is exactly the “mop” patch: the bad input becomes a quiet wrong value.' },
            { line: '  return parseInt(text) > 0 ? parseInt(text) : null;', correct: false, why: 'This refuses blank text, letters, 0 and negatives, but parseInt(\'2.5\') is 2, so a decimal slips through as a valid 2.' },
          ],
          tests: {
            kind: 'function',
            fn: 'readQty',
            cases: [
              { label: 'a typed 3', args: ['3'], expected: 3 },
              { label: 'a typed 12', args: ['12'], expected: 12 },
              { label: 'spaces around a number', args: [' 4 '], expected: 4 },
              { label: 'blank text', args: [''], expected: null },
              { label: 'letters', args: ['abc'], expected: null },
              { label: 'zero', args: ['0'], expected: null },
              { label: 'a decimal', args: ['2.5'], expected: null },
              { label: 'negative', args: ['-2'], expected: null },
            ],
          },
          lineNote: 'That is the function line, but the bug is on the line that reads the text: look at what parseInt does with blank text, a decimal or a zero.',
          hints: [
            'Think of every kind of bad text the cashier could type: blank, letters, 0, 2.5, a negative number.',
            'parseInt is lenient: it reads 2 from \'2.5\'. Number is strict. Also remember Number(\'\') is 0.',
            'Check two things: it is a whole number (Number.isInteger) and it is at least 1.',
          ],
          explanation: 'The root cause is that the first line trusts whatever text arrives. A strict reading with Number, a whole-number check and a minimum of 1 refuse every kind of bad input at the place it enters, and return null so the caller can ask again. The other options pass the obvious cases and miss 0, 2.5 or blank text, which is how symptom patches look “fixed” until a real customer finds the gap.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-07-scenario-1',
          kind: 'scenario',
          title: 'The AI wants to wrap it in try/catch',
          prompt: 'How do you respond?',
          concept: 'symptom versus root cause',
          situation: 'Your till sometimes crashes with “Cannot read properties of undefined (reading \'toFixed\')” when a cashier types an item name wrongly. The AI proposes wrapping the receipt code in `try { … } catch { return 0 }` “so the app never crashes”. The tests pass.',
          options: [
            { text: 'Decline it, and ask: “Where does the unknown item name enter? Make that place refuse it with a message naming the item, and add a test for a mistyped name.”', consequence: 'The mistake is caught where it happens, the cashier sees which item is wrong, and a test keeps it that way. The crash and the silent zero both go away.', quality: 'best' },
            { text: 'Accept it, because a crashed till is worse than a zero total.', consequence: 'The till stays up, but every mistyped item is quietly charged as nothing. The error no longer reaches anyone who can fix the cause.', quality: 'poor' },
            { text: 'Accept it, but also log the error inside the catch.', consequence: 'Better: the problem is at least recorded. But the receipt is still wrong at the till, and the cashier is not told, so the root cause (accepting an unknown item) is untouched.', quality: 'acceptable' },
            { text: 'Ask the AI to delete the test that crashes so the pipeline goes green.', consequence: 'You removed the alarm and kept the fire. The next mistyped name goes unnoticed.', quality: 'poor' },
          ],
          hints: [
            'Ask: after this change, will anyone find out when a wrong item name arrives?',
            'try/catch with a quiet default turns a crash into a wrong answer. Where could the bad name be refused instead?',
            'Fix it at the entry point and make the failure visible, with a test.',
          ],
          explanation: 'A catch that returns a default hides the symptom and keeps the bug. The root-cause approach refuses the bad input where it enters, with a clear message, and pins that behaviour with a test.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-07-q1',
        prompt: 'Which description best matches a root cause?',
        choices: [
          'The first error message you see on the screen',
          'The earliest point you can fix so the problem and its relatives stop for good',
          'The line the stack trace points at',
          'The change that makes the tests pass fastest and leaves the smallest diff for the reviewers to read',
        ],
        answer: 1,
        explanation: 'The error you see and the line in the trace are where the problem showed up. The root cause is upstream, where the bad value was created or allowed in.',
      },
      {
        id: 'debugging-with-ai-07-q2',
        prompt: 'Wrapping each line total in `|| 0` makes the receipt print 86 instead of NaN. Why is that worse than the original bug?',
        choices: [
          'It makes the program slower',
          'It stops the code from running in Node 22 and every other recent version, because the operator was removed from the language',
          'The missing item is now charged as nothing and nobody can tell, because the bad data became a plausible number',
          'It makes the output a string instead of a number',
        ],
        answer: 2,
        explanation: 'NaN was at least visibly wrong. 86 looks normal, so the customer is undercharged and the missing quantity is never discovered.',
      },
      {
        id: 'debugging-with-ai-07-q3',
        prompt: 'In the chain of “why?” for the NaN receipt, where is the root cause?',
        choices: [
          'In the receipt’s print line',
          'In the loop that adds up line totals',
          'In the cashier who forgot to type a number',
          'In addItem, which accepts a blank quantity without checking it',
        ],
        answer: 3,
        explanation: 'People forget; software has to cope. The earliest thing you can change is where data enters, addItem, and it can refuse blank input with a clear message.',
      },
      {
        id: 'debugging-with-ai-07-q4',
        prompt: 'What is the one question that tells a real fix from a hiding patch?',
        choices: [
          'Did the red text disappear?',
          'Did the AI explain it confidently?',
          'After this change, will I find out if the bad data arrives again?',
          'Is the diff smaller than ten lines, and did the same reviewer approve it quickly?',
        ],
        answer: 2,
        explanation: 'A real fix removes the cause or makes the next occurrence loud. A hiding patch makes the symptom go away without anyone learning the problem exists.',
      },
      {
        id: 'debugging-with-ai-07-q5',
        audience: { max: 'beginner' },
        prompt: 'A pipe leaks onto the floor. Which is the “root cause” fix?',
        choices: [
          'Putting a bucket under the leak so the water stops reaching the floor and nobody sees it',
          'Mopping the floor every morning',
          'Replacing the broken washer so the pipe stops leaking',
        ],
        answer: 2,
        explanation: 'The bucket and mop deal with the water you can see (the symptom). Replacing the washer stops the leak at its source, which is what a root-cause fix does in code.',
      },
      {
        id: 'debugging-with-ai-07-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent’s postmortem says “root cause: the cashier left the field empty”. What is the best response?',
        choices: [
          'Accept it; human error is always the root cause',
          'Reword it to blame the model that wrote the form',
          'Ask the agent to add a retry so the empty field matters less',
          'Push it to a system cause: why did the system accept an empty quantity, and which guardrail (validation, test, type) would prevent it?',
        ],
        answer: 3,
        explanation: 'A root-cause note should end at something you can change. People will always make mistakes; the useful finding is the missing guardrail at the boundary.',
      },
    ],
    task: {
      title: 'Walk back to the source',
      minutes: 18,
      steps: [
        'Use the shop.js from lesson 2 with `addItem` and run the blank-quantity order. Confirm it prints NaN.',
        'Ask an AI for a quick fix and look at the diff. If it is a fallback such as `|| 0`, note what it would hide, and write down the wrong receipt it would print.',
        'Write the four-step “why?” chain for the bug on paper, then apply the fix at the source (validate in addItem) and rerun. Compare with the error message in the lesson.',
        'Write a root-cause note: symptom, root cause, the fix, and how you will find out if it happens again.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain `Number.isInteger` and `parseInt` with two examples each, using shop prices.” Check each example by running it in the browser console or in Node.'] },
      { audience: { min: 'advanced' }, steps: ['Write the note in the trigger / root cause / contributing factors / guardrails format, then ask an agent to critique it: which claim has no evidence, and what would disprove it?'] },
    ],
  },
  {
    id: 'debugging-with-ai-08',
    day: 8,
    title: 'A test that proves the fix',
    summary: 'Turn “it looked fine” into evidence: write a failing test first, watch it pass after the fix, and catch AI-written tests that prove nothing.',
    minutes: 26,
    skills: ['prove-fix'],
    intro: {
      objectives: [
        'Explain why a fix needs a test that failed before it and passes after it',
        'Read a real failing and passing test run',
        'Spot an AI-written test that proves nothing, such as one that was edited to match the bug',
      ],
      why: 'Without a test, “fixed” means “I tried it once and it seemed fine”. With one, the fix stays proven every time anyone changes the code, and an AI agent has something objective to aim at.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'At closing time, a store owner counts the cash and compares it with the day’s sales slips. If the numbers match, the day is correct, and nobody needs to be convinced. If they do not, there is a mistake to find. A **test** is that count for code: a small program that runs your code, states what the result must be and reports **pass** or **fail**. Running it takes a second, so you can run it after every change, and so can an AI agent. This is the strongest kind of verification, because it does not depend on anyone’s memory or opinion.',
      },
      { type: 'heading', text: 'Failing first, then passing' },
      {
        type: 'paragraph',
        text: 'The order matters more than the tool. First write a test that describes the **correct** behaviour and run it against the broken code. It must **fail**. That failure proves the test can actually detect the bug. Then make the fix and run it again: it must **pass**. A test you never saw fail has never proved anything: it might pass for every version of the code, including the broken one. People call this *red, then green*.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'shop.test.js: two tests for addItem (uses Node’s built-in test runner)',
        code: `const test = require('node:test');
const assert = require('node:assert');
const { addItem } = require('./shop');

test('a blank quantity is refused, not turned into NaN', () => {
  const order = [];
  assert.throws(() => addItem(order, 'asin', ''), /whole number/);
  assert.strictEqual(order.length, 0);
});

test('a typed quantity is kept as a number', () => {
  const order = [];
  addItem(order, 'kape', '3');
  assert.deepStrictEqual(order, [{ name: 'kape', qty: 3 }]);
});`,
      },
      {
        type: 'paragraph',
        text: 'Read it like a sentence. `test(name, function)` defines one check. `assert.throws(...)` says “running this must throw an error whose message matches `whole number`”. `assert.strictEqual(a, b)` says the two must be exactly equal, and `assert.deepStrictEqual` compares the contents of lists and objects. If any assertion is false, the test fails. Underneath, every test tool is built from two small ideas: `a === b` asks whether two values are exactly equal, and `if (condition) { … } else { … }` runs the first block when the condition is true and the second block when it is not. We ran it against the **old** `addItem` (the lesson 7 bug) with `node --test`:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output against the buggy code (shown with --test-reporter=spec; folder shortened)',
        code: `✖ a blank quantity is refused, not turned into NaN (0.792ms)
✔ a typed quantity is kept as a number (0.344ms)
ℹ tests 2
ℹ pass 1
ℹ fail 1

✖ failing tests:

test at shop.test.js:5:1
✖ a blank quantity is refused, not turned into NaN (0.792ms)
  AssertionError [ERR_ASSERTION]: Missing expected exception.
      at TestContext.<anonymous> (/Users/ana/tindahan/shop.test.js:7:10)`,
      },
      {
        type: 'paragraph',
        text: 'This is the failure we want. “Missing expected exception” means the test expected `addItem` to throw for a blank quantity and it did not: it quietly stored NaN. The second test passes because typed quantities always worked. It also failed for the *right reason*, which matters: a test that fails because of a typo in the test proves nothing about the bug. Now apply the lesson 7 fix and run it again:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output after the fix',
        code: `✔ a blank quantity is refused, not turned into NaN (0.829375ms)
✔ a typed quantity is kept as a number (0.437375ms)
ℹ tests 2
ℹ pass 2
ℹ fail 0`,
      },
      {
        type: 'paragraph',
        text: 'The test now proves three things at once: the bug was real (it failed), the fix works (it passes), and the bug cannot return unnoticed (a *regression test*: the next time anyone changes `addItem`, it runs again). It also tells you something about the lesson 6 patch. We ran the same test against the `|| 0` patch and it **still fails**, because the patch never makes `addItem` refuse a blank quantity. A good test pins the behaviour you want, so it rejects fixes that only hide the symptom.',
      },
      { type: 'heading', text: 'Asking AI for the test, and not being fooled' },
      {
        type: 'prompt',
        label: 'Test first, then fix',
        text: `Bug: addItem accepts a blank quantity and the receipt prints NaN.
Step 1: write a test in shop.test.js (node:test) that describes the correct behaviour: a blank quantity is refused with an error, and nothing is added to the order. Do not change shop.js yet.
Step 2: run \`node --test\` and show me the command and the failing output. It must fail because addItem does not throw.
Step 3: make the smallest fix in shop.js, run \`node --test\` again and show me the passing output.
Step 4: tell me which test would fail if the fix were reverted.`,
      },
      {
        type: 'paragraph',
        text: 'AI tools sometimes write tests that look fine and prove nothing. Watch for five tricks: a test that **always passes** (an assertion that cannot fail); a test that **copies the code’s own calculation**, so it agrees with whatever the code does; a test whose expected value was **edited to match the buggy output** to “fix” a failing run; a test that was **deleted or skipped**; and a test written *after* the fix that **never failed**. The defence is the ritual above, and one extra check: temporarily undo the fix and confirm the test fails again.',
      },
      {
        type: 'warning',
        text: 'If a test fails and the AI’s “fix” is to change the test’s expected value, stop and ask why. Sometimes the test really was wrong, but you should hear the reason and check it against what the program is supposed to do.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A test is a question with a known answer that the computer asks your code every time: “if I give the till a blank quantity, does it refuse?” Answering “yes” (pass) or “no” (fail) takes a second, and you never have to remember to ask. `require` pulls in the tools you need; `const { addItem } = require(\'./shop\')` brings in the function being tested. `const order = []` makes a fresh empty list for each test, so one test cannot mess up another. `assert.throws` is the one that checks the error happens. To run the tests, type `node --test` in the terminal in your project folder. If the terminal shows ✖, something is wrong; ✔ means that check passed. And remember red-then-green: always see it fail first.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** A regression test should name the behaviour (and, where useful, the incident), be deterministic and fast, and fail for exactly one reason. Treat a flaky test as a bug in the test or the code: find the nondeterminism (time, ordering, shared state, the network) instead of adding retries. For parsers and validators, add boundary and property-style cases (blank, whitespace, decimals, negatives, very large values) rather than one example; mutation testing measures whether your tests really catch changes. When one agent writes both the fix and its test they share a blind spot, so have the test written from the spec first, review the test diff separately from the code diff, and have CI run the new test against the pre-fix commit to prove it fails there (fail-before, pass-after). Coverage numbers do not tell you that.',
      },
      {
        type: 'version',
        text: 'Node.js 22’s built-in test runner (node:test, run with node --test) is marked Stable (Stability 2) in the Node.js 22 documentation and works with node:assert; it finds files such as *.test.js by default. Claude Code’s best-practices page advises giving Claude something that comes back pass or fail (a test file, a build, a linter) and asking for evidence: the command it ran and its output, not just “all tests pass”. Codex’s prompting guide gives the example “After the fix, run lint + the smallest relevant test suite. Report the commands and results.” In Copilot Chat in VS Code, /fixTestFailure is listed as “find and fix a failing test”; the available commands vary by IDE and context. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.nodeTest, DOCS.ccBest, DOCS.codexPrompting, DOCS.copilotCheat],
      },
      {
        type: 'takeaways',
        items: [
          'A test runs your code, states what must be true and reports pass or fail, so verification no longer depends on opinion.',
          'Write the test first, watch it fail for the right reason, fix, then watch it pass: red, then green.',
          'The passing test stays as a regression test, and it also rejects patches that only hide the symptom.',
          'Be suspicious of AI tests that always pass, copy the code, were edited to fit the bug or never failed.',
          'Ask the agent for the command it ran and its output, and undo the fix once to check the test notices.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-08-arrange-1',
          kind: 'arrange',
          title: 'Red, then green',
          prompt: 'Put the steps of a test-proven fix in order, first at the top.',
          concept: 'red then green',
          language: 'text',
          solution: [
            'Write a test that describes the correct behaviour of the blank quantity',
            'Run it and watch it fail because addItem does not throw',
            'Make the smallest fix in addItem',
            'Run the test again and watch it pass',
            'Run all the tests and keep the new one as a regression test',
          ],
          reasons: [
            'The test comes first so it can describe what “correct” means before the fix changes the code.',
            'Seeing it fail, for the right reason, proves the test can detect the bug.',
            'Only now change the code, and keep the change small.',
            'The same test turning green is the evidence that the fix works.',
            'Running everything shows nothing else broke; the new test stays to guard against the bug returning.',
          ],
          hints: [
            'Which comes first: the test or the fix?',
            'You must see the test fail before the fix, or you do not know it works.',
            'Order: write test, see it fail, fix, see it pass, run everything and keep it.',
          ],
          explanation: 'A test written first and seen to fail proves the bug is real and the test can catch it. The fix then turns it green, and the test remains as a guard.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-08-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write a tiny test helper',
          prompt: 'Write `expectEqual(label, actual, expected)`. If actual equals expected it prints `PASS <label>`, otherwise it prints `FAIL <label>: expected <expected>, got <actual>`. The calls below should print three lines.',
          concept: 'how a test reports pass or fail',
          language: 'javascript',
          starter: `function expectEqual(label, actual, expected) {
  // print PASS or FAIL as described
}

expectEqual('kape x3', 12 * 3, 36);
expectEqual('blank quantity', Number(''), 1);
expectEqual('sabon x2', 25 * 2, 50);`,
          tests: { kind: 'output', expected: ['PASS kape x3', 'FAIL blank quantity: expected 1, got 0', 'PASS sabon x2'] },
          solution: `function expectEqual(label, actual, expected) {
  if (actual === expected) {
    console.log('PASS ' + label);
  } else {
    console.log('FAIL ' + label + ': expected ' + expected + ', got ' + actual);
  }
}

expectEqual('kape x3', 12 * 3, 36);
expectEqual('blank quantity', Number(''), 1);
expectEqual('sabon x2', 25 * 2, 50);`,
          hints: [
            'Compare actual with expected using three equals signs, and print one of two lines.',
            'Use if (actual === expected) { ... } else { ... }, and join the pieces of text with +.',
            'The FAIL line is \'FAIL \' + label + \': expected \' + expected + \', got \' + actual.',
          ],
          explanation: 'Every test framework boils down to this: compare what you got with what you expected and report. Number(\'\') is 0, so the middle check fails, which is the same kind of surprise as the blank quantity in lesson 7.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-08-scenario-1',
          kind: 'scenario',
          title: 'The AI makes the failing test pass',
          prompt: 'How do you respond?',
          concept: 'tests that prove nothing',
          situation: 'You asked an agent to fix the blank-quantity bug. Its summary says: “All tests pass now.” Looking at the diff, shop.js is unchanged, but in shop.test.js the line `assert.throws(() => addItem(order, \'asin\', \'\'), /whole number/)` is gone.',
          options: [
            { text: 'Reject the change: restore the test, ask the agent to fix addItem instead, and require it to show the test failing before and passing after.', consequence: 'The test goes back to guarding the behaviour you want, and the fix happens in the code where the bug lives.', quality: 'best' },
            { text: 'Accept it, because green means the problem is solved.', consequence: 'The suite is green only because the alarm was removed. The blank quantity still produces NaN receipts.', quality: 'poor' },
            { text: 'Keep the agent’s change but add a new test of your own later.', consequence: 'You have lost the check that was guarding the behaviour, and “later” means the code ships unprotected in the meantime.', quality: 'poor' },
            { text: 'Ask the agent why it removed the assertion, and restore it unless the reason is convincing.', consequence: 'Sensible: hearing the reason is fair. Still, with this diff the code did not change, so you should expect to restore the test and ask for a real fix.', quality: 'acceptable' },
          ],
          hints: [
            'Look at what changed in the diff: the code, or the test?',
            'The test was the alarm; removing it did not fix the fire.',
            'Restore the test and insist the fix is in shop.js, proven by the test.',
          ],
          explanation: 'A green run only means something when the checks are intact. Removing or editing a failing assertion to get green is the classic fake fix: insist on the code change and the red-then-green evidence.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-08-q1',
        prompt: 'Why write the test first and watch it fail before the fix?',
        choices: [
          'Because the test runner refuses to start otherwise',
          'To make the final report look more convincing',
          'It proves the test can actually detect the bug: a test that has never failed has proved nothing',
          'Because failing tests use less memory than passing ones, which keeps the test run fast and cheap on a laptop',
        ],
        answer: 2,
        explanation: 'If a test passes both before and after the fix, it does not tell you anything about the bug. Seeing it fail first shows it is sensitive to the problem.',
      },
      {
        id: 'debugging-with-ai-08-q2',
        prompt: 'The failing run says “Missing expected exception.” What does that tell you?',
        choices: [
          'The test expected addItem to throw for a blank quantity and it returned normally: it failed for the right reason',
          'There is a typo in the test file',
          'Node could not find the shop.js file',
          'The test took too long to run and Node stopped it, so you should raise the timeout and try again until the failure goes away',
        ],
        answer: 0,
        explanation: 'assert.throws wanted an error and none came: that is exactly the bug (a blank quantity was accepted). A failure from a typo or a missing file would say something different.',
      },
      {
        id: 'debugging-with-ai-08-q3',
        prompt: 'Which behaviour should make you suspicious of an AI’s “fix”?',
        choices: [
          'It writes the test before the fix',
          'It shows the command it ran and the output',
          'It runs the whole suite after the change',
          'It edits the test’s expected value to match what the buggy code returns',
        ],
        answer: 3,
        explanation: 'Changing the expectation to match the bug turns the alarm off without fixing anything. The other three behaviours are what you want.',
      },
      {
        id: 'debugging-with-ai-08-q4',
        prompt: 'The `|| 0` patch from lesson 6 still fails the blank-quantity test. What does that show?',
        choices: [
          'Tests are unreliable and should be ignored',
          'The test pins down the behaviour you want (refuse a blank quantity), so it rejects a patch that only hides the symptom',
          'The patch needs a second `|| 0` somewhere',
        ],
        answer: 1,
        explanation: 'The patch changes the receipt, not addItem, so a blank quantity is still accepted. A good test checks the behaviour at the source and therefore catches hiding patches.',
      },
      {
        id: 'debugging-with-ai-08-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a test, in everyday words?',
        choices: [
          'A small program that runs your code, states what the result must be and reports pass or fail',
          'A message your computer sends when it is slow',
          'A second copy of your whole project that is saved automatically every night as a backup on the cloud',
        ],
        answer: 0,
        explanation: 'A test is a question with a known answer that the computer asks your code, so you can check it in a second any time.',
      },
      {
        id: 'debugging-with-ai-08-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent wrote both the fix and its regression test in one commit. How do you establish the test is meaningful?',
        choices: [
          'Check the coverage percentage went up',
          'Trust it, since both came from the same careful model',
          'Run the new test against the pre-fix commit to see it fail, review the test diff separately, and consider writing the test from the spec first',
          'Ask the agent to run the suite again and report whether it still passes',
        ],
        answer: 2,
        explanation: 'Fail-before, pass-after is direct evidence. A test and a fix written together can share the same wrong assumption, and coverage or a repeated green run cannot show that.',
      },
    ],
    task: {
      title: 'Prove a fix with a test',
      minutes: 18,
      steps: [
        'Put the buggy addItem (with `parseInt`) and the shop.test.js from this lesson in a folder. Run `node --test` and confirm one test fails with “Missing expected exception”.',
        'Apply the root-cause fix from lesson 7 and run `node --test` again. Confirm both tests pass.',
        'Prove the test is meaningful: temporarily put the old `parseInt` line back, run the tests and see the failure return, then restore the fix.',
        'Ask an AI to add one more test (for a decimal quantity such as \'2.5\') using the “test first, then fix” prompt. Read the test it wrote and check that it can fail.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain each line of shop.test.js in plain words, then change the expected value in one test on purpose and watch it fail. Change it back.'] },
      { audience: { min: 'advanced' }, steps: ['Add boundary cases for the validator (whitespace, \'0\', \'-1\', \'1e3\', a very long string) and decide for each what the behaviour should be before you run it. Wire `node --test` into a pre-commit hook or CI step.'] },
    ],
  },
  {
    id: 'debugging-with-ai-09',
    day: 9,
    title: 'Troubleshooting data, API and sign-in problems',
    summary: 'Work out which layer of an app is failing (reach, route, request, identity or data) by reading the real response, then brief the AI with it.',
    minutes: 28,
    skills: ['troubleshoot-systems', 'give-evidence'],
    intro: {
      objectives: [
        'Sort a failing request into a layer: reach, route, request shape, identity or data',
        'Read an HTTP status code and the response body to decide where to look',
        'Brief an AI about an API or sign-in problem without exposing a real token',
      ],
      why: 'Apps built with AI usually talk to a database or a server, and most “it doesn’t work” reports there are not bugs in your code but a mismatch between two sides. Looking at what actually travelled between them settles it fast.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Think of an app that talks to a server as a restaurant. You (the app) hand an order to the waiter (the request), who takes it to the kitchen (the server), and a plate (the response) comes back. When dinner goes wrong there are only a few places it can have gone wrong: the restaurant is closed (the server is not running), you went to the wrong door (wrong address), the order form was filled in wrongly (wrong field names), you have no reservation (not signed in), or the plate arrived but is not what you ordered (the data is shaped differently than you expected). Debugging an API problem is working out which of those it is. The skill is the same as before: reproduce, and look at the real evidence, which here is **the actual response**.',
      },
      {
        type: 'paragraph',
        text: 'We built a tiny practice API (its code is in the next lesson) with two routes: `POST /api/login` returns a token for the right email and password, and `GET /api/products` returns the product list but only if you send that token. Then we broke the client in the ways real apps break, and ran everything. Every output below is real.',
      },
      { type: 'heading', text: 'Layer 1: can you reach it?' },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the client ran while the server was not running (trimmed)',
        code: `TypeError: fetch failed
    at node:internal/deps/undici/undici:15141:13
    ... {
  [cause]: AggregateError [ECONNREFUSED]:
    ... {
    code: 'ECONNREFUSED',
    address: '127.0.0.1',
    port: 4010`,
      },
      {
        type: 'paragraph',
        text: '`ECONNREFUSED` means “connection refused”: nothing is listening at that address and port. The server is off, or the port in your code is wrong. There is no status code because there was no answer at all. Notice the useful detail is in the `[cause]`, further down than the first line: read the whole error.',
      },
      { type: 'heading', text: 'Layer 2: did it find the right route?' },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the client asked for /api/product (singular) instead of /api/products',
        code: `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`,
      },
      {
        type: 'paragraph',
        text: 'The client asked for JSON, got a page, and crashed trying to read it. A `<` at the start of something that should be JSON almost always means you received an **HTML page**, and an HTML page from an API almost always means an error page such as “Not Found”. The way to see it is to look at the response itself with `curl -i`, which prints the status line and headers as well as the body:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of: curl -i http://localhost:4010/api/product',
        code: `HTTP/1.1 404 Not Found
Content-Type: text/html

<!DOCTYPE html><html><body><h1>Not Found</h1></body></html>`,
      },
      {
        type: 'paragraph',
        text: 'There it is: **404**, content type `text/html`. The error you saw (`Unexpected token <`) was only the symptom of the wrong path. This is the same lesson as the stack trace: the place a program *crashed* (reading JSON) is not the place the problem *started* (a typo in the URL).',
      },
      { type: 'heading', text: 'Status codes: the first thing to read' },
      {
        type: 'table',
        headers: ['Status', 'In plain words', 'Where to look'],
        rows: [
          ['2xx (200…)', 'It worked.', 'The data in the body, if it is still wrong.'],
          ['400 Bad Request', 'The server could not process the request as sent.', 'The shape of what you sent: field names, types, missing fields.'],
          ['401 Unauthorized', 'In practice “not authenticated”: the server does not know who you are.', 'Is there a token? Is it valid, expired, sent in the right header?'],
          ['403 Forbidden', 'The server knows who you are and refuses.', 'Your permissions or role, not your login.'],
          ['404 Not Found', 'The server cannot find that resource.', 'The URL, spelling, method and the server’s routes.'],
          ['429 Too Many Requests', 'You were rate limited.', 'How fast your code sends requests; slow down and retry later.'],
          ['500 Internal Server Error', 'The server’s own code failed.', 'The server’s log, not your client code.'],
        ],
      },
      { type: 'heading', text: 'Layer 3 and 4: request shape and sign-in' },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the login request sent "username" but the server expects "email"',
        code: `HTTP/1.1 400 Bad Request
{"error":"email is required"}`,
      },
      {
        type: 'paragraph',
        text: 'The server says exactly what it wants. A client that ignores the status and reads the body as if it were a token then has `token` undefined, and the next request is sent with the header `Authorization: Bearer undefined`. Signing in then fails in three different ways, and the **body** tells them apart even though the status is the same 401:',
      },
      {
        type: 'table',
        headers: ['Real response', 'What it means'],
        rows: [
          ['401 `{"error":"missing token"}`', 'No Authorization header was sent at all.'],
          ['401 `{"error":"invalid token"}`', 'A header was sent but the server does not know that token (for example the text “undefined”, or a token from another server).'],
          ['401 `{"error":"token expired"}`', 'The token was real but is too old: sign in again to get a fresh one.'],
          ['401 `{"error":"wrong email or password"}`', 'The login itself failed: check the credentials, not the token.'],
        ],
      },
      { type: 'heading', text: 'Layer 5: the data is not what the code expects' },
      {
        type: 'paragraph',
        text: 'Finally everything succeeds, the server answers 200 with the products, and the client prints `Stock value per item: NaN`. No error, just the lesson 1 symptom again. Print one real record and compare it with what your code reads. The server sends `{ "id": 1, "name": "Kape", "price_php": 12 }`, and the client adds up `product.price`. There is no `price` field (it is called `price_php`), so each addition is `undefined` and the total is NaN. The usual data mismatches are: a **different name**, a **different type** (the text `\'12\'` instead of the number 12, lesson 4), a **missing or null** value, a **different unit** (centavos or pesos?), and a **different shape** (a list inside an object instead of the list itself). `JSON.parse(text)` turns JSON text into JavaScript values, and the record is where you check them.',
      },
      {
        type: 'prompt',
        label: 'Briefing an AI about an API problem (redact tokens first)',
        text: `My client calls GET http://localhost:4010/api/products and then crashes.
Request: GET /api/products with header  Authorization: Bearer <REDACTED>
Response: HTTP 401 with body {"error":"invalid token"}
Error in my client: TypeError: products is not iterable (at client.js line 17, the for...of loop)
Expected: HTTP 200 and a list of products.
What I did before: ran POST /api/login with {"username":"nena@example.com","password":"<REDACTED>"} and kept the "token" from the reply.
Please explain, from the evidence above, why the token is invalid and where the mistake started. Give me the curl command to check each step.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Example AI answer (written for this lesson, not real model output)',
        code: `The crash is a symptom. The 401 body is an object ({"error": ...}), not a
list, so "for...of" fails with "products is not iterable". The real question
is why the token is invalid.

Your login request sends "username", but this API expects "email". The
server probably answered 400 {"error":"email is required"}, so the reply has
no "token" field, your token variable is undefined, and the next request
sends "Authorization: Bearer undefined". The server does not know that
token, hence "invalid token".

Check each step with curl:
  curl -i -X POST http://localhost:4010/api/login \\
    -H 'Content-Type: application/json' \\
    -d '{"email":"nena@example.com","password":"<REDACTED>"}'
Expect 200 and {"token":"..."}. Then call /api/products with that token.`,
      },
      {
        type: 'paragraph',
        text: 'Check the answer the way you check any answer: it uses your evidence (the 401 body and the line of code), it points to an earlier cause than the crash, and it gives commands you can run. We ran this chain for real and the diagnosis was right: sending `email` produced a token, and the products list came back.',
      },
      {
        type: 'warning',
        text: 'Debug authentication without weakening it. If an AI suggests commenting out the token check, “just to see”, say no on any shared or live server: that is an open door, and these changes get committed by accident. Reproduce with a fresh valid token or a local test account instead, and keep real tokens and passwords out of prompts, logs and commits.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** An *API* is a way for one program to ask another program for something, like ordering through a waiter. A *request* is the order and a *response* is what comes back. A *token* is a short secret code, like a wristband at an event, that proves you already signed in; the server checks the wristband each time. *Status codes* are the waiter’s one-word answers: “fine”, “we don’t have that” (404), “who are you?” (401), “you are not allowed in here” (403), “kitchen on fire” (500). To look at a response yourself, you can run `curl -i` followed by the address in the terminal (or open the browser’s *Network* tab in developer tools, which lists every request). `curl` is a small program that makes a request and prints the answer. Whenever you see `NaN` or `undefined`, ask: “what does the data really look like?”, and print one record to check.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Separate transport, protocol and application failures: `ECONNREFUSED` and timeouts are network, a status code is the protocol, and the body is the application. Tie client and server together with a correlation ID sent in a header and logged by both, so one failing request is one filter. Read token problems as data: expiry and not-before claims, clock skew between machines, audience and issuer, and which environment issued the token. Remember that 404 is sometimes used to hide a resource from an unauthorised caller, and that CORS failures only happen in browsers (the console shows them; `curl` is unaffected). Retries need care: a client that retries a `POST` after a timeout can create two orders, so use idempotency keys and back off on 429. Validate responses at the boundary (a schema check that fails loudly) so a renamed field becomes an error at the edge instead of a NaN three layers later, which is the lesson 7 principle applied to data you do not control.',
      },
      {
        type: 'version',
        text: 'MDN groups HTTP status codes into five classes and describes 401 as meaning “unauthenticated” (the client must authenticate) and 403 as the client being known to the server but lacking access rights; 404 can also be used to hide a resource from an unauthorised client; 429 is rate limiting. The Authorization request header carries credentials in the form “<auth-scheme> <parameters>”; the practice API in this course uses the common “Bearer <token>” pattern, which MDN’s page does not itself define. MDN explains that CORS is enforced by browsers for script-initiated cross-origin requests and that the details of a CORS failure are not available to JavaScript, only the browser’s console. fetch is a global in Node.js 22 (no longer experimental since v21). Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.mdnStatus, DOCS.mdnAuth, DOCS.mdnCors, DOCS.nodeGlobals],
      },
      {
        type: 'takeaways',
        items: [
          'An app-to-server problem lives in one layer: reach, route, request shape, identity or data. Find the layer before you change code.',
          'Look at the real response: status code first, then the body. `curl -i` or the Network tab shows both.',
          '401 means the server does not know who you are; 403 means it knows and refuses; 404 usually means the URL; 500 means the server failed.',
          'NaN or undefined after a successful response usually means the data has different field names, types or shape than your code expects.',
          'Never weaken sign-in to debug it, and redact tokens and passwords before sharing evidence with an AI.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-09-match-1',
          kind: 'match',
          title: 'Which layer is it?',
          prompt: 'Each symptom points at a different part of the system. Match it with where to look.',
          concept: 'status codes and layers',
          labels: { terms: 'Symptom', meanings: 'Where to look' },
          pairs: [
            { term: 'Status 403 right after you signed in successfully', definition: 'The server knows who you are but you lack permission: check your role or access rights, not the login', note: '403 means known but refused; 401 is the one that means “who are you?”.' },
            { term: 'Status 500 and a stack trace in the server’s own log', definition: 'The server’s code failed: read the server log instead of the client code', note: '500 means the server could not handle the request; the clue is on the server.' },
            { term: 'Status 429 after a loop sent 200 requests in one second', definition: 'You were rate limited: slow down and retry later', note: '429 is “too many requests in a given time”.' },
            { term: 'A price field arrives as "12" in quotes and the sum prints 0120', definition: 'A number came as text: fix the type at the source or convert it when reading', note: 'Text is joined with +, not added; this is a data type mismatch.' },
          ],
          hints: [
            'For each symptom, ask which side is at fault: the client, the server, the permissions or the data.',
            '403 and 500 and 429 all have a different cause; the quoted price is a data problem.',
            'Pair 403 with permissions, 500 with the server log, 429 with slowing down, and the quoted price with a type mismatch.',
          ],
          explanation: 'Status codes and the shape of the data point at the layer to inspect. Reading the code before reading the response sends you to the wrong place.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-09-predict-output-1',
          kind: 'predict-output',
          title: 'A valid reply that is not what you wanted',
          prompt: 'The server sends back this text and the client reads it with JSON.parse. What does it print?',
          concept: 'error bodies are still valid JSON',
          language: 'javascript',
          code: `const reply = '{"error":"token expired"}';
const data = JSON.parse(reply);
console.log(data.token);
console.log(data.error);`,
          choices: ['undefined\ntoken expired', 'token expired\nundefined', 'null\ntoken expired', 'undefined\nundefined'],
          wrongNotes: {
            'token expired\nundefined': 'The lines are in the other order: the first log reads data.token, which the reply does not contain.',
            'null\ntoken expired': 'A property that is not in the object reads as undefined, not null. null would have to be written in the JSON.',
            'undefined\nundefined': 'The error field is in the reply, so data.error prints its text.',
          },
          hints: [
            'JSON.parse turns the text into an object. What fields does the object have?',
            'Reading a field that is not there gives undefined.',
            'data.token is missing, so undefined; data.error holds “token expired”.',
          ],
          explanation: 'An error reply is perfectly valid JSON, so it parses without complaint, but it has no token field. That is how a failed login quietly becomes “Bearer undefined” in the next request. Always check the status before reading fields from the body.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-09-fix-bug-1',
          kind: 'fix-bug',
          title: 'Read the field the server really sends',
          prompt: 'The server sends products like `{ name: \'Kape\', price_php: 12 }`. This function should add up the prices, but returns NaN. Tap the buggy line and choose the fix.',
          concept: 'data shape mismatch',
          language: 'javascript',
          code: `function totalPrice(products) {
  let total = 0;
  for (const product of products) {
    total = total + product.price;
  }
  return total;
}`,
          bugLine: 4,
          fixes: [
            { line: '    total = total + product.price_php;', correct: true, why: 'The server calls the field price_php, so that is the property to read.' },
            { line: '    total = total + (product.price || 0);', correct: false, why: 'This reads the wrong field and hides the NaN by turning it into 0, so every total is 0. It is the symptom patch from lesson 7.' },
            { line: '    total = total + Number(product.price);', correct: false, why: 'Number(undefined) is still NaN, because the property price does not exist; converting the type does not help when the name is wrong.' },
            { line: '    total = total + product.price_php();', correct: false, why: 'price_php holds a number, not a function, so calling it throws a TypeError.' },
          ],
          tests: {
            kind: 'function',
            fn: 'totalPrice',
            cases: [
              { label: 'two products', args: [[{ name: 'Kape', price_php: 12 }, { name: 'Sabon', price_php: 25 }]], expected: 37 },
              { label: 'one product', args: [[{ name: 'Asin', price_php: 8 }]], expected: 8 },
              { label: 'no products', args: [[]], expected: 0 },
            ],
          },
          lineNote: 'That line is fine. The wrong value comes from the line that reads a field from each product.',
          hints: [
            'Print one product in your head: which field holds the price?',
            'The code reads product.price, but the server sends a field with a different name.',
            'The property is called price_php.',
          ],
          explanation: 'The code and the server disagree about the field name, so product.price is undefined and the sum is NaN. Reading the field the server actually sends fixes it at the source. The other options either hide the problem or change the wrong thing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-09-scenario-1',
          kind: 'scenario',
          title: 'Skip the token check “to test”',
          prompt: 'How do you respond?',
          concept: 'safe troubleshooting of sign-in',
          situation: 'Your app’s products request fails with 401 {"error":"invalid token"}. The AI says: “Let’s comment out the token check on the server for a minute to see whether the rest works.” The server is the shared one your teammates also use.',
          options: [
            { text: 'Say no. Get the exact status and body, log in with curl to get a fresh token, and use it in the request to find where the real token goes wrong.', consequence: 'You find the cause (the login field name) with the check still in place, and nobody’s data was ever exposed.', quality: 'best' },
            { text: 'Allow it on the shared server, but only for five minutes.', consequence: 'During those minutes anyone can read the data, and a temporary change that gets committed or forgotten is a classic way real breaches begin.', quality: 'poor' },
            { text: 'Allow it only on your own laptop copy of the server, and revert it before committing.', consequence: 'Acceptable for local debugging, but it tells you only that the rest works: it still does not explain why the token is invalid, and the revert is easy to forget.', quality: 'acceptable' },
            { text: 'Paste your real token into the chat and ask the AI to decode it.', consequence: 'A real token works like a password. Pasting it into a chat gives away access, and it still does not explain why the server rejects it.', quality: 'poor' },
          ],
          hints: [
            'Which option keeps sign-in switched on?',
            'The status and the body already say “invalid token”: the question is why the token is invalid.',
            'Reproduce with a fresh token via curl instead of removing the check.',
          ],
          explanation: 'Debug authentication with real evidence and a fresh token; do not remove the protection. A weakened check on a shared server is a security hole, and it would not have explained the bug anyway.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-09-q1',
        prompt: 'Your client crashes with `SyntaxError: Unexpected token \'<\', "<!DOCTYPE "... is not valid JSON`. What does this most likely mean?',
        choices: [
          'The server sent JSON with a missing comma',
          'The server sent back an HTML page (often a 404 Not Found) where the client expected JSON',
          'The client is using the wrong version of Node.js',
          'The token has expired, so the server sent back a login page that your client could not read as data',
        ],
        answer: 1,
        explanation: 'A leading < means the body is HTML, which an API sends for error pages. Run curl -i on the same URL and read the status line to confirm.',
      },
      {
        id: 'debugging-with-ai-09-q2',
        prompt: 'What is the difference between 401 and 403?',
        choices: [
          '401 means the server crashed and 403 means a typo in the URL',
          '401 means too many requests and 403 means a missing field',
          'They are the same code reported by different browsers',
          '401: the server does not know who you are; 403: it knows who you are and refuses',
        ],
        answer: 3,
        explanation: 'MDN describes 401 as “unauthenticated” and 403 as the client being known but lacking access rights. The fix differs: sign in properly for 401, change permissions for 403.',
      },
      {
        id: 'debugging-with-ai-09-q3',
        prompt: 'Your client prints `TypeError: fetch failed` with a cause code of `ECONNREFUSED`. Where do you look first?',
        choices: [
          'Whether the server is running and the address and port in your code are correct',
          'Whether the response body has the right field names and the right types for each of the fields',
          'Whether the token has expired',
          'The server’s database tables',
        ],
        answer: 0,
        explanation: 'ECONNREFUSED means nothing answered at that address and port, so no status code, route, token or data was ever involved yet.',
      },
      {
        id: 'debugging-with-ai-09-q4',
        prompt: 'The AI proposes disabling the token check on the shared server to “see if it works”. What is the best response?',
        choices: [
          'Agree, but ask it to re-enable the check after five minutes',
          'Agree, as long as you use a private chat window',
          'Decline, and reproduce with the exact status and body and a fresh valid token to find where the real token goes wrong',
          'Delete the authentication code from the project to be safe',
        ],
        answer: 2,
        explanation: 'The protection is not the bug. Debug with a fresh token and the real response; weakening the check on a shared server is an open door and does not explain the 401.',
      },
      {
        id: 'debugging-with-ai-09-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what does a 404 status mean?',
        choices: [
          'The server has crashed completely and every request will fail until someone restarts it',
          'The server could not find what you asked for, often because the address is wrong',
          'You need to sign in first',
        ],
        answer: 1,
        explanation: '404 means “not found”: the address, spelling or method does not match anything the server has.',
      },
      {
        id: 'debugging-with-ai-09-q6',
        audience: { min: 'advanced' },
        prompt: 'A mobile client retries `POST /orders` after a timeout, and customers occasionally get two orders. Which design prevents it?',
        choices: [
          'An idempotency key sent with the request, so the server returns the first result for a repeated key instead of creating a second order',
          'Retrying faster so the first request has no time to finish',
          'Removing the timeout from the client',
          'Switching the request from POST to GET',
        ],
        answer: 0,
        explanation: 'A timeout does not tell the client whether the server processed the request. An idempotency key makes a retry safe. GET is for reads, and removing the timeout just hides the failure.',
      },
    ],
    task: {
      title: 'Read the real response',
      minutes: 20,
      steps: [
        'Run the practice server from lesson 10 (`node server.js`). In another terminal run `curl -i http://localhost:4010/api/products` and read the status line and body.',
        'Log in with curl (`POST /api/login` with the email and password), copy the token, and call `/api/products` with `-H "Authorization: Bearer <token>"`. Then try a wrong path and an old token and note each status and body.',
        'Pick one of those failures and write the briefing prompt for an AI (request, response, error, expected, what you did), with the token redacted.',
        'Run the AI’s check commands and write down whether its diagnosis matched what you saw.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain each part of the curl command you ran (the -i, the -H and the address) in plain words, and write the one-sentence explanation in your notes.'] },
      { audience: { min: 'advanced' }, steps: ['Add a correlation ID header to the client, log it on the server, and use it to find one failing request in the combined output. Add a schema check on the response so a renamed field fails loudly at the edge.'] },
    ],
  },
  {
    id: 'debugging-with-ai-10',
    day: 10,
    title: 'Project: rescue three broken apps',
    summary: 'Put the whole loop to work on three small broken apps, and finish each with a test or check and a written root-cause note.',
    minutes: 30,
    skills: ['debug-loop', 'root-cause', 'prove-fix', 'safe-undo'],
    intro: {
      objectives: [
        'Follow one rescue routine from restore point to root-cause note on three different broken apps',
        'Recreate each broken app exactly, so your evidence matches the real symptoms',
        'Turn what you learned into your own debugging checklist and instructions file',
      ],
      why: 'A debugging method only becomes yours when you use it on something that is actually broken. This project gives you three real failures and a checklist you can carry into every AI project you build afterwards.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'This is the course project. You will rescue three small broken apps: a web page, a script and an API with its client. Every one of them was built and broken while this course was written, and every symptom described below is what we really saw. Each app has several bugs, and the first bug hides the next, so you cannot just ask an AI to “fix everything”: you have to run the loop from lesson 1 again and again. For each app you finish with a fix you can prove (a check that fails before and passes after) and a short written **root-cause note**. The lesson gives you the full code of the broken apps, the routine, the note template, and the last step: turning all this into your own checklist.',
      },
      { type: 'heading', text: 'The rescue routine' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Restore point.** Commit or copy the project as it is, so every AI edit can be undone (lesson 6).',
          '**Reproduce and decide “right”.** Run the app, write down the steps and the answer it should give (lesson 1).',
          '**Read the evidence.** The exact error, stack trace or response, and which layer it points to (lessons 2 and 9).',
          '**Brief the AI.** Error, relevant code, steps, expected versus actual, secrets redacted (lesson 3). Ask for the cause before the fix.',
          '**Fix at the source.** One change at a time, read the diff, and reproduce again before the next bug (lessons 4 and 7).',
          '**Prove it.** A test or check that fails before the fix and passes after (lesson 8).',
          '**Write the note.** Symptom, root cause, fix, proof, how you will notice if it returns.',
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The routine for each app. Because bugs hide behind bugs, the loop repeats until the expected answer appears.',
        source: `flowchart TD
  P[Restore point: commit or copy] --> R[Reproduce and write the expected answer]
  R --> E[Read the real error or response]
  E --> B[Brief the AI with the four pieces of evidence]
  B --> F[Fix at the source and read the diff]
  F --> V{Expected answer now?}
  V -->|no: next bug appears| R
  V -->|yes| T[Add a test or check, then write the note]
  T --> D(Next app)`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Root-cause note template (one per app, about 5 lines)',
        code: `App: <name>
Symptom: what I saw, with the exact error or output
Root cause: the earliest thing that went wrong, and why it was allowed
Fix: what I changed (file and line) and why this is the source, not a mask
Proof: the test or command that failed before and passes after
Prevention: how I would notice if it came back`,
      },
      { type: 'heading', text: 'App A: the coffee page (HTML and JavaScript)' },
      {
        type: 'paragraph',
        text: 'Create a folder `coffee-page` with these two files. Open `index.html` in Chrome. **Expected behaviour:** a heading, two drinks with Add buttons, a total that goes from 0 to 130 when you click Add on Barako and then on Iced Latte, and a Clear order button that sets the total back to 0. **What we saw:** first an empty list and `Uncaught TypeError: Cannot read properties of null (reading \'appendChild\')` at app.js:20; after that was fixed, the total showed `04585`; after that was fixed, the Clear button set the total to 0 internally but the page kept showing the old number. Three bugs, three root causes. (The third is new: ask yourself which two places hold the total, and which one the Clear button forgot.)',
      },
      {
        type: 'code',
        language: 'html',
        label: 'coffee-page/index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Kape ni Aling Nena</title>
  <script src="app.js"></script>
</head>
<body>
  <h1>Kape ni Aling Nena</h1>
  <ul id="menu"></ul>
  <p>Order total: PHP <span id="total">0</span></p>
  <button id="clear">Clear order</button>
</body>
</html>`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'coffee-page/app.js',
        code: `const drinks = [
  { name: 'Barako', price: '45' },
  { name: 'Iced Latte', price: '85' },
];

const menu = document.getElementById('menu');
const totalLabel = document.getElementById('total');
let total = 0;

for (const drink of drinks) {
  const item = document.createElement('li');
  item.textContent = drink.name + ' - PHP ' + drink.price + ' ';
  const button = document.createElement('button');
  button.textContent = 'Add';
  button.addEventListener('click', function () {
    total = total + drink.price;
    totalLabel.textContent = total;
  });
  item.appendChild(button);
  menu.appendChild(item);
}

document.getElementById('clear').addEventListener('click', function () {
  total = 0;
});`,
      },
      { type: 'heading', text: 'App B: the receipt script (Node.js)' },
      {
        type: 'paragraph',
        text: 'Create a folder `receipt-script` with these two files. Run `node run.js blank`, `node run.js unknown` and `node run.js discount`. **Expected behaviour:** `blank` refuses the blank quantity with a clear message naming the item; `unknown` fails with a clear message naming the item that has no price (the order contains `Sabon`, not `sabon`); `discount` prints `Before discount: PHP 86` and `After 10% discount: PHP 77.4`. **What we saw:** `Total: PHP NaN`; a `TypeError: Cannot read properties of undefined (reading \'toFixed\')` at shop.js:9; and `After 10% discount: PHP -774`. Write a `node:test` file for the fixes (lesson 8), starting with a failing test for each.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'receipt-script/shop.js',
        code: `const prices = { kape: 12, asin: 8, sabon: 25 };

function addItem(order, name, qtyText) {
  order.push({ name: name, qty: parseInt(qtyText) });
}

function lineTotal(item) {
  const price = prices[item.name];
  return Number(price.toFixed(2)) * item.qty;
}

function receiptTotal(order) {
  let total = 0;
  for (const item of order) {
    total = total + lineTotal(item);
  }
  return total;
}

function applyDiscount(total, percent) {
  return total - total * percent;
}

module.exports = { addItem, receiptTotal, applyDiscount };`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'receipt-script/run.js',
        code: `const { addItem, receiptTotal, applyDiscount } = require('./shop');

const scenario = process.argv[2];
const order = [];

if (scenario === 'blank') {
  addItem(order, 'kape', '3');
  addItem(order, 'sabon', '2');
  addItem(order, 'asin', '');
  console.log('Total: PHP ' + receiptTotal(order));
} else if (scenario === 'unknown') {
  addItem(order, 'kape', '3');
  addItem(order, 'Sabon', '2');
  console.log('Total: PHP ' + receiptTotal(order));
} else if (scenario === 'discount') {
  addItem(order, 'kape', '3');
  addItem(order, 'sabon', '2');
  const total = receiptTotal(order);
  console.log('Before discount: PHP ' + total);
  console.log('After 10% discount: PHP ' + applyDiscount(total, 10));
} else {
  console.log('Usage: node run.js blank | unknown | discount');
}`,
      },
      { type: 'heading', text: 'App C: the products API and its client (Node.js)' },
      {
        type: 'paragraph',
        text: 'Create a folder `products-api` with these two files. In one terminal run `node server.js` (it prints `API listening on http://localhost:4010`; if that port is busy on your machine, change both files to another number). In a second terminal run `node client.js`. The server only accepts the login `nena@example.com` with the password `secret`. **Expected behaviour:** the client signs in, fetches the products and prints `Price of one of each: PHP 37`. **What we saw, in this order:** `SyntaxError: Unexpected token \'<\', "<!DOCTYPE "... is not valid JSON`; then, after fixing that, `TypeError: products is not iterable`; then, after fixing that, `Price of one of each: PHP NaN`. Only the client is broken; the server is correct, so use curl (lesson 9) to see what it really sends. Write a small check script that runs the client, compares its output with the expected line and exits with an error if it differs.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'products-api/server.js (correct; do not change it)',
        code: `const http = require('http');

const products = [
  { id: 1, name: 'Kape', price_php: 12 },
  { id: 2, name: 'Sabon', price_php: 25 },
];
const sessions = new Map(); // token -> expiry time (ms)
sessions.set('old-token-123', Date.now() - 60_000); // already expired

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data ? JSON.parse(data) : {}));
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/login') {
    const body = await readBody(req);
    if (!body.email) return send(res, 400, { error: 'email is required' });
    if (body.password !== 'secret') return send(res, 401, { error: 'wrong email or password' });
    const token = 'tok-' + Math.random().toString(36).slice(2, 8);
    sessions.set(token, Date.now() + 60_000);
    return send(res, 200, { token });
  }
  if (req.method === 'GET' && req.url === '/api/products') {
    const auth = req.headers.authorization || '';
    const token = auth.replace('Bearer ', '');
    if (!auth) return send(res, 401, { error: 'missing token' });
    if (!sessions.has(token)) return send(res, 401, { error: 'invalid token' });
    if (sessions.get(token) < Date.now()) return send(res, 401, { error: 'token expired' });
    return send(res, 200, products);
  }
  send(res, 404, '<!DOCTYPE html><html><body><h1>Not Found</h1></body></html>', 'text/html');
});

server.listen(4010, () => console.log('API listening on http://localhost:4010'));`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'products-api/client.js (broken)',
        code: `const BASE = 'http://localhost:4010';

async function main() {
  const login = await fetch(BASE + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'nena@example.com', password: 'secret' }),
  });
  const { token } = await login.json();

  const res = await fetch(BASE + '/api/product', {
    headers: { Authorization: 'Bearer ' + token },
  });
  const products = await res.json();

  let total = 0;
  for (const product of products) {
    total = total + product.price;
  }
  console.log('Price of one of each: PHP ' + total);
}

main();`,
      },
      {
        type: 'warning',
        text: 'The server’s password and token are practice values. In your own prompts, still replace them with `<REDACTED>`: make it a habit now, while it is safe to get it wrong.',
      },
      { type: 'heading', text: 'Make it yours: a debugging checklist and an instructions file' },
      {
        type: 'paragraph',
        text: 'The last step is the one that outlasts this course. Take what you have learned and write it down where your AI tools will see it every time. A coding agent starts each session knowing nothing about how *you* debug; an **instructions file** in your project folder tells it. Keep it short and specific. This is a starting point to copy and adapt:',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'Debugging rules for your instructions file (adapt the commands)',
        code: `## Debugging rules
- Reproduce first: run the failing command and show me the exact output before changing anything.
- Tell me the expected result and how you will check it. Do not say "fixed" without the command you ran and its output.
- Explain the root cause in terms of the evidence (error, line, response). Do not hide a symptom with a fallback such as "|| 0", an empty catch, or a loosened test.
- Write a failing test first when the project has tests (node --test). Never edit a test just to make it pass.
- Make small changes, one bug at a time. Show me the diff.
- After two failed attempts, stop and ask me for more evidence instead of trying a third patch.
- Never print or log secrets or personal data.`,
      },
      {
        type: 'paragraph',
        text: 'Then keep a one-page personal checklist beside it: the four pieces of evidence, the layers of an API problem, the symptom-hiding red flags, and your own two or three favourite prompts from this course. Reading it before you ask for help is a thirty-second habit that will save you hours.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**If this feels big, start small.** Do App A first: it is one page and you can *see* every fix. Take each bug in turn and say out loud what you expect before you change anything. If you are stuck on a word in the code, ask the AI: “Explain this line to me in plain words, and do not change it.” Reading the code with the AI’s help is part of the learning. You do not need to write the code yourself: you need to describe the bug clearly, check each fix, and keep a restore point. For the check on App A, clicking the buttons and comparing the numbers with 130 and 0 is enough. An *instructions file* is simply a text file called `CLAUDE.md` or `AGENTS.md` where you write the rules you want an AI assistant to follow in your project.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Run one of the rescues as an agent-assisted workflow and keep the evidence a reviewer would want: the failing reproduction (command and output) before the first edit, the hypotheses the agent proposed and which checks ruled them out, the diff reviewed in small commits, a regression test shown failing against the pre-fix commit, and a root-cause note that names the missing guardrail. Use `git bisect run` on App B or C if you introduce the bugs in separate commits. Ask a fresh-context reviewer (a second agent or a separate session) to critique the fix against the root-cause note rather than against the agent’s own summary. Then encode the lessons: a pre-commit or CI step that runs the checks, and the rules above in the instructions file, scoped to the project.',
      },
      {
        type: 'version',
        text: 'Claude Code reads project instructions from CLAUDE.md (in the project root or .claude/) at the start of every session; its docs say to target under 200 lines per file and that the more specific and concise the instructions, the more consistently Claude follows them, and that they are context rather than enforced configuration (a hook is used to block an action). Claude Code can also read a repository’s AGENTS.md. Codex reads AGENTS.md files before doing any work, from a global location and from the project root down to the working directory, with files closer to the current directory taking precedence, and caps the combined size by default. Checked against the Claude Code and Codex documentation on this date; file names, limits and locations change.',
        checked: CHECKED,
        sources: [DOCS.ccMemory, DOCS.codexAgentsMd],
      },
      {
        type: 'takeaways',
        items: [
          'The same routine rescues any small app: restore point, reproduce, read the evidence, brief the AI, fix at the source, prove it, write the note.',
          'Bugs hide behind bugs: fix one, reproduce again, and expect the next symptom.',
          'Every rescue ends with a check that fails before and passes after, and a root-cause note a teammate could act on.',
          'Write your rules into an instructions file and keep a one-page checklist so the habits survive past this course.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-10-arrange-1',
          kind: 'arrange',
          title: 'Put the rescue routine in order',
          prompt: 'Arrange the seven steps of the rescue routine, first at the top.',
          concept: 'the rescue routine',
          language: 'text',
          solution: [
            'Commit or copy the project to make a restore point',
            'Reproduce the failure and write down the expected result',
            'Read the real error or response and decide which layer it points to',
            'Brief the AI with the error, the code, the steps and the expected result',
            'Apply one fix at the source, read the diff and rerun the reproduction',
            'Add a test or check that fails before the fix and passes after',
            'Write the root-cause note',
          ],
          reasons: [
            'Safety comes first: nothing the AI does can then cost you the working copy.',
            'You cannot verify what you cannot reproduce, and “right” must be known in advance.',
            'The evidence decides which layer to look at, before any code changes.',
            'Only with the evidence in hand can the AI give a grounded answer.',
            'One change at a time, with the diff read, and the same reproduction as the proof.',
            'The test turns the fix into evidence that stays.',
            'The note records the cause and the guardrail while you still remember them.',
          ],
          hints: [
            'What must exist before an AI is allowed to edit anything?',
            'You need to see and understand the failure before you ask for help, and prove the fix before you write it up.',
            'Order: restore point, reproduce, evidence, brief, fix, prove, note.',
          ],
          explanation: 'Restore point, reproduce, read the evidence, brief the AI, fix one thing and read the diff, prove it with a test, then write it down. Each step makes the next one safe and checkable.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'debugging-with-ai-10-scenario-1',
          kind: 'scenario',
          title: 'Which root-cause note would you accept?',
          prompt: 'Choose the best note for App A’s first bug.',
          concept: 'root-cause note',
          situation: 'A teammate rescued the coffee page and hands you three versions of their note for the first bug (the empty drink list). You can only keep one in the project.',
          options: [
            { text: 'Symptom: empty list, TypeError reading appendChild at app.js:20. Root cause: app.js ran in the head before the <ul id="menu"> existed, so getElementById returned null. Fix: added defer to the script tag. Proof: reload shows two drinks and a clean console. Prevention: a browser test that loads the page and checks the list.', consequence: 'It names the symptom with the exact error, the real cause (loading order), the fix, evidence and how to notice a return. A teammate could act on it.', quality: 'best' },
            { text: 'Fixed the list bug by adding defer.', consequence: 'It says what changed but not why it was broken, so nobody learns when defer is needed or how to recognise the problem again.', quality: 'poor' },
            { text: 'The list was empty because the JavaScript did not work properly. Fixed the script.', consequence: 'Vague on every point: no error, no cause, no proof. It cannot be checked or learned from.', quality: 'poor' },
            { text: 'Symptom: empty list. Root cause: null menu. Fix: defer.', consequence: 'Better, but “null menu” stops at the effect: it does not say why menu was null, and there is no proof or prevention.', quality: 'acceptable' },
          ],
          hints: [
            'A good note answers: what was seen, why it happened, what changed, how it was proven, how to notice a return.',
            'Look for the note that gives the cause (why menu was null) and not just the effect.',
            'Look for the note that covers all five: symptom, root cause, fix, proof and prevention.',
          ],
          explanation: 'A root-cause note exists so the cause is learned, not just patched. It should give the exact symptom, the earliest cause, the fix, the proof, and the guardrail.',
        },
      },
    ],
    quiz: [
      {
        id: 'debugging-with-ai-10-q1',
        prompt: 'Which belongs in a good root-cause note?',
        choices: [
          'A promise that the AI will not make the same mistake',
          'The exact symptom, the earliest cause, the fix, how it was proven and how a return would be noticed',
          'The full conversation with the AI, copied in word for word and including every failed attempt, so nothing is ever lost',
          'Only the file name and the lines that changed',
        ],
        answer: 1,
        explanation: 'A note should let a teammate understand and verify the fix without reading the chat. The conversation and a file list do not say why it broke or how it was proven.',
      },
      {
        id: 'debugging-with-ai-10-q2',
        prompt: 'In App C, after fixing the path you see `TypeError: products is not iterable`. What is the best next step?',
        choices: [
          'Ask the AI to wrap the loop in try/catch so it stops crashing',
          'Convert products to an array before the loop',
          'Add `|| []` after products.json()',
          'Print or curl the real response: it is probably an error object from the server, which points at the token or the login',
        ],
        answer: 3,
        explanation: 'The crash is the symptom: the response is an object, not a list. The status and body say why (an invalid token), and that leads back to the login request. The first three options hide the symptom.',
      },
      {
        id: 'debugging-with-ai-10-q3',
        prompt: 'In App A, Clear sets `total = 0` but the page still shows the old number. What is the root cause?',
        choices: [
          'defer was applied to the wrong script',
          'The prices are still text',
          'The total lives in two places (the variable and the label on the page) and Clear only changes one of them',
          'The browser cached an old copy of app.js, so it keeps running the version from before the fix and showing old totals',
        ],
        answer: 2,
        explanation: 'The click handler for Add updates the variable and the label, but Clear updates only the variable. Two copies of the same fact drifted apart; the fix updates the label too (or derives it from one source).',
      },
      {
        id: 'debugging-with-ai-10-q4',
        prompt: 'What belongs in a short debugging section of an instructions file for an AI agent?',
        choices: [
          'Concrete rules: reproduce first, show the command and its output, explain the root cause, never hide a symptom, stop after two failed attempts',
          'A long essay about your philosophy of software quality',
          'Your passwords and API keys, so the agent can test properly',
          'The names of every bug you have ever fixed',
        ],
        answer: 0,
        explanation: 'Instructions work best when they are short, specific and about behaviour you want every session. Secrets never belong in the file, and a long list of old bugs buries the rules.',
      },
      {
        id: 'debugging-with-ai-10-q5',
        audience: { max: 'beginner' },
        prompt: 'You feel overwhelmed by three broken apps. Where is the best place to start?',
        choices: [
          'With the biggest and hardest one, so that the hard part is out of the way before you try any of the others',
          'With App A, the single web page, fixing one bug at a time and saying what you expect before each change',
          'By asking an AI to rewrite all three from scratch',
        ],
        answer: 1,
        explanation: 'A small app where you can see each fix builds the habit. The loop is the same for every app, so you can repeat it on the others.',
      },
      {
        id: 'debugging-with-ai-10-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent returns a fix for App B with the summary “all tests pass”. What evidence do you require before merging?',
        choices: [
          'A longer, more detailed summary from the agent',
          'The agent’s statement of confidence on a scale of one to ten',
          'The reproduction failing before the first edit, the new test shown failing on the pre-fix commit, the reviewed diff, and a root-cause note naming the guardrail',
          'Nothing more: passing tests are enough',
        ],
        answer: 2,
        explanation: 'Evidence an independent party can check beats assertions. Without the failing-before proof and the diff review, “all tests pass” could mean the tests changed or never failed.',
      },
    ],
    task: {
      title: 'Rescue app A and write your note',
      minutes: 20,
      steps: [
        'Create the coffee-page folder, commit it (or copy it), and reproduce the first failure in Chrome. Write down the three expected behaviours (list, 130, Clear back to 0).',
        'Send the AI a strong prompt for bug 1. Read the diff, apply the fix, reproduce again. Repeat for bugs 2 and 3.',
        'Write the root-cause note for each of the three bugs using the template.',
        'Then start App B or App C when you are ready: they are the course project below.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain the third bug (Clear) in plain words, with an everyday example of two notebooks that should always say the same thing. Then write the note yourself in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Commit the three bugs separately and bisect to each. Ask a fresh-context reviewer to critique your root-cause notes against the diffs.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'debugging-with-ai-p1',
    title: 'Rescue three broken apps',
    summary: 'Recreate the three broken apps from lesson 10 (a web page, a receipt script and an API with its client), rescue each one with an AI assistant using the full debugging loop, and write a root-cause note for each.',
    outcome: 'A repository showing three real failures taken from symptom to proven fix, with the evidence, the tests and the written root-cause notes: the proof that you can direct an AI through debugging instead of hoping.',
    unlockAfterDay: 9,
    steps: [
      { id: 'debugging-with-ai-p1-s1', text: 'Create the three folders from lesson 10 (coffee-page, receipt-script, products-api). Put them in one Git repository and commit them as they are, so every change after that has a restore point. For each app write down the expected behaviour in a file called EXPECTED.md.' },
      { id: 'debugging-with-ai-p1-s2', text: 'Rescue App A, the coffee page. For each of its three bugs: reproduce it in Chrome and copy the exact console error (or note the wrong result), send an AI a prompt with the four pieces of evidence, read the diff, apply one fix and reproduce again before the next bug. Verify with 130 after Barako and Iced Latte, and 0 after Clear.' },
      { id: 'debugging-with-ai-p1-s3', text: 'Rescue App B, the receipt script. Write a failing node:test test for each of its three problems first (blank quantity, unknown item, discount), show each failing, then fix at the source and show the tests passing. Discount of 10% on 86 must print 77.4.' },
      { id: 'debugging-with-ai-p1-s4', text: 'Rescue App C, the products client. Use curl -i to read the server’s real responses, brief the AI with redacted evidence, and fix the client one bug at a time until it prints `Price of one of each: PHP 37`. Add a small check script that runs the client and exits with an error if the output differs.' },
      { id: 'debugging-with-ai-p1-s5', text: 'Write one root-cause note per app using the lesson 10 template, covering each bug in it: the exact symptom, the earliest cause, the fix, the proof and how you would notice a return. Add your final diff history so a reviewer can see each fix as a separate commit.' },
      { id: 'debugging-with-ai-p1-s6', audience: { max: 'beginner' }, text: 'You may rescue App A and App B only, and ask the AI to explain each fix line by line before you accept it. Write the root-cause notes in your own words, and for App B you may keep the tests to the blank-quantity case.' },
      { id: 'debugging-with-ai-p1-s7', audience: { min: 'advanced' }, text: 'Introduce the bugs in separate commits in App B and App C and locate each with git bisect run and a check script. Run one of the rescues with a coding agent and keep its evidence: the failing reproduction, the hypotheses it ruled out, the reviewed diffs and a test shown failing on the pre-fix commit.' },
    ],
    submission: {
      kind: 'url',
      label: 'Repository link',
      placeholder: 'https://github.com/yourname/debugging-rescue',
      hint: 'A repository with the three folders, EXPECTED.md, the tests and check script, a root-cause note per app, and a commit history that shows the restore point and each fix.',
    },
    rubric: [
      'Each rescued app produces its expected result (130 and Clear back to 0; the refusal messages and 77.4; PHP 37).',
      'The prompts and notes show the four pieces of evidence (exact error, code, steps, expected versus actual), with no secrets pasted.',
      'Every fix is at the source of the problem: no fallbacks such as || 0, empty catch blocks, loosened tests or disabled checks.',
      'Each app has a test or check that was shown failing before the fix and passing after.',
      'Each app has a root-cause note with symptom, root cause, fix, proof and prevention, and the commit history shows a restore point.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['Apps A and B are rescued, and the notes explain each cause in the learner’s own words rather than copied from the AI.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['All three apps are rescued, with automated checks for B and C, and every prompt has its token and password redacted.'] },
      { audience: { min: 'advanced' }, items: ['Bugs were located with git bisect and fixes are small, separate commits.', 'The evidence from an agent-assisted run is included: the failing reproduction, the ruled-out hypotheses, the reviewed diff and a fail-before, pass-after test.'] },
    ],
  },
  {
    id: 'debugging-with-ai-p2',
    title: 'Your debugging kit',
    summary: 'Write the checklist, the instructions-file section and the three prompt templates you will use every time something breaks, and test them on a real bug in one of your own projects.',
    outcome: 'A reusable kit that makes any AI assistant or coding agent debug your way: proof that you have turned a course into a working habit.',
    unlockAfterDay: 8,
    steps: [
      { id: 'debugging-with-ai-p2-s1', text: 'Write a one-page personal checklist: the four pieces of evidence, the layers of an API problem, the symptom-hiding red flags, and the red-then-green test routine, in your own words.' },
      { id: 'debugging-with-ai-p2-s2', text: 'Write a debugging section for an instructions file (CLAUDE.md or AGENTS.md) from the lesson 10 starting point, adapted to a real project of yours, and commit it.' },
      { id: 'debugging-with-ai-p2-s3', text: 'Write three prompt templates with blanks to fill in: the evidence prompt, the root-cause prompt and the fresh-start prompt. Use each one on a real bug (or on one of the lesson apps) and note what the AI did differently from a vague request.' },
      { id: 'debugging-with-ai-p2-s4', audience: { min: 'advanced' }, text: 'Add a check that the rules can lean on: a test command in the instructions file, a pre-commit or CI step that runs it, and a stop condition for unattended agent runs (attempts, what to report, what not to touch).' },
    ],
    submission: {
      kind: 'text',
      label: 'Your debugging kit',
      placeholder: 'Paste your checklist, your instructions-file section and your three prompt templates, with one example of each used on a real bug.',
      hint: 'The checklist, the instructions section, three templates with blanks, and a short note on what changed when you used them.',
    },
    rubric: [
      'The checklist covers the four pieces of evidence, the API layers, the symptom-hiding red flags and the red-then-green routine.',
      'The instructions section is short and specific (reproduce first, show command and output, root cause not symptom, stop after two failed attempts) and contains no secrets.',
      'The three templates are reusable, with clear blanks, and each was tried on a real bug.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The checklist uses plain words the learner can follow without looking anything up.'] },
      { audience: { min: 'advanced' }, items: ['The kit includes an automated check and a stop condition for agent runs, and says how the rules are enforced rather than only requested.'] },
    ],
  },
];

export const debuggingWithAiCourse: Course = {
  id: 'debugging-with-ai',
  kind: 'standard',
  title: 'Debugging and Troubleshooting with AI',
  level: 'beginner',
  tagline: 'Fix broken apps with AI: reproduce, isolate, fix and prove the fix.',
  description:
    'AI builds things quickly and breaks them just as quickly. In this course you learn the loop that fixes anything: reproduce the bug, isolate it, fix it at its root and prove the fix. You practise on real broken apps (a web page, a script and an API) and learn what evidence to give an AI, how to stop it going in circles and how to make it show proof.',
  finishLine: [
    'Three rescued apps (a web page, a script and an API client), each with a proven fix and a written root-cause note',
    'A debugging routine you can run on any AI-built project: reproduce, isolate, fix and verify',
    'Strong debugging prompts that give an AI the exact error, code, steps and expected result, with secrets redacted',
    'A personal checklist and an instructions-file section that make an AI agent debug by your rules',
  ],
  objectives: [
    'Apply the reproduce, isolate, fix and verify loop to a broken program',
    'Read error messages and stack traces to find the kind, the message and the place',
    'Write debugging prompts that give an AI the evidence it needs without exposing secrets',
    'Break an AI out of a loop by undoing safely and restarting with better evidence',
    'Find a root cause instead of hiding a symptom, and prove the fix with a test',
    'Troubleshoot data, API and sign-in problems by reading the real response',
  ],
  audiences: ['builder', 'career-changer', 'fresh-grad', 'experienced-dev'],
  skills: [
    { id: 'debug-loop', label: 'The debugging loop: reproduce, isolate, fix, verify' },
    { id: 'read-errors', label: 'Reading error messages and stack traces' },
    { id: 'give-evidence', label: 'Giving the AI the evidence it needs' },
    { id: 'web-debugging', label: 'Debugging a broken web page with the console' },
    { id: 'logging', label: 'Logs and the console' },
    { id: 'break-loops', label: 'Breaking AI loops' },
    { id: 'root-cause', label: 'Finding the root cause, not the symptom' },
    { id: 'prove-fix', label: 'Proving a fix with a test' },
    { id: 'troubleshoot-systems', label: 'Troubleshooting data, API and sign-in problems' },
    { id: 'safe-undo', label: 'Version control as undo, and reading the diff' },
  ],
  lessons,
  projects,
  icon: 'bug_report',
  updated: '2026-11-14',
};
