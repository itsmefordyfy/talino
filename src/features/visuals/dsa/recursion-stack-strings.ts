import { defineStrings } from '@/lib/i18n';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const list = (values: readonly number[]) => `[${values.join(', ')}]`;

const recursion = {
  title: 'Recursion and the call stack',
  summary: 'A recursive function calls itself on a smaller problem. Each call gets its own frame on the call stack, and the frames unwind as the answers come back.',
  description: 'Pick a function and an input, then step through the calls. The call stack grows as the function calls itself and shrinks as each call returns its value. The highlighted line shows what the running call is doing, and the counters show the total number of calls and the deepest the stack got. For Fibonacci, turn memoization on or off to see how many calls it saves.',
  topics: ['recursion', 'recursive', 'call stack', 'stack frame', 'base case', 'recursive case', 'factorial', 'fibonacci', 'memoization', 'memo', 'dynamic programming', 'stack overflow', 'unwinding', 'divide and conquer', 'sum of an array', 'countdown'],
  functionLabel: 'Function',
  functionNames: { factorial: 'Factorial', fibonacci: 'Fibonacci', sum: 'Sum of a list', countdown: 'Countdown' },
  inputLabels: { factorial: 'n', fibonacci: 'n', sum: 'List length', countdown: 'Start at' },
  memoLabel: 'Memoization (remember answers)',
  codeLabel: 'Code',
  stackLabel: 'Call stack (the top call is the one running)',
  stackEmpty: 'The call stack is empty.',
  top: 'top',
  waiting: 'waiting',
  running: 'running',
  returning: 'returning',
  memoHit: 'memo hit',
  returnsValue: (value: number) => `returns ${value}`,
  returnsNothing: 'returns nothing',
  memoTitle: 'Memo (saved answers)',
  memoEmpty: 'nothing saved yet',
  outputLabel: 'Printed so far',
  outputEmpty: 'nothing yet',
  calls: (n: number) => `Calls: ${n}`,
  depth: (now: number, deepest: number) => `Stack depth: ${now} (deepest ${deepest})`,
  complexityLabel: 'Cost',
  complexity: {
    factorial: 'n calls, one per value from n down to 1, and a stack n frames deep: O(n) time and O(n) stack space.',
    fibonacciPlain: 'Every call splits in two and the same values are worked out again and again, so the calls roughly double as n grows: about O(2^n).',
    fibonacciMemo: 'Each value is worked out once and then read from the memo, so the calls grow in a straight line: O(n).',
    sum: 'One call per value plus one for the empty list: O(n) calls and a stack that deep.',
    countdown: 'One call per number plus the base case: O(n) calls and a stack that deep.',
  },
  fibCompare: (n: number, plain: number, memo: number) => `fib(${n}) makes ${plural(plain, 'call')} without memoization and ${plural(memo, 'call')} with it.`,
  legend: { running: 'Running', waiting: 'Waiting for a call below', returning: 'Returning a value', memoHit: 'Answered from the memo' },
  stackSummary: (labels: readonly string[]) => (labels.length === 0 ? 'The call stack is empty.' : `Call stack, top first: ${[...labels].reverse().join(', then ')}`),
  // factorial
  factBase: (n: number) => `Call factorial(${n}): n is ${n}, the base case, so it can answer at once without calling itself again.`,
  factCall: (n: number) => `Call factorial(${n}): ${n} is above 1, so it needs factorial(${n - 1}) first. This call waits, and a new frame goes on top of the stack.`,
  factReturn: (n: number, child: number, value: number) => `factorial(${n - 1}) came back with ${child}, so factorial(${n}) = ${n} × ${child} = ${value}. It returns ${value} and its frame is removed.`,
  // fibonacci
  fibBase: (n: number) => `Call fib(${n}): n is below 2, the base case. fib(${n}) is ${n} and no further call is needed.`,
  fibCall: (n: number) => `Call fib(${n}): it needs fib(${n - 1}) and fib(${n - 2}) added together. It waits while they are worked out, one after the other.`,
  fibCallMemo: (n: number) => `Call fib(${n}): not in the memo yet, so work it out from fib(${n - 1}) and fib(${n - 2}).`,
  fibHit: (n: number, value: number) => `Call fib(${n}): the memo already holds fib(${n}) = ${value}, so it returns that at once. No calls below it.`,
  fibReturn: (n: number, a: number, b: number, value: number) => `fib(${n - 1}) = ${a} and fib(${n - 2}) = ${b}, so fib(${n}) = ${a} + ${b} = ${value}. It returns ${value}.`,
  fibReturnMemo: (n: number, a: number, b: number, value: number) => `fib(${n}) = ${a} + ${b} = ${value}. Save it in the memo, so nobody has to work it out again, then return it.`,
  // sum of a list
  sumBase: (values: readonly number[]) => `Call sum(${list(values)}): the list is empty, the base case. Its sum is 0.`,
  sumCall: (values: readonly number[]) => `Call sum(${list(values)}): take the first value, ${values[0]}, and add the sum of the rest, ${list(values.slice(1))}. This call waits for sum(${list(values.slice(1))}).`,
  sumReturn: (values: readonly number[], child: number, value: number) => `sum(${list(values.slice(1))}) came back with ${child}, so sum(${list(values)}) = ${values[0]} + ${child} = ${value}. It returns ${value}.`,
  // countdown
  countBase: 'Call countdown(0): the base case. Print "Liftoff!" and stop calling itself.',
  countCall: (n: number) => `Call countdown(${n}): print ${n}, then call countdown(${n - 1}) and wait for it to finish.`,
  countReturnBase: 'countdown(0) has nothing to return. Its frame is removed and control goes back to the caller.',
  countReturn: (n: number) => `countdown(${n - 1}) has finished, so countdown(${n}) has nothing left to do. It returns and its frame is removed.`,
  returnLine: (label: string, value: number | null) => (value === null ? `${label} returns nothing.` : `${label} returns ${value}.`),
  start: (label: string) => `Press Next to call ${label}. Each call puts a new frame on the stack.`,
  doneValue: (label: string, value: string, calls: number, deepest: number) => `Every call has returned: ${label} = ${value}. It took ${plural(calls, 'call')}, and the stack was at most ${plural(deepest, 'frame')} deep.`,
  doneCountdown: (printed: readonly string[], calls: number, deepest: number) => `Every call has returned. Printed: ${printed.join(', ')}. It took ${plural(calls, 'call')}, and the stack was at most ${plural(deepest, 'frame')} deep.`,
};

export const recursionStrings = defineStrings({
  en: recursion,
  // Placeholder, not a translation: the owner's rule is no Filipino text, so this stays English until a translation is commissioned.
  fil: recursion,
});
