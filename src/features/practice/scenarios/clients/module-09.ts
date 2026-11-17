import type { PracticeItem } from '../../types';

/**
 * Module 9 of Finding International Clients, Discovery Calls, Negotiation and Closing Deals (lessons 42 to 46): six role-plays and two message tasks.
 * The Client Interview Simulator (two discovery calls, both answered aloud, and a service presentation with a budget talk) and the Negotiation Coach (a budget below
 * the learner's range, an "I can get this cheaper" objection, and a client who keeps adding "small" extras).
 * Used by: 42 preparing (the call-prep email and the first discovery call), 43 questions (the second, demanding discovery call), 44 presenting and budget (role-play),
 * 45 negotiating (two role-plays), 46 scope and closing (a role-play and the follow-up summary).
 * Every client, business, amount and place here is fictional and made up for practice; nothing says what any real service costs. The partners are different people
 * (a tired clinic owner, a rushed co-founder, a careful office manager, an upbeat founder, a polite manager and an overwhelmed studio owner) in different countries,
 * and none is a villain: each has a believable position and a private reason for it. The AI never reveals a hidden budget unless the learner earns it.
 */
export const items: PracticeItem[] = [
  {
    id: 'deal-call-prep-email',
    kind: 'message',
    title: 'Confirm a discovery call so it is easy to say yes to',
    situation:
      "You are a freelance web developer. Lachlan runs a small landscaping business in Perth, Australia, and has agreed to a call after your first message. He is a fictional prospect. He has never hired a freelancer and does not know what a discovery call involves. You want the call to be useful and to avoid a mix-up about the time.",
    brief: 'Reply to Lachlan: confirm the call, make the time clear for both of you, say what the call is for and what you will ask, and invite one easy thing to prepare.',
    channel: 'email',
    received:
      "Hi, thanks for getting in touch. A call sounds good, I'm free most afternoons this week, my time. I'll be honest, I've never done this kind of thing before. What do I need to do? Is it a sales call? I only have about 20 minutes because I'm out on jobs most of the day, and I'm in Perth, so you'll need to work out the time difference from wherever you are. Cheers, Lachlan",
    mustInclude: [
      'a proposed day and time written in both time zones, or a clear plan to send an invite that shows both',
      'how long the call will take and which tool or link you will use',
      'what the call is for (to understand his needs, not to sell), said in plain words',
      'two or three things you will ask about',
      'one easy thing he can prepare, marked as optional',
      'a simple request to reply and confirm',
    ],
    targetWords: { min: 90, max: 180 },
    criteria: ['clarity', 'tone', 'completeness', 'professionalism', 'actionability', 'grammar'],
    difficulty: 'gentle',
  },
  {
    id: 'deal-discovery-bookkeeper-clinic',
    kind: 'roleplay',
    title: 'Discovery call with a clinic owner whose "books are a mess"',
    setting:
      "You are a freelance bookkeeper working from the Philippines. Grace owns a small physiotherapy clinic in Calgary, Canada. She found your profile and booked a 20-minute video call. All you know is her message: 'Our books are a mess and I need help.' Grace and her clinic are fictional and every amount in this practice is made up. Answer aloud as you would on a real call.",
    goal: "Find out what 'a mess' actually means and what she needs, learn the timing and a rough budget range in a way that feels natural, and leave with a clear next step.",
    speaking: true,
    partner: {
      role: 'client',
      name: 'Grace',
      title: 'Owner of a small physiotherapy clinic in Calgary, Canada',
      personality:
        "Kind, tired and a little embarrassed. Talks quickly and apologises for 'not being a numbers person'. Describes symptoms ('it's a mess') rather than facts. Answers fully when the questions feel friendly and goes short when she feels tested. Dislikes accounting jargon.",
      private:
        "The clinic's part-time bookkeeper moved away four months ago. Since then receipts and card statements have piled up and nothing has been reconciled since spring. Her outside accountant, Sam, has asked twice for up-to-date records. The clinic uses cloud accounting software that the old bookkeeper set up, but Grace is not sure which one, and the login is in the old bookkeeper's name; this worries her and she has not said it aloud. Her budget is about $500 a month for ongoing monthly bookkeeping, and she could find a one-off amount of up to about $1,200 to catch up the backlog, but she only says so if the learner asks about budget directly and kindly, or explains how this kind of work is usually priced so that she can react to it. She had been paying the old bookkeeper about $400 a month and she will mention that if asked what she paid before. She has never worked with anyone overseas. She has two worries she raises only if invited: whether the learner can be reached during her clinic hours, and whether the clinic's records, which include patient names on some invoices, would be kept private. She wants to decide within a week and is wary of a long contract. She does not want tax advice from the learner; her accountant handles that.",
      reactions: {
        good:
          "When the learner asks open questions about what 'a mess' looks like, how things work today, what Sam needs and by when, Grace gives specifics (the pile of receipts, the lost login, Sam's two emails) and relaxes. When asked about budget plainly and kindly, or when the learner explains how the work could be priced so she can react, she shares her real figures. When the learner says back what they heard, she says 'Yes, exactly' and asks what happens next. She gladly accepts a short written summary and a clear first step.",
        poor:
          "When the learner jumps to a price, uses accounting words she does not know, asks several questions at once, or promises to 'fix everything' before knowing what is wrong, she goes vague and says 'I'm not sure, you're the expert.' She keeps the budget, the lost login and her privacy worry to herself. If the learner asks 'What's your budget?' bluntly with no reason, she says she was hoping to be told what it costs.",
      },
    },
    opening: "Hi, thanks so much for making time. I'm Grace. Like I said in my message, our books are a mess and I just need someone to sort them out. Can you help?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['listening', 'relevance', 'clarity', 'tone', 'completeness'],
    strongSigns: [
      'Opens with a short, friendly agenda and does not rush into solutions',
      "Asks what 'a mess' looks like, how things are done now, and what her accountant needs and when",
      'Asks one question at a time and follows her own words and stories',
      'Brings up timing, who else is involved and a rough budget range in a calm, explained way, not as a demand',
      'Says back the need in plain words and checks that she agrees',
      'Ends with a clear next step and says what will be sent and when',
    ],
    traps: [
      'Quotes a price or a monthly package in the first few turns',
      "Uses accounting jargon such as reconciliation, ledger or chart of accounts without explaining it",
      'Promises to fix everything or gives tax advice',
      "Asks 'what's your budget?' with no reason and no context",
      'Fires several questions in one turn and never lets her tell the story',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'deal-discovery-video-launch-uk',
    kind: 'roleplay',
    title: 'Discovery call with a rushed co-founder who "will know it when he sees it"',
    setting:
      "You are a freelance video editor. Callum co-founded a small online shop that sells bicycle accessories, based in Manchester, in the United Kingdom. He found your portfolio and wrote: 'We need videos for our launch. Can you jump on a quick call?' He booked 15 minutes. Callum and his shop are fictional and the amounts here are made up. Answer aloud.",
    goal: 'Learn what the launch videos must achieve, how many and by when, who decides and what budget range exists, even though he is short on time and vague.',
    speaking: true,
    partner: {
      role: 'client',
      name: 'Callum',
      title: 'Co-founder of a small online bicycle-accessories shop, six weeks from launch',
      personality:
        "Fast, informal and friendly, but distracted. Answers with 'whatever you think is best' or 'I'll know it when I see it'. Checks the time, jumps between ideas and interrupts with new ones. Gets short when asked abstract questions ('What is your brand vision?'). Respects people who stay calm, structure the call and give him easy choices.",
      private:
        "Launch is in six weeks. They need about eight short product videos for social media (15 to 30 seconds each) and would like one longer brand video if it can be afforded. He has raw footage for only half the products so far. His co-founder, Anya, makes the final decision on spending and style, and Callum cannot say yes alone; he has not mentioned her. They have set aside about £1,200 for the whole launch batch and Anya would not approve more than about £1,500. He tried a cheaper editor from a marketplace on one video: it arrived late and in the wrong shape for the platform, and he has not told Anya how bad it was. He is quietly afraid of being let down again so close to launch. Anya has asked him for a number by Friday, so he is hoping the learner will just send a quote. He shares the budget only if asked in a way that does not feel like a trap, and shares Anya and the bad trial only if the learner asks who else is involved or what happened with video work before. He does not know the difference between a cut, a rough cut and a final export and does not want a lesson.",
      reactions: {
        good:
          "When the learner opens with a short agenda ('a few quick questions so I can suggest something realistic, is 15 minutes still okay?'), asks easy, concrete questions one at a time, offers two or three simple choices when he says 'whatever you think', and asks who else decides and what happened last time, Callum slows down and gives real details (eight videos, six weeks, Anya, the late trial video). He says this is the call he needed. If asked about budget with a range-framed question, he gives about £1,200 and says Anya has the final word.",
        poor:
          "When the learner asks abstract questions, stacks several questions together, quotes a price early, explains video terms, or goes along with 'whatever you think' without clarifying anything, Callum gets vaguer, glances at the time and says 'can you just send me a quote?' and tries to end the call within a few turns. If pushed to name a price before the learner understands the job, he says another editor said much less and he might just go with that.",
      },
    },
    opening: "Hi, sorry, I've only got about fifteen minutes. So, we're launching soon and need some videos. Can you send me a quote after this?",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['listening', 'relevance', 'clarity', 'problem-solving', 'adaptability', 'tone'],
    strongSigns: [
      "Sets a short structure for the 15 minutes and keeps to it without sounding stiff",
      "Turns 'whatever you think' into two or three easy choices he can react to",
      'Asks concrete questions (how many, for where, by when) instead of abstract ones',
      'Finds out who else decides, and what happened with earlier video work',
      'Raises the budget range gently, with a reason, and does not quote a price before understanding the job',
      'Closes with the next step, what the learner will send and by when, so Callum can reply by his own deadline',
    ],
    traps: [
      'Agrees to send a quote straight away without understanding the job',
      'Asks big, abstract questions about brand and vision',
      'Lectures him about video terms or tells him how long good editing takes',
      'Asks many questions in one breath so he answers only the last one',
      "Accepts 'whatever you think is best' and decides alone",
    ],
    difficulty: 'demanding',
  },
  {
    id: 'deal-present-budget-property-automation',
    kind: 'roleplay',
    title: 'Present your first step and talk budget with a careful office manager',
    setting:
      "You build small AI automations for small businesses. Last week you had a discovery call with Tegan, who runs a small property management agency in Brisbane, Australia. Her team of four spends hours each day sorting tenant emails: repair requests, rent questions, inspection times. You have decided to propose a small first step: sort incoming emails into groups and prepare draft replies, with a staff member checking every reply before it is sent. Tegan and her agency are fictional and the amounts are made up. This is your 20-minute follow-up call, answered aloud.",
    goal: 'Present your first step in terms of what it changes for her team, answer her worries, and discuss money openly until you both know whether and how to go ahead.',
    speaking: true,
    partner: {
      role: 'client',
      name: 'Tegan',
      title: 'Owner-manager of a small property management agency in Brisbane, Australia',
      personality:
        "Careful, practical and polite. Asks 'what happens if...' a lot. Not technical and not embarrassed about it. Likes plain explanations and fixed prices, dislikes surprises and anything that sounds too good to be true.",
      private:
        "Her team spends about two hours a day on the shared inbox. She has two fears: an automatic message going to a tenant with wrong information (it happened once with a template) and paying monthly fees for something nobody understands. She has about $2,000 (AUD) for a first step, and a silent partner, Rob, must approve anything above about $2,500; she would rather stay under so she can say yes without waiting. She would also pay a small monthly amount for support, up to roughly $150, but only if it is clear what it covers, and she wants to know who pays for the software the automation runs on, which nobody has told her. She would like to see something working in two to three weeks. She does not reveal her budget unless asked, but if the learner states a clear price with what it includes, she reacts honestly ('that is more than I thought' or 'that works'). If told something is a range, she asks what decides where in the range it lands. She is also quietly unsure whether she can trust a freelancer she has met only online, and a clear, small first step with a checkpoint reassures her.",
      reactions: {
        good:
          "When the learner ties the proposal to the two hours a day and to her fear (a person checks every reply), explains the first step in plain words, gives a clear price with what is included and what is not, explains who pays for the tools, and asks about her budget range without pressure, she asks practical questions (what if it makes a mistake, how long, what happens after) and moves toward a decision. If offered a smaller and a fuller version of the first step, she picks one and asks for it in writing.",
        poor:
          "When the learner talks about AI models and features in jargon, gives an hourly rate with no total, says 'it depends' about price, apologises for the price, or promises the automation will 'never make mistakes' or will save 'all the time', she becomes cautious, says she needs to talk to Rob, and does not reveal her budget. If the learner overpromises she says 'that sounds too good to be true'.",
      },
    },
    opening: "Thanks for the follow-up call. So, tell me what you'd actually do for us, and roughly what it would cost. I'd like to understand it before I take it to anyone else.",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'relevance', 'negotiation', 'integrity', 'actionability'],
    strongSigns: [
      'Starts from her situation and worry in her own words, not from the tools',
      'Explains the first step in plain language, with what is included and what is not',
      'States the price clearly, once, without apologising, and says who pays for the software',
      'Asks about her budget range in a calm, explained way, or offers two options so she can react',
      'Is honest about limits and mistakes: no "never wrong" or "100 percent" promises',
      'Ends with a next step she can take, such as a short written proposal and a date',
    ],
    traps: [
      'Describes AI models and features instead of what changes for her team',
      "Gives an hourly rate with no total and no scope ('it depends')",
      'Apologises before or after stating the price',
      'Promises results that cannot be guaranteed, or says mistakes cannot happen',
      "Forgets to say who pays for the tools and what is not included",
    ],
    difficulty: 'realistic',
  },
  {
    id: 'deal-negotiate-support-retainer',
    kind: 'roleplay',
    title: 'Negotiate when the budget is below your range',
    setting:
      "You are a customer support freelancer working from the Philippines. You sent a proposal to Marcus, who founded a small software startup in the United States: ten hours a week of email support plus a live chat window, with replies inside two hours during agreed hours, for $900 a month. He has called to talk about the price. Marcus and his startup are fictional and every amount is made up. Before you start, decide your own minimum for this work, and what you could trade; the practice partner will not tell you what is right. Answer in the chat as you would on a real call.",
    goal: 'Reach an agreement you can sustain, by negotiating scope, timeline or price together, or part on good terms if there is none.',
    partner: {
      role: 'client',
      name: 'Marcus',
      title: 'Founder of a small software startup in the United States, looking for part-time support help',
      personality:
        "Upbeat, informal and fast-talking. Says 'we're a startup' and 'the vision' a lot. Sincere, not manipulative, but he negotiates by telling stories and asking 'what's the best you can do?'. Respects a clear, kindly stated boundary and mistakes hesitation for room to push.",
      private:
        "His real ceiling is $700 a month in total, and he will not say so first. He opens at $500 to see what happens. He would actually prefer a dependable person to a cheap one because a contractor vanished mid-month last year and customers noticed. He barely needs live chat (about one in ten requests) and added it because other companies offer it; email alone with a fast reply time would satisfy him. Friday volume is very low. He is open to month-to-month or a three-month term, and to paying monthly, but cannot pay anything upfront. He would pay extra later for help-centre articles, once the inbox is calm. He likes to say 'we will grow and there will be more hours later', which is a hope, not a plan. If the learner simply drops the price to $700 for the same scope, he is delighted and immediately asks for the help articles as well. If the learner holds at $900 with no alternatives, he thanks them and says a student he knows will do it for $600. If the learner offers trades that reduce the learner's own work (no live chat, fewer days, a smaller reply window) with a price that fits, he engages seriously and may agree to a short paid first month with a review. He does not know that a live chat window in US mornings is a late night for the learner, and will respond well and with surprise if told.",
      reactions: {
        good:
          "When the learner stays friendly, asks what matters most (speed of reply, hours, channels), explains their price through what it covers, and offers options that change scope, hours or term with a matching price (rather than just a discount), Marcus relaxes and starts choosing between them. He respects a stated minimum if it is explained kindly, and proposes a short first month with a check-in. If the learner is honest about the time zone limit, he says that helps him understand the live chat cost.",
        poor:
          "When the learner cuts the price at once, agrees to a lower rate for a vague promise of more hours, says the price is final with no reasons, gets defensive about their rate, or invents pressure ('I have other clients waiting'), Marcus changes: if they cave, he asks for more work at the same price; if they are rigid, he says 'no worries, I'll find someone', and the call ends cordially but coldly.",
      },
    },
    opening: "Hey, thanks for the proposal! I really like how you work. But honestly, $900 is a lot for us right now. We were thinking more like $500. What's the best you can do?",
    minTurns: 4,
    maxTurns: 11,
    criteria: ['negotiation', 'problem-solving', 'integrity', 'clarity', 'tone'],
    strongSigns: [
      'Stays friendly and curious and asks what matters most to him before answering the number',
      'Explains the price through what it covers, not through effort or need',
      "Offers choices that change scope, hours, term or payment, each with its own price, instead of only a discount",
      'Has a clear lowest point, states it kindly with a reason, and does not move below it for a vague promise of future work',
      'Stays honest: no invented clients, no pressure, no false urgency',
      'Ends by saying back what was agreed and the next step, in writing',
    ],
    traps: [
      'Drops the price at once and keeps the same amount of work',
      "Accepts a lower rate because 'there will be more hours later'",
      "Says 'this is my price, take it or leave it' with no explanation or options",
      'Gets defensive about the cost of their time or apologises for it',
      'Invents pressure, such as other clients waiting, to close the deal',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'deal-objection-cheaper-writer',
    kind: 'roleplay',
    title: 'Answer "I can get this cheaper" without discounting by reflex',
    setting:
      "You are a freelance writer. You sent a proposal to Daniel, a marketing manager at a small software company in Dublin, Ireland: four blog articles a month of about 1,200 words, an interview with his product team for each, fact-checking and one round of changes, for €1,000 a month. He wrote back with doubts, and you are replying by chat. Daniel and his company are fictional and the amounts are made up. Answer in the chat.",
    goal: 'Understand what is really behind the doubt, respond honestly, and agree a next step that fits his situation, or accept politely if it does not.',
    partner: {
      role: 'client',
      name: 'Daniel',
      title: 'Marketing manager at a small software company in Dublin, Ireland',
      personality:
        "Polite, understated and careful. Softens his criticism ('it's a bit steep', 'I'm not sure it quite fits'). Does not like a hard sell or comparisons that put other people down. Takes his time to say what is really worrying him, and only does so when asked a good question.",
      private:
        "Last quarter he used a cheaper writer from a marketplace. The articles were generic, had wrong statements about the product, and he spent about ten hours fixing them, which he has not told his manager, Fiona. Fiona has now asked him to justify the content budget, which can stretch to about €1,200 a month, so the learner's price is actually inside it. What he needs is something he can show Fiona: a clear process, samples that match his field, and a low-risk way to start. He would like a small paid trial of one article before committing to a month, and he does not want a long contract. He is quietly worried about looking foolish for hiring a second cheap writer. He does not want to hear that other writers are bad. If the learner invents clients or results to impress him, he becomes politely distant. If asked what he is comparing the price with, he will mention the cheaper writer and Fiona's question.",
      reactions: {
        good:
          "When the learner asks what he is comparing the price with and what he needs to be able to say to his manager, he opens up about the cheaper writer's problems and Fiona's question. When the learner then describes their process in plain terms (a short interview with his product team, fact-checking, one round of changes), offers samples clearly labelled as samples, and suggests a lower-risk first step such as a paid trial of one article, he is relieved and works out the next step.",
        poor:
          "When the learner gets defensive, says 'you get what you pay for', criticises cheaper writers, cuts the price straight away, or claims clients, results or traffic they cannot prove, Daniel goes politely distant ('I'll have a think and come back to you') and the opportunity fades.",
      },
    },
    opening: "Thanks for sending this over. It's a lovely proposal, really. I'll be honest, though: I've seen writers offering articles for a fraction of that, and I'm finding it a bit hard to justify the price to my manager.",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['negotiation', 'integrity', 'relevance', 'clarity', 'listening', 'tone'],
    strongSigns: [
      'Agrees that lower prices exist, calmly, without taking it as an insult',
      'Asks what he is comparing it with and what he needs the decision to look like to his manager',
      'Answers the real concern with something true they can show: a process, a relevant sample labelled as a sample, a small first step',
      'Offers a lower-risk option (a paid trial or a smaller package) with its own price instead of a bare discount',
      'Does not criticise other writers or promise results that cannot be promised',
      'Ends with a clear next step and a date',
    ],
    traps: [
      "Cuts the price at once without asking anything or changing the scope",
      "Says 'you get what you pay for' or criticises cheaper writers",
      'Invents clients, awards or results to look more impressive',
      'Becomes defensive or explains at length how hard the work is',
      'Offers to write the real articles as free samples',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'deal-scope-small-extras-assistant',
    kind: 'roleplay',
    title: 'Agree the scope with a client who keeps adding "small" extras',
    setting:
      "You are a virtual assistant. Over two calls you and Sanne, who runs a small online yoga studio in the Netherlands, agreed on a first month: manage her studio inbox on weekdays, put class sign-ups in her calendar, and send her a short weekly summary, about six hours a week for about €650. You have a final call to settle the scope before you write it down. Sanne has a list of 'small things' to add. Sanne and her studio are fictional and the amounts are made up. Answer in the chat.",
    goal: 'Agree a scope you can truly deliver by welcoming her ideas, naming what each extra means, and settling what is in, what is out and what happens next, in writing.',
    partner: {
      role: 'client',
      name: 'Sanne',
      title: 'Founder of a small online yoga studio in the Netherlands, new to hiring help',
      personality:
        "Warm, enthusiastic and a little overwhelmed. Thinks out loud and adds ideas as they come. Apologises for 'one more thing' and then adds it. Dislikes hearing 'no', loves hearing 'yes, and here is how'. Worried about being a bother.",
      private:
        "She has been doing her admin at midnight and wants relief fast. Her budget is about €650 a month and she could stretch to about €800 if the extras are worth it. She thinks a virtual assistant 'does everything' and has no idea what each extra costs in time. Her list, which she brings out one item at a time: answering Instagram messages, posting her weekly class schedule on social media, sorting her photo folders, booking flights for her retreats, and being available in the evenings during her classes 'just in case'. What she really wants are the Instagram messages and the weekly schedule post; the photo sorting and flights can wait, and evening availability is something she mentioned without thinking. She wants to start in ten days, before she leaves for a retreat. She was once burned by a designer when everything was agreed by voice, and she would welcome a written summary but will not ask for it. If an extra is named with a clear cost in time and an easy way to say yes, she picks happily. If the learner just says yes to all of it, she is delighted and does not ask about price, and later would be shocked by the bill or the workload. If told no flatly, she feels she asked too much and withdraws.",
      reactions: {
        good:
          "When the learner welcomes each idea, asks which ones matter most, says plainly what each would add in time and money, offers clear options (swap something out, add it with a price, or leave it for later), and promises to write the agreed scope down, Sanne relaxes, decides quickly, and drops the low-priority items herself. She thanks the learner for making it simple.",
        poor:
          "When the learner agrees to everything without a word about time or money, gives a flat no, answers with a long list of rules, or leaves the scope unwritten, Sanne either piles on more or withdraws and says 'oh, never mind, I'll do it myself'. If the learner promises she can start in ten days with the whole list, she is thrilled and does not question it.",
      },
    },
    opening: "Thank you so much for making time! Okay, so the inbox and the calendar are perfect. I just have a few small things to add, I hope that's okay. Could you also answer my Instagram messages?",
    minTurns: 4,
    maxTurns: 11,
    criteria: ['clarity', 'completeness', 'problem-solving', 'actionability', 'tone'],
    strongSigns: [
      'Welcomes each idea warmly before saying anything about limits',
      'Asks which extras matter most, so the real priorities show',
      'Names what each extra means in time or money, in plain words, and offers options: swap, add with a price, or later',
      'Notes evening availability and other hidden commitments as things to decide, not to absorb',
      'Checks that the whole package is something they can really deliver',
      'Says that the agreed scope, dates and price will be written down and sent for her to confirm',
    ],
    traps: [
      'Agrees to everything and quietly absorbs the extra work',
      'Says a flat no to extras, or lists rules and limits at length',
      'Agrees to evening availability without noticing the cost',
      'Promises the start date and the whole list without checking capacity',
      'Leaves the scope unwritten and relies on the call',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'deal-followup-summary-designer',
    kind: 'message',
    title: 'Write the follow-up summary after a call',
    situation:
      "You are a freelance graphic designer. After a 30-minute call you and Dana, who owns a small pet-sitting business in Denver, United States, agreed a job. Dana is a fictional client and the amounts are made up. She wants to share a written recap with her husband, who manages the money. Your own notes from the call are below Dana's message.",
    brief: 'Write the recap email that says what is included and what is not, the price and payment, the dates, what you need from Dana, and asks her to confirm.',
    channel: 'email',
    received:
      "Dana's message: Thanks so much for the call! I'm so excited. Could you send a quick recap of what we agreed? My husband looks after the money and wants to see it before we go ahead.\n\nYour notes from the call: A new logo: three directions first, then one refined direction. Five social media templates in her brand colours. She mentioned business cards 'maybe later' and a short animated logo 'if it's not too much': nothing agreed. Price $1,100 in total, half to start and half on delivery. Two rounds of changes on the chosen direction. Concepts in 10 working days from the day she pays and sends her old logo files and three brands she likes. Final files as PNG and PDF.",
    mustInclude: [
      'what is included: the logo directions, the refinement and the five templates',
      'what is not included or not decided yet: business cards and the animated logo',
      'the total price and when each payment is due',
      'a timeline with what Dana must send before the clock starts',
      'how many rounds of changes are included',
      'a clear request for her to reply to confirm before work starts',
    ],
    targetWords: { min: 130, max: 250 },
    criteria: ['clarity', 'completeness', 'structure', 'actionability', 'professionalism', 'tone'],
    difficulty: 'realistic',
  },
];
