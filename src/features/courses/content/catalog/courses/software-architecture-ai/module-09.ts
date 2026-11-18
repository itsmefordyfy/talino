import type { Lesson, Project } from '../../../types';

// Module 9: Security Architecture and Best Practices (lessons 31 to 34) and Project 2 "Scale an Existing Application". Written 2026-11-18.
// Security content is design level only: threat modelling, least privilege, tenant isolation, secrets handling, encryption concepts. No exploit code, no real credentials,
// no compliance or legal claims. Everything (TindaTrack, ClinicBook, ShopLine, every number) is invented. Demos are hand-written illustrations with a flaw to catch.
// One product fact (PostgreSQL row-level security) is a dated version note whose official page was read on 2026-11-18.

const CHECKED = '2026-11-18';
const POSTGRES_RLS = { label: 'PostgreSQL documentation: Row Security Policies', url: 'https://www.postgresql.org/docs/current/ddl-rowsecurity.html' };

export const lessons: Lesson[] = [
  {
    id: 'software-architecture-ai-31',
    day: 31,
    title: 'Secure by Design and Threat Modeling',
    summary: 'Ask what can go wrong while the design is still a drawing: trust boundaries, the six STRIDE questions and a cheap first fix for each risk.',
    intro: {
      objectives: [
        'Draw a data-flow diagram with the trust boundaries marked',
        'Use the six STRIDE questions to find threats at each boundary crossing',
        'Choose a response to each threat (avoid, reduce, transfer or accept) and record it',
        'Test an AI-written threat list for generic items and missing boundaries',
      ],
      why: 'Security problems found in a drawing cost a conversation. Found in production, they cost a weekend, a customer apology and sometimes a rewrite. Threat modelling is the habit that moves the finding earlier.',
    },
    minutes: 24,
    skills: ['arch-security'],
    body: [
      { type: 'paragraph', text: `Security is not a layer you add at the end, like paint. It is a set of decisions about who may do what, which parts you trust, and what happens when something misbehaves. Those decisions are architecture decisions, and they are cheapest to make while the system is still a drawing. In this module you will build that habit step by step. This first lesson gives you the method that the other three lessons use: threat modelling, which simply means asking "what could go wrong here?" in an organised way.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack (our running example, the inventory and sales app for small neighbourhood stores) has just added online payments through an e-wallet provider. The team of four built the checkout in two weeks. The e-wallet provider tells TindaTrack that a customer has paid by calling a web address on the TindaTrack API, a "webhook". The developer wrote an endpoint that reads an order number and a field called "status" from the request, and if the status says "paid", it marks the order as paid.` },
      { type: 'paragraph', text: `Nobody asked who is allowed to call that address. During a review before launch, Ana, a developer on another team, drew the flow on a whiteboard and asked one question: "Who else can send this request?" The honest answer was "anyone who knows the address". A test script from a curious colleague marked three unpaid test orders as paid in a few seconds. Because the team found it before launch, the cost was a week of rework on the endpoint and a manual check of every order from the test period. Found after launch, it would have meant goods handed over for payments that never arrived.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Secure by design** means you let security shape the structure, not just the code. A few principles do most of the work. **Least privilege:** each person, service and key gets only the access its job needs. **Defence in depth:** no single check is the only thing standing between an attacker and your data, so a failure in one layer is caught by another. **Secure defaults:** the safe choice happens when nobody chooses. **Fail closed:** when a check cannot decide, it says no. **Minimise data:** what you never store cannot leak. **Don't trust input:** anything that arrives from outside your own system is unverified until you check it.` },
      { type: 'paragraph', text: `**Threat modelling** turns those principles into a routine. Four questions are enough: What are we building? What can go wrong? What are we going to do about it? Did we do a good enough job? The first question is answered with a **data-flow diagram**: boxes for the parts, arrows for the data moving between them, and a mark wherever the data crosses a **trust boundary**, a line between parts that are controlled by different people or have different levels of trust. The browser of a customer is on the other side of one. So is the e-wallet provider. Most threats live on the arrows that cross those lines.` },
      { type: 'diagram', format: 'mermaid', source: `flowchart LR
  Customer((Customer browser)) -->|HTTPS: crosses the internet| Web[Web app]
  Web -->|HTTPS JSON| Api[TindaTrack API]
  Api -->|SQL: inside our network| Db[(Orders database)]
  Api -->|Starts a payment| Wallet((E-wallet provider))
  Wallet -->|Webhook: crosses into our system| Hook[Webhook endpoint]
  Hook -->|Marks order paid| Api2[Order service]
  Api2 -->|SQL| Db`, caption: `A data-flow diagram of the checkout. Look at the three arrows that start outside our system: the customer's request, the wallet's webhook, and our own call out to the wallet. Each one is a place to ask "who is really sending this?"` },
      { type: 'paragraph', text: `For "what can go wrong", a memory aid called **STRIDE** gives you six questions to ask at each boundary crossing. It is a prompt for questions, not a checklist you can finish and tick.` },
      { type: 'table', headers: ['Letter', 'Question', 'What is threatened', 'TindaTrack example'], rows: [
        ['Spoofing', 'Can someone pretend to be someone or something else?', 'Identity', 'A fake webhook claims to come from the e-wallet provider.'],
        ['Tampering', 'Can someone change data they should not change?', 'Integrity', 'A customer edits the price field before it reaches the API.'],
        ['Repudiation', 'Can someone deny an action and have no way to prove it happened?', 'Accountability', 'A cashier voids a sale and nothing records who did it.'],
        ['Information disclosure', 'Can someone read data they should not see?', 'Confidentiality', 'One store owner sees another store\'s sales.'],
        ['Denial of service', 'Can someone make the system unavailable?', 'Availability', 'A flood of requests to the report page keeps real owners out.'],
        ['Elevation of privilege', 'Can someone do more than their role allows?', 'Authorization', 'A cashier calls an owner-only action directly.'],
      ], caption: 'STRIDE asks six questions of every boundary crossing. Skip a row only when you can say why it does not apply here.' },
      { type: 'paragraph', text: `The third question, "what are we going to do about it", has four honest answers. **Avoid** the risk by removing the feature or the data. **Reduce** it with a control (a signature check, a limit, a permission). **Transfer** it, for example by letting a payment provider handle card details so you never hold them. **Accept** it, knowingly, and write down who accepted it. Start with the cheapest control that removes the most risk. A threat with a low impact and a high fix cost is often an accepted risk, and that is fine as long as it is written down.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: imagine your sari-sari store. The shelves are inside, the street is outside, and the door between them is a boundary. You would ask: who comes through this door, what can they take, can a stranger pretend to be a supplier, can someone block the door so customers cannot enter? Threat modelling is the same walk-through for a software system, done on paper before anyone builds it. A "trust boundary" is just the door: the line where you stop being sure who is on the other side.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or existing system, threat models go stale quickly. Keep one per significant feature, store it next to the design documents and revisit it when a boundary changes: a new integration, a new data store, a new kind of user. Rank threats by impact and by how easy they are to exploit, but treat scores as a way to order a conversation, not as measurements. Look for threats that cross teams: a service that trusts "internal" callers is only as safe as the weakest internal service. A serious threat model for a high-risk system (payments, health data) should be reviewed by a security professional, not only by the team that built it.` },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'If you have added a login to an app, you have done a small piece of security design. Threat modelling widens the question from "is the login correct?" to "what could go wrong anywhere data moves, who could cause it, and which defence is the cheapest one that matters?"' },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'An AI-drafted threat list for the checkout', prompt: `Here is the data-flow of our checkout: customer browser -> web app -> TindaTrack API -> database; the API starts payments with an e-wallet provider; the provider sends a webhook back to a public endpoint that marks orders paid. Team of four, one server, about 200 stores. Give me a threat model using STRIDE.`, output: `Threat model (STRIDE)\n\nSpoofing: attackers may impersonate users. Mitigation: add multi-factor authentication.\nTampering: data may be modified in transit. Mitigation: use HTTPS.\nRepudiation: users may deny actions. Mitigation: enable audit logging.\nInformation disclosure: sensitive data may leak. Mitigation: encrypt all data.\nDenial of service: attackers may overload the system. Mitigation: deploy a Web Application Firewall and a global CDN.\nElevation of privilege: users may gain admin rights. Mitigation: implement zero-trust microsegmentation with a service mesh.\n\nRecommended next step: adopt a SIEM platform for continuous monitoring.`, notice: `Check three things. First, is the list generic? Every line could describe any web app. Nothing mentions the webhook, which is the most dangerous arrow in the diagram. Second, did it match the system? A service mesh and a SIEM platform are heavy tools for a team of four on one server, and nothing in the requirements asks for them. Third, are the mitigations tied to a threat and a boundary? "Encrypt all data" does not say what is encrypted, where, or against whom. Use the list as a prompt for your own questions, then rewrite it boundary by boundary.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Draw your own system's data-flow diagram first (five to eight boxes is enough) and mark where data crosses a trust boundary. Write down the three threats you believe are most serious and what you would do about each. Only then ask an assistant to critique your work. The goal is for the assistant to find what you missed, not to do your thinking.` },
      { type: 'prompt', label: 'Threat model critique', text: `I am designing [your system in one sentence]. Team: [size and skills]. Scale: [rough, labelled as an estimate]. Here is my data-flow, with trust boundaries marked: [paste your arrows, e.g. "customer browser -> API (crosses the internet)"].\n\nMy top three threats and my planned response to each:\n1. [threat, boundary, response]\n2. [...]\n3. [...]\n\nDo not redesign my system. Instead:\n1. For each boundary crossing, ask me the STRIDE questions I have not answered.\n2. List any crossing that I did not mark as a boundary.\n3. For each threat you add, say which crossing it belongs to, and give the cheapest response and one cost of that response.\n4. State your assumptions, and tell me what you cannot know without seeing the real system.\n5. Mark any suggestion that needs a tool or service my team may not need.` },
      { type: 'paragraph', text: `Then verify: does every threat the assistant added name a specific arrow in your diagram? Delete the ones that do not. Does any suggested control cost more than the risk it removes? Decide that yourself and write the decision down.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Draw the data-flow diagram of one feature you own, with the trust boundaries, in the `arch-diagram-workbench` (the Diagrams as Code lesson in module 10 goes deeper).',
        'Pick the one arrow that crosses a boundary and answer the six STRIDE questions for it, in writing.',
        'Next lesson, Authentication and Authorization: Sessions, Tokens, RBAC and ABAC, covers the controls behind Spoofing and Elevation of privilege.',
        'Read the OWASP Threat Modeling Cheat Sheet and the project\'s own pages on threat modelling for a longer method written by practitioners.',
      ] },
      { type: 'takeaways', items: [
        'Security decisions are architecture decisions: make them while the system is still a drawing.',
        'A data-flow diagram with trust boundaries shows where to look: most threats sit on arrows that cross a boundary.',
        'STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) is a set of questions, not a finish line.',
        'For each threat choose avoid, reduce, transfer or accept, start with the cheapest control, and write down accepted risks.',
        'An AI-written threat list is a starting prompt: remove generic items, tie each threat to a boundary and refuse heavy tools the system does not need.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-31-prompt-lab-1',
          kind: 'prompt-lab',
          labId: 'arch-09-stride-sort',
          title: 'Lab: sort six threats into STRIDE categories',
          prompt: 'Write a prompt that makes the model label each of six threat notes with exactly one STRIDE category and return JSON. Then check each label against the definitions yourself.',
          concept: 'STRIDE',
          hints: [
            'Say which fields you want (t1 to t6) and that each value must be exactly one category name.',
            'Tell the model to use the six definitions in the material, not its own idea of them.',
            'Decide what the model should do when a threat fits two categories, and read each label against its definition afterwards.',
          ],
          explanation: 'A fixed output shape and the definitions as the only evidence make the labels easy to check. The model\'s labels are a draft: you remain the one who decides which category describes the main harm.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-31-match-1',
          kind: 'match',
          title: 'Which STRIDE question is this?',
          prompt: 'Match each TindaTrack situation to the STRIDE threat it shows.',
          concept: 'STRIDE',
          labels: { terms: 'Situation', meanings: 'Threat type' },
          pairs: [
            { term: 'A cashier\'s phone is stolen and a thief opens the app, then claims the sales were never made by that cashier.', definition: 'Repudiation: nothing proves who did what', note: 'The question is about denying an action. The stolen phone is how it started, but the missing proof is the threat.' },
            { term: 'A request that says "price: 1 peso" is accepted by the API, because the price comes from the browser.', definition: 'Tampering: data changed on the way', note: 'The data was altered and the server believed it. Nobody pretended to be someone else.' },
            { term: 'A report page takes ten seconds to build, and a script calls it hundreds of times a minute.', definition: 'Denial of service: real users cannot get in', note: 'No data is read or changed. The harm is that the system becomes unavailable.' },
            { term: 'A cashier changes a number in the address bar and sees the owner-only profit page.', definition: 'Elevation of privilege: more power than the role allows', note: 'The person is who they say they are. They are doing more than their role allows.' },
          ],
          hints: [
            'Ask what is harmed in each case: who someone is, what data says, what can be proved, what is available, or what someone is allowed to do.',
            'Two situations involve a real, signed-in user. What did they do that their role does not permit, and what could not be proved?',
            'The report script harms availability. The price field harms integrity.',
          ],
          explanation: 'STRIDE names what is threatened. Repudiation is about accountability, Tampering about integrity, Denial of service about availability and Elevation of privilege about authorization. Naming the category tells you which kind of control to look for.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-31-scenario-1',
          kind: 'scenario',
          title: 'Where do you start the review?',
          prompt: 'Choose the best way to run the threat model.',
          concept: 'threat modelling method',
          situation: 'TindaTrack will add text-message payment reminders next sprint. The lead asks you to "make sure it is secure" in one afternoon. The feature reads the customer\'s phone number from the database, calls a text-message provider and records that a reminder was sent. You have two hours.',
          options: [
            { text: 'Draw the data-flow with the provider and the database, mark where data crosses a boundary, ask the STRIDE questions at each crossing, and pick the cheapest fix for the top two risks.', consequence: 'You find that a store owner could trigger reminders for any customer ID, and that the provider key sits in a config file. Both get a small fix, and the remaining items are written down as accepted or later.', quality: 'best' },
            { text: 'Ask an assistant for a full security checklist and hand it to the lead as the review.', consequence: 'The checklist is long and generic. It does not mention that the owner can pass any customer ID. Nobody looks at the actual flow, so the real gap ships.', quality: 'poor' },
            { text: 'Review only the code of the new endpoint, line by line.', consequence: 'You find a missing input check, which is useful, but you never asked who may call the feature or where the provider key lives. The design-level gaps stay.', quality: 'acceptable' },
            { text: 'Skip the review and add a Web Application Firewall to cover everything.', consequence: 'The firewall does nothing about an owner using the feature on another store\'s customers. The team spends the sprint on a tool and still has the same hole.', quality: 'poor' },
          ],
          hints: [
            'Start with what the feature is and where its data flows. What is the first thing a threat model needs?',
            'The best option names the method: boundaries, then questions at each crossing, then the cheapest fixes.',
            'A generic checklist and a heavy tool both skip looking at this particular flow.',
          ],
          explanation: 'A short, structured pass over this feature\'s own data flow finds the real gaps. Generic checklists and big tools do not look at who can call the feature or where its secrets live, which is where the risk was.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-31-arrange-1',
          kind: 'arrange',
          title: 'Put the threat modelling steps in order',
          prompt: 'Arrange the steps from first to last.',
          concept: 'threat modelling method',
          language: 'text',
          solution: [
            'Draw the data-flow diagram of the feature',
            'Mark every trust boundary on the diagram',
            'Ask the STRIDE questions at each boundary crossing',
            'Choose avoid, reduce, transfer or accept for each threat',
            'Record the decisions and review them when the design changes',
          ],
          reasons: [
            'You cannot find threats in a system you have not drawn.',
            'Boundaries tell you where to look.',
            'The questions find the threats.',
            'Each threat needs a decision, not just a list entry.',
            'The model is only useful if it is kept and revisited.',
          ],
          hints: [
            'What must exist before you can mark anything on it?',
            'Boundaries come before the questions, because the questions are asked at the boundaries.',
            'The last step keeps the work alive after today.',
          ],
          explanation: 'Draw, mark boundaries, ask questions, decide, record. Each step feeds the next, and the last step keeps the model from becoming a forgotten document.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-31-q1',
        prompt: 'You have drawn a data-flow diagram of a booking system. Where should you look first for threats?',
        choices: [
          'At every box, starting with the one that holds the most code',
          'At the arrows that cross a trust boundary, such as a request from a browser or a callback from a provider',
          'At the database, because attackers always go for the data store first',
          'At the arrows inside the private network, since those carry the most traffic and so offer attackers the most to gain',
        ],
        answer: 1,
        explanation: 'Data that crosses a boundary comes from something you do not control, so it is where spoofing and tampering are most likely. The other places matter too, but the boundary crossings are the efficient place to start.',
      },
      {
        id: 'software-architecture-ai-31-q2',
        prompt: 'A webhook endpoint marks an order paid whenever a request says "status: paid". Which first fix matches the design problem?',
        choices: [
          'Hide the address of the endpoint so that fewer people know it exists',
          'Add a Web Application Firewall in front of the whole system, which also covers the webhook',
          'Rate-limit the endpoint so that a script can only mark a few orders a minute, and send an alert to the team every time the limit is reached',
          'Verify the sender with a shared-secret signature and confirm the payment with the provider before marking the order paid',
        ],
        answer: 3,
        explanation: 'The threat is spoofing: the endpoint trusts a claim it cannot verify. Proving where the request came from fixes that. Hiding the address, a firewall or a rate limit do not prove who sent it.',
      },
      {
        id: 'software-architecture-ai-31-q3',
        prompt: 'Why is STRIDE described as "a prompt for questions" and not a checklist?',
        choices: [
          'It gives you a standard question for each kind of threat at each crossing, so you rely on a method instead of on what you happen to remember',
          'It lists every threat a system can ever face, so a team that works through it once is finished with security and can move on to the next feature',
          'It produces a numeric risk score for each component that you can sort without discussing anything',
          'It replaces the need for a data-flow diagram, because the six letters already describe the system',
        ],
        answer: 0,
        explanation: 'STRIDE works by making you ask the same six questions at every crossing. It does not list every threat, score risk or replace the diagram, and it never ends: new features bring new crossings.',
      },
      {
        id: 'software-architecture-ai-31-q4',
        prompt: 'A team says, "We did a threat model last year, so we are covered." The product has since added a new payment provider and a new reporting database. What is the best response?',
        choices: [
          'Agree: a threat model that was reviewed once stays valid until the team is rewritten',
          'Run a full new threat model for the whole company, since the old one has no value at all',
          'Revisit the model for the changed parts: the new boundaries and data stores each add crossings that were never examined',
          'Replace the model with an automated scanner that checks the new database each night',
        ],
        answer: 2,
        explanation: 'A threat model describes the system as drawn at one time. New providers and stores add new boundary crossings, so those parts need the questions asked again. A rewrite of everything is unnecessary, and a scanner cannot ask design questions.',
      },
      {
        id: 'software-architecture-ai-31-q5',
        audience: { max: 'beginner' },
        prompt: 'In the sari-sari store comparison, what does a "trust boundary" correspond to?',
        choices: [
          'The shelves, because that is where the goods are stored and where most things can go missing',
          'The door between the street and the store, where you stop being sure who is on the other side',
          'The cash drawer, because it holds the most valuable thing',
        ],
        answer: 1,
        explanation: 'A trust boundary is the line where data or people come from something you do not control. In the store, that is the door.',
      },
      {
        id: 'software-architecture-ai-31-q6',
        audience: { min: 'advanced' },
        prompt: 'Your threat model lists 30 threats, and the team wants to rank them with a single score each. What is the sound way to use the scores?',
        choices: [
          'Fix everything above the middle score and ignore the rest, because the numbers show real measured risk',
          'Use them to order the discussion, then look at impact and ease of exploitation for the top items, and write down accepted risks with their owner',
          'Drop the scores and fix threats in the order that they were found, so that the process stays simple',
          'Let each developer rate the threats in their own area and merge those ratings without a review, so that nobody feels blamed or has to argue about the order',
        ],
        answer: 1,
        explanation: 'Scores are judgments, not measurements. They help you decide what to talk about first. The decision itself, including what is accepted and by whom, still needs people and a record.',
      },
    ],
    task: {
      title: 'Threat model one feature of your own system',
      steps: [
        'Pick one feature of a system you know (or TindaTrack\'s checkout) and draw its data flow with five to eight boxes in the `arch-diagram-workbench`. Save it.',
        'Mark every trust boundary: anything that comes from a browser, a phone, a partner or another team.',
        'For the two boundary crossings you worry about most, answer all six STRIDE questions in one line each.',
        'For each threat you find, choose avoid, reduce, transfer or accept, and write one sentence that says why.',
        'Run the prompt from "Try it with AI" and cross out every suggestion that does not name one of your arrows.',
      ],
      minutes: 18,
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Add a second diagram of the same feature after the change you plan next (a new integration or data store), compare the two, and list the new boundary crossings. Write the one threat you would escalate to a security professional.'] },
      { audience: { max: 'beginner' }, steps: ['Keep it small: draw only four boxes (user, app, database, one outside service) and answer STRIDE for the single arrow that comes from the outside service.'] },
    ],
  },
  {
    id: 'software-architecture-ai-32',
    day: 32,
    title: 'Authentication and Authorization: Sessions, Tokens, RBAC and ABAC',
    summary: 'Separate who someone is from what they may do, choose between sessions and tokens, and design roles and rules that hold on the server.',
    intro: {
      objectives: [
        'Explain the difference between authentication and authorization and where each is enforced',
        'Compare server-side sessions and signed tokens, including how each is revoked',
        'Describe at concept level how OAuth and OpenID Connect let an app avoid handling passwords',
        'Choose between role-based (RBAC) and attribute-based (ABAC) rules and apply least privilege',
      ],
      why: 'Most serious access bugs are not broken locks but missing ones: a check that exists in the screen and not on the server. Getting the model right early keeps every later feature safe by default.',
    },
    minutes: 25,
    skills: ['arch-security'],
    body: [
      { type: 'paragraph', text: `Two questions sound alike and are very different. **Authentication** asks "who are you?" and ends with the system believing an identity. **Authorization** asks "what may you do?" and is asked again for every action. A system can authenticate perfectly and still leak data if it forgets the second question. This lesson builds both answers into the architecture, and ties them to the multi-store design TindaTrack now has. You met the question of where each kind of check lives in the API module (authentication boundaries and gateways); here we look at how to choose the mechanism and write the rules.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack now has three kinds of people in a store: the owner, a manager and cashiers. The first version of the app hid the "Reports" menu from cashiers, and everyone considered the job done. A cashier named Joel noticed that the reports screen had an address, tried it in the browser, and the profit report opened. The server only checked that the caller was signed in. It never asked whether the caller's role was allowed to see reports.` },
      { type: 'paragraph', text: `Nothing was stolen, but the owner learned how much margin each product had, and one owner then asked whether staff could see other things too. The fix took one afternoon. The lost trust took longer. The lesson is simple and often forgotten: hiding a button is a convenience for honest users, not a control. The control is a check on the server, every time.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Sessions and tokens** are two ways to remember who signed in. With a **session**, the server stores a record ("session 8f3a belongs to Rosa") and gives the browser only a long random id, usually in a cookie. Every request brings the id and the server looks it up. Ending access is easy: delete the record. The cost is that every server needs access to the session store, which is one more thing to run and to keep fast. With a **token**, the server hands the client a signed statement ("Rosa, owner of store 12, valid until 3 PM"). Any server can check the signature without a lookup, which is convenient when many services receive requests. The cost is revocation: until it expires, a signed token stays valid unless you add a list of revoked tokens, which brings back a lookup.` },
      { type: 'table', headers: ['', 'Server-side session', 'Signed token'], rows: [
        ['What the client holds', 'A random id that means nothing alone', 'A signed statement with identity and claims inside'],
        ['Check on each request', 'Look the id up in the session store', 'Verify the signature and the expiry'],
        ['End access now', 'Delete the record', 'Wait for expiry, or keep a revoked list'],
        ['Good fit', 'One web app with its own back end', 'Several services, or a mobile app calling an API'],
        ['Main cost', 'A shared store to run', 'Stale claims and harder revocation; keep them short-lived'],
      ], caption: 'Neither is "more modern". Pick by how quickly you must end access and how many services need to check who is calling.' },
      { type: 'paragraph', text: `**OAuth and OpenID Connect (OIDC)** answer a different problem: how to let a user sign in with an account held by another provider, without your app ever touching their password. OAuth is a way to delegate limited access ("let this app read my calendar"). OIDC adds a layer on top that says who the user is. For sign-in you want OIDC. In the flow below, your app sends the user to the provider, the provider checks the password and hands back a signed proof of identity, and your app trusts the proof, not the user's word. Use a maintained library or a managed identity service for this; writing your own is a classic way to create a hole.` },
      { type: 'diagram', format: 'mermaid', source: `sequenceDiagram
  actor Owner as Store owner
  participant Web as TindaTrack web app
  participant Idp as Identity provider
  participant Api as TindaTrack API
  Owner->>Web: Choose sign in
  Web->>Idp: Send the owner to the provider's page
  Idp-->>Owner: Ask for the password there
  Idp-->>Web: Signed proof of who signed in
  Web->>Api: Request with the proof
  Api-->>Web: Data, only if the proof and the role allow it`, caption: `Sign-in with an identity provider. Notice that the password goes only to the provider, and that the API still decides what the person may do. Authentication ends at the proof; authorization starts at the API.` },
      { type: 'paragraph', text: `**Authorization models.** **RBAC** (role-based access control) gives each person a role and each role a list of permissions: owner, manager, cashier. It is easy to explain, to review and to audit, which is why it is the default. **ABAC** (attribute-based access control) decides from facts about the person, the thing and the situation: "a manager may refund a sale in their own store when the amount is under the store's refund limit". It is more flexible and harder to reason about, since the rule can depend on many facts. A practical design is a hybrid: roles for the broad shape, plus a few attribute rules (the store, an amount, a time) where roles are not enough.` },
      { type: 'paragraph', text: `Three rules make either model work. **Deny by default:** no rule means no access. **Enforce on the server:** every request is checked, whatever the screen shows. **Tenant first:** in a multi-store system, the store comes from the signed-in session, never from a field the caller sends, and every check compares it with the store that owns the data. The next lesson adds encryption and secrets; the one after covers the tenant boundary in full. **Least privilege** applies to services and keys too: the API's database account should not be able to drop tables, and a reporting job should read, not write.` },
      { type: 'code', language: 'typescript', label: 'An authorization check that denies by default and checks the store first', code: `type Role = 'owner' | 'manager' | 'cashier';
type Action = 'sale.create' | 'sale.void' | 'report.view' | 'staff.invite';

const allowed: Record<Role, Action[]> = {
  owner: ['sale.create', 'sale.void', 'report.view', 'staff.invite'],
  manager: ['sale.create', 'sale.void', 'report.view'],
  cashier: ['sale.create'],
};

// The session comes from the server, never from the request body.
type Session = { userId: string; role: Role; storeId: string };

export function canDo(session: Session, action: Action, resourceStoreId: string): boolean {
  if (session.storeId !== resourceStoreId) return false; // wrong store: stop here
  return allowed[session.role].includes(action);      // not listed: not allowed
}` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: when you walk into a bank, the guard at the door checks who you are (authentication). Later, the teller checks whether your account may withdraw this amount (authorization). Being let in does not mean you may open the vault. A "session" is like a numbered ticket the bank keeps a record of; a "token" is like a stamped pass you carry that anyone can check without calling the office. The ticket is easy to cancel. The pass works anywhere but is harder to take back, so it should expire soon.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a larger system the hard part is not the first model but keeping decisions consistent. Several services re-implementing permission rules drift apart; a single decision point (a library or a policy service) with tests for each role and tenant keeps them aligned. Keep tokens short-lived with a refresh mechanism, and for sensitive actions (refunds, exporting data, changing roles) re-check the current role from the database, because a role in a token can be minutes or hours out of date after someone is demoted. Log every allow and deny for sensitive actions with the actor and the tenant, so that a review can reconstruct what happened. Treat "service to service" calls as authenticated too: an internal network is not a trust level.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'An AI-drafted login design for TindaTrack', prompt: `We have a browser app and a Node API for TindaTrack, about 200 stores, three roles (owner, manager, cashier). Propose how users sign in and how the API decides what they can do.`, output: `Recommended design\n\n1. Users sign in with email and password. The API returns a JWT containing userId, role and storeId, valid for 30 days.\n2. The browser app stores the JWT in localStorage and sends it in the Authorization header.\n3. Because the token is stateless, no database lookups are needed on each request, so this design scales to millions of users.\n4. RBAC: the role claim in the JWT is used to allow or deny each endpoint.\n5. For multi-store support, the client sends the storeId it wants to work in on each request.`, notice: `Look for the problems in order. Step 1: a 30-day lifetime means a stolen or outdated token works for a month, and a fired cashier keeps access until it expires. Step 2: a token kept where page scripts can read it is exposed to any script on the page. Step 3: "scales to millions" is a claim with no basis for a 200-store system, and avoiding one lookup is not the real constraint. Step 4: the role is frozen in the token, so a demotion does not take effect. Step 5 is the worst: the client chooses the store. Anyone can send another store's id. The store must come from the verified identity.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write your own answer to three questions before you ask anything: how quickly must you end someone's access, which roles exist and which actions each may perform, and where in a request the tenant comes from. Then let an assistant attack your design instead of producing one.` },
      { type: 'prompt', label: 'Access design critique', text: `I am designing sign-in and access rules for [system], used by [who]. Roles: [list roles]. My draft:\n- Sign-in: [sessions or tokens, and who verifies the password].\n- How long access lasts and how I end it immediately: [your answer].\n- Permission rules: [a small table of role -> actions].\n- Where the tenant (store, company, clinic) comes from on each request: [your answer].\n\nBehave as a security reviewer. 1) List every place where my draft trusts something the caller controls. 2) Tell me what happens in my design when a user is demoted or fired. 3) Say whether RBAC is enough or which one rule needs an attribute check, with one cost. 4) State your assumptions and anything you cannot judge without seeing my system. Do not recommend extra products unless a requirement of mine needs them.` },
      { type: 'paragraph', text: `Verify the answer against your own design: for each "trusts the caller" item, can you point to the line in your design where the server checks it instead? If the assistant recommends a managed identity service, decide on cost and operations yourself.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write a table of roles and actions for your system, then add a "who may see which store" column.',
        'Find every place in your code where a role is checked only in the user interface, and add the server check.',
        'Next lesson, Encryption, Secrets Management and API Security, covers protecting data, keys and the API surface.',
        'Read the official documentation of the identity provider or library you would use, and the "How OpenID Connect Works" page of the OpenID Foundation (openid.net), before choosing.',
      ] },
      { type: 'takeaways', items: [
        'Authentication asks who you are; authorization asks what you may do, and it is checked on the server for every request.',
        'Sessions are easy to revoke and need a shared store; signed tokens need no lookup but stay valid until they expire, so keep them short-lived.',
        'OAuth delegates access; OpenID Connect adds identity, so your app never sees the user\'s password.',
        'RBAC is the simple default; add a few attribute rules (store, amount, time) where roles are not enough.',
        'Deny by default, take the tenant from the verified session, and give every person, service and key the least access it needs.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-32-scenario-1',
          kind: 'scenario',
          title: 'The hidden menu',
          prompt: 'Choose the best fix.',
          concept: 'server-side authorization',
          situation: 'A cashier opened the owner-only profit report by typing its address. The team lead suggests three fixes. The API checks that the caller is signed in, but not the caller\'s role. You have one day.',
          options: [
            { text: 'Add a role check to the report endpoint on the server, deny by default, and write a test that a cashier receives a refusal. Keep hiding the menu as a courtesy.', consequence: 'The cashier now gets a refusal on the direct address. The menu stays hidden for tidiness, and the test keeps the rule from disappearing in a later change.', quality: 'best' },
            { text: 'Rename the report address to something harder to guess.', consequence: 'It takes a few days before a cashier finds it in the network tool of the browser. The hole is the same, only less convenient to find.', quality: 'poor' },
            { text: 'Check the role in the front end before the page calls the API.', consequence: 'Honest users are blocked, but anyone who calls the API directly is not. The server still answers every signed-in caller.', quality: 'poor' },
            { text: 'Fix only the profit report now and review the other endpoints next month.', consequence: 'The report is safe, but the same missing check exists on the staff list and the refund action, and one of them is found by a customer first.', quality: 'acceptable' },
          ],
          hints: [
            'Where does the real decision about the data happen: the screen, or the API?',
            'A secret address is not a control, and neither is a check that only honest users run.',
            'Look for the option that adds a server check and a test.',
          ],
          explanation: 'The control must sit where the data is served. A server-side check with a default of "deny" and a test protects every caller. Hidden menus and secret addresses protect only against users who are not looking.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-32-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the access rules',
          prompt: 'Fill each blank with the right word.',
          concept: 'authentication vs authorization',
          language: 'text',
          code: `Authentication answers: ___ are you?
Authorization answers: what ___ you do?
A cashier may create a sale but may not ___ a sale.
A rule that depends on the refund amount and the store is an ___ rule.`,
          blanks: [
            { answers: ['who'], feedback: 'Authentication is about identity.' },
            { answers: ['may'], feedback: 'Authorization is about permission.' },
            { answers: ['void'], feedback: 'Look at the roles table: the cashier row has only one action.' },
            { answers: ['ABAC'], feedback: 'Rules that use facts such as an amount or a store are attribute-based.' },
          ],
          bank: ['who', 'may', 'void', 'ABAC', 'RBAC', 'what', 'create'],
          hints: [
            'The first two lines are the definitions of the two words in the lesson.',
            'Check the code block: the cashier is allowed one action only.',
            'RBAC uses roles alone. The last rule needs more facts than a role.',
          ],
          explanation: 'Authentication is who, authorization is what you may do. In the table, a cashier can only create sales. Once a rule needs an amount or a store, it uses attributes, which is ABAC.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-32-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Sessions and tokens: the stress test',
          prompt: 'Tap each card, think about your answer, then check it.',
          concept: 'sessions vs tokens',
          hints: ['Think about the moment a staff member is let go.', 'Think about how many services need to check who is calling.'],
          explanation: 'Sessions end access at once and need a shared store. Tokens are verified without a lookup but stay valid until they expire. Short lifetimes and re-checking roles for sensitive actions reduce the cost of tokens.',
          cards: [
            { front: 'A cashier is fired at 2 PM. With a signed token that lasts 30 days, what happens at 2:05 PM?', back: 'The token still verifies. Access continues until it expires, unless you keep a revoked list (which adds a lookup). Short lifetimes shrink this window.' },
            { front: 'Five services must check who is calling and none should call a central store. Which fits better?', back: 'Signed tokens: each service can verify the signature itself. The price is stale claims and harder revocation.' },
            { front: 'Why should a role inside a token not be the only check for a refund?', back: 'The role may be out of date after a demotion. For sensitive actions, re-check the current role from the database.' },
          ],
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-32-q1',
        prompt: 'The profit report is hidden from cashiers in the app, but its address works if typed. Where must the control be enforced?',
        choices: [
          'In the front end, because that is where the user chooses what to open',
          'In both places equally, since a missing check in either one has the same effect',
          'On the server, for every request, with the hidden menu only as a courtesy to honest users',
          'In the network settings, so that cashiers\' devices cannot reach the address',
        ],
        answer: 2,
        explanation: 'Anyone can call the API directly, so only a server-side check protects the data. The menu is helpful, but it is not a control. Network restrictions do not know who the user is.',
      },
      {
        id: 'software-architecture-ai-32-q2',
        prompt: 'The owner fires a manager and needs access to end immediately. Which statement is accurate about the two designs?',
        choices: [
          'A server-side session ends access at once when the record is deleted, while a signed token stays valid until it expires unless you add tracking',
          'A signed token ends access at once because the signature is checked on every request, while a session cannot be cancelled early and must be left to expire',
          'Both end access at once, because the browser forgets the cookie when the manager signs out',
          'Neither can end access early, which is why companies change their passwords every month',
        ],
        answer: 0,
        explanation: 'A session lives in a store the server controls, so deleting it ends access. A token carries its own proof, so the server must add a revoked list or wait for expiry.',
      },
      {
        id: 'software-architecture-ai-32-q3',
        prompt: 'Your team wants customers to sign in with an account from another provider, so that TindaTrack never handles the password and still learns who signed in. Which concept is the right one to use?',
        choices: [
          'Plain OAuth, because it delegates access and returns a user identity in every case',
          'A custom login form that forwards the password to the provider on the user\'s behalf',
          'A shared secret that every customer enters once and the server stores in the database',
          'OpenID Connect, the identity layer on top of OAuth, using a maintained library or managed service',
        ],
        answer: 3,
        explanation: 'OAuth alone delegates access; OIDC adds the identity of the person. Forwarding the password defeats the point, and a shared secret is not an identity.',
      },
      {
        id: 'software-architecture-ai-32-q4',
        prompt: 'A rule says managers may refund a sale only in their own store and only under the store\'s refund limit. Which design fits best?',
        choices: [
          'Create one role for every combination of store and limit, so only roles are needed',
          'Roles for the broad permissions, plus a small attribute rule that checks the store and the amount',
          'Move the whole system to attribute rules for every action, even ones that depend only on role, since one model is simpler to explain',
          'Leave the check to the manager\'s judgment and record refunds in a log afterwards',
        ],
        answer: 1,
        explanation: 'Roles give the broad shape and are easy to review. The store and amount are facts that roles cannot express, so one attribute rule covers them. Role explosion and manual trust both cost more.',
      },
      {
        id: 'software-architecture-ai-32-q5',
        audience: { max: 'beginner' },
        prompt: 'Which sentence matches the bank example?',
        choices: [
          'The guard checks the account balance, and the teller checks your face.',
          'Being let in at the door does not mean you may open the vault.',
          'If the guard knows you, the teller never needs to check anything.',
        ],
        answer: 1,
        explanation: 'The door check is authentication; the teller\'s check is authorization. Passing the first does not skip the second.',
      },
      {
        id: 'software-architecture-ai-32-q6',
        audience: { min: 'advanced' },
        prompt: 'Your API uses short-lived signed tokens that carry a role. A manager is demoted and tries a bulk data export a few minutes later. What design handles this best?',
        choices: [
          'Accept it, because the token was valid when issued and revocation is always too expensive to build for a system of this size, and the manager is unlikely to misuse it',
          'Re-check the current role in the database for sensitive actions such as exports, and log the decision with actor and tenant',
          'Issue tokens with no expiry and rely on users signing out, so the system has fewer moving parts',
          'Put the role in a second token that the browser stores and sends only for exports',
        ],
        answer: 1,
        explanation: 'Claims in a token go stale. Re-checking current state for sensitive actions closes the gap at the price of one lookup where it matters, and logging gives a review something to read.',
      },
    ],
    task: {
      title: 'Write the access rules of your system',
      steps: [
        'List the roles of your system (or use owner, manager, cashier) and the 6 to 10 actions that matter. Make a table of role against action.',
        'Mark each action as role-only, or as needing one attribute check (store, amount, time). Write the rule in one sentence.',
        'Decide sessions or tokens for sign-in and how long access lasts. Write what happens when someone is removed.',
        'Check in your code or design where each rule is enforced. Circle any rule that only exists in the user interface.',
      ],
      minutes: 18,
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Write five test cases for the authorization function: wrong store, right store wrong role, demoted user, missing session and unknown action. State which layer would catch a regression of each.'] },
      { audience: { max: 'beginner' }, steps: ['Use only two roles (owner and cashier) and three actions, and write the table by hand before opening any tool.'] },
    ],
  },
  {
    id: 'software-architecture-ai-33',
    day: 33,
    title: 'Encryption, Secrets Management and API Security',
    summary: 'Protect data in transit and at rest, keep keys and secrets out of code, and shape an API that validates input and limits abuse.',
    intro: {
      objectives: [
        'Explain what encryption in transit and at rest each protect against, and what they do not',
        'Describe how keys and secrets are kept apart from data and code, rotated and revoked',
        'Design input validation, rate limits and safe errors for an API',
        'Spot weak advice in an AI-written security plan, such as a key stored beside the data',
      ],
      why: 'Many breaches come from a key left in the wrong place or an endpoint that believed its caller. These are design choices you can make once, in a drawing, instead of fixing under pressure.',
    },
    minutes: 26,
    skills: ['arch-security'],
    body: [
      { type: 'paragraph', text: `Encryption sounds like a switch you turn on, and a secret sounds like a small detail. In architecture, both are about where trust lives. Encryption turns readable data into unreadable data using a key, so the real question is always "who holds the key, and what can they reach with it?" A secret is any value that proves your system's identity to another system: a password, an API key, a signing key. This lesson covers how to protect data and secrets, and how to shape the API so that it does not believe everything it is told. It builds on the previous two lessons: threat modelling told you where to look and access control told you who may do what.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `On a busy Friday, a TindaTrack developer pushed a settings file to the shared repository. It held the e-wallet provider's test key and, copied by habit, the production database password. The repository was shared with a freelance designer who had joined the week before. As far as anyone could tell, nothing was misused. But the team could not prove that, and a secret that has been in a shared place has to be treated as known.` },
      { type: 'paragraph', text: `The fix was boring and expensive: create new credentials, deploy them, revoke the old ones, and read the logs for anything strange. Done in the wrong order, it caused a few hours of failed payments while the old key was already gone and the new one was not yet deployed. The whole thing cost about a day and a half of the team's time (an invented figure for this example). The better design, which this lesson describes, would have meant the secret was never in the repository at all.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Encryption in transit** protects data while it moves between two parts, so that someone watching the network sees noise. It is provided by TLS, the protocol behind HTTPS, and you apply it to every arrow in the data-flow diagram that leaves a machine, including the call from your API to the database if they are not on the same machine, and calls to a payment provider. **Encryption at rest** protects stored data: disks, databases and backups. It helps if a disk, a snapshot or a backup file is stolen or handed to the wrong person. It does **not** help against someone who breaks into the running application, because the application can read the data and so can they. Encryption is not access control; it is one more layer. For the most sensitive fields, you can also encrypt a single field with a key that only certain code can use. Always use a standard algorithm from a maintained library. Never invent your own.` },
      { type: 'paragraph', text: `**Passwords are a special case:** you should not be able to read them back, so you do not encrypt them, you **hash** them: a one-way transformation, deliberately slow, with a unique random value (a salt) per password, from a maintained library. If your system can email a user their old password, it is storing it wrongly. Better still, use an identity provider (the previous lesson) so that you never store passwords at all.` },
      { type: 'paragraph', text: `**Key management** starts with a rule: **keys live apart from the data they protect.** A database backup that sits beside its key is not encrypted in any useful sense. Keep keys in a dedicated key service or secret manager, give each service only the keys it needs, log who used them, and plan **rotation**: the ability to replace a key without taking the system down. A common design is **envelope encryption**: data is encrypted with many small data keys, and those keys are themselves encrypted by one master key that never leaves the key service. Rotating the master key then does not mean re-encrypting all the data.` },
      { type: 'paragraph', text: `**Secrets management** has a short list of rules. Never put a secret in source code or in the repository, including old history, since deleting a file later does not remove it from past versions. Keep different secrets for each environment, so a leaked test key opens nothing in production. Deliver secrets to the program at start-up from a secret store; the deployment configuration holds only their names. Give each secret the least power it needs (a read-only key for the reports job). Scan commits for secrets before they are pushed. Never write secrets into logs or error messages. And write a **leak plan** in advance: assume exposure, rotate in the right order (new secret in place and deployed, then the old one revoked), and read the logs.` },
      { type: 'diagram', format: 'mermaid', source: `flowchart LR
  Browser((Browser)) -->|TLS| Api[API server]
  Api -->|TLS| Db[(Database, encrypted at rest)]
  Api -.->|Reads secrets at start| Vault[(Secret manager)]
  Db -->|Nightly copy| Backup[(Encrypted backups)]
  Vault -.->|Key for the backups| Backup`, caption: `Where the protection sits. Look at the dotted arrows: the keys and secrets live in a secret manager, not in the API's code or beside the data. If the backup is stolen, the key is not with it.` },
      { type: 'code', language: 'yaml', label: 'Illustrative deployment config: names and sources only, never values', code: `# Committed to the repository: no secret values here.
service: tindatrack-api
secrets:
  - name: DATABASE_URL
    source: secret-manager://tindatrack/prod/database-url
  - name: WALLET_API_KEY
    source: secret-manager://tindatrack/prod/wallet-api-key
  - name: WEBHOOK_SECRET
    source: secret-manager://tindatrack/prod/wallet-webhook-secret` },
      { type: 'paragraph', text: `**API security** is the same thinking at the front door. **Validate input at the boundary:** check type, length and range, accept only fields you expect (an allow-list), and reject the rest before any business logic runs. **Authorize every endpoint** (the previous lesson), and never trust an id just because it arrived in the address. **Rate limit** to slow abuse and accidents: count requests per signed-in identity and per tenant, and apply stricter limits to sign-in attempts and to expensive operations such as report exports. Choose the numbers from your measured normal use, not from a blog post. Per-address limits alone are risky: a store whose staff share one internet connection looks like one caller. **Cap the cost of a request** (page sizes, body sizes, query time). **Return safe errors:** the same message for "no such user" and "wrong password", and no stack traces. Log security events with who, what and which tenant, but never the secrets.` },
      { type: 'code', language: 'typescript', label: 'Input validated at the boundary (limits are examples; choose yours from real use)', code: `type SaleItem = { productId: string; quantity: number };

export function parseSaleItems(body: unknown): SaleItem[] | null {
  if (typeof body !== 'object' || body === null) return null;
  const items = (body as { items?: unknown }).items;
  if (!Array.isArray(items) || items.length === 0 || items.length > 100) return null;

  const parsed: SaleItem[] = [];
  for (const item of items) {
    if (typeof item !== 'object' || item === null) return null;
    const { productId, quantity } = item as { productId?: unknown; quantity?: unknown };
    if (typeof productId !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(productId)) return null;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity)) return null;
    if (quantity < 1 || quantity > 1000) return null;
    parsed.push({ productId, quantity });
  }
  return parsed; // anything unexpected was rejected above
}` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: encryption is a lock, and a key opens it. If you tape the key to the lock, the lock does nothing. So the design rule is to keep keys somewhere else, with their own guard. A "secret" is any key, password or code your program uses to prove who it is. Treat each one like the key to your shop: never leave it where others can copy it (like a shared notebook), and have a plan for changing the locks if one goes missing. For the API, think of a cashier who checks each coin: look at what arrives before you accept it, and slow down anyone who tries a thousand coins a minute.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a larger system, plan for what happens at scale and at the boundaries between teams. Prefer short-lived credentials issued on demand over long-lived ones that must be rotated by hand, and automate rotation so it is rehearsed, not a heroic event. Know your blast radius: if one service key leaks, which data can it reach? Separate keys by environment, by service and, where tenants have strict needs, by tenant. Put validation in one shared place so that two services do not accept different shapes of the same input. Rate limits need a shared counter or a gateway when there are several servers, and they must fail in a chosen direction (open or closed) when that counter is unavailable. Compliance requirements about keys and encryption differ by industry and country; read the official text and ask a specialist, because a design alone does not make you compliant.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'An AI-drafted security plan for the API', prompt: `Our TindaTrack API runs on one server with a PostgreSQL database and an e-wallet integration. Write a short security plan covering encryption, secrets and API protection.`, output: `Security plan\n\n1. Encrypt every column of every table with AES-256. Store the encryption key in the .env file on the server, next to the database URL, so that the application can start without extra setup.\n2. Keep the e-wallet API key in the repository's config file so that the whole team has it.\n3. Rate limit all endpoints to 100 requests per minute per IP address, which is the industry standard.\n4. Return detailed error messages, including the failed SQL query, to help developers debug faster.\n5. Hash passwords with a fast hash function so that logins stay quick.`, notice: `Find the five weaknesses. The key sits next to the data it protects, so a copy of the server gives away both. A key in the repository is the exact incident from this lesson. "100 per minute per address, the industry standard" is a number with no source, and a store sharing one connection would hit it as a whole. Detailed errors hand an attacker the shape of your database. A fast hash is the wrong direction: password hashing should be slow on purpose. Notice also that encrypting every column is not the same as protecting access: the application can still read them all.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write a one-page security note for your own system first: where data is encrypted and who holds each key, a table of secrets with where each one lives, and three limits you would put on your API. Then ask an assistant to look for weak spots, and to name what it cannot know.` },
      { type: 'prompt', label: 'Secrets and API review', text: `Review my security design for [system]. I will paste my notes; they are a draft, not a decision.\n\nEncryption: [in transit where, at rest where, who holds the keys].\nSecrets: [a table: secret, what it opens, where it is stored, who can read it, how it is rotated].\nAPI limits: [input validation approach, rate limits and what they are based on, error handling].\n\nInstructions: 1) List every place where a key or secret is stored near what it protects or in a place several people can read. 2) For each limit, ask what it is based on and whether that fits how my users really connect. 3) List the assumptions you are making about my system. 4) Do not give numbers as if they were standards; tell me which of my limits I must decide from my own measurements. 5) Tell me which items need review by a security professional.` },
      { type: 'paragraph', text: `Check the answer: did it flag the same weak spots you can see in your own table? Did it present any number as a standard without a source? Delete those and measure your own.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write a table of every secret your system uses: what it opens, where it is stored and who can read it. Fix the first row that surprises you.',
        'Write a leak plan in five lines: who decides, the order of rotation, where to read the logs.',
        'Next lesson, Tenant Isolation and Architecture Security Reviews, covers separating customers and reviewing a design for security.',
        'Read the OWASP Secrets Management Cheat Sheet and the documentation of the secret manager your provider offers.',
      ] },
      { type: 'takeaways', items: [
        'Encryption in transit protects data on the move; encryption at rest protects stolen disks and backups, but not a compromised running application.',
        'Keep keys apart from the data they protect, and plan rotation before you need it.',
        'Never put secrets in source code or its history; deliver them at start-up from a secret store and keep one set per environment.',
        'Hash passwords slowly with a maintained library, or avoid storing them by using an identity provider.',
        'Validate input at the boundary, limit requests by identity and tenant using numbers from your own data, and return safe errors.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-33-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Respond to a key found in the repository',
          prompt: 'Build the safest response. Add steps in the right order and leave out the tempting wrong ones.',
          concept: 'secrets management',
          situation: 'A scan finds the e-wallet API key in a file pushed to the shared repository yesterday. The repository has several people with access. You must contain it without breaking payments for stores.',
          parts: [
            { id: 'alert', lane: 'input', label: 'Scan alerts: key found in the repository', detail: 'A secret scanner reports the key and the commit.' },
            { id: 'new-key', lane: 'tool', label: 'Create a new key in the secret manager', detail: 'Issue a replacement key and store it in the secret manager, not in code.' },
            { id: 'deploy', lane: 'tool', label: 'Deploy the service with the new key', detail: 'Release so the service reads the new key at start-up.' },
            { id: 'revoke', lane: 'tool', label: 'Revoke the old key at the provider', detail: 'The exposed key stops working everywhere.' },
            { id: 'logs', lane: 'human', label: 'A person reviews provider and API logs for misuse', detail: 'Look for requests the team did not make since the key was exposed.' },
            { id: 'draft-note', lane: 'ai', label: 'Ask an assistant to draft the incident note from your facts', detail: 'Give it the timeline, never the key; a person edits and approves the note.' },
            { id: 'paste-key', lane: 'ai', label: 'Paste the leaked key into an assistant to ask what it can do', detail: 'The key is now sent to another service as well.' },
            { id: 'delete-commit', lane: 'tool', label: 'Delete the file in a new commit and move on', detail: 'The old versions of the file stay in history.' },
            { id: 'wait', lane: 'human', label: 'Wait a week to see if anything happens', detail: 'Do nothing until there is proof of misuse.' },
            { id: 'note', lane: 'output', label: 'Publish the incident note and update the leak plan', detail: 'Share what happened, what changed and what was learned.' },
          ],
          rules: [
            { id: 'rotate', kind: 'require', parts: ['new-key', 'deploy', 'revoke'], message: 'A leaked key is treated as known: a new one must be in place and the old one revoked.' },
            { id: 'review-logs', kind: 'require', parts: ['logs'], message: 'Someone must read the logs to see whether the key was used by anyone else.' },
            { id: 'no-paste', kind: 'forbid', parts: ['paste-key'], message: 'Never paste a live secret into another service: that spreads the exposure.' },
            { id: 'no-delete-only', kind: 'forbid', parts: ['delete-commit', 'wait'], message: 'Deleting the file or waiting does not undo the exposure; history keeps the key and others may already have it.' },
            { id: 'order-new', kind: 'before', parts: ['new-key', 'deploy'], message: 'Create the new key before deploying with it.' },
            { id: 'order-revoke', kind: 'before', parts: ['deploy', 'revoke'], message: 'Deploy the new key before revoking the old one, or payments fail in between.' },
          ],
          solution: ['alert', 'new-key', 'deploy', 'revoke', 'logs', 'draft-note', 'note'],
          minSteps: 5,
          maxSteps: 8,
          simulation: {
            input: 'The scanner reports the e-wallet key in a commit from yesterday.',
            steps: {
              alert: 'The alert names the file, the commit and the people with repository access.',
              'new-key': 'A replacement key is created in the secret manager.',
              deploy: 'The API is released and reads the new key; a test payment succeeds.',
              revoke: 'The old key is revoked at the provider and stops working.',
              logs: 'A developer reads the provider logs and finds no requests the team did not make.',
              'draft-note': 'An assistant drafts a note from the timeline; no key is shared; a person edits it.',
              note: 'The note is published and the leak plan is updated with the order of steps.',
            },
            output: 'The key is replaced without a payment outage, misuse was checked for, and the leak plan is clearer for next time.',
          },
          hints: [
            'Treat the key as known to others: what do you do to a lock when the key is missing?',
            'Order matters between the new key, the deploy and the revoke. Which one must come last to avoid an outage?',
            'Two steps look fast but do not remove the exposure: one deletes history, one waits.',
          ],
          explanation: 'A leaked secret is rotated: new in place first, deployed, then the old one revoked. A person reviews the logs. A draft by an assistant is fine if it never receives the key. Deleting the file or waiting leaves the exposure in place.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-33-scenario-1',
          kind: 'scenario',
          title: 'Choosing a rate limit',
          prompt: 'Choose the best way to set the limits.',
          concept: 'API rate limiting',
          situation: 'A rate limit of "100 requests a minute per IP address" is proposed for TindaTrack. In real use, a store with five staff shares one internet connection and one address. Staff often open the sales screen all at the same moment when the store opens. Sign-in attempts and report exports are the endpoints you worry about most.',
          options: [
            { text: 'Count requests per signed-in identity and per store, put stricter limits on sign-in and report exports, and choose each number from measured normal use plus some room.', consequence: 'Normal staff are never blocked, repeated sign-in attempts are slowed, and an expensive export cannot be called in a loop. The numbers are reviewed after a month of real traffic.', quality: 'best' },
            { text: 'Use the proposed per-address limit for every endpoint and raise it if stores complain.', consequence: 'At opening time one store trips the limit as a whole, and support gets complaints. The limit also does nothing about one account trying many passwords from different addresses.', quality: 'poor' },
            { text: 'Skip rate limiting until abuse is seen.', consequence: 'The first sign of abuse is a slow system for every store, and the fix is rushed.', quality: 'poor' },
            { text: 'Limit sign-in attempts per account and per address, and leave other endpoints for later.', consequence: 'That covers the worst risk quickly. The expensive export is still open to a loop, so it needs its own limit soon.', quality: 'acceptable' },
          ],
          hints: [
            'Who really is "one caller" when a store shares a connection?',
            'Which endpoints need their own, stricter limits?',
            'Numbers should come from how people really use the system.',
          ],
          explanation: 'Limits should follow identities and tenants, differ by how risky or costly an endpoint is, and use numbers measured from real use. A single per-address number punishes shared connections and misses password guessing from many addresses.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-33-match-1',
          kind: 'match',
          title: 'What does each protection actually stop?',
          prompt: 'Match each situation to the protection that helps.',
          concept: 'encryption and access control',
          labels: { terms: 'Situation', meanings: 'What helps most' },
          pairs: [
            { term: 'A database backup file is emailed to the wrong person by mistake.', definition: 'Encryption at rest, with the key kept elsewhere', note: 'This protects a copy of the data that leaves your system.' },
            { term: 'Someone on a shared café network watches traffic between a phone and the API.', definition: 'Encryption in transit (TLS)', note: 'This protects data while it moves between two parts.' },
            { term: 'A cashier tries an owner-only export through the API.', definition: 'A server-side authorization check', note: 'Encryption does not help here: the application can read the data for any caller it lets through.' },
            { term: 'A script tries thousands of sign-in attempts on one account.', definition: 'Rate limiting and slow password hashing', note: 'This slows guessing; neither TLS nor encryption at rest changes how many guesses are allowed.' },
          ],
          hints: [
            'Ask where the threat is: on the wire, in a stored copy, inside the running app, or at the sign-in door.',
            'Encryption at rest protects copies; it does not stop the running application from answering a caller.',
            'Guessing is a volume problem, so look for a limit.',
          ],
          explanation: 'Each protection sits in one place: on the wire, in storage, in the access check, or at the sign-in door. Naming where a threat acts tells you which control addresses it.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-33-q1',
        prompt: 'Your database disk is encrypted at rest. Which threat does that mainly protect against?',
        choices: [
          'A stolen disk, a leaked snapshot or a backup file that falls into the wrong hands',
          'A signed-in cashier calling an endpoint that they are not allowed to use',
          'An attacker who gains access to the running application server and queries the database through it',
          'A developer who commits the database password to a shared repository',
        ],
        answer: 0,
        explanation: 'Encryption at rest protects stored copies. The running application can read the data for any caller it lets through, and a leaked password gives the holder a normal connection, so neither of those is addressed.',
      },
      {
        id: 'software-architecture-ai-33-q2',
        prompt: 'A team stores the encryption key for the customer table in the same settings file as the database address, "so that the app starts easily". What is the problem?',
        choices: [
          'Settings files cannot hold long values, so the key may be cut off',
          'Encryption keys must be changed every day, and a file makes that impossible',
          'Anyone who gets the settings file or a server copy has both the data and its key, so the encryption adds almost no protection',
          'The key will slow the database, because every query must read the settings file first',
        ],
        answer: 2,
        explanation: 'Keys must live apart from the data they protect. If a single copy of the server or file yields both, the lock and its key travel together.',
      },
      {
        id: 'software-architecture-ai-33-q3',
        prompt: 'An assistant suggests "100 requests per minute per IP address, the industry standard" as the only limit. Which response is best?',
        choices: [
          'Accept it, because a number given with confidence is usually based on experience',
          'Check how your users really connect, limit by identity and tenant, make sign-in and expensive endpoints stricter, and take the numbers from your own measurements',
          'Raise the number to 10,000 so that nobody is ever blocked and the problem disappears',
          'Remove the limit and rely on the cloud provider to absorb any abusive traffic',
        ],
        answer: 1,
        explanation: 'A figure with no source is a guess, and per-address limits misfire when many people share a connection. Limits should follow identities and be tuned from measurements.',
      },
      {
        id: 'software-architecture-ai-33-q4',
        prompt: 'How should the system store users\' passwords if it has to store them at all?',
        choices: [
          'Encrypt them with a strong key so that support can read them back to a user who forgot',
          'Store them in plain text but restrict who can open the table',
          'Hash them with a fast function so that sign-in stays quick',
          'Hash them with a slow, salted algorithm from a maintained library, or avoid storing them by using an identity provider',
        ],
        answer: 3,
        explanation: 'Nobody should be able to read a password back. A slow, salted hash makes guessing expensive. A fast hash makes guessing cheap, and encryption can be reversed by anyone holding the key.',
      },
      {
        id: 'software-architecture-ai-33-q5',
        audience: { max: 'beginner' },
        prompt: 'Why is a key taped to its own lock a poor design?',
        choices: [
          'Because the lock gets heavy and slow to use, and people will stop locking the door altogether in a busy shop',
          'Because keys should always be made of metal, not paper',
          'Because anyone who reaches the lock also has the key, so the lock gives no protection',
        ],
        answer: 2,
        explanation: 'Keys and data must be kept apart. If they travel together, the encryption does not protect against whoever gets one copy.',
      },
      {
        id: 'software-architecture-ai-33-q6',
        audience: { min: 'advanced' },
        prompt: 'Twelve services share one long-lived API key for the payment provider. A leak is suspected. Which design change reduces the damage of the next leak most?',
        choices: [
          'A separate, least-privilege credential for each service, issued short-lived or rotated automatically, so that a leak has a small and time-limited reach',
          'Keep the one key but print it in the team wiki in a protected page so that access can be audited and the team always knows where to find it when a service needs it',
          'Add a rule that developers must never copy the key, enforced by a reminder at each release',
          'Rotate the single key once a year at a quiet time, so that the process is well planned',
        ],
        answer: 0,
        explanation: 'A smaller blast radius and shorter life limit the damage of any leak. A shared key with a calendar reminder still fails everywhere at once.',
      },
    ],
    task: {
      title: 'Make a secrets table for your system',
      steps: [
        'List every secret your system uses: database password, provider keys, signing keys, webhook secrets, email or text-message keys.',
        'For each one, write: what it opens, where it is stored today, who can read it, and how you would replace it.',
        'Mark every row where the secret sits in code, in the repository or beside the data it protects. Write the fix for the first one.',
        'Write your leak plan in five lines: who decides, the order of rotation, which logs to read, who is told.',
      ],
      minutes: 18,
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Write what each secret can reach if it leaks (the blast radius) and rank the secrets by it. For the top two, design a narrower credential or a shorter lifetime and say what it costs to operate.'] },
      { audience: { max: 'beginner' }, steps: ['Start with just three secrets and answer only two questions for each: where is it stored, and who can read it.'] },
    ],
  },
  {
    id: 'software-architecture-ai-34',
    day: 34,
    title: 'Tenant Isolation and Architecture Security Reviews',
    summary: 'Keep each customer\'s data and workload apart at three layers, then review a design with a checklist, evidence and honest severity.',
    intro: {
      objectives: [
        'Describe tenant isolation at the data, application and infrastructure layers and how each is tested',
        'Explain the limits of database row-level security and why a cross-tenant test matters most',
        'Run an architecture security review with a checklist, evidence and a severity for each finding',
        'State what an AI assistant can and cannot check in a security review',
      ],
      why: 'In a multi-customer system, one missing filter can show a customer someone else\'s data. A structured review catches that kind of gap before launch, and it gives you evidence instead of reassurance.',
    },
    minutes: 28,
    skills: ['arch-security'],
    body: [
      { type: 'paragraph', text: `A **tenant** is one customer of a shared system: one store in TindaTrack, one clinic in a booking system. **Tenant isolation** means that one tenant cannot see another's data, cannot change it, and is not harmed by the other's heavy use. You chose a tenant model earlier in the course (a shared schema with a tenant id, a schema per tenant, or a database per tenant). A model is only a starting point. Isolation is something you build at several layers and then prove by testing. This lesson covers those layers, and then the review process that checks a whole design, including the way to use AI in that review without being misled by it.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack lets owners export their sales as a file. The export screen links to a file by a number in the address. The server looked up the file by that number and returned it. It checked that the caller was signed in, but it never checked that the file belonged to the caller's store. An owner noticed that a smaller number worked as well as her own, and opened a file that was not hers. She reported it honestly, and the team was grateful.` },
      { type: 'paragraph', text: `The fix itself was a few lines. The cost was in the aftermath: two stores had to be told that a competitor-owner's data could have been seen, the team spent a week auditing every endpoint that took an id, and one owner left. The root cause was a design gap: nobody had decided that the tenant must be part of every lookup, and nobody had written a test that tries to read another tenant's data.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Think of **three layers**, and expect a failure in any one of them. At the **data layer**, every row that belongs to a tenant carries the tenant id, foreign keys and unique constraints include it, and queries always filter by it. A stronger design makes the database itself enforce it with **row-level security**: policies that filter rows by a value the application sets for each request. A schema or a database per tenant isolates more strongly, at the price of more things to migrate, back up and operate. At the **application layer**, the tenant comes from the verified session (the previous lessons), is set once at the edge of the request, and travels down. A single data-access layer takes the tenant as a required argument, so a query without one cannot be written by accident. Caches, file paths, search indexes and background jobs are tenant-scoped too. At the **infrastructure layer**, you control the **noisy neighbour** problem, where one tenant's heavy use slows everyone: per-tenant rate limits and quotas, fair queues, and limits on expensive operations. You may also use separate keys per tenant for the strictest customers, and you keep production customer data out of development and test environments.` },
      { type: 'diagram', format: 'mermaid', source: `flowchart LR
  Req[Request] --> Edge{Verified session?}
  Edge -->|No| Deny[Refuse]
  Edge -->|Yes: tenant from the session| Svc[Application service]
  Svc -->|Tenant is a required argument| Repo[Data access layer]
  Repo -->|Query filtered by tenant| Rls[Row-level policy]
  Rls --> Db[(Shared database)]
  Svc -.->|Per-tenant limits| Quota[Quota and rate limit]`, caption: `Three checks before data leaves the database. Look at where the tenant first appears: it comes from the verified session, not from the request. The row-level policy is a backstop if the application layer is wrong.` },
      { type: 'code', language: 'sql', label: 'Illustrative row-level security policy for a shared-schema table', code: `-- The application sets app.store_id for each request, inside its transaction.
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY sales_by_store ON sales
  USING (store_id = current_setting('app.store_id')::uuid);

-- The application connects as a role that does NOT own the table
-- and does NOT have the BYPASSRLS attribute.` },
      { type: 'version', text: `PostgreSQL 18's documentation describes row security policies: after ALTER TABLE ... ENABLE ROW LEVEL SECURITY, normal access must be allowed by a policy (with no policy, no rows are visible), and a policy's USING expression decides which rows can be processed. Superusers, roles with BYPASSRLS and, unless FORCE ROW LEVEL SECURITY is set, the table owner are not subject to the policies. Other databases offer different or no equivalent: check the documentation of the one you use.`, checked: CHECKED, sources: [POSTGRES_RLS] },
      { type: 'table', headers: ['Layer', 'What to enforce', 'How to test it'], rows: [
        ['Data', 'Tenant id on every tenant-owned row, in keys and constraints; policies as a backstop', 'Insert rows for two tenants; confirm each tenant\'s role sees only its own'],
        ['Application', 'Tenant from the session, required by the data-access layer, in caches, files, jobs and search', 'Sign in as tenant A and request tenant B\'s record by id: expect a refusal, never data'],
        ['Infrastructure', 'Per-tenant limits and fair queues, separate keys where needed, no production data in test', 'Run one tenant at high volume and measure the others\' response times'],
      ], caption: 'The cross-tenant test in the middle row is the most valuable single test in a multi-tenant system. Run it for every endpoint that takes an id.' },
      { type: 'paragraph', text: `**An architecture security review** checks the design as a whole, ideally before launch and again when something significant changes. The reviewer is someone who did not draw the design, with the design documents, the data-flow diagram, and access to evidence. The key word is **evidence**: "tenant isolation is handled" is a claim, and a passing cross-tenant test is evidence. For each item below, ask for the claim, then ask for what proves it.` },
      { type: 'table', headers: ['Review item', 'Question', 'Evidence to ask for'], rows: [
        ['Assets and data', 'What data do we hold and how sensitive is it?', 'A data inventory with where each item is stored'],
        ['Boundaries', 'Does the data-flow diagram match what is deployed?', 'A dated diagram with trust boundaries'],
        ['Authentication', 'Who verifies identity, and how is access ended?', 'The design note and a test of removing a user'],
        ['Authorization and tenancy', 'Is access denied by default and the tenant taken from the session?', 'Cross-tenant test results for each endpoint with an id'],
        ['Data protection', 'What is encrypted in transit and at rest, and who holds the keys?', 'A key table and the settings of the data store'],
        ['Secrets', 'Where is each secret and how is it rotated?', 'The secrets table and the result of a secret scan'],
        ['API surface', 'Are inputs validated and requests limited?', 'The contract, limits configuration and a sample error'],
        ['Logging', 'Are security events logged without secrets?', 'Sample log lines and the alerts that use them'],
        ['Recovery', 'Can we restore, and have we practised?', 'The date and result of the last restore test'],
      ], caption: 'A review checklist. A row without evidence is a finding, not a pass.' },
      { type: 'paragraph', text: `Write each finding in the same shape: **what is wrong, the evidence, the severity, the fix and the owner**. A simple severity scale is enough. **Critical:** one step from exposing customer data or taking over the system, fix now. **High:** serious, with a plausible path, fix before launch. **Medium:** harmful but needs several conditions or limited reach, schedule it. **Low:** small or well contained, fix when convenient. Rate on two questions: how bad is the result, and how easy is it to reach? Keep the scale to words and reasons, and avoid fake precision.` },
      { type: 'paragraph', text: `**What AI can and cannot do here.** An assistant can read a design document and list the checklist items it does not cover, notice patterns such as "the client sends the tenant id", draft questions for the team, and turn findings into a tidy report. It cannot see your running system, cannot confirm what is actually configured, and cannot know what the document does not say. It may state a pass with confidence it has not earned, or invent a finding. So use it to widen your questions, not to give a verdict. Never paste real secrets or customer data into an assistant; describe the design in words instead. And for a system that holds payments or health data, the review needs a security professional, not only the team and a chat assistant.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: think of an apartment building. Every flat has its own lock, so one key opens one door. That is isolation at the door. But if the building also has a master list at the front desk, the desk must check which flat you belong to before it hands out anything. And if one family runs loud machines all day, the neighbours need rules about noise. A security review is a walk through the building with a checklist, asking for proof at each door instead of taking the owner's word that "it is all locked".` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a bigger or older system, isolation tends to have exceptions: a support tool that reads across tenants, a reporting job that joins everything, a migration script run with elevated rights. List every path that crosses tenants on purpose, give each an owner and an audit trail, and review that list every time. Isolation tiers are a commercial decision as well as a technical one: a customer with strict needs may justify a separate database or key, but each tier multiplies the migrations, backups and monitoring you must run, so offer a small number of tiers. Make the cross-tenant test part of the pipeline for every endpoint with an id, and treat a new one without it as an incomplete change. A review run only before launch decays; tie it to design changes.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'An AI-drafted review of a design note', prompt: `Review this design note for security. TindaTrack stores all stores' data in one PostgreSQL database. Every table has a store_id column. Exports are available at /exports/{id}. Staff sign in with email and password. Passwords are protected. Logs are kept. Give a pass or fail for tenant isolation, authentication and logging, with severity.`, output: `Security review\n\nTenant isolation: PASS. Every table has a store_id column, so data is separated by tenant.\nAuthentication: PASS. Passwords are protected.\nLogging: PASS. Logs are kept.\n\nIssues found:\n- Exports use numeric ids (Severity: Critical, CVSS 9.8).\n\nRecommendation: add multi-region replication and a bug bounty program.`, notice: `A column is not isolation. The review passes "tenant isolation" because store_id exists, but the note never says that queries filter by it, or that the export lookup does. Ask for evidence: where is the cross-tenant test? "Passwords are protected" and "Logs are kept" are claims copied back from the note. The severity score looks precise and has no basis in what was supplied. The closing recommendation does not follow from any finding. The one real finding, the export lookup by id, is correct but buried: it should be the headline, with the fix (check the tenant on the server) and the test that proves it.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Before asking an assistant, write your own short review of your design: for each row of the checklist, what is your claim and what is your evidence? Mark each row as evidenced, claimed only, or unknown. Then use the assistant to challenge the "claimed only" rows.` },
      { type: 'prompt', label: 'Evidence-first review', text: `Act as a security reviewer for [system]. Below is my design summary and my own review table (claim and evidence for each of: assets, boundaries, authentication, authorization and tenancy, data protection, secrets, API surface, logging, recovery).\n\n[paste your summary and table; no real secrets or customer data]\n\nInstructions:\n1. For each row, say whether my evidence actually supports my claim. If not, say what evidence would.\n2. List what the design summary does not mention at all, as questions, not as findings.\n3. Never mark a row "pass". Use: supported, claimed only, or unknown.\n4. For any finding, give what is wrong, the evidence in my text, a severity in words (Critical, High, Medium, Low) with the reason, and the cheapest fix.\n5. State your assumptions and what you cannot know without seeing the running system.` },
      { type: 'paragraph', text: `Verify: is every finding tied to a sentence in your own text? Did the assistant ever declare something secure? Reject that wording. Run the cross-tenant test yourself; no assistant can do that for you.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write one cross-tenant test for the endpoint that takes an id, and run it. If it fails, you have your first finding.',
        'Fill in the review table above for your own system, marking each row as evidenced, claimed only, or unknown.',
        'Project 2 (Scale an Existing Application) is now open: its security review uses the checklist and the severity scale from this lesson.',
        'Read the PostgreSQL documentation on row security policies, and the OWASP Application Security Verification Standard as a longer checklist.',
      ] },
      { type: 'takeaways', items: [
        'Isolation is built at three layers (data, application, infrastructure) and proven by tests, not by the choice of a tenant model alone.',
        'The tenant comes from the verified session and is a required argument of the data-access layer; row-level policies are a backstop, and they do not apply to roles that own the table or bypass them.',
        'The cross-tenant test (sign in as A, ask for B\'s record, expect a refusal) is the most valuable single test.',
        'A security review asks for evidence for each claim, and writes findings as what, evidence, severity, fix and owner.',
        'AI can widen your questions and tidy a report, but it cannot see your running system or declare it secure; high-risk systems need a security professional.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-34-prompt-lab-1',
          kind: 'prompt-lab',
          labId: 'arch-09-security-review',
          title: 'Lab: review a design note for the clinic booking system',
          prompt: 'Write a prompt that asks the model to review the design note using only the note, sort each item into supported, claimed only or unknown, and list the questions the note does not answer. Compare what it finds with what you found.',
          concept: 'evidence-based security review',
          hints: [
            'Say that the note is the only evidence and that the model must quote the sentence behind each finding.',
            'Ask for fixed labels (supported, claimed only, unknown) and forbid the word "pass".',
            'The note has gaps on purpose. Ask for the questions it leaves unanswered instead of guesses.',
          ],
          explanation: 'A strong review prompt keeps the model to the supplied text, asks for evidence for every claim, and separates what is shown from what is only said. Check each quoted sentence in the note yourself: the review is a guide, and another run may differ.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-34-scenario-1',
          kind: 'scenario',
          title: 'Rating and ordering the findings',
          prompt: 'Choose the best plan.',
          concept: 'findings and severity',
          situation: 'Your review of a design before launch finds three things. One: an export is fetched by id and the server never checks the caller\'s tenant. Two: the log lines of failed payments include part of the provider key. Three: the admin screen has no rate limit on sign-in attempts. The team has two days before launch.',
          options: [
            { text: 'Rate the export as Critical and the key in logs as High and fix both first, rate the missing limit as Medium and schedule it, and write for each the evidence, the fix and an owner.', consequence: 'Launch goes ahead after the two fixes with a cross-tenant test in place. The limit is fixed the following week and tracked.', quality: 'best' },
            { text: 'Rate all three Critical so that nobody argues about the order.', consequence: 'The team cannot tell what to do first, so it spends one day on the sign-in limit while the export hole remains. The scale stops meaning anything.', quality: 'poor' },
            { text: 'Fix whichever is easiest first, the sign-in limit, then see how much time is left.', consequence: 'The easy fix is done by lunch, and the team runs out of time before the export is fixed. Launch is delayed anyway.', quality: 'poor' },
            { text: 'Fix the export and the key in logs, and do not write down the sign-in finding because it is not blocking.', consequence: 'Launch is safe from the two worst problems, but the third is forgotten and nobody owns it. It is found again by a customer.', quality: 'acceptable' },
          ],
          hints: [
            'Rate on two questions: how bad is the result, and how easy is it to reach?',
            'Treat a finding like a small ticket: evidence, fix, owner.',
            'A scale where everything is Critical does not help anyone choose.',
          ],
          explanation: 'Severity exists to order the work. The export exposes other customers\' data and is easy to reach, so it comes first. Recording every finding with evidence, a fix and an owner keeps the lower ones from disappearing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-34-match-1',
          kind: 'match',
          title: 'Which layer needs the test?',
          prompt: 'Match each concern to the isolation layer where it belongs.',
          concept: 'tenant isolation layers',
          labels: { terms: 'Concern', meanings: 'Layer' },
          pairs: [
            { term: 'One store runs a huge export every minute and other stores see slow screens.', definition: 'Infrastructure: per-tenant limits and fair queues', note: 'The data is not leaking here. The problem is shared capacity.' },
            { term: 'A background job rebuilds a search index and mixes the stores\' rows in one list.', definition: 'Application: tenant scoping of jobs, caches and indexes', note: 'The job runs in application code and needs the tenant passed down to it.' },
            { term: 'Two stores have a product with the same code, and the unique constraint rejects the second.', definition: 'Data: tenant id inside keys and constraints', note: 'The constraint should include the tenant id so two tenants can use the same code.' },
            { term: 'A developer forgets the tenant filter in one new query.', definition: 'Data: a row-level policy as a backstop to the application', note: 'The policy filters rows even when the application forgets, as long as the role is subject to it.' },
          ],
          hints: [
            'Ask whether the problem is about shared capacity, application code, or what the database stores and filters.',
            'A constraint and a policy both live in the database.',
            'Jobs, caches and indexes are application code that needs the tenant passed in.',
          ],
          explanation: 'Isolation spans three layers. Capacity problems are infrastructure, scoping of jobs and caches is the application, and keys, constraints and policies are the data layer. Each needs its own test.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-34-q1',
        prompt: 'An export is fetched by a number in the address, and the server checks only that the caller is signed in. What is the best fix and proof?',
        choices: [
          'Make the numbers longer and random, so that nobody can guess another store\'s export',
          'Hide the export link from the screens of stores other than the owner',
          'Ask users not to share their links, and log each download for later review so that a leak can be traced to the person who shared it, then tell every store owner in the next newsletter to keep their links private',
          'Check on the server that the export belongs to the tenant in the caller\'s session, and add a test that requests another tenant\'s export and expects a refusal',
        ],
        answer: 3,
        explanation: 'The gap is a missing ownership check. Unguessable ids reduce the chance of finding one but do not remove the gap, and hiding links or asking users to behave is not a control. A server-side check with a cross-tenant test fixes and proves it.',
      },
      {
        id: 'software-architecture-ai-34-q2',
        prompt: 'A team adds row-level security policies, but a test shows one tenant can still read all rows. Which cause fits the PostgreSQL documentation you read in this lesson?',
        choices: [
          'Policies only apply to rows inserted after the policy was created',
          'The application connects as the table owner or a role that bypasses row security, so the policies are not applied',
          'Row-level security works only when the tenant id is stored as text',
          'The database can enforce only one policy per table, so a second tenant is excluded from every query on that table by default',
        ],
        answer: 1,
        explanation: 'Superusers, roles with BYPASSRLS and (unless forced) the table owner are not subject to the policies. The application should connect as an ordinary role, which a cross-tenant test would confirm.',
      },
      {
        id: 'software-architecture-ai-34-q3',
        prompt: 'A design note says, "Tenant isolation is handled in the data layer." As the reviewer, which is the best next request?',
        choices: [
          'Ask the author to rewrite the sentence with more detail about the intended approach',
          'Mark the row as passed, since the author is the person who knows the system best',
          'Ask for the evidence: a test in which one tenant requests another tenant\'s record by id and is refused',
          'Ask for a larger budget so that each tenant can have its own database',
        ],
        answer: 2,
        explanation: 'A claim is not proof. A cross-tenant test that fails safely shows that the control works. More detail in prose is still only a claim, and a separate database per tenant answers a different question.',
      },
      {
        id: 'software-architecture-ai-34-q4',
        prompt: 'An assistant\'s review marks "tenant isolation: PASS" because every table has a tenant column. What should you do?',
        choices: [
          'Treat it as a draft: a column is not enforcement, so ask what filters on it and where the test is, and verify against the running system yourself',
          'Accept it and move on, because assistants are trained on many security reviews and rarely get this particular kind of question wrong, even when the text is short',
          'Paste the production schema and a sample of customer rows into the assistant so that it can check more carefully',
          'Ask the assistant to give the same answer again, and accept it if the second answer matches the first',
        ],
        answer: 0,
        explanation: 'A tenant column does not prove that queries use it. The assistant has only the text and cannot see the running system, and repeated agreement is not evidence. Never paste customer data into an assistant to get a better answer.',
      },
      {
        id: 'software-architecture-ai-34-q5',
        audience: { max: 'beginner' },
        prompt: 'In the apartment example, what is the front desk\'s job?',
        choices: [
          'To check which flat you belong to before it gives out anything',
          'To make the building taller so more flats fit and the rent can be raised',
          'To lock every door at the same time each evening',
        ],
        answer: 0,
        explanation: 'The desk is the shared point where the tenant must be checked. In software, this is the data-access layer or policy that takes the tenant from the session.',
      },
      {
        id: 'software-architecture-ai-34-q6',
        audience: { min: 'advanced' },
        prompt: 'In a shared database, one tenant\'s nightly import slows every other tenant for an hour. Which response addresses the cause?',
        choices: [
          'Move that tenant to a different time zone so the import runs when others are asleep',
          'Add row-level security policies, because slow queries come from reading other tenants\' rows',
          'Add per-tenant quotas and a fair queue for heavy jobs, and measure the other tenants\' response time while the import runs',
          'Give every tenant its own database right away, even though only one tenant\'s import is heavy and the others have never caused a problem',
        ],
        answer: 2,
        explanation: 'This is a noisy-neighbour problem at the infrastructure layer: the data is not leaking, the capacity is shared. Limits and fair scheduling, checked by measurement, address it. A database per tenant is a costly answer to a problem one tenant causes.',
      },
    ],
    task: {
      title: 'Run a mini security review of your own design',
      steps: [
        'Copy the nine-row review table from this lesson and fill the claim and the evidence column for your system. Mark each row evidenced, claimed only, or unknown.',
        'Pick one endpoint that takes an id and write the cross-tenant test as a short list of steps (sign in as A, request B\'s record, expected result).',
        'Write your top three findings in the shape what, evidence, severity (a word and a reason), fix, owner.',
        'Run the "Evidence-first review" prompt with your table (no real secrets or customer data) and note one thing it found that you missed and one claim you would reject.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['List every path in your system that crosses tenants on purpose (support tools, reports, migrations). For each, name the owner, the audit trail and the approval needed, and mark the one you would remove first.'] },
      { audience: { max: 'beginner' }, steps: ['Review only three rows (authorization and tenancy, secrets, recovery) and write for each one sentence of claim and one sentence of evidence.'] },
    ],
  },
];

const CASE_FILE = `ShopLine is a fictional online shop that sells school and office supplies to about 3,000 repeat customers in one country. Three developers keep it running. Everything below is invented for this exercise.

HOW IT IS BUILT. One virtual server runs the whole application: the shop pages, the checkout, the staff admin panel and a nightly report job. A PostgreSQL database runs on a second server in the same data centre. Nothing is cached: every page view reads the product list from the database again. Product photos are stored on the application server's own disk. Each request keeps its database connection open until the request ends.

WHAT IT DOES. A customer browses products, fills a basket and checks out. On "Place order" the application saves the order, charges the card through a payment provider, and then sends the confirmation email inside the same request, waiting for the email server to accept it before the customer sees a result. If anything fails after the card was charged, the customer sees an error and the order may stay half-saved. The customer's order history page loads each order and then loads the items of each order in a separate query.

HOW STAFF AND ACCESS WORK. Six staff members use the admin panel, which lives under the same address as the shop (/admin). All six sign in with one shared admin password. It is kept in the team's group chat and also appears in a settings file in the code repository. The database accepts connections from any address if the password is right, because a developer once needed to work from home. Customer passwords are stored with a fast hash function. There is no limit on sign-in attempts. Staff actions are not logged with a name, so nobody can say who changed a price. Database backups run every night. Nobody has ever tried to restore one.

THE BUSINESS. Twice a month ShopLine runs an evening sale that brings several times the usual traffic for a few hours. During the last two sales, pages became slow, some customers saw errors at checkout, and a few were charged but saw no confirmation, so they ordered again. The owner wants the sale in six weeks to run smoothly, and wants to know what is risky about the system. The budget is small, there is no operations team, and the owner will not accept more than a short evening window of downtime. The team knows the current stack well and has no experience with container clusters or message brokers.

WHAT THE TEAM MEASURED. The table in the next step comes from the last sale evening and from a normal evening a week earlier. Some numbers point to real bottlenecks. Others are there to mislead you if you act before reading them: for example, one part of the system looks quiet while another struggles.

YOUR JOB. Assess the system, find the bottlenecks that the measurements support, review its security, and propose a plan that tries the cheapest sufficient change first and keeps the shop running at every step.`;

const MEASUREMENTS = `Measurements for ShopLine. ALL NUMBERS ARE INVENTED FOR THIS EXERCISE and are not a benchmark. One evening a week before the sale, and the sale evening, same system.

Measurement | Normal evening | Sale evening
Requests per minute, all pages | 120 | 700
Share of requests that only read data (browse, search) | 85% | 90%
Application server CPU, average over the busy hour | 25% | 93%
Application server memory in use | 55% | 62%
Database server CPU | 20% | 38%
Database connections in use (the limit is 100) | 18 | 96
Product list page, average time | 0.4 s | 2.9 s
Checkout "Place order", average time | 1.1 s | 6.8 s
Time spent inside the confirmation email call, per order | 1.6 s | 3.4 s
Database queries per product list view | 3 | 3
Database queries to show one order-history page for a customer with 40 orders | 41 | 41
Slowest single query (orders by customer email; the column has no index) | 150 ms | 1,300 ms
Checkout attempts that failed with a timeout | 0.5% | 7%
Orders where the card was charged but no confirmation was shown | 0 | 14
Disk used on the application server by product photos | 70% | 70%
Last time a database backup was restored as a test | never | never
Team's estimate of the time to rebuild if the application server were lost | unknown | unknown

Read the table before you decide anything. Ask of each row: does it support a claim, contradict one, or tell you nothing?`;

export const project: Project | null = {
  id: 'software-architecture-ai-p2',
  title: 'Scale an Existing Application',
  summary: 'Assess a described legacy application (ShopLine), find its real bottlenecks from the measurements, review its security, and propose a cheapest-first, safe-order plan with a diagram, a decision record and a comparison of two options.',
  outcome: 'A written architecture assessment and improvement plan that ties every claim to evidence, ranks changes by cost and risk and keeps the system running during the rollout: the kind of document a team lead or client asks for before touching a live system.',
  unlockAfterDay: 34,
  steps: [
    {
      id: 'software-architecture-ai-p2-s1',
      text: `Case file: ShopLine. Read this description twice before you do anything else. It is your system for this project.\n\n${CASE_FILE}`,
    },
    {
      id: 'software-architecture-ai-p2-s2',
      text: `Measurements (invented for this exercise).\n\n${MEASUREMENTS}`,
    },
    {
      id: 'software-architecture-ai-p2-s3',
      text: `Objectives. By the end you will have: (1) an initial architecture assessment of ShopLine; (2) the bottlenecks that the measurements support, each with the row of the table behind it; (3) a performance analysis that explains why the system slows on sale evenings; (4) scalability recommendations ranked by cost and risk, cheapest sufficient change first; (5) a security review with a severity, a fix and an order for each finding; (6) a proposed architecture as a diagram; (7) a cost and trade-off comparison of at least two options, in relative terms (low, medium, high) and never in prices; (8) a rollout order that keeps the shop running. You also record what AI suggested, what you checked, and what you changed.`,
    },
    {
      id: 'software-architecture-ai-p2-s4',
      text: `Tools and resources. Use the \`arch-diagram-workbench\` to draw the current system and your proposed one (save both versions), the \`arch-tradeoff-matrix\` to compare your options, the \`arch-adr-builder\` to write at least two decision records (save them), and the \`arch-assistant\` (Tali) to question your reasoning, never to write it for you. Lessons to draw on: Scaling Up and Out, and Load Balancing; Caching and Database Performance; Finding the Bottleneck: Measure Before You Redesign; High Availability, Fault Tolerance, Observability and Disaster Recovery; Secure by Design and Threat Modeling; Authentication and Authorization; Encryption, Secrets Management and API Security; Tenant Isolation and Architecture Security Reviews (its checklist and severity scale); and the API and integration lessons on idempotency and queues. Keep the case file and the measurements open while you work.`,
    },
    {
      id: 'software-architecture-ai-p2-s5',
      text: `How to work, part 1: assess, find the bottlenecks, analyse performance. Draw ShopLine as it is now (a C4 container diagram with the workbench is enough) and write six to ten sentences of initial assessment: what it does well, what is fragile, and which requirement is missing (state the sale requirement as a measurable scenario, for example the checkout time and failure rate you will accept at sale volume). Then go through the measurements row by row. For each bottleneck you name, write the claim, the measurement behind it, and one measurement that would change your mind. Explain the pairs of rows that look contradictory, such as a busy application server beside a quiet database, and the 14 orders that were charged without a confirmation. Do not claim anything the table cannot support; if you need a number you do not have, say how you would measure it.`,
    },
    {
      id: 'software-architecture-ai-p2-s6',
      text: `How to work, part 2: recommend, secure, propose, compare, roll out. (a) List your scalability recommendations and rank them by cost and risk, with the cheapest sufficient change first; say what each costs in people, time and complexity, and what the simpler alternative was. Do not recommend microservices, a message broker, Kubernetes or a second database unless a measurement requires it, and if you do, say what it costs. (b) Review security with the checklist from Tenant Isolation and Architecture Security Reviews: every finding gets what is wrong, evidence from the case file, a severity word with the reason, a fix and an owner. (c) Draw the proposed architecture. (d) Compare at least two options in the \`arch-tradeoff-matrix\` and write what you rejected and why in an ADR (\`arch-adr-builder\`); use relative terms, never prices. (e) Give a rollout order of small steps that keeps the shop running, with a way to undo each one and the measurement that shows whether it worked, finishing before the sale in six weeks.`,
    },
    {
      id: 'software-architecture-ai-p2-s7',
      text: `Guided AI prompts. Write your own answer first, then paste it into your assistant (Claude, ChatGPT or Gemini, or Tali through \`arch-assistant\`) and ask it to critique, not to design. Fill in the brackets with your own details.\n\n1. Bottleneck critique: "Here are the measurements of a system [paste the table] and my analysis [paste your claims, each with its measurement]. For each claim, say whether the row I cite really supports it. List any row I ignored. Tell me which claim you think is weakest and what measurement would settle it. State your assumptions and what you cannot know."\n\n2. Security review: "Here is a description of the system [paste the case file; no real secrets] and my findings with severity, fix and owner [paste]. Which findings have no evidence in the text? What did I not ask about? Never mark anything as secure; use supported, claimed only, or unknown."\n\n3. Options comparison: "I am choosing between [option A] and [option B] for [the problem], with these requirements and constraints [list]. My scores and reasons are [paste]. Find the score that I cannot justify, give one cost of each option in people, time and complexity, and tell me what would make the other option the better choice. Do not pick a winner."\n\nIn your submission, say what each assistant told you that you accepted, rejected or changed, and what you checked yourself.`,
    },
    {
      id: 'software-architecture-ai-p2-s8',
      text: `Deliverables. Paste into the submission box, in this order: (1) your initial assessment and the measurable sale requirement; (2) a bottleneck table: claim, supporting measurement, what would change your mind; (3) your performance analysis; (4) the ranked recommendations, with cost and risk in relative terms; (5) the security findings with severity, fix and owner; (6) the text of your proposed-architecture diagram (the Mermaid or C4 text you saved in the \`arch-diagram-workbench\`); (7) the comparison of at least two options and the text of your ADRs (saved in the \`arch-adr-builder\`); (8) the rollout order with an undo and a measurement for each step; (9) a short log of AI use: what you asked, what you accepted, what you rejected, what you verified. The coach also receives the diagrams and ADRs you saved in the tools.`,
    },
    {
      id: 'software-architecture-ai-p2-s9',
      text: `Assessment criteria. A reviewer checks that: every claim about a bottleneck or a risk cites the measurement or sentence of the case file it rests on; recommendations are ranked by cost and risk with the cheapest sufficient change first; security findings carry a severity with a reason, a fix and an order; the diagram, the options comparison and the ADRs agree with each other; the rollout keeps the system running and can be undone step by step; and your own reasoning is visible, including what you changed after AI feedback.`,
    },
    {
      id: 'software-architecture-ai-p2-s10',
      text: `Common mistakes. Reaching for the database first because "databases are the bottleneck" when the table shows the application server saturated and the database half idle. Proposing microservices, a message broker or a container cluster to a team of three with no operations experience, when a cache, an index, a queued email and a few fixes would meet the requirement. Quoting numbers that are not in the table, or treating invented numbers as a benchmark. Calling a security risk "high" without saying why. Forgetting the 14 charged-but-unconfirmed orders, which are a correctness problem and not only a speed problem. A rollout that needs the shop offline for longer than the owner will accept. A diagram that shows components your text never mentions. Pasting AI output as your own work without saying what you checked.`,
    },
    {
      id: 'software-architecture-ai-p2-s11',
      audience: { max: 'beginner' },
      text: `For newcomers (smaller scope). Work on three things only: (1) pick the two bottlenecks you are most sure of and give the table row behind each; (2) pick the two security findings that scare you most, with a severity word and a one-line fix; (3) write a three-step rollout, cheapest first. Draw ShopLine as a flowchart with the workbench (five or six boxes) instead of a C4 diagram, and compare just two options in one short paragraph. You do not need the matrix or the second ADR; one ADR for your first recommendation is enough. Use Tali (\`arch-assistant\`) to ask "why?" about any step you are unsure of.`,
    },
    {
      id: 'software-architecture-ai-p2-s12',
      audience: { min: 'advanced' },
      text: `Professional extension. Add: (1) a rollout plan with feature flags or a staged traffic shift and the exact signal (one measurement and one threshold you choose, labelled as your own) that makes you roll back; (2) a capacity argument for the sale evening that states the assumptions you used, such as how many requests a single application server handled before CPU saturated, and how you would test that with a load test before the sale; (3) a failure drill for the confirmation email and the payment callback, showing how a retry cannot charge or order twice; (4) a second ADR that records a decision you deliberately postponed, with the measurement that would trigger it; (5) a one-paragraph risk register for the plan itself.`,
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your assessment and improvement plan for ShopLine',
    placeholder: 'Initial assessment and the sale requirement; bottleneck table (claim, measurement, what would change your mind); performance analysis; ranked recommendations; security findings with severity, fix, owner; diagram text; options comparison and ADR text; rollout order; AI-use log.',
    hint: 'A strong submission ties every claim to a row of the table, ranks changes cheapest first, gives each security finding a severity with a reason, includes your diagram and ADR text, and shows what you checked, rejected or changed after AI feedback.',
  },
  rubric: [
    'Every bottleneck and risk claim cites the measurement or case-file sentence it rests on, and claims the table cannot support are avoided or flagged as needing a measurement.',
    'Recommendations are ranked by cost and risk with the cheapest sufficient change first; costs are in relative terms (people, time, complexity), never prices, and a heavier option is used only when a measurement requires it.',
    'The security review gives each finding a severity with a reason, a fix and an owner, and covers access, secrets, data exposure, logging and recovery.',
    'The proposed architecture diagram, the options comparison and the ADRs agree with each other, and the ADRs record trade-offs and the rejected alternative, not only the choice.',
    'The rollout order keeps the shop running, can be undone step by step, and names the measurement that shows whether each step worked.',
    'The learner\'s own reasoning is visible: what AI suggested, what they verified, and what they rejected or changed.',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['Two bottlenecks and two security findings are explained clearly and tied to the case file; the three-step rollout starts with the cheapest change and says why.'] },
    { audience: { min: 'advanced' }, items: ['The plan includes a rollback signal with a stated threshold, a capacity argument with its assumptions and a load-test plan, and a failure drill showing that retries cannot double a charge or an order.', 'A deliberately postponed decision is recorded with the measurement that would trigger it.'] },
  ],
};
