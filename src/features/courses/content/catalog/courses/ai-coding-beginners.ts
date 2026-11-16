import type { Course, Lesson, Project } from '../../types';

const CHECKED = '2026-11-14';

// Every page below was opened on CHECKED, except OpenAI's help-centre articles (they refused automated readers; the article titles and the settings names come from the search listing of those official pages and are flagged in the note itself).
const DOCS = {
  geminiLimits: { label: 'Gemini Apps Help: Usage limits', url: 'https://support.google.com/gemini/answer/16275805' },
  geminiActivity: { label: 'Gemini Apps Help: Manage and delete your activity', url: 'https://support.google.com/gemini/answer/13278892' },
  geminiPrivacy: { label: 'Gemini Apps Privacy Hub', url: 'https://support.google.com/gemini/answer/13594961' },
  chatgptPlans: { label: 'ChatGPT plans (chatgpt.com/pricing)', url: 'https://chatgpt.com/pricing' },
  chatgptData: { label: 'OpenAI Help Center: Data controls in ChatGPT', url: 'https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt' },
  claudeArtifacts: { label: 'Claude Help Center: What are artifacts and how do I use them?', url: 'https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them' },
  claudePrivacy: { label: 'Claude Help Center: Sensitive data in chats, and who can view my conversations', url: 'https://support.claude.com/en/articles/8325621-i-would-like-to-input-sensitive-data-into-my-chats-with-claude-who-can-view-my-conversations' },
  cursorPricing: { label: 'Cursor pricing', url: 'https://cursor.com/pricing' },
  cursorDocs: { label: 'Cursor documentation', url: 'https://cursor.com/docs' },
  mdnContent: { label: 'MDN: Creating the content of your first website', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content' },
  mdnViewport: { label: 'MDN: The viewport meta element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport' },
  mdnForm: { label: 'MDN: Your first form', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Your_first_form' },
  devtools: { label: 'Chrome for Developers: Open Chrome DevTools', url: 'https://developer.chrome.com/docs/devtools/open' },
  wcagContrast: { label: 'W3C: Understanding WCAG 2.2, Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html' },
  ghAccount: { label: 'GitHub Docs: Creating an account on GitHub', url: 'https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github' },
  ghRepo: { label: 'GitHub Docs: Quickstart for repositories', url: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories' },
  ghUpload: { label: 'GitHub Docs: Adding a file to a repository', url: 'https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository' },
  ghCommits: { label: 'GitHub Docs: About commits', url: 'https://docs.github.com/en/pull-requests/reference/commits' },
  ghWhatPages: { label: 'GitHub Docs: What is GitHub Pages?', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages' },
  ghCreatePages: { label: 'GitHub Docs: Creating a GitHub Pages site', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site' },
  ghSource: { label: 'GitHub Docs: Configuring a publishing source for your GitHub Pages site', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site' },
  ghPush: { label: 'GitHub Docs: About push protection', url: 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection' },
  cloudflareUpload: { label: 'Cloudflare Pages docs: Direct Upload', url: 'https://developers.cloudflare.com/pages/get-started/direct-upload/' },
  googleForms: { label: 'Google Docs Editors Help: Create and share a form', url: 'https://support.google.com/docs/answer/2839588' },
};

const lessons: Lesson[] = [
  {
    id: 'ai-coding-beginners-01',
    day: 1,
    title: 'What it means to build software with AI, and what you do not need to know',
    summary: 'See the whole loop of building with AI (ask, read, run, fix), who does which job, and what you can safely skip learning for now.',
    intro: {
      objectives: [
        'Explain in your own words what building software with AI means',
        'Sort the jobs of a small website into what you decide, what the AI drafts and what you must check',
        'Describe the ask, read, run and fix loop you will use for the whole course',
      ],
      why: 'You want something real, such as a page for your own business or for someone you know. Knowing who does which job tells you where your attention matters, and where it is safe to let the AI do the typing.',
    },
    minutes: 15,
    skills: ['ai-building-basics'],
    body: [
      { type: 'paragraph', text: "You do not need to be a programmer to put a real website on the internet. You need a clear idea of what you want, an AI tool that can write the code for it, and the habit of checking what comes back. This course teaches those three things, one small step at a time, and ends with a page you built and published yourself. Nothing here assumes you have ever written code." },
      { type: 'heading', text: 'What software is, in plain words' },
      { type: 'paragraph', text: "**Software** is a set of instructions that a computer follows. The instructions are written down in **files**, which are named pieces of text or data stored on your device, like documents or photos. A **website** is a kind of software: a small collection of files that a **browser** (the program you use to visit pages, such as Chrome, Safari, Edge or Firefox) knows how to read and show as a page." },
      { type: 'paragraph', text: "The language browsers read for the shape of a page is called **HTML**. The instructions for how the page looks (colours, spacing, text size) are called **CSS**. Together they are plain text. That is good news: text is exactly what an AI tool is good at writing." },
      { type: 'heading', text: 'What an AI tool does' },
      { type: 'paragraph', text: "An **AI model** is a program that was trained on a huge amount of text and code. When you type a request to it, called a **prompt**, it writes a reply by predicting, one small piece at a time, what text most likely fits next. Because it has seen a lot of code, its reply can be a working web page. A **chat assistant** such as ChatGPT, Claude or Gemini is an app wrapped around a model so you can talk to it in a normal conversation." },
      { type: 'visual', id: 'ai-model-input-output', caption: 'The model turns your words into a reply, one piece at a time. It does not know your shop; it knows what pages like yours usually look like.' },
      { type: 'paragraph', text: "That last point matters. The AI does not know your shop's name, your prices or your opening hours unless you tell it, and it will happily make some up if you leave a gap. It writes text that looks right. Whether it is right for you is a different question, and only you can answer it." },
      { type: 'heading', text: 'Who does what' },
      {
        type: 'table',
        headers: ['The job', 'Who does it best', 'Why'],
        rows: [
          ['Decide what the page is for and who will read it', 'You', 'Only you know your goal and your visitors'],
          ['Supply the true facts: name, prices, hours, phone number', 'You', 'The AI cannot know them and may invent them'],
          ['Write the first draft of the code', 'The AI', 'It is fast and has seen thousands of similar pages'],
          ['Explain what a piece of code does', 'The AI', 'You can then test its explanation by trying the page'],
          ['Notice that something looks wrong on screen', 'You', 'You are the one looking at the result'],
          ['Decide what is safe to share or publish', 'You', 'The AI does not know what is private'],
        ],
        caption: 'The AI drafts; you decide, supply the truth, look and protect.',
      },
      { type: 'heading', text: 'The loop you will repeat' },
      { type: 'paragraph', text: "Every lesson in this course is a variation of one loop. You **ask** for something in clear words. You **read** what came back (not every symbol, but what it is and roughly what it does). You **run** it, which for a website means opening it in your browser. Then you **fix or change** it by asking again. When you are happy, you publish. The skill is not typing code. It is asking clearly, noticing what is off and keeping control of what goes public." },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The loop: ask, read, run, then change or fix, until you are happy to publish.',
        source: 'flowchart TD\n  A[Ask in clear words] --> B[Read what came back]\n  B --> C[Run it: open it in your browser]\n  C --> D{Is it what you wanted?}\n  D -->|no| E[Change or fix by asking again]\n  E --> B\n  D -->|yes| F[Save it and publish]',
      },
      { type: 'heading', text: 'What you can skip for now' },
      {
        type: 'list',
        items: [
          '**Memorising code.** You will meet some words (like `h1` and `color`) because reading them helps you steer the AI, but you will never be asked to recite them.',
          '**Installing complicated programs.** Everything in this course works with a browser, a free account or two, and a plain text file.',
          '**The command line.** That black window full of typed commands is not needed for a one-page site.',
          '**Understanding how browsers work inside.** You only need to know that a browser opens your files and shows the result.',
        ],
      },
      { type: 'warning', text: "An AI reply can sound completely sure and still be wrong: a made-up price, a phone number that is not yours, a link that goes nowhere. You are the one who checks the facts before anyone else sees the page." },
      {
        type: 'version',
        text: "Free AI chat tools change often. Google's Gemini help page says its free usage limits can change without notice, including when demand is high, and the other chat tools say similar things about their free plans. In this course we name tools and what their free plans include in short dated notes. Always check the current free limits on the tool's own page before you plan around them.",
        checked: CHECKED,
        sources: [DOCS.geminiLimits, DOCS.chatgptPlans],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: think of building a house. You are the owner and the AI is a very fast builder who has never met you. You say how many rooms you want and who will live there. The builder draws up the plan and starts building. But the builder cannot see your family, so if you forget to say that grandma needs a ground-floor bedroom, you will not get one. When the house is up, you walk through it and check that the doors open. The AI is fast at the typing part; you are the person who knows what the house is for and who checks the result. A *prompt* is simply the message you give the builder.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "For an experienced developer the shift is that effort moves from typing to specifying and verifying. Typical failure modes are invented APIs, outdated library usage, silently dropped requirements, and confident explanations of code that does something else. The mitigation is the same as for any untrusted contributor: small diffs, running the thing, tests where they exist, and review before merge. Accountability does not transfer: you own security, licensing and correctness of what ships, which is why this course keeps coming back to checking and to what never goes into a prompt.",
      },
      {
        type: 'takeaways',
        items: [
          'Software is instructions in files; a website is files a browser can open, written in HTML and CSS.',
          'An AI tool predicts text from your prompt. It writes drafts quickly but does not know your facts.',
          'You decide, supply the truth, look at the result and protect what is private; the AI drafts.',
          'The loop is ask, read, run, fix or change, then publish.',
          'You can skip memorising code, complicated installs and the command line for now.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-01-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Three things people get wrong',
          prompt: 'Tap each card to read why the first idea is a mistake.',
          concept: 'what building with AI means',
          cards: [
            { front: '"I have to learn to code for a year before I can build anything."', back: 'Not for a one-page site. You need to describe what you want clearly and check the result. You will pick up the code words as you go because you will keep reading them.' },
            { front: '"If the AI wrote it confidently, it must be right."', back: 'The AI writes what looks likely. It can invent prices, links and phone numbers. You are the checker of facts.' },
            { front: '"The AI will build my whole site perfectly from one request."', back: 'The first draft is a start. Good results come from the loop: look at it, ask for one change, look again.' },
          ],
          hints: [],
          explanation: 'Building with AI is a partnership: you bring the goal and the truth, it brings speed. The loop of asking, reading, running and fixing is what makes the result good.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-01-match-1',
          kind: 'match',
          title: 'Whose job is it?',
          prompt: 'Match each task of building a bakery page to who should handle it.',
          concept: 'your job and the AI\'s job',
          labels: { terms: 'The task', meanings: 'Who handles it' },
          pairs: [
            { term: 'Choosing what the home page should say first', definition: 'You decide: it depends on your goal', note: 'Only you know what your visitors should see first.' },
            { term: 'Producing the first draft of the page code', definition: 'The AI drafts it in seconds', note: 'Writing the first draft is the part the AI is fast at.' },
            { term: 'Confirming the phone number on the page is yours', definition: 'You verify it against the real thing', note: 'The AI cannot know your phone number; it will fill the gap with something that looks right.' },
          ],
          hints: [
            'Ask: could anyone but the owner know this?',
            'The AI is fast at producing text, but it does not know your facts.',
            'Decisions and facts belong to you; the draft belongs to the AI; the final check belongs to you again.',
          ],
          explanation: 'You bring the goals and the facts and check the result; the AI brings fast drafts. That split is how the whole course works.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-01-q1',
        prompt: 'You ask an AI to make a page for your shop and leave out the prices. What is the most likely result?',
        choices: [
          'The page appears with no prices, because the AI refuses to guess',
          'The AI asks the shop for the prices through the internet',
          'The page may show prices that look real but that the AI made up',
        ],
        answer: 2,
        explanation: 'The AI predicts text that fits. Missing facts are often filled with plausible inventions, so you supply the true ones and check them.',
      },
      {
        id: 'ai-coding-beginners-01-q2',
        prompt: 'Which pair names the two things a browser needs to show a simple website?',
        choices: [
          'HTML for the structure of the page, CSS for how it looks',
          'CSS for the structure of the page, HTML for how it looks',
          'A server for the structure, an app store for how it looks',
          'A chat assistant for the structure, a browser for how it looks',
        ],
        answer: 0,
        explanation: 'HTML describes what is on the page and how it is organised; CSS describes the look. Both are plain text files.',
      },
      {
        id: 'ai-coding-beginners-01-q3',
        prompt: 'The page opens, but one of the lines says the shop opens at 8 AM and it really opens at 6 AM. In the loop, what is the best next step?',
        choices: [
          'Publish it right away, because the page opened without any errors on screen',
          'Ask the AI to change that line, then look at the page again',
          'Start over with a different AI tool',
        ],
        answer: 1,
        explanation: 'This is the change step of the loop: ask for the one correction, then run (open) the page and check again. Opening without errors does not mean the facts are right.',
      },
      {
        id: 'ai-coding-beginners-01-q4',
        prompt: 'Which of these do you NOT need to do to finish this course?',
        choices: [
          'Check that the facts on your page are true',
          'Memorise the code the AI writes',
          'Keep private information out of what you share',
          'Look at the page after every change',
        ],
        answer: 1,
        explanation: 'Reading code helps you steer, but nothing here requires memorising it. Checking facts, protecting private information and looking at the result are your jobs.',
      },
      {
        id: 'ai-coding-beginners-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In the builder comparison, what is the "prompt"?',
        choices: [
          'The finished house that the builder hands over at the end of the work',
          'The message you give the builder about what you want',
          'The builder\'s tools',
        ],
        answer: 1,
        explanation: 'A prompt is the instruction you give the AI, like telling the builder how many rooms you want and who will live there.',
      },
      {
        id: 'ai-coding-beginners-01-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate pastes AI-written code into a pull request and says "the AI is usually right". What do you hold the author to?',
        choices: [
          'Nothing extra, because the model has probably seen the pattern many times before and is usually right',
          'Only a style review, because correctness is the model\'s job',
          'The same bar as any contribution: they ran it, can explain it, and it is reviewable in small pieces',
          'Rewriting it by hand, because generated code cannot be merged',
        ],
        answer: 2,
        explanation: 'Accountability stays with the person who submits the change. Generated code is judged like any other code: it runs, it is understood by its author and the diff is reviewable.',
      },
    ],
    task: {
      title: 'Map the jobs for your own idea',
      minutes: 10,
      steps: [
        'Write one sentence about a real person or business you could make a one-page website for (it can be yours or a friend\'s, with their permission).',
        'List five facts the page must get right: for example the name, what is offered, prices, opening hours, how to contact.',
        'Next to each fact, write "mine" if only you or the owner can supply it. All five should say "mine": that is the point.',
        'Write down, in your own words, the four steps of the loop: ask, read, run, fix.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Keep this list: you will paste these facts into your first prompt in lesson 3, so being complete now saves time later.'] },
      { audience: { min: 'advanced' }, steps: ['Write the acceptance criteria you would give a contractor for this page in three bullet points, then note which of them you can verify only by opening the page in a browser on a phone.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-02',
    day: 2,
    title: 'Choosing and setting up your first AI coding tool',
    summary: 'Pick a free AI assistant, set up a folder and a plain text editor, and know what free plans do and do not include.',
    intro: {
      objectives: [
        'Choose a free AI assistant and make an account with it',
        'Create a project folder and name files correctly',
        'Explain what free plans limit, and why you check the current limits yourself',
      ],
      why: 'Every later lesson uses the tool you set up today. A small, correct setup now saves you from confusing problems later, such as a file that is secretly named index.html.txt.',
    },
    minutes: 20,
    skills: ['choose-tools'],
    body: [
      { type: 'paragraph', text: "To build a page with AI you need only a few things: an AI assistant to write the code, a place on your computer to keep the files, a way to turn what the AI writes into a file, and a browser to look at it. This lesson sets all four up. You do not need to pay for anything to follow this course, though free plans have limits, and we will be honest about those." },
      { type: 'heading', text: 'Two kinds of AI tool' },
      { type: 'paragraph', text: "A **chat assistant** is a website or app where you type a request and read the reply. You copy the code it writes into a file yourself. ChatGPT, Claude and Gemini are chat assistants, and each has a free plan. An **AI code editor** is a program you install on your computer where the AI works inside your project folder and can change your files for you. Cursor is one. It is more powerful, and it also has more buttons to understand." },
      { type: 'paragraph', text: "For your first site, a chat assistant is enough, and it is what this course uses. You are not locked in: the way you ask is the same in every tool, so everything you learn carries over to an editor later." },
      {
        type: 'table',
        headers: ['Tool', 'Kind', 'What its free plan offers (check the current limits)'],
        rows: [
          ['ChatGPT', 'Chat assistant', 'Text chats, projects and some file uploads and image creation, with limits that can change and smaller context than paid plans'],
          ['Claude', 'Chat assistant', 'Free plan with session-based usage limits; free users can create artifacts (pages and small tools shown beside the chat)'],
          ['Gemini', 'Chat assistant', 'Free standard limits that refresh over time and can change without notice; a limited context window'],
          ['Cursor', 'AI code editor', 'A free plan with limited agent and chat requests; you install it and open a project folder'],
        ],
        caption: 'All four have a way to start for free today. Plans and limits move; look at each tool\'s own page before you decide.',
      },
      { type: 'version', text: "As of 2026-11-14, ChatGPT's plans page lists text chats, chat history and projects on the Free plan, with file uploads, image creation, memory and some other features marked limited, and smaller context windows than paid plans. Gemini's help page says free users get standard limits that refresh and may change without notice. Claude's help centre says free users can create artifacts. Cursor's pricing page lists a Free plan with limited agent and chat requests. Plan names and limits change often; this course never relies on a price or an exact number.", checked: CHECKED, sources: [DOCS.chatgptPlans, DOCS.geminiLimits, DOCS.claudeArtifacts, DOCS.cursorPricing], plans: 'Free plans of ChatGPT, Claude, Gemini and Cursor' },
      { type: 'heading', text: 'How to choose' },
      { type: 'list', items: [
        '**Pick one and stay with it for this course.** Switching tools mid-project makes it hard to tell what went wrong. Try another one later.',
        '**Use whichever you can sign into today.** If you already use one of them, use that.',
        '**Prefer the official website or app.** Type the address yourself or use the store listing from the company. Look-alike sites exist.',
        '**Read the screen that tells you about limits.** When you hit a limit, the tool says when you can continue. That is normal on a free plan, not a mistake of yours.',
      ] },
      { type: 'heading', text: 'The rest of your setup' },
      { type: 'paragraph', text: "Make a **folder** (a container for files, like a paper folder) called `my-first-site` somewhere easy to find, such as your Documents folder. Everything for your website goes in this folder. Next you need a way to create a **plain text file**: a file with no fonts, no bold and no layout, just letters. Notepad on Windows and TextEdit on Mac (switched to plain text with Format, then Make Plain Text) can do it. A code editor works too. Do not use a word processor like Word." },
      { type: 'paragraph', text: "Two traps catch many first-timers. First, a file has a name and an **extension**, the letters after the dot that tell your computer what kind of file it is. `index.html` has the extension `.html`. Some computers hide extensions, so a file you named `index.html` can actually be `index.html.txt`, which your browser will not treat as a web page. Turn on \"show file extensions\" in your file manager, and check. Second, never rename the file to something like `final-final2.html` before you publish: the front page of a site is normally called `index.html`, and lesson 10 explains why." },
      { type: 'tip', text: "Do a tiny test now. Ask your assistant: \"Write the words Hello world as a very small web page in a file called index.html.\" Save the reply in your folder as index.html and double-click it. If a browser shows the words, your setup works." },
      {
        type: 'prompt',
        label: 'Your setup test',
        text: 'I have never written code. Please write a very small web page that shows the words "Hello world". Give me everything in one file called index.html, and tell me, in simple steps, how to save it on my computer and open it in my browser.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a chat assistant is like texting a very knowledgeable friend. You type, they answer, and you decide what to do with the answer. An AI code editor is like that friend sitting at your desk, able to open your folder and change the papers in it. Both are fine; the texting friend is easier to start with. A *free plan* is like a free sample: you get to try it, but there is a limit, and the shop can change the limit. That is why we always tell you to check the tool's own page rather than trust a number in a course.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "If you already work in an editor or terminal, the useful distinction is how each tool gets context and what it may change. A chat tool sees only what you paste; an editor agent sees the repository, can edit files and may run commands, so it needs permission settings, review of diffs and a version-controlled project. For a site this small the chat route has the lowest blast radius, and you keep the discipline of reading every change. Treat free-plan quotas and context sizes as variable infrastructure: design your workflow so a lost session costs you a re-paste, not the project.",
      },
      {
        type: 'takeaways',
        items: [
          'A chat assistant writes code you copy into files; an AI code editor works inside your project folder. A chat assistant is enough for this course.',
          'ChatGPT, Claude, Gemini and Cursor all have a free way to start, with limits that change: check the tool\'s own page.',
          'Make one project folder, use a plain text file and make sure the name really is index.html, not index.html.txt.',
          'Use the official site or app of the tool, and stay with one tool through the course.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-02-scenario-1',
          kind: 'scenario',
          title: 'Which first step?',
          prompt: 'Pick the best way for Ana to start.',
          concept: 'choosing a first tool',
          situation: 'Ana runs a small laundry shop. She has a laptop with a browser and no spare time. She wants a one-page site and has never written code. A friend tells her to install three programs, a terminal and a code editor first.',
          options: [
            { text: 'Sign in to one free chat assistant, make a folder called my-first-site and ask it for a small page she can save as index.html.', consequence: 'She has a page on her screen in minutes, using tools she can already use. She can move to an editor later if she wants.', quality: 'best' },
            { text: 'Install everything her friend listed before she tries anything.', consequence: 'She spends the evening fighting installers and gives up before she has seen a single page.', quality: 'poor' },
            { text: 'Wait until she has paid for the most expensive plan of an AI tool.', consequence: 'She pays for features she does not need, and the first page is not any better.', quality: 'poor' },
            { text: 'Try three chat assistants at once and mix the pieces they write.', consequence: 'Each tool writes differently, so the pieces do not fit and she cannot tell which one caused the problems.', quality: 'acceptable' },
          ],
          hints: [
            'What is the smallest setup that gets her a visible page today?',
            'She only needs a browser, an assistant and one file.',
            'Start with one free chat assistant and a folder.',
          ],
          explanation: 'The fastest way to learn is to see a page early with the fewest moving parts. One free assistant and one folder is enough, and everything carries over to fancier tools later.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-02-match-1',
          kind: 'match',
          title: 'Which tool fits the situation?',
          prompt: 'Match each situation to the kind of tool that fits it best.',
          concept: 'chat assistant versus code editor',
          labels: { terms: 'The situation', meanings: 'The best fit' },
          pairs: [
            { term: 'You want to paste a question and read an answer, nothing installed', definition: 'A chat assistant in your browser', note: 'A chat assistant needs no install: you read the answer and copy what you need.' },
            { term: 'You want the AI to change the files in your project folder directly', definition: 'An AI code editor opened on your folder', note: 'An editor works inside the folder, so it can edit files for you.' },
            { term: 'Your file will not open as a web page and its name shows as index.html.txt', definition: 'Fix the file name and turn on file extensions', note: 'No AI tool will fix this one: the name itself is wrong, so rename it to index.html.' },
          ],
          hints: [
            'Which situation involves the AI touching your files?',
            'One of the three is not about an AI tool at all.',
            'A name ending in .txt means the computer treats it as plain text.',
          ],
          explanation: 'Chat assistants answer; editors act on your folder; and some problems, like a wrong file name, are simply fixed by you.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-02-q1',
        prompt: 'What is the main difference between a chat assistant and an AI code editor?',
        choices: [
          'A chat assistant only works on phones',
          'An editor can change files in your folder; a chat assistant gives you replies to copy',
          'A chat assistant writes only HTML, while an editor writes only CSS and nothing else',
        ],
        answer: 1,
        explanation: 'The key difference is where the AI works. An editor can edit files in your folder; a chat assistant gives you text you place in files yourself.',
      },
      {
        id: 'ai-coding-beginners-02-q2',
        prompt: 'You saved your page and double-clicked it, but it opens as plain text in a text editor. What is the most likely cause?',
        choices: [
          'The file is secretly named index.html.txt',
          'Your browser is out of date',
          'The AI wrote the page in the wrong language',
          'You have used up your free plan',
        ],
        answer: 0,
        explanation: 'Hidden extensions often turn index.html into index.html.txt, which the computer treats as plain text. Show file extensions and rename the file.',
      },
      {
        id: 'ai-coding-beginners-02-q3',
        prompt: 'A course says "the free plan lets you send 50 messages a day". What is the sensible way to treat that?',
        choices: [
          'Trust it completely, because a course always has the current numbers in it',
          'Read it as a rough idea, and check the tool\'s own page for the real current limits',
          'Ignore it, because free plans have no limits',
        ],
        answer: 1,
        explanation: 'Limits change without notice. The tool\'s own page and the message it shows you when you reach a limit are the sources to trust.',
      },
      {
        id: 'ai-coding-beginners-02-q4',
        prompt: 'Why does this course suggest sticking with one AI tool for the whole project?',
        choices: [
          'Because the other tools are unsafe and should be avoided by every beginner',
          'Because they cannot read HTML',
          'Because switching mid-project makes it hard to tell what caused a problem',
        ],
        answer: 2,
        explanation: 'Different tools write differently. Using one while you learn lets you see the effect of your own requests.',
      },
      {
        id: 'ai-coding-beginners-02-q5',
        audience: { max: 'beginner' },
        prompt: 'In the "texting a friend" comparison, what is a free plan?',
        choices: [
          'A free sample with a limit that the shop can change',
          'A permanent promise of unlimited use that the company can never take back',
          'A different, smaller internet',
        ],
        answer: 0,
        explanation: 'A free plan lets you try the tool, within limits that the company is allowed to change.',
      },
      {
        id: 'ai-coding-beginners-02-q6',
        audience: { min: 'advanced' },
        prompt: 'You will let an editor-based agent change files in a repository for the first time. Which setup choice reduces the risk most?',
        choices: [
          'Disable review so the agent can work without interruption',
          'Use the repository as it is and rely on the agent\'s own summary of what it did',
          'Keep the project under version control and review every diff before accepting changes',
          'Paste the whole repository into a chat assistant instead',
        ],
        answer: 2,
        explanation: 'Version control plus diff review makes any agent change visible and reversible. Trusting a summary or disabling review removes your safety net.',
      },
    ],
    task: {
      title: 'Set up your tool and folder',
      minutes: 15,
      steps: [
        'Pick one chat assistant (ChatGPT, Claude or Gemini) and sign in or make a free account on its official website or app.',
        'Create a folder called `my-first-site` in a place you can find, and turn on showing file extensions in your computer\'s file settings.',
        'Run the setup test prompt from this lesson and save the answer in the folder as index.html. Double-click it to open it in your browser.',
        'If it shows as plain text, look at the file name: fix it so it ends in .html only.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the assistant: "Explain, as if I have never coded, what each line of this file does." Read the answer next to the file.'] },
      { audience: { min: 'advanced' }, steps: ['Note the context limit and message limit your chosen free plan shows, and write down how you would restart a session with the minimum you must re-paste.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-03',
    day: 3,
    title: 'Your first prompt: a one-page website',
    summary: 'Write a clear request with your goal, facts and look, and turn the AI\'s reply into a real page on your screen.',
    intro: {
      objectives: [
        'Write a prompt with a goal, true facts, a look and the form of the answer',
        'Save an AI reply as index.html and open it in a browser',
        'Compare a vague request with a clear one and say why one works better',
      ],
      why: 'This is the moment the course becomes real: your own words turn into a page you can look at. A clear first prompt saves rounds of fixing later.',
    },
    minutes: 25,
    skills: ['write-prompts', 'read-generated-code'],
    body: [
      { type: 'paragraph', text: "Today you ask for your first page. We will use a made-up shop, Mila's Kakanin, a stall in Naga City that sells homemade rice cakes. You will swap in your own real person or business for your own page. The skill you are practising is one you will use for the rest of your life with AI: asking so clearly that the answer is close to what you wanted the first time." },
      { type: 'heading', text: 'What makes a request clear' },
      { type: 'paragraph', text: "Compare two requests. The first is: \"Make me a website.\" The AI has to guess everything: what for, for whom, what it says, what it looks like. It will guess, and the guess will be a generic page about nothing. The second request gives the AI what it needs. Four ingredients make most requests work:" },
      { type: 'list', items: [
        '**Goal:** what the page is for and who reads it ("a one-page site so customers in Naga City can see what we sell and order by email").',
        '**Context and true facts:** names, prices, hours, contact details. Real ones, written out, so the AI has nothing to invent.',
        '**Look and limits:** the feel you want ("warm and simple, brown and cream, easy to read on a phone") and anything to avoid.',
        '**The form of the answer:** how you want the reply ("everything in one file called index.html, and simple steps to save and open it").',
      ] },
      {
        type: 'prompt',
        label: 'A first prompt, copy and adapt it',
        text: "I have never written code. Please make a one-page website for my small business. It is called Mila's Kakanin. We sell homemade rice cakes in Naga City, Philippines: biko for ₱80 per tray, puto for ₱60 per dozen, and sapin-sapin for ₱120 per tray. Customers order by email one day before. We are open Monday to Saturday, 6 AM to 12 noon. Make it warm and simple, with brown and cream colours, easy to read on a phone. Give me everything in one file called index.html, and tell me in simple steps how to save it and open it.",
      },
      { type: 'paragraph', text: "Notice that nothing in that prompt needs code knowledge. It says who, what, how much, when and what feel. Notice also the words \"I have never written code\": telling the AI your level changes how it explains things." },
      { type: 'heading', text: 'What comes back' },
      { type: 'paragraph', text: "The AI replies with a short message and a block of code. Below is a real reply of that kind: one file with everything the browser needs. (Different tools, and even the same tool on another day, write slightly different code. That is normal.) Do not try to understand all of it yet. Lesson 4 walks through it piece by piece. Two small things help you read it already: the words inside `<title>` appear in the browser tab, not on the page, and anything written between `<!--` and `-->` is a **comment**, a note for people reading the code that the browser skips." },
      {
        type: 'code',
        language: 'html',
        label: 'index.html (what the AI sent back)',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mila's Kakanin</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      color: #3b2a20;
      background: #fff8ee;
    }
    header {
      background: #7a3e1d;
      color: white;
      padding: 32px 16px;
      text-align: center;
    }
    main {
      max-width: 600px;
      margin: 0 auto;
      padding: 16px;
    }
    h2 {
      color: #7a3e1d;
    }
    .button {
      display: inline-block;
      background: #7a3e1d;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
    }
    footer {
      text-align: center;
      padding: 16px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <header>
    <h1>Mila's Kakanin</h1>
    <p>Homemade rice cakes, made fresh every morning.</p>
  </header>
  <main>
    <h2>What we sell</h2>
    <ul>
      <li>Biko: ₱80 per tray</li>
      <li>Puto: ₱60 per dozen</li>
      <li>Sapin-sapin: ₱120 per tray</li>
    </ul>
    <h2>How to order</h2>
    <p>Message us one day before. We deliver within Naga City.</p>
    <a class="button" href="mailto:mila@example.com">Email us to order</a>
  </main>
  <footer>
    Open Monday to Saturday, 6 AM to 12 noon
  </footer>
</body>
</html>`,
      },
      { type: 'heading', text: 'From the chat to your screen' },
      { type: 'paragraph', text: "The code block is only text on the chat page. To make it a website you save it in a file and open the file in your browser. The steps are always the same:" },
      { type: 'list', ordered: true, items: [
        'Use the copy button on the code block (or select all of it and copy).',
        'Open your plain text editor, paste, and save the file as `index.html` inside your `my-first-site` folder. Check the name does not end in `.txt`.',
        'Double-click `index.html`. Your browser opens it. That is your page, on your own computer, not on the internet yet.',
      ] },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Your words become code in a chat; you save it as a file; your browser turns the file into a page.',
        source: 'sequenceDiagram\n  participant You\n  participant AI as AI assistant\n  participant File as index.html\n  participant Browser\n  You->>AI: Prompt: goal, facts, look, form of the answer\n  AI-->>You: Reply with code\n  You->>File: Paste and save as index.html\n  You->>Browser: Open the file\n  Browser-->>You: Shows the page',
      },
      { type: 'version', text: "MDN's beginner guide describes the same workflow: create a folder, create a file named index.html inside it, put the code in, and open that file in a web browser. It also notes that any editor that saves plain text files will do. Some chat tools can show a web page right in the conversation (Claude's artifacts, for instance, are available on its free plan and require its file-creation setting to be on), but copying the file out and opening it yourself works with every tool and is what we practise.", checked: CHECKED, sources: [DOCS.mdnContent, DOCS.claudeArtifacts] },
      { type: 'warning', text: "The page above shows an example email address, mila@example.com. When you use the prompt for a real page, make sure the contact details are yours, and look at what the AI actually wrote. Never assume a phone number or email on the page is correct just because the page looks finished." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: the AI's reply has two parts. The chatty part is for you (\"Here is your page, save it like this\"). The block of code is the file's contents, like the words of a recipe. The recipe is not food until someone cooks it, and the code is not a page until your browser reads it. Saving it as `index.html` is putting the recipe on a card with the right name on the front; double-clicking is handing the card to the cook. The word *browser* only means the program you already use to look at websites.",
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: "If you have built small projects, you may prefer to ask for a split structure from the start: index.html, style.css and an images folder, with relative paths. That keeps diffs small when you later ask for changes. A single file is chosen here only so a complete beginner has exactly one thing to save and open, and because it keeps the first-run failure surface small.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat a first prompt as a lightweight spec: goal, audience, concrete content, constraints, and an output contract (a single file, runnable without a build step). That contract is what lets you verify in seconds: it opens, it matches the content table, it is readable at phone width. Anything the prompt leaves open is a decision the model makes for you silently, so omitted requirements become unreviewed assumptions. Supplying real data in the prompt also removes the most common hallucination: invented business facts.",
      },
      {
        type: 'takeaways',
        items: [
          'A clear request has a goal, true facts, a look and the form you want the answer in.',
          'Telling the AI you are a beginner changes how it explains things.',
          'The AI\'s code block is just text until you save it as a file named index.html and open that file in your browser.',
          'Check the details on the page yourself, especially names, prices and contact information.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-03-scenario-1',
          kind: 'scenario',
          title: 'Which request is clearer?',
          prompt: 'Pick the request most likely to give a useful first page.',
          concept: 'writing a clear prompt',
          situation: 'Ben repairs bicycles in Iloilo City. He wants a page that tells customers what he fixes, how much it costs and when he is open. Here are four things he could type.',
          options: [
            { text: 'Make a website for my bike shop.', consequence: 'The AI invents a shop name, services and prices. Ben has to correct nearly every line.', quality: 'poor' },
            { text: 'Make a one-page site for Ben\'s Bike Repair in Iloilo City. Services: flat tire fix ₱100, chain replacement ₱250, full tune-up ₱500. Open Tuesday to Sunday, 8 AM to 5 PM. Customers call 0917 000 0000. Use blue and white, easy to read on a phone. Put everything in one file called index.html and tell me how to save and open it.', consequence: 'The page has Ben\'s real name, services and hours on the first try, in a look he asked for, in a file he can open.', quality: 'best' },
            { text: 'Make a professional, modern, amazing website for my bike shop with great design.', consequence: 'The words sound impressive but say nothing specific, so the AI fills the gaps with its own ideas.', quality: 'poor' },
            { text: 'Make a site for Ben\'s Bike Repair with services and prices and hours.', consequence: 'The shop name is right, but the AI invents the services, prices and hours because Ben did not supply them.', quality: 'acceptable' },
          ],
          hints: [
            'Which request leaves the AI nothing to invent?',
            'Look for real facts, a look, and a file name.',
            'The long one with names, prices, hours and the file format.',
          ],
          explanation: 'Specific facts, a stated look and a named output file leave the AI nothing to guess. Vague praise words like "professional" and "amazing" do not tell it anything it can use.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-03-predict-1',
          kind: 'predict-output',
          title: 'What will the page show?',
          story: 'You save this file and open it in your browser.',
          prompt: 'Which words appear on the page itself (not in the browser tab)? One line each, top to bottom.',
          concept: 'what a browser shows',
          language: 'html',
          code: `<html>
<head><title>Kakanin shop</title></head>
<body>
  <!-- TODO: add prices -->
  <h1>Mila's Kakanin</h1>
  <p>Fresh biko every morning.</p>
</body>
</html>`,
          expected: "Mila's Kakanin\nFresh biko every morning.",
          choices: [
            "Mila's Kakanin\nFresh biko every morning.",
            "Kakanin shop\nMila's Kakanin\nFresh biko every morning.",
            "TODO: add prices\nMila's Kakanin\nFresh biko every morning.",
            "Mila's Kakanin",
          ],
          wrongNotes: {
            "Kakanin shop\nMila's Kakanin\nFresh biko every morning.": 'The title appears in the browser tab, not on the page.',
            "TODO: add prices\nMila's Kakanin\nFresh biko every morning.": 'Text between the comment markers is a note for people reading the code. The browser skips it.',
            "Mila's Kakanin": 'The paragraph with the biko line is on the page too.',
          },
          hints: [
            'The text between the less-than and greater-than signs with the title word is shown in the tab.',
            'A line that starts with the exclamation mark and two dashes is a note the browser ignores.',
            'Only the heading and the paragraph are drawn on the page.',
          ],
          explanation: 'The `title` goes to the browser tab, the comment is skipped, and the heading and the paragraph are drawn. (This was checked by loading the snippet in a browser.)',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-03-arrange-1',
          kind: 'arrange',
          title: 'From prompt to page',
          prompt: 'Put the steps in the order you would do them to see your first page.',
          concept: 'saving and opening a page',
          language: 'text',
          solution: [
            'Make a folder called my-first-site',
            'Ask the AI for a one-page website in one file',
            'Copy the code the AI wrote',
            'Paste it into a plain text file saved as index.html in your folder',
            'Double-click index.html to open it in your browser',
          ],
          alternatives: [
            [
              'Ask the AI for a one-page website in one file',
              'Make a folder called my-first-site',
              'Copy the code the AI wrote',
              'Paste it into a plain text file saved as index.html in your folder',
              'Double-click index.html to open it in your browser',
            ],
          ],
          reasons: [
            'The folder is where the file will live.',
            'You need the code before you can copy it.',
            'You copy the reply before pasting.',
            'The file must exist and have the right name before you open it.',
            'Opening it is the last step: it shows whether the page works.',
          ],
          hints: [
            'You cannot paste before you have copied.',
            'The folder and the AI request can be done in either order, but both come before copying.',
            'Opening the page in the browser is the last step.',
          ],
          explanation: 'Folder and request in either order, then copy, then paste into index.html, then open. Opening last tells you whether it worked.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-03-q1',
        prompt: 'Which ingredient stops the AI from inventing your prices?',
        choices: [
          'Asking it to be "professional"',
          'Writing the real prices into the prompt',
          'Asking it twice and picking the answer that sounds nicer to you',
        ],
        answer: 1,
        explanation: 'The AI fills gaps with guesses. Real facts in the prompt leave no gap to fill.',
      },
      {
        id: 'ai-coding-beginners-03-q2',
        prompt: 'You pasted the AI\'s code into a file and double-clicked it. What opens it as a page?',
        choices: [
          'The file name must end in .html, then your browser opens it',
          'Any file name works fine, because the browser reads the code inside and works it out',
          'You must first upload it to the internet',
          'The AI has to open it for you',
        ],
        answer: 0,
        explanation: 'The .html ending tells your computer to open the file in a browser. The page exists on your computer before it is ever on the internet.',
      },
      {
        id: 'ai-coding-beginners-03-q3',
        prompt: 'Which of these is part of "the form of the answer" in a prompt?',
        choices: [
          'A colour you like',
          'Your opening hours',
          'Who the page is for and what it should help each of them to do when they arrive',
          'Everything in one file called index.html, with simple steps to open it',
        ],
        answer: 3,
        explanation: 'The form of the answer says how you want the reply delivered. Colours are look, hours are facts, and the audience is the goal.',
      },
      {
        id: 'ai-coding-beginners-03-q4',
        prompt: 'In the example page, the footer says the shop is open 6 AM to 12 noon. Where did the AI get that?',
        choices: [
          'It looked up the shop on the internet before writing the page',
          'It guessed the hours by looking at what other bakeries usually do',
          'From the prompt, where the owner wrote it',
        ],
        answer: 2,
        explanation: 'Facts on the page should come from your prompt. When they are missing, the AI guesses, which is why you supply them.',
      },
      {
        id: 'ai-coding-beginners-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In the recipe comparison, what is double-clicking index.html?',
        choices: [
          'Handing the card to the cook, the browser, so it becomes a page',
          'Writing a brand new recipe for the page from scratch',
          'Deleting the card',
        ],
        answer: 0,
        explanation: 'The file is the recipe; the browser is the cook. Opening the file makes the browser show it as a page.',
      },
      {
        id: 'ai-coding-beginners-03-q6',
        audience: { min: 'advanced' },
        prompt: 'Why does a prompt\'s "output contract" (one file, runs with no build step) help you review?',
        choices: [
          'It makes the code much shorter and simpler, so it hardly needs any review at all afterwards',
          'It lets you verify the result in seconds by opening it, without setting anything up',
          'It guarantees the model cannot make mistakes',
        ],
        answer: 1,
        explanation: 'A constrained, runnable artefact has a fast, cheap check. It does not prevent mistakes; it makes them visible quickly.',
      },
    ],
    task: {
      title: 'Make and open your own first page',
      minutes: 20,
      steps: [
        'Adapt the prompt from this lesson to your real person or business using the five facts you listed in lesson 1. Do not leave any fact out.',
        'Paste it into your chat assistant and read the reply.',
        'Copy the code, save it in `my-first-site` as `index.html`, and open it in your browser.',
        'Check every name, number and time on the page against the real thing. Write down anything wrong.',
        'Write your prompt in a note called "prompt log" with the date. You will keep adding to it all course.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If the page looks strange or blank, do not worry: lesson 6 is about exactly that. For now, tell the AI what you see in one sentence and ask it to explain what went wrong.'] },
      { audience: { min: 'advanced' }, steps: ['Rewrite your prompt as a short spec with acceptance criteria (content table, width at 360 px, no external requests) and compare what you get with the first, looser version.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-04',
    day: 4,
    title: 'Reading what the AI made: files, folders and code in plain words',
    summary: 'Read the generated page piece by piece: tags, the head and the body, and a few lines of CSS, so you can steer the AI with real words.',
    intro: {
      objectives: [
        'Tell the head of a page from the body, and say what each shows',
        'Read an opening tag, its content and its closing tag',
        'Read a CSS rule as a selector, a property and a value',
      ],
      why: 'You do not need to write code, but you do need to recognise its parts. When you can say "the heading in the header" instead of "that thing at the top", the AI understands you and your changes land in the right place.',
    },
    minutes: 25,
    skills: ['read-generated-code', 'change-and-fix'],
    body: [
      { type: 'paragraph', text: "Last lesson an AI handed you about sixty lines of code, and you did not have to understand any of it to get a page. Now you will learn to read it the way you read a menu: not every word, but enough to know what is what. Reading the code is how you stay in charge. It lets you check the AI's work and tell it precisely which part to change." },
      { type: 'heading', text: 'A page is a set of labelled pieces' },
      { type: 'paragraph', text: "HTML is made of **elements**. Each element is a piece of the page with a label that says what it is. The label is a **tag**, and most elements have an opening tag and a closing tag, with the content between them. The closing tag looks the same as the opening one with a slash added." },
      { type: 'code', language: 'html', label: 'One element', code: "<h1>Mila's Kakanin</h1>" },
      { type: 'list', items: [
        '`<h1>` is the opening tag. `h1` means the biggest heading, the title of the page.',
        "`Mila's Kakanin` is the content: the words that show up.",
        '`</h1>` is the closing tag. The slash says: this piece ends here.',
      ] },
      { type: 'paragraph', text: "Some tags carry extra information inside the opening tag, called **attributes**. They are written as a name, an equals sign and a value in quotes. In the example page, the button is `<a class=\"button\" href=\"mailto:mila@example.com\">Email us to order</a>`. The tag `a` makes a link. The attribute `href` says where the link goes (here, an email address, because it starts with `mailto:`). The attribute `class` is a nickname that the CSS uses to style it. One more thing you will see: text between `<!--` and `-->` is a **comment**, a note for people reading the code. The browser skips it." },
      { type: 'heading', text: 'The head and the body' },
      { type: 'paragraph', text: "Every page has two big parts. The **head** holds information about the page that is not drawn on it: the title that shows in the browser tab, the text encoding, a note for phones and the CSS. The **body** holds everything you actually see." },
      {
        type: 'table',
        headers: ['In the file', 'What it does on the page'],
        rows: [
          ['`<title>`', 'The words in the browser tab, and what a bookmark is called'],
          ['`<h1>`, `<h2>`', 'Headings: h1 is the main title, h2 are section titles'],
          ['`<p>`', 'A paragraph of text'],
          ['`<ul>` and `<li>`', 'A bulleted list (ul) and each item in it (li)'],
          ['`<a href="...">`', 'A link: the words you click, and where it goes'],
          ['`<header>`, `<main>`, `<footer>`', 'Labels for the top part, the main part and the bottom part of the page'],
          ['`<style>`', 'Holds the CSS: the rules for how everything looks'],
        ],
        caption: 'The handful of tags in your first page. The AI uses the same ones again and again.',
      },
      { type: 'paragraph', text: "Notice that the tags nest like boxes inside boxes: the `<li>` items sit inside the `<ul>`, which sits inside `<main>`, which sits inside `<body>`. When you tell the AI \"put the opening hours in the footer\", it knows exactly which box you mean." },
      { type: 'heading', text: 'Reading a bit of CSS' },
      { type: 'paragraph', text: "CSS is a list of rules. A rule has three parts: a **selector** that says what to style, and inside curly brackets one or more **properties** with their **values**. Here is one rule from the page:" },
      { type: 'code', language: 'css', label: 'One CSS rule', code: "header {\n  background: #7a3e1d;\n  color: white;\n  padding: 32px 16px;\n  text-align: center;\n}" },
      { type: 'list', items: [
        '`header` is the selector: style the piece labelled header.',
        '`background: #7a3e1d;` makes the background a dark brown. The odd code is a **hex colour**, a way of writing a colour as letters and numbers. You can always ask the AI for the colour by name.',
        '`color: white;` makes the text colour white. (CSS spells it the American way, with no u. This will matter in lesson 6.)',
        '`padding: 32px 16px;` is empty space inside the box: 32 pixels above and below, 16 on the sides.',
        '`text-align: center;` centres the words.',
        'Each property ends with a semicolon, and the whole rule ends with the closing curly bracket.',
      ] },
      { type: 'heading', text: 'Files and folders' },
      { type: 'paragraph', text: "Right now your whole site is one file, `index.html`, inside one folder. That is enough for a one-page site. Later a site can grow: a pictures folder, a separate CSS file. The page then points to those files by their names, such as `images/biko.jpg`. If the name or the folder does not match exactly, the picture is missing. That is a common reason for a broken page, and lesson 6 shows how to find it." },
      {
        type: 'prompt',
        label: 'Ask the AI to explain, then test it',
        text: "Here is my index.html. Explain it to me as if I have never coded, in order from top to bottom, in short plain sentences. Tell me which part is the head and which is the body, and what each tag does on the page. Then give me one tiny change I can make to see the page change, so I can check that your explanation is right.",
      },
      { type: 'tip', text: "Do not just believe the explanation: test it. Change one word, such as the heading text, save the file, and press refresh in the browser. If the page changes the way the AI said, you understand that part for real." },
      { type: 'version', text: "MDN's beginner guide lists the same basic structure: a doctype line, an html element with a lang attribute, a head with a meta charset, a viewport meta tag and a title, and a body with the visible content. The viewport tag makes a page render at the width of a phone screen instead of shrinking a desktop-sized page.", checked: CHECKED, sources: [DOCS.mdnContent, DOCS.mdnViewport] },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: think of moving house. You write labels on boxes: kitchen, fragile, books. HTML tags are those labels: they say what each piece is. The head is the paperwork about the move (the address, who is moving); the body is the stuff that goes in the new house. CSS is the set of instructions about how things should be arranged: put the sofa against the wall, hang the pictures high. A selector is the label the instruction applies to, and a property is one thing to arrange. When you tell the AI what you want, naming the label (the heading, the footer, the button) is what makes it change the right box.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "When you review generated front-end code, read it for structure and for what leaves the page, not for style. Check that the elements are semantic (header, main, footer, headings in order, alt text on images), that nothing loads from unknown third-party hosts, that no inline script does more than you asked for, and that there are no keys or tokens in the source (every visitor can view it). Prefer a separate stylesheet once the page grows, because specificity fights inside one style block are what make later AI edits unpredictable.",
      },
      {
        type: 'takeaways',
        items: [
          'HTML is made of elements: an opening tag, content and a closing tag with a slash; attributes sit inside the opening tag.',
          'The head holds information about the page (title, encoding, CSS); the body holds what you see.',
          'A CSS rule is a selector, then properties and values in curly brackets, each ending in a semicolon.',
          'Name the piece (heading, footer, button) when you ask for a change, and test the AI\'s explanation by changing one thing.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-04-match-1',
          kind: 'match',
          title: 'Which piece is it?',
          prompt: 'Match each thing you want to the part of the page that controls it.',
          concept: 'tags and attributes',
          labels: { terms: 'What you want', meanings: 'What controls it' },
          pairs: [
            { term: 'The shop name as the biggest title on the page', definition: 'An h1 heading in the body', note: 'The h1 tag is the main title.' },
            { term: 'The words that show in the browser tab', definition: 'The title tag in the head', note: 'Text in the head is information about the page, not drawn on it.' },
            { term: 'The place a link takes you when clicked', definition: 'The href attribute on the a tag', note: 'href is the attribute that holds the link address.' },
            { term: 'The empty space inside the header box', definition: 'The padding property in a CSS rule', note: 'Padding is the space inside a box.' },
          ],
          hints: [
            'Think about whether each one is a tag, an attribute or a CSS property.',
            'The tab text belongs to the head, not the body.',
            'Addresses of links live in href; spacing lives in CSS.',
          ],
          explanation: 'Headings and titles are tags, link addresses are attributes, and spacing is a CSS property. Knowing which kind of thing you are asking about helps you ask for it clearly.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-04-predict-1',
          kind: 'predict-output',
          title: 'How many bullets?',
          story: 'The AI left a note in the list. You open the page.',
          prompt: 'How many bullet points will the browser show?',
          concept: 'reading html',
          language: 'html',
          code: `<ul>
  <li>Biko</li>
  <!-- <li>Puto</li> -->
  <li>Sapin-sapin</li>
</ul>`,
          expected: '2',
          choices: ['2', '3', '1', '0'],
          wrongNotes: {
            '3': 'The Puto line sits between the comment markers, so the browser skips it.',
            '1': 'Two li elements are outside the comment: Biko and Sapin-sapin.',
            '0': 'The ul element holds two live items.',
          },
          hints: [
            'Look at the line that starts with the exclamation mark and two dashes.',
            'Everything between the comment markers is ignored by the browser.',
            'Count only the list items that are outside the comment.',
          ],
          explanation: 'A comment hides its contents from the page, so only Biko and Sapin-sapin are shown. (Checked by loading the snippet in a browser and counting the list items.)',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-04-q1',
        prompt: 'Which line is a complete heading element?',
        choices: [
          '<h2>What we sell<h2>',
          '</h2>What we sell<h2>',
          '<h2>What we sell</h2>',
          '<h2 What we sell h2>',
        ],
        answer: 2,
        explanation: 'An element is an opening tag, the content and a closing tag, which is the same name with a slash.',
      },
      {
        id: 'ai-coding-beginners-04-q2',
        prompt: 'You want the heading text to be white. Where does the instruction go?',
        choices: [
          'In a CSS rule, as the property color with the value white',
          'In the title tag in the head, so it applies to the whole page',
          'In the href attribute of the heading',
        ],
        answer: 0,
        explanation: 'How things look is CSS. A rule picks the piece (the selector) and sets its color. The title tag only names the tab.',
      },
      {
        id: 'ai-coding-beginners-04-q3',
        prompt: 'In `<a class="button" href="mailto:mila@example.com">`, what is `href`?',
        choices: [
          'An element that closes the link and ends the paragraph',
          'The colour of the link',
          'An attribute that says where the link goes',
        ],
        answer: 2,
        explanation: 'Attributes sit inside the opening tag as name and value. href holds the destination of the link.',
      },
      {
        id: 'ai-coding-beginners-04-q4',
        prompt: 'The AI says it moved the opening hours "into the footer". Which part of the page do you check?',
        choices: [
          'The words at the very top of the page, above the first heading',
          'The bottom part of the page, where the footer element is',
          'The words in the browser tab',
          'The list of items under What we sell',
        ],
        answer: 1,
        explanation: 'The footer is the label for the bottom of the page. Knowing what each box is called tells you where to look.',
      },
      {
        id: 'ai-coding-beginners-04-q5',
        audience: { max: 'beginner' },
        prompt: 'In the moving-house comparison, what are the HTML tags?',
        choices: [
          'The new house itself, with all the furniture already inside',
          'The movers',
          'The labels on the boxes that say what each piece is',
        ],
        answer: 2,
        explanation: 'Tags label each piece of the page: heading, list, footer. The browser reads the labels to know how to show each piece.',
      },
      {
        id: 'ai-coding-beginners-04-q6',
        audience: { min: 'advanced' },
        prompt: 'While reviewing a generated page you find a script tag loading code from a host you do not recognise. What is the right call?',
        choices: [
          'Leave it alone, because the AI would never add anything that the page does not really need to work',
          'Ask what it is for and remove it unless it is required, because every visitor would run it',
          'Add more scripts from the same host to match',
          'Move it to the footer so it loads later',
        ],
        answer: 1,
        explanation: 'Unrequested third-party code runs for every visitor. Find out what it does, and remove it unless you need it.',
      },
    ],
    task: {
      title: 'Read your own page',
      minutes: 15,
      steps: [
        'Open your `index.html` in your editor next to the page in your browser.',
        'Find the head and the body, and point to the title, the main heading and one link in the code.',
        'Run the explain prompt from this lesson with your file pasted in, and read the answer next to the code.',
        'Make the tiny test change the AI suggested, save, refresh, and write down whether the page changed the way it said.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw your page on paper as boxes (header, main, footer) and write the tag name on each box.'] },
      { audience: { min: 'advanced' }, steps: ['Run the page through a validator or your browser\'s accessibility check and list what you would ask the AI to fix first, with the reason.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-05',
    day: 5,
    title: 'Changing it by asking: small, clear requests',
    summary: 'Change your page one clear request at a time, and keep control by naming the piece, saying what to keep and checking the result.',
    intro: {
      objectives: [
        'Write a change request that names one piece of the page and says what to keep',
        'Check what actually changed, not only what you asked for',
        'Restart a long chat without losing your page',
      ],
      why: 'Most of building with AI is changing what already exists. Small, clear requests give you pages that improve with every step; big vague ones give you surprises.',
    },
    minutes: 25,
    skills: ['write-prompts', 'change-and-fix'],
    body: [
      { type: 'paragraph', text: "Your first page is a first draft, and it will not be exactly right. The skill that turns a draft into the page you want is changing it by asking. It is a small skill with a few rules, and once you have them you can reshape a page without touching the code yourself." },
      { type: 'heading', text: 'Four rules for a good change request' },
      { type: 'list', ordered: true, items: [
        '**One change at a time.** If three things go wrong afterwards you cannot tell which request caused which. One change, then look.',
        '**Name the piece.** Use the words from the last lesson: the heading, the list under What we sell, the footer, the button. "That bit at the top" forces the AI to guess.',
        '**Say what to keep.** AI tools like to improve things you did not ask about. "Change nothing else" protects the parts you are happy with.',
        '**Say how you want the answer.** For a small page, ask for the whole updated file, so you replace the old one completely and there is no hunting for where lines go.',
      ] },
      { type: 'paragraph', text: "Here are three real requests in a row on the Mila's Kakanin page, each followed by the part of the code that changed." },
      { type: 'prompt', label: 'Request 1: a colour', text: "In the file you made, change the colour of the two h2 headings (What we sell and How to order) to dark green. Change nothing else. Send me the whole updated file." },
      { type: 'code', language: 'css', label: 'Before and after (the h2 rule)', code: "/* before */\nh2 {\n  color: #7a3e1d;\n}\n\n/* after */\nh2 {\n  color: #2e5e3e;\n}" },
      { type: 'prompt', label: 'Request 2: new content', text: "Add a fourth item to the list under What we sell: Kutsinta, ₱50 per dozen. Put it after Sapin-sapin. Change nothing else. Send me the whole updated file." },
      { type: 'code', language: 'html', label: 'The list now', code: "<ul>\n  <li>Biko: ₱80 per tray</li>\n  <li>Puto: ₱60 per dozen</li>\n  <li>Sapin-sapin: ₱120 per tray</li>\n  <li>Kutsinta: ₱50 per dozen</li>\n</ul>" },
      { type: 'prompt', label: 'Request 3: the button', text: "Make the button text say Order by email, and make the corners of the button fully round. Change nothing else. Send me the whole updated file." },
      { type: 'code', language: 'css', label: 'The button rule after the change', code: ".button {\n  display: inline-block;\n  background: #7a3e1d;\n  color: white;\n  padding: 12px 20px;\n  border-radius: 999px;\n  text-decoration: none;\n}" },
      { type: 'paragraph', text: "After each request you do the same two things. First, replace your file's contents with the new version and refresh the browser. Second, look at the whole page, not just the part you changed. If something else moved, say so in your next request: \"The footer text is now centred differently than before. Put it back as it was.\"" },
      { type: 'heading', text: 'When the chat gets long' },
      { type: 'paragraph', text: "A chat assistant works from the conversation so far, and there is a limit to how much it can hold at once, called its **context window**. After a long back-and-forth it may forget or mix up earlier details, such as a change you made ten messages ago. A page this small is far below the limit, but a long chat full of pasted files can still go wrong. The fix is simple: start a new chat and paste in your current file with a short note about what you want next." },
      { type: 'prompt', label: 'Restarting a chat', text: "Here is the current index.html of my website for Mila's Kakanin. Please do not change anything yet. Just tell me in two sentences what the page contains, and then wait for my next request." },
      { type: 'version', text: "Free plans can have limited context windows. Gemini's help page lists a 32,000-token context window for free users, and ChatGPT's plans page lists about 27,000 tokens for standard responses on its Free plan. A token is a small piece of text, roughly three-quarters of a word. Numbers like these change, which is why the habit, not the number, matters: keep your current file handy so you can restart a chat any time.", checked: CHECKED, sources: [DOCS.geminiLimits, DOCS.chatgptPlans] },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: think of telling a tailor what to change. \"Make it better\" gets you a surprise. \"Shorten the sleeves by two centimetres and leave everything else exactly as it is\" gets you what you wanted. The sleeves are the piece you named, the two centimetres is the single clear change, and \"everything else\" is what you asked to keep. After each fitting you put the jacket on and look at all of it, not only the sleeves. The context window is the tailor's memory for one visit: after a very long visit, a quick fresh note on what you have now helps.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat each request as a small, reviewable change with a stated invariant (\"change nothing else\") and verify with a diff rather than by eye: model edits regularly reformat or drift in untouched regions. Keep each accepted change as its own commit so a bad one is trivially reverted, and keep the instructions that must persist (palette, fonts, content rules) in a short block you re-paste, since long contexts degrade recall of early constraints. For anything larger than a page, ask for a plan first and approve it before any code is written.",
      },
      {
        type: 'takeaways',
        items: [
          'One change per request, naming the piece, saying what to keep and how you want the answer.',
          'After every change, replace the file, refresh, and look at the whole page.',
          'If other things changed, say so and ask for them to be put back.',
          'In a long chat, start fresh with your current file and a short note.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-05-scenario-1',
          kind: 'scenario',
          title: 'Which change request is better?',
          prompt: 'Pick the request most likely to change only what you want.',
          concept: 'small clear requests',
          situation: 'The Mila\'s Kakanin page is open. Mila wants the main heading to be a bit smaller, and she likes everything else exactly as it is.',
          options: [
            { text: 'Make it look better.', consequence: 'The AI changes colours, fonts and layout. Mila loses things she liked.', quality: 'poor' },
            { text: 'Make the h1 heading smaller, about 28 pixels, and change nothing else. Send the whole updated file.', consequence: 'Only the heading size changes, and Mila can replace her file and check it in seconds.', quality: 'best' },
            { text: 'The top is too big, fix the top and also tidy up the rest while you are there.', consequence: 'The heading may shrink, but the "tidying" rewrites parts of the page that were fine.', quality: 'poor' },
            { text: 'Make the heading smaller.', consequence: 'Probably works, but without "change nothing else" and a size, the AI may adjust other things or choose a size that does not suit.', quality: 'acceptable' },
          ],
          hints: [
            'Look for the request that names the piece, one change and what to keep.',
            'Which one gives a size and says change nothing else?',
            'The h1 request with 28 pixels and the whole file.',
          ],
          explanation: 'One piece, one change, a measurable size and a promise to leave the rest alone: that gives you control and a quick way to check.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-05-predict-1',
          kind: 'predict-output',
          title: 'What did the change touch?',
          story: 'You asked the AI to make the main heading dark green. It sent this.',
          prompt: 'Which words turn dark green?',
          concept: 'what a css rule affects',
          language: 'html',
          code: `<style>
  h1 { color: darkgreen; }
</style>
<h1>Mila's Kakanin</h1>
<h2>What we sell</h2>`,
          expected: "Only Mila's Kakanin",
          choices: ["Only Mila's Kakanin", 'Only What we sell', 'Both lines', 'Neither line'],
          wrongNotes: {
            'Only What we sell': 'The rule is for h1, which is the first line. The second line is an h2.',
            'Both lines': 'The selector h1 matches only h1 elements. An h2 would need its own rule.',
            'Neither line': 'The rule matches the h1, so that heading turns green.',
          },
          hints: [
            'Read the selector at the start of the rule.',
            'Which line in the body is an h1?',
            'A rule only affects the pieces its selector names.',
          ],
          explanation: 'The selector `h1` matches only h1 elements, so only the first line changes. (Checked in a browser: the h1 became dark green and the h2 kept its default colour.)',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-05-q1',
        prompt: 'Why does the lesson add "change nothing else" to a request?',
        choices: [
          'To make the AI answer faster and use fewer words in every reply',
          'To stop the AI improving parts you did not ask about',
          'To save space in the chat',
        ],
        answer: 1,
        explanation: 'AI tools often tidy or restyle things you did not mention. Saying what to keep protects the parts you already like.',
      },
      {
        id: 'ai-coding-beginners-05-q2',
        prompt: 'After the AI changes the heading colour, you notice the footer text has moved. What is the best response?',
        choices: [
          'Accept it and carry on, since the heading is right and the footer is only a small thing',
          'Start again from the first prompt',
          'Tell the AI the footer text moved and ask for it to be put back as it was',
        ],
        answer: 2,
        explanation: 'Looking at the whole page after each change catches unintended side effects. Name what changed and ask for exactly that to be reverted.',
      },
      {
        id: 'ai-coding-beginners-05-q3',
        prompt: 'The chat has become long and the AI is mixing up earlier changes. What helps most?',
        choices: [
          'Start a new chat, paste your current file and say what you want next',
          'Keep asking the same question again and again, in capital letters, until it listens',
          'Ask it to forget everything',
          'Switch to a different tool and hope',
        ],
        answer: 0,
        explanation: 'A fresh chat with your current file gives the AI a clean, small context. The file in your folder is the truth, not the chat.',
      },
      {
        id: 'ai-coding-beginners-05-q4',
        prompt: 'Which of these requests names a piece of the page?',
        choices: [
          'Do the thing at the top again, the way you did it before',
          'Make the list under What we sell use bigger text',
          'Make it pop',
        ],
        answer: 1,
        explanation: 'The list under What we sell is a named piece. "The thing at the top" and "make it pop" leave the AI guessing.',
      },
      {
        id: 'ai-coding-beginners-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In the tailor comparison, what is "everything else exactly as it is"?',
        choices: [
          'The part you want changed',
          'What you asked to keep untouched',
          'The fee you pay the tailor at the end of the visit',
        ],
        answer: 1,
        explanation: 'Telling the tailor what to leave alone is the same as saying change nothing else.',
      },
      {
        id: 'ai-coding-beginners-05-q6',
        audience: { min: 'advanced' },
        prompt: 'A model edit "only" changed a heading, but you suspect drift elsewhere. What is the most reliable check?',
        choices: [
          'Read the new file top to bottom and trust your memory of the old one',
          'Ask the model whether it changed anything else',
          'Compare the new file with the old one using a diff',
          'Refresh the browser and look only at the heading',
        ],
        answer: 2,
        explanation: 'A diff shows exactly what changed. The model\'s own account and eyeballing the page can both miss silent edits.',
      },
    ],
    task: {
      title: 'Make three changes, one at a time',
      minutes: 20,
      steps: [
        'Make a copy of your `index.html` called `index-before.html` in the same folder, so you can compare later.',
        'Ask for one colour change, naming the piece and saying "change nothing else". Replace your file, refresh, and look at the whole page.',
        'Ask for one change to the words (a price, an item, a sentence), then one change to the look. Check after each.',
        'Add the three requests to your prompt log, with a note on whether each one did what you wanted the first time.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If a request did something you did not expect, copy it into the chat and ask: "Why did you change that too?" Read the reason.'] },
      { audience: { min: 'advanced' }, steps: ['Diff `index-before.html` against the new file with your editor and write down any change that you did not ask for.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-06',
    day: 6,
    title: 'When it breaks: reading an error together with the AI',
    summary: 'Find out what is wrong with a page using your browser, and report it so the AI can fix it in one go.',
    intro: {
      objectives: [
        'Run the first checks when a page looks wrong or blank',
        'Open the browser\'s developer tools and read a message there',
        'Write a bug report that gives the AI what it needs to fix the problem',
      ],
      why: 'Things will break. It is normal, and it does not mean you did something wrong. People who build with AI are not the ones whose pages never break; they are the ones who know how to look and how to ask.',
    },
    minutes: 25,
    skills: ['change-and-fix'],
    body: [
      { type: 'paragraph', text: "Sooner or later the page will look wrong, show nothing at all or have a link that goes nowhere. Do not panic and do not start over. A broken page is information, and you now know enough to look at it. This lesson gives you a short routine for finding out what is wrong, and a way to hand the AI everything it needs to help." },
      { type: 'heading', text: 'Why browsers are quiet about mistakes' },
      { type: 'paragraph', text: "A browser does not stop and shout when it finds something it does not understand. It does its best to show what it can and quietly skips the rest. That is friendly for visitors and confusing for you. A misspelled word in the CSS is simply ignored, and you see the page without that style. Nothing tells you why. So the routine begins with looking." },
      { type: 'heading', text: 'Three kinds of broken' },
      { type: 'list', items: [
        '**Nothing shows, or the page is plain text.** Usually a file problem: a wrong file name, an old copy opened, or only part of the code was copied.',
        '**It looks wrong.** A colour that does not appear, text you cannot read, a layout that has slipped. Usually something in the CSS, or a tag that was never closed.',
        '**Something does not work.** A picture that is missing, a link that goes nowhere. Usually a name or an address that does not match.',
      ] },
      { type: 'heading', text: 'Your first checks' },
      { type: 'list', ordered: true, items: [
        'Did you **save** the file after pasting? Press refresh in the browser (Ctrl+R on Windows, Cmd+R on Mac).',
        'Is the **right file** open? It is easy to open an old copy.',
        'Does the file name end in `.html` and not `.html.txt`? (Lesson 2.)',
        'Did you paste **all** the code, from `<!DOCTYPE html>` down to `</html>`?',
      ] },
      { type: 'heading', text: 'Looking inside the browser' },
      { type: 'paragraph', text: "Every major browser has built-in **developer tools**: a panel for looking inside the page you are viewing. In Chrome you open it by right-clicking anywhere on the page and choosing Inspect. The **Console** is the part that lists messages when something went wrong, often in red. If a picture fails to load, the console usually says so and names the file it could not find. That name is exactly what you give the AI." },
      { type: 'version', text: "Chrome's documentation lists these shortcuts: right-click an element and choose Inspect; open the Console with Ctrl+Shift+J on Windows or Linux and Cmd+Option+J on a Mac; open the last-used panel with F12 or Ctrl+Shift+I on Windows and Linux (Fn+F12 or Cmd+Option+I on a Mac). Other browsers have the same tools under similar names, and menus can move between versions.", checked: CHECKED, sources: [DOCS.devtools] },
      { type: 'heading', text: 'Telling the AI what is wrong' },
      { type: 'paragraph', text: "A good bug report gives the AI four things: what you were trying to do, what you expected, what you actually see, and the evidence. The evidence is the exact words of any message from the console, the part of the code concerned (or the whole file for a page this small) and, if your tool allows pictures, a screenshot. Compare these two reports:" },
      { type: 'prompt', label: 'A weak report', text: "It doesn't work, fix it." },
      { type: 'prompt', label: 'A good report', text: "I asked you to make the header of my page brown with white text. In my browser the header is brown, but the words Mila's Kakanin are dark brown, and I can hardly read them. I expected white text. Here is my whole index.html: [paste the file]. The browser console shows no messages. What is wrong? Please tell me which line, explain in one sentence, and send the corrected file. Change nothing else." },
      { type: 'paragraph', text: "Here is what the AI finds in a case like that. The CSS rule for the header contains a line that is spelled the British way:" },
      { type: 'code', language: 'css', label: 'The rule with the mistake', code: "header {\n  background: #7a3e1d;\n  colour: white;\n  padding: 32px 16px;\n}" },
      { type: 'paragraph', text: "CSS only knows the American spelling, `color`. The browser quietly ignores the unknown property `colour`, so the text keeps its default dark colour. The fix is one word. Notice that nothing in the browser told you this; you found it because you described what you saw and the AI compared it with the code." },
      { type: 'diagram', format: 'mermaid', caption: 'A routine for a broken page: check, look, report, one fix, look again.', source: 'flowchart TD\n  A[Something looks wrong] --> B[Save and refresh. Right file? Right name?]\n  B --> C[Open the Console and read any message]\n  C --> D[Send the AI: goal, expected, what you see, evidence]\n  D --> E[Apply one fix and look at the page]\n  E --> F{Fixed?}\n  F -->|yes| G[Add it to your prompt log]\n  F -->|no, tried 3 times| H[New chat: paste the file and describe it fresh]\n  F -->|no| C' },
      { type: 'heading', text: 'Rules for fixing' },
      { type: 'list', items: [
        '**Apply one fix at a time** and look after each. If you apply three at once, you do not know which one worked.',
        '**Read the AI\'s explanation.** If it does not make sense to you, ask: "Explain that more simply."',
        '**Ask for the smallest fix.** If the AI proposes rewriting everything, say: "Fix only the problem, change nothing else."',
        '**After three failed tries, restart.** Open a new chat, paste your current file and describe the problem fresh. A long chat can get stuck in a loop.',
        '**Never run a command you do not understand,** even if an AI suggests it. A one-page site never needs any.',
      ] },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: when you visit a doctor, \"I feel bad\" gets you a lot of questions. \"My throat has hurt since Monday, I have no fever, and swallowing is worse in the morning\" gets you help quickly. A bug report to the AI works the same way: what you wanted, what you see, and any exact message. The console is like the doctor's thermometer: it measures something you cannot see by looking. And the AI is the doctor, who needs your description, because it cannot see your screen.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Debugging with an assistant is still debugging: reproduce, minimise, form a hypothesis, test it. Ask the model for ranked hypotheses and a cheap experiment for each, rather than a fix, and give it the artefacts it cannot see (console and network output, the failing request, a minimal reproduction). Watch for fixes that suppress the symptom (a try/catch, a !important, a deleted line) instead of the cause, and for loops where successive patches contradict one another: that is the signal to reset the context and restate the problem. Where tests exist, make the failing test the first deliverable.",
      },
      {
        type: 'takeaways',
        items: [
          'Browsers quietly ignore what they do not understand, so a mistake often shows only as something missing.',
          'First checks: saved, refreshed, right file, right name, all the code pasted.',
          'The browser console can name a missing file or an error; give those exact words to the AI.',
          'A good bug report has the goal, what you expected, what you see and the evidence; apply one fix at a time.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-06-fix-bug-1',
          kind: 'fix-bug',
          title: 'The unreadable header',
          story: 'Mila\'s page header should have white words on brown, but the words are dark and hard to read.',
          prompt: 'One line of this CSS is the reason. Tap it, then choose the fix.',
          concept: 'finding a typo in css',
          language: 'css',
          code: `header {
  background: #7a3e1d;
  colour: white;
  padding: 32px 16px;
  text-align: center;
}`,
          bugLine: 3,
          fixes: [
            { line: '  color: white;', correct: true, why: 'CSS spells it color. The browser ignored colour, so the text stayed dark; with the right spelling it turns white.' },
            { line: '  font-color: white;', correct: false, why: 'There is no font-color property in CSS, so the browser would ignore this line too.' },
            { line: '  background: white;', correct: false, why: 'This makes the whole header white, so the dark words become readable but the brown is gone, which is not what Mila wanted.' },
            { line: '  colour: white !important;', correct: false, why: 'Adding emphasis does not help when the name itself is wrong. The browser still does not know colour.' },
          ],
          hints: [
            'The other lines in the rule look right. One word is not one CSS knows.',
            'Look at the spelling of the property that should change the text colour.',
            'CSS uses the American spelling: color.',
          ],
          explanation: 'Browsers ignore properties they do not recognise, so `colour` did nothing. Spelling it `color` makes the words white. The silent failure is why you describe what you see and let the code show the difference.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-06-scenario-1',
          kind: 'scenario',
          title: 'The best bug report',
          prompt: 'Pick the message most likely to get a fix on the first try.',
          concept: 'reporting a problem',
          situation: 'Ben\'s page shows a picture frame with a small broken icon where his shop photo should be. In the browser console he sees a red line that says it failed to load a file called images/shop.jpg. He has his whole index.html copied.',
          options: [
            { text: 'The picture is broken, fix it.', consequence: 'The AI has to guess: wrong name, wrong folder, file missing? It suggests changes that may not match anything.', quality: 'poor' },
            { text: 'My page should show my shop photo under the heading. Instead there is a broken icon. The console says it failed to load images/shop.jpg. My folder has index.html and a file called Shop.JPG on the same level as index.html, with no images folder. Here is the whole file: [paste]. What is wrong? Change nothing else.', consequence: 'The AI spots that the path says images/shop.jpg but the photo is next to the page with a different name and capital letters, and sends the exact corrected line.', quality: 'best' },
            { text: 'Everything is broken, I give up. Maybe I should use a different tool.', consequence: 'A new tool would hit the same problem, because the problem is the file name and path, not the tool.', quality: 'poor' },
            { text: 'The picture is broken and the console says it failed to load images/shop.jpg. Fix it.', consequence: 'Useful evidence, but without the file, the folder layout or the goal, the AI still has to guess what Ben wants.', quality: 'acceptable' },
          ],
          hints: [
            'Which message tells the AI what you wanted, what you see and what the console said?',
            'It helps to say what is in your folder as well.',
            'The long one with the goal, the console message, the folder and the file.',
          ],
          explanation: 'A good report has the goal, what you expected, what you see, the exact console words and what your folder holds. With that the AI can see the mismatch in names and fix just that.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-06-q1',
        prompt: 'Your CSS has a misspelled property name. What does the browser do?',
        choices: [
          'It shows a big error and refuses to open the page',
          'It guesses what you meant and fixes the spelling for you quietly',
          'It quietly ignores that line and shows the rest of the page',
        ],
        answer: 2,
        explanation: 'Browsers skip what they do not understand and carry on. That is why a typo often shows only as a missing effect.',
      },
      {
        id: 'ai-coding-beginners-06-q2',
        prompt: 'A page shows plain text with all the code visible. Which first check is most likely to solve it?',
        choices: [
          'Ask the AI for a new design',
          'Buy a paid plan so that the AI can fix the file name for you',
          'Change the browser\'s colour theme',
          'Check the file name ends in .html and not .html.txt',
        ],
        answer: 3,
        explanation: 'If the computer treats the file as text, it shows the code as text. The extension decides how the file is opened.',
      },
      {
        id: 'ai-coding-beginners-06-q3',
        prompt: 'What does the lesson say to include in a bug report, besides the goal?',
        choices: [
          'What you expected, what you see and the evidence such as exact console words and the code',
          'Only the word "broken", written in capital letters so that the AI notices the problem more quickly',
          'A list of other tools you could use',
        ],
        answer: 0,
        explanation: 'Those details let the AI see the gap between expectation and result. "Broken" gives it nothing to work with.',
      },
      {
        id: 'ai-coding-beginners-06-q4',
        prompt: 'You tried three of the AI\'s fixes in a row and none worked. What is the best next move?',
        choices: [
          'Apply all the suggestions at once',
          'Start a new chat, paste your current file and describe the problem fresh',
          'Delete the file and start the whole site over from the very first prompt again',
        ],
        answer: 1,
        explanation: 'A long chat can get stuck repeating itself. A new chat with your current file and a fresh description often breaks the loop.',
      },
      {
        id: 'ai-coding-beginners-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In the doctor comparison, what does the console correspond to?',
        choices: [
          'The doctor\'s thermometer, which measures what you cannot see',
          'The patient\'s name, which the doctor writes at the top of the notes',
          'The waiting room',
        ],
        answer: 0,
        explanation: 'The console shows messages about things you cannot see just by looking at the page, like a thermometer shows a temperature.',
      },
      {
        id: 'ai-coding-beginners-06-q6',
        audience: { min: 'advanced' },
        prompt: 'An assistant\'s "fix" for a failing request wraps it in a try/catch that swallows the error. What is the concern?',
        choices: [
          'It will not compile',
          'It hides the symptom and leaves the cause in place',
          'It makes the request noticeably slower for every visitor who uses the page',
          'It changes the page layout',
        ],
        answer: 1,
        explanation: 'Swallowing the error silences the evidence instead of fixing the cause. Ask for the root cause and a test that shows it.',
      },
    ],
    task: {
      title: 'Break your page on purpose, then fix it with the AI',
      minutes: 20,
      steps: [
        'Make a copy of your working `index.html` called `index-working.html`.',
        'In `index.html`, break something small: change `color` to `colour` in one rule, or delete one closing tag. Refresh and note what changed.',
        'Open the browser console (right-click, Inspect, then the Console) and see whether it shows any message.',
        'Write a bug report with the goal, what you expected, what you see and the whole file, send it to the AI and apply its single fix.',
        'Add the bug report and the fix to your prompt log.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you feel stuck, copy your working file back over the broken one. Having a working copy is exactly why we made one.'] },
      { audience: { min: 'advanced' }, steps: ['Ask the AI for three ranked hypotheses and one experiment for each before it proposes a fix, and compare its ranking with what you found.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-07',
    day: 7,
    title: 'Saving your work and undoing mistakes',
    summary: 'Keep safe copies, put your project in a free online folder with history, and go back to an earlier version when a change goes wrong.',
    intro: {
      objectives: [
        'Keep a safe copy before each risky change',
        'Create a free GitHub account and an online folder for your site',
        'Explain what a commit and the history are, and use them to go back',
      ],
      why: 'Sooner or later an AI change will make your page worse, or your computer will fail. A saved version you can return to turns those moments from disasters into a short detour.',
    },
    minutes: 25,
    skills: ['save-versions'],
    body: [
      { type: 'paragraph', text: "Two things will eventually happen. An AI change will make your page worse and you will wish you could go back. Or your computer will break or get lost, and the only copy of your page will go with it. Both problems have the same solution: keep versions of your work somewhere safe, with a note about what each one is. This lesson gives you two levels of doing that, a simple one and a better one." },
      { type: 'heading', text: 'Level 1: copies with clear names' },
      { type: 'paragraph', text: "The simplest habit is to copy your file before every change. In your folder, copy `index.html` and rename the copy so you know what it is, such as `index-2026-11-14-before-button.html`. If the change goes wrong, you copy the old one back. This costs nothing and it works. Its weaknesses are that the folder fills with files, the names get confusing, and the copies live on the same computer as the original." },
      { type: 'heading', text: 'Level 2: an online folder that remembers' },
      { type: 'paragraph', text: "**GitHub** is a free website where people keep their project folders online. A project folder there is called a **repository**. The big idea is that a repository remembers every version. Each time you save, you make a **commit**: a snapshot of your files with a short note from you about what changed. The list of all commits is the **history**, and you can go back to any of them." },
      { type: 'paragraph', text: "GitHub is also where you will publish your page in lesson 10, so it is worth setting up now. You do not need to install anything or use any commands: the website can do everything we need." },
      { type: 'list', ordered: true, items: [
        '**Make a free account** on the GitHub website. You need an email address that you verify, and GitHub strongly recommends turning on two-factor sign-in.',
        'Click the **+** at the top right and choose **New repository**.',
        'Give it a short name such as `my-first-site`. Choose **Public** (a free account needs a public repository to publish a site, and public means anyone can see the files). Turn on **Add README** and click **Create repository**.',
        'On the repository page open the **Add file** menu and choose **Upload files**. Drag `index.html` from your folder into the page.',
        'Write a short note in the commit message box, such as "First version of the page", and click **Commit changes**.',
      ] },
      { type: 'paragraph', text: "That is your first commit. Your page now lives online, and GitHub will keep it even if your computer does not." },
      { type: 'version', text: "GitHub's docs describe the same steps: the + menu then New repository, the Add README option, and Add file then Upload files with a commit message. Uploads in the browser are limited to 25 MiB per file and 100 files at a time. A commit is described as recording changes to one or more files, with a message describing the change. A free GitHub account needs a verified email address, and GitHub recommends two-factor authentication. Button names and menus move from time to time, so follow the current docs if a label differs.", checked: CHECKED, sources: [DOCS.ghAccount, DOCS.ghRepo, DOCS.ghUpload, DOCS.ghCommits] },
      { type: 'heading', text: 'Writing a useful commit note' },
      { type: 'paragraph', text: "The note is for the future you. \"Update\" tells you nothing in a month. \"Add Kutsinta to the list and make the button round\" tells you exactly what that snapshot holds. Say what changed, in a few words." },
      { type: 'heading', text: 'Going back' },
      { type: 'paragraph', text: "When a change goes wrong, the old version is still in the history. Open your repository on GitHub and look for the **history** of your file or of the whole project (the link is usually labelled History, with a clock icon; labels can move). Open the commit you want to return to and view the file as it was. Copy its text. Then open your current file on GitHub, choose the pencil icon to edit it, replace everything with the old text, and commit with a note such as \"Go back to the version before the button change\". Going back is itself saved as a new commit, so nothing is ever lost." },
      { type: 'tip', text: "Make a habit of this order: commit (or copy) the working version, then ask the AI for a change, then look, then commit again if you like the result. A saved working version before each request is the only undo you can trust. Asking the AI to \"undo what you did\" depends on what it remembers, and that can be wrong." },
      { type: 'warning', text: "A public repository is public in full: everyone can read every file and every old version in its history. Never upload anything private to it, even \"just for now\". Deleting a file later does not remove it from the history. Lesson 11 comes back to this." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: think of save slots in a video game. Before a hard level you save, with a name like \"before the boss\". If the boss wins, you load that slot and try again. A commit is a save slot for your whole page, with your own label on it. The repository is the cabinet that keeps all the slots, and GitHub is a cabinet that sits online, so a spilled cup of tea on your laptop cannot take it. Copying a file by hand is the same idea with a photocopier: it works, but the cabinet keeps things in order for you.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Browser uploads are fine for a single-file site, but the professional version of this habit is version control on your machine: a branch per assistant task, a commit before every agent run, and review of the diff before merging. That makes agent edits atomic, attributable and revertible, and lets you bisect when a regression appears several changes later. Note that browser uploads ignore .gitattributes and push-protection rules still apply, and that history is permanent in practice: a secret that was ever committed must be revoked, not just deleted.",
      },
      {
        type: 'takeaways',
        items: [
          'Copy your file before risky changes; better, keep versions in a repository on GitHub.',
          'A repository is an online project folder; a commit is a saved snapshot with your note; the history is the list of commits.',
          'To go back, open an earlier commit, copy the old text and commit it as the new current version.',
          'A public repository shows everything, including old versions, to everyone.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-07-arrange-1',
          kind: 'arrange',
          title: 'Your first save online',
          prompt: 'Put the steps in the order you would follow to put your page on GitHub.',
          concept: 'creating a repository and committing',
          language: 'text',
          solution: [
            'Create a free GitHub account and verify your email',
            'Click + and choose New repository',
            'Name it my-first-site, choose Public and click Create repository',
            'Open Add file and choose Upload files, then drag in index.html',
            'Write a short commit message and click Commit changes',
          ],
          reasons: [
            'You need an account before you can make anything.',
            'The repository must exist before you can put files in it.',
            'Naming and creating it makes the empty online folder.',
            'The file goes into the repository, not the other way around.',
            'The commit is what saves the upload as a snapshot with your note.',
          ],
          hints: [
            'You cannot make a folder before you have an account.',
            'The online folder must exist before the file can go into it.',
            'The commit is the last step: it saves what you just uploaded.',
          ],
          explanation: 'Account, then repository, then upload, then commit. The commit message is the note that makes the history readable later.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-07-match-1',
          kind: 'match',
          title: 'Which word fits?',
          prompt: 'Match each situation to the word for it.',
          concept: 'repository, commit and history',
          labels: { terms: 'The situation', meanings: 'The word' },
          pairs: [
            { term: 'You want to save a snapshot of the page now, with a note', definition: 'Make a commit', note: 'A commit is a snapshot with a note.' },
            { term: 'The online folder that holds all the files of your site', definition: 'The repository', note: 'A repository is the project folder online.' },
            { term: 'You want to see what the page looked like last week', definition: 'Look in the history', note: 'The history is the list of every commit.' },
            { term: 'You copy index.html to index-before.html on your own computer', definition: 'A manual backup copy', note: 'It is a backup, but a commit would also keep a note and a date for you.' },
          ],
          hints: [
            'Which word means a saved snapshot with a note?',
            'Which word means the place where everything is kept?',
            'The history is where you look to go back in time.',
          ],
          explanation: 'Commit for a snapshot, repository for the folder online, history for the list of snapshots, and a copy on your own computer is a manual backup.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-07-scenario-1',
          kind: 'scenario',
          title: 'The change that broke the page',
          prompt: 'Pick the best way to recover.',
          concept: 'undoing a mistake',
          situation: 'You committed a working page yesterday. This morning the AI restyled the whole page and now the layout is a mess and you cannot say what changed. You have not committed since.',
          options: [
            { text: 'Open the commit from yesterday on GitHub, copy the old file text and put it back as the current file, with a clear commit note.', consequence: 'The page is exactly as it was yesterday, and the going-back is recorded in the history too.', quality: 'best' },
            { text: 'Ask the AI to "undo everything you did".', consequence: 'It may not remember exactly what it changed, so you get a third version that is neither yesterday\'s nor this morning\'s.', quality: 'poor' },
            { text: 'Delete the repository and start again from the first prompt.', consequence: 'You throw away everything, including the good version that was one click away.', quality: 'poor' },
            { text: 'Keep asking the AI to fix the layout, one thing at a time, from the mess.', consequence: 'It might work, but you spend a lot of time repairing something that you could have restored in a minute.', quality: 'acceptable' },
          ],
          hints: [
            'You have a snapshot from yesterday. What is it for?',
            'The history keeps the old file text.',
            'Copy the old text out of the history and commit it again.',
          ],
          explanation: 'The history is your undo. Restoring from a snapshot is exact; asking an AI to remember what it did is not.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-07-q1',
        prompt: 'What is a commit?',
        choices: [
          'A button that publishes your site to everyone in the world right away',
          'A copy of your whole computer stored on the internet for you',
          'A snapshot of your files with a short note about what changed',
          'A message to the AI asking it to remember your page',
        ],
        answer: 2,
        explanation: 'A commit records the state of your files at a moment, with a note. The list of commits is the history.',
      },
      {
        id: 'ai-coding-beginners-07-q2',
        prompt: 'Which commit note will help you most in a month?',
        choices: [
          'Add Kutsinta to the list and make the order button round',
          'Update',
          'Changes again, because I made several changes to the page today',
          'asdf',
        ],
        answer: 0,
        explanation: 'A note that says what changed lets you find the right snapshot later. Words like "update" tell you nothing.',
      },
      {
        id: 'ai-coding-beginners-07-q3',
        prompt: 'You upload a file with a private phone number to a public repository, then delete it the next day. Who could still see it?',
        choices: [
          'Nobody, deleting a file removes it from everywhere',
          'Anyone who looks at the old versions in the repository\'s history',
          'Only the people you invited to look at the repository when you made it',
        ],
        answer: 1,
        explanation: 'History keeps every old version. In a public repository anyone can read it, so a private file should never be uploaded in the first place.',
      },
      {
        id: 'ai-coding-beginners-07-q4',
        prompt: 'What is the most reliable habit before asking the AI for a risky change?',
        choices: [
          'Tell the AI to remember the old version',
          'Delete the old version so you are not confused',
          'Commit or copy the working version first',
          'Ask for the change twice and compare the answers',
        ],
        answer: 2,
        explanation: 'A saved working version is something you control. The AI\'s memory of earlier versions is not.',
      },
      {
        id: 'ai-coding-beginners-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In the video game comparison, what is a commit?',
        choices: [
          'A new game that the page plays by itself when a visitor opens it',
          'A save slot for your whole page with a label of your own',
          'The game controller',
        ],
        answer: 1,
        explanation: 'A commit saves the page as it is now, with your label, like a save slot you can load later.',
      },
      {
        id: 'ai-coding-beginners-07-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate\'s agent run committed an API key and they delete the file in the next commit. What is still required?',
        choices: [
          'Nothing more, because the deleted file is now gone from the repository for good',
          'Rewriting the commit message',
          'Making the repository private again',
          'Revoking the key and issuing a new one, because it remains in history',
        ],
        answer: 3,
        explanation: 'A secret that was ever committed must be treated as exposed. Revoke it; deleting it later does not undo the exposure.',
      },
    ],
    task: {
      title: 'Put your page online and save a second version',
      minutes: 20,
      steps: [
        'Create a free GitHub account and a public repository called `my-first-site`.',
        'Upload your `index.html` with the commit message "First version of the page".',
        'Ask the AI for one small change, put the new file in your folder, and upload it again to the same repository with a clear commit note.',
        'Open the repository\'s history, find your first commit and look at the older version of the file.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If any button on GitHub looks different from the lesson, do not worry: websites change. Look for the same words, or ask the AI "Where is Upload files on GitHub today?"'] },
      { audience: { min: 'advanced' }, steps: ['Do the same locally: initialise a repository, commit before the AI change, and review the diff before committing the result.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-08',
    day: 8,
    title: 'Adding a form and saving what people send',
    summary: 'Add a way for visitors to send you information, understand why a page alone cannot save it, and handle other people\'s details responsibly.',
    intro: {
      objectives: [
        'Read the parts of an HTML form: label, input, name and button',
        'Explain why a form on a page of plain files cannot save anything by itself',
        'Add a way to receive answers and say what you will do with them',
      ],
      why: 'Many real pages need visitors to send something: an order, a question, a booking. A form that looks right but quietly loses the answers is worse than no form, so it is worth doing it properly.',
    },
    minutes: 25,
    skills: ['forms-and-design', 'stay-safe'],
    body: [
      { type: 'paragraph', text: "So far your page only talks to visitors. To let them talk back, such as to order a tray of biko or ask a question, you need a way for their words to reach you. The simplest way is an email link, which your page already has. When you want answers in a tidy list, such as name, item and pickup day, you want a form. There is one catch that catches nearly everyone, and it is worth understanding before you add a form." },
      { type: 'heading', text: 'What a form is made of' },
      { type: 'paragraph', text: "A **form** is a group of boxes and a button. Here is a small one the way an AI would write it:" },
      { type: 'code', language: 'html', label: 'A small order form', code: `<form action="https://example.com/send" method="post">
  <label for="name">Your name</label>
  <input type="text" id="name" name="name">
  <label for="msg">What would you like to order?</label>
  <textarea id="msg" name="message"></textarea>
  <button type="submit">Send</button>
</form>` },
      { type: 'list', items: [
        '`<form>` wraps everything. Its `action` attribute is the address the answers are sent to when someone presses the button, and `method` says how.',
        '`<label>` is the words next to a box. Its `for` matches the `id` of the box, so tapping the words selects the box, and screen readers read it out.',
        '`<input>` is a one-line box; `<textarea>` is a bigger box for longer text.',
        '`name` is the label the answer travels under, such as `name` or `message`. A box without a `name` is usually left out of what gets sent.',
        '`<button type="submit">` sends the form.',
      ] },
      { type: 'heading', text: 'The catch: where do the answers go?' },
      { type: 'paragraph', text: "Look again at the `action` address. When someone presses Send, the browser sends their answers to that address, and a **program** running on a computer there has to receive and save them. Your site is just a handful of files: it has no such program. If the address points nowhere useful, the browser still goes there, usually gets an error page, and the visitor's answers are thrown away. The form looks fine and silently loses every order. AI tools often write forms like this one, with an invented address, because you asked for a form and did not say where the answers should go." },
      { type: 'heading', text: 'Three ways to receive what people send' },
      {
        type: 'table',
        headers: ['Way', 'How it works', 'Good to know'],
        rows: [
          ['Email link', 'A link such as mailto:mila@example.com opens the visitor\'s email app with your address filled in', 'Simplest. It only works if the visitor has email set up on that device'],
          ['A Google Form on your page', 'You build the form in Google Forms and show it on your page as a link or an embedded frame; answers collect in your Google account', 'Free to start. Answers are stored with your account, so you are responsible for them'],
          ['A form service', 'A company gives you an address to put in `action`; it receives the answers and emails or stores them', 'Plans and limits vary and change; read what they do with the data before you use one'],
        ],
        caption: 'For a first site, an email link or a Google Form is the safest start.',
      },
      { type: 'paragraph', text: "Here is the Google Forms route. Create the form in Google Forms, add your questions (name, how to reach them, what they want, pickup day), publish it, and either copy the link or use the form's embed option, which gives you a small piece of code that shows the form inside your page. Then give that code to the AI:" },
      { type: 'prompt', label: 'Add the Google Form to the page', text: "Here is the embed code from my Google Form: [paste the code]. In my index.html, add a section called Order form right after How to order, and put this code in it so the form shows inside the page. Change nothing else. Send me the whole updated file." },
      { type: 'code', language: 'html', label: 'What the section looks like afterwards (example address, yours is different)', code: `<h2>Order form</h2>
<iframe src="https://docs.google.com/forms/d/e/EXAMPLE_FORM_ID/viewform?embedded=true"
        width="100%" height="700" title="Order form">
  Loading...
</iframe>` },
      { type: 'paragraph', text: "An `iframe` is a window inside your page that shows another page, here your form. Every visitor's answers go into your Google Form's response sheet, not to your own computer or your page." },
      { type: 'version', text: "MDN explains that a form's action is the URL the collected data is sent to and method is the HTTP method used, and that name is the label each value travels under. Google's help page says a form has to be published before people can use it, and that the More menu has an Embed HTML option for putting it into a website. Check the current steps in Google Forms, because menu names change.", checked: CHECKED, sources: [DOCS.mdnForm, DOCS.googleForms] },
      { type: 'heading', text: 'You are now holding other people\'s information' },
      { type: 'list', items: [
        '**Ask only what you need.** Name and a way to reach them for an order; not their home address unless you deliver.',
        '**Never ask for passwords, card numbers or government ID numbers** in a form on a small site.',
        '**Say what you will do with it** in one sentence under the form ("We use your details only to prepare your order").',
        '**Keep the answers private,** do not share the response sheet and delete answers you no longer need.',
      ] },
      { type: 'tip', text: "Test the form yourself as a visitor: fill it in on your phone, press Send, and check that the answer arrives where you expect. A form you never tested is a form that may be losing orders." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a form is the paper order slip you hand across a counter. The boxes are the lines to fill in, and the `name` of each box is the heading printed above the line, so whoever reads the slip knows which answer is which. The problem is the back of the shop. A form on a plain page is like a slip with an address on it but nobody at that address: the slips are handed over and disappear. A Google Form is a proper receiving desk that someone else keeps for you, and an email link just rings your own doorbell. Whichever way you pick, someone must be at the other end.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "On static hosting the question is which third-party endpoint receives the POST, and each choice has trade-offs: spam and bot abuse (honeypot fields, rate limits, CAPTCHA), data retention and residency, consent and privacy notices, delivery reliability, and what happens with JavaScript disabled. Do not put credentials for a backend in the page; anything in client code is public. If you later need your own handling, the pattern is a small serverless function holding the secrets, with the page posting to it, and validation on the server rather than only in the browser.",
      },
      {
        type: 'takeaways',
        items: [
          'A form has labels, boxes with names, a button and an action address that says where the answers go.',
          'A page of plain files cannot save answers: without something at the action address, the answers are lost.',
          'An email link or a Google Form is a safe way to start receiving answers.',
          'Ask only what you need, never ask for passwords or card numbers, and test the form as a visitor.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-08-fix-bug-1',
          kind: 'fix-bug',
          title: 'The answer that never shows up',
          story: 'Mila tests her form. The message arrives, but the name box is always missing from what she receives.',
          prompt: 'One line is the reason. Tap it, then choose the fix.',
          concept: 'form fields need a name',
          language: 'html',
          code: `<form action="https://example.com/send" method="post">
  <label for="name">Your name</label>
  <input type="text" id="name">
  <label for="msg">Message</label>
  <textarea id="msg" name="message"></textarea>
  <button type="submit">Send</button>
</form>`,
          bugLine: 3,
          fixes: [
            { line: '  <input type="text" id="name" name="name">', correct: true, why: 'The name is the label the answer travels under. With it, the visitor\'s name is sent with the message.' },
            { line: '  <input type="text" name="name">', correct: false, why: 'This sends the name, but without the id the label no longer connects to the box, so tapping the words does nothing.' },
            { line: '  <input type="text" id="name" value="name">', correct: false, why: 'A value fills the box with a starting word. It does not give the answer a label to travel under.' },
            { line: '  <input type="text" id="name" for="name">', correct: false, why: 'The for attribute belongs on the label, not on the box, and it does not name the answer.' },
          ],
          hints: [
            'The message box works and the name box does not. What does the message box have that the name box lacks?',
            'Compare the textarea line with the input line.',
            'Add the name attribute to the input, keep the id.',
          ],
          explanation: 'Only boxes with a name are included in what the form sends. The id and label are for people; the name is for the answer.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-08-scenario-1',
          kind: 'scenario',
          title: 'The orders that vanished',
          prompt: 'Pick the best fix.',
          concept: 'where form answers go',
          situation: 'Ben\'s AI wrote him a contact form with action="/send". He published the page. Customers press Send and see an error page. Ben has no idea how many messages were lost.',
          options: [
            { text: 'Replace the form with a Google Form shown on the page, keep an email link as a backup, and test it on his phone.', consequence: 'Answers now land in a response sheet Ben controls, and he has checked that they arrive.', quality: 'best' },
            { text: 'Ask the AI to "make the form save the data" without saying where.', consequence: 'The AI may invent a server that does not exist, and the form fails in a new way.', quality: 'poor' },
            { text: 'Add a "Thank you!" message after Send so it looks like it worked.', consequence: 'Customers think their orders arrived. They did not. This hides the problem and makes it worse.', quality: 'poor' },
            { text: 'Remove the form and leave only an email link.', consequence: 'It works and is honest, though Ben loses the tidy list of answers.', quality: 'acceptable' },
          ],
          hints: [
            'Where do the answers need to land for Ben to see them?',
            'Never pretend a form worked when you have not checked.',
            'Use something that actually receives answers, and test it.',
          ],
          explanation: 'A form needs a receiver. A Google Form or an email link actually delivers; a pretend "thank you" only hides the loss.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-08-q1',
        prompt: 'Your form\'s action points to an address where nothing is set up to receive it. What happens when a visitor presses Send?',
        choices: [
          'The answers are saved on the visitor\'s phone for you to read later',
          'The answers are emailed to you automatically by the browser, whatever the address',
          'The browser goes there, usually shows an error and the answers are lost',
        ],
        answer: 2,
        explanation: 'A form only sends. Something at the other end must receive and save. If nothing does, the answers are discarded.',
      },
      {
        id: 'ai-coding-beginners-08-q2',
        prompt: 'What does the name attribute on an input do?',
        choices: [
          'It gives the answer a label to travel under, such as name or message',
          'It makes the box bigger and the text inside it much easier to read for visitors',
          'It sets the colour of the box',
          'It tells the browser which page to open next',
        ],
        answer: 0,
        explanation: 'The name is the label of the answer in what the form sends. Without it the value is usually left out.',
      },
      {
        id: 'ai-coding-beginners-08-q3',
        prompt: 'Which of these should your order form NOT ask for?',
        choices: [
          'The visitor\'s first name',
          'A card number or password',
          'A phone number to arrange pickup',
        ],
        answer: 1,
        explanation: 'A small site should never collect card numbers or passwords. Ask only for what you need to do the job.',
      },
      {
        id: 'ai-coding-beginners-08-q4',
        prompt: 'Why should you test your form yourself on your phone?',
        choices: [
          'To make the page load faster',
          'To make sure answers really arrive where you expect, because a broken form loses orders silently',
          'To change the colour of the Send button, and to make the whole form look much more friendly to visitors',
          'Because the AI asked you to',
        ],
        answer: 1,
        explanation: 'A form can look perfect and still lose everything. Only sending a test answer proves that it arrives.',
      },
      {
        id: 'ai-coding-beginners-08-q5',
        audience: { max: 'beginner' },
        prompt: 'In the order-slip comparison, what is the problem with a form on a plain page?',
        choices: [
          'The slips are too small to write anything useful on, so people leave them blank',
          'There is an address on the slip but nobody at that address to collect them',
          'The slips cost money to print',
        ],
        answer: 1,
        explanation: 'A form needs something at the other end to receive the answers. A plain page has nothing there.',
      },
      {
        id: 'ai-coding-beginners-08-q6',
        audience: { min: 'advanced' },
        prompt: 'A static site posts its contact form to a third-party endpoint. Which concern belongs on your review list?',
        choices: [
          'Whether the form has a nice button colour and a friendly sentence above the boxes',
          'Whether the HTML file name has a capital letter',
          'Spam abuse, data retention, consent and what the service does with the data',
          'Whether the page has an h1',
        ],
        answer: 2,
        explanation: 'Third-party form endpoints raise abuse, retention and privacy questions. These matter more than styling when you take over other people\'s data.',
      },
    ],
    task: {
      title: 'Add a form that really works',
      minutes: 20,
      steps: [
        'Create a Google Form with three questions your page needs (for example name, how to reach you, what they want). Publish it.',
        'Copy its embed code and ask the AI to add it to your page in a new section, with a clear prompt that says to change nothing else.',
        'Fill in the form yourself on your phone and check the answer reaches your Google account.',
        'Write one sentence under the form saying what you will do with the answers. Add the prompts to your prompt log.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you would rather not use Google Forms, use an email link only: ask the AI to add a clear "Email us to order" button with your address, and test it.'] },
      { audience: { min: 'advanced' }, steps: ['List the spam, retention and privacy risks of the receiver you chose, and add one mitigation for each to your notes.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-09',
    day: 9,
    title: 'Making it look good: colours, layout and words',
    summary: 'Make your page easier to read and nicer to use with a few design habits, and ask the AI for them in specific words.',
    intro: {
      objectives: [
        'Choose readable colours and text sizes, and check contrast',
        'Ask the AI for specific design changes instead of "make it nicer"',
        'Write a headline and a button that tell visitors what to do',
      ],
      why: 'A page that is easy to read on a phone and says clearly what you offer gets more customers than a fancy one nobody can read. Good looks here mean clear, not decorated.',
    },
    minutes: 25,
    skills: ['forms-and-design'],
    body: [
      { type: 'paragraph', text: "\"Make it look nicer\" is the most common design request, and it is the least useful one. Nicer how? The AI will change colours, fonts and spacing in ways you did not choose. Design for a small page is not about taste; it is a handful of habits that make a page easy to read and easy to act on. Learn the habits, and you can ask for exactly what you want." },
      { type: 'heading', text: 'Five habits that matter most' },
      { type: 'list', ordered: true, items: [
        '**Readable text.** Body text around 16 to 18 pixels, with space between lines (a line height of about 1.5 or 1.6) and short lines. Small, tight text is the first thing that makes a page tiring.',
        '**Enough contrast.** Text must stand out from its background. The accessibility guidelines ask for a contrast ratio of at least 4.5 to 1 for normal text and 3 to 1 for large text. Dark brown on cream passes easily. Light grey on cream does not.',
        '**Few colours.** One background, one text colour and one accent colour for headings and buttons is plenty. More colours quickly look messy.',
        '**Room to breathe.** Space between sections and inside buttons. Cramped pages feel cheap.',
        '**Phone first.** Most of your visitors will arrive on a phone. A page needs the viewport line in its head (the AI normally includes it) so the phone shows it at its own width instead of shrinking a desktop page.',
      ] },
      { type: 'version', text: "W3C's explanation of WCAG 2.2 success criterion 1.4.3 says level AA requires a contrast ratio of at least 4.5 to 1 for normal text and 3 to 1 for large text (at least 18 point, or 14 point bold). MDN says the viewport meta tag with width=device-width makes mobile browsers use the device's real screen width instead of a wider virtual one that is then shrunk to fit. For reference, the page's dark brown text on its cream background has a ratio of about 13 to 1, and light grey (#cccccc) on the same cream is about 1.5 to 1.", checked: CHECKED, sources: [DOCS.wcagContrast, DOCS.mdnViewport] },
      { type: 'heading', text: 'Asking for design in specific words' },
      {
        type: 'table',
        headers: ['Instead of this', 'Ask for this'],
        rows: [
          ['Make it readable', 'Make the body text 18 pixels with a line height of 1.6'],
          ['Make it colourful', 'Use only brown, cream and one green accent colour, and keep text easy to read'],
          ['Make it breathe', 'Add more space above each h2 heading and more padding inside the button'],
          ['Make the button better', 'Make the order button bigger, with at least 14 pixels of padding, so it is easy to tap on a phone'],
        ],
        caption: 'Specific requests give the AI something to measure. Vague ones give it permission to guess.',
      },
      { type: 'prompt', label: 'A design request', text: "In my index.html, make these changes and nothing else: set the body text to 18 pixels with a line height of 1.6, add more space above each h2 heading, and make the order button easier to tap with larger padding. Keep the same colours. Send me the whole updated file." },
      { type: 'code', language: 'css', label: 'The kind of change you will see', code: "body {\n  font-family: Arial, sans-serif;\n  font-size: 18px;\n  line-height: 1.6;\n  margin: 0;\n  color: #3b2a20;\n  background: #fff8ee;\n}\nh2 {\n  color: #7a3e1d;\n  margin-top: 32px;\n}\n.button {\n  display: inline-block;\n  background: #7a3e1d;\n  color: white;\n  padding: 14px 24px;\n  border-radius: 8px;\n  text-decoration: none;\n}" },
      { type: 'paragraph', text: "One thing to know when reading CSS the AI adds: when two rules set the same property for the same piece, and they are equally specific, the one lower in the file wins. That is why an AI's extra rule at the bottom can quietly override one near the top, and why a change sometimes seems to do nothing: another rule is still winning." },
      { type: 'heading', text: 'The words matter as much as the colours' },
      { type: 'paragraph', text: "A visitor decides in a few seconds whether the page is for them. The first screen should answer three questions: what is this, who is it for, and what do I do next. \"Welcome to our website\" answers none of them. \"Fresh homemade kakanin in Naga City. Order a day before\" answers the first two. A button that says \"Order by email\" answers the third, better than a button that says \"Submit\" or \"Click here\". Write the words yourself, or ask the AI for three options and choose and correct one, because you know your visitors." },
      { type: 'tip', text: "Check the page at phone width. Make your browser window very narrow, or open the page on your phone once it is published. If the text is tiny or you have to scroll sideways, tell the AI exactly what you see." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: designing a page is like arranging a shop window. People walk past quickly. If the sign is small and the colours fight, they keep walking. If the sign is big, clear and says what you sell, they stop. Contrast is whether the sign can be read from across the street. Space is not leaving the window empty: it is not stacking everything on top of each other. And \"make it nicer\" is like asking a helper to \"arrange the window better\" without saying what you sell: you get their taste, not yours.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Design constraints are best expressed as tokens and checks rather than adjectives: a short palette with named custom properties, a type scale, a spacing scale, a minimum touch-target size, and a contrast threshold you can verify with a tool. Ask the model to keep them as variables so later edits stay consistent, and verify the result with automated checks (contrast, viewport, tap targets) instead of by eye. Cascade order and specificity are the usual reason generated styles fight each other; keep one stylesheet, avoid !important and remove superseded rules.",
      },
      {
        type: 'takeaways',
        items: [
          'Readable text, enough contrast, few colours, space and a phone-first page matter more than decoration.',
          'Normal text needs a contrast ratio of at least 4.5 to 1; check light text on light backgrounds.',
          'Ask for specific, measurable changes and say "change nothing else".',
          'The headline and the button should say what you offer and what to do next.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-09-fix-bug-1',
          kind: 'fix-bug',
          title: 'The footer nobody can read',
          story: 'Mila\'s opening hours are in the footer, but on her cream background they are almost invisible.',
          prompt: 'One line makes the footer hard to read. Tap it, then choose the best fix.',
          concept: 'contrast',
          language: 'css',
          code: `footer {
  text-align: center;
  padding: 16px;
  font-size: 14px;
  color: #cccccc;
}`,
          bugLine: 5,
          fixes: [
            { line: '  color: #3b2a20;', correct: true, why: 'This is the same dark brown as the page text, which has a contrast ratio of about 13 to 1 on the cream background, far above 4.5 to 1.' },
            { line: '  color: #dddddd;', correct: false, why: 'This is even lighter, so the footer would be harder to read than before.' },
            { line: '  color: #999999;', correct: false, why: 'Darker than before, but it only reaches about 2.7 to 1 on cream, still below the 4.5 to 1 that normal text needs.' },
            { line: '  color: #ffffff;', correct: false, why: 'White on cream is almost invisible, with a ratio of about 1 to 1.' },
          ],
          hints: [
            'Which line sets the text colour of the footer?',
            'The text needs to be much darker than the cream background.',
            'Use the same dark brown as the rest of the text.',
          ],
          explanation: 'Light grey on cream has a contrast ratio of only about 1.5 to 1. Dark brown on cream is about 13 to 1, comfortably above the 4.5 to 1 guideline for normal text.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-09-predict-1',
          kind: 'predict-output',
          title: 'Which rule wins?',
          story: 'The AI added a second rule near the bottom of the style section.',
          prompt: 'What colour will the paragraph text be?',
          concept: 'later rule wins',
          language: 'html',
          code: `<style>
  p { color: blue; }
  p { color: green; }
</style>
<p>Open Monday to Saturday</p>`,
          expected: 'green',
          choices: ['green', 'blue', 'a mix of blue and green', 'black'],
          wrongNotes: {
            blue: 'Both rules apply to p and are equally specific, so the later one overrides the earlier one.',
            'a mix of blue and green': 'Colours do not mix: for one property the browser picks one winner.',
            black: 'Black is the default colour only when no rule sets it. Two rules set it here.',
          },
          hints: [
            'Both rules are about the same thing on the same piece.',
            'When they are equally specific, the order in the file decides.',
            'The rule lower in the file wins.',
          ],
          explanation: 'Two equally specific rules for the same property on the same piece: the later one wins, so the paragraph is green. (Checked in a browser: the computed colour was rgb(0, 128, 0).)',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-09-scenario-1',
          kind: 'scenario',
          title: 'Which headline works?',
          prompt: 'Pick the headline and button that best fit a first screen.',
          concept: 'clear words',
          situation: 'Mila\'s Kakanin has a headline and a button at the top of the page. Visitors come from a link on a local community page, on their phones.',
          options: [
            { text: 'Headline: "Welcome to our website". Button: "Submit".', consequence: 'Visitors cannot tell what the shop sells or what the button does, and many leave.', quality: 'poor' },
            { text: 'Headline: "Fresh homemade kakanin in Naga City". Subline: "Order one day before." Button: "Order by email".', consequence: 'In a few seconds visitors know what it is, where it is and what to do next.', quality: 'best' },
            { text: 'Headline: "The Finest, Most Exceptional Artisanal Rice Cakes Experience". Button: "Click here".', consequence: 'Big words say little, and "Click here" does not say what will happen.', quality: 'poor' },
            { text: 'Headline: "Mila\'s Kakanin". Button: "Order".', consequence: 'Better than nothing. But visitors may not know what Mila sells or where.', quality: 'acceptable' },
          ],
          hints: [
            'Check the three questions: what is this, who is it for, what do I do?',
            'A button should say what happens when you press it.',
            'The headline with the food, the place and the order instruction.',
          ],
          explanation: 'The first screen should say what you offer, where, and what to do. Plain, specific words beat grand ones.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-09-q1',
        prompt: 'What contrast ratio do the accessibility guidelines ask for with normal-sized text?',
        choices: ['At least 4.5 to 1', 'At least 1.5 to 1', 'At least 20 to 1', 'Exactly 3 to 1'],
        answer: 0,
        explanation: 'Level AA asks for at least 4.5 to 1 for normal text and 3 to 1 for large text.',
      },
      {
        id: 'ai-coding-beginners-09-q2',
        prompt: 'Which design request will give you the most control?',
        choices: [
          'Make the whole site more modern and beautiful',
          'Add some cool effects and animations so that the whole page feels more exciting to visitors',
          'Make the body text 18 pixels with a line height of 1.6, and change nothing else',
        ],
        answer: 2,
        explanation: 'Measurable requests give the AI something to do exactly. Words like "beautiful" make it choose for you.',
      },
      {
        id: 'ai-coding-beginners-09-q3',
        prompt: 'Why does a page need the viewport line in its head for phones?',
        choices: [
          'So the page prints well on paper, in the right colours, when a visitor decides to print it out',
          'So the phone shows the page at the phone\'s own width instead of shrinking a wider page',
          'So the page loads in under a second',
          'So the colours look brighter',
        ],
        answer: 1,
        explanation: 'Without it, many phones draw the page as if the screen were much wider, and shrink it, making the text tiny.',
      },
      {
        id: 'ai-coding-beginners-09-q4',
        prompt: 'You add a new CSS rule at the bottom, but the heading colour does not change. A rule higher up sets the same colour for the same piece. Which is most likely?',
        choices: [
          'The browser has to be restarted completely and its saved files emptied before any new rule shows up',
          'The AI forgot how to write CSS',
          'The later rule should win if equally specific, so check for a more specific rule or a typo',
        ],
        answer: 2,
        explanation: 'For equally specific rules the later one wins. If it does not, another rule is more specific or something is misspelled.',
      },
      {
        id: 'ai-coding-beginners-09-q5',
        audience: { max: 'beginner' },
        prompt: 'In the shop window comparison, what is contrast?',
        choices: [
          'Whether the sign can be read from across the street',
          'How many different signs can fit in the shop window at the same time',
          'The price of the sign',
        ],
        answer: 0,
        explanation: 'Contrast is how clearly text stands out from its background, like a sign you can read from far away.',
      },
      {
        id: 'ai-coding-beginners-09-q6',
        audience: { min: 'advanced' },
        prompt: 'Generated styles keep fighting each other after several AI edits. What is the most effective structural fix?',
        choices: [
          'Add !important to every declaration',
          'Consolidate into one stylesheet with named custom properties, and remove superseded rules',
          'Ask the model to write the same rules again in a different order each time, until one works',
          'Inline every style on each element',
        ],
        answer: 1,
        explanation: 'Fighting rules come from accumulated overrides. A single source of design values and the removal of dead rules make later edits predictable.',
      },
    ],
    task: {
      title: 'Make your page easy to read',
      minutes: 20,
      steps: [
        'Save a copy of your current page. Ask for one specific change to text size and line height, then check it.',
        'Check the contrast of your text against its background by eye, and if anything is light on light, ask for a darker colour.',
        'Rewrite your headline and button so the first screen says what you offer, where, and what to do. Ask the AI to apply your words exactly.',
        'Open the page on a phone or a very narrow window and note what you would still change.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Is there anything on my page that someone with weak eyesight would struggle to read?" and decide which of its answers you agree with.'] },
      { audience: { min: 'advanced' }, steps: ['Replace the hex values with named custom properties and measure every text and background pair against 4.5 to 1.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-10',
    day: 10,
    title: 'Putting it on the internet',
    summary: 'Publish your page for free with GitHub Pages, find its public address, check it on a phone and update it later.',
    intro: {
      objectives: [
        'Explain hosting, a static site, an address and deploying in plain words',
        'Publish your page with GitHub Pages and open it on your phone',
        'Work out why a published page shows a not-found message',
      ],
      why: 'A page on your own computer helps nobody. Publishing is the step that turns your work into something a customer, a friend or a client can actually open from a link.',
    },
    minutes: 25,
    skills: ['publish-site'],
    body: [
      { type: 'paragraph', text: "Right now your page exists in two places: on your computer and in your GitHub repository. Only you can see the first, and visitors cannot open the second like a website. Publishing means putting your files on a computer that is always switched on, always connected, and happy to send your page to anyone who asks for its address. Companies rent out such computers, and some offer a free plan for small simple sites like yours." },
      { type: 'heading', text: 'Five words, explained' },
      { type: 'list', items: [
        '**Hosting:** keeping your files on a computer that is always online so visitors can reach them.',
        '**Static site:** a site made only of files that are sent exactly as they are: HTML, CSS and pictures. Yours is one. (The opposite is a site with a program behind it that makes pages on demand, such as a shop with accounts.)',
        '**Address (URL):** the web address a visitor types or taps, such as `https://yourname.github.io/my-first-site/`.',
        '**Domain:** the readable part of an address, such as `github.io`. Owning your own, such as `milaskakanin.com`, is possible, usually costs a yearly fee, and can wait.',
        '**Deploy:** to put the current version of your files on the host so visitors see it.',
      ] },
      { type: 'visual', id: 'web-client-server', caption: 'A visitor\'s browser asks the host for your page, and the host sends back your files. For a static site that is all that happens.' },
      { type: 'heading', text: 'Publishing with GitHub Pages' },
      { type: 'paragraph', text: "You already have your files in a GitHub repository, and GitHub has a free hosting feature called **GitHub Pages** that takes the files of a repository and publishes them as a website. For a free account the repository must be public, which is what you chose in lesson 7." },
      { type: 'list', ordered: true, items: [
        'Check that the page works on your computer and that the file is named exactly `index.html` and sits at the top level of the repository, not inside a folder. GitHub looks for that name.',
        'Open your repository on GitHub and click **Settings**. (If you do not see it, open the **More** menu first.)',
        'In the left menu click **Pages**.',
        'Under **Build and deployment**, set **Source** to **Deploy from a branch**.',
        'Choose the branch (**main**) and the folder **/ (root)**, then click **Save**.',
        'Wait. GitHub builds and publishes the site, which can take a few minutes, and changes can take up to ten minutes to appear. The Pages settings page usually shows your address once it is live, and it follows the pattern in the note below.',
        'Open the address on your phone. That is your page on the internet.',
      ] },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'From your files to a visitor: commit, GitHub Pages builds, then anyone with the address can open it.',
        source: 'flowchart LR\n  A[Files on your computer] --> B[Upload and commit to the repository]\n  B --> C[GitHub Pages builds the site]\n  C --> D[Public address]\n  D --> E[A visitor\'s browser shows your page]',
      },
      { type: 'version', text: "GitHub's docs describe the steps above: under Settings, Pages and Build and deployment, set Source to Deploy from a branch, pick a branch and either /(root) or /docs, and Save. The site needs an entry file named index.html, index.md or README.md at the top of the publishing source, and changes can take up to 10 minutes to appear. On a GitHub Free account the repository must be public, and a Pages site is publicly available on the internet. A project site's address has the form https://your-username.github.io/repository-name/. Menus and labels do change, so follow the current docs if they differ.", checked: CHECKED, sources: [DOCS.ghWhatPages, DOCS.ghCreatePages, DOCS.ghSource], plans: 'GitHub Free: public repositories' },
      { type: 'heading', text: 'Updating your live page' },
      { type: 'paragraph', text: "To change the live page, change your file as you did in earlier lessons, upload the new `index.html` to the repository (Add file, Upload files, same name) and commit with a clear note. GitHub publishes the new version after a few minutes. That is why saving versions matters: every commit to the publishing branch is an update to the real, public page." },
      { type: 'heading', text: 'When it shows "404" (page not found)' },
      { type: 'list', items: [
        '**Not yet:** wait ten minutes and refresh before you change anything.',
        '**Wrong file name:** it must be `index.html`, all lowercase, at the top level of the repository. `Index.html` or a folder around it is a common cause.',
        '**Pages not switched on:** check Settings, then Pages, and that the branch and folder are saved.',
        '**Private repository on a free account:** it must be public.',
        '**Wrong address:** a project site\'s address includes the repository name at the end.',
      ] },
      { type: 'paragraph', text: "Another free route exists if you prefer: Cloudflare Pages lets you drag a folder of files into its dashboard (it calls this Direct Upload) and publishes it under an address ending in `pages.dev`. It needs a Cloudflare account, and Cloudflare's docs say that choosing Direct Upload is permanent for that project. We use GitHub Pages in this course because you already have your files there with their history." },
      { type: 'version', text: "Cloudflare's Direct Upload docs say you open Workers and Pages in the dashboard, choose to drag and drop your files, name the project and upload a folder or a zip file; the project is served from a pages.dev address, drag-and-drop uploads accept up to 1,000 files with a 25 MiB limit per file, and choosing Direct Upload cannot later be switched to Git integration. Check Cloudflare's own pages for what its free plan includes today.", checked: CHECKED, sources: [DOCS.cloudflareUpload] },
      { type: 'warning', text: "A published page is public: anyone who has the address can read it, and search engines may find it. Put only what you are happy for the whole world to see on it, and re-read the page as a stranger would before you share the link." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: cooking at home is not selling. To sell, you rent a stall at the market. Hosting is the stall, and it is open all day even when you are asleep. Your address is the sign over the stall with your name on it. Deploying is carrying today's batch from your kitchen to the stall. A static site is a stall that just hands out what is already on the table; there is no kitchen behind it making things to order. When you change the recipe, you carry the new batch over, and it takes a few minutes before the table is updated.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Static hosting from a branch is the lowest-risk deployment there is: no runtime, no secrets, content served from a CDN, and a rollback that is a revert commit. GitHub builds Pages through a workflow, which also means you can add a build step or a custom workflow later. Things to decide deliberately: the publishing branch and folder, custom domain and HTTPS, caching delays after a deploy, access logs (GitHub states that visitor IP addresses are logged for security), indexing (a noindex tag if the page should not be searchable) and who has write access to the repository, since commit access equals publish access.",
      },
      {
        type: 'takeaways',
        items: [
          'Hosting keeps your files online; a static site is just files; an address lets visitors reach it; deploying puts the current version live.',
          'GitHub Pages publishes a repository for free (public repositories on a free account): Settings, Pages, Deploy from a branch.',
          'The entry file must be index.html at the top level, and changes can take up to ten minutes to appear.',
          'A published page is public: check it on a phone and as a stranger before sharing it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-10-arrange-1',
          kind: 'arrange',
          title: 'Publish with GitHub Pages',
          prompt: 'Put the steps in the right order.',
          concept: 'publishing steps',
          language: 'text',
          solution: [
            'Check the page works and the file is named index.html at the top level',
            'Open the repository and click Settings, then Pages',
            'Set Source to Deploy from a branch',
            'Choose the main branch and the / (root) folder, then click Save',
            'Wait a few minutes for the site to build',
            'Open your github.io address on your phone',
          ],
          reasons: [
            'There is no point publishing a page that does not work.',
            'The publishing settings live in the repository\'s Settings.',
            'You tell GitHub where the files come from.',
            'You say which branch and folder to publish, and save.',
            'The site needs time to build and appear.',
            'Checking on a phone is the real test.',
          ],
          hints: [
            'Check your page before you publish it.',
            'You need to find the setting before you can choose its options.',
            'The last step is to look at the result.',
          ],
          explanation: 'Check, find the Pages setting, choose the source, save, wait, then test on a phone.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-10-match-1',
          kind: 'match',
          title: 'Which word is it?',
          prompt: 'Match each situation to the word for it.',
          concept: 'hosting words',
          labels: { terms: 'The situation', meanings: 'The word' },
          pairs: [
            { term: 'Your page is made of only HTML, CSS and pictures, sent to visitors as they are', definition: 'A static site', note: 'Nothing is made on demand, so it is static.' },
            { term: 'You carry the newest version of your files to the place visitors reach', definition: 'Deploying', note: 'Deploying means putting the current version live.' },
            { term: 'A visitor types something like https://mila.github.io/kakanin/', definition: 'The address (URL)', note: 'That text is the address of the page.' },
            { term: 'A company keeps your files on a computer that is always online', definition: 'Hosting', note: 'Hosting is keeping your files reachable all the time.' },
          ],
          hints: [
            'Which word describes the kind of site, and which describes an action?',
            'The address is what a visitor types or taps.',
            'Hosting is the service of keeping files online.',
          ],
          explanation: 'Static site for the kind of page, hosting for the always-on computer, address for what visitors type and deploying for putting the new version live.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-10-scenario-1',
          kind: 'scenario',
          title: 'The page that says 404',
          prompt: 'Pick the best next step.',
          concept: 'troubleshooting a published page',
          situation: 'You turned on GitHub Pages two minutes ago. The address shows a "404 not found" page. Your repository is public, and your file is called Index.html (with a capital I) in the top level.',
          options: [
            { text: 'Rename the file to index.html in lowercase, commit, and wait a few minutes.', consequence: 'GitHub finds the entry file and the page appears after the next build.', quality: 'best' },
            { text: 'Delete the repository and start again.', consequence: 'You lose your history and will probably repeat the same mistake.', quality: 'poor' },
            { text: 'Ask the AI to write a new website from scratch.', consequence: 'The new site has the same problem: a name that GitHub does not look for.', quality: 'poor' },
            { text: 'Just wait an hour and do nothing else.', consequence: 'You may wait for nothing: the name is wrong, and waiting will not fix that.', quality: 'acceptable' },
          ],
          hints: [
            'GitHub looks for a very specific file name.',
            'Compare your file name letter by letter.',
            'It must be index.html in lowercase.',
          ],
          explanation: 'The entry file must be named index.html. A capital letter or a folder around it means GitHub cannot find it. Fix the name, commit and give the build a few minutes.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-10-q1',
        prompt: 'What makes your site a "static site"?',
        choices: [
          'It never changes, so once published it can never be updated or corrected again, even by you, the owner of the site',
          'It is made of files that are sent to visitors as they are, with no program making pages on demand',
          'It only works on computers, not phones',
        ],
        answer: 1,
        explanation: 'Static means the host just sends your files. You can still update the files; it is the serving that is static.',
      },
      {
        id: 'ai-coding-beginners-10-q2',
        prompt: 'On a free GitHub account, what must be true of the repository to publish it with GitHub Pages?',
        choices: [
          'It has to be public',
          'It has to be private',
          'It has to contain at least ten files',
          'It has to have a custom domain',
        ],
        answer: 0,
        explanation: 'For GitHub Free the repository must be public to use Pages. A Pages site is public on the internet.',
      },
      {
        id: 'ai-coding-beginners-10-q3',
        prompt: 'You committed an updated index.html to your publishing branch. When will visitors see the change?',
        choices: [
          'Instantly, in the same second you press the commit button, for every visitor in the world',
          'Never; you have to republish from scratch',
          'After a few minutes, once GitHub has built and deployed it, which can take up to ten',
        ],
        answer: 2,
        explanation: 'Publishing is not instant. GitHub builds and deploys after each commit, and changes can take up to ten minutes.',
      },
      {
        id: 'ai-coding-beginners-10-q4',
        prompt: 'Why check the published page on your phone?',
        choices: [
          'Because most visitors will use a phone, and it shows what they really see',
          'Because phones are always faster at loading pages than computers are, whatever the page',
          'Because GitHub only publishes to phones',
        ],
        answer: 0,
        explanation: 'Many visitors will arrive on a phone. Seeing the page on one shows problems you would not notice on a big screen.',
      },
      {
        id: 'ai-coding-beginners-10-q5',
        audience: { max: 'beginner' },
        prompt: 'In the market stall comparison, what is deploying?',
        choices: [
          'Painting the sign above the stall with your own name on it',
          'Carrying today\'s batch from your kitchen to the stall',
          'Closing the shop',
        ],
        answer: 1,
        explanation: 'Deploying means putting the current version of your files where visitors can reach them.',
      },
      {
        id: 'ai-coding-beginners-10-q6',
        audience: { min: 'advanced' },
        prompt: 'Who should have write access to a repository that publishes a site, and why?',
        choices: [
          'Anyone on the team, because the site is only static and nothing important can ever go wrong with it',
          'Only people you trust to publish, because commit access to the publishing branch is publish access',
          'Nobody, because Pages cannot be updated after setup',
          'Only the AI tool, to keep humans out of the way',
        ],
        answer: 1,
        explanation: 'Whatever lands on the publishing branch goes live. Write access is effectively the right to publish.',
      },
    ],
    task: {
      title: 'Publish your page',
      minutes: 20,
      steps: [
        'Check that your repository is public and holds `index.html` at the top level with the final version of your page.',
        'Turn on GitHub Pages: Settings, Pages, Deploy from a branch, main, / (root), Save.',
        'Wait for the address to go live, then open it on your phone and on your computer.',
        'Change one word on the page, upload the new file with a clear note and watch it update.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Send the link to one friend and ask: "What is this page for?" Their answer tells you if your first screen works.'] },
      { audience: { min: 'advanced' }, steps: ['Add a noindex tag if the page should not be searchable, and write down who has write access to the repository and why.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-11',
    day: 11,
    title: 'Keeping it safe: secrets, passwords and what never to paste',
    summary: 'Know what must never go into a chat or a public file, how the AI tools treat your chats, and what to do if something leaks.',
    intro: {
      objectives: [
        'Name what you must never paste into an AI chat or put in a public file',
        'Find the privacy settings of your AI tool and say what they do and do not do',
        'Respond correctly if a secret or private detail ends up somewhere public',
      ],
      why: 'A leaked password or customer list can cost far more than anything a website earns. The habits in this lesson take a few seconds each, and they protect you, your customers and your accounts.',
    },
    minutes: 25,
    skills: ['stay-safe'],
    body: [
      { type: 'paragraph', text: "Building with AI makes it very easy to paste things into a chat: an error message, a file, a spreadsheet, a screenshot. Most of the time that is fine. A few kinds of information must never go there, and a few must never go into the files of a public site either. This lesson is short on technique and big on habit. Learn the list once and the rest is just remembering to look before you paste." },
      { type: 'heading', text: 'Never paste these' },
      { type: 'list', items: [
        '**Passwords and login codes,** including the one-time codes sent to your phone. No helper, human or AI, needs your password.',
        '**Secret keys and tokens.** An **API key** is a long string of letters and numbers that lets a program use an online service as you, often billed to your account. Anyone who holds it can act as you.',
        '**Other people\'s private details:** a customer list with names and phone numbers, messages, ID numbers, health information. They trusted you, not the AI company.',
        '**Your own sensitive details:** card numbers, bank details, government ID numbers, and your home address when it is not needed.',
        '**Confidential material that belongs to an employer or a client.**',
      ] },
      { type: 'paragraph', text: "You can nearly always get the help you want without the real thing. Replace real names with \"Customer A\" and phone numbers with obviously fake ones like 0917 000 0000. Describe a spreadsheet's columns instead of pasting its rows. If an error message contains a key or a password, cut it out before you paste." },
      { type: 'prompt', label: 'Asking for help without real data', text: "I run a small bakery. I want a simple order list on my page. Here is a made-up example of the information: Customer A, 0917 000 0000, 2 trays of biko, pickup Friday. Please design the layout of the list. These details are fake; do not ask me for real ones." },
      { type: 'heading', text: 'What the AI tools do with your chats' },
      { type: 'paragraph', text: "AI companies may keep your conversations, and, depending on your settings, may use them to improve their models, and a small number may be read by human reviewers. Each tool has settings that change this. They are worth a look once, now:" },
      {
        type: 'table',
        headers: ['Tool', 'Where to look', 'What it does'],
        rows: [
          ['ChatGPT', 'Settings, Data controls', 'Turning off "Improve the model for everyone" stops new conversations being used for training. A Temporary Chat stays out of your history and is not used to improve models'],
          ['Claude', 'Privacy settings; incognito chat', 'You can change the model improvement setting at any time. Incognito chats are not used to improve Claude. Anthropic advises caution with passwords, card and health details and confidential documents'],
          ['Gemini', 'Settings and help, then Activity (Keep Activity)', 'On by default for adults. Turning it off stops future chats being used to train the models, unless you send feedback, but chats are still stored for up to 72 hours. A subset of chats is reviewed by people'],
        ],
        caption: 'Settings reduce how a company may use your chats. They do not make it safe to paste a secret.',
      },
      { type: 'version', text: "As of 2026-11-14: Google's Gemini pages say that with Keep Activity off, chats are still stored with your account for up to 72 hours, that a subset of chats is reviewed by human reviewers (reviewed chats are kept for up to three years), and that you should not enter confidential information you would not want a reviewer to see; temporary chats are not used to train Google's models. Anthropic's help centre says incognito chats are not used to improve Claude and recommends caution with passwords, financial and health details and confidential documents. OpenAI's data controls article, which we could not open in full when writing, is listed with the same two controls (the improve-the-model setting and Temporary Chat): read it yourself for the current wording. Setting names and defaults change, and company accounts can differ from personal ones.", checked: CHECKED, sources: [DOCS.geminiPrivacy, DOCS.geminiActivity, DOCS.claudePrivacy, DOCS.chatgptData] },
      { type: 'heading', text: 'Public means public' },
      { type: 'paragraph', text: "Everything that goes on a public site can be read by anyone. Visitors can look at the HTML, CSS and any code in your page with one click, so a key or a password in your page is a key or a password given to everybody. Two other places are public too. A public repository shows every file, including old versions in its history, and deleting something later does not remove it from the history. And a GitHub Pages site is publicly reachable even if its repository is private. For a one-page site you do not need any key at all. If an AI ever writes a line such as `const apiKey = \"...\"` into your page, treat that as a red flag and ask why it is there." },
      { type: 'heading', text: 'Safety nets, and what to do if it leaks' },
      { type: 'paragraph', text: "GitHub has a feature called push protection that blocks you from uploading files that contain certain well-known kinds of secrets, and says it is on by default for users when they push to public repositories. Uploads through the browser are checked too. Treat it as a net under you, not a licence: it only recognises the kinds of secrets it has patterns for, and a password you typed into a notes file is not one of them." },
      { type: 'paragraph', text: "If a secret does get out, deleting it is not enough. Assume anyone could have copied it. For a password, change it now, and change it anywhere you reused it. For an API key, go to the service that issued it, cancel (revoke) that key and create a new one. For other people's details, take the file down and, if real people could be harmed, tell them." },
      { type: 'prompt', label: 'A review before you publish', text: "Here is my index.html. Please read it as a stranger who wants to misuse it. List every line that contains something private or secret: keys, passwords, phone numbers, email addresses, home addresses, names of private people, or links to private files. If there is nothing, say so. Do not change the file." },
      { type: 'version', text: "GitHub's docs describe push protection as blocking pushes that contain secrets before they reach the repository, and say it is enabled by default for users on GitHub.com for pushes to public repositories, while detection is limited to supported secret types. They also note that browser uploads are blocked when the file contains supported secrets, and that a GitHub Pages site is publicly available on the internet even if its repository is private.", checked: CHECKED, sources: [DOCS.ghPush, DOCS.ghUpload, DOCS.ghCreatePages] },
      { type: 'tip', text: "Three more small habits: use only the official site or app of a tool, never run a command an AI gives you if you do not understand what it does, and only put on your page photos and names you have the right and the permission to use." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a password is your house key. A helper can be friendly and fast, and you still do not hand them the key. An API key is the key to a shop account that charges your card. A public website is a noticeboard in the town square: anything you pin up, everybody reads, and photocopies are not takeable-back. A customer list is someone else's diary: they lent it to you, not to the whole world. When you want help with something that contains a private detail, swap the real detail for a made-up one first, like writing \"Customer A\" on the note.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat an AI provider as a third-party data processor and decide per data class: public, internal, confidential, regulated. Prefer business or API terms with no training on your data for anything that is not public, scope credentials narrowly and rotate them, keep secrets in environment variables or a secrets manager rather than in source or prompts, and add pre-commit and CI secret scanning because push protection only covers known patterns. Also review dependencies an assistant suggests (packages that do not exist or are malicious) and keep data minimisation in your design: do not collect what you cannot protect.",
      },
      {
        type: 'takeaways',
        items: [
          'Never paste passwords, login codes, API keys, other people\'s private details or your own sensitive details into a chat.',
          'Use made-up examples when you need help with something that involves private data.',
          'Privacy settings limit how a company may use your chats; they do not make secrets safe to paste.',
          'Anything on a public site or in a public repository, including its history, is public. If a secret leaks, revoke or change it; deleting is not enough.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-11-match-1',
          kind: 'match',
          title: 'Can I paste it?',
          prompt: 'Match each item to what you should do before it goes into an AI chat or a public page.',
          concept: 'what never to paste',
          labels: { terms: 'The item', meanings: 'What to do' },
          pairs: [
            { term: 'Your shop\'s opening hours and price list', definition: 'Fine to paste: it will be public on your page anyway', note: 'Public information that is going on the page is safe to share.' },
            { term: 'The password to your email account', definition: 'Never paste it into any chat or file', note: 'No tool or helper needs your password.' },
            { term: 'A sheet of real customers\' names and phone numbers', definition: 'Replace it with made-up names and numbers first', note: 'Those people trusted you with their details, not the AI company.' },
            { term: 'An API key from a service you pay for', definition: 'Keep it out of chats and out of every published file', note: 'Anyone who sees the key can use the service as you.' },
          ],
          hints: [
            'Ask: is this already going to be public?',
            'Passwords and keys are never shared; other people\'s details need a made-up stand-in.',
            'The price list is the only one that is meant for the public.',
          ],
          explanation: 'Information you are publishing anyway is safe. Passwords and keys are never shared, and other people\'s details are replaced by made-up ones for help.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-11-fix-bug-1',
          kind: 'fix-bug',
          title: 'The notes file with a secret',
          story: 'You are about to upload this notes file to your public repository.',
          prompt: 'One line must not be uploaded as it is. Tap it, then choose the safest replacement.',
          concept: 'secrets in files',
          language: 'text',
          code: `Shop notes
Opening hours: Mon-Sat 6 AM to 12 noon
Email password: kakanin2024!
Delivery area: Naga City`,
          bugLine: 3,
          fixes: [
            { line: 'Email password: (kept in a password manager, never in a file)', correct: true, why: 'The file now holds no password, and it tells your future self where the real one lives. Change the real password too, since it was typed once in the open.' },
            { line: '# Email password: kakanin2024!', correct: false, why: 'Commenting the line out hides nothing. The password is still in the file and in its history.' },
            { line: 'Email password: kakanin2025!', correct: false, why: 'Changing a digit keeps the habit, and the real password may follow the same pattern. Anyone who sees it can guess the rest.' },
            { line: 'Email password: kakanin2024! (private)', correct: false, why: 'Adding the word private does not make a public file private.' },
          ],
          hints: [
            'Which line would hurt if a stranger read it?',
            'Think about what is still visible after each replacement.',
            'The safe version does not contain any part of the password.',
          ],
          explanation: 'A secret must not appear in a public file in any form. Remove it, change the real password, and keep passwords in a password manager.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-11-scenario-1',
          kind: 'scenario',
          title: 'The pasted customer list',
          prompt: 'Pick the best response.',
          concept: 'responding to a leak',
          situation: 'Ben pasted his real customer list, with names and phone numbers, into an AI chat to ask for a layout. Then he realised it was a mistake.',
          options: [
            { text: 'Stop, delete that chat, review the tool\'s data settings, and from now on use made-up names and numbers when asking for help.', consequence: 'He limits further harm and builds the right habit. Deleting does not undo everything, but it is the right first step.', quality: 'best' },
            { text: 'Ignore it, since the AI is only a computer.', consequence: 'The details may stay stored with the company, and Ben learns nothing for next time.', quality: 'poor' },
            { text: 'Paste the list again to ask the AI to delete it.', consequence: 'The details are now in the chat twice, and the AI has no power to remove them from the company\'s records.', quality: 'poor' },
            { text: 'Delete the chat only.', consequence: 'A good first step, but without changing the habit and checking the settings, he may do it again.', quality: 'acceptable' },
          ],
          hints: [
            'Can the AI take something back once it has been pasted?',
            'Fix what you can now, and prevent it next time.',
            'Delete, check settings, use fake data in future.',
          ],
          explanation: 'You cannot take a paste back from an AI, but you can delete the chat, tighten settings and use made-up data from now on.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-11-q1',
        prompt: 'An AI suggests adding a line with an API key directly in your page\'s code so a feature works. What is the best response?',
        choices: [
          'Do it, because the page needs the key to work',
          'Do not put it in the page; a key in a page is visible to every visitor, so ask for a way that needs no key',
          'Put it in a comment inside the page, because browsers hide comments and nobody visiting the page can read them',
          'Hide it by making the text white',
        ],
        answer: 1,
        explanation: 'Anyone can view the source of a web page, comments and white text included. A one-page site does not need a secret key.',
      },
      {
        id: 'ai-coding-beginners-11-q2',
        prompt: 'You turned off the setting that lets the tool use your chats for training. What does that mean for pasting passwords?',
        choices: [
          'It is now safe to paste them',
          'It still is not a good idea: settings limit how a company uses chats, they do not remove the risk',
          'It makes no difference to anything at all, so you can ignore the whole setting and all of its warnings',
        ],
        answer: 1,
        explanation: 'The setting reduces one use of your chats. Chats may still be stored and reviewed, so passwords stay out.',
      },
      {
        id: 'ai-coding-beginners-11-q3',
        prompt: 'A password was uploaded to a public repository and deleted a day later. What do you do?',
        choices: [
          'Nothing, it is deleted',
          'Wait for GitHub to send you a warning email before you decide whether to do anything about it',
          'Change the password everywhere you used it, because the old versions stay in the history',
          'Make the repository private and keep the password',
        ],
        answer: 2,
        explanation: 'History keeps old versions and anyone could have copied it. The password has to be treated as exposed and changed.',
      },
      {
        id: 'ai-coding-beginners-11-q4',
        prompt: 'You need help with a layout for a customer list. What is the safe way to ask?',
        choices: [
          'Paste the real list so the AI sees the real shape',
          'Paste only the first five real rows, since that is a smaller part of the list',
          'Describe the columns or paste made-up rows with fake names and numbers',
        ],
        answer: 2,
        explanation: 'The AI needs the shape of the data, not the people in it. Made-up rows give the same help without risking real details.',
      },
      {
        id: 'ai-coding-beginners-11-q5',
        audience: { max: 'beginner' },
        prompt: 'In the house key comparison, what is an API key?',
        choices: [
          'The key to a shop account that charges your card',
          'A decoration that makes your page look more professional to visitors',
          'A free gift from the AI',
        ],
        answer: 0,
        explanation: 'An API key lets a program use a service as you, often billed to you. Treat it like a key to your account.',
      },
      {
        id: 'ai-coding-beginners-11-q6',
        audience: { min: 'advanced' },
        prompt: 'Why add secret scanning to pre-commit and CI when the host already has push protection?',
        choices: [
          'Push protection never works',
          'Push protection only matches known secret formats, so passwords, internal tokens and custom keys can slip through',
          'CI is required by every host',
          'Scanning makes commits faster',
        ],
        answer: 1,
        explanation: 'Detection is pattern-based and limited to supported types. Local and CI scanning with your own rules widens coverage and catches leaks before they leave your machine.',
      },
    ],
    task: {
      title: 'Check your page and your settings',
      minutes: 15,
      steps: [
        'Open the privacy or data settings of the AI tool you use, find the setting that controls whether your chats are used to improve the tool, and decide whether you want it on or off.',
        'Run the "review before you publish" prompt on your page and read the list it gives.',
        'Write your own "never paste" list on one page, with five items and what to do instead for each.',
        'Check every file in your repository: is there anything you would not want a stranger to read?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Make a fake sample of the information your page needs (for example three made-up customers) and keep it to use whenever you ask the AI for help.'] },
      { audience: { min: 'advanced' }, steps: ['Add a pre-commit secret scan to a practice repository and write down which secret types it does and does not catch.'] },
    ],
  },
  {
    id: 'ai-coding-beginners-12',
    day: 12,
    title: 'Project: a page for a real person or business',
    summary: 'Bring everything together: plan, build, check, protect and publish a one-page site for a real person or business, and keep your own prompt log and checklist.',
    intro: {
      objectives: [
        'Plan a one-page site from real facts and a single clear action',
        'Run the pre-publish checklist and publish the page',
        'Keep a prompt log and a personal checklist you can reuse',
      ],
      why: 'This is the proof that you can do it: a real page, published, that someone can open. The log and checklist you keep turn one project into a way of working you can repeat.',
    },
    minutes: 30,
    skills: ['write-prompts', 'publish-site', 'stay-safe'],
    body: [
      { type: 'paragraph', text: "You now know every step: ask clearly, read what came back, change one thing at a time, fix what breaks, save versions, add a form, make it readable, publish and keep it safe. This lesson shows how they fit together on a real job, and what to keep so the next one is faster. The project itself is below the lesson. Do it for a real person or business, with their permission, and you will have something to show." },
      { type: 'heading', text: 'Start with a real person and real facts' },
      { type: 'paragraph', text: "Pick a real small business, a community group, a freelancer or a person who needs a simple page: a neighbour's stall, a friend's tutoring service, your own side business. Talk to them first. Agree what the page is for, and get the real facts: name, what is offered, prices or details, hours, how to reach them, and photos or text they are happy to have public. Ask permission to publish their name, contact details and any photo. A page about a real person without their agreement is not a project, it is a risk." },
      { type: 'heading', text: 'Plan one page around one action' },
      { type: 'paragraph', text: "Write down the one thing a visitor should do: order by email, call, fill in a form, visit the stall. Everything on the page should lead to it. A good one-page site for a small business has a headline that says what is offered and where, a short list of what they offer with real prices, how to order or get in touch, hours and place, and a clear button." },
      { type: 'heading', text: 'Build it in small steps' },
      {
        type: 'table',
        headers: ['Step', 'What you ask the AI', 'What you check'],
        rows: [
          ['1. First draft', 'A prompt with goal, true facts, look and one file called index.html', 'Every name, price and time against the owner\'s words'],
          ['2. Content fixes', 'One change at a time, naming the piece and saying change nothing else', 'The whole page after each change'],
          ['3. Look', 'Specific design changes: text size, colours, space, button', 'Contrast, and the page on a phone'],
          ['4. Contact', 'An email link or an embedded Google Form', 'A real test message arrives'],
          ['5. Save', 'Nothing: commit each good version to GitHub with a clear note', 'The history shows your steps'],
          ['6. Protect', 'The "review before you publish" prompt', 'No secrets or private data; permissions given'],
          ['7. Publish', 'Nothing: turn on GitHub Pages', 'The live address works on a phone'],
        ],
        caption: 'The whole course on one page.',
      },
      { type: 'heading', text: 'Your pre-publish checklist' },
      { type: 'list', items: [
        'The page opens and looks right on a phone and on a computer.',
        'The owner has read the page and confirmed every fact, price and time.',
        'Every link and button works, and the contact route delivers a test message.',
        'Text is readable: contrast is high enough and the text is large enough.',
        'No passwords, keys, private phone numbers, customer details or private photos are in any file or in the repository history.',
        'You have permission for every name and photo that appears.',
        'The final version is committed with a clear note.',
      ] },
      { type: 'heading', text: 'Your prompt log and workflow card' },
      { type: 'paragraph', text: "Throughout the course you have been collecting prompts. Now make them useful. A **prompt log** is a note with one entry per request: the date, the goal, the prompt you sent, what came back, what you changed and what you learned. It turns lucky prompts into a library you can reuse. Next to it, keep a one-page **workflow card**: your own checklist and routine." },
      {
        type: 'table',
        headers: ['Date', 'Goal', 'Prompt (short)', 'Result', 'What I learned'],
        rows: [
          ['14 Nov', 'First draft', 'One-page site for Mila\'s Kakanin, facts, brown and cream, one file', 'Good start; the email address was a placeholder', 'Always check contact details'],
          ['14 Nov', 'Bigger text', 'Body 18 px, line height 1.6, change nothing else', 'Worked first time', 'Numbers beat adjectives'],
        ],
        caption: 'A prompt log entry is short. What matters is that you write it as you go.',
      },
      { type: 'list', items: [
        '**Before each change:** save a working version (commit or copy).',
        '**Each request:** one change, name the piece, say what to keep, say how I want the answer.',
        '**After each reply:** replace the file, refresh, look at the whole page.',
        '**Before I paste anything:** is it a password, a key, or someone else\'s details?',
        '**Before I publish:** the checklist above.',
      ] },
      { type: 'version', text: "Free plans and menus change, so before you start a new project re-check the current free limits of your AI tool and the current Pages steps. GitHub's docs say a Pages site is publicly available on the internet and, on a free account, needs a public repository; its quickstart and upload pages describe how to create a repository and add files in the browser.", checked: CHECKED, sources: [DOCS.ghCreatePages, DOCS.ghRepo, DOCS.ghUpload] },
      { type: 'paragraph', text: "Where to next? When you want a site with several pages, a booking or contact flow and more checks on accessibility and speed, the **Build a Website with AI** course picks up where this one stops. When you want to get better at telling AI what you want, **Prompt Engineering for Software Development** goes deeper on prompts. What you built here, a clear request, a read-and-check habit and a safe way to publish, is the base for both." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: your prompt log is a recipe notebook. When a dish works, you write down what you did, so next time you do not have to start from nothing. The workflow card is the sticky note on the fridge: the few things you always do before you serve. And the checklist before publishing is tasting the food before the guests arrive. It is a small step that saves a lot of embarrassment.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Convert the log and card into reusable artefacts: a standing instructions block (stack constraints, design tokens, content rules, what never to include) to paste or load at the start of each session, and a verification script or checklist that runs before every deploy (link check, contrast, secret scan, size). For a client engagement add acceptance criteria agreed up front, review evidence per change (diffs, screenshots at two widths), a handover note, and a stated owner for content and for the repository, so the site outlives your involvement.",
      },
      {
        type: 'takeaways',
        items: [
          'Start from a real person, real facts and permission, and plan the page around one action.',
          'Build in small steps, checking the whole page after each change and saving each good version.',
          'Run the pre-publish checklist: facts confirmed, contact tested, readable, no secrets, permissions, committed.',
          'Keep a prompt log and a workflow card: they turn this project into a repeatable way of working.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-12-arrange-1',
          kind: 'arrange',
          title: 'The project, in order',
          prompt: 'Put the steps of a real project in a sensible order.',
          concept: 'the whole workflow',
          language: 'text',
          solution: [
            'Agree with the owner what the page is for and collect the real facts and permissions',
            'Write the first prompt with the goal, facts, look and one-file request',
            'Open the page and check every fact with the owner',
            'Change one thing at a time and commit each good version',
            'Add a way to receive orders and send yourself a test',
            'Run the pre-publish checklist, including secrets and permissions',
            'Publish with GitHub Pages and open it on a phone',
            'Write what you learned in your prompt log',
          ],
          reasons: [
            'Without facts and agreement there is nothing safe to build.',
            'The first draft needs the facts in the prompt.',
            'The owner can spot what the AI invented.',
            'Small steps with saved versions keep control.',
            'The contact route must be tested before visitors rely on it.',
            'The checklist is the last gate before the world sees it.',
            'Publishing and checking on a phone proves it works.',
            'The log makes the next project faster.',
          ],
          hints: [
            'Facts and permission come before any prompt.',
            'Check and change come before you add extras.',
            'The checklist comes just before publishing, and the log last.',
          ],
          explanation: 'Facts and permission, first draft, check, small changes, contact route, checklist, publish, log. Each step protects the next.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-coding-beginners-12-scenario-1',
          kind: 'scenario',
          title: 'One minute before you publish',
          prompt: 'Pick the best action.',
          concept: 'pre-publish checklist',
          situation: 'Your page for a friend\'s tutoring service is ready. Reading it once more, you notice the phone number on the page is one you made up for testing, and a notes file in the repository lists two students\' names and their grades.',
          options: [
            { text: 'Put the real number on the page, confirm it with your friend, remove the notes file and check that nothing private remains, then publish.', consequence: 'The page is correct and no private details are public. You also note that the file existed in the history and take care of that.', quality: 'best' },
            { text: 'Publish now and fix it later, because it is only a small page.', consequence: 'Customers call a wrong number and the students\' names and grades are public for as long as it takes you to notice.', quality: 'poor' },
            { text: 'Only change the phone number and publish.', consequence: 'The page is better, but the notes file with the students\' details is still public.', quality: 'poor' },
            { text: 'Remove the notes file and publish, planning to check the number later.', consequence: 'The private data is gone from view, but the page may show a wrong phone number to every visitor.', quality: 'acceptable' },
          ],
          hints: [
            'Which problems are about facts, and which are about privacy?',
            'Both must be fixed before anyone can see the page.',
            'Real number confirmed, notes file removed, then publish.',
          ],
          explanation: 'The checklist exists for moments like this. Wrong facts and private data both stop a page from being ready.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-coding-beginners-12-q1',
        prompt: 'Why start a real project by talking to the person the page is for?',
        choices: [
          'To get the real facts and their permission before anything is published',
          'To let them choose the font and colours before you write the first prompt',
          'Because the AI needs their email address',
        ],
        answer: 0,
        explanation: 'Real facts stop the AI inventing details, and permission matters when a page names people or shows their contact details and photos.',
      },
      {
        id: 'ai-coding-beginners-12-q2',
        prompt: 'What should a one-page site for a small business lead the visitor towards?',
        choices: [
          'As many links as possible',
          'A short story of the company\'s history',
          'One clear action, such as ordering by email or calling',
          'A long list of every product the owner has ever sold in the shop',
        ],
        answer: 2,
        explanation: 'Visitors decide in seconds. One clear action gives them something to do, and the rest of the page supports it.',
      },
      {
        id: 'ai-coding-beginners-12-q3',
        prompt: 'What is the main value of a prompt log?',
        choices: [
          'It makes the AI work faster and cheaper on every request that you send to it later on',
          'It proves you are not copying',
          'It turns lucky prompts into a library you can reuse and shows what you learned',
        ],
        answer: 2,
        explanation: 'A log records what you asked, what happened and what you learned, so next time you start from what worked.',
      },
      {
        id: 'ai-coding-beginners-12-q4',
        prompt: 'Which item belongs in the pre-publish checklist?',
        choices: [
          'Ask the AI to rewrite the whole page one last time, to make sure that it looks different from the first draft',
          'Confirm every fact with the owner, test the contact route and check that nothing private is in any file',
          'Make the page longer',
          'Delete the prompt log',
        ],
        answer: 1,
        explanation: 'The checklist covers facts, working links, readability, privacy and permissions: the things that hurt most when they are wrong.',
      },
      {
        id: 'ai-coding-beginners-12-q5',
        audience: { max: 'beginner' },
        prompt: 'In the recipe notebook comparison, what does the prompt log do?',
        choices: [
          'It stores the website so that visitors can open it from anywhere',
          'It lets you reuse what worked instead of starting from nothing',
          'It cooks the food',
        ],
        answer: 1,
        explanation: 'Like a recipe notebook, the log records what worked so you can repeat it.',
      },
      {
        id: 'ai-coding-beginners-12-q6',
        audience: { min: 'advanced' },
        prompt: 'You hand a small client site to its owner. Which handover item prevents the most future trouble?',
        choices: [
          'A complete list of every prompt you used, in the order you sent them to the AI, with the replies',
          'Nothing, since the site is static',
          'A screenshot of the finished home page',
          'A named owner for content and repository access, plus a short note on how to update and deploy',
        ],
        answer: 3,
        explanation: 'Sites go stale and break when nobody knows who changes content or who can publish. Ownership and a short update note keep it alive.',
      },
    ],
    task: {
      title: 'Write your workflow card',
      minutes: 15,
      steps: [
        'Open your prompt log and mark the three prompts that worked best.',
        'Write a one-page workflow card with your routine for each request and your "never paste" list.',
        'Copy the pre-publish checklist from this lesson and add one item of your own.',
        'Do the project below with a real person or business.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Read your card aloud to a friend: if it is clear to them, it will be clear to you in a month.'] },
      { audience: { min: 'advanced' }, steps: ['Turn your card into an instructions block and an automated pre-deploy check, and run both on this project.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'ai-coding-beginners-p1',
    title: 'A published page for a real person or business',
    summary: 'Build, check and publish a one-page website for a real person or small business, using only AI prompts, and keep your prompt log and workflow card.',
    outcome: 'A live link to a real page you made with AI, plus a prompt log that shows how you asked, checked and fixed: proof you can take a small web job from idea to the internet safely.',
    unlockAfterDay: 11,
    steps: [
      { id: 'ai-coding-beginners-p1-s1', text: 'Choose a real person or small business and talk to them. Agree what the page is for, collect the real facts (name, what is offered, prices or details, hours, how to reach them) and get their permission to publish their name, contact details and any photo.' },
      { id: 'ai-coding-beginners-p1-s2', text: 'Write your first prompt with the goal, the true facts, the look and a one-file request. Save the reply as index.html, open it in your browser and check every fact with the owner.' },
      { id: 'ai-coding-beginners-p1-s3', text: 'Make at least five changes, one at a time, naming the piece and saying "change nothing else". Commit each good version to a GitHub repository with a clear note.' },
      { id: 'ai-coding-beginners-p1-s4', text: 'Add a way for visitors to reach the owner: an email link or an embedded Google Form. Send a real test and confirm it arrives.' },
      { id: 'ai-coding-beginners-p1-s5', text: 'Make the page easy to read: check text size, contrast and the first screen on a phone.' },
      { id: 'ai-coding-beginners-p1-s6', text: 'Run the pre-publish checklist and the "review before you publish" prompt. Remove anything private or secret from every file and make sure you have permission for every name and photo.' },
      { id: 'ai-coding-beginners-p1-s7', text: 'Publish with GitHub Pages and open the address on a phone. Send it to the owner.', link: 'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site' },
      { id: 'ai-coding-beginners-p1-s8', audience: { max: 'beginner' }, text: 'Keep the scope small: one page, three to five facts, one action. Write down in your prompt log what you asked and what you learned for at least five prompts, and ask the AI to explain any part of the code you do not understand.' },
      { id: 'ai-coding-beginners-p1-s9', audience: { min: 'advanced' }, text: 'Work as for a client: write three acceptance criteria before you start, keep screenshots at two widths as review evidence, add a pre-deploy check (links, contrast, secret scan) and a short handover note that names who owns the content and the repository.' },
    ],
    submission: {
      kind: 'url',
      label: 'Link to your live page',
      placeholder: 'https://your-name.github.io/my-first-site/',
      hint: 'The public address of your published page. In your notes, say who it is for and paste your five best prompts from the log.',
    },
    rubric: [
      'The page is live at a public address and works on a phone as well as on a computer',
      'Names, prices, hours and contact details are real and have been confirmed by the person or business',
      'Visitors have one clear action, and a test message through the form or email link was received',
      'Text is readable: sensible size, strong contrast and a clear first screen',
      'No passwords, keys or private details are in any file or the repository, and permission exists for every name and photo',
      'A prompt log shows what was asked, what was changed and what was learned',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The learner can explain in plain words what the head, the body and one CSS rule of their page do'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The site is split into separate HTML and CSS files, or the learner explains why a single file was kept'] },
      { audience: { min: 'advanced' }, items: ['Acceptance criteria were written before building, with review evidence for each (diffs or screenshots at two widths)', 'An automated or scripted pre-deploy check covers links, contrast and secrets, and a handover note names an owner for content and repository access'] },
    ],
  },
];

export const aiCodingBeginnersCourse: Course = {
  id: 'ai-coding-beginners',
  kind: 'standard',
  title: 'Coding with AI for Complete Beginners',
  level: 'beginner',
  tagline: 'Build and publish a real one-page website by asking AI, with no coding experience.',
  description: 'The first course for anyone who has never written code. You learn to choose a free AI tool, ask for a page in clear words, read what it made, fix it when it breaks, save your work, publish it and keep it safe. You finish with a real site for a real person or business.',
  finishLine: [
    'A one-page website for a real person or business, published on the internet',
    'A prompt log with the requests that worked, and a checklist for what never to paste',
    'The habit of asking, reading, running and checking before you publish',
  ],
  objectives: [
    'Write clear prompts that ask an AI tool for a small website',
    'Read generated HTML and CSS in plain words and change it by asking',
    'Diagnose a broken page with the browser and report it to the AI clearly',
    'Save versions of your work and undo mistakes',
    'Publish a static site for free and check it on a phone',
    'Keep secrets, passwords and private data out of prompts and public files',
  ],
  audiences: ['career-changer', 'builder', 'fresh-grad'],
  skills: [
    { id: 'ai-building-basics', label: 'How building with AI works' },
    { id: 'choose-tools', label: 'Choosing AI tools' },
    { id: 'write-prompts', label: 'Writing prompts' },
    { id: 'read-generated-code', label: 'Reading generated code' },
    { id: 'change-and-fix', label: 'Changing and fixing by asking' },
    { id: 'save-versions', label: 'Saving and undoing' },
    { id: 'forms-and-design', label: 'Forms, colours and layout' },
    { id: 'publish-site', label: 'Publishing a site' },
    { id: 'stay-safe', label: 'Staying safe with AI' },
  ],
  lessons,
  projects,
  icon: 'rocket_launch',
  updated: '2026-11-14',
};
