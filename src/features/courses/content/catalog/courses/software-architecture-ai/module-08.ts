import type { Lesson, Project } from '../../../types';

// Module 8: Scalability, Performance and Reliability (lessons 27 to 30, no project). Written 2026-11-18.
// No product fact is stated, so there are no version notes. There is no price, quota, limit, benchmark or statistic anywhere.
// Every number in an example is an invented, small illustration for the exercise, never a measurement or a claim about a real system.
// Demos ("AI in Action") are hand-written illustrations with a flaw to catch. The two live prompt labs are in src/features/practice/labs/architecture/module-08.ts.

export const project: Project | null = null;

export const lessons: Lesson[] = [
  {
    id: 'software-architecture-ai-27',
    day: 27,
    title: 'Scaling Up and Out, and Load Balancing',
    summary: 'Compare a bigger machine with more machines, make an app stateless so it can run as many copies, and place a load balancer and autoscaling rules with guardrails.',
    intro: {
      objectives: [
        'Compare vertical scaling (a bigger machine) with horizontal scaling (more machines) and name what each costs',
        'Find the state that stops an app from running as several copies, and move it somewhere shared',
        'Explain how a load balancer spreads work, why sticky sessions have a price, and what autoscaling needs to be safe',
      ],
      why: `Systems rarely fail because they cannot scale at all. They fail because the first attempt to add a second server exposes state nobody knew about. Knowing the options and the preconditions lets you scale on purpose.`,
    },
    minutes: 24,
    skills: ['arch-reliability'],
    body: [
      { type: 'paragraph', text: `Scaling means handling more work: more users, more requests, more data. There are two directions. You can make one machine bigger (scale up, or vertical scaling) or run more machines side by side (scale out, or horizontal scaling). This lesson is about the vocabulary and the preconditions, and one rule sits over all of it: scale where a measurement says the limit is. Lesson 29 shows how to measure. Here you learn what each direction needs from your design.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `On the first day of each month, TindaTrack's store owners all open the same monthly report, and the app slows down. Mika looked at the monitoring first. The CPU on the one app server was the busy part. So she resized the server to a larger one. It worked for two months, and then the same slowdown came back. This time she added a second server behind a load balancer. Within an hour, owners began to complain that they were being logged out at random. Then a scheduled job that sends low-stock text reminders ran on both servers, and owners received every message twice.` },
      { type: 'paragraph', text: `The first move, scaling up, cost nothing in design and bought two months. The second move, scaling out, exposed three things the app kept on the server itself: login sessions in memory, uploaded files on disk, and a job that assumed it was the only copy. Each one was fixable, but only after owners had seen it.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Picture a supermarket. You can hire a faster cashier, or open more checkout lanes. A faster cashier needs no change to the shop, but there is a limit to how fast one person can be, and when that person is off, the shop stops. More lanes have no such limit, but now every lane needs the same price list, a shared view of what is in stock, and someone at the front pointing customers to an open lane. The price list is shared state, and the person at the front is the load balancer.` },
      {
        type: 'table',
        headers: ['', 'Scale up (vertical)', 'Scale out (horizontal)'],
        rows: [
          ['What changes', 'A bigger machine: more CPU, memory or disk', 'More machines running the same app'],
          ['What it needs from the app', 'Nothing; the app may stay as it is', 'No state kept on one machine (stateless), and a load balancer'],
          ['Strengths', 'Fast and simple to do, no code change', 'No single machine\'s ceiling, and one machine failing is survivable'],
          ['Costs', 'A ceiling, a single point of failure, and often a restart to resize', 'A load balancer, shared stores, more machines to deploy and monitor, harder debugging'],
          ['Good first move when', 'The limit is measured on one machine and the app is not yet stateless', 'You need more capacity than one machine gives, or you want to survive losing a machine'],
        ],
        caption: 'Neither direction is better in general. Scaling up is a cheap first move, and scaling out is the move that also gives you resilience.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: scaling up is buying one stronger worker. Scaling out is hiring several ordinary workers. Several workers only help if any of them can pick up any task. If one worker keeps the only copy of a customer's order in their own notebook, then only that worker can finish that order, and if they go home sick, the order is lost. "Stateless" means no worker keeps private notes. Everything is written on a shared board that all workers can read. That board is a shared store, such as a database or a file store in the cloud.` },
      { type: 'paragraph', text: `**Stateless, and where state goes.** A stateless app keeps nothing between requests that another copy would need. Any request can go to any server, and a server can be stopped at any time. State does not disappear; it moves to a shared place:` },
      { type: 'list', items: [
        '**Login sessions:** a shared session store, or a signed token the browser carries, so no server has to remember the user.',
        '**Uploaded files:** object storage (lesson 24), not a server\'s disk.',
        '**Data:** the database, never a variable in memory that a second copy cannot see.',
        '**Caches:** a local cache is allowed only as a disposable copy that can be rebuilt. The shared cache comes in lesson 28.',
        '**Scheduled jobs:** exactly one scheduler, or a lock, so copies do not repeat the job. Because a repeat can still happen, make the job safe to repeat (idempotent, as in the queues lesson).',
      ] },
      { type: 'paragraph', text: `A quick test of statelessness: stop one server in the middle of the day. Does anyone notice? Run two copies. Does anything happen twice, or not at all? If the answer to either is yes, there is state still on a server.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Owner phones] --> B[Load balancer]
  B --> C[App server 1]
  B --> D[App server 2]
  B --> E[App server 3]
  C --> F[Shared session store]
  D --> F
  E --> F
  C --> G[(Database)]
  D --> G
  E --> G
  C --> H[Object storage]`,
        caption: 'Stateless app servers behind a load balancer. Look at the shared boxes at the bottom: they hold everything the three servers must agree on, and the database becomes the next shared limit.',
      },
      { type: 'paragraph', text: `**Load balancing.** A load balancer chooses which healthy server gets each request. The common ways to choose are round robin (take turns), least connections (send to the server with the fewest requests in progress) and weighted (send more to a bigger machine). It finds healthy servers with the shallow health check from lesson 26, and when a server is being removed it should let requests in progress finish first (called draining). A balancer can also end the secure connection for you. Some balancers work on raw connections and others understand web requests and can route by path; the second kind is more flexible and does more work.` },
      { type: 'paragraph', text: `**Sticky sessions** make a balancer send the same user to the same server every time. It looks like a quick way to keep an in-memory session working, and it is a trap with a price: load becomes uneven, and when that server restarts, every user stuck to it is logged out. Use it only as a short bridge while you move the state out, never as the design.` },
      { type: 'paragraph', text: `**Autoscaling** adds or removes copies by a rule. It is safe only with some conditions. The app must be stateless and start quickly. The rule should use a signal that your measurements show follows load, such as request latency or queue length. There must be a floor (never fewer than this many copies) and a ceiling (never more), so a bug cannot start machines without limit (lesson 26's cost guardrails). And autoscaling does not fix a slow query: more copies of an app waiting on the same slow query wait together.` },
      { type: 'paragraph', text: `One more honest point. App servers scale out easily because they share nothing. The database is shared, so a third and fourth app server can make it the limit sooner. Scaling out the app moves the question to the data layer, which is where lesson 28 and the database module pick it up.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or existing system, scaling out has failure modes of its own. Each app copy keeps a pool of database connections, so adding copies can exhaust the database's connection limit long before CPU is the problem. Sticky sessions can hide stateful bugs for years. Scaling in (removing copies) drops in-flight work unless draining and graceful shutdown are in place, and a burst of new copies starting together can overload a dependency. Capacity planning should include losing a zone: with two zones, each must be able to carry the whole load for the time failover takes, or "redundant" only means "slower failure". Scale decisions should be rehearsed with a load test as an experiment, with a question and a prediction written first.` },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'If you have waited on a slow page, you know the symptom. The skill here is the step most people skip: measure where the time goes before changing anything. A change made on a guess often moves the problem rather than removing it, and it adds complexity you then have to keep.' },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'A scaling plan for a load nobody measured', prompt: `TindaTrack's monthly report page is slow on the first day of each month. We have two app servers behind a load balancer and one managed PostgreSQL database. About 200 stores. Propose how to scale so the report page stays fast.`, output: `To handle future growth of up to one million requests per second, I recommend: 1) Autoscale the app from 2 to 50 pods on a Kubernetes cluster. 2) Add a Kafka cluster between all services. 3) Shard the database by store immediately. 4) Add a Redis cluster for sessions and caching. 5) Enable sticky sessions so each user always lands on the same pod. This design will remove all bottlenecks.`, notice: `Count the invented parts. "One million requests per second" is not in the prompt, which describes about 200 stores. The answer never asks where the time goes, so it cannot know the bottleneck, and it ignores that more app copies do not help if the database is the limit. Sharding and a message cluster are heavy steps with no evidence behind them. Sticky sessions are the price-paying trap from this lesson. "Remove all bottlenecks" is a promise nobody can make. A better reply asks for measurements first and proposes one small change you can test.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `List where your own system keeps state on a server, and decide whether scaling up or out is your next move. Then ask an assistant to look for what you missed. Its list is a set of leads, not a verdict, and you check each lead in the code.` },
      { type: 'prompt', label: 'Stateless review', text: `My system: [short description, how many servers, language and framework].\nMy measurement that shows the limit: [for example "app server CPU is the busy part", or "none yet"].\nMy plan: [scale up or out, and why].\nWhere I think state lives today: [sessions, uploads, caches, jobs, in-memory variables, anything else].\n\nAct as a sceptical reviewer. 1) List other places a typical app of this kind keeps state on one server that I may have missed, and say how I would check for each in my code. 2) Tell me which of my plan's assumptions have no measurement behind them. 3) Describe what would break first if I added a second copy tomorrow. 4) Say what you cannot know without my real code and measurements. Do not give a number of servers.` },
      { type: 'paragraph', text: `Then verify: search your own code for each lead, then run the stop-a-server test in a safe environment. If the assistant suggests a number of servers, ask what measurement it came from.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Run the stop-a-server and run-two-copies tests on a non-production copy of your system, and write down what breaks.',
        'Move one piece of state (sessions, uploads or one job) to a shared place this week.',
        'Next, lesson 28 covers caching and database performance, where the shared limit usually sits.',
        'Ask the Architecture Assistant (Tali) to challenge a scaling plan you wrote.',
      ] },
      { type: 'takeaways', items: [
        'Scale up is the cheap first move with a ceiling and a single point of failure. Scale out needs a stateless app and a load balancer, and it also gives resilience.',
        'Stateless means any request can go to any copy and any copy can stop at any time. State moves to shared stores: sessions, uploads, data and a single scheduler.',
        'Sticky sessions hide state and make load uneven. Use them only as a short bridge.',
        'Autoscaling needs a stateless app, a signal that follows load, a floor and a ceiling. It does not fix a slow query.',
        'Scaling out the app moves the limit to the shared database, so scale where the measurement says the limit is.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-27-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Prepare TindaTrack to run on two servers',
          prompt: `Build the routine that makes the app safe to run as two copies behind a load balancer. Pick the steps and put them in order. Some are tempting and wrong.`,
          concept: 'preparing an app to scale out',
          situation: `TindaTrack keeps sessions in memory, saves uploads on disk and runs a reminder job on its one server. Mika wants to add a second server without owners noticing anything. A person must stay in charge of deciding what counts as state, because a missed piece shows up as a bug owners see.`,
          parts: [
            { id: 'find-state', lane: 'ai', label: `Ask an assistant to list every place the code keeps data on the server itself`, detail: `The assistant gives a list of places to look, as leads.` },
            { id: 'verify-state', lane: 'human', label: `Check each lead in the code and look for ones the list missed`, detail: `A developer searches the code and confirms or rejects each lead.` },
            { id: 'sessions', lane: 'tool', label: `Move login sessions to a shared store`, detail: `Any server can now recognise a logged-in owner.` },
            { id: 'uploads', lane: 'tool', label: `Move uploaded files to object storage`, detail: `Both servers can read every file, and a replaced server loses nothing.` },
            { id: 'jobs', lane: 'tool', label: `Make scheduled jobs run once, with one scheduler or a lock`, detail: `Reminder texts are sent once, even with two copies running.` },
            { id: 'health', lane: 'tool', label: `Add a shallow health check address`, detail: `The balancer can tell whether a server can serve, without calling the database.` },
            { id: 'balancer', lane: 'tool', label: `Put a load balancer in front of two servers`, detail: `Requests are spread across both healthy servers.` },
            { id: 'kill-test', lane: 'output', label: `Stop one server during a test and check nobody is logged out and no file is lost`, detail: `A planned failure shows whether any state is still on a server.` },
            { id: 'sticky', lane: 'tool', label: `Turn on sticky sessions and keep sessions in server memory`, detail: `Each owner stays on one server, and the in-memory session keeps working.` },
            { id: 'ten', lane: 'tool', label: `Start ten servers to be safe before testing anything`, detail: `More copies are started on a guess, with no check of what breaks.` },
            { id: 'trust-ai', lane: 'ai', label: `Accept the assistant's list as complete and skip checking`, detail: `The list is treated as the full inventory of state.` },
          ],
          rules: [
            { id: 'r-require', kind: 'require', parts: ['find-state', 'verify-state', 'sessions', 'uploads', 'jobs', 'health', 'balancer', 'kill-test'], message: `The routine needs a hunt for state, a human check of it, sessions, uploads and jobs moved, a health check, the balancer, and a failure test.` },
            { id: 'r-no-sticky', kind: 'forbid', parts: ['sticky'], message: `Sticky sessions hide in-memory state, make load uneven, and log users out when their server restarts.` },
            { id: 'r-no-ten', kind: 'forbid', parts: ['ten'], message: `Starting many copies on a guess multiplies the problems and the cost. Fix the state first, then test.` },
            { id: 'r-no-trust', kind: 'forbid', parts: ['trust-ai'], message: `An assistant's list is a set of leads. A missed piece of state becomes a bug that owners see.` },
            { id: 'r-find-verify', kind: 'before', parts: ['find-state', 'verify-state'], message: `There must be a list of leads before a person can check them.` },
            { id: 'r-verify-sessions', kind: 'before', parts: ['verify-state', 'sessions'], message: `Check what the state really is before deciding what to move.` },
            { id: 'r-sessions-balancer', kind: 'before', parts: ['sessions', 'balancer'], message: `Sessions must be shared before a second server receives traffic.` },
            { id: 'r-uploads-balancer', kind: 'before', parts: ['uploads', 'balancer'], message: `Files must be shared before a second server receives traffic.` },
            { id: 'r-jobs-balancer', kind: 'before', parts: ['jobs', 'balancer'], message: `The job must be safe with two copies before both are running.` },
            { id: 'r-health-balancer', kind: 'before', parts: ['health', 'balancer'], message: `The balancer needs a health check address to decide which server is healthy.` },
            { id: 'r-balancer-test', kind: 'before', parts: ['balancer', 'kill-test'], message: `The failure test only means something once traffic is spread over two servers.` },
          ],
          solution: ['find-state', 'verify-state', 'sessions', 'uploads', 'jobs', 'health', 'balancer', 'kill-test'],
          minSteps: 7,
          maxSteps: 9,
          simulation: {
            input: `Add a second TindaTrack app server without owners noticing.`,
            steps: {
              'find-state': `The assistant lists sessions, uploaded files, a scheduled reminder job and an in-memory counter for rate limits.`,
              'verify-state': `The developer confirms the first three, finds the counter, and also finds a temporary export file written to disk.`,
              sessions: `Sessions move to a shared store.`,
              uploads: `Uploads and the export files move to object storage.`,
              jobs: `The reminder job runs under one scheduler, and is made safe to repeat.`,
              health: `A shallow health address is added.`,
              balancer: `The balancer now spreads requests over two servers.`,
              'kill-test': `In a test, one server is stopped. Owners stay logged in, files are still there, and reminders go out once.`,
            },
            output: `Two servers run behind a balancer. A planned failure was survived with no logouts, no missing files and no duplicate texts.`,
          },
          hints: [
            `Which steps would let a second server see data the first one kept privately? Those must come before the balancer.`,
            `A person checks what the assistant found, and a planned failure test comes last.`,
            `Leave out sticky sessions, the ten-server guess and trusting the list without checking.`,
          ],
          explanation: `Scaling out safely means finding state, checking it, moving it to shared places, giving the balancer a health check, and then proving it with a planned failure. The assistant helps find leads, but people verify. The wrong steps hide state, add cost on a guess, or skip the check.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-27-scenario-1',
          kind: 'scenario',
          title: 'A bigger server, or a second one?',
          prompt: `Choose the best next step.`,
          concept: 'scale up or scale out',
          situation: `The monthly report is slow on the first of the month. Monitoring shows the single app server's CPU is high while the database is mostly idle. The app keeps sessions in memory and saves uploads on disk. The requirement allows an hour of downtime in a rare incident, and the team has two days before month end.`,
          options: [
            { text: `Resize the app server to a larger one now, and schedule the work to move sessions and uploads to shared places before the next scale-out.`, consequence: `The slowdown eases at no design risk, and the team uses the time to remove the state that would break a second server.`, quality: 'best' },
            { text: `Add a second server behind a balancer with sticky sessions, and move the state out later.`, consequence: `Capacity doubles, but owners on a restarted server are logged out, uploads go missing on the other server, and the reminder job repeats.`, quality: 'poor' },
            { text: `Resize the server and plan nothing else, since it worked last time.`, consequence: `It buys time, but the ceiling and single point of failure remain, and the same problem returns with no preparation.`, quality: 'acceptable' },
            { text: `Move the reports to a separate service, since the report page is the only slow one.`, consequence: `Weeks of work and a new network call between services, based on no evidence that the page's own code is the cause.`, quality: 'poor' },
          ],
          hints: [
            `The measurement says the app server is the busy part. What is the cheapest change that responds to that?`,
            `What does a second server need before it is safe to add?`,
            `Look for the option that responds to the evidence now and also prepares for later.`,
          ],
          explanation: `A measured limit on one machine justifies the cheap first move. Using the time to remove state makes the next move, scaling out, safe. Adding a second server before that exposes the state to owners.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-27-match-1',
          kind: 'match',
          title: 'Which state is still on a server?',
          prompt: `Match each symptom after adding a second server to the state that causes it.`,
          concept: 'stateless services',
          labels: { terms: 'The symptom', meanings: 'The state that causes it' },
          pairs: [
            { term: `Owners are logged out at random after a request.`, definition: `Sessions kept in one server's memory`, note: `The next request reached a server that never saw the login.` },
            { term: `A receipt photo is there on one request and missing on the next.`, definition: `Uploads saved on one server's disk`, note: `Each server has only the files uploaded to it.` },
            { term: `Every owner receives each low-stock text twice.`, definition: `A scheduled job that runs on every copy`, note: `Both copies believed they were the only one, so both ran the job.` },
            { term: `One server is busy while the other is idle, and owners on the busy one are logged out after a restart.`, definition: `Sticky sessions pinning users to one server`, note: `Pinning makes load uneven and ties each user to one server's survival.` },
          ],
          hints: [
            `Ask what each server would need to know that only the other one knows.`,
            `Two symptoms are about something being repeated or uneven, not missing.`,
            `Match by where the state lives: memory, disk, a schedule, or a pinned route.`,
          ],
          explanation: `Every symptom is state that lives on one server. Naming the kind of state tells you where to move it: a shared store, object storage, one scheduler, or no pinning.`,
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-27-q1',
        prompt: `Monitoring shows the single app server's CPU is the busy part, and the app keeps sessions in memory. The team has a few days. Which move is most defensible?`,
        choices: [
          `Add three more servers with sticky sessions, because more capacity is always safer than less and the sessions will keep working.`,
          `Rewrite the app as microservices, because a distributed design removes the limit of any single server.`,
          `Resize the server, then use the time to move sessions and uploads out so scaling out is safe later.`,
          `Wait for an outage before changing anything, because scaling should only ever start after a real failure.`,
        ],
        answer: 2,
        explanation: `A measured limit on one machine justifies the cheap first move, and the spare time is best spent removing the state that would break a second server.`,
      },
      {
        id: 'software-architecture-ai-27-q2',
        prompt: `After a second server was added, every owner receives each reminder text twice. What is the likeliest cause and the right fix?`,
        choices: [
          `The scheduled job runs on every copy. Run it from one scheduler or behind a lock, and make it safe to repeat.`,
          `The load balancer duplicates each request. Switch from round robin to least connections so each request is sent once.`,
          `The database replicates every message to both servers. Add a read replica dedicated to the reminder queries.`,
          `The CDN caches the texts. Shorten the lifetime of cached copies so each text expires before it is sent again.`,
        ],
        answer: 0,
        explanation: `Each copy believed it was the only one. One scheduler or a lock stops the repeat, and idempotency covers the cases that still slip through.`,
      },
      {
        id: 'software-architecture-ai-27-q3',
        prompt: `What do a floor and a ceiling on an autoscaling rule protect against?`,
        choices: [
          `They limit how many app copies connect to the database, so it can never become the bottleneck for the system.`,
          `They keep each user on the same server during scale-in, so sticky sessions are not lost when copies are removed from the fleet at night.`,
          `They guarantee that every request finishes within the latency target while the number of copies changes.`,
          `A bad signal or a bug that would otherwise leave too few copies to serve users, or start so many that cost runs away.`,
        ],
        answer: 3,
        explanation: `The floor keeps a minimum of capacity and the ceiling caps spend. Neither guarantees latency, and neither fixes the database.`,
      },
      {
        id: 'software-architecture-ai-27-q4',
        prompt: `Why can adding app servers make a database problem show up sooner?`,
        choices: [
          `Each new app server keeps its own copy of the database, and the copies then have to be synchronised with each other.`,
          `All copies share one database, so more copies send more queries and open more connections at the same limit.`,
          `A load balancer sends every write to the database first, so a larger fleet makes every write slower.`,
          `App servers lock the database while they start, so only one can serve requests at a time.`,
        ],
        answer: 1,
        explanation: `The database is the shared part. Scaling the app out moves the limit to it unless the data layer is scaled or relieved too.`,
      },
      {
        id: 'software-architecture-ai-27-q5',
        audience: { max: 'beginner' },
        prompt: `In the workers and shared board comparison, what does "stateless" mean?`,
        choices: [
          `Workers are not allowed to talk to customers at all.`,
          `Workers keep no private notes, because everything they need is on a shared board.`,
          `Each worker has a separate board, so no two workers ever see the same data.`,
        ],
        answer: 1,
        explanation: `A stateless service keeps nothing private between requests, so any copy can handle any request.`,
      },
      {
        id: 'software-architecture-ai-27-q6',
        audience: { min: 'advanced' },
        prompt: `Autoscaling adds app copies as latency rises, yet latency keeps rising and the database starts refusing connections. What is the most likely explanation and the best next step?`,
        choices: [
          `The balancer is too slow. Replace it with a larger balancer and double the ceiling.`,
          `The app is not stateless. Turn on sticky sessions so each copy handles fewer users.`,
          `The ceiling is too low. Raise it so that many more copies can absorb the incoming traffic and share the load between all of them at once.`,
          `Each copy holds its own connection pool, so the database limit is reached. Cap the ceiling, shrink pools or add pooling, then measure.`,
        ],
        answer: 3,
        explanation: `More copies mean more pooled connections against one shared database. Raising the ceiling makes it worse; measure the data layer.`,
      },
    ],
    task: {
      title: 'Test whether your app is stateless',
      minutes: 18,
      steps: [
        `Pick a system you know. List every place it keeps something between requests: sessions, uploaded files, caches, counters, scheduled jobs, temporary files.`,
        `For each place, write where it should live if the app ran as three copies (a shared session store, object storage, the database, one scheduler).`,
        `In a safe environment, stop one copy and run two copies for a while. Write down what you notice, such as a logout, a missing file or a repeated job.`,
        `Write your next scaling move as one sentence with the measurement behind it. If you have no measurement, write the first thing you would measure.`,
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: [`Use an app you have built or used. Think of one thing it remembers about you between screens. Write where that memory lives and what would happen if the program were restarted.`] },
      { audience: { min: 'advanced' }, steps: [`Write the failure test you would run before a zone-loss scenario: what you stop, what you expect to hold, and the capacity each remaining zone must carry. Include the database connection budget per copy.`] },
    ],
  },
  {
    id: 'software-architecture-ai-28',
    day: 28,
    title: 'Caching and Database Performance',
    summary: 'Decide where a cache belongs, keep it correct with good keys, expiry and stampede defences, and fix the common database slowdowns before adding more machinery.',
    intro: {
      objectives: [
        'Choose where to cache and name what each place costs',
        'Write a cache key that cannot leak one tenant\'s data to another, and an invalidation rule that matches how fresh the data must be',
        'Recognise a cache stampede and an N+1 query, and name the fix for each',
        'Explain why a read replica can show old data, and when that matters',
      ],
      why: `Most "we need more servers" problems are one slow query or one repeated expensive answer. Knowing the few causes lets you fix the cheap thing first, and keeps a cache from becoming a data leak.`,
    },
    minutes: 26,
    skills: ['arch-reliability'],
    body: [
      { type: 'paragraph', text: `The fastest piece of work is the work you do not do again. A cache keeps a copy of an answer so the next request can skip the slow part. That is simple to say and easy to get wrong, because a copy can be old, a copy can be shared with the wrong person, and a cache is one more thing that can fail. This lesson covers where to cache, how to keep a cache correct, and the database fixes that often come before any cache at all.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack's dashboard shows today's sales and a low-stock list. Each load runs several queries, and on busy mornings it felt slow. Mika added a cache: the first request built the dashboard and stored it under the key "dashboard" for ten minutes. The page became fast. Two days later a store owner phoned to say she could see another store's sales on her dashboard. The key had no store in it, so whoever loaded the page first set what everybody saw for the next ten minutes.` },
      { type: 'paragraph', text: `The leak was caught by a customer, not by a test. The cost was an apology to two owners and a week of lost trust. The fix took one line: put the tenant in the key. The lesson is that a cache is part of your security boundary, not only your speed.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Think of a desk with a notepad. You look up the same phone number many times a day, so you copy it on the notepad. That saves a walk to the filing cabinet. The costs are real: the number may have changed, the notepad can be read by anyone who sits down, and if you lose the notepad you walk to the cabinet again, all at once. Those three costs, staleness, sharing and a sudden return to the slow path, are what a cache design has to manage.` },
      {
        type: 'table',
        headers: ['Where', 'What it holds', 'Main risk'],
        rows: [
          ['The browser', 'Files and some responses on the user\'s device', 'You cannot clear it, so a wrong copy lingers'],
          ['A CDN', 'Public files near users (lesson 26)', 'Private data cached for everyone; stale files'],
          ['Application memory', 'Computed results inside each app copy', 'Each copy has a different view; lost on restart'],
          ['A shared cache', 'Computed results and sessions in a service all copies use', 'Stale data, a new dependency, key mistakes'],
          ['The database itself', 'Recently used data kept in memory automatically', 'Not in your control; the speed vanishes after a restart'],
        ],
        caption: 'Caches sit at every layer. The closer to the user, the faster and the harder to correct.',
      },
      { type: 'paragraph', text: `The usual pattern is **cache-aside**: ask the cache first; on a miss, read the database, store the answer in the cache with an expiry, and return it. The app is in charge, and if the cache is down, it can still read the database, only more slowly. Design it so that a cache outage makes things slower, not broken.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  participant A as App
  participant C as Cache
  participant D as Database
  A->>C: Get dashboard for tenant 42
  C-->>A: Miss
  A->>D: Run the dashboard queries
  D-->>A: Rows
  A->>C: Store with a short lifetime
  A->>C: Next request asks again
  C-->>A: Hit`,
        caption: 'Cache-aside. Look at the first message: the key names the tenant. The second request is answered without touching the database.',
      },
      {
        type: 'code',
        language: 'typescript',
        label: 'Cache-aside with the tenant in the key (fragment: cache and the helper function are assumed)',
        code: `async function loadDashboard(tenantId: string): Promise<Dashboard> {
  // The key holds everything that changes the answer: the tenant and the shape of the data.
  const key = 'dashboard:v2:tenant:' + tenantId;
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached) as Dashboard;

  const fresh = await buildDashboardFromDatabase(tenantId);
  await cache.set(key, JSON.stringify(fresh), { ttlSeconds: 60 });
  return fresh;
}`,
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a cache is a notepad next to the filing cabinet. The code above reads like this: build a label for the note that includes whose data it is; if the notepad has the answer, use it; if not, walk to the cabinet, write the answer on the notepad with a sixty-second expiry, and use it. The label matters most. If two shops share a label, they share a note, and one shop reads the other's numbers.` },
      { type: 'paragraph', text: `**Keys.** The key must contain everything that changes the answer: the tenant, the user's permissions if they change what is shown, the language, and a version of the data's shape (the "v2" above lets you retire old entries by changing it). A key missing any of these serves one person's answer to another. In a multi-tenant system, write a test that loads the same page as two tenants and fails if they ever match.` },
      { type: 'paragraph', text: `**Invalidation.** Ask first: how old may this answer be? That is a requirement, not a technical detail. "Today's sales may be up to a minute old" is a fine requirement and gives you a one-minute expiry. "A price change must show at once" means you delete the cached entry when the price is saved. Expiry (time to live) is the simple tool and explicit deletion on write is the precise one. Use the simplest that meets the stated freshness.` },
      { type: 'paragraph', text: `**Stampede.** When a popular entry expires, many requests may miss at the same moment and all run the expensive query together. This is a cache stampede. Defences: let one request rebuild while the others wait or are served the slightly old copy; add a little random jitter to expiry times so entries do not all expire together; warm the most important entries after a restart; and limit how many requests may run the expensive query at once. Without them, the cache that protects the database becomes the moment it is overwhelmed.` },
      { type: 'paragraph', text: `**Database fixes that often come first.** Before any cache, check these three:` },
      { type: 'list', items: [
        '**Indexes.** An index lets the database find rows without reading the whole table. It costs space and slows every write, so index the columns your slow queries filter and sort on, not everything. Ask the database for the query plan to see whether it uses the index.',
        '**N+1 queries.** The code runs one query for a list, then one more query for each item. Twenty products means twenty-one round trips. Fix it with one query that joins or fetches in a batch.',
        '**Read replicas.** A replica is a read-only copy that serves reads and takes load off the primary. It copies changes with a small delay, so it may show data slightly old. That is fine for a report and wrong right after a user saved something: send reads that follow a write to the primary.',
      ] },
      {
        type: 'code',
        language: 'typescript',
        label: 'An N+1 query (fragment: db is assumed)',
        code: `async function loadProducts(storeId: string) {
  const products = await db.query('SELECT id, name FROM products WHERE store_id = $1', [storeId]);
  for (const product of products.rows) {
    // One extra round trip for every product in the list.
    const stock = await db.query('SELECT quantity FROM stock WHERE product_id = $1', [product.id]);
    product.quantity = stock.rows[0]?.quantity ?? 0;
  }
  return products.rows;
}`,
      },
      {
        type: 'code',
        language: 'sql',
        label: 'The same result in one query, still filtered by tenant',
        code: `SELECT p.id, p.name, COALESCE(s.quantity, 0) AS quantity
FROM products p
LEFT JOIN stock s ON s.product_id = p.id
WHERE p.store_id = $1;`,
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or existing system, the cache becomes a dependency with its own incidents. After a restart or a flush the cache is empty, and the cold start can send the full load to the database, so plan a warm-up or a gradual ramp. Never treat the cache as the source of truth; it can evict any entry at any time. Negative caching (remembering "not found") protects the database from repeated misses but can hide a newly created row for as long as its expiry. In a multi-tenant system, one big tenant can fill a shared cache and push out everyone else's entries, so consider per-tenant quotas or key prefixes with limits. Replica lag is a correctness question, not only a performance one: decide per feature which reads need the primary, and monitor lag as a metric.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'A caching plan with a leak and a stale answer built in', prompt: `TindaTrack's dashboard (today's sales and low-stock list) is slow on busy mornings. It is a multi-tenant app: every store's data must stay private. Suggest how to speed it up with caching and read replicas.`, output: `Cache the dashboard JSON in Redis under the key "dashboard_summary" for 24 hours, so every owner gets the fast version. Send all reads, including the ones after a save, to a read replica to reduce primary load. You do not need to invalidate anything: the cache will refresh itself at midnight.`, notice: `Check this against the facts you gave it. The key "dashboard_summary" has no tenant in it, so it reproduces Mika's leak: one store's dashboard is shown to every store. A 24-hour lifetime means sales appear a day late, and the answer says "you do not need to invalidate anything" without asking how fresh the data must be. Sending reads after a save to a replica can show an owner the old data they just changed. It also never asks whether the slowness is a missing index or an N+1 query, which are cheaper fixes. Ask the assistant for the key, the freshness requirement and the cause before the cache.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write your own caching plan first: what you would cache, the key, how fresh each answer must be, and how it is invalidated. Then ask an assistant to attack it. Treat what it finds as leads to test.` },
      { type: 'prompt', label: 'Cache and query review', text: `My system: [short description, and whether it is multi-tenant].\nThe slow thing: [the page or query, and what I measured, or "not measured yet"].\nMy plan: [what I would cache, the exact key, the expiry, how a change is reflected, and where reads go].\nHow fresh each answer must be: [for example "sales up to one minute old; prices immediately"].\n\nAct as a critical reviewer. 1) Find any way my keys could return one tenant's or user's data to another. 2) For each cached answer, say whether my expiry and invalidation match the freshness I wrote, or are a guess. 3) Describe the stampede risk on my busiest key and one defence. 4) List cheaper fixes I should rule out first (indexes, repeated queries, N+1) and what I would look at to rule them out. 5) Say what you cannot know without my measurements. Do not rewrite my plan.` },
      { type: 'paragraph', text: `Then test the claims: write the two-tenants test for your key, read the query plan for the slow query, and count the queries one page load runs. Those three checks are worth more than any answer.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Count the queries one page load runs in your system. If a number grows with the size of a list, look for an N+1.',
        'Write a test that loads the same page as two tenants and fails if the output ever matches.',
        'Next, lesson 29 shows how to prove where the time goes before you change anything.',
        'Reread the indexing lesson in the database module for how an index is chosen and what it costs.',
      ] },
      { type: 'takeaways', items: [
        'A cache keeps a copy of an answer. Its costs are staleness, sharing and a sudden return to the slow path, and it must fail soft.',
        'A key must hold everything that changes the answer, above all the tenant. A shared cache is part of the security boundary.',
        'State how fresh each answer must be. Use expiry for simple cases and delete-on-write for answers that must show a change at once.',
        'Defend against a stampede with one rebuilder, jittered expiry, warm-up and limits on the expensive query.',
        'Check indexes, N+1 queries and read-replica lag before adding more machinery.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-28-scenario-1',
          kind: 'scenario',
          title: 'The price that did not change',
          prompt: `Choose the best way to fix the staleness.`,
          concept: 'cache invalidation',
          situation: `TindaTrack caches each store's price list for ten minutes. An owner changes a price, opens the list, and still sees the old price. She changes it again, thinking the save failed. The requirement says a price change must show on the owner's own screen at once, while other screens can be a minute behind.`,
          options: [
            { text: `Delete that store's cached price list whenever a price is saved, and keep the short expiry for everything else.`, consequence: `The owner sees her change at once, and the cache still protects the database for the screens that can be a minute behind.`, quality: 'best' },
            { text: `Cut the expiry of everything to one second.`, consequence: `Prices look right, but the cache now barely helps, so the database load that caused the cache returns.`, quality: 'acceptable' },
            { text: `Turn the cache off for price lists.`, consequence: `The price is always current, but the page is slow again on busy mornings, and the requirement allowed a cheaper fix.`, quality: 'acceptable' },
            { text: `Tell owners to wait ten minutes before checking a change.`, consequence: `The requirement is broken, owners re-enter prices, and duplicate edits make the data worse.`, quality: 'poor' },
          ],
          hints: [
            `The requirement has two freshness levels. Which part of the system needs the stricter one?`,
            `Look for the option that is precise: it changes only what must change.`,
            `Shortening every expiry or removing the cache gives up the cache's benefit to fix one case.`,
          ],
          explanation: `Delete-on-write gives immediate freshness exactly where it is required, and expiry handles the rest. The other options either weaken the cache everywhere or ignore the requirement.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-28-arrange-1',
          kind: 'arrange',
          title: 'Cache-aside in order',
          prompt: `Put the steps of a cache-aside read in the right order.`,
          concept: 'cache-aside',
          language: 'text',
          solution: [
            'Build the cache key from the tenant and the data shape',
            'Ask the cache for that key',
            'On a hit, return the cached answer',
            'On a miss, read the answer from the database for that tenant',
            'Store the answer in the cache with an expiry',
            'Return the answer to the caller',
          ],
          alternatives: [
            [
              'Build the cache key from the tenant and the data shape',
              'Ask the cache for that key',
              'On a miss, read the answer from the database for that tenant',
              'Store the answer in the cache with an expiry',
              'Return the answer to the caller',
              'On a hit, return the cached answer',
            ],
          ],
          reasons: [
            'The key comes first, and it must name the tenant, or the next steps are unsafe.',
            'The cache is always asked before the database.',
            'A hit ends the work early with no database call.',
            'Only a miss reaches the database, and the read stays filtered by tenant.',
            'The answer is stored with an expiry so the next request can be a hit.',
            'The caller gets the answer either way.',
          ],
          hints: [
            `What must exist before you can ask the cache anything?`,
            `The cache is checked before the database. Which step ends the work early?`,
            `Storing the answer happens only after you read it from the database.`,
          ],
          explanation: `The sequence is key, cache, then database only on a miss, then store with an expiry. A key without the tenant, or storing before reading, breaks the pattern.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-28-match-1',
          kind: 'match',
          title: 'Name the cache or query problem',
          prompt: `Match each symptom to the problem behind it.`,
          concept: 'caching and query problems',
          labels: { terms: 'The symptom', meanings: 'The problem' },
          pairs: [
            { term: `Store A's owner sees Store B's totals on the dashboard.`, definition: `A cache key without the tenant in it`, note: `Both stores asked for the same key and shared one answer.` },
            { term: `At 08:00, a popular entry expires and the database CPU jumps for a minute.`, definition: `A cache stampede`, note: `Many requests missed together and ran the same expensive query.` },
            { term: `A page showing 50 products makes 51 database round trips.`, definition: `An N+1 query`, note: `One query for the list plus one for each item.` },
            { term: `An owner saves a price and an instant later the list shows the old price.`, definition: `Reading from a replica that has not caught up`, note: `The replica copies changes with a small delay.` },
          ],
          hints: [
            `Ask what is shared, what happens at the same moment, or what repeats per item.`,
            `One symptom involves a delay between saving and reading.`,
            `Match by cause, not by where the symptom appears.`,
          ],
          explanation: `Each symptom points at one cause with one fix: put the tenant in the key, spread or rebuild expiry, batch the queries, or read from the primary after a write.`,
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-28-q1',
        prompt: `A cached report is keyed by the report name only. TindaTrack is multi-tenant. What is the most important correction?`,
        choices: [
          `Raise the lifetime so entries stay long enough that most stores load the cached copy and the database sees far fewer requests overall.`,
          `Add the tenant to the key (and anything else that changes the answer), and test with two tenants that the output never matches.`,
          `Move the cache to the browser, since the browser belongs to one person and cannot mix up two stores.`,
          `Lower the lifetime to a few seconds so that any leak ends quickly and is unlikely to be noticed by owners.`,
        ],
        answer: 1,
        explanation: `The key decides who shares an answer. A tenant in the key prevents the leak, and a two-tenant test keeps it from returning. Changing the lifetime only changes how long the wrong data is shown.`,
      },
      {
        id: 'software-architecture-ai-28-q2',
        prompt: `The requirement says "dashboard sales may be up to one minute old". Which cache design fits it best?`,
        choices: [
          `Cache for a day and refresh at midnight, because a daily refresh is the easiest to operate.`,
          `Do not cache, because any cache can show data that is older than the database's current value.`,
          `Cache with a sixty-second expiry and the tenant in the key, with jitter on the expiry.`,
          `Cache with no expiry and delete the entry whenever any sale is saved, because that is always the safest rule and keeps data fresh.`,
        ],
        answer: 2,
        explanation: `The expiry should match the stated freshness. A day is far too old, no cache gives up the benefit, and deleting on every sale rebuilds the entry constantly on a busy store.`,
      },
      {
        id: 'software-architecture-ai-28-q3',
        prompt: `A page makes one query for 40 stores' products and then one query per product for its stock. What is the right fix?`,
        choices: [
          `Replace the queries with one that joins or batches stock, so the number of round trips no longer grows with the list.`,
          `Cache the stock number of each product for a day, so that the extra queries are rarely needed.`,
          `Add a read replica and send the per-product queries to it, so the primary is not busy with the extra reads from this page.`,
          `Add more app servers so the per-product queries run in parallel on different machines.`,
        ],
        answer: 0,
        explanation: `The problem is the count of round trips. Batching removes it. A cache, a replica or more servers each hide the pattern and add their own costs.`,
      },
      {
        id: 'software-architecture-ai-28-q4',
        prompt: `After a restart, the cache is empty and the database CPU spikes for a few minutes. Which response best addresses the cause?`,
        choices: [
          `Keep the cache's contents on the app servers' disks so that a restart never empties it, and leave the database exactly as it is today.`,
          `Make the cache larger so a restart can never remove any entry from it.`,
          `Warm the most important entries after a restart and limit how many requests run the expensive query at once.`,
          `Disable expiry on all entries so the cache never needs to rebuild anything while it is running.`,
        ],
        answer: 2,
        explanation: `A cold cache sends the whole load to the database. Warm-up and concurrency limits spread the rebuild. A bigger cache or no expiry does not help an empty one.`,
      },
      {
        id: 'software-architecture-ai-28-q5',
        audience: { max: 'beginner' },
        prompt: `In the notepad comparison, why must the label on each note include the shop's name?`,
        choices: [
          `So that one shop never reads another shop's note by mistake.`,
          `So that the note lasts longer before it has to be thrown away.`,
          `So that the filing cabinet can be removed.`,
        ],
        answer: 0,
        explanation: `The label decides who shares a note. Without the shop in it, shops share one answer.`,
      },
      {
        id: 'software-architecture-ai-28-q6',
        audience: { min: 'advanced' },
        prompt: `One very large tenant's reports are filling a shared cache, and other tenants see slower pages because their entries are evicted. What is the best response?`,
        choices: [
          `Remove the cache for every tenant so that no one tenant, including the biggest one, can affect another through it.`,
          `Give every entry the same long lifetime so that nothing is evicted before it expires.`,
          `Move the biggest tenant's reports to the browser cache only, where the server never sees them.`,
          `Apply a per-tenant share of the cache (a quota or a limited key prefix) and measure the hit rate per tenant first.`,
        ],
        answer: 3,
        explanation: `A shared resource needs a fair share per tenant, and the per-tenant hit rate shows whether it works. Removing the cache or lengthening lifetimes does not stop one tenant crowding out the others.`,
      },
    ],
    task: {
      title: 'Audit one cache and one query',
      minutes: 18,
      steps: [
        `Pick one cached answer (or one you would like to cache) in a system you know. Write its key, its expiry and how fresh it must be.`,
        `For a multi-tenant system, write the two-tenants test in words: which two tenants, which request, and what must never match.`,
        `Find one page or job and count the database queries it runs. If the count grows with the size of a list, write the batched query that would replace the loop.`,
        `Write which reads may use a replica and which must use the primary, with one line of reason each.`,
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: [`Think of a shopping list you copy from a bigger one. Write one thing that could go wrong if the big list changes and your copy does not.`] },
      { audience: { min: 'advanced' }, steps: [`Write the cold-start plan for your busiest cache: what is warmed first, the limit on concurrent rebuilds, and the metric that tells you the database is being overwhelmed.`] },
    ],
  },
  {
    id: 'software-architecture-ai-29',
    day: 29,
    title: 'Finding the Bottleneck: Measure Before You Redesign',
    summary: 'Use a measurement loop (profile, trace, load test) to find the one step that limits the system, read percentiles instead of averages, and never redesign without evidence.',
    intro: {
      objectives: [
        'Describe the measure, hypothesise, change one thing and measure again loop',
        'Match a performance question to the tool that answers it: metrics, a trace, a profiler, a query plan or a load test',
        'Explain in plain words why the 95th percentile matters more than the average, and why speeding up a small part barely helps',
        'Spot the weak points in a measurement: the wrong environment, too little data, a statistic mismatch',
      ],
      why: `Teams lose weeks redesigning the wrong part. A habit of measuring first turns a heated argument about opinions into a short check of facts, and it is the cheapest architecture skill there is.`,
    },
    minutes: 26,
    skills: ['arch-reliability'],
    body: [
      { type: 'paragraph', text: `Every system has a bottleneck: the one step or resource that limits how much work gets done or how fast. Fix it and the limit moves to the next step, so there is always one. The skill is finding the real one. People are surprisingly bad at guessing it, even people who built the system. This lesson gives you a loop for finding it, the tools for each question, and a rule that is easy to say and hard to follow: do not redesign anything until a measurement points at it.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `After the slow morning on the first of the month, TindaTrack's team met to decide what to do. Ben, a developer, wanted to split reports into their own microservice and add servers. Mika wanted to cache the report. A third colleague wanted a bigger database. Each proposal was reasonable and each came with a lot of confidence. The lead asked one question: "What does the trace of a slow request say?" Nobody had looked.` },
      { type: 'paragraph', text: `The trace showed that almost all of one slow request's time was spent in a single database query, and the monitoring showed the database busy while the app servers were mostly idle. A missing index was the likely reason, and a copy of production data confirmed it: with the index, the same request was fast in the team's test. A week of design discussion could have been an afternoon of measuring. (The note Ben wrote is the material of the lab in this lesson, and all its numbers are invented for the exercise.)` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Think of a doctor. A doctor does not operate because the patient says "my stomach hurts" and the doctor has a favourite theory. The doctor asks questions, orders a test, forms a diagnosis, treats one thing and checks that the patient improves. Performance work has the same shape, and the same danger: treating a guess is how you make a healthy part worse.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[State the symptom with a target] --> B[Measure where the time goes]
  B --> C[Form one hypothesis]
  C --> D[Change one thing]
  D --> E[Measure again the same way]
  E --> F{Target met}
  F -->|no| B
  F -->|yes| G[Stop and record what you learned]`,
        caption: 'The measurement loop. Look at the decision: you stop when the target is met, and you only ever change one thing between two measurements.',
      },
      { type: 'paragraph', text: `The loop starts with a **target**, taken from the quality attributes you wrote in module 2 (for example, "the monthly report loads fast enough at month start"). Without a target you cannot say when you are done, and you will keep optimising something that no user feels. Then each question has a tool that answers it:` },
      {
        type: 'table',
        headers: ['The question', 'The tool', 'What it shows'],
        rows: [
          ['Is it slow, and for how many users?', 'Metrics and monitoring', 'Request times over time, as percentiles, plus errors and traffic'],
          ['Where in one request does the time go?', 'A trace', 'The steps of a single request with the time of each: the app, each query, each outside call'],
          ['Which part of my code burns the CPU?', 'A profiler', 'Which functions use the most processor time or memory'],
          ['Which database query is slow, and why?', 'The slow query log and the query plan', 'The slowest queries, and whether the database uses an index or reads the whole table'],
          ['Is a machine the limit?', 'Resource metrics', 'CPU, memory, disk, network and connections for each server and the database'],
          ['Will it hold at the load we expect?', 'A load test, run as an experiment', 'How response times and errors change as simulated load rises'],
        ],
        caption: 'Pick the tool by the question. A load test tells you whether something is slow under load. A trace tells you where. A plan tells you why a query is slow.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: measuring is like checking the water meter before you decide which tap is leaking. A trace is a stopwatch that records how long each stage of one request took. The 95th percentile is a way of describing the unlucky users: if the 95th percentile is 12 seconds, then 95 out of 100 requests were faster than 12 seconds and 5 out of 100 were slower. An average can look fine while a few people wait very long, so always look at the slow end as well. The one rule of the loop is: change only one thing at a time, or you will not know what helped.` },
      { type: 'paragraph', text: `**Percentiles, not just averages.** The average of a few fast requests and a few very slow ones looks fine and describes nobody's experience. Report the 95th percentile (or the 99th) next to the average. When two numbers are compared, they must be the same statistic: an average from one test and a percentile from another tell you nothing about each other.` },
      { type: 'paragraph', text: `**Amdahl's idea in plain words.** If a step takes only a small share of the total time, then making it faster, even infinitely fast, can save at most that share. As an invented illustration, if a request spends about nine tenths of its time waiting on one query, then fixing that query is the only change that matters. Making the other tenth ten times faster hardly changes what the user feels. The same idea limits adding servers: the part of the work that cannot be done in parallel, such as one shared database query, caps the gain from more copies. So find the biggest share first.` },
      { type: 'paragraph', text: `**A load test is an experiment.** Write down the question ("does the report stay under our target at the month-start request rate?") and your prediction before you run it. Use data and an environment that resemble production, because a test on a laptop with a tiny data set can only tell you about a laptop with a tiny data set. Raise the load in steps, watch the resource metrics as well as the response times, change one variable at a time, and keep the results. Be careful about testing production itself.` },
      { type: 'list', items: [
        '**Wrong place:** a measurement taken on a different machine, with much less data or a warm cache says little about production.',
        '**Wrong statistic:** an average compared with a percentile.',
        '**One run:** a single number may be luck. Repeat it.',
        '**Many changes at once:** you cannot tell which one helped, or which one hurt.',
        '**No target:** you cannot tell when to stop.',
        '**Nothing to measure:** if you cannot see where the time goes, the first job is to add visibility (logs, metrics and traces, in the next lesson), not to redesign.',
      ] },
      { type: 'paragraph', text: `The decision rule for the whole lesson: change the architecture only when a measurement points at it, you have a hypothesis about why, and you can measure again afterwards. Often the evidence points at something far cheaper than a redesign: an index, a query, a missing cache entry, a connection limit. When the evidence does point at the architecture, you can act with confidence, because you can show why.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or existing system the traps are subtler. Latency grows sharply as a resource nears full use, so a system at moderate average load can still queue at its peak. Tail latency compounds across calls: a request that makes several downstream calls is slow whenever any one of them is slow, so the user feels the worst of them, not the average. Load generators that wait for each response before sending the next (a closed model) under-report delays that real arriving users would see, so use one that sends at a fixed rate. Tracing is usually sampled, so a rare slow path may be missing from the traces you look at. Sharing a performance budget per request, and failing a build when a key path exceeds it, keeps a fix from silently eroding.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'A diagnosis that ignores the numbers it was given', prompt: `Our monthly report is slow. Here are the numbers (invented): report request average 4.2 s, 95th percentile 11.8 s; app server CPU about 30%; database CPU about 85%; one slow trace of 11.6 s spent 10.9 s in one sales-totals query. Nobody has looked at the query plan. What is the root cause and what should we redesign?`, output: `The root cause is architectural. CPU at 30% shows the app servers are healthy, and 85% database CPU is normal for a busy system. The tightly coupled reports module is the problem. Extract reports into a separate microservice with its own database; this will cut latency by 70%.`, notice: `Test each sentence against the numbers in the prompt (all invented). The trace puts 10.9 of 11.6 seconds in one query, and the database is the busy part, so the evidence points at that query, not at the app's structure. The answer calls 85% database CPU "normal" without a reason and does not mention the unchecked query plan. "Cut latency by 70%" is a figure with no basis. A microservice with its own database is a large step that the numbers do not ask for. Reply by asking the assistant which conclusions the numbers support and which measurement should come next.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Take a performance problem you know and write down what you measured, what you did not, and your hypothesis. Then ask an assistant to sort your claims by evidence. If you have nothing measured, ask it what to measure first.` },
      { type: 'prompt', label: 'Evidence review', text: `The symptom and its target: [for example "the report page should load within X seconds at month start"].\nWhat I measured: [numbers with where and how I measured them: environment, data size, average or percentile].\nWhat I have not measured: [list].\nMy hypothesis and the change I plan: [your own].\n\nAct as a sceptical reviewer, using only what I wrote. 1) For each claim I make, say whether my numbers support it, contradict it or cannot decide it. 2) Point out any comparison that is not like with like (environment, data size, statistic). 3) Name the one measurement that would settle my hypothesis fastest. 4) Describe the cheapest possible change to try and how I would measure it again. 5) Say what you cannot tell from my text. Do not recommend a redesign unless my numbers call for one.` },
      { type: 'paragraph', text: `Verify the answer against your own numbers: every figure it quotes must be one you gave it. Run the measurement it suggests, and write down the result before you change anything.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Run the lab in this lesson: review the incident note with a prompt that sorts evidence from opinion.',
        'Write a target for one real page or job in your system, with a number, and find which tool would show where its time goes.',
        'Next, lesson 30 builds the visibility (logs, metrics, traces) this loop depends on, and the recovery side of reliability.',
        'Read your database\'s documentation page on query plans for the database you actually use.',
      ] },
      { type: 'takeaways', items: [
        'Every system has a bottleneck. The skill is finding the real one with a loop: target, measure, one hypothesis, one change, measure again.',
        'Pick the tool by the question: metrics (how slow), a trace (where), a profiler (which code), a query plan (why a query is slow), a load test (will it hold).',
        'Read the 95th percentile, not just the average, and compare like with like: same environment, data size and statistic.',
        'A step that takes a small share of the time cannot save more than that share. Find the biggest share first.',
        'Do not redesign without a measurement that points at it. Cheap causes (an index, a query, a limit) come first.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-29-prompt-lab-1',
          kind: 'prompt-lab',
          labId: 'arch-08-incident-note',
          title: 'Lab: which conclusions does the evidence support?',
          prompt: `Review Ben's incident note with a prompt that makes the model separate what the numbers support from what they do not, and name the next measurement. Use only the note as your source.`,
          concept: 'measure before you redesign',
          hints: [
            `Ask the model to go through Ben's conclusions one at a time and quote the numbers that support or contradict each.`,
            `The note mixes several kinds of evidence. Ask whether the load test, the trace and the monitoring figures are comparable and which statistic each one uses.`,
            `Ask what has not been measured and which single measurement would settle the question, then check every figure in the answer against the note.`,
          ],
          explanation: `A strong prompt makes the model read the evidence, not repeat the proposal. The note's own numbers show the database busy and one query taking most of a slow request, which Ben's conclusion does not mention, and the load test used far less data than production. Your review is a guide, not a grade, and another run may differ.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-29-scenario-1',
          kind: 'scenario',
          title: 'Three proposals and one trace',
          prompt: `Choose what the lead should do first.`,
          concept: 'measurement before redesign',
          situation: `Three proposals are on the table: a reports microservice, a cache for the report, and a bigger database. A trace of one slow request shows most of its time in a single query. Database CPU was high and the app servers were mostly idle. Nobody has looked at that query's plan. Month end is in three weeks.`,
          options: [
            { text: `Get the query plan for that query and test an index on a copy of production-sized data, then measure the same request again before choosing anything else.`, consequence: `In an afternoon the team sees whether an index explains the delay. If it does, the other proposals are unneeded. If not, they have a clearer question.`, quality: 'best' },
            { text: `Add the cache for the report first because it is quick and visible, then measure again.`, consequence: `Repeat loads become fast, but the first load of every store is still slow, the cache adds an invalidation question, and the real cause stays hidden.`, quality: 'acceptable' },
            { text: `Do all three proposals, to be safe before month end.`, consequence: `Three weeks of work, three new things to operate, and no way to tell which of them helped, or whether any was needed.`, quality: 'poor' },
            { text: `Go with the microservice, because the most senior developer proposed it.`, consequence: `The decision rests on rank, not evidence. The slow query moves into a new service and is still slow.`, quality: 'poor' },
          ],
          hints: [
            `What does the trace already say about where the time goes? What is the cheapest next fact to learn?`,
            `Look for the option that tests the likeliest cause and measures again.`,
            `An option that does everything cannot tell you what worked.`,
          ],
          explanation: `The trace points at one query, so the cheapest next step is to look at that query's plan and test a change on realistic data. Measuring again closes the loop. A cache is a possible later step, and a redesign or a vote by seniority is not evidence.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-29-arrange-1',
          kind: 'arrange',
          title: 'The measurement loop in order',
          prompt: `Put the steps of a performance investigation in a sensible order.`,
          concept: 'the measurement loop',
          language: 'text',
          solution: [
            'Write the symptom and a target with a number',
            'Measure where the time goes with a trace and metrics',
            'Write one hypothesis that the measurement supports',
            'Change one thing, on a copy that resembles production',
            'Measure again the same way and compare',
            'Keep the change if the target is met, or revert it and form a new hypothesis',
          ],
          reasons: [
            'Without a target you cannot say when you are done.',
            'The measurement decides where to look, so it comes before any idea.',
            'A hypothesis comes from evidence, not from a favourite theory.',
            'One change on a realistic copy shows what that change did.',
            'Measuring the same way makes the two numbers comparable.',
            'The result decides: keep it, or revert and try again.',
          ],
          hints: [
            `What must you know before you can say you are done? That is the first step.`,
            `A hypothesis follows a measurement. Which step produces the evidence?`,
            `The comparison needs the same method as the first measurement.`,
          ],
          explanation: `The loop runs target, measure, hypothesis, one change, measure again, decide. Changing before measuring, or changing several things at once, breaks it.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-29-match-1',
          kind: 'match',
          title: 'Which tool answers the question?',
          prompt: `Match each performance question to the tool that answers it best.`,
          concept: 'performance tools',
          labels: { terms: 'The question', meanings: 'The tool' },
          pairs: [
            { term: `One report request took 11 seconds. Which step of it was slow?`, definition: `A trace of that request`, note: `A trace splits one request into its steps and shows the time each took.` },
            { term: `Which function in the app is using the most processor time?`, definition: `A profiler`, note: `A profiler attributes CPU time to the functions of the code.` },
            { term: `Why does one query read the whole table instead of using an index?`, definition: `The query plan`, note: `The plan shows how the database decided to run the query.` },
            { term: `Will the report page stay under the target when 160 requests a minute arrive?`, definition: `A load test run as an experiment`, note: `Only a test with realistic load and data can answer how the system behaves under load.` },
          ],
          hints: [
            `Ask whether the question is about one request, one function, one query or a whole load.`,
            `The word "why" about a query points at what the database decided.`,
            `Questions about "will it hold" need simulated load.`,
          ],
          explanation: `Each tool answers a different question. Choosing by the question saves hours of looking in the wrong place.`,
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-29-q1',
        prompt: `A team compares a load test result of "average 0.6 s" with a production figure of "95th percentile 11.8 s" and concludes the app is fine. What is wrong with the comparison?`,
        choices: [
          `It compares different statistics, and the test used a different environment and far less data, so the two numbers say nothing about each other.`,
          `It uses percentiles at all. Averages are the only valid measure of speed, and the production figure should simply be discarded as noise.`,
          `It compares a test with production. A load test result is always more accurate than anything that was seen in production.`,
          `It is correct, because a lower number in a test means the production figure must be a measurement mistake.`,
        ],
        answer: 0,
        explanation: `A comparison needs the same statistic, a similar environment and comparable data. Here none of the three match.`,
      },
      {
        id: 'software-architecture-ai-29-q2',
        prompt: `A request spends about nine tenths of its time waiting on one query. A developer proposes making the other tenth ten times faster. What is the likely effect?`,
        choices: [
          `The request becomes about ten times faster, because the faster part dominates the result.`,
          `The request becomes about twice as fast, since half of the work is now much quicker.`,
          `The request improves only slightly, because the part being sped up was a small share of the total.`,
          `The request becomes slower, since a faster part always makes the waiting part wait longer for the next step.`,
        ],
        answer: 2,
        explanation: `A step that is a small share of the time cannot save more than that share. The nine tenths is where the gain is.`,
      },
      {
        id: 'software-architecture-ai-29-q3',
        prompt: `Which situation most clearly means "add visibility first" and not "redesign"?`,
        choices: [
          `The team has a trace and metrics that point to one slow query, and wants to try an index.`,
          `The team has an agreed target, a load test and the numbers from it, and the numbers point at the database.`,
          `The page is slow, nobody can say where the time goes, and the only data is that users have complained.`,
          `The team already knows that the app servers are at full CPU in production and wants to add two more.`,
        ],
        answer: 2,
        explanation: `Without any view of where the time goes, every proposal is a guess. The first job is to add logs, metrics or traces.`,
      },
      {
        id: 'software-architecture-ai-29-q4',
        prompt: `A teammate changed an index, added a cache and doubled the app servers in one release, and the page got faster. What should you do before keeping all three?`,
        choices: [
          `Keep all three, because the result is good and the cause no longer matters to the team.`,
          `Keep the cache, because caches are the most common cause of improvements in web systems.`,
          `Remove the index, because indexes make writes slower and are the least visible of the three changes in that one release.`,
          `Find out which change helped by undoing and re-measuring them one at a time, so you do not keep cost that did nothing.`,
        ],
        answer: 3,
        explanation: `Three changes at once hide the cause. Re-measuring one at a time shows what is worth keeping and what only adds cost.`,
      },
      {
        id: 'software-architecture-ai-29-q5',
        audience: { max: 'beginner' },
        prompt: `If the 95th percentile of a request is 12 seconds, what does that tell you?`,
        choices: [
          `Every request takes exactly 12 seconds.`,
          `The fastest requests take 12 seconds.`,
          `About 95 out of 100 requests are faster than 12 seconds, and about 5 are slower.`,
        ],
        answer: 2,
        explanation: `A percentile describes the slow end. The average can hide those few long waits.`,
      },
      {
        id: 'software-architecture-ai-29-q6',
        audience: { min: 'advanced' },
        prompt: `Your load generator sends the next request only after the last one finishes. The test shows no problem, but users report long waits at peak. What is the likely weakness in the test?`,
        choices: [
          `The test is too short. Run it for the same time at the same rate and the problem will appear if the test keeps on running for longer than it did.`,
          `The generator waits for responses, so when the system slows it sends less and hides the delay users would see. Use a fixed arrival rate.`,
          `The test used percentiles, which hide the delay. Switch to averages for the next run.`,
          `The test ran against the staging cache. Disable the cache and the real delay will show.`,
        ],
        answer: 1,
        explanation: `A closed model slows its own sending when the system slows, which under-reports queueing. A fixed arrival rate shows what users arriving independently would feel.`,
      },
    ],
    task: {
      title: 'Write a measurement plan for one slow thing',
      minutes: 18,
      steps: [
        `Pick one slow page, job or query in a system you know. Write the symptom and a target with a number (or, if you have none, how you would choose one).`,
        `List what you have measured so far, and where and how, and then what you have not measured.`,
        `Write one hypothesis and the tool that would test it (metrics, a trace, a profiler, a query plan or a load test). Say what result would prove you wrong.`,
        `Describe the single cheapest change to try, the environment and data you would use, and how you would measure again.`,
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: [`Think of something slow in daily life (a queue at a shop, a slow app). Write where you think the time goes, how you could find out for sure, and what you could change first.`] },
      { audience: { min: 'advanced' }, steps: [`Write a load test as an experiment for your system: the question, the prediction, the arrival rate and data shape, the metrics to watch, and the result that would make you change the design.`] },
    ],
  },
  {
    id: 'software-architecture-ai-30',
    day: 30,
    title: 'High Availability, Fault Tolerance, Observability and Disaster Recovery',
    summary: 'Design for failure: remove single points of failure, protect calls with timeouts, backoff, breakers and bulkheads, see what is happening with logs, metrics and traces, and recover with tested backups against clear RPO and RTO targets.',
    intro: {
      objectives: [
        'Explain the difference between high availability, fault tolerance and disaster recovery, and what each protects against',
        'Protect a call to another system with a timeout, limited retries with backoff and jitter, a circuit breaker and a graceful fallback',
        'Name what logs, metrics and traces each answer, and describe an SLO as an idea that guides alerts',
        'Define RPO and RTO, and explain why a backup that has not been restored is only a hope',
      ],
      why: `Everything fails eventually: a server, a network link, a provider, a person. Systems that stay trusted are the ones whose failures were planned for, visible while they happen, and recoverable on a drill you have already run.`,
    },
    minutes: 28,
    skills: ['arch-reliability'],
    body: [
      { type: 'paragraph', text: `The earlier lessons of this module made a system faster and bigger. This one makes it survive. Four ideas work together. High availability keeps the system running when a part fails. Fault tolerance keeps it behaving correctly while it fails. Observability lets you see what is happening and why. And disaster recovery gets you back after a loss that the first two could not absorb. The thread through all of them is the same: decide what you can afford to lose and how long you can afford to be down, write it as a number, and then test that your design meets it.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack takes online payments through an e-wallet provider. One evening the provider's service became slow, but not down. Every sale that needed a payment confirmation waited. Mika's code had no timeout on that call, so each waiting request held one of the API's worker slots. Soon all the slots were taken, and even pages that never touched payments, such as the stock list, stopped answering. Worse, the code retried failed calls immediately, three times, so the struggling provider received three times the traffic. Store owners could not record sales for most of an evening.` },
      { type: 'paragraph', text: `No single bug caused it. Four missing habits did: no timeout, no limit on retries, no separation between payment work and the rest, and no fallback. Each is cheap to add and each was skipped because the happy path worked.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Think of a car. Seat belts and a spare tyre do not stop accidents or punctures, they make them survivable. A dashboard shows you the problem while you are still driving. And insurance, which you hope never to use, pays for the loss you could not avoid. This lesson gives a system its seat belts, spare tyre, dashboard and insurance.` },
      { type: 'paragraph', text: `**High availability** means removing single points of failure through redundancy, detecting failures quickly and switching over automatically, as in the two-zone design of lesson 24. Availability is judged by what users can do, not by whether a server is running. More redundancy costs more money and more moving parts, and a failover that has never been tried cannot be trusted. **Fault tolerance** goes further: the system keeps working correctly when a part or a dependency fails. The tools are a short list, and they work together:` },
      {
        type: 'table',
        headers: ['Pattern', 'What it protects against', 'The catch'],
        rows: [
          ['Timeout on every outside call', 'Waiting forever on a slow dependency, and using up workers while waiting', 'Too short causes false failures; set it from how long the caller can really wait'],
          ['Retry with exponential backoff and jitter', 'A short glitch, without piling load on a struggling service', 'Only safe if the operation can be repeated safely (idempotent, lesson 23); always cap the attempts'],
          ['Circuit breaker', 'Calling a dependency that is known to be failing, over and over', 'It needs a rule for when to try again, and a fallback for when it is open'],
          ['Bulkhead', 'One dependency using all the capacity and taking down unrelated features', 'Separate pools mean unused capacity in one pool cannot help another'],
          ['Graceful degradation', 'A hard failure when only a part is broken', 'Someone must decide what "less" means, such as "sale saved, payment pending"'],
          ['Load shedding', 'Overload that makes everything slow for everyone', 'Some requests are refused on purpose, so decide which ones'],
        ],
        caption: 'The tools of fault tolerance. Each guards against one failure, and none replaces the others.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Sale needs the e-wallet provider] --> B{Circuit open}
  B -->|yes| F[Save the sale as payment pending]
  B -->|no| C[Call with a timeout]
  C --> D{Succeeded}
  D -->|yes| E[Return the result]
  D -->|no| G{Safe to repeat and attempts left}
  G -->|yes| H[Wait with backoff and jitter]
  H --> C
  G -->|no| I[Count the failure for the circuit]
  I --> F`,
        caption: 'One call to a provider protected four ways. Look at the end of the failure path: the system degrades to "payment pending" instead of failing the sale or hanging.',
      },
      {
        type: 'code',
        language: 'typescript',
        label: 'Retry with backoff and jitter (fragment: the operation must have its own timeout and be safe to repeat)',
        code: `async function callWithRetry<T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;
      // Wait longer each time, with random jitter so many callers do not retry together.
      const delayMs = 200 * 2 ** (attempt - 1) * (0.5 + Math.random());
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}`,
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a timeout is giving up on a phone call that nobody answers. A retry with backoff is calling again after a pause that gets longer each time, and jitter is each caller pausing a slightly different time, so a hundred callers do not all redial at the same second. A circuit breaker is taking the number off your list for a while after it fails many times in a row. A bulkhead is the wall between ship compartments: a leak in one does not sink the ship. A fallback is the plan for when the call still does not work, such as writing the order on paper to enter later.` },
      { type: 'paragraph', text: `**Observability** is how you find out what is happening inside a running system. Three kinds of signal answer different questions:` },
      {
        type: 'table',
        headers: ['Signal', 'It answers', 'Watch out for'],
        rows: [
          ['Logs', 'What happened, in words: a record of events with details', 'Volume and cost; never log secrets or customers\' personal data; a request id in every line lets you follow one request'],
          ['Metrics', 'How much and how often over time: request rates, errors, latency, queue length', 'Averages hide the slow tail, so keep percentiles; too many series cost money'],
          ['Traces', 'Where one request spent its time across the parts of the system', 'Usually sampled, so a rare slow path may be missing'],
        ],
        caption: 'Metrics tell you that something is wrong, traces tell you where, and logs help you see why.',
      },
      { type: 'paragraph', text: `An **SLO** (service level objective) is a target for something users feel, measured over a period. For example: "most sale-saving requests succeed quickly enough, over a month". The difference between perfect and the target is the error budget, the amount of failure you can accept, and a team can use it to decide when to pause new features and fix reliability. Alert on symptoms users feel (sales failing, pages slow), not on every cause (one server's CPU), and give every alert an owner and a first step. An alert nobody answers is only noise.` },
      { type: 'paragraph', text: `**Disaster recovery** is getting back after a loss that redundancy did not absorb: a deleted table, corrupted data, a faulty release, a lost region. Two numbers define it. The **RPO** (recovery point objective) is how much data you can afford to lose, expressed as time: "no more than 15 minutes of saved sales". The **RTO** (recovery time objective) is how long you can afford to be down: "back within one hour". They are business decisions that engineering then has to meet, and the cost rises as both shrink. (The 15 minutes and one hour are an invented example, as are the numbers in the lab.)` },
      { type: 'paragraph', text: `Redundancy is not recovery. A standby database that copies changes continuously also copies a deleted table within seconds. Protection against deletion, corruption and a lost region needs backups kept somewhere else, kept long enough that you would notice the damage before the copy expires, and, above all, **tested**. A backup you have never restored is a hope. A restore drill checks the three things the targets care about: that the data is really there, how long the restore takes at production size, and how old the newest restored data is.` },
      {
        type: 'table',
        headers: ['Recovery approach', 'What it is', 'Speed of recovery', 'Cost and effort'],
        rows: [
          ['Backup and restore', 'Copies of data kept elsewhere; infrastructure rebuilt and data loaded when needed', 'Slowest', 'Lowest running cost; needs a practised restore and a written runbook'],
          ['Pilot light', 'Data replicated elsewhere and the rest of the system ready to start', 'Faster', 'Low running cost; start-up steps need testing'],
          ['Warm standby', 'A smaller but running copy elsewhere, with data replicated', 'Faster still', 'Moderate running cost and effort'],
          ['Active in two places', 'Full capacity in two places serving users at once', 'Fastest', 'Highest cost; data conflicts and operations get hard'],
        ],
        caption: 'Move down the table only as far as the RPO and RTO require. Each step costs more money and more operations work.',
      },
      { type: 'paragraph', text: `For TindaTrack, the simplest design that meets a written RPO and RTO could be: the managed database's standby in the second zone for zone failures, backups copied to a second region and account for deletions and region loss, a restore drill each quarter that records the time, and a runbook with a named person to declare a disaster. A heavier approach needs a requirement that this one fails.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or existing system, the hard failures are partial and correlated. A "gray failure" (a dependency that is slow or wrong, not down) defeats health checks that only ask "is it up?". Retries multiply across layers: three layers that each retry three times can turn one failure into twenty-seven calls, so budget retries across the whole call chain and prefer retrying at one layer. Error budgets only work if the team agrees in advance what happens when one is spent. Backups need their own protection: separate credentials and, where possible, copies that a compromised production account cannot delete. Recovery of the data is only part of recovery of the system, so rehearse the dependencies too (secrets, DNS, certificates, the pipeline that deploys). Failure drills, run first in a safe environment, find the gaps that diagrams hide.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'A recovery plan that proves nothing', prompt: `TindaTrack's targets are RPO 15 minutes and RTO 1 hour. We have a managed PostgreSQL primary in zone A with a standby in zone B, and a nightly backup in the same region. Write a short recovery plan.`, output: `Your standby in zone B gives you zero data loss, so your RPO is effectively zero and your RTO is near zero. Nightly backups are more than enough. Since the cloud provider guarantees 99.999% durability for stored backups, you do not need to test restores. No further work is required.`, notice: `Check each sentence against the prompt. A standby that copies changes continuously also copies a deleted table, so it does not cover deletion or corruption, and it sits in the same region, so it does not cover a lost region. A nightly backup can lose up to a day of data, which breaks the 15-minute target on its own. "99.999% durability" is a figure the assistant offered with no source, and even a durable backup is useless if the restore fails or is too slow, which only a drill shows. "No further work is required" is a promise nobody can make. Ask it which failure each mechanism covers and which claims are tested.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write your own targets and your own list of what protects each failure first. Then ask an assistant to find what is only claimed.` },
      { type: 'prompt', label: 'Resilience review', text: `My system: [short description and the dependencies it calls].\nMy targets: RPO [how much data I can lose, as time] and RTO [how long I can be down].\nWhat I have today: [redundancy, backups (where, how often, kept how long), monitoring and alerts, runbooks, who is on call].\nWhat I have actually tested: [restore drills, failovers, load tests, with dates and size of data].\n\nAct as a sceptical reviewer, using only what I wrote. 1) For each target, say which of my mechanisms help and which do not, and for which kinds of failure (a server, a zone, a deletion or corruption, a region, a slow dependency). 2) Separate what I have proven by a test from what I only assume. 3) List the gaps in order of risk with the cheapest fix for each. 4) Point out any outside call that lacks a timeout, a retry limit or a fallback in my description. 5) Say what you cannot tell from my text. Do not state a durability or availability figure.` },
      { type: 'paragraph', text: `Verify by running the cheapest test it suggests, such as a restore of last night's backup into an isolated database, with a clock. Write down the result before you believe any figure.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Run the lab in this lesson: review the draft recovery plan against its two targets.',
        'List every outside call in one service of yours and note which have a timeout, a retry limit and a fallback.',
        'Schedule one restore drill for your real or practice system and write down the time it takes.',
        'Next is Project 1 (after lesson 26) if you have not done it, and then the security module, which builds on the isolation and failure thinking you have now.',
      ] },
      { type: 'takeaways', items: [
        'High availability removes single points of failure, fault tolerance keeps behaving correctly while a part fails, and disaster recovery gets you back after a loss redundancy could not absorb.',
        'Protect every outside call with a timeout, limited retries with backoff and jitter (only for safe repeats), a circuit breaker, a bulkhead and a fallback.',
        'Logs say what happened, metrics say how much, traces say where. An SLO is a user-facing target, and alerts should follow symptoms and have owners.',
        'RPO is how much data you may lose and RTO is how long you may be down. They are business numbers the design must meet.',
        'A standby copies mistakes, so backups elsewhere are needed. A backup that has never been restored at realistic size is a hope, not a plan.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-30-prompt-lab-1',
          kind: 'prompt-lab',
          labId: 'arch-08-recovery-plan',
          title: 'Lab: a recovery plan against its own targets',
          prompt: `Review the draft recovery plan with a prompt that checks it against its RPO and RTO, separates what is tested from what is only claimed, and ranks the gaps. Use only the plan as your source.`,
          concept: 'RPO, RTO and tested recovery',
          hints: [
            `Name the two targets in your prompt and ask the model to test each mechanism in the plan against them, one at a time.`,
            `Ask which kinds of failure each mechanism covers: a zone, a deletion or corruption, or a whole region. A standby may not cover all of them.`,
            `Ask what has been tested and what is only assumed, then check each claim of "this meets the target" against the plan.`,
          ],
          explanation: `A strong prompt checks each mechanism against the targets and the kinds of failure, separates tested from claimed, and asks for gaps ranked by risk. The plan's nightly backups kept in the same place, the single small restore test and the stale failover steps are the gaps to find. Your review is a guide, not a grade, and another run may differ.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-30-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Run a restore drill',
          prompt: `Build the routine for a restore drill that tests TindaTrack's backup against its RPO and RTO. Pick the steps and put them in order. Some are tempting and wrong.`,
          concept: 'testing backups',
          situation: `TindaTrack has a nightly backup and a target of 15 minutes of data loss at most and one hour to recover. The backup job reports success every night, but no one has restored a production-sized backup. The drill must not touch production, and the result must lead to changes in the plan.`,
          parts: [
            { id: 'pick', lane: 'input', label: `Pick last night's backup and write down the start time`, detail: `The clock starts when the drill starts, so the restore time can be measured.` },
            { id: 'isolated', lane: 'tool', label: `Restore it into a separate, isolated database`, detail: `The copy lives apart from production, so nothing live is at risk.` },
            { id: 'ai-checks', lane: 'ai', label: `Ask an assistant to draft verification queries from the schema`, detail: `The assistant suggests checks such as row counts, the newest sale time and orphaned rows, as a starting list.` },
            { id: 'verify', lane: 'human', label: `Run the checks yourself and compare the results with what production holds`, detail: `A person confirms the data is really there and looks complete.` },
            { id: 'time', lane: 'tool', label: `Stop the clock and compare the total time with the RTO`, detail: `The measured restore time is compared with one hour.` },
            { id: 'rpo', lane: 'human', label: `Compare the age of the newest restored sale with the RPO`, detail: `The gap between the newest restored data and the moment of failure is compared with 15 minutes.` },
            { id: 'record', lane: 'output', label: `Write down the result, fix the runbook and schedule the next drill`, detail: `Any gap becomes a change, and the next drill gets a date.` },
            { id: 'over-prod', lane: 'tool', label: `Restore over the production database to see if it works`, detail: `The live database is replaced by the backup as the test.` },
            { id: 'job-ok', lane: 'human', label: `Assume the backup is good because the nightly job reports success`, detail: `A success message from the job is taken as proof of a usable backup.` },
            { id: 'file-exists', lane: 'tool', label: `Check only that the backup file exists and is not empty`, detail: `The size of the file is the only check.` },
            { id: 'trust-ai', lane: 'ai', label: `Accept the assistant's statement that the restore will work without running it`, detail: `The assistant's confidence replaces the drill.` },
          ],
          rules: [
            { id: 'r-require', kind: 'require', parts: ['pick', 'isolated', 'verify', 'time', 'rpo', 'record'], message: `The drill needs a start time, an isolated restore, a human check of the data, a measured time, a check of the data's age and a written result.` },
            { id: 'r-no-prod', kind: 'forbid', parts: ['over-prod'], message: `A drill must never put production at risk. Restore into an isolated copy.` },
            { id: 'r-no-job', kind: 'forbid', parts: ['job-ok'], message: `A job reporting success proves it ran, not that the backup can be restored and is complete.` },
            { id: 'r-no-exists', kind: 'forbid', parts: ['file-exists'], message: `A file can exist and be unusable or incomplete. Only a restore shows whether it works.` },
            { id: 'r-no-trust', kind: 'forbid', parts: ['trust-ai'], message: `Only running the restore shows the real result. An assistant's confidence is not a test.` },
            { id: 'r-pick-isolated', kind: 'before', parts: ['pick', 'isolated'], message: `Start the clock before the restore, so the time includes all of it.` },
            { id: 'r-isolated-verify', kind: 'before', parts: ['isolated', 'verify'], message: `There must be a restored copy before anyone can check it.` },
            { id: 'r-ai-verify', kind: 'before', parts: ['ai-checks', 'verify'], message: `The assistant's suggested checks must exist before a person runs them.` },
            { id: 'r-verify-record', kind: 'before', parts: ['verify', 'record'], message: `The result is written only after the checks are done.` },
            { id: 'r-time-record', kind: 'before', parts: ['time', 'record'], message: `The measured time goes into the written result.` },
          ],
          solution: ['pick', 'isolated', 'ai-checks', 'verify', 'time', 'rpo', 'record'],
          minSteps: 6,
          maxSteps: 8,
          simulation: {
            input: `A restore drill of last night's TindaTrack backup, with a one-hour RTO and a 15-minute RPO.`,
            steps: {
              pick: `The team notes the start time and picks the backup taken at 02:00.`,
              isolated: `The backup is restored into a separate database that no app uses.`,
              'ai-checks': `The assistant suggests row counts per table, the newest sale time and a check for sales with no store. A person adds one for stock.`,
              verify: `The person runs the checks. Counts match, and no orphaned rows appear.`,
              time: `The restore took longer than the one hour the target allows, once the production-sized data was loaded.`,
              rpo: `The newest restored sale is about a day old, far outside the 15-minute target.`,
              record: `The result is written down: both targets are missed. The plan changes to add continuous change copies and a faster restore path, and the next drill is booked.`,
            },
            output: `A measured result in place of a hope: the drill shows both targets missed with the exact gaps, and the plan changes because of it.`,
          },
          hints: [
            `Which steps could harm production, or pretend a backup works without testing it? Leave those out.`,
            `Start the clock first, restore into an isolated copy, and check the data before you write the result.`,
            `An assistant can suggest the checks, but a person runs them and compares the time and the data's age with the targets.`,
          ],
          explanation: `A drill restores into an isolated copy, checks the data with a person in charge, and measures the two things the targets care about: how long it took and how old the newest data is. The wrong steps risk production or accept a claim in place of a test.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-30-match-1',
          kind: 'match',
          title: 'Which pattern protects against which failure?',
          prompt: `Match each failure to the pattern that guards against it.`,
          concept: 'fault tolerance patterns',
          labels: { terms: 'The failure', meanings: 'The pattern' },
          pairs: [
            { term: `A slow provider leaves requests waiting until every worker is busy.`, definition: `A timeout on the call`, note: `The call gives up after a limit, so a worker is freed instead of waiting forever.` },
            { term: `Hundreds of callers all retry at the same second when a service recovers.`, definition: `Backoff with jitter`, note: `Random, growing pauses spread the retries out so the recovering service is not hit all at once.` },
            { term: `The app keeps calling a provider that has failed for the last fifty calls.`, definition: `A circuit breaker`, note: `The breaker opens and stops calls for a while, then tries again carefully.` },
            { term: `A slow payment provider also takes down the stock list.`, definition: `A bulkhead`, note: `Separate pools of capacity keep one dependency from using it all.` },
            { term: `Payment confirmation is down, but owners still need to save sales.`, definition: `Graceful degradation`, note: `The system does less (saves the sale as payment pending) instead of failing entirely.` },
          ],
          hints: [
            `Ask what each failure is: waiting, repeating together, repeating at a dead service, spreading to other features, or a missing part.`,
            `Two patterns are about repeating calls, and they guard against different things.`,
            `One failure is about unrelated features sharing capacity. That is a wall, not a pause.`,
          ],
          explanation: `Each pattern guards one failure. Seeing which failure you face tells you which pattern to reach for, and they are most useful together.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-30-scenario-1',
          kind: 'scenario',
          title: 'The retry storm',
          prompt: `Choose the best fix.`,
          concept: 'fault tolerance',
          situation: `The e-wallet provider is slow but not down. TindaTrack's code calls it with no timeout and retries each failed call three times at once. Workers are all busy, other pages hang, and the provider is getting three times the traffic. The provider allows the same payment request to be repeated safely with an idempotency key.`,
          options: [
            { text: `Set a timeout on the call, retry only with the idempotency key and with backoff and jitter, open a circuit breaker when failures pile up, and save the sale as payment pending in the meantime.`, consequence: `Workers are freed quickly, the provider gets less traffic, other pages keep working, and owners can still record sales.`, quality: 'best' },
            { text: `Set a short timeout and show owners an error asking them to try again later.`, consequence: `Workers are freed and the system recovers, but every owner loses the sale until the provider is back, and many will retry by hand.`, quality: 'acceptable' },
            { text: `Retry up to ten times right away so the payment goes through eventually.`, consequence: `The provider receives ten times the traffic and slows further, workers wait longer, and the whole app hangs for longer.`, quality: 'poor' },
            { text: `Mark every sale as paid and fix the payments later.`, consequence: `Owners keep working, but the books are wrong, unpaid sales look paid, and a manual clean-up follows.`, quality: 'poor' },
          ],
          hints: [
            `What frees the workers, what slows the retries down, and what lets owners keep working?`,
            `Look for the option that combines several protections instead of one.`,
            `Retrying immediately, many times, makes a slow service slower.`,
          ],
          explanation: `A timeout frees workers, backoff with jitter and an idempotency key make retries safe, a breaker stops pointless calls, and a pending state keeps the business running. Each alternative drops a protection or misrepresents the data.`,
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-30-q1',
        prompt: `A standby database copies changes continuously from the primary. An engineer drops a table by mistake. What does the standby do?`,
        choices: [
          `It keeps the table, because a standby only copies data once a day and so is protected from fresh mistakes.`,
          `It restores the table automatically, since a standby exists to protect against human error.`,
          `It copies the deletion within moments, so recovery needs a backup or point-in-time copy kept elsewhere.`,
          `It blocks the drop, because the primary cannot change data until the standby has approved the change.`,
        ],
        answer: 2,
        explanation: `A standby protects against a failed machine or zone, not against a mistake, because it copies mistakes too. Deletion and corruption need separate backups.`,
      },
      {
        id: 'software-architecture-ai-30-q2',
        prompt: `The business says the system may lose at most 15 minutes of saved data. The only copy outside the database is a nightly backup. What does that mean for the plan?`,
        choices: [
          `The plan meets the target, since a nightly backup is taken inside the same fifteen-minute window of the day that the business cares about most.`,
          `The nightly backup alone can lose up to a day, so the target needs another mechanism such as continuous copying of changes to another place.`,
          `The plan meets the target as long as the backup job reports success every night without any errors.`,
          `The target is unrealistic, so the plan should simply promise recovery of everything and fix problems later.`,
        ],
        answer: 1,
        explanation: `The RPO is about how old the newest recoverable data is. A nightly copy can be nearly a day old, so it cannot satisfy fifteen minutes alone.`,
      },
      {
        id: 'software-architecture-ai-30-q3',
        prompt: `A call to a payment provider fails sometimes. Which retry rule is the safest?`,
        choices: [
          `Retry only operations that are safe to repeat, a few times, with growing pauses and jitter, and stop at a cap.`,
          `Retry every failure at once and as many times as needed, so that the provider sees the request until it works.`,
          `Retry only after the user has pressed the button three times, so the system is never blamed for duplicates.`,
          `Never retry, because a retry is always more dangerous than a failure for any call.`,
        ],
        answer: 0,
        explanation: `Retries need a limit, spacing and a safe-to-repeat operation. Immediate, unlimited retries overload a struggling service, and never retrying gives up on glitches that would pass.`,
      },
      {
        id: 'software-architecture-ai-30-q4',
        prompt: `Which alert is best for a team that wants to know when users are affected?`,
        choices: [
          `An alert whenever any single server's CPU passes a fixed level, since high CPU always means trouble.`,
          `An alert on every single error message in the logs, so that no failure of any kind is ever missed by the team on call.`,
          `An alert on the number of servers running, since fewer servers always means a problem for users.`,
          `An alert when saving a sale fails or is slow for more users than the agreed target allows, with an owner and a first step.`,
        ],
        answer: 3,
        explanation: `Alerts should follow what users feel and have an owner and a first step. Cause-level alerts create noise, and nobody can respond to every log line.`,
      },
      {
        id: 'software-architecture-ai-30-q5',
        audience: { max: 'beginner' },
        prompt: `In the car comparison, what does a restore drill stand for?`,
        choices: [
          `Buying a faster car so that accidents cannot happen.`,
          `Checking that the spare tyre really fits and can be put on in time, before you need it on the road.`,
          `Adding a dashboard light that tells you the fuel is low.`,
        ],
        answer: 1,
        explanation: `A restore drill tests the backup before the emergency, the way trying the spare tyre does.`,
      },
      {
        id: 'software-architecture-ai-30-q6',
        audience: { min: 'advanced' },
        prompt: `Three layers of a call chain each retry a failing request three times. What is the main risk, and what is the best response?`,
        choices: [
          `The failure is multiplied into many calls on the struggling dependency. Budget retries across the whole chain and retry at one layer.`,
          `The retries make the first layer too fast. Add a delay at the outermost layer and none anywhere else in the whole call chain.`,
          `The retries use too little memory. Increase the number of attempts so that each layer has even more chances to succeed eventually.`,
          `The retries are harmless. Each layer retries independently, so the dependency sees only a single extra call.`,
        ],
        answer: 0,
        explanation: `Retries multiply across layers: three attempts at each of three layers can mean many calls. Retrying at one layer with an overall budget keeps the load bounded.`,
      },
    ],
    task: {
      title: 'Check one service against failure',
      minutes: 18,
      steps: [
        `Pick one service in a system you know. List its outside calls (a payment provider, an email or SMS service, another internal service). For each, write whether it has a timeout, a retry limit and a fallback.`,
        `Write your system's RPO and RTO as numbers (or the question you would ask the business to get them), and list what protects each kind of failure: a server, a zone, a deletion, a region.`,
        `Write which of those protections you have actually tested, with a date, and which are only assumed.`,
        `Write the cheapest single test to run this week (for example a restore into an isolated copy, with a clock) and what result would make you change the design.`,
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: [`Think of something you depend on every day (a phone, a laptop with your files). Write what you would lose if it broke tonight, how old your last copy is, and whether you have ever checked that you can use the copy.`] },
      { audience: { min: 'advanced' }, steps: [`Draw your longest call chain and write the retry budget across it (attempts per layer and the maximum calls one user action can cause). Add one failure drill with its expected result and what you will do if it does not hold.`] },
    ],
  },

];
