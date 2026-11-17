import type { PracticeItem } from '../../types';

/**
 * Module 4, Building a Portfolio That Attracts International Clients (lessons 17 to 21): two role-plays with clients who look at a portfolio and three
 * message tasks that review the learner's own portfolio writing. Used by: 17 a client's first look (role-play), 18 a project description (message),
 * 19 a case study (message), 20 an honest note beside a sample project (message), 21 a walkthrough with hard but fair questions (role-play).
 * Every client here is fictional. The message tasks review the learner's OWN real work or a clearly labelled sample: they never ask the learner to invent
 * a client, a number or a result, and `mustInclude` says so.
 */
export const items: PracticeItem[] = [
  {
    id: 'port-first-look-fitness-studio',
    kind: 'roleplay',
    title: 'A client opens your portfolio link and asks what to look at',
    setting:
      "You are a freelance video editor. Tom, a fictional owner of a small fitness studio in Canada, clicked the portfolio link in your message and has ten minutes before his next class. He writes to you in chat. Talk about your own real work, or about a sample you made and say it is a sample. If you have nothing yet, describe one sample you would make and say that is what it is.",
    goal: 'Help him quickly find the one piece of work most relevant to his need, and say honestly what it is and what you did in it.',
    partner: {
      role: 'client',
      name: 'Tom',
      title: 'Owner of a small fitness studio, looking for someone to edit short videos for the studio’s social media',
      personality:
        'Friendly, in a hurry, writes short chat messages. Does not know editing words. Scrolls fast and leaves a page that feels like a big pile of everything. Warms up when someone points to one clear thing and says why it fits him.',
      private:
        "He needs about four short vertical clips a week from footage his coaches film on their phones. He saw thirty items on the learner's page, in many styles, and felt lost, so he has not decided whether the learner fits. He does not mind that someone is new, but he wants to know what was real client work and what was practice. He worries about hiring someone who cannot keep a steady pace week after week. He will not ask about this unless the learner talks about their process or how often they can deliver.",
      reactions: {
        good:
          "When the learner asks what he needs, then points to one or two pieces that fit, says plainly what each was (client, personal or sample) and what they did, and offers a clear next step, Tom relaxes, shares his real need (short weekly clips from phone footage) and asks about turnaround.",
        poor:
          "When the learner says 'look at everything', lists tools and software, calls every piece 'amazing', or is vague about what was a real client job, Tom replies with shorter messages, says he is not sure it is what he needs, and suggests he will think about it. If the learner implies a sample was client work, he asks who the client was.",
      },
    },
    opening: "Hi! I had a quick look at your link. There is a lot there. What should I be looking at for what I need?",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['relevance', 'clarity', 'integrity', 'listening', 'tone'],
    strongSigns: [
      'Asks what he needs before choosing what to show',
      'Points to one or two pieces, not the whole page',
      'Says plainly what each piece was: a client job, a personal project or a sample',
      'Names what the learner personally did, in simple words',
      'Links the piece to his need in one sentence',
      'Ends with one easy next step, such as a short call or a small paid test',
    ],
    traps: [
      'Tells him to look at everything',
      'Lists software and tools instead of what the work achieved',
      'Lets a sample sound like paid client work',
      'Claims a result nobody measured',
      'Uses editing jargon he does not know',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'port-project-description-own-work',
    kind: 'message',
    title: 'Describe one of your projects for a portfolio page',
    situation:
      "You are building the portfolio page for your own freelance service, whatever it is: web pages, design, writing, bookkeeping, video, support or automation. Choose one real project you did (for an employer, a client, a volunteer group, yourself or a course), or one sample you made, and write the short description that goes under it. A fictional client, Dana in Australia, has told you what she likes to read under each project.",
    brief: 'Write the short description for one real or clearly labelled sample project, in your own words and with your own real facts.',
    channel: 'message',
    received:
      "Hi, I look at a lot of portfolios and most of them are just pictures with a title. Under each project I like to read three things in a few lines: what it was for, what the person actually did, and what came out of it. If it was a practice piece or a personal project, just say so. That is fine with me. I would rather know.",
    mustInclude: [
      'what kind of project it was and who or what it was for (a client, an employer, a group, yourself or a course), said honestly',
      'what you personally did, and what someone else did if others were involved',
      'one result or outcome that really happened, or an honest line that there is no result yet because it is a sample',
      'your own real facts only, with nothing invented',
      'no unsupported claims such as "best", "amazing" or numbers you cannot show',
    ],
    targetWords: { min: 60, max: 140 },
    criteria: ['clarity', 'relevance', 'completeness', 'integrity', 'grammar'],
    difficulty: 'gentle',
  },
  {
    id: 'port-case-study-own-project',
    kind: 'message',
    title: 'Write a short case study of your own project',
    situation:
      "You are answering a fictional prospect, Nadia, who runs a small online business in the United Kingdom and has asked for a short example of work like yours. Use one project you really did, or a sample you made and say it is a sample. Do not invent a client, a number, a quote or a result. If you have no measured result, say so and describe what you can honestly say instead.",
    brief: 'Write a short case study from your own real project: the problem, what you did, what changed, and what you learned.',
    channel: 'email',
    received:
      "Hello, thanks for your note. I am not looking for a long document. Could you send me one short story about a problem you solved for someone, a bit like the work I need? What was wrong, what did you do, and what was different afterwards? If you can only share part of it because of confidentiality, that is understood. Also, was it a paid client job or something else? Best, Nadia",
    mustInclude: [
      'the situation and the problem, in the client’s or user’s terms rather than in tool names',
      'what you personally did, in a few specific steps',
      'a result stated with its source (what was measured, by whom), or an honest statement that no result was measured',
      'whether the project was paid client work, employer work, volunteer, personal or a sample',
      'something you learned or would do differently',
      'your own real facts only, with confidential details left out and nothing invented',
    ],
    targetWords: { min: 140, max: 280 },
    criteria: ['clarity', 'structure', 'relevance', 'completeness', 'integrity', 'professionalism', 'grammar'],
    difficulty: 'demanding',
  },
  {
    id: 'port-sample-label-honest-note',
    kind: 'message',
    title: 'Write the honest note that goes beside a sample project',
    situation:
      "You have no paid clients yet, so you made a sample project to show how you work. A friend who is also starting out has messaged you with a tempting idea. You will write the short note that sits next to your sample on your portfolio page. Use your own real sample, or the one you plan to make, and your own real facts.",
    brief: 'Write the short "about this sample" note for your portfolio, honest about what it is and clear about what it does show.',
    channel: 'message',
    received:
      "I looked at your sample. It is good! One tip: my cousin said to put a client name on it, like Client: Bright Dental, so it looks like a real job. Nobody checks anyway. Otherwise your page looks empty next to people who have clients. You could also say it got 40 percent more bookings, because that is probably what would happen. What do you think?",
    mustInclude: [
      'a plain statement that this is a sample project, with no invented client name',
      'who it was imagined for and what problem it was meant to solve, without pretending that person is a real client',
      'what you built or did, in your own real words',
      'what it shows about how you work, and what it does not prove',
      'no made-up numbers, quotes or results',
      'one line that tells a reader what you could do for a real client now',
    ],
    targetWords: { min: 70, max: 170 },
    criteria: ['integrity', 'clarity', 'relevance', 'tone', 'completeness', 'grammar'],
    difficulty: 'realistic',
  },
  {
    id: 'port-walkthrough-hard-questions',
    kind: 'roleplay',
    title: 'Walk a client through a project and answer fair, hard questions',
    setting:
      "You are an AI automation builder (the person who sets up tools that move information between apps). Harriet, a fictional operations manager at a small online homeware business in the United Kingdom, is on a video call. She has read your portfolio and asked you to walk her through one project. Use your own real project, or a sample you made and say it is a sample. Do not invent clients or results.",
    goal: 'Walk her through one project clearly and honestly, including what you did yourself, what you used, what you would change and what you can and cannot show.',
    speaking: true,
    partner: {
      role: 'client',
      name: 'Harriet',
      title: 'Operations manager at a small homeware business, deciding who to hire for a first automation project',
      personality:
        'Polite, precise and a little guarded. Asks short, direct questions and waits for the answer. Takes notes. Not unfriendly: she is careful because a past hire disappointed her. Respects honest limits more than a polished story.',
      private:
        "A previous freelancer showed her a portfolio piece that turned out to be built by an agency and a template, and the project she paid for fell apart. She is not worried about someone being new or using templates and AI tools. She wants to know exactly what the learner did, what was reused or generated, what went wrong, and whether a past client can confirm the work. She wants a small paid first step, not a big commitment. If the learner is specific and honest, including about a weak spot, she trusts them more. If answers are vague or too perfect, she asks the same question again in a different way.",
      reactions: {
        good:
          "When the learner explains the problem, the steps, their own part and any tools or templates used, admits a mistake or a limit, and says what they can and cannot share, Harriet softens, asks practical follow-up questions about timing and a small first project, and says she feels she can rely on what she is hearing.",
        poor:
          "When the learner is vague, claims everything as their own, avoids the question 'did you do all of this yourself?', gives results that cannot be checked, or gets defensive, Harriet becomes cooler and more formal, repeats the question, and says she needs to think about whether this is the right fit.",
      },
    },
    opening:
      "Thanks for making time. I read your portfolio. Could you walk me through one project, start to finish? And I will be honest with you: I will be asking how much of it you did yourself.",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['integrity', 'clarity', 'structure', 'relevance', 'accountability', 'professionalism'],
    strongSigns: [
      'Starts with the problem and who had it, not with the tools',
      'Walks through a few clear steps in order and keeps it short',
      'Says exactly what they did themselves and what was reused, generated or done by others',
      'Answers "did you do all of this yourself?" directly and without defensiveness',
      'Names a limit, a mistake or something they would change',
      'Says what can and cannot be shared and why, and suggests a small, clear next step',
    ],
    traps: [
      'Claims the whole project as their own work when others, templates or tools did part of it',
      'Gives a result with no way to check it',
      'Hides behind tool names and jargon',
      'Gets defensive when the question is repeated',
      'Promises more than a first small project can deliver',
    ],
    difficulty: 'demanding',
  },
];
