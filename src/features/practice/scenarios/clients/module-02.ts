import type { PracticeItem } from '../../types';

/**
 * Finding International Clients, module 2: Finding Your Niche and Ideal Clients (lessons 6 to 10), prefix `niche`. Three message tasks and three role-plays.
 * Used by: 06 the skills-and-proof note (message), 07 a reply to a vague inquiry (message), 08 the Niche Discovery Coach mentor interview (role-play),
 * 09 learning how a small business works (role-play), 10 a value proposition (message) and the "why should I pick you?" prospect (role-play).
 * Every client, business and prospect here is fictional. The learner's own skills and proof are the learner's own: the AI never supplies them.
 */
export const items: PracticeItem[] = [
  {
    id: 'niche-skill-proof-note',
    kind: 'message',
    title: 'Write your three best-supported skills',
    situation:
      "A mentor you know offered to look over your skills before you start looking for clients abroad. This task reviews YOUR OWN real skills, so use facts from your own life and work: nothing invented, no borrowed experience. If you have little work history, school projects, volunteering and personal projects count, as long as you say what each one is.",
    brief: 'Write the short message to your mentor with your three best-supported skills, what you did for each and the proof that exists, or an honest "no proof yet".',
    channel: 'message',
    received:
      "Happy to look at it! Please send me your top three skills, but skip the adjectives. For each one: what did you actually do, roughly when, and what could I look at to see it? If there is no proof yet, just say so. That is useful for me to know, and it is nothing to be embarrassed about. Add one skill you are still learning, so I can see the difference. Keep it short and I will reply with questions.",
    mustInclude: [
      'three skills the learner really has, each starting from something they did',
      'for each skill, what it was, for whom or where, and roughly when',
      'for each skill, the proof that exists and where it is, or an honest "no proof yet"',
      'one skill clearly marked as still learning',
      'no invented numbers, clients, employers or results',
    ],
    targetWords: { min: 110, max: 230 },
    criteria: ['clarity', 'integrity', 'completeness', 'relevance', 'structure', 'grammar'],
    difficulty: 'gentle',
  },
  {
    id: 'niche-service-inquiry-reply',
    kind: 'message',
    title: 'Answer "What exactly would you do for me?"',
    situation:
      "A small business owner found your profile and wrote to you. She and her shop are fictional. You answer as yourself, from your own real skills: describe ONE service you could honestly offer today, in terms of what she would get, and do not claim skills or past clients you do not have.",
    brief: 'Reply to Elena: describe one service in terms of the result and what she receives, say what it does not include, and ask one question about her situation.',
    channel: 'email',
    received:
      "Hello, I saw your profile. It says you do design, social media, copywriting, websites and customer support. That is a lot! I run a small online bookshop in Melbourne with three part-time staff (this is a fictional message). Our newsletter is often late, and customers sometimes wait days for answers to simple questions. I am not sure which of your services I even need. What exactly would you do for me, and what would I get at the end of it? I would also like to know a little about your experience. Thank you, Elena",
    mustInclude: [
      'one service, described by the result for Elena and what she would receive',
      'what the service does not include, so the scope is clear',
      'an honest, specific sentence about the learner\'s real experience or samples, with nothing invented',
      'one question about Elena\'s situation that shows the learner read her message',
      'a simple next step for Elena to take',
    ],
    targetWords: { min: 100, max: 210 },
    criteria: ['clarity', 'relevance', 'integrity', 'professionalism', 'completeness', 'actionability'],
    difficulty: 'realistic',
  },
  {
    id: 'niche-mentor-interview',
    kind: 'roleplay',
    title: 'The mentor interview: what have you really done?',
    setting:
      "You are about to look for freelance clients abroad. A freelance consultant named Renata, who has years of experience working with international clients and volunteers as a mentor, agreed to a short interview. She will ask about your skills and what you have really done, and she will keep pushing for specifics and a narrower focus. Answer with your own real experience. This is practice with a simulated mentor, and the AI will not give you a niche.",
    goal: 'Show what you have really done, with proof or an honest "not yet", and leave with one narrower focus you could test.',
    partner: {
      role: 'stakeholder',
      name: 'Renata',
      title: 'Freelance consultant and volunteer mentor with years of experience working with clients abroad',
      personality:
        "Warm but direct. Asks one question at a time and listens to the whole answer. Politely will not accept vague words such as 'good communication', 'creative' or 'hardworking' and answers them with 'What did you actually do?' or 'What could I look at to see that?'. Never hands over a ready-made niche. Short replies, plain English.",
      private:
        "Renata has watched many beginners claim they can do everything because they fear being too narrow, and she has seen them get few replies. She believes one narrow, honest focus to test for a few weeks beats a long list. She respects an honest 'I have not done that yet' more than a big claim, and she gets quietly sceptical when answers are too polished or the learner's numbers and clients cannot be explained. She will ask for a second example if a claim is thin. She wants the learner to leave with a list of what proof exists and one focus to try, and she will not decide it for them.",
      reactions: {
        good:
          "When the learner gives concrete examples (what they did, where, roughly when), names the proof or admits there is none, and thinks about which kind of client or problem fits their best evidence, Renata becomes more engaged, asks sharper follow-ups about one area and offers a short, encouraging observation about what looks strongest so far.",
        poor:
          "When the learner uses big or vague words, claims to do everything, names clients or results they cannot explain, or says 'whatever the client needs', Renata keeps asking for one specific example, then says plainly that she cannot tell yet what they do best and asks them to try again with one real project.",
      },
    },
    opening:
      "Thanks for making time. I will ask a few questions, and I will keep asking for specifics, because that is how I would want someone to help me. So, to start: in a sentence or two, what kind of work would you like to do for clients abroad, and what have you actually done that is related to it?",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'integrity', 'relevance', 'completeness', 'adaptability'],
    strongSigns: [
      'Gives specific examples (what they did, where, roughly when) instead of adjectives',
      'Names the proof for a claim, or says honestly that there is none yet',
      'Separates what they can do now from what they are still learning',
      'Notices which area has the best evidence and thinks about narrowing to it',
      'Stays honest when pushed, without inflating or apologising for a gap',
      'Ends with one narrower focus to test and a concrete next step',
    ],
    traps: [
      'Answers with adjectives or tool names only',
      'Claims to be able to do everything for everyone',
      'Invents clients, employers, numbers or results',
      'Gets defensive when asked to show proof, or says the question is unfair',
      'Asks Renata to pick the niche instead of reasoning from their own evidence',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'niche-industry-owner-chat',
    kind: 'roleplay',
    title: 'Learn how a small business really works',
    setting:
      "You are researching businesses of one kind for the niche you are testing. Giselle, who owns a small garden and landscaping company in Perth, Australia (a fictional business), answered your short, polite message and offered ten minutes. Your goal is to understand her business, not to pitch. Imagine you offer the service you chose in this module, and use your own real skills.",
    goal: 'Understand how her business earns money and where her week goes, using questions and her own words, without pitching.',
    partner: {
      role: 'client',
      name: 'Giselle',
      title: 'Owner of a small garden and landscaping company with five staff, fictional',
      personality:
        "Friendly, practical and short on time. Answers what she is asked in everyday words and gives only a little extra. Has heard many sales messages and becomes brief if the learner starts selling. Likes questions about her work and warms up when she is allowed to tell stories about her week.",
      private:
        "Her business earns money from regular garden care for homes and from bigger one-off landscaping jobs. Her real headaches are that she writes every quote by hand in the evenings, keeps invoices in a spreadsheet and chases late payments, and her best months bring more enquiries than she can answer. She will not volunteer this unless asked about her week, where time goes, what she dislikes doing, or what went wrong recently. She is wary of anyone who starts with 'I can do X for you'. She does not want to be told what her problem is.",
      reactions: {
        good:
          "When the learner asks open questions about how customers find her, what a normal week looks like, and what takes too long, she tells specific stories (the evening quotes, the late payments, the missed enquiries) and asks the learner what they do. If the learner repeats her problem accurately in her own words, she says so warmly.",
        poor:
          "When the learner pitches early, guesses her problems as facts ('you must struggle with...'), asks many questions at once, or uses jargon, she gives short polite answers and says she needs to get back to her crew.",
      },
    },
    opening:
      "Hi, thanks for your message. I have about ten minutes before my crew checks in. I was not sure what you wanted. What would you like to ask me?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['listening', 'relevance', 'clarity', 'tone', 'problem-solving'],
    strongSigns: [
      'Starts by asking about her business and her week, not by describing the learner\'s service',
      'Asks open questions: how customers find her, where time goes, what went wrong recently',
      'Treats what she says as facts to learn from, and does not guess her problems as facts',
      'Uses her words and checks understanding by saying a point back',
      'Keeps the pitch out, and ends by thanking her and asking if a short follow-up would be welcome',
    ],
    traps: [
      'Pitches the learner\'s service in the first two turns',
      'Tells her what her problems must be',
      'Asks a long list of questions in one message',
      'Uses jargon she would not use',
      'Claims knowledge of her industry that the learner does not have',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'niche-value-proposition',
    kind: 'message',
    title: 'Write your value proposition in two or three sentences',
    situation:
      "You are writing the short statement you would put at the top of a profile or in a first message: who you help, what result, how, and why someone should believe you. This task reviews YOUR OWN work. Use your real niche idea, your real proof from lesson 6 and an honest difference. The prospect below is fictional and only shows the kind of reader you write for.",
    brief: 'Write a two-to-three-sentence value proposition for the kind of client in the profile, using your own real evidence and one honest difference.',
    channel: 'message',
    received:
      "Fictional prospect profile (an example of the reader, not a real business): Kestrel Home Goods, a small online shop in Manchester with two staff, sells reusable kitchen items. Its public site lists a support email address and says replies are sent within two working days. The owner posted on the shop's own blog that she wants to spend less time on routine customer questions and more time choosing new products. The shop has a few hundred customers and sells mainly in the UK. What would make her stop and read a stranger's message is a clear sense of who you help, what changes for her, and why she can believe you.",
    mustInclude: [
      'who the learner helps, narrow enough for a reader to recognise themselves',
      'the result or problem solved, not a list of tasks or tools',
      'one real piece of the learner\'s own proof, or an honest label for a sample',
      'one honest difference that can be checked, such as a process or a way of communicating',
      'no empty words (hardworking, passionate, best) and no guarantees or invented results',
    ],
    targetWords: { min: 40, max: 95 },
    criteria: ['clarity', 'relevance', 'integrity', 'completeness', 'grammar', 'professionalism'],
    difficulty: 'realistic',
  },
  {
    id: 'niche-why-you-prospect',
    kind: 'roleplay',
    title: '"Why should I pick you over other freelancers?"',
    speaking: true,
    setting:
      "Priya runs a small online kitchenware shop in Manchester, UK (a fictional business). She posted a short job request and has spoken to a few freelancers. She gave you a ten-minute call and wants to hear why she should choose you. Imagine you offer the service and niche you built in this module, and answer from your own real experience and samples.",
    goal: 'Give an honest, specific answer about why you fit a shop like hers, and agree a clear next step.',
    partner: {
      role: 'client',
      name: 'Priya',
      title: 'Owner of a small online kitchenware shop with two part-time staff, fictional',
      personality:
        "Polite, busy and careful. Asks direct follow-up questions ('Can you give me an example?', 'Have you done this for a shop like mine?'). Distrusts big claims and words like 'best' or 'cheapest'. Warms up to a plain, specific answer and to a clear explanation of how the learner would work.",
      private:
        "A freelancer once disappeared halfway through a project, so Priya values reliability and regular, clear updates above flashy results. Her budget is limited, but she does not want to hire on price alone. She wants someone who understands small shops, can start with a small first step, and will tell her honestly what they can and cannot do. If the learner has no experience with shops like hers and says so honestly while offering a relevant sample, a plan for a small first step, or a clear way of working, she respects it. If the learner invents experience, she asks which shop and whether she can see it, and she cools quickly.",
      reactions: {
        good:
          "When the learner answers in plain words, names who they help, gives one real example or an honestly labelled sample, explains how they would work and keep her informed, and proposes a small clear next step, Priya relaxes, asks practical questions about timing and communication, and says she would like to continue.",
        poor:
          "When the learner uses empty words ('hardworking, passionate, affordable'), claims to be the best, names clients or results they cannot explain, criticises other freelancers, or only talks about price, Priya asks for a concrete example, then says she needs to think about it and ends the call politely.",
      },
    },
    opening:
      "Thanks for making time. I have been speaking to a few freelancers, so I am going to be direct. In a minute or two, why should I pick you over the others?",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['clarity', 'integrity', 'relevance', 'listening', 'actionability'],
    strongSigns: [
      'Says plainly who they help and what changes for that kind of client',
      'Gives one real example, or an honestly labelled sample, instead of a list of adjectives',
      'Explains how they would work and how they would keep the client informed',
      'Admits what they have not done yet, then offers a relevant small first step',
      'Does not criticise other freelancers and does not lead with price',
      'Ends with one clear next step',
    ],
    traps: [
      'Uses empty words such as hardworking, passionate, affordable or best',
      'Invents shops, results or years of experience',
      'Compares themselves to other freelancers in an unkind way',
      'Leads with a low price as the main reason to choose them',
      'Gives a long, unfocused answer and never asks about the shop',
    ],
    difficulty: 'demanding',
  },
];
