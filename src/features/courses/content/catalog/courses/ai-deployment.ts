import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * AI-Assisted Deployment. What was run while this course was written (Node.js 22, Git 2.54, actionlint 1.7.12, Python 3):
 * the store build script and its output, the missing-variable check, the leaked-secret Git history, the workflow file (parsed with a
 * YAML library, linted with actionlint, and its steps run locally), the health-check script against a local server in three states,
 * and the git revert demonstration. The output shown for those is the real output (only commit ids and dates differ on your computer).
 * Hosting products (Vercel, Cloudflare Pages, GitHub Pages, Cloud Run, Expo EAS) are named only as examples of a kind, from their official
 * documentation, and are described in words: no prices. Every statement that depends on a product lives in a dated `version` note.
 * Example AI answers are written for this course and are not the output of a real model.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  ghWorkflow: { label: 'GitHub Docs: Workflow syntax for GitHub Actions', url: 'https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax' },
  ghSecrets: { label: 'GitHub Docs: Secrets in GitHub Actions', url: 'https://docs.github.com/en/actions/concepts/security/secrets' },
  ghEnvironments: { label: 'GitHub Docs: Managing environments for deployment', url: 'https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments' },
  ghPushProtection: { label: 'GitHub Docs: About push protection', url: 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection' },
  ghRemoveSensitive: { label: 'GitHub Docs: Removing sensitive data from a repository', url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository' },
  ghPages: { label: 'GitHub Docs: What is GitHub Pages?', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages' },
  setupNode: { label: 'GitHub: actions/setup-node', url: 'https://github.com/actions/setup-node' },
  ccActions: { label: 'Claude Code docs: GitHub Actions', url: 'https://code.claude.com/docs/en/github-actions' },
  vercelEnvironments: { label: 'Vercel docs: Environments', url: 'https://vercel.com/docs/deployments/environments' },
  vercelEnvVars: { label: 'Vercel docs: Environment variables', url: 'https://vercel.com/docs/environment-variables' },
  vercelRollback: { label: 'Vercel docs: Instant Rollback', url: 'https://vercel.com/docs/instant-rollback' },
  vercelDomain: { label: 'Vercel docs: Adding and configuring a custom domain', url: 'https://vercel.com/docs/domains/working-with-domains/add-a-domain' },
  cfPreview: { label: 'Cloudflare Pages docs: Preview deployments', url: 'https://developers.cloudflare.com/pages/configuration/preview-deployments/' },
  cfRollback: { label: 'Cloudflare Pages docs: Rollbacks', url: 'https://developers.cloudflare.com/pages/configuration/rollbacks/' },
  cloudRun: { label: 'Google Cloud docs: What is Cloud Run', url: 'https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run' },
  gcpUptime: { label: 'Google Cloud docs: Uptime checks', url: 'https://docs.cloud.google.com/monitoring/uptime-checks' },
  dockerOverview: { label: 'Docker docs: What is Docker?', url: 'https://docs.docker.com/get-started/docker-overview/' },
  dockerfile: { label: 'Docker docs: Dockerfile reference', url: 'https://docs.docker.com/reference/dockerfile/' },
  expoSubmit: { label: 'Expo docs: Submit to app stores (EAS Submit)', url: 'https://docs.expo.dev/submit/introduction/' },
  expoEnv: { label: 'Expo docs: Environment variables', url: 'https://docs.expo.dev/guides/environment-variables/' },
  expoRollback: { label: 'Expo docs: Rollbacks (EAS Update)', url: 'https://docs.expo.dev/eas-update/rollbacks/' },
  ccMemory: { label: 'Claude Code docs: How Claude remembers your project (CLAUDE.md)', url: 'https://code.claude.com/docs/en/memory' },
  codexAgentsMd: { label: 'Codex docs: AGENTS.md', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md' },
  doraMetrics: { label: 'DORA: Software delivery performance metrics', url: 'https://dora.dev/guides/dora-metrics/' },
  letsEncrypt: { label: 'Let’s Encrypt: How it works', url: 'https://letsencrypt.org/how-it-works/' },
  mdnDomain: { label: 'MDN: What is a domain name?', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name' },
  mdnStatus: { label: 'MDN: HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status' },
  gitRevert: { label: 'Git docs: git-revert', url: 'https://git-scm.com/docs/git-revert' },
  owaspSecrets: { label: 'OWASP Secrets Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'ai-deployment-01',
    day: 1,
    title: 'What deploying means',
    summary: 'Deploying is putting a built copy of your app on a computer that is always on, with an address people can open; five pieces make that happen.',
    minutes: 22,
    skills: ['deploy-concepts'],
    intro: {
      objectives: [
        'Explain in plain words what happens between “it works on my laptop” and “anyone can open it”',
        'Name the five pieces of a deployment: code, build, host, settings and address',
        'Spot the habits in your code that only work on your own computer',
      ],
      why: 'AI can build you an app in an afternoon, but an app nobody else can open is a draft. Knowing what a deployment is made of lets you ask AI for the right help, and tell what went wrong when it does not work.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'When you build an app with AI, it runs on your own computer at an address like `http://localhost:3000`. That word **localhost** means “this very machine”, so the address works only for you. If you text it to a friend, their phone looks for a server on *their* phone and finds nothing. **Deploying** is the work of moving a copy of your app to another computer, one that stays switched on and connected to the internet, and giving it an address everyone can open. Think of cooking at home versus opening a stall in a market. Your recipe tastes the same in both places, but a stall also needs a location, a sign with your name, a supplier who delivers the ingredients, and someone to open it every morning. The recipe is your code; everything else is deployment.',
      },
      { type: 'heading', text: 'The five pieces' },
      {
        type: 'paragraph',
        text: 'Almost every deployment, whatever tool you use, is made of the same five pieces. When something fails, one of them is the cause, so learn their names now.',
      },
      {
        type: 'table',
        headers: ['Piece', 'The question it answers', 'What goes wrong'],
        rows: [
          ['Code', 'What exactly are we putting live?', 'You deploy an old version, or code that was never saved to Git'],
          ['Build', 'How is the code turned into the files a visitor’s browser or the server can run?', 'The build fails, or builds something different from what you tested'],
          ['Host', 'Which always-on computer will serve it?', 'Wrong kind of host for the app, so it cannot run your server code'],
          ['Settings', 'What does the live app need to know that the code must not contain (a database address, a password)?', 'A setting is missing live, or a secret leaks into the code'],
          ['Address', 'What do visitors type, and is it safe (HTTPS)?', 'The name points to nowhere, or the browser warns about security'],
        ],
        caption: 'The five pieces of a deployment. Later lessons take them one at a time.',
      },
      { type: 'heading', text: 'The build step, with a real example' },
      {
        type: 'paragraph',
        text: 'Most projects are not served exactly as you wrote them. A **build** is a command that turns your project into the finished files to serve, usually collected in a folder such as `dist`. Here is a tiny store page for Ate Lorna and the build script an AI assistant could write for it. We ran it with Node.js 22.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'build.mjs: copy the page into dist/, the folder we will serve',
        code: `import { cpSync, mkdirSync, rmSync, readdirSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
cpSync('src', 'dist', { recursive: true });
console.log(\`Built \${readdirSync('dist').length} file(s) into dist/\`);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of: npm run build',
        code: `Built 1 file(s) into dist/`,
      },
      {
        type: 'paragraph',
        text: 'The script deletes any old `dist`, makes a fresh one, copies the page from `src` into it, and reports what it did. Hosting this store means putting what is inside `dist` on a server. Nothing else from your laptop needs to travel, which is exactly what you want: a smaller, cleaner thing to put live.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The journey of a deployment. Your laptop is only the first box.',
        source: `flowchart LR
  L[Your laptop: code that works locally] --> G[Git: saved and pushed]
  G --> B[Build: dist folder is made]
  B --> H[Host: always-on computer serves it]
  H --> U[Address: visitor opens the URL]
  S[Settings: secrets and config] --> H`,
      },
      { type: 'heading', text: '“It works on my machine”' },
      {
        type: 'paragraph',
        text: 'The most common deployment failure has a famous name: *it works on my machine*. Your laptop has things the live computer does not: a certain version of Node, files that are not in Git, settings in a `.env` file, a database you started by hand. And the code itself may assume it: an address typed as `http://localhost:3000/api/prices` will break the moment the app lives anywhere else. When you ask AI to prepare a deployment, make it list these differences. It reads your code well but cannot see your laptop, so you have to tell it what is only there.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *server* is just a computer that waits for requests and answers them, like a waiter in a restaurant. Your laptop can act as one, but only while it is on and only for you. A *host* is a company that rents you a computer that is always on. A *URL* is the full web address, like `https://lornastore.example`. In the build script above: `rmSync` removes the old folder, `mkdirSync` makes a new one, `cpSync` copies files, and the last line prints a message. If any word here is new, paste the code into an AI assistant and ask: “Explain this line by line as if I have never coded.”',
      },
      {
        type: 'prompt',
        label: 'Ask AI to list what only works on your machine',
        text: 'I want to put this project live for other people. Read the code and the config files and list everything that only works on my own computer: addresses with localhost, files that are not in Git, settings I load from a .env file, and tools or versions I have installed by hand. For each one, tell me what to do instead. Do not change any files yet.',
      },
      {
        type: 'warning',
        text: 'AI assistants know many hosting tools, but they do not know which accounts you own or what you are allowed to spend. Never let an assistant create paid services or add a payment method for you. You pick where it goes; the assistant helps you get it there.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat a deployment as promoting an immutable build artifact, not as “pulling main onto a server”. Build once from a known commit, record which commit produced it, and promote the same artifact through environments so what you tested is byte for byte what ships. This separates three things people blur: *build* (make the artifact), *deploy* (put it somewhere) and *release* (expose it to users, which can be a flag or a traffic shift rather than a deploy). It is also why configuration belongs in the environment, outside the artifact: the same build must run in preview and production with different settings. Platforms differ here, so check whether yours rebuilds on promotion or reuses the build.',
      },
      {
        type: 'version',
        text: 'Checked against Vercel’s documentation: by default a push to a non-production branch or a pull request creates a preview deployment, a push to the production branch creates a production deployment, and promoting a staged deployment assigns production domains without rebuilding it (promoting a preview from the dashboard does rebuild it with production variables). GitHub’s documentation describes GitHub Pages as static site hosting that publishes HTML, CSS and JavaScript from a repository, with an optional build step. Platform behaviour and defaults change, so check the page for the product you choose.',
        checked: CHECKED,
        sources: [DOCS.vercelEnvironments, DOCS.ghPages],
      },
      {
        type: 'takeaways',
        items: [
          'Deploying means putting a built copy of your app on an always-on computer, with an address visitors can open.',
          'Five pieces make a deployment: code, build, host, settings and address. A failure is almost always in one of them.',
          'A build turns your project into the finished files to serve (often a dist folder); only those need to go live.',
          '“Works on my machine” means something exists only on your laptop: a localhost address, an untracked file, a setting or a tool version.',
          'You decide where the app goes and what it costs; AI helps you get it there and check it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-01-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Words you will keep hearing',
          prompt: 'Tap each card to check that you can say it in your own words first.',
          concept: 'deployment vocabulary',
          cards: [
            { front: 'Deploy', back: 'Move a copy of your app to an always-on computer and give it an address, so other people can open it.' },
            { front: 'Build', back: 'A command that turns your project into the finished files to serve, usually in a folder such as dist.' },
            { front: 'Host', back: 'The always-on computer, or the company that provides it, that serves your app to visitors.' },
            { front: 'Production', back: 'The live version real visitors use. Anything you test first happens somewhere else, so a mistake does not reach them.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'These four words come back in every lesson. Production in particular is a place, not a task: the live copy that real people depend on.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-01-fix-bug-1',
          kind: 'fix-bug',
          title: 'A page that only works on your laptop',
          prompt: 'This page, written by an AI assistant, loads prices from the app’s own server. It works on the laptop and shows nothing once it is live. Tap the line that breaks, then pick the fix.',
          concept: 'works on my machine',
          language: 'javascript',
          code: `async function showPrices() {
  const response = await fetch('http://localhost:3000/api/prices');
  const prices = await response.json();
  document.querySelector('#list').textContent = prices.map((p) => p.name).join(', ');
}

showPrices();`,
          bugLine: 2,
          fixes: [
            { line: "  const response = await fetch('/api/prices');", correct: true, why: 'A path with no address in front means “the same place this page came from”, so it works on your laptop and wherever the app is hosted.' },
            { line: "  const response = await fetch('http://127.0.0.1:3000/api/prices');", correct: false, why: '127.0.0.1 is just another name for this very computer, like localhost. On a visitor’s phone it points at the phone, so it fails the same way.' },
            { line: "  const response = await fetch('http://localhost:80/api/prices');", correct: false, why: 'Changing the port number does not help: localhost is still the visitor’s own device, where no store server is running.' },
            { line: "  const response = await fetch('https://localhost:3000/api/prices');", correct: false, why: 'Adding the “s” makes the address look safer, but localhost still means the visitor’s own device.' },
          ],
          hints: [
            'Which word in the address means “this very computer”?',
            'On a visitor’s phone, “this computer” is their phone, not your laptop.',
            'Use an address that does not name a computer at all: only the path, starting with a slash.',
          ],
          explanation: 'localhost and 127.0.0.1 always mean the device running the code. Once the page is served to visitors, their devices run it. A relative path such as /api/prices says “ask the place that served this page”, which is correct in both worlds.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-01-arrange-1',
          kind: 'arrange',
          title: 'From laptop to live, in order',
          prompt: 'Put these steps of putting Ate Lorna’s store live in a sensible order, first at the top.',
          concept: 'the deployment journey',
          language: 'text',
          solution: [
            'Check the store page works on the laptop',
            'Save the code to Git so it has a known version',
            'Run the build to make the dist folder',
            'Upload dist to the host, with the settings it needs',
            'Open the live address on your phone and check it',
          ],
          reasons: [
            'Never put something live that you have not seen working first.',
            'A saved version is what you can find again or undo to later.',
            'The build turns the saved code into the files that will be served.',
            'The host needs the finished files and any settings, before anyone can visit.',
            'Checking from a phone proves it works for someone who is not on your computer.',
          ],
          hints: [
            'What must be true before you let anyone else see it?',
            'You build from saved code, and you serve what you built.',
            'The last step is looking at it the way a visitor would.',
          ],
          explanation: 'Test, save, build, upload, check. Each step uses the result of the one before it, and the final check is from a visitor’s point of view, not yours.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-deployment-01-q1',
        prompt: 'You send a friend the address http://localhost:3000. Why does it not open for her?',
        choices: [
          'Port 3000 is reserved and only works for the person who built the app',
          'The address needs the letters “www” at the front before another person’s browser can find it, and it also has to end in .com for the address to work',
          'localhost means “this very computer”, so her browser looks on her own device, where nothing is running',
          'Browsers refuse to open any address that has a port number in it, which stops anyone but the developer from opening it',
        ],
        answer: 2,
        explanation: 'localhost always points at the computer making the request. Her computer has no store app running, so there is nothing to answer.',
      },
      {
        id: 'ai-deployment-01-q2',
        prompt: 'What is the job of the build step?',
        choices: [
          'To turn your project into the finished files that will be served, such as a dist folder',
          'To rent a computer from a hosting company',
          'To type your domain name into a registrar’s website',
          'To copy every file on your laptop, including your settings and notes, to the host so nothing is left out',
        ],
        answer: 0,
        explanation: 'A build produces what gets served. The other choices are other pieces of a deployment (host, address) or the opposite of what a build is for.',
      },
      {
        id: 'ai-deployment-01-q3',
        prompt: 'Your app works on your laptop but the live page is blank. Which is the best first move?',
        choices: [
          'Ask the AI to rewrite the whole project so it is cleaner',
          'Redeploy it several times in a row in case the problem was a temporary one that will go away by itself',
          'Buy a different kind of hosting plan, since a blank page means the current one is too small',
          'List what is different between the two places: addresses, settings, tool versions and files not in Git',
        ],
        answer: 3,
        explanation: 'Works-here-but-not-there is always a difference between the two places. Finding it is quicker and safer than rewriting or guessing.',
      },
      {
        id: 'ai-deployment-01-q4',
        prompt: 'What does “production” mean?',
        choices: [
          'The folder on your laptop where the finished files are kept',
          'The live version that real visitors use, as opposed to the copies where you test',
          'The person on a team who is responsible for starting the build and approving each release',
          'The first version of the code, before any changes were made',
        ],
        answer: 1,
        explanation: 'Production is the live place. Keeping it separate from where you test is what lets you try things without hurting real visitors.',
      },
      {
        id: 'ai-deployment-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a host?',
        choices: [
          'A secret password that lets you into your own app',
          'An always-on computer, or the company that rents one, that serves your app to visitors',
          'A tool that corrects mistakes in your code',
        ],
        answer: 1,
        explanation: 'Your laptop is switched off at night and is behind your home network. A host is a computer that is on all the time and reachable by everyone.',
      },
      {
        id: 'ai-deployment-01-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team rebuilds from the main branch separately for staging and for production. Why is “build once, promote the same artifact” safer?',
        choices: [
          'Builds are free, so there is no cost reason to avoid building twice, and teams that rebuild never see any difference between the two',
          'What you tested in staging is exactly what ships; two builds can differ through changed dependencies or settings baked in',
          'It removes the need for environment variables, because the artifact already holds the settings',
          'It makes the host choose the cheapest region automatically',
        ],
        answer: 1,
        explanation: 'A second build is a different artifact even from the same commit if dependencies, tools or baked-in values changed. Promoting the tested artifact removes that gap, and settings still stay outside it.',
      },
    ],
    task: {
      title: 'Map your own project',
      minutes: 15,
      steps: [
        'Make a folder with a src/index.html page for any small shop or hobby, and save the build.mjs script from this lesson. Run it with `node build.mjs` and confirm you see “Built 1 file(s) into dist/”.',
        'Open dist/index.html in your browser. This is what a host would serve.',
        'Write the five pieces (code, build, host, settings, address) for this project, one line each, saying what you have today and what you still need to decide.',
        'Run the prompt from the lesson on a project of yours (or this one) and note one thing it finds that only works on your machine.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant: “Explain what a host is and what a build is using a market stall as the comparison.” Write the answer in your own words under the five pieces.'] },
      { audience: { min: 'advanced' }, steps: ['For a project you maintain, write down how the artifact is produced, what identifies the commit it came from, and which settings differ between preview and production. Mark every place where the answer is “it depends on who deploys”.'] },
    ],
  },
  {
    id: 'ai-deployment-02',
    day: 2,
    title: 'Choosing where to host',
    summary: 'Pick the kind of host that fits what your app is (files, a server, a container or a phone app), then pick a product, and make AI argue its case.',
    minutes: 24,
    skills: ['choose-hosting'],
    intro: {
      objectives: [
        'Tell the five kinds of hosting apart: static host, app platform, serverless functions, container and app store',
        'Decide which kind your app needs by asking three questions about it',
        'Ask AI for a hosting recommendation that comes with its trade-offs, and push back on an over-built one',
      ],
      why: 'AI will happily suggest a hosting setup built for a company of a thousand engineers, or one that cannot run your app at all. Knowing the kinds lets you choose the simplest thing that works and spot a bad suggestion.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The first mistake in choosing a host is asking “which brand is best?”. Brands change every year, and a famous one can still be the wrong fit. Ask instead: **what kind of thing is my app?** Three questions settle most of it. First, is your app only *files* (pages, images, scripts that run in the visitor’s browser), or does it also run *code on a server*, for example to check a password or save an order? Second, does that server code need to keep running all the time, or can it start only when someone asks? Third, is it a website at all, or a phone app that people download from a store? Your answers point to one of five kinds.',
      },
      {
        type: 'table',
        headers: ['Kind', 'What it is', 'Fits when', 'Examples (from official docs)'],
        rows: [
          ['Static host', 'Serves ready-made files and nothing else; no server code of yours runs', 'A portfolio, a menu page, a landing page, a site that is built to files', 'GitHub Pages'],
          ['App platform', 'You connect a Git repository; the platform builds it, runs it and gives each version an address', 'A web app with a front end and a little server code, and you want the least setup', 'Vercel'],
          ['Serverless functions', 'Small pieces of server code that start only when a request arrives and stop after', 'A form handler or a small API with uneven traffic', 'Functions on an app platform; Cloud Run can scale to zero'],
          ['Container', 'Your app packed with everything it needs into one portable image that runs the same anywhere', 'You need a special tool installed, a long-running process, or to move between providers', 'Docker images run on Google Cloud Run'],
          ['App store', 'Apple and Google review and distribute your phone app; there is no web address to serve', 'A mobile app built with Expo or similar', 'Expo’s EAS Submit uploads builds to the stores'],
        ],
        caption: 'The five kinds of hosting. Real products often mix more than one kind.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'A first-pass decision. It picks a kind; the product comes after.',
        source: `flowchart TD
  A{Phone app people download?} -->|yes| S(App store)
  A -->|no| B{Does it run your own code on a server?}
  B -->|no: only files| T(Static host)
  B -->|yes| C{Special tools or a process that must always run?}
  C -->|yes| K(Container)
  C -->|no| D(App platform with serverless functions)`,
      },
      { type: 'heading', text: 'What each choice costs you in effort' },
      {
        type: 'paragraph',
        text: 'The kinds also differ in how much you must look after. A static host leaves you almost nothing to manage and almost nothing that can break, which is why it is the right first answer for any site that is only files. An app platform adds a build and server code but keeps the setup short, which suits most AI-built web apps. A container gives you the most control and the most to maintain: you decide the operating system pieces, the start command and what happens when it crashes. Mobile stores add review: Expo’s documentation says an Android upload can go straight to a track you choose, while an iPhone build goes to TestFlight first and reaches the App Store only after you complete the listing and submit it for review. So a store release is never instant.',
      },
      {
        type: 'paragraph',
        text: 'Two things catch beginners. **Your data lives somewhere else.** A host that serves your app does not automatically hold your customers’ orders; a database is its own service with its own choice, and a host that wipes its disk on restart will wipe anything you saved there. **Free is not forever.** Plans, limits and prices differ and change, so look at the product’s own page before you build on a plan, and do not trust an AI’s memory of them: its knowledge has a date.',
      },
      {
        type: 'prompt',
        label: 'Ask for a recommendation with trade-offs, not a verdict',
        text: 'Here is my app: [describe it in three sentences: what it does, whether it needs a server and a database, who uses it]. I am new to deployment and I want the simplest hosting that works. Recommend two options of different kinds. For each, tell me: what I would have to set up and look after, what would stop working if my traffic grew ten times, where my data would live, and how I would undo a bad deployment. Tell me which facts you are unsure about so I can check them in the official documentation.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Picture four ways to sell cooked food. A *static host* is a table with a printed menu: nothing is cooked on the spot, so there is little to go wrong. An *app platform* is renting a ready-made food stall where the owner handles water and electricity. *Serverless* is a cook who comes only when an order arrives and goes home after. A *container* is your own food truck with its own kitchen: you can cook anything, but you maintain the truck. An *app store* is a big mall that has to approve your shop before it opens. For your first project, pick the table or the rented stall.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** The decision is about operational constraints more than features. Serverless and scale-to-zero platforms trade a slower first request after idle (Cloud Run’s documentation describes a new instance starting on the next request) for paying nothing while idle, and they assume stateless code: local disk is not storage, and database connections need pooling. Containers (an image is a read-only template, a container a runnable instance whose changes are lost when it is removed unless stored elsewhere) buy portability and exact control at the cost of owning patching, health checks and restarts. Also weigh lock-in (proprietary function APIs versus a plain HTTP server), regions and data residency, observability you can export, and how a rollback works on each, which lesson 8 covers.',
      },
      {
        type: 'version',
        text: 'Checked on this date: GitHub documents Pages as static hosting for HTML, CSS and JavaScript. Docker documents an image as a read-only template and a container as a runnable instance created from it. Google documents Cloud Run as a managed platform for running code or containers that can scale to zero and keep revisions you can roll back to. Expo documents that EAS Submit uploads a signed build to Google Play (an Android upload goes to the track you choose) or to App Store Connect (an iPhone build appears in TestFlight and is released only after you submit it for review). These products change their plans and features often, so check each page before you decide.',
        checked: CHECKED,
        sources: [DOCS.ghPages, DOCS.dockerOverview, DOCS.cloudRun, DOCS.expoSubmit],
      },
      {
        type: 'takeaways',
        items: [
          'Ask what kind your app is before you ask which brand: files only, server code, a packaged container, or a phone app.',
          'Five kinds cover most cases: static host, app platform, serverless functions, container and app store.',
          'The simplest kind that works is the best first choice; more control means more to look after.',
          'Your data is a separate decision from where the app runs, and store releases are never instant.',
          'Ask AI for options with trade-offs and the facts it is unsure of, then check plans and limits yourself in the official docs.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-02-match-1',
          kind: 'match',
          title: 'Where should each of these live?',
          prompt: 'Match each situation to the kind of hosting that fits it best.',
          concept: 'choose a hosting kind',
          labels: { terms: 'Situation', meanings: 'Best-fitting kind' },
          pairs: [
            { term: 'A three-page site for a barber shop, built to plain HTML files, no logins', definition: 'Static host', note: 'Nothing here needs code running on a server, so the simplest kind is enough.' },
            { term: 'A booking web app with sign-in and its own server code, and you want every pull request to get a test link', definition: 'App platform', note: 'Server code plus per-change test links is what a Git-connected app platform is for.' },
            { term: 'Your API needs a command-line tool installed that platforms do not provide, and you already wrote a Dockerfile', definition: 'Container', note: 'A container carries its own installed tools, so the host does not need to provide them.' },
            { term: 'A tiny form handler that is used a few times a day, with long quiet periods', definition: 'Serverless functions', note: 'Code that starts only when a request arrives suits uneven, light traffic.' },
            { term: 'An Expo-built app that customers install on their phones', definition: 'App store', note: 'Phone apps are distributed through Apple and Google, not through a web address.' },
          ],
          hints: [
            'For each situation, ask: is it files only, server code, a packaged app, or a phone app?',
            'Start with the two extremes: the plain files and the phone app. The middle three are the harder ones.',
            'A needed system tool plus a Dockerfile means container; light, uneven traffic means serverless.',
          ],
          explanation: 'Each situation names the deciding fact: no server code (static), server code with test links (app platform), a custom tool in a Dockerfile (container), light uneven traffic (serverless), or distribution through stores (app store).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-02-scenario-1',
          kind: 'scenario',
          title: 'The over-built answer',
          prompt: 'Choose how you respond.',
          concept: 'push back on over-built advice',
          situation: 'You ask an AI assistant where to host your portfolio, which is five HTML pages and some images. It answers with a plan: a Kubernetes cluster, a load balancer, a managed database and a separate build server, “so it can scale”.',
          options: [
            { text: 'Reply: “This is only static files with no server code. Which simpler kind would work, and what exactly would break without each part you listed?”', consequence: 'You get the assistant to justify every piece. Most will fall away, and you end up with a static host and a much shorter plan.', quality: 'best' },
            { text: 'Follow the plan, because the assistant knows more about hosting than you do.', consequence: 'You spend days setting up and then paying for and maintaining parts your five pages never needed, and each one is something that can break.', quality: 'poor' },
            { text: 'Ask the assistant to make the plan cheaper but keep the same parts.', consequence: 'You still have a cluster and a database that a portfolio does not need. The problem was the kind of host, not its size.', quality: 'poor' },
            { text: 'Ask a second AI assistant for its plan and use whichever is longer.', consequence: 'A longer plan is not a better plan. Comparing is useful, but only if you judge the answers against what your app really is.', quality: 'acceptable' },
          ],
          hints: [
            'What does a portfolio of plain HTML pages actually need?',
            'You are allowed to ask the assistant what would break without each part.',
            'Make it justify each part against the kind of thing your app is.',
          ],
          explanation: 'Files only means a static host. Asking what breaks without each part is how you cut an over-built answer down; you set the goal, the assistant helps reach it.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-deployment-02-q1',
        prompt: 'Which question comes first when choosing hosting?',
        choices: [
          'Which hosting brand has the most users among all of the hosts in the world?',
          'What kind of thing is my app: only files, server code, a packaged container, or a phone app?',
          'How many pages will the site have in a year?',
          'Which hosting company does my AI assistant mention most often when I ask about publishing websites online?',
        ],
        answer: 1,
        explanation: 'The kind of app decides what a host must be able to do. Brands and popularity come after, among hosts of the right kind.',
      },
      {
        id: 'ai-deployment-02-q2',
        prompt: 'Your app is a restaurant menu site built into plain HTML files, with no sign-in or database. Which is the most sensible host?',
        choices: [
          'A container service, so you control the operating system',
          'A server you set up yourself, so you can install anything later if needed',
          'An app store listing, because every app should be in one',
          'A static host, because there is no server code to run',
        ],
        answer: 3,
        explanation: 'Files only means no server code, so a static host does everything needed with the least to look after.',
      },
      {
        id: 'ai-deployment-02-q3',
        prompt: 'A serverless function has not been called for an hour. Per Cloud Run’s documentation of scaling to zero, what can happen to the next request?',
        choices: [
          'It can be slower, because a new instance has to start first',
          'It is refused until you restart the function by hand',
          'It is answered by the last deployed copy on your laptop',
          'It is charged double because the idle period counts as one big request',
        ],
        answer: 0,
        explanation: 'Scale to zero removes the last instance when idle, and the next request starts a new one, so that first response can be slower.',
      },
      {
        id: 'ai-deployment-02-q4',
        prompt: 'You switch to a host that clears its disk whenever the app restarts. What is the lesson?',
        choices: [
          'Files you save on that server’s disk, such as uploaded photos, are lost, so data needs a separate storage or database service',
          'Restarts never happen on hosted apps, so nothing is at risk',
          'Only code is affected by a restart; saved orders stay safe on the host',
          'Hosting companies back up your server disk for you automatically and restore it after each restart, so nothing you saved is ever removed',
        ],
        answer: 0,
        explanation: 'Where the app runs and where its data lives are separate decisions. Anything saved only on a disposable disk disappears when the instance is replaced.',
      },
      {
        id: 'ai-deployment-02-q5',
        audience: { max: 'beginner' },
        prompt: 'Which comparison best describes a static host?',
        choices: [
          'A food truck with its own kitchen that you must maintain',
          'A cook who arrives only when an order comes in',
          'A table with a printed menu: nothing is cooked on the spot, so little can go wrong',
        ],
        answer: 2,
        explanation: 'A static host only hands out ready-made files. With no code of yours running there, there is very little to break.',
      },
      {
        id: 'ai-deployment-02-q6',
        audience: { min: 'advanced' },
        prompt: 'Your API keeps a per-user counter in a variable and works in testing, but gives wrong counts on a scale-to-zero platform. What is the most likely cause and fix?',
        choices: [
          'The platform has a bug; ask the vendor to fix it',
          'Instances start, stop and run in parallel, so memory is not shared or durable; keep the counter in a database or cache',
          'The counter variable needs to be declared as global so that every instance running on every machine can read and update it directly',
          'Move the counter into a file on the instance’s local disk so it survives longer',
        ],
        answer: 1,
        explanation: 'Stateless platforms may run many instances at once and remove them when idle, so in-memory state diverges or vanishes. Shared state belongs in a database or cache; a local file has the same problem.',
      },
    ],
    task: {
      title: 'Choose a host for a real app',
      minutes: 18,
      steps: [
        'Describe a project of yours (or one you want to build) in three sentences, then answer the three questions from the lesson: files or server code, always running or on request, website or phone app.',
        'Run the recommendation prompt from the lesson with your description. Read what it recommends.',
        'Open the official documentation of the top two products it named and check one claim the assistant made about each (a limit, a feature, how deploys work). Write down whether it was right.',
        'Write a decision note of five lines: the kind you chose, the product, why, what you will have to look after, and what would make you change your mind.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If the assistant used a word you do not know, ask it: “Explain [word] using a food stall as an example.” Add the answer to your note.'] },
      { audience: { min: 'advanced' }, steps: ['Add a row to your note for each of: statelessness, secrets handling, rollback mechanism, log access and export, and region. Mark each as confirmed in the docs, or assumed.'] },
    ],
  },
  {
    id: 'ai-deployment-03',
    day: 3,
    title: 'Environment variables and secrets in production',
    summary: 'Keep passwords and keys out of your code, give the live app its settings safely, and know exactly what to do when a secret leaks.',
    minutes: 28,
    skills: ['manage-secrets'],
    intro: {
      objectives: [
        'Explain what an environment variable is and why settings live outside the code',
        'Tell which values are safe to ship to a browser and which are secrets',
        'Respond to a leaked secret in the right order: revoke and replace first, clean up second',
      ],
      why: 'AI assistants often put a key straight into the code to “make it work”. One committed key can cost you money or your customers’ data within hours, so this habit matters more than almost anything else in deployment.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Your app needs to know things that are not code: the address of its database, a key that lets it send email, a password for a payment service. These are **settings**, and some of them are **secrets**: values that would let a stranger spend your money or read your customers’ data. The rule is simple: **settings live outside the code.** Code is copied everywhere (Git, your teammates, the host, an AI assistant’s chat), so a secret inside it is copied everywhere too. The standard solution is an **environment variable**: a named value that the computer running your app provides to it, such as `API_URL` or `PAYMENT_KEY`. The code only says *“read the variable called PAYMENT_KEY”*, and each place (your laptop, a preview, production) supplies its own value.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'config.js: read a setting, and stop with a clear message if it is missing',
        code: `const apiUrl = process.env.API_URL;

if (!apiUrl) {
  console.error('Missing environment variable: API_URL');
  process.exit(1);
}

console.log('Using ' + apiUrl);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: first without the variable, then with it (the exit code is the number the program leaves behind; 0 means success)',
        code: `$ node config.js
Missing environment variable: API_URL
exit code: 1
$ API_URL=https://api.example.com node config.js
Using https://api.example.com
exit code: 0`,
      },
      {
        type: 'paragraph',
        text: '`process.env.API_URL` is how Node.js reads an environment variable. The `if` checks that it exists, and the program stops immediately with a clear message when it does not. That one habit, **failing fast with the variable’s name**, turns the most common production error (“a setting is missing there”) from an hour of guessing into a ten-second fix. Ask your AI assistant to add such a check for every setting it introduces.',
      },
      { type: 'heading', text: 'Where the values live' },
      {
        type: 'paragraph',
        text: 'On your laptop, settings usually sit in a file named `.env`. That file must **never be committed to Git**: add `.env` to a file called `.gitignore`, which tells Git to skip it, and commit a `.env.example` that lists only the *names* with fake values so others know what to set. In production you do not upload the `.env` file. You type the values into the host’s own settings page, which keeps them encrypted and out of your code. Hosts such as Vercel let you set different values for each environment (production, preview), and its documentation notes that changing a variable affects only *new* deployments, so you must deploy again before the live app sees it. GitHub Actions has the same idea, called *secrets*, which you read in a workflow as `${{ secrets.NAME }}`.',
      },
      {
        type: 'warning',
        text: 'Anything that is sent to the browser or the phone is public. Frameworks mark such variables with a prefix (NEXT_PUBLIC_ in Next.js, EXPO_PUBLIC_ in Expo). Expo’s documentation says plainly that those values are visible in plain text in the compiled app and must never hold sensitive secrets. A real secret belongs on a server you control, and the browser asks that server to use it for them.',
      },
      { type: 'heading', text: 'When a secret leaks' },
      {
        type: 'paragraph',
        text: 'Sooner or later a key ends up in Git. Many people then delete the file and think it is gone. It is not: Git remembers every version. We committed a `.env` containing a fake key, then removed it from tracking, and searched the history:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the key is gone from the files, but not from the history (git log -p -S"sk_live" --oneline)',
        code: `cbcd0fe Stop tracking .env
diff --git a/.env b/.env
deleted file mode 100644
-PAYMENT_KEY=sk_live_EXAMPLE123
6513fb6 First version
diff --git a/.env b/.env
new file mode 100644
+PAYMENT_KEY=sk_live_EXAMPLE123`,
      },
      {
        type: 'paragraph',
        text: 'So the order of response matters. GitHub’s guidance is that the first step is to **revoke or rotate** the secret: replace it with a new one and cancel the old one at the service that issued it, so the leaked value stops working. Scrubbing history comes later and is optional, because it changes every commit’s identity and can disrupt everyone who shares the repository; once the key is dead, the leaked copy is harmless.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Revoke and replace** the key at the service that issued it. Do this first, within minutes.',
          '**Check the service’s usage logs** for anything you did not do while the key was exposed.',
          '**Put the new key** in the host’s settings (not in the code) and deploy so the live app uses it.',
          '**Fix the cause:** add the file to `.gitignore`, add the missing-variable check, and turn on any secret scanning your repository offers.',
          '**Only then, if you want**, rewrite history to remove the old value.',
        ],
      },
      {
        type: 'prompt',
        label: 'Make AI work with secrets safely',
        text: 'Search this project for any password, API key, token or secret written directly in the code or in files that are committed. Do not print any value you find: list only the file and the name. Then move each one to an environment variable, add a check that stops the app with the variable’s name if it is missing, create a .env.example with the names only, make sure .env is in .gitignore, and tell me which of these values would be sent to the browser.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of the key to your shop. You would not tape it to the shop’s window, and you would not copy it into the photo you send to a friend. An environment variable is the key kept in your pocket: the shop (the code) says “use the key”, and whoever opens it brings their own. If you ever lose the key, the first thing you do is change the lock, and only afterwards do you worry about who saw it. That is what *revoke and replace* means. In the code above, `process.env.API_URL` is “look in my pocket for API_URL”, and `process.exit(1)` means “stop, something is wrong”.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Environment variables are the lowest common denominator, not the strongest option: they are inherited by child processes, appear in crash dumps and process listings, and are easy to log by accident. OWASP’s secrets guidance asks for least privilege (each service sees only the secrets it needs), separate secrets per environment, rotation so that stolen values expire, and never logging secrets. Prefer short-lived credentials where you can: for CI, an identity federation (OIDC) exchange beats a stored long-lived key, and Claude Code’s GitHub Action documents that route. Add detection (secret scanning and push protection catch known formats before they land), and assume that GitHub’s log redaction is a safety net, since its documentation says redaction is not guaranteed and applies only to secrets used in the current job.',
      },
      {
        type: 'version',
        text: 'Checked on this date. GitHub’s documentation says to revoke or rotate a leaked secret as the first step and that rewriting history may not be warranted. Push protection blocks pushes that contain recognised secrets; the repository-level setting is off by default and a repository admin turns it on, while a user-level protection against pushing secrets to public repositories is on by default on GitHub.com. GitHub Actions can read a secret only if the workflow explicitly includes it, redacts secrets in logs but does not guarantee it, and environment secrets stay unavailable to a job until required reviewers approve it. Vercel documents that variable changes apply only to new deployments. Expo documents that EXPO_PUBLIC_ variables are visible in plain text in the compiled app.',
        checked: CHECKED,
        sources: [DOCS.ghRemoveSensitive, DOCS.ghPushProtection, DOCS.ghSecrets, DOCS.vercelEnvVars, DOCS.expoEnv, DOCS.owaspSecrets],
      },
      {
        type: 'takeaways',
        items: [
          'Settings and secrets live outside the code, in environment variables that each place supplies for itself.',
          'Never commit .env: ignore it, and commit a .env.example with names only.',
          'Anything sent to a browser or phone is public; real secrets stay on a server you control.',
          'Make the app fail fast with the name of any missing variable, and redeploy after changing one.',
          'If a secret leaks: revoke and replace first, check usage, store the new one safely, fix the cause, and only then think about history.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-03-fix-bug-1',
          kind: 'fix-bug',
          title: 'The key in the code',
          prompt: 'An AI assistant wrote this to “make the payment work”. Tap the line that should never be committed, then pick the safe version.',
          concept: 'secrets belong in the environment',
          language: 'javascript',
          code: `import { createClient } from './payments.js';

export function makePayments() {
  const paymentKey = 'sk_live_EXAMPLE123';
  return createClient({ key: paymentKey });
}`,
          bugLine: 4,
          fixes: [
            { line: '  const paymentKey = process.env.PAYMENT_KEY;', correct: true, why: 'The code now asks the environment for the key. Each place (laptop, preview, production) supplies its own, and nothing secret is in Git.' },
            { line: "  const paymentKey = 'sk_live_' + 'EXAMPLE123';", correct: false, why: 'Splitting the string hides the key from a casual glance, but it is still in the code and in Git history, and anyone can join the two parts.' },
            { line: "  const paymentKey = atob('c2tfbGl2ZV9FWEFNUExFMTIz');", correct: false, why: 'Encoding the key is not protection: anyone can decode it in a second, and it is still committed.' },
            { line: "  const paymentKey = 'sk_live_EXAMPLE123'; // TODO: remove before launch", correct: false, why: 'A comment does not remove a key. “Before launch” usually becomes “after the leak”, and Git keeps the value forever.' },
          ],
          hints: [
            'Which line contains something that would let a stranger charge your account?',
            'Whatever the fix is, the value must not appear in any file that goes to Git.',
            'Read the value from the environment, as the lesson’s config.js did.',
          ],
          explanation: 'Only reading the value from the environment keeps it out of the code. Splitting, encoding or commenting on a secret leaves it in the file and in Git history.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-03-predict-output-1',
          kind: 'predict-output',
          title: 'Run the check twice',
          prompt: 'Here is the config.js from this lesson. You run `node config.js` with no variable set, and then run `API_URL=https://api.example.com node config.js`. What do the two runs print, in order?',
          concept: 'fail fast on a missing setting',
          language: 'node',
          code: `const apiUrl = process.env.API_URL;

if (!apiUrl) {
  console.error('Missing environment variable: API_URL');
  process.exit(1);
}

console.log('Using ' + apiUrl);`,
          expected: 'Missing environment variable: API_URL\nUsing https://api.example.com',
          choices: [
            'Using undefined\nUsing https://api.example.com',
            'Missing environment variable: API_URL\nUsing https://api.example.com',
            'Missing environment variable: API_URL\nMissing environment variable: API_URL',
            'Using https://api.example.com\nUsing https://api.example.com',
          ],
          wrongNotes: {
            'Using undefined\nUsing https://api.example.com': 'That would print if the code had no check. Because of the if, a missing variable stops the program before it reaches the last line.',
            'Missing environment variable: API_URL\nMissing environment variable: API_URL': 'The second run sets API_URL in front of the command, so the variable exists for that run and the check passes.',
            'Using https://api.example.com\nUsing https://api.example.com': 'The first run has no API_URL, so the check fails and the program stops with a message.',
          },
          hints: [
            'In the first run, is API_URL set?',
            'When the if condition is true, the program prints a message and exits before the last line.',
            'The second run puts the variable in front of the command, so it exists only for that run.',
          ],
          explanation: 'The first run has no variable, so the check prints the message and exits with code 1. The second run supplies it, so the program reaches the last line. We ran both for real and this is what they print.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-03-arrange-1',
          kind: 'arrange',
          title: 'A key was pushed to GitHub',
          prompt: 'You just noticed that a live payment key is in a public repository. Put the response in the right order.',
          concept: 'leaked secret response',
          language: 'text',
          solution: [
            'Revoke the key at the payment service and create a new one',
            'Look at the payment service’s activity for charges you did not make',
            'Store the new key in the host’s settings and deploy again',
            'Add the file to .gitignore and add a missing-variable check',
            'Optionally rewrite the Git history to remove the old key',
          ],
          reasons: [
            'Until the old key is dead, anyone who copied it can use it, so this comes before everything.',
            'You need to know whether the leak was already used, while the evidence is fresh.',
            'The live app now needs the new key, and it must come from settings, not code.',
            'This prevents the same mistake next time.',
            'With the key dead, the old copy is harmless, so cleaning history is a tidy-up and is last.',
          ],
          hints: [
            'What stops a stranger from using the key right now?',
            'Rewriting history is slow and disruptive; is it urgent once the key no longer works?',
            'Order: kill the key, check for damage, install the new key, prevent a repeat, tidy up.',
          ],
          explanation: 'Revoke first, then look for damage, then install the replacement, then prevent a repeat. Rewriting history is last and optional, as GitHub’s own guidance says, because a revoked key can no longer be used.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-deployment-03-q1',
        prompt: 'Why is a secret stored in an environment variable safer than one written in the code?',
        choices: [
          'The code does not contain it, so copying the code to Git, teammates or an AI chat does not copy the secret',
          'Environment variables are automatically encrypted by every programming language, so that nobody who can see the code is able to read them',
          'Environment variables cannot be read by the program that uses them',
          'It makes the app start faster in production because there is less code for the host to read',
        ],
        answer: 0,
        explanation: 'Code travels everywhere. A variable keeps the value in the place that runs the app, and each place supplies its own.',
      },
      {
        id: 'ai-deployment-03-q2',
        prompt: 'You find a variable named EXPO_PUBLIC_PAYMENT_KEY in your Expo app. What is the problem?',
        choices: [
          'Nothing: the prefix makes Expo encrypt the value in the compiled app',
          'The name is too long, and the build will fail',
          'Variables with that prefix are placed in the app in plain text, so anyone can read the key; it must stay on a server',
          'The prefix means only the developer can see the value in the code, but the compiled app itself cannot read it, so the key stays hidden',
        ],
        answer: 2,
        explanation: 'EXPO_PUBLIC_ values are inlined into the app and readable by anyone. A payment key must live on a server that you control.',
      },
      {
        id: 'ai-deployment-03-q3',
        prompt: 'You added a new value in the host’s settings page, but the live app still behaves as before. What is the most likely explanation?',
        choices: [
          'The host needs a day to copy the setting to its servers',
          'Setting changes apply to new deployments, so the app needs to be deployed again',
          'The host rejects settings that were not first saved in a .env file and committed to the repository',
          'The value must also be pasted into the code, or it is ignored',
        ],
        answer: 1,
        explanation: 'Vercel’s documentation says a variable change applies only to new deployments. The running copy keeps the values it was built or started with, so redeploy.',
      },
      {
        id: 'ai-deployment-03-q4',
        prompt: 'A live key is exposed in a repository. What is the correct first step?',
        choices: [
          'Delete the file and push a new commit',
          'Rewrite the whole Git history to remove the key everywhere, then force-push the cleaned history',
          'Make the repository private and consider the matter closed',
          'Revoke or rotate the key at the service that issued it, so the leaked value stops working',
        ],
        answer: 3,
        explanation: 'GitHub says revoking or rotating is the first step. Deleting the file leaves the key in history, and making the repository private does not undo copies already taken.',
      },
      {
        id: 'ai-deployment-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In the shop-key comparison, what does “revoke and replace” mean?',
        choices: [
          'Hide the key under the doormat and tell nobody',
          'Ask a friend to keep the key safe for you',
          'Change the lock so the old key no longer works, and get a new key',
        ],
        answer: 2,
        explanation: 'Revoking the old key at the service is like changing the lock: whoever saw the old key can no longer use it.',
      },
      {
        id: 'ai-deployment-03-q6',
        audience: { min: 'advanced' },
        prompt: 'Your CI deploys with a long-lived cloud key stored as a repository secret. What is a stronger design?',
        choices: [
          'Exchange the workflow’s short-lived OIDC token for temporary credentials, so no long-lived key is stored',
          'Keep the key but rename the secret to something less obvious and keep the repository private so that nobody can see the secret',
          'Print the key into the log in a masked form so it can be audited later',
          'Commit the key in an encrypted file next to the workflow so it is versioned with the code and rotate the key by hand whenever somebody joins the team',
        ],
        answer: 0,
        explanation: 'Identity federation removes the stored long-lived secret, so there is nothing to leak or rotate. Renaming, masking or committing an encrypted copy leaves the same long-lived key in place.',
      },
    ],
    task: {
      title: 'Find and move your secrets',
      minutes: 18,
      steps: [
        'In a project of yours (or a scratch folder), create the config.js from this lesson. Run it with and without `API_URL=https://api.example.com` in front and confirm the two outputs.',
        'Make a `.env` file containing a fake line such as `PAYMENT_KEY=sk_test_123`, create a `.gitignore` with `.env` in it, and run `git check-ignore -v .env` to see that Git ignores it. Create a `.env.example` with the name only.',
        'Run the lesson’s “work with secrets safely” prompt on your project and read its list. Did it find anything?',
        'Write down, for one app of yours, which variables would be safe to send to a browser and which must stay on a server.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant: “What is the difference between a setting and a secret? Give two examples of each for a small shop website.” Check that you agree.'] },
      { audience: { min: 'advanced' }, steps: ['Turn on secret scanning and push protection in a scratch repository if your plan offers them, then try to push a fake token in a known format and record what happens. Write down who can bypass it.'] },
    ],
  },
  {
    id: 'ai-deployment-04',
    day: 4,
    title: 'A domain and HTTPS',
    summary: 'Give your app a name people can remember, understand how DNS points it to your host, and know what the padlock really means.',
    minutes: 26,
    skills: ['domains-https'],
    intro: {
      objectives: [
        'Explain what a domain name and DNS do, and read a simple DNS record',
        'Connect a domain to a host by adding the records the host asks for',
        'Explain what HTTPS and a certificate prove, and what to check when the padlock fails',
      ],
      why: 'A web address such as lornastore.example is what customers trust and remember, and the padlock decides whether browsers warn them away. Getting this wrong makes a finished app look broken or unsafe.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Once your app is live, the host gives it an address of its own, usually a long one that ends in the host’s name. It works, but nobody remembers it and it is not yours. A **domain name** such as `lornastore.example` is a short, readable name that you rent. MDN’s explanation is worth remembering: you do not buy a domain, you pay for the right to use it for a period of time, and you renew it to keep it. If the renewal lapses, someone else can take it. Domain names are read from right to left: in `shop.lornastore.example`, `example` is the **top-level domain**, `lornastore` is the name you rented, and `shop` is a **subdomain** you can create for free.',
      },
      { type: 'heading', text: 'DNS: the phone book of the internet' },
      {
        type: 'paragraph',
        text: 'Computers do not find each other by names. They use numbers called **IP addresses**. The **Domain Name System (DNS)** is the phone book that turns a name into a number. When someone types your domain, their device asks a DNS server, gets the number back, and connects. Answers are remembered (cached) for a while, so when you change where a name points, some people keep seeing the old answer for a time. That delay is the reason for the most common sentence in this topic: “it can take a while to update”. You control the phone-book entry for your own name by adding **records** at whichever company manages your DNS (often the registrar where you rented the name).',
      },
      {
        type: 'table',
        headers: ['Record', 'What it says', 'You will use it to'],
        rows: [
          ['A', 'This name points to this IP address', 'Point the bare domain, such as lornastore.example, at your host (Vercel’s documentation uses an A record for an apex domain)'],
          ['CNAME', 'This name is another name for that other name', 'Point a subdomain, such as www or shop, at the name your host gives you (Vercel uses CNAME for subdomains)'],
          ['TXT', 'This name carries a piece of text', 'Prove to a host that you control the domain, when it asks for a verification value'],
        ],
        caption: 'The three records you will meet first. Your host shows the exact ones to add, so copy them from its settings page rather than from memory or from an AI answer.',
      },
      { type: 'heading', text: 'The steps, in order' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Rent the name** from a registrar, a company that registers domains for you.',
          '**Add the domain in your host’s settings.** The host then shows which records it needs.',
          '**Add those records** where your DNS is managed, copying each type, name and value exactly.',
          '**Wait and check.** The host’s page shows when the records are valid; DNS changes can take time to spread.',
          '**Add both versions** of your name (with and without www) and choose one to redirect to the other, so neither shows an error.',
        ],
      },
      {
        type: 'warning',
        text: 'Some hosts offer to take over all of your DNS by changing your “nameservers”. That moves every record, including the ones for your email. Vercel’s documentation warns to copy your existing records, including email (MX) records and verification text records, before you change nameservers. Changing only the website’s record at your current provider leaves the rest untouched, so prefer that unless you have a reason.',
      },
      { type: 'heading', text: 'HTTPS and the padlock' },
      {
        type: 'paragraph',
        text: '**HTTPS** is the secure version of the web’s language. It does two things: it scrambles what travels between the visitor and your server so others on the network cannot read it, and it proves the visitor reached the real owner of the domain, not an imposter. The proof is a **certificate**, a small file that says “this key belongs to the owner of lornastore.example”. A trusted company, a **certificate authority**, issues it only after checking that you control the domain. Let’s Encrypt, a free authority, describes the check: its software asks you to prove control by placing a specific DNS record or a file at a known web address, and only after that succeeds does it issue the certificate. Renewal repeats the same check.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'How a certificate is obtained. Good hosts do all of this for you after you add the domain.',
        source: `sequenceDiagram
  participant You as You (domain owner)
  participant Host as Your host
  participant CA as Certificate authority
  You->>Host: Add lornastore.example in settings
  Host->>CA: Request a certificate for the name
  CA->>Host: Challenge: prove you control it
  Host->>CA: Answer the challenge (DNS record or web file)
  CA->>Host: Certificate issued
  Host->>You: Padlock on, renews automatically`,
      },
      {
        type: 'paragraph',
        text: 'This is why a certificate error right after you add a domain is usually not a mystery: the host cannot answer the authority’s challenge until DNS actually points to it. First check that the records match what the host shows, wait for DNS to update, and only then investigate further. Never “fix” a certificate warning by telling visitors to click past it, and never buy a certificate you do not need: most hosts issue and renew them without any action from you.',
      },
      {
        type: 'code',
        language: 'bash',
        label: 'Ask the internet what a name points to (dig is installed on macOS and most Linux; on Windows use nslookup)',
        code: `dig +short lornastore.example A
dig +short www.lornastore.example CNAME`,
      },
      {
        type: 'paragraph',
        text: 'Each command prints the live answer for that record, or nothing when there is none. It is the quickest way to check what you did, because the answer shows what the world sees, not what your settings page says you saved. Paste the output, never your registrar password, into an AI assistant if you want help reading it.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine your shop is in a market with a very long address. You rent a short, memorable name (the domain). The market has a phone book (DNS) where you write “call this name, reach that stall”. Records are the lines you write in the phone book. A *registrar* is the company that rents you the name. The padlock in the browser works like a government-approved ID badge for your stall: a trusted office (the certificate authority) gives it only after you show you really run that stall. The `dig` command above simply looks up a phone-book line, as you would ask the operator for a number.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Plan a cutover around caching: lower a record’s time-to-live ahead of a migration, move, verify, then raise it again. Know which validation your certificate needs: an HTTP challenge works only after the name already reaches the new host, so a pre-cutover certificate needs a DNS challenge, and a wildcard certificate always does (Vercel’s documentation notes that it needs access to DNS challenges to issue and renew wildcards, and describes delegating the challenge subdomain if you cannot change nameservers). CAA records can restrict which authorities may issue for your name. Treat HSTS as one-way for the length you set, because browsers then refuse plain HTTP, so roll it out gradually. Monitor expiry: uptime checks such as Google Cloud’s report the days left on the server’s certificate.',
      },
      {
        type: 'version',
        text: 'Checked on this date. Vercel’s documentation says to configure an apex domain with an A record and a subdomain with a CNAME record, that you should add both the apex and www and redirect one to the other, that a TXT record can verify domain access, and to copy existing DNS records (including MX) before changing nameservers; DNS changes can take time to propagate. Let’s Encrypt describes validation by a DNS record or a web resource at a well-known address, followed by issuance and renewal that repeats validation. MDN describes a domain as rented for a period, and DNS as caching answers so changes take time. Exact record values differ per host and per project, so always copy them from your host’s settings.',
        checked: CHECKED,
        sources: [DOCS.vercelDomain, DOCS.letsEncrypt, DOCS.mdnDomain, DOCS.gcpUptime],
      },
      {
        type: 'takeaways',
        items: [
          'A domain is a name you rent and renew; DNS is the phone book that turns it into the address of your host.',
          'Copy the exact records from your host’s settings: A for the bare domain and CNAME for a subdomain, in Vercel’s case.',
          'DNS answers are cached, so changes take time; check with dig or the host’s status, not just your settings page.',
          'HTTPS encrypts traffic and proves you own the domain, through a certificate that is issued after you answer a challenge.',
          'Add both the www and bare names, and be careful with nameservers: moving them moves your email records too.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'A record that points the wrong way',
          prompt: 'Your host’s instructions say: “Use an A record for the bare domain pointing to 192.0.2.10, and a CNAME record for www pointing to lornastore.example-host.net.” An AI assistant wrote out these records, but www does not work. Tap the wrong line, then pick the correct one.',
          concept: 'dns record types',
          language: 'text',
          code: `Type    Name    Value
A       @       192.0.2.10
A       www     lornastore.example-host.net`,
          bugLine: 3,
          fixes: [
            { line: 'CNAME   www     lornastore.example-host.net', correct: true, why: 'A name that points to another name is a CNAME. An A record must hold an IP address, so the www line was the wrong type.' },
            { line: 'A       www     lornastore.example-host.net.com', correct: false, why: 'Adding more letters does not make a name into an IP address. An A record still needs a number like 192.0.2.10.' },
            { line: 'TXT     www     lornastore.example-host.net', correct: false, why: 'A TXT record only carries text, for example a verification value. It does not send visitors anywhere.' },
            { line: 'A       www     https://lornastore.example-host.net', correct: false, why: 'DNS records hold names or numbers, never a full web address with https://, and an A record needs an IP address anyway.' },
          ],
          hints: [
            'What kind of value does an A record hold?',
            'The value on the www line is a name, not a number. Which record type points a name at another name?',
            'The host’s instructions already tell you: a CNAME for www.',
          ],
          explanation: 'An A record maps a name to an IP address; a CNAME maps a name to another name. The www line gave a name, so it needed to be a CNAME, which is what the host’s instructions said.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-04-match-1',
          kind: 'match',
          title: 'What went wrong?',
          prompt: 'Match each symptom to its most likely cause.',
          concept: 'diagnose domain problems',
          labels: { terms: 'Symptom', meanings: 'Most likely cause' },
          pairs: [
            { term: 'lornastore.example loads, but www.lornastore.example says “site not found”', definition: 'No record or redirect was set up for the www name', note: 'The bare name and the www name are separate entries, so each needs its own record, or a redirect.' },
            { term: 'You changed a record ten minutes ago and half your friends still see the old site', definition: 'DNS answers are cached, so the change is still spreading', note: 'Cached answers expire at different times for different people.' },
            { term: 'After moving to the host’s nameservers, your business email stops arriving', definition: 'The old email (MX) records were not copied to the new DNS', note: 'Changing nameservers moves all DNS, so records you did not copy are gone.' },
            { term: 'The browser warns about the certificate on a domain you added five minutes ago', definition: 'The host could not complete the certificate check because the name does not point to it yet', note: 'The authority’s challenge can only be answered once DNS points to the host.' },
          ],
          hints: [
            'Think about which symptom is about timing and which is about a missing entry.',
            'The email symptom started right after a move; what did the move replace?',
            'Match the “half my friends” symptom with caching.',
          ],
          explanation: 'Each symptom points at one part of the process: a missing entry (www), caching (some people see old answers), moved DNS without copying records (email), or the certificate check waiting on DNS (the warning).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-04-scenario-1',
          kind: 'scenario',
          title: '“Just change your nameservers”',
          prompt: 'Choose what you do.',
          concept: 'nameservers and email',
          situation: 'You connect a domain to a new host. Your AI assistant says: “The easiest way is to change your domain’s nameservers to the host’s.” The same domain runs your family business’s email.',
          options: [
            { text: 'Ask which records you must copy first. List the current records (including email ones), or add only the A and CNAME records the host asks for at your current DNS provider instead.', consequence: 'Your site goes live on the domain and email keeps working, because you either copied everything or changed only the website’s records.', quality: 'best' },
            { text: 'Change the nameservers right away; the host will sort everything else out.', consequence: 'Nameservers decide where all of the domain’s records are read from. The email records were not copied, so mail stops arriving until you rebuild them.', quality: 'poor' },
            { text: 'Skip the domain and tell customers to use the host’s long address.', consequence: 'Nothing breaks, but you give up a name customers remember and trust, when a safe route existed.', quality: 'acceptable' },
            { text: 'Paste your registrar’s login into the chat so the assistant can make the change for you.', consequence: 'You have handed an outsider control of your domain and, through it, your email and website. Never share account logins with an assistant.', quality: 'poor' },
          ],
          hints: [
            'What else does the domain do besides the website?',
            'Changing nameservers moves every record, not just the website’s.',
            'There is a safer route: change only the records the host asks for, or copy the others first.',
          ],
          explanation: 'Nameservers control all of a domain’s records. Copy what you need first, or change only the website’s records, so email keeps working. You never need to hand over a login.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-deployment-04-q1',
        prompt: 'What does DNS do?',
        choices: [
          'It encrypts everything that travels between a visitor and your server, so nobody on the same network can read it',
          'It stores the files of your website on a computer that is always on',
          'It checks your code for mistakes before it goes live',
          'It turns a name such as lornastore.example into the number address of a server',
        ],
        answer: 3,
        explanation: 'DNS is the phone book: it translates names into IP addresses. Encrypting is HTTPS, storing files is hosting.',
      },
      {
        id: 'ai-deployment-04-q2',
        prompt: 'Your host tells you to point www.lornastore.example at lornastore.example-host.net. Which record type do you add?',
        choices: [
          'An A record, because every name must end up as an IP address',
          'A CNAME record, because the value is another name, not an IP address',
          'A TXT record, because the value is made of letters rather than numbers',
          'An MX record, because the value is the address of a server that your visitors will connect to',
        ],
        answer: 1,
        explanation: 'A CNAME makes one name an alias of another name. An A record needs an IP address, TXT only carries text, and MX is for email.',
      },
      {
        id: 'ai-deployment-04-q3',
        prompt: 'You changed where your domain points an hour ago, and some visitors still see the old site. What is the most likely reason?',
        choices: [
          'DNS answers are cached for a while, so some people have not yet picked up the change',
          'The new host deleted your old site on purpose and visitors are looking at a backup copy',
          'Your certificate expired while you were editing the records, so the old copy is shown instead',
          'The domain was never actually renewed, so the registrar shows a previous owner’s page to some visitors',
        ],
        answer: 0,
        explanation: 'Answers are remembered, so changes spread gradually. Nothing is broken: wait, and check with dig to see what the world sees.',
      },
      {
        id: 'ai-deployment-04-q4',
        prompt: 'What does a certificate for your domain prove?',
        choices: [
          'That your app has no bugs, because the authority tested everything in it before it issued the certificate to you',
          'That the visitor’s computer is free of viruses and safe to browse with',
          'That the key the visitor’s browser is using belongs to whoever controls the domain, and traffic to it is encrypted',
          'That you have paid the registrar for the next ten years, so nobody else is able to take the name from you',
        ],
        answer: 2,
        explanation: 'A certificate ties a key to a domain after the authority checks control of it. It says nothing about your code, the visitor’s device or your renewals.',
      },
      {
        id: 'ai-deployment-04-q5',
        audience: { max: 'beginner' },
        prompt: 'Which comparison matches what a DNS record is?',
        choices: [
          'A line in the market’s phone book: “this name reaches that stall”',
          'The lock on the shop door',
          'The receipt you get for renting the shop',
        ],
        answer: 0,
        explanation: 'DNS is the phone book, and a record is one line in it. The padlock and the renewal are different parts of the story.',
      },
      {
        id: 'ai-deployment-04-q6',
        audience: { min: 'advanced' },
        prompt: 'You are moving a busy domain to a new host. You want the certificate ready before traffic moves, and you also need a wildcard for subdomains. What should you plan for?',
        choices: [
          'Use an HTTP challenge on the new host, since it is the simplest option and it works for wildcard names too',
          'Skip the certificate until after the move, because browsers accept a missing certificate for the first week after a change',
          'Use a DNS-based validation, because the name does not reach the new host yet and wildcards require the DNS challenge',
          'Change the nameservers first and then wait to find out whether the certificate gets issued by itself',
        ],
        answer: 2,
        explanation: 'An HTTP challenge needs the name to reach the host already, and wildcard names need the DNS challenge, so DNS-based validation is how you prepare before cutover. Browsers do not wave through a missing certificate.',
      },
    ],
    task: {
      title: 'Look up real DNS and plan your own domain',
      minutes: 15,
      steps: [
        'Run `dig +short example.com A` (or `nslookup example.com`) in a terminal and write down the answer. Then run `dig +short www.example.com CNAME` and note what a CNAME answer looks like.',
        'In your browser, click the padlock on any website and find who issued its certificate and when it expires.',
        'For a project of yours, write a domain plan: the name you want, where you would rent it, which host you will use, and the records you expect the host to ask for.',
        'Ask an AI assistant to explain each record in your plan, then compare its answer with what your host’s own documentation says. Never paste a login.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw your domain on paper as a phone book: the name on the left, an arrow, and the host’s address on the right. Add a second line for www.'] },
      { audience: { min: 'advanced' }, steps: ['Write the cutover plan for moving an existing domain: current time-to-live, when you will lower it, how you will validate the certificate before the switch, and how you would revert.'] },
    ],
  },
  {
    id: 'ai-deployment-05',
    day: 5,
    title: 'Automatic deploys from your code',
    summary: 'Let every push to your main branch test, build and deploy your app by itself, with a workflow file you can read and check.',
    minutes: 30,
    skills: ['ci-cd'],
    intro: {
      objectives: [
        'Explain continuous integration and continuous deployment in plain words',
        'Read a GitHub Actions workflow and say when each job runs',
        'Check an AI-written workflow with a linter and by running its steps yourself before you trust it',
      ],
      why: 'Deploying by hand means forgetting a step on the one day it matters. An automatic pipeline does the same steps the same way every time, and an AI assistant can write it, as long as you can read and check what it wrote.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Putting an app live by hand follows a routine: run the tests, build, upload, check. People forget steps, especially when they are tired or in a hurry, and “I forgot to run the tests” is how broken versions reach customers. The fix is to write the routine down once as instructions a machine follows every time. Two ideas have names. **Continuous integration (CI)** means that every time code is pushed, a machine automatically builds it and runs the tests, so a break is noticed within minutes. **Continuous deployment (CD)** goes one step further: when the checks pass on the main branch, the machine also puts the new version live. Together they are often written CI/CD.',
      },
      {
        type: 'paragraph',
        text: 'There are two common ways to get this. Many hosts, Vercel among them, connect to your Git repository and deploy on their own: Vercel’s documentation says a push to the production branch creates a production deployment and other pushes create previews. The second way is a **workflow** that you write and your code host runs. On GitHub this is **GitHub Actions**: a file stored in your repository at `.github/workflows/`, ending in `.yml`, that says *when* to run and *what* to do. The two combine well: the workflow runs the tests, and the host deploys only what passed. The workflow below does both in one file, which is also a good way to learn how they work.',
      },
      {
        type: 'code',
        language: 'yaml',
        label: '.github/workflows/ci.yml: test every change, and deploy only from main',
        code: `name: CI and deploy

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v6
      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}`,
      },
      { type: 'heading', text: 'Reading it, part by part' },
      {
        type: 'list',
        items: [
          '**`on:`** is the trigger. This workflow starts when someone pushes to `main`, and also for every pull request, which is a request to merge a change into `main`.',
          '**`jobs:`** are groups of steps. `test` and `deploy` are two jobs. Jobs run at the same time unless one says `needs:` another, as `deploy` does, so deploy waits for test and is skipped if test fails.',
          '**`runs-on:`** picks the machine that runs the job (here, a fresh Ubuntu computer each time, so nothing is left over from your laptop).',
          '**`steps:`** run in order. `uses:` runs a ready-made step someone published, such as downloading your code (`actions/checkout`) or installing Node (`actions/setup-node`). `run:` runs a command, exactly as you would type it.',
          '**`if:`** is a condition. Here, deploy only happens on a push to main, never for a pull request.',
          '**`environment: production`** links the job to a named GitHub environment, where you can require a person to approve before the job runs and before it can read that environment’s secrets.',
          '**`secrets.DEPLOY_TOKEN`** reads a secret you stored in GitHub’s settings, so it is not written in the file (lesson 3).',
        ],
      },
      {
        type: 'paragraph',
        text: '`npm ci` installs exactly the versions in your lockfile and fails if the lockfile and `package.json` disagree, which is why npm’s documentation recommends it for automated runs and deployments. The version numbers on `uses:` lines, such as `@v6`, pick a published release of that step; they move on, so check each action’s own page for its current one.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate' },
        text: '**Tip for people who have built apps before:** a workflow is only as strong as the checks it runs. If your project has no tests, “CI passed” means “it installed and built”, which is useful but small. Before you automate deployment, add at least one test for the thing that would hurt most if it broke (the total on a receipt, a login). A pipeline that deploys on green is a promise, and a test is what the promise is made of.',
      },
      { type: 'heading', text: 'Never trust a workflow you have not checked' },
      {
        type: 'paragraph',
        text: 'AI assistants write these files well and quickly, but a mistake here can deploy broken code or expose a secret. You can check one in three ways without running it on GitHub. First, parse it with a YAML library: it confirmed that ours has the three top-level keys `name`, `on` and `jobs`, and that `deploy` needs `test`. Second, lint it with **actionlint**, a free checker for workflow files. It accepted our file without complaint. When we changed `needs: test` to `needs: tests` and `secrets.DEPLOY_TOKEN` to `secret.DEPLOY_TOKEN`, it caught both:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of: actionlint bad/ci.yml (actionlint 1.7.12)',
        code: `bad/ci.yml:21:3: job "deploy" needs job "tests" which does not exist in this workflow [job-needs]
   |
21 |   deploy:
   |   ^~~~~~~
bad/ci.yml:30:29: undefined variable "secret". available variables are "env", "github", "inputs", "job", "matrix", "needs", "runner", "secrets", "steps", "strategy", "vars" [expression]
   |
30 |           DEPLOY_TOKEN: \${{ secret.DEPLOY_TOKEN }}
   |                             ^~~~~~~~~~~~~~~~~~~`,
      },
      {
        type: 'paragraph',
        text: 'Third, run the *same commands* the workflow runs, on your own computer: `npm ci`, `npm test`, `npm run build`. If they do not pass for you, they will not pass in the pipeline. We ran them on our sample store: the test suite reported 1 test passing and 0 failing, and the build printed `Built 1 file(s) into dist/`. Last, read the permissions and the secrets: which secrets does each job touch, and does a pull request from a stranger’s copy of your repository get any of them? (GitHub withholds secrets from runs triggered by pull requests from forks.)',
      },
      {
        type: 'prompt',
        label: 'Ask AI to write the workflow, and to explain what it wrote',
        text: 'Write a GitHub Actions workflow for this project. It must run the tests and the build on every pull request and on every push to main, and deploy only after those pass and only from main. Use a secret named DEPLOY_TOKEN, never write a real value in the file, give each job only the permissions it needs, and add a short comment above each step saying what it does. Then list every secret the workflow reads, and tell me how I can check the file myself before I push it.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A workflow is a recipe card pinned inside your project. The `on:` part says “start cooking when someone pushes”. The jobs are the dishes. Each step is one instruction (“install Node”, “run the tests”). `needs: test` means “do not serve the main dish until the starter has been checked and passed”. The machine that follows the recipe is a clean kitchen every time, which is why it catches things that only worked in *your* kitchen. YAML is the file format: it uses indentation (spaces at the start of lines) to show what belongs to what, so a wrongly indented line changes the meaning.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the workflow as production code. Pin third-party actions to a full commit hash for sensitive jobs, since a tag such as `v6` can be moved by its owner. Give the workflow a `permissions:` block with the smallest scope, which GitHub supports at workflow and at job level, and use environments with required reviewers and branch rules for production, because environment secrets stay unavailable until those pass. Add `concurrency` so two pushes do not deploy at once (it can cancel the older run), prefer OIDC federation over stored cloud keys, and keep untrusted input (PR titles, branch names) out of `run:` strings. If an agent such as Claude Code runs in CI, its GitHub Action takes the API key from a repository secret, and its documentation advises granting only needed permissions and capping turns and timeouts, since runs consume both Actions minutes and API tokens.',
      },
      {
        type: 'version',
        text: 'Checked on this date. GitHub documents that workflow files live in .github/workflows with a .yml or .yaml extension; that the on key can filter push and pull_request by branches; that jobs run in parallel unless needs orders them; that a job can set its own permissions; and that concurrency keeps a single run per group, optionally cancelling in-progress runs. The docs’ own examples use actions/checkout@v6, the actions/setup-node README uses actions/setup-node@v7 with a node-version and cache: npm, and Claude Code’s documentation shows anthropics/claude-code-action@v1 with the key passed from a repository secret. Action versions are published separately and move on, so check each action’s page. npm documents npm ci as requiring a lockfile and failing if it disagrees with package.json.',
        checked: CHECKED,
        sources: [DOCS.ghWorkflow, DOCS.ghEnvironments, DOCS.setupNode, DOCS.ccActions, { label: 'npm docs: npm ci', url: 'https://docs.npmjs.com/cli/v11/commands/npm-ci' }],
      },
      {
        type: 'takeaways',
        items: [
          'CI runs the checks on every push; CD puts the new version live when the checks pass.',
          'A GitHub Actions workflow is a YAML file in .github/workflows that says when to run (on) and what to do (jobs and steps).',
          'needs: orders jobs and if: limits when one runs; deploy should wait for tests and only run from main.',
          'Check an AI-written workflow three ways: parse it, lint it with actionlint, and run its commands yourself.',
          'Secrets come from GitHub’s settings through secrets.NAME, never from text in the file.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-05-fix-bug-1',
          kind: 'fix-bug',
          title: 'A deploy job that cannot find its test',
          prompt: 'An AI assistant wrote this workflow, and actionlint reports: job "deploy" needs job "tests" which does not exist in this workflow. Tap the line with the mistake, then pick the fix.',
          concept: 'job order with needs',
          language: 'yaml',
          code: `jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: npm test

  deploy:
    needs: tests
    runs-on: ubuntu-latest
    steps:
      - run: echo "deploying"`,
          bugLine: 9,
          fixes: [
            { line: '    needs: test', correct: true, why: 'The name after needs must be the exact name of another job. The job above is called test, so deploy now waits for it.' },
            { line: '    needs: [deploy]', correct: false, why: 'A job cannot wait for itself. This makes a loop and the workflow is invalid.' },
            { line: '    needs: build', correct: false, why: 'There is no job named build either, so the same kind of error appears with a different name.' },
            { line: '    if: test', correct: false, why: 'if takes a condition, not a job name, and it would not make deploy wait for the tests to finish.' },
          ],
          hints: [
            'actionlint says the job it needs “does not exist”. What is the job above really called?',
            'Job names are the keys directly under jobs: here, test and deploy.',
            'Use the exact name of the first job.',
          ],
          explanation: 'needs takes the exact id of another job. The tests job is called test, not tests, so needs: test makes deploy wait for it and be skipped if it fails.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-05-fix-bug-2',
          kind: 'fix-bug',
          title: 'A secret that comes out empty',
          prompt: 'actionlint reports: undefined variable "secret". The deploy step needs to read the secret stored in GitHub’s settings as DEPLOY_TOKEN. Tap the mistaken line, then pick the fix.',
          concept: 'reading secrets in a workflow',
          language: 'yaml',
          code: `      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: \${{ secret.DEPLOY_TOKEN }}`,
          bugLine: 3,
          fixes: [
            { line: '          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}', correct: true, why: 'The context is named secrets, plural. GitHub reads the stored value and passes it to the step without it appearing in the file.' },
            { line: '          DEPLOY_TOKEN: ${{ env.DEPLOY_TOKEN }}', correct: false, why: 'env reads variables that the workflow itself already set. The token was never set there, so it would be empty.' },
            { line: '          DEPLOY_TOKEN: sk_live_EXAMPLE123', correct: false, why: 'This puts the real value in the file and in Git history. It is the leak lesson 3 warned about.' },
            { line: '          DEPLOY_TOKEN: ${{ github.token }}', correct: false, why: 'github.token is a temporary token for GitHub itself, not your host’s deploy token.' },
          ],
          hints: [
            'actionlint lists the names that exist. Is “secret” one of them?',
            'The name it lists that holds stored secrets ends in an s.',
            'The correct word is secrets.',
          ],
          explanation: 'Stored secrets are read from the secrets context, plural. A misspelt context fails the lint check, and writing the value into the file would leak it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-05-arrange-1',
          kind: 'arrange',
          title: 'Order the steps of the test job',
          prompt: 'Put the steps of the test job in an order that works. The tests and the build both need the packages installed first.',
          concept: 'order of CI steps',
          language: 'yaml',
          solution: [
            '- uses: actions/checkout@v6',
            '- uses: actions/setup-node@v7',
            '- run: npm ci',
            '- run: npm test',
            '- run: npm run build',
          ],
          alternatives: [
            [
              '- uses: actions/checkout@v6',
              '- uses: actions/setup-node@v7',
              '- run: npm ci',
              '- run: npm run build',
              '- run: npm test',
            ],
          ],
          reasons: [
            'The fresh machine starts empty, so your code has to be downloaded first.',
            'Node must be installed before any npm command can run.',
            'Packages must be installed before tests or a build can use them.',
            'Tests come before the build here so a failure shows up quickly.',
            'The build runs last, once the code is installed and has passed its tests.',
          ],
          hints: [
            'A brand-new machine has nothing on it yet. What does it need first?',
            'You cannot run npm before Node, and you cannot test before installing packages.',
            'Download the code, install Node, install packages, then run tests and the build.',
          ],
          explanation: 'Download the code, install Node, install the packages, then run the tests and the build. Tests and build can swap places because both only need the install first.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-deployment-05-q1',
        prompt: 'What is the difference between continuous integration and continuous deployment?',
        choices: [
          'Integration is writing the code; deployment is reading it',
          'Integration builds and tests every push automatically; deployment also puts a passing version live automatically',
          'Integration happens on your laptop while you are coding; deployment happens later on GitHub, after you have gone home',
          'They are two names for the same thing and differ only in which hosting product uses them',
        ],
        answer: 1,
        explanation: 'CI checks every change automatically; CD takes the next step and releases a version that passed. They are related but not the same.',
      },
      {
        id: 'ai-deployment-05-q2',
        prompt: 'In the workflow, why does the deploy job say needs: test?',
        choices: [
          'So both jobs run at exactly the same time and finish together',
          'So the deploy job can borrow the test job’s secrets and permissions without declaring its own',
          'So the test job is skipped whenever the deploy job is running',
          'So deployment waits for the tests, and does not happen at all if the tests fail',
        ],
        answer: 3,
        explanation: 'Jobs run in parallel unless needs orders them. needs: test makes deploy wait for test and be skipped if test fails.',
      },
      {
        id: 'ai-deployment-05-q3',
        prompt: 'An AI assistant gives you a workflow file. What should you do before pushing it?',
        choices: [
          'Push it straight away; if the file is wrong in any way, GitHub will refuse it and tell you exactly what to change',
          'Ask the assistant to say it is correct a second time',
          'Lint it with actionlint, run its commands locally, and read which secrets and permissions it uses',
          'Delete the secrets lines and the permissions block, since a first run does not need either of them to work',
        ],
        answer: 2,
        explanation: 'A linter catches typos such as a missing job or a misspelt context, local runs prove the commands work, and reading secrets and permissions catches risk. An assistant agreeing with itself proves nothing.',
      },
      {
        id: 'ai-deployment-05-q4',
        prompt: 'Why use npm ci instead of npm install in a pipeline?',
        choices: [
          'It installs exactly what the lockfile lists and fails if the lockfile and package.json disagree, so every run is repeatable',
          'It is faster because it skips the package.json file, so the install never has to read it',
          'It installs the newest version of every package each time, which keeps your project permanently up to date without any effort',
          'It makes the tests optional',
        ],
        answer: 0,
        explanation: 'npm documents npm ci as a stricter, reproducible install for automated runs: it needs a lockfile and errors on a mismatch instead of changing things.',
      },
      {
        id: 'ai-deployment-05-q5',
        audience: { max: 'beginner' },
        prompt: 'Using the recipe-card comparison, what does the on: part of a workflow say?',
        choices: [
          'Which machine to cook on',
          'When to start: for example, when someone pushes to main',
          'What the finished dish should taste like',
        ],
        answer: 1,
        explanation: 'on: is the trigger, the moment the machine starts following the recipe. The steps say what to do, and runs-on picks the machine.',
      },
      {
        id: 'ai-deployment-05-q6',
        audience: { min: 'advanced' },
        prompt: 'Your production deploy job uses a third-party action pinned to the tag v3. What is the risk, and the usual mitigation?',
        choices: [
          'The tag can be moved to different code by its owner; pin to a full commit hash and review updates',
          'Tags are slower to download than commit hashes, so every deploy takes noticeably longer than it needs to',
          'GitHub refuses to run any action that is pinned to a tag when the repository is private',
          'Tags expire after thirty days and the workflow then stops running without any warning',
        ],
        answer: 0,
        explanation: 'A tag is a movable label. A job that holds production secrets should run exactly the reviewed code, which a full commit hash guarantees.',
      },
    ],
    task: {
      title: 'Check a workflow without pushing it',
      minutes: 20,
      steps: [
        'Create a small Node project with a test and a build (use the store from lesson 1, add a total.mjs and total.test.mjs, and `"test": "node --test"` in package.json). Run `npm install`, then `npm ci`, `npm test` and `npm run build` and confirm all three pass.',
        'Save the workflow from this lesson as .github/workflows/ci.yml. If you have actionlint installed (`brew install actionlint` on macOS), run `actionlint .github/workflows/ci.yml`; if not, ask an AI assistant to review it for mistakes and name which lines it checked.',
        'Break it on purpose in two ways (`needs: tests`, and `secret.DEPLOY_TOKEN`) and see what the linter or the assistant says. Then restore it.',
        'List every secret the workflow reads and who would be able to read it.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain the workflow line by line and tell you what would happen if you removed the `needs: test` line. Check its answer against the lesson.'] },
      { audience: { min: 'advanced' }, steps: ['Harden the workflow: a minimal permissions block per job, a concurrency group for deploys, third-party actions pinned to commit hashes, and an environment with a required reviewer. Explain which attack each change prevents.'] },
    ],
  },
  {
    id: 'ai-deployment-06',
    day: 6,
    title: 'Preview versions before the real thing',
    summary: 'Look at every change live, on a private copy with its own address, before it reaches real customers.',
    minutes: 24,
    skills: ['preview-deploys'],
    intro: {
      objectives: [
        'Explain what a preview deployment is and how a branch and a pull request create one',
        'Review an AI-made change on a preview by using it, not just reading it',
        'Keep a preview from touching real customer data or real secrets',
      ],
      why: 'AI can change a lot of your app in one go, and the diff will not show you that the checkout button moved off the screen. A preview lets you use the change as a customer would, while the live app stays untouched.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A restaurant tests a new dish on the staff before it goes on the menu. A theatre holds a dress rehearsal before opening night. A **preview deployment** is the same idea for software: a temporary, complete copy of your app, built from a proposed change and given its own web address, so you can open it and use it while the real app keeps serving customers. Nothing about it touches the live site, which is the whole point.',
      },
      { type: 'heading', text: 'How a change becomes a preview' },
      {
        type: 'paragraph',
        text: 'Two Git words matter here. A **branch** is a separate line of work: you make your change there, and the main branch (the one that is live) stays as it was. A **pull request** is a proposal to merge a branch into main, where you and others can look at it first. Hosts watch for both. Vercel’s documentation says that by default it creates a preview deployment when you push to a branch that is not the production branch or open a pull request; Cloudflare Pages does the same for branches that are not its production branch. Each preview gets its own address, and the tools usually post the link in the pull request.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: make a branch, commit and push it (Git 2.54). A host connected to this repository would now build a preview from the branch.',
        code: `$ git switch -c feature/new-checkout
Switched to a new branch 'feature/new-checkout'
$ git add -A && git commit -m "New checkout page"
$ git push -u origin feature/new-checkout
To <your repository>
 * [new branch]      feature/new-checkout -> feature/new-checkout
branch 'feature/new-checkout' set up to track 'origin/feature/new-checkout'.
$ git diff main --stat
 index.html | 1 +
 1 file changed, 1 insertion(+)`,
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The preview sits between “the AI changed something” and “customers see it”.',
        source: `flowchart LR
  A[Ask AI for a change on a new branch] --> B[Push the branch, open a pull request]
  B --> C[Tests run and a preview is built]
  B --> D[You open the preview link on your phone]
  C --> E{Checks pass and it looks right?}
  D --> E
  E -->|no| A
  E -->|yes| F[Merge to main]
  F --> G(Production deploy)`,
      },
      { type: 'heading', text: 'Two kinds of preview address' },
      {
        type: 'paragraph',
        text: 'Both hosts give you two kinds of address, and the difference matters when you share a link. A **branch address** always shows the latest work on that branch, so it changes when you push again. A **commit address** shows exactly one version and stays that way. Cloudflare Pages’ documentation gives the branch form as the branch name, made lowercase with other characters replaced by hyphens, in front of the project’s address, and says older deployment addresses stay reachable after newer pushes. Send the commit address when someone must see precisely what you tested, and the branch address when you want them to always see the newest.',
      },
      { type: 'heading', text: 'What a preview does not protect you from' },
      {
        type: 'paragraph',
        text: 'A preview is a real running copy, so it can do real things. The danger is not the address, it is **what the copy is connected to**. If its settings point to your production database, then clicking “delete all orders” on a test page deletes real orders. Vercel keeps preview settings separate: preview deployments use the variables you scope to Preview, not the production ones, so give them a test database and test keys (a payment service’s “test mode”) and your experiments cannot hurt anyone. Also check who can open the link. Vercel’s documentation says new projects start with preview protection that asks visitors to sign in, while Cloudflare Pages previews are public by default unless you restrict them; both add a header telling search engines not to list them.',
      },
      {
        type: 'warning',
        text: 'Never connect a preview to production data or production secrets, even briefly, even “just to check”. A change written by an AI and not yet reviewed is exactly the thing you should not let near real customer records.',
      },
      { type: 'heading', text: 'Review it by using it' },
      {
        type: 'list',
        items: [
          '**Open it on your phone**, not only your laptop, because many visitors will.',
          '**Do the thing that changed**, start to finish: sign in, add to the cart, pay with the test card.',
          '**Try the sad paths:** an empty form, a wrong password, no internet for a moment.',
          '**Check it uses test data** and the Preview settings, not production.',
          '**Read the change itself** (the pull request’s list of changed files) and ask the AI to summarize it, so nothing was changed that you did not ask for.',
        ],
      },
      {
        type: 'prompt',
        label: 'Turn a change into a test plan for the preview',
        text: 'Here is the pull request summary and the list of changed files: [paste them]. Write a checklist of ten things I should try on the preview link, in the order a customer would do them. Include at least three sad paths, anything on a phone screen that could break, and anything that touches data or settings. Then list any file in the change that does not seem related to the goal “[goal]”, so I can ask about it.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A preview is like trying on clothes in a fitting room before buying: you wear the real thing, but nothing has left the shop. A *branch* is a separate notebook page where you write your changes without touching the page everyone reads. A *pull request* is passing that page to a friend and asking, “can this go into the main notebook?”. In the commands above, `git switch -c` starts a new page, `git commit` saves your work on it, and `git push` sends it to GitHub, which is the signal the host needs to build your preview.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** A per-PR environment is only as safe as its data and its credentials. Give previews their own database or schema (branching, a seeded snapshot, or a shared staging store with per-preview prefixes), scoped test credentials and a spending cap, and make cleanup automatic. Anything that depends on a fixed origin breaks on a dynamic address: OAuth redirect allow-lists, CORS, webhook endpoints and cookie domains. Plan for wildcard or per-environment configuration. Automated checks against a protected preview need a bypass: Vercel documents a protection-bypass secret sent in the `x-vercel-protection-bypass` header for CI and test runners. Remember that PRs from forks usually run without your secrets, so a preview there may be limited by design, and that a branch-assigned custom domain may be indexable unless you add the header yourself.',
      },
      {
        type: 'version',
        text: 'Checked on this date. Vercel’s documentation says it creates a preview deployment when you push to a non-production branch, open a pull request, or deploy from the CLI without --prod; each deployment has a branch URL and a commit URL; preview deployments use Preview-scoped environment variables; and new projects start with Standard Protection that asks preview visitors to sign in. Cloudflare Pages’ documentation says each non-production branch gets an alias built from the branch name, every deployment gets a unique hash-based address, pull requests from within the repository (not from forks) get a preview, previews are public by default and can be restricted with Cloudflare Access, and they include a noindex header. Defaults and plan limits change, so confirm them for the host you use.',
        checked: CHECKED,
        sources: [DOCS.vercelEnvironments, DOCS.cfPreview],
      },
      {
        type: 'takeaways',
        items: [
          'A preview is a temporary full copy of your app, built from one branch or pull request, with its own address.',
          'Review a preview by using it: the changed flow, the sad paths, and your phone.',
          'A branch address follows the latest work; a commit address stays on one version.',
          'Previews must use test data and test keys. Never connect one to production.',
          'Check who can open the preview, and read the list of changed files for anything you did not ask for.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-06-fix-bug-1',
          kind: 'fix-bug',
          title: 'Pushed straight to the live branch',
          prompt: 'You asked an AI assistant to make a new checkout page and you want a preview first. These commands send the change straight to main, which is what customers see. Tap the line that skips the preview, then pick the fix.',
          concept: 'branches and previews',
          language: 'bash',
          code: `git switch -c feature/new-checkout
git add -A
git commit -m "New checkout page"
git push origin main`,
          bugLine: 4,
          fixes: [
            { line: 'git push -u origin feature/new-checkout', correct: true, why: 'Pushing the branch, not main, lets the host build a preview from it while the live site stays unchanged.' },
            { line: 'git push --force origin main', correct: false, why: 'Force-pushing to main is more dangerous, not safer: it still goes to the live branch, and it can overwrite other people’s work.' },
            { line: 'git push -u origin feature', correct: false, why: 'There is no branch called feature. The branch you made is feature/new-checkout, so Git would report an error.' },
            { line: 'git push origin HEAD:main', correct: false, why: 'This sends your current branch’s work to main, so it still reaches the live site without a preview.' },
          ],
          hints: [
            'Which branch is the live one, and which branch did you create for the change?',
            'The last command still names main. Where should the change go instead?',
            'Push the branch you made: feature/new-checkout.',
          ],
          explanation: 'The first three lines are right: a branch, then a commit on it. The last line must push that branch rather than main, so the change gets a preview and main stays as customers know it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-06-scenario-1',
          kind: 'scenario',
          title: 'The preview that shares the real database',
          prompt: 'Choose what you do.',
          concept: 'preview data isolation',
          situation: 'Your preview works, and you test an AI-written “clear old orders” button on it. Afterwards you check and discover that the preview’s settings use the same database address as production. You are not sure whether the button ran against real orders.',
          options: [
            { text: 'Stop. Check the production data and your backups first, then point Preview at a test database with test keys before testing anything else.', consequence: 'You find out what was affected while there is still time to restore it, and you fix the cause so previews cannot reach customer data again.', quality: 'best' },
            { text: 'Delete the preview deployment and carry on as if nothing happened.', consequence: 'The preview is gone, but any damage to real orders is not, and the same setting will cause the same problem on the next preview.', quality: 'poor' },
            { text: 'Ask the AI whether the button probably ran, and trust its answer.', consequence: 'The assistant cannot see your database. Only your data and your logs can say what happened.', quality: 'poor' },
            { text: 'Merge the change anyway, since the button seemed to work.', consequence: 'You would ship an unreviewed destructive feature on top of an unknown amount of lost data.', quality: 'poor' },
          ],
          hints: [
            'What could the button have done to the real orders?',
            'Before anything else, find out what actually happened to the data.',
            'Then change Preview’s settings so it uses a test database, not production.',
          ],
          explanation: 'First find out whether real data was hurt, using your data and backups, then fix the setting that let a preview reach it. A preview is a real running copy, so what it is connected to is what decides its safety.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-06-arrange-1',
          kind: 'arrange',
          title: 'A safe path for an AI-made change',
          prompt: 'Put these steps in the order that keeps customers safe.',
          concept: 'preview workflow',
          language: 'text',
          solution: [
            'Ask the AI for the change on a new branch',
            'Push the branch and open a pull request',
            'Wait for the tests and the preview to build',
            'Use the preview on your phone and read the list of changed files',
            'Merge to main so the production deploy starts',
          ],
          reasons: [
            'A branch keeps the live line of work untouched while the change is made.',
            'Pushing and opening the pull request is what triggers the checks and the preview.',
            'You cannot judge the change until the checks have run and the preview exists.',
            'Using the preview and reading the diff is the review that catches what tests miss.',
            'Merging comes last, because merging to main is what makes it live.',
          ],
          hints: [
            'Which step is the only one that changes what customers see?',
            'The preview cannot exist before the branch is pushed.',
            'Branch, push, wait, review, then merge.',
          ],
          explanation: 'Branch, push, wait for checks and the preview, review, and only then merge. Merging is the step that reaches customers, so it is last.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-deployment-06-q1',
        prompt: 'What is a preview deployment?',
        choices: [
          'A screenshot of your app saved in the pull request',
          'A list of the files that changed in a branch, shown before you merge it',
          'A temporary full copy of your app, built from a branch or pull request, with its own address',
          'The first version of your app that you deploy to production after you finish the project',
        ],
        answer: 2,
        explanation: 'A preview is a real, running copy of the proposed change on its own address, separate from the live site.',
      },
      {
        id: 'ai-deployment-06-q2',
        prompt: 'Why should a preview use a separate test database and test keys?',
        choices: [
          'A preview can do real things, so anything wrong or destructive in the change must not be able to reach real customer data',
          'Test databases are always faster than production ones, so the preview loads quickly for reviewers',
          'Hosting companies refuse to build a preview that uses a production database',
          'Test keys make the preview address shorter and easier to share with the people who review it',
        ],
        answer: 0,
        explanation: 'A preview is a running app. If it is connected to production, a mistake in the new code can damage real data, so give it test resources.',
      },
      {
        id: 'ai-deployment-06-q3',
        prompt: 'You must send a colleague a link that shows exactly the version you tested, even if you push more changes tomorrow. Which address do you send?',
        choices: [
          'The branch address, because it is easier to remember than the others',
          'The production address, since it is the one that every colleague already knows how to open',
          'Any address works the same, since previews never change after they are first built',
          'The commit address, because it points to that one version',
        ],
        answer: 3,
        explanation: 'A branch address follows the newest work on the branch; a commit address stays on one version, so it is the one to share when exactness matters.',
      },
      {
        id: 'ai-deployment-06-q4',
        prompt: 'Which of these is the best way to review an AI-made change on a preview?',
        choices: [
          'Read the AI’s own description of the change and trust that it mentions everything that changed in the pull request',
          'Use the changed flow on a phone, try some sad paths, and read the list of changed files for surprises',
          'Check that the preview loads the home page without an error message, then merge it right away, treating that as proof that the change works for every customer',
          'Ask a second AI assistant to confirm that the first one’s change looks fine to it',
        ],
        answer: 1,
        explanation: 'Using it as a customer would and reading what really changed finds problems that a description or a second opinion cannot. Loading one page proves very little.',
      },
      {
        id: 'ai-deployment-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In the notebook comparison, what is a pull request?',
        choices: [
          'Throwing away the extra page',
          'Copying the main page by hand',
          'Passing your page to a friend and asking whether it can go into the main notebook',
        ],
        answer: 2,
        explanation: 'A pull request is a proposal to merge a branch into main, so others can look before it is added.',
      },
      {
        id: 'ai-deployment-06-q6',
        audience: { min: 'advanced' },
        prompt: 'Sign-in works in production but fails on every preview with a “redirect URI mismatch” error. What is the likely cause?',
        choices: [
          'Preview deployments cannot use OAuth under any circumstances, because their addresses are never allowed to complete a sign-in flow',
          'The identity provider only allows the production address as a redirect, but every preview has a different address',
          'The preview’s database is too slow to answer the sign-in request in time',
          'Previews always read the production client secret, which does not match their address and so appears in the preview logs',
        ],
        answer: 1,
        explanation: 'OAuth providers check the redirect address against an allow-list. Previews have dynamic addresses, so they need their own configuration, such as a per-environment client or a wildcard where the provider allows one.',
      },
    ],
    task: {
      title: 'Run a branch and review it like a customer',
      minutes: 18,
      steps: [
        'In a scratch Git repository, make an index.html, commit it on main, then create a branch with `git switch -c feature/new-checkout`, change the page, commit it, and run `git diff main --stat` to see what differs.',
        'If you have a GitHub repository connected to a host that makes previews, push the branch, open a pull request and find the preview link. If not, open index.html from each branch and compare them.',
        'Run the “test plan” prompt from the lesson with your own change and do at least five of the checks it lists, one of them on a phone.',
        'Write down which settings your preview used and whether any of them point to production.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain “branch” and “pull request” using a recipe notebook as the example, then explain it back in one sentence of your own.'] },
      { audience: { min: 'advanced' }, steps: ['Design the data plan for previews of a project you know: where each preview’s data comes from, how credentials are scoped, how it is cleaned up, and how OAuth redirects and webhooks are handled for dynamic addresses.'] },
    ],
  },
  {
    id: 'ai-deployment-07',
    day: 7,
    title: 'Know when it breaks: monitoring',
    summary: 'Find out your app is down or crashing before your customers tell you, with an uptime check, logs and error reports.',
    minutes: 28,
    skills: ['monitoring'],
    intro: {
      objectives: [
        'Name what an uptime check, logs and error tracking each tell you',
        'Write and run a simple health check that fails loudly, and read the status codes it sees',
        'Decide what should wake you up, and what the first five minutes of an incident look like',
      ],
      why: 'A live app can break at 3 a.m. for reasons that have nothing to do with your last change: a certificate expires, a service you depend on goes down. Customers rarely complain; they just leave. Monitoring lets you hear about it first.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Once an app is live you are no longer the only one using it, and you are no longer watching. Things break: a deployment has a bug, a certificate expires, a database fills up, a service you depend on has a bad hour, a setting is wrong. If you have no way to notice, the first report is a customer who has already given up. **Monitoring** means setting up machines to look for you, so that you find out first and have the facts ready when you do. Think of the smoke detector in a shop: you do not stand watching the ceiling all night, but the moment there is smoke, someone is told. Three tools answer three different questions.',
      },
      {
        type: 'table',
        headers: ['Tool', 'The question it answers', 'Example'],
        rows: [
          ['Uptime check', 'Is my app reachable and answering right now, from outside?', 'A robot opens your address every minute and rings you if it fails'],
          ['Logs', 'What did the app do, step by step, when something went wrong?', 'A line saying “payment failed for order 1042: timeout”'],
          ['Error tracking', 'Which errors are happening, to how many people, since which release?', 'One grouped report: “300 users hit this crash since yesterday’s deploy”'],
        ],
        caption: 'Use all three: the check tells you something is wrong, the logs and error reports tell you why.',
      },
      { type: 'heading', text: 'Uptime checks, and why a 200 can lie' },
      {
        type: 'paragraph',
        text: 'An **uptime check** requests a web address on a schedule and judges the answer. Google Cloud’s documentation describes the common design: probes run from several locations worldwide, a check passes when the status code matches your rule (by default any 2xx), you can also require certain text in the page, and it can report how long until the server’s certificate expires. It can notify you through an alerting policy, by default when at least two regions report failure for at least one minute, which avoids waking you for a single network hiccup. Its limits are just as useful to know: such a check does not load images or run JavaScript, so it can tell you the page *answers*, not that checkout *works*.',
      },
      {
        type: 'paragraph',
        text: 'Status codes are the numbers behind this. MDN groups them by their first digit: 2xx means success, 3xx a redirect, 4xx the request was at fault (a 404 means the thing was not found) and 5xx means the *server* failed. A 500 is the generic server failure, 502 means a server in the chain got an invalid answer from the one behind it, and 503 means it is not ready, often overloaded or in maintenance. But beware: a broken page can still answer 200, for example a blank page when the database is down. That is why a good check also looks for something that proves the app is working. Here is a small check an AI assistant could write. It exits with a failure code unless the answer is OK *and* the page contains the shop’s name.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'check.mjs: exit 0 when the site is healthy, exit 1 when it is not',
        code: `const url = process.argv[2];

try {
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  const body = await response.text();

  if (!response.ok) throw new Error(\`status \${response.status}\`);
  if (!body.includes("Ate Lorna's Store")) throw new Error('page loaded but the store name is missing');

  console.log(\`OK \${response.status} \${url}\`);
} catch (error) {
  console.error(\`FAIL \${url}: \${error.message}\`);
  process.exit(1);
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output against a local test server in four states (Node.js 22)',
        code: `$ node check.mjs http://localhost:4101/        (healthy)
OK 200 http://localhost:4101/
$ node check.mjs http://localhost:4102/        (server answers 500)
FAIL http://localhost:4102/: status 500
$ node check.mjs http://localhost:4103/        (answers 200 but blank page)
FAIL http://localhost:4103/: page loaded but the store name is missing
$ node check.mjs http://localhost:4199/        (nothing is running)
FAIL http://localhost:4199/: fetch failed`,
      },
      {
        type: 'paragraph',
        text: '`response.ok` is true for any 2xx answer. The timeout stops the check from waiting forever. The third run is the important one: the server said “200 OK” and the page was empty, so only the content check caught it. Run a script like this from a scheduler (GitHub Actions can run a workflow on a schedule) or point a hosted uptime service at the same address, and ring your phone when it fails.',
      },
      { type: 'heading', text: 'Logs and error reports' },
      {
        type: 'paragraph',
        text: '**Logs** are the lines your app prints as it works, and hosts collect them for you to search. A useful line says *when*, *what happened* and *to what*, such as the order number, so you can follow one customer’s trouble. Decide what is worth a line before an incident, not during one. And decide what must never be in one: OWASP’s guidance is that secrets should never reach logs, so never print a password, a token or a full card number. **Error tracking** is a service that catches crashes, groups identical ones together, counts the people affected and shows which release they started in, which is exactly what you need to decide whether to roll back. When an error report arrives, paste the message and the stack trace (with secrets removed) to an AI assistant, as the Debugging and Troubleshooting with AI course teaches.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'What happens when something breaks, and what you do in the first five minutes.',
        source: `flowchart TD
  A[Uptime check fails twice] --> B[Alert reaches you]
  B --> C{Down for everyone? Check from your phone and another network}
  C -->|only you| D(Your network: stand down)
  C -->|yes| E{Did a deploy just happen?}
  E -->|yes| F[Roll back first: lesson 8]
  E -->|no| G[Read logs and the error report]
  F --> G
  G --> H(Fix, then write down what happened)`,
      },
      {
        type: 'prompt',
        label: 'Ask AI for a monitoring plan sized to your app',
        text: 'My app is [describe it]. It is hosted on [host] and uses [database or service]. Suggest the smallest monitoring setup that would tell me within five minutes if it breaks: one uptime check (what exact address and what text it should expect), the five log lines I should add (and what I must never log), what an alert should say, and who it should reach. Also write a /health address for my server that checks the database too, and tell me what information it should NOT reveal to the public.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** An uptime check is a night guard who walks past your shop door every minute and phones you if the lights are out. Logs are the shop’s diary: “9:02, customer paid; 9:05, till jammed”. Error tracking is a complaints box that sorts the notes into piles, so you can see that thirty people wrote the same complaint. In the script, `fetch` visits the address, `response.ok` asks “did the shop answer normally?”, and `process.exit(1)` means “tell the machine that this check failed”, which is what makes an alert possible.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Alert on symptoms users feel (availability, latency, error rate against a target) more than on causes (CPU), and make every page actionable, because noisy alerts train people to ignore them. A health endpoint needs thought: a shallow one proves the process is alive, a deep one that checks dependencies can make a database blip look like an outage and take instances out of rotation, so keep them separate and keep detail off public responses. Use structured logs with a correlation id, mind retention and personal data, tag errors with the release so a deploy is visible on the graph, and monitor the monitor, since a silent alert system looks identical to a healthy one. Synthetic checks catch availability; real-user data catches what only some users see.',
      },
      {
        type: 'version',
        text: 'Checked on this date. Google Cloud’s uptime-check documentation says checks send HTTP, HTTPS or TCP requests on a schedule from several locations, treat any 2xx as success by default, can require content in the response, report time until certificate expiry, notify through alerting policies (by default when at least two regions fail for at least one minute), and do not load page assets or run JavaScript. MDN documents the status-code classes and the meaning of 500, 502, 503 and 404. OWASP’s secrets guidance says to avoid logging secrets. Monitoring products differ widely in features and plans, so check the one you choose.',
        checked: CHECKED,
        sources: [DOCS.gcpUptime, DOCS.mdnStatus, DOCS.owaspSecrets],
      },
      {
        type: 'takeaways',
        items: [
          'Monitoring means machines look for you: an uptime check, logs and error tracking, each answering a different question.',
          'A check should judge the status code and look for content that proves the app works, because a broken page can still answer 200.',
          'Status codes: 2xx success, 4xx the request was at fault, 5xx the server failed.',
          'Log what happened and to what, never secrets; error tracking groups crashes and ties them to a release.',
          'Alert only on what needs a person, and know your first five minutes: is it down for everyone, did a deploy just happen, what do the logs say.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-07-fix-bug-1',
          kind: 'fix-bug',
          title: 'A health check that never fails',
          prompt: 'This check, written by an AI assistant, prints OK when the server answers 500 and fails only on 404. Tap the line that makes it pass broken pages, then pick the fix.',
          concept: 'judging a response',
          language: 'javascript',
          code: `const response = await fetch(url);

if (response.status !== 404) {
  console.log('OK ' + response.status);
} else {
  console.error('FAIL ' + response.status);
  process.exit(1);
}`,
          bugLine: 3,
          fixes: [
            { line: 'if (response.ok) {', correct: true, why: 'response.ok is true only for 2xx answers, so a 500, 502 or 404 all make the check fail, as they should.' },
            { line: 'if (response.status < 600) {', correct: false, why: 'Every real status code is below 600, so this condition is always true and the check can never fail.' },
            { line: 'if (response.status !== 502) {', correct: false, why: 'This only catches one failure code. A 500 or a 503 would still pass.' },
            { line: 'if (response.body) {', correct: false, why: 'Error pages have a body too, so this passes broken answers as well.' },
          ],
          hints: [
            'Which status code did the check treat as the only failure?',
            'A healthy page answers with a 2xx code. How could the check test for that?',
            'fetch gives you response.ok, which is true for 2xx answers only.',
          ],
          explanation: 'Success is “any 2xx”, not “anything except one failure code”. response.ok says exactly that, so every failure class (4xx and 5xx) now makes the check exit with a failure.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-07-predict-output-1',
          kind: 'predict-output',
          title: 'How much of the traffic failed?',
          prompt: 'This script counts the server errors in ten requests the uptime check saw, and prints the failure rate. A 404 is the visitor’s mistake, not a server failure. What does it print?',
          concept: 'reading status codes',
          language: 'python',
          code: `statuses = [200, 200, 500, 200, 502, 404, 200, 200, 200, 200]
server_errors = [s for s in statuses if s >= 500]
rate = len(server_errors) / len(statuses) * 100
print(f"{len(server_errors)} server errors")
print(f"{rate:.0f}% of requests failed")`,
          expected: '2 server errors\n20% of requests failed',
          choices: [
            '2 server errors\n20% of requests failed',
            '3 server errors\n30% of requests failed',
            '2 server errors\n2% of requests failed',
            '1 server errors\n10% of requests failed',
          ],
          wrongNotes: {
            '3 server errors\n30% of requests failed': 'That counts the 404 as a server error. Codes of 500 and above are the server’s failures; a 404 means the thing was not found.',
            '2 server errors\n2% of requests failed': 'Two of ten requests is 20 percent, not 2. The count is divided by ten and multiplied by 100.',
            '1 server errors\n10% of requests failed': 'There are two codes of 500 or above in the list: the 500 and the 502.',
          },
          hints: [
            'Which codes in the list are 500 or higher?',
            'The 404 is below 500, so it is not counted.',
            'Two server errors out of ten requests, as a percentage, is 20.',
          ],
          explanation: 'The 500 and the 502 are server errors, so there are 2. Two out of ten requests is 20 percent. The 404 is a 4xx, a client-side code, so it is left out. We ran this script and it prints exactly these two lines.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-07-match-1',
          kind: 'match',
          title: 'Which tool answers it?',
          prompt: 'Match each situation to the monitoring tool that helps most.',
          concept: 'choose a monitoring tool',
          labels: { terms: 'Situation', meanings: 'Tool' },
          pairs: [
            { term: 'Customers say the site is down, and you want to know right now, from several places in the world', definition: 'Uptime check', note: 'A check requests your address on a schedule from outside, from several locations.' },
            { term: 'One customer’s order disappeared and you want to follow what the server did for that order', definition: 'Logs', note: 'Logs record what the app did step by step, so you can follow one order.' },
            { term: 'Since yesterday’s release the same crash hits 300 people, and you must choose what to fix first', definition: 'Error tracking', note: 'Error tracking groups identical crashes, counts users, and shows the release they began in.' },
            { term: 'The site goes down at 3 a.m. while you are asleep and someone must be told', definition: 'Alert', note: 'An alert is the part that reaches a person, through a channel you chose.' },
          ],
          hints: [
            'Which situation is about timing and reachability, and which is about one customer’s story?',
            'Counting how many people hit the same crash points to the tool that groups errors.',
            'Who is told when you are asleep? That is the alert.',
          ],
          explanation: 'Each tool fits one question: reachable now (uptime check), what exactly happened (logs), which crash affects most people since which release (error tracking), and who gets woken up (alert).',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-deployment-07-q1',
        prompt: 'Your uptime check opens the home page and always reports success, but customers say checkout is broken. What is the most useful improvement?',
        choices: [
          'Check the home page more often so a failure is noticed sooner',
          'Lower the number of locations the check runs from, to cut down on false alarms',
          'Make the check also request a page that depends on the database, and look for text that proves it worked',
          'Ask customers to refresh their browser, since a cached page is the usual cause of a broken checkout',
        ],
        answer: 2,
        explanation: 'A home page can load while the database is down. A check that exercises something dependent and expects specific content catches the failure customers feel.',
      },
      {
        id: 'ai-deployment-07-q2',
        prompt: 'A page answers 200 but shows nothing. Which check would have caught it?',
        choices: [
          'A check that also requires certain text to be present in the response',
          'A check that only reads the status code',
          'A check that counts how many seconds the server takes before it answers',
          'A check that confirms the certificate has not expired',
        ],
        answer: 0,
        explanation: 'The status code said everything was fine. Only checking content, such as the shop’s name, reveals a blank page.',
      },
      {
        id: 'ai-deployment-07-q3',
        prompt: 'What does a 5xx status code mean?',
        choices: [
          'The visitor typed the address wrong',
          'The address has permanently moved somewhere else',
          'The request was successful and a new item was created',
          'The server failed to handle a request that was valid',
        ],
        answer: 3,
        explanation: 'MDN groups 5xx as server errors: the request was fine, but the server could not complete it. 4xx is the request’s fault; 3xx is a redirect.',
      },
      {
        id: 'ai-deployment-07-q4',
        prompt: 'Which log line is the most useful and the safest?',
        choices: [
          'Customer ana@example.com paid with card 4111111111111111 and token tok_live_abc',
          '09:02 payment failed for order 1042: timeout calling the payment service',
          'Something went wrong',
          '09:02 payment succeeded for the customer who just checked out on the website using the usual payment method',
        ],
        answer: 1,
        explanation: 'It has a time, what happened and to what, with no secrets. The first line logs a card number and a token, the third says nothing useful, and the last is vague about what happened to which order.',
      },
      {
        id: 'ai-deployment-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In the shop comparison, what are logs?',
        choices: [
          'The shop’s diary of what happened and when',
          'The night guard who phones you when the lights go out',
          'The complaints box that sorts notes into piles',
        ],
        answer: 0,
        explanation: 'Logs record events as they happen. The guard is the uptime check, and the sorted complaints are error tracking.',
      },
      {
        id: 'ai-deployment-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Your load balancer’s health check calls an endpoint that also queries the database. The database has a short slowdown. What can happen, and how do you avoid it?',
        choices: [
          'Nothing; deep health checks make a system more reliable in every case, because a deeper check finds problems earlier and every instance is safer for it',
          'The database slows down further because the health checks start to retry on their own',
          'The balancer removes every instance because they all look unhealthy, causing an outage; keep a shallow liveness check separate from deeper dependency checks',
          'The instances restart faster, which is helpful because a restarted instance has fewer problems later on, so no change is needed',
        ],
        answer: 2,
        explanation: 'If every instance fails a dependency-based check at the same time, all are pulled out of rotation and a partial slowdown becomes a full outage. Use a shallow check for routing and deeper checks for alerting.',
      },
    ],
    task: {
      title: 'Build and run your own health check',
      minutes: 18,
      steps: [
        'Save check.mjs from this lesson. Start any small web server (for example `npx serve dist` from lesson 1, or a one-file Node server) and run `node check.mjs http://localhost:PORT/` to see OK.',
        'Stop the server and run it again, then change the text it looks for to something that is not on the page. Compare the three FAIL messages.',
        'Run the monitoring-plan prompt for a project of yours. Write down the one address you would check and the exact text you would expect.',
        'Write a five-line “first five minutes” note for your app: who to tell, what to check first, and where the logs are.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain what “200”, “404” and “500” mean using a shop door as the example. Write one sentence for each in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Define one service-level objective for a service you run (what is measured, over what window, what target) and the alert that would fire when its error budget burns too fast. Say why it pages a person or why it does not.'] },
    ],
  },
  {
    id: 'ai-deployment-08',
    day: 8,
    title: 'Roll back when it goes wrong',
    summary: 'Return the live app to the last version that worked in minutes, know what a rollback cannot undo, and practise before you need it.',
    minutes: 28,
    skills: ['rollback'],
    intro: {
      objectives: [
        'Choose between a platform rollback, a git revert and a fix-forward for a broken release',
        'Run git revert on a shared branch and explain why it is safer than reset',
        'Name what a rollback cannot undo: data, migrations and installed phone apps',
      ],
      why: 'Every team ships a bad version eventually, and AI-made changes make it more likely. What separates a bad ten minutes from a bad day is whether you already know how to go back.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Customers are reporting errors, the monitor from last lesson is shouting, and the cause is probably the change you shipped an hour ago. The calm move is not to find the bug while the app burns. It is to **roll back**: put the live app back on the last version that worked, restore service, and only then investigate. Think of the undo button: you do not ask why before pressing it. The rule is *restore first, understand second*, as long as a recent change is a likely cause. There are three ways to get there, and a good routine knows which one fits.',
      },
      {
        type: 'table',
        headers: ['Way', 'What it does', 'Speed', 'Watch out for'],
        rows: [
          ['Platform rollback', 'Points your live address back at an earlier, already-built deployment, with no new build', 'Seconds to minutes', 'Settings are not rolled back; some platforms pause automatic deploys until you undo the rollback'],
          ['git revert', 'Adds a new commit that cancels an earlier one, then your pipeline deploys it', 'As long as your pipeline takes', 'You must pick the right commit, and merge commits need an extra option'],
          ['Fix forward', 'Write and ship a new fix instead of going back', 'Slowest and riskiest in a crisis', 'Only sensible when the fix is tiny, obvious and testable'],
        ],
        caption: 'Prefer the first two when customers are affected right now.',
      },
      { type: 'heading', text: 'Platform rollbacks' },
      {
        type: 'paragraph',
        text: 'Most platforms keep your earlier deployments, so going back is a button or a command. Vercel’s Instant Rollback points your production domains back at a previous production deployment; its documentation notes that changed environment variables are *not* undone (the old build is restored as it was), that automatic assignment of production domains is turned off afterwards so new pushes do not replace the rolled-back version, and that you undo the rollback by promoting another deployment. Cloudflare Pages lets you roll production back to an earlier successful production deployment, and preview deployments are not valid targets. Google Cloud Run keeps revisions of a service, so you can send traffic back to an earlier one (it can also split traffic, for example sending 1 percent of requests to a new revision first). For an Expo app’s JavaScript updates, `eas update:rollback` can republish an earlier update or send people back to the update embedded in the build.',
      },
      { type: 'heading', text: 'git revert: the safe undo for shared code' },
      {
        type: 'paragraph',
        text: 'Sometimes the fix lives in your code history. `git revert` takes a commit and records a **new** commit that undoes its changes. The history stays honest: the bad commit is still there, followed by the one that cancels it, and nobody’s copy of the project is disturbed. Here is a real run. Someone changed the price of coffee from 12 to 1200 by mistake:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output (Git 2.54; your commit ids and dates will differ)',
        code: `$ git log --oneline
d981fda Update prices
20d0ea5 Add discount
d69911f Prices v1
$ git revert --no-edit HEAD
[main ec3adc7] Revert "Update prices"
 1 file changed, 1 insertion(+), 1 deletion(-)
$ git log --oneline
ec3adc7 Revert "Update prices"
d981fda Update prices
20d0ea5 Add discount
d69911f Prices v1
$ cat prices.js
export const price = { kape: 12, asin: 8 };`,
      },
      {
        type: 'paragraph',
        text: '`HEAD` means “the newest commit”, and `--no-edit` skips the step that opens an editor for the message. Push the new commit and your pipeline deploys the corrected prices. Git’s documentation adds two details worth knowing: a merge commit cannot be reverted without telling Git which side to keep, with `-m 1` for the main line, and reverting a merge means you are saying you never want those changes, so later merges bring in only commits that were not part of it. The tempting alternative, `git reset --hard`, moves the branch backwards and **rewrites history**. On a branch other people have already copied, that creates a mess: the push is rejected, and forcing it can overwrite their work.',
      },
      {
        type: 'warning',
        text: 'Never use git push --force on a shared branch to “undo” a mistake, and never let an AI assistant run it for you. Use git revert, which adds history instead of erasing it.',
      },
      { type: 'heading', text: 'What a rollback cannot undo' },
      {
        type: 'paragraph',
        text: 'A rollback puts back *code*. It cannot put back anything the bad version already did. If it deleted rows or ran a database change, those stay changed; emails already sent stay sent; money already moved stays moved. This is the most common way a rollback fails: you roll the code back, and the old code now meets a database it no longer understands. Vercel’s own rollback screen reminds you that external APIs, databases and content systems may behave differently with the older version. Phone apps are different again: an app a customer has already installed from a store does not go back when you do, so a store release is fixed by shipping a new build (Expo notes that stores reject a version number that has been used), and only JavaScript-level updates can be rolled back with a tool like EAS Update.',
      },
      {
        type: 'list',
        items: [
          '**Make database changes in two steps.** Add the new column first and keep the old one working; remove the old one in a later release, once nothing uses it. Then old and new code both run safely, so a rollback is always possible.',
          '**Keep releases small.** One change per release means one thing to undo.',
          '**Keep a backup you have tested restoring**, because some damage can only be repaired from one.',
          '**Practise.** Roll back a harmless change on a quiet day, so the real one is not your first time.',
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The rollback routine in order. Note that verification comes before the investigation.',
        source: `flowchart TD
  A[Alert: errors after a release] --> B{Could the last release be the cause?}
  B -->|yes| C[Roll back: platform button or git revert]
  B -->|no| H[Investigate with logs and error reports]
  C --> D[Verify: open the site and run the health check]
  D --> E{Healthy again?}
  E -->|no| H
  E -->|yes| F[Tell people, then find the cause]
  H --> G[Fix on a branch, check on a preview, release again]
  F --> G`,
      },
      {
        type: 'prompt',
        label: 'Ask AI what could not be undone by rolling back',
        text: 'Here is the change I am about to release: [paste the pull request summary and the changed files]. Review it only for what a rollback could NOT undo: database migrations or deleted data, emails or messages sent, payments, changed settings or secrets, and anything installed on customers’ phones. For each, tell me the risk and how to make the change reversible. Then write the exact steps I would follow to roll this release back on [host], including how I will verify it worked.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Rolling back is pressing undo and going back to yesterday’s menu because today’s new dish made people sick. You do that first; you work out what went wrong in the kitchen afterwards. `git revert` is a polite undo: instead of tearing a page out of the notebook everyone shares, you write a new line saying “ignore the change on this page”. The old line and the correction are both still there. What undo cannot do is un-serve food: anything the bad version already did to your data or customers stays done, which is why we plan changes so they are easy to reverse.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Rollbackability is a design property, not a button. Use expand-and-contract migrations, keep each deployed version compatible with the schema before and after it, and gate risky behaviour behind flags so you can turn it off without a deploy. Progressive delivery limits the blast radius: Cloud Run’s documentation describes splitting traffic across revisions so a new one can take a small share while you watch the metrics, and a failed health check can trigger the rollback automatically. Know your platform’s semantics: a rollback may reuse the old build with the current configuration or the old one, and may pause automatic promotion (Vercel does, until you promote). Rehearse restores, since a backup you have not restored is a hope.',
      },
      {
        type: 'version',
        text: 'Checked on this date. Vercel’s Instant Rollback documentation says it points production domains at a previous production deployment, does not update environment variables changed in project settings, turns off auto-assignment of production domains afterwards (undone by promoting a deployment), and that on its Hobby plan you can roll back to the previous deployment while Pro and Enterprise can choose any eligible one. Cloudflare Pages documents rollback to an earlier successful production deployment (preview deployments are not valid targets). Cloud Run documents revisions, traffic splitting and rollback to a previous revision. Expo documents eas update:rollback to republish an earlier update or return to the embedded update. Git documents git revert as recording new commits that undo earlier ones, with -m for merge commits and --no-edit to skip the message editor. Platform behaviour and plan limits change often.',
        checked: CHECKED,
        sources: [DOCS.vercelRollback, DOCS.cfRollback, DOCS.cloudRun, DOCS.expoRollback, DOCS.gitRevert],
      },
      {
        type: 'takeaways',
        items: [
          'When a recent release is the likely cause, restore first and understand second: roll back.',
          'A platform rollback points the live address at an earlier build; git revert adds a new commit that cancels a bad one.',
          'Use git revert on shared branches; reset --hard and force pushes rewrite history and can overwrite other people’s work.',
          'A rollback restores code, not data, sent messages, changed settings or apps already installed on phones.',
          'Make changes reversible (two-step database changes, small releases, tested backups) and practise before you need it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-08-predict-output-1',
          kind: 'predict-output',
          title: 'What does the revert leave behind?',
          prompt: 'A repository has three commits: “Prices v1”, “Add discount” and “Update prices”. The last one changed prices.js to `{ kape: 1200, asin: 8 }` by mistake; before it, the file said `{ kape: 12, asin: 8 }`. You run the commands below. What do the last two commands print?',
          concept: 'what git revert does',
          language: 'bash',
          code: `git revert --no-edit HEAD > /dev/null
cat prices.js
git rev-list --count HEAD`,
          expected: 'export const price = { kape: 12, asin: 8 };\n4',
          choices: [
            'export const price = { kape: 1200, asin: 8 };\n3',
            'export const price = { kape: 12, asin: 8 };\n2',
            'export const price = { kape: 12, asin: 8 };\n4',
            'export const price = { kape: 12, asin: 8 };\n3',
          ],
          wrongNotes: {
            'export const price = { kape: 1200, asin: 8 };\n3': 'The revert undoes the mistaken change, so the file goes back to 12, and the revert is itself a commit.',
            'export const price = { kape: 12, asin: 8 };\n2': 'git revert never removes commits. The count goes up, not down.',
            'export const price = { kape: 12, asin: 8 };\n3': 'That would be right for git reset, which moves the branch back. A revert keeps all three commits and adds a fourth.',
          },
          hints: [
            'What does the file contain after the mistaken commit is cancelled?',
            'git revert records a new commit. How many commits are there afterwards?',
            'Three commits plus one revert commit is four; the price is back to 12.',
          ],
          explanation: 'git revert records a new commit that cancels the mistaken change, so the file is back to 12 and the history now has four commits: the three originals and the revert. We ran these exact commands and they print this.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-08-fix-bug-1',
          kind: 'fix-bug',
          title: 'Undoing on a shared branch',
          prompt: 'A bad commit is on main, and your teammates have already pulled it. These commands, suggested by an AI assistant, try to undo it by moving the branch back. Tap the unsafe line, then pick the fix.',
          concept: 'revert instead of reset',
          language: 'bash',
          code: `git log --oneline
git reset --hard HEAD~1
git push origin main`,
          bugLine: 2,
          fixes: [
            { line: 'git revert --no-edit HEAD', correct: true, why: 'This adds a new commit that cancels the bad one, so the push is accepted and nobody’s copy is rewritten.' },
            { line: 'git revert --no-edit HEAD~1', correct: false, why: 'HEAD~1 is the commit before the bad one. This would cancel the wrong change and leave the bad one in place.' },
            { line: 'git reset --soft HEAD~1', correct: false, why: 'A soft reset still moves the branch back and rewrites shared history, so the plain push is rejected as well.' },
            { line: 'git checkout HEAD~1', correct: false, why: 'This leaves you looking at an old commit with no branch, and it does not change main at all.' },
          ],
          hints: [
            'What does reset --hard do to the history that your teammates already copied?',
            'You want an undo that adds to the history instead of removing from it.',
            'git revert on the newest commit, HEAD.',
          ],
          explanation: 'reset rewrites history, and on a branch others have copied the push is rejected or, if forced, overwrites their work. revert adds a new commit that cancels the bad one, which is safe to push and deploy.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-08-scenario-1',
          kind: 'scenario',
          title: 'The rollback that did not fix it',
          prompt: 'Choose your next move.',
          concept: 'rollbacks and databases',
          situation: 'Today’s release renamed a database column from price to amount and changed the code to match. Orders started failing, so you rolled the code back. Orders are still failing, and the logs say: column “price” does not exist.',
          options: [
            { text: 'Restore compatibility first: add the old price column back (or restore the table from a backup), confirm orders work, and from now on change names in two steps.', consequence: 'The older code can run again because the database matches what it expects. The next release adds the new column without removing the old one until nothing uses it.', quality: 'best' },
            { text: 'Roll back once more, in case the first rollback did not take effect.', consequence: 'The code is already the old version. The database is what changed, and repeating a code rollback cannot restore a column.', quality: 'poor' },
            { text: 'Redeploy the new code, since the database already matches it.', consequence: 'The new code may work, but you are back to the release that started the problem without understanding why orders failed in the first place or whether other things depend on the old name.', quality: 'acceptable' },
            { text: 'Ask customers to wait while you rewrite the code from scratch.', consequence: 'A rewrite takes far longer than adding a column back, and it does not change what the database holds.', quality: 'poor' },
          ],
          hints: [
            'What did the release change besides the code?',
            'A rollback restores code only. Which part is now out of step with it?',
            'Make the database match the older code again, then plan two-step changes.',
          ],
          explanation: 'A rollback restores code, not data or structure. The old code needs the old column, so restoring it gets service back, and making changes in two steps (add, then later remove) means the next rollback works.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-08-arrange-1',
          kind: 'arrange',
          title: 'A rollback in order',
          prompt: 'Put the steps of a calm rollback in order.',
          concept: 'rollback routine',
          language: 'text',
          solution: [
            'Confirm that the errors began after the last release',
            'Roll back to the last good deployment',
            'Open the site and run the health check to verify',
            'Tell customers and your team that service is restored',
            'Find the cause on a branch and release a proper fix',
          ],
          reasons: [
            'Rolling back only helps if the release is a plausible cause, so check the timing first.',
            'Restoring service is the priority, and the platform keeps the earlier build ready.',
            'Never assume it worked; the same check that raised the alarm should now pass.',
            'People waiting need to hear that it is over, and the team needs to know what changed.',
            'The proper fix comes last, with time to test it on a preview.',
          ],
          hints: [
            'What must you establish before deciding that a rollback is the right tool?',
            'Verification comes straight after the rollback, before anything else.',
            'Fixing the cause is last, because by then there is no emergency.',
          ],
          explanation: 'Check the timing, roll back, verify, communicate, and fix properly afterwards. Verifying before investigating stops you from wasting an hour on a problem that is already solved, or from missing that it is not.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-deployment-08-q1',
        prompt: 'Errors began right after a release and customers are affected. What do you do first?',
        choices: [
          'Read through every changed file until you have found the bug',
          'Ask the AI to rewrite the feature so the problem disappears',
          'Wait an hour in case the errors clear up on their own',
          'Roll back to the last good version, then investigate',
        ],
        answer: 3,
        explanation: 'Restore service first when a recent release is a likely cause. Investigation is calmer, and better informed, once customers are no longer affected.',
      },
      {
        id: 'ai-deployment-08-q2',
        prompt: 'Why is git revert safer than git reset --hard on a branch other people use?',
        choices: [
          'It runs faster because it only touches one file',
          'It records a new commit that cancels the bad one, so nobody’s copy of the history is rewritten',
          'It is the only command that works with GitHub',
          'It deletes the bad commit from every copy of the project at the same time, so there is nothing left to cause trouble',
        ],
        answer: 1,
        explanation: 'revert adds history instead of erasing it, so shared copies stay compatible. reset --hard moves the branch backwards, which collides with copies that still have the removed commits.',
      },
      {
        id: 'ai-deployment-08-q3',
        prompt: 'Which of these can a code rollback NOT undo?',
        choices: [
          'Rows that the bad release deleted from the database, and emails it already sent',
          'A wrong colour on the checkout button',
          'A typo in the page title',
          'A broken link in the footer that was added in the last release',
        ],
        answer: 0,
        explanation: 'A rollback restores code. Data that was removed and messages that were sent are effects in the world, so they stay as they are.',
      },
      {
        id: 'ai-deployment-08-q4',
        prompt: 'Why make a database change in two releases, adding the new column first and removing the old one later?',
        choices: [
          'Because databases can only be changed on Fridays, when schema changes are allowed to run outside office hours',
          'Because it makes the database smaller, since every column that is removed makes the file on disk quicker to search',
          'So both the old code and the new code work with the database at every point, which keeps rollback possible',
          'Because the host charges more for a change that is made in only a single release',
        ],
        answer: 2,
        explanation: 'While both columns exist, old and new versions run safely. If the new release must be rolled back, the old code still finds the column it needs.',
      },
      {
        id: 'ai-deployment-08-q5',
        audience: { max: 'beginner' },
        prompt: 'In the undo-button comparison, which sentence is true?',
        choices: [
          'Undo also takes back every meal that was already served',
          'Undo brings back yesterday’s menu, but it cannot un-serve food a customer already ate',
          'Undo only works if you first work out what went wrong in the kitchen',
        ],
        answer: 1,
        explanation: 'A rollback restores the earlier version, not the effects the bad version already had on data and customers.',
      },
      {
        id: 'ai-deployment-08-q6',
        audience: { min: 'advanced' },
        prompt: 'You want to limit the damage of a risky release on a platform that can split traffic between revisions. What is the best approach?',
        choices: [
          'Send all traffic to the new revision at once, so that every customer sees the same version and a problem shows up sooner',
          'Test the release only in a preview, then send everything live without watching, assuming that what worked in a preview will work for everyone',
          'Keep the old revision turned off so there is only one version to look after',
          'Send a small share of traffic to the new revision, watch error rates and latency, and widen or revert the split based on the data',
        ],
        answer: 3,
        explanation: 'A gradual rollout limits how many people a bad release can hurt, and keeps the old revision ready to receive traffic again. Sending everything at once or removing the old revision removes that safety.',
      },
    ],
    task: {
      title: 'Practise a revert in a scratch repository',
      minutes: 18,
      steps: [
        'Create a scratch Git repository with three commits like the lesson’s (prices, a discount file, then a bad price change). Run `git log --oneline` and note the commit ids.',
        'Run `git revert --no-edit HEAD`, then `cat prices.js` and `git rev-list --count HEAD`. Check that the price is back and that the count went up.',
        'Write a one-page rollback note for a real or imagined app: where the rollback button or command is, the exact steps, how you will verify, and who you will tell.',
        'Run the “what could not be undone” prompt on a change of yours and write down its biggest irreversible risk.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant: “Explain rollback and git revert using an undo button and a shared notebook as the examples.” Rewrite its explanation in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Take one real migration and rewrite it as expand-and-contract, listing the versions of code that must work at each step. Then revert a merge commit in a scratch repository with `git revert -m 1` and describe what a later re-merge of that branch will and will not bring back.'] },
    ],
  },
  {
    id: 'ai-deployment-09',
    day: 9,
    title: 'Project: take an app live with a safe release routine',
    summary: 'Put a real app live over HTTPS, and write the checklist, the instructions and the rollback steps that keep every later release safe.',
    minutes: 30,
    skills: ['release-routine', 'deploy-concepts', 'manage-secrets', 'ci-cd', 'rollback'],
    intro: {
      objectives: [
        'Take one app from your laptop to a live HTTPS address with its settings, checks and preview in place',
        'Prove that you can roll a release back, by doing it once on purpose',
        'Write a release routine and an instructions file that an AI assistant and a teammate can both follow',
      ],
      why: 'A deployment you have done once is luck; a routine you have written, tested and can hand to someone else is a skill. This project leaves you with a live app and the habits that keep it live.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'This is the course project. You will take **one real app** live, either Ate Lorna’s store from lesson 1 or something of your own, and finish with a short, written **release routine**: what you do before every release, how you know it broke, and exactly how you undo it. Nothing here is new. Each step uses one lesson, and the proof you keep for each step is what a client or a teammate would want to see. Work in order, and keep a note of every command you ran and every setting you changed, because your final document is made from those notes.',
      },
      {
        type: 'table',
        headers: ['Step', 'From lesson', 'The proof to keep'],
        rows: [
          ['Choose the kind of host and write down why', '2', 'A five-line decision note'],
          ['Move every secret and setting out of the code', '3', '.env.example with names only, a missing-variable check, settings entered in the host'],
          ['Deploy and open it on your phone', '1 and 4', 'The live address, and a screenshot of the padlock'],
          ['Make every push run the checks', '5', 'A passing workflow run, and the linter output for your workflow file'],
          ['Ship one change through a preview', '6', 'The pull request, the preview link and your filled-in checklist'],
          ['Add a health check and an alert plan', '7', 'The check’s output when healthy and when broken, and a note on who is told'],
          ['Break it on purpose and roll it back', '8', 'Before and after outputs, and the time it took'],
          ['Write the release routine', 'all', 'RELEASE.md in the repository'],
        ],
        caption: 'The project in eight steps. Each row is one lesson put to work.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The routine you are building. Every box is something you have already done once in this course.',
        source: `flowchart LR
  A[Branch and change] --> B[Push and open pull request]
  B --> C[Checks and preview]
  C --> D{Reviewed on a phone?}
  D -->|no| A
  D -->|yes| E[Merge to main]
  E --> F[Automatic deploy]
  F --> G[Health check and alert]
  G -->|broken| H[Roll back]
  G -->|healthy| I(Done: note it in the log)
  H --> A`,
      },
      { type: 'heading', text: 'The release routine you will write' },
      {
        type: 'code',
        language: 'markdown',
        label: 'RELEASE.md: a starting point (fill every line with your real names, addresses and commands)',
        code: `# Releasing Ate Lorna's Store

## What is live
- Address: https://...
- Host and kind of hosting: ...
- Settings live in: the host's settings page (names are listed in .env.example)

## Before every release
- [ ] Change made on a branch, never on main
- [ ] Tests and build pass (the pull request shows green)
- [ ] Preview opened on a phone, changed flow tried, two sad paths tried
- [ ] Preview uses test data and test keys
- [ ] I read the list of changed files and every file belongs to the change
- [ ] I know what a rollback of this change could NOT undo

## How to release
Merge the pull request into main. The pipeline deploys.

## How I know it broke
- Health check: node check.mjs https://... (exit 0 means healthy)
- Alert goes to: ...
- Logs are at: ...

## How to roll back
1. Confirm errors began after the last release.
2. Platform rollback: ... (or) git revert --no-edit <commit>, then push.
3. Verify with the health check.
4. Tell: ...

## Last rollback drill
Date: ... Time it took: ... Notes: ...`,
      },
      {
        type: 'paragraph',
        text: 'The second thing to write is for your AI assistants. A coding agent will happily push to the main branch, create a paid service or paste a key into a file if nothing tells it not to. An **instructions file** (`CLAUDE.md` for Claude Code, `AGENTS.md` for Codex) is read at the start of each session. Both tools’ documentation say the same important thing, though: these files are *context*, not enforcement. Claude Code’s documentation says it treats them as context rather than enforced configuration, and that to block an action regardless of what it decides you need a hook; the more specific and concise the rules, the more consistently they are followed. So write the rules, and also enforce the ones that matter with settings the agent cannot change, such as branch protection and required reviewers on the production environment.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'A deployment section for CLAUDE.md or AGENTS.md',
        code: `## Deployment rules
- Never write a secret, token or password in any file. Read settings from environment variables and add each new name to .env.example.
- Work on a branch. Never push to main. Never use git push --force or git reset --hard on a shared branch.
- Stop and ask me before changing hosting, DNS or secrets, and never create a paid service.
- Run npm test and npm run build before saying a change is ready, and show me the output.
- If a release breaks the site, propose a rollback first (platform rollback or git revert). Do not try to fix forward.
- With every change, tell me what a rollback could not undo: data, migrations, emails sent, settings.`,
      },
      {
        type: 'prompt',
        label: 'Make AI play a sceptical on-call engineer',
        text: 'Act as a sceptical engineer who is on call for this app tonight. Here is my RELEASE.md and my workflow file: [paste them]. Find the five most likely ways my routine would fail at 3 a.m.: steps that depend on something only I know, secrets I could lose access to, checks that would pass on a broken app, anything a rollback could not undo, and anything vague in my instructions file. For each, tell me the smallest change that fixes it. Do not rewrite my files; list the problems and wait.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**Start small.** One page, one host and one change is a complete project. If you choose a static site (like the store from lesson 1) on a static host, there are no servers, no database and nothing to keep running, so you can finish the whole routine in an afternoon. Ask an AI assistant to explain each step before you do it, and ask it to check your notes afterwards. The notes are your real work: they are what you will follow the next time. If a step uses a word you do not know, stop and ask what it means; being able to say the five pieces of a deployment from lesson 1 in your own words is the real test that you understand it.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Run the release itself through a coding agent under your written rules, and keep the evidence: the plan it proposed before touching anything, the diffs you reviewed, the checks it ran, which actions needed your approval, and the moments it tried to do something the rules forbid. That log, more than the app, is what shows professional judgement about delegated work. Then measure the routine. DORA’s delivery metrics (change lead time, deployment frequency, failed deployment recovery time and change fail rate) give you honest numbers for it: time your rollback drill and record it as your recovery time, and treat anything you cannot measure as a gap in the routine.',
      },
      {
        type: 'version',
        text: 'Checked on this date. Claude Code’s documentation says CLAUDE.md files are loaded at the start of every session, that they are treated as context and not enforced configuration (use a hook to block an action), and that more specific, concise instructions are followed more consistently; it can also read a repository’s AGENTS.md. Codex’s documentation says it reads AGENTS.md files before doing any work, from the project root down to the working directory, and builds the instruction chain once at startup. DORA describes change lead time, deployment frequency, failed deployment recovery time, change fail rate and deployment rework rate as its software delivery metrics. File names and loading rules differ between tools and change often.',
        checked: CHECKED,
        sources: [DOCS.ccMemory, DOCS.codexAgentsMd, DOCS.doraMetrics],
      },
      {
        type: 'takeaways',
        items: [
          'A routine you have written and tested is a skill; a deployment you did once is luck.',
          'The project uses every lesson: host choice, secrets, domain and HTTPS, automatic checks, a preview, a health check and a rollback you have really done.',
          'RELEASE.md holds the checklist, the way to tell it broke, and the exact rollback steps, so anyone can follow it.',
          'An instructions file asks an AI agent to follow your rules; branch protection and required reviewers enforce the ones that matter.',
          'Prove the routine by using it: ship one change through a preview, then break it on purpose and roll it back.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-09-match-1',
          kind: 'match',
          title: 'What is each piece of evidence for?',
          prompt: 'A reviewer looks at your repository. Match each piece of evidence to the question it answers.',
          concept: 'proof of a safe release routine',
          labels: { terms: 'Evidence in your repository', meanings: 'The question it answers' },
          pairs: [
            { term: '.env.example with names only, and a startup check that names a missing variable', definition: 'Can the app run somewhere else without secrets leaking into the code?', note: 'Names without values let others set up the app safely, and the check makes a missing setting obvious.' },
            { term: 'A workflow run that failed on a broken change and a later one that passed', definition: 'Does a machine stop a broken change before it ships?', note: 'A failing run that blocked a bad change shows the automatic checks really work.' },
            { term: 'A pull request with a preview link and a filled-in checklist', definition: 'Was the change used and reviewed live before customers saw it?', note: 'The preview and checklist show the change was tried as a customer would.' },
            { term: 'A drill log with the health check’s output before, during and after a rollback', definition: 'Have you proven that you can undo a release quickly?', note: 'A recorded drill with timings is proof the rollback steps really work.' },
            { term: 'An alert that you tested by breaking the health check on purpose', definition: 'Will you hear about a failure before your customers do?', note: 'An alert you have seen fire is the only kind you can trust at 3 a.m.' },
          ],
          hints: [
            'Read the evidence, then ask which risk it removes.',
            'The drill log and the tested alert are both about time: undoing a release, and finding out in time.',
            'Names without values go with keeping secrets out of the code.',
          ],
          explanation: 'Each artefact is proof of one claim: safe settings, automatic checks, a reviewed preview, a rollback you have done, and an alert you have seen work. A routine is trustworthy when each claim has proof.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-09-arrange-1',
          kind: 'arrange',
          title: 'A release day, in order',
          prompt: 'Put the steps of one release of your app in the right order.',
          concept: 'the release routine',
          language: 'text',
          solution: [
            'Create a branch and make the change on it',
            'Push the branch and review the preview with the checklist',
            'Merge to main once the checks pass, so the pipeline deploys',
            'Run the health check against the live address',
            'If it fails, roll back first and then investigate',
          ],
          reasons: [
            'Changes start on a branch so main, and the live app, stay as they were.',
            'The preview is where you try the change as a customer, before it is live.',
            'Merging is the step that makes the change live, so it waits for the review and the checks.',
            'You verify the live app yourself rather than assuming the deploy worked.',
            'If something is wrong, restoring service comes before understanding the cause.',
          ],
          hints: [
            'Which step makes the change reach customers, and what must come before it?',
            'You cannot check the live address until the pipeline has deployed.',
            'Branch, preview and review, merge, check live, and roll back only if needed.',
          ],
          explanation: 'Branch, preview and review, merge and deploy, check live, then roll back if needed. The same order your RELEASE.md describes.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-deployment-09-scenario-1',
          kind: 'scenario',
          title: 'The agent that wants to skip the routine',
          prompt: 'Choose how you respond.',
          concept: 'enforcing release rules',
          situation: 'You tell a coding agent: “Fix the price on the menu page.” It finishes in a minute and says: “This is a tiny change, so I pushed it straight to main and deployed it. Skipping the preview saved time.” Your instructions file says never to push to main.',
          options: [
            { text: 'Check the live page now, revert the commit if anything is wrong, then turn on branch protection so main cannot be pushed to directly, and tighten the instructions.', consequence: 'You confirm what happened, you can undo it quickly, and a setting the agent cannot change now enforces the rule, instead of only asking for it.', quality: 'best' },
            { text: 'Say well done: it was a small change and it saved time.', consequence: 'The rule you wrote is now a suggestion. Next time the “small change” may be a larger one, and nothing will stop it.', quality: 'poor' },
            { text: 'Add “IMPORTANT, ALWAYS” in capital letters to the instructions file and carry on.', consequence: 'Instructions are read as context, not enforced. Emphasis may help, but only a setting like branch protection stops a push.', quality: 'acceptable' },
            { text: 'Stop using coding agents for anything that touches deployment.', consequence: 'You avoid the risk but also lose the help, when a protected branch and a clear routine would let you keep both.', quality: 'poor' },
          ],
          hints: [
            'The agent broke a written rule. What does an instructions file actually guarantee?',
            'Check the result first, then think about how to make the rule enforceable.',
            'Branch protection is a setting the agent cannot override.',
          ],
          explanation: 'An instructions file asks; a protected branch enforces. Verify the live result, be ready to revert, and move the important rule from a request into a setting.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-deployment-09-q1',
        prompt: 'Which description best fits the proof that you can roll back?',
        choices: [
          'The notes say “roll back using the platform button” and nothing else',
          'A recorded drill: you shipped a harmless change, rolled it back, and kept the before and after check output with the time it took',
          'A screenshot of the platform’s rollback page that you took without pressing the button',
          'A message from the AI assistant saying that rollbacks are straightforward on your platform',
        ],
        answer: 1,
        explanation: 'Only something you have actually done and measured proves a rollback works. Notes, screenshots and an assistant’s reassurance all describe it without doing it.',
      },
      {
        id: 'ai-deployment-09-q2',
        prompt: 'Why is branch protection a better guard than a rule in CLAUDE.md or AGENTS.md alone?',
        choices: [
          'A setting on the repository enforces the rule even when an agent ignores the instructions, because the instructions are only context',
          'Instruction files are never read by coding agents, because they are written only for human readers and never loaded by tools',
          'Branch protection makes the AI assistant write better code, because it limits the repository to the assistant alone',
          'Instruction files are deleted by the agent at the end of every session',
        ],
        answer: 0,
        explanation: 'Claude Code’s documentation says instruction files are context, not enforced configuration. A protected branch blocks the push no matter what the agent decides.',
      },
      {
        id: 'ai-deployment-09-q3',
        prompt: 'Which item belongs in RELEASE.md?',
        choices: [
          'Your registrar password, so that anyone on call can sign in quickly',
          'The production database key, written out in full so nobody wastes time looking it up',
          'Your private notes on which customers have complained in the past',
          'The exact steps to roll back, and the address and command of the health check',
        ],
        answer: 3,
        explanation: 'RELEASE.md is read by whoever is on call, so it holds steps and commands, not secrets. Where the secrets live belongs in it; the secrets themselves never do.',
      },
      {
        id: 'ai-deployment-09-q4',
        prompt: 'You finish every step but never break anything on purpose. What is missing?',
        choices: [
          'Nothing; a routine only needs to be written down to be trusted',
          'A bigger hosting plan, since a routine without a rollback drill is only a problem on a small plan',
          'Evidence that the rollback and the alert really work, because a step you have never exercised is a guess',
          'More colours on the preview',
        ],
        answer: 2,
        explanation: 'Drills turn written steps into known facts. Breaking a harmless change on purpose and undoing it shows both the rollback and the alert work.',
      },
      {
        id: 'ai-deployment-09-q5',
        audience: { max: 'beginner' },
        prompt: 'What is the best first project for someone new to deployment?',
        choices: [
          'A small static site on a static host, with every step written down',
          'A large app with a database, many users and its own servers',
          'An app that is already live with customers, so the stakes are real',
        ],
        answer: 0,
        explanation: 'A static site has the fewest moving parts, so you can learn the whole routine without being overwhelmed. Complexity can come in later projects.',
      },
      {
        id: 'ai-deployment-09-q6',
        audience: { min: 'advanced' },
        prompt: 'You time your rollback drill and it took 14 minutes, mostly finding the right commit. Which DORA metric does this inform, and what is a sensible improvement?',
        choices: [
          'Deployment frequency; deploy less often so there is less to roll back, since fewer deployments always mean shorter recovery for the team',
          'Failed deployment recovery time; use a platform rollback to the previous deployment and write the exact command in RELEASE.md',
          'Change lead time; add a manual approval step before every rollback, so that a person signs every change off before it reaches production',
          'Deployment rework rate; hide failed deployments from the dashboard',
        ],
        answer: 1,
        explanation: 'How long it takes to recover from a failed deployment is the failed deployment recovery time. Time lost searching suggests a prepared, single-step rollback documented in advance.',
      },
    ],
    task: {
      title: 'Start the project and write your routine',
      minutes: 20,
      steps: [
        'Pick your app (the store from lesson 1 is fine) and write the five-line host decision note from lesson 2.',
        'Create RELEASE.md from the template and fill in every line you can already answer. Mark the rest with TODO.',
        'Add the “Deployment rules” section to your project’s CLAUDE.md or AGENTS.md.',
        'Run the “sceptical on-call engineer” prompt on your draft and write down the two problems it finds that you will fix first.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Read your RELEASE.md aloud to a friend or an AI assistant and ask: “Could you follow this without asking me anything?” Fix every place where the answer is no.'] },
      { audience: { min: 'advanced' }, steps: ['Enable branch protection on main and a required reviewer on the production environment. Then ask an agent to push a trivial change directly to main and keep the refusal as evidence that the rule is enforced.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'ai-deployment-p1',
    title: 'Take an app live with a safe release routine',
    summary: 'Put one real app live over HTTPS with its settings kept out of the code, automatic checks, a preview, a health check and a rollback you have actually done, then write the routine down.',
    outcome: 'A live app and a repository that prove you can deploy safely: settings kept secret, checks on every change, a reviewed preview, a monitored address and a rollback you have timed.',
    unlockAfterDay: 8,
    steps: [
      { id: 'ai-deployment-p1-s1', text: 'Choose your app (Ate Lorna’s store from lesson 1, or your own) and write a five-line decision note: the kind of hosting you chose, the product, why, what you must look after, and what would make you change your mind.' },
      { id: 'ai-deployment-p1-s2', text: 'Put the project in a Git repository. Move every secret and setting out of the code: a .gitignore that includes .env, a .env.example with names only, and a startup check that stops with the variable’s name if one is missing. Enter the real values in the host’s settings.' },
      { id: 'ai-deployment-p1-s3', text: 'Deploy it and open the live address on your phone. Screenshot the padlock. If you own a domain, connect it by adding the records your host asks for and add both the www and bare names.' },
      { id: 'ai-deployment-p1-s4', text: 'Make every push run the checks: a GitHub Actions workflow (or your host’s Git integration plus a workflow for tests) that runs the tests and the build on pull requests and on main, and deploys only from main. Run actionlint on the file and run its commands locally first.' },
      { id: 'ai-deployment-p1-s5', text: 'Ship one visible change through a branch and a pull request. Open the preview on a phone, fill in the lesson 6 checklist (changed flow, two sad paths, test data), then merge.' },
      { id: 'ai-deployment-p1-s6', text: 'Write a health check script like check.mjs for your live address, with a content check. Run it healthy, then break it on purpose and keep both outputs. Set up an uptime check or a scheduled run, and write down who is told and how.' },
      { id: 'ai-deployment-p1-s7', text: 'Do a rollback drill. Ship a harmless but visible change, then undo it with a platform rollback or git revert --no-edit. Keep the check output before, during and after, and the time it took.' },
      { id: 'ai-deployment-p1-s8', text: 'Write RELEASE.md from the lesson 9 template with your real addresses, commands and rollback steps, and add the Deployment rules section to CLAUDE.md or AGENTS.md. Put the live address at the top of your README.' },
      { id: 'ai-deployment-p1-s9', audience: { max: 'beginner' }, text: 'Use a small static site on a static host, and a custom domain is optional. Before each step, ask an AI assistant to explain it in plain words, and write each explanation in your own words in your notes. The health check may be a manual command you run by hand.' },
      { id: 'ai-deployment-p1-s10', audience: { min: 'intermediate', max: 'intermediate' }, text: 'Include at least one server-side setting read from an environment variable with a different value for preview and production, and at least one automated test that your workflow runs and that you have seen fail.' },
      { id: 'ai-deployment-p1-s11', audience: { min: 'advanced' }, text: 'Use an existing codebase of yours. Add branch protection on main and a required reviewer on the production environment, pin third-party actions, scope each job’s permissions, make one schema change in expand-and-contract steps, and record your rollback time against a recovery target.' },
    ],
    submission: {
      kind: 'url',
      label: 'Repository link',
      placeholder: 'https://github.com/yourname/lorna-store',
      hint: 'A repository whose README starts with the live address, with RELEASE.md, .env.example, the workflow file, the health check, your decision note and the drill log with its check outputs and timing.',
    },
    rubric: [
      'The app is live over HTTPS and opens on a phone, and the README gives the address.',
      'No secret appears in any file or in the Git history, settings are read from environment variables, and a missing one stops the app with its name.',
      'Every pull request runs tests and a build, and deploys happen only from main; the workflow file passes a linter or has been reviewed line by line.',
      'One change went through a preview with a filled-in checklist, and the preview used test data.',
      'A health check with a content test exists, and a rollback drill is documented with before and after output and the time taken.',
      'RELEASE.md lets someone else release and roll back without asking you anything.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The notes explain each step in the learner’s own words and name the five pieces of the deployment.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['Preview and production use different settings, and an automated test was shown failing and then passing in the pipeline.'] },
      { audience: { min: 'advanced' }, items: ['Branch protection and a required reviewer enforce the rules, third-party actions are pinned, and a schema change was released in two reversible steps.', 'The rollback time is measured against a stated recovery target, with a note on how it could be shortened.'] },
    ],
  },
  {
    id: 'ai-deployment-p2',
    title: 'Your release kit',
    summary: 'Write the checklist, the instructions-file rules and the three prompts you will use for every future release, and test them on a real change.',
    outcome: 'A reusable release kit that makes any AI assistant or teammate deploy your way: proof that you turned a course into a working habit.',
    unlockAfterDay: 8,
    steps: [
      { id: 'ai-deployment-p2-s1', text: 'Write a one-page personal release checklist in your own words: before a release, how you know it broke, how you roll back, and what a rollback cannot undo.' },
      { id: 'ai-deployment-p2-s2', text: 'Write the Deployment rules section for CLAUDE.md or AGENTS.md for a real project of yours, and commit it. Mark each rule as either “asked” or “enforced by” a setting.' },
      { id: 'ai-deployment-p2-s3', text: 'Write three prompt templates with blanks: the “what only works on my machine” prompt, the “what could a rollback not undo” prompt and the “sceptical on-call engineer” prompt. Use each on a real change and note one thing it caught.' },
      { id: 'ai-deployment-p2-s4', audience: { min: 'advanced' }, text: 'Add the enforcement for your “asked” rules: a protected branch, a required reviewer or a pre-merge check, and show one case where it stopped something.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your release kit',
      placeholder: 'Paste your checklist, your instructions-file rules and your three prompt templates, with one example of each used on a real change.',
      hint: 'The checklist, the rules (each marked asked or enforced), three templates with blanks, and a short note on what each one caught.',
    },
    rubric: [
      'The checklist covers preparing a release, noticing a failure, rolling back and what a rollback cannot undo.',
      'The rules are short and specific, hold no secrets, and say which are enforced by a setting and which are only requested.',
      'Each of the three templates is reusable, with clear blanks, and was tried on a real change.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The checklist uses plain words the learner can follow without looking anything up.'] },
      { audience: { min: 'advanced' }, items: ['At least one rule is enforced by a setting, with evidence that it blocked an action.'] },
    ],
  },
];

export const aiDeploymentCourse: Course = {
  id: 'ai-deployment',
  kind: 'standard',
  title: 'AI-Assisted Deployment',
  level: 'intermediate',
  tagline: 'Get your AI-built app live, safely: hosting, secrets, domains, deploys and rollbacks.',
  description:
    'An app that only runs on your laptop is a draft. In this course you take an AI-built app live: you choose where it should live, keep its secrets out of the code, give it a domain and HTTPS, make every change test and deploy by itself, review changes on previews, and learn how to find out when it breaks and how to roll it back. You finish with a live app and a written release routine.',
  finishLine: [
    'A real app live over HTTPS, with its settings and secrets kept out of the code',
    'An automatic pipeline that tests every change and deploys only from main',
    'A health check, an alert plan and a rollback you have really done and timed',
    'A release routine and an instructions file that an AI assistant and a teammate can both follow',
  ],
  objectives: [
    'Explain what deploying means and name the five pieces of a deployment',
    'Choose a kind of hosting that fits what an app is, and challenge an over-built recommendation',
    'Keep secrets out of code and respond correctly when one leaks',
    'Connect a domain with the right DNS records and explain what HTTPS proves',
    'Check an AI-written workflow with a linter and by running its steps before trusting it',
    'Monitor a live app and roll a bad release back safely',
  ],
  audiences: ['builder', 'career-changer', 'experienced-dev', 'fresh-grad'],
  skills: [
    { id: 'deploy-concepts', label: 'What deploying means' },
    { id: 'choose-hosting', label: 'Choosing the right kind of hosting' },
    { id: 'manage-secrets', label: 'Environment variables and secrets' },
    { id: 'domains-https', label: 'Domains, DNS and HTTPS' },
    { id: 'ci-cd', label: 'Automatic checks and deploys' },
    { id: 'preview-deploys', label: 'Preview deployments' },
    { id: 'monitoring', label: 'Monitoring and alerts' },
    { id: 'rollback', label: 'Rolling back a release' },
    { id: 'release-routine', label: 'A written release routine' },
  ],
  lessons,
  projects,
  icon: 'rocket_launch',
  updated: '2026-11-14',
};
