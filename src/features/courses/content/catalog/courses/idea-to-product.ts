import type { Audience, Course, Lesson, Project } from '../../types';

/**
 * Turn an Idea into a Working Product. One worked example runs through every lesson: Rina Alvarez (fictional) and
 * Cool Hands Aircon Cleaning, a small home-service business in Cebu City that wants a booking tool. Every artefact in the
 * lessons (problem statement, interview script, assumption table, MVP scope, spec, build prompts, feedback log,
 * decision note) is written out in full so the learner can copy it and fill in their own. Peso amounts and counts in the
 * example are invented for teaching and are always labelled as guesses or example results.
 * Product facts (AI app builders, hosting, testing channels, analytics) change often: each is a dated version note.
 */
const CHECKED = '2026-11-14';

/** Plain-language pieces for complete beginners and beginners, depth pieces for advanced learners and professionals. */
const NEWCOMER: Audience = { max: 'beginner' };
const COMPLETE_BEGINNER: Audience = { max: 'complete-beginner' };
const INTERMEDIATE: Audience = { min: 'intermediate', max: 'intermediate' };
const EXPERIENCED: Audience = { min: 'advanced' };

const DOCS = {
  claudeResearch: { label: 'Claude Help Center: When to use web search, extended thinking and research', url: 'https://support.claude.com/en/articles/11095361-when-should-i-use-web-search-extended-thinking-and-research' },
  openaiDeepResearch: { label: 'OpenAI Help Center: Deep research in ChatGPT', url: 'https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt' },
  googleForms: { label: 'Google Docs Editors Help: Create your first form in Google Forms', url: 'https://support.google.com/docs/answer/6281888' },
  claudeCode: { label: 'Claude Code docs: Overview', url: 'https://code.claude.com/docs/en/overview' },
  cursorDocs: { label: 'Cursor docs', url: 'https://cursor.com/docs' },
  codexDocs: { label: 'ChatGPT and Codex docs', url: 'https://learn.chatgpt.com/docs' },
  aiStudioBuild: { label: 'Google AI Studio docs: Build mode', url: 'https://aistudio.google.com/docs/aistudio-build-mode' },
  v0: { label: 'v0 docs: Introduction', url: 'https://vercel.com/docs/v0' },
  claudeArtifacts: { label: 'Claude Help Center: What are artifacts and how do I use them?', url: 'https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them.md' },
  supabaseRls: { label: 'Supabase docs: Row Level Security', url: 'https://supabase.com/docs/guides/database/postgres/row-level-security' },
  githubPages: { label: 'GitHub Docs: What is GitHub Pages?', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages' },
  testflight: { label: 'App Store Connect Help: TestFlight overview', url: 'https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/' },
  playTesting: { label: 'Play Console Help: Testing requirements for new personal developer accounts', url: 'https://support.google.com/googleplay/android-developer/answer/14151465' },
  vercelEvents: { label: 'Vercel docs: Tracking custom events', url: 'https://vercel.com/docs/analytics/custom-events' },
};

const lessons: Lesson[] = [
  {
    id: 'idea-to-product-01',
    day: 1,
    title: 'Pick a problem worth solving',
    summary: 'Start from a real problem instead of an app idea: five tests, a one-sentence problem statement and a first look at the road to your first users.',
    intro: {
      objectives: [
        'Score an idea against five tests of a problem worth solving',
        'Write a problem statement that names who, the cost and today’s workaround',
        'Explain why you start from a problem and not from a product',
      ],
      why: 'AI can now build an app in an afternoon, so the scarce thing is no longer building, it is knowing what is worth building. Choosing a good problem first saves you weeks of making something nobody needs.',
    },
    minutes: 20,
    skills: ['problem-selection'],
    body: [
      { type: 'paragraph', text: "Most first products start with a sentence like “I want to build an app that…”. It feels natural, and it is the most common way to waste three months. An app is an answer. Before you build an answer, you need to be sure that real people are already asking the question, that they ask it often, and that it bothers them enough to change what they do. This course follows one person from a vague idea to a product with its first five users, and you will do the same with your own idea, one written artefact at a time." },
      { type: 'paragraph', text: "Our example is Rina Alvarez, a fictional owner of Cool Hands Aircon Cleaning in Cebu City. She and two technicians clean about twenty aircon units a week. Customers book by Messenger and text, and Rina keeps the schedule in a notebook and in her head. Last month she double-booked a Saturday morning and forgot a Monday customer. Her cousin says: “You should make an app for that.” Rina is not sure yet, and that is exactly the right place to start." },
      { type: 'heading', text: 'Start from a problem, not a product' },
      { type: 'paragraph', text: "A product is a possible solution. A **problem** is something that costs a specific kind of person time, money or stress right now. If you start with the problem, you can change the solution as often as you like. If you start with the solution, you defend it. These five tests tell you whether a problem is worth your next few weeks." },
      {
        type: 'table',
        headers: ['Test', 'Ask yourself', 'Strong sign', 'Weak sign'],
        rows: [
          ['Painful', 'What does it cost them in money, time or stress?', 'They can name the cost without thinking', 'They shrug: “it’s fine, we manage”'],
          ['Frequent', 'How often does it happen?', 'Every week or every day', 'Once or twice a year'],
          ['Reachable', 'Could you talk to ten of these people this week?', 'You know where they gather and who they are', '“Everyone” or “people who like…” with nowhere to find them'],
          ['Solved badly today', 'What do they do about it now?', 'A notebook, a spreadsheet, a cousin who helps: a workaround', 'Nothing at all, which can mean it does not hurt enough'],
          ['Small enough', 'Could a first version help in about two weeks?', 'One job for one kind of person', 'Needs a whole platform before anyone benefits'],
        ],
        caption: 'Five tests for a problem worth solving',
      },
      { type: 'paragraph', text: "Notice that “solved badly today” is good news. A workaround proves the problem is real, because people only build workarounds for problems that bother them. Rina’s notebook and her Messenger scroll-back are exactly that." },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: a *problem* is something that keeps costing someone, like a customer who waits too long or a day lost to paperwork. A *workaround* is the clumsy fix they use today, such as writing orders in a notebook. Think of a sari-sari store owner who keeps a “utang” notebook. The notebook is the workaround. It tells you the problem (remembering who owes what) is real enough that she already spends time on it every day. You are looking for notebooks like that. If nobody has any workaround at all, be careful: the problem may not matter to them.",
      },
      { type: 'heading', text: 'Write the problem as one sentence' },
      { type: 'paragraph', text: "Vague problems produce vague products. Force yourself to write one sentence that names who, what they are trying to do, why it is hard, what it costs and what they do today. Every number in it is a **guess for now**, and you will check each one in the next lessons." },
      {
        type: 'code',
        language: 'text',
        label: 'Problem statement template, then Rina’s version',
        code: `TEMPLATE
[Who] struggles to [job they are trying to do] because [cause].
It costs them [cost]. Today they [workaround].

RINA'S STATEMENT (every number is a guess to check)
Small home-service owners in Cebu who take bookings by Messenger and text
struggle to keep a clean schedule because every booking is a separate
conversation. It costs them about two double-booked or forgotten jobs a month,
roughly 1,500 pesos each, plus an evening of messages every week. Today they
use a notebook or scroll back through Messenger.`,
      },
      { type: 'heading', text: 'Rina’s three ideas, scored' },
      { type: 'paragraph', text: "A cousin’s advice, a late-night thought and a news article gave Rina three ideas. She scored each one honestly against the five tests." },
      {
        type: 'table',
        headers: ['Idea', 'Painful', 'Frequent', 'Reachable', 'Solved badly', 'Small', 'Verdict'],
        rows: [
          ['A. A booking tool for her own business', 'Yes', 'Yes', 'Yes, she is the first user', 'Yes, notebook and Messenger', 'Yes', 'Start here'],
          ['B. A marketplace connecting every aircon cleaner in Cebu with customers', 'Partly', 'Partly', 'No, needs two sides at once', 'Partly', 'No', 'Too big for now'],
          ['C. An AI chatbot that answers customers on Messenger', 'Partly', 'Yes', 'Yes', 'Partly', 'Partly', 'Maybe later'],
        ],
        caption: 'Idea A wins because it can be tested fastest with people she can reach, not because it is the grandest',
      },
      { type: 'paragraph', text: "Look at why A wins. It is not the most exciting idea. It is the one where Rina is herself the first user, can reach other owners like her, and can test a small version quickly. The marketplace might be worth more one day, but she could not learn anything about it in two weeks." },
      { type: 'prompt', label: 'Ask an AI to challenge your problem, not cheer for it', text: "I run [describe your business or work in one sentence]. Here are three problems I notice: 1) [problem] 2) [problem] 3) [problem].\n\nAct as a skeptical advisor, not a cheerleader. For each problem tell me: (a) what evidence would show it is painful and frequent, (b) who I could ask about it this week, (c) one reason it might not be worth solving.\n\nDo not suggest any software or app yet. Do not invent statistics: if you do not know, write “unknown”." },
      { type: 'warning', text: "AI assistants lean toward agreeing with you. Ask one “is this a good idea?” and it will usually say yes and add reasons. Always ask it to argue the other side, and treat what it says as a list of questions to check with real people, not as an answer." },
      { type: 'heading', text: 'The road ahead' },
      { type: 'paragraph', text: "The rest of the course is this path. Notice that it loops: the evidence you collect can send you back to choose a different problem, and that is cheap now and expensive after you have built something." },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'From idea to decision: every step produces something you can show.',
        source: 'flowchart TD\n  A[Pick a problem] --> B[Check the idea with AI and real people]\n  B --> C[Define the smallest useful version]\n  C --> D[Write a spec an AI can build from]\n  D --> E[Choose a tool and build version one]\n  E --> F[Put it in front of five real users]\n  F --> G[Learn from what they do]\n  G --> H[Iterate on purpose]\n  H --> I{Decide}\n  I -->|Grow| F\n  I -->|Change direction| A\n  I -->|Stop| J(Stop with what you learned)',
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "The five tests are a screen, not a business case. For a professional, two things usually decide whether a problem is worth a build: distribution (can you reach these buyers cheaply, and do they have budget and authority?) and substitution (is a spreadsheet, a shared calendar or an off-the-shelf tool good enough?). Write the riskiest assumption explicitly, whether it is demand, willingness to pay, reachability or feasibility, and make everything in the next few weeks a test of that one assumption. Time-box the whole exercise. Founder-market fit also counts: you will talk to these people for months, so choose a segment you can actually reach and tolerate. Record the segment narrowly enough that you could name ten of them.",
      },
      {
        type: 'takeaways',
        items: [
          'Start with a problem that costs a specific kind of person time, money or stress, not with an app idea.',
          'Five tests: painful, frequent, reachable, solved badly today and small enough to start.',
          'A workaround such as a notebook is good evidence that the problem is real.',
          'Write one sentence: who, the job, the cause, the cost and today’s workaround, and treat every number in it as a guess to check.',
          'Ask AI to challenge your idea, because it will cheer by default.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-01-scenario-1',
          kind: 'scenario',
          title: 'Which idea first?',
          prompt: 'Pick the idea Mark should pursue first.',
          concept: 'choosing a problem',
          situation: 'Mark, a fresh graduate in Davao, has three ideas. He also has a free month. Idea 1: an app to find the “best” coffee shop for everyone in the Philippines. Idea 2: a pre-order tool for his aunt’s bakery, because every Friday she answers about forty Messenger threads and still mixes up orders. Idea 3: a social network for pet owners.',
          options: [
            { text: 'The bakery pre-order tool, because he can watch his aunt’s Friday, talk to other bakers and test a small version within weeks.', consequence: 'He can reach the first user today, the pain repeats every week and a notebook-and-Messenger workaround already exists. He will learn fast.', quality: 'best' },
            { text: 'The coffee shop finder, because it has the biggest possible audience.', consequence: 'Almost everyone is the audience, so nobody in particular is, and there are many finders already. It can work, but it is the hardest to test.', quality: 'acceptable' },
            { text: 'The pet social network, because it is the idea he is most excited about.', consequence: 'Excitement is not evidence. A network is useless until many people join at once, so he cannot learn anything useful in a month.', quality: 'poor' },
            { text: 'Ask an AI which idea is best and follow its ranking.', consequence: 'The AI has never met his aunt or her customers. Its ranking is a guess dressed as an answer.', quality: 'poor' },
          ],
          hints: [
            'Use the five tests: which idea has people he can reach, a repeated pain and a small first step?',
            'Who is the first user in each idea, and can Mark talk to them this week?',
            'The bakery has a named user, a weekly pain and an existing workaround (Messenger threads).',
          ],
          explanation: 'The bakery idea passes all five tests: painful, frequent, reachable, solved badly with Messenger threads, and small. The other two are either too broad to reach or depend on many people arriving at once.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-01-arrange-1',
          kind: 'arrange',
          title: 'The road from idea to decision',
          prompt: 'Put the steps in the order that wastes the least time. Tap the lines in sequence.',
          concept: 'idea to product path',
          language: 'text',
          solution: [
            'Pick a problem worth solving',
            'Write down your riskiest assumptions',
            'Talk to real people about their past behaviour',
            'Define the smallest useful version',
            'Write a spec an AI can build from',
            'Build the first version',
            'Put it in front of five real users',
            'Decide: grow, change direction or stop',
          ],
          reasons: [
            'Everything else depends on the problem.',
            'You cannot test an assumption you have not written down.',
            'Real conversations check the assumptions before you spend time building.',
            'Scope comes from what the conversations showed, not from the idea alone.',
            'The spec turns the scope into something an AI can build.',
            'Only now does anything get built.',
            'A product nobody uses teaches nothing; five users teach a lot.',
            'The decision uses what the users did, so it comes last.',
          ],
          hints: [
            'Which steps need no building at all, and so should come first?',
            'Assumptions and conversations come before scope; scope comes before spec; spec comes before build.',
            'The decision to grow, change or stop needs evidence from users, so it is the last line.',
          ],
          explanation: 'Each step makes the next one cheaper: you learn about the problem before the scope, fix the scope before the spec and build only what the spec names. The decision comes last because it is made from what real users actually did.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-01-q1',
        prompt: 'Which is the strongest sign that a problem is worth solving?',
        choices: [
          'Friends tell you it sounds like a great idea',
          'People already spend time or money on a clumsy workaround for it',
          'An AI assistant lists the topic as a fast-growing market',
          'You personally find the topic exciting and already know exactly how you would build it',
        ],
        answer: 1,
        explanation: 'People only build workarounds for problems that bother them, so a notebook, spreadsheet or favour is behaviour, which is stronger than opinions, AI summaries or your own excitement.',
      },
      {
        id: 'idea-to-product-01-q2',
        prompt: 'A founder says: “My app is for everyone who owns a phone.” Which test does this most clearly fail?',
        choices: [
          'Painful, because phone owners have no problems',
          'Frequent, because phones are used daily',
          'Solved badly today, because most phone owners have no apps that already do anything useful for them',
          'Reachable, because there is nowhere specific to find and ask “everyone”',
        ],
        answer: 3,
        explanation: 'If the audience is everyone, you cannot name ten of them to talk to this week. A narrow, nameable group is what makes the problem reachable and testable.',
      },
      {
        id: 'idea-to-product-01-q3',
        prompt: 'Why does Rina choose the booking tool over the marketplace even though the marketplace might be bigger?',
        choices: [
          'She can reach the first users and test a small version in about two weeks',
          'Booking tools are always more profitable than marketplaces, so she picked the safer business',
          'An AI assistant told her the marketplace was risky',
          'Marketplaces cannot be built with AI tools',
        ],
        answer: 0,
        explanation: 'The choice is about how fast she can learn from real people, not about size. The marketplace needs two sides at once, so she could not test it in two weeks.',
      },
      {
        id: 'idea-to-product-01-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what is a “workaround”?',
        choices: [
          'A clumsy fix people use today, like a notebook',
          'A secret feature a developer hides inside an app for advanced users',
          'A way of making an app load faster',
        ],
        answer: 0,
        explanation: 'A workaround is whatever people do now to cope with the problem. Finding one is useful because it shows the problem matters enough to spend effort on.',
      },
      {
        id: 'idea-to-product-01-q5',
        audience: EXPERIENCED,
        prompt: 'You pass all five tests for a B2B scheduling idea, but a shared calendar already covers 80 percent of the need. What is the best next move?',
        choices: [
          'Build anyway, since AI makes building cheap',
          'Drop the idea, because any existing tool kills a business',
          'Name the gap the calendar leaves, check whether buyers pay to close it, and test only that',
          'Add every missing feature so the product beats the calendar on checklist length and wins on features alone',
        ],
        answer: 2,
        explanation: 'Cheap building does not remove substitution risk. Isolating the gap and testing willingness to pay for it keeps the work small and tied to the riskiest assumption.',
      },
    ],
    task: {
      title: 'Find and write down your problem',
      minutes: 20,
      steps: [
        'List three problems you or people you know deal with often (at work, at a small business, at school, in your barangay). Write each as one plain sentence.',
        'Score each one against the five tests with Yes, Partly or No, using the table in the lesson.',
        'Pick the one with the most Yes answers and write its problem statement using the template: who, job, cause, cost, workaround. Mark every number as a guess.',
        'Paste your three problems into the “challenge, don’t cheer” prompt in any AI assistant. Note one question it raised that you cannot answer yet.',
        'Save your statement in a file called PROBLEM.md or a note you will keep adding to through the course.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['If you have no idea yet, spend ten minutes asking three people “What is the most annoying part of your week?” and write down what they say word for word. Choose a problem from their answers, not from the news.'] },
      { audience: EXPERIENCED, steps: ['Add a line naming the riskiest assumption (demand, willingness to pay, reachability or feasibility) and the cheapest substitute a buyer could use instead of your product.'] },
    ],
  },
  {
    id: 'idea-to-product-02',
    day: 2,
    title: 'Validate the idea with AI-assisted research',
    summary: 'Use AI as a fast research assistant for alternatives and risky assumptions, and learn why its summaries are not evidence that anyone will use or pay.',
    intro: {
      objectives: [
        'Use an AI assistant to map alternatives, customer language and risky assumptions',
        'Tell opinion, words about the past and real commitments apart as kinds of evidence',
        'Turn your idea into a table of assumptions, each with the cheapest honest test',
      ],
      why: 'AI will happily write a confident market report for any idea, including a bad one. Learning what it can and cannot tell you keeps you from building on a guess that merely sounds researched.',
    },
    minutes: 25,
    skills: ['idea-validation'],
    body: [
      { type: 'paragraph', text: "Validation means finding out, before you build, whether real people have the problem and will do something about it. AI can speed up part of that work, the reading part. It cannot do the other part. An AI summary of “the market” is built from text that people already wrote, not from the people you plan to serve, and it says nothing about whether your neighbours, your customers or your colleagues will use or pay for your idea. This lesson separates the job AI does well from the job only people can do." },
      { type: 'heading', text: 'What AI is good for, and what it cannot do' },
      {
        type: 'list',
        items: [
          '**Good at:** listing the alternatives people use today, summarising common complaints, suggesting words customers use, drafting interview questions, and spotting assumptions you did not notice.',
          '**Not able to:** know whether the specific people you can reach have this problem, how much they would pay, or whether they will change their habits. It can only guess from what it has read.',
          '**Risky at:** statistics. Assistants sometimes invent percentages, quotes and company names that read perfectly well. A number with no working source link is a guess.',
        ],
      },
      { type: 'heading', text: 'Three kinds of evidence' },
      { type: 'paragraph', text: "Not all evidence is equal. The skill in validation is knowing which kind you are holding, and being honest about it." },
      {
        type: 'table',
        headers: ['Kind', 'Examples', 'How much to trust it'],
        rows: [
          ['Opinion', 'An AI report says the market is big. A friend says “great idea!”. You feel sure.', 'Weak: nothing was risked, so nothing was learned'],
          ['What people say about the past', 'A shop owner describes the last time two customers wanted the same slot and what she did.', 'Medium: specific and real, but still words'],
          ['What people do or commit', 'They give their phone number for a waitlist, book a trial, pay a deposit, or introduce you to a friend.', 'Strong: it cost them time, money or reputation'],
        ],
        caption: 'Look for the third row. The more it costs the person, the more it means.',
      },
      { type: 'paragraph', text: "A useful rule: an AI summary is Opinion. Use it to decide what to ask real people, never to decide that the answer is yes." },
      { type: 'heading', text: 'Use AI for the desk research' },
      { type: 'paragraph', text: "Do the reading with AI, then check what matters yourself. The prompt below tells the assistant to keep facts, guesses and unknowns apart and to give a link for anything it calls a fact. Many assistants can browse the web and cite sources. That helps you check, but the citations still have to be opened and read." },
      { type: 'prompt', label: 'Desk research prompt (works in any assistant that can search the web)', text: "I am checking an idea before I build anything. The problem: [paste your problem statement].\n\nPlease research and answer in four sections:\n1. How do people in [place or group] handle this today? List the alternatives (tools, apps, workarounds) with a link for each.\n2. What do people complain about with those alternatives? Quote short phrases and link where you found them.\n3. What words do customers use when they describe this problem?\n4. List the 5 riskiest assumptions in my idea, riskiest first.\n\nRules: separate FACT (with a link I can open) from GUESS from UNKNOWN. Do not invent numbers, quotes or companies. If you cannot find something, say so. Do not tell me whether my idea is good." },
      {
        type: 'version',
        text: "Both major assistants now offer a research mode that searches the web and attaches citations. Anthropic’s help center describes Claude’s research as combining many sources into a longer report, for jobs that take five or more searches, and separates it from quick web search. OpenAI’s help center describes deep research in ChatGPT as producing a report with citations and advises you to review the underlying sources yourself, especially for important decisions. Availability and plans differ by product and country, so check your own account before relying on it.",
        checked: CHECKED,
        sources: [DOCS.claudeResearch, DOCS.openaiDeepResearch],
      },
      { type: 'heading', text: 'Spot the fake evidence' },
      { type: 'paragraph', text: "Here is the kind of answer an assistant can give Rina if she asks, “Do customers in Cebu want online booking?” Read it the way a skeptical owner would." },
      {
        type: 'code',
        language: 'text',
        label: 'An AI answer to treat with suspicion',
        code: `"Yes. 92% of Filipino consumers prefer to book home services online,
according to a 2024 industry report. Cebu's home-service market is
growing 18% a year, and apps like HomeEase PH have over 500,000 users."

WHAT TO CHECK
- "92% of Filipino consumers": no link, no report name. Treat as invented until proven.
- "growing 18% a year": no source. Same.
- "HomeEase PH": does this company exist? Search for it before using the name.
- Nothing here says whether Rina's customers want it, or whether they would
  rather keep messaging her on Messenger.`,
      },
      { type: 'warning', text: "Never put an AI-supplied statistic on a slide, a landing page or a message to a customer unless you opened the original source and read it. If you cannot find the source, delete the number." },
      { type: 'heading', text: 'Turn the idea into assumptions you can test' },
      { type: 'paragraph', text: "An **assumption** is something that must be true for your idea to work, which you have not yet checked. List them, rank by how bad it would be if they were false, and choose the cheapest honest test for the riskiest ones. Here is Rina’s table. Notice that every test involves other people, not more reading." },
      {
        type: 'table',
        headers: ['Assumption', 'If it is false', 'Cheapest test', 'Evidence that would convince me'],
        rows: [
          ['Other owners lose jobs to double-booking and forgetting too', 'There is no market, only Rina’s own mess', 'Ask 8 owners about the last time it happened', 'At least 5 of 8 describe a recent case and what it cost'],
          ['Customers will use a booking link instead of messaging', 'The tool never gets used', 'Send a booking link to 10 past customers', 'At least 4 of 10 use it'],
          ['Owners will pay something to fix it', 'No business, even if it works', 'Ask three owners to pay a small amount in advance for a pilot', 'At least 1 pays; promises count as nothing'],
          ['Customers will give name, phone and address in a form', 'Booking links stall at the form', 'Watch 5 customers use a paper-thin test form', 'At least 4 finish it without help'],
          ['Technicians will check the calendar daily', 'Bookings are made but crews do not show up', 'Ask 2 technicians to check a shared calendar for a week', 'Both check it every working day'],
        ],
        caption: 'Rina’s riskiest assumptions with a test and a finish line, written before she tests anything',
      },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: an *assumption* is something you are taking for granted without checking, such as “people near me will want this”. The table has four columns because a good test needs a finish line: write down what result would convince you before you run it. Otherwise, whatever happens will look like a yes. Think of testing a new dish at a carinderia: before cooking, decide that if fewer than five of the first fifteen customers ask for seconds, you will change the recipe. The AI’s job here is to help you spot assumptions. Your job is to test them with real people.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Treat each assumption as a falsifiable hypothesis with a threshold fixed before the test, as in the table’s last column. Fixing thresholds in advance prevents motivated reading of ambiguous results. Beware sampling bias: friends, followers and respondents who answer unsolicited messages over-represent enthusiasts. With samples of 5 to 20, you can detect a strong effect or its absence, not a precise rate. Report counts, not percentages. Triangulate: desk research for market facts (with sources and dates), interviews for behaviour, small commitments for intent. Keep a research log with the source URL and access date for every claim. Treat AI synthesis as a lead generator, and be aware that pages an agent browses can themselves contain misleading or manipulative content.",
      },
      {
        type: 'takeaways',
        items: [
          'AI is good for reading and listing: alternatives, complaints, customer words and risky assumptions.',
          'An AI summary is opinion. It cannot tell you whether your specific customers will use or pay.',
          'Rank evidence by cost to the person: opinions are weak, words about the past are medium and commitments are strong.',
          'A statistic with no source you opened is a guess, so delete it.',
          'Write assumptions with a test and a finish line before you test, so results cannot be spun.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-02-match-1',
          kind: 'match',
          title: 'Pick the cheapest honest test',
          prompt: 'Match each assumption with the cheapest test that would really check it.',
          concept: 'testing assumptions',
          labels: { terms: 'Assumption', meanings: 'Cheapest honest test' },
          pairs: [
            { term: 'Parents will book a tutor through a web form instead of messaging', definition: 'Send the form to 10 parents you already know and count how many finish it', note: 'This test watches behaviour. A survey would only collect opinions.' },
            { term: 'Tindahan owners will pay for a stock-tracking tool', definition: 'Ask three owners to pay a small amount in advance for a pilot, and see who does', note: 'Money, or something close to it, shows intent. Compliments do not.' },
            { term: 'Delivery riders have trouble finding customers’ exact locations', definition: 'Ask five riders to describe their last hard delivery and what they did about it', note: 'Past, specific stories show the problem. A hypothetical question does not.' },
            { term: 'Online sellers will switch from spreadsheets to a new tracker', definition: 'Ask what they use today, then offer to set up their first week by hand and watch if they keep it', note: 'Doing the job by hand tests whether they care before you build anything.' },
          ],
          hints: [
            'Match by what the test would reveal: behaviour, money or past stories.',
            'If the assumption is about paying, the test should involve paying; if it is about doing something, the test should have them do it.',
            'Words about hypothetical future use are the weakest kind of test, so none of these answers is a poll.',
          ],
          explanation: 'Each test costs the other person something real: finishing a form, paying in advance, telling a specific past story or keeping a hand-made setup. That is what separates validation from collecting compliments.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-02-scenario-1',
          kind: 'scenario',
          title: 'Validation or wishful thinking?',
          prompt: 'Choose the best response to this validation report.',
          concept: 'AI summaries are not evidence',
          situation: 'Joy plans an app for tutoring centres in Quezon City. She asks an AI assistant to research demand and it replies: “Demand is high. 87% of parents want online scheduling and the market is worth 4 billion pesos.” There are no links. She is about to start building and put the 87% on her landing page.',
          options: [
            { text: 'Treat the report as opinion, ask the assistant for sources, open each one, delete numbers that cannot be sourced, and book five conversations with tutoring centre owners.', consequence: 'She keeps what is checkable, drops what is invented and replaces a confident guess with real conversations.', quality: 'best' },
            { text: 'Build the app but leave the statistics off the landing page.', consequence: 'She avoids a false claim but still builds on an unchecked belief that anyone wants it.', quality: 'acceptable' },
            { text: 'Ask a second AI assistant to confirm the numbers and use them if both agree.', consequence: 'Two assistants can repeat the same invention. Agreement between models is not a source.', quality: 'poor' },
            { text: 'Use the 87% on the landing page because it is from an AI, which has read a lot.', consequence: 'A made-up statistic on a public page can mislead customers and damage her credibility.', quality: 'poor' },
          ],
          hints: [
            'Ask: did a person take any action, or did an AI just say a number?',
            'The report has no links, so none of the numbers can be checked.',
            'The strongest next step involves real people and sources she can open.',
          ],
          explanation: 'An unsourced AI report is opinion, not evidence. The right move is to verify what can be verified, discard the rest and test the real assumptions with people who run tutoring centres.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-02-q1',
        prompt: 'An AI research report says “78% of small shop owners want inventory apps” and gives no source. What should you do with the number?',
        choices: [
          'Use it, since the assistant researched the topic thoroughly',
          'Round it to about 80% so the claim looks safer',
          'Treat it as unverified until you read the original source, and delete it if you cannot',
          'Ask the same assistant again and use the number if it comes out the same twice in a row, since that shows it is stable',
        ],
        answer: 2,
        explanation: 'A number without a source you opened is a guess. Asking the same assistant again can repeat the invention, so only the original source settles it.',
      },
      {
        id: 'idea-to-product-02-q2',
        prompt: 'Which of these is the strongest evidence that people want your product?',
        choices: [
          'A friend says it is a fantastic idea',
          'An AI assistant ranks your market as attractive',
          'Twelve people clicked “like” on your announcement',
          'A shop owner pays a deposit for your pilot',
        ],
        answer: 3,
        explanation: 'A deposit cost the person real money. Compliments, AI rankings and likes cost nothing, so they say little about demand.',
      },
      {
        id: 'idea-to-product-02-q3',
        prompt: 'Why write the “evidence that would convince me” before running a test?',
        choices: [
          'So that whatever result arrives can be read as a success when you explain it to others',
          'So you can judge the result afterwards without bending it to your hopes',
          'So the AI assistant can check your figures',
          'Because testers need to see the target before they answer',
        ],
        answer: 1,
        explanation: 'A finish line set in advance stops you from reading ambiguous results as wins. Without it, almost any outcome can be spun as encouraging.',
      },
      {
        id: 'idea-to-product-02-q4',
        audience: NEWCOMER,
        prompt: 'What is a good use of an AI assistant at this stage?',
        choices: [
          'Deciding for you whether your idea will succeed',
          'Listing alternatives, complaints and assumptions, so you know what to ask real people',
          'Replacing the conversations with customers, because it has already read thousands of things customers have said',
        ],
        answer: 1,
        explanation: 'AI is a quick research helper that lists and summarises. Whether your own customers want the product is something only they can show you.',
      },
      {
        id: 'idea-to-product-02-q5',
        audience: EXPERIENCED,
        prompt: 'You asked 12 people from your followers about your idea and 9 said they would pay. Which conclusion best fits the evidence?',
        choices: [
          'Demand is 75 percent and you can plan revenue from it',
          'A promising lead from an enthusiast-biased sample: next, ask a cold, relevant group to commit something small',
          'The sample is too small to learn anything, so collect 1,000 more survey answers from anyone willing to reply online',
          'The result is invalid because followers are not allowed in a validation sample',
        ],
        answer: 1,
        explanation: 'Followers over-represent enthusiasts and “would pay” is a stated intent, not a commitment. The result is a lead worth following up with a stricter test, not a rate to plan on.',
      },
    ],
    task: {
      title: 'Research the idea, then list what you do not know',
      minutes: 25,
      steps: [
        'Run the desk research prompt on your problem statement from lesson 1 in an AI assistant that can search the web.',
        'Open at least three of the links it gave. Write one line for each: did the page really say what the assistant claimed?',
        'Delete or mark UNVERIFIED any number you could not find in a source you opened.',
        'Make your own assumptions table with at least four rows: assumption, if it is false, cheapest test, and the evidence that would convince you. Write the finish lines now.',
        'Circle the one assumption that would hurt most if false. That is the first one you will test with real people in the next lesson.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['Ask the AI: “Explain each of these assumptions to me in one plain sentence and give one example of how I could check it by talking to a person.” Keep its answers next to your table.'] },
      { audience: EXPERIENCED, steps: ['Add a research log with the URL and access date for every fact you keep, and tag each row of your table with the segment you will sample and how you will avoid asking only friendly people.'] },
    ],
  },
  {
    id: 'idea-to-product-03',
    day: 3,
    title: 'Talk to real people',
    summary: 'Write an interview script about past behaviour, find and ask the right people, run a short conversation and tell polite praise from real commitment.',
    intro: {
      objectives: [
        'Write interview questions about what people did, not what they might do',
        'Invite and run a 15-minute conversation without pitching your idea',
        'Record notes in a log and tell compliments from real commitments',
      ],
      why: 'Talking to five to ten real people is the cheapest and most reliable thing you can do before building. It is the step AI cannot do for you, and it is where most failed ideas are quietly saved.',
    },
    minutes: 25,
    skills: ['user-interviews'],
    body: [
      { type: 'paragraph', text: "An interview is a short conversation in which you learn about someone’s life, not a chance to describe your idea. That is hard, because you are excited about your idea, and people are polite. Ask “Would you use this?” and almost everyone says yes, because it costs them nothing. This lesson gives you rules, a full script you can copy and a way to record what you hear, so you leave with evidence and not with encouragement." },
      { type: 'heading', text: 'Five rules for a useful conversation' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Talk about their life, not your idea.** You are there to learn how they handle the problem today.',
          '**Ask about the past, not the future.** “Tell me about the last time…” gives facts. “Would you…?” gives guesses.',
          '**Ask what they did.** What happened, who was involved, which tools they used, what it cost them.',
          '**Do not pitch.** If you describe your solution early, people will politely react to it instead of describing their world.',
          '**Treat compliments as noise.** “That sounds great” is not data. What they do next is.',
        ],
      },
      { type: 'heading', text: 'Good questions and bad questions' },
      {
        type: 'table',
        headers: ['Bad question', 'Why it fails', 'Better question'],
        rows: [
          ['Would you use an app that books customers for you?', 'Hypothetical, so it invites a polite “yes”', 'Tell me about the last time a customer booked you. What happened?'],
          ['Don’t you hate double-booking?', 'Leading: it suggests the answer', 'What happens when two customers want the same slot?'],
          ['How much would you pay for this?', 'A made-up number from an imaginary product', 'What do you spend now on tools or help to keep your schedule?'],
          ['Do you think this is a good idea?', 'Asks for approval, not facts', 'What have you tried so far to fix this?'],
        ],
        caption: 'Move every question from the future to the past, and from your idea to their life',
      },
      { type: 'heading', text: 'Rina’s interview script' },
      { type: 'paragraph', text: "Here is the complete script Rina uses for 15-minute conversations with other home-service owners. Copy it and change the words to fit your own people. Notice that nothing in it describes her product, and that it ends by asking for a small next step." },
      {
        type: 'code',
        language: 'text',
        label: 'Interview script: home-service owners (15 minutes)',
        code: `OPENING (1 minute)
"Thanks for your time. I run a small aircon cleaning business and I am learning
how other owners handle bookings. I am not selling anything. Is it okay if I
take notes? Nothing you say will be shared with your name on it."

QUESTIONS
1. Tell me about your business and a typical week.
2. Walk me through the last time a customer booked you, from the first message.
3. What tools do you use to keep track of jobs today?
4. Tell me about a time two customers wanted the same slot, or you forgot one.
   What happened? What did it cost you?
5. What did you do about it afterwards?
6. How much time each week do you spend arranging bookings?
7. Have you tried any app, form or system for this? What happened?
8. Who else on your team deals with the schedule? How do they find out?

CLOSING (2 minutes) -- ask for a small commitment
"Thanks, this helps a lot. Could I show you a very simple booking page next
week and watch you try it? And is there another owner I could talk to?"`,
      },
      { type: 'paragraph', text: "Question 4 is the heart of it: it asks for a specific past event and its cost. The last two questions are the real test. If someone agrees to look at a simple version next week or introduces you to a friend, they are spending their time and their reputation, which a compliment never does." },
      { type: 'prompt', label: 'Ask an AI to review your script for leading questions', text: "Here is my interview script for [who]. Review it as a skeptical research coach. Mark every question that is hypothetical (“would you…”), leading (hints at the answer) or pitches my idea. Rewrite each one to ask about a specific past event, and tell me what answer would count as strong evidence. Do not add questions about my solution.\n\n[paste your script]" },
      { type: 'heading', text: 'Find five to ten people and ask politely' },
      { type: 'paragraph', text: "Start with people who have the problem and are not your closest friends, who will be too kind. Good places: owners and workers you already buy from or work beside, local business groups, community and professional groups where you are allowed to post, and introductions from the first people you talk to. Keep messages short, honest and easy to say no to." },
      {
        type: 'code',
        language: 'text',
        label: 'A short message to ask for a conversation (Messenger or text)',
        code: `Hi Ate Grace, I'm Rina from Cool Hands Aircon Cleaning. I'm trying to
understand how small service owners handle bookings. Could I ask you a few
questions for 15 minutes this week? I'm not selling anything. Happy to
treat you to coffee or do it on a call. No worries if you're busy!`,
      },
      {
        type: 'warning',
        text: "Be careful with other people’s information. Ask permission before recording, do not paste names, phone numbers or addresses into an AI tool, and use initials or codes in your notes. The Philippines has a Data Privacy Act (Republic Act No. 10173) that applies to personal data, and other countries have similar rules, so collect only what you need and tell people why. Check the official guidance for your country before you collect data at scale.",
      },
      {
        type: 'version',
        text: "A free Google Form can screen people before an interview (a few questions and a contact field) or serve as a feedback form later. Google’s help page describes creating a form from Google Forms, Google Sheets or Google Drive, and choosing to store responses in a Google Sheet. Features and limits change, so check the page and your own account.",
        checked: CHECKED,
        sources: [DOCS.googleForms],
      },
      { type: 'heading', text: 'Take notes you can learn from' },
      { type: 'paragraph', text: "Write down what people did and said in their own words, not your interpretation. Use one row per conversation in an interview log. These three rows are Rina’s first conversations (names replaced with codes, details invented for teaching)." },
      {
        type: 'table',
        headers: ['Who', 'Last time (what happened)', 'Workaround', 'Cost or quote', 'Next step they agreed to'],
        rows: [
          ['O1 laundry shop owner', 'Two pickups booked for the same hour; sent one customer away', 'Notebook and Messenger', '“I lost a regular customer over it.”', 'Will try a test page next week'],
          ['O2 plumber', 'Forgets follow-ups when busy', 'Phone alarm and memory', '“Maybe twice a month I forget.”', 'None, said “sounds nice”'],
          ['O3 massage therapist', 'No-shows when she forgets to confirm', 'Texts everyone the night before', '“Two hours every Sunday evening”', 'Introduced me to two other therapists'],
        ],
        caption: 'O1 and O3 gave commitments. O2 gave a compliment, which counts for almost nothing.',
      },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: an *interview* here is just a friendly chat with a person who has the problem. Imagine you want to open a milk tea stall. You would not ask passers-by “Would you buy my milk tea?”, because they would say yes to be kind. You would ask “What did you drink the last time you were thirsty here, and why?” and watch what people actually buy. Your script does the same job. A *commitment* is anything that costs the person something: their time, their money, their reputation. Those are the answers that count.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Interview quality depends on sampling and discipline. Define the segment narrowly, recruit across it (not only by convenience), and stop when answers repeat, which is often after 8 to 12 conversations in a tight segment. Separate observation from interpretation in your notes, and code notes for themes after the fact. AI can help cluster transcripts, but treat its clusters as a draft and check each against verbatim quotes. Only paste transcripts into tools whose data terms you have checked and only with consent, ideally anonymised. Keep a note of disconfirming evidence on purpose; if no interview ever contradicts your idea, your questions are probably leading.",
      },
      {
        type: 'takeaways',
        items: [
          'Ask about their life and the past, not about your idea and the future.',
          'Never pitch in the first conversation. Ask what they did, what it cost and what they tried.',
          'Compliments are noise. A commitment (time, money, an introduction) is evidence.',
          'Keep an interview log with their own words and the next step each person agreed to.',
          'Protect people’s data: ask consent, use codes and do not paste personal details into AI tools.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-03-fix-1',
          kind: 'fix-bug',
          title: 'Fix the leading question',
          prompt: 'One question in this interview script invites a polite “yes” instead of facts. Tap that line, then choose the best rewrite.',
          concept: 'interview questions',
          language: 'text',
          code: 'Interview script for tutoring centre owners (15 minutes)\n1. Tell me about your centre and a typical week.\n2. Walk me through the last time a parent asked to book a session.\n3. Wouldn’t it be amazing if parents could book themselves online?\n4. What tools do you use today to keep track of bookings?\n5. Tell me about a time a session was double-booked. What did you do?',
          bugLine: 4,
          fixes: [
            { line: '3. Tell me about a time a parent asked for a slot that was already taken. How did you handle it?', correct: true, why: 'It asks for a specific past event and what the owner did, which gives facts and a cost.' },
            { line: '3. Would you pay for an app that lets parents book themselves online?', correct: false, why: 'It is still hypothetical and describes the product, so it invites a polite “yes”.' },
            { line: '3. Do you think online booking is a good idea for your centre?', correct: false, why: 'It asks for approval, not facts. People are polite when asked for opinions.' },
            { line: '3. Is double-booking a big problem for you? Please be honest.', correct: false, why: 'It is a yes-or-no question about a general feeling. “Be honest” does not turn it into a story about a real event.' },
          ],
          hints: [
            'Look for the question that describes a product or suggests the answer.',
            'It is the one starting with “Wouldn’t it be amazing…”. Count the lines from the top: the title is line 1.',
            'The best rewrite asks about the last time a specific thing happened, in the past.',
          ],
          explanation: 'Line 4 (“Wouldn’t it be amazing…”) is both leading and hypothetical. Replacing it with a question about a specific past event gives you facts about how the owner coped and what it cost.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-03-scenario-1',
          kind: 'scenario',
          title: 'Validation or wishful thinking?',
          prompt: 'Which conclusion do these interview results actually support?',
          concept: 'reading interview evidence',
          situation: 'Ben interviewed six owners of small print shops about a job-tracking app. Every one said “That sounds really useful!” Four said they would “definitely try it”. When he asked for a 15-minute follow-up to watch them try a simple version, one agreed. The others said “Message me when it is ready.” Nobody described a specific time the problem had cost them money.',
          options: [
            { text: 'Weak evidence so far: compliments, one real commitment and no cost described. Ask the one who agreed to try it, then run more interviews that ask for a specific recent case.', consequence: 'He treats politeness as noise, follows the one real signal and fixes his questions.', quality: 'best' },
            { text: 'Strong demand: six out of six said it sounds useful, so start building.', consequence: 'He builds for people who were being kind. “Message me when it is ready” usually means never.', quality: 'poor' },
            { text: 'Proof the idea is bad: five people did not commit, so stop.', consequence: 'Too harsh. The questions never asked for a concrete cost, so the data is thin rather than negative.', quality: 'acceptable' },
            { text: 'Ask the six owners to rate the idea out of ten and use the average.', consequence: 'A rating is another polite opinion. Averaging politeness does not make it evidence.', quality: 'poor' },
          ],
          hints: [
            'For each person, what did they actually do, other than say something kind?',
            'Only one person gave up time. Nobody described a real case with a cost.',
            'The best answer keeps the one real signal and improves the questions.',
          ],
          explanation: 'Compliments cost nothing and nobody described a real cost, so this is thin evidence. One person committed time, which is the real signal. The right move is to follow it up and ask better, past-focused questions.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-03-q1',
        prompt: 'Which interview question is most likely to give you a fact?',
        choices: [
          'Tell me about the last time a customer booked you.',
          'Would you use an app that handles bookings for you?',
          'Don’t you think a booking app would save you time?',
          'How much would you pay for a booking app?',
        ],
        answer: 0,
        explanation: 'It asks for a specific past event. The others are hypothetical, leading or ask about an imaginary product.',
      },
      {
        id: 'idea-to-product-03-q2',
        prompt: 'At the end of a conversation, which response is the strongest evidence?',
        choices: [
          '“That’s a really clever idea.”',
          '“I’d definitely use that someday, so please tell me when it launches.”',
          '“I’ll introduce you to two owners and try your page Monday.”',
          '“Message me when it’s ready.”',
        ],
        answer: 2,
        explanation: 'An introduction and a scheduled try-out cost the person time and reputation. The other replies are polite and free.',
      },
      {
        id: 'idea-to-product-03-q3',
        prompt: 'Why should you not describe your solution at the start of an interview?',
        choices: [
          'It is rude to talk about your own business',
          'People will react politely to the idea instead of describing their own habits',
          'The interview will run longer than 15 minutes',
          'AI assistants cannot summarise interviews that mention solutions, so the notes would be useless',
        ],
        answer: 1,
        explanation: 'Once they hear your idea, people start judging it. You want their real behaviour, which they show when you ask about their own past.',
      },
      {
        id: 'idea-to-product-03-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what is a “commitment” in an interview?',
        choices: [
          'A promise from you that you will build the product exactly the way the interviewee describes it',
          'Something that costs them time, money or reputation, like agreeing to try a test page',
          'Any positive thing they say during the conversation, such as “great idea” or “that sounds helpful”',
        ],
        answer: 1,
        explanation: 'A commitment is an action that costs the person something. Kind words cost nothing, so they are not evidence of real interest.',
      },
      {
        id: 'idea-to-product-03-q5',
        audience: EXPERIENCED,
        prompt: 'You ran 10 interviews and nobody contradicted your hypothesis. What does that most likely indicate?',
        choices: [
          'The hypothesis is confirmed and you can stop interviewing and begin building straight away',
          'Your sampling or questions may be biased: recruit beyond your network and ask for specific past events',
          'The segment is too small to build for',
          'The notes should be summarised by an AI assistant so that any contradictions would appear on their own',
        ],
        answer: 1,
        explanation: 'Real markets are messy. Unanimous agreement usually signals leading questions or a convenient sample, so widen recruitment and add questions that could disprove you.',
      },
    ],
    task: {
      title: 'Write the script and book three conversations',
      minutes: 25,
      steps: [
        'Write an interview script for your own problem: an opening, six to eight questions about the past and a closing that asks for a small next step. Use Rina’s script as a pattern.',
        'Run it through the “review for leading questions” prompt and rewrite anything it marks.',
        'Send the short invitation message to at least five people who have the problem, and book three conversations.',
        'Have the first conversation. Take notes in a table with the same columns as the interview log. Do not describe your idea.',
        'Write one sentence: what did the person actually do or agree to, apart from what they said?',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['Practise your script out loud with a friend first, and ask them to stop you every time you say “would you”. Then rewrite the questions they stopped.'] },
      { audience: EXPERIENCED, steps: ['After eight conversations, code your notes for repeated themes and exceptions, record one piece of disconfirming evidence, and note how you recruited so you can judge the bias in your sample.'] },
    ],
  },
  {
    id: 'idea-to-product-04',
    day: 4,
    title: 'Define the smallest useful version',
    summary: 'Shrink the idea to a one-page MVP scope: one promise, one job, three must-haves, a not-now list and a success measure set before you build.',
    intro: {
      objectives: [
        'Explain what an MVP is, and what it is not',
        'Write a one-page MVP scope with a promise, one job, must-haves, a not-now list and a success measure',
        'Cut a bloated feature list with a simple three-question test',
      ],
      why: 'AI makes adding features feel free, so first versions swell. A small, written scope keeps your first build finishable and makes sure the test actually answers your riskiest question.',
    },
    minutes: 25,
    skills: ['mvp-scoping'],
    body: [
      { type: 'paragraph', text: "Once you have some evidence that the problem is real, the next temptation is to build everything you imagined. With an AI tool this is easier than ever: ask for a booking page and you may get accounts, payments, a dashboard and a loyalty system you never wanted. A bigger first version takes longer to build, longer to test and gives you more things to be wrong about. The fix is to decide, in writing and before you build, what the smallest useful version is." },
      { type: 'heading', text: 'What an MVP is, and what it is not' },
      { type: 'paragraph', text: "An **MVP** (minimum viable product) is the smallest version that lets a real person do the one job your product promises, so that you can learn from real use. It is not a rough, buggy copy of your dream product, and it is not a clickable mock-up that only looks real. It must actually do the job for a small number of people, even if parts are done by hand behind the scenes." },
      { type: 'paragraph', text: "That last point matters, because the cheapest MVP is often not software. Pick the cheapest kind that tests your riskiest assumption." },
      {
        type: 'table',
        headers: ['Kind of MVP', 'What it is', 'Rina’s example', 'What you learn'],
        rows: [
          ['Concierge', 'You do the job by hand for a few real customers', 'Customers fill in a Google Form and Rina copies each booking into a shared calendar herself', 'Whether people use a link, and what they really need to tell you'],
          ['Smoke test', 'A simple page that describes the promise and asks people to respond, before anything is built', 'A one-page “Book a cleaning” page that collects names and numbers', 'Whether people respond at all'],
          ['No-code or AI-built tool', 'A small working tool made with an AI builder', 'A booking page with slots and an owner calendar', 'Whether the tool itself solves the job'],
          ['Coded product', 'Custom software built for growth', 'A later version, only if the earlier ones work', 'Whether it works at scale'],
        ],
        caption: 'Start at the top and move down only when the cheaper kind has taught you what it can',
      },
      { type: 'heading', text: 'The scope on one page' },
      { type: 'paragraph', text: "Write the scope on one page. If you cannot, the idea is still too big. Here is Rina’s complete scope for her first version. Notice the **Not now** list is longer than the **Must have** list, which is exactly right, and that the success measure is set now, before any result exists." },
      {
        type: 'code',
        language: 'text',
        label: 'MVP scope: Cool Hands Booking v1',
        code: `MVP SCOPE: COOL HANDS BOOKING v1 (two weeks)

PROMISE
Rina sees every booking in one place, and customers get a confirmation
without a long back-and-forth of messages.

FIRST USERS
Five owners of small home-service businesses in Cebu (three from my
interviews) and their customers.

THE ONE JOB
A customer picks a time slot and gets a confirmation.

RISKIEST ASSUMPTION BEING TESTED
Customers will use a booking link instead of messaging.

MUST HAVE (three things)
1. A booking form: name, phone, barangay and address, number of units, time slot.
2. One shared calendar view for the owner and her technicians.
3. A confirmation and reminder message (sent by Rina by hand at first).

NOT NOW
Online payments, customer accounts and sign-in, loyalty points, reviews,
in-app chat, price calculator, route planning for technicians,
a mobile app, charts and reports, marketing emails.

SUCCESS MEASURE (written before the test)
At least 3 of 5 first users take 3 or more real bookings through the link
in two weeks. At least 4 of 5 customers finish the form without help.

IF IT FAILS
If fewer than 2 of 5 first users take a real booking, re-check the problem
before building anything more.`,
      },
      { type: 'heading', text: 'A three-question cut test' },
      { type: 'paragraph', text: "Every feature on your wish list should earn its place. Ask three questions about each one." },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Can the person do the one job without it?** If yes, it is not a must-have.',
          '**Could I do this by hand for five users?** If yes, do it by hand for now. Rina sends reminders herself.',
          '**Does it help test my riskiest assumption?** If not, it can wait until you know the assumption holds.',
        ],
      },
      { type: 'paragraph', text: "Payments fail all three for Rina: customers can book without paying online, she can collect payment by hand and it tells her nothing about whether customers use a booking link. So payments go to Not now. Remember that every feature also costs you later: more to test, more data to protect and more places for a bug to hide. The fact that an AI can add it in one prompt does not make it free." },
      { type: 'prompt', label: 'Ask an AI to cut your feature list (not to add to it)', text: "My product promise: [one sentence]. The one job: [the single thing the customer must be able to do]. My riskiest assumption: [assumption].\n\nHere is my feature wish list: [paste your list].\n\nFor each feature answer three questions: (1) Can the person do the one job without it? (2) Could I do it by hand for five users? (3) Does it help test my riskiest assumption? Then sort the features into KEEP, DO BY HAND and NOT NOW. Keep at most three in KEEP. Do not add features of your own." },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: a *feature* is one thing your product can do, like taking a booking or sending a reminder. An MVP is the “taste test” version. A cook opening a food stall does not print a menu of fifty dishes. She cooks one dish well, watches who comes back and learns from it. The scope page is your one-dish menu. Anything you cannot do by hand for five people can wait. And writing down your success measure first is like deciding before the taste test that you will count it a hit only if most people finish the plate, so your hopes cannot change the score afterwards.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Scope for the first release as a vertical slice: one thin path through every layer (interface, rules, storage, owner view) that does the whole job, rather than horizontal layers built separately. Express the must-haves as acceptance criteria you can check by hand, and give the test a time box and kill criteria written in advance. Remember that each feature adds more than build time: test surface, data to secure, support burden and migration cost. Decide for each capability whether to build, buy or configure an existing service. Choose leading indicators you can observe in the window (activation, repeat use) and do not infer retention or revenue from five users.",
      },
      {
        type: 'takeaways',
        items: [
          'An MVP is the smallest version that lets a real person do the one job, so you can learn. It is not a buggy full product or a mock-up.',
          'The cheapest MVP is often a concierge version where you do part of the job by hand.',
          'Write a one-page scope: promise, first users, one job, riskiest assumption, three must-haves, a longer not-now list, success measure and a stop rule.',
          'Cut with three questions: needed for the job? doable by hand? tests the riskiest assumption?',
          'Set the success measure before you build, so the result cannot be bent to fit your hopes.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-04-fill-1',
          kind: 'fill-blank',
          title: 'Complete the MVP scope',
          prompt: 'Ate Lorna runs a home tutoring service. Her first-version scope is nearly done. Fill each blank with the best word or phrase.',
          concept: 'MVP scope',
          story: 'Parents book Lorna’s tutors through Messenger. Sessions get double-booked and she spends her evenings answering messages.',
          language: 'text',
          code: 'PROMISE: Parents book a tutoring session without long message threads.\nTHE ONE JOB: A parent picks a ___ and Lorna sees it.\nMUST HAVE: a booking form and a ___ for Lorna.\nNOT NOW: ___ and other extras.\nSUCCESS MEASURE: ___ of 5 parents book a session through the form without help.',
          blanks: [
            { answers: ['time slot', 'slot'], feedback: 'The one job is booking a session, so the parent has to choose when.' },
            { answers: ['list of bookings'], feedback: 'The must-haves are the things needed to do the one job: a form to book and a place for Lorna to see bookings.' },
            { answers: ['online payments', 'progress reports', 'parent accounts'], feedback: 'The form and the list of bookings are must-haves. Pick something the one job can live without.' },
            { answers: ['3', '4'], feedback: 'A success measure needs a number set in advance, and it must be something the five users can reach, so no more than 5.' },
          ],
          bank: ['time slot', 'list of bookings', 'online payments', 'progress reports', 'booking form', '3', '9'],
          hints: [
            'Think about the one job: what must the parent choose, and what must Lorna be able to see?',
            'Not now holds extras the job can live without. The form and the list are the job itself.',
            'A success measure out of 5 users needs a number from 1 to 5.',
          ],
          explanation: 'A scope names exactly what the one job needs (a time slot, a form and a list of bookings), parks everything else in Not now, and fixes a measurable success number up front.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-04-fix-1',
          kind: 'fix-bug',
          title: 'Cut the bloated scope',
          prompt: 'This MVP scope lists too many must-haves for a two-week test. Tap the line that is bloated, then choose the best cut.',
          concept: 'cutting scope',
          language: 'text',
          code: 'MVP SCOPE: Cool Hands Booking v1 (two weeks)\nPROMISE: Rina sees every booking in one place.\nRISKIEST ASSUMPTION: Customers will use a booking link instead of messaging.\nMUST HAVE: booking form, calendar view, online payments, loyalty points, customer chat, reviews, admin charts\nSUCCESS MEASURE: 3 of 5 first users take real bookings through the link.',
          bugLine: 4,
          fixes: [
            { line: 'MUST HAVE: booking form, calendar view, reminder message', correct: true, why: 'The form lets customers book, the calendar lets Rina see every booking, and the reminder tackles no-shows. Everything else can wait or be done by hand.' },
            { line: 'MUST HAVE: booking form, online payments, loyalty points', correct: false, why: 'This drops the calendar view, which is the promise itself, and keeps two features that do not test whether customers use a link.' },
            { line: 'MUST HAVE: calendar view, reviews, admin charts', correct: false, why: 'Customers would have no way to book, so the riskiest assumption could not be tested at all.' },
            { line: 'MUST HAVE: booking form, calendar view, online payments, reminder message', correct: false, why: 'It trims only some extras. Online payments need extra accounts and setup and do not help test whether customers use a booking link.' },
          ],
          hints: [
            'Count the must-haves. A two-week test needs about three.',
            'The bloated line is the MUST HAVE line (line 4). Keep what the promise and the riskiest assumption need.',
            'The best cut keeps a way to book, a place to see bookings and the thing that fixes no-shows.',
          ],
          explanation: 'The promise needs a way to book and a place to see every booking, and the reminder helps with Rina’s real cost. Payments, loyalty points, chat, reviews and charts do not help test the riskiest assumption, so they go on the Not now list.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-04-q1',
        prompt: 'Which description best fits an MVP?',
        choices: [
          'A rough, unfinished copy of the whole product that you release publicly to find out what breaks and what people complain about',
          'A clickable mock-up that looks like the real product but does not actually do anything for the user yet',
          'A cheaper version of the final product with fewer colours, fewer languages and a simpler logo',
          'The smallest version that lets a real person do the one job, so you learn from real use',
        ],
        answer: 3,
        explanation: 'An MVP is defined by the job it does for a real person, not by being rough or pretty. It must really work for a small number of users, even if some parts are done by hand.',
      },
      {
        id: 'idea-to-product-04-q2',
        prompt: 'Rina wants online payments in v1 because “serious businesses take payments”. What does the cut test suggest?',
        choices: [
          'Add it: customers will not trust a booking page that cannot take payment, so it is part of the job',
          'Move it to Not now: customers can book without it, Rina can take payment by hand, and it tests nothing about the link',
          'Add it, but only for one payment method, since a smaller build is always a safe build even if it needs a new account and a lot of setup',
          'Ask the AI to add it anyway, because features cost almost nothing to add with AI tools',
        ],
        answer: 1,
        explanation: 'Payments fail all three questions: the job can be done without them, payment can be handled by hand and they do not help show whether customers use a link.',
      },
      {
        id: 'idea-to-product-04-q3',
        prompt: 'Why write the success measure before building?',
        choices: [
          'So you have a number ready to show friends and family when they ask how the project is going, which makes the work feel more official',
          'So you can adjust the target afterwards and still describe a mixed result as a success',
          'So you decide in advance what result means keep going, change or stop, and cannot move the goalposts later',
          'So the AI tool knows how many users to design the first version to handle at once',
        ],
        answer: 2,
        explanation: 'A target fixed in advance turns the test into a real test. Without it, any result can be described as encouraging.',
      },
      {
        id: 'idea-to-product-04-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what is a “feature”?',
        choices: [
          'One thing the product can do, such as taking a booking',
          'The colour, font style and layout of every page and button in the product',
          'The price a customer pays each month',
        ],
        answer: 0,
        explanation: 'A feature is a single capability. Your scope lists the few features the one job needs and parks the rest on a Not now list.',
      },
      {
        id: 'idea-to-product-04-q5',
        audience: EXPERIENCED,
        prompt: 'An agent proposes building the whole booking platform across all layers in one pass. How should you scope the first release?',
        choices: [
          'Accept, because a complete system gives the cleanest architecture and avoids later rework when the product is handed to a team',
          'Ask for one thin slice through every layer that does the whole job, with hand-checkable criteria and a time box',
          'Build only the database first and the interface later, since storage is the foundation',
          'Split the platform across four parallel agents so everything is finished sooner',
        ],
        answer: 1,
        explanation: 'A vertical slice delivers the job end to end, so you can test the riskiest assumption early. Horizontal layers or parallel work delay learning and enlarge the review.',
      },
    ],
    task: {
      title: 'Write your one-page MVP scope',
      minutes: 25,
      steps: [
        'List every feature you can imagine for your product, at least ten, without judging them.',
        'Run each one through the three-question cut test, or paste the list into the cut prompt, and keep at most three must-haves.',
        'Write your scope using Rina’s page as the pattern: promise, first users, the one job, riskiest assumption, must-haves, not-now list, success measure and stop rule.',
        'Check that your success measure is a number you could count in two weeks, and that your first users could reach it.',
        'Ask yourself if the cheapest MVP for your idea is a concierge one with no software at all, and note your answer.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['Ask your AI tool: “Read my scope page and tell me in one sentence each what the promise, the one job and the not-now list mean.” If it gets any of them wrong, your page is not clear enough yet.'] },
      { audience: EXPERIENCED, steps: ['Turn each must-have into one acceptance criterion you can verify manually, define the leading indicators you will log, and write the kill criterion with a date.'] },
    ],
  },
  {
    id: 'idea-to-product-05',
    day: 5,
    title: 'Write a spec an AI can build from',
    summary: 'Turn the scope into a one-page spec with pages, data, rules and acceptance criteria that an AI can build from and you can check.',
    intro: {
      objectives: [
        'Write a spec with goal, users, pages, data, rules and acceptance criteria',
        'Rewrite a vague request as something an AI can build and you can test',
        'Keep the spec in a file so every tool and every new chat can read it',
      ],
      why: 'An AI fills every gap in your request with a guess, including features you ruled out. A spec closes the gaps, and its checks tell you whether what came back is right.',
    },
    minutes: 25,
    skills: ['spec-writing'],
    body: [
      { type: 'paragraph', text: "A prompt is a request. A **spec** (short for specification) is a written description of what the product must do, kept in a file, that you can reuse across many prompts, many chats and even many tools. It matters for a simple reason: when your request leaves something out, the AI does not ask. It guesses. Ask for “a booking page” and it may add accounts, payments and a dashboard, choose how many time slots exist and decide what happens when two people book the same one. A spec replaces those guesses with your decisions." },
      { type: 'paragraph', text: "A spec has a second job: it is also your checklist. Each rule and acceptance criterion in it is something you can test by hand when the AI finishes, so you know whether the build is right without reading any code." },
      { type: 'heading', text: 'The parts of a spec' },
      {
        type: 'table',
        headers: ['Part', 'The question it answers', 'In Rina’s spec'],
        rows: [
          ['Goal', 'What is this for, in two sentences?', 'A booking page and a private owner page for a two-week test'],
          ['Users', 'Who uses it, and how?', 'Customers on phones with no account; Rina to manage bookings'],
          ['Out of scope', 'What must the AI not build?', 'Payments, accounts, reviews, chat, loyalty points'],
          ['Pages', 'What does each screen show and let people do?', 'Booking page, confirmation page, owner page'],
          ['Data', 'What information is saved?', 'A booking: name, phone, address, units, slot, status'],
          ['Rules', 'What must always (or never) happen?', 'Each slot takes at most two bookings; no past dates'],
          ['Acceptance criteria', 'How will I check each thing works?', 'Seven checks you can do by hand on a phone'],
        ],
        caption: 'The out-of-scope part is as important as the rest: it stops the AI from adding things',
      },
      { type: 'heading', text: 'Rina’s complete spec' },
      { type: 'paragraph', text: "This is the full spec Rina gives her AI building tool. It comes from her MVP scope in lesson 4. Read how every vague idea became a number, a list or a rule. Copy its structure for your own product." },
      {
        type: 'code',
        language: 'markdown',
        label: 'SPEC.md: Cool Hands Booking v1',
        code: `# Cool Hands Booking v1: spec

## Goal
A web page where customers book an aircon cleaning slot, and a private page
where Rina sees every booking. This is a two-week test with five owners and
their customers, not a public launch.

## Users
- Customer: books on a phone in Cebu. No account.
- Owner (Rina): sees and manages bookings.

## Out of scope (do not build)
Payments, customer accounts, reviews, chat, loyalty points, emails to
customers, a mobile app, charts.

## Pages
1. Booking page (public, mobile first): choose a day (next 14 days, Monday to
   Saturday), a time slot, number of units (1 to 6), then name, mobile number,
   barangay, street address and an optional note. Button: "Book cleaning".
2. Confirmation page: shows the day, slot and units, and the text
   "Cool Hands will message you to confirm."
3. Owner page (password protected): list of bookings by date with name,
   phone, address, units, slot and status (New, Confirmed, Done, Cancelled),
   and buttons to change the status.

## Data
Booking: id, created_at, name, phone, barangay, address, units, slot_start,
note, status.

## Rules
- Slots: 8-10, 10-12, 1-3 and 3-5, Monday to Saturday.
- A slot takes at most 2 bookings (two technicians). A full slot shows "Full"
  and cannot be chosen.
- Past dates cannot be booked.
- Phone: 11 digits starting with 09.
- Only the owner can see bookings.

## Acceptance criteria (each can be checked by hand)
1. A customer can finish a booking on a phone in under 2 minutes.
2. After two bookings in the same slot, the slot shows "Full" and a third
   attempt is refused with a clear message.
3. A booking for a past date cannot be submitted.
4. A missing name or an invalid phone shows a message under the field and
   saves nothing.
5. The owner page asks for a password. Without it no booking details show.
6. Refreshing the owner page keeps all bookings (they are saved).
7. A status change on the owner page is still there after refreshing.

## Notes for the builder
- Use sample data only while building. No real customer data yet.
- Keep passwords and keys out of the code and out of this chat.
- Collect only the fields listed above.
- Ask me before adding anything not in this spec.`,
      },
      { type: 'heading', text: 'From vague to testable' },
      { type: 'paragraph', text: "The skill is rewriting every vague word into something you could check. Whenever you write “nice”, “easy” or “fast”, replace it with a number, a list or an example." },
      {
        type: 'table',
        headers: ['Vague', 'Testable'],
        rows: [
          ['A nice booking page', 'Shows the next 14 days, four slots per working day, and a slot that is taken twice shows “Full”'],
          ['Easy to use on a phone', 'A customer finishes a booking in under 2 minutes, with one hand, without zooming'],
          ['Secure owner page', 'Needs a password, and typing the page’s address without it shows no booking details'],
          ['Handles mistakes', 'A missing name or invalid phone shows a message under the field and saves nothing'],
        ],
        caption: 'If you cannot check it by hand, the AI cannot be told to meet it',
      },
      { type: 'prompt', label: 'Ask an AI to draft the spec, then question it', text: "Here is my MVP scope: [paste your one-page scope].\n\nWrite a one-page spec for a web app with these headings: Goal, Users, Out of scope, Pages, Data, Rules, Acceptance criteria (each checkable by hand), Notes for the builder. Use only what is in my scope.\n\nThen, in a separate list at the end, write every assumption you made and every question you would ask me if you could. Do not add features I did not list." },
      { type: 'tip', text: "Read the assumptions list it gives you. Each one is a place where the AI would otherwise have guessed. Answer them and update the spec before building anything." },
      { type: 'heading', text: 'Keep the spec where tools can read it' },
      { type: 'paragraph', text: "Save the spec as a file, for example `SPEC.md`, and paste it at the start of every new chat or let the tool read it from your project. A spec that lives only inside one long conversation gets lost when the chat grows. With a spec in a file, you can switch tools without starting over, which lesson 6 will make useful." },
      {
        type: 'version',
        text: "Some tools read a project instructions file on their own. Claude Code reads a file called CLAUDE.md at the start of every session and can use an existing AGENTS.md in its place, and Cursor supports project rules. A one-page spec or a short pointer to it belongs in that kind of file, so each new session starts from the same decisions. Check each tool’s current docs for file names and behaviour.",
        checked: CHECKED,
        sources: [DOCS.claudeCode, DOCS.cursorDocs],
      },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: a *spec* is a written “order form” for what you want built, so the builder (here an AI) does not have to guess. An *acceptance criterion* is one check you can tick off, like “after refreshing the page, the booking is still there”. A *rule* is something that must always be true, such as “no more than two bookings per slot”. *Data* just means the information the product remembers, like a table where each row is one booking with its name, phone and time. Think of it as telling a tailor your exact measurements instead of saying “make me a nice shirt”.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Spec-driven development treats the spec as the source of truth and the code as its output. Write acceptance criteria that can become automated tests, state negative cases (what must be refused) and non-functional requirements (privacy, accessibility, latency, data retention). Concurrency deserves a line of its own: if two customers submit the last slot at the same moment, a check done only in the interface will not prevent a double booking, so the rule needs enforcement where the data is stored, through a database constraint or a transaction. Put the data model, naming and events you will log in the spec so reviews can compare the diff against it. Keep the spec in version control beside the code.",
      },
      {
        type: 'takeaways',
        items: [
          'A spec is a written description of what the product must do, kept in a file. It replaces the AI’s guesses with your decisions.',
          'Include goal, users, out of scope, pages, data, rules and acceptance criteria you can check by hand.',
          'Say what must not be built. It stops the AI from adding accounts, payments and extras.',
          'Replace every vague word (“nice”, “easy”) with a number, a list or an example.',
          'Save the spec as a file and ask the AI to list the assumptions it made.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-05-tap-1',
          kind: 'tap-reveal',
          title: 'Which part of the spec is it?',
          prompt: 'Tap each card to see which part of the spec answers the question.',
          concept: 'parts of a spec',
          cards: [
            { front: '“Do not build payments, accounts or reviews.”', back: 'Out of scope. It stops the AI from adding features you ruled out.' },
            { front: '“A slot takes at most two bookings.”', back: 'A rule. It says what must always be true, and you can test it by booking three times.' },
            { front: '“After refreshing the owner page, all bookings are still there.”', back: 'An acceptance criterion. It is one check you can do by hand when the build is finished.' },
            { front: '“A booking has a name, phone, address, units, slot and status.”', back: 'Data. It names the information the product saves for each booking.' },
          ],
          hints: [],
          explanation: 'Each part of the spec has one job: out of scope limits the build, rules say what must always hold, acceptance criteria are your checks, and data names what is saved.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-05-scenario-1',
          kind: 'scenario',
          title: 'Which instruction do you send first?',
          prompt: 'Choose the instruction most likely to give Rina a build she can check.',
          concept: 'writing for an AI builder',
          situation: 'Rina is ready to ask an AI app builder for her booking page. She has her MVP scope. She can send one of four instructions as her first message.',
          options: [
            { text: 'Her full spec: goal, users, out of scope, pages, data, rules and seven acceptance criteria, with “ask me before adding anything not in this spec”.', consequence: 'The builder has decisions instead of gaps. When it finishes, she tests the seven checks and knows exactly what is wrong.', quality: 'best' },
            { text: '“Make a nice booking page for my aircon cleaning business.”', consequence: 'The builder guesses everything: slots, fields, accounts, a dashboard. She spends hours steering it away from features she never wanted.', quality: 'poor' },
            { text: '“Build a booking system like the big booking apps, with payments, reminders, reviews and a dashboard.”', consequence: 'It builds a big, shallow product that cannot be tested in two weeks and contains everything she cut from her scope.', quality: 'poor' },
            { text: 'The goal, the pages and the rules, with no out-of-scope list and no acceptance criteria.', consequence: 'Better than a vague request, but the builder may still add extras, and she has no checklist to tell if the result is right.', quality: 'acceptable' },
          ],
          hints: [
            'Which message leaves the fewest gaps for the AI to guess?',
            'A good instruction says what to build, what not to build and how you will check the result.',
            'Only the full spec gives Rina a list of checks to run when it finishes.',
          ],
          explanation: 'The full spec removes the AI’s need to guess and doubles as Rina’s test list. Leaving out the out-of-scope list or the acceptance criteria brings the guesses and the extras back.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-05-q1',
        prompt: 'Why does a spec help when you work with an AI builder?',
        choices: [
          'AI tools only accept long messages, so a spec is required',
          'It replaces the AI’s guesses for anything you did not say with your own decisions',
          'It makes the build finish faster because the AI needs fewer tokens, which also keeps the cost of each prompt lower',
          'It stops the AI from ever making a mistake',
        ],
        answer: 1,
        explanation: 'When a request leaves a gap, the AI fills it with a guess. A spec fills the gaps for you, and its criteria let you check the result.',
      },
      {
        id: 'idea-to-product-05-q2',
        prompt: 'Which of these is a testable acceptance criterion?',
        choices: [
          'The booking page should feel modern and friendly',
          'After two bookings, the slot shows “Full” and a third is refused',
          'The owner page should be easy to use for busy people and look professional',
          'The app should handle many customers well',
        ],
        answer: 1,
        explanation: 'You can check it by booking three times. The others use vague words (“modern”, “easy”, “well”) that no one could verify.',
      },
      {
        id: 'idea-to-product-05-q3',
        prompt: 'What is the main reason to include an “out of scope” list in a spec?',
        choices: [
          'It gives the AI a list of ideas to build later in the project once the first version has users',
          'It shows investors how much you chose not to do',
          'It stops the AI from adding features you already decided to leave out',
          'It makes the spec long enough to count as complete',
        ],
        answer: 2,
        explanation: 'AI builders often add accounts, payments and dashboards unprompted. Naming what not to build keeps the first version small and testable.',
      },
      {
        id: 'idea-to-product-05-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what is an “acceptance criterion”?',
        choices: [
          'A rule about how much the product costs customers',
          'One check you can do by hand to see whether a part of the product works',
          'The name of the AI tool you use to build the product and the version you are running',
        ],
        answer: 1,
        explanation: 'An acceptance criterion is a tick-box check, like “after I refresh, the booking is still there”. When all of them pass, the build matches the spec.',
      },
      {
        id: 'idea-to-product-05-q5',
        audience: EXPERIENCED,
        prompt: 'The spec says a slot holds at most two bookings. Two customers submit the last place at the same instant. Where should the rule be enforced?',
        choices: [
          'In the interface, by hiding the booking button as soon as a slot looks full to the customer on their own phone',
          'In an AI-written message that tells customers to be careful',
          'In a daily report that lets the owner spot and fix any double bookings by hand afterwards',
          'Where data is stored, with a constraint or transaction, so concurrent requests cannot exceed the limit',
        ],
        answer: 3,
        explanation: 'Interface checks can be raced and bypassed. The data layer is the only place that sees every request, so it must enforce the capacity rule. Put the rule and a test for it in the spec.',
      },
    ],
    task: {
      title: 'Write your spec and save it as a file',
      minutes: 25,
      steps: [
        'Paste your MVP scope into the spec prompt and let an AI draft a one-page spec.',
        'Read its assumptions and questions list. Answer every one and update the spec.',
        'Replace every vague word in the spec (“nice”, “easy”, “fast”) with a number, a list or an example.',
        'Check that you have an out-of-scope list and at least five acceptance criteria you can check by hand.',
        'Save it as SPEC.md (or a note you can paste) and copy it somewhere safe.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['Ask the AI to explain your spec back to you in plain words, screen by screen. Fix anything it explains differently from what you meant.'] },
      { audience: EXPERIENCED, steps: ['Add a data model with constraints, the negative cases to refuse, accessibility and privacy requirements, and the events you will log, then have a second model critique the spec for contradictions.'] },
    ],
  },
  {
    id: 'idea-to-product-06',
    day: 6,
    title: 'Choose your AI building tools',
    summary: 'Choose the kind of AI building tool that suits your idea, your experience and your budget, and check its current plan on the official page before you commit.',
    intro: {
      objectives: [
        'Name the main kinds of AI building tools and what each suits',
        'Choose a tool with six questions about data, ownership and cost',
        'Check a tool’s current plan and limits on its official page',
      ],
      why: 'AI tools change every month, so a favourite tool is a poor plan. Choosing by the job in front of you, and by what happens to your data and your code, keeps your product from being trapped in a tool you outgrow.',
    },
    minutes: 25,
    skills: ['tool-selection'],
    body: [
      { type: 'paragraph', text: "You have a spec. Now you need something that can build it. Dozens of tools claim they can, and new ones appear monthly, so this lesson teaches how to choose, not which logo to follow. The course “Choosing the Right AI Coding Tool” covers the full comparison in depth. Here you need just enough to decide for your own first version, and to know what to check before you trust a tool with real customers." },
      { type: 'heading', text: 'Four kinds of building tool' },
      {
        type: 'table',
        headers: ['Kind', 'Examples checked on 14 Nov 2026', 'Good for', 'Watch out for'],
        rows: [
          ['Chat assistant that makes small apps', 'Claude artifacts', 'Quick prototypes, single pages and small tools while you stay in a chat', 'A prototype, not a place to keep customers’ data; sharing and limits depend on your plan'],
          ['AI app builder (describe it, get a live preview, publish)', 'Google AI Studio Build mode, v0', 'Non-coders who want a first working version and a link to share', 'Where the data is kept, what hosting costs after the free part, and how you export your work'],
          ['AI coding agent in a project folder', 'Claude Code, Cursor, Codex', 'More control and bigger projects, for people ready to work with files and code', 'Needs comfort with files, version history and reviewing changes'],
          ['No AI at all', 'A form, a spreadsheet and a shared calendar', 'A concierge MVP that tests whether people care before any build', 'Manual work, so it only suits a handful of users'],
        ],
        caption: 'Choose the lightest kind that can run your first test',
      },
      { type: 'paragraph', text: "Most first-time builders do best starting at the top of this table and moving down only when they hit a limit. The “no AI” row is a real option: if your riskiest assumption is whether people want a booking link at all, you may not need an AI builder yet." },
      {
        type: 'version',
        text: "AI app builders. Google’s documentation describes Build mode in Google AI Studio as a place where you describe an app in natural language and an agent generates it with a live preview. It makes React web apps with a server-side part by default, can publish to Google Cloud Run (Google Cloud costs may apply), can export a ZIP, and supports two-way sync with GitHub. Shared apps are private by default, and apps that use Gemini count toward your own API usage limits. Vercel’s v0 documentation describes v0 as an agent that builds full-stack apps and UIs from plain-language prompts, deploys with one click on Vercel’s infrastructure and can open pull requests. Plans, limits and free allowances change, so read each product’s current page.",
        checked: CHECKED,
        sources: [DOCS.aiStudioBuild, DOCS.v0],
      },
      {
        type: 'version',
        text: "Chat assistants. Anthropic’s help center describes Claude artifacts as things Claude makes for you to put in front of someone, including single-page websites and small interactive tools. They start private to you and sharing is up to you, and anything that calls Claude uses each viewer’s own plan limits. Connected apps and stored data need a Pro or higher plan at the time of checking. Because artifacts live inside Claude’s chat, treat them as prototypes.",
        checked: CHECKED,
        sources: [DOCS.claudeArtifacts],
      },
      {
        type: 'version',
        text: "Coding agents. Claude Code is described as an agentic coding tool that reads a codebase, edits files and runs commands, available in the terminal, in IDEs, in a desktop app and on the web, and most surfaces need a Claude subscription or an Anthropic Console account. Cursor’s docs describe it as a coding agent for understanding a codebase, planning and building features and fixing bugs. OpenAI’s documentation lists Codex as available in the ChatGPT apps, the Codex CLI, an IDE extension and Codex Cloud. Each has its own plans, so check the current pricing page rather than relying on any summary.",
        checked: CHECKED,
        sources: [DOCS.claudeCode, DOCS.cursorDocs, DOCS.codexDocs],
      },
      { type: 'heading', text: 'Six questions before you commit' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Where does my data live, and who can see it?** Customer names and phone numbers are personal data.',
          '**Can I export my work?** You want your files or a copy in a place you control, such as GitHub, so you are never locked in.',
          '**What does it cost when the free part ends?** Look for hosting, database and AI-usage costs, described on the official page.',
          '**Can it save and restore versions?** You will need to go back when a change goes wrong (lesson 7).',
          '**Can it keep secrets safe?** Passwords and API keys must never sit in pages that visitors can read.',
          '**Could someone else continue the project?** A developer later should be able to open what you built.',
        ],
      },
      { type: 'paragraph', text: "Rina records her choice in a short decision note. It names what she considered, what she chose and what would make her change her mind. Write one like this for yourself. It takes five minutes and prevents tool-hopping." },
      {
        type: 'code',
        language: 'text',
        label: 'Tool decision note: Cool Hands Booking',
        code: `TOOL DECISION NOTE (checked 14 Nov 2026)

WHAT I NEED
A mobile-friendly booking page, saved bookings, a password-protected owner page,
a live link I can send to 5 owners. No coding experience.

OPTIONS I CONSIDERED
1. Form + spreadsheet + shared calendar (no AI): cheapest, but customers cannot
   see which slots are full.
2. An AI app builder (Google AI Studio Build mode or v0): live preview, link to share.
3. A coding agent in a project folder: more control, but I do not use a terminal.

DECISION
Option 2: an AI app builder. Reason: no setup, I can see each change, I can send a link.

WHAT I CHECKED ON THE OFFICIAL PAGES
- Can I export the code or sync it to GitHub? Yes / No: ______
- Where are bookings stored and who can read them? ______
- What happens when the free allowance ends? ______

I WOULD SWITCH IF
I cannot keep customer data private, or I hit a limit that stops my test.`,
      },
      { type: 'warning', text: "Do not put real customer information into a tool until you know where it is stored. Build with fake sample bookings, and look at the official page for how the tool treats your data. A shared AI-built app that uses an AI feature can also spend your own usage allowance every time a visitor uses it." },
      {
        type: 'paragraph',
        audience: COMPLETE_BEGINNER,
        text: "If you have never coded, start with an AI app builder or, even simpler, a chat assistant that builds a page, and keep the whole first version inside it. You do not need a terminal, a code editor or an account on a code-sharing website. Hosting just means “a computer that keeps your page online so others can open the link”. An AI app builder usually does this for you. You will ask for changes in everyday sentences and see the result straight away. If you outgrow it later, you can export your work or move it to another tool.",
      },
      {
        type: 'paragraph',
        audience: INTERMEDIATE,
        text: "If you can read a little code, still start with an AI app builder, but make sure it can sync or export to GitHub from day one, and ask it to keep the project in plain, readable files. That gives you version history, the option to open the project in an editor or agent later, and an exit if the free plan stops suiting you. Keep SPEC.md in the repository so any tool you switch to starts from the same decisions.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Treat the tool choice as a build-versus-buy decision with an exit plan. Evaluate lock-in (export format, runtime coupling, hosting), data residency, auth and database access rules, CI and test support, and whether a team can review changes through pull requests. For the first slice, an app builder plus GitHub sync often beats configuring an agent and infrastructure, but record the migration path. Judge tools with the same one-hour task and your own acceptance criteria rather than demos. Check what leaves your machine, which files agents may read, which commands they may run and how secrets are handled before pointing any agent at a real repository.",
      },
      {
        type: 'takeaways',
        items: [
          'Choose by the job: a chat assistant for prototypes, an AI app builder for a first live version, a coding agent for control, and no AI at all for a concierge test.',
          'Start with the lightest kind that can run your first test and move down only when you hit a limit.',
          'Ask six questions: data location, export, cost after free, version history, secrets and handover.',
          'Check plans, limits and data terms on the official page. Product details change often.',
          'Write a short tool decision note so you do not switch tools by impulse.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-06-match-1',
          kind: 'match',
          title: 'Which kind of tool fits?',
          prompt: 'Match each person’s situation with the kind of tool that suits it best.',
          concept: 'choosing a tool for the job',
          labels: { terms: 'Situation', meanings: 'Best-fitting kind of tool' },
          pairs: [
            { term: 'Rina wants five owners to try a booking page by Friday and has never opened a terminal', definition: 'An AI app builder with a live preview and a share link', note: 'She needs a live link fast without setting up files, so an AI app builder suits better.' },
            { term: 'Ana wants a clickable loyalty-card idea to show a cousin this afternoon, with no real data', definition: 'A chat assistant that builds a small page inside the chat', note: 'It is a quick prototype, so a page built in a chat assistant is enough.' },
            { term: 'Paolo has a working booking site in a folder and wants help adding features and running tests across many files', definition: 'A coding agent that works in the project folder', note: 'Many files and tests call for an agent that can read and change a whole project.' },
            { term: 'Mel is unsure anyone will use an online booking link and wants to test it with five customers tomorrow', definition: 'No software yet: a form, a spreadsheet and a calendar done by hand', note: 'The cheapest test of whether people use a link needs no build at all.' },
          ],
          hints: [
            'Match each situation to the lightest kind of tool that can do the job.',
            'Look for words like “this afternoon”, “many files” and “not sure anyone will use it”.',
            'The one with no real data and a short time scale is a prototype; the one who is unsure anyone cares needs no build.',
          ],
          explanation: 'Each answer matches the effort to the need: a share link needs an app builder, a quick look needs a chat prototype, many files need an agent, and a test of whether anyone cares needs no software at all.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-06-tap-1',
          kind: 'tap-reveal',
          title: 'Before you commit to a tool',
          prompt: 'Tap each card to see why the question matters.',
          concept: 'tool checks',
          cards: [
            { front: 'Can I export my work?', back: 'If you can copy your files or sync to a place you control, you can leave. If not, you are locked in.' },
            { front: 'Where is my customers’ data stored?', back: 'Names and phone numbers are personal data. You need to know who can read them and where they live.' },
            { front: 'What costs appear after the free part?', back: 'Hosting, a database and AI usage can each cost money once you share the product widely.' },
            { front: 'Can it go back to an earlier version?', back: 'AI changes sometimes break things. Version history lets you return to the last good copy.' },
          ],
          hints: [],
          explanation: 'Export, data location, later costs and version history are the checks that protect you from lock-in, privacy problems, surprise bills and unrecoverable mistakes.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-06-q1',
        prompt: 'Which choice best fits someone with no coding experience who needs a shareable first version this week?',
        choices: [
          'A coding agent in a terminal, because it gives the most control',
          'An AI app builder that gives a live preview and a link to share',
          'Writing the whole product by hand, because AI tools are not reliable',
          'Waiting until the tools stop changing so the choice is permanent',
        ],
        answer: 1,
        explanation: 'A beginner is best served by the lightest kind of tool that can run the test. An AI app builder avoids setup and produces a link to send.',
      },
      {
        id: 'idea-to-product-06-q2',
        prompt: 'Why is “Can I export my work?” one of the first questions to ask about a tool?',
        choices: [
          'It tells you how fast the tool builds the first version',
          'Exporting is required by law for any app that stores phone numbers',
          'If you cannot take your files, you cannot leave without starting over',
          'Exported files always cost less to host than the tool’s own hosting, because the tool adds a fee',
        ],
        answer: 2,
        explanation: 'Being able to export or sync your work protects you from lock-in. Tools, plans and prices change, so you need a way out.',
      },
      {
        id: 'idea-to-product-06-q3',
        prompt: 'Where should you look for what a tool’s plan includes today?',
        choices: [
          'The tool’s official docs and pricing pages, checked recently',
          'A video from last year that compared the tools and ranked each one by price',
          'An AI assistant’s memory of what each plan offered',
          'A friend’s description of what they remember',
        ],
        answer: 0,
        explanation: 'Plans and limits change often. The official page is the primary source, and checking it with a date keeps your decision current.',
      },
      {
        id: 'idea-to-product-06-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what is “hosting”?',
        choices: [
          'A computer that keeps your page online for others',
          'Inviting friends and customers to test your product during the first week',
          'A tool that writes the spec for you',
        ],
        answer: 0,
        explanation: 'Hosting means keeping your product on a computer that is always on, so anyone with the link can use it. Many AI app builders handle this for you.',
      },
      {
        id: 'idea-to-product-06-q5',
        audience: EXPERIENCED,
        prompt: 'You are choosing between an app builder and a coding agent in a repository for a first slice. Which approach best manages the risk of lock-in?',
        choices: [
          'Prefer whichever has the best demo, and decide on exports once the product has users, since switching later is usually painless',
          'Use the builder with GitHub sync from day one, keep the spec in the repo and record a migration path',
          'Avoid any tool that generates code you did not write line by line',
          'Choose the agent because it will always produce the cleaner architecture',
        ],
        answer: 1,
        explanation: 'Keeping the code in your own repository and recording the exit path keeps the choice reversible. Demos and architecture claims do not protect you if the tool changes.',
      },
    ],
    task: {
      title: 'Choose a tool and write the decision note',
      minutes: 25,
      steps: [
        'Write what you need in two sentences: what the first version must do and who will use it.',
        'Choose one tool from each of two different kinds in the table. Open each one’s official page.',
        'For each, write down the answers to the six questions that you can find on the page, and mark what you could not find.',
        'Write your tool decision note using Rina’s as the pattern, including what would make you switch.',
        'Create an account with the tool you chose and run a five-minute test: ask it for one simple page, with no real data.',
      ],
    },
    taskExtra: [
      { audience: COMPLETE_BEGINNER, steps: ['Ask the AI tool you chose: “Explain in plain words where my page will be stored, who can open it and what I would have to pay for if many people used it.” Check its answer against the official page.'] },
      { audience: EXPERIENCED, steps: ['Run the same one-hour task from your spec in two tools, score both against your acceptance criteria, and record the export path, data location and secret handling for each.'] },
    ],
  },
  {
    id: 'idea-to-product-07',
    day: 7,
    title: 'Build the first version',
    summary: 'Build in small steps with one prompt each, check every step against your spec, keep checkpoints and recover when the AI changes too much.',
    intro: {
      objectives: [
        'Build a first version in small steps, one prompt per step',
        'Check each step against the acceptance criteria and save a checkpoint',
        'Recover when the AI breaks something or gets stuck in a loop of fixes',
      ],
      why: 'The fastest way to a working product is not one giant prompt but a series of small, checked steps. It keeps mistakes cheap, keeps you in control of what the AI changes and leaves you with something you understand.',
    },
    minutes: 30,
    skills: ['ai-building'],
    body: [
      { type: 'paragraph', text: "It is tempting to paste the whole spec and say “build it”. Sometimes that produces something impressive, and then you cannot tell which of its hundred decisions are wrong. A better habit is to build in a sequence of small steps, where each prompt does one thing, you check the result against your spec and you save a copy before moving on. When something breaks, you know which prompt caused it and can return to the last good copy. This lesson shows the loop and gives Rina’s complete prompts." },
      { type: 'heading', text: 'The build loop' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'One small prompt at a time, with a saved copy after every step that passes.',
        source: 'flowchart TD\n  A[Send one small prompt] --> B[Run it and look at it]\n  B --> C[Check the matching acceptance criteria by hand]\n  C --> D{Does it pass?}\n  D -->|Yes| E[Save a checkpoint]\n  E --> F[Next step]\n  F --> A\n  D -->|No| G[Say what you saw and what you expected]\n  G --> A',
      },
      { type: 'paragraph', text: "A **checkpoint** is a saved copy of your product at a moment when it worked. Depending on the tool it may be a version in the tool’s history, a copy you export or a saved commit in GitHub. The tool does not matter as long as you can go back to it. Without a checkpoint, a bad change can cost you the whole afternoon." },
      { type: 'heading', text: 'Choose the order of the steps' },
      { type: 'paragraph', text: "Build the things that are visible first, then the things that need to be correct. Rina builds in five steps. Each one ends with checks from her spec." },
      {
        type: 'table',
        headers: ['Step', 'What gets built', 'Check by hand'],
        rows: [
          ['1', 'Booking and confirmation pages with fake data, nothing saved', 'Criterion 1: can a person finish it on a phone in under 2 minutes?'],
          ['2', 'Saving bookings so they survive a refresh', 'Criterion 6: refresh the owner list and see all bookings'],
          ['3', 'Rules: slots, two bookings per slot, no past dates, phone check', 'Criteria 2, 3 and 4: try to break each rule'],
          ['4', 'Owner page with a password and status buttons', 'Criteria 5 and 7: no password, no data; status survives a refresh'],
          ['5', 'Review against the whole spec, fix, then a privacy check', 'All seven criteria, one by one'],
        ],
        caption: 'Rina’s five build steps',
      },
      { type: 'heading', text: 'Rina’s five prompts, in full' },
      { type: 'paragraph', text: "Each prompt starts from the spec, names the one step and tells the AI what to leave alone. Copy the pattern and swap in your own details." },
      { type: 'prompt', label: 'Step 1: pages with fake data', text: "Here is my spec for a web app:\n\n[paste SPEC.md]\n\nStep 1 only: build the booking page and the confirmation page with fake data held in memory. Do not save anything yet and do not build the owner page. Follow the Pages and Out of scope sections exactly.\n\nWhen you finish, list every file you created and every assumption you made. Do not add anything that is not in the spec." },
      { type: 'prompt', label: 'Step 2: save bookings', text: "Step 2 only: make bookings persist, so they are still there after a page refresh. Use the Data section of the spec for the fields. Do not build the owner page in this step.\n\nTell me in plain words where the bookings are stored and who can read them. Use sample data only." },
      { type: 'prompt', label: 'Step 3: rules', text: "Step 3 only: add the Rules section of the spec: four slots Monday to Saturday, at most two bookings per slot (show “Full” and refuse a third), no past dates, phone number of 11 digits starting with 09. Show a clear message under the field when something is wrong, and save nothing.\n\nEnforce the two-booking limit where bookings are saved, not only on the screen. Tell me how you did that." },
      { type: 'prompt', label: 'Step 4: owner page', text: "Step 4 only: build the owner page from the spec. It must ask for a password before showing any booking details. Keep the password out of the code and out of this chat: use the tool’s secret or environment settings and tell me exactly where I set it.\n\nList bookings by date with the status buttons from the spec. Status changes must still be there after a refresh." },
      { type: 'prompt', label: 'Step 5: review against the spec', text: "Review what you built against my acceptance criteria, one by one. For each criterion write PASS, FAIL or NOT SURE, and tell me exactly how I can check it by hand. Then list anything in the app that someone who is not the owner could read or change. Do not change any code yet." },
      { type: 'warning', text: "Build with fake sample bookings only. Do not put real customers’ names or numbers in until you know where the data is stored and who can read it, and never paste passwords or API keys into a chat. If a tool asks you for a secret, use its settings for secrets." },
      {
        type: 'version',
        text: "If your tool stores data in Supabase, its documentation says to enable Row Level Security on every table in an exposed schema, because a table without it is readable and writable by any role with a grant on it. With Row Level Security on and no policies, no data is available through the API with a publishable key until you create policies. Ask your AI to explain, in plain words, who can read and write each table. The same question applies to any other database the tool sets up for you.",
        checked: CHECKED,
        sources: [DOCS.supabaseRls],
      },
      { type: 'heading', text: 'When it goes wrong' },
      {
        type: 'table',
        headers: ['What you see', 'Likely cause', 'What to do'],
        rows: [
          ['The AI changed screens you did not ask about', 'The prompt was too broad', 'Return to the last checkpoint and repeat with “change only X, do not touch anything else”'],
          ['The same bug comes back after three fixes', 'A cluttered chat or a vague description', 'Write expected versus actual with the exact message, or start a fresh chat with SPEC.md and only this problem'],
          ['A booking disappears after refresh', 'Data was only held on screen', 'Ask “where are bookings stored?” and redo step 2'],
          ['It looks right but a rule fails', 'The rule was checked only on screen', 'Book three times from two devices, then ask for the rule to be enforced where data is saved'],
          ['An error you do not understand', 'Unknown', 'Copy the exact message and ask for a plain-words explanation and a fix limited to that error'],
        ],
        caption: 'A short recovery table to keep open while you build',
      },
      { type: 'tip', text: "Cap yourself at three fix attempts for the same problem in one chat. After that, go back to the checkpoint and describe the problem fresh. Long chats fill with failed attempts, and the AI starts treating them as instructions." },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: a *database* is a place where the product remembers things, like a notebook with one line for each booking. If a booking vanishes on refresh, the product was only “holding it in its head”. A *bug* is something that does not work the way your spec says. An *error message* is the product telling you what went wrong, so copy it exactly, word for word, into the AI. And a *checkpoint* is like saving a copy of a document before you edit it, so a bad edit does not cost you everything. You are not expected to read the code. Your job is to run the product, check it against the list and describe what you see.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Treat each step as a small change set with its own review. Read the diff, not just the preview, and run the tests before accepting. Ask the agent to generate tests from the acceptance criteria and run them. For the capacity rule, write a test that fires concurrent requests at one slot and asserts that only two succeed, and make sure the guarantee lives in storage through a constraint or transaction, not in the client. Keep migrations explicit, separate sample data from real data and keep secrets in environment configuration. Use a branch or checkpoint per step, and cap agent permissions so a prompt cannot touch more than the task requires.",
      },
      {
        type: 'takeaways',
        items: [
          'Build in small steps: one prompt, one result, one check against the spec, then a saved checkpoint.',
          'Build what is visible first (pages with fake data), then saving, rules and the owner view.',
          'Each prompt names the step, points to the spec and says what not to touch.',
          'Use fake data until you know where data is stored and who can read it. Keep secrets out of chats and code.',
          'After three failed fixes, go back to the checkpoint and describe the problem fresh.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-07-scenario-1',
          kind: 'scenario',
          title: 'The fix that keeps breaking things',
          prompt: 'Choose the best way to get unstuck.',
          concept: 'recovering from a build loop',
          situation: 'Rina asked the AI to make a full slot show “Full”. It did, but the confirmation page broke. She asked for a fix and the booking page layout changed. She asked a third time and now the owner page is empty. The chat is very long. She has a checkpoint from an hour ago when pages 1 and 2 worked.',
          options: [
            { text: 'Return to the checkpoint, start a short fresh chat with SPEC.md, describe only the “Full” problem (expected versus actual) and say “change only this and nothing else”.', consequence: 'She gets a clean context, a small request and a working base. The fix is easy to review.', quality: 'best' },
            { text: 'Ask a fourth time, adding “please be careful not to break anything”.', consequence: 'The chat is cluttered with failed attempts, so the AI is likely to repeat the pattern. A polite request does not fix a long, confused context.', quality: 'acceptable' },
            { text: 'Tell the AI to rebuild the whole app from scratch.', consequence: 'She loses working pages and is back to guessing which of the AI’s many new decisions are right.', quality: 'poor' },
            { text: 'Keep going: the booking page mostly works, so ship it and fix the rest later.', consequence: 'Real customers would meet a broken confirmation and an empty owner page. She would learn about the build, not the product.', quality: 'poor' },
          ],
          hints: [
            'How many fix attempts has she made, and what has happened to the chat?',
            'She has a checkpoint. What is it for?',
            'The best answer returns to the working version, uses a clean chat and asks for one change.',
          ],
          explanation: 'After three failed fixes the chat is cluttered and the working version is the safest base. A fresh chat with the spec and one precise, limited request gives the AI a clear job and gives Rina a reviewable result.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-07-tap-1',
          kind: 'tap-reveal',
          title: 'What to check after each step',
          prompt: 'Tap each build step to see what to check by hand before moving on.',
          concept: 'checking a build',
          cards: [
            { front: 'Step 1: pages with fake data', back: 'Open it on a phone. Can you finish a booking in under two minutes? Does the confirmation page show the right day and slot?' },
            { front: 'Step 2: saving bookings', back: 'Make a booking, refresh the page and open the list. Is the booking still there?' },
            { front: 'Step 3: rules', back: 'Try to break each one: book a third time in a full slot, pick a past date, type a short phone number. Is each refused with a clear message?' },
            { front: 'Step 4: owner page', back: 'Open it without the password. Do you see anything? Change a status and refresh. Does it stay?' },
          ],
          hints: [],
          explanation: 'Every step has a matching hand check taken from the spec’s acceptance criteria. Running them straight after the step finds a mistake while only one prompt is to blame.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-07-q1',
        prompt: 'Why build in small steps instead of pasting the whole spec into one prompt?',
        choices: [
          'Each step is small enough to check, so a mistake is found while it is easy to undo',
          'AI tools refuse prompts longer than a few lines, so the spec has to be split into separate chats',
          'Smaller prompts always cost less money than a single large prompt',
          'The AI writes better code when it is not told what the product is for',
        ],
        answer: 0,
        explanation: 'Small steps keep each change reviewable and tied to specific checks. A giant prompt produces many decisions at once and you cannot tell which are wrong.',
      },
      {
        id: 'idea-to-product-07-q2',
        prompt: 'A step finishes and looks fine. What should you do before sending the next prompt?',
        choices: [
          'Ask the AI to confirm that it did everything correctly and trust its answer',
          'Check the matching criteria by hand, then save a checkpoint to return to',
          'Add the next three steps to the same prompt to save time',
          'Share the link with your first users straight away to get faster feedback',
        ],
        answer: 1,
        explanation: 'The AI’s confidence is not a test. Your hand checks from the spec show whether it works, and a checkpoint gives you a safe place to return.',
      },
      {
        id: 'idea-to-product-07-q3',
        prompt: 'After a refresh, the booking you just made has vanished. What is the most likely cause?',
        choices: [
          'The phone number was in the wrong format and was deleted',
          'The AI tool has a daily limit on how many bookings it can show',
          'The booking page was built on a different day from the owner page, so the two do not match',
          'The bookings are held only on the screen and are not saved anywhere yet',
        ],
        answer: 3,
        explanation: 'Data held only in the page disappears on refresh. Saving it is a separate step, which is why step 2 exists and why you test with a refresh.',
      },
      {
        id: 'idea-to-product-07-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what is a database?',
        choices: [
          'A drawing or sketch of how the pages and buttons should look on a phone',
          'A list of all the tools you have tried and what each one cost you',
          'A place where the product remembers things, like a notebook of bookings',
        ],
        answer: 2,
        explanation: 'A database stores information so it is still there later, after a refresh or when someone else opens the product.',
      },
      {
        id: 'idea-to-product-07-q5',
        audience: EXPERIENCED,
        prompt: 'How do you verify that a two-bookings-per-slot limit holds when two customers submit the last place at once?',
        choices: [
          'Click the button twice quickly on your own phone and watch the screen to see whether a second booking appears',
          'Ask the agent whether the rule is enforced and accept a confident yes as proof the limit holds under load',
          'Test with concurrent requests at one slot and assert only two succeed, with the limit enforced in storage',
          'Hide the booking button as soon as a slot shows one place left',
        ],
        answer: 2,
        explanation: 'A concurrency guarantee has to be demonstrated under concurrent load, and it can only be enforced where the data is written. A confident reply or a hidden button proves nothing.',
      },
    ],
    task: {
      title: 'Build step one and check it',
      minutes: 25,
      steps: [
        'Open the tool you chose in lesson 6 and paste your SPEC.md. Send the Step 1 prompt (adapted to your product) with fake data only.',
        'Run the result on your phone. Do the checks that match: can you finish the main job in about two minutes?',
        'Write down what passed, what failed and what the AI assumed. Fix one problem using “change only X”.',
        'Save a checkpoint: a version in the tool’s history, an export or a GitHub commit. Write its name and the date in a notes file.',
        'If time remains, send the Step 2 prompt and check it with a refresh.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['After each step, ask the AI: “Explain in plain words what you just changed and what I should see on screen.” Compare its answer with what you actually see.'] },
      { audience: EXPERIENCED, steps: ['Have the agent write automated tests for the first three acceptance criteria before building step 3, run them in CI or locally and attach the output to your notes.'] },
    ],
  },
  {
    id: 'idea-to-product-08',
    day: 8,
    title: 'Put it in front of real users',
    summary: 'Choose your first five users, invite them with a clear ask, watch them use it without helping, and share it safely.',
    intro: {
      objectives: [
        'Choose five first users who have the problem and will tell you the truth',
        'Invite them with a clear, small ask and a note on what you collect',
        'Run an observed session without helping, and pick a safe way to share your product',
      ],
      why: 'Nothing you have done so far shows whether the product works for a real person. Five honest users, watched while they try it, teach you more in one week than a month of private polishing.',
    },
    minutes: 25,
    skills: ['user-testing'],
    body: [
      { type: 'paragraph', text: "A first launch is not a public launch. It is five real people, with the problem you chose, using your first version for a real task while you pay close attention. Do not announce it widely and do not polish it for weeks. You are looking for the places where a person gets stuck, and you cannot find those alone, because you know too much about your own product." },
      { type: 'heading', text: 'Choose your first five' },
      { type: 'paragraph', text: "A good first user has the problem, was willing to give you time in an interview and will tell you the truth. The worst first users are the people who love you and will say “great job!” whatever happens. Rina’s list comes from the conversations in lesson 3. Notice that every name has a reason, and that Rina herself, as “user zero”, does not count toward the five." },
      {
        type: 'table',
        headers: ['User', 'Who', 'Why they are on the list', 'The real job they will do'],
        rows: [
          ['U1', 'Laundry shop owner', 'Agreed in the interview to try a simple page', 'Take pickup bookings from customers'],
          ['U2', 'Massage therapist', 'Introduced two other therapists; loses time confirming by text', 'Take appointments and cut no-shows'],
          ['U3', 'Therapist, introduced by U2', 'Has the same problem, found through a referral', 'Take appointments'],
          ['U4', 'Therapist, introduced by U2', 'Has the same problem, found through a referral', 'Take appointments'],
          ['U5', 'Plumber', 'Said “sounds nice” but no commitment, so a useful honest test', 'Take repair visit bookings'],
        ],
        caption: 'Rina keeps one person who was only polite, because they will show whether interest turns into use',
      },
      { type: 'heading', text: 'The invitation' },
      { type: 'paragraph', text: "Make the ask small, concrete and time-limited, and tell people what happens to the information they enter. Do not say “let me know what you think”. Say what you want them to do and when you will talk." },
      {
        type: 'code',
        language: 'text',
        label: 'Invitation message to a first user',
        code: `Hi Ate Grace, here is the simple booking page I mentioned: [link].
Could you try it for the next two weeks with your real customers? It is
free during the test. It saves only each customer's name, phone, address and
the slot they pick, and only I can see it.

It is very simple and may have problems. That is exactly what I want to
find. Could I take 15 minutes next Friday to ask how it went? And if you
are okay with it, I would like to watch you or a customer use it once.
Thank you!`,
      },
      {
        type: 'warning',
        text: "You are asking real people to enter real customers’ details. Say what you collect and why, collect only what the spec lists and keep access to the owner. Use the minimum, delete test data when the test ends and, if you are in the Philippines, remember that the Data Privacy Act (Republic Act No. 10173) covers personal data. Check your country’s official guidance before you collect data from people outside your circle.",
      },
      { type: 'heading', text: 'Watch one person use it' },
      { type: 'paragraph', text: "An **observed session** is the most useful 10 minutes in this course. You give someone a real task and watch what they do. The hardest part is staying quiet." },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Give a task, not instructions.** “Book a cleaning for next Saturday afternoon for two units.” Do not say where to click.',
          '**Ask them to think aloud.** “Tell me what you are looking at and what you expect to happen.”',
          '**Say nothing and do not help.** If they struggle, that is the data. Note how long they pause and where.',
          '**Write what they do, not what you think.** “Paused 25 seconds at units, typed the number into the phone box.”',
          '**Ask afterwards, not during.** “What did you expect to happen when you pressed that?”',
        ],
      },
      { type: 'heading', text: 'Ways to share your product' },
      {
        type: 'table',
        headers: ['Way', 'Good for', 'Watch out for'],
        rows: [
          ['A link to your web app (from your AI builder)', 'The quickest way to reach any phone', 'Check who can open it, and what it stores'],
          ['GitHub Pages', 'A static smoke-test page that describes your promise and collects interest', 'It hosts static files and has no server of its own, so a page there cannot save bookings by itself'],
          ['iPhone test builds (TestFlight)', 'When the product has to be an iPhone app', 'External testing may need a review of the first build, and builds expire'],
          ['Android closed testing', 'When the product has to be an Android app', 'New personal developer accounts must meet a testing requirement before a public release'],
        ],
        caption: 'For a first test, a web link beats an app store almost every time',
      },
      {
        type: 'version',
        text: "GitHub’s documentation describes GitHub Pages as a static site hosting service that publishes websites from files in a repository. Apple’s TestFlight overview says you can invite up to 10,000 external testers, that external testing may require a review of the first build and that a build can be tested for up to 90 days. Google’s Play Console help says personal developer accounts created after 13 November 2023 must run a closed test with at least 12 testers opted in continuously for 14 days before applying for production access. Rules change, so read the current pages before planning a mobile test.",
        checked: CHECKED,
        sources: [DOCS.githubPages, DOCS.testflight, DOCS.playTesting],
      },
      { type: 'paragraph', text: "Before you invite anyone, decide what you will count. Keep it to a handful of things you can see without special software: did they open it, did they pick a slot, did they submit a booking, did they come back. The next lesson turns these into a feedback log." },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: a *link* is the web address you send in Messenger so that people can open your product on their phone. A *test* means a small, time-limited try-out with a handful of people, not a big public launch. An *observed session* is simply sitting beside someone (or on a video call) while they use your product for a real job, saying as little as possible. It feels uncomfortable to watch someone struggle without helping, like not telling a friend where the exit is, but their confusion shows you exactly what to fix. If you cannot do it in person, ask permission to watch a call with their screen shared.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Prepare instrumentation before the first invite: a short event list along the main path (opened, slot picked, submitted, confirmed, returned), a non-personal identifier per user and separation between test data and real bookings. Decide consent and retention up front and keep personal data out of analytics properties. For a larger cohort, stage the rollout, add error monitoring and give people a way to reach you. With only a handful of users, qualitative observation will explain more than the numbers, so schedule sessions as carefully as you schedule releases. Write down your hypothesis for the cohort before they start, so you cannot reinterpret the results afterwards.",
      },
      {
        type: 'takeaways',
        items: [
          'A first launch is five real people with the problem, not a public announcement.',
          'Choose users who have the problem and will tell you the truth, not friends who will only be kind.',
          'Make the ask small and time-limited, say what data you collect and keep it to the minimum.',
          'Watch an observed session: give a task, stay quiet, write down what they do and ask what they expected afterwards.',
          'For a first test, a web link is usually better than an app store.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-08-scenario-1',
          kind: 'scenario',
          title: 'Who gets the first five invitations?',
          prompt: 'Choose the best way to pick the first five users.',
          concept: 'choosing first users',
          situation: 'Aling Marites’s tailoring shop in Iloilo has a new fitting-booking page. She has several possible first users: her five closest friends who say “we’ll support you”, three tailors who agreed in interviews to try it and two more tailors they introduced, a big Facebook group where she could post and take the first five replies, or five names from a random business list.',
          options: [
            { text: 'The three tailors who agreed to try it and the two they introduced, because all five have the problem and have shown willingness to give time.', consequence: 'They are the right people with the right problem, and the introductions come with some trust. They are likely to be honest.', quality: 'best' },
            { text: 'Her five closest friends, since they will respond fastest.', consequence: 'They will be kind and fast but they may not have the problem. Their praise will feel like proof and prove nothing.', quality: 'poor' },
            { text: 'Whoever replies first in the big group.', consequence: 'Fast, but the first repliers are often the curious, not the people with the problem, so the results will be hard to read.', quality: 'acceptable' },
            { text: 'Five names from a random business list, cold messaged.', consequence: 'Cold contacts rarely respond and have no reason to try it, so she may get no real use at all.', quality: 'poor' },
          ],
          hints: [
            'Who has the problem and has already given some time?',
            'People who love you are the least reliable testers of your idea.',
            'The best group has the problem, a reason to try it and no reason to flatter you.',
          ],
          explanation: 'First users should have the problem, show willingness and be free to tell the truth. The tailors from interviews and their referrals match; friends and random lists do not.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-08-tap-1',
          kind: 'tap-reveal',
          title: 'What to say when a user is stuck',
          prompt: 'During an observed session, tap each thing a user says to see what to answer.',
          concept: 'observed sessions',
          cards: [
            { front: '“Where do I click?”', back: 'Say: “What would you try?” Their guess shows you what the screen is telling them.' },
            { front: '“Is this right?”', back: 'Say: “What did you expect to happen?” Do not confirm. Their expectation is the data.' },
            { front: '“Oh, this is confusing, sorry!”', back: 'Say: “That helps. Tell me what is confusing.” They are doing you a favour, not failing.' },
            { front: '[They stop and look at you for a long time]', back: 'Stay quiet a little longer and note how many seconds pass. Only help if they ask to stop.' },
          ],
          hints: [],
          explanation: 'Your job in an observed session is to learn, not to teach. Turning each question back to the user keeps their thinking visible.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-08-q1',
        prompt: 'Which people make the best first five users?',
        choices: [
          'Your closest friends, because they will respond quickly and kindly, and will not be shy about helping',
          'Anyone who replies first to a public post, so you start fast',
          'People who follow your social accounts and have liked your posts',
          'People who have the problem, gave you time in interviews and will tell you the truth',
        ],
        answer: 3,
        explanation: 'First users must have the real problem and a reason to try the product for a real job. Friends and followers are kind, which hides problems.',
      },
      {
        id: 'idea-to-product-08-q2',
        prompt: 'During an observed session a user gets stuck for a long time. What should you do?',
        choices: [
          'Point to the right button so they do not feel embarrassed and the session can stay friendly and quick',
          'Explain how the page is meant to work',
          'Stay quiet, note where and how long they pause, and ask afterwards what they expected',
          'Stop the session and fix the page before continuing',
        ],
        answer: 2,
        explanation: 'The struggle is the finding. Helping hides it, and asking afterwards what they expected explains it.',
      },
      {
        id: 'idea-to-product-08-q3',
        prompt: 'Which statement about GitHub Pages is true, according to its documentation?',
        choices: [
          'It runs server code, so it can save bookings by itself',
          'It is static site hosting that publishes a website from files in a repository',
          'It is a testing channel for iPhone apps',
          'It requires every visitor to sign in with a GitHub account before the pages will open',
        ],
        answer: 1,
        explanation: 'GitHub describes Pages as static site hosting from a repository. Static means no server code of its own, so it suits a smoke-test page more than a booking tool.',
      },
      {
        id: 'idea-to-product-08-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what is an “observed session”?',
        choices: [
          'Watching a real person try your product for a real task while you take notes',
          'Asking friends to rate your product from one to ten',
          'Showing your product to a stranger and explaining every button on every screen as they go',
        ],
        answer: 0,
        explanation: 'An observed session is about watching, not explaining. What people do when you stay quiet shows you what to fix.',
      },
      {
        id: 'idea-to-product-08-q5',
        audience: EXPERIENCED,
        prompt: 'Which preparation before inviting the first cohort best supports learning from it?',
        choices: [
          'A polished design system so users judge the product fairly',
          'A paid advertising campaign so the cohort is large enough to be significant',
          'A few named events, a non-personal user id, consent and retention decided, and a written cohort hypothesis',
          'A public announcement so the product gets feedback from as many people as possible as soon as it goes live',
        ],
        answer: 2,
        explanation: 'Measurable behaviour, privacy handled and a hypothesis fixed beforehand let you interpret what happens. Polish and volume do not tell you what to learn.',
      },
    ],
    task: {
      title: 'Choose your five and run one session',
      minutes: 25,
      steps: [
        'Write your list of five first users: who, why they are on it and the real job they will do. Include at least two people from your interviews.',
        'Adapt the invitation message. Say what you collect and who can see it, then send it to your five.',
        'Run one observed session in person or on a video call with permission. Give a real task, say nothing and write down what they do, with pauses in seconds.',
        'After the session ask only: “What did you expect to happen when you pressed that?” and note the answer.',
        'Write down the top three things that confused them. Do not fix anything yet.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['Before the session, practise with a friend and ask them to stop you every time you start to explain something. Notice how often you want to help.'] },
      { audience: EXPERIENCED, steps: ['Write the cohort hypothesis and the event list you will log. Run a dry session on a staging copy to confirm each event fires and no personal data lands in analytics properties.'] },
    ],
  },
  {
    id: 'idea-to-product-09',
    day: 9,
    title: 'Learn from what they do',
    summary: 'Keep one feedback log, separate what users say from what they do, read small numbers honestly and find the pattern that matters most.',
    intro: {
      objectives: [
        'Record what users did and said in one feedback log',
        'Separate behaviour, requests and politeness, and spot patterns across different people',
        'Read results from five users honestly, without false precision',
      ],
      why: 'Five users produce a pile of comments and a few numbers. Without a method, you chase the loudest request. A simple log and a few honest rules turn the pile into one clear next step.',
    },
    minutes: 30,
    skills: ['user-testing'],
    body: [
      { type: 'paragraph', text: "After a week or two of real use you will have many small pieces of information: things you saw in sessions, messages, booking records and comments in passing. If they stay in your head or in scattered chats, you will remember the dramatic ones and forget the repeated ones. The cure is a single **feedback log** where everything lands in the same format, plus a few rules for reading it. Five users will not give you statistics. They will give you stories and patterns, and that is exactly what you need at this stage." },
      { type: 'heading', text: 'One feedback log for everything' },
      { type: 'paragraph', text: "Each row is one observation: who, where it came from, what happened, and what kind of thing it was. Tag the type so you can separate what people **did** from what they **asked for**. Here is part of Rina’s log after two weeks. Everything in it is invented for teaching." },
      {
        type: 'table',
        headers: ['ID', 'Who', 'Source', 'What happened or was said', 'Type'],
        rows: [
          ['F1', 'U1', 'Observed', 'Paused 25 seconds at “units”, then typed “2 units” into the phone number box', 'Confusion'],
          ['F2', 'U1', 'Booking record', '5 real bookings in the first two weeks', 'Behaviour'],
          ['F3', 'U2', 'Observed', 'Finished a booking in 1 minute 40 seconds, no help', 'Success'],
          ['F4', 'U2', 'Booking record', '4 real bookings in two weeks', 'Behaviour'],
          ['F5', 'U3', 'Observed', 'Closed the page before the confirmation and asked “did it go through?”', 'Confusion'],
          ['F6', 'U3', 'Booking record', '1 real booking in two weeks', 'Behaviour'],
          ['F7', 'U4', 'Message', '“Looks great! Can customers pay here too?”', 'Request'],
          ['F8', 'U4', 'Booking record', '0 real bookings in two weeks', 'Behaviour'],
          ['F9', 'U5', 'Observed', 'Tapped a slot marked “Full” twice and thought the page was broken', 'Confusion'],
          ['F10', 'U5', 'Booking record', '2 real bookings in two weeks', 'Behaviour'],
        ],
        caption: 'A feedback log row says who, where it came from, what happened and what kind it was',
      },
      { type: 'paragraph', text: "Notice that F7 is a compliment and a request with no use behind it (U4 made no bookings). Notice also that the log includes the people who did not use it. Those are the most valuable rows." },
      { type: 'heading', text: 'Look for patterns across different people' },
      { type: 'paragraph', text: "A pattern is something that happened to more than one person. Count how many different people, not how many comments. Rina’s patterns, from the ten rows and her other notes:" },
      {
        type: 'table',
        headers: ['Pattern', 'How many of 5', 'What it tells her'],
        rows: [
          ['Hesitated or entered the wrong thing at “units”', '3 of 5', 'A confusing field, seen in behaviour. Fix this first.'],
          ['Unsure the booking went through, or confused by “Full”', '3 of 5', 'Feedback on screen is unclear. Fix after units.'],
          ['Took 3 or more real bookings in two weeks', '2 of 5 (target was 3 of 5)', 'The target was missed. The problem is not solved for everyone yet.'],
          ['Asked for payments or automatic reminders', '2 and 2 of 5', 'Requests, not behaviour. Note them, but do not build yet.'],
        ],
        caption: 'Counts of different people, not comments, show what matters',
      },
      { type: 'heading', text: 'Say versus do' },
      { type: 'paragraph', text: "When what people say and what they do disagree, trust what they do. Both are useful, but they answer different questions." },
      {
        type: 'table',
        headers: ['What they said', 'What they did', 'What to believe'],
        rows: [
          ['“I love it, it’s great!”', 'Made no bookings in two weeks', 'They were being polite. Find out why they did not use it.'],
          ['“It’s a bit confusing”', 'Finished the form in under two minutes', 'A small annoyance. Keep an eye on it.'],
          ['“I need a loyalty points feature”', 'Booked five times without it', 'A wish, not a blocker. Note it and wait for more people to ask.'],
        ],
        caption: 'Behaviour beats opinion',
      },
      { type: 'heading', text: 'Read small numbers honestly' },
      {
        type: 'list',
        items: [
          '**Report counts, not percentages.** “3 of 5” is honest. “60%” sounds like measurement. With five users, one person moves the number by 20 points.',
          '**Look for direction, not proof.** Five users can tell you something is badly wrong or promising. They cannot tell you the exact rate.',
          '**Study the people who did not use it.** Ask them why. Their reasons are your biggest lesson.',
          '**The loudest request is not the biggest problem.** One person asking for loyalty points is a request. Three people stumbling on the same field is a problem.',
        ],
      },
      { type: 'prompt', label: 'Ask an AI to sort the log without inventing', text: "Here is my feedback log from five first users: [paste the log, with names replaced by codes].\n\nGroup the rows into patterns. For each pattern give: a short name, how many different people it includes (not how many comments), two short verbatim quotes or facts from the log, and whether it is behaviour, a request or a confusion. Flag any pattern that comes from only one person.\n\nDo not invent comments or numbers. Then list three questions I should ask the users who made the fewest bookings." },
      { type: 'warning', text: "Do not paste real names, phone numbers or addresses into an AI tool. Replace people with codes (U1, U2) and remove anything that identifies a customer before asking for a summary." },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: *analytics* just means counting what people did, like how many opened the page and how many finished a booking. You do not need special software at this stage. Your owner page already lists the bookings, so you can count them yourself, and a short Google Form can ask “What was the hardest part?”. The log is your notebook, one line per thing you saw or heard. A *pattern* is something that happened to more than one person, like three people being unsure at the same box. Patterns tell you what to fix. One person’s opinion tells you what to keep an eye on.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Instrument the main path with a handful of named events and a non-personal user id, so the log can sit beside the numbers. Define the funnel in advance (opened, slot picked, submitted, confirmed, returned within seven days) and read it alongside session notes. With a first cohort, treat the funnel as diagnostic, not statistical: a conversion difference between two variants needs far more traffic than a handful of users, so avoid A/B tests until traffic can support them. Code qualitative notes for themes after the fact and keep disconfirming evidence visible. Never place names, phone numbers or addresses in event properties.",
      },
      {
        type: 'version',
        text: "If your product is a web app on Vercel, its Web Analytics can record custom events with a track call, for example a booking being submitted. Vercel’s documentation says custom events are available on its Pro and Enterprise plans, that properties can be strings, numbers, booleans or null (nested objects are not supported) and that event names and values are limited to 255 characters. Other analytics tools work similarly, and plans change, so check the current page.",
        checked: CHECKED,
        sources: [DOCS.vercelEvents],
        plans: 'Custom events need a paid plan at the time of checking; free plans have limits on analytics events.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Two custom events, recorded where the action happens',
        audience: EXPERIENCED,
        code: "import { track } from '@vercel/analytics';\n\n// After the customer picks a slot\ntrack('Slot picked', { slot: '10-12', units: 2 });\n\n// After the booking is saved. No name, phone or address in properties.\ntrack('Booking submitted', { units: 2, source: 'link' });",
      },
      {
        type: 'takeaways',
        items: [
          'Keep one feedback log: who, source, what happened and the type (behaviour, confusion, request, success).',
          'Count how many different people share a pattern, not how many comments you heard.',
          'When say and do disagree, trust what people did, and study the ones who did not use it.',
          'Report counts like “3 of 5”, not percentages, and treat five users as direction, not proof.',
          'One person’s request is a note. A pattern that blocks the one job is a problem to fix.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-09-match-1',
          kind: 'match',
          title: 'What does this row in the log mean?',
          prompt: 'Match each observation from a feedback log to what it most likely means and what to do with it.',
          concept: 'reading feedback',
          labels: { terms: 'Observation', meanings: 'What it means' },
          pairs: [
            { term: 'Three of five users paused at the same box and one typed in the wrong field', definition: 'A real pattern seen in behaviour: fix this first', note: 'Three different people and observed behaviour make this a pattern rather than an opinion.' },
            { term: 'One owner asks for a loyalty points feature, but has booked five times already', definition: 'A request from one person: note it and wait for more', note: 'A single request from someone who is already using the product is a wish, not a blocker.' },
            { term: 'Two owners say “looks great!” and made no bookings in two weeks', definition: 'Politeness: what they did contradicts what they said, so ask why', note: 'Praise without use is the polite answer. The missing bookings are the real data.' },
            { term: 'A user made four real bookings in three days without any prompting from you', definition: 'Real use: strong evidence that it does the job for that person', note: 'Unprompted repeat use costs the person time and shows the product is working for them.' },
          ],
          hints: [
            'Ask what each person actually did, and how many different people did it.',
            'One person asking is a request; several people struggling in the same place is a problem.',
            'Praise with no use is politeness, and repeated unprompted use is the strongest signal.',
          ],
          explanation: 'The log is read by behaviour and by the number of different people: several people stuck in one place is a problem, one request is a note, praise without use is politeness, and unprompted repeat use is real evidence.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-09-scenario-1',
          kind: 'scenario',
          title: 'Say or do?',
          prompt: 'Choose the best conclusion and next step.',
          concept: 'behaviour over opinion',
          situation: 'At the end of week two, all five of Rina’s users said they like the booking page. Only two of the five took three or more real bookings (the target was three of five). Two users asked whether customers can pay online. Three users hesitated at the “units” box in sessions.',
          options: [
            { text: 'The target was missed. Ask the three who barely used it why, fix the units box first, and do not build payments until more people ask.', consequence: 'She follows behaviour, fixes the pattern that blocks the job and avoids building a feature only two people mentioned.', quality: 'best' },
            { text: 'Count it a success: all five said they like it.', consequence: 'Praise is cheap and three people did not use it. She would build on a belief the data does not support.', quality: 'poor' },
            { text: 'Build online payments, since two of five asked for it.', consequence: 'It is a request, not a blocker, and it would add a large feature while the main job is still half-working.', quality: 'poor' },
            { text: 'Wait two more weeks and change nothing, to collect more data.', consequence: 'Waiting while a known confusing field stays unfixed wastes the cohort. The pattern is already clear enough to act on.', quality: 'acceptable' },
          ],
          hints: [
            'Compare the target with what people did, not with what they said.',
            'Which problem was seen in behaviour by three different people?',
            'A request from two people is a note; a blocked job is a fix.',
          ],
          explanation: 'The target was missed, and three people stumbled on the same field. The clear next step is to ask the non-users why and fix the blocking pattern, while leaving the two payment requests as notes.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-09-q1',
        prompt: 'A user says “I love it” but made no bookings in two weeks. What deserves more weight?',
        choices: [
          'What they said, because users know best how they feel about the product',
          'What they did, because behaviour costs effort and opinions cost nothing',
          'Both equally, because an average of the two is the fairest reading',
          'Neither, because a single user can never tell you anything',
        ],
        answer: 1,
        explanation: 'Praise is free and bookings are not. When words and actions disagree, the action is the better evidence, and the gap is worth asking about.',
      },
      {
        id: 'idea-to-product-09-q2',
        prompt: 'Three of five users stumbled at the same field, and one asked for a new feature. What should you do first?',
        choices: [
          'Build the new feature, because requests show what customers want',
          'Rewrite the whole page so no field can confuse anyone',
          'Fix the field three different people stumbled on, and note the feature request for later',
          'Ask all five users to vote on which of the two to do first and build whichever one wins the vote',
        ],
        answer: 2,
        explanation: 'A pattern across several people that blocks the main job comes before a single request. A vote of five people is just five opinions.',
      },
      {
        id: 'idea-to-product-09-q3',
        prompt: 'Why report “3 of 5 users” instead of “60% of users”?',
        choices: [
          'Percentages are not used in product work',
          'The AI tools cannot calculate percentages reliably',
          'Counts are shorter to write in a feedback log and fit better in a spreadsheet cell, which is why they are preferred',
          'One person moves the figure by 20 points, so a percentage claims more precision than the data has',
        ],
        answer: 3,
        explanation: 'Small samples give direction, not precise rates. A raw count keeps the true size of the evidence visible.',
      },
      {
        id: 'idea-to-product-09-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what is a “pattern” in a feedback log?',
        choices: [
          'A design style used throughout the product',
          'Anything the founder personally finds interesting or surprising while reading the notes',
          'A comment the loudest user repeated several times',
          'Something that happened to several people, like three people confused at the same box',
        ],
        answer: 3,
        explanation: 'A pattern is counted across different people. It tells you what to fix, while a single person’s opinion tells you what to watch.',
      },
      {
        id: 'idea-to-product-09-q5',
        audience: EXPERIENCED,
        prompt: 'Which instrumentation plan best fits a first cohort of 5 to 10 users?',
        choices: [
          'Log a few named events with a non-personal user id, read them beside session notes, and keep personal data out of properties',
          'Record everything the user does, including names and phone numbers, so no question is left unanswered later when you review it at the end of the month',
          'Run an A/B test on the main button to find the statistically best colour',
          'Skip analytics until there are a thousand users, since smaller samples cannot be analysed',
        ],
        answer: 0,
        explanation: 'A small cohort needs diagnostic events beside qualitative notes. Over-collecting personal data creates risk, A/B tests need far more traffic and waiting loses the early signal.',
      },
    ],
    task: {
      title: 'Build your feedback log and find the pattern',
      minutes: 25,
      steps: [
        'Create a table with the columns ID, Who (a code), Source, What happened or was said, Type.',
        'Add every observation from your sessions, messages and booking records. Include the users who did not use the product.',
        'Count the patterns by how many different people they include. Write each as “N of 5”.',
        'Compare your success measure from lesson 4 with what actually happened. Write one sentence: met, missed or unclear.',
        'Pick the one pattern that blocks the one job most often. That is your first change in lesson 10.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['Send each user who barely used it a two-question Google Form: “What was the hardest part?” and “What did you do instead?” Add their answers to the log.'] },
      { audience: EXPERIENCED, steps: ['Add the event funnel (opened, slot picked, submitted, confirmed, returned) next to the log, and tag each row with the user’s segment so you can see whether a pattern is specific to one group.'] },
    ],
  },
  {
    id: 'idea-to-product-10',
    day: 10,
    title: 'Iterate on purpose',
    summary: 'Turn one pattern into one change with a hypothesis, a measure and a way back, and keep a changelog so you always know what helped.',
    intro: {
      objectives: [
        'Choose the one change that most helps users do the one job',
        'Write a hypothesis with a measure and a rollback before making a change',
        'Keep a changelog and checkpoints so you can tell what helped',
      ],
      why: 'After feedback it is tempting to fix everything at once. Changing one thing on purpose, and measuring it, is how you find out what actually helps, instead of hoping that a pile of changes did.',
    },
    minutes: 25,
    skills: ['iteration-decisions'],
    body: [
      { type: 'paragraph', text: "Iterating means improving the product in a series of deliberate changes, each one based on evidence. It does not mean fixing every comment, adding the loudest request or polishing until it feels done. If you change six things at once and the numbers improve, you will not know which change mattered. If they get worse, you will not know which to undo. The discipline of this lesson is simple: one pattern, one change, one measure, and a way back." },
      { type: 'heading', text: 'The iteration loop' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Each loop answers one question: did this change help the one job?',
        source: 'flowchart TD\n  A[Pick the pattern that blocks the one job most] --> B[Write a hypothesis and a measure]\n  B --> C[Make one change and save a checkpoint]\n  C --> D[Test with the next users]\n  D --> E{Did the measure move?}\n  E -->|Yes| F[Keep it and log it]\n  E -->|No| G[Revert or try a different change]\n  F --> A\n  G --> A',
      },
      { type: 'heading', text: 'Choose what to change first' },
      { type: 'paragraph', text: "Rank everything in your feedback log by two questions: how many different people did it affect, and does it block the one job? A confusing field that stops bookings beats a polite request for a new feature. Here is Rina’s ranking from the log in lesson 9." },
      {
        type: 'table',
        headers: ['Item', 'Seen in', 'Blocks the one job?', 'Effort', 'Decision'],
        rows: [
          ['Units box confuses people', '3 of 5', 'Yes, it causes wrong entries', 'Small', 'Do first'],
          ['Confirmation and “Full” unclear', '3 of 5', 'Partly, people doubt the booking', 'Small', 'Do next, after units'],
          ['Automatic reminders', '2 of 5 asked', 'No, Rina sends them by hand', 'Large', 'Wait'],
          ['Online payments', '2 of 5 asked', 'No, bookings work without it', 'Large', 'Wait'],
          ['Loyalty points', '1 of 5 asked', 'No', 'Large', 'Not now'],
        ],
        caption: 'The loudest requests are the biggest jobs and the smallest evidence',
      },
      { type: 'heading', text: 'Write the change as a hypothesis' },
      { type: 'paragraph', text: "A hypothesis ties a change to a measurable result: “If we change this, then these people will do that, which we will see in this number within this time.” It forces you to decide in advance what success looks like. Add a rollback plan, because not every change helps. Here is Rina’s complete plan for iteration 1." },
      {
        type: 'code',
        language: 'text',
        label: 'Iteration plan 1: units field',
        code: `ITERATION 1 PLAN

PATTERN SEEN
3 of 5 users hesitated or typed the wrong thing at the "units" box (F1, F9, F12).

HYPOTHESIS
If the units box becomes a stepper labelled "How many aircon units?"
starting at 1, then the next customers will pick their units without
hesitating, as shown by observed sessions and bookings with a valid number.

THE CHANGE (one thing)
Replace the units text box with a stepper (minimum 1, maximum 6).
Change nothing else.

MEASURE (next 5 observed bookings, over one week)
0 pauses longer than 5 seconds at units, and 0 bookings with an invalid
units value.

ROLLBACK
If the measure does not improve, restore checkpoint "v1.0" and try a
different change.

NOT CHANGING NOW (noted for later)
Online payments (2 of 5 asked), automatic reminders (2 of 5 asked),
loyalty points (1 of 5 asked). Confirmation page: iteration 2.`,
      },
      { type: 'prompt', label: 'A change prompt that touches only what you name', text: "Here is my spec: [paste SPEC.md].\n\nMake one change only: replace the units text box on the booking page with a stepper labelled “How many aircon units?”, starting at 1, minimum 1, maximum 6. Do not change anything else: not the layout, not the other fields, not the owner page.\n\nWhen you finish, list every file you changed and why, then check acceptance criteria 1, 3 and 4 and tell me how to check them by hand." },
      { type: 'heading', text: 'Keep a changelog and checkpoints' },
      { type: 'paragraph', text: "A **changelog** is a short list of what changed and when. Together with a saved checkpoint before each change, it lets you answer “what did we change before things got better or worse?”. Add each change to your spec too, so the spec always describes the product you actually have." },
      {
        type: 'code',
        language: 'text',
        label: 'CHANGELOG.md',
        code: `# Changelog: Cool Hands Booking

## v1.1 (iteration 1)
- Units: text box replaced by a stepper (1 to 6).
- Hypothesis: fewer pauses and no invalid units.
- Checkpoint before change: v1.0
- Result: (fill in after one week)

## v1.0 (first version)
- Booking page, confirmation page, owner page, two-bookings-per-slot rule.`,
      },
      {
        type: 'version',
        text: "Tools help you keep checkpoints. Google’s AI Studio documentation says Build mode supports two-way sync with a GitHub repository, so every change can be a saved commit you can return to. Claude Code’s documentation says it works with Git directly: it can stage changes, write commit messages, create branches and open pull requests. If your tool has its own version history, use it the same way. Whatever you use, name each checkpoint so you can find it later.",
        checked: CHECKED,
        sources: [DOCS.aiStudioBuild, DOCS.claudeCode],
      },
      { type: 'warning', text: "Do not iterate on novelty. If you find yourself adding things because they are interesting, or because one person asked loudly, stop and look at the log. And if several rounds of changes do not move the one job, that is not a polishing problem. It may be a signal to rethink the idea, which the next lesson covers." },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: a *hypothesis* is a guess you write down before testing, in the form “if I do this, then that will happen”. A *measure* is the number or sign that tells you whether the guess was right. To *revert* means to go back to the saved earlier version, like keeping a copy of a document before you edit it. You do these three things so that you are never confused about what helped. If you change the units box and also the colours and also the wording, and bookings go up, you cannot say which change did it. One change at a time keeps the answer clear.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Treat each iteration as a small experiment with one primary metric and at least one guardrail (for example, time to complete a booking must not rise while errors fall). Write the minimum observation window and the decision rule before starting. With first-cohort traffic, avoid formal A/B tests: you cannot reach significance, so prefer sequential qualitative checks plus event counts. Convert acceptance criteria into automated regression tests so each iteration can be verified quickly, and refactor with a test net rather than by prompt alone. Track technical debt explicitly, because fast AI-assisted changes accumulate it quietly. Version the spec alongside the code.",
      },
      {
        type: 'takeaways',
        items: [
          'Iterate on purpose: one pattern from the log, one change, one measure and one way back.',
          'Rank by how many different people are affected and whether the problem blocks the one job.',
          'Write the hypothesis, the measure and the rollback before you change anything.',
          'Save a checkpoint before each change and keep a changelog, so you know what helped.',
          'If rounds of changes do not move the one job, it may be a direction problem, not a polish problem.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-10-fix-1',
          kind: 'fix-bug',
          title: 'Fix the iteration plan',
          prompt: 'This plan changes too much at once. Tap the line that breaks the “one change” rule, then choose the best fix.',
          concept: 'one change at a time',
          language: 'text',
          code: 'ITERATION 1 PLAN\nPATTERN SEEN: 3 of 5 users hesitated at the units box\nHYPOTHESIS: A clearer units control will reduce hesitation\nTHE CHANGE: new units stepper, online payments, dark mode, new logo, loyalty points\nMEASURE: pauses at units in the next 5 observed bookings',
          bugLine: 4,
          fixes: [
            { line: 'THE CHANGE: replace the units box with a stepper labelled “How many aircon units?” and change nothing else', correct: true, why: 'One change tied to the pattern and the measure. If hesitation falls, you know the stepper did it.' },
            { line: 'THE CHANGE: new units stepper and online payments, since two users asked for payments', correct: false, why: 'Payments are a large, unrelated change. If the measure moves you cannot tell which change did it.' },
            { line: 'THE CHANGE: dark mode and a new logo, to make the page look more professional', correct: false, why: 'These do not address the pattern, so the measure at units would not tell you anything.' },
            { line: 'THE CHANGE: new units stepper, a help video about units and a price table', correct: false, why: 'Three changes aimed at the same box still hide which one helped. Keep it to one.' },
          ],
          hints: [
            'Count the changes listed on the line. How many does the hypothesis talk about?',
            'The bug is in “THE CHANGE” (line 4). The pattern is about the units box only.',
            'The best fix is a single change to the units control with a clear label and nothing else.',
          ],
          explanation: 'The hypothesis and the measure are about the units box, so only a change to the units box can be tested by them. Bundling payments, themes and logos makes the result impossible to read.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-10-tap-1',
          kind: 'tap-reveal',
          title: 'Keep, revert or refine?',
          prompt: 'Tap each result to see what to do with the change.',
          concept: 'reading an experiment',
          cards: [
            { front: 'Measure met: 0 long pauses and 0 invalid units in the next 5 bookings', back: 'Keep the change, log it in the changelog, and move to the next pattern.' },
            { front: 'No change: people still pause at units, even with the stepper', back: 'Revert to the checkpoint or try a different change. Do not stack a second change on a failed one.' },
            { front: 'Partly better: fewer pauses, but one person still typed a wrong value', back: 'Keep the change and refine it with one further small change, then measure again.' },
            { front: 'Worse: people now cannot find the box at all', back: 'Revert at once to the checkpoint and look at what happened in a session before trying again.' },
          ],
          hints: [],
          explanation: 'The decision rule was written before the test, so each outcome has a clear next step: keep, revert or refine. Without it, any result can be argued as either success or failure.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-10-q1',
        prompt: 'Why change one thing at a time between tests?',
        choices: [
          'AI tools can only change one thing per prompt',
          'So you can tell which change moved the result and which to undo',
          'Because users get annoyed if more than one thing changes at the same time on the page',
          'Because it makes the changelog shorter to write',
        ],
        answer: 1,
        explanation: 'If several things change together, you cannot tell which one caused the result. A single change keeps cause and effect readable.',
      },
      {
        id: 'idea-to-product-10-q2',
        prompt: 'Which item should come first in the ranking, given the evidence in the log?',
        choices: [
          'A loyalty points feature requested by one user',
          'Online payments requested by two users who both already use the product, at a cost of several weeks',
          'A field that three different people stumbled on and that causes wrong bookings',
          'A new logo suggested by a friend',
        ],
        answer: 2,
        explanation: 'It affects the most people and blocks the one job. Requests from one or two people, however enthusiastic, come after a blocker.',
      },
      {
        id: 'idea-to-product-10-q3',
        prompt: 'What is the purpose of a rollback plan written before the change?',
        choices: [
          'To tell users that you might undo your changes',
          'To make the plan look more thorough to investors',
          'To let you skip testing, because you can undo anything later and get on with the next feature',
          'To make sure you can return to the last good version if the change fails',
        ],
        answer: 3,
        explanation: 'Not every change helps. A checkpoint and a plan to return to it make trying a change cheap and safe.',
      },
      {
        id: 'idea-to-product-10-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what is a “hypothesis” in this lesson?',
        choices: [
          'A guess written down before testing: “if I do this, then that will happen”',
          'A report written by the AI about how users behave and what they are most likely to want next',
          'A list of all the features you might build one day',
        ],
        answer: 0,
        explanation: 'A hypothesis connects a change to a result you can measure. Writing it first keeps you honest about whether the change helped.',
      },
      {
        id: 'idea-to-product-10-q5',
        audience: EXPERIENCED,
        prompt: 'A change reduces booking errors but time to complete a booking rises by half. How should the iteration plan have handled this?',
        choices: [
          'Ignore the time, since errors were the primary goal',
          'Declare the experiment a success because one metric improved and move on to the next experiment straight away',
          'Define a guardrail metric and a decision rule in advance, so a slower booking stops the change',
          'Run a significance test on the five users to decide',
        ],
        answer: 2,
        explanation: 'A primary metric can hide harm elsewhere. A guardrail and rule fixed before the test stop you from accepting a change that makes the product worse overall.',
      },
    ],
    task: {
      title: 'Plan and make your first iteration',
      minutes: 25,
      steps: [
        'From your feedback log, rank the items by how many different people were affected and whether each blocks the one job. Pick the top one.',
        'Write an iteration plan using Rina’s as the pattern: pattern, hypothesis, one change, measure, rollback and “not changing now”.',
        'Save a checkpoint of your product and name it. Start a CHANGELOG file with the checkpoint’s name.',
        'Send a change prompt that names the one change and says what not to touch. Check the result by hand against the acceptance criteria it affects.',
        'Put the new version in front of your next user or two and note whether the measure moved.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['After the change, ask the AI: “List every difference between the old version and the new one.” If it lists anything you did not ask for, revert and try again.'] },
      { audience: EXPERIENCED, steps: ['Add a guardrail metric and a written decision rule, and convert the affected acceptance criteria into automated regression tests that run before you accept the change.'] },
    ],
  },
  {
    id: 'idea-to-product-11',
    day: 11,
    title: 'Decide: grow, change direction or stop',
    summary: 'Compare what happened with the success measure you set earlier and write a decision note that says grow, change direction or stop, with the next smallest step.',
    intro: {
      objectives: [
        'Compare results with the success measure you wrote before building',
        'Choose grow, change direction or stop, and give reasons from evidence',
        'Write a decision note with the next smallest step and a stop rule',
      ],
      why: 'Most early products should not continue exactly as they are, and finding that out in weeks rather than years is a win. A written decision keeps hope, sunk cost and the loudest voice from choosing for you.',
    },
    minutes: 25,
    skills: ['iteration-decisions'],
    body: [
      { type: 'paragraph', text: "You have run a test with real people and learned from it. Now comes the decision that most people skip: what next? There are three honest answers. **Grow**: the evidence says keep going, so run a bigger or harder test. **Change direction**: the problem looks real but this solution is not it, so keep what you learned and change the approach. **Stop**: the evidence says the problem is not painful enough, or you cannot reach the people, or you do not want to keep doing this, and your time is better spent elsewhere. Stopping well is a result, not a failure: you spent weeks, not years." },
      { type: 'heading', text: 'Decide with the measure you set earlier' },
      { type: 'paragraph', text: "In lesson 4 you wrote a success measure before building. That is your yardstick now. Compare what happened with it first, and only then ask how you feel about it. If you did not write one, write down the numbers you got and be extra careful, because it is very easy to see success in any result after the fact." },
      {
        type: 'table',
        headers: ['Measure', 'Target', 'What happened', 'Verdict'],
        rows: [
          ['First users who took 3 or more real bookings in two weeks', '3 of 5', '2 of 5 in the first two weeks; 3 of 5 in the next two weeks, after the units fix', 'Met, after one fix'],
          ['Customers who finished the form without help', '4 of 5', '14 of 15 observed in weeks three and four', 'Met'],
          ['Users willing to pay a small amount for next month', 'At least 1 of 3 asked', '2 of 3 asked paid in advance (U1 and U2); U3 said “maybe later”', 'Met, with a small sample'],
          ['Stop rule: fewer than 2 of 5 took a real booking', 'Not triggered', 'Never fewer than 2 of 5', 'Not triggered'],
        ],
        caption: 'Rina’s numbers are invented for teaching. Notice the sample sizes are tiny.',
      },
      { type: 'heading', text: 'What each decision looks like' },
      {
        type: 'table',
        headers: ['Decision', 'The evidence looks like', 'The next step is'],
        rows: [
          ['Grow', 'The target was met, people use it without being nagged, some would pay or paid, and they would be upset to lose it', 'A bigger or harder test with new people, such as paying customers, not a big spend'],
          ['Change direction', 'The problem is real in interviews, but behaviour is weak, or people use a different part of it than you expected', 'Go back to conversations. Change the solution, the first users or the job, and test again'],
          ['Stop', 'Nobody committed, usage stayed near zero after fixes, you cannot reach the people, or the problem is not painful enough', 'Write down what you learned, thank your users, and choose a new problem from lesson 1'],
        ],
        caption: 'The decision belongs to the evidence, not to how much you have already built',
      },
      { type: 'paragraph', text: "Watch for traps. The sunk-cost trap says “I have spent weeks on this, so I should keep going”. The enthusiasm trap says “they all said they liked it”. The one-more-feature trap says “it would work if only we added…”. And notice that a promise to pay is not payment: if you can, ask for a small real commitment, such as paying in advance for next month." },
      { type: 'heading', text: 'Rina’s decision note' },
      { type: 'paragraph', text: "This is the full note Rina writes after four weeks. It states the result, what she is not concluding, the decision and the next test with its own stop rule. Copy the structure." },
      {
        type: 'code',
        language: 'text',
        label: 'Decision note: Cool Hands Booking, after four weeks',
        code: `DECISION NOTE: COOL HANDS BOOKING (after 4 weeks)

RESULT VERSUS TARGET
- 3 of 5 first users took 3+ real bookings in two weeks (target 3 of 5), but
  only after the units fix. In the first two weeks it was 2 of 5.
- 14 of 15 customers finished the form without help (target 4 of 5).
- 2 of 3 owners I asked paid a small amount in advance for next month.

WHAT I LEARNED
- Owners with many repeat customers (U1, U2) used it most.
- The units box was the main blocker. It is fixed.
- Requests for online payments and automatic reminders came from the people
  who already used it. They are wishes, not blockers.

WHAT I AM NOT CONCLUDING
- That five users prove a market. Five people is a signal, not a rate.

DECISION: GROW, CAREFULLY
Run one bigger test. Do not spend on ads or quit anything.

NEXT EXPERIMENT (two weeks)
- Invite 10 new owners, mostly through introductions from U2 and U1.
- Ask each to pay a small amount in advance for the first month.
- Success: at least 5 of 10 take 3+ bookings and at least 3 pay.

STOP RULE
If fewer than 2 of 10 take a real booking, return to interviews with a
different kind of owner before building more.

WHAT WOULD CHANGE MY MIND
If paying owners stop using it after the first month.`,
      },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "In plain words: a *pivot* (changing direction) means keeping what you learned but changing the plan, the way a food stall that finds nobody orders its soup starts selling the noodles that customers keep asking about. It is not a failure. Stopping is not failure either: it is a decision that saves you months. The most important idea is to decide by comparing the numbers you got with the target you wrote before you started. If you did not write a target, be honest about that. Ask someone you trust to read your results and tell you what they see, because it is easy to find good news in anything you hoped for.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "A decision from a first cohort is a stage gate, not a verdict on the business. Five users cannot give you unit economics, retention curves or acquisition cost, so define the next gate in terms you can actually observe: week-four retention in a larger cohort, activation rate, willingness to pay at a stated price, and a channel test for reaching new users cheaply. Check compliance before scale, such as data protection obligations, payment regulation and the terms of any platform you depend on. Revisit build, buy or configure with real usage data. If the work moves to engineers, hand over the spec, the changelog, the feedback log and the decision note, since they carry the reasoning as well as the result.",
      },
      {
        type: 'takeaways',
        items: [
          'There are three honest decisions: grow, change direction or stop. Stopping early is a saved resource, not a failure.',
          'Compare the result with the success measure you wrote before building, before you consider how you feel.',
          'Watch for traps: sunk cost, enthusiasm without use and “one more feature”.',
          'A promise to pay is not payment, so ask for a small real commitment.',
          'Write a decision note with the result, what you are not concluding, the decision, the next experiment and its stop rule.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-11-scenario-1',
          kind: 'scenario',
          title: 'Grow, change or stop?',
          prompt: 'Choose the best decision and next step for Dan.',
          concept: 'making the decision',
          situation: 'Dan built a pre-order tool for neighbourhood bakeries. After four weeks, 4 of his 5 bakers used it for real orders every week, and two paid for a second month without being asked. One baker’s use jumped at Christmas. Dan wants to quit his job and spend his savings on ads and new features.',
          options: [
            { text: 'Grow carefully: keep his job, invite ten more bakers through introductions, ask them to pay in advance and set a stop rule before the test.', consequence: 'He follows strong evidence with a bigger, harder test, and keeps his risk small while learning whether it works beyond the first five.', quality: 'best' },
            { text: 'Quit his job and spend savings on ads now, because the results are good.', consequence: 'Five users are a signal, not a market. Spending big before a second, harder test risks a lot on a small sample, and one baker’s use might be seasonal.', quality: 'poor' },
            { text: 'Keep the product exactly as it is and wait to see what happens.', consequence: 'Not wrong, but he learns nothing new. Strong early evidence deserves a deliberate next test.', quality: 'acceptable' },
            { text: 'Stop, because five users are too few to mean anything.', consequence: 'Five users are not proof, but 4 of 5 using it weekly and two paying unprompted is exactly the kind of signal worth following up.', quality: 'poor' },
          ],
          hints: [
            'What does strong early evidence deserve: a big bet, a pause or a harder test?',
            'Two paid unprompted, which is a strong commitment. But five people is a small sample.',
            'The best answer follows the signal with a bigger test and a stop rule while keeping the risk small.',
          ],
          explanation: 'Four of five using it weekly and two paying unprompted justify going on, but five users cannot support a big bet. A bigger, harder test with a written stop rule is the careful way to grow.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-11-fill-1',
          kind: 'fill-blank',
          title: 'Complete the decision note',
          prompt: 'Here is a decision note for a different result. Fill each blank so it matches the evidence.',
          concept: 'writing a decision note',
          story: 'A tutoring booking page was tested with five parents’ groups. The numbers were weak, but the interviews were strong.',
          language: 'text',
          code: 'TARGET: 3 of 5 first users take 3 or more real bookings in two weeks.\nRESULT: 1 of 5 did. Four said they liked it but kept ___ with parents instead.\nSTILL TRUE: tutors told us in interviews that scheduling costs them real money.\nDECISION: ___. The problem is real, but this solution is not working.\nNEXT STEP: go back to ___ with tutors to find what they would actually use.',
          blanks: [
            { answers: ['messaging'], feedback: 'The note describes what users did instead of using the page: they stayed with the habit the product was meant to replace.' },
            { answers: ['change direction'], feedback: 'The problem is real (so not stop) but the target was badly missed (so not grow).' },
            { answers: ['interviews', 'conversations'], feedback: 'When the solution fails but the problem is real, the next step is back to real conversations, not more building.' },
          ],
          bank: ['messaging', 'change direction', 'grow', 'stop', 'interviews', 'advertising'],
          hints: [
            'The first blank is what parents did instead of using the page.',
            'The problem is real, and the solution is not working. Which of grow, change direction and stop fits?',
            'After a failed solution to a real problem, you go back to talking to the people who have it.',
          ],
          explanation: 'The target was missed (1 of 5), but interviews still show a real, costly problem. That points to changing direction, and the next step is to return to conversations rather than build more.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-11-q1',
        prompt: 'What should you compare your results with first when deciding what to do next?',
        choices: [
          'The success measure and stop rule you wrote before building',
          'How hard you worked on the product and how much you have built',
          'What an AI assistant says most startups do at this stage',
          'The opinion of the friend who has supported the idea from the start',
        ],
        answer: 0,
        explanation: 'A target fixed in advance keeps the decision honest. Effort, benchmarks and encouragement can all push you to continue when the evidence does not.',
      },
      {
        id: 'idea-to-product-11-q2',
        prompt: 'Interviews showed a real problem, but only 1 of 5 users used the product after fixes, and four kept using Messenger. What does this suggest?',
        choices: [
          'Grow: the problem is real, so more marketing will fix it and bring in the users the product is missing',
          'Stop: any weak result means the idea is bad',
          'Wait another month with no changes and hope usage rises',
          'Change direction: keep what you learned and test a different solution or first user',
        ],
        answer: 3,
        explanation: 'A real problem with weak use of this solution calls for a change in approach. Stopping ignores the evidence of the problem, and marketing a weak product wastes money.',
      },
      {
        id: 'idea-to-product-11-q3',
        prompt: 'An owner says, “I would definitely pay for this.” What is the best way to treat that statement?',
        choices: [
          'As proof of demand, because it is a direct statement about money and the person said it clearly',
          'As a starting point: ask for a small real commitment, like paying in advance',
          'As worthless, because nobody tells the truth in interviews',
          'As a price: multiply it by the number of owners in the city',
        ],
        answer: 1,
        explanation: 'A promise to pay costs nothing. A small actual payment is a commitment, which is much stronger evidence.',
      },
      {
        id: 'idea-to-product-11-q4',
        audience: NEWCOMER,
        prompt: 'In plain words, what does “change direction” (a pivot) mean?',
        choices: [
          'Giving up on the idea, deleting everything you built and starting again from nothing',
          'Keeping what you learned but changing the solution or the first users',
          'Adding more features until users are satisfied',
        ],
        answer: 1,
        explanation: 'A pivot keeps your learning and changes the plan. It is different from stopping, where you leave the idea, and from adding features.',
      },
      {
        id: 'idea-to-product-11-q5',
        audience: EXPERIENCED,
        prompt: 'After a promising first cohort of five, which gate best defines the next stage?',
        choices: [
          'Project annual revenue from the first five users’ spending',
          'Raise money immediately, because early traction is the best time to raise and investors rarely check how many users there were',
          'A larger cohort measuring week-four retention, activation and price, with compliance checked first',
          'Build every requested feature before accepting new users',
        ],
        answer: 2,
        explanation: 'Five users cannot support revenue projections. The next gate should be observable measures on a larger cohort, with compliance risks checked before growth multiplies them.',
      },
    ],
    task: {
      title: 'Write your decision note',
      minutes: 25,
      steps: [
        'Open your MVP scope from lesson 4 and copy your success measure and stop rule exactly as you wrote them.',
        'Fill in a table of target versus what happened, using your feedback log. If you did not set a target, note that honestly.',
        'Choose grow, change direction or stop, and write three reasons that come from the evidence, not from how you feel.',
        'Write what you are not concluding, the next smallest experiment with its own success measure and stop rule, and what would change your mind.',
        'Ask one trusted person to read the note and tell you where it sounds more hopeful than the numbers.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['Ask the AI: “Read my results and my target. Do they match? Tell me only what the numbers say, not what I hope.” Compare its answer with your first reading.'] },
      { audience: EXPERIENCED, steps: ['Define the next stage gate with observable metrics, a pre-registered threshold and a date, and list the compliance, platform and cost risks to clear before any growth spend.'] },
    ],
  },
  {
    id: 'idea-to-product-12',
    day: 12,
    title: 'Project: an MVP with its first five users',
    summary: 'Put everything together: a four-week plan, the one-page pack to hand in, and how to be honest about what the evidence shows.',
    intro: {
      objectives: [
        'Plan the four weeks that take you from idea to a decision note',
        'Assemble the pack of artefacts that proves what you did and learned',
        'Describe your evidence honestly, including what you did not verify',
      ],
      why: 'A finished MVP with five real users and an honest decision is rare, and it is worth more to a client, an employer or yourself than a polished app that nobody used.',
    },
    minutes: 25,
    skills: ['problem-selection', 'idea-validation', 'mvp-scoping', 'iteration-decisions'],
    body: [
      { type: 'paragraph', text: "This lesson teaches nothing new. It helps you do the project: take your own idea through the whole path, finish with a working first version used by five real people, and write the decision. The project has two parts. The first, after lesson 5, is the evidence and scope pack. The second, after lesson 11, is the working product, the feedback log and the decision note. Rina’s example has shown you what each artefact looks like, so your job now is to make yours." },
      { type: 'heading', text: 'The pack you will hand in' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Problem statement** (lesson 1): who, the job, the cause, the cost and the workaround, with numbers marked as guesses.',
          '**Evidence:** your assumptions table and an interview log of at least five conversations (lessons 2 and 3).',
          '**MVP scope** (lesson 4): promise, one job, three must-haves, a not-now list, a success measure and a stop rule.',
          '**Spec and tool note** (lessons 5 and 6): SPEC.md and your tool decision note.',
          '**The product itself** (lesson 7): a working link, or a concierge version that five people really used.',
          '**Feedback log** (lessons 8 and 9): at least five users, including those who did not use it.',
          '**Decision note** (lessons 10 and 11): one iteration with its result, and grow, change direction or stop.',
        ],
      },
      { type: 'heading', text: 'A four-week plan' },
      {
        type: 'table',
        headers: ['Week', 'Do', 'You finish with'],
        rows: [
          ['1', 'Lessons 1 to 3: choose the problem, list assumptions, run at least five conversations', 'Problem statement, assumptions table, interview log'],
          ['2', 'Lessons 4 to 6: write the scope and the spec, choose and try a tool', 'MVP scope, SPEC.md, tool decision note'],
          ['3', 'Lessons 7 and 8: build in small steps with checkpoints, invite five users and watch some of them', 'A working product and five invited users'],
          ['4', 'Lessons 9 to 11: log feedback, make one change on purpose, write the decision', 'Feedback log, changelog and decision note'],
        ],
        caption: 'Four weeks is enough. If a step takes longer, cut scope, not the conversations or the users.',
      },
      { type: 'heading', text: 'What counts as “five users”' },
      { type: 'paragraph', text: "Five users means five real people who have the problem and used your product (or your concierge version) for their real job. Family and friends count only if they truly have the problem. A person who opened it once and never returned counts, with a note that they did not return. A tester who only gave an opinion does not count. If you cannot reach five, hand in what you reached, and say so plainly. That honest result is worth more than an invented one." },
      { type: 'heading', text: 'Ways this goes wrong' },
      {
        type: 'list',
        items: [
          '**Skipping the conversations.** The most common failure. Without them the rest is a guess.',
          '**A scope that grows.** If your must-have list passes three items, cut it.',
          '**Building before testing a no-software version.** Check whether a form and a spreadsheet would teach you the same thing.',
          '**Counting compliments as users.** A user used it for a real job.',
          '**Hiding the weak parts.** The pack is judged on honesty and learning, not on a success story.',
        ],
      },
      { type: 'heading', text: 'A one-page report to put on top' },
      {
        type: 'code',
        language: 'text',
        label: 'One-page report template',
        code: `PROJECT REPORT: [product name]

1. PROBLEM
[Your problem statement.]

2. EVIDENCE
Conversations held: [number]. Strongest commitments: [what people did].
Riskiest assumption and how I tested it: [one sentence].

3. SCOPE AND SPEC
Promise: [one sentence]. Must-haves: [three]. Not now: [list].
Tool chosen and why: [one sentence]. Link to SPEC.md: [link or attached].

4. BUILD AND USERS
Link to the product: [link]. Users invited: [number]. Users who used it
for a real job: [number]. Checkpoints and changelog: [link or attached].

5. WHAT HAPPENED
Success measure: [target]. Result: [counts, "N of 5"]. One change I made,
my hypothesis and the result: [two lines].

6. DECISION
Grow, change direction or stop: [choice]. Reasons from evidence: [three].
What I am not concluding: [one sentence]. Next experiment and stop rule: [two lines].

7. WHAT I DID NOT VERIFY
[Honest list: guesses, small samples, anything you could not check.]`,
      },
      {
        type: 'paragraph',
        audience: NEWCOMER,
        text: "If this feels big, shrink it: your product can be a concierge version with no software, or one page made with an AI app builder, as long as five real people really used it for a real job. You can use an AI assistant to help you write each artefact. Ask it to explain anything you do not understand, and to review your writing. What matters is that the interviews, the users and the numbers are real and are yours. Take the four weeks one lesson at a time and save each artefact as you finish it, so the final pack is mostly copying what you already have.",
      },
      {
        type: 'paragraph',
        audience: EXPERIENCED,
        text: "Raise the bar on rigour. Record the hypothesis, metric, threshold and window for the cohort before it starts, instrument the main path with a small event set and a non-personal id, and keep personal data out of analytics. Add a short build-versus-buy memo with the export path, a security and privacy review of what the product stores, and a risk register with owners and dates. Link the pull requests or checkpoints that implement each iteration and include the acceptance tests that guard the spec. A reviewer should be able to rebuild your reasoning from the pack without asking you anything.",
      },
      {
        type: 'takeaways',
        items: [
          'The project is the whole path: problem, evidence, scope, spec, build, five users, learning and a decision.',
          'Hand in a pack of artefacts: problem, evidence, scope, spec and tool note, the product, feedback log and decision note.',
          'Five users means five real people with the problem who used it for a real job, including those who did not return.',
          'If you fall short, cut scope, not conversations or users, and say honestly what you reached.',
          'Be judged on honesty and learning: say what you did not verify.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-12-arrange-1',
          kind: 'arrange',
          title: 'Put the report in order',
          prompt: 'Arrange the sections of the project report so that each one builds on the one before.',
          concept: 'telling the story of an MVP',
          language: 'text',
          solution: [
            'Problem: who struggles, why and at what cost',
            'Evidence: conversations and commitments',
            'Scope and spec: the smallest useful version',
            'Build and users: the link and who used it',
            'What happened: results against the target',
            'Decision: grow, change direction or stop',
            'What I did not verify',
          ],
          reasons: [
            'Everything starts with the problem.',
            'The evidence shows the problem is real.',
            'The scope and spec follow from the evidence.',
            'You can only report users after you built something for them.',
            'Results are compared with the target set in the scope.',
            'The decision comes from the results.',
            'Honest limits close the report, after the reader has seen everything.',
          ],
          hints: [
            'Start from the beginning of the path: what comes before anything is built?',
            'Evidence comes before scope; the product and users come before results.',
            'The decision follows the results, and the limits of what you know come last.',
          ],
          explanation: 'The report follows the path of the course: problem, evidence, scope and spec, build and users, results, decision, and an honest list of what was not verified.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'idea-to-product-12-tap-1',
          kind: 'tap-reveal',
          title: 'Is this honest evidence?',
          prompt: 'Tap each statement to see how to treat it in your final report.',
          concept: 'honest reporting',
          cards: [
            { front: '“Five people said they would use it.”', back: 'Opinion. Report it as stated intent, not as users. Say what they actually did.' },
            { front: '“Three of my five users made bookings.”', back: 'Good, if they used it for real jobs. Say “3 of 5”, not a percentage, and name who did not.' },
            { front: '“An AI report says the market is large.”', back: 'Do not use it unless you opened a real source. Mark any unsourced number as a guess.' },
            { front: '“One user never came back after day one.”', back: 'Include them. A user who did not return is some of your most useful evidence.' },
          ],
          hints: [],
          explanation: 'An honest report separates stated opinion from behaviour, reports small counts as counts, flags unsourced claims and keeps the awkward users in.',
        },
      },
    ],
    quiz: [
      {
        id: 'idea-to-product-12-q1',
        prompt: 'Who counts as one of your “five users” for the project?',
        choices: [
          'Anyone who said your idea sounded good',
          'A real person with the problem who used the product or a concierge version for a real job',
          'Any friend who opened the link once to be kind and told you it looked good afterwards on their phone',
          'Anyone who followed you on social media during the test',
        ],
        answer: 1,
        explanation: 'A user did something real with the product for a real job. Opinions, politeness and follows are not use.',
      },
      {
        id: 'idea-to-product-12-q2',
        prompt: 'You reached only three users in four weeks. What is the best way to handle this in the pack?',
        choices: [
          'Count your two closest friends so you reach five',
          'Delay the project until you can reach five users',
          'Report three users, say why you could not reach more, and show what you learned',
          'Remove the feedback log so the shortfall is not visible and present only the best results',
        ],
        answer: 2,
        explanation: 'The pack is judged on honesty and learning. Reporting the real number with a reason is stronger than a padded count.',
      },
      {
        id: 'idea-to-product-12-q3',
        prompt: 'The project is running late. What should you cut first?',
        choices: [
          'Scope: fewer features, a simpler tool or a concierge version',
          'The conversations with real people, since they take the most time',
          'The five users, replaced with two',
          'The decision note',
        ],
        answer: 0,
        explanation: 'Scope is the cheapest thing to cut. The conversations, the users and the decision are where the learning comes from.',
      },
      {
        id: 'idea-to-product-12-q4',
        audience: NEWCOMER,
        prompt: 'Can a project with no software at all still count?',
        choices: [
          'No, a product must always be an app or a website with its own hosting',
          'Only if an AI wrote the instructions',
          'Yes, if five real people used a concierge version for a real job',
        ],
        answer: 2,
        explanation: 'The goal is learning from real use. A concierge MVP, where you do part of the job by hand, can test the idea just as well as software.',
      },
      {
        id: 'idea-to-product-12-q5',
        audience: EXPERIENCED,
        prompt: 'What would make a reviewer most able to trust your pack without asking you anything?',
        choices: [
          'A polished slide deck summarising the results, with charts of every metric you tracked',
          'The hypothesis, metric and threshold recorded before the cohort began, with links to the checkpoints and tests for each change',
          'A list of every tool you tried, what you liked about each and what each one cost you per month and which ones you plan to try next quarter',
          'A longer decision note with much more detail about the market size and the competitors',
        ],
        answer: 1,
        explanation: 'Pre-registered thresholds and traceable changes let a reader rebuild your reasoning and see that results were not bent afterwards. Polish and volume do not provide that.',
      },
    ],
    task: {
      title: 'Plan your four weeks',
      minutes: 20,
      steps: [
        'Write your own four-week plan using the table in the lesson, with real dates against each week.',
        'List the seven items of the pack and tick the ones you already have from earlier lessons.',
        'Choose the five people you will invite as users and write one line on why each is on the list.',
        'Create the folder or document that will hold the pack, with one heading per item, and put today’s date at the top.',
        'Send the first message of week one: an invitation to a conversation with someone who has your problem.',
      ],
    },
    taskExtra: [
      { audience: NEWCOMER, steps: ['Choose the smallest version of your project that still counts (for example a concierge version) and write down what “done” looks like in one sentence.'] },
      { audience: EXPERIENCED, steps: ['Add the cohort hypothesis, metric, threshold and window to the plan, plus a risk register with an owner and a date for each risk.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'idea-to-product-p1',
    title: 'Your evidence and scope pack',
    summary: 'Choose a problem, test it with real people, and write the smallest useful version and the spec an AI can build from.',
    outcome: 'Shows a client or employer that you can tell a real problem from a guess and turn it into a small, buildable plan backed by real conversations.',
    unlockAfterDay: 5,
    steps: [
      { id: 'idea-to-product-p1-s1', text: 'Write your problem statement: who, the job, the cause, the cost and today’s workaround, with every number marked as a guess.' },
      { id: 'idea-to-product-p1-s2', text: 'Make an assumptions table with at least four rows (assumption, if it is false, cheapest test, evidence that would convince you) and mark the riskiest one.' },
      { id: 'idea-to-product-p1-s3', text: 'Write an interview script about past behaviour, then hold at least five conversations with people who have the problem and log each in a table.' },
      { id: 'idea-to-product-p1-s4', text: 'Write your one-page MVP scope: promise, first users, the one job, riskiest assumption, three must-haves, a not-now list, success measure and stop rule.' },
      { id: 'idea-to-product-p1-s5', audience: NEWCOMER, text: 'If you cannot find five people yet, hold three and write down who you will ask next and how. Ask an AI assistant to review your questions for leading wording.' },
      { id: 'idea-to-product-p1-s6', audience: EXPERIENCED, text: 'Add the thresholds you fixed before each test, how you recruited across the segment to avoid bias, and one piece of disconfirming evidence you found.' },
      { id: 'idea-to-product-p1-s7', text: 'Write SPEC.md with goal, users, out of scope, pages, data, rules and at least five acceptance criteria you can check by hand.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your evidence and scope pack',
      placeholder: 'Paste your problem statement, assumptions table, interview log, MVP scope and spec (use codes, not real names).',
      hint: 'Include all five items. Replace people’s names with codes, mark guesses as guesses and say what you could not verify.',
    },
    rubric: [
      'The problem statement names a specific kind of person, a cost and a workaround, and marks guesses as guesses',
      'The assumptions have a test and a finish line written before the test',
      'The interview log shows questions about the past and records what people did, not only what they said',
      'The MVP scope has at most three must-haves, a longer not-now list, a success measure and a stop rule',
      'The spec has an out-of-scope list and acceptance criteria that can be checked by hand',
    ],
    rubricExtra: [
      { audience: NEWCOMER, items: ['Plain language is fine, but every number is marked as a guess or sourced, and at least three real conversations are logged'] },
      { audience: INTERMEDIATE, items: ['The spec names the data to be stored and who may read it, and one rule that must hold where the data is saved'] },
      { audience: EXPERIENCED, items: ['Thresholds are fixed before tests, the sample’s bias is discussed, and the spec covers negative cases, privacy and concurrency'] },
    ],
  },
  {
    id: 'idea-to-product-p2',
    title: 'An MVP with its first five users',
    summary: 'Build the first version with an AI tool, put it in front of five real users, learn from what they do, change one thing on purpose and write the decision.',
    outcome: 'Proves you can take an idea to a working product with real users and make an honest decision from evidence, the core skill of a founder, product builder or freelancer who sells AI-built software.',
    unlockAfterDay: 11,
    steps: [
      { id: 'idea-to-product-p2-s1', text: 'Choose your tool and write a one-page tool decision note, including what you checked on the official pages and what would make you switch.' },
      { id: 'idea-to-product-p2-s2', text: 'Build the first version in small steps from your spec, with fake data first, checking each step by hand and saving a named checkpoint after every step that passes.' },
      { id: 'idea-to-product-p2-s3', text: 'Choose five first users who have the problem, invite them with a small, clear ask that says what you collect, and watch at least one of them use it without helping.' },
      { id: 'idea-to-product-p2-s4', text: 'Keep one feedback log (who, source, what happened, type) including users who did not use it. Count patterns by how many different people share them.' },
      { id: 'idea-to-product-p2-s5', text: 'Make one change on purpose: write the hypothesis, measure and rollback first, make the change, update the changelog and record the result.' },
      { id: 'idea-to-product-p2-s6', audience: COMPLETE_BEGINNER, text: 'Build with an AI app builder or a concierge version that needs no code. After each step ask the AI to explain in plain words what changed, and check it against what you see.' },
      { id: 'idea-to-product-p2-s7', audience: INTERMEDIATE, text: 'Store bookings, orders or sign-ups in a real database, protect the owner view with a login or password kept out of the code, and list who can read and write each table.' },
      { id: 'idea-to-product-p2-s8', audience: EXPERIENCED, text: 'Instrument the main path with a few named events and a non-personal user id, keep acceptance tests that run before each change, and attach a short build-versus-buy memo with the export path and a privacy review.' },
      { id: 'idea-to-product-p2-s9', text: 'Write your decision note: results against your success measure, what you are not concluding, grow, change direction or stop with three reasons, the next experiment, a stop rule and what would change your mind.' },
    ],
    submission: {
      kind: 'url',
      label: 'Link to your MVP pack',
      placeholder: 'https://… (a shared document with your pack and a link to the live product)',
      hint: 'One link to a shared document that holds the one-page report, the feedback log, the changelog, the decision note and the link to the working product.',
    },
    rubric: [
      'The product does the one job from the scope for real people, even if some parts are done by hand',
      'At least five real users were invited, and the log says honestly how many used it for a real job and who did not',
      'The feedback log separates behaviour from requests and counts patterns by different people',
      'One change was made on purpose, with a hypothesis, measure and rollback written beforehand',
      'The decision note compares results with the success measure set earlier and states what is not being concluded',
    ],
    rubricExtra: [
      { audience: COMPLETE_BEGINNER, items: ['A no-code or concierge version is fine, as long as five real people used it for a real job and you can explain each step in your own words'] },
      { audience: INTERMEDIATE, items: ['Data is stored in a database with access rules, and secrets are kept out of the code and out of shared chats'] },
      { audience: EXPERIENCED, items: ['Events, tests and checkpoints let a reviewer trace each iteration, and the memo covers lock-in, security and the next gate with observable metrics'] },
    ],
  },
];

export const ideaToProductCourse: Course = {
  id: 'idea-to-product',
  kind: 'standard',
  title: 'Turn an Idea into a Working Product',
  level: 'beginner',
  tagline: 'Test an idea with real people, then build and learn from its first five users using AI.',
  description: 'Pick a problem worth solving, check it honestly with AI research and real conversations, shrink it to the smallest useful version, write a spec an AI can build from, build it and put it in front of five real users. Then learn from what they do and decide whether to grow, change direction or stop.',
  finishLine: ['A working first version used by five real people', 'A decision note that says grow, change direction or stop, backed by what users did'],
  objectives: [
    'Choose a problem worth solving and state it clearly',
    'Validate an idea with AI-assisted research and real conversations',
    'Define the smallest useful version of a product and write a spec an AI can build from',
    'Choose an AI building tool and build a first version in small, checked steps',
    'Learn from what users do and iterate on purpose',
    'Decide honestly whether to grow, change direction or stop',
  ],
  audiences: ['builder', 'career-changer', 'fresh-grad'],
  skills: [
    { id: 'problem-selection', label: 'Choosing a problem' },
    { id: 'idea-validation', label: 'Idea validation' },
    { id: 'user-interviews', label: 'User interviews' },
    { id: 'mvp-scoping', label: 'MVP scoping' },
    { id: 'spec-writing', label: 'Writing a spec' },
    { id: 'tool-selection', label: 'Choosing AI tools' },
    { id: 'ai-building', label: 'Building with AI' },
    { id: 'user-testing', label: 'Putting it in front of users' },
    { id: 'iteration-decisions', label: 'Iterating and deciding' },
  ],
  lessons,
  projects,
  icon: 'rocket_launch',
  updated: '2026-11-14',
};
