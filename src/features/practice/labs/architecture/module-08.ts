import type { PracticeItem } from '../../types';

/**
 * Module 08's prompt labs of Software Architecture with AI (ids start `arch-08-`): Scalability, Performance and Reliability. Written 2026-11-18.
 * Everything in the materials is invented for the exercise (TindaTrack, the people, every number). The measurements are made up and are not a benchmark.
 * The `system` text only frames the model: it never says what the learner's prompt should say. `facts` hold exactly what each material states.
 * Two problems are planted in each material on purpose, for the learner to find.
 */
export const items: PracticeItem[] = [
  {
    id: 'arch-08-incident-note',
    kind: 'lab',
    title: 'The month-start slowdown: which conclusions does the evidence support?',
    experiment: 'document-analysis',
    situation:
      'You are the tech lead of TindaTrack. After a slow morning on the first of the month, Ben, a developer, wrote the incident note in the material and wants to start a redesign. Before anyone changes the architecture, you want a careful review of the note. Use the material as the only source and decide what the evidence supports.',
    goal: 'Get a review that sorts the note\'s conclusions into those the measurements support and those they do not, names what is missing, and proposes the next measurement before any redesign.',
    material:
      'TINDATRACK INCIDENT NOTE: month-start reports (all figures are invented for this exercise)\nWritten by: Ben, developer. Incident: 1 November, 08:00 to 10:30.\n\nWhat users saw\nThe Monthly report page was slow. Support logged 14 complaints in that window. Support says the Sales and Stock pages felt normal.\n\nProduction numbers during the incident (monitoring dashboard)\n- Monthly report request, average time: 4.2 s. 95th percentile: 11.8 s.\n- App server CPU (2 servers): about 30% on both.\n- Database CPU: about 85%.\n- Database connections in use: 38 of 100 allowed.\n- Requests per minute to the Monthly report endpoint: about 160 (a normal day: about 20).\n\nOne trace of a single slow report request (store 114, 11.6 s in total)\n- Receive the request and check login: 0.05 s\n- Query 1, sales totals for the month: 10.9 s\n- Query 2, top products: 0.4 s\n- Build the JSON response: 0.15 s\n- Send the response: 0.1 s\n\nLoad test (run by Ben on his laptop; 20 test stores with 3 days of data each)\n- 160 requests per minute for 5 minutes: average 0.6 s, 95th percentile 0.9 s.\n\nWhat we know about the database\nThe sales table holds about 9 million rows for all 200 stores. Nobody has looked at the query plan or checked which indexes exist on the sales table.\n\nBen\'s conclusion\n"The app layer cannot handle the month-start load. The load test shows the app is fast, so the delay must come from the app servers being overloaded. I propose we split reports into a separate microservice and double the app servers before next month end. This will fix the problem."',
    starterPrompt: 'Is Ben right? Review this incident note.',
    system:
      'You are an assistant that reviews technical documents for a software team. Follow the user\'s request and base your answer only on the document provided with it. When the document does not contain something, say so instead of guessing.',
    maxRuns: 5,
    output: { format: 'text' },
    facts: [
      'The incident was on 1 November from 08:00 to 10:30 and support logged 14 complaints.',
      'The Monthly report request averaged 4.2 s with a 95th percentile of 11.8 s.',
      'App server CPU was about 30% on both servers, while database CPU was about 85%.',
      'Database connections in use were 38 of 100 allowed.',
      'In one trace of 11.6 s, Query 1 (sales totals for the month) took 10.9 s and Query 2 took 0.4 s.',
      'The load test ran on a laptop with 20 test stores and 3 days of data each, and gave an average of 0.6 s and a 95th percentile of 0.9 s.',
      'The sales table has about 9 million rows and nobody has looked at the query plan or the indexes.',
      'Ben proposes a separate reports microservice and doubling the app servers.',
    ],
    criteria: [
      { id: 'sort-claims', label: 'Asks the model to sort the note\'s conclusions into supported and not supported, citing the numbers it relies on' },
      { id: 'comparable', label: 'Asks whether the evidence is comparable: the same environment, the same amount of data and the same statistic (average or 95th percentile)' },
      { id: 'missing', label: 'Asks what is missing or not yet measured, and which measurement should come next' },
      { id: 'cheap-first', label: 'Asks for the cheapest next step before any redesign, with the cost and risk of each option' },
      { id: 'limits', label: 'Tells the model to use only the note and to say what it cannot tell from it' },
    ],
    tips: [
      'Do not ask "is Ben right?" and stop there. Ask the model to list each conclusion in the note and say which numbers support it or contradict it.',
      'Ask it to check the evidence itself: was the load test run in a place and with data that resemble production, and are averages being compared with percentiles?',
      'Ask what has not been measured yet, such as a query plan, and which one measurement would settle the question fastest.',
      'Ask for options in order of cost, and for what each option would risk, so a redesign is not the first answer by default.',
      'After the run, find each number the answer mentions in the note, and check that none of them was invented.',
    ],
    example: {
      prompt:
        'Review this incident note using only what it says. 1) List each conclusion Ben draws and say, with the numbers from the note, whether the evidence supports it, contradicts it or cannot decide it. 2) Check whether the load test is comparable with production (environment, amount of data, average versus 95th percentile). 3) List what has not been measured and name the single next measurement you would take. 4) Give the options from cheapest to most expensive with the risk of each, and do not recommend a redesign unless the note supports it. Say what you cannot tell from the note.',
      outcome:
        'A review that notes the trace puts most of one slow request in one sales-totals query and that the database CPU was far higher than the app CPU, so the note\'s own numbers point at the database and not the app servers. It flags that the laptop test used a tiny data set, so it cannot show how production behaves, and that the note mixes an average with a 95th percentile. It lists the missing query plan and index check as the next measurement, and puts that ahead of any microservice or extra servers, while saying what it cannot tell from the note.',
    },
    verify: [
      'Every number in the answer appears in the note exactly as written (no new figures).',
      'The answer says which of Ben\'s conclusions the measurements support and which they do not, and gives the numbers for each.',
      'It names at least one thing that was not measured and does not state a cause as certain when the note has not confirmed it.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'arch-08-recovery-plan',
    kind: 'lab',
    title: 'A recovery plan against its own targets',
    experiment: 'document-analysis',
    situation:
      'You are reviewing TindaTrack\'s draft recovery plan before it goes to the owners. The business agreed two targets, and you want to know which parts of the plan meet them, which do not, and which are only hoped for. Use the material as the only source of facts.',
    goal: 'Get a review that checks the plan against its two targets, separates what is proven from what is only claimed, and lists the gaps in order of risk.',
    material:
      'TINDATRACK RECOVERY PLAN (draft; invented for this exercise)\n\nTargets agreed with the business\n- Recovery point objective (RPO): no more than 15 minutes of recorded sales may be lost.\n- Recovery time objective (RTO): service restored within 1 hour of a failure.\n\nWhat exists today\n- Database: one managed PostgreSQL primary in zone A with a standby in zone B. The standby copies changes continuously.\n- Backups: a full database backup runs every night at 02:00 and is kept for 7 days. Backups are stored in the same cloud account and the same region as the database.\n- Receipt photos: stored in object storage in the same region. No second copy exists.\n- Restore test: done once, in March, on a staging database holding sample data for 2 stores. It took 20 minutes. No restore has been tried on production-sized data.\n- Monitoring: an alert fires if the primary database is unreachable for 5 minutes. Nobody is assigned to answer it outside office hours (Monday to Friday, 09:00 to 18:00).\n- Failover: promoting the standby is done by hand, following a document last edited eight months ago. Its steps mention a server that was retired in July.\n\nOpen questions\n- Who decides to declare a disaster?\n- How are store owners told?',
    starterPrompt: 'Does this recovery plan look good?',
    system:
      'You are an assistant that reviews technical documents for a software team. Follow the user\'s request and base your answer only on the document provided with it. When the document does not contain something, say so instead of guessing.',
    maxRuns: 5,
    output: { format: 'text' },
    facts: [
      'The RPO target is 15 minutes of recorded sales and the RTO target is 1 hour.',
      'The database has a primary in zone A and a standby in zone B that copies changes continuously.',
      'A full backup runs nightly at 02:00, is kept for 7 days, and is stored in the same account and region as the database.',
      'Receipt photos are in object storage in the same region with no second copy.',
      'The only restore test was in March on a staging database with sample data for 2 stores and took 20 minutes.',
      'The alert fires after 5 minutes unreachable, and nobody is assigned outside Monday to Friday, 09:00 to 18:00.',
      'Failover is manual, from a document last edited eight months ago that mentions a retired server.',
      'Who declares a disaster and how owners are told are open questions.',
    ],
    criteria: [
      { id: 'targets', label: 'Names the two targets (RPO and RTO) and asks the model to check each part of the plan against them' },
      { id: 'proven', label: 'Asks the model to separate what is proven (tested) from what is only claimed or assumed' },
      { id: 'failure-kinds', label: 'Asks which kinds of failure each mechanism covers (a zone, a mistake or deletion, a whole region) and which it does not' },
      { id: 'rank', label: 'Asks for the gaps ranked by risk, with the cheapest fix for each' },
      { id: 'limits', label: 'Tells the model to use only the plan and to say what it cannot tell from it' },
    ],
    tips: [
      'Name the two targets in your prompt and ask the model to test each mechanism in the plan against them, one at a time.',
      'Ask what is tested and what is only claimed. A backup that has never been restored at realistic size is a claim.',
      'Ask which kinds of failure each mechanism covers. A standby that copies continuously may copy a mistake as well, so ask what protects against deletion and what protects against a whole-region loss.',
      'Ask for gaps in order of risk, with the cheapest fix for each, so the answer is a short list you can act on.',
      'After the run, check every figure and every claim of "this meets the target" against the plan itself.',
    ],
    example: {
      prompt:
        'Check this recovery plan against its two targets (RPO 15 minutes, RTO 1 hour) using only the document. For each mechanism, say which target it helps, which failure it covers (a zone, a deletion or corruption, a whole region) and whether it is tested or only claimed. List the gaps ranked by risk, with the cheapest fix for each, and say what you cannot tell from the document.',
      outcome:
        'A review that says the standby may help with a zone failure but is not shown to cover a deleted or damaged table or a loss of the whole region, that nightly backups kept in the same account and region cannot meet a 15-minute RPO and share the primary\'s location, that the one restore test used two stores of sample data so it does not prove the one-hour RTO, and that an alert nobody answers out of hours plus a stale manual failover document put the RTO at risk. It ranks these and suggests cheap fixes such as a copy in another region, a realistic restore drill and an updated runbook, and says what it cannot tell from the document.',
    },
    verify: [
      'Every statement about the plan matches the document, and no mechanism is credited with a protection the document does not state.',
      'The answer compares the nightly backup with the 15-minute target and does not call an untested restore proven.',
      'It names what it cannot tell (for example how long a production-sized restore would take) instead of guessing a number.',
    ],
    difficulty: 'demanding',
  },
];
