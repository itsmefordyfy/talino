import type { Course } from './types';

export const builderCourse: Course = {
  id: 'builder',
  kind: 'career',
  level: 'beginner',
  title: 'Builder: Your Own App or Website',
  tagline: 'Never coded? Describe it, build it with AI, put it online.',
  description:
    "For business owners, creators and students outside IT who want their own app or website without learning to code first. You build in a vibe-coding tool such as Lovable, Bolt, Replit or v0 on your laptop, and Talino teaches you how to plan it, talk to the AI, fix what breaks and launch it safely. Twenty short days, two real projects, one live link at the end.",
  finishLine: [
    'Your own app or website, live on the internet',
    'A one-page spec you can hand to any AI tool or developer',
    'The habit of fixing problems one small step at a time',
    'A login, a database and your own domain, set up and understood in plain words',
    'A clear idea of what it costs to run and when to call a developer',
  ],
  audiences: ['builder', 'career-changer'],
  skills: [
    { id: 'product-planning', label: 'Planning what to build' },
    { id: 'prompting-builders', label: 'Talking to the AI builder' },
    { id: 'fixing-problems', label: 'Fixing what breaks' },
    { id: 'design-basics', label: 'Design basics' },
    { id: 'data-and-login', label: 'Data, login and files' },
    { id: 'launch-and-run', label: 'Launching and running it' },
  ],
  lessons: [
    {
      id: 'builder-01',
      day: 1,
      title: "What vibe coding is, and what it isn't",
      summary: 'Building by describing what you want to an AI tool, and the limits you should know before you start.',
      intro: {
        objectives: [
          'Explain what vibe coding is and how the describe, build and check loop works',
          'Name the projects these tools suit and the ones where they struggle',
          'Test an app that looks finished before you trust it',
          'Describe your role as the director of the build',
        ],
        why: 'You will build your own app or website with an AI tool, and knowing its limits from day one keeps you from publishing something that only looks finished.',
      },
      minutes: 15,
      skills: ['product-planning', 'prompting-builders'],
      body: [
        {
          type: 'paragraph',
          text: "**Vibe coding** means building software by describing what you want in plain words to an AI tool. The tool writes the code, shows you the result, and you say what to change. You repeat that loop until the app does what you need. Vibe-coding tools such as Lovable, Bolt, Replit or v0 all work roughly this way: a chat box on one side, your app taking shape on the other.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "If this is all new, start from the very bottom. **Code** is a set of written instructions that a computer follows, a bit like a recipe: do this step, then that step. An **app** or a **website** is simply a lot of those instructions saved in files. Normally a programmer types them by hand. With an AI builder you describe the result in your own words, for example \"a page that shows my bakery's cakes and a button to order\", and the AI writes the instructions for you. You do not have to read them to begin, but you do have to check that the app behaves the way you described, the same way you would taste a dish before serving it.",
        },
        {
          type: 'paragraph',
          text: "This course is for you if you have never written code: a business owner who wants an order form, a creator who wants a portfolio, a student who wants to test an idea. Talino teaches and coaches you here on your phone. The building itself happens in one of those tools, on a laptop, because you will want a big screen to see your app.",
        },
        { type: 'heading', text: 'What it does well' },
        {
          type: 'list',
          items: [
            'Simple websites: a landing page for your shop, a portfolio, an event page.',
            'Small tools: a booking request form, an order list, a stock tracker for a sari-sari store.',
            'Prototypes: something clickable to show a partner or test with ten customers before you spend more.',
          ],
        },
        { type: 'heading', text: 'Where it struggles' },
        {
          type: 'list',
          items: [
            'Big apps with many parts that all depend on each other.',
            'Anything that handles money or private data, unless someone checks it carefully.',
            'Pixel-perfect designs copied exactly from a picture.',
            'Fixing its own mistakes: sometimes it goes in circles, changing one thing and breaking another.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "builder-01-scenario-1",
            kind: "scenario",
            title: "Your first project",
            prompt: "Which request do you take on first?",
            concept: "what vibe coding suits",
            situation: "A friend who runs a small shop asks you to use an AI app builder to make something for her. You have never used these tools before. She gives you four ideas.",
            options: [
              {
                text: "A one-page website with the shop's hours, menu and a message button.",
                consequence: "A simple website is what these tools do best. You see the result in minutes, you can check every part yourself, and you fix small things by asking.",
                quality: "best",
              },
              {
                text: "A small stock tracker she uses on her own phone to count what is left on the shelf.",
                consequence: "A small tool is a good fit too. Check the numbers against a real count before she relies on them, which makes it a good second project.",
                quality: "acceptable",
              },
              {
                text: "An app where customers pay online and their names, addresses and IDs are saved.",
                consequence: "Money and private data are where these tools struggle most. A mistake you cannot see could leak information, so someone must check it carefully. Save it for later.",
                quality: "poor",
              },
              {
                text: "A copy of a famous delivery app, matching every pixel of its screens.",
                consequence: "Pixel-perfect copies are hard for these tools, and it is a big app with many parts. You would spend hours on tiny differences and still not match it.",
                quality: "poor",
              },
            ],
            hints: [
              "Which idea is small, clear and easy for you to check yourself?",
              "Two of the ideas involve money, private data or an exact copy. Those are the risky ones.",
              "Look for the idea you could finish and test this week without any special care.",
            ],
            explanation: "These tools are best at simple websites, small tools and prototypes. Money, private data and pixel-perfect copies need more care than they can give on their own, so start small and clear.",
          },
        },
        {
          type: 'warning',
          text: 'An AI tool can produce an app that **looks** finished but has holes you cannot see: a form that saves nothing, a page anyone can open, a password stored badly. Looking right is not the same as working right. This course teaches you to test, not just to look.',
        },
        {
          type: 'paragraph',
          text: 'Think of yourself as the **director**, not the typist. You decide what gets built, you describe it clearly, you check every result, and you keep each step small. The AI is a fast, tireless helper that sometimes misunderstands. Your clear words are what make it useful.',
        },
        {
          type: 'prompt',
          label: 'Ask an AI assistant to explain it',
          text: "I have never coded. Explain in simple words what happens when I ask an AI app builder to \"make a website for my small bakery\". What does it actually create, where does that website run, and what will I still need to decide or check myself? Keep it under 200 words.",
        },
        {
          type: 'tip',
          text: "Most of these tools have a free plan with a limit on messages or credits. You do not need to pay to start this course. Plans change often, so check each tool's own pricing page before you decide.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "A developer treats everything the tool produces as an unreviewed first draft from a fast junior. Before shipping they open the code and ask: which framework and dependencies were chosen, is there a lockfile, where do secrets live, and does every route and query enforce who may do what on the server, not only in the interface? They also ask for what vibe coding skips by default: automated tests for the main flow, error handling, logging, a README and a repeatable deployment. Use the OWASP Top 10 as a review checklist, starting with broken access control, security misconfiguration, supply chain failures and injection, because a screen can look completely right while these are wrong.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "OWASP Top 10:2025 is the current edition on OWASP's site. Its first items are A01 Broken Access Control, A02 Security Misconfiguration and A03 Software Supply Chain Failures, with A05 Injection.",
          checked: "2026-11-14",
          sources: [
            {
              label: "OWASP Top 10:2025",
              url: "https://top10.owasp.org/2025",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Vibe coding means describing what you want to an AI tool, which writes the code, and improving it by talking to it.",
            "It does well on simple websites, small tools and prototypes. It struggles with big apps, money or private data, pixel-perfect copies and fixing its own mistakes.",
            "An app that looks finished can still have holes, so test what it does, not just how it looks.",
            "You are the director: decide what gets built, describe it clearly, check each result and keep steps small.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-01-q1',
          prompt: 'What is vibe coding?',
          choices: [
            'Copying code from websites until something works',
            'Describing what you want to an AI tool, which writes the code, and improving it by talking to it',
            'A paid course that teaches a programming language',
            'Using a template without changing anything',
          ],
          answer: 1,
          explanation: 'You describe, the AI writes the code, you check and ask for changes. That loop is vibe coding.',
        },
        {
          id: 'builder-01-q2',
          prompt: 'Which of these is a good first project for vibe coding?',
          choices: [
            'A full online bank',
            'A copy of a big social media app',
            'A landing page with a contact form for your small business',
          ],
          answer: 2,
          explanation: 'Small, clear projects suit these tools best. Banks and huge apps need professional engineering and review.',
        },
        {
          id: 'builder-01-q3',
          prompt: 'Your app looks perfect in the preview. What should you do next?',
          choices: [
            'Test it: fill in the forms, refresh, and check that things really save and work',
            'Publish it right away, since it looks finished',
            'Ask the AI to add more features',
            'Nothing, the AI already tested it',
          ],
          answer: 0,
          explanation: 'Looking right is not working right. Always test what it does, not just how it looks.',
        },
        {
          id: 'builder-01-q4',
          prompt: 'In this course, what is your main role while building?',
          choices: [
            'Typist who writes every line of code',
            'Spectator who lets the AI decide everything',
            'Graphic designer only',
            'Director who decides, describes clearly and checks each result',
          ],
          answer: 3,
          explanation: 'The AI does the typing. You decide what to build, describe it well and check what comes back.',
        },
        {
          id: "builder-01-q5",
          audience: { max: "beginner" },
          prompt: "In plain words, what is the \"code\" an AI builder writes for you?",
          choices: [
            "Written instructions that tell a computer how your app should look and behave",
            "A secret password that unlocks your app",
            "A photo of what your app will look like",
            "A message the AI sends you when it finishes",
          ],
          answer: 0,
          explanation: "Code is a set of instructions a computer follows. The AI writes it from your description, and your job is to check that the result does what you asked.",
        },
        {
          id: "builder-01-q6",
          audience: { min: "advanced" },
          prompt: "A generated booking app hides the Orders link from customers and works perfectly in a demo. Which check matters most before launch?",
          choices: [
            "Call the data endpoint directly while signed out, and as another user, and confirm the server or database refuses it",
            "Ask whether the page looks professional on a phone",
            "Count how many files the project contains",
            "Run the demo again in a different browser",
          ],
          answer: 0,
          explanation: "Hiding a link is not access control. Calling the data endpoint directly while signed out, or as another user, shows whether the server or database really refuses the request.",
        },
      ],
      task: {
        title: 'Meet the tools',
        steps: [
          'On your laptop, open the websites of two vibe-coding tools (for example Lovable, Bolt, Replit or v0) and look at their home pages and example projects.',
          'Paste the prompt above into any AI assistant and read its answer.',
          'Write down three things you would love to build, in one sentence each. Keep the list; you will choose one tomorrow.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask any AI assistant: \"What are code, a file and a website? Explain each with a cooking analogy.\" Write each answer in one sentence of your own words, and underline any word you still do not understand.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Generate a tiny page in any builder, then open its files or export it. List the framework, the dependencies and where configuration or keys live, and write three review questions you would put on a pull request for it.",
          ],
        },
      ],
    },
    {
      id: 'builder-02',
      day: 2,
      title: 'Pick one problem for one person',
      summary: 'The best first app solves one clear problem for one kind of person.',
      intro: {
        objectives: [
          'Choose one problem for one kind of person as your first app',
          'Answer the four questions: who, what they do today, what the app lets them do and how you will know it worked',
          'Keep a later list so the first version stays small',
          'Plan to listen to a real person who has the problem',
        ],
        why: 'Most first apps fail because they try to do everything at once. A small, clear idea is the one you can actually finish and put online this week.',
      },
      minutes: 15,
      skills: ['product-planning'],
      body: [
        {
          type: 'paragraph',
          text: 'The most common reason a first app fails is not the code. It is trying to build everything at once. "An app for my business" is too big. "A page where customers can request a cake order and I get a message" is small enough to finish this week.',
        },
        {
          type: 'paragraph',
          text: 'So today you pick **one problem** for **one person**. The person might be you, your customers, your classmates or your parents. The problem is something they do now in a slow or messy way.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Two words will help today. A **user** is anyone who will use what you build; here it is one person or one kind of person, such as the parents of your students. A **feature** is one thing the app can do, like \"show this week's schedule\" or \"send me a message\". Think of a tailor: a tailor makes one suit that fits one customer well, not a coat that fits everybody badly. Your first app works the same way. When you can say in one sentence who it is for and the one thing it helps them do, the AI has something clear to build, and you have something small enough to finish and test yourself.",
        },
        { type: 'heading', text: 'A simple test for your idea' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Who** exactly uses it? ("Customers of my milk tea stall", not "everyone".)',
            '**What** do they do today instead? (Message on Facebook, write in a notebook, call.)',
            '**What** will the app let them do in one or two minutes?',
            '**How** will you know it worked? (Fewer missed orders, fewer repeated questions.)',
          ],
        },
        {
          type: 'paragraph',
          text: 'Here is a good example. Who: parents of the students in my tutoring centre. Today: they message me on Messenger to ask about schedules and I answer the same questions every day. App: a page that shows this week\'s schedule and lets them request a slot. Success: fewer repeated messages, no double bookings.',
        },
        {
          type: "activity",
          activity: {
            id: "builder-02-scenario-1",
            kind: "scenario",
            title: "An app for my whole business",
            prompt: "What do you do first?",
            concept: "shrinking an idea",
            situation: "You run a small bakery and your idea is \"an app for my whole business\": online ordering, stock, delivery, loyalty points and accounting.",
            options: [
              {
                text: "Pick one problem for one person, such as a page where customers request a cake order and you get a message, and put the rest on a \"later\" list.",
                consequence: "You can build and test it this week, and your other ideas are safe for version two.",
                quality: "best",
              },
              {
                text: "Start building the ordering page now and ask customers what they think when it is finished.",
                consequence: "You get something built, but listening first often changes what you build and saves days of building the wrong thing.",
                quality: "acceptable",
              },
              {
                text: "Ask the AI to build the whole business app in one go.",
                consequence: "Trying to build everything at once is the most common reason a first app fails. It is too big to finish or test.",
                quality: "poor",
              },
            ],
            hints: [
              "Who exactly uses the app, and what is the one problem?",
              "A first version with one thing that works beats ten things that half work.",
              "Look for the option that names one user, one problem and a later list.",
            ],
            explanation: "A first app works best when it solves one clear problem for one kind of person. Everything else goes on the later list.",
          },
        },
        {
          type: 'tip',
          text: 'Write down the features you are tempted to add, then put them in a "later" list. A first version with one thing that works beats ten things that half work.',
        },
        {
          type: 'prompt',
          label: 'Shrink your idea',
          text: "I want to build my first app with an AI app builder. My idea: [describe your idea in 2-3 sentences]. I have never coded. Help me shrink it to the smallest useful first version: one type of user, one main problem, and at most three things the app must do. List what I should leave for later. Ask me up to three questions first if anything is unclear.",
        },
        {
          type: 'warning',
          text: 'If your idea needs to store very sensitive information (medical records, IDs, bank details), choose a different first project. You can come back to it later with a developer\'s help. Lesson 17 explains why.',
        },
        {
          type: 'paragraph',
          text: 'Finally, talk to one real person who has the problem. Ask how they handle it today and what annoys them. Do not pitch your app yet; just listen. Five minutes of listening often changes what you build, and saves you days of building the wrong thing.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Scope is also your best security and cost control. A developer turns the one-sentence problem into acceptance criteria, which are testable statements: a customer can submit an order without an account, a repeated submission within a minute creates one record, the owner's list loads quickly on a mid-range phone. They add a short list of non-goals, name the data classes involved (public, personal, sensitive) and decide early whether the idea crosses a line that needs professional review, such as payments or health data, because that changes the architecture and not only the feature list. Each criterion becomes a test you can hand to the AI tool or a reviewer, which keeps scope creep from generated code visible in the diff.",
        },
        {
          type: "takeaways",
          items: [
            "The most common reason a first app fails is trying to build everything at once.",
            "Pick one problem for one person: who uses it, what they do today, what the app lets them do, and how you will know it worked.",
            "Keep a \"later\" list for the features you are tempted to add.",
            "Talk to a real person who has the problem, and listen before you pitch.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-02-q1',
          prompt: 'Which is the best first-app idea?',
          choices: [
            'An app for my whole business',
            'A page where customers request a cake order and I get notified',
            'A social network for all Filipino students',
          ],
          answer: 1,
          explanation: 'It names one user, one problem and one clear action, so it can be built and tested quickly.',
        },
        {
          id: 'builder-02-q2',
          prompt: 'Why keep a "later" list?',
          choices: [
            'To keep the first version small and finishable without losing good ideas',
            'Because AI tools can only build three features ever',
            'So you can sell the list to developers',
          ],
          answer: 0,
          explanation: 'Small first versions get finished and tested. The later list keeps your other ideas safe for version two.',
        },
        {
          id: 'builder-02-q3',
          prompt: 'What should you do when you talk to someone who has the problem?',
          choices: [
            'Convince them to use your app',
            'Ask for payment in advance',
            'Ask how they handle it today and listen',
          ],
          answer: 2,
          explanation: 'Listening shows you the real problem. Pitching too early hides what people actually need.',
        },
        {
          id: "builder-02-q4",
          audience: { max: "beginner" },
          prompt: "In this lesson, what is a \"user\" of your app?",
          choices: [
            "Only the person who writes the code",
            "The AI tool you build with",
            "Anyone who will use what you build, such as your customers",
            "The company that sells the AI tool",
          ],
          answer: 2,
          explanation: "A user is the person the app is for. Naming one kind of user is what keeps a first app small enough to finish.",
        },
        {
          id: "builder-02-q5",
          audience: { min: "advanced" },
          prompt: "A founder writes \"users can book appointments\". Which rewrite is the best acceptance criterion?",
          choices: [
            "The booking page should feel fast and modern",
            "Bookings are stored in a database",
            "Booking works on every device",
            "A signed-out visitor can book a free slot, the slot disappears for others, and two simultaneous requests for one slot create exactly one booking",
          ],
          answer: 3,
          explanation: "A good criterion can be tested and can fail. The other statements describe a feel, an implementation detail or a vague promise that no test can check.",
        },
      ],
      task: {
        title: 'Choose your project',
        steps: [
          'Pick one idea from yesterday\'s list and answer the four questions: who, what they do today, what the app lets them do, how you will know it worked.',
          'Paste the "Shrink your idea" prompt into an AI assistant with your idea and answer its questions.',
          'Write your final one-sentence project and your "later" list in a note you can find again.',
          'If you can, message one person who has this problem and ask how they handle it today.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask an AI assistant to explain \"user\" and \"feature\" using an example from your own idea. Then rewrite your project sentence so it names exactly one user and one feature.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write five acceptance criteria and three non-goals for your idea. Mark every data field you plan to store as public, personal or sensitive, and note which criteria need an automated test.",
          ],
        },
      ],
    },
    {
      id: 'builder-03',
      day: 3,
      title: 'Describe your app on one page',
      summary: 'A one-page spec with users, screens and data makes every AI prompt better.',
      intro: {
        objectives: [
          'Write a one-page spec with goal, screens, data and rules',
          'Match a line of a spec to the part it belongs in',
          'Make a vague description exact with plain details',
          'State who can see what, so private details stay private',
        ],
        why: 'The AI builds what you describe, so a clear spec saves you rounds of corrections and helps you avoid pages that show private details to everyone.',
      },
      minutes: 15,
      skills: ['product-planning', 'prompting-builders'],
      body: [
        {
          type: 'paragraph',
          text: 'AI builders do much better when you tell them clearly what you want. A **one-page spec** is that clear description, written once and reused in every prompt. "Spec" is short for specification. It does not need special words. It needs to be specific.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "An AI cannot read your mind or see your shop, so everything you do not write down, it has to guess. Imagine asking a builder to construct a house with no plan: you would get a house, but probably not yours. A spec is the plan. Its four parts match how you would describe a shop to a stranger. The **goal** is why it exists. The **screens** are the rooms a visitor walks through (a *screen* is just what you can see on the phone at one moment). The **data** is the notebook of things it remembers, such as a customer's name or a date. The **rules** are the house rules, such as no booking on Sundays. Use short sentences with real names and numbers.",
        },
        { type: 'heading', text: 'The four parts of your spec' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Goal:** one or two sentences. Who it is for and what it lets them do.',
            '**Screens:** each page and what is on it. ("Home: shop name, photo, three best sellers, Order button.")',
            '**Data:** the things the app remembers and their details. ("An order has a name, phone number, cake flavour, pick-up date and a status.")',
            '**Rules:** what must or must not happen. ("Pick-up date must be at least two days from today.")',
          ],
        },
        {
          type: 'code',
          language: 'text',
          label: 'Example spec',
          code: `GOAL
A website for Rosa's Cakes in Quezon City. Customers see the cakes
and send an order request. Rosa sees all requests in one list.

SCREENS
1. Home: shop name, short welcome, 6 cake photos with prices in pesos,
   "Order a cake" button.
2. Order form: name, mobile number, cake, size, pick-up date, notes.
   After sending: a thank-you message.
3. Orders list (only Rosa can see it): all requests, newest first,
   with a status: New, Confirmed, Done.

DATA
Order: name, mobile number, cake, size, pick-up date, notes,
status, date sent.

RULES
- Pick-up date at least 2 days after today.
- Mobile number is required.
- Customers never see other customers' orders.`,
        },
        {
          type: "activity",
          activity: {
            id: "builder-03-match-1",
            kind: "match",
            title: "Which part of the spec?",
            prompt: "Kuya Jun is writing a spec for his barbershop's booking site. Match each line he wrote with the part of the spec it belongs in.",
            concept: "one-page spec",
            labels: { terms: "Lines from Jun's spec", meanings: "Part of the spec" },
            pairs: [
              {
                term: "A website for Kuya Jun's Barbershop in Davao. Customers book a haircut slot; Jun sees the day's bookings in one list.",
                definition: "GOAL: who it is for and what it lets them do",
              },
              {
                term: "Home: shop photo, services with prices in pesos, \"Book a slot\" button.",
                definition: "SCREENS: each page and what is on it",
              },
              {
                term: "A booking has a name, mobile number, service, date, time slot and a status.",
                definition: "DATA: the things the app remembers",
              },
              {
                term: "Two customers can never book the same time slot.",
                definition: "RULES: what must or must not happen",
              },
            ],
            hints: [
              "Ask of each line: does it describe the whole app, one page, the details saved, or something that must never happen?",
              "A list of details that one booking has is data; a page with things you can see and tap is a screen.",
              "Words like \"never\" and \"at least\" mark a rule; the opening sentence about who and what is the goal.",
            ],
            explanation: "The opening sentence says who it is for and what it does (goal), Home lists what is on one page (screen), a booking's details are what the app remembers (data), and no double booking is something that must not happen (rule).",
          },
        },
        {
          type: 'paragraph',
          text: 'Notice how plain it is. No technical words, just exact details. "Prices in pesos", "newest first", "only Rosa can see it". Each of those small details saves you a round of corrections later.',
        },
        {
          type: 'tip',
          text: 'Sketch your screens on paper with boxes and arrows before you write. Five minutes with a pen often shows a screen you forgot.',
        },
        {
          type: 'prompt',
          label: 'Turn your notes into a spec',
          text: "Help me write a one-page spec for a simple app I will build with an AI app builder. Use four sections: GOAL, SCREENS, DATA, RULES. Use plain words, no technical terms. Here is my idea and my notes: [paste your project sentence and notes]. Ask me questions about anything missing, such as who can see what, before you write the final version.",
        },
        {
          type: 'warning',
          text: 'Always say **who can see what**. If you never mention it, the AI may build a page where every visitor can see every customer\'s details.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "For a developer the spec is a contract that both the AI and a reviewer can test. Add three things the plain version leaves out. First, an access table: roles down the side, resources across the top, and in each cell what may be read, created, changed or deleted. Second, data types and constraints: the pick-up date is a date, the status is one of three values, the mobile number has a format, every table has an identifier. Third, non-functional limits: expected volume, page-load targets, what must be logged, and what happens when the network fails. Keep the spec in the repository as a markdown file so coding agents read it as context and every change to it shows up in review.",
        },
        {
          type: "takeaways",
          items: [
            "A one-page spec is a clear description you write once and reuse in every prompt.",
            "It has four parts: goal, screens, data and rules.",
            "Use plain words and exact details, such as \"newest first\" and \"prices in pesos\".",
            "Always say who can see what, or the AI may make private details public.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-03-q1',
          prompt: 'What are the four parts of the one-page spec in this lesson?',
          choices: [
            'Logo, colours, fonts, slogan',
            'Budget, timeline, team, risks',
            'Goal, screens, data, rules',
            'Code, server, database, domain',
          ],
          answer: 2,
          explanation: 'Goal, screens, data and rules describe what to build in plain words, which is what the AI needs.',
        },
        {
          id: 'builder-03-q2',
          prompt: 'Which data description is most useful to an AI builder?',
          choices: [
            'Orders',
            'An order has a name, mobile number, cake, size, pick-up date and status',
            'Customer stuff',
          ],
          answer: 1,
          explanation: 'Listing each detail tells the AI exactly what to save and show.',
        },
        {
          id: 'builder-03-q3',
          prompt: 'Why should your spec say who can see what?',
          choices: [
            'So the AI does not build pages where anyone can see private details',
            'Because AI tools require it to start',
            'It only matters for very large apps',
          ],
          answer: 0,
          explanation: 'If you never say it, the AI may make everything public. Privacy has to be asked for.',
        },
        {
          id: 'builder-03-q4',
          prompt: 'What makes a spec good?',
          choices: [
            'Lots of technical terms',
            'Being as short as possible, one line total',
            'Copying a big app\'s feature list',
            'Exact, plain details such as "newest first" and "prices in pesos"',
          ],
          answer: 3,
          explanation: 'Specific plain details save rounds of corrections. Technical words are not needed.',
        },
        {
          id: "builder-03-q5",
          audience: { max: "beginner" },
          prompt: "In a spec, what is a \"screen\"?",
          choices: [
            "The computer monitor you use to build the app",
            "One page or view of your app, as a visitor sees it at one moment",
            "A tool that blocks hackers",
            "A photo of your logo",
          ],
          answer: 1,
          explanation: "A screen is what someone sees on their phone or laptop at one moment, such as Home or the Order form. The spec lists what is on each one.",
        },
        {
          id: "builder-03-q6",
          audience: { min: "advanced" },
          prompt: "Your spec says \"the owner sees all orders\" and a coding agent builds the page. Which addition best prevents a data leak?",
          choices: [
            "A requirement that the page loads fast",
            "A rule that orders are sorted newest first",
            "An access table stating which role may read, update or delete each order, and that signed-out requests get no rows",
            "A rule that the Orders page must have no menu link",
          ],
          answer: 3,
          explanation: "An access table states permissions for every role and action, so the server or database can be checked against it. Hiding a link, speed and sorting do not control access.",
        },
      ],
      task: {
        title: 'Write your one-page spec',
        steps: [
          'Sketch each screen of your app on paper as boxes.',
          'Paste the spec prompt into an AI assistant with your notes and answer its questions.',
          'Edit the result until it fits on one page and you agree with every line.',
          'Save it as a document on your laptop. You will paste it into your builder on Day 5.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Read your spec aloud to a friend who knows nothing about your idea. Mark every sentence where they ask \"what do you mean?\" and rewrite it with an exact detail.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add an access table (roles by resources by actions), data types with constraints and three non-functional limits to your spec, and save it as SPEC.md in a repository.",
          ],
        },
      ],
    },
    {
      id: 'builder-04',
      day: 4,
      title: 'Choosing a building tool',
      summary: 'How to compare vibe-coding tools for your project without chasing the newest one.',
      intro: {
        objectives: [
          'List the questions to ask any vibe-coding tool before you pick it',
          'Explain why version history matters when an AI change goes wrong',
          'Choose a tool by fit and comfort, not because it is new',
          'Check current features and prices on the tool\'s own website, not in old videos',
        ],
        why: 'Your app, data and domain end up tied to the tool you pick, so a short, careful comparison now saves you from starting over later.',
      },
      minutes: 15,
      skills: ['product-planning', 'launch-and-run'],
      body: [
        {
          type: 'paragraph',
          text: 'There are many vibe-coding tools and they change every month. Lovable, Bolt, Replit and v0 are common examples, and new ones keep appearing. You do not need the "best" one. You need one that fits your project and that you are comfortable using.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A few words that tools use without explaining. An **account** is your personal login on the tool's website. **Version history** is an undo button for the whole app, like the history in a document: it lets you go back to how things were yesterday. **Export** means taking a copy of your app's files out of the tool. **GitHub** is a website where programmers keep copies of their code, a bit like a shared drive for code, so another person can help you later. A **free plan** gives you a limited number of messages or projects at no cost. You are choosing which shop to rent a stall in, so look at how easy it is to move out, not just how nice the stall looks.",
        },
        { type: 'heading', text: 'Questions to ask about any tool' },
        {
          type: 'list',
          items: [
            '**Can it publish?** Is there a simple way to put your app online, and can you connect your own domain later?',
            '**Can it save data?** Does it connect to a database service for things like orders and accounts? (Many connect to a service such as Supabase.)',
            '**Can it add login?** Can people make accounts and sign in?',
            '**Can you go back?** Does it keep a version history so you can undo a bad change?',
            '**Can you take your code with you?** Can you export it or connect it to GitHub, so a developer could work on it later?',
            '**What does the free plan allow?** How many messages or credits, and what happens when they run out?',
          ],
        },
        {
          type: 'paragraph',
          text: 'Answer these by reading each tool\'s own website and help pages, not old videos. Features and prices change often, and a tutorial from last year may show buttons that no longer exist.',
        },
        {
          type: "activity",
          activity: {
            id: "builder-04-scenario-1",
            kind: "scenario",
            title: "Two tools, one choice",
            prompt: "How do you decide?",
            concept: "choosing a tool",
            situation: "You are choosing between two imaginary tools for your cake-order site. Tool A is the newest one everybody talks about. Tool B publishes online, connects to a database service, adds login, keeps a version history and can connect to GitHub.",
            options: [
              {
                text: "Check each tool against the questions on its own website, try the same short prompt in both, then pick the one that fits and stay with it.",
                consequence: "You choose by fit and comfort, using current information, and you do not chase every new tool.",
                quality: "best",
              },
              {
                text: "Pick Tool B because its feature list matches, without trying either.",
                consequence: "A reasonable choice, but you have not seen how easy it is for you to talk to it.",
                quality: "acceptable",
              },
              {
                text: "Pick Tool A because it is the newest.",
                consequence: "You do not need the newest tool. You need one that fits your project and that you are comfortable using.",
                quality: "poor",
              },
            ],
            hints: [
              "What matters most: being new, or fitting your project?",
              "The lesson suggests trying the same short prompt in two tools.",
              "Answer the questions from each tool's own pages, not old videos.",
            ],
            explanation: "Tools change every month. Fit and comfort matter more than being new, so check the questions on each tool's own pages and try the same prompt in two of them.",
          },
        },
        {
          type: 'tip',
          text: 'Try the same short prompt in two tools, for example "A one-page website for a small bakery with a menu and a contact form." See which result you like and which tool feels easier to talk to. Then pick one and stay with it for this course.',
        },
        {
          type: 'prompt',
          label: 'Compare tools for your project',
          text: "I am a non-coder choosing a vibe-coding tool (for example Lovable, Bolt, Replit or v0) for this project: [paste your GOAL section]. Make a checklist of what my project needs from a tool: publishing, saving data, login, custom domain, version history, exporting code. For each item, tell me what to look for on the tool's own website. Do not tell me prices or claim which tool is best, since those change often.",
        },
        {
          type: 'warning',
          text: 'Read what the tool says about who owns what you build and what happens to your data. Never type passwords, ID numbers or customer details into the chat box. You will learn safe ways to handle secrets in Lesson 17.',
        },
        {
          type: 'paragraph',
          text: 'One more thing: sign up with an email you will keep for years, not a school email that will be closed when you graduate. Your app, your domain and your database will all be tied to that account.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "A developer evaluates a builder like any other dependency: how easily can I leave? Check what it generates (framework, language, styling, backend) and whether the output is ordinary code you can run on your own machine. Check whether repository sync is two-way and whether pull requests and protected branches are possible, so generated changes get reviewed. Look at lock-in in the data layer too: a database you control, with standard SQL migrations kept in the repository, is portable, while proprietary storage is not. Compare how each tool handles environment variables, preview versus production, rollback, team access and audit history. Choose for the exit path as much as for speed.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Lovable's documentation describes a GitHub integration that exports a project to a repository under the GitHub account or organisation you choose, pushes changes made in Lovable there, and syncs commits on the active branch back. Only one branch syncs at a time, each project links to one repository, and an existing repository cannot be linked. Other tools differ: check each one's own documentation.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Lovable docs: GitHub integration",
              url: "https://docs.lovable.dev/integrations/github",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "You do not need the best tool. You need one that fits your project and that you are comfortable using.",
            "Ask whether it can publish, save data, add login, keep a version history, export your code and what its free plan allows.",
            "Check features and prices on each tool's own website, not old videos.",
            "Sign up with an email you will keep for years, because your app, domain and database are tied to that account.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-04-q1',
          prompt: 'What matters most when choosing a tool for this course?',
          choices: [
            'That it fits your project and you are comfortable using it',
            'That it is the newest tool',
            'That a famous person uses it',
          ],
          answer: 0,
          explanation: 'Tools change often. Fit and comfort matter more than being new or popular.',
        },
        {
          id: 'builder-04-q2',
          prompt: 'Why does version history matter?',
          choices: [
            'It makes your app load faster',
            'It lets you go back to a working version after a bad change',
            'It is needed for a custom domain',
            'It removes the free plan limits',
          ],
          answer: 1,
          explanation: 'AI changes sometimes break things. Version history lets you undo them.',
        },
        {
          id: 'builder-04-q3',
          prompt: 'Where should you check a tool\'s current features and prices?',
          choices: [
            'An old video tutorial',
            'A friend\'s guess',
            'The tool\'s own website and help pages',
          ],
          answer: 2,
          explanation: 'Features and prices change often. The tool\'s own pages are the most current source.',
        },
        {
          id: 'builder-04-q4',
          prompt: 'Why sign up with an email you will keep for years?',
          choices: [
            'Your app, domain and database will be tied to that account',
            'Tools reject school emails',
            'It gives you more free credits',
          ],
          answer: 0,
          explanation: 'Losing access to the email can mean losing access to everything you built.',
        },
        {
          id: "builder-04-q5",
          audience: { max: "beginner" },
          prompt: "What does \"version history\" let you do?",
          choices: [
            "See how many people visited your app",
            "Translate your app into another language",
            "Change your colours automatically",
            "Go back to an earlier working copy of your app after a bad change",
          ],
          answer: 3,
          explanation: "Version history works like undo for the whole app. It is the safety net when an AI change breaks something.",
        },
        {
          id: "builder-04-q6",
          audience: { min: "advanced" },
          prompt: "Two builders both publish your app in one click. Which question best measures lock-in?",
          choices: [
            "Which tool has more templates?",
            "Can I sync the code to a repository I own, run it locally, and keep my database and its migrations outside the tool?",
            "Which tool has the shorter onboarding video?",
            "Does the tool offer a free plan?",
          ],
          answer: 1,
          explanation: "Lock-in is about how hard it is to leave. Owning the repository, running the code locally and keeping the database portable are what make moving possible.",
        },
      ],
      task: {
        title: 'Pick your tool',
        steps: [
          'Run the "Compare tools" prompt with your GOAL and keep the checklist.',
          'Check two tools against the checklist using their own websites.',
          'Try the same short bakery prompt in both and compare the results.',
          'Pick one, sign up with a long-term email, and note why you chose it.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write one sentence each, in your own words, for account, version history, export and GitHub. Then find where your chosen tool shows each one.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "For two tools, find the generated stack, git or GitHub support, how environment variables and secrets are set, rollback, and team access. Fill a comparison table with a link to the documentation page for each cell, and list which answers you could not find.",
          ],
        },
      ],
    },
    {
      id: 'builder-05',
      day: 5,
      title: 'Your first build',
      summary: 'Paste your spec, get a first version, test it, and publish a test link.',
      intro: {
        objectives: [
          'Ask for the first screen only, then add the rest one step at a time',
          'Test a screen like a customer, including the phone view',
          'Use made-up test data while you build',
          'Publish a test link and open it on your phone',
        ],
        why: 'Your first build sets the habit for everything after it. Small steps that you test and publish early are what turn a spec into a real, working link.',
      },
      minutes: 15,
      skills: ['prompting-builders', 'launch-and-run'],
      body: [
        {
          type: 'paragraph',
          text: 'Today you build. Open your chosen tool on your laptop and start a new project. You will not ask for the whole app at once. You will ask for the **first screen and the look**, check it, then add the rest step by step.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Some words you will meet today. A **prompt** is the message you type to the AI. A **preview** is a live picture of your app inside the tool, visible only to you, like a rehearsal. **Publishing** is the real performance: it puts a copy online for anyone with the link. A **placeholder** is a stand-in, such as grey boxes where photos will go, so you can judge the layout before you have the real things. Many tools count each message as a **credit**, so small, clear requests also save your allowance. The first result will not be perfect. Treat it as a rough sketch that you will improve, not a finished painting.",
        },
        {
          type: 'prompt',
          label: 'Your first prompt',
          text: "I am building a simple website. Here is my spec:\n\n[paste your whole one-page spec]\n\nFor now, build only the Home screen from the spec, with placeholder images. Use a clean, simple design that works well on phones. Do not add login, payments or a database yet. When you finish, tell me in plain words what you built and what I should test.",
        },
        {
          type: 'paragraph',
          text: 'Why only one screen? Because small steps are easy to check. If something is wrong, you know exactly which request caused it. Big requests produce big, tangled problems.',
        },
        { type: 'heading', text: 'Small steps, one at a time' },
        {
          type: 'paragraph',
          text: 'The rhythm is always the same: ask for one small thing, test it, fix what is wrong, then ask for the next thing. If you paste the whole spec and ask for the full app, a problem can be tangled across all three screens and you cannot tell which part caused it. And if you publish before testing, any hidden hole goes live with the app, even though it looks finished.',
        },
        {
          type: "activity",
          activity: {
            id: "builder-05-scenario-1",
            kind: "scenario",
            title: "The whole app at once?",
            prompt: "What do you ask for?",
            concept: "building in small steps",
            situation: "Your spec has three screens and your tool is open. You are tempted to paste the whole spec and ask for the full app.",
            options: [
              {
                text: "Ask for the Home screen only, test it like a customer, then add the next screen with a new prompt.",
                consequence: "If something is wrong you know exactly which request caused it, and each step is easy to check.",
                quality: "best",
              },
              {
                text: "Ask for the whole app, then test every screen.",
                consequence: "You may get something, but a problem can be tangled across screens and is harder to trace.",
                quality: "acceptable",
              },
              {
                text: "Ask for the whole app and publish it straight away because it looks finished.",
                consequence: "It looks right but nothing has been tested, so any holes go live with it.",
                quality: "poor",
              },
            ],
            hints: [
              "Think about which request caused a problem, if there are several.",
              "Small steps are easy to check.",
              "Build one screen, test, then add the next.",
            ],
            explanation: "Ask for the first screen and the look, check it, then add the rest step by step. Small steps make problems easy to trace.",
          },
        },
        { type: 'heading', text: 'Test like a customer' },
        {
          type: 'list',
          items: [
            'Read every word. Is the shop name right? Are prices in pesos?',
            'Click every button and link. Does each one go somewhere?',
            'Look at the phone view. Most tools have a phone or mobile preview button; your customers will mostly use phones.',
            'Write down anything wrong, one item per line.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Then add the next screen with a new prompt: "Now build the Order form screen from the spec. The Order button on Home should open it." Test again. Keep going one screen at a time.',
        },
        { type: 'heading', text: 'Publish a test link' },
        {
          type: 'paragraph',
          text: 'Most tools have a **Publish** or **Deploy** button that puts your site online at a free address on the tool\'s own domain. Find it and try it. Open the link on your phone. Seeing your work on a real phone, outside the builder, is a great moment, and it is the first step toward your first project.',
        },
        {
          type: 'warning',
          text: 'Use made-up test data while building ("Juan Test", "09000000000"). Never type real customers\' names or numbers into a test version.',
        },
        {
          type: 'tip',
          text: 'Save a copy of every prompt that worked well in a notes file. You will reuse them, and they show you how your prompting improves.',
        },
        {
          type: 'paragraph',
          text: 'Do not worry if the first version is not what you pictured. The first result is a draft, not a verdict on your idea. In the next lessons you will learn to steer it with clear requests, fix it when it breaks and make it look polished. For today, a single working screen at a real link is a win.',
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "You have built small projects, so go one level deeper on the first build. After the first screen appears, find the project's file list and open the file that holds your Home screen. You do not need to understand it, only to recognise your own words in it, such as the shop name and prices. Look for a dependencies file (in many JavaScript projects it is `package.json`) and note what it lists. Then ask the AI: \"List the files you created and what each one is for, one line each.\" This map makes later prompts sharper, because you can name the exact file or component to change.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "A developer does not trust the preview alone. Commit the first generated state to version control as a baseline, so every later change is a reviewable diff, then run the project locally from a clean install and confirm the build passes. Read the dependency list for packages you did not ask for, check that configuration and keys come from environment variables, and keep real credentials out of the repository from the very first commit. Separate environments early: a preview address for testing and a production address for customers, with different data behind each. Know exactly which button in the tool only edits and which one deploys.",
        },
        {
          type: "takeaways",
          items: [
            "Ask for the first screen and the look, check it, then add the rest one step at a time.",
            "Test like a customer: read every word, click everything, check the phone view and write down what is wrong.",
            "Use made-up test data while building, never real customers' details.",
            "Publish a test link and open it on your phone. The first version is a draft, not a verdict.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-05-q1',
          prompt: 'Why build one screen at a time?',
          choices: [
            'Tools only allow one screen',
            'Small steps are easy to check, and you know which request caused a problem',
            'It uses more credits, which makes the app better',
          ],
          answer: 1,
          explanation: 'Small requests give small, checkable changes. Big ones make problems hard to trace.',
        },
        {
          id: 'builder-05-q2',
          prompt: 'Why check the phone view?',
          choices: [
            'It is required to publish',
            'Phone screens show more detail',
            'Most of your visitors will likely use phones',
          ],
          answer: 2,
          explanation: 'Many people browse mainly on phones, so a site that breaks on phones loses them.',
        },
        {
          id: 'builder-05-q3',
          prompt: 'What data should you use while testing?',
          choices: [
            'Made-up test data such as "Juan Test"',
            'Your real customers\' details',
            'Your own bank details',
          ],
          answer: 0,
          explanation: 'Test versions are not protected yet. Fake data keeps real people\'s details safe.',
        },
        {
          id: 'builder-05-q4',
          prompt: 'What does a Publish or Deploy button usually do?',
          choices: [
            'Deletes your old versions',
            'Sends your code to a developer',
            'Buys a domain for you automatically',
            'Puts your site online at a web address',
          ],
          answer: 3,
          explanation: 'Publishing makes the site reachable on the internet, often at a free address on the tool\'s domain.',
        },
        {
          id: "builder-05-q5",
          audience: { max: "beginner" },
          prompt: "What is the difference between a preview and a published app?",
          choices: [
            "A preview is a private test view for you; a published app is online for anyone with the link",
            "A preview costs money and a published app is free",
            "A preview is for phones and a published app is for laptops",
            "There is no difference",
          ],
          answer: 0,
          explanation: "The preview is your rehearsal room. Publishing is what makes the app reachable by other people, which is why you test before you publish.",
        },
        {
          id: "builder-05-q6",
          audience: { min: "advanced" },
          prompt: "The builder's first output works in the preview. What should you do before asking for more changes?",
          choices: [
            "Publish it to production to see real traffic",
            "Commit it as a baseline, run it from a clean install, and read the dependency list and configuration for surprises",
            "Ask for ten more screens while the AI still has the context",
            "Rename the project so it is easier to find",
          ],
          answer: 2,
          explanation: "A committed baseline turns every later AI change into a diff you can review or revert, and a clean run plus a dependency and config read exposes problems the preview hides.",
        },
      ],
      task: {
        title: 'Build and publish your first screen',
        steps: [
          'Start a new project in your tool and paste the first prompt with your spec.',
          'Test the Home screen like a customer, including the phone view, and fix one thing with a follow-up prompt.',
          'Add one more screen with a new prompt and test it.',
          'Press Publish or Deploy and open the link on your phone.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask the AI: \"Explain what you built in two sentences, as if I am new to this, and tell me one thing to click to check it.\" Then write what a preview and a published link are in your own words.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "Find the file for your Home screen and the dependencies file. Ask the AI for a one-line description of every file it created, and save that list with your spec.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Export or sync the project to a repository, make the first commit, run it from a clean checkout, and list every dependency or configuration you would not have chosen yourself.",
          ],
        },
      ],
    },
    {
      id: 'builder-06',
      day: 6,
      title: 'Improving it by talking to the AI',
      summary: 'Clear, specific change requests get you what you want in fewer tries.',
      intro: {
        objectives: [
          'Write a change request that says where, what and how it should look or behave',
          'Say what must not change, with "keep everything else the same"',
          'Send one change at a time and test after each',
          'Rephrase or split a request when the AI gets it wrong twice',
        ],
        why: 'Building with AI is mostly asking for changes. Clear requests get you what you want in fewer tries, which also saves your free credits.',
      },
      minutes: 15,
      skills: ['prompting-builders'],
      body: [
        {
          type: 'paragraph',
          text: 'Building with AI is mostly asking for changes. "Make it better" rarely works, because the AI has to guess what "better" means. Good change requests say **where**, **what** and **how it should look or behave**.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "The AI reads only the words you send. Imagine giving directions to a taxi driver who has never been to your town: \"take me somewhere nice\" gets you somewhere random, but \"the bakery on Rizal Street, next to the pharmacy\" gets you there. A change request works the same way. Name the **place** (which screen), the **thing** (which button, photo or field) and the **result** you want. Also say what must stay the same, because the AI is quick to rewrite things you liked. If you do not know the name of something on the screen, describe it, or attach a screenshot and circle it.",
        },
        { type: 'heading', text: 'Vague versus clear' },
        {
          type: 'list',
          items: [
            'Vague: "Fix the form." Clear: "On the Order form, make the mobile number field required and show \'Please enter your mobile number\' under it if it is empty."',
            'Vague: "Make it nicer." Clear: "On Home, make the cake photos the same size, in two columns on phones and three on laptops."',
            'Vague: "Change the colours." Clear: "Use a warm cream background and a dark brown for the buttons. Keep the text dark and easy to read."',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "builder-06-match-1",
            kind: "match",
            title: "From problem to clear request",
            prompt: "You tested your barbershop site and noticed four problems. Match each problem with the clear change request that fixes it.",
            concept: "clear change requests",
            labels: { terms: "Problems you noticed", meanings: "Clear change request" },
            pairs: [
              {
                term: "Customers can send a booking with no phone number, so Jun cannot confirm them.",
                definition: "On the Booking form, make the mobile number required and show \"We need your number to confirm\" under it if it is empty.",
              },
              {
                term: "On phones, the service photos are all different sizes and the page looks messy.",
                definition: "On Home, make the service photos the same size, in one column on phones and three on laptops.",
              },
              {
                term: "The pale yellow buttons are hard to see on the white background.",
                definition: "Make every button dark blue with white text. Keep everything else the same.",
              },
              {
                term: "Two customers booked the same 3 PM slot.",
                definition: "On the Booking form, hide the time slots that are already booked for the chosen day.",
              },
            ],
            hints: [
              "Each clear request names where, what, and how it should look or behave. Find the one whose \"what\" is your problem.",
              "Photos and columns are about layout; a required field and booked slots are both about the form.",
              "Hard-to-see buttons are a colour problem; a double booking needs taken slots to disappear.",
            ],
            explanation: "Each fix says where (the Booking form, Home, every button), what (the number field, the photos, the colours, the slots) and how it should behave, so the AI has nothing to guess, and the colour request also says what must not change.",
          },
        },
        {
          type: 'paragraph',
          text: 'Notice the pattern in the clear versions. Each one names the **place** (the Order form, Home, every button), the **thing** (the number field, the photos, the colours) and the **behaviour**. Behaviour can also be about what should disappear or be blocked, such as hiding time slots that are already taken so nobody can book them twice. A fix that is only about colour can even say what to leave alone: "Keep everything else the same."',
        },
        { type: 'heading', text: 'Habits that save credits and time' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**One change per message.** Two or three small related changes are fine; ten unrelated ones are not.',
            '**Point at things by name.** Use the words you see on screen: "the Order a cake button", "the Orders list screen".',
            '**Say what must not change.** "Keep everything else the same."',
            '**Ask it to explain.** "Before changing anything, tell me your plan in three bullet points." Many tools also have a chat or plan mode that discusses without editing.',
            '**Test after every change**, then move on.',
          ],
        },
        {
          type: 'prompt',
          label: 'A clear change request',
          text: "On the [screen name] screen, change [the exact thing] so that [how it should look or behave]. Keep everything else exactly the same. After you make the change, tell me in one sentence what you changed and what I should click to check it.",
        },
        {
          type: 'tip',
          text: 'Screenshots help. Many builders let you attach an image. Take a screenshot, and say "the button circled here" or "make this section look like the one in this picture".',
        },
        {
          type: 'paragraph',
          text: 'When the AI gets it wrong twice, stop repeating the same words louder. Describe it differently, give an example, or break the change into two smaller steps. And when a result is good, say so and move on; endless polishing is how first projects never get finished.',
        },
        {
          type: 'warning',
          text: 'Some tools charge a credit per message, including messages that fail. If you notice yourself sending "still wrong" again and again, pause. Lesson 7 shows a calmer way.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "At professional scale a change request becomes a scoped task. Give the agent the files or components in play, the constraints (do not touch other components, no new dependencies, keep the public interface) and an acceptance check it can run. Ask for a plan before any edits and a summary of the diff afterwards, then read the diff yourself: a large, unexplained change is the failure to look for. Where the tool supports persistent project instructions, store the standing rules there, such as the stack, naming and what must never change, so they are not retyped in every message. Prefer many small commits, so each prompt can be reverted on its own.",
        },
        {
          type: "takeaways",
          items: [
            "\"Make it better\" rarely works. Say where, what and how it should look or behave.",
            "One change per message, point at things by name, say what must not change and test after every change.",
            "Ask the AI to explain its plan first, and use screenshots when words are not enough.",
            "When it gets something wrong twice, describe it differently or split it into smaller steps.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-06-q1',
          prompt: 'Which change request is clearest?',
          choices: [
            'Make the page better',
            'Fix everything that looks off',
            'On Home, make the cake photos the same size, two columns on phones; keep everything else the same',
          ],
          answer: 2,
          explanation: 'It says where, what and how, and protects the rest of the page.',
        },
        {
          id: 'builder-06-q2',
          prompt: 'The AI got a change wrong twice. What is the best next move?',
          choices: [
            'Send the same request again in capital letters',
            'Describe it differently, give an example, or split it into smaller steps',
            'Delete the project and start over',
          ],
          answer: 1,
          explanation: 'A different description or a smaller step usually works better than repeating yourself.',
        },
        {
          id: 'builder-06-q3',
          prompt: 'Why say "keep everything else the same"?',
          choices: [
            'It reduces the chance the AI changes parts you were happy with',
            'It makes the app load faster',
            'It is required by every tool',
          ],
          answer: 0,
          explanation: 'AI builders sometimes rewrite more than you asked. Saying what to keep protects working parts.',
        },
        {
          id: "builder-06-q4",
          audience: { max: "beginner" },
          prompt: "Which change request gives the AI the most to work with?",
          choices: [
            "Make the page better",
            "On Home, make the Order button bigger and dark green; keep everything else the same",
            "Fix it",
            "Do something nicer with the colours",
          ],
          answer: 1,
          explanation: "It names the place (Home), the thing (the Order button), the result (bigger, dark green) and what must not change. The others leave the AI to guess.",
        },
        {
          id: "builder-06-q5",
          audience: { min: "advanced" },
          prompt: "An agent turns \"make the button bigger\" into a 400-line diff across six files. What is the best response?",
          choices: [
            "Add a rule asking the agent to be more careful next time",
            "Reject or revert it, restate the scope with the files and constraints, and ask for a plan before any edits",
            "Merge it, since the button looks right in the preview",
            "Ask the agent to write 400 more lines of tests for the diff",
          ],
          answer: 2,
          explanation: "A diff far larger than the request is a signal to stop. Restating scope and asking for a plan first keeps changes small enough to review.",
        },
      ],
      task: {
        title: 'Three clear changes',
        steps: [
          'Look at your app and list three things you want to change.',
          'Rewrite each one as a clear request using the template above.',
          'Send them one at a time and test after each.',
          'Save the request that worked best in your prompts file.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Take one vague request you wrote, such as \"make it nicer\", and rewrite it three times, each time adding the place, the thing and the result. Send the clearest one.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write a persistent instruction block for your project (stack, constraints, what must not change, how to verify). Then send one change with a plan-first request and review the resulting diff line by line, noting anything outside the scope you asked for.",
          ],
        },
      ],
    },
    {
      id: 'builder-07',
      day: 7,
      title: 'When your app breaks',
      summary: 'Read the error, describe it well, roll back when needed, and go in small steps.',
      intro: {
        objectives: [
          'Follow the calm routine when your app breaks',
          'Describe a problem with what you did, what you expected, what happened and the exact error',
          'Roll back to the last working version and retry in a smaller step',
          'Remove secret keys and personal details before you paste an error anywhere',
        ],
        why: 'Every app breaks, and sending more requests in a panic usually makes it worse. A calm routine gets you back to a working app fast and protects your credits.',
      },
      minutes: 15,
      skills: ['fixing-problems', 'prompting-builders'],
      body: [
        {
          type: 'paragraph',
          text: 'Your app will break. Everyone\'s does, including professional developers\'. A blank screen, a red error message, a button that suddenly does nothing. This is normal. What matters is a calm routine.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "An **error message** is the app telling you, in its own stiff way, what it could not do. It often looks like gibberish, but it is a clue, like the warning light on a motorbike dashboard: you do not need to know how the engine works to say which light is on. A **bug** is simply a mistake in the app's instructions. The **console** is a hidden panel in your browser where the page writes down errors as they happen. A **rollback** means going back to an earlier saved version, like pressing undo many times at once. Your job is only to collect the clues and describe them calmly.",
        },
        { type: 'heading', text: 'The calm routine' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Stop changing things.** Do not send three more requests hoping it fixes itself.',
            '**Read the error.** Copy the exact red text, even if it looks like gibberish. Many tools show errors in a panel or have a "fix this error" button.',
            '**Remember what changed.** What was the last thing you asked for before it broke?',
            '**Describe it well.** What you did, what you expected, what happened, and the exact error.',
            '**Roll back if it gets worse.** Use the version history, checkpoints or restore option to go back to the last version that worked.',
            '**Try again smaller.** Ask for the change in a smaller step.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "builder-07-arrange-1",
            kind: "arrange",
            title: "The calm routine",
            prompt: "Put the steps of the calm routine in order for when your app breaks.",
            concept: "fixing problems calmly",
            language: "text",
            solution: [
              "Stop changing things",
              "Copy the exact error text",
              "Remember what you last changed",
              "Describe it: what you did, expected, what happened and the exact error",
              "Roll back to the last working version if it gets worse",
              "Try again with a smaller change",
            ],
            alternatives: [
              [
                "Stop changing things",
                "Remember what you last changed",
                "Copy the exact error text",
                "Describe it: what you did, expected, what happened and the exact error",
                "Roll back to the last working version if it gets worse",
                "Try again with a smaller change",
              ],
            ],
            reasons: [
              "Do not send more requests hoping it fixes itself.",
              "Collect the evidence first; the order of the next two lines can swap.",
              "Collect the evidence first; the order of the previous two lines can swap.",
              "Only now do you have what you need to describe the problem.",
              "If it got worse, go back to safety before trying again.",
              "A smaller step is more likely to work.",
            ],
            hints: [
              "The very first thing is to stop making it worse.",
              "You gather the evidence (the error, the last change) before you describe the problem.",
              "Rolling back comes after you have tried to fix it and it got worse; the smaller retry comes last.",
            ],
            explanation: "Stop, gather the exact error and what you last changed, describe it well, roll back if it gets worse, then try again with a smaller step.",
          },
        },
        {
          type: 'prompt',
          label: 'Describe the problem',
          text: "Something broke. Please fix only this, and keep everything else the same.\n\nWhat I did: [the last change I asked for]\nWhat I expected: [what should happen]\nWhat happened instead: [what you see]\nExact error text: [paste the error]\n\nBefore you change anything, explain in plain words what you think the cause is.",
        },
        {
          type: 'paragraph',
          text: 'If you are unsure where the error is, your browser can show it too. On a laptop, right-click the page, choose **Inspect**, then open the **Console** tab. Red lines there are errors. Copy them into your message.',
        },
        {
          type: 'tip',
          text: 'Set a limit: if two attempts at a fix fail, roll back to the last working version and try a different, smaller approach. Rolling back is not failure; it is the fastest way home.',
        },
        {
          type: 'warning',
          text: 'Errors sometimes contain secret keys or customer details. Before pasting an error into any AI tool, check it and replace anything private with [REMOVED].',
        },
        {
          type: 'paragraph',
          text: 'Over time you will notice patterns. Many problems come from a change that touched too much at once, or from the AI forgetting an earlier rule. Your spec helps here: paste the relevant part again and say "follow this rule from my spec". And Tali\'s **Build buddy** role in this course is made for these moments: tell it the error and what changed, and it will give you one small step at a time.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Debug like an engineer, with the AI as an assistant and not the diagnostician. First reproduce the failure with exact steps and note whether it is deterministic. Then narrow it: use the browser's Network tab to see which request failed and with what status code, read the stack trace from the top frame that is in your own code, and use version history or `git bisect` to find the change that introduced it. Ask for the root cause and the evidence for it before any edit, and require the fix to come with a regression test that fails before and passes after. Tell a symptom patch, such as a try/catch that hides the error, from a real fix, and never let an agent weaken a failing test to make it pass.",
        },
        {
          type: "takeaways",
          items: [
            "Breaking is normal. What matters is a calm routine.",
            "Stop changing things, copy the exact error, remember what you last changed and describe the problem well.",
            "If it gets worse, roll back to the last working version and try again smaller.",
            "Remove secret keys and personal details from errors before you paste them anywhere.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-07-q1',
          prompt: 'Your app shows a red error after your last change. What do you do first?',
          choices: [
            'Send several new requests quickly',
            'Delete the project',
            'Stop, copy the exact error and remember what you last changed',
            'Ignore it and publish',
          ],
          answer: 2,
          explanation: 'The error text plus the last change is what you, the AI or a helper needs to find the cause.',
        },
        {
          id: 'builder-07-q2',
          prompt: 'Two fix attempts have failed and things got worse. What is the sensible move?',
          choices: [
            'Roll back to the last working version and try a smaller step',
            'Keep sending "still broken" until it works',
            'Change the app\'s colours',
          ],
          answer: 0,
          explanation: 'Rolling back gets you to safety quickly. A smaller step is more likely to work.',
        },
        {
          id: 'builder-07-q3',
          prompt: 'What should a good problem description include?',
          choices: [
            'Only "it\'s broken"',
            'What you did, what you expected, what happened and the exact error',
            'Your password so the AI can log in',
          ],
          answer: 1,
          explanation: 'Those four details let the AI understand the problem without guessing.',
        },
        {
          id: 'builder-07-q4',
          prompt: 'Before pasting an error message into an AI tool, you should:',
          choices: [
            'Translate it into Filipino',
            'Shorten it to one word',
            'Add your own guesses into the error text',
            'Check it for secret keys or personal details and remove them',
          ],
          answer: 3,
          explanation: 'Errors can include private information. Remove it before sharing.',
        },
        {
          id: "builder-07-q5",
          audience: { max: "beginner" },
          prompt: "What is an error message?",
          choices: [
            "A prize for finishing a task",
            "A clue the app shows about what went wrong",
            "A setting that makes the app faster",
            "A message from your customers",
          ],
          answer: 1,
          explanation: "An error message is the app's own report of what failed. Copying it exactly gives you, the AI or a helper something concrete to work with.",
        },
        {
          id: "builder-07-q6",
          audience: { min: "advanced" },
          prompt: "A generated fix turns a failing test green by loosening its assertion. What do you do?",
          choices: [
            "Ask the agent to add a second, weaker test as well",
            "Delete the test so it stops failing",
            "Reject it, confirm the original assertion expressed the right behaviour, and fix the code while keeping the test strict",
            "Accept it, because green tests mean the bug is fixed",
          ],
          answer: 3,
          explanation: "A test that is changed to match the bug no longer protects anything. Check what the test should say first, then fix the code.",
        },
      ],
      task: {
        title: 'Practise a safe rollback',
        steps: [
          'Find the version history, checkpoints or restore option in your tool.',
          'Make a small harmless change, such as changing a heading, then roll it back.',
          'On your published site, open Inspect, then the Console tab, and look for any red lines.',
          'Save the "Describe the problem" template in your prompts file.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Open your browser's Console on any website (right-click, Inspect, Console) and just look. Write down one thing you see and what you think its colour means, then check your guess with an AI assistant.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Introduce a deliberate bug, reproduce it with written steps, find the failing request in the Network tab, locate the causing change in version history or with `git bisect`, and write a regression test before accepting the AI's fix.",
          ],
        },
      ],
    },
    {
      id: 'builder-08',
      day: 8,
      title: 'Design basics: layout, colour and text',
      summary: 'A few simple rules make any AI-built site look clean and easy to use.',
      intro: {
        objectives: [
          'Match a common design problem to the rule that fixes it',
          'Give each screen one main action and a button label that says what happens',
          'Choose colours, fonts and contrast that are easy to read on a phone',
          'Use only images and fonts you have the right to use',
        ],
        why: 'A clean design makes a site look trustworthy to customers, and the AI follows these few rules well when you ask for them by name.',
      },
      minutes: 15,
      skills: ['design-basics', 'prompting-builders'],
      body: [
        {
          type: 'paragraph',
          text: 'You do not need to be a designer. A handful of rules makes the difference between a site that looks homemade and one that people trust. AI tools follow these rules well when you ask for them by name.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Design is mostly making things easy to see and easy to tap. **Contrast** is how strongly a word stands out from what is behind it: black on white stands out, light grey on white almost disappears. **White space** is the empty room around things, which lets the eye rest, like clear counter space in a shop. A **font** is the style of the letters. **Responsive** means a page rearranges itself to fit a small phone and a big laptop. You can ask the AI for all of this in plain words (\"bigger text, more space between sections, a darker button\") without any design tool.",
        },
        { type: 'heading', text: 'Layout' },
        {
          type: 'list',
          items: [
            '**One main action per screen.** On Home, that might be "Order a cake". Make it the biggest, most colourful button.',
            '**White space is good.** Space around things makes them easier to read. Crowded pages feel cheap.',
            '**Most important things first.** What the visitor needs most goes at the top.',
            '**Phones first.** Check every screen on a phone-sized view.',
          ],
        },
        { type: 'heading', text: 'Colour' },
        {
          type: 'list',
          items: [
            'Pick **one main colour** (often from your logo) and use it for buttons and links.',
            'Keep backgrounds calm: white, off-white or a very light tint.',
            'Make sure text has strong **contrast** with its background. Light grey on white is hard to read, especially outdoors on a phone.',
          ],
        },
        { type: 'heading', text: 'Text' },
        {
          type: 'list',
          items: [
            'Use one or two fonts at most.',
            'Keep body text large enough to read on a phone without zooming.',
            'Write short sentences and clear button labels: "Order a cake", not "Submit".',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "builder-08-match-1",
            kind: "match",
            title: "Fix the design problem",
            prompt: "Match each design problem with the rule that fixes it.",
            concept: "design basics",
            pairs: [
              {
                term: "Light grey text on a white background",
                definition: "Use strong contrast so text is readable, even outdoors on a phone",
              },
              {
                term: "Five equally bright buttons competing on Home",
                definition: "One main action per screen, as the biggest, most colourful button",
              },
              {
                term: "A button labelled \"Submit\"",
                definition: "A label that says what happens, such as \"Order a cake\"",
              },
              {
                term: "A crowded page with no space",
                definition: "Add white space so things are easier to read",
              },
              {
                term: "Six different fonts",
                definition: "Use one or two fonts at most",
              },
            ],
            hints: [
              "Each rule in the lesson answers one of these problems.",
              "Contrast is about text colour against its background.",
              "A button should say what happens when you tap it.",
            ],
            explanation: "A few simple rules do most of the work: one main action, space, one main colour, strong contrast, one or two fonts and clear labels.",
          },
        },
        {
          type: 'prompt',
          label: 'Ask for a clean design',
          text: "Improve the design of my site without changing what it does. Use one main colour, [your colour, for example dark green], for buttons and links, a calm off-white background, and dark text with good contrast. Use one font for headings and one for body text. Add more space between sections. Make the main button on each screen the most visible thing. Check that every screen works well on a phone. Keep all text and features the same.",
        },
        {
          type: 'tip',
          text: 'Look at three websites you like in your field. Write down what they have in common (often: big photo, short headline, one clear button). Describe that pattern to the AI instead of saying "make it look like that site".',
        },
        {
          type: 'warning',
          text: 'Only use photos, logos and fonts you have the right to use: your own photos, your own logo, or images from sources that clearly allow your use. Copying someone else\'s photos or brand can get you into trouble.',
        },
        {
          type: 'paragraph',
          text: 'You now have everything for your first project: a small site, a clean design and a published link. Head to **Project 1** when you are ready.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Move from taste to measurable rules. WCAG 2.2 sets, at level AA, a contrast ratio of at least 4.5:1 for normal text and 3:1 for large-scale text, and a minimum pointer target of 24 by 24 CSS pixels with some exceptions. Check colours with a contrast calculator or a browser audit instead of judging by eye. Have the AI define design tokens once (colours, spacing, type sizes) so every component uses the same variables and a redesign is one change. Then test the real constraints: keyboard focus order and a visible focus style, text that scales without breaking the layout, long names and translations, slow connections, and images with set dimensions in a modern format so the page does not jump while loading.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "WCAG 2.2 (W3C Recommendation, 12 December 2024): Success Criterion 1.4.3 Contrast (Minimum), level AA, requires at least 4.5:1 for text and 3:1 for large-scale text. Success Criterion 2.5.8 Target Size (Minimum), level AA, requires pointer targets of at least 24 by 24 CSS pixels, with exceptions such as spacing, an equivalent control, inline links, user-agent controls and essential presentation.",
          checked: "2026-11-14",
          sources: [
            {
              label: "W3C: WCAG 2.2",
              url: "https://www.w3.org/TR/WCAG22/",
            },
            {
              label: "W3C: Understanding Target Size (Minimum)",
              url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "One main action per screen, as the biggest, most colourful button.",
            "White space makes things easier to read, and the most important things go first. Check every screen on a phone.",
            "Use one main colour, calm backgrounds and strong contrast, one or two fonts, and button labels that say what happens.",
            "Only use photos, logos and fonts you have the right to use.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-08-q1',
          prompt: 'How many main actions should a screen usually have?',
          choices: ['One', 'As many as possible', 'At least five'],
          answer: 0,
          explanation: 'One clear main action tells visitors what to do and makes the page easy to use.',
        },
        {
          id: 'builder-08-q2',
          prompt: 'Why does contrast matter?',
          choices: [
            'It makes pages load faster',
            'Low-contrast text, like light grey on white, is hard to read, especially on phones outdoors',
            'Search engines require dark mode',
          ],
          answer: 1,
          explanation: 'Good contrast keeps text readable for everyone, in every light.',
        },
        {
          id: 'builder-08-q3',
          prompt: 'Which button label is best?',
          choices: ['Submit', 'Click here', 'OK', 'Order a cake'],
          answer: 3,
          explanation: 'A label that says what happens tells the visitor exactly what they are doing.',
        },
        {
          id: 'builder-08-q4',
          prompt: 'Which images are safe to use on your site?',
          choices: [
            'Any image found on Google',
            'A competitor\'s product photos',
            'Your own photos, or images whose source clearly allows your use',
          ],
          answer: 2,
          explanation: 'Use only images you own or are clearly allowed to use, to respect other people\'s rights.',
        },
        {
          id: "builder-08-q5",
          audience: { max: "beginner" },
          prompt: "What does \"contrast\" mean in design?",
          choices: [
            "How strongly text stands out from its background",
            "How big a picture is on the page",
            "How many colours a page uses",
            "How fast the page loads on a phone",
          ],
          answer: 0,
          explanation: "High contrast means the words are easy to tell apart from what is behind them. Low contrast, like light grey on white, is hard to read, especially outdoors.",
        },
        {
          id: "builder-08-q6",
          audience: { min: "advanced" },
          prompt: "A brand colour on a white button gives normal-size button text a measured contrast ratio of 3.2:1. What does WCAG 2.2 level AA say?",
          choices: [
            "It passes as long as the button is blue",
            "Contrast only matters for images and logos",
            "It fails for normal text, which needs 4.5:1, so darken the colour or make the text large-scale",
            "It passes, because 3:1 is the rule for all text",
          ],
          answer: 3,
          explanation: "The 3:1 ratio applies only to large-scale text. Normal text needs 4.5:1, so the colour must be darkened or the text made large enough to count as large-scale.",
        },
      ],
      task: {
        title: 'Give your site a clean look',
        steps: [
          'Look at three sites you like in your field and write down what they share.',
          'Send the "clean design" prompt with your main colour.',
          'Check every screen on a phone view and fix one thing that is hard to read or tap.',
          'Publish again and send the link to one friend for a first opinion.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Look at three shop signs or social posts. For each, say whether the words stand out strongly from the background and where there is enough white space. Then ask the AI to describe your own page in the same words.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Measure the contrast ratio of your text and button colours with a contrast checker and fix any that fall below WCAG AA. Move colours and spacing into design tokens, and check that every tap target is at least 24 by 24 CSS pixels.",
          ],
        },
      ],
    },
    {
      id: 'builder-09',
      day: 9,
      title: 'Forms and data',
      summary: 'How forms collect information, where it goes, and how to check it really saved.',
      intro: {
        objectives: [
          'Name the places a form answer can go, and the best one for a list you update',
          'Check that a form really saves instead of trusting a thank-you message',
          'Add required fields, format checks and clear messages',
          'Test a form three ways: correct, empty and nonsense',
        ],
        why: 'A form that looks right but saves nothing loses you real orders and bookings. Knowing where the answers go is the part beginners miss.',
      },
      minutes: 15,
      skills: ['data-and-login', 'fixing-problems'],
      body: [
        {
          type: 'paragraph',
          text: 'A form is how your app collects information: an order, a booking, a sign-up. Building a form that **looks** right is easy. Making sure the information really goes somewhere safe is the part beginners miss.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **form** is a set of boxes people fill in, plus a button to send them, like the paper order slip at a bakery counter. Each box is a **field**. When someone presses the button, the information must travel somewhere and be written down. That step is called **saving**, and it is easy to fake: a form can show \"Thank you!\" without writing anything, just as a shop assistant can nod without noting your order. **Validation** means checking an answer before accepting it, for example that a phone number has enough digits. Always find your test entry afterwards, because that is the only real proof it was saved.",
        },
        { type: 'heading', text: 'Where can form answers go?' },
        {
          type: 'list',
          items: [
            '**Nowhere.** The form shows "Thank you!" but saves nothing. AI tools sometimes build this as a placeholder. It is the most common surprise.',
            '**An email to you.** Simple, but messages can get lost and are hard to search.',
            '**A form service or spreadsheet.** Fine for simple cases.',
            '**A database** that your app reads and writes. Best when you need a list you can update, like order statuses. Lesson 11 explains databases.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "builder-09-tap-1",
            kind: "tap-reveal",
            title: "Where do form answers go?",
            prompt: "Tap each place a form can send its answers to see what to know about it.",
            concept: "where form data goes",
            cards: [
              {
                front: "Nowhere",
                back: "The form shows \"Thank you!\" but saves nothing. AI tools sometimes build it as a placeholder. It is the most common surprise.",
              },
              {
                front: "An email to you",
                back: "Simple, but messages can get lost and are hard to search.",
              },
              {
                front: "A form service or spreadsheet",
                back: "Fine for simple cases.",
              },
              {
                front: "A database",
                back: "Best when you need a list you can update, like order statuses.",
              },
            ],
            hints: [
              "Open the cards in any order.",
              "You are done when all four are open.",
            ],
            explanation: "A form that looks right can send its answers nowhere. Always check where the entry went, and choose the place that fits what you need to do with it.",
          },
        },
        {
          type: 'prompt',
          label: 'Ask where the data goes',
          text: "Look at the [form name] form in my app. In plain words: when someone presses the button, where does their information go right now? Is it saved anywhere I can see later? If it is not saved, do not change anything yet; just tell me my options for saving it, from simplest to most flexible.",
        },
        { type: 'heading', text: 'Good forms check what people type' },
        {
          type: 'list',
          items: [
            '**Required fields:** mark them and block sending until they are filled.',
            '**Format checks:** a mobile number looks like a mobile number; a date is not in the past.',
            '**Clear messages:** "Please enter a pick-up date at least 2 days from today", right next to the field.',
            '**Only ask what you need.** Every extra field is one more reason to give up, and more personal data to protect.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Checks in the page are for convenience; someone determined can get around them. For anything important, ask the AI to "also check this on the server or database side". You do not need to understand how; you need to know to ask.',
        },
        {
          type: 'tip',
          text: 'Test every form three ways: fill it correctly, leave required fields empty, and type nonsense. Then check where the correct one went. If you cannot find your test entry, it was not saved.',
        },
        {
          type: 'warning',
          text: 'If your form collects personal details (names, numbers, addresses), you are responsible for keeping them safe. Add a short line telling people what you collect and why. Lesson 17 covers this.',
        },
        {
          type: 'paragraph',
          text: 'Finally, think about what happens after someone sends the form. Do they see a clear message that says what comes next, such as "Thanks! We will text you within a day to confirm"? Do you get notified, or do you have to remember to check? Small touches like these turn a form into a process you can trust.',
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "You have probably built a form before, so check where the checking happens. Validation in the page is quick feedback, but anyone can skip the page and send data straight to the server. Ask the AI: \"Show me where each rule on this form is enforced: in the page, on the server, or in the database.\" A good answer has the important rules in the database too, such as required columns and an allowed list of values for status, so bad data cannot get in even if the form is bypassed. Try it yourself: open the browser's developer tools on the Network tab, submit the form, and look at the request that was sent.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat client-side validation as user experience and server-side validation as the security control. OWASP's guidance says the server must validate the same fields because browser checks can be bypassed, and it prefers allowlist rules, which define what valid input looks like, over trying to block bad strings. Back the rules with database constraints: NOT NULL, CHECK, foreign keys and unique indexes. Make submission safe to repeat, so a double click or a network retry creates one record, using a unique constraint or an idempotency key. Add abuse controls to public forms: rate limiting, a honeypot field or CAPTCHA, size limits, and output encoding wherever stored text is shown again, so a pasted script is displayed as text instead of running.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "OWASP's Input Validation Cheat Sheet says client-side checks are not enough because they can be bypassed, so the server must validate the same fields, and it recommends allowlist validation over denylists.",
          checked: "2026-11-14",
          sources: [
            {
              label: "OWASP Cheat Sheet: Input Validation",
              url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "A form that looks right can save nothing. Check where the answers really go.",
            "Answers can go nowhere, to an email, to a form service or spreadsheet, or to a database. A database is best for lists you update.",
            "Good forms mark required fields, check formats, give clear messages and ask only for what you need.",
            "Test every form three ways: correct, empty and nonsense, then find your correct entry.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-09-q1',
          prompt: 'Your form says "Thank you!" after sending. Does that prove the data was saved?',
          choices: [
            'Yes, the message means it saved',
            'No. Check where the entry went; some forms save nothing',
            'Yes, if the button was blue',
          ],
          answer: 1,
          explanation: 'A thank-you message can be shown even when nothing is saved. Find your test entry to be sure.',
        },
        {
          id: 'builder-09-q2',
          prompt: 'When is a database the best place for form answers?',
          choices: [
            'When you need a list you can update, like order statuses',
            'Never, email is always better',
            'Only for apps with a million users',
          ],
          answer: 0,
          explanation: 'A database suits information you will list, search and update inside your app.',
        },
        {
          id: 'builder-09-q3',
          prompt: 'Why ask only for the information you need?',
          choices: [
            'Databases cannot store long forms',
            'It makes the page more colourful',
            'Fewer fields mean fewer people give up, and less personal data to protect',
          ],
          answer: 2,
          explanation: 'Short forms are easier to finish and reduce your privacy responsibility.',
        },
        {
          id: "builder-09-q4",
          audience: { max: "beginner" },
          prompt: "What does \"validation\" mean for a form?",
          choices: [
            "Checking an answer before accepting it, such as a phone number having enough digits",
            "Making the form look nicer on a phone",
            "Sending the answer to a friend for approval",
            "Deleting old entries to save space",
          ],
          answer: 1,
          explanation: "Validation is a check on what was typed before it is accepted. It protects you from empty or nonsense entries.",
        },
        {
          id: "builder-09-q5",
          audience: { min: "advanced" },
          prompt: "A public order form validates the phone number in the page only. What is the best next step?",
          choices: [
            "Nothing, because the browser already blocks bad numbers",
            "Hide the address the form sends to",
            "Enforce the same rule on the server and with a database constraint, because requests can bypass the page",
            "Add more JavaScript checks in the page",
          ],
          answer: 3,
          explanation: "Anyone can send a request without using your page, so page checks are only convenience. The server and the database must enforce the rule.",
        },
      ],
      task: {
        title: 'Test your form properly',
        steps: [
          'Send the "Ask where the data goes" prompt about your main form.',
          'Add required fields and clear error messages with one clear request.',
          'Test the form three ways: correct, empty and nonsense.',
          'Find your correct test entry wherever it was saved. If you cannot find it, note that for Lesson 11.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Fill in your form with a made-up name and send it. Write down what you expect happened, then ask the AI: \"In plain words, where did my entry go?\" and check that its answer matches what you find in your tool.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "Ask the AI where each rule is enforced (page, server or database). Open the Network tab, submit the form once, and note the request's address and the data it sent.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Bypass the page: send the request with `curl` or the browser's network tools using invalid values, and confirm the server and database reject them. Add a database constraint for one rule and a test for the double-submit case.",
          ],
        },
      ],
    },
    {
      id: 'builder-10',
      day: 10,
      title: 'Adding login',
      summary: 'What login does, the common ways to sign in, and how to ask for it safely.',
      intro: {
        objectives: [
          'Explain what login (authentication) does for your app',
          'Decide who really needs an account in your own app',
          'Ask for login from an established service instead of homemade password storage',
          'Test protected pages as a stranger and with two accounts of different roles',
        ],
        why: 'If your app has anything private, such as the owner\'s order list, login is what keeps strangers out. Getting it right is the difference between a safe app and an open one.',
      },
      minutes: 15,
      skills: ['data-and-login', 'prompting-builders'],
      body: [
        {
          type: 'paragraph',
          text: 'Login (also called **authentication**, or "auth") lets your app know who someone is. You need it when different people should see different things: Rosa sees all orders, a customer sees only their own, a stranger sees none.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Two ideas sound alike but are different. **Authentication** is proving who you are, like showing your ID at the entrance. **Authorisation** is what you are allowed to do once inside, like a key that opens the staff room but not the safe. An **account** is a saved identity: usually an email address plus a way to prove it is you, such as a password or a code sent to your email. A **session** is how the app remembers you are signed in, so you do not have to log in again on every page. Most apps need both ideas: login to know who you are, then rules for what each person may see.",
        },
        { type: 'heading', text: 'Do you really need it?' },
        {
          type: 'paragraph',
          text: 'Login adds work for you and for your users. A simple shop site where customers only send requests may need login only for **you**, the owner, to see the list. Ask yourself: who needs an account, and why?',
        },
        { type: 'heading', text: 'Common ways to sign in' },
        {
          type: 'list',
          items: [
            '**Email and password:** familiar to everyone. Needs a "forgot password" flow.',
            '**Magic link or code:** the app emails a link or a one-time code. No password to forget.',
            '**Sign in with Google (or another provider):** quick for users, but needs some setup in that provider\'s settings.',
          ],
        },
        {
          type: "table",
          caption: "Common ways to sign in",
          headers: [
            "Way to sign in",
            "How it works",
            "Keep in mind",
          ],
          rows: [
            [
              "Email and password",
              "Familiar to everyone",
              "Needs a \"forgot password\" flow",
            ],
            [
              "Magic link or code",
              "The app emails a link or a one-time code",
              "No password to forget",
            ],
            [
              "Sign in with Google",
              "Quick for users",
              "Needs some setup in the provider's settings",
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Never let the AI invent its own way of storing passwords. Ask it to use the login feature of an established service, such as the one built into the database service your tool connects to. These services handle the hard, risky parts for you.',
        },
        {
          type: "visual",
          id: "web-auth-flow",
          caption: "Step through a login and see what happens when it goes wrong.",
        },
        {
          type: 'prompt',
          label: 'Ask for login, safely',
          text: "Add login to my app using the built-in authentication of the service my app already uses (or the one you recommend for this tool). Use email sign-in. Rules: only signed-in users can open the [screen name] screen; [describe who can see what, for example: only the owner account can see all orders]. Do not store passwords yourself. Explain in plain words what you set up and anything I need to turn on in a settings page.",
        },
        {
          type: 'warning',
          text: 'A hidden button is not protection. If the Orders page is just "not linked", anyone who guesses the address can open it. Ask the AI to block access to the page **and** to the data behind it for people who are not allowed.',
        },
        {
          type: "activity",
          activity: {
            id: "builder-10-scenario-1",
            kind: "scenario",
            title: "Who needs an account?",
            prompt: "How do you set up login?",
            concept: "authentication",
            situation: "Rosa's cake site only lets customers send an order request, and Rosa wants to see all the requests in a list.",
            options: [
              {
                text: "Add login for Rosa only, so only the owner account can open the Orders list.",
                consequence: "Customers send requests without signing in, and the list stays private.",
                quality: "best",
              },
              {
                text: "Ask every customer to create an account before they can order.",
                consequence: "It works, but adds effort for you and your customers that this site does not need.",
                quality: "acceptable",
              },
              {
                text: "Skip login and just leave the Orders page without a link.",
                consequence: "Anyone who guesses the address can open it. Hidden is not protected.",
                quality: "poor",
              },
            ],
            hints: [
              "Ask who needs an account, and why.",
              "Customers only send requests. Who needs to see the list?",
              "Not linking a page does not stop people opening it.",
            ],
            explanation: "A simple shop site may need login only for the owner. Access to the page and its data must be blocked for everyone else, not merely hidden.",
          },
        },
        {
          type: 'tip',
          text: 'Test login like a stranger: open your site in a private or incognito browser window, where you are signed out, and try to open the protected page\'s address directly. You should be blocked or sent to sign in.',
        },
        {
          type: 'paragraph',
          text: 'Make two test accounts with different roles, for example an owner and a customer, and check that each sees only what they should. This ten-minute test catches the most dangerous mistakes in beginner apps.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Do not build authentication; integrate it. Prefer a managed identity provider or your database platform's auth, and verify what the generated code actually does: where the session or token is stored, how long it lasts, whether it can be revoked, and whether every API route and database query checks the user on the server. Authentication says who; authorisation decides what, so design roles and ownership rules explicitly and enforce them in one place, ideally with database policies. OWASP's guidance includes generic error messages for login and reset so accounts cannot be enumerated, limiting failed attempts per account, and multi-factor authentication where practical. Test authorisation with two real users, including attempts to read or change each other's rows by editing an identifier in the request.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "OWASP's Authentication Cheat Sheet recommends that login, password reset and registration do not reveal whether an account exists (including through timing and status codes), limits failed attempts per account, and recommends multi-factor authentication wherever practical.",
          checked: "2026-11-14",
          sources: [
            {
              label: "OWASP Cheat Sheet: Authentication",
              url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Login (authentication) lets your app know who someone is, so different people see different things.",
            "Ask who really needs an account, and why. A simple shop may need login only for the owner.",
            "Use an established service's built-in login. Never let the AI invent its own password storage.",
            "A hidden page is not protected. Test as a stranger in a private window, with two accounts of different roles.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-10-q1',
          prompt: 'What does login (authentication) let your app do?',
          choices: [
            'Load faster',
            'Know who someone is, so different people see different things',
            'Get a custom domain',
          ],
          answer: 1,
          explanation: 'Authentication identifies the user so the app can decide what they may see and do.',
        },
        {
          id: 'builder-10-q2',
          prompt: 'How should your app handle passwords?',
          choices: [
            'Use an established service\'s built-in login instead of a homemade one',
            'Let the AI write its own password storage',
            'Store them in a spreadsheet',
          ],
          answer: 0,
          explanation: 'Established login services handle the risky parts properly. Homemade password storage is easy to get wrong.',
        },
        {
          id: 'builder-10-q3',
          prompt: 'The Orders page has no link on your site. Is it protected?',
          choices: [
            'Yes, nobody can find it',
            'Yes, if the address is long',
            'No. Anyone with the address can open it unless access is blocked',
          ],
          answer: 2,
          explanation: 'Hidden is not protected. Access to the page and its data must be blocked for the wrong people.',
        },
        {
          id: 'builder-10-q4',
          prompt: 'What is a good way to test your login?',
          choices: [
            'Only test with the owner account',
            'Use a private window to try the protected address while signed out, and test two accounts with different roles',
            'Ask the AI if it works',
          ],
          answer: 1,
          explanation: 'Testing as a stranger and as each role shows whether the rules really hold.',
        },
        {
          id: "builder-10-q5",
          audience: { max: "beginner" },
          prompt: "What is the difference between authentication and authorisation?",
          choices: [
            "Authentication is about colours and authorisation is about fonts",
            "Authentication proves who you are; authorisation decides what you may do",
            "They are two names for the same thing",
            "Authentication is for owners and authorisation is for customers",
          ],
          answer: 2,
          explanation: "Authentication is the ID check at the door. Authorisation is which rooms your key opens. An app needs both.",
        },
        {
          id: "builder-10-q6",
          audience: { min: "advanced" },
          prompt: "User A changes the identifier in a request from 41 to 42 and receives user B's order. Which control is missing?",
          choices: [
            "A longer session timeout",
            "Per-row authorisation enforced on the server or by a database policy, not only a signed-in check",
            "A stronger password policy",
            "A different font on the order page",
          ],
          answer: 2,
          explanation: "Being signed in only proves identity. The server or database must also check that this user owns or may read that specific row.",
        },
      ],
      task: {
        title: 'Plan and add login',
        steps: [
          'Write down who needs an account and what each person may see.',
          'Send the "Ask for login, safely" prompt with your rules.',
          'Create two test accounts with different roles.',
          'In a private window, try to open the protected page while signed out.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Draw two columns on paper: \"who are you\" (authentication) and \"what may you do\" (authorisation). Put three things from your own app in each column.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Create two users and try to read, update and delete the other user's rows by changing identifiers in requests. Record each result in a table and fix any that succeeds. Also check token lifetime, logout, and the error text of a failed login.",
          ],
        },
      ],
    },
    {
      id: 'builder-11',
      day: 11,
      title: 'What a database is, in plain words',
      summary: 'Tables, rows and access rules: enough to ask for a database and check it.',
      intro: {
        objectives: [
          'Explain tables, rows, columns and IDs using a spreadsheet',
          'Ask the AI for a database built from your spec\'s DATA section',
          'Explain why access rules matter and what to do about a security warning',
          'Prove a form saves by finding your test row in the database dashboard',
        ],
        why: 'A database keeps your orders and accounts safe and still there tomorrow. Without access rules it is like a notebook left open, so you must know to ask for them.',
      },
      minutes: 15,
      skills: ['data-and-login'],
      body: [
        {
          type: 'paragraph',
          text: 'A **database** is where your app keeps information so it is still there tomorrow: orders, accounts, bookings. If you have used a spreadsheet, you already understand most of it.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**Data** is just remembered facts: a name, a date, a price. A program forgets everything the moment it closes, unless the facts are written somewhere lasting. A database is that lasting place, kept on a server, so the facts are still there tomorrow and reachable from any phone. Think of a filing cabinet in the shop's back office: each drawer is a **table**, each card in it is a **row**, and each line on a card is a **column**. A **service** such as Supabase hosts the cabinet for you online. What matters most is the lock on the cabinet, which is what access rules are.",
        },
        {
          type: 'list',
          items: [
            'A **table** is like one sheet: one table for orders, another for products.',
            'A **row** is one item: one order.',
            'A **column** is one detail: name, mobile number, pick-up date.',
            'Each row gets a unique **ID**, so the app can find and update exactly that one.',
          ],
        },
        {
          type: 'code',
          language: 'text',
          label: 'An orders table, pictured as a sheet',
          code: `orders
id  | name       | mobile       | cake     | pickup_date | status
----+------------+--------------+----------+-------------+----------
1   | Juan Test  | 09000000000  | Ube      | 2026-12-01  | New
2   | Ana Test   | 09000000001  | Chocolate| 2026-12-03  | Confirmed`,
        },
        {
          type: "activity",
          activity: {
            id: "builder-11-match-1",
            kind: "match",
            title: "Tables, rows and columns",
            prompt: "Match each database word with what it is, using the orders table as your example.",
            concept: "database basics",
            pairs: [
              {
                term: "Table",
                definition: "Like one sheet, such as all the orders",
              },
              {
                term: "Row",
                definition: "One item, such as one order",
              },
              {
                term: "Column",
                definition: "One detail, such as the mobile number",
              },
              {
                term: "ID",
                definition: "A unique number so the app can find and update exactly one row",
              },
            ],
            hints: [
              "Picture a spreadsheet: sheets, rows across, columns down.",
              "A row is one whole order; a column is one detail of every order.",
              "The ID is what makes each row different from all the others.",
            ],
            explanation: "A table is a sheet, each row is one item, each column is one detail, and a unique ID lets the app find exactly the row it wants.",
          },
        },
        {
          type: 'paragraph',
          text: 'Your spec\'s DATA section already describes your tables. That is why you wrote it. Many vibe-coding tools connect to a hosted database service (Supabase is a common example) and can create the tables for you from a description.',
        },
        {
          type: 'prompt',
          label: 'Ask for your database',
          text: "Set up a database for my app using the database service this tool supports. Create the tables from the DATA section of my spec:\n\n[paste your DATA section]\n\nConnect the [form name] form so it saves a new row, and the [list screen] screen so it shows the rows. Add access rules so that [describe who can read and change what]. Then explain in plain words: what tables you made, and what each access rule allows.",
        },
        { type: 'heading', text: 'Access rules are the important part' },
        {
          type: 'paragraph',
          text: 'A database without access rules can be like a notebook left open on a jeepney seat. Database services let you set rules about who can read, add, change or delete each row. Supabase, for example, calls these **row level security** policies. You do not need to write them yourself, but you must ask for them and test them.',
        },
        {
          type: 'warning',
          text: 'If your tool or database service warns that a table has no access rules or that security is off, do not ignore it. Ask the AI: "Explain this warning in plain words and fix it so only [who] can see this data."',
        },
        {
          type: 'tip',
          text: 'Open your database service\'s dashboard and look at the table view. After you send a test order, refresh and find the new row. Seeing your own test data appear is the best proof the connection works.',
        },
        {
          type: 'paragraph',
          text: 'One more habit: do not delete columns or tables casually. Deleting a column deletes that detail for every row, and it may not come back. Before big changes, ask the AI whether existing data will be lost, and check whether your database service has backups on your plan.',
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "At this level, read one real policy. In Supabase an access rule is a row level security policy written in SQL. Ask the AI: \"Show me every policy on my tables and explain each in one plain sentence.\" Look for three things: row level security is switched on for each table, there is a rule for each action you need (read, add, change, delete), and the rules that say who, such as only the owner account, are not simply `true`. A policy that allows everything is the same as having no rule. Then test each rule from two accounts and while signed out.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Design the schema before the AI does: identifiers, foreign keys, NOT NULL and CHECK constraints, indexes for the lookups you actually run, and migrations kept in version control so every environment can be rebuilt. For access, enable row level security on every table in an exposed schema, because a table without it is readable and writable by any role that has grants on it. Policies should name roles and compare the signed-in user's id. A request with no user gives a null id, so handle that case explicitly. The service key bypasses these rules and must never reach the browser. Write policy tests as SQL that runs as each role, for example:",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "sql",
          label: "Two policies for an orders table (tested on PostgreSQL 14 with a stand-in for auth.uid())",
          code: "alter table orders enable row level security;\n\n-- Anyone may send an order, but only as a new one.\ncreate policy \"send an order\" on orders\n  for insert to anon, authenticated\n  with check (status = 'New');\n\n-- Only the owner role may read orders.\ncreate policy \"owner reads orders\" on orders\n  for select to authenticated\n  using (exists (\n    select 1 from profiles p\n    where p.id = (select auth.uid()) and p.role = 'owner'\n  ));",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Supabase's row level security guide says a table in an exposed schema without RLS is readable and writable by any role with a grant on it; that a secret key (the service_role) bypasses RLS and must stay out of the browser; that auth.uid() returns null when no user is authenticated, so policies should check for that explicitly; and that with RLS enabled and no policies, no data is accessible through the API with a publishable key until policies are created.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Supabase docs: Row Level Security",
              url: "https://supabase.com/docs/guides/database/postgres/row-level-security",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "A database keeps information so it is still there tomorrow. It works much like a spreadsheet.",
            "A table is a sheet, a row is one item, a column is one detail, and each row has a unique ID.",
            "Your spec's DATA section already describes your tables.",
            "Access rules decide who can read, add, change or delete each row. Ask for them and test them as a stranger.",
            "Do not delete columns or tables casually, and check how your data is backed up.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-11-q1',
          prompt: 'In a database, what is a row?',
          choices: [
            'One detail, like a phone number',
            'One item, like one order',
            'The whole database',
          ],
          answer: 1,
          explanation: 'A row is one record. Columns are the details each record has.',
        },
        {
          id: 'builder-11-q2',
          prompt: 'Why do access rules matter?',
          choices: [
            'They control who can read, add, change or delete data',
            'They make the database bigger',
            'They are only needed for payments',
          ],
          answer: 0,
          explanation: 'Without rules, people may see or change data that is not theirs.',
        },
        {
          id: 'builder-11-q3',
          prompt: 'Your database service warns that a table has no security rules. What should you do?',
          choices: [
            'Ignore it; warnings are normal',
            'Delete the table',
            'Publish quickly before anyone notices',
            'Ask the AI to explain it in plain words and fix it so only the right people can see the data',
          ],
          answer: 3,
          explanation: 'Security warnings point to real risks. Understand and fix them before launch.',
        },
        {
          id: 'builder-11-q4',
          prompt: 'What is the best proof that your form saves to the database?',
          choices: [
            'The AI says it works',
            'The form turns green',
            'You send a test entry and find the new row in the database dashboard',
          ],
          answer: 2,
          explanation: 'Finding your own test row shows the connection really works.',
        },
        {
          id: "builder-11-q5",
          audience: { max: "beginner" },
          prompt: "Why do apps use a database instead of keeping facts only inside the running program?",
          choices: [
            "A database stops customers from using phones",
            "The facts are saved somewhere lasting, so they are still there tomorrow",
            "A database makes the page prettier",
            "Programs cannot show text without one",
          ],
          answer: 2,
          explanation: "A program forgets everything when it closes. A database keeps the facts, such as orders, on a server so they are there tomorrow and from every phone.",
        },
        {
          id: "builder-11-q6",
          audience: { min: "advanced" },
          prompt: "A table has row level security enabled and no policies. What does an API request using a publishable key get?",
          choices: [
            "No rows and no writes until a policy allows them",
            "Every row, since no rule restricts it",
            "Only the rows created today",
            "Only the rows created from the same network address",
          ],
          answer: 1,
          explanation: "With RLS on and no policy, access is denied by default. Policies are what open access, so a missing policy fails closed instead of exposing data.",
        },
      ],
      task: {
        title: 'Connect your first table',
        steps: [
          'Send the "Ask for your database" prompt with your DATA section and access rules.',
          'Open the database dashboard and find your table.',
          'Send a test entry through your form and find the new row.',
          'Sign out and check that a stranger cannot see the list.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "On paper, draw a table for your own data with the column names as headings and three made-up rows. Ask the AI to compare your drawing with the table it built, and explain any differences.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "Ask the AI to list every access policy on your tables in one plain sentence each. Mark any that allow everyone, and ask the AI to tighten them.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write down the schema with types and constraints, enable row level security on each table, and write one policy per role and action. Write a SQL test that runs as each role (signed out, customer, owner) and checks the rows returned and the writes refused, and confirm the service key is nowhere in the front end.",
          ],
        },
      ],
    },
    {
      id: 'builder-12',
      day: 12,
      title: 'Images and files',
      summary: 'Uploading photos and documents safely, keeping them small, and deciding who can see them.',
      intro: {
        objectives: [
          'Explain where uploaded files are stored and what a bucket is',
          'Decide which images can be public and which uploads must stay private',
          'Resize photos and add alt text to keep pages fast and accessible',
          'Test that a private file does not open when you are signed out',
        ],
        why: 'Customers will upload payment screenshots and photos, and big photos can slow your site down. Storing and sharing files carefully keeps both your site and your customers safe.',
      },
      minutes: 15,
      skills: ['data-and-login', 'design-basics'],
      body: [
        {
          type: 'paragraph',
          text: 'Most apps need pictures: product photos, a profile picture, a receipt someone uploads. Files are not usually stored inside the database table itself. They go into **file storage** (often called a "bucket"), and the table keeps a link to each file.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **file** is any saved item: a photo, a PDF, a scan of a receipt. To **upload** is to send a file from your phone to the app's computer. Photos are measured in **megabytes** (MB). A modern phone photo can be several MB, like carrying a full sack when a small bag would do, and it makes pages slow on mobile data. A **bucket** is a labelled storage box on a server for files. Boxes can be public, like a notice board, or private, like a locker that opens only for the right person. Before you save a file, ask whether you would be happy to pin it on a notice board.",
        },
        { type: 'heading', text: 'Two kinds of images' },
        {
          type: 'list',
          items: [
            '**Your own images** (logo, product photos, banner): you add them once. They can be public.',
            '**Uploads from users** (a payment screenshot, a photo of a damaged item): they arrive every day. These are often **private**, so only the owner and that user should see them.',
          ],
        },
        { type: 'heading', text: 'Keep them small' },
        {
          type: 'paragraph',
          text: 'Photos straight from a phone camera are often several megabytes. Large images make your site slow, especially on mobile data. Resize product photos before uploading (a width of around 1200 pixels is plenty for most websites) and ask the AI to compress uploads and show smaller versions in lists.',
        },
        {
          type: "activity",
          activity: {
            id: "builder-12-scenario-1",
            kind: "scenario",
            title: "A payment screenshot",
            prompt: "How should the upload be stored?",
            concept: "private uploads",
            situation: "Your order form lets customers upload a screenshot of their payment. A few arrive every day.",
            options: [
              {
                text: "Store it in file storage and make it private, so only that customer and the owner account can open it.",
                consequence: "Each screenshot is only visible to the people who should see it, and the file link does not work for strangers.",
                quality: "best",
              },
              {
                text: "Store it privately, but let any signed-in customer open any upload.",
                consequence: "Strangers are blocked, but one customer could open another customer's screenshot.",
                quality: "acceptable",
              },
              {
                text: "Put it in a public bucket, since nobody knows the file links.",
                consequence: "A public bucket means anyone with the link can open the file.",
                quality: "poor",
              },
            ],
            hints: [
              "User uploads often contain private details.",
              "Who should see a customer's screenshot: everyone, every customer, or only two parties?",
              "Only the person who uploaded it and the owner account.",
            ],
            explanation: "User uploads arrive every day and are often private, so keep them private to the uploader and the owner. Test it by opening the link in a private window while signed out.",
          },
        },
        {
          type: 'prompt',
          label: 'Add uploads, safely',
          text: "Add a file upload to the [form name] form so users can attach [what, e.g. one photo of the item]. Rules: only images (JPG, PNG or WebP), at most [5] MB, one file per entry. Store files in the file storage of the service my app already uses. Make uploaded files private: only the person who uploaded and the owner account can see them. Show a small preview after choosing a file and a clear error if the file is too big or the wrong type. Explain in plain words where the files are stored and who can open them.",
        },
        {
          type: 'warning',
          text: 'Do not collect photos of IDs, bank cards or anything sensitive unless you truly need them and have a developer check how they are protected. A public storage bucket means anyone with the link can open the file.',
        },
        {
          type: 'tip',
          text: 'Every image needs short **alt text**: a description such as "Ube cake with white frosting". It helps people who use screen readers, and it helps search engines understand your page. Ask the AI to add alt text to every image.',
        },
        {
          type: 'paragraph',
          text: 'Test uploads the same way as forms: a normal photo, a huge photo, and a file that is not an image. Then copy the link of an uploaded private file, open it in a private window while signed out, and make sure it does not open for you.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat every upload as hostile input. Enforce size and type limits on the server, not only in the page; check the file's real content type instead of trusting its name; store files under generated names, not the original; and consider malware scanning and removing location data from photos before they are shown. Keep user uploads in a private bucket and serve them through short-lived signed URLs or authenticated requests. A single signed URL cannot be revoked, so choose a short expiry and delete or move the object if you must cut access early. Write storage policies per operation, because uploading without a matching policy is blocked by default. Keep only the file path in the database, serve resized images from a CDN, and remember that restoring a database backup does not bring back deleted files.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Supabase Storage docs: public buckets are served at a stable URL that anyone with the link can open; private buckets are read through signed URLs (created on the server with an expiry in seconds) or authenticated requests; a single signed URL cannot be revoked directly, only by deleting, moving or renaming the object or by rotating the URL signing key; uploads need an RLS policy on storage.objects, otherwise they are blocked by default; and database backups do not include stored objects, only their metadata.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Supabase docs: Storage access control",
              url: "https://supabase.com/docs/guides/storage/security/access-control",
            },
            {
              label: "Supabase docs: Serving downloads",
              url: "https://supabase.com/docs/guides/storage/serving/downloads",
            },
            {
              label: "Supabase docs: Database backups",
              url: "https://supabase.com/docs/guides/platform/backups",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Files go into file storage (a \"bucket\"), and the database row keeps a link to each file.",
            "Your own images can be public. Uploads from users are often private, for the uploader and the owner only.",
            "Resize and compress photos so pages stay fast on mobile data.",
            "Add alt text to every image, and do not collect photos of IDs or bank cards unless you truly need them.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-12-q1',
          prompt: 'Where are uploaded files usually stored?',
          choices: [
            'In file storage (a "bucket"), with a link saved in the database',
            'Inside the page\'s text',
            'In your email inbox',
          ],
          answer: 0,
          explanation: 'Files go to storage, and the database row keeps a link to each file.',
        },
        {
          id: 'builder-12-q2',
          prompt: 'Why resize or compress photos?',
          choices: [
            'Search engines reject large photos',
            'Large images make pages slow, especially on mobile data',
            'Small images look sharper',
          ],
          answer: 1,
          explanation: 'Smaller files load faster and cost visitors less data.',
        },
        {
          id: 'builder-12-q3',
          prompt: 'A customer uploads a payment screenshot. Who should be able to see it?',
          choices: [
            'Everyone who visits the site',
            'Anyone with a Google account',
            'Only that customer and the owner account',
          ],
          answer: 2,
          explanation: 'User uploads often contain private details, so keep them private to the uploader and the owner.',
        },
        {
          id: "builder-12-q4",
          audience: { max: "beginner" },
          prompt: "What is a \"bucket\" in file storage?",
          choices: [
            "A storage box on a server where uploaded files are kept",
            "A tool for resizing photos",
            "A kind of password",
            "A page that lists all your customers",
          ],
          answer: 0,
          explanation: "A bucket is a labelled place on a server where files are stored. It can be public or private, which is why you decide who may open what is inside.",
        },
        {
          id: "builder-12-q5",
          audience: { min: "advanced" },
          prompt: "A customer uploads \"receipt.jpg\" that is really a script. Which combination of controls would have stopped it?",
          choices: [
            "A longer limit on the file name",
            "Server-side checks of size and real content type, a private bucket, and storing the file under a generated name",
            "Checking the file extension in the page only",
            "Making the bucket public so anyone can scan it",
          ],
          answer: 2,
          explanation: "Page checks and file names can be faked. Server-side content checks, private storage and generated names remove the attacker's control over what is stored and who can open it.",
        },
      ],
      task: {
        title: 'Add images the right way',
        steps: [
          'Resize your product or banner photos to about 1200 pixels wide and replace the placeholders.',
          'Ask the AI to add alt text to every image.',
          'If your app needs user uploads, send the "Add uploads, safely" prompt.',
          'Test a normal file, a huge file and a wrong type, and check a private file is blocked when signed out.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Take a photo with your phone and check its size, then use any free resize tool to make it about 1200 pixels wide and compare the sizes. Write one sentence on why this helps your visitors.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Upload a text file renamed to .jpg, an oversize image and a photo with GPS data. Verify the first two are rejected on the server, and strip or confirm the removal of location data from the third. Test that a signed URL stops working after its expiry.",
          ],
        },
      ],
    },
    {
      id: 'builder-13',
      day: 13,
      title: 'Payments: an overview',
      summary: 'How online payments work in general, the simplest safe options, and what never to build yourself.',
      intro: {
        objectives: [
          'Compare the three ways to take payments, from simplest to most work',
          'Explain why a licensed provider, not your app, handles card details',
          'Decide when an order should count as paid',
          'Use test mode before any real money moves',
        ],
        why: 'Mistakes with money cost the most. Starting simple and knowing what never to build yourself protects your customers and your business.',
      },
      minutes: 15,
      skills: ['data-and-login', 'launch-and-run'],
      body: [
        {
          type: 'paragraph',
          text: 'Taking money online is where mistakes cost the most, so this lesson is an overview, not a build-it-now guide. The main rule is simple: **let a licensed payment provider handle the money and the card details. Your app never touches them.**',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **payment provider** is a company licensed to move money between a customer's card or e-wallet and your account, and to keep card numbers safe. You never want card numbers inside your own app, the same way a bakery owner would not want strangers' bank cards written in the order notebook. A **webhook** is the provider calling your app back to say \"this payment really went through\", like a courier phoning to confirm a delivery. **Test mode** is a practice version of the provider with fake cards, where no real money moves. Start with the simplest option, taking payment outside the app, and add more only when you understand each piece.",
        },
        { type: 'heading', text: 'Options from simplest to most work' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Pay offline, track online.** Customers pay by e-wallet or bank transfer as they do now, and your app only records the order and its status. Many small shops start here.',
            '**Payment links.** A payment provider gives you a link per product or amount. Your site has a button that opens it. Little or no code.',
            '**Checkout in your app.** The provider\'s checkout opens from your app, and the provider tells your app when the payment succeeded. This needs careful setup and testing.',
          ],
        },
        {
          type: "table",
          caption: "Three ways to take payments",
          headers: [
            "Option",
            "How it works",
            "Effort",
          ],
          rows: [
            [
              "Pay offline, track online",
              "Customers pay as they do now; your app records the order and its status",
              "Simplest",
            ],
            [
              "Payment links",
              "A provider gives you a link per product or amount, and a button opens it",
              "Little or no code",
            ],
            [
              "Checkout in your app",
              "The provider's checkout opens from your app and tells it when the payment succeeded",
              "Careful setup and testing",
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'In the Philippines, payment providers such as PayMongo or Xendit can accept cards and e-wallets like GCash and Maya for registered businesses. Check each provider\'s own website for what they currently support, what documents they need from you, and their fees.',
        },
        {
          type: 'warning',
          text: 'Never let your app ask for, store or send card numbers itself, and never mark an order "paid" just because the customer landed on a thank-you page. The payment provider should confirm the payment to your app. If you go beyond payment links, have a developer review it before real money flows.',
        },
        {
          type: "activity",
          activity: {
            id: "builder-13-scenario-1",
            kind: "scenario",
            title: "When is it paid?",
            prompt: "What should change?",
            concept: "confirming payments",
            situation: "Your app marks an order \"Paid\" as soon as the customer lands on the thank-you page after checkout. A friend points out that nobody has asked the payment provider.",
            options: [
              {
                text: "Mark an order paid only when the provider confirms the payment to your app, and test the whole flow in test mode first.",
                consequence: "Only a real, confirmed payment marks an order paid, and you find problems with fake payments instead of real money.",
                quality: "best",
              },
              {
                text: "Keep it as it is, but check your provider account at the end of the week.",
                consequence: "You may catch mistakes later, but meanwhile anyone can reach the thank-you page and orders show as paid when they are not.",
                quality: "acceptable",
              },
              {
                text: "Keep it as it is. The thank-you page means they paid.",
                consequence: "Anyone can reach a thank-you page. Only the provider's confirmation proves payment.",
                quality: "poor",
              },
            ],
            hints: [
              "Can anyone open a thank-you page without paying?",
              "Who is allowed to confirm that money moved?",
              "The provider should confirm the payment to your app.",
            ],
            explanation: "A thank-you page proves nothing. The payment provider should confirm the payment to your app, and test mode lets you check the whole flow with fake cards.",
          },
        },
        {
          type: 'paragraph',
          text: 'Every provider has a **test mode** with fake cards and fake payments. Use it until everything works, then switch to live mode. Their secret keys go in the tool\'s secrets or environment settings, never in the chat box and never in the page itself (Lesson 17).',
        },
        {
          type: "diagram",
          format: "json",
          caption: "Checkout in your app: the provider confirms the payment",
          source: {
            kind: "sequence",
            title: "Checkout inside your app",
            summary: "The customer presses Pay and your app opens the provider's checkout. The customer pays there, so card details go only to the provider. The provider tells your app the payment succeeded, and only then does your app mark the order paid.",
            participants: [
              {
                id: "customer",
                label: "Customer",
              },
              {
                id: "app",
                label: "Your app",
              },
              {
                id: "provider",
                label: "Payment provider",
              },
            ],
            messages: [
              {
                from: "customer",
                to: "app",
                label: "Presses Pay",
              },
              {
                from: "app",
                to: "provider",
                label: "Opens the provider's checkout",
              },
              {
                from: "customer",
                to: "provider",
                label: "Pays (card details go only here)",
              },
              {
                from: "provider",
                to: "app",
                label: "Confirms the payment succeeded",
                dashed: true,
              },
              {
                from: "app",
                to: "customer",
                label: "Marks the order paid",
                dashed: true,
              },
            ],
          },
        },
        {
          type: 'prompt',
          label: 'Plan payments for your app',
          text: "I sell [what] to customers in the Philippines through my app. I am not a developer. Explain my options for accepting payments, from simplest to most complex: tracking offline payments, payment links, and in-app checkout. For each: what I need to set up, what the risks are, and what I should test in test mode. Do not invent fees; tell me to check the provider's own site. Also remind me what business registration or tax questions to ask an accountant.",
        },
        {
          type: 'tip',
          text: 'Selling online can bring tax and registration duties, such as registering with the BIR. Rules change, so confirm what applies to you with the BIR or an accountant before you start selling.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "When you do add checkout, the architecture matters more than the interface. Compute prices and totals on the server from your own catalogue and never trust an amount sent by the browser. Create the payment with the provider from the server, and mark an order paid only from a verified webhook: check the signature as your provider documents it (many require the raw, unparsed request body), check the event is one you expect, and make processing idempotent by recording event ids, so retries and out-of-order deliveries cannot fulfil an order twice. Run a reconciliation report that compares your orders with the provider's records. Store the provider's ids, never card data, log every payment state change, and test the failures: declined, cancelled, expired, duplicate and delayed events.",
        },
        {
          type: "takeaways",
          items: [
            "Let a licensed payment provider handle the money and card details. Your app never touches them.",
            "Start simple: pay offline and track online, then payment links, then checkout in your app.",
            "Never mark an order paid because a customer reached a thank-you page. The provider confirms the payment.",
            "Use test mode until everything works, keep secret keys in the tool's secrets, and have a developer review anything beyond payment links.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-13-q1',
          prompt: 'Who should handle card details in your app?',
          choices: [
            'Your database',
            'The AI builder',
            'A licensed payment provider, never your app itself',
            'Your email inbox',
          ],
          answer: 2,
          explanation: 'Payment providers are built and regulated to handle card data. Your app should never touch it.',
        },
        {
          id: 'builder-13-q2',
          prompt: 'What is the simplest way to start for a small shop?',
          choices: [
            'Track offline payments, or use payment links from a provider',
            'Build your own card form',
            'Ask customers to type their card number in the notes field',
          ],
          answer: 0,
          explanation: 'Offline tracking and payment links need little or no code and keep card data away from your app.',
        },
        {
          id: 'builder-13-q3',
          prompt: 'When should an order be marked as paid?',
          choices: [
            'When the customer sees the thank-you page',
            'When the provider confirms the payment to your app or you see it in your provider account',
            'When the customer says they paid in the notes',
          ],
          answer: 1,
          explanation: 'Anyone can reach a thank-you page. Only the provider\'s confirmation proves payment.',
        },
        {
          id: 'builder-13-q4',
          prompt: 'What is test mode for?',
          choices: [
            'Getting lower fees',
            'Hiding your shop from customers',
            'Skipping registration',
            'Trying the whole payment flow with fake cards before real money moves',
          ],
          answer: 3,
          explanation: 'Test mode lets you check everything safely before switching to live payments.',
        },
        {
          id: "builder-13-q5",
          audience: { max: "beginner" },
          prompt: "What is a webhook?",
          choices: [
            "A kind of fishing net for new customers",
            "A message the payment provider sends your app to confirm what happened to a payment",
            "A fake card number used for testing",
            "A button on the checkout page",
          ],
          answer: 1,
          explanation: "A webhook is the provider calling your app with the result. Because it comes from the provider, it is a better proof of payment than a thank-you page.",
        },
        {
          id: "builder-13-q6",
          audience: { min: "advanced" },
          prompt: "Your checkout redirects to /thanks?paid=true and the app marks the order paid. What is the strongest fix?",
          choices: [
            "Add a longer thank-you message",
            "Check the referrer header before marking it paid",
            "Mark orders paid only from a verified provider webhook that is processed idempotently",
            "Hide the paid parameter from the address bar",
          ],
          answer: 3,
          explanation: "Anyone can open a URL with paid=true. Only the provider's signed confirmation proves payment, and idempotent handling keeps retries from fulfilling twice.",
        },
      ],
      task: {
        title: 'Choose your payment approach',
        steps: [
          'Run the "Plan payments" prompt for your app.',
          'Look at the website of one payment provider that works in the Philippines and note what it needs from a business.',
          'Pick the simplest option that works for you now and write it in your spec.',
          'Write down two questions for an accountant about registration and taxes.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write a three-line story of a customer paying for a cake, with the shop, the customer and the payment provider as the characters. Mark the moment the provider confirms the payment.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "In test mode, send your endpoint a webhook with a bad signature, a duplicate event and an out-of-order event, and verify the order is paid exactly once and the bad one is rejected. Document how you would reconcile your orders against the provider's dashboard.",
          ],
        },
      ],
    },
    {
      id: 'builder-14',
      day: 14,
      title: 'Putting it online',
      summary: 'What publishing really means, a launch checklist, and how updates reach your live site.',
      intro: {
        objectives: [
          'Explain what publishing and hosting do',
          'Explain why editor changes are not live until you publish again',
          'Run the launch checklist before you go live',
          'Plan big changes so you can roll back, and keep them away from busy days',
        ],
        why: 'Launching properly means customers see a working site, not a half-tested one. A checklist and a rollback plan keep a busy day from turning into a bad one.',
      },
      minutes: 15,
      skills: ['launch-and-run', 'fixing-problems'],
      body: [
        {
          type: 'paragraph',
          text: 'You already pressed Publish on Day 5. Today you learn what it means, and how to launch properly instead of just "making it public".',
        },
        { type: 'heading', text: 'What publishing does' },
        {
          type: 'paragraph',
          text: 'Your app\'s files are copied to computers called **servers** that are always on and connected to the internet. This is called **hosting** or **deploying**. People reach it through a web address. Vibe-coding tools usually host it for you; some let you send it to hosting services such as Vercel or Netlify instead.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Think of publishing as renting a stall in a market that is open day and night. A **server** is just a computer that never switches off and is always connected to the internet, so anyone can visit your stall at 3 a.m. **Hosting** is the service that rents you that space. A **web address** (called a URL) is the sign above the stall that tells people where to find it. Your editor is the back room: you can rearrange things there without customers seeing, until you choose to publish. That is why customers can keep seeing an older version while you work on a new one.",
        },
        {
          type: 'paragraph',
          text: 'Important: in many tools, changes you make in the editor are **not** live until you publish again. Your customers see the last published version. That is good: you can try things without breaking the live site.',
        },
        {
          type: "diagram",
          format: "json",
          caption: "Editing is not publishing",
          source: {
            kind: "flow",
            title: "From the editor to your customers",
            summary: "You make changes in the editor, but customers only see them after you publish. Publishing copies your files to always-on servers, and customers open the last published version.",
            direction: "LR",
            nodes: [
              {
                id: "edit",
                label: "You edit in the tool",
                shape: "rounded",
              },
              {
                id: "publish",
                label: "You press Publish",
                shape: "rounded",
              },
              {
                id: "servers",
                label: "Files copied to servers",
                shape: "database",
                note: "Servers are computers that are always on and connected to the internet. This is called hosting or deploying.",
              },
              {
                id: "customers",
                label: "Customers see the published version",
                shape: "rounded",
              },
            ],
            edges: [
              {
                from: "edit",
                to: "publish",
              },
              {
                from: "publish",
                to: "servers",
              },
              {
                from: "servers",
                to: "customers",
              },
            ],
          },
        },
        { type: 'heading', text: 'Launch checklist' },
        {
          type: 'list',
          items: [
            'Every page works on a phone and a laptop.',
            'Forms save, and you can find the entries.',
            'Login blocks strangers from private pages (test in a private window).',
            'No test data, placeholder text or "lorem ipsum" left.',
            'Your contact details and a short privacy notice are on the site.',
            'Secrets are in the tool\'s secrets settings, not in the page (Lesson 17).',
            'You know how to roll back if the new version breaks.',
          ],
        },
        {
          type: 'prompt',
          label: 'Pre-launch review',
          text: "My app is about to go live. Review it like a careful tester and give me a checklist of problems, in plain words, ordered by how serious they are. Check: pages that break on phones, forms that do not save, pages or data that strangers can reach without signing in, secret keys visible in the front end, leftover test data or placeholder text, and missing error messages. Do not change anything yet; just list what you find.",
        },
        {
          type: 'warning',
          text: 'Do not do big changes on the live site the night before an event or promotion. Publish them early, test them, and keep the previous version ready to restore.',
        },
        {
          type: "activity",
          activity: {
            id: "builder-14-scenario-1",
            kind: "scenario",
            title: "A big change before an event",
            prompt: "What do you do?",
            concept: "safe launches",
            situation: "Your cake promotion starts tomorrow morning. Tonight you think of a big redesign of the Home page.",
            options: [
              {
                text: "Leave the big redesign for after the promotion. Test it in the editor, publish it at a quiet time, and keep the previous version ready to restore.",
                consequence: "The live site stays stable during the promotion, and you can go back if a later change breaks something.",
                quality: "best",
              },
              {
                text: "Publish the redesign tonight and check it in the morning.",
                consequence: "If it breaks something, you find out on the busiest day, with little time to fix it.",
                quality: "poor",
              },
              {
                text: "Make only a small fix tonight, test it, and publish it.",
                consequence: "A small, tested change carries little risk, but you still need to know how to roll back.",
                quality: "acceptable",
              },
            ],
            hints: [
              "What would happen if the new version broke on the day of the promotion?",
              "Publish big changes early, test them, and keep the previous version ready.",
              "Choose the option that protects the live site and lets you roll back.",
            ],
            explanation: "Do not make big changes to the live site the night before an event. Publish them early, test them, and keep the previous version ready to restore.",
          },
        },
        {
          type: 'tip',
          text: 'Keep a simple launch log: the date, what changed, and anything you noticed after. When something breaks next month, this log tells you what changed and when.',
        },
        {
          type: 'paragraph',
          text: 'After you launch, open the site yourself the next morning on mobile data, not your home Wi-Fi, and try the main task once. Ask one friend on a different phone to do the same. A quick real-world check like this catches problems that the preview inside the builder never shows.',
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Now look at what changes between preview and production. Environment variables, the database and the domain often differ, so a page that works in preview can fail when live because a setting exists in only one of them. Ask the AI: \"List every environment variable and external service this app uses, and tell me where each one is set for preview and for production.\" Check that your test database is not the live one, that email and payment settings are in test mode in preview, and that the live site points at the right services. Keep the list in your launch log.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Move from pressing Publish to a pipeline. Keep the code in version control, require review for changes to the main branch, and let a CI job run the build, tests and a dependency audit before anything deploys. Use separate preview and production environments with their own secrets and data. Know your rollback story precisely: on Vercel, for example, Instant Rollback points the production domains back to an earlier deployment, but environment variable changes are not rolled back and external databases and APIs keep their current behaviour, so a schema change needs its own plan (add the new column, migrate, then remove the old one). Add monitoring before launch: uptime checks, error tracking and structured logs, with an alert that someone will actually see.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Vercel's Instant Rollback docs: it reverts production to a previous deployment; Vercel will not update environment variables changed in project settings when rolling back to a previous build; the rollback dialog reminds you that external APIs, databases and CMSes used by the deployments may behave differently; on the Hobby plan you can roll back to the previous deployment, while Pro and Enterprise plans can roll back to any eligible deployment. Other hosts differ.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Vercel docs: Instant Rollback",
              url: "https://vercel.com/docs/instant-rollback",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Publishing copies your app's files to always-on servers, which people reach through a web address.",
            "In many tools, editor changes are not live until you publish again.",
            "Run the launch checklist: phone and laptop, forms save, login blocks strangers, no test data, contact details and privacy notice, secrets safe, a way to roll back.",
            "After launching, test on mobile data and ask a friend on a different phone to try the main task.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-14-q1',
          prompt: 'What is hosting?',
          choices: [
            'Your app\'s files running on always-on servers that people reach through a web address',
            'Inviting friends to see your app',
            'Buying a domain name',
          ],
          answer: 0,
          explanation: 'Hosting keeps your app on servers connected to the internet so people can open it any time.',
        },
        {
          id: 'builder-14-q2',
          prompt: 'You changed something in the editor, but customers still see the old version. Why?',
          choices: [
            'The internet is slow',
            'Customers need to reinstall the app',
            'The change is not live until you publish again',
          ],
          answer: 2,
          explanation: 'In many tools, the live site updates only when you publish.',
        },
        {
          id: 'builder-14-q3',
          prompt: 'Which is on the launch checklist?',
          choices: [
            'Adding as many features as possible',
            'Checking that strangers cannot reach private pages',
            'Removing the privacy notice to save space',
          ],
          answer: 1,
          explanation: 'Testing access as a stranger is one of the most important checks before launch.',
        },
        {
          id: "builder-14-q4",
          audience: { max: "beginner" },
          prompt: "What is a server?",
          choices: [
            "A computer that stays on and connected so people can visit your app at any time",
            "A person who delivers your orders",
            "A type of password",
            "A program that draws pictures",
          ],
          answer: 0,
          explanation: "A server is a computer that never switches off and is always reachable on the internet. Hosting means your app's files live on one.",
        },
        {
          id: "builder-14-q5",
          audience: { min: "advanced" },
          prompt: "A release renamed a database column. You roll the code back, but the database stays as it is. What is the risk?",
          choices: [
            "The domain will expire",
            "The environment variables will be deleted",
            "The old code expects the old column while the database has changed, so migrations need a backward-compatible plan",
            "None, because a rollback also restores the database",
          ],
          answer: 3,
          explanation: "A code rollback does not undo changes in an external database. Adding the new column first, migrating, and removing the old one later lets both versions of the code work.",
        },
      ],
      task: {
        title: 'Run your launch checklist',
        steps: [
          'Send the "Pre-launch review" prompt and read the list.',
          'Fix the most serious item with one clear request, and test it.',
          'Go through the launch checklist yourself, ticking each line.',
          'Publish, then start a launch log with today\'s date and what changed.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Draw a picture of your own: your editor, the Publish button, the server and a customer's phone, with arrows between them. Label each with one plain word.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "Write the list of environment variables and external services your app uses, with where each is set for preview and for production, and fix any place where preview points at live data.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Set up separate preview and production environments with their own environment variables and data, add a CI job that builds and tests every pull request, run a rollback drill, and write down what the rollback did not undo.",
          ],
        },
      ],
    },
    {
      id: 'builder-15',
      day: 15,
      title: 'Your own domain',
      summary: 'Buying a domain and connecting it with DNS, explained in plain words.',
      intro: {
        objectives: [
          'Explain what a domain is and what to check before you buy one',
          'Explain DNS as the internet\'s phone book',
          'Tell apart A, CNAME, TXT and MX records',
          'Explain propagation, and why auto-renew matters',
        ],
        why: 'A domain of your own looks more trustworthy than a free tool address and stays yours if you change tools. A few plain facts about DNS let you connect it without fear.',
      },
      minutes: 15,
      skills: ['launch-and-run'],
      body: [
        {
          type: 'paragraph',
          text: 'A **domain** is your own web address, like `rosascakes.com` or `rosascakes.ph`. It looks more trustworthy than a free address on a tool\'s domain, and it stays yours even if you change tools later.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Every computer on the internet has a number address called an **IP address**, such as 203.0.113.10. Numbers are hard to remember, so people invented names. A **domain name** is the readable name that stands for that number, like a contact saved in your phone: you tap \"Mama\", not her number. A web address has parts: in `www.rosascakes.com`, `www` is a label, `rosascakes` is the name you choose and `.com` is the ending. A **registrar** is the shop where you rent the name. **DNS records** are the entries in the internet's contact list that say which number goes with your name.",
        },
        { type: 'heading', text: 'Buying a domain' },
        {
          type: 'list',
          items: [
            'You rent a domain yearly from a **registrar** (a company that sells domains). Namecheap, Cloudflare and GoDaddy are examples; `.ph` and `.com.ph` names are sold through registrars that offer them. Some vibe-coding tools also sell domains directly.',
            'Choose a name that is short, easy to spell aloud, and has no confusing hyphens.',
            'Check the **renewal** price, not just the first-year price. They are often different.',
            'Turn on auto-renew and keep your registrar login safe. If a domain expires, someone else can buy it.',
          ],
        },
        { type: 'heading', text: 'DNS in plain words' },
        {
          type: 'paragraph',
          text: '**DNS** is the internet\'s phone book. It turns your domain name into the address of the server where your site lives. To connect your domain, you add a few **records** in your registrar\'s DNS settings. Your tool tells you exactly which ones.',
        },
        {
          type: 'list',
          items: [
            'An **A record** points a name to a server\'s number address (an IP address).',
            'A **CNAME record** points a name to another name, often used for `www`.',
            'A **TXT record** is a note, often used to prove you own the domain.',
            'An **MX record** says where email for your domain should be delivered. Leave the ones you did not add alone.',
          ],
        },
        {
          type: "diagram",
          format: "json",
          caption: "DNS is the internet's phone book",
          source: {
            kind: "flow",
            title: "What DNS does",
            summary: "A visitor types your domain. DNS, the internet's phone book, turns the name into the address of the server where your site lives, and your site opens.",
            direction: "LR",
            nodes: [
              {
                id: "visitor",
                label: "Visitor types rosascakes.com",
                shape: "rounded",
              },
              {
                id: "dns",
                label: "DNS looks up the name",
                shape: "database",
              },
              {
                id: "server",
                label: "The server's address",
                shape: "box",
              },
              {
                id: "site",
                label: "Your site opens",
                shape: "rounded",
              },
            ],
            edges: [
              {
                from: "visitor",
                to: "dns",
                label: "asks",
              },
              {
                from: "dns",
                to: "server",
                label: "finds",
              },
              {
                from: "server",
                to: "site",
              },
            ],
          },
        },
        {
          type: 'code',
          language: 'text',
          label: 'What DNS records look like (example values only)',
          code: `Type   Name   Value
A      @      203.0.113.10
CNAME  www    your-site.example-host.com
TXT    @      verification-code-from-your-tool

"@" means the domain itself (rosascakes.com).
Copy the real values from your tool's custom domain page.`,
        },
        {
          type: "activity",
          activity: {
            id: "builder-15-match-1",
            kind: "match",
            title: "Which DNS piece is it?",
            prompt: "You are connecting bantaybakery.com to your site. Match each moment with the DNS piece involved.",
            concept: "dns",
            labels: { terms: "What you need or see", meanings: "The DNS piece involved" },
            pairs: [
              {
                term: "Your tool says: point bantaybakery.com at the server 198.51.100.7.",
                definition: "A record",
              },
              {
                term: "www.bantaybakery.com should go to bantay.example-host.com.",
                definition: "CNAME record",
              },
              {
                term: "Your tool asks you to add a code to your DNS so it can confirm the domain is yours.",
                definition: "TXT record",
              },
              {
                term: "Emails to orders@bantaybakery.com stopped arriving after you deleted records you did not recognise.",
                definition: "MX record",
              },
              {
                term: "You saved the records an hour ago and your phone still shows the old page.",
                definition: "Propagation",
              },
            ],
            hints: [
              "Ask whether each moment is about pointing a name, proving ownership, email, or waiting.",
              "A number address (an IP) and another name are pointed to by two different record types.",
              "One piece is not a record at all: it is the time a change takes to reach everyone.",
            ],
            explanation: "An IP address needs an A record, a name pointing to another name (often www) is a CNAME, a verification code is a TXT record, lost email means MX records were removed, and the old page after saving is propagation.",
          },
        },
        {
          type: 'paragraph',
          text: 'After saving, changes can take from a few minutes to around a day or two to reach everyone. This waiting is called **propagation**. Your tool usually shows a check mark when it sees the records, and sets up the secure padlock (HTTPS) for you.',
        },
        {
          type: 'prompt',
          label: 'Get help connecting your domain',
          text: "I bought the domain [your domain] at [registrar]. My app is built and hosted with [tool]. Explain step by step, in plain words, how to connect my domain, including www. Tell me which DNS records I will probably need and where to find the exact values in my tool, but remind me to copy the values from my tool's own custom domain page, not from you.",
        },
        {
          type: 'warning',
          text: 'Do not delete DNS records you do not understand, especially **MX** records. Those handle email for your domain, and removing them can stop your email.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Know what the records can and cannot do. A CNAME cannot share its name with other data (RFC 1034), so the bare domain, which already carries NS and SOA records, cannot be a CNAME; use an A record, or an ALIAS or flattened record if your DNS provider offers one. Lower the TTL a day before a migration so a mistake can be undone quickly, and raise it afterwards. If the domain sends email, publish SPF as a single TXT record (a second SPF record is a permanent error under RFC 7208) and set up DKIM and DMARC with your mail provider. Lock the domain at the registrar, turn on two-factor sign-in for that account, and consider CAA records, which name the certificate authorities allowed to issue certificates for the domain.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "RFC 1034 section 3.6.2: if a CNAME record is present at a node, no other data should be present. RFC 7208 (SPF): a domain publishes the hosts allowed to send its mail in a TXT record starting with v=spf1, and multiple SPF records for one name are not permitted (the result is a permanent error). RFC 8659: a CAA record lets a domain owner name which certificate authorities may issue certificates for the domain.",
          checked: "2026-11-14",
          sources: [
            {
              label: "RFC 1034: Domain names, concepts and facilities",
              url: "https://www.rfc-editor.org/rfc/rfc1034",
            },
            {
              label: "RFC 7208: Sender Policy Framework",
              url: "https://www.rfc-editor.org/rfc/rfc7208",
            },
            {
              label: "RFC 8659: DNS Certification Authority Authorization",
              url: "https://www.rfc-editor.org/rfc/rfc8659",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "A domain is your own web address. You rent it yearly from a registrar, so check the renewal price and turn on auto-renew.",
            "DNS is the internet's phone book: it turns your domain into the address of your server.",
            "You add records in your registrar's DNS settings: A, CNAME and TXT. Copy the exact values from your tool's custom domain page.",
            "Changes can take minutes to a day or two to spread. Do not delete records you do not understand, especially MX.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-15-q1',
          prompt: 'What does DNS do?',
          choices: [
            'Stores your customers\' orders',
            'Turns your domain name into the address of the server where your site lives',
            'Takes payments',
          ],
          answer: 1,
          explanation: 'DNS works like a phone book, connecting names to server addresses.',
        },
        {
          id: 'builder-15-q2',
          prompt: 'Where should you get the exact DNS values to enter?',
          choices: [
            'From any AI assistant',
            'From a random tutorial',
            'From your tool\'s own custom domain page',
          ],
          answer: 2,
          explanation: 'Each host gives its own values. Copy them from the tool\'s domain settings.',
        },
        {
          id: 'builder-15-q3',
          prompt: 'You added the records but the domain does not work yet. What is likely happening?',
          choices: [
            'Propagation: DNS changes can take minutes to a day or two to spread',
            'The domain was stolen',
            'Your app was deleted',
          ],
          answer: 0,
          explanation: 'DNS changes take time to reach everyone. Wait, then check your tool\'s status.',
        },
        {
          id: 'builder-15-q4',
          prompt: 'Why turn on auto-renew?',
          choices: [
            'It makes the site faster',
            'It adds HTTPS',
            'It removes the need for DNS',
            'If the domain expires, someone else can buy it',
          ],
          answer: 3,
          explanation: 'An expired domain can be lost. Auto-renew keeps it yours.',
        },
        {
          id: "builder-15-q5",
          audience: { max: "beginner" },
          prompt: "What is an IP address?",
          choices: [
            "The number address of a computer on the internet",
            "The name of your shop",
            "A password for your domain account",
            "A kind of web photo",
          ],
          answer: 0,
          explanation: "An IP address is the number that identifies a computer on the internet. A domain name is the easy-to-remember name that stands for it.",
        },
        {
          id: "builder-15-q6",
          audience: { min: "advanced" },
          prompt: "You want the bare domain rosascakes.com to point at your host's name sites.example-host.com. Why might a CNAME at the bare domain fail?",
          choices: [
            "The domain name is too long for a CNAME",
            "The TTL must be set to zero first",
            "A CNAME cannot share a name with other records such as NS and SOA, so use an A record or your DNS provider's ALIAS or flattening feature",
            "CNAME records can only be used for email",
          ],
          answer: 3,
          explanation: "The bare domain always carries other records, and a CNAME may not coexist with other data at the same name. An A record, or a provider feature that flattens an alias, solves it.",
        },
      ],
      task: {
        title: 'Plan or connect your domain',
        steps: [
          'Write three possible names and check if they are available at a registrar.',
          'Compare the first-year and renewal prices.',
          'If you are ready, buy one, then open your tool\'s custom domain page and add the records it shows.',
          'Check your site at the new address later today, with and without www.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write your own domain name as parts and label each part. Then ask an AI assistant to explain what an IP address is, using a phone contact as the analogy, and compare its answer with the lesson.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Run `dig` for your domain's A, CNAME, TXT, MX and NS records and explain each result. Check that SPF exists as a single TXT record, check whether DKIM and DMARC records exist, and note the current TTLs.",
          ],
        },
      ],
    },
    {
      id: 'builder-16',
      day: 16,
      title: 'Getting found and shared',
      summary: 'Basic SEO, good link previews, and simple ways to share your site.',
      intro: {
        objectives: [
          'Write a clear page title and meta description',
          'Explain what Open Graph tags do for a shared link',
          'Share your link where your customers already are',
          'Spot a false promise of a first-page Google ranking',
        ],
        why: 'A live site nobody sees does not help your business. A few basics help people find you and make your link look good when someone shares it on Messenger or Facebook.',
      },
      minutes: 15,
      skills: ['launch-and-run', 'design-basics'],
      body: [
        {
          type: 'paragraph',
          text: 'A live site nobody visits does not help anyone. **SEO** (search engine optimisation) means helping search engines like Google understand your pages, so people searching for what you offer can find you. The basics are simple, and they also make your links look good when shared on Messenger or Facebook.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **search engine** such as Google works like a huge library catalogue. Automated programs called **crawlers** visit pages, read the words and file them, so that when someone searches, the best matches can be listed. They can only read what is written as text, so if your menu exists only inside a photo, the catalogue has nothing to file. A **keyword** is a word people type, such as \"custom cakes Quezon City\". Use those words naturally in your title and headings. A **link preview** is the little card with a picture and title that appears when a link is shared in Messenger, and you can control it.",
        },
        { type: 'heading', text: 'The basics' },
        {
          type: 'list',
          items: [
            '**A clear page title** for every page, with what you offer and where: "Rosa\'s Cakes | Custom cakes in Quezon City".',
            '**A meta description:** one or two sentences shown under your link in search results.',
            '**Real words on the page.** Write what you sell, where you are and how to order. Text inside pictures cannot be read as easily by search engines.',
            '**One main heading** per page that says what the page is about.',
            '**Alt text** on images (Lesson 12).',
            '**Speed:** small images and a phone-friendly layout.',
          ],
        },
        {
          type: 'code',
          language: 'html',
          label: 'What these tags look like in a page',
          code: `<title>Rosa's Cakes | Custom cakes in Quezon City</title>
<meta name="description" content="Order custom birthday and celebration cakes in Quezon City. Ube, chocolate and more. Pick-up in 2 days.">
<meta property="og:title" content="Rosa's Cakes">
<meta property="og:description" content="Custom cakes in Quezon City. Order online.">
<meta property="og:image" content="https://rosascakes.com/share-image.jpg">`,
        },
        {
          type: "activity",
          activity: {
            id: "builder-16-fill-1",
            kind: "fill-blank",
            title: "Complete the tags",
            prompt: "Fill the blanks so the page has a meta description and an Open Graph title for the share preview.",
            concept: "seo tags",
            language: "html",
            code: "<title>Rosa's Cakes | Custom cakes in Quezon City</title>\n<meta name=\"___\" content=\"Order custom birthday and celebration cakes in Quezon City. Pick-up in 2 days.\">\n<meta property=\"___:title\" content=\"Rosa's Cakes\">",
            blanks: [
              {
                answers: [
                  "description",
                ],
                feedback: "This tag holds the one or two sentences shown under your link in search results.",
              },
              {
                answers: [
                  "og",
                ],
                feedback: "These tags control the preview card (picture, title, text) when someone shares your link.",
              },
            ],
            bank: [
              "description",
              "og",
              "keywords",
              "image",
            ],
            hints: [
              "The first tag is the short summary shown under your link in search results.",
              "The second starts with the letters that stand for Open Graph.",
              "The blanks are `description` and `og`.",
            ],
            explanation: "The `description` meta tag is the summary search results can show, and `og:` tags (Open Graph) control the preview card when your link is shared.",
          },
        },
        {
          type: 'paragraph',
          text: 'You do not have to type these yourself. The `og:` tags control the **preview card** (picture, title, text) that appears when someone shares your link. Ask the AI to add them, then test by pasting your link into a chat with yourself.',
        },
        {
          type: 'prompt',
          label: 'Add the SEO basics',
          text: "Add basic SEO to my site. For each page, write a clear title (under about 60 characters) and a meta description (under about 155 characters) that says what I offer and where: [your business and location]. Make sure each page has one main heading, all images have alt text, and add Open Graph tags (og:title, og:description, og:image) so links look good when shared. Show me the titles and descriptions you wrote so I can check them.",
        },
        {
          type: 'tip',
          text: 'Google Search Console (search.google.com/search-console) is a free tool where you can prove you own your domain and ask Google to look at your site. It also shows which searches bring people to you. Set it up after your domain is connected.',
        },
        { type: 'heading', text: 'Share it where your people already are' },
        {
          type: 'paragraph',
          text: 'Put the link in your Facebook page, Instagram bio, Messenger auto-reply and Google Business Profile if you have one. Print a QR code at your stall or counter. Search takes time; sharing works today.',
        },
        {
          type: 'warning',
          text: 'Be wary of anyone promising "first page of Google in a week". Nobody can guarantee rankings. Good content and patience work; tricks can get a site penalised.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Check how the page reaches the crawler. Many AI-generated sites are client-rendered single-page apps. Google renders JavaScript, but its documentation still calls server-side or pre-rendering a great idea, because it helps users and bots that cannot run scripts. Give each route a unique title and description, return real 404 status codes (or noindex error views) so errors are not indexed as soft 404s, and add a canonical URL and a sitemap. Remember that robots.txt manages crawling and is not a way to keep a page private or out of results: use noindex, or authentication. Add structured data such as LocalBusiness JSON-LD, validate it, and watch the real search queries in Search Console.",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "json",
          label: "LocalBusiness structured data (name and address are the required properties)",
          code: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"LocalBusiness\",\n  \"name\": \"Rosa's Cakes\",\n  \"url\": \"https://rosascakes.com\",\n  \"telephone\": \"+63-900-000-0000\",\n  \"priceRange\": \"PHP 500 - 2500\",\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"streetAddress\": \"1 Sample Street\",\n    \"addressLocality\": \"Quezon City\",\n    \"addressCountry\": \"PH\"\n  }\n}",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Google Search Central: Google crawls, renders (with headless Chromium) and indexes JavaScript pages, and says server-side or pre-rendering is still a great idea; robots.txt is not a mechanism for keeping a page out of Google, and a URL blocked by it can still appear in results, so use noindex or password protection; for local business structured data, name and address are required properties, and telephone, url, openingHoursSpecification and priceRange are recommended.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Google Search Central: JavaScript SEO basics",
              url: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
            },
            {
              label: "Google Search Central: Introduction to robots.txt",
              url: "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
            },
            {
              label: "Google Search Central: Local business structured data",
              url: "https://developers.google.com/search/docs/appearance/structured-data/local-business",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "SEO helps search engines understand your pages so people can find you.",
            "Give every page a clear title and meta description, one main heading, real words on the page and alt text on images.",
            "Open Graph (`og:`) tags control the preview card when your link is shared on Messenger or Facebook.",
            "Share your link where your people already are. Nobody can guarantee first-page rankings.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-16-q1',
          prompt: 'What does a meta description do?',
          choices: [
            'Sets the page colour',
            'Gives a short summary that can appear under your link in search results',
            'Stores customer orders',
          ],
          answer: 1,
          explanation: 'Search engines may show the meta description as the text under your page title.',
        },
        {
          id: 'builder-16-q2',
          prompt: 'Your link shows no picture when shared on Messenger. What is likely missing?',
          choices: [
            'A domain',
            'A database',
            'Open Graph tags such as og:image',
          ],
          answer: 2,
          explanation: 'Open Graph tags tell chat and social apps which picture and text to show in the preview card.',
        },
        {
          id: 'builder-16-q3',
          prompt: 'Someone offers to put you on Google\'s first page in a week for a fee. What should you think?',
          choices: [
            'Nobody can guarantee rankings; be wary',
            'It is a normal, safe service',
            'It is required for new sites',
          ],
          answer: 0,
          explanation: 'Rankings cannot be guaranteed, and shortcuts can get a site penalised.',
        },
        {
          id: "builder-16-q4",
          audience: { max: "beginner" },
          prompt: "What is a crawler?",
          choices: [
            "A customer who browses your shop slowly",
            "An automated program that visits web pages and reads them for a search engine",
            "A tool that makes your photos smaller",
            "A kind of domain ending",
          ],
          answer: 2,
          explanation: "Crawlers are the programs search engines send to read pages. They can only file what is written as text on your page.",
        },
        {
          id: "builder-16-q5",
          audience: { min: "advanced" },
          prompt: "You block both a thank-you page and a private admin page in robots.txt to keep them out of Google. What is the problem?",
          choices: [
            "robots.txt only manages crawling, and a blocked URL can still appear in results, so use noindex for the thank-you page and authentication for the admin page",
            "Nothing, because robots.txt makes pages private",
            "robots.txt makes the whole site slower",
            "Google ignores every robots.txt file",
          ],
          answer: 1,
          explanation: "robots.txt is a crawling hint, not a privacy tool. Noindex keeps a page out of results, and only authentication protects a page.",
        },
      ],
      task: {
        title: 'Make your site findable and shareable',
        steps: [
          'Send the "Add the SEO basics" prompt and check every title and description it wrote.',
          'Publish, then paste your link into a chat with yourself to see the preview card.',
          'Add your link to at least one place your customers already visit.',
          'If your domain is connected, start setting up Google Search Console.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Search Google for what you sell plus your city and write down the titles and descriptions of the first three results. Write yours in the same plain style, then paste your link into a chat to see its preview card.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Fetch your live page with `curl` to see what a crawler gets without JavaScript, add LocalBusiness JSON-LD and validate it, check titles and canonical URLs per route, and confirm private pages use noindex or authentication rather than robots.txt alone.",
          ],
        },
      ],
    },
    {
      id: 'builder-17',
      day: 17,
      title: 'Privacy and security for non-coders',
      summary: 'Protect secrets and your users\' data, and know your general duties under the Data Privacy Act.',
      intro: {
        objectives: [
          'Keep secret keys out of the chat box and the page, and revoke a leaked one',
          'Tell a secret key from a publishable key',
          'Collect less data and protect what you keep',
          'Explain in general terms what the Data Privacy Act expects from you',
        ],
        why: 'You are responsible for the information your app collects. A few habits protect your customers, keep your bills under control and cover your basic duties in the Philippines.',
      },
      minutes: 15,
      skills: ['data-and-login', 'launch-and-run'],
      body: [
        {
          type: 'paragraph',
          text: 'You do not need to be a security expert, but you are responsible for what your app does with people\'s information. Three habits cover most of the risk.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**Personal information** is anything that points to a real person: a name, a phone number, an address, a photo of a face. **Security** means keeping that information, and your accounts, away from people who should not have it. A **secret key** is a long code that works like a password for a service, so whoever holds it can act as you and spend your money. Think of the keys to your shop: you would not hand them out, tape a copy to the door or post a photo of them online. The padlock (HTTPS) in the address bar means information is scrambled while it travels. **Two-factor sign-in** adds a second check, such as a code on your phone, so a stolen password alone is not enough.",
        },
        { type: 'heading', text: '1. Keep secrets secret' },
        {
          type: 'paragraph',
          text: 'A **secret** (API key, secret key, password) is like the key to your shop. Payment providers, email services and AI services give you secret keys. Anyone who has one can act as you, and may run up bills or read your data.',
        },
        {
          type: 'list',
          items: [
            'Never paste a secret key into the builder\'s chat box or into page text.',
            'Use the tool\'s **secrets** or **environment variables** settings. The code then refers to the secret by name only.',
            'Some keys are meant to be public (often called "publishable" or "anon" keys) and are safe in the page only when access rules are on. Keys called "secret" or "service role" must never be in the page.',
            'If a secret leaks, go to the provider and **revoke or rotate** it at once.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "builder-17-match-1",
            kind: "match",
            title: "What do you do with this key?",
            prompt: "Four things happen while you build your app. Match each one with what the lesson says to do.",
            concept: "keeping secrets",
            labels: { terms: "What happened", meanings: "What to do" },
            pairs: [
              {
                term: "The builder asks you to paste your payment provider's secret key into the chat so it can add checkout.",
                definition: "Type it only in the tool's secrets settings; the code uses it by name",
              },
              {
                term: "The page code uses your database's \"anon\" key, but you have not turned on access rules yet.",
                definition: "Turn on access rules; only then is it safe in the page",
              },
              {
                term: "The AI suggests putting the \"service role\" key in the page so the Orders list loads.",
                definition: "Refuse: that kind of key must never be in the page",
              },
              {
                term: "You posted a screenshot showing your email service's secret key in a public Facebook group.",
                definition: "Revoke or rotate it at the provider at once",
              },
            ],
            hints: [
              "Ask of each key: is it secret or meant to be public, and has anyone already seen it?",
              "A publishable or anon key is fine in the page only under one condition.",
              "Deleting the post does not undo a leak: the old key has to stop working.",
            ],
            explanation: "A secret key belongs only in the secrets settings, an anon key in the page needs access rules on, a service role key never goes in the page, and a key someone may have seen must be revoked or rotated.",
          },
        },
        {
          type: 'code',
          language: 'text',
          label: 'How a secret should appear in code: by name, never by value',
          code: `In the tool's Secrets / Environment settings:
  PAYMENT_SECRET_KEY = (your real key, typed only here)

In the code the AI writes:
  process.env.PAYMENT_SECRET_KEY`,
        },
        { type: 'heading', text: '2. Collect less, protect what you keep' },
        {
          type: 'list',
          items: [
            'Only ask for data you really need.',
            'Turn on access rules (Lesson 11) and test them as a stranger.',
            'Keep user uploads private (Lesson 12).',
            'Do not export customer lists to random spreadsheets or share them in group chats.',
          ],
        },
        { type: 'heading', text: '3. Be open with your users' },
        {
          type: 'paragraph',
          text: 'In the Philippines, the **Data Privacy Act of 2012** (Republic Act No. 10173) sets rules for anyone who collects personal information, and the **National Privacy Commission** (NPC) oversees it. In general terms: tell people what you collect and why, use it only for that, keep it secure, and respect their requests to see or remove it. A short privacy notice on your site is a good start. What exactly applies to your business is a question for the NPC\'s own guidance or a lawyer.',
        },
        {
          type: 'prompt',
          label: 'A security check in plain words',
          text: "Review my app for beginner security mistakes and explain each in plain words: secret keys visible in the front end or code, tables or files without access rules, pages strangers can reach, and personal data collected that the app does not need. Also draft a short, plain privacy notice for my site based on what my app collects: [list what you collect]. Mark the draft as needing review against the Philippine Data Privacy Act and the NPC's guidance.",
        },
        {
          type: 'warning',
          text: 'An AI-drafted privacy notice is a starting point, not legal advice. Have it checked if you handle sensitive data or many customers.',
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Check what reaches the browser. Anything the page needs at run time is delivered to every visitor, so a secret placed there is public. In many build tools only variables with a special prefix are bundled into the page; in Vite that prefix is `VITE_`, and its documentation says such variables should not contain sensitive information like API keys. Ask the AI: \"List every key and token this project uses, and say for each whether it is in the browser code or on a server.\" Secrets belong on the server side or in serverless functions. Then search your code and repository history for strings that look like keys, because deleting a file does not remove its old versions.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Do a lightweight threat model: list the assets, who might attack them and the paths in. Then review against the OWASP Top 10:2025, where broken access control is A01, security misconfiguration A02, software supply chain failures A03 and injection A05. Keep secrets out of the client bundle, scan repositories and their history for credentials, and rotate rather than purge: GitHub's guidance is to rotate an exposed credential immediately, since rewriting history is laborious and often unnecessary once the credential is revoked. Pin and audit dependencies, set security headers, log access to personal data, define retention and deletion, and write a breach response plan that says who is told, by when and by whom, including what the Data Privacy Act requires of you.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Vite docs: variables prefixed with VITE_ are exposed in client-side source code after bundling, and VITE_* variables should not contain sensitive information such as API keys; use a backend or serverless functions for secrets. GitHub docs: secret scanning checks the full commit history of a repository, and the guidance for a leaked secret is to rotate the affected credential immediately. OWASP Top 10:2025: A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A05 Injection.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Vite docs: Env variables and modes",
              url: "https://vite.dev/guide/env-and-mode",
            },
            {
              label: "GitHub docs: About secret scanning",
              url: "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning",
            },
            {
              label: "OWASP Top 10:2025",
              url: "https://top10.owasp.org/2025",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Keep secrets in the tool's secrets or environment settings, never in the chat box or the page, and revoke a leaked key at once.",
            "Collect less, and protect what you keep: access rules, private uploads, no customer lists in group chats.",
            "In the Philippines, the Data Privacy Act expects you to say what you collect and why, use it for that, keep it secure and respect people's requests.",
            "An AI-drafted privacy notice is a starting point, not legal advice.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-17-q1',
          prompt: 'Where should a payment provider\'s secret key go?',
          choices: [
            'In the tool\'s secrets or environment variables settings',
            'In the builder\'s chat box so the AI can use it',
            'In the page footer',
            'In a group chat for safekeeping',
          ],
          answer: 0,
          explanation: 'Secrets settings keep the key out of the page and out of chats. The code refers to it by name.',
        },
        {
          id: 'builder-17-q2',
          prompt: 'You accidentally pasted a secret key into a public place. What do you do?',
          choices: [
            'Delete the message and hope no one saw it',
            'Change the app\'s colours',
            'Revoke or rotate the key at the provider right away',
          ],
          answer: 2,
          explanation: 'Deleting the message does not undo the leak. Revoking makes the old key useless.',
        },
        {
          id: 'builder-17-q3',
          prompt: 'In general, what does the Data Privacy Act expect from you?',
          choices: [
            'Nothing, if your business is small',
            'Tell people what you collect and why, use it for that, keep it secure, and respect their rights',
            'Store as much data as possible',
          ],
          answer: 1,
          explanation: 'Being open, limiting use and keeping data secure are the core ideas. Confirm specifics with the NPC or a lawyer.',
        },
        {
          id: 'builder-17-q4',
          prompt: 'An AI tool drafted your privacy notice. What is it?',
          choices: [
            'Legal advice you can rely on fully',
            'Not needed at all',
            'Something only big companies need',
            'A starting point that should be checked, especially if you handle sensitive data',
          ],
          answer: 3,
          explanation: 'AI drafts can miss things. Check against official guidance or with a lawyer.',
        },
        {
          id: "builder-17-q5",
          audience: { max: "beginner" },
          prompt: "What is a secret key?",
          choices: [
            "A long code that works like a password for a service and must be kept private",
            "A key that opens your shop door",
            "A public web address anyone can use",
            "A button in the builder",
          ],
          answer: 0,
          explanation: "A secret key lets whoever holds it act as you with a service, so it must never appear in a chat, a page or a public post.",
        },
        {
          id: "builder-17-q6",
          audience: { min: "advanced" },
          prompt: "A teammate commits an API secret key, then deletes the file in the next commit. What is the correct response?",
          choices: [
            "Rename the repository so nobody finds it",
            "Make the repository private and keep using the same key",
            "Rotate or revoke the key at the provider immediately, then clean up, because deleting the file does not remove it from history",
            "Nothing, because the key is gone from the project",
          ],
          answer: 3,
          explanation: "The key stays in the repository history and may already be copied. Revoking or rotating it makes the old value useless.",
        },
      ],
      task: {
        title: 'Do a security sweep',
        steps: [
          'Find your tool\'s secrets or environment variables settings and check that no secret appears in your page or chat history.',
          'Send the security check prompt and fix the most serious item.',
          'Add a short privacy notice page and link it in your footer.',
          'Read the National Privacy Commission\'s website (privacy.gov.ph) home page and note one thing that applies to you.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "List ten things your app collects or stores. Put an S next to the ones that would hurt a person if strangers saw them, and ask yourself whether you really need each one.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Run a secret scan over the repository and its history. List every key with where it is used (browser or server) and its rotation procedure, and write a one-page threat model with the top five risks mapped to OWASP Top 10 categories.",
          ],
        },
      ],
    },
    {
      id: 'builder-18',
      day: 18,
      title: 'Feedback from real users',
      summary: 'Watch real people use your app, ask good questions, and decide what to change.',
      intro: {
        objectives: [
          'Watch real users try one task without helping them',
          'Ask what people expected and did, not "Do you like it?"',
          'Put problems that block the main task before new features',
          'Ask permission before recording anyone',
        ],
        why: 'You know your app too well to see where it confuses people. Watching a few real users shows you what to fix first, before you spend days on the wrong thing.',
      },
      minutes: 15,
      skills: ['product-planning', 'fixing-problems'],
      body: [
        {
          type: 'paragraph',
          text: 'You know your app too well to see its problems. Real users do not know where the buttons are, what your words mean, or what you meant to build. That is exactly why their feedback is gold.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**User testing** simply means watching a real person try your app. Imagine you cooked a new dish and tasted it a hundred times while cooking: you can no longer tell if it is salty. A guest tastes it fresh. In the same way, a stranger sees the confusing parts you stopped noticing. A **task** is one small real job, such as \"order a cake for Saturday\". Give the task, not instructions on how to do it. If they hesitate, that is not their mistake. It is information about your app. You need no special equipment: a phone and a quiet friend are enough. Write down what you see, not what you think.",
        },
        { type: 'heading', text: 'Watch, do not explain' },
        {
          type: 'paragraph',
          text: 'The best feedback comes from watching. Ask three to five people who match your user to try one real task, such as "Order a cake for Saturday", on their own phone, while you watch or while they share their screen on a video call. Stay quiet. Every time you want to say "just tap there", write it down instead: that is a problem in your app.',
        },
        { type: 'heading', text: 'Good questions afterwards' },
        {
          type: 'list',
          items: [
            '"What did you expect to happen when you tapped that?"',
            '"Was anything confusing or slow?"',
            '"How do you do this today, without the app?"',
            '"Would you use this next time? Why or why not?"',
          ],
        },
        {
          type: 'paragraph',
          text: 'Avoid "Do you like it?" People are kind and will say yes. Ask about what they did and what they would do.',
        },
        {
          type: 'prompt',
          label: 'Turn feedback into a short to-do list',
          text: "Here are my notes from watching [number] people use my app:\n\n[paste your notes]\n\nGroup the problems by theme. For each, say how many people hit it and how serious it is (blocks the task, slows it down, or minor). Then suggest the three changes that would help most, each written as a clear, specific request I can paste into my AI app builder.",
        },
        {
          type: 'tip',
          text: 'Add a simple way for visitors to tell you about problems: a short feedback form or a "Report a problem" link to your email. Read it weekly.',
        },
        {
          type: 'warning',
          text: 'Ask permission before recording anyone\'s screen or voice, and do not share their personal details from the test. Testers deserve the same privacy as customers.',
        },
        {
          type: 'paragraph',
          text: 'Feedback can sting, especially after you worked hard on something. Remember that people are judging the app, not you. Thank every tester, tell them what you changed because of them, and invite them back for the next version. Many small businesses find their most loyal customers this way.',
        },
        {
          type: 'paragraph',
          text: 'Not every suggestion should be built. If one person asks for a feature, add it to your "later" list. If three people get stuck at the same step, fix that first. Problems that stop people finishing the main task always come before new features.',
        },
        {
          type: "activity",
          activity: {
            id: "builder-18-scenario-1",
            kind: "scenario",
            title: "What do you fix first?",
            prompt: "What do you change first?",
            concept: "using feedback",
            situation: "You watched five people order a cake. Three could not find the Order button, one suggested a gallery page, and one said they liked the colours.",
            options: [
              {
                text: "Fix the Order button problem first, and put the gallery page on the \"later\" list.",
                consequence: "Three of five people got stuck on the main task, so the fix helps most. The gallery idea is safe for later.",
                quality: "best",
              },
              {
                text: "Build the gallery page first, because someone asked for it.",
                consequence: "A new feature does not help if people still cannot find the Order button.",
                quality: "poor",
              },
              {
                text: "Do nothing, because the colours were liked.",
                consequence: "Three testers could not finish the main task, and nothing changes.",
                quality: "poor",
              },
            ],
            hints: [
              "Which problem stops people finishing the main task?",
              "Problems that stop people always come before new features.",
              "Three people got stuck on the same thing.",
            ],
            explanation: "Problems that stop people finishing the main task come before new features. Ideas that only one person suggests go on the later list.",
          },
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Turn anecdotes into evidence. Define the main task as a funnel (visit, start, submit, confirmed) and instrument it with privacy-respecting analytics or event logs, with a consent notice where the law or your policy needs one and no personal data in event properties. Measure completion rate, time on task and error rate before and after a change. Keep the one critical journey covered by an automated end-to-end test, so every future AI-generated change is checked against it. Release risky changes behind a feature flag or to a small share of users, and keep error tracking on so failures reach you before your users do. A handful of testers reveals usability problems but not rates, so use testers to find problems and analytics to size them.",
        },
        {
          type: "takeaways",
          items: [
            "You know your app too well to see its problems. Real users show them.",
            "Watch, do not explain: let three to five people try one real task while you stay quiet and write down where they get stuck.",
            "Ask what they expected and what they did, not \"Do you like it?\".",
            "Fix problems that stop the main task first. A feature one person asks for goes on the later list.",
            "Ask permission before recording anyone, and protect testers' details like customers'.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-18-q1',
          prompt: 'A tester gets stuck. What should you do while watching?',
          choices: [
            'Tell them where to tap right away',
            'Stay quiet and write down where they got stuck',
            'Take their phone and do it for them',
          ],
          answer: 1,
          explanation: 'Where they get stuck is the problem to fix. Helping hides it.',
        },
        {
          id: 'builder-18-q2',
          prompt: 'Why avoid asking "Do you like it?"',
          choices: [
            'It takes too long to answer',
            'It is rude in Filipino culture',
            'People tend to say yes to be kind, so you learn little',
          ],
          answer: 2,
          explanation: 'Questions about what people did and would do give more honest answers.',
        },
        {
          id: 'builder-18-q3',
          prompt: 'Three testers got stuck at the same step, and one asked for a new feature. What comes first?',
          choices: [
            'Fixing the step where three people got stuck',
            'Building the new feature',
            'Redesigning the whole app',
          ],
          answer: 0,
          explanation: 'Problems that stop people finishing the main task come before new features.',
        },
        {
          id: "builder-18-q4",
          audience: { max: "beginner" },
          prompt: "In a user test, what should you do when the tester hesitates?",
          choices: [
            "Stay quiet and write down where they hesitated",
            "Tell them exactly where to tap",
            "Take over the phone and do it for them",
            "End the test and try another person",
          ],
          answer: 0,
          explanation: "The hesitation shows where your app is unclear. Helping would hide it, so note it and keep watching.",
        },
        {
          id: "builder-18-q5",
          audience: { min: "advanced" },
          prompt: "Three of five testers could not find the Order button. After your fix, how do you know it worked?",
          choices: [
            "Count likes on your social media post",
            "Assume it worked because you changed it",
            "Track the funnel from page view to order start before and after the change, and keep an end-to-end test of the order journey",
            "Ask the same five testers whether they like it",
          ],
          answer: 3,
          explanation: "A measured funnel before and after shows whether more people reach the order step, and the test stops the problem coming back unnoticed.",
        },
      ],
      task: {
        title: 'Run a small user test',
        steps: [
          'Write one real task for testers to try, such as "Order a cake for Saturday".',
          'Ask three people who match your user to try it while you watch quietly, with their permission.',
          'Paste your notes into the feedback prompt to get a short to-do list.',
          'Fix the most serious problem and publish.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Watch one person, such as a family member, do one task on your app. Write only what they did and said, not what you think, and underline the first moment they hesitated.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Define the funnel events and add them without personal data, write an end-to-end test for the main task, and compare the completion rate before and after your next fix. Report your sample sizes and the limits of what they can show.",
          ],
        },
      ],
    },
    {
      id: 'builder-19',
      day: 19,
      title: 'Keeping it running: maintenance and costs',
      summary: 'What an app costs to run, what needs regular care, and how to avoid surprise bills.',
      intro: {
        objectives: [
          'List where the running costs of an app come from',
          'Set billing alerts or spending limits to avoid surprise bills',
          'Follow a weekly and monthly care routine',
          'Find your costs on the current pricing page of each provider instead of guessing',
        ],
        why: 'A live app has running costs and needs small regular care. Knowing both now avoids nasty surprises, such as a large usage bill or a site that quietly stopped working.',
      },
      minutes: 15,
      skills: ['launch-and-run', 'fixing-problems'],
      body: [
        {
          type: 'paragraph',
          text: 'Launching is not the end. A live app is like a small shop: it needs small regular care, and it has running costs. Knowing them now avoids nasty surprises later.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **subscription** is a payment that repeats, usually every month, like a phone plan. **Usage-based** billing is different: you pay for what you use, like an electricity meter, so a busy month costs more than a quiet one. A **free tier** is the part of a service you can use at no charge up to a limit, similar to a free data allowance. Go over it and you must pay, or the service slows or stops. **Maintenance** is the small regular care a live app needs, like sweeping the shop and checking the lights. A **backup** is a spare copy of your information, kept so that a mistake or a failure does not destroy it.",
        },
        { type: 'heading', text: 'Where the costs come from' },
        {
          type: 'list',
          items: [
            '**The building tool:** free plans have limits; paid plans are usually monthly.',
            '**Hosting:** sometimes included with the tool, sometimes separate.',
            '**Database and file storage:** free tiers have limits on size and use; growth may need a paid plan.',
            '**Domain:** renewed yearly.',
            '**Payment provider fees:** usually a cut of each payment.',
            '**Extras:** email sending, AI features inside your app, paid add-ons.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Prices change and differ by plan, so make your own list from each provider\'s pricing page. Write the monthly or yearly amount in pesos next to each, and the date it renews.',
        },
        {
          type: "table",
          caption: "Where the costs come from",
          headers: [
            "Cost",
            "How it usually works",
          ],
          rows: [
            [
              "Building tool",
              "Free plans have limits; paid plans are usually monthly",
            ],
            [
              "Hosting",
              "Sometimes included with the tool, sometimes separate",
            ],
            [
              "Database and file storage",
              "Free tiers have limits; growth may need a paid plan",
            ],
            [
              "Domain",
              "Renewed yearly",
            ],
            [
              "Payment provider fees",
              "Usually a cut of each payment",
            ],
            [
              "Extras",
              "Email sending, AI features inside your app, paid add-ons",
            ],
          ],
        },
        {
          type: 'code',
          language: 'text',
          label: 'A simple running-costs sheet',
          code: `Item               Provider        Plan      Amount   Renews
Building tool      (your tool)     Free      0        -
Database           (your service)  Free      0        -
Domain             (registrar)     Yearly    (check)  (date)
Payment fees       (provider)      Per sale  (check)  -

Free-tier limits I am close to:
- (e.g. database size, monthly visits, build credits)`,
        },
        {
          type: 'warning',
          text: 'Turn on spending limits or billing alerts wherever a service offers them, especially for anything charged by usage (AI features, email sending). A bug or a sudden spike in visitors can create a large bill.',
        },
        { type: 'heading', text: 'Regular care' },
        {
          type: 'list',
          items: [
            '**Weekly:** check your site still loads, test the main form, read feedback.',
            '**Monthly:** check usage against free-tier limits, check for security warnings in your database dashboard, update prices and text.',
            '**Before changes:** know how to roll back, and publish at a quiet time.',
            '**Backups:** find out how your database is backed up on your plan, and export important data now and then.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "builder-19-tap-1",
            kind: "tap-reveal",
            title: "Your regular care",
            prompt: "Tap each rhythm to see what to do.",
            concept: "maintenance",
            cards: [
              {
                front: "Weekly",
                back: "Check your site still loads, test the main form and read feedback.",
              },
              {
                front: "Monthly",
                back: "Check usage against free-tier limits, look for security warnings in your database dashboard, and update prices and text.",
              },
              {
                front: "Before changes",
                back: "Know how to roll back, and publish at a quiet time.",
              },
              {
                front: "Backups",
                back: "Find out how your database is backed up on your plan, and export important data now and then.",
              },
            ],
            hints: [
              "Open the cards in any order.",
              "You are done when all four are open.",
            ],
            explanation: "A live app needs small, regular care: a quick weekly check, a monthly look at usage and security, a rollback plan before changes, and backups.",
          },
        },
        {
          type: 'prompt',
          label: 'Make a maintenance plan',
          text: "My app is live. It uses [tool], [database service], [domain registrar] and [payment provider, if any]. Make me a simple maintenance checklist (weekly, monthly, yearly) written for a non-coder. Include where to set billing alerts, how to check free-tier usage, how to export my data as a backup, and what to do if the site goes down. Tell me to confirm prices and limits on each provider's own pricing page.",
        },
        {
          type: 'tip',
          text: 'Keep all logins (tool, database, registrar, payment provider) in a password manager with two-factor authentication on. Losing access to one account can mean losing your app.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Operate it like a service. Set budgets and alerts on every usage-billed provider, rate-limit anything that costs money per call, and cache what you can. Automate dependency maintenance: turn on Dependabot alerts and security updates, which open pull requests to patched versions, run `npm audit` in CI, and review updates instead of merging blindly. Add uptime monitoring and error alerts with a named owner, and write a short runbook for the three most likely incidents. Verify backups by restoring one. On Supabase, daily backups are included on paid plans while free projects should export their own data, point-in-time recovery is an add-on, and stored files are not part of database backups, so files need their own copy. Record the recovery time and the amount of lost data you can accept.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "GitHub docs: Dependabot alerts flag known vulnerabilities, and Dependabot security updates open pull requests that update a vulnerable dependency to the minimum patched version; version updates are a separate feature configured in dependabot.yml. npm docs: npm audit reports known vulnerabilities in your dependencies, and npm audit fix applies remediations, some of which need manual review. Supabase docs: paid plans take daily backups, the Free plan should be exported with the CLI, point-in-time recovery is an add-on, and Storage objects are not included in database backups.",
          checked: "2026-11-14",
          sources: [
            {
              label: "GitHub docs: About Dependabot security updates",
              url: "https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates",
            },
            {
              label: "npm docs: npm audit",
              url: "https://docs.npmjs.com/cli/v10/commands/npm-audit",
            },
            {
              label: "Supabase docs: Database backups",
              url: "https://supabase.com/docs/guides/platform/backups",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "A live app has running costs: the tool, hosting, database and storage, the domain, payment fees and extras.",
            "Make your own list from each provider's current pricing page, with the amount and the renewal date.",
            "Turn on spending limits or billing alerts wherever they are offered, especially for usage-based services.",
            "Check the site weekly, usage and security warnings monthly, and know how your data is backed up.",
            "Keep your logins in a password manager with two-factor authentication.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-19-q1',
          prompt: 'Why set billing alerts or spending limits?',
          choices: [
            'They make the app faster',
            'A bug or sudden traffic spike can create a large usage bill',
            'They are needed for DNS',
          ],
          answer: 1,
          explanation: 'Usage-based services can grow costs quickly. Alerts and limits catch it early.',
        },
        {
          id: 'builder-19-q2',
          prompt: 'Where should you get your running-cost figures?',
          choices: [
            'Each provider\'s current pricing page',
            'A video from two years ago',
            'Guessing',
          ],
          answer: 0,
          explanation: 'Prices change and differ by plan, so check the provider\'s own page.',
        },
        {
          id: 'builder-19-q3',
          prompt: 'Which is a sensible weekly task?',
          choices: [
            'Redesigning the whole site',
            'Changing your domain name',
            'Deleting old database tables',
            'Checking the site loads and the main form still works',
          ],
          answer: 3,
          explanation: 'A quick weekly check catches breakage before customers do.',
        },
        {
          id: "builder-19-q4",
          audience: { max: "beginner" },
          prompt: "What does \"usage-based billing\" mean?",
          choices: [
            "You pay according to how much you use, like an electricity meter",
            "You pay the same fixed amount every month",
            "You only pay if you are happy with the service",
            "You pay once and use it forever",
          ],
          answer: 1,
          explanation: "With usage-based billing the bill grows with use, so a bug or a busy month can raise it. That is why alerts and spending limits matter.",
        },
        {
          id: "builder-19-q5",
          audience: { min: "advanced" },
          prompt: "Your database backups run daily, but you have never restored one. What is the best improvement?",
          choices: [
            "Turn backups off to save cost",
            "Trust the green status icon in the dashboard",
            "Run a restore drill into a separate project, time it, and check that the app and the uploaded files work",
            "Add more daily backups so there are more copies",
          ],
          answer: 3,
          explanation: "A backup you have never restored is an assumption. A drill proves it works, measures the recovery time and reveals what is missing, such as files.",
        },
      ],
      task: {
        title: 'Know your running costs',
        steps: [
          'Copy the running-costs sheet and fill it in from each provider\'s pricing page.',
          'Turn on billing alerts or spending limits wherever offered.',
          'Run the maintenance plan prompt and save the checklist.',
          'Turn on two-factor authentication for every account your app depends on.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Look at your phone or electricity bill and say which parts are fixed and which depend on usage. Then mark which items in your running-costs sheet are fixed and which are usage-based.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Enable dependency alerts for your repository, run an audit, set budget alerts, and do a timed restore from backup into a scratch project. Write down the backup frequency, retention, recovery point and recovery time you measured, and what is not covered, such as stored files.",
          ],
        },
      ],
    },
    {
      id: 'builder-20',
      day: 20,
      title: 'When to hire a developer',
      summary: 'Signs you have outgrown vibe coding alone, and how to hire and hand over safely.',
      intro: {
        objectives: [
          'Recognise the signs that it is time to hire a developer',
          'Put the steps of hiring a developer in a safe order',
          'Give a developer access as a collaborator, never by sharing your main passwords',
          'List what a written agreement should include',
        ],
        why: 'Knowing when to ask for professional help protects your customers and your money when the stakes rise. Hiring safely means you keep ownership of what you built.',
      },
      minutes: 15,
      skills: ['product-planning', 'launch-and-run'],
      body: [
        {
          type: 'paragraph',
          text: 'Vibe coding takes you a long way. But some moments call for a professional developer, and knowing when is a skill too. Hiring help is not failure. It is what successful small businesses do when the stakes rise.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **developer** is a person who writes and looks after software for a living. A **repository**, or repo, is the folder, kept on a site like GitHub, that holds all of an app's code and every earlier version of it. A **collaborator** is someone you invite to work in your project with their own login, like giving a contractor their own key that you can take back, instead of handing over your master key. A **contract** is a written agreement: what will be done, by when, for what price and who owns the result. Hiring help well mostly means making sure that, afterwards, you still hold the keys to everything.",
        },
        { type: 'heading', text: 'Signs it is time' },
        {
          type: 'list',
          items: [
            '**Real money:** you are moving beyond payment links to checkout inside your app.',
            '**Sensitive data:** health, financial, ID or children\'s information.',
            '**Growth:** many users, slow pages, or costs climbing fast.',
            '**Stuck loops:** the AI keeps breaking one thing while fixing another, and rolling back no longer helps.',
            '**A phone app in the app stores:** publishing to the App Store or Google Play adds steps and reviews where experience helps.',
            '**A security worry** you cannot explain or fix.',
          ],
        },
        { type: 'heading', text: 'Hiring safely' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Make sure your code is exportable, ideally connected to a GitHub repository you own.',
            'Share your one-page spec and a short list of what you need.',
            'Look for developers on job sites such as OnlineJobs.ph, freelance platforms, or through referrals. Ask for past work you can open.',
            'Start with a **small paid trial task** before a big project.',
            'Agree in writing on the scope, the price, the timeline, and that **you own** the code and accounts.',
            '**Invite** them to your tools as a collaborator. Never hand over your main passwords.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "builder-20-arrange-1",
            kind: "arrange",
            title: "Hiring safely",
            prompt: "Put the steps for hiring a developer in a sensible order.",
            concept: "hiring a developer",
            language: "text",
            solution: [
              "Make sure your code is exportable, ideally on a GitHub repository you own",
              "Share your one-page spec and a short list of what you need",
              "Look for developers and ask for past work you can open",
              "Start with a small paid trial task",
              "Agree in writing on scope, price, timeline and that you own the code and accounts",
              "Invite them to your tools as a collaborator",
            ],
            reasons: [
              "Your code has to be yours and portable before anyone else works on it.",
              "The developer needs to know what you want.",
              "Find candidates and look at what they have really built.",
              "Test the working relationship on something small first.",
              "Put the terms in writing before the bigger work.",
              "Give access last, as a collaborator, and never share your main passwords.",
            ],
            hints: [
              "What has to be true about your code before you hand anything over?",
              "You look at their work before you give them a trial task.",
              "Access to your tools comes last, as an invitation.",
            ],
            explanation: "Prepare your code and spec first, find candidates and look at their work, start small, agree in writing, and only then invite them as a collaborator, never sharing your main passwords.",
          },
        },
        {
          type: 'prompt',
          label: 'Write a clear job post',
          text: "Help me write a short job post for a freelance developer. My app was built with [tool] and is live at [link]. Here is my spec: [paste spec]. What I need help with: [describe the problem or feature]. Include: the task, what 'done' means, the skills needed, that I own the code and accounts, and that I'd like a small paid trial first. Also give me five questions to ask candidates, in plain words, so I can judge their answers.",
        },
        {
          type: 'warning',
          text: 'A contract matters even for small jobs. Keep it simple and clear, and for anything large or unusual, have it checked by a lawyer. Confirm any tax or registration questions with the BIR or an accountant.',
        },
        {
          type: 'paragraph',
          text: 'Look how far you have come: from "I have never coded" to a live app with login, a database and your own domain. You can describe what you want, fix problems calmly and run what you built. Finish Project 2 and share your link. You built that.',
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Prepare the handover as an engineer would want to receive it. The repository needs a README that says how to run, test and deploy it, a list of environment variables (names only), the database schema and migrations, a one-page architecture note, and passing CI. Give contractors their own accounts with least privilege, ask for pull requests you review instead of direct pushes to main, and rotate any secret they saw when the engagement ends. Agree in writing who owns the code and the accounts. Code published without a licence is under exclusive copyright by default, so state the rights you receive, and check the licences of your dependencies. When a developer inherits AI-generated code, expect them to propose tests, a security review and refactoring before adding features.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "choosealicense.com: unless a licence says otherwise, nobody else can copy, distribute or modify your work, and publishing code in a public repository does not by itself grant those permissions.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Choose a License: No license",
              url: "https://choosealicense.com/no-permission/",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Hiring help is not failure. Some moments call for a professional developer.",
            "Signs it is time: real money in checkout, sensitive data, growth, stuck loops, an app-store phone app, or a security worry you cannot explain.",
            "Make sure your code is exportable, share your spec, look at past work and start with a small paid trial task.",
            "Agree in writing that you own the code and accounts, and invite the developer as a collaborator. Never hand over your main passwords.",
          ],
        },
      ],
      quiz: [
        {
          id: 'builder-20-q1',
          prompt: 'Which situation most clearly calls for a developer?',
          choices: [
            'Changing a button colour',
            'Adding a new photo',
            'Moving from payment links to checkout inside your app',
          ],
          answer: 2,
          explanation: 'In-app payments involve real money and security, where a professional review matters most.',
        },
        {
          id: 'builder-20-q2',
          prompt: 'How should you give a developer access to your tools?',
          choices: [
            'Invite them as a collaborator, keeping your own passwords private',
            'Send them your main passwords by chat',
            'Share one account between you',
          ],
          answer: 0,
          explanation: 'Inviting keeps control with you and lets you remove access later.',
        },
        {
          id: 'builder-20-q3',
          prompt: 'Why start with a small paid trial task?',
          choices: [
            'It is free for you',
            'It lets you see their work and communication before a big project',
            'It is required by law',
          ],
          answer: 1,
          explanation: 'A small trial shows quality and reliability with little risk.',
        },
        {
          id: 'builder-20-q4',
          prompt: 'What should your written agreement with a developer include?',
          choices: [
            'Only the price',
            'Nothing; chat messages are enough',
            'Their personal social media accounts',
            'Scope, price, timeline, and that you own the code and accounts',
          ],
          answer: 3,
          explanation: 'Clear terms prevent disputes and make sure what you paid for stays yours.',
        },
        {
          id: "builder-20-q5",
          audience: { max: "beginner" },
          prompt: "What is a collaborator?",
          choices: [
            "Someone you invite to work on your project with their own login, which you can remove later",
            "Someone who shares your own password",
            "A paid advert for your app",
            "A kind of backup",
          ],
          answer: 0,
          explanation: "A collaborator has their own access that you control and can take away. That is safer than sharing your main passwords.",
        },
        {
          id: "builder-20-q6",
          audience: { min: "advanced" },
          prompt: "A freelancer asks for admin credentials to your production hosting and database. What is the best arrangement?",
          choices: [
            "Send the keys in a group chat so the whole team has them",
            "Refuse all access and accept only screenshots of their work",
            "Create a scoped account or role for them, require pull requests, and rotate any shared secrets when the work ends",
            "Share the owner login for speed",
          ],
          answer: 3,
          explanation: "Least-privilege access, reviewed pull requests and rotation at the end give the developer what they need while you keep control of the accounts.",
        },
      ],
      task: {
        title: 'Prepare for help, even if you do not need it yet',
        steps: [
          'Check whether your tool can export your code or connect it to GitHub, and do it if you can.',
          'Write down any of the "signs it is time" that apply to you.',
          'Run the job post prompt and save the draft for later.',
          'Finish Project 2 and share your live link.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write a one-paragraph description of your app for a stranger: who it is for, what it does, where it lives, and the list of accounts it depends on. That is the start of a handover.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write a handover pack: a README (run, test, deploy), environment variable names, the schema and migrations, an architecture page, a list of accounts and who owns each, and a rotation checklist for the end of the contract.",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      id: 'builder-p1',
      title: 'Your first website, live',
      summary: 'A small website for your own idea, built in a vibe-coding tool from your one-page spec, with a clean design and published at a working link.',
      outcome: 'A live link you can show a customer, partner or school that proves you can plan, build and publish a website with AI tools.',
      unlockAfterDay: 8,
      steps: [
        {
          id: 'builder-p1-s1',
          text: 'Open your one-page spec from Day 3 and pick the screens for this first version (two or three is plenty).',
        },
        {
          id: 'builder-p1-s2',
          text: 'Build it one screen at a time in your chosen tool (for example Lovable, Bolt or Replit), testing after every change.',
          link: 'https://lovable.dev',
        },
        {
          id: 'builder-p1-s3',
          text: 'Apply the design basics from Day 8: one main colour, good contrast, one main button per screen, and a phone-friendly layout.',
        },
        {
          id: 'builder-p1-s4',
          text: 'Replace all placeholder text and test data with real content and images you have the right to use.',
        },
        {
          id: 'builder-p1-s5',
          text: 'Publish it and open the link on your phone and on a laptop. Fix anything that looks broken, then publish again.',
        },
        {
          id: "builder-p1-s6",
          audience: { max: "beginner" },
          text: "Scaffold for newcomers: keep it to two screens. After each prompt, ask the AI to explain in plain words what it just built, and write one sentence of your own about it. If a screen goes wrong, roll back to the last version that worked and ask for a smaller change instead of adding more.",
        },
        {
          id: "builder-p1-s7",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Add a contact form that saves messages to a database table, with a rule that rejects an empty message. Prove it works by finding your test entry in the database dashboard, and connect the project to a GitHub repository so you can open the files.",
        },
        {
          id: "builder-p1-s8",
          audience: { min: "advanced" },
          text: "Sync the project to a repository you own and run it from a clean checkout. Review what was generated: the dependencies, where configuration lives, and any key in the code. Check accessibility with numbers: measure text contrast against WCAG 2.2 AA (4.5:1 for normal text), confirm 24 by 24 CSS pixel tap targets and keyboard focus, and record the page weight before and after you compress images.",
        },
        {
          id: "builder-p1-s9",
          audience: { min: "professional" },
          text: "Run the build as a documented workflow: write the spec and acceptance criteria as a markdown file in the repository, make each prompt a small commit, and keep a short review log of what the generated diffs got wrong and how you caught it.",
        },
      ],
      submission: {
        kind: 'url',
        label: 'Your live website link',
        placeholder: 'https://your-site.example.com',
        hint: 'A public link that opens without signing in, plus one sentence on who the site is for.',
      },
      rubric: [
        'The link opens publicly and works on a phone',
        'The site serves one clear user and purpose that matches the spec',
        'Each screen has one obvious main action',
        'Text is readable with good contrast and no placeholder or test content remains',
        'Every button and link goes somewhere sensible',
      ],
      rubricExtra: [
        {
          audience: { max: "beginner" },
          items: [
            "Two working screens are enough if the learner can explain in plain words what each screen does and how they tested it.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          items: [
            "A contact form saves real entries to a database and rejects an empty message, and the learner can show where they found a test entry.",
          ],
        },
        {
          audience: { min: "advanced" },
          items: [
            "The repository builds from a clean checkout, contrast and tap-target checks are recorded with numbers, and nothing secret is in the code.",
          ],
        },
        {
          audience: { min: "professional" },
          items: [
            "The repository holds the written spec with acceptance criteria and a review log naming defects found in generated diffs.",
          ],
        },
      ],
    },
    {
      id: 'builder-p2',
      title: 'Your app with login and a database, on your own domain',
      summary: 'Grow your project into a real app: people sign in, information is saved in a database with access rules, and it runs on a domain you own.',
      outcome: 'A working app on your own domain that shows you can plan, build, secure and launch a real product with AI tools.',
      unlockAfterDay: 16,
      steps: [
        {
          id: 'builder-p2-s1',
          text: 'Update your spec: list who signs in, what data is saved, and who can see and change what.',
        },
        {
          id: 'builder-p2-s2',
          text: 'Add login using the built-in authentication of your tool\'s database service, and make two test accounts with different roles.',
        },
        {
          id: 'builder-p2-s3',
          text: 'Connect a database: create your tables from the spec, link your forms and lists, and turn on access rules. Find your test entries in the dashboard.',
        },
        {
          id: 'builder-p2-s4',
          text: 'Test as a stranger in a private window: protected pages and data must be blocked when signed out.',
        },
        {
          id: 'builder-p2-s5',
          text: 'Connect your own domain using the DNS records from your tool\'s custom domain page, and check it with and without www.',
        },
        {
          id: 'builder-p2-s6',
          text: 'Add a page title, meta description, share preview and a short privacy notice, then run the launch checklist from Day 14 and publish.',
          link: 'https://search.google.com/search-console',
        },
        {
          id: "builder-p2-s7",
          audience: { max: "beginner" },
          text: "Scaffold for newcomers: build owner-only login with one table and one list before anything else. Ask the AI to explain the access rule in one plain sentence, and test it with a private window and a second account. Connect your own domain last, once everything else works.",
        },
        {
          id: "builder-p2-s8",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Add a second table that refers to the first (for example orders and their items), enforce one rule at the database level (a required column or a list of allowed values), and write a small table showing what each role can do with each table.",
        },
        {
          id: "builder-p2-s9",
          audience: { min: "advanced" },
          text: "Review your access rules like an engineer: list each table's row level security policies, confirm no secret or service-role key reaches the browser, and try changing identifiers in requests to read another user's rows. Set up backups or an export and do one restore into a scratch project, and turn on dependency alerts for the repository.",
        },
        {
          id: "builder-p2-s10",
          audience: { min: "professional" },
          text: "Work through an agent-assisted process with evidence: a written spec and threat model, small reviewed pull requests, access-rule tests that run in CI, and a handover pack (README, environment variable names, schema, rollback steps) that another developer could use without asking you questions.",
        },
      ],
      submission: {
        kind: 'url',
        label: 'Your app on your own domain',
        placeholder: 'https://yourdomain.com',
        hint: 'Your live domain link. In the notes, describe the two roles, what each can see, and how a reviewer can try it (use a test account, never a real one).',
      },
      rubric: [
        'The app loads on its own domain with HTTPS (the padlock)',
        'Login works, and protected pages are blocked for signed-out visitors',
        'Form entries are saved in a database and show up where the spec says',
        'Each role sees only what it should, as described in the notes',
        'There is a privacy notice, and no secret keys or real personal data are visible',
        'Page title, description and share preview are set',
      ],
      rubricExtra: [
        {
          audience: { max: "beginner" },
          items: [
            "The learner can explain in plain words who can see what, and shows how they tested it as a stranger and with a second account.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          items: [
            "A database-level rule rejects bad data, and a role-by-table table shows what each account can do.",
          ],
        },
        {
          audience: { min: "advanced" },
          items: [
            "Access rules were tested with changed identifiers, no privileged key is in the browser, and a restore from backup was tried.",
          ],
        },
        {
          audience: { min: "professional" },
          items: [
            "A threat model, access-rule tests in CI, reviewed pull requests and a usable handover pack are attached as evidence.",
          ],
        },
      ],
    },
  ],
  coachRole: {
    id: 'build-buddy',
    label: 'Build buddy',
    description: 'Step-by-step help when your app breaks: one small step at a time, with the exact prompt to paste into your builder.',
    instructions:
      'The learner has never coded and is building in a vibe-coding tool such as Lovable, Bolt, Replit or v0. When something breaks, first ask for the exact error text (with any keys or personal details removed) and what they changed just before it broke. Give one small next step at a time in plain words, wait for the result, and never give a long list of fixes at once. Whenever the fix belongs in the builder, write the exact prompt to paste, ending with "keep everything else the same". If two attempts fail, suggest rolling back to the last working version and trying a smaller step, and if the problem involves payments, sensitive data or security they cannot verify, say kindly that it is time to ask a developer.',
  },
  icon: 'construction',
  updated: '2026-11-13',
};
