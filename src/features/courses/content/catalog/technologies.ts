/**
 * The vocabulary of technologies a course can name (`CourseMeta.technologies`): one id, one label, and the other
 * words people type for it, so "rn", "js" and "gpt" all find the right courses. The technology filter lists the
 * ones a course really uses, most common first, and the search reads the labels and aliases.
 */
export type Technology = {
  id: string;
  label: string;
  /** Other spellings and short names, lower case. */
  aliases: string[];
  group: 'language' | 'web' | 'mobile' | 'backend' | 'data' | 'ai' | 'devops' | 'tools' | 'testing' | 'security';
};

export const TECHNOLOGIES: readonly Technology[] = [
  { id: 'javascript', label: 'JavaScript', aliases: ['js', 'ecmascript', 'es6'], group: 'language' },
  { id: 'typescript', label: 'TypeScript', aliases: ['ts'], group: 'language' },
  { id: 'python', label: 'Python', aliases: ['py', 'python3'], group: 'language' },
  { id: 'csharp', label: 'C#', aliases: ['c sharp', 'csharp', 'dotnet', '.net'], group: 'language' },
  { id: 'dart', label: 'Dart', aliases: [], group: 'language' },
  { id: 'sql', label: 'SQL', aliases: ['structured query language'], group: 'data' },
  { id: 'html-css', label: 'HTML & CSS', aliases: ['html', 'css', 'html5', 'css3', 'markup', 'stylesheets'], group: 'web' },
  { id: 'react', label: 'React', aliases: ['reactjs', 'react.js', 'jsx'], group: 'web' },
  { id: 'nextjs', label: 'Next.js', aliases: ['next js', 'nextjs', 'app router'], group: 'web' },
  { id: 'tailwind', label: 'Tailwind CSS', aliases: ['tailwind', 'utility css'], group: 'web' },
  { id: 'react-native', label: 'React Native', aliases: ['rn', 'reactnative', 'react native'], group: 'mobile' },
  { id: 'expo', label: 'Expo', aliases: ['expo router', 'eas', 'expo go'], group: 'mobile' },
  { id: 'flutter', label: 'Flutter', aliases: ['flutter dart'], group: 'mobile' },
  { id: 'nodejs', label: 'Node.js', aliases: ['node', 'nodejs', 'node js'], group: 'backend' },
  { id: 'express', label: 'Express', aliases: ['expressjs', 'express.js'], group: 'backend' },
  { id: 'aspnet-core', label: 'ASP.NET Core', aliases: ['asp.net', 'aspnet', 'web api'], group: 'backend' },
  { id: 'rest', label: 'REST APIs', aliases: ['rest', 'restful', 'openapi', 'swagger'], group: 'backend' },
  { id: 'auth', label: 'Authentication', aliases: ['auth', 'oauth', 'jwt', 'authorization'], group: 'security' },
  { id: 'postgresql', label: 'PostgreSQL', aliases: ['postgres', 'psql', 'pg'], group: 'data' },
  { id: 'mongodb', label: 'MongoDB', aliases: ['mongo', 'nosql', 'mongoose'], group: 'data' },
  { id: 'sqlite', label: 'SQLite', aliases: ['expo-sqlite', 'local database'], group: 'data' },
  { id: 'supabase', label: 'Supabase', aliases: ['row level security', 'rls'], group: 'data' },
  { id: 'firebase', label: 'Firebase', aliases: ['firestore', 'cloud functions'], group: 'data' },
  { id: 'vector-db', label: 'Vector databases', aliases: ['pgvector', 'embeddings', 'vector search', 'pinecone', 'chroma', 'qdrant'], group: 'data' },
  { id: 'openai', label: 'OpenAI', aliases: ['openai api', 'gpt-5', 'chatgpt api'], group: 'ai' },
  { id: 'chatgpt', label: 'ChatGPT', aliases: ['chat gpt', 'gpt'], group: 'ai' },
  { id: 'claude', label: 'Claude', aliases: ['anthropic', 'claude api'], group: 'ai' },
  { id: 'claude-code', label: 'Claude Code', aliases: ['claude cli', 'claude.md'], group: 'ai' },
  { id: 'cursor', label: 'Cursor', aliases: ['cursor ide', 'cursor editor'], group: 'ai' },
  { id: 'codex', label: 'OpenAI Codex', aliases: ['codex cli', 'codex agent'], group: 'ai' },
  { id: 'gemini', label: 'Gemini', aliases: ['google ai', 'gemini api', 'google ai studio', 'gemini cli'], group: 'ai' },
  { id: 'copilot', label: 'GitHub Copilot', aliases: ['github copilot', 'copilot chat', 'copilot agent'], group: 'ai' },
  { id: 'vibe-tools', label: 'Vibe coding app builders', aliases: ['lovable', 'bolt', 'v0', 'replit', 'app builder', 'vibe coding'], group: 'ai' },
  { id: 'mcp', label: 'Model Context Protocol', aliases: ['mcp', 'mcp server'], group: 'ai' },
  { id: 'llm', label: 'LLMs', aliases: ['large language model', 'language model', 'prompting', 'prompt engineering', 'generative ai', 'genai'], group: 'ai' },
  { id: 'rag', label: 'RAG', aliases: ['retrieval augmented generation', 'retrieval-augmented generation'], group: 'ai' },
  { id: 'ai-agents', label: 'AI agents', aliases: ['agents', 'agentic', 'tool calling', 'function calling'], group: 'ai' },
  { id: 'git', label: 'Git', aliases: ['version control', 'commits', 'branches'], group: 'tools' },
  { id: 'github', label: 'GitHub', aliases: ['pull request', 'pull requests', 'github actions'], group: 'tools' },
  { id: 'docker', label: 'Docker', aliases: ['containers', 'containerization', 'dockerfile'], group: 'devops' },
  { id: 'vercel', label: 'Vercel', aliases: ['vercel deploy', 'vercel hosting', 'vercel app'], group: 'devops' },
  { id: 'github-actions', label: 'GitHub Actions', aliases: ['ci/cd', 'continuous integration'], group: 'devops' },
  { id: 'cloud', label: 'Cloud platforms', aliases: ['aws', 'azure', 'gcp', 'google cloud', 'serverless', 'cloud computing'], group: 'devops' },
  { id: 'jest', label: 'Jest', aliases: ['vitest', 'unit tests', 'unit testing'], group: 'testing' },
  { id: 'playwright', label: 'Playwright', aliases: ['e2e', 'end to end', 'browser testing'], group: 'testing' },
  { id: 'postman', label: 'Postman', aliases: ['api testing', 'supertest'], group: 'testing' },
  { id: 'owasp', label: 'OWASP', aliases: ['owasp top 10', 'xss', 'sql injection', 'csrf'], group: 'security' },
  { id: 'agile', label: 'Agile & Scrum', aliases: ['scrum', 'kanban', 'sprint', 'jira'], group: 'tools' },
];

const byId = new Map(TECHNOLOGIES.map((technology) => [technology.id, technology]));

export function getTechnology(id: string): Technology | undefined {
  return byId.get(id);
}
