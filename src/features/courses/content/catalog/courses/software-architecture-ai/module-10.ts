import type { Lesson, Project } from '../../../types';

// Module 10: AI-Assisted Architecture Design and Documentation (lessons 35 to 38, no project). Written 2026-11-18.
// Product facts about the assistants come from the shared toolComparison data (content/ai-dev/tools.ts) and one dated version note whose official page was read
// on 2026-11-18. Everything else (TindaTrack, ClinicBook, every number) is invented. Demos are hand-written illustrations with a flaw to catch.

const CHECKED = '2026-11-18';

export const project: Project | null = null;

export const lessons: Lesson[] = [
  {
    id: 'software-architecture-ai-35',
    day: 35,
    title: 'Architecture Prompts for Claude, ChatGPT and Gemini',
    summary: 'Write prompts that state the context, constraints and your own draft, then ask an assistant for assumptions, alternatives, costs and the case against you.',
    intro: {
      objectives: [
        'Explain why an assistant\'s answer follows the shape of your question',
        'Write an architecture prompt with context, constraints, your draft and specific asks',
        'Use the critic, pre-mortem and "what would change your mind" patterns',
        'Compare the same prompt across two assistants and treat differences as information',
      ],
      why: 'An assistant will happily support whatever you suggest. A good prompt turns it from a cheerleader into a reviewer, which is the only way it helps you decide better.',
    },
    minutes: 25,
    skills: ['arch-ai-design'],
    body: [
      { type: 'paragraph', text: `You already know how to chat with an assistant. Architecture asks more of a prompt, because the answer will shape months of work and the assistant has never seen your system, your team or your budget. It will still answer, fluently and with confidence. So the skill is not typing a clever sentence. It is putting your own thinking into the prompt, so the answer tests that thinking instead of replacing it. This lesson gives you a prompt structure for architecture work, a set of patterns that make an assistant behave like a reviewer, and a way to use more than one assistant without being confused by them.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Two TindaTrack developers, Marco and Liza, disagree about the reports feature. Marco is curious about splitting it into its own service. Liza prefers to keep one application. Before the design meeting, each asks an assistant. Marco types: "Why is moving reports into a separate microservice the best choice for TindaTrack?" Liza types: "Why is keeping reports inside the existing application the best choice for TindaTrack?" Both get long, confident answers with tidy bullet points. Each one pastes their answer into the shared design document.` },
      { type: 'paragraph', text: `The meeting runs an hour over. Each side has an "expert opinion" that agrees with them, and nobody notices that both questions had the answer built in. The assistant did what was asked: it argued for the premise. Neither prompt mentioned the number of stores, the team of four, the single server or the six-week deadline. The hour was not the only cost. The decision ended up going to whoever was more persistent, not to the requirements.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `An assistant continues the conversation you give it. A question that begins "why is X the best" contains its own answer, so you get a defence of X. A question with no constraints gets the answer that fits most systems, which is usually the fashionable one. Your job is to put into the prompt the things only you know, and to ask for the things you need: assumptions, alternatives, costs and risks. Here is a structure you can reuse. Think of it as a short brief to a colleague who is clever, new to the project and eager to please.` },
      { type: 'diagram', format: 'mermaid', source: `flowchart TD
  Draft[Your own draft decision and reasons] --> Prompt[Prompt: context, constraints, asks, role]
  Req[Requirements and constraints you wrote] --> Prompt
  Prompt --> Answer[Assistant answer]
  Answer --> Check{Does each claim match your requirements?}
  Check -->|No| Revise[Fix the prompt or reject the claim]
  Check -->|Yes| Decide[You decide and write an ADR]
  Revise --> Prompt`, caption: `The loop. Your draft and requirements go in, the assistant's answer is a hypothesis, and you check each claim against the requirements before you decide. Look at the arrow back to the prompt: a bad answer usually means a missing line in the prompt.` },
      { type: 'list', items: [
        '**Context:** what the system is, who uses it, rough scale (labelled as an estimate), the team and the current setup.',
        '**Constraints:** budget, deadlines, skills, existing systems you must keep, rules you must follow. These are what stop generic answers.',
        '**The decision:** one sentence, and your own draft answer with your reasons. State your lean, so the assistant can attack it.',
        '**Asks:** assumptions, at least three alternatives including the simplest, the cost of each (people, time, complexity, money in relative terms), failure modes, and what would change your mind.',
        '**Role:** "act as a critic of my draft", not "design it for me".',
        '**Format and honesty:** a table or short sections; say what you cannot know; mark anything you are not sure of.',
      ] },
      { type: 'table', headers: ['Pattern', 'What you write', 'What it prevents'], rows: [
        ['Critic', '"Find the weakest points in my draft; do not rewrite it."', 'An assistant that only agrees with you'],
        ['Assumptions list', '"List every assumption you are making, and how I can check each one."', 'Hidden assumptions about scale, team or budget'],
        ['Alternatives with cost', '"Give three options, including the simplest, and the cost of each in people, time and complexity."', 'One fashionable answer with no price tag'],
        ['Pre-mortem', '"Imagine this design failed a year from now. List the five most likely reasons."', 'Missing failure modes'],
        ['Change my mind', '"What facts would make the other option better?"', 'Locking into a choice with no exit'],
        ['Questions first', '"Before answering, ask me the five questions you most need answered."', 'Answers built on guesses about your system'],
      ], caption: 'Six patterns. Pick two or three per prompt; a prompt with all six becomes a wall of text.' },
      { type: 'paragraph', text: `**Using more than one assistant.** Claude, ChatGPT and Gemini are different products with different features, and they change often. Rather than trust a claim about which is "best at architecture", run the same prompt on two of them with your own design and compare. Where they agree, you still verify. Where they disagree, you have found an assumption: ask each one why, then test the difference against your requirements. A disagreement is information, not a problem. For the products themselves, the comparison below is drawn from one dated file the course keeps in step with the official pages. Look at how each one receives your context, since that changes what you should paste or upload.` },
      { type: 'toolComparison', tools: ['claude', 'chatgpt', 'gemini'], caption: 'Three chat assistants as described in the course\'s dated tool notes. Check the linked official pages before you rely on a plan or a feature.' },
      { type: 'version', text: `Claude's Help Center describes projects as self-contained workspaces with their own chat histories and knowledge bases: you can add files and project instructions, and Claude uses that knowledge as context for the chats in that project. A good use for architecture is a project holding your requirements and your decision records, so every prompt starts from the same facts.`, checked: CHECKED, sources: [{ label: 'Claude Help Center: What are projects?', url: 'https://support.claude.com/en/articles/9517075-what-are-projects' }] },
      { type: 'visual', id: 'arch-assistant', caption: 'Tali, the course\'s architecture assistant, states her assumptions, asks for missing information and explains her reasoning. Use her when you want a hint or a question instead of a design.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: an AI assistant is like a very eager new colleague who has never seen your project. If you ask, "Isn't it smart to split our app in two?", they will find reasons to agree, because you sounded like you wanted a yes. If you say, "Here is our situation and what I am leaning towards. What am I missing, and what would go wrong?", you get a useful second pair of eyes. The facts you give (how many users, how big the team, what money you have) are what turn a generic answer into one that fits you.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a team, treat your best architecture prompts as shared artefacts. Keep a prompt template in the repository next to the decision records, review changes to it like code, and note which assistant and which date an answer came from, since the same prompt can give different answers after a product update. Keep requirements and constraints in one place that every prompt pulls from, so a model is never answering from a stale summary. Be careful with what you paste: design documents can contain customer details, internal addresses and credentials. Redact them, and check your organisation's policy on which assistants are allowed for which material. A long conversation also drifts: for a significant decision, start a fresh chat with the final requirements and your draft, so that earlier guesses do not leak into the answer.` },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'If you already ask an assistant for code, asking it about architecture feels similar but the risk differs: code fails loudly when it runs, while a weak design can look reasonable for months. So you give it your requirements, ask for its assumptions and alternatives, and treat the answer as a draft to test.' },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'A leading question gets a defence of the premise', prompt: `Why is moving reports into a separate microservice the best choice for TindaTrack?`, output: `Moving reports into a separate microservice is the best choice for TindaTrack for several reasons:\n\n1. Independent scaling: the reports service can scale on its own when owners check their numbers in the morning.\n2. Fault isolation: a failure in reports will not affect sales entry.\n3. Technology freedom: the team can pick the best database for analytics.\n4. Team autonomy: a dedicated team can own the service end to end.\n\nTo support the expected volume of 10 million events per day, use an event bus and a separate analytics database.`, notice: `Check four things. First, the question assumed the answer, so no alternatives appear. Second, "10 million events per day" is a figure nobody supplied: it was invented to fit the recommendation. Third, nothing mentions the constraints that matter here (a team of four, one server, six weeks), so team autonomy and technology freedom are benefits TindaTrack cannot use. Fourth, there is no cost: a second service, a bus and a second database are things the team must build and run. A better prompt states the constraints and your lean, then asks for the case against it.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Pick a real decision you face. Write the requirements and constraints in a few lines first, then your own draft answer in two sentences. Then use this prompt, and run it in two different assistants if you can. Keep both answers.` },
      { type: 'prompt', label: 'Architecture decision prompt', text: `Context: [what the system is, who uses it, rough scale labelled as an estimate, team size and skills, current setup].\nConstraints: [budget, deadline, technologies we must keep, anything we cannot do].\nDecision to make: [one sentence].\nMy draft answer and my reasons: [two or three sentences].\n\nAct as a critic of my draft, not as a designer. Please:\n1. Before answering, ask me up to five questions you most need answered.\n2. List your assumptions about my system as a table, with how I can check each one.\n3. Give three options, including the simplest one that meets the constraints. For each, state the cost in people, time and complexity (relative terms, no prices), the main failure mode and what would make it the better choice.\n4. Imagine my draft failed in a year and list the five most likely reasons.\n5. State what you cannot know without seeing the real system, and mark any claim you are not sure of.\nDo not recommend a tool or service unless one of my constraints needs it.` },
      { type: 'paragraph', text: `Verify: put the two answers side by side. Where do they disagree, and which assumption explains it? Does any recommendation need something outside your constraints? Check every product fact against the official documentation, and then make the decision yourself.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write the "context and constraints" block for your current project once, and keep it in a file you paste into every architecture prompt.',
        'Run the decision prompt in two assistants and write down one assumption that differed.',
        'Open `arch-assistant` (Tali) with the same decision and compare how she asks questions with how the chat assistants did.',
        'Next lesson, Diagrams as Code: C4, Sequence and Data-Flow Diagrams, shows how to draw the result and check AI-written diagrams.',
      ] },
      { type: 'takeaways', items: [
        'An assistant\'s answer follows your question: "why is X best" gets a defence of X, and a prompt without constraints gets the fashionable answer.',
        'Put context, constraints, your own draft and specific asks in the prompt, and ask for the case against you.',
        'Use the critic, assumptions, alternatives-with-cost, pre-mortem, change-my-mind and questions-first patterns, two or three at a time.',
        'Run the same prompt on two assistants: where they differ, an assumption is hiding, so test it against your requirements.',
        'Treat product claims as things to check in official documentation, and never paste secrets or customer data into a prompt.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-35-prompt-lab-1',
          kind: 'prompt-lab',
          labId: 'arch-10-compare-prompts',
          title: 'Lab: a weak prompt and a strong prompt on the same facts',
          prompt: 'Run the weak starter as Prompt A. Write Prompt B with context, constraints, your draft, and asks for assumptions, alternatives with cost and the case against you. Compare the two answers.',
          concept: 'architecture prompts',
          hints: [
            'Run the weak prompt first and look for what the answer had to guess.',
            'Put the facts from the material into the prompt and state your own lean in one sentence.',
            'Ask for assumptions, three options with the simplest included, the cost of each, and what you cannot know.',
          ],
          explanation: 'The second prompt changes the answer because it states constraints and asks for a critique, so the model has less to guess and more to test. Check each claim against the material: another run may differ, and the review is a guide.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-35-scenario-1',
          kind: 'scenario',
          title: 'Fix the leading prompt',
          prompt: 'Choose the best rewrite.',
          concept: 'architecture prompts',
          situation: 'A teammate wants to move TindaTrack\'s database to a different kind of database. They typed: "Why is switching to a NoSQL database the right call for our sales data?" The answer was enthusiastic and long. You know the team of four has strong SQL skills, the data is clearly tabular and reports use joins. You have to rewrite the prompt before it goes into the design document.',
          options: [
            { text: 'Describe the data, the team skills and the report needs, say "I lean towards keeping SQL", and ask for the case for switching, the case against, the simplest option, and what would change your mind.', consequence: 'The answer gives a balanced comparison, flags the cost of retraining the team, and names one condition (a very different access pattern) that would make switching worthwhile. The document records the decision with its reason.', quality: 'best' },
            { text: 'Ask the same question but add "be objective" at the end.', consequence: 'The tone becomes slightly more careful, but the premise is still inside the question, and the answer still assumes the switch is right.', quality: 'poor' },
            { text: 'Ask the opposite question: "Why is keeping SQL the right call?" and put both answers in the document.', consequence: 'You now have two persuasive documents and no comparison. Each assumes its own conclusion, and the meeting repeats the earlier argument.', quality: 'poor' },
            { text: 'Ask "Which is better, SQL or NoSQL?" with no other detail.', consequence: 'The answer is a general comparison that fits any system. It is balanced, but it ignores what makes your system different.', quality: 'acceptable' },
          ],
          hints: [
            'Which option puts your real facts and your lean into the prompt?',
            'Adding "be objective" does not change what the question assumes.',
            'Two one-sided answers are not a comparison.',
          ],
          explanation: 'A good rewrite removes the built-in answer, adds the constraints only you know and asks for the case for, the case against and the simplest option. The assistant then helps you test your lean instead of echoing the question.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-35-match-1',
          kind: 'match',
          title: 'Which pattern would have caught this?',
          prompt: 'Match each problem to the prompt pattern that would have caught it.',
          concept: 'prompt patterns',
          labels: { terms: 'What went wrong', meanings: 'Pattern that helps' },
          pairs: [
            { term: 'The assistant assumed 10 million events a day and nobody noticed until the design was reviewed.', definition: 'Assumptions list: every assumption, with how to check it', note: 'The made-up number was an assumption. A table of assumptions would have shown it.' },
            { term: 'The answer recommended a design that is hard to undo and never said what would make it wrong.', definition: 'Change my mind: what facts would make the other option better?', note: 'This pattern forces the answer to name its own exit condition.' },
            { term: 'The design looked fine, then failed on the first day the payment provider was slow.', definition: 'Pre-mortem: imagine it failed and list the likely reasons', note: 'A pre-mortem pushes the assistant to think about failure, not just the happy path.' },
            { term: 'The answer fitted any company because the prompt said almost nothing about the team or the deadline.', definition: 'Questions first: ask me what you most need to know', note: 'Asking questions first makes the missing context visible before the answer is written.' },
          ],
          hints: [
            'Which pattern asks the assistant to look at failure rather than success?',
            'A hidden number is an assumption. Which pattern lists assumptions?',
            'A generic answer usually means the prompt lacked context. Which pattern fixes missing context?',
          ],
          explanation: 'Each pattern guards against one failure: hidden assumptions, no exit, missing failure modes, and missing context. Choosing the pattern that fits the problem is faster than writing a longer prompt.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-35-q1',
        prompt: 'Two developers ask an assistant "why is A the best choice?" and "why is B the best choice?" and each gets a convincing answer. What went wrong?',
        choices: [
          'The assistant is unreliable, so neither answer is worth reading, and a different tool would give the correct one, provided the question is asked politely and in full sentences',
          'Both developers should have asked for a longer answer so that the reasons could be compared in more detail',
          'Each question contained its own answer, so the assistant argued for the premise instead of testing it against the system\'s constraints',
          'The assistant favours whichever option is mentioned first in a conversation, which is a known and fixed rule',
        ],
        answer: 2,
        explanation: 'An assistant continues the conversation it is given. "Why is X best" assumes X is best, so you get a defence. Asking for the case for, the case against and the constraints is what makes it a review.',
      },
      {
        id: 'software-architecture-ai-35-q2',
        prompt: 'Why do the constraints (team size, deadline, budget, existing systems) matter in an architecture prompt?',
        choices: [
          'Without them, the assistant answers with the choice that fits most systems, which is often a fashionable and heavier design',
          'They make the answer longer, and a longer answer is more likely to contain the right solution',
          'They are needed only for legal reasons, since an assistant must know the rules before giving advice',
          'They let the assistant ask for your permission before it answers, which keeps the conversation polite and avoids any chance of the assistant guessing what you meant to ask',
        ],
        answer: 0,
        explanation: 'Constraints are what stop a generic answer. A team of four with six weeks cannot use the same design as a company with many teams, and only your prompt can say so.',
      },
      {
        id: 'software-architecture-ai-35-q3',
        prompt: 'You run the same architecture prompt in two assistants and they recommend different designs. What is the best use of this?',
        choices: [
          'Pick the answer from the assistant you trust more and discard the other, because a tool you know well has proved itself on your earlier questions and the other one has not',
          'Run the prompt a third time and go with the majority',
          'Combine both designs into one, since each one has good ideas',
          'Find the assumption behind each difference, ask each assistant why, and test that assumption against your requirements',
        ],
        answer: 3,
        explanation: 'A difference between assistants usually points to a hidden assumption, such as the expected scale. Finding and checking it is more reliable than voting, trusting a brand, or merging two designs.',
      },
      {
        id: 'software-architecture-ai-35-q4',
        prompt: 'An assistant tells you that a certain tool has a feature you plan to build around. What should you do before depending on it?',
        choices: [
          'Ask the assistant to repeat the claim with more detail, so you can judge whether it is consistent',
          'Check the feature in the tool\'s official documentation and note the date you checked',
          'Search for a blog post that mentions the feature, because blog posts are more up to date',
          'Assume it is right, since assistants are trained on the documentation of most tools',
        ],
        answer: 1,
        explanation: 'Product facts change and assistants can be wrong or out of date. The official documentation is the source, and a dated note records when you checked.',
      },
      {
        id: 'software-architecture-ai-35-q5',
        audience: { max: 'beginner' },
        prompt: 'Why does "Here is our situation and what I lean towards. What am I missing?" work better than "Isn\'t it smart to do X?"',
        choices: [
          'It is shorter, and short questions are easier for an assistant to read.',
          'The assistant is always more polite when you use the word "missing".',
          'It gives real facts and invites a critique, instead of hinting at the answer you want.',
        ],
        answer: 2,
        explanation: 'A question that hints at its answer gets agreement. A prompt with facts and an invitation to find gaps gets a review.',
      },
      {
        id: 'software-architecture-ai-35-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team wants to use assistants for design reviews consistently. Which practice helps most?',
        choices: [
          'Keep a shared prompt template and a single requirements file in the repository, review changes to them, and record which assistant and date each answer came from',
          'Let each developer keep a private prompt that works for them, and compare results only when someone disagrees',
          'Choose one assistant for the whole company and forbid the others, so that every answer comes from the same product',
          'Ask the assistant to remember the requirements in a long conversation and keep using that one chat for the entire project, so that it always has the full history of your earlier decisions',
        ],
        answer: 0,
        explanation: 'Shared, versioned templates and one source of requirements make answers comparable over time. Private prompts drift, a single tool does not remove errors, and a long chat accumulates guesses.',
      },
    ],
    task: {
      title: 'Turn a vague architecture question into a review',
      steps: [
        'Choose a real design decision. Write your context and constraints in five lines, and your own draft answer in two sentences.',
        'Write the vague version of the question you would normally type, and run it in one assistant. Save the answer.',
        'Run the "Architecture decision prompt" with your details in the same assistant, and then in a second one if you can. Save the answers.',
        'Write down three differences: what each answer assumed, what options appeared, and what cost was named. Then write the decision and the one fact that could change it.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Turn the prompt into a template file for your team, with placeholders for context, constraints, draft and asks. Add a short "what not to paste" list, and a line to record the assistant and date used. Ask a colleague to run it on a different decision and tell you what was unclear.'] },
      { audience: { max: 'beginner' }, steps: ['Do only the context and one ask: write four lines of context and ask the assistant to list its assumptions as a table. Check one assumption yourself.'] },
    ],
  },
  {
    id: 'software-architecture-ai-36',
    day: 36,
    title: 'Diagrams as Code: C4, Sequence and Data-Flow Diagrams',
    summary: 'Keep architecture diagrams as text next to the code, pick the right view for each question, and validate every AI-written diagram.',
    intro: {
      objectives: [
        'Explain why a diagram kept as text stays more honest than a picture in a slide',
        'Choose between a C4 view, a sequence diagram and a data-flow diagram for a given question',
        'Write a small C4 container diagram and a sequence diagram as text',
        'Validate an AI-written diagram for syntax, invented parts, arrow direction and level',
      ],
      why: 'A diagram that nobody can update becomes wrong, and a wrong diagram is worse than none. Text diagrams are reviewed with the code, and checking an AI-drawn one takes minutes when you know what to look for.',
    },
    minutes: 26,
    skills: ['arch-ai-design'],
    body: [
      { type: 'paragraph', text: `Most architecture diagrams die the same way. Somebody draws a good one in a slides or drawing tool, exports a picture and puts it on a wiki page. Six months later the system has changed and the picture has not, because updating it means finding the original file, redrawing boxes and exporting again. This lesson is about a different habit: keep the diagram as text, in the same repository as the code, so changing the design and changing the diagram happen in the same review. You will also learn the one thing that makes AI useful for diagrams, which is checking its drawing before you trust it.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `A new TindaTrack developer, Paolo, joined in the spring. His first task was to add an order-status update. He used the architecture picture on the wiki, which showed a message queue between the API and the order service, and he built his feature to publish to that queue. The queue had been removed three months earlier, when the team decided it was overkill for the volume. Nobody had updated the picture, because it was a screenshot of a slide.` },
      { type: 'paragraph', text: `Paolo lost about two days building against a part that no longer existed, and the team lost a little trust in its own documents. After that, the team moved its diagrams to text files in the repository, and a rule was added to the pull request template: "Does this change the architecture? If yes, update the diagram." The diagrams were not prettier. They were correct more often, and anyone could see in a pull request what had changed.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `A **diagram as code** is a small text file that describes boxes and arrows. A tool turns it into a picture. Because it is text, you get things a picture cannot give you: you can see in a pull request exactly which arrow changed, you can keep old versions, you can copy it into a decision record, and an assistant can read and write it. The cost is that the layout is chosen by the tool, so the result is plainer than a hand-drawn slide. Mermaid is a widely used text format, and the course's workbench draws a safe subset of it, including the C4 views. Real tools may support more or less, and may differ between versions, so check the documentation of the renderer you use.` },
      { type: 'paragraph', text: `The most useful skill is choosing the right view for the question. One diagram cannot answer everything, and mixing levels is the commonest mistake. Here is the choice, using views you have met: the C4 views from the system design module, the sequence diagram from the module on components and communication, and the data-flow diagram from the threat modelling lesson.` },
      { type: 'table', headers: ['Question', 'Diagram', 'Shows', 'Does not show'], rows: [
        ['Who uses the system and what else does it touch?', 'C4 context', 'People, the system as one box, external systems', 'Anything inside the system'],
        ['What are the deployable or runnable parts and how do they talk?', 'C4 container', 'Web app, API, database, queues, with technology', 'Code structure, timing'],
        ['What are the main parts inside one container?', 'C4 component', 'Modules and their dependencies in one container', 'Other containers in detail'],
        ['In what order do messages flow for one scenario?', 'Sequence', 'Who calls whom, in order, for one flow', 'The whole system at once'],
        ['Where does data go and where does it cross a trust boundary?', 'Data-flow', 'Data stores, flows and boundaries', 'Order and timing'],
      ], caption: 'Pick the view from the question. If a diagram needs two levels at once, draw two diagrams.' },
      { type: 'diagram', format: 'mermaid', source: `C4Container
  title TindaTrack containers after online payments
  Person(owner, "Store owner", "Tracks stock and sales")
  System_Boundary(app, "TindaTrack") {
    Container(web, "Web app", "TypeScript", "The owner's screens")
    Container(api, "API", "Node.js", "Business rules")
    Container(hook, "Webhook receiver", "Node.js", "Checks and applies payment results")
    ContainerDb(db, "Database", "PostgreSQL", "Stores, products, sales, orders")
  }
  System_Ext(wallet, "E-wallet provider", "Takes online payments")
  Rel(owner, web, "Uses")
  Rel(web, api, "Calls", "HTTPS/JSON")
  Rel(api, db, "Reads and writes", "SQL")
  Rel(api, wallet, "Starts payments", "HTTPS")
  Rel(wallet, hook, "Sends payment results", "HTTPS webhook")
  Rel(hook, db, "Marks orders paid", "SQL")`, caption: `A container view: one level only. Look at the external system outside the boundary and at the label on each arrow, which says what happens and with what technology. There is no queue, because no requirement needs one.` },
      { type: 'diagram', format: 'mermaid', source: `sequenceDiagram
  actor Customer as Customer
  participant Web as Web app
  participant Api as TindaTrack API
  participant Wallet as E-wallet provider
  participant Hook as Webhook receiver
  Customer->>Web: Pay for the order
  Web->>Api: Create the order
  Api->>Wallet: Start the payment
  Wallet-->>Customer: Ask to approve
  Wallet->>Hook: Send the signed payment result
  Hook->>Api: Verify the signature and mark the order paid
  Api-->>Web: Order status`, caption: `A sequence diagram for one scenario: a payment. Read it from top to bottom. It makes the order of events and the signed result from the provider easy to discuss, which the container view could not show.` },
      { type: 'code', language: 'text', label: 'The source of a small data-flow diagram, as stored in a file such as docs/architecture/checkout-flow.md', code: `flowchart LR
  Browser((Customer browser)) -->|HTTPS| Api[TindaTrack API]
  Api -->|SQL| Db[(Orders database)]
  Wallet((E-wallet provider)) -->|Signed webhook| Hook[Webhook receiver]
  Hook -->|Marks order paid| Db` },
      { type: 'paragraph', text: `**Validating an AI-written diagram.** An assistant is quick at producing diagram text, and it makes the same kinds of mistakes every time. A diagram that draws without errors can still be wrong. Work through these checks in order. **1. Does it parse?** Paste it into the \`arch-diagram-workbench\`; fix syntax errors one line at a time. Assistants often use features a renderer does not support, such as nested groups or styling. **2. Is every element in the requirements?** Each box and arrow must trace to something you decided. Cross out the rest. **3. Do the arrows point the right way?** An arrow means "calls" or "sends data to"; assistants sometimes draw a database calling an API. **4. Is it one level?** Containers and code classes in one picture mean two diagrams. **5. Is it small enough?** Past about fifteen elements, split it. **6. Is anything missing?** External systems, the human actors and trust boundaries are often left out. **7. Is it saved and dated?** Store the text in the repository and record where it came from.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a diagram as code is like a recipe written on a card instead of a photo of a finished dish. With the card, anyone can change an ingredient and everyone can see what changed. With the photo, you can only guess. A C4 diagram is like zooming a map: first the whole country (who uses the system), then the cities (the parts that run), then one street (what is inside one part). A sequence diagram is a strip of comic panels: it shows what happens first, second and third in one situation.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or older system, the question is who keeps the diagrams true. Put each diagram next to the code it describes, give it an owner and link it from the decision records that explain it. Add a line to the pull-request template and, where possible, check the diagram against something real: a list of deployed services, an import-graph report or the configuration of the environment. Keep a small number of diagrams that people really read: a context diagram, one container view and a few sequence diagrams for the flows that matter, rather than hundreds that nobody maintains. When an assistant generates a diagram from your code, treat it as a hypothesis about what the code does, and check it against runtime behaviour. Generated diagrams show the structure of the code, which is not always the structure of the system.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'An AI-drafted container diagram with several problems', prompt: `Draw a container diagram in Mermaid for TindaTrack: a browser app, a Node API, a PostgreSQL database and an e-wallet provider for payments. Team of four, one server.`, output: `flowchart TD\n  subgraph Platform\n    Gateway[API Gateway] --> Auth[Auth Service]\n    Gateway --> Orders[Order Service]\n    Orders --> Kafka[(Kafka)]\n    Kafka --> Reports[Report Service]\n    Cache[(Redis)]\n  end\n  Database[(PostgreSQL)] --> Orders\n  Web[React App] --> Gateway\n  Orders --> Wallet[E-wallet]`, notice: `Check it against the seven checks. It uses subgraph, which the workbench does not support, so it fails the parse. It adds an API gateway, an auth service, Kafka, a report service and Redis, none of which the requirements mention, for a team of four with one server. The arrow from the database to the order service points the wrong way: the service reads and writes the database. The wallet's payment result has no way back in. The labels say nothing about what each arrow means. Start from the container view in this lesson, remove everything you cannot trace to a requirement, and ask the assistant to fix only the parts you name.` },
      { type: 'visual', id: 'arch-diagram-workbench', caption: 'Open the workbench, paste the diagram text from the demo, and read the errors. Then rewrite it as a single-level container diagram of TindaTrack and save the version you trust.' },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Draw the context or container diagram of your own system by hand first, as text in the workbench. Then ask an assistant to review the text. Do not ask it to draw one from scratch, because you will not know what it invented.` },
      { type: 'prompt', label: 'Review my diagram text', text: `Here is my architecture diagram as Mermaid text for [system]: \n[paste the text from the workbench]\n\nMy requirements and constraints: [list]. Review only the diagram. Please:\n1. List every element that does not trace to my requirements.\n2. Check the direction and label of every arrow and list any that look wrong or unclear.\n3. Tell me whether it mixes levels (for example containers and code) and what to split.\n4. List any external system, person or trust boundary that I may have left out, as questions.\n5. If you suggest corrected text, change only what you point out, use only flowchart, sequenceDiagram or C4 syntax without nested groups or styling, and say what you changed.\nState what you cannot know about my real system.` },
      { type: 'paragraph', text: `Then verify: paste any corrected text back into the workbench and make sure it parses. Compare the changes with the original and keep only the ones you can justify from your requirements.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Move one diagram of your current project from a picture to text, in the repository next to the code, with a date and an owner.',
        'Add a line to your pull-request template: "Does this change the architecture? If so, update the diagram."',
        'Next lesson, Architecture Decision Records and Comparing Design Alternatives, shows how to record why the diagram looks the way it does.',
        'Read the documentation of the diagram tool you use (for Mermaid, its own site) to see which syntax your version supports.',
      ] },
      { type: 'takeaways', items: [
        'A diagram kept as text, next to the code, is reviewed and updated with the design, so it is wrong less often.',
        'Choose the view from the question: C4 context, container or component for structure, a sequence diagram for one flow in order, a data-flow diagram for data and trust boundaries.',
        'One diagram, one level: if two levels are needed, draw two diagrams.',
        'Validate an AI-written diagram in order: parse it, trace every element to a requirement, check arrow directions, check the level, check the size, look for what is missing, then save it with its source and date.',
        'A diagram that renders is not a diagram that is right: the assistant\'s invented parts are the usual problem.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-36-match-1',
          kind: 'match',
          title: 'Which diagram answers the question?',
          prompt: 'Match each question to the diagram that answers it best.',
          concept: 'choosing a diagram',
          labels: { terms: 'Question', meanings: 'Best diagram' },
          pairs: [
            { term: 'A new teammate asks in what order the browser, API and e-wallet exchange messages when a payment succeeds.', definition: 'A sequence diagram of the payment', note: 'The question is about order over time for one scenario.' },
            { term: 'A client asks which outside systems TindaTrack depends on and who uses it.', definition: 'A C4 context diagram', note: 'The system is one box here; people and external systems are the point.' },
            { term: 'A reviewer asks where sale data is stored and where it crosses from outside into your system.', definition: 'A data-flow diagram with trust boundaries', note: 'The question is about data and boundaries, not timing.' },
            { term: 'You must show the web app, API, webhook receiver and database, and the technology each one uses.', definition: 'A C4 container diagram', note: 'The parts that run, with technology, are containers.' },
          ],
          hints: [
            'Ask whether the question is about order in time, about people and outside systems, about data and boundaries, or about the parts that run.',
            'Only one of the four needs the system drawn as a single box.',
            'The word "technology" points to containers.',
          ],
          explanation: 'Each view answers one kind of question. Time order belongs to a sequence diagram, outside systems to a context diagram, data and boundaries to a data-flow diagram, and running parts to a container diagram.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-36-arrange-1',
          kind: 'arrange',
          title: 'Order the validation of an AI-drawn diagram',
          prompt: 'Arrange the checks in the order you should run them.',
          concept: 'validating diagrams',
          language: 'text',
          solution: [
            'Paste the text into the workbench and fix every parse error',
            'Trace each box and arrow to a requirement and cross out the invented ones',
            'Check that every arrow points the right way and has a clear label',
            'Check that the diagram stays at one level and is small enough',
            'List what is missing: outside systems, people, trust boundaries',
            'Save the final text in the repository with its date and source',
          ],
          reasons: [
            'A diagram that does not parse cannot be reviewed.',
            'Invented parts are the commonest and most costly error.',
            'Direction and labels are cheap to check once the parts are right.',
            'Level and size are properties of the whole once its elements are settled.',
            'Missing elements are easiest to see in a cleaned-up diagram.',
            'Only a checked diagram is worth keeping.',
          ],
          hints: [
            'What must be true before you can even read the diagram?',
            'Remove invented parts before spending time on arrows between them.',
            'Saving comes last: you keep only what you trust.',
          ],
          explanation: 'Parse first, remove invented parts, check arrows, check level and size, look for gaps, then save. Each step makes the next one cheaper.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-36-scenario-1',
          kind: 'scenario',
          title: 'It renders, so is it right?',
          prompt: 'Choose the best next step.',
          concept: 'validating diagrams',
          situation: 'An assistant drew a container diagram for TindaTrack. It renders cleanly in the workbench. It has seven boxes: web app, API, database, e-wallet provider and three you do not recognise: "Notification service", "Message bus" and "Config service". Your requirements mention none of the last three. A colleague says, "It looks professional. Let\'s put it in the design document."',
          options: [
            { text: 'Ask where each of the three unknown boxes comes from in the requirements, remove those you cannot trace, and ask the assistant to redraw only the confirmed parts.', consequence: 'Two boxes disappear, and one (text reminders) turns out to be a real requirement you had forgotten to write down. The diagram and the requirements now agree.', quality: 'best' },
            { text: 'Keep the diagram and add a note that the three extra boxes are "future work".', consequence: 'The document now describes a system the team is not building, and a new developer starts planning for the message bus.', quality: 'poor' },
            { text: 'Accept the diagram because it renders without errors.', consequence: 'A diagram that parses is only syntactically valid. The invented parts stay and set the expectations of the next feature.', quality: 'poor' },
            { text: 'Delete the three boxes without asking and move on.', consequence: 'The diagram is simpler, but you miss that one of them pointed to a real, unwritten requirement, which resurfaces later.', quality: 'acceptable' },
          ],
          hints: [
            'A diagram that parses is only syntactically valid. What else must be true of every box?',
            'Which option traces each box to a requirement instead of deleting or keeping them blindly?',
            'A box may be wrong or may reveal a missing requirement.',
          ],
          explanation: 'Every element must trace to a requirement. Asking where each box comes from removes inventions and may also expose a real requirement that was never written down.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-36-q1',
        prompt: 'What is the main advantage of keeping architecture diagrams as text in the repository?',
        choices: [
          'Text diagrams look more attractive than hand-drawn ones, so people read them more often',
          'They can be reviewed and versioned with the code, so a design change and its diagram change show up in the same pull request',
          'They never need updating, because the tool redraws them from the running system',
          'They can be opened by anyone without a tool, since text is always understood the same way, whereas a picture needs the original program that drew it to be opened and changed',
        ],
        answer: 1,
        explanation: 'The benefit is process: the diagram is part of the change and visible in review. Layout is plainer, someone still has to update it, and you need a renderer to see the picture.',
      },
      {
        id: 'software-architecture-ai-36-q2',
        prompt: 'You need to show the order of messages between the browser, the API and the e-wallet provider when a payment is confirmed. Which diagram fits?',
        choices: [
          'A C4 context diagram, because the e-wallet provider is an external system',
          'A C4 component diagram of the API, because the logic lives there',
          'A data-flow diagram with the trust boundary marked, since the provider is outside',
          'A sequence diagram of the payment scenario, because the question is about order over time',
        ],
        answer: 3,
        explanation: 'Order over time for one scenario is the job of a sequence diagram. The other views show structure or data, not timing.',
      },
      {
        id: 'software-architecture-ai-36-q3',
        prompt: 'An AI-written diagram renders without errors. What must you still check?',
        choices: [
          'That every element and arrow traces to a requirement, that arrows point the right way and that the diagram stays at one level',
          'That the colours match your company style, because the assistant picks them at random',
          'That the diagram has at least ten elements, since smaller ones are not useful to a design review',
          'Nothing further: a diagram that renders has been validated by the renderer, so any remaining problems would already have been shown as errors',
        ],
        answer: 0,
        explanation: 'A renderer checks syntax only. Meaning is yours to check: invented parts, reversed arrows and mixed levels all draw perfectly well.',
      },
      {
        id: 'software-architecture-ai-36-q4',
        prompt: 'A diagram shows the people, the web app, the API, the database and an outside payment provider, with the technology on each box. Which C4 level is it?',
        choices: [
          'Context, because it shows the people and the outside provider',
          'Component, because it shows the API and the database',
          'Container, because it shows the parts that run and their technology',
          'Code, because it names the technology of each part',
        ],
        answer: 2,
        explanation: 'The container level shows the parts that run or store data, with technology. Context would show the system as one box, and component shows the inside of a single container.',
      },
      {
        id: 'software-architecture-ai-36-q5',
        audience: { max: 'beginner' },
        prompt: 'In the recipe-card comparison, why is a text diagram easier to keep correct than a picture?',
        choices: [
          'Because pictures are always blurry.',
          'Because anyone can change one line and everyone can see what changed.',
          'Because text diagrams are never wrong.',
        ],
        answer: 1,
        explanation: 'A small change to text is visible and reviewable. A screenshot has to be redrawn, and nobody can see what changed.',
      },
      {
        id: 'software-architecture-ai-36-q6',
        audience: { min: 'advanced' },
        prompt: 'A large team has hundreds of architecture diagrams and nobody trusts them. What is the most useful change?',
        choices: [
          'Ask an assistant to regenerate all of them from the code, and replace the old ones every quarter, so that every diagram in the repository always matches the latest version of the system',
          'Archive them all and rely on the code as the only documentation',
          'Keep a few diagrams that people really read, store each beside the code it describes with an owner, link them from decision records, and check them in pull requests',
          'Appoint one person to redraw every diagram by hand each month and publish a new set',
        ],
        answer: 2,
        explanation: 'Fewer, owned diagrams that are part of the change process stay true. Regenerated diagrams show code structure, not necessarily system structure, and a monthly redraw by one person does not scale.',
      },
    ],
    task: {
      title: 'Put one real diagram into text and check it',
      steps: [
        'Choose one view of your own system: a context, a container diagram or a sequence for your most important flow. Write it as Mermaid or C4 text in the `arch-diagram-workbench` and save it.',
        'Ask an assistant to review your text with the prompt in this lesson. Do not let it redraw the whole diagram.',
        'Run the seven checks on any change it suggests. Keep only the changes you can trace to a requirement.',
        'Save the final version with a date and write one line on what the assistant added or got wrong.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Draw the same flow twice: once as a sequence diagram and once as a container diagram. List what each makes visible and what it hides. Then write the pull-request check that will keep both true when the flow changes.'] },
      { audience: { max: 'beginner' }, steps: ['Draw a context diagram with only four elements: one person, your system and two outside systems. Use the workbench\'s template if you want a starting point.'] },
    ],
  },
  {
    id: 'software-architecture-ai-37',
    day: 37,
    title: 'Architecture Decision Records and Comparing Design Alternatives',
    summary: 'Write one short record per important decision, compare real alternatives with a weighted matrix, and refuse to name a winner from a thin margin.',
    intro: {
      objectives: [
        'Write an Architecture Decision Record with context, options, decision, consequences and a revisit trigger',
        'Decide which decisions deserve a record and how to change one without erasing history',
        'Compare alternatives with weighted criteria and read a close result honestly',
        'Check an AI-drafted record for invented context, strawman options and missing downsides',
      ],
      why: 'Decisions are easy to make and hard to remember. A short record lets the next person, or you in a year, see why the system looks the way it does and when to change it.',
    },
    minutes: 26,
    skills: ['arch-ai-design'],
    body: [
      { type: 'paragraph', text: `An **Architecture Decision Record**, or **ADR**, is a short document about one decision: what the situation was, which options were considered, what was chosen, and what follows from the choice. You wrote your first one in the first module. This lesson makes it a habit and adds the part that earns its keep: comparing alternatives fairly. In a system that changes for years, the code shows what was built, but only a record shows what was rejected and why. That is exactly the information an AI assistant, or a new developer, does not have.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `A year ago TindaTrack chose a text-message provider for payment reminders. A new developer, Rhea, noticed that another provider was cheaper and proposed switching. The team debated it for ninety minutes, and nobody could remember why the first provider had been chosen. Someone thought it was a habit, and someone else thought there had been a reason about delivery reports.` },
      { type: 'paragraph', text: `They switched. Three weeks later, owners complained that they could not tell whether a reminder had reached the customer. The cheaper provider did not report delivery. The original reason, a requirement that owners see whether a message was delivered, had been real, and it was written down nowhere. The switch and the switch back cost about three weeks of work (an invented figure for this example), and a short record from a year ago would have settled the debate in five minutes.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `A useful ADR is short, usually one page, and has the same sections every time. **Title:** the decision as a phrase ("Send reminders through a job table processed by a worker"). **Status:** proposed, accepted, or superseded by a later record. **Context:** the facts and requirements that force a decision, written as facts. **Decision drivers:** the quality attributes that matter most, in order. **Options considered:** at least two real alternatives, including the simplest one (and "do nothing" when it is real), each with its main strengths and costs. **Decision:** one clear sentence beginning "We will". **Consequences:** the good ones, the bad ones, and the work this creates. **Revisit when:** a measurable trigger, such as "if reminders must reach customers within seconds, or volume passes a level we choose".` },
      { type: 'code', language: 'markdown', label: 'A short ADR for the TindaTrack reminders (invented example)', code: `# 0007. Send reminders from a job table processed by a worker

Status: accepted (12 November)

## Context
Owners want payment reminders sent by text message. The API must stay fast
when a store sends many at once. The team of four runs one server and one
PostgreSQL database. Owners need to see whether a message was delivered.

## Decision drivers
1. Delivery status visible to owners  2. Team can run it  3. Delivered in six weeks

## Options considered
A. Send inside the API request: simplest, but slows requests and loses messages on failure.
B. Job table in the database, processed by a worker every minute: reuses what the team runs.
C. A managed message broker: strongest guarantees, but a new service to learn and run.

## Decision
We will use option B.

## Consequences
Good: no new infrastructure; retries and delivery status are rows we can query.
Bad: messages can be up to a minute late; we must write the worker and its retry rules.

## Revisit when
Reminders must arrive within seconds, or the worker cannot keep up at a volume we measure.` },
      { type: 'paragraph', text: `**Which decisions get a record?** Not every choice. Write one when a decision is costly to reverse, surprising to a newcomer, or was argued about. **Records are not edited to change history.** If the team changes its mind, the old record is marked "superseded by 0012" and a new record explains what changed. This keeps the story honest: the next reader sees both the old choice and the reason it ended. Store records in the repository ("docs/adr/0007-....md"), numbered, so they are reviewed like code.` },
      { type: 'diagram', format: 'mermaid', source: `flowchart TD
  Need{Costly to reverse, surprising or argued about?} -->|No| Skip[Decide and move on]
  Need -->|Yes| Opts[List two or more real options, including the simplest]
  Opts --> Score[Score against weighted criteria]
  Score --> Close{Is the margin clear?}
  Close -->|No: too close| Other[Decide on reversibility or run a small test]
  Close -->|Yes| Write[Write the record]
  Other --> Write
  Write --> Store[Accept it and store it in the repository]
  Store --> Revisit[Revisit when the trigger fires]`, caption: `From a question to a record. Look at the branch for a close margin: when the matrix cannot separate two options, the decision moves to a different basis (how easily it can be undone, or a small test), and the record says so.` },
      { type: 'paragraph', text: `**Comparing alternatives.** A weighted matrix makes your reasoning visible. Choose criteria from the quality attributes that matter for this decision, give each a weight that reflects its importance, score each option against each criterion with a one-line reason, and add up the weighted scores. Two rules keep it honest. **Set the weights before you score,** so you do not tune them to favour the option you already like. **Never read the total as truth.** The matrix is a way to expose where people disagree, not a calculator for the correct answer. If two totals are close, the honest result is "too close to call on these criteria": change a weight a little and see whether the order flips. If it does, the criteria do not separate the options, so decide on something else, such as which option is easier to undo, or run a small experiment. The \`arch-tradeoff-matrix\` in the course says this for you when the margin is thin.` },
      { type: 'table', headers: ['Criterion (weight)', 'A: index and cache in the app', 'B: separate reports service', 'C: nightly summary table'], rows: [
        ['Meets the 2-second target (5)', '4', '5', '4'],
        ['Team can build and run it (4)', '5', '2', '4'],
        ['Time to deliver (3)', '5', '1', '4'],
        ['Easy to undo (2)', '5', '2', '4'],
        ['Weighted total (maximum 70)', '65', '40', '56'],
      ], caption: 'An invented example for TindaTrack\'s report. Scores run from 1 (poor) to 5 (strong). B wins on speed alone but loses on what the team can run. A and C are not far apart, so a one-line reason for each score matters more than the total.' },
      { type: 'visual', id: 'arch-tradeoff-matrix', caption: 'Enter your own options, criteria and weights. Look at the margin message: a close result is a prompt to decide on another basis, not a winner.' },
      { type: 'paragraph', text: `**Where AI helps.** An assistant is good at turning your notes into the record's structure, noticing a missing section and asking what would make you revisit the decision. It is poor at knowing your context, so it fills gaps with plausible inventions. Give it your facts and your reasoning, ask it to leave unknowns as questions, and then check three things: the context contains only what you supplied, the options are real, and the consequences include honest downsides.` },
      { type: 'visual', id: 'arch-adr-builder', caption: 'Write the record from your own reasoning. The builder checks for missing sections and one-sided consequences, then saves it so you can attach it to a project.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: an ADR is a short note to your future self. Imagine you chose a particular brand of padlock for the shop. A year later, someone asks why you did not choose the cheaper one. If you wrote one page, "we chose this lock because the cheaper one could be opened with a bent wire, and we revisit if the shop moves", you can answer in a minute. The matrix is the same idea as a pros-and-cons list, but with weights, so you can see which pros matter most to you.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or older system, the value of records is in the graph, not any single record: link each one to the records it supersedes or depends on, and to the diagrams it explains. Decide who may accept a record and what review it needs, and write the decision rule down. Be wary of two failure modes. Records written after the fact, to justify what was built, read as advocacy; write them while the options are still open. And records that are never revisited become stale commitments: attach a trigger you can measure, and make "revisit" a scheduled item for the riskiest ones. For decisions that cross team boundaries, circulate the record as a proposal first and treat the comments as part of the context. Matrices help negotiations, but remember that weights are political: agree the criteria and weights with the stakeholders before anyone sees the scores.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'An AI-drafted ADR from short meeting notes', prompt: `Write an ADR for TindaTrack's reminder sending. Notes: we compared sending in the request, a job table, and a message broker. We picked the job table.`, output: `ADR 0007: Use a job table for reminders\n\nStatus: Accepted\n\nContext: TindaTrack must handle up to 1 million reminders per day as it grows to thousands of stores, and requires 99.99% uptime.\n\nOptions:\n1. Do nothing and hope it works.\n2. Job table.\n3. Message broker (rejected: too expensive).\n\nDecision: Use a job table.\n\nConsequences: Simple, reliable, scalable and easy to maintain. This decision will never need to change.`, notice: `Look for what the notes never said. The context invents "1 million reminders per day" and "99.99% uptime", and neither came from you. Option 1 is a strawman nobody considered, and option 3 is rejected with no reason beyond "too expensive", which was not discussed. The consequences list only good things, with no cost and no work created, and "will never need to change" contradicts the point of a revisit trigger. Rewrite the context from your own facts, give the broker a fair description, add the downsides (delay, a worker to write) and a measurable "revisit when".` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Take a decision your team really made, or one you are about to make. Write three options, your criteria and weights, and your draft decision in a few lines. Put them in the \`arch-tradeoff-matrix\` and look at the margin. Then use the prompt below to have an assistant structure your notes, without inventing anything.` },
      { type: 'prompt', label: 'Draft an ADR from my notes', text: `Turn my notes into an Architecture Decision Record with these sections: Title, Status, Context, Decision drivers, Options considered, Decision, Consequences (good and bad), Revisit when.\n\nMy notes:\n- Situation and facts: [facts only, with sources if you have them]\n- Options: [two or three, including the simplest]\n- Criteria and weights: [list]\n- My scores and a one-line reason for each: [list]\n- My decision and reasons: [text]\n\nRules: use only the facts I supplied; do not add numbers, requirements or options of your own; if a section cannot be written from my notes, write "Unknown: <question>" instead of guessing. Describe each option fairly. Under Consequences, include at least two real downsides. Under Revisit when, propose a trigger I can measure and mark it "for me to confirm". Then list the three weakest points of my reasoning.` },
      { type: 'paragraph', text: `Verify: is every fact in the Context one you supplied? Are there "Unknown" lines that you can now fill? Does the revisit trigger make sense for your system? Save the final version in the \`arch-adr-builder\`, and keep the one you can defend.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write a record for the last decision your team argued about, even if it was months ago, and mark it as written afterwards.',
        'Create a docs/adr folder in your repository with a one-page template, and add "does this need a record?" to your review checklist.',
        'Next lesson, Reviewing AI-Generated Architecture: What to Trust and What to Test, gives a full checklist for judging what an assistant proposes.',
        'In the three projects, you will keep at least two records each: use the `arch-adr-builder` and save each one.',
      ] },
      { type: 'takeaways', items: [
        'An ADR records one decision: context, options (including the simplest), decision, honest consequences and a measurable revisit trigger.',
        'Write a record when a decision is costly to reverse, surprising or argued about; supersede it rather than editing history.',
        'In a weighted matrix, set the weights before scoring, give each score a reason and never read the total as truth.',
        'When the margin is thin, say "too close to call", test whether a small weight change flips the order and decide on reversibility or a small experiment.',
        'An AI-drafted record needs checking for invented context, strawman options and missing downsides.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-37-prompt-lab-1',
          kind: 'prompt-lab',
          labId: 'arch-10-adr-from-notes',
          title: 'Lab: turn messy meeting notes into a decision record',
          prompt: 'Write a prompt that makes the model fill the record fields from the notes only, with "unknowns" listed instead of guessed, and returns JSON. Then check each field against the notes.',
          concept: 'decision records',
          hints: [
            'Name the fields you want and say that the notes are the only source.',
            'Tell the model what to do when the notes do not say: leave it out and list it as an unknown.',
            'Ask for at least two real downsides, and check that the status matches what the notes say.',
          ],
          explanation: 'A record drafted from notes is only as honest as its instructions. Naming the fields, forbidding invention and asking for unknowns makes gaps visible. Check every sentence against the notes: another run may differ.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-37-scenario-1',
          kind: 'scenario',
          title: 'Two options, one point apart',
          prompt: 'Choose the best way to proceed.',
          concept: 'comparing alternatives',
          situation: 'Your matrix scores option A at 58 and option B at 57 out of 70. When you raise the weight of "easy to undo" from 2 to 3, B moves ahead. The team lead says, "A wins. Write it up as the clear choice." The decision affects how reminders are sent for the next year.',
          options: [
            { text: 'Report the result as too close to call on these criteria, note that a small weight change flips it, and decide on reversibility or a one-week test of the riskier option. Record the reasoning and the trigger to revisit.', consequence: 'The team chooses the option that is easier to undo, runs a small test and writes down what it learned. The record shows the matrix, the sensitivity and the reason for the final choice.', quality: 'best' },
            { text: 'Present A as the clear winner because it has the higher total.', consequence: 'The team treats a one-point margin as proof. When a stakeholder questions the weights in a review, the result falls apart.', quality: 'poor' },
            { text: 'Adjust the weights until A wins by a wider margin, so the result looks more convincing.', consequence: 'The result looks decisive and is meaningless. Tuning weights to the answer you want hides the real disagreement.', quality: 'poor' },
            { text: 'Flip a coin since the options are so close, and skip writing it up.', consequence: 'The choice is fine, but nobody records why, and the next debate starts from nothing.', quality: 'acceptable' },
          ],
          hints: [
            'How big is the margin, and what happens when a weight changes slightly?',
            'A matrix is a way to expose reasoning. What should you do when it cannot separate two options?',
            'Look for the option that records the reasoning, not only the choice.',
          ],
          explanation: 'A thin margin that flips with a small change in a weight is not a result. Naming it honestly and deciding on reversibility or a small test, then recording why, is the useful outcome.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-37-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Does this need a record?',
          prompt: 'Read each situation, decide whether it needs an ADR, then tap to check.',
          concept: 'when to write a decision record',
          hints: ['Ask whether it is costly to reverse, surprising to a newcomer, or argued about.', 'A small, easily changed choice usually does not need a record.'],
          explanation: 'Records are for decisions that are costly to reverse, surprising or contested. A small reversible choice does not need one.',
          cards: [
            { front: 'The team picks between two button colours for the reports page.', back: 'No record. It is cheap to change and nobody will ask why in a year.' },
            { front: 'The team chooses to keep all customers in one shared database with a tenant column.', back: 'Yes. It is costly to change later and shapes security, backups and performance. Record the options and the trigger to revisit.' },
            { front: 'Two developers argue for an hour about whether reminders belong in the API or in a worker, and settle on the worker.', back: 'Yes. It was argued about, and the reason will be asked again. Write down both positions and why one won.' },
          ],
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-37-q1',
        prompt: 'Which of these decisions most clearly deserves an ADR?',
        choices: [
          'The name of a helper function in one file, which only the person who wrote it will ever need to understand and which can be renamed in seconds',
          'The text of an error message on the sales screen',
          'The order of the menu items in the admin panel',
          'Keeping every customer\'s data in one shared database, which is costly to change later and argued about by the team',
        ],
        answer: 3,
        explanation: 'Write a record when a decision is costly to reverse, surprising or contested. The other three are cheap to change and rarely questioned.',
      },
      {
        id: 'software-architecture-ai-37-q2',
        prompt: 'A year after ADR 0007 was accepted, the team changes its mind. What is the right way to handle the old record?',
        choices: [
          'Edit ADR 0007 to describe the new decision, so that only one version exists',
          'Delete ADR 0007, since it no longer describes the system',
          'Mark ADR 0007 as superseded and write a new record that explains what changed and links back to it',
          'Leave ADR 0007 unchanged and describe the new decision only in the code comments',
        ],
        answer: 2,
        explanation: 'Records keep the history: what was chosen and why it ended. Editing or deleting the old record erases the reasoning that the next reader needs.',
      },
      {
        id: 'software-architecture-ai-37-q3',
        prompt: 'Two options score 61 and 59 out of 70, and raising one weight slightly reverses their order. What is the honest conclusion?',
        choices: [
          'The higher total wins, because the matrix was filled in carefully',
          'On these criteria the options are too close to call, so the team should decide on another basis such as reversibility or a small test and record the sensitivity',
          'The weights are wrong, and the team should keep adjusting them until the order stays the same',
          'Both options are bad, and the team should look for a third that scores above 65, since no real decision can be made until one option clearly beats the others by a wide margin',
        ],
        answer: 1,
        explanation: 'A margin that flips with a small change means the criteria do not separate the options. The useful step is to decide on another basis and record it. Tuning weights hides the disagreement.',
      },
      {
        id: 'software-architecture-ai-37-q4',
        prompt: 'An assistant drafted an ADR from your three lines of notes. What should you check first?',
        choices: [
          'That the context contains only facts you supplied, the options are real and fairly described, and the consequences include honest downsides',
          'That the record is long enough to look thorough',
          'That the status says "accepted", because a record without that word is not valid',
          'That the language sounds formal, since formal records are taken more seriously in reviews and read like the records of other well-run teams in the same industry',
        ],
        answer: 0,
        explanation: 'The usual faults of a drafted record are invented context, strawman options and one-sided consequences. Length, status wording and tone do not make it true.',
      },
      {
        id: 'software-architecture-ai-37-q5',
        audience: { max: 'beginner' },
        prompt: 'In the padlock example, why is a one-page note about the choice useful a year later?',
        choices: [
          'It makes the shop look more professional to customers.',
          'It lets you answer "why did we choose this?" in a minute, with the reasons.',
          'It stops anyone from ever changing the lock.',
        ],
        answer: 1,
        explanation: 'The record holds the reasons. Someone can then decide whether those reasons still hold, instead of arguing from memory.',
      },
      {
        id: 'software-architecture-ai-37-q6',
        audience: { min: 'advanced' },
        prompt: 'A team writes most ADRs after the feature ships, to describe what was built. What is the main risk?',
        choices: [
          'The records become too short to be useful',
          'The records may read as advocacy for the existing choice, and real alternatives and open questions are lost, so write them while options are still open',
          'The records cannot be stored in the repository after a release',
          'The records will be rejected by the build because they are older than the code, so the team would need to date every record before the release branch is cut',
        ],
        answer: 1,
        explanation: 'Written afterwards, a record tends to justify the result and drop the options that were never fairly tried. Writing while the choice is open keeps the comparison honest.',
      },
    ],
    task: {
      title: 'Write and compare: one real decision',
      steps: [
        'Pick a decision you face or have made. List two or three real options, including the simplest, and four criteria with weights chosen before you score.',
        'Score each option with a one-line reason in the `arch-tradeoff-matrix`. Read the margin message, and change one weight a little to see if the order flips.',
        'Write the decision as an ADR in the `arch-adr-builder`: context as facts, options with a fair description, honest consequences and a measurable revisit trigger. Save it.',
        'Run the "Draft an ADR from my notes" prompt on your notes and compare it with your record. Note one thing it invented and one thing it found you had missed.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Find an older decision in your codebase that has no record. Reconstruct it from commit history and people, mark the record "written afterwards", and add a trigger that would make you revisit it. Then link it to the diagram it affects.'] },
      { audience: { max: 'beginner' }, steps: ['Start with two options and three criteria. Give each score a one-line reason, then write the record\'s Context, Decision and Consequences only.'] },
    ],
  },
  {
    id: 'software-architecture-ai-38',
    day: 38,
    title: 'Reviewing AI-Generated Architecture: What to Trust and What to Test',
    summary: 'Review an AI-proposed architecture with a nine-point checklist, turn your doubts into tests, and record what you accepted and rejected.',
    intro: {
      objectives: [
        'Apply a nine-point checklist to an AI-generated architecture proposal',
        'Separate claims backed by requirements from assumptions and unsupported claims',
        'Turn doubts into tests: a failure drill, a measurement plan and a cross-tenant test',
        'Write a short review note with a verdict, what you verified and what you rejected',
      ],
      why: 'AI proposals are well written, and well written is not the same as right. A repeatable checklist lets you use the speed of an assistant without inheriting its inventions.',
    },
    minutes: 28,
    skills: ['arch-ai-design'],
    body: [
      { type: 'paragraph', text: `An assistant can produce a three-page architecture proposal in less time than it takes to make coffee. It will have headings, a diagram, a list of benefits and a confident tone. Reading it feels like reviewing the work of an experienced architect, and that feeling is the danger. The text is fluent whether or not it fits your system. This final lesson of the module gives you a repeatable way to review such a proposal: a checklist, a way to turn doubts into tests, and a short note that records your decision. It uses everything from the earlier modules, so expect to recall requirements, quality attributes, trade-offs and security.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `A small company is building ClinicBook, a booking system for about forty clinics (a second, invented example). The project lead, short of time, asks an assistant for an architecture. The answer proposes six microservices on a container cluster, an event bus, a separate database for each service and a data lake "for future insights". It reads well. The team of three developers nods and starts building the cluster.` },
      { type: 'paragraph', text: `Two months later, most of the team's time has gone into deployment scripts and getting the services to talk to each other. The one feature clinics asked for first, a text reminder the day before an appointment, is not built. The real load is a few hundred bookings a day. A senior developer finally reads the proposal against the original requirements and asks which requirement needs the event bus. Nobody can name one. The team spends three weeks collapsing the design into one application and a database. The two months were the cost of not reviewing the proposal.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `First, a mindset. **A proposal from an assistant is a hypothesis, not a finding.** It may contain good ideas, and it is worth reading closely, but each claim needs to earn its place. Assistants are good at breadth (listing options and patterns), at checklists and at drafting. They are weak at your context, at current product facts, at scale claims, at staying consistent across a long document and at saying "I do not know". Review accordingly: trust the structure of an idea as a prompt for questions, and test the numbers, the product facts, the security claims and the meaning of the diagram.` },
      { type: 'paragraph', text: `Here is a **nine-point checklist**. For each item, ask the question and look for the red flag. Keep the requirements document next to the proposal, and tick items only when you can point to the evidence.` },
      { type: 'table', headers: ['Check', 'Ask', 'Red flag'], rows: [
        ['1. Requirements traceability', 'Which requirement does each component answer, and which component answers each requirement?', 'Components nobody asked for; a requirement with no home'],
        ['2. Hidden assumptions', 'What scale, team skills, budget and provider does it assume?', 'A figure nobody supplied, such as "supports millions of users"'],
        ['3. Fashionable over fitting', 'Which parts are there because they are popular, and what is the simplest design that meets the requirements?', 'Microservices, a cluster, a broker or a second database with no requirement behind them'],
        ['4. Missing failure modes', 'What happens when each dependency is slow, down or wrong?', 'No timeouts, retries, degraded mode, backup or restore'],
        ['5. Security', 'Where are the trust boundaries, who authenticates, how are tenants separated, where do secrets live?', '"Secure by design" with no mechanism; a tenant id sent by the client'],
        ['6. Cost', 'What does each option cost in people, operations and complexity?', 'No costs at all, or "cost-effective" with no comparison'],
        ['7. Consistency', 'Do the text, the diagram and the decisions agree?', 'A box in the diagram that the text never mentions'],
        ['8. Unsupported claims', 'Which statements about products, limits or performance can be checked, and where?', '"Industry standard", unsourced numbers, a product feature with no documentation link'],
        ['9. Reversibility and the next test', 'How will we know it is wrong, and how hard is it to undo?', 'No way to test it, or early choices that are hard to reverse'],
      ], caption: 'The checklist. A "pass" needs evidence you can point to; "it sounds right" is not evidence.' },
      { type: 'diagram', format: 'mermaid', source: `flowchart TD
  Prop[AI proposal] --> Claims[Mark each claim: requirement, assumption or unsupported]
  Claims --> Check[Run the nine checks]
  Check --> Tests[Turn doubts into tests]
  Tests --> Fit{Does it beat the simplest option?}
  Fit -->|No| Simplify[Remove parts and ask again]
  Simplify --> Claims
  Fit -->|Yes| Note[Decide, write the ADR and the review note]`, caption: `The review loop. Look at the branch that returns to the start: a proposal that does not beat the simplest option is simplified and reviewed again, not accepted with a note.` },
      { type: 'paragraph', text: `**Turn doubts into tests.** Reading is not enough, because reading is what the proposal was written to survive. For each doubt, define something you can do. For failure modes, run a **failure drill on paper**: pick a dependency, say it is down for an hour, and trace what each user sees and what data is lost. For a scale claim, write a **measurement plan**: what you would measure, how and what result would change your mind (the earlier lesson on measuring before redesigning applies). For tenancy, write a **cross-tenant test**: sign in as one clinic and ask for another's record, and expect a refusal. For a diagram, validate it in the workbench and check each box against a requirement. For a product feature, open the official documentation.` },
      { type: 'paragraph', text: `**The simplest-design test** is the most useful single question. For each non-trivial part of the proposal, ask "what breaks if I leave this out?" and "what is the simplest thing that meets the stated requirement?" If nothing breaks, the part is a hypothesis you do not need yet. When a heavier option really is needed, it should arrive with a requirement, a measurement and a cost, and your ADR should record them.` },
      { type: 'paragraph', text: `**Write the review note.** Keep it to a page: the verdict (accept, change or reject), the claims you verified and how, the claims you rejected and why, the open questions, and the tests you will run. This is also what you attach to a decision record, so the thinking behind a choice is never "the assistant said so".` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: imagine a contractor hands you a plan for your house with a lot of impressive equipment. You would ask: which of my needs does each item serve? Does it fit my budget? What happens if the power goes out? A review does the same with a software plan. A good first question for any big word in the proposal ("event bus", "cluster", "data lake") is: "Which of my requirements needs this?" If the answer is "none", the item is a guess you can leave out for now.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `On a team, make the review itself a shared practice. Agree a short template (the checklist plus the review note) and require it for any architecture change that started from AI output, as you would for a change from a new hire. Keep a log of recurring inventions (for example, extra services, invented volumes) so the team learns the patterns of its own assistants. Beware of internal consistency: a long, well-organised document can be perfectly consistent and wrong, because it is only consistent with itself. The anchors are external: requirements, measurements, official documentation and real tests. Finally, watch for anchoring. Once a proposal is written, a team tends to debate its details instead of the alternatives it never listed, so have people write down their own options before they read the proposal.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'An AI-drafted proposal, ready to be reviewed', prompt: `Propose an architecture for ClinicBook, an online booking system for small clinics. Include security and scalability.`, output: `ClinicBook Architecture Proposal\n\nOverview: ClinicBook uses six microservices (Booking, Patients, Clinics, Notifications, Billing, Analytics) running on Kubernetes and communicating through Kafka.\n\nScalability: the design supports 5 million bookings per day and scales to any traffic level.\n\nSecurity: the system is secure by design and GDPR compliant. Each request includes the clinic identifier, which the services use to scope data.\n\nData: each service owns its database. An Analytics Service builds a data lake for future insights.\n\nOperations: blue-green deployments, canary analysis and full distributed tracing.`, notice: `Run the checklist. No requirement was given, so every figure and component is an assumption (checks 1 and 2). Six services, a cluster and an event bus for a small clinic system are fashion, not fit (3). "Any traffic level" is a claim with no basis (8). The clinic identifier sent in each request is a tenant id supplied by the client (5). "GDPR compliant" is a legal claim that a design cannot make, and nothing here describes a mechanism. There is no mention of failures, backups or cost (4 and 6), and nothing says how anyone would know it is wrong (9). Nothing here is useless: the questions it raises are good ones, but every answer needs your evidence.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Take a proposal you have, from an assistant or a colleague, with the requirements next to it. Do your own pass first: mark each claim as backed by a requirement, an assumption, or unsupported. Then use an assistant as a second reviewer, with the requirements as the standard.` },
      { type: 'prompt', label: 'Review this proposal against my requirements', text: `Below are my requirements and a proposed architecture. Treat my requirements as the standard and the proposal as a hypothesis.\n\nRequirements: [paste, with scale, team, budget and deadline]\nProposal: [paste]\n\nReview it with these nine checks: traceability, hidden assumptions, fashionable over fitting, missing failure modes, security, cost, consistency, unsupported claims, reversibility. For each check give: a verdict (supported, claimed only, contradicted or unknown), the sentence from the requirements or proposal that your verdict rests on, and one question for the team. Then:\n1. List every component that no requirement needs, and every requirement the proposal does not cover.\n2. State the simplest design that meets the requirements and its main downside.\n3. For each doubt, propose one test I can run (a failure drill, a measurement, a cross-tenant test).\nNever say the design is secure, compliant or scalable. State what you cannot know without testing the real system.` },
      { type: 'paragraph', text: `Verify: for each verdict, open the sentence it cites. Run at least one of the tests it proposes. Then write your review note and decide yourself.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Put the nine-point checklist in your team\'s pull-request or design template, and use it on the next design that an assistant helped write.',
        'Run one failure drill on paper for the dependency you worry about most, and write down what users would see.',
        'Next module, AI Coding Agents and Architecture Implementation, turns an approved design into an implementation plan that coding agents can follow.',
        'Open `arch-assistant` (Tali) with a proposal and ask her to list its assumptions: compare her list with yours.',
      ] },
      { type: 'takeaways', items: [
        'A proposal from an assistant is a hypothesis: trust the structure of an idea, test the numbers, product facts, security claims and the meaning of the diagram.',
        'Use the nine checks: traceability, hidden assumptions, fashionable over fitting, failure modes, security, cost, consistency, unsupported claims, and reversibility with the next test.',
        'Turn each doubt into a test: a failure drill, a measurement plan, a cross-tenant test, a validated diagram, a documentation check.',
        'Ask of every heavy part: what breaks if I leave it out, and what is the simplest thing that meets the requirement?',
        'Write a one-page review note (verdict, verified, rejected, open questions, tests) so the reasoning is yours, not the assistant\'s.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-38-prompt-lab-1',
          kind: 'prompt-lab',
          labId: 'arch-10-review-proposal',
          title: 'Lab: review an AI-written proposal against the requirements',
          prompt: 'Write a prompt that makes the model compare each numbered proposal item with the requirements, label it, quote the sentence behind the label and list requirements the proposal never covers. Then check its quotes yourself.',
          concept: 'reviewing AI architecture',
          hints: [
            'Say that the requirements are the standard and the proposal is a hypothesis.',
            'Ask for fixed labels, a quoted sentence for each verdict and the requirements that nothing covers.',
            'Ask what the simplest design would be and what the model cannot know.',
          ],
          explanation: 'A strong review prompt holds the proposal to the requirements, asks for evidence for every verdict and looks for what is missing as well as what is wrong. Check each quote against the material: another run may differ.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-38-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Build a review process for an AI proposal',
          prompt: 'Choose and order the steps of a sound review. Leave out the tempting shortcuts.',
          concept: 'reviewing AI architecture',
          situation: 'An assistant produced a long architecture proposal for ClinicBook. The team lead wants a decision by Friday. You have the clinics\' written requirements. Build the review so the decision rests on evidence and your own judgement.',
          parts: [
            { id: 'proposal', lane: 'input', label: 'The AI proposal and the written requirements', detail: 'Both documents side by side.' },
            { id: 'claims', lane: 'human', label: 'Mark each claim: backed by a requirement, assumption, or unsupported', detail: 'A person reads the proposal against the requirements.' },
            { id: 'assumptions', lane: 'ai', label: 'Ask an assistant to list assumptions and the simplest alternative, using only the requirements', detail: 'The assistant widens the questions; it does not give a verdict.' },
            { id: 'validate', lane: 'tool', label: 'Paste the diagram into the workbench and validate it', detail: 'Check syntax, then check each box against a requirement.' },
            { id: 'checklist', lane: 'human', label: 'Run the nine-point checklist with evidence for each item', detail: 'A person ticks only what can be pointed to.' },
            { id: 'tests', lane: 'human', label: 'Turn doubts into tests: a failure drill, a measurement plan, a cross-tenant test', detail: 'Doubts become things you can do.' },
            { id: 'decide', lane: 'human', label: 'Decide and write an ADR with the rejected parts', detail: 'A person decides and records why.' },
            { id: 'note', lane: 'output', label: 'Publish the review note: verdict, verified, rejected, open questions', detail: 'A one-page note anyone can read.' },
            { id: 'ask-correct', lane: 'ai', label: 'Ask the same assistant, "Is this design correct?", and accept a yes', detail: 'The assistant confirms its own text.' },
            { id: 'approve', lane: 'human', label: 'Approve it because it is detailed and confident', detail: 'Length and tone treated as proof.' },
            { id: 'build-first', lane: 'tool', label: 'Build it all first and see what breaks', detail: 'Find the problems after two months of work.' },
          ],
          rules: [
            { id: 'trace', kind: 'require', parts: ['claims', 'checklist', 'decide'], message: 'The review needs a person to trace claims, run the checklist and decide.' },
            { id: 'test-doubts', kind: 'require', parts: ['tests'], message: 'Doubts must become tests, otherwise the review is only more reading.' },
            { id: 'no-self-check', kind: 'forbid', parts: ['ask-correct'], message: 'An assistant confirming its own proposal is not an independent check.' },
            { id: 'no-confidence', kind: 'forbid', parts: ['approve', 'build-first'], message: 'Neither confidence nor building first reviews anything: the first accepts and the second finds out too late.' },
            { id: 'claims-first', kind: 'before', parts: ['claims', 'checklist'], message: 'Mark the claims before running the checklist, so each check has something to point at.' },
            { id: 'tests-before-decision', kind: 'before', parts: ['tests', 'decide'], message: 'Test the doubts before you decide, so the decision uses what you learned.' },
          ],
          solution: ['proposal', 'claims', 'assumptions', 'checklist', 'tests', 'decide', 'note'],
          minSteps: 5,
          maxSteps: 9,
          simulation: {
            input: 'A ClinicBook proposal with six services, a broker and a figure of 5 million bookings a day, and the clinics\' requirements.',
            steps: {
              proposal: 'The proposal and the requirements are placed side by side.',
              claims: 'The reviewer marks the 5 million figure and the broker as unsupported, and the reminder requirement as uncovered.',
              assumptions: 'An assistant lists assumptions and a simplest alternative using only the requirements; the reviewer reads it as questions.',
              checklist: 'The reviewer runs the nine checks and writes the evidence for each.',
              tests: 'The reviewer plans a failure drill for the text provider and a cross-clinic access test.',
              decide: 'The reviewer decides on one application and a worker, and writes an ADR with the rejected parts.',
              note: 'A one-page note lists the verdict, what was verified and rejected, and the open questions.',
            },
            output: 'A decision with evidence behind it, a record of what was rejected, and tests to run before the first release.',
          },
          hints: [
            'Who decides at each step: a person or an assistant? The final decision must be a person.',
            'Marking the claims comes before the checklist, and tests come before the decision.',
            'Three steps look like shortcuts: one asks the proposal\'s own author, one trusts confidence, one reviews too late.',
          ],
          explanation: 'A sound review marks claims, runs the checklist with evidence, turns doubts into tests and then decides, with a person in charge throughout. Asking the same assistant to confirm its work, trusting a confident tone or building first all skip the evidence.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-38-match-1',
          kind: 'match',
          title: 'Which check fires?',
          prompt: 'Match each red flag in an AI proposal to the checklist item it triggers.',
          concept: 'review checklist',
          labels: { terms: 'Red flag', meanings: 'Checklist item' },
          pairs: [
            { term: 'The proposal says "scales to any traffic level" and gives no basis.', definition: 'Unsupported claims', note: 'It is a statement about performance with nothing behind it.' },
            { term: 'The text never mentions the Analytics box that appears in the diagram.', definition: 'Consistency across text, diagram and decisions', note: 'The diagram and the text disagree.' },
            { term: 'The design never says what happens when the text-message provider is down for an hour.', definition: 'Missing failure modes', note: 'A dependency failure is not considered at all.' },
            { term: 'Six services and an event bus are proposed for a team of three with a small, steady load.', definition: 'Fashionable over fitting', note: 'The weight of the design does not match the requirement or the team.' },
          ],
          hints: [
            'Ask what kind of problem the red flag is: a claim, a disagreement between documents, something missing, or a mismatch with the need.',
            'The Analytics example is about two documents disagreeing.',
            'A team of three with a small load points to the weight of the design.',
          ],
          explanation: 'Each flag points to a different check: claims with no basis, documents that disagree, failures not considered and designs heavier than the need. Naming the check tells you which question to ask next.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-38-q1',
        prompt: 'A proposal for a three-person team with a few hundred bookings a day recommends six services, a cluster and an event bus. Which checklist item fires first, and what is the best response?',
        choices: [
          'Fashionable over fitting: ask which requirement each heavy part serves, and compare it with the simplest design and its costs for this team',
          'Security: add an extra authentication service so that the services can trust each other',
          'Consistency: redraw the diagram so that the six services look balanced',
          'Reversibility: build all six services quickly so that changing one later is cheap, and keep the event bus so that the services remain loosely connected',
        ],
        answer: 0,
        explanation: 'Heavy parts with no requirement behind them are the classic mismatch. Asking what each part serves, and what the simplest alternative would cost, keeps the team from building what nobody needs. The other responses add more of the same.',
      },
      {
        id: 'software-architecture-ai-38-q2',
        prompt: 'The requirements say about 300 bookings a day. The proposal says it "supports 5 million bookings a day". How should you treat that statement?',
        choices: [
          'As a useful safety margin, since a design should always be built for far more than the current load',
          'As a hidden assumption and an unsupported claim: ask for its basis, and replace it with a figure you can measure',
          'As a sign that the assistant is well informed about large systems and should be trusted on the rest',
          'As a typing mistake that can be ignored, because the number does not change the design',
        ],
        answer: 1,
        explanation: 'A number nobody supplied is an assumption, and it drives the heavy design around it. Ask where it came from and plan to measure the real load. It is not a safety margin, and it does not show expertise.',
      },
      {
        id: 'software-architecture-ai-38-q3',
        prompt: 'What is the best way to find out whether an AI-proposed design handles a payment provider outage?',
        choices: [
          'Ask the assistant to confirm that the design is resilient',
          'Read the proposal again more slowly, looking for the word "resilient"',
          'Run a failure drill on paper: say the provider is down for an hour and trace what each user sees and what data is lost',
          'Wait until the first real outage and fix whatever breaks then, since real traffic shows problems that no amount of planning on paper would reveal',
        ],
        answer: 2,
        explanation: 'A drill turns a doubt into something you can do. Asking for confirmation or rereading does not test anything, and waiting for a real outage is the costly way to learn.',
      },
      {
        id: 'software-architecture-ai-38-q4',
        prompt: 'You ask the same assistant, "Is this design correct?" and it says yes. What does that tell you?',
        choices: [
          'That the design has passed an independent review, since a second look found no fault',
          'That the design is correct, because assistants usually catch their own mistakes when asked directly',
          'That the design should be built now, since the assistant can verify its own work faster than a person',
          'Very little: it is confirming its own text, so the checklist, the requirements and real tests are still needed',
        ],
        answer: 3,
        explanation: 'The assistant has the same context and tends to agree with the text in front of it. Independent evidence comes from the requirements, the checklist, tests and people.',
      },
      {
        id: 'software-architecture-ai-38-q5',
        audience: { max: 'beginner' },
        prompt: 'A proposal uses the words "event bus" and "data lake". What is a good first question?',
        choices: [
          'Which of my requirements needs this part?',
          'Can the assistant explain it in longer words?',
          'Is it used by big companies?',
        ],
        answer: 0,
        explanation: 'If no requirement needs a part, it is a guess you can leave out for now. Popularity and long explanations do not answer that.',
      },
      {
        id: 'software-architecture-ai-38-q6',
        audience: { min: 'advanced' },
        prompt: 'A long AI-written design document is perfectly consistent from start to finish. Why is that not enough?',
        choices: [
          'Consistent documents are always too long to be read by the whole team',
          'The assistant may have used different words for the same thing, which hides contradictions',
          'It is only consistent with itself: it can rest on invented assumptions, so check it against requirements, measurements, official documentation and tests',
          'Consistency is a sign of copying, so the document may belong to another company and should be checked for plagiarism against public documents before the team reads any further',
        ],
        answer: 2,
        explanation: 'Internal consistency is cheap for a fluent writer. The anchors for correctness are outside the document: what was required, what was measured, what is documented and what a test shows.',
      },
    ],
    task: {
      title: 'Review an AI proposal with the nine checks',
      steps: [
        'Choose a proposal (from an assistant or a colleague) and the requirements it should meet. If you do not have one, ask an assistant for a short architecture for a system you know, and write your requirements first.',
        'Mark each claim as backed by a requirement, an assumption or unsupported. Cross out every component you cannot trace.',
        'Run the nine checks with a sentence of evidence for each, and write down the simplest design that meets the requirements.',
        'Write three tests for your biggest doubts (a failure drill, a measurement plan, a cross-tenant test), and a one-page review note: verdict, verified, rejected, open questions.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Run the review twice with different people: one who reads the proposal first, one who writes their own options first. Compare what each found, and write which review habit you will standardise for your team.'] },
      { audience: { max: 'beginner' }, steps: ['Do only checks 1, 3 and 8: trace each component to a requirement, name the simplest alternative and mark one unsupported claim.'] },
    ],
  },
];
