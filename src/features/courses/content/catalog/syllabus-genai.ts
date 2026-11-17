import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * Generative AI: From Fundamentals to Real-World Applications (owner's brief, 2026-11-17). A course for the people who *use* generative AI
 * (students, freelancers, VAs, educators, entrepreneurs, professionals), taught from how it works to building with it, practised with live
 * prompt labs, a workflow builder and four guided projects. Twelve modules, 67 lessons (the brief asks for 4 to 7 per module). Design:
 * docs/superpowers/specs/2026-11-17-generative-ai-course-design.md; writer brief: docs/content/GENAI_BRIEF.md.
 */
export const GENAI_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'introduction-to-generative-ai',
    title: 'Introduction to Generative AI',
    summary: 'See what generative AI is, how it differs from the AI you already use, what it is good and bad at, and how to start using it well.',
    topics: [
      'AI, Machine Learning, Deep Learning and Generative AI',
      'What Generative AI Can and Cannot Do',
      'The Tool Landscape: Choosing by Use Case, Not by Brand',
      'Your First Productive Conversations with an AI Assistant',
      'Setting Up Your AI Workspace and Habits',
    ],
  },
  {
    slug: 'how-generative-ai-works',
    title: 'How Generative AI Works',
    summary: 'Understand neural networks, language models, tokens, context windows and training in plain words, and why models sometimes make things up.',
    topics: [
      'Neural Networks in Plain Words',
      'Training and Inference: How a Model Learns and How It Answers',
      'Large Language Models and Predicting the Next Token',
      'Tokens and Tokenization',
      'Context Windows: What a Model Can Hold in Mind',
      'Hallucinations and the Limits of Models',
    ],
  },
  {
    slug: 'prompt-engineering',
    title: 'Prompt Engineering and AI Communication',
    summary: 'Write prompts that get reliable results: clear, specific, structured, tested and improved on purpose.',
    topics: [
      'Writing Clear and Specific Prompts',
      'Context, Role, Task and Constraints',
      'Zero-Shot and Few-Shot Prompting',
      'Asking for Structured Output',
      'Multi-Step Prompting and Prompt Chains',
      'Refining a Prompt: The Improvement Loop',
      'Evaluating Prompts with Test Cases',
    ],
  },
  {
    slug: 'image-generation',
    title: 'AI Image Generation and Visual Creativity',
    summary: 'Learn how image models turn words into pictures, how to direct them, and how to keep a creative process under your control.',
    topics: [
      'How Text-to-Image Models Work',
      'Writing Image Prompts: Subject, Style, Composition and Light',
      'Image-to-Image: Editing, Variations and Reference Images',
      'Consistency and Creative Workflows for Visual Work',
      'Quality, Limits and Checking What the Model Made',
    ],
  },
  {
    slug: 'video-and-audio',
    title: 'AI Video and Audio Generation',
    summary: 'Use speech, sound, music and video generation as parts of a production workflow, and know what each can and cannot do.',
    topics: [
      'Text-to-Speech: Voices, Pacing and Pronunciation',
      'Speech-to-Text: Transcription and Checking Its Accuracy',
      'AI-Generated Music and Sound',
      'Text-to-Video and Image-to-Video',
      'A Creative Production Workflow from Script to Final Cut',
    ],
  },
  {
    slug: 'multimodal-ai',
    title: 'Multimodal AI',
    summary: 'Work with models that understand images, documents, audio and video, alone and together.',
    topics: [
      'What Multimodal Means and Why It Matters',
      'Image Understanding: Describing, Reading and Questioning Pictures',
      'Document and PDF Analysis',
      'Audio and Video Understanding',
      'Combining Inputs: Real-World Multimodal Use Cases',
    ],
  },
  {
    slug: 'rag-and-knowledge-systems',
    title: 'RAG and AI Knowledge Systems',
    summary: 'Give a model your own knowledge: embeddings, chunking, retrieval and grounded answers you can trace to a source.',
    topics: [
      'Why Models Need Your Knowledge: The Case for Grounding',
      'Embeddings and Semantic Search',
      'Document Processing: Cleaning and Chunking',
      'Vector Databases and Retrieval Pipelines',
      'Grounded Answers, Citations and Evaluating Retrieval',
      'Building a Document-Based Assistant',
    ],
  },
  {
    slug: 'ai-agents-and-automation',
    title: 'AI Agents and Intelligent Automation',
    summary: 'Go from an assistant that talks to an agent that acts: tools, plans, memory, teams of agents and the human who stays in charge.',
    topics: [
      'AI Assistants versus AI Agents',
      'Tool Use and Function Calling',
      'Agent Workflows: Planning, Acting and Checking',
      'Memory and Context in Agents',
      'Multi-Agent Systems',
      'Human Approval and Oversight',
    ],
  },
  {
    slug: 'business-and-productivity',
    title: 'Generative AI for Business and Productivity',
    summary: 'Apply generative AI to real work: writing, research, support, marketing and automation, and measure whether it is worth it.',
    topics: [
      'Writing, Research and Analysis with AI',
      'Customer Support and Operations',
      'Marketing and Content at Scale, Without Losing Your Voice',
      'Designing AI-Powered Workflows',
      'Measuring Value: Time, Quality, Cost and Risk',
    ],
  },
  {
    slug: 'building-ai-applications',
    title: 'Building Applications with Generative AI',
    summary: 'See how an AI feature is built: APIs, keys, structured output, errors, cost and latency, with optional code for those who want it.',
    topics: [
      'The Anatomy of an AI Application',
      'Model APIs: Requests and Responses',
      'API Keys and Secrets: Keeping Them Safe',
      'Structured Outputs and Validating What a Model Returns',
      'Errors, Usage Limits, Cost and Latency',
      'Building a Practical AI Feature from Idea to Working Prototype',
    ],
  },
  {
    slug: 'responsible-ai',
    title: 'Responsible AI, Ethics and Security',
    summary: 'Use AI honestly and safely: verify outputs, spot bias, protect private data, respect rights, handle synthetic media and defend against misuse.',
    topics: [
      'Verifying AI Outputs Before You Rely on Them',
      'Bias and Fairness in AI Systems',
      'Privacy and Sensitive Data',
      'Copyright, Ownership and Attribution',
      'Deepfakes, Synthetic Media and Disclosure',
      'AI Security: Prompt Injection, Leaked Keys and a Personal Use Policy',
    ],
  },
  {
    slug: 'real-world-and-future',
    title: 'Generative AI in the Real World and the Future',
    summary: 'Look at how AI is used across fields, judge new tools with a method that outlasts them, and plan what you will build and learn next.',
    topics: [
      'Case Studies: Generative AI Across Industries',
      'Your Work and AI: Roles, Skills and Judgment',
      'Evaluating New Models and Tools with a Method That Lasts',
      'Staying Current Without Chasing Every Headline',
      'Your AI Roadmap: Capstone Planning',
    ],
  },
];

export const SYLLABUS_GENAI: readonly SyllabusEntry[] = [
  {
    id: 'generative-ai-applications',
    title: 'Generative AI: From Fundamentals to Real-World Applications',
    level: 'beginner',
    category: 'ai-coding-fundamentals',
    prerequisites: [],
    technologies: ['llm', 'chatgpt', 'gemini', 'claude', 'rag', 'ai-agents', 'vector-db'],
    goals: ['learn-ai-dev', 'freelance'],
    tags: ['generative ai', 'genai', 'prompt engineering', 'prompting', 'llm', 'image generation', 'text to image', 'text to speech', 'speech to text', 'video generation', 'multimodal', 'rag', 'embeddings', 'vector database', 'agents', 'function calling', 'automation', 'ai api', 'responsible ai', 'ai ethics', 'hallucination', 'deepfake', 'midjourney', 'runway', 'hugging face', 'prompt playground'],
    volatile: false,
    scope: 'Generative AI for people who use it: how it works, prompting, images, audio and video, multimodal input, RAG, agents, business use, building a small AI feature and using it responsibly, practised with live prompt labs and a workflow builder. It is the concept-first, mostly no-code course: Large Language Models Explained goes deeper on the model, Generative AI for Developers, RAG and Agents go deeper in code, AI Model Integration is production plumbing; this course points to them and does not repeat their lessons. Tool names appear only as examples of a use case, and product facts are kept out of lessons unless a dated, sourced note carries them.',
    modules: GENAI_MODULES,
    topics: GENAI_MODULES.flatMap((module) => module.topics),
  },
];
