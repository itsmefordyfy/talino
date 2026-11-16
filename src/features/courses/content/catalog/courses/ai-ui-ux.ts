import type { Course, Lesson, Project } from '../../types';

const CHECKED = '2026-11-14';

/**
 * Official pages cited by more than one version note (each was opened on CHECKED, except where a note says otherwise).
 * The running example is a fictional booking app, Kalinga Family Clinic in Naga City. Its pages were built and measured while
 * writing this course: a representative first draft (the kind of page a quick prompt produces) and an improved version were
 * written as plain HTML and CSS, loaded in Chrome 158 (headless, through Playwright) at 320, 390, 768 and 1280 CSS pixels, and
 * every width, contrast ratio, tap-target size and keyboard result quoted in the lessons was measured from those pages.
 * Contrast ratios use the WCAG 2.2 formula, computed by a script. React 19.3.1 rendered the component example to static markup.
 * The two pages were written for this course, not copied from one AI tool's output: a real tool's draft will differ in detail.
 */
const DOCS = {
  wcagNew: { label: 'W3C: What\'s New in WCAG 2.2', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/' },
  wcagContrast: { label: 'W3C: Understanding SC 1.4.3 Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html' },
  wcagNonText: { label: 'W3C: Understanding SC 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html' },
  wcagTarget: { label: 'W3C: Understanding SC 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html' },
  wcagReflow: { label: 'W3C: Understanding SC 1.4.10 Reflow', url: 'https://www.w3.org/WAI/WCAG22/Understanding/reflow.html' },
  wcagFocusVisible: { label: 'W3C: Understanding SC 2.4.7 Focus Visible', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html' },
  wcagFocusObscured: { label: 'W3C: Understanding SC 2.4.11 Focus Not Obscured (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html' },
  wcagErrors: { label: 'W3C: Understanding SC 3.3.1 Error Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html' },
  wcagStatus: { label: 'W3C: Understanding SC 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html' },
  wcagColour: { label: 'W3C: Understanding SC 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html' },
  wcagInfo: { label: 'W3C: Understanding SC 1.3.1 Info and Relationships', url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html' },
  mdnViewport: { label: 'MDN: Viewport meta element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport' },
  mdnRepeat: { label: 'MDN: repeat() (auto-fit and auto-fill)', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/repeat' },
  mdnVars: { label: 'MDN: Using CSS custom properties (variables)', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties' },
  mdnFocusVisible: { label: 'MDN: :focus-visible', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible' },
  mdnReducedMotion: { label: 'MDN: prefers-reduced-motion', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
  mdnLabel: { label: 'MDN: The label element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label' },
  mdnStatus: { label: 'MDN: ARIA status role', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role' },
  mdnAlert: { label: 'MDN: ARIA alert role', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role' },
  mdnBusy: { label: 'MDN: aria-busy', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy' },
  reactComponent: { label: 'React docs: Your first component', url: 'https://react.dev/learn/your-first-component' },
  reactProps: { label: 'React docs: Passing props to a component', url: 'https://react.dev/learn/passing-props-to-a-component' },
  claudeVision: { label: 'Claude API docs: Vision', url: 'https://platform.claude.com/docs/en/build-with-claude/vision' },
  cursorPrompting: { label: 'Cursor docs: Prompting agents (image input)', url: 'https://cursor.com/docs/agent/prompting' },
  v0Screenshots: { label: 'v0 docs: Screenshots and Files', url: 'https://v0.app/docs/screenshots' },
  v0Figma: { label: 'v0 docs: Figma', url: 'https://v0.app/docs/figma' },
  lovableImages: { label: 'Lovable docs: Work with Lovable in the project chat (images)', url: 'https://docs.lovable.dev/tips-tricks/using-images' },
  openaiFiles: { label: 'OpenAI Help Center: Uploading files and audio to ChatGPT', url: 'https://help.openai.com/en/articles/8555545-file-uploads-faq' },
} as const;

const lessons: Lesson[] = [
  {
    id: 'ai-ui-ux-01',
    day: 1,
    title: 'Describing a design so AI can build it',
    summary: 'Turn "make a clinic booking app" into a five-part brief with limits you can measure, and see what the difference does to a real screen.',
    intro: {
      objectives: [
        'Write a five-part design brief for one screen',
        'Turn a vague wish into constraints you can measure',
        'Spot what a first AI draft got wrong by measuring it instead of admiring it',
      ],
      why: 'AI builds exactly what you describe, and an interface that looks fine in a chat window can still fail on a customer\'s phone. A short brief with checkable limits is the cheapest way to get a screen people can actually use.',
    },
    minutes: 25,
    skills: ['describe-design'],
    body: [
      { type: 'paragraph', text: "Ask an AI tool for \"a clinic booking app\" and you usually get something that looks fine for ten seconds. Then you look closer. The text is faint grey, the buttons are small, three doctor cards are squeezed side by side, and the page scrolls sideways on a phone. The tool did not fail. It built an average clinic app, because \"average\" is all your request described. This course is about directing AI to build interfaces and judging what comes back. You will not study design theory. You will learn what to say, what to measure and what to ask for next." },
      { type: 'heading', text: 'The running example' },
      { type: 'paragraph', text: "Every lesson uses one product: a booking app for Kalinga Family Clinic, an invented clinic in Naga City. Patients pick a doctor, choose a time and confirm their details, mostly on phones. There are three screens: Find a doctor, Book a time and My appointments. Every number in these lessons was measured by loading the real pages in Chrome 158 at the screen widths named. The first draft and the improved version were written for this course the way a quick prompt typically goes wrong and then right. A real tool's draft will differ in the details, but the weaknesses are common ones." },
      { type: 'heading', text: 'The five parts of a design brief' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Audience:** who uses this screen, on what device and in what situation. \"Parents in a waiting room, one hand free, patchy signal\" is a design decision. \"Patients\" is not.',
          '**Goal of the screen:** the one thing a person should finish here, such as \"book a visit in under a minute\".',
          '**Mood:** two or three words for how it should feel, plus one or two for what it must not feel like (\"calm, clear, not clinical-cold\").',
          '**Constraints:** limits you can check: screen widths, smallest text size, contrast ratio, tap size, the tools to use, and the real content (names, prices, hours).',
          '**References:** one or two examples of what good feels like. The next lesson covers how to use them.',
        ],
      },
      {
        type: 'table',
        headers: ['Part', 'A weak version', 'A stronger version'],
        rows: [
          ['Audience', 'Patients', 'Parents booking a child\'s visit from a phone, one-handed, often on mobile data'],
          ['Goal', 'A good booking experience', 'Pick a doctor and a time, and confirm, in under a minute'],
          ['Mood', 'Modern and professional', 'Calm and friendly, plain words, not cold or hospital-grey'],
          ['Constraints', 'Make it accessible and responsive', 'Text 16 px or larger, contrast at least 4.5:1, buttons at least 44 px tall, works at 320 px wide'],
          ['References', 'Like the big apps', 'The way one well-known booking app shows one action per doctor'],
        ],
        caption: 'The stronger version gives the AI decisions it would otherwise guess.',
      },
      { type: 'heading', text: 'Constraints are the part you can check' },
      { type: 'paragraph', text: "Adjectives such as clean, modern and user-friendly cannot be checked, so they cannot be wrong, and they do not steer the result. A number can be checked. \"Make it accessible\" is a wish; \"every button at least 44 px tall, text contrast at least 4.5:1, nothing scrolls sideways at 320 px, every control reachable with the Tab key\" is something you can test in a minute. When you write constraints as numbers, you also hand yourself the review checklist for the result." },
      { type: 'prompt', label: 'Weak brief', text: 'Make a clinic booking app.' },
      {
        type: 'prompt',
        label: 'Stronger brief for the Find a doctor screen',
        text: "Design and build the Find a doctor screen for Kalinga Family Clinic in Naga City, as plain HTML and CSS in one stylesheet.\n\nAudience: parents booking a child's visit from a phone, one-handed, often on mobile data.\nGoal: choose a doctor and start a booking in under a minute.\nMood: calm and friendly, plain words. Not cold or hospital-grey.\nContent (use exactly this): Dr. Ana Reyes, family medicine, 500 pesos, free today. Dr. Ben Cruz, pediatrics, 600 pesos, fully booked today. Dr. Carla Lim, dermatology, 800 pesos, free today.\nConstraints: mobile first; must work from 320 px to 1280 px wide with no sideways scrolling; body text 16 px or larger; text contrast at least 4.5:1; buttons at least 44 px tall; real buttons and links, not clickable divs; visible keyboard focus; do not rely on colour alone to show a doctor is booked; one main action per doctor.\n\nBefore you write any code, list anything in this brief that is unclear or missing.",
      },
      { type: 'heading', text: 'What the difference looked like' },
      { type: 'paragraph', text: "The first draft below is what a quick prompt like the weak one tends to produce: a heading bar, three doctor cards in a row, and a form. The improved version followed the stronger brief, with two small follow-up prompts. Both were loaded on a 390 px phone screen and measured." },
      {
        type: 'table',
        headers: ['What was measured', 'First draft', 'Improved version'],
        rows: [
          ['Page width on a 390 px phone', '397 px, so it scrolls sideways', '390 px, fits'],
          ['Width of each doctor card on the phone', '112 px, squeezed', '358 px'],
          ['Pieces of text under 4.5:1 contrast', '19 of 27', '0 of 32'],
          ['Smallest tap target', '8 by 16 px', '44 px tall'],
          ['Controls reachable with the Tab key', '3 of 14 (the three form boxes)', 'All of them'],
          ['Form boxes with a visible label', '0 of 3', '2 of 2'],
        ],
        caption: 'Measured in Chrome 158 on a 390 px wide phone screen. The first draft is one page; the improved version splits it into a doctor list and a booking page.',
      },
      { type: 'tip', text: "None of those problems shows up in the chat window where the AI describes its work. They show up when you load the page at phone width, press Tab and run a contrast check. Measuring is the habit this course builds." },
      { type: 'warning', text: "Never paste real patient or customer details into a prompt. Use invented names and numbers, like the ones in this course. A design brief needs the shape of the content, not anyone's private information." },
      {
        type: 'version',
        text: "WCAG 2.2 (a W3C Recommendation since 5 October 2023) is the current version of the accessibility guidelines this course uses. Level AA is the usual target. It asks for text contrast of at least 4.5:1 (3:1 for large text), a pointer target of at least 24 by 24 CSS pixels, and content that works at a width of 320 CSS pixels without scrolling in two directions. The 44 px buttons in this course are a comfort choice above the 24 px minimum, not a WCAG rule.",
        checked: CHECKED,
        sources: [DOCS.wcagNew, DOCS.wcagContrast, DOCS.wcagTarget],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: the **UI** (user interface) is everything a person sees and touches on a screen: buttons, words, colours, pictures. The **UX** (user experience) is how it feels to get something done: did the parent find a doctor, pick a time and leave without confusion? You know your patients, so you write the brief. The AI is like a fast builder who has never met them. Told \"make it nice\", a builder guesses. Told \"a parent in a waiting room with one free hand who wants a morning slot\", the builder makes different choices. A **px** (pixel) is the unit a web page uses for sizes; a button 44 px tall is a size most thumbs hit comfortably. **Contrast** is how different the text colour is from the colour behind it. Low contrast, like pale grey on white, is hard to read in bright sun.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat the brief as a specification with acceptance criteria, and put the criteria where every session and every agent reads them. The project's instructions file (CLAUDE.md, AGENTS.md or Cursor rules) can hold tokens, minimum sizes and \"never hard-code colours\"; the prompt holds the screen's goal and content. Then make the criteria executable: a Playwright test that loads the page at 320, 390 and 768 px and asserts no horizontal overflow, an automated accessibility scan in CI (scanners catch only part of what WCAG asks, so keep the manual keyboard pass), and a lint rule against colour literals outside the token file. A requirement you cannot verify by script or a short manual check is a wish. Write non-goals as well (\"no dark mode in version one\"), because agents add features nobody asked for.",
      },
      {
        type: 'takeaways',
        items: [
          'AI builds what you describe, so a vague request gets an average screen and a specific brief gets a specific one.',
          'A design brief has five parts: audience, goal of the screen, mood, constraints and references.',
          'Write constraints as numbers you can check: widths, contrast ratios, tap sizes, keyboard use. Adjectives cannot be tested.',
          'Always load the result at phone width and measure it. The AI\'s description of its own work is not a test.',
          'Use invented content in prompts, never real patient or customer details.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-01-scenario-1',
          kind: 'scenario',
          title: 'Which prompt gives the better design?',
          prompt: 'Pick the prompt you would send to the AI tool.',
          concept: 'design brief',
          situation: 'A sari-sari store owner in Cebu wants a phone screen where neighbours choose bread and load and send an order message for pickup. Her customers mostly use cheap phones with small screens. She has a price list. You have ten minutes before you open an AI tool.',
          options: [
            { text: 'Design a modern, clean, user-friendly ordering screen for a store.', consequence: 'You get a polished-looking generic shop page with a banner, a cart icon and invented products. It does not match her price list, and nobody can say whether it is "user-friendly".', quality: 'poor' },
            { text: 'Audience: neighbours on cheap phones, one hand. Goal: pick items and send an order message in under a minute. Mood: friendly and plain. Constraints: works at 320 px wide, text 16 px or larger, contrast at least 4.5:1, buttons at least 44 px tall. Content: this exact price list. Before building, tell me what is unclear.', consequence: 'The first version has her real items and prices, big buttons and a short flow. The tool asks whether orders are for pickup or delivery, a question you had not thought about, and you can check every constraint in a minute.', quality: 'best' },
            { text: 'Use #ff5733 for the header, 18 px Arial for every label, 20 px of padding on all sides and a 3-column grid. Make it look professional.', consequence: 'The page follows your numbers, but nobody said who it is for or what it should help them do. The orange header with white text turns out to fail the contrast check, and three columns squeeze on small phones.', quality: 'acceptable' },
            { text: 'Copy the layout of a famous delivery app exactly, including its logo and colours.', consequence: 'You get a clone that is built for a different business, may copy someone else\'s brand, and still has none of her real content.', quality: 'poor' },
          ],
          hints: [
            'Which prompt tells the tool who will use the screen, and what they should finish?',
            'A prompt is stronger when you can check the result against it afterwards.',
            'Look for the one with audience, goal, measurable limits and her real content.',
          ],
          explanation: 'The best prompt covers audience, goal, mood, measurable constraints and real content, and asks the tool what is missing. Visual details alone (colours, paddings) are checkable but aim at the wrong target, and "modern and clean" cannot be checked at all.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-01-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'The five parts of a design brief',
          prompt: 'Tap each card to read what a strong version of that part looks like for the clinic app.',
          concept: 'design brief',
          cards: [
            { front: 'Audience', back: 'A parent booking a child\'s visit from a phone, one-handed, on mobile data. It decides tap sizes, form length and what happens on a slow connection.' },
            { front: 'Goal of the screen', back: 'One finishable job: choose a doctor and start a booking in under a minute. If you cannot say it in one sentence, the screen is doing too much.' },
            { front: 'Mood', back: 'Calm and friendly, plain words, not cold. Pair what you want with what you do not want, so the tool has a boundary.' },
            { front: 'Constraints', back: 'Checkable limits: 320 to 1280 px wide, text 16 px or larger, contrast 4.5:1, buttons 44 px tall, real buttons, visible focus.' },
            { front: 'References', back: 'One or two examples of the feel you want, used for pattern and order, never to copy a brand.' },
          ],
          hints: [],
          explanation: 'Together the five parts remove the guesses that make a first draft average: who it is for, what it must do, how it should feel, what it must satisfy and what good looks like.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-01-q1',
        prompt: 'Which of these requests can you actually check after the AI has built the screen?',
        choices: [
          'Make it feel modern and trustworthy for every kind of patient',
          'Buttons at least 44 px tall and text contrast at least 4.5:1',
          'Make the experience user-friendly and professional',
          'Give it the look of a high-quality private clinic',
        ],
        answer: 1,
        explanation: 'Heights and contrast ratios are numbers you can measure in a minute. Feelings and adjectives like modern, trustworthy or professional cannot be tested, so they cannot steer the result or tell you it went wrong.',
      },
      {
        id: 'ai-ui-ux-01-q2',
        prompt: 'The first draft has pretty cards, but the secondary text is pale grey and hard to read. Which follow-up prompt is best?',
        choices: [
          'Make the screen look better and more professional overall',
          'Make all of the text a bit darker and a bit larger',
          "Increase the font size of every text element on the page by two pixels, so that the pale grey becomes easier to read for everyone, and keep the colours as they are",
          'Every text colour must have at least 4.5:1 contrast against its background. List each text colour with its ratio and fix any that fail.',
        ],
        answer: 3,
        explanation: 'A measurable target (4.5:1) and a request to list the ratios gives you something to verify. "Better", "darker" and "larger" leave the AI guessing, and bigger text alone does not fix a low-contrast colour.',
      },
      {
        id: 'ai-ui-ux-01-q3',
        prompt: 'Why does the brief say "parents, one-handed, often on mobile data" instead of just "patients"?',
        choices: [
          'It gives the AI design decisions, such as large tap targets and short forms, that it would otherwise guess',
          'AI design tools refuse to build a screen unless the audience has a situation',
          'It makes the finished page load faster in the browser',
          "It lets the AI skip the accessibility constraints later in the brief",
        ],
        answer: 0,
        explanation: 'The situation implies choices: big targets for one thumb, little typing, light pages for mobile data. Without it, the AI guesses for an average user. Tools do not refuse vague briefs, and a situation never replaces accessibility limits.',
      },
      {
        id: 'ai-ui-ux-01-q4',
        prompt: 'Why end the brief with "before you write any code, list anything unclear or missing"?',
        choices: [
          'It stops the tool from ever making a mistake in the code',
          "It makes the tool write the code faster and with fewer tokens, because the plan it produces is reused as the page's final layout without further generation",
          'AI tools build on a weak brief without complaint, so asking for gaps first turns missing details into a one-minute fix',
          'It is required by the tool before it will accept any design brief',
        ],
        answer: 2,
        explanation: 'A tool will happily build on a plan with holes. Asking it to list what is unclear surfaces questions such as "is a doctor ever double-booked?" before they become rebuilt screens. It does not prevent mistakes or speed up code.',
      },
      {
        id: 'ai-ui-ux-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is the difference between UI and UX?',
        choices: [
          "UI is the code behind the screen and UX is the picture of it",
          'UI is for phones and UX is for computers',
          'UI is what you see and touch on the screen; UX is how easy it feels to get something done',
        ],
        answer: 2,
        explanation: 'The UI is the buttons, words and colours. The UX is the whole experience of doing a job with them, such as booking a visit without getting lost. A page can have a nice UI and still be hard to use.',
      },
      {
        id: 'ai-ui-ux-01-q6',
        audience: { min: 'advanced' },
        prompt: 'A team uses a coding agent for every UI change. Where should "buttons at least 44 px, contrast at least 4.5:1, no hard-coded colours" live?',
        choices: [
          'In the project\'s instructions file, enforced by automated checks that run on every change',
          "In each prompt, retyped by whoever writes the request that day, with a reviewer checking by eye that the numbers were copied correctly",
          'Only in a design file the agent is told to look at when it feels unsure',
          'In a review comment on the first pull request, so reviewers remember it',
        ],
        answer: 0,
        explanation: 'Standing constraints belong in the instructions every session reads, and anything that can be checked by script should be, so a rule is enforced even when a prompt forgets it. Retyped prompts drift, and a one-off review comment is lost.',
      },
    ],
    task: {
      title: 'Write a five-part brief for one screen',
      minutes: 15,
      steps: [
        'Pick one screen from an app you know (a clinic, a store, a school) or use Find a doctor for Kalinga Family Clinic.',
        'Write the five parts in your own words: audience, goal, mood, constraints and references. Make at least three constraints into numbers.',
        'Paste the brief into an AI chat tool and end with: "Before you write any code, list anything unclear or missing."',
        'Answer its questions and save the improved brief in a file called brief.md. You will reuse it in every lesson.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain each constraint in my brief in one plain sentence and tell me how I could check it." If any answer surprises you, rewrite that constraint.'] },
      { audience: { min: 'advanced' }, steps: ['Turn one constraint into an automated check, such as a script that loads the page at 320 px and fails if it scrolls sideways, and keep it with the brief.'] },
    ],
  },
  {
    id: 'ai-ui-ux-02',
    day: 2,
    title: 'Using references and screenshots',
    summary: 'Show AI what you mean with a screenshot or a reference, say what to copy and what to leave, and check which parts the picture cannot tell it.',
    intro: {
      objectives: [
        'Choose the right kind of picture for a design request and say what each is for',
        'Write a prompt that tells the AI what to keep, what to change and what to leave out',
        'Explain what a screenshot cannot show, and check those things yourself',
      ],
      why: 'Words describe a layout poorly and a picture carries it at once, but a picture also carries colours, habits and faults you may not want. Knowing what to take from it keeps you from copying a problem.',
    },
    minutes: 22,
    skills: ['references'],
    body: [
      { type: 'paragraph', text: "Try describing the booking screen of an app you like, in words only: \"a list of doctors, each with a button, and the times are small pills below.\" Your description loses the spacing, the order and the feel, and the AI fills the gaps with averages. A picture carries all of that in one go. That is why design tools and coding assistants accept images. But a picture is not a specification. It carries colours that may fail a contrast check, habits that suit another business, and faults you cannot see in it. This lesson is about using a picture on purpose: choosing the kind, saying what to take and what to leave, and knowing what it cannot tell the AI." },
      { type: 'heading', text: 'Three kinds of picture' },
      {
        type: 'table',
        headers: ['Kind', 'When to use it', 'What to say with it'],
        rows: [
          ['A reference: another app\'s screen you like', 'You want the feel of how it is organised', 'Take the order of sections and the spacing feel; use our colours, words and logo'],
          ['Your own current screen', 'You want to improve a screen that exists', 'Do not change anything yet; list the biggest problems and say which you can see and which you are guessing'],
          ['A rough sketch, even a photo of paper', 'You have a structure in mind but no design', 'Treat it as structure only: which blocks, in what order, and which are buttons'],
        ],
        caption: 'The sentence that comes with the picture matters as much as the picture.',
      },
      { type: 'heading', text: 'Which tools can see pictures' },
      { type: 'paragraph', text: "Do not assume. Chat assistants, site builders and code editors differ, and the details change often, so the note below is dated. The practical rule is the same everywhere: attach one clear screenshot at a time, and put your instructions in words next to it." },
      {
        type: 'version',
        text: "Claude accepts JPEG, PNG, GIF and WebP images (10 MB per image on claude.ai) and its docs warn that it gives only approximate positions and object counts. Cursor's agent chat accepts an image dragged in or pasted, for design mockups and visual bugs. v0 analyses an attached screenshot's layout, colours and components and recommends high-resolution images; it can also read a Figma file on paid plans. Lovable takes images by attaching, dragging or pasting (up to 10 files and 15 MB of images per message) and lets you draw on an image to mark what to change. ChatGPT accepts image uploads too; check OpenAI's help page for current formats and limits, which change.",
        checked: CHECKED,
        sources: [DOCS.claudeVision, DOCS.cursorPrompting, DOCS.v0Screenshots, DOCS.v0Figma, DOCS.lovableImages, DOCS.openaiFiles],
        plans: 'Image limits, Figma import and some features depend on the plan you use; check each tool\'s own page.',
      },
      { type: 'heading', text: 'What to say with a picture' },
      { type: 'paragraph', text: "A good picture prompt has four short parts: what the picture is, what to keep, what to change and what to check. Here is one for a reference, then one for your own screen. The second asks for a list before any change, which is the safest habit with an existing design." },
      {
        type: 'prompt',
        label: 'Using a reference screenshot',
        text: "Attached: a screenshot of another booking app's doctor list, for reference only.\n\nTake from it: the order of information on each card (name, specialty, fee, availability, one action) and how much space it leaves around things.\nDo not take: its colours, logo, icons, words or illustrations.\nUse instead: Kalinga Family Clinic's own content (below) and a teal colour you choose.\nCheck before you finish: text contrast at least 4.5:1 and buttons at least 44 px tall. Tell me the ratio of every text and button colour you used.",
      },
      {
        type: 'prompt',
        label: 'Using a screenshot of your own screen',
        text: "Attached: a screenshot of our Find a doctor screen at 390 px wide.\n\nDo not change anything yet. List the five biggest problems for a parent using one hand, most serious first. For each, say whether you can SEE it in the screenshot or are GUESSING from it, and what I should measure to confirm.",
      },
      { type: 'heading', text: 'A screenshot shows pixels, not structure' },
      { type: 'paragraph', text: "When the first draft from lesson 1 is photographed, it looks like a plausible clinic page. The screenshot cannot tell you that 11 of its 14 \"buttons\" are plain divs and spans with a click handler, or that pressing Tab reaches only 3 of them (the three form boxes). It cannot show how the page behaves on a narrower phone, what happens when you press Enter, or whether a screen reader can name the boxes. The AI sees the same pixels you do, and its sense of position and size is approximate. So the second prompt above asks it to separate what it sees from what it guesses, and then you measure the guesses." },
      { type: 'heading', text: 'Copy the pattern, test the colour' },
      { type: 'paragraph', text: "Suppose your reference is a well-known app with a bright orange button and white text. The AI will copy that orange faithfully. Measured, white text on #f97316 has a contrast ratio of 2.80:1, well under 4.5:1 for normal text. A slightly darker orange keeps the personality and fixes the problem." },
      {
        type: 'table',
        headers: ['Button colour behind white text', 'Contrast ratio', 'Normal text (needs 4.5:1)'],
        rows: [
          ['#f97316 (the reference orange)', '2.80:1', 'Fails'],
          ['#ea580c (a bit darker)', '3.56:1', 'Fails, passes only for large text'],
          ['#c2410c (darker again)', '5.18:1', 'Passes'],
        ],
        caption: 'Contrast ratios computed with the WCAG 2.2 formula. The next-but-one lesson shows how.',
      },
      { type: 'warning', text: "Do not upload screenshots that contain real patient names, messages, faces or account details. Crop to the screen you mean. A reference tells the AI about a pattern; it is not permission to copy another company's logo, icons, illustrations or text, so keep those out of what you ask for." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a **screenshot** is a photo of what is on a screen. Your phone and your computer each have a shortcut for taking one; search for \"screenshot\" plus the name of your device. Then **crop** it, which means cutting away the parts you do not need, such as other tabs or private messages. Think of showing a photo of a shop front to a builder. The builder can see the look, but not the wiring behind the walls. A screenshot works the same way: the AI sees the colours and the layout, but not how the buttons behave when someone presses them. That is why you test the page yourself, even when the picture looks right.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Pictures belong in a loop with numbers. Some coding agents can open the running page in a browser and screenshot it, which lets them compare their output with a reference and iterate. Use that, but remember the model's spatial judgement is approximate: pair visual comparison with assertions on the DOM and layout (computed widths, overflow, contrast, target sizes) and a baseline screenshot diff per breakpoint in CI. When you import from a design file, prefer structured data over pixels: v0 and Lovable can read a Figma file's variables, text and frames, so tokens arrive as values instead of being sampled from an image. Whatever the source, pass the design intent (tokens, constraints, states) through the instructions file, not through a one-off image.",
      },
      {
        type: 'takeaways',
        items: [
          'Use a picture on purpose: a reference for feel, your own screen for problems, a sketch for structure.',
          'Say what to take, what to leave out and what to check, in words next to the image.',
          'For your own screen, ask for a list of problems first, with what the AI can see and what it is guessing.',
          'A screenshot shows pixels, not structure: keyboard use, real buttons, labels and other widths must be tested on the live page.',
          'Copy a reference\'s pattern, not its brand, and test its colours: a pretty orange can fail contrast.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-02-scenario-1',
          kind: 'scenario',
          title: 'What goes with the reference screenshot?',
          prompt: 'Pick the message you would send along with the screenshot.',
          concept: 'references and screenshots',
          situation: 'You love how a well-known app shows one clear action on each doctor card. You have a screenshot of its doctor list and want the clinic app to feel similarly organised. Your clinic has its own teal colour and its own words.',
          options: [
            { text: 'Build exactly this, with the same colours, icons and logo, but call it Kalinga.', consequence: 'You get a lookalike that copies another company\'s brand, uses colours you never tested, and may be copied wrongly where the screenshot is blurry.', quality: 'poor' },
            { text: 'Take the order of information on each card and the spacing feel; use our teal, our words and our logo; check text contrast is at least 4.5:1 and tell me every ratio.', consequence: 'The tool keeps the pattern you liked, uses your own identity, and lists the ratios, so you can recompute two of them and confirm.', quality: 'best' },
            { text: 'Make mine feel like this screenshot.', consequence: 'The result borrows some colours and some spacing, but the tool decides which parts count. You cannot tell what it copied, and you did not ask it to check anything.', quality: 'acceptable' },
            { text: 'Describe the screenshot in words only and do not attach it, to avoid copying anything.', consequence: 'You avoid copying, but you also lose the spacing and ordering you wanted, and the tool fills the gaps with an average layout.', quality: 'acceptable' },
          ],
          hints: [
            'Which message separates the pattern you want from the brand you do not?',
            'A good message also asks for something you can verify.',
            'Take the order and spacing, leave the brand, and ask for contrast numbers.',
          ],
          explanation: 'A reference is for pattern and feel. Saying what to take, what to leave and what to check keeps you in control and gives you numbers to verify. "Make it feel like this" hands the decision to the tool.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-02-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Can the screenshot tell you?',
          prompt: 'Tap each question to see whether a screenshot can answer it, and how you would find out instead.',
          concept: 'screenshots show pixels',
          cards: [
            { front: 'Can I reach the "Book now" button with the Tab key?', back: 'Not from a screenshot. Load the live page, press Tab and watch where the focus goes. In the first draft only 3 of 14 controls were reachable.' },
            { front: 'Is the page too wide on a small phone?', back: 'A screenshot shows one width. Load the page at 320 and 390 px and check whether it scrolls sideways. The first draft was 397 px wide on a 390 px screen.' },
            { front: 'Is the grey text readable enough?', back: 'The picture looks fine to many people. Compute the contrast ratio: the first draft\'s grey on white measured 2.85:1, under the 4.5:1 limit.' },
            { front: 'Does the form box have a real label?', back: 'A placeholder inside the box looks like a label. Only the page\'s code shows whether a real label is attached.' },
          ],
          hints: [],
          explanation: 'Layout and colour appear in a picture. Behaviour, structure, other screen widths and exact ratios do not, so each needs its own check.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-02-q1',
        prompt: 'You attach a screenshot of an app whose booking screen you admire. Which message should go with it?',
        choices: [
          "Build exactly this screen, including its colours and logo",
          'Take the order of sections and the spacing feel; use our own colours, words and logo; check text contrast',
          'Rebuild this screen in React so it is faster',
          'Make my screen better than this one, whatever that takes',
        ],
        answer: 1,
        explanation: 'A reference tells the tool about pattern and feel. Naming what to keep and what to leave out, and asking for a check, keeps you from copying a brand and from copying a problem. The other messages leave the key choices to the tool.',
      },
      {
        id: 'ai-ui-ux-02-q2',
        prompt: 'Which of these can a screenshot of your page NOT tell the AI?',
        choices: [
          "That the page has three doctor cards stacked in one column, each with a name, a fee and a button",
          'That the heading is larger than the body text',
          'Whether a button can be reached and pressed with the keyboard',
          'That the header is teal',
        ],
        answer: 2,
        explanation: 'Colour, size and layout are visible in a picture. Keyboard behaviour is how the page responds to keys, which no image captures, so you must press Tab on the live page.',
      },
      {
        id: 'ai-ui-ux-02-q3',
        prompt: 'The reference\'s orange button, #f97316, has white text at 2.80:1. What should you do?',
        choices: [
          'Keep it, because brand colours are always exempt from contrast rules',
          'Make the button text bigger and leave the colour alone',
          "Ask the AI to confirm that the colour passes, and if it says it does, trust its answer and move on to the next screen",
          'Keep the orange feel but darken it until white text reaches at least 4.5:1, then compute the ratio yourself',
        ],
        answer: 3,
        explanation: 'Normal text needs 4.5:1, and the exemption covers logos, not buttons. Size alone does not fix 2.80:1 unless the text is large, and an AI\'s claim about a ratio is something to verify, not accept.',
      },
      {
        id: 'ai-ui-ux-02-q4',
        prompt: 'Which kind of picture most needs the instruction "do not change anything yet; list the problems first"?',
        choices: [
          'A screenshot of your own existing screen',
          'A photo of a paper sketch',
          'A competitor\'s doctor list',
          'A logo file you want placed in the header',
        ],
        answer: 0,
        explanation: 'With an existing screen, the risk is that the tool rewrites things that already work. A list of problems, with what it sees and what it guesses, lets you decide what to change.',
      },
      {
        id: 'ai-ui-ux-02-q5',
        audience: { max: 'beginner' },
        prompt: 'Why should you crop a screenshot to just the screen you are asking about?',
        choices: [
          "The AI will draw the page faster when the picture is small",
          'Extra things such as other tabs or private messages distract the AI and can expose private information',
          'Tools refuse any screenshot that includes a taskbar or a browser bar',
        ],
        answer: 1,
        explanation: 'The AI reads everything in the image. Cropping keeps its attention on the screen you mean and keeps private details out of the request.',
      },
      {
        id: 'ai-ui-ux-02-q6',
        audience: { min: 'advanced' },
        prompt: 'A coding agent screenshots its own output, compares it with the reference, and reports "matches". What is the gap in that evidence?',
        choices: [
          'Nothing: a visual match is sufficient evidence for a design review',
          'It should have compared at only one screen width to avoid noise',
          'Visual comparison is approximate, so add numeric checks (widths, overflow, contrast, target sizes) and a baseline screenshot diff per breakpoint',
          "It needed to use a different model for the comparison, because a model can never judge pictures of its own output and a second model is always accurate",
        ],
        answer: 2,
        explanation: 'Vision models give approximate positions and sizes, and a screenshot shows one state at one width. Assertions on layout and accessibility numbers, plus a pixel diff against a baseline, catch what a visual "looks the same" misses.',
      },
    ],
    task: {
      title: 'Prepare a reference and a screenshot prompt',
      minutes: 15,
      steps: [
        'Take a screenshot of one screen you like and one screen of your own (or of the first draft from lesson 1). Crop both and remove anything private.',
        'Write the reference prompt: what you take from it, what you do not take, what to use instead and what to check.',
        'Write the second prompt for your own screen: "Do not change anything yet. List the five biggest problems, and say what you can see and what you are guessing."',
        'Send it to a tool that accepts images (check the version note first). Pick two of its guesses and check them on the live page.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain in plain words which problems you can see in my screenshot and which you cannot." Write down one thing it could not know.'] },
      { audience: { min: 'advanced' }, steps: ['Capture a baseline screenshot of your page at 390 and 1280 px with a script, so a later change can be compared pixel by pixel instead of by eye.'] },
    ],
  },
  {
    id: 'ai-ui-ux-03',
    day: 3,
    title: 'Layout, spacing and hierarchy',
    summary: 'Judge what the eye sees first, give each screen one main action, and ask AI for spacing from a small scale instead of random numbers.',
    intro: {
      objectives: [
        'Run the squint test and name what a screen makes people look at first',
        'Ask for one main action per card and a small spacing and type scale',
        'Describe a layout problem so the AI changes only what you intend',
      ],
      why: 'A screen can contain all the right content and still feel confusing because nothing says where to look. Hierarchy and spacing are what tell a tired parent where the booking button is, and you can direct them without knowing any design vocabulary.',
    },
    minutes: 25,
    skills: ['layout-hierarchy'],
    body: [
      { type: 'paragraph', text: "Look at a road sign. You do not read it; you see it, and one thing stands out: the name of the place, big and bold, with the arrow clear. A good screen works the same way. Before anyone reads a word, their eye lands on something, and the design decides what. **Hierarchy** is the order in which things draw attention. When all of it is equal (every line the same size, every button the same weight) the eye has no start, and people hesitate. You do not need design vocabulary to fix this. You need to name what should come first, and ask for it in plain terms." },
      { type: 'heading', text: 'What the first draft got wrong' },
      { type: 'paragraph', text: "In the first draft, each doctor card holds a tiny close mark, three time pills and a Book now button: five things to press, all roughly the same size, in a card that is 112 px wide on a phone. Text used five different sizes (12, 14, 16, 22 and 24 px) with no pattern, and the stylesheet used eight different spacing values (2, 3, 6, 8, 10, 16, 20 and 30 px). The improved version gives each card one action, uses four text sizes (14, 16, 20 and 28 px), each with a job, and only five spacing values (4, 8, 16, 24 and 32 px)." },
      {
        type: 'table',
        headers: ['Element', 'Its job', 'How it is ranked'],
        rows: [
          ['Page title "Find a doctor"', 'Says where you are', '28 px, bold: the largest thing on the screen'],
          ['Doctor name', 'What you compare first', '20 px, bold'],
          ['Specialty and fee', 'Supporting facts', '16 px, the fee in semibold'],
          ['Availability', 'Decides whether to press', 'A tick or cross plus words, 14 px bold'],
          ['The one action', 'What the card is for', 'A full-width button, the only button on the card'],
        ],
        caption: 'Hierarchy comes from size, weight, space and colour, spent carefully: if everything is big and bold, nothing is.',
      },
      { type: 'heading', text: 'Close means related' },
      { type: 'paragraph', text: "People read things that sit close together as belonging together. So the space inside a group should be smaller than the space between groups. In the improved cards, lines inside a card are 8 px apart, the card has 16 px of padding, and the cards are 16 px apart from each other. Because the gap inside the card is no larger than the gap between cards, a card still reads as one unit." },
      {
        type: 'code',
        language: 'css',
        label: 'The card, from the improved version (fragment)',
        code: `.card {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--radius);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.card .btn { margin-top: auto; }`,
      },
      { type: 'paragraph', text: "Reading it line by line: the card has a tinted background and a thin border, rounded corners and 16 px of padding (the space between its edge and its content). `display: flex` with `flex-direction: column` stacks the contents top to bottom, and `gap` puts 8 px between each stacked item. The last rule, `margin-top: auto`, pushes the button to the bottom of its card, so the buttons line up even when cards have different amounts of text." },
      { type: 'heading', text: 'Ask for a scale, not for nice spacing' },
      { type: 'paragraph', text: "\"Use balanced spacing\" gets you a different number in every component, because the AI picks fresh values each time it writes code. A **scale** is a short fixed list, such as 4, 8, 16, 24 and 32 px, that you tell it to use everywhere. The same goes for text sizes. A small scale makes the screen consistent, and it makes your review quick: any value that is not on the list is a mistake." },
      { type: 'prompt', label: 'Ask for a review before changing', text: "Look at the Find a doctor screen at 390 px wide. Do not change any code yet.\n\n1. Tell me what draws the eye first, second and third.\n2. Which single action should the screen exist for, and is it the most noticeable thing?\n3. List every text size and every spacing value in the stylesheet, and say which fall outside this scale: text 14, 16, 20, 28 px; spacing 4, 8, 16, 24, 32 px.\nThen propose the smallest changes, one per item, and wait for my go-ahead." },
      { type: 'diagram', format: 'mermaid', caption: 'A hierarchy review as a loop: decide what should come first, compare it with what does, change one thing, look again.', source: 'flowchart TD\n  A[Squint at the screen until text blurs] --> B[Note what your eye lands on]\n  B --> C[Name the one action the screen is for]\n  C --> D{Same thing?}\n  D -->|Yes| E(Done: keep it)\n  D -->|No| F[Ask the AI to change one size, weight or space]\n  F --> A' },
      { type: 'tip', text: "Squint or step back from the screen until the words blur. Whatever still stands out is what the layout really says is important. If it is a logo or a decoration instead of the booking button, change that, not the colours." },
      { type: 'warning', text: "AI tools tend to \"improve\" a layout by changing many things at once. Say what may change (\"only the sizes and spacing in styles.css\") and what must stay (\"keep the content, keep the colours\"), so a spacing fix cannot quietly rewrite your colours or your wording." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: **padding** is the space inside a box, between its edge and what is in it, like the gap between a photo and its frame. **Margin** is the space outside a box, and **gap** is the space between boxes lined up together. **Flex** is a way of lining things up in a row or a column. When you read the card's styles above, you are reading a recipe: a tinted box, 16 px of room inside, items stacked in a column with 8 px between them, and the button pushed to the bottom. You do not have to write this; you need to read it enough to tell the AI \"make the gap between lines smaller than the gap between cards\" and to check that it did.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Layout bugs in generated code usually come from a few habits: fixed widths where a flexible track was needed, absolute positioning to nudge things, and spacing set per component instead of from a scale. Prefer grid for two-dimensional page layout and flex for a single row or column, make the scale tokens (so a change lands everywhere), and make review mechanical: search the diff for pixel literals outside the token file and for `position: absolute`. Layout stability matters too: reserve space for content that loads late, so the page does not jump under a thumb. Keep a screenshot diff at three widths in CI so a spacing tweak cannot silently reflow a screen you did not touch.",
      },
      {
        type: 'takeaways',
        items: [
          'Hierarchy is the order in which things draw attention: name what should come first, then check what really does with the squint test.',
          'Give each card one main action, and make it the most noticeable shape on the card.',
          'Space inside a group should be smaller than space between groups, so groups read as groups.',
          'Ask for spacing and type from a small fixed scale, and treat any value off the scale as a mistake to fix.',
          'Tell the AI what may change and what must stay, so a layout fix does not rewrite everything.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-03-match-1',
          kind: 'match',
          title: 'Which design fix does each problem need?',
          prompt: 'Match each problem you spotted in a generated screen to the fix you would ask for.',
          concept: 'hierarchy and spacing',
          labels: { terms: 'What you see', meanings: 'The fix to ask for' },
          pairs: [
            { term: 'Every doctor card has three buttons that all look equally important', definition: 'Choose one primary action per card and make the others quieter or move them to the next screen', note: 'When every button has the same weight, the eye has no starting point.' },
            { term: 'Inside a card, the lines are as far apart as the cards are from each other, so the screen looks like loose lines', definition: 'Make the gap inside a group smaller than the gap between groups', note: 'Closeness tells people what belongs together.' },
            { term: 'The stylesheet uses 12, 13, 15, 17 and 22 px for text with no pattern', definition: 'Pick four text sizes with jobs (title, name, body, small) and ban the rest', note: 'A short type scale makes a page consistent and quick to review.' },
            { term: 'Cards with different amounts of text leave their buttons at different heights', definition: 'Let each card stretch and push its button to the bottom with margin-top: auto', note: 'This aligns the actions across cards.' },
            { term: 'The AI uses a fresh padding value (13 px, 18 px, 22 px) in every new component', definition: 'Give it a spacing scale and tell it to use only those values', note: 'A fixed scale gives the AI the same answer every time.' },
          ],
          hints: [
            'Read each problem and ask: is it about attention, grouping, sizes, alignment or consistency?',
            'The fix names the same idea as the problem: equal buttons need one primary, random sizes need a scale.',
            'Closeness belongs with grouping, margin-top: auto belongs with alignment, and a fixed list belongs with consistency.',
          ],
          explanation: 'Each fix applies one idea: rank the actions, group by closeness, limit the sizes, align the actions and fix the scale. Naming the idea in your prompt is more reliable than asking for "better spacing".',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-03-arrange-1',
          kind: 'arrange',
          title: 'Put the hierarchy review in order',
          prompt: 'Drag the steps into the order you would follow, from first look to the next check.',
          concept: 'hierarchy review',
          language: 'text',
          solution: [
            'Squint at the screen until the text blurs',
            'Write down what your eye lands on first',
            'Name the one action the screen exists for',
            'If they differ, ask the AI to change one size, weight or space',
            'Reload and squint again to check the change worked',
          ],
          reasons: [
            'Look first, before you form an opinion, so you see what the screen really emphasises.',
            'Record the first thing you see so you are comparing against something concrete.',
            'Decide what should come first, from the goal of the screen.',
            'Only now ask for a change, and a single one, so you know what caused any difference.',
            'Check the result the same way you found the problem.',
          ],
          hints: [
            'You cannot compare what you see with what you want until you have both.',
            'First observe, then decide what should win, then change, then re-check.',
            'The squint is first and the squint is also last.',
          ],
          explanation: 'The review compares what the screen emphasises with what the goal says it should. Changing one thing at a time, and re-checking the same way, tells you what worked.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-03-q1',
        prompt: 'Why should the gap inside a card be smaller than the gap between cards?',
        choices: [
          'Smaller gaps make the page load faster on a phone',
          'It saves vertical space, which is the only reason designers do it',
          'Cards must have a visible border for the gaps to work',
          'Things that sit close together are read as belonging together',
        ],
        answer: 3,
        explanation: 'People group by closeness. If the space inside a card matched the space between cards, each line would look separate. Space has no effect on load speed, and borders are optional.',
      },
      {
        id: 'ai-ui-ux-03-q2',
        prompt: 'Which spacing request will give the most consistent result across a whole app?',
        choices: [
          'Use only 4, 8, 16, 24 and 32 px for every gap and padding, nothing else',
          "Use nice, balanced spacing that feels right on every screen, with the amount chosen by the AI to suit each component",
          'Space things out more than a typical app does',
          'Copy the spacing of the reference screenshot by eye',
        ],
        answer: 0,
        explanation: 'A fixed list can be followed and checked: any other value is a mistake. "Balanced" and "by eye" leave each value to the tool, which picks a fresh number in each component.',
      },
      {
        id: 'ai-ui-ux-03-q3',
        prompt: 'After the squint test, your eye lands on the clinic logo instead of the Book button. What is the best next step?',
        choices: [
          "Change the colours of the whole page again and again until the Book button stands out more than the logo does, then keep whichever version looks best",
          'Add a second Book button lower on the card',
          'Ask for the logo to be smaller and quieter and the Book button to be the most noticeable shape, changing only sizes and weights',
          'Make the logo animate so people notice the page is modern',
        ],
        answer: 2,
        explanation: 'The goal is for the action to win attention, so reduce what competes with it and strengthen it, with the change limited to size and weight. Recolouring everything or duplicating buttons adds noise.',
      },
      {
        id: 'ai-ui-ux-03-q4',
        prompt: 'A doctor card holds a close mark, three time pills and a Book now button. What is the main design problem?',
        choices: [
          'Cards should never contain buttons of any kind',
          'Five competing actions leave no clear main action for a hurried parent',
          "Time pills must always be placed above the doctor's name, because the order of the information is fixed by the HTML standard",
          'The card needs a bigger photograph of the doctor',
        ],
        answer: 1,
        explanation: 'Each card should exist for one decision. Pulling the times to the next screen leaves one clear action on the card. Cards can hold buttons, and photos do not solve a focus problem.',
      },
      {
        id: 'ai-ui-ux-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does "padding" mean?',
        choices: [
          'The space inside a box, between its edge and what it holds',
          "The space outside a box, between it and the next box",
          'The thickness of the line drawn around a box',
        ],
        answer: 0,
        explanation: 'Padding is the room inside a box, like the gap between a photo and its frame. Space outside is called margin, and the line around a box is its border.',
      },
      {
        id: 'ai-ui-ux-03-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent keeps writing components with 13 px and 22 px gaps. What is the most scalable fix?',
        choices: [
          'Tell it each time to use nicer numbers',
          'Review every pull request by eye and edit the numbers by hand',
          "Replace the whole stylesheet with exported images of each screen so that spacing can no longer vary between components or between agent sessions, whoever edits them",
          'Put the scale in tokens, state "only these values" in the instructions file, and add a lint or search check that flags pixel literals outside the token file',
        ],
        answer: 3,
        explanation: 'A scale in tokens makes the right value the easy one, the instructions make the rule standing, and an automated check catches slips so review stays quick. Reminders and manual edits do not scale across many changes.',
      },
    ],
    task: {
      title: 'Run the squint test on your own screen',
      minutes: 15,
      steps: [
        'Open the screen you are working on, or the first draft from lesson 1, at phone width.',
        'Squint until the text blurs and write down the first, second and third thing your eye lands on.',
        'Send the review prompt from this lesson to your AI tool, with a screenshot if it accepts images.',
        'Pick the single smallest change it suggests, ask for only that one, and squint again.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain padding, margin and gap using my card as the example, in plain words." Then point to each one on your screen.'] },
      { audience: { min: 'advanced' }, steps: ['Add a check that lists every distinct padding, margin and gap value on the rendered page and fails when one is not in your scale.'] },
    ],
  },
  {
    id: 'ai-ui-ux-04',
    day: 4,
    title: 'Colour and type that work together',
    summary: 'Pick colours and text sizes by contrast numbers you compute yourself, because AI chooses by taste and taste is not tested.',
    intro: {
      objectives: [
        'Explain what a contrast ratio is and which numbers text and controls must reach',
        'Compute a contrast ratio with a short function and catch near-misses',
        'Ask AI for a palette and a type scale organised by role, then verify it',
      ],
      why: 'AI tools choose attractive colours, and attractive is not the same as readable. A parent squinting at pale grey text in bright sun will not book a visit, so you need a way to check colour that does not depend on anyone\'s taste, including the AI\'s.',
    },
    minutes: 28,
    skills: ['colour-type'],
    body: [
      { type: 'paragraph', text: "Ask an AI tool for a calm medical palette and you will get something lovely: a fresh teal for buttons, soft greys for secondary text. Put white text on that teal, #0d9488, and it looks crisp. Measured, it has a contrast ratio of 3.74:1 against white, below the 4.5:1 that normal-size text needs. Nobody lied. The tool chose by taste, and taste is not tested. The fix is not better taste. It is a number you compute yourself, so you can approve or reject any colour the AI proposes in about ten seconds." },
      { type: 'heading', text: 'What a contrast ratio is' },
      { type: 'paragraph', text: "Contrast ratio compares how light two colours are, on a scale from 1:1 (identical) to 21:1 (black on white). WCAG 2.2, the accessibility standard from the previous lessons, sets minimums at Level AA. Large text is 18 point or bigger, or 14 point and bold, which is about 24 px, or about 18.66 px bold. The ratio is a threshold and is not rounded: 4.499:1 fails." },
      {
        type: 'table',
        headers: ['What', 'Minimum ratio (Level AA)', 'Example from the clinic app'],
        rows: [
          ['Normal-size text', '4.5:1', 'Doctor specialty in grey on a tinted card'],
          ['Large text (about 24 px, or 18.66 px bold)', '3:1', 'The page title'],
          ['Edges of form boxes, icons and other parts you need to see to use a control', '3:1', 'The border of the name box'],
          ['The keyboard focus ring', '3:1', 'The blue outline around the focused button'],
          ['Pure decoration, disabled controls, logos', 'No minimum', 'A faint divider between cards'],
        ],
        caption: 'WCAG 2.2 SC 1.4.3 and 1.4.11. Placeholder text is not exempt: it counts as text.',
      },
      { type: 'heading', text: 'Compute it yourself' },
      { type: 'paragraph', text: "The formula is public and short, so you can run it as code. The function below turns each red, green and blue amount (0 to 255) into a light value, mixes them into one \"luminance\" per colour, and divides the lighter by the darker, each with 0.05 added. You can run this in the practice stage of this lesson." },
      {
        type: 'code',
        language: 'javascript',
        label: 'Contrast ratio, as the WCAG 2.2 formula defines it',
        code: `function channel(value) {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function luminance(c) {
  return 0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
}
function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
console.log(contrast([13, 148, 136], [255, 255, 255]));`,
      },
      { type: 'paragraph', text: "Line by line: `channel` converts one 0 to 255 amount into a light value (dark colours rise slowly, which matches how eyes work). `luminance` weights green most, red some and blue least, because eyes are most sensitive to green. `contrast` puts the lighter colour on top and the darker below. The last line checks white on teal, and prints 3.74. Two small pieces of notation appear in the practice code too: `x ? a : b` means \"if x is true, use a, otherwise use b\", and `toFixed(2)` prints a number with two decimals." },
      { type: 'paragraph', text: "Here is what the same function says about colours of the kind AI tools often pick (common greys, teals and blues), next to the clinic app's own choices. Look for the near-misses: they look fine and fail." },
      {
        type: 'table',
        headers: ['Text on background', 'Ratio', 'Normal text (4.5:1)'],
        rows: [
          ['#9ca3af on white (light grey)', '2.54', 'Fails'],
          ['#6b7280 on #f3f4f6 (grey on a tinted card)', '4.39', 'Fails by a hair'],
          ['#777777 on white', '4.48', 'Fails (it only rounds to 4.5)'],
          ['#767676 on white', '4.54', 'Passes'],
          ['White on #0d9488 (teal)', '3.74', 'Fails; fine only for large text'],
          ['White on #2563eb (blue)', '5.17', 'Passes'],
          ['Clinic app: text #16302f on white', '14.02', 'Passes easily'],
          ['Clinic app: secondary text #46605e on the card tint #f1f6f6', '6.22', 'Passes'],
          ['Clinic app: white on brand teal #0b6e6a', '6.08', 'Passes'],
        ],
        caption: 'Computed with the function above. The clinic palette was tuned by changing the teal until white text reached well over 4.5:1.',
      },
      { type: 'heading', text: 'Colour is never the only signal' },
      { type: 'paragraph', text: "The first draft marks a doctor as available or booked with a small green or red dot. Some people cannot tell those apart, and everyone loses the difference in bright sun. WCAG's rule is that colour must not be the only way to convey meaning. The improved version keeps the colour and adds a tick or cross and the words \"Free today\" or \"Fully booked today\". The same applies to errors: a red border alone is not enough, so the form also writes the problem in words." },
      { type: 'heading', text: 'Type that works together' },
      { type: 'paragraph', text: "A readable screen needs very little: one font family, a body size of 16 px or more, a short scale where each size has a job (28 px page title, 20 px names, 16 px body, 14 px small print), a line height of 1.5 for body text so lines do not crowd, and two or three weights. The clinic app uses the phone's own system font, so nothing has to download. Sizes are set in rem (a unit that follows the reader's own text-size setting) rather than fixed pixels." },
      { type: 'prompt', label: 'Ask for a palette organised by role, with working shown', text: "Propose a colour palette for Kalinga Family Clinic as CSS custom properties named by role (ink, ink-soft, surface, brand, on-brand, control-border, focus, ok, bad), not by colour name. Mood: calm and friendly, not cold. For every text-and-background pair, show the contrast ratio and whether it passes: 4.5:1 for normal text, 3:1 for control borders and the focus ring. Use a teal as the brand colour. Show your working for the brand pair." },
      { type: 'warning', text: "An AI will state contrast ratios confidently, and it can be wrong. Treat its list as a claim to verify: paste the pairs that matter (the brand button, secondary text, control borders) into the function above, or any contrast checker, and trust your number." },
      {
        type: 'version',
        text: "WCAG 2.2 Level AA: text contrast 4.5:1 (3:1 for large text, meaning at least 18 point, or 14 point bold), not rounded. User interface parts and focus indicators need 3:1 (SC 1.4.11). Colour must not be the only way to show information (SC 1.4.1, Level A). The luminance formula uses a 0.04045 threshold in its first step; an older 0.03928 value was replaced in May 2021 with no practical effect.",
        checked: CHECKED,
        sources: [DOCS.wcagContrast, DOCS.wcagNonText, DOCS.wcagColour],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: **contrast** is how different the text colour is from the colour behind it. Black on white is easy to read; light grey on white is not. A **hex colour** such as #0b6e6a is three amounts written in a short code: 0b is how much red (11 out of 255), 6e how much green (110) and 6a how much blue (106). The function above does the arithmetic for you. Think of it as a ruler for colours: you give it two colours, it gives back one number, and 4.5 is the line for ordinary text. When the AI proposes a colour you like, you do not have to guess if it is readable. Measure it. A teal that looks lovely can still measure 3.74, and now you know to ask for a darker one.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Move from checking colours to enforcing pairs. Define semantic tokens in foreground and background pairs, and run a script over the whole matrix (every text token on every surface it can sit on, plus hover, active, disabled and focus states) as a test that fails the build below the threshold. Text over images or gradients needs the worst-case colour behind the text, not the average. A dark theme is its own set of tokens with its own checked pairs, not an inversion of the light one, because inverted colours break ratios and shadows. Keep the checker in the repo next to the tokens so an agent changing a colour gets a failing test, not a code review argument.",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'Try it on your own project: list every colour in your stylesheet that appears as text, pair each with the background it sits on, and run all the pairs through the contrast function in one loop. Anything under 4.5 for normal text goes on your fix list.',
      },
      {
        type: 'takeaways',
        items: [
          'AI picks colours by taste; contrast is a number you can compute and a pass or fail you can trust.',
          'Normal text needs 4.5:1, large text and control borders and the focus ring need 3:1, and ratios are never rounded.',
          'Near-misses (4.39, 4.48) look fine and fail, so compute rather than judge by eye.',
          'Never use colour as the only signal: add a word or an icon to every red and green meaning.',
          'Ask for a palette named by role with the ratios shown, then recompute the pairs that matter yourself.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-04-predict-1',
          kind: 'predict-output',
          title: 'Pass or fail?',
          prompt: 'This runs the contrast function on four checks and prints the ratio to two decimal places, then pass or fail against the limit given. What does it print? Pay attention to the unrounded comparison.',
          concept: 'contrast ratio',
          language: 'javascript',
          code: "function channel(value) {\n  const s = value / 255;\n  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);\n}\nfunction luminance(c) {\n  return 0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);\n}\nfunction contrast(a, b) {\n  const la = luminance(a);\n  const lb = luminance(b);\n  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);\n}\nconst white = [255, 255, 255];\nfunction check(name, fg, bg, need) {\n  const r = contrast(fg, bg);\n  console.log(`${name} ${r.toFixed(2)} ${r >= need ? 'pass' : 'fail'}`);\n}\ncheck('grey-767676', [118, 118, 118], white, 4.5);\ncheck('grey-777777', [119, 119, 119], white, 4.5);\ncheck('teal-on-white', [13, 148, 136], white, 4.5);\ncheck('large-teal', [13, 148, 136], white, 3);",
          expected: 'grey-767676 4.54 pass\ngrey-777777 4.48 fail\nteal-on-white 3.74 fail\nlarge-teal 3.74 pass',
          choices: [
            'grey-767676 4.54 pass\ngrey-777777 4.48 fail\nteal-on-white 3.74 fail\nlarge-teal 3.74 pass',
            'grey-767676 4.54 pass\ngrey-777777 4.48 pass\nteal-on-white 3.74 fail\nlarge-teal 3.74 pass',
            'grey-767676 4.54 pass\ngrey-777777 4.48 fail\nteal-on-white 3.74 pass\nlarge-teal 3.74 pass',
            'grey-767676 4.54 pass\ngrey-777777 4.48 fail\nteal-on-white 3.74 fail\nlarge-teal 3.74 fail',
          ],
          wrongNotes: {
            'grey-767676 4.54 pass\ngrey-777777 4.48 pass\nteal-on-white 3.74 fail\nlarge-teal 3.74 pass': 'The comparison uses the unrounded ratio, 4.478, which is below 4.5. It only looks like 4.5 after rounding to two decimals.',
            'grey-767676 4.54 pass\ngrey-777777 4.48 fail\nteal-on-white 3.74 pass\nlarge-teal 3.74 pass': 'The same colour pair gets a different limit: 3.74 is under 4.5, so for normal text it fails.',
            'grey-767676 4.54 pass\ngrey-777777 4.48 fail\nteal-on-white 3.74 fail\nlarge-teal 3.74 fail': 'The last check uses the 3:1 limit for large text, and 3.74 is above 3.',
          },
          hints: [
            'Each console.log line shows the ratio, then pass or fail against the limit given for that check.',
            'The same ratio can pass one limit and fail another: compare 3.74 with 4.5 and with 3.',
            'The grey 777777 measures 4.478 before rounding, which is under 4.5, so it fails.',
          ],
          explanation: 'The ratio is compared before rounding, so 4.478 fails the 4.5 limit even though it prints as 4.48. The teal fails for normal text (needs 4.5) but passes for large text (needs 3).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'The pale secondary text',
          prompt: 'This stylesheet from an AI draft makes the specialty line hard to read on the white card (contrast 2.85:1). Tap the line with the problem, then pick the fix that makes 14 px text pass at 4.5:1.',
          concept: 'text contrast',
          language: 'css',
          code: ".card {\n  background: #ffffff;\n}\n.specialty {\n  color: #999999;\n  font-size: 0.875rem;\n}",
          bugLine: 5,
          fixes: [
            { line: '  color: #595959;', correct: true, why: 'Dark grey #595959 on white measures 7.0:1, comfortably over 4.5:1, and it keeps the quieter secondary look.' },
            { line: '  color: #777777;', correct: false, why: 'This grey measures 4.48:1 on white, which fails: ratios are not rounded up to 4.5.' },
            { line: '  color: #888888;', correct: false, why: 'This grey measures 3.55:1, which is better but still fails for 14 px text.' },
            { line: '  color: #999999; font-weight: 700;', correct: false, why: 'Bold alone does not make small text count as large: it must be about 18.66 px or more. The ratio stays 2.85:1.' },
          ],
          hints: [
            'Which line sets the colour of the text that is hard to read?',
            'You need a colour that reaches at least 4.5:1 on white, and ratios are not rounded.',
            'A dark grey around #595959 measures about 7:1. #777777 is 4.48 and fails.',
          ],
          explanation: 'The problem is the text colour. A pale grey is fixed by choosing a darker one that passes the 4.5:1 threshold, not by making the text bold, and not by a grey that rounds to 4.5 but measures 4.48.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-04-q1',
        prompt: 'A pair of colours measures 4.499:1 for normal-size text. What is the result?',
        choices: [
          'Pass, because 4.499 rounds to 4.5',
          "Pass, because the text is only a tiny fraction below the limit and designers normally allow a small tolerance",
          'Fail, because the ratio is a threshold that is not rounded',
          'It depends on which browser shows the page',
        ],
        answer: 2,
        explanation: 'WCAG treats 4.5 as a hard threshold, not a rounded value, so 4.499 fails. The result does not depend on the browser, and "close" does not count.',
      },
      {
        id: 'ai-ui-ux-04-q2',
        prompt: 'Which of these passes for normal-size text?',
        choices: [
          '#767676 on white (4.54:1)',
          'White on #0d9488 teal (3.74:1)',
          '#6b7280 on #f3f4f6 (4.39:1)',
          '#9ca3af on white (2.54:1)',
        ],
        answer: 0,
        explanation: 'Only 4.54 reaches 4.5. The teal needs 4.5 for normal text (it is fine only for large text), and the other two greys are below the limit even though they look readable.',
      },
      {
        id: 'ai-ui-ux-04-q3',
        prompt: 'The availability status uses a green dot and a red dot. What is the best fix?',
        choices: [
          'Make the green a little greener and the red a little redder',
          'Use darker dots so they are easier to see',
          "Show the status only when a doctor is fully booked, since people only need to know about problems, and hide it otherwise",
          'Keep the colour and add a tick or cross icon and the words "Free today" or "Fully booked today"',
        ],
        answer: 3,
        explanation: 'Colour must not be the only signal, because some people cannot tell red from green and everyone loses it in bright light. A word and an icon carry the meaning without the colour.',
      },
      {
        id: 'ai-ui-ux-04-q4',
        prompt: 'An AI lists contrast ratios for the palette it designed. What should you do with them?',
        choices: [
          'Trust them, since the AI wrote the colours itself',
          'Recompute the pairs that matter, such as the brand button, secondary text and control borders, with your own function or a checker',
          "Ignore the ratios and only check the colours that look pale to you on your own screen, because a colour that looks fine on screen is fine for everyone",
          'Ask the AI to say the ratios again more confidently',
        ],
        answer: 1,
        explanation: 'The tool\'s claim is something to verify. A few lines of code or a contrast checker give you the real number, and the check costs seconds. Looking pale is not reliable: 4.39 looks fine and fails.',
      },
      {
        id: 'ai-ui-ux-04-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is "contrast" in a design?',
        choices: [
          "How bright the screen is set on your phone",
          'How different the text colour is from the colour behind it, which decides how easy it is to read',
          'How many colours are used on a page',
        ],
        answer: 1,
        explanation: 'Contrast compares the text colour with its background. High contrast, like black on white, is easy to read; low contrast, like pale grey on white, is hard to read, especially in bright light.',
      },
      {
        id: 'ai-ui-ux-04-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team adds a dark theme by inverting every colour automatically. Which approach prevents contrast regressions?',
        choices: [
          'Inverting is fine, because inverted colours keep the same ratio',
          'Define separate semantic tokens for the dark theme and test every text-on-surface pair in both themes, including hover and disabled states, in CI',
          "Check a few screens by eye on a bright monitor before each release, and trust that any pair that looks readable there is readable for everyone",
          'Ask the AI agent to describe the contrast in its pull request',
        ],
        answer: 1,
        explanation: 'Inversion does not preserve ratios in general, and states such as hover or disabled add pairs. Separate tokens plus an automated matrix test make every pair a checked requirement, not an opinion.',
      },
    ],
    task: {
      title: 'Check three colour pairs of your own',
      minutes: 15,
      steps: [
        'Pick three text-on-background colour pairs from a screen you made: for example body text, secondary text and a button label.',
        'Run each pair through the contrast function (or any contrast checker) and write down the ratios.',
        'Ask your AI tool to fix any pair under 4.5:1 by changing only that colour, and recompute the new pair yourself.',
        'Add a tick or an icon and a word to any meaning your screen shows only by colour.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain what 4.5:1 means in plain words and show me a pair that fails and a pair that passes." Compare with what you see on your screen.'] },
      { audience: { min: 'advanced' }, steps: ['Write a script that loads your token file and tests every foreground and background pair, exiting with an error when one falls below its threshold.'] },
    ],
  },
  {
    id: 'ai-ui-ux-05',
    day: 5,
    title: 'Responsive on every screen size',
    summary: 'Make one page fit a small phone, a big phone, a tablet and a laptop, and measure it at each width instead of trusting the preview.',
    intro: {
      objectives: [
        'Explain why a page needs the viewport tag and flexible widths',
        'Read a grid rule that adapts without breakpoints',
        'Write a follow-up prompt that fixes a layout problem using measured widths',
      ],
      why: 'Your patients will open the app on a small phone, a large phone, a tablet and a laptop. AI tools usually show you one preview, so a page can look right in the chat and break everywhere else unless you test the widths yourself.',
    },
    minutes: 25,
    skills: ['responsive'],
    body: [
      { type: 'paragraph', text: "A page does not have one size. It is drawn into whatever window it lands in: a small phone, a large phone held sideways, a tablet, a laptop. A page that is **responsive** rearranges itself to fit each one: one column on a phone, two or three on a wide screen, the same content and the same buttons. When an AI tool shows you its work in a chat preview, you see one width. This lesson is about the two mistakes that break the others, how to ask for flexible layouts, and how to measure the result at the widths that matter: 320, 390, 768 and 1280 px." },
      { type: 'heading', text: 'Mistake one: the missing viewport tag' },
      { type: 'paragraph', text: "A phone's browser has to guess how wide to draw a page unless the page says otherwise. Without one line in the page's head, mobile browsers pretend the screen is much wider and then shrink everything to fit. I loaded a page with a single word of text in a 390 px wide phone emulation. Without the tag it was laid out at 980 px wide, and with `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` it was laid out at 390. A page laid out at 980 px and then shrunk is what produces tiny, unreadable text on a phone. AI tools usually include the tag, but check, because a missing tag looks like a design problem and is not." },
      { type: 'heading', text: 'Mistake two: widths that are fixed' },
      { type: 'paragraph', text: "The first draft gives every doctor card `width: 340px` and puts three in a row. On a 390 px phone they cannot fit, so the browser squeezes them: each card measured 112 px wide, and the page itself became 397 px wide, so it scrolled sideways. At 320 px the page was still 397 px wide. The improved version uses flexible columns instead, and fit exactly at every width." },
      {
        type: 'table',
        headers: ['Screen width', 'First draft: page width', 'First draft: card width', 'Improved: page width', 'Improved: card width and layout'],
        rows: [
          ['320 px (small phone)', '397 px, scrolls sideways', '112 px', '320 px', '288 px, one column'],
          ['390 px (typical phone)', '397 px, scrolls sideways', '112 px', '390 px', '358 px, one column'],
          ['768 px (tablet)', '768 px', '229 px', '768 px', '360 px, two columns (the third wraps)'],
          ['1280 px (laptop)', '1280 px', '340 px', '1280 px', '320 px, three columns'],
        ],
        caption: 'Measured in Chrome 158. "Page width" is the width of the whole page: any value larger than the screen means a sideways scroll.',
      },
      { type: 'heading', text: 'Fluid by default' },
      { type: 'paragraph', text: "The improved page does not use a different layout for each device. It uses one rule that lets the browser decide how many columns fit." },
      {
        type: 'code',
        language: 'css',
        label: 'A grid that adapts by itself (fragment)',
        code: `.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
}`,
      },
      { type: 'paragraph', text: "Reading it: `display: grid` lays the cards out in rows and columns, with a 16 px `gap`. The last line says \"make as many columns as will fit, each at least 17rem (272 px) wide, and share any leftover room equally\". `repeat(auto-fit, ...)` is the \"as many as fit\" part, `minmax(..., 1fr)` is \"at least this wide, then grow\", and `min(100%, 17rem)` means \"never wider than the container itself\", so a very narrow container cannot overflow. The browser does the arithmetic: the number of columns is the whole number of times a 272 px card plus a 16 px gap fits in the available width. No device list, no media query." },
      { type: 'paragraph', text: "If you like to see arithmetic as code, this is the same calculation in JavaScript. `Math.floor` rounds a number down to a whole number. `for (const w of widths)` means \"run the lines inside once for each width in the list, calling it w\". The function `columns` divides the width plus one gap by the card plus one gap and rounds down; `cardWidth` then shares what is left after the gaps among the columns. The four widths are the room inside the page's 16 px side margins on the four screens: 320 minus 32, 390 minus 32, 768 minus 32, and 1024 (the page's widest allowed size) minus 32." },
      {
        type: 'code',
        language: 'javascript',
        label: 'The grid\'s arithmetic as code',
        code: `function columns(width, minCard, gap) {
  return Math.floor((width + gap) / (minCard + gap));
}
function cardWidth(width, minCard, gap) {
  const n = columns(width, minCard, gap);
  return (width - (n - 1) * gap) / n;
}
const widths = [288, 358, 736, 992];
for (const w of widths) {
  console.log(w + 'px: ' + columns(w, 272, 16) + ' column(s)');
}`,
      },
      { type: 'heading', text: 'Mobile first, with breakpoints from content' },
      { type: 'paragraph', text: "Design the small screen first, because it forces you to keep only what matters, then let the layout grow. Add a **breakpoint** (a width where the layout changes) only when the content needs it, not for named devices. The clinic stylesheet has exactly one media query: at 48rem (768 px) and wider, the page title gets larger and the top padding grows. WCAG's reflow rule has the same spirit: content must work at a width of 320 CSS pixels, which is what a 1280 px window looks like at 400% zoom, without scrolling in two directions." },
      { type: 'heading', text: 'Test it, do not trust the preview' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Paste into the browser console at each width',
        code: `document.documentElement.scrollWidth > window.innerWidth
// true means the page is wider than the screen: it scrolls sideways`,
      },
      { type: 'prompt', label: 'A follow-up that uses measurements', text: "At 390 px wide the three doctor cards on the Find a doctor page are 112 px wide each, and the whole page is 397 px wide, so it scrolls sideways. Fix only the layout rules for the card list and the cards in styles.css. Use a grid with repeat(auto-fit, minmax(min(100%, 17rem), 1fr)) instead of fixed widths. Do not change colours, text or any other file. Afterwards, load the page at 320, 390, 768 and 1280 px and report the page width and the card width at each." },
      { type: 'warning', text: "Do not hide a sideways scroll with `overflow-x: hidden` on the page. The content is still too wide: it is just cut off, and a person on a small phone loses the part that disappears. Also avoid `user-scalable=no` in the viewport tag, which stops people with low vision from zooming in." },
      {
        type: 'version',
        text: "Checked in Chrome 158. The viewport tag `width=device-width, initial-scale=1` sets the layout width to the device's width; MDN advises against `user-scalable=no` and restrictive `maximum-scale`. `repeat(auto-fit, ...)` creates as many tracks as fit and collapses empty ones so items stretch. WCAG 2.2 SC 1.4.10 (Reflow, Level AA) requires content to work at 320 CSS pixels wide, with exceptions such as maps, diagrams and data tables.",
        checked: CHECKED,
        sources: [DOCS.mdnViewport, DOCS.mdnRepeat, DOCS.wcagReflow],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: the **viewport** is the part of the page you can see at once. **Responsive** means the same page rearranges itself to fit the viewport, like water taking the shape of whatever glass it is poured into. A **fixed width** is like a rigid tray: it does not bend, so on a narrow phone it either overflows or gets squashed. The grid rule above is the opposite: you tell the browser the smallest a card may be (272 px) and it works out how many fit. When you read the console line, `scrollWidth` is how wide the whole page is and `innerWidth` is how wide the window is. If the page is wider than the window, people have to scroll sideways, and that is the problem to fix.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Automate the sweep: load each key page at 320, 390, 768 and 1280 px, assert no horizontal overflow, and keep a baseline screenshot per width. Long words, URLs and wide data tables are common sources of overflow in real content, so test with real names and prices, not placeholder text. Container queries let a component respond to its own container rather than the window, which suits cards reused in different places (check browser support for your targets). Reserve space for images with an aspect ratio so the page does not jump while they load. Also test 200% text size and landscape: a sticky header that fits a tall phone can hide a focused control on a short one (WCAG 2.4.11).",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'To find what makes a page too wide, paste this in the console: [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > innerWidth). The elements it lists are the ones sticking out past the right edge.',
      },
      {
        type: 'takeaways',
        items: [
          'A page needs the viewport tag, or phones lay it out at a much wider width and shrink it.',
          'Fixed widths squeeze or overflow on small screens; flexible columns let the browser decide how many fit.',
          'Design the small screen first and add a breakpoint only where the content needs one.',
          'Measure at 320, 390, 768 and 1280 px and ask the AI for fixes using those measurements.',
          'Never hide a sideways scroll with overflow-x: hidden: fix the width that causes it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-05-predict-1',
          kind: 'predict-output',
          title: 'How many columns fit?',
          prompt: 'This does the same arithmetic as the grid rule: columns that are at least 272 px wide with a 16 px gap, then the width each card ends up. The numbers are the available widths measured for four screens. What does it print?',
          concept: 'responsive grid',
          language: 'javascript',
          code: "function columns(width, minCard, gap) {\n  return Math.floor((width + gap) / (minCard + gap));\n}\nfunction cardWidth(width, minCard, gap) {\n  const n = columns(width, minCard, gap);\n  return (width - (n - 1) * gap) / n;\n}\nconst widths = [288, 358, 736, 992];\nfor (const w of widths) {\n  console.log(`${w}px: ${columns(w, 272, 16)} column(s), cards ${cardWidth(w, 272, 16)}px`);\n}",
          expected: '288px: 1 column(s), cards 288px\n358px: 1 column(s), cards 358px\n736px: 2 column(s), cards 360px\n992px: 3 column(s), cards 320px',
          choices: [
            '288px: 1 column(s), cards 288px\n358px: 1 column(s), cards 358px\n736px: 2 column(s), cards 360px\n992px: 3 column(s), cards 320px',
            '288px: 1 column(s), cards 288px\n358px: 2 column(s), cards 171px\n736px: 2 column(s), cards 360px\n992px: 3 column(s), cards 320px',
            '288px: 1 column(s), cards 288px\n358px: 1 column(s), cards 358px\n736px: 3 column(s), cards 234.67px\n992px: 3 column(s), cards 320px',
            '288px: 1 column(s), cards 288px\n358px: 1 column(s), cards 358px\n736px: 2 column(s), cards 368px\n992px: 3 column(s), cards 330.67px',
          ],
          wrongNotes: {
            '288px: 1 column(s), cards 288px\n358px: 2 column(s), cards 171px\n736px: 2 column(s), cards 360px\n992px: 3 column(s), cards 320px': 'Two columns would need 272 + 16 + 272 = 560 px, and 358 is less than that, so only one column fits.',
            '288px: 1 column(s), cards 288px\n358px: 1 column(s), cards 358px\n736px: 3 column(s), cards 234.67px\n992px: 3 column(s), cards 320px': 'Three columns would need 3 x 272 + 2 x 16 = 848 px, and 736 is less than that, so only two fit.',
            '288px: 1 column(s), cards 288px\n358px: 1 column(s), cards 358px\n736px: 2 column(s), cards 368px\n992px: 3 column(s), cards 330.67px': 'The gaps use up width: the cards share the width left after the gaps, not the full width. 736 minus one 16 px gap, divided by two, is 360.',
          },
          hints: [
            'Each column needs 272 px, and the gaps between columns add 16 px each.',
            'columns() is how many times (272 + 16) fits into (width + 16), rounded down.',
            'At 736 px two columns fit (560 needed, 848 for three), and each card is (736 - 16) / 2 = 360.',
          ],
          explanation: 'The browser fits as many 272 px columns as it can, counting the gaps, then shares what is left: 1 column at 288 and 358, 2 at 736 and 3 at 992. These are the same card widths measured in Chrome for the improved page.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-05-scenario-1',
          kind: 'scenario',
          title: 'Which follow-up prompt fixes the squeezed cards?',
          prompt: 'The three doctor cards are 112 px wide on a 390 px phone and the page scrolls sideways. Pick the follow-up you would send.',
          concept: 'responsive layout',
          situation: 'The first draft is open in your browser at phone width. The page is 397 px wide on a 390 px screen. The cards sit in a row with a fixed width of 340 px each. You want the cards in one column on phones, and more columns when there is room.',
          options: [
            { text: 'Make it responsive.', consequence: 'The tool changes something, perhaps adding media queries for a few devices, but you cannot tell what, and the cards may still squeeze at a width it did not consider.', quality: 'poor' },
            { text: 'Add overflow-x: hidden to the body so it stops scrolling sideways.', consequence: 'The scrolling disappears, but the page is still too wide: the right-hand part of each card is simply cut off on a small phone.', quality: 'poor' },
            { text: 'Add a media query for iPhone 14 at 390 px that sets .card to width: 100%.', consequence: 'It fixes that one phone. At 320 px, on another phone, on a tablet or in landscape, the layout is still wrong, because you fixed a device and not the layout.', quality: 'acceptable' },
            { text: 'At 390 px the cards are 112 px wide and the page is 397 px wide. Change only the card list and card rules to a grid with repeat(auto-fit, minmax(min(100%, 17rem), 1fr)), keep everything else, and report page and card widths at 320, 390, 768 and 1280.', consequence: 'The tool changes the right rules, leaves colours and text alone, and reports numbers you can compare: one column on phones, two on a tablet, three on a laptop.', quality: 'best' },
          ],
          hints: [
            'Which prompt names the measured symptom and the exact element to fix?',
            'A fix for one phone model leaves other widths broken.',
            'Look for the one that also says what must not change and asks for a re-measure at several widths.',
          ],
          explanation: 'A good fix prompt states the measured symptom, limits the change to the elements involved, and asks for numbers at several widths. Hiding the overflow or fixing one device leaves the real problem in place.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-05-q1',
        prompt: 'A page without the viewport tag was laid out at 980 px on a 390 px phone. What does a visitor see?',
        choices: [
          'The page, shrunk to fit, with text too small to read comfortably',
          'The page at its normal size, with extra white space at the sides',
          'A blank page that must be reloaded',
          'The page in landscape view, with buttons larger than usual',
        ],
        answer: 0,
        explanation: 'The browser draws the page at the larger width and then scales it down to fit the screen, so everything appears tiny. The viewport tag tells it to use the real screen width instead.',
      },
      {
        id: 'ai-ui-ux-05-q2',
        prompt: 'Three cards each have width: 340px in a row. Why did they measure only 112 px wide on a 390 px phone?',
        choices: [
          "The phone reduced every width on the page by exactly one third because the screen was narrower than the cards were designed for",
          'The cards could not all fit, so the browser squeezed them into the space available',
          'Cards are always limited to 112 px on phones',
          'The cards were hidden behind the header',
        ],
        answer: 1,
        explanation: 'Items in a row shrink when there is not enough space, so three cards had to share about a phone\'s width. Using flexible columns lets the number of columns follow the space.',
      },
      {
        id: 'ai-ui-ux-05-q3',
        prompt: 'What does repeat(auto-fit, minmax(min(100%, 17rem), 1fr)) tell the browser?',
        choices: [
          'Always draw exactly three columns, each 17rem wide',
          'Draw one column on phones and three columns on every other device',
          'Make as many columns as fit, each at least 17rem wide (never wider than the container), sharing leftover room',
          "Hide any card that is narrower than 17rem and show a single message telling people to turn the phone to landscape instead",
        ],
        answer: 2,
        explanation: 'auto-fit makes as many columns as fit, minmax sets a minimum and lets them grow, and min(100%, 17rem) stops a column from exceeding a narrow container. The browser decides the count from the width.',
      },
      {
        id: 'ai-ui-ux-05-q4',
        prompt: 'The page scrolls sideways on a phone. Why is overflow-x: hidden on the page not a real fix?',
        choices: [
          "It slows the page down on slower phones, because the browser must keep checking every element's width on every frame",
          'Phones ignore it, so nothing changes',
          'The content is still too wide: it is just cut off, so part of it can no longer be reached',
          'It makes the text smaller than the limit',
        ],
        answer: 2,
        explanation: 'Hiding the overflow removes the scroll but not the cause. The part of a card that sticks out is cut off and unreachable. The fix is to remove the width that causes it.',
      },
      {
        id: 'ai-ui-ux-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does "responsive" mean for a web page?',
        choices: [
          "The page answers messages quickly",
          'The same page rearranges itself to fit the screen it is shown on',
          'The page is built only for phones',
        ],
        answer: 1,
        explanation: 'A responsive page changes its layout to suit the screen: one column on a small phone, more columns on a wider screen, with the same content throughout.',
      },
      {
        id: 'ai-ui-ux-05-q6',
        audience: { min: 'advanced' },
        prompt: 'Which setup best prevents layout regressions as agents change a stylesheet over weeks?',
        choices: [
          'A reviewer opens the page on their phone before merging',
          'An automated sweep that loads key pages at 320, 390, 768 and 1280 px, asserts no horizontal overflow and compares baseline screenshots',
          "A comment at the top of the stylesheet telling every agent never to break the layout, plus a reminder in the pull request template that reviewers read",
          'Testing only at the width where the developer works',
        ],
        answer: 1,
        explanation: 'A script gives the same check every time, across the widths that matter, and a baseline diff catches visual changes an assertion would miss. One phone, a comment or one width cannot.',
      },
    ],
    task: {
      title: 'Measure your screen at four widths',
      minutes: 15,
      steps: [
        'Open one screen you built at 320, 390, 768 and 1280 px (use your browser\'s device or responsive mode).',
        'At each width paste document.documentElement.scrollWidth > window.innerWidth into the console and write down true or false.',
        'If any width says true, send the follow-up prompt pattern from this lesson with your measured numbers and the element involved.',
        'Re-measure the four widths after the fix and record the result.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain what my page is doing at 320 px compared with 1280 px, in plain words, using the cards as the example."'] },
      { audience: { min: 'advanced' }, steps: ['Write a small script that loads your page at the four widths, fails if the page overflows sideways, and saves a screenshot per width as the baseline.'] },
    ],
  },
  {
    id: 'ai-ui-ux-06',
    day: 6,
    title: 'Accessibility from the start',
    summary: 'Get real buttons, labels, visible focus and clear errors into the first build, and check them with a keyboard and a two-minute audit.',
    intro: {
      objectives: [
        'Name the accessibility faults AI-generated pages most often contain',
        'Ask for real buttons, labels, headings and visible focus, and say what to avoid',
        'Run a two-minute keyboard and zoom check on any generated page',
      ],
      why: 'Accessibility is cheapest when it is in the first version, and AI tools often skip it unless you ask. The same work helps a person with low vision, a parent holding a baby and typing with one thumb, and anyone in bright sun.',
    },
    minutes: 30,
    skills: ['accessibility'],
    body: [
      { type: 'paragraph', text: "Accessibility means people can use the page however they get to it. Some zoom in because the text is small for them. Some cannot use a mouse or a touch screen and move through the page with the Tab key. Some listen to the page read aloud by a **screen reader**, a tool built into phones and computers. Some cannot tell red from green. Others are simply in bright sun, or holding a child. The standard that describes all this is WCAG 2.2, and Level AA is the usual target. The most useful thing to know is that most accessibility is not extra work. It is choosing the right plain HTML in the first place, and AI tools often choose the wrong one unless you say what you want." },
      { type: 'heading', text: 'What the first draft did, measured' },
      {
        type: 'table',
        headers: ['What the first draft did', 'What was measured', 'Why it matters'],
        rows: [
          ['Used divs and spans with a click handler as buttons', '11 of 14 "buttons" were not real buttons; pressing Tab reached only 3 of the 14', 'Keyboard and screen reader users cannot reach or press them'],
          ['Gave a div tabindex="0" as a quick fix', 'It could be focused, but Enter and Space did nothing (0 clicks); a real button fired once for each', 'A reachable control that does nothing is worse than a missing one'],
          ['Put role="button" on a div', 'A screen reader names it "button", but Tab skipped it', 'The role announces a promise the element cannot keep'],
          ['Used placeholders instead of labels', '3 of 3 boxes had no label; the hint disappeared as soon as typing began', 'People forget what the box was for'],
          ['Removed the focus outline for the whole page', 'The three focused boxes showed outline: none', 'Keyboard users cannot see where they are'],
          ['Had no headings or landmarks', '0 headings, no header or main element', 'Screen reader users cannot jump around the page'],
          ['Small controls', '6 of 14 controls were under 24 by 24 px, and all 14 under 44 px tall', 'Hard to press, and under the WCAG minimum'],
        ],
        caption: 'Measured on the first draft in Chrome 158 at 390 px, with the Tab key and Enter and Space presses. The improved page has none of these faults.',
      },
      { type: 'heading', text: 'The fixes are mostly plain HTML' },
      { type: 'paragraph', text: "Here is the booking form from the improved version. Everything in it is ordinary HTML, and each piece does a job a screen reader or a keyboard depends on." },
      {
        type: 'code',
        language: 'html',
        label: 'Part of the booking form (fragment)',
        code: `<div class="field">
  <label for="mobile">Mobile number</label>
  <input id="mobile" name="mobile" type="tel" inputmode="tel"
         autocomplete="tel" required
         aria-describedby="mobile-hint mobile-error">
  <p class="muted" id="mobile-hint">We text you a reminder the day before.</p>
  <p class="error" id="mobile-error" hidden>Enter a mobile number, for example 0917 123 4567.</p>
</div>
<button class="btn" type="submit">Confirm booking</button>`,
      },
      { type: 'paragraph', text: "Reading it: `label for=\"mobile\"` ties the visible words to the box with `id=\"mobile\"`, so clicking the words focuses the box and a screen reader says \"Mobile number\". `type=\"tel\"` and `inputmode=\"tel\"` bring up the number pad, and `autocomplete=\"tel\"` lets the phone fill the number in. `aria-describedby` links the hint and the error to the box, so they are read with it. `<button type=\"submit\">` is a real button: reachable with Tab and pressed by Enter or Space for free." },
      { type: 'paragraph', text: "The rest of the page follows the same idea. A `header` and a `main` mark the page's regions. One `h1` names the page and each doctor is an `h2`, giving headings to jump between. The time slots are radio buttons inside a `fieldset` with a `legend`, because choosing one of several is exactly what radio buttons are for. A native element gives you keyboard behaviour and a name for free. A div has to be taught each of those by hand." },
      { type: 'heading', text: 'Focus you can see' },
      {
        type: 'code',
        language: 'css',
        label: 'A visible keyboard focus ring (fragment)',
        code: `:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}`,
      },
      { type: 'paragraph', text: "`:focus-visible` shows the ring when the keyboard moves focus, and generally not when someone clicks with a mouse, so the page is clean for one group and clear for the other. Measured on the improved page, the keyboard shows a solid 3 px ring, the blue #1b4fd8, which is 6.65:1 against white. The `outline-offset` of 2 px puts a small gap between the button and the ring so it stays visible on a button of any colour. One more trap: a sticky header or cookie banner can hide a control that has focus. WCAG 2.2 added a rule against fully hiding the focused item." },
      { type: 'heading', text: 'Errors in words, announced' },
      { type: 'paragraph', text: "When I pressed Confirm on the empty form, the page wrote \"Please fix: Full name, Mobile number, Time.\" in a region that was already on the page with `role=\"alert\"` (so a screen reader announces it), marked the two empty boxes `aria-invalid=\"true\"`, and showed a sentence under each box. After filling everything in, the summary cleared and a separate `role=\"status\"` region said the booking was done. WCAG asks that an error is found and described in text, and that a status message can be announced without moving focus. Two details matter: the live region must exist before its text changes, and `alert` is the loud one, so use `status` for calm confirmations." },
      { type: 'prompt', label: 'Ask for accessibility up front, and for evidence', text: "Build the booking form as accessible HTML.\n- Use real <button>, <a>, <label for>, <fieldset> and <legend> elements. No clickable divs. Do not add ARIA where a native element does the job.\n- Every input has a visible label; placeholders are only for examples.\n- Keep a visible keyboard focus ring using :focus-visible with at least 3:1 contrast. Never write outline: none without a replacement.\n- Errors appear as text next to the field, linked with aria-describedby, and a summary appears in a live region that is already on the page.\n- Controls at least 44 px tall.\nAfterwards, list every interactive element and say how a keyboard user reaches and presses it." },
      { type: 'heading', text: 'A two-minute check anyone can do' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Keyboard:** put the mouse away and press Tab through the page. Can you reach every control, in a sensible order, and see where you are? Do Enter and Space press things?',
          '**Zoom:** zoom the page to 200% and resize the window narrow. Does anything disappear or need sideways scrolling?',
          '**Colour:** squint, and recompute the contrast of anything pale. Is any meaning shown by colour alone?',
          '**Screen reader:** turn on your phone\'s built-in screen reader for one minute and move through the page. Does each control have a name that makes sense?',
          '**Motion:** do loading animations stop when the system asks for reduced motion?',
        ],
      },
      { type: 'warning', text: "An automated accessibility scan, or the little script behind this lesson's numbers, finds only part of the problems and is not a conformance audit. A page can pass every automated check and still be confusing with a keyboard or screen reader. Treat tools as a fast first pass and keep the manual two-minute check." },
      {
        type: 'version',
        text: "WCAG 2.2 Level AA asks for a visible keyboard focus indicator (SC 2.4.7) and, new in 2.2, that a focused item is not fully hidden by other content (SC 2.4.11). Errors must be identified in text (SC 3.3.1, Level A), status messages must be exposed without moving focus (SC 4.1.3, AA), and structure shown visually must be available in the code, for example headings and labels (SC 1.3.1, A). MDN: :focus-visible matches focus the browser decides should be visible; role=status is polite and role=alert is assertive and meant for urgent messages.",
        checked: CHECKED,
        sources: [DOCS.wcagFocusVisible, DOCS.wcagFocusObscured, DOCS.wcagErrors, DOCS.wcagStatus, DOCS.wcagInfo, DOCS.mdnFocusVisible, DOCS.mdnLabel, DOCS.mdnStatus, DOCS.mdnAlert],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: **keyboard focus** is the control the keyboard is currently pointing at, like a cursor for people who do not use a mouse, and the **focus ring** is the outline that shows it. **Semantic** HTML means choosing the element that says what the thing is: a button for pressing, a label for naming a box, a heading for a title. Screen readers and keyboards understand those names. In the form code above, the label is tied to the box by matching words (`for` and `id`), the hint and the error are tied to the box by `aria-describedby`, and the button is a real button. **ARIA** is a set of extra words you can add to HTML to describe things for screen readers. You rarely need it if you pick the right element first.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Beyond markup, the failures that survive scanners are about behaviour: focus management when content changes (move focus to the first invalid field or to a dialog's heading, and return it when it closes), accessible names for icon-only buttons, and live regions used with care, since `alert` interrupts and is easy to overuse. The improved form announces errors but leaves focus on the submit button; moving it to the first invalid field would be a stronger design. Put accessibility in the definition of done: native elements first, an automated scan in CI, and a keyboard-and-screen-reader pass on each new interaction pattern. Give agents the rules in the instructions file, and review generated components for the one thing a scanner cannot see: whether the keyboard order makes sense.",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: "Chrome's DevTools can show an element's accessible name and role in its Accessibility pane. Inspect your icon buttons and form boxes: if the name is empty or wrong, a screen reader user hears nothing useful.",
      },
      {
        type: 'takeaways',
        items: [
          'Use native elements: real buttons, links, labels, headings and fieldsets give keyboard behaviour and names for free.',
          'A div with tabindex still ignores Enter and Space, and role="button" does not make a div reachable, so replace it with a button.',
          'Never remove the focus outline without a better one: use :focus-visible with at least 3:1 contrast.',
          'Write errors in words next to the field and in an existing live region, and never rely on colour alone.',
          'Check with a keyboard, a 200% zoom and a short screen reader pass; scanners find only part of the problems.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-06-fix-bug-1',
          kind: 'fix-bug',
          title: 'The button that Tab skips',
          prompt: 'In this AI draft, pressing Tab skips the Book button entirely, and a screen reader does not call it a button. Tap the line with the problem, then pick the fix.',
          concept: 'native elements',
          language: 'html',
          code: "<div class=\"card\">\n  <h2>Dr. Ana Reyes</h2>\n  <div class=\"btn\" onclick=\"book('reyes')\">Book Dr. Reyes</div>\n</div>",
          bugLine: 3,
          fixes: [
            { line: "  <button type=\"button\" class=\"btn\" onclick=\"book('reyes')\">Book Dr. Reyes</button>", correct: true, why: 'A real button is reachable with Tab, pressed by Enter and Space, and announced as a button, with no extra code.' },
            { line: "  <div class=\"btn\" tabindex=\"0\" onclick=\"book('reyes')\">Book Dr. Reyes</div>", correct: false, why: 'Tab now reaches it, but Enter and Space do nothing: a div ignores the keys unless you write the handling yourself.' },
            { line: "  <div class=\"btn\" role=\"button\" onclick=\"book('reyes')\">Book Dr. Reyes</div>", correct: false, why: 'A screen reader will say "button", but Tab still skips it, so keyboard users cannot reach what it promises.' },
            { line: "  <span class=\"btn\" onclick=\"book('reyes')\">Book Dr. Reyes</span>", correct: false, why: 'Changing the tag from div to span changes nothing: it is still not focusable and not a button.' },
          ],
          hints: [
            'Which line makes the Book control, and what kind of element is it?',
            'A click handler on a div does not make a div reachable or announceable as a button.',
            'The element that does both for free is called button.',
          ],
          explanation: 'Real buttons come with keyboard focus, Enter and Space, and the right name for screen readers. Adding tabindex or a role to a div supplies only one piece each, and a span does not help at all.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-06-fix-bug-2',
          kind: 'fix-bug',
          title: 'The invisible keyboard focus',
          prompt: 'Keyboard users cannot see which button has focus on this page. Tap the line that causes it, then pick the best fix.',
          concept: 'focus visible',
          language: 'css',
          code: ".btn {\n  min-height: 2.75rem;\n}\nbutton:focus { outline: none; }",
          bugLine: 4,
          fixes: [
            { line: 'button:focus-visible { outline: 3px solid #1b4fd8; outline-offset: 2px; }', correct: true, why: 'A thick, high-contrast ring (about 6.65:1 on white) appears for keyboard focus, and mouse clicks stay clean.' },
            { line: 'button:focus { outline: 1px dotted #dddddd; }', correct: false, why: 'The ring is thin and #dddddd on white is about 1.36:1, far below the 3:1 a focus indicator needs.' },
            { line: 'button:focus { background: #f5f5f5; }', correct: false, why: 'A faint tint change is not a clear indicator, and with the outline removed nothing else shows where focus is.' },
            { line: 'button:focus { outline: none; box-shadow: none; }', correct: false, why: 'This still removes every indicator, so the problem is unchanged.' },
          ],
          hints: [
            'Which rule turns off the browser\'s focus ring?',
            'You need a visible replacement with at least 3:1 contrast, and :focus-visible keeps mouse clicks clean.',
            'Use :focus-visible with a thick solid outline in a strong colour, such as 3px solid #1b4fd8.',
          ],
          explanation: 'Removing the outline leaves keyboard users blind. The fix is a clearly visible replacement, shown with :focus-visible so it appears for keyboard focus and not for mouse clicks.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-06-q1',
        prompt: 'An AI draft uses <div class="btn" tabindex="0" onclick="...">. In the measurements, what happened when a keyboard user focused it and pressed Enter or Space?',
        choices: [
          "It was activated by Enter but not by Space, the way a link behaves, so only half of the keyboard users could use it",
          'Nothing happened: a div does not respond to Enter or Space unless you add that handling',
          'It was activated exactly like a real button',
          'The browser showed an error message in the page',
        ],
        answer: 1,
        explanation: 'tabindex made the div focusable, but activation by Enter and Space is built into button, not div. In the measurements the div recorded zero clicks and a real button fired once per key.',
      },
      {
        id: 'ai-ui-ux-06-q2',
        prompt: 'Why is a placeholder not a replacement for a label?',
        choices: [
          "Placeholders are not allowed in forms by WCAG, so any page that uses one fails the standard at Level A straight away and must be rebuilt",
          'Placeholders cannot contain more than one word',
          'The placeholder disappears once typing begins, so the person loses the field\'s name; a label stays visible and is tied to the box',
          'Placeholders make the box too wide on phones',
        ],
        answer: 2,
        explanation: 'In the measurement the placeholder was gone as soon as text was typed. A label stays on the page, is linked to the box, and focuses it when pressed. Placeholders are still fine for an example format.',
      },
      {
        id: 'ai-ui-ux-06-q3',
        prompt: 'What does :focus-visible do?',
        choices: [
          'Shows the focus outline for keyboard focus and generally not for mouse clicks',
          "Hides the focus outline on every control on the page so the design looks cleaner, as long as the text contrast is high",
          'Makes controls larger while they have focus',
          'Plays a sound when a control gets focus',
        ],
        answer: 0,
        explanation: 'It matches focus the browser decides should be visible, which is keyboard navigation, so you can style a strong ring without it appearing after every mouse click.',
      },
      {
        id: 'ai-ui-ux-06-q4',
        prompt: 'A form field is empty and the user presses Confirm. Which design handles it best?',
        choices: [
          'Turn the box border red',
          "Show a red star next to the field name and nothing else, because the colour red already tells every person that something is wrong with this field",
          'Write the problem in words next to the box, linked with aria-describedby, and announce a summary in a live region that already exists',
          'Reload the page and clear everything the person typed',
        ],
        answer: 2,
        explanation: 'Errors must be identified in text, not just colour, and a live region lets a screen reader announce the problem without moving focus. The other designs leave people guessing what went wrong.',
      },
      {
        id: 'ai-ui-ux-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a screen reader?',
        choices: [
          "A zoom feature that makes the page larger",
          'A tool that reads out what is on the screen and lets people move through it without looking',
          'A filter that blocks bright screens at night',
        ],
        answer: 1,
        explanation: 'A screen reader speaks the page aloud: headings, buttons, labels and text. It depends on the page using the right HTML elements, which is why a real button matters.',
      },
      {
        id: 'ai-ui-ux-06-q6',
        audience: { min: 'advanced' },
        prompt: 'After a failed form submit, the page announces errors in a live region, but a keyboard user must still Tab back through the page to find the first invalid field. What would improve it most?',
        choices: [
          'Move focus to the first invalid field after the failed submit, so the summary and the place to act arrive together',
          "Make the alert louder by adding the word \"error\" three times and moving it to the top of the page, so that it is the first thing read",
          'Reload the page so the user starts again from the top',
          'Remove the live region and rely only on a red border',
        ],
        answer: 0,
        explanation: 'Announcing a problem is only half the job; moving focus to the first invalid field lets keyboard and screen reader users fix it immediately. Reloading or removing the live region makes it worse.',
      },
    ],
    task: {
      title: 'Run the two-minute check on a generated page',
      minutes: 15,
      steps: [
        'Open a page an AI tool generated (the first draft from lesson 1, or one of your own).',
        'Put the mouse away and Tab through it. Write down every control you could not reach and every place you could not see the focus.',
        'Zoom to 200% and narrow the window. Note anything that disappears or scrolls sideways.',
        'Send the accessibility prompt from this lesson with your notes, then repeat the Tab walk on the result.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain in plain words what each accessibility fix you made does and who it helps." Check that you can say the same about the label and the button.'] },
      { audience: { min: 'advanced' }, steps: ['Add an automated accessibility scan and a Tab-order test to your CI run, and list one behaviour (focus after an error, a dialog\'s focus return) that you still verify by hand.'] },
    ],
  },
  {
    id: 'ai-ui-ux-07',
    day: 7,
    title: 'Reusable components and a small design system',
    summary: 'Turn repeated pieces into components and repeated values into tokens, so one change reaches the whole app and the AI stays inside your system.',
    intro: {
      objectives: [
        'Explain what design tokens and components are and why they stop drift',
        'Read a small component and ask AI to extract one without changing the look',
        'Check a generated change for hard-coded colours and one-off values',
      ],
      why: 'AI writes each screen as if it were the first, so the same card appears three times with small differences and colours are scattered everywhere. A tiny design system lets you change the brand once and keeps every new screen consistent.',
    },
    minutes: 28,
    skills: ['design-system'],
    body: [
      { type: 'paragraph', text: "Ask an AI tool for three screens, one after another, and each one gets built from scratch. The doctor card on screen one has 12 px of padding, the one on screen three has 14 px. The teal is #0d9488 here and #0f766e there. When the clinic decides on a new brand colour, someone has to hunt through every file. The first draft in this course shows the early signs: its stylesheet contained 16 colour values scattered through the rules, and the doctor card was written out three times. A **design system** fixes this, and a small one is nothing grander than two lists: the named values you reuse, and the named pieces you reuse." },
      { type: 'heading', text: 'Tokens: name the decisions' },
      { type: 'paragraph', text: "A **design token** is a named value for a design decision: a colour, a text size, a space, a corner radius. In CSS they are custom properties, written with two dashes and read with `var()`. You define them once, on `:root` (the whole page), and every rule uses the name, never the raw value. Name them by role, not by appearance: `--color-brand`, not `--color-teal`, because the role stays true when the colour changes." },
      {
        type: 'code',
        language: 'css',
        label: 'Part of the clinic tokens (fragment)',
        code: `:root {
  --color-brand: #0b6e6a;
  --color-on-brand: #ffffff;
  --color-ink: #16302f;
  --text-md: 1rem;
  --text-xl: 1.75rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius: 0.75rem;
  --tap: 2.75rem;
}
.btn {
  min-height: var(--tap);
  background: var(--color-brand);
  color: var(--color-on-brand);
  border-radius: var(--radius);
}`,
      },
      { type: 'paragraph', text: "Reading it: the top block declares the values once. The `.btn` rule never says a colour or a size. It asks for the tap size, the brand colour and the radius by name, so changing `--color-brand` restyles every button. In the improved clinic stylesheet all 11 hex colours sit in that one `:root` block, and a search for hex colours elsewhere finds none." },
      { type: 'paragraph', text: "To see the payoff, I changed one line: `--color-brand` from #0b6e6a to the prettier teal #0d9488. The brand colour changed in all 6 places that use it at once. Re-running the contrast audit then showed exactly which things broke: white text on the new teal measured 3.74:1, so the header name, the two Book buttons and, at 3.43:1, the outlined \"See next free day\" button all failed. One edit, one place, one re-run." },
      { type: 'heading', text: 'Components: name the pieces' },
      { type: 'paragraph', text: "A **component** is a named piece of interface that you build once and use many times. In React, which most AI tools reach for, a component is a function that returns a piece of the page, its name starts with a capital letter, and the details you hand it are called **props**. Here are three components that rebuild the doctor list. I rendered them with React 19.3.1, and the markup they produce matched the hand-written page character for character, so the audit numbers were identical: no text under 4.5:1, nothing sideways at 390 px, every target at least 44 px tall." },
      {
        type: 'code',
        language: 'jsx',
        label: 'Three small components',
        code: `function Button({ href, variant = 'primary', children }) {
  const className = variant === 'ghost' ? 'btn btn--ghost' : 'btn';
  return <a className={className} href={href}>{children}</a>;
}

function StatusBadge({ free }) {
  return (
    <p className={free ? 'badge badge--ok' : 'badge badge--bad'}>
      <span aria-hidden="true">{free ? '✓' : '✕'}</span>
      {free ? ' Free today' : ' Fully booked today'}
    </p>
  );
}

function DoctorCard({ name, specialty, fee, free, short }) {
  return (
    <li className="card">
      <h2>{name}</h2>
      <p className="muted">{specialty}</p>
      <p className="fee">₱{fee} per visit</p>
      <StatusBadge free={free} />
      <Button href="book.html" variant={free ? 'primary' : 'ghost'}>
        {free ? 'Book ' + short : 'See next free day'}
      </Button>
    </li>
  );
}


// Using it: one component, three cards
// <ul className="grid">
//   {doctors.map((d) => <DoctorCard key={d.name} {...d} />)}
// </ul>`,
      },
      { type: 'paragraph', text: "Line by line: `Button` takes a destination, a `variant` (primary unless told otherwise) and its children (the words inside), and picks a class name from the variant. `StatusBadge` shows a tick or a cross, hidden from screen readers because the words beside it carry the meaning. `DoctorCard` puts a name, specialty, fee, badge and one button together. The decisions made in the earlier lessons now live inside these pieces: the button is a real link or button, the badge never relies on colour alone, and the card has exactly one action. Every new screen that uses them gets those decisions for free. A component can also choose its class names from its props:" },
      {
        type: 'code',
        language: 'javascript',
        label: 'How a component can pick class names from props',
        code: `function buttonClass(variant, disabled) {
  const names = ['btn'];
  if (variant === 'ghost') names.push('btn--ghost');
  if (disabled) names.push('btn--disabled');
  return names.join(' ');
}
console.log(buttonClass('ghost', false));`,
      },
      { type: 'paragraph', text: "`names` starts as a list with one word. `push` adds a word to the end of the list when a condition is true. `join(' ')` glues the list into one string with spaces between the words. The last line prints `btn btn--ghost`. A \"variant\" is just a named option like this, and a good component offers a few, not unlimited ones." },
      { type: 'heading', text: 'Asking AI to extract, not redesign' },
      { type: 'prompt', label: 'Extract a component without changing the look', text: "In the Find a doctor page, the doctor card is written three times. Extract one DoctorCard component (and a Button and a StatusBadge it uses) that takes name, specialty, fee, free and short as props.\n\nRules:\n- The rendered markup and the appearance must not change at all.\n- Use only the CSS variables in styles.css. Do not introduce any new hex colour, pixel value or font size.\n- Keep real <a> and <button> elements and the tick/cross plus words for status.\n- List every file you changed.\nThen show me the output of: grep -nE '#[0-9a-fA-F]{6}' styles.css, so I can see all colours still live in :root." },
      { type: 'paragraph', text: "That last line is the habit that keeps a system honest. After every AI change, search the diff for raw colours and pixel values outside the token block. In the improved stylesheet that search returns 11 matches, every one a `--color-` line inside `:root`. A new match elsewhere means the AI invented a value." },
      { type: 'warning', text: "AI tools drift. Asked for a new screen, they often add a fresh colour, a new padding or a slightly different button instead of reusing yours. Put the rule in your project's instructions file (CLAUDE.md, AGENTS.md or Cursor rules), such as \"use only the tokens and components in this project\", and still check each change." },
      {
        type: 'version',
        text: "React 19 (rendered here with react 19.3.1): a component is a JavaScript function that returns markup, and its name must start with a capital letter or it is treated as an HTML tag. Props are how a parent passes information to a child; they are read-only, and a default can be set in the parameter, as with variant above. CSS custom properties are declared with a double dash, usually on :root, and read with var(), which accepts a fallback value.",
        checked: CHECKED,
        sources: [DOCS.reactComponent, DOCS.reactProps, DOCS.mdnVars],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a **token** is a name for a value, like the names on a paint chart. Instead of saying \"that exact teal\" everywhere, you say \"brand\", and the chart says which teal that is today. Change the chart, and everything that uses the name changes. A **component** is like a cookie cutter: you make the shape once and press out as many cookies as you need, and if you improve the cutter, every new cookie improves. **Props** are the details you hand the cutter each time, such as the doctor's name and fee. You do not have to write these; your job is to ask for them, read them well enough to spot \"hard-coded\" values (a raw colour or number inside a rule where a token name should be), and run the search from this lesson to check.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Grow the tokens in layers: raw palette values, then semantic roles that point at them (brand, ink, surface, focus), then per-component tokens only where needed. Theming then means swapping the semantic layer, which is also where contrast is tested. Treat component props as an API: use unions for variants rather than free strings, make accessibility part of the contract (a button cannot render without an accessible name, a field cannot render without a label), and version and document changes the way you would a library. Back it with enforcement: a lint rule against colour literals outside the token file, visual regression tests per component state, and a component catalogue so reviewers see every variant. For agents, the instructions file points at the system and a failing check is the guardrail.",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: "To find components waiting to be extracted, search for markup that repeats with small differences: for example count how many times class=\"card\" appears in your pages. Anything repeated three or more times with the same structure is a candidate.",
      },
      {
        type: 'takeaways',
        items: [
          'Tokens are named design decisions (colour, size, space, radius), defined once and used by name, so one change reaches everything.',
          'Name tokens by role, such as brand and ink, not by appearance, such as teal.',
          'Components are named, reusable pieces, and they carry your accessibility decisions with them.',
          'Ask the AI to extract components without changing the look, and to use only existing tokens.',
          'After each AI change, search the diff for raw colours and pixel values outside the token block.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-07-predict-1',
          kind: 'predict-output',
          title: 'Which classes does the button get?',
          prompt: 'This component picks class names from its props. Four calls are made, with the second and third arguments sometimes left out. What does it print? (A missing argument is simply undefined.)',
          concept: 'component variants',
          language: 'javascript',
          code: "function buttonClass(variant, disabled) {\n  const names = ['btn'];\n  if (variant === 'ghost') names.push('btn--ghost');\n  if (disabled) names.push('btn--disabled');\n  return names.join(' ');\n}\nconsole.log(buttonClass('primary', false));\nconsole.log(buttonClass('ghost', false));\nconsole.log(buttonClass('ghost', true));\nconsole.log(buttonClass());",
          expected: 'btn\nbtn btn--ghost\nbtn btn--ghost btn--disabled\nbtn',
          choices: [
            'btn\nbtn btn--ghost\nbtn btn--ghost btn--disabled\nbtn',
            'btn btn--primary\nbtn btn--ghost\nbtn btn--ghost btn--disabled\nbtn',
            'btn\nbtn btn--ghost\nbtn--ghost btn--disabled\nbtn',
            'btn\nbtn btn--ghost\nbtn btn--ghost btn--disabled\nundefined',
          ],
          wrongNotes: {
            'btn btn--primary\nbtn btn--ghost\nbtn btn--ghost btn--disabled\nbtn': 'Only the ghost variant adds a second class. Any other variant, including "primary", leaves just "btn".',
            'btn\nbtn btn--ghost\nbtn--ghost btn--disabled\nbtn': 'The list always starts with "btn", so "btn" is still first in the third line.',
            'btn\nbtn btn--ghost\nbtn btn--ghost btn--disabled\nundefined': 'The function always returns the joined list, which for no arguments is just "btn". It never returns undefined.',
          },
          hints: [
            'The list always starts with btn. Which conditions add more words?',
            'A missing variant is not "ghost" and a missing disabled is falsy, so neither adds anything.',
            'Only ghost adds btn--ghost, and only a true second argument adds btn--disabled.',
          ],
          explanation: 'Each call starts from [\'btn\'] and adds a word only when its condition is true. join(\' \') then glues the words together, so the result is btn, then btn btn--ghost, then btn btn--ghost btn--disabled, and btn again when nothing is passed.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-07-arrange-1',
          kind: 'arrange',
          title: 'Introduce tokens without breaking the look',
          prompt: 'Order the steps for moving a generated stylesheet to design tokens safely.',
          concept: 'design tokens',
          language: 'text',
          solution: [
            'Take a screenshot and run the audit so you have a baseline',
            'Ask the AI to list every colour, size and space the stylesheet uses',
            'Ask it to move each repeated value into a named token on :root',
            'Search the stylesheet for raw values left outside :root',
            'Reload, compare with the baseline and re-run the audit',
          ],
          reasons: [
            'Capture how it looks and measures now, so you can prove nothing changed.',
            'You need an inventory before you decide which values deserve a name.',
            'Only now change the code, moving values into tokens without changing them.',
            'Check that nothing was missed and no new value was invented.',
            'Compare the result with the baseline you took at the start.',
          ],
          hints: [
            'You cannot show that nothing changed unless you record how it was first.',
            'Inventory, then change, then check for leftovers, then compare.',
            'Baseline first, comparison last.',
          ],
          explanation: 'A safe refactor starts with a baseline, takes inventory, changes one kind of thing, checks for leftovers and compares with the baseline. The aim is a system where the screen looks exactly the same.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-07-q1',
        prompt: 'Why name a token --color-brand rather than --color-teal?',
        choices: [
          'CSS does not allow colour names in token names',
          "Browsers apply role names faster than colour names, because a role is looked up in a table and a colour has to be parsed",
          'Teal is a protected word in CSS and cannot be used',
          'The role stays true if the brand changes to purple, while the name teal would then be wrong',
        ],
        answer: 3,
        explanation: 'A role says what the colour is for, so the name survives a redesign. A colour name becomes misleading the day the colour changes. CSS has no rule against either, and speed is not affected.',
      },
      {
        id: 'ai-ui-ux-07-q2',
        prompt: 'You change --color-brand to a prettier teal and re-run the contrast audit, which now reports four text failures. What does this show?',
        choices: [
          "Tokens made the page worse, so hard-coding every colour in every rule would have been safer and easier to test later",
          'The audit is unreliable after any colour change',
          'One edit reached every use, and the audit immediately showed which pairs no longer pass',
          'The failures are cosmetic, since brand colours are exempt from contrast rules',
        ],
        answer: 2,
        explanation: 'The single change restyled all six uses at once, and the audit pointed to the four pairs that now fail (3.74:1 and 3.43:1). That fast feedback is the benefit. Brand colours are not exempt on buttons and text.',
      },
      {
        id: 'ai-ui-ux-07-q3',
        prompt: 'After an AI change, which check best tells you it stayed inside the design system?',
        choices: [
          'Search the stylesheet for raw colour and pixel values outside the token block',
          "Ask the AI whether it stayed inside the design system, and accept its answer when it says that it did so",
          'Check that the page still has the same number of lines',
          'Open the page once on a large monitor',
        ],
        answer: 0,
        explanation: 'A search is mechanical and cannot be talked out of the answer: any raw value outside :root is a value the AI invented. The AI\'s own statement is a claim, and line counts or one monitor do not show consistency.',
      },
      {
        id: 'ai-ui-ux-07-q4',
        prompt: 'In the React example, why is the StatusBadge tick or cross given aria-hidden="true"?',
        choices: [
          "Screen readers cannot read symbols of any kind, so every tick and cross on a page would otherwise be skipped",
          'The words beside it carry the meaning, so reading the symbol as well would repeat it',
          'Hiding it from everyone makes the page load faster',
          'It stops the symbol from being clicked by mistake',
        ],
        answer: 1,
        explanation: 'The words "Free today" or "Fully booked today" say everything; the tick or cross is an extra visual cue for sighted people, so it is hidden from screen readers to avoid noise. It does not change loading or clicking.',
      },
      {
        id: 'ai-ui-ux-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a component?',
        choices: [
          'A named piece of interface you build once and reuse, like a cookie cutter',
          "A file that stores every colour used on a page",
          'A rule that stops a page from changing size',
        ],
        answer: 0,
        explanation: 'A component is a reusable piece, such as a doctor card, that you define once and use wherever it is needed. Improve the piece and every use improves.',
      },
      {
        id: 'ai-ui-ux-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Which design best keeps accessibility from regressing as many people and agents add components?',
        choices: [
          'A style guide page that asks everyone to remember the rules',
          'Reviewing every component by eye on the largest screen',
          'Component APIs that cannot omit what is required (a button needs a name, a field needs a label), plus lint rules and per-state visual and accessibility tests in CI',
          "Letting each team write its own buttons in whatever way suits their screen, and checking all of them with a full accessibility audit once a year by an outside specialist",
        ],
        answer: 2,
        explanation: 'Making the unsafe state impossible to write, and checking states automatically, scales better than memory or occasional review. A style guide and annual audits both decay.',
      },
    ],
    task: {
      title: 'Add tokens and one component to a page',
      minutes: 18,
      steps: [
        'Take a page you generated and list its colours, text sizes and spacing with the AI (or by searching the stylesheet).',
        'Ask the AI to move them into tokens on :root named by role, without changing how the page looks.',
        'Ask it to extract one repeated piece (a card or a button) into a component, with the extraction prompt from this lesson.',
        'Search for raw colour and pixel values outside the token block and fix any the AI left behind.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Change one token (for example the brand colour) and watch the whole page change. Ask the AI to explain which rules used that token.'] },
      { audience: { min: 'advanced' }, steps: ['Add a lint or test rule that fails on colour literals outside the token file and on any contrast pair below its threshold.'] },
    ],
  },
  {
    id: 'ai-ui-ux-08',
    day: 8,
    title: 'States people forget: loading, empty and error',
    summary: 'List every state a screen can be in, ask AI to design the loading, empty and error versions, and write the words people read when things go wrong.',
    intro: {
      objectives: [
        'List the states a screen can be in besides "everything loaded"',
        'Ask AI to design loading, empty and error states with plain words and one next step',
        'Spot code that only handles the happy path',
      ],
      why: 'AI shows you the screen with data on it, because that is the one that looks good in a chat. Real people meet the other states on a slow connection, on their first visit and on a bad day, and those are the moments they decide whether to trust your app.',
    },
    minutes: 25,
    skills: ['ui-states'],
    body: [
      { type: 'paragraph', text: "Ask an AI tool for a My appointments screen and you will get one with two appointments on it. It looks finished. But every screen that shows data has other versions. Before the data arrives, there is **loading**. A new patient who has not booked yet sees **empty**. When the connection drops or the server fails, there is **error**. A first draft usually builds only the one that looks good. This lesson is about asking for all of them up front, and about the words that go in them, because those are the screens people meet when something is already going slightly wrong." },
      { type: 'heading', text: 'What the happy-path code does when it meets the others' },
      { type: 'paragraph', text: "A typical draft turns a list of appointments into text with one line of code: `appointments.map((a) => a.time).join(', ')`. I ran that line in V8, the JavaScript engine Chrome uses, with three inputs. A list of two times worked. An empty list returned an empty string, which on screen is a blank gap with no explanation. And before the data arrived (the list does not exist yet, so it is `undefined`) it crashed with \"Cannot read properties of undefined (reading 'map')\". On a phone, a crash like that usually means a white screen. None of those cases looks wrong in a screenshot of the happy path." },
      { type: 'heading', text: 'The four states of a data screen' },
      {
        type: 'table',
        headers: ['State', 'The person is thinking', 'What the screen must do', 'What was built and measured'],
        rows: [
          ['Loading', 'Is anything happening?', 'Show that it is working, in shape and in words, and keep the layout steady', 'Grey placeholder cards plus the words "Loading your appointments…" in a status region; the pulse stops when the system asks for reduced motion'],
          ['Empty', 'Is this broken, or is there just nothing?', 'Say it is normal, and offer the one next step', 'The heading "No appointments yet", one sentence, and a single button, Find a doctor'],
          ['Error', 'What went wrong, and is my data safe?', 'Say what happened in plain words, whether anything was lost, and what to do', 'An alert with a heading, two plain sentences and a Try again button'],
          ['Ready', 'What do I do next?', 'Show the data and the main action', 'The list of appointments'],
        ],
        caption: 'All four states of the appointments page were measured at 390 px: no text under 4.5:1, no sideways scroll and every control at least 44 px tall.',
      },
      { type: 'paragraph', text: "Notice that the empty state is not an apology. \"No appointments yet\" is true and calm, and the button takes the person to the thing they probably want. The error state is not blame or jargon either. \"Error 500: request failed\" tells a parent nothing. \"We could not load your appointments. Check your connection and try again. Nothing you booked was lost.\" says what happened, reassures, and offers an action. (That last sentence is only right if your app really keeps their bookings safe. Write only what is true.)" },
      { type: 'heading', text: 'Handle the order in the code, too' },
      { type: 'paragraph', text: "A screen needs one place that decides which state it is in. The order of the checks matters: look for failure first, then for \"data has not arrived\", and only then look inside the data." },
      {
        type: 'code',
        language: 'javascript',
        label: 'Deciding the state',
        code: `function describe(appointments, failed) {
  if (failed) return 'error';
  if (appointments === undefined) return 'loading';
  if (appointments.length === 0) return 'empty';
  return 'ready';
}
console.log(describe(undefined, false)); // loading
console.log(describe([], false));        // empty
console.log(describe(['9:00'], false));  // ready
console.log(describe(undefined, true));  // error`,
      },
      { type: 'paragraph', text: "Reading it: the function receives the list (which may not exist yet) and whether the request failed. It checks `failed` first. Then `appointments === undefined` means the data has not arrived. Only after that is it safe to ask for `appointments.length`, because the list exists. If you swapped the second and third checks, the function would crash on a list that has not arrived, exactly like the one-line example. One more piece of notation: `&&` means \"and\". In `list && list.length === 0` the right side is only read when the left side is true, so an undefined list is never asked for its length." },
      { type: 'heading', text: 'Ask for the states before the screen' },
      { type: 'prompt', label: 'List the states first', text: "For the My appointments screen, before writing any code, list every state it can be in (loading, empty, error, ready, and anything else that applies, such as offline or slow). For each state tell me: what the person is thinking, what the screen shows, the exact words, and the one action offered.\n\nThen build all of them as plain HTML and CSS using the existing tokens and components. Requirements: the loading state has visible words and a placeholder that stops pulsing under prefers-reduced-motion; the error state is announced to screen readers and has a Try again button at least 44 px tall; the empty state offers one action; every state works at 320 px. Add a way for me to switch between the states, such as a ?state= setting in the address." },
      { type: 'warning', text: "Do not let an AI invent reassurance. \"Your booking is safe\" or \"We'll email you shortly\" are promises about how your app works, and a generated screen has no idea whether they are true. Review every sentence in a state for claims your app cannot keep." },
      {
        type: 'version',
        text: "MDN: role=status is a polite live region for advisory updates and role=alert is assertive for urgent ones; aria-busy=\"true\" tells assistive technology a region is still being updated so it can wait before announcing. The prefers-reduced-motion media query lets a page tone down or stop motion such as a pulsing placeholder. WCAG 2.2 SC 4.1.3 (Status Messages, Level AA) asks that status messages be exposed to assistive technology without moving focus.",
        checked: CHECKED,
        sources: [DOCS.mdnStatus, DOCS.mdnAlert, DOCS.mdnBusy, DOCS.mdnReducedMotion, DOCS.wcagStatus],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a **state** is one of the different situations a screen can be in. A shop has them too: the shelf is stocked, the shelf is empty, or the delivery truck has not arrived. A good shopkeeper has something sensible to say in each case. An **empty state** is the screen a new person sees before they have any data. A **loading state** is what shows while the data is on its way. In the code above, `undefined` means \"there is no list yet\", and `[]` means \"there is a list and it has nothing in it\". Those are different situations, so the code checks `undefined` before it looks at `.length`. Reading the code in that order is a good way to check the AI thought of the not-arrived case.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Beyond the four basics, real screens need partial and stale states. When a refresh fails, keep showing the last good data with a notice rather than replacing it with an error, so a flaky connection does not erase what the person was reading. Plan timeouts, retries with limits and backoff (an endless retry loop turns an outage into a storm), and make retried writes safe to repeat. Make state transitions announce themselves through live regions without stealing focus, and make loading placeholders match the final layout to avoid shifts. Test every state deliberately: render each one in isolation in a component catalogue, and drive the real page through failures by intercepting network requests in your end-to-end tests. Ask agents to write those tests with the screen.",
      },
      {
        type: 'takeaways',
        items: [
          'Every data screen has loading, empty, error and ready states, and AI drafts usually build only the last.',
          'Happy-path code crashes or shows a blank gap on undefined or an empty list: check "not arrived" before looking inside the data.',
          'Write the words for each state: say what happened, what is true, and the one next step, with no jargon and no blame.',
          'Ask the AI to list the states first, then build them all with a way to switch between them.',
          'Never let an AI invent promises such as "your booking is safe": write only what the app really does.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-08-match-1',
          kind: 'match',
          title: 'Which state design does each moment need?',
          prompt: 'Match each real moment to the design the screen should show.',
          concept: 'screen states',
          labels: { terms: 'The moment', meanings: 'What the screen should show' },
          pairs: [
            { term: 'A parent opens My appointments on a slow connection and sees a blank white area for four seconds', definition: 'A loading state: placeholder cards and the words "Loading your appointments…"', note: 'A blank area makes people think the app is broken.' },
            { term: 'A new patient, who has not booked anything yet, opens My appointments', definition: 'An empty state that says there is nothing yet and offers one button, Find a doctor', note: 'Nothing here is a mistake, so the screen should not look like one.' },
            { term: 'The clinic server does not answer when the doctor list is requested', definition: 'An error state saying what happened in plain words, with a Try again button', note: 'The person needs to know it is not their fault and what to do.' },
            { term: 'The parent taps 9:30, but another parent booked that time a second earlier', definition: 'A clear message that the time was just taken, with other free times shown', note: 'A conflict needs a way forward, not only an error.' },
          ],
          hints: [
            'Ask what the person is thinking in each moment: is it working, is it normal, what went wrong, what now?',
            'Slow equals loading, nothing yet equals empty, server failure equals error.',
            'The taken time is a different case: say it was just taken and show other times.',
          ],
          explanation: 'Each moment asks a different question, so each needs a different screen: working, nothing yet, something broke, or a conflict with a way forward. The same blank white screen answers none of them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-08-fix-bug-1',
          kind: 'fix-bug',
          title: 'The crash before the data arrives',
          prompt: 'This function crashes when the list has not arrived yet (undefined). Tap the line that crashes, then pick the fix that makes all four calls print the right state.',
          concept: 'happy path code',
          language: 'javascript',
          code: "function describe(appointments, failed) {\n  if (failed) return 'error';\n  if (appointments.length === 0) return 'empty';\n  if (appointments === undefined) return 'loading';\n  return 'ready';\n}\nconsole.log(describe(undefined, false));\nconsole.log(describe([], false));\nconsole.log(describe(['9:00'], false));\nconsole.log(describe(undefined, true));",
          bugLine: 3,
          fixes: [
            { line: "  if (appointments && appointments.length === 0) return 'empty';", correct: true, why: 'When the list has not arrived the guard is false, so the code skips to the loading check. An empty list still reaches the empty return.' },
            { line: "  if (appointments.length < 1) return 'empty';", correct: false, why: 'This still reads .length of undefined before the loading check, so it crashes the same way.' },
            { line: "  if (appointments.length == 0) return 'empty';", correct: false, why: 'Using == instead of === changes nothing here: the crash is from reading .length on undefined.' },
            { line: "  if (appointments === 0) return 'empty';", correct: false, why: 'It stops the crash, but an empty list is not the number 0, so an empty list would be reported as ready.' },
          ],
          hints: [
            'Which line reads something from appointments before you know it exists?',
            'You need the empty check to run only when the list exists.',
            'Put appointments && in front of the length check so undefined skips that line.',
          ],
          explanation: 'Reading .length of undefined throws an error, so the empty check must only run once the list exists. Guarding it with `appointments &&` lets undefined fall through to the loading line, and still catches an empty list.',
          tests: { kind: 'output', expected: ['loading', 'empty', 'ready', 'error'] },
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-08-q1',
        prompt: 'Which empty-state design for a new patient\'s My appointments screen is best?',
        choices: [
          'A blank white area, because there is nothing to show',
          'A red banner reading "Error: no data"',
          'A heading saying there are no appointments yet, one sentence about when they will appear, and a button to find a doctor',
          "A full-screen apology that says the app is sorry for the inconvenience, with a request to contact support by phone or email during office hours",
        ],
        answer: 2,
        explanation: 'An empty state should tell people nothing is wrong and offer the one useful next step. Blank space looks broken, and an error banner or apology treats a normal situation as a failure.',
      },
      {
        id: 'ai-ui-ux-08-q2',
        prompt: 'Which error message is best for a parent when the appointments fail to load?',
        choices: [
          "\"Error 500: request failed\"",
          '"We could not load your appointments. Check your connection and try again." with a Try again button',
          '"Something went wrong."',
          '"Your connection is bad."',
        ],
        answer: 1,
        explanation: 'It says what happened in plain words, suggests a cause the person can act on, and offers the next step. A code number means nothing to most people, and "something went wrong" or blame gives no direction.',
      },
      {
        id: 'ai-ui-ux-08-q3',
        prompt: 'In the describe function, why must the check for undefined come before the check on appointments.length?',
        choices: [
          'JavaScript always runs the last check first',
          "Checks on length are slower than checks on undefined, so the quicker check is always placed first to save time on every phone",
          'Reading .length of a list that has not arrived throws an error, so the "not arrived" case must be handled first',
          'An empty list must always be reported as loading',
        ],
        answer: 2,
        explanation: 'If the list is undefined, asking for its length crashes. Checking whether it exists first means the later line only runs when the list is there. Order, not speed, is the point.',
      },
      {
        id: 'ai-ui-ux-08-q4',
        prompt: 'The AI drafts the error state with the sentence "Your booking is safe and we will email you." What should you do?',
        choices: [
          'Keep it: reassuring words always help',
          'Check whether it is true for your app, and keep only what the app really does',
          'Make the sentence bigger so more people see it',
          "Replace it with a longer sentence that explains in detail how the server stores bookings and why they are safe",
        ],
        answer: 1,
        explanation: 'A generated screen does not know how your app behaves. A promise that is not true is worse than no promise, so review every sentence in a state for claims your app cannot keep.',
      },
      {
        id: 'ai-ui-ux-08-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is an "empty state"?',
        choices: [
          'The screen a new person sees when there is no data to show yet',
          "A page that has crashed and shows nothing",
          'A setting that clears all the data in an app',
        ],
        answer: 0,
        explanation: 'An empty state is a normal situation: the person has no appointments yet. A good empty state explains this and suggests what to do, so it does not look like a failure.',
      },
      {
        id: 'ai-ui-ux-08-q6',
        audience: { min: 'advanced' },
        prompt: 'A refresh of the doctor list fails while the person is reading it. Which behaviour is best?',
        choices: [
          'Replace the list with a full-screen error so the problem is unmissable',
          "Retry in a tight loop until it succeeds, so the person never has to press anything or see an error message",
          'Keep showing the last good list with a notice that it could not refresh and a retry action',
          'Reload the page automatically',
        ],
        answer: 2,
        explanation: 'Stale data with a clear notice keeps the person oriented and loses nothing. Replacing the list erases what they were reading, a tight retry loop turns an outage into a storm of requests, and a reload discards their place.',
      },
    ],
    task: {
      title: 'Design the four states for one screen',
      minutes: 18,
      steps: [
        'Pick one screen that shows a list or data: My appointments, an order list or a results page.',
        'Send the "list the states first" prompt and read what the AI proposes for each state.',
        'Build all four, switch between them with a setting in the address, and read every sentence for claims your app cannot keep.',
        'Check each state at 390 px: reach every control with Tab and run a contrast check on the text.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain in plain words the difference between undefined and an empty list, and show where my screen handles each."'] },
      { audience: { min: 'advanced' }, steps: ['Write an end-to-end test that makes the appointments request fail and then succeed, and asserts the error state is announced and the retry works.'] },
    ],
  },
  {
    id: 'ai-ui-ux-09',
    day: 9,
    title: 'Test the experience with real people',
    summary: 'Run a five-person usability test with a written protocol, record what you see, and turn the findings into precise prompts for AI.',
    intro: {
      objectives: [
        'Write three test tasks that do not hint at the answer',
        'Run and record a five-person usability session using a written protocol',
        'Turn observed problems into ranked fixes and a prompt for AI',
      ],
      why: 'Scripts can tell you a button is 44 px tall; only people can tell you they did not understand what it does. A few short sessions find the problems your measurements cannot, before real patients do.',
    },
    minutes: 28,
    skills: ['usability-testing'],
    body: [
      { type: 'paragraph', text: "Everything so far was measured by a script: widths, contrast, tap sizes, keyboard use. A script cannot tell you whether a tired parent understands what \"See next free day\" will do. Only watching a real person try can. A **usability test** is simple: you give someone a realistic task, you watch them attempt it without helping, and you write down where they hesitate, go wrong or give up. It does not need a lab or a budget. It needs a plan, a phone and a little discipline." },
      { type: 'heading', text: 'Why a small test is enough' },
      { type: 'paragraph', text: "A rule of thumb many teams use is five people per round. The reason is that the problems that trip up several people show up quickly, and after the first few sessions you mostly watch the same problems repeat. Five people cannot give you percentages or prove that a design is good. They can show you the biggest problems, and the right move is to fix those and test again with fresh people." },
      { type: 'heading', text: 'The protocol, written out' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Write three tasks from the goal.** A task is a situation, not an instruction: \"You need a family doctor for your child tomorrow morning. Book a visit.\" Never name the button or the screen. \"Tap Book Dr. Reyes\" tests nothing.',
          '**Recruit five people like your real audience,** such as parents who book clinic visits. Ask permission, explain what you will do, and offer a small thank-you. People who helped build the app are poor testers.',
          '**Prepare the test version and a note sheet.** A running page on a real phone is best. Prepare a one-line consent: you will take notes, and you will not record audio, video or the screen without their agreement.',
          '**Open each session with a script** (below), ask them to think aloud, and then give one task at a time.',
          '**Stay quiet and watch.** Do not explain, hint or defend. If they ask \"Should I tap here?\", answer \"What would you do if I were not here?\". If they are stuck for about a minute, note it as a failure and move on.',
          '**Record each task** as done unaided, done with a hint, or not done; the time; where they hesitated; and their exact words.',
          '**Finish with three questions:** what was easiest, what was confusing, and what would you change.',
          '**Combine the notes, rank the problems, fix, and test again.**',
        ],
      },
      {
        type: 'prompt',
        label: 'The facilitator\'s opening script',
        text: "Thank you for helping. We are testing the app, not you, so nothing you do can be wrong. If something is confusing, that is useful for us to know.\n\nPlease say out loud what you are looking at, what you are trying to do and what you expect to happen. I will not be able to help much, because I want to see what happens when I am not here.\n\nI will take notes on paper. I will not record you or your screen unless you say it is okay. You can stop at any time.\n\nHere is the first situation: You need a family doctor for your child tomorrow morning. Please book a visit.",
      },
      {
        type: 'table',
        headers: ['Task', 'Person', 'Result', 'Where they hesitated, in their words'],
        rows: [
          ['1. Book a visit for tomorrow morning', 'P1', 'Done unaided', ''],
          ['1. Book a visit for tomorrow morning', 'P2', 'Done with a hint', ''],
          ['2. Find your booking afterwards', 'P1', 'Not done', ''],
        ],
        caption: 'The observation sheet: one row per person per task. Use P1 to P5 instead of names.',
      },
      { type: 'heading', text: 'Read the results' },
      { type: 'paragraph', text: "Put the notes into one table of problems by person. A problem seen by several people is a pattern. Rank each problem by how much it hurt: a **blocker** stopped someone finishing, a **slowdown** let them finish with trouble, a **nuisance** was noticed but did not matter much. Fix blockers and anything that tripped up two or more people first. Below is practice data, invented to show the format. It is not from real participants." },
      {
        type: 'table',
        headers: ['Problem (invented practice data)', 'Seen in', 'Severity', 'Next step'],
        rows: [
          ['Tapped "See next free day" on Dr. Cruz\'s card and the booking page said "Choose a time today", so people thought it had not worked', 'P3, P4, P5', 'Blocker for P5; slowdown for P3 and P4', 'Fix first'],
          ['Could not find where booked visits are listed after confirming', 'P1, P2', 'Slowdown', 'Fix second'],
          ['Said the grey doctor specialty text looked "a bit small"', 'P4', 'Nuisance', 'Note and watch'],
        ],
        caption: 'Invented example of a findings table. The first finding is also a real gap in the pages built for this course: both buttons open the same booking page.',
      },
      { type: 'heading', text: 'What AI can and cannot do here' },
      { type: 'paragraph', text: "AI is useful around the test. It can draft realistic tasks from your goal, tidy messy notes into the table above, point out patterns, and propose a fix for a specific problem. It cannot be the participant. A model asked to play a parent tells you what is typical in the writing it has seen, not what confuses your own patients on your own screens. Use it to prepare and to analyse, never as a replacement for watching a person." },
      { type: 'prompt', label: 'Turn findings into a precise fix', text: "Here are the notes from five usability sessions, using codes P1 to P5 and no names.\n[paste the notes]\n\n1. Group them into problems and list which participants hit each.\n2. Rank them as blocker, slowdown or nuisance, with one line of evidence each, quoting only what is in my notes.\n3. For the top problem, propose the smallest change to the Find a doctor and Book a time pages that fixes it. Do not change anything else.\nDo not invent observations that are not in the notes." },
      { type: 'warning', text: "Keep people's details out of prompts: use codes like P1, remove names, phone numbers and anything that could identify them, and do not record anyone without clear permission. If you test with people who have disabilities or use assistive technology, that is valuable, and it needs the same care and consent." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a **participant** is the person trying your app, and the **facilitator** is you, running the session. **Think aloud** means saying your thoughts as you go, such as \"I expected a time list here, so I am looking for one\". It feels odd at first, and it is how you hear confusion that silence would hide. Your hardest job is staying quiet. When a friend struggles, you will want to help, because it is natural. Do not. The struggle is the result you came for. Write down exactly where they paused and what they said, and thank them at the end.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat n=5 as qualitative evidence, not a sample: do not report percentages, and recruit for the audience's range (new and returning users, assistive technology users) instead of convenience. Define success per task (completion unaided, time, errors) before the session, rate severity consistently, and triangulate with telemetry, support tickets and automated checks. Moderated sessions give depth; remote unmoderated tests give reach. If an LLM summarises notes, require every claim to cite the participant and quote, and spot-check against the raw notes, because summaries can invent themes. Handle data lawfully: consent, minimal retention, pseudonyms. Close the loop by turning each fixed problem into a regression test where one can exist.",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'Run your test on a real phone, with a real connection, and with the page deployed to a temporary address. Problems with touch, thumbs, glare and slow loading do not appear on a laptop in a quiet room.',
      },
      {
        type: 'takeaways',
        items: [
          'Scripts measure the page; only people tell you whether they understand it.',
          'Write the protocol first: three situation-based tasks, five people like your audience, a welcome script and a note sheet.',
          'Stay quiet during the session, record what happened in their words, and never record audio or video without consent.',
          'Rank problems as blocker, slowdown or nuisance, fix what several people hit, then test again with new people.',
          'AI helps prepare and analyse the test but cannot replace the participants.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-09-scenario-1',
          kind: 'scenario',
          title: 'What do you say when they ask?',
          prompt: 'Pick what the facilitator should say.',
          concept: 'running a session',
          situation: 'Your participant has been looking at the Find a doctor screen for forty seconds. She says, "Should I tap Dr. Cruz? Or this one?" The task was to book a visit for tomorrow morning. You know the answer. Four more people are waiting.',
          options: [
            { text: 'Say "Tap Dr. Reyes, he has times today."', consequence: 'She books, but you learned nothing: you cannot tell whether a real parent would have found the way alone, and your hint changes what she does next.', quality: 'poor' },
            { text: 'Say "What would you do if I were not here?" and note the pause, her words and what she chooses.', consequence: 'She thinks aloud, picks a doctor and you see exactly what the screen led her to expect. You record the 40-second hesitation as a finding.', quality: 'best' },
            { text: 'Say "That is a good question, I will explain the screen first, then you try."', consequence: 'You lose the clean first impression, which is the part of the test you cannot get back, and the explanation shapes everything she does after.', quality: 'poor' },
            { text: 'Stay silent and look away until she gives up.', consequence: 'You see where she gives up, but the silence feels unfriendly and she stops thinking aloud, so you lose what she expected.', quality: 'acceptable' },
          ],
          hints: [
            'The goal is to see what happens without your help, while keeping her talking.',
            'A hint changes the result, and silence alone can stop her thinking aloud.',
            'Hand the question back to her and write down what she does.',
          ],
          explanation: 'Handing the question back keeps the person thinking aloud, shows what the screen led them to expect and records the hesitation as evidence. Any hint or explanation changes the result you are trying to observe.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-09-arrange-1',
          kind: 'arrange',
          title: 'Put the usability test in order',
          prompt: 'Drag the steps into the order you would run a test round.',
          concept: 'usability test protocol',
          language: 'text',
          solution: [
            'Write three tasks from the goal of the screen',
            'Recruit five people like your audience and ask permission',
            'Read the welcome script and ask them to think aloud',
            'Watch each task and note what happens without helping',
            'Combine the notes into a table of problems by person',
            'Fix the problems that two or more people hit, then test again',
          ],
          reasons: [
            'The tasks decide who you need and what you will observe, so they come first.',
            'Choose the people next, with consent.',
            'The script sets expectations before the first task.',
            'The sessions produce the evidence.',
            'Patterns appear only when you put the five sets of notes together.',
            'Fix the patterns, then check the fix with fresh people.',
          ],
          hints: [
            'You cannot recruit well until you know what the tasks are.',
            'Plan, run, combine, fix.',
            'Tasks, people, script, watching, table, fixes.',
          ],
          explanation: 'A test round moves from plan to people to evidence to action: tasks, recruits, script, observation, a combined table of problems, then fixes and a retest.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-09-q1',
        prompt: 'Which of these is the best test task?',
        choices: [
          "Tap the Book button for Dr. Reyes and choose 9:00",
          'You need a family doctor for your child tomorrow morning. Book a visit.',
          'Tell me how you feel about the colours of the app',
          'Do you like the new design more than the old one?',
        ],
        answer: 1,
        explanation: 'A situation with a goal lets you see whether the person can find the way. Naming the button gives away the answer, and asking for opinions measures politeness, not whether the screen works.',
      },
      {
        id: 'ai-ui-ux-09-q2',
        prompt: 'During a session the participant asks, "Should I tap here?" What should you say?',
        choices: [
          'Yes, tap there, it is the right one',
          'No, try the other one',
          'What would you do if I were not here?',
          'Let me explain the whole screen first',
        ],
        answer: 2,
        explanation: 'Handing the question back keeps the person thinking aloud and shows what the screen led them to expect. Any hint changes the result you came to observe.',
      },
      {
        id: 'ai-ui-ux-09-q3',
        prompt: 'Why can an AI not replace the five real participants?',
        choices: [
          "It cannot read a design brief or a list of tasks, so it has no way of knowing what a participant would be asked to do in a session",
          'It tells you what is typical in the text it has learned from, not what confuses your actual patients on your actual screens',
          'It is too slow to answer a list of tasks',
          'AI tools refuse to roleplay as a user',
        ],
        answer: 1,
        explanation: 'A model can imitate a typical user, but confusion is specific to your screens and your people. Only watching them try shows it. The AI is useful for preparing tasks and tidying notes, not for being the participant.',
      },
      {
        id: 'ai-ui-ux-09-q4',
        prompt: 'Which problem should be fixed first?',
        choices: [
          "One person said a grey label looked a bit small, which did not stop them and was only mentioned in passing at the end",
          'A problem three of five people hit, and one of them could not finish the task',
          'A problem only the facilitator noticed, with no participant involved',
          'Whichever the team finds easiest to change',
        ],
        answer: 1,
        explanation: 'Problems that block someone and are hit by several people hurt most, so they come first. A single nuisance can wait, and "easiest first" is not about the people using the app.',
      },
      {
        id: 'ai-ui-ux-09-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does "think aloud" mean in a usability test?',
        choices: [
          'The participant says their thoughts as they go, such as what they expect to happen',
          "The facilitator explains every step of the app out loud",
          'The participant stays silent and concentrates',
        ],
        answer: 0,
        explanation: 'Speaking thoughts as you go lets the facilitator hear confusion that silence would hide, such as "I expected a list of times here".',
      },
      {
        id: 'ai-ui-ux-09-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate asks an LLM to summarise the five sets of session notes and reports "80% of users struggled". What is the problem?',
        choices: [
          'Nothing, as long as the summary sounds confident',
          'Five qualitative sessions do not support percentages, and the summary needs claims traceable to participants and quotes, checked against the raw notes',
          "The summary should have used a larger percentage, because exaggerating how serious a problem is makes a team more likely to fix it quickly this sprint",
          'LLMs cannot summarise any notes at all',
        ],
        answer: 1,
        explanation: 'With five people the evidence is qualitative, so percentages overstate it, and an LLM summary can invent themes. Requiring each claim to cite a participant and quote, and spot-checking, keeps the summary honest.',
      },
    ],
    task: {
      title: 'Plan a five-person test',
      minutes: 20,
      steps: [
        'Write three situation-based tasks for one screen of your app, with no button names in them.',
        'Write your welcome script (adapt the one in this lesson) and a note sheet with one row per person per task.',
        'Run one practice session with someone you know, staying quiet, and note where they hesitate.',
        'Send the findings prompt (codes only, no names) and write down the one change you would make first.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Check my three tasks and tell me if any of them gives away the answer or names a button. Explain why in plain words."'] },
      { audience: { min: 'advanced' }, steps: ['Define the success measures for each task (completion unaided, time, errors) and the severity scale before the sessions, and say how you will check the AI summary against the raw notes.'] },
    ],
  },
  {
    id: 'ai-ui-ux-10',
    day: 10,
    title: 'Project: redesign an app screen by screen',
    summary: 'Plan the whole redesign: inventory the screens, take a measured baseline, rebuild one screen at a time with AI, test with five people and write the report.',
    intro: {
      objectives: [
        'Inventory an app\'s screens and record a measured baseline for each',
        'Plan a screen-by-screen redesign loop with a prompt log and a scorecard',
        'Structure a report that shows before, after and what real people did',
      ],
      why: 'A redesign is not one big prompt. It is a sequence of small, measured steps that you can show a client or an employer, and the evidence you collect is what makes it credible.',
    },
    minutes: 25,
    skills: ['redesign-workflow'],
    body: [
      { type: 'paragraph', text: "You now have every piece: a brief, references, hierarchy, colour that passes, layouts that fit, accessibility, tokens and components, the forgotten states, and a way to test with people. The project puts them together on an app of your own choice, or on the clinic app. The danger is trying to redesign everything with one giant prompt. That produces a pretty, unreviewable mess. The way through is the same loop, applied one screen at a time, with numbers at each step." },
      { type: 'heading', text: 'Start with an inventory and a baseline' },
      { type: 'paragraph', text: "List every screen of the app and what it is for: for the clinic, Find a doctor, Book a time, My appointments. For each, take a screenshot at 390 px and run the same measurements, so you can prove later what improved: page width at 320 and 390 px, text under 4.5:1, smallest tap target, controls reachable with Tab, labelled boxes, and the states that exist. This is your **baseline**. Without it, \"better\" is an opinion." },
      { type: 'heading', text: 'One screen at a time' },
      { type: 'diagram', format: 'mermaid', caption: 'The redesign loop. Tokens and components come first, so every later screen inherits them.', source: 'flowchart TD\n  A[Inventory screens and take a baseline] --> B[Tokens and shared components]\n  B --> C[Write the brief for one screen]\n  C --> D[Build it with AI]\n  D --> E[Measure widths, contrast, targets and keyboard]\n  E --> F{Passes your limits?}\n  F -->|No| G[Send a precise fix prompt]\n  G --> E\n  F -->|Yes| H[Build loading, empty and error states]\n  H --> I{More screens?}\n  I -->|Yes| C\n  I -->|No| J[Test with five people and report]' },
      { type: 'paragraph', text: "Keep a **prompt log**: every prompt you send, what you asked it to change, and what it did, with the measurement before and after. It is your evidence and your memory, and later it is the best reference for the next prompt you write. Redesign one screen completely, passing your own checks, before starting the next." },
      { type: 'heading', text: 'The scorecard' },
      { type: 'paragraph', text: "A scorecard is the same table for every screen, filled in before and after. Here is the clinic's, for the doctor list and booking form, using the numbers measured through this course." },
      {
        type: 'table',
        headers: ['Measure', 'First draft', 'Redesign'],
        rows: [
          ['Page width on a 390 px phone', '397 px (scrolls sideways)', '390 px'],
          ['Doctor card width on that phone', '112 px', '358 px'],
          ['Text under 4.5:1 contrast', '19 of 27', '0 of 32'],
          ['Smallest tap target', '8 by 16 px', '44 px tall'],
          ['Controls reachable with Tab', '3 of 14', 'All'],
          ['Form boxes with a label', '0 of 3', '2 of 2'],
          ['Different text sizes and spacing values', '5 sizes, 8 spacings', '4 sizes, 5 spacings'],
          ['Colour values', '16 scattered through the rules', '11, all in :root as tokens'],
          ['States built for My appointments', 'Ready only', 'Loading, empty, error and ready'],
        ],
        caption: 'Measured in Chrome 158 with the scripts described in the earlier lessons. The redesign is for the practice screens built for this course.',
      },
      { type: 'heading', text: 'The report' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Goal and audience:** the five-part brief for the app.',
          '**Before:** screenshots and the baseline scorecard for each screen.',
          '**The prompt log:** at least eight prompts, each with what it changed and what you measured.',
          '**After:** screenshots and the scorecard again, with every number you changed.',
          '**The usability test:** the three tasks, five participants coded P1 to P5, the findings table with severity, the fixes you made and a second round or a plan for one.',
          '**What the AI got wrong:** at least three things you caught, and how you caught them.',
          '**Next steps:** what you would test or improve next.',
        ],
      },
      { type: 'prompt', label: 'Kick off the redesign with an inventory', text: "I am redesigning an app screen by screen. I will paste the brief and a screenshot of each screen.\n\nStep 1 only: list every screen with its purpose and the single action it exists for. For each, tell me which of these I should measure for a baseline: page width at 320 and 390 px, text contrast, tap-target size, keyboard reach, form labels, and the states the screen can be in. Do not redesign anything yet, and do not write code." },
      { type: 'warning', text: "Do not redesign every screen in one go, and do not let the AI restyle screens you did not ask about. Change one screen, measure it, then move on. Keep real people's details out of your screenshots and prompts, and use invented content for any example data." },
      {
        type: 'version',
        text: "WCAG 2.2 is the current version of the guidelines (a W3C Recommendation since 5 October 2023) and Level AA is the usual target. Whether and how an AI tool accepts screenshots, and its size limits, differ by tool and plan and change often, as the notes in lesson 2 show: check the tool's own page before you rely on a screenshot step in your workflow.",
        checked: CHECKED,
        sources: [DOCS.wcagNew, DOCS.lovableImages, DOCS.claudeVision],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a project like this is a lot, so make it small. Choose one app you know, and two or three screens only. Do the same short loop for each: write down who it is for, ask the AI to build it, measure it with the checks you have learned, fix what fails, then add the loading, empty and error screens. Keep a simple notebook of what you asked and what happened. That notebook is your prompt log, and it is worth as much as the finished screens. At the end ask five people to try it and write down where they struggled. You are not expected to build a perfect app. You are expected to show that you can direct the AI and check its work.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Run the redesign like a migration in a real codebase. Land tokens and shared components first, behind small pull requests, and move screens one at a time with each PR carrying its before and after scorecard, screenshots and test results as evidence. Gate merges on automated checks (overflow at four widths, contrast matrix, accessibility scan, no colour literals outside tokens) so agents cannot regress earlier screens, and keep standing rules in the instructions file. Decide in advance how you will measure outcomes beyond the audit, such as task success and time in the usability test, and compare before and after. Roll out gradually if the app is live, and keep the old screens reachable until the new ones have passed a test round.",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'Save the scripts you used to measure (overflow, contrast, target sizes, Tab reach) in the project, so each new screen gets the same check in one command and your scorecard stays comparable.',
      },
      {
        type: 'takeaways',
        items: [
          'Redesign one screen at a time, in a loop: brief, build, measure, fix, add the states, then the next screen.',
          'Take a baseline first, because without measurements "better" is only an opinion.',
          'Land tokens and shared components early so every later screen inherits them.',
          'Keep a prompt log and a before-and-after scorecard: they are your evidence.',
          'End with a usability test of five people and a report that includes what the AI got wrong.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-10-scenario-1',
          kind: 'scenario',
          title: 'The second screen ignores your system',
          prompt: 'Pick the next prompt you would send.',
          concept: 'redesign workflow',
          situation: 'Screen one of your redesign is finished and measured. You asked the AI for screen two, Book a time. It looks good, but its stylesheet adds three new hex colours, a 14 px padding and its own button style, and the Book button measures 3.9:1 contrast.',
          options: [
            { text: 'Accept it: it looks consistent enough, and you will tidy up at the end.', consequence: 'The inconsistencies spread to screen three, the contrast failure ships, and the cleanup at the end becomes a rewrite.', quality: 'poor' },
            { text: 'Tell the AI to start the redesign again from scratch with a longer brief.', consequence: 'You throw away good work and the new draft drifts in different ways, because the actual problem was never named.', quality: 'poor' },
            { text: 'Send a precise fix: use only the existing tokens and the Button component, remove the three new colours and the 14 px padding, and report the contrast of the Book button, which must be at least 4.5:1.', consequence: 'The screen now uses your tokens, the button is the shared one, and the reported ratio is a number you can recompute. Screen three starts from a consistent base.', quality: 'best' },
            { text: 'Fix the button colour by hand and leave the new colours and padding as they are.', consequence: 'The contrast is fixed, but the stray colours and spacing stay in the code and the next screen copies them.', quality: 'acceptable' },
          ],
          hints: [
            'What is actually wrong: the design, or that the AI left your system?',
            'A precise fix names what to remove and what to use instead.',
            'Ask for tokens and the shared Button, and for the ratio you can verify.',
          ],
          explanation: 'The cheapest time to fix drift is the moment it appears. A precise prompt names the exact violations, points the AI back to the tokens and components, and asks for a number you can verify.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-ui-ux-10-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'What goes in each part of the report',
          prompt: 'Tap each part to see what evidence it needs.',
          concept: 'redesign report',
          cards: [
            { front: 'Before', back: 'A screenshot of each screen at 390 px and the baseline scorecard: widths, contrast, tap sizes, Tab reach, labels and the states that exist.' },
            { front: 'The prompt log', back: 'At least eight prompts, each with what you asked it to change, what it did, and the number you measured before and after.' },
            { front: 'After', back: 'The same screenshots and scorecard, with the numbers that changed, so a reader can compare without trusting you.' },
            { front: 'The usability test', back: 'Three tasks, five participants coded P1 to P5, a findings table with severity, the fixes you made and what you would test next.' },
            { front: 'What the AI got wrong', back: 'At least three things you caught, such as a low-contrast colour or a clickable div, and the measurement that caught each one.' },
          ],
          hints: [],
          explanation: 'Each part gives a reader evidence they can check: measured baselines, what you asked, what changed, what real people did and where the AI was wrong.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-ui-ux-10-q1',
        prompt: 'Why take a measured baseline before changing anything?',
        choices: [
          'Without it, "better" is only an opinion: you cannot show what improved',
          "The AI refuses to redesign a screen that has not been measured",
          'Browsers cache the old page until a baseline is saved',
          'It makes the redesigned page load faster',
        ],
        answer: 0,
        explanation: 'A baseline gives you a before to compare against, so you can prove the changes. The AI and browsers do not require it, and it has no effect on speed.',
      },
      {
        id: 'ai-ui-ux-10-q2',
        prompt: 'Why land tokens and shared components before redesigning the second and third screens?',
        choices: [
          "Because AI tools cannot build more than one screen in a session without them, and the second screen would be left blank for good",
          'So that every later screen inherits the same colours, spacing and accessible components instead of inventing its own',
          'Because tokens make a screen load more quickly on a slow connection',
          'So that the usability test can be skipped',
        ],
        answer: 1,
        explanation: 'Tokens and components are the shared base. If they exist first, each new screen reuses them and stays consistent; if not, each screen drifts. They do not affect load speed or replace testing.',
      },
      {
        id: 'ai-ui-ux-10-q3',
        prompt: 'The prompt log should record, for each prompt:',
        choices: [
          'Only the prompts that worked',
          "The AI model's name and version and nothing else, since the prompt itself can always be recreated later",
          'Only the final code the AI produced',
          'What you asked it to change, what it did, and the measurement before and after',
        ],
        answer: 3,
        explanation: 'The log is evidence and memory: what you asked, what changed and the numbers. Keeping only successes or only code throws away what you learned.',
      },
      {
        id: 'ai-ui-ux-10-q4',
        prompt: 'The AI\'s new screen adds three new hex colours and fails contrast on the main button. What is the best response?',
        choices: [
          'Accept it and tidy up at the end of the project',
          'Send a precise prompt to use the existing tokens and the shared Button, and report the button\'s contrast ratio',
          "Start again from a blank page with a much longer brief that lists every colour, size and spacing value in advance, then compare",
          'Change only the button colour by hand',
        ],
        answer: 1,
        explanation: 'Name the exact violations and point the AI back to the system, and ask for a number to verify. Deferring spreads the drift, a restart discards good work and a hand fix leaves the stray colours.',
      },
      {
        id: 'ai-ui-ux-10-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a "prompt log" for?',
        choices: [
          'A record of what you asked the AI and what happened, so you can show and reuse your work',
          "A list of the best prompts other people wrote",
          'A tool that makes prompts shorter',
        ],
        answer: 0,
        explanation: 'The prompt log is your notebook: what you asked, what you got and what you measured. It proves how the work was done and helps you write better prompts next time.',
      },
      {
        id: 'ai-ui-ux-10-q6',
        audience: { min: 'advanced' },
        prompt: 'In a real codebase, how should a screen-by-screen redesign by agents be controlled?',
        choices: [
          'One large pull request at the end, reviewed by one person',
          'Small pull requests per screen, each carrying its scorecard and test evidence, with automated checks that block regressions of earlier screens',
          "Let each agent restyle whatever it likes on its own branch and compare screenshots by eye after release, fixing only what someone happens to notice",
          'Freeze the design and avoid using agents for UI',
        ],
        answer: 1,
        explanation: 'Small reviewable steps with evidence and automated gates keep each change checkable and stop regressions. One huge PR hides problems, and free restyling or avoiding agents gives up the benefit.',
      },
    ],
    task: {
      title: 'Take a baseline for your own app',
      minutes: 20,
      steps: [
        'Choose the app you will redesign (your own, or the clinic app) and list its screens with the one action each exists for.',
        'Screenshot each screen at 390 px and record the baseline measures from the scorecard table.',
        'Write the five-part brief for the first screen and decide which states it needs.',
        'Open your prompt log with the baseline numbers as its first entry.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Keep it to two screens. Ask the AI: "Explain in plain words what each number in my scorecard means and what a good value would be."'] },
      { audience: { min: 'advanced' }, steps: ['Script the baseline so one command measures overflow at four widths, the contrast matrix, target sizes and Tab reach for every screen and writes the scorecard to a file.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'ai-ui-ux-p1',
    title: 'From a first draft to a measured screen',
    summary: 'Take one screen from a quick AI draft to a version that passes your own limits, with a brief, a before-and-after scorecard and a log of the prompts you used.',
    outcome: 'Shows a client or employer that you can direct an AI tool to build a screen and prove, with numbers, that it fits phones, reads well and works with a keyboard.',
    unlockAfterDay: 6,
    steps: [
      { id: 'ai-ui-ux-p1-s1', text: 'Choose one screen (a list of doctors, a menu, a booking form) and write the five-part brief: audience, goal, mood, constraints written as numbers, and references.' },
      { id: 'ai-ui-ux-p1-s2', text: 'Generate a first draft with a short prompt, then measure it at 320, 390, 768 and 1280 px: page width, text under 4.5:1, smallest tap target, controls reachable with Tab and boxes without labels. Save the numbers as your baseline.' },
      { id: 'ai-ui-ux-p1-s3', text: 'Rebuild it from the full brief, then send precise follow-up prompts, each naming a measured symptom and the exact rules that may change, until your own limits pass.' },
      { id: 'ai-ui-ux-p1-s4', text: 'Check that nothing is shown by colour alone, the focus ring is visible, and the page works at 200% zoom, then fill in the same scorecard again.', link: 'https://www.w3.org/WAI/WCAG22/quickref/' },
      { id: 'ai-ui-ux-p1-s5', audience: { max: 'beginner' }, text: 'Keep it small: one screen with no more than three items. After each prompt, ask the AI to explain in plain words what it changed.' },
      { id: 'ai-ui-ux-p1-s6', audience: { min: 'advanced' }, text: 'Turn your limits into an automated check (overflow at four widths, contrast of each token pair, target sizes) that runs against the page and fails the build on a regression.' },
    ],
    submission: {
      kind: 'text',
      label: 'Brief, prompt log and scorecard',
      placeholder: 'Paste your brief, each prompt with a one-line result, and the before-and-after scorecard with the widths you tested.',
      hint: 'Include the brief, at least five prompts with what each changed, the baseline and final numbers, and one thing the AI got wrong that you caught.',
    },
    rubric: [
      'The brief names the audience, one goal, the mood, constraints as numbers and at least one reference.',
      'A baseline was measured before changes, at several screen widths.',
      'Follow-up prompts name a measured symptom and limit what may change.',
      'The final screen passes the stated limits and the numbers are reported honestly.',
      'The write-up names at least one mistake the AI made and how it was caught.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The learner can explain in plain words two things the AI changed and why they help a person using the screen.'] },
      { audience: { min: 'advanced' }, items: ['The limits are enforced by an automated check that fails on a regression, with the check kept in the repository.'] },
    ],
  },
  {
    id: 'ai-ui-ux-p2',
    title: 'Redesign an app screen by screen and test it with five people',
    summary: 'Redesign two or three screens of a real or practice app with AI, using tokens, components and all the states, then test with five people and write the report.',
    outcome: 'A report with before-and-after evidence, a prompt log and a usability test, which you can show to clients or employers as proof that you can design and verify an interface with AI.',
    unlockAfterDay: 9,
    steps: [
      { id: 'ai-ui-ux-p2-s1', text: 'Choose the app, list its screens and the one action each exists for, take 390 px screenshots, and record the baseline scorecard for every screen.' },
      { id: 'ai-ui-ux-p2-s2', text: 'Write the app\'s brief, then create the tokens (colour, text, spacing, radius, tap size) and the shared components (button, card, field, status) and check each colour pair with the contrast function.' },
      { id: 'ai-ui-ux-p2-s3', text: 'Redesign two or three screens one at a time: brief, build, measure at 320 to 1280 px, send precise fixes, and keep a prompt log of at least eight prompts.' },
      { id: 'ai-ui-ux-p2-s4', text: 'Give every data screen its loading, empty and error states with plain words and one next step, and a way to switch between them.' },
      { id: 'ai-ui-ux-p2-s5', text: 'Run the two-minute accessibility check on every screen: keyboard, 200% zoom, a screen reader pass, and reduced motion.' },
      { id: 'ai-ui-ux-p2-s6', text: 'Write three situation-based tasks and a welcome script, test with five people who resemble your audience (codes P1 to P5, with consent), rank the problems and fix the top one or two.' },
      { id: 'ai-ui-ux-p2-s7', text: 'Write the report: goal and audience, before, the prompt log, after with the scorecard, the usability test, what the AI got wrong, and next steps.' },
      { id: 'ai-ui-ux-p2-s8', audience: { max: 'beginner' }, text: 'You may redesign two screens and test with three people, as long as the baseline, the prompt log, the states and the findings table are complete.' },
      { id: 'ai-ui-ux-p2-s9', audience: { min: 'intermediate' }, text: 'Build the screens as components in a framework you use, with the tokens in one file, and add a script that measures overflow, contrast and Tab reach for every screen.' },
      { id: 'ai-ui-ux-p2-s10', audience: { min: 'advanced' }, text: 'Add automated gates (overflow at four widths, a contrast matrix, an accessibility scan, no colour literals outside the tokens) and deliver each screen as a pull request that carries its scorecard and screenshots.' },
      { id: 'ai-ui-ux-p2-s11', audience: { min: 'professional' }, text: 'Include a rollout plan, task-success measures defined before the sessions, and evidence that AI-generated summaries of the sessions were checked against the raw notes.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your redesign report',
      placeholder: 'Paste or link your report: brief, before and after scorecards, prompt log, states, usability test findings and what the AI got wrong.',
      hint: 'Include scorecards for every screen, at least eight prompts, the loading, empty and error states, five participants coded P1 to P5, a ranked findings table and the fixes you made.',
    },
    rubric: [
      'Every screen has a measured baseline and a matching after scorecard, and the numbers are honest.',
      'Colours, text sizes and spacing come from tokens, and shared components are reused across screens.',
      'Every data screen has loading, empty and error states with plain, true words and a next step.',
      'The accessibility check was run on each screen and its findings and fixes are recorded.',
      'The usability test has situation-based tasks, five coded participants, ranked findings and at least one fix tested again.',
      'The report names several things the AI got wrong and the checks that caught them.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The learner can explain in plain words how the tokens and the findings table were used.'] },
      { audience: { min: 'intermediate' }, items: ['A script measures overflow, contrast and Tab reach for every screen, and its output is in the report.'] },
      { audience: { min: 'advanced' }, items: ['Each screen is delivered with automated gates and evidence, and earlier screens are protected from regressions.'] },
      { audience: { min: 'professional' }, items: ['The report includes a rollout plan, predefined success measures and verified AI-assisted analysis of the sessions.'] },
    ],
  },
];

export const aiUiUxCourse: Course = {
  id: 'ai-ui-ux',
  kind: 'standard',
  title: 'AI-Assisted UI and UX Development',
  level: 'beginner',
  tagline: 'Direct AI to design and build screens people can use, then measure and test them.',
  description: 'Learn to describe a design so AI can build it, use screenshots and references, and judge the result for layout, colour, responsiveness and accessibility. You redesign one clinic booking app and test it with real people.',
  finishLine: ['A redesigned multi-screen app with a small design system', 'A usability test report from real people'],
  objectives: [
    'Write a design brief that an AI tool can build a screen from',
    'Use references and screenshots without copying their problems',
    'Check layout, colour, responsiveness and accessibility with real measurements',
    'Build reusable components and a small set of design tokens',
    'Design loading, empty and error states and test the app with five people',
  ],
  audiences: ['builder', 'career-changer', 'fresh-grad', 'educator'],
  skills: [
    { id: 'describe-design', label: 'Describing a design for AI' },
    { id: 'references', label: 'Using references and screenshots' },
    { id: 'layout-hierarchy', label: 'Layout, spacing and hierarchy' },
    { id: 'colour-type', label: 'Colour and type that work together' },
    { id: 'responsive', label: 'Responsive behaviour' },
    { id: 'accessibility', label: 'Accessibility from the start' },
    { id: 'design-system', label: 'Components and design tokens' },
    { id: 'ui-states', label: 'Loading, empty and error states' },
    { id: 'usability-testing', label: 'Usability testing' },
    { id: 'redesign-workflow', label: 'Redesigning an app screen by screen' },
  ],
  lessons,
  projects,
  icon: 'palette',
  updated: '2026-11-14',
};
