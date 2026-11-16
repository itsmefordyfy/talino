import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * AI-Assisted API Integration. The small integration used in every lesson ("Tindahan ni Ate Joy", an online sari-sari store that
 * tells customers about rain delays and texts them when the rider leaves) was built and run while this course was written
 * (Node.js 22.23, the built-in fetch and node:test, no packages): every request, response, header, log line and test result shown is real
 * output from those runs. Two services are involved. The weather calls go to Open-Meteo's real forecast API (no key; called on 2026-11-14).
 * The text-message service, "Pasa-Text", is INVENTED for this course and played by a small local fake server that follows the shapes its
 * imaginary documentation promises; it is how the course shows keys, rate limits, retries, webhooks and tests without a paid account or
 * a real phone number. Every "example AI answer" is written for this course and labelled so; none is the output of a real model.
 * Product statements live in dated `version` notes.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  rfc9110: { label: 'RFC 9110: HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
  mdnStatus: { label: 'MDN: HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status' },
  mdnFetch: { label: 'MDN: Using the Fetch API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch' },
  mdnTimeout: { label: 'MDN: AbortSignal.timeout()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static' },
  mdnRetryAfter: { label: 'MDN: Retry-After header', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After' },
  mdn429: { label: 'MDN: 429 Too Many Requests', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429' },
  nodeGlobals: { label: 'Node.js 22 docs: Globals (fetch, AbortSignal.timeout)', url: 'https://nodejs.org/docs/latest-v22.x/api/globals.html' },
  nodeCli: { label: 'Node.js 22 docs: Command-line options (--env-file)', url: 'https://nodejs.org/docs/latest-v22.x/api/cli.html' },
  nodeCrypto: { label: 'Node.js 22 docs: Crypto (createHmac, timingSafeEqual)', url: 'https://nodejs.org/docs/latest-v22.x/api/crypto.html' },
  nodeTest: { label: 'Node.js 22 docs: Test runner', url: 'https://nodejs.org/docs/latest-v22.x/api/test.html' },
  ghRateLimits: { label: 'GitHub docs: Rate limits for the REST API', url: 'https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api' },
  ghVersions: { label: 'GitHub docs: API versions', url: 'https://docs.github.com/en/rest/about-the-rest-api/api-versions' },
  ghValidate: { label: 'GitHub docs: Validating webhook deliveries', url: 'https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries' },
  ghWebhookPractices: { label: 'GitHub docs: Best practices for using webhooks', url: 'https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks' },
  ghPushProtection: { label: 'GitHub docs: About push protection', url: 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection' },
  owaspSecrets: { label: 'OWASP Cheat Sheet: Secrets Management', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html' },
  viteEnv: { label: 'Vite docs: Env variables and modes', url: 'https://vite.dev/guide/env-and-mode' },
  ccPermissions: { label: 'Claude Code docs: Configure permissions', url: 'https://code.claude.com/docs/en/permissions' },
  openapi: { label: 'OpenAPI Specification (latest)', url: 'https://spec.openapis.org/oas/latest.html' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'ai-api-integration-01',
    day: 1,
    title: 'What an API is, and why you will use many',
    summary: 'The parts of every request and answer, shown with a real call to a weather service, and the decisions about outside services that stay yours when AI writes the code.',
    minutes: 22,
    skills: ['api-basics', 'integration-workflow'],
    intro: {
      objectives: [
        'Name the parts of an API request and of the answer that comes back',
        'Make a real API call by hand and read the response, including its status code',
        'List the ways an outside service can fail your app, and decide how your app should behave before AI writes any code',
      ],
      why: 'Almost every app that takes payments, shows a map, sends a message or signs people in is really a small program that talks to other companies’ programs. AI will write that glue code in seconds, but only you can decide what the app should do when the service is slow, wrong or gone.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Ate Joy runs an online sari-sari store, Tindahan ni Ate Joy. She wants two things in her app: a note that says “Rain expected in Naga, delivery may be late”, and a text message to the customer when the rider leaves. She is not going to build a weather forecasting system or her own phone network. She will **use services** that already do those jobs, and her app will talk to them. The agreed way one program asks another program for something is called an **API** (application programming interface). Think of a carinderia counter with a menu on the wall. The menu lists what you may ask for and how, and the cook always hands it over in the same shape. You never see the kitchen. An API is that menu and that counter, for programs.',
      },
      { type: 'heading', text: 'The parts of every request and answer' },
      {
        type: 'paragraph',
        text: 'Most services you will meet speak **HTTP**, the same language browsers use. Every conversation is one **request** from your app and one **response** from the service. A request has four parts, and a response has three:',
      },
      {
        type: 'list',
        items: [
          '**URL:** the address of the service, a path to the thing you want, and often a **query** after a question mark (`?latitude=13.62`) that carries the details of your question.',
          '**Method:** what you want to do. `GET` means “let me read something”, `POST` means “here is something new”.',
          '**Headers:** small labelled notes about the request, such as who you are (an `Authorization` header carries a key) or what format you send.',
          '**Body:** the data you send, usually **JSON** (labelled text that every language can read). A `GET` usually has none.',
          '**Response:** a **status code** (a three-digit number: 2xx worked, 4xx your request was the problem, 5xx the service had the problem), response headers, and a body, usually JSON.',
        ],
      },
      { type: 'heading', text: 'A real call, by hand' },
      {
        type: 'paragraph',
        text: 'Before any AI writes code, make the call yourself. This one asks Open-Meteo, a public weather service, for the current temperature and rain at Naga City. The tool `curl` plays the app: it sends the request and prints the whole answer (`-i` includes the headers). This is the real output, run on the date of this lesson.',
      },
      {
        type: 'code',
        language: 'bash',
        label: 'The request',
        code: 'curl -i "https://api.open-meteo.com/v1/forecast?latitude=13.62&longitude=123.19&current=temperature_2m,precipitation,weather_code&timezone=Asia%2FManila"',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The response (real output)',
        code: `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
X-RateLimit-Limit: 600.0
X-RateLimit-Remaining: 598.0
X-RateLimit-Window: 60

{"latitude":13.602812,"longitude":123.16224,"timezone":"Asia/Manila","current_units":{"time":"iso8601","interval":"seconds","temperature_2m":"°C","precipitation":"mm","weather_code":"wmo code"},"current":{"time":"2026-11-14T20:15","interval":900,"temperature_2m":26.9,"precipitation":0.00,"weather_code":1}}`,
      },
      {
        type: 'paragraph',
        text: 'Read it like a form. `200 OK` says it worked. The query told the service where (`latitude`, `longitude`), what (`current=` names the three values we want) and in which clock (`timezone`). The answer repeats each value under `current` and its unit under `current_units`: 26.9 degrees and no rain. The extra `X-RateLimit-` headers are the service telling you how many calls it allows in a window of 60 seconds, 600 here, and how many you have left. You will use those in lesson 5. (A few unrelated headers were left out to keep this short.)',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Your app and the weather service never meet. Your app writes a short note, “weather for these coordinates, please”, and sends it to an address. The service writes back a note with a number on top saying how it went, then the data. `curl` is just a way to send that note from your keyboard instead of from an app. **JSON** looks like a labelled list: `"temperature_2m":26.9` means “the item called temperature_2m is 26.9”. The labels must be spelled exactly as the service spells them, because your code will look values up by label. And the **status code** is the first thing to check: 200 means the data below is what you asked for; a 400 means the data below is an explanation of what you did wrong.',
      },
      { type: 'heading', text: 'Why you will use many, and what each one costs you' },
      {
        type: 'table',
        headers: ['What the app needs', 'A service that does it', 'What you usually have to give it', 'What happens to your app if it fails'],
        rows: [
          ['Rain and temperature', 'A weather service', 'Coordinates (often no key for free services)', 'A note is missing; ordering still works'],
          ['A map and addresses', 'A maps service', 'A key, and the places you look up', 'Address entry gets harder'],
          ['Taking payment', 'A payment provider', 'A secret key, the amount and an order id', 'Nobody can pay: the most serious one'],
          ['A text when the rider leaves', 'A messaging service', 'A secret key, a phone number and the text', 'Customers are not told; the order is still fine'],
          ['Signing in', 'A sign-in provider', 'Keys, and a redirect address', 'Nobody can log in'],
        ],
        caption: 'Each row is a dependency: a part of your app that works only while somebody else’s service works. Ask of each one what the app should do without it.',
      },
      {
        type: 'paragraph',
        text: 'A service is a promise you do not control. It can be **slow** (your customer waits), **down** (no answer at all), **wrong** (an answer in a shape you did not expect), **changed** (a field renamed next year) or **limited** (it refuses you after too many calls, or charges you for them). None of this is rare, and none of it is the AI’s fault or yours. It is the cost of using something you did not build, and the reason this course exists. The design question for every integration is the one in the table’s last column: if this fails, what does Ate Joy’s customer see?',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Your own server stands between the customer and the outside service, so it can choose what to do when the service does not answer.',
        source: 'sequenceDiagram\n  participant C as Customer app\n  participant S as Your server\n  participant W as Weather service\n  C->>S: Show me the shop\n  S->>W: GET forecast for Naga\n  W-->>S: 200 and the forecast\n  S-->>C: Shop page with a rain note\n  C->>S: Show me the shop (later)\n  S->>W: GET forecast for Naga\n  W-->>S: No answer before the timeout\n  S-->>C: Shop page without the note',
      },
      { type: 'heading', text: 'What AI does here, and what stays yours' },
      {
        type: 'paragraph',
        text: 'Ask an AI tool to “call the weather API from my app” and you get working code in seconds. What it will not decide for you: whether the app needs this service at all, what personal data you are about to send to a company, what the app does when the answer never comes, and who pays when the calls add up. This course follows one routine for every service you connect: **read the documentation** (lesson 2), **keep the keys safe** (3), **make the first call** (4), **handle errors and limits** (5), **receive webhooks** (6), **test without the real thing** (7), and **ship with a runbook** (8). The AI types. You read, check and decide.',
      },
      {
        type: 'tip',
        text: 'Free public services are great for learning, but each has its own terms, such as “free for non-commercial use”. At the time of writing (2026-11-14) Open-Meteo’s documentation page said no key is needed for standard use and lists separate licences for non-commercial and commercial use. Before you rely on any service in a business, read its terms page yourself. A company’s rules are not something to take from an AI’s memory.',
      },
      {
        type: 'prompt',
        audience: { max: 'beginner' },
        label: 'A first prompt for a newcomer: understand a real response',
        text: 'I am new to APIs. Here is a real response from a weather service (paste it). Explain every part of it in plain words: the status line, each header, and each label in the JSON. Then tell me which two things I would have to check before showing the temperature to a customer. Do not write any code.',
      },
      {
        type: 'prompt',
        audience: { min: 'advanced' },
        label: 'A first prompt for an experienced developer: design the boundary first',
        text: 'I am adding a weather note to an existing Node.js service. Before writing code, propose the integration boundary: one adapter module that hides the vendor’s URL, parameters and field names, the domain type it returns, the errors it can throw (timeout, non-2xx, unexpected shape), and what the caller does in each case. List what I should cache, the timeout budget, and how I would replace this vendor later. Do not write the implementation yet.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** An integration is a coupling to a system with its own availability, rate limits, versioning and data policies, so treat it as a failure domain, not a function call. Keep the vendor’s vocabulary at the edge: one adapter owns the URL, the field names and the error shapes, and the rest of the codebase sees only your own types and your own errors. That one decision is what makes a vendor swap, a mock in tests and a circuit breaker cheap later. AI-generated glue code usually scatters raw `fetch` calls and vendor field names through the UI and handlers, so most of your review is moving that boundary back to one place. Decide the timeout budget and the degraded behaviour per call site, and note what personal data leaves your system, because that is a data-processing question as well as an engineering one.',
      },
      {
        type: 'version',
        text: 'HTTP status codes follow the class rule used here: 2xx success, 4xx a problem with the request, 5xx a problem on the server (MDN and RFC 9110). The request and response parts in this lesson are the same for every HTTP API. The response shape and rate-limit headers shown are Open-Meteo’s as returned on this date; any service can change its own shapes, which is why integrations are checked against live calls, not memory.',
        checked: CHECKED,
        sources: [DOCS.mdnStatus, DOCS.rfc9110],
      },
      {
        type: 'takeaways',
        items: [
          'An API is the agreed way one program asks another for something; most use HTTP: a URL, a method, headers and a body in, a status code and a body out.',
          'Make the first call by hand and read the whole answer, status code first, before any code is generated.',
          'Every service is a dependency you do not control: it can be slow, down, wrong, changed or limited.',
          'Decide what your app does without the service before AI writes the call; keep the vendor’s details in one place.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-01-match-1',
          kind: 'match',
          title: 'Which part of the conversation is it?',
          prompt: 'Each situation is one part of an API request or response. Match the situation to the part.',
          concept: 'parts of an HTTP request and response',
          labels: { terms: 'Situation', meanings: 'The part involved' },
          pairs: [
            { term: 'Your app tells the weather service which town to forecast by adding the coordinates after the question mark', definition: 'The query in the URL', note: 'Details of the question, added to the address after ?, are the query.' },
            { term: 'The service answers that the latitude you sent is out of range, so your request needs to change', definition: 'A 4xx status code', note: 'A number in the 400s says the request was the problem.' },
            { term: 'Your app proves who it is without putting the proof in the address', definition: 'A request header', note: 'Labelled notes about the request, such as who you are, travel in headers.' },
            { term: 'The service sends back the temperature and rain as labelled values your code will read', definition: 'The JSON response body', note: 'The data you asked for comes in the response body.' },
          ],
          hints: [
            'Ask for each one: is it part of what the app sends, or of what comes back?',
            'The part after the question mark in an address is the query; a 4xx or 5xx is a status code.',
            'Who you are is a label about the request, not the data; the data you asked for is the body.',
          ],
          explanation: 'Every API call is the same few parts. Naming the part tells you where to look when something goes wrong: a wrong query, a missing header, an error status or an unexpected body.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-01-scenario-1',
          kind: 'scenario',
          title: 'The weather service goes quiet',
          prompt: 'Choose how the shop page should behave.',
          concept: 'a service is a dependency you do not control',
          situation: 'Ate Joy’s shop page asks the weather service for a rain note every time it loads. Tonight the service is down for an hour: requests wait ten seconds and then fail. Customers are trying to order dinner.',
          options: [
            { text: 'Give the weather call a short limit, and if it fails show the shop without the rain note.', consequence: 'Customers order as usual. The note is a nice extra, so losing it for an hour costs almost nothing.', quality: 'best' },
            { text: 'Show an error page for the whole shop until the weather service is back.', consequence: 'A hundred sales are lost to protect a sentence about rain. The shop depended on something it did not need.', quality: 'poor' },
            { text: 'Keep the page loading until the weather answers, however long it takes.', consequence: 'Every customer stares at a spinner for ten seconds or more, and many leave before it ends.', quality: 'poor' },
            { text: 'Show the last forecast you saved, without saying it is old.', consequence: 'It keeps the page fast, but a customer may be told it is dry while it pours. A saved answer needs an age, or a label.', quality: 'acceptable' },
          ],
          hints: [
            'Ask how important the weather note is compared with taking an order.',
            'A slow dependency can hurt the page even if it never fully fails.',
            'Let the page work without the note, and do not make customers wait for it.',
          ],
          explanation: 'Decide per service what “without it” looks like. A weather note can disappear gracefully; a payment cannot. Deciding this before the code exists is the whole skill.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-01-predict-output-1',
          kind: 'predict-output',
          title: 'Read the labels',
          prompt: 'The text below is a shortened answer from the weather service. What does the program print?',
          concept: 'reading JSON by exact label',
          language: 'javascript',
          code: `const text = '{"current":{"temperature_2m":26.9,"precipitation":0}}';
const data = JSON.parse(text);

console.log(data.current.temperature_2m);
console.log(data.current.rain);
console.log(data.current.precipitation === 0);`,
          choices: ['26.9\nundefined\ntrue', '26.9\n0\ntrue', '26.9\nundefined\nfalse', 'undefined\nundefined\ntrue'],
          wrongNotes: {
            '26.9\n0\ntrue': 'The label rain is not in the answer, only precipitation. Looking up a label that is not there gives undefined, not zero.',
            '26.9\nundefined\nfalse': 'precipitation is the number 0, and 0 === 0 is true.',
            'undefined\nundefined\ntrue': 'temperature_2m is spelled exactly like that in the text, so the first line finds 26.9.',
          },
          hints: [
            'JSON.parse turns the text into an object you can look into with dots.',
            'Is there a label called rain anywhere in the text?',
            'A label that is not there gives undefined; the last line compares 0 with 0.',
          ],
          explanation: 'Code finds values by exact label. A guessed or misspelled label does not crash: it quietly gives undefined, which is why the next lessons make you read the real documentation and check what comes back.',
        },
      },
      {
        type: 'activity',
        activity: {
          audience: { max: 'beginner' },
          id: 'ai-api-integration-01-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Words you will meet in every lesson',
          prompt: 'Say each word in your own words, then tap the card.',
          concept: 'API vocabulary',
          cards: [
            { front: 'API', back: 'The agreed way one program asks another for something: the questions you may ask and the shape of the answers.' },
            { front: 'Request and response', back: 'One message from your app and one message back from the service. Every API conversation is a pair like this.' },
            { front: 'Status code', back: 'The three-digit number at the top of a response: 2xx worked, 4xx your request was the problem, 5xx the service had the problem.' },
            { front: 'JSON', back: 'Data written as labelled text, for example "temperature_2m":26.9. Code reads a value by its exact label.' },
          ],
          hints: ['Try to explain each word to a friend before you flip the card.'],
          explanation: 'These four words come back in every lesson of the course.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-api-integration-01-q1',
        prompt: 'Ate Joy’s weather service is down for an hour. Which design is best for the shop page?',
        choices: [
          'Show an error page for the whole shop until the weather service answers again, so nothing looks half-finished',
          'Show the shop as normal and just leave the weather note out',
          'Call the weather service again and again in a fast loop until it finally answers, however long that takes',
          'Show yesterday’s forecast as if it were today’s so that nobody notices a problem',
        ],
        answer: 1,
        explanation: 'The note is a nice extra and ordering is the job, so the page should work without it. Looping hammers a service that is already struggling, and a stale forecast presented as fresh can mislead customers.',
      },
      {
        id: 'ai-api-integration-01-q2',
        prompt: 'In the address https://api.open-meteo.com/v1/forecast?latitude=13.62&longitude=123.19, what is latitude=13.62?',
        choices: [
          'The method, which tells the service what the app wants to do with the address',
          'A header that the service reads before it looks at the rest of the address',
          'The status code that the service will use when it answers the request',
          'A query parameter: detail about the question, added after the question mark',
        ],
        answer: 3,
        explanation: 'Everything after the question mark in a URL is the query, a list of name=value details. The method is GET or POST, headers are separate labelled notes, and the status code belongs to the response.',
      },
      {
        id: 'ai-api-integration-01-q3',
        prompt: 'A call returns status 400 and a JSON body that says a value was out of range. What does that tell you?',
        choices: [
          'The request was wrong, so sending the same request again will most likely fail the same way',
          'The service crashed, so the very same request should work if you wait a moment and send it again later',
          'The network dropped the answer, so the request probably did arrive and worked fine on the service side',
          'The service is working perfectly, so the body contains the data that you asked for in the request',
        ],
        answer: 0,
        explanation: 'A 4xx status says the request was the problem, and the body explains what. Repeating an unchanged bad request just fails again; a 5xx is the status that points at the service.',
      },
      {
        id: 'ai-api-integration-01-q4',
        prompt: 'An AI tool writes code that calls a paid service on every page view, and it works. Which question matters most before you keep it?',
        choices: [
          'Whether the code uses the newest syntax that JavaScript offers, since newer syntax is always safer',
          'Whether the function names are short enough that the file is quick to scroll through',
          'How many calls it makes, what each costs, and what happens when the service says no',
          'Whether the service has a friendly logo and a clear colour scheme on its documentation page',
        ],
        answer: 2,
        explanation: 'Working on the first try says nothing about cost, limits or failure. Those are decisions about the service, and they are yours to make before the code ships.',
      },
      {
        id: 'ai-api-integration-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is an API?',
        choices: [
          'An agreed way for one program to ask another for something and understand its answer',
          'A secret password that unlocks every website on the internet for anyone who knows it',
          'A colour scheme that decides how an app looks on every phone and tablet',
        ],
        answer: 0,
        explanation: 'An API is like the menu and counter at a carinderia: it lists what you may ask for and how the answer will look, without showing you the kitchen.',
      },
      {
        id: 'ai-api-integration-01-q6',
        audience: { min: 'advanced' },
        prompt: 'An AI wrote a feature with raw fetch calls and vendor field names spread across ten files. What is the most valuable refactor?',
        choices: [
          'Rename the vendor’s fields in each of the ten files so that they all look consistent',
          'Move every call behind one adapter that returns your own types and throws your own errors',
          'Wrap each call in a try and catch that logs the error and then carries on as if it worked',
          'Replace fetch with a larger HTTP library so that every call looks the same everywhere',
        ],
        answer: 1,
        explanation: 'One adapter keeps the vendor’s URL, fields and error shapes in a single place, which makes timeouts, tests, caching and replacing the vendor changes to one module instead of ten.',
      },
    ],
    task: {
      title: 'Make a call by hand and read it',
      minutes: 15,
      steps: [
        'In a terminal, run the curl command from this lesson with the latitude and longitude of your own town (search for them). Add -i so you see the status line and headers.',
        'Write down the status code, the three values under current, and their units. Then change latitude to 913 and run it again: what status comes back, and what does the body say?',
        'Paste the successful response into an AI assistant and ask it to explain every label in plain words. Check one of its explanations against what you saw.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you cannot use a terminal, open the same address in your browser. Ask the AI: “What is the difference between what my browser shows and what an app would receive?” Write the answer in one sentence.'] },
      { audience: { min: 'advanced' }, steps: ['List every external service your current project calls. For each, write the timeout, the behaviour when it fails, and whether the vendor’s field names appear outside one module.'] },
    ],
  },
  {
    id: 'ai-api-integration-02',
    day: 2,
    title: 'Reading API docs with AI',
    summary: 'Use the real documentation as the source of truth, have AI turn it into a checkable one-page card, and catch the invented parameters AI sometimes adds.',
    minutes: 24,
    skills: ['read-api-docs', 'integration-workflow'],
    intro: {
      objectives: [
        'Find the nine things every API documentation page should tell you',
        'Turn a documentation page into an “integration card” with AI, and mark what is verified',
        'Catch a parameter or endpoint an AI invented by making one real call',
      ],
      why: 'AI learned from older copies of documentation and can sound sure about a field that does not exist. If you build on its memory, the mistake surfaces in front of customers; if you build on the page you opened and one real call, it surfaces in ten minutes.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The documentation of a service is its **contract**: what you may ask, what you must send, what comes back, and what happens when it goes wrong. An AI tool’s memory of that documentation is something else. It is a blur of every version it has read, some of it years old, and it fills gaps with plausible guesses. The guess is often a parameter that sounds right (`rain_chance`), an endpoint from an older version, or a header the service never read. The result looks like working code, so nobody doubts it. The habit that fixes this is simple: **the page you opened beats the AI’s memory, and one real call beats the page**.',
      },
      { type: 'heading', text: 'What every documentation page should tell you' },
      {
        type: 'table',
        headers: ['Section', 'The question it answers', 'What to look for'],
        rows: [
          ['Overview and base URL', 'Where do I send requests?', 'One base address, and whether there is a separate test address'],
          ['Authentication', 'How do I prove who I am?', 'Key in a header or in the address; test key and live key; what the key is allowed to do'],
          ['Endpoints', 'What can I ask for?', 'Method and path for each action'],
          ['Parameters', 'What must and may I send?', 'Required versus optional, types, limits such as 160 characters or a number range'],
          ['Example request and response', 'What does a good call look like?', 'Something you can copy, run and compare'],
          ['Errors', 'How can it fail?', 'Each status code, its meaning, and which ones are safe to retry'],
          ['Rate limits and quotas', 'How much may I ask?', 'Calls per window, what happens past it, headers that tell you'],
          ['Versioning and changelog', 'Will it change under me?', 'Which version you use, how a change is announced, how long old ones live'],
          ['Terms, pricing and data', 'May I use it this way, and what happens to my data?', 'Commercial use, what it costs per call, what it stores about your customers'],
        ],
        caption: 'Nine sections, nine questions. If a page cannot answer one of them, that is a finding in itself.',
      },
      { type: 'heading', text: 'The loop: paste, summarise, verify' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The AI summarises the page you give it; the real call decides whether the summary is right.',
        source: 'flowchart TD\n  A[Open the official docs page] --> B[Paste its text into the AI]\n  B --> C[AI writes an integration card]\n  C --> D[You make one real call by hand]\n  D --> E{Does the real answer match the card?}\n  E -->|Yes| F[Build from the card]\n  E -->|No| G[Fix the card using the real error and the page]\n  G --> D',
      },
      {
        type: 'prompt',
        label: 'The integration-card prompt (paste the documentation text where marked)',
        text: 'Below is the documentation of a service I want to call from my app. Use ONLY this text, not your memory of the service. Write an integration card with these lines: base URL; authentication; the endpoint I need (method and path); required and optional parameters with types; a success response (status and fields I will read); every error status the page mentions and what it means; rate limits; the terms that matter for a business; and a final line “Not stated on this page:” listing anything the page does not say. If something is not in the text, write “not stated”. Do not guess.\n\n[paste the documentation text here]',
      },
      {
        type: 'paragraph',
        text: 'The last line of that prompt does the most work. An AI told to fill every field will invent entries; an AI given permission to write “not stated” shows you the gaps you must close yourself. Here is the card for the weather call from lesson 1, written from the documentation page and then checked against the real calls in this lesson. It is a summary written for this course, not copied from the page.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'An integration card (the verified parts were checked with real calls)',
        code: `Service:        Open-Meteo forecast API
Base URL:       https://api.open-meteo.com/v1/forecast
Auth:           none for standard use (verified: calls work without a key)
Send:           latitude, longitude (numbers, required)
                current  = comma list of variables, e.g. temperature_2m,precipitation
                timezone = e.g. Asia/Manila (optional)
Success:        200, JSON with "current" (values) and "current_units"
Failure seen:   400 with {"error":true,"reason":"..."} (verified: latitude 913)
Limits:         response headers X-RateLimit-Limit 600 and X-RateLimit-Window 60 (verified)
Terms:          the page lists non-commercial, commercial and self-hosted licences: read the right one before a paid product
Not stated:     what to do on 429 or 5xx; a service-level promise. Treat both as unknown.`,
      },
      { type: 'heading', text: 'Catching a wrong guess' },
      {
        type: 'paragraph',
        text: 'Suppose an AI, working from memory, tells Ate Joy to ask for the chance of rain with `current=rain_chance`. It sounds right, so the code gets written. One real call shows the problem. This is the actual answer:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'A real call with a made-up variable (status 400)',
        code: `GET https://api.open-meteo.com/v1/forecast?latitude=13.62&longitude=123.19&current=rain_chance

400
{"reason":"Invalid value: Cannot initialize SurfacePressureAndHeightVariable<VariableAndPreviousDay, VariableOrSpread<ForecastPressureVariable>, ForecastHeightVariable> from invalid String value rain_chance","error":true}`,
      },
      {
        type: 'paragraph',
        text: 'Two lessons in one answer. First, the guess was wrong: the status is 400 and the value `rain_chance` is named at the end. Second, the error message itself is confusing: it talks about “SurfacePressureAndHeightVariable”, which has nothing to do with what you did. Error messages are written by the service’s developers, not for you, so read them for the part that names your input. Asking for `rain` instead returned 200 with `"rain":0.00` and a unit of `mm`. The fix was a doc lookup and ten seconds.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Pasting the documentation into the AI is like handing a helper the actual recipe card before they cook, instead of asking them to cook “the way you remember it”. The **card** is a short summary you keep next to your project, so that the AI and you work from the same facts. “Verified” means you made a real call and the answer matched. Do not worry if the documentation looks long: you do not read every line, you hunt for the nine questions in the table. If you cannot find the answer to one, write “not stated” and ask the service’s support or test it. A confident-sounding AI answer is not evidence.',
      },
      {
        type: 'paragraph',
        text: 'Some services publish their contract in a machine-readable file called an **OpenAPI** description: a JSON or YAML file that lists every endpoint, parameter and response. When one exists, give that file to the AI instead of the web page, because a file cannot be half-remembered or skimmed. Here is a tiny OpenAPI description of the one endpoint we use (written for this course, not the vendor’s own file):',
      },
      {
        type: 'code',
        language: 'json',
        label: 'A minimal OpenAPI description of one endpoint (written for this course)',
        code: JSON.stringify({
          openapi: '3.1.0',
          info: { title: 'Weather (course sample)', version: '1.0' },
          paths: {
            '/v1/forecast': {
              get: {
                parameters: [
                  { name: 'latitude', in: 'query', required: true, schema: { type: 'number', minimum: -90, maximum: 90 } },
                  { name: 'longitude', in: 'query', required: true, schema: { type: 'number', minimum: -180, maximum: 180 } },
                  { name: 'current', in: 'query', required: false, schema: { type: 'string' } },
                ],
                responses: { '200': { description: 'The forecast' }, '400': { description: 'A parameter was invalid' } },
              },
            },
          },
        }, null, 2),
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat a documentation page as a versioned artifact with an owner and a date, not as ground truth. Pin the API version the vendor offers (GitHub, for example, asks for an `X-GitHub-Api-Version` header with a date and keeps a previous version supported for at least 24 months after a new one ships), record which version your adapter was written against, and subscribe to the changelog. When an OpenAPI file exists, generate types or a client from it, but still hand-write the adapter boundary, because generated clients mirror the vendor’s model and leak it everywhere. Then add a **contract test**: a small suite that calls the real service on a schedule, not in every build, and fails when a field disappears, so drift is found by a test and not by a customer. AI is useful for drafting the card and the contract test from the spec, and unreliable as the source of either.',
      },
      {
        type: 'prompt',
        audience: { min: 'advanced' },
        label: 'A professional prompt: a card plus a contract test from a spec file',
        text: 'Here is the OpenAPI file for the vendor API I am integrating (attached). Produce (1) an integration card limited to the endpoints I list below, quoting the spec’s version, (2) a list of every response field my code will read, with its type and whether the spec marks it required, and (3) a contract test, using the Node.js built-in test runner, that calls the live service once with a known input and asserts exactly those fields and types. Mark anything the spec does not say as “not stated”. Endpoints: GET /v1/forecast.',
      },
      {
        type: 'version',
        text: 'OpenAPI is the common format for describing HTTP APIs; its latest published specification page (checked on this date) is version 3.2.1, while many vendors still publish 3.0 or 3.1 files, so state the version when you hand a file to an AI. GitHub’s REST API lets you choose a date-named version with the X-GitHub-Api-Version header and says the previous version stays supported for at least 24 more months after a new one is released; without the header it uses 2022-11-28.',
        checked: CHECKED,
        sources: [DOCS.openapi, DOCS.ghVersions],
      },
      {
        type: 'takeaways',
        items: [
          'The documentation you opened is the contract; the AI’s memory is a guess about old copies of it.',
          'Look for nine things: base URL, authentication, endpoints, parameters, examples, errors, limits, versioning and terms.',
          'Give the AI the page text or the OpenAPI file, forbid guessing, and make it list what is “not stated”.',
          'Mark each line of the card as verified only after a real call matched it; read error messages for the part that names your input.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-02-scenario-1',
          kind: 'scenario',
          title: 'An endpoint that may not exist',
          prompt: 'Choose what to do before the code is written.',
          concept: 'documentation over AI memory',
          situation: 'You ask an AI to send a text message through a provider. It writes code that posts to /v2/sms/send with a field called priority. You search the provider’s documentation and find only /v1/messages, with no field called priority anywhere.',
          options: [
            { text: 'Trust the documentation, rewrite the call to /v1/messages with the documented fields, and make one real call with a test key to confirm it.', consequence: 'The call matches the contract and the single real call proves it. The invented endpoint never reaches customers.', quality: 'best' },
            { text: 'Keep the AI’s endpoint, because the code looks professional and may be from a newer version.', consequence: 'If it is invented, every text fails with a 404 in production. Looking professional is not evidence.', quality: 'poor' },
            { text: 'Ask the AI whether it is sure, and ship if it says yes.', consequence: 'The same memory that made the guess now defends it. A second answer from the same source adds confidence, not evidence.', quality: 'poor' },
            { text: 'Paste the documentation into the AI and ask it to fix the code, then read the result against the page.', consequence: 'A good approach: the AI now works from the real contract. It is only “acceptable” until you also run one real call.', quality: 'acceptable' },
          ],
          hints: [
            'Which is closer to the truth: the page you opened, or the AI’s memory?',
            'A confident answer is not a check. What would be?',
            'Fix the code from the documentation, then prove it with one real call.',
          ],
          explanation: 'The documentation is the contract and a real call is the proof. Asking the AI to re-confirm its own guess checks nothing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-02-match-1',
          kind: 'match',
          title: 'Where in the documentation is the answer?',
          prompt: 'Match each question you have to the documentation section that answers it.',
          concept: 'sections of API documentation',
          labels: { terms: 'Your question', meanings: 'Where to look' },
          pairs: [
            { term: 'You need every status code the messaging service can return and which of them mean “try again”', definition: 'The errors section', note: 'The list of failures and their meanings is in the errors section.' },
            { term: 'You wonder if 50 customers can be texted in the same minute', definition: 'The rate limits and quotas section', note: 'How many calls are allowed in a window is the rate-limit section.' },
            { term: 'You need to know whether phone numbers must start with +63 and how long a message may be', definition: 'The parameters section', note: 'What you must send, with types and limits, is the parameters section.' },
            { term: 'You want to know whether you may use the free plan inside a paid app', definition: 'The terms and pricing section', note: 'Whether a use is allowed and what it costs is in the terms.' },
            { term: 'You want a request you can copy and run to see what a good answer looks like', definition: 'The example request and response', note: 'A runnable sample is the example section.' },
          ],
          hints: [
            'Say which of the nine sections each question is about.',
            'Limits on how much you may ask belong to one section; limits on what you may send belong to another.',
            'Rules about use and money are in the terms; runnable samples are in the examples.',
          ],
          explanation: 'Knowing which section answers a question lets you ask the AI for exactly that part of the page, and spot the sections that are missing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-02-code-challenge-1',
          kind: 'code-challenge',
          title: 'Check a request against the card',
          prompt: 'Your card says which parameters are required. Write `missingParams(required, given)`: it returns an array with the names in `required` that are not keys of the object `given`, in the order they appear in `required`.',
          concept: 'checking a request against documented parameters',
          language: 'javascript',
          starter: `function missingParams(required, given) {
  // return the names in required that are not keys of given
  return [];
}`,
          solution: `function missingParams(required, given) {
  const missing = [];
  for (const name of required) {
    if (!(name in given)) missing.push(name);
  }
  return missing;
}`,
          tests: {
            kind: 'function',
            fn: 'missingParams',
            cases: [
              { label: 'nothing missing', args: [['latitude', 'longitude'], { latitude: 13.62, longitude: 123.19 }], expected: [] },
              { label: 'one missing', args: [['latitude', 'longitude'], { latitude: 13.62 }], expected: ['longitude'] },
              { label: 'both missing, in order', args: [['latitude', 'longitude'], {}], expected: ['latitude', 'longitude'] },
              { label: 'nothing required', args: [[], { current: 'rain' }], expected: [] },
              { label: 'extra keys are fine', args: [['latitude'], { latitude: 1, current: 'rain', timezone: 'Asia/Manila' }], expected: [] },
            ],
          },
          hints: [
            'Loop over the names in required.',
            'The in operator asks whether an object has a key: "latitude" in given.',
            'Push the name onto a new array when it is not in given, and return that array.',
          ],
          explanation: 'A tiny check against the card catches a missing parameter before any network call, which is cheaper and gives a clearer error than the service’s own 400.',
        },
      },
      {
        type: 'activity',
        activity: {
          audience: { max: 'beginner' },
          id: 'ai-api-integration-02-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Documentation words',
          prompt: 'Say what each word means, then tap to check.',
          concept: 'documentation vocabulary',
          cards: [
            { front: 'Endpoint', back: 'One address-and-method that does one thing, for example “GET /v1/forecast reads a forecast”.' },
            { front: 'Parameter', back: 'A detail you send with a request, such as latitude. Required ones must be there; optional ones may be left out.' },
            { front: 'Rate limit', back: 'How many requests a service allows in a period of time before it starts refusing you.' },
            { front: 'Changelog', back: 'The service’s list of changes over time. It tells you when something you rely on is about to move.' },
          ],
          hints: ['Think of a menu: dishes (endpoints), choices for each dish (parameters), and a rule about how many you may order.'],
          explanation: 'You will meet these words in every service’s documentation.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-api-integration-02-q1',
        prompt: 'An AI suggests a parameter called rain_chance and the documentation you opened never mentions it. What is the best next step?',
        choices: [
          'Use it, because the AI has read more documentation than any person could ever read',
          'Ask the AI to repeat the answer more carefully, and use the name if the second answer agrees',
          'Search the page for the real name, then confirm it with one real call',
          'Keep both names in the code, and let the service reject whichever one is wrong',
        ],
        answer: 2,
        explanation: 'The page you opened is the contract and a real call is the proof. Repeating the question to the same source, or shipping both guesses, checks nothing.',
      },
      {
        id: 'ai-api-integration-02-q2',
        prompt: 'Why does the integration-card prompt tell the AI to use only the pasted text and to write “not stated” when something is missing?',
        choices: [
          'It makes the AI answer faster because there is less for it to remember and search',
          'It stops invented fill-in, so the gaps become visible to you',
          'It removes the need for you to read any of the documentation yourself',
          'It tells the service which version of its API your app is using',
        ],
        answer: 1,
        explanation: 'An AI asked to complete every field will guess. Permission to say “not stated” turns a hidden guess into a visible gap you can close with a real call or a question to the vendor.',
      },
      {
        id: 'ai-api-integration-02-q3',
        prompt: 'What does it mean for a line of your integration card to be “verified”?',
        choices: [
          'The AI said that it was confident about the line',
          'The same line appears in several blog posts about the service',
          'The vendor’s logo appears on the page where you found it',
          'You made a real call and the actual response matched the line',
        ],
        answer: 3,
        explanation: 'Verified means checked against reality. A confident AI or a popular blog post is still a copy of someone’s memory, while a real response is the service itself.',
      },
      {
        id: 'ai-api-integration-02-q4',
        prompt: 'You will text customers in bursts of fifty. Which documentation section decides whether that is allowed?',
        choices: [
          'The rate limits and quotas section',
          'The overview and base URL section',
          'The example request and response',
          'The changelog, because it lists recent changes',
        ],
        answer: 0,
        explanation: 'How many calls are allowed in a window, and what happens past it, is the rate-limit section. The example shows one call; it says nothing about fifty at once.',
      },
      {
        id: 'ai-api-integration-02-q5',
        audience: { max: 'beginner' },
        prompt: 'Why should you give the AI the documentation text instead of just asking it how a service works?',
        choices: [
          'Because AI is not able to answer any question about outside services at all',
          'So it works from the real, current facts, not a half-remembered older version',
          'So that the service lets you call it for free whenever you like',
        ],
        answer: 1,
        explanation: 'AI remembers a blur of older documentation. Handing it the actual page is like giving a helper the real recipe card instead of asking them to cook from memory.',
      },
      {
        id: 'ai-api-integration-02-q6',
        audience: { min: 'advanced' },
        prompt: 'A vendor publishes an OpenAPI file and you generate a client from it. Where should the vendor’s generated types still stop?',
        choices: [
          'Nowhere: pass them through the whole codebase so that there is only one model to learn',
          'At one adapter you write by hand, so a vendor change touches one module',
          'At the database, where every record should be stored exactly as the vendor sent it',
          'At the tests, which are the only code that should ever know the vendor’s field names',
        ],
        answer: 1,
        explanation: 'Generated clients mirror the vendor’s model. Keeping them behind a hand-written adapter stops that model leaking into every screen and handler, so a rename or a vendor swap is cheap.',
      },
    ],
    task: {
      title: 'Write and verify an integration card',
      minutes: 20,
      steps: [
        'Pick a service you may use (a free weather service, or any service your own project needs) and open its documentation page. Copy the text of the page that covers the call you need.',
        'Paste it into an AI assistant with the integration-card prompt from this lesson and read the card it writes. Mark each line “verified” or “not verified”.',
        'Make one real call by hand, with curl or a browser, and compare the answer with the card. Fix every line that differs, and keep the card in your project as INTEGRATION.md.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Which lines of this card would you most want me to double-check, and why?” Check the one it names first.'] },
      { audience: { min: 'advanced' }, steps: ['Add the API version your adapter targets to the card, find where the vendor announces changes, and write a one-test contract check that fails if a field you read disappears.'] },
    ],
  },
  {
    id: 'ai-api-integration-03',
    day: 3,
    title: 'Keys and secrets: where they go and where they never go',
    summary: 'What an API key lets a stranger do, the places a key must never be, how to keep it in the server’s environment, and what to do in what order when one leaks.',
    minutes: 26,
    skills: ['secrets-keys', 'integration-safety'],
    intro: {
      objectives: [
        'Explain what a stranger can do with your API key and why it must be kept secret',
        'Keep a key out of client code, the repository and the AI chat, using an environment file and a server',
        'Respond to a leaked key in the right order',
      ],
      why: 'AI assistants write the quickest code that works, and the quickest code puts the key right where it is used, which is often a web page or a mobile app that anyone can open. A leaked key on a paid service is a bill, and it is one of the most common ways small apps get hurt.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'When Ate Joy’s app calls a text-message service, the service needs to know who is asking, so it can charge the right account. The proof is an **API key**: a long string of letters and numbers, issued to you, sent with every request. The service cannot tell Ate Joy from a stranger who has a copy of her key. Whoever holds it can send messages as her, on her bill, and can often read what she has sent. A key behaves like the PIN to a bank card, so a key like that is a **secret**: keep it where only your own server can read it. The rest of this lesson is about where that is, and where it is not.',
      },
      { type: 'heading', text: 'Secret keys, publishable keys, test keys' },
      {
        type: 'paragraph',
        text: 'Not every key is a secret, and the documentation says which is which. A **secret key** can do things that cost money or change data: it lives on your server only. A **publishable** or **public** key is made to sit in a web page or an app, and the provider limits it, for example to your website’s address or your app’s identity, so a copy is of little use to a thief. Many services also give you a **test key** that works against a practice version of the service with fake money and no real messages, and a **live key** that does the real thing. The rule when the documentation does not say: treat it as secret. And always develop with test keys, so a mistake costs nothing.',
      },
      {
        type: 'table',
        headers: ['Where the key could go', 'Allowed?', 'Why'],
        rows: [
          ['The code of a web page or a mobile app', 'Never (secret keys)', 'Anyone can open a page’s code or unpack an app; the key travels to every visitor'],
          ['Your source repository, even a private one', 'Never', 'It stays in the history forever, and repositories get shared, forked and made public by accident'],
          ['A chat with an AI assistant', 'Never', 'The conversation is stored by a tool you do not control, and the key may be echoed into code'],
          ['Log files and error messages', 'Never', 'Logs are copied to dashboards, tickets and screenshots'],
          ['A local file such as .env that Git is told to ignore', 'Yes, for development, with a test key', 'It stays on your machine and out of the repository'],
          ['The server’s environment variables or a secret manager', 'Yes', 'Only your running server can read it, and it can be changed without changing code'],
        ],
        caption: 'The test is simple: who can read this place? If the answer is “anyone who gets a copy of the app, the page or the repository”, a secret key must not be there.',
      },
      { type: 'heading', text: 'The mistake AI makes, in one file' },
      {
        type: 'paragraph',
        text: 'Ask an assistant for “a function that texts the customer from the app” and the shortest thing that works is a key on the first line. Here is that draft, kept in a file called App.jsx, together with a one-minute scan of the project that finds it. The key is an obviously fake example, shaped like a real one.',
      },
      {
        type: 'code',
        language: 'jsx',
        label: 'App.jsx: the first draft (the key is a fake example)',
        code: `const SMS_KEY = 'pt_live_EXAMPLE0000abcd';

export async function notify(to, body) {
  return fetch('https://sms.example.com/v1/messages', {
    method: 'POST',
    headers: { Authorization: \`Bearer \${SMS_KEY}\` },
    body: JSON.stringify({ to, body }),
  });
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'A secret scan of the folder (real output)',
        code: `$ node key-check.mjs App.jsx
App.jsx:1: looks like a Pasa-Text key`,
      },
      {
        type: 'paragraph',
        text: 'The scan did what GitHub’s push protection and other secret scanners do on a larger scale: it matches the shape of a key. The code is also in the wrong place in a deeper way. Build tools copy a string like this into the JavaScript that is shipped to every visitor, and the build tool Vite documents the same trap with environment variables: anything whose name starts with `VITE_` is placed into the client code, so Vite’s own guide says such variables should not hold API keys. Renaming the variable does not hide anything; moving the call to a server does.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The page asks your server; only your server talks to the service with the key. Your server must also check who is asking, which lesson 8 covers.',
        source: 'sequenceDiagram\n  participant B as Browser or phone app\n  participant S as Your server\n  participant P as Pasa-Text service\n  B->>S: POST /notify with the order id\n  S->>S: Check who is asking and read the key from the environment\n  S->>P: POST /v1/messages with the key\n  P-->>S: 201 queued\n  S-->>B: 200 Customer told',
      },
      { type: 'heading', text: 'The right shape: environment, ignore file, fail fast' },
      {
        type: 'paragraph',
        text: 'On the server the key lives in an **environment variable**: a named value that the operating system hands to a running program, outside the code. During development you keep your variables in a plain file named `.env`, and you tell Git to ignore it. Three small files do the whole job. Here is the real set from the course project, and what each does.',
      },
      {
        type: 'code',
        language: 'text',
        label: '.env (never committed; the values are fake examples)',
        code: `SMS_API_KEY=pt_test_EXAMPLE0000abcd
SMS_WEBHOOK_SECRET=whsec_EXAMPLE`,
      },
      {
        type: 'code',
        language: 'text',
        label: '.gitignore and .env.example',
        code: `# .gitignore
.env
.env.*
!.env.example

# .env.example (committed: the names, never the values)
SMS_API_KEY=
SMS_WEBHOOK_SECRET=`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'config.mjs: read the variables once, and stop at once if one is missing',
        code: `export function loadConfig(env = process.env) {
  const missing = ['SMS_API_KEY', 'SMS_WEBHOOK_SECRET'].filter((name) => !env[name]);
  if (missing.length > 0) throw new Error(\`Missing environment variables: \${missing.join(', ')}\`);
  return { smsApiKey: env.SMS_API_KEY, webhookSecret: env.SMS_WEBHOOK_SECRET };
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Running it without and with the file (real output; stack lines removed)',
        code: `$ node start.mjs
Error: Missing environment variables: SMS_API_KEY, SMS_WEBHOOK_SECRET

$ node --env-file=.env start.mjs
config loaded, key ends in abcd

$ git add -A && git status --short
A  .env.example
A  .gitignore`,
      },
      {
        type: 'paragraph',
        text: 'Read the last block as three proofs. Without the file the program refuses to start and says exactly what is missing, which is better than failing at 2 a.m. when the first customer orders. With `--env-file=.env` (a flag of Node.js 22 itself, no package needed) the values load. And in the Git status, only the **names** file `.env.example` and `.gitignore` were staged: the real `.env`, copied into the same folder, was left out. The program also prints only the last four characters of the key, never the whole thing: a secret should not appear in a log, even a friendly one.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** An *environment variable* is a note pinned to the server that says, for example, “SMS_API_KEY is this value”. Your program reads the note when it starts, so the secret is never written inside the program. The `.env` file is just a handy place to keep those notes on your own laptop. `.gitignore` is a list that tells Git, the tool that records every version of your project, “do not record these files”, so the secret never reaches the shared history. In `config.mjs`: the first line lists the notes the program needs; `filter` keeps the ones that are missing; if any are missing it stops with a clear message; otherwise it hands the values to the rest of the program under friendlier names. That is the whole trick.',
      },
      { type: 'heading', text: 'Working with AI tools without leaking' },
      {
        type: 'list',
        items: [
          '**Never paste a real key into a chat.** Tell the assistant the *name* of the variable (`process.env.SMS_API_KEY`) and that it must never print it, log it or write it into a file.',
          '**Use test keys while building.** The assistant may run your code, read your files and echo values into its output, so give it a key that costs nothing.',
          '**Fence the file off.** Claude Code, for example, lets you add a `Read` deny rule such as `Read(./.env)` in its permission settings so its file tools refuse to open the file. The documentation describes this as a best-effort block on the built-in tools that read files, and a shell command is a different tool, so treat it as a seatbelt and not as a vault: keep live keys off any machine where an agent runs.',
          '**Turn on scanning.** GitHub’s push protection blocks a push that contains a known secret pattern. The repository-level setting is off by default and has to be switched on by someone with the right role.',
        ],
      },
      {
        type: 'code',
        language: 'json',
        label: 'A Claude Code permission rule that keeps its file tools out of .env (project settings)',
        code: `{
  "permissions": {
    "deny": ["Read(./.env)", "Read(./.env.*)"]
  }
}`,
      },
      { type: 'heading', text: 'When a key leaks: the order matters' },
      {
        type: 'paragraph',
        text: 'Sooner or later a key ends up somewhere it should not: in a commit, a screenshot, a chat. The instinct is to delete it, and deleting is the least useful first move. Once a key has been exposed, assume someone has a copy, and OWASP’s guidance is blunt: exposed keys should be revoked immediately, and restarting an application does not revoke stolen credentials, because they stay valid until the service says otherwise. So the order is: **revoke at the provider, issue a new key, put it in the environment and redeploy, read the provider’s usage log for calls you did not make, then clean the code and history, then find out how it happened.** The activities below ask you to put those steps in order.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** A key in an environment variable is better than a key in code, but not the end of the road: OWASP’s secrets guidance notes that environment variables are visible to every process of the user and can leak into logs or crash dumps, and prefers secrets injected as files or fetched into memory by a secret manager. Scope each credential to the least it needs (one per service, per environment, with only the permissions that call uses), keep test and live in separate stores with live restricted, and design rotation as routine, not as an emergency: support two valid keys during an overlap so deploys never race the revocation. Prefer short-lived tokens where the provider offers them. Add a pre-commit or CI scan so a leak is stopped before it is pushed, and record who and what could read each secret, since after an incident your first questions are what the key could do and who had it. Brief any coding agent that runs near the repository with the same rules: no live keys, no secrets in output.',
      },
      {
        type: 'version',
        text: 'Vite documents that variables prefixed with VITE_ are exposed to client code and should not hold sensitive information such as API keys. Node.js 22 supports --env-file=file (the environment’s own value wins over the file, and a missing file is an error) and, since v22.9.0, --env-file-if-exists. GitHub push protection blocks known secret patterns before they reach a repository; repository-level protection is off by default. Claude Code’s permission rules include Read deny rules such as Read(./.env), applied on a best-effort basis to its built-in file tools. All checked on this date; each tool changes, so check its page.',
        checked: CHECKED,
        sources: [DOCS.viteEnv, DOCS.nodeCli, DOCS.ghPushProtection, DOCS.ccPermissions, DOCS.owaspSecrets],
      },
      {
        type: 'takeaways',
        items: [
          'A key is a secret: whoever holds it can act as you, and spend your money, and the service cannot tell the difference.',
          'Secret keys never go in client code, the repository, a chat or a log; they go in the server’s environment, with a .env file (ignored by Git) for development.',
          'A web or mobile app calls your server, and only the server calls the service with the key. Renaming the variable does not hide it.',
          'Fail fast on a missing variable, print at most the last few characters, and develop with test keys.',
          'When a key leaks: revoke first, then replace, then investigate, then clean up. Deleting the file is not a fix.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-03-fix-bug-1',
          kind: 'fix-bug',
          title: 'Get the key out of the code',
          prompt: 'This server file texts a customer. Tap the line that must change, then pick the fix that really keeps the key secret.',
          concept: 'keeping secrets out of code',
          language: 'javascript',
          code: `import { SMS_URL } from './config.js';

const SMS_KEY = 'pt_live_EXAMPLE0000abcd';

export async function notify(to, body) {
  const res = await fetch(SMS_URL + '/v1/messages', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + SMS_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ to, body }),
  });
  return res.json();
}`,
          bugLine: 3,
          fixes: [
            { line: "const SMS_KEY = process.env.SMS_API_KEY;", correct: true, why: 'The key is read from the server’s environment at run time, so it is not in the code or the repository.' },
            { line: "const SMS_KEY = 'pt_live_' + 'EXAMPLE0000abcd';", correct: false, why: 'Splitting the string changes how it looks, not where it lives. The key is still written in the code and the repository.' },
            { line: "const SMS_KEY = process.env.SMS_API_KEY ?? 'pt_live_EXAMPLE0000abcd';", correct: false, why: 'The fallback keeps the real key in the code, and a missing variable would be hidden instead of reported.' },
            { line: "const SMS_KEY = import.meta.env.VITE_SMS_KEY;", correct: false, why: 'Variables whose names start with VITE_ are placed into the code shipped to the browser, so this makes the key public.' },
          ],
          hints: [
            'Which line puts the secret value straight into the file?',
            'The key must come from outside the code, from the place the server reads secrets at run time.',
            'Read the value from the environment, with no fallback value written in the code.',
          ],
          explanation: 'The fix moves the secret out of the code into the environment. Hiding, splitting or defaulting the string leaves it in the repository, and a VITE_ variable is shipped to every visitor.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-03-scenario-1',
          kind: 'scenario',
          title: 'The assistant asks for your key',
          prompt: 'Choose what to do.',
          concept: 'keeping secrets out of AI chats',
          situation: 'You are testing the text-message call with an AI coding assistant. It replies: “Paste your live API key here and I will run the request to check it works.” Your project has a .env file, and the provider offers a test key.',
          options: [
            { text: 'Put a test key in .env, tell the assistant the variable name and to never print it, and let it run the test call.', consequence: 'The assistant can prove the call works, no live secret is in the chat, and if anything leaks, the key was worthless.', quality: 'best' },
            { text: 'Paste the live key, because the assistant needs it, and rotate the key afterwards.', consequence: 'The key is now in a stored conversation, and you must remember to rotate. One forgotten rotation is a live key in someone else’s system.', quality: 'poor' },
            { text: 'Paste a test key into the chat, since it is only a test key.', consequence: 'Nothing real is lost, but you have trained yourself to paste keys into chats. The habit will follow you to the day it is a live key.', quality: 'acceptable' },
            { text: 'Write the live key into the code “just for now” so the assistant can read it from the file.', consequence: 'Temporary keys in code get committed. Now it is in the repository and the history, as well as in the assistant’s view.', quality: 'poor' },
          ],
          hints: [
            'What can the assistant do without ever seeing the value?',
            'A key that costs nothing if it leaks is a very good key to hand a tool.',
            'Use a test key through the environment, and share the variable name, not the value.',
          ],
          explanation: 'The assistant needs the call to work, not to know the secret. Test keys and the environment give it that, and leave nothing to rotate.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-03-arrange-1',
          kind: 'arrange',
          title: 'A key has leaked: what first?',
          prompt: 'A live key was pushed to a public repository. Put the response in order, as the lesson gave it.',
          concept: 'responding to a leaked key',
          language: 'text',
          solution: [
            'Revoke the leaked key at the provider so it stops working',
            'Create a new key and put it in the server’s environment',
            'Redeploy so the server uses the new key',
            'Read the provider’s usage log for calls you did not make',
            'Remove the key from the code and the repository history',
            'Write down how it leaked and add a check to stop it happening again',
          ],
          reasons: [
            'Revoking comes first: until the key is dead, every minute you spend is a minute a stranger can use it.',
            'The new key has to exist before the server can use it.',
            'The server only uses the new key after a restart or redeploy that loads it.',
            'With the old key dead, the usage log shows the damage that was done and when it began.',
            'Cleaning the repository matters, but it is safe to do only after the key no longer works.',
            'The write-up and the prevention come last, so the lesson is kept and the same leak is blocked next time.',
          ],
          hints: [
            'Which step stops a stranger from using the key, right now?',
            'The new key must exist before it can be deployed, and the investigation can wait until the old key is dead.',
            'Revoke, replace, redeploy, read the log, clean up, write it down.',
          ],
          explanation: 'Revoke first, because a leaked key is live until the provider says it is not. Everything else is cleanup, and cleaning a repository does not make a copied key stop working.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-03-match-1',
          kind: 'match',
          title: 'What would you do?',
          prompt: 'Each situation needs one of these actions. Match them.',
          concept: 'where keys live in real projects',
          labels: { terms: 'Situation', meanings: 'The right move' },
          pairs: [
            { term: 'Your Expo phone app needs to send a text through the provider’s secret key', definition: 'Have the app call your own server, which holds the key', note: 'An app can be unpacked, so a secret key cannot live in it; the server holds it.' },
            { term: 'Your teammate wants the key for automated tests that run on every change', definition: 'Give the test run its own test key, stored as a secret in the build system', note: 'Tests should use a test key kept in the build system’s secret store, not a shared live key.' },
            { term: 'Your live key shows up in a screenshot you posted in a group chat', definition: 'Treat it as leaked: revoke it and issue a new one', note: 'Once seen by others, the key may have been copied; deleting the message does not undo that.' },
            { term: 'A map provider’s documentation says its key is “restricted to your app’s identity”', definition: 'It may be shipped in the app, because it is meant to be public and the provider limits it', note: 'Provider-restricted public keys are the exception, and the documentation says so.' },
          ],
          hints: [
            'First decide whether the key is a secret or a restricted public one.',
            'Anything inside an app can be read; anything seen by strangers may be copied.',
            'Secret keys stay on a server; restricted public keys may travel; a seen key is a leaked key.',
          ],
          explanation: 'The same few rules cover most cases: secrets on the server, separate test keys for tests, revoke what was exposed, and ship only what the provider says is public.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-api-integration-03-q1',
        prompt: 'Why can a secret key not be kept secret inside a mobile app?',
        choices: [
          'Anyone can unpack the app or watch what it sends, and read the key',
          'Phones are too slow to keep a long string safe in memory for long',
          'App stores delete keys they find while reviewing an app before release',
          'Keys expire after a few minutes unless the app asks for a new one',
        ],
        answer: 0,
        explanation: 'Everything shipped in an app is on the phone of whoever installs it, so it can be extracted, and the traffic can be observed. Secrets belong on a server the app calls.',
      },
      {
        id: 'ai-api-integration-03-q2',
        prompt: 'Which of these is an acceptable home for a live secret key?',
        choices: [
          'The JavaScript of the web page, shortened and scrambled so that it is hard to read',
          'A private repository, because only the people on your team can see it',
          'The server’s environment variables, or a secret manager',
          'A message to your AI assistant so that it can test the call for you',
        ],
        answer: 2,
        explanation: 'Only your running server can read its own environment, and it can change without a code change. Page code reaches every visitor, repositories are copied and shared, and chats are stored elsewhere.',
      },
      {
        id: 'ai-api-integration-03-q3',
        prompt: 'A live key was committed and pushed an hour ago. What is the right first action?',
        choices: [
          'Delete the file and push a new commit that no longer contains the key',
          'Revoke the key at the provider and issue a new one',
          'Rewrite the repository history so that the key disappears from every commit',
          'Wait a day and check the provider’s usage log for anything unusual',
        ],
        answer: 1,
        explanation: 'A pushed key must be assumed copied, and it works until the provider revokes it. Cleaning the history helps later but does not stop a copy; waiting only gives a thief time.',
      },
      {
        id: 'ai-api-integration-03-q4',
        prompt: 'A developer stores the key as VITE_SMS_KEY and reads it in a React component of a Vite project. What happens?',
        choices: [
          'The key stays private because it lives in an environment file on your laptop',
          'The key is private in production and only visible to people while developing',
          'The key is hidden because the build step shortens and scrambles the code first',
          'The value is bundled into the code every visitor downloads, so it is public',
        ],
        answer: 3,
        explanation: 'Vite places VITE_ variables into the client code and says they should not hold secrets. Being in a file on your laptop does not stop the build from copying the value into what visitors download.',
      },
      {
        id: 'ai-api-integration-03-q5',
        audience: { max: 'beginner' },
        prompt: 'What is the .gitignore file for in this lesson?',
        choices: [
          'It makes the program run faster when the keys are loaded',
          'It tells Git not to record files such as .env, so secrets stay out of the project history',
          'It keeps a safe backup copy of all of your keys',
        ],
        answer: 1,
        explanation: 'Git records every version of your files. Listing .env in .gitignore keeps the file with your keys out of that record, which is what would be shared or copied.',
      },
      {
        id: 'ai-api-integration-03-q6',
        audience: { min: 'advanced' },
        prompt: 'You must rotate a key used by ten running instances without downtime. Which plan fits?',
        choices: [
          'Change the key in the config file, redeploy everything at once and accept a few minutes of errors',
          'Revoke the old key immediately so nobody can misuse it, then issue a new one afterwards',
          'Add the new key to the repository so that every instance picks it up on its next pull',
          'Issue a second key, deploy it, confirm the old one is unused, then revoke it',
        ],
        answer: 3,
        explanation: 'Two keys valid at once means the deploy and the revocation never race, so there is no gap with failing calls. Revoking first causes an outage, and keys do not belong in the repository at all.',
      },
    ],
    task: {
      title: 'Set up secrets the safe way',
      minutes: 20,
      steps: [
        'In a scratch folder, create .env with a made-up key, .gitignore that lists .env, and .env.example with the names only. Run git init, git add -A and git status, and check that .env is not listed.',
        'Write a loadConfig function like the lesson’s that stops with a clear message when a variable is missing. Run it with and without node --env-file=.env.',
        'Ask your AI assistant for a function that sends a text message. Read what it wrote for a key written into the code, a fallback value or a key printed to a log, and fix whatever you find using the environment.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain what an environment variable is using a note pinned on a kitchen wall, then point out the line in my code that reads one.” Check that you can find that line yourself.'] },
      { audience: { min: 'advanced' }, steps: ['Add a secret scan to your pre-commit hook or CI, write down the rotation steps and who can read each production secret, and give your coding agent a deny rule for the environment file.'] },
    ],
  },
  {
    id: 'ai-api-integration-04',
    day: 4,
    title: 'Make the first call',
    summary: 'Ask AI for a first call, run it, watch it break on a bad input, and review it against a six-point checklist until it handles failure, delay and surprises.',
    minutes: 26,
    skills: ['first-call', 'integration-workflow'],
    intro: {
      objectives: [
        'Ask an AI tool for a first API call and run it against the real service',
        'Explain why fetch does not fail on a 400 and what to check instead',
        'Review generated call code with a six-point checklist and turn an answer you do not control into a value your app can trust',
      ],
      why: 'The first call an AI writes nearly always works for the good case, which hides how it fails. The failures are what customers meet, so a short checklist applied at this one moment saves most of the debugging that comes after.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The goal of a first call is small: one request, one answer, and you understand every part of it. You already did the hard part in lesson 1 by making the call by hand, so you know what a good answer looks like. Now you ask an AI tool to write the same call as code, and your job is to run it, break it on purpose and read it. Give the AI the integration card from lesson 2, not a vague request. The card already holds the base URL, the parameters and the shape of the answer, so the AI has nothing to guess.',
      },
      {
        type: 'prompt',
        label: 'The prompt for a first draft (paste your integration card where marked)',
        text: 'Using the integration card below and nothing else, write one JavaScript function getWeather(lat, lon) for Node.js 22 that calls the service with the built-in fetch (no packages) and returns the temperature and the rain amount. Keep it to one file. After the code, list anything the card does not cover that you had to assume.\n\n[paste the integration card here]',
      },
      { type: 'heading', text: 'The first draft, and where it breaks' },
      {
        type: 'paragraph',
        text: 'Here is the shape of draft you should expect, written for this course in the style an assistant produces. It is short, it reads well and it works.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'weather-draft.mjs: a typical first draft',
        code: `export async function getWeather(lat, lon) {
  const res = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current=temperature_2m,precipitation,weather_code&timezone=Asia%2FManila\`);
  const data = await res.json();
  return { tempC: data.current.temperature_2m, rainMm: data.current.precipitation };
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Running it for Naga City, then for a latitude that cannot exist (real output)',
        code: `getWeather(13.62, 123.19)
{ tempC: 26.9, rainMm: 0 }

getWeather(913.62, 123.19)
TypeError: Cannot read properties of undefined (reading 'temperature_2m')`,
      },
      {
        type: 'paragraph',
        text: 'The good case works, so the draft would pass a casual look. The bad case reveals the flaw, and the error message is no help: it talks about `undefined`, not about the service. What happened is a chain. The service answered `400` with an explanation (you saw that body in lesson 2). `fetch` did not complain, because **`fetch` only fails when the request cannot be made at all**, such as a network error. An error status like 400 or 500 is still a successful delivery of an answer, so `await fetch(...)` returns normally and you must check `res.ok` yourself (`ok` is true for statuses 200 to 299). Then `res.json()` happily read the error body, there was no `current` in it, and the crash happened one line later, far from the cause. In production this becomes a mystery bug at night.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**What the draft is doing, line by line.** `async function` marks a function that has to wait for slow things, and `await` means “pause here until the answer arrives”. The long text in backticks is the address, with the coordinates dropped in where `${lat}` and `${lon}` are. `fetch` sends the request and gives back `res`, the whole response. `res.json()` turns the answer’s text into an object you can look inside, and the last line picks two values out of it by their labels. Notice what is missing: nothing ever looks at the status code, so the code assumes every answer is a good one. That assumption is the bug.',
      },
      { type: 'heading', text: 'The six-point review' },
      {
        type: 'table',
        headers: ['Check', 'What the draft did', 'Why it matters'],
        rows: [
          ['1. Is the address built safely and the input checked?', 'Dropped the numbers into a string without checking them', 'A bad or hostile value becomes a bad request; checking first gives a clear error and spends no call'],
          ['2. Is the status checked before the body is trusted?', 'Never looked at the status', 'A 4xx or 5xx body is an explanation, not data'],
          ['3. Is there a timeout?', 'None: it would wait as long as the service does', 'A slow service must not freeze your page'],
          ['4. Is the shape of the answer checked?', 'Read data.current.temperature_2m blindly', 'Even a 200 can carry a changed or empty body'],
          ['5. Are failures named?', 'Leaked a TypeError about undefined', 'Callers need to tell “timed out” from “you sent a bad request” from “service broke”'],
          ['6. Are secrets kept out of the address and the logs?', 'No key involved yet', 'A key in the address is copied into logs and browser history; put it in a header'],
        ],
        caption: 'Use the same six checks on every first draft, from any AI tool and for any service.',
      },
      { type: 'heading', text: 'The reviewed version' },
      {
        type: 'paragraph',
        text: 'Feed the checklist back to the assistant and it produces code like this. Read it as a learner would read a recipe: what does each part guard against?',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'weather.mjs: the reviewed first call (run for this course)',
        code: `const BASE = 'https://api.open-meteo.com/v1/forecast';

export class ApiError extends Error {
  constructor(message, { status, reason } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.reason = reason;
  }
}

export function buildUrl(lat, lon) {
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) throw new RangeError('lat must be between -90 and 90');
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) throw new RangeError('lon must be between -180 and 180');
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,precipitation,weather_code',
    timezone: 'Asia/Manila',
  });
  return \`\${BASE}?\${params}\`;
}

export function parseCurrent(json) {
  const c = json?.current;
  if (!c || typeof c.temperature_2m !== 'number' || typeof c.precipitation !== 'number') {
    throw new ApiError('Unexpected response shape from the weather service');
  }
  return { tempC: c.temperature_2m, rainMm: c.precipitation, at: c.time };
}

export async function getWeather(lat, lon, { fetchImpl = fetch, timeoutMs = 5000 } = {}) {
  const url = buildUrl(lat, lon);
  let res;
  try {
    res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (cause) {
    const timedOut = cause?.name === 'TimeoutError';
    throw new ApiError(timedOut ? \`Weather service did not answer within \${timeoutMs} ms\` : 'Could not reach the weather service', { reason: cause?.name });
  }
  if (!res.ok) {
    let reason;
    try { reason = (await res.json()).reason; } catch {}
    throw new ApiError(\`Weather service answered \${res.status}\`, { status: res.status, reason });
  }
  let json;
  try {
    json = await res.json();
  } catch {
    throw new ApiError('Weather service sent something that is not JSON', { status: res.status });
  }
  return parseCurrent(json);
}`,
      },
      {
        type: 'paragraph',
        text: 'Each guard matches a row of the table. `buildUrl` validates the numbers and lets `URLSearchParams` encode the rest (check 1). The `res.ok` branch turns a 400 into an `ApiError` carrying the status and the service’s own reason (checks 2 and 5). `AbortSignal.timeout` gives the request a deadline, and a timeout surfaces as a `TimeoutError` that the code renames in plain words (checks 3 and 5). `parseCurrent` refuses an answer whose fields are missing or the wrong type (check 4): the answer is **a claim from outside your system, to be checked before it is believed**, the same idea as the trust boundary in the backend course. Three real runs show the difference:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The reviewed version, run three ways (real output)',
        code: `getWeather(13.62, 123.19)
{ tempC: 26.8, rainMm: 0, at: '2026-11-14T20:30' }

getWeather(913.62, 123.19)
RangeError: lat must be between -90 and 90

getWeather(13.62, 123.19, { timeoutMs: 300 })   // against a server that never answers
ApiError: Weather service did not answer within 300 ms (after 0.3s)`,
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**For builders.** Notice what the function hands back. It returns `{ tempC, rainMm, at }`, your own shape, not the service’s whole answer, and it throws one error type that your own code can recognise (`ApiError`), with `status` and `reason` fields. Everything else in your app should use only those. The `fetchImpl` option is the small trick that makes the next lessons possible: in a test you pass a fake function instead of the real `fetch`, and the same code runs with no network. Ask your AI tool for this shape from the start (“return a domain object, throw one error class, accept an injectable fetch”) and you will not have to refactor it later.',
      },
      { type: 'heading', text: 'A call that carries a key' },
      {
        type: 'paragraph',
        text: 'For a service that needs a key, the first call looks the same plus one header. Here are three real calls to the course’s local stand-in for the text-message service, “Pasa-Text”: a good one, one with no key, and one with a phone number that is not valid. Read the status code and the body of each, because lesson 5 is built on them.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Three calls to the local fake Pasa-Text server (real output; headers trimmed)',
        code: `POST /v1/messages   Authorization: Bearer pt_test_EXAMPLE0000abcd   {"to":"+639171234567","body":"Your order is on the way"}
HTTP/1.1 201 Created
{"id":"msg_1a535163","status":"queued","to":"+639171234567"}

POST /v1/messages   (no Authorization header)
HTTP/1.1 401 Unauthorized
{"error":{"code":"invalid_key","message":"The API key is missing or wrong"}}

POST /v1/messages   Authorization: Bearer pt_test_EXAMPLE0000abcd   {"to":"0917","body":"hi"}
HTTP/1.1 422 Unprocessable Entity
{"error":{"code":"invalid_number","message":"to must look like +639171234567"}}`,
      },
      {
        type: 'paragraph',
        text: 'The key travels in an `Authorization` header, not in the address: an address is copied into logs, browser history and error reports, while headers are not normally logged. Use the header whenever the documentation offers a choice. And note the pattern in the failures: the same shape, `{"error":{"code":"...","message":"..."}}`, with a code you can test for in your program and a message you can show a person.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Set timeouts as a budget, not a constant: a request handler that calls two services in sequence needs a deadline for the whole handler and a smaller one per call, and `AbortSignal.any` lets the caller’s own cancellation and a timeout both abort the same request. Remember that a body can be read only once, check the `Content-Type` before `json()` when a service may answer with HTML from a proxy, and release the body of responses you discard so connections are reused. Validate with a schema where the answer is large (a hand check is fine for two fields) and keep the schema next to the adapter. Send a descriptive `User-Agent` when the vendor asks for one, log status, duration and a request id but never the key or the full body of a customer’s message, and mark which calls are safe to repeat: a `GET` is, a `POST` that creates something is not, unless you give it an idempotency key (lesson 5).',
      },
      {
        type: 'version',
        text: 'MDN documents that fetch() rejects on some errors such as a network error but not when the server answers with an error status like 404, so the Response must be checked (response.ok is true for statuses in the 200 range), and that json() throws if the body is not valid JSON. AbortSignal.timeout(ms) aborts with a TimeoutError, and Node.js 22’s global fetch (based on undici) is no longer marked experimental, so no package is needed. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.mdnFetch, DOCS.mdnTimeout, DOCS.nodeGlobals],
      },
      {
        type: 'takeaways',
        items: [
          'Make the call by hand first, then give the AI your integration card and ask for one small function.',
          'fetch does not fail on a 400 or a 500: check res.ok, then read the body, then check its shape.',
          'Review every first draft against six checks: safe address and input, status, timeout, shape, named errors, no secrets in addresses or logs.',
          'Hand back your own shape and throw your own error type, so the rest of your app never touches the vendor’s details.',
          'Put keys in a header, not in the address.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-04-predict-output-1',
          kind: 'predict-output',
          title: 'Where does it crash?',
          prompt: 'This sketch mimics the first draft: it trusts whatever body arrives. What does the program print?',
          concept: 'why checking the shape of a response matters',
          language: 'javascript',
          code: `function readTemp(response) {
  return response.current.temperature_2m;
}

const good = { current: { temperature_2m: 26.9 } };
const bad = { error: true, reason: 'Latitude must be in range of -90 to 90' };

console.log(readTemp(good));
try {
  console.log(readTemp(bad));
} catch (e) {
  console.log(e.name);
}`,
          choices: ['26.9\nTypeError', '26.9\nundefined', '26.9\nRangeError', '26.9\nSyntaxError'],
          wrongNotes: {
            '26.9\nundefined': 'bad has no current at all, so asking for response.current gives undefined, and asking undefined for temperature_2m is an error, not undefined.',
            '26.9\nRangeError': 'RangeError is for a number out of an allowed range. Reading a property of undefined is a TypeError.',
            '26.9\nSyntaxError': 'A SyntaxError is a typo found before the program runs. This program runs, and fails while reading a property.',
          },
          hints: [
            'First call: good has current, so you get its temperature.',
            'Second call: does bad have a current to look inside?',
            'Looking inside undefined for a property is a TypeError.',
          ],
          explanation: 'The error body has no current, so response.current is undefined and the next dot fails with a TypeError. That is exactly how the first draft crashed: far from the real cause, which was an error response.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'What counts as success?',
          prompt: 'This helper decides whether a response succeeded. It wrongly rejects some good answers. Tap the buggy line and choose the fix that matches how response.ok works (statuses 200 to 299).',
          concept: 'checking the status before trusting the body',
          language: 'javascript',
          code: `function isOk(status) {
  return status === 200;
}`,
          bugLine: 2,
          fixes: [
            { line: '  return status >= 200 && status < 300;', correct: true, why: 'Every status from 200 up to but not including 300 is a success: 200 OK, 201 Created, 204 No Content, and so on.' },
            { line: '  return status >= 200;', correct: false, why: 'This also accepts 400 and 500, which are failures.' },
            { line: '  return status < 300;', correct: false, why: 'This accepts 100-level and any lower number, which are not success answers.' },
            { line: '  return status >= 200 && status <= 300;', correct: false, why: 'This accepts 300, a redirect, as success.' },
          ],
          hints: [
            'Which good statuses does the current line wrongly reject? Think of the status for “created”.',
            'Success is a whole range of numbers, with a lower and an upper end.',
            'Greater than or equal to 200 and less than 300.',
          ],
          explanation: 'Success is the whole 2xx family, not only 200: a text service answers 201 when a message is created. A check for exactly 200 turns a good answer into a failure.',
          tests: {
            kind: 'function',
            fn: 'isOk',
            cases: [
              { label: '200 is ok', args: [200], expected: true },
              { label: '201 is ok', args: [201], expected: true },
              { label: '204 is ok', args: [204], expected: true },
              { label: '101 is not ok', args: [101], expected: false },
              { label: '300 is not ok', args: [300], expected: false },
              { label: '400 is not ok', args: [400], expected: false },
              { label: '500 is not ok', args: [500], expected: false },
            ],
          },
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-04-code-challenge-1',
          kind: 'code-challenge',
          title: 'Check the answer before you believe it',
          prompt: 'Write `readCurrent(json)`. If `json.current` exists and both `temperature_2m` and `precipitation` are numbers, return `{ ok: true, tempC, rainMm }` using those two values. In every other case, including a missing `json`, return `{ ok: false, error: "unexpected shape" }`.',
          concept: 'validating a response shape',
          language: 'javascript',
          starter: `function readCurrent(json) {
  // return { ok: true, tempC, rainMm } for a good answer,
  // or { ok: false, error: "unexpected shape" } otherwise
  return { ok: false, error: 'unexpected shape' };
}`,
          solution: `function readCurrent(json) {
  if (!json || !json.current) return { ok: false, error: 'unexpected shape' };
  const c = json.current;
  if (typeof c.temperature_2m !== 'number' || typeof c.precipitation !== 'number') {
    return { ok: false, error: 'unexpected shape' };
  }
  return { ok: true, tempC: c.temperature_2m, rainMm: c.precipitation };
}`,
          tests: {
            kind: 'function',
            fn: 'readCurrent',
            cases: [
              { label: 'a good answer', args: [{ current: { temperature_2m: 26.9, precipitation: 0 } }], expected: { ok: true, tempC: 26.9, rainMm: 0 } },
              { label: 'an error body', args: [{ error: true, reason: 'Latitude must be in range' }], expected: { ok: false, error: 'unexpected shape' } },
              { label: 'a missing rain value', args: [{ current: { temperature_2m: 26.9 } }], expected: { ok: false, error: 'unexpected shape' } },
              { label: 'a temperature that is text, not a number', args: [{ current: { temperature_2m: '26.9', precipitation: 0 } }], expected: { ok: false, error: 'unexpected shape' } },
              { label: 'nothing at all', args: [null], expected: { ok: false, error: 'unexpected shape' } },
            ],
          },
          hints: [
            'First rule out a missing json or a missing json.current.',
            'typeof c.temperature_2m === "number" asks whether a value is a number.',
            'Return the failure object whenever a check fails, and the success object only at the end.',
          ],
          explanation: 'A response from outside is a claim. Checking it in one small function means the rest of your app only ever sees values it can trust, or one clear failure.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-04-scenario-1',
          kind: 'scenario',
          title: 'Where does the key go?',
          prompt: 'Choose how the key travels.',
          concept: 'keys in headers, not in addresses',
          situation: 'The text provider’s documentation shows two ways to send your key: in an Authorization header, or as a query parameter on the address (…/v1/messages?api_key=…). Your assistant’s draft uses the query parameter “because it is simpler to test in a browser”. Your server logs every request address.',
          options: [
            { text: 'Switch to the Authorization header, because addresses are copied into logs and error reports.', consequence: 'The key never appears in a logged address, a browser history or a pasted error. Testing takes one extra header in curl.', quality: 'best' },
            { text: 'Keep the query parameter and stop logging addresses.', consequence: 'It helps your own logs, but the address still passes through proxies, error trackers and anyone you paste an error to. Fixing the logs treats a symptom.', quality: 'acceptable' },
            { text: 'Keep the query parameter, because the documentation allows it.', consequence: 'Allowed does not mean safe. The key is now in every log line and every shared error message.', quality: 'poor' },
            { text: 'Send the key both ways, so that one of them is certain to work.', consequence: 'Doubling the exposure fixes nothing, and the leak you were avoiding is still there.', quality: 'poor' },
          ],
          hints: [
            'Where do addresses end up, once a request has been made?',
            'Headers are not normally written into logs; addresses are.',
            'Use the header the documentation offers, and keep the address free of secrets.',
          ],
          explanation: 'When the documentation offers a header and an address, choose the header. Addresses are among the most copied and logged strings in any system.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-api-integration-04-q1',
        prompt: 'await fetch(url) returns a Response whose status is 400. What has happened?',
        choices: [
          'fetch has rejected the promise, so the catch block of your code runs straight away',
          'res.json() will always throw, because a 400 body is never valid JSON of any kind',
          'fetch has quietly retried the request for you until the status became a success',
          'Nothing was thrown: you must check res.ok yourself',
        ],
        answer: 3,
        explanation: 'fetch rejects only when the request cannot be made, such as a network failure. An error status is still a delivered answer, so your code has to check res.ok before trusting the body.',
      },
      {
        id: 'ai-api-integration-04-q2',
        prompt: 'The status is 200, yet the draft still crashes while reading data.current.temperature_2m. What is the most likely lesson?',
        choices: [
          'A 200 can never be trusted at all, so every success should be treated as a failure',
          'Even a 200 can carry a changed or empty shape, so check the shape first',
          'JSON.parse is unreliable for numbers, so every value should be read as text instead',
          'The service is the only party that can fix this, so the app should simply wait for it',
        ],
        answer: 1,
        explanation: 'A response is a claim from outside your system. Checking its shape in one place turns a mysterious crash into a clear error, and tells you quickly when the service changes.',
      },
      {
        id: 'ai-api-integration-04-q3',
        prompt: 'A first draft gives “Cannot read properties of undefined” for a bad input. Which fix addresses the real cause?',
        choices: [
          'Wrap the whole function in a try and catch that quietly returns a temperature of 0',
          'Default the temperature to 0 whenever the value is missing from the answer it got',
          'Check res.ok and throw an error naming the status and the service’s reason',
          'Remove the input that caused the problem, so that the call is never made again',
        ],
        answer: 2,
        explanation: 'The real cause is an error status that was treated as data. Naming it at the source gives a clear message; hiding it behind a fake 0 would tell customers it is freezing when the call actually failed.',
      },
      {
        id: 'ai-api-integration-04-q4',
        prompt: 'The documentation lets you send the key in a header or in the address. Which is better, and why?',
        choices: [
          'The header: addresses are copied into logs and error reports',
          'The address, because a call can then be tested by pasting it into a browser tab',
          'The address, because headers are slower to send than a query string is',
          'Both, so that a call still works if one of them is stripped out somewhere on the way',
        ],
        answer: 0,
        explanation: 'Addresses are among the most copied and logged strings in a system. A header keeps the key out of them, at the cost of one extra line in a test.',
      },
      {
        id: 'ai-api-integration-04-q5',
        audience: { max: 'beginner' },
        prompt: 'What does res.ok tell you?',
        choices: [
          'Whether your internet connection is switched on and working',
          'Whether the answer’s text is written as valid JSON that code can read',
          'Whether the status code was in the 200s, which means the call succeeded',
        ],
        answer: 2,
        explanation: 'res.ok is true for statuses 200 to 299. It is the first thing to check before you read the data, because a 400 or 500 carries an explanation, not the data you asked for.',
      },
      {
        id: 'ai-api-integration-04-q6',
        audience: { min: 'advanced' },
        prompt: 'A request handler must answer within three seconds and calls two services one after the other. What is the sound approach?',
        choices: [
          'Give each call a short timeout under one overall deadline, and degrade when time runs out',
          'Use no timeouts at all, because the platform cuts a slow request off anyway after a while',
          'Set both timeouts to three seconds, so that each service gets the full time budget',
          'Retry both calls up to five times so that a slow service eventually does answer',
        ],
        answer: 0,
        explanation: 'Sequential calls share one budget, so each needs a smaller limit under a whole-handler deadline, plus a plan for when one fails. Three seconds each can add up to six, and retries only make a slow service slower.',
      },
    ],
    task: {
      title: 'Break your own first call',
      minutes: 20,
      steps: [
        'Give an AI assistant your integration card from lesson 2 and the first-draft prompt. Run its function with a good input, then with a bad one (an impossible value), and note the error that comes out.',
        'Ask the assistant to apply the six-point review to its own code and fix it, then read the new version against the table and tick each of the six checks yourself.',
        'Add a fourth run with a timeout of 1 millisecond (or an address that does not exist) and confirm that you get a clear error message, not a crash.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain each line of this function in plain words, and tell me what each guard protects against.” Then write one sentence about why the status check comes before reading the data.'] },
      { audience: { min: 'advanced' }, steps: ['Add a contract test that calls the real service once, behind an environment switch, and asserts the two fields and their types, and give the call a deadline that is derived from the caller’s overall budget.'] },
    ],
  },
  {
    id: 'ai-api-integration-05',
    day: 5,
    title: 'Errors, limits and retries',
    summary: 'Sort failures into the ones worth retrying and the ones that are not, read the service’s own hints about limits, and retry with a wait, a cap and a safe repeat key.',
    minutes: 28,
    skills: ['errors-retries', 'integration-safety'],
    intro: {
      objectives: [
        'Decide from a status code whether a failed call should be retried, fixed or reported',
        'Retry with a growing wait, a hard limit and the service’s Retry-After hint',
        'Explain why a repeated message needs an idempotency key',
      ],
      why: 'An integration spends most of its life handling things that go wrong. AI drafts retry in one of two ways, never or forever, and both cost you: the first drops customers’ messages, the second turns a short outage into a flood that keeps the service down.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A call can fail in many ways, and they are not the same kind of failure. Some are your fault and will fail the same way every time: a bad phone number, a wrong key. Some are the service’s fault and pass by themselves: a busy server, a dropped connection. And one is a request to slow down. A good integration sorts failures into these groups, and treats each one differently: **fix and report** the first kind, **wait and try again** the second, **obey** the third. The status code is how you sort them, and this lesson turns that into code, using the stand-in text service from lesson 4.',
      },
      {
        type: 'table',
        headers: ['Answer', 'What it means', 'What your code should do'],
        rows: [
          ['400, 422', 'Your request is wrong (bad JSON, an invalid phone number)', 'Do not retry: the same request fails the same way. Fix the input, show the person a clear message'],
          ['401, 403', 'The key is missing, wrong or not allowed', 'Do not retry. This is a setup problem: alert a person, never spin'],
          ['404', 'The thing or the address does not exist', 'Do not retry; check the address or the id you were given'],
          ['408, network error, no answer', 'The request may not have arrived, or the answer got lost', 'Retry with a wait and a limit, and only if repeating is safe (see idempotency below)'],
          ['429', 'You are sending too many requests', 'Wait for the time in the Retry-After header if there is one, then try again slowly'],
          ['500, 502, 503, 504', 'The service had a problem', 'Retry with a growing wait and a limit; they often pass'],
        ],
        caption: 'The class of the status already tells you most of what you need: 4xx is mostly “fix it”, 5xx is mostly “try again”. 408 and 429 are the 4xx exceptions that are worth waiting for.',
      },
      { type: 'heading', text: 'Limits: the service tells you how much it will take' },
      {
        type: 'paragraph',
        text: 'Almost every service limits how many requests you may send in a window of time, and many tell you where you stand. Here are the real headers from an unauthenticated call to GitHub’s public API, and from the weather service you used in lesson 1. The names differ, the idea is the same: a limit, what is left and when the window resets.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Rate-limit headers from two real services (real output, 2026-11-14)',
        code: `GitHub REST API (no key):                     Open-Meteo forecast API:
x-ratelimit-limit: 60                         X-RateLimit-Limit: 600.0
x-ratelimit-remaining: 56                     X-RateLimit-Remaining: 598.0
x-ratelimit-reset: 1794660978                 X-RateLimit-Window: 60
x-ratelimit-resource: core`,
      },
      {
        type: 'paragraph',
        text: 'GitHub’s documentation says an unauthenticated caller gets 60 requests per hour, that `x-ratelimit-reset` is a time in seconds since 1970 (UTC) when the window resets, that going over is answered with a 403 or 429, and that you should not retry before the reset time, because continuing to make requests while rate limited may get your integration banned. When a response carries a `Retry-After` header, it gives either a number of seconds or a date, and it is the service’s own instruction for how long to wait: obey it before you use any schedule of your own.',
      },
      { type: 'heading', text: 'Retries done safely: wait, cap, remember' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Only some failures loop back, and the loop always has an end.',
        source: 'flowchart TD\n  A[Send the request] --> B{Status is 2xx?}\n  B -->|Yes| C(Done: use the answer)\n  B -->|No| D{Worth retrying: 408, 429, 5xx or no answer?}\n  D -->|No| E(Throw a clear error: fix the request or the key)\n  D -->|Yes| F{Attempts left?}\n  F -->|No| G(Throw the last error and tell a person)\n  F -->|Yes| H[Wait: Retry-After if given, else backoff]\n  H --> A',
      },
      {
        type: 'paragraph',
        text: 'Three rules keep a retry loop from doing harm. **Wait longer each time**: this is called **exponential backoff**, for example 1, 2, 4, 8 seconds, with a ceiling such as 30. It gives a struggling service room to recover. A small random extra wait, called **jitter**, is also common, so that a thousand clients do not all come back at the same second. **Cap the attempts**: a loop with no end hides a permanent fault and, when many clients do it at once, becomes a flood that keeps the service down. After a few tries, fail clearly and tell a person. And **prefer the service’s hint**: if there is a `Retry-After`, wait that long. Here are the helpers from the course project, short enough to read in full:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'sms-client.mjs, the helpers (run for this course)',
        code: `/** Seconds to wait before retry number \`attempt\` (1, 2, 3...): 1, 2, 4, 8... capped. */
export function backoffSeconds(attempt, { base = 1, cap = 30 } = {}) {
  return Math.min(cap, base * 2 ** (attempt - 1));
}

/** Retry-After is whole seconds or an HTTP date. Returns seconds to wait, or null if absent or unreadable. */
export function parseRetryAfter(value, now = Date.now()) {
  if (value == null || value === '') return null;
  if (/^\\d+$/.test(value)) return Number(value);
  const date = Date.parse(value);
  if (Number.isNaN(date)) return null;
  return Math.max(0, Math.ceil((date - now) / 1000));
}

export function isRetryable(status) {
  return status === 408 || status === 429 || (status >= 500 && status <= 599);
}`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine phoning a shop that is busy. Calling every second makes it worse; calling once, waiting a minute, then twice as long, then giving up and trying tomorrow is polite and works. That is backoff with a cap. `2 ** (attempt - 1)` means “2 multiplied by itself one fewer times than the attempt number”, so attempts 1, 2, 3, 4 wait 1, 2, 4, 8 seconds, and `Math.min(cap, …)` stops the wait from growing past the ceiling. `isRetryable` is the table above written as code: it says yes for 408, 429 and anything in the 500s, and no for everything else. `parseRetryAfter` reads the shop’s own instruction (“call back in 30 seconds”) when there is one.',
      },
      { type: 'heading', text: 'The same message must not be sent twice' },
      {
        type: 'paragraph',
        text: 'There is a trap in “just retry”. Suppose your app sends a text, the service accepts it, and the answer is lost on the way back. Your app sees no answer, retries, and the customer gets two texts, or, for a payment, is charged twice. The fix is an **idempotency key**: a unique id you generate once per message and send with every attempt, in a header. A service that supports it recognises the repeat and returns the first result instead of acting again. The stand-in service in this course supports an `Idempotency-Key` header, so the client creates one key per message and reuses it for every try. Here is the full client in action. The first two answers are scripted failures: a 429 telling it to wait 2 seconds, then a 503.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'A 429 and a 503 retried, then success; then two failures that are not retried (real output)',
        code: `{ id: 'msg_6e9ad677', status: 'queued', to: '+639171234567' }
attempt 1 failed (429), waiting 2s
slept 2s
attempt 2 failed (503), waiting 2s
slept 2s
calls received: 3 distinct idempotency keys: 1
ProviderError 401 invalid_key The API key is missing or wrong retryable: false
ProviderError 422 invalid_number to must look like +639171234567 retryable: false`,
      },
      {
        type: 'paragraph',
        text: 'Read it for what did and did not happen. The 429 carried a `Retry-After: 2` and the client waited 2 seconds, not its own 1-second schedule. The 503 had no hint, so the schedule applied (the second attempt waits 2 seconds). The “slept” lines come from a stand-in for the timer, so the run took no real time. Three calls reached the service but only one message was created, and all three used one idempotency key. The 401 and the 422 were thrown at once with `retryable: false`, so a wrong key or a bad phone number never spins. In the test run, the same file gave up after exactly three calls when the service kept answering 503 with `maxAttempts` set to 3.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Retries multiply load. If a client, a gateway and a service each make up to three attempts, one failing database call can become 27 calls, so retry at one layer, budget retries as a fraction of normal traffic and put a **circuit breaker** in front of a dependency that is clearly down. Treat jitter as standard, not optional, and treat the vendor’s `Retry-After` and reset headers as authoritative over your schedule. Keep client-side limiting for yourself too (a token bucket per vendor) so you stay below the limit instead of discovering it with 429s, and route work that exhausts its attempts to a dead-letter queue with the request id, not to a log line nobody reads. An idempotency key only protects you if it is stable across attempts and tied to the payload: generate it where the operation begins, persist it with the job, and never generate one per HTTP attempt. Count retries and 429s as metrics and alert on their rate: a rising retry rate is an early outage signal.',
      },
      {
        type: 'version',
        text: 'GitHub’s REST documentation gives unauthenticated callers 60 requests per hour, exposes x-ratelimit-limit, -remaining, -used, -reset and -resource headers, answers an overage with 403 or 429, says to wait for Retry-After or the reset time and to increase waits exponentially and stop after a set number of attempts. MDN documents 429 Too Many Requests and that Retry-After carries either a number of seconds or an HTTP date. The Pasa-Text idempotency header is part of the course’s invented service; real providers name and support it differently, so read each one’s documentation.',
        checked: CHECKED,
        sources: [DOCS.ghRateLimits, DOCS.mdn429, DOCS.mdnRetryAfter],
      },
      {
        type: 'takeaways',
        items: [
          'Sort failures: 4xx mostly means fix the request or the key, 5xx and no answer mean try again, 429 means slow down.',
          'Retry with a growing wait, a ceiling and a hard cap on attempts; obey Retry-After before your own schedule.',
          'Never retry a request that is wrong: it only wastes calls and can get you blocked.',
          'Send one idempotency key per message and reuse it on every try, so a retry cannot send or charge twice.',
          'When the attempts run out, fail clearly and tell a person.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-05-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the backoff schedule',
          prompt: 'Write `backoffSeconds(attempt, base, cap)`. It returns how many seconds to wait after failed attempt number `attempt` (1, 2, 3, ...): `base` seconds after the first, doubling each time, but never more than `cap`.',
          concept: 'exponential backoff with a cap',
          language: 'javascript',
          starter: `function backoffSeconds(attempt, base, cap) {
  // wait base seconds after attempt 1, double each time, never more than cap
  return base;
}`,
          solution: `function backoffSeconds(attempt, base, cap) {
  return Math.min(cap, base * Math.pow(2, attempt - 1));
}`,
          tests: {
            kind: 'function',
            fn: 'backoffSeconds',
            cases: [
              { label: 'first wait', args: [1, 1, 30], expected: 1 },
              { label: 'second wait doubles', args: [2, 1, 30], expected: 2 },
              { label: 'fourth wait', args: [4, 1, 30], expected: 8 },
              { label: 'the cap applies', args: [6, 1, 30], expected: 30 },
              { label: 'a different base', args: [3, 2, 60], expected: 8 },
              { label: 'a very late attempt stays at the cap', args: [10, 1, 30], expected: 30 },
            ],
          },
          hints: [
            'After attempt 1 the wait is base; after attempt 2 it is base times 2; after attempt 3, base times 4.',
            'Math.pow(2, attempt - 1) gives 1, 2, 4, 8 for attempts 1, 2, 3, 4.',
            'Multiply base by that, then use Math.min to keep the result at or below cap.',
          ],
          explanation: 'Doubling gives a struggling service room to recover, and the cap stops the wait from growing past what is useful. Checking the schedule as a pure function is easy, which is why the helpers are kept separate from the network code.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-05-fix-bug-1',
          kind: 'fix-bug',
          title: 'Retry only what can pass',
          prompt: 'This helper decides whether a failed call is worth retrying, and it retries every error. Tap the buggy line and choose the fix that retries only 408, 429 and the 500s.',
          concept: 'which failures to retry',
          language: 'javascript',
          code: `function shouldRetry(status) {
  return status >= 400;
}`,
          bugLine: 2,
          fixes: [
            { line: '  return status === 408 || status === 429 || (status >= 500 && status <= 599);', correct: true, why: 'This retries the timeout, the “slow down” and the server errors, and nothing else.' },
            { line: '  return status >= 500;', correct: false, why: 'This forgets 429 and 408, the 4xx answers that are worth waiting for.' },
            { line: '  return status >= 429;', correct: false, why: 'This also retries 431 and other client errors above 429, which will fail the same way again, and it misses 408.' },
            { line: '  return status === 429 || status === 503;', correct: false, why: 'Only two statuses are covered, so 500, 502 and 504 server errors are given up on too soon.' },
          ],
          hints: [
            'Retrying a 400, 401, 404 or 422 can never help. What about 429?',
            'Think of the three groups: bad request, server trouble, slow down.',
            '408 and 429, plus the whole range from 500 to 599.',
          ],
          explanation: 'Only failures that can pass by themselves are worth another try. Retrying a request that is wrong wastes calls, can lock you out and delays the error message the person needs.',
          tests: {
            kind: 'function',
            fn: 'shouldRetry',
            cases: [
              { label: '200 is not a failure', args: [200], expected: false },
              { label: '400 is not retried', args: [400], expected: false },
              { label: '401 is not retried', args: [401], expected: false },
              { label: '404 is not retried', args: [404], expected: false },
              { label: '408 is retried', args: [408], expected: true },
              { label: '422 is not retried', args: [422], expected: false },
              { label: '429 is retried', args: [429], expected: true },
              { label: '431 is not retried', args: [431], expected: false },
              { label: '500 is retried', args: [500], expected: true },
              { label: '503 is retried', args: [503], expected: true },
              { label: '599 is retried', args: [599], expected: true },
            ],
          },
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-05-match-1',
          kind: 'match',
          title: 'Retry, fix or report?',
          prompt: 'Match each failure to the right response from your code.',
          concept: 'sorting failures',
          labels: { terms: 'What happened', meanings: 'What to do' },
          pairs: [
            { term: 'The text service answers 422 invalid_number for “0917”', definition: 'Fix the input: retrying cannot help', note: 'A request that is wrong fails the same way every time.' },
            { term: 'The text service answers 401 invalid_key on every call this morning', definition: 'Fix the key or setup and alert a person', note: 'A key problem is configuration, and retrying only burns calls.' },
            { term: 'The service answers 503 with no body and no hint', definition: 'Retry with a growing wait, up to a limit', note: 'Server trouble often passes by itself, but the loop needs an end.' },
            { term: 'The service answers 429 with Retry-After: 30', definition: 'Wait the 30 seconds, then try again', note: 'The service told you how long to wait, so obey it.' },
            { term: 'The connection drops while sending a message and no answer arrives', definition: 'Retry with the same idempotency key', note: 'You do not know whether it arrived, so the repeat must be recognised.' },
          ],
          hints: [
            'First ask whether the request itself is wrong, or the setup.',
            'Server trouble and no answer are about waiting; 429 comes with its own instruction.',
            'When you are unsure whether the first try arrived, the key is what prevents a double send.',
          ],
          explanation: 'Sorting by cause is the whole skill: wrong input means fix it, wrong setup means alert, server trouble means retry with limits, a limit means wait as told, and an unknown outcome means retry safely.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-05-scenario-1',
          kind: 'scenario',
          title: 'Fifty texts and a 429',
          prompt: 'Choose how the sender behaves.',
          concept: 'respecting rate limits',
          situation: 'At 6 p.m. Ate Joy’s app sends fifty “rider is on the way” texts at once. After twelve, the service answers 429 with a header Retry-After: 30. Thirty-eight customers are still waiting.',
          options: [
            { text: 'Pause sending for 30 seconds, then send the rest at a steady pace below the limit, with each message keeping its idempotency key.', consequence: 'All fifty are sent, none twice, and the service is never pushed past its limit again.', quality: 'best' },
            { text: 'Retry each failed text immediately, up to three times, and give up on the rest.', consequence: 'Immediate retries are refused again, burn the allowance and may get the key blocked. Customers never get their texts.', quality: 'poor' },
            { text: 'Wait one second as in your normal schedule, then send all thirty-eight again at once.', consequence: 'Ignoring the 30 seconds means more 429s, and the burst repeats the original mistake.', quality: 'poor' },
            { text: 'Wait the 30 seconds, then send all thirty-eight again at once.', consequence: 'Better, since you obeyed the hint, but the same burst will probably hit the limit again. Pacing is the missing half.', quality: 'acceptable' },
          ],
          hints: [
            'What did the service tell you to do, and how long?',
            'The burst caused the problem; sending the same burst later may cause it again.',
            'Obey the wait, then slow down to a pace the limit allows.',
          ],
          explanation: 'Obey Retry-After first. Then change your behaviour so that you stay under the limit; waiting alone only delays the next 429.',
        },
      },
      {
        type: 'activity',
        activity: {
          audience: { max: 'beginner' },
          id: 'ai-api-integration-05-predict-output-1',
          kind: 'predict-output',
          title: 'The waiting schedule',
          prompt: 'This loop prints how long the client waits after each failed attempt. What does it print?',
          concept: 'reading a backoff schedule',
          language: 'javascript',
          code: `const base = 1;
const cap = 6;
for (let attempt = 1; attempt <= 5; attempt++) {
  console.log(Math.min(cap, base * Math.pow(2, attempt - 1)));
}`,
          choices: ['1\n2\n4\n6\n6', '1\n2\n3\n4\n5', '1\n2\n4\n8\n16', '2\n4\n6\n6\n6'],
          wrongNotes: {
            '1\n2\n3\n4\n5': 'The wait doubles, it does not grow by one: 1, 2, 4 and so on.',
            '1\n2\n4\n8\n16': 'Math.min with cap 6 stops the wait from growing past 6, so 8 and 16 never appear.',
            '2\n4\n6\n6\n6': 'The first wait is base itself, 1 second, since 2 to the power 0 is 1.',
          },
          hints: [
            'Attempt 1 is base times 1; then it doubles.',
            'The unrestricted waits would be 1, 2, 4, 8, 16.',
            'Math.min(6, …) turns anything above 6 into 6.',
          ],
          explanation: 'The waits double until they reach the cap and then stay there, which gives the service time to recover without making your customer wait forever.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-api-integration-05-q1',
        prompt: 'The provider answers 422 with “invalid_number”. What should your client do?',
        choices: [
          'Retry with growing waits, because errors from a service are usually only temporary',
          'Do not retry: the same request fails the same way, so report it',
          'Retry once immediately and then give up if the answer turns out to be the same',
          'Switch to a different phone number format at random until one of them works',
        ],
        answer: 1,
        explanation: 'A 422 says the request itself is wrong, so repeating it unchanged cannot succeed. Retries are for failures that can pass by themselves.',
      },
      {
        id: 'ai-api-integration-05-q2',
        prompt: 'A 429 arrives with Retry-After: 30. What should the client do?',
        choices: [
          'Retry straight away once, because a single extra call is harmless to a service',
          'Wait one second as in its usual schedule, then try the same call again',
          'Stop for good, because a 429 always means the key has been banned for ever',
          'Wait about 30 seconds, then carry on at a gentler pace',
        ],
        answer: 3,
        explanation: 'Retry-After is the service’s own instruction, so it overrides your schedule. A 429 is a request to slow down, not a ban, so after the wait you continue, more slowly.',
      },
      {
        id: 'ai-api-integration-05-q3',
        prompt: 'Why does the client send the same Idempotency-Key header on every retry of one message?',
        choices: [
          'The service recognises a repeat of a message and does not send it twice',
          'It makes the service answer faster on a retry, because it can skip checking the key again',
          'It proves to the service that the same person is still sitting at the same phone',
          'It lets the service count how many retries have happened, so that it can charge less for them',
        ],
        answer: 0,
        explanation: 'When an answer is lost, you cannot tell whether the message was accepted. A stable key lets the service return the first result instead of acting twice.',
      },
      {
        id: 'ai-api-integration-05-q4',
        prompt: 'Why should a retry loop have a maximum number of attempts?',
        choices: [
          'Because the programming language runs out of memory after a handful of retries',
          'Because every service stops answering for ever after exactly four failed calls',
          'Endless retries hide a permanent fault and pile load on a struggling service',
          'Because retries only ever work on the very first and the second attempt made',
        ],
        answer: 2,
        explanation: 'A loop with no end turns a short outage into a flood and hides problems that waiting will never fix. A cap forces a clear error that a person can act on.',
      },
      {
        id: 'ai-api-integration-05-q5',
        audience: { max: 'beginner' },
        prompt: 'What does the status code 429 mean?',
        choices: [
          'The service has crashed and will be back soon',
          'The address you used does not exist on the service',
          'You have sent too many requests recently and need to slow down',
        ],
        answer: 2,
        explanation: '429 is “Too Many Requests”. The service is working but asking you to slow down, often telling you in a Retry-After header how long to wait.',
      },
      {
        id: 'ai-api-integration-05-q6',
        audience: { min: 'advanced' },
        prompt: 'A client, a gateway and a service each make up to three attempts, and the database behind them is down. What is the worst case for one user action?',
        choices: [
          'Three calls reach the database, because only the nearest layer ever retries',
          'Up to twenty-seven calls: retry in one layer, with a budget',
          'Nine calls reach it, because the layers add together instead of multiplying them',
          'None, because a down database refuses the connections before any retry even runs',
        ],
        answer: 1,
        explanation: 'Retries multiply across layers: three attempts at each of three layers is 3 x 3 x 3. Retrying at one layer, with a retry budget and a circuit breaker, keeps a failure from becoming a flood.',
      },
    ],
    task: {
      title: 'Make your integration fail on purpose',
      minutes: 20,
      steps: [
        'Write down the status codes your service documents. For each, decide: retry, fix and report, or wait as told. Put the result in your integration card.',
        'Ask your AI assistant to write the call with the retry rules you chose: a cap on attempts, a growing wait with a ceiling, Retry-After support and one idempotency key per message. Read the code for any retry that has no end.',
        'Use a local fake (or a script that answers 429, 503 and 422 in turn) to prove each rule: count how many calls reach it, and check the second and third waits.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain exponential backoff with a story about calling a busy restaurant, then show the waits for five attempts.” Write the five numbers down.'] },
      { audience: { min: 'advanced' }, steps: ['Add jitter and a per-vendor client-side limit, send exhausted jobs to a dead-letter queue with their request id, and chart retries and 429s as metrics with an alert on the rate.'] },
    ],
  },
  {
    id: 'ai-api-integration-06',
    day: 6,
    title: 'Webhooks: when the service calls you',
    summary: 'Receive events the service sends to your address, prove they are genuine with a signature, answer quickly, and make a repeated event harmless.',
    minutes: 28,
    skills: ['webhooks', 'integration-safety'],
    intro: {
      objectives: [
        'Explain what a webhook is and why it replaces asking again and again',
        'Verify a webhook’s signature on the raw body, with a time limit and a constant-time comparison',
        'Make a handler that answers fast and applies each event once, however often it arrives',
      ],
      why: 'Many things happen after your call returns: a text is delivered, a payment clears, a build finishes. A webhook endpoint is open to the whole internet, so an AI draft that simply trusts whatever arrives lets anyone mark an order as paid.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'So far your app has been the one calling. But some news arrives later, at a time you cannot know: the text you sent was delivered, a customer’s payment went through, a delivery was refused by the phone. There are two ways to hear about it. You can **poll**: ask “delivered yet?” every few seconds, which wastes calls and still learns late. Or the service can tell you the moment it happens, by sending a request to an address you gave it, which is a **webhook**. It works like an oven timer instead of opening the oven every minute: you do not ask, it rings. The catch is in the word *address*. Your webhook address is a door on the public internet, and anyone can knock on it, pretending to be the service.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'You call first and get a quick “queued”. The real result arrives later, as a request from the service to your own address.',
        source: 'sequenceDiagram\n  participant S as Your server\n  participant P as Pasa-Text service\n  participant C as Customer phone\n  S->>P: POST /v1/messages\n  P-->>S: 201 queued\n  P->>C: Deliver the text\n  C-->>P: Delivered\n  P->>S: POST /webhooks/pasatext with message.delivered\n  S-->>P: 200 OK',
      },
      {
        type: 'table',
        headers: ['', 'Polling', 'Webhook'],
        rows: [
          ['How you learn', 'You ask on a timer', 'The service tells you when it happens'],
          ['Delay', 'Up to one polling interval', 'Almost none'],
          ['Calls and cost', 'Many calls that find nothing, which count against your limit', 'One request per event'],
          ['What you must build', 'A loop and a stop condition', 'A public address that you must defend'],
          ['Main risk', 'Hitting the rate limit', 'Fake, repeated, late or out-of-order events'],
        ],
        caption: 'Webhooks trade a rate-limit problem for a security problem. Most of this lesson is the security part.',
      },
      { type: 'heading', text: 'Rule 1: prove the event is genuine' },
      {
        type: 'paragraph',
        text: 'When you set up a webhook, the service gives you a **webhook secret**: a string that only you and the service know. With every delivery the service sends a **signature**: a fingerprint of the message, made by mixing the message with the secret using a standard recipe called **HMAC-SHA-256**. You repeat the recipe with your copy of the secret and compare. If your fingerprint matches theirs, then the sender knows the secret and the message has not been changed on the way. Anyone else cannot make a matching one. It is a wax seal that only the real sender owns. Providers choose their own header and recipe, so read the documentation: GitHub, for example, signs the raw body with HMAC-SHA-256 and sends the hex result in an `X-Hub-Signature-256` header, starting with `sha256=`. The stand-in service in this course sends `Pasatext-Signature: t=<unix time>,v1=<hex>`, where the signed text is the time, a dot and the body.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'webhook.mjs: verify before you believe (run for this course)',
        code: `import { createHmac, timingSafeEqual } from 'node:crypto';

/** Header looks like "t=1700000000,v1=<hex>". \`rawBody\` must be the exact bytes received, as a string. */
export function verifyWebhook({ secret, header, rawBody, now = Date.now(), toleranceSeconds = 300 }) {
  if (typeof header !== 'string') return { ok: false, reason: 'missing_signature' };
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')));
  const t = Number(parts.t);
  if (!Number.isInteger(t) || !parts.v1) return { ok: false, reason: 'malformed_signature' };
  if (Math.abs(now / 1000 - t) > toleranceSeconds) return { ok: false, reason: 'timestamp_too_old' };
  const expected = createHmac('sha256', secret).update(\`\${t}.\${rawBody}\`).digest();
  const received = Buffer.from(parts.v1, 'hex');
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return { ok: false, reason: 'bad_signature' };
  return { ok: true };
}`,
      },
      {
        type: 'paragraph',
        text: 'Four details are worth a slow read. The function takes the **raw body**, the exact text that arrived, because the signature was made from those exact characters. It rejects a **timestamp** more than five minutes away from now, so that a recorded genuine delivery cannot be sent again next week (a **replay**). It compares with `timingSafeEqual`, a Node.js function that takes about the same time whether the first byte or the last differs, instead of `===`, which can leak where the difference is, and GitHub’s guide asks for a constant-time comparison for the same reason. And it checks the lengths first, because `timingSafeEqual` throws a `RangeError` when the two buffers are different sizes (we ran that to be sure).',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words, line by line.** The header looks like `t=1700000000,v1=ab12…`: a time, then the fingerprint. The function splits that into its two parts (`split` cuts text at each comma, then at each equals sign). It stops if the header is missing or odd-looking. It stops if the time is too far from now. Then it makes its own fingerprint from the same ingredients: your secret, the time, a dot and the body. `digest()` turns it into raw bytes, and the received fingerprint is turned from hex text into bytes as well, so the two can be compared fairly. Only if they match does it say `ok: true`. Think of a bank checking a signature card: every step is a way to make forging harder.',
      },
      { type: 'heading', text: 'Rules 2 to 4: answer fast, once, in any order' },
      {
        type: 'list',
        items: [
          '**Answer fast.** The service waits only a short time for your “got it” and counts a slow answer as a failure. GitHub’s guidance is a 2xx within 10 seconds, with the real work done afterwards, in the background. Check the signature, store the event, answer 200, then send the email.',
          '**Apply each event once.** Services retry when they do not hear back, so the same event can arrive twice, and a redelivery keeps its identity. Every event has an id: remember the ones you have applied and, on a repeat, answer 200 without doing the work again.',
          '**Remember only after it worked.** If you write the id down first and then the work fails, the retry is wrongly ignored and the event is lost. Mark it after success.',
          '**Do not rely on order.** Events can arrive out of order. Write handlers so that a late “queued” cannot overwrite a “delivered”.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Here is a receiver built on the verify function, tested over real HTTP with five deliveries, run against a signed event of the stand-in service. Look at which ones the receiver accepts, which it refuses, and how.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Five deliveries to a real local receiver (real output)',
        code: `1. signed delivery                 200 {"ok":true}
2. the same delivery again         200 {"duplicate":true}
3. body changed after signing      400 {"error":"bad_signature"}
4. no signature header             400 {"error":"missing_signature"}
5. signed an hour ago (replay)     400 {"error":"timestamp_too_old"}
applied: [ 'message.delivered msg_6e9ad677' ]`,
      },
      {
        type: 'paragraph',
        text: 'The same event applied once, however many times it arrived. A forged body, a missing signature and a replay were all refused before anything happened. Delivery 2 is answered with 200, not an error: a duplicate is not a problem to the sender, it simply needs to stop retrying.',
      },
      { type: 'heading', text: 'The trap AI falls into most often' },
      {
        type: 'paragraph',
        text: 'Web frameworks usually parse a request’s JSON body for you before your handler runs. That is convenient everywhere except here, because parsing and writing the data back out does not reproduce the original text: spacing, key order and number formats can differ. A signature checked against the re-written body fails even for genuine events, and a developer who “fixes” that by turning verification off has opened the door to everyone. This is the proof, with the real run:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The same signature checked against the raw body and against a re-written one (real output)',
        code: `raw body       : { ok: true }
re-stringified : { ok: false, reason: 'bad_signature' }
{"id":"evt_9","type":"message.delivered"}`,
      },
      {
        type: 'prompt',
        label: 'A prompt for the receiver (paste the provider’s signature documentation where marked)',
        text: 'Write a webhook receiver in Node.js 22 using only built-in modules. Follow this provider documentation exactly for the signature header and recipe: [paste it]. Requirements: verify the signature over the RAW request body before parsing it; compare with crypto.timingSafeEqual after checking lengths; reject timestamps more than 5 minutes old; answer 400 with a short error code for an invalid delivery; skip events whose id I have already applied and answer 200; mark an id as applied only after the work succeeded; answer within seconds and do slow work after answering. Do not log the secret or the full body.',
      },
      {
        type: 'paragraph',
        text: 'When the code arrives, review it against the traps: is a body parser running before verification, is the comparison `===`, is there any timestamp check, is the event id written before the work is done, does it do slow work before answering, does it log the payload. You cannot receive deliveries from the internet on your laptop without extra tools, but you do not need to: the course project signs fake events with the same recipe and posts them to the receiver, which is how the five deliveries above were made. Many providers also have a test mode or a button that sends a sample event; check theirs.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** The in-memory set of seen ids in the lesson is the demo; in production make the dedupe atomic and durable, such as a unique constraint on the event id, inserted in the same transaction as the effect, so two concurrent deliveries cannot both apply. Acknowledge after persisting the raw event to a queue or table, and process asynchronously with retries and a dead-letter path, so a slow dependency never turns into provider retries. Treat payloads as hints: for ordering and tampering reasons many teams treat the event as a notification and re-fetch the current state from the provider’s API before acting. Accept two secrets during rotation, bound the replay window against clock skew, cap request body size before reading it, rate-limit the endpoint, and give each handler its own schema validation after the signature check, because a valid signature proves the sender, not that the data is well formed. Monitor the lag between event time and processing time and alert on bad-signature spikes.',
      },
      {
        type: 'version',
        text: 'GitHub’s documentation says to sign-check the raw payload with HMAC-SHA256, compare the hex digest with the X-Hub-Signature-256 header (value starting “sha256=”) using a constant-time comparison, and not with ==. Its best-practice guide asks for a 2XX response within 10 seconds, with slower processing done in the background, and describes the X-GitHub-Delivery header for spotting duplicate or replayed deliveries. Node.js 22’s crypto.timingSafeEqual takes buffers of equal length and throws a RangeError otherwise. The Pasa-Text signature format is invented for this course; every real provider documents its own.',
        checked: CHECKED,
        sources: [DOCS.ghValidate, DOCS.ghWebhookPractices, DOCS.nodeCrypto],
      },
      {
        type: 'takeaways',
        items: [
          'A webhook is the service calling an address you provide when something happens; it replaces polling but opens a public door.',
          'Verify the signature on the raw body, with a constant-time comparison and a time limit, before you read anything in the message.',
          'Answer with 2xx quickly and do slow work afterwards; the sender treats a slow answer as a failure.',
          'Remember event ids, apply each event once, and mark it applied only after the work succeeded.',
          'Do not depend on events arriving in order.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-06-code-challenge-1',
          kind: 'code-challenge',
          title: 'Read the signature header',
          prompt: 'Write `parseSignatureHeader(header)`. A good header looks like `"t=1700000000,v1=ab12cd"`. Return `{ t, v1 }` with `t` as a number and `v1` as text. Return `null` when the header is not a string, has no `t` or `v1`, or `t` is not a whole number. The order of the two parts may vary.',
          concept: 'parsing a webhook signature header',
          language: 'javascript',
          starter: `function parseSignatureHeader(header) {
  // return { t, v1 } or null
  return null;
}`,
          solution: `function parseSignatureHeader(header) {
  if (typeof header !== 'string') return null;
  const parts = {};
  for (const piece of header.split(',')) {
    const pair = piece.split('=');
    if (pair.length === 2) parts[pair[0]] = pair[1];
  }
  const t = Number(parts.t);
  if (!parts.t || !Number.isInteger(t) || !parts.v1) return null;
  return { t: t, v1: parts.v1 };
}`,
          tests: {
            kind: 'function',
            fn: 'parseSignatureHeader',
            cases: [
              { label: 'a good header', args: ['t=1700000000,v1=ab12cd'], expected: { t: 1700000000, v1: 'ab12cd' } },
              { label: 'parts in the other order', args: ['v1=ab12cd,t=5'], expected: { t: 5, v1: 'ab12cd' } },
              { label: 'no signature part', args: ['t=1700000000'], expected: null },
              { label: 'a time that is not a number', args: ['t=soon,v1=ab12cd'], expected: null },
              { label: 'an empty header', args: [''], expected: null },
              { label: 'no header at all', args: [undefined], expected: null },
            ],
          },
          hints: [
            'Split the header at each comma, then split each piece at the equals sign.',
            'Collect the pieces into an object, then read parts.t and parts.v1 from it.',
            'Return null unless t is a whole number (Number.isInteger) and v1 is present.',
          ],
          explanation: 'A webhook handler starts by reading its header defensively. Anything odd, such as a missing part or a time that is not a number, is refused before any signature maths runs.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-06-fix-bug-1',
          kind: 'fix-bug',
          title: 'A replay window with a hole',
          prompt: 'This helper should accept a delivery only if its timestamp is within `tolerance` seconds of now, in either direction. It lets something through that it should refuse. Tap the buggy line and choose the correct fix.',
          concept: 'rejecting replayed and far-future timestamps',
          language: 'javascript',
          code: `function isFresh(t, now, tolerance) {
  return now - t <= tolerance;
}`,
          bugLine: 2,
          fixes: [
            { line: '  return Math.abs(now - t) <= tolerance;', correct: true, why: 'The absolute difference limits how far the timestamp may be from now, in the past or in the future.' },
            { line: '  return now - t < tolerance;', correct: false, why: 'A delivery exactly at the limit is now refused, and a timestamp far in the future still passes.' },
            { line: '  return t - now <= tolerance;', correct: false, why: 'This accepts every old timestamp, because t - now is negative for the past.' },
            { line: '  return Math.abs(now - t) >= tolerance;', correct: false, why: 'The comparison is turned around: it accepts only the old and far-future timestamps.' },
          ],
          hints: [
            'Try t far in the future: what is now - t, and does it pass?',
            'You want the distance between t and now, whichever is larger.',
            'Math.abs gives that distance; the check is that it is at most the tolerance.',
          ],
          explanation: 'Without the absolute value, a timestamp in the future makes the difference negative, which is always below the tolerance. A time window must be bounded on both sides.',
          tests: {
            kind: 'function',
            fn: 'isFresh',
            cases: [
              { label: 'the same moment', args: [1000, 1000, 300], expected: true },
              { label: 'exactly at the limit, in the past', args: [700, 1000, 300], expected: true },
              { label: 'just past the limit', args: [699, 1000, 300], expected: false },
              { label: 'exactly at the limit, in the future', args: [1300, 1000, 300], expected: true },
              { label: 'far in the future', args: [5000, 1000, 300], expected: false },
            ],
          },
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-06-arrange-1',
          kind: 'arrange',
          title: 'Handle a delivery in the right order',
          prompt: 'Put the steps of a webhook handler in the order they must happen.',
          concept: 'webhook handler order',
          language: 'text',
          solution: [
            'Read the raw body exactly as it arrived',
            'Check the signature and the timestamp, and refuse with 400 if they fail',
            'Parse the JSON and check it has an event id and a type',
            'If this event id was already applied, answer 200 and stop',
            'Apply the event, or put it on a queue to be applied',
            'Remember the event id, then answer 200',
          ],
          reasons: [
            'The signature covers the exact characters received, so the raw body is the first thing to keep.',
            'Nothing in the message may be believed until it has been proven genuine and fresh.',
            'Only after the signature passes is it safe to parse the body and read its fields.',
            'The duplicate check comes before the work, so a repeat does nothing.',
            'The work or the queueing happens only for a genuine, new event.',
            'The id is remembered after success, so a failed attempt is retried; then the sender is answered.',
          ],
          hints: [
            'What must be true before you can trust anything in the message?',
            'Verify, then parse, then check for repeats, then act.',
            'Raw body, verify, parse, duplicate check, apply, remember and answer.',
          ],
          explanation: 'Each step guards the next: raw bytes make the signature checkable, a valid signature makes the content trustworthy, and the duplicate check keeps the effect single.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-06-match-1',
          kind: 'match',
          title: 'Which rule is missing?',
          prompt: 'Each situation is a webhook rule being broken. Match it to the rule that would have prevented it.',
          concept: 'webhook defences',
          labels: { terms: 'What went wrong', meanings: 'The rule that prevents it' },
          pairs: [
            { term: 'A framework parses the JSON first, and verification then fails on every genuine event', definition: 'Verify against the raw body, before parsing', note: 'Re-writing the parsed body does not reproduce the signed bytes.' },
            { term: 'The service redelivers an event after a timeout and the customer gets two texts', definition: 'Remember event ids and ignore repeats', note: 'A redelivery keeps its identity, so the id is how you spot it.' },
            { term: 'Someone records a real delivery and sends it again next week', definition: 'Reject timestamps outside a short window', note: 'A time limit makes an old recording worthless.' },
            { term: 'Your handler sends emails and the service gives up before you answer', definition: 'Answer quickly, then do slow work afterwards', note: 'A slow answer counts as a failure, so the sender retries.' },
            { term: 'A comparison with === shows an attacker, one character at a time, how close a guess was', definition: 'Compare signatures in constant time', note: 'A constant-time comparison does not leak where two values differ.' },
          ],
          hints: [
            'Match the failure to its cause: wrong bytes, repeat, replay, slowness or leaking comparison.',
            'The same event twice is about identity; the same delivery later is about time.',
            'Slow handlers and fast answers are a pair; === and constant-time are a pair.',
          ],
          explanation: 'Each rule closes one specific hole. Knowing the hole each one closes lets you review an AI draft for the ones it left open.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-06-scenario-1',
          kind: 'scenario',
          title: 'A failed attempt is ignored',
          prompt: 'Choose the safest design.',
          concept: 'applying events exactly once',
          situation: 'Your handler first writes the event id to its “seen” list, and then updates the order and sends the customer a message. One night the database is briefly down: the update fails, the service retries the event five minutes later, and your handler answers “duplicate” without doing anything. The order stays “queued” for ever.',
          options: [
            { text: 'Record the event id only after the work succeeds, ideally in the same transaction as the order update, so a failed attempt can be retried.', consequence: 'The failure leaves no mark, the retry does the work, and two simultaneous deliveries cannot both apply.', quality: 'best' },
            { text: 'Stop checking for duplicates, since retries should just do the work again.', consequence: 'Now genuine repeats send two messages and charge twice. The cure is worse than the problem.', quality: 'poor' },
            { text: 'Keep the order, but add a nightly job that finds orders stuck in “queued” and fixes them by hand.', consequence: 'It repairs the damage later, but the cause is still there and customers wait until the job runs.', quality: 'acceptable' },
            { text: 'Answer with an error when the database is down, but still write the id first.', consequence: 'The sender retries, the id is already there, and the retry is ignored again. The error answer changes nothing.', quality: 'poor' },
          ],
          hints: [
            'When exactly does the handler decide that the event has been dealt with?',
            'A failed attempt must leave no trace that says “done”.',
            'Mark the event as applied only after the effect has really happened.',
          ],
          explanation: 'The mark that says “handled” must follow the work, not precede it. Tying both to one transaction makes it atomic.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-api-integration-06-q1',
        prompt: 'Why must a webhook signature be checked against the raw body and not against the parsed JSON?',
        choices: [
          'Raw text is smaller than parsed JSON, so the check runs a little quicker on the server',
          'The service signs only the first line of each message that it sends to your address',
          'Re-writing parsed JSON can change spacing or key order, so the bytes differ',
          'Parsed JSON cannot contain a timestamp, so the check could not even be run',
        ],
        answer: 2,
        explanation: 'The signature was made from the exact characters that were sent. Any change, even harmless whitespace, produces a different fingerprint and a failed check.',
      },
      {
        id: 'ai-api-integration-06-q2',
        prompt: 'The service delivers the same event twice. What keeps the customer from being notified twice?',
        choices: [
          'Remember applied event ids, and answer 200 without work on a repeat',
          'Answer the second delivery with a 500 so that the service stops retrying it',
          'Ignore every event that arrives within one minute of any other event',
          'Ask the customer to confirm that they have already received the first message',
        ],
        answer: 0,
        explanation: 'Retries are normal, so the handler is the one that must be harmless to repeat. Answering 200 tells the service to stop retrying, while skipping the work keeps the effect single.',
      },
      {
        id: 'ai-api-integration-06-q3',
        prompt: 'Handling one event involves 40 seconds of work. What should the endpoint do?',
        choices: [
          'Do all of the work first, so that the answer is certain to be a correct one',
          'Answer 200 only after the sender’s time limit, so it knows the work is complete',
          'Verify, store the event, answer 2xx fast, then work',
          'Answer with a 4xx so that the sender stops sending any slow events at all',
        ],
        answer: 2,
        explanation: 'Senders count a slow answer as failure and retry; GitHub, for one, asks for a 2xx within 10 seconds. Acknowledge fast, process after, and keep the event stored so nothing is lost.',
      },
      {
        id: 'ai-api-integration-06-q4',
        prompt: 'Why is a timestamp part of what is signed, and why are old ones refused?',
        choices: [
          'So that the customer can see exactly when the message was sent',
          'So a recorded genuine delivery cannot be replayed later on',
          'So that the service can tell which of its two servers sent the event',
          'So that events always arrive in exactly the order in which they were made',
        ],
        answer: 1,
        explanation: 'A signature proves who sent a message, not when. Signing the time, and refusing old ones, makes a recording useless a few minutes later.',
      },
      {
        id: 'ai-api-integration-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a webhook?',
        choices: [
          'A web page that shows you a list of all of your messages so far',
          'A way to ask the service the very same question every few seconds',
          'An address in your app that a service calls when something happens',
        ],
        answer: 2,
        explanation: 'A webhook turns asking into being told: like an oven timer instead of opening the oven repeatedly. Because anyone can knock on that address, you must check who is calling.',
      },
      {
        id: 'ai-api-integration-06-q6',
        audience: { min: 'advanced' },
        prompt: 'A “delivered” event arrives before the “queued” event for the same message. What design copes with that?',
        choices: [
          'State that only moves forward, or a re-read from the provider’s API',
          'A delay of ten seconds before every handler runs, so that earlier events arrive first',
          'Rejecting any event whose type does not follow the last event type you saw',
          'Sorting events by the time your server received them, then applying them in that order',
        ],
        answer: 0,
        explanation: 'Delivery order is not guaranteed, so correctness cannot depend on it. State that only moves forward, or a re-read of the true state, makes a late event harmless.',
      },
    ],
    task: {
      title: 'Receive a signed event, and attack your own receiver',
      minutes: 20,
      steps: [
        'Ask your AI assistant for a webhook receiver using the prompt from this lesson and the signature recipe: HMAC-SHA-256 over the time, a dot and the raw body. Read the code for a body parser that runs first, a plain comparison and an id remembered before the work.',
        'Write a small script that signs a fake event with a made-up secret and posts it to your receiver. Send it five ways: valid, valid again, with a changed body, with no header, and with an hour-old timestamp.',
        'Confirm that the first is applied once, the repeat is answered 200 with no second effect, and the other three are refused with 400. Fix whatever the draft got wrong.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain HMAC with a wax seal, then walk me through my verify function line by line.” Write down in your own words what each of the two checks, signature and time, protects against.'] },
      { audience: { min: 'advanced' }, steps: ['Make the duplicate check atomic with a unique constraint inside the transaction that applies the event, accept two secrets for rotation, cap the body size, and add a metric for rejected signatures.'] },
    ],
  },
  {
    id: 'ai-api-integration-07',
    day: 7,
    title: 'Test an integration without breaking the real thing',
    summary: 'Test the parts of an integration with pure functions, a local fake that fails on demand, the provider’s test mode and one live check, and prove each test can fail.',
    minutes: 28,
    skills: ['test-integrations', 'integration-workflow'],
    intro: {
      objectives: [
        'Choose the right kind of test for each part of an integration: a pure function, a local fake, the provider’s test mode, or one live check',
        'Make a fake service fail on purpose so retries, limits and bad answers are tested',
        'Prove that a test can fail by breaking the code, and spot a test that cannot',
      ],
      why: 'AI is very good at writing tests that go green and very casual about whether they could ever go red. An integration you cannot test is one you cannot safely change, and the real service is a poor place to test: it is slow, costs money and will not fail when you ask it to.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The obvious way to test a text-message integration is to send a text. Try it for a week and the problems pile up. It is slow, so nobody runs the tests. It costs money, or counts against a limit. It texts real people. It needs the internet and a working key on every machine. And you cannot make the real service give you a `503` or a `429` when you want one, which are the very cases you most need to test. Yet the real service is also the truth. So a good plan uses **layers**: most of the testing happens against things you control, and a very small amount happens against the real thing, to make sure the things you control still tell the truth.',
      },
      {
        type: 'table',
        headers: ['Layer', 'What it is', 'Good for', 'Weakness'],
        rows: [
          ['1. Pure-function tests', 'Plain functions with no network: the backoff schedule, the Retry-After reader, the signature check, the response validator', 'Exact, instant, hundreds of cases', 'Say nothing about how the pieces behave together'],
          ['2. A local fake service', 'A small server (or a replaced fetch) that answers the way the service’s documentation says, and can be told to fail on purpose', 'Retries, limits, bad answers, counting calls, checking headers like the key and the idempotency key', 'The fake is your reading of the documentation, and it can be wrong or go out of date'],
          ['3. The provider’s test mode', 'The real service with test keys, fake money and fake messages', 'Checking real authentication, real shapes, the provider’s own test values', 'Slower, limited, and not identical to live: the provider’s documentation says what differs'],
          ['4. One live check', 'A single real call, run on purpose', 'Catching a fake that has drifted from reality', 'Slow and flaky; keep it small and out of every build'],
        ],
        caption: 'Many fast tests at the top of the table, very few slow ones at the bottom.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The cheapest layers run on every change; the real service is touched rarely and deliberately.',
        source: 'flowchart TD\n  A[Every change: pure and fake tests, seconds] --> B{All green?}\n  B -->|No| C(Fix before anything else)\n  B -->|Yes| D[Often: provider test mode with test keys]\n  D --> E[Rarely: one live check, on purpose]\n  E -->|Differs from the fake| F[Fix the fake and the code]\n  E -->|Matches| G(Ship)',
      },
      { type: 'heading', text: 'A fake that fails on purpose' },
      {
        type: 'paragraph',
        text: 'The stand-in text service of this course is a layer-2 fake: about forty lines that follow the shapes its imaginary documentation promises (201 queued, 401 for a bad key, 422 for a bad number, a Retry-After on 429). Its key feature for testing is a **script**: a list of answers it must give, in order, before it behaves normally. Here is the test that proves the retry rules of lesson 5. The fake is told to answer a 429 with `Retry-After: 2` and then a 503; the test checks what the client waited, and how many keys it used.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A test with a scripted fake (run for this course; node:test, no packages)',
        code: `import test from 'node:test';
import assert from 'node:assert/strict';
import { startFakeSms } from './fake-sms.mjs';
import { createSmsClient } from './sms-client.mjs';

// Always close the fake, even when an assertion fails, or the test run never ends.
async function withFake(options, run) {
  const fake = await startFakeSms(options);
  try {
    await run(fake);
  } finally {
    await fake.close();
  }
}

test('a 429 then a 503 are retried and the message is sent once, with one idempotency key', () =>
  withFake({ script: [{ status: 429, headers: { 'retry-after': '2' } }, { status: 503 }] }, async (fake) => {
    const waits = [];
    const client = createSmsClient({ baseUrl: fake.url, apiKey: fake.apiKey, sleep: async (ms) => waits.push(ms) });
    const sent = await client.send('+639171234567', 'On the way');
    assert.equal(sent.status, 'queued');
    assert.deepEqual(waits, [2000, 2000]);
    assert.equal(new Set(fake.calls.map((c) => c.headers['idempotency-key'])).size, 1);
  }));`,
      },
      {
        type: 'paragraph',
        text: 'Three habits make that test good. The client takes its waiting function as an option (`sleep`), so the test replaces a real two-second pause with a function that just records the number, and the whole suite finishes in a fraction of a second. The assertions check **specifics**: the exact waits, the exact status, exactly one key. And the fake is closed in a `finally`. That last one was learned the hard way while writing this course: an early version left the server open when an assertion failed, and the test run never ended, because Node waits for open servers.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The whole suite, run (real output)',
        code: `✔ backoff doubles and is capped
✔ Retry-After reads seconds and dates
✔ a 429 then a 503 are retried and the message is sent once, with one idempotency key
✔ a 422 is not retried
✔ it gives up after maxAttempts
✔ a wrong key is refused at once
✔ a correct signature passes
✔ a changed body, wrong secret, old timestamp or no header fail
✔ the same event twice is applied once
✔ a failed apply is not remembered, so the sender can retry
✔ weather: reads a good answer and turns a 400 into a clear error
ℹ tests 11   ℹ pass 11   ℹ fail 0   (the whole run took about 0.13 seconds)`,
      },
      { type: 'heading', text: 'The trap: a test that cannot fail' },
      {
        type: 'paragraph',
        text: 'Green means nothing until you have seen red. A test that cannot fail is worse than no test, because it gives you confidence you have not earned. The check costs a minute: **break the code on purpose, one behaviour at a time, and see whether a test notices.** This is called mutation testing when a tool does it, and you can do it by hand. These are real runs against copies of the course code:',
      },
      {
        type: 'table',
        headers: ['What was broken on purpose', 'Tests that failed', 'What it shows'],
        rows: [
          ['The client no longer stops on a 4xx, so it retries a bad number four times', '“a 422 is not retried” and “a wrong key is refused at once”', 'The tests assert the call count and the error code, so they notice'],
          ['The webhook check no longer compares the timestamp', '“a changed body, wrong secret, old timestamp or no header fail”', 'The old-timestamp case catches a removed replay window'],
          ['The webhook signature is never actually compared', 'The same test', 'The changed-body and wrong-secret cases catch it'],
          ['The same early-stop bug, tested only with assert.rejects(client.send("0917", "hi"))', 'None: the test stayed green', 'It only checks that something throws, and the broken code throws too, after four needless calls'],
        ],
        caption: 'The last row is the one to remember: a weak assertion passes on broken code.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *test* is a small program that checks another program and says pass or fail. A *fake* is a practice version of the service, like a practice kitchen: it behaves like the real one, so you can rehearse safely, and you can make it burn the rice on purpose to see what your code does. “Break the code on purpose” sounds odd but it is the fire drill of testing: you light a small fire to see whether the alarm rings. If the alarm stays silent, the alarm is broken, not the building. And a *specific* check says “exactly one call was made and it was a 422”, while a vague one says “something went wrong”: vague checks pass in the very cases you needed them to catch.',
      },
      { type: 'heading', text: 'The one live check, and the provider’s test mode' },
      {
        type: 'paragraph',
        text: 'A fake is your reading of the documentation, and your reading can be wrong or go out of date. One real call, guarded so that it runs only when you ask for it, closes that gap. It checks the thing the fake pretends: the shape of the real answer.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'live.test.mjs: one real call, only when LIVE=1 (run for this course)',
        code: `import test from 'node:test';
import assert from 'node:assert/strict';
import { getWeather } from './weather.mjs';

test('live: the real weather service still answers in the shape we read', { skip: process.env.LIVE !== '1' }, async () => {
  const w = await getWeather(13.62, 123.19);
  assert.equal(typeof w.tempC, 'number');
  assert.equal(typeof w.rainMm, 'number');
});`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Without and with the switch (real output)',
        code: `$ node --test live.test.mjs
﹣ live: the real weather service still answers in the shape we read # SKIP

$ LIVE=1 node --test live.test.mjs
✔ live: the real weather service still answers in the shape we read (870 ms)`,
      },
      {
        type: 'paragraph',
        text: 'A paid provider usually adds a layer between the fake and the live check: a **test mode**, with test keys that reach the real service but touch no real money or phones, and a documentation page listing the special values that trigger each outcome (a number that always “delivers”, one that always fails). Use it for what a fake cannot prove, such as whether your real key is accepted and the real shapes match. Then read what the provider says differs between test and live, because it is never identical. And apply lesson 3: test keys, in the environment, never live ones.',
      },
      {
        type: 'prompt',
        label: 'A prompt for tests that can fail (paste your integration card and your code)',
        text: 'Here is my integration card (with its error table) and my client code. Write node:test tests with a local fake server or an injected fetch, one test per row of the error table and one per retry or limit rule. The tests must not touch the network, must not really sleep (inject the waiting function), must close any server in a finally block, and must assert specifics: exact status, error code, number of calls, headers sent. After the tests, list for each one a small change to my code that should make it fail, so that I can check that it can.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Keep determinism at the edges: inject the clock, the sleep, the random source (for jitter) and the id generator, so no test depends on real time. Assert on the **request** the fake saw (method, path, headers, body, idempotency key), not only on what your function returned, because a client can return the right value after sending the wrong request. Recorded fixtures are a cheap alternative to a hand-written fake, but they go stale and can contain customer data or secrets, so scrub them and pair them with a scheduled contract check against the real service, run from CI with test credentials on a schedule and never on pull requests from forks. Treat a flaky live check as a signal about the vendor, not noise to retry away: record it. Add failure injection to staging, such as slow answers, truncated bodies and dropped connections, and use property-based tests for validators. Run mutation testing, by tool or by hand, on the code that handles money, retries and signatures, because it is where a green suite most easily lies.',
      },
      {
        type: 'version',
        text: 'The Node.js 22 test runner (node:test) is marked stable. node --test finds files such as *.test.mjs, the skip option marks a test as skipped, and --test-reporter=spec chooses the spec reporter (the default only when the output is a terminal). The fake Pasa-Text service and its idempotency header are invented for this course; a real provider’s test mode, test values and differences from live are described in its own documentation.',
        checked: CHECKED,
        sources: [DOCS.nodeTest],
      },
      {
        type: 'takeaways',
        items: [
          'Test in layers: pure functions, a local fake, the provider’s test mode, and one live check on purpose.',
          'A fake that can fail on demand is the only way to test retries, limits and bad answers.',
          'Inject the sleep and the clock, close servers in finally, and assert specifics: status, code, call count, headers.',
          'Prove a test can fail: break the code on purpose and see which tests notice. A weak assertion passes on broken code.',
          'One live check, run deliberately, keeps the fake honest.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-07-predict-output-1',
          kind: 'predict-output',
          title: 'A test that cannot fail',
          prompt: 'This sketch has the bug from the lesson: the client retries even a bad request, four times. One check only asks whether it threw; the other counts the calls. What does the program print?',
          concept: 'weak versus specific assertions',
          language: 'javascript',
          code: `function sendWithBug(status) {
  // BUG: it retries every failure, including a 422
  let calls = 0;
  while (calls < 4) {
    calls = calls + 1;
  }
  return { threw: true, calls: calls };
}

const weak = sendWithBug(422).threw === true;
const strong = sendWithBug(422).calls === 1;
console.log(weak);
console.log(strong);`,
          choices: ['true\nfalse', 'false\nfalse', 'true\ntrue', 'false\ntrue'],
          wrongNotes: {
            'false\nfalse': 'The buggy client does throw in the end, so the weak check is true.',
            'true\ntrue': 'The client made four calls, not one, so the specific check is false.',
            'false\ntrue': 'It is the other way round: the weak check passes and the specific check fails.',
          },
          hints: [
            'Does the buggy function say it threw? What is the value of threw?',
            'How many calls did the loop make for a 422?',
            'The weak check is satisfied, the call-count check is not.',
          ],
          explanation: 'The vague check (“it threw”) is true for both correct and broken code, so it can never catch the bug. The specific check (“exactly one call”) fails on the broken code, which is exactly what a test is for.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-07-code-challenge-1',
          kind: 'code-challenge',
          title: 'A response validator',
          prompt: 'Write `validateWeather(json)`. It returns an array of problem messages, empty when the answer is good. Add `"missing current"` if `json.current` is absent (and stop there). Otherwise add `"temperature_2m must be a number"` if the temperature is not a number, then `"precipitation must be a number"` if the rain value is not a number, in that order.',
          concept: 'validating a response for tests and for code',
          language: 'javascript',
          starter: `function validateWeather(json) {
  const problems = [];
  // add the messages described above
  return problems;
}`,
          solution: `function validateWeather(json) {
  const problems = [];
  if (!json || !json.current) {
    problems.push('missing current');
    return problems;
  }
  if (typeof json.current.temperature_2m !== 'number') problems.push('temperature_2m must be a number');
  if (typeof json.current.precipitation !== 'number') problems.push('precipitation must be a number');
  return problems;
}`,
          tests: {
            kind: 'function',
            fn: 'validateWeather',
            cases: [
              { label: 'a good answer', args: [{ current: { temperature_2m: 26.9, precipitation: 0 } }], expected: [] },
              { label: 'an error body', args: [{ error: true, reason: 'bad latitude' }], expected: ['missing current'] },
              { label: 'rain missing', args: [{ current: { temperature_2m: 26.9 } }], expected: ['precipitation must be a number'] },
              { label: 'both wrong, in order', args: [{ current: { temperature_2m: '26.9', precipitation: null } }], expected: ['temperature_2m must be a number', 'precipitation must be a number'] },
              { label: 'nothing at all', args: [null], expected: ['missing current'] },
            ],
          },
          hints: [
            'Start with an empty list of problems and return it at the end.',
            'If there is no json.current, push “missing current” and return straight away.',
            'Otherwise check each of the two values with typeof, pushing a message for each one that is wrong.',
          ],
          explanation: 'The same validator serves two jobs: production code can refuse a bad answer, and a contract test can assert that the real service still returns what you read. It lists every problem, so a test failure tells you what changed.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-07-match-1',
          kind: 'match',
          title: 'Which layer tests this?',
          prompt: 'Match each thing you want to check to the cheapest layer that can prove it.',
          concept: 'choosing a test layer',
          labels: { terms: 'What you want to know', meanings: 'The layer that proves it' },
          pairs: [
            { term: 'The waits come out as 1, 2, 4, 8 and then stay at the cap', definition: 'A pure-function test', note: 'No network is needed to check a calculation.' },
            { term: 'After a 429 and a 503 exactly one text is created, using one idempotency key', definition: 'A local fake with scripted failures', note: 'Only a fake can be told to fail on demand and count the calls.' },
            { term: 'Your real test key is accepted and the provider’s special “always delivers” number really delivers', definition: 'The provider’s test mode', note: 'Only the real service can say whether your real key works.' },
            { term: 'The weather service still sends the two fields your code reads, in the shape your fake pretends', definition: 'One live check, run on purpose', note: 'The fake could have drifted, and only the real service can show it.' },
            { term: 'A delivery whose body was changed after signing is refused with 400', definition: 'A signed fake event posted to your receiver', note: 'You sign a fake event yourself, change it and post it to the receiver.' },
          ],
          hints: [
            'Ask whether the check needs the network at all, and whether it needs the real service.',
            'Failing on demand needs a fake; real keys need the provider; reality-drift needs the live service.',
            'Calculations are pure; webhooks are tested by sending signed fake events.',
          ],
          explanation: 'Use the cheapest layer that can prove the thing. Reach for the real service only for what nothing else can show.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-07-arrange-1',
          kind: 'arrange',
          title: 'A test routine you can trust',
          prompt: 'Put this routine for testing an integration with AI in order.',
          concept: 'proving tests can fail',
          language: 'text',
          solution: [
            'Write the integration card with its error table',
            'Ask the AI for one test per row, using a local fake',
            'Run the tests and see them pass',
            'Break the code on purpose, one behaviour at a time',
            'Strengthen every test that stayed green when the code was broken',
            'Run the suite in the build and schedule the one live check',
          ],
          reasons: [
            'The card says what should happen, so tests can be written from it and not from guesses.',
            'The AI drafts the tests from the card, while you decide what they should check.',
            'A suite must pass before breaking things shows you anything.',
            'Breaking one behaviour at a time shows which tests notice which bug.',
            'A test that stayed green over broken code cannot fail, so it must be made specific.',
            'Only a suite you trust belongs in the build, with the live check kept apart.',
          ],
          hints: [
            'What do you need to know before any test can be written?',
            'You can only see whether a test can fail after it has passed once.',
            'Card, tests, green run, deliberate breaks, strengthen, then automate.',
          ],
          explanation: 'The order protects you from false confidence: tests come from the card, they are seen to pass, then seen to fail when the code is broken, and only then are they trusted.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-07-scenario-1',
          kind: 'scenario',
          title: 'Testing the 503 path',
          prompt: 'Choose how to test it.',
          concept: 'failure injection',
          situation: 'You want proof that your client retries a 503 and gives up after four attempts. The real provider almost never fails, and it charges per message. A teammate suggests sending messages in a loop to the real service until it fails.',
          options: [
            { text: 'Use a local fake that is scripted to answer 503 several times, and assert the number of calls and the final error.', consequence: 'The failure happens on demand, instantly and for free, and you check the exact behaviour.', quality: 'best' },
            { text: 'Loop against the real provider until it returns a 503.', consequence: 'You may wait for ever, spend real money, text real people and risk being rate limited.', quality: 'poor' },
            { text: 'Use the provider’s test mode and hope it has a way to return a 503.', consequence: 'Some providers offer a magic value for errors, many do not. You may find that you cannot force it at all, so it is a possible extra check and not the plan.', quality: 'acceptable' },
            { text: 'Skip the test, since the retry code looks right when you read it.', consequence: 'Retry logic is where small mistakes hide, and a bug there shows up only during an outage, when you need it most.', quality: 'poor' },
          ],
          hints: [
            'Which tool lets you choose when a failure happens?',
            'Real services fail rarely and not on your schedule.',
            'Script a fake to fail, and count what your client did.',
          ],
          explanation: 'Failures on demand are the main reason fakes exist. Real services are for checking reality, not for rehearsing disasters.',
        },
      },
      {
        type: 'activity',
        activity: {
          audience: { max: 'beginner' },
          id: 'ai-api-integration-07-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Testing words',
          prompt: 'Say each in your own words, then tap.',
          concept: 'testing vocabulary',
          cards: [
            { front: 'Test', back: 'A small program that runs another program’s code and reports pass or fail.' },
            { front: 'Fake', back: 'A practice version of a service that you control. It answers like the real one and can be made to fail on purpose.' },
            { front: 'Test mode', back: 'A practice version run by the provider itself, with test keys that touch no real money or people.' },
            { front: 'Break it on purpose', back: 'Change the code so it is wrong, then see whether your tests notice. If they stay green, they cannot protect you.' },
          ],
          hints: ['Think of rehearsing before opening night.'],
          explanation: 'These ideas give you confidence in code that talks to a service you do not control.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-api-integration-07-q1',
        prompt: 'Why not run your integration tests against the real provider on every code change?',
        choices: [
          'Real providers refuse any request that comes from an automated test runner',
          'They are slow, cost money, hit limits and cannot fail on demand',
          'Real providers never return errors at all, so there would be nothing to test',
          'Tests are only allowed to run on a machine that has no internet access at all',
        ],
        answer: 1,
        explanation: 'Slowness, cost, limits and the inability to force a 503 on demand make the real service a poor place for everyday testing. It stays valuable as an occasional check on reality.',
      },
      {
        id: 'ai-api-integration-07-q2',
        prompt: 'A test only asserts that sending “0917” throws an error. A bug makes the client retry that 422 four times before throwing. What happens to the test?',
        choices: [
          'It fails, because the client took noticeably longer than before to throw',
          'It fails, because four calls are more than the single call that is expected',
          'It still passes: it throws in the end, so it cannot tell the bug apart',
          'It cannot run, because a test needs to count the calls before it can start',
        ],
        answer: 2,
        explanation: 'The assertion is satisfied by both behaviours, so it cannot catch this bug. Asserting the error code, the retryable flag and exactly one call can.',
      },
      {
        id: 'ai-api-integration-07-q3',
        prompt: 'What is the single live check for, once you have a local fake?',
        choices: [
          'To confirm that the real service still answers the way your fake pretends',
          'To replace all of the other tests, because a real call is always more reliable',
          'To spend the free allowance that the provider gives you each and every month',
          'To show the provider’s support team that your whole integration is working',
        ],
        answer: 0,
        explanation: 'A fake is your reading of the documentation. One deliberate real call is how you find out it has become wrong, before a customer does.',
      },
      {
        id: 'ai-api-integration-07-q4',
        prompt: 'A failed assertion leaves the fake server open and the whole test run never ends. What is the right fix?',
        choices: [
          'Remove the assertion so that the test can never fail again after that',
          'Add a very long timeout to the test run so that it eventually gives up',
          'Close the fake in a finally block, so it always shuts',
          'Start the fake only once, in a separate terminal window, and never stop it',
        ],
        answer: 2,
        explanation: 'Node keeps running while a server is open. A finally block (or an after hook) closes it whatever happens, so a failing test fails cleanly instead of hanging.',
      },
      {
        id: 'ai-api-integration-07-q5',
        audience: { max: 'beginner' },
        prompt: 'A fake service in a test is most like…',
        choices: [
          'a practice kitchen: it behaves like the real one, and you can make it fail',
          'a locked door that keeps the real service from ever being used by anyone',
          'a mirror that shows you exactly what the customers see in the real app',
        ],
        answer: 0,
        explanation: 'A fake lets you rehearse the cases that are rare, expensive or dangerous with the real service, such as a failure at the worst moment.',
      },
      {
        id: 'ai-api-integration-07-q6',
        audience: { min: 'advanced' },
        prompt: 'You record real responses and replay them as fixtures instead of writing a fake. What is the main risk?',
        choices: [
          'Replaying is slower than a fake server, so the whole suite takes minutes to run',
          'Recorded files cannot contain error responses at all, so failure cases go untested',
          'They go stale and may hold real data or secrets, so scrub them and re-check',
          'Fixtures only work for GET requests, which makes them useless for a messaging service app',
        ],
        answer: 2,
        explanation: 'A recording is a snapshot: it ages, and it can capture real data or credentials. Scrubbing and a scheduled live check keep it honest and safe.',
      },
    ],
    task: {
      title: 'Write tests that can fail',
      minutes: 20,
      steps: [
        'Give your AI assistant your integration card and the test prompt from this lesson. Run the tests it writes against your client and watch them pass.',
        'Break your client on purpose in three ways (retry a 4xx, ignore Retry-After, skip the shape check). For each, run the suite and write down which tests failed, if any.',
        'Make every test that stayed green more specific (exact status, error code, call count), then add a live check behind an environment switch.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain what each of my tests checks, in plain words, and tell me one way to break my code that this test would notice.” Try that one change and see the test fail.'] },
      { audience: { min: 'advanced' }, steps: ['Inject the clock, the sleep and the random source, assert on the requests the fake received, scrub any recorded fixtures, and run the live contract check from a scheduled CI job using test credentials.'] },
    ],
  },
  {
    id: 'ai-api-integration-08',
    day: 8,
    title: 'Project: connect a real service to your app',
    summary: 'Put the whole routine together: card, secrets, a checked first call, retries, webhooks and tests, then guard your own door, protect customers’ data and write the runbook.',
    minutes: 30,
    skills: ['integration-safety', 'runbooks'],
    intro: {
      objectives: [
        'Follow the seven-step routine to connect one service to your app from start to finish',
        'Guard the door your integration opens: who may trigger it, how often, how much it may cost and what it may log',
        'Write a one-page runbook that lets someone else keep the integration alive',
      ],
      why: 'A connected service that works on your laptop is not finished. The things that hurt in production are the ones nobody wrote down: who can trigger the spending, what the app does when the service is out, and how to rotate the key at 2 a.m.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The last lesson is the one you build. You will connect one real service to your own app, and the earlier lessons become a routine. A routine matters because AI makes each step quick, which makes it very easy to skip the unglamorous ones: the checks, the limits, the instructions for the person on call. This lesson gives you the sequence in one table, adds the part the earlier lessons only touched, which is **safety**, and ends with the **runbook**: a one-page set of instructions that outlives your memory of how it all works.',
      },
      {
        type: 'table',
        headers: ['Step', 'What you produce', 'From lesson'],
        rows: [
          ['1. Choose and read', 'An integration card from the real documentation, with each line marked verified or not', '1, 2'],
          ['2. Secrets', 'A .env file that Git ignores, a .env.example, a config that stops on a missing value, and a test key', '3'],
          ['3. The first call', 'One adapter function with a timeout, a status check, a shape check and named errors', '4'],
          ['4. Failure rules', 'Retries with a cap and Retry-After, an idempotency key for anything that creates', '5'],
          ['5. Events', 'A webhook receiver that verifies, answers fast and applies each event once (or a polling loop with a stop)', '6'],
          ['6. Tests', 'Pure, fake-service and signed-event tests that you have seen fail, plus one guarded live check', '7'],
          ['7. Guard and document', 'The safety pass below, and the runbook', '8'],
        ],
        caption: 'Seven steps, each one small. The project at the end of this lesson asks you to do all of them for a service of your choice.',
      },
      { type: 'heading', text: 'Safety pass 1: your own endpoint spends money' },
      {
        type: 'paragraph',
        text: 'Imagine the “text the customer” feature, finished and tested, behind a route in your server: send a phone number and a message, and the server texts it. It works. It is also a machine that anyone who finds the address can turn into a text-sending service at your cost. OWASP’s API Security list names this risk, “unrestricted resource consumption”, and its own example is an SMS provider charging per message while an attacker scripts tens of thousands of requests. Its prevention list is a checklist for your endpoint: limit how often one client can call it, cap the size of every input, and **set spending limits with every third-party provider, or billing alerts if limits are not offered**. For the text route that means four things: only a signed-in person or your own order system may call it, it may text only numbers that belong to that order, each person gets a small number of texts per hour, and the provider account has a spending cap or alert.',
      },
      { type: 'heading', text: 'Safety pass 2: what comes back is not trusted either' },
      {
        type: 'paragraph',
        text: 'Developers trust a famous provider’s data more than a stranger’s form input, and OWASP lists that habit as a risk of its own (“unsafe consumption of APIs”). A third-party answer can be wrong, can be changed by an attacker who compromises the provider, and can contain text that is dangerous in the next place it goes. Its advice: use encrypted connections (an `https` address), validate and sanitize what comes back before you use it, and do not follow redirects blindly. You already validate the shape of each answer. For redirects, `fetch` follows them by default, but for a fixed provider address you can refuse them, and we ran both options against a server that answers `301`:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'What the redirect option does (real output)',
        code: `fetch(url, { redirect: 'error' })   ->  TypeError  fetch failed
fetch(url, { redirect: 'manual' })  ->  301  http://127.0.0.1:1/elsewhere   (you see where it points, and decide)`,
      },
      { type: 'heading', text: 'Safety pass 3: customers’ data, and the logs' },
      {
        type: 'paragraph',
        text: 'A text service needs the phone number and the message, so those leave your system. Send only what the feature needs, and check the provider’s data policy before you do. Then watch the logs: they are copied into dashboards, tickets and screenshots, and OWASP’s logging guidance says secrets, access tokens and connection strings should not be recorded, and that personal details such as phone numbers need care. A small function that makes a copy safe to log does the job. Here it is, run on a typical request:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'redact.mjs: a copy that is safe to log (run for this course)',
        code: `const SECRET_NAME = /key|secret|token|password|authorization/i;

export function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([name, v]) => [name, SECRET_NAME.test(name) ? '[hidden]' : redact(v)]));
  }
  if (typeof value === 'string' && /^\\+\\d{10,15}$/.test(value)) return \`***\${value.slice(-4)}\`;
  return value;
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Logging a request through redact (real output)',
        code: `{
  "url": "/v1/messages",
  "headers": {
    "authorization": "[hidden]",
    "content-type": "application/json"
  },
  "body": {
    "to": "***4567",
    "body": "Your order is on the way"
  },
  "orderId": 118
}`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of a shop’s receipt book. You would never staple the cash-box key to a receipt, and you would think twice before writing a customer’s whole phone number on every slip. Logs are the receipt book of your program. The `redact` function takes a copy of the information and covers anything secret-looking with “[hidden]”, and keeps only the last four digits of a phone number, so the copy is safe to write down. The line `Object.entries(value).map(…)` goes through every labelled item of the information, one at a time, and the test `SECRET_NAME.test(name)` asks “does this label look like a key, a token or a password?”.',
      },
      { type: 'heading', text: 'The runbook: instructions for a tired person' },
      {
        type: 'paragraph',
        text: 'A **runbook** is a short document that answers, for one integration, the questions somebody will have when it breaks: what is this, how do I know it is broken, what do I do, and how do I turn it off. The reader might be a teammate, a client or you in six months. It is the best use of AI at the end of the project, because it can draft it from your code and card, and you can check every line against the truth. Here is a runbook for Ate Joy’s texts, shortened.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'RUNBOOK.md: Pasa-Text texts to customers (an example for the course project)',
        code: `What it does
  Texts the customer when the rider leaves, and records "delivered" from the provider's webhook.
  Without it: orders still work; customers are not told. Impact: low, annoying.

Where things live
  Keys: SMS_API_KEY and SMS_WEBHOOK_SECRET, in the server's environment (never in the repo).
  Code: src/integrations/pasatext/ (client, webhook receiver, tests).
  Provider dashboard: usage, delivery log, key list (owner: Ate Joy's account).

How we know it is broken
  Log lines: "sms failed", "webhook rejected" (a rising count), or no "delivered" events for 30 minutes.
  The provider's status page, and its usage graph.

What to do
  401 in the log      The key is wrong or revoked: check the environment, then rotate (below).
  429 in the log      We are over the limit: the client waits as told; if it persists, lower the sending rate.
  Many 503s           The provider is down: nothing to fix; messages retry 4 times then fail clearly.
  Webhook rejected    Check the secret matches the dashboard; check the server clock.

Turn it off
  Set SMS_ENABLED=false and redeploy. Orders carry on; no texts are sent.

Rotate the key
  1 Create a second key in the dashboard   2 Put it in the environment and redeploy
  3 Check that sending works   4 Revoke the old key   5 Note the date here.

Limits and money
  Provider spending alert at the agreed amount; our route allows 3 texts per order per hour.

How to test
  npm test (fake service, signed events).  LIVE=1 npm test runs the one real check with a test key.`,
      },
      {
        type: 'prompt',
        label: 'A prompt to draft the runbook and to review the integration (paste your card, code and tests)',
        text: 'Here is my integration card, my integration code and my test list. First, draft a one-page RUNBOOK.md for a person who did not write it: what it does and what happens without it; where keys and code live; how to tell it is broken (name the exact log lines my code writes); what to do for each error status my code distinguishes; how to switch it off; how to rotate the key without downtime; limits and spending; how to run the tests. Only use facts that appear in what I pasted: mark anything you could not find as “UNKNOWN: ask the owner”. Second, review the integration against this checklist and list every item that fails, with the file and line, without changing any code: authentication on my own endpoint, per-user rate limit, input size limits, provider spending limit or alert, shape check of every response, https only, redirects not followed blindly, no secrets or full phone numbers in logs.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat each integration as a small threat model: what can an attacker make it do (spend money, exfiltrate data, deny service), through which entry point (your endpoint, the provider’s response, the webhook), and what stops each. Put a **kill switch** on every integration, a feature flag that disables it without a deploy, and pair it with timeouts and a circuit breaker, so a vendor outage degrades one feature and does not take the application with it. Keep a dependency inventory with an owner per vendor, its data classification, its terms and an exit plan, and rehearse key rotation and a vendor outage the way you rehearse restores. Alert on cost anomalies as well as errors, since abuse shows up first as spend. Put the contract check in CI on a schedule, review integration pull requests with the checklist above as evidence, and treat the runbook as code: it lives in the repository and changes in the same pull request as the behaviour it describes.',
      },
      {
        type: 'version',
        text: 'The OWASP API Security Top 10 2023 names “Unrestricted Resource Consumption” (API4), whose prevention advice includes rate limits, input size limits and spending limits or billing alerts with third-party providers, and “Unsafe Consumption of APIs” (API10), which advises encrypted connections, validating and sanitizing third-party data, and not following redirects blindly. OWASP’s Logging cheat sheet says secrets, access tokens and connection strings should not be recorded directly and that phone numbers and similar personal data need special handling. MDN documents the fetch redirect option (follow, error, manual). Checked on this date.',
        checked: CHECKED,
        sources: [
          { label: 'OWASP API Security Top 10 2023: API4 Unrestricted Resource Consumption', url: 'https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption' },
          { label: 'OWASP API Security Top 10 2023: API10 Unsafe Consumption of APIs', url: 'https://api-security.owasp.org/editions/2023/en/0xaa-unsafe-consumption-of-apis' },
          { label: 'OWASP Cheat Sheet: Logging', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html' },
          DOCS.mdnFetch,
        ],
      },
      {
        type: 'takeaways',
        items: [
          'The routine: card, secrets, a checked first call, failure rules, events, tests you have seen fail, then guard and document.',
          'Your own endpoint is a door that spends money: authenticate it, limit it per person and set a spending limit or alert with the provider.',
          'Treat what a third party sends back like user input: use https, validate it and do not follow redirects blindly.',
          'Log without secrets and without full personal data; a redact function makes it one line to do right.',
          'Write the runbook: what it is, how to see it is broken, what to do per error, how to switch it off, how to rotate the key.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-08-code-challenge-1',
          kind: 'code-challenge',
          title: 'Make a request safe to log',
          prompt: 'Write `redactHeaders(headers)`. It returns a copy of the object in which the value of any header whose name (ignoring upper and lower case) is `authorization` or `cookie` is replaced with the text `"[hidden]"`. All other headers keep their values. Do not change the original object.',
          concept: 'keeping secrets out of logs',
          language: 'javascript',
          starter: `function redactHeaders(headers) {
  // return a copy with authorization and cookie hidden
  return headers;
}`,
          solution: `function redactHeaders(headers) {
  const copy = {};
  for (const name of Object.keys(headers)) {
    const lower = name.toLowerCase();
    copy[name] = lower === 'authorization' || lower === 'cookie' ? '[hidden]' : headers[name];
  }
  return copy;
}`,
          tests: {
            kind: 'function',
            fn: 'redactHeaders',
            cases: [
              { label: 'authorization is hidden', args: [{ authorization: 'Bearer abc', 'content-type': 'application/json' }], expected: { authorization: '[hidden]', 'content-type': 'application/json' } },
              { label: 'capital letters are caught too', args: [{ Authorization: 'Bearer abc' }], expected: { Authorization: '[hidden]' } },
              { label: 'cookies are hidden', args: [{ Cookie: 'session=1', accept: 'text/html' }], expected: { Cookie: '[hidden]', accept: 'text/html' } },
              { label: 'nothing secret, nothing changes', args: [{ accept: 'text/html' }], expected: { accept: 'text/html' } },
            ],
          },
          hints: [
            'Build a new object so the original is left alone.',
            'Go through Object.keys(headers) and compare name.toLowerCase() with the two secret names.',
            'Put "[hidden]" in the copy for those two, and the original value for every other header.',
          ],
          explanation: 'Logging a whole request is handy and dangerous: the Authorization header carries the key. Hiding it in one place means that no log statement anywhere can leak it by accident.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-08-fix-bug-1',
          kind: 'fix-bug',
          title: 'An off-by-one in the allowance',
          prompt: 'A person may send at most `limit` texts per hour. This helper decides whether one more is allowed, and it lets in one text too many. Tap the buggy line and choose the correct fix.',
          concept: 'per-person limits on your own endpoint',
          language: 'javascript',
          code: `function canSend(sentThisHour, limit) {
  return sentThisHour <= limit;
}`,
          bugLine: 2,
          fixes: [
            { line: '  return sentThisHour < limit;', correct: true, why: 'With 3 allowed, 0, 1 and 2 already sent leave room for one more, but at 3 the allowance is used up.' },
            { line: '  return sentThisHour < limit - 1;', correct: false, why: 'This stops one text early: with a limit of 3 and 2 already sent, the third is refused.' },
            { line: '  return sentThisHour !== limit;', correct: false, why: 'Once the count is above the limit, for example 4, this allows sending again.' },
            { line: '  return sentThisHour > limit;', correct: false, why: 'This is the wrong way round: it allows sending only after the limit has been passed.' },
          ],
          hints: [
            'With a limit of 3, how many texts may already have been sent for one more to be allowed?',
            'At exactly 3 already sent, should a fourth go out?',
            'Allowed only while the number sent is less than the limit.',
          ],
          explanation: 'A limit of 3 means 3 texts in total, so the check must refuse at 3. Off-by-one mistakes in limits are common in generated code, and are easy to catch with a test at the boundary.',
          tests: {
            kind: 'function',
            fn: 'canSend',
            cases: [
              { label: 'nothing sent yet', args: [0, 3], expected: true },
              { label: 'two sent, one left', args: [2, 3], expected: true },
              { label: 'three sent, allowance used up', args: [3, 3], expected: false },
              { label: 'over the limit', args: [4, 3], expected: false },
            ],
          },
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-08-match-1',
          kind: 'match',
          title: 'Which control answers the risk?',
          prompt: 'Match each risk to the control that addresses it.',
          concept: 'integration safety controls',
          labels: { terms: 'The risk', meanings: 'The control' },
          pairs: [
            { term: 'Anyone who finds your /notify address can loop it and run up the text bill', definition: 'Sign-in, a per-person limit and a provider spending cap or alert', note: 'Limit who can call it and how often, and cap what the provider can charge.' },
            { term: 'A field in the provider’s answer is placed straight into a database query', definition: 'Validate and sanitize third-party data like user input', note: 'A provider’s data can be wrong or hostile, so check it before use.' },
            { term: 'A full phone number and the key appear in the application logs', definition: 'Redact before logging', note: 'Hide secrets and shorten personal data in the copy that is logged.' },
            { term: 'At 2 a.m. nobody knows how to replace the key or switch the texts off', definition: 'A runbook with rotation and kill-switch steps', note: 'Instructions written in advance save the person on call.' },
            { term: 'The provider could answer with a redirect to an address you never chose', definition: 'Refuse or inspect redirects instead of following them blindly', note: 'An unexpected redirect should be a decision, not an automatic step.' },
          ],
          hints: [
            'For each risk, ask what you would put in the way: a limit, a check, a mask, a document.',
            'Money and abuse need limits; data from outside needs validation; logs need masking.',
            'A redirect you did not choose should be inspected, not followed.',
          ],
          explanation: 'Each control answers one named risk. Reviewing an AI-built integration is mostly asking, for each risk, whether its control is there.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-08-scenario-1',
          kind: 'scenario',
          title: 'The route that texts anyone',
          prompt: 'Choose the best change before launch.',
          concept: 'guarding your own endpoint',
          situation: 'The assistant built POST /notify. It takes a phone number and a message in the request and sends the text. It has no sign-in check. You are launching tomorrow, and the provider account has a card on it and no spending limit.',
          options: [
            { text: 'Require a signed-in customer, take only an order id, look up the number from that order, allow a few texts per order per hour, and set a spending alert or cap at the provider.', consequence: 'Only real customers trigger texts, only to their own number, in small amounts, and a runaway cost is stopped or noticed quickly.', quality: 'best' },
            { text: 'Keep the route open but hide its address, since nobody knows it yet.', consequence: 'Addresses are found by scanning and by reading the app’s traffic. The first script that finds it can text anyone.', quality: 'poor' },
            { text: 'Add a rate limit per IP address and leave the rest.', consequence: 'It helps against one script, but an attacker rotates addresses, and anyone can still text any number they like.', quality: 'acceptable' },
            { text: 'Launch as it is and check the provider’s bill every morning.', consequence: 'A fast attacker can spend the month’s budget in minutes, long before the next morning’s look.', quality: 'poor' },
          ],
          hints: [
            'Who should be allowed to trigger a text, and to which numbers?',
            'Hiding an address is not a lock. What would actually limit the damage?',
            'Authenticate, derive the number from your own data, limit the rate, and cap or alert on spending.',
          ],
          explanation: 'The safest design takes less from the caller, not more. An order id is something your system can verify; a free phone number is a request to be abused.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-api-integration-08-arrange-1',
          kind: 'arrange',
          title: 'The go-live routine',
          prompt: 'Put these final steps before launch in order.',
          concept: 'a safe launch of an integration',
          language: 'text',
          solution: [
            'Confirm the key in production is a new one, kept only in the server’s environment',
            'Set the provider’s spending alert or cap',
            'Run the whole test suite and the one live check with a test key',
            'Send one real message to your own phone and check the delivery event',
            'Write the runbook and give a second person a copy',
            'Launch, then watch the logs and the usage graph for the first hour',
          ],
          reasons: [
            'A production key must never have been in a repository, a chat or a test machine.',
            'The limit has to exist before anything can spend money.',
            'The suite and the live check say whether the code and the fake still agree with reality.',
            'A real message to yourself proves the whole path, including the webhook, with almost no risk.',
            'The runbook is for the day it breaks, so someone else needs it before launch.',
            'The first hour is when surprises show up, so someone watches.',
          ],
          hints: [
            'What must be safe and limited before real money or messages can flow?',
            'Test before the real send; write the document before the launch.',
            'Key, limit, tests, one real message, runbook, then launch and watch.',
          ],
          explanation: 'Each step reduces the cost of the next one going wrong: secrets and limits first, then proof, then people, then a watched launch.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-api-integration-08-q1',
        prompt: 'A route POST /notify sends any phone number and message it is given, with no sign-in. What is the main risk?',
        choices: [
          'Anyone can script it to send thousands of texts at your expense',
          'The route will answer more slowly than a route that requires a sign-in',
          'The provider will refuse to deliver texts that arrive from an open route',
          'The route can only send to numbers in the country of the server',
        ],
        answer: 0,
        explanation: 'A public route that spends money is a way for strangers to spend yours. Authentication, a per-person limit and a provider spending cap close it.',
      },
      {
        id: 'ai-api-integration-08-q2',
        prompt: 'The provider’s answer contains a field called note, and your code puts it straight into a database query. What does the OWASP guidance on consuming APIs say?',
        choices: [
          'Trust it, because a well-known provider has already checked everything',
          'Trust it as long as the connection to the provider uses https',
          'Treat it like user input: validate and sanitize it before use',
          'Log it first, because a logged value is safe to use afterwards',
        ],
        answer: 2,
        explanation: 'Developers tend to trust third-party data more than user input, and OWASP lists that as a risk. A provider’s data can be wrong or hostile, so check it and never build queries by pasting it in.',
      },
      {
        id: 'ai-api-integration-08-q3',
        prompt: 'Which of these belongs in the runbook for an integration?',
        choices: [
          'A list of every function in the codebase with its line count',
          'The provider’s own marketing text about how reliable its service is',
          'Your personal opinion about which provider would have been better',
          'How to rotate the key, what the app does when the service is down, and how to switch it off',
        ],
        answer: 3,
        explanation: 'A runbook answers the questions of a person who must act: what it is, how to see it is broken, what to do and how to turn it off. Code listings and opinions do not help at 2 a.m.',
      },
      {
        id: 'ai-api-integration-08-q4',
        prompt: 'Which log line is acceptable for a sent text?',
        choices: [
          'Sent to +639171234567 with Authorization: Bearer pt_live_EXAMPLE0000abcd',
          'sms ok order=118 to=***4567 status=201',
          'Request headers: {"authorization":"Bearer pt_live_EXAMPLE0000abcd"}',
          'Response from provider for +639171234567: full body',
        ],
        answer: 1,
        explanation: 'The acceptable line identifies the order, hides most of the number and carries no key. The others write a secret or a whole phone number into a log that will be copied around.',
      },
      {
        id: 'ai-api-integration-08-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a runbook?',
        choices: [
          'A program that runs your tests while you sleep',
          'A short instruction sheet that tells anyone how to check, fix and switch off your integration when it breaks',
          'The list of keys that your app uses, copied into one place',
        ],
        answer: 1,
        explanation: 'A runbook is written for a tired person on a bad day: what the thing is, how to tell it is broken, what to do and how to turn it off. It never contains secrets.',
      },
      {
        id: 'ai-api-integration-08-q6',
        audience: { min: 'advanced' },
        prompt: 'A vendor outage should cost you one feature, not the whole application. Which combination best achieves that?',
        choices: [
          'A kill switch that disables the integration without a deploy, with timeouts and a circuit breaker so calls fail fast',
          'Longer timeouts and more retries, so that the vendor has more chances to answer',
          'A second copy of the same integration code, running on the same servers',
          'A status banner that tells users that the vendor is having trouble',
        ],
        answer: 0,
        explanation: 'Failing fast and being able to switch the integration off keeps one broken dependency from consuming threads, time and attention. Longer timeouts and more retries make an outage spread.',
      },
    ],
    task: {
      title: 'Guard and document one integration',
      minutes: 20,
      steps: [
        'Take the integration you built in this course (or any small one). Walk the safety passes: who can trigger the spending, what comes back and how it is validated, and what is written to the logs. Write one finding for each, even if it is “fine”.',
        'Fix the worst finding with your AI assistant, reading its change before you accept it, and add a test at the boundary (for example a limit that refuses at exactly the allowance).',
        'Ask the assistant for a RUNBOOK.md with the prompt from this lesson. Check every line against the real code and replace each “UNKNOWN” with the truth.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Read my runbook and ask me five questions a tired stranger would ask.” Answer them in the runbook, in plain words.'] },
      { audience: { min: 'advanced' }, steps: ['Add a kill switch as a feature flag, a cost anomaly alert, and a calendar entry to rehearse key rotation. Put the runbook change in the same pull request as the behaviour it describes.'] },
    ],
  },

];

const projects: Project[] = [
  {
    id: 'ai-api-integration-p1',
    title: 'A first call you can trust',
    summary: 'Pick a free service that needs no key, write an integration card from its real documentation, have an AI tool write one function for it, and review that function until it handles a bad input, a slow answer and a surprise.',
    outcome: 'Shows a client or employer that you read documentation before generating code, and that you can turn a quick AI draft into code that fails clearly.',
    unlockAfterDay: 4,
    steps: [
      { id: 'ai-api-integration-p1-s1', text: 'Choose a free service that needs no key (a weather forecast service or the public part of a developer-platform API), open its documentation and write the integration card with the AI. Mark every line verified or not verified.' },
      { id: 'ai-api-integration-p1-s2', text: 'Make the call by hand with curl or the browser, and compare the real answer, a deliberately bad request and the headers with the card. Fix the card.', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status' },
      { id: 'ai-api-integration-p1-s3', text: 'Ask the AI for one function that makes the call. Run it with a good input and a bad one, and keep the draft and its failure message.' },
      { id: 'ai-api-integration-p1-s4', text: 'Apply the six-point review (safe input, status checked, timeout, shape checked, named errors, no secrets in addresses or logs) and get the reviewed version. Show the three runs: good, bad input and timeout.' },
      { id: 'ai-api-integration-p1-s5', audience: { max: 'beginner' }, text: 'Keep it small: one call and one value, and ask the AI to explain each line of the reviewed function in plain words before you change anything.' },
      { id: 'ai-api-integration-p1-s6', audience: { min: 'intermediate' }, text: 'Make the function return your own shape, throw one error type, and accept an injectable fetch so a test can run it without the network. Add two tests with a fake fetch: a good answer and a 400.' },
      { id: 'ai-api-integration-p1-s7', audience: { min: 'advanced' }, text: 'Put the vendor details behind one adapter module and add a contract test that runs against the real service only when an environment variable is set.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your card, drafts and review notes',
      placeholder: 'Paste your integration card, the first draft and what broke, the reviewed code, and the output of your three runs.',
      hint: 'Include the card with verified marks, the failure message of the draft, the six checks you applied with what changed, and the three real runs.',
    },
    rubric: [
      'The card comes from the real documentation, and each line is marked verified or not verified.',
      'The first draft and its failure are shown, with the real message.',
      'The reviewed function checks the status, has a timeout and checks the shape of the answer.',
      'Failures surface as named errors that say what went wrong.',
      'Nothing secret is in an address or a log line, and the three runs are real output.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The learner can explain in plain words what the status check and the timeout protect against.'] },
      { audience: { min: 'intermediate' }, items: ['The function hands back your own shape and one error type, and can be tested with a fake fetch.'] },
      { audience: { min: 'advanced' }, items: ['Vendor details are confined to one adapter, and a contract test checks the real answer on demand.'] },
    ],
  },
  {
    id: 'ai-api-integration-p2',
    title: 'Connect a real service to your app, with tests and a runbook',
    summary: 'Connect one outside service to an app of your own (a messaging, payment-test, email, maps or weather service), with the key kept safe, retries and limits handled, events verified, tests against a fake, a safety pass and a runbook.',
    outcome: 'A working integration with tests and a runbook, which shows a client or employer that you can connect services safely and leave something another person can run.',
    unlockAfterDay: 7,
    steps: [
      { id: 'ai-api-integration-p2-s1', text: 'Choose the service and the one job it does for your app. Write the integration card from the official documentation, marking verified and not verified lines, and decide what your app does without the service.' },
      { id: 'ai-api-integration-p2-s2', text: 'Set up secrets: a test key in a .env file that Git ignores, a .env.example with names only, and a config that stops with a clear message when a value is missing. Confirm with git status that no key is tracked.' },
      { id: 'ai-api-integration-p2-s3', text: 'Write the adapter with the AI: the key in a header, a timeout, a status check, a shape check, named errors, and your own return shape. Review it with the six-point checklist.' },
      { id: 'ai-api-integration-p2-s4', text: 'Add the failure rules: classify the statuses your service documents, retry with a growing wait, a cap and Retry-After, and an idempotency key on anything that creates something.' },
      { id: 'ai-api-integration-p2-s5', text: 'If the service sends events, write the webhook receiver: verify the signature on the raw body with a time limit, answer fast, apply each event once. If it does not, write a polling loop with a stop.' },
      { id: 'ai-api-integration-p2-s6', text: 'Write the tests: pure functions, a local fake that fails on purpose, and signed fake events. Break your code in at least three ways and record which tests noticed. Add one live check behind an environment switch, or use the provider’s test mode.', link: 'https://nodejs.org/docs/latest-v22.x/api/test.html' },
      { id: 'ai-api-integration-p2-s7', text: 'Do the safety pass: who can trigger the call and how often, validation of what comes back, https and redirects, a spending limit or alert at the provider, and no secrets or full personal data in the logs.', link: 'https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption' },
      { id: 'ai-api-integration-p2-s8', text: 'Write RUNBOOK.md with the AI, then check every line against the code. Include how to tell it is broken, what to do per error, how to switch it off, and how to rotate the key.' },
      { id: 'ai-api-integration-p2-s9', audience: { max: 'beginner' }, text: 'You may use a free weather or public data service and a local fake for the second one, as long as you keep the key rules, the retry rules, the tests you have seen fail and a short runbook.' },
      { id: 'ai-api-integration-p2-s10', audience: { min: 'intermediate' }, text: 'Use a service that needs a key, with a test key, and include one request that creates something with an idempotency key. Authenticate your own route and limit it per person.' },
      { id: 'ai-api-integration-p2-s11', audience: { min: 'advanced' }, text: 'Add a kill switch that disables the integration without a deploy, make webhook de-duplication atomic with a unique constraint, accept two webhook secrets for rotation, and run the live contract check on a schedule in CI.' },
      { id: 'ai-api-integration-p2-s12', audience: { min: 'professional' }, text: 'Deliver it as reviewable pull requests (one per step) with the checklist results, a threat model of the integration, the mutation results and the agent instructions file you used as evidence.' },
    ],
    submission: {
      kind: 'url',
      label: 'Your repository, with the runbook',
      placeholder: 'https://github.com/you/your-integration',
      hint: 'A link to the repository with the code, the tests, INTEGRATION.md (the card) and RUNBOOK.md. Never include a key: check that .env is not in the repository.',
    },
    rubric: [
      'The integration card comes from the official documentation, and the app has a plan for when the service is unavailable.',
      'No secret is in the repository or the logs; a missing value stops the program with a clear message.',
      'The adapter checks status and shape, has a timeout, and surfaces named errors; retries have a cap and obey Retry-After.',
      'Tests run without the real service, cover the failure rules, and were seen to fail when the code was broken on purpose.',
      'Your own route is protected against abuse, and spending or usage limits are set or alerted at the provider.',
      'The runbook says how to detect, fix, switch off and rotate, and every line matches the code.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The learner can explain in plain words where the key lives and why, and what the runbook is for.'] },
      { audience: { min: 'intermediate' }, items: ['An authenticated, rate-limited route calls the adapter, and creating requests use an idempotency key.'] },
      { audience: { min: 'advanced' }, items: ['A kill switch, atomic de-duplication and a scheduled contract check are in place.', 'Webhook secret rotation is supported without dropping events.'] },
      { audience: { min: 'professional' }, items: ['Each pull request carries checklist and mutation evidence, and the integration has a written threat model.'] },
    ],
  },
];

export const aiApiIntegrationCourse: Course = {
  id: 'ai-api-integration',
  kind: 'standard',
  title: 'AI-Assisted API Integration',
  level: 'intermediate',
  tagline: 'Connect your app to outside services with AI, and keep it safe, tested and running.',
  description: 'Learn to connect your app to services that send texts, take payments, show maps or forecast the weather, with an AI tool doing the typing. You read the real documentation, keep keys secret, handle errors, limits and webhooks, test without the real service, and ship with a runbook, using an online sari-sari store as the running example.',
  finishLine: [
    'A real service connected to your app, with the key kept out of the code',
    'Tests that run against a fake service and that you have seen fail',
    'A short runbook another person can use when the integration breaks',
  ],
  objectives: [
    'Read API documentation with AI and check it against a real call',
    'Keep keys and secrets out of client code, repositories and chats',
    'Handle errors, rate limits and retries without sending anything twice',
    'Receive and verify webhooks, and apply each event once',
    'Test an integration against a fake and prove the tests can fail',
    'Guard your own endpoint and write a runbook for an integration',
  ],
  audiences: ['builder', 'experienced-dev', 'career-changer'],
  skills: [
    { id: 'api-basics', label: 'API basics' },
    { id: 'read-api-docs', label: 'Reading API documentation' },
    { id: 'secrets-keys', label: 'Keys and secrets' },
    { id: 'first-call', label: 'Making a checked first call' },
    { id: 'errors-retries', label: 'Errors, limits and retries' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'test-integrations', label: 'Testing integrations' },
    { id: 'integration-safety', label: 'Integration safety' },
    { id: 'integration-workflow', label: 'AI integration workflow' },
    { id: 'runbooks', label: 'Runbooks' },
  ],
  lessons,
  projects,
  icon: 'api',
  updated: '2026-11-14',
};
