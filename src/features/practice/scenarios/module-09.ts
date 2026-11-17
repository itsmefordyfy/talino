import type { PracticeItem } from '../types';

/**
 * Module 9, Client Management and Professional Relationships (lessons 43 to 48): five role-plays with clients and three message tasks.
 * Used by: 43 discovery (role-play), 44 scope confirmation (message), 45 project update (message), 46 delay call and complaint (role-plays)
 * and delay message (message), 47 changing requirements (role-play), 48 price negotiation (role-play).
 * None of the partners is a villain: each has a believable position and a private reason for it.
 */
export const items: PracticeItem[] = [
  {
    id: 'client-discovery-bakery-site',
    kind: 'roleplay',
    title: 'Find out what the bakery website is for',
    setting:
      "You are a freelance web developer. Marisol owns a small neighbourhood bakery and wants a website. This morning she emailed you: 'I want a site like Sweet Corner's, with a big photo slider and a chatbot.' You have a 15-minute video call to understand the job before you write a quote.",
    goal: 'Learn what the website must do for her bakery, and say it back so she agrees you have understood.',
    partner: {
      role: 'client',
      name: 'Marisol',
      title: 'Owner of a neighbourhood bakery, hired you to build her website',
      personality:
        'Warm and busy. Talks in everyday words, never in technical terms. Answers exactly what she is asked and tends to describe how she wants the site to look. Gets a little defensive if she feels quizzed or told her idea is wrong.',
      private:
        "What she really needs is a way for customers to order cakes for the weekend without sending her messages late at night. Last month she lost three cake orders because she missed late-night chat messages and mixed up dates. She copied Sweet Corner's site only because it looks professional. She worries about cost and about a site she cannot update herself. She does not know that ordering, a calendar or a simple way to edit prices are things a website can do, and she will not mention the missed orders unless she is asked how orders arrive today or what has gone wrong.",
      reactions: {
        good: "When the learner asks open questions about her customers, how orders arrive now, or what has gone wrong, she opens up with specific stories (the missed cake orders, the night messages) and relaxes. When they say her goals back accurately she says so warmly and starts to trust them.",
        poor: "When the learner jumps to features, prices or technical words, or simply agrees to build the slider and chatbot, she repeats her first request and stays vague. If they fire many questions in a row she gets short and says 'I'm not sure, you're the expert.'",
      },
    },
    opening: "Hi! Thanks for calling. So, I sent you my idea: a website like Sweet Corner's. Can you do that? And roughly how much would it be?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['listening', 'relevance', 'clarity', 'tone', 'problem-solving'],
    strongSigns: [
      'Asks what the website is for before talking about features or looks',
      'Asks about her customers and how orders and questions reach her today',
      'Asks what has gone wrong or taken too much time, and listens to the story',
      'Does not quote a price before understanding the job, and says why',
      'Says the real need back in her own plain words and checks she agrees',
      'Ends with a clear next step, such as a short written summary and a quote',
    ],
    traps: [
      'Agrees to build the slider and chatbot straight away',
      'Quotes a price on the first turn',
      'Uses technical words such as CMS, UX or responsive',
      'Asks a long list of questions in one message',
      'Tells her that her idea is wrong or lectures her about what a website should have',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'client-scope-confirmation-event-site',
    kind: 'message',
    title: 'Confirm what was agreed after the kickoff call',
    situation:
      "You are a freelance web developer. After a 30-minute call with Hannah, who plans small weddings and birthday events, you agreed to build a simple booking website for her. On the call you talked about a home page, a page with her packages, and a form for enquiries. She also mentioned, almost in passing, an online payment option and a photo gallery. Hannah wants to show the plan to her business partner.",
    brief: "Write the email that confirms what is included, what is not, the timeline, the price, and what you need from Hannah.",
    channel: 'email',
    received: "Thanks for the call! I'm so excited. Can you just send me what we agreed so I can show my partner? Then we can get going. :)",
    mustInclude: [
      'what is included (the pages or features agreed)',
      'what is not included, or not decided yet (payments, gallery)',
      'a timeline with at least two dated steps',
      'the price and when payments are due',
      'what you need from Hannah and by when',
      'a request to reply to confirm before work starts',
    ],
    targetWords: { min: 120, max: 240 },
    criteria: ['clarity', 'completeness', 'professionalism', 'actionability', 'tone', 'structure'],
    difficulty: 'gentle',
  },
  {
    id: 'client-weekly-update-online-store',
    kind: 'message',
    title: 'Write a project update a busy client can read in a minute',
    situation:
      "You are a freelance developer building an online shop for Kiran, who sells handmade soap. It is the end of week 3 of 6. These are your notes. Done: the product pages, the cart and the contact page. In progress: the checkout. Late: the payment provider needs Kiran's business registration form, which was due Tuesday and has not arrived. Without it, payments cannot be tested. Launch is still possible on the 28th if the form arrives by Friday and you get product photos by next Monday. Kiran must also choose between a flat delivery fee and a fee by distance.",
    brief: 'Turn these notes into the weekly update email to Kiran: lead with where things stand, and make what you need from Kiran impossible to miss.',
    channel: 'update',
    mustInclude: [
      'a one-line status up front (on track, at risk or blocked) with the launch date',
      'what was finished this week, briefly',
      'the blocker (the form) and what it puts at risk',
      'what happens next week',
      'what you need from Kiran, with a date for each item',
      'the delivery fee decision, asked clearly',
    ],
    targetWords: { min: 120, max: 240 },
    criteria: ['clarity', 'structure', 'completeness', 'actionability', 'professionalism', 'relevance'],
    difficulty: 'realistic',
  },
  {
    id: 'client-delay-payment-approval',
    kind: 'roleplay',
    title: 'Tell a client the launch will slip',
    setting:
      "You are a freelance developer building an online shop for Dennis, who makes wooden furniture. Launch is set for the 20th and he has already told his customers. Today you learned that the payment provider is still reviewing his documents and has given no date. Separately, you underestimated the product pages and are about two days behind. You asked Dennis for a quick call.",
    goal: 'Tell him the 20th is at risk, own your part, and end the call with a plan and a date he can rely on.',
    partner: {
      role: 'client',
      name: 'Dennis',
      title: 'Owner of a small furniture workshop, with a trade fair a week after the planned launch',
      personality:
        'Direct and practical. Short sentences. Dislikes vague answers and surprises far more than bad news. Gets sharper if he feels he is being managed rather than told the truth.',
      private:
        "He told about 300 newsletter subscribers the date. He could live with a delay of up to a week if he gets a firm new date and something he can show at the trade fair, and he could send his own customers a short 'coming soon' note. He suspects the learner has been quiet because something is wrong, and most of his anger is about hearing it late. He does not know the provider's review is outside the learner's control. If he hears the real situation with options, he becomes a partner in choosing one.",
      reactions: {
        good: "When the learner is straightforward, separates what is in their control from what is not, owns the product-page delay, and gives options with a realistic date and the next check-in, Dennis calms down, asks practical questions and helps choose an option. If they offer to draft a short note he can send to his customers, he is relieved.",
        poor: "When the learner is vague ('soon', 'we're working on it'), blames the provider entirely, buries him in technical detail, or promises the 20th again without any basis, Dennis presses for a firm date, gets curt, and says he is thinking of telling his customers it is cancelled. If they overpromise he says he has heard that before.",
      },
    },
    opening: "You said we needed to talk. Is this about the 20th? Just tell me straight.",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['clarity', 'accountability', 'empathy', 'problem-solving', 'actionability'],
    strongSigns: [
      'Gives the news in the first turns, plainly, without a long lead-in',
      'Separates what the learner controls (the product pages) from what they do not (the provider)',
      'Owns their own part without excuses',
      'Offers options with a realistic date and the reason for it, not a hopeful guess',
      'Offers something that reduces the damage, such as a preview for the trade fair or a note for his customers',
      'Agrees when the next update will come and keeps it small and specific',
    ],
    traps: [
      'Stays vague about dates ("soon", "as fast as possible")',
      'Blames the payment provider or the client for everything',
      'Promises the original date again to calm him down',
      'Explains technical detail he did not ask for',
      'Apologises over and over without offering a way forward',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'client-delay-message-promo-video',
    kind: 'message',
    title: 'Write the message that tells a client a deadline will be missed',
    situation:
      "You are a freelance video editor. Sandra runs an online cooking class, and you promised her a 3-minute promo video by Friday. Her raw footage arrived two days late and the audio needs a lot of cleaning, so Friday will not happen. You could finish a rough cut (right order, no polish) by Friday and the finished video next Wednesday. Her ads are due to start on Saturday.",
    brief: "Reply to Sandra in chat: say plainly that Friday will not be met, give the new date and what you can offer, and say what you need from her.",
    channel: 'chat',
    received: "Hi! Just checking we're still on for Friday? My ads start Saturday and I'm counting on the video :)",
    mustInclude: [
      'a clear statement that Friday will not be met, near the start',
      'the reason, in one sentence, without blaming her',
      'the new date and what it is based on',
      'the option of a rough cut on Friday',
      'an acknowledgement of what this does to her ad plan',
      'what you need from her, or the next time you will update her',
    ],
    targetWords: { min: 70, max: 160 },
    criteria: ['clarity', 'tone', 'accountability', 'empathy', 'actionability', 'professionalism'],
    difficulty: 'realistic',
  },
  {
    id: 'client-complaint-double-booking',
    kind: 'roleplay',
    title: 'Answer a client who is angry about a mistake',
    setting:
      "You are a virtual assistant who manages the calendar and inbox of Greg, a business consultant in Sydney. Last Thursday you booked two calls at overlapping times, and an important prospect waited ten minutes while Greg was on the other call. You know the cause: you converted a time zone wrongly. Greg's own invitation also did not say which time zone he meant. He has asked for a video call right now.",
    goal: "Hear his complaint, own your mistake, and agree what will change so he can trust you with his calendar again.",
    partner: {
      role: 'client',
      name: 'Greg',
      title: 'Consultant in Sydney who hired you three months ago to manage his calendar and inbox',
      personality:
        'Sharp and quick when stressed. Not rude, but cutting. Hates excuses, respects people who are calm and specific. Cools down when he hears exactly what went wrong and what will change.',
      private:
        "The prospect, Helen, is a large account and he is afraid he has lost her. He cares more that this will not happen again than about a long apology. His last assistant vanished after an error, so how the learner behaves now matters a lot. He knows his invitation had no time zone but is not thinking about it. If the learner blames him he becomes defensive and starts to think about ending the arrangement. If the learner raises it later, calmly, as something to fix together (a time zone on every invite), he agrees. He would like a short note to Helen that he can send himself.",
      reactions: {
        good: "When the learner listens first, names the specific mistake, apologises without excuses and offers a concrete change plus a way to help with Helen, Greg's tone drops. He asks sensible questions and accepts a shared fix for the invitations.",
        poor: "When the learner defends themselves, blames his invitation straight away, apologises vaguely ('sorry for any inconvenience') or promises it will 'never' happen without saying how, Greg gets sharper, says he cannot afford this, and hints that he may look for someone else.",
      },
    },
    opening: "I had a prospect sitting on a call for ten minutes while I was on another one. Ten minutes! What happened?",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['listening', 'accountability', 'empathy', 'problem-solving', 'professionalism', 'actionability'],
    strongSigns: [
      'Lets him finish and shows they heard how costly it was before explaining anything',
      'Names the specific mistake (the time zone conversion) in plain words',
      'Apologises for their part without excuses and without grovelling',
      'Offers a concrete change, such as checking each booking twice and writing the time zone on every invite',
      'Offers help with the damage, such as a short note to Helen or a new time',
      'If the unclear invitation comes up, raises it calmly as a shared fix, not as a defence',
    ],
    traps: [
      'Explains the cause before showing they understood the impact',
      "Points at Greg's invitation to share the blame early",
      'Says only a vague sorry, or "it will never happen again" with no plan',
      'Gets defensive or emotional when he is sharp',
      'Fixes the system but forgets the prospect who was left waiting',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'client-change-members-login',
    kind: 'roleplay',
    title: 'Handle a big change that sounds small',
    setting:
      "You are a freelance developer building a sign-up website for Priya's online photography course. The work is half done and the agreed launch is in three weeks. This morning Priya wrote: 'Quick thing! Can we add a members-only area where people log in and see the lessons? Should be small, right?' You are on a call to talk it through.",
    goal: 'Work out with Priya what the change really involves and agree on a plan that keeps the project fair for both of you.',
    partner: {
      role: 'client',
      name: 'Priya',
      title: 'Founder of an online course business, hiring a developer for the first time',
      personality:
        "Enthusiastic and fast-moving. Thinks in ideas, not effort. Friendly, but anxious about money. Says 'should be quick, right?' a lot. Hates feeling that her ideas are silly.",
      private:
        "A sponsor will promote the course if lessons are online at launch. She has a little room in the budget but not much, and she does not realise that a login also means passwords, reset emails, checks on who may see what, and testing. She would rather keep the launch date than keep some of her earlier wishes: she could drop the animated banner or move the blog to later. She is afraid that 'no' means her idea is bad.",
      reactions: {
        good: "When the learner welcomes the idea, asks what she needs the members area to do, explains the work in plain words, and offers real options (swap something out, move the date, or do a simpler first version), Priya relaxes, thinks out loud, and picks an option. She says she appreciates being told honestly.",
        poor: "When the learner flatly says no, quietly agrees to do it all for free, or answers with technical detail, Priya gets anxious. She either pushes ('but it's just a login!') or goes along with whatever is said and later admits she was confused. If they promise everything on the same date, she is delighted and does not ask how.",
      },
    },
    opening: "Hi! So, the members area. It's basically just a login page, right? Can we still launch on the same date?",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'problem-solving', 'collaboration', 'actionability', 'tone'],
    strongSigns: [
      'Welcomes the idea first, without sounding like a refusal',
      'Asks what the members area is for and what the minimum version is',
      'Explains in plain words why it is bigger than a login page',
      'Offers two or three real options, such as swapping, moving the date, or a simple first version',
      'Is honest about the cost in time or money, and about what it would move',
      'Says that nothing starts until the change is confirmed in writing',
    ],
    traps: [
      'Says no flatly, or gives a long list of reasons it cannot be done',
      'Agrees to everything and quietly absorbs the extra work',
      'Promises the same date and price without checking',
      'Uses technical words (authentication, database, sessions) without explaining',
      'Treats the request as a nuisance instead of a normal part of a project',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'client-negotiate-price-menu-design',
    kind: 'roleplay',
    title: 'Negotiate a price without losing the client or yourself',
    setting:
      "You are a freelance graphic designer. Tomas runs three small restaurants and asked you to design the menu, table cards and window sign for his new branch. Your quote was ₱40,000, including two rounds of changes. He has called to say that another designer quoted much less, and he wants to talk about price and timing because the branch opens in five weeks.",
    goal: 'Reach an agreement that is fair to both of you, or part on good terms if there is none.',
    partner: {
      role: 'client',
      name: 'Tomas',
      title: 'Owner of three small restaurants, opening a fourth branch',
      personality:
        'Friendly and practical. A bargainer who enjoys the back-and-forth. Tests whether a price is firm, respects calm confidence, dislikes being pressured or lectured.',
      private:
        "His real ceiling is about ₱30,000, and he would rather spend it on a good result than save money on a poor one. The other quote is ₱22,000, but for the menu only, with no signs and no revisions, and he has not looked at that closely. He needs the menu first; the signs can wait about three weeks. If the learner is flexible but fair and explains what the price covers, he will probably agree. If the learner drops the price quickly, he keeps pushing. If the learner is rigid or defensive, he thanks them and walks away.",
      reactions: {
        good: "When the learner stays friendly, asks what the other quote includes, links the price to what he needs, and offers a trade (less included, a different order, a different schedule) instead of simply a discount, Tomas becomes curious and starts to negotiate on scope. He respects a clear lowest point if it is explained kindly.",
        poor: "When the learner caves at once, says the price is not negotiable without any reasons, criticises the other designer, or invents a pressure tactic (such as 'I have other clients waiting'), Tomas becomes cooler. If they cave, he asks for more. If they are rigid, he says he will think about it and the call ends.",
      },
    },
    opening: "Your quote is higher than another designer I spoke to. Can you do the whole thing for ₱25,000? I need to know today if we can work together.",
    minTurns: 4,
    maxTurns: 11,
    criteria: ['negotiation', 'clarity', 'tone', 'problem-solving', 'integrity'],
    strongSigns: [
      'Stays friendly and curious, and asks what the other quote includes',
      'Connects the price to what Tomas needs (opening date, the whole look) instead of defending it',
      'Trades instead of simply giving a discount: less included, a different order or schedule, payment in two parts',
      'Knows and keeps a lowest point, and explains it kindly rather than just refusing',
      'Stays honest: no invented rivals, no pressure, no criticism of the other designer',
      'Ends by saying back what was agreed and the next step in writing',
    ],
    traps: [
      'Drops the price straight away and gives up part of the work for free',
      'Says the price is final with no explanation',
      'Criticises the other designer or invents urgency',
      'Gets defensive about the cost of their time',
      'Agrees to the price but leaves scope and dates unclear',
    ],
    difficulty: 'demanding',
  },
];
