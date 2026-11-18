import type { Lesson, Project } from '../../../types';

// Module 6: API Architecture and System Integration (lessons 20 to 23, days 20-23, no project). Written 2026-11-18.
// Everything invented: TindaTrack, its people, stores, providers and numbers are illustrations, never benchmarks, statistics or claims about real companies.
// Demos ("AI in Action") are hand-written illustrations with a planted flaw. Security content is design-level only; no secrets, no exploit steps.

const CHECKED = '2026-11-18';

const DOCS = {
  rfc9457: { label: 'RFC 9457: Problem Details for HTTP APIs', url: 'https://www.rfc-editor.org/rfc/rfc9457.html' },
} as const;

export const project: Project | null = null;

export const lessons: Lesson[] = [
  // ---------------------------------------------------------------- 20
  {
    id: 'software-architecture-ai-20',
    day: 20,
    title: 'REST, GraphQL and the API Contract',
    summary: 'Design an API as a written contract: choose REST or GraphQL by evidence, and settle errors, pagination and safe retries before the first client depends on them.',
    intro: {
      objectives: [
        'Compare REST and GraphQL by what each makes easy and what each costs a small team',
        'Write down the parts of an API contract that clients depend on: shapes, errors, pagination and idempotency',
        'Read an API description, including one drafted by AI, and find what it leaves unsaid',
      ],
      why: 'An API is the one part of your system that other people’s code depends on, including phone apps you cannot force to update. A vague contract becomes a permanent cost, so it is worth a short, careful design before anyone builds against it.',
    },
    minutes: 26,
    skills: ['arch-integration'],
    body: [
      { type: 'paragraph', text: 'An API (application programming interface) is how one piece of software asks another to do something. Inside a single program you can change a function and fix every caller in one commit. Across a network you cannot: the callers are other teams, other deployments and phone apps that stay installed for months. That is why an API is best treated as a **contract**: a written promise about what can be asked, what comes back and what happens when things go wrong.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Lito builds the TindaTrack phone app. An owner in a province with weak signal taps “Save sale”. The spinner turns for a long time, so she taps again. The app sends the same request twice, and the server saves two sales. Stock drops by double, and at closing time the cash drawer does not match the app. She recounts the day by hand.' },
      { type: 'paragraph', text: 'The same week, a store with two years of history opens its sales list. The endpoint returns every sale in one response, the phone waits, and the request times out. Neither failure was a bug in the code the developers wrote on purpose. Both were gaps in the contract: nothing said what a retry means, and nothing said how many rows a response may hold. Fixing it later meant changing an API that phones already in use depended on.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**REST** models an API as resources, the nouns of your system, reached with the standard HTTP verbs. A sale is a resource at a path such as /v1/sales, and the verb says what to do with it. HTTP already defines which verbs are safe to repeat, and that matters for weak connections:' },
      {
        type: 'table',
        headers: ['Verb', 'Typical use', 'Safe to repeat?'],
        rows: [
          ['GET', 'Read a resource or a list', 'Yes: it changes nothing'],
          ['PUT', 'Replace a resource with the one sent', 'Yes: sending it twice leaves the same result'],
          ['DELETE', 'Remove a resource', 'Yes: the second delete finds nothing to remove'],
          ['POST', 'Create something, or start an action', 'No: two requests can make two things, unless you add an idempotency key'],
        ],
        caption: 'A request is idempotent when repeating it has the same effect as sending it once. POST is the verb that needs your design help.',
      },
      { type: 'paragraph', text: '**GraphQL** gives clients one endpoint and a typed schema. The client asks for exactly the fields it wants, across related data, in one request. That helps when several clients (a web dashboard, a phone app, a wall display) need different shapes of the same data. It costs something: ordinary HTTP caching works less well, a client can ask for an expensive deeply nested query so the server needs limits on depth and cost, a resolver per field can cause the N+1 query problem (one query per item in a list), and permissions must be checked per field. The default for TindaTrack, with one web app, one phone app and a small team, is REST. Move to GraphQL when you can show the pain, such as clients repeatedly fetching far more data than they use, and accept its operating costs.' },
      { type: 'paragraph', text: 'Whichever style you pick, write the contract. **OpenAPI** is a standard, machine-readable way to describe a REST API: its paths, parameters, request and response shapes, and errors. A written contract lets the web and phone teams build in parallel, lets tools generate documentation and mock servers, and gives you something to test the real service against. Four parts need your design attention:' },
      { type: 'list', items: [
        '**Errors:** one consistent shape, with the right status code, a stable machine-readable code and a human message. A standard exists for this: Problem Details for HTTP APIs, defined by the IETF in RFC 9457.',
        '**Pagination:** never return an unbounded list. Offset pagination (“skip 5,000, give me 50”) is simple but gets slower deep into the list and can repeat or skip rows when data changes between pages. Cursor pagination (“50 after this item”) stays stable and fast, but cannot jump to page 40. Cap the page size on the server.',
        '**Idempotency:** the client sends a unique key with each create request. The server stores the key with the result, and a repeat with the same key returns the saved result instead of creating a second sale.',
        '**What each response exposes:** return only the fields the caller’s role may see. A cost price in a response that a cashier’s app receives is a design decision, whether or not anyone intended it.',
      ] },
      {
        type: 'diagram',
        format: 'mermaid',
        source: 'sequenceDiagram\n  participant A as Phone app\n  participant S as TindaTrack API\n  participant D as Database\n  A->>S: POST /v1/sales with key K1\n  S->>D: Save sale 42 and key K1\n  D-->>S: Saved\n  S-->>A: Reply lost on a weak connection\n  A->>S: Retry POST /v1/sales with key K1\n  S->>D: Look up key K1\n  D-->>S: Found: sale 42\n  S-->>A: Same result, sale 42',
        caption: 'Follow the retry: the second request carries the same key, so the server finds the first result and returns it. Without the key, the retry would have saved a second sale.',
      },
      { type: 'code', language: 'yaml', label: 'OpenAPI fragment: one endpoint, written down (fragment)', code: `paths:
  /v1/sales:
    post:
      summary: Record a sale
      parameters:
        - name: Idempotency-Key
          in: header
          required: true
          schema: { type: string, maxLength: 64 }
      responses:
        '201': { description: Sale saved, or the saved result of a repeated request }
        '409': { description: The key was used for a different request }
        '422': { description: The sale is invalid, with a problem details body }
    get:
      summary: List sales, newest first
      parameters:
        - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100, default: 50 } }
        - { name: after, in: query, schema: { type: string } }` },
      { type: 'code', language: 'json', label: 'An error in the Problem Details shape', code: `{
  "type": "https://tindatrack.example/problems/insufficient-stock",
  "title": "Not enough stock",
  "status": 422,
  "detail": "Product 7 has 1 left and the sale asks for 2.",
  "instance": "/v1/sales"
}` },
      { type: 'version', text: 'RFC 9457, “Problem Details for HTTP APIs”, defines a JSON format for errors with the media type application/problem+json and obsoletes the earlier RFC 7807. It is the shape used in the example above; the type URL there is an invented placeholder.', checked: CHECKED, sources: [DOCS.rfc9457] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In everyday words: an API is like a restaurant menu and the waiter. The menu is the contract: you can only order what is on it, and the kitchen can only change a dish if the menu changes. Pressing the table bell twice should not bring two meals, so each order gets a ticket number, which is the idempotency key. “Page” limits work the same way: a waiter does not carry the whole kitchen’s output to one table, only a plate at a time. REST and GraphQL are two styles of menu. REST has a fixed list of dishes. GraphQL lets you describe the plate you want, which is flexible but needs a more careful kitchen.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'In production the details decide the outcome. Store the idempotency key with a fingerprint of the request, so a reused key with a different body is rejected rather than silently replayed, and expire keys after a stated window. Decide contract-first or code-first and check one against the other automatically (contract tests, lesson 41). Treat error codes as part of the contract, because clients branch on them. For GraphQL, plan persisted queries, depth and cost limits, per-field authorization and dataloader-style batching before opening it to clients you do not control. Rate limits and payload size limits belong in the contract too, since clients need to know how to back off.' },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'If you have called a third-party API, you have been on the receiving end of someone else\'s contract. Designing your own means thinking like that provider: what you promise, what you may change without breaking callers, and what a caller should do when a request fails halfway.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An API description drafted by an assistant, with planted gaps',
        prompt: 'Write an OpenAPI description for TindaTrack: record a sale, list sales, delete a sale. Mobile app and web dashboard use it.',
        output: 'paths:\n  /getAllSales:\n    get:\n      responses:\n        "200":\n          description: Returns all sales with every field, including cost_price_cents and internal_notes\n  /createSale:\n    post:\n      responses:\n        "200":\n          description: Sale created\n        "500":\n          description: Error\n  /deleteSale:\n    post:\n      responses:\n        "200":\n          description: Sale deleted\n\nThis API is simple, RESTful and ready for production.',
        notice: 'Find at least five gaps. The paths are verbs (getAllSales), not resources, and delete uses POST. There is no pagination, so the list is unbounded. Create has no idempotency key and no 201 or 422. The only errors are 200 and 500, with no error shape. The list returns cost_price_cents and internal_notes to every caller, whatever their role. “RESTful and ready for production” is a verdict the text cannot support. Ask the assistant to list every decision it made without being told, then fix the contract yourself.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'Sketch the contract for two endpoints of your own first: the paths, the verbs, the error shape, the page size and the retry rule for the create call. Then ask an assistant to attack it.' },
      { type: 'prompt', label: 'Critique my API contract', text: 'I am designing an API for [your system]. Clients: [web app, phone app, other]. Network conditions: [for example: weak mobile connections].\n\nMy contract for two endpoints:\n[paste the paths, verbs, request and response fields, status codes, error shape, page size, and how a retried create request is handled]\n\nPlease review it as a critic, without rewriting it. List: (a) every place a client could be surprised (errors, limits, retries, missing fields), (b) any field a user of a lower role should not receive, (c) what would break if I changed it later while old clients are still in use, and (d) what you can not judge without knowing my data and clients.' },
      { type: 'paragraph', text: 'Check each finding against your own clients and data. Where it proposes GraphQL or another style, ask what problem in your system it solves and what it costs to run.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: write the contract for one create endpoint, including the retry rule and the error responses, before any code.',
        'Open the OpenAPI Specification on the OpenAPI Initiative’s website and read its description of paths, parameters and responses.',
        'Next lesson, “Versioning, Authentication Boundaries and API Gateways”, covers how a contract changes safely and who checks identity where.',
        'Read RFC 9457 to see the full set of fields in a problem details response.',
      ] },
      { type: 'takeaways', items: [
        'An API is a contract that outlives any one deployment, so write it down before clients depend on it.',
        'REST is the simple default; GraphQL pays off when many clients need different shapes, and it costs caching, limits and operating effort.',
        'POST is not safe to repeat. An idempotency key makes a repeated create return the first result instead of making a second one.',
        'Settle errors, pagination, idempotency and what each role may see before the first client is built.',
        'AI-drafted contracts tend to leave these decisions unsaid, so check for each of them.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-20-scenario-1',
          kind: 'scenario',
          title: 'Should TindaTrack move to GraphQL?',
          prompt: 'Choose the best response to the proposal.',
          concept: 'REST or GraphQL',
          situation: 'TindaTrack has one web app and one phone app, both reading the same sales and product screens. A team of three runs it. A teammate proposes GraphQL “because the phone downloads too much data”. Nobody has measured the response sizes.',
          options: [
            { text: 'Measure the real response sizes first. If the phone fetches far more than it shows, add pagination and leaner responses to the REST contract, and revisit GraphQL only if that is not enough.', consequence: 'The cheapest fix is tried first and the claim is tested. If a real need remains, the team will have numbers to justify the operating cost of GraphQL.', quality: 'best' },
            { text: 'Adopt GraphQL for the phone app only and keep REST for the web app.', consequence: 'It may solve the problem, but the team now runs two API styles, with limits and per-field permissions to build, before anyone knows the size of the problem.', quality: 'acceptable' },
            { text: 'Rewrite the whole API in GraphQL now so the team learns it before the system grows.', consequence: 'Weeks go to a migration for a problem that was never measured, and a new set of risks (expensive queries, caching) arrives with no limits yet in place.', quality: 'poor' },
            { text: 'Switch the phone app to a compact binary protocol to cut the download size.', consequence: 'Debugging and tooling get harder for every developer, and the real cause, an unbounded list response, is still there.', quality: 'poor' },
          ],
          hints: [
            'Has anyone shown that the data size is the problem?',
            'Look for the option that tries the cheapest fix and keeps the ability to change later.',
            'An unbounded list is a contract gap, not a protocol problem.',
          ],
          explanation: 'The claim is untested. Pagination and leaner responses are cheap contract fixes, and they might remove the pain entirely. GraphQL is justified by shown need, because it brings its own operating costs.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-20-arrange-1',
          kind: 'arrange',
          title: 'Handle a create request that may be a retry',
          prompt: 'The caller is already logged in. Put the server’s steps for POST /v1/sales in the right order.',
          concept: 'idempotent create',
          language: 'text',
          solution: [
            'Read the Idempotency-Key header and refuse the request if it is missing',
            'Look the key up and, if it exists, return the saved response',
            'Validate the sale and check the caller may record it',
            'Save the sale and the key with its response in one transaction',
            'Return 201 with the new sale',
          ],
          reasons: [
            'Without a key the server cannot tell a retry from a new sale, so it stops here.',
            'A known key means the work was done already, so return the first result and do nothing more.',
            'Only a new request needs validating and checking.',
            'Saving both together means a crash cannot leave a sale with no key, or a key with no sale.',
            'The reply comes last, after everything is safely stored.',
          ],
          hints: [
            'What must exist before the server can recognise a retry?',
            'What should happen first with a request you have already handled?',
            'The sale and its key must be stored together, and the reply goes out after that.',
          ],
          explanation: 'The order gives each request one outcome: a retry is recognised before any work is repeated, and the key and the sale are saved atomically so a crash in between cannot split them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-20-match-1',
          kind: 'match',
          title: 'Problem to contract feature',
          prompt: 'Match each problem to the contract feature that prevents it.',
          concept: 'API contract features',
          labels: { terms: 'Problem', meanings: 'Contract feature' },
          pairs: [
            { term: 'A phone retries a create request after a weak signal and two sales are saved', definition: 'An idempotency key stored with the result', note: 'The repeat is recognised and returns the first result.' },
            { term: 'A store with two years of data asks for its sales and the phone times out', definition: 'Cursor pagination with a capped page size', note: 'The server never builds an unbounded list.' },
            { term: 'A client cannot tell a validation failure from a server crash', definition: 'A consistent error shape with proper status codes', note: 'Status and a stable code let the client decide what to do.' },
            { term: 'The web and phone teams keep waiting for each other’s endpoints', definition: 'A written contract agreed before building', note: 'Both teams can build against the same description in parallel.' },
          ],
          hints: [
            'Name what each problem is about: repeats, size, failure, or coordination.',
            'The one about teams waiting is not a technical failure of a request.',
            'Repeats and size each have one specific feature.',
          ],
          explanation: 'Each feature closes one gap in the contract. Together they decide how clients behave when the network is slow, the data is large or something goes wrong.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-20-q1',
        prompt: 'An owner taps “Save sale” twice on a weak connection and two sales are saved. Which design change addresses the cause?',
        choices: [
          'Disable the Save button for ten seconds after the first tap, so a second request can never be sent from the phone.',
          'Ask the owner to check the sales list after every save and delete duplicates by hand.',
          'Require an idempotency key on the create request and store it with the result, so a repeat returns the first sale.',
          'Switch the create call from POST to GET, because GET requests are always safe to repeat.',
        ],
        answer: 2,
        explanation: 'The server cannot tell a retry from a new sale without a key. A disabled button helps one screen but not retries from the app, a second device or a network layer, and GET must not change data.',
      },
      {
        id: 'software-architecture-ai-20-q2',
        prompt: 'A list endpoint returns every row, and a large store’s phone times out. Which contract change fixes the cause for all clients?',
        choices: [
          'Compress every response, because smaller bodies always remove the need to limit the number of rows.',
          'Return a capped page and a cursor for the next page, and say the cap in the contract.',
          'Ask the phone app to retry the request three times with a longer timeout each time.',
          'Cache the full list on the phone and never request it again after the first download.',
        ],
        answer: 1,
        explanation: 'The root problem is an unbounded result. A capped page with a cursor bounds the work on both sides. Compression, retries and caching leave the huge response in place.',
      },
      {
        id: 'software-architecture-ai-20-q3',
        prompt: 'Which situation is the strongest reason to choose GraphQL over REST?',
        choices: [
          'Several clients, such as a web dashboard, a phone app and a display, each need a different slice of the same data, and over-fetching is measured.',
          'The team wants to avoid writing documentation, because the schema replaces every other document, including examples, error lists and rules for clients.',
          'The API has only one client and five simple endpoints, and the team heard that GraphQL is modern.',
          'The system needs HTTP caching to work in the simplest possible way for every response.',
        ],
        answer: 0,
        explanation: 'GraphQL’s strength is letting different clients ask for different shapes, and it is justified by measured need. A single client with simple endpoints gains little, and caching is one of its costs.',
      },
      {
        id: 'software-architecture-ai-20-q4',
        prompt: 'An assistant produced an OpenAPI file that returns cost_price_cents to every caller. What is the best reaction?',
        choices: [
          'Keep it for now, since it is easier to remove a field later than to add one that clients need, and nobody has complained yet about the extra data.',
          'Decide which roles may see each field, drop internal fields by default, and document each response per role.',
          'Rename the field so that it looks less sensitive, and leave the response as it is.',
          'Hide the field in the phone app’s screens, since the phone controls what the cashier sees.',
        ],
        answer: 1,
        explanation: 'What the response contains is a security and contract decision made at the API, because anyone can read the raw response. Hiding the field in the screen does not stop the data from being sent.',
      },
      {
        id: 'software-architecture-ai-20-q5',
        audience: { max: 'beginner' },
        prompt: 'In the restaurant picture, what is the idempotency key?',
        choices: [
          'A new menu that lists the dishes in a different order, so that diners can find their favourite dishes faster.',
          'A waiter who carries only a small number of plates at a time.',
          'The ticket number on an order, so pressing the bell twice does not bring two meals.',
        ],
        answer: 2,
        explanation: 'The ticket number lets the kitchen recognise that the second request is the same order, which is exactly what the key does for a repeated request.',
      },
      {
        id: 'software-architecture-ai-20-q6',
        audience: { min: 'advanced' },
        prompt: 'A client sends the same idempotency key twice, but with a different request body the second time. What should the server do?',
        choices: [
          'Return the first result silently, because the key is the only thing that identifies a request and the new body can simply be ignored.',
          'Process the second body as a new request, because the body is what the client really wants.',
          'Overwrite the stored result with the second body’s result, so that the key always points to the latest request.',
          'Reject it with a conflict error, because a key reused for a different request is a client mistake worth surfacing.',
        ],
        answer: 3,
        explanation: 'Storing a fingerprint of the request lets the server detect a reused key. Replaying silently hides a bug, and processing or overwriting it breaks the guarantee that one key means one operation.',
      },
    ],
    task: {
      title: 'Write the contract before the code',
      minutes: 18,
      steps: [
        'Choose two endpoints of a system you know (or TindaTrack: record a sale and list sales). Write each as a path, a verb, the request and response fields and the status codes.',
        'Add the four decisions: the error shape, the page size and cursor rule, the retry rule for the create call, and which roles see which fields.',
        'Paste the contract into the “Critique my API contract” prompt. Note each place the assistant says a client could be surprised.',
        'Decide which findings you accept, which you reject and why, and update the contract. Keep the final version as a file in your project.',
      ],
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Take one existing endpoint in a system you work on and compare its real behaviour with its written contract (OpenAPI or docs). List every difference, and mark which would break an old client if fixed. Draft a contract test that would catch the most serious one.'] },
    ],
  },
  // ---------------------------------------------------------------- 21
  {
    id: 'software-architecture-ai-21',
    day: 21,
    title: 'Versioning, Authentication Boundaries and API Gateways',
    summary: 'Change an API without breaking old clients, decide where identity is checked and where permission is checked, and know when a gateway earns its place.',
    intro: {
      objectives: [
        'Tell a compatible API change from a breaking one, and plan a breaking change with expand and contract',
        'Place the authentication boundary and the authorization checks, and explain why a client must never name its own tenant',
        'Decide whether an API gateway is needed, and say what it costs',
      ],
      why: 'Once clients exist you cannot change an API the way you change internal code, and a single trusted-by-mistake header can undo your isolation work. These choices decide whether releases are calm or an emergency.',
    },
    minutes: 26,
    skills: ['arch-integration'],
    body: [
      { type: 'paragraph', text: 'In the last lesson an API became a contract. Contracts have to change sometimes, and the question is how to change one while older clients are still calling it. A second question sits beside it: when a request arrives, who checks that the caller is who they say, and who checks that they may do this particular thing? This lesson covers both, and ends with the component people often add to answer them, the API gateway, and the honest case for not adding it yet.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'The TindaTrack team decides that the field qty in sale lines is a poor name and renames it to quantity in the API. The web app is deployed the same afternoon and works. The phone apps installed over the last months still read qty, so for many owners the totals screen shows blanks and the app reports errors. The team rolls back in a hurry, and support spends days answering messages from owners who had done nothing wrong.' },
      { type: 'paragraph', text: 'The cost was not the rename. It was assuming that every client moves when the server moves. A web page updates on reload, but a phone app updates when the owner decides, and some never do. The rule that follows is simple: a change that removes or reshapes something a client reads is breaking, and a breaking change needs a path, not a flag day.' },
      { type: 'heading', text: 'How it works' },
      {
        type: 'table',
        headers: ['Change', 'Compatible or breaking?', 'Why'],
        rows: [
          ['Add a new optional field to a response', 'Compatible', 'Clients that do not know the field ignore it, if they were written to tolerate unknown fields'],
          ['Add a new endpoint', 'Compatible', 'Nobody calls it yet'],
          ['Rename or remove a field', 'Breaking', 'Clients that read the old name now find nothing'],
          ['Change a type or a unit, such as pesos to centavos', 'Breaking', 'The field is still there but means something else, which is the worst kind of break because it fails quietly'],
          ['Make an optional request field required', 'Breaking', 'Old clients that omit it are now rejected'],
          ['Add a value to a list of allowed values', 'Careful', 'A client that handles only the values it knew may fail on the new one'],
        ],
        caption: 'The test: could a client built against yesterday’s contract still work today?',
      },
      { type: 'paragraph', text: 'Tolerance on the client side helps: a client that ignores fields it does not know turns many changes into compatible ones. Beyond that, you choose a versioning approach. A version in the path (/v1/sales) is visible and easy to test and route. A version in a header or a media type keeps URLs clean but is harder to see and debug. Some APIs have no versions at all, and only add, deprecate and eventually remove. Each version you keep alive costs documentation, tests, bug fixes and security patches, so the baseline is to **avoid breaking changes** and, when you cannot, to run two versions for a stated window.' },
      { type: 'paragraph', text: 'The safe way to reshape a field is **expand and contract**, also called parallel change. First expand: the API returns both qty and quantity with the same value. Then migrate: release clients that read quantity. Then watch: your logs show which app versions still read qty. Announce a date, and only when use has fallen to nothing, or to an accepted remainder, contract: remove qty. For phone apps the window is long, and a “minimum supported version” check that tells very old apps to update is a separate tool you add alongside.' },
      { type: 'paragraph', text: '**Authentication boundaries.** Authentication proves who is calling. Authorization decides what they may do. They happen in different places. The edge, the first component that receives the request, verifies the credential, such as a signed token, and attaches a verified identity. The code that owns the data then does authorization for the specific resource, because only it knows that this sale belongs to that tenant and that this role may void it. Three rules keep the boundary honest:' },
      { type: 'list', items: [
        '**Never trust identity the client states.** A tenant id or role in a header or request body is a claim from someone you have not verified. Take the tenant from the verified token only.',
        '**“Inside the network” is not a boundary.** An internal service should still receive a verified identity, or its own credential, and check it.',
        '**Give each caller the least power it needs.** A reports job gets a credential that can read, not one that can void sales.',
      ] },
      { type: 'paragraph', text: 'An **API gateway** is a single entry point in front of your backends. It can terminate encrypted connections, verify tokens, apply rate limits, route requests and log them. Cloud providers offer managed ones (Amazon API Gateway, Azure API Management and Google Cloud’s API Gateway are examples). The benefit is one place for shared policy. The costs are another component to run and to keep available, one more network hop, configuration that must be reviewed like code, and the temptation to put business logic in it. A gateway also does not replace authorization inside the service. It checks that the token is real, not that this sale belongs to this tenant.' },
      { type: 'paragraph', text: 'You often do not need one yet. A single modular monolith already has middleware for tokens and rate limits, and a load balancer in front for encrypted connections. A gateway earns its place when there are several backends, many outside consumers, or a need for central policy that you cannot get more cheaply.' },
      {
        type: 'diagram',
        format: 'mermaid',
        source: 'C4Container\n  title TindaTrack at the edge, with no gateway yet\n  Person(owner, "Store owner", "Uses the phone and web apps")\n  System_Ext(idp, "Identity provider", "Signs people in and issues tokens")\n  System_Boundary(app, "TindaTrack") {\n    Container(mobile, "Phone app", "Mobile", "Sends the token with every call")\n    Container(web, "Web app", "Browser", "Sends the token with every call")\n    Container(api, "API", "Modular monolith", "Verifies the token, then checks tenant and role")\n    ContainerDb(db, "Database", "PostgreSQL", "Tenant data")\n  }\n  Rel(owner, mobile, "Uses")\n  Rel(owner, web, "Uses")\n  Rel(owner, idp, "Signs in")\n  Rel(mobile, api, "Calls", "HTTPS/JSON")\n  Rel(web, api, "Calls", "HTTPS/JSON")\n  Rel(api, idp, "Gets keys to verify tokens", "HTTPS")\n  Rel(api, db, "Reads and writes", "SQL")',
        caption: 'Find the two checks inside the API box: the token is verified once at its edge, and tenant and role are checked again where the data is. A gateway could take over the first check later without changing the second.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In everyday words: think of an office building. The front desk checks your ID badge and gives you a visitor pass. That is authentication. But the door of each office still checks whether your pass lets you in. That is authorization. A gateway is a front desk shared by many offices. If the building has only one office, a second front desk adds cost and little else. Versioning is like changing a form that customers fill in: if you change the form overnight, everyone holding the old copy is rejected. So you accept both forms for a while, tell people about the new one, and stop accepting the old one only when almost nobody uses it.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'In larger systems the questions sharpen. A gateway is on every request’s path, so it must be highly available and observable, and its configuration needs the same review and rollout discipline as code. Repeating token checks in services costs little and means a bypassed gateway is not a breach. Telemetry by client version is what makes a deprecation decision a measurement. Consumer-driven contract tests catch breaking changes before release. Keep propagated identity small and verified (a signed assertion, not a header any hop can set), and decide per service what happens when the identity provider is unreachable: fail closed for writes, and say what reads may do.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An API layer designed by an assistant, with planted problems',
        prompt: 'TindaTrack has one backend, one web app and one phone app. Design our API layer: versions, authentication and routing.',
        output: 'I recommend a production-grade setup:\n\n1. A managed API gateway cluster in front of everything, plus a service mesh.\n2. URL versions v1, v2, v3 and v4 for every endpoint, all supported forever.\n3. In your handler, read the tenant from the request so the right data is returned:\n\n   const tenantId = req.body.tenantId;\n   const sales = await db.sales.findMany({ tenantId });\n\nThis keeps routing flexible and works for any scale.',
        notice: 'Check three things. A gateway cluster and a mesh for one backend answer no stated requirement, and no cost is given. Four versions “supported forever” is an open-ended maintenance bill, with no policy for when to retire one. And the tenant is read from the request body, which any client can set to someone else’s tenant, so the whole isolation design from lesson 19 is bypassed. Ask the assistant which requirement each component answers, and say that the tenant must come from the verified token.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'Draw your own boundary first: where is the credential checked, where is permission checked, and what is your rule for a breaking change? Then ask for criticism.' },
      { type: 'prompt', label: 'Critique my API change and boundary plan', text: 'My system: [one sentence]. Clients: [web, phone, others] and how they update: [web updates on reload, phone apps update when users choose].\n\nPlanned breaking change: [for example: rename field qty to quantity in two endpoints].\nMy plan to ship it: [your expand and contract steps and your window].\n\nMy boundary plan: the credential is checked at [component]; the tenant and role are checked at [component]; the tenant comes from [token or other].\nI plan to [use or not use] an API gateway because [reason].\n\nPlease critique this without redesigning it: (a) which client could still break and how I would notice, (b) where a client could name its own identity or tenant, (c) what a gateway would add and cost in my case, and (d) what you can not tell without my logs and traffic.' },
      { type: 'paragraph', text: 'Verify against your own logs and clients. Any claim about how a specific gateway product behaves should be confirmed in that product’s documentation.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: classify the last three API changes your team made as compatible or breaking, and check how each reached old clients.',
        'Add the client version to your request logs, so a deprecation can be decided from data.',
        'Next lesson, “Third-Party Integrations and Webhooks That Can Be Trusted”, covers the opposite direction: other systems calling you.',
        'Read about parallel change (expand and contract) and your cloud provider’s documentation for its managed gateway before you decide.',
      ] },
      { type: 'takeaways', items: [
        'A change is breaking if a client built against yesterday’s contract would fail; renames, removals and unit changes are breaking.',
        'Avoid breaking changes; when needed, expand, migrate, watch the logs and only then contract, with a stated window.',
        'Authenticate at the edge, authorize where the data is, and never trust a tenant or role the client states.',
        'A gateway centralizes shared policy at the cost of another component, a hop and a place for logic to leak; a modular monolith often does not need one yet.',
        'A gateway checks the token, not whether this tenant may touch this record.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-21-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Breaking or compatible?',
          prompt: 'Each card is a change to the TindaTrack API. Tap to see whether it breaks an old client and why.',
          concept: 'compatible and breaking changes',
          cards: [
            { front: 'The sales response gains a new optional field, payment_method', back: 'Compatible, provided clients ignore fields they do not know. Old clients keep working.' },
            { front: 'The price field changes from pesos (18.5) to centavos (1850), same name', back: 'Breaking, and quietly: the field is still there but old clients now show prices a hundred times too large. Add a new field and migrate instead.' },
            { front: 'Creating a sale now requires a new field, register_id', back: 'Breaking: old clients do not send it and are rejected. Make it optional, or version the endpoint.' },
            { front: 'A brand-new endpoint, GET /v1/low-stock, is added', back: 'Compatible: nobody calls it yet.' },
          ],
          hints: ['Ask whether a client built yesterday would still work today.'],
          explanation: 'The question is always whether yesterday’s client still works. Adding is usually safe. Renaming, removing, requiring more, or changing a meaning breaks someone.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-21-arrange-1',
          kind: 'arrange',
          title: 'Rename a field without breaking phones',
          prompt: 'Put the steps for renaming qty to quantity in the right order.',
          concept: 'expand and contract',
          language: 'text',
          solution: [
            'Return both qty and quantity with the same value',
            'Release web and phone apps that read quantity',
            'Watch the logs for calls from versions that still read qty',
            'Announce the date the old field will be removed',
            'Remove qty once the logs show it is no longer used',
          ],
          reasons: [
            'Expanding first means every client, old or new, finds what it reads.',
            'Clients can only migrate once the new field exists.',
            'The logs tell you who still depends on the old field, so removal is a measured decision.',
            'People still on the old version need warning before something they use disappears.',
            'Contracting comes last, after the evidence says it is safe.',
          ],
          hints: [
            'Which step makes the new field available without taking the old one away?',
            'Removal must come after both the migration and the evidence.',
            'Announcing the date comes before the removal, and after you know who is affected.',
          ],
          explanation: 'Expand and contract changes the contract in small steps that never leave a working client without the field it reads. Each step is reversible until the last one.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-21-scenario-1',
          kind: 'scenario',
          title: 'Do we need an API gateway?',
          prompt: 'Choose the best response.',
          concept: 'when a gateway earns its place',
          situation: 'TindaTrack is one modular monolith with a web app and a phone app. A teammate proposes a managed API gateway to “get authentication and rate limiting in one place”. There is no second backend, and no outside partner uses the API yet.',
          options: [
            { text: 'Use the framework’s middleware for token checks and rate limits behind the existing load balancer, write down the triggers (a second backend, outside partners) at which a gateway is reconsidered, and keep authorization in the service.', consequence: 'The needs are met with what already runs. The decision record names when to revisit, and the data checks stay where the data is.', quality: 'best' },
            { text: 'Adopt a managed gateway, but limit it to rate limiting and encrypted connections, and keep every other check in the service.', consequence: 'It works and it is configuration, not code, but it is one more component to keep available and to review, added before a need exists.', quality: 'acceptable' },
            { text: 'Build a custom gateway service that also applies business rules like stock checks.', consequence: 'You now run and maintain a second service that duplicates logic with the API, and a rule change must be shipped in two places.', quality: 'poor' },
            { text: 'Adopt the gateway and remove the token and tenant checks from the API, since the gateway handles security.', consequence: 'The gateway only proves the token is real. Nothing now checks that this tenant may touch this record, so a bug in routing or a bypass exposes every tenant.', quality: 'poor' },
          ],
          hints: [
            'What requirement does a gateway answer that the monolith cannot already meet?',
            'Look for the answer that names a trigger for changing the decision.',
            'A gateway can prove a token is valid but not that the record belongs to the caller.',
          ],
          explanation: 'There is no stated requirement a gateway would meet that the existing middleware and load balancer do not. Record the triggers for revisiting, and never move data-level authorization into the gateway.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-21-q1',
        prompt: 'A team changes a price field from pesos to centavos but keeps its name. Why is this the most dangerous kind of breaking change?',
        choices: [
          'Clients that read the field find it missing and crash immediately, so the error is easy to spot in testing.',
          'Database columns cannot change type without deleting all existing data for every store.',
          'The field still exists but means something else, so old clients keep running and show wrong numbers.',
          'Prices are always shown in the user’s own currency, so the change is mostly cosmetic.',
        ],
        answer: 2,
        explanation: 'A change of meaning fails quietly: no error, wrong results. The fix is a new field with a new name, migrated in steps.',
      },
      {
        id: 'software-architecture-ai-21-q2',
        prompt: 'Where should the check that “this sale belongs to this tenant and this role may void it” happen?',
        choices: [
          'In the code that owns the sales data, using the tenant and role from the verified token.',
          'Only at the gateway, since it sees every request before the service does.',
          'In the phone app, since it knows which cashier is logged in.',
          'In a header the client sends, such as X-Tenant-Id, so that the service need not look anything up.',
        ],
        answer: 0,
        explanation: 'Only the data owner knows which tenant a record belongs to. A gateway can verify a token but not the record’s owner, and the client’s header or screen can be changed by the caller.',
      },
      {
        id: 'software-architecture-ai-21-q3',
        prompt: 'A single modular monolith with two clients and a load balancer in front. What is the best position on an API gateway?',
        choices: [
          'Add one now, because every production API needs a gateway to be considered professional by auditors and by customers who ask about it.',
          'Never add one, whatever changes, because a gateway always makes the system less secure.',
          'Use middleware and the load balancer now, and write down the triggers for a gateway: several backends, outside consumers or central policy.',
          'Add one only after the first security incident, since that is the point at which its cost is justified.',
        ],
        answer: 2,
        explanation: 'A gateway answers needs that this system does not yet have. Naming the triggers keeps the decision honest, and the choice can be revisited when the situation changes.',
      },
      {
        id: 'software-architecture-ai-21-q4',
        prompt: 'Which action best reduces the risk of retiring the old field qty?',
        choices: [
          'Remove the field on a Sunday night, when fewer owners are using the app.',
          'Keep the old field forever, and never mention it in the documentation again.',
          'Log the client version, watch who still reads qty, announce a date and remove it when use has fallen away.',
          'Ask owners by email to update, and remove the field the next day for those who did not, since a day’s warning is fair.',
        ],
        answer: 2,
        explanation: 'Measuring who still depends on the field turns retirement into a decision backed by evidence. Quiet hours and emails do not tell you who will break.',
      },
      {
        id: 'software-architecture-ai-21-q5',
        audience: { max: 'beginner' },
        prompt: 'In the office building picture, what is authorization?',
        choices: [
          'The front desk giving you a visitor pass after looking at your ID.',
          'Each office door checking whether your pass lets you in.',
          'The building adding a second front desk when it grows.',
        ],
        answer: 1,
        explanation: 'Authentication proves who you are; authorization decides what you may do. The pass is checked again at each door.',
      },
      {
        id: 'software-architecture-ai-21-q6',
        audience: { min: 'advanced' },
        prompt: 'Your gateway verifies tokens, and internal services trust whatever tenant header the gateway adds. A misconfigured route bypasses the gateway. What is the architectural weakness?',
        choices: [
          'Gateways can only verify tokens that are signed with long keys, so the key length should be increased in every environment and for every service.',
          'Services depend on a header anything on the path can set, so they should verify a signed identity and authorize themselves.',
          'The tokens are too short-lived, so the gateway cannot cache them long enough to keep latency low.',
          'The route should have been version-prefixed, so that old routes cannot reach new services by accident.',
        ],
        answer: 1,
        explanation: 'A bypassed gateway should not be a breach. Services that check a verified, signed identity and do their own authorization keep working when one hop is misconfigured.',
      },
    ],
    task: {
      title: 'Plan a breaking change and mark the boundary',
      minutes: 18,
      steps: [
        'Pick a field or endpoint of a system you know that you would like to rename or reshape. Classify it as compatible or breaking, with the client that would fail.',
        'Write the expand and contract steps for it, including how you will find who still depends on the old shape and the date you will announce.',
        'Draw the boundary on one request: where is the credential checked, where are tenant and role checked, and where does the tenant value come from? Mark any place a client could set it.',
        'Paste the plan into the “Critique my API change and boundary plan” prompt. Keep one finding you agree with and one you reject, with reasons.',
      ],
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Write a consumer-driven contract test (in words or code) for the field you are changing, and describe where it runs in your pipeline. Decide what your service does when the identity provider is unreachable, separately for reads and writes.'] },
    ],
  },
  // ---------------------------------------------------------------- 22
  {
    id: 'software-architecture-ai-22',
    day: 22,
    title: 'Third-Party Integrations and Webhooks That Can Be Trusted',
    summary: 'Wrap outside services so their failures and changes stay contained, and receive webhooks that are verified, deduplicated, replay-safe and quick to answer.',
    intro: {
      objectives: [
        'Isolate a third-party service behind an adapter with timeouts, retries with backoff and a circuit breaker',
        'List the checks a webhook endpoint needs: signature, timestamp, deduplication, ordering and a fast reply',
        'Review an AI-drafted webhook handler against that list',
      ],
      why: 'Payments, texts and maps are bought, not built, and every one of them is slower, less reliable and more changeable than your own code. A webhook is also a public door into your system, so it has to be treated as one.',
    },
    minutes: 28,
    skills: ['arch-integration'],
    body: [
      { type: 'paragraph', text: 'Most real systems depend on outside services: an e-wallet provider for payments, a gateway for text messages, a map service. They save months of work, and they bring a different kind of risk. You do not control when they are slow, down or changed, and sometimes they call you instead of you calling them. This lesson covers both directions: protecting your system when you call out, and trusting only what you have verified when something calls in.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'TindaTrack sells a paid plan, and owners pay with an e-wallet. The provider notifies TindaTrack through a webhook, a request the provider sends to a URL you give it, when a payment succeeds. The first version of the endpoint reads the account id from the body and switches the account to the paid plan. It also sends a confirmation text before it answers.' },
      { type: 'paragraph', text: 'Within the first month, three things happen. An audit finds an account upgraded by a request that no payment backed: a developer’s test call had hit the live URL, and nothing in the endpoint could tell the difference. Several accounts are extended twice, because the text provider was slow, the e-wallet provider timed out waiting for a reply and sent the event again, and the endpoint handled it again. And one night the e-wallet provider is down for an hour while the checkout screen spins, because TindaTrack waits for it with no time limit. The cost was free plans, wrong billing periods and a night of support calls.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**Calling out.** Assume the outside service will be slow, sometimes down, rate-limited and, eventually, changed. Four habits contain that:' },
      { type: 'list', ordered: true, items: [
        '**An anti-corruption layer (an adapter).** One module translates between the provider’s vocabulary and yours. Your code asks for “start a checkout for this account and amount” and gets back your own states (pending, paid, failed). The provider’s field names and status strings never reach your database or screens. You can then change provider, absorb a provider change in one place, and test with a fake. The cost is code to write and a mapping to keep correct, so use it where the service matters or may change, as with payments and texts.',
        '**A timeout on every outbound call,** shorter than your own caller’s timeout. Without one, a slow provider ties up your workers.',
        '**Retries with exponential backoff and jitter.** Wait longer after each failure, with a little randomness so that many clients do not retry in step. Retry only calls that are safe to repeat, such as reads or writes that carry an idempotency key (lesson 20), and cap the attempts. Retrying everything immediately turns an outage into a storm.',
        '**A circuit breaker.** After repeated failures, stop calling for a while and fail fast with a clear message, instead of making every user wait for a service that is known to be down.',
      ] },
      {
        type: 'table',
        headers: ['Breaker state', 'What happens', 'Moves on when'],
        rows: [
          ['Closed', 'Calls go through normally, and failures are counted', 'Too many failures in a short period: it opens'],
          ['Open', 'Calls fail at once with a fallback message, and the provider is left alone', 'A waiting period ends: it becomes half-open'],
          ['Half-open', 'A few trial calls are allowed through', 'They succeed: it closes. They fail: it opens again'],
        ],
        caption: 'The breaker protects your workers and the provider’s recovery. Pair it with something honest for the user, such as “Payments are unavailable, try again shortly”.',
      },
      { type: 'paragraph', text: '**Calling in: webhooks.** A webhook endpoint is a public door, so verify before you act. Seven things matter:' },
      { type: 'list', items: [
        '**Authenticity.** The provider signs the exact bytes of the message with a secret shared with you (commonly an HMAC). You recompute the signature from the raw body and compare it in constant time. Compute it before parsing the body, and from the raw bytes, not from re-serialized JSON. The exact scheme differs by provider, so follow its documentation.',
        '**Replay.** A genuine old message can be sent again. Include a timestamp in what is signed, and reject messages outside a short window.',
        '**Duplicates.** Providers usually retry until they get a success reply, so delivery is at least once. Keep a table of processed event ids with a unique constraint and write to it in the same transaction as the effect.',
        '**Ordering.** Events can arrive out of order. Do not assume “created” comes before “succeeded”. Use the event’s own time, or treat the event as a hint and fetch the current state from the provider.',
        '**A fast reply.** Record the event, answer with a success status quickly, and do slow work (texts, emails) afterwards. The next lesson shows how queues do that safely.',
        '**Missed events.** Retries eventually stop. A reconciliation job that compares your records with the provider’s catches what was lost.',
        '**The secret.** The signing secret lives in a secrets store or environment variable, never in the repository, a prompt or a log.',
      ] },
      { type: 'code', language: 'typescript', label: 'Checking a signature and its age (fragment; the header names and the signed string depend on your provider’s documentation)', code: `import { createHmac, timingSafeEqual } from 'node:crypto';

export function isValidSignature(rawBody: string, timestamp: string, signatureHex: string, secret: string): boolean {
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false; // too old, or not a number
  const expected = createHmac('sha256', secret).update(\`\${timestamp}.\${rawBody}\`).digest();
  const given = Buffer.from(signatureHex, 'hex');
  return given.length === expected.length && timingSafeEqual(given, expected);
}` },
      { type: 'code', language: 'sql', label: 'Deduplicate by event id inside the same transaction as the effect (fragment)', code: `-- webhook_events.event_id has a UNIQUE constraint
INSERT INTO webhook_events (event_id, received_at) VALUES ($1, now())
ON CONFLICT (event_id) DO NOTHING;
-- If no row was inserted, this event was already handled: reply 200 and stop.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: 'sequenceDiagram\n  participant P as E-wallet provider\n  participant E as TindaTrack webhook endpoint\n  participant D as Database\n  P->>E: Event E1, signed, with a timestamp\n  E->>D: Insert event id E1 (unique)\n  D-->>E: Inserted, so it is new\n  E->>D: Mark the account paid, same transaction\n  E-->>P: 200 OK\n  P->>E: Retry of E1 after a timeout\n  E->>D: Insert event id E1 (unique)\n  D-->>E: Already exists\n  E-->>P: 200 OK, nothing done',
        caption: 'Read the retry at the bottom: the second delivery is recognised by its event id and does nothing. The signature and timestamp are checked before the first database call.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In everyday words: a webhook is like a courier knocking at your door with a message, instead of you going to the shop to ask. You would check the courier’s badge before you open the door, and a wax seal on a letter is the same idea: only the sender can make it. The courier may knock twice if you were slow to answer, so you keep a list of parcel numbers and do not sign for the same parcel twice. And you do not make the courier wait on the doorstep while you fetch a gift for them: take the message, say thank you, and do the rest afterwards. An adapter is a translator who speaks your language to you, so you never have to learn the courier company’s jargon.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'At scale, treat webhook intake as its own small component: verify, deduplicate, persist the raw event, acknowledge, then hand off. Keep the raw payloads for audit and replay in your own system. Support two signing secrets at once so you can rotate without downtime. An IP allowlist is a weak extra layer, not a substitute for signatures. The replay window is a trade-off with clock skew. Reconciliation is the real source of correctness, since no delivery guarantee survives a long provider outage. Decide in advance what the product does while a provider is down (queue and retry, degrade, or refuse), and test it with a failure drill. The anti-corruption layer costs more as more of the provider’s features leak through, so keep its interface in your terms.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'A webhook handler drafted by an assistant, with planted flaws',
        prompt: 'Write an Express endpoint for our e-wallet provider’s payment webhook. It should verify the signature and upgrade the account to the paid plan.',
        output: 'app.post(\'/webhooks/payments\', express.json(), async (req, res) => {\n  const expected = sign(JSON.stringify(req.body), process.env.WEBHOOK_SECRET);\n  if (req.headers[\'x-signature\'] == expected) {\n    await db.accounts.update({ id: req.body.account }, { plan: \'pro\' });\n    await sendConfirmationText(req.body.account);\n    res.sendStatus(200);\n  } else {\n    res.sendStatus(401);\n  }\n});\n\nThis securely verifies the webhook and upgrades the account.',
        notice: 'List what is missing. The signature is computed over re-serialized JSON, not the raw body that the provider signed, so it may fail on genuine events or pass for the wrong reasons. The comparison uses a loose equality, not a constant-time comparison. There is no timestamp check, so an old message replays, and no event id check, so a retry upgrades twice. Any event type upgrades the plan, with no check of the event kind or amount. The slow text message is sent before the reply, which invites provider timeouts and retries. “Securely” is a claim the code does not earn. Ask the assistant to list the checks it did not implement.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'Write down your own checklist for an integration first: your adapter’s interface, your timeout, retry and breaker rules, and the seven webhook checks. Then ask an assistant to find the holes.' },
      { type: 'prompt', label: 'Review my integration design', text: 'I integrate with [a third-party service, for example an e-wallet provider] for [purpose].\n\nOutbound: my adapter interface is [methods in my own terms]. Timeout: [value]. Retries: [rule, and which calls are safe to repeat]. Circuit breaker: [yes or no, and the fallback message].\nInbound webhooks: signature check [how], replay window [value], duplicate handling [how], ordering [how], reply speed [what happens before the reply], reconciliation [yes or no].\nSecrets: [where they are kept].\n\nPlease critique this as a reviewer, without writing the code for me: (a) what failure or attack each gap allows, (b) what my fallback does when the provider is down for an hour, (c) which of my checks depend on provider behaviour I should confirm in its documentation, and (d) what you can not judge without seeing my code and the provider’s documentation.' },
      { type: 'paragraph', text: 'Check each claim about the provider against its own documentation, and write the failing tests for a bad signature, an old timestamp and a repeated event id. Never paste a real secret into a prompt.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: list every outside service your system calls or receives calls from, and mark which have a timeout, a retry rule and a breaker or fallback.',
        'Write three tests for a webhook endpoint: bad signature, old timestamp and a repeated event id.',
        'Next lesson, “Message Queues and Event-Based Communication”, shows how to answer fast and do the slow work safely afterwards.',
        'Read your provider’s webhook documentation, in particular its signing scheme, retry schedule and event ordering notes.',
      ] },
      { type: 'takeaways', items: [
        'Wrap each outside service in an adapter so its vocabulary, changes and failures stay out of your core.',
        'Every outbound call needs a timeout; retry with backoff only what is safe to repeat; a circuit breaker fails fast during an outage.',
        'A webhook endpoint verifies the signature on the raw body, rejects old timestamps, deduplicates by event id, and does not assume order.',
        'Reply fast and do slow work afterwards; reconcile with the provider to catch what was missed.',
        'Secrets live in a secrets store, never in code, prompts or logs.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-22-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Draft and check a webhook handler with AI, safely',
          prompt: 'Build the workflow for getting a webhook handler drafted by an assistant and into production safely.',
          concept: 'reviewing AI-drafted integration code',
          situation: 'You will have an assistant draft the payment webhook handler for TindaTrack. The handler decides who gets a paid plan, so a mistake costs money. Choose and order the steps, including the review, and leave out the tempting shortcuts.',
          parts: [
            { id: 'read-docs', lane: 'input', label: 'Read the provider’s webhook documentation', detail: 'Note the signing scheme, the retry schedule and what each event type means.' },
            { id: 'secret-store', lane: 'tool', label: 'Keep the signing secret in the secrets store', detail: 'The secret is read from the environment at runtime, never written into code or a prompt.' },
            { id: 'ai-draft', lane: 'ai', label: 'Ask AI to draft the handler from the documentation', detail: 'Paste the relevant parts of the documentation and your checklist, with a placeholder where the secret goes.' },
            { id: 'paste-secret', lane: 'ai', label: 'Paste the real signing secret into the prompt so the AI can test it', detail: 'The assistant can then check the signature against the real value.' },
            { id: 'write-tests', lane: 'tool', label: 'Write tests: bad signature, old timestamp, repeated event id', detail: 'Each test must fail on a draft that lacks the check.' },
            { id: 'skip-repeat-test', lane: 'tool', label: 'Skip the repeated-event test because the provider says events arrive once', detail: 'The provider’s documentation is trusted as a promise.' },
            { id: 'human-review', lane: 'human', label: 'Review the draft against the checklist', detail: 'Raw body, constant-time compare, replay window, event id dedupe, fast reply, event kind checked.' },
            { id: 'reconcile-job', lane: 'tool', label: 'Schedule a reconciliation job against the provider’s records', detail: 'It catches events that were never delivered.' },
            { id: 'deploy', lane: 'output', label: 'Deploy the handler', detail: 'The handler goes live behind the provider’s production URL.' },
            { id: 'deploy-on-ai-word', lane: 'output', label: 'Deploy because the AI said the handler is secure', detail: 'The assistant’s statement is taken as the review.' },
          ],
          rules: [
            { id: 'r-docs', kind: 'require', parts: ['read-docs', 'ai-draft', 'write-tests', 'human-review', 'secret-store'], message: 'The workflow needs the documentation, a draft, tests, a human review and a proper home for the secret.' },
            { id: 'r-no-secret', kind: 'forbid', parts: ['paste-secret'], message: 'A real secret must never go into a prompt: it is copied to a service you do not control and it can leak.' },
            { id: 'r-no-skip', kind: 'forbid', parts: ['skip-repeat-test', 'deploy-on-ai-word'], message: 'Providers retry, so duplicates must be tested, and an assistant’s statement is not a review.' },
            { id: 'r-docs-first', kind: 'before', parts: ['read-docs', 'ai-draft'], message: 'The draft must start from the provider’s documentation, so the assistant does not guess the signing scheme.' },
            { id: 'r-review-first', kind: 'before', parts: ['human-review', 'deploy'], message: 'A person reviews before the handler goes live.' },
            { id: 'r-tests-first', kind: 'before', parts: ['write-tests', 'deploy'], message: 'The tests run before the handler goes live.' },
          ],
          solution: ['read-docs', 'secret-store', 'ai-draft', 'write-tests', 'human-review', 'reconcile-job', 'deploy'],
          minSteps: 5,
          maxSteps: 8,
          simulation: {
            input: 'Add a payment webhook handler for the e-wallet provider’s payment.succeeded event.',
            steps: {
              'read-docs': 'You note that events are signed with an HMAC over timestamp and body, and that failed deliveries are retried.',
              'secret-store': 'The signing secret is placed in the secrets store and read from the environment.',
              'ai-draft': 'The assistant drafts a handler from the pasted documentation, with SECRET as a placeholder.',
              'write-tests': 'Three tests are written: a bad signature, a ten-minute-old timestamp and a repeated event id.',
              'human-review': 'You find the draft re-serializes the body before checking, and fix it to use the raw bytes.',
              'reconcile-job': 'A nightly job compares paid accounts with the provider’s payments.',
              deploy: 'The handler is deployed after the tests pass and the review is signed off.',
            },
            output: 'A handler that verifies, deduplicates and replies fast, with the secret kept out of the prompt and a review on record.',
          },
          hints: [
            'Start from what the handler must follow: the provider’s own documentation.',
            'Two parts are shortcuts that save time and cost you later: one leaks a secret, one skips a test.',
            'A person must review before the deploy, and the AI’s own opinion does not count as that review.',
          ],
          explanation: 'The assistant drafts, but the evidence comes from tests and a person’s review against a checklist. The secret stays out of the prompt, and duplicates are tested because retries are part of how webhooks work.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-22-scenario-1',
          kind: 'scenario',
          title: 'The provider is down and checkout hangs',
          prompt: 'Choose the best design response.',
          concept: 'timeouts and circuit breakers',
          situation: 'The e-wallet provider has been down for an hour. TindaTrack calls it with no time limit when an owner pays for a plan. Checkout screens spin, and the API’s workers are all waiting on the provider, so even the sales screen is now slow.',
          options: [
            { text: 'Put a short timeout on the call and a circuit breaker around it, show “Payments are unavailable, try again shortly”, and alert the team, so the rest of the app keeps working.', consequence: 'The checkout fails fast and clearly, the workers are freed, and the provider is left alone to recover. Sales keep running.', quality: 'best' },
            { text: 'Add a timeout and one retry with the same idempotency key, without a breaker.', consequence: 'It helps in a short blip, but during an hour-long outage every request still waits twice, so workers keep filling up.', quality: 'acceptable' },
            { text: 'Raise the timeout to two minutes so slower responses can still succeed.', consequence: 'Workers wait even longer on a service that is down, and the whole API gets slower for everyone.', quality: 'poor' },
            { text: 'Retry in a tight loop until the provider answers.', consequence: 'Every user adds load to the provider as it tries to recover, and your own workers are stuck in loops.', quality: 'poor' },
          ],
          hints: [
            'What is holding the API’s workers, and what should happen to a call that is known to fail?',
            'Look for the option that frees the workers and keeps the rest of the app usable.',
            'More waiting and more retrying both add load to a service that is already down.',
          ],
          explanation: 'A timeout bounds the wait and a breaker avoids calling a service that is known to be down. Together with an honest message, they contain the outage to the one feature that depends on it.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-22-q1',
        prompt: 'The e-wallet provider retries a webhook after a timeout and several accounts get extended twice. Which design change fixes the cause?',
        choices: [
          'Ask the provider to stop retrying events, since retries are the only reason for duplicates.',
          'Record each processed event id under a unique constraint in the same transaction as the change, so a repeat does nothing.',
          'Process webhooks only once a day in a batch, so that duplicates can be spotted and removed together before any account is changed.',
          'Increase the timeout on the endpoint so that the provider never gives up waiting.',
        ],
        answer: 1,
        explanation: 'Delivery is at least once by design, so the receiver must be idempotent. Recording the event id with the effect in one transaction makes a repeat a no-op. Providers retry because it is the safe way to avoid lost events.',
      },
      {
        id: 'software-architecture-ai-22-q2',
        prompt: 'Why should a webhook signature be checked against the raw request body?',
        choices: [
          'The provider signs the exact bytes it sent, and re-serialized JSON may differ in spacing or order, so the check can fail.',
          'Raw bodies are smaller, so the check runs faster and uses less memory on every request, which matters a great deal at high volume.',
          'Parsed JSON cannot be used in a database query, so the check must use the raw text.',
          'The raw body is always encrypted, so it is the only form that carries the signature.',
        ],
        answer: 0,
        explanation: 'A signature covers specific bytes. Re-serializing changes them, so the comparison is no longer against what the provider signed.',
      },
      {
        id: 'software-architecture-ai-22-q3',
        prompt: 'What is the main purpose of an anti-corruption layer around a payment provider?',
        choices: [
          'To encrypt every message that leaves the system, so that the provider and anyone on the network path cannot read it.',
          'To make the provider’s service faster by caching its answers on your own servers.',
          'To remove the need for timeouts, since the adapter handles slow responses on its own.',
          'To keep the provider’s vocabulary and changes out of your core code, so you can absorb a change or switch in one place.',
        ],
        answer: 3,
        explanation: 'The adapter translates between the provider’s model and yours. It does not replace timeouts or encryption, and it is not mainly a cache.',
      },
      {
        id: 'software-architecture-ai-22-q4',
        prompt: 'A handler sends a confirmation text before replying 200 to the provider. What is the most likely consequence, and the fix?',
        choices: [
          'The text is sent twice by the provider, so the handler should check that the phone number is unique.',
          'A slow text provider delays the reply, the provider times out and retries, so reply first and send the text afterwards.',
          'The provider will mark the endpoint as insecure, so the endpoint must use a different URL for each event it receives.',
          'Nothing, because replies are never timed by the provider, and slow work before them is harmless.',
        ],
        answer: 1,
        explanation: 'Providers wait a limited time for a reply. Slow work before the reply causes timeouts and retries. Record the event, reply, then do the slow work.',
      },
      {
        id: 'software-architecture-ai-22-q5',
        audience: { max: 'beginner' },
        prompt: 'In the courier picture, why do you keep a list of parcel numbers?',
        choices: [
          'To know how many couriers work for the company and how often each of them visits the building.',
          'So that you can send the courier a thank-you note later.',
          'So that if the courier knocks twice with the same parcel, you do not sign for it twice.',
        ],
        answer: 2,
        explanation: 'The parcel list is the processed event table. A repeat of the same event is recognised and ignored.',
      },
      {
        id: 'software-architecture-ai-22-q6',
        audience: { min: 'advanced' },
        prompt: 'Your reconciliation job often finds payments that the provider has but your database lacks, after a provider outage. What does that tell you about the design?',
        choices: [
          'Webhook delivery cannot be the only source of truth, so keep reconciliation as part of correctness.',
          'The webhook endpoint has a bug in its signature check, so the signing algorithm should be changed to a stronger one.',
          'The retry window of the provider is too short, so it should be negotiated until it never ends.',
          'Payments should be recorded only from the user’s phone, since it is closer to the person paying.',
        ],
        answer: 0,
        explanation: 'No delivery guarantee survives a long outage, so periodic comparison with the provider’s records is part of the design. The signature check is not the cause when events never arrived.',
      },
    ],
    task: {
      title: 'Harden one integration',
      minutes: 20,
      steps: [
        'Pick one outside service your system uses (or the e-wallet provider in TindaTrack). Write the interface of an adapter in your own terms: three methods, and the states you would return.',
        'For each outbound call, write the timeout, the retry rule (and whether the call is safe to repeat) and the fallback message when a circuit breaker is open.',
        'For the inbound webhook, write a one-line answer to each of the seven checks, and write three test cases: a bad signature, an old timestamp and a repeated event id.',
        'Paste your design into the “Review my integration design” prompt. Note which gaps the assistant found that you missed, and which of its points you rejected.',
      ],
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Design a failure drill for a one-hour provider outage: what is switched off, what users see, what you measure, and how you reconcile afterwards. Write the acceptance criteria that would show the drill passed.'] },
    ],
  },
  // ---------------------------------------------------------------- 23
  {
    id: 'software-architecture-ai-23',
    day: 23,
    title: 'Message Queues and Event-Based Communication',
    summary: 'Move slow or unreliable work behind a queue, and design for at-least-once delivery with idempotent consumers, dead-letter queues and an outbox.',
    intro: {
      objectives: [
        'Explain what a queue buys and what it costs in complexity, duplicates and visibility',
        'Design an idempotent consumer, and decide what happens to a message that keeps failing',
        'Describe the outbox idea and when a simple jobs table is enough',
      ],
      why: 'A queue is the standard fix for work that is slow, bursty or unreliable, and it is also a way to ship duplicate messages, lost work and silent failures. Knowing the guarantees it really gives you is what makes it safe.',
    },
    minutes: 28,
    skills: ['arch-integration'],
    body: [
      { type: 'paragraph', text: 'Some work should not happen while the user waits: sending a text, producing a report, calling a slow provider. A message queue lets one part of the system leave a note and carry on, while another part picks the note up and does the work. That separates the two in time, which is powerful and also changes the rules. This lesson covers what a queue guarantees, the failure modes that surprise people, and the simplest version that works for a small team.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'TindaTrack texts an owner when an item runs low. At first the text was sent inside the “record sale” request. When the text provider was slow, every checkout was slow. The team moved the sending behind a queue: the sale request now drops a “send text” message and returns, and a worker sends it. Checkout is fast again.' },
      { type: 'paragraph', text: 'Two weeks later an owner receives the same low-stock text three times. The worker had sent the text, and the provider had accepted it, but the worker crashed before it told the queue the job was done. The queue, doing its job, delivered the message again, twice. Each text costs the owner’s prepaid credit. At the same time, one message with a badly formatted phone number kept failing and was retried again and again, filling the worker’s time. The cost was irritated owners, wasted credit and a worker stuck on one bad message. The queue was the right tool. The team had not yet designed for what a queue actually promises.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'A **producer** puts a message on the queue. A **consumer** takes it, does the work and **acknowledges** it, which tells the queue it can forget it. What you buy is that the producer does not wait for the work, bursts are smoothed (the queue grows and the consumers catch up), and failed work can be retried. What you pay: another component to run and watch, work that finishes later rather than now, duplicate deliveries, limited ordering, and a flow that is harder to follow when something goes wrong.' },
      { type: 'paragraph', text: 'The crucial question is the delivery guarantee. **At-most-once** means a message may be lost but never repeated. **At-least-once** means it is never lost but may be repeated. Some systems advertise **exactly-once** inside their own boundary. Across your database, a queue and an outside provider, you should assume at-least-once, and make repeats harmless. Most queue services work like this: when a consumer takes a message it is hidden for a while (a visibility timeout). If the consumer does not acknowledge in time, perhaps because it crashed, the message reappears for another try. That is exactly how the same text reached the owner three times.' },
      { type: 'paragraph', text: 'An **idempotent consumer** gives the same result however many times it sees a message. Three ways to get there:' },
      { type: 'list', items: [
        '**Natural idempotence:** set a state instead of adding to it. “Mark alert 88 as sent” is safe to repeat. “Add 1 to the count of alerts” is not.',
        '**A processed-messages table:** record the message id with a unique constraint in the same transaction as the effect, and skip a message you have seen.',
        '**The provider’s own key:** if the text service accepts a client reference or idempotency key, send the message id as that key.',
      ] },
      { type: 'paragraph', text: 'Be honest about the limit. Sending a text is an outside side effect, and it cannot be part of your database transaction. If the worker crashes between sending and recording, a repeat is possible. You shrink the window (record a “sending” state first, pass the provider’s key) and decide whether a rare duplicate is acceptable for this message. A duplicate low-stock text is a nuisance. A duplicate refund is not, and for money you need the provider’s idempotency support.' },
      { type: 'paragraph', text: 'A message that always fails is a **poison message**. Retry it a limited number of times with backoff, then move it to a **dead-letter queue** (DLQ): a side queue where it waits for a person. Alert when anything lands there, find out why, fix it, and replay it. Without a limit and a DLQ, one bad message can occupy a worker forever.' },
      { type: 'paragraph', text: '**Ordering** is usually not guaranteed across the whole queue. Some services offer ordering per key, at a cost in throughput. The simplest design makes order not matter: carry the state you want (“stock of item 7 is 3”), not only a change (“minus 1”), and include a time or version so a late message can be ignored.' },
      { type: 'paragraph', text: 'Then there is the **dual-write problem** again, from lesson 16. Saving the sale and publishing the message are two separate systems. If the app crashes between them, the sale exists with no message, or the other way round. The **outbox pattern** fixes it: write the message to an outbox table in the same database transaction as the sale, and let a small relay read the outbox and publish. Because the relay may publish twice, the consumers must be idempotent, which they already are.' },
      {
        type: 'diagram',
        format: 'mermaid',
        source: 'flowchart LR\n  A[Record sale API] -->|saves sale and outbox row together| B[(Database)]\n  B -->|relay publishes| C[Queue]\n  C --> D[Text worker]\n  D -->|sends text| E[SMS provider]\n  D -->|after repeated failures| F[Dead-letter queue]\n  F --> G(Alert and review)',
        caption: 'Two places carry the safety: the outbox row is saved with the sale, and the dead-letter queue catches a message that keeps failing. The worker in the middle must tolerate seeing a message more than once.',
      },
      { type: 'paragraph', text: 'Finally, a distinction from lesson 10. A **command** says “send this text” and is handled by one consumer. An **event** says “a sale was recorded” and any number of subscribers may react. A work queue gives each message to one consumer. Publish and subscribe gives every subscriber a copy. A log, such as Apache Kafka, keeps an ordered record that consumers can read and replay. Managed queues exist on every cloud (Amazon SQS, Azure Service Bus and Google Cloud Pub/Sub are examples), and RabbitMQ is a common one you run yourself.' },
      { type: 'paragraph', text: 'For a team of two and a few hundred stores, the simplest first queue is a jobs table in the database you already run, with a worker that claims rows. In PostgreSQL, a claim query with row locks lets several workers take different rows without colliding. You build retries, backoff and the dead-letter step yourself, and the polling adds load, but you add nothing new to operate. Move to a managed queue when you need more throughput, several subscribers or a cleaner separation.' },
      { type: 'code', language: 'sql', label: 'A jobs table claim: workers skip rows another worker holds (PostgreSQL style, fragment)', code: `SELECT id, payload
FROM jobs
WHERE status = 'queued' AND run_at <= now()
ORDER BY run_at
LIMIT 1
FOR UPDATE SKIP LOCKED;` },
      { type: 'code', language: 'sql', label: 'The outbox: the message is saved with the sale, in one transaction (fragment)', code: `BEGIN;
INSERT INTO sales (id, store_id, sold_at) VALUES ($1, $2, now());
INSERT INTO outbox (id, topic, payload) VALUES ($3, 'sale.recorded', $4);
COMMIT;
-- A relay reads unsent outbox rows, publishes them and marks them sent.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In everyday words: a queue is like the order tickets at a kitchen pass. The waiter clips a ticket and goes back to the tables, and the cook takes tickets when ready. The waiter never waits for the food. If the cook is called away mid-dish, the ticket stays on the rail and another cook may start it again, which is how a dish can be made twice. So each ticket has a number and the kitchen checks it before starting. A ticket the kitchen can never make (an item they do not have) is moved to a “problem” box for the manager, so it does not block the rail. That problem box is the dead-letter queue, and the ticket number check is idempotency.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'In production, watch the numbers that show trouble: queue depth, oldest message age, retry counts and dead-letter arrivals, and alert on them. Propagate a correlation id from the original request through every message, or debugging a flow across components becomes archaeology. Size the visibility timeout to the longest legitimate processing time, or healthy work is delivered twice. Per-key ordering and fan-out have throughput and partitioning costs, so choose them per use. Test failure on purpose: kill a worker mid-message, delay acknowledgements and replay the dead-letter queue. Exactly-once claims usually mean idempotent processing inside one system boundary, so verify what the guarantee covers for your side effects.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'A queue design from an assistant, with planted problems',
        prompt: 'TindaTrack needs to send low-stock text alerts to about 200 stores. We are two developers. Design the messaging architecture.',
        output: 'I recommend an enterprise event streaming platform:\n\n1. Apache Kafka with 12 partitions and a schema registry.\n2. Event sourcing for all stock changes, with a separate microservice for each alert type.\n3. Kafka’s exactly-once semantics guarantee that no owner will ever receive a duplicate text.\n\nThis architecture can handle 1 million messages per second and is fully future-proof.',
        notice: 'Check against the requirement. About 200 stores and two developers do not need a streaming platform, event sourcing and several services, and the cost of running them is not mentioned. “Exactly-once” inside a log does not cover the text provider, an outside side effect, so duplicates are still possible. “1 million messages per second” and “future-proof” are claims with no source. Ask the assistant for the simplest design that meets the stated need, the failure modes of each part (crash before acknowledging, poison message, order) and what you would monitor.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: 'Write your own design for one slow job first: what the message says, how duplicates are handled, what happens after repeated failure and what you would watch. Then let an assistant test it.' },
      { type: 'prompt', label: 'Stress-test my queue design', text: 'I want to move [a slow or unreliable job, for example sending low-stock texts] out of the request path in [your system]. Volume: [numbers or “unknown”]. Team size: [number].\n\nMy design: the message carries [fields]. The queue is [a jobs table, or a managed queue, and why]. The consumer is made idempotent by [how]. After [number] failed attempts the message goes to [where], and [who] is alerted. I handle “the sale saved but the message was not published” by [outbox or other]. I will monitor [metrics].\n\nPlease critique this without redesigning it: (a) walk through a crash after the outside side effect but before acknowledging, and tell me what happens, (b) what a duplicate costs for this message, (c) which assumptions about ordering I made, (d) what you can not judge without my volumes and my provider’s behaviour.' },
      { type: 'paragraph', text: 'Then test it: stop a worker in the middle of a message and see what happens. Any claim from an assistant about the guarantees of a specific queue product should be checked in that product’s documentation.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: pick one slow call in a request path of your system and write what would happen to it as a queued job, including what a duplicate costs.',
        'Run a failure drill on a worker: stop it mid-message and watch whether the work repeats, and whether it is safe.',
        'Module 7 moves to the cloud, where these queues and workers run: start with “Cloud Fundamentals: Compute, Storage and Networking Across Providers”.',
        'Read your chosen queue service’s documentation on delivery guarantees, visibility timeouts and dead-letter queues before you rely on it.',
      ] },
      { type: 'takeaways', items: [
        'A queue separates producer and consumer in time: the request returns fast, bursts are smoothed and failures can be retried, at the price of duplicates and harder debugging.',
        'Design for at-least-once delivery: make consumers idempotent by state, by processed-message table or by the provider’s key.',
        'Cap retries with backoff, send poison messages to a dead-letter queue, and alert when one arrives.',
        'Use an outbox to save the message with the data in one transaction; a jobs table in your own database is a legitimate first queue.',
        'Do not rely on message order, and do not accept an exactly-once claim without checking what it covers.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-23-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Move text alerts behind a queue, safely',
          prompt: 'Build the workflow for designing and releasing the queued text alerts, using an assistant as a reviewer and keeping the safeguards.',
          concept: 'queue design review',
          situation: 'TindaTrack will send low-stock texts from a worker through a queue. A duplicate costs the owner’s credit and a stuck message can block the worker. Choose and order the steps from design to release. Use the assistant to find failure modes, but keep the decision with people.',
          parts: [
            { id: 'list-messages', lane: 'input', label: 'List each message type and what a duplicate or a loss costs', detail: 'A duplicate text is a nuisance. A duplicate refund would be a serious problem.' },
            { id: 'ai-failures', lane: 'ai', label: 'Ask AI for failure modes: crash before acknowledging, poison message, out-of-order delivery', detail: 'Give it your design and ask it to walk through each failure and list what it cannot tell.' },
            { id: 'make-idempotent', lane: 'tool', label: 'Make the consumer idempotent by recording the message id with the effect', detail: 'A repeat delivery finds the id and does nothing.' },
            { id: 'retry-dlq', lane: 'tool', label: 'Add capped retries with backoff and a dead-letter queue with an alert', detail: 'A message that keeps failing lands where a person is told about it.' },
            { id: 'failure-drill', lane: 'tool', label: 'Run a failure drill: stop the worker in the middle of a message', detail: 'Check whether the work repeats and whether the repeat is safe.' },
            { id: 'human-sign-off', lane: 'human', label: 'Decide what a duplicate costs for each message type and sign off the design', detail: 'A person accepts the remaining risks, with the assistant’s list in hand.' },
            { id: 'release', lane: 'output', label: 'Release with queue depth and dead-letter alerts switched on', detail: 'The team can see a growing queue or a bad message the day it happens.' },
            { id: 'retry-forever', lane: 'tool', label: 'Retry failed messages forever until they succeed', detail: 'No message is ever given up on.' },
            { id: 'trust-exactly-once', lane: 'ai', label: 'Trust the assistant’s claim of exactly-once delivery and skip deduplication', detail: 'The assistant says the queue never repeats messages.' },
            { id: 'release-no-alerts', lane: 'output', label: 'Release without alerts, since the queue will just work', detail: 'Nobody watches the queue or the dead-letter box.' },
          ],
          rules: [
            { id: 'r-needed', kind: 'require', parts: ['list-messages', 'ai-failures', 'make-idempotent', 'retry-dlq', 'human-sign-off'], message: 'The workflow needs the cost of a duplicate, a failure-mode review, an idempotent consumer, a capped retry with a dead-letter queue and a person’s sign-off.' },
            { id: 'r-no-forever', kind: 'forbid', parts: ['retry-forever'], message: 'Endless retries let one poison message occupy a worker forever and hammer the provider.' },
            { id: 'r-no-trust', kind: 'forbid', parts: ['trust-exactly-once'], message: 'Across a database, a queue and an outside provider, assume at-least-once, so deduplication cannot be skipped.' },
            { id: 'r-no-blind', kind: 'forbid', parts: ['release-no-alerts'], message: 'A queue that nobody watches fails silently: depth and dead-letter alerts are part of the release.' },
            { id: 'r-cost-first', kind: 'before', parts: ['list-messages', 'ai-failures'], message: 'Know what a duplicate costs first, so the review is about real stakes.' },
            { id: 'r-sign-before', kind: 'before', parts: ['human-sign-off', 'release'], message: 'A person signs off the design before it is released.' },
            { id: 'r-drill-before', kind: 'before', parts: ['failure-drill', 'release'], message: 'The failure drill happens before release, not after the first real failure.' },
          ],
          solution: ['list-messages', 'ai-failures', 'make-idempotent', 'retry-dlq', 'failure-drill', 'human-sign-off', 'release'],
          minSteps: 5,
          maxSteps: 8,
          simulation: {
            input: 'Send low-stock texts to store owners without slowing checkout.',
            steps: {
              'list-messages': 'You write that a duplicate low-stock text costs a little credit and a repeated annoyance, and a lost one means a missed restock.',
              'ai-failures': 'The assistant walks through a worker crash after sending, a malformed phone number and two alerts arriving out of order, and says it cannot know the provider’s behaviour.',
              'make-idempotent': 'The consumer records the message id in a processed table, in the same transaction as marking the alert sent.',
              'retry-dlq': 'Messages are retried five times with growing waits, then moved to a dead-letter queue that pages the team.',
              'failure-drill': 'You stop the worker mid-message and confirm the retry does not send a second text.',
              'human-sign-off': 'The team accepts a rare duplicate for this message and records the decision.',
              release: 'The queue goes live with alerts on queue depth and on the dead-letter queue.',
            },
            output: 'A queued alert flow where a repeat is harmless, a bad message is parked for a person, and the team is told when something is wrong.',
          },
          hints: [
            'Start with what a duplicate or a lost message costs for each kind of message.',
            'Three parts are tempting shortcuts: never giving up, trusting an exactly-once claim and releasing without alerts.',
            'A drill and a person’s sign-off both come before release.',
          ],
          explanation: 'The assistant helps to find failure modes, but the safeguards are structural: an idempotent consumer, a capped retry with a dead-letter queue, a drill and monitoring. A person decides which risks remain.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-23-match-1',
          kind: 'match',
          title: 'Failure to safeguard',
          prompt: 'Match each failure to the safeguard that answers it.',
          concept: 'queue safeguards',
          labels: { terms: 'Failure', meanings: 'Safeguard' },
          pairs: [
            { term: 'The worker crashes after sending a text but before acknowledging, and the message is delivered again', definition: 'An idempotent consumer', note: 'A repeat is recognised or harmless.' },
            { term: 'One message with a malformed phone number fails every time and blocks the worker', definition: 'A dead-letter queue after capped retries', note: 'The bad message is parked for a person.' },
            { term: 'The sale is saved but the app crashes before the message is published', definition: 'An outbox row saved with the sale', note: 'The message is saved in the same transaction as the data.' },
            { term: 'Two stock messages for the same item arrive in the wrong order', definition: 'Messages that carry the state and a version, not only a change', note: 'A late message can be ignored.' },
          ],
          hints: [
            'Name each failure: a repeat, a message that never succeeds, a lost publish, or wrong order.',
            'The one about the crash between saving and publishing involves two systems.',
            'The order failure is solved by what the message carries.',
          ],
          explanation: 'Each safeguard answers a specific failure that at-least-once delivery makes possible. A queue is safe once all four are designed in.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-23-q1',
        prompt: 'The same low-stock text reached an owner three times. What is the most likely cause?',
        choices: [
          'The worker sent the text but crashed before acknowledging, so the queue delivered it again and the handling was not idempotent.',
          'The text provider has a fault that always sends each message three times, whatever the sender does and however the queue is configured.',
          'The queue is broken, since a queue that works never delivers a message more than once.',
          'The owner’s phone number was registered three times in the database.',
        ],
        answer: 0,
        explanation: 'Queues usually guarantee that a message is not lost, at the cost of possible repeats. A crash before acknowledgement triggers redelivery, so the consumer must be able to handle a repeat.',
      },
      {
        id: 'software-architecture-ai-23-q2',
        prompt: 'A consumer adds 1 to an alert counter for each message. Why is this a problem, and what is the fix?',
        choices: [
          'Counters cannot be stored safely in a database, so the count should be kept in the worker’s memory instead of in a table.',
          'A redelivered message adds 1 again; record processed message ids, or set a state rather than adding to it.',
          'The counter should be updated by the producer, since consumers must never write data.',
          'Adding is slower than setting, so use a set operation to speed up the queue.',
        ],
        answer: 1,
        explanation: 'Adding is not idempotent: seeing the same message twice counts twice. Setting a state, or recording that the message id was handled, makes a repeat harmless.',
      },
      {
        id: 'software-architecture-ai-23-q3',
        prompt: 'A team of two with a few hundred stores wants to move text sending out of the request path. Which first step best fits the stated need?',
        choices: [
          'A streaming platform with several partitions, to be ready for any growth.',
          'A new microservice for each kind of alert, so teams can deploy alerts independently.',
          'A separate cloud queue per store, so that one store’s messages never mix with another’s and every store can be scaled alone.',
          'A jobs table in the existing database with a worker that claims rows, with retries and a dead-letter state.',
        ],
        answer: 3,
        explanation: 'The simplest design that meets the need adds nothing new to operate. The other options answer requirements nobody stated, and each has running costs. Revisit when volume or subscribers demand it.',
      },
      {
        id: 'software-architecture-ai-23-q4',
        prompt: 'An assistant says a log-based platform’s exactly-once semantics mean no owner will ever get a duplicate text. How should you treat that claim?',
        choices: [
          'Accept it, since the platform’s documentation describes the guarantee and the vendor has tested it at scale, so no further design work is needed.',
          'Check what the guarantee covers: it usually stops at the system’s own boundary, so the consumer still needs idempotency.',
          'Reject the platform and choose another, since exactly-once guarantees are always false.',
          'Ask for the claim to be repeated with more confidence before deciding.',
        ],
        answer: 1,
        explanation: 'A guarantee has a boundary. An outside side effect such as sending a text is beyond it, so you still design for repeats. Treat the claim as a hypothesis and read what it covers.',
      },
      {
        id: 'software-architecture-ai-23-q5',
        audience: { max: 'beginner' },
        prompt: 'In the kitchen-ticket picture, what is the “problem box” for tickets the kitchen can never make?',
        choices: [
          'The dead-letter queue, where a message that keeps failing waits for a person.',
          'The outbox, where messages are written in the same transaction as the sale before they are published.',
          'The idempotency check, which numbers every ticket.',
        ],
        answer: 0,
        explanation: 'A message that always fails is moved aside after a few tries so it does not block the rest, and a person is told about it.',
      },
      {
        id: 'software-architecture-ai-23-q6',
        audience: { min: 'advanced' },
        prompt: 'Healthy jobs are being delivered twice, and none of them crash. What should you check first?',
        choices: [
          'Whether the dead-letter queue has too many messages in it for the worker to read.',
          'Whether the messages are being sent in the wrong order by the producer.',
          'Whether the outbox relay publishes each message only once, since a relay that publishes twice is the only cause of repeats.',
          'Whether the visibility timeout is shorter than the longest legitimate processing time, so messages reappear mid-work.',
        ],
        answer: 3,
        explanation: 'If processing outlasts the visibility timeout, the queue assumes the consumer died and delivers the message again. The relay can cause repeats too, but it is not the only cause, and consumers must handle repeats whatever the source.',
      },
    ],
    task: {
      title: 'Design one queued job and break it on purpose',
      minutes: 20,
      steps: [
        'Choose one slow or unreliable call in a request path of your system (or the TindaTrack low-stock text). Write the message: its fields, whether it is a command or an event, and what a duplicate or a loss would cost.',
        'Write how the consumer is idempotent, how many retries it gets with what backoff, where a failing message goes and who is alerted.',
        'Answer in one line: what happens if the app crashes after saving the data but before publishing the message, and what stops the loss?',
        'Paste the design into the “Stress-test my queue design” prompt. Then, if you can, stop a worker in the middle of a message and record what happened.',
      ],
    },
    taskExtra: [
      { audience: { min: 'advanced' }, steps: ['Choose the metrics and alert thresholds for queue depth, oldest message age, retries and dead-letter arrivals, and write a runbook for replaying the dead-letter queue after a fix. State the visibility timeout you would choose and the measurement behind it.'] },
    ],
  },
];
