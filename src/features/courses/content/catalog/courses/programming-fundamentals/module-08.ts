import type { Lesson, Project } from '../../../types';

/**
 * Module 8, Data Structures Fundamentals (lessons 36 to 40, project p8). Arrays, then changing them, then looping over them, then objects, then Set,
 * Map and choosing between them. Everything printed in a code comment or a "Walk through" was produced by running the code with Node, and the
 * activities are run by the activity validator (the in-app runner).
 */

export const lessons: Lesson[] = [
  {
    id: 'programming-fundamentals-36',
    day: 36,
    title: 'What Data Structures Are: Arrays and Lists',
    summary: 'Keep many values in one ordered list, read any of them by its position, and learn why counting starts at 0.',
    intro: {
      objectives: [
        'Explain what a data structure is and why one variable per value stops working',
        'Create an array and read an element by its index',
        'Use length to find the last element and predict what an out-of-range index gives',
      ],
      why: 'Almost every program an AI writes for you, from an expense tracker to a shop\'s stock list, keeps its data in lists. If you can read a list and its positions, you can check whether the code is right.',
    },
    minutes: 22,
    skills: ['data-structures'],
    body: [
      {
        type: 'paragraph',
        text: "So far every value in your programs has lived in its own variable: one `amount`, one `description`. That is fine for one expense. It stops working the day you have forty, because you cannot write forty variable names, and you cannot loop over names. A **data structure** is a way of organising many values so a program can find them, change them and go through them. The simplest and most common one is the **array**: an ordered list of values. When an AI assistant writes code for an expense tracker, a to-do app or a stock list, nearly every line touches an array or something built from one, so reading arrays well is how you judge that code.",
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Picture a row of lockers in a school hallway, side by side. Each locker holds one thing, and each has a number painted on it. If someone says "get what is in locker 2", you walk to locker 2 and open it. You never search through the contents; the number takes you straight there. An array works the same way: a row of slots, each holding one value, each reachable by its number.',
      },
      {
        type: 'paragraph',
        text: 'The picture is honest in two places and wrong in one. Real lockers usually start at number 1, while a programmer numbers the first slot **0** (the next section says why). Real lockers also never move, while in the next lesson you will see that removing a value from an array makes the values after it slide down to fill the gap, and their numbers change.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: "An array is written with square brackets, and its values are separated by commas: `[24, 15, 120, 8]`. Each value is an **element** (people also say item). The number that says where an element sits is its **index**. Indexes start at **0**, so the first element has index 0, the second has index 1, and so on. The reason is that an index counts how far you have moved from the start: the first element is zero steps from the start, the second is one step away.",
      },
      {
        type: 'table',
        headers: ['Index', '0', '1', '2', '3'],
        rows: [['Element', '24', '15', '120', '8']],
        caption: 'The array [24, 15, 120, 8]. Four elements, so the indexes run from 0 to 3.',
      },
      { type: 'visual', id: 'arrays-objects', caption: 'Switch to the array, add a few values and watch the indexes. Try asking for an index that does not exist.' },
      {
        type: 'paragraph',
        text: 'You read an element by writing the array\'s name and the index in square brackets: `amounts[2]`. The array also knows how many elements it holds. That count is its **length**, written `amounts.length`. Because counting starts at 0, the last index is always `length - 1`. An array of four elements has indexes 0, 1, 2 and 3, so the last one is `amounts[amounts.length - 1]`. That expression works for a list of any size, which is why you will see it everywhere.',
      },
      {
        type: 'paragraph',
        text: 'What if you ask for an index that is not there? JavaScript does not stop with an error. It quietly gives you `undefined`, the value you met in module 3 for "nothing here". That is the most common array surprise: a wrong index does not crash, it just hands your program an empty value that causes trouble later. An **empty array** is written `[]`; its length is 0 and every index is out of range.',
      },
      {
        type: 'paragraph',
        text: 'An array can hold any kind of value, including a mix of numbers and text, but good code keeps one kind of thing in one array: a list of amounts, a list of category names. Several facts about one thing, such as a single expense with a description, an amount and a date, belong in an object, which is lesson 39. Other languages call this idea a **list** (Python does), and some name a fixed-size version an array. In JavaScript the array is the list, so the two words are used almost interchangeably here.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: make an array of expense amounts in pesos, then look at it, one element and its length.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Create an array and read from it',
        code: `const amounts = [24, 15, 120, 8];
console.log(amounts); // [ 24, 15, 120, 8 ]
console.log(amounts[0]); // 24
console.log(amounts[2]); // 120
console.log(amounts.length); // 4`,
      },
      { type: 'paragraph', text: 'Step 2: find the last element, and see what a wrong index does.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'The last element and out-of-range indexes',
        code: `const amounts = [24, 15, 120, 8];
console.log(amounts[amounts.length - 1]); // 8
console.log(amounts[4]); // undefined
console.log(amounts[-1]); // undefined`,
      },
      { type: 'paragraph', text: 'Step 3: an array of text, an empty array, and two elements used together.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Text, empty arrays and using elements',
        code: `const categories = ['food', 'transport', 'load'];
const nothingYet = [];
console.log(categories[1]); // transport
console.log(nothingYet.length); // 0
console.log(nothingYet[0]); // undefined

const amounts = [24, 15, 120, 8];
const first = amounts[0];
const last = amounts[amounts.length - 1];
console.log(\`First: \${first}, last: \${last}, together: \${first + last}\`); // First: 24, last: 8, together: 32`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** `const amounts = [24, 15, 120, 8];` creates a variable holding one array of four numbers. Printing the whole array shows it in square brackets. `amounts[0]` is the first element, 24, and `amounts[2]` is the third, 120. `amounts.length` is 4 because four elements are stored.',
          '**Step 2.** `amounts.length - 1` is 3, so `amounts[amounts.length - 1]` is `amounts[3]`, which is 8. `amounts[4]` asks for a fifth element that does not exist, and so does `amounts[-1]`: JavaScript does not count backwards from the end with a minus sign. Both give `undefined` and neither raises an error.',
          '**Step 3.** `categories[1]` is the second text value, `transport`. The empty array has length 0, and reading `nothingYet[0]` gives `undefined`. The last lines read the first and last amounts into two variables and add them: 24 plus 8 is 32. The `const` keyword fixes the variable\'s name to this array; it does not stop you changing what is inside, which the next lesson does.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: think of the array as a shopping list written on paper with the lines numbered from 0. `amounts[2]` means "read what is written on line number 2". `amounts.length` means "how many lines are written". Asking for a line that was never written does not tear the paper; you simply read nothing, and JavaScript calls that nothing `undefined`. Line by line, the code above does this: it writes a list of four prices, reads the first, the third and the count, then reads the last line by working out its number (the count minus one). The remaining lines show that a list can hold words, that an empty list has zero lines, and that two lines can be read and added together like any two numbers.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'A JavaScript array is an object whose numeric keys are its indexes, which is why `typeof []` is `"object"` and you test with `Array.isArray`. Reading by index takes the same time for a list of ten or ten million elements, which is the main reason arrays are the default container. The silent `undefined` for a bad index is a recurring source of defects: `list[list.length - 1]` on an empty list returns `undefined` and the failure shows up later, far from the cause, so code that cannot tolerate an empty input should check the length first. Do not assume this convention elsewhere: Python raises an error for an out-of-range index, Java throws an exception, and a few languages, Lua, R and MATLAB among them, number from 1.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Explain and quiz me',
        text: 'I am learning JavaScript arrays and I am a beginner. Explain in plain words, with a sari-sari store example, why the first element of an array has index 0 and how to get the last element when I do not know the length. Then ask me three short quiz questions about indexes and `length`, one at a time. Wait for my answer each time. Do not tell me the answer before I try, and give a hint if I am stuck.',
      },
      {
        type: 'paragraph',
        text: 'In the answer, look for three facts: the first index is 0, the last index is `length - 1`, and reading a missing index in JavaScript gives `undefined`. An AI can mislead you in two ways here. It may mix languages and say that an out-of-range read raises an error (true in Python or Java, not in JavaScript), or it may give an example that quietly starts counting at 1. Check every answer against the table above, and run any example it shows.',
      },
      {
        type: 'takeaways',
        items: [
          'A data structure organises many values so a program can find, change and loop over them; the array is the simplest.',
          'An array is an ordered list written in square brackets. Each element has an index, and the first index is 0.',
          'array.length is the number of elements, so the last element is array[array.length - 1].',
          'Reading an index that does not exist gives undefined, with no error, so wrong indexes hide until later.',
          'Keep one kind of thing in one array; several facts about one thing belong in an object (lesson 39).',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-36-predict-output-1',
          kind: 'predict-output',
          title: 'Read the fares',
          prompt: 'What does this program print? Remember that indexes start at 0.',
          language: 'javascript',
          code: `const fares = [12, 15, 20, 8, 25];
console.log(fares[1]);
console.log(fares[fares.length - 2]);
console.log(fares.length);
console.log(fares[5]);`,
          expected: '15\n8\n5\nundefined',
          choices: ['15\n8\n5\nundefined', '12\n20\n5\nundefined', '15\n8\n5\n25', '15\n8\n4\nundefined'],
          wrongNotes: {
            '12\n20\n5\nundefined': 'This counts from 1. fares[1] is the second element, 15, and fares[fares.length - 2] is the fourth, 8.',
            '15\n8\n5\n25': 'fares[5] would be the sixth element, but the array has only five, so there is nothing there. Its last index is 4.',
            '15\n8\n4\nundefined': 'The length counts elements, not the last index. Five elements are stored, so the length is 5 (the last index is 4).',
          },
          hints: [
            'Write the indexes under the values: 0 is 12, 1 is 15, and so on.',
            'fares.length - 2 is 3. Which element has index 3?',
            'The array has five elements, so indexes 0 to 4 exist. What does index 5 give?',
          ],
          explanation: 'fares[1] is 15 and fares.length is 5, so fares.length - 2 is 3 and fares[3] is 8. Index 5 is past the last element (index 4), so the program prints undefined instead of failing.',
          concept: 'array indexes',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-36-fix-bug-1',
          kind: 'fix-bug',
          title: 'The last fare that is not there',
          prompt: 'This program should print the last fare, 25, but it prints undefined. Tap the line with the bug, then choose the fix.',
          language: 'javascript',
          code: `const fares = [12, 15, 20, 8, 25];
// print the last fare
console.log(fares[fares.length]);`,
          bugLine: 3,
          fixes: [
            { line: 'console.log(fares[fares.length - 1]);', correct: true, why: 'The last index is one less than the length, so this reads the fifth element, 25.' },
            { line: 'console.log(fares[fares.length - 2]);', correct: false, why: 'That is the next-to-last element, 8.' },
            { line: 'console.log(fares[5]);', correct: false, why: 'Index 5 does not exist in a five-element array, so this is still undefined (and it only works for this one list).' },
            { line: 'console.log(fares.length);', correct: false, why: 'That prints how many fares there are, 5, not the last fare.' },
          ],
          lineNote: 'Run the program in your head. Which line prints something different from what the comment promises?',
          tests: { kind: 'output', expected: ['25'] },
          hints: [
            'The comment says "last fare". Which index holds the last element of a five-element array?',
            'The length is 5, but the indexes run from 0 to 4.',
            'You want the length minus one.',
          ],
          explanation: 'A length of 5 means the last index is 4. fares[fares.length] asks for the slot just after the end, which is empty, so JavaScript gives undefined without an error.',
          concept: 'last element',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-36-fill-blank-1',
          kind: 'fill-blank',
          title: 'Stops on the route',
          prompt: 'Complete the code so it prints School (the third stop) and then Plaza (the last stop, whatever the length).',
          language: 'javascript',
          code: `const stops = ['Terminal', 'Market', 'School', 'Plaza'];
console.log(stops[___]);
console.log(stops[stops.___ - 1]);`,
          blanks: [
            { answers: ['2'], feedback: 'Indexes start at 0: Terminal is 0, Market is 1, so School is the one after that.' },
            { answers: ['length'], feedback: 'The count of elements is a property of the array. The word for it is not "size" or "count".' },
          ],
          bank: ['2', '3', '0', 'length', 'size'],
          tests: { kind: 'output', expected: ['School', 'Plaza'] },
          hints: [
            'Terminal is at index 0. Count along to School.',
            'For the second blank, what do you write after the array name to get its number of elements?',
            'The answers are 2 and length.',
          ],
          explanation: 'School is the third stop, so its index is 2. stops.length is 4 and 4 - 1 is 3, the index of the last stop, Plaza.',
          concept: 'array indexes',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-36-q1',
        prompt: 'A program has const scores = [70, 85, 90];. What does scores[1] give?',
        choices: ['70', '85', '90', 'undefined'],
        answer: 1,
        explanation: 'Index 0 is 70, index 1 is 85 and index 2 is 90. Counting starts at 0, so scores[1] is the second element.',
      },
      {
        id: 'programming-fundamentals-36-q2',
        prompt: 'You are writing code that must read the last element of an expense list, and the list changes size all day. Which expression is right?',
        choices: ['list[last]', 'list[list.length]', 'list[list.length - 1]', 'list[list.length + 1]'],
        answer: 2,
        explanation: 'The last index is always one less than the length. list[list.length] is just past the end and list[-1] is not a position from the end, so both give undefined.',
      },
      {
        id: 'programming-fundamentals-36-q3',
        prompt: 'The array prices holds five elements. What happens when a program runs console.log(prices[7])?',
        choices: ['It prints undefined and the program carries on', 'The program stops at once with an out-of-range error', 'It prints the last price, because the index wraps around', 'It prints 0, the value JavaScript uses for an empty slot'],
        answer: 0,
        explanation: 'JavaScript gives undefined for an index that does not exist and does not raise an error. That is why a wrong index can hide for a while.',
      },
      {
        id: 'programming-fundamentals-36-q4',
        prompt: 'Why is an array better than forty separate variables named expense1 to expense40?',
        choices: ['Variables can only hold numbers, never prices or text', 'An array uses less electricity than separate variables do', 'Arrays can never be empty, so a program is always safe', 'One name covers them all, and code can go through them by position'],
        answer: 3,
        explanation: 'The array gives the whole list one name and an index for each element, so code can read element number i or loop over any number of them. Separate names cannot be looped over.',
      },
      {
        id: 'programming-fundamentals-36-q5',
        audience: { max: 'beginner' },
        prompt: 'A friend says, "In the array [\'rice\', \'egg\', \'salt\'], the third item is at index 3." What is wrong?',
        choices: ['Nothing, that is correct for every array', 'The third item is at index 2, since the first is 0', 'The array has no third item, because it holds text', 'Arrays of text cannot have indexes at all'],
        answer: 1,
        explanation: 'Counting starts at 0: rice is 0, egg is 1 and salt is 2. Index 3 would be a fourth item, which does not exist here.',
      },
      {
        id: 'programming-fundamentals-36-q6',
        audience: { min: 'advanced' },
        prompt: 'A helper returns items[items.length - 1] to get the most recent entry, and it is sometimes called with an empty array. What is the real risk?',
        choices: ['It throws an exception that stops the program right away', 'It returns the first element of the array instead', 'It returns undefined silently, so the failure shows up later', 'It returns 0 for the empty case, which hides the problem'],
        answer: 2,
        explanation: 'items.length - 1 is -1, which is not an element, so the read gives undefined with no error. The bug surfaces wherever that value is used next, so a guard on the length belongs inside the helper.',
      },
    ],
    task: {
      title: 'Your week as an array',
      minutes: 10,
      steps: [
        'On paper, write five amounts you spent this week, in the order they happened, as an array in square brackets. Write the index (0 to 4) above each one.',
        'Before running anything, write down what list[2], list.length and list[list.length - 1] will give, and what list[5] will give.',
        'Open any free JavaScript environment (the console in a browser\'s developer tools or an online playground), type your array and the four reads, and compare with your predictions. Note any that surprised you and why.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain, line by line, what each of your four reads does, then check its explanation against your own predictions.'] },
      { audience: { min: 'advanced' }, steps: ['Write a small function lastItem(list) that returns the last element, or null when the list is empty, and test it on an empty array, one element and many.'] },
    ],
  },
  {
    id: 'programming-fundamentals-37',
    day: 37,
    title: 'Accessing, Updating, Adding and Removing Elements',
    summary: 'Change a list in place: overwrite an element, add to either end, remove from anywhere, and find where something is.',
    intro: {
      objectives: [
        'Update, add and remove elements with index assignment, push, pop, shift, unshift and splice',
        'Tell the methods that change an array apart from those that only look (slice, indexOf, includes)',
        'Predict how the indexes shift after an element is added or removed',
      ],
      why: 'Real lists never stay still: a new expense arrives, an item is sold, a typo is fixed. When AI-written code edits a list, you need to see exactly what changed and what moved.',
    },
    minutes: 25,
    skills: ['data-structures'],
    body: [
      {
        type: 'paragraph',
        text: 'Last lesson you made an array and read from it. A list that you can only read is not much use for an expense tracker, because expenses are added, corrected and deleted all day. This lesson is about changing an array: overwriting one element, adding at either end, taking elements out, and finding where something sits. These changes are also where most array bugs live, because every change can move the other elements to new indexes. Learning to follow those moves is how you will check code an AI wrote for you.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Think of the line at a bakery counter. A new customer **joins the back** of the line. The person at the **front is served** and leaves. Someone in the **middle changes their mind** and walks out, and everybody behind them steps forward one place. Each of these has an array operation with a name, and the line\'s positions (first, second, third) are the indexes.',
      },
      {
        type: 'paragraph',
        text: 'The picture stops working in two places. In a real line the people behind the one who left step forward on their own; in an array the computer renumbers the elements for you, and your code must be ready for the new numbers. And a real line is never "empty and still served": taking from an empty array does not fail, it just gives you `undefined`.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'An array is **mutable**, which means it can be changed in place after it is made. There are two ways to change it. To overwrite one element, assign to its index: `amounts[1] = 18` replaces whatever was at index 1. To add or remove elements you use **methods**, which are actions an array knows how to do, written after a dot with brackets: `amounts.push(50)`. (You met functions in module 7; a method is a function attached to a value.)',
      },
      {
        type: 'table',
        headers: ['Method', 'What it does', 'Changes the array?', 'Gives back'],
        rows: [
          ['push(x)', 'Adds x at the end', 'Yes', 'The new length'],
          ['pop()', 'Removes the last element', 'Yes', 'The removed element (undefined if empty)'],
          ['unshift(x)', 'Adds x at the start', 'Yes', 'The new length'],
          ['shift()', 'Removes the first element', 'Yes', 'The removed element (undefined if empty)'],
          ['splice(start, count, ...)', 'Removes count elements from index start, and can insert new ones there', 'Yes', 'An array of the removed elements'],
          ['slice(start, end)', 'Copies the elements from start up to, but not including, end', 'No', 'A new array'],
          ['indexOf(x)', 'Finds the first index where x sits', 'No', 'The index, or -1 if it is not there'],
          ['includes(x)', 'Checks whether x is in the array', 'No', 'true or false'],
        ],
        caption: 'The array methods of this lesson. Four of them only look.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Choose the method by where the change happens.',
        source: 'flowchart TD\n  A[What do you need to do to the list?] --> B{Where does it happen?}\n  B -->|at the end| C[push to add, pop to remove]\n  B -->|at the start| D[unshift to add, shift to remove]\n  B -->|somewhere in the middle| E[splice with an index]\n  B -->|only looking, no change| F[an index, slice, indexOf or includes]',
      },
      {
        type: 'paragraph',
        text: 'The names `splice` and `slice` look alike and are easy to mix up. **`splice` changes the array** (think of splicing a rope: you cut and join the actual rope). **`slice` makes a copy** of a piece and leaves the original alone (think of slicing a photo of a cake). Also notice that `slice` stops just before its `end` index, so `slice(1, 4)` gives the elements at indexes 1, 2 and 3.',
      },
      {
        type: 'warning',
        text: 'After a removal, the elements behind the gap get new indexes. If `items` is `[\'rice\', \'eggs\', \'oil\']` and you remove `eggs`, then `oil` is no longer at index 2: it moved to index 1. Code that remembers an index from before the change can now point at the wrong element, or at nothing.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: overwrite one element, and see that a `const` array can still change inside.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Updating by index',
        code: `const amounts = [24, 15, 120, 8];
amounts[1] = 18;
console.log(amounts); // [ 24, 18, 120, 8 ]

const wallet = [100];
wallet.push(50);
console.log(wallet); // [ 100, 50 ]`,
      },
      { type: 'paragraph', text: 'Step 2: a line of customers, using the four methods that work on the ends.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Adding and removing at the ends',
        code: `const line = ['Ana', 'Ben', 'Carla'];
line.push('Dino');
console.log(line); // [ 'Ana', 'Ben', 'Carla', 'Dino' ]
const served = line.shift();
console.log(served); // Ana
console.log(line); // [ 'Ben', 'Carla', 'Dino' ]
line.unshift('Eli');
console.log(line); // [ 'Eli', 'Ben', 'Carla', 'Dino' ]
const left = line.pop();
console.log(left); // Dino
console.log(line); // [ 'Eli', 'Ben', 'Carla' ]`,
      },
      { type: 'paragraph', text: 'Step 3: change the middle with `splice`.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Removing and inserting in the middle',
        code: `const items = ['rice', 'eggs', 'oil', 'salt'];
const removed = items.splice(1, 2);
console.log(removed); // [ 'eggs', 'oil' ]
console.log(items); // [ 'rice', 'salt' ]
items.splice(1, 0, 'sugar');
console.log(items); // [ 'rice', 'sugar', 'salt' ]`,
      },
      { type: 'paragraph', text: 'Step 4: methods that only look.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Looking without changing',
        code: `const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const midweek = days.slice(1, 4);
console.log(midweek); // [ 'Tue', 'Wed', 'Thu' ]
console.log(days); // [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ]
console.log(days.indexOf('Wed')); // 2
console.log(days.indexOf('Sun')); // -1
console.log(days.includes('Fri')); // true`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'paragraph',
        text: 'Here is Step 2 slowly. The table shows the line after each statement, which is how you should follow any code that changes an array.',
      },
      {
        type: 'table',
        headers: ['Statement', 'The line afterwards', 'Value it gives back'],
        rows: [
          ['const line = [...]', 'Ana, Ben, Carla', '-'],
          ["line.push('Dino')", 'Ana, Ben, Carla, Dino', '4 (the new length)'],
          ['line.shift()', 'Ben, Carla, Dino', 'Ana (kept in served)'],
          ["line.unshift('Eli')", 'Eli, Ben, Carla, Dino', '4'],
          ['line.pop()', 'Eli, Ben, Carla', 'Dino (kept in left)'],
        ],
        caption: 'A trace of Step 2. Ben moved from index 1 to index 0 when Ana was served.',
      },
      {
        type: 'list',
        items: [
          '**Step 1.** `amounts[1] = 18` replaces the 15 with 18. Nothing moves, because the length did not change. `wallet.push(50)` works even though `wallet` is a `const`: `const` fixes which array the name points to, not what is inside it. Only `wallet = []` would fail.',
          '**Step 3.** `items.splice(1, 2)` starts at index 1 and removes two elements, `eggs` and `oil`, and gives them back as an array. `salt` slides down to index 1. Then `splice(1, 0, \'sugar\')` starts at index 1, removes zero elements and inserts `sugar` there, pushing `salt` to index 2.',
          '**Step 4.** `slice(1, 4)` copies indexes 1, 2 and 3 into a new array. The original still has all five days. `indexOf(\'Wed\')` is 2, and `indexOf(\'Sun\')` is -1, the signal for "not found", because -1 can never be a real index. `includes` answers with `true` or `false`.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: the "changing" methods work like edits to a written list. `push` writes a new line at the bottom, `pop` crosses out the last line, `unshift` squeezes a new line in at the top, and `shift` crosses out the first line. `splice` crosses out lines in the middle (or squeezes some in) and renumbers the rest. The "looking" methods are like reading the list without a pen: `slice` photocopies a few lines, `indexOf` tells you the line number of something (or -1 if it is missing), and `includes` tells you yes or no. In the code above, each `console.log` after a change shows you the list as it stands, so you can see what the change did. When you are not sure, write the list on paper and do the change by hand.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Mutation has consequences beyond one array. An array is an object, and a function that receives one gets a reference to the same array, so a helper that calls `shift` or `splice` changes its caller\'s data too. Larger codebases often prefer to leave the input alone and return a changed copy, and recent JavaScript versions added copying twins of the mutating methods (`toSpliced` and others, see MDN). Also mind the cost: `push` and `pop` touch only the end, while `shift`, `unshift` and a middle `splice` can force every later element to get a new index, which can matter for large lists used as queues. Finally, assigning past the end (`list[10] = x` on a four-element array) makes a sparse array with empty slots, which is nearly always a bug.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Trace it with me',
        text: 'I am a beginner learning JavaScript arrays. Here is a short program: `const stock = [\'soap\', \'rice\', \'oil\']; stock.push(\'tea\'); stock.shift(); stock.splice(1, 1);`. Do not give me the final array. Ask me to write what `stock` holds after each of the three lines, one line at a time. After each answer of mine, tell me if it is right and explain what moved. Then ask me a similar question about `slice` versus `splice`.',
      },
      {
        type: 'paragraph',
        text: 'Check the AI\'s answers against your own paper trace. A common slip is swapping `splice` and `slice` (it says the original array was left alone after a `splice`), or forgetting that `splice(1, 1)` removes one element, not "everything from index 1". If the AI and your trace disagree, run the three lines yourself: the program is the judge, not the AI.',
      },
      {
        type: 'takeaways',
        items: [
          'Arrays are mutable: assign to an index to overwrite, or use methods to add and remove. const only fixes the name, not the contents.',
          'push and pop work at the end, unshift and shift at the start, splice anywhere. pop, shift and splice give back what they removed.',
          'slice, indexOf and includes only look: slice returns a copy, indexOf returns the index or -1, includes returns true or false.',
          'Adding or removing before an element changes its index, so never trust an index from before the change.',
          'Follow code that edits arrays with a trace: write the array out after every statement.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-37-predict-output-1',
          kind: 'predict-output',
          title: 'Follow the stock',
          prompt: 'Write the array after each line in your head or on paper. What does the program print?',
          language: 'javascript',
          code: `const stock = ['soap', 'rice', 'oil', 'salt', 'sugar'];
stock.push('tea');
const first = stock.shift();
stock.splice(1, 2);
console.log(first);
console.log(stock);
console.log(stock.length);`,
          expected: "soap\n[ 'rice', 'sugar', 'tea' ]\n3",
          choices: ["soap\n[ 'rice', 'sugar', 'tea' ]\n3", "soap\n[ 'rice', 'salt', 'sugar', 'tea' ]\n4", "rice\n[ 'oil', 'sugar', 'tea' ]\n3", "soap\n[ 'oil', 'salt', 'tea' ]\n3"],
          wrongNotes: {
            "soap\n[ 'rice', 'salt', 'sugar', 'tea' ]\n4": 'This removes only one element. splice(1, 2) removes two, starting at index 1, after the shift.',
            "rice\n[ 'oil', 'sugar', 'tea' ]\n3": 'shift removes and returns the first element, which is soap, not the second.',
            "soap\n[ 'oil', 'salt', 'tea' ]\n3": 'After the shift, index 0 is rice and index 1 is oil. The splice starts at index 1, so it removes oil and salt and keeps rice.',
          },
          hints: [
            'After push, tea is at the end. After shift, soap is gone and everything slid down one index.',
            'After the shift the array is rice, oil, salt, sugar, tea. Where does splice(1, 2) start?',
            'It removes oil and salt. What is left, and how many are there?',
          ],
          explanation: 'push adds tea, shift removes and returns soap, leaving rice, oil, salt, sugar, tea. splice(1, 2) then removes oil and salt, leaving rice, sugar, tea: three elements.',
          concept: 'array methods',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-37-fix-bug-1',
          kind: 'fix-bug',
          title: 'Remove the first expense',
          prompt: 'This program should remove the first expense (24) and print [ 15, 120, 8 ]. It removes the wrong one. Tap the buggy line, then choose the fix.',
          language: 'javascript',
          code: `const expenses = [24, 15, 120, 8];
expenses.pop();
console.log(expenses);`,
          bugLine: 2,
          fixes: [
            { line: 'expenses.shift();', correct: true, why: 'shift removes the first element, so 24 goes and the others move down.' },
            { line: 'expenses.unshift();', correct: false, why: 'unshift adds to the start, and with nothing to add it changes nothing.' },
            { line: 'expenses.splice(1, 1);', correct: false, why: 'This removes the element at index 1 (15), not the first one.' },
            { line: 'expenses.slice(1);', correct: false, why: 'slice makes a copy of the rest and leaves expenses unchanged, so 24 would still be printed.' },
          ],
          lineNote: 'The print line is fine. Which line changes the array in the wrong way?',
          tests: { kind: 'output', expected: ['[ 15, 120, 8 ]'] },
          hints: [
            'pop removes from one end. Is it the end you want?',
            'Which method removes the first element of an array?',
            'The method starts with the letters sh.',
          ],
          explanation: 'pop removes the last element (8). To remove the first element you use shift, which also moves the other elements down by one index.',
          concept: 'removing elements',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-37-code-challenge-1',
          kind: 'code-challenge',
          title: 'Add it only once',
          prompt: 'Write addUnique(list, item). It should add item to the end of list only when the list does not already contain it, and then return the list.',
          language: 'javascript',
          starter: `function addUnique(list, item) {
  // add item to the end of list only if it is not already in it
  return list;
}`,
          tests: {
            kind: 'function',
            fn: 'addUnique',
            cases: [
              { label: 'adds a new number', args: [[1, 2], 3], expected: [1, 2, 3] },
              { label: 'ignores a repeat', args: [[1, 2], 2], expected: [1, 2] },
              { label: 'works on an empty list', args: [[], 'tea'], expected: ['tea'] },
              { label: 'ignores a repeated word', args: [['food', 'load'], 'food'], expected: ['food', 'load'], hidden: true },
            ],
          },
          solution: `function addUnique(list, item) {
  if (!list.includes(item)) {
    list.push(item);
  }
  return list;
}`,
          hints: [
            'Which method tells you whether an element is already in the array?',
            'Use if with a not (!) in front of that check, and push inside the if.',
            'Return the list on the last line, after the if.',
          ],
          explanation: 'includes answers whether the item is already there. Only when it is not (!list.includes(item)) do you push it. Returning list at the end gives the same array back, changed or not.',
          concept: 'adding elements',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-37-q1',
        prompt: 'After const a = [1, 2, 3]; a.push(4); a.shift(); what does a hold?',
        choices: ['[1, 2, 3]', '[1, 2, 3, 4]', '[2, 3, 4]', '[2, 3]'],
        answer: 2,
        explanation: 'push adds 4 at the end, giving 1, 2, 3, 4. shift then removes the first element, 1, leaving 2, 3, 4.',
      },
      {
        id: 'programming-fundamentals-37-q2',
        prompt: 'A program needs the last two expenses without changing the original list. Which method fits?',
        choices: ['splice', 'pop', 'shift', 'slice'],
        answer: 3,
        explanation: 'slice returns a new array holding a copy of a piece and leaves the original alone. splice, pop and shift all change the array they are called on.',
      },
      {
        id: 'programming-fundamentals-37-q3',
        prompt: 'What does list.indexOf(\'tea\') give when the list does not contain \'tea\'?',
        choices: ['0', '-1', 'undefined', 'false'],
        answer: 1,
        explanation: 'indexOf answers with -1 when the value is not found, because -1 can never be a real index. includes is the method that gives true or false.',
      },
      {
        id: 'programming-fundamentals-37-q4',
        prompt: 'A list has four elements. After list.splice(1, 1), the element that used to be at index 2 is now at which index?',
        choices: ['2', '3', '0', '1'],
        answer: 3,
        explanation: 'Removing the element at index 1 leaves a gap that the later elements close, so everything after it moves down one place: index 2 becomes index 1.',
      },
      {
        id: 'programming-fundamentals-37-q5',
        audience: { max: 'beginner' },
        prompt: 'In a bakery line, a new customer joins the back and the first customer is served. Which two array methods match those two events?',
        choices: ['push and shift', 'pop and unshift', 'unshift and pop', 'slice and splice'],
        answer: 0,
        explanation: 'Joining at the back is push (add at the end). Serving the first customer is shift (remove from the start). Together they make a queue.',
      },
      {
        id: 'programming-fundamentals-37-q6',
        audience: { min: 'advanced' },
        prompt: 'A helper removeFirst(list) calls list.shift() and returns list. A caller passes its own expenses array and later finds the first expense gone. What explains it?',
        choices: ['shift works on a copy that is later merged back into the original', 'The helper got a reference to the caller\'s own array, so the change is visible', 'const arrays are shared between all the functions in the same file', 'The helper reassigned the caller\'s variable to a shorter array'],
        answer: 1,
        explanation: 'An array is an object, so passing it hands over a reference to the same array. shift mutates it in place. To keep the caller\'s data, copy first (for example with slice) or use a non-mutating method.',
      },
    ],
    task: {
      title: 'Edit a list by hand, then by code',
      minutes: 15,
      steps: [
        'On paper, write the array [\'bread\', \'eggs\', \'milk\', \'rice\']. Under it, write the array again after each of these changes, one at a time: push \'tea\'; shift; splice(1, 1); unshift \'salt\'.',
        'Predict the final array and its length, and what each of shift and splice gave back.',
        'Type the same four changes in any free JavaScript environment, with a console.log after each, and compare with your paper trace. Where did the trace differ, and why?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain which of the four changes moved other elements to new indexes and which did not, then check that against your trace.'] },
      { audience: { min: 'advanced' }, steps: ['Write removeFirst(list) twice: once mutating its argument with shift, once returning a changed copy using slice. Show with a test that only the second leaves the caller\'s array intact.'] },
    ],
  },
  {
    id: 'programming-fundamentals-38',
    day: 38,
    title: 'Iterating Through Collections',
    summary: 'Visit every element of a list with for, for...of and forEach, and build new lists with map and filter.',
    intro: {
      objectives: [
        'Go through every element of an array with a for loop, for...of and forEach',
        'Build a running total, a count and a biggest value with a loop',
        'Use map and filter to make a new array from an old one',
      ],
      why: 'A list is only useful if you can do something with every element: add them up, find the largest, keep the ones that match. AI-written code is full of these loops, and the bugs in them are small and easy to miss.',
    },
    minutes: 27,
    skills: ['data-structures', 'loops'],
    body: [
      {
        type: 'paragraph',
        text: 'You already know how to repeat work with a loop (module 6), and you now know how to keep many values in an array (lessons 36 and 37). Put the two together and you can do the most common job in programming: visit every element of a list and do something with each one. Total them, count the ones that qualify, find the largest, or make a cleaned-up copy. This lesson shows three ways to visit every element, and two methods, `map` and `filter`, that build a new list from an old one. Learning to read these loops is the quickest way to check an AI\'s work on lists.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Think of a cashier at a grocery till. Each item on the belt is scanned once, in order, and a running total on the screen grows after every scan. When the belt is empty, the total is final. A loop over an array is the same: it takes each element in turn, does the same work with it, and keeps a result that builds up.',
      },
      {
        type: 'paragraph',
        text: 'The picture is incomplete in one way. A cashier can skip an item, look ahead or go back. A simple loop over an array does none of that: it visits every element once, front to back, unless you write extra code to stop early (module 6 showed `break`). Also the cashier\'s screen starts at zero by itself; in code, you must set the starting total yourself.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'There are three ways to visit every element. The classic one is a **`for` loop with an index**: a counter `i` starts at 0, the loop runs while `i < list.length`, and inside you read `list[i]`. It gives you the index and the value, and full control. The second is **`for...of`**: `for (const item of list)` hands you each value directly, with no index to manage, so there is less to get wrong. The third is **`forEach`**, a method that takes a small function and calls it once for each element.',
      },
      {
        type: 'paragraph',
        text: 'That small function is called a **callback**: a function you give to another function to call later. It is usually written as an **arrow function**, a short way to write a function that has no name. `(amount) => amount + 5` means "a function that takes `amount` and gives back `amount + 5`". It is the same idea as the functions of module 7, with `=>` instead of the word `function`. When the body is a single expression, the result is returned automatically; with braces `{ }` you write the statements yourself, as in any function.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'What a loop over a list does to make a total. The check happens before every turn, so an empty list adds nothing.',
        source: 'flowchart TD\n  A[Set total to 0] --> B{Is there another element?}\n  B -->|yes| C[Take the next element]\n  C --> D[Add it to total]\n  D --> B\n  B -->|no| E[Use the final total]',
      },
      {
        type: 'paragraph',
        text: 'Two more methods build a **new array** from an old one and never change the old one. **`map`** transforms: it calls your function on every element and collects the results, so the new array has the same length. **`filter`** selects: it calls your function on every element and keeps only those for which the function gives `true`, so the new array can be shorter. They are the same loop pattern, written once so you do not repeat it.',
      },
      {
        type: 'table',
        headers: ['Tool', 'Gives you', 'Best when'],
        rows: [
          ['for (let i = 0; i < list.length; i++)', 'The index and the element', 'You need the position, or to start or stop part-way'],
          ['for (const item of list)', 'Each element', 'You only need the values (the everyday choice)'],
          ['list.forEach((item, index) => { ... })', 'Each element and its index', 'You want to do something for each, with no result to collect'],
          ['list.map((item) => ...)', 'A new array, same length', 'You want a transformed copy'],
          ['list.filter((item) => ...)', 'A new array, only the matches', 'You want to keep some and drop the rest'],
        ],
        caption: 'Five ways to work through a list.',
      },
      {
        type: 'warning',
        text: 'Two classic mistakes. First, `i <= list.length` instead of `i < list.length` runs one turn too many: the last turn reads `list[list.length]`, which is `undefined`, and adding `undefined` to a number gives `NaN`. Second, never add or remove elements of the same array you are looping over: the indexes shift and the loop skips elements. Build a new array with `filter` instead.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: a running total with a `for` loop and an index.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'A total with a for loop',
        code: `const amounts = [24, 15, 120, 8];
let total = 0;
for (let i = 0; i < amounts.length; i++) {
  total += amounts[i];
}
console.log(total); // 167`,
      },
      { type: 'paragraph', text: 'Step 2: the biggest amount, with `for...of`. Start from the first element so the answer is always a real element of the list.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'The biggest with for...of',
        code: `const amounts = [24, 15, 120, 8];
let biggest = amounts[0];
for (const amount of amounts) {
  if (amount > biggest) {
    biggest = amount;
  }
}
console.log(biggest); // 120`,
      },
      { type: 'paragraph', text: 'Step 3: a numbered list with `forEach` and an arrow function.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'forEach with an index',
        code: `const categories = ['food', 'transport', 'load'];
categories.forEach((category, index) => {
  console.log(\`\${index + 1}. \${category}\`);
});
// 1. food
// 2. transport
// 3. load`,
      },
      { type: 'paragraph', text: 'Step 4: `map` and `filter` make new arrays, and the original stays as it was.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'map and filter',
        code: `const amounts = [24, 15, 120, 8];
const withTip = amounts.map((amount) => amount + 5);
console.log(withTip); // [ 29, 20, 125, 13 ]
const bigOnes = amounts.filter((amount) => amount >= 20);
console.log(bigOnes); // [ 24, 120 ]
console.log(amounts); // [ 24, 15, 120, 8 ]`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'paragraph',
        text: 'For any loop that builds a value, write a trace table: one row per turn, with the variables after the turn. Here is Step 1.',
      },
      {
        type: 'table',
        headers: ['Turn', 'i', 'amounts[i]', 'total afterwards'],
        rows: [
          ['start', '-', '-', '0'],
          ['1', '0', '24', '24'],
          ['2', '1', '15', '39'],
          ['3', '2', '120', '159'],
          ['4', '3', '8', '167'],
          ['check', '4', '-', '4 < 4 is false, so the loop ends'],
        ],
        caption: 'The trace of Step 1. The loop runs four times, once per element.',
      },
      {
        type: 'list',
        items: [
          '**Step 1.** `total` starts at 0. Each turn adds `amounts[i]`. The loop stops when `i` reaches 4, the length, so index 4 (which does not exist) is never read.',
          '**Step 2.** `biggest` starts as the first element, 24. Each turn compares the current `amount` with it, and replaces it only when the amount is larger: 24 stays, 15 is smaller, 120 replaces it, 8 is smaller. The last value is 120.',
          '**Step 3.** `forEach` calls the arrow function once per element and passes the element and its index. `index + 1` turns the 0-based index into a human-friendly number.',
          '**Step 4.** `map` adds 5 to each element and collects the results in a new array. `filter` keeps 24 and 120, the only elements for which `amount >= 20` is true. The last line shows `amounts` itself did not change.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a loop over a list means "for each thing on the list, do this". In Step 1 the thing you do is add it to a total that began at zero, like keeping a tally on paper. In Step 2 you hold the biggest number you have seen so far in your hand, and swap it only if the next number is bigger. In Step 3 `forEach` reads each word out loud with a number in front. In Step 4 `map` is like a photocopier that adds 5 to every number on the copy, and `filter` is like highlighting only the numbers that are 20 or more and copying those. The original page is never changed. If a loop confuses you, do the same job with a pencil, one element at a time.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '`for...of` works on any iterable, not only arrays: strings, Sets and Maps (the next lesson) all work with it, and unlike `forEach` it supports `break`, `continue` and `return` from the enclosing function. `forEach` ignores what its callback returns, so use it for side effects, and use `map` when you want the result; `map` used only for its side effects misleads the reader. For turning a list into one value the standard tool is `reduce`, though a plain loop with an accumulator is often easier to read and to debug. Chains such as `filter(...).map(...)` build an intermediate array per step, which is rarely a problem but is worth knowing for very large lists.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Practice tasks, not answers',
        text: 'I am a beginner learning to loop over arrays in JavaScript. Give me three small tasks using this array: `const amounts = [24, 15, 120, 8, 300];`. Make them go from easy (a total) to harder (count the amounts over 100). Give me one task at a time. When I paste my solution, tell me whether it is right and why, and point out any off-by-one mistake. Do not write the solution for me, and do not use reduce.',
      },
      {
        type: 'paragraph',
        text: 'Look at how the AI judges your loop: does it say how many turns it runs and what the variables hold at the end? If you ask an AI to write loops for you, expect clever one-liners with `reduce` or chained methods. They can be correct, but if you cannot trace them they are not yet yours to trust. Ask for the plain `for...of` version, and then test it on an empty array and on a list with one element, where AI-written loops often fail.',
      },
      {
        type: 'takeaways',
        items: [
          'A for loop with an index gives you the position; for...of gives each value directly; forEach calls a callback for each element.',
          'A callback is a function handed to another function. An arrow function, (x) => x + 5, is a short way to write one.',
          'Build results with an accumulator: a variable that starts at a sensible value (0 for a total, the first element for a biggest) and is updated each turn.',
          'map returns a new array of the same length with each element transformed; filter returns a new array with only the elements that pass. Neither changes the original.',
          'Loop while i < list.length, never i <= list.length, and do not add or remove elements of the list you are looping over.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-38-predict-output-1',
          kind: 'predict-output',
          title: 'Count and sum the long rides',
          prompt: 'What does this program print? Trace count and sum turn by turn.',
          language: 'javascript',
          code: `const fares = [12, 15, 20, 8, 25];
let count = 0;
let sum = 0;
for (const fare of fares) {
  if (fare >= 15) {
    count++;
    sum += fare;
  }
}
console.log(count);
console.log(sum);`,
          expected: '3\n60',
          choices: ['3\n60', '2\n45', '5\n80', '3\n80'],
          wrongNotes: {
            '2\n45': 'This treats the test as fare > 15. The test is fare >= 15, so 15 counts too.',
            '5\n80': 'This adds every fare. Only the fares that pass the if (15, 20 and 25) are counted and summed.',
            '3\n80': 'The count is right, but sum is only updated inside the if, so it holds 15 + 20 + 25, not every fare.',
          },
          hints: [
            'Go through the fares one at a time and decide whether each passes fare >= 15.',
            '12 fails, 15 passes, 20 passes, 8 fails, 25 passes.',
            'Count the passes, then add up the fares that passed.',
          ],
          explanation: 'Three fares pass the test: 15, 20 and 25. So count is 3 and sum is 15 + 20 + 25 = 60. The fares 12 and 8 never reach the lines inside the if.',
          concept: 'looping over arrays',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-38-fix-bug-1',
          kind: 'fix-bug',
          title: 'The total that is not a number',
          prompt: 'This program should print the total, 167, but it prints NaN. Tap the buggy line, then choose the fix.',
          language: 'javascript',
          code: `const amounts = [24, 15, 120, 8];
let total = 0;
for (let i = 0; i <= amounts.length; i++) {
  total += amounts[i];
}
console.log(total);`,
          bugLine: 3,
          fixes: [
            { line: 'for (let i = 0; i < amounts.length; i++) {', correct: true, why: 'The loop now runs for i = 0, 1, 2 and 3 and stops before the missing index 4.' },
            { line: 'for (let i = 1; i < amounts.length; i++) {', correct: false, why: 'Starting at 1 stops the NaN but skips the first amount, so the total is 143.' },
            { line: 'for (let i = 0; i < amounts.length - 1; i++) {', correct: false, why: 'This stops one turn too early and leaves out the last amount, so the total is 159.' },
            { line: 'for (let i = 0; i < amounts; i++) {', correct: false, why: 'amounts is the whole array, not its length, so the loop condition is never true and the total stays 0.' },
          ],
          lineNote: 'The body is fine. Look at how many turns the loop takes.',
          tests: { kind: 'output', expected: ['167'] },
          hints: [
            'On the last turn i is 4. What does amounts[4] give, and what is 143 + undefined?',
            'The loop condition lets i reach the length, which is one past the last index.',
            'Change <= to <.',
          ],
          explanation: 'With i <= amounts.length the loop makes a fifth turn with i = 4, reads the missing amounts[4] (undefined), and a number plus undefined is NaN. Using < stops after index 3.',
          concept: 'off-by-one errors',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-38-code-challenge-1',
          kind: 'code-challenge',
          title: 'Find the biggest',
          prompt: 'Write biggest(list), which returns the largest number in a list that has at least one element. It must also work when every number is negative.',
          language: 'javascript',
          starter: `function biggest(list) {
  // return the largest number in the list
  return 0;
}`,
          tests: {
            kind: 'function',
            fn: 'biggest',
            cases: [
              { label: 'a mix of amounts', args: [[24, 15, 120, 8]], expected: 120 },
              { label: 'one element', args: [[5]], expected: 5 },
              { label: 'all negative', args: [[-3, -1, -8]], expected: -1 },
              { label: 'the biggest comes first', args: [[90, 20, 40]], expected: 90, hidden: true },
            ],
          },
          solution: `function biggest(list) {
  let best = list[0];
  for (const value of list) {
    if (value > best) {
      best = value;
    }
  }
  return best;
}`,
          hints: [
            'Keep a variable for the biggest value seen so far, and update it inside the loop.',
            'Start that variable from the first element of the list, not from 0, so negative lists work.',
            'Loop with for...of, use if (value > best) to replace it, and return it after the loop.',
          ],
          explanation: 'Starting from list[0] makes the answer a real element of the list, so a list of negative numbers does not wrongly return 0. Each turn replaces best only when a larger value appears.',
          concept: 'accumulator pattern',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-38-q1',
        prompt: 'How many times does for (let i = 0; i < list.length; i++) { ... } run its body when list has six elements?',
        choices: ['Five times', 'Seven times', 'Six times', 'Zero times'],
        answer: 2,
        explanation: 'i takes the values 0, 1, 2, 3, 4 and 5, one turn each, and the loop stops when i is 6, which is not less than 6.',
      },
      {
        id: 'programming-fundamentals-38-q2',
        prompt: 'You only need each amount\'s value, not its position, to add them up. Which loop line is the simplest?',
        choices: ['for (let i = 0; i <= amounts.length; i++)', 'for (const amount of amounts)', 'for (const amount in amounts.length)', 'amounts.map(total)'],
        answer: 1,
        explanation: 'for...of gives each value directly, so there is no index to start, limit or step. The first choice has the off-by-one mistake, and the others do not loop over the elements.',
      },
      {
        id: 'programming-fundamentals-38-q3',
        prompt: 'After const prices = [10, 20, 30]; const cheaper = prices.filter((p) => p < 25); what do prices and cheaper hold?',
        choices: ['prices is [10, 20], cheaper is [10, 20]', 'prices is [10, 20, 30], cheaper is [10, 20]', 'prices is [10, 20, 30], cheaper is [30]', 'prices is [], and cheaper is [10, 20]'],
        answer: 1,
        explanation: 'filter returns a new array holding the elements that passed (10 and 20) and leaves the original array untouched.',
      },
      {
        id: 'programming-fundamentals-38-q4',
        prompt: 'A loop finds the biggest expense but starts with let biggest = 0. For which list does it give a wrong answer?',
        choices: ['[5, 9, 2]', '[0, 1]', '[300]', '[-4, -2, -9]'],
        answer: 3,
        explanation: 'No element of an all-negative list is greater than 0, so biggest never changes and the loop returns 0, a value that is not in the list. Starting from the first element fixes this.',
      },
      {
        id: 'programming-fundamentals-38-q5',
        audience: { max: 'beginner' },
        prompt: 'To add up every expense in a list you need a loop and one more thing. What is it?',
        choices: ['A variable that starts at 0 and grows', 'A second list to hold the answers', 'A different loop written for each expense', 'A built-in function called total that JavaScript provides'],
        answer: 0,
        explanation: 'The running total lives in a variable that starts at 0, like the screen at a till. Each turn of the loop adds one amount to it.',
      },
      {
        id: 'programming-fundamentals-38-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate deletes every expense over 1000 with list.forEach((x, i) => { if (x > 1000) list.splice(i, 1); }). Some expenses over 1000 remain. Why, and what is the better fix?',
        choices: ['forEach cannot read numbers, so convert them to strings with a for loop first', 'splice returns a copy, so nothing is ever deleted from the real list; use pop instead', 'Each splice shifts later elements down, so the loop skips the one that moved; use filter', 'forEach stops at the first match it finds, so use find to get all of them'],
        answer: 2,
        explanation: 'Removing during iteration renumbers the elements after the removal, and the loop\'s next index skips the one that slid into the gap. list.filter((x) => x <= 1000) builds the wanted list without touching the one being walked.',
      },
    ],
    task: {
      title: 'Total, biggest and count for your own list',
      minutes: 15,
      steps: [
        'Write an array of at least six real or invented amounts in pesos, for example last week\'s snacks and fares.',
        'In any free JavaScript environment, write three small loops on it: one that totals the amounts, one that finds the biggest, and one that counts how many are 50 or more. Print each result.',
        'Add a trace table on paper for the total loop, with one row per turn, and check that the last row matches what the program printed. Then run all three loops on an empty array [] and write down what each prints.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to rewrite your total loop with forEach, then explain how the two versions differ. Check that it prints the same total.'] },
      { audience: { min: 'advanced' }, steps: ['Rewrite the biggest loop with reduce, and with Math.max and spread. Compare readability, behaviour on an empty array and behaviour on a very large array.'] },
    ],
  },
  {
    id: 'programming-fundamentals-39',
    day: 39,
    title: 'Objects and Key-Value Pairs',
    summary: 'Store the facts about one thing under names, read them by name, and see how a list of objects forms the expense tracker\'s data.',
    intro: {
      objectives: [
        'Create an object and read, add, change and delete its properties',
        'Choose between dot and bracket access, and explain what a missing key gives',
        'Loop over an object\'s keys and read an array of objects such as a list of expenses',
      ],
      why: 'A real expense is not one value but a description, an amount, a category and a date together. Objects are how code keeps those facts together under names, and nearly all data an AI-built app handles has this shape.',
    },
    minutes: 28,
    skills: ['data-structures'],
    body: [
      {
        type: 'paragraph',
        text: 'An array finds things by position: "the element at index 2". That is fine for a list of amounts, but it is a poor way to describe one expense. If an expense is stored as `[\'Jeepney fare\', 24, \'transport\']`, you must remember that index 1 is the amount, and nothing in the data says so. An **object** solves this by storing each fact under a name: a description, an amount, a category. You ask for the fact by its name, and the code explains itself. Objects are the second great data structure, and a list of objects is the shape of almost every app\'s data.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Picture a paper receipt or a form with labelled lines. "Description: Jeepney fare. Amount: 24. Category: transport." You do not say "give me the second line"; you say "what is the amount?" and read the value next to that label. An object is a set of **labels with values**, and each label-and-value pair is called a **property** (or key-value pair): the label is the **key** and what it points to is the **value**.',
      },
      {
        type: 'paragraph',
        text: 'The picture is a little too tidy. A paper form has fixed lines, while an object can gain a new key or lose one whenever the program runs. And a form is read top to bottom, but the meaning of an object does not depend on the order of its keys, so ask for a property by name, never by position.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'An object is written with curly braces, with each key, a colon and its value, separated by commas: `{ amount: 24, category: \'transport\' }`. Keys are text (you can leave the quotes off when the key is a plain word). A value can be anything: a number, text, a boolean, an array or another object.',
      },
      {
        type: 'paragraph',
        text: 'There are two ways to read a value. **Dot access**, `expense.amount`, uses the key\'s name as you type it. **Bracket access**, `expense[\'amount\']`, takes the key as a piece of text, so it works when the key is kept in a variable (`expense[field]`) or contains a space. The usual choice is the dot; use brackets when the key is not known until the program runs. A key that does not exist gives `undefined`, the same quiet answer as an index that is out of range.',
      },
      {
        type: 'paragraph',
        text: 'Objects change in place like arrays. Assigning to a key sets its value, whether or not the key already existed: `expense.amount = 26` changes it, `expense.paidWith = \'cash\'` adds a new property. `delete expense.date` removes one. To ask whether a key exists, write `\'date\' in expense`, which gives `true` or `false`. To go through all of an object\'s keys, use `for (const key in object)` (the `in` loop is for objects; use `for...of` for arrays), or ask for `Object.keys(object)`, `Object.values(object)`, which give arrays of the keys or of the values.',
      },
      {
        type: 'table',
        headers: ['You want to...', 'Write', 'Notes'],
        rows: [
          ['Read a value', 'expense.amount or expense[field]', 'A missing key gives undefined'],
          ['Set or add a value', 'expense.amount = 26', 'Adds the key when it is new'],
          ['Remove a property', 'delete expense.date', 'The key is gone, not just empty'],
          ['Test whether a key exists', "'date' in expense", 'true or false'],
          ['Get every key or value', 'Object.keys(expense), Object.values(expense)', 'Each is an array'],
          ['Count the properties', 'Object.keys(expense).length', 'There is no .length on an object itself'],
        ],
        caption: 'Everything you do to an object, in one table.',
      },
      {
        type: 'paragraph',
        text: 'Put the two structures together and you get the shape you will use for the rest of the course: **an array of objects**, such as a list of expenses where each element is one expense. The array gives you the list and the loop; each object gives you named facts. `expenses[1].amount` reads the amount of the second expense.',
      },
      {
        type: 'warning',
        text: 'Reading a key that is missing gives `undefined`, but reading a key of `undefined` itself stops the program. `expenses[5].amount`, when only three expenses exist, fails with a TypeError such as "Cannot read properties of undefined". When you see that message, some earlier value you assumed was an object was not.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: make an expense and read from it, by dot, by bracket, and through a variable.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Create an object and read it',
        code: `const expense = { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' };
console.log(expense.description); // Jeepney fare
console.log(expense['amount']); // 24
const field = 'category';
console.log(expense[field]); // transport
console.log(expense.tip); // undefined`,
      },
      { type: 'paragraph', text: 'Step 2: change it, add to it and remove from it.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Update, add, delete and check',
        code: `const expense = { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' };
expense.amount = 26;
expense.paidWith = 'cash';
delete expense.date;
console.log(expense);
// {
//   description: 'Jeepney fare',
//   amount: 26,
//   category: 'transport',
//   paidWith: 'cash'
// }
console.log('date' in expense); // false
console.log('paidWith' in expense); // true`,
      },
      { type: 'paragraph', text: 'Step 3: go through the keys. A price list is a good fit for an object.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Looping over keys',
        code: `const prices = { rice: 58, egg: 9, soap: 24 };
for (const item in prices) {
  console.log(\`\${item}: \${prices[item]}\`);
}
console.log(Object.keys(prices)); // [ 'rice', 'egg', 'soap' ]
console.log(Object.values(prices)); // [ 58, 9, 24 ]
console.log(Object.keys(prices).length); // 3`,
      },
      { type: 'paragraph', text: 'Step 4: count how many times each category appears, using the category as the key.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'An object as a counter',
        code: `const categories = ['food', 'load', 'food', 'transport', 'food'];
const counts = {};
for (const category of categories) {
  if (category in counts) {
    counts[category] += 1;
  } else {
    counts[category] = 1;
  }
}
console.log(counts); // { food: 3, load: 1, transport: 1 }`,
      },
      { type: 'paragraph', text: 'Step 5: an array of objects, which is the expense list.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'A list of expenses',
        code: `const expenses = [
  { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' },
  { description: 'Lunch', amount: 85, category: 'food', date: '2026-11-16' },
  { description: 'Load top-up', amount: 50, category: 'load', date: '2026-11-17' },
];
let total = 0;
for (const expense of expenses) {
  total += expense.amount;
}
console.log(total); // 159
console.log(expenses[1].description); // Lunch`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** Dot and bracket access give the same result for a plain key: `expense.amount` and `expense[\'amount\']` are both 24. `expense[field]` looks up the text stored in `field`, here `category`. `expense.tip` has no such key, so the answer is `undefined`.',
          '**Step 2.** The amount is overwritten with 26. `paidWith` is a new key, so it is added at the end. `delete` removes `date` completely, so `\'date\' in expense` is `false`. The printed object shows four properties, broken over several lines because it is long.',
          '**Step 3.** `for...in` gives each key as text in turn (`rice`, `egg`, `soap`), and `prices[item]` reads the value for that key. `Object.keys` and `Object.values` give arrays, so `.length` on the keys array counts the properties.',
          '**Step 4.** `counts` starts empty. For each category the loop asks whether the key already exists: if so it adds 1 to its count, if not it creates it with the value 1. After five turns, `food` is 3.',
          '**Step 5.** `expenses` is an array, so `for...of` visits each element, and each element is an object, so `expense.amount` reads one of its facts: 24 + 85 + 50 is 159. `expenses[1]` is the second object and `.description` reads its text.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: an object is a labelled box with compartments, and the label on each compartment is the key. To get the amount you ask for the compartment labelled "amount" with a dot: `expense.amount`. You use square brackets when the label you want is written on a sticky note (a variable) rather than typed directly. If you ask for a label that is not there, you simply get "nothing" (`undefined`). In Step 4 the counter object starts as an empty box. Every time the loop meets a category, it either makes a new compartment for it with a tally of 1, or adds 1 to the tally already there. In Step 5 you have a row of receipts, and the loop reads the amount from each one.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'A plain object is a good record but a risky dictionary. Every object inherits keys such as `constructor` and `toString`, so a counter built on `{}` and keyed by user text breaks on the word "constructor" (`\'constructor\' in counts` is already true), and `for...in` also walks inherited enumerable properties. Prefer `Object.hasOwn(obj, key)` for an own-key test, `Object.create(null)` for a bare dictionary, or a `Map` (the next lesson) when keys come from outside. Note also that property order is insertion order for text keys, except that integer-like keys such as "2" come first in ascending order, so do not rely on order for meaning. In an API response or a database row, an array of objects is the usual shape, which is why this is also how JSON is organised.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Review my model of an expense',
        text: 'I am learning JavaScript objects. Here is how I would store one expense: `{ description: \'Lunch\', amount: 85, category: \'food\', date: \'2026-11-16\' }`. Ask me three questions, one at a time, about reading it, changing it and handling a missing key, and wait for my answers. Then suggest two fields a real expense tracker might add and tell me what could go wrong if I stored the amount as text instead of a number. Do not write a full program for me.',
      },
      {
        type: 'paragraph',
        text: 'Check three things in the answer. It should use dot or bracket access correctly and say a missing key gives `undefined`. It should explain a possible problem with text amounts (for example, adding two text amounts joins them instead of summing them, as you saw in module 4). And whatever it proposes, run the code: assistants sometimes use the wrong access style, for example `expense.field` when they mean `expense[field]`, which silently reads the key literally named "field".',
      },
      {
        type: 'takeaways',
        items: [
          'An object stores facts under names: key-value pairs inside curly braces. Read them by name, not by position.',
          'Use expense.amount when you type the key, and expense[field] when the key is in a variable. A missing key gives undefined.',
          'Assigning sets or adds a property, delete removes it, and \'key\' in object tells you whether it exists.',
          'for (const key in object) and Object.keys / Object.values go through an object\'s contents.',
          'An array of objects is the standard shape for a list of records, such as expenses.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-39-predict-output-1',
          kind: 'predict-output',
          title: 'Rice goes on sale',
          prompt: 'Follow each change to the item. What does the program print?',
          language: 'javascript',
          code: `const item = { name: 'Rice', price: 58, stock: 10 };
item.stock = item.stock - 3;
item.unit = 'kg';
delete item.price;
console.log(item.stock);
console.log(item.price);
console.log(Object.keys(item).length);`,
          expected: '7\nundefined\n3',
          choices: ['7\nundefined\n3', '10\n58\n3', '7\nundefined\n4', '7\n58\n3'],
          wrongNotes: {
            '10\n58\n3': 'Both reads happen after the changes. The first line changes stock to 7, and delete removes price.',
            '7\nundefined\n4': 'Count again after the changes: delete removed price and unit was added, so there are three keys (name, stock, unit).',
            '7\n58\n3': 'delete removes the key completely. Reading price afterwards gives undefined, not the old value.',
          },
          hints: [
            'Write the object after each of the three changes.',
            'After the changes it holds name, stock (now 7) and unit.',
            'price was deleted, so reading it gives undefined. Count the remaining keys.',
          ],
          explanation: 'stock becomes 10 - 3 = 7, unit is added, and price is deleted. The object is { name, stock: 7, unit }, so the program prints 7, undefined and 3.',
          concept: 'object properties',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-39-fix-bug-1',
          kind: 'fix-bug',
          title: 'The price that is never found',
          prompt: 'This program should print the price of the item stored in wanted, which is 9, but it prints undefined. Tap the buggy line, then choose the fix.',
          language: 'javascript',
          code: `const prices = { rice: 58, egg: 9, soap: 24 };
const wanted = 'egg';
console.log(prices.wanted);`,
          bugLine: 3,
          fixes: [
            { line: 'console.log(prices[wanted]);', correct: true, why: 'Brackets use the value stored in wanted, which is the text egg, so this reads prices.egg.' },
            { line: "console.log(prices['wanted']);", correct: false, why: 'This looks for a key literally named wanted, which does not exist, so it is still undefined.' },
            { line: 'console.log(prices[egg]);', correct: false, why: 'Without quotes, egg is read as a variable name, and no variable called egg exists, so the program stops with an error.' },
            { line: 'console.log(prices(wanted));', correct: false, why: 'Round brackets call a function, and prices is an object, so the program stops with an error.' },
          ],
          lineNote: 'The first two lines are fine. Which line reads the price?',
          tests: { kind: 'output', expected: ['9'] },
          hints: [
            'prices.wanted looks for a key whose name is the letters w-a-n-t-e-d.',
            'You want the key whose name is stored inside the variable wanted.',
            'Use square brackets with the variable inside them, without quotes.',
          ],
          explanation: 'Dot access always uses the key exactly as typed. To use a key held in a variable you need bracket access, prices[wanted], which looks up the variable\'s value (egg).',
          concept: 'dot and bracket access',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-39-code-challenge-1',
          kind: 'code-challenge',
          title: 'Count by category',
          prompt: 'Write countCategories(categories). It takes a list of category names and returns an object whose keys are the categories and whose values are how many times each appears.',
          language: 'javascript',
          starter: `function countCategories(categories) {
  const counts = {};
  // count how many times each category appears
  return counts;
}`,
          tests: {
            kind: 'function',
            fn: 'countCategories',
            cases: [
              { label: 'repeats', args: [['food', 'load', 'food']], expected: { food: 2, load: 1 } },
              { label: 'one category', args: [['transport']], expected: { transport: 1 } },
              { label: 'empty list', args: [[]], expected: {} },
              { label: 'three kinds', args: [['a', 'b', 'a', 'c', 'a', 'b']], expected: { a: 3, b: 2, c: 1 }, hidden: true },
            ],
          },
          solution: `function countCategories(categories) {
  const counts = {};
  for (const category of categories) {
    if (category in counts) {
      counts[category] += 1;
    } else {
      counts[category] = 1;
    }
  }
  return counts;
}`,
          hints: [
            'Loop over the categories. For each one, decide whether it is already a key of counts.',
            'If it is a key, add 1 to counts[category]. If not, create it with the value 1.',
            'Use the bracket form counts[category], because the key is stored in a variable.',
          ],
          explanation: 'The category itself is the key, so bracket access is needed. A new category starts at 1, and a category seen before has 1 added to its tally. Starting from an empty object means an empty list returns {}.',
          concept: 'objects as counters',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-39-q1',
        prompt: 'The variable field holds the text \'amount\'. Which expression reads that property of expense?',
        choices: ['expense.field', 'expense[field]', 'expense(field)', 'expense[\'field\']'],
        answer: 1,
        explanation: 'Square brackets with the variable inside use the variable\'s value as the key. expense.field and expense[\'field\'] both look for a key literally called field.',
      },
      {
        id: 'programming-fundamentals-39-q2',
        prompt: 'An expense object has no key called tip. What does expense.tip give?',
        choices: ['0', 'An error that stops the program', 'null', 'undefined'],
        answer: 3,
        explanation: 'Reading a missing key gives undefined, just as reading a missing array index does. (null is a value a programmer sets on purpose; JavaScript itself does not produce it here.)',
      },
      {
        id: 'programming-fundamentals-39-q3',
        prompt: 'You need to keep one expense\'s description, amount and category so each can be read by name. Which structure fits best?',
        choices: ['Three separate arrays', 'One long text string', 'An object with three properties', 'An array of three values in a fixed order'],
        answer: 2,
        explanation: 'An object names each fact, so the code says what it means. An array of three values would depend on remembering which index is which.',
      },
      {
        id: 'programming-fundamentals-39-q4',
        prompt: 'After const o = { a: 1 }; o.b = 2; delete o.a; what does Object.keys(o) give?',
        choices: ['[\'a\', \'b\']', '[\'a\']', '[]', '[\'b\']'],
        answer: 3,
        explanation: 'o.b = 2 adds the key b, and delete o.a removes the key a, so only b is left.',
      },
      {
        id: 'programming-fundamentals-39-q5',
        audience: { max: 'beginner' },
        prompt: 'In the object { price: 58 }, what is the word price?',
        choices: ['The key, the name that the value is stored under', 'The value that the property holds', 'The length of the object, as a number', 'A variable that is holding the number 58'],
        answer: 0,
        explanation: 'Each property is a key and a value. price is the key (the label) and 58 is the value.',
      },
      {
        id: 'programming-fundamentals-39-q6',
        audience: { min: 'advanced' },
        prompt: 'A counter is built as const counts = {} and keyed by words typed by users. Why can the word "constructor" break it?',
        choices: ['Object keys cannot be longer than ten characters in JavaScript', 'Every object inherits a constructor property, so the test finds a key never counted', 'for...in cannot read keys that start with a letter of the alphabet', 'JavaScript reserves the word and throws an error when it is used as a key'],
        answer: 1,
        explanation: 'Plain objects inherit properties such as constructor, so \'constructor\' in counts is already true and the code adds 1 to a function. A Map, Object.create(null) or Object.hasOwn avoids it.',
      },
    ],
    task: {
      title: 'Model your own expense list',
      minutes: 15,
      steps: [
        'On paper or in a free JavaScript environment, write an array of four expense objects with description, amount, category and date, using real or invented spending.',
        'Write code that prints the total, and then prints each expense on one line, like "Lunch: 85".',
        'Add a fifth expense by pushing a new object, change the amount of the first one, and delete its date key. Print the list again and say what changed.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain, one line at a time, how your total loop reads amount from each expense, and to point out what would happen if one expense had no amount key.'] },
      { audience: { min: 'advanced' }, steps: ['Write countCategories twice: with a plain object guarded by Object.hasOwn, and with a Map. Test both with the words "constructor" and "toString" and compare.'] },
    ],
  },
  {
    id: 'programming-fundamentals-40',
    day: 40,
    title: 'Sets, Maps and Choosing the Right Data Structure',
    summary: 'Meet Set and Map, and learn to pick between array, object, Set and Map by asking what the problem needs.',
    intro: {
      objectives: [
        'Use a Set to keep unique values and a Map to look values up by key',
        'Choose between an array, an object, a Set and a Map for a given problem',
        'Explain in words why a lookup by key beats scanning a list one item at a time',
      ],
      why: 'Much of the work of an AI assistant is choosing a shape for your data. If you can say why a list, a record, a set or a map fits, you can judge its choice, and ask for a better one when it is wrong.',
    },
    minutes: 28,
    skills: ['data-structures'],
    body: [
      {
        type: 'paragraph',
        text: 'You now have two ways to keep many values: the array, which is an ordered list found by position, and the object, which is a set of facts found by name. JavaScript has two more that solve problems those two handle awkwardly. A **Set** keeps each value only once. A **Map** looks values up by a key of any kind. This lesson introduces both, then gives you the skill that matters most in this module: choosing the right structure by asking what the problem needs. When an AI assistant picks a structure for your app, that question is how you check its choice.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Think of a raffle. The **drum of tickets** is a Set: a ticket is either in it or not, and the same ticket number can never be in twice. A **phone book** is a Map: you do not read it from the start, you look up a name (the key) and go straight to a number (the value). The **line of people** waiting to buy a ticket is an array: order matters and the same person may appear twice. Each tool fits a different question.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops: a real phone book is sorted so you can find names quickly by flipping pages, while a Map is not sorted at all. It remembers the order in which you added entries, and finds a key by a different method that does not depend on order.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'A **Set** is made with `new Set()`. You `add` a value, ask `has` whether it is there, `delete` it, and read `size` for how many it holds. Adding a value that is already inside changes nothing, which is what makes a Set useful for "each only once". A Set also remembers the order the values were added in. To turn an array into its distinct values, wrap it in a Set and turn that back into an array with `Array.from`.',
      },
      {
        type: 'paragraph',
        text: 'A **Map** is made with `new Map()`. You store a pair with `set(key, value)`, read it back with `get(key)` (which gives `undefined` for a missing key), and also have `has`, `delete` and `size`. Unlike an object, a Map\'s keys can be any kind of value, not just text, and it has no inherited keys that could clash with yours. To go through a Map, write `for (const [key, value] of map)`: the square brackets on the left unpack each pair into two names.',
      },
      {
        type: 'warning',
        text: 'A Map is not an object. Writing `stock[\'rice\'] = 20` on a Map does not store anything in it: it just attaches an ordinary property to the Map, and `stock.get(\'rice\')` still answers `undefined`. Always use `set` and `get`.',
      },
      {
        type: 'paragraph',
        text: 'Now the choice. Ask what the problem needs. Does **order** matter? Must each value be **unique**? Do you **look things up by a name**? Is it a **record** of facts about one thing? The diagram turns those questions into a choice.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Choosing a structure by asking what the problem needs.',
        source: 'flowchart TD\n  A[What are you storing?] --> B{Facts about one thing?}\n  B -->|yes| C[An object]\n  B -->|no| D{Look values up by a key?}\n  D -->|yes| E[A Map, or an object for simple text keys]\n  D -->|no| F{Each value only once?}\n  F -->|yes| G[A Set]\n  F -->|no| H[An array, in order]',
      },
      {
        type: 'table',
        headers: ['Structure', 'Use it when', 'Example in a shop or tracker'],
        rows: [
          ['Array', 'Order matters, repeats are fine, you go through everything', 'Every fare you paid, in order'],
          ['Object', 'One thing with fixed, named facts', 'One receipt: description, amount, date'],
          ['Array of objects', 'A list of records', 'All the expenses of the month'],
          ['Set', 'Each value only once, and "have I seen this?"', 'The categories used so far'],
          ['Map', 'Lookup by key, keys of any kind, entries added and removed often, a count per key', 'Stock quantity by product name'],
        ],
        caption: 'The five shapes you now know. Most real data is an array of objects, sometimes with a Map beside it for fast lookup.',
      },
      {
        type: 'paragraph',
        text: 'A last reason to choose well is speed, and here is a first look at it with no formulas. To find one expense by description in an array of objects, you can use **`find`**: it checks the elements from the start and gives back the first one that passes your test (or `undefined`). That is a scan, so a list ten times longer can take ten times as many checks. A Map or a Set jumps to the entry from its key, and the language rules require that, on average, finding an entry takes less work than checking every item once the collection is large. Computer scientists call the growth rate of work "Big O"; you do not need more than the idea yet: **lookup by key stays quick when the data grows, scanning does not**.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: a Set keeps each category once.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'A Set of unique values',
        code: `const seen = new Set();
seen.add('food');
seen.add('load');
seen.add('food');
console.log(seen); // Set(2) { 'food', 'load' }
console.log(seen.size); // 2
console.log(seen.has('load')); // true
seen.delete('load');
console.log(seen.has('load')); // false
const unique = Array.from(new Set(['food', 'load', 'food', 'transport', 'load']));
console.log(unique); // [ 'food', 'load', 'transport' ]`,
      },
      { type: 'paragraph', text: 'Step 2: a Map holds the stock of each product.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'A Map of stock',
        code: `const stock = new Map();
stock.set('rice', 20);
stock.set('egg', 60);
stock.set('soap', 5);
stock.set('egg', 54);
console.log(stock.get('egg')); // 54
console.log(stock.get('oil')); // undefined
console.log(stock.has('soap')); // true
console.log(stock.size); // 3
stock.delete('soap');
for (const [item, quantity] of stock) {
  console.log(\`\${item}: \${quantity}\`);
}
// rice: 20
// egg: 54
console.log(stock); // Map(2) { 'rice' => 20, 'egg' => 54 }`,
      },
      { type: 'paragraph', text: 'Step 3: an array of objects, searched with `find` and reshaped with `filter` and `map`.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Searching a list of expenses',
        code: `const expenses = [
  { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' },
  { description: 'Lunch', amount: 85, category: 'food', date: '2026-11-16' },
  { description: 'Load top-up', amount: 50, category: 'load', date: '2026-11-17' },
];
const lunch = expenses.find((expense) => expense.description === 'Lunch');
console.log(lunch.amount); // 85
console.log(expenses.find((expense) => expense.description === 'Taxi')); // undefined
const foodOnly = expenses.filter((expense) => expense.category === 'food');
console.log(foodOnly.length); // 1
const names = expenses.map((expense) => expense.description);
console.log(names); // [ 'Jeepney fare', 'Lunch', 'Load top-up' ]`,
      },
      { type: 'paragraph', text: 'Step 4: count the work a scan does, and compare it with a Set lookup.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Counting the steps of a scan',
        code: `const ids = [];
for (let i = 0; i < 1000; i++) {
  ids.push(i);
}
let steps = 0;
for (const id of ids) {
  steps++;
  if (id === 999) {
    break;
  }
}
console.log(steps); // 1000
const idSet = new Set(ids);
console.log(idSet.has(999)); // true, with no walk through the list`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** The second `add(\'food\')` does nothing because `food` is already inside, so the Set has two values. `has` answers `true` or `false`. `delete` removes `load`. Wrapping a list with repeats in a Set drops the repeats, and `Array.from` turns it back into an array, in the order each value first appeared.',
          '**Step 2.** `set(\'egg\', 54)` the second time replaces the first egg entry; it does not add a second one, so the size is 3, not 4. `get(\'oil\')` is `undefined` because no such key was stored. The loop unpacks each pair into `item` and `quantity`, in the order they were added, and `soap` is gone.',
          '**Step 3.** `find` goes through the expenses and stops at the first whose description is `Lunch`, so `lunch` is that whole object and `.amount` is 85. Nothing is called `Taxi`, so the answer is `undefined`. `filter` keeps the one food expense, and `map` collects just the descriptions.',
          '**Step 4.** The scan has to look at every id until it reaches 999, so `steps` ends at 1000. Had there been a million ids, the scan could take a million steps, while `idSet.has(999)` goes directly to the answer.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a Set is a basket that refuses to hold two of the same thing. You can ask "is this in the basket?" and add or take things out. A Map is a labelled shelf: you put something on the shelf under a label (`set`), and later ask for it by the label (`get`). Putting something under a label that is already used replaces what was there. In Step 2 the shop\'s stock is a shelf with a label for each product and the number in stock written on the item. In Step 4 the scan is like reading a long list line by line to find one number, while the Set is like opening a drawer that has the number on the front. Picking the right container is about which question you will ask most often.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Choose by access pattern. Map keys can be any value, so `1` and `"1"` are different keys, while an object coerces both to the text "1". Map and Set iterate in insertion order, a Map has a real `size` and no inherited keys, and both are built for frequent additions and removals. Keys compare by identity for objects, and by the SameValueZero rule for other values, so two equal-looking objects are different keys. Plain objects stay the right choice for fixed records, and they are what JSON describes. For repeated lookups in an array of records, build a Map or an object index once instead of calling `find` in a loop, which turns many scans into one pass; and remember a Map does not serialise to JSON on its own.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Choose the structure with me',
        text: 'I am learning data structures in JavaScript: array, object, Set and Map. Give me three small situations from a shop or an expense tracker. For each, ask me which structure I would pick and why, one at a time, and wait for my answer. If I am wrong, explain what the problem needs that my choice does not give. If I am right, ask me what could go wrong with the other choices. Do not tell me the answer first.',
      },
      {
        type: 'paragraph',
        text: 'Good answers tie each choice to a need: order, uniqueness, lookup by key, a record of facts. Be careful if the AI says "always use a Map" or "an array is always fine": both are shortcuts that hide the real question. Also watch for a Set described as sorted (it keeps insertion order, not sorted order) and for code that writes `map[key] = value` on a Map. Test each snippet before you accept the explanation.',
      },
      {
        type: 'takeaways',
        items: [
          'A Set holds each value once: add, has, delete and size. Wrap an array in a Set to remove repeats.',
          'A Map looks values up by a key of any kind: set, get, has, delete and size. Use set and get, never map[key] = value.',
          'Choose by need: order (array), a record of named facts (object), uniqueness (Set), lookup by key (Map), and a list of records (array of objects).',
          'find, filter and map work on an array of objects such as the expense list.',
          'Lookup by key stays quick as data grows, while scanning a list takes longer the more items it has.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-40-scenario-1',
          kind: 'scenario',
          title: 'The barangay event sign-up',
          prompt: 'Pick the structure that best fits this need.',
          situation: 'A barangay event has a sign-up list. Before adding a name you must check quickly whether that person already signed up, and no name may ever appear twice. The list can grow to thousands of names.',
          options: [
            { text: 'A Set of names: add each name, and use has to check', consequence: 'Duplicates are impossible by design, has is quick even as the list grows, and the code says what it means.', quality: 'best' },
            { text: 'An array of names, checking includes before each push', consequence: 'It works, because includes checks the list before every push, but each check scans the whole list and you must remember it every time you add.', quality: 'acceptable' },
            { text: 'An array of names where you just push every sign-up', consequence: 'The same person can now be on the list several times, and nothing warns you.', quality: 'poor' },
            { text: 'A separate variable for each person: person1, person2, person3...', consequence: 'You cannot loop over them or add more without editing the program, and checking for a repeat means comparing every variable by hand.', quality: 'poor' },
          ],
          hints: [
            'What must never happen? What question do you ask most often?',
            'The need is "each name only once" plus a quick "is it already here?".',
            'One structure was designed for exactly that pair of needs.',
          ],
          explanation: 'Uniqueness and a quick membership check are the Set\'s two jobs. An array can imitate it with includes, but you have to guard every add by hand, and each check scans the list.',
          concept: 'choosing a data structure',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-40-match-1',
          kind: 'match',
          title: 'Which structure fits?',
          prompt: 'Match each situation to the structure that fits it best.',
          labels: { terms: 'Situation', meanings: 'Best structure' },
          pairs: [
            { term: 'Customers waiting, served in the order they arrived', definition: 'An array', note: 'Order matters here, and the same name could appear twice.' },
            { term: 'Raffle ticket numbers already drawn, never drawn twice', definition: 'A Set', note: 'The need is "each value once" and a quick check.' },
            { term: 'A phone book: find a number from a person\'s name', definition: 'A Map', note: 'The need is lookup by a key.' },
            { term: 'One student\'s name, section and average', definition: 'An object', note: 'This is a record of named facts about one thing.' },
            { term: 'Every student of a class, each with name, section and average', definition: 'An array of objects', note: 'This is a list of records.' },
          ],
          hints: [
            'For each situation, ask: does order matter, must values be unique, do I look up by a key, or is it a record?',
            'Two of them are records: one record, and a list of them.',
            'The phone book is the lookup-by-key case.',
          ],
          explanation: 'Each situation shows a different need: order (array), uniqueness (Set), lookup by key (Map), a record of facts (object), and a list of records (array of objects).',
          concept: 'choosing a data structure',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-40-fix-bug-1',
          kind: 'fix-bug',
          title: 'The stock that vanished',
          prompt: 'This program should print 20, but it prints undefined. Tap the buggy line, then choose the fix.',
          language: 'javascript',
          code: `const stock = new Map();
stock['rice'] = 20;
console.log(stock.get('rice'));`,
          bugLine: 2,
          fixes: [
            { line: "stock.set('rice', 20);", correct: true, why: 'set stores the key and the value inside the Map, where get can find them.' },
            { line: "stock.add('rice', 20);", correct: false, why: 'add is a Set method. A Map has no add, so the program stops with an error.' },
            { line: "stock.set('rice');", correct: false, why: 'This stores the key with no value, so get gives undefined.' },
            { line: "stock.get('rice', 20);", correct: false, why: 'get only reads. It never stores anything, so the later get still finds nothing.' },
          ],
          lineNote: 'The line that prints is fine. Look at how the value gets into the Map.',
          tests: { kind: 'output', expected: ['20'] },
          hints: [
            'Square brackets work on an object. Is stock an object here?',
            'A Map has its own method for storing a key and a value.',
            'The method is called set and takes the key, then the value.',
          ],
          explanation: 'stock[\'rice\'] = 20 puts an ordinary property on the Map object, not an entry in the Map, so get cannot see it. A Map entry is made with set(key, value).',
          concept: 'Map methods',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-40-code-challenge-1',
          kind: 'code-challenge',
          title: 'Spot a repeat',
          prompt: 'Write hasDuplicates(list). It returns true when any value appears more than once in the list, and false otherwise. Use a Set to remember what you have seen.',
          language: 'javascript',
          starter: `function hasDuplicates(list) {
  // remember each value in a Set as you go
  return false;
}`,
          tests: {
            kind: 'function',
            fn: 'hasDuplicates',
            cases: [
              { label: 'all different', args: [[1, 2, 3]], expected: false },
              { label: 'a repeated number', args: [[1, 2, 1]], expected: true },
              { label: 'empty list', args: [[]], expected: false },
              { label: 'a repeated word', args: [['a', 'b', 'b']], expected: true, hidden: true },
            ],
          },
          solution: `function hasDuplicates(list) {
  const seen = new Set();
  for (const item of list) {
    if (seen.has(item)) {
      return true;
    }
    seen.add(item);
  }
  return false;
}`,
          hints: [
            'Create an empty Set before the loop. As you visit each value, ask the Set whether it has seen it.',
            'If seen.has(item) is true, you found a repeat and can return true right away.',
            'Otherwise add the item to the Set. After the loop, return false.',
          ],
          explanation: 'The Set remembers every value visited so far. A value that is already in it on the second visit proves a repeat. If the loop ends with no such visit, there was none.',
          concept: 'Set',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-40-q1',
        prompt: 'What is new Set([1, 2, 2, 3, 3, 3]).size?',
        choices: ['6', '3', '2', '1'],
        answer: 1,
        explanation: 'A Set keeps each value once, so the repeats are dropped and only 1, 2 and 3 remain.',
      },
      {
        id: 'programming-fundamentals-40-q2',
        prompt: 'A shop keeps a stock count per product name, and products are added and removed often. The code mostly asks "how many of this product?". Which structure fits best?',
        choices: ['An array of counts', 'A Set of product names', 'An array of the names of products', 'A Map from product name to count'],
        answer: 3,
        explanation: 'The main question is a lookup by name, which is what a Map is for. A Set holds only values, and the arrays would need a scan to find a product.',
      },
      {
        id: 'programming-fundamentals-40-q3',
        prompt: 'After const m = new Map(); m.set(\'rice\', 20); what does m.get(\'oil\') give?',
        choices: ['undefined', '0, the count of that product', 'null, which a Map uses for a missing key', 'An error that stops the program'],
        answer: 0,
        explanation: 'A Map answers undefined for a key it does not hold, like a missing object property or an index out of range.',
      },
      {
        id: 'programming-fundamentals-40-q4',
        prompt: 'Your list has a million ids and you check for one id again and again. Why is a Set a better home for the ids than an array?',
        choices: ['A Set stores numbers in a smaller amount of memory', 'An array cannot store as many as a million values', 'A Set sorts the ids, so the check is easy and fast', 'includes may check items one at a time, while has goes straight to the value'],
        answer: 3,
        explanation: 'Scanning an array takes longer the more it holds. A Set looks values up directly, so repeated checks stay quick. A Set is not sorted; it keeps insertion order.',
      },
      {
        id: 'programming-fundamentals-40-q5',
        audience: { max: 'beginner' },
        prompt: 'A contact list must never hold the same friend twice. Which structure refuses duplicates for you?',
        choices: ['A Set', 'An array', 'A loop', 'A string'],
        answer: 0,
        explanation: 'Adding a value that a Set already holds changes nothing, so it never holds the same value twice. An array happily holds repeats.',
      },
      {
        id: 'programming-fundamentals-40-q6',
        audience: { min: 'advanced' },
        prompt: 'After m.set(1, \'a\'); m.set(\'1\', \'b\'); on a Map, and the same two assignments on a plain object (o[1] = \'a\'; o[\'1\'] = \'b\'), how many entries does each hold?',
        choices: ['The Map holds 1 and the object holds 2', 'Both hold 2', 'The Map holds 2 and the object holds 1', 'Both hold 1'],
        answer: 2,
        explanation: 'A Map treats the number 1 and the text "1" as different keys. An object turns every key into text, so both assignments use the key "1" and the second overwrites the first.',
      },
    ],
    task: {
      title: 'Pick the shape for each need',
      minutes: 15,
      steps: [
        'Write down five pieces of data a small shop app would keep (for example products and their stock, the names of today\'s customers, one sale, all sales this week, the cashier\'s opening hours). Beside each, write which structure you would use and one sentence on why, using the questions: order, unique, lookup by key, record.',
        'In any free JavaScript environment, build two of them in code: a Map of product stock with three products, and a Set of customer names where one name is added twice. Print size, and use get and has.',
        'Change the stock of one product, remove another, and print the Map with for...of. Say what you would lose if you had used two parallel arrays instead.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant whether it would choose the same structure for each of your five items, and compare its reasons with yours. Decide who convinced you, and why.'] },
      { audience: { min: 'advanced' }, steps: ['Given an array of 10,000 expense objects, write the code to total amounts by category with a Map, then build a Map index by id so that 1,000 lookups need no find. Explain the trade-off in memory and in clarity.'] },
    ],
  },
];


export const project: Project | null = {
  id: 'programming-fundamentals-p8',
  title: 'Inventory management logic',
  summary: 'Design the data and write the logic for a small shop\'s stock: add items, remove items, update quantities without going below zero, and list what is running low.',
  outcome: 'A working piece of inventory logic with a data structure you chose and can defend: proof that you can model real data and judge the shape of it, including when an AI suggests another one.',
  unlockAfterDay: 40,
  steps: [
    {
      id: 'programming-fundamentals-p8-s1',
      text: 'Decide how the inventory is stored. Write down what the shop needs to do (look an item up by name, list everything, find what is low) and pick a structure, for example an array of objects like { name: \'Rice\', quantity: 20 }, or a Map from name to quantity. Write two or three sentences saying why, using the questions from lesson 40. Then create sample data with at least four items.',
    },
    {
      id: 'programming-fundamentals-p8-s2',
      text: 'Write addItem(inventory, name, quantity). If the item is not there yet, it is added with that quantity. If it already exists, its quantity goes up by that amount instead of creating a second copy.',
    },
    {
      id: 'programming-fundamentals-p8-s3',
      text: 'Write removeItem(inventory, name), which deletes the item completely and returns true, or returns false when there was no such item. Write updateStock(inventory, name, change), where change can be positive (a delivery) or negative (a sale); the quantity must never go below 0, and an unknown name must not crash the program.',
    },
    {
      id: 'programming-fundamentals-p8-s4',
      text: 'Write lowStockItems(inventory, limit), which returns a new list of the names of the items whose quantity is at or below the limit, without changing the inventory.',
    },
    {
      id: 'programming-fundamentals-p8-s5',
      text: 'Test it with console.log. Run each function on your sample data, and also on the edge cases: an item that does not exist, a sale bigger than the stock, adding an item twice, and an empty inventory. For each, write down what you expected before you ran it, and what you got.',
    },
    {
      id: 'programming-fundamentals-p8-s6',
      text: 'Optional AI partner: paste your finished functions into an AI assistant and ask it to find bugs and to suggest a different data structure. Do not paste anything private. Note what it suggested, whether you checked it by running it, and what you decided to keep or change.',
    },
    {
      id: 'programming-fundamentals-p8-s7',
      audience: { max: 'beginner' },
      text: 'A smaller version is fine: build addItem and lowStockItems in code, and write removeItem and updateStock as numbered plain-English steps. Do the two code functions with the data on paper first, with a trace of the array after each call.',
    },
    {
      id: 'programming-fundamentals-p8-s8',
      audience: { min: 'advanced' },
      text: 'Build a second version with the other structure (an array of objects if you used a Map, or the reverse) and compare the two in terms of lookup, clarity and what each function had to do. Add a small test function that checks expected against actual and reports each failing case by name.',
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your design, code and explanation',
    placeholder: 'The structure you chose and why, your sample data, your functions, the output of your tests, and what you would explain to a friend about how it works.',
    hint: 'Include: (1) the structure you chose and why, in your own words; (2) your code; (3) the printed output for your sample data and edge cases; (4) one thing that went wrong while you built it and how you found it; (5) if you used AI, what it suggested and what you decided.',
  },
  rubric: [
    'The chosen data structure fits what the shop needs, and the explanation ties the choice to those needs (lookup, order, uniqueness, records)',
    'addItem, removeItem and updateStock give the right results on normal data, and adding an existing item changes its quantity instead of duplicating it',
    'Edge cases are handled: an unknown item, a sale larger than the stock (never below 0) and an empty inventory do not crash or give wrong numbers',
    'lowStockItems returns the right names and leaves the inventory unchanged',
    'The learner explains in their own words how the code works and why they chose this shape, including what they tested',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The two functions written in code run correctly, and the other two are clear, ordered plain-English steps that match the data'] },
    { audience: { min: 'advanced' }, items: ['A second structure is implemented and compared with evidence, and the tests report expected against actual for every case', 'Any AI suggestion is verified by running it and its trade-offs are judged, not accepted on trust'] },
  ],
};
