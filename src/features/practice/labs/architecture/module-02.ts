import type { PracticeItem } from '../../types';

/**
 * Module 02's prompt labs of Software Architecture with AI (ids start `arch-02-`). Written 2026-11-18; see docs/content/ARCHITECTURE_BRIEF.md.
 * Every product, person, team and number below is invented. The `system` text only frames the model: it never says what the learner's prompt should say.
 * `key` and `facts` hold exactly what the material (plus the label definitions printed in the situation) supports.
 */
export const items: PracticeItem[] = [
  {
    id: 'arch-02-requirement-sort',
    kind: 'lab',
    title: 'Sort a brief into needs, goals, requirements and constraints',
    experiment: 'classification',
    situation:
      'You are helping plan TindaTrack Cloud, an invented online version of an app for small neighbourhood stores. A planning note has eight statements, and you want each one labelled so that nothing is missing before design starts. Labels: business-need (the problem or outcome the business wants to change); goal (what one kind of user wants to achieve); requirement (something the system must do, or a quality it must have); constraint (a fixed limit on how the team may build it). Write a prompt that labels all eight statements, with one label each, as JSON only.',
    goal: 'Get a JSON object with the fields s1 to s8, each holding exactly one of the four labels, following the definitions in the situation.',
    material: [
      '1. Store owners lose sales every month because popular items run out and nobody notices in time.',
      '2. A store owner wants to know, before opening, which items to buy today.',
      '3. The system shows a list of the items that are below the owner\'s minimum stock.',
      '4. The first version must be finished and in the stores within three months.',
      '5. The company wants more stores to subscribe to TindaTrack Cloud and keep paying every month.',
      '6. A store helper wants to record a sale in a few seconds, even when a customer is waiting.',
      '7. A sale must be saved even if the phone loses its signal.',
      '8. The app has to run on the Android phones that the stores already own.',
    ].join('\n'),
    starterPrompt: 'Label each statement.',
    system:
      'You are a helpful assistant that sorts statements for a software team. Follow the user\'s instructions about the statements provided with the request, and when JSON is requested reply with JSON only.',
    maxRuns: 4,
    output: {
      format: 'json',
      fields: [
        { name: 's1', type: 'string', required: true, oneOf: ['business-need', 'goal', 'requirement', 'constraint'] },
        { name: 's2', type: 'string', required: true, oneOf: ['business-need', 'goal', 'requirement', 'constraint'] },
        { name: 's3', type: 'string', required: true, oneOf: ['business-need', 'goal', 'requirement', 'constraint'] },
        { name: 's4', type: 'string', required: true, oneOf: ['business-need', 'goal', 'requirement', 'constraint'] },
        { name: 's5', type: 'string', required: true, oneOf: ['business-need', 'goal', 'requirement', 'constraint'] },
        { name: 's6', type: 'string', required: true, oneOf: ['business-need', 'goal', 'requirement', 'constraint'] },
        { name: 's7', type: 'string', required: true, oneOf: ['business-need', 'goal', 'requirement', 'constraint'] },
        { name: 's8', type: 'string', required: true, oneOf: ['business-need', 'goal', 'requirement', 'constraint'] },
      ],
    },
    key: {
      s1: 'business-need',
      s2: 'goal',
      s3: 'requirement',
      s4: 'constraint',
      s5: 'business-need',
      s6: 'goal',
      s7: 'requirement',
      s8: 'constraint',
    },
    criteria: [
      { id: 'labels', label: 'Lists the four labels exactly as written in the situation' },
      { id: 'definitions', label: 'Gives a one-line definition of each label, so the model does not guess what "goal" or "constraint" means' },
      { id: 'who', label: 'Gives a way to decide, such as asking who the statement is about and whether it can be changed' },
      { id: 'format', label: 'Asks for only a JSON object with the fields s1 to s8 and one label each' },
    ],
    tips: [
      'The model does not know your four labels. Write each label and a short definition in the prompt.',
      'Some statements sound similar. A question helps: is it about the business, about one kind of user, about what the system does, or about a limit on how we build it?',
      'Name the fields exactly (s1 to s8) and say that each holds one label only.',
      'Ask for JSON only, so nothing else gets mixed in with the answer.',
      'After the run, read each statement yourself and decide whether you agree before you look at the answer key.',
    ],
    example: {
      prompt:
        'Label each numbered statement in the material with exactly one of: business-need, goal, requirement, constraint. Definitions: business-need = the problem or outcome the business wants to change; goal = what one kind of user wants to achieve; requirement = something the system must do or a quality it must have; constraint = a fixed limit on how the team may build it. Tip: ask who the statement is about and whether it can be negotiated. Reply with JSON only, with the fields s1 to s8, each holding one label.',
      outcome:
        'A JSON object with eight fields, each set to one of the four labels in their exact spelling. Because the definitions are in the prompt, the statements about the business, a user, the system and the limits land under four different labels.',
    },
    verify: [
      'The reply is only a JSON object with the fields s1 to s8, and each value is one of the four labels, spelled exactly.',
      'Read statements 3 and 7: both describe what the system must do or be. Do your labels agree with the definitions in the situation?',
      'Read statements 1 and 5: both are about the business. Check that the answer did not call them goals of a user.',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'arch-02-brief-gaps',
    kind: 'lab',
    title: 'Find the gaps and the contradiction in a requirements draft',
    experiment: 'document-analysis',
    situation:
      'You are a developer on TindaTrack Cloud, an invented online service for small stores. Draft 2 of the requirements was written by the sales team and one developer, and no store owner has seen it. Design starts on Monday. You want an assistant to review the draft before then, but only from what the draft says: it must not invent requirements or numbers.',
    goal: 'Write a prompt that makes the model list the draft\'s gaps, contradictions and requirements without a measure, quoting the line each comes from, and asking questions instead of inventing answers.',
    material: [
      'TINDATRACK CLOUD: REQUIREMENTS DRAFT 2 (invented example)',
      'Prepared by the sales team and one developer. Not reviewed by store owners.',
      '',
      'PURPOSE',
      'Move TindaTrack from one phone per store to a shared online service, so that owners can run several stores and see them together. About 200 stores are expected in the first year (the sales team\'s estimate).',
      '',
      'WHO USES IT',
      '- Store owners, who record sales, manage stock and read reports.',
      '- Store helpers, who record sales at the counter.',
      '',
      'REQUIREMENTS',
      'R1. Owners can record sales, edit stock and see low-stock lists.',
      'R2. Owners can see the combined sales of all their stores.',
      'R3. The app must be fast and always available.',
      'R4. The app works fully offline for up to a week and syncs when the signal returns.',
      'R5. Owners always see live totals from all their stores.',
      'R6. Customers receive a text reminder when their store credit is due. The owner types the customer\'s phone number into the app.',
      'R7. Online payments through an e-wallet provider are planned for phase 2.',
      '',
      'CONSTRAINTS',
      '- Team: three developers.',
      '- Budget: one server and one database to start.',
      '- Launch target: four months from approval.',
      '- The app must run on the Android phones that stores already own.',
    ].join('\n'),
    starterPrompt: 'Review this requirements draft and tell me what is wrong with it.',
    system:
      'You are a helpful assistant that reviews documents. Follow the user\'s request and use the document provided with it as the data for your answer.',
    maxRuns: 4,
    output: { format: 'text' },
    facts: [
      'R3 says the app must be fast and always available, with no number or test.',
      'R4 says the app works fully offline for up to a week, and R5 says owners always see live totals from all their stores.',
      'The draft lists store helpers as users but states no rule about what a helper may see or do compared with an owner.',
      'R6 sends text reminders to customers, with the phone number typed in by the owner, and the draft says nothing about how those numbers are kept or protected.',
      'About 200 stores are expected in the first year, which is the sales team\'s estimate, and no store owner has reviewed the draft.',
      'The team is three developers with one server and one database to start and a four-month launch target.',
      'The draft does not mention backups, how long data is kept, or whether one store can have more than one owner.',
    ],
    criteria: [
      { id: 'scope', label: 'Limits the review to the draft and asks for gaps, contradictions and requirements with no measure' },
      { id: 'quote', label: 'Asks for the line or requirement number each finding comes from' },
      { id: 'questions', label: 'Asks for questions to put to the business, not invented requirements or numbers' },
      { id: 'assumptions', label: 'Asks the model to keep what the draft says apart from what it assumed, and to label assumptions' },
      { id: 'format', label: 'Sets a format and a size, such as a table or a short list' },
      { id: 'unknown', label: 'Asks the model to say what it cannot know from the draft' },
    ],
    tips: [
      'Say exactly what kind of review you want: gaps, lines that contradict each other, and requirements that cannot be tested. "What is wrong" invites a general opinion.',
      'Ask for the requirement number next to every finding. A finding with no line behind it is the assistant\'s own guess.',
      'Ask for questions to put to the business. If you ask for a fix, the assistant may invent numbers and features.',
      'Tell the assistant to label anything it assumed, and to say what it cannot know from a draft that no store owner has reviewed.',
      'After the run, check each quoted line against the draft and look for any number the draft never gave.',
    ],
    example: {
      prompt:
        'Review the requirements draft in the material, using only what it says. List (1) pairs of requirements that contradict each other, (2) requirements that cannot be tested because they have no measure, and (3) gaps: things a system like this would need that the draft does not mention. For every item give the requirement number or line it comes from. Do not invent requirements or numbers: for each item write a question I should ask the business. Label anything you assumed as ASSUMPTION, and end with what you cannot know from this draft. Use a table with at most eight rows.',
      outcome:
        'A short table. It flags R4 and R5 as a contradiction, R3 as untestable, and the missing rule for helpers, the handling of customers\' phone numbers, backups and multiple owners as gaps, each with a question for the business. Nothing in it states a user count or an uptime figure that the draft does not give.',
    },
    verify: [
      'Every finding names a requirement number or a line that really exists in the draft.',
      'No number appears that the draft does not state (the only figures are about 200 stores, a week offline, three developers, one server, one database and four months).',
      'Each item is a question or a gap, not a made-up requirement, and anything assumed is labelled.',
      'Check that the contradiction is between lines that really clash (R4 and R5), not between lines that merely sound different.',
    ],
    difficulty: 'demanding',
  },
];
