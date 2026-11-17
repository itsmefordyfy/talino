import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * Finding International Clients: From Zero to Your First Global Client (owner's brief, 2026-11-17). A beginner course that takes a freelancer from
 * "I have skills" to a signed first client abroad: market, niche, where clients are, portfolio, profile, outreach, proposals, communication, discovery
 * calls and negotiation, contract and onboarding. It is practised with the practice engine (role-play with a simulated client, a message coach) and
 * it never invents opportunities. Ten modules, 52 lessons, three projects. Design: docs/superpowers/specs/2026-11-17-international-clients-course-design.md;
 * writer brief: docs/content/INTERNATIONAL_CLIENTS_BRIEF.md.
 */
export const INTERNATIONAL_CLIENTS_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'international-freelance-market',
    title: 'Understanding the International Freelance Market',
    summary: 'See how clients abroad hire, what they expect in different markets and which services they pay for.',
    topics: [
      'How International Clients Find and Hire Remote Freelancers',
      'The US, UK, Australian and Canadian Markets: What Clients Expect',
      'Freelancing, Contracting and Remote Employment Compared',
      'In-Demand Services and What Clients Actually Pay For',
      'Researching Market Demand with AI and Checking What It Tells You',
    ],
  },
  {
    slug: 'niche-and-ideal-clients',
    title: 'Finding Your Niche and Ideal Clients',
    summary: 'Turn your skills into a clear service for a specific kind of client and say why you are the right choice.',
    topics: [
      'Taking Inventory of Your Skills, Strengths and Proof',
      'Turning Skills into Services a Client Would Buy',
      'Choosing a Niche and Defining Your Ideal Client',
      'Understanding a Client’s Industry and Business Problems',
      'Your Value Proposition and Competitive Positioning',
    ],
  },
  {
    slug: 'where-to-find-clients',
    title: 'Where to Find International Clients',
    summary: 'Use marketplaces, job boards, LinkedIn and direct outreach, organize what you find and avoid scams.',
    topics: [
      'Upwork, Fiverr and Freelancer.com: How the Marketplaces Work',
      'OnlineJobs.ph and Remote Job Boards',
      'LinkedIn, Professional Communities and Company Websites',
      'Building a Client Research Workflow',
      'Evaluating a Job Listing: Fit, Budget and Decision-Makers',
      'Spotting Scams and Suspicious Offers',
    ],
  },
  {
    slug: 'portfolio-for-international-clients',
    title: 'Building a Portfolio That Attracts International Clients',
    summary: 'Choose your best work, write case studies that show business value and build a portfolio honestly, even with no clients yet.',
    topics: [
      'What International Clients Look for in a Portfolio',
      'Choosing and Preparing Your Best Work',
      'Writing a Case Study That Shows Business Value',
      'Building a Portfolio When You Have No Previous Clients',
      'Your Portfolio Website and Presenting Work Honestly',
    ],
  },
  {
    slug: 'freelance-profile',
    title: 'Creating a Professional International Freelance Profile',
    summary: 'Write a headline, overview, service packages and proof that make a client trust you on Upwork, LinkedIn and OnlineJobs.ph.',
    topics: [
      'Headlines and Introductions That Say What You Do and for Whom',
      'Writing Your Overview and Highlighting Skills',
      'Defining Service Offerings and Packages',
      'Experience, Testimonials and References, Presented Honestly',
      'Optimizing Your Profile for Upwork, LinkedIn and OnlineJobs.ph',
    ],
  },
  {
    slug: 'finding-and-approaching-clients',
    title: 'Finding and Approaching Potential Clients',
    summary: 'Research prospects from facts you can verify, find the right person and write outreach that respects their time.',
    topics: [
      'Cold Outreach Fundamentals: Permission, Relevance and Respect',
      'Researching a Prospect: Facts You Can Verify',
      'Finding the Right Person to Contact',
      'Writing Personalized Emails and LinkedIn Messages',
      'Follow-Ups, Avoiding Spam and Building Relationships',
    ],
  },
  {
    slug: 'proposals-and-applications',
    title: 'Writing Winning Proposals and Applications',
    summary: 'Read a job post for the real problem and answer it with a specific, honest proposal instead of a template.',
    topics: [
      'Reading a Job Description: Requirements, Problems and Hidden Needs',
      'The Anatomy of a Proposal That Gets Read',
      'Presenting Relevant Experience and a Proposed Solution',
      'Deliverables, Timelines and Price in a Proposal',
      'Personalizing Fast Without Sending Generic Proposals',
    ],
  },
  {
    slug: 'communicating-with-international-clients',
    title: 'Communicating with International Clients',
    summary: 'Write and speak clearly across cultures and time zones, run meetings, send useful updates and handle hard moments.',
    topics: [
      'Professional English for Client Communication',
      'International Business Etiquette and Time Zones',
      'Online Meetings and Explaining Technical Concepts Simply',
      'Project Updates Clients Actually Read',
      'Difficult Conversations: Delays, Mistakes and Scope Creep',
    ],
  },
  {
    slug: 'discovery-negotiation-closing',
    title: 'Discovery Calls, Negotiation and Closing Deals',
    summary: 'Prepare for a call, ask questions that uncover the need, talk about money and agree a scope you can deliver.',
    topics: [
      'Preparing for a Discovery Call',
      'Asking Questions That Uncover the Real Need',
      'Presenting Your Service and Discussing Budget',
      'Negotiating Rates and Handling Objections',
      'Agreeing on Scope and Closing the Deal',
    ],
  },
  {
    slug: 'first-client-and-long-term',
    title: 'Securing Your First Client and Building Long-Term Relationships',
    summary: 'Turn a yes into an agreement, get paid, onboard well, deliver and keep the client.',
    topics: [
      'Proposals, Agreements and What a Contract Contains',
      'Payment Terms, Milestones and Invoicing',
      'International Payment Methods and Fees',
      'Onboarding a New Client',
      'Delivering Quality Work, Testimonials and Referrals',
      'Your Client-Winning Prompt Playbook',
    ],
  },
];

export const SYLLABUS_INTERNATIONAL_CLIENTS: readonly SyllabusEntry[] = [
  {
    id: 'international-clients',
    title: 'Finding International Clients: From Zero to Your First Global Client',
    level: 'beginner',
    category: 'careers',
    prerequisites: [],
    // The course uses AI assistants as a coach, but is not about LLMs: no 'llm' tag, so it does not crowd the AI-engineering recommendations.
    technologies: ['chatgpt', 'claude'],
    // Only 'freelance': a course about winning clients abroad must not become the recommended starting course for other goals (the plan rules rank by goal).
    goals: ['freelance'],
    tags: ['freelance', 'international clients', 'upwork', 'fiverr', 'linkedin', 'onlinejobs', 'proposals', 'cold outreach', 'niche', 'portfolio', 'profile', 'discovery call', 'negotiation', 'contracts', 'invoicing', 'onboarding', 'remote work', 'filipino freelancers', 'virtual assistant', 'client acquisition'],
    // The course teaches method and judgment, not platform rules: it never states fees, policies or prices, and sends the learner to each platform's own current pages.
    volatile: false,
    scope: 'Winning a first international client, from market and niche to profile, outreach, proposal, call, negotiation, contract and onboarding, practised with AI role-play and a message coach. It does not repeat Freelancer & VA with AI’s tools, pricing models, scams, taxes and delivery lessons, the Soft Skills course’s general communication, or Freelancing with AI Development’s scoping and contracts for software work; it points to them.',
    modules: INTERNATIONAL_CLIENTS_MODULES,
    topics: INTERNATIONAL_CLIENTS_MODULES.flatMap((module) => module.topics),
  },
];
