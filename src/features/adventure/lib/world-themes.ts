import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import type { Language } from '@/lib/i18n';

import { fallbackWorldStoryFil, WORLD_TEXT_FIL } from './adventure-text';

export type WorldTone = 'violet' | 'indigo' | 'mint';

export type WorldTheme = {
  name: string;
  icon: MaterialSymbolName;
  tone: WorldTone;
  /** A light, optional story: the premise and the mission. The lesson content stays the focus. */
  story: { premise: string; mission: string };
};

/**
 * The identity of each course as a world. The stories are deliberately generic and warm: they set a
 * mood and never state anything about the course's content (that is the lessons' job).
 */
export const WORLD_THEMES: Record<string, WorldTheme> = {
  starter: {
    name: 'Basecamp',
    icon: 'auto_awesome',
    tone: 'indigo',
    story: { premise: 'Every journey into tech starts at Basecamp, where the paths are marked and the lamps are lit.', mission: 'Tali will walk the first steps with you. Take them at your own pace.' },
  },
  developer: {
    name: 'Developer Academy',
    icon: 'code',
    tone: 'violet',
    story: { premise: 'The Developer Academy needs your help: its workshops are open and a new class of builders is welcome.', mission: 'Work through each mission, and finish with a project that shows what you can do.' },
  },
  freelancer: {
    name: 'Freelance Harbor',
    icon: 'sailing',
    tone: 'mint',
    story: { premise: 'At Freelance Harbor, independent workers set out with their own offers and their own pace.', mission: 'Learn the craft one mission at a time, then launch work that is truly yours.' },
  },
  builder: {
    name: 'Builder’s Workshop',
    icon: 'construction',
    tone: 'indigo',
    story: { premise: 'The Workshop has benches, tools and an idea waiting for someone to bring it to life.', mission: 'Follow the missions and build your own app or site, step by step.' },
  },
  experienced: {
    name: 'Senior Summit',
    icon: 'terminal',
    tone: 'violet',
    story: { premise: 'On the Summit, experienced developers compare notes and sharpen their craft.', mission: 'Pick up each mission, keep what is useful, and bring it back to your team.' },
  },
  educator: {
    name: 'Teachers’ Grove',
    icon: 'cast_for_education',
    tone: 'mint',
    story: { premise: 'In the Grove, teachers share what works and help each other grow.', mission: 'Complete the missions and leave with ideas and materials ready for your classroom.' },
  },
  'mini-python-ai': {
    name: 'Python Forge',
    icon: 'terminal',
    tone: 'violet',
    story: { premise: 'The Forge is warm and the anvil is ready for a small, sharp project.', mission: 'Five short missions, then a project to take with you.' },
  },
  'mini-ai-engineering': {
    name: 'AI Engineering Lab',
    icon: 'smart_toy',
    tone: 'indigo',
    story: { premise: 'The Lab is quiet, the benches are tidy and there is room for your experiments.', mission: 'Try each mission, then wrap up with a project.' },
  },
  'mini-ai-qa': {
    name: 'Bug Patrol',
    icon: 'bug_report',
    tone: 'mint',
    story: { premise: 'Bug Patrol is looking for careful eyes and curious minds.', mission: 'Work the five missions, then take on the final case.' },
  },
  'mini-ai-data': {
    name: 'Data Observatory',
    icon: 'query_stats',
    tone: 'indigo',
    story: { premise: 'From the Observatory, patterns in data come into view for those who look closely.', mission: 'Five short missions and a project: look closely and learn.' },
  },
  'mini-no-code-automation': {
    name: 'Automation Garage',
    icon: 'account_tree',
    tone: 'violet',
    story: { premise: 'The Garage hums with small machines that save people time.', mission: 'Build your own, one mission at a time, and finish with a project.' },
  },
  'mini-sell-your-app': {
    name: 'Launch Market',
    icon: 'storefront',
    tone: 'mint',
    story: { premise: 'The Market is open and the stalls are waiting for something worth showing.', mission: 'Five short missions, then a project to put your work out there.' },
  },
  // The AI-Assisted Development path: one world per course, gentle stories that name no tool (the lessons do that).
  'ai-dev-intro': {
    name: 'Signal Station',
    icon: 'neurology',
    tone: 'indigo',
    story: { premise: 'At Signal Station, developers learn to read a new kind of teammate: fast, fluent and sometimes wrong.', mission: 'Learn how it thinks and where it slips, then set the rules you will work by.' },
  },
  'ai-dev-chatgpt': {
    name: 'Conversation Hall',
    icon: 'chat',
    tone: 'violet',
    story: { premise: 'In Conversation Hall, good questions open doors that bad ones keep shut.', mission: 'Ask clearly, check everything, and build something real from the answers.' },
  },
  'ai-dev-claude': {
    name: 'Reading Room',
    icon: 'psychology',
    tone: 'violet',
    story: { premise: 'The Reading Room holds whole codebases on its long tables, ready to be understood.', mission: 'Work through each mission and leave every repository a little clearer than you found it.' },
  },
  'ai-dev-claude-code': {
    name: 'Terminal Tower',
    icon: 'terminal',
    tone: 'indigo',
    story: { premise: 'At the top of Terminal Tower, an agent waits for a plan worth carrying out.', mission: 'Plan first, approve each step, and ship a feature you have checked yourself.' },
  },
  'ai-dev-cursor': {
    name: 'Editor’s Forge',
    icon: 'code_blocks',
    tone: 'mint',
    story: { premise: 'In the Forge, many files are shaped at once and every change is inspected before it cools.', mission: 'Set your rules, guide the work, and review every diff before it lands.' },
  },
  'ai-dev-codex': {
    name: 'Delegation Docks',
    icon: 'cloud_sync',
    tone: 'mint',
    story: { premise: 'At the Docks, tasks are loaded with clear instructions and sent out to sea.', mission: 'Write tasks an agent can finish, then inspect every cargo that comes back.' },
  },
  'ai-dev-advanced': {
    name: 'Architect’s Summit',
    icon: 'engineering',
    tone: 'violet',
    story: { premise: 'The Summit is where teams decide how people and agents build together.', mission: 'Design the workflow, prove it works, and finish with an application of your own.' },
  },
  // The AI-first catalog (2026-11-14): one world per new course, gentle stories that name no tool and no number.
  'ai-coding-beginners': {
    name: "First Light Farm",
    icon: 'spa',
    tone: 'mint',
    story: { premise: "The farm wakes before anyone else, and today you will plant the first thing that grows on the web.", mission: "A few short missions: ask, look, change, fix, and then show the world." },
  },
  'prompt-engineering-dev': {
    name: "The Clear Words Workshop",
    icon: 'edit_note',
    tone: 'violet',
    story: { premise: "In the Workshop, a good request is a tool as real as a hammer.", mission: "Learn to ask so well that the work comes back close to what you pictured." },
  },
  'understanding-ai-code': {
    name: "The Annotated Library",
    icon: 'menu_book',
    tone: 'indigo',
    story: { premise: "The Library is quiet, and every shelf holds code somebody else wrote.", mission: "Learn to read it, explain it, and know when to trust it." },
  },
  'debugging-with-ai': {
    name: "The Repair Bay",
    icon: 'build',
    tone: 'violet',
    story: { premise: "In the Repair Bay, nothing is thrown away until it has been understood.", mission: "Find what broke, find why, and fix it for good together." },
  },
  'ai-coding-practices': {
    name: "Safe Harbour",
    icon: 'anchor',
    tone: 'mint',
    story: { premise: "At Safe Harbour, careful habits keep the boats afloat.", mission: "Small steps, honest reviews, and a checklist that is truly yours." },
  },
  'build-website-ai': {
    name: "Storefront Street",
    icon: 'storefront',
    tone: 'mint',
    story: { premise: "Storefront Street is waiting for one more window with your name above it.", mission: "Plan it, shape it, test it, and open the doors." },
  },
  'build-mobile-app-ai': {
    name: "Pocket Town",
    icon: 'smartphone',
    tone: 'indigo',
    story: { premise: "Everything in Pocket Town fits in a hand, and your app is moving in.", mission: "Sketch the screens, direct the build, and see it on your own phone." },
  },
  'build-fullstack-ai': {
    name: "The Whole Machine Works",
    icon: 'settings',
    tone: 'violet',
    story: { premise: "The Works hum with parts that have to fit together: what people see and what they never do.", mission: "Direct every part, then test the whole machine." },
  },
  'build-ai-app': {
    name: "Spark Lab",
    icon: 'science',
    tone: 'indigo',
    story: { premise: "In the Spark Lab, ordinary tools learn to think a little.", mission: "Give your product a brain, keep it safe, and keep an eye on it." },
  },
  'build-saas-ai': {
    name: "Launch Pad",
    icon: 'rocket_launch',
    tone: 'mint',
    story: { premise: "The Launch Pad is clear and the countdown is yours to start.", mission: "From the first idea to the first customer, one careful step at a time." },
  },
  'idea-to-product': {
    name: "The Idea Greenhouse",
    icon: 'emoji_objects',
    tone: 'mint',
    story: { premise: "In the Greenhouse, ideas are tested before they are planted.", mission: "Find what is worth building, then build the smallest useful version." },
  },
  'improve-existing-ai': {
    name: "The Renovation District",
    icon: 'handyman',
    tone: 'violet',
    story: { premise: "The District is full of buildings that already stand and could stand better.", mission: "Learn the building first, then improve it without knocking it down." },
  },
  'ai-dev-copilot': {
    name: "Pair Hangar",
    icon: 'flight',
    tone: 'indigo',
    story: { premise: "In the Hangar, two seats share one cockpit.", mission: "Fly with a partner who suggests, and stay the one in charge." },
  },
  'ai-dev-gemini': {
    name: "Aurora Observatory",
    icon: 'travel_explore',
    tone: 'violet',
    story: { premise: "The Observatory looks wide and far, and then zooms in on what matters.", mission: "Learn what this tool sees best, and put it to work." },
  },
  'choose-ai-tool': {
    name: "The Crossroads Market",
    icon: 'signpost',
    tone: 'indigo',
    story: { premise: "At the Crossroads, every road leads somewhere good, but not the same place.", mission: "Learn to choose the right tool for the task, and for you." },
  },
  'context-engineering': {
    name: "The Archive of Context",
    icon: 'folder_open',
    tone: 'violet',
    story: { premise: "The Archive keeps only what is worth remembering, and puts it where it will be seen.", mission: "Decide what the AI should see, and when." },
  },
  'spec-driven-dev': {
    name: "Blueprint Hall",
    icon: 'architecture',
    tone: 'mint',
    story: { premise: "In Blueprint Hall, nothing gets built before it is drawn clearly.", mission: "Write what you want so well that building it becomes the easy part." },
  },
  'ai-project-planning': {
    name: "The Map Room",
    icon: 'map',
    tone: 'indigo',
    story: { premise: "The Map Room has a table, a lamp and a long road not yet marked.", mission: "Mark the route, name the risks, and make the first move." },
  },
  'ai-ui-ux': {
    name: "Studio Lumen",
    icon: 'palette',
    tone: 'violet',
    story: { premise: "In Studio Lumen, the way something feels matters as much as how it works.", mission: "Direct a design, judge the result, and test it on real people." },
  },
  'ai-backend-dev': {
    name: "The Engine Room",
    icon: 'dns',
    tone: 'indigo',
    story: { premise: "Below the deck, the Engine Room keeps everything moving where no one looks.", mission: "Specify it, check it, and make sure it is safe." },
  },
  'ai-database-design': {
    name: "The Ledger Vault",
    icon: 'database',
    tone: 'mint',
    story: { premise: "The Vault holds what an app remembers, and it needs to be kept in order.", mission: "Shape your data with care, and change it without losing a thing." },
  },
  'ai-api-integration': {
    name: "Bridge Quarter",
    icon: 'hub',
    tone: 'violet',
    story: { premise: "Bridge Quarter connects your app to the services across the water.", mission: "Connect safely, expect trouble, and test without breaking the real thing." },
  },
  'ai-code-review': {
    name: "The Review Gallery",
    icon: 'rate_review',
    tone: 'indigo',
    story: { premise: "In the Gallery, every piece is looked at twice before it hangs.", mission: "Read with care, give feedback that helps, and catch what slips by." },
  },
  'ai-testing-qa': {
    name: "Proving Grounds",
    icon: 'verified',
    tone: 'mint',
    story: { premise: "On the Proving Grounds, nothing is trusted until it has been tested.", mission: "Test what users do, and make sure the tests themselves can fail." },
  },
  'ai-deployment': {
    name: "Harbour Lights",
    icon: 'sailing',
    tone: 'mint',
    story: { premise: "The lights of the Harbour mark the way from your desk to the open sea.", mission: "Go live with a calm routine, and know how to turn back." },
  },
  'agentic-coding': {
    name: "The Agent Docks",
    icon: 'directions_boat',
    tone: 'indigo',
    story: { premise: "At the Docks, tasks are loaded with clear instructions and sent out to sea.", mission: "Delegate with care, watch what returns, and stay in charge." },
  },
  'multi-agent-dev': {
    name: "The Convoy Yard",
    icon: 'groups',
    tone: 'violet',
    story: { premise: "In the Yard, a whole team of helpers waits for a plan that keeps them from colliding.", mission: "Split the work, give each helper its own lane, and bring it all together." },
  },
  'mcp-dev': {
    name: "Connector Junction",
    icon: 'power',
    tone: 'indigo',
    story: { premise: "At the Junction, new tools plug into the ones you already trust.", mission: "Connect with care, and decide what each tool may touch." },
  },
  'ai-architecture': {
    name: "The Drafting Tower",
    icon: 'account_tree',
    tone: 'violet',
    story: { premise: "From the Tower, the whole city can be seen at once.", mission: "Weigh the options, record your decisions, and design what can grow." },
  },
  'production-ai-apps': {
    name: "Steadfast Works",
    icon: 'verified_user',
    tone: 'mint',
    story: { premise: "The Works run all night so that people can rely on what you built.", mission: "Harden it, watch it, and be ready for the unexpected." },
  },
  'ai-coding-security': {
    name: "The Lock Foundry",
    icon: 'lock',
    tone: 'violet',
    story: { premise: "In the Foundry, every lock is tested against the thief who is not there yet.", mission: "Spot the risks of AI-made code and stop them early." },
  },
  'managing-ai-projects': {
    name: "Command Deck",
    icon: 'dashboard',
    tone: 'indigo',
    story: { premise: "On the Command Deck, many hands work and one plan holds them together.", mission: "Break work down, set the gates, and keep everyone moving the same way." },
  },
  'app-monetization': {
    name: "The Fair Exchange",
    icon: 'paid',
    tone: 'mint',
    story: { premise: "At the Exchange, value changes hands and everyone should feel it was fair.", mission: "Choose a price, design a fair paywall, and read what the numbers say." },
  },
  'launch-marketing': {
    name: "Megaphone Square",
    icon: 'campaign',
    tone: 'indigo',
    story: { premise: "Megaphone Square is full of people who have not heard of you yet.", mission: "Say what you offer clearly and let the first people find it." },
  },
  'freelance-ai-dev': {
    name: "The Open Workshop",
    icon: 'work',
    tone: 'violet',
    story: { premise: "The Workshop doors are open to anyone who needs something built.", mission: "Find your first client, scope it honestly, and deliver it well." },
  },
  'ai-software-business': {
    name: "Founders Row",
    icon: 'business_center',
    tone: 'mint',
    story: { premise: "On Founders Row, a small sign today can become a real business tomorrow.", mission: "Choose your model, win your first customer, and keep a pace you can keep." },
  },
  'build-with-lovable': {
    name: "Pop-Up Plaza",
    icon: 'web',
    tone: 'violet',
    story: { premise: "Pop-Up Plaza is where an idea can open its doors to visitors by the end of the day.", mission: "Plan it, prompt it, and welcome your first visitors." },
  },
  'publish-to-app-stores': {
    name: "Harbor Gate",
    icon: 'rocket_launch',
    tone: 'mint',
    story: { premise: "At Harbor Gate, every ship waits for a green light before it sails.", mission: "Prepare your papers, pass the check, and set sail." },
  },
  'deploy-with-vercel': {
    name: "Switchyard Station",
    icon: 'cloud_upload',
    tone: 'indigo',
    story: { premise: "Switchyard Station sends every finished project down the right track to the world.", mission: "Connect it, ship it, and know how to turn back if the signal changes." },
  },
  // Programming Fundamentals (2026-11-16).
  'programming-fundamentals': {
    name: "Logic Lighthouse",
    icon: 'lightbulb',
    tone: 'indigo',
    story: { premise: "The Lighthouse works because every step of its routine happens in the right order, every night.", mission: "Learn to think in clear steps, one module at a time, until you can build and explain a program of your own." },
  },
  // Data Structures and Algorithms (2026-11-16).
  'data-structures-algorithms': {
    name: "Archive Atrium",
    icon: 'account_tree',
    tone: 'violet',
    story: { premise: "The Archive Atrium holds millions of records, and the librarians find any one of them in a moment because every shelf has a purpose.", mission: "Learn how data is shelved, found and ordered, one module at a time, until you can choose the right shelf for any problem." },
  },
  // Object-Oriented Programming (2026-11-16).
  'object-oriented-programming': {
    name: "The Parts Foundry",
    icon: 'construction',
    tone: 'violet',
    story: { premise: "In the Foundry, every machine is assembled from parts that each know exactly one job.", mission: "Shape the parts, trust their boundaries and combine them, until you can design a system others can build on and explain why it holds together." },
  },
  // Soft Skills for the Modern Workplace (2026-11-17).
  'soft-skills-workplace': {
    name: 'The Common Room',
    icon: 'groups',
    tone: 'mint',
    story: { premise: 'In the Common Room, people from every kind of job meet, and what they say and how they say it decides whether the work gets done.', mission: 'Practise real conversations, write messages that land and plan your next steps, until you can work with anyone and show it.' },
  },
  // Generative AI: From Fundamentals to Real-World Applications (2026-11-17).
  'generative-ai-applications': {
    name: 'The Spark Studio',
    icon: 'auto_awesome',
    tone: 'violet',
    story: { premise: 'In the Spark Studio, words turn into pictures, voices and plans, and the people who do well are the ones who ask clearly and check what comes back.', mission: 'Learn how generative AI works, make things with it, test what it tells you, and build something small that helps a real person.' },
  },
  // Finding International Clients (2026-11-17).
  'international-clients': {
    name: 'The Open Market',
    icon: 'public',
    tone: 'indigo',
    story: { premise: 'In the Open Market, stalls from every country trade in trust, and the freelancers who thrive are the ones who show up with honest proof and a clear offer.', mission: 'Find your niche, research real prospects, earn a stranger\u2019s trust and agree your first project, until a client on the other side of the world says yes.' },
  },
  // Time Management and Productivity (2026-11-17).
  'time-management-productivity': {
    name: 'The Clockwork Workshop',
    icon: 'schedule',
    tone: 'indigo',
    story: { premise: 'In the Clockwork Workshop, every bench has a clock and a plan, and the makers who last are the ones who build rest into the schedule.', mission: 'Sort what matters, plan a day that can survive a surprise, protect your focus and put AI to work for you, until your week feels like yours.' },
  },
};

const KIND_FALLBACK: Record<string, WorldTone> = { starter: 'indigo', career: 'violet', mini: 'mint', path: 'indigo', standard: 'violet' };

/** The theme of a course; a course that has none yet still gets a plain world from its own title and icon. */
export function worldThemeFor(course: { id: string; kind: string; title: string; icon: string }, language: Language = 'en'): WorldTheme {
  const known = WORLD_THEMES[course.id];
  if (known) {
    const text = language === 'fil' ? WORLD_TEXT_FIL[course.id] : undefined;
    return text ? { ...known, name: text.name, story: { premise: text.premise, mission: text.mission } } : known;
  }
  return {
    name: course.title,
    icon: course.icon as MaterialSymbolName,
    tone: KIND_FALLBACK[course.kind] ?? 'violet',
    story: language === 'fil' ? fallbackWorldStoryFil(course.title) : { premise: `${course.title} is a world of its own, with missions that build on each other.`, mission: 'Take them one at a time.' },
  };
}
