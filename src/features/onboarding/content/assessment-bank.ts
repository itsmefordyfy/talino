/**
 * The skill check's questions, four tiers from "what is a variable" to "why does this query slow
 * down". Language-neutral where possible (snippets read as JavaScript or plain pseudocode), because
 * the check is about thinking, not a particular language. Every question explains its answer.
 */

export type AssessmentTier = 1 | 2 | 3 | 4;

export type AssessmentQuestion = {
  id: string;
  tier: AssessmentTier;
  /** What the question is about, for the results ("logic", "debugging", "web"…). */
  topic: 'basics' | 'logic' | 'code' | 'debugging' | 'web' | 'tools' | 'design' | 'data';
  prompt: string;
  /** A snippet shown under the prompt in a code block. */
  code?: { language: string; text: string };
  choices: string[];
  /** Index of the correct choice. */
  answer: number;
  explanation: string;
};

export const ASSESSMENT_BANK: readonly AssessmentQuestion[] = [
  // Tier 1: first ideas
  {
    id: 'a1-variable',
    tier: 1,
    topic: 'basics',
    prompt: 'In programming, what is a variable?',
    choices: ['A named place that holds a value', 'A kind of error', 'A part of the keyboard', 'A program that is running'],
    answer: 0,
    explanation: 'A variable gives a name to a value (a number, some text…) so the program can use and change it later.',
  },
  {
    id: 'a1-output',
    tier: 1,
    topic: 'code',
    prompt: 'What does this print?',
    code: { language: 'javascript', text: 'let x = 3;\nx = x + 2;\nconsole.log(x);' },
    choices: ['3', '5', '32', 'x'],
    answer: 1,
    explanation: 'x starts at 3, then x + 2 is 5 and is stored back into x, so 5 is printed.',
  },
  {
    id: 'a1-if',
    tier: 1,
    topic: 'logic',
    prompt: 'What does this print when age is 17?',
    code: { language: 'javascript', text: 'if (age >= 18) {\n  console.log("adult");\n} else {\n  console.log("minor");\n}' },
    choices: ['adult', 'minor', 'Nothing', 'An error'],
    answer: 1,
    explanation: '17 is not greater than or equal to 18, so the else branch runs and prints "minor".',
  },
  {
    id: 'a1-pattern',
    tier: 1,
    topic: 'logic',
    prompt: 'What comes next in the pattern 2, 4, 8, 16, …?',
    choices: ['18', '24', '32', '20'],
    answer: 2,
    explanation: 'Each number is double the one before it, so 16 doubles to 32.',
  },
  {
    id: 'a1-bug',
    tier: 1,
    topic: 'debugging',
    prompt: 'In software, what is a "bug"?',
    choices: ['A mistake that makes a program behave wrongly', 'A virus sent by email', 'A very fast computer', 'A programming language'],
    answer: 0,
    explanation: 'A bug is a mistake in the code or the idea behind it. Finding and fixing bugs is a normal part of every developer’s day.',
  },
  {
    id: 'a1-boolean',
    tier: 1,
    topic: 'logic',
    prompt: 'What is the result of true AND false?',
    choices: ['true', 'false', 'both', 'It depends on the computer'],
    answer: 1,
    explanation: 'AND is true only when both sides are true. One side is false, so the result is false.',
  },
  // Tier 2: small programs
  {
    id: 'a2-function',
    tier: 2,
    topic: 'code',
    prompt: 'What does this print?',
    code: { language: 'javascript', text: 'function double(n) {\n  return n * 2;\n}\nconsole.log(double(4));' },
    choices: ['4', '6', '8', 'double'],
    answer: 2,
    explanation: 'double(4) runs the function with n = 4 and returns 4 * 2, which is 8.',
  },
  {
    id: 'a2-array',
    tier: 2,
    topic: 'code',
    prompt: 'What does this print? (Lists start counting at 0.)',
    code: { language: 'javascript', text: 'const a = [10, 20, 30];\nconsole.log(a[1]);' },
    choices: ['10', '20', '30', '1'],
    answer: 1,
    explanation: 'Position 0 is 10, position 1 is 20. That is why counting from zero trips up so many beginners.',
  },
  {
    id: 'a2-loop',
    tier: 2,
    topic: 'code',
    prompt: 'How many times does this loop print?',
    code: { language: 'javascript', text: 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}' },
    choices: ['2', '3', '4', 'Forever'],
    answer: 1,
    explanation: 'i takes the values 0, 1 and 2. When i reaches 3 the condition i < 3 is false, so the loop stops after 3 prints.',
  },
  {
    id: 'a2-compare',
    tier: 2,
    topic: 'code',
    prompt: 'In most languages, what is the difference between = and ===?',
    choices: ['= stores a value, === compares two values', 'They are the same', '= compares, === stores', '=== is only for numbers'],
    answer: 0,
    explanation: 'A single = assigns a value to a variable. === asks "are these equal?" and gives true or false.',
  },
  {
    id: 'a2-search',
    tier: 2,
    topic: 'logic',
    prompt: 'A list has 100 names in no particular order. To find one name by checking them one at a time, what is the most checks you may need?',
    choices: ['1', '10', '50', '100'],
    answer: 3,
    explanation: 'If the name is last, or missing, you check all 100. That worst case is what developers plan for.',
  },
  {
    id: 'a2-debug',
    tier: 2,
    topic: 'debugging',
    prompt: 'Your program shows an error message and stops. What is the best first step?',
    choices: ['Read the message and find the line it points to', 'Delete the program and start again', 'Ignore it and run it again', 'Buy a faster computer'],
    answer: 0,
    explanation: 'Error messages usually name the problem and the line. Reading them carefully solves a surprising share of bugs.',
  },
  // Tier 3: real projects
  {
    id: 'a3-json',
    tier: 3,
    topic: 'web',
    prompt: 'Which of these is valid JSON?',
    choices: ['{"name": "Ana", "age": 25}', '{name: Ana, age: 25}', "{'name': 'Ana'}", '{"name": "Ana", "age": 25,}'],
    answer: 0,
    explanation: 'JSON needs double-quoted keys and strings and no trailing comma. The others break one of those rules.',
  },
  {
    id: 'a3-status',
    tier: 3,
    topic: 'web',
    prompt: 'A request to a website returns status 404. What does that mean?',
    choices: ['The page or item was not found', 'The server crashed', 'You are not allowed in', 'It worked perfectly'],
    answer: 0,
    explanation: '404 means "not found". A crash is usually a 5xx status, and "not allowed" is 401 or 403.',
  },
  {
    id: 'a3-async',
    tier: 3,
    topic: 'code',
    prompt: 'What does await do in this code?',
    code: { language: 'javascript', text: 'async function load() {\n  const res = await fetch("/api/user");\n  return res.json();\n}' },
    choices: ['Waits for the request to finish before moving on, without freezing the app', 'Makes the request faster', 'Cancels the request', 'Runs the request twice'],
    answer: 0,
    explanation: 'await pauses this function until the promise settles, while the rest of the app stays responsive.',
  },
  {
    id: 'a3-git',
    tier: 3,
    topic: 'tools',
    prompt: 'Why do developers use a Git branch?',
    choices: ['To work on a change without touching the main code until it is ready', 'To make the code run faster', 'To delete old files', 'To share a password'],
    answer: 0,
    explanation: 'A branch is a safe copy to experiment on. When the change is good, it is merged back.',
  },
  {
    id: 'a3-secret',
    tier: 3,
    topic: 'tools',
    prompt: 'Where should an API key for a paid service NOT be put?',
    choices: ['In a public GitHub repository', 'In a server environment variable', 'In a secrets manager', 'In a local .env file that is git-ignored'],
    answer: 0,
    explanation: 'Anything in a public repo is found by bots within minutes. Keys belong in environment variables or a secrets manager.',
  },
  {
    id: 'a3-test',
    tier: 3,
    topic: 'tools',
    prompt: 'What is a unit test for?',
    choices: ['Checking that one small piece of code does what it should, automatically', 'Measuring how fast the internet is', 'Designing the screen', 'Writing documentation'],
    answer: 0,
    explanation: 'A unit test runs a small piece of code with known input and checks the output, so a later change that breaks it is caught at once.',
  },
  // Tier 4: design and scale
  {
    id: 'a4-bigo',
    tier: 4,
    topic: 'design',
    prompt: 'Binary search on a sorted list of 1,000,000 items needs roughly how many steps?',
    choices: ['About 20', 'About 1,000', 'About 500,000', 'Exactly 1,000,000'],
    answer: 0,
    explanation: 'Each step halves what is left, and 2 to the power 20 is about a million. That is O(log n).',
  },
  {
    id: 'a4-index',
    tier: 4,
    topic: 'data',
    prompt: 'A query filtering a table of millions of rows by email is slow. What is the usual first fix?',
    choices: ['Add a database index on the email column', 'Buy more RAM for the phone', 'Rename the table', 'Run the query twice'],
    answer: 0,
    explanation: 'An index lets the database jump to matching rows instead of scanning the whole table.',
  },
  {
    id: 'a4-idempotent',
    tier: 4,
    topic: 'web',
    prompt: 'An API request is "idempotent". What does that guarantee?',
    choices: ['Sending it several times has the same effect as sending it once', 'It is encrypted', 'It returns instantly', 'It can only be sent once'],
    answer: 0,
    explanation: 'Idempotent requests are safe to retry after a timeout, which is why payment and sync APIs are built around them.',
  },
  {
    id: 'a4-race',
    tier: 4,
    topic: 'debugging',
    prompt: 'Two users press "buy the last ticket" at the same instant and both succeed. What kind of bug is this?',
    choices: ['A race condition', 'A syntax error', 'A memory leak', 'A typo'],
    answer: 0,
    explanation: 'Both requests read "1 left" before either wrote "0 left". Transactions or locks fix it.',
  },
  {
    id: 'a4-n1',
    tier: 4,
    topic: 'data',
    prompt: 'A page loads 50 posts, then runs one extra query per post to get its author. What is this problem called?',
    choices: ['The N+1 query problem', 'A deadlock', 'Cache poisoning', 'A stack overflow'],
    answer: 0,
    explanation: '1 query for the list plus N for the authors. A join or a single batched query fixes it.',
  },
  {
    id: 'a4-closure',
    tier: 4,
    topic: 'code',
    prompt: 'What does this print?',
    code: { language: 'javascript', text: 'function counter() {\n  let n = 0;\n  return () => ++n;\n}\nconst next = counter();\nnext();\nconsole.log(next());' },
    choices: ['2', '1', '0', 'undefined'],
    answer: 0,
    explanation: 'The inner function keeps its own n alive (a closure). The first call makes it 1 and the second makes it 2.',
  },
];
