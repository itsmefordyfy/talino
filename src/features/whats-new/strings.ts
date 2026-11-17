import { defineStrings } from '@/lib/i18n';

/** The notes by id; `lib/release-notes.ts` says which version has which. English only (owner's standing rule: no Filipino text), so `fil` copies it. */
const en = {
  title: 'What’s new',
  version: (version: string) => `Version ${version}`,
  headline: 'What’s new in Talino',
  gotIt: 'Continue',
  empty: 'Nothing new to show for this version.',
  items: {
    aiJourney: { title: 'Your AI journey', body: 'Home is now a learning journey from Beginner to Expert: every course in the order that builds your skills, always showing where you left off. Home shows the lessons of the course you are learning as a connected timeline: switch course right there, or see every course on the journey.' },
    programmingFundamentals: { title: 'Programming Fundamentals', body: 'A new beginner course, Think Like a Programmer: 12 modules and 60 lessons on how software works, from breaking down problems to building and testing a small expense tracker, with practice you run in the app and Tali beside you.' },
    dataStructuresAlgorithms: { title: 'Data Structures and Algorithms', body: 'A new intermediate course with 72 lessons in 19 modules: arrays, linked lists, stacks, queues, hash tables, trees, heaps, graphs, searching and sorting, with interactive visualizers you can step through and back, practice you run in the app, and a smart task manager to build at the end.' },
    generativeAi: { title: 'Generative AI: From Fundamentals to Real-World Applications', body: 'A new beginner course with 67 lessons in 12 modules: how generative AI works, prompting, images, audio and video, multimodal input, answers grounded in your own documents, agents, business use, building a small AI feature and using it responsibly. Run live prompt labs on a real model, build workflows with a human in the loop, and finish four projects.' },
    softSkills: { title: 'Soft Skills for the Modern Workplace', body: 'A new beginner course with 54 lessons in 10 modules on communication, teamwork, thinking, time, emotions, presenting, adapting, professionalism, clients and your career. Practise with AI: hold realistic conversations with a simulated client, manager or interviewer, and get a coach to review messages you write. Three projects turn it into work you can show.' },
    internationalClients: { title: 'Finding International Clients', body: 'A new beginner course with 52 lessons in 10 modules for freelancers and VAs who want clients abroad: choose a niche, build an honest portfolio and profile, research real prospects, write outreach and proposals, and practise discovery calls and negotiation with a simulated client. A message coach reviews what you write, and three projects take you from profile to campaign to a first contract simulation.' },
    timeProductivity: { title: 'Time Management and Productivity', body: 'A new beginner course with 43 lessons in 10 modules on priorities, planning a day, focus, procrastination, simple tools and working with AI without burning out. Practise with an Eisenhower matrix, a day planner that spots conflicts, a Pomodoro timer and a prompt playground, then plan a day that survives a surprise. Three projects turn it into a system you will keep.' },
    aiDevelopment: { title: 'AI-Assisted Development', body: 'A seven-course path on building real software with ChatGPT, Claude, Claude Code, Cursor and Codex, with an AI tools guide and a quick “where should I start?” check.' },
    betterCourses: { title: 'A better Courses tab', body: 'Browse by level, category and AI tool, find short courses, and search with suggestions and filters for level, tools, Free or Pro, and your progress.' },
    coach: { title: 'Choose your coach', body: 'Pick Tali or Tala. Each has their own look and their own voice that reads your lessons aloud.' },
    career: { title: 'Career tools', body: 'Track job applications, set goals, log freelance income, build a résumé and a shareable portfolio, and practise with a mock interview.' },
    ipad: { title: 'Talino on iPad', body: 'A layout built for the bigger screen, with your course outline beside the lesson. Works with Split View and Stage Manager.' },
    backup: { title: 'Backup & Restore', body: 'Your progress is backed up automatically to iCloud on iPhone, and you can export and import a backup file.' },
  },
};

export const whatsNewStrings = defineStrings({ en, fil: en });
