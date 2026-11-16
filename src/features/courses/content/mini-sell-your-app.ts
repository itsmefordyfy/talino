import type { Course } from './types';

const CHECKED = '2026-11-14';

const SRC = {
  claudePricing: { label: 'Claude API docs: Pricing', url: 'https://platform.claude.com/docs/en/about-claude/pricing' },
  owaspLlm10: { label: 'OWASP LLM10:2025 Unbounded Consumption', url: 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/' },
  webVitals: { label: 'web.dev: Web Vitals', url: 'https://web.dev/articles/vitals' },
  gaUtm: { label: 'Google Analytics Help: Collect campaign data with custom URLs', url: 'https://support.google.com/analytics/answer/10917952' },
  rfc2104: { label: 'RFC 2104: HMAC, Keyed-Hashing for Message Authentication', url: 'https://www.rfc-editor.org/rfc/rfc2104' },
  pyHmac: { label: 'Python docs: hmac', url: 'https://docs.python.org/3/library/hmac.html' },
  appleGuidelines: { label: 'Apple App Review Guidelines (3.1.1 In-App Purchase)', url: 'https://developer.apple.com/app-store/review/guidelines/' },
  googlePlayPayments: { label: 'Google Play Payments policy', url: 'https://support.google.com/googleplay/android-developer/answer/9858738' },
};

export const miniSellYourAppCourse: Course = {
  id: 'mini-sell-your-app',
  kind: 'mini',
  level: 'beginner',
  title: 'Selling Your Vibe-Coded App',
  tagline: 'From "I built a thing" to people who sign up and pay.',
  description:
    'Five short lessons for builders who made an app or website with AI and now want people to use and pay for it: who pays and why, choosing a pricing model, a landing page with a waitlist, setting up payments and receipts in general terms, and launching with short videos. You finish with a live landing page that has a clear offer and a sign-up.',
  finishLine: [
    'A clear picture of who your paying customer is and what problem you solve',
    'A pricing model that fits your app and your costs',
    'A live landing page with a clear offer and a working sign-up',
    'A launch plan with short videos and a way to measure what works',
  ],
  audiences: ['builder', 'career-changer'],
  skills: [
    { id: 'customer-value', label: 'Customer and value' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'landing-page', label: 'Landing pages and waitlists' },
    { id: 'payments-receipts', label: 'Payments and receipts' },
    { id: 'launch-marketing', label: 'Launch and short videos' },
  ],
  lessons: [
    {
      id: 'mini-sell-your-app-01',
      day: 1,
      title: 'Who pays, and why',
      summary: 'Name the person with the problem, the moment it hurts, and what they do about it today.',
      intro: {
        objectives: [
          'Describe a customer by who, when, what they do today and why they would switch',
          'Write interview questions about past behaviour instead of opinions on your idea',
          'Tell real evidence, such as sign-ups and payments from strangers, from polite praise',
        ],
        why: 'Building with AI is easy, and finding someone who will pay is the hard part. Knowing exactly who has the problem tells you where to find them and what to say.',
      },
      minutes: 15,
      skills: ['customer-value'],
      body: [
        {
          type: 'paragraph',
          text: 'Building an app with AI has never been easier. Getting someone to pay for it is still hard. People do not pay for features. They pay to make a problem go away, save time, make money, or feel less stressed.',
        },
        { type: 'heading', text: 'Be specific about the person' },
        {
          type: 'paragraph',
          text: '"Small businesses" is not a customer. "Home-based bakers in Metro Manila who take orders on Facebook Messenger and lose track of who paid" is. The more specific you are, the easier it is to find them, talk to them and write words that make them say "that\'s me".',
        },
        {
          type: 'list',
          items: [
            '**Who** has the problem? (role, situation, where they spend time online)',
            '**When** does it hurt? (the exact moment: Sunday night when orders pile up)',
            '**What** do they do today? (a notebook, a spreadsheet, a group chat, nothing)',
            '**Why** would they switch? (what is painful or costly about the current way)',
          ],
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-sell-your-app-01-match-1',
            kind: 'match',
            title: 'Describe the customer',
            prompt: 'The lesson\'s example customer is a home-based baker who takes orders on Messenger. Match each question with a good answer for her.',
            concept: 'defining the customer',
            pairs: [
              {
                term: 'Who has the problem?',
                definition: 'Home-based bakers in Metro Manila who take orders on Facebook Messenger',
                note: 'This is specific enough to find them and write words that make them say "that\'s me".',
              },
              {
                term: 'When does it hurt?',
                definition: 'Sunday night, when the orders pile up',
                note: 'It names the exact moment.',
              },
              {
                term: 'What do they do today?',
                definition: 'A notebook, a spreadsheet or a group chat',
                note: 'Your real competitor is often one of these.',
              },
              {
                term: 'Why would they switch?',
                definition: 'They lose track of who has paid',
                note: 'It is the painful or costly part of the current way.',
              },
            ],
            hints: [
              'Who is about the person, when is about the moment, what is about today\'s way and why is about the pain.',
              'A notebook or a spreadsheet is what people use today.',
              'Losing track of who paid is the cost of the current way.',
            ],
            explanation: 'Be specific about the person, the moment it hurts, what they do today and why they would switch. The more specific you are, the easier they are to find and talk to.',
          },
        },
        {
          type: 'paragraph',
          text: 'The last two questions matter most. If they already have a "good enough" free way, your app must be clearly better at the painful part. Your real competitor is often a notebook or a spreadsheet.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **customer** is the person who pays, and that is not always the person who uses the app. A **niche** is a small, clearly described group, like \"home-based bakers in Metro Manila\", and it is easier to serve than \"everyone\". Think of fishing: a net cast over the whole sea catches nothing you can sell, while the right bait in the right pond catches the right fish. Your **competitor** is whatever the customer does today, even if it is a notebook, a spreadsheet or doing nothing. If they are happy with it, they will not switch. If it costs them time, money or worry, you have a problem worth solving.",
        },
        { type: 'heading', text: 'Talk to five real people' },
        {
          type: 'paragraph',
          text: 'Before you add another feature, talk to five people who match your description. Ask about their past behaviour, not your idea. "How did you track orders last week?" gives better answers than "Would you use my app?", because people are polite about ideas.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-sell-your-app-01-scenario-1',
            kind: 'scenario',
            title: 'Which interview question is best?',
            prompt: 'You are talking to a home-based baker. Which question teaches you the most?',
            concept: 'customer interviews',
            situation: 'You have 15 minutes with a baker who takes orders on Messenger, and you want to learn how she handles orders today.',
            options: [
              {
                text: '"How did you keep track of orders last week?"',
                consequence: 'She tells you what she really did, with a real example. That is evidence you can use.',
                quality: 'best',
              },
              {
                text: '"Would you use an app that tracks your orders?"',
                consequence: 'People are polite about ideas, so she says "sure". You learn nothing about what she does today.',
                quality: 'poor',
              },
              {
                text: '"Don\'t you hate losing track of who paid?"',
                consequence: 'It is a leading question. She will agree with you whether or not it is her real problem.',
                quality: 'poor',
              },
            ],
            hints: [
              'Which question asks about something that already happened?',
              'Questions about your idea get polite answers, not facts.',
              'A leading question suggests the answer you want.',
            ],
            explanation: 'Ask about past behaviour and real examples, not opinions about your idea. People are polite about ideas, so "would you use it?" tells you little.',
          },
        },
        {
          type: 'prompt',
          label: 'Interview questions',
          text: 'I built an app for [specific person] that helps with [problem]. Write 8 interview questions to learn about their current way of handling this problem. Rules: ask about past behaviour and real examples, not opinions about my idea; no leading questions; include one question about what they already pay for (money or time) to solve it. Then list 3 answers that would tell me my idea is weak.',
        },
        {
          type: 'paragraph',
          text: 'After the interviews, write one sentence: "[Person] uses my app to [result] instead of [current way], because [main reason]." If you cannot fill it in, you are not ready to set prices yet, and that is useful to know early.',
        },
        {
          type: 'tip',
          text: 'Look for people who already spend money or lots of time on the problem. They are the most likely first customers.',
        },
        {
          type: 'warning',
          text: 'Friends and family will say they love it. Thank them, but count only strangers who match your customer description, and actions (sign-ups, payments) more than words.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Here is the difference between weak and strong answers in an interview. Weak: \"Sounds great, I'd use that!\" It is an opinion about your idea, and it costs her nothing to say. Strong: \"Last Sunday I lost track of two payments and spent an hour scrolling Messenger to find them.\" It is something she actually did, with a real cost. Evidence is what someone did, paid, or gave up their time for. Write down strong answers word for word. If you collect five of them from people who match your description, you have found a real problem, and you know the words to use on your landing page.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat discovery as a test with a decision rule, not a mood. Before you start, write down what would make you continue, change direction or stop: for example, a number of interviews, a number of people who commit time or money (a pre-order, a paid pilot, a deposit) and a deadline. Weight actions over statements, and weight people who already spend money or time on the problem over people who merely agree. Segment your evidence by customer type so one enthusiastic group does not hide a weak one. An AI assistant can help summarise transcripts, but remove names and contact details first, keep verbatim quotes beside every theme, and check each claimed pattern against the source. A coding agent can build the smallest test (a page and a payment link), but the success threshold stays yours.",
        },
        {
          type: 'takeaways',
          items: [
            'People do not pay for features. They pay to make a problem go away, save time, make money or feel less stressed.',
            '"Small businesses" is not a customer. Name the who, the when, what they do today and why they would switch.',
            'Your real competitor is often a notebook or a spreadsheet, so your app must be clearly better at the painful part.',
            'Talk to five people who match your description and ask about their past behaviour, not your idea.',
            'Count strangers who match, and actions (sign-ups, payments) more than words, because friends and family will say they love it.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-sell-your-app-01-q1',
          prompt: 'Which is the most useful customer description?',
          choices: [
            'Small businesses',
            'Home-based bakers who take orders on Messenger and lose track of who paid',
            'Everyone with a phone',
          ],
          answer: 1,
          explanation: 'A specific person and problem tells you where to find them and what to say to them.',
        },
        {
          id: 'mini-sell-your-app-01-q2',
          prompt: 'Why ask "How did you track orders last week?" instead of "Would you use my app?"',
          choices: [
            'Past behaviour is more honest than polite opinions about an idea',
            'It is shorter',
            'People dislike being asked about apps',
          ],
          answer: 0,
          explanation: 'People are kind about ideas. What they actually did shows how big the problem really is.',
        },
        {
          id: 'mini-sell-your-app-01-q3',
          prompt: 'What is often your real competitor?',
          choices: [
            'A famous app from abroad',
            'Nobody, if your idea is new',
            'The free, "good enough" way they handle it today, like a notebook or spreadsheet',
          ],
          answer: 2,
          explanation: 'People switch only when the new way is clearly better than what they already do.',
        },
        {
          id: 'mini-sell-your-app-01-q4',
          prompt: 'Your 10 friends all say they love your app. What does that prove?',
          choices: [
            'That you are ready to charge',
            'Not much; look for actions from strangers who match your customer',
            'That your price is right',
          ],
          answer: 1,
          explanation: 'Friends are kind. Sign-ups and payments from real target customers are stronger evidence.',
        },
        {
          id: "mini-sell-your-app-01-q5",
          audience: { max: "beginner" },
          prompt: "Which of these is the strongest sign that someone might pay for your app?",
          choices: [
            "She says \"great idea!\"",
            "She asks when she can start and pays a small deposit",
            "She likes your logo",
            "She shares your post once",
          ],
          answer: 1,
          explanation: "A deposit is an action that costs her something. Compliments, likes and shares are cheap, so they are weaker evidence.",
        },
        {
          id: "mini-sell-your-app-01-q6",
          audience: { min: "advanced" },
          prompt: "After 12 interviews, 9 people say they would pay, but only 1 has ever paid for any tool for this problem. What is the most defensible next step?",
          choices: [
            "Build the full app, since 9 of 12 is a clear majority",
            "Run a paid pilot or pre-sale with the people who already spend time or money on the problem, against a threshold you set beforehand",
            "Interview 12 more friends to confirm the result",
            "Lower the price until all 12 say yes",
          ],
          answer: 1,
          explanation: "Stated intent is cheap and past spending is a better signal. A pre-set threshold in a paid test tells you whether to continue before you invest more.",
        },
      ],
      task: {
        title: 'Define your customer',
        steps: [
          'Write your customer description using the who, when, what, why list.',
          'Run the "Interview questions" prompt and pick your best 5 questions.',
          'Message 3 people who match your description (a Facebook group you belong to, a friend of a friend) asking for a 15-minute chat.',
          'Draft your one-sentence value statement, even if it is a guess for now.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Read your customer description to a friend and ask them to name three real people who match it. If they cannot, make the description more specific.",
            "Rewrite two polite answers you received (or imagined) as the strong version: what did she actually do last week?",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Before you interview anyone, write the evidence that would make you stop: the number of interviews, the number of people who commit time or money, and the deadline. Keep a results table, and remove personal details before any AI tool summarises your notes.",
          ],
        },
      ],
    },
    {
      id: 'mini-sell-your-app-02',
      day: 2,
      title: 'Pricing models',
      summary: 'Choose between one-time, subscription, freemium and usage pricing, and check your costs.',
      intro: {
        objectives: [
          'Compare one-time, subscription, freemium, usage-based and service-plus-software pricing',
          'Pick a model that protects you when each user\'s AI use costs you money',
          'Explain why your costs set the floor and the value to the customer sets the ceiling',
          'Say why lifetime deals need care early on',
        ],
        why: 'A price that ignores your running costs can turn every sale into a loss, especially when your app calls an AI model. Choosing the model before the number keeps your app sustainable.',
      },
      minutes: 15,
      skills: ['pricing', 'customer-value'],
      body: [
        {
          type: 'paragraph',
          text: 'Pricing is not a number you guess at the end. It is a decision about how you and your customer share value. The model (how you charge) matters as much as the amount.',
        },
        { type: 'heading', text: 'Common models' },
        {
          type: 'list',
          items: [
            '**One-time purchase:** pay once, use it. Simple for buyers, but you need new buyers to keep earning.',
            '**Subscription:** monthly or yearly. Fits apps people use often and that cost you money to run every month.',
            '**Freemium:** a useful free plan and a paid plan with more. Works when many people use the free plan and some grow into needing more.',
            '**Usage-based:** pay per use (per report, per AI generation). Fits when your own costs grow with use.',
            '**Service plus software:** you set it up and run it for them, for a fee. Common for local small businesses.',
          ],
        },
        {
          type: 'table',
          headers: ['Model', 'It fits when'],
          rows: [
            [
              'One-time purchase',
              'You want it simple for buyers, but you need new buyers to keep earning',
            ],
            ['Subscription', 'People use the app often and it costs you money to run every month'],
            ['Freemium', 'Many people use a useful free plan and some grow into needing more'],
            ['Usage-based', 'Your own costs grow with use (per report, per AI generation)'],
            [
              'Service plus software',
              'You set it up and run it for them, common for local small businesses',
            ],
          ],
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Each pricing model matches something you already know. A **one-time purchase** is buying a book: you pay once and own it. A **subscription** is a gym membership: you pay every month while you use it. **Usage-based** pricing is a taxi meter: the more you ride, the more you pay. **Freemium** is free samples at a market stall: many people taste, a few buy. The **floor** of your price is your cost to serve one customer, and the **ceiling** is what the problem is worth to them. For example, if each customer costs you ₱40 a month to serve and saves a baker three hours a week, your price lives between those two numbers.",
        },
        { type: 'heading', text: 'Know your costs first' },
        {
          type: 'paragraph',
          text: 'Vibe-coded apps often run on services that charge as you grow: hosting, a database, email sending and, especially, AI model calls. If each user\'s AI usage costs you money every month, a one-time ₱299 price can turn into a loss. Write down every service, what it charges per user or per use, and what happens if a user uses it 10 times more than you expect. Check each provider\'s current pricing page; prices change.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-sell-your-app-02-scenario-1',
            kind: 'scenario',
            title: 'The ₱299 app with AI inside',
            prompt: 'Which pricing plan protects you?',
            concept: 'pricing and costs',
            situation: 'Your app calls an AI model for every report a user makes, and each call costs you money. You are planning to sell it for a one-time ₱299 with unlimited reports.',
            options: [
              {
                text: 'Charge monthly or by use, and limit AI use per user so a heavy user cannot cost more than they pay.',
                consequence: 'Your income grows with your costs, and the limit protects you from the user who uses it ten times more than you expected.',
                quality: 'best',
              },
              {
                text: 'Keep the one-time price but include only a fixed number of reports.',
                consequence: 'It protects your costs, but once a customer has used their reports you earn nothing more from them and must either refuse them or pay for their use yourself.',
                quality: 'acceptable',
              },
              {
                text: 'Keep ₱299 one-time with unlimited reports.',
                consequence: 'Every extra report is a cost you pay for, forever, with no extra income. A heavy user can turn the sale into a loss.',
                quality: 'poor',
              },
              {
                text: 'Make it free forever and figure out money later.',
                consequence: 'If every user costs you money, free forever means your costs grow with no income. Put limits on free use, especially for AI.',
                quality: 'poor',
              },
            ],
            hints: [
              'Each report costs you money again and again.',
              'Which model grows your income as your costs grow? Look at the list of models.',
              'Think about what happens if one user uses it ten times more than you expected.',
            ],
            explanation: 'If each user\'s AI use costs you money every month, a one-time price can turn into a loss. Pick a model whose income grows with your costs and limit heavy or free use.',
          },
        },
        {
          type: 'prompt',
          label: 'Pricing options',
          text: 'Help me think through pricing for my app.\nApp: [what it does, in one sentence]\nCustomer: [specific person]\nThey currently solve it by: [current way and what it costs them in time or money]\nMy running costs: [list services and how they charge, e.g. per user, per AI request]\n\nSuggest 2–3 pricing models that fit, with the pros and cons of each for this customer. For each, list what I must check about my costs so I do not lose money on heavy users. Use placeholders like [PRICE] instead of suggesting exact amounts, and suggest 3 questions to test willingness to pay in interviews.',
        },
        {
          type: 'paragraph',
          text: 'For the amount, start from the value, not your costs: what is the problem worth to them? If your app saves a baker 3 hours a week, that is worth more than a cup of coffee a month. Your costs set the floor; value sets the ceiling.',
        },
        {
          type: 'tip',
          text: 'In the Philippines many people prefer to pay with e-wallets such as GCash or Maya, or by bank transfer. Make sure your price and payment method fit how your customer actually pays.',
        },
        {
          type: 'warning',
          text: 'Do not launch with "free forever, I\'ll figure out money later" if every user costs you money. Put limits on free use, especially for AI features.',
        },
        {
          type: 'paragraph',
          text: 'You can change prices later. Early on, it is easier to raise prices for new customers than to take away what people already have, so be careful with "lifetime" deals.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Here is why the one-time ₱299 price is risky, with an imaginary cost. Suppose each AI-made report costs you ₱2 in AI fees. A customer who makes 20 reports costs you ₱40. A customer who makes 600 costs you ₱1,200. If you sold unlimited reports for ₱299 once, the second customer cost you ₱901 more than they paid (1,200 − 299). A monthly plan with a limit, for example 100 reports, caps that cost, and extra reports can be a paid add-on. Always check your real costs on each provider's pricing page, because the ₱2 here is only an example.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Model unit economics before you set a price. For each user type (light, typical, heavy), estimate monthly AI cost from tokens in and out per request multiplied by requests, then add hosting, email and payment fees, and compute the margin at your price. Providers bill AI by tokens, with different rates for input and output, and may offer features such as caching or batch processing that lower cost for suitable workloads. A heavy user is also an attack surface: a script can run up your bill (denial of wallet), so enforce per-user quotas, rate limits and input size limits on the server, never in the browser. Version your prices, and decide in advance whether existing customers keep their old terms.",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "python",
          label: "margin_per_user.py",
          code: "# Hypothetical numbers for teaching only. Use your own provider's current prices.\ndef monthly_margin(price, reports_per_month, tokens_in, tokens_out, cost_per_m_in, cost_per_m_out, fixed_per_user):\n    ai_cost = reports_per_month * (tokens_in * cost_per_m_in + tokens_out * cost_per_m_out) / 1_000_000\n    return price - ai_cost - fixed_per_user\n\nPLAN = dict(price=299, tokens_in=6000, tokens_out=1500, cost_per_m_in=40, cost_per_m_out=200, fixed_per_user=15)\nfor label, reports in [(\"light user\", 10), (\"typical user\", 60), (\"heavy user\", 600)]:\n    print(label, round(monthly_margin(reports_per_month=reports, **PLAN), 2))\nprint(\"monthly cap of 150 reports ->\", round(monthly_margin(reports_per_month=150, **PLAN), 2))",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Claude API docs, Pricing: usage is billed per token, with separate rates for input and output tokens, and the page describes prompt caching and a Batch API that processes requests asynchronously at a discount. OWASP LLM10:2025 (Unbounded Consumption) defines \"denial of wallet\" as exploiting pay-per-use pricing and recommends input size limits, rate limiting, per-user quotas, timeouts and usage monitoring. The numbers in the code above are made up for teaching; use your own provider's current prices.",
          checked: CHECKED,
          sources: [
            SRC.claudePricing,
            SRC.owaspLlm10,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'Pricing is a decision about how you and your customer share value: the model (how you charge) matters as much as the amount.',
            'The common models are one-time, subscription, freemium, usage-based and service plus software.',
            'Know your costs first: hosting, database, email and especially AI calls. Imagine a user using it 10 times more than you expect.',
            'Costs set the floor, value sets the ceiling: start from what the problem is worth to the customer.',
            'Limit free use, especially for AI features, and be careful with "lifetime" deals.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-sell-your-app-02-q1',
          prompt: 'Your app makes AI calls every time a user creates a report. Which model protects you most?',
          choices: [
            'A one-time payment with unlimited reports',
            'Free forever with no limits',
            'Usage-based pricing, or a subscription with a monthly limit',
          ],
          answer: 2,
          explanation: 'When your costs grow with each use, your pricing should too, or heavy users can cost you more than they pay.',
        },
        {
          id: 'mini-sell-your-app-02-q2',
          prompt: 'What should set the ceiling of your price?',
          choices: [
            'The value of the problem to the customer',
            'Your hosting bill',
            'The cheapest app you can find',
          ],
          answer: 0,
          explanation: 'Costs set the minimum you can charge. The value to the customer sets how much they may pay.',
        },
        {
          id: 'mini-sell-your-app-02-q3',
          prompt: 'Why be careful with "lifetime" deals early on?',
          choices: [
            'They are illegal in the Philippines',
            'You keep paying running costs for those users forever, with no new income from them',
            'Customers dislike them',
          ],
          answer: 1,
          explanation: 'A one-time payment cannot cover costs that continue every month for years.',
        },
        {
          id: 'mini-sell-your-app-02-q4',
          prompt: 'When does freemium tend to work?',
          choices: [
            'When the free plan is useless',
            'When only a few people will ever use the app',
            'When many people use a genuinely useful free plan and some grow into needing more',
          ],
          answer: 2,
          explanation: 'Freemium needs volume and a natural reason to upgrade; otherwise you just carry free users\' costs.',
        },
        {
          id: "mini-sell-your-app-02-q5",
          audience: { max: "beginner" },
          prompt: "Which pricing model works like a taxi meter?",
          choices: [
            "Freemium",
            "One-time purchase",
            "Usage-based, where you pay more the more you use",
            "Lifetime deal",
          ],
          answer: 2,
          explanation: "A taxi meter grows with the ride, just as usage-based pricing grows with use. That fits an app whose own costs grow with each use.",
        },
        {
          id: "mini-sell-your-app-02-q6",
          audience: { min: "advanced" },
          prompt: "You charge a monthly price with unlimited AI reports, and one account generates 600 reports in a month, costing you more than it pays. What should you add first?",
          choices: [
            "A warning in the terms that heavy use is discouraged",
            "A browser-side counter that hides the Generate button after 100 reports",
            "Per-user quotas and rate limits enforced on the server, with a paid overage or higher tier, and monitoring of cost per user",
            "A discount for heavy users to keep them",
          ],
          answer: 2,
          explanation: "Limits must be enforced where the user cannot bypass them, and a paid tier lets heavy use fund itself. A browser counter or a warning does not stop calls to your server.",
        },
      ],
      task: {
        title: 'Draft your pricing',
        steps: [
          'List every service your app uses and how each one charges (check their pricing pages).',
          'Estimate your monthly cost for one normal user and one very heavy user.',
          'Run the "Pricing options" prompt and pick one model.',
          'Write your offer in one line, for example "Free for 20 orders a month, then [PRICE] a month".',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Match each pricing model to its everyday picture (a book, a gym membership, a taxi meter, free samples), then say in two sentences which one fits your app and why.",
            "Write your own cost example with an imaginary cost per use and a light and a heavy customer, and work out what each one costs you.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Build a small table or script for a light, a typical and a heavy user using your provider's current token rates, and compute the margin at your price. Set a quota so the heavy user stays above zero margin and enforce it on the server, then test that a direct call cannot bypass it.",
          ],
        },
      ],
    },
    {
      id: 'mini-sell-your-app-03',
      day: 3,
      title: 'Landing page and waitlist',
      summary: 'One page, one promise, one button: build a page that turns visitors into sign-ups.',
      intro: {
        objectives: [
          'List the sections of a landing page and the job of each',
          'Write a headline that names a result for a specific person',
          'Build a waitlist form with a consent checkbox and test it with your own email',
          'Keep fake testimonials and hype out of the page',
        ],
        why: 'Your landing page is where visitors decide in seconds whether your app is for them. One clear offer and a working sign-up turns attention into a waitlist.',
      },
      minutes: 15,
      skills: ['landing-page', 'customer-value'],
      body: [
        {
          type: 'paragraph',
          text: 'A landing page has one job: make the right visitor understand your offer in a few seconds and take one action, like joining a waitlist or starting a trial. You can build one quickly with a vibe-coding tool such as Lovable, Bolt, Replit or v0, a website builder, or plain HTML.',
        },
        { type: 'heading', text: 'The sections that matter' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Headline:** the result, for your specific person. "Track every Messenger order and payment in one place."',
            '**Subheadline:** who it is for and how. One or two sentences.',
            '**One clear button:** "Join the waitlist" or "Start free".',
            '**Proof it works:** a screenshot or 20-second video of the app doing the key thing.',
            '**Three benefits:** results, not features.',
            '**Price or plan:** even "Free during early access" is clearer than nothing.',
            '**Short FAQ:** the 3 questions people always ask (payment, data, phone support).',
          ],
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-sell-your-app-03-match-1',
            kind: 'match',
            title: 'What each section does',
            prompt: 'Match each landing page section with its job.',
            concept: 'landing pages',
            pairs: [
              {
                term: 'Headline',
                definition: 'The result, for your specific person',
                note: 'For example "Track every Messenger order and payment in one place."',
              },
              {
                term: 'Subheadline',
                definition: 'Who it is for and how, in one or two sentences',
                note: 'It supports the headline.',
              },
              {
                term: 'Button',
                definition: 'The one clear action, such as "Join the waitlist" or "Start free"',
                note: 'One page, one action.',
              },
              {
                term: 'Proof',
                definition: 'A screenshot or 20-second video of the app doing the key thing',
                note: 'It shows the app works.',
              },
              {
                term: 'Benefits',
                definition: 'Three results, not features',
                note: 'Say what changes for the customer.',
              },
            ],
            hints: [
              'The headline and the subheadline say what and for whom.',
              'The button is the single action you want the visitor to take.',
              'Proof is shown, not told: a screenshot or a short video.',
            ],
            explanation: 'A landing page has one job: make the right visitor understand the offer in a few seconds and take one action. Each section supports that.',
          },
        },
        {
          type: 'prompt',
          label: 'Landing page copy',
          text: 'Write landing page copy for my app.\nCustomer: [specific person]\nProblem: [the painful moment]\nResult: [what changes for them]\nOffer: [your pricing line from Day 2]\n\nGive me: 3 headline options (under 10 words, about the result), a subheadline, a button label, 3 benefits (result first, then feature), and a 4-question FAQ. Plain English a busy Filipino small business owner would understand. No hype words like "revolutionary", no fake testimonials, no claims I cannot prove.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-sell-your-app-03-scenario-1',
            kind: 'scenario',
            title: 'Pick the headline',
            prompt: 'Which headline is best for a Messenger-order tracker for home-based bakers?',
            concept: 'writing a headline',
            situation: 'The AI gave you four headlines for your landing page.',
            options: [
              {
                text: 'Track every Messenger order and payment in one place.',
                consequence: 'It names the result for a specific person, so a baker who loses track of orders thinks "that\'s me".',
                quality: 'best',
              },
              {
                text: 'Order tracking for small businesses.',
                consequence: 'It is clear, but it is generic. "Small businesses" is not a customer, so nobody feels it is for them.',
                quality: 'acceptable',
              },
              {
                text: 'The revolutionary AI-powered order platform.',
                consequence: 'It is hype with no result. Visitors cannot tell what it does for them.',
                quality: 'poor',
              },
              {
                text: 'Version 1.0 of our app is here!',
                consequence: 'It is about you and your app, not about the result for the customer.',
                quality: 'poor',
              },
            ],
            hints: [
              'A good headline is about the result, for your specific person.',
              'Hype words like "revolutionary" are flagged in the prompt.',
              'Which one would make a baker say "that\'s me"?',
            ],
            explanation: 'The headline should state the result for a specific person, in plain words. Generic or hype headlines do not tell the right visitor why to stay.',
          },
        },
        { type: 'heading', text: 'The sign-up' },
        {
          type: 'paragraph',
          text: 'A waitlist needs a form that stores emails somewhere you can reach them. You can use a form tool, a newsletter service, a Google Form, or your hosting provider\'s form feature. The form itself can be simple:',
        },
        {
          type: 'code',
          language: 'html',
          label: 'Waitlist form',
          code: '<form action="YOUR_FORM_ENDPOINT" method="POST">\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required autocomplete="email">\n  <label>\n    <input name="consent" type="checkbox" required>\n    I agree to receive emails about this app. I can unsubscribe anytime.\n  </label>\n  <button type="submit">Join the waitlist</button>\n</form>',
        },
        {
          type: 'paragraph',
          text: 'Replace `YOUR_FORM_ENDPOINT` with the address your form service gives you. Test it with your own email and check that the entry arrives.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Here is the form in plain words. **HTML** is the language that describes what a web page contains. `<form>` wraps the whole sign-up box. `action` is the address the form sends its answers to, and `method=\"POST\"` means \"send them in the message body rather than in the address\". Each `<label>` is the visible text beside a box, and `<input type=\"email\">` is a box that expects an email address. `required` means the browser will not send the form until that box is filled in, and `autocomplete=\"email\"` lets a phone suggest the owner's email. The checkbox is the consent: it must be ticked too. The `<button>` sends everything. Only the words between tags are what visitors see.",
        },
        {
          type: 'warning',
          text: 'Emails are personal data. Collect only what you need, say clearly what you will send, add a short privacy note, and keep the list private. The Data Privacy Act applies in the Philippines; for details, check with the National Privacy Commission or a lawyer.',
        },
        {
          type: 'tip',
          text: 'Check the page on your phone first. Most of your visitors from Facebook or TikTok will be on mobile.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **waitlist** is a list of people who asked to hear from you when the app is ready, so you start with interested people on launch day. **Consent** simply means they knew what they were signing up for and agreed. Test your headline the cheap way: show the page to someone for five seconds, hide it, and ask them what it was for and who it was for. If they cannot say, the headline is not clear yet. Then change one thing at a time, so you know which change helped. A page does not have to be pretty to work. It has to say one clear thing to one kind of person.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "A landing page is also a small production system. Protect the form: validate on the server, rate-limit, and add a honeypot field or bot challenge, because a public endpoint attracts junk. Use double opt-in so only confirmed addresses count, and store the consent text, version and time. Make attribution automatic by copying `utm_` parameters from the URL into hidden fields so each sign-up carries its source. Measure performance on a mid-range phone: Core Web Vitals call for good loading, interactivity and visual stability at the 75th percentile of real visits. Keep the page fast by compressing images and loading only the scripts you need. A coding agent can build all this quickly, so write the acceptance checks first.",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "javascript",
          label: "capture-utm.js",
          code: "const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];\nexport function tagsFrom(search) {\n  const params = new URLSearchParams(search);\n  const tags = {};\n  for (const key of KEYS) {\n    const value = params.get(key);\n    if (value) tags[key] = value.slice(0, 80);\n  }\n  return tags;\n}",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "web.dev, Web Vitals: the Core Web Vitals \"good\" thresholds are Largest Contentful Paint of 2.5 seconds or less, Interaction to Next Paint of 200 milliseconds or less and Cumulative Layout Shift of 0.1 or less, measured at the 75th percentile of page loads, segmented by mobile and desktop. Google Analytics Help says campaign URLs can carry utm_source, utm_medium, utm_campaign, utm_id, utm_term and utm_content, and recommends always using utm_source, utm_medium and utm_campaign, because missing parameters appear as \"(not set)\" in reports.",
          checked: CHECKED,
          sources: [
            SRC.webVitals,
            SRC.gaUtm,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'A landing page has one job: make the right visitor understand your offer in a few seconds and take one action.',
            'The sections that matter: headline, subheadline, one clear button, proof, three benefits, price or plan and a short FAQ.',
            'A waitlist form needs to store emails somewhere you can reach them: test it with your own email.',
            'Emails are personal data: collect only what you need, say what you will send, add a privacy note and keep the list private.',
            'Check the page on your phone first, because most visitors from Facebook or TikTok are on mobile.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-sell-your-app-03-q1',
          prompt: 'What is the main job of a landing page?',
          choices: [
            'List every feature of the app',
            'Help the right visitor understand the offer quickly and take one action',
            'Show off your design skills',
          ],
          answer: 1,
          explanation: 'One page, one promise, one button. Extra choices and long feature lists lower sign-ups.',
        },
        {
          id: 'mini-sell-your-app-03-q2',
          prompt: 'Which headline is strongest?',
          choices: [
            '"Track every Messenger order and payment in one place"',
            '"The most revolutionary AI-powered platform"',
            '"Welcome to my app"',
          ],
          answer: 0,
          explanation: 'It names a concrete result for a specific person, with no unprovable hype.',
        },
        {
          id: 'mini-sell-your-app-03-q3',
          prompt: 'Why does the form include a consent checkbox and a privacy note?',
          choices: [
            'Browsers require checkboxes',
            'It makes the form look professional',
            'Emails are personal data, so people should know and agree to what you will send',
          ],
          answer: 2,
          explanation: 'Being clear about what you collect and why respects visitors and helps you follow privacy rules.',
        },
        {
          id: 'mini-sell-your-app-03-q4',
          prompt: 'Your AI tool wrote a testimonial from "Maria, Cebu" who does not exist. What do you do?',
          choices: [
            'Remove it; only use real testimonials with permission',
            'Keep it, everyone does it',
            'Change the name to make it more believable',
          ],
          answer: 0,
          explanation: 'Fake testimonials mislead customers and destroy trust. Use real ones, with permission, or none yet.',
        },
        {
          id: "mini-sell-your-app-03-q5",
          audience: { max: "beginner" },
          prompt: "In the waitlist form, what does `required` on the email box do?",
          choices: [
            "It makes the email address visible to everyone",
            "It checks that the address really exists",
            "It sends the form to your phone",
            "The browser will not send the form until the box is filled in",
          ],
          answer: 3,
          explanation: "`required` is a rule the browser checks before sending. It does not check that the address is real, which is why you test with your own email.",
        },
        {
          id: "mini-sell-your-app-03-q6",
          audience: { min: "advanced" },
          prompt: "Your waitlist form posts straight to a public endpoint and you see 300 junk sign-ups overnight. Which response fixes the cause?",
          choices: [
            "Delete the junk rows each morning",
            "Hide the form until launch day",
            "Validate and rate-limit on the server, add a honeypot or bot challenge, and use double opt-in so only confirmed emails count",
            "Add a longer privacy note",
          ],
          answer: 2,
          explanation: "Junk arrives because the endpoint is open to automated posts. Server-side checks, bot protection and confirmation fix that, while cleaning up daily only hides the symptom.",
        },
      ],
      task: {
        title: 'Draft your landing page',
        steps: [
          'Run the "Landing page copy" prompt and pick your favourite headline.',
          'Build a first version of the page with a vibe-coding tool or website builder, including the waitlist form.',
          'Connect the form to a form service and submit a test with your own email.',
          'Open the page on your phone and fix anything hard to read or tap.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask the AI to explain each line of your form's code in plain words, then change the button label and the consent sentence and look at the result.",
            "Do the five-second test with two people and write down what each one says the page is for.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add hidden fields that capture utm_source, utm_medium and utm_campaign into each sign-up and test with a tagged link. Measure your page on a mid-range phone setting for loading and layout shift, and record the numbers and one fix.",
          ],
        },
      ],
    },
    {
      id: 'mini-sell-your-app-04',
      day: 4,
      title: 'Payments and receipts',
      summary: 'Understand your payment options in general terms and set up the basics of getting paid properly.',
      intro: {
        objectives: [
          'Match a way of getting paid to your stage: manual, gateway, merchant of record or app store',
          'Explain why only a verified webhook should unlock the paid plan',
          'Keep the secret API key on your server and use test mode first',
          'Name the questions to ask the BIR or an accountant before you sell',
        ],
        why: 'Taking money is where a side project becomes a business, and mistakes here cost real money or let people use your app for free. Knowing the safe flow and the registration basics helps you start properly.',
      },
      minutes: 15,
      skills: ['payments-receipts', 'pricing'],
      body: [
        {
          type: 'paragraph',
          text: 'Taking money is where a side project becomes a business. This lesson gives you the general picture so you can ask the right questions. Payment rules, fees and tax requirements change, so always confirm the details with the provider, the BIR and an accountant.',
        },
        { type: 'heading', text: 'Ways to get paid' },
        {
          type: 'list',
          items: [
            '**Manual at first:** bank transfer or e-wallet (GCash, Maya), then you activate the account by hand. Fine for your first few customers.',
            '**A payment gateway:** a service that lets your website accept cards, e-wallets and bank payments, and tells your app when a payment succeeds. Several gateways serve Philippine businesses; compare their supported methods, fees and requirements.',
            '**A merchant of record:** a service that sells on your behalf and handles some sales taxes for international customers. Often used for selling software abroad.',
            '**App stores:** if you sell digital features inside an iPhone or Android app, Apple and Google generally require their own in-app purchase systems. Check their current rules.',
          ],
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-sell-your-app-04-match-1',
            kind: 'match',
            title: 'Which way to get paid?',
            prompt: 'Four app makers are at different stages. Match each situation with the way of getting paid that fits it.',
            concept: 'payment options',
            labels: { terms: 'Your situation', meanings: 'Way to get paid' },
            pairs: [
              {
                term: 'You have three customers for your booking app. Each sends ₱299 by GCash and you switch on their account that evening.',
                definition: 'Manual at first',
                note: 'A transfer plus your own hands is fine for the first few customers.',
              },
              {
                term: 'With 200 customers a month, you want card and e-wallet payments on your site to unlock the plan without you.',
                definition: 'Payment gateway',
                note: 'It accepts payments on your site and tells your app when one succeeds.',
              },
              {
                term: 'Customers in Europe and the US want your software, and you want a service to sell for you and handle some sales taxes.',
                definition: 'Merchant of record',
                note: 'It sells on your behalf, which suits selling software abroad.',
              },
              {
                term: 'You want to sell an "extra templates" upgrade inside your iPhone app.',
                definition: 'App stores',
                note: 'Digital features inside an app generally go through Apple\'s and Google\'s in-app purchases.',
              },
            ],
            hints: [
              'Ask how many customers there are, where they are, and where they pay: on your site or inside an app.',
              'A handful of customers can be handled by hand; hundreds need something automatic.',
              'Selling abroad with taxes handled for you is one kind of service; selling inside an iPhone app has its own rules.',
            ],
            explanation: 'Three GCash customers can be activated by hand, automatic payments on your site need a gateway, selling software abroad with some taxes handled suits a merchant of record, and digital upgrades inside an iPhone app go through the app store.',
          },
        },
        { type: 'heading', text: 'How a gateway fits your app' },
        {
          type: 'paragraph',
          text: 'Most gateways follow the same pattern: your server creates a checkout or payment link, the customer pays on the gateway\'s page, then the gateway sends your server a notification (a webhook). Only that verified notification should unlock the paid plan.',
        },
        {
          type: 'diagram',
          format: 'json',
          source: {
            kind: 'sequence',
            title: 'A safe payment flow',
            summary: 'Your server creates a checkout with the payment gateway, the customer pays on the gateway\'s page, and the gateway sends your server a verified notification (a webhook). Only that notification unlocks the paid plan.',
            participants: [
              { id: 'customer', label: 'Customer', shape: 'actor' },
              {
                id: 'server',
                label: 'Your server',
                note: 'It holds the secret API key. The key never goes in frontend code.',
              },
              { id: 'gateway', label: 'Payment gateway' },
            ],
            messages: [
              { from: 'server', to: 'gateway', label: 'Create a checkout or payment link' },
              { from: 'gateway', to: 'server', label: 'Checkout link', dashed: true },
              { from: 'server', to: 'customer', label: 'Send them to the gateway\'s page' },
              { from: 'customer', to: 'gateway', label: 'Pay on the gateway\'s page' },
              {
                from: 'gateway',
                to: 'server',
                label: 'Webhook: payment succeeded',
                note: 'Verify it. Only this verified notification should unlock the paid plan.',
              },
              { from: 'server', to: 'customer', label: 'Unlock the paid plan', dashed: true },
            ],
          },
          caption: 'The redirect back to your site is not proof of payment. Wait for the verified webhook.',
        },
        {
          type: 'prompt',
          label: 'Plan a safe payment flow',
          text: 'I am adding payments to my web app built with [your stack]. I will use [gateway name] and its hosted checkout page. Explain, step by step, the safe flow: creating a checkout on the server, redirecting the user, receiving and verifying the webhook signature, and only then marking the user as paid. List the mistakes beginners make (trusting the redirect page, secret keys in frontend code, not handling duplicate webhooks). Tell me which parts I must confirm in the gateway\'s current documentation.',
        },
        {
          type: 'warning',
          text: 'Your secret API key belongs only on your server, in an environment variable. Never put it in frontend code, a public repo, or an AI chat. Use the gateway\'s test mode until everything works.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-sell-your-app-04-scenario-1',
            kind: 'scenario',
            title: 'The customer came back from the payment page',
            prompt: 'When do you unlock the paid plan?',
            concept: 'payment flow',
            situation: 'A customer finishes paying on the gateway\'s page and is sent back to your site\'s "thank you" page.',
            options: [
              {
                text: 'Show "We\'re confirming your payment" and unlock the plan only when your server receives and verifies the gateway\'s webhook.',
                consequence: 'The plan is unlocked only for payments the gateway really confirmed. Someone who just opens your thank-you page does not get it.',
                quality: 'best',
              },
              {
                text: 'During your first few customers, check each payment by hand and activate the account yourself.',
                consequence: 'It is slow and does not scale, but it is safe for the first few customers because a person confirms every payment.',
                quality: 'acceptable',
              },
              {
                text: 'Unlock the plan as soon as the thank-you page loads.',
                consequence: 'Anyone can open that page without paying. Trusting the redirect is one of the beginner mistakes.',
                quality: 'poor',
              },
              {
                text: 'Put the secret key in the app so the browser can ask the gateway directly.',
                consequence: 'The key would be visible to anyone. Your secret key belongs only on your server.',
                quality: 'poor',
              },
            ],
            hints: [
              'What proves a payment really happened?',
              'Which part of the flow can anyone fake by opening a link?',
              'The gateway tells your server, with a webhook, when a payment succeeds.',
            ],
            explanation: 'Only the gateway\'s verified notification should unlock the paid plan, and your secret key stays on your server. Manual checking is fine for your very first customers.',
          },
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **webhook** is the payment service calling your server to say \"this payment worked\", like the bank texting you after a deposit instead of you checking your balance all day. It matters because the \"thank you\" page is not proof: anyone can type its address into a browser without paying. Only the message from the payment service, which your server can check, is proof. A **secret key** is a password that lets your server act on your payment account, so it lives only on your server. **Test mode** is practice with play money: you run the whole flow, including the webhook, before real customers pay. The gateway's documentation tells you how to turn it on.",
        },
        { type: 'heading', text: 'Receipts and registration, in general' },
        {
          type: 'paragraph',
          text: 'If you earn from your app in the Philippines, you will generally need to register with the BIR, as a self-employed individual or as a business, and issue BIR-registered invoices or receipts for your sales. Registration types, invoice rules and tax options depend on your situation and have changed in recent years. Talk to your Revenue District Office or an accountant before you start selling, not after.',
        },
        {
          type: 'list',
          items: [
            'Keep a simple record of every sale and every expense from day one.',
            'Keep the payment gateway\'s reports; they help with your books.',
            'Write a clear refund policy and put it on your site.',
            'Add terms of service and a privacy policy; a lawyer can review templates.',
          ],
        },
        {
          type: 'tip',
          text: 'Ask the AI to explain unfamiliar terms (merchant of record, webhook, chargeback), then confirm anything legal or tax-related with an official source.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Records are the paper trail that shows a sale happened. A **receipt** or **invoice** is the document you give the customer as proof of a sale. Keep a simple table from day one with the date, customer, amount, how they paid, the gateway's reference number and the receipt number. Keep the gateway's reports too. A **refund policy** is a promise about when you give money back, written before anyone asks. These records help your accountant, protect you in a dispute, and let you check that every payment the gateway reports matches a customer in your app. Ask your accountant or the BIR which records and receipts you must keep.",
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "At your stage the work is making payment state reliable. Keep each user's plan in your database (for example plan, status and updated time) and change it only from verified webhook events, never from the browser. Build in the gateway's test mode and use its test webhooks and test card numbers. Save every event id and ignore repeats, because gateways retry. Add a manual \"re-check payment\" button for the days an event is late, and decide what happens on a refund, a failed renewal or a cancelled plan. Test these paths one by one before you accept real money, and keep the test results with your notes.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat the webhook as a security boundary. Verify the signature over the raw request body with the gateway's scheme (commonly an HMAC with a shared secret), compare with a constant-time function, and reject anything that fails. Process each event id once, tolerate out-of-order events, and derive entitlements from the event stream rather than from a single flag. Store raw events for audit and run a reconciliation job that compares the gateway's reports with your records. Order tests before code: bad signature, valid event, duplicate event, unknown user. If a coding agent writes the handler, give it those tests and review the diff against them. Signature formats differ between providers, so read yours.",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "python",
          label: "webhook_handler.py",
          code: "import hashlib, hmac, json\n\nSECRET = b\"whsec_demo_only\"   # in real life: an environment variable from the provider's dashboard\nseen_events = set()           # in real life: a database table with a unique constraint on the event id\npaid_users = set()\n\ndef sign(body: bytes) -> str:\n    return hmac.new(SECRET, body, digestmod=\"sha256\").hexdigest()\n\ndef handle_webhook(raw_body: bytes, signature: str) -> str:\n    if not hmac.compare_digest(sign(raw_body), signature):\n        return \"400 bad signature\"\n    event = json.loads(raw_body)\n    if event[\"id\"] in seen_events:\n        return \"200 duplicate, ignored\"\n    seen_events.add(event[\"id\"])\n    if event[\"type\"] == \"payment.succeeded\":\n        paid_users.add(event[\"user_id\"])\n    return \"200 ok\"\n\nbody = json.dumps({\"id\": \"evt_1\", \"type\": \"payment.succeeded\", \"user_id\": \"u42\"}).encode()\nprint(handle_webhook(body, sign(body)))\nprint(handle_webhook(body, sign(body)))\nprint(handle_webhook(body, \"0\" * 64))\nprint(sorted(paid_users))",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Where the customer pays also matters. If your product is a mobile app that unlocks digital features, the app stores have their own rules, and a web gateway may not be allowed for that purchase. Check the current rules for each store you publish on before you design billing, and keep the web path and the store path as separate, clearly documented entitlements.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "RFC 2104 defines HMAC, message authentication with a hash function and a shared secret key. Python's hmac documentation recommends hmac.compare_digest instead of == when verifying an externally supplied digest, to reduce timing-attack exposure. Apple's App Review Guideline 3.1.1 says features or functionality unlocked inside an app (such as subscriptions or premium content) must use in-app purchase, with exceptions described in 3.1.1(a) and 3.1.3, including for the United States storefront. Google Play's Payments policy says apps that charge for in-app features, content or services, including subscriptions and cloud software and services, generally must use Google Play's billing system, with exceptions and alternative-billing programs in eligible regions. The pages show no effective dates, so recheck both before you rely on them.",
          checked: CHECKED,
          sources: [
            SRC.rfc2104,
            SRC.pyHmac,
            SRC.appleGuidelines,
            SRC.googlePlayPayments,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'Ways to get paid: manual at first, a payment gateway, a merchant of record, or the app stores\' own in-app purchases.',
            'The usual gateway flow: your server creates a checkout, the customer pays on the gateway\'s page, and a webhook tells your server. Only a verified webhook unlocks the paid plan.',
            'Your secret API key belongs only on your server, in an environment variable. Use the gateway\'s test mode until everything works.',
            'In the Philippines you will generally need to register with the BIR and issue registered receipts. Confirm the details with your RDO or an accountant before you start selling.',
            'Keep a record of every sale and expense, and publish a refund policy, terms of service and a privacy policy.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-sell-your-app-04-q1',
          prompt: 'When should your app mark a user as paid?',
          choices: [
            'When they land on the "Thank you" page',
            'When they click the Pay button',
            'When your server receives and verifies the gateway\'s payment notification (webhook)',
          ],
          answer: 2,
          explanation: 'Anyone can open a thank-you URL. A verified webhook from the gateway is the reliable signal.',
        },
        {
          id: 'mini-sell-your-app-04-q2',
          prompt: 'Where should your payment gateway\'s secret key be stored?',
          choices: [
            'In an environment variable on your server',
            'In your frontend JavaScript',
            'In your public GitHub README',
          ],
          answer: 0,
          explanation: 'Secret keys must stay on the server. Anyone can read frontend code and public repos.',
        },
        {
          id: 'mini-sell-your-app-04-q3',
          prompt: 'You will earn from your app in the Philippines. What is the right first step on taxes?',
          choices: [
            'Wait until you earn a lot',
            'Ask an AI tool for the exact tax rate and follow it',
            'Ask your Revenue District Office or an accountant about registration and invoices before selling',
          ],
          answer: 2,
          explanation: 'Rules depend on your situation and change over time. Official advice before you sell avoids problems later.',
        },
        {
          id: 'mini-sell-your-app-04-q4',
          prompt: 'Why use the gateway\'s test mode first?',
          choices: [
            'You can test the full flow, including webhooks, without moving real money',
            'Test mode has lower fees forever',
            'Real mode is only for big companies',
          ],
          answer: 0,
          explanation: 'Test mode lets you find bugs safely before real customers pay.',
        },
        {
          id: "mini-sell-your-app-04-q5",
          audience: { max: "beginner" },
          prompt: "What is a webhook?",
          choices: [
            "A message the payment service sends to your server when something happens, such as a payment succeeding",
            "A button that customers press to pay",
            "A secret password for your payment account",
            "A page that thanks the customer",
          ],
          answer: 0,
          explanation: "A webhook is a notification from the service to your server. Your server verifies it, then unlocks the plan.",
        },
        {
          id: "mini-sell-your-app-04-q6",
          audience: { min: "advanced" },
          prompt: "Your server receives the same \"payment succeeded\" webhook three times because the gateway retries when your reply is slow. What should happen?",
          choices: [
            "Unlock the plan three times so the customer gets triple credit",
            "Reject all three, since duplicates are suspicious",
            "Verify each signature, record the event id the first time, and ignore repeats so access is granted once",
            "Ignore the signature after the first delivery",
          ],
          answer: 2,
          explanation: "Gateways retry, so duplicates are normal. Checking the signature and processing each event id once makes retries harmless without granting access twice.",
        },
      ],
      task: {
        title: 'Map your payment setup',
        steps: [
          'Decide how your first customers will pay: manual transfer or a gateway.',
          'Compare two payment gateways\' documentation: supported methods, requirements and test mode.',
          'Run the "Plan a safe payment flow" prompt and save the list of beginner mistakes.',
          'Write down three questions about registration and invoices to ask an accountant or your RDO.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "List, in order, what happens from the customer pressing Pay to your app unlocking the plan, using these words: checkout, gateway page, webhook, unlock. Mark the one step that proves the payment.",
            "Start a simple sales table with the columns date, customer, amount, how paid and reference number, and fill in two made-up sales.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "In test mode, make a test payment and confirm the plan changes only after the webhook arrives. Then send the same test event twice and confirm that your database changes once.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write the webhook handler as tests first (bad signature, valid event, duplicate event, unknown user), have an assistant implement it, and run the tests. Record which test caught a bug and which store rule applies to each place you sell.",
          ],
        },
      ],
    },
    {
      id: 'mini-sell-your-app-05',
      day: 5,
      title: 'Launch and marketing with short videos',
      summary: 'Show your app solving the problem in under a minute, post where your customers are, and measure.',
      intro: {
        objectives: [
          'Structure a short video as hook, show, result and call to action',
          'Choose where to post and follow each group\'s rules',
          'Track visitors, sign-ups and paying users with a tagged link per platform',
        ],
        why: 'A launch is weeks of showing your app to the right people, and short videos are a low-cost way to do it. Measuring sign-ups instead of views shows you what is actually working.',
      },
      minutes: 15,
      skills: ['launch-marketing', 'landing-page'],
      body: [
        {
          type: 'paragraph',
          text: 'A launch is not one big day. It is a few weeks of showing your app to the right people, again and again, and learning what makes them sign up. Short videos on TikTok, Facebook Reels, Instagram Reels and YouTube Shorts are a practical way to do this, and your phone is enough.',
        },
        { type: 'heading', text: 'A simple video formula' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Hook (first 2–3 seconds):** the problem, in your customer\'s words. "Lost track of who paid for their order again?"',
            '**Show (15–30 seconds):** a screen recording of the app fixing it. Real app, real speed.',
            '**Result:** what changed. "All orders and payments in one list."',
            '**Call to action:** "Link in bio to join the waitlist."',
          ],
        },
        {
          type: 'diagram',
          format: 'json',
          source: {
            kind: 'flow',
            title: 'A short video, in four parts',
            summary: 'A short video starts with a hook that names the problem, shows a screen recording of the app fixing it, states the result and ends with a call to action.',
            direction: 'LR',
            nodes: [
              {
                id: 'hook',
                label: 'Hook',
                shape: 'rounded',
                note: 'The first 2 to 3 seconds: the problem in your customer\'s words.',
              },
              {
                id: 'show',
                label: 'Show',
                note: '15 to 30 seconds of a real screen recording of the app fixing it, at real speed.',
              },
              {
                id: 'result',
                label: 'Result',
                note: 'What changed, for example "All orders and payments in one list."',
              },
              {
                id: 'cta',
                label: 'Call to action',
                shape: 'rounded',
                note: 'For example "Link in bio to join the waitlist."',
              },
            ],
            edges: [
              { from: 'hook', to: 'show' },
              { from: 'show', to: 'result' },
              { from: 'result', to: 'cta' },
            ],
          },
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-sell-your-app-05-match-1',
            kind: 'match',
            title: 'Sort the video lines',
            prompt: 'These lines come from a short video for an app tutors use to track sessions. Match each line or scene with its part of the formula.',
            concept: 'short video structure',
            labels: { terms: 'Lines from a tutor app\'s video', meanings: 'Part of the formula' },
            pairs: [
              {
                term: '"Still writing your tutoring schedule on the back of a notebook?"',
                definition: 'Hook',
                note: 'It names the problem in the customer\'s words in the first seconds.',
              },
              {
                term: 'A screen recording: tapping "Add session" and watching the week fill in, at normal speed.',
                definition: 'Show',
                note: 'The real app fixing the problem at real speed.',
              },
              {
                term: '"Every student, every session and every payment, on one screen."',
                definition: 'Result',
                note: 'It says what changed.',
              },
              {
                term: '"Tap the link in our bio to try it free."',
                definition: 'Call to action',
                note: 'It tells viewers the one thing to do next.',
              },
            ],
            hints: [
              'The hook is the problem, said the way a tutor would say it.',
              '"Show" is something you see on screen, not something you say.',
              'Of the two spoken lines left, one says what changed and one tells viewers what to do.',
            ],
            explanation: 'The notebook question is the hook, the screen recording is the show, "everything on one screen" is the result, and the link in bio is the call to action.',
          },
        },
        {
          type: 'prompt',
          label: 'Video scripts',
          text: 'Write 5 short video scripts (under 45 seconds each) for my app.\nCustomer: [specific person]\nProblem: [painful moment]\nApp result: [what changes]\nCall to action: [join waitlist / try free]\n\nEach script: a hook line for the first 3 seconds, what to show on screen, a voiceover in simple English or Taglish, on-screen text, and the call to action. Make each script try a different angle: a mistake, a before-and-after, a quick tip, a day in the life, and answering a common question. No fake results or made-up numbers.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **screen recording** is a video of your phone or computer screen, with your voice or text over it. A **call to action** is the one thing you tell viewers to do next, like \"tap the link in our bio to try it free\". A **tagged link** is your web address with a short label added at the end, so you can tell where each visitor came from. For example `https://your-site.example/?utm_source=tiktok&utm_medium=short_video&utm_campaign=launch1` still opens the same page, but your sign-up records can say \"tiktok\". Use a different label for each platform and you will know which videos bring people, not just which ones get watched.",
        },
        { type: 'heading', text: 'Where to post' },
        {
          type: 'list',
          items: [
            'Where your customers already are: Facebook groups for their trade, TikTok, a local community.',
            'Follow each group\'s rules. Many ban promotion; share something useful and answer questions instead.',
            'Communities for makers, such as Product Hunt or Indie Hackers, if your customers are tech-savvy.',
            'Your own network: one honest post about what you built and who it is for.',
          ],
        },
        { type: 'heading', text: 'Measure what matters' },
        {
          type: 'paragraph',
          text: 'Views feel good, but sign-ups and payments pay the bills. Use a different link (or a link with a tag) for each platform so you can see where sign-ups come from. Every week, write down: posts made, visitors, sign-ups, paying users. Keep doing what brings sign-ups and drop what does not.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-sell-your-app-05-scenario-1',
            kind: 'scenario',
            title: 'Views or sign-ups?',
            prompt: 'What do you do next week?',
            concept: 'measuring launch results',
            situation: 'After a week, video A has 50,000 views and 2 sign-ups. Video B has 800 views and 20 sign-ups. Each used its own tagged link.',
            options: [
              {
                text: 'Make more videos like B and learn why it brought sign-ups, then keep tracking visitors, sign-ups and paying users each week.',
                consequence: 'You follow the thing that pays the bills, and the tagged links let you see which post brought each sign-up.',
                quality: 'best',
              },
              {
                text: 'Make more videos like A for the reach, but add a stronger call to action.',
                consequence: 'Reach can help, but you are following the number that feels good while the weaker result on sign-ups is still unexplained.',
                quality: 'acceptable',
              },
              {
                text: 'Ignore the numbers and keep posting whatever you feel like.',
                consequence: 'Without looking at sign-ups you cannot tell what works, so you drop nothing and learn nothing.',
                quality: 'poor',
              },
            ],
            hints: [
              'Views feel good, but sign-ups and payments pay the bills.',
              'Why does a tagged link per platform help?',
              'Keep doing what brings sign-ups and drop what does not.',
            ],
            explanation: 'Measure what matters: sign-ups and paying users, not just views. Use a different tagged link per platform, review weekly and keep what brings sign-ups.',
          },
        },
        {
          type: 'tip',
          text: 'Reply to every comment and message in the first weeks. Early users\' questions show you what to fix on your landing page and what to film next.',
        },
        {
          type: 'warning',
          text: 'Disclose paid partnerships if you pay creators, use music you have the rights to, and never post customer data or screenshots without permission. No result is guaranteed; consistency and learning are what you control.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Keep a weekly table, because numbers beat feelings. A **conversion rate** is the share of people who took the next step: sign-ups divided by visitors. Say TikTok sent 900 visitors and 18 signed up: 18 ÷ 900 = 2%. A Facebook group sent 120 visitors and 15 signed up: 15 ÷ 120 = 12.5%. The group sent far fewer visitors but a much higher share of them signed up, so it may be where your customers are. Then look at the next step as well: how many of the sign-ups paid? Decide what to do next from the table, not from the number of views.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Run the launch as a funnel experiment. Per channel, track visitors, sign-ups and paying customers, and compare rates per visitor and per sign-up, not raw counts. Watch the sample size: 15 versus 18 sign-ups is too few to declare a winner, so set a decision rule before you post (for example, keep a channel only if it produces a set number of paying customers at or below a target cost within four weeks). Tag every link so attribution survives, and add cohort retention once people use the app. A coding agent can build a small script that turns exports into this table, but you define the metrics and the thresholds. Follow each platform's and your country's rules on advertising disclosure when you pay creators.",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "python",
          label: "channel_funnel.py",
          code: "rows = {\"tiktok\": dict(visitors=900, signups=18, paying=2), \"facebook_group\": dict(visitors=120, signups=15, paying=3)}\nfor name, r in rows.items():\n    print(f'{name}: {r[\"signups\"]/r[\"visitors\"]:.1%} of visitors signed up, {r[\"paying\"]/r[\"signups\"]:.1%} of sign-ups paid')",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Google Analytics Help says campaign URLs can include utm_id, utm_source, utm_medium, utm_campaign, utm_term and utm_content, that you should always use utm_source, utm_medium and utm_campaign, and that missing parameters show up as \"(not set)\" in reports. The sample numbers in the code above are made up for teaching.",
          checked: CHECKED,
          sources: [
            SRC.gaUtm,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'A launch is a few weeks of showing your app to the right people again and again, and learning what makes them sign up.',
            'A simple video formula: a hook in the first 2 to 3 seconds, a 15 to 30 second real screen recording, the result and a call to action.',
            'Post where your customers already are and follow each group\'s rules: many ban promotion, so share something useful.',
            'Use a different tagged link per platform and track weekly: posts, visitors, sign-ups and paying users.',
            'Reply to every early comment, never post customer data without permission, and remember that no result is guaranteed.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-sell-your-app-05-q1',
          prompt: 'What should the first 2–3 seconds of your video do?',
          choices: [
            'Show your logo and app name',
            'Name the problem in the customer\'s own words',
            'List all your features',
          ],
          answer: 1,
          explanation: 'People decide fast whether to keep watching. A problem they recognise makes them stay.',
        },
        {
          id: 'mini-sell-your-app-05-q2',
          prompt: 'A Facebook group bans self-promotion. What should you do?',
          choices: [
            'Post your link anyway',
            'Create a fake account to post it',
            'Follow the rules: share useful help and answer questions, and promote only where allowed',
          ],
          answer: 2,
          explanation: 'Breaking group rules gets you removed and hurts your reputation with the exact people you want.',
        },
        {
          id: 'mini-sell-your-app-05-q3',
          prompt: 'Which number matters most when judging a launch video?',
          choices: [
            'Sign-ups or payments that came from it',
            'Views',
            'Likes',
          ],
          answer: 0,
          explanation: 'Views and likes are easy to get without customers. Sign-ups and payments show real interest.',
        },
        {
          id: 'mini-sell-your-app-05-q4',
          prompt: 'Why use a different link or tag for each platform?',
          choices: [
            'Platforms require unique links',
            'So you can see which platform brings sign-ups',
            'It makes the links shorter',
          ],
          answer: 1,
          explanation: 'Separate links show where your sign-ups come from, so you know where to spend your time.',
        },
        {
          id: "mini-sell-your-app-05-q5",
          audience: { max: "beginner" },
          prompt: "What does a tagged link let you do?",
          choices: [
            "Make the page load faster",
            "See which platform each sign-up came from",
            "Hide the link from other platforms",
            "Post the video without a call to action",
          ],
          answer: 1,
          explanation: "A label such as utm_source=tiktok travels with the visitor, so your records show where each sign-up started.",
        },
        {
          id: "mini-sell-your-app-05-q6",
          audience: { min: "advanced" },
          prompt: "TikTok sent 900 visitors, 18 sign-ups and 2 paying customers. A Facebook group sent 120 visitors, 15 sign-ups and 3 paying customers. A teammate says TikTok is best because it has the most sign-ups. What is the best reply?",
          choices: [
            "Agree, since the most sign-ups means the most growth",
            "Compare rates per visitor and per sign-up, note that the counts are small, and keep collecting data against a rule you set in advance",
            "Stop posting on TikTok immediately",
            "Compare the number of views of each video",
          ],
          answer: 1,
          explanation: "Raw counts hide the quality of each channel, and with so few sign-ups a firm conclusion is premature. Rates plus a pre-set decision rule guide the next step.",
        },
      ],
      task: {
        title: 'Make your first launch video',
        steps: [
          'Run the "Video scripts" prompt and choose the script you find easiest to film.',
          'Record a 20–30 second screen recording of your app doing the key thing.',
          'Edit it on your phone with the hook, on-screen text and call to action.',
          'Post it on one platform with a tagged link to your landing page, and note the date to check sign-ups in a week.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Make a table with the columns Platform, Visitors, Sign-ups and Paying. Fill it with made-up numbers for two platforms and work out the sign-up percentage for each (sign-ups ÷ visitors × 100).",
            "Write your tagged link for one platform and ask the AI to explain each part of it.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write a decision rule before you post: the number of paying customers a channel must produce, at what cost, in how many weeks. Tag every link, build the weekly funnel table per channel, and note the sample size beside each rate.",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      id: 'mini-sell-your-app-p1',
      title: 'A landing page with a clear offer and sign-up',
      summary:
        'Publish a landing page for your app (or an app idea) with a specific customer, a clear offer and price, proof it works, and a working sign-up form.',
      outcome: 'A live page that shows you can turn a built app into an offer people can act on.',
      unlockAfterDay: 5,
      steps: [
        {
          id: 'mini-sell-your-app-p1-s1',
          text: 'Write your one-sentence value statement and your offer line (pricing model and plan) from Days 1 and 2.',
        },
        {
          id: 'mini-sell-your-app-p1-s2',
          text: 'Build the page with a headline, subheadline, one button, a screenshot or short demo video, three benefits, price or plan, and a short FAQ.',
        },
        {
          id: 'mini-sell-your-app-p1-s3',
          text: 'Add a working sign-up form with a consent line and a short privacy note, and test it with your own email.',
        },
        {
          id: 'mini-sell-your-app-p1-s4',
          text: 'Check the page on a phone, then publish it on a host such as Vercel or Netlify, or your builder\'s hosting.',
          link: 'https://vercel.com',
        },
        {
          id: 'mini-sell-your-app-p1-s5',
          text: 'Share it once where your customers are (following the place\'s rules) and note how many people sign up in the first week.',
        },
        {
          id: "mini-sell-your-app-p1-s6",
          audience: { max: "beginner" },
          text: "Scaffold for newcomers: keep the page simple (headline, three benefits, one screenshot, the form) and ask your AI tool to explain each section and the form code in plain words. Read the headline to two people for five seconds each and write down what they say the page is for.",
        },
        {
          id: "mini-sell-your-app-p1-s7",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Store sign-ups in a real database or form service with a consent timestamp, tag your shared links with utm parameters, and record which source each sign-up came from.",
        },
        {
          id: "mini-sell-your-app-p1-s8",
          audience: { min: "advanced" },
          text: "Protect and measure the sign-up: validate and rate-limit on the server, add bot protection and double opt-in, capture utm parameters into the sign-up record, and report your page's loading and layout-shift measurements with one fix you made.",
        },
        {
          id: "mini-sell-your-app-p1-s9",
          audience: { min: "professional" },
          text: "Add a pricing and billing design note: a unit-economics table for light, typical and heavy users with server-enforced quotas, a webhook-driven entitlement design with tests for bad signatures and duplicate events, and which payment channel each platform allows (web, App Store, Google Play). Record how an AI assistant or agent helped and what you corrected.",
        },
      ],
      submission: {
        kind: 'url',
        label: 'Landing page URL',
        placeholder: 'https://your-app.vercel.app',
        hint: 'A live page with a specific headline, a clear offer and price or plan, proof the app works, and a sign-up form that really saves entries.',
      },
      rubric: [
        'The headline names a specific result for a specific customer',
        'The offer and price or plan are clear',
        'There is real proof the app works (screenshot or demo), and no fake testimonials',
        'The sign-up form works and says what people are signing up for',
        'The page reads well on a phone',
      ],
      rubricExtra: [
        {
          audience: { max: "beginner" },
          items: [
            "The learner can explain in plain words what each section of the page and each line of the form does.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          items: [
            "Sign-ups are stored with a consent record and a traffic source from tagged links.",
          ],
        },
        {
          audience: { min: "advanced" },
          items: [
            "The form is protected on the server (validation, rate limiting, bot protection, confirmation) and page speed is measured with one fix.",
          ],
        },
        {
          audience: { min: "professional" },
          items: [
            "The pricing and billing note includes unit economics, enforced quotas, webhook tests and the allowed payment channel per platform, with AI-assisted work recorded.",
          ],
        },
      ],
    },
  ],
  icon: 'storefront',
  updated: '2026-11-13',
};
