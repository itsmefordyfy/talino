import type { PracticeItem } from '../../types';

/**
 * Module 8, Communicating with International Clients (lessons 37 to 41, the Communication Coach): two role-plays and five message tasks.
 * Used by: 37 clarifying a vague request (message), 38 a time-zone boundary (message), 39 explaining an idea simply (role-play, speaking),
 * 40 a project update (message), 41 a mistake conversation (role-play), the message that follows it (message) and a scope extra (message).
 * Every client, business and message here is fictional. None of the partners is a villain: each has a believable position and a private reason for it.
 * Every message task's criteria include clarity, tone, grammar and professionalism.
 */
export const items: PracticeItem[] = [
  {
    id: 'talk-clarify-vague-feedback',
    kind: 'message',
    title: 'Reply to vague feedback with clear questions and a clear time',
    situation:
      "You are a freelance graphic designer. You sent a first version of a logo to Hannah, who owns a small tea shop in Manchester in the United Kingdom (a fictional client). Her reply is friendly but vague, and her deadline is real: she meets the printers on Friday. You live in a different time zone, so 'tomorrow' could mean different times for the two of you.",
    brief: "Reply to Hannah in clear, friendly English: ask what you need to know to improve the logo, and agree exactly what she will receive and when.",
    channel: 'email',
    received:
      "Hi, thanks for sending this over. Love the colours! Could you make the logo a bit more punchy? Also the font feels a bit off, not sure why. I'd like to see something by tomorrow-ish if poss, as I'm meeting the printers on Friday. Cheers, Hannah",
    mustInclude: [
      'a thank-you with one specific thing you noticed she liked',
      'two or three short questions that ask what punchy and off mean to her (for example, an example she likes), not yes or no questions',
      'a clear time for the next version: day, date or time, and whose time zone',
      'what exactly she will receive at that time',
      'a link back to her Friday deadline, so she knows you read it',
    ],
    targetWords: { min: 90, max: 170 },
    criteria: ['clarity', 'tone', 'grammar', 'professionalism', 'completeness', 'actionability'],
    difficulty: 'gentle',
  },
  {
    id: 'talk-time-zone-boundary',
    kind: 'message',
    title: 'Agree a new call time and set a response window kindly',
    situation:
      "You are a virtual assistant in the Philippines working part-time for Greg, who runs a small coaching business in Denver in the United States (a fictional client). Your agreed working hours are 8 am to 2 pm Manila time, Monday to Friday. In winter, when Denver clocks are on standard time, Denver is 15 hours behind Manila: so 6 pm on Thursday in Denver is 9 am on Friday for you, and Greg's whole working day falls while you are asleep or offline. Greg is a kind client who has never worked with someone so far away.",
    brief:
      "Reply to Greg: confirm the new call time in both time zones, and explain kindly what you can offer in place of being on chat during his working day.",
    channel: 'email',
    received:
      "Hi, quick one. Tuesdays are getting crazy for me, can we move our weekly call to Thursday, same time? Also I'd love for you to be reachable on chat during my working day (9 to 5 Mountain time), since things come up and I like fast answers. Is that doable? Thanks, Greg",
    mustInclude: [
      'a clear answer on the Thursday call, with the time written in both time zones',
      'your working hours written in both time zones, so Greg can see why live chat during his day does not fit',
      'a concrete alternative you can offer, such as how fast you reply and what he gets at the end of his day',
      'a simple way to handle a real emergency, or a question asking what counts as urgent for him',
      'a polite request for Greg to confirm',
    ],
    targetWords: { min: 110, max: 200 },
    criteria: ['clarity', 'tone', 'grammar', 'professionalism', 'completeness', 'actionability', 'negotiation'],
    difficulty: 'realistic',
  },
  {
    id: 'talk-explain-simply',
    kind: 'roleplay',
    title: 'Explain one idea from your work in plain words',
    setting:
      "You are on a video call with Daniel, who owns a small physiotherapy clinic in Sydney, Australia (a fictional client). Your last message said that a decision in your project needs his input, and he asked for a short call to understand it. Before you start, choose one idea from your own kind of service that a client may find hard (for example: why a website needs hosting, what an automation does when it runs, what a file format means for editing, how expenses are sorted into categories, or what happens when a support ticket is escalated). Open by telling Daniel which idea it is.",
    goal: 'Explain your chosen idea in plain words so Daniel understands what it means for his clinic and can make the decision.',
    partner: {
      role: 'client',
      name: 'Daniel',
      title: 'Owner of a small physiotherapy clinic, not technical, hired you for a project',
      personality:
        'Friendly, quick and busy. Speaks in everyday words and has no patience for jargon, though he never says so rudely. Asks short questions such as "What does that mean for me?" and "Can you give me an example from the clinic?" Plays along with whatever idea the learner chooses, asks only the questions a non-expert would ask about it, and never supplies technical detail himself.',
      private:
        "A year ago he approved something he did not fully understand and was surprised by the cost later, so he now nods politely even when he is lost and does not want to look foolish. He will only admit he is confused if the learner asks a real checking question (for example, asking him to say it back in his own words or asking which part is unclear). What he needs to decide is practical: what it costs, how long it takes, what could go wrong and what he has to do himself. He is not testing the learner and will make the decision once he understands.",
      reactions: {
        good:
          "When the learner starts with what the idea means for the clinic, uses everyday words and one comparison from Daniel's world, keeps it short, then asks what is unclear or asks him to say it back, he admits the part he did not follow, says it back in his own words, asks a sensible question about cost or timing and moves to a decision.",
        poor:
          "When the learner uses technical words, talks for a long time, stays vague or only asks 'does that make sense?', he says 'yeah, sure' and then asks the same question again in different words, or says 'I'll trust you' and the decision stalls. If the learner sounds as if he should already know this, he becomes brief and a little guarded.",
      },
    },
    opening:
      "Hi, thanks for jumping on. You said there's something I need to understand before you go ahead. I'm not technical, so please go easy on me. What's the idea?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['clarity', 'relevance', 'listening', 'tone', 'adaptability', 'structure'],
    strongSigns: [
      'Starts with what the idea means for Daniel (cost, time, risk or a choice), not with how it works inside',
      'Uses everyday words and explains or avoids every technical term',
      'Uses one comparison or example from his clinic, not a generic one',
      'Keeps each turn short and adds a layer only when he asks',
      'Checks understanding with a real question, such as asking which part is unclear or asking him to say it back',
      'Ends with the decision in plain words, what happens next and what he needs to do',
    ],
    traps: [
      'Opens with the technical detail or a definition full of jargon',
      'Gives one long explanation and never pauses',
      "Asks 'does that make sense?' and accepts a polite yes",
      'Uses an analogy that is unrelated to his work or that stretches until it is wrong',
      'Sounds as if he should already know, or says it is simple',
    ],
    difficulty: 'realistic',
    speaking: true,
  },
  {
    id: 'talk-weekly-update',
    kind: 'message',
    title: 'Write a project update a busy client can read in a minute',
    situation:
      "You are a freelance AI automation builder. You are building a workflow that sends polite payment reminders for Amara, the office manager of a small property management company in Calgary, Canada (a fictional client). It is the end of week 3 of 5. Your notes. Done: the export from her accounting software works, and you tested the reminders on 20 made-up sample invoices. In progress: the wording of the reminder message, which Amara must approve. Blocked: you need access to the shared inbox, which her IT contact Sam was asked to set up on Monday and has not yet. Not yet known: three real invoices have no email address, so Amara must supply them. Decision needed: reminders at 7 days or at 14 days after the due date. Risk: if the inbox access does not arrive by Wednesday, the planned go-live next Friday will probably move.",
    brief:
      "Turn these notes into this week's update for Amara: lead with how things stand, and make what you need from her and by when impossible to miss.",
    channel: 'update',
    received:
      "Thanks for the Monday update. It was a bit long and I missed the part about what you needed from me! Could you keep them short and tell me up top whether we're OK? Amara",
    mustInclude: [
      'the overall status in the first line (on track, at risk or blocked) in plain words',
      'what is done, in one or two outcomes and not a list of activities',
      'the inbox access request, with who and a date',
      'the 7-day or 14-day decision, with one clear way to answer',
      'the honest effect on the go-live date and what would keep it',
      'no technical jargon Amara would have to look up',
    ],
    targetWords: { min: 100, max: 200 },
    criteria: ['clarity', 'tone', 'grammar', 'professionalism', 'completeness', 'actionability', 'structure'],
    difficulty: 'realistic',
  },
  {
    id: 'talk-wrong-time-mistake',
    kind: 'roleplay',
    title: 'Own a scheduling mistake with a client who is annoyed',
    setting:
      "You are a virtual assistant for Rachel, who runs a small architecture consultancy in Austin in the United States (a fictional client). Yesterday you booked a call between Rachel and a new materials supplier, but the invitation showed the time in your own time zone and not in hers, so the call was set for the wrong hour. The supplier waited alone for about forty minutes while Rachel was on a building site, and she only found out from his email. She has rescheduled by herself and has asked for a quick call now.",
    goal: "Own the mistake, explain what went wrong in plain words and agree how you will stop it happening again, so that Rachel can keep trusting you with her calendar.",
    partner: {
      role: 'client',
      name: 'Rachel',
      title: 'Owner of a small architecture consultancy, relies on you for scheduling',
      personality:
        'Direct, tired and fair. Does not shout. Wants short answers and has little patience for long apologies or excuses. Respects people who say plainly what happened. Speaks in short sentences and may pause before she answers.',
      private:
        "The call is already rescheduled for Thursday, so the damage is one lost day and some embarrassment in front of a new supplier. What worries her more is that she cannot tell whether it will happen again, and she is close to taking her calendar back to avoid checking everything herself. She likes working with you. A simple safeguard she can see would be enough for her to carry on: both time zones written in the invitation, a confirmation from the other person, and a reminder the day before. She will not accept blame put on her, on the supplier or on a calendar tool, and she will not ask for the fix: she waits to see whether the learner offers one.",
      reactions: {
        good:
          "When the learner says in the first turn or two what went wrong, takes responsibility without drama, does not blame anyone, offers specific changes she can see and asks what else she needs, her tone softens. She says what she would like in writing and agrees to keep going.",
        poor:
          "When the learner apologises at length, makes excuses, blames the tool, the time zones or the supplier, stays vague ('I'll be more careful') or offers a fix that depends on her checking, she stays flat and short, repeats 'but how do I know this won't happen again?' and says she may handle her calendar herself.",
      },
    },
    opening:
      "Thanks for hopping on. I'll be direct: the supplier waited on the line for forty minutes yesterday and I found out from his email. What happened?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['accountability', 'clarity', 'tone', 'problem-solving', 'professionalism', 'actionability'],
    strongSigns: [
      'Names the mistake in plain words in the first reply, without hiding behind general words',
      'Gives a short cause (the invitation showed the wrong time zone) and does not turn it into an excuse',
      "Apologises once, specifically, and does not ask Rachel to comfort them",
      'Offers concrete changes she can see, not a promise to be more careful',
      'Asks what else she needs and whether she wants to see the change in writing',
      'Checks the Thursday call is now correct and says how it was confirmed',
    ],
    traps: [
      'Long, repeated apologies that make Rachel manage the learner\'s feelings',
      'Blaming time zones, the calendar tool or the supplier',
      "Saying 'it will not happen again' with no specific change",
      'Offering a fix that depends on Rachel checking each invitation',
      'Skipping the cause because it feels embarrassing',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'talk-follow-up-after-mistake',
    kind: 'message',
    title: 'Write the message that follows a hard conversation',
    situation:
      "You are the virtual assistant from the call with Rachel, a fictional client who runs a small architecture consultancy in Austin, Texas. On the call you owned the scheduling mistake: your invitation showed your own time zone and not hers, so a supplier waited about forty minutes. You agreed these changes. From now on every invitation will carry both time zones in its title. You will ask the other person to reply to confirm the time. You will send a reminder the day before. And each Friday you will send Rachel a list of next week's calls to scan. The rescheduled call with the supplier is on Thursday, and you already confirmed it with him.",
    brief: "Write the short email that follows the call: say what happened, what you changed and what Rachel can expect from now on.",
    channel: 'email',
    received:
      "OK. I appreciate you owning it. Send me what you're going to do differently in writing, and let's see how the next few weeks go. Rachel",
    mustInclude: [
      'one specific sentence of apology that names the mistake, with no excuse',
      'the cause in one or two plain sentences',
      'the changes you agreed, written so Rachel can check them later',
      'the status of Thursday call and how it was confirmed',
      'an invitation to tell you if she would like anything different',
    ],
    targetWords: { min: 110, max: 210 },
    criteria: ['accountability', 'clarity', 'tone', 'grammar', 'professionalism', 'actionability', 'completeness'],
    difficulty: 'realistic',
  },
  {
    id: 'talk-scope-extra-request',
    kind: 'message',
    title: 'Answer a "small extra" without a flat yes or no',
    situation:
      "You are a freelance video editor. You agreed with Oliver, a creator in Auckland, New Zealand (a fictional client), to edit one 8-minute video with two rounds of changes, delivered on Friday, for a fixed fee. Captions and short clips for social media were not part of what you agreed. He has just written in the chat, two days before the deadline. You like working with Oliver and want the next job from him.",
    brief:
      "Reply in a friendly way: say plainly that the clips and captions are extra work, give him two or three real options and ask him to choose by a clear time.",
    channel: 'chat',
    received:
      "Love the first cut! One thing, can you also cut three 30-second vertical clips out of it for socials and add captions to everything? Should be quick, right? Still need it all Friday though, thanks heaps!",
    mustInclude: [
      'a thank-you and a clear statement that clips and captions are new work outside what was agreed, said without blame',
      'two or three options, each with its effect on price, date or both (for example, add it with an extra cost and a later date, deliver the main video on Friday and the extras after it, or swap something)',
      'your own price or time estimate that you could really give, or a date by which you will send a quote',
      'a clear request that he chooses, with a time to answer by',
      'a friendly tone that keeps the relationship',
    ],
    targetWords: { min: 90, max: 190 },
    criteria: ['clarity', 'tone', 'grammar', 'professionalism', 'completeness', 'negotiation', 'actionability'],
    difficulty: 'realistic',
  },
];
