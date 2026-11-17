import type { Lesson, Project } from '../../../types';

const CHECKED = '2026-11-16';

// Every page below was opened on CHECKED. What each one is cited for is stated in the version note that uses it; nothing here quotes a price.
const DOCS = {
  claudeGlossary: { label: 'Claude API docs: Glossary (LLM, pretraining, context window, temperature)', url: 'https://platform.claude.com/docs/en/about-claude/glossary' },
  claudeHallucinations: { label: 'Claude API docs: Reduce hallucinations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations' },
  claudeCodeOverview: { label: 'Claude Code docs: Overview', url: 'https://code.claude.com/docs/en/overview' },
  claudeCodeBest: { label: 'Claude Code docs: Best practices', url: 'https://code.claude.com/docs/en/best-practices' },
  copilotAbout: { label: 'GitHub Docs: About GitHub Copilot', url: 'https://docs.github.com/en/copilot/get-started/what-is-github-copilot' },
  copilotReferencing: { label: 'GitHub Docs: GitHub Copilot code referencing (public code matches)', url: 'https://docs.github.com/en/copilot/concepts/completions/code-referencing' },
  cursorDocs: { label: 'Cursor documentation', url: 'https://cursor.com/docs' },
  codexDocs: { label: 'ChatGPT Learn docs: Codex overview (reached from developers.openai.com/codex)', url: 'https://learn.chatgpt.com/docs' },
  owaspMisinformation: { label: 'OWASP Gen AI Security Project: LLM09:2025 Misinformation', url: 'https://genai.owasp.org/llmrisk/llm092025-misinformation/' },
  claudeSensitive: { label: 'Claude Help Center: Sensitive data in chats, and who can view my conversations', url: 'https://support.claude.com/en/articles/8325621-i-would-like-to-input-sensitive-data-into-my-chats-with-claude-who-can-view-my-conversations' },
  mdnGroupBy: { label: 'MDN: Object.groupBy()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy' },
};

export const lessons: Lesson[] = [
  {
    id: 'programming-fundamentals-51',
    day: 51,
    title: 'How AI Coding Assistants Work, and Learning Concepts with Them',
    summary: 'See in plain terms how an assistant produces its answers, why a confident answer can still be wrong, and how to use one to learn an idea without handing it your thinking.',
    intro: {
      objectives: [
        'Explain in your own words how an AI coding assistant produces a reply',
        'Describe why a confident reply can still be wrong and what that means for you',
        'Use an assistant to learn a concept through analogies, quizzes and simpler versions, then check what it said',
      ],
      why: 'You will use an assistant for the rest of your programming life. Knowing that it predicts likely text, rather than looking up checked facts, tells you where to trust it and where to test it.',
    },
    minutes: 25,
    skills: ['ai-partner', 'how-programs-work'],
    body: [
      {
        type: 'paragraph',
        text: 'From this lesson on you will work with an AI coding assistant: a chat window or an editor tool that writes, explains and reviews code when you ask. Used well, it is a patient tutor and a fast pair of hands. Used badly, it is a way to collect code you do not understand and cannot fix. This module teaches the first way, and its rule is simple: the assistant drafts, but you must be able to read, test and explain what it gives you. That is exactly what the last ten modules prepared you to do. This lesson looks inside the tool in plain terms, then shows how to use it to learn.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Think of the next-word suggestions on your phone keyboard. Type "Happy" and it offers "birthday". It is not thinking about anybody\'s birthday. It is offering the word that usually follows. A coding assistant is that idea made enormously bigger: it reads your whole message and a lot of text around it, then writes the continuation that fits best, one small piece at a time.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops: a keyboard suggests one word, while an assistant writes whole functions, follows instructions given in plain language and answers back. But one thing stays the same. It produces text that fits the pattern, and fitting the pattern is not the same as being checked and true.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'The engine inside is a **language model**: a program trained on an enormous amount of text, including a great deal of code. In its first stage of training, called **pretraining**, it practises one task over and over: given the text so far, predict what comes next. Anthropic\'s glossary describes its own models this way, and adds that these pretrained models are then trained further so that they follow instructions and behave like helpful assistants. A model works with small pieces of text called **tokens** (a whole word, part of a word or a symbol), and it builds a reply one token at a time. It does not look your question up in a table of answers. It generates a new reply every time.',
      },
      {
        type: 'visual',
        id: 'ai-model-input-output',
        caption: 'Step through it: your words become pieces, the model gives every possible next piece a chance, and the answer grows one piece at a time. The numbers are fixed examples, not a real model.',
      },
      { type: 'paragraph', text: 'Three consequences follow, and each one shapes how you should work with it.' },
      {
        type: 'list',
        items: [
          '**It is fluent, not verified.** A confident tone says nothing about whether the code runs. Text that sounds right and text that is right are different things, and only running the code tells them apart.',
          '**It only sees its context.** The **context window** is the text the model can look at while it writes, a kind of working memory. Your other files, the rule you set at the start of a long chat, and the version of JavaScript you use are invisible to it unless they are in that window or the tool can read them.',
          '**Its answers vary.** Ask the same question twice and you may get two different programs. Anthropic\'s glossary notes that even with the randomness setting at zero, its API\'s results are not fully repeatable. So you cannot rely on getting "the" answer; you rely on checking whichever one you got.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: imagine a very well-read apprentice who has studied thousands of cookbooks but has never cooked in your kitchen. You ask how to make adobo for your family. The apprentice answers fast, sounds sure, and is usually close. But they have not tasted this pot, do not know your stove, and cannot know about the cousin who is allergic to something unless you say so. An AI assistant is that apprentice. Your **prompt** (the message you type) is the question, and the reply is its best-fitting answer. Tasting the dish is your job, and in code, tasting means running it.',
      },
      { type: 'heading', text: 'Chat assistants and agents' },
      {
        type: 'paragraph',
        text: 'Not every assistant is only a chat window. Some tools can also read the files in your project, edit them and run commands such as your tests, then read the results. People often call these coding **agents**. The names differ between products, but the loop is the same: the model proposes something, a tool carries it out, and the output goes back into the context for the next step. With an agent you review changes made in your project instead of copying code from a chat, but you still decide what is accepted.',
      },
      {
        type: 'version',
        text: 'How the makers describe their tools on this date (paraphrased, not a ranking, and liable to change). Claude\'s glossary says its models are pretrained to predict the next word given the previous text, then refined with further training, and defines the context window as the text a model can look back on. Claude Code\'s overview calls it an agentic coding tool that reads your codebase, edits files, runs commands and connects to development tools. GitHub describes Copilot as suggesting code, answering questions about a codebase, reviewing changes and working on tasks you assign, and says you review and apply suggestions. Cursor\'s documentation describes a coding agent and a step to inspect diffs and run checks before you merge. The Codex overview in the ChatGPT docs lists tasks such as exploring code, building features, reviewing code and fixing failures, available from a command line, an editor extension and the cloud. This course works with whichever assistant you have.',
        checked: CHECKED,
        sources: [DOCS.claudeGlossary, DOCS.claudeCodeOverview, DOCS.copilotAbout, DOCS.cursorDocs, DOCS.codexDocs],
      },
      { type: 'heading', text: 'Learning a concept with an assistant' },
      {
        type: 'paragraph',
        text: 'The safest and most useful first job for an assistant is teaching you. You can ask for as many angles on an idea as you like, at any hour, without feeling slow. Five moves cover most of what you need.',
      },
      {
        type: 'table',
        headers: ['Move', 'What you ask', 'What it builds'],
        rows: [
          ['Analogy', '"Explain a loop using a jeepney route."', 'A picture you can hold on to'],
          ['Simpler version', '"Explain that again for someone who has only used a calculator."', 'A way past the word that blocked you'],
          ['Another example', '"Give me one more example with expenses and say what it prints."', 'Practice you can then run to confirm'],
          ['Quiz me', '"Ask me three questions, one at a time, and wait for my answer."', 'Proof of what you understand'],
          ['Check me', '"Here is my explanation in my own words. What is wrong or missing?"', 'The gaps you cannot see yourself'],
        ],
        caption: 'Five ways to learn with an assistant. The last two make you do the thinking.',
      },
      {
        type: 'paragraph',
        text: 'Two habits keep this honest. First, ask it to teach, not to do your exercise: if you paste an exercise and say "solve it", you get an answer and no skill. Ask for a hint instead. Second, check what it says. Compare it with the lesson, run any code it shows, and when two sources disagree, believe the one you can run or look up on an official page.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'A real model is far too large to build here, but the core idea, "predict what usually comes next", fits in a few lines. This toy reads one short text and counts which word came after "is". It is not how real models work inside (they learn from far more text and use learned numbers, not a simple tally), but it shows what "most likely next" means. One new tool: `split(\' \')` cuts a text into a list of words at every space.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Part 1: count what follows "is"',
        code: `const words = 'the bus is late the bus is full the bus is late'.split(' ');
const afterIs = {};
for (let i = 0; i < words.length - 1; i++) {
  if (words[i] === 'is') {
    const next = words[i + 1];
    afterIs[next] = (afterIs[next] || 0) + 1;
  }
}
console.log(afterIs);`,
      },
      { type: 'code', language: 'text', label: 'Real output', code: '{ late: 2, full: 1 }' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Part 2: pick the most common word (continues the program above)',
        code: `let best = '';
let bestCount = 0;
for (const word of Object.keys(afterIs)) {
  if (afterIs[word] > bestCount) {
    best = word;
    bestCount = afterIs[word];
  }
}
console.log('the bus is ' + best);`,
      },
      { type: 'code', language: 'text', label: 'Real output', code: 'the bus is late' },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`split` turns the sentence into a list of 12 words: the, bus, is, late, the, bus, is, full, the, bus, is, late.',
          '`afterIs` starts as an empty object. It is a tally: each key is a word, each value is how many times that word followed "is".',
          'The loop stops one short of the end (`words.length - 1`) because the last word has no word after it.',
          'Whenever the current word is "is", `next` is the word right after it. `(afterIs[next] || 0) + 1` starts a new tally at 0 if the word has not been seen, then adds one.',
          'Part 2 walks the keys and keeps the word with the highest count. "late" has 2, "full" has 1, so "late" wins.',
        ],
      },
      {
        type: 'table',
        headers: ['i', 'words[i]', 'next', 'afterIs afterwards'],
        rows: [
          ['2', 'is', 'late', '{ late: 1 }'],
          ['6', 'is', 'full', '{ late: 1, full: 1 }'],
          ['10', 'is', 'late', '{ late: 2, full: 1 }'],
        ],
        caption: 'Only the passes where words[i] is "is" change the tally. The other passes do nothing.',
      },
      {
        type: 'paragraph',
        text: 'Look at what the program did not do. It never checked whether buses are late. If the text had said "the bus is on fire" three times, it would have answered "on". Its answer came from a pattern, with no understanding behind it. A real assistant is vastly more capable than this toy, but its answer is also the continuation that fits its training and your context, and that is why you test what it hands you.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'For an engineer, the useful questions are about everything around the model: what goes into the context (instruction files, open files, search results, tool output), how much fits, what happens when the window fills, and whether the tool can execute anything. Tools handle a full window differently; Claude Code\'s documentation says it compacts the conversation automatically before the window fills, which means an early instruction can quietly stop mattering. Treat an assistant\'s claim as a hypothesis and verify by execution (tests, type checks, linters), not by rereading its explanation. Because sampling makes output vary, pin behaviour with tests rather than trying to reproduce a prompt. What a model learned in training is fixed at training time, so newer library versions must reach it through context you supply.',
      },
      {
        type: 'version',
        text: 'The claim that a long conversation is compacted automatically before the context window fills is what Claude Code\'s own best-practices page says about Claude Code. Other tools handle full windows in their own ways, so check your tool\'s documentation before relying on any one behaviour.',
        checked: CHECKED,
        sources: [DOCS.claudeCodeBest],
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Pick any idea from the earlier modules that still feels shaky, for example conditions, loops or objects. Use made-up examples only, never real passwords, personal details or private files. The first prompt teaches and quizzes you; the second makes you explain the idea yourself.',
      },
      {
        type: 'prompt',
        label: 'Learn and be quizzed',
        text: `I am learning programming with JavaScript and I want to understand [the idea, for example: if / else conditions].
1. Explain it with an everyday example from a sari-sari store, in under 120 words.
2. Then ask me three short questions, one at a time. Wait for my answer before the next question.
3. Do not give me the answer to a question until I have tried it. If I am wrong, give me a hint first.
4. At the end, tell me which of my answers showed a gap.
Keep any code to six lines or fewer.`,
      },
      {
        type: 'prompt',
        label: 'Check my understanding',
        text: `Here is my explanation of [the idea] in my own words: [write two or three sentences].
Tell me what is right, what is missing or wrong, and ask one question that would test whether I really understand it. Do not rewrite my explanation for me.`,
      },
      {
        type: 'paragraph',
        text: 'What to look for: does the analogy match the idea, or only sound nice? If it shows code, run it and compare the real output with what it claimed. Compare its explanation with the lesson in this course; if it says something the lesson did not, ask "how could I check that?" and then check. One way it can mislead you: an assistant may sound encouraging about an explanation that contains a mistake. Ask it to find what is wrong, not whether you are right.',
      },
      {
        type: 'tip',
        text: 'Use made-up data in every prompt, such as an expense called "Jeepney fare". Lesson 55 explains why real passwords, keys and private details never belong in a prompt.',
      },
      {
        type: 'takeaways',
        items: [
          'A language model is pretrained to predict what comes next in text, then refined to behave like a helpful assistant. It writes a reply one piece at a time.',
          'Fluent is not the same as verified. A confident reply is a draft to test, not a fact to trust.',
          'An assistant only sees its context window. If something matters, put it in the prompt or make sure the tool can read it.',
          'Some tools are agents that read files and run commands, but you still review every change.',
          'Use an assistant to learn by asking for analogies, simpler versions, quizzes and a check of your own explanation, then verify what it said.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-51-predict-output-1',
          kind: 'predict-output',
          title: 'What follows "and"?',
          prompt: 'This is the toy predictor from the lesson with a different text. Work out what it prints.',
          concept: 'prediction from patterns',
          language: 'javascript',
          code: `const words = 'rice and fish rice and egg rice and fish'.split(' ');
const afterAnd = {};
for (let i = 0; i < words.length - 1; i++) {
  if (words[i] === 'and') {
    const next = words[i + 1];
    afterAnd[next] = (afterAnd[next] || 0) + 1;
  }
}
console.log(afterAnd);`,
          choices: ['{ fish: 2, egg: 1 }', '{ fish: 1, egg: 2 }', '{ and: 3 }', '{ fish: 2, egg: 1, rice: 3 }'],
          wrongNotes: {
            '{ fish: 1, egg: 2 }': 'Count again: "and" is followed by fish, then egg, then fish. Fish appears twice.',
            '{ and: 3 }': 'The tally counts the words that come after "and", not "and" itself.',
            '{ fish: 2, egg: 1, rice: 3 }': 'Only the word right after each "and" is counted. "rice" comes before "and" here, so it is never tallied.',
          },
          hints: [
            'First find every position where the word is "and". There are three.',
            'For each of those positions, write down the word that comes right after it.',
            'The words after "and" are fish, egg, fish. Tally them in that order.',
          ],
          explanation: 'The three "and" words are followed by fish, egg and fish, so the tally is fish 2, egg 1. The program counts a pattern. It has no idea what rice or fish are, which is the same reason a real assistant can be fluent and still wrong.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-51-scenario-1',
          kind: 'scenario',
          title: 'Stuck on a practice exercise',
          prompt: 'Choose the best way to use an assistant here.',
          concept: 'learning with an assistant',
          situation: 'You are stuck on a loop exercise that prints a multiplication table. You have an assistant open and you want to actually learn the loop, not just finish the exercise.',
          options: [
            { text: 'Say what you tried, paste your code, and ask for a hint about the next step without the full solution.', consequence: 'You get just enough help to move forward, and you still write the loop yourself. This is how an assistant makes you stronger.', quality: 'best' },
            { text: 'Ask it to explain loops again with a new example, then go back and try the exercise yourself.', consequence: 'Useful, and you keep the thinking. It is a little slower because the explanation is not aimed at where you are stuck.', quality: 'acceptable' },
            { text: 'Paste the exercise and copy the code it gives you.', consequence: 'The exercise is done and the skill is not. The next problem will be just as hard, and you could not explain this answer if asked.', quality: 'poor' },
            { text: 'Ask it to write the whole program, then reword the comments so it looks like your own work.', consequence: 'You have learned nothing and added a second problem: the work is not honestly yours.', quality: 'poor' },
          ],
          hints: [
            'Which option leaves the thinking with you?',
            'A hint moves you one step; a full answer ends the exercise without teaching you.',
            'Choose the option that includes what you tried and asks only for a hint.',
          ],
          explanation: 'The goal is understanding, so use the assistant for hints, explanations and checking. Doing the exercise yourself is where the learning happens.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-51-match-1',
          kind: 'match',
          title: 'Why did the assistant do that?',
          prompt: 'Match each thing a learner noticed to the reason behind it.',
          concept: 'how assistants behave',
          labels: { terms: 'What the learner noticed', meanings: 'Why it happens' },
          pairs: [
            { term: 'Asking the same question twice gives two different programs', definition: 'Replies are generated piece by piece with some variation, so they are not repeated exactly', note: 'Variation in generation is why two asks can differ.' },
            { term: 'In a very long chat, it stops following a rule you set at the start', definition: 'Only a limited amount of text fits in its working memory, the context window', note: 'A rule that is no longer in the window cannot be followed.' },
            { term: 'It describes a function that does not exist anywhere', definition: 'It writes text that fits the pattern, and fluent text is not checked truth', note: 'It predicts likely text. It does not check that a function exists.' },
            { term: 'It edits your files, runs your tests and reports the failures', definition: 'It is an agent: the model proposes and tools act, then the output returns to it', note: 'This is a tool that can read and run things, not only a chat window.' },
          ],
          hints: [
            'Ask which of the three ideas from the lesson each situation shows: variation, context, or fluent but unchecked.',
            'The rule that is forgotten is about how much text it can look at.',
            'The agent line is the only one where something other than text is produced: files change and tests run.',
          ],
          explanation: 'Each behaviour follows from how the tool works: generated pieces vary, the window is limited, fluent text is not checked, and some tools can also act on your project.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-51-q1',
        prompt: 'An assistant hands you a function and says confidently, "This handles every case." What does that confidence tell you?',
        choices: [
          'The assistant ran the function against every possible case on its own machine before it replied to you',
          'Very little: the reply is text that fits a pattern, so you still must run it',
          'The function was copied from a table of verified answers kept inside the model itself',
          'The assistant read all of your project files and matched the function to them first',
        ],
        answer: 1,
        explanation: 'A model writes fitting text one piece at a time. Its tone does not measure correctness, so the only reliable test is running the code on real cases.',
      },
      {
        id: 'programming-fundamentals-51-q2',
        prompt: 'In a long conversation, an assistant ignores a naming rule you gave in your first message. What is the most likely reason?',
        choices: [
          'It decided the rule was no longer useful, and chose to skip it from then on',
          'Models cannot follow any rule that is longer than one sentence, however clearly it is written',
          'The rule is stored inside the assistant, and long chats slowly corrupt what is stored there',
          'The rule is far back and may no longer fit in its context window',
        ],
        answer: 3,
        explanation: 'The model works from the text in its context window. A limited window means earlier text can fall out or be shortened, so repeat important rules when they matter.',
      },
      {
        id: 'programming-fundamentals-51-q3',
        prompt: 'You want to understand loops and not just finish an exercise. Which request is best?',
        choices: [
          'Explain loops with a jeepney route, then quiz me one question at a time',
          'Write the loop exercise for me so that I can read the finished solution afterwards',
          'Explain loops in as few words as possible and do not ask me anything at all',
          'Give me ten pages about loops so that I never need to ask about them again',
        ],
        answer: 0,
        explanation: 'The best request keeps you thinking: an analogy to build the picture, and questions that test it. Only that option makes you answer.',
      },
      {
        id: 'programming-fundamentals-51-q4',
        prompt: 'The toy program answered "the bus is late". What does that show about predicting the next word?',
        choices: [
          'The program understood from the text that buses in this city often run behind their schedule',
          'The program looked up a real bus timetable before it gave its answer to you',
          'It counted what followed earlier in the text and never checked that it was true',
          'The program picked a word at random, and "late" happened to be a lucky pick this time',
        ],
        answer: 2,
        explanation: 'The program tallied which word followed "is" and picked the most common one. A pattern produced the answer, which is the same reason fluent text from a real assistant still needs checking.',
      },
      {
        id: 'programming-fundamentals-51-q5',
        audience: { max: 'beginner' },
        prompt: 'In the apprentice comparison, what does "tasting the dish" stand for in coding?',
        choices: [
          'Asking the apprentice to say the answer again more slowly',
          'Running the code and checking what it really does',
          'Reading the recipe aloud so that it sounds convincing',
          'Typing a longer prompt with more adjectives',
        ],
        answer: 1,
        explanation: 'The apprentice can describe a dish but has not tasted yours. In the same way, an assistant can describe what code does, and only running it shows what it really does.',
      },
      {
        id: 'programming-fundamentals-51-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate says, "I asked twice and got two different implementations, so the tool is unreliable." What is the best response?',
        choices: [
          'Agree, and stop using generated code for anything at all that has to be correct',
          'Ask the tool to run the same prompt over and over until both answers are identical',
          'Define the behaviour with tests, then accept whichever version passes and reads well',
          'Pick the longer implementation, because more code usually means more care was taken',
        ],
        answer: 2,
        explanation: 'Variation is expected from a sampling model. The stable thing is the specification, so tests decide which implementation to accept, not whether two runs match.',
      },
    ],
    task: {
      title: 'Learn one idea with an assistant, then check it',
      minutes: 20,
      steps: [
        'Pick one idea from an earlier module that still feels shaky, for example scope, arrays or conditions.',
        'Paste the "Learn and be quizzed" prompt into any AI assistant you have, with your idea filled in, and answer its three questions honestly.',
        'If it gave you code, run it in any free JavaScript environment or the code runner in this app, and compare the real output with what it claimed.',
        'Write three lines: one thing it explained better than the lesson, one claim you checked and how, and one thing you would not trust without checking.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the assistant to say where its own analogy stops working, and write down one place the analogy would mislead you.'] },
      { audience: { min: 'advanced' }, steps: ['Ask the same question in two separate chats and compare the answers. List every statement that differs and write down how you would decide which one is right.'] },
    ],
  },
  {
    id: 'programming-fundamentals-52',
    day: 52,
    title: 'Generating Code from Requirements',
    summary: 'Write a requirement an assistant cannot misread, turn its examples into checks, and ask for a plan before any code.',
    intro: {
      objectives: [
        'Write a requirement with a purpose, inputs, outputs, examples and edge cases',
        'Turn the examples of a requirement into checks you can run before any code exists',
        'Ask an assistant for a plan first and judge it against your requirement',
      ],
      why: 'A vague request gets a plausible guess. A precise requirement gets code you can test, and writing one is the same careful thinking you practised in the computational thinking module.',
    },
    minutes: 25,
    skills: ['ai-partner', 'functions'],
    body: [
      {
        type: 'paragraph',
        text: 'Asking an assistant to "write something that counts my expenses" is like handing a stranger a note that says "buy food". You will get something back, and it may be nothing like what you meant. A **requirement** is the opposite of that note: a short, exact description of what the code must do, written before any code exists. You already know the ingredients from the earlier modules: inputs, a process and outputs, and the habit of being precise. This lesson shows how to put them into a request an assistant can follow, and how to prepare the checks that will tell you whether it did.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Ordering a birthday cake. If you tell the baker "a cake for tomorrow", the baker guesses the flavour, the size and the writing. If you say "chocolate, serves twelve, \'Happy Birthday, Ana\' in white icing, pick-up at 3 pm, and no nuts because Ana is allergic", you will get what you meant, and when you collect it you can check the cake against that order. The order slip is your requirement, the photo you show is your example, and "no nuts" is an edge case.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops: a baker can see your face and ask a question when something is unclear. An assistant usually will not ask unless you invite it to. It fills each gap with its best guess and carries on, which is why the gaps must be closed in the request.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'A good requirement has six parts. The table shows each part with the example we will use for the rest of this module: a function called `countByCategory` that counts how many expenses fall in each category.',
      },
      {
        type: 'table',
        headers: ['Part', 'The question it answers', 'Example for countByCategory'],
        rows: [
          ['Purpose', 'What is it for, in one sentence?', 'Show how many expenses belong to each category.'],
          ['Inputs', 'What goes in, and in what shape?', 'An array of expense objects with description, amount, category and date.'],
          ['Outputs', 'What comes back, and in what shape?', 'An object: each key is a category, each value is a count.'],
          ['Examples', 'What exact output do I expect for a real input?', 'Two transport expenses and one food expense give { transport: 2, food: 1 }.'],
          ['Edge cases and rules', 'What about the odd inputs, and what must it never do?', 'An empty list gives {}. A missing category counts as "uncategorized". Do not change the list passed in.'],
          ['Constraints', 'What must the solution stay inside?', 'Plain JavaScript, no libraries, return the object instead of printing it.'],
        ],
        caption: 'The six parts of a requirement. Examples and edge cases do the most work.',
      },
      {
        type: 'paragraph',
        text: 'Compare the two ways of asking. The vague request is one line. The requirement below takes two minutes to write and removes most of the guessing.',
      },
      { type: 'code', language: 'text', label: 'A vague request', code: 'Write a function that counts my expenses.' },
      {
        type: 'prompt',
        label: 'A requirement written as a prompt (an example)',
        text: `Write a JavaScript function countByCategory(expenses).

Purpose: show how many expenses belong to each category.
Input: an array of objects like { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' }.
Output: an object whose keys are categories and whose values are counts.
Examples (other fields left out to keep them short):
- [{ category: 'transport' }, { category: 'food' }, { category: 'transport' }] returns { transport: 2, food: 1 }
- [] returns {}
Rules:
- An expense with no category (missing or empty) is counted under 'uncategorized'.
- Do not change the array that was passed in.
- Return the object. Do not print it.
Constraints: plain JavaScript, no libraries, no classes.

Before you write any code, tell me your plan in plain steps, and list every assumption you are making and every question you have.`,
      },
      {
        type: 'paragraph',
        text: 'The last line asks for a **plan first**. It is cheaper to correct a plan than to read and untangle code built on a misunderstanding, and a plan shows you quickly whether the assistant understood. When the plan arrives, compare it with your requirement. Does it follow every rule? Does it add features you never asked for? Does it rely on anything you cannot read? Fix the requirement or the plan, then ask for the code.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The loop for generating code: the checks come from your requirement, so they exist before the code does.',
        source: 'flowchart TD\n  A[Write the requirement with examples and edge cases] --> B[Ask the assistant for a plan, no code yet]\n  B --> C{Does the plan match your requirement?}\n  C -->|no| D[Correct the requirement or the plan]\n  D --> B\n  C -->|yes| E[Ask for the code]\n  E --> F[Run your examples as checks]\n  F --> G{Do all the checks pass?}\n  G -->|no| H[Give it the failing output and change one thing]\n  H --> F\n  G -->|yes| I[Read and review the code in lessons 53 and 54]',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'A requirement written this way is also a set of acceptance criteria, and the examples are your first test cases. Pin the decisions that are really product decisions: ties, ordering, `null` against `undefined` against throwing, what counts as invalid input. Writing the failing checks first lets any tool iterate against something objective; Claude Code\'s best-practices page recommends giving the tool a check that comes back pass or fail and asking for evidence, meaning the command it ran and its output, instead of a bare "all tests pass". If a spec outlives the chat, keep it in the repository; some tools read instruction files at the start of a session (Claude Code reads a CLAUDE.md, or an AGENTS.md when present).',
      },
      {
        type: 'version',
        text: 'Claude Code\'s best-practices page recommends giving the tool something that comes back pass or fail, such as a test or a linter, and asking for evidence of the run. Its overview says Claude Code reads a CLAUDE.md file at the start of every session and can read an AGENTS.md in its place. These are one tool\'s documented behaviours on this date; the habit of writing the checks first works with any assistant.',
        checked: CHECKED,
        sources: [DOCS.claudeCodeBest, DOCS.claudeCodeOverview],
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Here is the idea in code. Before any assistant answers, turn the requirement\'s examples into checks. First, a tiny helper that compares what a function returned with what you expected. It is the same idea as the test helper from the debugging and testing module.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Step 1: a helper that prints PASS or FAIL',
        code: `function check(name, actual, expected) {
  const same = JSON.stringify(actual) === JSON.stringify(expected);
  console.log((same ? 'PASS ' : 'FAIL ') + name);
}`,
      },
      {
        type: 'paragraph',
        text: 'Next, a placeholder for the function, standing in for the code the assistant has not written yet, and one check for every example and rule in the requirement.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Step 2: the placeholder and the checks (add Step 1 above them)',
        code: `function countByCategory(expenses) {
  return {};
}

check('counts each category', countByCategory([{ category: 'transport' }, { category: 'food' }, { category: 'transport' }]), { transport: 2, food: 1 });
check('empty list', countByCategory([]), {});
check('missing category', countByCategory([{ category: 'food' }, {}]), { food: 1, uncategorized: 1 });
const original = [{ category: 'food' }];
countByCategory(original);
check('input is not changed', original, [{ category: 'food' }]);`,
      },
      { type: 'code', language: 'text', label: 'Real output of Step 1 and Step 2 together', code: 'FAIL counts each category\nPASS empty list\nFAIL missing category\nPASS input is not changed' },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`check` receives a name, what the function returned (`actual`) and what you expected (`expected`).',
          '`JSON.stringify` turns each value into text. Two objects with the same contents are still two different objects in memory, so `===` on them would say "different". Comparing their text compares their contents.',
          'The placeholder always returns `{}`. It stands in for the assistant\'s answer, and the two FAIL lines are your to-do list.',
          'Look at the PASS lines: a function that does nothing already passes "empty list" and "input is not changed". A passing check only proves something if a wrong function would have failed it, so write at least one check that a do-nothing function cannot pass.',
          'When the assistant\'s function arrives, paste it in place of the placeholder and run. The checks give a verdict that does not depend on how confident its reply sounded.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: the `check` function is a referee. You hand it three things: a name for the test, the answer your function really gave, and the answer you expected. The referee turns both answers into plain text with `JSON.stringify` and compares them, then prints PASS if they match or FAIL if they do not. Each `check(...)` line below the function is one question with a known answer. "Does counting two transport expenses and one food expense give transport 2, food 1?" The placeholder cannot answer correctly yet, so those checks fail, and that is what you want to see before the real code arrives.',
      },
      {
        type: 'warning',
        text: '`JSON.stringify` also compares the order of the keys. { food: 1, transport: 2 } and { transport: 2, food: 1 } hold the same information but print as different text, so this simple helper would report FAIL. In this module the expected objects are written in the order the keys first appear, so it works. For bigger projects, compare each key one at a time.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Use any assistant you have. Make up your own requirement, or reuse the one above, and ask for the plan before the code. Then ask for the code, and run your checks yourself.',
      },
      {
        type: 'prompt',
        label: 'Ask for the plan first',
        text: `I will give you a small requirement for a JavaScript function. Do not write any code yet.
First, restate the requirement in your own words. Then give me your plan as numbered steps, and list every assumption you are making and every question you would ask me.

[paste your requirement here]`,
      },
      {
        type: 'prompt',
        label: 'Then ask for the code',
        text: `Your plan is fine. Now write the function in plain JavaScript only, with no libraries. After the code, list each example from my requirement and say what your function returns for it.`,
      },
      {
        type: 'paragraph',
        text: 'What to look for: does the plan add features you did not ask for, or leave out a rule? When the code arrives, run your own checks. The "what it returns" list the assistant wrote is also a prediction, and it can be wrong, so trust your run, not its list. One way it can mislead you: it may say "all cases handled" about a case you never specified. If a case was not in the requirement, its behaviour is a guess.',
      },
      {
        type: 'takeaways',
        items: [
          'A requirement has a purpose, inputs, outputs, examples, edge cases and rules, and constraints. Examples and edge cases remove most guessing.',
          'Ask for a plan before code. A plan that does not match your requirement is cheap to fix.',
          'Write the checks from your examples before the assistant\'s code arrives, so the verdict comes from running, not from its tone.',
          'A check only means something if a wrong function would fail it. Include a check that a do-nothing function cannot pass.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-52-arrange-1',
          kind: 'arrange',
          title: 'Put the working loop in order',
          prompt: 'Arrange these steps as a flowchart written in text: the order you follow when you generate code from a requirement. The decisions are written as IF lines.',
          concept: 'requirement-first workflow',
          language: 'text',
          solution: [
            'Write the requirement: purpose, inputs, outputs, examples, edge cases',
            'Ask the assistant for a plan before any code',
            'IF the plan does not match the requirement THEN fix the requirement or the plan and ask again',
            'Ask for the code',
            'Run your examples as checks',
            'IF a check fails THEN show the assistant the failing output and change one thing',
            'Read and review the code that passes',
          ],
          reasons: [
            'Everything else depends on knowing exactly what you want.',
            'A plan exposes a misunderstanding before any code exists.',
            'You fix a wrong plan now, while it is cheap.',
            'Only once the plan is right do you ask for code.',
            'The checks come from your requirement, so they judge the code.',
            'A failing check is information to hand back, one change at a time.',
            'Passing checks are not the end: you still read what you will keep.',
          ],
          hints: [
            'You cannot check anything until you know what you want.',
            'The plan comes before the code, and the checks come after the code.',
            'Read last: you review the code once it passes.',
          ],
          explanation: 'The loop starts from your requirement, asks for a plan, then for code, and lets running checks decide. Reading and reviewing come last, which is where the next lessons pick up.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-52-fill-blank-1',
          kind: 'fill-blank',
          title: 'Write the expected values',
          prompt: 'The requirement is in the comments. Fill in what each check should expect, using only the requirement. All three checks should print PASS.',
          concept: 'examples as checks',
          language: 'javascript',
          code: `// Requirement: lastCharge(expenses) returns the amount of the LAST expense in the list.
// An empty list returns 0.
function lastCharge(expenses) {
  if (expenses.length === 0) {
    return 0;
  }
  return expenses[expenses.length - 1].amount;
}
function check(name, actual, expected) {
  const same = JSON.stringify(actual) === JSON.stringify(expected);
  console.log((same ? 'PASS ' : 'FAIL ') + name);
}
check('empty list', lastCharge([]), ___);
check('one expense', lastCharge([{ amount: 24 }]), ___);
check('two expenses', lastCharge([{ amount: 24 }, { amount: 50 }]), ___);`,
          blanks: [
            { answers: ['0'], feedback: 'The requirement says an empty list returns 0.' },
            { answers: ['24'], feedback: 'With one expense, the last one is that expense. Its amount is 24.' },
            { answers: ['50'], feedback: 'The last expense of the two is the second one. Its amount is 50.' },
          ],
          bank: ['0', '24', '50', 'null', '[]', 'undefined'],
          tests: { kind: 'output', expected: ['PASS empty list', 'PASS one expense', 'PASS two expenses'] },
          hints: [
            'Read the requirement in the comments, not the code, to decide each answer.',
            'The empty list is the one case the requirement states directly.',
            'The last expense is the one at the end of the list, not the biggest.',
          ],
          explanation: 'The expected values come from the requirement: 0 for an empty list, and the amount of the last expense otherwise. Deriving them from the requirement, not from the code, is what makes a check independent.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-52-scenario-1',
          kind: 'scenario',
          title: 'The plan has extras',
          prompt: 'Choose the best response to the plan.',
          concept: 'reviewing a plan',
          situation: 'You asked for countByCategory and a plan first. The plan says it will count expenses by category, and also sort the categories alphabetically and add a "total" field to the result. Your requirement asked for neither.',
          options: [
            { text: 'Tell it to follow the requirement exactly and remove the sorting and the total field.', consequence: 'You get the smaller function you specified. Fewer behaviours means less code to read and fewer cases to test.', quality: 'best' },
            { text: 'Ask why it added them, then decide whether you really want them and update the requirement.', consequence: 'A reasonable path. If an extra turns out to be useful you write it into the requirement and a check for it.', quality: 'acceptable' },
            { text: 'Accept the plan, since extra features can only help.', consequence: 'Every extra behaviour is code you have to read and test, and the total field would also break your example, which expects exactly { transport: 2, food: 1 }.', quality: 'poor' },
            { text: 'Switch to a different assistant and ask again.', consequence: 'A different tool will make different guesses. The cause is a plan that does not match your requirement, and that is fixed by saying so.', quality: 'poor' },
          ],
          hints: [
            'Compare the plan with your requirement, line by line.',
            'Anything not in the requirement is something you did not ask for and now have to verify.',
            'The best answer corrects the plan against the requirement before any code is written.',
          ],
          explanation: 'A plan is the cheapest place to catch a mismatch. Send it back to match the requirement, or consciously add the extra to the requirement together with a check.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-52-q1',
        prompt: 'Which addition improves "write a function that counts my expenses" the most?',
        choices: [
          'Writing the whole request in capital letters so that the assistant pays attention',
          'Asking the assistant for the shortest solution that it can possibly think of',
          'An example input, its exact output, and what to do for an empty list',
          'Telling the assistant that you are in a hurry and need the code quickly',
        ],
        answer: 2,
        explanation: 'Examples and edge cases are what remove guessing. Capital letters, speed and shortness do not tell the assistant what a correct answer looks like.',
      },
      {
        id: 'programming-fundamentals-52-q2',
        prompt: 'Why do you write the checks before the assistant\'s code arrives?',
        choices: [
          'So the verdict comes from your requirement and a real run, not from tone',
          'Because assistants refuse to write any code if no checks exist beforehand',
          'So the assistant can copy your checks and then skip testing its own code later',
          'Because checks written afterwards would not be allowed to fail at all',
        ],
        answer: 0,
        explanation: 'Checks written from the requirement are independent of the code. Checks written after reading the code tend to match whatever the code already does.',
      },
      {
        id: 'programming-fundamentals-52-q3',
        prompt: 'In the lesson, the do-nothing placeholder passed the "empty list" check. What does that teach?',
        choices: [
          'That the check is wrong and should be deleted from the set of checks',
          'That empty lists are never worth testing in a real project of any size',
          'That the placeholder is a correct solution for empty input and nothing else, so it can stay',
          'That a passing check proves little if a wrong function can pass it too',
        ],
        answer: 3,
        explanation: 'If a function that does nothing passes a check, the check cannot tell a good function from a bad one. Include checks that only a correct function passes.',
      },
      {
        id: 'programming-fundamentals-52-q4',
        prompt: 'What is the main benefit of asking for a plan before the code?',
        choices: [
          'The code that follows is guaranteed to have no bugs left in it at all',
          'A misunderstanding shows up before there is code to untangle',
          'The assistant uses fewer tokens, so its answer is always more accurate than usual',
          'The plan replaces the need to write examples and edge cases for the function',
        ],
        answer: 1,
        explanation: 'A plan is short and quick to judge against your requirement. Nothing guarantees correct code, and a plan never replaces examples.',
      },
      {
        id: 'programming-fundamentals-52-q5',
        audience: { max: 'beginner' },
        prompt: 'In the cake analogy, which part of a requirement is "no nuts, because Ana is allergic"?',
        choices: [
          'An edge case or rule that the result must respect',
          'The example of how the finished cake should look when it is done',
          'The purpose of the cake, written down in one short sentence',
          'A constraint on which oven the baker is allowed to use',
        ],
        answer: 0,
        explanation: 'It is a rule the result must respect, just as "do not change the list" is a rule for the function.',
      },
      {
        id: 'programming-fundamentals-52-q6',
        audience: { min: 'advanced' },
        prompt: 'Your check compares results with JSON.stringify, and a correct implementation fails it because it returns the same keys in a different order. What is the right fix?',
        choices: [
          'Ask the assistant to always return the keys in alphabetical order',
          'Delete the check, since the data in both outputs is identical',
          'Sort the keys inside the function so that its output matches the test',
          'Compare keys and values without depending on their order',
        ],
        answer: 3,
        explanation: 'Key order is not part of the requirement, so the check should not depend on it. Fix the test instead of bending the implementation to it.',
      },
    ],
    task: {
      title: 'Write a requirement and its checks',
      minutes: 20,
      steps: [
        'Choose a small function for the expense tracker, for example largestExpense(expenses), which returns the expense with the biggest amount.',
        'Write its requirement with the six parts. Decide what happens for an empty list and for two expenses with the same amount.',
        'Turn at least three examples into check(...) lines and run them against a placeholder function in any free JavaScript environment or the code runner in this app.',
        'Optionally paste your requirement into an assistant with the "Ask for the plan first" prompt and note one assumption in its plan that you had not thought of.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before you run anything, write the expected value of each check on paper from the requirement. Then compare with the placeholder\'s FAIL lines.'] },
      { audience: { min: 'advanced' }, steps: ['Add one property-style check: for any list you can build, the counts in the result add up to the length of the list. Write it as a loop over three lists.'] },
    ],
  },
  {
    id: 'programming-fundamentals-53',
    day: 53,
    title: 'Understanding AI-Generated Code Line by Line',
    summary: 'Use a repeatable method to read code you did not write: shape first, then every line, then a hand trace of one real example.',
    intro: {
      objectives: [
        'Apply a five-step method to read a function an assistant wrote',
        'Trace one example through generated code with a table',
        'Check an assistant\'s explanation of code against your own trace',
      ],
      why: 'Code you cannot read is code you cannot fix, defend or safely ship. If you can read it line by line, an assistant becomes much more useful and much less risky.',
    },
    minutes: 25,
    skills: ['ai-partner', 'debug-test'],
    body: [
      {
        type: 'paragraph',
        text: 'An assistant can produce a working-looking function in seconds. Reading it is the part that takes your attention, and it is the part that cannot be skipped. If you accept code you did not understand, you cannot tell when it breaks, you cannot change it safely, and you cannot say what it does when someone asks. This lesson gives you a method you can repeat on any generated code. The code you will read here is an example of what an assistant might return for the requirement from the last lesson. We wrote it for this lesson and ran it; real answers vary from one request to the next.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Checking a receipt before you pay. You do not trust the total because it is printed neatly. You go down the lines: the item, the quantity, the price, and then you check that the lines add up to the total. A receipt can look professional and still charge you twice for the same drink.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops: lines on a receipt are independent, so you can check them in any order. Lines of code depend on the ones before them and often run many times inside a loop, so you read them in order and follow the values as they change.',
      },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'Here is the method. Do the steps in order, and write things down.' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Read the shape.** What is the function called, what does it take in, and what does it return? Compare that with your requirement before you read a single line of the body.',
          '**Name every variable.** For each one, say what it holds at the start, what it holds at the end, and whether it changes.',
          '**Read each line as a sentence.** "For each expense in the list, work out its category." If you cannot say it as a sentence, mark the line.',
          '**Trace one real example.** Pick a small input and follow the values with a table, as you did in the reading code module.',
          '**List what you still do not understand, and what the code does that you did not ask for.** Ask about those specifically, then confirm the answer by running something.',
        ],
      },
      {
        type: 'table',
        headers: ['Kind of line', 'The question to ask'],
        rows: [
          ['A variable is declared', 'What does it hold right now, and will it change?'],
          ['A loop starts', 'What is it looping over, and what ends it?'],
          ['A condition', 'Which values go one way, and which go the other?'],
          ['An assignment', 'Which variable changes, and from what to what?'],
          ['A return', 'Is this exactly what the requirement promised: returned, not printed?'],
        ],
        caption: 'One question for each kind of line. They are the same questions you asked while reading code in the debugging module.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'This is an example of what an assistant might return for the countByCategory requirement. We wrote it ourselves for this lesson and ran it. Read it using the method: first the shape (one input, expenses; one returned object), then the body.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'An example of a generated function (written for this lesson)',
        code: `function countByCategory(expenses) {
  const counts = {};
  for (const expense of expenses) {
    const category = expense.category || 'uncategorized';
    if (counts[category] === undefined) {
      counts[category] = 0;
    }
    counts[category] = counts[category] + 1;
  }
  return counts;
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Running it on four expenses (add the function above first)',
        code: `const sample = [
  { description: 'Jeepney fare', amount: 24, category: 'transport', date: '2026-11-16' },
  { description: 'Lunch', amount: 85, category: 'food', date: '2026-11-16' },
  { description: 'Tricycle', amount: 18, category: 'transport', date: '2026-11-17' },
  { description: 'Mystery', amount: 10, date: '2026-11-17' },
];
console.log(countByCategory(sample));`,
      },
      { type: 'code', language: 'text', label: 'Real output', code: '{ transport: 2, food: 1, uncategorized: 1 }' },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Line 1:** the function takes `expenses` (a list) and, as we will confirm at the last line, returns something.',
          '**Line 2:** `counts` starts as an empty object. It will hold one number per category.',
          '**Line 3:** the loop visits each expense, one at a time, in the list.',
          '**Line 4:** the category is the expense\'s own category, or "uncategorized" if that is missing or empty. `||` uses the right side when the left side is falsy, and an empty string is falsy.',
          '**Lines 5 to 7:** if this category has no tally yet (it is `undefined`), start its count at 0.',
          '**Line 8:** add one to this category\'s count.',
          '**Line 10:** return the object. It does not print anything, which matches the requirement.',
        ],
      },
      {
        type: 'table',
        headers: ['Pass', 'expense.category', 'category (line 4)', 'counts after line 8'],
        rows: [
          ['1', 'transport', 'transport', '{ transport: 1 }'],
          ['2', 'food', 'food', '{ transport: 1, food: 1 }'],
          ['3', 'transport', 'transport', '{ transport: 2, food: 1 }'],
          ['4', '(missing)', 'uncategorized', '{ transport: 2, food: 1, uncategorized: 1 }'],
        ],
        caption: 'The trace of the four expenses. It matches the real output.',
      },
      {
        type: 'paragraph',
        text: 'Now ask what the code does that you did not request. It does not change the list, it does not print, and it adds nothing extra. An assistant might also offer a shorter version of lines 5 to 8, `counts[category] = (counts[category] || 0) + 1;`. It gives the same result. Which one you keep is a matter of taste: the long form is easier for a beginner to read.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: think of a tally sheet at the market stall. Each time a customer buys something, you find the right row and add one stroke. If the row does not exist yet, you write the name and make the first stroke. `counts` is the sheet. `for (const expense of expenses)` is "take the next purchase". Line 4 decides which row to use, and "uncategorized" is the row for purchases with no label. Lines 5 to 8 are "if there is no row yet, make one at zero, then add one stroke". When the list is finished, `return counts` hands you the finished sheet.',
      },
      { type: 'heading', text: 'Asking the assistant to explain' },
      {
        type: 'paragraph',
        text: 'Asking an assistant to explain code line by line is a good habit, with one rule: its explanation is another claim to check, not a fact. An explanation can sound right and still be wrong. Here is an example, written for this lesson, of an explanation with a mistake in it.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'An example explanation with a deliberate mistake (written for this lesson)',
        code: 'Line 4 gives each expense a category, using "uncategorized" if it has none.\nLine 5 checks whether the counts object is empty, and if so sets it up.\nLine 8 adds one to the count for that category.',
      },
      {
        type: 'paragraph',
        text: 'Your trace catches the mistake. After pass 1, `counts` is not empty, yet on pass 2 the code still needs to start a tally for "food". So line 5 cannot be checking whether the whole object is empty. It checks whether this category has a tally yet. When your trace and the explanation disagree, the trace is the evidence, because you can run it. One more trap: names and comments can describe what the author meant, while the code does something else. An explanation that leans on names can repeat that mistake.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'In review, treat generated code like a contribution from a stranger. Read the shape and the diff first, then check the behaviour against the specification rather than against the author\'s explanation. Targeted execution beats prose: a `console.log` inside the loop, a failing test, or a debugger stepping session confirms or refutes a claim in seconds. Watch for defaults that silently widen the contract. Here `|| \'uncategorized\'` also swallows an empty string, which is probably intended, but it is a behaviour someone should have chosen on purpose. Also check what the code does not do, such as validation, which this version does not perform on non-object entries.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Use the function above, or any short function an assistant gave you. Make your own trace first, before you read the explanation. Then compare.',
      },
      {
        type: 'prompt',
        label: 'Explain it line by line',
        text: `Here is a JavaScript function I got from an assistant:

[paste the function]

Explain it line by line in plain words for someone who has finished a beginner course. For each line, say what it does and what the variables hold at that point. Then list anything the function does that goes beyond what I asked, and anything you are unsure about.`,
      },
      {
        type: 'prompt',
        label: 'Check my reading',
        text: `I think line [number] of that function does this: [your sentence]. Say whether I am right or wrong, and why, using one small example input. Do not give me the full explanation of the other lines.`,
      },
      {
        type: 'paragraph',
        text: 'What to look for: compare the explanation with your own trace, line by line. If they differ, add a `console.log` to the code and run it to see which one is right. One way it can mislead you: it may describe what the code is meant to do, because of its names and comments, instead of what the code really does. Treat every sentence of the explanation as something to confirm.',
      },
      {
        type: 'takeaways',
        items: [
          'Read generated code with a method: the shape, every variable, each line as a sentence, a hand trace of one example, then a list of what is unclear or unrequested.',
          'A trace table shows what the code really does. It is the evidence you can run.',
          'An assistant\'s explanation is a claim, not a fact. When it disagrees with your trace, check by running.',
          'Ask what the code does that you did not request, and what it does not do.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-53-predict-output-1',
          kind: 'predict-output',
          title: 'An empty category',
          prompt: 'Use the function from the lesson. Work out what it prints for this list, including an expense whose category is an empty string.',
          concept: 'tracing generated code',
          language: 'javascript',
          code: `function countByCategory(expenses) {
  const counts = {};
  for (const expense of expenses) {
    const category = expense.category || 'uncategorized';
    if (counts[category] === undefined) {
      counts[category] = 0;
    }
    counts[category] = counts[category] + 1;
  }
  return counts;
}
console.log(countByCategory([{ category: 'food' }, { category: '' }, { category: 'food' }, {}]));`,
          choices: ['{ food: 2, uncategorized: 2 }', '{ food: 2, "": 1, uncategorized: 1 }', '{ food: 2, uncategorized: 1 }', '{ food: 2 }'],
          wrongNotes: {
            '{ food: 2, "": 1, uncategorized: 1 }': 'An empty string is falsy, so `||` replaces it with "uncategorized". It never becomes a key of its own.',
            '{ food: 2, uncategorized: 1 }': 'Two expenses have no usable category: the empty string and the missing one. Both use "uncategorized".',
            '{ food: 2 }': 'Expenses without a category are not skipped. They are counted under "uncategorized".',
          },
          hints: [
            'Trace one pass at a time: category, then the object after the pass.',
            'An empty string is falsy, just like a missing category.',
            'Passes 2 and 4 both land in "uncategorized".',
          ],
          explanation: 'Pass 1 gives food 1. Pass 2 has an empty string, which is falsy, so it becomes "uncategorized" and starts at 1. Pass 3 makes food 2. Pass 4 has no category and makes uncategorized 2.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-53-match-1',
          kind: 'match',
          title: 'Read each line',
          prompt: 'These four lines come from one function that adds up the spending of a single category. Match each line to what it does.',
          concept: 'reading code as sentences',
          labels: { terms: 'The line', meanings: 'What it does' },
          pairs: [
            { term: 'let total = 0;', definition: 'Starts a running sum that begins at zero', note: 'This declares the variable and gives it a starting value.' },
            { term: 'for (const expense of expenses) {', definition: 'Visits each expense in the list, one at a time', note: 'A loop over the list, with `expense` holding the current item.' },
            { term: 'if (expense.category === category) {', definition: 'Lets only the expenses of the wanted category through', note: 'A condition that is true only when the two categories are equal.' },
            { term: 'total = total + expense.amount;', definition: 'Adds the amount of this expense to the running sum', note: 'This reassigns total to its old value plus the amount.' },
          ],
          hints: [
            'Say each line aloud as a sentence.',
            'The line with `===` is asking a yes or no question.',
            'The line that starts with `let` is the only one that creates a variable.',
          ],
          explanation: 'Reading each line as a short sentence turns code into an explanation you can check: start at zero, visit each expense, keep only the right category, add its amount.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-53-fix-bug-1',
          kind: 'fix-bug',
          title: 'Find the wrong line',
          prompt: 'An assistant returned this function. It should add up only the food expenses (50), but the program prints a different number. Find the line and choose the fix.',
          concept: 'reading for mistakes',
          language: 'javascript',
          code: `function totalOfCategory(expenses, category) {
  let total = 0;
  for (const expense of expenses) {
    if (expense.category = category) {
      total = total + expense.amount;
    }
  }
  return total;
}
console.log(totalOfCategory([{ category: 'food', amount: 50 }, { category: 'transport', amount: 24 }], 'food'));`,
          bugLine: 4,
          fixes: [
            { line: 'if (expense.category === category) {', correct: true, why: 'Comparing with === asks the question. Only the food expense passes, so the total is 50.' },
            { line: 'if (expense.category) {', correct: false, why: 'Any expense that has a category passes, so both amounts are added and the total is 74.' },
            { line: 'if (expense.category !== category) {', correct: false, why: 'This keeps the other categories. The total would be 24, not 50.' },
            { line: 'if (category) {', correct: false, why: 'The wanted category is always a non-empty word here, so every expense passes and the total is 74.' },
          ],
          tests: { kind: 'output', expected: ['50'] },
          hints: [
            'Read line 4 as a sentence. Is it asking a question, or giving a value?',
            'A single = stores a value. A comparison needs a different operator.',
            'The fix is the comparison with three equal signs.',
          ],
          explanation: 'A single = assigns `category` to `expense.category`, and the assigned text is truthy, so every expense passed and the total was 74. The comparison `===` asks whether they are equal. This is the kind of slip that reading each line as a sentence catches.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-53-q1',
        prompt: 'You receive generated code. According to the method, what do you do first?',
        choices: [
          'Read the shape: name, inputs and what comes back, against your requirement',
          'Run the code once, and trust it if it prints something that looks sensible',
          'Read the body of the function from the bottom line up to the top, one line at a time',
          'Ask the assistant whether it is sure that the code is correct, and believe its answer',
        ],
        answer: 0,
        explanation: 'The shape is the quickest comparison with the requirement. Running comes later with real checks, and asking whether it is sure does not give evidence.',
      },
      {
        id: 'programming-fundamentals-53-q2',
        prompt: 'In the trace, why does `counts` stay { transport: 2, food: 1 } on pass 3?',
        choices: [
          'Pass 3 is skipped entirely because the category has repeated already',
          'The loop stops as soon as every category has been seen once',
          'Transport already has a tally, so line 8 simply adds one more to it',
          'The function removes the oldest entry whenever a new one arrives in the list',
        ],
        answer: 2,
        explanation: 'On pass 3 the category "transport" already exists, so lines 5 to 7 do nothing and line 8 raises its count from 1 to 2.',
      },
      {
        id: 'programming-fundamentals-53-q3',
        prompt: 'An assistant says, "Line 5 checks whether the counts object is empty." How can you tell this is wrong?',
        choices: [
          'Because assistants are not allowed to describe the fifth line of any function',
          'In the trace, counts is not empty on pass 2, yet "food" still needs a tally',
          'Because the word empty never appears anywhere in the code of the function',
          'Because the function would refuse to run at all if line 5 did that job',
        ],
        answer: 1,
        explanation: 'Following the real values shows what the condition decides. A trace gives you evidence that an explanation cannot argue with.',
      },
      {
        id: 'programming-fundamentals-53-q4',
        prompt: 'What does `expense.category || \'uncategorized\'` give when the category is an empty string?',
        choices: [
          'An empty string, because the left side exists',
          'An error, because an empty string cannot be used in a condition',
          'The value undefined, because there is nothing to use',
          '"uncategorized", because an empty string is falsy',
        ],
        answer: 3,
        explanation: '`||` uses the right side whenever the left side is falsy, and an empty string is one of the falsy values.',
      },
      {
        id: 'programming-fundamentals-53-q5',
        audience: { max: 'beginner' },
        prompt: 'In the tally sheet comparison, what does `return counts` do?',
        choices: [
          'It starts a brand new tally sheet for the next customer who arrives',
          'It erases the tally sheet so that it is clean for later use',
          'It hands the finished tally sheet back to whoever called',
          'It prints the tally sheet on the screen so that everyone can read it',
        ],
        answer: 2,
        explanation: 'return gives the result back to the caller. Printing is a different action, done with console.log, and the requirement said to return.',
      },
      {
        id: 'programming-fundamentals-53-q6',
        audience: { min: 'advanced' },
        prompt: 'A generated function looks right and its explanation is clear. Which check adds the most confidence before you merge it?',
        choices: [
          'Rereading the explanation twice to make sure that every sentence is consistent',
          'Tracing a normal and an edge input, then confirming with a run',
          'Asking the same assistant to confirm that the function is correct, in writing',
          'Checking that the function is short and uses only familiar syntax and names',
        ],
        answer: 1,
        explanation: 'Execution against inputs, including an edge case, is evidence. Rereading, asking the author again and judging style are not.',
      },
    ],
    task: {
      title: 'Trace it by hand, then compare',
      minutes: 20,
      steps: [
        'Copy the countByCategory function from the lesson into any free JavaScript environment or the code runner in this app.',
        'On paper, make a trace table for a list of four expenses of your own, with at least one repeated category and one without a category. Write the object after each pass.',
        'Run the function with your list and compare the real output with your table.',
        'Paste the function into an assistant with the "Explain it line by line" prompt. Mark one sentence of its explanation that matches your trace and, if you can find one, a sentence that does not, and say what settled it.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Add a line `console.log(category, counts);` just before the closing brace of the loop and run it. The computer prints a trace like yours.'] },
      { audience: { min: 'advanced' }, steps: ['Ask the assistant for a second implementation that uses a Map. Compare the two for readability and behaviour on an empty category, and decide which you would merge and why.'] },
    ],
  },
  {
    id: 'programming-fundamentals-54',
    day: 54,
    title: 'Finding Bugs, Reviewing and Testing AI Solutions',
    summary: 'Review generated code with a checklist, test it with checks written from the requirement, and hand failures back to the assistant with evidence.',
    intro: {
      objectives: [
        'Review generated code with a checklist for correctness, safety and simplicity',
        'Run checks against several attempts and read the failing output',
        'Give an assistant a failing result so that it can fix one thing at a time',
      ],
      why: 'Generated code often passes the obvious example and fails the odd case. A review checklist and a few honest checks catch most of those problems before they reach anyone else.',
    },
    minutes: 28,
    skills: ['ai-partner', 'debug-test'],
    body: [
      {
        type: 'paragraph',
        text: 'A plausible answer is not a correct one. Generated code usually looks tidy and often handles the case you tried first. The bugs live where you did not look: the empty list, the missing field, the second call, the value that changes behind your back. This lesson combines two skills you already have, reading code and writing tests, into one routine for judging a solution an assistant gives you. Every attempt shown here is an example we wrote for this lesson and ran, so you can see real failing output.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Buying a second-hand motorcycle. You do not buy it because the seller says "runs great". You look it over, you take it for a ride, and you test the brakes on purpose. If something feels off, you tell the seller exactly what you felt, not just "it is bad".',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops: a motorcycle\'s problems are often visible or audible. Code bugs hide in inputs nobody tried, so you have to bring the bad inputs yourself, and that is what edge-case checks are for.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'Review asks three questions. **Is it correct?** It must give the right answer for your examples and for the odd inputs. **Is it safe?** It must not damage your data or leak anything. **Is it simple enough to keep?** If you cannot maintain it, it is a liability even when it works. The table turns those questions into things to look for.',
      },
      {
        type: 'table',
        headers: ['Check', 'What to look for', 'Example in the expense tracker'],
        rows: [
          ['Matches the requirement', 'Every example and rule is met, and nothing extra appears', 'It returns { transport: 2, food: 1 } and no additional "total" key'],
          ['Edge cases', 'Empty, missing, zero, negative, wrong type, duplicates', 'An expense with no category, or an empty list'],
          ['Changes its input', 'The caller\'s list or object is altered', 'It sorts or empties the array that was passed in'],
          ['Invented things', 'A function, property or library that does not exist', 'It calls expenses.sum() or reads expense.cost'],
          ['Returns or prints', 'The result is returned if the requirement says return', 'It uses console.log and returns nothing'],
          ['Security and data', 'Secrets in the code, unchecked input, personal data written to logs', 'A key typed into the file, or a full expense list printed to a log'],
          ['Over-complicated', 'More steps, loops or layers than the job needs', 'Two nested loops to count something one loop can count'],
        ],
        caption: 'A review checklist. Each row is a question you can answer with a run or a quick read.',
      },
      {
        type: 'paragraph',
        text: 'Then run it. The routine is: write the checks first, run the attempt, read every failing line, and give the assistant the exact input, the expected result and the actual result. "It does not work" gives it nothing to fix. "For [{ category: \'food\' }, {}] I expected { food: 1, uncategorized: 1 } and got { food: 1, undefined: 1 }" gives it everything. Ask for one change at a time and run the checks again, so you always know which change did what.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'We will test three attempts at countByCategory, the kind an assistant gives you across a conversation. First the checks. They are the helper from the last lesson, now also printing what the function returned when a check fails. The `+` joins pieces of text together.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Step 1: the checks (put the attempt you want to test above them)',
        code: `function check(name, actual, expected) {
  const same = JSON.stringify(actual) === JSON.stringify(expected);
  console.log((same ? 'PASS ' : 'FAIL ') + name + (same ? '' : ' (got ' + JSON.stringify(actual) + ')'));
}

check('counts each category', countByCategory([{ category: 'transport' }, { category: 'food' }, { category: 'transport' }]), { transport: 2, food: 1 });
check('empty list', countByCategory([]), {});
check('missing category', countByCategory([{ category: 'food' }, {}]), { food: 1, uncategorized: 1 });
const original = [{ category: 'food' }];
countByCategory(original);
check('input is not changed', original, [{ category: 'food' }]);`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Attempt 1: an example of a first answer (written for this lesson)',
        code: `function countByCategory(expenses) {
  const counts = {};
  for (const expense of expenses) {
    counts[expense.category] = counts[expense.category] + 1;
  }
  return counts;
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of Step 1 with Attempt 1',
        code: 'FAIL counts each category (got {"transport":null,"food":null})\nPASS empty list\nFAIL missing category (got {"food":null,"undefined":null})\nPASS input is not changed',
      },
      {
        type: 'paragraph',
        text: 'You hand the assistant the failing lines. A typical second answer fixes the first problem:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Attempt 2: an example of the "fix" (written for this lesson)',
        code: `function countByCategory(expenses) {
  const counts = {};
  for (const expense of expenses) {
    counts[expense.category] = (counts[expense.category] || 0) + 1;
  }
  return counts;
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of Step 1 with Attempt 2',
        code: 'PASS counts each category\nPASS empty list\nFAIL missing category (got {"food":1,"undefined":1})\nPASS input is not changed',
      },
      {
        type: 'paragraph',
        text: 'The main example passes now. Only the edge-case check you wrote from the requirement catches the next problem. One more round gives the version that follows every rule:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Attempt 3: an example that follows every rule (written for this lesson)',
        code: `function countByCategory(expenses) {
  const counts = {};
  for (const expense of expenses) {
    const category = expense.category || 'uncategorized';
    counts[category] = (counts[category] || 0) + 1;
  }
  return counts;
}`,
      },
      { type: 'code', language: 'text', label: 'Real output of Step 1 with Attempt 3', code: 'PASS counts each category\nPASS empty list\nPASS missing category\nPASS input is not changed' },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Attempt 1:** `counts[expense.category]` is `undefined` the first time a category appears, and `undefined + 1` is `NaN` ("not a number"). `JSON.stringify` writes NaN as `null`, which is why the output shows null. The empty list and the unchanged input pass because the loop never runs or never touches the list.',
          '**Attempt 2:** `(counts[expense.category] || 0)` uses 0 when there is no tally yet, so counting works. But an expense with no category reads `expense.category` as `undefined`, and the object ends up with a key literally named "undefined". The requirement said "uncategorized".',
          '**Attempt 3:** line 4 gives every expense a category before it is used, and the rest is the same counting as Attempt 2. All four checks pass.',
          'Each failure was found by a check written from the requirement before the code existed. Reading alone would likely have missed the "undefined" key, because the code looks reasonable.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Passing is not the end of the review. This fourth version also passes all four checks, and you would still ask for a simpler one:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Attempt 4: passes, but over-complicated (written for this lesson)',
        code: `function countByCategory(expenses) {
  const categories = [];
  for (const expense of expenses) {
    const name = expense.category || 'uncategorized';
    if (!categories.includes(name)) {
      categories.push(name);
    }
  }
  const counts = {};
  for (const name of categories) {
    counts[name] = 0;
    for (const expense of expenses) {
      if ((expense.category || 'uncategorized') === name) {
        counts[name] = counts[name] + 1;
      }
    }
  }
  return counts;
}`,
      },
      {
        type: 'paragraph',
        text: 'It works, but it is twice as long, walks the whole list once for every category, and repeats the "uncategorized" rule in two places, so a later change could fix one and forget the other. A good follow-up request is: "Give me the simplest version that still passes these checks."',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a **test** is a question about your code that has a known answer. You ask the question, compare the code\'s answer with the answer you know is right, and say PASS or FAIL. NaN means "not a number", and you get it when you do arithmetic with something that is not a number, such as `undefined + 1`. Attempt 1 failed because the first time a category showed up it had no tally to add to. The failing output is your best tool: it tells you what went in, what you expected and what came out.',
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'When you have more than a handful of checks, keep them as data: an array of cases like { name, input, expected } and one loop that calls `check` for each. Adding a case becomes one new line, and you can hand the whole list to an assistant and ask which cases are missing.',
      },
      {
        type: 'warning',
        text: 'Security and data problems rarely show up as a failing check. Read for them on purpose: a password or key typed into the code, input used without being checked, or personal data written to a log or sent somewhere. If generated code contains a secret, remove it and never paste real secrets into a prompt in the first place.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Make the evidence reviewable. Keep checks in the repository, confirm they fail when the code is deliberately broken (a test that cannot fail proves nothing), and ask an agent for the command it ran and its output instead of a bare "all tests pass", as Claude Code\'s best-practices page recommends. A second reviewer that has not seen how the code was written is useful, but scope it: the same page notes that a reviewer asked to find problems will always find something, so ask it to check the change against the specification and skip style. Also review the dependencies an assistant introduced: OWASP warns that models can suggest libraries that do not exist, and that attackers can publish packages under such names.',
      },
      {
        type: 'version',
        text: 'GitHub\'s Copilot documentation says that with suggestions you review and apply each one, and that with agentic work you remain responsible for reviewing and approving. Cursor\'s documentation lists a review step: inspect diffs, run checks and catch problems before you merge. Claude Code\'s best-practices page recommends asking for evidence of a check, and says a reviewer asked to find problems will always find something, so scope it to the specification. OWASP\'s LLM09 page says models may suggest insecure or non-existent code libraries. Tools differ, but in every one of them the review stays with you.',
        checked: CHECKED,
        sources: [DOCS.copilotAbout, DOCS.cursorDocs, DOCS.claudeCodeBest, DOCS.owaspMisinformation],
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Take a function an assistant wrote (the one from the last lesson will do) together with your requirement. Ask for a review and for tests, then run everything yourself.',
      },
      {
        type: 'prompt',
        label: 'Review it like a careful reviewer',
        text: `Here is my requirement and the function an assistant wrote.

Requirement: [paste]
Function: [paste]

Review it as a careful reviewer. Do not rewrite it yet. List: (1) any example from my requirement that it fails, (2) edge cases it does not handle, (3) anything it changes that it should not, (4) anything over-complicated, and (5) anything you are unsure about. For each problem, give me a small input that shows it.`,
      },
      {
        type: 'prompt',
        label: 'Write the checks',
        text: `Write five checks for this function as plain JavaScript lines in the form check(name, actual, expected). Include my examples, an empty list, a missing category, and a check that the input list is not changed. Work out each expected value by hand. Tell me which expected values you are least sure of.`,
      },
      {
        type: 'paragraph',
        text: 'What to look for: run every input the assistant gives you and see whether the problem it described is real. An assistant asked to review will usually find something, even in good code, so judge each finding by the input that shows it, not by how worried it sounds. Run its checks too, and work out one expected value yourself, because an expected value it got wrong makes a correct function look broken.',
      },
      {
        type: 'takeaways',
        items: [
          'Review for correctness, safety and simplicity. A checklist stops you from only looking at the example that already works.',
          'Write the checks from the requirement, run each attempt and read every failing line. Edge-case checks catch what the main example misses.',
          'When something fails, give the assistant the input, the expected result and the actual result, and ask for one change at a time.',
          'Passing is not the end: ask for the simplest version, and read for secrets, unchecked input and personal data.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-54-fix-bug-1',
          kind: 'fix-bug',
          title: 'Fix Attempt 1',
          prompt: 'This is Attempt 1 from the lesson. It should print {"food":2,"transport":1}. Find the line and choose the fix.',
          concept: 'fixing generated code',
          language: 'javascript',
          code: `function countByCategory(expenses) {
  const counts = {};
  for (const expense of expenses) {
    counts[expense.category] = counts[expense.category] + 1;
  }
  return counts;
}
console.log(JSON.stringify(countByCategory([{ category: 'food' }, { category: 'food' }, { category: 'transport' }])));`,
          bugLine: 4,
          fixes: [
            { line: 'counts[expense.category] = (counts[expense.category] || 0) + 1;', correct: true, why: 'When there is no tally yet, 0 is used, so the first expense of a category makes its count 1.' },
            { line: 'counts[expense.category] = counts[expense.category] + 0;', correct: false, why: 'Undefined plus 0 is still NaN, so the counts are still not numbers.' },
            { line: 'counts[expense.category] = 1;', correct: false, why: 'This sets every category to 1 each time, so food would show 1 instead of 2.' },
            { line: 'counts[expense.category]++;', correct: false, why: 'Adding one to undefined gives NaN as well, so the same problem remains.' },
          ],
          tests: { kind: 'output', expected: ['{"food":2,"transport":1}'] },
          hints: [
            'What does counts[expense.category] hold the first time a category appears?',
            'Undefined plus 1 is NaN. The code needs a starting number when no tally exists yet.',
            'Use || to fall back to 0 before adding one.',
          ],
          explanation: 'The first time a category appears there is nothing to add to, so undefined + 1 gives NaN. The expression (counts[expense.category] || 0) supplies a starting zero, and adding one makes the first count 1.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-54-predict-output-1',
          kind: 'predict-output',
          title: 'What Attempt 2 does with a missing category',
          prompt: 'This is Attempt 2. Work out what it prints for a list that includes an expense with no category.',
          concept: 'edge cases in generated code',
          language: 'javascript',
          code: `function countByCategory(expenses) {
  const counts = {};
  for (const expense of expenses) {
    counts[expense.category] = (counts[expense.category] || 0) + 1;
  }
  return counts;
}
console.log(countByCategory([{ category: 'food' }, {}, { category: 'food' }]));`,
          choices: ['{ food: 2, undefined: 1 }', '{ food: 2 }', '{ food: 2, uncategorized: 1 }', 'An error: cannot read properties of undefined'],
          wrongNotes: {
            '{ food: 2 }': 'The expense with no category is not skipped. Its missing category becomes a key.',
            '{ food: 2, uncategorized: 1 }': 'Attempt 2 has no line that substitutes "uncategorized". That fix arrives in Attempt 3.',
            'An error: cannot read properties of undefined': 'Reading a missing property of an object just gives undefined. It is not an error unless you read a property of undefined itself.',
          },
          hints: [
            'What is expense.category for the object {}?',
            'A property you read that is not there gives undefined.',
            'The key is the word that undefined turns into when it is used as a key.',
          ],
          explanation: 'For {}, expense.category is undefined, and using undefined as a key turns it into the text "undefined". So the object gets a key named undefined with a count of 1. This is exactly the kind of bug that only an edge-case check finds.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-54-match-1',
          kind: 'match',
          title: 'What would you flag?',
          prompt: 'Match each thing you notice in generated code to the review check it breaks.',
          concept: 'review checklist',
          labels: { terms: 'What you notice', meanings: 'The check it breaks' },
          pairs: [
            { term: 'The function prints its result with console.log and returns nothing', definition: 'Returns or prints: the requirement asked for a returned value', note: 'A function that only prints gives the caller nothing to use.' },
            { term: 'The function sorts the array you passed in, so your own list is now in a different order', definition: 'Changes its input: the caller\'s data is altered', note: 'Altering the caller\'s list is a side effect nobody asked for.' },
            { term: 'The code reads expense.cost, but your expenses have amount', definition: 'Invented things: a property that does not exist in your data', note: 'The assistant guessed a name that is not in your objects.' },
            { term: 'A line near the top assigns a password-like value to a variable', definition: 'Security and data: a secret that should not be in the code', note: 'A secret in the file travels with the file wherever it goes.' },
          ],
          hints: [
            'For each situation, ask what the caller or the reader would be surprised by.',
            'Only one of them has to do with data the code should not hold at all.',
            'The expense.cost and amount mismatch means the assistant made a name up.',
          ],
          explanation: 'Each row of the checklist names a kind of problem. Knowing the kind tells you what to run or read: the result, the caller\'s data, the property names, or the secrets.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-54-q1',
        prompt: 'Attempt 2 passed the main example but failed "missing category". What did that check do?',
        choices: [
          'It proved that the main example was wrong all along, from the start',
          'It showed that the check itself had been written incorrectly by mistake',
          'It measured how fast the function runs when it is given a long list',
          'It reached a case the example never touched and exposed a problem',
        ],
        answer: 3,
        explanation: 'Edge-case checks go where the main example does not. That is their job, and it is how Attempt 2\'s "undefined" key was found.',
      },
      {
        id: 'programming-fundamentals-54-q2',
        prompt: 'A check fails. What should you give the assistant to get a useful fix?',
        choices: [
          'A message saying the code does not work and asking it to try harder',
          'The input, the result you expected and the result you actually got',
          'The same prompt again, so that you get a different answer by chance',
          'Nothing at all, since the assistant already knows what is wrong',
        ],
        answer: 1,
        explanation: 'Specific evidence lets it change the right thing. "It does not work" gives it nothing to fix.',
      },
      {
        id: 'programming-fundamentals-54-q3',
        prompt: 'Which finding in a review is a correctness problem and not just a style preference?',
        choices: [
          'It sorts the list passed in, changing the caller\'s data',
          'The variable names are a little longer than you would have chosen yourself',
          'The code uses a for...of loop where you would have written a plain for loop',
          'The function is spread over more lines than you were expecting to see',
        ],
        answer: 0,
        explanation: 'Changing the caller\'s list breaks a rule from the requirement. The others are matters of taste that do not change the result.',
      },
      {
        id: 'programming-fundamentals-54-q4',
        prompt: 'An assistant\'s review of your passing code lists nine problems, mostly about style. What is the best way to handle that list?',
        choices: [
          'Apply all nine changes, since the assistant knows best about code',
          'Ignore the list completely, because passing checks mean the code is perfect',
          'Test each finding, and change only what breaks the requirement',
          'Ask a second assistant to review the first review before touching anything at all',
        ],
        answer: 2,
        explanation: 'A reviewer asked to find problems will find something. Keep what affects correctness, safety or clarity, and verify each finding with the input that shows it.',
      },
      {
        id: 'programming-fundamentals-54-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a test?',
        choices: [
          'A rule that stops other people from using your code without asking you first',
          'A second copy of your code that is kept somewhere safe in case of mistakes',
          'A comment placed above the function that explains what it is supposed to do',
          'A question about your code with a known answer, so you can see if it is right',
        ],
        answer: 3,
        explanation: 'A test asks the code something whose right answer you already know, and reports PASS or FAIL.',
      },
      {
        id: 'programming-fundamentals-54-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent reports "all tests pass" on a change it wrote. What do you ask for before you rely on that?',
        choices: [
          'The command it ran, its output, and proof the tests fail when code is broken',
          'A longer explanation of why the change is correct, written in plain words',
          'Confirmation that the tests were written by the same agent that wrote the change',
          'A summary of the files it changed with no mention of the tests at all',
        ],
        answer: 0,
        explanation: 'Evidence is the command and the output. A test that cannot fail proves nothing, so you also confirm that breaking the code makes a test fail.',
      },
    ],
    task: {
      title: 'Test it, then try to break it',
      minutes: 20,
      steps: [
        'Put the Step 1 checks and Attempt 3 into any free JavaScript environment or the code runner in this app and confirm all four checks pass.',
        'Decide whether "Food" and "food" should count as the same category. Write the rule in one sentence and add a check for it. It should fail, because Attempt 3 does not treat them as the same.',
        'Break Attempt 3 on purpose, for example by deleting the `|| 0`, and confirm at least one check fails. A check that cannot fail proves nothing.',
        'Ask an assistant to change the function so your new check passes, using the failing output as evidence. Run all five checks again.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['For each check, write on paper what you expect before you run it. Then compare with PASS or FAIL.'] },
      { audience: { min: 'advanced' }, steps: ['Run the review prompt in a fresh conversation, then judge each finding with an input that reproduces it. Record how many of the findings were real problems.'] },
    ],
  },
  {
    id: 'programming-fundamentals-55',
    day: 55,
    title: 'Hallucinations and Knowing When Not to Trust AI',
    summary: 'Recognise the ways an assistant is confidently wrong, verify claims by running and looking up, and know the situations where you slow down or do not use it at all.',
    intro: {
      objectives: [
        'Recognise the common kinds of hallucination in generated code and explanations',
        'Verify a doubtful claim by running it or finding the official page',
        'Decide when a task, such as security, money, personal data or licences, needs more than an assistant\'s word',
      ],
      why: 'The assistants that save you hours are the same ones that occasionally invent things with total confidence. Knowing the patterns, and the situations that call for extra care, is what keeps you in charge of what you ship.',
    },
    minutes: 28,
    skills: ['ai-partner', 'debug-test'],
    body: [
      {
        type: 'paragraph',
        text: 'Every lesson in this module has led here. An assistant can write fluent, confident, well-formatted text that is simply false. People call this a **hallucination**: output that reads as credible but is made up. OWASP\'s guidance on language-model risks describes it as content that seems accurate but is fabricated. It is not lying and it is not rare enough to ignore. It follows from how the tool works: it predicts text that fits, and when it has a gap, it fills the gap with something that fits. This lesson shows what hallucinations look like in code, how to catch them, and the situations where you slow down or keep the assistant away entirely. The examples are ones we wrote and ran.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Asking a stranger for directions. Some people, rather than say "I am not from here", will confidently send you left at the pharmacy, because answering feels better than admitting they do not know. Their tone is the same whether they know the way or not. You would check with a second person or a map before a long trip.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops: a person often knows when they are guessing, and may hesitate. A model\'s tone is not a reliable sign of how much it knows, so the confident voice that helped you in earlier lessons proves nothing here.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'Hallucinations come from the same mechanism you met in lesson 51: the model produces the text that best fits the pattern. When the pattern is clear it is usually right. When it is missing a fact, a version number or a name, it still has to write something, so it writes something plausible. These are the kinds you will meet in code, each with a way to catch it.',
      },
      {
        type: 'table',
        headers: ['Kind', 'What it looks like', 'How to catch it'],
        rows: [
          ['An invented function or property', 'expenses.sum(\'amount\') when arrays have no sum method; expense.cost when your data says amount', 'Run it, or look the name up on an official reference page such as MDN'],
          ['Real, but not where you are', 'Object.groupBy exists in current JavaScript but is missing from older environments and from some runners', 'Run it in your own environment and read the compatibility notes'],
          ['A wrong claim about behaviour', '"A const array can never change" (it can: you just cannot reassign the variable)', 'Write a three-line test and run it'],
          ['A wrong predicted output', '"This prints 0.3" for 0.1 + 0.2', 'Run it. Do not accept a prediction you have not run'],
          ['An invented package or command', 'Install a package whose name merely sounds right', 'Look it up on the official registry page: who publishes it, how old and how used'],
          ['A plausible wrong explanation', 'A confident line-by-line reading that misdescribes one line', 'Trace the code by hand, as in lesson 53'],
        ],
        caption: 'Six kinds of hallucination in code. Almost all can be caught by running something or reading an official page.',
      },
      {
        type: 'visual',
        id: 'ai-llm-workflow',
        caption: 'Choose "The check finds a problem" and watch the flow: an answer is not used until a check passes. For code, the check is you running it. The example text is made up.',
      },
      {
        type: 'paragraph',
        text: 'You can reduce hallucinations, but not remove them. Anthropic\'s guidance for developers suggests letting the model say "I don\'t know", giving it the real text to work from, asking for sources you can verify, and comparing several answers, and it says plainly that these techniques significantly reduce hallucinations without eliminating them, so important claims still need validating. For code, the practical version is: tell it your language and version, paste the real data shape, ask it to list what it is unsure of, and then run it.',
      },
      { type: 'heading', text: 'When not to trust AI' },
      {
        type: 'paragraph',
        text: 'Some jobs deserve more than a quick check, either because a mistake is expensive or because you cannot verify the answer yourself. The table lists the situations and what to do instead of simply accepting the output.',
      },
      {
        type: 'table',
        headers: ['Situation', 'Why it needs more care', 'What you do'],
        rows: [
          ['Security-sensitive code: sign-in, passwords, payments, encryption', 'A small mistake can become a break-in, and it can look correct while being unsafe', 'Do not build it from scratch, as the conditions module said about sign-in. Use the platform\'s official service and read its documentation, and have an experienced person review it'],
          ['Money: totals, rounding, tax, currency', 'Small errors repeat across every transaction, and rules differ by place', 'Keep amounts as whole centavos, test with amounts you worked out by hand, and take tax rules from the authority itself'],
          ['Anything you cannot verify', 'If you cannot run it or explain it, you cannot know it is right', 'Do not ship it. Ask for a simpler version you can check, or learn the missing idea first'],
          ['Personal data and secrets', 'What you paste leaves your computer and goes to a service you do not control', 'Use made-up sample data with the same shape. Never paste real passwords, keys, other people\'s details or private files'],
          ['Licences and ownership', 'Generated code can sometimes resemble existing public code, and rules for reuse are a legal matter', 'Use your tool\'s settings and references where they exist, follow your school\'s or employer\'s policy, and ask when unsure'],
        ],
        caption: 'Five situations that call for extra care. In every row, the final responsibility is yours.',
      },
      {
        type: 'version',
        text: 'Checked on this date against the sources listed. OWASP\'s LLM09 page defines hallucination as content that seems accurate but is fabricated, says models may suggest insecure or non-existent code libraries, notes that attackers can publish malicious packages under commonly hallucinated names, and recommends human oversight and cross-checking against trusted sources. Anthropic\'s guide says its techniques reduce hallucinations without eliminating them and to validate critical information. Claude\'s help centre advises being careful about sharing highly sensitive information, naming financial details, medical records, passwords and confidential documents. GitHub\'s documentation says Copilot can generate code that matches public repositories, that it can show references for such matches depending on your settings, and that matches are typically uncommon. What each tool does with your data and what it shows differs by product, plan and settings, so read your tool\'s own pages before you decide what to paste.',
        checked: CHECKED,
        sources: [DOCS.owaspMisinformation, DOCS.claudeHallucinations, DOCS.claudeSensitive, DOCS.copilotReferencing],
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'A line an assistant might write for "add up the amounts" looks natural. There is just one problem: arrays have no `sum` method.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'An example of a hallucinated line (written for this lesson)',
        code: `const expenses = [{ description: 'Lunch', amount: 85 }, { description: 'Fare', amount: 24 }];
const total = expenses.sum('amount');
console.log(total);`,
      },
      { type: 'code', language: 'text', label: 'Real output (Node 22)', code: 'TypeError: expenses.sum is not a function' },
      {
        type: 'paragraph',
        text: 'The fix uses only what you already know. Replace the invented line with a loop (this continues the same program).',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The fix, with a loop you can read',
        code: `let total = 0;
for (const expense of expenses) {
  total = total + expense.amount;
}
console.log(total);`,
      },
      { type: 'code', language: 'text', label: 'Real output', code: '109' },
      {
        type: 'paragraph',
        text: 'Here are three claims an assistant might make, each tested with a few lines. `typeof` tells you what kind of value something is, and for a name that does not exist it says "undefined".',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Testing three claims',
        code: `const items = [];
items.push('a');
console.log(items.length);
console.log(0.1 + 0.2);
console.log(typeof Object.groupBy);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output',
        code: '1\n0.30000000000000004\nfunction   (in Node 22; Talino\'s code runner prints undefined here)',
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`expenses.sum(\'amount\')` asks the array for a method named `sum`. Arrays have no such method, so JavaScript stops with "is not a function". The assistant\'s line looked natural because other languages and libraries do have something like it.',
          'The fix is a loop: `total` starts at 0 and each pass adds one expense\'s `amount`. 85 + 24 is 109.',
          '`items.push` works on a `const` array, so "a const array cannot change" is false. `const` only stops you reassigning the variable `items`.',
          '`0.1 + 0.2` prints 0.30000000000000004, not 0.3. You met this in the numbers lesson. An assistant that "predicts" 0.3 has not run it.',
          '`Object.groupBy` is a real method. MDN lists it as widely available since March 2024, yet the same line gives a different answer in a different runtime. "It exists" and "it exists where you are running" are two separate questions.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a hallucination is a confident answer with nothing solid behind it, like a friend who tells you the jeepney route number without ever having ridden it. Your habit has three steps. First, run it: most code claims can be checked in seconds. Second, if it is a fact about the language, look it up on an official page such as MDN. Third, ask the assistant "how sure are you, and how could I check?". If it says it is unsure, that is useful information, and you check that part first.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Several engineering concerns sit behind these habits. Dependency hygiene: verify any package an assistant names before it enters a lockfile, because OWASP describes attackers registering names that models tend to invent. Correlated errors: tests written by the same model that wrote the code can share its misunderstanding, so write at least the expected values yourself. Licence and provenance: know your tool\'s duplicate-detection or reference settings and your organisation\'s policy. Data governance: decide, before anyone pastes, which classes of data may go to which service, and use the enterprise or opt-out controls your tool offers. And evaluate with tests and a repeatable review, not by tuning prompts until one run looks good.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'This time, test the assistant. The first prompt asks it to rate its own confidence. The second sets up a game in which you find the false claim. Check everything by running code or reading an official page.',
      },
      {
        type: 'prompt',
        label: 'Make it say what it is unsure of',
        text: `Explain how to remove duplicate expenses from an array in JavaScript. For every function or method you use, tell me how confident you are that it exists in plain JavaScript, and tell me how I could check each one on an official page. If you are not sure about something, say so instead of guessing.`,
      },
      {
        type: 'prompt',
        label: 'Find the false claim',
        text: `Give me three short claims about JavaScript arrays. Two should be true and one should be believable but false. Do not say which is which. I will test each one by running code or checking MDN, then tell you my verdict. Do not reveal the false one until I answer.`,
      },
      {
        type: 'paragraph',
        text: 'What to look for: test every claim yourself before you read its verdict, and note which ones you could check in under a minute. One way it can mislead you: it may call a true claim false or add an invented detail when it explains. Confirm the verdict on developer.mozilla.org, not in the chat.',
      },
      {
        type: 'warning',
        text: 'Never paste real passwords, API keys, other people\'s personal details or private files into a prompt. Use made-up data that has the same shape, such as an expense called "Jeepney fare".',
      },
      {
        type: 'takeaways',
        items: [
          'A hallucination is confident, fluent output that is made up. It comes from predicting fitting text, and good tone is no evidence.',
          'Most code hallucinations are caught by running something or reading an official page: invented functions and properties, wrong predicted output, wrong claims about behaviour, invented packages.',
          'Slow down for security, money, personal data, licences and anything you cannot verify. Do not build sign-in from scratch.',
          'Use made-up data in prompts, never real secrets or private details.',
          'You are responsible for what you ship. The assistant drafts, and you read, test and decide.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-55-predict-output-1',
          kind: 'predict-output',
          title: 'Can a const array change?',
          prompt: 'An assistant claims, "A const array cannot be changed after it is created." Run the claim in your head. What does this print?',
          concept: 'checking a claim by running it',
          language: 'javascript',
          code: `const items = [];
items.push('a');
items.push('b');
console.log(items.length);`,
          choices: ['2', '0', 'An error, because items is declared with const', '1'],
          wrongNotes: {
            '0': 'The pushes add two items, so the length is not 0.',
            'An error, because items is declared with const': 'const stops you from assigning a new value to items. It does not stop the contents of the array from changing.',
            '1': 'There are two pushes, one for each item.',
          },
          hints: [
            'What does `const` prevent: reassigning the variable, or changing the array?',
            'push adds an item to the array that items already points to.',
            'Two pushes means two items.',
          ],
          explanation: 'const only prevents assigning a new value to the variable. The array it points to can still grow, so this prints 2 and the assistant\'s claim is false. A three-line run settled it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-55-fix-bug-1',
          kind: 'fix-bug',
          title: 'An invented property',
          prompt: 'An assistant wrote this loop for your expenses, which have an amount. The program should print 159. Find the line and choose the fix.',
          concept: 'invented property names',
          language: 'javascript',
          code: `const expenses = [{ amount: 85 }, { amount: 24 }, { amount: 50 }];
let total = 0;
for (const expense of expenses) {
  total = total + expense.cost;
}
console.log(total);`,
          bugLine: 4,
          fixes: [
            { line: 'total = total + expense.amount;', correct: true, why: 'The data has an amount property, so adding it gives 85 + 24 + 50 = 159.' },
            { line: 'total = total + expense.price;', correct: false, why: 'price is another name that your data does not have, so it is also undefined and the total is still NaN.' },
            { line: 'total = total + expense;', correct: false, why: 'This adds the whole object, which turns into text and gives a long string, not a number.' },
            { line: 'total = expense.cost;', correct: false, why: 'This replaces the total with undefined on every pass instead of adding anything.' },
          ],
          tests: { kind: 'output', expected: ['159'] },
          hints: [
            'Look at the property names in the data and compare them with the loop.',
            'The loop reads a property that your objects do not have.',
            'Use the property that the data really has: amount.',
          ],
          explanation: 'The assistant guessed a property name, cost, that your data does not contain. Reading it gives undefined, and adding undefined makes the total NaN. Comparing the names in the code with the names in your own data is a quick way to catch this.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-55-match-1',
          kind: 'match',
          title: 'How would you check it?',
          prompt: 'Match each claim from an assistant to the best way to check it.',
          concept: 'verifying claims',
          labels: { terms: 'The claim', meanings: 'The best check' },
          pairs: [
            { term: '"Object.groupBy works in every JavaScript environment"', definition: 'Run it where you will use it, and read the compatibility notes on MDN', note: 'Whether a feature exists depends on the environment, so test the real one.' },
            { term: '"Install the package expense-total-pro, it does this for you" (a name made up for this lesson)', definition: 'Look the package up on its official registry page and check who publishes it before installing', note: 'Names that sound right can be invented or taken over by someone else.' },
            { term: '"This code prints 0.3"', definition: 'Run the code and read what it really prints', note: 'A prediction you have not run is only a guess.' },
            { term: '"This sign-in code is secure because it uses encryption"', definition: 'Use the official service of your platform and have an experienced person review it', note: 'Security cannot be settled by a confident sentence or by one working test.' },
          ],
          hints: [
            'Which claims can be settled by simply running something?',
            'One claim is about a name that may not exist at all. Where would you look it up?',
            'The security claim cannot be checked by one test, so it needs people and official services.',
          ],
          explanation: 'Match the check to the claim: run it for behaviour and output, look up official pages for names and compatibility, and bring in a qualified person and official services for security.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'programming-fundamentals-55-scenario-1',
          kind: 'scenario',
          title: 'The sign-in offer',
          prompt: 'Choose the best decision.',
          concept: 'knowing when not to trust AI',
          situation: 'You are building a small app and the assistant offers to write the code that checks passwords for sign-in. It says, "This is secure." Your test with a sample password passes.',
          options: [
            { text: 'Use your platform\'s official sign-in service and follow its documentation, and ask the assistant to help you read that documentation.', consequence: 'The risky part is handled by something built and maintained for exactly this job, and the assistant helps you understand it instead of inventing it.', quality: 'best' },
            { text: 'Use the code the assistant wrote, then ask an experienced developer to review it before any real user signs in.', consequence: 'Safer than shipping it alone, though you are still building security by hand when a maintained option exists.', quality: 'acceptable' },
            { text: 'Ship it, because one test with a sample password passed.', consequence: 'A passing test shows it accepts one correct password. It says nothing about wrong guesses, storage or attacks, which is where sign-in code fails.', quality: 'poor' },
            { text: 'Paste a few real passwords into the chat to test that the code works for them.', consequence: 'Real passwords have now left your control and gone to a service you do not run. Test with made-up values only.', quality: 'poor' },
          ],
          hints: [
            'Sign-in is one of the situations in the table that deserves extra care.',
            'Is building it by hand ever better than using something designed and maintained for that job?',
            'The best answer keeps the assistant in a supporting role and uses an official service.',
          ],
          explanation: 'Security-sensitive work should not rest on an assistant\'s confidence or one passing test. Use the maintained, official option, get experienced eyes on anything custom, and never paste real secrets.',
        },
      },
    ],
    quiz: [
      {
        id: 'programming-fundamentals-55-q1',
        prompt: 'What is a hallucination in generated code?',
        choices: [
          'A bug caused by a typing mistake somewhere in the text of the prompt',
          'Code that runs slowly because the model is overloaded with other requests',
          'Confident output that is made up, such as a function that does not exist',
          'Code that works correctly but is written in an unusual or surprising style',
        ],
        answer: 2,
        explanation: 'A hallucination is fluent, believable output that is fabricated. The code may look fine and still call something that does not exist.',
      },
      {
        id: 'programming-fundamentals-55-q2',
        prompt: 'A program using expenses.sum(\'amount\') stops with "is not a function". What is the best first move?',
        choices: [
          'Check whether arrays have a sum method, and use a loop if they do not',
          'Run it again, in case the error was random and goes away by itself',
          'Ask the assistant to say that it is sure sum exists, and take its word',
          'Install a package that is called sum so that the method appears on arrays',
        ],
        answer: 0,
        explanation: 'The error tells you the name does not exist on arrays. Verify on a reference page, then replace the line with something you can read, such as a loop.',
      },
      {
        id: 'programming-fundamentals-55-q3',
        prompt: 'An assistant says a snippet prints 0.3. Which way of settling it is the most reliable?',
        choices: [
          'Ask it again and trust the answer that you get more often',
          'Run the snippet and read what it prints',
          'Ask it to explain its reasoning in more detail',
          'Look for a second assistant that gives the same prediction',
        ],
        answer: 1,
        explanation: 'Running the code settles it, because it gives the real output. More explanations or more assistants only repeat predictions.',
      },
      {
        id: 'programming-fundamentals-55-q4',
        prompt: 'You want to test an assistant on code that handles customers\' details. What is the safest way?',
        choices: [
          'Paste real customers\' data but remove the surnames first',
          'Paste a handful of real records, because the examples will be more accurate',
          'Describe a real customer in the prompt, but not the full record',
          'Use made-up sample data with the same shape as the real records',
        ],
        answer: 3,
        explanation: 'Made-up data with the same shape gives the assistant what it needs without sending anyone\'s real details to a service you do not control.',
      },
      {
        id: 'programming-fundamentals-55-q5',
        audience: { max: 'beginner' },
        prompt: 'Which habit does the lesson recommend when an assistant gives you a claim about code?',
        choices: [
          'Believe it if it sounds sure, and check it only when it sounds unsure',
          'Run it or look it up on an official page before you trust it',
          'Ask a friend who has never used JavaScript to read it',
          'Delete the answer and never use an assistant again',
        ],
        answer: 1,
        explanation: 'Run it, or look it up on an official page. A sure tone is not evidence, and an assistant is still useful once you check it.',
      },
      {
        id: 'programming-fundamentals-55-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate says, "The same assistant wrote the code and the tests, and the tests pass, so we are covered." What is the main risk?',
        choices: [
          'Tests written by an assistant always run too slowly to be used in a CI pipeline',
          'The assistant is unable to write tests in whichever language that your team happens to use',
          'The tests may share its misunderstanding, so wrong behaviour passes',
          'Passing tests are no longer needed once the code has been reviewed by someone',
        ],
        answer: 2,
        explanation: 'If the model misread the requirement, both the code and the tests carry the same error. Write the expected values from the requirement yourself.',
      },
    ],
    task: {
      title: 'Hunt for hallucinations and write your own rules',
      minutes: 20,
      steps: [
        'Ask an assistant for three JavaScript array methods you have not used, each with an example. Run every example in any free JavaScript environment or the code runner in this app. Write down whether each method exists and whether it did what the assistant said.',
        'For one method, find its page on developer.mozilla.org and compare the page with what the assistant said.',
        'Use the "Make it say what it is unsure of" prompt on any topic and note which statements you could verify in under a minute.',
        'Write your own short rules: three things you never paste into a prompt, and three things you always verify before you trust the code.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Write the three-step habit (run it, look it up, ask how to check) on a sticky note and keep it next to your keyboard.'] },
      { audience: { min: 'advanced' }, steps: ['Add rules for your team: how a new dependency is verified before it is added, who reviews security-sensitive changes, and which kinds of data may be sent to which assistant.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'programming-fundamentals-p10',
  title: 'Work with an AI partner: total per category',
  summary: 'Give an AI assistant a clear requirement for a function that returns the total spent per category, then ask it to explain its code, review it and write checks, run everything yourself, improve it, and report what you found and changed.',
  outcome: 'A record of a full human-and-AI workflow: a requirement, the prompts used, code you have tested and can explain, and an honest account of what was wrong or unclear. It is proof that you direct an assistant instead of trusting it.',
  unlockAfterDay: 55,
  steps: [
    { id: 'programming-fundamentals-p10-s1', text: 'Write the requirement for a function totalByCategory(expenses). It takes expenses shaped like { description: \'Jeepney fare\', amount: 24, category: \'transport\', date: \'2026-11-16\' } and returns an object whose keys are categories and whose values are the total amount in whole pesos. For example, amounts 24 and 18 for transport and 85 for food give { transport: 42, food: 85 }. Decide and write down what happens for an empty list, a missing category, and an amount that is not a number.' },
    { id: 'programming-fundamentals-p10-s2', text: 'Before you ask the assistant, turn your examples and rules into at least four checks written as check(name, actual, expected) lines, as in lesson 52. Use a do-nothing placeholder function and confirm that the checks fail where they should.' },
    { id: 'programming-fundamentals-p10-s3', text: 'Ask an assistant for a plan first, then for the code. Judge the plan against your requirement. Keep the exact prompts you used. Use made-up data only.' },
    { id: 'programming-fundamentals-p10-s4', text: 'Ask the assistant to explain its code line by line. Make your own trace table for one real example first, and mark every place where its explanation and your trace disagree, or where you do not understand a line.' },
    { id: 'programming-fundamentals-p10-s5', text: 'Ask the assistant to review its own code for possible bugs and to write extra checks. Run your checks and its checks yourself. Record what passed, what failed and the exact output, and work out at least one expected value by hand.' },
    { id: 'programming-fundamentals-p10-s6', text: 'Improve the code. Change one thing at a time, such as fixing a failing check, handling an edge case or asking for a simpler version, and run all the checks after each change. Keep the versions you tried.' },
    { id: 'programming-fundamentals-p10-s7', text: 'Write your submission: the requirement, your prompts, the final code, and the checks with their results. Then explain, in your own words: at least one thing that was wrong or unclear in what the assistant gave you, how you found it, what you changed, what you checked yourself, and one claim you could not verify.' },
    { id: 'programming-fundamentals-p10-s8', audience: { max: 'beginner' }, text: 'Keep it small: use only amount and category, and treat the data as clean. In your explanation, say in plain words what each line of the final function does, and what the object holds when the function returns.' },
    { id: 'programming-fundamentals-p10-s9', audience: { min: 'advanced' }, text: 'Go further: write at least eight checks including a property check (the totals add up to the sum of all valid amounts), review the code in a fresh conversation scoped to your requirement, compare it with a Map-based version, and note any data, security or dependency concern you considered.' },
  ],
  submission: {
    kind: 'text',
    label: 'Your prompts, code, findings and changes',
    placeholder: 'Requirement:\n...\nPrompts I used:\n...\nFinal code:\n...\nChecks and results:\n...\nWhat was wrong or unclear, how I found it, and what I changed:\n...\nWhat I verified myself and one claim I could not verify:\n...',
    hint: 'Paste the requirement, the exact prompts, the final code, your checks with their real output, and your explanation of what you found and changed. The explanation matters most: say it in your own words.',
  },
  rubric: [
    'The requirement states the purpose, inputs, outputs, examples and edge cases, and the checks were written before the assistant\'s code was used',
    'The real prompts are included (plan, code, explanation, review, tests), together with the final code',
    'The submission shows what was run and what it printed, not only what the assistant claimed',
    'At least one problem, unclear line or unverified claim is named, with how it was found and what changed',
    'The final code is explained line by line in the learner\'s own words, not the assistant\'s wording',
    'No real personal data, passwords or keys were pasted into any prompt',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The learner explains in plain words what the loop and the object do in their final function'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['At least two edge cases have checks that fail when the code is deliberately broken'] },
    { audience: { min: 'advanced' }, items: ['Eight or more checks, including a property check, were run, and the review was scoped to the requirement', 'A short note covers data, security or dependency concerns and how the final version was verified'] },
  ],
};
