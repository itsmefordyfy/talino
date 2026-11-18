import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * How Large Language Models Work (owner's brief, 2026-11-18). The inside of an AI assistant for curious people, technical or not: what an LLM is, how it learns from text, tokens
 * and embeddings, the Transformer and attention, how a reply is generated one token at a time, training and alignment, context windows and their limits, retrieval (RAG),
 * multimodal models, real-world uses and agents, then an assessment. Eleven modules, 77 lessons (the lesson titles are the owner's, copied exactly; module 11 is the review,
 * a five-part 25-question assessment, the practical challenge and the reflection). Design: docs/superpowers/specs/2026-11-18-how-llms-work-course-design.md; writer brief:
 * docs/content/LLM_BRIEF.md.
 */
export const LLM_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'introduction-to-large-language-models',
    title: 'Introduction to Large Language Models',
    summary: 'Say what a large language model is, how it differs from older software and AI, meet the best-known assistants and clear up the common myths.',
    topics: [
      'What Is a Large Language Model?',
      'How LLMs Differ from Traditional AI Systems',
      'Understanding ChatGPT, Claude, Gemini, and Other LLMs',
      'How AI Understands and Generates Human Language',
      'Common Misconceptions About LLMs',
    ],
  },
  {
    slug: 'how-llms-learn-from-data',
    title: 'How LLMs Learn From Data',
    summary: 'Follow the text an LLM learns from, how it is prepared, what happens during training, what parameters and weights are and why more data is not always better.',
    topics: [
      'Where Does LLM Training Data Come From?',
      'Understanding Datasets and Text Corpora',
      'How Data Is Prepared and Processed',
      'What Happens During Model Training?',
      'Understanding Parameters and Model Weights',
      'Why More Data Does Not Automatically Mean Better AI',
    ],
  },
  {
    slug: 'tokens-tokenization-and-embeddings',
    title: 'Tokens, Tokenization, and Embeddings',
    summary: 'See how text is cut into tokens, why that matters, and how words become lists of numbers that capture meaning.',
    topics: [
      'What Are Tokens?',
      'How Text Is Broken Into Tokens',
      'Understanding Tokenization',
      'What Are Embeddings?',
      'How AI Represents Words as Numbers',
      'Understanding Semantic Similarity',
    ],
  },
  {
    slug: 'understanding-transformer-architecture',
    title: 'Understanding Transformer Architecture',
    summary: 'Understand the Transformer step by step: self-attention, query, key and value, word order and how the layers work together, with pictures and no advanced maths.',
    topics: [
      'What Is a Transformer?',
      'Why Transformers Changed Artificial Intelligence',
      'Understanding Self-Attention',
      'How Attention Helps Models Understand Context',
      'Understanding Query, Key, and Value',
      'Positional Encoding and Word Order',
      'How Transformer Layers Work Together',
    ],
  },
  {
    slug: 'how-llms-generate-responses',
    title: 'How LLMs Generate Responses',
    summary: 'Watch a reply being built one token at a time, and see how temperature, top-k and top-p change it and why the same prompt can give different answers.',
    topics: [
      'How an LLM Predicts the Next Token',
      'Understanding Next-Token Prediction',
      'How Responses Are Generated Step by Step',
      'Temperature and Randomness',
      'Top-K and Top-P Sampling',
      'Why the Same Prompt Can Produce Different Answers',
      'Understanding Model Inference',
    ],
  },
  {
    slug: 'training-fine-tuning-and-alignment',
    title: 'Training, Fine-Tuning, and Alignment',
    summary: 'Learn how a raw language model becomes a helpful assistant: pretraining, fine-tuning, instruction tuning, human feedback, preference optimization and evaluation.',
    topics: [
      'Pretraining Explained',
      'What Is Fine-Tuning?',
      'Supervised Fine-Tuning',
      'Instruction Tuning',
      'Reinforcement Learning From Human Feedback (RLHF)',
      'Direct Preference Optimization (DPO)',
      'How AI Models Become Better Assistants',
      'Understanding Model Evaluation',
    ],
  },
  {
    slug: 'context-windows-memory-and-limitations',
    title: 'Context Windows, Memory, and Limitations',
    summary: 'Understand what a model can hold in view, why it forgets, why it makes things up and how to get more accurate answers.',
    topics: [
      'What Is a Context Window?',
      'How LLMs Process Conversation History',
      'Why AI Sometimes Forgets Previous Information',
      'Context Length and Token Limits',
      'Why LLMs Hallucinate',
      'Understanding Model Knowledge Cutoffs',
      'Why LLMs Do Not Always Understand Truth',
      'Strategies for Improving Response Accuracy',
    ],
  },
  {
    slug: 'rag-and-external-knowledge',
    title: 'RAG and External Knowledge',
    summary: 'See why models need outside knowledge and how retrieval-augmented generation finds the right passages, hands them to the model and gets grounded answers.',
    topics: [
      'Why LLMs Need External Knowledge',
      'What Is Retrieval-Augmented Generation?',
      'Understanding Vector Databases',
      'How Embeddings Enable Semantic Search',
      'How Document Retrieval Works',
      'How Retrieved Information Is Used to Generate Answers',
      'RAG vs. Fine-Tuning',
      'Real-World Applications of RAG',
    ],
  },
  {
    slug: 'multimodal-large-language-models',
    title: 'Multimodal Large Language Models',
    summary: 'Explore how models work with images, speech, audio and video as well as text, and what is still hard.',
    topics: [
      'What Are Multimodal AI Models?',
      'How AI Processes Images',
      'Understanding Vision-Language Models',
      'How AI Works With Audio and Speech',
      'How AI Processes Video',
      'The Future of Multimodal AI',
    ],
  },
  {
    slug: 'real-world-applications-and-the-future-of-llms',
    title: 'Real-World Applications and the Future of LLMs',
    summary: 'See LLMs at work in business, education, health, research and software, how agents and tool calling work, and where human checking is a must.',
    topics: [
      'LLMs in Business and Customer Support',
      'LLMs in Education',
      'LLMs in Healthcare and Research',
      'LLMs in Software Development',
      'AI Agents and Tool Calling',
      'Understanding Function Calling',
      'Limitations, Security, and Responsible AI',
      'The Future of Large Language Models',
    ],
  },
  {
    slug: 'final-assessment-and-practical-challenge',
    title: 'Final Assessment and Practical Challenge',
    summary: 'Review the whole course, show what you know in a 25-question assessment, design an AI assistant workflow and reflect on what you learned.',
    topics: [
      'Comprehensive Knowledge Review',
      'Final Assessment, Part 1: LLM Foundations and Training Data',
      'Final Assessment, Part 2: Tokens, Embeddings, and Transformers',
      'Final Assessment, Part 3: Generating Responses and Alignment',
      'Final Assessment, Part 4: Context, Limits, and RAG',
      'Final Assessment, Part 5: Multimodal Models and Real-World Use',
      'Practical Challenge: Design an AI Assistant Workflow',
      'Final Reflection and Course Completion',
    ],
  },
];

export const SYLLABUS_LLM: readonly SyllabusEntry[] = [
  {
    id: 'how-llms-work',
    title: 'How Large Language Models Work',
    level: 'intermediate',
    category: 'ai-coding-fundamentals',
    prerequisites: ['ai-fundamentals-everyone'],
    technologies: ['llm', 'chatgpt', 'claude', 'gemini', 'rag'],
    goals: ['learn-ai-dev'],
    tags: ['llm', 'large language model', 'how chatgpt works', 'how ai works', 'transformer', 'attention', 'self attention', 'tokens', 'tokenization', 'embeddings', 'next token prediction', 'temperature', 'top-p', 'top-k', 'sampling', 'inference', 'pretraining', 'fine-tuning', 'rlhf', 'dpo', 'instruction tuning', 'context window', 'hallucination', 'knowledge cutoff', 'rag', 'retrieval augmented generation', 'vector database', 'multimodal', 'vision language model', 'function calling', 'tool calling', 'ai agents', 'under the hood', 'ai internals'],
    // Concepts hold across products; the course names ChatGPT, Claude and Gemini as examples and never states a release, a size, a price or a benchmark.
    volatile: false,
    scope: 'The inside of an AI assistant, for curious people (technical or not): what an LLM is; the text it learns from and how that text is prepared; training, parameters and weights; tokens and embeddings; the Transformer and self-attention (query, key and value, word order, layers); how a reply is produced one token at a time (next-token prediction, temperature, top-k and top-p, inference); pretraining, fine-tuning, instruction tuning, RLHF, DPO and evaluation; context windows, forgetting, hallucination and knowledge cutoffs; retrieval-augmented generation and vector databases; multimodal models; and real-world uses, agents and function calling. It is the mechanism course that follows AI Fundamentals for Everyone (what AI is and how to use it, with no inner workings) and comes before the developer courses. It does not teach prompt writing, tools or workflows for building (Generative AI: From Fundamentals to Real-World Applications, Prompt Engineering for Software Development and the build courses own those), it does not repeat the AI Fundamentals lessons (it recalls them by name) and it uses no code and no advanced mathematics; where Generative AI covers tokens, context windows, RAG or agents as skills to use, this course explains why they work that way.',
    modules: LLM_MODULES,
    topics: LLM_MODULES.flatMap((module) => module.topics),
  },
];
