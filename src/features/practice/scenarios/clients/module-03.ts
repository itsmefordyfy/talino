import type { PracticeItem } from '../../types';

/**
 * Finding International Clients, module 3, Where to Find International Clients (lessons 11 to 16): four message tasks and two role-plays, all fictional.
 * Used by: 11 a marketplace client's message (message), 12 an employer from a job board (role-play), 13 a question in a community (message),
 * 14 the Client Research Workflow: a research note on a fictional company profile (message), 15 evaluating a fictional job listing (message),
 * 16 a scam-recognition conversation (role-play).
 * Every company, listing, profile and person here is made up. The partners are people with believable positions; the scam scenario's recruiter
 * stays plausible and persistent, and the learner's job is to notice, ask safe questions and decline or verify. No field holds an ideal reply.
 */
export const items: PracticeItem[] = [
  {
    id: 'find-marketplace-invite-reply',
    kind: 'message',
    title: 'Reply to a client who messaged you on a marketplace',
    situation:
      "You have a freelance profile on an online marketplace. A fictional client, Hannah, who runs a small online candle shop in Ireland, has sent you a message after seeing your profile. She is asking two plain questions and has not decided to hire anyone yet. If the work she describes is not exactly what you offer, answer honestly as the freelancer you really are.",
    brief: "Write your reply to Hannah: answer her two questions truthfully, say what you can do, and make one clear next step easy for her.",
    channel: 'message',
    received:
      "Hi, I saw your profile. I run a small online shop that sells handmade candles. It is just me and one part-time helper. I am looking for someone to help with customer emails and tracking orders for about ten hours a week, starting next month. Have you done this kind of work before? And how do you usually work with a client who is new to hiring someone overseas? Thanks, Hannah",
    mustInclude: [
      'a direct, honest answer to whether you have done this kind of work (what you have done, or what is close to it)',
      'a plain description of how you would work with a client new to hiring overseas (for example how you would update her and when you are online)',
      'one specific detail from her message, such as the ten hours a week or the order tracking',
      'only facts that are true for you, with no invented clients or experience',
      'one clear, easy next step for Hannah',
    ],
    targetWords: { min: 80, max: 170 },
    criteria: ['clarity', 'tone', 'integrity', 'relevance', 'actionability'],
    difficulty: 'gentle',
  },
  {
    id: 'find-board-employer-chat',
    kind: 'roleplay',
    title: 'Answer an employer who replied on a job board',
    setting:
      "You applied for a part-time remote assistant role on a job board. The employer, a fictional man named Greg who runs a small home-repair business in Texas, has replied in the board's chat. This is a fictional employer and a made-up post. You are a real person with real limits on your hours and your tools, and you decide what you can honestly offer.",
    goal: 'Answer his questions honestly, learn what you need to know about the role, and agree one next step such as a short video call.',
    partner: {
      role: 'client',
      name: 'Greg',
      title: 'Owner of a small home-repair business in Texas, looking for a part-time remote assistant',
      personality:
        'Friendly and practical. Types short messages with several questions at once. Likes direct answers and dislikes long speeches. Warms up when someone says plainly what they can and cannot do.',
      private:
        "His last assistant answered yes to everything and then stopped replying after two weeks, so what he fears most is unreliability, not lack of experience. He needs someone online during his busy mornings in Texas (about 8 AM to noon Central time). He already uses a shared calendar and a customer messaging app. He is willing to train someone on the tools and to start with fewer hours, and he can be flexible about the start date. He has a small budget he has not mentioned and will only raise it if asked directly. He has no website for the business, only a public business page, and he is happy to show it on a video call.",
      reactions: {
        good:
          "When the learner gives specific, honest answers (which hours they can cover, which tools they have used and which they have not), asks sensible questions about the tasks and the hours, and proposes a short call, Greg relaxes, shares more about the role and mentions the mornings and the trial period.",
        poor:
          "When the learner says yes to everything ('any hours, any tool'), is vague, gives a speech about themselves or pushes for the job without asking anything, Greg becomes cautious and says he has been let down by people who said yes to everything. If the learner pressures him, he says he will 'look at other options'.",
      },
    },
    opening:
      "Hi, thanks for applying. A few quick questions: what hours can you cover in Central time, which tools have you used, and when could you start?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['clarity', 'integrity', 'listening', 'relevance', 'actionability'],
    strongSigns: [
      'Gives a specific, honest answer about hours, including what they cannot cover',
      'Says which tools they have used and which they have not, and how they would learn the others',
      'Asks a real question about the tasks, the hours or how the role works',
      'Notices that reliability seems to matter to Greg and speaks to it without overpromising',
      'Proposes a clear next step, such as a short video call, and does not share private documents',
    ],
    traps: [
      "Says 'yes, any hours' or claims every tool to sound keen",
      'Gives a long speech about themselves and answers none of the three questions',
      'Asks about pay or time off before showing any interest in the work',
      'Offers to send ID or bank details in the first conversation',
      'Pressures him to decide quickly',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'find-community-reply',
    kind: 'message',
    title: 'Reply to a question in a business community',
    situation:
      "You are a member of a fictional online group for owners of small independent shops, which you joined to learn and to be useful. The group's pinned rules say: 'No advertising and no links to your own services. Help each other freely.' A member has asked for help, and you know something relevant from your own work. If the question is outside your service, share only what you really know and say so.",
    brief: "Write the reply you would post in the group: help with the question using ideas the owner can use today, follow the rules, and keep it in your own words.",
    channel: 'message',
    received:
      "Hi all, I own a small shop that sells ceramic mugs online. My product photos look flat and customers keep emailing to ask how big the mugs are. I cannot afford a photography studio. Does anyone have simple, cheap ideas to make the photos better and answer the size question? Thanks in advance. Marta",
    mustInclude: [
      'at least two practical ideas Marta can try today, tied to her actual question (photos and size)',
      'no advertising, no link to your own services and no offer to be hired, because the group rules forbid it',
      'honesty about what you know, with no made-up credentials or claims',
      'one question about her situation that shows you read her post',
    ],
    targetWords: { min: 60, max: 150 },
    criteria: ['relevance', 'integrity', 'tone', 'clarity', 'professionalism'],
    difficulty: 'realistic',
  },
  {
    id: 'find-company-research-note',
    kind: 'message',
    title: 'Write a research note on a fictional company',
    situation:
      "You are building your client tracker. Below are raw notes about a fictional company, Harbor and Pine Dental, which does not exist. Pretend you gathered them yourself and read each source on 17 November. Write a short research note for your tracker about this company for a service you really offer. Keep what is verified, what is assumed and where you would check it clearly apart, and decide whether it could be a fit.",
    brief: "Write a research note that separates verified facts (with their source) from assumptions (with where you would check each) and ends with a fit decision and one next step.",
    channel: 'update',
    received:
      "Raw notes on Harbor and Pine Dental (fictional), all read on 17 November.\n- Company website, home page: 'Family dental care in Portland, Oregon. Two clinics. Book online.'\n- Company website, About page: 'Founded in 2012 by Dr Elena Park.' No staff numbers are given.\n- Company website, Team page: lists Dr Park as principal dentist and a practice manager named Tom Reyes. No emails are shown.\n- Company website, Contact page: a form and a main clinic phone number for enquiries.\n- Company website, Blog page: newest post is dated 14 months ago.\n- A business directory listing says 'about 25 employees'. The directory does not say where the figure comes from.\n- A comment under one of the company's social posts says: 'They are hiring a front desk assistant.' The company has not posted that itself that I could find.\n- My own impression: busy, well-run, probably wants help with online content.",
    mustInclude: [
      'which facts are verified, each tied to the page where it appears in the notes',
      'which statements are assumptions or unconfirmed (for example the staff number, the hiring comment and your impression), labelled as such',
      'where you would check each assumption (a real place, such as the company site, its public profile or a direct enquiry)',
      'whether the company could be a fit for a service you really offer, with the reason based only on verified facts',
      'the decision-maker as public or not public, without guessing',
      'one small next step',
    ],
    targetWords: { min: 120, max: 260 },
    criteria: ['clarity', 'integrity', 'structure', 'completeness', 'relevance', 'actionability'],
    difficulty: 'realistic',
  },
  {
    id: 'find-listing-evaluation',
    kind: 'message',
    title: 'Evaluate a fictional job listing',
    situation:
      "Below is a fictional job listing, written for this exercise. The company does not exist. Imagine you offer the service it asks for, or the nearest one to your own; if it is not yours, say what you would have to learn. Write your evaluation for your tracker: how specific the scope is, whether the budget fits the work using your own hour estimate and your own minimum rate, what the client's history shows, what worries you, who decides and what you would do.",
    brief: "Write an evaluation of the listing that quotes what it says, shows your budget thinking and ends with a decision (apply, ask first or skip) and the reason or question behind it.",
    channel: 'update',
    received:
      "Listing (fictional), posted by Northfield Outdoor Co.:\n'We need eight short videos edited from raw footage for our spring product launch, each about 60 seconds, with subtitles in English. Our own brand colours and a short music track will be provided. Fixed budget for the whole project: USD 120. Deadline: six days from posting. To be considered, please include a free 30-second sample edit of our footage with your proposal. Payment is released when all eight videos are approved. Our founder, Anna, approves the final videos. This post was written by her assistant.'\nClient information shown on the page: three past jobs posted, two with written feedback from freelancers; website listed: northfield-outdoor.example (fictional); location: United Kingdom.",
    mustInclude: [
      'what is specific about the scope and what is vague or missing, quoting the listing',
      'your own estimate of the hours (and what you assumed), the budget per hour that results and how it compares with your own minimum rate, with no invented market rates',
      'what the client history and website do and do not tell you',
      'how you would handle the request for a free sample edit (a limit, a question or a refusal) and the six-day deadline',
      'who decides, and what you would ask about it',
      'a decision (apply, ask first or skip) with the reason, and the question you would send if you ask first',
    ],
    targetWords: { min: 150, max: 300 },
    criteria: ['clarity', 'integrity', 'problem-solving', 'completeness', 'structure', 'relevance'],
    difficulty: 'demanding',
  },
  {
    id: 'find-scam-fee-recruiter',
    kind: 'roleplay',
    title: 'Talk with a persistent recruiter about a suspicious offer',
    setting:
      "You applied for a remote assistant job you found online, and a fictional recruiter named Daniel from a fictional agency, Brightline Talent Partners, has just messaged you that you are hired. He has not asked you a single question about your work. The salary he mentions is high for the work described. You do not have to agree to anything, and no real company or person is involved.",
    goal: 'Notice what is being asked of you, ask safe questions, and either verify the offer safely or decline politely without sharing anything private.',
    partner: {
      role: 'client',
      name: 'Daniel',
      title: "Recruiter at a fictional agency, 'Brightline Talent Partners', offering a remote assistant role",
      personality:
        'Warm, quick and polite. Uses friendly phrases and exclamation marks. Never rude, even when refused. Always has an answer ready, but the answers stay general and never give anything that can be checked outside the chat. Becomes more insistent about time as he is questioned.',
      private:
        "He wants the learner to pay a small 'training kit' fee, to move to a private chat app, and to send a photo of ID and online banking details 'for payroll', all today, before anything can be checked. He will not give the name of a company website or a business email, and has reasons for everything ('the website is being rebuilt', 'our email is down today', 'video calls are only for the final stage'). When refused, he says the fee is refundable and that other candidates have already paid, and he tries one more nudge. If the learner clearly declines, he accepts politely with one last 'what a pity'. He never reveals that the offer is not genuine and never gives a verifiable detail.",
      reactions: {
        good:
          "When the learner stays calm, asks what the work is each day and which company it belongs to, asks for a video call or a business email, and says plainly they do not pay fees or share logins, Daniel becomes vaguer and more insistent about timing, then eventually backs off politely.",
        poor:
          "When the learner agrees to pay, asks only about the salary, moves to a private chat or offers any private detail, Daniel becomes more enthusiastic and asks for the next item (the fee first, then the ID, then the login). If the learner is rude or accuses him, he stays calm and says he is only trying to help.",
      },
    },
    opening:
      "Congratulations! You have been selected for our remote assistant position. The salary is excellent for light work. To get started today, we just need to move to a private chat and complete a small onboarding fee, which is refunded with your first pay. Are you ready?",
    minTurns: 4,
    maxTurns: 8,
    criteria: ['integrity', 'problem-solving', 'clarity', 'professionalism', 'tone'],
    strongSigns: [
      'Stays calm and polite, and does not accuse',
      'Asks what the work is each day and which company the role belongs to, and notices vague answers',
      'Says clearly that they do not pay fees to start work or share logins or codes',
      'Asks for a video call or a published business email, and says they will check the company themselves',
      'Declines or pauses politely without sharing anything private, and does not feel pressured by the deadline',
    ],
    traps: [
      'Pays or agrees to pay the fee, even a small one',
      'Moves to the private chat or shares an ID photo, a login or a code',
      'Is swayed by the salary or the line that the offer ends today',
      'Becomes angry or insulting, which ends the chance to ask questions safely',
      'Asks only about pay and does not ask what the work is or who the company is',
    ],
    difficulty: 'realistic',
  },
];
