import type { PracticeItem } from '../../types';

/**
 * Module 7, Writing Winning Proposals and Applications (lessons 32 to 36, prefix `prop`): the Proposal Assistant. Five message tasks and two role-plays.
 * Used by: 32 questions before proposing (message), 33 a proposal for a virtual assistant post (message), 34 a proposal for a video editing post (message),
 * 35 deliverables, timeline and price for an automation post (message) and a client with doubts (role-play), 36 fixing a weak, generic proposal (message)
 * and a client who says it reads like a template (role-play).
 * Every post, company, client and person here is fictional and says so where the learner reads it. No task or scenario names a price to charge, and no
 * field holds an ideal reply: the learner supplies their own real facts. The partners are fair people with a reason for what they say.
 */
export const items: PracticeItem[] = [
  {
    id: 'prop-questions-before-proposing',
    kind: 'message',
    title: 'Ask the right questions before you write a proposal',
    situation:
      "This job post is fictional, written for practice. You are a freelancer (use the kind of service you really offer, or the one you are learning) and the post is vague. Before you spend an hour on a proposal, you decide to send a short message to the client. Only ask about the parts of the job you could really do.",
    brief: 'Write the short message that asks the client the questions you need answered before you propose.',
    channel: 'message',
    received:
      "FICTIONAL JOB POST. Title: Help improving our online shop. We sell handmade candles from a small studio in Portland, Oregon. Our website is slow and our emails to customers are a mess. We want someone to fix the website, make it look better, set up email marketing and maybe use AI to do some of it. We need to start soon. Budget: open. Please send your experience and your price. Good communication is a must.",
    mustInclude: [
      'an opening that names one specific thing from the post, so it is clear you read it',
      'three to six questions about the problem, the goal, the limits or what "done" means',
      'a short reason that links the questions to giving a better proposal',
      'no price, no promise of results and no claim you cannot support',
      'a clear and easy next step, such as replying here or a short call',
    ],
    targetWords: { min: 90, max: 190 },
    criteria: ['clarity', 'relevance', 'tone', 'completeness', 'actionability', 'professionalism'],
    difficulty: 'gentle',
  },
  {
    id: 'prop-proposal-property-assistant',
    kind: 'message',
    title: 'Write a proposal for a virtual assistant job post',
    situation:
      "The post below is fictional, written for practice. Write the proposal as a virtual assistant, using only experience you really have. If you have none in this kind of work, say what you have done that is close, or offer a sample clearly labelled as a sample. Never invent a past client, a result or a tool you do not know.",
    brief: 'Write a proposal that answers this client\'s problem, shows one honest piece of proof and ends with a clear next step.',
    channel: 'message',
    received:
      "FICTIONAL JOB POST. Title: Virtual assistant for a small property office. We manage about 40 rental homes in Ohio and run a small office. We need help about 15 hours a week: sort the shared inbox each morning, answer simple tenant questions using saved replies, book repair visits in our calendar and keep a spreadsheet of lease dates up to date. Some overlap with US Central morning hours would help. We have had two assistants leave quickly, so we want someone dependable and organised. Please tell us how you would handle the first week, what you would need from us, and include one example of similar work. Budget: open.",
    mustInclude: [
      'the client\'s own problem in their words (for example, dependability and a busy inbox)',
      'your understanding of the job in one or two sentences',
      'a small first step, such as a first-week plan',
      'one honest piece of relevant proof, or a sample clearly labelled as a sample',
      'what you need from the client and when',
      'a clear next step, such as a short call or a paid first week',
    ],
    targetWords: { min: 160, max: 320 },
    criteria: ['relevance', 'clarity', 'completeness', 'integrity', 'professionalism', 'actionability', 'structure'],
    difficulty: 'realistic',
  },
  {
    id: 'prop-proposal-recipe-videos',
    kind: 'message',
    title: 'Write a proposal for a video editing job post',
    situation:
      "This post is fictional, written for practice. Write the proposal as a video editor. Use only work you really did, or a sample you made and clearly call a sample. If you do not edit video, write as the freelancer you are and say honestly what you would adapt. Do not invent clients, views or results.",
    brief: 'Write a proposal that shows relevant work honestly, answers the client\'s worry about slow turnaround and feedback, and proposes a small first step.',
    channel: 'message',
    received:
      "FICTIONAL JOB POST. Title: Editor for short recipe videos. We are a small cooking school in Leeds, in the United Kingdom. We teach home cooks, online and in person, and we want to post short recipe videos. We film on a phone and need someone to edit about eight videos a month, each 45 to 90 seconds, with captions, our logo and music we are licensed to use. We tried one editor before. The videos looked nice but it took three weeks and we could not ask for small changes. Please share a sample of your editing and tell us how you would handle feedback. Budget: please tell us how you would price this.",
    mustInclude: [
      'the client\'s two worries in their words (slow turnaround and no room for small changes)',
      'one specific sample of your own work, or a sample clearly labelled as a sample, and what it shows',
      'how you would handle feedback and how long a round might take, stated as an assumption',
      'a small first step, such as editing one video before the monthly work begins',
      'no invented results, clients or numbers',
      'a clear next step',
    ],
    targetWords: { min: 160, max: 320 },
    criteria: ['relevance', 'clarity', 'integrity', 'completeness', 'professionalism', 'actionability'],
    difficulty: 'realistic',
  },
  {
    id: 'prop-scope-timeline-price-reminders',
    kind: 'message',
    title: 'Write the deliverables, timeline and price part of a proposal',
    situation:
      "This post is fictional, written for practice. You are an automation builder (or any freelancer who could do this job). Write only the section of the proposal about what you will deliver, when, and how you think about the price. Use your own figures or placeholders such as [your range]. The coach reads your reasoning, not the amount, and no amount here is a right one.",
    brief: 'Write the deliverables, timeline and price section: specific, honest about what is not included, and with the reasons behind the price.',
    channel: 'message',
    received:
      "FICTIONAL JOB POST. Title: Follow-up messages after a job is finished. We are a small plumbing and heating company near Kingston, Ontario. Our office manager spends hours each week sending thank-you emails and asking for feedback after jobs. We use a booking tool and a spreadsheet. We would like these messages to go out automatically: a thank-you after a job is marked complete, and a polite request for feedback a few days later. For the first month, someone should read each message before it is sent. We are not sure what is possible. Please tell us what you would deliver, how long it would take, and how you would price it. Budget: not decided, we would like to understand the options.",
    mustInclude: [
      'deliverables written so that the client could check each one (not "an automation")',
      'what is not included, and the assumptions you are making',
      'a timeline of steps, with what you need from the client at each step',
      'a price as a range or as options, with what moves it up or down',
      'how a change to the plan would be handled',
    ],
    targetWords: { min: 150, max: 300 },
    criteria: ['clarity', 'completeness', 'structure', 'professionalism', 'integrity', 'actionability'],
    difficulty: 'realistic',
  },
  {
    id: 'prop-client-doubts-studio',
    kind: 'roleplay',
    title: 'A client replies to your proposal with doubts',
    setting:
      "You are a freelance graphic designer in the Philippines. Callum, who runs a small cycling studio in Brisbane, Australia, posted a job for a new class timetable design and a few templates for social media. You sent a proposal two days ago. He has just replied with questions. He is fictional, as is his studio.",
    goal: 'Answer his worries honestly and specifically, and agree a small, clear next step.',
    partner: {
      role: 'client',
      name: 'Callum',
      title: 'Owner of a small cycling studio in Brisbane, hiring a designer for the first time from abroad',
      personality:
        'Friendly, a little nervous and direct. Writes short messages. Likes concrete answers and gets quieter when he hears big promises or vague comfort. Warms up quickly when someone is specific and calm.',
      private:
        "His last designer sent one rough draft and then stopped answering, so he fears being left stuck before a launch of new classes in about six weeks. He has never worked with someone many hours ahead of him and is unsure how to talk to them. He is not looking for the cheapest person. He would be happy to start with a small paid first step before committing to everything. He does not know what to ask, so he asks about 'how it works day to day'. He will not mention the launch date unless it feels useful, but he does worry about the timeline. If the learner promises perfection or 'no problem at all' he gets more suspicious. If the learner invents experience he does not ask for proof now, but he asks for a link or an example, and a vague reply makes him pull back.",
      reactions: {
        good: "When the learner names his worry (being left stuck), explains a simple working rhythm (when they reply, how drafts are shared, what they need from him) and proposes a small first step with a clear date, he relaxes, asks one practical question and says he is open to starting.",
        poor: "When the learner is vague, over-promises ('guaranteed', 'perfect'), becomes defensive about his doubts or buries him in a long speech, he gets shorter, repeats his worry and says he needs to think about it.",
      },
    },
    opening:
      "Hi, thanks for your proposal. I read it twice and it looks good. But I am a bit nervous. I have never hired anyone from overseas, and my last designer sent one draft and then went quiet. How would this actually work day to day?",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['empathy', 'clarity', 'integrity', 'actionability', 'professionalism'],
    strongSigns: [
      'Names his worry plainly (being left without a reply) before explaining anything',
      'Describes a simple working rhythm: when they will reply, how drafts are shared, what they need from him',
      'Treats the time difference as logistics to agree on, not as a problem to hide',
      'Suggests a small, clear first step with a date, so he is not committing to everything at once',
      'Makes no promise the learner cannot keep and no invented experience',
      'Asks one useful question back, such as what the launch date is',
    ],
    traps: [
      'Promising a perfect result or a guaranteed outcome',
      'Getting defensive, or treating his worry as an insult',
      'A long reply that explains the learner\'s process but never answers "day to day"',
      'Claiming experience or past clients that are not real',
      'Pushing him to decide right now',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'prop-fix-generic-proposal',
    kind: 'message',
    title: 'Fix a weak, generic proposal',
    situation:
      "You are a customer support freelancer. Below is a fictional job post, followed by the first draft you wrote in a hurry. It is weak. Rewrite it so that it answers this client's problem. Use only experience you really have. If you have little, say so honestly and offer a clearly labelled sample, such as how you would answer a customer. At the end, add one or two sentences saying what you changed and why.",
    brief: 'Rewrite the weak draft into a specific, honest proposal, and note what you changed.',
    channel: 'message',
    received:
      "FICTIONAL JOB POST: Brightleaf Pet Supplies, a small online shop in Ohio, needs a part-time customer support agent for email and chat, about 20 hours a week, to answer questions about orders, shipping and returns. We have a help page and saved replies, but customers sometimes get slow or confusing answers. Please tell us how you would answer an angry customer whose order is late. Budget: open.\n\nYOUR WEAK FIRST DRAFT: Dear Sir/Madam, I am hardworking and passionate with excellent English. I can do all your tasks. I have many years of experience in customer support and I will do my best. My rate is cheap and I can start immediately. Please hire me. Thank you.",
    mustInclude: [
      'a detail from the post, such as the slow or confusing answers or the late order',
      'your own real experience or a clearly labelled sample, with nothing invented',
      'a short sample of how you would answer the angry customer',
      'a clear next step',
      'one or two sentences on what you changed and why',
    ],
    targetWords: { min: 150, max: 300 },
    criteria: ['relevance', 'clarity', 'integrity', 'empathy', 'completeness', 'professionalism', 'actionability'],
    difficulty: 'demanding',
  },
  {
    id: 'prop-template-complaint-tutoring',
    kind: 'roleplay',
    title: 'A client says your proposal looks like a template',
    setting:
      "You are a freelance writer. Naomi runs a small tutoring service for adults who return to study, in Ontario, Canada. Her fictional post asked for two articles a month about study habits and how to choose a course, in a friendly voice, with a first article as a short paid test. You sent a proposal in a hurry and it was mostly general. She has replied. She and her business are fictional.",
    goal: 'Respond honestly to the criticism, show what you now understand about her business, and keep the door open with a small next step.',
    partner: {
      role: 'client',
      name: 'Naomi',
      title: 'Owner of a small tutoring service, tired of generic proposals',
      personality:
        'Polite but tired and a little sharp. Reads quickly and notices when someone repeats her own words without understanding them. Appreciates honesty and short answers. Will test whether the learner really read the post by asking a simple question about it.',
      private:
        "She received many near-identical proposals this week and nearly closed the post. She is not angry at the learner personally. If the learner admits the proposal was too general without grovelling, shows two or three real details from her post, and proposes the small paid test article she already offered, she will give them a chance. She will ask 'So what did you notice in my post?' and 'What would you want to know about my students?' She dislikes flattery and excuses, and a fake claim of familiarity (for example, praising things her post never said) makes her end the conversation politely.",
      reactions: {
        good: "When the learner owns the miss in one honest sentence, shows what they read in the post (adult returners, study habits, choosing a course, a friendly voice, a paid test), asks a useful question about her students and offers the test article, she softens, answers the question and says she will consider them.",
        poor: "When the learner makes excuses, over-apologises, flatters her, invents things about her business, or sends another general paragraph, she becomes brief, says it still reads like the others and closes the conversation politely.",
      },
    },
    opening:
      "I will be honest. Your proposal looks like the same one I got from a lot of people this week. It does not mention my business at all. Did you actually read my post?",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['accountability', 'integrity', 'tone', 'relevance', 'actionability', 'professionalism'],
    strongSigns: [
      'Admits the proposal was too general in one calm sentence, without a long apology or excuses',
      'Shows real details from her post, in the learner\'s own words rather than copying hers back',
      'Asks one genuine question about her students or her goal',
      'Offers the small paid test article she had already mentioned, rather than asking to be hired for everything',
      'Does not flatter her or claim knowledge of her business that the post does not give',
      'Keeps the reply short and ends with a clear next step',
    ],
    traps: [
      'Saying "I did read it" and nothing more, so the answer proves nothing',
      'Over-apologising for several turns',
      'Inventing facts about her business to look prepared',
      'Pasting the same general proposal again, or a longer version of it',
      'Getting defensive or blaming how many jobs they apply to',
    ],
    difficulty: 'demanding',
  },
];
