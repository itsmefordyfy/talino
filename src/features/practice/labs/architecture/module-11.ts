import type { PracticeItem } from '../../types';

/**
 * Module 11's prompt labs of Software Architecture with AI (ids start `arch-11-`). Written 2026-11-18.
 * Everything in the material is invented: TindaTrack, its folders, its rules and the eight changes. The `system` text only frames the model and never says what
 * the learner's prompt should say. `facts` and `key` hold only what the material supports.
 */
export const items: PracticeItem[] = [
  {
    id: 'arch-11-agent-instructions-review',
    kind: 'lab',
    title: 'Review an instructions file for coding agents',
    experiment: 'document-analysis',
    situation:
      'You are the tech lead of TindaTrack, an inventory and sales app for small stores. A teammate wrote the instructions file in the material for the coding agents the team uses. Before the file is shared, you want a review: lines that conflict, lines nobody could check, and decisions the file does not cover. The review must rest on the file alone.',
    goal: 'Get a review of the file that quotes the lines it talks about, keeps conflicts and vague lines apart from gaps, and says what it cannot know.',
    material:
      '# TindaTrack: instructions for coding agents\n\n## Stack\n- Node.js API in src/api, browser app in src/web, PostgreSQL.\n- Run the tests with: npm test\n- Run the linter with: npm run lint\n\n## Layout\n- src/domain: business rules. Plain TypeScript. No imports from other src folders.\n- src/api: HTTP handlers. They call domain code, then repositories.\n- src/data: repositories. All SQL lives here.\n- src/payments: the adapter for the e-wallet provider.\n\n## Rules\n1. Handlers must not run SQL. Use a repository.\n2. For the daily sales report, run a raw SQL query in the handler, because the repository is too slow for it.\n3. Every query on store data filters by store_id.\n4. Keep files small and keep the code clean.\n5. Never edit a file in src/data/migrations that already exists.\n6. Write a test for every new handler.\n7. Before you finish, run the full test suite and report the result.\n\n## Payments\n- The e-wallet provider calls our webhook at /webhooks/wallet.\n- The provider sometimes sends the same event twice.\n\n## Process\n- The team uses feature branches. Open a pull request when a slice is done.',
    starterPrompt: 'Review this file.',
    system:
      'You are a helpful engineering assistant. Follow the user\'s request and use the document provided with it as your only source for what it says.',
    maxRuns: 4,
    output: { format: 'text' },
    facts: [
      'Rule 1 says handlers must not run SQL and must use a repository.',
      'Rule 2 tells the agent to run a raw SQL query in the handler for the daily sales report.',
      'Rule 3 says every query on store data filters by store_id.',
      'Rule 4 says to keep files small and keep the code clean.',
      'The file says the e-wallet provider sometimes sends the same event twice.',
      'The file lists npm test and npm run lint as commands.',
      'Rule 5 says never to edit an existing file in src/data/migrations.',
    ],
    criteria: [
      { id: 'purpose', label: 'Says what the file is for (rules read by coding agents) and what kind of problems to look for' },
      { id: 'quote', label: 'Asks the model to quote the line it is talking about, so each finding can be checked' },
      { id: 'separate', label: 'Keeps conflicts and unverifiable lines apart from missing rules, in separate groups' },
      { id: 'source-only', label: 'Tells the model to use only the file, and to say "not in the file" instead of inventing a rule' },
      { id: 'limits', label: 'Asks what the model cannot know about the real repository or the team\'s decisions' },
    ],
    tips: [
      'Say who reads the file (coding agents) and ask for specific kinds of problems: two lines that disagree, a line nobody could test, and a decision the file leaves out.',
      'Ask for a quotation next to every finding. A finding without a quoted line is the easiest place for a model to invent something.',
      'Keep gaps in their own group and tell the model to mark each one "not in the file". A missing rule is a different problem from a conflicting one.',
      'Ask what the model cannot know. It has seen one file, not your repository, your ADRs or your reasons.',
      'After the run, check every quoted line against the file and check that every "missing" item is really absent.',
    ],
    example: {
      prompt:
        'This file is read by coding agents on our TindaTrack project. Review it using only the text provided. Give three groups: (1) lines that conflict with each other, (2) lines an automated check or a reviewer could not verify, (3) things an agent would need to know that the file does not say, each marked "not in the file". Quote the line for every finding in groups 1 and 2. Do not add rules of your own. End with a short list of what you cannot know from this file alone.',
      outcome:
        'A review in three groups. It quotes the rule about handlers not running SQL next to the rule that tells the agent to run SQL in a handler. It points at the "keep the code clean" line as unverifiable. Under gaps it lists items the file does not say, marked "not in the file". It closes by saying it has not seen the repository or the team\'s ADRs.',
    },
    verify: [
      'Every quoted line appears in the material exactly.',
      'Each item listed as missing really is absent from the file.',
      'Nothing is presented as a rule of the file that the file does not contain.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'arch-11-boundary-check',
    kind: 'lab',
    title: 'Classify agent changes against the boundary rules',
    experiment: 'classification',
    situation:
      'TindaTrack has written boundary rules, listed in the material. A coding agent finished eight small changes today and your pipeline needs a first quick check of each one against the rules. For each numbered change, decide whether it is allowed or a violation by applying every rule in the material. Write one prompt that labels all eight, run it, then count how many it got right. Read the misses and change one thing.',
    goal: 'Get a label for each of the eight changes and improve the prompt until it labels as many as possible correctly.',
    material:
      'Boundary rules:\nR1. src/domain imports nothing from src/api, src/data or src/payments.\nR2. Only src/data contains SQL.\nR3. Every query on store data filters by store_id.\nR4. Only src/payments calls the e-wallet provider.\nR5. src/api may import src/domain and src/data. src/data and src/payments may import src/domain.\n\nChanges made today:\n1. src/domain/stock.ts now imports formatPeso from src/api/format.ts.\n2. src/api/sales.ts calls salesRepository.listForStore(storeId, day).\n3. src/api/reports.ts runs a SELECT query on the sales table through the database client.\n4. src/data/products.ts adds a function that selects products WHERE store_id = $1.\n5. src/api/orders.ts calls the e-wallet provider\'s payment URL with fetch.\n6. src/payments/wallet.ts imports the Money type from src/domain/money.ts.\n7. src/data/products.ts adds a function that selects every product ordered by name, with no store filter, for an admin script.\n8. src/domain/pricing.ts adds a discount function that imports only from src/domain/money.ts.',
    starterPrompt: 'Check these changes against the rules.',
    system:
      'You are a helpful assistant that checks code changes against written rules. Follow the user\'s instructions about the material provided, and when JSON is requested reply with JSON only.',
    maxRuns: 6,
    output: {
      format: 'json',
      fields: [
        { name: 'change_1', type: 'string', required: true, oneOf: ['allowed', 'violation'] },
        { name: 'change_2', type: 'string', required: true, oneOf: ['allowed', 'violation'] },
        { name: 'change_3', type: 'string', required: true, oneOf: ['allowed', 'violation'] },
        { name: 'change_4', type: 'string', required: true, oneOf: ['allowed', 'violation'] },
        { name: 'change_5', type: 'string', required: true, oneOf: ['allowed', 'violation'] },
        { name: 'change_6', type: 'string', required: true, oneOf: ['allowed', 'violation'] },
        { name: 'change_7', type: 'string', required: true, oneOf: ['allowed', 'violation'] },
        { name: 'change_8', type: 'string', required: true, oneOf: ['allowed', 'violation'] },
      ],
    },
    key: {
      change_1: 'violation',
      change_2: 'allowed',
      change_3: 'violation',
      change_4: 'allowed',
      change_5: 'violation',
      change_6: 'allowed',
      change_7: 'violation',
      change_8: 'allowed',
    },
    criteria: [
      { id: 'rules', label: 'Tells the model to apply the numbered rules in the material, and not its own idea of good design' },
      { id: 'all-rules', label: 'Asks for every rule to be checked against every change, not only the rule about which folder imports which' },
      { id: 'format', label: 'Asks for only a JSON object with one label per numbered change (change_1 to change_8)' },
      { id: 'labels', label: 'Names the two allowed labels exactly: allowed and violation' },
      { id: 'measure', label: 'Is specific enough that you can count right and wrong answers and see which rule a miss overlooked' },
    ],
    tips: [
      'The model sees only your prompt and the material. Tell it that the rules in the material are the whole standard, and that it must not add its own.',
      'Ask it to check each change against every rule in turn. A change can pass one rule and still break another.',
      'Ask for JSON only, with the field names change_1 to change_8, so you can compare each label with the material.',
      'After the run, read each miss and find the rule it overlooked. Then name that rule in your prompt and run again.',
      'Run it twice. If one label changes between runs, the prompt is leaving that case to chance.',
    ],
    example: {
      prompt:
        'Use only the numbered boundary rules in the material as the standard. For each numbered change, check it against every rule R1 to R5 in turn, and label it "violation" if it breaks any rule, otherwise "allowed". Reply with JSON only, with the fields change_1 to change_8, each set to "allowed" or "violation".',
      outcome:
        'A JSON object with eight fields. Because the prompt makes the model apply each rule to each change, it catches the changes that break a rule other than the import rule, and every field holds exactly one of the two labels.',
    },
    verify: [
      'The reply is only a JSON object with the eight fields, and each value is one of the two labels.',
      'Each label follows a rule printed in the material, not a general opinion about design.',
      'Count the misses, and for each one name the rule that was applied wrongly or overlooked.',
    ],
    difficulty: 'realistic',
  },
];
