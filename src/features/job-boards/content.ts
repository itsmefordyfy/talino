import type { Tone } from '@/constants/theme';

/**
 * Where to look for work, for the people Talino is for: tech and AI jobs, Philippine boards (the learners are mostly Filipino),
 * remote boards and freelance marketplaces. Written by Claude, 2026-11-15, from what each site says about itself (no traffic
 * figures, prices or success rates, which change and can't be checked here). Addresses are each site's own front page, so a link can't
 * go stale. English, like the posts and proposals the learner will read there. Talino is not affiliated with any of them.
 */
export const JOB_GROUPS = ['tech', 'ph', 'remote', 'freelance'] as const;
export type JobGroup = (typeof JOB_GROUPS)[number];

export const GROUP_TONES: Record<JobGroup, Tone> = { tech: 'violet', ph: 'rose', remote: 'teal', freelance: 'amber' };

export type JobBoard = {
  id: string;
  group: JobGroup;
  name: string;
  /** The site's own address (https, a front page or its jobs page). */
  url: string;
  /** One line: what the board is and who it suits. */
  blurb: string;
  /** How to get hired there: a few short, practical tips. */
  strategy: readonly string[];
  /** Something to know before starting (a membership fee, a screening process). */
  note?: string;
};

export const JOB_BOARDS: readonly JobBoard[] = [
  {
    id: 'linkedin',
    group: 'tech',
    name: 'LinkedIn Jobs',
    url: 'https://www.linkedin.com/jobs/',
    blurb: 'Search tech roles anywhere and message the people who post them.',
    strategy: ['Set your headline to the role you want, not your current one.', 'Turn on “Open to work” for recruiters and add the skills you actually use.', 'After applying, send the poster a two-line note naming one thing you built.'],
  },
  {
    id: 'wellfound',
    group: 'tech',
    name: 'Wellfound',
    url: 'https://wellfound.com/jobs',
    blurb: 'Startup jobs, many open to remote applicants, with a short profile instead of a long résumé.',
    strategy: ['Fill in your profile fully: startups read it before your résumé.', 'Link your best project and say in one line what problem it solved.', 'Filter for remote and your skills, then apply to a few roles a day, each with its own note.'],
  },
  {
    id: 'hn-jobs',
    group: 'tech',
    name: 'Hacker News Jobs',
    url: 'https://news.ycombinator.com/jobs',
    blurb: 'Jobs posted by startups in Y Combinator’s network, straight from the founders’ own words.',
    strategy: ['Read the post for what they build and mention it in your first message.', 'Keep your application short: founders skim.', 'Check your portfolio link works on a phone before you send it.'],
  },
  {
    id: 'onlinejobs-ph',
    group: 'ph',
    name: 'OnlineJobs.ph',
    url: 'https://www.onlinejobs.ph',
    blurb: 'A Philippines-focused board where employers abroad hire Filipino remote workers.',
    strategy: ['Complete your profile with a clear photo, your skills and your working hours.', 'Reply to a post with what you can do for that employer, not a list of everything you know.', 'Keep proof ready: a portfolio link and one short sample of your work.'],
  },
  {
    id: 'kalibrr',
    group: 'ph',
    name: 'Kalibrr',
    url: 'https://www.kalibrr.com',
    blurb: 'Jobs from Philippine companies, including tech and startup roles, with online assessments.',
    strategy: ['Complete your profile: companies filter by it.', 'Apply early; popular roles close fast.', 'Practise the online assessment topics before you start one.'],
  },
  {
    id: 'jobstreet-ph',
    group: 'ph',
    name: 'JobStreet Philippines',
    url: 'https://www.jobstreet.com.ph',
    blurb: 'A long-running Philippine job site with roles from small teams to large companies.',
    strategy: ['Save a search for your role and city so new posts come to you.', 'Match the words of the post in your résumé, honestly.', 'Note the company’s name and the date you applied in your Talino tracker.'],
  },
  {
    id: 'indeed-ph',
    group: 'ph',
    name: 'Indeed Philippines',
    url: 'https://ph.indeed.com',
    blurb: 'A broad search across many Philippine employers; try “developer”, “support” or “remote”.',
    strategy: ['Search the exact title you want and also two nearby titles.', 'Upload one résumé written for the role, not a general one.', 'Check the company’s own site before you apply.'],
  },
  {
    id: 'weworkremotely',
    group: 'remote',
    name: 'We Work Remotely',
    url: 'https://weworkremotely.com',
    blurb: 'A large board of remote-only roles, from programming to support and design.',
    strategy: ['Read the “where you can work” line first: some posts limit countries.', 'Lead with the time zone you can cover.', 'Apply with a short note about how you work without being watched.'],
  },
  {
    id: 'remoteok',
    group: 'remote',
    name: 'Remote OK',
    url: 'https://remoteok.com',
    blurb: 'Remote jobs updated often, easy to filter by skill such as Python, React or AI.',
    strategy: ['Filter by your main skill and sort by newest.', 'Apply within a day or two of a post going up.', 'Show a project that fits the stack named in the post.'],
  },
  {
    id: 'remotive',
    group: 'remote',
    name: 'Remotive',
    url: 'https://remotive.com',
    blurb: 'A curated remote job board with software, support and product roles.',
    strategy: ['Pick a category and read a few posts to learn the words employers use.', 'Match your résumé’s top lines to the role.', 'Follow the company’s instructions exactly; some ask for a specific subject line.'],
  },
  {
    id: 'himalayas',
    group: 'remote',
    name: 'Himalayas',
    url: 'https://himalayas.app',
    blurb: 'Remote jobs and company profiles, so you can read about a team before you apply.',
    strategy: ['Read the company page and mention one thing that fits you.', 'Check which countries the role accepts.', 'Keep a list of companies you like and watch for their new posts.'],
  },
  {
    id: 'workingnomads',
    group: 'remote',
    name: 'Working Nomads',
    url: 'https://www.workingnomads.com',
    blurb: 'Hand-picked remote jobs across development, design, marketing and more.',
    strategy: ['Browse by category and note the skills that repeat.', 'Use those repeated skills as the first line of your résumé.', 'Apply to roles that accept your country; skip the rest.'],
  },
  {
    id: 'flexjobs',
    group: 'remote',
    name: 'FlexJobs',
    url: 'https://www.flexjobs.com',
    blurb: 'Remote and flexible jobs that the site checks before listing.',
    note: 'Needs a paid membership to see and apply to jobs.',
    strategy: ['Look at a few listings first to see if the roles fit before you pay.', 'Set up job alerts for your role.', 'Treat it as one source among several, not the only one.'],
  },
  {
    id: 'upwork',
    group: 'freelance',
    name: 'Upwork',
    url: 'https://www.upwork.com',
    blurb: 'A large freelance marketplace with ongoing and one-off projects in tech.',
    strategy: ['Start with small, clearly described jobs to earn your first reviews.', 'Open every proposal with the client’s problem, then your first step.', 'Show one close example of past work and keep the proposal short.'],
  },
  {
    id: 'fiverr',
    group: 'freelance',
    name: 'Fiverr',
    url: 'https://www.fiverr.com',
    blurb: 'Sell a clearly described service at a fixed price and let clients find you.',
    strategy: ['Offer one narrow service, such as “fix a bug in your website”.', 'Use a title a buyer would type into search.', 'Show real before-and-after examples in your gig.'],
  },
  {
    id: 'freelancer',
    group: 'freelance',
    name: 'Freelancer.com',
    url: 'https://www.freelancer.com',
    blurb: 'Bid on projects from small tasks to longer contracts.',
    strategy: ['Bid on projects you could finish well, not on every post.', 'Ask one smart question in your bid to show you read it.', 'Be clear about what is and isn’t included in your price.'],
  },
  {
    id: 'toptal',
    group: 'freelance',
    name: 'Toptal',
    url: 'https://www.toptal.com',
    blurb: 'A network that screens freelancers before matching them with clients.',
    note: 'Applicants go through a screening process, so it suits people with some experience.',
    strategy: ['Build a few real projects first; screening looks for proven skill.', 'Prepare to explain your decisions, not only your code.', 'Apply once you have solid work to show.'],
  },
  {
    id: 'contra',
    group: 'freelance',
    name: 'Contra',
    url: 'https://contra.com',
    blurb: 'A portfolio-first network for independent professionals.',
    strategy: ['Put your three best projects first with a sentence each on the result.', 'Write your profile for a client, not for other developers.', 'Share your profile link in your proposals.'],
  },
  {
    id: 'peopleperhour',
    group: 'freelance',
    name: 'PeoplePerHour',
    url: 'https://www.peopleperhour.com',
    blurb: 'A UK-based marketplace with hourly work and fixed-price projects.',
    strategy: ['State your hours and time zone in your offer.', 'Offer a clear first deliverable and a date.', 'Keep a short list of your services ready to paste and adapt.'],
  },
];

export function boardsIn(group: JobGroup | 'all', boards: readonly JobBoard[] = JOB_BOARDS): JobBoard[] {
  return group === 'all' ? [...boards] : boards.filter((board) => board.group === group);
}
