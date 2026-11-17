import type { PracticeItem } from '../../types';

/**
 * Module 1, Understanding the International Freelance Market (lessons 1 to 5): two role-plays with fictional clients and three message tasks.
 * Used by: 1 how clients hire (role-play, gentle), 2 the four markets (role-play about time zones and payment), 3 freelancing compared (message,
 * demanding), 4 services and what clients pay for (message about the learner's own service), 5 research with AI (message: what the AI said and what I checked).
 * Every client, company and post here is fictional. None of the partners is a villain: each has a believable position and a private reason for it.
 */
export const items: PracticeItem[] = [
  {
    id: 'mkt-first-overseas-hire',
    kind: 'roleplay',
    title: 'Explain how hiring an overseas freelancer would work',
    setting:
      "You are a freelancer in the Philippines who offers virtual assistant help (if your real service is different, picture it instead). Hannah owns a small physiotherapy clinic in the north of England. She is fictional, like her clinic. She found your profile and agreed to a 15-minute video call. She has never hired anyone outside the United Kingdom.",
    goal: 'Help Hannah understand, in plain words, how working with you would go, so that she feels able to take a small first step.',
    partner: {
      role: 'client',
      name: 'Hannah',
      title: 'Owner of a small physiotherapy clinic, curious about hiring help from abroad for the first time',
      personality:
        'Friendly, careful and a little nervous about something new. Asks short, honest questions. Speaks in everyday words and does not know freelance or technology jargon. Warms up quickly to plain answers and loses patience with big promises.',
      private:
        "Her front desk is overwhelmed: enquiries and appointment emails pile up after hours. A friend had a bad experience with a freelancer who stopped replying, so she fears someone disappearing. She is also worried about patients' private details and about whether paying someone abroad needs special paperwork, but she will only raise these if the conversation gets there or the learner invites it. She does not know what a marketplace is. She would be happy with a small, short trial task first, and with clear times when she can reach the learner. She has not decided on a budget and will not state one unless asked. She does not expect the learner to give legal advice, and she distrusts anyone who says everything is simple.",
      reactions: {
        good:
          "When the learner explains the steps in plain words (a first conversation, a small trial, how they would stay in touch, how work is checked and paid), asks what worries her, is honest about what they do and do not know, and suggests a small first step, Hannah relaxes, asks practical follow-up questions (privacy, payment, how fast replies come) and says she could try a short task.",
        poor:
          "When the learner is vague ('don't worry, it's easy'), overpromises ('I can do everything', 'I never make mistakes'), uses jargon, ignores her worries, or claims experience or results they have not described honestly, she becomes quieter and more doubtful, repeats her worry about someone disappearing, and says she will think about it.",
      },
    },
    opening: "Hello, thanks for making time. I've never hired anyone from overseas, so I'm a bit lost. If I did hire you, how would it actually work?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['clarity', 'listening', 'tone', 'completeness', 'integrity'],
    strongSigns: [
      'Explains the process in simple steps a first-time client can picture, not in jargon',
      'Asks what worries her or what she needs help with before describing themselves at length',
      'Is honest about what they have done and what they would still need to check, with no invented experience or results',
      'Suggests a small, low-risk first step, such as a short trial task',
      'Says how they would stay in touch (times they reply, how updates are sent) and how work would be checked',
      'Treats her worries about privacy and payment seriously without giving legal advice or claiming it is all simple',
    ],
    traps: [
      'Promising that nothing can go wrong or that they can do any task',
      'Talking mostly about themselves and not about her problem',
      'Using terms such as async, SOW or onboarding without explaining them',
      'Dismissing the worry about someone disappearing or about private data',
      'Claiming clients, reviews or results that were not mentioned, to sound more credible',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'mkt-timezone-payment-worry',
    kind: 'roleplay',
    title: 'Ease a client\'s worry about time zones and payment',
    setting:
      "You are a freelance video editor in the Philippines (use your own service if it is different). Marcus sells online courses from Toronto, Canada. He and his business are fictional. He liked your samples and replied to your message, and now you are on a short call. Your working day is his night, and he has told you he has never paid anyone abroad.",
    goal: 'Understand what is behind his worries and agree how you would handle time differences and payment, without promising what you cannot do.',
    partner: {
      role: 'client',
      name: 'Marcus',
      title: 'Runs a small online course business, has hired local freelancers before but never one in another country',
      personality:
        'Practical and a bit rushed. Likes clear plans and dislikes surprises. Not unfriendly: he asks direct questions and says what he is thinking. Respects honesty about limits.',
      private:
        "A previous freelancer went quiet right before a course launch, so what he really fears is silence and missed dates, not the clock itself. He could live with a twelve-hour gap if there are clear deadlines, a written plan and updates he can read when he wakes up; he does not need live calls every day. He does not know how paying across countries works (he has only used card payments and e-transfers) and wonders about fees and who pays them, but he does not know the answer and expects the learner to explain what they know and say what they would check. He will not ask for legal or tax advice but will ask 'do I need special paperwork?'. He has a launch about six weeks away and wants to start with one small module of videos.",
      reactions: {
        good:
          "When the learner asks what he is worried about, states their actual working hours and when he can expect replies, proposes a simple rhythm (a plan, deadlines, a written update, one short call a week if he likes), explains in plain words what they know about getting paid and says honestly what they would confirm, he relaxes, shares the launch date, and moves toward starting with one small module.",
        poor:
          "When the learner says 'no problem, I'm available any time' without a real plan, brushes off payment ('don't worry about fees'), invents certainty about paperwork or rules, or ignores his fear about going silent, he gets more guarded, asks the same question again in a sharper way, and starts talking about hiring someone in his own time zone.",
      },
    },
    opening: "Thanks for jumping on. I like your samples. But honestly, your day is my night, and I've never paid anyone abroad. How would this work, day to day?",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['listening', 'problem-solving', 'integrity', 'actionability', 'professionalism'],
    strongSigns: [
      'Asks what exactly worries him instead of defending immediately',
      'Gives their real working hours and a realistic reply time rather than saying they are always available',
      'Proposes a simple routine: deadlines, written updates and, if he wants, a short regular call at a time that suits both',
      'Explains what they know about being paid from abroad in plain words and says what they would check, such as options and who pays any fees',
      'Does not give legal or tax advice, and suggests he confirms paperwork questions with a professional',
      'Offers a small first piece of work and a clear next step',
    ],
    traps: [
      'Saying they can work any hours to win the job, then having no plan',
      'Telling him not to worry about fees, paperwork or rules',
      'Stating legal or tax rules as facts',
      'Getting defensive about being in another country',
      'Answering the clock question but never touching his real fear of missed dates and silence',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'mkt-employee-or-freelancer-reply',
    kind: 'message',
    title: 'Reply to an offer that sounds like a job',
    situation:
      "You are a freelancer in the Philippines who does bookkeeping and admin support. A message arrives from Greg at a small marketing company in the United States. Greg and his company are fictional. He calls this a 'freelance contract', but parts of it sound like a full-time job. You have not decided anything yet and you want to understand the offer before you say yes or no.",
    brief: 'Write a reply that thanks Greg, asks the questions that would tell you what kind of arrangement this is, and says honestly how you work.',
    channel: 'email',
    received:
      "Hi, we loved your profile. We'd like to bring you on as a freelance contractor, full time. You'd work 9 to 5 on our Eastern hours, use a company laptop and our Slack and email, and join our daily team call. We'd need you to not take on other clients while you're with us. Payment is hourly, invoiced at the end of each month. Can you confirm you're in and start Monday? We're moving fast.",
    mustInclude: [
      'a polite thanks and real interest, not a yes',
      'a question about what kind of arrangement this is and who the agreement would be with',
      'questions about the hours, the overlap they expect and the daily call',
      'a question about the equipment and the request not to take other clients',
      'one or two true statements about how you usually work, in your own words, with nothing invented',
      'a note that you want the terms in writing and will check them (or ask a qualified professional) before agreeing, with no legal claims of your own, and a clear next step such as a short call instead of a start date',
    ],
    targetWords: { min: 100, max: 210 },
    criteria: ['clarity', 'professionalism', 'completeness', 'integrity', 'actionability', 'tone'],
    difficulty: 'demanding',
  },
  {
    id: 'mkt-service-in-client-words',
    kind: 'message',
    title: 'Describe your own service in the words of a client\'s problem',
    situation:
      "You are practising how to talk about your own service in terms of what a client wants, not the tasks you do. Below is a fictional post from a fictional small business. Use your own real service and skills (a virtual assistant, developer, designer, writer, support agent, bookkeeper, video editor, or something else) and write two or three sentences you could say to this client. Use only what is true about you and what you could really do.",
    brief: 'In two or three sentences, say how your real skills could help this client with the problem in their post, and what you would still need to know.',
    channel: 'message',
    received:
      "We run a small online shop selling handmade candles. Customers keep emailing us the same questions (shipping times, returns, custom orders) and we answer late. We also have a pile of product photos and no time to put them on the site properly. We are not looking for a big project. We would like to try someone on a small task first and see how it goes.",
    mustInclude: [
      "the client's problem in their own words (late answers, or photos not on the site), not a list of your tasks",
      'what your real skills could do about it, said as a result for them, with no invented numbers or promises',
      'one true statement about your experience or a labelled sample, with nothing made up',
      'one question about what you would still need to know',
    ],
    targetWords: { min: 55, max: 140 },
    criteria: ['clarity', 'relevance', 'integrity', 'completeness', 'structure'],
    difficulty: 'realistic',
  },
  {
    id: 'mkt-research-note-ai-and-checked',
    kind: 'message',
    title: 'Write a market note that separates what the AI said from what you checked',
    situation:
      "You have asked an AI assistant about one service in one market, and you have spent some time on the open web looking for real public information (a few job posts, business websites or profile pages). This note is your own work, written about your own real service and market. You must report only what you actually checked. If you have not checked something yet, say so. If you cannot do live research today, say that at the top and write the note with 'not checked yet' for the checking part.",
    brief: 'Write a short research note with three parts: what the AI said, what you checked and where, and what is still unknown, ending with one next step.',
    channel: 'update',
    received:
      "A sample answer, written for practice and not from a real AI session. You may use it as the 'AI said' part if you have no answer of your own, and say so.\n\nQuestion asked: 'What do small businesses in Australia look for when they hire a remote bookkeeper?'\n\nAnswer: 'Small businesses in Australia often look for someone who can work with the accounting software they already use, reply within a clear time, and explain figures in plain language. Many are very price sensitive. Platform X is the best place to find these clients and takes a low fee. Most clients want a bookkeeper available during Australian business hours.'",
    mustInclude: [
      'your service and the one market the note is about',
      'two or three specific claims, each marked as what the AI said',
      'at least two things you actually checked, each with where you looked (the kind of page or a link) and the date, or an honest "not checked yet"',
      'at least one AI claim that you could not support, or that you found differently, named plainly',
      'what is still unknown',
      'one concrete next step, such as asking a person who hires or reading ten more public posts',
    ],
    targetWords: { min: 140, max: 300 },
    criteria: ['structure', 'integrity', 'completeness', 'clarity', 'relevance', 'actionability'],
    difficulty: 'realistic',
  },
];
