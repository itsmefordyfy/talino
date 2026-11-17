import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * Soft Skills for the Modern Workplace (owner's brief, 2026-11-17). A beginner course in the skills that make every career work:
 * communication, teamwork, thinking, time, emotions, speaking, adapting, professionalism, clients and career readiness. It is
 * practised with AI (role-play with a simulated coworker, client or interviewer; a message coach) and graded on what the learner
 * does, never on memorising definitions. Ten modules, 54 lessons (the brief asks for 4 to 7 per module). Design:
 * docs/superpowers/specs/2026-11-17-soft-skills-course-design.md; writer brief: docs/content/SOFT_SKILLS_BRIEF.md.
 */
export const SOFT_SKILLS_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'communication-skills',
    title: 'Communication Skills',
    summary: 'Write clearly, explain simply, listen well and hold professional conversations with coworkers and clients.',
    topics: [
      'Why Communication Is the Skill Behind Every Other Skill',
      'Writing Clear, Professional Emails and Messages',
      'Explaining Technical Ideas in Plain Language',
      'Listening, Asking Questions and Confirming Understanding',
      'Communicating Over Chat, Calls and Video',
      'Practice: Conversations with a Coworker and a Client',
    ],
  },
  {
    slug: 'teamwork-and-collaboration',
    title: 'Teamwork and Collaboration',
    summary: 'Share work fairly, give and take feedback, handle disagreement and work well with people you rarely see.',
    topics: [
      'How Healthy Teams Work: Roles, Trust and Shared Goals',
      'Dividing Work and Organizing Responsibilities',
      'Giving and Receiving Constructive Feedback',
      'Handling Disagreement Inside a Team',
      'Remote and Asynchronous Collaboration',
    ],
  },
  {
    slug: 'critical-thinking-and-problem-solving',
    title: 'Critical Thinking and Problem Solving',
    summary: 'Define the real problem, separate facts from assumptions, compare solutions and verify what AI tells you.',
    topics: [
      'Defining the Real Problem',
      'Facts, Assumptions and Opinions',
      'Generating and Comparing Solutions',
      'Deciding Under Uncertainty and Explaining Your Decision',
      'Verifying AI Recommendations Instead of Accepting Them',
      'Practice: Solving a Workplace Problem from Start to Finish',
    ],
  },
  {
    slug: 'time-management-and-productivity',
    title: 'Time Management and Productivity',
    summary: 'Plan a realistic week, prioritize, break big work into steps and handle deadlines honestly.',
    topics: [
      'Where Your Time Goes: Capacity, Focus and Energy',
      'Prioritizing: Urgent, Important and Everything Else',
      'Breaking Large Projects into Manageable Work',
      'Estimating, Deadlines and Saying No Clearly',
      'Building a Realistic Weekly Schedule with AI',
    ],
  },
  {
    slug: 'emotional-intelligence',
    title: 'Emotional Intelligence',
    summary: 'Notice your own feelings, understand other people’s, and stay professional in hard moments.',
    topics: [
      'Noticing Your Own Emotions at Work',
      'Empathy and Seeing Other Perspectives',
      'Staying Professional Under Stress and Frustration',
      'Having Difficult Conversations',
      'Resolving Conflict and Repairing Trust',
    ],
  },
  {
    slug: 'presentation-and-public-speaking',
    title: 'Presentation and Public Speaking',
    summary: 'Structure what you say, introduce yourself, support it visually, answer questions and practise out loud.',
    topics: [
      'Structuring a Message for an Audience',
      'Introducing Yourself and Your Work',
      'Slides, Demos and Visual Support',
      'Delivering Well and Answering Audience Questions',
      'Practising Out Loud: Rehearsal and Honest Feedback',
    ],
  },
  {
    slug: 'adaptability-and-growth-mindset',
    title: 'Adaptability and Growth Mindset',
    summary: 'Stay steady when plans change, turn criticism into action and keep learning on purpose.',
    topics: [
      'Changes at Work: Staying Steady When Plans Shift',
      'Growth Mindset in Practice',
      'Receiving Criticism and Turning It into Action',
      'Building a Learning and Improvement Plan',
      'Learning With AI Without Losing Your Own Judgment',
    ],
  },
  {
    slug: 'professionalism-and-workplace-ethics',
    title: 'Professionalism and Workplace Ethics',
    summary: 'Be reliable, own your mistakes, protect confidential information and use AI-generated content responsibly.',
    topics: [
      'What Professionalism Really Means',
      'Reliability, Accountability and Owning Mistakes',
      'Confidentiality and Handling Information',
      'Integrity: Ethical Dilemmas at Work',
      'Responsible Use of AI-Generated Content at Work',
    ],
  },
  {
    slug: 'client-management-and-professional-relationships',
    title: 'Client Management and Professional Relationships',
    summary: 'Understand what clients need, set expectations, report progress and handle delays, complaints and changes.',
    topics: [
      'Understanding What Clients Actually Need',
      'Setting Expectations: Scope, Timeline and Price Conversations',
      'Professional Project Updates and Reports',
      'Handling Delays, Complaints and Bad News',
      'Managing Changing Requirements and Scope Creep',
      'Negotiating Fairly and Keeping Relationships Healthy',
    ],
  },
  {
    slug: 'career-readiness-and-personal-branding',
    title: 'Career Readiness and Personal Branding',
    summary: 'Name your strengths, introduce yourself, show evidence in a résumé and portfolio, interview well and plan your next steps.',
    topics: [
      'Knowing and Naming Your Strengths',
      'Your Professional Introduction',
      'Résumé and Portfolio That Show Evidence',
      'Interviewing: Preparing and Practising',
      'Networking and Your Professional Presence Online',
      'Your Career Development Plan',
    ],
  },
];

export const SYLLABUS_SOFT_SKILLS: readonly SyllabusEntry[] = [
  {
    id: 'soft-skills-workplace',
    title: 'Soft Skills for the Modern Workplace',
    level: 'beginner',
    category: 'careers',
    prerequisites: [],
    technologies: ['llm', 'chatgpt', 'claude'],
    // Not 'teach' or 'learn-ai-dev': a soft skills course must never be the recommended starting course for those goals (the plan rules rank by goal).
    goals: ['get-job', 'freelance'],
    tags: ['soft skills', 'communication', 'teamwork', 'critical thinking', 'time management', 'emotional intelligence', 'public speaking', 'presentation', 'professionalism', 'ethics', 'client management', 'interview', 'career', 'personal branding', 'role-play', 'feedback'],
    volatile: false,
    scope: 'The human skills of working: communication, teamwork, thinking, time, emotions, speaking, adapting, professionalism, clients and career readiness, practised with AI role-play and a message coach. It does not repeat the Freelance course’s proposals and pricing, the Developer career course’s job search or the Mock interview feature’s tech questions; it points to them.',
    modules: SOFT_SKILLS_MODULES,
    topics: SOFT_SKILLS_MODULES.flatMap((module) => module.topics),
  },
];
