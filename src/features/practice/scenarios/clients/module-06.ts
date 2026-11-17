import type { PracticeItem } from '../../types';

/**
 * Module 6 of Finding International Clients, "Finding and Approaching Potential Clients" (lessons 27 to 31): the Cold Outreach Assistant.
 * Two role-plays and five message tasks, each used by exactly one activity.
 * Used by: 27 the reply "how did you get my address?" (role-play); 28 a research note about a fictional prospect (message);
 * 29 choosing who to contact from a fictional team page (message); 30 a cold email and a LinkedIn connection note (messages);
 * 31 a follow-up (message) and a prospect who replies with real questions (role-play).
 * Every business, person, post and page below is fictional and says so. None of the partners is a villain: each has a believable position.
 */
export const items: PracticeItem[] = [
  {
    id: 'reach-how-did-you-get-my-address',
    kind: 'roleplay',
    title: 'A prospect asks: how did you get my address?',
    setting:
      "You are a freelance writer from the Philippines who writes blog posts and email newsletters. Two days ago you sent a short first email to Helen, the owner of a small physiotherapy clinic in Manchester, England. You used the address that the clinic's own website lists on its Contact page for general enquiries. Helen and her clinic are fictional. She has just replied, and she is not happy.",
    goal: 'Answer her question honestly, respect her wish, and end the conversation politely without pitching again.',
    partner: {
      role: 'client',
      name: 'Helen',
      title: 'Owner of a small physiotherapy clinic who was sent a cold email',
      personality:
        'Brisk, polite and protective of her inbox and her patients. Short sentences. Has been pestered by marketing emails before. Not a villain: she wants a straight answer and an assurance, not a fight.',
      private:
        "The address really is listed on her clinic website's Contact page for general enquiries. Her receptionist set that page up and Helen had forgotten it. She is not going to hire a writer now. What worries her most is whether anything about her patients was involved, so she wants to hear that the learner only used the business address from the public website. She would actually prefer a plain honest answer and a clean goodbye. If she gets that, she softens and may add that she will reach out herself if she ever needs help. She does not want to be argued with, sold to again, or told what the law allows.",
      reactions: {
        good: "When the learner says plainly where the address came from (the clinic's own public Contact page, nothing else), apologises briefly for the interruption, promises not to write again and does not pitch, Helen relaxes, thanks them for the straight answer and says it is fine. She may add a short, kind closing line.",
        poor: "When the learner is vague about the source, says 'it's public so it's allowed', gives legal opinions, pitches again or asks for 'just one quick call', Helen becomes sharper, says she will mark the messages as spam, and ends the conversation. If the learner invents a mutual contact, she asks who it was by name.",
      },
    },
    opening: "Hello. I got your email. I am not interested. More to the point, how did you get this address? I have never signed up for anything from you.",
    minTurns: 3,
    maxTurns: 7,
    criteria: ['integrity', 'tone', 'accountability', 'professionalism', 'listening', 'clarity'],
    strongSigns: [
      "Answers the question directly: the address came from the clinic's own public Contact page, and nothing else was used",
      'Does not claim the address was a personal or patient contact, and does not hide or blur the source',
      'Apologises briefly for the interruption without grovelling or over-explaining',
      'Says clearly that they will not write again and that they will note it',
      'Does not pitch again, ask for a call or argue that the message was reasonable',
      'Keeps the reply short and ends warmly',
    ],
    traps: [
      "Defending the message with 'it's public, so it's allowed' or giving a legal opinion",
      'Pitching again or asking her to reconsider',
      'A vague answer about where the address came from, or a made-up reason such as a mutual friend',
      'A long, anxious apology that makes the conversation about the learner',
      'Promising to remove her from a list that never existed, which sounds like a mass mailing',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'reach-research-note-northfield-tea',
    kind: 'message',
    title: 'Write a research note: verified, assumed and unknown',
    situation:
      "You offer your own freelance service and you are researching a possible client before you write to them. Below are the notes you took on 12 March about Northfield Tea Co., a fictional online tea shop in Australia. Turn them into a short research note for your tracker. This task reviews how you separate facts from guesses, not how well you write.",
    brief: 'Write a research note that labels what is verified (with its source and date), what is only a guess, and what you could not find.',
    channel: 'message',
    received:
      "Business: Northfield Tea Co. (fictional), an online tea shop in Hobart, Tasmania, Australia. Notes I took on 12 March from its public pages:\n- Home page (northfieldtea.example): 'Small-batch loose-leaf tea, packed by hand in Hobart.' It shows 34 products.\n- About page: 'Started in 2021 by Lena Park and her brother Marcus.' No other staff are named.\n- Shipping page: 'Orders ship on Mondays and Thursdays.'\n- Blog: the last post is dated 14 July of last year.\n- Contact page: lists hello@northfieldtea.example and says 'We answer within three working days.'\n- Public Instagram bio: 'New blend every month. Wholesale enquiries welcome.' The latest post is 9 days old.\n- I did not find a customer reviews page, a newsletter archive, or any staff roles.\n- A forum comment, no link saved: 'Northfield's emails are slow.'",
    mustInclude: [
      'at least three facts marked as verified, each with its source',
      'the date you checked them',
      'one item clearly labelled as a guess or as hearsay, not a fact',
      'one honest reason the business might need your service, tied to a verified fact',
      'one thing you could not find or confirm',
    ],
    targetWords: { min: 90, max: 200 },
    criteria: ['integrity', 'clarity', 'relevance', 'completeness', 'structure'],
    difficulty: 'gentle',
  },
  {
    id: 'reach-find-contact-brightpath',
    kind: 'message',
    title: 'Choose who to contact from public pages',
    situation:
      "You offer a freelance service for small businesses and you have decided that Brightpath Dental Group, a fictional group of dental clinics in the United States, is worth a careful first message. Below is what you recorded from its public pages on 5 April. Decide who and what to contact, using only what is public.",
    brief: 'Write a short note saying who or which address you would contact, why, what you checked, and what you would do if no suitable public contact existed.',
    channel: 'message',
    received:
      "Brightpath Dental Group (fictional), three small clinics in Ohio, United States. What I recorded on 5 April:\n- 'Our team' page: Dr. Alan Brooks (founder, dentist); Priya Nair, 'Practice Manager, looks after our front desk, our website and our patient reminders'; two hygienists; a front-desk coordinator, first name only.\n- Contact page: a phone number for appointments, a form 'for patients', and 'Business and vendor enquiries: vendors@brightpathdental.example'.\n- Footer: 'Website by a local agency' (no agency name).\n- A public professional-network profile for Priya Nair says 'Practice Manager at Brightpath Dental Group'. It lists no email address.\n- A news item from two years ago names a former marketing coordinator who is not on the team page now.\n- A directory website lists info@brightpathdental.example, with no source or date.",
    mustInclude: [
      'the person or channel you would choose, with its public source',
      "why that person or channel fits (their role as the page states it)",
      'one address or route you would not use, and why',
      'what is still unknown or unconfirmed',
      'what you would do if you could not find a suitable public contact',
    ],
    targetWords: { min: 90, max: 190 },
    criteria: ['integrity', 'relevance', 'problem-solving', 'clarity', 'completeness'],
    difficulty: 'realistic',
  },
  {
    id: 'reach-cold-email-marlowe-finch',
    kind: 'message',
    title: 'Write a personalized cold email',
    situation:
      "You are writing your first email to a fictional prospect, using only the facts in the profile below and your own real service. Describe only what you have really done: if you have no client work yet, say what you can do now, or point to a sample that you label as a sample. Do not invent clients, results or compliments, and do not claim anything about the business that the profile does not show.",
    brief: 'Write the first email: say how you found the address, mention one true detail, say what you do, make one small ask and make it easy to say no.',
    channel: 'email',
    received:
      "Prospect profile (fictional business; facts as recorded on 3 June)\nBusiness: Marlowe & Finch, a small online shop selling hand-poured candles, Brisbane, Australia.\nVerified, with source:\n- Website, Home page (marlowefinch.example): '40 scents, poured in small batches.'\n- About page: founded by Jess Calloway and Ahmed Reyes, 'two friends who hated mass-produced candles.'\n- Contact page: 'For collaborations and supplier enquiries: partners@marlowefinch.example. Customers: hello@marlowefinch.example.'\n- Blog: the last post is dated eight months ago. The four newest scents each have one photo.\n- Shipping page: 'Orders go out within three business days.'\nNot verified: whether they want outside help, their budget, who reads partners@.\nPossible contact: Jess Calloway, named as co-founder; her role in marketing is not stated.",
    mustInclude: [
      'where you found the address (the public Contact page)',
      'one specific, true detail from the profile',
      'one honest sentence about what you do, with no invented results',
      'a small, low-pressure ask that can be answered in one line',
      'an easy way to say no or to stop the messages',
      'your real name and an honest pointer to your work or a labelled sample',
    ],
    targetWords: { min: 80, max: 150 },
    criteria: ['relevance', 'integrity', 'clarity', 'tone', 'actionability', 'professionalism'],
    difficulty: 'demanding',
  },
  {
    id: 'reach-linkedin-note-fernhill',
    kind: 'message',
    title: 'Write a short LinkedIn connection note',
    situation:
      "You want to connect with a marketing lead at a small business whose public LinkedIn profile you read on 20 May. The profile and the business are fictional. A connection note is not a pitch: it is a short, honest reason to connect, and platforms limit its length, so keep it very short. Use your own real service.",
    brief: 'Write a connection note that names one specific detail, gives one honest reason for connecting and asks for nothing else.',
    channel: 'message',
    received:
      "Public profile, viewed on 20 May (fictional)\nName: Daniel Whitfield\nHeadline: 'Head of Marketing at Fernhill Home Care | Family-focused care in Surrey, England'\nAbout: 'I lead marketing for a care provider with about 25 staff. I like plain words and I read every enquiry that comes through our website.'\nRecent public post (two weeks before 20 May): 'We are rewriting our website FAQ this month. Families keep asking us the same five questions about visiting hours, costs and how to get started. If you have tips for writing for worried families, I would love to hear them.'\nShared groups or connections with you: none.",
    mustInclude: [
      'one specific detail from his post, not only his job title',
      'one honest sentence on why you are connecting',
      'no pitch, no link and no request for a call',
      'a plain, friendly sign-off with your real name',
    ],
    targetWords: { min: 25, max: 65 },
    criteria: ['relevance', 'tone', 'clarity', 'integrity', 'professionalism'],
    difficulty: 'gentle',
  },
  {
    id: 'reach-follow-up-ridgeway',
    kind: 'message',
    title: 'Write a follow-up that adds something',
    situation:
      "Six days ago you sent the email below to Carla, who runs Ridgeway Dog Training in Canada (a fictional business). You have not had a reply. You have checked the business's public pages again today, 18 June, and noticed something new. Write one follow-up. It is your last message unless she replies.",
    brief: 'Write a short follow-up that refers to your first email in a few words, adds one new and true detail, and keeps the door open without pressure.',
    channel: 'email',
    received:
      "Your first email, sent 12 June:\nSubject: A question about your class pages\n\nHello Carla,\nI found your address on the Contact page of Ridgeway Dog Training, where it is listed for general enquiries. I am Joy, a freelance virtual assistant in Cebu, Philippines. I help small businesses keep their websites and customer messages up to date.\nI noticed that your home page lists the spring class schedule, while the Classes page still shows last year's dates. Is keeping those pages current something you handle yourself?\nIf it is not relevant, just tell me and I will not write again.\nThanks, Joy Mercado\n\nWhat you noticed on 18 June: the Classes page now shows this year's spring dates and lists 'Puppy classes starting 7 July'. The home page banner still says 'Spring classes' and does not mention the puppy classes. No reply to your first email.",
    mustInclude: [
      'a short reference to your first email, without guilt or pressure',
      'one new and true detail added from your check on 18 June',
      'a clear and easy way to say no or to stop',
      'no fake urgency and no phrases like "just checking in" with nothing new',
      'a sign that this is your last message unless she replies',
    ],
    targetWords: { min: 40, max: 90 },
    criteria: ['tone', 'relevance', 'integrity', 'clarity', 'actionability', 'professionalism'],
    difficulty: 'realistic',
  },
  {
    id: 'reach-prospect-asks-questions',
    kind: 'roleplay',
    title: 'A prospect replies with real questions',
    setting:
      "You are a freelance virtual assistant from the Philippines. A week ago you sent a short first email to Owen, co-owner of a small bike repair shop in Calgary, Canada (a fictional business), using the address on the shop's public Contact page. He has written back with questions. What you have really done: you managed inboxes, calendars and invoices for two small online sellers for about a year. You have never worked with a bike shop.",
    goal: 'Answer his questions honestly and clearly, and propose a small next step without overpromising or inventing experience.',
    partner: {
      role: 'client',
      name: 'Owen',
      title: 'Co-owner of a small bike repair shop, curious but short of time',
      personality:
        'Practical, friendly, a little time-poor. Plain words, direct questions. Distrusts big promises and long answers. Respects honesty and a clear small step.',
      private:
        "He and his partner lose time to repair requests that arrive by direct message, email and voicemail, and they double-booked two customers last month. He has a small monthly amount in mind but will not name it unless asked how pricing would work, and he would much rather start with a short paid trial than a long agreement. He is also uneasy about giving a stranger access to the shop's email and booking tool, and about a helper who is asleep while the shop is busy. If the learner admits plainly that they have not worked with a bike shop but explains what they have really done, and how a first week would run, he becomes interested. If the learner invents bike-shop experience, he asks for details.",
      reactions: {
        good: "When the learner answers each of his questions in plain words, admits honestly what they have not done, explains how they would price (what it depends on) without grabbing a number, mentions the time difference and the access question, and proposes a small first step, Owen warms up, asks one more practical question and agrees to a short call or a trial.",
        poor: "When the learner invents experience, promises results ('no more double bookings'), gives a long wall of text, names a price with no idea of the work, or asks for full access to his email straight away, Owen becomes guarded, asks for proof, says he will think about it, and may stop replying.",
      },
    },
    opening:
      "Thanks for your email, it landed in a busy week. Before I decide whether a call is worth my time: what exactly would you do for us, how soon would it be useful, roughly what would it cost, and have you worked with a bike shop before?",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['integrity', 'clarity', 'relevance', 'actionability', 'tone', 'listening'],
    strongSigns: [
      'Answers all four of his questions in plain words without a wall of text',
      "Says honestly that they have not worked with a bike shop, and names what they really have done and how it connects",
      'Explains how they would price (what it depends on) instead of naming a number with no knowledge of the work',
      'Mentions the time difference as something to agree on: overlap hours and a response window',
      'Treats access to email or tools carefully and proposes a small first step, such as a short call or a small paid trial',
      'Asks one useful question about how requests reach the shop today',
    ],
    traps: [
      'Inventing bike-shop experience, clients or results',
      'Promising an outcome such as no more double bookings',
      'Quoting a price or a long agreement before knowing the work',
      'Asking for full access to his inbox and booking tool at once',
      'Writing long, jargon-heavy replies',
    ],
    difficulty: 'realistic',
  },
];
