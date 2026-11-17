import type { Lesson, Project } from '../../../types';

/**
 * Programming Fundamentals, module 1: Understanding Programming (lessons 1 to 4, project p1).
 * No JavaScript here on purpose: the module teaches what a program is, how a machine follows it, what a language is, how an
 * application is put together and where AI fits. Code-shaped blocks are plain text (steps, an imaginary machine, the same
 * instruction in three real languages).
 */

const CHECKED = '2026-11-16';

// Every page below was opened on CHECKED.
const DOCS = {
  claudeCode: { label: 'Claude Code docs: Overview', url: 'https://code.claude.com/docs/en/overview' },
  copilotWhat: { label: 'GitHub Docs: What is GitHub Copilot?', url: 'https://docs.github.com/en/copilot/get-started/what-is-github-copilot' },
  copilotChatCard: { label: 'GitHub Docs: Application card for GitHub Copilot Chat', url: 'https://docs.github.com/en/copilot/responsible-use/chat' },
  cursorDocs: { label: 'Cursor documentation', url: 'https://cursor.com/docs' },
  claudeHallucinations: { label: 'Claude API docs: Reduce hallucinations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations' },
  dora2025: { label: 'DORA: 2025 State of AI-assisted Software Development', url: 'https://dora.dev/research/2025/dora-report/' },
};

export const lessons: Lesson[] = [
  {
    id: 'programming-fundamentals-01',
    day: 1,
    title: 'What Programming Is, and How to Think Like a Programmer',
    summary: 'See that a program is a list of exact instructions, and practise turning an everyday errand into steps a literal-minded machine could follow.',
    minutes: 25,
    skills: ['how-programs-work', 'problem-solving'],
    intro: {
      objectives: [
        'Explain what a program and an instruction are',
        'Spot the gaps in a vague set of steps by asking what a literal machine would need to know',
        'Rewrite an everyday errand as exact, ordered steps that include a decision',
      ],
      why: 'When an AI assistant writes your code, the quality of the result depends on how exactly you can say what you want and how well you can tell whether it did it. Both skills start here.',
    },
    body: [
      {
        type: 'paragraph',
        text: `Every app you use, from the one that shows a jeepney fare to the one that tops up your mobile load, is a long list of instructions that a computer follows. Programming is the work of writing those instructions. This course teaches the ideas behind that work, and it matters more than ever now: when an AI assistant can write code for you, the person who can say exactly what is wanted, read what came back and tell whether it is right is the person in charge. That person has learned to think like a programmer. You will start today, without writing any code.`,
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: `Imagine you hire a cook who is extremely fast and never guesses. Give them a recipe that says "add a little salt" and they stop: how much is a little? Give them a recipe that forgets "turn on the stove" and the soup stays cold, because the cook does only what the recipe says, in the order it says it. A computer is that cook.`,
      },
      {
        type: 'paragraph',
        text: `A person handed a vague recipe fills the gaps with common sense, or asks someone. A computer has no common sense to fill gaps with. The picture stops working in one place: a real cook notices smoke and uses judgment, while a computer notices nothing unless someone wrote that check as one more instruction. AI assistants add a twist of their own: they will often fill a gap with a confident guess instead of stopping. That is just as risky in a different way, and the last lesson of this module returns to it.`,
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: `A **program** is a list of **instructions**: small, exact steps that a computer can carry out one after another. **Running** a program means asking the computer to follow those steps. The text the programmer writes is called **code**, and the people who write it are programmers.`,
      },
      {
        type: 'paragraph',
        text: `Three facts shape everything in programming. First, a computer follows instructions in order, from the first to the last, unless an instruction sends it somewhere else (later modules show how). Second, it does exactly what is written, never what was meant. Third, it is very fast and never tired, so a small mistake can be repeated a million times before anyone looks.`,
      },
      {
        type: 'table',
        headers: ['Said to a person', 'What a literal machine would ask', 'A precise version'],
        rows: [
          ['Pay the fare.', 'How much? In coins or bills? Who receives it? Before or after sitting down?', 'Take out one 20-peso bill and one 5-peso coin and hand them to the driver.'],
          ['Buy some eggs on the way home.', 'How many? Which shop? What if there are none?', 'Buy 6 eggs at the shop next to the bus stop. If it has none, buy nothing and go home.'],
          ['Send me the receipt.', 'Which receipt? To which address? In what form? When?', 'Send the receipt for order 118 to this email address as a PDF, today before 5 PM.'],
        ],
        caption: 'Every gap in the middle column is something a person fills without noticing.',
      },
      {
        type: 'paragraph',
        text: `Thinking like a programmer is a set of four habits that close those gaps before a machine meets them:`,
      },
      {
        type: 'list',
        items: [
          '**Be exact.** Name the amount, the thing, the order. "A little", "some" and "the usual way" are not instructions.',
          '**Break it into small steps, in order.** One step does one thing, and each step makes sense only after the ones before it.',
          '**Ask what could go wrong.** The shop is sold out, the money is not enough, the number is mistyped. Decide what the steps should do in each case.',
          '**Check by following your own steps.** Read your list as the machine would, one line at a time, and see where you would get stuck.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: `In plain words: imagine giving directions to a visitor who has never been to your town and who will do exactly what you say. "Go to the market" is not enough, because they do not know which road, which turn or how far. You have to say every turn. A programmer writes directions that leave no gap. When a program does something wrong, the computer was almost never being stubborn: it followed the steps, and the steps were incomplete or in the wrong order. A "computer" here means any phone, laptop or machine with a chip that runs programs.`,
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: `Underneath, this is specification. A program is a precise answer to the question "given these inputs and this state, what must happen?" Most real defects come from gaps in that question (unstated preconditions, unhandled states, ambiguous requirements) rather than from typos. A compiler or interpreter rejects only what it cannot parse; it cannot reject a gap in your intent. With generated code the gap is settled by the model's guess instead of by a rejection, so unspecified behavior ships quietly. Writing the requirement as inputs, outputs, examples and failure cases is the cheapest review you will ever do.`,
      },
      {
        type: 'tip',
        text: `Later modules practise these ideas in JavaScript, because Talino can run it for you. The ideas carry over to every other language. This module needs no code at all.`,
      },
      { type: 'heading', text: 'Walk through an example' },
      {
        type: 'paragraph',
        text: `Let us order a meal the way a computer would need it. First, the version a person would say.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Version 1: how a person says it',
        code: `1. Go to the counter.
2. Order a meal.
3. Pay.
4. Take the food and sit down.`,
      },
      {
        type: 'paragraph',
        text: `Now play the literal machine and ask a question at every line.`,
      },
      {
        type: 'list',
        items: [
          'Line 1: Which counter? There may be three. What if there is a queue?',
          'Line 2: Which meal? How many? What exactly do you say, and to whom? What if it is sold out?',
          'Line 3: How much? Cash or card? What if you do not have enough?',
          'Line 4: Which tray is yours? Which table is free?',
        ],
      },
      {
        type: 'paragraph',
        text: `Each question is a gap that a person steps over without noticing. Here is a version a literal machine could follow.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Version 2: exact steps',
        code: `1. Walk to the counter with the shortest queue and stand at the end of it.
2. When you reach the front, say: "One chicken meal with rice, please."
3. If the cashier says it is sold out, say: "One burger meal, please."
4. Wait until the cashier says the total.
5. Hand over cash that is equal to or more than the total. Wait for the change.
6. Take the tray when the cashier calls your order number.
7. Sit at an empty table.`,
      },
      {
        type: 'paragraph',
        text: `Three things changed. The steps are longer, because every gap now has an answer. Step 3 is a **decision**: what you do next depends on something you only learn while the steps run. And the order is fixed: you cannot pay (step 5) before you know the total (step 4). The picture below shows the same steps as a map, with the decision as a fork.`,
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Version 2 as a map. The diamond is the decision: the arrow you follow depends on the answer.',
        source: `flowchart TD
  A(Start) --> B[Stand at the end of the shortest queue]
  B --> C[Ask for one chicken meal with rice]
  C --> D{Is it sold out?}
  D -->|yes| E[Ask for one burger meal]
  D -->|no| F[Hear the total and pay]
  E --> F
  F --> G[Take the tray when your number is called]
  G --> H(Sit at an empty table)`,
      },
      {
        type: 'paragraph',
        text: `Is Version 2 finished? No. What if the burger meal is sold out too? What if your cash is not enough? There is never a perfect final version. Programmers decide how far to go, and they write down what they chose to leave out. That list of "what could still go wrong" is part of the work, and it is what you will hand in for this module's project.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: `An AI assistant is a good practice partner here, because it can play the literal machine and point at your gaps. Use whichever assistant you have: ChatGPT, Claude, Gemini or another. Do not paste anything private; ordering food needs no personal details.`,
      },
      {
        type: 'prompt',
        label: 'Find the gaps',
        text: `I am learning to think like a programmer. Below are my steps for ordering a meal at a fast-food counter. Act as a literal-minded machine that cannot guess. Go through my steps one line at a time and, for each line, tell me the first question you would have to ask before you could do it. Do not rewrite my steps and do not give me a better version; I will fix them myself. At the end, tell me which gap you think is the most serious and why.

My steps:
1. Go to the counter.
2. Order a meal.
3. Pay.
4. Take the food and sit down.`,
      },
      {
        type: 'prompt',
        label: 'A second round',
        text: `Here is my improved version of the steps: [paste your new steps here]. Do the same again, and tell me whether any gap from last time is still there. Before you answer, ask me three questions about my steps and wait for my replies. Do not give me the answers.`,
      },
      {
        type: 'paragraph',
        text: `What to look for: did the assistant point at gaps, or did it quietly rewrite your steps even though you asked it not to? Does each gap it names really need an answer? An AI can invent gaps that do not matter (the color of the tray) and can also say "no gaps found" when there are plenty. You decide which gaps matter, because you know what you are trying to do.`,
      },
      {
        type: 'takeaways',
        items: [
          'A program is a list of exact instructions that a computer follows in order, doing what is written and not what was meant.',
          'A vague instruction hides gaps that a person fills with common sense and a machine cannot.',
          'Thinking like a programmer means being exact, using small ordered steps, asking what could go wrong and checking by following your own steps.',
          'A decision is a fork in the steps: what happens next depends on an answer found while the steps run.',
          'With AI-written code, you supply the exactness. A model fills gaps with guesses, so a clear description is what keeps the result right.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-01-arrange-1',
          kind: 'arrange',
          title: 'Buy load without any guessing',
          prompt: 'These steps for buying 50 pesos of mobile load are shuffled. Put them in the order a literal machine could follow without guessing or acting too early.',
          concept: 'order of instructions',
          language: 'text',
          solution: [
            'Open the app and choose Buy load.',
            'Type the phone number to top up.',
            'Choose the amount: 50 pesos.',
            'Check that the number and the amount on the screen are correct.',
            'Confirm and pay.',
            'Wait for the confirmation message.',
          ],
          alternatives: [
            [
              'Open the app and choose Buy load.',
              'Choose the amount: 50 pesos.',
              'Type the phone number to top up.',
              'Check that the number and the amount on the screen are correct.',
              'Confirm and pay.',
              'Wait for the confirmation message.',
            ],
          ],
          reasons: [
            'Nothing can be chosen until the right screen is open.',
            'The machine must know which phone gets the load before it can send anything. (Choosing the amount first works too.)',
            'The amount is needed before the check. (It may also come before the number: the two do not depend on each other.)',
            'Checking comes after the details exist and before any money moves.',
            'Paying commits the money, so it happens only after the check.',
            'A confirmation can only arrive after the payment has been made.',
          ],
          hints: [
            'Ask of each step: what must already be true before I can do this?',
            'Money should move late, after everything has been checked.',
            'Opening the app is first, the confirmation is last, and the check sits just before paying.',
          ],
          explanation: 'Order matters because each step relies on what the earlier steps left behind. Two steps (the number and the amount) do not depend on each other, so either order works, but checking must come after both and paying after the check.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-01-match-1',
          kind: 'match',
          title: 'What is missing?',
          prompt: 'Each sentence is how a person might say an instruction. Match it to what a literal machine would be missing.',
          concept: 'gaps in instructions',
          labels: { terms: 'What a person says', meanings: 'What the machine is missing' },
          pairs: [
            { term: 'Add a little salt.', definition: 'An exact amount: "a little" means nothing to a machine', note: 'The sentence does give an item, so look for what it leaves unmeasured.' },
            { term: 'Pay when you are done.', definition: 'The order: done with which step, before or after what?', note: '"When you are done" depends on a step that the sentence never names.' },
            { term: 'Buy some eggs on the way home.', definition: 'A quantity and a fallback: how many, and what if there are none?', note: 'Two things are open here: how many eggs, and what to do if the shop has none.' },
            { term: 'Do it the usual way.', definition: 'Anything written down at all: "usual" lives only in a person\'s memory', note: 'The sentence contains no steps, only a pointer to something the machine has never seen.' },
          ],
          hints: [
            'For each sentence, find the word that a person understands from habit.',
            'Ask: could I count, measure or write down what that word means?',
            'One sentence names no steps at all; one names a step without saying which; one has two gaps.',
          ],
          explanation: 'Each vague phrase depends on something a person knows and a machine does not: an amount, an order, a quantity with a fallback, or a habit that was never written down. Exact instructions replace each of these with something stated.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-01-scenario-1',
          kind: 'scenario',
          title: 'The AI built the wrong thing',
          prompt: 'Choose the best next step.',
          concept: 'being exact',
          situation: 'You asked an AI assistant: "Make a program that tracks my expenses." It produced something quickly, but it is not what you pictured: it has no categories and it adds amounts you never entered. What is the best next step?',
          options: [
            {
              text: 'Write down exactly what you want (what one expense contains, what the program must show, two examples) and ask again with that description.',
              consequence: 'The assistant now has far fewer gaps to fill with guesses, and you have a description you can check the result against.',
              quality: 'best',
            },
            {
              text: 'Reply "that is wrong, try again" and keep repeating until it looks right.',
              consequence: 'Each try fills the same gaps with new guesses. You may get there, but you will not know why, and you cannot be sure it is right.',
              quality: 'acceptable',
            },
            {
              text: 'Decide the AI is bad at this and give up on the idea.',
              consequence: 'The gaps were in the request, not only in the tool. Giving up skips the skill that would have fixed it.',
              quality: 'poor',
            },
          ],
          hints: [
            'Where did the program get the idea of adding amounts you never entered?',
            'It filled a gap in your request with a guess.',
            'The fix that closes the gap is a clearer description, not a repeat of the same request.',
          ],
          explanation: 'The program matched the words you gave, and your words left gaps. Being exact (what an expense holds, what to show, examples) is how you steer an assistant, just as it is how you steer a literal machine.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-01-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Four words to know',
          prompt: 'Tap each card to check the meaning against your own words.',
          concept: 'program vocabulary',
          cards: [
            { front: 'Program', back: 'A list of instructions that a computer follows, in order, to do something.' },
            { front: 'Instruction', back: 'One small, exact step the computer can carry out, such as "show this message".' },
            { front: 'Code', back: 'The text a programmer writes to express those instructions.' },
            { front: 'Running a program', back: 'Asking the computer to follow the instructions, from the first to the last.' },
          ],
          hints: [],
          explanation: 'These four words are the base for the rest of the course: a program is made of instructions, written as code, and running it means the computer follows them.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-01-q1',
        prompt: 'Which description of a computer running a program is accurate?',
        choices: [
          'It works out what the programmer meant and fills in anything missing',
          'It carries out the instructions exactly as written, in the order written',
          'It decides for itself which step matters most and does that one before the others',
          'It skips any instruction it does not fully understand and carries on',
        ],
        answer: 1,
        explanation: 'A computer has no common sense to repair gaps. It follows what is written, in the order written, which is why exact instructions matter.',
      },
      {
        id: 'programming-fundamentals-01-q2',
        prompt: 'Version 1 of the meal order has the line "3. Pay." What is the best description of the problem, for a machine?',
        choices: [
          'The line is too short for a machine to read',
          'The line is in the wrong language for the counter',
          'It is fine, because everybody knows how to pay at any counter',
          'It does not say how much, how to pay, or what if the money runs short',
        ],
        answer: 3,
        explanation: 'A person fills in the amount and the way of paying without thinking. A machine cannot, so the step needs those details and a plan for when payment fails.',
      },
      {
        id: 'programming-fundamentals-01-q3',
        prompt: 'Step 3 of the exact meal order starts with "If the cashier says it is sold out". What does a step like that add?',
        choices: [
          'A fork: what happens next depends on an answer found while the steps run',
          'A pause: the machine stops and waits until a person tells it to carry on again',
          'A mistake: good instructions never depend on an answer',
          'A copy: the earlier steps are written out a second time',
        ],
        answer: 0,
        explanation: 'This is a decision. The steps that follow change depending on the answer, which is why the map of the steps has a fork at that point.',
      },
      {
        id: 'programming-fundamentals-01-q4',
        prompt: 'You are asked to "make something that tracks expenses". Which first move follows the habits of a programmer?',
        choices: [
          'Start typing and fix whatever goes wrong afterwards',
          'Wait for the machine to tell you what is missing',
          'Write down what one expense contains and what it must show, with an example',
          'Pick a programming language first, because every later step depends on which one you use',
        ],
        answer: 2,
        explanation: 'Being exact and checking with an example come before any code. The same description works in any language, so the language can wait.',
      },
      {
        id: 'programming-fundamentals-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In the picture of giving directions to a visitor, why is "Go to the market" not enough?',
        choices: [
          'Visitors usually ignore directions given in a hurry',
          'The visitor does only what is said, so gaps stay gaps',
          'The name of the market is too common for anyone to look up',
        ],
        answer: 1,
        explanation: 'The visitor stands for the machine: it does exactly what you say and cannot fill in turns you left out.',
      },
      {
        id: 'programming-fundamentals-01-q6',
        audience: { min: 'advanced' },
        prompt: 'A requirement says "give seniors a discount". A generated function runs without errors but treats age 60 differently from the team\'s expectation. Where did the defect enter?',
        choices: [
          'In the syntax, which a stricter compiler or a stricter language would have rejected',
          'In the hardware, which rounds numbers near boundaries',
          'In the review step only, since requirements are never a cause of defects',
          'In the specification: the threshold was never stated, so a guess filled it',
        ],
        answer: 3,
        explanation: 'Nothing was syntactically wrong. The requirement left the boundary unstated, so the model chose one. Stating the threshold and whether it is inclusive, with an example, closes the gap.',
      },
    ],
    task: {
      title: 'Turn an errand into exact steps',
      minutes: 15,
      steps: [
        'Choose a real errand that you do: ordering a meal, buying load, paying a fare, or buying something at a store.',
        'Write it the way you would tell a friend, as four to six short numbered lines.',
        'Beside each line, write the questions a literal-minded machine would ask (how much, which one, in what order, what if).',
        'Rewrite the steps with every gap answered. Include at least one step that depends on an answer.',
        'Write down two things that could still go wrong that your steps do not cover. You will reuse this work in the module project.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you are unsure what to pick, use "buy 50 pesos of load" and keep it to six steps. It is fine for your first version to have gaps: finding them is the exercise.'] },
      { audience: { min: 'advanced' }, steps: ['Write the same errand as a specification in under 120 words: inputs, preconditions, the result that means success, and three failure cases. Compare it with your steps and note which one you would rather hand to an AI assistant, and why.'] },
    ],
  },
  {
    id: 'programming-fundamentals-02',
    day: 2,
    title: 'How Computers Execute Instructions',
    summary: 'Follow a program through a simple model of a computer: the processor, memory, input and output, and the fetch, decode and execute cycle.',
    minutes: 25,
    skills: ['how-programs-work'],
    intro: {
      objectives: [
        'Name the parts of a computer that a program touches and say what each one does',
        'Describe the fetch, decode and execute cycle in your own words',
        'Trace a short program step by step and say what memory holds after each step',
      ],
      why: 'AI-written code does exactly what it says, one instruction after another. Being able to follow it step by step is how you find out whether it does what you meant.',
    },
    body: [
      {
        type: 'paragraph',
        text: `In the last lesson you wrote instructions for a machine that follows them exactly. This lesson looks at the machine itself: what is inside it, where it keeps your instructions, and what it does with them, one by one. You do not need to know electronics. A simple model of a computer is enough to explain why order matters, why a program can run very fast and still be wrong, and why code written by an AI does exactly what it says even when that is not what you meant.`,
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: `Picture a small neighborhood store with one very quick owner. A notebook on the counter lists the day's tasks, one per line, and the owner does them strictly in order: "take two eggs from the shelf", "add the price to the bill", "hand the bill to the customer". The shelf within arm's reach holds whatever the owner is working with right now. The storeroom at the back holds everything else, and it is still full when the shop closes. A customer's request comes in, and goods and a bill go out.`,
      },
      {
        type: 'paragraph',
        text: `In a computer, the owner is the **CPU** (central processing unit, the part that carries out instructions), the notebook is the **program**, the shelf within reach is **memory**, the storeroom is **storage**, the customer's request is **input** and what is handed back is **output**. The picture stops working in one place: the store owner understands what each task means, but a CPU understands nothing. It performs a small set of very simple operations, such as adding two numbers, comparing them, copying a value or jumping to a different instruction, and it does billions of them every second.`,
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'table',
        headers: ['Part', 'What it does', 'In the store picture'],
        rows: [
          ['CPU (processor)', 'Carries out instructions, one at a time', 'The owner'],
          ['Memory', 'Holds the program and the values it is using right now; it is emptied when the power goes off', 'The shelf within reach'],
          ['Storage', 'Keeps files and apps for good, even when the device is off', 'The storeroom'],
          ['Input', 'Brings something in: a tap, a key press, a photo, a message', 'A customer asking for something'],
          ['Output', 'Sends something out: a picture on the screen, a sound, a message', 'Goods and the bill handed over'],
        ],
        caption: 'The parts of a computer that a program touches.',
      },
      {
        type: 'paragraph',
        text: `When you open an app, its instructions are copied from storage into memory, because the CPU reads instructions from memory, which is far faster to reach than storage. Then the CPU repeats one small cycle, over and over:`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Fetch.** Read the next instruction from memory. The CPU keeps a marker that says which instruction is next.',
          '**Decode.** Work out what that instruction asks for.',
          '**Execute.** Do it: add two numbers, copy a value, send something to the screen.',
          '**Move on.** Advance the marker to the next instruction and start again.',
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The fetch, decode and execute cycle, simplified. Real processors overlap these steps, but the idea is the same.',
        source: `flowchart TD
  A(Start the program) --> B[Fetch the next instruction from memory]
  B --> C[Decode: work out what it asks for]
  C --> D[Execute: carry it out]
  D --> E{Is the program finished?}
  E -->|no| B
  E -->|yes| F(Stop)`,
      },
      {
        type: 'paragraph',
        text: `Most instructions simply mean "then do the next one". A few mean "carry on from instruction 12 instead". That small ability to jump is how a program makes decisions and repeats steps, and later modules teach it as conditions and loops. Inside memory, instructions and values are stored as patterns of ones and zeros. Nobody writes those by hand; the next lesson explains the languages and tools that translate for us.`,
      },
      {
        type: 'paragraph',
        text: `Notice what is not in this picture: no understanding and no judgment. The CPU does not know that a number is a price or that a message is an apology. It moves and combines values as told. Speed is the only thing it has plenty of, which is why a small mistake can be repeated a million times before you blink.`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: `In plain words: when you tap an app's icon, your phone copies the app from where it lives when closed (storage) onto the working shelf (memory). The processor then reads the app's first instruction, does it, reads the next one, does that, and so on, a very long list followed in order, very fast. Your tap is input. What you see change on the screen is output. A "chip" is a tiny electronic part; the CPU is the chip that follows the instructions. Nothing else is going on inside, however clever the app seems.`,
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: `The model above is the textbook sequential view. Real processors pipeline (fetching the next instruction while executing this one), keep hot data in registers and caches because main memory is slow compared with the core, predict branches, reorder work internally while preserving the visible result, and have several cores that an operating system shares between processes by switching quickly. Two consequences matter when you review generated code: performance often depends on memory access patterns as much as on instruction counts, and a sequence that is correct on paper can interleave in concurrent code, a class of bugs that models write readily and short tests rarely expose.`,
      },
      { type: 'heading', text: 'Walk through an example' },
      {
        type: 'paragraph',
        text: `Let us follow a tiny imaginary machine. Its memory has three labelled cells, A, B and C, and each cell holds one number at a time. It understands only three instructions: **PUT** places a number in a cell, **MULTIPLY** multiplies two cells and places the result in a third, and **SHOW** sends a cell's value to the output. Real machines use numbers for instructions; these words are only for people. The story: a jeepney ride costs 24 pesos and you ride 3 times.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'A program for an imaginary machine (not a real language)',
        code: `1  PUT 24 IN A
2  PUT 3 IN B
3  MULTIPLY A BY B, PUT THE RESULT IN C
4  SHOW C
5  PUT 10 IN C
6  SHOW C`,
      },
      {
        type: 'paragraph',
        text: `Each row of the table below is one trip around the cycle: fetch the numbered instruction, decode it, execute it. The dashes mean "nothing has been put in that cell yet".`,
      },
      {
        type: 'table',
        headers: ['Step', 'Instruction executed', 'A', 'B', 'C', 'Output so far'],
        rows: [
          ['(start)', 'none yet', '-', '-', '-', 'nothing'],
          ['1', 'PUT 24 IN A', '24', '-', '-', 'nothing'],
          ['2', 'PUT 3 IN B', '24', '3', '-', 'nothing'],
          ['3', 'MULTIPLY A BY B, PUT THE RESULT IN C', '24', '3', '72', 'nothing'],
          ['4', 'SHOW C', '24', '3', '72', '72'],
          ['5', 'PUT 10 IN C', '24', '3', '10', '72'],
          ['6', 'SHOW C', '24', '3', '10', '72, 10'],
        ],
        caption: 'Tracing the program: what memory holds after each instruction.',
      },
      {
        type: 'list',
        items: [
          'After step 3, cell C holds 72 because 24 times 3 is 72. The machine did not know this was a total; it only multiplied two numbers.',
          'Step 5 put 10 in C. A cell holds one value at a time, so the 72 is gone, and the second SHOW prints 10, not 72.',
          'Order matters. If you swapped lines 4 and 5, the machine would put 10 in C first, and both SHOW instructions would print 10.',
        ],
      },
      {
        type: 'paragraph',
        text: `Tracing like this, with a table that records what each cell holds after each line, is the most reliable way to understand any program, including one an AI wrote. You will use it again and again.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: `Use any AI assistant as a tutor and a puzzle-maker. Ask it to make you work, not to hand you answers.`,
      },
      {
        type: 'prompt',
        label: 'Explain it back',
        text: `Act as a patient teacher. Explain how a computer runs a program using the picture of a store with an owner, a notebook of tasks, a shelf within reach and a storeroom, in about 150 words. Then ask me to explain, in my own words, what the shelf is for. Wait for my answer and tell me what I got right and what I should adjust. Do not give me the full answer before I try.`,
      },
      {
        type: 'prompt',
        label: 'Make me a puzzle',
        text: `Invent a program for an imaginary machine that has only three instructions: PUT a number IN a cell, MULTIPLY two cells and put the result in a third cell, and SHOW a cell. Make it six lines long and use cells A, B and C. Do not tell me what it prints. Ask me to trace it and tell you what each cell holds after each line, then check my answer step by step.`,
      },
      {
        type: 'paragraph',
        text: `What to look for: does the puzzle use only the three instructions, or did the AI sneak in a fourth? Trace the puzzle yourself with a table before you accept the AI's checking, because an AI can slip on arithmetic or on which cell holds what, and still sound sure. If your table and its answer disagree, find the first row where they differ. That row is the useful part.`,
      },
      {
        type: 'takeaways',
        items: [
          'A program touches five parts of a computer: the CPU follows instructions, memory holds what is in use, storage keeps things for good, input brings data in and output sends results out.',
          'The CPU repeats a cycle: fetch the next instruction, decode it, execute it, move on.',
          'Instructions run in order unless an instruction sends the CPU somewhere else, which is how decisions and repeats work.',
          'A memory cell holds one value at a time: a new value replaces the old one.',
          'The CPU has no understanding, only speed, so it does exactly what is written and a trace table is the way to see it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-02-arrange-1',
          kind: 'arrange',
          title: 'One trip around the cycle',
          prompt: 'Put the four steps of the cycle in the order the CPU performs them.',
          concept: 'fetch, decode, execute',
          language: 'text',
          solution: [
            'Fetch: read the next instruction from memory.',
            'Decode: work out what the instruction asks for.',
            'Execute: carry the instruction out.',
            'Move on: point to the next instruction and start again.',
          ],
          reasons: [
            'The CPU cannot do anything until it has the instruction in hand.',
            'It must know what is being asked before it can act on it.',
            'Only after fetching and decoding can it carry the instruction out.',
            'The cycle repeats, so the marker moves on once this instruction is done.',
          ],
          hints: [
            'Think of the store owner: read the line, understand it, do it, go to the next line.',
            'You cannot decode something you have not fetched.',
            'Executing comes third, and moving on closes the loop.',
          ],
          explanation: 'Each instruction goes through fetch, decode and execute before the CPU moves to the next one, and then the cycle starts again until the program is finished.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-02-predict-output-1',
          kind: 'predict-output',
          title: 'What does the machine print?',
          prompt: 'Trace this program for the imaginary machine. Keep a table of A, B and C in your head or on paper. What does it print?',
          concept: 'tracing a program',
          language: 'text',
          code: `1  PUT 5 IN A
2  PUT 4 IN B
3  MULTIPLY A BY B, PUT THE RESULT IN C
4  PUT 2 IN A
5  MULTIPLY A BY B, PUT THE RESULT IN C
6  SHOW C`,
          expected: '8',
          choices: ['8', '20', '28', '2'],
          wrongNotes: {
            '20': 'That is what C held after line 3. Line 5 runs a second multiplication and replaces it.',
            '28': 'The machine does not add the results together. Each MULTIPLY puts its result in C and the old value is gone.',
            '2': 'A holds 2 after line 4, but the instruction on line 6 shows C, not A.',
          },
          hints: [
            'Write A, B and C down and update them after every line.',
            'Line 4 changes A, but it does not change B.',
            'After line 5, C holds A times B again, using the new A.',
          ],
          explanation: 'After line 3, C is 20. Line 4 changes A to 2, so line 5 multiplies 2 by 4 and replaces C with 8. Line 6 shows C, so the output is 8.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-02-match-1',
          kind: 'match',
          title: 'Which part is at work?',
          prompt: 'Match each thing that happens on a phone to the part of the computer responsible.',
          concept: 'parts of a computer',
          labels: { terms: 'What happens', meanings: 'The part responsible' },
          pairs: [
            { term: 'Your saved expenses are still there after you restart the phone', definition: 'Storage', note: 'Think about what survives when the power goes off.' },
            { term: 'The score of the game you are playing is ready for the next instruction', definition: 'Memory', note: 'This is the working shelf, in use right now.' },
            { term: 'You tap the Save button', definition: 'Input', note: 'Something is coming in from you.' },
            { term: 'The word Saved appears on the screen', definition: 'Output', note: 'Something is going out to you.' },
            { term: 'Instructions are followed one at a time, billions of times a second', definition: 'CPU', note: 'This is the part that does the following.' },
          ],
          hints: [
            'Ask which parts keep things when the power is off, and which do not.',
            'Input comes from the person, output goes to the person.',
            'The part that carries out instructions is the CPU.',
          ],
          explanation: 'Storage keeps things for good, memory holds what is in use, input and output carry data in and out, and the CPU carries out the instructions.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-02-q1',
        prompt: 'A game is running and the score changes every second. Where is the current score held while the game runs?',
        choices: [
          'In storage, because that is where everything on the computer lives',
          'In the input, because you caused the score to change',
          'In memory, which holds what the program is using right now',
          'In the output, because that is where it is shown',
        ],
        answer: 2,
        explanation: 'Memory is the working shelf: it holds the values a program is using right now. Storage keeps files for good, and output is only where a result is sent to be seen.',
      },
      {
        id: 'programming-fundamentals-02-q2',
        prompt: 'The CPU has just fetched an instruction. What does it do before it carries the instruction out?',
        choices: [
          'It decodes the instruction: it works out what is being asked',
          'It saves the instruction to storage so that it is not lost',
          'It asks the programmer whether the instruction is correct',
          'It skips ahead to the end of the program to see how it finishes',
        ],
        answer: 0,
        explanation: 'The cycle is fetch, decode, execute. Decoding is how the CPU works out what to do before it does it.',
      },
      {
        id: 'programming-fundamentals-02-q3',
        prompt: 'In the imaginary machine, A holds 6 and B holds 2. The next instruction is MULTIPLY A BY B, PUT THE RESULT IN A. What does A hold afterwards?',
        choices: ['8', '4', '12', '18'],
        answer: 2,
        explanation: '6 times 2 is 12, and the result is placed in A, replacing the 6. A cell holds one value at a time.',
      },
      {
        id: 'programming-fundamentals-02-q4',
        prompt: 'Why does swapping two lines of a program often change what it prints?',
        choices: [
          'Because the CPU runs the lines in a random order each time it starts',
          'Because instructions run in order and each can change memory',
          'Because the screen redraws lines in alphabetical order',
          'Because lines near the top of a program always run faster',
        ],
        answer: 1,
        explanation: 'Instructions run in order, and each one can change memory. Swap two of them and the later one sees different values, as in the trace where swapping lines 4 and 5 printed 10 twice.',
      },
      {
        id: 'programming-fundamentals-02-q5',
        audience: { max: 'beginner' },
        prompt: 'What happens when you open an app?',
        choices: [
          'Its instructions are copied from storage into memory and the CPU follows them',
          'The screen reads the app\'s files and tells the CPU which pictures and sounds to draw',
          'The CPU downloads a fresh copy of the app from the internet every time',
        ],
        answer: 0,
        explanation: 'The app lives in storage while closed. To run, its instructions are copied into memory, and the CPU fetches, decodes and executes them in order.',
      },
      {
        id: 'programming-fundamentals-02-q6',
        audience: { min: 'advanced' },
        prompt: 'A generated function passes every test but is slow on large inputs, and profiling shows the core mostly waiting. Which explanation fits the extended model best?',
        choices: [
          'Decoding is slow for long programs, so cutting the file down would fix the delay',
          'The function loads its instructions from storage again on every call',
          'The access pattern keeps missing the caches, so the core waits on main memory',
          'The screen refreshes once per instruction, which throttles the CPU',
        ],
        answer: 2,
        explanation: 'Main memory is slow compared with the core, and caches hide that only when data is accessed in friendly patterns. A function can be correct and still wait on memory.',
      },
    ],
    task: {
      title: 'Be the CPU',
      minutes: 15,
      steps: [
        'Write a program of five to seven lines for the imaginary machine that works out what a week of jeepney fares costs (a fare of 24 pesos, 5 days of riding). Use only PUT, MULTIPLY and SHOW.',
        'Draw a trace table with columns for each instruction and for cells A, B and C. Fill it in row by row, as the CPU would.',
        'Write down what the program prints.',
        'Swap two lines of your program and predict, before tracing, how the output changes. Then trace again to check your prediction.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw three boxes on paper labelled A, B and C. Each time an instruction runs, cross out the old number in the box and write the new one. Seeing the old value get crossed out helps you remember that a cell holds only one value.'] },
      { audience: { min: 'advanced' }, steps: ['Add one instruction to the machine: ADD A TO B, PUT THE RESULT IN C. Rewrite your fare program using only PUT, ADD and SHOW, and count how many instructions it needs compared with the MULTIPLY version. Note what that suggests about why programs need a way to repeat steps.'] },
    ],
  },
  {
    id: 'programming-fundamentals-03',
    day: 3,
    title: 'Programming Languages and How Applications Are Built',
    summary: 'Learn what a programming language is, the difference between syntax and meaning, and how an application is built from a frontend, a backend and a database.',
    minutes: 25,
    skills: ['how-programs-work'],
    intro: {
      objectives: [
        'Explain what a programming language is and tell syntax from meaning',
        'Name the frontend, the backend and the database of an application and say what each one does',
        'Decide which part of an application a given problem belongs to',
      ],
      why: 'When an AI builds an app for you, it builds all of these parts at once. Knowing which part does what is how you describe a problem to it, and how you tell whether its fix went to the right place.',
    },
    body: [
      {
        type: 'paragraph',
        text: `A computer's own instructions are patterns of numbers, and nobody wants to write them by hand. This lesson covers two things that sit above that. The first is the programming language: the precise way people write instructions. The second is the way a typical application is put together from parts that each do one job. Together they give you a map, and you will need that map whenever an AI assistant builds something and you have to know what it built.`,
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: `A programming language is like the form at a bank counter. The deposit slip has boxes in fixed places, the amount goes in as digits, and the teller refuses a slip filled in as a poem, however kind the poem. The strictness is the point: it leaves no room for the teller to guess.`,
      },
      {
        type: 'paragraph',
        text: `An application is like a restaurant. The dining room is where customers sit and order. The kitchen applies the rules and prepares the food. The pantry stores ingredients until they are needed. The picture stops working in two places. Restaurant staff improvise, while the parts of an app talk to each other only through strict messages. And some apps are more like a food stall than a restaurant: a simple calculator has no kitchen at all, because it does everything on your phone.`,
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: `A **programming language** is a precise, limited way of writing instructions so that people can read them and a machine can run them. It is limited on purpose: a small set of words and strict rules, with nothing left to guess. Two ideas help you talk about any language.`,
      },
      {
        type: 'list',
        items: [
          '**Syntax** is the set of rules for how an instruction must be written: the spelling, the punctuation, the order of the pieces. An instruction with broken syntax cannot even be read by the machine.',
          '**Semantics** is what an instruction means, in other words what it does when it runs. An instruction can have perfect syntax and still mean something other than what you intended.',
        ],
      },
      {
        type: 'paragraph',
        text: `In English: "The the eats monkey banana" breaks the rules, so it is a syntax problem. "The banana eats the monkey" follows the rules perfectly and means something, just not what you meant if you were describing lunch. Programming has both kinds of trouble. The first is usually easy to notice, because the machine refuses the line. The second is the one that costs you time, because the machine happily runs it.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'The same instruction, "show a message", in three real languages (for comparison only)',
        code: `Python:      print("Hello, Talino!")
JavaScript:  console.log("Hello, Talino!")
Ruby:        puts "Hello, Talino!"`,
      },
      {
        type: 'paragraph',
        text: `Each of the three lines shows the same message when it runs. The spelling differs (that is syntax), and the meaning is the same (that is semantics). You do not need to learn all three. The machine's own instructions are numbers, so a language also needs a translator, a program that turns what you wrote into something the machine can run, either all at once ahead of time or step by step as it goes. Module 10 explains this properly.`,
      },
      {
        type: 'paragraph',
        text: `This course practises in **JavaScript**, simply because Talino can run it for you. Most widely used languages share the same big ideas (storing values, making decisions, repeating steps, reusing instructions), so what you learn here carries over, and a different language is mostly a different spelling.`,
      },
      {
        type: 'paragraph',
        text: `Now the application. Most apps that keep data or talk to other people have three main parts:`,
      },
      {
        type: 'table',
        headers: ['Part', 'Its job', 'In an expense tracker', 'Where it runs'],
        rows: [
          ['Frontend', 'What the person sees and touches; it sends requests to the backend', 'The screen where you type an expense and press Save', 'On the person\'s own device: a phone or a browser'],
          ['Backend', 'The program that holds the rules and talks to the database', 'Refuses a negative amount, saves the expense, replies', 'On a server: a computer that stays on and answers requests'],
          ['Database', 'Organized storage that lasts', 'The list of every expense you ever saved', 'On or next to the server'],
        ],
        caption: 'The three main parts of an application.',
      },
      {
        type: 'paragraph',
        text: `Someone who works on all of these parts is called a **full-stack** developer, and the layers together are the app's "stack". Not every app has all three: a calculator needs no server, and a small notes app can keep its data in your phone's own storage. Different parts are often written in different languages. A web page's frontend runs HTML, CSS and JavaScript in the browser, a backend can be written in many languages (JavaScript and Python are common), and a phone app uses whatever its platform supports.`,
      },
      {
        type: 'visual',
        id: 'web-frontend-backend',
        caption: 'Which work happens on the device and which on the server. Press the buttons to explore.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: `In plain words: think of ordering at a restaurant. You never walk into the kitchen. You tell the waiter what you want, the kitchen decides whether it can make it and checks the rules (sold out? too spicy for the child's meal?), the pantry supplies the ingredients, and the waiter brings the plate back. In an app, the screen is the dining room, the backend is the kitchen, and the database is the pantry. A "server" is simply a computer that stays on all the time, waiting to answer requests from phones and browsers.`,
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: `The split is also a trust boundary. Anything that runs on the user's device can be inspected and altered by the user, so a check that lives only in the frontend (a positive amount, a valid discount, a permission) is a convenience, not a control. Rules that matter must be enforced where the user cannot change them, and the backend must treat every request as untrusted input, whichever client sent it. When reviewing an AI-generated application, look for exactly this: validation duplicated for the user's benefit in the frontend, but enforced only there.`,
      },
      { type: 'heading', text: 'Walk through an example' },
      {
        type: 'paragraph',
        text: `Follow one action through the parts: you type 24 for a jeepney fare in the transport category and press Save in an expense tracker.`,
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'One action, passed from part to part and back.',
        source: `sequenceDiagram
  actor U as You
  participant F as Frontend
  participant B as Backend
  participant D as Database
  U->>F: Type 24 and press Save
  F->>B: Please save this expense
  B->>D: Store jeepney fare, 24, transport
  D-->>B: Stored
  B-->>F: Saved, here is the new list
  F-->>U: Shows the updated list`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'You press Save. That is input, and the frontend takes it from there.',
          'The frontend sends a message to the backend asking it to save the expense.',
          'The backend checks its rules (is 24 a valid amount?) and asks the database to store it.',
          'The database stores the expense for good and says so.',
          'The backend replies, and the frontend draws the new list on your screen. That is output.',
        ],
      },
      {
        type: 'paragraph',
        text: `Knowing the path lets you point at the right place when something goes wrong, which is what you need when you ask an AI to fix it. A first guess, not a certainty, looks like this:`,
      },
      {
        type: 'table',
        headers: ['What you notice', 'Where to look first'],
        rows: [
          ['The Save button is the wrong color', 'The frontend: it controls how things look'],
          ['The app accepts an amount of minus 500 even though it should not', 'The rules: they live in the backend (and a frontend check alone is not enough)'],
          ['Every expense is gone after you close and reopen the app', 'The database or storage: the data was never kept, or never loaded back'],
        ],
        caption: 'Symptoms and the part to suspect first.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: `Use any assistant as a quiz master. Keep your questions free of private details: a made-up expense tracker is all you need.`,
      },
      {
        type: 'prompt',
        label: 'Sort the features',
        text: `Explain the parts of an application (frontend, backend and database) using a restaurant picture, in about 120 words. Then give me three small features of an expense tracker app and ask me which part is mainly responsible for each. Ask one feature at a time, wait for my answer, and tell me why it is right or wrong. Do not reveal an answer before I try.`,
      },
      {
        type: 'prompt',
        label: 'Syntax and meaning',
        text: `Show me the instruction "show the word Hello on the screen" in three different programming languages. For each one, tell me which parts are syntax (the spelling and punctuation the language requires) and what the meaning of the instruction is. Then tell me one way the three are different and one way they are the same.`,
      },
      {
        type: 'paragraph',
        text: `What to look for: does the assistant keep the three parts separate, or does it blur them? Also watch for hard rules stated too confidently, such as "language X is only for the backend". Most languages are used in several places, and many apps blur the lines. If you can run a line in a free online tool, try the three lines the AI gave you and see whether they really behave as it said.`,
      },
      {
        type: 'takeaways',
        items: [
          'A programming language is a precise, limited way of writing instructions so that people can read them and a machine can run them.',
          'Syntax is how an instruction must be written; semantics is what it does. A line can be perfectly written and still do the wrong thing.',
          'The ideas in this course carry across languages; JavaScript is the practice language because Talino can run it.',
          'Most apps have a frontend (what you see and touch), a backend (rules and decisions) and a database (storage that lasts); full-stack means working across them.',
          'Knowing which part a problem belongs to helps you describe it clearly, to a teammate or to an AI.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-03-match-1',
          kind: 'match',
          title: 'Which part, which kind of problem?',
          prompt: 'Each line describes something in an app. Match it to the part responsible, or to the kind of problem it shows.',
          concept: 'parts of an application and syntax versus meaning',
          labels: { terms: 'What happens', meanings: 'What it points to' },
          pairs: [
            { term: 'The Save button turns green while it is pressed', definition: 'Frontend', note: 'This is about how the app looks to the person using it.' },
            { term: 'A rule refuses a negative amount before anything is stored', definition: 'Backend', note: 'Rules and decisions about what to accept live here.' },
            { term: 'Every expense you saved last month is still there today', definition: 'Database', note: 'Something has kept the data for a long time.' },
            { term: 'A line with a missing closing bracket that the machine cannot read at all', definition: 'A syntax problem', note: 'The machine could not even read the line, so the rules of writing were broken.' },
            { term: 'A line written perfectly that adds the fare twice', definition: 'Correct syntax, wrong meaning', note: 'The machine ran it happily. It just did not do what was meant.' },
          ],
          hints: [
            'First sort the three about parts of an app from the two about lines of code.',
            'Which part decides, which part draws, which part remembers?',
            'A line the machine refuses to read is a syntax problem; a line it runs but that does the wrong thing has the wrong meaning.',
          ],
          explanation: 'The frontend shows, the backend decides, and the database remembers. Separately, code can fail by breaking the rules of writing (syntax) or by doing something other than intended (meaning).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-03-scenario-1',
          kind: 'scenario',
          title: 'Ask the AI to fix the right thing',
          prompt: 'Choose the request that is most likely to get a useful fix.',
          concept: 'which part a problem belongs to',
          situation: 'An AI assistant built you a small expense tracker. It works, but every expense you save disappears when you close and reopen the app. You want the assistant to fix it. Which request is best?',
          options: [
            {
              text: 'Say: "Expenses I save are gone after I reopen the app. Check where they are stored and make sure they are saved and loaded back when the app starts."',
              consequence: 'You described the symptom and pointed at the likely part (storage). The assistant can look in the right place and you can test the result by closing and reopening the app.',
              quality: 'best',
            },
            {
              text: 'Say: "The app loses my expenses, please fix it", and let the assistant decide where to look.',
              consequence: 'The symptom is clear, so this may work, but the assistant may change the wrong part and you would not know where to check.',
              quality: 'acceptable',
            },
            {
              text: 'Say: "Make the Save button bigger so the expenses are saved better."',
              consequence: 'The size of a button is a frontend matter. It cannot change whether the data is kept, so the problem stays.',
              quality: 'poor',
            },
          ],
          hints: [
            'Which part of an app is supposed to keep data for good?',
            'A good request names what you see and where you suspect the cause.',
            'You can test the result by closing and reopening the app.',
          ],
          explanation: 'Data that disappears points to storage, the database side of the app. Naming the symptom and the likely part gives the assistant a precise target and gives you a test.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-03-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the definitions',
          prompt: 'Fill each blank with the right word from the bank.',
          concept: 'language and application vocabulary',
          language: 'text',
          code: `A ___ is a precise, limited way of writing instructions.
The required spelling and punctuation are the ___ of the language.
What an instruction actually does when it runs is its ___.
The part of an app that applies rules and talks to the database is the ___.`,
          blanks: [
            { answers: ['programming language'], feedback: 'The first sentence defines the language itself, not a part of an app.' },
            { answers: ['syntax'], feedback: 'The rules of how a line is written are its syntax.' },
            { answers: ['semantics'], feedback: 'What the line means or does is its semantics.' },
            { answers: ['backend'], feedback: 'The frontend shows things and the database stores them; the part that applies the rules is the backend.' },
          ],
          bank: ['programming language', 'syntax', 'semantics', 'backend', 'frontend', 'database'],
          hints: [
            'Two of the blanks are about a line of code and two are about an app.',
            'Spelling and punctuation rules versus meaning: which is syntax and which is semantics?',
            'The frontend shows, the database stores, so the rule-keeper is left.',
          ],
          explanation: 'A programming language is defined by its rules (syntax) and by what its instructions do (semantics). In an app the backend holds the rules and talks to the database.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-03-q1',
        prompt: 'Why do programming languages have strict rules instead of working like everyday English?',
        choices: [
          'Because machines can only remember very short sentences',
          'Because strict rules make every program run noticeably faster on any device',
          'Because English has too few words to describe instructions',
          'Because strict rules leave no room for guessing what an instruction means',
        ],
        answer: 3,
        explanation: 'A machine cannot use common sense to repair a loose sentence. Limited words and strict rules mean each instruction has one clear meaning.',
      },
      {
        id: 'programming-fundamentals-03-q2',
        prompt: 'A line of code is spelled correctly and the machine runs it, but it adds the fare twice. Which statement is right?',
        choices: [
          'The syntax is wrong, because the result is wrong',
          'The syntax is fine, but what the line does is not what was meant',
          'The meaning is fine, because the machine ran the line without refusing it',
          'Both are fine, because the machine would have complained otherwise',
        ],
        answer: 1,
        explanation: 'Syntax is about whether the line is written by the rules, and this one is. The meaning (what it does) is where the mistake is, and the machine cannot notice that for you.',
      },
      {
        id: 'programming-fundamentals-03-q3',
        prompt: 'An expense app still shows everything you saved when you open it tomorrow. Which part is mainly responsible for keeping that data?',
        choices: [
          'The database, which stores the data so that it lasts',
          'The frontend, which draws the list on the screen',
          'The programming language, which remembers values between days',
          'The output, which keeps a copy of what it displays',
        ],
        answer: 0,
        explanation: 'The frontend draws what it is given, and the language only describes instructions. The database is the part whose job is storage that lasts.',
      },
      {
        id: 'programming-fundamentals-03-q4',
        prompt: 'Which statement about a "full-stack" developer is correct?',
        choices: [
          'They build apps using only a single programming language from start to finish',
          'They work with apps that have a very large database',
          'They work across the frontend, the backend and the data behind them',
          'They write servers, never anything the user can see',
        ],
        answer: 2,
        explanation: 'Full-stack means working across the layers of an app: what the user sees, the rules behind it and the data storage. It says nothing about how many languages or how much data.',
      },
      {
        id: 'programming-fundamentals-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In the restaurant picture, which part of an app is the kitchen?',
        choices: [
          'The frontend, where customers are seated and served their meals',
          'The database, where the ingredients are kept until they are needed later',
          'The backend, where the rules are applied and the order is prepared',
        ],
        answer: 2,
        explanation: 'The dining room is the frontend, the pantry is the database, and the kitchen, where the work is decided and done, is the backend.',
      },
      {
        id: 'programming-fundamentals-03-q6',
        audience: { min: 'advanced' },
        prompt: 'In an AI-generated expense app, the rule "amount must be positive" is checked only in the frontend form. What is the problem?',
        choices: [
          'A request that skips or alters the form can send a negative amount, so the backend must enforce the rule too',
          'Frontends cannot check numbers, so the rule never runs',
          'Backends are always faster at checking, so the frontend is wasted work',
          'Databases refuse every value that a frontend has already checked',
        ],
        answer: 0,
        explanation: 'Code on the user\'s device can be bypassed or changed. The frontend check helps honest users, but the backend must enforce any rule that matters.',
      },
    ],
    task: {
      title: 'Map an app you use',
      minutes: 15,
      steps: [
        'Pick an app you use often, such as a ride-booking, e-wallet or food ordering app.',
        'List five things you can do in it, for example log in, see your history, pay, send a message or change a setting.',
        'Next to each, write which part you think does the main work: frontend, backend or database, and one sentence on why.',
        'Mark the two you are least sure about, and write a question for each that you could ask an AI assistant.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If it is hard to guess, use the expense tracker from this lesson: saving an expense, seeing last month, checking that an amount is valid, changing a color, and keeping data after you close the app.'] },
      { audience: { min: 'advanced' }, steps: ['Draw the request path for one feature and mark where each rule is enforced and where data is stored. Name one place where a check exists only on the user\'s device and say what you would add on the server.'] },
    ],
  },
  {
    id: 'programming-fundamentals-04',
    day: 4,
    title: 'How AI Is Changing Software Development',
    summary: 'See what AI coding assistants do well and badly, why the fundamentals matter more now, and the four jobs that stay with you: direct, read, judge and test.',
    minutes: 25,
    skills: ['ai-partner', 'how-programs-work'],
    intro: {
      objectives: [
        'Describe what AI coding assistants do well and where they go wrong',
        'Explain why understanding programming matters more, not less, when AI writes code',
        'Name your four jobs when working with an AI assistant and apply them to a short answer',
      ],
      why: 'You are likely to build software by directing an AI. Knowing honestly what it can and cannot be trusted with is what separates a result you can ship from one that only looks finished.',
    },
    body: [
      {
        type: 'paragraph',
        text: `AI assistants can now write working code from a description in plain words, explain code you do not understand and suggest fixes. That changes how software is made, and it changes what is worth learning. This lesson is honest about both sides: what these tools do well, where they fail, why the ideas in this course matter more now rather than less, and the four jobs that stay with you. It does not predict the future. It describes what the tools' own documentation says today, and how to work with them.`,
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: `Picture a new apprentice at a repair shop who has read every manual ever printed but has never touched an engine. The apprentice is fast and tireless, and drafts a repair plan in seconds. Most of the time the plan is sensible. Sometimes it names a part that does not exist, or skips a step that the car in front of you needs, and it says so in the same confident voice. You are the head mechanic. Nothing leaves the shop until you have checked it.`,
      },
      {
        type: 'paragraph',
        text: `The picture stops working in one place: a human apprentice usually knows when they are unsure and says so. An AI assistant may not. How sure it sounds tells you very little about how right it is.`,
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: `An AI coding assistant is built on a **language model**: a program trained on a very large amount of text and code that writes new text by predicting what is likely to come next, one small piece at a time, given your request and anything else it can see. For common problems the likely answer is often right. But it is a prediction from patterns, not a lookup of facts and not a machine that understands your goal. Module 11 goes deeper; for now it is enough to keep this in mind.`,
      },
      {
        type: 'visual',
        id: 'ai-model-input-output',
        caption: 'A simplified illustration: the model guesses the next piece of text, again and again. It shows an idea, not a real model.',
      },
      {
        type: 'paragraph',
        text: `You meet these assistants in three common ways. In a **chat**, you describe what you want and get code or an explanation back. Inside an **editor**, it suggests code as you type. As an **agent**, it reads the files of a whole project, edits several of them, runs commands and reports what it did. The note below names what some official documentation says today.`,
      },
      {
        type: 'version',
        text: `As described in their own documentation on ${CHECKED}: Claude Code is an agentic coding tool that reads your codebase, edits files and runs commands. GitHub Copilot is described as offering code suggestions that you review and apply, chat help, and an agent that takes a goal, edits files and prepares changes for your review. Cursor's documentation describes a coding agent that can plan and implement features and fix bugs, and lets you inspect diffs (the lines a change adds and removes) and run checks before you merge. Product names, features and plans change often, so check the pages before you rely on any detail.`,
        checked: CHECKED,
        sources: [DOCS.claudeCode, DOCS.copilotWhat, DOCS.cursorDocs],
      },
      {
        type: 'table',
        headers: ['Kind of task', 'How it usually goes', 'What you do'],
        rows: [
          ['Common, well-known tasks, such as totalling a list', 'Often well: there are many examples to learn from', 'Run it anyway'],
          ['Explaining what a piece of code does', 'Often well, but the explanation can be wrong', 'Check the explanation against what the code really does'],
          ['First drafts and tests', 'Fast and useful', 'Read the tests too: they can check the wrong thing'],
          ['Your own rules, such as a discount or a tax', 'Badly unless you state them: it cannot know them', 'State them, with examples'],
          ['Newer or rare libraries and commands', 'Risky: it can invent names that do not exist or use outdated ones', 'Check the official documentation'],
          ['Awkward cases: empty lists, zero, mistyped values', 'Unreliable: plausible code can quietly skip them', 'Test them yourself'],
        ],
        caption: 'Where assistants help and where you must stay alert.',
      },
      {
        type: 'paragraph',
        text: `A **hallucination** is confident output that is false or invented, such as a function that does not exist or an explanation that sounds right and is not. It is not rare bad luck. It is a known limit of these models, and the next note shows how their makers describe it.`,
      },
      {
        type: 'version',
        text: `On ${CHECKED}: GitHub's application card for Copilot Chat says it may generate code that appears valid but is not correct, and that its users are responsible for reviewing and validating the responses. Anthropic's documentation says even the most advanced language models can generate factually incorrect text, calls this hallucination, and says its techniques reduce hallucinations without eliminating them, so critical information should always be validated.`,
        checked: CHECKED,
        sources: [DOCS.copilotChatCard, DOCS.claudeHallucinations],
      },
      {
        type: 'paragraph',
        text: `This is why the fundamentals matter more now. If a person typed every line, the typing was the hard part. If an assistant types it, the hard part is the rest: saying exactly what you want (lesson 1), following what the code really does, one instruction after another (lesson 2), knowing which part of the app a problem belongs to (lesson 3), and telling right from plausible. A person who cannot do those things cannot tell a correct answer from a convincing one. DORA's 2025 report on AI-assisted software development, a finding about organizations, describes AI's main role as an amplifier of existing strengths and weaknesses. The same logic fits a learner: it magnifies the skill, or the gaps, that you bring.`,
      },
      {
        type: 'version',
        text: `On ${CHECKED}: the DORA 2025 report page describes AI's primary role in software development as an amplifier, magnifying an organization's existing strengths and weaknesses, and says the greatest returns come not from the tools themselves. The finding is about organizations; applying it to an individual learner is this course's own reading of it.`,
        checked: CHECKED,
        sources: [DOCS.dora2025],
      },
      {
        type: 'paragraph',
        text: `So your role is four jobs, and they repeat every time you work with an assistant:`,
      },
      {
        type: 'list',
        items: [
          '**Direct.** State the goal, what goes in, what should come out, and an example or two.',
          '**Read.** Follow what the code or the steps actually do, one instruction at a time.',
          '**Judge.** Compare what it does with what you meant, and decide whether it is right, safe and simple enough.',
          '**Test.** Run it on cases whose answer you already know, including awkward ones.',
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The loop you will use with an AI assistant: you direct, it drafts, you read and test, and you either accept or go round again.',
        source: `flowchart TD
  A[Direct: describe the goal, inputs, outputs and examples] --> B[The assistant drafts an answer]
  B --> C[Read: follow what it really does]
  C --> D[Test: try cases with a known answer]
  D --> E{Does it match what you meant?}
  E -->|no| F[Say what is wrong and what you expected]
  F --> B
  E -->|yes| G(Accept it, and keep your test cases)`,
      },
      {
        type: 'warning',
        text: `Never paste passwords, keys, other people's personal details or anything private into an AI assistant. Treat what you type as something that leaves your device, and check the tool's own data settings before you use it for real work.`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: `In plain words: imagine asking a very fast, very well-read helper who has never met you to draft a letter. The letter will read beautifully. But it might get your address wrong, promise something you never offered or mention a person who does not exist, and it will sound equally sure either way. You are the one who knows what you meant to say, so you read the letter and check it. Direct, read, judge and test are just that: say what you want clearly, read the result, ask whether it says what you meant, and try it on something you can check. The rest of this course is practice for those four jobs.`,
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: `In professional work the effort shifts from typing to specification, review and verification. Typical failure modes are invented APIs, outdated library usage, silently dropped requirements, tests that assert what the code does rather than what it should do, and plausible but insecure patterns. The controls are the familiar ones, applied firmly: an acceptance criterion written before generating, small diffs (a diff is the list of lines a change adds and removes), tests you wrote or reviewed, actually running the code, review as for any contributor, and secrets and customer data kept out of prompts. Accountability does not transfer to the tool: whoever merges owns the result.`,
      },
      { type: 'heading', text: 'Walk through an example' },
      {
        type: 'paragraph',
        text: `Here is the four-job loop on a small case. You asked an assistant: "Write the steps to total this month's expenses." Today is in November 2026. This is what came back, in plain steps.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'What the assistant sent back',
        code: `1. Start with a total of 0.
2. Go through the list of expenses, one at a time.
3. Add each expense's amount to the total.
4. Show the total.`,
      },
      {
        type: 'paragraph',
        text: `It reads clearly and sounds confident. **Read** it by tracing it on a small list that you made up, where you already know what the right answer is.`,
      },
      {
        type: 'table',
        headers: ['Expense', 'Date', 'Should it count for November?', 'Total after the assistant\'s step 3'],
        rows: [
          ['Jeepney fare, 24 pesos', '2026-11-16', 'Yes', '24'],
          ['Lunch, 150 pesos', '2026-11-01', 'Yes', '174'],
          ['Load top-up, 500 pesos', '2026-10-28', 'No: it is from October', '674'],
        ],
        caption: 'Tracing the assistant\'s steps on three made-up expenses.',
      },
      {
        type: 'list',
        items: [
          '**Test:** the steps reach a total of 674. The correct total for November is 24 plus 150, which is 174.',
          '**Judge:** the steps never look at the date, so they cannot be "this month". Nothing was misspelled or broken: the code would run happily. It just does not do what was asked.',
          '**Direct again:** you tell it exactly what was wrong: "Only count expenses dated in November 2026. For my test list the total must be 174."',
        ],
      },
      {
        type: 'paragraph',
        text: `Notice what found the problem: not rereading the steps for typos, but tracing them on a case with a known answer. That is lesson 2's trace table and lesson 1's habit of being exact, working together.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: `Practise the loop on purpose. Use any assistant, and keep the example made up.`,
      },
      {
        type: 'prompt',
        label: 'Catch the mistake',
        text: `I am a beginner learning to check an AI assistant's work. Give me one small, realistic task from an expense tracker, such as totalling expenses, and answer it the way a coding assistant would, in plain-language steps with no code. Hide exactly one realistic mistake in your answer that a beginner could miss, but do not tell me what or where it is. Ask me to find it. If I ask for a hint, give one small hint at a time. Reveal the mistake only after I guess or say that I give up.`,
      },
      {
        type: 'prompt',
        label: 'Ask about its own limits',
        text: `When you answer questions about code, when should I double-check you? Give me three situations, and for each one a quick way I can check your answer without being an expert.`,
      },
      {
        type: 'paragraph',
        text: `What to look for: first, did the first answer really contain a mistake, or did the assistant forget or pick a harmless one? Work out the answer yourself on a small example before you believe either of you. Second, the assistant's description of its own reliability is also an answer from an AI, so treat the three situations as a starting list, not as a guarantee. Where you can, compare it with the notes in this lesson.`,
      },
      {
        type: 'takeaways',
        items: [
          'AI assistants predict likely text from patterns and from what you give them, so they are fast and often right on common tasks, and sometimes confidently wrong.',
          'A hallucination is confident output that is false or invented, and the tool makers themselves say it can be reduced but not eliminated.',
          'The fundamentals matter more now: someone must say exactly what is wanted, follow what the code does and judge whether it is right.',
          'Your four jobs are direct, read, judge and test, and they repeat every time you work with an assistant.',
          'The responsibility for what you ship stays with you, and private data stays out of prompts.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-04-scenario-1',
          kind: 'scenario',
          title: 'It says it is tested',
          prompt: 'Choose the best response.',
          concept: 'checking AI output',
          situation: 'You asked an assistant for a way to total this month\'s expenses. It replies with code you cannot fully read and adds: "This is tested and works." You have a small list of made-up expenses and you know the right total. What do you do?',
          options: [
            {
              text: 'Try it on your list, including one expense from last month, and compare the total with the one you already know.',
              consequence: 'You test the claim instead of believing it. If the total is off, you also learn where to point the assistant next.',
              quality: 'best',
            },
            {
              text: 'Ask the assistant to explain the code in plain words, then use it if the explanation sounds right.',
              consequence: 'Understanding is useful, but an explanation can be wrong or can describe what the assistant meant rather than what the code does. It still needs a real test.',
              quality: 'acceptable',
            },
            {
              text: 'Accept it, because the assistant said it was tested.',
              consequence: 'A claim of "tested" is only more text from the model. You have no evidence, and a total that ignores dates would slip through.',
              quality: 'poor',
            },
          ],
          hints: [
            'What would show you, with evidence, that the total is right?',
            'You already know the correct total for your list.',
            'The assistant\'s own claim is not evidence. A result you can compare is.',
          ],
          explanation: 'Testing against a case with a known answer is evidence. An explanation helps you understand, and a claim of "tested" is only more generated text.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-04-match-1',
          kind: 'match',
          title: 'Which of the four jobs?',
          prompt: 'Match what the person did to the job it is: direct, read, judge or test.',
          concept: 'direct, read, judge and test',
          labels: { terms: 'What the person did', meanings: 'The job' },
          pairs: [
            { term: 'Wrote down what one expense contains and gave the assistant two examples', definition: 'Direct', note: 'This is about stating the goal and the examples before anything is made.' },
            { term: 'Followed the assistant\'s steps line by line on three sample expenses', definition: 'Read', note: 'This is following what the steps actually do.' },
            { term: 'Noticed the steps never look at dates even though "this month" was asked for', definition: 'Judge', note: 'This compares what the steps do with what was meant.' },
            { term: 'Tried the result on a list whose correct total was already known', definition: 'Test', note: 'This runs it on a case with a known answer.' },
          ],
          hints: [
            'Direct happens before the assistant answers; the other three happen after.',
            'Read is following; judge is deciding; test is trying.',
            'Which one compares what the steps do with what you meant? Which one needs a known answer?',
          ],
          explanation: 'Directing states the goal, reading follows what was produced, judging compares it with what you meant and testing tries it on a known case.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-04-predict-output-1',
          kind: 'predict-output',
          title: 'What do the assistant\'s steps total?',
          prompt: 'The assistant\'s steps from this lesson (start at 0, add every expense, show the total) are run on this list. What total do the steps show?',
          concept: 'reading AI output',
          language: 'text',
          code: `Start with a total of 0.
Go through the list of expenses, one at a time.
Add each expense's amount to the total.
Show the total.

The list:
  Lunch, 40 pesos, dated 2026-11-03
  Rice, 60 pesos, dated 2026-10-30
  Jeepney fare, 15 pesos, dated 2026-11-20`,
          expected: '115',
          choices: ['115', '55', '100', '75'],
          wrongNotes: {
            '55': 'That is the November total (40 plus 15), which is what you wanted. The steps never look at dates, so they do not produce it.',
            '100': 'That leaves out the jeepney fare. The steps add every expense on the list.',
            '75': 'That leaves out the lunch. The steps add every expense on the list.',
          },
          hints: [
            'Do the steps mention dates anywhere?',
            'Then which expenses does step 3 add?',
            'Every one of them. Add all three amounts.',
          ],
          explanation: 'The steps add every expense, whatever its date, so the total is 40 plus 60 plus 15, which is 115. The November total would be 55, but nothing in the steps asks for it.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-04-q1',
        prompt: 'An assistant is asked for code using a library it knows little about, and the code calls a function that does not exist in that library. Which description fits best?',
        choices: [
          'A hardware fault in the computer that runs the assistant',
          'A deliberate trick the assistant plays to test the user',
          'A hallucination: confident output that is invented',
          'A normal result, since libraries replace their functions every day',
        ],
        answer: 2,
        explanation: 'Invented names that sound plausible are a typical hallucination. The assistant predicts likely text, and a function that should exist is a likely thing to write.',
      },
      {
        id: 'programming-fundamentals-04-q2',
        prompt: 'Which action best tests whether AI-written steps for "total this month\'s expenses" are right?',
        choices: [
          'Run them on a small list where you know the correct total, including an expense from another month',
          'Ask the assistant whether it is sure that the steps are right',
          'Check that the steps are written in clear, polite English',
          'Count the steps, because a shorter answer is safer',
        ],
        answer: 0,
        explanation: 'A known answer is evidence. Whether the assistant is sure, how the steps are worded and how long they are say nothing about whether they are right.',
      },
      {
        id: 'programming-fundamentals-04-q3',
        prompt: 'Which statement about responsibility matches what the tool documentation in this lesson says?',
        choices: [
          'The assistant is responsible for checking its code before it shows it to you',
          'Only large companies need to review what an assistant produces',
          'You need to review output only when the code fails to run',
          'The user is responsible for reviewing and validating what the tool produces',
        ],
        answer: 3,
        explanation: 'GitHub\'s application card for Copilot Chat says its users are responsible for reviewing and validating the responses, and Anthropic says critical information should always be validated.',
      },
      {
        id: 'programming-fundamentals-04-q4',
        prompt: 'Why do the ideas in this course matter more, not less, now that AI can write code?',
        choices: [
          'Because assistants can only write code that you have typed before',
          'Because someone must say exactly what is wanted, follow what the code does and judge whether it is right',
          'Because assistants refuse to work unless you already know a language',
          'Because knowing the ideas makes the assistant run faster',
        ],
        answer: 1,
        explanation: 'The typing is the easy part to hand over. Specifying, reading, judging and testing still need a person who understands how programs work.',
      },
      {
        id: 'programming-fundamentals-04-q5',
        audience: { max: 'beginner' },
        prompt: 'In the picture of a helper drafting a letter, why must you read the letter yourself?',
        choices: [
          'Because only you know what you meant to say, and can spot what is wrong or invented',
          'Because helpers are not allowed to finish a letter without you',
          'Because a letter only counts once a second helper has signed it',
        ],
        answer: 0,
        explanation: 'The helper writes fluently but does not know your facts. Reading and checking is your job, as with any AI draft.',
      },
      {
        id: 'programming-fundamentals-04-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent returns a 400-line change, and the tests it wrote for itself pass. Which review stance fits this lesson?',
        choices: [
          'Merge it: passing tests prove that the requirement is met',
          'Treat it like any contributor\'s change: check that the tests assert the requirement, run it on cases you chose, and prefer smaller changes that can be read',
          'Reject it, because generated code can never be merged',
          'Ask the agent to review its own change and merge if it agrees',
        ],
        answer: 1,
        explanation: 'Tests written by the same tool can assert what the code does rather than what it should do. The usual controls still apply: acceptance criteria, tests you trust, real runs and reviewable diffs.',
      },
    ],
    task: {
      title: 'Catch the AI',
      minutes: 15,
      steps: [
        'Write a two-sentence requirement for a small task, with three made-up expenses and the total you expect. Use no real personal or financial details.',
        'Ask an AI assistant for plain-language steps, with no code.',
        'Trace the steps on your three expenses with a table, as in this lesson.',
        'Compare the result with the total you expected. Write down whether it matched and, if not, where the steps differ from what you meant.',
        'Write one sentence about each of the four jobs: what you did to direct, read, judge and test.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use this lesson\'s example: ask for "the steps to total this month\'s expenses" with your own three made-up expenses, one of them from last month. The assistant may get it right, and that is fine: the exercise is checking.'] },
      { audience: { min: 'advanced' }, steps: ['Write acceptance criteria first, including a boundary case (an expense dated 2026-11-01 and one dated 2026-10-31), then have the assistant produce the steps. Log whether it handled the boundary, and which of your criteria you could verify only by running something.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'programming-fundamentals-p1',
  title: 'Order food as instructions',
  summary: 'Write the steps of ordering food (or buying load) precisely enough for a literal-minded machine, then list what could still go wrong and explain your choices.',
  outcome: 'A short written specification that shows you can turn an everyday action into exact steps and spot the gaps in them, the skill you use to direct and check AI-written code.',
  unlockAfterDay: 4,
  steps: [
    { id: 'programming-fundamentals-p1-s1', text: 'Choose an errand: ordering a meal at a counter, buying mobile load or paying a fare. Write it the way you would tell a friend, in four to six lines.' },
    { id: 'programming-fundamentals-p1-s2', text: 'Play the literal machine. For every line, write the questions it would have to ask (what, how many, which one, how much, what if).' },
    { id: 'programming-fundamentals-p1-s3', text: 'Rewrite the errand as numbered steps with no gaps: exact words to say, exact amounts, a fixed order and at least one step that depends on an answer (an "if"). Plain English is fine.' },
    { id: 'programming-fundamentals-p1-s4', text: 'List at least five things that could still go wrong (the gaps you chose to leave out). For each, say whether you would add a step or accept the risk, and why.' },
    { id: 'programming-fundamentals-p1-s5', text: 'In three to five sentences, explain why your final version is longer than your first, and which instruction was the hardest to make exact.' },
    { id: 'programming-fundamentals-p1-s6', audience: { max: 'beginner' }, text: 'Keep it small: buying 50 pesos of load is a good choice, with about six steps. If you get stuck, use the "find the gaps" prompt from lesson 1 so an AI assistant points out one gap at a time, and fix each gap yourself. Do not paste any real phone numbers or account details.' },
    { id: 'programming-fundamentals-p1-s7', audience: { min: 'advanced' }, text: 'Write acceptance criteria first (what must be true when the errand has succeeded), then your steps, then the preconditions and failure cases. If you ask an AI assistant to review your steps for ambiguity, note which of its findings you accepted and which you rejected, with a reason for each.' },
  ],
  submission: {
    kind: 'text',
    label: 'Your instructions and your explanation',
    placeholder: 'My errand: buying 50 pesos of load\n\nVersion 1 (how I would say it):\n1. ...\n\nQuestions a machine would ask:\n- ...\n\nFinal version:\n1. ...\n\nWhat could still go wrong:\n- ...\n\nMy explanation:\n...',
    hint: 'Paste your first version, the questions, your final numbered steps, your list of remaining risks and your explanation. A good submission has steps that another person could follow without asking you anything. Leave out personal data, passwords and card numbers.',
  },
  rubric: [
    'The steps are in a sensible order and each is exact: amounts, words and choices are stated, not implied',
    'At least one step depends on an answer (an "if"), and the steps say what happens in each case',
    'At least five realistic things that could still go wrong are listed, with a decision about each',
    'The explanation says, in the learner\'s own words, why the final version needed more detail than the first',
    'No personal data, passwords or card numbers appear anywhere in the submission',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The learner can say in plain words what a gap in instructions is, and shows one gap they found and fixed'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The steps are grouped into named parts (for example ordering, paying, collecting), each described in one line'] },
    { audience: { min: 'advanced' }, items: ['Acceptance criteria were written before the steps, with preconditions and failure cases', 'If an AI review was used, the learner shows which findings they accepted and which they rejected, with reasons'] },
  ],
};
