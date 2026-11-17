import type { Lesson, Project } from '../../../types';

// Module 12: the final project. One program, the personal expense tracker, grows across lessons 56 to 60.
// Names and data shapes used throughout: an expense is { description, amount, category, date } with the amount in whole centavos and the date as 'YYYY-MM-DD' text;
// the list is a plain array; the functions are suggestCategory, pickCategory, addExpense, validateExpense, isValidDate, formatPeso, formatExpense, listExpenses,
// totalOf, totalByCategory, biggestExpense, filterByCategory, filterByMonth, printReport and a tiny check(name, actual, expected) for tests.

export const lessons: Lesson[] = [
  {
    id: 'programming-fundamentals-56',
    day: 56,
    title: 'Plan the Tracker: Requirements, Pseudocode and Flowchart',
    summary: 'Decide what the expense tracker must do, what one expense looks like, and how you will know it works, before writing any code.',
    intro: {
      objectives: [
        'Write the tracker\'s requirements as short sentences you can check',
        'Choose the data shape for one expense and for the whole list',
        'Draft pseudocode, a flowchart and a test plan with expected answers',
      ],
      why: 'A program you can describe precisely is a program you can build, test and explain, and it is also the only kind an AI assistant can build well for you. The plan is what you will hand to yourself, and to an AI, for the next four lessons.',
    },
    minutes: 25,
    skills: ['build-project', 'problem-solving'],
    body: [
      { type: 'paragraph', text: "Every program you have written so far was small enough to hold in your head. The expense tracker is not. Over the next five lessons you will build one program in JavaScript, one layer at a time, and this lesson is the layer that comes before any code: the plan. A plan answers three questions. What must the program do? What information does it handle? How will you know it works? This matters even more if you build with AI, because an assistant can only build what you can describe, and 'a tracker for my expenses' is not yet a description." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Imagine a sari-sari store owner who decides to keep a proper notebook instead of remembering every sale. Before she writes a single line, she decides the columns: date, item, amount, and a short label such as 'food' or 'load'. She decides that an amount is written in pesos and centavos, never 'about twenty'. She decides what she wants out of the notebook at the end of the month: the total, and which label used the most money. Only then does she rule the lines. The decisions came first, and the writing is easy afterwards." },
      { type: 'paragraph', text: "Where the picture stops: a notebook forgives a smudged number because a person reads it and guesses. A program guesses nothing. It does exactly what it is told, so every small decision a person would make without noticing has to be written down: what counts as a real date, what happens when the list is empty." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "A plan for the tracker has six parts. You will write each one in this lesson, on paper or in a plain text file, and the next four lessons turn them into working code." },
      { type: 'paragraph', text: "**1. Requirements.** A **requirement** is one sentence about what the program must do, specific enough that you could check it. 'Track my money' is a wish. 'Show the total spent in a month I choose' is a requirement. These are the tracker's:" },
      {
        type: 'list',
        ordered: true,
        items: [
          'Add an expense with a description, an amount, a date and a category.',
          'If no category is given, suggest one from the description.',
          'Show all expenses, one per line, and say so when there are none.',
          'Show the total of all expenses, the total of each category, and the biggest expense.',
          'Show only the expenses of one category, or of one month.',
          'Refuse a bad expense (an empty description, an amount of zero or less, a date that does not exist) and say what is wrong.',
        ],
      },
      { type: 'paragraph', text: "Just as important is what is **out of scope**: saving to a file or phone, editing or deleting an expense, other currencies, charts and a screen to tap. These are real features, but a project that tries to do everything never finishes. Write them in a 'later' list so you can stop thinking about them." },
      { type: 'paragraph', text: "**2. Inputs, processes and outputs.** Module 2 taught you to ask, for each requirement, what goes in, what is done to it and what comes out. Adding an expense takes in four values and gives back the stored expense or a list of problems. Showing, totalling and filtering all take in the list, and give back lines of text, a number or a shorter list. Each answer points to one or two functions." },
      { type: 'paragraph', text: "**3. The data shape.** Decide what one expense looks like and where the list lives. Each choice has a reason, and you met all three reasons in earlier modules:" },
      {
        type: 'table',
        headers: ['Field', 'Type', 'Example', 'Rule'],
        rows: [
          ['description', 'string', "'Jeepney fare'", 'not empty'],
          ['amount', 'number', '2400', 'a whole number of centavos, above zero (2400 means PHP 24.00)'],
          ['category', 'string', "'transport'", 'one of a fixed list: food, transport, bills, school, health, other'],
          ['date', 'string', "'2026-11-16'", 'written year-month-day, and a day that exists'],
        ],
        caption: 'One expense. The whole list is an array of these.',
      },
      { type: 'code', language: 'text', label: 'the data shape (a plan, not code)', code: `expense  = { description, amount, category, date }
expenses = a list of expense, in the order they were added` },
      { type: 'paragraph', text: "Money is stored as whole centavos because decimals such as 0.1 + 0.2 do not add up exactly in floating point (module 3). The date is plain text in year-month-day order so that a month is just its first seven characters, '2026-11'. The category list is fixed so that a typo such as 'foood' cannot quietly start a category of its own." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: planning means deciding before doing. A requirement is a sentence about what the program must do that you could check later. A data shape is how you write down one thing the program keeps, here an expense with four labelled parts. Pseudocode is the steps written in everyday language with a simple layout, and a flowchart is the same steps drawn with boxes and arrows, with a diamond wherever the answer is yes or no. A test case is a question you already know the answer to, so you can tell later whether the program gets it right.",
      },
      { type: 'paragraph', text: "**4. The functions.** Name each job now, before you write any of them. A function with a clear name, a clear input and a clear result is easy to write and easy to test:" },
      {
        type: 'table',
        headers: ['Function', 'Takes', 'Gives back', 'Built in lesson'],
        rows: [
          ['suggestCategory, addExpense', 'the list and one input', 'a category; the stored expense', '57'],
          ['listExpenses, totalOf, totalByCategory, biggestExpense', 'the list', 'printed lines; a number; an object; one expense', '58'],
          ['filterByCategory, filterByMonth, validateExpense', 'the list and a value; one input', 'a shorter list; a list of error messages', '59'],
          ['a report, a small set of tests', 'the list', 'a printed summary; PASS and FAIL lines', '60'],
        ],
        caption: 'The build order: each lesson adds to the same program.',
      },
      { type: 'paragraph', text: "**5. Pseudocode and a flowchart.** Pseudocode keeps the plain conventions from module 2: SET, IF and ELSE, and FOR EACH as the repeat that visits every item of a list. Here is the heart of adding an expense:" },
      { type: 'code', language: 'text', label: 'pseudocode', code: `FUNCTION addExpense(list, input)
  IF input has no category THEN
    SET category TO suggest(input.description)
  ELSE
    SET category TO input.category
  END IF
  ADD the new expense to the end of list
END FUNCTION` },
      { type: 'paragraph', text: "The flowchart shows the whole of adding an expense, including the check at the door that lesson 59 builds. The decisions are the diamonds: each has exactly two ways out." },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Adding an expense. Lesson 57 builds the lower path; lesson 59 adds the check at the top.',
        source: `flowchart TD
  A(Start) --> B[Receive description, amount, date and maybe a category]
  B --> C{Are all the fields valid?}
  C -->|no| D[Give back the list of problems]
  D --> H(End)
  C -->|yes| E{Was a category given?}
  E -->|no| F[Suggest a category from the description]
  E -->|yes| G[Use the category that was given]
  F --> I[Add the expense to the list]
  G --> I
  I --> H`,
      },
      { type: 'paragraph', text: "**6. The test plan.** A **test plan** is a table you write before the code: an input and the answer you expect. Writing it now forces you to decide what 'correct' means, and in lesson 60 it becomes a program that checks itself." },
      {
        type: 'table',
        headers: ['Input', 'Expected result'],
        rows: [
          ['the total of an empty list', '0'],
          ['the total of expenses of 2400 and 6500', '8900'],
          ["suggest a category for 'Jeepney fare'", "'transport'"],
          ["suggest a category for 'Mystery gift'", "'other' (nothing matches)"],
          ['the biggest expense of an empty list', 'no expense at all, not a made-up one'],
          ['filter by month 2026-11, with one October expense in the list', 'the October expense is left out'],
          ['an expense with an amount of -50', 'refused, with a message about the amount'],
          ['an expense dated 2026-02-30', 'refused, with a message about the date'],
        ],
        caption: 'Half of these are edge cases: empty lists, bad values and impossible dates.',
      },
      { type: 'paragraph', text: "Finally, write the **open questions**: decisions you cannot make yet. What should happen when someone gives a category that is not on the list? Fix it silently, or refuse it? Lesson 57 starts with the forgiving answer and lesson 59 reconsiders it. A plan is allowed to say 'I will decide later', as long as it says so." },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "For an experienced developer the plan is acceptance criteria, a data model and a risk list in miniature. The valuable moves are the ones that are expensive to change later: money as integer minor units, dates as ISO 8601 text (which sorts in calendar order as plain strings), and keeping the logic in pure functions that take values and return values, so that input and output sit at the edge and every test needs no setup. Explicit non-goals protect the scope, and an open-questions list is honest about decisions deferred rather than silently made. The test table is the seed of the unit tests, and the flowchart is a review aid, not documentation to maintain.",
      },
      { type: 'heading', text: 'Walk through an example' },
      { type: 'paragraph', text: "Run the plan by hand, as you did with dry runs in module 2. First the total. The plan says: start at 0, add each amount, return the result. With three expenses of 2400, 6500 and 12050 centavos:" },
      { type: 'code', language: 'text', label: 'a hand trace', code: `list = [ 2400, 6500, 12050 ]
total starts at 0
expense 1: total = 0 + 2400 = 2400
expense 2: total = 2400 + 6500 = 8900
expense 3: total = 8900 + 12050 = 20950
RETURN 20950` },
      { type: 'paragraph', text: "The answer, 20950 centavos, is PHP 209.50. Notice that the trace never needed a computer, only the plan." },
      { type: 'paragraph', text: "Now follow a bad expense through the flowchart: an amount of -50. Start, receive the fields, then the first diamond asks whether all fields are valid. The amount is below zero, so the answer is no, and the arrow leads straight to 'Give back the list of problems' and then to End. The list of expenses was never touched. That gives you a requirement and a test, found by reading a drawing." },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "An assistant makes a good partner for a plan when you ask it to question you rather than to design for you. Try this with whichever assistant you use, after you have written your own six requirements:" },
      { type: 'prompt', label: 'Find the gaps in my requirements', text: "I am planning a small personal expense tracker. It stores expenses with a description, an amount in whole centavos, a category from a fixed list, and a date written like 2026-11-16. It can add an expense, show them, total them, filter by category or month, and refuse bad input. Here are my requirements:\n\n[paste your list]\n\nDo not write any code and do not add features. Ask me up to five questions that point at things my list leaves unclear or that could go wrong, one at a time, and wait for my answer to each." },
      { type: 'prompt', label: 'Check my pseudocode', text: "Here is my pseudocode for adding an expense and for totalling a list:\n\n[paste your pseudocode]\n\nDo not rewrite it and do not give me code. Point at any step that is ambiguous, or any case it does not cover, and ask me what I intended." },
      { type: 'paragraph', text: "What to look for: good questions point at gaps you can test, such as 'what is a valid date?' or 'what happens with an empty list?'. Answer each one in your plan. One way the reply might mislead you: assistants like to be helpful, so they may slip in features you did not ask for (a login, cloud sync, charts) or suggest decimal numbers for money. You decide the scope. If you cannot say why a suggestion belongs in your plan, leave it out." },
      {
        type: 'takeaways',
        items: [
          'A plan answers what the program must do, what data it handles and how you will know it works, before any code.',
          'A requirement is one checkable sentence, and an out-of-scope list keeps a project finishable.',
          'Choose the data shape on purpose: money as whole centavos, dates as year-month-day text, categories from a fixed list.',
          'Name every function with its input and result, then write pseudocode and a flowchart, and trace them by hand.',
          'A test plan is a table of inputs and expected answers, and half of its rows should be edge cases.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-56-arrange-1',
          kind: 'arrange',
          language: 'text',
          title: 'Put the plan for adding an expense in order',
          prompt: 'These are the lines of the pseudocode for adding an expense, shuffled. Put them in an order that makes sense, so that the category is chosen before the expense is stored.',
          concept: 'pseudocode',
          solution: [
            'FUNCTION addExpense(list, input)',
            '  IF input has no category THEN',
            '    SET category TO suggest(input.description)',
            '  ELSE',
            '    SET category TO input.category',
            '  END IF',
            '  ADD the new expense to the end of list',
            'END FUNCTION',
          ],
          reasons: [
            'A function plan starts by naming the function and what it receives.',
            'The first question is whether the person gave a category.',
            'If not, the plan asks the suggesting step to choose one from the description.',
            'ELSE covers the other answer to the same question.',
            'Otherwise the category the person gave is used.',
            'END IF closes the question before anything else happens.',
            'Only after the category is settled can the new expense be stored.',
            'END FUNCTION closes the plan.',
          ],
          hints: ['The function header comes first and END FUNCTION comes last.', 'The IF, its ELSE and its END IF belong together, and the category must be known before the expense is stored.', 'After END IF comes ADD the new expense, then END FUNCTION.'],
          explanation: 'The plan decides the category first (a question with two answers) and stores the expense afterwards, so the stored expense always has a category. Putting the ADD line before the IF would store it with nothing decided.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-56-match-1',
          kind: 'match',
          title: 'Which part of the plan is it?',
          prompt: 'Each sentence below came out of a plan for the tracker. Match it to the part of the plan it belongs to.',
          concept: 'requirements and test plans',
          labels: { terms: 'A sentence from a plan', meanings: 'The part of the plan' },
          pairs: [
            { term: 'The tracker must show the total for any month the person chooses', definition: 'A requirement: what the program must do', note: 'This sentence says what the program must do, which makes it a requirement.' },
            { term: 'An amount is stored as a whole number of centavos', definition: 'A data rule: how a value is stored', note: 'This sentence says how a value is kept, which is a data rule.' },
            { term: 'The total of an empty list should be 0', definition: 'A test case: an input with its expected answer', note: 'This sentence gives an input and the answer you expect, which is a test case.' },
            { term: 'Saving expenses to the phone between visits', definition: 'Out of scope: written down for later', note: 'The plan does not include storing between visits, so it belongs on the later list.' },
          ],
          hints: ['Ask of each sentence: does it say what the program does, how data is written, an input with an answer, or something we are not doing now?', 'A sentence that contains an input and an expected answer is a test case.', 'The sentence about saving to the phone is a feature the plan chose not to include.'],
          explanation: 'Keeping the four kinds of sentence apart helps: requirements say what, data rules say how a value is written, test cases pair an input with an answer, and the out-of-scope list is what you are leaving for later.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-56-scenario-1',
          kind: 'scenario',
          title: 'A friend wants more features',
          situation: "You show your plan to a friend. She says: 'This is great, but add a login, a pie chart of spending and cloud backup, and then it is a real app.' You have five lessons to build the core.",
          prompt: 'What do you do with her ideas?',
          concept: 'scope',
          options: [
            { text: "Thank her, write the three ideas on the 'later' list, and carry on with the six requirements you have.", consequence: 'Your plan stays small enough to finish, and the ideas are not lost. You can return to them when the core works and is tested.', quality: 'best' },
            { text: 'Add all three to the requirements now, so the plan is complete.', consequence: 'The plan grows by three large features, and none of the core is built yet. Most projects that start this way are never finished.', quality: 'poor' },
            { text: 'Add only the pie chart, since it looks the most impressive.', consequence: 'One extra feature is less harmful than three, but a chart needs a screen, which the plan chose not to build, so the core is still delayed.', quality: 'acceptable' },
          ],
          hints: ['A plan is useful because it is small enough to finish.', 'Good ideas are not thrown away: they are written down somewhere other than the requirements.', 'The core is six requirements; the three ideas are each far bigger than one of them.'],
          explanation: 'Writing ideas on a later list respects both the idea and the plan. You are not saying no for ever, only not now, and the project stays finishable.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-56-fill-blank-1',
          kind: 'fill-blank',
          language: 'text',
          title: 'Finish the pseudocode for the total',
          prompt: 'Fill the three blanks so that this pseudocode returns the total of all the amounts in the list.',
          concept: 'pseudocode',
          code: `FUNCTION totalOf(list)
  SET total TO ___
  FOR EACH expense IN list
    SET total TO total ___ expense.amount
  END FOR
  RETURN ___
END FUNCTION`,
          blanks: [
            { answers: ['0'], feedback: 'Before any expense is added, nothing has been spent, so the total starts at zero.' },
            { answers: ['+'], feedback: 'Each time round, the new amount is added to the total so far.' },
            { answers: ['total'], feedback: 'The function should give back the running total, not the list or one expense.' },
          ],
          bank: ['0', '+', 'total', 'list', '-', 'expense'],
          hints: ['The total before the loop starts is what you have counted so far: nothing.', 'Inside the loop each amount is added to the total.', 'After the loop, give back the variable that holds the answer.'],
          explanation: 'This is the same pattern as the hand trace: start at 0, add each amount as you visit it, and return the total when the list is finished.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-56-q1',
        prompt: 'Which sentence is a requirement that the tracker can be checked against?',
        choices: [
          'The tracker should feel quick, friendly and pleasant to use every single day of the week',
          'The tracker shows the total of all expenses for a month the person chooses',
          'The tracker is for students and workers who want to understand and save their money',
          'The tracker will be the best way to manage personal spending for most people',
        ],
        answer: 1,
        explanation: 'A requirement says what the program must do in a way you can check: pick a month, look at the total. The other three are wishes or descriptions that nothing could prove right or wrong.',
      },
      {
        id: 'programming-fundamentals-56-q2',
        prompt: 'The plan stores PHP 24.50 as a number. Which choice follows the plan?',
        choices: [
          'Store 24.5, because decimals are the natural way to write pesos',
          "Store the text '24.50' so that nothing is ever rounded at all",
          'Store 24 and 50 in two fields and add them back together later',
          'Store 2450, a whole number of centavos, so that sums stay exact',
        ],
        answer: 3,
        explanation: 'Whole numbers of centavos add exactly, while decimals can drift (0.1 + 0.2 is not exactly 0.3). Text cannot be added at all without converting it, and two fields make every calculation harder.',
      },
      {
        id: 'programming-fundamentals-56-q3',
        prompt: 'Which row belongs in a test plan?',
        choices: [
          'Input: an empty list. Expected: the total is 0',
          'Input: some expenses. Expected: the total is correct',
          'Input: the whole tracker. Expected: it works well',
          'Input: any list. Expected: whatever the code prints',
        ],
        answer: 0,
        explanation: 'A test row needs a specific input and a specific answer decided before the code runs. "Correct", "works well" and "whatever it prints" cannot fail, so they test nothing.',
      },
      {
        id: 'programming-fundamentals-56-q4',
        prompt: "In the add-expense flowchart, why does the 'Are all the fields valid?' step have two arrows leaving it?",
        choices: [
          'Every flowchart needs at least one diamond with two arrows to look complete',
          'The program always takes both paths, one after the other, to be safe',
          'The next step depends on the answer, so yes and no lead to different steps',
          'One arrow is for the first expense and the other is for all later ones',
        ],
        answer: 2,
        explanation: 'A decision diamond is where the program chooses between two next steps depending on a yes or no answer. Only one path is taken each time.',
      },
      {
        id: 'programming-fundamentals-56-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is pseudocode?',
        choices: [
          'A secret shorthand code that only experienced programmers are able to read, which the computer then runs',
          'A program that the computer runs in order to test your plan for you',
          'A flowchart in which the arrows have been left out to save space',
          'The steps written in everyday words with a simple layout, to check the plan before coding',
        ],
        answer: 3,
        explanation: 'Pseudocode is not run by a computer. It is a way to write the steps clearly enough that a person can check them by hand, before any real code exists.',
      },
      {
        id: 'programming-fundamentals-56-q6',
        audience: { min: 'advanced' },
        prompt: "A teammate wants to give an AI assistant the single sentence 'make an expense tracker' and skip planning. What is the strongest argument for planning first?",
        choices: [
          'Assistants cannot write programs of this size at all, so a written plan is a requirement before they will start',
          'The sentence leaves out the data shape and edge cases, so the assistant fills the gaps with guesses',
          'A plan is mainly useful as documentation for people who read the project later',
          'Planning first makes the generated code run faster than it otherwise would',
        ],
        answer: 1,
        explanation: 'Gaps in a request are filled with plausible defaults, for example decimal money or no validation. A plan states those decisions up front, so you can check the result against them.',
      },
    ],
    task: {
      title: 'Write the plan for your tracker',
      steps: [
        'Write the six requirements in your own words, then a short out-of-scope list.',
        'Draw the data table for one expense: field, type, example and rule.',
        'Write pseudocode for totalByCategory: start every category at 0, then add each expense to its category.',
        'Draw a flowchart of one function (adding an expense or validating one) on paper, with at least one decision.',
        'Write a test plan of at least eight rows, with at least three edge cases, and one open question.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If it feels like a lot, plan only three requirements: add an expense, show them all, and show the total. You can grow the plan in the next lessons.'] },
      { audience: { min: 'advanced' }, steps: ['Turn each requirement into acceptance criteria (given, when, then), list two non-goals, and mark which test rows are edge cases and which are normal cases.'] },
    ],
  },
  {
    id: 'programming-fundamentals-57',
    day: 57,
    title: 'Add and Categorize Expenses',
    summary: 'Write the first working piece of the tracker: a function that stores a clean expense and gives it a category from a fixed list.',
    intro: {
      objectives: [
        'Write addExpense so it stores a tidy expense object in the list',
        'Keep the categories in one fixed list and check a category against it',
        'Suggest a category from the whole words of a description',
      ],
      why: 'Adding an expense is the first thing the tracker does and every later feature depends on it. Building it as small functions with one job each is the habit that keeps a program, and an AI-written program, easy to read and fix.',
    },
    minutes: 25,
    skills: ['build-project', 'functions'],
    body: [
      { type: 'paragraph', text: "The plan is written, so it is time for code. This lesson builds the first layer of the tracker: the settings it relies on, a function that suggests a category from a description, and addExpense, which stores one expense in the list. Open any free JavaScript environment, create one file, and type the code as you read it. Every later lesson adds to this same file." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Some families keep their money in labelled envelopes: one for food, one for fares, one for the electric bill, one for school. When a receipt arrives, somebody decides which envelope it belongs to. If the receipt says 'jeepney', it goes in the fares envelope without a debate. If nobody can tell, it goes in the 'other' envelope." },
      { type: 'paragraph', text: "That is exactly what the tracker will do. The picture stops at one point: a real envelope holds cash, while the tracker only stores a label next to each amount. The sorting rule is the part that matters." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "**One list of categories.** The allowed categories live in one constant array, CATEGORIES. Everything else asks that list instead of typing the names again. If you ever add a category, you change one place." },
      { type: 'paragraph', text: "**A table of keywords.** To suggest a category, the tracker needs to know which words point to which category. That is data, so it goes in an object: each category name is a key, and its value is an array of words. The function splits the description into words, lowercases them, and looks for a word that appears in a category's array. It compares whole words on purpose. If it asked whether the description merely contained the letters 'pen', then 'Spend' would be filed under school." },
      { type: 'paragraph', text: "**One function, one job.** suggestCategory only suggests. pickCategory only decides which category to store: the one suggested when none was given, the one given when it is on the list, and 'other' when it is not. addExpense builds the stored expense and puts it in the list. Small functions can be tested one at a time, and the names tell you what each does." },
      { type: 'paragraph', text: "**One object in, so the order cannot be mixed up.** addExpense takes the list and a single object called input. A call that passes four loose values in the wrong order is a bug waiting to happen. An object with named fields is hard to get wrong." },
      {
        type: 'table',
        headers: ['What the person gives', 'Description', 'Category stored'],
        rows: [
          ['nothing for category', "'Jeepney fare'", "'transport', suggested from the word 'jeepney'"],
          ['nothing for category', "'Mystery gift'", "'other', because no keyword matches"],
          ["'school'", "'Notebook and pen'", "'school', it is on the list"],
          ["'medicine'", "'Vitamins'", "'other' for now, because 'medicine' is not on the list"],
        ],
        caption: 'The rule pickCategory follows. Lesson 59 reconsiders the last row.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: an array is an ordered list of values, and an object is a set of labelled values. CATEGORIES is an array of names. KEYWORDS is an object, and each label holds an array. 'Splitting' a sentence on spaces turns it into an array of words. A function with a single job is like a worker with a single task: when something goes wrong you know which worker to ask. The two nested loops in suggestCategory do this: for each category, look at each word and ask if it is on that category's list.",
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "Step 1: the settings. A comment at the top records the two rules that the whole program depends on." },
      { type: 'code', language: 'javascript', label: 'step 1: settings', code: `// Personal Expense Tracker
// Amounts are whole centavos: 2400 means PHP 24.00. Dates are text like '2026-11-16'.

const CATEGORIES = ['food', 'transport', 'bills', 'school', 'health', 'other'];

const KEYWORDS = {
  food: ['rice', 'lunch', 'coffee', 'milk', 'snack'],
  transport: ['jeepney', 'fare', 'bus', 'tricycle'],
  bills: ['load', 'electric', 'water', 'internet'],
  school: ['notebook', 'pen', 'tuition'],
  health: ['medicine', 'vitamins', 'clinic'],
};` },
      { type: 'paragraph', text: "Step 2: suggest a category from a description." },
      { type: 'code', language: 'javascript', label: 'step 2: suggestCategory', code: `function suggestCategory(description) {
  const words = description.toLowerCase().split(' ');
  for (const category of Object.keys(KEYWORDS)) {
    for (const word of words) {
      if (KEYWORDS[category].includes(word)) {
        return category;
      }
    }
  }
  return 'other';
}` },
      { type: 'paragraph', text: "Step 3: decide the category to store." },
      { type: 'code', language: 'javascript', label: 'step 3: pickCategory', code: `function pickCategory(description, category) {
  if (category === undefined) {
    return suggestCategory(description);
  }
  if (CATEGORIES.includes(category)) {
    return category;
  }
  return 'other';
}` },
      { type: 'paragraph', text: "Step 4: build the expense and store it. The function returns the expense it stored, which is handy for printing." },
      { type: 'code', language: 'javascript', label: 'step 4: addExpense', code: `function addExpense(expenses, input) {
  const expense = {
    description: input.description.trim(),
    amount: input.amount,
    category: pickCategory(input.description, input.category),
    date: input.date,
  };
  expenses.push(expense);
  return expense;
}` },
      { type: 'paragraph', text: "Step 5: try it. Add this below the functions and run the file." },
      { type: 'code', language: 'javascript', label: 'step 5: try it', code: `const expenses = [];
const first = addExpense(expenses, { description: 'Jeepney fare', amount: 2400, date: '2026-11-16' });
addExpense(expenses, { description: '  Lunch at the canteen ', amount: 6500, date: '2026-11-16' });
addExpense(expenses, { description: 'Mystery gift', amount: 15000, date: '2026-11-17' });
addExpense(expenses, { description: 'Notebook and pen', amount: 4500, category: 'school', date: '2026-11-17' });
addExpense(expenses, { description: 'Vitamins', amount: 8900, category: 'medicine', date: '2026-11-18' });

console.log(first);
console.log(expenses.length);
for (const expense of expenses) {
  console.log(\`\${expense.description}: \${expense.category}\`);
}` },
      { type: 'paragraph', text: "This is what it printed when the whole file was run with Node." },
      { type: 'code', language: 'text', label: 'output', code: `{
  description: 'Jeepney fare',
  amount: 2400,
  category: 'transport',
  date: '2026-11-16'
}
5
Jeepney fare: transport
Lunch at the canteen: food
Mystery gift: other
Notebook and pen: school
Vitamins: other` },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**suggestCategory** lowercases the description and splits it at each space into an array of words. The outer loop visits each category name from Object.keys(KEYWORDS); the inner loop visits each word. The first time a word is in that category\'s keyword array, the function returns the category immediately. If both loops end without a match, the last line returns \'other\'.',
          '**pickCategory** has three exits. An undefined category means the person gave none, so it asks suggestCategory. A category that CATEGORIES includes is returned as given. Anything else becomes \'other\'.',
          '**addExpense** builds a new object. trim removes spaces from both ends of the description. The category comes from pickCategory. push puts the object at the end of the list, and return hands it back.',
          '**The try-it code** starts with an empty array, adds five expenses, prints the first one, the length of the list, and one line per expense.',
        ],
      },
      { type: 'paragraph', text: "Here is suggestCategory traced by hand for 'Jeepney fare'. The words are 'jeepney' and 'fare'." },
      {
        type: 'table',
        headers: ['Category checked', 'Word checked', 'In that category\'s list?', 'What happens'],
        rows: [
          ['food', 'jeepney', 'no', 'next word'],
          ['food', 'fare', 'no', 'next category'],
          ['transport', 'jeepney', 'yes', "return 'transport'"],
        ],
        caption: 'The function stops at the first match, so the order of categories in KEYWORDS matters when a description fits two.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Table-driven rules are a sound first design: behaviour lives in data, not in a chain of conditionals, and a misclassification is fixed by editing the table and adding a test. The limits are worth knowing. Matching is order-dependent when a description fits two categories, tokenizing on single spaces ignores punctuation and tabs, and lowercasing is not full locale-aware normalisation. addExpense also mutates the array it is given and returns the new element, which is convenient but is a design choice a reviewer may question: a pure alternative returns a new array. None of this blocks the project, and each is a candidate for the review in lesson 60.",
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Use an assistant as a questioner, not an author. Paste your suggestCategory function and ask it to test your understanding:" },
      { type: 'prompt', label: 'Quiz me on my function', text: "Here is a JavaScript function from my expense tracker:\n\n[paste suggestCategory and the KEYWORDS object]\n\nDo not rewrite it and do not tell me what it returns. Give me five descriptions one at a time, including tricky ones, and ask me to predict what the function returns for each. After each answer, tell me whether I was right and why." },
      { type: 'prompt', label: 'Where could this go wrong?', text: "Without changing my code, list three kinds of description that this suggestCategory function would put in the wrong category or in 'other', and say what makes each one tricky. Then ask me which I want to fix first." },
      { type: 'paragraph', text: "What to look for: run the tricky descriptions yourself and check the assistant's predictions against what your code really returns. A chat assistant cannot run your file unless it has a tool for that, so it may be confidently wrong about the output. The cases that fool the function (a comma after a word, a keyword that fits two categories) are real, and finding them is part of knowing your own code." },
      {
        type: 'takeaways',
        items: [
          'Keep the allowed values in one constant list, and let every other part of the program ask that list.',
          'Put rules in data (an object of keyword arrays) and compare whole words, so unrelated words do not match by accident.',
          'Give each function one job: suggestCategory suggests, pickCategory decides, addExpense stores.',
          'Pass one object with named fields instead of several loose values, so the order cannot be mixed up.',
          'This version is forgiving: an unknown category becomes \'other\'. Lesson 59 revisits that decision.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-57-predict-output-1',
          kind: 'predict-output',
          language: 'javascript',
          title: 'What does suggest return?',
          prompt: 'This is a smaller version of suggestCategory. Predict the four lines it prints.',
          concept: 'looping over keywords',
          code: `const KEYWORDS = { food: ['rice', 'lunch'], transport: ['bus', 'fare'] };

function suggest(description) {
  const words = description.toLowerCase().split(' ');
  for (const category of Object.keys(KEYWORDS)) {
    for (const word of words) {
      if (KEYWORDS[category].includes(word)) {
        return category;
      }
    }
  }
  return 'other';
}

console.log(suggest('Bus fare'));
console.log(suggest('LUNCH with Ana'));
console.log(suggest('Rice, please'));
console.log(suggest('fare and lunch'));`,
          choices: ['transport\nfood\nfood\nfood', 'transport\nfood\nother\nfood', 'transport\nother\nother\ntransport', 'fare\nlunch\nrice\nfood'],
          wrongNotes: {
            'transport\nfood\nfood\nfood': "The third description is 'Rice, please'. The word is 'rice,' with a comma stuck to it, which is not the same as 'rice'.",
            'transport\nother\nother\ntransport': "Lowercasing happens first, so 'LUNCH' still matches. And the last description fits both categories: which category does the outer loop reach first?",
            'fare\nlunch\nrice\nfood': 'The function returns a category name, never the word that matched.',
          },
          hints: ['The description is lowercased before it is split, so capital letters do not matter.', "Compare whole words: 'rice,' with a comma is a different word from 'rice'.", "For 'fare and lunch', both categories have a match. The outer loop visits food first, since it is first in KEYWORDS."],
          explanation: "'Bus fare' matches transport. 'LUNCH with Ana' becomes 'lunch', a food word. 'Rice, please' has the word 'rice,' with a comma, which matches nothing. 'fare and lunch' matches both, and food comes first in the object, so food wins.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-57-fix-bug-1',
          kind: 'fix-bug',
          language: 'javascript',
          title: 'The category that was never accepted',
          prompt: "pickCategory should return a category that is on the list and 'other' for anything else, but 'food' comes back as 'other'. Tap the faulty line and choose the fix.",
          concept: 'checking a value against a list',
          code: `const CATEGORIES = ['food', 'transport', 'other'];

function pickCategory(category) {
  if (CATEGORIES.indexOf(category) > 0) {
    return category;
  }
  return 'other';
}

console.log(pickCategory('food'));
console.log(pickCategory('transport'));
console.log(pickCategory('gifts'));`,
          bugLine: 4,
          fixes: [
            { line: 'if (CATEGORIES.indexOf(category) >= 0) {', correct: true, why: "indexOf gives the position of the value in the array, or -1 when it is missing. 'food' is at position 0, which is a valid answer, so the test must accept 0 and above." },
            { line: 'if (CATEGORIES.indexOf(category) > 1) {', correct: false, why: "That also rejects 'transport', which sits at position 1." },
            { line: 'if (CATEGORIES.indexOf(category) === 0) {', correct: false, why: "That accepts only the very first category, so 'transport' becomes 'other'." },
            { line: 'if (CATEGORIES.indexOf(category) !== 0) {', correct: false, why: "That flips the test: 'food' is rejected, and 'gifts' (position -1) is accepted." },
          ],
          tests: { kind: 'output', expected: ['food', 'transport', 'other'] },
          lineNote: 'The line that decides whether a category is accepted is the one with the if. Look for what it does to the very first item.',
          hints: ['Which category fails? Look at where it sits in the list.', 'The first item of an array is at position 0, and indexOf gives -1 for a missing value.', 'The condition should accept 0 and every position above it: greater than or equal to 0.'],
          explanation: "Counting starts at 0, so the first category has index 0. A test of 'greater than 0' skips it, which is a classic off-by-one slip. Using >= 0 accepts every position and rejects only -1.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-57-fill-blank-1',
          kind: 'fill-blank',
          language: 'javascript',
          title: 'Prepare the words of a description',
          prompt: 'Fill the blanks: lowercase the description before splitting it, ask whether the transport words include the first word, and print how many words there are.',
          concept: 'string and array methods',
          code: `const KEYWORDS = { food: ['rice'], transport: ['bus', 'fare'] };
const words = 'Bus Fare'.___().split(' ');
console.log(KEYWORDS.transport.___(words[0]));
console.log(words.___);`,
          blanks: [
            { answers: ['toLowerCase'], feedback: 'Capital letters would stop \'Bus\' matching \'bus\', so the text is made lowercase first.' },
            { answers: ['includes'], feedback: 'includes tells you whether an array contains a value, which is what the keyword check needs.' },
            { answers: ['length'], feedback: 'An array\'s length is the number of items in it. It is a property, so there are no brackets.' },
          ],
          bank: ['toLowerCase', 'includes', 'length', 'toUpperCase', 'indexOf', 'push'],
          tests: { kind: 'output', expected: ['true', '2'] },
          hints: ['The first blank is a method that changes the case of text.', 'The second blank is a method of an array that answers true or false.', 'The third blank is the property that holds the number of items.'],
          explanation: "'Bus Fare' becomes 'bus fare', which splits into ['bus', 'fare']. The transport list includes 'bus', so the first line prints true. There are 2 words, so the second prints 2.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-57-code-challenge-1',
          kind: 'code-challenge',
          language: 'javascript',
          title: 'Write suggestCategory',
          prompt: "Write the body of suggestCategory. Lowercase the description, split it into words, and return the first category (in the order of KEYWORDS) that has one of the words as a keyword. Return 'other' when nothing matches.",
          concept: 'nested loops',
          starter: `const KEYWORDS = {
  food: ['rice', 'lunch', 'coffee'],
  transport: ['jeepney', 'fare', 'bus'],
};

function suggestCategory(description) {
  // Return the first category with a keyword among the words of the description,
  // or 'other' when nothing matches.
}`,
          solution: `const KEYWORDS = {
  food: ['rice', 'lunch', 'coffee'],
  transport: ['jeepney', 'fare', 'bus'],
};

function suggestCategory(description) {
  const words = description.toLowerCase().split(' ');
  for (const category of Object.keys(KEYWORDS)) {
    for (const word of words) {
      if (KEYWORDS[category].includes(word)) {
        return category;
      }
    }
  }
  return 'other';
}`,
          tests: {
            kind: 'function',
            fn: 'suggestCategory',
            cases: [
              { label: 'a transport word', args: ['Jeepney fare'], expected: 'transport' },
              { label: 'capital letters', args: ['COFFEE with friends'], expected: 'food' },
              { label: 'no keyword', args: ['Mystery gift'], expected: 'other' },
              { label: 'the first category wins', args: ['bus and rice'], expected: 'food' },
            ],
          },
          hints: ['Start with const words = description.toLowerCase().split(\' \');', 'Loop over Object.keys(KEYWORDS), and inside it loop over words. Use KEYWORDS[category].includes(word).', "Return the category as soon as a word matches, and put return 'other'; after both loops."],
          explanation: "The outer loop gives each category in order and the inner loop tries each word. Returning at the first match makes the first category win a tie. The 'other' line runs only if both loops finish without a match.",
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-57-q1',
        prompt: 'Why does the tracker keep its categories in one fixed list instead of letting each expense carry any text?',
        choices: [
          'One list is the single place that says what is allowed, so a typo cannot start a new category',
          'A fixed list makes the program run faster because the computer remembers every word in it for good',
          'JavaScript refuses to store a category in an object unless it was declared in a list at the top',
          'A list is needed because text cannot be stored inside an object until it has been listed first',
        ],
        answer: 0,
        explanation: 'The list is the single source of truth. Anything not on it is recognised as unknown, instead of becoming a category of its own that no total would ever include.',
      },
      {
        id: 'programming-fundamentals-57-q2',
        prompt: "Why does suggestCategory compare whole words instead of checking whether the description includes the letters 'pen'?",
        choices: [
          'Splitting is the only way JavaScript can look at a piece of text one part at a time',
          'Whole words make the lookup slower, which gives people time to read the screen',
          "A plain includes check would also match 'pen' inside words like 'spend' and put them under school",
          'Comparing whole words is what lets the program match descriptions that were written in capital letters',
        ],
        answer: 2,
        explanation: "Matching letters inside a longer word finds things you did not mean. Whole-word matching avoids that. Capital letters are handled by toLowerCase, not by splitting.",
      },
      {
        id: 'programming-fundamentals-57-q3',
        prompt: "With this lesson's code, what category is stored for { description: 'Vitamins', amount: 8900, category: 'medicine', date: '2026-11-18' }?",
        choices: ["'health', because the keyword 'vitamins' belongs to health", "'medicine', because that is the category that was given", "'vitamins', because the description is used when it is a keyword", "'other', because 'medicine' is not on the CATEGORIES list"],
        answer: 3,
        explanation: "A category was given, so no suggestion is made. pickCategory checks it against CATEGORIES, does not find 'medicine', and falls back to 'other'.",
      },
      {
        id: 'programming-fundamentals-57-q4',
        prompt: 'addExpense receives the list as its first parameter instead of using a list defined somewhere else. What is the benefit?',
        choices: [
          'Parameters are faster for the computer to read than variables that are defined outside the function itself',
          'Everything the function uses is visible in its call, so it is easy to test with a small list',
          'JavaScript requires every function that uses an array to receive the array as a parameter',
          'It stops the function from adding anything to the list, which keeps the data safe',
        ],
        answer: 1,
        explanation: 'Passing the list in makes the inputs explicit, in line with the scope lesson: nothing hidden, easy to try with a list of two items. It does not make the function faster, nor is it required.',
      },
      {
        id: 'programming-fundamentals-57-q5',
        audience: { max: 'beginner' },
        prompt: "What does description.trim() do to the text '  Lunch at the canteen '?",
        choices: [
          "It removes the spaces at the start and at the end, leaving 'Lunch at the canteen'",
          "It cuts the text down to just its first word, so only 'Lunch' is left over afterwards",
          'It changes every letter to lowercase so that matching is easier later',
          "It removes every single space in the text, giving the one long word 'Lunchatthecanteen'",
        ],
        answer: 0,
        explanation: 'trim only removes whitespace from both ends. Spaces between words stay, which is why the description can still be split into words later.',
      },
      {
        id: 'programming-fundamentals-57-q6',
        audience: { min: 'advanced' },
        prompt: 'Users report that the keyword table misfiles some real descriptions. What is the most sensible next step?',
        choices: [
          'Replace it with a machine-learning classifier straight away, because tables cannot be improved and models always do better',
          'Remove the suggestion feature entirely, since a wrong suggestion is worse than having no suggestion at all',
          'Add hundreds of keywords from memory until no description is ever misfiled',
          'Add the misfiled descriptions as tests and extend the table until they pass; consider a model only if that fails',
        ],
        answer: 3,
        explanation: 'Real misfires become regression tests, and the cheapest fix that passes them wins. A model adds cost and its own failure modes, so it needs evidence that the table has hit its limit.',
      },
    ],
    task: {
      title: 'Build the first layer of your tracker',
      steps: [
        'Type steps 1 to 4 into one file (do not copy and paste: typing makes you read each line), then add the try-it code and run it.',
        'Add three expenses of your own with real amounts in centavos, one with a category given and two without.',
        'Add two keywords of your own to each category in KEYWORDS, and check that a description that uses one of them is categorised.',
        "Try 'Rice, please' and 'rice please'. Write one sentence about why the results differ and what you would change to fix it.",
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['After each step, run the file and read the output before you add more. If something fails, compare your line to the lesson one character at a time.'] },
      { audience: { min: 'advanced' }, steps: ['Write a pure variant of addExpense that returns a new array instead of pushing, and list one advantage and one cost of each style for this project.'] },
    ],
  },
  {
    id: 'programming-fundamentals-58',
    day: 58,
    title: 'Store, Display and Total Expenses',
    summary: 'Keep every expense in one array, print them as readable lines, and add them up in total, by category and as the biggest.',
    intro: {
      objectives: [
        'Keep all expenses in one array and print them as readable lines',
        'Write totalOf and totalByCategory with the accumulator pattern',
        'Handle an empty list on purpose in totals and in biggestExpense',
      ],
      why: 'A tracker is useful because of what it tells you: how much, on what, and which purchase hurt most. These three functions are the same loop-and-accumulate pattern that most reports in real software are built from.',
    },
    minutes: 25,
    skills: ['build-project', 'data-structures'],
    body: [
      { type: 'paragraph', text: "Lesson 57 can add expenses, but nothing yet shows them or counts them. This lesson adds the middle of the tracker: the array that holds the expenses, the functions that print them, and the functions that total them. You keep the same file and add the new functions below the ones you already have." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Think of the ledger page of a small shop. Each sale is a line written in the order it happened. At the bottom of the page the owner writes the page total. In the margin she keeps a tally for each kind of item: how much was food, how much was load. To find the biggest sale of the day she runs a finger down the amounts, remembering the largest so far." },
      { type: 'paragraph', text: "Each of those habits is a function in the tracker. The picture stops here: a person can glance at a page and see at once that it is empty. A program must be told explicitly what to do with an empty list." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "**The array is the one place the data lives.** Every function reads the same array of expense objects, and nothing keeps its own private copy. If the array is right, every display and every total is right." },
      { type: 'paragraph', text: "**Formatting is separate from printing.** formatExpense turns one expense into a line of text and returns it. listExpenses is the only function that prints. A function that returns text can be reused for a report, for a test, or later for a screen. A function that prints can only print." },
      { type: 'paragraph', text: "**An accumulator builds a result.** totalOf creates a variable with a known starting value, 0, and visits every expense, adding its amount. This is the pattern from the loops module: start, update on each turn, use at the end. totalByCategory does the same for several totals at once, held in an object with one key for each category." },
      { type: 'paragraph', text: "**Start every total at zero.** totalByCategory first gives every category in CATEGORIES a total of 0. Then adding an amount always has a number to add to. Without that, the first expense of a category would add to undefined, and the answer would be NaN. It also means a category with no expenses shows 0 rather than being missing." },
      { type: 'paragraph', text: "**Decide what an empty list means.** The total of nothing is 0, which falls out of the accumulator for free. The biggest of nothing is different: there is no biggest, and returning 0 would pretend an expense of zero exists. biggestExpense returns null, which says 'no answer', and the caller must check before using it." },
      { type: 'paragraph', text: "**Money stays in centavos until the last moment.** Whole centavos add exactly. Dividing by 100 happens only when text is made for a person, in formatPeso. toFixed(2) rounds a number to two decimal places and returns text, so 24.5 becomes '24.50'." },
      { type: 'code', language: 'javascript', label: 'why centavos', code: `console.log(0.1 + 0.2);
console.log(10 + 20);
console.log((2450 / 100).toFixed(2));` },
      { type: 'code', language: 'text', label: 'output', code: `0.30000000000000004
30
24.50` },
      { type: 'paragraph', text: "The first line shows the problem with decimals: 0.1 + 0.2 is not exactly 0.3. The second shows that 10 + 20 whole centavos is exactly 30. The third turns 2450 centavos into the text shown to a person." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: an accumulator is a variable you start at a known value and update on each turn of a loop, like a running tally on a notepad. We start totals at 0 because nothing has been counted yet. null is a value that means 'there is nothing here on purpose', which is different from a number such as 0. And we keep money as whole centavos because computers store decimal fractions approximately, and a tiny error in every addition would eventually show up in a total.",
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "Add these functions to your file. First, turning an expense into text." },
      { type: 'code', language: 'javascript', label: 'step 1: formatting', code: `function formatPeso(centavos) {
  return \`PHP \${(centavos / 100).toFixed(2)}\`;
}

function formatExpense(expense) {
  return \`\${expense.date} | \${expense.description} | \${expense.category} | \${formatPeso(expense.amount)}\`;
}` },
      { type: 'paragraph', text: "Step 2: print the list, or say that it is empty." },
      { type: 'code', language: 'javascript', label: 'step 2: listExpenses', code: `function listExpenses(expenses) {
  if (expenses.length === 0) {
    console.log('No expenses yet.');
    return;
  }
  for (const expense of expenses) {
    console.log(formatExpense(expense));
  }
}` },
      { type: 'paragraph', text: "Step 3: the total of a list." },
      { type: 'code', language: 'javascript', label: 'step 3: totalOf', code: `function totalOf(expenses) {
  let total = 0;
  for (const expense of expenses) {
    total += expense.amount;
  }
  return total;
}` },
      { type: 'paragraph', text: "Step 4: one total for each category." },
      { type: 'code', language: 'javascript', label: 'step 4: totalByCategory', code: `function totalByCategory(expenses) {
  const totals = {};
  for (const category of CATEGORIES) {
    totals[category] = 0;
  }
  for (const expense of expenses) {
    totals[expense.category] += expense.amount;
  }
  return totals;
}` },
      { type: 'paragraph', text: "Step 5: the biggest expense." },
      { type: 'code', language: 'javascript', label: 'step 5: biggestExpense', code: `function biggestExpense(expenses) {
  if (expenses.length === 0) {
    return null;
  }
  let biggest = expenses[0];
  for (const expense of expenses) {
    if (expense.amount > biggest.amount) {
      biggest = expense;
    }
  }
  return biggest;
}` },
      { type: 'paragraph', text: "Step 6: replace the try-it code from lesson 57 with this one, which stores eight expenses and uses every new function." },
      { type: 'code', language: 'javascript', label: 'step 6: try it', code: `const expenses = [];
addExpense(expenses, { description: 'Jeepney fare', amount: 2400, date: '2026-11-16' });
addExpense(expenses, { description: 'Lunch at the canteen', amount: 6500, date: '2026-11-16' });
addExpense(expenses, { description: 'Mobile load', amount: 10000, date: '2026-11-17' });
addExpense(expenses, { description: 'Notebook and pen', amount: 4500, category: 'school', date: '2026-11-17' });
addExpense(expenses, { description: 'Rice and eggs', amount: 12050, date: '2026-11-18' });
addExpense(expenses, { description: 'Tricycle fare', amount: 3000, date: '2026-10-30' });
addExpense(expenses, { description: 'Electric bill', amount: 185000, date: '2026-10-28' });
addExpense(expenses, { description: 'Mystery gift', amount: 15000, date: '2026-11-18' });

listExpenses(expenses);
console.log('Total:', formatPeso(totalOf(expenses)));
console.log(totalByCategory(expenses));
const biggest = biggestExpense(expenses);
console.log('Biggest:', biggest.description, formatPeso(biggest.amount));
console.log(totalOf([]), biggestExpense([]));
listExpenses([]);` },
      { type: 'code', language: 'text', label: 'output', code: `2026-11-16 | Jeepney fare | transport | PHP 24.00
2026-11-16 | Lunch at the canteen | food | PHP 65.00
2026-11-17 | Mobile load | bills | PHP 100.00
2026-11-17 | Notebook and pen | school | PHP 45.00
2026-11-18 | Rice and eggs | food | PHP 120.50
2026-10-30 | Tricycle fare | transport | PHP 30.00
2026-10-28 | Electric bill | bills | PHP 1850.00
2026-11-18 | Mystery gift | other | PHP 150.00
Total: PHP 2384.50
{
  food: 18550,
  transport: 5400,
  bills: 195000,
  school: 4500,
  health: 0,
  other: 15000
}
Biggest: Electric bill PHP 1850.00
0 null
No expenses yet.` },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**formatPeso** divides the centavos by 100 and rounds to two decimals with toFixed(2), then puts PHP in front. **formatExpense** joins the four fields with a bar.',
          '**listExpenses** has a guard at the top. For an empty list it prints a message and uses return to leave at once. Otherwise it prints one formatted line per expense.',
          '**totalOf** starts at 0, adds each amount with +=, and returns the total after the loop.',
          '**totalByCategory** makes an empty object, gives every category the value 0, then adds each expense\'s amount to the key named by its category. The square brackets let a variable pick the key.',
          '**biggestExpense** returns null for an empty list. Otherwise it assumes the first expense is the biggest and replaces it whenever it finds a larger amount.',
          '**The last two lines of the demo** show the empty cases: the total of an empty list is 0, the biggest is null, and listing it prints the message.',
        ],
      },
      { type: 'paragraph', text: "A trace of totalOf for amounts 2400, 6500 and 12050 shows the accumulator at work:" },
      {
        type: 'table',
        headers: ['Turn', 'expense.amount', 'total before', 'total after'],
        rows: [
          ['start', '-', '-', '0'],
          ['1', '2400', '0', '2400'],
          ['2', '6500', '2400', '8900'],
          ['3', '12050', '8900', '20950'],
        ],
        caption: 'After the loop the function returns 20950.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Each function is a single linear pass, so a report that calls totalOf, totalByCategory and biggestExpense walks the list three times. For thousands of expenses that is far below anything a user could notice, and three small functions are easier to test than one clever loop, so measure before merging. The design choices worth defending in review are the sentinel for empty input (null for biggest, 0 for sum, matching their natural identities), keeping formatting pure, and the zero-initialised object that turns an unknown category into NaN instead of a silent new key, which is exactly why lesson 59 validates categories at the door. Float formatting is safe here only because the input is an integer number of centavos.",
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'prompt', label: 'Trace it with me', text: "Here is a JavaScript function from my expense tracker:\n\n[paste totalByCategory]\n\nDo not explain it to me. Instead, give me a small list of three expenses and ask me to write down the value of the totals object after each turn of the loop. Check my answer after I give it, and only then tell me where I went wrong." },
      { type: 'prompt', label: 'What happens with strange input?', text: "Without changing my code, tell me what totalOf, totalByCategory and biggestExpense would do for these inputs: an empty list, one expense, and an expense whose category is not in my CATEGORIES list. Then ask me which of the three results I would call a bug." },
      { type: 'paragraph', text: "What to look for: run each strange input yourself. An assistant can describe the third case wrongly, because it depends on exactly how the totals object is set up. Notice the answer for the unknown category: the total becomes NaN. That is the kind of silent wrongness that lesson 59 prevents." },
      {
        type: 'takeaways',
        items: [
          'Keep the data in one array and let every function read it, so every display and total agrees.',
          'Separate formatting (returns text) from printing (console.log) so the formatting can be reused and tested.',
          'An accumulator starts at a known value, updates on every turn, and is returned after the loop.',
          'Start every category at 0, and decide on purpose what an empty list returns: 0 for a total, null for a biggest.',
          'Keep money in whole centavos and convert to pesos only when making text.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-58-predict-output-1',
          kind: 'predict-output',
          language: 'javascript',
          title: 'What do the totals hold?',
          prompt: 'Predict the three lines this loop prints.',
          concept: 'accumulating by category',
          code: `const expenses = [
  { category: 'food', amount: 6500 },
  { category: 'transport', amount: 2400 },
  { category: 'food', amount: 12050 },
];
const totals = { food: 0, transport: 0 };

for (const expense of expenses) {
  totals[expense.category] += expense.amount;
}

console.log(totals.food);
console.log(totals.transport);
console.log(totals.food + totals.transport);`,
          choices: ['6500\n2400\n8900', '18550\n2400\n20950', '12050\n2400\n14450', '18550\n2400\n18550'],
          wrongNotes: {
            '6500\n2400\n8900': 'There are two food expenses, and the loop visits both. Both amounts are added to food.',
            '12050\n2400\n14450': 'The += adds each food amount to the total so far. It does not replace it with the latest amount.',
            '18550\n2400\n18550': 'The third line adds food and transport together, which is the sum of the first two lines.',
          },
          hints: ['There are two food expenses and one transport expense.', 'Food adds 6500 then 12050 to its own starting 0.', 'The last line is food plus transport.'],
          explanation: 'Food collects 6500 and then 12050, giving 18550. Transport gets 2400. The third line adds the two totals, 18550 + 2400 = 20950.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-58-fill-blank-1',
          kind: 'fill-blank',
          language: 'javascript',
          title: 'Trace the accumulator',
          prompt: 'Each comment names the value of total after that line. Type the three values, then check that the program prints the last one.',
          concept: 'tracing a variable',
          code: `let total = 0;
total += 2400;     // total is now ___
total += 6500;     // total is now ___
total += 12050;    // total is now ___
console.log(total);`,
          blanks: [
            { answers: ['2400'], feedback: 'total started at 0, and 0 + 2400 is 2400.' },
            { answers: ['8900'], feedback: 'Take the previous total, 2400, and add 6500.' },
            { answers: ['20950'], feedback: 'Take the previous total, 8900, and add 12050.' },
          ],
          tests: { kind: 'output', expected: ['20950'] },
          hints: ['total starts at 0, and each += adds to what is already there.', 'The first line gives 0 + 2400. The second adds 6500 to that result.', '2400, then 2400 + 6500 = 8900, then 8900 + 12050.'],
          explanation: 'Each += builds on the value left by the line before it: 2400, then 8900, then 20950. This is the same column of numbers as in the trace table.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-58-fix-bug-1',
          kind: 'fix-bug',
          language: 'javascript',
          title: 'The biggest that was the smallest',
          prompt: "biggestExpense should print 'Electric bill', the largest amount, but it prints the smallest. Tap the faulty line and choose the fix.",
          concept: 'comparing in a loop',
          code: `function biggestExpense(expenses) {
  if (expenses.length === 0) {
    return null;
  }
  let biggest = expenses[0];
  for (const expense of expenses) {
    if (expense.amount < biggest.amount) {
      biggest = expense;
    }
  }
  return biggest;
}

const list = [
  { description: 'Jeepney fare', amount: 2400 },
  { description: 'Electric bill', amount: 185000 },
  { description: 'Lunch', amount: 6500 },
];
console.log(biggestExpense(list).description);
console.log(biggestExpense([]));`,
          bugLine: 7,
          fixes: [
            { line: 'if (expense.amount > biggest.amount) {', correct: true, why: 'The biggest so far is replaced only when the expense being checked is larger.' },
            { line: 'if (expense.amount === biggest.amount) {', correct: false, why: 'That only reacts to equal amounts, so the first expense stays the answer for ever.' },
            { line: 'if (expense.amount !== biggest.amount) {', correct: false, why: 'That replaces the answer with almost every expense, so the last different one wins whatever its size.' },
            { line: 'if (expense.amount <= biggest.amount) {', correct: false, why: 'That still hunts for smaller amounts, so it finds the smallest, not the biggest.' },
          ],
          tests: { kind: 'output', expected: ['Electric bill', 'null'] },
          lineNote: 'Find the line that decides whether the expense being checked should replace the best one so far.',
          hints: ['The function is keeping the smallest instead of the biggest. Which line chooses?', 'The comparison inside the loop decides whether to replace the current answer.', 'Replace the answer when the new amount is greater than the current one.'],
          explanation: 'With < the loop keeps swapping to ever smaller amounts. Switching to > replaces the answer only when a larger amount is found, so the electric bill wins.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-58-scenario-1',
          kind: 'scenario',
          title: 'The biggest of nothing',
          situation: 'You are writing biggestExpense. A new user opens the tracker before adding anything, so the list is empty, and the report asks for the biggest expense.',
          prompt: 'What should the function do for an empty list?',
          concept: 'empty cases',
          options: [
            { text: 'Return null, and let the report check for it before printing anything.', consequence: 'The result clearly says there is no answer. The report prints nothing for the biggest, and no wrong number ever appears.', quality: 'best' },
            { text: "Print 'No expenses' from inside biggestExpense and return nothing.", consequence: 'It works for this one report, but a function that decides what to print cannot be reused for a test or a screen, and the caller still has to handle the missing result.', quality: 'acceptable' },
            { text: 'Start from expenses[0] without checking, because the list will usually have something in it.', consequence: 'On an empty list expenses[0] is undefined, and reading its amount stops the program with an error the first time anyone opens the tracker.', quality: 'poor' },
          ],
          hints: ['What does the report need to know when there is no biggest expense?', 'A function that calculates should hand back a value and leave the printing to someone else.', 'A value that means there is no answer, as opposed to the answer 0, is the safest.'],
          explanation: 'null states plainly that there is no biggest expense, and it keeps calculating and printing apart. The edge case is handled in one place, and the caller decides what to show.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-58-q1',
        prompt: 'totalByCategory first sets the total of every category in CATEGORIES to 0. Why?',
        choices: [
          'JavaScript objects cannot be used until each one of their keys has first been given the number 0 by the programmer',
          'It makes the function faster because the keys are created in advance for the computer',
          'It makes the totals appear in alphabetical order when the object is printed',
          'Adding an amount then always has a number to add to, and a category with no expenses still shows 0',
        ],
        answer: 3,
        explanation: 'Adding to a key that does not exist would add to undefined and give NaN. Starting at 0 makes every key ready and lets an unused category show 0.',
      },
      {
        id: 'programming-fundamentals-58-q2',
        prompt: 'biggestExpense([]) returns null. Why is that better than returning 0?',
        choices: [
          'A function that loops over an array is never allowed to return the number 0 in any situation at all',
          'It says plainly that there is no expense, while 0 would look like a real expense of nothing',
          'null takes less memory than the number 0, which matters when the list is empty',
          'The report cannot print a number, so only a null result will work there',
        ],
        answer: 1,
        explanation: 'null means no answer, so nobody mistakes it for data. A 0 could flow into a later calculation as if an expense of 0 centavos existed.',
      },
      {
        id: 'programming-fundamentals-58-q3',
        prompt: 'A teammate starts totalOf with `let total = expenses[0].amount;` and then loops over every expense. What goes wrong?',
        choices: [
          'Nothing goes wrong: starting at the first amount saves one step and the total is identical',
          'The loop skips the first expense, so the total is smaller than it should be',
          'The first amount is counted twice, and an empty list stops the program with an error',
          'The total becomes text, because the first amount was read from inside an object',
        ],
        answer: 2,
        explanation: 'The loop adds every expense, including the first, to a total that already holds the first amount. An empty list has no expenses[0], so reading its amount raises an error.',
      },
      {
        id: 'programming-fundamentals-58-q4',
        prompt: "Which expression turns 2450 centavos into the text 'PHP 24.50'?",
        choices: [
          '`PHP ${(2450 / 100).toFixed(2)}`',
          '`PHP ${2450 / 100}`',
          '`PHP ${2450 * 100}.00`',
          '`PHP ${(2450).toFixed(2) + ".00"}`',
        ],
        answer: 0,
        explanation: 'Dividing by 100 gives 24.5, and toFixed(2) pads it to 24.50. Without toFixed the text is PHP 24.5, and without the division it is PHP 2450.00.',
      },
      {
        id: 'programming-fundamentals-58-q5',
        audience: { max: 'beginner' },
        prompt: 'What is an accumulator, as in the total of a list?',
        choices: [
          'A function built into JavaScript that adds numbers together for you',
          'A variable that starts at a known value and is updated on each turn of a loop',
          'A loop that keeps going again and again until the person using the program presses a key',
          'A list that stores every expense that has ever been added to the tracker',
        ],
        answer: 1,
        explanation: 'An accumulator is just a variable used as a running tally: it starts at a known value, each turn of the loop updates it, and after the loop it holds the result.',
      },
      {
        id: 'programming-fundamentals-58-q6',
        audience: { min: 'advanced' },
        prompt: 'The report calls totalOf, totalByCategory and biggestExpense on the same list, so it walks the list three times. What is the best response?',
        choices: [
          'Merge them into one loop now, because three passes triple the time into something users will notice',
          'Cache the results for good so the totals never have to be calculated again, even after changes',
          'Keep the three clear functions: they are cheap even for thousands of expenses, so measure first',
          'Sort the list first so that every total can be found in constant time',
        ],
        answer: 2,
        explanation: 'Three linear passes are cheap, and separate functions are simpler to test and read. Optimising without a measurement trades clarity for a gain nobody can see. Permanent caching goes stale when the list changes.',
      },
    ],
    task: {
      title: 'Add storing, display and totals',
      steps: [
        'Add the five new functions to your file and replace the try-it code with the lesson 58 version. Run it and compare each line with the output shown.',
        'Add three more expenses of your own, including one in a category that had none, and check that the totals change as you expect.',
        'Call totalOf, listExpenses and biggestExpense on an empty array [] and write down what each one does.',
        'Add a new category to CATEGORIES and to KEYWORDS, and see that totalByCategory shows it with no other change.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before you run the demo, write down on paper what you expect totalOf to give for your own list. Then run it and compare.'] },
      { audience: { min: 'advanced' }, steps: ['Write smallestExpense and averageExpense in the same style, decide what each returns for an empty list, and justify the choice in one sentence.'] },
    ],
  },
  {
    id: 'programming-fundamentals-59',
    day: 59,
    title: 'Filter Expenses, Validate Input and Handle Invalid Values',
    summary: 'Show only the expenses you want, and make the tracker refuse a bad expense with clear messages instead of storing it.',
    intro: {
      objectives: [
        'Write filterByCategory and filterByMonth so they return new arrays and leave the original alone',
        'Write validateExpense to return every problem as a list of messages',
        'Test the edge cases: empty values, zero, negatives, wrong types and impossible dates',
      ],
      why: 'Real input is messy: typos, blanks, a date that does not exist. A program that stores whatever it is given produces wrong totals without any sign of a problem, which is the worst kind of bug. Checking input at the door is a habit that carries into every program you build or review.',
    },
    minutes: 30,
    skills: ['build-project', 'debug-test'],
    body: [
      { type: 'paragraph', text: "So far the tracker trusts everyone. It will happily store an amount of -50, a description of spaces, or a date of 2026-02-30, and then every total that includes them is quietly wrong. This lesson adds two things. Filters let you look at part of the list, such as one month or one category, and validation decides whether an expense is acceptable before it is stored. You keep adding to the same file, and one function from lesson 57 changes." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Picture the clerk who checks an enrolment form at a school. She does not stop at the first missing signature. She circles everything wrong, hands the form back, and says: fix these three things. A form with nothing circled is stamped and filed. Nobody has to re-check it later, because the checking happened at the door." },
      { type: 'paragraph', text: "validateExpense is that clerk. The picture stops at one point: a clerk can use judgement about a smudged date, while the program applies exactly the rules you wrote. Every rule has to be written down, including the dull ones." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "**Filters make a new array.** filterByCategory and filterByMonth loop through the list and push the matching expenses into a fresh array. The original list is never changed. That is what lets you filter by month, then filter that result by category, and still total the whole list afterwards. The month check uses the date's first seven characters: slice(0, 7) of '2026-11-16' is '2026-11'." },
      { type: 'paragraph', text: "**Validate at the door, and report every problem.** validateExpense does not store anything. It looks at one input and returns an array of messages, one per problem. An empty array means the expense is fine. Returning every message, instead of stopping at the first, lets a person fix everything in one go." },
      { type: 'paragraph', text: "**Know what to check.** Each field has its own rules, and the edge cases are the interesting part: values that are empty, zero, negative, the wrong type, or impossible." },
      {
        type: 'table',
        headers: ['Input', 'Problem', 'Message'],
        rows: [
          ["description '   ' (only spaces)", 'blank once trimmed', 'Description is required.'],
          ['amount 0 or -50', 'not above zero', 'Amount must be a whole number of centavos above zero.'],
          ['amount 12.5 or the text "100"', 'not a whole number', 'The same amount message.'],
          ["category 'foood'", 'not on the list', 'Unknown category, with the allowed ones listed.'],
          ["date '2026-02-30' or '2026-1-5'", 'not a real date, or the wrong shape', 'Date must be a real date written like 2026-11-16.'],
          ['null instead of an expense', 'not even an object', 'An expense must be an object.'],
        ],
        caption: 'Edge cases for the tracker. The first four rows are all things a person could type by accident.',
      },
      { type: 'paragraph', text: "**A real date needs a calendar.** To accept a date, the text must be exactly ten characters with dashes in the right places, the three parts must be digits, the month must be 1 to 12, and the day must exist in that month. A month has 28, 29, 30 or 31 days, and February has 29 in a leap year: one divisible by 4, except years divisible by 100 that are not divisible by 400. The functions isLeapYear, daysInMonth and isDigits each answer one small question, and isValidDate combines them." },
      { type: 'paragraph', text: "**Decide: refuse or repair?** Lesson 57 repaired an unknown category by turning it into 'other'. For money records that hides typos: a person who typed 'foood' is never told and the total of food is wrong. Now the tracker refuses it with a message. addExpense changes in two ways. It calls validateExpense first, and it returns an object: { ok: false, errors } when refused, or { ok: true, expense } when stored. It must check before it builds the expense, because building calls input.description.trim(), which would stop the program with an error if the description were a number." },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'validateExpense never stops at the first problem: every check runs, and each failure adds a message.',
        source: `flowchart TD
  A(Start) --> B[Make an empty list of errors]
  B --> C{Is the description missing or blank?}
  C -->|yes| D[Add the description message]
  C -->|no| E{Is the amount a whole number above zero?}
  D --> E
  E -->|no| F[Add the amount message]
  E -->|yes| G{Is a given category missing from the list?}
  F --> G
  G -->|yes| H[Add the category message]
  G -->|no| I{Is the date a real date?}
  H --> I
  I -->|no| J[Add the date message]
  I -->|yes| K[Give back the list of errors]
  J --> K
  K --> L(End)`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: validating means checking that something is acceptable before using it. An error message is a sentence that tells the person what to change. A filter is a question put to every item, keeping the ones whose answer is yes. We build a new list rather than removing items from the old one, so that the original is still complete. And a leap year is just a year when February gets a 29th day, which is why the calendar needs a small rule: the computer does not know it unless we tell it.",
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "Step 1: the two filters. Add them below your totals." },
      { type: 'code', language: 'javascript', label: 'step 1: filters', code: `function filterByCategory(expenses, category) {
  const matches = [];
  for (const expense of expenses) {
    if (expense.category === category) {
      matches.push(expense);
    }
  }
  return matches;
}

function filterByMonth(expenses, month) {
  const matches = [];
  for (const expense of expenses) {
    if (expense.date.slice(0, 7) === month) {
      matches.push(expense);
    }
  }
  return matches;
}` },
      { type: 'paragraph', text: "Step 2: the calendar helpers. The % operator gives the remainder, so year % 4 === 0 means divisible by 4. A ternary (cond ? a : b) picks one of two values; here it chooses 29 or 28." },
      { type: 'code', language: 'javascript', label: 'step 2: leap years and month lengths', code: `function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year, month) {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    return 30;
  }
  return 31;
}` },
      { type: 'paragraph', text: "Step 3: a function that says whether a piece of text is made only of digits." },
      { type: 'code', language: 'javascript', label: 'step 3: isDigits', code: `function isDigits(text) {
  if (text.length === 0) {
    return false;
  }
  for (const character of text) {
    if (!'0123456789'.includes(character)) {
      return false;
    }
  }
  return true;
}` },
      { type: 'paragraph', text: "Step 4: put the checks together. typeof gives the type of a value as text, such as 'string'. Each early return leaves the function as soon as the answer is known." },
      { type: 'code', language: 'javascript', label: 'step 4: isValidDate', code: `function isValidDate(text) {
  if (typeof text !== 'string' || text.length !== 10) {
    return false;
  }
  if (text[4] !== '-' || text[7] !== '-') {
    return false;
  }
  const yearText = text.slice(0, 4);
  const monthText = text.slice(5, 7);
  const dayText = text.slice(8, 10);
  if (!isDigits(yearText) || !isDigits(monthText) || !isDigits(dayText)) {
    return false;
  }
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (month < 1 || month > 12) {
    return false;
  }
  return day >= 1 && day <= daysInMonth(year, month);
}` },
      { type: 'paragraph', text: "Step 5: the clerk. join turns an array into one text with the pieces separated by what you give it." },
      { type: 'code', language: 'javascript', label: 'step 5: validateExpense', code: `function validateExpense(input) {
  if (typeof input !== 'object' || input === null) {
    return ['An expense must be an object with a description, amount and date.'];
  }
  const errors = [];
  if (typeof input.description !== 'string' || input.description.trim() === '') {
    errors.push('Description is required.');
  }
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    errors.push('Amount must be a whole number of centavos above zero.');
  }
  if (input.category !== undefined && !CATEGORIES.includes(input.category)) {
    errors.push(\`Unknown category "\${input.category}". Use one of: \${CATEGORIES.join(', ')}.\`);
  }
  if (!isValidDate(input.date)) {
    errors.push('Date must be a real date written like 2026-11-16.');
  }
  return errors;
}` },
      { type: 'paragraph', text: "Step 6: replace addExpense from lesson 57 with this version. It can sit where the old one was: JavaScript reads all function declarations before it runs, so the order in the file matters to the reader, not the computer." },
      { type: 'code', language: 'javascript', label: 'step 6: addExpense, now checking first', code: `function addExpense(expenses, input) {
  const errors = validateExpense(input);
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  const expense = {
    description: input.description.trim(),
    amount: input.amount,
    category: pickCategory(input.description, input.category),
    date: input.date,
  };
  expenses.push(expense);
  return { ok: true, expense };
}` },
      { type: 'paragraph', text: "Step 7: try it. This replaces the lesson 58 try-it code." },
      { type: 'code', language: 'javascript', label: 'step 7: try it', code: `const expenses = [];
addExpense(expenses, { description: 'Jeepney fare', amount: 2400, date: '2026-11-16' });
addExpense(expenses, { description: 'Lunch at the canteen', amount: 6500, date: '2026-11-16' });
addExpense(expenses, { description: 'Mobile load', amount: 10000, date: '2026-11-17' });
addExpense(expenses, { description: 'Notebook and pen', amount: 4500, category: 'school', date: '2026-11-17' });
addExpense(expenses, { description: 'Rice and eggs', amount: 12050, date: '2026-11-18' });
addExpense(expenses, { description: 'Tricycle fare', amount: 3000, date: '2026-10-30' });
addExpense(expenses, { description: 'Electric bill', amount: 185000, date: '2026-10-28' });
addExpense(expenses, { description: 'Mystery gift', amount: 15000, date: '2026-11-18' });

console.log('November:');
listExpenses(filterByMonth(expenses, '2026-11'));
console.log('Food:', formatPeso(totalOf(filterByCategory(expenses, 'food'))));
console.log('Bills in October:', formatPeso(totalOf(filterByCategory(filterByMonth(expenses, '2026-10'), 'bills'))));

const bad = addExpense(expenses, { description: '   ', amount: -50, category: 'foood', date: '2026-02-30' });
console.log(bad.ok);
for (const message of bad.errors) {
  console.log(message);
}
console.log(addExpense(expenses, null).errors);
console.log(addExpense(expenses, { description: 'Coffee', amount: 12.5, date: '2026-11-18' }).errors);
console.log(isValidDate('2028-02-29'), isValidDate('2026-02-29'), isValidDate('2026-1-05'), isValidDate(' 2026-11-0'), isValidDate(20261116));
console.log(expenses.length);` },
      { type: 'code', language: 'text', label: 'output', code: `November:
2026-11-16 | Jeepney fare | transport | PHP 24.00
2026-11-16 | Lunch at the canteen | food | PHP 65.00
2026-11-17 | Mobile load | bills | PHP 100.00
2026-11-17 | Notebook and pen | school | PHP 45.00
2026-11-18 | Rice and eggs | food | PHP 120.50
2026-11-18 | Mystery gift | other | PHP 150.00
Food: PHP 185.50
Bills in October: PHP 1850.00
false
Description is required.
Amount must be a whole number of centavos above zero.
Unknown category "foood". Use one of: food, transport, bills, school, health, other.
Date must be a real date written like 2026-11-16.
[ 'An expense must be an object with a description, amount and date.' ]
[ 'Amount must be a whole number of centavos above zero.' ]
true false false false false
8` },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**filterByCategory** and **filterByMonth** make an empty array, push each expense that passes the test, and return it. Filtering twice means passing the result of one into the other, as the last lines of the try-it code do for October bills.',
          '**daysInMonth** gives 29 or 28 for February, 30 for April, June, September and November, and 31 otherwise.',
          '**isDigits** returns false for empty text, then checks each character against the string of digits.',
          '**isValidDate** returns false at the first rule that fails (not text, wrong length, dashes missing, not digits, month out of range) and finally checks the day against daysInMonth. Returning early means each rule is easy to read.',
          '**validateExpense** guards against a missing object first. Then four ifs each add one message to the errors array. The category check applies only if a category was given.',
          '**addExpense** returns early with the errors when there are any. Otherwise it stores the expense as before and returns it inside a result object.',
        ],
      },
      { type: 'paragraph', text: "Here is isValidDate traced for '2026-02-30', a date that looks right but does not exist:" },
      {
        type: 'table',
        headers: ['Check', 'Result for 2026-02-30'],
        rows: [
          ['text with ten characters', 'yes'],
          ['dashes at positions 4 and 7', 'yes'],
          ['year 2026, month 02 and day 30 are all digits', 'yes'],
          ['month between 1 and 12', 'yes, it is 2'],
          ['day between 1 and daysInMonth(2026, 2)', 'no: 2026 is not a leap year, so February has 28 days, and 30 is more than 28'],
        ],
        caption: 'The date is refused at the last check.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Validation belongs at the boundary where data enters. Inner functions such as totalOf can then trust their input, which keeps their code simple and makes the rules testable in one place. Returning an array of messages is a deliberate alternative to throwing: failing validation is an expected outcome, not an exceptional one, and the caller gets every problem. The result object { ok, errors | expense } is a small discriminated union that forces the caller to look at ok. Note what this validator does not do: it does not catch duplicates, future dates, absurdly large amounts, or trim before checking the category. Each is a policy decision, not a bug.",
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'prompt', label: 'Break my validator', text: "Here is the validateExpense function from my expense tracker:\n\n[paste validateExpense and isValidDate]\n\nDo not fix anything and do not write code. List ten test inputs, as short JavaScript objects, that you think could make it behave wrongly or let a bad expense through, with one line saying why for each. I will run them myself and tell you what happened." },
      { type: 'paragraph', text: "What to look for: run every input the assistant suggests and compare its prediction with what your function really does. Some suggestions will be wrong, because the assistant cannot execute your code, and some will find real gaps. Decide for each gap whether it is a bug or a policy choice. For example, accepting a date far in the future may be fine." },
      {
        type: 'takeaways',
        items: [
          'A filter loops through the list and pushes matches into a new array, so the original stays complete and filters can be chained.',
          'Validate once, at the door, before storing, and return every problem as a list of messages.',
          'Test the edge cases on purpose: blank, zero, negative, a non-integer, the wrong type, a missing object and an impossible date.',
          'Refusing bad input is safer than repairing it for money records, because a silent repair hides the mistake.',
          'Check before building: code that reads input.description.trim() fails if the input is not what you expected.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-59-predict-output-1',
          kind: 'predict-output',
          language: 'javascript',
          title: 'Which years are leap years?',
          prompt: 'Predict the four lines this prints. The rule is: divisible by 4, except years divisible by 100 that are not divisible by 400.',
          concept: 'conditions with and, or',
          code: `function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

console.log(isLeapYear(2028));
console.log(isLeapYear(2100));
console.log(isLeapYear(2000));
console.log(isLeapYear(2026));`,
          choices: ['true\ntrue\ntrue\nfalse', 'true\nfalse\ntrue\nfalse', 'true\nfalse\nfalse\nfalse', 'false\nfalse\ntrue\nfalse'],
          wrongNotes: {
            'true\ntrue\ntrue\nfalse': '2100 is divisible by 100 but not by 400, so it is not a leap year.',
            'true\nfalse\nfalse\nfalse': '2000 is divisible by 100, but it is also divisible by 400, which makes it a leap year.',
            'false\nfalse\ntrue\nfalse': '2028 is divisible by 4 and not by 100, so it is a leap year.',
          },
          hints: ['Work out each year against the three divisibility tests, one at a time.', '2100 is divisible by 4 and by 100 but not by 400. 2000 is divisible by all three.', '2028 yes, 2100 no, 2000 yes, 2026 no.'],
          explanation: '2028 is divisible by 4 and not by 100: leap. 2100 is divisible by 100 but not by 400: not leap. 2000 is divisible by 400: leap. 2026 is not divisible by 4: not leap.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-59-fix-bug-1',
          kind: 'fix-bug',
          language: 'javascript',
          title: 'The amount of zero that got through',
          prompt: 'amountError should refuse an amount of 0, so only the amounts 2400 and 1 print true. Right now 0 is accepted. Tap the faulty line and choose the fix.',
          concept: 'validation',
          code: `function amountError(amount) {
  if (!Number.isInteger(amount) || amount < 0) {
    return 'Amount must be a whole number of centavos above zero.';
  }
  return '';
}

console.log(amountError(2400) === '');
console.log(amountError(0) === '');
console.log(amountError(-5) === '');
console.log(amountError(12.5) === '');
console.log(amountError(1) === '');`,
          bugLine: 2,
          fixes: [
            { line: 'if (!Number.isInteger(amount) || amount <= 0) {', correct: true, why: 'An amount must be above zero, so 0 and every negative number are refused as well as non-integers.' },
            { line: 'if (!Number.isInteger(amount) || amount <= 1) {', correct: false, why: 'That also refuses 1 centavo, which is a valid amount.' },
            { line: 'if (!Number.isInteger(amount) || amount === 0) {', correct: false, why: 'That refuses 0 but accepts -5, which should also be refused.' },
            { line: 'if (!Number.isInteger(amount) || amount <= 2400) {', correct: false, why: 'That refuses every amount up to 2400, including 2400 itself.' },
          ],
          tests: { kind: 'output', expected: ['true', 'false', 'false', 'false', 'true'] },
          lineNote: 'The rule for what counts as a bad amount sits in the if line.',
          hints: ['Which amounts are accepted that should not be? Look at the boundary.', 'The condition uses < 0, so 0 itself is not caught. Is 0 above zero?', 'Use <= 0 so that zero and everything below it is refused.'],
          explanation: 'The boundary is the classic place for a bug: < 0 refuses only negatives, while the rule says above zero. Changing it to <= 0 refuses zero too, and 1 centavo still passes.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-59-fill-blank-1',
          kind: 'fill-blank',
          language: 'javascript',
          title: 'Finish filterByMonth',
          prompt: 'Fill the blanks: take the first seven characters of the date, add the matching expense to the new array, and return the array.',
          concept: 'filtering into a new array',
          code: `function filterByMonth(expenses, month) {
  const matches = [];
  for (const expense of expenses) {
    if (expense.date.___(0, 7) === month) {
      matches.___(expense);
    }
  }
  return ___;
}

const list = [{ date: '2026-11-16' }, { date: '2026-10-30' }, { date: '2026-11-02' }];
console.log(filterByMonth(list, '2026-11').length);`,
          blanks: [
            { answers: ['slice'], feedback: 'slice(0, 7) takes characters from position 0 up to, but not including, 7.' },
            { answers: ['push'], feedback: 'push adds one item to the end of an array.' },
            { answers: ['matches'], feedback: 'The function should give back the new array it built, not the original list.' },
          ],
          bank: ['slice', 'push', 'matches', 'expenses', 'splice', 'pop'],
          tests: { kind: 'output', expected: ['2'] },
          hints: ['The first blank is a method that takes a part of a text.', 'The second blank adds to the end of an array.', 'After the loop, return the array that holds the matches.'],
          explanation: "slice(0, 7) of '2026-11-16' is '2026-11'. Each match is pushed into matches, and the function returns matches. Two of the three dates are in November, so the length printed is 2.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-59-code-challenge-1',
          kind: 'code-challenge',
          language: 'javascript',
          title: 'Write isValidAmount',
          prompt: 'Write isValidAmount(amount). It returns true only when amount is a whole number above zero, and false for everything else, including text such as "100".',
          concept: 'validation',
          starter: `function isValidAmount(amount) {
  // true only for a whole number of centavos above zero
}`,
          solution: `function isValidAmount(amount) {
  return Number.isInteger(amount) && amount > 0;
}`,
          tests: {
            kind: 'function',
            fn: 'isValidAmount',
            cases: [
              { label: 'a normal amount', args: [2400], expected: true },
              { label: 'one centavo', args: [1], expected: true },
              { label: 'zero', args: [0], expected: false },
              { label: 'negative', args: [-50], expected: false },
              { label: 'not a whole number', args: [12.5], expected: false },
              { label: 'text', args: ['100'], expected: false },
            ],
          },
          hints: ['Two things must be true at once, so combine them with &&.', 'Number.isInteger(value) is false for 12.5, for text and for NaN.', 'return Number.isInteger(amount) && amount > 0;'],
          explanation: 'Number.isInteger rejects fractions and anything that is not a number, such as the text "100". The second part rejects zero and negatives. Both must hold, so the function joins them with &&.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-59-scenario-1',
          kind: 'scenario',
          title: 'A category nobody listed',
          situation: "A person adds an expense with the category 'gifts', which is not in CATEGORIES. The tracker keeps money records, and its totals only count the listed categories.",
          prompt: 'What is the best way to handle it?',
          concept: 'refuse or repair',
          options: [
            { text: "Refuse the expense with a message that names the allowed categories, so the person can choose one.", consequence: 'The record stays clean, the person learns what is allowed, and no total is ever wrong because of a silent guess.', quality: 'best' },
            { text: "Quietly store it as 'other'.", consequence: 'The record is stored and the totals work, but the person never learns that the category was ignored, and a typo such as \'foood\' would hide in other for ever.', quality: 'acceptable' },
            { text: "Create a new category called 'gifts' on the spot.", consequence: "totalByCategory only knows the fixed list, so the new category either vanishes from the totals or turns a total into NaN. Every typo would also become a category.", quality: 'poor' },
          ],
          hints: ['Consider what the person would learn from each choice.', 'Totals are built on a fixed list. What happens to a category outside of it?', 'With money, an honest refusal is better than a silent guess.'],
          explanation: 'Refusing tells the person what to fix and keeps the data trustworthy. Quietly repairing hides mistakes, and inventing categories breaks the fixed list the totals rely on.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-59-q1',
        prompt: 'validateExpense returns an array of messages rather than just true or false. Why?',
        choices: [
          'A function that finds a problem is only allowed to return an array of text',
          'A function that receives an object as its input cannot return true or false in JavaScript at all',
          'The person is told every problem at once, and an empty array means the expense is fine',
          'An array of messages is quicker for the computer than a single true or false value',
        ],
        answer: 2,
        explanation: 'An array can carry any number of messages, so one pass tells the person everything to fix. An empty array doubles as the answer "no problems".',
      },
      {
        id: 'programming-fundamentals-59-q2',
        prompt: "After `const november = filterByMonth(expenses, '2026-11');`, which statement is true?",
        choices: [
          'november is a new array of the matching expenses, and expenses still holds every expense',
          'expenses now holds only the November expenses, because the filter removed all of the others',
          'november is a number that says how many of the expenses fell in that month',
          'november and expenses are the same array, so a change to one always shows in the other',
        ],
        answer: 0,
        explanation: 'The filter builds a new array and only reads the original. That is why the full list can still be totalled afterwards, and why filters can be chained.',
      },
      {
        id: 'programming-fundamentals-59-q3',
        prompt: 'Which of these dates does isValidDate accept?',
        choices: ["'2026-02-29', a date in a year that is not a leap year", "'2028-02-29', a leap day in a leap year", "'2026-13-01', the first day of the thirteenth month", "'2026-1-05', a date with a one-digit month"],
        answer: 1,
        explanation: '2028 is a leap year, so February 29 exists. 2026 is not a leap year, month 13 does not exist, and 2026-1-05 does not have the ten-character shape the function requires.',
      },
      {
        id: 'programming-fundamentals-59-q4',
        prompt: 'addExpense calls validateExpense before it builds the expense object. Why does the order matter?',
        choices: [
          'Building first would make the object larger, which would slow the check down by a noticeable amount',
          'JavaScript requires every function to check all of its input before it does anything else at all',
          'The check only matters for the date, and the date is the last field that is read',
          'Building calls input.description.trim(), which fails with an error when the description is not text',
        ],
        answer: 3,
        explanation: 'The check protects the code that follows it. If the description were a number, calling trim on it would raise an error instead of returning a friendly message.',
      },
      {
        id: 'programming-fundamentals-59-q5',
        audience: { max: 'beginner' },
        prompt: 'What is an edge case?',
        choices: [
          'A bug that always hides in the very first or the very last line of a program',
          'A test that checks only the most common input, the kind that people type in every single day',
          'An input so large or so strange that no computer could ever handle it correctly',
          'An unusual input at the limit of what is accepted, such as an empty list or a zero amount',
        ],
        answer: 3,
        explanation: 'Edge cases sit at the boundaries: empty, zero, one, the largest or smallest allowed. They are where bugs hide, so a good test plan includes them on purpose.',
      },
      {
        id: 'programming-fundamentals-59-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate wants totalOf and biggestExpense to validate every expense they read. What is the better design?',
        choices: [
          'Validate once where data enters and let inner functions trust it, so the rules live in one place',
          'Validate in every single function, since extra checks never cost anything or cause any problem',
          'Skip validation and rely on the tests to catch any bad data that appears',
          'Validate only in the functions that print, because only the values that get printed can ever be seen',
        ],
        answer: 0,
        explanation: 'One boundary check means the rules are written and tested once, and a bad record cannot get into the list. Repeating them everywhere duplicates logic, which then drifts apart.',
      },
    ],
    task: {
      title: 'Add filters and validation',
      steps: [
        'Add the two filters, the date helpers, validateExpense and the new addExpense. Replace the try-it code and compare your output with the lesson.',
        'Try ten bad expenses of your own: a blank description, an amount of 0, a negative, a decimal, the text "100", an unknown category, February 30, the date 2026-1-5, a missing field and null.',
        'For each, check that the messages are the ones you expect, and write down any case you think is wrongly accepted or wrongly refused.',
        'Print the total of one category in one month by chaining filterByMonth and filterByCategory.',
      ],
      minutes: 25,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Do just three bad expenses (a blank description, an amount of 0 and a date such as 2026-02-30) and read each message aloud: would a stranger know what to fix?'] },
      { audience: { min: 'advanced' }, steps: ['Add a rule that refuses a date after the latest date you pass in, without using Date, and decide whether the check belongs in validateExpense or in the caller.'] },
    ],
  },
  {
    id: 'programming-fundamentals-60',
    day: 60,
    title: 'Organize, Review and Explain Your Tracker',
    summary: 'Tidy the tracker into clear sections, add a small set of tests, review it with a checklist, and explain it in your own words.',
    intro: {
      objectives: [
        'Organize the program into sections with clear names and small functions',
        'Write a small set of tests with a check function and run them after every change',
        'Review the code with a checklist, with an AI partner if you choose, and explain the solution in your own words',
      ],
      why: 'Working code is only the start. Code you can tidy, test, review and explain is code you can trust, change and hand to someone else, and that is the skill that lets you direct and judge an AI assistant instead of hoping it is right.',
    },
    minutes: 30,
    skills: ['build-project', 'debug-test', 'ai-partner'],
    body: [
      { type: 'paragraph', text: "Your tracker now adds, categorizes, stores, shows, totals, filters and validates. This last lesson is about making it good: clear to read, checked by tests, reviewed for weaknesses, and explained in your own words. None of this adds a feature. All of it is what separates a program that happens to run from a program you can stand behind. It is also the work that matters most when an AI wrote part of the code, because then your job is exactly this: read it, test it, question it and be able to say what it does." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Before closing for the day, a good shopkeeper does three things. She puts every item back on the shelf where it belongs, so tomorrow nothing has to be hunted for. She counts the till against the notebook, to see that the numbers agree. And she could tell a new helper how the shop runs in a few clear sentences. Tidying, checking and explaining are the three parts of this lesson." },
      { type: 'paragraph', text: "The picture stops at one point: a shelf stays tidy by itself overnight, but code does not. Every change you make later can quietly break something, which is why the tests matter more than the tidying." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "**Organize by job.** Group functions that do the same kind of work, put the settings at the top, and label each group with a comment. A reader should find the filters in the filters section without searching. Names should say what a function does or returns: verbs for actions (addExpense, printReport), nouns for values (CATEGORIES). A function that does one job is short enough to read at a glance." },
      { type: 'paragraph', text: "**Test what matters.** In module 9 you wrote a tiny check function that compares an actual result with an expected one and prints PASS or FAIL. Your test plan from lesson 56 becomes a list of such checks: one behaviour per test, a name that says what it checks, and the edge cases included. Run the tests after every change. If a test fails after you tidy up, the tidying changed behaviour: undo it or fix it before doing anything else." },
      { type: 'paragraph', text: "**Review with a checklist.** Reading your own code is hard because you know what you meant. A checklist makes you look from outside:" },
      {
        type: 'table',
        headers: ['Question', 'What to look for', 'In the tracker'],
        rows: [
          ['Is it correct?', 'The right result for normal input', 'Totals match a hand calculation'],
          ['Are the edges covered?', 'Empty, zero, negative, wrong type, duplicates', 'Empty list, amount of 0, February 30'],
          ['Is the money safe?', 'Whole centavos, no float sums', 'Amounts are integers everywhere'],
          ['Are the names clear?', 'A name says what it holds or does', 'totalByCategory, not t2'],
          ['Is anything repeated?', 'Two pieces of code that differ by one value', 'The two filters share a shape'],
          ['Is input checked?', 'Bad values are stopped at one place', 'validateExpense, before storing'],
        ],
        caption: 'A review is the same six questions every time.',
      },
      { type: 'paragraph', text: "**Know your limits.** Every program has things it does not do. Writing them down is part of being honest about it. The tracker does not remember anything after it stops, cannot edit or delete an expense, does not understand a comma after a keyword ('rice,'), prints no thousands separators, and addExpense changes the array it is given. These are not failures; they are your 'later' list from lesson 56." },
      { type: 'paragraph', text: "**Explain it.** If you can explain a program in plain words, you understand it. The quickest test is to explain it to a friend, or to a rubber duck on your desk. Say what it does, what one expense looks like, three decisions you made and why, what you would improve, and how you checked it. Anything you cannot say clearly is a part to go back and read again." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: tidying means putting things where a reader expects them and giving them names that say what they are. A test is a question you know the answer to, so a FAIL tells you something broke. A review is a second look with a list, because your own code is the hardest to see clearly. And explaining your work out loud works because you cannot fake it: either you can say what a line does or you cannot, and the gap shows you what to study next.",
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "Step 1: reorder your file into sections. Move the functions into the groups below, with a comment line above each. This changes no behaviour, so you can run the demo from lesson 59 before and after to prove it." },
      { type: 'code', language: 'javascript', label: 'step 1: the sections', code: `// ---------- 1. Settings ----------      CATEGORIES, KEYWORDS
// ---------- 2. Categories ----------    suggestCategory, pickCategory
// ---------- 3. Validation ----------    isLeapYear, daysInMonth, isDigits, isValidDate, validateExpense
// ---------- 4. Adding ----------        addExpense
// ---------- 5. Showing ----------       formatPeso, formatExpense, listExpenses
// ---------- 6. Totals ----------        totalOf, totalByCategory, biggestExpense
// ---------- 7. Filters ----------       filterByCategory, filterByMonth
// ---------- 8. Report ----------        printReport
// ---------- 9. Tests ----------         check, runTests
// ---------- 10. Try it ----------       sample data, then the report and the tests` },
      { type: 'paragraph', text: "Step 2: a report that uses the pieces you already built. It filters to a month, then lists, totals, breaks down by category and finds the biggest. It prints the biggest only when there is one." },
      { type: 'code', language: 'javascript', label: 'step 2: printReport', code: `function printReport(expenses, month) {
  const inMonth = filterByMonth(expenses, month);
  console.log(\`Report for \${month}\`);
  listExpenses(inMonth);
  console.log(\`Total: \${formatPeso(totalOf(inMonth))}\`);
  const totals = totalByCategory(inMonth);
  for (const category of CATEGORIES) {
    if (totals[category] > 0) {
      console.log(\`  \${category}: \${formatPeso(totals[category])}\`);
    }
  }
  const biggest = biggestExpense(inMonth);
  if (biggest !== null) {
    console.log(\`Biggest: \${biggest.description} (\${formatPeso(biggest.amount)})\`);
  }
}` },
      { type: 'paragraph', text: "Step 3: the tests. check compares with JSON.stringify because two arrays or objects are never === unless they are the very same one." },
      { type: 'code', language: 'javascript', label: 'step 3: check and runTests', code: `let passed = 0;
let failed = 0;

function check(name, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    passed += 1;
    console.log(\`PASS \${name}\`);
  } else {
    failed += 1;
    console.log(\`FAIL \${name}: expected \${JSON.stringify(expected)}, got \${JSON.stringify(actual)}\`);
  }
}

function runTests() {
  const sample = [
    { description: 'Jeepney fare', amount: 2400, category: 'transport', date: '2026-11-16' },
    { description: 'Lunch', amount: 6500, category: 'food', date: '2026-11-16' },
    { description: 'Electric bill', amount: 185000, category: 'bills', date: '2026-10-28' },
  ];
  check('total of an empty list is 0', totalOf([]), 0);
  check('total adds every amount', totalOf(sample), 193900);
  check('ten plus twenty centavos is exactly thirty', totalOf([{ amount: 10 }, { amount: 20 }]), 30);
  check('biggest of an empty list is null', biggestExpense([]), null);
  check('biggest finds the largest amount', biggestExpense(sample).description, 'Electric bill');
  check('totals by category include empty ones', totalByCategory(sample).health, 0);
  check('filter by category', filterByCategory(sample, 'food').length, 1);
  check('filter by month', filterByMonth(sample, '2026-10').length, 1);
  check('suggest a category from a keyword', suggestCategory('Jeepney fare'), 'transport');
  check('unknown words are other', suggestCategory('Mystery gift'), 'other');
  check('a leap day is valid', isValidDate('2028-02-29'), true);
  check('a day that does not exist is invalid', isValidDate('2026-02-30'), false);
  check('a good expense has no errors', validateExpense({ description: 'Lunch', amount: 6500, date: '2026-11-16' }), []);
  check('a bad expense lists every problem', validateExpense({ description: '', amount: -1, date: 'tomorrow' }).length, 3);
  const list = [];
  const result = addExpense(list, { description: 'Lunch', amount: 0, date: '2026-11-16' });
  check('a rejected expense is not stored', list.length, 0);
  check('a rejected expense says why', result.ok, false);
  console.log(\`\${passed} passed, \${failed} failed\`);
}` },
      { type: 'paragraph', text: "Step 4: finish the file with sample data, the report and the tests." },
      { type: 'code', language: 'javascript', label: 'step 4: try it', code: `const expenses = [];
addExpense(expenses, { description: 'Jeepney fare', amount: 2400, date: '2026-11-16' });
addExpense(expenses, { description: 'Lunch at the canteen', amount: 6500, date: '2026-11-16' });
addExpense(expenses, { description: 'Mobile load', amount: 10000, date: '2026-11-17' });
addExpense(expenses, { description: 'Notebook and pen', amount: 4500, category: 'school', date: '2026-11-17' });
addExpense(expenses, { description: 'Rice and eggs', amount: 12050, date: '2026-11-18' });
addExpense(expenses, { description: 'Tricycle fare', amount: 3000, date: '2026-10-30' });
addExpense(expenses, { description: 'Electric bill', amount: 185000, date: '2026-10-28' });
addExpense(expenses, { description: 'Mystery gift', amount: 15000, date: '2026-11-18' });

printReport(expenses, '2026-11');
console.log('');
runTests();` },
      { type: 'code', language: 'text', label: 'output', code: `Report for 2026-11
2026-11-16 | Jeepney fare | transport | PHP 24.00
2026-11-16 | Lunch at the canteen | food | PHP 65.00
2026-11-17 | Mobile load | bills | PHP 100.00
2026-11-17 | Notebook and pen | school | PHP 45.00
2026-11-18 | Rice and eggs | food | PHP 120.50
2026-11-18 | Mystery gift | other | PHP 150.00
Total: PHP 504.50
  food: PHP 185.50
  transport: PHP 24.00
  bills: PHP 100.00
  school: PHP 45.00
  other: PHP 150.00
Biggest: Mystery gift (PHP 150.00)

PASS total of an empty list is 0
PASS total adds every amount
PASS ten plus twenty centavos is exactly thirty
PASS biggest of an empty list is null
PASS biggest finds the largest amount
PASS totals by category include empty ones
PASS filter by category
PASS filter by month
PASS suggest a category from a keyword
PASS unknown words are other
PASS a leap day is valid
PASS a day that does not exist is invalid
PASS a good expense has no errors
PASS a bad expense lists every problem
PASS a rejected expense is not stored
PASS a rejected expense says why
16 passed, 0 failed` },
      { type: 'paragraph', text: "Here is the whole tracker in one piece, as it stands at the end of the project. It ran with Node and printed exactly the output above." },
      { type: 'code', language: 'javascript', label: 'the whole program', code: `// Personal Expense Tracker
// Amounts are whole centavos: 2400 means PHP 24.00. Dates are text like '2026-11-16'.

// ---------- 1. Settings ----------
const CATEGORIES = ['food', 'transport', 'bills', 'school', 'health', 'other'];

const KEYWORDS = {
  food: ['rice', 'lunch', 'coffee', 'milk', 'snack'],
  transport: ['jeepney', 'fare', 'bus', 'tricycle'],
  bills: ['load', 'electric', 'water', 'internet'],
  school: ['notebook', 'pen', 'tuition'],
  health: ['medicine', 'vitamins', 'clinic'],
};

// ---------- 2. Categories ----------
function suggestCategory(description) {
  const words = description.toLowerCase().split(' ');
  for (const category of Object.keys(KEYWORDS)) {
    for (const word of words) {
      if (KEYWORDS[category].includes(word)) {
        return category;
      }
    }
  }
  return 'other';
}

function pickCategory(description, category) {
  if (category === undefined) {
    return suggestCategory(description);
  }
  if (CATEGORIES.includes(category)) {
    return category;
  }
  return 'other';
}

// ---------- 3. Validation ----------
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year, month) {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    return 30;
  }
  return 31;
}

function isDigits(text) {
  if (text.length === 0) {
    return false;
  }
  for (const character of text) {
    if (!'0123456789'.includes(character)) {
      return false;
    }
  }
  return true;
}

function isValidDate(text) {
  if (typeof text !== 'string' || text.length !== 10) {
    return false;
  }
  if (text[4] !== '-' || text[7] !== '-') {
    return false;
  }
  const yearText = text.slice(0, 4);
  const monthText = text.slice(5, 7);
  const dayText = text.slice(8, 10);
  if (!isDigits(yearText) || !isDigits(monthText) || !isDigits(dayText)) {
    return false;
  }
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (month < 1 || month > 12) {
    return false;
  }
  return day >= 1 && day <= daysInMonth(year, month);
}

function validateExpense(input) {
  if (typeof input !== 'object' || input === null) {
    return ['An expense must be an object with a description, amount and date.'];
  }
  const errors = [];
  if (typeof input.description !== 'string' || input.description.trim() === '') {
    errors.push('Description is required.');
  }
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    errors.push('Amount must be a whole number of centavos above zero.');
  }
  if (input.category !== undefined && !CATEGORIES.includes(input.category)) {
    errors.push(\`Unknown category "\${input.category}". Use one of: \${CATEGORIES.join(', ')}.\`);
  }
  if (!isValidDate(input.date)) {
    errors.push('Date must be a real date written like 2026-11-16.');
  }
  return errors;
}

// ---------- 4. Adding ----------
function addExpense(expenses, input) {
  const errors = validateExpense(input);
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  const expense = {
    description: input.description.trim(),
    amount: input.amount,
    category: pickCategory(input.description, input.category),
    date: input.date,
  };
  expenses.push(expense);
  return { ok: true, expense };
}

// ---------- 5. Showing ----------
function formatPeso(centavos) {
  return \`PHP \${(centavos / 100).toFixed(2)}\`;
}

function formatExpense(expense) {
  return \`\${expense.date} | \${expense.description} | \${expense.category} | \${formatPeso(expense.amount)}\`;
}

function listExpenses(expenses) {
  if (expenses.length === 0) {
    console.log('No expenses yet.');
    return;
  }
  for (const expense of expenses) {
    console.log(formatExpense(expense));
  }
}

// ---------- 6. Totals ----------
function totalOf(expenses) {
  let total = 0;
  for (const expense of expenses) {
    total += expense.amount;
  }
  return total;
}

function totalByCategory(expenses) {
  const totals = {};
  for (const category of CATEGORIES) {
    totals[category] = 0;
  }
  for (const expense of expenses) {
    totals[expense.category] += expense.amount;
  }
  return totals;
}

function biggestExpense(expenses) {
  if (expenses.length === 0) {
    return null;
  }
  let biggest = expenses[0];
  for (const expense of expenses) {
    if (expense.amount > biggest.amount) {
      biggest = expense;
    }
  }
  return biggest;
}

// ---------- 7. Filters ----------
function filterByCategory(expenses, category) {
  const matches = [];
  for (const expense of expenses) {
    if (expense.category === category) {
      matches.push(expense);
    }
  }
  return matches;
}

function filterByMonth(expenses, month) {
  const matches = [];
  for (const expense of expenses) {
    if (expense.date.slice(0, 7) === month) {
      matches.push(expense);
    }
  }
  return matches;
}

// ---------- 8. Report ----------
function printReport(expenses, month) {
  const inMonth = filterByMonth(expenses, month);
  console.log(\`Report for \${month}\`);
  listExpenses(inMonth);
  console.log(\`Total: \${formatPeso(totalOf(inMonth))}\`);
  const totals = totalByCategory(inMonth);
  for (const category of CATEGORIES) {
    if (totals[category] > 0) {
      console.log(\`  \${category}: \${formatPeso(totals[category])}\`);
    }
  }
  const biggest = biggestExpense(inMonth);
  if (biggest !== null) {
    console.log(\`Biggest: \${biggest.description} (\${formatPeso(biggest.amount)})\`);
  }
}

// ---------- 9. Tests ----------
let passed = 0;
let failed = 0;

function check(name, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    passed += 1;
    console.log(\`PASS \${name}\`);
  } else {
    failed += 1;
    console.log(\`FAIL \${name}: expected \${JSON.stringify(expected)}, got \${JSON.stringify(actual)}\`);
  }
}

function runTests() {
  const sample = [
    { description: 'Jeepney fare', amount: 2400, category: 'transport', date: '2026-11-16' },
    { description: 'Lunch', amount: 6500, category: 'food', date: '2026-11-16' },
    { description: 'Electric bill', amount: 185000, category: 'bills', date: '2026-10-28' },
  ];
  check('total of an empty list is 0', totalOf([]), 0);
  check('total adds every amount', totalOf(sample), 193900);
  check('ten plus twenty centavos is exactly thirty', totalOf([{ amount: 10 }, { amount: 20 }]), 30);
  check('biggest of an empty list is null', biggestExpense([]), null);
  check('biggest finds the largest amount', biggestExpense(sample).description, 'Electric bill');
  check('totals by category include empty ones', totalByCategory(sample).health, 0);
  check('filter by category', filterByCategory(sample, 'food').length, 1);
  check('filter by month', filterByMonth(sample, '2026-10').length, 1);
  check('suggest a category from a keyword', suggestCategory('Jeepney fare'), 'transport');
  check('unknown words are other', suggestCategory('Mystery gift'), 'other');
  check('a leap day is valid', isValidDate('2028-02-29'), true);
  check('a day that does not exist is invalid', isValidDate('2026-02-30'), false);
  check('a good expense has no errors', validateExpense({ description: 'Lunch', amount: 6500, date: '2026-11-16' }), []);
  check('a bad expense lists every problem', validateExpense({ description: '', amount: -1, date: 'tomorrow' }).length, 3);
  const list = [];
  const result = addExpense(list, { description: 'Lunch', amount: 0, date: '2026-11-16' });
  check('a rejected expense is not stored', list.length, 0);
  check('a rejected expense says why', result.ok, false);
  console.log(\`\${passed} passed, \${failed} failed\`);
}

// ---------- 10. Try it ----------
const expenses = [];
addExpense(expenses, { description: 'Jeepney fare', amount: 2400, date: '2026-11-16' });
addExpense(expenses, { description: 'Lunch at the canteen', amount: 6500, date: '2026-11-16' });
addExpense(expenses, { description: 'Mobile load', amount: 10000, date: '2026-11-17' });
addExpense(expenses, { description: 'Notebook and pen', amount: 4500, category: 'school', date: '2026-11-17' });
addExpense(expenses, { description: 'Rice and eggs', amount: 12050, date: '2026-11-18' });
addExpense(expenses, { description: 'Tricycle fare', amount: 3000, date: '2026-10-30' });
addExpense(expenses, { description: 'Electric bill', amount: 185000, date: '2026-10-28' });
addExpense(expenses, { description: 'Mystery gift', amount: 15000, date: '2026-11-18' });

printReport(expenses, '2026-11');
console.log('');
runTests();` },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**printReport** filters to the month once and reuses the result for the list, the total, the categories and the biggest. It prints a category only when its total is above zero, and prints the biggest only when biggestExpense gave something other than null.',
          '**check** compares JSON text, adds one to passed or failed, and prints one line. runTests builds a small sample list, runs sixteen checks (normal cases, empty cases and bad input), and prints a count.',
          '**The rejected-expense test** adds an expense with an amount of 0 to an empty list, then checks two things: the list is still empty and the result says ok: false. One behaviour per check.',
          '**The try-it code** prints the report for November (October expenses are filtered out), then runs the tests.',
        ],
      },
      { type: 'paragraph', text: "A test that never fails proves little, so break something on purpose. Change `total += expense.amount;` in totalOf to `total = expense.amount;` and run again. The two tests about totals fail and say exactly what was expected and what came back:" },
      { type: 'code', language: 'text', label: 'output with the deliberate bug', code: `FAIL total adds every amount: expected 193900, got 185000
FAIL ten plus twenty centavos is exactly thirty: expected 30, got 20
14 passed, 2 failed` },
      { type: 'paragraph', text: "Notice that the report's category lines were still right while its total was wrong. Without the tests you might not have noticed. Put the line back and run again to see 16 passed." },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "The refactors worth doing next are mostly about leverage. filterByCategory and filterByMonth differ only in a predicate, so they collapse to a single filter taking a function, or to Array.prototype.filter, but two clear loops are fine until a third appears. Separating pure logic from the console output, as here, is what makes the logic testable without capturing output. The check helper is a hand-rolled harness; in a real project use the runner the ecosystem provides, and keep the test table as the specification. Review for what generated or hurried code gets wrong: float arithmetic on money, unvalidated boundaries, mutation of arguments, and tests that were edited to match the output instead of the requirement.",
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "An assistant is useful at this stage as a reviewer and as a curious listener, as long as you stay the author. Run your own checklist first, then compare:" },
      { type: 'prompt', label: 'Review my tracker with questions', text: "Here is the full JavaScript code of my personal expense tracker. Amounts are whole centavos and dates are text like 2026-11-16.\n\n[paste your program]\n\nPlease review it against this checklist: correctness, edge cases, money handling, names, repeated code, and input validation. Do not rewrite my code and do not give me corrected versions. For each finding, point to the function, say what could go wrong, and give me one test input that would show it, so I can try it myself." },
      { type: 'prompt', label: 'Be the curious listener', text: "I will explain my expense tracker to you in my own words. Act as a friendly teammate who has not seen the code. After my explanation, ask me three questions about the parts that were unclear or that you think I may not have thought about. Do not answer them for me, and do not tell me whether my explanation was right until I have answered." },
      { type: 'paragraph', text: "What to look for: take every finding and run its test input yourself before you believe it. An assistant can report a bug that does not exist, miss one that does, or suggest an edit that quietly changes behaviour, such as decimals for money or a test rewritten to pass. Keep a suggestion only if you can explain it and your tests still pass afterwards." },
      {
        type: 'takeaways',
        items: [
          'Organize by job: settings first, then groups of functions with clear names and one job each.',
          'Turn the test plan into checks that print PASS or FAIL, one behaviour per test, and run them after every change.',
          'Review with the same checklist each time: correctness, edge cases, money, names, repetition and input checks.',
          'An AI reviewer is a partner, not the author: try every finding yourself, and keep only changes you can explain with the tests still passing.',
          'You understand your program when you can explain what it does, why you chose each design, and what it does not do.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-60-fix-bug-1',
          kind: 'fix-bug',
          language: 'javascript',
          title: 'The check that always fails',
          prompt: "The first check compares two empty arrays, which are equal, but it prints FAIL. The other two lines are right. Tap the faulty line and choose the fix.",
          concept: 'writing tests',
          code: `function check(name, actual, expected) {
  if (actual === expected) {
    console.log(\`PASS \${name}\`);
  } else {
    console.log(\`FAIL \${name}\`);
  }
}

check('no errors for a good expense', [], []);
check('two plus three', 2 + 3, 5);
check('wrong on purpose', 2 + 2, 5);`,
          bugLine: 2,
          fixes: [
            { line: 'if (JSON.stringify(actual) === JSON.stringify(expected)) {', correct: true, why: 'Turning both values into text compares their contents, so two arrays with the same items are equal.' },
            { line: 'if (actual == expected) {', correct: false, why: 'Two different arrays are still not equal with ==, so the first check would still fail.' },
            { line: 'if (actual.length === expected.length) {', correct: false, why: 'Numbers have no length, so every number check passes as undefined === undefined, even the one that is wrong on purpose.' },
            { line: 'if (actual !== expected) {', correct: false, why: 'That reverses every result: good checks would print FAIL and the wrong one would print PASS.' },
          ],
          tests: { kind: 'output', expected: ['PASS no errors for a good expense', 'PASS two plus three', 'FAIL wrong on purpose'] },
          lineNote: 'The comparison that decides PASS or FAIL is in the if line.',
          hints: ['The two arrays hold the same items. Why might JavaScript say they are different?', '=== on arrays asks whether they are the very same array in memory, not whether their items match.', 'Compare JSON.stringify(actual) with JSON.stringify(expected).'],
          explanation: 'Arrays and objects are compared by identity with ===, so two separate empty arrays are never equal. Turning both into JSON text compares what they contain.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-60-predict-output-1',
          kind: 'predict-output',
          language: 'javascript',
          title: 'Which tests catch the bug?',
          prompt: 'This totalOf has a bug: it replaces the total on each turn instead of adding. Predict what the three checks print.',
          concept: 'what a test catches',
          code: `function totalOf(expenses) {
  let total = 0;
  for (const expense of expenses) {
    total = expense.amount;
  }
  return total;
}

function check(name, actual, expected) {
  if (actual === expected) {
    console.log(\`PASS \${name}\`);
  } else {
    console.log(\`FAIL \${name}\`);
  }
}

check('empty list', totalOf([]), 0);
check('one expense', totalOf([{ amount: 500 }]), 500);
check('two expenses', totalOf([{ amount: 500 }, { amount: 250 }]), 750);`,
          choices: ['PASS empty list\nPASS one expense\nPASS two expenses', 'FAIL empty list\nFAIL one expense\nFAIL two expenses', 'PASS empty list\nPASS one expense\nFAIL two expenses', 'PASS empty list\nFAIL one expense\nFAIL two expenses'],
          wrongNotes: {
            'PASS empty list\nPASS one expense\nPASS two expenses': 'With two expenses the loop ends holding 250, the last amount, not 750.',
            'FAIL empty list\nFAIL one expense\nFAIL two expenses': 'An empty list never runs the loop, so the total stays 0, and one expense gives the right answer.',
            'PASS empty list\nFAIL one expense\nFAIL two expenses': 'With one expense, replacing the total with 500 happens to give the right answer.',
          },
          hints: ['Work out what the function returns for each of the three lists.', 'With one expense, replacing the total and adding to it give the same answer.', 'Only the list with two expenses gives a different answer: 250, not 750.'],
          explanation: 'The bug only shows when there are two or more expenses. The empty list and the one-expense list pass by luck, which is why a test plan needs more than one case and why a passing test does not prove the code is right.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-60-code-challenge-1',
          kind: 'code-challenge',
          language: 'javascript',
          title: 'Write monthlySummary',
          prompt: 'filterByMonth and totalOf are provided. Write monthlySummary(expenses, month) so it returns an object with count (how many expenses are in that month) and total (their total in centavos).',
          concept: 'composing functions',
          starter: `function filterByMonth(expenses, month) {
  const matches = [];
  for (const expense of expenses) {
    if (expense.date.slice(0, 7) === month) {
      matches.push(expense);
    }
  }
  return matches;
}

function totalOf(expenses) {
  let total = 0;
  for (const expense of expenses) {
    total += expense.amount;
  }
  return total;
}

function monthlySummary(expenses, month) {
  // return an object { count, total } for the expenses of that month
}`,
          solution: `function filterByMonth(expenses, month) {
  const matches = [];
  for (const expense of expenses) {
    if (expense.date.slice(0, 7) === month) {
      matches.push(expense);
    }
  }
  return matches;
}

function totalOf(expenses) {
  let total = 0;
  for (const expense of expenses) {
    total += expense.amount;
  }
  return total;
}

function monthlySummary(expenses, month) {
  const inMonth = filterByMonth(expenses, month);
  return { count: inMonth.length, total: totalOf(inMonth) };
}`,
          tests: {
            kind: 'function',
            fn: 'monthlySummary',
            cases: [
              { label: 'two expenses in the month', args: [[{ date: '2026-11-16', amount: 2400 }, { date: '2026-10-30', amount: 3000 }, { date: '2026-11-18', amount: 6500 }], '2026-11'], expected: { count: 2, total: 8900 } },
              { label: 'nothing in the month', args: [[{ date: '2026-10-30', amount: 3000 }], '2026-11'], expected: { count: 0, total: 0 } },
              { label: 'an empty list', args: [[], '2026-11'], expected: { count: 0, total: 0 } },
            ],
          },
          hints: ['Start by getting the expenses of the month with filterByMonth.', 'Then you need two things from that shorter list: its length and its total.', 'return { count: inMonth.length, total: totalOf(inMonth) };'],
          explanation: 'The output of filterByMonth feeds both parts of the answer: the length gives the count and totalOf gives the total. Small functions that do one job can be combined like this without rewriting any of them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-60-scenario-1',
          kind: 'scenario',
          title: 'The reviewer changes the test',
          situation: "You ask an AI assistant to review your tracker. It reports that your total test fails and proposes a fix: change amounts to decimals in pesos, and edit the expected value in the test from 193900 to 1939 so that it passes. It sounds confident.",
          prompt: 'What do you do?',
          concept: 'judging AI suggestions',
          options: [
            { text: "Decline the change. Ask why the test failed, reproduce the failure yourself, and keep the whole-centavo amounts and the original expected value.", consequence: 'You find out whether there was a real bug, you keep exact money arithmetic, and the test still states the requirement. Changing a test to make it pass would hide a problem, not fix one.', quality: 'best' },
            { text: 'Accept both changes, because the assistant checked the code and the test now passes.', consequence: 'The test passes only because it was edited to agree with the code. Decimal money brings back rounding errors, and you can no longer say what the program does.', quality: 'poor' },
            { text: 'Accept the decimals, but put the original expected value back.', consequence: 'You protected the test, but you changed the money model that the whole program depends on without a reason you can explain.', quality: 'acceptable' },
          ],
          hints: ['Which of the two edits changes what the program is supposed to do?', 'A test states a requirement. Editing it to match the code defeats its purpose.', 'You are responsible for the result, so decide only after you understand the failure.'],
          explanation: 'A suggestion is only worth taking if you understand it and your tests still describe what you meant. Rewriting a test to pass is the most common way a confident-sounding fix hides a real problem.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-60-match-1',
          kind: 'match',
          title: 'What did the review find?',
          prompt: 'Each sentence is a finding from a review of some tracker code. Match it to the question of the checklist that found it.',
          concept: 'code review',
          labels: { terms: 'A finding', meanings: 'The checklist question' },
          pairs: [
            { term: 'Two functions are identical except for the field they compare', definition: 'Is anything repeated?', note: 'Code that differs by one value is a sign of repetition.' },
            { term: 'A variable called t2 holds the total of the food category', definition: 'Are the names clear?', note: 'The problem is what the variable is called.' },
            { term: 'There is no test for an empty list', definition: 'Are the edges covered?', note: 'An empty list is an edge case.' },
            { term: 'Prices are added as decimal pesos such as 24.5', definition: 'Is the money safe?', note: 'Decimal sums can drift, so this is a money finding.' },
          ],
          hints: ['Read each finding and ask which of the six checklist questions it answers.', 'The finding about a name is the easiest to place.', 'Decimal pesos and an empty list each belong to a different question about safety and edges.'],
          explanation: 'A checklist turns a vague feeling that code is not good into specific questions, and every finding belongs to one of them: repetition, names, edges or money.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-60-q1',
        prompt: 'You tidy up the file, and a test that passed before now fails. What does that tell you?',
        choices: [
          'The test is probably wrong, so the quickest fix is to delete it and carry on with the rest of the tidying work',
          'The tidy-up changed what the program does, so undo it or fix it before doing anything else',
          'Tests are only reliable the first time they run, so a later failure means nothing',
          'The program has become faster, which makes the old expected values out of date',
        ],
        answer: 1,
        explanation: 'Tidying should not change behaviour, and the failing test shows that it did. That is exactly why the tests are run after every change.',
      },
      {
        id: 'programming-fundamentals-60-q2',
        prompt: 'Why does check compare JSON.stringify(actual) with JSON.stringify(expected) instead of using === directly?',
        choices: [
          '=== cannot compare two numbers, so everything has to be turned into text first by the program',
          'JSON.stringify is the only way to print an array so that it can be read',
          'It makes the tests run a great deal faster than a direct comparison would',
          '=== on two arrays asks if they are the same one, not whether their items are equal',
        ],
        answer: 3,
        explanation: 'Two separate arrays with the same contents are not === to each other. Comparing their JSON text compares the contents.',
      },
      {
        id: 'programming-fundamentals-60-q3',
        prompt: 'Which test name is the most useful when it fails?',
        choices: ['total of an empty list is 0', 'test number one for the totals', 'totals work as expected', 'checking the money functions'],
        answer: 0,
        explanation: 'A good name says the input and the expected result, so a FAIL tells you what broke without opening the code. The other names tell you nothing about the behaviour.',
      },
      {
        id: 'programming-fundamentals-60-q4',
        prompt: 'An AI assistant reviews your tracker and suggests a change. What should you do before keeping it?',
        choices: [
          'Accept it: a reviewer that reads code that quickly is almost always right about what it finds',
          'Reject every suggestion, because an AI assistant is never able to review code',
          'Make sure you understand it, run your tests, and keep it only if you can explain it and they pass',
          'Ask the assistant to change the tests too, so that everything agrees again and the tests pass',
        ],
        answer: 2,
        explanation: 'You remain responsible for the program. A suggestion you cannot explain, or one that only passes after the tests are edited, is a risk and not an improvement.',
      },
      {
        id: 'programming-fundamentals-60-q5',
        audience: { max: 'beginner' },
        prompt: 'Why is it useful to explain your program out loud to a friend or a rubber duck?',
        choices: [
          'It makes the program run faster because the computer hears the explanation',
          'JavaScript will not run a program that nobody has described to another person',
          'Finding the words shows you which parts you do not understand yet',
          'It means you no longer need to write any tests for the program',
        ],
        answer: 2,
        explanation: 'If you can not say what a part does, you have found something to read again. Explaining is a test of understanding, and it does not replace tests of the code.',
      },
      {
        id: 'programming-fundamentals-60-q6',
        audience: { min: 'advanced' },
        prompt: "In a review of AI-generated code for a money tracker, which finding should you take most seriously?",
        choices: [
          'A variable could have a slightly shorter name than the long one it was originally given in the code',
          'Amounts are added as floating-point decimals, so sums can drift by fractions of a centavo',
          'The helper functions appear in a different order from the one you would use',
          'One comment uses a different style from the comments around it',
        ],
        answer: 1,
        explanation: 'Correctness of money matters most: float drift silently corrupts totals. The other three are style points that do not change any result.',
      },
    ],
    task: {
      title: 'Finish, test, review and explain your tracker',
      steps: [
        'Reorder your file into the ten sections, run it before and after, and check that the output is the same.',
        'Add printReport, check and runTests, and add at least four tests of your own from your lesson 56 test plan.',
        'Break one function on purpose, confirm that a test fails with a clear message, and then put it back.',
        'Review the code with the six checklist questions and write down three findings and three known limits.',
        'Write a five-sentence explanation: what it does, what an expense looks like, three decisions and why, what you would improve, and how you tested it.',
      ],
      minutes: 25,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Read your explanation aloud once, then ask a friend, or an AI assistant, to ask you two questions about it. Note any question you could not answer.'] },
      { audience: { min: 'advanced' }, steps: ['Replace the two filters with one function that takes a predicate, keep all your tests passing, and write one sentence on whether the result is easier or harder to read.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'programming-fundamentals-p11',
  title: 'Your personal expense tracker',
  summary: 'Plan, build, test and explain a working expense tracker in JavaScript: it adds and categorizes expenses, shows them, totals them, filters them and refuses bad input.',
  outcome: 'A complete, tested program you planned, built and can explain line by line, which is proof that you can turn a plain description into working code and judge code written by others, including an AI assistant.',
  unlockAfterDay: 59,
  steps: [
    { id: 'programming-fundamentals-p11-s1', text: 'Plan (lesson 56): write your requirements and out-of-scope list, the data table for one expense, the function table, pseudocode and a flowchart in text for adding an expense, and a test plan of at least eight rows with edge cases.' },
    { id: 'programming-fundamentals-p11-s2', text: 'Add and categorize (lesson 57): build CATEGORIES, KEYWORDS, suggestCategory, pickCategory and addExpense, and run them on at least five expenses of your own.' },
    { id: 'programming-fundamentals-p11-s3', audience: { max: 'beginner' }, text: 'If you need to, build the program with the lesson code open beside you and change one thing in each function (a category, a keyword, a message) so that you know it is yours.' },
    { id: 'programming-fundamentals-p11-s4', text: 'Store, display and total (lesson 58): add formatPeso, listExpenses, totalOf, totalByCategory and biggestExpense, and show what each does for an empty list.' },
    { id: 'programming-fundamentals-p11-s5', text: 'Filter and validate (lesson 59): add filterByCategory, filterByMonth, isValidDate and validateExpense, make addExpense refuse bad input, and try at least ten bad expenses.' },
    { id: 'programming-fundamentals-p11-s6', text: 'Organize and test (lesson 60): group the code into labelled sections, add a report, and write at least twelve checks that cover normal cases, empty cases and bad input.' },
    { id: 'programming-fundamentals-p11-s7', text: 'Review: run the six-question checklist on your code and list your findings and the limits of your tracker. If you use an AI assistant, ask it to review your code and not to rewrite it, try each finding yourself, and say which you kept and why.' },
    { id: 'programming-fundamentals-p11-s8', audience: { min: 'advanced' }, text: 'Add a feature of your own to the plan (for example a monthly budget with a warning, or duplicate detection), write its tests first, and describe the design choice you made and the alternative you rejected.' },
    { id: 'programming-fundamentals-p11-s9', text: 'Explain: write the explanation described below. Do not ask an AI assistant to write it for you.' },
  ],
  submission: {
    kind: 'text',
    label: 'Your plan, your code and your explanation',
    placeholder: 'Paste: 1) your plan (requirements, data table, pseudocode or flowchart as text, test plan), 2) your full program, 3) your test output, 4) your review findings and limits, 5) your explanation.',
    hint: 'Include the plan, the complete program and the output of your tests. Then explain in your own words: what the tracker does, what one expense looks like, why you store money in centavos, why you validate before storing, one bug or surprise you met and how you found it, and what you would improve. If you used an AI assistant, include the prompts you gave it and what you changed or rejected.',
  },
  rubric: [
    'Problem decomposition: the plan breaks the tracker into clear requirements, data and small single-purpose functions, and the code follows the plan.',
    'Logic: the conditions, loops and accumulators are correct, including the empty list, zero, negative and impossible-date cases.',
    'Correctness: the program runs, the totals match a hand calculation, money is kept in whole centavos, and bad input is refused with a clear message.',
    'Code organization and testing: names are clear, functions do one job, the code is in labelled sections, and the tests have clear names and cover edge cases.',
    'Explanation: the learner explains the program and their design choices in their own words, including a bug or limit they found, and shows understanding rather than memory.',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The tracker may be smaller (for example without dates or filters), as long as the parts that are present work, are tested, and are explained in the learner\'s own words.'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The tracker includes validation and at least twelve tests, and the review lists at least three real findings that the learner tried out.'] },
    { audience: { min: 'advanced' }, items: ['A feature of the learner\'s own is added with its tests written first, and the explanation covers a design trade-off, such as refusing versus repairing input.', 'If an AI assistant was used, the submission shows review evidence: what it suggested, what the learner verified by running it, and what was rejected.'] },
  ],
};
