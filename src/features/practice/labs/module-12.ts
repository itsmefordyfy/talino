import type { PracticeItem } from '../types';

/**
 * Prompt labs of Generative AI module 12 (`kind: 'lab'`). Written with the module's lessons; see docs/content/GENAI_BRIEF.md.
 * Every person, business, product and number in the material is invented. The model comparison describes no result in advance: the screen shows the learner's own run.
 */
export const items: PracticeItem[] = [
  {
    id: 'lab-12-compare-tools',
    kind: 'lab',
    title: 'Measure two model tiers on your own task',
    experiment: 'text-generation',
    situation: 'You are a freelance web designer (invented). After a call with a client, you want a short follow-up email written from your notes. You are also deciding which kind of AI model to use for emails like this. Before you run anything, write three criteria for a good email on paper. Then run your one prompt on two model tiers and judge the two answers against your criteria.',
    goal: 'Write one prompt that turns the call notes into a follow-up email, then compare the two answers on your own criteria, and read the time and size measured for each.',
    material: [
      'NOTES FROM A CALL (invented)',
      'Client: Mr. Ramos, owner of Ramos Hardware. Call date: Tuesday 10 March.',
      'Freelancer: Lea.',
      'Agreed: a new product page for 12 items.',
      'Lea will send 3 sample layouts by Friday 13 March.',
      'Mr. Ramos will send the product photos by Wednesday 11 March.',
      'Price: 6,500 pesos, with a 50 percent deposit before work starts.',
      'Revisions: two rounds are included.',
      'Open question: whether Mr. Ramos wants a link to his Facebook shop on the page.',
      'Do not promise: hosting, or a delivery date after the client approves a layout.',
    ].join('\n'),
    starterPrompt: 'Write an email from these notes.',
    system: 'You are a helpful writing assistant. Follow the user\'s request and use the material they supply.',
    compare: 'models',
    maxRuns: 6,
    output: { format: 'text' },
    criteria: [
      { id: 'task-clear', label: 'States the task, the reader and the tone you want' },
      { id: 'facts-listed', label: 'Asks the model to keep every date, amount and name from the notes exactly as written' },
      { id: 'no-extras', label: 'Tells the model not to add promises, dates or details that the notes do not contain' },
      { id: 'comparable', label: 'Asks for a format that makes two answers easy to compare, such as a subject line and three short paragraphs' },
      { id: 'checkable', label: 'Asks for a one-line list of the facts used, so that you can tick them against the notes' },
    ],
    tips: [
      'Write your three criteria on paper before you press run. If you wait until you have seen the answers, you will judge by whichever one sounds nicer.',
      'Check facts first (dates, amounts, names, the open question), then format and tone. Only then look at the measurements.',
      'Time and size are facts about this run on this day. Run again and see how much they change before you say anything about speed or length.',
      'A tie on quality is common. Then privacy, cost and fit decide, and those are things you check outside this lab.',
    ],
    example: {
      prompt: 'Write a short, friendly follow-up email from Lea to Mr. Ramos, using only the call notes below. Format: a subject line, then three short paragraphs (what was agreed, what each of us does by when, and the open question). Keep every date, amount and name exactly as in the notes. Do not add any promise, date or detail that is not in the notes, and do not promise hosting. End with a one-line list of the facts you used.',
      outcome: 'A short email with a subject line and three paragraphs that restate the product page for 12 items, the three sample layouts by Friday 13 March, the photos by Wednesday 11 March, the price with the 50 percent deposit and the two revision rounds, and ask about the Facebook shop link. It adds no promise about hosting or delivery, and ends with a one-line list of the facts used.',
    },
    verify: [
      'Tick every date, amount and name in each email against the notes. Mark any that is wrong or missing.',
      'Look for anything that is not in the notes, such as a promise about hosting or a delivery date after approval.',
      'Check that the open question about the Facebook shop link is asked and not answered for the client.',
      'Read the time and size measured for each tier as facts about this run, and run again before you draw a conclusion.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-12-test-a-claim',
    kind: 'lab',
    title: 'Test a bold announcement',
    experiment: 'document-analysis',
    situation: 'A blog post about a new AI writing product is going around (all of it is invented, including the product and the company). Your team lead asks whether to switch to it. Before you answer, you want to see exactly what the post claims, who is saying it and what it admits it does not know.',
    goal: 'Get the model to sort the post into what the writer states, what is only the company\'s own claim, and what the post admits is unknown, quoting the post, and to say what you would check next.',
    material: [
      'BLOG POST (invented): "Quillbox 3 is here, and it changes everything"',
      'Posted Tuesday by a technology blogger.',
      '',
      'Quillbox Labs announced Quillbox 3 on Tuesday. The company says it is "the most accurate writing assistant ever built" and "twice as fast as anything else". Early testers, who asked not to be named, told us it "felt like magic". The company also says thousands of teams already use earlier versions.',
      '',
      'The announcement did not say how accuracy or speed were measured, and no test results were published. Pricing will be announced later this month. A link to the company\'s press release is below. We have not tested Quillbox 3 ourselves.',
    ].join('\n'),
    starterPrompt: 'Is this announcement true?',
    system: 'You are a careful assistant. Follow the user\'s request and use only the material they supply as your evidence.',
    maxRuns: 4,
    output: { format: 'text' },
    facts: [
      'The post says Quillbox Labs announced Quillbox 3 on Tuesday.',
      'The claims "the most accurate writing assistant ever built" and "twice as fast as anything else" are quoted as what the company says.',
      'The post says the announcement did not explain how accuracy or speed were measured, and that no test results were published.',
      'The early testers are not named and are quoted as saying it "felt like magic".',
      'The statement that thousands of teams use earlier versions is attributed to the company.',
      'The post says pricing will be announced later this month.',
      'The writer says they have not tested Quillbox 3 themselves.',
    ],
    criteria: [
      { id: 'groups', label: 'Asks for separate groups: what the writer states, what is only the company\'s claim, and what the post admits is unknown' },
      { id: 'quotes', label: 'Asks the model to quote the post\'s own words under each group' },
      { id: 'only-post', label: 'Says the post is the only evidence, and not to judge whether the product is good from general knowledge' },
      { id: 'next-checks', label: 'Asks what you would need to see, and which kind of primary source, before you believed the claims' },
    ],
    tips: [
      'Do not ask "is it true?". The post alone cannot answer that. Ask the model to sort the claims by who is saying them and what backs them.',
      'Ask for the exact words under each group. Then you can check, in seconds, that the model has not mixed up the writer\'s words with the company\'s.',
      'Tell the model to use only the post. Otherwise it may fill in what it thinks it knows about similar products, and that is a guess.',
      'End by asking what you would check next and where, for example the maker\'s own documentation or your own test on a task from your test set.',
    ],
    example: {
      prompt: 'Read the blog post below and use only the post as evidence. Sort it into three groups with a heading each: (1) statements the writer makes as facts, (2) claims that are only the company\'s own words, and (3) things the post admits it does not know. Quote the post\'s own words under each item. Do not judge whether the product is good. Finish with three things I should look for, and which kind of primary source to look for them in, before I believe the claims.',
      outcome: 'Three headed groups with short quotes from the post under each item: the writer\'s facts about the announcement and the pricing timeline, the company\'s unmeasured claims about accuracy, speed and users, and the admitted gaps such as the missing method, no published results and no test by the writer. A closing list names the checks, such as the method behind the claims, independent results and a test on your own task.',
    },
    verify: [
      'Find each quote in the post. Is it exact, and is it in the right group?',
      'Check that nothing in the answer comes from outside the post, such as a feature or a price that the post does not state.',
      'Look at the closing checks. Would each of them really help you decide, and could you do it yourself?',
    ],
    difficulty: 'realistic',
  },
];
