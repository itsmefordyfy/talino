import { cleanJourneyFocus, type JourneyFocusId } from './focus-ids';

/** The welcome's goals and interests that point one way. Anything else (learn from scratch, "not sure") points nowhere. */
const GOAL_FOCUS: Readonly<Record<string, JourneyFocusId>> = {
  mobile: 'mobile',
  frontend: 'web',
  backend: 'web',
  'full-stack': 'web',
  ai: 'ai',
  // Data science is machine learning and AI work first.
  'data-science': 'ai',
  freelance: 'freelance',
  'software-engineer': 'hired',
  'interview-prep': 'hired',
  teach: 'teach',
};

const INTEREST_FOCUS: Readonly<Record<string, JourneyFocusId>> = {
  'react-native': 'mobile',
  expo: 'mobile',
  flutter: 'mobile',
  ios: 'mobile',
  android: 'mobile',
  swift: 'mobile',
  kotlin: 'mobile',
  react: 'web',
  nextjs: 'web',
  nodejs: 'web',
  'html-css': 'web',
  apis: 'web',
  databases: 'web',
  backend: 'web',
  express: 'web',
  // The plain "Artificial intelligence" interest, the one every AI learner ticks, pointed nowhere before.
  ai: 'ai',
  'ai-coding': 'ai',
  genai: 'ai',
  llm: 'ai',
  'ai-apps': 'ai',
  rag: 'ai',
  ml: 'ai',
};

/**
 * Where the learner is heading. Their own choice (Customize journey) wins; otherwise it is read from what they told the welcome. Empty
 * means they haven't said, which keeps the journey's own plan for everyone. It only changes which milestones are required or optional:
 * it never hides a milestone and never touches progress.
 */
export function focusFrom(profile: { goals: readonly string[]; interests: readonly string[] }, chosen: readonly JourneyFocusId[] | null): JourneyFocusId[] {
  const own = cleanJourneyFocus(chosen);
  if (own) return own;
  const found = new Set<JourneyFocusId>();
  for (const goal of profile.goals) {
    const id = GOAL_FOCUS[goal];
    if (id) found.add(id);
  }
  for (const interest of profile.interests) {
    const id = INTEREST_FOCUS[interest];
    if (id) found.add(id);
  }
  return [...found];
}
