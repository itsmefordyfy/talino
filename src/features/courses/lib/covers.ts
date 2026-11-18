import type { TaliMood } from '@/components/brand/tali';
import type { CoverPalette } from '@/constants/theme';

/** The illustrated scenes a cover can show (drawn in `components/cover-scenes.tsx`). */
export const COVER_SCENES = [
  'path',
  'code',
  'terminal',
  'invoice',
  'blueprint',
  'review',
  'board',
  'chat',
  'neural',
  'bug',
  'chart',
  'flow',
  'launch',
  'docs',
  'editor',
  'cloud',
  'architecture',
  'database',
  'phone',
  'web',
  'shield',
  'container',
  'git',
  'checklist',
] as const;

export type CoverScene = (typeof COVER_SCENES)[number];

export type CourseCoverArt = {
  scene: CoverScene;
  palette: CoverPalette;
  /** Tali's pose on the cover: each pose sits at a desk on the image's baseline, so it stands on the cover's bottom edge. */
  pose: TaliMood;
};

/**
 * Each course's cover (owner's request 2026-11-14): a scene that says what the course is about, a
 * palette that tells it apart from its neighbours in the catalog, and the pose of Tali that fits.
 * Covers are drawn, not photos: they work offline, stay in the brand, and need no paid image service.
 */
export const COURSE_COVERS: Record<string, CourseCoverArt> = {
  starter: { scene: 'path', palette: 'dusk', pose: 'happy' },
  developer: { scene: 'code', palette: 'violet', pose: 'coding' },
  freelancer: { scene: 'invoice', palette: 'mint', pose: 'excited' },
  builder: { scene: 'blueprint', palette: 'indigo', pose: 'focused' },
  experienced: { scene: 'review', palette: 'night', pose: 'confident' },
  educator: { scene: 'board', palette: 'ocean', pose: 'teaching' },
  'mini-python-ai': { scene: 'terminal', palette: 'violet', pose: 'determined' },
  'mini-ai-engineering': { scene: 'neural', palette: 'indigo', pose: 'thinking' },
  'mini-ai-qa': { scene: 'bug', palette: 'mint', pose: 'curious' },
  'mini-ai-data': { scene: 'chart', palette: 'ocean', pose: 'surprised' },
  'mini-no-code-automation': { scene: 'flow', palette: 'dusk', pose: 'encouraging' },
  'mini-sell-your-app': { scene: 'launch', palette: 'night', pose: 'celebrating' },
  'ai-dev-intro': { scene: 'neural', palette: 'dusk', pose: 'inspired' },
  'ai-dev-chatgpt': { scene: 'chat', palette: 'mint', pose: 'happy' },
  'ai-dev-claude': { scene: 'docs', palette: 'violet', pose: 'learning' },
  'ai-dev-claude-code': { scene: 'terminal', palette: 'night', pose: 'coding' },
  'ai-dev-cursor': { scene: 'editor', palette: 'indigo', pose: 'focused' },
  'ai-dev-codex': { scene: 'cloud', palette: 'ocean', pose: 'supportive' },
  'ai-dev-advanced': { scene: 'architecture', palette: 'violet', pose: 'accomplished' },
  // The AI-first catalog (2026-11-14). A scene that says what the course is about, a palette that tells it from its neighbours.
  'ai-coding-beginners': { scene: 'path', palette: 'mint', pose: 'excited' },
  'prompt-engineering-dev': { scene: 'chat', palette: 'violet', pose: 'explaining' },
  'understanding-ai-code': { scene: 'review', palette: 'ocean', pose: 'learning' },
  'debugging-with-ai': { scene: 'bug', palette: 'dusk', pose: 'determined' },
  'ai-coding-practices': { scene: 'checklist', palette: 'indigo', pose: 'confident' },
  'build-website-ai': { scene: 'web', palette: 'violet', pose: 'happy' },
  'build-mobile-app-ai': { scene: 'phone', palette: 'mint', pose: 'excited' },
  'build-fullstack-ai': { scene: 'architecture', palette: 'indigo', pose: 'coding' },
  'build-ai-app': { scene: 'neural', palette: 'dusk', pose: 'inspired' },
  'build-saas-ai': { scene: 'launch', palette: 'ocean', pose: 'celebrating' },
  'idea-to-product': { scene: 'blueprint', palette: 'violet', pose: 'thinking' },
  'improve-existing-ai': { scene: 'editor', palette: 'night', pose: 'focused' },
  'ai-dev-copilot': { scene: 'code', palette: 'mint', pose: 'coding' },
  'ai-dev-gemini': { scene: 'docs', palette: 'indigo', pose: 'curious' },
  'choose-ai-tool': { scene: 'board', palette: 'ocean', pose: 'teaching' },
  'context-engineering': { scene: 'docs', palette: 'night', pose: 'thinking' },
  'spec-driven-dev': { scene: 'blueprint', palette: 'mint', pose: 'explaining' },
  'ai-project-planning': { scene: 'board', palette: 'violet', pose: 'happy' },
  'ai-ui-ux': { scene: 'web', palette: 'dusk', pose: 'inspired' },
  'ai-backend-dev': { scene: 'terminal', palette: 'indigo', pose: 'coding' },
  'ai-database-design': { scene: 'database', palette: 'ocean', pose: 'learning' },
  'ai-api-integration': { scene: 'flow', palette: 'mint', pose: 'focused' },
  'ai-code-review': { scene: 'review', palette: 'violet', pose: 'confident' },
  'ai-testing-qa': { scene: 'checklist', palette: 'dusk', pose: 'determined' },
  'ai-deployment': { scene: 'container', palette: 'indigo', pose: 'focused' },
  'agentic-coding': { scene: 'cloud', palette: 'night', pose: 'supportive' },
  'multi-agent-dev': { scene: 'architecture', palette: 'violet', pose: 'explaining' },
  'mcp-dev': { scene: 'flow', palette: 'ocean', pose: 'curious' },
  'ai-architecture': { scene: 'architecture', palette: 'mint', pose: 'thinking' },
  'production-ai-apps': { scene: 'launch', palette: 'night', pose: 'accomplished' },
  'ai-coding-security': { scene: 'shield', palette: 'violet', pose: 'surprised' },
  'managing-ai-projects': { scene: 'board', palette: 'indigo', pose: 'confident' },
  'app-monetization': { scene: 'invoice', palette: 'mint', pose: 'excited' },
  'launch-marketing': { scene: 'launch', palette: 'dusk', pose: 'encouraging' },
  'freelance-ai-dev': { scene: 'invoice', palette: 'ocean', pose: 'proud' },
  'ai-software-business': { scene: 'path', palette: 'night', pose: 'accomplished' },
  // Added 2026-11-15: tool and store walkthroughs.
  'build-with-lovable': { scene: 'phone', palette: 'violet', pose: 'inspired' },
  'publish-to-app-stores': { scene: 'launch', palette: 'mint', pose: 'proud' },
  // Programming Fundamentals (2026-11-16): the steps of a program as a flow.
  'programming-fundamentals': { scene: 'flow', palette: 'ocean', pose: 'thinking' },
  // Data Structures and Algorithms (2026-11-16): structures and the connections between them.
  'data-structures-algorithms': { scene: 'architecture', palette: 'violet', pose: 'confident' },
  // Object-Oriented Programming (2026-11-16): a blueprint of classes.
  'object-oriented-programming': { scene: 'blueprint', palette: 'indigo', pose: 'teaching' },
  // Soft Skills for the Modern Workplace (2026-11-17): a conversation between people.
  'soft-skills-workplace': { scene: 'path', palette: 'mint', pose: 'encouraging' },
  // Generative AI: From Fundamentals to Real-World Applications (2026-11-17): a network of connected nodes.
  'generative-ai-applications': { scene: 'neural', palette: 'violet', pose: 'inspired' },
  // Finding International Clients (2026-11-17): the road from a profile to a first client abroad.
  'international-clients': { scene: 'path', palette: 'ocean', pose: 'proud' },
  // Time Management and Productivity (2026-11-17): a checklist being worked through.
  'time-management-productivity': { scene: 'checklist', palette: 'ocean', pose: 'proud' },
  // AI Automation for Business and Everyday Work (2026-11-18): steps connected into a workflow.
  'ai-automation-business': { scene: 'flow', palette: 'violet', pose: 'encouraging' },
  // AI Fundamentals for Everyone (2026-11-18): a network of connected nodes, friendlier palette than the Generative AI course.
  'ai-fundamentals-everyone': { scene: 'neural', palette: 'mint', pose: 'explaining' },
  // Software Architecture with AI (2026-11-18): components and the connections between them.
  'software-architecture-ai': { scene: 'architecture', palette: 'ocean', pose: 'thinking' },
  // Building AI Agents (2026-11-18): steps connected in a loop, a model calling tools.
  'building-ai-agents': { scene: 'flow', palette: 'ocean', pose: 'coding' },
  // How Large Language Models Work (2026-11-18): a neural network lit up, seen from inside.
  'how-llms-work': { scene: 'neural', palette: 'night', pose: 'curious' },
  'deploy-with-vercel': { scene: 'cloud', palette: 'violet', pose: 'confident' },
};

const KIND_FALLBACK: Record<string, CourseCoverArt> = {
  starter: { scene: 'path', palette: 'dusk', pose: 'happy' },
  career: { scene: 'code', palette: 'violet', pose: 'coding' },
  path: { scene: 'neural', palette: 'indigo', pose: 'explaining' },
  mini: { scene: 'flow', palette: 'mint', pose: 'encouraging' },
  standard: { scene: 'code', palette: 'indigo', pose: 'learning' },
};

/** The cover of a course; a course added without one still gets its kind's cover. */
export function coverFor(course: { id: string; kind: string }): CourseCoverArt {
  return COURSE_COVERS[course.id] ?? KIND_FALLBACK[course.kind] ?? KIND_FALLBACK.career;
}
