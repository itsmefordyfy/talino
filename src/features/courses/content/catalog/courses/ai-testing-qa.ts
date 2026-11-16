import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * AI-Assisted Testing and Quality Assurance. Every example in these lessons runs on one small sample app, "Tindahan order" (a price
 * calculator and order page for a sari-sari store), which was written and run while this course was written (Node.js 22.23, Playwright
 * 1.65, headless Chromium). The test output, failures, browser results and mutation results shown are the real output of those runs
 * (only long folder paths were shortened). Every "example AI answer" is written for this course and labelled as such: it is not the
 * output of a real model. Product statements live in dated `version` notes.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  nodeTest: { label: 'Node.js 22 docs: Test runner', url: 'https://nodejs.org/docs/latest-v22.x/api/test.html' },
  jestStart: { label: 'Jest docs: Getting started', url: 'https://jestjs.io/docs/getting-started' },
  pwIntro: { label: 'Playwright docs: Installation', url: 'https://playwright.dev/docs/intro' },
  pwWriting: { label: 'Playwright docs: Writing tests', url: 'https://playwright.dev/docs/writing-tests' },
  pwLocators: { label: 'Playwright docs: Locators', url: 'https://playwright.dev/docs/locators' },
  pwAssertions: { label: 'Playwright docs: Assertions', url: 'https://playwright.dev/docs/test-assertions' },
  pwActionability: { label: 'Playwright docs: Auto-waiting (actionability)', url: 'https://playwright.dev/docs/actionability' },
  pwWebServer: { label: 'Playwright docs: Web server', url: 'https://playwright.dev/docs/test-webserver' },
  pwAgents: { label: 'Playwright docs: Test agents', url: 'https://playwright.dev/docs/test-agents' },
  pwMcp: { label: 'Playwright docs: Playwright MCP', url: 'https://playwright.dev/docs/getting-started-mcp' },
  ccBest: { label: 'Claude Code docs: Best practices', url: 'https://code.claude.com/docs/en/best-practices' },
  cursorBest: { label: 'Cursor blog: Best practices for coding with agents', url: 'https://cursor.com/blog/agent-best-practices' },
  codexPrompting: { label: 'ChatGPT Learn: Prompting (Codex workflows)', url: 'https://learn.chatgpt.com/docs/prompting' },
  mdnNumber: { label: 'MDN: <input type="number">', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number' },
  ghTemplates: { label: 'GitHub Docs: About issue and pull request templates', url: 'https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'ai-testing-qa-01',
    day: 1,
    title: 'What to test in an app you did not hand-write',
    summary: 'Why AI-built code needs checking even when the demo works, and how to choose what to test first by what would hurt most.',
    minutes: 22,
    skills: ['risk-thinking'],
    intro: {
      objectives: [
        'Explain why code that runs and looks right can still be wrong',
        'Rank the parts of an app by how likely they are to break and how badly it would hurt',
        'Tell logic checks, flow checks and exploratory testing apart and say which one fits a question',
      ],
      why: 'When AI writes the app, you did not make its small decisions, so you do not know where it guessed. Testing is how you find out, and choosing what to test first is what stops it from taking forever.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **test** is a check you can run again and again: it does something to your software and compares the result with the answer you expected. **Quality assurance** (QA) is the habit of doing that on purpose, so you find problems before your customers do. AI makes this habit more important, not less. When you hand-write a program you slowly learn every corner of it. When AI writes it in thirty seconds, the program arrives finished, tidy and confident, and you know almost nothing about the choices inside. It runs. The demo works. And the bugs are sitting exactly where you did not look.',
      },
      {
        type: 'paragraph',
        text: 'Here is the sample app you will test in every lesson of this course. Mang Dodong runs a sari-sari store and asked an AI assistant for a small order page: pick how many kape, asin and sabon, type a voucher, press a button, see the total. The voucher `BAHAGI10` should take 10% off when the order is PHP 100 or more. This is the heart of what the AI wrote, in a file called `pricing.js`.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'pricing.js, exactly as the AI wrote it',
        code: `export const PRICES = { kape: 12, asin: 8, sabon: 25 };

export function lineTotal(name, qty) {
  if (!(name in PRICES)) {
    throw new Error(\`Unknown item: \${name}\`);
  }
  return PRICES[name] * qty;
}

export function orderTotal(lines, voucher) {
  let subtotal = 0;
  for (const line of lines) {
    subtotal += lineTotal(line.name, line.qty);
  }
  if (voucher === 'BAHAGI10' && subtotal > 100) {
    const discount = Math.round(subtotal * 10) / 100;
    return subtotal - discount;
  }
  return subtotal;
}`,
      },
      {
        type: 'paragraph',
        text: 'Try the obvious order, 3 kape and 2 sabon: 3 × 12 + 2 × 25 = 86, and the page shows PHP 86. Correct. Mang Dodong is happy. This program has at least two real bugs, and you will find both with methods rather than luck. For now, notice the trap: **one correct answer tells you almost nothing**. A program can be right for the order you tried and wrong for a hundred others.',
      },
      { type: 'heading', text: 'You cannot test everything, so test by risk' },
      {
        type: 'paragraph',
        text: 'Even this tiny app has more possible inputs than you could ever try. So testers do not ask “did I test everything?”; they ask “what would hurt most if it were wrong, and how likely is that?”. That is **risk**: the chance something breaks multiplied by the damage when it does. You spend your testing time where both are high.',
      },
      {
        type: 'table',
        headers: ['Part of the app', 'How likely to be wrong', 'How bad if wrong', 'Test it'],
        rows: [
          ['The money maths (line totals, subtotal)', 'Medium: easy to write, easy to slip', 'Very bad: customers overpaid or underpaid', 'First, with known answers'],
          ['The voucher rule (10% off from PHP 100)', 'High: it has a boundary and AI often guesses these', 'Bad: lost money or angry customers', 'First, including exactly PHP 100'],
          ['Quantity typed into the page', 'High: people type anything', 'Bad: negative or absurd totals', 'Early, with odd inputs'],
          ['The button and the total showing on the page', 'Low: a short flow', 'Bad if it breaks: nobody can order', 'One end-to-end check'],
          ['Colours, spacing, wording of labels', 'Low', 'Low', 'A quick look, no automated test'],
        ],
        caption: 'A risk table for the sample app. Likelihood and damage decide the order, not how easy something is to test.',
      },
      { type: 'heading', text: 'Three kinds of check, three kinds of question' },
      {
        type: 'paragraph',
        text: 'Different questions need different checks. A **logic check** (a *unit test*) calls one small piece of code, such as `orderTotal`, with known input and compares the result with the answer you worked out by hand. It runs in milliseconds and points straight at the broken function. A **flow check** (an *end-to-end test*) drives the real page in a real browser the way a shopper would: type, click, read the screen. It is slower and fragile but it proves the pieces work together. **Exploratory testing** is a person (with AI as a thinking partner) poking at the app with curiosity, looking for what nobody thought to write a test for.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Where each kind of check looks. The more of the path a check covers, the slower it is and the less it tells you about where the problem is.',
        source: `flowchart LR
  S[Shopper types and clicks] --> P[Page: index.html and app.js]
  P --> F[pricing.js: orderTotal]
  F --> T[Total shown on the page]
  E[Flow check: browser test] -.-> S
  E -.-> T
  U[Logic check: unit test] -.-> F
  X[Exploratory: a person pokes at everything] -.-> P`,
      },
      { type: 'heading', text: 'Where AI-written code hides its bugs' },
      {
        type: 'list',
        items: [
          '**Boundaries.** The exact edge of a rule: PHP 100 exactly, quantity 0, quantity 99. Off-by-one slips (`>` where `>=` was meant) are common because “100 or more” and “more than 100” read almost the same.',
          '**Guesses where your prompt was silent.** You never said what a negative quantity should do, so the AI chose something without telling you. Every unspoken rule is a hidden decision.',
          '**Odd input.** People paste, mistype and press buttons twice. AI writes for the tidy input it imagined.',
          '**Later changes.** Next week you ask AI to “clean this up” and it quietly undoes something that used to work. Lessons 8 and 9 deal with this.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine a new helper at the store who works fast and never says “I am not sure”. You would still check the till at the end of the day. That is testing: instead of trusting, you count. A *function* is a small named recipe in the code (`orderTotal` is the recipe for “work out what the customer owes”). A *test* is you handing that recipe a basket where you already know the answer, and seeing whether it agrees. The code above reads like this: `PRICES` is the price list; `lineTotal` multiplies a price by how many were bought and complains if the item is not on the list; `orderTotal` adds all the lines and, if the voucher is `BAHAGI10` and the total is big enough, takes off a tenth. A *boundary* is the exact edge of a rule, like “PHP 100 or more”: that is where mistakes love to hide.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat AI output like a pull request from a fast contributor who has never seen your production traffic: plausible, internally consistent and unreviewed. Typical failure modes are the missing negative path, a boundary resolved the wrong way, an invented API or option, silently swallowed errors and behaviour that satisfies the prompt’s example but not its intent. Spend effort by risk and by blast radius, and prefer the cheapest layer that can catch each failure (most logic at unit level, a thin set of journeys end to end). When there is no spec, write characterization tests that pin what the code does today before you change it, then separate the behaviour you want from the behaviour you merely have. Exploratory sessions fill the gap that scripted checks leave: the unknown unknowns.',
      },
      {
        type: 'version',
        text: 'Claude Code’s best-practices page says Claude stops when the work looks done, so it should be given something it can run to find out whether the work is actually done (a test file, a command, a screenshot), and that you should ask for evidence such as the command it ran and its output, not just “all tests pass”. Checked against the Claude Code documentation on this date; the other coding agents give similar advice, and exact features change often.',
        checked: CHECKED,
        sources: [DOCS.ccBest],
      },
      {
        type: 'takeaways',
        items: [
          'A test is a repeatable check that compares what the software did with an answer you decided in advance.',
          'AI-written code runs and looks finished, so a single correct demo proves very little.',
          'You cannot test everything: rank by likelihood and damage, and test the money and the rules first.',
          'Logic checks find which function is wrong, flow checks prove the pieces work together, and exploratory testing finds what nobody predicted.',
          'Bugs hide at boundaries, in rules the prompt never stated, in odd input and in later “clean-ups”.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-01-match-1',
          kind: 'match',
          title: 'Pick the check for the question',
          prompt: 'Each line is a question you might ask about the order page. Match it to the kind of check that answers it best.',
          concept: 'kinds of checks',
          labels: { terms: 'The question', meanings: 'The best check' },
          pairs: [
            { term: 'Do 3 kape and 2 sabon come to PHP 86?', definition: 'A logic check on the pricing function', note: 'No page or browser is needed to ask this; the function can answer it directly and quickly.' },
            { term: 'Can a shopper type a quantity, press the button and read a total?', definition: 'A flow check driving the page in a browser', note: 'This question is about the pieces working together on the real page, so it needs a real page.' },
            { term: 'What happens if someone types -3, 1e2 or nothing at all?', definition: 'Exploratory testing by hand, with AI helping to brainstorm', note: 'Nobody has written down what should happen yet, so you are looking for surprises, not confirming known answers.' },
          ],
          hints: [
            'Ask: which check needs the whole page, and which needs only one function?',
            'One question has an answer you already know. Another has no known answer yet.',
            'Known answer on one function: logic check. Whole journey: flow check. Unknown answer: exploratory.',
          ],
          explanation: 'Use the cheapest check that can answer the question. A known answer on one function is a fast logic check. A journey through the page needs a browser. A question with no known answer is for exploring.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-01-scenario-1',
          kind: 'scenario',
          title: 'Thirty minutes before the store opens',
          prompt: 'Choose how to spend your time.',
          concept: 'testing by risk',
          situation: 'The AI has built Mang Dodong’s order page. The store opens in thirty minutes and you have time to check only a few things. The page looks great and the first order you tried gave the right total.',
          options: [
            { text: 'List what would cost the most if wrong (the money maths and the voucher rule), then check those with answers you worked out by hand, including exactly PHP 100.', consequence: 'You have spent your time where the damage would be greatest and where AI is most likely to have guessed, and every check has an answer decided in advance.', quality: 'best' },
            { text: 'Click around the whole page for thirty minutes and see if anything looks odd.', consequence: 'You may find something, but you have no list, no known answers and no way to repeat what you did, so you cannot tell what is covered.', quality: 'acceptable' },
            { text: 'Ask the AI “is my code correct?” and trust its answer.', consequence: 'The AI will usually say yes and explain why. That is its opinion of its own work, not a result, and it cannot know what Mang Dodong expects.', quality: 'poor' },
            { text: 'Fix the font and the colours first, since those are the easiest to check.', consequence: 'Easy is not the same as important. The money rules are still unchecked and a wrong total costs real pesos.', quality: 'poor' },
          ],
          hints: [
            'What would hurt Mang Dodong most if it were wrong?',
            'Rank by damage and likelihood, not by how easy something is to check.',
            'Check the money and the voucher with answers you decided first.',
          ],
          explanation: 'Risk decides the order: the checks with the most damage and the highest chance of being wrong come first, and each needs an answer decided before you run it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-01-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Words to know',
          prompt: 'Tap each card after you have tried to say it in your own words.',
          concept: 'testing vocabulary',
          cards: [
            { front: 'Test', back: 'A check you can run again that compares what the software did with the answer you expected.' },
            { front: 'Boundary', back: 'The exact edge of a rule, such as “PHP 100 or more”. Mistakes cluster here.' },
            { front: 'Risk', back: 'How likely something is to break, together with how much damage it would do.' },
            { front: 'Exploratory testing', back: 'Poking at the app with curiosity to find problems nobody thought to write a check for.' },
          ],
          hints: ['Cover the back with your hand and say it aloud before you tap.'],
          explanation: 'These four words are used in every lesson that follows.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-01-q1',
        prompt: 'The AI-built order page gave PHP 86 for 3 kape and 2 sabon, which is right. Why is that not enough to trust it?',
        choices: [
          'AI-written code is always wrong the first time and has to be rewritten by hand',
          'The browser might show the number in a different font on another phone',
          'One correct answer covers one input; bugs live at boundaries, odd inputs and places where the prompt said nothing',
          'The total was probably copied from an earlier session, so the code that was actually written had never really been run at all',
        ],
        answer: 2,
        explanation: 'A single right answer says nothing about the many other inputs. The risky places are the edges of rules, odd input and the decisions the AI made silently.',
      },
      {
        id: 'ai-testing-qa-01-q2',
        prompt: 'You have an hour. Which plan follows “test by risk”?',
        choices: [
          'Check the voucher rule and the money maths first, with known answers, then spend what is left on the page layout',
          'Test the page layout first, because visual problems are the easiest to notice and are the first thing Mang Dodong would see',
          'Test every file in the project in alphabetical order so that nothing is skipped',
          'Test only the parts the AI said it was unsure about',
        ],
        answer: 0,
        explanation: 'Risk is likelihood times damage. Money rules are both likely to hide a guess and costly when wrong, so they come first. Alphabetical order and “where the AI was unsure” ignore damage entirely.',
      },
      {
        id: 'ai-testing-qa-01-q3',
        prompt: 'Which question is best answered by a logic check (a unit test) rather than a flow check?',
        choices: [
          'Does the Compute total button stay visible on a small phone screen?',
          'Does the page still load after the server is restarted by someone running the start command again?',
          'Can a shopper complete an order from opening the page to reading the total on screen?',
          'Does `orderTotal` return 90 for four sabon with the voucher?',
        ],
        answer: 3,
        explanation: 'A known answer from one function needs no browser. The other three are about the page or the whole journey, so a flow check or a manual look fits better.',
      },
      {
        id: 'ai-testing-qa-01-q4',
        prompt: 'The prompt never said what happens when someone orders a quantity of -3. What is the best way to think about that?',
        choices: [
          'It cannot matter, because nobody would type a negative quantity into a shop page',
          'It is the AI’s responsibility, so any behaviour it chose must be the correct one',
          'It is a hidden decision the AI made for you, so decide what should happen and then check that it does',
          'It only matters if the page crashes with a red error message that the shopper can see on screen at the till',
        ],
        answer: 2,
        explanation: 'When a prompt is silent, the AI guesses. You turn that guess into a decision of your own, and then a test can hold the code to it.',
      },
      {
        id: 'ai-testing-qa-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a test?',
        choices: [
          'A final exam that the AI takes before it is allowed to write any more code for the same project',
          'A check you can repeat: give the program something where you know the answer and see if it agrees',
          'A way of making the program run faster by removing unused lines',
        ],
        answer: 1,
        explanation: 'A test is repeatable and compares the result with an answer you decided in advance, like counting the till at the end of the day.',
      },
      {
        id: 'ai-testing-qa-01-q6',
        audience: { min: 'advanced' },
        prompt: 'You inherit an AI-generated module with no spec and no tests, and you are about to change it. What should you write first?',
        choices: [
          'Characterization tests that pin down what it does today, so your change shows exactly which behaviour moved',
          'A new implementation from scratch, since generated code is not worth keeping',
          'A full end-to-end suite that exercises every screen, because unit tests cannot be trusted on generated code',
          'Nothing yet: read the code carefully and rely on code review to catch regressions',
        ],
        answer: 0,
        explanation: 'Characterization tests record current behaviour cheaply and make any change visible. You can then decide which recorded behaviours are intended and which are accidents.',
      },
    ],
    task: {
      title: 'Meet the sample app and rank its risks',
      minutes: 15,
      steps: [
        'Ask an AI assistant to build the order page: “A small web page for a sari-sari store. Three items (kape 12, asin 8, sabon 25), a quantity box for each, a voucher box, a button, and the total. Voucher BAHAGI10 gives 10% off orders of PHP 100 or more. Plain HTML and JavaScript, the price logic in its own file.” Or use your own small idea with one money rule.',
        'Run it and try three orders. Note which answers you worked out yourself before looking.',
        'Write a risk table like the one in this lesson for your app: five parts, how likely each is to be wrong, how bad it would be, and which two you would test first.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain this code line by line as if I have never coded, and point out any place where you had to guess because I did not say.” Add each guess to your risk table.'] },
      { audience: { min: 'advanced' }, steps: ['Ask a second agent session with no context to review the generated code against your prompt only, and list every behaviour the prompt does not specify. Compare its list with yours.'] },
    ],
  },
  {
    id: 'ai-testing-qa-02',
    day: 2,
    title: 'Ask AI for test cases before tests',
    summary: 'Turn the rules of your app into a table of cases (input, expected answer, why) before any test code exists, and use it to catch a real bug.',
    minutes: 24,
    skills: ['test-cases', 'risk-thinking'],
    intro: {
      objectives: [
        'Write a test case as input, expected answer and reason',
        'Prompt an AI for test cases from the rules, not from the code',
        'Sort cases into normal, boundary, bad-input and open-question cases',
      ],
      why: 'If you ask AI for tests straight away it reads the code and writes tests that agree with it, bugs included. A table of cases you reviewed first is what makes a test mean something.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The fastest way to a useless test suite is to paste your code into an AI and say “write tests for this”. The AI reads the code, works out what it does and writes tests that expect exactly that. If the code has a bug, the tests agree with the bug, everything turns green, and you feel safe. A test is only worth something when its expected answer comes from somewhere other than the code: from the **rules** you wanted. So before any test code, we write **test cases**: a plain table, one row per question, that anyone can read without knowing JavaScript.',
      },
      {
        type: 'paragraph',
        text: 'A test case has three parts. The **input** is what you give the software (an order of 4 sabon and the voucher `BAHAGI10`). The **expected result** is the answer you say is right (90). The **reason** is the rule that makes it right (“10% off from PHP 100 or more, and 4 × 25 is exactly 100”). The reason is what lets someone later tell whether the case is a good one, and whether a failing case means a bug in the code or a mistake in the case.',
      },
      { type: 'heading', text: 'Four families of cases' },
      {
        type: 'list',
        items: [
          '**Normal cases:** ordinary things people do. 3 kape and 2 sabon.',
          '**Boundary cases:** the exact edge of every rule, with a step either side. For “PHP 100 or more” that is 99, 100 and 101. For a quantity of 0 to 99 it is -1, 0, 1, 98, 99 and 100.',
          '**Bad-input cases:** things that should be refused or handled: an item that is not sold, a quantity of 1.5, an empty order.',
          '**Open questions:** cases where the rules say nothing. These are not tests yet. They are questions you must answer before you can write the test.',
        ],
      },
      { type: 'heading', text: 'Ask for cases from the rules, not the code' },
      {
        type: 'paragraph',
        text: 'You give the AI the rules and keep the code out of the conversation, so it cannot copy the code’s behaviour. You also tell it to mark any case where the rules are silent instead of guessing. Here is a prompt for Mang Dodong’s order page.',
      },
      {
        type: 'prompt',
        label: 'Prompt: test cases from the rules only',
        text: 'I am testing a small order calculator for a sari-sari store. Do NOT write code and do not ask to see the code. Rules: prices are kape 12, asin 8, sabon 25 (PHP). The order total is the sum of price times quantity. The voucher BAHAGI10 takes 10% off when the order is PHP 100 or more. Give me a table of test cases with the columns: number, family (normal, boundary, bad input, open question), input, expected total, and the rule that makes it right. Work out every expected total by hand from the rules. If the rules do not say what should happen, write "OPEN QUESTION" instead of an expected total and explain what I need to decide.',
      },
      {
        type: 'table',
        headers: ['#', 'Family', 'Input', 'Expected', 'Reason'],
        rows: [
          ['1', 'Normal', '3 kape + 2 sabon, no voucher', '86', '36 + 50'],
          ['2', 'Normal', 'same order with BAHAGI10', '86', 'Below PHP 100, so no discount'],
          ['3', 'Boundary', '3 sabon + 2 kape with BAHAGI10', '99', 'One peso under 100: no discount'],
          ['4', 'Boundary', '4 sabon with BAHAGI10', '90', 'Exactly 100 qualifies, 10% of 100 is 10'],
          ['5', 'Normal', '5 sabon with BAHAGI10', '112.5', '125 minus 12.5'],
          ['6', 'Normal', '4 sabon with another voucher, HELLO', '100', 'Not a known voucher'],
          ['7', 'Bad input', 'empty order', '0', 'Nothing bought, nothing owed'],
          ['8', 'Bad input', 'an item “yelo” that is not sold', 'refused', 'Unknown items cannot be priced'],
          ['9', 'Open question', 'voucher typed as bahagi10', 'OPEN QUESTION', 'Rules do not say if capitals matter'],
          ['10', 'Open question', 'quantity -3 kape', 'OPEN QUESTION', 'Rules do not say what a negative quantity means'],
          ['11', 'Open question', 'quantity 1.5 kape', 'OPEN QUESTION', 'Can items be sold in halves?'],
          ['12', 'Open question', 'quantity 100 kape', 'OPEN QUESTION', 'Is there a maximum order size?'],
        ],
        caption: 'An example answer, written for this course (not the output of a real model). Each expected total can be worked out with a pencil.',
      },
      { type: 'heading', text: 'You review the table, then you decide' },
      {
        type: 'paragraph',
        text: 'Now the human part. Check every expected number yourself. Case 5: 5 × 25 = 125, the discount is 12.5, and 125 − 12.5 = 112.5. Then answer the open questions, because you or the shop owner are the only ones who can. Mang Dodong says: “Capital letters should not matter. Quantities are whole numbers from 0 to 99. Nothing else.” Those four answers become four more rows with expected results. This review is the step that cannot be handed to the AI, because the whole point is an answer that does not come from the code.',
      },
      {
        type: 'warning',
        text: 'Never let the AI fill the “expected” column by running the code. An expected result produced by the code under test can only ever agree with it.',
      },
      { type: 'heading', text: 'Run the table against the real code' },
      {
        type: 'paragraph',
        text: 'The cases that already have answers can be tried at once, even before there are proper tests. This is the real result of running them against the AI’s `pricing.js`, with a small throwaway script that prints ok or FAIL for each.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the first six cases and the bad inputs, run against the AI’s code',
        code: `ok   3 kape + 2 sabon, no voucher: expected 86, got 86
ok   same order, BAHAGI10 (below 100): expected 86, got 86
FAIL exactly 100, BAHAGI10: expected 90, got 100
ok   125, BAHAGI10: expected 112.5, got 112.5
ok   100, unknown voucher: expected 100, got 100
ok   empty order: expected 0, got 0
qty -3: returned -36
qty 1.5: returned 18
qty 100: returned 1200
unknown item: threw Unknown item: yelo`,
      },
      {
        type: 'paragraph',
        text: 'Two findings. The boundary case failed: a shopper spending exactly PHP 100 got no discount, because the AI wrote `subtotal > 100` (“more than”) when the rule says “100 or more”. And the three odd quantities were all accepted: -3 kape gave a negative total of -36. That second finding is a decision the AI made silently, and you will keep following it through the course. Notice that the ordinary cases (1, 2, 5) all passed. Only the boundary case and the open questions found anything, which is why they are worth the effort.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A test case is a question with a known answer, like checking a recipe: “if I use two cups of rice, how many cups of water?” The *input* is what you put in, the *expected result* is what the recipe says should come out, and the *reason* is why. Writing the table first is like writing your shopping list before you walk into the store: you decide what you need before the shelves start suggesting things. In the output above, `ok` means the code agreed with the answer in the table, `FAIL` means it disagreed, and “got 100” means the code gave PHP 100 when the table said 90. The lines that say “returned” or “threw” are the odd inputs, where the table had no answer yet.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** The table is a lightweight application of equivalence partitioning and boundary-value analysis: split each input into classes that should behave alike, then test each class once and both sides of every edge. For rules that combine (voucher × subtotal × quantity validity) a decision table keeps the combinations visible, and pairwise selection keeps them affordable. The hard part is the oracle problem: AI is good at proposing inputs and poor at knowing the right output, so verify expected values independently (a pencil, a spreadsheet, a reference implementation) and keep the table in the repository as the executable specification, with a stable id per case so a failure traces to a requirement. Generated cases reflect the prompt, so review them for missing partitions rather than just wrong values.',
      },
      {
        type: 'takeaways',
        items: [
          'A test case is an input, an expected result and the reason it is right, written so that anyone can read it.',
          'Ask the AI for cases from the rules, and keep the code out of the prompt so it cannot copy the code’s behaviour.',
          'Sort cases into normal, boundary, bad-input and open-question families; boundaries and open questions find the most bugs.',
          'Open questions are for you or the owner to answer; the AI’s guess is not an answer.',
          'Work out expected results independently: never fill them in by running the code under test.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-02-code-challenge-1',
          kind: 'code-challenge',
          title: 'List the boundary values',
          prompt: 'A rule accepts whole numbers from `min` to `max`. Write `boundaryValues(min, max)` that returns an array of the six values worth testing, in this order: one below min, min, one above min, one below max, max, one above max.',
          concept: 'boundary cases',
          language: 'javascript',
          starter: 'function boundaryValues(min, max) {\n  // return the six values to try\n}\n',
          solution: 'function boundaryValues(min, max) {\n  return [min - 1, min, min + 1, max - 1, max, max + 1];\n}\n',
          tests: {
            kind: 'function',
            fn: 'boundaryValues',
            cases: [
              { label: 'quantity 0 to 99', args: [0, 99], expected: [-1, 0, 1, 98, 99, 100] },
              { label: 'range 1 to 10', args: [1, 10], expected: [0, 1, 2, 9, 10, 11] },
              { label: 'subtotal 100 to 200', args: [100, 200], expected: [99, 100, 101, 199, 200, 201] },
            ],
          },
          hints: [
            'Return one array with six numbers in it.',
            'Each number is min or max, plus or minus one.',
            'The array is [min - 1, min, min + 1, max - 1, max, max + 1].',
          ],
          explanation: 'Mistakes cluster at the edges, so each edge is tried with a step either side. With min 0 and max 99 that gives -1, 0, 1, 98, 99 and 100, exactly the quantities a careful tester would try.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-02-scenario-1',
          kind: 'scenario',
          title: 'The AI filled in the expected column',
          prompt: 'Choose what to do with the table.',
          concept: 'independent expected results',
          situation: 'You asked an AI for test cases and also pasted pricing.js “for context”. Its table has an expected total for every row, including “exactly PHP 100 with BAHAGI10: expected 100”. You did not work these out yourself, and 100 looks wrong to you.',
          options: [
            { text: 'Work each expected total out by hand from the rules, find that exactly 100 should be 90, and ask the AI to rebuild the table from the rules only.', consequence: 'The row that exposes the real bug is now correct, and the table is a fair judge of the code instead of a copy of it.', quality: 'best' },
            { text: 'Accept the table, since the AI saw the code and so knows what it does.', consequence: 'The tests would pass, and the discount bug would ship, because the expected answer was copied from the buggy code.', quality: 'poor' },
            { text: 'Delete only the row that looks wrong and keep the rest.', consequence: 'You removed the one case that mattered, and you are still trusting an expected column you did not check.', quality: 'poor' },
            { text: 'Fix just that one number to 90 and keep every other row as the AI wrote it.', consequence: 'Better, but the other rows came from the same source and you have not checked them, so more copied bugs could remain.', quality: 'acceptable' },
          ],
          hints: [
            'Where did the AI get its expected answers?',
            'An answer taken from the code can never disagree with the code.',
            'Work the answers out from the rules, and keep the code out of it.',
          ],
          explanation: 'The expected column must come from the rules. Giving the AI the code let it describe the bug as correct behaviour. Rebuilding the table from the rules and checking the numbers yourself is what makes the cases a real judge.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-02-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'The three parts of a test case',
          prompt: 'Tap each card to check you can say what it means.',
          concept: 'parts of a test case',
          cards: [
            { front: 'Input', back: 'What you give the program, such as 4 sabon and the voucher BAHAGI10.' },
            { front: 'Expected result', back: 'The answer you say is right, worked out from the rules before you run anything.' },
            { front: 'Reason', back: 'The rule that makes the expected result right, so anyone can judge the case later.' },
          ],
          hints: ['Think of a question, its answer, and why that answer is right.'],
          explanation: 'Every case in the table has these three parts, and the reason is what keeps the case honest.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-02-q1',
        prompt: 'Why do you ask the AI for test cases from the rules and leave the code out?',
        choices: [
          'AI cannot read code written in JavaScript',
          'The AI would copy what the code does, bugs included, so the tests could never disagree with it',
          'It makes the prompt shorter, which makes the AI answer faster',
          'Test cases written from code are rejected by most test frameworks, which only accept cases taken from a written specification',
        ],
        answer: 1,
        explanation: 'Expected answers taken from the code can only agree with the code. Rules are an independent source, so a case written from them can catch a real bug.',
      },
      {
        id: 'ai-testing-qa-02-q2',
        prompt: 'Which set of orders is the best boundary test for the rule “10% off from PHP 100 or more”?',
        choices: [
          'Orders of PHP 50 and PHP 500',
          'An order with no items and an order with the maximum number of items',
          'Two different orders of exactly PHP 100 with different items in them, to confirm the result is the same',
          'Orders of PHP 99, PHP 100 and PHP 101',
        ],
        answer: 3,
        explanation: 'A boundary test sits on the edge with a step either side. 99 is just under, 100 is exactly on it and 101 is just over. The other pairs are nowhere near the edge or only touch it from one side.',
      },
      {
        id: 'ai-testing-qa-02-q3',
        prompt: 'The AI’s table says “quantity -3: expected whatever the function returns”. What is the right response?',
        choices: [
          'Keep it: the function’s own answer is, by definition, the expected one',
          'Delete the row, because negative numbers are an unrealistic input for a shop page and nobody would ever type one in',
          'Turn it into a question for the owner, decide what a negative quantity should do, then write the expected result',
          'Let the AI run the code and paste in the number it printed',
        ],
        answer: 2,
        explanation: '“Whatever it returns” is not an expectation. The rules are silent, so the owner decides (here: refuse it), and only then does the case have an answer to check.',
      },
      {
        id: 'ai-testing-qa-02-q4',
        prompt: 'A case’s expected result is 112.5 for five sabon with the voucher. What is the best “reason” to write next to it?',
        choices: [
          'Because that is what the program printed when we tried it',
          'It should be right',
          '5 × 25 = 125, and 10% of 125 is 12.5, so 125 − 12.5 = 112.5',
          'The AI suggested it in an earlier chat, so it has already been reviewed',
        ],
        answer: 2,
        explanation: 'A good reason is the rule and the working, so anyone can check the number without trusting you or the code.',
      },
      {
        id: 'ai-testing-qa-02-q5',
        audience: { max: 'beginner' },
        prompt: 'What is an “expected result” in a test case?',
        choices: [
          'The answer you decided is right before running anything',
          'Whatever number the program happens to print the first time it is run',
          'The time the test is expected to take to run',
        ],
        answer: 0,
        explanation: 'The expected result is your answer, decided in advance. If the program prints something different, either the program or your case is wrong, and the reason column helps you tell which.',
      },
      {
        id: 'ai-testing-qa-02-q6',
        audience: { min: 'advanced' },
        prompt: 'A quantity must be a whole number from 0 to 99. Which input set best reflects equivalence partitioning with boundaries?',
        choices: [
          '-1, 0, 1, 50, 98, 99, 100 and 1.5',
          '0, 50 and 99, since those are the minimum, a typical value and the maximum',
          '1 to 99 in steps of 1, so nothing is missed',
          '-100, 150 and 1000, to confirm that large invalid values are refused',
        ],
        answer: 0,
        explanation: 'It has one value from each class (invalid low, edges, typical, invalid high, non-integer) and a step on both sides of each edge. The second set never tries an invalid value, the third is wasteful, and the fourth is far from the edges.',
      },
    ],
    task: {
      title: 'Build a case table for your own rules',
      minutes: 18,
      steps: [
        'Write the rules of your app (or the order page) in five plain sentences, with no code.',
        'Use the prompt from this lesson, changed to your rules, and ask an AI for a table of cases. Do not paste your code.',
        'Work out every expected result by hand. Fix any that are wrong and mark which ones were wrong.',
        'Answer each open question (or write who will answer it). Then try the cases against your app by hand and note which ones fail.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain, for three of its rows, why that row is a good case to try. Cross out any row you cannot explain in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Add a column with a requirement id per row and a column for the test layer that should own it (unit, integration, end to end). Ask a fresh session to find partitions the table misses and decide which of its suggestions you keep.'] },
    ],
  },
  {
    id: 'ai-testing-qa-03',
    day: 3,
    title: 'Generate and run unit tests',
    summary: 'Turn the case table into runnable tests, read what the AI wrote, run them, and decide whether a red result means the code or the test is wrong.',
    minutes: 26,
    skills: ['unit-tests'],
    intro: {
      objectives: [
        'Ask an AI to turn a table of cases into runnable unit tests and run them yourself',
        'Read a failing test result and say which value was expected and which was actual',
        'Decide whether a failure is a bug in the code or a mistake in the test',
      ],
      why: 'AI can write forty tests in a minute, but only running them and reading the result tells you anything. A test you never saw fail is a test you cannot yet trust.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'You have a table of cases with answers you worked out. Now you want the computer to check them, over and over, in a second, whenever the code changes. That is a **unit test**: a small program that calls one piece of your code (a *unit*, here the function `orderTotal`) with known input and compares the result with the expected answer. A **test runner** is the tool that finds all your tests, runs them and prints what passed and what failed. Jest and Vitest are famous runners. We will use the one built into Node.js, because it needs nothing installed: you run `node --test`. The ideas are identical in every runner, so what you learn here moves with you.',
      },
      { type: 'heading', text: 'What a test looks like' },
      {
        type: 'paragraph',
        text: 'Each row of the case table becomes one test. The test has a name that states the rule, then three steps: **arrange** (set up the input), **act** (call the code) and **assert** (compare with the expected answer). This is the file an AI wrote from the first five rows of the table.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'test/pricing.test.js',
        code: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orderTotal } from '../public/pricing.js';

test('adds up the lines when there is no voucher', () => {
  const lines = [{ name: 'kape', qty: 3 }, { name: 'sabon', qty: 2 }];
  assert.equal(orderTotal(lines), 86);
});

test('BAHAGI10 does nothing below PHP 100', () => {
  const lines = [{ name: 'kape', qty: 3 }, { name: 'sabon', qty: 2 }];
  assert.equal(orderTotal(lines, 'BAHAGI10'), 86);
});

test('BAHAGI10 takes 10% off at exactly PHP 100', () => {
  assert.equal(orderTotal([{ name: 'sabon', qty: 4 }], 'BAHAGI10'), 90);
});

test('BAHAGI10 takes 10% off above PHP 100', () => {
  assert.equal(orderTotal([{ name: 'sabon', qty: 5 }], 'BAHAGI10'), 112.5);
});

test('an unknown item is refused', () => {
  assert.throws(() => orderTotal([{ name: 'yelo', qty: 1 }]), /Unknown item/);
});`,
      },
      {
        type: 'paragraph',
        text: 'Read it as a story. The first two lines import the tools: `test` defines a test, and `assert` is a set of comparisons that throw an error when they are wrong. `assert.equal(actual, expected)` compares what the code returned (first) with the answer you decided (second). The last test uses `assert.throws`, which passes only when the code *refuses* the input by raising an error that matches the words `Unknown item`.',
      },
      {
        type: 'prompt',
        label: 'Prompt: from the table to runnable tests',
        text: 'Here is my table of test cases (pasted below). Write one test per row using Node.js 22\'s built-in test runner (node:test and node:assert/strict), in test/pricing.test.js. Import orderTotal from ../public/pricing.js. Use literal expected numbers from my table, never a formula that recomputes them. Do not change pricing.js and do not change any expected value. Add package.json script "test": "node --test --test-reporter=spec". Then run npm test and show me the full output, including any failures. Do not try to fix a failing test: just report it.',
      },
      { type: 'heading', text: 'Run it and read the result' },
      {
        type: 'paragraph',
        text: 'This is the real output of `npm test` on the AI’s code. Look at the marks: a tick means the test passed, a cross means it failed.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output (shortened: the repeated stack lines are cut)',
        code: `✔ adds up the lines when there is no voucher (0.467625ms)
✔ BAHAGI10 does nothing below PHP 100 (0.065666ms)
✖ BAHAGI10 takes 10% off at exactly PHP 100 (0.415541ms)
✔ BAHAGI10 takes 10% off above PHP 100 (0.063125ms)
✔ an unknown item is refused (0.201792ms)
ℹ tests 5
ℹ pass 4
ℹ fail 1

✖ failing tests:

test at test/pricing.test.js:15:1
✖ BAHAGI10 takes 10% off at exactly PHP 100 (0.415541ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  100 !== 90`,
      },
      {
        type: 'paragraph',
        text: 'The key line is `100 !== 90`. The first number is the **actual** value the code returned, and the second is the **expected** value the test held it to. So the code said PHP 100 and the test said 90. This is the same boundary bug the table found in lesson 2, now caught by a test that will catch it every time it comes back.',
      },
      { type: 'heading', text: 'Red: is the code wrong, or the test?' },
      {
        type: 'paragraph',
        text: 'A failing test (people say *red*) is a question, not a verdict. Either the code is wrong or the test is. You answer it with the **reason** column of your table: the rule says “PHP 100 or more”, so exactly 100 must get the discount, so 90 is right and the code is wrong. The AI’s code says `subtotal > 100`. The fix is one character, and you give it to the AI as an instruction about the code only.',
      },
      {
        type: 'code',
        language: 'diff',
        label: 'The fix, in the code and not in the test',
        code: `-  if (voucher === 'BAHAGI10' && subtotal > 100) {
+  if (voucher === 'BAHAGI10' && subtotal >= 100) {`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output after the fix',
        code: `✔ adds up the lines when there is no voucher (0.482917ms)
✔ BAHAGI10 does nothing below PHP 100 (0.066333ms)
✔ BAHAGI10 takes 10% off at exactly PHP 100 (0.057ms)
✔ BAHAGI10 takes 10% off above PHP 100 (0.055167ms)
✔ an unknown item is refused (1.236708ms)
ℹ tests 5
ℹ pass 5
ℹ fail 0`,
      },
      {
        type: 'warning',
        text: 'When a test is red, an AI asked to “make the tests pass” may find the quickest way: change the expected value from 90 to 100, or delete the test. Always say “do not edit the tests”, and check the diff of the test file yourself after every run.',
      },
      { type: 'heading', text: 'Review what the AI wrote before you trust it' },
      {
        type: 'list',
        items: [
          '**One idea per test**, and the name states the rule (“takes 10% off at exactly PHP 100”), so a red result tells you what broke.',
          '**Expected values are literal numbers** that you can check with a pencil, not a formula that recomputes the answer the way the code does.',
          '**No logic in the test**: no loops or `if` that decide what to expect. A test with its own logic can be wrong in its own way.',
          '**The input is visible** in the test, so a reader sees the case without opening another file.',
        ],
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**If your project already uses Jest or Vitest.** Nothing above changes except the spelling: `test` and `expect` are global, and `assert.equal(a, b)` becomes `expect(a).toBe(b)`. Ask the AI to match the existing test files in the project rather than introducing a second runner, and tell it the exact command (`npx jest` or `npx vitest run`) so it runs the right one. If a result looks surprising, run a single test file with your runner’s filter option so the output is small enough to read.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine checking Mang Dodong’s till with a list: “3 kape and 2 sabon should be PHP 86”. A test is that list written as code so the computer can tick or cross each line in a blink. In the file above, `test(...)` gives one check a name, the arrow `() => { ... }` holds the steps of the check, and `assert.equal(a, b)` ticks it only when `a` and `b` are the same. `import` just brings in tools the file needs. In the result, ✔ means the check agreed, ✖ means it disagreed, and `100 !== 90` means “the code gave 100, but we expected 90”. Red does not mean the computer is broken. It means the test found something to look at.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** AI-generated tests tend to be coupled to implementation (asserting on mocks, private helpers or call counts) and to duplicate production logic in the expected value, so review them for behaviour coverage rather than line coverage. Prefer table-driven tests once cases share a shape, keep them deterministic (no clock, network or randomness without injection), mock only at process boundaries, and treat snapshot tests with suspicion because a regenerated snapshot is an approval nobody read. Run the suite the same way locally and in CI, and make a failing test fail the build. Coverage is a negative signal only: a low number shows what is untested, a high number does not show that anything is checked (lesson 9).',
      },
      {
        type: 'version',
        text: 'Checked against Node.js 22 (v22.23 was used): the built-in test runner (`node:test`) is marked stable. `node --test` with no arguments runs files matching patterns such as `**/*.test.js` and anything under a `test` directory; to pick files you pass quoted glob patterns, and `node --test test/` with a bare directory name failed in our run (Node tried to run `test` as a script). When output is not a terminal the default reporter is `tap`, which is why the scripts here pass `--test-reporter=spec`. Reporter formats can change between versions.',
        checked: CHECKED,
        sources: [DOCS.nodeTest],
      },
      {
        type: 'version',
        text: 'Jest’s current documentation (version 30.5) shows the same pattern with different words: `test(name, fn)` with `expect(value).toBe(expected)` and a `"test": "jest"` script. Checked on this date; runner versions and defaults change, so read your project’s own setup.',
        checked: CHECKED,
        sources: [DOCS.jestStart],
      },
      {
        type: 'takeaways',
        items: [
          'A unit test calls one piece of code with known input and compares the result with an answer decided in advance.',
          'Run the tests yourself and read the output: in `100 !== 90` the first value is the actual one and the second is the expected one.',
          'A red test is a question: use the reason column of your case table to decide whether the code or the test is wrong.',
          'Tell the AI never to edit tests or expected values to make them pass, and check the test diff yourself.',
          'Good generated tests have one idea each, literal expected values, no logic and visible input.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-03-predict-output-1',
          kind: 'predict-output',
          title: 'Which checks pass?',
          prompt: 'This tiny check runner uses the AI’s original rule. What does it print?',
          concept: 'reading test results',
          language: 'javascript',
          code: `function orderTotal(subtotal, voucher) {
  if (voucher === 'BAHAGI10' && subtotal > 100) {
    return subtotal - subtotal / 10;
  }
  return subtotal;
}

function check(label, actual, expected) {
  console.log((actual === expected ? 'ok: ' : 'FAIL: ') + label);
}

check('below 100', orderTotal(99, 'BAHAGI10'), 99);
check('exactly 100', orderTotal(100, 'BAHAGI10'), 90);
check('above 100', orderTotal(200, 'BAHAGI10'), 180);`,
          choices: [
            'ok: below 100\nFAIL: exactly 100\nok: above 100',
            'ok: below 100\nok: exactly 100\nok: above 100',
            'FAIL: below 100\nFAIL: exactly 100\nok: above 100',
            'ok: below 100\nFAIL: exactly 100\nFAIL: above 100',
          ],
          wrongNotes: {
            'ok: below 100\nok: exactly 100\nok: above 100': 'That would be true if the rule said “100 or more”. The code says “more than 100”, and 100 is not more than 100, so no discount is given and the total stays 100, not 90.',
            'FAIL: below 100\nFAIL: exactly 100\nok: above 100': 'At 99 the voucher does nothing, so the total is 99 and the check expects 99. That one passes.',
            'ok: below 100\nFAIL: exactly 100\nFAIL: above 100': 'At 200 the code does take a tenth off (200 minus 20 is 180), and the check expects 180, so that one passes.',
          },
          hints: [
            'Work through each check by hand. What does orderTotal return for 99, 100 and 200?',
            'The condition is subtotal > 100. Is 100 greater than 100?',
            'Only the exactly-100 case misses the discount, so only it fails.',
          ],
          explanation: 'At 99 and at 200 the code behaves as the rule says. At exactly 100 the condition `subtotal > 100` is false, so the shopper pays 100 instead of 90. That is the red line a real test run showed, and it is why edges get their own tests.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-03-fix-bug-1',
          kind: 'fix-bug',
          title: 'Fix the code, not the test',
          prompt: 'The rule is “PHP 100 or more qualifies for the voucher”. The checks below fail at 100. Tap the line that is wrong, then choose the fix.',
          concept: 'fix the code when the test is right',
          language: 'javascript',
          code: `function qualifies(subtotal) {
  return subtotal > 100;
}`,
          bugLine: 2,
          fixes: [
            { line: '  return subtotal >= 100;', correct: true, why: 'This matches the rule: 100 and above qualify, 99.5 does not.' },
            { line: '  return subtotal > 99;', correct: false, why: 'It works for whole pesos but lets 99.5 through, and prices can have centavos. It also hides the real rule behind a different number.' },
            { line: '  return subtotal === 100;', correct: false, why: 'This qualifies only exactly 100, so 101 and above would lose the discount.' },
            { line: '  return subtotal >= 101;', correct: false, why: 'This moves the edge the wrong way: 100 still fails.' },
          ],
          tests: {
            kind: 'function',
            fn: 'qualifies',
            cases: [
              { label: '99 does not qualify', args: [99], expected: false },
              { label: '99.5 does not qualify', args: [99.5], expected: false },
              { label: '100 qualifies', args: [100], expected: true },
              { label: '101 qualifies', args: [101], expected: true },
            ],
          },
          hints: [
            'Which comparison is in the line that returns the answer?',
            'The rule says “100 or more”. Which operator means “greater than or equal to”?',
            'Use >= with 100.',
          ],
          explanation: 'The test was right and the code was wrong, so the one-character change belongs in the code. `>=` includes the edge itself, and the 99.5 case shows why a nearby whole number is not an equal substitute.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-03-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Read the result',
          prompt: 'Tap each card to check you can read a test result.',
          concept: 'reading test output',
          cards: [
            { front: '✔', back: 'The test passed: the code gave the expected answer.' },
            { front: '✖', back: 'The test failed: the code gave a different answer, or an error. Read the lines under it.' },
            { front: '100 !== 90', back: 'The first number is what the code returned, the second is what the test expected.' },
            { front: 'ℹ pass 4, fail 1', back: 'A summary: four tests passed and one failed.' },
          ],
          hints: ['Think of it like a marked quiz: ticks, crosses and a score at the end.'],
          explanation: 'These marks are all you need to read the output of any test run.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-03-q1',
        prompt: 'A failing test shows `100 !== 90`. What does that tell you?',
        choices: [
          'The code returned 100 where the test expected 90',
          'The test expected 100 and the code returned 90',
          'The code and the test are both wrong by exactly 10',
          'The test could not run because 100 and 90 are not comparable values',
        ],
        answer: 0,
        explanation: 'With `assert.equal(actual, expected)` the message puts the actual value first, so 100 came from the code and 90 is what the test held it to.',
      },
      {
        id: 'ai-testing-qa-03-q2',
        prompt: 'A test is red. How do you decide whether to change the code or the test?',
        choices: [
          'Change the test, because it is usually the quickest thing to edit',
          'Always change the code, because tests are never wrong',
          'Ask which one the AI wrote most recently, and trust whichever of the two files is older because it has been used more',
          'Check the rule behind the case: if the expected answer follows the rule, fix the code; if not, fix the case',
        ],
        answer: 3,
        explanation: 'Neither is right by default. The reason column (the rule) is the judge: the side that disagrees with the rule is the side that is wrong.',
      },
      {
        id: 'ai-testing-qa-03-q3',
        prompt: 'You asked an AI to make the failing tests pass. It changed 90 to 100 in the test file. What is the right reaction?',
        choices: [
          'Accept it, since the tests are green again and green means done',
          'Reject the change: the rule says 90, so the code should change; repeat the request with “do not edit the tests”',
          'Accept it, but ask the AI to add a comment explaining the new number',
          'Ask the AI to delete the failing test so that nobody has to look at the awkward number again and the build stays green',
        ],
        answer: 1,
        explanation: 'The AI made the test agree with the bug. Green is only meaningful when the expected values still come from the rules, so check the test diff after every run and forbid edits to tests.',
      },
      {
        id: 'ai-testing-qa-03-q4',
        prompt: 'Which assertion is written the way a generated test should be?',
        choices: [
          'assert.equal(orderTotal(lines, \'BAHAGI10\'), subtotal - Math.round(subtotal * 10) / 100)',
          'assert.equal(typeof orderTotal([{ name: \'sabon\', qty: 4 }], \'BAHAGI10\'), \'number\')',
          'assert.ok(orderTotal([{ name: \'sabon\', qty: 4 }], \'BAHAGI10\'))',
          'assert.equal(orderTotal([{ name: \'sabon\', qty: 4 }], \'BAHAGI10\'), 90)',
        ],
        answer: 3,
        explanation: 'A literal expected value you can check with a pencil is best. The first repeats the code’s own formula (so it shares its bugs), and the last two pass for almost any number, including a wrong one.',
      },
      {
        id: 'ai-testing-qa-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In a test run, what does a cross (✖) next to a test mean?',
        choices: [
          'The computer is broken or has run out of memory, and it needs to be restarted before the tests can run again',
          'The test finished too quickly to be trusted',
          'The code gave a different answer from the one the test expected, so there is something to look at',
        ],
        answer: 2,
        explanation: 'A cross is information, not a disaster: the check found a difference between what you expected and what the code did.',
      },
      {
        id: 'ai-testing-qa-03-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent’s generated suite for a payment function has 95% line coverage, but every assertion is `expect(mockGateway.charge).toHaveBeenCalled()`. What is the main weakness?',
        choices: [
          'It will run too slowly in continuous integration',
          'The tests check that a collaborator was called, not that the amount, rounding or refusal behaviour is right, so wrong behaviour still passes',
          'Mocks are not allowed in unit tests of any kind',
          'Coverage above 90% always means the tests are too strict, and they will break on harmless changes such as renaming a variable or reordering lines',
        ],
        answer: 1,
        explanation: 'Call-count assertions pin implementation, not outcomes. The tests execute the lines (high coverage) while checking almost nothing about whether the result is correct.',
      },
    ],
    task: {
      title: 'Run your first generated tests',
      minutes: 18,
      steps: [
        'In a folder with the order page code, use the prompt from this lesson (with your own case table) to have an AI write the test file. If you have no sample app, ask the AI for a tiny function with one rule first.',
        'Run `npm test` yourself. Write down how many passed and failed, and for each failure the actual and expected value.',
        'For every failure, use the reason column to decide: code wrong or test wrong? Write the decision down before you change anything.',
        'Ask the AI to fix only the code, forbid test edits, and run `git diff` (or compare the files) to confirm the test file is unchanged. Run the tests again.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Pick one test and ask the AI: “Explain this test line by line in plain words.” Rewrite its name in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Add a git pre-commit hook or a CI step that runs `npm test` and blocks on failure, and refactor two of the tests into one table-driven test. Check that red still names the failing case.'] },
    ],
  },
  {
    id: 'ai-testing-qa-04',
    day: 4,
    title: 'Test-first prompting',
    summary: 'Write the failing tests before the AI writes the feature, watch them fail for the right reason, then let the AI make them pass without touching them.',
    minutes: 26,
    skills: ['test-first', 'unit-tests'],
    intro: {
      objectives: [
        'Run the red, green, refactor loop with an AI doing the implementing',
        'Check that a new test fails for the right reason before any code is written',
        'Write a prompt that lets the AI loop until the tests pass without editing them',
      ],
      why: 'A failing test is the clearest instruction you can give an AI: it says exactly what “done” means and the AI can check its own work. It also stops the AI deciding for itself what “done” means.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'In lessons 2 and 3 you wrote tests after the code existed. **Test-first** turns that around: for a new behaviour, you write the test *before* any code, watch it fail, and only then write the code that makes it pass. Programmers call this test-driven development, and the cycle is **red** (a test fails because the feature does not exist yet), **green** (the smallest change that makes it pass) and **refactor** (tidy up, with the tests watching). With an AI assistant the cycle is even more useful, because the failing test is the best prompt you can write. It cannot be misread, and the AI can run it as often as it likes to find out whether it is finished.',
      },
      {
        type: 'paragraph',
        text: 'The feature: in lesson 2 Mang Dodong said “capital letters should not matter” for the voucher. Customers type `bahagi10` or ` BAHAGI10 ` with a space, and today they get no discount. This is the one-sentence behaviour: *the voucher works in any capitals and with spaces around it, and any other voucher still gives no discount.*',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The test-first loop. The first red step is not wasted: it proves the test can fail.',
        source: `flowchart LR
  A[Say the behaviour in one sentence] --> B[Write the tests]
  B --> C[Run: they must fail for the right reason]
  C --> D[Commit the tests]
  D --> E[AI writes the smallest code that passes]
  E --> F[Run: green]
  F --> G[Review the diff and tidy up]
  G -->|new behaviour| A`,
      },
      { type: 'heading', text: 'Step 1 and 2: get the tests, and read them' },
      {
        type: 'prompt',
        label: 'Prompt: tests only, no implementation',
        text: 'Add tests to test/pricing.test.js for this behaviour and write NO implementation code: the voucher BAHAGI10 works in any capitals (bahagi10) and with spaces around it ("  BAHAGI10 "); any other voucher (HELLO) still gives no discount. Use 4 sabon (exactly PHP 100) so the correct total is 90 with a working voucher and 100 without. Literal expected numbers only. Do not change pricing.js. Run npm test and show me the full output.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The three tests the AI added to test/pricing.test.js',
        code: `test('the voucher works in lower case', () => {
  assert.equal(orderTotal([{ name: 'sabon', qty: 4 }], 'bahagi10'), 90);
});

test('the voucher works with spaces around it', () => {
  assert.equal(orderTotal([{ name: 'sabon', qty: 4 }], '  BAHAGI10 '), 90);
});

test('a different voucher gives no discount', () => {
  assert.equal(orderTotal([{ name: 'sabon', qty: 4 }], 'HELLO'), 100);
});`,
      },
      { type: 'heading', text: 'Step 3: it must fail, and for the right reason' },
      {
        type: 'code',
        language: 'text',
        label: 'Real output before any code was written',
        code: `✔ adds up the lines when there is no voucher (0.482917ms)
✔ BAHAGI10 does nothing below PHP 100 (0.066333ms)
✔ BAHAGI10 takes 10% off at exactly PHP 100 (0.057ms)
✔ BAHAGI10 takes 10% off above PHP 100 (0.055167ms)
✔ an unknown item is refused (1.236708ms)
✖ the voucher works in lower case (0.574833ms)
✖ the voucher works with spaces around it (0.264375ms)
✔ a different voucher gives no discount (0.081875ms)
ℹ tests 8
ℹ pass 6
ℹ fail 2`,
      },
      {
        type: 'paragraph',
        text: 'Read the run: the five old tests pass, **the lower-case test fails**, **the spaces test fails**, and **“a different voucher gives no discount” passes**. (Under each failure the real output said `100 !== 90`: the code returned 100, the test wanted 90.) Two things to notice. The two failures are red for the right reason, since the shopper pays 100 where the rule wants 90. And the third test is green before any code exists. That is not a mistake: it is a **guard test**. It already holds, but it will turn red if an over-eager implementation starts accepting *every* voucher. The thing to be suspicious of is a test you expected to fail that passes, because that means it checks nothing new.',
      },
      {
        type: 'warning',
        text: 'A new test that passes immediately needs an explanation. Either the behaviour already exists (a guard test, fine), or the test cannot fail (a bug in the test). Find out which before you move on.',
      },
      { type: 'heading', text: 'Step 4 to 6: let the AI make it green' },
      {
        type: 'paragraph',
        text: 'Now commit the tests (`git add -A` and `git commit -m "Tests for voucher capitals and spaces"`). The commit is your evidence: if the AI touches a test, the next diff shows it. Then give the instruction.',
      },
      {
        type: 'prompt',
        label: 'Prompt: make the tests pass, and only that',
        text: 'Make the two failing tests in test/pricing.test.js pass by changing only public/pricing.js. Rules: do not edit, skip or delete any test; make the smallest change; do not add features the tests do not ask for. Run npm test after each change and keep going until all tests pass. If you cannot get them passing in three tries, stop and tell me what you tried. Show the final npm test output and the diff.',
      },
      {
        type: 'code',
        language: 'diff',
        label: 'The AI’s change to pricing.js',
        code: `+function normalizeVoucher(code) {
+  return typeof code === 'string' ? code.trim().toUpperCase() : '';
+}
+
-  if (voucher === 'BAHAGI10' && subtotal >= 100) {
+  if (normalizeVoucher(voucher) === 'BAHAGI10' && subtotal >= 100) {`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output after the change',
        code: `✔ the voucher works in lower case (0.362666ms)
✔ the voucher works with spaces around it (0.354333ms)
✔ a different voucher gives no discount (0.223584ms)
ℹ tests 8
ℹ pass 8
ℹ fail 0`,
      },
      {
        type: 'paragraph',
        text: 'Read the diff before you celebrate. The helper trims the spaces and converts to capitals, and it also handles a missing voucher (`undefined` becomes an empty text), which the page needs when the box is empty. The three words “smallest change” in your prompt kept the AI from rewriting the whole file. Green plus a small diff you understand is a finished loop.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Test-first is like writing the answer key before the exam. First you write down what the right answers are (the tests). They all come out wrong at first, because the student (the code) has not learned the lesson yet: that is **red**. Then the student learns just enough to get them right: **green**. Because you wrote the answer key first, the student cannot quietly change the answers to match their work. In the code above, `.trim()` removes spaces from both ends of a text and `.toUpperCase()` turns every letter into a capital, so `  bahagi10 ` becomes `BAHAGI10`. The `typeof code === \'string\'` part checks that something was typed at all, and if nothing was, it uses an empty text.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** The loop works at agent scale only when the agent cannot move the goalposts. Commit the tests before implementation, run them in a separate step the agent cannot edit, and make the check mechanical: a hook that runs the suite when the agent claims to be done, a CI job that fails if test files changed in an implementation-only branch, or a read-only mount of the tests. Give agents one failing test (or a small group) at a time to keep diffs reviewable, and set a stop condition (attempts, files allowed to change, what to report) so an unattended run cannot grind or weaken assertions. Remember that tests written by the same model that writes the code share its blind spots: have a separate session or a human write the cases that encode the rules.',
      },
      {
        type: 'version',
        text: 'Cursor’s agent best-practices guide describes the same loop under test-driven development: have the agent write tests from expected input and output pairs, confirm they fail before any implementation exists, commit the tests, then have the agent write code that passes them without modifying the tests. Claude Code’s best-practices page gives the same shape in an example prompt (write a failing test that reproduces the problem, then fix it), says to ask for evidence (the command and its output), and describes enforcing the check with a Stop hook. Checked against both pages on this date; the product names for these features and the exact hook settings change often.',
        checked: CHECKED,
        sources: [DOCS.cursorBest, DOCS.ccBest],
      },
      {
        type: 'takeaways',
        items: [
          'Test-first is red (a failing test), green (the smallest change that passes), then refactor.',
          'A failing test is the clearest prompt for an AI: it says what done means and lets the AI check itself.',
          'A new test must fail for the right reason; one that passes immediately is either a guard test or a test that cannot fail.',
          'Commit the tests before implementation, forbid edits to them and ask for the smallest change.',
          'Read the diff: green with a small change you understand is a finished loop.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-04-code-challenge-1',
          kind: 'code-challenge',
          title: 'Make the red tests green',
          prompt: 'These are the tests you were given: `normalizeVoucher` must trim spaces, make the text capital letters, and return an empty text for anything that is not text. Write `normalizeVoucher(code)`.',
          concept: 'making tests pass',
          language: 'javascript',
          starter: 'function normalizeVoucher(code) {\n  return code;\n}\n',
          solution: "function normalizeVoucher(code) {\n  return typeof code === 'string' ? code.trim().toUpperCase() : '';\n}\n",
          tests: {
            kind: 'function',
            fn: 'normalizeVoucher',
            cases: [
              { label: 'lower case', args: ['bahagi10'], expected: 'BAHAGI10' },
              { label: 'spaces around it', args: ['  BAHAGI10 '], expected: 'BAHAGI10' },
              { label: 'another voucher keeps its own letters', args: ['hello'], expected: 'HELLO' },
              { label: 'nothing typed', args: [undefined], expected: '' },
              { label: 'null', args: [null], expected: '' },
            ],
          },
          hints: [
            'Two text methods do most of the work: one removes spaces at both ends, one makes capitals.',
            'The methods are .trim() and .toUpperCase(). Only call them when the value is text.',
            'Use typeof code === \'string\' ? code.trim().toUpperCase() : \'\'.',
          ],
          explanation: 'This is the green step: the smallest code that satisfies the tests. The `typeof` check covers the two non-text cases the tests ask for, and nothing extra was added.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-04-arrange-1',
          kind: 'arrange',
          title: 'Put the loop in order',
          prompt: 'Arrange these steps of a test-first change, first at the top.',
          concept: 'test-first loop',
          language: 'text',
          solution: [
            'Say the behaviour in one sentence',
            'Ask the AI for tests only, with no implementation',
            'Run the tests and check they fail for the right reason',
            'Commit the tests',
            'Ask the AI to make them pass without editing them',
            'Run the tests again and read the diff',
          ],
          reasons: [
            'You decide what you want before anything is written.',
            'The tests become the executable version of that sentence.',
            'A test that has never failed has never been shown to work.',
            'The commit makes any later edit to a test visible.',
            'Now the AI has a clear target and a rule it cannot bend.',
            'Green plus a diff you understand is the end of the loop.',
          ],
          hints: [
            'What has to exist before the tests can be written?',
            'The tests must fail before the code exists, and be saved before the AI starts.',
            'Sentence, tests, red, commit, implement, green and diff.',
          ],
          explanation: 'Behaviour first, then tests, then proof they fail, then a commit that locks them, and only then the implementation. Every step guards against the AI deciding what “done” means.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-04-scenario-1',
          kind: 'scenario',
          title: 'The test that was green from the start',
          prompt: 'Choose what to do.',
          concept: 'tests that cannot fail',
          situation: 'You asked an AI for tests for a new rule: orders over 99 items are refused. It wrote four tests, and when you run them before any code exists, all four are green.',
          options: [
            { text: 'Investigate: show that each test can fail by breaking the rule on purpose, or find out whether the rule already exists, before trusting any of them.', consequence: 'You find the AI’s tests never call the new rule at all (they check a different function), so they would pass forever. You fix them first.', quality: 'best' },
            { text: 'Celebrate: the feature must already work.', consequence: 'Nothing proves the feature works. The tests may simply not be testing it, and the first customer to order 100 items finds out.', quality: 'poor' },
            { text: 'Ask the AI to implement the rule anyway and see if the tests still pass.', consequence: 'They pass before and after, so you learn nothing, and you now have code with no test that guards it.', quality: 'poor' },
            { text: 'Ask the AI whether the tests are good.', consequence: 'It will say yes. Only running a test that is expected to fail can show whether it is able to.', quality: 'acceptable' },
          ],
          hints: [
            'What does a green test tell you if it could never have been red?',
            'A test is trustworthy once you have seen it fail.',
            'Make each one fail on purpose, or find out why it already passes.',
          ],
          explanation: 'Seeing a test fail is how you know it can. A green start is a question to answer, not a result to enjoy.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-04-q1',
        prompt: 'Why is a failing test a better instruction for an AI than a paragraph describing the feature?',
        choices: [
          'It cannot be misread, and the AI can run it repeatedly to find out whether it has finished',
          'AI models understand code better than they understand English',
          'It makes the AI write shorter code than it otherwise would',
          'A failing test lets you skip reading the code the AI produces afterwards, because the test has already proved it right',
        ],
        answer: 0,
        explanation: 'A test is precise and runnable. The AI gets an unambiguous target and a way to check itself, while you keep the job of deciding the target.',
      },
      {
        id: 'ai-testing-qa-04-q2',
        prompt: 'You wrote a new test and ran it before the feature existed. It passed. What should you do first?',
        choices: [
          'Move on: passing tests are always good news',
          'Delete the test, because tests for features that do not exist yet are not allowed in a project',
          'Work out why: either the behaviour already exists (a guard test) or the test cannot fail',
          'Rewrite it with a bigger number so that it is more likely to fail',
        ],
        answer: 2,
        explanation: 'A test you expected to fail but that passes either guards existing behaviour or checks nothing. You need to know which before relying on it.',
      },
      {
        id: 'ai-testing-qa-04-q3',
        prompt: 'Why commit the tests before asking the AI to implement the feature?',
        choices: [
          'Git refuses to let an AI edit any file in the project that has not already been committed',
          'Tests run faster once they are committed to the repository',
          'It saves the AI from needing to read the test file',
          'Any change the AI makes to a test then shows up clearly in the next diff',
        ],
        answer: 3,
        explanation: 'The commit is a fixed reference. If the AI quietly changes an expected value to make a test pass, `git diff` shows it immediately.',
      },
      {
        id: 'ai-testing-qa-04-q4',
        prompt: 'Which prompt is the best test-first instruction for the implementation step?',
        choices: [
          '“Fix the voucher so it works properly.”',
          '“Rewrite pricing.js to be cleaner and handle every voucher case, capital letter and spelling mistake you can think of, and tidy up the tests while you are there.”',
          '“Make the failing tests pass by changing only pricing.js. Do not edit tests. Smallest change. Run npm test and stop after three tries.”',
          '“Update the tests and the code so that they agree with each other.”',
        ],
        answer: 2,
        explanation: 'It names the target (the failing tests), the only file that may change, the forbidden move (editing tests), the size of the change, the check and a stop condition. The others invite the AI to decide what “right” is.',
      },
      {
        id: 'ai-testing-qa-04-q5',
        audience: { max: 'beginner' },
        prompt: 'In “red, green, refactor”, what does red mean?',
        choices: [
          'A test fails because the feature does not exist yet',
          'The code has a spelling mistake that the computer found',
          'The test is finished and can be deleted',
        ],
        answer: 0,
        explanation: 'Red is the expected first state: a test that describes something the code cannot do yet. You want to see it red so you know it can fail.',
      },
      {
        id: 'ai-testing-qa-04-q6',
        audience: { min: 'advanced' },
        prompt: 'You run a coding agent unattended on a failing suite. Which setup best stops it from weakening the tests to get green?',
        choices: [
          'A prompt that says “please do not change the tests”, and nothing else',
          'Letting the agent decide for itself whether a test is wrong, since it has the most context about the code and can judge fastest which side should move',
          'Running the suite from a step the agent cannot edit, with a check that fails the run if test files changed, plus a stop condition on attempts',
          'Asking the agent to write a summary of why each test passed once it has finished',
        ],
        answer: 2,
        explanation: 'A request can be ignored or forgotten; a mechanical check cannot. Separating who writes the tests from who makes them pass, and bounding the attempts, keeps the target fixed.',
      },
    ],
    task: {
      title: 'One feature, test-first',
      minutes: 20,
      steps: [
        'Choose a small behaviour for your app (for example: a quantity above 99 is refused). Write it as one sentence.',
        'Use the first prompt of this lesson to get tests only. Run them and check each fails for the right reason. Note any that pass at once and decide why.',
        'Commit the tests. Use the second prompt to have the AI make them pass.',
        'Read the diff of the code and confirm the test file is unchanged. Write one sentence about what the AI did that you would not have thought of.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain its code change in plain words, line by line, and say which test each line is there to satisfy. Delete any line it cannot tie to a test.'] },
      { audience: { min: 'advanced' }, steps: ['Add a script or CI check that fails when files under test/ change in a commit that also changes implementation files, and run the agent against it with a deliberately tempting failing test.'] },
    ],
  },
  {
    id: 'ai-testing-qa-05',
    day: 5,
    title: 'Test what a user does: end-to-end checks',
    summary: 'Drive the real page in a real browser the way a shopper would, using Playwright, and learn to read user-facing locators, auto-waiting and a failure that was not the app’s fault.',
    minutes: 28,
    skills: ['e2e-tests', 'unit-tests'],
    intro: {
      objectives: [
        'Explain what an end-to-end test proves that unit tests cannot',
        'Read a Playwright test and say what each line does',
        'Prompt an AI for a browser test that finds things the way a user would and never waits with a fixed pause',
      ],
      why: 'Your unit tests can all be green while the page is broken: the button is not connected, the label is wrong, the total never reaches the screen. A browser test is the only check that proves a shopper can actually finish an order.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Your logic tests prove that `orderTotal` is right. They say nothing about whether the page uses it. Maybe the AI wired the button to the wrong function, forgot to show the answer, or the input names do not match. An **end-to-end test** (people write *e2e*) opens the real page in a real browser and does what a shopper does: types into boxes, presses a button, reads the screen. If that works, then the page, the script and the logic are working together. The cost is speed and fragility, so you write few of these, on the journeys that matter most. For Mang Dodong that is one: order something, apply the voucher, see the right total.',
      },
      {
        type: 'paragraph',
        text: 'The tool we use is **Playwright**, which controls a browser from a test file. It is one of several (Cypress is another), and what you learn here applies to them. First it needs a small config that starts the page for the test and says where it lives.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'playwright.config.js',
        code: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  webServer: { command: 'node server.js', url: 'http://localhost:4310', reuseExistingServer: false },
  use: { baseURL: 'http://localhost:4310' },
});`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'e2e/order.spec.js',
        code: `import { test, expect } from '@playwright/test';

test('a shopper sees the total with a voucher', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Sabon').fill('5');
  await page.getByLabel('Voucher').fill('BAHAGI10');
  await page.getByRole('button', { name: 'Compute total' }).click();
  await expect(page.getByRole('status')).toHaveText('Total: PHP 112.5');
});`,
      },
      {
        type: 'paragraph',
        text: 'Read it as the shopper’s story. `page` is a fresh browser tab that Playwright gives each test. `goto(\'/\')` opens the home page. `getByLabel(\'Sabon\')` finds the box whose label says Sabon, and `fill(\'5\')` types 5 in it. The voucher box is filled in the same way. `getByRole(\'button\', { name: \'Compute total\' })` finds the button by what it *is* and what it *says*, and `click()` presses it. Finally `expect(...).toHaveText(...)` checks that the status line on the page reads “Total: PHP 112.5”: 5 × 25 is 125, minus the 10% voucher. `async` and `await` just mean “wait for the browser to finish this step before the next one”. The real run, in headless Chromium (no window shown):',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: npx playwright test',
        code: `Running 1 test using 1 worker

  ✓  1 e2e/order.spec.js:3:1 › a shopper sees the total with a voucher (154ms)

  1 passed (770ms)`,
      },
      { type: 'heading', text: 'Find things the way a user does' },
      {
        type: 'paragraph',
        text: 'AI-written browser tests often find elements with fragile CSS paths like `div > label:nth-child(3) > input`. They work until someone adds a line to the page, then they break while nothing is wrong. Ask instead for **user-facing locators**: by role (button, heading), by label text or by visible text. They survive redesigns, and they double as a gentle accessibility check, because if the test cannot find the box by its label, a screen reader cannot either.',
      },
      { type: 'heading', text: 'Never wait with a fixed pause' },
      {
        type: 'paragraph',
        text: 'The other habit to forbid is `waitForTimeout(3000)`: “wait three seconds and hope”. It makes tests slow when the page is quick and flaky when the page is slow. Playwright already waits properly: before it clicks or types it checks that the element is visible and ready, and `expect(...)` assertions keep re-checking until they hold or time out. Say so in the prompt.',
      },
      {
        type: 'prompt',
        label: 'Prompt: a browser test with the right habits',
        text: 'Write one Playwright test in e2e/order.spec.js for this journey: open the page, enter 5 for Sabon and the voucher BAHAGI10, press "Compute total", and check the status text reads "Total: PHP 112.5". Rules: find elements only with getByRole or getByLabel, no CSS selectors or XPath; never use waitForTimeout or sleeps, rely on Playwright\'s auto-waiting and expect assertions; use a baseURL from the config; no test depends on another. Then run npx playwright test and show me the full output. If it fails, show me the failure and wait: do not change the assertion.',
      },
      { type: 'heading', text: 'A failure that was not the app’s fault' },
      {
        type: 'paragraph',
        text: 'The first time this test was run for this course it failed. The output said `waiting for getByLabel(\'Sabon\')` and then `Test timeout of 30000ms exceeded`, thirty seconds of nothing. The page snapshot the tool saved showed a navigation menu the order page does not have. Something else on that computer was already using the port (3000 at the time), and the config had `reuseExistingServer: true`, so Playwright happily used *that* program instead of starting ours. The test was fine and the app was fine: it was looking at the wrong website. The fix was a different port and `reuseExistingServer: false`, which makes Playwright stop with an error when something already holds the address. A failing browser test therefore starts with one question: **am I even looking at my app?**',
      },
      {
        type: 'table',
        headers: ['Question', 'Best layer', 'Why'],
        rows: [
          ['Does exactly PHP 100 get the discount?', 'Unit test', 'A known answer from one function, run in milliseconds'],
          ['Does the voucher work in lower case?', 'Unit test', 'It is a rule inside the function, no page needed'],
          ['Can a shopper type, press and see a total?', 'End-to-end test', 'It proves the page, script and logic are connected'],
          ['Does a bad quantity show a message instead of a total?', 'End-to-end test (one case)', 'The message must reach the screen; the rule itself is unit tested'],
          ['Does the page look good on a small phone?', 'A person, by eye', 'Judgment about layout is hard to script'],
        ],
        caption: 'Put each check at the cheapest layer that can prove it. Most checks are unit tests; a few journeys are end to end.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A unit test checks one ingredient; an end-to-end test cooks the whole dish and tastes it. A *browser* is the program you use to visit websites. *Headless* means the browser runs without showing a window, so the test can run quietly and fast. A *locator* is how the test points at something on the page: “the box labelled Sabon” is a good locator because it is how a person would say it. A *port* is like a numbered door on your computer: only one program can stand at door 3000 at a time, which is how our first run ended up talking to the wrong program. Read the test line by line again and say aloud, in your own words, what a shopper does at each line.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** End-to-end tests are expensive: slower, flakier and harder to diagnose than lower layers, so keep a thin set of critical journeys and push every rule down to unit or integration tests. Make them deterministic: isolated state per test (Playwright gives each test a fresh browser context), seeded data, controlled time, and network calls stubbed or pointed at a test backend you own. Prefer role and label locators, with test ids as an explicit contract only where no accessible name exists. A flaky test is a bug in the test or the app, never something to hide with retries or longer timeouts: find what it is racing. Run headed or step through it locally to reproduce, and keep failure artifacts in CI. AI can generate browser tests quickly, and the same speed makes a bloated, brittle suite, so review each one for the single behaviour it protects.',
      },
      {
        type: 'version',
        text: 'Checked against Playwright 1.65 (Node.js 22.x, 24.x or 26.x are listed as supported): `npx playwright test` runs tests headless by default (`--headed` shows the window), `npx playwright install` downloads the browsers, and each test gets a fresh isolated browser context. Locators are the basis of auto-waiting and the docs recommend user-facing ones such as `getByRole`; actions wait until the element is ready; and `expect` assertions such as `toHaveText` retry until they pass or time out (5 seconds by default). With `webServer`, `reuseExistingServer: false` makes Playwright throw if something already uses the address. Playwright releases often, so check the version in your project.',
        checked: CHECKED,
        sources: [DOCS.pwIntro, DOCS.pwWriting, DOCS.pwLocators, DOCS.pwAssertions, DOCS.pwActionability, DOCS.pwWebServer],
      },
      {
        type: 'version',
        text: 'AI can now drive or write browser tests for you. The Playwright MCP server lets an AI coding tool operate a page through its accessibility tree (for Claude Code the docs show `claude mcp add playwright npx @playwright/mcp@latest`), and Playwright’s test agents (planner, generator and healer, set up with `npx playwright init-agents --loop=<tool>`) can explore an app, write tests and repair failing ones; the docs warn that generated tests may need fixing and that the healer may skip a test it decides is really broken. Treat everything they write as a draft you read and run yourself. Checked on this date; this area is changing quickly.',
        checked: CHECKED,
        sources: [DOCS.pwMcp, DOCS.pwAgents],
      },
      {
        type: 'takeaways',
        items: [
          'An end-to-end test drives the real page in a real browser, so it proves the page, script and logic work together.',
          'Keep end-to-end tests few and on the key journeys; push every rule down to fast unit tests.',
          'Find elements by role, label and visible text, and never wait with a fixed pause: Playwright waits and retries for you.',
          'A browser test that times out may be looking at the wrong site: check the address and the port first.',
          'Treat tests written or repaired by an AI browser agent as drafts to read, run and review.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-05-fix-bug-1',
          kind: 'fix-bug',
          title: 'A fragile locator',
          prompt: 'The AI found the Sabon box with a position-based CSS path. Tap the fragile line and choose the user-facing fix.',
          concept: 'user-facing locators',
          language: 'javascript',
          code: `test('a shopper sees the total with a voucher', async ({ page }) => {
  await page.goto('/');
  await page.locator('div > label:nth-child(3) > input').fill('5');
  await page.getByLabel('Voucher').fill('BAHAGI10');
  await page.getByRole('button', { name: 'Compute total' }).click();
  await expect(page.getByRole('status')).toHaveText('Total: PHP 112.5');
});`,
          bugLine: 3,
          fixes: [
            { line: "  await page.getByLabel('Sabon').fill('5');", correct: true, why: 'It finds the box the way a person would, by its label, so it survives any change to the page structure.' },
            { line: "  await page.locator('input').nth(2).fill('5');", correct: false, why: 'This still depends on position: add one box before it and the test types into the wrong field.' },
            { line: "  await page.locator('#sabon').fill('5');", correct: false, why: 'It assumes an id the page does not have, and an id is not something a shopper sees.' },
            { line: "  await page.waitForTimeout(500);\n  await page.locator('div > label:nth-child(3) > input').fill('5');", correct: false, why: 'A fixed pause does not make a position-based locator any less fragile, and adds a wait the test does not need.' },
          ],
          hints: [
            'Which line depends on where things happen to sit in the page?',
            'How would a shopper describe that box? Look at how the voucher box is found on the next line.',
            'Use getByLabel with the word Sabon.',
          ],
          explanation: 'Locators that use what a user sees (a label, a role, visible text) keep working when the page is restyled or reorganised. Position-based paths break for no good reason, and a test that breaks while nothing is wrong teaches people to ignore red.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-05-scenario-1',
          kind: 'scenario',
          title: 'Thirty seconds of nothing',
          prompt: 'Choose your first move.',
          concept: 'diagnosing a failing browser test',
          situation: 'A new browser test fails with “Test timeout of 30000ms exceeded” while waiting for a box labelled Sabon. The unit tests are green and the page works when you open it yourself.',
          options: [
            { text: 'Check what the test is really looking at: is it the right address and port, and is the page it opened your order page?', consequence: 'You find another program on the same port. Switching ports (and refusing to reuse a running server) fixes it in a minute.', quality: 'best' },
            { text: 'Raise the timeout to 120 seconds.', consequence: 'The test now fails after two minutes instead of thirty seconds. The page it is waiting for never contains the box.', quality: 'poor' },
            { text: 'Add a retry so the test runs three times.', consequence: 'It fails three times, now taking longer. A retry does not help a test that is looking at the wrong thing.', quality: 'poor' },
            { text: 'Ask the AI to rewrite the test using a different locator.', consequence: 'A different locator could not fix a wrong page. You may get a test that passes for the wrong reason later.', quality: 'acceptable' },
          ],
          hints: [
            'The unit tests are green and the page works by hand. What differs for the browser test?',
            'Look at the page snapshot or open the address the test uses. Does it look like your app?',
            'Check the address and port first, and stop reusing a server that is already running.',
          ],
          explanation: 'A timeout waiting for something that should be there is often a sign that the test is on a different page than you think. Look at what the browser actually loaded before changing the test.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-05-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'What each test line does',
          prompt: 'Tap each card to check you can say what the line does.',
          concept: 'reading a browser test',
          cards: [
            { front: "page.goto('/')", back: 'Opens the home page of the app in the test browser.' },
            { front: "page.getByLabel('Sabon').fill('5')", back: 'Finds the box labelled Sabon and types 5 into it.' },
            { front: "getByRole('button', { name: 'Compute total' }).click()", back: 'Finds the button that says Compute total and presses it.' },
            { front: "expect(...).toHaveText('Total: PHP 112.5')", back: 'Checks that the text on the page is what we expect, and keeps checking for a few seconds before it gives up.' },
          ],
          hints: ['Read each line as one thing a shopper does with their finger or eyes.'],
          explanation: 'A browser test is a list of things a shopper does, written so the computer can do them.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-05-q1',
        prompt: 'Which problem can an end-to-end test catch that a passing unit test of `orderTotal` cannot?',
        choices: [
          'The discount is calculated at the wrong boundary',
          'The voucher text is compared with the wrong capital letters inside the function, so lower case never matches',
          'The function accepts a negative quantity without complaint',
          'The Compute total button is not connected to the calculation, so no total ever appears',
        ],
        answer: 3,
        explanation: 'Unit tests call the function directly, so they cannot see whether the page uses it. The other three are all problems inside the function, which a unit test can catch faster.',
      },
      {
        id: 'ai-testing-qa-05-q2',
        prompt: 'Which locator is the best choice for the Voucher box?',
        choices: [
          'page.locator("form > label:nth-child(4) > input")',
          'page.locator("input").last()',
          'page.getByLabel("Voucher")',
          'page.locator("xpath=//body/form/label[4]/input")',
        ],
        answer: 2,
        explanation: 'A label is how a person finds the box, and it survives a change to the page structure. The other three depend on where the box happens to be.',
      },
      {
        id: 'ai-testing-qa-05-q3',
        prompt: 'An AI wrote `await page.waitForTimeout(3000)` before an assertion. What is the problem?',
        choices: [
          'Nothing: waiting a fixed time is the safest way to make sure the page has loaded, since slow phones sometimes need several extra seconds',
          'It wastes time when the page is fast and still fails when the page is slow; Playwright auto-waits and retries assertions instead',
          'Playwright does not allow any waiting at all inside a test file',
          'It makes the test run in a different browser than the one configured',
        ],
        answer: 1,
        explanation: 'A fixed pause is a guess. Locators and `expect` assertions wait exactly as long as needed and no longer.',
      },
      {
        id: 'ai-testing-qa-05-q4',
        prompt: 'Where is the best place to check that exactly PHP 100 with BAHAGI10 gives 90?',
        choices: [
          'In an end-to-end test, since that is how a shopper meets the rule',
          'Nowhere, since the exploratory testing covers it',
          'In both, as a separate browser test for every possible order total, so each rule is also proven in the browser',
          'In a unit test of orderTotal, because it is a rule inside one function and a unit test is fast',
        ],
        answer: 3,
        explanation: 'A rule inside one function belongs at the cheapest layer that can prove it. The browser test only needs to prove that the answer reaches the screen once.',
      },
      {
        id: 'ai-testing-qa-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is an end-to-end test?',
        choices: [
          'A test that checks the last line of every file in the project',
          'A test that only runs once the whole project has been uploaded to the internet',
          'A test that uses the real page in a browser, doing what a shopper does',
        ],
        answer: 2,
        explanation: 'It starts at the shopper’s first click and ends at what they read on screen, so it covers the whole path.',
      },
      {
        id: 'ai-testing-qa-05-q6',
        audience: { min: 'advanced' },
        prompt: 'A generated browser test passes locally but fails about one run in ten in CI. What is the best first step?',
        choices: [
          'Set retries to 3 in the config so the build goes green most of the time, and leave a note in the pipeline saying that the test is known to be unreliable',
          'Double every timeout in the config',
          'Find the race: look for fixed pauses, assertions that do not retry, shared state or data between tests, and reproduce it by running the test repeatedly',
          'Delete the test, because flaky tests cannot be fixed',
        ],
        answer: 2,
        explanation: 'Flakiness is a symptom of a race or shared state. Retries and longer timeouts hide it and make the suite slower; finding the cause keeps the test honest.',
      },
    ],
    task: {
      title: 'Your first browser test',
      minutes: 20,
      steps: [
        'In your sample app folder run `npm install -D @playwright/test` and `npx playwright install chromium`. Add a playwright.config.js with a webServer and baseURL like the one in this lesson, using a port nothing else uses.',
        'Use the prompt from this lesson to get one browser test of the order journey. Read each line and say what a shopper does.',
        'Run `npx playwright test`, then run it again with `--headed` to watch it. Break the page on purpose (rename the button) and confirm the test fails with a message that points at the button.',
        'Search the test for waitForTimeout and CSS paths. If the AI used either, ask it to replace them and explain why.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain what “headless” means and what a locator is, with an everyday example, then write both in your own words next to the test.'] },
      { audience: { min: 'advanced' }, steps: ['Add a second journey, an invalid quantity that must show the message, and make sure each test sets up and cleans its own state. Run the file ten times in a loop and record any flakiness.'] },
    ],
  },
  {
    id: 'ai-testing-qa-06',
    day: 6,
    title: 'Exploratory and manual testing with AI',
    summary: 'Run a short, focused session of poking at the app by hand, use AI to brainstorm odd behaviour, keep honest notes, and turn what you find into bugs and questions.',
    minutes: 26,
    skills: ['exploratory', 'test-cases'],
    intro: {
      objectives: [
        'Write a charter that gives a testing session a clear, small purpose',
        'Use AI to brainstorm odd inputs, then pick the ones worth trying by risk',
        'Keep notes that separate what you saw from what you guess, and sort findings into bugs, questions and ideas',
      ],
      why: 'Scripted tests only check what someone already thought of. A short session of curious poking finds the problems nobody predicted, which in AI-built apps are the decisions the AI made silently.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'So far every check started from a rule you knew. **Exploratory testing** is the opposite: you learn about the app, think of tests and run them all in one go, steered by what you just saw. It is not random clicking. A good session has a purpose, a time limit and notes. Its great strength is finding the surprising behaviour that no one thought to write a test for, and AI-built apps are full of it, because every rule your prompt did not mention was settled by a guess.',
      },
      { type: 'heading', text: 'Start with a charter' },
      {
        type: 'paragraph',
        text: 'A **charter** is one sentence that says where to look and what you want to learn, so a session of thirty minutes does not wander. A handy shape is: *Explore* an area *with* some idea or tool *to discover* some kind of information. For Mang Dodong’s page: “Explore the quantity boxes with odd input (negative, decimal, empty, huge) to discover how the page behaves where nobody planned for it.” Small and sharp beats big and vague.',
      },
      {
        type: 'prompt',
        label: 'Prompt: brainstorm, then you choose',
        text: 'I will spend 30 minutes testing a small order page for a sari-sari store by hand. It has three number boxes (kape, asin, sabon), a voucher text box and a Compute total button; the total appears under the form. Rules: quantity should be a whole number from 0 to 99, and the voucher BAHAGI10 takes 10% off orders of PHP 100 or more. Give me 15 odd or unlucky things a tired shopper in a hurry might do, grouped by the box they involve. For each one write what I should look for, not what the answer is. Mark the five you think are most likely to reveal a real bug.',
      },
      {
        type: 'paragraph',
        text: 'The AI’s list is a starting point, not a plan. You cross off ideas that cannot happen, add what only you know (“Mang Dodong’s customers often type numbers with a comma”), and keep the handful with the highest risk. Then you actually try them: the session is a human looking at a real screen. An AI can also drive a browser for you, but then you read what it did and what it saw, because it will report things as fine that a human would find odd.',
      },
      { type: 'heading', text: 'Notes: what you saw, what you guess' },
      {
        type: 'paragraph',
        text: 'While you test, keep three short lists: **bugs** (something clearly wrong), **questions** (behaviour nobody has decided yet) and **ideas** (things to test later). For each bug write the steps you took and what you *saw*, kept apart from what you *suppose* is the cause. “The total shows PHP -36” is an observation. “Probably the quantity is not validated” is a guess. Mixing them wastes the next person’s time, and it is the habit that makes a later bug report good (lesson 7).',
      },
      {
        type: 'paragraph',
        text: 'Here is a real session. The page reads each box with `Number(...)`, which turns typed text into a number: empty text becomes 0, `1e2` (a way of writing 100) becomes 100, and nonsense becomes `NaN` (“not a number”). We tried each input in a real browser, with Playwright doing the typing, and wrote down exactly what the page said.',
      },
      {
        type: 'table',
        headers: ['Tried (kape box)', 'What the page showed', 'Verdict'],
        rows: [
          ['-3', 'Total: PHP -36', 'Bug: a negative bill'],
          ['1.5', 'Nothing happened; no total and no message from the page', 'Question: the browser blocked it; what does the shopper see?'],
          ['(left empty)', 'Total: PHP 0', 'Question: is empty the same as zero?'],
          ['1e2', 'Total: PHP 1200', 'Bug: 100 kape accepted, over the limit'],
          ['100', 'Total: PHP 1200', 'Bug: no maximum is enforced'],
          ['-3 kape with 10 sabon and BAHAGI10', 'Total: PHP 192.6', 'Bug: a negative line lowers the bill, and the voucher still applies'],
        ],
        caption: 'Real results from the session. A discount of 10% on 214 (250 for the sabon minus 36 for the “negative” kape) leaves 192.6, less than the 225 honest customers would pay.',
      },
      {
        type: 'paragraph',
        text: 'Look at the last row. A shopper who types -3 for kape pays *less* for the same sabon. That is a money bug, not a cosmetic one, and no ordinary test would have found it, because nobody had decided what a negative quantity meant. The 1.5 row is a good example of a question: the page’s number boxes only accept whole numbers (a built-in browser check stopped the form), but the browser’s check is not a safeguard we can rely on, because it lives in the page and anyone can bypass it. The calculation has to refuse bad quantities itself.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Exploratory testing is like test-driving a car you have never driven: you do not read a checklist, you pull out of the driveway and notice. A *charter* is the plan for the drive (“see how it handles a steep hill”). Writing notes is writing down what you felt, not what you think is wrong under the hood. An *observation* is what you saw with your own eyes (“the total says -36”); a *guess* is why you think it happened. The table above is exactly that: what we typed, what came back, and what we think of it. `Number(...)` is a tool that turns typed text such as `"5"` into the number 5; `NaN` is what it gives when the text is not a number at all.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat exploration as session-based testing: a time-boxed charter, a debrief, and notes that record coverage (what was tried) as well as findings. Choose charters from risk and from the model of the product (inputs, data, state, interfaces, platforms, time) rather than from the UI alone, and use oracles explicitly to decide what counts as a bug: consistency with the spec, with similar products, with the product’s own earlier behaviour, with what a user would reasonably expect, and with the law of conservation of money. An agent driving a browser extends your reach but not your judgment: have it record the exact steps so the session is replayable, check its screenshots yourself, and promote each real finding to a failing automated test so exploration feeds the regression suite instead of living in someone’s memory.',
      },
      {
        type: 'version',
        text: 'MDN’s documentation for `<input type="number">` says the default `step` is 1 (so a typed 1.5 fails validation), that `min` and `max` set limits, and that values typed by a user are checked by the browser’s own constraint validation. It also warns that a user can change the HTML behind the scenes, so client-side validation must not be relied on for anything that matters and must be repeated in code you control. Checked on this date; browser interface details for invalid values (the exact message and where it appears) differ between browsers and versions.',
        checked: CHECKED,
        sources: [DOCS.mdnNumber],
      },
      {
        type: 'takeaways',
        items: [
          'Exploratory testing is learning, designing and running tests at once, guided by what you just saw.',
          'A charter is one sentence (explore this, with that, to discover what) that keeps a session small and focused.',
          'Use AI to brainstorm odd behaviour, then choose by risk and try it yourself on the real screen.',
          'Keep notes in three lists (bugs, questions, ideas), and separate what you saw from what you guess.',
          'Every finding becomes a bug report or a question for the owner, and later a test.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-06-predict-output-1',
          kind: 'predict-output',
          title: 'What does Number() make of it?',
          prompt: 'The page turns each typed box into a number with `Number(...)`. What does this print?',
          concept: 'odd input',
          language: 'javascript',
          code: `console.log(Number('1e2'));
console.log(Number(''));
console.log(Number('1.5'));
console.log(Number('abc'));
console.log(Number('-3'));`,
          choices: [
            '100\n0\n1.5\nNaN\n-3',
            '1\n0\n1.5\nNaN\n3',
            '100\nNaN\n1.5\nNaN\n-3',
            '12\n0\n15\n0\n-3',
          ],
          wrongNotes: {
            '1\n0\n1.5\nNaN\n3': '`1e2` is a way of writing 1 times 10 to the power 2, which is 100, and -3 keeps its minus sign.',
            '100\nNaN\n1.5\nNaN\n-3': 'Empty text is turned into 0, not NaN. That is why an empty box showed a total of PHP 0.',
            '12\n0\n15\n0\n-3': 'Number reads the whole text as one number: 1e2 is 100, 1.5 is one and a half, and text that is not a number at all is NaN, not 0.',
          },
          hints: [
            'Number turns typed text into a number. What number is “1e2”?',
            'Empty text becomes 0, and text that is not a number at all becomes NaN.',
            '100, 0, 1.5, NaN and -3.',
          ],
          explanation: '`1e2` means 100, an empty box becomes 0, 1.5 stays 1.5, nonsense becomes NaN and -3 stays negative. None of these is refused: that is why the page accepted quantities nobody planned for.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-06-match-1',
          kind: 'match',
          title: 'Bug, question or idea?',
          prompt: 'Sort each note from a testing session into the list it belongs in.',
          concept: 'sorting findings',
          labels: { terms: 'The note', meanings: 'Where it goes' },
          pairs: [
            { term: 'Typing -3 for kape shows “Total: PHP -36”', definition: 'Bugs: something is clearly wrong', note: 'The total is below zero and the rules are clear that this is wrong, so it is a bug rather than a question.' },
            { term: 'Should an empty quantity box mean zero, or be refused?', definition: 'Questions: nobody has decided yet', note: 'The rules do not say, so the owner has to decide before anyone can call it a bug.' },
            { term: 'A “Clear order” button would save shoppers time', definition: 'Ideas: to look at later', note: 'It is not a fault in what exists: it is something new to consider after the problems are dealt with.' },
          ],
          hints: [
            'Which note describes something the rules already say is wrong?',
            'Which one cannot be called right or wrong until someone decides?',
            'A fault goes to bugs, an undecided matter goes to questions, something new goes to ideas.',
          ],
          explanation: 'Sorting findings keeps a session useful: bugs get reported, questions go to the person who can decide, and ideas wait until they are worth the time.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-06-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'The parts of a testing session',
          prompt: 'Tap each card to check you can say it in your own words.',
          concept: 'exploratory testing vocabulary',
          cards: [
            { front: 'Charter', back: 'One sentence saying where to look and what you want to learn, so the session stays focused.' },
            { front: 'Observation', back: 'What you actually saw, such as “the total says PHP -36”.' },
            { front: 'Guess', back: 'Why you think it happened. Useful, but kept apart from what you saw.' },
            { front: 'Time box', back: 'A fixed length for the session, such as thirty minutes, so you stop and write up what you found.' },
          ],
          hints: ['Think of a short test drive with a purpose and a notebook.'],
          explanation: 'A short, focused session with honest notes is worth more than a long wander.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-06-q1',
        prompt: 'What is the main job of a charter in an exploratory session?',
        choices: [
          'To list every test case in advance so the tester does not have to think',
          'To give the AI permission to run the browser',
          'To keep a timed session aimed at one area and one kind of discovery',
          'To record the bugs that were found during the session',
        ],
        answer: 2,
        explanation: 'A charter says where to look and what to learn. Without it, thirty minutes of clicking tends to cover the easy parts again and again.',
      },
      {
        id: 'ai-testing-qa-06-q2',
        prompt: 'Which note is a good observation, kept apart from a guess?',
        choices: [
          'The quantity check is obviously missing from the code',
          'I typed -3 in the kape box, pressed Compute total and the page showed “Total: PHP -36”',
          'The page is probably broken for negative numbers because of the way it reads what was typed into the box',
          'Weird total with negative numbers, someone should look at it',
        ],
        answer: 1,
        explanation: 'It names the steps and the exact result, with no theory about the cause. The others are guesses or too vague for someone to reproduce.',
      },
      {
        id: 'ai-testing-qa-06-q3',
        prompt: 'The AI gave you 15 odd-input ideas. What is the best way to use them?',
        choices: [
          'Try all fifteen in order and report each one as a bug',
          'Add them all to the automated suite without looking at them',
          'Cross off the ones that cannot happen, add what only you know, and try the few with the highest risk',
          'Ignore them, because an AI cannot know how real people use an order page in a shop on the other side of town',
        ],
        answer: 2,
        explanation: 'The AI widens your thinking, you apply judgment. Choosing by risk and adding local knowledge turns a list into a plan.',
      },
      {
        id: 'ai-testing-qa-06-q4',
        prompt: 'A quantity of 1.5 does nothing on the page because the browser blocks the form. Why is the calculation still worth fixing?',
        choices: [
          'Because the browser’s check can be bypassed, so the calculation must refuse bad quantities itself',
          'Because browsers sometimes forget to check number boxes on mobile phones in particular, even when the box has a step set',
          'Because the browser’s message is always in the wrong language for shoppers',
          'Because Playwright cannot type 1.5 into a number box',
        ],
        answer: 0,
        explanation: 'A check that lives only in the page can be skipped by anyone who changes the page or calls the code another way. The logic needs its own check.',
      },
      {
        id: 'ai-testing-qa-06-q5',
        audience: { max: 'beginner' },
        prompt: 'What is exploratory testing, in everyday words?',
        choices: [
          'Running a script that tests the same thing every night',
          'Using the app with curiosity and a plan, noticing anything odd, and writing it down',
          'Reading the code carefully to find mistakes, without running the program or typing anything into the page',
        ],
        answer: 1,
        explanation: 'It is a test drive with a purpose: you learn the app while you test it and note what surprises you.',
      },
      {
        id: 'ai-testing-qa-06-q6',
        audience: { min: 'advanced' },
        prompt: 'During exploration, the total for a basket with a negative line is lower than for the same basket without it. Which oracle best justifies calling this a bug when no spec covers it?',
        choices: [
          'Consistency with the product’s own purpose and basic expectations: buying less should never make the customer pay less in total',
          'Consistency with the code: the function returned a number, so it did exactly what it was written to do and nothing is wrong with it',
          'Consistency with the last release’s screenshots, which looked the same',
          'The agent that drove the browser reported that the page looked fine',
        ],
        answer: 0,
        explanation: 'When no spec exists, an oracle such as purpose and reasonable expectation (or the conservation of money) can still show that behaviour is wrong. The code itself and an agent’s opinion cannot serve as an independent judge.',
      },
    ],
    task: {
      title: 'A thirty-minute session',
      minutes: 20,
      steps: [
        'Write a one-sentence charter for one area of your app (for example, “Explore the voucher box with odd text to discover whether discounts can be gained by mistake”).',
        'Use the prompt from this lesson (changed to your app) to brainstorm. Cross off, add and pick the five riskiest ideas.',
        'Set a timer for 25 minutes and try them on the real page. Keep three lists as you go: bugs, questions, ideas. For each bug write the steps and the exact result.',
        'Finish by choosing the one bug you would fix first and the one question you will ask the owner.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to read your notes and mark any line that is a guess rather than something you saw. Rewrite those lines as observations.'] },
      { audience: { min: 'advanced' }, steps: ['Ask an agent with a browser tool to run the same charter and record its steps. Compare its findings and coverage with yours, and write a failing automated test for each real finding.'] },
    ],
  },
  {
    id: 'ai-testing-qa-07',
    day: 7,
    title: 'Writing bug reports that get fixed',
    summary: 'Write a bug report that a person or a coding agent can reproduce and fix without asking questions, use AI to draft it honestly, and end it with a failing test.',
    minutes: 24,
    skills: ['bug-reports', 'exploratory'],
    intro: {
      objectives: [
        'List the parts of a bug report and what each one is for',
        'Turn rough session notes into a report using AI without letting it invent steps',
        'Add a failing test to a report so that the fix can be proven',
      ],
      why: 'A bug nobody can reproduce does not get fixed, and an AI agent handed a vague report will fix something else. A clear report is the cheapest way to get the right fix, from a teammate or from an agent.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **bug report** is a message to someone who was not there: a teammate, a client, or a coding agent that starts every task knowing nothing about your session. Its only job is to let that reader make the problem happen and know what “right” should look like. Compare two reports about the same bug. The first says: “Total is wrong sometimes.” The reader cannot reproduce it, does not know what “wrong” means, and will either ask you five questions or guess. The second names the exact steps and numbers, and the fix is half done. The difference is not writing talent; it is a short checklist.',
      },
      {
        type: 'table',
        headers: ['Part', 'What goes in it', 'Example from the order page'],
        rows: [
          ['Title', 'What goes wrong and where, in one line', 'Negative quantity gives a negative total on the order page'],
          ['Steps to reproduce', 'Numbered, exact, starting from a known place', '1. Open the page. 2. Type -3 in Kape. 3. Press Compute total.'],
          ['Expected result', 'What should happen, and why', 'The page refuses the quantity: it must be a whole number from 0 to 99'],
          ['Actual result', 'What did happen, exactly', 'The page shows “Total: PHP -36”'],
          ['Environment', 'Where it happened: browser, version, build', 'Chromium 159 via Playwright 1.65, commit a1b2c3d'],
          ['Evidence', 'A screenshot, output or a failing test', 'The failing test below, and a screenshot of the total'],
          ['Impact', 'Who it hurts and how badly', 'A shopper can lower a bill; with BAHAGI10 the effect is bigger'],
        ],
        caption: 'The parts of a bug report. The commit id in the example is made up for illustration.',
      },
      { type: 'heading', text: 'Use AI to draft, and keep it honest' },
      {
        type: 'paragraph',
        text: 'An AI is excellent at turning messy notes into a tidy report, and dangerous in one way: it fills gaps with plausible details. It may add a step you did not take, a browser you did not use or a cause you only guessed. You prevent that with the prompt, and you check the result by following the steps yourself.',
      },
      {
        type: 'prompt',
        label: 'Prompt: from session notes to a report',
        text: 'Turn my notes into a bug report with these parts: title, steps to reproduce (numbered), expected result, actual result, environment, evidence, impact. Rules: use only facts that are in my notes; do not invent steps, versions or causes; if something is missing, write "MISSING:" and tell me what to find out; keep what I observed apart from what I suppose. My notes: typed -3 in the kape box on the order page, pressed Compute total, page said Total: PHP -36. With 10 sabon and voucher BAHAGI10 as well, it said Total: PHP 192.6. Rules say quantity is a whole number from 0 to 99. Chromium 159 from Playwright 1.65. I think the quantity is never checked in pricing.js.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'Example AI answer (written for this course, not the output of a real model)',
        code: `## Negative quantity gives a negative total

**Steps to reproduce**
1. Open the order page.
2. Type -3 in the Kape box.
3. Press Compute total.

**Expected:** the page refuses the quantity. Rule: a quantity is a whole number from 0 to 99.
**Actual:** the page shows "Total: PHP -36".

**Also:** Kape -3, Sabon 10 and voucher BAHAGI10 shows "Total: PHP 192.6"
(an honest basket of 10 Sabon with the voucher costs PHP 225).

**Environment:** Chromium 159 (Playwright 1.65). MISSING: commit or build id.

**Impact:** a shopper can reduce the bill by "buying" a negative amount.

**Suspected cause (not verified):** pricing.js does not check the quantity.`,
      },
      {
        type: 'paragraph',
        text: 'Notice the two honest touches: a `MISSING:` line where the notes had no commit id, and the cause marked as *suspected, not verified*. You fill the gap (`git rev-parse --short HEAD` prints the commit id) and keep the suspicion labelled. Then do the step most people skip: **follow your own report cold**, on a fresh page, as if you were the reader. If you cannot reproduce it from the words alone, nobody else can.',
      },
      { type: 'heading', text: 'End with a failing test' },
      {
        type: 'paragraph',
        text: 'The best evidence is a test that fails now and will pass when the bug is fixed. It is a reproduction that never gets out of date, and it tells a coding agent exactly what finished looks like. This is the whole of it, with its real result on the current code.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The reproduction as a test',
        code: `test('a negative quantity is refused', () => {
  assert.throws(() => orderTotal([{ name: 'kape', qty: -3 }]), RangeError);
});`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output on the current code',
        code: `✖ a negative quantity is refused (0.75275ms)
  AssertionError [ERR_ASSERTION]: Missing expected exception (RangeError).`,
      },
      {
        type: 'paragraph',
        text: '“Missing expected exception” says the test expected the code to refuse the order by raising an error, and the code quietly returned a number instead. A report with steps, an expected result and this test is something an agent can work from: “make this test pass without editing it, then run the whole suite”.',
      },
      {
        type: 'warning',
        text: 'Before pasting logs, screenshots or error text into an AI tool or a public issue, remove passwords, tokens, customer names and phone numbers. A report should show the problem, not the private data around it.',
      },
      { type: 'heading', text: 'Keep each report small' },
      {
        type: 'list',
        items: [
          '**One bug per report.** Two problems in one report get half fixed and cannot be closed.',
          '**Say how bad it is, separately from how soon.** Impact is a fact about the problem (a shopper can underpay); priority is a decision about the schedule.',
          '**Check for a duplicate first**, and link the earlier report instead of writing a new one.',
          '**Keep it short.** Every extra paragraph is something the reader has to decide is not important.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine telling a mechanic your car is “making a noise”. They will ask: when, where, what kind? A good bug report answers those before they ask. *Steps to reproduce* are the instructions that let someone else see the problem with their own eyes, like a recipe. *Expected* is what should have happened and *actual* is what did. *Environment* is where it happened (which browser, which version), since the same program can behave differently in different places. An *AI draft* is a first version that you must check against what you really did, because the AI cannot know what it was not told. A test that fails is simply a very exact way of showing the problem to a computer.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** A report is an interface between the finder and the fixer, so shape it for both humans and agents: a minimal reproduction, a stated oracle, the commit it was seen on (and, for a regression, the last known good one so `git bisect` can finish the job), and a failing test as the acceptance criterion. Put the structure in an issue template (Markdown or YAML issue forms) so reports arrive complete, and let an agent triage duplicates and label severity, but keep a human on impact and priority. When delegating a fix, the report becomes the prompt: scope the change, forbid editing the reproduction test, and require the suite plus an explanation of the root cause. Track escape rate (bugs found by users rather than by tests) as a quality signal for AI-written code.',
      },
      {
        type: 'version',
        text: 'GitHub issue templates are files in a `.github/ISSUE_TEMPLATE` folder on the repository’s default branch. They can be Markdown files or YAML “issue forms” with structured fields, and contributors choose one from the new-issue page; the answers become an ordinary issue. Checked against GitHub Docs on this date; the available fields and options change as GitHub adds features.',
        checked: CHECKED,
        sources: [DOCS.ghTemplates],
      },
      {
        type: 'takeaways',
        items: [
          'A bug report is for someone who was not there, so it must let them reproduce the problem and know what right looks like.',
          'The parts are title, numbered steps, expected, actual, environment, evidence and impact.',
          'Let AI draft from your notes, but forbid invented steps, mark gaps as missing and label guesses as unverified.',
          'Follow your own report cold before sending it, and end it with a failing test when you can.',
          'One bug per report, impact kept apart from priority, and no private data in logs.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-07-match-1',
          kind: 'match',
          title: 'What is missing from the report?',
          prompt: 'Each line is a weak bug report. Match it to the most important thing it leaves out.',
          concept: 'parts of a bug report',
          labels: { terms: 'The weak report', meanings: 'What is missing' },
          pairs: [
            { term: '“The total is wrong sometimes.”', definition: 'Exact steps and numbers to reproduce it', note: 'Nobody can make “sometimes” happen. Steps and exact values are what turn it into something the reader can see.' },
            { term: '“Steps: type -3 and press the button. It shows a number.”', definition: 'The expected result and the actual number', note: 'The reader cannot tell what is wrong, because the report never says which number was shown or which one it should have been.' },
            { term: '“Doesn’t work on my phone, steps below, expected 90 got 100.”', definition: 'The environment: which browser and version on which phone', note: 'The steps and numbers are clear, but the same page can behave differently in different browsers, so the reader does not know where to look.' },
          ],
          hints: [
            'What can the reader not do with this report?',
            'Compare each weak line with the parts table in the lesson.',
            '“Sometimes” has no steps, the second report has no result, and the third has no environment.',
          ],
          explanation: 'Each weak report leaves out a different part. Spotting which part is missing is the quickest way to improve a report before you send it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-07-scenario-1',
          kind: 'scenario',
          title: 'The tidy report with an invented step',
          prompt: 'Choose what to do.',
          concept: 'checking an AI draft',
          situation: 'Your AI assistant turned your notes into a clean bug report. It reads beautifully, but step 2 says “Log in as an admin”, and nothing in your notes mentions logging in. The environment line says “Safari on iPhone”. You used Chromium on a laptop.',
          options: [
            { text: 'Check every line against your notes, delete the invented step and the wrong environment, mark the gaps as MISSING, then follow the steps cold to confirm them.', consequence: 'The report now states only what happened, and the next reader can reproduce it. You also tighten your prompt to forbid inventing details.', quality: 'best' },
            { text: 'Send it as it is: it reads well and the AI is usually right.', consequence: 'The developer tries to log in as an admin on an iPhone, cannot reproduce the bug, and closes the report as “cannot reproduce”.', quality: 'poor' },
            { text: 'Delete the whole report and write it again from nothing.', consequence: 'You waste time redoing the part that was good. The fix is to correct the invented lines, not to start over.', quality: 'acceptable' },
            { text: 'Ask the AI whether it invented anything and trust its answer.', consequence: 'It may say no, or confidently list the wrong details. Only you know what you did, so only you can check.', quality: 'poor' },
          ],
          hints: [
            'Who knows what you really did during the session?',
            'A report that reads well can still be wrong.',
            'Check every line against your own notes, and follow the steps yourself.',
          ],
          explanation: 'The AI cannot know what it was not told, so it fills gaps. You are the only source of truth about your session: check each line, mark gaps as missing and reproduce the bug from the words alone.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-07-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Parts of a bug report',
          prompt: 'Tap each card to check you can say what it is for.',
          concept: 'bug report vocabulary',
          cards: [
            { front: 'Steps to reproduce', back: 'Numbered instructions that let someone else see the same problem.' },
            { front: 'Expected vs actual', back: 'What should have happened, and what really happened.' },
            { front: 'Environment', back: 'Where it happened: browser, version, phone or build.' },
            { front: 'Impact', back: 'Who is hurt and how badly, such as “a shopper can lower the bill”.' },
          ],
          hints: ['Imagine you are telling a mechanic about a noise in your car.'],
          explanation: 'These four parts answer the questions the reader would otherwise have to ask you.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-07-q1',
        prompt: 'Which title is the most useful for a bug report?',
        choices: [
          'Order page broken',
          'Bug found while testing the AI’s new version of the page this afternoon',
          'Urgent: please fix the total immediately',
          'Negative quantity gives a negative total on the order page',
        ],
        answer: 3,
        explanation: 'A good title says what goes wrong and where, so someone can recognise a duplicate and decide who should look. The others say how someone feels, or when it was found.',
      },
      {
        id: 'ai-testing-qa-07-q2',
        prompt: 'An AI wrote “Cause: the quantity validation was removed in the last refactor”, but you only suspect the quantity is unchecked. What should the report say?',
        choices: [
          'Keep the sentence as written, because the AI has read the code and so it knows exactly why the total came out wrong',
          'Remove all mention of the cause so that no one is misled',
          'State it as fact, then add “probably” to the title',
          'Keep it, labelled “suspected, not verified”, so it helps without being mistaken for a finding',
        ],
        answer: 3,
        explanation: 'A suspected cause can save time, but only if it is clearly marked as a guess. Presented as fact it sends the fixer down the wrong path.',
      },
      {
        id: 'ai-testing-qa-07-q3',
        prompt: 'Why is a failing test the strongest evidence you can attach to a report?',
        choices: [
          'It proves the bug is serious and should be fixed first',
          'It is a reproduction that never goes out of date and tells an agent exactly what “fixed” means',
          'It makes the report shorter, so reviewers read it faster and are more likely to pick it up this week',
          'It means the developer no longer needs to read the code',
        ],
        answer: 1,
        explanation: 'A test reproduces the bug on demand, and when it turns green the fix is proven. That is what makes it the best acceptance criterion for a person or an agent.',
      },
      {
        id: 'ai-testing-qa-07-q4',
        prompt: 'You found a negative-total bug and a slow-loading page in the same session. How many reports should you write?',
        choices: [
          'One report listing both problems, so the developer sees the full picture at once and can plan the work',
          'One report per step you took during the session',
          'None, until you are sure both are caused by the same underlying problem',
          'Two reports, one per bug, so that each can be fixed, tested and closed on its own',
        ],
        answer: 3,
        explanation: 'One bug per report lets each be assigned, fixed and verified independently. A combined report is often half fixed and never closed.',
      },
      {
        id: 'ai-testing-qa-07-q5',
        audience: { max: 'beginner' },
        prompt: 'What are “steps to reproduce”?',
        choices: [
          'Instructions that let someone else make the same problem happen',
          'A list of the files you changed to fix the problem',
          'A message to the AI asking it to try again',
        ],
        answer: 0,
        explanation: 'If another person cannot repeat the problem from your steps, they cannot confirm it exists or prove they fixed it.',
      },
      {
        id: 'ai-testing-qa-07-q6',
        audience: { min: 'advanced' },
        prompt: 'You hand a bug report to a coding agent to fix. Which addition most improves the chance of a correct, reviewable fix?',
        choices: [
          'A request to “fix it properly and make it robust”',
          'The failing reproduction test, a rule that the test may not be edited, a requirement to run the full suite, and a request to explain the root cause',
          'Permission to refactor any files it likes and to rename anything it wants, so that it can look for the real problem wherever it happens to hide in the project',
          'A deadline, so the agent works quickly',
        ],
        answer: 1,
        explanation: 'A reproducible target, a fixed oracle, a regression check and an explanation make the work verifiable. Vague requests and wide permissions make the change larger and harder to review.',
      },
    ],
    task: {
      title: 'Write and test a bug report',
      minutes: 18,
      steps: [
        'Take one bug from your exploratory session (or use the negative quantity). Write your rough notes in three or four lines.',
        'Use the prompt from this lesson to draft a report. Mark every line that was not in your notes.',
        'Remove or fix the invented parts, fill MISSING items (for example with `git rev-parse --short HEAD`), and follow your report cold on a fresh page.',
        'Write a failing test for the bug, run it and paste its real failure message into the report.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Read your finished report to someone (or to the AI with “pretend you have never seen this app”) and note every question they ask. Add the answers to the report.'] },
      { audience: { min: 'advanced' }, steps: ['Add a `.github/ISSUE_TEMPLATE` form with the report’s fields, then give the report to a coding agent with the rules from the last quiz question, and review its diff and the root-cause explanation.'] },
    ],
  },
  {
    id: 'ai-testing-qa-08',
    day: 8,
    title: 'Stop old bugs coming back',
    summary: 'Keep every fixed bug fixed: one failing test per bug, a suite that runs on every change, and rules that stop an AI clean-up from quietly undoing a fix.',
    minutes: 26,
    skills: ['regression', 'unit-tests'],
    intro: {
      objectives: [
        'Explain why AI-assisted changes make old bugs likely to come back',
        'Fix a bug test-first so that it stays fixed, and keep the test with a name that remembers the bug',
        'Write instructions and checks that make “run the tests” automatic for people and for agents',
      ],
      why: 'Fixing a bug once is the easy part. With AI rewriting code on request, the real risk is that tomorrow’s “tidy-up” silently undoes today’s fix, and nobody notices until a customer does.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **regression** is something that used to work and no longer does: most often a bug you already fixed that has come back. They are common with AI assistants for a simple reason. An assistant starting a new task does not remember why a line exists. If you say “simplify this function”, it sees a validation check that looks like clutter and removes it, with the best of intentions. The code is shorter and cleaner, the page still opens, and a bug you fixed last week is back. Humans do this too, but AI does it quickly and confidently, so the defence has to be mechanical: a test for every bug, run on every change.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The regression routine. The test is written while the bug is fresh and kept for good.',
        source: `flowchart LR
  A[Bug found] --> B[Write a failing test for it]
  B --> C[Fix the code]
  C --> D[Test passes]
  D --> E[Keep the test and run the whole suite on every change]
  E -->|a later change breaks it| F[Test fails: caught before shipping]
  F --> C`,
      },
      { type: 'heading', text: 'Fix the bug from lesson 7, test first' },
      {
        type: 'paragraph',
        text: 'The report said: a negative quantity gives a negative total. Mang Dodong confirmed the rule: a quantity is a whole number from 0 to 99. So the tests that go with the fix are these four. The first one’s name remembers the bug, so that anyone who sees it fail knows what came back.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Added to test/pricing.test.js',
        code: `test('a negative quantity is refused (bug: -3 kape once gave PHP -36)', () => {
  assert.throws(() => orderTotal([{ name: 'kape', qty: -3 }]), RangeError);
});

test('a quantity that is not a whole number is refused', () => {
  assert.throws(() => orderTotal([{ name: 'kape', qty: 1.5 }]), RangeError);
});

test('more than 99 of one item is refused', () => {
  assert.throws(() => orderTotal([{ name: 'kape', qty: 100 }]), RangeError);
});

test('zero of an item is fine', () => {
  assert.equal(orderTotal([{ name: 'kape', qty: 0 }]), 0);
});`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output before the fix (12 tests; only the lines about the new tests are shown)',
        code: `✖ a negative quantity is refused (bug: -3 kape once gave PHP -36) (0.530708ms)
✖ a quantity that is not a whole number is refused (0.311583ms)
✖ more than 99 of one item is refused (0.161875ms)
✔ zero of an item is fine (0.052416ms)
ℹ tests 12
ℹ pass 9
ℹ fail 3`,
      },
      {
        type: 'paragraph',
        text: 'Three red tests for the right reason, and one guard test (zero is fine) that is green from the start and stops an over-eager fix from refusing zero. Now the fix, in `lineTotal`, where every route into a price passes:',
      },
      {
        type: 'code',
        language: 'diff',
        label: 'The fix',
        code: `   if (!(name in PRICES)) {
     throw new Error(\`Unknown item: \${name}\`);
   }
+  if (!Number.isInteger(qty) || qty < 0 || qty > 99) {
+    throw new RangeError('Quantity must be a whole number from 0 to 99');
+  }
   return PRICES[name] * qty;`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output after the fix',
        code: `✔ a negative quantity is refused (bug: -3 kape once gave PHP -36) (0.299833ms)
✔ a quantity that is not a whole number is refused (0.331542ms)
✔ more than 99 of one item is refused (0.111875ms)
✔ zero of an item is fine (0.042333ms)
ℹ tests 12
ℹ pass 12
ℹ fail 0`,
      },
      {
        type: 'paragraph',
        text: 'The page also had to say something. A refusal that throws an error means nothing to a shopper, so the AI changed the page to catch the error and show its words in a spot reserved for messages (an element with the role `alert`), and one browser test now checks it. This is the real run of the browser suite afterwards: both journeys, the voucher total and the negative quantity message, pass.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: npx playwright test',
        code: `Running 2 tests using 1 worker

  ✓  1 e2e/order.spec.js:3:1 › a shopper sees the total with a voucher (192ms)
  ✓  2 e2e/order.spec.js:11:1 › a negative quantity shows a message, not a total (114ms)

  2 passed (991ms)`,
      },
      { type: 'heading', text: 'The clean-up that breaks it' },
      {
        type: 'paragraph',
        text: 'Next week you ask an assistant to “tidy pricing.js; input checks belong in the form, not the pricing code”. It removes the quantity check from `lineTotal`. We did exactly that to a copy of the project and ran the tests:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output after the quantity check was removed',
        code: `✔ adds up the lines when there is no voucher (0.601916ms)
...
✖ a negative quantity is refused (bug: -3 kape once gave PHP -36) (0.531833ms)
✖ a quantity that is not a whole number is refused (0.300333ms)
✖ more than 99 of one item is refused (0.142333ms)
✔ zero of an item is fine (0.04825ms)
ℹ tests 12
ℹ pass 9
ℹ fail 3`,
      },
      {
        type: 'paragraph',
        text: 'Caught in under a second, with the bug’s own name on the failing line. Without the test the tidy-up would have looked perfect. This is the whole value of a regression suite: it remembers what you fixed and tells you when a change forgets.',
      },
      { type: 'heading', text: 'Make “run the tests” automatic' },
      {
        type: 'paragraph',
        text: 'A suite only protects you if it runs. Give the project a single command (`npm test`), make running it a habit before every commit, and tell the AI about it in the **instructions file** your tool reads at the start of a session (for Claude Code that is `CLAUDE.md`). A few lines are enough:',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'Rules for AI assistants, in CLAUDE.md or the equivalent file',
        code: `## Checking your work
- Run \`npm test\` before you say a task is done, and show the output.
- Every bug fix needs a test that failed before the fix.
- Never delete, skip or weaken a test to make it pass. If a test seems wrong, stop and ask.
- Do not remove input checks in pricing.js; each one has a test that names its bug.`,
      },
      {
        type: 'paragraph',
        text: 'Rules in a file are requests; a **check that runs by itself** is a guarantee. The AI-Assisted Deployment course shows how to run the suite on every push. Until then, a pre-commit hook or a habit works. Keep the suite quick and green: a suite that is slow, or red for weeks, trains everyone to ignore it, and then it protects nothing.',
      },
      {
        type: 'warning',
        text: 'A test that sometimes fails for no reason (a flaky test) is a bug to fix, not noise to live with. Never silence it by deleting or skipping it without deciding why it fails.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A regression is when something you already fixed breaks again, like a leak you patched that reopens after someone repaints the wall. A regression test is a note you leave on the wall: “there was a hole here, do not remove this patch”. Every fixed bug gets one note, and the computer reads all the notes every time anything changes. In the fix above, `Number.isInteger(qty)` checks that the quantity is a whole number, `qty < 0` and `qty > 99` check the two ends of the range, and `throw new RangeError(...)` stops the calculation with a message. The `!` and `||` mean “not” and “or”, so the line says: if the quantity is not a whole number, or is below 0, or is above 99, refuse it.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Layer the suite by speed and run the cheap layers on every change: unit tests in the pre-commit hook or the inner loop, integration and browser tests on every push as required status checks, slower suites on a schedule. Make the gate unavoidable (required checks, protected branches), keep tests ordered and independent, and watch for the quiet failure of agent-assisted work: tests deleted or skipped to get green. Guard against it with a test-count ratchet, a review rule that test deletions need a reason, and CI that fails when a skip appears. For bugs found in production, add the reproduction as a regression test before the fix, tag it with the incident, and use the escape rate (bugs that reached users with no test) to decide where coverage is thinnest.',
      },
      {
        type: 'version',
        text: 'Claude Code’s best-practices page recommends keeping `CLAUDE.md` short and including how to confirm work in the repository: the exact test, typecheck and lint commands, and how to run a single test file. It also says that rules which must never have exceptions are better enforced by hooks and a `Stop` hook that runs the checks than by instructions alone. Checked against that page on this date; instruction-file names differ between tools and the details of hooks change often.',
        checked: CHECKED,
        sources: [DOCS.ccBest],
      },
      {
        type: 'takeaways',
        items: [
          'A regression is a fixed bug that returns; AI clean-ups make it likely because the assistant does not remember why a line exists.',
          'Give every fixed bug a test that failed before the fix, and name it after the bug.',
          'Run the whole suite on every change: one command, a habit or hook, and eventually CI.',
          'Put “run the tests, never weaken them, a fix needs a test” in the instructions file, and back it with a check that runs by itself.',
          'Keep the suite quick and green: a slow, red or flaky suite gets ignored.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-08-code-challenge-1',
          kind: 'code-challenge',
          title: 'The rule behind the regression test',
          prompt: 'Write `isValidQuantity(qty)`. It returns `true` only for a whole number from 0 to 99, and `false` for everything else (negative, decimal, too big).',
          concept: 'regression guard',
          language: 'javascript',
          starter: 'function isValidQuantity(qty) {\n  // true only for whole numbers from 0 to 99\n}\n',
          solution: 'function isValidQuantity(qty) {\n  return Number.isInteger(qty) && qty >= 0 && qty <= 99;\n}\n',
          tests: {
            kind: 'function',
            fn: 'isValidQuantity',
            cases: [
              { label: 'a normal quantity', args: [5], expected: true },
              { label: 'zero is fine', args: [0], expected: true },
              { label: '99 is the top', args: [99], expected: true },
              { label: '100 is too many', args: [100], expected: false },
              { label: 'negative', args: [-3], expected: false },
              { label: 'not a whole number', args: [1.5], expected: false },
            ],
          },
          hints: [
            'You need three checks joined together: whole number, not below 0, not above 99.',
            'Number.isInteger(qty) tells you whether it is a whole number.',
            'Return Number.isInteger(qty) && qty >= 0 && qty <= 99.',
          ],
          explanation: 'All three conditions must hold at once, which is what `&&` means. Each of the tests above protects one of them: the bug from lesson 7 lived in the missing `qty >= 0`.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-08-arrange-1',
          kind: 'arrange',
          title: 'The regression routine',
          prompt: 'Put these steps in the right order, first at the top.',
          concept: 'regression routine',
          language: 'text',
          solution: [
            'Write a test that reproduces the bug and watch it fail',
            'Fix the code so that the test passes',
            'Run the whole suite to check nothing else broke',
            'Commit the fix together with its test',
            'Let the suite run on every later change',
          ],
          reasons: [
            'The failing test proves the bug is real and shows what fixed means.',
            'Only now change the code, and only as far as the test needs.',
            'A fix in one place can break another, so check everything.',
            'The test travels with the fix and stays in the project for good.',
            'This is what catches the bug if a later change brings it back.',
          ],
          hints: [
            'What must exist before you can tell whether a fix worked?',
            'The test comes before the fix, and the whole suite runs before you commit.',
            'Failing test, fix, whole suite, commit, run on every change.',
          ],
          explanation: 'The test must fail first (so it is proven able to), the fix makes it pass, the whole suite confirms nothing else moved, and committing both together keeps the protection for good.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-08-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Regression words',
          prompt: 'Tap each card to check you can say it in your own words.',
          concept: 'regression vocabulary',
          cards: [
            { front: 'Regression', back: 'Something that used to work and now does not, often a bug you already fixed that came back.' },
            { front: 'Regression test', back: 'A test written for one fixed bug, kept forever so the bug cannot return unnoticed.' },
            { front: 'Suite', back: 'All the tests of a project, run together with one command.' },
            { front: 'Flaky test', back: 'A test that sometimes passes and sometimes fails with no change to the code. It needs fixing, not ignoring.' },
          ],
          hints: ['Think of leaving a note on the wall where you patched a hole.'],
          explanation: 'These four words describe how a project remembers what it has already fixed.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-08-q1',
        prompt: 'Why are regressions especially likely when an AI assistant is asked to “simplify” or “clean up” code?',
        choices: [
          'The AI deliberately breaks things to make its own work look better',
          'Clean-up requests always make the program slower, and that slowness is what causes the old bugs to appear again',
          'It may not know why a check exists, so it removes it as clutter while the page still looks fine',
          'AI assistants cannot edit code that already has tests',
        ],
        answer: 2,
        explanation: 'The assistant sees only the code, not the history of why each line is there. A check that looks unnecessary gets removed. A test that names the bug is what brings that history back.',
      },
      {
        id: 'ai-testing-qa-08-q2',
        prompt: 'Which is the correct order for fixing a reported bug so that it stays fixed?',
        choices: [
          'Fix the code, run the page by hand, then write a test if there is time left',
          'Write the report, fix the code, and rely on exploratory testing to catch it next time',
          'Fix the code, then write a test that passes, then delete it once the fix ships',
          'Write a failing test, fix the code until it passes, run the whole suite, keep the test',
        ],
        answer: 3,
        explanation: 'A test written first is proven able to fail and defines what fixed means. Keeping it is what protects the fix later.',
      },
      {
        id: 'ai-testing-qa-08-q3',
        prompt: 'After an AI clean-up, three tests named after old bugs turn red. What does that most likely mean?',
        choices: [
          'The tests are out of date and should be deleted so that the build is green again',
          'The clean-up undid fixes the tests were guarding, and you should look at the diff for the removed checks',
          'The test runner is faulty, since nothing the AI does can break a fix',
          'The AI has improved the code, so the old expected values are out of date and should be updated to match what it returns now',
        ],
        answer: 1,
        explanation: 'Tests named after bugs fail when those bugs return. That is the suite doing its job, and the diff of the clean-up shows what was lost.',
      },
      {
        id: 'ai-testing-qa-08-q4',
        prompt: 'Which line in an instructions file does most to protect your tests from an unattended agent?',
        choices: [
          'Write clean code that follows best practices',
          'Prefer short functions and descriptive variable names',
          'Try to make all tests pass before you finish the task, whatever that takes and however long it takes',
          'Never delete, skip or weaken a test; if a test looks wrong, stop and ask me',
        ],
        answer: 3,
        explanation: 'It names the specific temptation (weakening a test to get green) and the right behaviour (stop and ask). The vaguer lines do not address it, and “whatever that takes” invites exactly what you want to prevent.',
      },
      {
        id: 'ai-testing-qa-08-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a regression test in everyday words?',
        choices: [
          'A test that makes the program run slower on purpose, to see if it still works when the computer is busy',
          'A test you write once, for one fixed bug, and keep so the bug cannot quietly return',
          'A test the AI writes for itself before you start a project',
        ],
        answer: 1,
        explanation: 'It is a note left where a bug was fixed. The computer reads every such note whenever anything changes.',
      },
      {
        id: 'ai-testing-qa-08-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent-assisted branch shows 40 fewer tests than main, with a fully green build. What control best catches this class of problem?',
        choices: [
          'Trusting the green build, since all remaining tests pass',
          'A required check that fails the build when the test count drops or when a skip or only marker appears, plus review of any deleted test',
          'Asking the agent to confirm in its own summary that it removed nothing important, and to list each file it deleted from the project',
          'Running the suite twice to be sure it is stable',
        ],
        answer: 1,
        explanation: 'Green only means the tests that remain pass. A test-count ratchet and a review rule make weakening the suite visible and deliberate. An agent’s own summary is not independent evidence.',
      },
    ],
    task: {
      title: 'Fix a bug so it stays fixed',
      minutes: 20,
      steps: [
        'Take a bug from your own app (or the negative quantity). Write a failing test for it, with the bug in its name, and run it to see it red.',
        'Ask an AI to fix only the code, with “do not edit tests”, then run the whole suite and check the test file’s diff.',
        'Now try the break: ask an AI to “simplify” the function and see whether your test notices. Undo the change if it does not break anything.',
        'Add the four rules from this lesson to your instructions file (CLAUDE.md or your tool’s equivalent) and commit them with the test.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain in plain words what the fix does and why the test would fail without it. Write the explanation as a comment above the test.'] },
      { audience: { min: 'advanced' }, steps: ['Add a pre-push hook or a CI job that runs the suite and fails on skipped tests or a drop in the number of tests, and prove it works by deleting a test on a throwaway branch.'] },
    ],
  },
  {
    id: 'ai-testing-qa-09',
    day: 9,
    title: 'Check the tests themselves',
    summary: 'Find tests that cannot fail by breaking the code on purpose, and learn why a green suite and a high coverage number prove less than they seem to.',
    minutes: 28,
    skills: ['check-the-tests', 'unit-tests'],
    intro: {
      objectives: [
        'Spot a test that cannot fail, and name why it cannot',
        'Break the code on purpose (a mutation) and decide from the result whether the tests are good enough',
        'Explain why coverage shows what ran, not what was checked',
      ],
      why: 'AI will happily write a suite that is green, long and useless. If you cannot tell a test that protects you from one that only looks busy, a passing build gives you confidence you have not earned.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Everything so far assumed that a test, when it passes, means something. It does not always. A test that cannot fail is worse than no test, because it gives you the feeling of safety without any of the safety. AI-written tests are especially prone to this: they are quick to write, they all pass on the first run, and they look professional. The question to ask of any green suite is not “does it pass?” but “**would it fail if the code were wrong?**” And you can answer that directly, by making the code wrong on purpose.',
      },
      { type: 'heading', text: 'Four ways a test cannot fail' },
      {
        type: 'list',
        items: [
          '**No assertion.** The test calls the code and never compares anything. It passes unless the code crashes.',
          '**A weak assertion.** `assert.ok(total)` passes for any number except 0, and a check that the result `typeof` is a number passes for every wrong number too.',
          '**An expected value copied from the code.** The test recomputes the answer the same way the code does, so they are wrong together.',
          '**Testing the mock.** The code under test is replaced by a stand-in, so the test checks the stand-in. It can pass while the real code is broken.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Here is a suite of the first, second and weakest kinds, the sort an AI produces when asked to “add tests for the voucher quickly”. It has three tests, all of them green.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'weak/weak.test.js',
        code: `test('computes a total', () => {
  const total = orderTotal([{ name: 'sabon', qty: 5 }], 'BAHAGI10');
  assert.ok(total);
});

test('voucher is applied', () => {
  orderTotal([{ name: 'sabon', qty: 4 }], 'BAHAGI10');
});

test('returns a number', () => {
  assert.equal(typeof orderTotal([{ name: 'kape', qty: 1 }]), 'number');
});`,
      },
      {
        type: 'paragraph',
        text: 'Run with coverage turned on, the report looks reassuring. **Coverage** counts which lines of code ran while the tests ran:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: node --test --experimental-test-coverage (weak suite only; the other test-summary lines are cut)',
        code: `ℹ tests 3
ℹ pass 3
ℹ fail 0
ℹ file          | line % | branch % | funcs % | uncovered lines
ℹ  pricing.js   |  85.19 |    81.82 |  100.00 | 9-10 12-13`,
      },
      {
        type: 'paragraph',
        text: 'Three green tests and 85% of the lines in `pricing.js` ran. It looks healthy. But coverage only says a line *ran*, not that anything *checked* what it did. The second test runs the whole discount path and compares nothing. Let us find out how good this suite really is.',
      },
      { type: 'heading', text: 'Break the code on purpose' },
      {
        type: 'paragraph',
        text: 'A **mutation** is a small deliberate bug that you plant in the working code: change a `>=` into `>`, a plus into a minus, switch off a rule. You run the tests against the broken copy. If a test fails, the suite **killed** the mutant: it noticed. If everything still passes, the mutant **survived**, which means the suite could not tell good code from bad, and you have found a gap. Four mutants, applied one at a time to the real `pricing.js`, against the weak suite and then against the real ten-plus tests from lessons 3 to 8:',
      },
      {
        type: 'table',
        headers: ['Mutant (a deliberate bug)', 'Weak suite', 'Real suite'],
        rows: [
          ['`>= 100` changed to `> 100` (boundary)', 'survived', 'killed'],
          ['10% changed to 1% (wrong amount)', 'survived', 'killed'],
          ['The voucher never applies', 'survived', 'killed'],
          ['The discount is added instead of taken off', 'survived', 'killed'],
        ],
        caption: 'Real results. The weak suite is green on the original code and also green on all four broken versions, so it checks almost nothing. The real suite kills every one.',
      },
      {
        type: 'paragraph',
        text: 'The share of mutants a suite kills is its **mutation score**: the weak suite scores 0 of 4, and the real one 4 of 4, even though the weak one reported 85% line coverage. That gap between “ran” and “checked” is the whole lesson.',
      },
      {
        type: 'prompt',
        label: 'Prompt: let the AI plan the mutants, you run them',
        text: 'Here is pricing.js (pasted below). List ten small, deliberate bugs I could plant in it one at a time to test my test suite: change an operator, flip a comparison, remove a check, swap a constant. For each, give the exact line to change and the change, and say which of my tests should fail. Do NOT edit any file. I will apply each mutation myself, run npm test, and restore the file with git restore after every one.',
      },
      {
        type: 'paragraph',
        text: 'Notice who does what. The AI proposes the bugs (it is good at inventing plausible mistakes), but *you* plant each one, run the tests and restore the file with `git restore public/pricing.js`, so that a leftover mutant never ships. Be prepared for a mutant that survives for a good reason: some changes do not change behaviour at all (for whole-peso prices, `>= 100` and `> 99` give the same answers), so a survivor is a question to look at, not always a missing test.',
      },
      {
        type: 'warning',
        text: 'Mutate a copy or a clean branch, and restore the file after every mutant. A forgotten mutation in the real code is a bug you planted yourself.',
      },
      { type: 'heading', text: 'Review the tests with a fresh pair of eyes' },
      {
        type: 'paragraph',
        text: 'Tests written by the same AI session that wrote the code share its blind spots. Two cheap habits help: ask a *separate* session (with no memory of the first) to review the tests for the four weaknesses above, and read the assertion line of every test yourself. If you cannot say what wrong behaviour would turn that line red, the test is decoration.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** You test a smoke alarm by holding smoke to it, not by looking at it. Checking your tests is the same idea: you plant a small fault on purpose and see whether the alarm goes off. If it stays silent, the alarm (the test) is not doing its job. *Coverage* is like noting which rooms of a house you walked through: it shows you entered a room, not that you looked at anything in it. In the weak tests above, `assert.ok(total)` asks only “is it something other than zero?”, and the second test has no `assert` at all, like walking through a room with your eyes closed. A *mutant* is the planted fault; *killed* means the tests caught it; *survived* means they did not.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Mutation testing automates this experiment: tools generate mutants (operator, condition, constant and statement changes), run the suite against each and report the score and the survivors. It is slow, because every mutant is a test run, so apply it to changed code, to critical modules or on a schedule rather than on every commit. Triage survivors, because equivalent mutants (no observable change) inflate the denominator. Combine it with property-based tests for rules with large input spaces, and use coverage only as a negative signal for finding untested code. AI-written suites deserve a mutation pass because they tend toward high coverage and weak oracles; feed survivors back to the agent as the next failing tests to write, and keep the agent from touching production code while it does so.',
      },
      {
        type: 'version',
        text: 'Node.js 22’s built-in coverage (`--experimental-test-coverage`) is documented as experimental, so its output format and options may change; it counts lines, branches and functions that ran while tests ran, and the `spec` reporter prints a summary table. Checked against the Node.js 22 docs on this date. Dedicated mutation-testing tools exist for most languages but were not part of this course’s verified setup, so the mutants here were planted by a short shell script.',
        checked: CHECKED,
        sources: [DOCS.nodeTest],
      },
      {
        type: 'takeaways',
        items: [
          'A green suite only matters if it would fail when the code is wrong; ask that of every test.',
          'Tests cannot fail when they have no assertion, a weak one, an expected value copied from the code, or test a mock.',
          'Coverage says which lines ran, not which were checked: our weak suite had about 85% coverage and caught nothing.',
          'Plant a small deliberate bug (a mutant) and run the tests: a failing suite killed it, a passing one let it survive.',
          'Have the AI propose mutants, but plant and run them yourself, restore the file each time and get a separate session to review the tests.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-09-fix-bug-1',
          kind: 'fix-bug',
          title: 'A test that passes for any answer',
          prompt: 'This test is green even when the voucher does not work. Tap the line that makes it unable to fail, then choose the fix.',
          concept: 'tests that cannot fail',
          language: 'javascript',
          code: `test('the voucher takes 10% off at exactly PHP 100', () => {
  const total = orderTotal([{ name: 'sabon', qty: 4 }], 'BAHAGI10');
  assert.ok(total);
});`,
          bugLine: 3,
          fixes: [
            { line: '  assert.equal(total, 90);', correct: true, why: 'It compares the result with the exact answer worked out from the rule, so any other number, including 100, makes the test fail.' },
            { line: '  assert.ok(total > 0);', correct: false, why: 'Still passes for 100 and for every wrong positive number, so it still cannot catch the bug.' },
            { line: '  assert.equal(typeof total, \'number\');', correct: false, why: 'Every wrong total is also a number, so this passes whether or not the discount works.' },
            { line: '  assert.equal(total, orderTotal([{ name: \'sabon\', qty: 4 }], \'BAHAGI10\'));', correct: false, why: 'It compares the code with itself, so it always passes, whatever the code does.' },
          ],
          hints: [
            'What would a wrong total (for example 100) do to this assertion?',
            'The assertion should compare with the one right answer, not just “something”.',
            'Use assert.equal(total, 90).',
          ],
          explanation: 'The assertion `assert.ok(total)` accepts any non-zero number. A good assertion names the one right answer from the rule, so that every other answer turns it red.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-09-predict-output-1',
          kind: 'predict-output',
          title: 'Which weak checks are fooled?',
          prompt: 'The code below has the original “more than 100” bug. Three checks look at the same order. What does it print?',
          concept: 'weak assertions',
          language: 'javascript',
          code: `function orderTotal(subtotal, voucher) {
  if (voucher === 'BAHAGI10' && subtotal > 100) {
    return subtotal - subtotal / 10;
  }
  return subtotal;
}

console.log(orderTotal(100, 'BAHAGI10') ? 'pass' : 'fail');
console.log(orderTotal(100, 'BAHAGI10') === 90 ? 'pass' : 'fail');
console.log(typeof orderTotal(100, 'BAHAGI10') === 'number' ? 'pass' : 'fail');`,
          choices: [
            'pass\nfail\npass',
            'fail\nfail\nfail',
            'pass\npass\npass',
            'fail\npass\nfail',
          ],
          wrongNotes: {
            'fail\nfail\nfail': 'The first and third checks are satisfied by any non-zero number and by any number at all. The buggy code returns 100, which is truthy and a number.',
            'pass\npass\npass': 'Only the exact check compares with 90, and the buggy code returns 100, so it fails.',
            'fail\npass\nfail': 'This has them the wrong way round: the exact check is the only one that notices the bug.',
          },
          hints: [
            'First work out what the buggy code returns for 100 with the voucher.',
            'It returns 100. Is 100 truthy? Is it a number? Is it 90?',
            'The first and third checks pass, and the exact one fails.',
          ],
          explanation: 'The buggy code returns 100. That is truthy and it is a number, so two lazy assertions pass. Only the check against the exact answer, 90, notices that the code is wrong.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-09-code-challenge-1',
          kind: 'code-challenge',
          title: 'Score a test suite',
          prompt: 'Write `mutationScore(results)`. `results` is an array of the words `"killed"` and `"survived"`, one per mutant. Return the percentage of mutants that were killed, rounded to a whole number. For an empty array return 0.',
          concept: 'mutation score',
          language: 'javascript',
          starter: 'function mutationScore(results) {\n  // percentage of results that are "killed"\n}\n',
          solution: "function mutationScore(results) {\n  if (results.length === 0) return 0;\n  let killed = 0;\n  for (const result of results) {\n    if (result === 'killed') killed = killed + 1;\n  }\n  return Math.round((killed / results.length) * 100);\n}\n",
          tests: {
            kind: 'function',
            fn: 'mutationScore',
            cases: [
              { label: 'the weak suite', args: [['survived', 'survived', 'survived', 'survived']], expected: 0 },
              { label: 'the real suite', args: [['killed', 'killed', 'killed', 'killed']], expected: 100 },
              { label: 'three of four', args: [['killed', 'survived', 'killed', 'killed']], expected: 75 },
              { label: 'one of three rounds to 33', args: [['killed', 'survived', 'survived']], expected: 33 },
              { label: 'no mutants', args: [[]], expected: 0 },
            ],
          },
          hints: [
            'Count how many results are the word "killed", with a loop.',
            'Divide that count by the number of results, multiply by 100, and round with Math.round.',
            'Return 0 first if results.length is 0, to avoid dividing by nothing.',
          ],
          explanation: 'The score is killed divided by total, as a percentage. The weak suite scored 0 and the real suite 100, which says more about the tests than the 85% line coverage did.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-09-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Words for checking tests',
          prompt: 'Tap each card to check you can say it in your own words.',
          concept: 'mutation testing vocabulary',
          cards: [
            { front: 'Coverage', back: 'Which lines of code ran while the tests ran. It does not say whether anything was checked.' },
            { front: 'Mutant', back: 'A small bug you plant on purpose to see whether the tests notice.' },
            { front: 'Killed', back: 'The tests failed on the mutant, so they caught the planted bug.' },
            { front: 'Survived', back: 'The tests still passed on the mutant, so there is a gap: they could not tell good code from bad.' },
          ],
          hints: ['Think of testing a smoke alarm with a little smoke.'],
          explanation: 'Planting a fault and watching the alarm is the quickest honest test of a test suite.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-09-q1',
        prompt: 'A suite of 30 AI-written tests is all green and covers 90% of the lines. What is the right question to ask next?',
        choices: [
          'Is the build time fast enough?',
          'How many more tests can the AI add this week to reach 100%?',
          'Would these tests fail if the code were wrong?',
          'Have the tests been formatted according to the team style guide?',
        ],
        answer: 2,
        explanation: 'Green and high coverage show that code ran and nothing crashed. They say nothing about whether wrong behaviour would be caught.',
      },
      {
        id: 'ai-testing-qa-09-q2',
        prompt: 'You plant the mutation `>= 100` to `> 100` and the whole suite still passes. What does that mean?',
        choices: [
          'The suite is excellent, because the code still works',
          'The suite has a gap at that boundary: it cannot tell the correct code from the broken code',
          'The mutation was not applied, because mutations cannot survive a test run',
          'The code was already wrong before you changed it, so the mutation made no difference to the result of the tests',
        ],
        answer: 1,
        explanation: 'A mutant that survives is a bug the tests cannot see. Here that means no test sits exactly on the PHP 100 boundary.',
      },
      {
        id: 'ai-testing-qa-09-q3',
        prompt: 'Which test is least able to fail?',
        choices: [
          'assert.equal(orderTotal(lines, "BAHAGI10"), 90)',
          'assert.throws(() => orderTotal([{ name: "kape", qty: -3 }]), RangeError, "refused")',
          'assert.equal(orderTotal(lines, "BAHAGI10"), orderTotal(lines, "BAHAGI10"))',
          'assert.equal(orderTotal([{ name: "kape", qty: 0 }]), 0)',
        ],
        answer: 2,
        explanation: 'Comparing the code with itself is true for any behaviour at all. The others each name an answer that a wrong behaviour could miss.',
      },
      {
        id: 'ai-testing-qa-09-q4',
        prompt: 'Who should apply the mutations and run the tests, when an AI has proposed ten of them?',
        choices: [
          'The AI that wrote the tests, so that it can fix them as it goes',
          'You (or a script you read), restoring the file after each one, so you see every result yourself',
          'Nobody: a list of mutations is enough evidence of quality by itself',
          'The AI, with permission to keep any mutation that makes a test fail so that the project improves',
        ],
        answer: 1,
        explanation: 'The AI is good at inventing mistakes; the evidence has to be a result you saw. Restoring after each mutation keeps broken code out of the project.',
      },
      {
        id: 'ai-testing-qa-09-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what does it mean when a planted bug “survived”?',
        choices: [
          'The tests caught it right away',
          'The computer crashed, so it could not run the tests that were waiting to be checked by anyone',
          'The tests still passed even though the code was wrong, so they are missing something',
        ],
        answer: 2,
        explanation: 'A survived bug means the alarm did not go off. The tests could not tell the broken code from the working code.',
      },
      {
        id: 'ai-testing-qa-09-q6',
        audience: { min: 'advanced' },
        prompt: 'A mutation run reports 12 survivors in a module an agent just covered at 95%. Which response is most sound?',
        choices: [
          'Raise coverage to 100% so that nothing is left untested',
          'Triage them: discard equivalent mutants, turn the real survivors into failing tests (written without the agent touching production code), and re-run',
          'Disable the mutation run, since survivors always mean the tool is wrong',
          'Ask the agent to rewrite the whole module so that fewer mutants can be generated and the score goes up without adding a single new test to the suite',
        ],
        answer: 1,
        explanation: 'Survivors split into equivalent mutants (no behaviour change) and real gaps. Turning real gaps into new failing tests improves the suite, while changing the code or the tool only hides the problem.',
      },
    ],
    task: {
      title: 'Break your own code on purpose',
      minutes: 20,
      steps: [
        'Commit your project so you can restore it. Choose one function with a rule in it and its tests.',
        'Plant three mutations one at a time (flip a comparison, change a number, switch off a rule). After each one run the tests, write down killed or survived, then restore the file with `git restore <file>`.',
        'For each survivor, decide whether it is a real gap or an equivalent change. For a real gap, write a test that fails on the mutant and passes on the original.',
        'Re-run all three mutants and compute the score. Ask a separate AI session to review your tests for the four weaknesses in this lesson.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to suggest three small bugs you could plant, and to explain each in plain words. Pick one, plant it yourself and see whether any test turns red.'] },
      { audience: { min: 'advanced' }, steps: ['Try a mutation-testing tool for your language on one module, triage its survivors, and compare its score with the line coverage. Write the survivors that matter as failing tests and record the result in your instructions file.'] },
    ],
  },
  {
    id: 'ai-testing-qa-10',
    day: 10,
    title: 'Project: a test plan and suite for an AI-built app',
    summary: 'Put the whole course together: a short test plan, a suite that covers each risk, a table that proves it, and a quality gate you can hand to a client.',
    minutes: 30,
    skills: ['test-plan', 'risk-thinking', 'regression'],
    intro: {
      objectives: [
        'Write a one-page test plan for an AI-built app, ordered by risk',
        'Build a coverage-of-risks table that links each risk to a check and to proof that the check can fail',
        'Define a quality gate that decides whether a change is ready to ship',
      ],
      why: 'Clients and teams do not trust “the AI tested it”. They trust a plan, a suite they can run and evidence that the suite would catch a mistake. This is the portfolio piece that shows you can make AI-built software trustworthy.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Nine lessons gave you separate tools. A project turns them into one habit. Your goal is to take an app that an AI built (the order page, or one of your own) and leave it with a **test plan** (what you will check and why), a **suite** (the checks, runnable with one command) and **evidence** (proof the checks work). The plan does not need to be long. One page that someone else can read in five minutes is worth more than twenty pages nobody opens.',
      },
      { type: 'heading', text: 'The one-page test plan' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**What the app promises.** Five to ten plain sentences of rules, written from the owner’s point of view (the voucher, the quantity range, what happens on bad input).',
          '**The risks, ranked.** Likelihood times damage, as in lesson 1. Put the money and the rules at the top.',
          '**The checks.** For each risk, which layer checks it (unit, end to end, by hand) and the name of the test.',
          '**Open questions.** Rules nobody has decided, with who will decide (lesson 2).',
          '**The quality gate.** The conditions a change must meet before it ships.',
        ],
      },
      { type: 'heading', text: 'The coverage-of-risks table' },
      {
        type: 'paragraph',
        text: 'The heart of the plan is a table that lists each risk next to the check that protects it and the proof that the check can fail. Coverage in this table means *risks covered*, not lines run. Here it is filled in for the order page, using only what the course built.',
      },
      {
        type: 'table',
        headers: ['Risk', 'Layer', 'Test', 'Proof it can fail'],
        rows: [
          ['Voucher gives no discount at exactly PHP 100', 'Unit', 'BAHAGI10 takes 10% off at exactly PHP 100', 'Seen red on the AI’s `>`; mutant `>= 100` to `> 100` killed'],
          ['Voucher ignores capitals or spaces', 'Unit', 'works in lower case; works with spaces', 'Seen red before the code was written (test-first)'],
          ['Any other voucher gives a discount', 'Unit', 'a different voucher gives no discount', 'Mutant “voucher always applies” would turn it red'],
          ['A negative quantity lowers the bill', 'Unit and end to end', 'negative quantity refused; page shows the message', 'Seen red; fails again when the check is removed'],
          ['A decimal or oversized quantity is accepted', 'Unit', 'not a whole number refused; more than 99 refused', 'Seen red before the fix'],
          ['The button does not show a total', 'End to end', 'a shopper sees the total with a voucher', 'Break the page (rename the button): the test fails'],
          ['Layout looks wrong on a small phone', 'By hand', 'Charter: explore the page at phone width', 'Not automated, so no mutant: recorded as a manual risk'],
        ],
        caption: 'A coverage-of-risks table for the order page. The last column is the one most plans leave out, and the one that makes the table honest.',
      },
      {
        type: 'paragraph',
        text: 'Two things make this table useful. Every risk row names a **test you can run**, so the table is checkable. And every row shows how you know that test can fail: you saw it red, or you planted a mutation and it was killed. A row with “covered” and no proof is a promise. A row marked “by hand” is fine, as long as it says so.',
      },
      { type: 'heading', text: 'The quality gate' },
      {
        type: 'paragraph',
        text: 'A **quality gate** is the short list that decides whether a change can ship, so that nobody argues about it each time. For a small app it might be: `npm test` passes with no skipped tests; the browser suite passes; every bug fix in the change comes with a test that failed before it; no test was deleted or weakened without a reason in the commit; and the plan’s table still names a test for each risk. Put it in the instructions file for your AI tools too, so the agent checks the same list you do.',
      },
      {
        type: 'prompt',
        label: 'Prompt: have a fresh AI session review the plan, not write it',
        text: 'You are reviewing a test plan for a small order page, written by me. Do not write new tests. Read the plan and the coverage-of-risks table below and tell me: (1) any risk that has no test, (2) any test whose "proof it can fail" is missing or weak, (3) any rule in the "promises" section that no row covers, (4) any open question that is really a bug. Be specific and short. Plan: [paste your plan and table].',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'How the lessons of this course fit together in one project.',
        source: `flowchart LR
  A[Rules and risks] --> B[Test cases from the rules]
  B --> C[Unit tests, test-first for new behaviour]
  C --> D[One browser test per key journey]
  D --> E[Exploratory session: bugs, questions]
  E --> F[Bug reports with a failing test]
  F --> G[Regression suite on every change]
  G --> H[Check the tests with mutants]
  H --> I[Plan and quality gate]`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** The plan is a checklist for the whole shop before you open the doors: what could go wrong, how you will check each thing, and who decides the things nobody has decided. The coverage-of-risks table is the checklist with a tick and a receipt next to every line: the tick is the test, the receipt is the proof that the test would have noticed. A *quality gate* is the sign on the door that says “we open when these five things are true”. For a first version, a short plan with five risks and five tests is plenty. Smaller and honest beats big and unchecked.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the plan as a living artifact in the repository: a traceable map from requirement to risk to test to evidence, reviewed in the same pull requests that change behaviour. Make the gate mechanical (required status checks, a test-count ratchet, mutation score thresholds on critical modules, no skips) and define who may override it. For agent-assisted delivery, add a standing review step in which a separate session audits the plan and the suite, and require evidence in the change description: the command run, its output and the fail-before, pass-after proof for each fix. Track escaped defects against the table to see which risks it mis-ranked, and retire tests that no longer protect a live risk instead of letting the suite grow without limit.',
      },
      {
        type: 'version',
        text: 'The tools agree on the working pattern this project uses: Claude Code’s best-practices page says to give the agent a check it can run, to ask for the command and its output as evidence, and to review work against a spec with a separate subagent; the ChatGPT Learn prompting guide for Codex describes asking it to run the smallest relevant test suite and report the commands and results. Checked against both pages on this date; product features and names change often, so confirm them in the current documentation.',
        checked: CHECKED,
        sources: [DOCS.ccBest, DOCS.codexPrompting],
      },
      {
        type: 'takeaways',
        items: [
          'A test plan is one page: promises, ranked risks, the check for each, open questions and a quality gate.',
          'A coverage-of-risks table lists risks, not lines: each risk names a runnable test and the proof that the test can fail.',
          'A risk checked only by hand is fine when the table says so.',
          'A quality gate is a short, mechanical list that decides whether a change ships.',
          'Have a separate AI session review the plan, and put the same gate in your instructions file for agents.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-10-code-challenge-1',
          kind: 'code-challenge',
          title: 'Find the risks with no test',
          prompt: 'Write `uncoveredRisks(risks, tests)`. `risks` is an array of risk names. `tests` is an array of objects like `{ name: "...", covers: "risk name" }`. Return the risks that no test covers, in their original order.',
          concept: 'coverage of risks',
          language: 'javascript',
          starter: 'function uncoveredRisks(risks, tests) {\n  // return the risks that no test covers\n}\n',
          solution: 'function uncoveredRisks(risks, tests) {\n  const missing = [];\n  for (const risk of risks) {\n    let covered = false;\n    for (const test of tests) {\n      if (test.covers === risk) covered = true;\n    }\n    if (!covered) missing.push(risk);\n  }\n  return missing;\n}\n',
          tests: {
            kind: 'function',
            fn: 'uncoveredRisks',
            cases: [
              { label: 'one risk is missing', args: [['boundary', 'negative', 'button'], [{ name: 'at 100', covers: 'boundary' }, { name: 'page total', covers: 'button' }]], expected: ['negative'] },
              { label: 'all covered', args: [['boundary'], [{ name: 'at 100', covers: 'boundary' }]], expected: [] },
              { label: 'no tests at all', args: [['boundary', 'negative'], []], expected: ['boundary', 'negative'] },
              { label: 'two tests for one risk', args: [['boundary', 'negative'], [{ name: 'a', covers: 'boundary' }, { name: 'b', covers: 'boundary' }]], expected: ['negative'] },
            ],
          },
          hints: [
            'For each risk, ask whether any test says it covers that risk.',
            'Loop over the risks, loop over the tests, and remember whether a match was found.',
            'If no test has covers equal to the risk, push the risk onto a result list.',
          ],
          explanation: 'A coverage-of-risks table is only useful if gaps show up. This is the same question you ask by eye on the table: which risk has no test next to it?',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-10-scenario-1',
          kind: 'scenario',
          title: 'A client asks, “How do I know the AI app is tested?”',
          prompt: 'Choose what you hand over.',
          concept: 'evidence of quality',
          situation: 'A client paid you to build and test a booking app with AI. They are not technical. They ask for proof that it has been tested, and say they will pay the final invoice when they are convinced.',
          options: [
            { text: 'A one-page plan, a coverage-of-risks table with a runnable test and proof of failure for each risk, the command that runs the suite and its output, and a list of open questions for them to decide.', consequence: 'They can read the plan, see the risks that matter to their business, run one command, and answer the open questions. They pay with confidence.', quality: 'best' },
            { text: 'A message saying that the AI wrote 200 tests and all of them pass.', consequence: 'They have no way to know whether those tests check anything. A passing count is not evidence, and the client is right to keep asking.', quality: 'poor' },
            { text: 'A coverage report showing 92% of lines.', consequence: 'It sounds good but proves only that lines ran. You could not say which business risks it covers.', quality: 'acceptable' },
            { text: 'An offer to demo the app live and click around for them.', consequence: 'A demo shows the happy path once. It tells the client nothing about odd inputs, regressions or what changes later.', quality: 'poor' },
          ],
          hints: [
            'What would convince a non-technical person that the right things were checked?',
            'They care about their business risks, and they need something they can see or run.',
            'A plan tied to risks, with proof that each check can fail.',
          ],
          explanation: 'Evidence connects risks to checks and shows the checks can fail. Counts and coverage numbers sound impressive but answer the wrong question.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-testing-qa-10-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'The pieces of a test plan',
          prompt: 'Tap each card to check you can say it in your own words.',
          concept: 'test plan vocabulary',
          cards: [
            { front: 'Test plan', back: 'A short document: what the app promises, what could go wrong, how each risk will be checked and what is still undecided.' },
            { front: 'Coverage of risks', back: 'A table showing which risks have a test, not how many lines of code ran.' },
            { front: 'Proof it can fail', back: 'Evidence that a test would notice a mistake: you saw it red, or it caught a planted bug.' },
            { front: 'Quality gate', back: 'The short list of things that must be true before a change can ship.' },
          ],
          hints: ['Think of a checklist with a tick and a receipt next to every line.'],
          explanation: 'Together these four things turn “the AI tested it” into something a person can read and trust.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-testing-qa-10-q1',
        prompt: 'What does the “coverage” in a coverage-of-risks table count?',
        choices: [
          'The percentage of code lines that ran during the tests, taken from the coverage report at the end',
          'The number of tests in the suite',
          'The number of files that have a matching test file',
          'The risks that have a runnable check, with evidence that the check can fail',
        ],
        answer: 3,
        explanation: 'In this table coverage means risks, not lines. A risk is covered when a test you can run protects it and you have seen that test fail.',
      },
      {
        id: 'ai-testing-qa-10-q2',
        prompt: 'A row in your table says “discount boundary: covered” and names no test. What is wrong with it?',
        choices: [
          'Nothing: a risk can be covered without any test existing',
          'It is a promise, not evidence: it should name a runnable test and show how you know it can fail',
          'It should list the AI tool that produced the code and the date it did so, instead of listing any test',
          'It is too short; a row should be at least a full paragraph',
        ],
        answer: 1,
        explanation: 'The table is checkable only when each row names a test and proof. “Covered” with no test cannot be verified by anyone.',
      },
      {
        id: 'ai-testing-qa-10-q3',
        prompt: 'Why have a separate AI session review the plan instead of the one that helped write it?',
        choices: [
          'A fresh session has no memory of your assumptions, so it is more likely to notice gaps',
          'The first session charges for each review it does of its own work',
          'Reviews are only allowed to come from a tool that did not write the code, which is a rule of most test frameworks',
          'A fresh session always writes better tests than the one before it',
        ],
        answer: 0,
        explanation: 'The writer shares its own blind spots. A reviewer with no context reads the plan the way a stranger would, which is how real gaps are found.',
      },
      {
        id: 'ai-testing-qa-10-q4',
        prompt: 'Which item belongs in a quality gate for a small AI-built app?',
        choices: [
          'The AI says it is confident that the change is correct',
          'The change was written by the most capable model available',
          'The tests pass with no skipped tests, and each bug fix includes a test that failed before the fix',
          'The code has been reformatted by a tool, so that it looks consistent to the reviewer and matches the team style',
        ],
        answer: 2,
        explanation: 'A gate item should be checkable by a command or a diff. Confidence and model choice are not evidence, and formatting says nothing about whether it works.',
      },
      {
        id: 'ai-testing-qa-10-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a quality gate, in everyday words?',
        choices: [
          'A password that protects the app from strangers who might otherwise open it before it is finished',
          'A short list of things that must be true before a change is allowed to go live',
          'The final screen of the app, where people give feedback',
        ],
        answer: 1,
        explanation: 'It is the sign on the door: we open when these things are true. It stops the argument about “is it ready?” each time.',
      },
      {
        id: 'ai-testing-qa-10-q6',
        audience: { min: 'advanced' },
        prompt: 'Escaped defects keep appearing in a risk your plan ranked “low”. What is the right response?',
        choices: [
          'Leave the plan alone: the defects were bad luck',
          'Re-rank the risk using the escape data, add a regression test for each escaped defect and review what the plan assumed about its likelihood',
          'Raise coverage to 100% across every module equally, so that no ranking is needed and no risk is treated as lower than another',
          'Remove the risk from the plan, since it is clearly not predictable',
        ],
        answer: 1,
        explanation: 'Escapes are data about where the ranking was wrong. Re-ranking and adding regression tests uses that data. Uniform coverage or deleting the risk throws it away.',
      },
    ],
    task: {
      title: 'Draft your plan and table',
      minutes: 20,
      steps: [
        'Write the app’s promises as five to ten plain sentences, and rank the risks by likelihood and damage.',
        'Fill a coverage-of-risks table with five or more rows: risk, layer, test name and proof it can fail. Mark any row that is checked by hand.',
        'Run your whole suite and paste the output beside the table. List two open questions and who will answer them.',
        'Write a five-line quality gate and add it to your instructions file.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to read your plan and say, in plain words, which risk it would worry about first and why. Compare its answer with your ranking.'] },
      { audience: { min: 'advanced' }, steps: ['Make the table machine-checkable: a script that fails when a risk names a test that does not exist, and add it to the quality gate.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'ai-testing-qa-p1',
    title: 'A test plan and suite for an AI-built app',
    summary: 'Take an app an AI built (the Tindahan order page from this course or one of your own), write a one-page test plan, build a suite that covers each risk and prove that the suite can fail.',
    outcome: 'A repository with a plan, a runnable suite and a coverage-of-risks table with proof: the evidence a client or employer needs to believe that an AI-built app has really been tested.',
    unlockAfterDay: 9,
    steps: [
      { id: 'ai-testing-qa-p1-s1', text: 'Choose the app. Write its promises as five to ten plain sentences and rank the risks by likelihood and damage. Put both in PLAN.md.' },
      { id: 'ai-testing-qa-p1-s2', text: 'Ask an AI for test cases from the rules only (no code in the prompt), check every expected result by hand, and answer or list each open question. Save the table in PLAN.md.' },
      { id: 'ai-testing-qa-p1-s3', text: 'Turn the cases into unit tests and run them. For at least one new behaviour write the tests first, show them red, commit them and then have an AI make them pass without editing them.' },
      { id: 'ai-testing-qa-p1-s4', text: 'Add one browser test for the most important user journey, using role and label locators and no fixed waits. Run an exploratory session with a charter and write up two findings as bug reports, each with a failing test, then fix them.' },
      { id: 'ai-testing-qa-p1-s5', text: 'Plant at least four mutations one at a time, record killed or survived, restore the file each time, and add tests until none survive for a real reason. Add the coverage-of-risks table (risk, layer, test, proof it can fail), a quality gate and rules for AI assistants to PLAN.md and your instructions file.' },
      { id: 'ai-testing-qa-p1-s6', audience: { max: 'beginner' }, text: 'You may keep to five risks, three unit tests, one browser test and two planted mutations. Ask the AI to explain each test in plain words and write your own one-line summary of it in PLAN.md.' },
      { id: 'ai-testing-qa-p1-s7', audience: { min: 'advanced' }, text: 'Run the suite in CI as a required check with a rule against skipped tests and falling test counts. Add a script that fails when a risk row names a missing test, run a mutation tool on one critical module, and include the evidence of an agent-assisted fix that was reviewed against your failing test.' },
    ],
    submission: {
      kind: 'url',
      label: 'Repository link',
      placeholder: 'https://github.com/yourname/order-page-tests',
      hint: 'A repository with PLAN.md (promises, ranked risks, cases, open questions, coverage-of-risks table, quality gate), the unit and browser tests, two bug reports with their tests, and the mutation results.',
    },
    rubric: [
      'The plan lists the app’s promises and ranks risks by likelihood and damage, with the money or the key rules first.',
      'Test cases come from the rules, expected results are worked out independently, and open questions are marked rather than guessed.',
      'Every row of the coverage-of-risks table names a runnable test and evidence that the test can fail (seen red or a mutation killed).',
      'At least one change was made test-first, with the tests committed before the implementation and not edited afterwards.',
      'The suite runs with one command, and the quality gate and instructions for AI assistants forbid weakening or deleting tests.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The smaller scope is honest: each test and risk is explained in the learner’s own words and nothing is claimed as covered without a test.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['There is a browser test and two bug reports with failing tests, and the mutation results are recorded for at least four mutants.'] },
      { audience: { min: 'advanced' }, items: ['The gate is enforced mechanically (required checks, no skips, test-count ratchet), and a mutation tool or script was run on a critical module with survivors triaged.', 'Evidence from an agent-assisted fix is included: the failing reproduction, the reviewed diff and the unchanged test file.'] },
    ],
  },
  {
    id: 'ai-testing-qa-p2',
    title: 'Your testing rules for AI assistants',
    summary: 'Write the instructions-file section, prompt templates and checklist you will reuse on every AI-built project, and try them on a real change.',
    outcome: 'A reusable testing kit that makes any coding assistant test your way: proof that you turned a course into a working routine.',
    unlockAfterDay: 8,
    steps: [
      { id: 'ai-testing-qa-p2-s1', text: 'Write an instructions-file section (CLAUDE.md or your tool’s equivalent) with the test command, the rule that every bug fix needs a test that failed first, the rule against weakening tests and a stop condition after repeated failures.' },
      { id: 'ai-testing-qa-p2-s2', text: 'Write four prompt templates with blanks: test cases from rules, tests only (no implementation), make the tests pass without editing them, and draft a bug report from notes. Try each one on a real change and note what the assistant did differently from a vague request.' },
      { id: 'ai-testing-qa-p2-s3', text: 'Write a one-page personal checklist: the risk questions, the red-before-green habit, the four ways a test cannot fail and the mutation routine.' },
      { id: 'ai-testing-qa-p2-s4', audience: { min: 'advanced' }, text: 'Add the enforcement behind the rules: a hook or CI step that runs the suite, fails on skipped tests, and fails when test files change in an implementation-only change.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your testing kit',
      placeholder: 'Paste your instructions section, your four prompt templates and your checklist, with one example of each used on a real change.',
      hint: 'The instructions section, four templates with blanks, the checklist, and a short note on what changed when you used them.',
    },
    rubric: [
      'The instructions section is short and specific: the test command, a fix needs a failing test first, never weaken tests, and when to stop.',
      'The four templates are reusable, with clear blanks, and each was tried on a real change.',
      'The checklist covers risk ranking, red before green, the four ways tests cannot fail and the mutation routine.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The checklist is written in words the learner can follow without looking anything up.'] },
      { audience: { min: 'advanced' }, items: ['The kit says how each rule is enforced by a check instead of only requested.'] },
    ],
  },
];

export const aiTestingQaCourse: Course = {
  id: 'ai-testing-qa',
  kind: 'standard',
  title: 'AI-Assisted Testing and Quality Assurance',
  level: 'intermediate',
  tagline: 'Make AI-built software trustworthy with tests you can read, run and believe.',
  description:
    'AI builds apps quickly and confidently, and it makes mistakes quietly. In this course you test a real AI-built order page: choose what to check by risk, get AI to propose cases and write tests, work test-first, drive the page in a browser, explore it by hand, report bugs that get fixed, stop old bugs returning and check that the tests themselves can fail.',
  finishLine: [
    'A test plan with ranked risks and a coverage-of-risks table that names a runnable test and proof of failure for each risk',
    'A suite of unit and browser tests for an AI-built app, runnable with one command',
    'Bug reports written with exact steps and a failing test, and fixes that stay fixed',
    'Testing rules and prompt templates that make any AI coding assistant test your way',
  ],
  objectives: [
    'Rank the risks of an AI-built app and choose what to test first',
    'Get an AI to propose test cases from the rules and turn them into runnable tests',
    'Apply test-first prompting so that an AI makes failing tests pass without editing them',
    'Write a browser test that checks what a user does, and judge a failure honestly',
    'Run an exploratory session and write bug reports that a person or agent can act on',
    'Prove that tests can fail by planting deliberate bugs, and stop fixed bugs returning',
  ],
  audiences: ['builder', 'career-changer', 'experienced-dev', 'fresh-grad'],
  skills: [
    { id: 'risk-thinking', label: 'Choosing what to test by risk' },
    { id: 'test-cases', label: 'Designing test cases before tests' },
    { id: 'unit-tests', label: 'Generating, running and reading unit tests' },
    { id: 'test-first', label: 'Test-first prompting' },
    { id: 'e2e-tests', label: 'End-to-end browser checks' },
    { id: 'exploratory', label: 'Exploratory and manual testing with AI' },
    { id: 'bug-reports', label: 'Writing bug reports that get fixed' },
    { id: 'regression', label: 'Stopping old bugs coming back' },
    { id: 'check-the-tests', label: 'Checking the tests themselves' },
    { id: 'test-plan', label: 'A test plan and quality gate' },
  ],
  lessons,
  projects,
  icon: 'bug_report',
  updated: '2026-11-14',
};
