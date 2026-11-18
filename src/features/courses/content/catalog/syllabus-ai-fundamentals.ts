import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * AI Fundamentals for Everyone (owner's brief, 2026-11-18). A general AI-literacy course for people with no technical background: students, teachers,
 * business owners, office workers, freelancers and career changers. It explains what AI is, how it works in everyday analogies, what generative AI
 * is, how to use assistants well and safely, and how to think about bias, privacy, copyright, misinformation and the future of work. No code, no maths.
 * Eight modules, 43 lessons: seven teaching modules, then a final module of a four-part assessment (20 questions), a practical challenge, a reflection and
 * course completion. Writer brief: docs/content/AI_FUNDAMENTALS_BRIEF.md.
 */
export const AI_FUNDAMENTALS_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'welcome-to-the-world-of-ai',
    title: 'Welcome to the World of AI',
    summary: 'Say what AI is in plain words, spot it in your own day, see how it is changing the world and clear up the myths.',
    topics: [
      'What Is Artificial Intelligence?',
      'Where Do We Encounter AI Every Day?',
      'How AI Is Changing the World',
      'Common Myths and Misconceptions About AI',
    ],
  },
  {
    slug: 'understanding-how-ai-works',
    title: 'Understanding How AI Works',
    summary: 'See how a computer learns from examples, and what machine learning, deep learning and neural networks mean, through everyday analogies.',
    topics: [
      'How Computers Learn and Make Decisions',
      'What Is Machine Learning?',
      'What Is Deep Learning?',
      'What Are Neural Networks?',
      'Understanding AI Through Everyday Analogies',
    ],
  },
  {
    slug: 'exploring-generative-ai',
    title: 'Exploring Generative AI',
    summary: 'Learn what generative AI is, how it makes text, images, audio and video, what a large language model is and why AI sometimes makes things up.',
    topics: [
      'What Is Generative AI?',
      'How AI Generates Text, Images, Audio, and Videos',
      'Understanding Large Language Models (LLMs)',
      'What Are AI Chatbots and AI Assistants?',
      'Understanding AI Hallucinations and Limitations',
    ],
  },
  {
    slug: 'ai-tools-in-everyday-life',
    title: 'AI Tools in Everyday Life',
    summary: 'Tour the kinds of AI tools people use for productivity, writing, learning, creativity, business and their careers, and when each one helps.',
    topics: [
      'AI for Personal Productivity',
      'AI for Writing and Communication',
      'AI for Learning and Research',
      'AI for Images, Videos, and Creativity',
      'AI for Business and Entrepreneurship',
      'AI for Work and Career Development',
    ],
  },
  {
    slug: 'getting-started-with-ai-tools',
    title: 'Getting Started with AI Tools',
    summary: 'Open an AI assistant, write prompts that work, ask better questions, check what comes back and finish a real task with AI.',
    topics: [
      'Introduction to ChatGPT and Other AI Assistants',
      'How to Write Effective Prompts',
      'Asking Better Questions to AI',
      'Understanding AI Responses and Verifying Information',
      'Hands-on Activity: Complete a Real-World Task Using AI',
    ],
  },
  {
    slug: 'responsible-ai-and-digital-safety',
    title: 'Responsible AI and Digital Safety',
    summary: 'Use AI fairly and safely: bias, privacy, copyright, misinformation and deepfakes, and why people stay responsible for decisions.',
    topics: [
      'What Is Responsible AI?',
      'AI Bias and Fairness',
      'Data Privacy and Security',
      'Copyright, Ownership, and Intellectual Property',
      'Misinformation, Deepfakes, and AI-Generated Content',
      'Human Judgment and AI Decision-Making',
    ],
  },
  {
    slug: 'the-future-of-ai',
    title: 'The Future of AI',
    summary: 'See how AI is changing industries and work, which skills matter, what is promising and what is risky, and how to keep learning.',
    topics: [
      'How AI Is Transforming Different Industries',
      'AI and the Future of Work',
      'Skills Everyone Should Develop in the AI Era',
      'Opportunities and Challenges of AI',
      'How to Continue Learning About AI',
    ],
  },
  {
    slug: 'final-assessment-and-practical-application',
    title: 'Final Assessment and Practical Application',
    summary: 'Show what you know in a 20-question assessment, solve a real problem with AI responsibly, reflect on how you will use AI and complete the course.',
    topics: [
      'Knowledge Assessment, Part 1: AI Foundations',
      'Knowledge Assessment, Part 2: Generative AI and AI Tools',
      'Knowledge Assessment, Part 3: Using AI Well',
      'Knowledge Assessment, Part 4: Responsible AI and the Future',
      'Real-World AI Application Challenge',
      'Final Reflection: How Will You Use AI?',
      'Course Completion',
    ],
  },
];

export const SYLLABUS_AI_FUNDAMENTALS: readonly SyllabusEntry[] = [
  {
    id: 'ai-fundamentals-everyone',
    title: 'AI Fundamentals for Everyone',
    level: 'beginner',
    category: 'ai-coding-fundamentals',
    prerequisites: [],
    technologies: ['llm', 'chatgpt', 'claude'],
    // Not 'teach' or 'learn-ai-dev': the plan ranks the starting course by goal, and this broad literacy course must not displace the Educator or the developer starter.
    goals: ['get-job', 'freelance'],
    tags: ['ai literacy', 'artificial intelligence', 'machine learning', 'deep learning', 'neural networks', 'generative ai', 'large language models', 'chatbot', 'ai assistant', 'prompts', 'hallucinations', 'responsible ai', 'ai bias', 'privacy', 'deepfakes', 'copyright', 'future of work', 'ai for beginners', 'non technical', 'ai tools', 'chatgpt', 'gemini', 'claude', 'ai for business', 'ai for students', 'ai for teachers'],
    // Product names appear, but the course teaches ideas and habits, not button tours, plans or prices; tool facts are kept general and sent to each tool's own page.
    volatile: false,
    scope: 'AI literacy for anyone: what AI, machine learning, deep learning and generative AI are, in everyday analogies; where AI already touches daily life; what the tools can do for personal, school, business and career tasks; how to prompt, question and verify an assistant; and the human side (bias, privacy, copyright, misinformation, judgment, the future of work). No programming and no mathematics. It does not repeat AI Basics for Tech (a short technology-career course on prompting, checking code-and-work output, pasting safely at work and choosing a Talino career path) and it is not the deep version of generative AI: Generative AI: From Fundamentals to Real-World Applications goes far further into tokens, context windows, labs, tools and building. Where a topic is shared, this course gives the everyday-life version and points to those courses by name.',
    modules: AI_FUNDAMENTALS_MODULES,
    topics: AI_FUNDAMENTALS_MODULES.flatMap((module) => module.topics),
  },
];
