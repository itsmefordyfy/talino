import type { SyllabusEntry, SyllabusModule } from './syllabus-types';

/**
 * Software Architecture with AI: Design Scalable, Secure, and Production-Ready Systems (owner's brief, 2026-11-18). An intermediate-to-professional course
 * in architectural thinking, practised on realistic systems with AI as a reviewer and drafting partner, never as the decision maker. Twelve modules, 44 lessons,
 * three projects (after lessons 26, 34 and 44). It is the deep version of the shorter `ai-architecture` course (AI-Assisted Software Architecture), which stays as its introduction.
 * Design: docs/superpowers/specs/2026-11-18-software-architecture-course-design.md; writer brief: docs/content/ARCHITECTURE_BRIEF.md.
 */
export const ARCHITECTURE_MODULES: readonly SyllabusModule[] = [
  {
    slug: 'introduction-to-architecture',
    title: 'Introduction to Software Architecture',
    summary: 'See architecture as a set of costly-to-change decisions, learn the architect’s job and draw the first boundary and decision record.',
    topics: [
      'What Software Architecture Is, and What It Is Not',
      'The Architect’s Job: Decisions, Trade-Offs and Communication',
      'Functional and Non-Functional Requirements, and Where the System Ends',
      'Using AI to Analyse a System, and Recording Your First Decision',
    ],
  },
  {
    slug: 'requirements-and-planning',
    title: 'Requirements Analysis and Architecture Planning',
    summary: 'Turn business needs into actors, goals, constraints and measurable quality targets, and use AI to find the gaps in them.',
    topics: [
      'From Business Needs to Actors, Goals and Constraints',
      'Quality Attributes: Making Performance, Availability, Security and Scale Measurable',
      'AI-Assisted Requirements Discovery: Questions, Assumptions and Gaps',
    ],
  },
  {
    slug: 'patterns-and-styles',
    title: 'Architectural Patterns and Styles',
    summary: 'Compare monoliths, modular monoliths, microservices, serverless, event-driven, layered, hexagonal and Clean Architecture, and choose by evidence.',
    topics: [
      'Monolith and Modular Monolith: The Strong Default',
      'Microservices and Serverless: What You Buy and What You Pay',
      'Event-Driven Architecture: Events Instead of Calls',
      'Layered, Hexagonal and Clean Architecture',
      'Choosing a Style: A Decision Method You Can Defend',
    ],
  },
  {
    slug: 'system-design-and-components',
    title: 'System Design and Component Architecture',
    summary: 'Split a system into components along real boundaries, manage dependencies and communication, and keep the design maintainable.',
    topics: [
      'Decomposing a System: Components, Responsibilities and Bounded Contexts',
      'Dependencies, Communication and Boundaries Between Components',
      'High-Level and Low-Level Design, and Designing for Maintainability',
    ],
  },
  {
    slug: 'database-architecture',
    title: 'Database Architecture and Data Modeling',
    summary: 'Choose a data store, model entities, index and scale it, keep data consistent, isolate tenants and review a schema with AI.',
    topics: [
      'Choosing SQL, NoSQL or Both: Fit the Data, Not the Fashion',
      'Modeling Data: Entities, Relationships, Normalization and Denormalization',
      'Indexing, Consistency and Scaling a Database',
      'Multi-Tenant Data Models and AI-Assisted Schema Reviews',
    ],
  },
  {
    slug: 'api-architecture',
    title: 'API Architecture and System Integration',
    summary: 'Design REST and GraphQL contracts, version them, place authentication boundaries, integrate third parties and move work through queues and events.',
    topics: [
      'REST, GraphQL and the API Contract',
      'Versioning, Authentication Boundaries and API Gateways',
      'Third-Party Integrations and Webhooks That Can Be Trusted',
      'Message Queues and Event-Based Communication',
    ],
  },
  {
    slug: 'cloud-architecture',
    title: 'Cloud Architecture and Infrastructure Design',
    summary: 'Understand compute, storage and networking across the big clouds, package with containers and Infrastructure as Code, and keep cost in the design.',
    topics: [
      'Cloud Fundamentals: Compute, Storage and Networking Across Providers',
      'Containers, Orchestration and Infrastructure as Code, and the 12-Factor App',
      'Managed Services, CDN, Load Balancing and Cloud Cost',
    ],
  },
  {
    slug: 'scalability-and-reliability',
    title: 'Scalability, Performance and Reliability',
    summary: 'Scale on evidence: balance load, cache, tune the data layer, find the real bottleneck and design for failure, visibility and recovery.',
    topics: [
      'Scaling Up and Out, and Load Balancing',
      'Caching and Database Performance',
      'Finding the Bottleneck: Measure Before You Redesign',
      'High Availability, Fault Tolerance, Observability and Disaster Recovery',
    ],
  },
  {
    slug: 'security-architecture',
    title: 'Security Architecture and Best Practices',
    summary: 'Build security into the design: threat modelling, identity and access, encryption and secrets, API protection, tenant isolation and security reviews.',
    topics: [
      'Secure by Design and Threat Modeling',
      'Authentication and Authorization: Sessions, Tokens, RBAC and ABAC',
      'Encryption, Secrets Management and API Security',
      'Tenant Isolation and Architecture Security Reviews',
    ],
  },
  {
    slug: 'ai-assisted-design-and-documentation',
    title: 'AI-Assisted Architecture Design and Documentation',
    summary: 'Prompt Claude, ChatGPT and Gemini for architecture work, draw diagrams as code, write ADRs, compare alternatives and review what AI proposes.',
    topics: [
      'Architecture Prompts for Claude, ChatGPT and Gemini',
      'Diagrams as Code: C4, Sequence and Data-Flow Diagrams',
      'Architecture Decision Records and Comparing Design Alternatives',
      'Reviewing AI-Generated Architecture: What to Trust and What to Test',
    ],
  },
  {
    slug: 'coding-agents-and-implementation',
    title: 'AI Coding Agents and Architecture Implementation',
    summary: 'Turn a design into a plan, direct coding agents with context and checkpoints, and keep boundaries intact through refactoring and tests.',
    topics: [
      'From Architecture to an Implementation Plan',
      'Directing Claude Code, Cursor and Codex: Context, Conventions and Checkpoints',
      'Keeping Boundaries: AI-Assisted Refactoring, Compliance Checks and Testing Decisions',
    ],
  },
  {
    slug: 'production-and-review',
    title: 'Production Architecture and Architecture Review',
    summary: 'Check readiness, review an architecture, manage debt and drift, design deployment and CI/CD, weigh cost against performance and plan evolution.',
    topics: [
      'Production Readiness and Running an Architecture Review',
      'Technical Debt, Architectural Drift and Evolving a System',
      'Deployment, CI/CD and Cost and Performance Trade-Offs',
    ],
  },
];

export const SYLLABUS_ARCHITECTURE: readonly SyllabusEntry[] = [
  {
    id: 'software-architecture-ai',
    title: 'Software Architecture with AI: Design Scalable, Secure, and Production-Ready Systems',
    level: 'intermediate',
    category: 'advanced-ai-engineering',
    prerequisites: [],
    technologies: ['llm', 'claude', 'chatgpt', 'gemini', 'claude-code', 'cursor', 'codex', 'postgresql', 'rest', 'auth', 'docker', 'cloud'],
    goals: ['learn-ai-dev'],
    tags: ['software architecture', 'system design', 'c4 model', 'adr', 'architecture decision records', 'uml', 'domain driven design', 'clean architecture', 'hexagonal', '12 factor', 'microservices', 'modular monolith', 'multi tenant', 'saas', 'scalability', 'caching', 'database design', 'api design', 'cloud architecture', 'threat modeling', 'rbac', 'tenant isolation', 'observability', 'technical debt', 'architecture review', 'diagrams', 'mermaid', 'trade offs'],
    volatile: false,
    scope: 'Architectural thinking applied to realistic systems, for developers who can already build: requirements and quality attributes, the main architecture styles and how to choose between them, components and boundaries, data modeling and multi-tenancy, API and integration design, cloud and infrastructure concepts, scaling and reliability on evidence, security by design, documenting with C4 diagrams, UML sequence and class views and Architecture Decision Records, using AI to analyse, draft, compare and review designs, directing coding agents without losing the boundaries, and production readiness, drift and evolution. It is the deep version of AI-Assisted Software Architecture (the shorter introduction, which stays) and does not repeat its lessons; it builds on Object-Oriented Programming and Programming Fundamentals as advice only. It teaches concepts that hold on AWS, Azure and Google Cloud and names no price, plan limit or product feature as fact except in dated, sourced version notes. It never recommends microservices, Kubernetes or a costly service by default: the simplest architecture that meets the stated requirements is the baseline every lesson measures against.',
    modules: ARCHITECTURE_MODULES,
    topics: ARCHITECTURE_MODULES.flatMap((module) => module.topics),
  },
];
