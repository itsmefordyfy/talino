import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * AI Automation for Business and Everyday Work (owner's brief, 2026-11-18). A practical beginner course in using AI and no-code automation tools to take
 * repetitive work off a person's plate: emails, meeting notes, documents, spreadsheets, reports, marketing, sales follow-up, customer support, small-business
 * operations, AI agents, and doing all of it safely. No programming. Eleven modules, 83 lessons: ten teaching modules (77 lessons), then a final module of a
 * five-part, 25-question assessment and the final project. The brief's 5 to 7 hours cannot hold 77 lessons under Talino's 10-minute lesson floor (see the spec).
 * Design: docs/superpowers/specs/2026-11-18-ai-automation-course-design.md; writer brief: docs/content/AI_AUTOMATION_BRIEF.md.
 */
export const AI_AUTOMATION_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'introduction-to-ai-automation',
    title: 'Introduction to AI Automation',
    summary: 'Say what automation and AI automation are, tell rules from AI judgment, and find the repetitive work in your own day that is worth automating.',
    topics: [
      'What Is Automation?',
      'What Is AI Automation?',
      'AI vs. Traditional Automation',
      'How AI Changes the Way We Work',
      'Common Tasks That Can Be Automated',
      'Understanding No-Code and Low-Code Automation',
      'Identifying Automation Opportunities',
    ],
  },
  {
    slug: 'understanding-ai-automation-tools',
    title: 'Understanding AI Automation Tools',
    summary: 'Meet the AI assistants and the automation platforms, learn triggers, actions and conditions, and choose a tool for the job without being tied to one brand.',
    topics: [
      'Introduction to AI Assistants',
      'Understanding ChatGPT and Claude for Productivity',
      'Introduction to Zapier',
      'Introduction to Make',
      'Understanding n8n',
      'Understanding Triggers, Actions, and Conditions',
      'Connecting Different Applications',
      'Choosing the Right Automation Platform',
    ],
  },
  {
    slug: 'ai-powered-personal-productivity',
    title: 'AI-Powered Personal Productivity',
    summary: 'Automate your own day: email replies, meeting notes, scheduling, research, a personal assistant and your tasks and reminders, with you approving the results.',
    topics: [
      'Automating Daily Tasks With AI',
      'AI-Powered Email Writing and Responses',
      'Automating Meeting Notes and Summaries',
      'AI-Powered Calendar and Scheduling Workflows',
      'Automating Research and Information Gathering',
      'Creating Personal Productivity Assistants',
      'Organizing Tasks and Reminders With AI',
    ],
  },
  {
    slug: 'documents-spreadsheets-and-reports',
    title: 'Automating Documents, Spreadsheets, and Reports',
    summary: 'Turn documents, spreadsheets, invoices and forms into reports and records with AI and automation, and flag what is missing or suspicious.',
    topics: [
      'Automating Document Creation',
      'Generating Reports Using AI',
      'AI-Powered Spreadsheet Analysis',
      'Automating Data Entry and Extraction',
      'Processing Documents With AI',
      'Extracting Information From PDFs and Forms',
      'Building Automated Reporting Workflows',
    ],
  },
  {
    slug: 'marketing-and-sales',
    title: 'AI Automation for Marketing and Sales',
    summary: 'Create content, collect and qualify leads, follow up and keep a simple customer record, with automation doing the routine and a person owning every promise.',
    topics: [
      'AI-Powered Content Creation',
      'Automating Social Media Content Workflows',
      'Generating Marketing Ideas and Campaigns',
      'Automating Lead Collection',
      'AI-Powered Lead Qualification',
      'Automating Follow-Up Emails',
      'Customer Relationship Management Automation',
      'Building an Automated Sales Workflow',
    ],
  },
  {
    slug: 'customer-support',
    title: 'AI Automation for Customer Support',
    summary: 'Understand how support chatbots work, build an FAQ system, sort messages, draft replies, hand hard cases to a person and measure whether it helps.',
    topics: [
      'Introduction to AI Customer Support',
      'How AI Chatbots Work',
      'Creating Automated FAQ Systems',
      'AI-Powered Customer Message Classification',
      'Automated Customer Response Workflows',
      'Escalating Complex Requests to Human Agents',
      'Building a Customer Support Assistant',
      'Measuring Customer Support Automation Performance',
    ],
  },
  {
    slug: 'ai-agents-and-intelligent-automation',
    title: 'Understanding AI Agents and Intelligent Automation',
    summary: 'See what an AI agent is, how it uses tools and memory across several steps, where a person must approve, and what is realistic about autonomous workflows.',
    topics: [
      'What Are AI Agents?',
      'AI Assistants vs. AI Agents',
      'How AI Agents Use Tools',
      'Understanding Tool Calling and Function Calling',
      'Multi-Step AI Workflows',
      'Understanding Agent Memory and Context',
      'Human Approval and AI Agent Control',
      'The Future of Autonomous AI Workflows',
    ],
  },
  {
    slug: 'building-your-first-ai-workflow',
    title: 'Building Your First AI Automation Workflow',
    summary: 'Design, connect, test and watch a complete customer-inquiry workflow, from the form to the approved reply, on any automation platform you can reach.',
    topics: [
      'Understanding Workflow Architecture',
      'Triggers, Actions, Conditions, and Filters',
      'Connecting AI Models to Automation Platforms',
      'Sending Data Between Applications',
      'Working With APIs Without Advanced Programming',
      'Handling Errors and Failed Workflows',
      'Testing and Improving Automations',
      'Monitoring Automation Performance',
    ],
  },
  {
    slug: 'ai-automation-for-small-businesses',
    title: 'AI Automation for Small Businesses',
    summary: 'Pick the right processes in a shop, restaurant, clinic or freelance practice, automate orders, inquiries, reports and bookings, and work out whether it pays.',
    topics: [
      'Identifying Business Processes to Automate',
      'Automating Inventory and Order Tracking',
      'AI for Customer Relationship Management',
      'Automating Business Inquiries',
      'AI-Powered Business Reporting',
      'Automating Appointment and Booking Management',
      'AI for Small Retail and Service Businesses',
      'Calculating Automation ROI',
    ],
  },
  {
    slug: 'responsible-and-secure-automation',
    title: 'Responsible and Secure AI Automation',
    summary: 'Protect customer data, keys and accounts, expect AI mistakes, keep a person in the loop for high-impact actions and keep logs you can audit.',
    topics: [
      'Understanding Data Privacy in AI Automation',
      'Protecting Customer Information',
      'API Keys and Account Security',
      'Preventing Unauthorized Automation',
      'AI Errors and Incorrect Responses',
      'Human-in-the-Loop Workflows',
      'Understanding Automation Risks',
      'Responsible AI Implementation',
    ],
  },
  {
    slug: 'final-assessment-and-automation-project',
    title: 'Final Assessment and Practical Automation Project',
    summary: 'Show what you know in a 25-question assessment, then design and document an AI-powered workflow for a real problem of your own.',
    topics: [
      'Final Assessment, Part 1: Automation Foundations and Tools',
      'Final Assessment, Part 2: Productivity, Documents and Reports',
      'Final Assessment, Part 3: Marketing, Sales and Customer Support',
      'Final Assessment, Part 4: AI Agents, Workflows and Small Business',
      'Final Assessment, Part 5: Responsible and Secure Automation',
      'Final Project: Build an AI-Powered Business Workflow',
    ],
  },
];

export const SYLLABUS_AI_AUTOMATION: readonly SyllabusEntry[] = [
  {
    id: 'ai-automation-business',
    title: 'AI Automation for Business and Everyday Work',
    level: 'beginner',
    category: 'careers',
    prerequisites: ['ai-fundamentals-everyone', 'how-llms-work'],
    technologies: ['llm', 'chatgpt', 'claude', 'gemini', 'ai-agents'],
    goals: ['get-job', 'freelance'],
    tags: ['ai automation', 'automation', 'no-code', 'low-code', 'workflow', 'zapier', 'make', 'n8n', 'integromat', 'chatgpt', 'claude', 'ai agents', 'email automation', 'invoice processing', 'customer support', 'chatbot', 'lead qualification', 'crm', 'spreadsheet', 'google workspace', 'microsoft 365', 'productivity', 'small business', 'virtual assistant', 'roi', 'human in the loop', 'api keys', 'privacy', 'business automation'],
    // Product names appear, but the course teaches workflow thinking, not button tours, plans or prices; every tool fact is general and sent to the tool's own page.
    volatile: false,
    scope: 'The practical application of AI to work: finding repetitive tasks, building no-code workflows (trigger, AI step, action, human approval) for email, meetings, documents, spreadsheets, reports, marketing, sales, customer support and small-business operations, understanding AI agents at a conceptual level, and running all of it safely. It sits after AI Fundamentals for Everyone (what AI is) and How Large Language Models Work (how the models behave) and before any advanced agent-development course. It does not teach programming, model internals, prompt engineering in depth (Generative AI: From Fundamentals to Real-World Applications) or building agents in code (AI Agents and Agentic Coding); it does not repeat the five-lesson AI Automation with No-Code Tools mini-course (it is the deep version of it), Time Management and Productivity (planning and focus, not workflows) or the Freelancer courses’ pricing and proposals. It states no tool price, plan limit or feature list.',
    modules: AI_AUTOMATION_MODULES,
    topics: AI_AUTOMATION_MODULES.flatMap((module) => module.topics),
  },
];
