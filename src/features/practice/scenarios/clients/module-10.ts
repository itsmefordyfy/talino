import type { PracticeItem } from '../../types';

/**
 * Finding International Clients, module 10, Securing Your First Client and Building Long-Term Relationships (lessons 47 to 52, prefix `win`):
 * six message tasks and four role-plays. Used by: 47 the scope-and-terms email, 48 the invoice cover message, the payment reminder and the
 * invoice dispute (role-play), 49 the payment method and fees conversation (role-play), 50 the welcome message and the kickoff call (role-play),
 * 51 the testimonial request, 52 the learner's own prompt (message) and the AI question (role-play).
 * Every client, company and invoice is fictional. All the figures are made up for the exercise; none is a suggested price, fee or term.
 * Nothing here teaches a legal or tax rule: the tasks practise clear, honest, polite writing and talking about agreements and money.
 */
export const items: PracticeItem[] = [
  {
    id: 'win-scope-terms-email',
    kind: 'message',
    title: 'Scope-and-terms email after a yes',
    situation:
      "You are a freelance video editor. After a 30-minute video call, Dale, who runs a small fitness studio in Perth, Australia (a fictional client), said yes to working with you. On the call you agreed: 8 short vertical videos a month for two months, each up to 60 seconds, with English captions; Dale films and sends the footage by the 5th of each month; you deliver each batch within 5 working days of getting the footage; two rounds of changes per video; a fixed price of AUD 480 a month (made-up figure), half when the footage arrives and half when the batch is approved. Thumbnails and a longer YouTube video were mentioned, but nothing was decided. Ownership of the finished videos and whether you may show them in your portfolio were not discussed.",
    brief: 'Write the email that restates what was agreed, what is not included or not decided, the dates and payment, and asks Dale to confirm. It is a summary for both of you, not a legal contract.',
    channel: 'email',
    received:
      "Thanks for the call, it was great to meet you! Really keen to get going. Could you send me a quick summary of what we agreed so I have it all in one place? I will forward it to my business partner, Priya. By the way, I might want a few thumbnails later, and maybe a longer YouTube video at some point. We can sort that out as we go. Cheers, Dale",
    mustInclude: [
      'what is included: number of videos, length, captions, who sends footage and when',
      'what is not included or not decided yet (thumbnails, the longer video), named as open points',
      'a timeline that depends on when the footage arrives, with at least one date or rule',
      'the price, when each part is due, and how many rounds of changes are included',
      'a question about the open points that need an answer, such as ownership or portfolio use, asked as a question and not as a rule',
      'a plain request to reply "agreed" or to correct anything before work starts',
    ],
    targetWords: { min: 140, max: 260 },
    criteria: ['clarity', 'completeness', 'structure', 'professionalism', 'actionability', 'tone'],
    difficulty: 'realistic',
  },
  {
    id: 'win-welcome-onboarding',
    kind: 'message',
    title: 'A welcome and onboarding message',
    situation:
      "You are a customer support agent working remotely. Maya owns Greenleaf Pets, a small online pet-supply store in Ontario, Canada (a fictional client), and has just confirmed that you will answer customer chats and emails for her. You start on Monday. You will work in your own evening, which overlaps with Maya's morning for about two hours a day. To begin you need access to the help-desk inbox, the refund and returns policy, and the list of saved replies Maya already uses. In the first week you plan to read the policy, draft ten saved replies for Maya to approve, and then answer real customers with Maya checking your first few replies.",
    brief: 'Write the welcome message that tells Maya what happens next, what you need from her and by when, how you will stay in touch, and when you will first speak.',
    channel: 'message',
    received:
      "Hi! So excited that you are on board. We are getting more messages than I can handle and I am a bit nervous about handing them over, to be honest. What do you need from me to get started on Monday? I am usually online in my mornings and I mostly use email and WhatsApp for work. Most of our customers write in the evening, when I am offline, so that is the gap I really need filled. I can also join a short call this week if that helps.",
    mustInclude: [
      'a warm welcome and the start date',
      'what you need from Maya, listed clearly, with a date and a request to share access in the way she normally shares it, not by writing passwords in a chat',
      'how you will communicate: the channel, your working hours, the overlap, and how fast you usually reply',
      'what you will do in the first week, including the first thing she will review',
      'what you will ask her about before acting, such as refunds or unusual cases',
      'a next step: a short kickoff call, with a time to propose',
    ],
    targetWords: { min: 130, max: 240 },
    criteria: ['clarity', 'tone', 'completeness', 'actionability', 'professionalism', 'empathy'],
    difficulty: 'gentle',
  },
  {
    id: 'win-invoice-cover',
    kind: 'message',
    title: 'An invoice cover message',
    situation:
      "You are a freelance bookkeeper. Each month you prepare the books for Fraser and Lowe Studio, a small architecture practice in Manchester, United Kingdom (a fictional client). It is the end of the month and your invoice is ready to send. Details (all made up): invoice number 0007, bookkeeping for the month just ended, GBP 350, due on the 21st of next month as agreed, payable by bank transfer using the details printed on the invoice, and the practice asked that its purchase order reference WS-2231 appears on the invoice.",
    brief: 'Write the short email that sends the invoice, so that the person who pays can process it without writing back to ask you anything.',
    channel: 'email',
    received:
      "Hi, could you send this month's invoice to me, and copy in Helen from our accounts team? Please make sure our purchase order reference is on it, otherwise it gets stuck on our side. Also, could you let us know when the bank holiday cut-off is for payments? Our accounts team pays on one fixed day each month, so a clear due date matters to them. I am out of the office on Friday, but Helen can answer anything about payments. Thanks, Imogen",
    mustInclude: [
      'a clear subject line or opening that says an invoice is attached, with its number and the period it covers',
      'the amount with its currency, the due date, and how to pay (pointing to the details on the invoice)',
      'the purchase order reference, so it is visibly handled',
      'a polite note that you do not know the practice\'s holiday payment cut-off and a request that they tell you, instead of a guess',
      'an invitation to ask questions and a request to confirm that they received it',
    ],
    targetWords: { min: 70, max: 160 },
    criteria: ['clarity', 'completeness', 'professionalism', 'tone', 'actionability'],
    difficulty: 'gentle',
  },
  {
    id: 'win-payment-reminder',
    kind: 'message',
    title: 'A polite payment reminder',
    situation:
      "You are a freelance virtual assistant. You manage the calendar and inbox of Jordan, who runs a small consulting firm in Chicago, United States (a fictional client). Your invoice 0014 for USD 640 (made-up figure) was due on the 3rd, and today is the 12th. Jordan paid the first two invoices on time and replied 'Got it, thanks!' when you sent this one. You have not written about it since. Your written agreement says payment is due on the date shown on each invoice and that you may pause new work if an invoice is more than a stated number of days overdue, but you do not want to bring that up yet.",
    brief: 'Write the first reminder: friendly, specific and easy to act on, without blame, pressure or a threat.',
    channel: 'email',
    received:
      "Earlier message from Jordan, 12 days ago: 'Got it, thanks!' (about invoice 0014). Since then you have seen Jordan active in your shared calendar, so he is busy but reachable. His own message about the invoice contained nothing else, and nothing suggests a problem with your work. His firm is small and he often answers a few days late. He did approve a calendar request from you yesterday, so he is reading your messages, but he has not mentioned the invoice again.",
    mustInclude: [
      'a friendly, neutral opening that assumes it may simply have been missed',
      'the invoice number, amount, due date and how many days it is overdue, stated plainly',
      'the invoice attached again, with how to pay',
      'a question that makes a reply easy: when payment will be sent, or whether something is blocking it',
      'no accusation, no pressure and no mention of consequences',
    ],
    targetWords: { min: 70, max: 150 },
    criteria: ['tone', 'clarity', 'professionalism', 'actionability', 'completeness', 'empathy'],
    difficulty: 'realistic',
  },
  {
    id: 'win-testimonial-request',
    kind: 'message',
    title: 'Asking for a testimonial honestly',
    situation:
      "You are a freelance graphic designer. Five days ago you delivered a logo and a small brand kit to Tessa, who owns a ceramics studio in Auckland, New Zealand (a fictional client). The final payment has arrived and the project is closed. Tessa has written to say she is very happy. You would like a short testimonial for your portfolio, and you would be glad of a future project, but you do not want to pressure her or put words in her mouth.",
    brief: 'Write the message asking for a testimonial in her own words, with an easy way to say no and a clear question about how you may use it.',
    channel: 'message',
    received:
      "Honestly it is perfect, thank you so much! I have already put the logo on our shop bags and the packaging looks so much better. A few customers have mentioned it. I will definitely tell people about you. Thanks again, Tessa. (Context: the brief was a logo, two colour options, a simple style guide and files for print and web. There were two rounds of changes, and the second round took a little longer than planned because the font choice changed.)",
    mustInclude: [
      'a specific thank-you that refers to something real from the project',
      'a clear, small request for a few sentences in her own words, with one or two questions that help her write them',
      'a question about permission: her name, her business, and where it may appear',
      'a clear, kind way to say no or to skip it, with no reward offered',
      'no wording for her to copy and no invented praise',
    ],
    targetWords: { min: 80, max: 170 },
    criteria: ['tone', 'integrity', 'clarity', 'professionalism', 'actionability', 'empathy'],
    difficulty: 'gentle',
  },
  {
    id: 'win-my-prompt-review',
    kind: 'message',
    title: 'Write and review your own prompt',
    situation:
      "In this lesson you met eight prompts for winning clients. Now write one yourself, for your own real situation: your real service, your real market and facts you actually know. Choose a purpose such as preparing for a discovery call, getting a first look at a niche, or improving your profile. A coach will review the prompt itself for specificity and honesty, not an answer from an AI. Never invent clients, results or experience; if you do not know a fact yet, say so in the prompt, in a placeholder.",
    brief: 'Write the prompt you would paste into an AI assistant, using your own real facts, so that it asks you questions first and helps you think instead of writing for you.',
    channel: 'message',
    received:
      "A first attempt many people write: 'Write me a good cold email to get clients for my services.' The answer it gets is usually generic and full of claims the writer cannot back up. Rewrite your own prompt for your own situation so that the answer would be useful and honest. Common problems with answers to a prompt like that one: invented results, a tone that could fit anyone, claims about clients the writer never had, and a finished draft that arrives before the writer has decided what they want.",
    mustInclude: [
      'a role for the AI and a clear purpose (what you are trying to do)',
      'your own real context: your service, your market and facts you actually know, with placeholders for what you do not know yet',
      'a constraint, such as not inventing facts, claims or results',
      'a request that the AI ask you questions and show its assumptions before it answers',
      'a format for the answer',
      'a line saying what you will check yourself afterwards, and where',
    ],
    targetWords: { min: 90, max: 240 },
    criteria: ['clarity', 'completeness', 'integrity', 'relevance', 'structure', 'actionability'],
    difficulty: 'realistic',
  },
  {
    id: 'win-invoice-dispute-call',
    kind: 'roleplay',
    title: 'A client disputes one line of your invoice',
    setting:
      "You are a freelance AI automation builder. You built a set of order-processing automations for a small software company in Dublin, Ireland (a fictional client). Orla, the finance manager, has written to say she will pay the invoice, but she will not pay one line: EUR 150 for a third round of changes, which she says nobody approved. You were asked for that round in a chat by Dev, a colleague of hers, and you did the work. You are now on a call with Orla.",
    goal: 'Settle the disputed line fairly, keep the relationship, and agree what is paid now and what happens next, without blaming anyone.',
    partner: {
      role: 'client',
      name: 'Orla',
      title: 'Finance manager at a small software company, in charge of approving payments',
      personality:
        'Polite, precise and a little guarded. She speaks in short, careful sentences, likes things written down, and does not enjoy conflict. She is not trying to avoid paying. She needs to explain every payment to her director.',
      private:
        "Dev did ask for a third round in the chat, and the learner answered 'Sure, happy to!' without saying it would cost extra. The written agreement says two rounds are included and further rounds are priced, but nobody on her side had read that part, and Dev is not allowed to approve spending. Orla's director has asked her to hold anything that was not approved in writing. She would pay if she can show the director a written note that the extra round was requested and priced, or if the learner offers a fair arrangement. She would be annoyed by accusations about Dev and relieved by honesty. She has no wish to end the contract, since the automations work well.",
      reactions: {
        good:
          "If the learner listens first, stays calm, says what they know and what they should have flagged at the time, keeps the undisputed amount separate, and proposes a clear way forward (for example confirming the facts in writing and agreeing how extra rounds will be approved from now on), she softens, thanks them for being straightforward and agrees on a next step, such as paying the main amount now and settling the line after she speaks to her director.",
        poor:
          "If the learner argues, blames Dev, threatens to stop work, pretends the extra round was clearly approved, or offers no way forward, she becomes formal and short, repeats that she cannot approve it without written confirmation, and says she will 'come back to you later', with no date.",
      },
    },
    opening:
      "Thanks for making time. I want to be clear that we are happy with the work and I will pay the invoice. There is just one line I cannot approve on my side: the EUR 150 for a third round of changes. I have no record that anyone approved it. Can you walk me through what happened?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['listening', 'accountability', 'professionalism', 'problem-solving', 'negotiation', 'clarity'],
    strongSigns: [
      'Thanks her for paying the undisputed amount and keeps that separate from the disputed line',
      'Describes what happened factually, without blaming Dev',
      'Admits plainly that the cost should have been mentioned when the extra round was requested',
      'Points to what the agreement said about rounds, as a fact and not as a weapon',
      'Offers a fair way forward and asks what she needs to show her director',
      'Agrees a written confirmation and a date, and a simple rule for approving extras next time',
    ],
    traps: [
      'Blaming Dev or implying Orla is avoiding payment',
      'Treating the chat message as proof that the extra round was approved and priced',
      'Threatening to pause or stop work',
      'Giving in on the whole line immediately without discussing it',
      'Leaving without a next step or a date',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'win-payment-method-fees',
    kind: 'roleplay',
    title: 'Agreeing how the money will reach you',
    setting:
      "You are a freelance UX designer. Jonas, head of operations at a small software company in Berlin, Germany (a fictional client), has accepted your invoice for EUR 1,200 (a made-up figure) and says his finance team will pay it by their usual bank transfer. This is your first payment from this client and your first from a bank in his country. You are on a short video call to agree how the payment will work.",
    goal: 'Agree how you will be paid, in which currency, who covers any transfer charges and what proof you will share, without making Jonas feel you doubt him.',
    partner: {
      role: 'client',
      name: 'Jonas',
      title: 'Head of operations at a small software company, who passes invoices to the finance team',
      personality:
        'Friendly, practical and not a finance expert. He answers honestly, says "let me check with finance" when he does not know, and dislikes long explanations. He does not like feeling accused.',
      private:
        "His finance team pays by a standard bank transfer in euros, and their usual practice is that the company covers only its own bank's charge. He assumes the freelancer receives the full invoice amount and does not know that the receiving side may deduct charges or convert currency. He would be willing to add the difference as a line, or to use another method that finance already uses for other contractors, if asked politely and with facts, but it would not occur to him to offer. He can send a bank confirmation as proof of payment. He would be put off by demands to change the company's process, or by any hint that he might not pay.",
      reactions: {
        good:
          "If the learner asks open questions (which method, which currency, who covers charges), explains that the amount received can differ from the amount sent and why they are asking, offers one or two simple options, and agrees what to check with finance and by when, Jonas relaxes, says he will ask finance, and agrees a next step with a date.",
        poor:
          "If the learner accuses the company, demands a specific method with no reason, quotes fees as facts they have not checked, or simply says 'fine, whatever works' without asking anything, Jonas either becomes defensive or says 'great, then it is settled' and the questions stay unanswered.",
      },
    },
    opening:
      "Hi! Quick call, as finance asked me to confirm the details. We will just pay your invoice by our normal bank transfer, in euros. That should be simple, right? Is there anything you need from us?",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['clarity', 'listening', 'problem-solving', 'professionalism', 'actionability', 'collaboration'],
    strongSigns: [
      'Thanks him and says they have a few quick questions so the payment arrives smoothly',
      'Asks which currency will be sent and who covers transfer charges, in a neutral way',
      'Explains, without blame, that the amount received can differ from the amount sent',
      'Says that they will check their own provider\'s current information rather than quoting fees from memory',
      'Offers one or two simple options and lets Jonas ask finance',
      'Agrees what proof of payment will be shared and when to follow up',
    ],
    traps: [
      'Stating specific fees or rules as facts without having checked',
      'Accusing the company of trying to pay less',
      'Insisting on a method with no reason',
      'Accepting everything without asking about charges or currency',
      'Giving account details in the chat before agreeing a safe way to share them',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'win-onboarding-kickoff-call',
    kind: 'roleplay',
    title: 'The onboarding kickoff call',
    setting:
      "You are a freelance virtual assistant. Lian runs a small online store selling handmade candles from Singapore (a fictional client) and has just hired you to follow up on orders and manage her inbox. You have agreed the scope in writing. This is your first call, and you have 20 minutes. She is friendly, busy, and has not yet prepared access to anything.",
    goal: 'Leave the call with a shared plan: who does what, what you need and by when, how you will communicate, and what the first week looks like.',
    speaking: true,
    partner: {
      role: 'client',
      name: 'Lian',
      title: 'Founder of a small online candle store, hiring her first remote assistant',
      personality:
        'Warm, fast-talking and a little scattered. She says things like "just do whatever makes sense" and "reply whenever, but quickly". She is relieved to hand over work and not good at specifics. She has a meeting in 20 minutes.',
      private:
        "A previous assistant disappeared after two weeks, so she is nervous about trusting someone with customer details. She assumes the assistant will work her hours and answer within the hour. She has not decided which tool to use to share inbox access and has not noticed that it will take her time to set up. She would feel better with a daily summary, a clear way to reach the learner, and a limit on what the learner may decide alone, but she will only agree to this if the learner proposes it clearly and briefly.",
      reactions: {
        good:
          "If the learner opens with a short agenda, asks about her priorities, names what they need with dates, proposes working hours, a response window and a short daily note, and asks her to decide a few things (like refunds and customer data), she relaxes, answers directly, and agrees to a first-week plan.",
        poor:
          "If the learner is vague, just says 'sure' to everything, lets her reply 'whenever', asks for passwords by chat, or talks for a long time without agreeing next steps, she says 'sounds good!' and ends the call, with no access, no hours and no plan.",
      },
    },
    opening:
      "Hi! Thank you so much for joining, I am so happy you are here. I have about twenty minutes. So, basically, the inbox is a mess and orders are slipping, and I just need someone to take care of it. What do you need from me?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['structure', 'clarity', 'actionability', 'listening', 'completeness', 'professionalism'],
    strongSigns: [
      'Opens with a short agenda that fits the 20 minutes',
      'Asks what matters most in the first week and what has been going wrong',
      'Names what is needed (access, files, decisions), with who and by when, and asks how she would like to share access safely',
      'Proposes working hours, a response window and how updates will be sent',
      'Asks which decisions she wants to keep (refunds, anything with customer data)',
      'Ends by repeating the plan and sending a written summary',
    ],
    traps: [
      'Agreeing to everything without setting expectations about hours or reply times',
      'Asking her to send a password in a chat',
      'Using jargon about tools and processes she does not need',
      'Running over the time without agreeing next steps',
      'Not asking what she is nervous about',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'win-ai-disclosure-question',
    kind: 'roleplay',
    title: 'A client asks whether you use AI on their work',
    setting:
      "You are a freelance writer. Rebecca runs communications for a small nonprofit in Denver, United States (a fictional client) and is about to hire you for a series of articles. Her board has asked her to be sure that nothing confidential goes into AI tools. Before she signs, she asks you directly how you use AI. Answer truthfully about how you really work, or how you would handle it; if you do not yet have a rule, say so and think it through with her.",
    goal: 'Answer honestly about how you use, or do not use, AI tools, agree clear rules with her and keep her trust, without overpromising.',
    speaking: true,
    partner: {
      role: 'client',
      name: 'Rebecca',
      title: 'Communications lead at a small nonprofit, responsible for what is published and for donor privacy',
      personality:
        'Direct, careful and not hostile. She asks short questions and waits for real answers. She has heard stories about freelancers who hid their use of AI and she dislikes vague reassurance.',
      private:
        "She is not against AI. What worries her is donor and client information being pasted into a tool, hidden use, and errors in published facts. Her board wants a written line in the agreement. She would accept limited use if the rules are clear: nothing confidential goes in, a human checks every fact, and the freelancer says what they used. She would be put off by 'never' (she would suspect it is untrue), by 'always perfect' and by jargon. She does not know the legal side and does not expect the learner to give legal advice.",
      reactions: {
        good:
          "If the learner is honest about their own practice (or says plainly what they would do), explains what they would never paste in, says how they check facts, asks about her rules and offers to put the agreed rules in writing, she relaxes, thanks them for being straightforward and moves on to the next step in the agreement.",
        poor:
          "If the learner dodges, claims to 'never' use AI when that is not true, boasts that the work will be perfect, hides behind jargon or says 'trust me', she becomes more formal, asks the same question again in a sharper way and says she will need to think about other candidates.",
      },
    },
    opening:
      "Before we sign anything, I need to ask you something directly. Do you use AI tools on your client work? If so, how, and what exactly do you put into them? My board will ask me, and I would rather hear it from you straight.",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['integrity', 'clarity', 'professionalism', 'listening', 'accountability', 'completeness'],
    strongSigns: [
      'Answers the question directly, truthfully and in plain words',
      'Says specifically what they would never paste into a tool, and how they check facts',
      'Asks about her organisation\'s rules and does not argue with her worry',
      'Does not overpromise (no "never", no "perfect")',
      'Offers to put the agreed rules in the written agreement and suggests that her board check the wording with a qualified professional if needed',
      'Ends with a clear next step',
    ],
    traps: [
      'Claiming a rule that is not true about their real practice',
      'Avoiding the question or answering with jargon',
      'Promising perfect accuracy or originality',
      'Giving legal advice or claiming to know what the law requires',
      'Getting defensive about the question',
    ],
    difficulty: 'demanding',
  },
];
