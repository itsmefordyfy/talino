import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * Build a SaaS Product with AI. The running example is "Paalala", a small booking-reminders tool for salons and clinics.
 * What was actually run while this course was written (Node.js 22, PostgreSQL 14 on a scratch cluster, no paid API calls):
 * the row-level security demo (lesson 6) and the insert-only waitlist (lesson 3) against a real PostgreSQL, the reminder
 * rule with node:test (lesson 5), the webhook signature check with a real HMAC, a duplicate, a forgery, a tampered body and a
 * replay (lesson 7), and the proration and plan-limit arithmetic. The output shown for those is the real output (only
 * the psql prompt noise was trimmed). Every "example AI answer" is written for this course and labelled as such: it is not the
 * output of a real model. Billing uses a payment provider's TEST mode and invented ids; no real card data appears anywhere.
 * Product statements live in dated `version` notes.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  supabaseRls: { label: 'Supabase docs: Row Level Security', url: 'https://supabase.com/docs/guides/database/postgres/row-level-security' },
  supabaseKeys: { label: 'Supabase docs: API keys', url: 'https://supabase.com/docs/guides/api/api-keys' },
  supabaseServerAuth: { label: 'Supabase docs: Creating a Supabase client for server-side auth', url: 'https://supabase.com/docs/guides/auth/server-side/creating-a-client' },
  supabaseAuth: { label: 'Supabase docs: Auth', url: 'https://supabase.com/docs/guides/auth' },
  supabaseSmtp: { label: 'Supabase docs: Send emails with custom SMTP', url: 'https://supabase.com/docs/guides/auth/auth-smtp' },
  vercelEnv: { label: 'Vercel docs: Environment variables', url: 'https://vercel.com/docs/environment-variables' },
  vercelCron: { label: 'Vercel docs: Cron Jobs', url: 'https://vercel.com/docs/schedules/cron-jobs' },
  vercelAnalytics: { label: 'Vercel docs: Web Analytics', url: 'https://vercel.com/docs/analytics' },
  owaspTop10: { label: 'OWASP Top 10:2025 (introduction)', url: 'https://top10.owasp.org/2025/0x00_2025-Introduction' },
  stripeNode: { label: 'stripe-node README on GitHub (webhook signature verification)', url: 'https://github.com/stripe/stripe-node' },
  nodeCrypto: { label: 'Node.js 22 docs: crypto (createHmac, timingSafeEqual)', url: 'https://nodejs.org/docs/latest-v22.x/api/crypto.html' },
  ccBest: { label: 'Claude Code docs: Best practices', url: 'https://code.claude.com/docs/en/best-practices' },
  ccMemory: { label: 'Claude Code docs: How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory' },
  codexAgentsMd: { label: 'Codex docs: AGENTS.md', url: 'https://developers.openai.com/codex/guides/agents-md' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'build-saas-ai-01',
    day: 1,
    title: 'Pick and validate a SaaS idea',
    summary: 'What a SaaS is, what makes a first idea worth building, and how to get real evidence before you ask AI to build anything.',
    minutes: 22,
    skills: ['validate-idea'],
    intro: {
      objectives: [
        'Explain what a SaaS product is and how it differs from an app you build once and give away',
        'Turn a vague idea into one sentence naming a specific person and a costly, repeated problem',
        'Tell weak evidence from strong evidence, and plan five conversations that produce the strong kind',
      ],
      why: 'With AI, building a working product in a weekend is no longer the hard part. Choosing something that strangers will keep paying for is, and a week of asking the right people saves months of building the wrong thing.',
    },
    body: [
      {
        type: 'paragraph',
        text: '**SaaS** stands for “software as a service”. It is software people use through a browser or an app and **pay for again and again** (monthly or yearly) instead of buying once. A salon owner who pays for a reminder tool every month is a SaaS customer. That one fact changes the whole job. You are no longer finishing a project: you are promising a service that must keep working, keep their data safe, and keep being worth the money next month. A free app can be abandoned; a SaaS cannot. Throughout this course we build one real example, **Paalala** (Filipino for “reminder”): a tool that texts or emails a salon’s customers before their appointment so fewer people forget to show up.',
      },
      {
        type: 'paragraph',
        text: 'Why start with the idea and not with the AI? Because AI has made *building* cheap. A coding agent can produce a login page, a database and a dashboard in an afternoon. That makes the old mistake easier than ever: spending a month on something nobody wanted. The scarce skill is now picking the right thing and proving, early and cheaply, that someone will pay. (The course Turn an Idea into a Working Product covers research and interviews in depth; here we do the version a SaaS needs: will someone pay *every month*?)',
      },
      { type: 'heading', text: 'Four traits of a good first SaaS idea' },
      {
        type: 'list',
        items: [
          '**A specific person.** “Independent salon owners in Naga City” is a person you can find and phone. “Businesses” is nobody.',
          '**A repeated, costly problem.** A forgotten appointment is an empty chair and lost income, and it happens every week. A problem that is annoying once a year will not support a subscription.',
          '**A workaround that already exists.** The owner texts every customer by hand the night before, or writes names in a notebook. A workaround is proof the problem is real, because the person is already spending time or money on it.',
          '**A result you can say in one sentence.** “Fewer no-shows, without you typing a single message.” If you need a paragraph to explain the benefit, the idea is not sharp yet.',
        ],
      },
      { type: 'heading', text: 'Use AI to think, not to decide' },
      {
        type: 'paragraph',
        text: 'AI is a good thinking partner at the start. It can list problems small shops have, draft interview questions, tidy your notes, and point out what a competitor charges for. It cannot tell you whether a real person will pay, because it has never met your customer and tends to be encouraging: ask any chat assistant whether your idea is good and it will usually say yes. Treat everything it says about the market as a *claim to check*, never as evidence. It can also invent companies and statistics, so any number it gives you must be traced to a real source before you rely on it.',
      },
      {
        type: 'prompt',
        label: 'A first brainstorming prompt (for anyone)',
        text: 'I want to build a small subscription tool for people who run small salons and barbershops in the Philippines. List 10 specific problems they have that cost them money every week. For each one, tell me how they probably handle it today and who in the shop would feel the pain. Do not tell me which idea is best. I will check them by talking to owners.',
      },
      {
        type: 'prompt',
        audience: { min: 'advanced' },
        label: 'A constrained version (for experienced builders)',
        text: 'Context: B2B SaaS for independent appointment-based SMBs (salons, clinics, tutors) in the Philippines; one founder; budget for about 10 weeks of building. Task: propose 8 candidate wedge products. For each give: buyer vs daily user, the current workaround, a falsifiable pricing hypothesis, the cheapest test that could kill it within a week, and what you assumed that I should verify. Mark anything that depends on a statistic as UNVERIFIED and do not invent sources.',
      },
      { type: 'heading', text: 'Evidence: weak, medium, strong' },
      {
        type: 'table',
        headers: ['Evidence', 'What it really tells you', 'Strength'],
        rows: [
          ['Friends say “great idea!”', 'They like you. People are polite and nothing is at stake for them.', 'Weak'],
          ['The AI says the market is huge', 'It can write a convincing paragraph about any market. It has not met a customer.', 'Weak'],
          ['Five owners describe the problem unprompted and show you their workaround', 'The problem is real and they already spend effort on it.', 'Medium'],
          ['An owner says “yes, bill me monthly once it works”, and gives a deposit or signs a short letter of intent', 'Someone gave up something real: money or a commitment.', 'Strong'],
        ],
        caption: 'Behaviour beats opinion. The more the person has to give up, the stronger the evidence.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The validation loop. Every step is cheap, and any step can send you back to change the idea.',
        source: `flowchart LR
  A[Idea] --> B[One sentence: who, what problem, what it costs]
  B --> C[Talk to 5 real people]
  C --> D[Ask for a commitment: deposit or signed intent]
  D -->|someone commits| E(Build the smallest version)
  D -->|nobody does| F[Change the person or the problem]
  F --> B`,
      },
      {
        type: 'paragraph',
        text: '**The five-conversation test.** Find five people who match your one sentence: ask a friend for introductions, message shop owners, walk in on a quiet afternoon. Ask about the *last time* the problem happened (“Tell me about the last no-show you had. What did it cost you? What did you do?”). Past behaviour is honest; predictions are not. Then ask for a commitment, in plain words: “I am building this. If it works, would you pay a monthly fee? Can I invoice you from the first month, and may I take a small deposit now?” A “maybe” is a no. You are not being rude; you are measuring.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine you want to open a stall selling umbrellas. You would not buy a thousand umbrellas first. You would stand in the rain and ask ten people with no umbrella: “Would you pay ₱150 for one right now?” Validation is the same: ask before you build. The difference with SaaS is that the customer pays *repeatedly*, so you are really asking, “Is this problem painful enough that you would pay every month?” And since an AI chat assistant is not a person with a salon and a wallet, its opinion cannot answer that question. Only your five conversations can. A **workaround** is simply whatever the person does today instead, such as texting customers by hand. If they have one, they have the problem.',
      },
      {
        type: 'tip',
        audience: { min: 'intermediate' },
        text: 'You have built projects before, so the trap for you is skipping this step because building feels like progress. Set yourself a rule before you open an editor: no code until at least one real person has agreed to pay, or you have written down the specific evidence that would make you stop. Then ask your AI tool to attack your plan: “List the three most likely reasons nobody would pay for this, and the cheapest test for each.”',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced builders.** Separate the buyer from the user: the receptionist may love a tool the owner will not pay for, and a clinic’s buyer may be a practice manager with a procurement habit. Write the unit economics on one page before you build: a price hypothesis, the cost to serve (messaging fees scale with usage), a rough payback on acquiring a customer, and the monthly churn you can tolerate. Small-business customers churn when they close or lose interest, so a narrow, reachable segment beats a broad one. Competitors are evidence that the market pays; read their pricing pages and reviews for the complaints you could solve. If AI helps analyse your interview transcripts, keep the raw notes, ask for direct quotes next to every claim, and read the quotes yourself: summaries drift toward what you hoped to hear.',
      },
      {
        type: 'takeaways',
        items: [
          'A SaaS is software people pay for repeatedly, so it needs a problem painful enough to pay for every month.',
          'A good first idea names a specific person, a costly repeated problem, an existing workaround and a one-sentence result.',
          'AI helps you think, draft questions and summarise notes, but it cannot be your customer and cannot prove anyone will pay.',
          'Behaviour is stronger evidence than opinion: a deposit or signed commitment beats “great idea”.',
          'Five real conversations about the last time the problem happened will teach you more than a week of chatting with an AI.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-01-scenario-1',
          kind: 'scenario',
          title: 'Which result do you trust?',
          prompt: 'Choose the result that best justifies building the first version of Paalala.',
          concept: 'validation evidence',
          situation: 'After two weeks you have four results from your Paalala research. You can only build on one of them. You have the time to build exactly one version.',
          options: [
            { text: 'Three owners showed you the notebook where they track bookings and told you how many no-shows they had last month; one of them paid a small deposit to be the first customer.', consequence: 'The problem is real, they already work around it, and one person gave up money. This is the evidence to build on, and the deposit-payer is your first user to look after.', quality: 'best' },
            { text: 'Your cousins and friends all reacted with “wow, that would be so useful”.', consequence: 'They are kind, and none of them runs a salon or pays for anything. This tells you almost nothing about the market.', quality: 'poor' },
            { text: 'You asked an AI assistant to evaluate the idea and it listed ten reasons the market is large and growing.', consequence: 'The AI will write a convincing case for nearly any idea. It cannot confirm that a real owner will pay, and its market figures may be invented.', quality: 'poor' },
            { text: 'A post about the idea got 120 likes from other builders in an online group.', consequence: 'Likes cost nothing, and the audience is not your customer. It might help later for reach, but it is not proof that salon owners will pay.', quality: 'acceptable' },
          ],
          hints: [
            'Which result needed the person to give something up, not just say something?',
            'Look for the customer’s own workaround and a payment, not a compliment or a count.',
            'The three owners with their notebooks and one deposit are the only result with real behaviour in it.',
          ],
          explanation: 'Evidence gets stronger the more the person has to give up. A workaround shows the problem exists; a deposit shows it is worth money. Compliments, likes and an AI’s enthusiasm cost nobody anything.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-01-match-1',
          kind: 'match',
          title: 'What does this evidence prove?',
          prompt: 'Match each thing a founder reports with what it really shows.',
          concept: 'reading evidence',
          labels: { terms: 'What the founder reports', meanings: 'What it shows' },
          pairs: [
            { term: '“Twelve friends said they would definitely use it.”', definition: 'Opinion only: nothing was at stake for anyone', note: 'Friends have nothing to lose by saying yes, so this is a polite opinion.' },
            { term: '“She showed me the paper list she texts customers from every evening.”', definition: 'A workaround that proves the problem exists today', note: 'The owner is already spending time on the problem.' },
            { term: '“He said yes to a monthly invoice and paid a deposit this morning.”', definition: 'A commitment of money, the strongest signal so far', note: 'Money changed hands, so this is behaviour rather than opinion.' },
            { term: '“The AI says 4 million small businesses need this.”', definition: 'A claim to be traced to a real source before it is trusted', note: 'The number may be invented; treat it as a claim, not evidence.' },
          ],
          hints: [
            'Ask what the other person gave up in each case: nothing, time, or money.',
            'A number from an AI has no source yet, so it is a claim waiting to be checked.',
            'Opinion goes with friends, workaround with the paper list, commitment with the deposit.',
          ],
          explanation: 'Each item sits at a different strength. What the person did (a workaround, a payment) outweighs what they said, and anything from an AI needs a real source behind it.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-01-q1',
        prompt: 'Which statement is specific enough to start validating?',
        choices: [
          'A platform that helps businesses of every size grow, reach more customers online and work more efficiently with modern tools',
          'Text reminders that stop independent salon owners in one city losing income to forgotten appointments',
          'An app for anybody who has an appointment to remember',
          'A tool that uses AI to make small shops more efficient every single day',
        ],
        answer: 1,
        explanation: 'It names a person you can find (independent salon owners in one city) and a costly, repeated problem (forgotten appointments). The others name nobody in particular, so you could not tell whether you were right.',
      },
      {
        id: 'build-saas-ai-01-q2',
        prompt: 'Why can asking a chat assistant “is my SaaS idea good?” not replace talking to owners?',
        choices: [
          'Chat assistants refuse to discuss business ideas at all, so they never produce a reply to this kind of question, whatever you type.',
          'The assistant only knows about software companies that existed before it was trained, so it cannot say anything useful about small local shops or the people who run them.',
          'It has never met your customer, tends to be encouraging, and can state invented figures, so its answer is a claim to check rather than evidence.',
          'The answer is correct but only valid for the country where the model was built, so it needs translating before you use it elsewhere.',
        ],
        answer: 2,
        explanation: 'Evidence is what real people did or gave up. An assistant can generate a persuasive case for almost any idea and may invent statistics, so use it to think and draft questions, not to decide.',
      },
      {
        id: 'build-saas-ai-01-q3',
        prompt: 'An owner says “maybe I would pay, it sounds nice”. How should you count that?',
        choices: [
          'As a “no” for now: a maybe costs the person nothing, so ask for a deposit or a monthly invoice and see what they do',
          'As half a customer, because the owner took time to talk to you and did not say no outright, which already puts you ahead of most ideas',
          'As strong evidence, because owners of small shops rarely say anything positive about new software unless they mean it',
          'As a yes, since people who say maybe usually pay once the product exists',
        ],
        answer: 0,
        explanation: 'A “maybe” is an opinion and nothing was given up. Asking for a small deposit or an invoice from month one turns the conversation into behaviour you can trust.',
      },
      {
        id: 'build-saas-ai-01-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a SaaS product?',
        choices: [
          'A free app you build once and publish for everyone, with no ongoing promise to the people who use it',
          'A programming language that is used to build websites and online stores',
          'Software people use online and pay for repeatedly, every month or year',
          'A document that describes what an app should do',
        ],
        answer: 2,
        explanation: 'SaaS means “software as a service”: you rent the software by paying again and again, which is why you must keep it running and keep it worth the money.',
      },
      {
        id: 'build-saas-ai-01-q5',
        audience: { min: 'advanced' },
        prompt: 'The receptionist at a clinic loves your prototype, but the owner (who pays all bills) says “we are fine with our spreadsheet”. What is the best next step?',
        choices: [
          'Build everything the receptionist asked for first, because she is the person who will use it every day and her enthusiasm will carry the sale',
          'Count the receptionist as the customer and price the plan for the small amount of money she could approve without asking anyone',
          'Offer the owner a free year so the whole shop gets used to the tool before you ever mention charging for it or ask for a commitment',
          'Find out what the owner measures (missed appointments, income lost) and test whether your tool moves that number, because the buyer decides',
        ],
        answer: 3,
        explanation: 'The buyer and the user can be different people, and the buyer’s reasons decide whether you are paid. Learn their number and test against it. A free year delays the only evidence that counts.',
      },
    ],
    task: {
      title: 'Write your idea sentence and plan five conversations',
      steps: [
        'Write one sentence in this shape: “[specific person] loses [specific thing] because [problem], and today they [workaround].” Use Paalala or an idea of your own.',
        'List five real people who match the sentence and how you will reach each one (name or a way to find them).',
        'Write five questions that ask about the last time the problem happened, plus one commitment question you will ask at the end.',
        'Ask an AI assistant to challenge your questions: “Which of my questions are leading? Rewrite any that ask for opinions instead of past behaviour.”',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain what SaaS means as if I run a small shop, then give me three examples of subscriptions I already pay for.” Write down which of your own subscriptions you would miss most, and why.'] },
      { audience: { min: 'advanced' }, steps: ['Add a one-page unit-economics sketch: price hypothesis, cost to serve at 200 reminders per shop per month, target payback period and the churn that would kill the idea. Mark every number as assumed or sourced.'] },
    ],
  },
  {
    id: 'build-saas-ai-02',
    day: 2,
    title: 'Write the product spec',
    summary: 'A written spec turns your idea into something an AI can build and you can check, and gives every new AI session the same starting point.',
    minutes: 25,
    skills: ['product-spec'],
    intro: {
      objectives: [
        'Write a one-page SaaS spec with the user, the core flow, the data, the rules, what is out of scope and testable acceptance criteria',
        'Turn a vague sentence such as “reminders work well” into a check a person or a test can pass or fail',
        'Have an AI interview you into a spec, and keep a short instructions file for the rest of the project',
      ],
      why: 'An AI builds what you tell it, quickly and confidently. If what you told it was vague, you get something plausible and wrong. A spec is how you stay in charge of what “right” means, and it is the memory your next AI session starts from.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **spec** (short for specification) is a written description of what your product does, exact enough that someone who was not in your head could build it and then check their work. Think of ordering a cake. “A birthday cake” gets you a cake, probably the wrong one. “Chocolate, 8 inches, “Happy Birthday Ana” in white, ready Saturday at 3 pm” can be built and can be checked. An AI coding tool is like a very fast baker who never asks questions: it will happily guess everything you left out. The spec is where you decide, once and on purpose, what it should not guess.',
      },
      {
        type: 'paragraph',
        text: 'A spec does a second job that matters more with AI than with people. Coding tools start each session with an empty memory. If your decisions live only in a long chat, the next session forgets them. A file in your project (`SPEC.md`) is something every session, and every tool, can read. Claude Code’s own best-practices guide recommends exactly this path: have the AI interview you, write the result to a spec file, then start a fresh session to build from it, so the build begins with a clean context and a written definition of done.',
      },
      { type: 'heading', text: 'What a SaaS spec contains' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Who and the job.** The one kind of user and the one job they hire the product for.',
          '**The core flow.** Three to five short stories: “As a salon owner, I add a booking, and my customer gets a reminder.”',
          '**The data.** The nouns the product stores: shops, members, customers, bookings, reminders.',
          '**The rules.** Plan limits, who may see what, what happens when a payment fails.',
          '**Out of scope.** What you will *not* build in version 1. This list protects you from the AI (and yourself) adding a calendar sync nobody asked for.',
          '**Acceptance criteria.** Checks that can pass or fail. This is the part that makes the rest provable.',
        ],
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'SPEC.md for Paalala (an excerpt; the rest follows the same shape)',
        code: `# Paalala: booking reminders for small shops

## Who and the job
Owners and staff of independent salons and clinics. Job: stop losing income to forgotten appointments.

## Core flow
1. An owner signs up, creates a shop, and invites staff.
2. Staff add a booking: customer name, mobile number or email, start time.
3. The customer gets a reminder 2 hours before the booking, once.
4. The owner sees today's bookings and which reminders were sent.

## Data
shops, shop_members (who belongs to which shop), customers, bookings, reminders.

## Rules
- A person only ever sees their own shop's data.
- Free plan: 20 reminders a month. Studio plan: 500. A shop at its limit sees a message, not an error.
- A failed payment keeps the shop working for 7 days, then drops it to Free.

## Out of scope for version 1
Calendar sync, online booking pages, WhatsApp, multiple branches, mobile app.

## Acceptance criteria
- A booking at 10:00 produces exactly one reminder at 08:00 (within 5 minutes), never two.
- A member of shop A who opens the URL of a shop B booking sees "not found".
- A Free shop that has sent 20 reminders sends no 21st and sees the upgrade message.`,
      },
      { type: 'heading', text: 'From vague to testable' },
      {
        type: 'paragraph',
        text: 'Acceptance criteria are where most first specs fail. “Reminders work well” cannot fail, so it proves nothing. A good criterion names an input and an expected result, so a person (or an automated test) can say pass or fail without arguing.',
      },
      {
        type: 'table',
        headers: ['Vague (cannot fail)', 'Testable (can pass or fail)'],
        rows: [
          ['Reminders are sent on time', 'A booking at 10:00 gets one reminder at 08:00, within 5 minutes'],
          ['Customers’ data is safe', 'A signed-in member of shop A requesting a booking of shop B gets “not found”'],
          ['The free plan is limited', 'After 20 reminders in a calendar month a Free shop cannot send a 21st'],
          ['Sign-up is easy', 'A new owner reaches “add your first booking” in under 3 minutes, with no instructions'],
        ],
      },
      { type: 'heading', text: 'Let the AI interview you' },
      {
        type: 'paragraph',
        text: 'You do not have to write the spec alone. Give the AI your idea sentence and the evidence from lesson 1, and ask it to **ask you questions** until it could write the spec. Answer in your own words; the questions will expose the decisions you had not noticed, such as “what happens to a booking that is cancelled after its reminder was sent?”. Then read the result with a pencil: cut anything you did not choose, and fill in the numbers.',
      },
      {
        type: 'prompt',
        label: 'The interview prompt',
        text: 'I am building Paalala, a subscription tool that sends appointment reminders for small salons and clinics. My notes from five owners are below. Interview me, one short batch of questions at a time (offer choices where you can), until you could write a spec. Cover the user, the core flow, the data, plan limits, what happens when things fail, and what is out of scope for version 1. Then write it to SPEC.md with testable acceptance criteria. Do not write any code yet.\n\n[paste your notes here]',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'From idea to a build you can check. The spec is edited by you, not just generated.',
        source: `flowchart LR
  A[Idea and evidence] --> B[AI interviews you]
  B --> C[SPEC.md drafted]
  C --> D[You cut and correct it]
  D --> E[Fresh AI session builds from SPEC.md]
  E --> F[Check against acceptance criteria]
  F -->|a check fails| E`,
      },
      {
        type: 'paragraph',
        text: '**The instructions file.** Next to `SPEC.md`, keep a short file the AI reads at the start of every session: `CLAUDE.md` for Claude Code, `AGENTS.md` for Codex and some other tools. The spec says *what* to build; the instructions file says *how to work here*: the commands to run the tests, rules that must not be broken, where the spec lives. Keep it short, because every line costs attention on every task. Claude Code’s docs suggest staying under about 200 lines, and treat the file as context the model reads, not as a setting that is enforced.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'CLAUDE.md for Paalala (short on purpose)',
        code: `# Paalala

Read SPEC.md before changing anything. It is the source of truth for what to build.

## Commands
- npm test          run the tests (run them before saying a task is done)
- npm run dev       start the app locally

## Rules
- Every table has row level security on, with a policy. Never use the secret key in browser code.
- Money is stored as whole centavos, never decimals.
- Show me the command you ran and its output as evidence when you finish a task.
- If a requirement is unclear or missing from SPEC.md, ask me. Do not guess.`,
      },
      {
        type: 'version',
        text: 'Claude Code’s best-practices page recommends asking Claude to interview you until it could write the spec, writing it to SPEC.md, and starting a fresh session to build from it; it also says to keep CLAUDE.md short and treats CLAUDE.md as context the model reads rather than enforced configuration (use a hook to block an action for certain), and its memory page suggests staying under 200 lines and running /init for a starting version. Codex reads project instructions from AGENTS.md. Product behaviour and commands such as /init change between releases, so check the pages before relying on them.',
        checked: CHECKED,
        sources: [DOCS.ccBest, DOCS.ccMemory, DOCS.codexAgentsMd],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**What the SPEC.md above is doing.** It is an ordinary text file written in a simple format called Markdown, where a line starting with `#` is a heading and a line starting with `-` is a bullet. Nothing in it is code. Read it like a recipe card: *Who and the job* says who the dish is for, *Core flow* is the steps, *Data* lists the ingredients the app stores (“a booking” is one row of information, like one line in a notebook), *Rules* are the house rules, *Out of scope* is what you will not cook this time, and *Acceptance criteria* is how you taste the result to decide it is right. If you cannot tell whether a sentence could ever be wrong, rewrite it until it could.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the spec as a reviewed artifact, not a prompt. Decide the expensive-to-change things now: the tenancy model (a shop id on every row is far cheaper to start with than to retrofit), the source of truth for plan state (your database, written by verified webhooks), time handling (store UTC, render in the shop’s zone) and data retention. Write non-functional requirements as numbers: reminder latency, message cost per shop, recovery point after a failure. Keep a short decision log for choices an agent might later undo. Convert acceptance criteria into executable tests early, and put the test command in the instructions file so an agent can verify itself. If a rule must hold regardless of what the model decides (never commit secrets, never touch migrations), enforce it with a hook, a permission rule or CI rather than a sentence in the file.',
      },
      {
        type: 'takeaways',
        items: [
          'A spec is a written description of the product exact enough that someone else, or an AI, can build it and check it.',
          'A SaaS spec covers the user and job, the core flow, the data, the rules, what is out of scope and acceptance criteria.',
          'Acceptance criteria must be able to fail: name an input and an expected result.',
          'Let the AI interview you, then cut and correct the result yourself before anything is built.',
          'Keep SPEC.md (what to build) and a short CLAUDE.md or AGENTS.md (how to work here) in the project so every new session starts well-informed.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-02-match-1',
          kind: 'match',
          title: 'Make each sentence testable',
          prompt: 'Each sentence from a first draft of the Paalala spec is too vague to fail. Match it with the rewrite that gives a clear pass or fail.',
          concept: 'acceptance criteria',
          labels: { terms: 'Vague sentence', meanings: 'Testable version' },
          pairs: [
            { term: 'Staff can find a customer quickly.', definition: 'Typing the first 3 letters of a name lists matching customers in under 1 second', note: 'This names an input and a limit you can measure.' },
            { term: 'Other shops cannot see my data.', definition: 'A member of shop A who opens a booking URL of shop B gets “not found”', note: 'This names who, what they do and the exact expected answer.' },
            { term: 'The free plan has a limit.', definition: 'A Free shop that has sent 20 reminders this month sends no 21st and sees an upgrade message', note: 'The number and the behaviour at the limit are both stated.' },
            { term: 'Sign-up is simple.', definition: 'A new owner finishes sign-up with email and one confirmation click, no other form fields', note: 'Counting fields and clicks makes “simple” checkable.' },
          ],
          hints: [
            'A testable sentence contains a number, an input or an exact result.',
            'Match by topic first: find, other shops, limit, sign-up.',
            'The “not found” answer belongs to the data-privacy sentence; the 20 reminders belongs to the limit.',
          ],
          explanation: 'Each testable version gives a person, or a test, something concrete to try and a clear answer to expect. “Quickly”, “cannot see” and “simple” on their own can never be shown wrong.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-02-scenario-1',
          kind: 'scenario',
          title: 'The AI added a calendar sync',
          prompt: 'Choose your response.',
          concept: 'scope control',
          situation: 'You asked an AI agent to build “adding a booking”. It finished, and also added Google Calendar sync, a mobile layout switcher and a dark mode, all untested. Your SPEC.md lists calendar sync and a mobile app as out of scope for version 1.',
          options: [
            { text: 'Point it at SPEC.md, ask it to remove everything outside the spec, and run the acceptance criteria for adding a booking.', consequence: 'You keep the build inside what you decided and prove the real feature with the checks you wrote. Extra features stop piling up.', quality: 'best' },
            { text: 'Keep it all because it is already written and looks impressive.', consequence: 'Untested code now has to be maintained, secured and explained to customers. Every extra feature is more surface for bugs you did not choose.', quality: 'poor' },
            { text: 'Keep the calendar sync but delete the dark mode.', consequence: 'You are making scope decisions case by case again, with no written reason. The sync is still untested and still out of scope.', quality: 'poor' },
            { text: 'Ask the AI which of the extras are best and keep those.', consequence: 'The AI is happy to recommend its own additions. The spec exists so that you decide scope, not the tool.', quality: 'acceptable' },
          ],
          hints: [
            'What document did you write to decide what is in and out?',
            'You want to remove what is out of scope and check what is in scope.',
            'Point the AI at the spec’s out-of-scope list and run the acceptance criteria.',
          ],
          explanation: 'The out-of-scope list exists for exactly this moment. AI tools tend to add extras, so a written scope and written checks keep the product small enough to finish and to trust.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-02-q1',
        prompt: 'Which acceptance criterion is written well?',
        choices: [
          'Reminders should be sent promptly and reliably to every customer who has a booking, in every situation',
          'A booking at 10:00 produces exactly one reminder at 08:00, within 5 minutes',
          'The reminder system works well in most situations on most phones, most of the time, for most owners',
          'Reminders feel natural and are friendly in tone for owners and customers, without sounding like a machine wrote them',
        ],
        answer: 1,
        explanation: 'It names an input (a 10:00 booking) and an exact, checkable result (one reminder at 08:00, within 5 minutes). The others use words like “promptly”, “well” and “natural” that cannot be shown wrong.',
      },
      {
        id: 'build-saas-ai-02-q2',
        prompt: 'Why keep decisions in a SPEC.md file instead of only in the chat with your AI tool?',
        choices: [
          'Chat history is deleted every night by every AI tool, so nothing from yesterday can ever be recovered',
          'A file has no size limit at all, while a chat can only hold about ten messages before it stops working',
          'AI tools refuse to write any code at all unless a file named exactly SPEC.md already exists in the project folder where they are running',
          'Each new session starts with an empty memory, and a file in the project is something every session and every tool can read',
        ],
        answer: 3,
        explanation: 'Coding tools do not remember earlier sessions. A project file is a stable source of truth that any session can read, so decisions survive and the next session starts informed.',
      },
      {
        id: 'build-saas-ai-02-q3',
        prompt: 'What belongs in the “Out of scope for version 1” section?',
        choices: [
          'Things you will not build yet, so neither you nor the AI adds them without deciding to',
          'Bugs the AI found while testing that you have decided to ignore forever because they are too small to matter',
          'Features that customers have already asked for and paid for, which you promised to deliver in the first month',
          'The names of the AI tools and editors that you looked at and then decided not to use for this project',
        ],
        answer: 0,
        explanation: 'The out-of-scope list protects the first version from extra features. It is a decision you wrote down, not a list of bugs or tool names.',
      },
      {
        id: 'build-saas-ai-02-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a “spec”, in everyday words?',
        choices: [
          'A shortcut key in your editor that makes the AI tool write code faster and with fewer mistakes than usual',
          'A written description of what the product should do, exact enough that you can check the result',
          'The password that lets the AI open your project folder and read the files that are inside it',
          'A picture of what the finished app screen looks like, drawn before any of the code is written',
        ],
        answer: 1,
        explanation: 'A spec is a written description precise enough to build from and check against, like a cake order with size, flavour and date instead of just “a cake”.',
      },
      {
        id: 'build-saas-ai-02-q5',
        audience: { min: 'advanced' },
        prompt: 'Your rule “never edit existing database migrations” was ignored by an agent twice despite being in CLAUDE.md. What is the most reliable fix?',
        choices: [
          'Repeat the rule in capital letters at the top of the file and again at the bottom, and add the word “never” three times',
          'Move the whole spec into CLAUDE.md, so that the agent sees every rule and every requirement together on every single task',
          'Ask the agent to repeat the rules back to you and promise to follow them at the start of each new session before it does any work at all',
          'Enforce it outside the model: a hook or permission rule that blocks edits to the migrations folder, plus a CI check that fails the build',
        ],
        answer: 3,
        explanation: 'The instructions file is context the model reads, not enforced configuration. A rule that must never be broken belongs in something the tooling or CI enforces. Longer files and louder wording make adherence worse, not better.',
      },
    ],
    task: {
      title: 'Have an AI interview you into a spec',
      steps: [
        'Open your AI tool (Claude Code, Cursor, Codex or a chat assistant) and paste the interview prompt with your own idea sentence and notes.',
        'Answer its questions in your own words. When it writes SPEC.md, read it with a pencil and cut anything you did not choose.',
        'Rewrite at least three sentences until each one could be shown wrong, and write three acceptance criteria for your core flow.',
        'Create a CLAUDE.md or AGENTS.md of 8 to 12 lines: where the spec is, how to run the tests, and two rules that matter.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain each section of my SPEC.md in plain words and tell me one thing I should double-check with a real owner.” Fix the spec where its explanation shows something was unclear.'] },
      { audience: { min: 'advanced' }, steps: ['Turn two acceptance criteria into failing automated tests before any feature code exists. Add the test command to the instructions file, and write which of your rules is enforced by a hook or CI and which is only requested.'] },
    ],
  },
  {
    id: 'build-saas-ai-03',
    day: 3,
    title: 'Build the landing page and waitlist',
    summary: 'A one-page promise and a safe sign-up list let you collect real interest before the product exists, without exposing anyone’s email.',
    minutes: 25,
    skills: ['landing-waitlist'],
    intro: {
      objectives: [
        'Describe the parts of a landing page that earn a sign-up, and keep invented proof off it',
        'Store waitlist emails so visitors can add themselves but nobody can read the list from the browser',
        'Measure visits against sign-ups and read the result honestly',
      ],
      why: 'A landing page is the cheapest test of your promise, and a waitlist is the first list of people you can build for and talk to. Get the storage wrong and you leak the list; get the promise wrong and nobody signs up.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **landing page** is a single page whose only job is to make one visitor take one action: here, leave their email. A **waitlist** is the list those emails go into. Together they answer a question lesson 1 could not: will strangers, not friends, raise their hand? You can ask an AI to build the page in an hour, and the course Build a Website with AI covers building pages in depth. This lesson is about what a SaaS page needs that a normal page does not: a promise tied to your validated problem, an honest page, and a safe place for the emails.',
      },
      { type: 'heading', text: 'What the page must say' },
      {
        type: 'list',
        items: [
          '**A headline that states the result.** “Stop losing income to forgotten appointments.” Not “Welcome to Paalala”.',
          '**A line saying who it is for and how.** “Automatic reminders for independent salons and clinics, sent to your customers 2 hours before.”',
          '**One button.** “Join the waitlist”. Two competing buttons split attention.',
          '**Three benefits and a three-step “how it works”.** Short, in the owner’s words from your interviews.',
          '**Real proof only.** A quote from one of your five owners (with permission) beats nothing. Invented proof is worse than none.',
          '**A privacy link and a plain line about what you will send** (“We will email you about Paalala only.”).',
        ],
      },
      {
        type: 'warning',
        text: 'AI page generators love to invent proof: “Trusted by 2,000 salons”, five-star reviews, logos of companies that never heard of you. Remove all of it. It is untrue, it can break advertising rules where you live, and it destroys trust the first time someone checks.',
      },
      {
        type: 'prompt',
        label: 'A landing page prompt that keeps it honest',
        text: 'Build a one-page landing page for Paalala using the plain HTML, CSS and a small script (no framework). Sections: headline "Stop losing income to forgotten appointments", a sub-line for independent salon and clinic owners, one email field with a "Join the waitlist" button, three benefits, a 3-step how it works, a short FAQ, and a footer with a privacy link. Do not invent any numbers, customer counts, testimonials or logos: leave a clearly marked TODO where real proof will go. Make it work on a phone. Do not connect a database yet; make the form call a function named submitEmail(email) that I will write.',
      },
      { type: 'heading', text: 'Storing emails safely' },
      {
        type: 'paragraph',
        text: 'The email list is personal data, so the rule is simple: **visitors may add themselves; nobody may read the list from the browser.** In a database such as PostgreSQL (which Supabase provides) a **table** is like a spreadsheet: each column is a kind of information and each row is one entry. **Row level security** (RLS) is a switch that makes the database itself check, row by row, who may do what. Below is the waitlist table we ran against a real PostgreSQL. A role named `anon` stands for “a visitor who is not signed in”.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'waitlist.sql (run against PostgreSQL 14)',
        code: `create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null check (position('@' in email) > 1 and length(email) <= 254),
  shop_type text,
  created_at timestamptz not null default now()
);
create unique index waitlist_email_key on waitlist (lower(email));

alter table waitlist enable row level security;
revoke all on waitlist from anon;
grant insert on waitlist to anon;
create policy "Anyone can join the waitlist"
  on waitlist for insert to anon with check (true);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'What happened when we played the part of a visitor (real psql output)',
        code: `--- anon joins ---                      (worked, no output)
--- anon tries to read the list ---
ERROR:  permission denied for table waitlist
--- anon sends a bad email ---
ERROR:  new row ... violates check constraint "waitlist_email_check"
--- same email in capitals ---
ERROR:  duplicate key value violates unique constraint "waitlist_email_key"
 rows_stored
-------------
           1`,
      },
      {
        type: 'paragraph',
        text: 'Read it as a story. The visitor could add an email. The visitor could **not** read the list, because they were given only the right to insert. A bad email and a repeat were refused *by the database itself*, so even a buggy page or a script that skips the page cannot put junk in. That last point is why checks belong in the database as well as in the page: anyone can bypass your page and talk to the database directly.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The waitlist path. The visitor’s role (anon) can add a row but has no permission to read the list.',
        source: `sequenceDiagram
  participant V as Visitor
  participant P as Landing page
  participant D as Database
  V->>P: types email, presses Join
  P->>D: insert email (as anon)
  D-->>P: ok, or refused (bad email, duplicate)
  P-->>V: "You are on the list"`,
      },
      { type: 'heading', text: 'Measure honestly' },
      {
        type: 'paragraph',
        text: 'Count two numbers: **visitors** and **sign-ups**. Sign-ups divided by visitors is your **conversion rate**. The number alone does not tell you much; what matters is comparing: send the same kind of visitor (for example owners you reached by message) to the page, change one thing, and see whether the rate moves. Visitors who came from your own friends will convert unrealistically well, so note where visitors came from. Then do the stronger step from lesson 1: email the first sign-ups and ask for a ten-minute call. A sign-up who will also talk to you is worth ten who will not.',
      },
      {
        type: 'version',
        text: 'Supabase’s API-keys page says a publishable key (sb_publishable_...) is low-privilege and may ship in public code, where Postgres maps it to the anon role when nobody is signed in, and that row level security policies control what it can reach; a secret key (sb_secret_...) maps to service_role, which bypasses row level security and must stay on a server you control. Its RLS guide says to enable row level security on every table in an exposed schema, and that with it enabled and no policies, no data is reachable through the API with a publishable key. Legacy anon and service_role keys still work until you switch them off, and Supabase says it plans to deprecate them by the end of 2026. Key names and defaults can change, so check the pages when you set up a project.',
        checked: CHECKED,
        sources: [DOCS.supabaseKeys, DOCS.supabaseRls],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**What the SQL above is doing.** `create table waitlist (...)` makes a new spreadsheet with four columns: an id, the email, an optional shop type and the time. `check (...)` is a rule the database enforces: an email must contain an `@`. The `unique index ... lower(email)` means the same email cannot be saved twice, even in capital letters. `enable row level security` turns on the guard. `revoke all ... from anon` takes away every permission a visitor has, and `grant insert` gives back just one: adding a row. Finally the `policy` says that insert is allowed. Notice what is missing: nobody was given permission to *read*, so the list cannot be seen from a web page.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** A direct-to-database insert from the browser is fine for a waitlist but gives you no rate limiting, so a script can fill the table; put an edge or server route in front when abuse appears, with per-IP limits and a hidden honeypot field, and prefer that route to a CAPTCHA until you have evidence you need one. Return the same response for a new and a duplicate address so the form cannot be used to test whether someone is on the list. Record when and under which wording consent was given (a text version id), send a confirmation email (double opt-in) before marketing mail, and keep the list out of analytics tools. Email deliverability starts here: you will send from your own domain, so plan SPF, DKIM and DMARC records before the first message.',
      },
      {
        type: 'takeaways',
        items: [
          'A landing page has one job: one promise, one button, honest proof, and a plain note about what you will send.',
          'Never keep invented customer counts, testimonials or logos that an AI generated; leave a marked gap instead.',
          'Visitors may insert into the waitlist but never read it: grant insert only, and enable row level security.',
          'Put validation and uniqueness in the database too, because anyone can bypass your page.',
          'Visitors divided by sign-ups is only useful when you compare like with like, and a sign-up who agrees to a call is worth the most.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-03-fix-bug-1',
          kind: 'fix-bug',
          title: 'Capitals made a duplicate',
          prompt: 'Rosa signed up as ROSA@Example.com and again as rosa@example.com, and the list counted two people. Tap the line that should also make the email lowercase, then choose the fix.',
          concept: 'normalising input',
          language: 'javascript',
          code: `function normalizeEmail(email) {
  return email.trim();
}`,
          bugLine: 2,
          fixes: [
            { line: '  return email.trim().toLowerCase();', correct: true, why: 'trim removes the spaces around the address and toLowerCase makes capitals match, so ROSA@Example.com and rosa@example.com become the same text.' },
            { line: '  return email.toLowerCase();', correct: false, why: 'This fixes the capitals but forgets the spaces: “ rosa@example.com ” would still differ from “rosa@example.com”.' },
            { line: '  return email.trim().toUpperCase();', correct: false, why: 'Upper case makes the capitals match too, but the lesson’s rule (and the database index) use lower case, and the test expects lower case text.' },
            { line: '  return email.trim().slice(0, 254);', correct: false, why: 'Cutting at 254 characters limits length, but it does nothing about capitals.' },
          ],
          tests: {
            kind: 'function',
            fn: 'normalizeEmail',
            cases: [
              { args: ['ROSA@Example.com'], expected: 'rosa@example.com' },
              { args: ['  rosa@example.com '], expected: 'rosa@example.com' },
              { args: [' Ben@Shop.PH'], expected: 'ben@shop.ph' },
            ],
          },
          hints: [
            'The function should give the same text for the same address whatever the capitals or spaces.',
            'You need one more call chained after trim().',
            'toLowerCase() turns every letter into a lower-case letter.',
          ],
          explanation: 'Email addresses should be normalised once, in one place, before they are stored or compared. The database index on lower(email) is the safety net, and normalising on the way in keeps the data tidy.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-03-scenario-1',
          kind: 'scenario',
          title: 'The generated page claims 2,000 salons',
          prompt: 'Choose the best response.',
          concept: 'honest landing pages',
          situation: 'Your AI tool produced a lovely Paalala landing page. Under the headline it says “Trusted by 2,000+ salons across the Philippines” with five logos and three glowing reviews. You have no customers yet.',
          options: [
            { text: 'Delete the claim, the logos and the reviews, and put a marked TODO for real proof. Replace it later with a short quote from one of your five interviewed owners, with their permission.', consequence: 'The page is true. When real proof exists it will be believable, because nothing on the page has ever been invented.', quality: 'best' },
            { text: 'Keep it for now and replace it once you have real customers.', consequence: 'Every visitor in between is being misled, and a screenshot of the false claim can outlive the fix. It also risks breaking advertising rules.', quality: 'poor' },
            { text: 'Change “2,000+” to “hundreds of” so it sounds more modest.', consequence: 'It is still invented, only vaguer. Honesty does not come in sizes.', quality: 'poor' },
            { text: 'Keep the reviews but remove the customer count.', consequence: 'The reviews are the more serious problem: they are made-up statements attributed to people who do not exist.', quality: 'acceptable' },
          ],
          hints: [
            'Which parts of the page describe real events?',
            'You have no customers, so none of the proof is real yet.',
            'Remove the claims and leave a visible TODO until you have real proof.',
          ],
          explanation: 'Generated pages invent social proof because their training examples have it. You are responsible for what your page claims, so remove anything untrue and earn the real thing.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-03-q1',
        prompt: 'A visitor presses “Join the waitlist”. Which database setting is right for the waitlist table?',
        choices: [
          'Let visitors read and insert, so the page can show how many people have joined',
          'Let visitors insert only, and give them no permission to read the list',
          'Let visitors do nothing: all inserts must be made by the owner by hand',
          'Turn row level security off, because a waitlist is public information',
        ],
        answer: 1,
        explanation: 'Emails are personal data. Granting insert only lets people add themselves while the list stays unreadable from the browser. Letting visitors read it would leak every email.',
      },
      {
        id: 'build-saas-ai-03-q2',
        prompt: 'Why should the email check and the “no duplicates” rule also live in the database, not only in the page?',
        choices: [
          'Browsers cannot check email addresses at all, so every address has to be checked somewhere else first',
          'The database is simply faster at checking text than a browser is, especially when many people join the waitlist at the same moment',
          'Page checks make the form slower for visitors who are on a poor mobile connection or an older phone',
          'Anyone can skip your page and send data straight to the database, so the database must refuse bad data itself',
        ],
        answer: 3,
        explanation: 'The page is only one way in. A script can bypass it, so rules that must always hold belong where the data is stored.',
      },
      {
        id: 'build-saas-ai-03-q3',
        prompt: 'Your page gets 400 visitors and 40 sign-ups, but 300 of those visitors were your own friends. What is the right reading?',
        choices: [
          'A 10% conversion rate proves that strangers want the product, so you can start building features immediately now and stop talking to owners',
          'The friends’ visits probably inflate the rate, so note where visitors came from and test with people who match your target owner',
          'The page is a failure because only 40 of the 400 visitors signed up, so it should be thrown away and rewritten',
          'Conversion rate is a measure for shops that sell physical products and cannot be used for a subscription product at all',
        ],
        answer: 1,
        explanation: 'Friends convert better than strangers. A rate is only meaningful for the kind of visitor you want, so separate them and compare like with like.',
      },
      {
        id: 'build-saas-ai-03-q4',
        audience: { max: 'beginner' },
        prompt: 'In the waitlist SQL, what does “revoke all on waitlist from anon, then grant insert” achieve?',
        choices: [
          'A visitor can add a row but cannot see the rows already there',
          'A visitor can see every row in the table but is not allowed to add any new ones',
          'Only the owner’s own browser can add rows, because it is the only one that knows the key',
          'The table is deleted and rebuilt every time a visitor presses the join button on the page',
        ],
        answer: 0,
        explanation: 'Revoke takes away all of the visitor’s permissions, and grant insert gives back only the right to add a row. Nothing lets them read.',
      },
      {
        id: 'build-saas-ai-03-q5',
        audience: { min: 'advanced' },
        prompt: 'A script is filling your waitlist with thousands of fake addresses through the open insert. What is the proportionate first response?',
        choices: [
          'Remove the insert permission entirely so that nobody at all can join the waitlist until the attack has completely ended and the fake rows are cleaned',
          'Put the sign-up behind a server route with per-IP rate limits and a honeypot field, and keep the database checks as the safety net',
          'Add a CAPTCHA to every form on every page of the site, including pages whose forms do not collect anything of value',
          'Switch off row level security on the table so that inserts are checked less strictly and therefore run a little faster',
        ],
        answer: 1,
        explanation: 'A route you control lets you rate-limit and filter, while the database constraints still stop malformed data. Removing the permission stops real visitors too, and turning off RLS removes protection.',
      },
    ],
    task: {
      title: 'Ship a landing page and an insert-only waitlist',
      steps: [
        'Ask an AI tool to build your one-page landing page with the honest-proof prompt. Remove any invented number, logo or review it adds.',
        'Create a free Supabase project (or a local PostgreSQL), create the waitlist table and policy from this lesson and connect the form with the publishable key only.',
        'Test as a visitor: join once, try a bad email, try the same email in capitals, and confirm you cannot read the list from the browser. Write down each result.',
        'Count visitors and sign-ups for three days and note where each visitor came from.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Walk me through my waitlist SQL one line at a time as if I have never seen a database.” Then change the shop_type column name and ask what else would need to change.'] },
      { audience: { min: 'advanced' }, steps: ['Put the insert behind a server route with a per-IP rate limit and a honeypot, return the same response for new and duplicate emails, and add a test that posts 30 requests in a minute and checks the limit holds.'] },
    ],
  },
  {
    id: 'build-saas-ai-04',
    day: 4,
    title: 'Accounts and sign-in',
    summary: 'Let people create accounts with a trusted service, keep the right key in the right place, and make the server verify who is asking.',
    minutes: 25,
    skills: ['auth-accounts'],
    intro: {
      objectives: [
        'Explain the difference between authentication (who you are) and authorization (what you may do)',
        'Say which key may live in browser code and which must stay on a server',
        'Direct an AI tool to add sign-in and check that the server verifies the session instead of trusting it',
      ],
      why: 'Accounts are where customers hand you their trust. Most SaaS break-ins are not clever: a secret key in the wrong file, or a server that believes whatever the browser says. You can prevent both with a few clear rules.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Two words are often mixed up. **Authentication** answers “who are you?”: the person proves they are Rosa, for example by clicking a link sent to her email. **Authorization** answers “what are you allowed to do?”: Rosa may see her own salon’s bookings but not the barbershop next door’s. Think of a bank. Showing your ID at the counter is authentication; the teller then deciding which accounts you may open is authorization. A SaaS needs both, and they fail in different ways: bad authentication lets the wrong person in, bad authorization lets the right person see the wrong things.',
      },
      {
        type: 'paragraph',
        text: 'Do not write sign-in yourself. Passwords, reset emails, email verification, session expiry and brute-force protection are each easy to get subtly wrong, and an AI will happily generate a version that *looks* fine. Use an authentication service (Supabase Auth, which this course uses, is one; others exist) and spend your effort on connecting it correctly and checking that it works. Your job becomes configuring, directing and verifying, not inventing.',
      },
      { type: 'heading', text: 'What happens when someone signs in' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Sign-in with an emailed link. The “session” is a signed token the browser keeps and sends back with each request.',
        source: `sequenceDiagram
  participant U as Rosa
  participant B as Browser
  participant A as Auth service
  participant S as Your server
  U->>B: enters email
  B->>A: ask for a sign-in link
  A-->>U: email with a one-time link
  U->>A: clicks the link
  A-->>B: session (a signed token) stored in a cookie
  B->>S: request, with the cookie
  S->>S: verify the token signature, read who it is
  S-->>B: Rosa's data only`,
      },
      {
        type: 'paragraph',
        text: 'A **session** is the proof, kept in your browser, that you already signed in. It is usually a **token**: a short piece of text signed by the auth service so that nobody can change it without breaking the signature. A **cookie** is a small value the browser stores for a website and sends back on every request, like a wristband you show at each door of a concert after the first check. Common sign-in methods are an email and password, a **magic link** or one-time code sent by email, “Sign in with Google” style buttons, and a code sent by text message. For a small SaaS an emailed link or code removes the burden of storing passwords and handling resets, but it makes your email delivery part of sign-in (lesson 8).',
      },
      { type: 'heading', text: 'Two keys, two very different jobs' },
      {
        type: 'paragraph',
        text: 'Your database service gives you two kinds of key. The **publishable key** is low-privilege and is designed to ship inside web pages and apps: what it can reach is limited by the row level security rules from lesson 3. The **secret key** is the master key: it skips those rules entirely. It belongs only on a server you control. If it appears in browser code, in a public repository, in a screenshot or in a chat with an AI, anyone who finds it can read and change every customer’s data.',
      },
      {
        type: 'code',
        language: 'bash',
        label: '.env.local (never committed to Git; add it to .gitignore). The names are examples: your framework or AI tool may pick others.',
        code: `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx   # fine in the browser
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxx                          # server only: no NEXT_PUBLIC_ prefix`,
      },
      {
        type: 'warning',
        text: 'In many frameworks a variable whose name starts with NEXT_PUBLIC_ is copied into the code sent to every visitor’s browser. Never put a secret behind that prefix. AI tools sometimes switch the browser to the secret key to make a “permission denied” error vanish. That is not a fix, it is a hole: the correct fix is a proper row level security policy.',
      },
      { type: 'heading', text: 'Verify on the server, do not just read' },
      {
        type: 'paragraph',
        text: 'The browser sends a cookie, and anyone can edit the cookies in their own browser. So the server must **verify** the token’s signature before believing who it is, not merely read a user id out of it. Supabase’s documentation says plainly: never trust the session read straight from the cookie in server code (`getSession()`) to decide who the user is, and use a method that verifies it (`getClaims()`) instead. The general rule applies to any provider: **verify, then trust**.',
      },
      {
        type: 'paragraph',
        text: '**Where do roles live?** Some auth services let a user edit part of their own profile data. Supabase’s documentation warns that `user_metadata` can be changed by the user, so it must never hold anything that grants power such as “is admin”. `app_metadata` cannot be changed by the user and is the place for authorization data, or a database table that ordinary users cannot write to.',
      },
      {
        type: 'prompt',
        label: 'A sign-in prompt with the rules built in',
        text: 'Add email magic-link sign-in to my app using Supabase Auth. Rules: the browser uses only the publishable key; no secret key anywhere in client code; server code decides who the user is by verifying the session (getClaims), never by reading the cookie with getSession; add sign out; show a clear message after the email is sent; protect the /app pages so a signed-out visitor is redirected to /login. Add one test: a signed-out request to /app redirects to /login. Then list every environment variable you used and say which are public and which are secret.',
      },
      {
        type: 'version',
        text: 'Supabase Auth supports password sign-in, magic links and one-time email codes, social OAuth providers, phone sign-in and enterprise SAML. Its server-side guide says to use getClaims() to protect pages and data (it verifies a JWT locally against cached public keys for projects with asymmetric keys, the default for new projects), and never to trust getSession() in server code. It also warns that if a CDN or cache stores a response that contains a refreshed session cookie, another visitor may receive that session. Its RLS page says user_metadata can be changed by the user while app_metadata cannot, and its API-keys page says secret keys must never be put in browsers, public code or chat. Key formats and method names have changed before, and Supabase plans to deprecate its legacy keys by the end of 2026, so check these pages when you set up.',
        checked: CHECKED,
        sources: [DOCS.supabaseAuth, DOCS.supabaseServerAuth, DOCS.supabaseKeys, DOCS.supabaseRls],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Picture a concert. At the gate you show your ticket once and get a wristband: that is signing in. Inside, staff glance at your wristband at every door instead of asking for the ticket again: that is the session cookie. A forged wristband is the danger, so security checks that the wristband has the real stamp: that is the server *verifying* the token. The two keys are like a house key and a master key. The publishable key opens only the front door that you set up to be public. The secret key opens every door, so it stays in the manager’s office (a server) and is never copied onto a poster (a web page). The `.env.local` file above is a plain list of settings; it has one line for each, and the `#` starts a note.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Verify tokens on the server on every request that matters, and remember that claims in a JWT can be stale until it refreshes: do not put permissions in claims that change often, or re-check them against the database. Refresh tokens are single-use in most setups, so refreshing from several places without coordination can revoke a session and look like random sign-outs; refresh in one place (middleware or a proxy). Never let a shared cache store a response that sets a cookie. Rate-limit sign-in and email endpoints, return the same message whether or not an account exists, require re-authentication for sensitive actions such as changing the billing email, and offer multi-factor sign-in before you store anything sensitive. Treat every call with the secret key as code that must do its own authorization, and keep that code in as few places as you can.',
      },
      {
        type: 'takeaways',
        items: [
          'Authentication proves who someone is; authorization decides what they may do. A SaaS needs both.',
          'Use a trusted authentication service instead of writing sign-in yourself, and direct your AI tool to connect it correctly.',
          'The publishable key may be in browser code because row level security limits it; the secret key bypasses those rules and lives only on a server.',
          'The server must verify the session’s signature before trusting who it is, never just read a cookie.',
          'Keep roles in data the user cannot edit (app_metadata or a protected table), never in user_metadata.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'Anyone could make themselves an admin',
          prompt: 'This check decides whether to show the admin page. A user can edit their own `user_metadata`, so anyone could write `role: "admin"` into it. Tap the line that trusts the wrong field, then choose the fix.',
          concept: 'authorization data',
          language: 'javascript',
          code: `function isAdmin(user) {
  return user.user_metadata.role === 'admin';
}`,
          bugLine: 2,
          fixes: [
            { line: '  return user.app_metadata.role === \'admin\';', correct: true, why: 'app_metadata cannot be changed by the user, so only a role you set on the server counts.' },
            { line: '  return user.user_metadata.role === \'admin\' || user.app_metadata.role === \'admin\';', correct: false, why: 'The “or” still lets a user who edited their own user_metadata through, which is the bug.' },
            { line: '  return user.user_metadata.role === \'admin\' && user.app_metadata.role === \'admin\';', correct: false, why: 'This is safer than before, but a real admin whose user_metadata has no role is now refused, so the check is wrong the other way.' },
            { line: '  return Boolean(user.user_metadata.role);', correct: false, why: 'This treats any value in a field the user controls as proof, which is worse than before.' },
          ],
          tests: {
            kind: 'function',
            fn: 'isAdmin',
            cases: [
              { args: [{ user_metadata: { role: 'admin' }, app_metadata: { role: 'user' } }], expected: false, label: 'user edited their own metadata' },
              { args: [{ user_metadata: {}, app_metadata: { role: 'admin' } }], expected: true, label: 'real admin set on the server' },
              { args: [{ user_metadata: {}, app_metadata: {} }], expected: false, label: 'ordinary user' },
            ],
          },
          hints: [
            'One of the two metadata fields can be changed by the person signing in.',
            'Authorization data must come from the field the user cannot edit.',
            'Use app_metadata.role instead of user_metadata.role.',
          ],
          explanation: 'Never base a power on data the user can write. Put roles where only your server can set them, and read them from there.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-04-scenario-1',
          kind: 'scenario',
          title: 'The AI switched to the secret key',
          prompt: 'Choose how to respond.',
          concept: 'secret keys',
          situation: 'The browser shows “permission denied” when loading bookings. Your AI agent “fixed” it by switching the browser client to the secret key. The page now loads every booking. The change is already committed and pushed to a public repository.',
          options: [
            { text: 'Revert the change, treat the secret key as exposed and rotate it, then fix the real cause by adding a row level security policy that lets members read their own shop’s bookings.', consequence: 'The hole is closed, the leaked key stops working, and the page works for the right reason: each person sees only their shop’s rows.', quality: 'best' },
            { text: 'Leave it for now because the page works, and plan to clean it up before launch.', consequence: 'Anyone who opens the page source or the repository history has a key that reads and changes every customer’s data. Waiting increases the risk.', quality: 'poor' },
            { text: 'Revert the change and keep the same key, since it was only public for a short time.', consequence: 'Anyone who copied it in that time still has it, and bots scan public repositories within minutes. A key that was exposed must be replaced.', quality: 'acceptable' },
            { text: 'Keep the secret key but rename the variable so it is harder to spot.', consequence: 'Hiding the name does nothing: the value is still sent to every visitor and still bypasses every rule.', quality: 'poor' },
          ],
          hints: [
            'What can someone do with a key that skips every policy?',
            'A key that has been public cannot be made private again.',
            'Revert, rotate the key, and add the missing policy.',
          ],
          explanation: '“Permission denied” was the system working: no policy allowed the read. The fix is to add the policy, not to remove the guard. An exposed secret must be rotated because you cannot know who copied it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-04-match-1',
          kind: 'match',
          title: 'Authentication or authorization?',
          prompt: 'Match each moment in Paalala with the idea it shows.',
          concept: 'authentication vs authorization',
          labels: { terms: 'What happens', meanings: 'The idea' },
          pairs: [
            { term: 'Rosa clicks the emailed link and the app recognises her.', definition: 'Authentication: proving who she is', note: 'Recognising Rosa is the “who are you” question.' },
            { term: 'A staff member sees today’s bookings but not the billing page.', definition: 'Authorization: deciding what a known person may do', note: 'The person is already known; the question is what they may open.' },
            { term: 'The server checks the token’s signature before reading the user id.', definition: 'Verifying a session instead of trusting it', note: 'A signature check proves the token was not edited.' },
            { term: 'The secret key is kept only in the server’s settings.', definition: 'Separating a master key from the browser', note: 'The browser may only get the low-privilege key.' },
          ],
          hints: [
            'Ask whether the moment is about who someone is, or about what they may do.',
            'The signature check is about not believing something just because it was said.',
            'Link the emailed link to proving identity and the billing page to permissions.',
          ],
          explanation: 'Each moment is a different safeguard: knowing who, limiting what, checking the proof, and keeping the master key away from visitors.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-04-q1',
        prompt: 'Which key may appear in code that is sent to every visitor’s browser?',
        choices: [
          'The secret key, because the browser needs full access to load pages quickly',
          'Either key, as long as the website is served over HTTPS',
          'The publishable key, because row level security controls what it can reach',
          'Neither key: the browser must always ask your server for every piece of data',
        ],
        answer: 2,
        explanation: 'The publishable key is low-privilege by design and is limited by your row level security rules. The secret key bypasses those rules, and HTTPS only protects the connection, not the key’s power.',
      },
      {
        id: 'build-saas-ai-04-q2',
        prompt: 'The server receives a request with a session cookie. What should it do before showing private data?',
        choices: [
          'Verify the token’s signature with the auth library, then use the verified user id',
          'Read the user id straight from the cookie, since only the real user could ever have such a cookie',
          'Check that a cookie exists and then ask the browser which role the user has',
          'Accept the request if the cookie was set within the last hour by any website',
        ],
        answer: 0,
        explanation: 'A browser’s cookies can be edited by the person using it. Verifying the signature proves the token came from the auth service and was not changed.',
      },
      {
        id: 'build-saas-ai-04-q3',
        prompt: 'Where should the flag “this user is an admin” be stored?',
        choices: [
          'In user_metadata, because it is sent with every sign-in',
          'In a cookie named role that the server reads on each page',
          'In the browser’s local storage, so the page can hide the admin menu quickly',
          'In app_metadata, or a database table that ordinary users cannot write to',
        ],
        answer: 3,
        explanation: 'Anything the user can edit can be edited to say “admin”. Authorization data must live where only your server can change it.',
      },
      {
        id: 'build-saas-ai-04-q4',
        audience: { max: 'beginner' },
        prompt: 'Which sentence is about authorization, not authentication?',
        choices: [
          'Maria types her email address and receives a link by email that she can use to sign in.',
          'A staff member can open the bookings page but the billing page says “not allowed”.',
          'The server checks that the sign-in token has not been altered.',
          'Rosa chooses a password with at least ten characters.',
        ],
        answer: 1,
        explanation: 'Authorization is about what a known person may do. The other sentences are about proving or protecting who someone is.',
      },
      {
        id: 'build-saas-ai-04-q5',
        audience: { min: 'advanced' },
        prompt: 'After a deploy, two customers report briefly seeing each other’s accounts. The deploy added edge caching to the app’s pages. What is the most likely cause and fix?',
        choices: [
          'The database ran out of connections during the busy hour, so you should raise the connection limit and add a connection pool',
          'The password hashing is too slow for the number of sign-ins, so you should switch to a faster algorithm everywhere',
          'Responses that set or refresh the session cookie were cached and served to other visitors, so mark them uncacheable and purge the cache',
          'The auth service’s signing key was rotated during the deploy, so you should rotate it back to the old one',
        ],
        answer: 2,
        explanation: 'A shared cache must never store a response that carries a session cookie, or the next visitor can receive someone else’s session. Apply the cache headers your auth library provides and purge what was cached.',
      },
    ],
    task: {
      title: 'Add sign-in and prove the server does not trust the browser',
      steps: [
        'Use your AI tool with the sign-in prompt to add email magic-link sign-in to your app. Put the keys in .env.local and confirm .env.local is listed in .gitignore.',
        'Search your whole project (including the browser code) for your secret key’s first characters and for NEXT_PUBLIC_ next to anything secret. There should be no match.',
        'Sign in, then in your browser’s developer tools edit the session cookie so it is invalid. Reload a protected page: you should be treated as signed out.',
        'Write down which environment variables are public and which are secret.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain the sign-in diagram from this lesson using my app’s real file names, in plain words.” Check that its explanation matches what the diagram shows.'] },
      { audience: { min: 'advanced' }, steps: ['Add a test that a request with a tampered token is rejected, and a test that a response which sets a session cookie carries no-store cache headers. Rate-limit the sign-in endpoint and show the test.'] },
    ],
  },
  {
    id: 'build-saas-ai-05',
    day: 5,
    title: 'Build the core feature',
    summary: 'Build the one thing customers pay for in thin slices, put the key rule in a small tested function, and make the reminder job safe to run twice.',
    minutes: 28,
    skills: ['core-feature'],
    intro: {
      objectives: [
        'Build a feature in thin, finished slices instead of all at once, directing an AI tool one slice at a time',
        'Write the central business rule as a small function with tests, and run those tests',
        'Explain why a scheduled job must be safe to run twice, and how to make it so',
      ],
      why: 'The core feature is the reason anyone pays. Built carelessly, it fails in the quiet ways a SaaS cannot afford: reminders at the wrong hour, or sent twice. Slices, tests and one safety habit prevent both.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Your **core feature** is the one thing customers pay you for. For Paalala it is: *add a booking, and the customer gets exactly one reminder at the right time*. Everything else (the dashboard, the settings, the pretty emails) supports that sentence. Many SaaS products fail not because they could not be built but because the one thing they promised did not quite work. So we build the core feature deliberately, in slices, and we prove it with tests.',
      },
      { type: 'heading', text: 'Build in slices, not layers' },
      {
        type: 'paragraph',
        text: 'An AI agent can generate a whole system in one go, and you will not be able to review it. Ask instead for **thin vertical slices**: each slice is small but goes all the way through, from the screen to the database and back, and works when it is finished. For Paalala the order is: (1) a form that saves a booking; (2) a list of today’s bookings; (3) the rule that decides which bookings are due a reminder; (4) a scheduled job that sends them; (5) marking a reminder as sent so it never repeats. After each slice you run the app, read the change the AI made, run the tests and make a commit. That commit is your restore point if the next slice goes wrong.',
      },
      {
        type: 'prompt',
        label: 'A one-slice prompt',
        text: 'Read SPEC.md and CLAUDE.md first. Slice 2 only: add a "Today" page for signed-in members that lists their shop\'s bookings for today (customer name, start time, whether a reminder was sent), ordered by start time. Do not touch anything else. Show me the files you changed, run the tests, and tell me what you did NOT verify. Do not add features that are not in SPEC.md.',
      },
      { type: 'heading', text: 'Put the rule in a small function with tests' },
      {
        type: 'paragraph',
        text: 'The rule “which bookings are due a reminder?” is the heart of Paalala, and it is easy to get subtly wrong. Do not bury it inside a web page. Ask the AI to write it as a small **function**: a named piece of code that takes inputs and gives back a result, with no database or network inside it. Such a function is easy to test. Below is the rule we wrote and ran. A booking is due when it has not been reminded, starts in the future, and starts within the lead time (here, 2 hours).',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'reminders.mjs',
        code: `const MINUTE = 60_000;

export function dueReminders(bookings, nowMs, leadMinutes) {
  return bookings.filter(
    (booking) =>
      booking.reminderSentAt === null &&
      booking.startsAt > nowMs &&
      booking.startsAt - nowMs <= leadMinutes * MINUTE,
  );
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of: node --test reminders.test.mjs (trimmed)',
        code: `ok 1 - sends only for bookings inside the lead time that were not reminded
ok 2 - a longer lead time picks up more bookings
ok 3 - never reminds twice: a second run after marking finds nothing
1..3`,
      },
      {
        type: 'paragraph',
        text: 'A **test** is a small program that runs your code with known inputs and checks the answer. The three tests above are the acceptance criteria from your spec turned into something a machine can run in a second. This is how you stop trusting the AI’s “it works” and start trusting evidence. Ask your AI tool to write the tests first, watch them fail, then let it write the code that makes them pass.',
      },
      { type: 'heading', text: 'Time, and running twice' },
      {
        type: 'paragraph',
        text: '**Time.** Store every time in UTC (the world’s reference time) and show it in the shop’s own time zone. Manila is eight hours ahead of UTC, so a 10:00 AM booking is stored as 02:00 UTC. A scheduled job is a program your hosting runs at fixed times, such as every five minutes; on Vercel the schedule’s timezone is always UTC. Forgetting this is how a reminder meant for 8 AM goes out at 4 PM.',
      },
      {
        type: 'paragraph',
        text: '**Running twice.** Scheduled jobs can run late, overlap, or be delivered twice, and a server can crash halfway through. If the job simply loops and sends, a customer may get two texts. The fix is to **claim** each booking atomically before sending: change `reminder_sent_at` only where it is still empty, and send only if you won the claim. We ran this against a real PostgreSQL:',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'The claim: only one worker can win (fragment: the bookings table already exists)',
        code: `update bookings
   set reminder_sent_at = now()
 where id = 'a' and reminder_sent_at is null
returning id;`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real psql output: first worker, then a second worker trying the same booking',
        code: `--- first worker claims booking a ---
 id
----
 a
(1 row)

--- second worker tries the same booking ---
 id
----
(0 rows)`,
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The reminder job. The claim is what makes a second run harmless.',
        source: `flowchart LR
  A[Scheduler runs every 5 minutes] --> B[Find bookings due, using the rule]
  B --> C[Claim each one: set reminder_sent_at where it is empty]
  C -->|row returned: we won| D[Send the message]
  C -->|no row: someone else did| E(Skip it)
  D --> F[Record the result]`,
      },
      {
        type: 'version',
        text: 'Vercel’s Cron Jobs page says a cron job makes an HTTP GET request to your production deployment’s URL at the path set in vercel.json, that the timezone is always UTC, that you cannot set both day-of-month and day-of-week, and that the feature is described as legacy and being migrated to Schedules; its Schedules pages also advise writing the target so it is safe to run more than once. Other hosts have their own schedulers with their own rules, so read yours before you rely on timing.',
        checked: CHECKED,
        sources: [DOCS.vercelCron],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**What the code above is doing.** `filter` goes through the list of bookings and keeps only the ones where every condition is true, like a bouncer checking each person on a list. The three conditions joined by `&&` (“and”) are: the reminder has not been sent yet (`=== null` means “empty”), the booking is in the future (`startsAt > nowMs`), and it starts soon enough (`startsAt - nowMs <= leadMinutes * MINUTE`: the gap, in milliseconds, is no more than the lead time). A *millisecond* is a thousandth of a second, so `MINUTE` is 60,000 of them. The function returns the bookings that passed all three. The SQL “claim” is like writing your name on a sign-up sheet: only the first person finds an empty line.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** “Mark then send” gives at-most-once delivery (a crash between the two loses a reminder); “send then mark” gives at-least-once (a crash causes a duplicate). Choose per message type and make the choice explicit: for reminders, claim first, record a status (`claimed`, `sent`, `failed`) and let a separate retry pass requeue claims older than a timeout. Pass an idempotency key (the booking id and reminder type) to the messaging provider if it supports one. Keep the job fast, bounded per run and resumable, add a lock or advisory lock only if you must serialise, index the columns the due-query filters on, and alert when the number of due-but-unsent bookings grows. Cover the rule with property-style tests around the lead-time boundaries and daylight-saving zones even if your first market has none.',
      },
      {
        type: 'takeaways',
        items: [
          'The core feature is the one thing customers pay for; build it first and prove it with tests.',
          'Build in thin vertical slices and commit after each one; do not ask an AI for the whole system at once.',
          'Put the key business rule in a small function with no database inside it, and test it with known inputs.',
          'Store times in UTC and convert for display; scheduled jobs often run on UTC.',
          'Make scheduled work safe to run twice by claiming each item atomically before acting on it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-05-code-challenge-1',
          kind: 'code-challenge',
          title: 'Which bookings are due a reminder?',
          prompt: 'Write `dueReminders(bookings, now, leadMinutes)`. Times are minutes on a simple clock. A booking is due when `sent` is false, `startsAt` is later than `now`, and `startsAt - now` is no more than `leadMinutes`. Return an array of the due booking ids, in the original order.',
          concept: 'testing a business rule',
          language: 'javascript',
          starter: `function dueReminders(bookings, now, leadMinutes) {
  // return the ids of the bookings that are due
}`,
          tests: {
            kind: 'function',
            fn: 'dueReminders',
            cases: [
              { args: [[{ id: 'a', startsAt: 120, sent: false }, { id: 'b', startsAt: 500, sent: false }], 0, 180], expected: ['a'], label: 'only the booking inside the lead time' },
              { args: [[{ id: 'a', startsAt: 120, sent: true }], 0, 180], expected: [], label: 'already reminded' },
              { args: [[{ id: 'a', startsAt: 50, sent: false }], 100, 180], expected: [], label: 'already started' },
              { args: [[{ id: 'a', startsAt: 180, sent: false }, { id: 'b', startsAt: 181, sent: false }], 0, 180], expected: ['a'], label: 'exactly on the boundary counts' },
              { args: [[{ id: 'x', startsAt: 10, sent: false }, { id: 'y', startsAt: 20, sent: false }], 0, 60], expected: ['x', 'y'], label: 'keeps the original order' },
            ],
          },
          solution: `function dueReminders(bookings, now, leadMinutes) {
  const ids = [];
  for (const booking of bookings) {
    if (!booking.sent && booking.startsAt > now && booking.startsAt - now <= leadMinutes) {
      ids.push(booking.id);
    }
  }
  return ids;
}`,
          hints: [
            'Loop through the bookings and keep a list of ids to return.',
            'Check three things at once with &&: not sent, in the future, and within leadMinutes.',
            'Push booking.id inside an if that checks !booking.sent, booking.startsAt > now and booking.startsAt - now <= leadMinutes.',
          ],
          explanation: 'The rule is three small checks joined together. Writing it as a plain function means a test can try the boundaries (exactly on the lead time, already started, already reminded) in a second, which is far more reliable than trusting a page.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-05-predict-output-1',
          kind: 'predict-output',
          title: 'What does the job print the second time?',
          prompt: 'This simulates the reminder job with the “mark as sent” step. Predict the three lines it prints.',
          concept: 'safe to run twice',
          language: 'javascript',
          code: `const bookings = [
  { id: 'a', startsAt: 120, sent: false },
  { id: 'b', startsAt: 500, sent: false },
];

function runJob(now) {
  const due = [];
  for (const booking of bookings) {
    if (!booking.sent && booking.startsAt > now && booking.startsAt - now <= 180) {
      booking.sent = true;
      due.push(booking.id);
    }
  }
  console.log('run at ' + now + ': ' + (due.length === 0 ? 'none' : due.join(',')));
}

runJob(0);
runJob(0);
runJob(400);`,
          choices: [
            'run at 0: a\nrun at 0: none\nrun at 400: b',
            'run at 0: a\nrun at 0: a\nrun at 400: b',
            'run at 0: a,b\nrun at 0: none\nrun at 400: none',
            'run at 0: a\nrun at 0: none\nrun at 400: none',
          ],
          wrongNotes: {
            'run at 0: a\nrun at 0: a\nrun at 400: b': 'The second run sees that booking a is already marked sent, so it does not return it again.',
            'run at 0: a,b\nrun at 0: none\nrun at 400: none': 'At time 0 booking b starts at 500, which is more than 180 minutes away, so it is not due yet.',
            'run at 0: a\nrun at 0: none\nrun at 400: none': 'At time 400, booking b starts in 100 minutes, which is inside the 180 minute lead time, so it is now due.',
          },
          hints: [
            'After the first run, what is booking a’s sent value?',
            'Booking b starts at 500: how far away is it at time 0, and at time 400?',
            'Run 1 sends a, run 2 finds nothing new, and run 3 at time 400 finds b.',
          ],
          explanation: 'Setting `sent = true` as part of the job is what makes the second run harmless, and booking b only becomes due once it is within 180 minutes. A real database does the same with an atomic claim.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-05-q1',
        prompt: 'Why ask an AI agent for a thin slice (such as “the Today page”) rather than the whole app?',
        choices: [
          'Slices use fewer tokens than a whole app, so the AI tool costs nothing and you never have to review the code that comes back',
          'Each slice is small enough to review, run and commit, so mistakes show early and are easy to undo',
          'AI tools can only write one file in each request, so any feature has to be split into many small separate requests',
          'A whole app can never be generated by an AI tool in one go, so slicing it is the only option that exists',
        ],
        answer: 1,
        explanation: 'A big change is too large to read and hard to undo. A finished slice with a commit gives you a clear restore point and something you can actually check.',
      },
      {
        id: 'build-saas-ai-05-q2',
        prompt: 'A job scheduled for 00:00 UTC is supposed to run at 8:00 AM in Manila (UTC+8). What do you conclude?',
        choices: [
          'It runs at 8:00 AM Manila time, because the hosting adds UTC+8 automatically for every schedule you create',
          'It runs at 12:00 midnight Manila time, since the schedule uses the time zone that is set in the shop’s settings',
          'It runs at 8:00 AM Manila time only on days when daylight saving is active in the Philippines for that month',
          'It runs at 8:00 AM Manila time only because 00:00 UTC is the same moment as 08:00 in Manila',
        ],
        answer: 3,
        explanation: 'UTC midnight is 8:00 AM in Manila (UTC+8). The point of the lesson is that a schedule is read in UTC on Vercel, so you must convert, rather than assume the shop’s local time.',
      },
      {
        id: 'build-saas-ai-05-q3',
        prompt: 'Why does the reminder job claim each booking (update ... where reminder_sent_at is null) before sending?',
        choices: [
          'So that a second run, or a second server, finds nothing to send and no customer gets two reminders',
          'So the database never needs an index on the bookings table, since marked rows can be skipped without searching them',
          'So the reminder can be sent faster than it would be if the booking was never marked in the database first',
          'So that the job can run on a schedule without ever needing to know the booking’s start time at all',
        ],
        answer: 0,
        explanation: 'Only one worker can change a still-empty field, so a duplicate run finds zero rows and sends nothing. It is a safety habit, not a speed trick.',
      },
      {
        id: 'build-saas-ai-05-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, why write the “is a reminder due?” rule as a small function with tests?',
        choices: [
          'Because a function always runs faster than a web page and uses far less memory on the server that runs it',
          'Because websites cannot contain rules',
          'Because it lets you try the rule with known inputs in a second and see exactly when it is right or wrong',
          'Because AI tools only understand code that has been written as functions and cannot read a whole web page'
        ],
        answer: 2,
        explanation: 'A small function with no database inside can be run with chosen examples, so you can check the boundaries yourself rather than trust that it works.',
      },
      {
        id: 'build-saas-ai-05-q5',
        audience: { min: 'advanced' },
        prompt: 'Your reminder job claims a booking, then the messaging provider times out and the process crashes. What design handles this best?',
        choices: [
          'Remove the claim and always send every due booking, accepting that some customers will get two messages for one visit',
          'Record a status (claimed, sent, failed) with a time, requeue stale claims in a retry pass, and use an idempotency key where supported',
          'Increase the timeout on every call to the messaging provider until the provider can no longer fail or respond slowly at all',
          'Mark the booking as sent first and then send it from a separate job that is never retried even if the send fails for good',
        ],
        answer: 1,
        explanation: 'A claim alone can lose a reminder if the process dies. A status plus a retry for stale claims, and an idempotency key, gives bounded duplicates and no silent losses.',
      },
    ],
    task: {
      title: 'Build the reminder slice with a test first',
      steps: [
        'Ask your AI tool for slice 3 only: the dueReminders function, writing the tests first. Run the tests and watch them fail, then pass.',
        'Add your own test for a boundary the AI did not think of (for example a booking exactly at the lead time) and confirm it passes.',
        'Ask for slice 5: a “claim” query like the SQL in this lesson, and a test that running the job twice sends one message.',
        'Commit after each slice. Write one line in your notes: what you did not verify yet.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain dueReminders line by line using an example with three bookings, and tell me what each test checks.” Draw the three bookings on a timeline to see why one is due.'] },
      { audience: { min: 'advanced' }, steps: ['Add a status column (claimed, sent, failed) and a retry pass for claims older than ten minutes. Write a test that kills the sender mid-run and shows the booking is retried exactly once.'] },
    ],
  },
  {
    id: 'build-saas-ai-06',
    day: 6,
    title: 'Keep every customer’s data separate',
    summary: 'Make the database itself refuse to show one customer’s rows to another, and prove it with a test that fails first and then passes.',
    minutes: 30,
    skills: ['tenant-isolation'],
    intro: {
      objectives: [
        'Explain what a tenant is and why an app-level filter alone is not enough',
        'Read a row level security policy and say who can see, add, change and delete which rows',
        'Write the two-customer test that proves a leak is closed',
      ],
      why: 'Showing one customer’s data to another is the worst failure a SaaS can have. AI-written code often forgets a filter, and it still works perfectly when you test with one account, so this is the lesson that protects your business.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **tenant** is one customer of your SaaS, together with everything that belongs to them. In Paalala, a tenant is a **shop**. **Multi-tenant** means many shops share one app and one database, and each must only ever see their own bookings. Think of an apartment building with one lock system: every resident’s key must open their own door and no one else’s. The danger is quiet. Code that loads “all bookings” works perfectly while you are the only user, and the bug appears the day a second shop signs up. AI-generated code makes this mistake easily, because the version without the filter is shorter, so it is the lesson most worth getting right.',
      },
      { type: 'heading', text: 'The data model: every row names its shop' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Every row that belongs to a customer carries the shop it belongs to. Membership says which people belong to which shop.',
        source: `erDiagram
  SHOPS ||--o{ SHOP_MEMBERS : has
  SHOPS ||--o{ BOOKINGS : owns
  USERS ||--o{ SHOP_MEMBERS : joins
  SHOPS {
    uuid id
    text name
  }
  SHOP_MEMBERS {
    uuid shop_id
    uuid user_id
  }
  BOOKINGS {
    uuid id
    uuid shop_id
    text customer_name
    timestamptz starts_at
  }`,
      },
      {
        type: 'paragraph',
        text: 'Two layers protect the data. **Layer one** is your application: every query asks only for the current shop’s rows. **Layer two** is the database: **row level security** (RLS) makes the database itself refuse to return or change a row the signed-in person has no right to, *whatever the application asks for*. You want both, but layer two is the one you can rely on, because layer one depends on every query, written by you or an AI, remembering the filter every time. That is called **defence in depth**: if one layer has a hole, another still holds.',
      },
      { type: 'heading', text: 'Watch it fail, then fix it' },
      {
        type: 'paragraph',
        text: 'We built this schema in a real PostgreSQL with two shops, Aling Rosa Salon (two bookings) and Kuya Ben Barbershop (one), and a stand-in for the sign-in function (`auth.uid()` returns the current user). Then we played different people. First, with no protection at all, Rosa asked for her bookings:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Step 1: no row level security. Rosa asks for “all bookings”. (real psql output)',
        code: ` customer_name |               shop_id
---------------+--------------------------------------
 Jose          | 11111111-1111-1111-1111-111111111111
 Maria         | 11111111-1111-1111-1111-111111111111
 Paolo         | 22222222-2222-2222-2222-222222222222
(3 rows)`,
      },
      {
        type: 'paragraph',
        text: 'That is the leak: Rosa sees Paolo, Ben’s customer. Nothing crashed and nothing looked wrong. Now the fix. We turn RLS on, and the first result is surprising: with RLS on and **no policy yet**, Rosa sees zero rows. That is the safe default (deny everything) and it is why the next step is adding the policy that says who may see what.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'The policy: you may read a booking if you belong to its shop (fragment: the tables already exist)',
        code: `alter table bookings enable row level security;

create policy "Members read their shop's bookings"
on bookings for select to authenticated
using (
  shop_id in (
    select sm.shop_id from shop_members sm
    where sm.user_id = (select auth.uid())
  )
);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Step 3: with the policy. (real psql output)',
        code: `--- Rosa, no filter ---          Jose, Maria            (2 rows)
--- Ben asks for Rosa's shop by id ---          (0 rows)
--- Ben, no filter ---           Paolo                  (1 row)
--- Signed out ---               (0 rows)`,
      },
      {
        type: 'paragraph',
        text: 'Read the third line again: Ben ran a query with *no filter at all* and still got only his own customer. The database did the filtering for him. That is what “forgetting the filter” looks like once layer two exists: nothing bad happens. Reading is only half the story, so we also tested writing. With no insert policy, Ben’s attempt to add a booking to Rosa’s shop failed with `new row violates row-level security policy`. After adding an insert policy that uses `with check` (the rule applied to the row being written), Ben’s insert into Rosa’s shop was still refused and his insert into his own shop worked. Updates and deletes need policies in the same way.',
      },
      {
        type: 'warning',
        text: 'The secret key and server-side “admin” connections skip row level security completely. Any code that uses them must do its own tenant check on every query, so keep that code small and in as few places as you can. Also, an RLS policy only protects the tables it is on: turn RLS on for every table that holds customer data.',
      },
      { type: 'heading', text: 'The two-customer test' },
      {
        type: 'paragraph',
        text: 'The test that matters is the one that **fails first**. Create two shops with one booking each, sign in as shop A’s owner, and try everything against shop B’s booking: read it, change it, delete it, add a booking to shop B. Every attempt must fail or return nothing. Run it before the policies exist (it should fail loudly: that proves the test can catch the leak) and again after (it should pass). A security test that has never been seen failing proves nothing.',
      },
      {
        type: 'prompt',
        label: 'Ask an AI tool to build the safety net',
        text: 'Read SPEC.md. Enable row level security on every table that holds customer data (shops, shop_members, customers, bookings, reminders) and write policies so a signed-in person can only select, insert, update or delete rows of shops they belong to; use (select auth.uid()) and put indexes on shop_id and user_id. Then write an automated test with two shops and two users: sign in as user A and try to read, update, delete and insert rows of shop B. Show me the test FAILING before the policies exist, then PASSING after. List every place in the code that uses the secret key.',
      },
      {
        type: 'details',
        summary: 'Show more: performance and the helper-function version',
        body: [
          'Supabase’s RLS guide advises wrapping the user lookup as (select auth.uid()) so the database evaluates it once per statement rather than once per row, and indexing every column that a policy filters on (here user_id on shop_members and shop_id on bookings), because policies run on every query.',
          'A membership check can also live in a `security definer` function so the policy does not re-enter RLS on the membership table. That function runs with its owner’s privileges, so set its search_path to empty, schema-qualify every name inside it and keep it out of any schema your API exposes.',
          'Always read an AI-written policy aloud as a sentence: “a signed-in person may select a booking if the booking’s shop is one of their shops.” If it will not read as a sentence you agree with, it is wrong.',
        ],
      },
      {
        type: 'version',
        text: 'Supabase’s RLS guide says to enable row level security on every table in an exposed schema; that with RLS on and no policies no data is accessible through the API with a publishable key; that policies use auth.uid() (which is null for signed-out requests) and that select and delete use using while insert uses with check and update typically uses both; that a secret key authorizes as service_role, which bypasses RLS; that user_metadata is user-editable while app_metadata is not; and it recommends (select auth.uid()), indexes on policy columns, and testing policies. The membership example in this lesson follows its membership-based policy. Exact guidance, including its advice about default grants, changes, so check the page before copying a policy.',
        checked: CHECKED,
        sources: [DOCS.supabaseRls, DOCS.supabaseKeys],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Picture a school office with one filing cabinet for every class. Without rules, any teacher can open any folder. Row level security is a rule built into the cabinet itself: each folder has a class label, and the cabinet only lets a teacher pull folders whose label matches their own class, even if they ask for “everything”. A **row** is one entry in a table, like one folder. The `using (...)` part of the policy is that rule, read as: “show a booking only if its shop is one of the shops this person belongs to”. `with check (...)` is the same rule applied when someone *adds* a folder. A **policy** is just one such rule; “no policy” means the cabinet stays locked, which is why a missing policy shows zero rows rather than everything.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Choose the isolation model deliberately: a shared schema with a tenant id and RLS (what we built) is the cheapest to run and the easiest to migrate; a schema or database per tenant isolates harder and costs more operationally, which usually only pays off for large or regulated customers. Test policies, not just queries: keep pgTAP or equivalent tests in CI that impersonate roles, and add a lint that fails when a table in the exposed schema lacks RLS. Review every `security definer` function and every use of the privileged key as an audit item, log which tenant each privileged query acted for, and decide how support staff access tenant data (a separate, audited, time-limited path). Watch for cross-tenant leaks beyond rows: file storage buckets, search indexes, caches, background jobs, exports and webhook payloads need the same tenant scoping.',
      },
      {
        type: 'takeaways',
        items: [
          'A tenant is one customer; in a multi-tenant SaaS every row that belongs to a customer names the shop it belongs to.',
          'An app-level filter is layer one; row level security makes the database enforce the rule even when a query forgets the filter.',
          'With RLS on and no policy, nothing is returned: add a policy for each action (select, insert, update, delete).',
          'The secret key and admin connections bypass RLS, so code that uses them must check the tenant itself.',
          'Write the two-customer test, watch it fail before the policies exist, and make it pass: a security test that never failed proves nothing.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-06-fix-bug-1',
          kind: 'fix-bug',
          title: 'The lookup that forgot the shop',
          prompt: 'This function finds one booking by id for a signed-in user. Ben (shop 2) can open Rosa’s booking by guessing its id. Tap the line missing the tenant check, then choose the fix.',
          concept: 'missing tenant filter',
          language: 'javascript',
          code: `function findBooking(bookings, id, user) {
  for (const booking of bookings) {
    if (booking.id === id) return booking;
  }
  return null;
}`,
          bugLine: 3,
          fixes: [
            { line: '    if (booking.id === id && user.shopIds.includes(booking.shopId)) return booking;', correct: true, why: 'The booking is returned only when the id matches and it belongs to one of the user’s shops, so a guessed id of another shop gives null.' },
            { line: '    if (booking.id === id || user.shopIds.includes(booking.shopId)) return booking;', correct: false, why: 'With “or”, the first booking of the user’s own shop is returned for any id, including ids that belong to another shop.' },
            { line: '    if (booking.id === id && booking.shopId) return booking;', correct: false, why: 'Every booking has a shopId, so this still returns another shop’s booking.' },
            { line: '    if (booking.id === id) return user ? booking : null;', correct: false, why: 'This only checks that somebody is signed in, not whose booking it is.' },
          ],
          tests: {
            kind: 'function',
            fn: 'findBooking',
            cases: [
              { args: [[{ id: 'b1', shopId: 's1' }, { id: 'b2', shopId: 's2' }], 'b2', { shopIds: ['s1'] }], expected: null, label: 'guessing another shop’s id' },
              { args: [[{ id: 'b1', shopId: 's1' }, { id: 'b2', shopId: 's2' }], 'b1', { shopIds: ['s1'] }], expected: { id: 'b1', shopId: 's1' }, label: 'own booking is found' },
              { args: [[{ id: 'b1', shopId: 's1' }], 'b1', { shopIds: [] }], expected: null, label: 'a person with no shop' },
            ],
          },
          hints: [
            'The id matches, but nothing asks whose booking it is.',
            'Add a second condition joined with && that checks the booking’s shop is one of the user’s shops.',
            'user.shopIds.includes(booking.shopId) must also be true.',
          ],
          explanation: 'An id is not a permission. The check must compare the row’s shop with the person’s shops, and it must be “and”, not “or”. RLS does this in the database so a forgotten check cannot leak, but the app should still do it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-06-code-challenge-1',
          kind: 'code-challenge',
          title: 'Who can see this row?',
          prompt: 'Write `visibleBookings(bookings, user)` the way the policy reads. Each booking has a `shopId`. `user` is either `null` (signed out) or an object with `shopIds`. Return only the bookings whose `shopId` is in the user’s `shopIds`; a signed-out visitor sees none.',
          concept: 'tenant-scoped read',
          language: 'javascript',
          starter: `function visibleBookings(bookings, user) {
  // return the bookings this user may see
}`,
          tests: {
            kind: 'function',
            fn: 'visibleBookings',
            cases: [
              { args: [[{ id: 'a', shopId: 's1' }, { id: 'b', shopId: 's2' }, { id: 'c', shopId: 's1' }], { shopIds: ['s1'] }], expected: [{ id: 'a', shopId: 's1' }, { id: 'c', shopId: 's1' }], label: 'one shop' },
              { args: [[{ id: 'a', shopId: 's1' }, { id: 'b', shopId: 's2' }], { shopIds: ['s1', 's2'] }], expected: [{ id: 'a', shopId: 's1' }, { id: 'b', shopId: 's2' }], label: 'a member of two shops' },
              { args: [[{ id: 'a', shopId: 's1' }], { shopIds: [] }], expected: [], label: 'belongs to no shop' },
              { args: [[{ id: 'a', shopId: 's1' }], null], expected: [], label: 'signed out' },
            ],
          },
          solution: `function visibleBookings(bookings, user) {
  if (!user) return [];
  return bookings.filter((booking) => user.shopIds.includes(booking.shopId));
}`,
          hints: [
            'First decide what a signed-out visitor (null) should get.',
            'filter keeps the bookings for which the test is true; the test is “the user’s shopIds include this booking’s shopId”.',
            'if (!user) return []; then return bookings.filter((booking) => user.shopIds.includes(booking.shopId)).',
          ],
          explanation: 'This is the policy in plain code: a row is visible when its shop is one of the person’s shops, and nobody who is signed out sees anything. Note the safe default: when in doubt, return nothing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-06-scenario-1',
          kind: 'scenario',
          title: 'The AI adds a filter to one page',
          prompt: 'Choose the response that best protects your customers.',
          concept: 'defence in depth',
          situation: 'You test with a second account and find that Ben’s shop can see Rosa’s bookings. Your AI agent says: “Fixed: I added `where shop_id = currentShop` to the bookings page query.” The app has seven other pages and an export that also read bookings.',
          options: [
            { text: 'Ask for row level security policies on every customer table, plus a two-customer test that fails before the policies and passes after, then re-run it on all eight places.', consequence: 'The database now refuses cross-shop reads whichever page asks, and the test proves it. A future page that forgets the filter cannot leak.', quality: 'best' },
            { text: 'Accept the fix and test the bookings page again with two accounts.', consequence: 'That page is fixed, but the seven other places and the export may still leak, and the next AI-written query may forget the filter again.', quality: 'poor' },
            { text: 'Ask the AI to add the same filter to the other seven pages and the export.', consequence: 'Better than one page, but it still depends on every query remembering. One missed line, now or in a future feature, leaks again.', quality: 'acceptable' },
            { text: 'Hide the other shops’ names in the page so they are not visible.', consequence: 'The data is still sent to the browser and can be read from the network tab. Hiding it on screen is not protection.', quality: 'poor' },
          ],
          hints: [
            'How many places read bookings, and how many would you have to remember?',
            'A rule enforced by the database holds even when a query forgets it.',
            'Use RLS policies plus a two-customer test, then check every place.',
          ],
          explanation: 'A filter in one place fixes one place. Row level security moves the rule to the data, so it cannot be forgotten, and the two-customer test is how you know it is true.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-06-q1',
        prompt: 'With row level security turned on for a table but no policy created yet, what does a signed-in member get when they select from it?',
        choices: [
          'Every row, because the table is still readable by signed-in users',
          'An error message that stops the whole application from starting up',
          'Only the rows the member created themselves, using the creation time',
          'Zero rows: access is denied by default until a policy allows it',
        ],
        answer: 3,
        explanation: 'RLS denies by default. A table with RLS on and no policy returns nothing, which is the safe state to build from. You then add policies for exactly what each person may do.',
      },
      {
        id: 'build-saas-ai-06-q2',
        prompt: 'Which statement best describes the relationship between an app filter and RLS?',
        choices: [
          'They are the same thing written in two places, so using one of them means that you do not need the other at all',
          'RLS replaces the app filter completely, so the filter should be deleted from every query in the whole application',
          'The app filter is layer one; RLS is layer two and still protects the data when a query forgets its filter',
          'RLS is only for writes, and the app filter is the only thing that is ever responsible for protecting every read',
        ],
        answer: 2,
        explanation: 'Defence in depth means two independent layers. The app filter keeps queries tidy and fast; RLS makes sure a missing filter does not become a data leak.',
      },
      {
        id: 'build-saas-ai-06-q3',
        prompt: 'Why must you see the two-customer test fail before the policies exist?',
        choices: [
          'Because tests are never allowed to pass the first time that they are run, whatever they happen to be checking',
          'To prove the test can detect the leak, so a passing result later actually means something',
          'Because the database only allows a policy to be created after a test in the project has failed once before',
          'To make sure that the database is slow enough to be tested properly with two users at the same time',
        ],
        answer: 1,
        explanation: 'A test that has never failed might be testing nothing. Watching it catch the leak first proves it works as a detector, so the later pass is real evidence.',
      },
      {
        id: 'build-saas-ai-06-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does the policy “you may read a booking if you belong to its shop” do?',
        choices: [
          'It lets every signed-in person read every booking in every shop, as long as they are signed in at the time they ask',
          'It lets the database hand back only the bookings of the shops you belong to, even if you ask for everything',
          'It deletes the bookings of any shop that you do not belong to every time that you sign in to the app again',
          'It sends an email to the owner of the shop whenever someone from another shop tries to read one of its bookings',
        ],
        answer: 1,
        explanation: 'A policy is a rule the database checks for each row. This one filters the result so a person only gets the rows of their own shops.',
      },
      {
        id: 'build-saas-ai-06-q5',
        audience: { min: 'advanced' },
        prompt: 'A new background job exports bookings to CSV using the secret key, and a customer reports another shop’s rows in their file. What is the best long-term response?',
        choices: [
          'Remove the secret key from the whole project, webhooks and background jobs included, so that no code can ever bypass RLS',
          'Switch the export to the publishable key, because that key is meant for the browser, and then delete the export’s tests',
          'Treat privileged code as an audit item: scope each query by tenant, test it with two tenants, and review other secret-key uses',
          'Add a warning in the file name and in the email telling customers to check their rows carefully before they share the file',
        ],
        answer: 2,
        explanation: 'Privileged connections bypass RLS, so each use needs its own tenant check and its own two-tenant test. Removing the key altogether is not realistic, and warning customers is not a control.',
      },
    ],
    task: {
      title: 'Prove the leak is closed with two shops',
      steps: [
        'In a local or free Supabase database, create two shops with one booking each and two users, one in each shop (use your AI tool to write the setup script).',
        'With RLS off, sign in as user A and read all bookings: confirm you can see shop B’s booking. Save the output.',
        'Turn RLS on for every customer table and add select, insert, update and delete policies (ask the AI, then read each policy aloud as a sentence).',
        'Repeat the attempts as user A against shop B (read, update, delete, insert). Save the results and write one line on what the first run proved.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain each of my policies in one plain sentence, like a school rule.” Check each sentence against what happened in your two-shop test.'] },
      { audience: { min: 'advanced' }, steps: ['Add a CI check that fails when any table in the exposed schema has RLS off, and a pgTAP-style test that impersonates both users. Audit every use of the secret key and list the tenant check each one performs.'] },
    ],
  },
  {
    id: 'build-saas-ai-07',
    day: 7,
    title: 'Charge for it: plans, billing and receipts',
    summary: 'Use a payment provider’s hosted checkout in test mode, treat verified webhooks as the truth about who has paid, and handle plan limits and failures.',
    minutes: 35,
    skills: ['billing-webhooks'],
    intro: {
      objectives: [
        'Explain why card details never touch your server and what you store instead',
        'Verify a payment webhook’s signature, ignore duplicates, and unlock a plan only from a verified event',
        'Map subscription states to what the product does, including a failed payment',
      ],
      why: 'Billing is where a SaaS earns money and where one mistake costs it: a forged webhook that grants free plans, a duplicate that charges twice, or a failed card that locks out a happy customer. Use the provider’s tools and check the few places that matter.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Billing has four jobs: define the **plans** people can buy, take their payment, remember who has paid so the app can unlock the right features, and handle everything that goes wrong (a card is declined, someone upgrades mid-month, someone cancels). Paalala’s plans from the spec are Free (20 reminders a month), Studio (500) and Shop (5,000). You will not build the payment part yourself. Card numbers are heavily regulated and dangerous to hold, and a payment provider (this lesson uses **Stripe** as the example; others follow a similar shape) exists to carry that risk. Your rule is simple: **card details never touch your server.**',
      },
      {
        type: 'paragraph',
        text: 'Here is how it works. Your app sends the owner to the provider’s own **hosted checkout page**, where they type their card. The provider takes the money and then tells your server what happened by sending a **webhook**: a message the provider posts to a web address you registered, saying “this invoice was paid”. Your server stores only ids and statuses (a customer id, a subscription id, a status), never a card. All of it happens in **test mode** while you build: a sandbox where nothing real is charged. Use the provider’s fake test cards, and never type a real card into a test form. (Pricing strategy and app-store rules belong to the course App Monetization and Subscriptions; here we make the plumbing correct.)',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Upgrading a plan. The webhook, not the browser’s “success” page, is what changes the shop’s plan.',
        source: `sequenceDiagram
  participant O as Owner
  participant A as Your server
  participant P as Payment provider
  O->>A: clicks Upgrade to Studio
  A->>P: create checkout session (plan, your shop id)
  P-->>O: redirect to the hosted payment page
  O->>P: pays with a card (never sent to you)
  P->>A: webhook: invoice paid (signed)
  A->>A: verify signature, ignore duplicates
  A->>A: set the shop's plan to Studio
  P-->>O: redirect back to your success page`,
      },
      {
        type: 'warning',
        text: 'Never unlock a plan because the browser landed on a “success” page. Anyone can type that address, and a customer who pays and then closes the tab never reaches it. Only a verified webhook (or a check of the provider’s API) is the truth.',
      },
      { type: 'heading', text: 'Verifying a webhook, line by line' },
      {
        type: 'paragraph',
        text: 'Your webhook address is public, so anyone can send it a fake “invoice paid” message. The provider therefore **signs** every message. Stripe sends a header with a timestamp and a signature, such as `t=1800000000,v1=5257...`. The signature is an **HMAC** with SHA-256: a code computed from a shared secret (the endpoint’s signing secret, which only you and the provider know) and the message. You compute the same code over the text `timestamp + "." + raw body` and compare. If they match, the message came from the provider and was not changed. Three details matter. Use the **raw body**, exactly as received: parsing and re-printing JSON changes it and breaks the check. Compare in **constant time** so an attacker cannot learn the answer from how long the comparison takes. And reject messages whose timestamp is too old (Stripe’s libraries default to five minutes), so a recorded message cannot be replayed. Here is the check we ran with Node’s built-in crypto module:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'webhook.mjs (Node.js 22; a fragment: SECRET and grants are defined at the top of the real file, and the secret and ids are invented)',
        code: `import { createHmac, timingSafeEqual } from 'node:crypto';

const TOLERANCE_SECONDS = 300;

export function verifyWebhook(rawBody, header, secret, nowSeconds) {
  if (!header) return { ok: false, reason: 'missing signature' };
  const parts = header.split(',').map((part) => part.split('='));
  const timestamp = parts.find(([key]) => key === 't')?.[1];
  const candidates = parts.filter(([key]) => key === 'v1').map(([, value]) => value);
  if (!timestamp || candidates.length === 0) return { ok: false, reason: 'malformed header' };

  const expected = createHmac('sha256', secret).update(timestamp + '.' + rawBody).digest();
  const matches = candidates.some((hex) => {
    const received = Buffer.from(hex, 'hex');
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
  if (!matches) return { ok: false, reason: 'signature does not match' };
  if (Math.abs(nowSeconds - Number(timestamp)) > TOLERANCE_SECONDS) return { ok: false, reason: 'timestamp too old' };
  return { ok: true };
}

const processed = new Set();

export function handleEvent(rawBody, header, now) {
  const check = verifyWebhook(rawBody, header, SECRET, now);
  if (!check.ok) return { status: 400, body: check.reason };
  const event = JSON.parse(rawBody);
  if (processed.has(event.id)) return { status: 200, body: 'already processed' };
  processed.add(event.id);
  if (event.type === 'invoice.paid') grants.push(event.data.object.customer);
  return { status: 200, body: 'ok' };
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: six deliveries to handleEvent',
        code: `valid         { status: 200, body: 'ok' }
duplicate     { status: 200, body: 'already processed' }
forged        { status: 400, body: 'signature does not match' }
tampered      { status: 400, body: 'signature does not match' }
no header     { status: 400, body: 'missing signature' }
replayed      { status: 400, body: 'timestamp too old' }
grants        [ 'cus_rosa' ]`,
      },
      {
        type: 'paragraph',
        text: 'Read the output as a story. The real message was accepted once. The same message delivered again was acknowledged but did nothing (providers sometimes deliver an event more than once, so you remember the **event id** you have processed). A message signed with the wrong secret, a message whose body was edited after signing, and a message with no signature were all refused. A correctly signed message from an hour ago was refused as a replay. And exactly one customer, `cus_rosa`, ended up unlocked. In real code you would normally use the provider’s own library for the check rather than writing it yourself, and you should still understand what it does.',
      },
      {
        type: 'prompt',
        label: 'A webhook prompt with the rules built in',
        text: 'Add a payment webhook endpoint for subscription events using the payment provider\'s official library, in TEST mode only. Rules: read the raw request body and verify the signature with the signing secret from an environment variable before parsing; reject old timestamps; store each processed event id in a table and ignore repeats; return a 2xx quickly and do the slow work after; handle invoice.paid, invoice.payment_failed and customer.subscription.deleted; never rely on event order, and fetch the current subscription from the provider by id when you need its status; update shops.plan only from these verified events. Add tests for a forged, a tampered, a duplicate and a replayed event. Never log or store card data.',
      },
      { type: 'heading', text: 'Statuses, limits and changing plans' },
      {
        type: 'paragraph',
        text: 'A subscription has a **status**, and your app should decide what each one means before launch. The provider’s documentation recommends revoking access when a subscription is canceled or unpaid, and notifying the customer when it becomes past due. Paalala’s spec adds a seven-day grace period.',
      },
      {
        type: 'table',
        headers: ['Subscription status', 'What it means', 'What Paalala does'],
        rows: [
          ['active or trialing', 'In good standing, or in a free trial', 'Full access to the plan'],
          ['past_due', 'A renewal payment failed or was not attempted; the provider may retry', 'Keep working for 7 days, email the owner a link to fix the card'],
          ['unpaid or canceled', 'The subscription ended, or retries ran out', 'Drop the shop to Free; keep all its data'],
          ['incomplete', 'The first payment has not succeeded yet', 'Do not unlock anything yet'],
        ],
        caption: 'Decide each row in the spec, not during an incident.',
      },
      {
        type: 'paragraph',
        text: '**Plan limits** live in your code as plain data (`free: 20 reminders`) and are enforced in the place that sends. At the limit the shop should see a friendly message and an upgrade button, never a crash. **Changing plans** mid-month creates a **proration**: the customer is credited for the unused part of the old plan and charged for the rest of the new one. The provider calculates this (to the second by default) and its documentation gives the example of a monthly plan upgraded halfway through the period costing the difference for half a month. You do not need to compute it yourself, but you should understand and be able to preview it. We checked the arithmetic with whole centavos, the way money should be stored, never decimals:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'billing.mjs, with the real output below it',
        code: `export function prorate(oldCentavos, newCentavos, daysLeft, daysInPeriod) {
  const credit = Math.round((oldCentavos * daysLeft) / daysInPeriod);
  const charge = Math.round((newCentavos * daysLeft) / daysInPeriod);
  return charge - credit;
}

console.log(prorate(49900, 99900, 15, 30)); // upgrade, 15 of 30 days left
console.log(prorate(99900, 49900, 10, 30)); // downgrade, 10 of 30 days left
// 25000    (a charge of PHP 250.00)
// -16667   (a credit of PHP 166.67)`,
      },
      {
        type: 'paragraph',
        text: 'A downgrade produces a credit, and the provider says negative prorations are not automatically refunded: they reduce the next invoice unless you issue a refund. Finally, do not build a screen for updating cards, viewing invoices and cancelling. The provider offers a hosted **customer portal** for exactly that, and it also sends **receipts** and invoices by email, so your app only needs a “Manage billing” button that sends the owner there.',
      },
      {
        type: 'version',
        text: 'Checked against Stripe’s own documentation pages on webhooks, subscription webhooks, prorations, testing, Checkout and the customer portal. Stripe signs each event with a Stripe-Signature header containing t and v1 entries (v1 is an HMAC with SHA-256 over the timestamp, a dot and the raw body, using the endpoint secret); it asks you to use the raw body, verify before acting, compare in constant time, return a 2xx quickly, and track event ids because events can be delivered more than once and are not guaranteed to arrive in order; its libraries default to a five-minute timestamp tolerance; in live mode it retries failed deliveries for up to three days with exponential backoff, and in a sandbox three times over a few hours. Its docs say to revoke access for canceled or unpaid subscriptions, notify the customer on past_due, and not to use real card details in testing. Proration defaults to create_prorations; always_invoice and none exist; negative prorations are not automatically refunded; the customer portal cannot be shown inside an iframe. The official library is stripe-node (Node.js 20 and later), which offers webhooks.constructEvent for the check. Other providers use their own header formats, and all of this changes, so read your provider’s current pages and use its library.',
        checked: CHECKED,
        sources: [DOCS.stripeNode, DOCS.nodeCrypto],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**What the webhook code is doing.** A webhook arrives as a block of text plus a signature header. Think of a letter with a wax seal. The seal is made with a secret stamp that only the sender and you own, so you can recreate the seal yourself and compare: if your seal matches theirs, the letter is genuine and untouched. `createHmac` makes the seal from the secret and the letter; `timingSafeEqual` compares two seals without leaking hints; the `timestamp` check refuses very old letters, in case someone is re-sending one they intercepted. The `processed` set is a tick-list of letter numbers you have already acted on, so a duplicate does nothing. Only after all the checks does the code do the real work: unlock the customer. If any check fails, it answers with an error and unlocks nothing.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Store the event id and apply its effect in one transaction, with a unique constraint on the id, so concurrent deliveries of the same event cannot both win. Acknowledge fast and process from a queue; webhooks arrive in bursts, for example when many subscriptions renew on the same day. Because order is not guaranteed, make handlers converge: on each event, fetch the current object by id and write the resulting state, rather than applying a delta. Reconcile with a periodic job that compares your table to the provider’s list and alerts on drift. Keep the signing secret per environment, support secret rotation with two active secrets, and never log full payloads. Decide how proration, tax, refunds, disputes, and plan changes interact with entitlements, and test them with the provider’s sandbox clocks. If you ever need the amounts on your side, calculate in integer minor units and round the way your provider does.',
      },
      {
        type: 'takeaways',
        items: [
          'Never touch card data: send the customer to the provider’s hosted checkout and store only ids and statuses, building everything in test mode first.',
          'A verified webhook, not a browser redirect, is the truth about who has paid.',
          'Verify the signature over the raw body, compare in constant time, reject old timestamps, and remember event ids so duplicates do nothing.',
          'Decide what each subscription status means before launch, including a grace period for failed payments.',
          'Use the provider’s customer portal and emailed receipts instead of building those screens, and keep money in whole centavos.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-07-fix-bug-1',
          kind: 'fix-bug',
          title: 'The check that works backwards',
          prompt: 'An AI wrote this webhook handler. Real, correctly signed events are being refused and nothing is granted. Tap the line with the faulty check, then choose the fix. (`signatureValid` is true when the signature check passed.)',
          concept: 'verifying webhooks',
          language: 'javascript',
          code: `function handleWebhook(event, signatureValid, seenIds, granted) {
  if (seenIds.includes(event.id)) return 'duplicate';
  if (signatureValid) return 'rejected';
  seenIds.push(event.id);
  if (event.type === 'invoice.paid') granted.push(event.customer);
  return 'ok';
}`,
          bugLine: 3,
          fixes: [
            { line: '  if (!signatureValid) return \'rejected\';', correct: true, why: 'Refuse the event when the signature is not valid. A valid event continues, so its id is remembered and the customer is granted.' },
            { line: '  if (!signatureValid) return \'ignored\';', correct: false, why: 'The check now points the right way, but the function must answer “rejected” for a bad signature, so a forged event gets the wrong result.' },
            { line: '  if (signatureValid) return \'ok\';', correct: false, why: 'This returns “ok” for valid events without granting anything, and lets forged events carry on and be granted.' },
            { line: '  if (signatureValid === false && seenIds.length > 0) return \'rejected\';', correct: false, why: 'A forged event is only refused when something has already been processed, so the very first forged event is accepted.' },
          ],
          tests: {
            kind: 'function',
            fn: 'handleWebhook',
            cases: [
              { args: [{ id: 'evt_1', type: 'invoice.paid', customer: 'cus_a' }, true, [], []], expected: 'ok', label: 'real event is accepted' },
              { args: [{ id: 'evt_2', type: 'invoice.paid', customer: 'cus_b' }, false, [], []], expected: 'rejected', label: 'forged event is refused' },
              { args: [{ id: 'evt_1', type: 'invoice.paid', customer: 'cus_a' }, true, ['evt_1'], []], expected: 'duplicate', label: 'repeat delivery is ignored' },
            ],
          },
          hints: [
            'When should the function answer “rejected”: when the signature is valid, or when it is not?',
            'The word “not” is missing from the condition.',
            'Use if (!signatureValid) return \'rejected\'; so only valid events carry on.',
          ],
          explanation: 'An inverted condition is a common mistake in generated code, and it is exactly why you test a forged and a real event. The check must refuse the bad one and let the real one through.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-07-code-challenge-1',
          kind: 'code-challenge',
          title: 'Price a mid-month upgrade',
          prompt: 'Write `prorate(oldCentavos, newCentavos, daysLeft, daysInPeriod)` for the preview screen. Credit the unused part of the old plan, charge the remaining part of the new plan, round each to a whole centavo with `Math.round`, and return charge minus credit. A negative result is a credit.',
          concept: 'proration arithmetic',
          language: 'javascript',
          starter: `function prorate(oldCentavos, newCentavos, daysLeft, daysInPeriod) {
  // credit for the old plan, charge for the new plan, return the difference
}`,
          tests: {
            kind: 'function',
            fn: 'prorate',
            cases: [
              { args: [49900, 99900, 15, 30], expected: 25000, label: 'upgrade halfway through' },
              { args: [99900, 49900, 10, 30], expected: -16667, label: 'downgrade gives a credit' },
              { args: [49900, 49900, 10, 30], expected: 0, label: 'same plan' },
              { args: [1000, 2000, 1, 3], expected: 334, label: 'rounding each part first' },
            ],
          },
          solution: `function prorate(oldCentavos, newCentavos, daysLeft, daysInPeriod) {
  const credit = Math.round((oldCentavos * daysLeft) / daysInPeriod);
  const charge = Math.round((newCentavos * daysLeft) / daysInPeriod);
  return charge - credit;
}`,
          hints: [
            'The share of the period that is left is daysLeft divided by daysInPeriod.',
            'Compute credit from the old amount and charge from the new amount, rounding each one.',
            'return Math.round(new * left / total) - Math.round(old * left / total).',
          ],
          explanation: 'Each part is a share of the period times a price, rounded to a whole centavo, and the result is the difference. Your provider does this for you; writing it yourself lets you check its number and preview an upgrade.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-07-scenario-1',
          kind: 'scenario',
          title: 'Rosa’s card was declined on renewal',
          prompt: 'Choose the behaviour Paalala should have.',
          concept: 'failed payments',
          situation: 'Rosa has been a happy Studio customer for four months. Her renewal payment fails because her card expired. The provider sends invoice.payment_failed, and her subscription becomes past_due while the provider retries.',
          options: [
            { text: 'Keep her shop working for the 7-day grace period, email her a link to the billing portal to update the card, and drop the shop to Free (keeping all its data) only if it is still unpaid after that.', consequence: 'A genuine customer with an expired card gets a fair chance to fix it, you probably recover the payment, and nobody loses their data.', quality: 'best' },
            { text: 'Lock her out immediately and delete her bookings until she pays.', consequence: 'You punish a good customer for a routine problem and destroy her data, which she may never forgive and which could break your own rules about keeping data safe.', quality: 'poor' },
            { text: 'Ignore the failure and keep her on Studio forever until she notices.', consequence: 'You are now giving the product away, and a failed payment that nobody follows up on is revenue silently lost.', quality: 'poor' },
            { text: 'Drop her to Free right away and email her to say she is downgraded.', consequence: 'It is safe for your revenue but harsh: most failures are expired cards that are fixed within days, and an instant downgrade churns customers who would have paid.', quality: 'acceptable' },
          ],
          hints: [
            'Is a failed renewal usually a lost customer, or an expired card?',
            'Your spec already decided the grace period and what happens after it.',
            'Keep her working, tell her how to fix it, and only downgrade (never delete data) after the grace period.',
          ],
          explanation: 'Treat a failed payment as a likely accident. A grace period plus a clear link to fix it recovers money and keeps goodwill, and downgrading without deleting data keeps the product safe if she returns.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-07-q1',
        prompt: 'Rosa pays and the provider’s checkout redirects her to your /success page. What should unlock her new plan?',
        choices: [
          'The redirect itself, because it only happens after a payment succeeds',
          'A cookie that the success page sets in her browser',
          'The fact that the success page was opened within an hour of her pressing Upgrade',
          'A verified webhook from the provider saying the invoice was paid',
        ],
        answer: 3,
        explanation: 'Anyone can open the success URL and a paying customer may never reach it. Only a signed message from the provider, verified on your server, is trustworthy.',
      },
      {
        id: 'build-saas-ai-07-q2',
        prompt: 'Why must the webhook signature be checked over the raw request body rather than a parsed and re-printed copy?',
        choices: [
          'Re-printing the data can change spaces or key order, so the code you compute no longer matches the signature',
          'The raw body is much smaller than the parsed one, so checking it runs far faster and keeps the endpoint responsive',
          'Parsed bodies are always encrypted by the framework, so they cannot be signed in the way the provider signs them',
          'The provider signs only the headers and the timestamp, never the body, so the body does not matter for the check',
        ],
        answer: 0,
        explanation: 'The signature covers the exact bytes that were sent. Any change, even harmless-looking formatting, produces a different code and the check fails.',
      },
      {
        id: 'build-saas-ai-07-q3',
        prompt: 'The same “invoice paid” event is delivered to your endpoint twice. What is the correct design?',
        choices: [
          'Process both, since a second copy of a payment message is harmless and the result is the same as the first one',
          'Return an error for the second one so the provider learns it was a duplicate and stops sending any more of them',
          'Store each processed event id and acknowledge a repeat without doing the work a second time',
          'Wait one minute after each event and ignore anything that arrives during that time so that repeats are dropped',
        ],
        answer: 2,
        explanation: 'Providers can deliver an event more than once. Remembering processed ids makes the handler safe to repeat, and an acknowledgement (a 2xx) tells the provider you received it.',
      },
      {
        id: 'build-saas-ai-07-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does your own server store about a customer’s payment?',
        choices: [
          'The full card number, so your server can charge the card again next month without asking the provider to do it',
          'Only ids and statuses, such as a customer id and whether the subscription is active, while the card stays with the provider',
          'The card number in an encrypted file on your server that only you can read, with the key kept in your settings',
          'Nothing at all, not even whether the customer has paid, because the provider handles all of it on its own screens',
        ],
        answer: 1,
        explanation: 'The provider holds the card and carries the risk. Your server keeps only the references and the status it needs to decide what the customer may use.',
      },
      {
        id: 'build-saas-ai-07-q5',
        audience: { min: 'advanced' },
        prompt: 'A customer.subscription.updated event arrives before the subscription’s created event, and your handler assumes the order. What is the sturdier design?',
        choices: [
          'On each event, fetch the current subscription by id and write its state, recording the event id in the same transaction',
          'Add a delay of ten seconds to every handler so that earlier events are always processed before the later ones arrive',
          'Sort incoming events by their timestamp and discard any that are older than the last one you processed for that shop',
          'Ask the provider to guarantee in-order delivery for your account, then rely on that guarantee in every handler',
        ],
        answer: 0,
        explanation: 'Delivery order is not guaranteed and event timestamps can tie, so converge on the provider’s current state instead of applying deltas, and make processing idempotent with a recorded event id.',
      },
    ],
    task: {
      title: 'Wire billing in test mode and break it on purpose',
      steps: [
        'Create a payment provider account and switch to test mode. Create two plans (Studio and Shop) as recurring products, and keep the keys in environment variables, never in code.',
        'Ask your AI tool for hosted checkout, a webhook endpoint and a “Manage billing” button, using the webhook prompt. Use a test card from the provider’s testing page and watch the shop’s plan change only after the webhook arrives.',
        'Forge a delivery: send the endpoint a copy of an event with a wrong or missing signature and confirm it is refused and nothing is granted. Send a real test event twice and confirm it is processed once.',
        'Write down what your app shows when a shop reaches 20 reminders on Free.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain my webhook handler line by line with the letter-and-wax-seal idea, and tell me what each check protects against.” Fix anything its explanation shows you did not understand.'] },
      { audience: { min: 'advanced' }, steps: ['Put the event-id insert and the plan change in one transaction with a unique constraint, add a reconciliation script that compares your shops table to the provider’s subscriptions, and show it detecting a deliberately missed webhook.'] },
    ],
  },
  {
    id: 'build-saas-ai-08',
    day: 8,
    title: 'Emails, notifications and an admin view',
    summary: 'Plan the messages your product sends, set up email so it actually arrives, and build a protected admin view that you can trust.',
    minutes: 25,
    skills: ['observe-and-notify'],
    intro: {
      objectives: [
        'List the messages a SaaS must send and decide the channel and wording for each one',
        'Explain why the default email sender is only for testing and what authenticating your own domain adds',
        'Build an admin view that checks the admin role on the server and never exposes the secret key',
      ],
      why: 'Customers judge a SaaS by its messages: the sign-in link that never arrives or the payment failure nobody told them about ends the relationship quickly. And the moment you have customers, you need a safe way to see what is going on.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A SaaS talks to its customers all the time, and most of it is not marketing. These are **transactional** messages: sent because the customer did something, such as a sign-in link, a receipt, a “payment failed” notice or “you have used 18 of 20 reminders”. They are the product speaking. Before you build anything, write the list. A table like the one below takes ten minutes and prevents the usual launch-week surprise, where you discover no one told customers their card failed.',
      },
      {
        type: 'table',
        headers: ['Moment', 'Who receives it', 'Channel', 'What it must say'],
        rows: [
          ['Owner signs up', 'The owner', 'Email', 'A sign-in link that works once, and what happens next'],
          ['Reminder limit nearly reached (80%)', 'Owner and staff', 'In-app banner', 'How many are left and how to upgrade'],
          ['Reminder limit reached', 'Owner', 'In-app banner and email', 'Reminders have stopped; here is the upgrade button'],
          ['Payment failed', 'Owner', 'Email', 'Which card, and a link to the billing portal, with the date access ends'],
          ['Payment received', 'Owner', 'Email (from the provider)', 'A receipt: the provider sends this for you'],
          ['A reminder to a customer', 'The shop’s customer', 'SMS or email', 'Shop name, time, how to reach the shop; never other customers’ details'],
        ],
        caption: 'Write the table first. Each row becomes one message and one test.',
      },
      { type: 'heading', text: 'Getting email to actually arrive' },
      {
        type: 'paragraph',
        text: 'An **email service** sends the message for you; your app only asks it to. The trap is the starter setup. Supabase’s default email sender, for example, is meant for getting started: it sends only to addresses of your own team members and has a very low hourly limit, so on launch day your first real customers never receive their sign-in link. Before you launch, connect a proper sender (this is called **custom SMTP**: your own outgoing mail server, usually from an email service) and send from **your own domain**.',
      },
      {
        type: 'paragraph',
        text: 'Mailbox providers decide whether to trust a message using three checks on your domain, set up as records in your domain’s settings. **SPF** lists which servers may send mail for your domain. **DKIM** adds a digital signature to every message so it can be shown to be unchanged. **DMARC** tells receivers what to do with mail that fails those checks. Your email service gives you the exact records to paste in. Without them, even a correct message lands in spam. Keep sign-in and receipt emails separate from any future marketing email, so a spam complaint about marketing does not damage the messages customers rely on.',
      },
      {
        type: 'warning',
        text: 'Never put secrets or other people’s details in an email: no API keys, no full lists of customers, no “here is your password” messages. An email is stored in many places you do not control. Send a link that works once instead.',
      },
      {
        type: 'paragraph',
        text: 'Two habits from earlier lessons apply here. Sending must be **safe to repeat** (lesson 5): a retried job must not email the owner three times, so record what you sent and claim it before sending. And **log what you sent**, with the message type, the shop id and the time, so when an owner says “I never got it” you can answer.',
      },
      { type: 'heading', text: 'An admin view you can trust' },
      {
        type: 'paragraph',
        text: 'The day you have customers you need to see them: who signed up, which plan, who has a failed payment, how many reminders went out. An **admin view** is a page for you and your team only. It is also the most dangerous page in your product, because to be useful it can see every customer. Five rules keep it safe.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Check the admin role on the server, every time.** Hiding a menu item is not protection. Read the role from `app_metadata` or a protected table (lesson 4), never from data a user can edit.',
          '**Keep it separate** from the customer app: its own route (or its own small app), so a customer-facing bug cannot expose it.',
          '**Read-mostly.** Start with a summary that only reads. Add actions (refund, change plan) one at a time, each with a confirmation.',
          '**Never put the secret key in the browser.** The admin page loads its data on the server, with privileged access, only after the role check passes.',
          '**Keep an audit log** of who looked at or changed what, and show no more personal data than you need: shop names and counts, not customers’ phone numbers.',
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The admin request. The role check happens before any privileged query runs.',
        source: `sequenceDiagram
  participant B as Admin browser
  participant S as Your server
  participant D as Database
  B->>S: GET /admin (with the session)
  S->>S: verify the session, read the role
  S-->>B: 404 if the role is not admin
  S->>D: summary query (privileged key, server side)
  D-->>S: counts and statuses
  S->>S: write an audit log entry
  S-->>B: the summary page`,
      },
      {
        type: 'prompt',
        label: 'An admin view prompt that bakes the rules in',
        text: 'Add an /admin page that shows: shops created per day for the last 14 days, each shop\'s plan, shops with a failed payment, and reminders sent this month per shop. Rules: on the server, verify the session and require app_metadata.role === "admin" before running any query, and return a 404 otherwise; query with the secret key only in server code; show shop names and counts, never customers\' names or phone numbers; write an audit log row for every admin page view; make it read-only. Add tests: a signed-out request gets 404, a normal member gets 404, an admin gets 200.',
      },
      {
        type: 'version',
        text: 'Supabase’s custom SMTP page says its default email service only sends to addresses belonging to your organization’s team members, allows a very low number of messages per hour that can change without notice, offers no uptime guarantee, and is meant for getting started rather than production; it urges you to set up custom SMTP, recommends a custom domain with DKIM, DMARC and SPF records, and advises keeping authentication email separate from marketing email. Once custom SMTP is set, a default hourly limit applies that you can change on its rate-limits page. Limits are defaults and change, so read the page when you set up.',
        checked: CHECKED,
        sources: [DOCS.supabaseSmtp, DOCS.supabaseRls],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of your product as a small shop with a front counter and a back office. Emails are the notes you hand customers across the counter: a receipt, a “your order is ready”. If you hand notes through a rented mailbox that only delivers to your own family (the default sender), customers never get them, so you set up proper mail from your own shop address. SPF, DKIM and DMARC are like a business licence, a signature and a rule about forged notes: together they prove a note really came from you. The admin view is the back office. It holds everything, so the door has a lock you check on every visit (the server checking the admin role), and you keep a visitors’ book (the audit log) of who went in.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat outbound email as a product surface with its own failure modes: bounces and complaints need handling (suppress addresses that hard-bounce), message sends need idempotency keys and an outbox table so a crash between “record” and “send” cannot lose or duplicate mail, and templates deserve tests for missing variables. Separate sending streams (transactional vs marketing) by subdomain to protect reputation, publish DMARC at monitoring first and tighten once reports are clean, and watch delivery and bounce rates. For the admin surface, prefer a separate deployment or route group with its own auth policy and short sessions, require multi-factor sign-in, log reads as well as writes, and make any “impersonate a customer” feature a deliberate, time-limited, audited exception rather than a default capability.',
      },
      {
        type: 'takeaways',
        items: [
          'Write the table of messages first: moment, who receives it, channel and what it must say.',
          'The default email sender is for testing; connect custom SMTP and authenticate your own domain with SPF, DKIM and DMARC before launch.',
          'Never email secrets or other customers’ details, and make sending safe to repeat and logged.',
          'An admin view must verify the admin role on the server every time, keep the secret key off the browser, stay read-mostly and keep an audit log.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-08-code-challenge-1',
          kind: 'code-challenge',
          title: 'The usage banner',
          prompt: 'Write `usageMessage(used, limit)` for the in-app banner. Under 80% of the limit, return an empty string. From 80% up to (but not including) the limit, return `You have used X of Y reminders`. At or over the limit, return `Limit reached: upgrade to keep sending`. Use the numbers in the message, as shown.',
          concept: 'plan-limit messages',
          language: 'javascript',
          starter: `function usageMessage(used, limit) {
  // return the banner text
}`,
          tests: {
            kind: 'function',
            fn: 'usageMessage',
            cases: [
              { args: [10, 20], expected: '', label: 'plenty left' },
              { args: [15, 20], expected: '', label: 'just under 80%' },
              { args: [16, 20], expected: 'You have used 16 of 20 reminders', label: 'exactly 80%' },
              { args: [19, 20], expected: 'You have used 19 of 20 reminders', label: 'one left' },
              { args: [20, 20], expected: 'Limit reached: upgrade to keep sending', label: 'at the limit' },
              { args: [25, 20], expected: 'Limit reached: upgrade to keep sending', label: 'over the limit' },
            ],
          },
          solution: `function usageMessage(used, limit) {
  if (used >= limit) return 'Limit reached: upgrade to keep sending';
  if (used >= limit * 0.8) return 'You have used ' + used + ' of ' + limit + ' reminders';
  return '';
}`,
          hints: [
            'Check the most serious case first: at or over the limit.',
            'The warning starts when used is at least 80% of limit, which is limit * 0.8.',
            'Test used >= limit first, then used >= limit * 0.8, then return an empty string.',
          ],
          explanation: 'Checking from the strictest case down keeps each rule simple. Messages at the limit should tell the customer what to do, not just what went wrong.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-08-scenario-1',
          kind: 'scenario',
          concept: 'reliable sign-in emails',
          title: 'Nobody’s sign-in link arrives',
          prompt: 'Choose the most likely cause and fix.',
          situation: 'Launch morning. Five owners from your waitlist try to sign in to Paalala. Your own test emails always worked, but none of the five received a sign-in link. You are still using the starter email setup that came with your project.',
          options: [
            { text: 'The starter sender only delivers to your team’s own addresses and is rate-limited. Connect custom SMTP from an email service, send from your own domain with SPF, DKIM and DMARC set, and resend the links.', consequence: 'Messages now go to everyone and are trusted by mailbox providers. You also have a delivery log to check the next time someone says nothing arrived.', quality: 'best' },
            { text: 'Tell the five owners to check their spam folders and try again.', consequence: 'The messages were never sent, so there is nothing in spam to find. You lose launch-day goodwill for something fixable.', quality: 'poor' },
            { text: 'Switch sign-in to a password so no email is needed.', consequence: 'You avoid sign-in email, but you still need email for resets, receipts and payment failures, and you added work on launch day instead of fixing the cause.', quality: 'acceptable' },
            { text: 'Add your five customers’ addresses to the team so the starter sender will deliver to them.', consequence: 'It works for those five today, and it gives outsiders team access that you did not intend. The next customer fails again.', quality: 'poor' },
          ],
          hints: [
            'Why did your own addresses work but strangers’ did not?',
            'The starter setup is meant for testing with your own team.',
            'Set up custom SMTP and authenticate your domain before inviting real customers.',
          ],
          explanation: 'The starter sender is built for tests. Moving to your own authenticated sender before launch is a normal checklist item; skipping it makes the first real customers your test.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-08-match-1',
          kind: 'match',
          title: 'Which safeguard is missing?',
          prompt: 'Each problem shows one safeguard that was skipped. Match the problem to the safeguard.',
          concept: 'messages and admin safeguards',
          labels: { terms: 'What went wrong', meanings: 'The safeguard that was skipped' },
          pairs: [
            { term: 'Mail from your domain lands in spam because receivers cannot tell it is really yours.', definition: 'Authenticating the domain with SPF, DKIM and DMARC', note: 'These records prove which servers may send as your domain.' },
            { term: 'A retried job emailed the owner the same “payment failed” notice three times.', definition: 'Claiming a send before doing it, so repeats do nothing', note: 'Recording a send first makes the job safe to run twice.' },
            { term: 'A customer opened /admin by typing the address and saw every shop’s plan.', definition: 'Checking the admin role on the server before any query', note: 'Hiding a menu link is not protection.' },
            { term: 'Nobody can tell which admin changed an owner’s plan last week.', definition: 'An audit log of who viewed or changed what', note: 'An audit log answers who did what and when.' },
          ],
          hints: [
            'Ask whether the problem is about trust in the sender, repeating, access or accountability.',
            'Repeating a message three times is the “run twice” problem from lesson 5.',
            'The customer who typed /admin shows the server never checked the role.',
          ],
          explanation: 'Each safeguard answers one specific failure. Combining them keeps messages delivered, sent once, and shown only to the people who should see them.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-08-q1',
        prompt: 'Your starter email setup sends your own test emails fine, but real customers receive nothing. What should you do before launch?',
        choices: [
          'Ask customers to add your sending address to their contacts, so that the starter sender is trusted by their inbox',
          'Wait for the mailbox providers to learn over a few weeks that your messages are safe and start delivering them',
          'Connect a real email sender (custom SMTP) and authenticate your own domain with SPF, DKIM and DMARC records',
          'Send every message twice, from two different addresses, so that at least one of the copies reaches the inbox',
        ],
        answer: 2,
        explanation: 'Starter senders are for testing with your team and are rate-limited. A proper sender with an authenticated domain is what makes messages arrive and be trusted.',
      },
      {
        id: 'build-saas-ai-08-q2',
        prompt: 'What is the right way to protect an /admin page?',
        choices: [
          'Hide the link to it in the customer menu so customers do not find it',
          'Check in the browser’s code that the user’s name is yours before drawing the page',
          'Put the page at an unusual address that is hard to guess',
          'Verify the session and the admin role on the server before running any query',
        ],
        answer: 3,
        explanation: 'Hidden links and secret addresses are not controls: anyone can type an address. The server must refuse every request without the admin role.',
      },
      {
        id: 'build-saas-ai-08-q3',
        prompt: 'Which of these should never appear in an email to a customer?',
        choices: [
          'The name of their shop and the date of their next billing, which they need to plan their month',
          'A one-time sign-in link that expires, or an API key or a password written out in plain text',
          'A link to the billing portal, where they can update their card or cancel the subscription themselves',
          'A receipt for a payment, sent by the payment provider with the amount and the invoice number',
        ],
        answer: 1,
        explanation: 'Email is stored in many places you do not control. Send a one-time link, never a secret like a key or a password.',
      },
      {
        id: 'build-saas-ai-08-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a “transactional” message?',
        choices: [
          'A message the product sends because the customer just did something, like a sign-in link or a receipt',
          'A message that advertises a new feature to everyone on your list, whether they have used the product or not',
          'A message sent only between you and your developers when a deploy has failed or a job has crashed in the night',
          'A message that is always sent by text and never by email, because text messages arrive more reliably',
        ],
        answer: 0,
        explanation: 'Transactional messages are triggered by what the customer did, such as signing up or paying. They are part of the product itself, not advertising.',
      },
      {
        id: 'build-saas-ai-08-q5',
        audience: { min: 'advanced' },
        prompt: 'Your sending job crashed between “record that we sent the receipt email” and actually sending it. Which design avoids both lost and duplicate mail?',
        choices: [
          'Always send first and never record anything, accepting an occasional duplicate for the sake of keeping the code simple',
          'An outbox table written in the same transaction as the change; a separate sender picks pending rows, with an idempotency key',
          'Run the whole job twice every time, with a short pause in between, to make sure at least one send happens',
          'Record that you sent the email first, and never retry if the actual send to the provider fails for any reason',
        ],
        answer: 1,
        explanation: 'An outbox makes the intent durable in the same transaction as the change, and a separate retrying sender with an idempotency key avoids losing messages or sending them twice.',
      },
    ],
    task: {
      title: 'Write the message table and protect the admin page',
      steps: [
        'Write your own table of messages (moment, who, channel, what it must say) for your product, with at least six rows including a failed payment and a limit reached.',
        'Connect a real email sender and send a sign-in link to an address that is not yours. Note where in your email service the SPF and DKIM records are checked.',
        'Use the admin prompt to build /admin. Test it as a signed-out visitor, as a normal member and as an admin. Only the admin should see the page.',
        'Open your admin page’s source and network traffic and confirm the secret key does not appear anywhere.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain SPF, DKIM and DMARC with an everyday example, and show me where I would find the records my email service wants me to add.” Write the three definitions in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Add an outbox table and a retrying sender with an idempotency key, suppress hard-bounced addresses, and add a test that kills the sender mid-batch and shows no duplicate and no lost message.'] },
    ],
  },
  {
    id: 'build-saas-ai-09',
    day: 9,
    title: 'Know what is happening: analytics and error tracking',
    summary: 'Choose the few numbers that tell you whether the product works, and set up error tracking that tells you about problems before customers do.',
    minutes: 25,
    skills: ['observe-and-notify'],
    intro: {
      objectives: [
        'Pick a small set of product events that answer real questions, and keep personal data out of them',
        'Calculate a simple funnel and churn rate, and say what each number tells you',
        'Explain what error tracking records and what you should do when an alert arrives',
      ],
      why: 'After launch you are blind: you cannot see a customer struggling, a failing reminder job or a signup form that is broken. A handful of well-chosen numbers and an error alert turn guessing into knowing, cheaply.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Two kinds of tools help you see your product. **Analytics** tells you what people *do*: which pages they visit, whether they finish signing up, whether they add their first booking. **Error tracking** tells you what *breaks*: a reminder job that crashed, a page that failed for one customer. You need both, and you need them before launch day, because the first week’s problems are the ones you most want to catch. The trap is collecting everything. A pile of charts nobody reads is no better than none. Start from questions.',
      },
      {
        type: 'paragraph',
        text: 'For Paalala the central question is: **does a new shop get value quickly?** Value, for this product, is a first booking that gets a reminder. That moment is called **activation**: the first time a new customer experiences what you promised. Everything else follows from it. A shop that signs up but never adds a booking is not a customer yet; it is a lost one waiting to happen.',
      },
      { type: 'heading', text: 'A funnel and a few events' },
      {
        type: 'paragraph',
        text: 'A **funnel** counts how many people reach each step on the way to paying, and how many drop off between steps. For Paalala: visit the site, sign up, add a first booking, receive the first reminder, upgrade to a paid plan. You measure it with a few **events**: small named records sent when something happens, each with a name and a few properties. Keep the names plain and the list short.',
      },
      {
        type: 'table',
        headers: ['Event name', 'Sent when', 'Safe properties'],
        rows: [
          ['signed_up', 'A new account is created', 'plan, source (how they found you)'],
          ['booking_created', 'A booking is saved', 'shop id, whether it is the shop’s first'],
          ['reminder_sent', 'A reminder goes out', 'shop id, channel (sms or email)'],
          ['upgraded', 'The webhook sets a paid plan', 'from plan, to plan'],
        ],
        caption: 'Four events answer the central question. Add more only when you have a question they cannot answer.',
      },
      {
        type: 'warning',
        text: 'Keep personal data out of events: no email addresses, names or phone numbers. Use an id instead. Analytics tools are third-party services, privacy law applies to what you send them, and AI tools love to add “helpful” properties such as the user’s email. Read every track call in a generated change.',
      },
      { type: 'heading', text: 'The numbers that matter' },
      {
        type: 'list',
        items: [
          '**Step conversion:** of the people who reached one step, the share who reached the next (sign-ups divided by visits, first bookings divided by sign-ups). The biggest drop is where to look first.',
          '**Activation rate:** the share of new shops that reach the first reminder within, say, three days.',
          '**MRR (monthly recurring revenue):** the total of what all active subscriptions pay per month.',
          '**Churn:** the share of paying customers who cancel in a month. If 4 of 40 cancel, monthly churn is 10%. High churn means the product is not keeping its promise, and it makes growth very hard.',
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The Paalala funnel. Each arrow is a step conversion; the weakest arrow is the first thing to fix.',
        source: `flowchart LR
  A[Visit] --> B[Sign up]
  B --> C[First booking]
  C --> D[First reminder sent]
  D --> E[Upgrade to a paid plan]`,
      },
      { type: 'heading', text: 'Error tracking' },
      {
        type: 'paragraph',
        text: 'An **error tracker** is a small piece of code in your app that catches problems and sends a report to a dashboard: what failed, the **stack trace** (the chain of code that led to it), which page or job, which version of your app, and who it affected (an id, not a name). It groups the same error together, so a thousand identical failures are one item, and it alerts you the first time a new one appears. Many tools do this; choose one and wire it in before launch. Version tags matter: the report should say *which release* broke, so you can tell whether your last deploy caused it.',
      },
      {
        type: 'paragraph',
        text: 'Add two more cheap safety nets. A **health check** is an address such as `/health` that answers “ok” only if the app can reach its database; an outside **uptime monitor** calls it every minute and tells you when it stops answering. And write **structured logs** for the jobs that matter (the reminder job logs how many bookings it found, claimed and sent), with the shop id but no secrets, so you can answer “what happened at 8:05?” without guessing. Decide in advance what each alert means and who looks at it. An alert nobody owns is noise.',
      },
      {
        type: 'prompt',
        label: 'An instrumentation prompt with privacy built in',
        text: 'Add product analytics and error tracking to my app. Analytics: send only these events: signed_up, booking_created, reminder_sent, upgraded, with the properties in the table in SPEC.md. Never send emails, names or phone numbers; use ids. Error tracking: capture unhandled errors in the browser, server routes and the reminder job, tag each report with the app version and shop id (not the person\'s name), and strip request bodies. Add a /health route that checks the database. List every call that sends data to a third party and what it contains.',
      },
      {
        type: 'version',
        text: 'Vercel’s Web Analytics docs say it stores only anonymized data, does not use cookies (a visitor is identified by a hash created from the request, valid for one day, so visitors cannot be tracked across days or sites), does not count traffic from automated processes, and supports custom events and feature-flag usage. Other analytics and error-tracking tools differ in what they collect, where data is stored and how consent works, so read the privacy settings of whichever you choose and check the rules that apply where your customers live.',
        checked: CHECKED,
        sources: [DOCS.vercelAnalytics],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of a food stall. Analytics is counting how many people walk past, how many stop, how many buy and how many come back tomorrow: the numbers show where people give up. Error tracking is a bell that rings when something breaks, like the gas running out, and tells you what and when, so you fix it before queues form. A *funnel* is just those steps in a row (walk past, stop, buy, return). *Churn* is the share of regular customers who stop coming each month. And *personal data* means anything that points to a real person, like a phone number. You count people with a number or an id, never with their name on the tally sheet.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Define each metric as a query over events with exact windows (activation within 72 hours of signup, churn as cancellations in the period divided by active at its start) and keep the definitions in the repository so numbers do not drift. Instrument on the server for money and activation events, where blockers cannot drop them, and keep client events for behaviour. Sample or aggregate to control cost, set retention, and respect consent signals. For errors, upload source maps per release, scrub PII before send, and route alerts by severity with an owner and an expected response; tie alert thresholds to symptoms customers feel (reminders late by more than ten minutes) rather than to causes. Trace a request across the web app, jobs and webhook handler with a shared request id so one customer’s problem is reproducible from logs.',
      },
      {
        type: 'takeaways',
        items: [
          'Analytics shows what people do; error tracking shows what breaks. Start from questions, not from collecting everything.',
          'Activation, the first time a new customer gets the value you promised, is the central metric: for Paalala, a first booking that receives a reminder.',
          'Send a few clearly named events with ids, never personal data such as emails, names or phone numbers.',
          'Read the funnel step by step, and watch churn: the share of paying customers who cancel in a month.',
          'Wire in error tracking, a health check and structured logs before launch, and decide who owns each alert.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-09-code-challenge-1',
          kind: 'code-challenge',
          title: 'Read the funnel',
          prompt: 'Write `stepConversion(counts)`. `counts` is an array of how many people reached each step, in order, for example `[100, 40, 20, 5]`. Return an array with the percentage of the previous step that reached each next step, rounded to a whole number with `Math.round`. `[100, 40, 20, 5]` gives `[40, 50, 25]`.',
          concept: 'funnel conversion',
          language: 'javascript',
          starter: `function stepConversion(counts) {
  // return one percentage for each step after the first
}`,
          tests: {
            kind: 'function',
            fn: 'stepConversion',
            cases: [
              { args: [[100, 40, 20, 5]], expected: [40, 50, 25], label: 'the example' },
              { args: [[200, 50]], expected: [25], label: 'two steps' },
              { args: [[3, 1, 1]], expected: [33, 100], label: 'rounding' },
              { args: [[50]], expected: [], label: 'one step has no conversion' },
            ],
          },
          solution: `function stepConversion(counts) {
  const result = [];
  for (let i = 1; i < counts.length; i++) {
    result.push(Math.round((counts[i] / counts[i - 1]) * 100));
  }
  return result;
}`,
          hints: [
            'Each result compares one step with the step just before it.',
            'Start the loop at index 1 and divide counts[i] by counts[i - 1].',
            'Push Math.round((counts[i] / counts[i - 1]) * 100) for each i from 1.',
          ],
          explanation: 'A funnel reads as a chain of ratios between neighbouring steps. The smallest percentage is the place to investigate first.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-09-fix-bug-1',
          kind: 'fix-bug',
          title: 'The event that carried an email',
          prompt: 'An AI added this analytics event. Anyone looking at your analytics tool can now read customers’ email addresses. Tap the line that sends personal data, then choose the fix that keeps the plan and removes the email.',
          concept: 'privacy in analytics',
          language: 'javascript',
          code: `function signupEvent(user) {
  return { name: 'signed_up', props: { email: user.email, plan: user.plan } };
}`,
          bugLine: 2,
          fixes: [
            { line: '  return { name: \'signed_up\', props: { plan: user.plan } };', correct: true, why: 'The event keeps the useful, non-personal property (the plan) and drops the email entirely.' },
            { line: '  return { name: \'signed_up\', props: { email: user.email.toLowerCase(), plan: user.plan } };', correct: false, why: 'Changing the capitals does nothing about the privacy problem: the email is still in the event.' },
            { line: '  return { name: \'signed_up\', props: { plan: user.plan, user: user.email } };', correct: false, why: 'Renaming the property to “user” still sends the email address, only under a different name.' },
            { line: '  return { name: \'signed_up\', props: {} };', correct: false, why: 'This removes the email but also loses the plan, which the table says is a safe and useful property.' },
          ],
          tests: {
            kind: 'function',
            fn: 'signupEvent',
            cases: [
              { args: [{ email: 'rosa@example.com', plan: 'free' }], expected: { name: 'signed_up', props: { plan: 'free' } }, label: 'no email in the event' },
              { args: [{ email: 'ben@shop.ph', plan: 'studio' }], expected: { name: 'signed_up', props: { plan: 'studio' } }, label: 'plan is kept' },
            ],
          },
          hints: [
            'Look at what is inside props.',
            'The plan is fine to send; the email is personal data and must not go.',
            'Keep only plan: user.plan in props.',
          ],
          explanation: 'Events should describe what happened, using ids and categories, not who the person is. Remove anything personal at the source, and check every tracking call an AI adds.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-09-scenario-1',
          kind: 'scenario',
          title: 'Forty sign-ups, three bookings',
          prompt: 'Choose your first move.',
          concept: 'reading product numbers',
          situation: 'Two weeks after launch you have 40 sign-ups, but only 3 shops have added a booking and none has upgraded. Visits to the landing page are healthy. You are tempted to build the calendar sync that two people asked for.',
          options: [
            { text: 'Look at the weak step: sign-up to first booking. Watch a few new shops try it (or read the events around their sessions), find where they stop, and fix that before adding anything.', consequence: 'Almost all of the drop is at one step. Fixing it raises activation, which everything else depends on, and it costs much less than a new feature.', quality: 'best' },
            { text: 'Build the calendar sync, since real customers asked for it.', consequence: 'Two requests are not forty silent sign-ups. You may add weeks of work while most people still do not reach their first booking.', quality: 'poor' },
            { text: 'Start paid ads to get more sign-ups.', consequence: 'More people will fall into the same leak. You pay to lose them at the step that is already failing.', quality: 'poor' },
            { text: 'Email the 37 shops that never added a booking and ask what stopped them.', consequence: 'A very good idea that also gives you real answers. It works best together with looking at where they stopped, so you ask better questions.', quality: 'acceptable' },
          ],
          hints: [
            'Where in the funnel is the biggest drop?',
            'Activation (the first booking) is what everything else depends on.',
            'Fix the weak step before adding features or buying traffic.',
          ],
          explanation: 'Numbers are for choosing what to fix. A big drop between sign-up and the first booking means new shops do not reach the value you promised, so that is the problem to solve first.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-09-q1',
        prompt: 'Which pair of events best measures whether a new shop gets value?',
        choices: [
          'signed_up and booking_created, with the first booking marked',
          'page_viewed and button_clicked for every button on every page',
          'email_opened and link_clicked for every newsletter',
          'logged_in and logged_out for every visit',
        ],
        answer: 0,
        explanation: 'Value for Paalala is the first booking: sign-up followed by a first booking measures activation directly. The others measure activity that does not show whether the promise was delivered.',
      },
      {
        id: 'build-saas-ai-09-q2',
        prompt: '4 of your 40 paying shops cancel this month. What is monthly churn, and what does it suggest?',
        choices: [
          '4%, so growth is fine because it is a small number and most of the customers have stayed with you',
          '36%, because that is the share of the customers who stayed and kept paying during the month',
          '10%, and a rate like that suggests the product is not keeping its promise for some customers',
          '40%, because churn counts every shop you have rather than only the ones who left in the month',
        ],
        answer: 2,
        explanation: 'Churn is cancellations divided by customers at the start: 4 of 40 is 10%. Ten percent a month is high, so find out why they leave before spending on growth.',
      },
      {
        id: 'build-saas-ai-09-q3',
        prompt: 'What does an error tracker add that plain server logs often do not?',
        choices: [
          'It groups the same error together, records the app version and context, and alerts you the first time a new one appears',
          'It guarantees the error will never happen again once the first report has been sent to the dashboard',
          'It fixes the bug in your code automatically overnight and opens a pull request that you only need to merge',
          'It replaces the need to test the app before a release, because every problem will be caught after launch anyway',
        ],
        answer: 0,
        explanation: 'Grouping, version and context, and alerting on new errors are the point. It does not prevent errors or fix them for you.',
      },
      {
        id: 'build-saas-ai-09-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is “personal data” that should stay out of analytics events?',
        choices: [
          'The name of the plan a shop chose, which tells you how many shops are on each plan',
          'The number of bookings a shop added today, which tells you whether the shop is using the product',
          'Anything that points to a real person, like an email address or a phone number',
          'The version number of your app at the moment the event was sent, which helps you find broken releases',
        ],
        answer: 2,
        explanation: 'Personal data identifies a real person. Use ids and categories instead, so the events describe what happened without saying who it was.',
      },
      {
        id: 'build-saas-ai-09-q5',
        audience: { min: 'advanced' },
        prompt: 'Your reminder job fails silently for two hours and no alert fires, though CPU and error rates look normal. What is the best alerting change?',
        choices: [
          'Raise the error-rate threshold so you are paged less often and only for the worst failures that customers notice',
          'Alert on the symptom customers feel, such as bookings due but unsent for ten minutes, as well as on causes',
          'Only check the dashboard by hand every morning, since a person reading charts catches more than an alarm does',
          'Add more detailed logging and review it once a week, so that the cause is easier to find after the damage is done',
        ],
        answer: 1,
        explanation: 'A silent failure produces no error, so cause-based alerts miss it. A symptom alert on the business outcome (due but unsent reminders) catches any cause.',
      },
    ],
    task: {
      title: 'Instrument four events and one alert',
      steps: [
        'Decide your central question (for Paalala: does a new shop get its first reminder quickly?) and write the four events that answer it.',
        'Use the instrumentation prompt to add the events and error tracking. Read every tracking call in the diff and remove any personal data.',
        'Add a /health route and connect an uptime monitor to it. Then break the database connection on purpose and confirm you get an alert.',
        'Write down who owns each alert and what they do first.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain funnel, activation and churn with the example of a juice stall, then calculate them for these made-up numbers: 100 visitors, 20 sign-ups, 6 first bookings.” Check its percentages by hand.'] },
      { audience: { min: 'advanced' }, steps: ['Write the metric definitions (activation within 72 hours, monthly churn) as saved queries in the repo, send money and activation events from the server, and add a symptom alert for due-but-unsent reminders with a test that triggers it.'] },
    ],
  },
  {
    id: 'build-saas-ai-10',
    day: 10,
    title: 'The security checklist',
    summary: 'Walk the short list of mistakes that sink small SaaS products, check an AI-built app against it, and fix what you find.',
    minutes: 28,
    skills: ['security-checklist'],
    intro: {
      objectives: [
        'Name the main kinds of web security failure and where each one shows up in your own product',
        'Spot a database query built by joining text, and replace it with a parameterised one',
        'Run a review checklist over an AI-built app before customers use it',
      ],
      why: 'AI writes working code fast, and working is not the same as safe. You do not need to be a security expert to stop the common failures: you need a list, the habit of using it, and the courage to find problems before a customer does.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Security can feel like an endless subject, but the failures that actually hurt small products are few and repetitive. The **OWASP Top 10** is a widely used list of the most serious web application risks, written by an open community and updated every few years; the 2025 edition is current. Its first entry is **Broken Access Control**: someone can do or see something they should not. You have already met it. Ben reading Rosa’s bookings in lesson 6 is the textbook case, and it is first on the list because it is so common. This lesson turns the list into a checklist you can apply to Paalala (and to the course AI Coding Security and Best Practices goes much deeper).',
      },
      {
        type: 'table',
        headers: ['Risk (OWASP Top 10:2025)', 'What it looks like in Paalala', 'Your check'],
        rows: [
          ['A01 Broken Access Control', 'Shop B reads or changes shop A’s bookings; a normal member opens /admin', 'RLS on every table and the two-customer test (lesson 6); server checks the admin role (lesson 8)'],
          ['A02 Security Misconfiguration', 'A table with RLS left off, a public storage bucket, debug mode in production', 'Walk every table and setting; production has debug off'],
          ['A03 Software Supply Chain Failures', 'An AI suggests a package that does not exist, or one with a look-alike name', 'Check every new package in the official registry before installing'],
          ['A05 Injection', 'A customer name typed into a search box runs as database code', 'Parameterised queries, never joined text'],
          ['A07 Authentication Failures', 'Sign-in endpoints with no rate limit; a session trusted without verification', 'Verify sessions on the server (lesson 4); limit attempts'],
          ['A09 Security Logging & Alerting Failures', 'Payment webhooks fail for days and nobody notices', 'Error tracking, alerts and logs without secrets (lesson 9)'],
        ],
        caption: 'The names are from the OWASP Top 10:2025 introduction; the middle column is how each looks in this product.',
      },
      { type: 'heading', text: 'Injection, shown for real' },
      {
        type: 'paragraph',
        text: '**Injection** happens when text from a user is treated as *instructions* instead of as *data*. The classic case is **SQL injection**: code builds a database command by joining strings, and a clever input changes the command. AI tools still generate this when you ask for “a quick search”. We ran it against a real PostgreSQL with a table holding customers of two shops, using the search text `x\' or \'1\'=\'1` (a quote, then “or 1 equals 1”):',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real psql output: the same search, built two ways',
        code: `--- normal search: name = Maria ---
 Maria                                         (1 row)

--- the query built by joining text, with the name  x' or '1'='1 ---
 Maria
 Jose
 Paolo                                         (3 rows)   <- Paolo belongs to the other shop

--- parameterised: the same text sent as a value ---
                                               (0 rows)`,
      },
      {
        type: 'paragraph',
        text: 'The joined version turned the user’s text into part of the command, so it returned every customer of every shop. The parameterised version sent the same text as a plain *value* to match against a name, found no such name, and returned nothing. The fix is mechanical: write the command once with placeholders (`$1`, `$2`) and pass the values separately. Almost every database library supports this, and an AI will do it if you tell it to. Never build a command with `+` or template strings around user input.',
      },
      { type: 'heading', text: 'Supply chain: the package that does not exist' },
      {
        type: 'paragraph',
        text: 'Your app is built from hundreds of packages written by strangers. AI models sometimes suggest a package whose name sounds right but does not exist, and attackers register such names, or look-alike spellings, hoping a developer installs them. OWASP’s 2025 list gives this its own entry (Software Supply Chain Failures). Before you install anything an AI suggests, search the official registry for the exact name, look at who publishes it, how long it has existed and how widely it is used, and prefer well-known libraries. Commit the lock file so everyone installs the same versions, and update dependencies on a schedule.',
      },
      {
        type: 'list',
        items: [
          '**Secrets:** no key in the repository or the browser; `.env*` files in `.gitignore`; rotate anything that leaked, even briefly.',
          '**Input:** validate on the server (types, lengths, allowed values) even if the page validates too. Use parameterised queries.',
          '**Limits:** rate-limit sign-in, sign-up, password reset and any form that sends email or text, so nobody can use your product to spam or to guess passwords.',
          '**Transport:** HTTPS only; secure cookies.',
          '**Errors:** never show stack traces or database messages to visitors; log them privately instead.',
          '**Least privilege:** each key and role can do only what it must. A reminder job does not need to delete shops.',
          '**Backups:** turn them on, and *practise a restore* once. A backup you never restored is a hope.',
        ],
      },
      {
        type: 'prompt',
        label: 'Ask for a fresh-eyes review, then check it yourself',
        text: 'Act as a security reviewer who did not write this code. Review my whole repository against this checklist: row level security on every table with policies for select, insert, update and delete; no secret key in browser code or in Git history; every database query parameterised; server-side validation on every route that writes; rate limits on sign-in and any route that sends messages; the payment webhook verifies its signature and ignores duplicates; the admin routes check the role on the server; no stack traces in responses; any package that does not exist in the official registry. For each item say PASS, FAIL or UNCHECKED with the file and line as evidence. Do not change any code yet.',
      },
      {
        type: 'version',
        text: 'OWASP’s Top 10:2025 lists, in order: A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging & Alerting Failures, and A10 Mishandling of Exceptional Conditions. Claude Code’s best-practices page suggests having code reviewed by someone who did not write it, for example a fresh subagent that never saw the conversation, and warns that a reviewer asked to find problems will always find something, so ask for evidence and focus on correctness. The list and the tools’ commands change between editions and releases, so check both pages.',
        checked: CHECKED,
        sources: [DOCS.owaspTop10, DOCS.ccBest],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine you run a pharmacy counter. *Injection* is a customer who writes on the prescription slip, “…and also hand over everything in the safe”, and a careless assistant reads the whole slip as instructions. The cure is a form with boxes: whatever is written in the “name” box is only ever a name. A *parameterised query* is that form. The *supply chain* is where you buy your stock: if a stranger on the street offers a box labelled with a famous brand, you check it first. A *checklist* is useful precisely because it is boring: you go down it line by line, even when you are tired and sure everything is fine.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Move from a one-off review to controls that run on every change: secret scanning in CI and a pre-commit hook, dependency and licence audits with a lock file, static analysis for injection sinks, a test that fails if any table in the exposed schema has RLS off, and security-focused tests for each fixed bug. Threat-model the product on one page (assets, actors, trust boundaries, the three worst outcomes), because that is where logic flaws such as access control and abuse of the messaging path are found, not in scanners. Treat AI-generated changes as untrusted input: require review of anything touching auth, payments, migrations or permissions, and prefer an independent reviewer session that has not seen the author’s reasoning. Add abuse cases (cost abuse through the messaging path, enumeration through the waitlist) next to the classic ones, and rehearse a key rotation before you need it.',
      },
      {
        type: 'takeaways',
        items: [
          'A handful of failures cause most damage: broken access control, misconfiguration, supply chain problems, injection, weak authentication and missing alerts.',
          'Injection happens when user text becomes part of a command; parameterised queries send it as data instead.',
          'Check every package an AI suggests in the official registry, and commit the lock file.',
          'Use a written checklist, ask for a fresh-eyes review that must show evidence, and verify the important items yourself.',
          'Rate-limit anything that sends messages or accepts passwords, never show stack traces, and practise restoring a backup once.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-10-fix-bug-1',
          kind: 'fix-bug',
          title: 'Search that returns other shops’ customers',
          prompt: 'An AI wrote this customer search by joining text. Tap the line that builds the command from user input, then choose the parameterised fix. (`values` are passed to the database separately from `text`.)',
          concept: 'parameterised queries',
          language: 'javascript',
          code: `function findCustomerQuery(shopId, name) {
  return { text: "select * from customers where shop_id = '" + shopId + "' and name = '" + name + "'", values: [] };
}`,
          bugLine: 2,
          fixes: [
            { line: '  return { text: \'select * from customers where shop_id = $1 and name = $2\', values: [shopId, name] };', correct: true, why: 'The command is fixed text with two placeholders and the user’s text travels only as a value, so it can never change the command.' },
            { line: '  return { text: \'select * from customers where shop_id = $1 and name = $2\', values: [name, shopId] };', correct: false, why: 'The placeholders are right, but the values are in the wrong order, so the shop id is compared with the name and the name with the shop id.' },
            { line: '  return { text: \'select * from customers where shop_id = \\\'\' + shopId + \'\\\' and name = $1\', values: [name] };', correct: false, why: 'Only the name is parameterised. The shop id is still joined into the command, so the same attack works through it.' },
            { line: '  return { text: \'select * from customers where shop_id = $1 and name = $2\', values: [] };', correct: false, why: 'The placeholders have no values behind them, so the command cannot run and the search finds nothing.' },
          ],
          tests: {
            kind: 'function',
            fn: 'findCustomerQuery',
            cases: [
              { args: ['s1', 'Maria'], expected: { text: 'select * from customers where shop_id = $1 and name = $2', values: ['s1', 'Maria'] }, label: 'plain name' },
              { args: ['s1', "x' or '1'='1"], expected: { text: 'select * from customers where shop_id = $1 and name = $2', values: ['s1', "x' or '1'='1"] }, label: 'hostile text stays a value' },
            ],
          },
          hints: [
            'Look at how the name and the shop id get into the command text.',
            'The command text should never contain the user’s words; use $1 and $2 as placeholders.',
            'Put the text with $1 and $2 in `text`, and [shopId, name] in `values`, in that order.',
          ],
          explanation: 'Fixed command, separate values. Whatever the user types is matched against names and can never become part of the command, and the same habit protects every query in the app.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-10-match-1',
          kind: 'match',
          title: 'Which risk is this?',
          prompt: 'Match each real situation in a SaaS with the OWASP Top 10:2025 risk it belongs to.',
          concept: 'recognising risks',
          labels: { terms: 'Situation', meanings: 'Risk' },
          pairs: [
            { term: 'Ben, a member of shop B, reads Rosa’s bookings by guessing an id.', definition: 'A01 Broken Access Control', note: 'A person did something they were not allowed to do.' },
            { term: 'An AI suggests installing a package whose name is a one-letter misspelling of a famous library.', definition: 'A03 Software Supply Chain Failures', note: 'The danger comes from a dependency you did not write.' },
            { term: 'A search box value changes what the database command does.', definition: 'A05 Injection', note: 'Data was treated as an instruction.' },
            { term: 'The payment webhook has been failing for a week and nobody was alerted.', definition: 'A09 Security Logging & Alerting Failures', note: 'The failure was invisible because nothing monitored it.' },
          ],
          hints: [
            'Ask what went wrong: a permission, a dependency, a command or a missing alert.',
            'The misspelled package is about where your code comes from.',
            'Data becoming an instruction is injection; the silent failure is about alerting.',
          ],
          explanation: 'Recognising the category tells you the cure: permissions and RLS, vetting packages, parameterising queries, and alerting. The same few categories keep reappearing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-10-scenario-1',
          kind: 'scenario',
          title: 'The table nobody protected',
          prompt: 'Choose how to handle it.',
          concept: 'security review',
          situation: 'The night before launch, your AI reviewer reports: “FAIL: the `reminders` table has row level security off; it contains customers’ phone numbers.” You tried the app with two shops all week and nothing leaked, because the app always filters by shop.',
          options: [
            { text: 'Turn RLS on for the table, add policies, write the two-customer test for reminders and watch it fail before the fix and pass after, then re-run the review on every table.', consequence: 'The table now protects itself, you have proof, and you found the gap before a customer did. The review also catches any other table with the same flaw.', quality: 'best' },
            { text: 'Leave it, because the app always adds the shop filter so it cannot leak.', consequence: 'Anyone with your publishable key can read the table directly. The filter lives in your code, not in the database, and a single missed filter in a future feature leaks phone numbers.', quality: 'poor' },
            { text: 'Delete the phone number column so there is nothing to leak.', consequence: 'Your feature needs the numbers to send reminders. You have removed the product to avoid a fix.', quality: 'poor' },
            { text: 'Turn RLS on and trust that it works without writing a test.', consequence: 'Better than nothing, but without the failing-then-passing test you cannot be sure the policy does what you think.', quality: 'acceptable' },
          ],
          hints: [
            'Where does the shop filter live: in your code or in the database?',
            'Anyone with the publishable key can talk to the database directly.',
            'Enable RLS, add policies, and prove it with the two-customer test.',
          ],
          explanation: 'App-level filters protect only what the app asks for. A table that holds personal data needs its own protection, proved by a test that was seen failing first.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-10-q1',
        prompt: 'A customer types text into a search box and it changes what the database command does. What is the right fix?',
        choices: [
          'Remove special characters from the text with a list of banned words and symbols that you keep up to date',
          'Make the search box case-insensitive so that the typed text cannot match anything other than a customer name',
          'Hide the search box from signed-out visitors, so that only people who have an account can type into it',
          'Write the command once with placeholders and send the user’s text separately as a value',
        ],
        answer: 3,
        explanation: 'Banning characters is easy to bypass. Parameterised queries keep the command and the data apart, so the user’s text can never become part of the command.',
      },
      {
        id: 'build-saas-ai-10-q2',
        prompt: 'An AI tells you to install a package called “reqeusts-pro” to make web calls. What do you do first?',
        choices: [
          'Search the official registry for the exact name and check who publishes it and how widely it is used',
          'Install it right away, since the AI is usually right about the names of the packages it recommends to you',
          'Install it in a second throwaway project first and, if nothing breaks there, copy it across to the real one',
          'Ask the AI to confirm that the package is safe and trust whatever answer it gives you about its own suggestion',
        ],
        answer: 0,
        explanation: 'AI tools can invent or misspell package names, and attackers register look-alike names. Verify in the registry yourself; an AI confirming its own suggestion is not evidence.',
      },
      {
        id: 'build-saas-ai-10-q3',
        prompt: 'Which of these is a genuine control for “a backup that actually works”?',
        choices: [
          'Turning on backups and never opening them again, because the provider says that they run every night',
          'Telling customers in your terms of service that backups exist and are kept for a number of days',
          'Restoring a backup into a scratch database once and checking that the data and the timing are what you expected',
          'Backing up every day but only to the same machine as the database, so that restores are very quick',
        ],
        answer: 2,
        explanation: 'A backup is only proven by a restore. Practising once shows whether the files are complete and how long recovery takes, before you need it in an emergency.',
      },
      {
        id: 'build-saas-ai-10-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, why do we use a checklist for security even when everything “looks fine”?',
        choices: [
          'Because security problems are always visible on the screen, so a list only helps when you look at it',
          'Because most security failures are quiet, so a boring list catches what looking at the app does not',
          'Because a checklist makes the app run faster and the code easier to read for the next person who works on it',
          'Because only experts can find security problems, and the checklist replaces the need to ask any expert at all',
        ],
        answer: 1,
        explanation: 'A leak or a missing limit does not show on screen. Going down a list line by line finds quiet problems that you would never see by using the app.',
      },
      {
        id: 'build-saas-ai-10-q5',
        audience: { min: 'advanced' },
        prompt: 'You use an agent to write code and a second agent session to review it. Which setup makes the review most useful?',
        choices: [
          'Ask the same session that wrote the code to review its own work, since it knows the code better than anyone',
          'Ask the reviewer to find every possible problem and then fix all of them automatically without showing you the changes',
          'Give a fresh session the diff and checklist, ask for PASS, FAIL or UNCHECKED with file and line evidence, and verify the key findings',
          'Use a review only for style and naming, since an AI agent cannot judge whether code is secure or not',
        ],
        answer: 2,
        explanation: 'A reviewer that has not seen the author’s reasoning is less swayed by it. Asking for evidence and a bounded scope avoids both flattery and an endless list of imagined problems, and you still check the findings.',
      },
    ],
    task: {
      title: 'Review your own app against the checklist',
      steps: [
        'Run the review prompt in a fresh AI session over your repository. Save its PASS, FAIL and UNCHECKED list.',
        'For every FAIL, fix it with a small change and a test, and for every UNCHECKED check it yourself. Do not accept “fixed” without evidence.',
        'Search your code for any database command built by joining text. Replace each with a parameterised one.',
        'Restore your database backup into a scratch database and write down how long it took and what you checked.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain each FAIL in plain words with a real-world example, and what could happen to a customer if I ignored it.” Write the three most important ones in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Add secret scanning and a dependency audit to CI, a test that fails when any exposed table has RLS off, and a one-page threat model naming your three worst outcomes and the control for each.'] },
    ],
  },
  {
    id: 'build-saas-ai-11',
    day: 11,
    title: 'Deploy and run it',
    summary: 'Put the product on the internet with separate test and production environments, the right settings in each, a scheduler, and a way back if a release goes wrong.',
    minutes: 28,
    skills: ['ship-and-support'],
    intro: {
      objectives: [
        'Describe the three places your code lives (your computer, previews and production) and what differs in each',
        'Place each setting in the right environment, and say what happens when you change it',
        'Follow a go-live order that includes a backup, a migration, a health check and a way back',
      ],
      why: 'Many SaaS launches fail on the last mile: a test key left in production, a setting changed but never applied, a database change with no backup. A short, repeatable deploy routine makes releases boring, which is exactly what you want.',
    },
    body: [
      {
        type: 'paragraph',
        text: '**Deploying** means putting your code on a computer that stays on and is reachable from the internet, so customers can use it. You will use a hosting service (this lesson uses Vercel as the example; others work the same way) connected to your **GitHub** repository: when you push code, the service builds it and publishes it. This is the part where the course AI-Assisted Deployment goes deep; here we cover what a SaaS in particular needs. The central idea is **environments**: separate copies of your product that differ in their settings. Mixing them up is the most common launch mistake.',
      },
      {
        type: 'table',
        headers: ['Environment', 'Where it runs', 'Database', 'Payments', 'Who uses it'],
        rows: [
          ['Local', 'Your own computer', 'A local or throwaway test database', 'Provider test mode', 'You'],
          ['Preview', 'A temporary address the host creates for each branch or pull request', 'A separate test project', 'Provider test mode', 'You, and a friend you ask to look'],
          ['Production', 'Your real domain', 'The real database, with backups', 'Provider live mode, once you are ready', 'Customers'],
        ],
        caption: 'Test data and real customer data must never share a database, and test keys must never be in production.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'A safe release. Nothing reaches customers until it has passed a preview, and every step has a way back.',
        source: `flowchart LR
  A[Run tests, commit on a branch] --> B[Push and open a pull request]
  B --> C[Preview deployment with test settings]
  C --> D[Check it by hand with a test card]
  D --> E[Back up production data]
  E --> F[Apply database changes]
  F --> G[Merge: production deploys]
  G --> H[Check /health and one real sign-in]
  H -->|something is wrong| I(Redeploy the last good version)`,
      },
      { type: 'heading', text: 'Settings belong to an environment' },
      {
        type: 'paragraph',
        text: 'Each setting (an **environment variable**) has a name and a value, and the host lets you give the same name a different value in each environment. Your payment provider’s test keys go in Local and Preview; its live keys go only in Production, and the webhook signing secret is different for test and live. Public values (the ones your browser code needs) are safe to expose; secret values are not, and must only ever be set in the host’s settings screen, never in the repository. Two facts from Vercel’s documentation cause real confusion. First, **changing a variable does not change the version that is already running**: it applies only to new deployments, so after a change you must redeploy. Second, in many frameworks a variable that starts with `NEXT_PUBLIC_` is copied into the browser code at *build* time, so a secret behind that prefix is published to everyone.',
      },
      {
        type: 'paragraph',
        text: '**Database changes** need care because they cannot be undone as easily as code. Keep each change as a small, committed file (a **migration**), apply it to the preview database first, take a backup of production, then apply it to production. **The scheduler** (the reminder job) also needs checking: confirm it runs on the production deployment, that its schedule is read in UTC, and that only the scheduler can call it (a secret in the request, so strangers cannot trigger your job). **A domain and HTTPS** come next: point your own domain at the host, which then provides the certificate, and register the production webhook address with your payment provider using the live signing secret.',
      },
      {
        type: 'paragraph',
        text: 'Finally, plan the **way back**. If a release breaks something, the fastest recovery is usually to redeploy the last good version from the host’s list of deployments, then fix the problem calmly. A database migration is harder to reverse, which is why the backup comes first. Write the steps down in a short “release” file in the repository, so you (or an AI agent) follow the same routine every time.',
      },
      {
        type: 'prompt',
        label: 'Ask an AI tool for your release routine',
        text: 'Read my repository and write RELEASE.md: the exact steps to deploy this app. Include: the environment variables each environment needs (name only, never values), which are public and which are secret, the order for applying database migrations, how to check /health, how the reminder schedule is configured and protected, how to register the production webhook, and how to roll back to the previous deployment. Mark any step you are not certain about as NEEDS CHECKING. Do not change any code.',
      },
      {
        type: 'version',
        text: 'Vercel’s environment-variables docs say variables are scoped to Production, Preview, Development and custom environments; that a change applies only to new deployments (earlier deployments keep the values they were built with, so you redeploy); that Config values stay readable to authorized members while Secret values are write-only after saving; and that Next.js inlines NEXT_PUBLIC_ variables into the client bundle at build time. Its Cron Jobs page says the schedule timezone is always UTC and that cron jobs are described as a legacy feature being migrated to Schedules. Stripe’s docs say a webhook endpoint used with both test and live keys has a different signing secret for each, and to replace test keys with live ones before going live. Hosting products and their names change often, so read the pages for the host you actually use.',
        checked: CHECKED,
        sources: [DOCS.vercelEnv, DOCS.vercelCron, DOCS.stripeNode],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of a restaurant. The *local* environment is your home kitchen where you try recipes. A *preview* is a tasting for friends in the back room. *Production* is the dining room with paying guests. You would never serve an untested dish to guests, and you would never mix up the play money you practise with and the real till. An *environment variable* is a setting written on a card, such as “which till to use”, and each room has its own card. Changing a card does not change a meal already served; you have to serve a new one (redeploy). A *migration* is a change to the kitchen’s layout: you photograph the kitchen first (the backup) because you cannot easily un-move the walls.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Make environments reproducible rather than hand-configured: infrastructure and settings in code where you can, one source of truth for variable names with a startup check that fails fast on a missing value, and separate secrets per environment and per service so a leak has a small blast radius. Run migrations in CI against a copy of production-shaped data, write them to be backward compatible (expand, deploy, then contract) so a rollback of code does not need a rollback of schema, and take a restorable snapshot before each. Gate releases on the test suite and a smoke test against the preview, use feature flags to separate deploy from release, and monitor the rate of errors and due-but-unsent reminders for the first hour after each deploy. Decide an RPO and RTO for the database and test that your backups actually meet them.',
      },
      {
        type: 'takeaways',
        items: [
          'Keep local, preview and production separate: different databases, different keys, and test payments in test mode only.',
          'Each setting belongs to an environment; changing a variable only affects new deployments, so redeploy after a change.',
          'Never put a secret behind a public prefix such as NEXT_PUBLIC_, and never keep secrets in the repository.',
          'Back up before a database change, apply it to preview first, and check /health and one real sign-in after a release.',
          'Write the way back into a short release file: redeploy the last good version, then fix calmly.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-11-scenario-1',
          kind: 'scenario',
          title: 'The new key does nothing',
          prompt: 'Choose the most likely explanation and next step.',
          concept: 'environment variables',
          situation: 'You rotated your email service key. You updated the variable in the host’s settings, but production still sends mail with the old, now-revoked key and customers’ sign-in emails fail. Your code has not changed.',
          options: [
            { text: 'The running deployment keeps the values it was built with. Redeploy production so it picks up the new variable, then send a test sign-in email.', consequence: 'The new deployment reads the new key, mail flows again, and you have confirmed it with a real test instead of assuming.', quality: 'best' },
            { text: 'Edit the key directly into the source code so it cannot be missed, and push.', consequence: 'The key is now in your repository history and visible to anyone with access. You have turned a small ordering problem into a leaked secret.', quality: 'poor' },
            { text: 'Wait an hour, since settings usually take a while to spread.', consequence: 'Changes to variables are not delayed, they simply apply to new deployments only. Waiting leaves customers locked out for no reason.', quality: 'poor' },
            { text: 'Add the new variable under a second name and change the code to use it.', consequence: 'It works once the new code is deployed, but you had to deploy anyway, and you now have two variables to keep track of.', quality: 'acceptable' },
          ],
          hints: [
            'Did anything build a new version after you changed the setting?',
            'A variable’s value is fixed into a deployment when it is built.',
            'Redeploy so the new deployment reads the new value, then verify.',
          ],
          explanation: 'Environment variables are read when a deployment is built. Changing one only affects the next deployment, so after any change you redeploy and then check with a real action.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-11-match-1',
          kind: 'match',
          title: 'Where does each setting belong?',
          prompt: 'Match each setting with the rule that decides where it lives.',
          concept: 'environment settings',
          labels: { terms: 'Setting', meanings: 'The rule' },
          pairs: [
            { term: 'SUPABASE_SECRET_KEY', definition: 'Server-only secret: set in the host’s settings, never in the repo or the browser', note: 'It bypasses every row level security rule.' },
            { term: 'The payment provider’s test webhook signing secret', definition: 'Test environments only: the live endpoint has a different secret', note: 'A webhook used in both modes has a separate secret for each.' },
            { term: 'NEXT_PUBLIC_SUPABASE_URL', definition: 'Public value that is copied into the browser code when the app is built', note: 'The prefix means it is published to every visitor, so it is only for non-secrets.' },
            { term: '.env.local', definition: 'A file on your own computer that Git must ignore', note: 'It holds your local settings and must never be committed.' },
          ],
          hints: [
            'Ask who is allowed to see each value: only the server, only a test environment, everyone, or only you.',
            'The word PUBLIC in a name is the clue that it ends up in the browser.',
            'A webhook secret depends on test versus live; .env.local is a local file.',
          ],
          explanation: 'Each setting has an audience and an environment. Getting those two things right (and redeploying after a change) prevents the classic leaks and test-in-production mistakes.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-11-q1',
        prompt: 'Which setup is correct for payments?',
        choices: [
          'Live keys in production and test keys in local and preview, with a separate webhook secret for each',
          'Test keys in production until the first customer pays, and then switch every environment over to live keys',
          'Live keys in every environment, so that previews behave exactly the way production does for the testers',
          'The same test webhook signing secret in production and in preview, to keep the number of settings small',
        ],
        answer: 0,
        explanation: 'Only production should ever handle real money. Local and preview use test mode, and the signing secret differs between test and live.',
      },
      {
        id: 'build-saas-ai-11-q2',
        prompt: 'Before applying a database migration to production, what should you do?',
        choices: [
          'Apply it straight away to production, because a migration is just another change to the code of the app',
          'Take a restorable backup, and have applied the migration to the preview database first to see what it does',
          'Delete the old tables first so that nothing can conflict with the new ones when the migration runs',
          'Ask customers to stop using the app for a day, then apply the migration without taking any backup first',
        ],
        answer: 1,
        explanation: 'A database change is much harder to undo than code. Trying it on preview first and having a backup gives you a safe way back.',
      },
      {
        id: 'build-saas-ai-11-q3',
        prompt: 'A new release breaks sign-in for some users. What is usually the quickest first recovery step?',
        choices: [
          'Edit the live database by hand until the sign-in works again',
          'Ask users to clear their cookies and wait',
          'Redeploy the last good version, then investigate calmly',
          'Switch off the scheduler so no emails are sent',
        ],
        answer: 2,
        explanation: 'Restoring the last good deployment stops the harm quickly and gives you time to find the real cause, without hand-editing live data under pressure.',
      },
      {
        id: 'build-saas-ai-11-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a “preview” environment for?',
        choices: [
          'Showing customers a demo version that they can pay for before the product is finished and live',
          'Trying a change on a temporary copy, with test settings, before it reaches real customers',
          'Storing the backups of the production database so that they can be restored after a failure',
          'Running the scheduled reminders for the real shops while the production version is being updated',
        ],
        answer: 1,
        explanation: 'A preview is a safe temporary copy for checking a change by hand with test data and test payments before it goes to production.',
      },
      {
        id: 'build-saas-ai-11-q5',
        audience: { min: 'advanced' },
        prompt: 'You want a schema change to be safe even if the code must be rolled back. Which approach fits?',
        choices: [
          'Drop the old column in the same release that stops using it, to keep the schema clean and the code simple',
          'Never change the schema after launch, and add a new table whenever you need something different',
          'Expand (add the new column, keep the old one), deploy code using both, then contract in a later release',
          'Rename the column in production by hand during a quiet hour, and redeploy the code straight afterwards',
        ],
        answer: 2,
        explanation: 'Expand-and-contract keeps the old and new code both working during the rollout, so a code rollback does not need a schema rollback. Dropping in the same release removes your way back.',
      },
    ],
    task: {
      title: 'Deploy to a preview and write RELEASE.md',
      steps: [
        'Connect your GitHub repository to a host (Vercel or similar) and deploy a preview from a branch, with test-mode keys only.',
        'List every environment variable your app needs and mark each public or secret and which environments need it. Confirm no secret is in the repository.',
        'Use the release prompt to generate RELEASE.md, then correct every NEEDS CHECKING line by checking it yourself.',
        'Change one environment variable on the preview, observe that nothing changes until you redeploy, then redeploy and confirm.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain my RELEASE.md step by step as if I have never deployed anything, using a restaurant comparison.” Add any term you did not know to a short glossary at the bottom of the file.'] },
      { audience: { min: 'advanced' }, steps: ['Add a startup check that fails when a required variable is missing, a CI job that runs migrations against a throwaway database, and a smoke test against each preview. Write a rollback drill and time it.'] },
    ],
  },
  {
    id: 'build-saas-ai-12',
    day: 12,
    title: 'Launch day',
    summary: 'Open the doors in small batches with the right pages, a watched dashboard and a plan for the first problems.',
    minutes: 22,
    skills: ['ship-and-support'],
    intro: {
      objectives: [
        'Prepare the pages and messages a real launch needs, including honest pricing and legal pages',
        'Launch to your waitlist in small batches and watch the right things',
        'Put the launch tasks in a sensible order and say why each one comes where it does',
      ],
      why: 'Launching is not a single moment of glory, it is a controlled opening. A calm, staged launch lets you fix the first problems with five customers instead of five hundred, and it is how your first real user becomes a believer instead of a complaint.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Launch day is the point at which strangers start depending on your product. It feels like a finish line, but treat it as the *start of a window*: the first few days, when you learn the most and every problem is cheap to fix because few people are affected. That is why the best launches are **staged**. You invite a small batch from your waitlist, watch closely, fix what breaks, then invite the next batch. The course Launching and Marketing AI-Built Products covers audiences and promotion; this lesson is about the product being ready and you being ready.',
      },
      { type: 'heading', text: 'The pages and promises a launch needs' },
      {
        type: 'list',
        items: [
          '**A pricing page that matches the product.** Plan names, what each includes (your limits in words), and an honest note on what happens when a payment fails or someone cancels.',
          '**Terms and a privacy policy.** AI can draft a starting point, but it is not legal advice. You hold customers’ and their customers’ phone numbers, so have the pages reviewed by someone qualified where you operate, and make sure they say what you actually do.',
          '**A support address** that you read, shown in the app and on every email, and a promise you can keep (“we reply within one working day”).',
          '**A short welcome message** that tells a new owner the one thing to do first: add a booking.',
          '**A way to cancel** that works without writing to you. The payment provider’s customer portal covers this.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not “test” live payments by putting your own real card through your own product. Payment providers can forbid testing in live mode with real payment details. Finish all your testing in test mode before launch; the first live payment should be a genuine customer’s.',
      },
      { type: 'heading', text: 'Launch in batches, and watch' },
      {
        type: 'paragraph',
        text: 'Invite five to ten people first, preferably the owners you interviewed in lesson 1. Before you send the invitations, open the three things you will watch for the rest of the day: the **error tracker** (any new error), the **health check and the reminder job’s log** (are bookings due but unsent?) and the **funnel** (are new shops reaching their first booking?). Then talk to the first users, on a call if they will, and watch where they hesitate. A single confused owner tells you more than a hundred sign-ups. When the first batch has run for a day with nothing alarming, invite the next, twice the size.',
      },
      {
        type: 'paragraph',
        text: 'Prepare for problems before they happen. Decide who fixes what, what the **stop button** is (for example, a setting that pauses all reminder sending), and what you will tell customers if something goes wrong: a short, honest message says what happened, what you did and when it is fixed. Customers forgive an outage that was explained, far more easily than silence. Finally, keep your own energy: launch week is long. Write the order of work down, tick it off, and sleep.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The staged launch loop. Each batch is a chance to fix a problem while it is still small.',
        source: `flowchart LR
  A[Checklist done, dashboards open] --> B[Invite batch of 5 to 10]
  B --> C[Watch errors, reminders, funnel]
  C --> D[Talk to the first users]
  D --> E{Anything alarming?}
  E -->|yes| F[Pause invites and fix]
  F --> C
  E -->|no| G[Invite a bigger batch]
  G --> C`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Opening a new shop works like this: you do not put a banner outside and let a thousand people in on day one. You invite a few friends for a soft opening, watch what confuses them, fix the sign, and only then open the doors wider. The pages (pricing, terms, privacy, support) are the signs and the receipt book that every honest shop needs. A *stop button* is the master switch in the back that lets you pause everything if the till goes wrong. And a staged launch is not being timid; it is how careful people avoid expensive mistakes in front of everyone.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat launch as a progressive rollout. Gate access with a flag or an allowlist, define success and abort criteria before the first invite (error rate, time-to-first-reminder, queue depth, payment failure rate), and make the kill switch for outbound messaging a tested, one-step control, since messaging is where cost and reputation damage accumulate fastest. Capacity-check the scheduler and the messaging provider’s rate limits against the expected batch, run a rollback drill, and have an on-call plan even if the “team” is one person. Write the incident-communication template in advance, keep a launch log with timestamps, and hold a short review after the first week that turns every surprise into a test, an alert or a line in the instructions file.',
      },
      {
        type: 'takeaways',
        items: [
          'A launch is a staged opening, not one big moment: small batches let you fix problems while few people are affected.',
          'Have honest pricing, reviewed terms and a privacy policy, a support address you read, and a welcome message before you invite anyone.',
          'Never test live payments with your own real card; finish testing in test mode and let a genuine customer make the first live payment.',
          'Open the error tracker, the reminder log and the funnel before the first invite, and talk to your first users.',
          'Know your stop button and write the honest message you would send if something goes wrong.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-12-arrange-1',
          kind: 'arrange',
          title: 'Put the launch in order',
          prompt: 'Arrange the launch-day steps in the order a careful founder would do them.',
          concept: 'launch order',
          language: 'text',
          solution: [
            'Finish testing in test mode and write the release and stop-button steps',
            'Publish pricing, terms, privacy and the support address',
            'Open the error tracker, reminder log and funnel dashboards',
            'Invite the first batch of 5 to 10 owners from the waitlist',
            'Watch closely and talk to the first users',
            'Fix anything alarming before inviting a bigger batch',
          ],
          reasons: [
            'Testing and the emergency plan come before anyone depends on the product.',
            'The pages and promises must exist before strangers arrive.',
            'You can only react to what you can see, so open the dashboards first.',
            'A small batch limits how many people any problem can affect.',
            'The first users teach you the most; watch before you widen the door.',
            'Only open further once the first batch is running well.',
          ],
          hints: [
            'What must be true before anyone is invited?',
            'You watch the dashboards after inviting, but you must open them before.',
            'Testing and the stop button first, bigger batches last.',
          ],
          explanation: 'The order protects people: prepare, publish promises, make problems visible, invite few, learn, then widen. Each step makes the next one safer.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-12-scenario-1',
          kind: 'scenario',
          title: 'Invite all 200 at once?',
          prompt: 'Choose your plan.',
          concept: 'staged launch',
          situation: 'Your waitlist has 200 owners. You are excited and the product has passed all your tests. A friend says, “Just email everyone at 9 AM and get it over with.” You have never had more than three people using it at once.',
          options: [
            { text: 'Invite 10, keep the dashboards open, talk to them, fix what you find, and invite larger batches over the next days.', consequence: 'The first surprises (a confusing screen, a slow job, a sign-in email that is delayed) affect ten people, and you fix them before the rest arrive.', quality: 'best' },
            { text: 'Email all 200 at 9 AM to get maximum energy on the first day.', consequence: 'Any problem now hits 200 people at once, including the messaging limits and the reminder job you never ran at that size, and you cannot support them all.', quality: 'poor' },
            { text: 'Wait until the product feels perfect before inviting anyone.', consequence: 'You delay the learning that only real use gives, and you may polish things nobody cares about. Perfect never arrives.', quality: 'poor' },
            { text: 'Invite 100 now and 100 tomorrow.', consequence: 'Better than all at once, but a first batch of 100 is still too large to talk to or support individually if something goes wrong.', quality: 'acceptable' },
          ],
          hints: [
            'How many people can you actually talk to and support on day one?',
            'A problem is cheapest to fix when few people see it.',
            'Start with ten and widen as things stay quiet.',
          ],
          explanation: 'Small batches limit the damage of unknown problems and let you learn from real users. You keep the launch exciting by growing it, not by risking it all in one morning.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-12-q1',
        prompt: 'Why launch to a small batch of your waitlist first?',
        choices: [
          'Waitlist emails are limited to ten messages a day by most email services, so you must invite in small groups',
          'It saves the cost of a domain name until more people have signed up, which lowers the risk of the launch',
          'Small launches are cheaper for the payment provider to process, so the fees on the first payments are lower',
          'Unknown problems affect only a few people, and you can fix them before the next batch arrives',
        ],
        answer: 3,
        explanation: 'The reason is risk and learning: the first real use always finds surprises, and a small batch keeps them small and manageable.',
      },
      {
        id: 'build-saas-ai-12-q2',
        prompt: 'What should happen the first time you want to confirm that live payments work?',
        choices: [
          'A genuine customer makes the first live payment, after all of your testing was done in test mode',
          'Put your own real card through your own product and then refund it, to prove that live mode works',
          'Turn off the signature check temporarily so that the provider’s test events can be used against production',
          'Skip checking altogether, since the test-mode result guarantees that live mode will behave the same way',
        ],
        answer: 0,
        explanation: 'Providers can prohibit testing live mode with real payment details. Finish testing in test mode and watch the first genuine live payment closely.',
      },
      {
        id: 'build-saas-ai-12-q3',
        prompt: 'Which item belongs on the launch checklist before inviting anyone?',
        choices: [
          'A press release for the national newspapers, announcing that the product is open to everyone',
          'A redesign of the logo and the colour theme, so that the first impression on the pricing page is stronger',
          'A decision to add three more features this week so that the first batch has more to try out',
          'A stop button that can pause all outgoing reminders, and an honest message ready for customers',
        ],
        answer: 3,
        explanation: 'Messaging is where a problem spreads fastest, so a tested stop button and a prepared honest message are core launch safety.',
      },
      {
        id: 'build-saas-ai-12-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a “staged” launch?',
        choices: [
          'Launching on a stage at a conference, with an audience watching the first sign-ups arrive live',
          'Letting a few people in first, watching and fixing, then inviting more in bigger groups',
          'Releasing the product on a Friday evening, so that the weekend gives you time to react to problems',
          'Launching in one country only and never opening it to any other market, however well it goes',
        ],
        answer: 1,
        explanation: 'A staged launch grows in steps. It is the careful way to open a product because each step teaches you something before more people are affected.',
      },
      {
        id: 'build-saas-ai-12-q5',
        audience: { min: 'advanced' },
        prompt: 'Which set of pre-agreed launch criteria is most useful?',
        choices: [
          'Launch when the team feels confident, and pause the launch only if more than one customer complains',
          'Abort if the error rate, reminder lateness or payment failure rate cross numbers you wrote before the first invite, with a one-step stop',
          'Launch whenever the marketing calendar says so, regardless of how ready the product is on that day',
          'Measure only the number of sign-ups on day one, and treat a high number as proof that the launch worked',
        ],
        answer: 1,
        explanation: 'Writing the abort criteria beforehand removes the temptation to rationalise under pressure, and a tested kill switch gives you something to do when they are crossed.',
      },
    ],
    task: {
      title: 'Prepare your launch pack',
      steps: [
        'Write your pricing page text, with plan limits in words, and the sentence about what happens when a payment fails.',
        'Ask an AI tool to draft a privacy policy and terms from your real data flows (what you collect, who sees it), then mark every sentence you are unsure about for a qualified person to review.',
        'Write the three dashboards you will open before inviting anyone, your stop button, and a 4-sentence honest message for an outage.',
        'List ten names for the first batch, with how you will thank and talk to each.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Read my pricing page as a stranger who has never heard of Paalala. What is unclear?” Rewrite the unclear lines in plainer words.'] },
      { audience: { min: 'advanced' }, steps: ['Write abort criteria with numbers, test the kill switch for outbound messages, and run a 30-minute rehearsal where you fail a deploy and communicate it using your incident template.'] },
    ],
  },
  {
    id: 'build-saas-ai-13',
    day: 13,
    title: 'Support, maintenance and the next version',
    summary: 'Handle support calmly, keep the product healthy with a short routine, and choose the next version from evidence instead of noise.',
    minutes: 25,
    skills: ['ship-and-support'],
    intro: {
      objectives: [
        'Sort incoming problems by severity and decide what to do first',
        'Fix a customer’s bug safely with an AI tool, and tell the customer what happened',
        'Choose the next feature from churn, support and usage evidence rather than from the loudest request',
      ],
      why: 'A SaaS is a promise that continues after launch. Customers stay when problems are noticed, fixed and explained, and the product improves in the direction people actually use and pay for.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'After launch the work changes shape. You will spend less time building new things and more time answering customers, fixing surprises and keeping the product healthy. This is not a sign that something is wrong; it is what running a service means. Three habits keep it manageable: **sort what comes in**, **run a short maintenance routine**, and **choose the next version from evidence**. Customers will contact you in the first week whatever you do, so decide in advance how to treat what they say.',
      },
      { type: 'heading', text: 'Sort problems by severity' },
      {
        type: 'table',
        headers: ['Severity', 'Example in Paalala', 'What you do'],
        rows: [
          ['Urgent: stop and fix now', 'One shop can see another’s data; payments or sign-in are broken for everyone; reminders are going to the wrong people', 'Use the stop button if needed, fix, tell affected customers honestly'],
          ['High: fix today', 'Reminders are late or missing for some shops; a customer cannot upgrade', 'Reproduce, fix, deploy and tell the customer'],
          ['Medium: schedule it', 'A screen is confusing; an email has a typo', 'Add it to the next batch of work'],
          ['Low: note it', 'A feature wish; a colour preference', 'Record it and look for repeats'],
        ],
        caption: 'Anything that exposes data or money is always urgent. Otherwise severity is how many people are hurt and how badly.',
      },
      {
        type: 'paragraph',
        text: 'To fix a reported bug, follow the loop from the course Debugging and Troubleshooting with AI: ask the customer what they did and what they expected, reproduce it yourself, and write a failing test that shows the problem before anyone changes code. Then let the AI tool propose a small change, read the diff, run the tests and deploy. Always reply to the customer: say what you found, what you changed and when. A customer who hears back within a day usually stays, even after a bug.',
      },
      {
        type: 'prompt',
        label: 'A bug-report prompt for your AI tool',
        text: 'A customer reports: "Reminders for my 3 PM bookings went out at 7 AM." Shop id: [id]. Do not change any code yet. First read the reminder job and the due-reminders rule and give me 3 ranked hypotheses, including a time zone one. Then write a failing test that reproduces the most likely cause using these inputs: [booking time, shop time zone, job run time]. Show me the failing output. After I approve, make the smallest change that passes it, run all tests, and list what you did not verify.',
      },
      { type: 'heading', text: 'A short maintenance routine' },
      {
        type: 'list',
        items: [
          '**Weekly:** read the error tracker and the reminder log; clear the support inbox; look at the funnel and churn.',
          '**Monthly:** update dependencies in a branch and run the tests, and apply security fixes promptly; check that backups exist; check your costs (messaging usage grows with customers).',
          '**Every few months:** practise a restore, rotate keys you have shared with tools, and review who has access to what.',
          '**Whenever a provider changes something:** read the notice. Payment providers version their event formats, and the version set on your account decides what your webhook receives, so upgrade deliberately, in test mode first.',
          '**When asked:** be ready for customers who ask for their data or ask you to delete it. Decide the process now, even if you do it by hand at first.',
        ],
      },
      { type: 'heading', text: 'Choosing the next version' },
      {
        type: 'paragraph',
        text: 'Every customer has an opinion on what you should build, and the loudest request is rarely the most valuable. Use three sources of evidence together. **Churn reasons:** when someone cancels, ask why (the payment provider’s customer portal can collect a cancellation reason). **Support patterns:** the same question three times means the product is unclear. **Usage:** what do successful shops do that struggling ones do not? Then rank candidates by *how many people feel the pain* and *how much it matters to them*, and compare the cost. Write the winner into `SPEC.md` first, with acceptance criteria, and update `CLAUDE.md` with anything the AI got wrong this time. The same loop that built version one now builds version two, but with real data.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The post-launch loop. Evidence picks the work; the spec and tests keep it honest.',
        source: `flowchart LR
  A[Support, churn reasons, usage] --> B[Rank by how many people and how much it matters]
  B --> C[Write it in SPEC.md with acceptance criteria]
  C --> D[Build with tests in a fresh AI session]
  D --> E[Deploy, watch, tell customers]
  E --> A`,
      },
      {
        type: 'version',
        text: 'Stripe’s documentation says the API version set on your account when an event occurs decides the structure of the events sent to your webhook, that Event objects cannot be changed afterwards, and that you can set test event destinations to your default or the latest API version, which is why an upgrade should be tried in test mode first. Its customer-portal page says customers can cancel in the portal and that cancellation reasons can be collected through webhooks. Supabase’s guidance on backups and Vercel’s on deployments are provider-specific, so read your own provider’s pages before relying on any restore or rollback feature.',
        checked: CHECKED,
        sources: [DOCS.stripeNode, DOCS.vercelEnv],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Running a SaaS after launch is like running a small clinic. There is a queue, and a nurse sorts it: a chest pain goes in first, a splinter waits. That sorting is *triage*, and the severity table is your nurse. Maintenance is the regular check-up: weekly look, monthly clean, yearly deep check. And choosing the next version is like deciding which new service to add: you do not ask only the loudest patient, you look at the records (why people leave, what they ask again and again, what the busy ones do) and then you decide. *Churn* means customers who stop paying. Asking them why is the cheapest research you will ever do.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Make support part of the engineering loop: link each ticket to a failing test, tag the cause (bug, unclear UX, missing feature, abuse), and review the tags monthly because the distribution tells you where quality is leaking. Track a small set of operational indicators (time to first response, time to fix, reopen rate) and cohort retention rather than blended churn, since early customers and recent ones behave differently. Automate dependency updates with CI gates, pin and review provider API versions, and keep a runbook per alert. When agents do maintenance work, constrain them with tests, a small diff budget and required review for auth, billing and migrations, and keep CLAUDE.md or AGENTS.md pruned: a rule that no longer matches the codebase misleads every future session.',
      },
      {
        type: 'takeaways',
        items: [
          'Sort problems by severity: anything exposing data or money is urgent; otherwise severity is how many people are hurt and how badly.',
          'Fix reported bugs with the same loop: reproduce, failing test, smallest change, deploy, and tell the customer.',
          'Run a short routine: weekly checks, monthly updates and backups, and a restore practised every few months.',
          'Choose the next version from churn reasons, support patterns and usage, not from the loudest request.',
          'Write the next feature into SPEC.md with acceptance criteria before building, and keep the instructions file current.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-13-scenario-1',
          kind: 'scenario',
          title: 'Three messages on Monday morning',
          prompt: 'Choose what to do first.',
          concept: 'support triage',
          situation: 'Monday morning you find three messages. (A) Owner Jun writes: “I think my customers can see each other’s names in the reminder text.” (B) Owner Ana writes: “Could you add a dark mode?” (C) Owner Lito writes: “The Studio plan price on your page is different from my invoice.”',
          options: [
            { text: 'Handle A first: stop reminders if needed, reproduce it, and fix the leak. Then answer C today, and note B for later.', consequence: 'You deal with a possible exposure of personal data before anything else, then the money confusion, and park the wish. This is the severity order.', quality: 'best' },
            { text: 'Answer them in the order they arrived, since that is fair.', consequence: 'A possible data leak waits behind a request that can wait weeks. Fair order is not the same as the right order.', quality: 'poor' },
            { text: 'Reply to B first because it is the easiest and builds goodwill.', consequence: 'You spend the morning on a wish while a serious problem stays open.', quality: 'poor' },
            { text: 'Handle C first, because money problems are always the most important.', consequence: 'A pricing mismatch matters and should be handled today, but a possible leak of customers’ personal details is more serious and more urgent.', quality: 'acceptable' },
          ],
          hints: [
            'Which message could hurt people’s privacy?',
            'Data exposure outranks money confusion, which outranks wishes.',
            'A first, then C, then B.',
          ],
          explanation: 'Severity decides the order, not arrival time. Anything that may expose customers’ data comes first, then problems that affect money or core use, then improvements.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-13-code-challenge-1',
          kind: 'code-challenge',
          title: 'Calculate monthly churn',
          prompt: 'Write `monthlyChurn(startCount, cancelled)`. It returns the percentage of paying customers at the start of the month who cancelled, rounded to one decimal place (use `Math.round(x * 10) / 10`). If `startCount` is 0, return 0.',
          concept: 'churn rate',
          language: 'javascript',
          starter: `function monthlyChurn(startCount, cancelled) {
  // return the percentage of customers who cancelled
}`,
          tests: {
            kind: 'function',
            fn: 'monthlyChurn',
            cases: [
              { args: [40, 4], expected: 10, label: '4 of 40' },
              { args: [30, 1], expected: 3.3, label: 'rounds to one decimal' },
              { args: [0, 0], expected: 0, label: 'no customers yet' },
              { args: [200, 0], expected: 0, label: 'nobody cancelled' },
            ],
          },
          solution: `function monthlyChurn(startCount, cancelled) {
  if (startCount === 0) return 0;
  return Math.round((cancelled / startCount) * 1000) / 10;
}`,
          hints: [
            'Churn is the number who cancelled divided by the number at the start, as a percentage.',
            'Guard the case where startCount is 0 first so you never divide by zero.',
            'Math.round((cancelled / startCount) * 1000) / 10 gives one decimal place.',
          ],
          explanation: 'Churn is cancellations divided by customers at the start of the period. Guarding the empty case avoids a nonsense answer, and one decimal place is enough precision for deciding what to do.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-13-match-1',
          kind: 'match',
          title: 'Which evidence points to which work?',
          prompt: 'Match each pattern you notice with the kind of work it points to.',
          concept: 'choosing the next version',
          labels: { terms: 'What you notice', meanings: 'What it points to' },
          pairs: [
            { term: 'Five owners in a week ask where to see tomorrow’s reminders.', definition: 'The screen or wording is unclear: improve it', note: 'The same question repeated means the product is not clear enough.' },
            { term: 'Four of the six shops that cancelled wrote “too few reminders on the Free plan”.', definition: 'A pricing or plan-limit question to examine', note: 'Cancellation reasons about limits point at the plan, not the code.' },
            { term: 'Reminders for 3 PM bookings arrived at 7 AM for one shop.', definition: 'A bug to reproduce with a failing test, then fix', note: 'A wrong result for a specific input is a bug.' },
            { term: 'One owner asks for dark mode; nobody else does.', definition: 'A wish to record and watch for repeats', note: 'A single request is a note, not a plan.' },
          ],
          hints: [
            'Ask whether it is a question, a reason for leaving, a wrong result or a wish.',
            'A wrong result for specific input is a bug and needs a test.',
            'One request is a note; many repeats are evidence.',
          ],
          explanation: 'Different evidence needs different responses: clarify the product, examine the plan, fix a bug with a test, or simply record a wish until it repeats.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-13-q1',
        prompt: 'Which reported problem is always treated as urgent?',
        choices: [
          'A request to change the colour of a button on the Today page, which several owners mentioned this week',
          'A suggestion for a new report that shows reminders sent per week, from an owner who pays for the Shop plan',
          'A possibility that one customer can see another customer’s personal details',
          'A question about how to invite a staff member, from an owner who cannot find the button on the shop page',
        ],
        answer: 2,
        explanation: 'Anything that may expose data or money is urgent. Wishes and how-to questions can wait their turn.',
      },
      {
        id: 'build-saas-ai-13-q2',
        prompt: 'A customer reports a bug you cannot yet explain. What is the best first step before asking an AI to change code?',
        choices: [
          'Ask the AI to rewrite the whole feature from scratch so that the bug disappears together with the old code',
          'Reproduce it and write a failing test, then let the AI propose the smallest fix',
          'Disable the feature for every customer and wait for more reports to arrive before you look into the cause',
          'Tell the customer that the problem is on their side, and close the ticket until they send a screenshot',
        ],
        answer: 1,
        explanation: 'A failing test proves the bug, shows when it is fixed, and keeps the AI’s change small and checkable. Rewriting or ignoring just hides the problem.',
      },
      {
        id: 'build-saas-ai-13-q3',
        prompt: '4 of 40 paying shops cancelled this month. What do you do next?',
        choices: [
          'Celebrate: ten percent a month is acceptable growth for a small product, so no action is needed at all',
          'Contact the four, ask why they left, and look for a pattern before deciding what to change',
          'Cut the price in half for every customer at once, which will stop the others from leaving next month',
          'Ignore it until twenty shops cancel, because a few cancellations are normal for any new product',
        ],
        answer: 1,
        explanation: 'Cancellations are the cheapest research you will get. Asking why reveals whether the cause is price, quality, a missing feature or a bug.',
      },
      {
        id: 'build-saas-ai-13-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does “triage” mean for support messages?',
        choices: [
          'Answering the messages in the order they arrive, so that every customer is treated exactly the same way',
          'Deleting the messages that are repeated, so that the inbox only holds one message about each problem',
          'Sorting them by how serious they are, so that the most serious ones are handled first',
          'Forwarding all of them to the AI tool and sending back whatever answer it writes without reading it',
        ],
        answer: 2,
        explanation: 'Triage means sorting by seriousness, as a nurse does with a queue of patients. Severity, not arrival time, decides what you do first.',
      },
      {
        id: 'build-saas-ai-13-q5',
        audience: { min: 'advanced' },
        prompt: 'Blended monthly churn looks stable at 5%, but you suspect a problem. Which analysis is most informative?',
        choices: [
          'Retention by signup cohort, since early and recent customers can behave very differently and a blend hides that',
          'The average of all the monthly churn figures since launch, which smooths out the noisy months',
          'The number of support tickets alone, ignoring who cancelled, since tickets show where customers are unhappy',
          'Total revenue by month, since it rises whenever new customers are added and shows that the product is healthy',
        ],
        answer: 0,
        explanation: 'A stable blend can hide recent cohorts that leave faster than old ones. Cohort retention separates them, and it points to what changed in the product or the audience.',
      },
    ],
    task: {
      title: 'Write your support and maintenance plan',
      steps: [
        'Write your own severity table with a real example for each row from your product, and the first action for each.',
        'Pick a bug you have seen (or invent one) and run the bug-report prompt: get hypotheses, a failing test, and the smallest change. Save the test.',
        'Write a weekly and a monthly maintenance list you will actually follow, and put the first dates on your calendar.',
        'Draft the message you would send a customer who cancelled, asking why, in three sentences.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Pretend to be an annoyed customer whose reminders were late, and let me practise replying. Then tell me what I did well and what I should say differently.” Write your best reply.'] },
      { audience: { min: 'advanced' }, steps: ['Add ticket tags and a monthly cohort-retention query to your repo, an automated dependency update with a CI gate, and a runbook for each alert you created in lesson 9.'] },
    ],
  },
  {
    id: 'build-saas-ai-14',
    day: 14,
    title: 'Project: your SaaS, live with its first user',
    summary: 'Bring the whole course together: a spec, separate customer data, verified billing, security checks, a live deployment and a first real user.',
    minutes: 30,
    skills: ['ship-and-support', 'validate-idea'],
    intro: {
      objectives: [
        'Plan the final project as a checklist of evidence rather than a list of features',
        'Decide what “live with its first user” means for your own product and country',
        'Write the evidence pack that shows a reviewer, a client or an investor that the product is real',
      ],
      why: 'A finished SaaS is the strongest proof you can offer a client or an employer, because it shows you can take an idea to real use, not just generate code. The way to finish is to keep the product small and the proof honest.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'This final lesson prepares the project that closes the course: **your own SaaS, live, with its first real user**. Nothing new is taught here. The skill is finishing: choosing a small product, building it in the order you have practised, and collecting proof that each important claim is true. It is tempting to keep adding features. Resist that. A small product that is live and used beats a large one that is nearly ready, because only the live one teaches you anything and only the live one counts as evidence.',
      },
      {
        type: 'paragraph',
        text: 'What does “live with its first user” mean? It means a real person, who is not you, uses your product on its real address, to do the one job you promised. The first user may be on a free plan. Whether you can take live payments depends on your country, your payment provider’s account approval and your business setup, so check your provider’s own requirements and, where needed, ask an accountant. It is perfectly acceptable to launch with billing in test mode and a clearly labelled free early-access plan, and add live billing later, as long as you say so honestly and the billing code has been tested the way lesson 7 showed.',
      },
      { type: 'heading', text: 'A checklist of evidence' },
      {
        type: 'table',
        headers: ['Claim', 'Evidence you keep'],
        rows: [
          ['Someone wants this', 'Notes from five conversations and at least one commitment (lesson 1)'],
          ['I know what I built', 'SPEC.md with testable acceptance criteria, and a short CLAUDE.md or AGENTS.md (lesson 2)'],
          ['The core feature works', 'Test output for the reminder rule and the “run twice” claim (lesson 5)'],
          ['Customers’ data is separate', 'The two-customer test output, failing before and passing after (lesson 6)'],
          ['Billing is trustworthy', 'Webhook tests: forged, tampered, duplicate and replayed events (lesson 7)'],
          ['Messages arrive', 'A sign-in email received by someone outside your team, from your own domain (lesson 8)'],
          ['I can see problems', 'An error report you triggered on purpose, and your four events (lesson 9)'],
          ['It is secure enough to launch', 'The checklist review with each FAIL fixed or consciously accepted (lesson 10)'],
          ['It is live and recoverable', 'Your URL, RELEASE.md, a restore test, and /health (lesson 11)'],
          ['A real person used it', 'A short note with their first booking, what confused them and what you changed (lessons 12 and 13)'],
        ],
        caption: 'Each row is a claim; the right-hand column is what makes it true. If you cannot show the evidence, the claim is not yet earned.',
      },
      {
        type: 'paragraph',
        text: 'Work in the order of the table. Use your AI tool the way you have practised: one slice at a time, from SPEC.md, tests first for rules that matter, a commit after each slice, and a fresh-session review for security and for each change that touches sign-in, billing or permissions. Decide up front what you will not build. If something takes longer than planned, cut a feature, never a safety check. And keep a short log as you go: what the AI got wrong, what you checked, what you did not verify. That log becomes the most honest part of your write-up.',
      },
      {
        type: 'prompt',
        label: 'A planning prompt for the whole project',
        text: 'I am building my first SaaS, [idea sentence], as a course project. Read SPEC.md. Propose the smallest version that can be live with one real user within [number] weeks, listed as 8 to 12 vertical slices in the order I should build them. For each slice give: what the user can do afterwards, the acceptance criterion, the test I should write first, and what could go wrong. Put payments and email near the end, and put the row level security and the two-customer test before any feature that stores customer data. Do not write any code.',
      },
      {
        type: 'paragraph',
        text: 'Finally, write the **evidence pack**: one page, plain language, with your URL, a sentence on who it is for, the table above filled in with links or pasted outputs, a list of what you cut and why, a list of known gaps, and a paragraph on what you learned from the first user. A reviewer reading it should be able to tell in two minutes what is real and what is not. Honest gaps (“billing is in test mode; the first customer is on a free early-access plan”) raise trust. Hidden ones destroy it.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Finishing a project is like finishing a wedding cake order: you do not keep adding tiers, you deliver the cake that was ordered, on the day, and you keep the receipt that proves you did it. Keep your product *small*: one kind of user, one job, one plan. “Live” just means someone other than you can open it at a real web address and use it. The “evidence pack” is your receipt book: for each thing you say works, you keep a screenshot, a test result or a note. If you cannot find the proof, say that part is not finished yet. Being honest about unfinished parts is a strength, not a weakness. You can ask your AI tool to explain any step in plain words again whenever you are stuck.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the project as a delivery exercise with a definition of done that a stranger could audit: automated tests for the acceptance criteria in CI, a deployment pipeline with a preview step, migrations that are safe to roll forward and back, observable behaviour (errors, due-but-unsent reminders, webhook failures), and a documented runbook. Record the decisions an agent would otherwise revisit (tenancy model, plan source of truth, time handling) and how each rule is enforced, by the database, by CI or only by an instruction. In the write-up, include a threat model, the evidence of an independent review, and a short retrospective on where AI help was reliable and where it needed correction, with numbers where you have them.',
      },
      {
        type: 'takeaways',
        items: [
          'Finish small: one kind of user, one job, one plan, live with one real user beats a large product that is nearly ready.',
          'Define “live” honestly for your country and provider; a free early-access plan with billing in test mode is acceptable if you say so.',
          'Treat the project as a checklist of claims and the evidence that makes each one true.',
          'Build in slices from SPEC.md, test the rules that matter, and never cut a safety check to save time.',
          'Write a one-page evidence pack that lists what is real, what you cut and the known gaps.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-14-scenario-1',
          kind: 'scenario',
          title: 'Two days to the deadline',
          prompt: 'Choose what to cut.',
          concept: 'scope under time pressure',
          situation: 'Your project is due in two days. Sign-in, the core feature and the deployment work. Left on your list: dark mode, an admin page, the two-customer isolation test, a nicer logo and CSV export. You cannot do everything.',
          options: [
            { text: 'Do the two-customer isolation test first, then the admin page if time allows, and cut dark mode, the logo and CSV export.', consequence: 'You keep the proof that matters most (customers’ data is separate) and drop the cosmetic items. The write-up honestly lists what you cut.', quality: 'best' },
            { text: 'Do dark mode and the logo, since they make the demo look professional.', consequence: 'The product looks good and has never been tested for the worst failure a SaaS can have, so the impression does not match the reality.', quality: 'poor' },
            { text: 'Skip the isolation test and say the app is secure because the pages filter by shop.', consequence: 'You are claiming something you have not shown. A reviewer who tries two accounts will find the gap.', quality: 'poor' },
            { text: 'Do the CSV export first because a customer asked for it.', consequence: 'A real request is a good signal, but with two days left it should not outrank proof that customers’ data cannot leak.', quality: 'acceptable' },
          ],
          hints: [
            'Which item protects customers from the worst failure?',
            'Cosmetic items are the first to cut.',
            'Do the isolation test first, and be honest about what you cut.',
          ],
          explanation: 'When time is short, cut features and polish, never safety checks. The isolation test is both the most important protection and the strongest piece of evidence.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-saas-ai-14-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Why projects stall',
          prompt: 'Tap each common way a final project stalls, and read the remedy.',
          concept: 'finishing a project',
          cards: [
            { front: 'It keeps growing: “just one more feature”', back: 'Write what is out of scope in SPEC.md and treat additions as the next version. Ship the smallest useful thing.' },
            { front: 'Waiting for a perfect launch', back: 'Invite five people. Their first booking will teach you more than another week of polish.' },
            { front: 'No proof for the claims you make', back: 'For every claim keep a test output, screenshot or note. If you cannot, say the part is unfinished.' },
            { front: 'An AI change that nobody read', back: 'Read the diff, run the tests, and have a fresh session review anything touching sign-in, billing or permissions.' },
          ],
          hints: [],
          explanation: 'Most stalled projects stall for one of these reasons, and each has a plain remedy: smaller scope, earlier real users, evidence for every claim, and review of every AI change.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-saas-ai-14-q1',
        prompt: 'What best describes the goal of the final project?',
        choices: [
          'Build every feature on your list before the date, whatever the schedule says and whatever you have to cut',
          'A real person other than you uses a small, honest product on its real address, with evidence for the claims',
          'A demo that works on your own laptop, recorded as a video with screenshots of every screen in the app',
          'A large codebase generated almost entirely by an AI tool, with as many features as the tool could write',
        ],
        answer: 1,
        explanation: 'Finishing means a small product in real use, with proof. A laptop demo or a large unreviewed codebase does not show you can take an idea to real use.',
      },
      {
        id: 'build-saas-ai-14-q2',
        prompt: 'Your payment provider has not yet activated live payments for your country. What is an honest way to launch?',
        choices: [
          'Charge real customers through a personal bank transfer without telling them that billing is not set up yet',
          'Wait until live payments are approved before letting a single person use the product, however long it takes',
          'Launch with a clearly labelled free early-access plan and billing tested in test mode, then add live billing',
          'Pretend that billing is live, collect nothing, and quietly give everyone a refund when they ask about it',
        ],
        answer: 2,
        explanation: 'A free early-access plan lets a real user use the product now, while test-mode billing proves the code. Being open about it keeps the evidence honest.',
      },
      {
        id: 'build-saas-ai-14-q3',
        prompt: 'With two days left, which item should you protect before all others?',
        choices: [
          'The logo and the colour theme, since they are what a reviewer sees first when they open the product',
          'The test that two customers cannot see each other’s data, shown failing first and then passing',
          'A dark mode toggle that matches the phone setting, which several early users have said they would like',
          'A longer FAQ page that answers every question that the first five owners asked you on the calls',
        ],
        answer: 1,
        explanation: 'Customer-data separation is the worst failure a SaaS can have and the best evidence you can offer. Cosmetic work is the first to cut.',
      },
      {
        id: 'build-saas-ai-14-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is an “evidence pack”?',
        choices: [
          'A folder of images and short videos for your marketing, shown on the landing page and in your posts',
          'A list of every file in your project with a note on what each file does, for the next developer',
          'A one-page summary with proof (tests, screenshots, notes) for each claim, including what is unfinished',
          'A contract that you and your first customer sign, which says what the product will do for them',
        ],
        answer: 2,
        explanation: 'An evidence pack is your receipt book: for each claim you keep the proof, and you say honestly where proof is missing.',
      },
      {
        id: 'build-saas-ai-14-q5',
        audience: { min: 'advanced' },
        prompt: 'A reviewer asks which of your rules are actually enforced. What is the strongest answer?',
        choices: [
          'All of them, because every rule is written down in CLAUDE.md and the AI tool reads that file each session',
          'A list naming, for each rule, whether the database, CI, a hook or only an instruction enforces it, with evidence',
          'None of them, since an AI tool can always ignore its instructions and so no rule can ever be enforced at all',
          'Only the rules that the AI tool itself reported as followed in its summary at the end of the last session',
        ],
        answer: 1,
        explanation: 'Instructions are context, not enforcement. The credible answer separates what the system guarantees (RLS, CI checks, hooks) from what is only requested, and points to the evidence for each.',
      },
    ],
    task: {
      title: 'Plan your final project',
      steps: [
        'Write the one-sentence idea, your first user (by name or role), and the date you will invite them.',
        'Run the planning prompt and cut the result down to 8 to 12 slices. Write at least three things that are out of scope.',
        'Copy the evidence table into a file and mark which rows you already have proof for and which you still need.',
        'Decide, for your country and provider, what “live” will mean for payments, and write it in one honest sentence for your evidence pack.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Choose the smallest version you can: one kind of user, one job, one plan. Ask the AI: “Which three things in my plan could I remove and still deliver the one job?” Remove at least one.'] },
      { audience: { min: 'advanced' }, steps: ['Draft the definition of done as automated checks in CI (tests, RLS lint, secret scan, smoke test on the preview), and a table of each rule with how it is enforced.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'build-saas-ai-p1',
    title: 'The foundation: spec, waitlist and a two-customer proof',
    summary: 'Write the spec for your own SaaS, put up a landing page with a safe waitlist, add sign-in, and prove with a failing-then-passing test that one customer cannot see another’s data.',
    outcome: 'A repository with a written spec, a live waitlist page and a test that shows customer data is separated: the three things clients and employers check first when someone says they can build a SaaS.',
    unlockAfterDay: 6,
    steps: [
      { id: 'build-saas-ai-p1-s1', text: 'Write your one-sentence idea and run five conversations with real people who match it. Keep your notes and record at least one commitment or an honest “nobody committed”, with what you will change.' },
      { id: 'build-saas-ai-p1-s2', text: 'Have an AI tool interview you into SPEC.md (user, core flow, data, rules, out of scope, testable acceptance criteria) and add a short CLAUDE.md or AGENTS.md. Edit the spec by hand until every acceptance criterion could fail.' },
      { id: 'build-saas-ai-p1-s3', text: 'Build the landing page with no invented proof, and an insert-only waitlist table with row level security. Show, with saved output, that a visitor can add an email but cannot read the list, and that a repeat or bad email is refused.' },
      { id: 'build-saas-ai-p1-s4', text: 'Add sign-in with an auth service, keep the secret key on the server only, and verify the session on the server. Show that your secret key does not appear in the browser code or the repository.' },
      { id: 'build-saas-ai-p1-s5', text: 'Create two shops, two users and one booking each. Write the two-customer test, show it failing with RLS off and passing after you add policies for select, insert, update and delete.' },
      { id: 'build-saas-ai-p1-s6', audience: { max: 'beginner' }, text: 'You may use a single table (bookings) and a single policy. Ask the AI to explain the policy in a plain sentence, and write that sentence in your README in your own words.' },
      { id: 'build-saas-ai-p1-s7', audience: { min: 'advanced' }, text: 'Put the waitlist insert behind a rate-limited server route, add a CI check that fails when any exposed table has RLS off, and keep the audit of every use of the privileged key with its tenant check.' },
    ],
    submission: {
      kind: 'url',
      label: 'Repository link',
      placeholder: 'https://github.com/yourname/my-saas',
      hint: 'A repository with SPEC.md, the waitlist page link, the SQL and policies, the two-customer test with its failing and passing output, and notes from your five conversations.',
    },
    rubric: [
      'SPEC.md has acceptance criteria that can fail, a clear out-of-scope list, and was edited by the learner, not just generated.',
      'The landing page makes no invented claims and the waitlist lets visitors insert but not read.',
      'The secret key is nowhere in browser code or the repository, and the server verifies the session.',
      'The two-customer test was shown failing before the policies and passing after them, for reads and writes.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The README explains in plain words what the policy does and why a missing policy shows zero rows.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The tests cover update and delete as well as read, and run with a single command.'] },
      { audience: { min: 'advanced' }, items: ['A CI check fails when an exposed table has RLS off, and every use of the privileged key is listed with its tenant check.'] },
    ],
  },
  {
    id: 'build-saas-ai-p2',
    title: 'Your SaaS, live with its first user',
    summary: 'Finish the product from your spec: the core feature, verified billing in test mode, emails, an admin view, analytics and error tracking, a security review and a live deployment, then bring in a first real user.',
    outcome: 'A live subscription product with proof that its core rule, customer separation, billing and security hold, and a note from a real first user: the strongest portfolio piece a builder can show.',
    unlockAfterDay: 13,
    steps: [
      { id: 'build-saas-ai-p2-s1', text: 'Build the core feature in slices from SPEC.md with tests first for the central rule. Show the test output, including a test that running the job twice does the work once.' },
      { id: 'build-saas-ai-p2-s2', text: 'Add plans and billing in the provider’s test mode: hosted checkout, a webhook that verifies the signature over the raw body, ignores duplicate event ids and updates the plan only from verified events. Save the output for a forged, tampered, duplicate and replayed event.' },
      { id: 'build-saas-ai-p2-s3', text: 'Connect a real email sender from your own domain and receive a sign-in email on an address outside your team. Add the usage banner for plan limits and a read-only admin view that checks the admin role on the server.' },
      { id: 'build-saas-ai-p2-s4', text: 'Add four analytics events with no personal data, error tracking tagged with the app version, and a /health route. Trigger one error on purpose and show the report.' },
      { id: 'build-saas-ai-p2-s5', text: 'Run the security checklist in a fresh AI session, fix every FAIL with a test, and replace any joined-text query with a parameterised one. Practise one backup restore.' },
      { id: 'build-saas-ai-p2-s6', text: 'Deploy with separate preview and production settings, write RELEASE.md, check /health, then invite your first batch (five to ten people). Watch the dashboards and talk to your first user.' },
      { id: 'build-saas-ai-p2-s7', text: 'Write the one-page evidence pack: your live URL, the evidence table filled in, what you cut and why, known gaps (including whether billing is in test mode) and what the first user taught you.' },
      { id: 'build-saas-ai-p2-s8', audience: { max: 'beginner' }, text: 'You may launch with a free early-access plan and keep billing in test mode, with one reminder channel (email). Ask the AI to explain each step you did not follow, and write the explanation for your webhook in your own words.' },
      { id: 'build-saas-ai-p2-s9', audience: { min: 'advanced' }, text: 'Add CI that runs the tests, the RLS lint, a secret scan and a smoke test on each preview. Write a threat model, show an independent review session’s findings, and document how each rule is enforced (database, CI, hook or instruction only).' },
    ],
    submission: {
      kind: 'url',
      label: 'Live product link and repository',
      placeholder: 'https://my-saas.example.com (and your repository link)',
      hint: 'Your live URL, your repository, and the evidence pack: test outputs, the two-customer proof, the webhook cases, your security review and a note from a real first user.',
    },
    rubric: [
      'The product is live on a real address and at least one real person other than the learner has used it for the core job.',
      'Customer data is separated by row level security, proved by a test that was seen failing and then passing.',
      'Billing in test or live mode updates plans only from verified, de-duplicated webhooks, and failed payments follow a stated rule.',
      'No secret appears in the repository or the browser, queries are parameterised, and the security checklist was run with each FAIL fixed or consciously accepted.',
      'The evidence pack is honest: it lists what was cut, what is not verified, and whether billing is live.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The learner can explain, in their own words, what the webhook check and the row level security policy protect against.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['Tests run with one command and cover the reminder rule, the isolation test and the four webhook cases.'] },
      { audience: { min: 'advanced' }, items: ['CI enforces the tests, RLS lint and secret scan; a threat model and an independent review are included; each rule says how it is enforced.'] },
    ],
  },
];

export const buildSaasAiCourse: Course = {
  id: 'build-saas-ai',
  kind: 'standard',
  title: 'Build a SaaS Product with AI',
  level: 'intermediate',
  tagline: 'Take a subscription product from idea to live with its first paying user, building with AI.',
  description: 'Build and launch a small subscription product with AI. You validate the idea, write a spec, build a landing page, accounts, the core feature, separate customer data and billing, then secure, deploy and launch it. You finish with your own SaaS, live, with its first user.',
  finishLine: ['A validated idea and a written spec', 'A SaaS with sign-in, separate customer data, billing in test mode and an admin view', 'Your product deployed, monitored and live with its first user'],
  objectives: [
    'Validate a SaaS idea with real evidence before building',
    'Direct an AI tool to build accounts, a core feature and billing from a written spec',
    'Keep each customer’s data separate and prove it with a failing-then-passing test',
    'Verify payment webhooks and handle plan limits and failed payments safely',
    'Secure, deploy, monitor and launch the product, then support it after launch',
  ],
  audiences: ['builder', 'career-changer', 'experienced-dev'],
  skills: [
    { id: 'validate-idea', label: 'Validate an idea' },
    { id: 'product-spec', label: 'Write a product spec' },
    { id: 'landing-waitlist', label: 'Landing page and waitlist' },
    { id: 'auth-accounts', label: 'Accounts and sign-in' },
    { id: 'core-feature', label: 'Build the core feature' },
    { id: 'tenant-isolation', label: 'Separate customer data' },
    { id: 'billing-webhooks', label: 'Billing and webhooks' },
    { id: 'observe-and-notify', label: 'Emails, admin and analytics' },
    { id: 'security-checklist', label: 'Security checklist' },
    { id: 'ship-and-support', label: 'Deploy, launch and support' },
  ],
  lessons,
  projects,
  icon: 'rocket_launch',
  updated: '2026-11-14',
};
