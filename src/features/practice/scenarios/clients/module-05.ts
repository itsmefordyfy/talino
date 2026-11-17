import type { PracticeItem } from '../../types';

/**
 * Module 5, Creating a Professional International Freelance Profile (lessons 22 to 26): the Profile Builder. Two role-plays and five message tasks.
 * Used by: 22 a spoken "what do you do" (role-play) and a headline with an introduction (message), 23 a LinkedIn About section (message),
 * 24 one service offering (message), 25 an honest experience entry (message) and the gaps-and-references conversation (role-play),
 * 26 a local job-board profile (message). Project 1 uses all seven.
 * Every client, company, post and draft here is fictional. Tasks that review the learner's own profile say so and ask for the learner's own real
 * facts: nothing here asks the learner to invent experience, clients, reviews or results.
 */
export const items: PracticeItem[] = [
  {
    id: 'prof-what-do-you-do',
    kind: 'roleplay',
    title: 'Say what you do in one conversation',
    setting:
      "You have joined an online group for small business owners and posted a short introduction. Fiona, who runs a small online stationery shop in the UK, replied and asked for a five-minute call. Fiona is a fictional person. Answer with your own real service and your real situation, and do not claim anything you cannot show.",
    goal: 'Explain what you do and who you help so clearly that Fiona can say it back in her own words, without claiming anything that is not true.',
    partner: {
      role: 'client',
      name: 'Fiona',
      title: 'Owner of a small online stationery shop in the UK, curious but unsure what freelancers actually do',
      personality:
        'Friendly, a little rushed, and plain-spoken. Dislikes vague job titles and big promises. Asks short follow-up questions and warms up when she hears something concrete about people like her.',
      private:
        "Fiona spends most evenings answering customer emails and updating product pages, and she has half-wondered whether someone could take some of it. She has never hired anyone from another country and does not really know what a virtual assistant, designer or writer would do for a shop like hers. A line such as 'I do admin' or 'I am hardworking and flexible' tells her nothing and makes her pull back. She will not ask about price unless the learner raises it. The learner may offer any service (writing, design, support, editing, bookkeeping, automation); treat whatever they describe as their real service. If it does not fit her shop she says so kindly and asks who it is for. She is not hiring today and will not pretend to be. A small honest statement, such as 'I am new, and I have samples', does not bother her, but a big claim she cannot picture makes her doubt the rest.",
      reactions: {
        good: "When the learner names who they help and what changes for those people, in plain words, she says she can picture it and asks a curious follow-up about how it would work. If they are honest about being new or having samples, she says that is fine. If they ask her something about her own work and listen, she relaxes and offers a little more about her evenings.",
        poor: "When the learner lists skills, uses jargon or only gives a job title, she says 'So what would that look like for a shop like mine?' and then goes quiet. If they claim years of experience or results she cannot picture, she politely asks for an example, and if there is none she gets more careful and ends the call early.",
      },
    },
    opening: "Hi, thanks for hopping on a quick call. I saw your post in the shop owners' group, but I wasn't sure what you actually do. So, what is it you do?",
    minTurns: 3,
    maxTurns: 7,
    criteria: ['clarity', 'relevance', 'integrity', 'listening', 'professionalism'],
    strongSigns: [
      'Names the kind of person or business they help and the problem, before listing skills',
      'Describes what changes for the client in plain words, with no jargon',
      'Is honest about their real situation (new, has samples, has a few clients) without apologising for it',
      'Gives one concrete, true example or sample instead of an adjective',
      'Asks Fiona a question about her own work and uses the answer',
      'Ends by checking that Fiona can say back what they do, and suggests a small next step if she is interested',
    ],
    traps: [
      'Starts with a long personal history instead of what they can do for someone like Fiona',
      'Lists many unrelated skills, or says they can do anything',
      'Claims years of experience, awards or results they cannot show',
      'Uses jargon or tool names Fiona has no reason to know',
      'Pushes for a sale or a contract on a first, friendly call',
    ],
    difficulty: 'gentle',
    speaking: true,
  },
  {
    id: 'prof-upwork-headline-intro',
    kind: 'message',
    title: 'Write an Upwork headline and introduction',
    situation:
      "You are writing the headline and the first lines of the introduction for your own marketplace profile. Use your own real service, your real skills and the proof you actually have. If you have no clients yet, that is fine: say what you can show, such as sample projects labelled as samples. Below, a fictional client explains what he looks for when he scans profiles, so you can see how a reader thinks. Apply the same thinking to your own service, even if it is a different one.",
    brief: 'Write a headline and a two- or three-line introduction for your own profile, then add one line that names the fact behind each claim you made.',
    channel: 'message',
    received:
      "From Owen, who runs a small online plant shop in Brisbane (a fictional client): 'I run a small online shop that sells indoor plants. I need someone reliable to answer customer emails, keep my product listings up to date and send tracking details. About ten hours a week to start, and ongoing if it goes well. Mornings my time would suit me best. I have opened a lot of profiles that say they do everything. I would like to see someone who can tell me, in a few words, what they do and for whom, and what they have actually done. Please do not tell me you are the best. Show me you can do this one job.'",
    mustInclude: [
      'a headline that names one service and the kind of client it is for',
      'a first line of the introduction that is about the client\'s situation or problem, not about the writer',
      'only claims that the learner\'s real work supports, or an honest label such as sample work or volunteer project',
      'one plain sentence on how the learner works or when they are available',
      'a short note at the end naming the fact behind each claim (for example, a sample project, a past job, a course project)',
      'no words such as expert, top-rated or best unless the learner can show where they come from',
    ],
    targetWords: { min: 60, max: 170 },
    criteria: ['clarity', 'relevance', 'integrity', 'professionalism', 'completeness', 'grammar'],
    difficulty: 'realistic',
  },
  {
    id: 'prof-linkedin-about',
    kind: 'message',
    title: 'Write your LinkedIn About section',
    situation:
      "You are writing the About section of your own LinkedIn profile, in the first person, for people who may find you through connections or a search and want a few more sentences than a headline allows. Use your own real service, skills and proof. If you are new, say what you are building and what you can show, honestly. The fictional comment below is one reader's view of what makes an About section useful. It is one person's opinion, not a rule, so use it to think about your reader.",
    brief: 'Write the About section for your own profile in 110 to 220 words: who you help, what you do, how you work, your real proof, and an easy way to start a conversation.',
    channel: 'message',
    received:
      "From Samira, who runs a small marketing agency in Toronto (a fictional person), in a community post: 'When I look at someone's About section, I am looking for three things. What do they do? Who have they done it for, or who are they hoping to help? And what would a first conversation with them be about? I skip anything that reads like a CV turned into a paragraph, or a pile of buzzwords. I do not mind if someone is early in their freelance work. I do mind if I cannot tell what is real. A short, honest section with one concrete example beats a long one that says nothing.'",
    mustInclude: [
      'an opening line about the people the learner helps or the problem they solve',
      'what the learner does and how they work, in plain words a non-expert can follow',
      'real proof, clearly labelled (a past job, a sample project, a volunteer project, a course project)',
      'one honest line about where the learner is now, such as building a first client list or taking on new work',
      'a clear and specific invitation to start a conversation',
    ],
    targetWords: { min: 110, max: 220 },
    criteria: ['clarity', 'relevance', 'integrity', 'tone', 'structure', 'actionability', 'professionalism'],
    difficulty: 'realistic',
  },
  {
    id: 'prof-service-offering',
    kind: 'message',
    title: 'Write one service offering',
    situation:
      "You are writing one clearly bounded service offering for your own profile, something a client can say yes to without a long conversation first. Choose a service you can really deliver today. The fictional offer below was written by someone else, and it shows what readers often find hard to understand. Do not copy its style.",
    brief: 'Write one service offering for your own profile that says what the client gets, what is not included, what you need to start, how long it usually takes and how to begin.',
    channel: 'message',
    received:
      "A fictional offer written by another freelancer: 'I will do your social media. I am creative, fast and friendly. All kinds of businesses are welcome and I can do anything you need. Unlimited changes until you are happy. Message me and we will talk about price. Tell me your goals and I will make it work. I have a lot of experience with different platforms and I love what I do. Contact me now to get started and I will get back to you as soon as I can.'",
    mustInclude: [
      'what the client gets, as named deliverables rather than a feeling',
      'what is not included, so the boundary is clear',
      'what the learner needs from the client to start',
      'how long it usually takes, as a range the learner chose, or how a start date is agreed',
      'how the client takes the next step',
      'no price unless the learner has decided their own, and then what the price covers',
    ],
    targetWords: { min: 80, max: 180 },
    criteria: ['clarity', 'completeness', 'relevance', 'integrity', 'actionability', 'structure'],
    difficulty: 'gentle',
  },
  {
    id: 'prof-honest-experience-entry',
    kind: 'message',
    title: 'Rewrite an experience entry honestly',
    situation:
      "Mika is a fictional person who wants to start freelancing as a customer support agent for online shops. She wrote an entry for her profile that claims much more than she did, and she asked you to help her fix it. Here are her real facts. She worked 14 months as an employee on the chat and email team of an online phone-accessories store, answering questions about orders and returns. With her team lead's review she wrote 12 help-centre articles. She trained two new agents for a week. She has never freelanced and has no testimonials yet. As a volunteer, she reorganised the FAQ page of a neighbourhood association. Rewrite the entry using only these facts.",
    brief: 'Rewrite Mika\'s entry honestly in 70 to 170 words, using only her real facts, then add one line listing the claims you removed and why.',
    channel: 'message',
    received:
      "Mika's draft: 'Senior Customer Experience Expert | 5+ years. Managed a global support department, raised customer satisfaction by 300% and was trusted by Fortune 500 clients. 100% positive feedback from every client. Proven freelance professional who always delivers. I have never had a complaint and I speak to every customer like a friend. Available to start immediately for any support role, with a guarantee of results.'",
    mustInclude: [
      'only the facts Mika gave: 14 months, chat and email, orders and returns, 12 articles reviewed by her team lead, training two agents, the volunteer FAQ project',
      'her real role described accurately, as an employee and not as a freelancer or manager',
      'the FAQ project labelled as volunteer work',
      'no invented numbers, clients, feedback or guarantees',
      'one honest line about what she is looking for now',
      'a short list of the draft claims removed and the reason for each',
    ],
    targetWords: { min: 70, max: 190 },
    criteria: ['integrity', 'clarity', 'relevance', 'completeness', 'tone'],
    difficulty: 'realistic',
  },
  {
    id: 'prof-gaps-and-references',
    kind: 'roleplay',
    title: 'Answer a client\'s questions about gaps and references',
    setting:
      "Callum, who runs a small property-management firm in Perth, found your profile and likes how clear it is. He has sent you a message asking to talk about a small, ongoing job in your field. Callum is a fictional person. You have no reviews yet, and you do not have formal experience in this exact kind of work, so answer with your real situation and say only what is true.",
    goal: 'Answer Callum\'s worries about missing reviews, experience and references honestly, and offer a safe, small way for him to see your work.',
    partner: {
      role: 'client',
      name: 'Callum',
      title: 'Owner of a small property-management firm in Perth, wary after a freelancer once disappeared mid-project',
      personality:
        'Polite, direct and careful with money. Asks fair, pointed questions and writes things down. Does not raise his voice. Respects a straight answer and is quick to notice when something is vague or does not add up.',
      private:
        "Callum liked the profile and wants to hire someone, but a freelancer once stopped replying halfway through a job and he lost two weeks. He is not looking to reject the learner. He is looking to lower his risk. He will ask three things: why there are no reviews, whether the learner has done something like this before, and whether he can call someone who can speak about their work. He would be satisfied by an honest answer, real samples, a clear and small first step (for example a short, paid first task with a clear end) and a way to reach the learner. He would be happy with a former employer, teacher or volunteer coordinator as a reference only if the learner says they have agreed to it. He grows suspicious if the learner offers vague people he cannot contact, says 'trust me', over-explains, gets defensive, blames others, or suddenly claims experience the profile did not mention. He cannot pay for a large test project and will say so, but he is open to a small paid first task. He never asks the learner to lie.",
      reactions: {
        good: "When the learner answers plainly ('I do not have reviews yet because this would be my first client job'), points to real samples or volunteer work and labels them, offers a small first step with a clear scope, and explains how he can check the work, he relaxes, thanks them for the straight answer and starts discussing the first task. If the learner names a reference who has agreed, he asks how to reach them.",
        poor: "When the learner dodges, claims experience that the profile does not show, offers a reference who cannot be contacted or who has not agreed, gets defensive or asks him to just trust them, he repeats his question more slowly, then says he will think about it and the conversation cools.",
      },
    },
    opening: "Hi, thanks for replying. I like your profile, it's clear. But I notice you have no reviews yet, and I don't see work like this in your experience. Why is that, and is there anyone I could call who can speak about your work?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['integrity', 'clarity', 'professionalism', 'problem-solving', 'listening'],
    strongSigns: [
      'Answers the question about reviews and experience directly and calmly, with no spin',
      'Points to real, labelled proof: a sample, a volunteer project, a course project or a job in another field with skills that transfer',
      'Names a reference only if the person has agreed, and says what that person can speak about',
      'Offers a small, bounded first step that lowers Callum\'s risk, and says how he can check the work as it goes',
      'Listens to Callum\'s worry about a freelancer disappearing and speaks to it, for example with a plan for updates',
      'Does not get defensive, and does not promise results or guarantees',
    ],
    traps: [
      'Invents past clients, reviews or experience to fill the gap',
      'Offers a reference who has not agreed, or a vague one nobody can reach',
      'Gets defensive or says that Callum should simply trust them',
      'Over-explains and apologises until the answer is unclear',
      'Promises guaranteed results or says the first job will be free without being asked',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'prof-onlinejobs-profile',
    kind: 'message',
    title: 'Write an OnlineJobs-style profile',
    situation:
      "You are writing the profile text for a local-market job board, a kind of place where employers often look for a person to join their team for ongoing work and read profiles to judge reliability, hours and fit. Use your own real skills, tools and experience. The fictional employer post below shows what such a reader might ask for. Write the profile as you would for your own real situation, not as a reply to this one post.",
    brief: 'Write the profile text for your own listing in 100 to 200 words: what you do, the tools you really use, your working hours and time zone overlap, your honest experience and what kind of role you are looking for.',
    channel: 'message',
    received:
      "A fictional job post by Priyanka, who runs a small bookkeeping office in Vancouver: 'Looking for a remote assistant for ongoing work. Tasks: client emails, scheduling and filing documents. Please tell me which tools you already use, what your usual working hours are, and how many hours each day overlap with Pacific time. I need someone dependable who tells me when something is unclear instead of guessing. English must be clear in writing. Please do not include your home address or ID numbers in your profile. I will ask for what I need later, if we both decide to go on.'",
    mustInclude: [
      'what the learner does and the kind of employer or team they help',
      'working hours and the time zone overlap the learner can offer, stated plainly',
      'only tools the learner has actually used',
      'honest experience, with sample or volunteer work labelled as such',
      'no private data (home address, ID numbers, bank details) in the text',
      'a clear line about the kind of role the learner is looking for',
    ],
    targetWords: { min: 100, max: 210 },
    criteria: ['clarity', 'relevance', 'integrity', 'professionalism', 'completeness', 'structure'],
    difficulty: 'realistic',
  },
];
