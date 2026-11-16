import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * App Monetization and Subscriptions. The running example is "Lista", an invented mobile app that helps sari-sari store owners keep
 * track of customers' utang (credit) and stock. Its numbers are made up for teaching; nothing here is a real business.
 *
 * What was actually run while this course was written: every JavaScript function in the lessons (break-even, access rules, price lines,
 * ad revenue, conversion, churn, MRR, lifetime value) was executed in Node.js and again by the app's own activity validator, and the
 * claim in lesson 7 that two identical offers often look different by chance was computed exactly (a two-sample binomial calculation in
 * Python 3). No store account, payment, advertising or paid API was used; the code that talks to a store or an ad network is shown as
 * short, labelled fragments to read and judge, not as a project that was run. Every statement about a store, an ad network or a
 * subscription service lives in a dated `version` note and was read on its official page on the CHECKED date; no price or fee figure is
 * stated as advice, and any number in a pricing or revenue example is invented and says so.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  appleGuidelines: { label: 'Apple: App Review Guidelines (sections 3.1, 5.1 and 2.5.18)', url: 'https://developer.apple.com/app-store/review/guidelines/' },
  appleIap: { label: 'Apple Developer: In-App Purchase', url: 'https://developer.apple.com/in-app-purchase/' },
  appleSubs: { label: 'App Store Connect Help: Offer auto-renewable subscriptions', url: 'https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions' },
  appleIntro: { label: 'App Store Connect Help: Set up introductory offers for auto-renewable subscriptions', url: 'https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions' },
  appleSmallBiz: { label: 'Apple Developer: App Store Small Business Program', url: 'https://developer.apple.com/app-store/small-business-program/' },
  googleBilling: { label: 'Android Developers: Google Play Billing overview', url: 'https://developer.android.com/google/play/billing' },
  googleIntegrate: { label: 'Android Developers: Integrate the Google Play Billing Library into your app', url: 'https://developer.android.com/google/play/billing/integrate' },
  googleSubs: { label: 'Android Developers: Subscriptions (Google Play Billing)', url: 'https://developer.android.com/google/play/billing/subscriptions' },
  googlePayments: { label: 'Play Console Help: Payments policy', url: 'https://support.google.com/googleplay/android-developer/answer/10281818' },
  googleMonetization: { label: 'Play Console Help: Monetization and Ads policy (Subscriptions)', url: 'https://support.google.com/googleplay/android-developer/answer/9900533' },
  googleFees: { label: 'Play Console Help: Google Play service fees', url: 'https://support.google.com/googleplay/android-developer/answer/112622' },
  googleTesting: { label: 'Play Console Help: Test your app’s purchases with license testers', url: 'https://support.google.com/googleplay/android-developer/answer/6062777' },
  googleDeprecation: { label: 'Android Developers: Play Billing Library deprecation FAQ', url: 'https://developer.android.com/google/play/billing/deprecation-faq' },
  googleReleaseNotes: { label: 'Android Developers: Play Billing Library release notes', url: 'https://developer.android.com/google/play/billing/release-notes' },
  expoIap: { label: 'Expo docs: In-app purchases', url: 'https://docs.expo.dev/guides/in-app-purchases/' },
  rnPurchases: { label: 'react-native-purchases README on GitHub (RevenueCat)', url: 'https://github.com/RevenueCat/react-native-purchases' },
  admobStart: { label: 'AdMob docs: Get started (Android)', url: 'https://developers.google.com/admob/android/quick-start' },
  admobUmp: { label: 'AdMob docs: Privacy and messaging, the User Messaging Platform (Android)', url: 'https://developers.google.com/admob/android/privacy' },
  rnAds: { label: 'react-native-google-mobile-ads README on GitHub', url: 'https://github.com/invertase/react-native-google-mobile-ads' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'app-monetization-01',
    day: 1,
    title: 'Ways an app can earn',
    summary: 'The main ways an app earns money, who pays in each, and a simple question that points you to the one that fits your app.',
    minutes: 22,
    skills: ['earning-models'],
    intro: {
      objectives: [
        'Name the main ways an app earns and say who pays, and when, in each',
        'Choose a starting model for an app by asking how often its users get value',
        'Explain why unlocking features inside an app has to go through the app store’s own payment system',
      ],
      why: 'Your first money model shapes the whole app: what is free, when you ask for payment, and what you must build. Choosing it on purpose, before you ask an AI tool to build a paywall, saves you rebuilding it later.',
    },
    body: [
      {
        type: 'paragraph',
        text: '**Monetization** is a long word for a simple idea: your app gives people something valuable, and in return something comes back to you, usually money. The only real question is *who pays, for what, and when*. A user can pay once, pay again and again, pay for small extras, or never pay at all while somebody else (an advertiser, a company) pays instead. Each choice changes the app. If users pay every month, the app must keep being worth it every month. If advertisers pay, the app needs a lot of people using it often. Throughout this course we follow one invented app, **Lista**: a phone app that helps owners of sari-sari stores (small neighbourhood shops) write down which customers owe them utang (credit) and which items are running low.',
      },
      {
        type: 'paragraph',
        text: 'Why decide this early, when AI can build a paywall in an hour? Because the model is not a coat of paint added at the end. It decides what you give away, which features sit behind the payment, what the store must approve, and which numbers you watch. Ask an AI tool for “a paywall” without choosing, and it will happily generate a monthly subscription for an app whose users would rather pay once. The tool builds what you ask for; choosing what to ask for is your job. (How to build the app itself is covered in Build a Mobile App with AI, and how a payment provider works on the web in Build a SaaS Product with AI. This course is about the money decisions of a mobile app.)',
      },
      { type: 'heading', text: 'Six ways an app earns' },
      {
        type: 'table',
        headers: ['Model', 'Who pays, and when', 'It fits when', 'Watch out for'],
        rows: [
          ['Paid download', 'The user pays once, before installing.', 'The app is a focused tool people already know they want.', 'Many people will not pay before they have tried it, so downloads stay low.'],
          ['Free app, one-time unlock', 'The user pays once, later, to unlock more.', 'Value is steady but not tied to a calendar, such as a tool with a lasting “full version”.', 'Revenue stops when new users stop arriving; you cannot charge for ongoing costs.'],
          ['Subscription', 'The user pays again every week, month or year.', 'The app gives value repeatedly, or has running costs such as servers, AI calls or fresh content.', 'Users must feel the value every period or they cancel.'],
          ['Consumables', 'The user buys small items that get used up (credits, boosts).', 'People spend in small amounts, as in games or an AI feature that costs you per use.', 'Easy to feel pushy; the user must always know what they are buying.'],
          ['Ads', 'An advertiser pays to be shown, and users pay nothing.', 'The app is free, used very often, and has many users.', 'Each user earns little; ads can annoy and need privacy consent.'],
          ['A company pays', 'A business pays for an app its staff or customers use.', 'The app solves a work problem and can be sold with a contract or invoice.', 'Slower sales, and the payment rules differ from consumer apps.'],
        ],
        caption: 'Real apps often mix two models, such as free with a subscription, or free with ads and a way to remove them.',
      },
      {
        type: 'paragraph',
        text: 'One more option deserves a mention: **tips and donations**. Apple’s rules allow an in-app purchase to be used as a tip for the developer, but a tip is a thank-you, not a business. Treat it as a small extra.',
      },
      { type: 'heading', text: 'The question that picks the model' },
      {
        type: 'paragraph',
        text: 'Ask one question about your app: **how often does a user get value, and does it cost you something each time?** A tool opened every day whose data keeps growing (Lista’s customer list) is a natural fit for a subscription, especially if it stores data for the owner and backs it up. An app that does one job once (converting a file) fits a one-time unlock. An app used for a single month a year does not fit a yearly subscription, however much you want recurring income. Match the way you charge to the way the person uses the app, and the price feels fair to them.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'A first pass at choosing a model. It points to a starting place to test, not a final answer.',
        source: `flowchart TD
  A[How does the user get value?] --> B{Used again and again?}
  B -->|Yes| C{Does it cost you each time or each month?}
  B -->|No, one job| D[One-time unlock or paid download]
  C -->|Yes: servers, AI calls, new content| E[Subscription]
  C -->|No| F{Very many users, very often?}
  F -->|Yes| G[Ads, with a way to remove them]
  F -->|No| H[One-time unlock, maybe a subscription later]`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of three ways a neighbourhood sells things. A *bakery* sells you a loaf, and you pay once for that loaf: that is a one-time purchase. A *gym* lets you walk in any day as long as you pay monthly: that is a subscription. A *free community bulletin board* has no charge because shops pay to put up flyers: that is advertising. Your app picks one of these ideas (or mixes two). In Lista, the owner opens the app every day and it keeps their customer records safe, which feels more like the gym than the bakery. A **model** is just the choice you make about who pays and when, and nothing about it needs code.',
      },
      {
        type: 'version',
        text: 'Payment rules depend on what you sell. Apple’s App Review Guidelines (section 3.1.1) say that features or functionality unlocked inside an app, such as subscriptions, premium content or a full-version unlock, must use Apple’s in-app purchase, and that apps may not unlock features with their own mechanisms. Google’s Payments policy says apps selling digital goods or services in the app (subscriptions, unlockable features, ad-free versions) must use Google Play’s billing system, while physical goods and services do not. Both stores list exemptions and special cases, and rules differ by country and change over time, so read the current text before you rely on a rule.',
        checked: CHECKED,
        sources: [DOCS.appleGuidelines, DOCS.googlePayments],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced builders.** Model choice is a unit-economics and risk decision, not a taste. Consumer revenue is usually very uneven: a small share of users generates most of it, so the model should make the paying behaviour easy to observe early. Subscriptions give predictable revenue but add churn management, billing-state handling and a support burden; ads decouple revenue from willingness to pay but depend on volume, an ad network and consent rules; a business customer may pay much more per account but needs sales effort, and Apple’s guidelines allow other payment methods for apps sold directly to organisations for their employees or students (section 3.1.3(c)), so a B2B app can use invoicing while a consumer sibling cannot. Beware platform concentration: nearly all consumer revenue passes through two stores whose fees and rules you do not control. Hybrid designs (free tier, subscription, a small consumable for a costly feature) are common, but each added model multiplies the states you must test.',
      },
      {
        type: 'prompt',
        label: 'Ask AI to compare models for your app (for anyone)',
        text: 'I am building a phone app called Lista for owners of small neighbourhood stores in the Philippines. It stores each customer’s unpaid balance and the shop’s low-stock items, and owners open it every day. Compare these money models for it: paid download, free with one-time unlock, subscription, ads. For each give one reason it could work, one reason it could fail, and one cheap way I could test it with real owners. Do not tell me which is best, and do not invent market statistics.',
      },
      {
        type: 'takeaways',
        items: [
          'Monetization is the choice of who pays, for what, and when; it shapes the app, so decide it before you ask AI to build a paywall.',
          'The main models are paid download, one-time unlock, subscription, consumables, ads, and a company paying; many apps mix two.',
          'Match the way you charge to how often users get value and whether each use costs you something.',
          'Digital features unlocked inside an app generally must go through the store’s own in-app payment system, while physical goods and services do not.',
          'Treat your first model as a hypothesis to test with real people, not a final decision.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-01-scenario-1',
          kind: 'scenario',
          title: 'Which model for which app?',
          prompt: 'Choose the model you would test first for the app described.',
          concept: 'choosing a model',
          situation: 'You have built “Tipid”, a phone app that lets a student turn one scanned page into a clean PDF. People use it a few times a year, usually around exams. Each scan runs on the phone, so it costs you nothing to run. A friend suggests a monthly subscription because “recurring revenue is better”.',
          options: [
            { text: 'Free to try, then a one-time unlock for unlimited scans.', consequence: 'This matches how the app is used: occasional, with no running cost. Students pay once for something they keep, and you do not charge for months in which they never open it.', quality: 'best' },
            { text: 'A monthly subscription, because recurring revenue is more valuable.', consequence: 'Recurring revenue only helps if the user gets recurring value. Many students would subscribe, scan once and cancel, and some would resent paying for months of silence.', quality: 'poor' },
            { text: 'Show full-screen ads between every scan and keep the app free.', consequence: 'Ads need many users who open the app often. With a few uses a year each, the income would be tiny and the ads would annoy the very people you want to recommend the app.', quality: 'poor' },
            { text: 'A paid download with no free trial.', consequence: 'It can work for a simple tool, but people cannot try it first, so fewer will install it. A free start with a one-time unlock lets them see the value before paying.', quality: 'acceptable' },
          ],
          hints: [
            'How often does a student use the app, and does each use cost you anything?',
            'Recurring revenue needs recurring value, or an ongoing cost that you must cover.',
            'Occasional use and no running cost points to paying once for a lasting benefit.',
          ],
          explanation: 'The best model follows the user’s rhythm and your costs. Occasional use with no ongoing cost suits a one-time unlock; a subscription fits repeated value or running costs, and ads need heavy, frequent use by many people.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-01-match-1',
          kind: 'match',
          title: 'Match the app to its first model',
          prompt: 'Match each app idea to the model that fits how it is used and what it costs to run.',
          concept: 'fit between use and model',
          labels: { terms: 'The app', meanings: 'A model worth testing first' },
          pairs: [
            { term: 'A daily habit tracker that stores years of history in the cloud and sends reminders', definition: 'Subscription, because value and costs repeat every month', note: 'Cloud storage and reminders cost you every month and the user benefits every day.' },
            { term: 'A word game with thousands of short rounds and millions of casual players', definition: 'Free with ads, plus a way to remove them', note: 'Heavy, frequent use by many people is what advertising needs.' },
            { term: 'A unit converter that works offline and costs nothing to run', definition: 'One-time unlock for the full version', note: 'No ongoing cost and no ongoing value to bill for.' },
            { term: 'A field-service app that a company buys for its twenty technicians', definition: 'A company pays, with an invoice or contract', note: 'The buyer is a business, which can pay by contract.' },
          ],
          hints: [
            'For each app, ask how often it is used and whether it costs you something every month.',
            'Many casual users and short sessions point to ads; a business buyer points to a contract.',
            'Cloud storage plus reminders means ongoing cost, so it goes with the subscription.',
          ],
          explanation: 'Each pairing follows the same question: how often does the user get value, and what does it cost you to keep delivering it? Repeating value and costs favour subscriptions, volume favours ads, and a one-off tool favours a one-time unlock.',
        },
      },
    ],
    quiz: [
      {
        id: 'app-monetization-01-q1',
        prompt: 'Lista is opened every day, stores each owner’s records in the cloud and backs them up. Which starting model best matches that?',
        choices: [
          'A subscription, because the value and the running costs both repeat every month',
          'A paid download, because owners will happily pay a lot once to try something they have not used',
          'Ads between every screen, because owners spend long hours in the app and ads then earn a lot from each person',
          'A one-time unlock only, because stored data never costs anything once it has been saved',
        ],
        answer: 0,
        explanation: 'Daily use and ongoing storage costs repeat, so charging repeatedly is fair. The others ignore either the cost of keeping data safe or how few people pay before trying.',
      },
      {
        id: 'app-monetization-01-q2',
        prompt: 'Which of these should generally go through the app store’s in-app purchase system?',
        choices: [
          'A delivery app charging for the groceries a driver brings to the customer’s door',
          'A subscription that unlocks extra features inside the app',
          'A ride-hailing app charging for a trip in a real car',
          'A payment to a friend through the app',
        ],
        answer: 1,
        explanation: 'Digital features unlocked inside the app use the store’s payment system. Physical goods and services consumed outside the app, and payments between people, are handled differently.',
      },
      {
        id: 'app-monetization-01-q3',
        prompt: 'Why ask “how often does the user get value?” before choosing a model?',
        choices: [
          'Because stores only allow subscriptions for apps opened every day',
          'Because the answer tells you which model to copy from the most successful app in your category',
          'Because charging in step with when value arrives feels fair to users and matches your costs',
          'Because ads are the only model that depends on how often the app is used',
        ],
        answer: 2,
        explanation: 'People accept paying when the charge matches the benefit they get. Charging monthly for something used twice a year, or giving away something that costs you each month, is a mismatch.',
      },
      {
        id: 'app-monetization-01-q4',
        prompt: 'An AI tool suggests “add banner ads, it is the easiest way to earn”. For an app with 300 users who open it twice a month, what is the sensible reaction?',
        choices: [
          'Add the ads, since any income is better than none and users rarely notice or mind them at all',
          'Add the ads and a subscription together, so that both earn from the same few people at once',
          'Ignore it, because ads are not allowed in apps that also have paying users or a free plan',
          'Do the sums first: ads earn little per user, so a small, rarely used app earns almost nothing',
        ],
        answer: 3,
        explanation: 'Advertising income depends on volume and frequency. With few users and little use, it brings in almost nothing while costing goodwill, so test the numbers before adding it.',
      },
      {
        id: 'app-monetization-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does “monetization” mean?',
        choices: [
          'Writing the code that makes an app run faster on older phones and use less battery',
          'Adding sound effects and animation so the app feels more fun to use for people',
          'Choosing who pays for your app, for what, and when',
        ],
        answer: 2,
        explanation: 'Monetization is the plan for how an app earns: who pays, for what, and at which moment. It is a decision about people and value before it is a decision about code.',
      },
      {
        id: 'app-monetization-01-q6',
        audience: { min: 'advanced' },
        prompt: 'Your consumer app is a hit with schools, which want to pay by invoice for 200 students. Which statement is the most accurate way to reason about it?',
        choices: [
          'Apple forbids any payment outside in-app purchase, so the school must buy two hundred separate subscriptions from the store one by one',
          'Because the school is the payer, the whole app becomes exempt from store payment rules, including the version that parents buy for their children',
          'Apple lets organisations buying for staff or students pay another way, while consumer sales still use in-app purchase; keep the flows apart',
        ],
        answer: 2,
        explanation: 'The enterprise exception (3.1.3(c)) covers organisations buying for their people; consumer, single-user or family sales still use in-app purchase. Treating the two audiences as separate flows keeps you compliant. Check the current text, since rules change.',
      },
    ],
    task: {
      title: 'Pick a first model for your own app',
      steps: [
        'Write one sentence about your app (or Lista if you have none): who uses it, how often, and what it costs you each month to keep it running.',
        'Use the prompt from this lesson with your own app and read the AI’s answer. Cross out any statistic it gives that you cannot trace to a real source.',
        'Walk through the decision diagram and write down the model it points to and one reason you might choose a different one.',
        'Write the cheapest test you could do this week: for example, ask five real users whether they would pay and how.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain subscription, one-time purchase and ads as if I run a small shop, using a neighbourhood example for each.” Then name which of the three you pay for yourself on your phone today.'] },
      { audience: { min: 'advanced' }, steps: ['Sketch a two-model design (for example free with a subscription plus a consumable). List every account state the app would have to handle, and mark which of those states you would need a test for.'] },
    ],
  },
  {
    id: 'app-monetization-02',
    day: 2,
    title: 'Pricing: how to choose a price',
    summary: 'A method for choosing a price: find the cost floor, the value ceiling and the market around you, then test it with real people.',
    minutes: 24,
    skills: ['pricing-method'],
    intro: {
      objectives: [
        'Work out the lowest price an app can charge and still pay its own costs',
        'Use value, alternatives and comparable apps to place a price between the floor and the ceiling',
        'Explain why you should not accept a price an AI tool suggests without evidence',
      ],
      why: 'A price chosen by guess is usually too low, because new builders fear asking, or too high, because they never asked a user. A short method gives you a defensible first price and tells you what to test next.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A price does two jobs at once. It pays your costs, and it tells people what the app is worth. Too low, and you earn too little to keep the app alive, and some people assume a very cheap app is poor quality. Too high, and the people who would have loved it never try it. Most first-time builders pick a number that “feels okay”, or ask an AI tool, which will gladly name a price. But an AI tool has never met your customers. It can only describe what apps like yours often charge in general, and it can state that with great confidence even when it is wrong. So treat any AI-suggested price as a *starting guess to check*, then use a method.',
      },
      { type: 'heading', text: 'Three anchors: floor, ceiling and neighbours' },
      {
        type: 'table',
        headers: ['Anchor', 'The question it answers', 'How you find it'],
        rows: [
          ['Floor (your costs)', 'What is the lowest price that does not lose money?', 'Add up monthly costs and divide by the customers you can realistically expect, allowing for the store’s share.'],
          ['Ceiling (the value)', 'What is the result worth to the customer, and what do they pay now to solve the problem?', 'Ask users what the problem costs them today in time or money, and what they use instead.'],
          ['Neighbours (the market)', 'What do similar apps and the usual alternatives charge, and how are their plans arranged?', 'Read the store listings of three or four close alternatives and note plan names, lengths and what each plan includes.'],
        ],
        caption: 'Your price lives between the floor and the ceiling. The neighbours tell you what people already expect.',
      },
      {
        type: 'paragraph',
        text: '**The cost floor** is arithmetic, and arithmetic is where a small program helps. The app stores keep a share of each payment, so you do not receive the full price. Call that share `storeCut` (a fraction, so 0.2 means a fifth). Each paying customer then brings `price × (1 − storeCut)`. If your monthly costs are `monthlyCosts`, the number of paying customers you need just to break even is `monthlyCosts ÷ (price × (1 − storeCut))`, rounded **up**, because you cannot have half a customer. All the numbers below are invented for practice: do not read the cut or the prices as real ones. The real share depends on the store and on programs you qualify for, which Lesson 5 covers in words.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Break-even customers (pretend numbers)',
        code: `function breakEvenCustomers(monthlyCosts, price, storeCut) {
  const youKeep = price * (1 - storeCut);
  return Math.ceil(monthlyCosts / youKeep);
}

// Pretend: costs of 3000 a month, a price of 100, and a store share of 0.2.
console.log(breakEvenCustomers(3000, 100, 0.2));
// You keep 80 from each customer, so 3000 / 80 = 37.5, rounded up:
// 38`,
      },
      {
        type: 'paragraph',
        text: 'Read it line by line. `youKeep` is what stays with you after the store takes its share (100 × 0.8 = 80). Dividing the costs by that amount says how many customers you need (37.5), and `Math.ceil` rounds up to 38, because 37 customers would leave you short. Now you can ask a useful question: *is 38 paying customers believable?* If your app might reach 200 users and only a small fraction pay, 38 is a stretch, and you must either lower your costs or charge more.',
      },
      { type: 'heading', text: 'Finding the ceiling by asking' },
      {
        type: 'paragraph',
        text: 'To place a price, talk to five to ten people who match your target user, and ask four plain questions about the app: at what price would it be **so cheap you doubt its quality**, **a bargain**, **getting expensive but you might still buy**, and **too expensive to consider**. The range between “a bargain” and “getting expensive” is a sensible zone. Then ask what they pay today for the workaround. For Lista, the real competitor may be a notebook and a pencil, which costs almost nothing. That tells you the price must be justified by clear extra value, such as never losing a record or sending a polite reminder. Notice how an honest ceiling can sit below your floor: that is a signal to cut costs or find a better customer, not to pretend.',
      },
      { type: 'heading', text: 'Plans, free limits and different countries' },
      {
        type: 'paragraph',
        text: 'Most apps offer two or three plans. Keep the differences easy to explain, and tie the free limit to the thing that grows with the user’s success (Lista: free for up to a set number of customers on the list), not to a feature that makes the app feel broken. A free tier so generous that nobody upgrades earns nothing; one so tight that people leave before seeing the value earns nothing either. Prices also differ by country. The same number in dollars is a different weight for a shop owner in Naga than for a consultant in Chicago, so set prices per country based on what local people earn and pay, not by converting one price mechanically. The stores let you do this: they offer a fixed set of price points and let you choose the countries and regions where a product is sold.',
      },
      {
        type: 'version',
        text: 'Apple’s In-App Purchase page says prices are chosen from a list of price points (it names 900 of them) and that you can set storefront availability, and that Apple handles tax in many regions. Apple’s subscription durations are one week, one month, two, three or six months, or one year. Check the page before relying on the details, since the number of price points and regions changes.',
        checked: CHECKED,
        sources: [DOCS.appleIap, DOCS.appleSubs],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine you sell homemade siomai from a cart. First you work out what each piece costs you to make (your **floor**: you cannot sell below it for long). Then you ask yourself what a hungry person would happily pay for a good snack (the **ceiling**). Then you look at the cart down the street and see what they charge (the **neighbours**). You choose a price in between and watch what happens. An app is the same, except the app store also keeps a slice of every sale, so your “cost” includes that slice. The small program above is only a calculator for that: it takes your monthly costs, your price and the store’s slice, and tells you how many buyers you need. `Math.ceil` just means “round up to the next whole number”.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced builders.** Price against a *value metric* that grows as the customer succeeds (seats, records, locations), because a flat price leaves the heaviest users underpaying and the lightest overpaying. Remember that the break-even line is a floor, not a target: a sound price also leaves room for acquisition cost, support time, refunds and the churn you expect, so compute payback on acquisition as well as break-even. Store price points and per-country availability constrain you, and lower-priced countries invite cheap resale of access, so decide how you will handle regional differences before launching. Price changes after launch affect existing subscribers and need the stores’ own consent and notice flows, so grandfathering is a design decision, not an afterthought. Segment willingness to pay rather than relying on an average. Have an AI tool build the sensitivity table (price against conversion and churn) if you like, but replace its assumptions with measured ones as soon as you have any.',
      },
      {
        type: 'takeaways',
        items: [
          'A price pays your costs and signals value; pick it with a method, not a feeling, and treat any AI-suggested price as a guess to check.',
          'Three anchors place a price: the cost floor, the value ceiling and what the neighbours charge.',
          'Break-even customers = monthly costs ÷ (price × (1 − store share)), rounded up; the store’s share is part of your cost.',
          'Ask real users what is a bargain, expensive and too expensive, and what they pay today for the workaround.',
          'Tie free limits to what grows with success, and set prices country by country, not by one mechanical conversion.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-02-code-challenge-1',
          kind: 'code-challenge',
          title: 'How many customers to break even?',
          prompt: 'Write `breakEvenCustomers(monthlyCosts, price, storeCut)`. The store keeps `storeCut` (a fraction like 0.2) of every payment. Return the smallest whole number of paying customers whose payments, after the store’s share, cover `monthlyCosts`.',
          concept: 'break-even arithmetic',
          language: 'javascript',
          starter: `function breakEvenCustomers(monthlyCosts, price, storeCut) {
  // how many paying customers cover the costs?
}`,
          tests: {
            kind: 'function',
            fn: 'breakEvenCustomers',
            cases: [
              { args: [3000, 100, 0.2], expected: 38, label: 'rounds 37.5 up' },
              { args: [800, 100, 0], expected: 8, label: 'exact division, no share' },
              { args: [1000, 50, 0.1], expected: 23, label: '1000 / 45 rounds up to 23' },
              { args: [0, 100, 0.2], expected: 0, label: 'no costs, nobody needed' },
            ],
          },
          solution: `function breakEvenCustomers(monthlyCosts, price, storeCut) {
  const youKeep = price * (1 - storeCut);
  return Math.ceil(monthlyCosts / youKeep);
}`,
          hints: [
            'First work out how much you keep from one payment after the store takes its share.',
            'Divide the monthly costs by that amount, then round up with Math.ceil.',
            'return Math.ceil(monthlyCosts / (price * (1 - storeCut))).',
          ],
          explanation: 'Each customer brings price × (1 − storeCut). Dividing the costs by that gives the customers needed, and rounding up matters because a fraction of a customer cannot pay anything.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-02-scenario-1',
          kind: 'scenario',
          title: 'The AI named a price',
          prompt: 'Choose the best next step.',
          concept: 'checking a suggested price',
          situation: 'You ask an AI assistant what to charge for Lista. It answers confidently: “Apps like yours charge between two figures per month, and the average is the middle one.” It gives no sources. You have not talked to any store owner yet, and your monthly costs are small.',
          options: [
            { text: 'Treat the figures as a guess, ask five store owners what they pay for their notebook-and-pencil workaround and what would feel like a bargain, and test a price near what you learn.', consequence: 'You replace a confident claim with evidence from real customers. The AI’s range becomes one input among several, and you know what to test next.', quality: 'best' },
            { text: 'Use the average the AI gave, since it is based on lots of apps.', consequence: 'The AI cannot name where the figure came from, and “apps like yours” may be nothing like your shop owners. You might be off by a lot and never find out.', quality: 'poor' },
            { text: 'Choose the lowest figure, so nobody can say the app is too expensive.', consequence: 'A very low price can signal poor quality and may not even cover your costs once the store’s share is taken. You skipped the work of finding out what people value.', quality: 'poor' },
            { text: 'Ask the AI to explain how it got the range, then check two of the comparable apps’ store listings yourself.', consequence: 'Better than trusting it, and the listings give you real neighbours. But you still have not asked a single customer, so you know the market and not the value.', quality: 'acceptable' },
          ],
          hints: [
            'Where did the AI’s figure come from, and has it ever met a store owner?',
            'Which choice puts evidence from real customers into the decision?',
            'Treat the AI’s range as a guess, then ask owners about their workaround and a bargain price.',
          ],
          explanation: 'An AI’s price is a claim without a source. Talking to the people who would pay, and looking at real neighbours, turns the guess into evidence you can defend.',
        },
      },
    ],
    quiz: [
      {
        id: 'app-monetization-02-q1',
        prompt: 'With costs of 2000 a month, a price of 100 and a store share of 0.2 (all pretend), how many paying customers do you need to break even?',
        choices: ['20', '25', '24', '26'],
        answer: 1,
        explanation: 'You keep 100 × 0.8 = 80 from each customer, and 2000 ÷ 80 = 25. Forgetting the store’s share gives 20, and 24 or 26 come from rounding errors.',
      },
      {
        id: 'app-monetization-02-q2',
        prompt: 'In the three-anchor method, what does the “ceiling” represent?',
        choices: [
          'The most the app stores allow you to charge for a product in any country, which they set themselves',
          'What the result is worth to the customer and what they already pay for their workaround',
          'The highest price any competitor currently charges, which you should copy or beat',
          'The price at which you would earn the most money no matter what customers think',
        ],
        answer: 1,
        explanation: 'The ceiling comes from the customer’s side: the value of the result and the cost of what they use now. The floor is your costs, and the neighbours show what the market expects.',
      },
      {
        id: 'app-monetization-02-q3',
        prompt: 'Why set prices country by country instead of converting one price?',
        choices: [
          'Because the stores refuse to show the same number in two different currencies to one customer',
          'Because converting between currencies is forbidden by both stores, as exchange rates keep changing from day to day',
          'Because what people earn and will pay differs by place, so one converted price suits some and not others',
          'Because each country’s store must approve every price in advance, which can take several weeks',
        ],
        answer: 2,
        explanation: 'The same amount weighs differently in different places, so local prices follow local incomes and alternatives. The stores offer price points and regional availability to make that possible.',
      },
      {
        id: 'app-monetization-02-q4',
        prompt: 'Lista’s free plan allows 5 customers on the list and the paid plan allows more. A user says it feels “broken”. Which change fits the lesson best?',
        choices: [
          'Remove the limit entirely so that nobody ever feels blocked, however many customers they add',
          'Lock the whole app after the first day so that users have to pay straight away to continue',
          'Hide the limit until the user reaches it, so that it arrives as a surprise at the worst moment',
          'Raise the limit so a typical shop feels the value first, and tie it to what grows with success',
        ],
        answer: 3,
        explanation: 'A free limit should be tied to what grows with the user’s success, and generous enough to show the value. Removing it earns nothing, and surprises or sudden locks feel unfair.',
      },
      {
        id: 'app-monetization-02-q5',
        audience: { max: 'beginner' },
        prompt: 'Why does the break-even calculation include the app store’s share?',
        choices: [
          'Because the store decides how many customers you are allowed to have in each country',
          'Because the store adds its share on top of your price automatically for each customer',
          'Because the store keeps a slice of each payment, so you get less than the price',
        ],
        answer: 2,
        explanation: 'You do not receive the whole price: the store keeps a share, so what you keep from each customer is smaller than the price shown.',
      },
      {
        id: 'app-monetization-02-q6',
        audience: { min: 'advanced' },
        prompt: 'Your break-even is 40 customers and you have 45 paying ones. A teammate says the price is “proven right”. What is the best response?',
        choices: [
          'Agree: covering your costs is exactly what it means for a price to be proven correct for the app',
          'Raise the price immediately, because anything above break-even is leaving money behind on the table',
          'Lower the price until the number of customers doubles, because volume always beats margin for apps',
          'Check payback, churn and support time too, since break-even ignores them, and test other prices',
        ],
        answer: 3,
        explanation: 'Break-even is a floor: it ignores acquisition, support, refunds and churn, and says nothing about whether another price would earn more. Measure those and test, rather than declaring victory.',
      },
    ],
    task: {
      title: 'Compute your floor and find your ceiling',
      steps: [
        'List your app’s monthly costs honestly: hosting, AI calls, accounts, your own time if you want to count it. Write one number.',
        'Pick a pretend price and a pretend store share, and calculate the break-even customers with the function from this lesson (or ask an AI tool to run it and show you its working).',
        'Find three similar apps in a store and write down their plan names, lengths and what each plan includes.',
        'Write the four price questions and ask at least two real people who match your user. Note what they say about their current workaround.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain break-even to me with a street-food example, then check my arithmetic step by step.” Make sure you can say in your own words why we round up.'] },
      { audience: { min: 'advanced' }, steps: ['Build a small table of price against assumed conversion and monthly churn, with acquisition cost included. Mark each assumption as measured or guessed, and say which one you would measure first.'] },
    ],
  },
  {
    id: 'app-monetization-03',
    day: 3,
    title: 'Subscriptions and one-time purchases',
    summary: 'The kinds of purchase the stores offer, how entitlements keep your app simple, and the life a subscription goes through.',
    minutes: 25,
    skills: ['product-types'],
    intro: {
      objectives: [
        'Tell consumable, non-consumable, subscription and non-renewing purchases apart, in both stores’ words',
        'Design the app around one “is the user entitled?” check instead of product names',
        'Say who keeps access in each stage of a subscription’s life, and spot code that gets it wrong',
      ],
      why: 'AI tools will generate “a subscription” or “a purchase” without telling you which kind you picked, and a small mix-up here means paying customers locked out or non-paying ones let in. Knowing the kinds and the states lets you read what was generated and fix it.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'When you create something to sell in an app store, you must choose its **type**. The choice is not cosmetic: each type is treated differently by the store, by the user’s phone (can it be restored on a new phone?) and by your code (when does access end?). It is also hard to change after launch, because people already hold the old kind. So choose it deliberately, and do not let the first thing an AI tool generates decide it for you.',
      },
      { type: 'heading', text: 'Four kinds of purchase, in both stores’ words' },
      {
        type: 'table',
        headers: ['What the user gets', 'Apple calls it', 'Google calls it', 'A Lista example'],
        rows: [
          ['Something used up, bought again later', 'Consumable', 'One-time product, consumed after purchase', 'A pack of 50 reminder messages'],
          ['Something bought once and kept', 'Non-consumable', 'One-time product, acknowledged and never consumed', 'A lasting unlock for exporting records'],
          ['Access that renews until the user cancels', 'Auto-renewable subscription, inside a subscription group', 'Subscription, with base plans and offers', 'Lista Pro, monthly or yearly'],
          ['Access for a fixed time that does not renew itself', 'Non-renewing subscription', 'Prepaid plan, which the user tops up', 'A three-month season pass'],
        ],
        caption: 'A consumable is used up; a non-consumable is kept and can be restored on a new phone; a subscription renews until cancelled.',
      },
      {
        type: 'version',
        text: 'Apple lists four In-App Purchase types: consumable, non-consumable, auto-renewable subscription and non-renewing subscription, and requires a restore mechanism for restorable purchases (App Review Guidelines 3.1.1). Auto-renewable subscriptions in App Store Connect sit in a subscription group, where a customer holds only one active subscription at a time. Google Play Billing offers one-time products and subscriptions; subscriptions are configured with base plans and offers, one-time purchases must be acknowledged (consumables are consumed so they can be bought again), and prepaid plans do not renew automatically, so the user tops up. Product options and names change, so check the console of each store.',
        checked: CHECKED,
        sources: [DOCS.appleIap, DOCS.appleSubs, DOCS.googleIntegrate, DOCS.googleSubs],
      },
      { type: 'heading', text: 'Ask “is the user entitled?”, not “what did they buy?”' },
      {
        type: 'paragraph',
        text: 'Google’s documentation uses a word worth borrowing: an **entitlement**. When someone buys a product, they become *entitled* to something in your app. For a one-time product the entitlement is permanent; for a subscription it lasts while the subscription is active. A clean app has one question for the rest of its code: *does this person have the “pro” entitlement right now?* Monthly, yearly and a launch-week special can all unlock the same entitlement, and the screens that lock or unlock features never need to know which product was bought. When you change your plans next year, only the purchase screen changes. This is exactly the structure subscription-management services such as RevenueCat expose to your app.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Asking about access, not product names (fragment, not run)',
        code: `// Fragment: the shape used by a subscription service's SDK.
const info = await Purchases.getCustomerInfo();
const isPro = info.entitlements.active['pro'] !== undefined;
// The rest of the app only ever asks: isPro?`,
      },
      { type: 'heading', text: 'A subscription has a life' },
      {
        type: 'paragraph',
        text: 'A subscription is not a switch that is on or off. It moves through states, and your app has to give the right access in each one. Google’s documentation names them, and the idea is the same on Apple’s side.',
      },
      {
        type: 'table',
        headers: ['State', 'What happened', 'Access?'],
        rows: [
          ['Active', 'Paid and in good standing', 'Yes'],
          ['Cancelled', 'The user turned off renewal but the paid period has not ended', 'Yes, until the period ends'],
          ['In grace period', 'A payment failed and the store is still retrying', 'Yes, while it retries'],
          ['On hold', 'A payment failed and the store is still retrying, but access is suspended', 'No'],
          ['Paused', 'The user paused the subscription', 'No, until they resume'],
          ['Expired', 'It ended; the user has churned', 'No'],
        ],
        caption: 'Fairness cuts both ways: someone who cancelled has paid for the rest of the period, and someone whose card failed is not locked out at once.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The main paths. “Churned” means the user has left for good.',
        source: `flowchart LR
  A[Subscribes] --> B(Active)
  B -->|user cancels| C[Cancelled: access until period ends]
  C -->|period ends| F(Expired)
  B -->|payment fails| D[Grace period: access continues]
  D -->|card fixed| B
  D -->|still failing| E[On hold: no access]
  E -->|card fixed| B
  E -->|never fixed| F`,
      },
      {
        type: 'paragraph',
        text: '**Offers and free trials.** Both stores let you attach an offer to a subscription. Apple’s introductory offers come in three kinds (a free trial, pay as you go at a discounted price, or pay up front at a discounted price), and each customer can use only one introductory offer per subscription group. Google works with base plans and offers, and a setting lets you restrict a user to one free trial per app. Whatever you configure, the paywall must say it plainly; that is Lesson 4.',
      },
      {
        type: 'warning',
        text: 'A subscription must give ongoing value. Apple’s guidelines say the period must last at least seven days and be available on all the user’s devices, and Google’s policy says one-time benefits belong in one-time products, not disguised as subscriptions. If you move an app from a one-time unlock to a subscription, people who already bought the unlock must keep the main functionality they paid for.',
      },
      {
        type: 'version',
        text: 'Apple App Review Guideline 3.1.2(a): subscriptions must provide ongoing value, last at least seven days and be available on all of the user’s devices; people who bought a one-time unlock keep their primary functionality if the app moves to a subscription. Google Play’s Monetization and Ads policy says subscriptions must deliver recurring value and one-time benefits belong in in-app products. Apple’s introductory offers (free trial, pay as you go, pay up front) are limited to one per subscription group for each customer; Google’s Play Console has a setting to allow one free trial per app. Google’s Play Billing documentation lists the subscription states (active, cancelled, in grace period, on hold, paused, expired) used above.',
        checked: CHECKED,
        sources: [DOCS.appleGuidelines, DOCS.appleIntro, DOCS.googleMonetization, DOCS.googleIntegrate, DOCS.googleSubs],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Compare three ways of getting things in everyday life. A *bag of rice* is used up and you buy another: that is a **consumable**. A *bicycle* is bought once and you keep it: that is a **non-consumable**. A *gym membership* costs you again every month until you cancel, and while it is paid you may walk in: that is a **subscription**. An **entitlement** is just “what you are allowed to use right now”. If you cancel the gym but have paid until the end of the month, you are still allowed in until then, and that is why the table says “Cancelled” still has access. A **state** is a stage in a subscription’s life: active, cancelled, on hold and so on. Your app’s job is to give access that matches the stage.',
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'When an AI tool builds your purchase screen, search the generated code for every place it compares a product name or id. Each one is a spot that breaks when you add a plan. Ask the tool to replace them with a single entitlement check and show you the diff.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced builders.** The device is a cache; the source of truth for entitlement should be a server or a subscription service that verifies purchases with each store. Both stores can tell your backend about changes as they happen: Apple through App Store Server Notifications to an HTTPS endpoint you configure, Google through real-time developer notifications delivered with Cloud Pub/Sub. Treat each as at-least-once, make processing idempotent, and reconcile on app start in case a notification was missed. Decide how you handle refunds and revocations, family sharing (Apple’s Family Sharing applies to non-consumables and auto-renewable subscriptions), the same person on both platforms, and the gap between a store confirming a purchase and your server knowing about it. Common generated bugs: granting access on the client after the purchase sheet closes, ignoring cancelled-but-paid and grace states, or caching the entitlement indefinitely. The billing-webhook mechanics are covered in Build a SaaS Product with AI.',
      },
      {
        type: 'takeaways',
        items: [
          'The stores offer consumables, non-consumables, auto-renewable subscriptions and non-renewing or prepaid plans; pick the one that matches how value is delivered.',
          'Build the app around one question, “does this person have the entitlement?”, so plans can change without touching feature code.',
          'A subscription has states: a cancelled user keeps access until the paid period ends, and a failed payment passes through a grace period or hold before access is lost.',
          'Subscriptions must give ongoing value; one-time benefits belong in one-time purchases, and people who bought an unlock keep what they paid for.',
          'The phone is a cache: the truth about access should be verified with the store, on a server or through a subscription service.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-03-predict-output-1',
          kind: 'predict-output',
          title: 'Who gets in?',
          prompt: 'The clock reads 50. Predict the four lines the program prints. Pay attention to the two people who have cancelled.',
          concept: 'access by subscription state',
          language: 'javascript',
          code: `function hasAccess(sub, now) {
  if (sub.state === 'active' || sub.state === 'grace') return true;
  if (sub.state === 'cancelled') return now < sub.expiresAt;
  return false;
}

const subs = [
  { name: 'Ana', state: 'active', expiresAt: 100 },
  { name: 'Ben', state: 'cancelled', expiresAt: 100 },
  { name: 'Cora', state: 'cancelled', expiresAt: 20 },
  { name: 'Dan', state: 'hold', expiresAt: 100 },
];
for (const sub of subs) {
  console.log(sub.name + ': ' + hasAccess(sub, 50));
}`,
          choices: [
            'Ana: true\nBen: false\nCora: false\nDan: false',
            'Ana: true\nBen: true\nCora: false\nDan: false',
            'Ana: true\nBen: true\nCora: true\nDan: false',
            'Ana: true\nBen: true\nCora: false\nDan: true',
          ],
          wrongNotes: {
            'Ana: true\nBen: false\nCora: false\nDan: false': 'Ben has cancelled, but his paid period runs until 100 and the clock is at 50, so he still has access.',
            'Ana: true\nBen: true\nCora: true\nDan: false': 'Cora’s paid period ended at 20, before the clock reading of 50, so she no longer has access.',
            'Ana: true\nBen: true\nCora: false\nDan: true': 'Dan is on hold, and the function returns false for every state it does not list.',
          },
          hints: [
            'Take the people one at a time and find which line of hasAccess applies to their state.',
            'A cancelled person gets access only while now is still less than expiresAt.',
            'Ben: 50 < 100 is true. Cora: 50 < 20 is false. Dan reaches the final return false.',
          ],
          explanation: 'Active and grace give access; cancelled gives access only until the paid period ends (Ben yes, Cora no); anything else, such as on hold, gets none.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-03-fix-bug-1',
          kind: 'fix-bug',
          title: 'The cancelled customer locked out early',
          prompt: 'Customers who cancel are complaining that they lose access at once, although they paid until the end of the month. Tap the line that is wrong, then choose the fix.',
          concept: 'cancelled but still paid',
          language: 'javascript',
          code: `function hasAccess(sub, now) {
  if (sub.state === 'active' || sub.state === 'grace') return true;
  if (sub.state === 'cancelled') return false;
  return false;
}`,
          bugLine: 3,
          fixes: [
            { line: '  if (sub.state === \'cancelled\') return now < sub.expiresAt;', correct: true, why: 'A cancelled subscriber keeps access until the paid period ends, so access is true only while the clock is before expiresAt.' },
            { line: '  if (sub.state === \'cancelled\') return true;', correct: false, why: 'This keeps access forever, including for someone whose paid period ended months ago.' },
            { line: '  if (sub.state === \'cancelled\') return sub.expiresAt;', correct: false, why: 'This returns a number, not true or false, so the answer would be wrong or confusing to the rest of the app.' },
            { line: '  if (sub.state === \'cancelled\') return now > sub.expiresAt;', correct: false, why: 'The comparison is the wrong way round: it would give access only after the period has ended.' },
          ],
          tests: {
            kind: 'function',
            fn: 'hasAccess',
            cases: [
              { args: [{ state: 'cancelled', expiresAt: 100 }, 50], expected: true, label: 'cancelled but paid until later' },
              { args: [{ state: 'cancelled', expiresAt: 20 }, 50], expected: false, label: 'cancelled and already expired' },
              { args: [{ state: 'active', expiresAt: 100 }, 50], expected: true, label: 'active' },
              { args: [{ state: 'hold', expiresAt: 100 }, 50], expected: false, label: 'on hold' },
            ],
          },
          hints: [
            'Which state is the complaint about, and what had those customers already paid for?',
            'Access for a cancelled customer should depend on the date, not be a fixed yes or no.',
            'Return a comparison between now and sub.expiresAt: access while now is still before it.',
          ],
          explanation: 'Cancelling stops the next renewal; it does not undo the period the customer already paid for. The state alone is not enough, so the rule must also compare the clock with the end of the paid period.',
        },
      },
    ],
    quiz: [
      {
        id: 'app-monetization-03-q1',
        prompt: 'In Apple’s terms, which purchase type is bought once, kept permanently, and must be restorable on a new phone?',
        choices: ['Consumable', 'Auto-renewable subscription', 'Non-renewing subscription', 'Non-consumable'],
        answer: 3,
        explanation: 'A non-consumable is kept permanently and restorable. A consumable is used up, and subscriptions give access for a period.',
      },
      {
        id: 'app-monetization-03-q2',
        prompt: 'Lista Pro is sold monthly and yearly, and both should unlock the same features. What should the feature code check?',
        choices: [
          'Whether the “pro” entitlement is active, whichever product unlocked it',
          'Whether the product id equals the monthly plan’s id, plus a second id for yearly',
          'Whether a local flag saved when the purchase screen closed is true, since that is fastest',
          'Whether the user opened the paywall within the last week and did not dismiss it',
        ],
        answer: 0,
        explanation: 'One entitlement check keeps feature code independent of plans. Product-id checks break when plans change, and a local flag or paywall behaviour says nothing about whether payment is current.',
      },
      {
        id: 'app-monetization-03-q3',
        prompt: 'A user cancelled yesterday, and their paid period ends in ten days. Should the app still give them access?',
        choices: [
          'No, because cancelling ends access at once and the money is refunded',
          'No, but only until they re-enter their payment details to confirm',
          'Yes, until the paid period ends',
          'Yes, forever, because they have already paid once',
        ],
        answer: 2,
        explanation: 'Cancelling stops renewal, and the user keeps what they already paid for until the period ends. After that they have churned.',
      },
      {
        id: 'app-monetization-03-q4',
        prompt: 'What do Apple’s guidelines say about the subscription period and what it delivers?',
        choices: [
          'One day or more, delivering a single one-off benefit that is unlocked once and kept',
          'Seven days or more, delivering a one-time benefit that is unlocked at the start only',
          'Seven days or more, available only on the device on which the purchase was made',
          'Seven days or more, with ongoing value, available on all of the user’s devices',
        ],
        answer: 3,
        explanation: 'Guideline 3.1.2(a) asks for ongoing value, at least seven days, available across the user’s devices. A one-off benefit belongs in a one-time purchase.',
      },
      {
        id: 'app-monetization-03-q5',
        audience: { max: 'beginner' },
        prompt: 'Which everyday example is closest to a subscription?',
        choices: [
          'Paying a gym every month so you may walk in while it is paid',
          'Buying a bicycle that you keep and ride for many years afterwards',
          'Buying a bag of rice that is eaten and then bought again later',
        ],
        answer: 0,
        explanation: 'A subscription renews and gives access while it is paid, like a gym membership. The bicycle is kept (non-consumable) and the rice is used up (consumable).',
      },
      {
        id: 'app-monetization-03-q6',
        audience: { min: 'advanced' },
        prompt: 'A user’s card fails and the store moves them to on hold, yet your app still shows Pro because it cached “pro” for 30 days. What is the most robust fix?',
        choices: [
          'Shorten the cache to one hour, so that mistakes expire faster and the gap becomes small',
          'Feed a server from store notifications, refresh on app start, and treat on hold as no access',
          'Ask users to restart the app after their payment fails so that it reads the purchase again',
          'Remove the cache entirely and ask the store on every single screen the user views in the app',
        ],
        answer: 1,
        explanation: 'The phone is a cache, so the truth should come from verified store events and be refreshed at sensible moments. A shorter cache narrows the gap without closing it, and asking on every screen is wasteful and fragile offline.',
      },
    ],
    task: {
      title: 'Choose the product type and map the states',
      steps: [
        'For your app (or Lista), write which product type you would create first, and which Apple and Google names it has in the table.',
        'Name your single entitlement and list every plan that would unlock it.',
        'Copy the state table and write, for each state, exactly what your app would show: full access, access with a warning, or the free version.',
        'Ask an AI tool to review a hasAccess function for your app and tell you which states it forgot. Check its answer against the table.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain subscription states with a gym example and tell me what should happen to a member whose card failed.” Rewrite its answer in two sentences of your own.'] },
      { audience: { min: 'advanced' }, steps: ['Write the event table for your backend: each store notification you would handle, the state change it causes, and the test that proves handling the same event twice changes nothing.'] },
    ],
  },
  {
    id: 'app-monetization-04',
    day: 4,
    title: 'A paywall that respects users',
    summary: 'What a paywall must say, the tricks that get apps rejected or reviewed badly, and a fair design you can ask AI to build.',
    minutes: 25,
    skills: ['paywall-design'],
    intro: {
      objectives: [
        'List what a paywall has to tell people before they pay, and where a fair one puts it',
        'Spot misleading paywall patterns in generated code or a design',
        'Place a paywall at a moment when the user has seen the value, without holding their data hostage',
      ],
      why: 'The paywall is where people decide whether to trust you with their money. Both stores review it, and AI tools often copy the pushy patterns of famous apps, so knowing what is fair protects your users and your approval.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **paywall** is the screen that asks a person to pay, usually to unlock more of the app. It is small, but it carries a lot: it is where a free user decides whether to become a customer, and where a customer who feels tricked becomes a refund, a one-star review, or a cancelled subscription. Many apps copy the same pushy design: a tiny grey close button, a cheerful “Start your free trial” with the price in small print, a plan already selected. AI tools, trained on what they have seen, can generate that design when you ask for “a high-converting paywall”. A respectful paywall earns the payment honestly, and it is also the safest design for passing store review.',
      },
      { type: 'heading', text: 'What a fair paywall tells people' },
      {
        type: 'list',
        items: [
          '**What they get**, in plain words, so the price buys something specific. Apple’s guidelines ask you to describe what the price gets before asking someone to subscribe.',
          '**The real price and how often it is charged**, as the store reports it for the user’s country, never a number you typed. The amount actually charged is the headline; a monthly equivalent for a yearly plan can appear as a smaller extra line.',
          '**That it renews automatically until cancelled**, said in the same place as the price.',
          '**Free-trial facts** if there is a trial: how long it lasts, what it costs afterwards, when the first charge happens, and how to cancel before it.',
          '**How to manage or cancel**, for example by pointing to the store’s subscription settings.',
          '**A way to restore a purchase**, because Apple requires a restore mechanism for restorable purchases.',
          '**Links to your terms and privacy policy**, since the privacy policy must be easy to reach inside the app.',
          '**A clear way to close it** and carry on with the free app.',
        ],
      },
      {
        type: 'table',
        headers: ['Pattern', 'Why it causes trouble', 'The fair version'],
        rows: [
          ['A yearly plan shown mainly as a small monthly price', 'People think they will be charged monthly. Google’s policy lists this as a violation.', 'Show the amount charged for the year in the headline; the monthly equivalent can be a smaller line.'],
          ['“Free trial” with no word on what happens after', 'The user is billed without understanding it. Both stores require the conversion to paid to be explained before enrolment.', 'State the trial length, the price afterwards, when it is charged, and how to cancel.'],
          ['A plan pre-selected and a hard-to-find close button', 'Purchase flows should not lead people to subscribe by accident (Google) or trick them into subscribing (Apple).', 'Make the choice explicit and give a normal-sized close control.'],
          ['A countdown that resets every time the screen opens', 'The pressure is invented, which is dishonest, and users notice it.', 'Offer a real, dated promotion or none at all.'],
          ['Blocking the app on first launch before any value', 'The user has no reason to pay yet, and may delete the app.', 'Show it after the first moment of value, such as reaching a limit.'],
          ['Locking or deleting the user’s own data when the plan ends', 'It holds their records hostage and turns a lapsed customer into an angry one.', 'Hide or block the paid features, keep all their data, and show it again if they return.'],
        ],
        caption: 'Most of these are not matters of taste: the stores’ own policies name several of them.',
      },
      {
        type: 'version',
        text: 'Apple’s App Review Guidelines (3.1.2(c)) ask you to describe what the price buys before asking someone to subscribe and to meet the requirements of the Apple Developer Program License Agreement, require a restore mechanism for restorable purchases (3.1.1), a privacy policy that is easy to reach in the app (5.1.1(i)), and prohibit tricking people into subscribing. Google Play’s Monetization and Ads policy requires disclosing the offer terms, cost, billing frequency and auto-renewal, explaining how a free trial converts to a paid subscription and how to cancel, and lists as violations monthly plans that do not say they auto-renew, yearly plans that prominently show a monthly price, and naming a plan “Free Trial” when it renews. Store policies change and differ by country; read the current text.',
        checked: CHECKED,
        sources: [DOCS.appleGuidelines, DOCS.googleMonetization],
      },
      { type: 'heading', text: 'When to show it, and what must stay free' },
      {
        type: 'paragraph',
        text: 'Show the paywall **after the user has felt the value**: when they reach a limit, try a locked feature, or finish something they wanted. For Lista, a good moment is when an owner adds the sixth customer and sees the free limit. Never make a person do an unrelated task to unlock something they paid for, and do not tie access to handing over data they do not want to give: Apple’s guidelines rule out extra tasks such as posting on social media, and say paid functionality may not depend on granting access to data. Finally, **lock without deleting**. When a plan ends, hide and block what is paid for, but keep everything the user created. That one rule turns “I cancelled and lost everything” into “I cancelled and can come back whenever I like”.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'A fair journey. The free app stays usable at every step, and nothing is deleted if the user says no.',
        source: `flowchart TD
  A[User reaches a limit or tries a paid feature] --> B[Paywall: benefits, price, renewal, close button]
  B -->|Closes it| C(Carries on with the free app)
  B -->|Picks a plan| D[Store payment sheet]
  D -->|Cancels or fails| C
  D -->|Pays| E[Entitlement refreshed]
  E --> F(Paid features unlocked)`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Picture a carinderia (small eatery) with a menu board. A fair board shows each dish with the price you will pay, and tells you if the rice is extra. A tricky board shows a tiny “₱10” in large letters for something that really costs ₱120 for the whole tray, and hides the rest. The first earns regulars; the second earns arguments. A paywall is your menu board. **Auto-renew** means the charge repeats by itself until the person cancels, so you must say so next to the price. **Restore purchases** is a button for someone who already paid but got a new phone, so they can get back what they bought without paying again.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced builders.** Treat the paywall as an experiment surface with guardrails. Optimising only for conversion rewards the pushy patterns above, so measure what they cost later: refunds, early cancellations, support tickets, store ratings and retention at 30 and 90 days, not just taps on Subscribe. Keep the legal text and prices out of the design layer: pull prices and trial terms from the store product at runtime so a change in the console cannot leave the screen lying. Log paywall views, plan selections, purchase outcomes and restores as analytics events with consistent names, and send the same events from the Android and iOS builds. Some countries have their own consumer rules on automatic renewals and cancellation; these differ and change, so check local advice rather than relying on a store’s checklist alone. Review generated paywall code for hard-coded prices, missing restore, and success handling that unlocks before the entitlement is verified.',
      },
      {
        type: 'takeaways',
        items: [
          'A fair paywall says what you get, the real price and how often it is charged, that it renews, trial terms, how to cancel, and offers restore and a clear way to close.',
          'The amount actually charged is the headline; a monthly equivalent for a yearly plan can only be a smaller extra line.',
          'Show the paywall after the user has felt value, and never require unrelated tasks or data to unlock what they paid for.',
          'Lock without deleting: when a plan ends, hide paid features but keep everything the user made.',
          'Prices and trial terms should come from the store at runtime, not from text you typed.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'The yearly plan that looks monthly',
          prompt: 'This function builds the line under each plan’s button. A yearly plan costing 1200 shows “100 per month”, so people think they pay monthly. Tap the line that misleads, then choose the fix that shows the amount actually charged and says it renews.',
          concept: 'honest price line',
          language: 'javascript',
          code: `function priceLine(plan) {
  return Math.round(plan.price / plan.months) + ' per month';
}`,
          bugLine: 2,
          fixes: [
            { line: '  return plan.price + \' per \' + plan.period + \', renews until you cancel\';', correct: true, why: 'It shows the amount actually charged and the period it covers, and says the plan renews until cancelled.' },
            { line: '  return Math.round(plan.price / plan.months) + \' per month, billed per \' + plan.period;', correct: false, why: 'It still leads with the monthly equivalent and never says the plan renews, so the headline remains misleading.' },
            { line: '  return plan.price + \' per month\';', correct: false, why: 'This is false for a yearly plan: it states the whole yearly price as if it were charged monthly.' },
            { line: '  return \'Only \' + Math.round(plan.price / plan.months) + \' a month!\';', correct: false, why: 'It makes the cheapest-looking number the headline and hides the real charge, which is the pattern to avoid.' },
          ],
          tests: {
            kind: 'function',
            fn: 'priceLine',
            cases: [
              { args: [{ price: 1200, months: 12, period: 'year' }], expected: '1200 per year, renews until you cancel', label: 'yearly plan' },
              { args: [{ price: 150, months: 1, period: 'month' }], expected: '150 per month, renews until you cancel', label: 'monthly plan' },
            ],
          },
          hints: [
            'What does the user actually get charged, and how often?',
            'The headline should be the real amount and its period, plus a clear sign that it renews.',
            'Return plan.price, then the word per, plan.period, and the words renews until you cancel.',
          ],
          explanation: 'The line must tell the truth about the charge: the amount, how often, and that it renews. A monthly equivalent can be a smaller extra, never the headline for a yearly plan.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-04-scenario-1',
          kind: 'scenario',
          title: 'Fix the generated paywall',
          prompt: 'Choose the best next move.',
          concept: 'fair paywall design',
          situation: 'You asked an AI tool for “a high-converting paywall”. It produced a full-screen page: the yearly plan is pre-selected with a big “Start free trial” button, the price is in small grey text, the close button is a tiny faint “x” in the corner, and nothing says the plan renews. There is no restore button.',
          options: [
            { text: 'Ask the tool to rewrite it: show the amount charged and its period, say it renews and when the trial ends, add a normal-sized close and a restore button, and take the prices from the store product.', consequence: 'You keep the tool’s speed and fix what the store policies care about. The screen is honest, passes review more easily, and users who subscribe understand what they bought.', quality: 'best' },
            { text: 'Keep it as it is: it is what top apps do, and conversion matters most.', consequence: 'Copying a pushy pattern risks rejection, refunds and angry reviews, and the stores’ own policies name several of these behaviours as violations.', quality: 'poor' },
            { text: 'Keep the design but add a long terms paragraph at the very bottom of the screen in tiny type.', consequence: 'The terms exist, but a user cannot easily see them, so it does not fix the disclosure problem. Disclosure must be where the price is.', quality: 'poor' },
            { text: 'Remove the free trial and the pre-selected plan, but leave the tiny close button and the missing restore button for now.', consequence: 'Good first steps, yet leaving no restore and a faint close button still fails the fair design list.', quality: 'acceptable' },
          ],
          hints: [
            'Go through the fair-paywall list and note which items this screen is missing.',
            'Disclosure has to be next to the price, and the way out has to be easy to see.',
            'Ask for honest price and renewal text, a normal close button, a restore button and store-provided prices.',
          ],
          explanation: 'A generated paywall is a draft to be checked against the list: honest price and renewal text where the price is, a visible way out, restore, and store-supplied prices. Fixing it by prompt is quick once you know what to ask for.',
        },
      },
    ],
    quiz: [
      {
        id: 'app-monetization-04-q1',
        prompt: 'Which headline is fairest for a yearly plan whose price is 1200 and which is billed once a year?',
        choices: [
          '“1200 per year, renews until you cancel”, with “about 100 a month” in smaller type',
          '“Only 100 a month!” in large letters, with the yearly charge in small grey text under the button',
          '“Try it free!” in large letters, with every price shown only on the screen after the tap',
          '“Best value” beside a picture of the plan, with the price hidden until the store’s payment sheet',
        ],
        answer: 0,
        explanation: 'The charge, its period and the renewal belong in the headline; the monthly equivalent can be a smaller extra. The others hide or shrink the real charge.',
      },
      {
        id: 'app-monetization-04-q2',
        prompt: 'Before enrolling someone in a free trial, which set of facts must be shown?',
        choices: [
          'How many other people have started a trial this week, and how many of them are still using it',
          'The app’s version number, the size of the download and the date on which the trial was added',
          'Only the length of the trial, because the store will show the price later in its own sheet',
          'The trial’s length, the price after it, when it turns into a paid plan, and how to cancel',
        ],
        answer: 3,
        explanation: 'Google’s policy lists these facts, and Apple’s guidelines ask for clear descriptions too. People must know when they will be charged and how to avoid it.',
      },
      {
        id: 'app-monetization-04-q3',
        prompt: 'When is a good moment to show Lista’s paywall?',
        choices: [
          'As soon as the app is opened for the very first time, before it shows the owner any content at all',
          'Every time the user opens the app, as a reminder that a paid plan exists and is waiting for them',
          'When the user adds the sixth customer and hits the free limit, after using the app',
          'Only in a pop-up that appears while the user is in the middle of typing a customer’s name',
        ],
        answer: 2,
        explanation: 'People are ready to pay after they have felt the value, and a limit is a natural moment. Showing it before any value, or interrupting typing, annoys people.',
      },
      {
        id: 'app-monetization-04-q4',
        prompt: 'A customer’s plan ends. What should the app do with the customer records they entered while paying?',
        choices: [
          'Keep every record, hide or block the paid features, and show them again if the customer returns',
          'Delete the records above the free limit after seven days, to encourage them to subscribe again soon',
          'Keep the records but make them unreadable until the customer pays again for the next period',
          'Export them all to the customer’s email address and then remove them from the app for good',
        ],
        answer: 0,
        explanation: 'Lock without deleting. People should never lose what they made because a plan ended; they can come back and find it all.',
      },
      {
        id: 'app-monetization-04-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does “restore purchases” do?',
        choices: [
          'It refunds the money to the person who bought the plan, once they have asked the store for it',
          'It lets someone who already paid get back what they bought, for example on a new phone',
          'It resets the app to the way it looked on the first day, removing the changes they made',
        ],
        answer: 1,
        explanation: 'Restore gives a returning buyer what they already paid for. Apple requires a restore mechanism for purchases that can be restored.',
      },
      {
        id: 'app-monetization-04-q6',
        audience: { min: 'advanced' },
        prompt: 'Paywall variant B, with a pre-selected trial and a faint close button, converts a third better than A, but refunds, early cancellations and one-star reviews also rise. What should you do?',
        choices: [
          'Ship B, because conversion is the metric the test was designed to move and it clearly improved',
          'Ship B, then send a retention email to win back the people who cancel early after the trial',
          'Ship A and stop testing paywalls altogether, since any variation of the screen hurts the users',
          'Weigh refunds, retention and ratings too, and keep the fair design unless B also wins there',
        ],
        answer: 3,
        explanation: 'Conversion alone rewards pushiness. Include refunds, retention and ratings in the decision, and remember that B’s patterns may also break store policies.',
      },
    ],
    task: {
      title: 'Write the fair paywall for your app',
      steps: [
        'Sketch your paywall on paper: the benefits list, the plan buttons, the price lines, the renewal sentence, the restore button, the close button, and links to terms and privacy.',
        'Write the exact price line for each plan and, if you have a trial, the exact trial sentence.',
        'Decide the one moment in your app where the paywall first appears and what stays free if the user says no.',
        'Paste your sketch description into an AI tool and ask: “Which of these items would a store reviewer or a user say is missing or misleading?” Fix what it finds that you agree with.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to turn your sketch into a plain description of the screen, line by line, and check that every item from the fair-paywall list is there. Tick them off one by one.'] },
      { audience: { min: 'advanced' }, steps: ['Write the event names and fields you would log for the paywall (view, plan selected, purchase, restore, close) and the follow-up metrics, beyond conversion, that would tell you a variant is hurting trust.'] },
    ],
  },
  {
    id: 'app-monetization-05',
    day: 5,
    title: 'How the app stores handle payments',
    summary: 'Why digital purchases go through Apple and Google, the path one purchase takes, and how to build and test it without trusting the phone.',
    minutes: 27,
    skills: ['store-payments'],
    intro: {
      objectives: [
        'Explain which sales must use the stores’ payment systems and which do not',
        'Follow one purchase from the tap to the unlocked feature, and say where it is verified',
        'Choose between a subscription service and your own server, and test purchases without being charged',
      ],
      why: 'In a website you build a checkout and a card form yourself. In a mobile app the store is the checkout, and AI-generated code often tries the web way, which gets apps rejected or lets people unlock features for free. Knowing the real path lets you read and correct what an AI tool gives you.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Think of a shopping mall. You rent a stall (your app), but the mall runs the cash registers: shoppers pay at the mall’s counter, the mall gives you a slip saying “this person paid”, and the mall keeps a share. App stores work like that for **digital** things sold inside an app, such as a subscription, premium features or an ad-free version. You do not collect card numbers. Apple’s App Store and Google Play handle the payment, the receipts, the refunds, the taxes in many countries, and the subscription settings screen where users cancel. In exchange they keep a share of each sale and impose rules. This lesson explains the rules in words, the path one purchase takes, and how to build it safely.',
      },
      { type: 'heading', text: 'The rules, in words' },
      {
        type: 'list',
        items: [
          '**Digital unlocks use the store’s system.** Unlocking features, content or a full version inside the app goes through Apple’s in-app purchase and Google Play’s billing system. Your own license keys, QR codes or card forms for the same thing are not allowed.',
          '**Physical goods and services consumed outside the app are different.** Groceries delivered to a door, a taxi ride, a payment to a friend, or a bill payment are paid by other means, and the stores’ billing is not used for them.',
          '**Some cases have their own rules.** Apple has exceptions for apps sold to organisations, for apps that only give access to content bought elsewhere (“reader” apps), and for some one-to-one real-time services; Google lists similar exemptions, such as certain one-to-one services and apps where nothing can be bought inside.',
          '**Pointing users to a cheaper web checkout is restricted.** In general, an app may not push people to another payment method from inside the app. Some countries and special programs allow it under conditions, and the rules have been changing, partly because of court decisions. They are the kind of rule you must read at the time you launch.',
          '**The store keeps a share, and the share depends on you.** Reduced rates exist for smaller developers and for subscriptions, and they differ between stores and programs. We give no figures here because they change; use the real figure in your `storeCut` calculation from Lesson 2.',
        ],
      },
      {
        type: 'version',
        text: 'Apple’s App Review Guidelines (3.1.1, 3.1.1(a) and 3.1.3) require in-app purchase for features unlocked in the app, forbid license keys and QR codes for that, list exceptions (reader apps, apps sold to organisations, some real-time person-to-person services, goods and services consumed outside the app) and restrict links to other purchase methods except under an entitlement or on the US storefront. Google’s Payments policy requires Google Play’s billing system for digital goods and services sold in the app, lists exemptions (physical goods and services, certain one-to-one services, consumption-only apps), restricts directing users to other payment methods, and describes alternative billing programs in the EEA, India, South Korea and the US, with conditions. Both change often and differ by country: read the current text.',
        checked: CHECKED,
        sources: [DOCS.appleGuidelines, DOCS.googlePayments],
      },
      {
        type: 'version',
        text: 'Apple’s App Store Small Business Program gives a reduced commission to developers whose proceeds stay under a threshold; you enrol as the Account Holder after accepting the Paid Apps agreement, and once you pass the threshold the standard rate applies to later sales. Apple’s page also mentions different treatment of subscriptions after their first year, and its wording is not completely clear, so read the agreement. Google’s fee page describes a reduced fee for auto-renewing subscriptions, different rates for other transactions, and a reduced rate on a first amount of yearly earnings. Figures are not given here on purpose: check the current pages when you plan.',
        checked: CHECKED,
        sources: [DOCS.appleSmallBiz, DOCS.googleFees],
      },
      { type: 'heading', text: 'The path of one purchase' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The user never types a card number into your app. Your server (or a subscription service) is where the purchase is verified.',
        source: `sequenceDiagram
  participant U as User
  participant A as Your app
  participant S as App store
  participant V as Your server or service
  A->>S: ask for products and prices for this country
  S-->>A: names, prices, offers
  U->>A: taps a plan
  A->>S: start the purchase
  S-->>U: store payment sheet
  U->>S: confirms
  S-->>A: purchase record (a token)
  A->>V: send the record
  V->>S: verify it
  S-->>V: valid, and its state
  V-->>A: entitlement granted
  A->>S: acknowledge the purchase`,
      },
      {
        type: 'paragraph',
        text: 'Two steps are easy to skip and expensive to skip. **Verify** means your server (or a subscription service) asks the store “is this purchase real, and what is its state?” instead of believing a message from the phone, because a phone can be tampered with. And **acknowledge**: on Google Play you must tell the store you delivered the purchase; if your app does not process the purchase, Google refunds it after three days and the entitlement is revoked. Alongside that, give people a **restore** button, because someone with a new phone should get what they paid for without paying again.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The mistake an AI tool often makes (fragment, not run)',
        code: `// Fragment: trusts the phone. Anyone who edits this value gets Pro for free.
async function onPurchaseDone() {
  await AsyncStorage.setItem('isPro', 'true');
  setIsPro(true);
}

// Better: ask for the verified entitlement and show what it says.
async function refreshAccess() {
  const info = await Purchases.getCustomerInfo();
  setIsPro(info.entitlements.active['pro'] !== undefined);
}`,
      },
      { type: 'heading', text: 'Do it yourself, or use a subscription service?' },
      {
        type: 'paragraph',
        text: 'You can talk to the stores directly, which means two libraries, verifying every purchase with two different services, handling each store’s notifications, and keeping the states of Lesson 3 in sync across iPhone and Android. Or you can use a **subscription-management service**, such as RevenueCat, which wraps both stores, verifies purchases for you and gives your app the entitlement from Lesson 3 as a ready answer. The trade-off: less work and fewer ways to get verification wrong, in exchange for another company in your payment path and its own pricing, which you should compare before choosing. In an Expo app, native purchase libraries do not run in Expo Go; you need a development build. Expo’s own guide names react-native-purchases (RevenueCat) and expo-iap as options.',
      },
      {
        type: 'version',
        text: 'Expo’s In-App Purchases guide says purchase libraries need custom native code that Expo Go does not support, so use a development build, and recommends react-native-purchases (a RevenueCat wrapper around Google Play Billing and StoreKit) and expo-iap. The react-native-purchases README says to use a development build to fully test purchases, and that in Expo Go the SDK runs in a “Preview API Mode” that replaces native calls with JavaScript mocks, so real purchases need a development build. It requires React Native 0.80 or later at the time of checking. Google’s Play Billing Library is at 9.1.0 (released 2026-06-18) in its release notes; its deprecation FAQ says new apps and updates must use a supported version, with the stated deadline for version 8 in August 2027 and for version 9 in August 2028. Your library or service usually chooses the version for you.',
        checked: CHECKED,
        sources: [DOCS.expoIap, DOCS.rnPurchases, DOCS.googleReleaseNotes, DOCS.googleDeprecation],
      },
      { type: 'heading', text: 'Test without spending money' },
      {
        type: 'paragraph',
        text: 'Never test a payment flow with your own credit card. Apple offers StoreKit testing in Xcode, a sandbox environment and TestFlight, and sandbox purchases are free and do not carry over to production. On Google Play you add **license testers** in the Play Console: they can buy products and subscriptions as test purchases without being charged, on a test or internal track, and the products must be published before they can be tested. Then check the states from Lesson 3: a successful purchase, a cancel, a failed payment, a restore on a clean install, and what the app shows with no network. Subscriptions must also be set up and submitted for review; on Apple, your first subscription and its group go in with a new app version.',
      },
      {
        type: 'version',
        text: 'Apple’s In-App Purchase page lists Xcode StoreKit testing, the sandbox environment and TestFlight as ways to test, and says sandbox purchases are free and do not carry over to production. Google’s Play Console help says licensed testers can buy products and subscriptions as test purchases without being charged, that you should publish to a test or production track (the internal test track is suggested) and publish your products before testing. App Store Connect’s subscription page says your first auto-renewable subscription and first subscription group must be submitted with a new app version.',
        checked: CHECKED,
        sources: [DOCS.appleIap, DOCS.googleTesting, DOCS.appleSubs],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Remember the mall. When a shopper pays at the mall’s cashier, the cashier gives you a slip. A careful shopkeeper does not just believe a customer who says “I paid, trust me”: they look at the slip and may phone the cashier. That is **verification**. A slip that is lost when the customer buys a new phone is why we offer **restore**. A **token** is the long code on the slip that proves a payment happened. A **development build** is a special version of your app made on your computer that includes the payment code; the quick preview app called Expo Go cannot include it. And **sandbox** and **license testers** are the stores’ way of letting you pretend to pay so you can test without spending real money.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced builders.** Decide where the entitlement lives and who can write it. With a service, the app reads a customer record the service keeps current from store notifications, and your backend can read the same record through the service’s server API or webhooks, so your own database mirrors it rather than competing with it. If you verify yourself, budget for Apple’s server API and notifications and Google’s Developer API and real-time notifications, an idempotent event handler, a nightly reconciliation job, and the repair paths for missed events. Think about identity: purchases belong to a store account, not to your user, so decide how an anonymous app user, a signed-in user and a second device map onto them, and what happens when one store account is used by two of your users. Plan for refunds and revocations, for price changes, and for Play Billing Library upgrades (a version policy applies to new apps and updates). Do not hard-code product ids you may want to change: fetch the current offering.',
      },
      {
        type: 'takeaways',
        items: [
          'Digital features unlocked in an app use the store’s payment system; physical goods and services consumed outside the app are handled differently.',
          'The store keeps a share that depends on programs and subscription terms; read the current figure and use it in your arithmetic.',
          'One purchase goes: show products, store payment sheet, purchase record, verify, grant the entitlement, acknowledge, and always offer restore.',
          'Never trust a flag saved on the phone; verify with the store through your server or a subscription service.',
          'Native purchase libraries need a development build in Expo, and testing uses sandbox, StoreKit testing or license testers, never your own card.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-05-arrange-1',
          kind: 'arrange',
          title: 'Put one purchase in order',
          prompt: 'Arrange the steps of one subscription purchase, from showing the plans to telling the store you delivered it.',
          concept: 'purchase flow',
          language: 'text',
          solution: [
            'The app asks the store for the products and prices for this country',
            'The user taps a plan and confirms in the store’s payment sheet',
            'The store charges the user and hands the app a purchase record',
            'Your server or service verifies the record with the store',
            'The entitlement is granted and the app refreshes it',
            'The app acknowledges the purchase to the store',
          ],
          reasons: [
            'You cannot show a plan until you know what the store offers here.',
            'The user decides and confirms on the store’s own sheet, not in your app.',
            'Payment happens at the store, which returns a record of it.',
            'Verifying comes before granting anything, because the phone could lie.',
            'Only a verified purchase unlocks the feature.',
            'Acknowledging tells the store you delivered; on Google Play, skipping it leads to a refund after three days.',
          ],
          hints: [
            'Which step has to come first so the user has something to tap?',
            'Verify before you unlock, and unlock before you acknowledge.',
            'Products, then payment sheet, then record, then verify, then entitlement, then acknowledge.',
          ],
          explanation: 'The order protects everyone: the store shows real prices, the user pays at the store, your side verifies before unlocking, and acknowledging closes the loop so the purchase is not refunded.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-05-scenario-1',
          kind: 'scenario',
          title: 'The “pay on our website” button',
          prompt: 'Choose the best response.',
          concept: 'store payment rules',
          situation: 'Your AI tool built Lista with a Pro screen. To “save the store’s share”, it added a button inside the iPhone and Android apps that opens your website, where owners pay with a card, and the app then unlocks Pro when the website says so. There is no in-app purchase at all.',
          options: [
            { text: 'Replace it with the store’s in-app purchase for the Pro unlock, check the current store rules before offering any link to other payment methods, and keep a website checkout only where the rules allow it.', consequence: 'You follow how digital unlocks are meant to be sold, and you avoid rejection and removal. You also learn the rules for your countries before using a web checkout.', quality: 'best' },
            { text: 'Ship it and see if the stores notice, since the share is large.', consequence: 'Both stores restrict unlocking features through other payment methods inside the app and can reject or remove an app that does it. You risk your whole app for the saving.', quality: 'poor' },
            { text: 'Keep the web checkout but hide the button from reviewers by showing it only after a few days.', consequence: 'Hiding behaviour from reviewers is a policy violation of its own and makes any resulting removal worse.', quality: 'poor' },
            { text: 'Use in-app purchase on iPhone but keep the website button on Android.', consequence: 'Half-right: Google’s payments policy also requires its billing system for digital unlocks, so the Android app has the same problem.', quality: 'acceptable' },
          ],
          hints: [
            'What do both stores say about unlocking digital features inside the app?',
            'A saving is not worth the risk of rejection; the real question is what is allowed where you sell.',
            'Use the store’s in-app purchase, and read the current rules before offering any other payment link.',
          ],
          explanation: 'Digital features unlocked inside an app generally have to use the store’s payment system on both platforms. Where an alternative is permitted, it comes with conditions, so read the current policy rather than working around it.',
        },
      },
    ],
    quiz: [
      {
        id: 'app-monetization-05-q1',
        prompt: 'After the store returns a purchase record, what should happen before the app unlocks the feature?',
        choices: [
          'The app saves “isPro = true” on the phone straight away, because the store already confirmed it and the phone is the quickest place to remember it',
          'The user is asked to enter their card number again in the app, so the app can double-check the payment on its own',
          'The app waits for a push notification from the store, which can take days to arrive',
          'The purchase is verified with the store by your server or a subscription service',
        ],
        answer: 3,
        explanation: 'Verification protects against tampered phones and fake receipts. Saving a flag on the phone is exactly the mistake that lets anyone unlock Pro for free.',
      },
      {
        id: 'app-monetization-05-q2',
        prompt: 'On Google Play, what happens to a purchase your app never acknowledges?',
        choices: [
          'It is refunded after three days and the entitlement is revoked',
          'It stays pending forever, with the money held by the store until you act',
          'It is converted into a free trial for the user, whose payment is returned later',
          'Nothing at all, because acknowledging only makes your sales reports look tidier',
        ],
        answer: 0,
        explanation: 'Google refunds purchases that are not processed and acknowledged within three days, which is why delivery and acknowledgement must be reliable.',
      },
      {
        id: 'app-monetization-05-q3',
        prompt: 'Which statement about the store’s share of each sale is the most accurate?',
        choices: [
          'Reduced rates exist for smaller developers and for subscriptions, so look up the current figure',
          'It is the same fixed figure for every developer in every country, and it never changes over time',
          'It is zero for any app that has fewer than a thousand users or a thousand sales in total so far',
          'It is paid by the customer on top of the price, so it has no effect on what you receive',
        ],
        answer: 0,
        explanation: 'Both stores have programs and subscription terms that lower the share in some cases, and they change. Use the current figure in your break-even and plan arithmetic.',
      },
      {
        id: 'app-monetization-05-q4',
        prompt: 'You added a purchase library to your Expo app, and in Expo Go the purchase screen shows fake products. Why?',
        choices: [
          'Your store account is not approved yet, so the store can only return sample products for the moment',
          'Expo Go lacks the native purchase code, so the library mocks it; use a development build',
          'The store has blocked your device for testing, so it returns fake products until you appeal',
          'Your plan prices are set too high, so the store switches on a demonstration mode for them',
        ],
        answer: 1,
        explanation: 'Expo Go cannot include custom native modules; the README describes a preview mode with JavaScript mocks. A development build includes the real payment code.',
      },
      {
        id: 'app-monetization-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does “verifying” a purchase mean?',
        choices: [
          'Your server asks the store whether the payment is real',
          'The user types their name twice so that the app is sure it was spelled correctly',
          'The app counts how many times the Buy button was tapped before the payment went through',
        ],
        answer: 0,
        explanation: 'Verifying means asking the store directly. A phone can be tampered with, so its word alone is not enough.',
      },
      {
        id: 'app-monetization-05-q6',
        audience: { min: 'advanced' },
        prompt: 'You support iPhone and Android with one small team. Which choice is best argued?',
        choices: [
          'Skip verification until revenue is large, because early customers are unlikely to tamper with anything',
          'Verify every purchase yourself from day one, since a subscription service always ends up costing more than building',
          'Use a service and delete your own user records, so the service is the only place customer data lives',
          'Use a service for one entitlement on both stores and mirror it in your own database via webhooks',
        ],
        answer: 3,
        explanation: 'A small team gains most from a ready entitlement and verification, while keeping its own mirror avoids lock-in. Skipping verification is a security gap, and deleting your records leaves you blind and dependent.',
      },
    ],
    task: {
      title: 'Draw the purchase path of your app',
      steps: [
        'Redraw the sequence diagram with your own entitlement name and your own plan names.',
        'Write which part verifies purchases for you: your own server, or a subscription service. List two reasons for your choice.',
        'List the store accounts, agreements and products you must set up before you can sell, in the order you would do them. Check each store’s current help pages for the steps.',
        'Write five test cases for your purchase flow in words: success, cancel, failed payment, restore on a clean install, and no network.',
      ],
      minutes: 18,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain verification and restore with a shopkeeper and a cashier, then quiz me with three questions.” Answer them aloud before reading its answers.'] },
      { audience: { min: 'advanced' }, steps: ['Write the reconciliation job in outline: what it compares, how often it runs, what it fixes automatically and what it reports to a human. State how a missed store notification would be noticed.'] },
    ],
  },
  {
    id: 'app-monetization-06',
    day: 6,
    title: 'Ads, and when they are worth it',
    summary: 'How ads work in an app, the arithmetic of ad revenue, when ads fit, and the consent and tracking rules that come with them.',
    minutes: 24,
    skills: ['ads-and-consent'],
    intro: {
      objectives: [
        'Name the common ad formats and say which suit which kind of app',
        'Estimate ad revenue from users, ad views and the earnings per thousand views',
        'Explain the consent and tracking rules, and why test ads matter',
      ],
      why: 'Ads look like the easiest way to earn, and an AI tool will add them in a minute. But for most small apps they earn very little and cost user trust, and mistakes with consent and tracking can get an app rejected, so the choice deserves arithmetic first.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'With **ads**, your users pay nothing and an advertiser pays instead. An *ad network* (Google AdMob is a well-known one) sits between you and the advertisers: you add its software to your app, it fills ad slots with advertisements, and it pays you for the ad views and sometimes clicks. It sounds ideal for a free app. The catch is scale: each ad view earns a tiny amount, so ads only matter when **very many people use the app very often**. A game with a million casual players can live on ads. A neighbourhood business tool with a few hundred owners cannot, and the ads would only get in the way of people doing real work. So we do the arithmetic first.',
      },
      { type: 'heading', text: 'The formats' },
      {
        type: 'list',
        items: [
          '**Banner:** a rectangle that sits in part of the screen and can refresh by itself. Easy, low earnings, always visible.',
          '**Interstitial:** a full-screen ad shown at a natural pause, such as after finishing a level. Earns more per view, annoys more if badly placed.',
          '**Rewarded:** the user chooses to watch an ad to earn something, such as an extra try. The user opts in, so it is usually the least resented.',
          '**App open:** an ad shown when the app opens or returns to the foreground.',
          '**Native:** an ad you style to look like the rest of your content.',
        ],
      },
      {
        type: 'version',
        text: 'AdMob’s getting-started guide describes the formats as banner, interstitial, rewarded, rewarded interstitial, app open and native. You register the app in AdMob to get an app ID, which must be set in the app (a missing app ID crashes the app), and it says to use the sample app ID while testing. The react-native-google-mobile-ads README says its module does not run in Expo Go, so you add it with a config plugin and create a development build, and to use test ad units until you have verified the integration.',
        checked: CHECKED,
        sources: [DOCS.admobStart, DOCS.rnAds],
      },
      { type: 'heading', text: 'The arithmetic of ad revenue' },
      {
        type: 'paragraph',
        text: 'Ad networks speak in a unit called **eCPM**: the earnings per thousand ad views (the “M” is the Roman numeral for a thousand). If your eCPM is 2 (in whatever currency the network pays you), a thousand ad views earn 2. So the revenue for one day is `users × ads per user × eCPM ÷ 1000`. The eCPM varies a lot with the country, the format, the season and the advertiser, so never trust one number from an AI tool or an article: use what your network reports. The numbers below are invented for practice.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Ad revenue for one day (pretend numbers)',
        code: `function adRevenue(users, adsPerUser, ecpm) {
  const views = users * adsPerUser;
  return Math.round((views * ecpm / 1000) * 100) / 100;
}

// 1000 daily users, 5 ad views each, an eCPM of 2:
console.log(adRevenue(1000, 5, 2));
// 5000 views x 2 / 1000 = 10`,
      },
      {
        type: 'paragraph',
        text: 'Read it line by line. `views` is how many ads are shown in a day (5000). Multiply by the eCPM and divide by 1000 to get the day’s earnings (10). The `Math.round(… * 100) / 100` rounds to two decimals, like cents. Now compare with a subscription: with the same 1000 daily users, if even a small share paid a monthly price, the total could be larger and steadier. And notice what is missing from the formula: the *cost* of annoyance. Ads add friction, so you also lose some users, some ratings and some trust.',
      },
      { type: 'heading', text: 'When ads are worth it' },
      {
        type: 'table',
        headers: ['Signal', 'Ads probably fit', 'Ads probably do not fit'],
        rows: [
          ['Users and frequency', 'Many people, opening the app several times a day', 'A small group of professionals, or an app used a few times a year'],
          ['Value of each user', 'A casual audience that pays for little', 'People who would happily pay for a tool that saves them money or time'],
          ['Moment of use', 'Natural breaks (between levels, between articles)', 'Moments of work or stress, where an interruption costs something real'],
          ['Audience', 'Adults and general audiences', 'Children’s apps, which carry strict extra rules'],
        ],
        caption: 'You can also combine ads with a paid way to remove them, as many apps do.',
      },
      { type: 'heading', text: 'Consent and tracking' },
      {
        type: 'paragraph',
        text: 'Ads often rely on information about the person’s device or behaviour, and privacy rules apply. Apple’s guidelines say that to **track** people across other companies’ apps and websites you must get explicit permission through Apple’s App Tracking Transparency, and that consent is needed to collect data. The ad network’s consent tool (Google’s User Messaging Platform) shows a message that you configure in AdMob, records the person’s choice, and checks on every launch whether consent is needed; you ask for ads only once consent allows it. Apple’s ad rules also say interstitial ads must be clearly marked, must not trick people into tapping and must have a large, easy-to-see close button; ads must suit the app’s age rating; and children’s apps (Apple’s Kids Category) should not use ordinary third-party advertising, with only narrow exceptions. Your privacy policy must name the data that is collected and who receives it. Different countries have their own laws on consent, so ask for local advice before you launch ads.',
      },
      {
        type: 'version',
        text: 'Apple’s App Review Guidelines (5.1.1, 5.1.2(i), 2.5.18 and 1.3) require a privacy policy that is easy to reach in the app, consent to collect data, permission through the App Tracking Transparency APIs to track users’ activity, interstitials that are clearly marked, do not trick people and have a large, visible close or skip button, ads suitable for the app’s age rating, and restrict third-party advertising in the Kids Category. Google’s AdMob guide for the User Messaging Platform says to request a consent information update on every app launch, to check that you can request ads before requesting them, and to configure the messages in AdMob’s Privacy and messaging tab.',
        checked: CHECKED,
        sources: [DOCS.appleGuidelines, DOCS.admobUmp],
      },
      {
        type: 'warning',
        text: 'Always use the test ads and the sample app ID while you build. Repeatedly viewing or tapping your own live ads can be treated as invalid activity by the network and lead to your account being limited, so check your network’s current rules before you show real ads to yourself.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine a tricycle that gives free rides but has an advertising sign on the back. The driver earns a tiny amount each time someone sees the sign, so he only earns a decent living if thousands of people see it every day. If he drove a few passengers a week, the sign would earn almost nothing, and passengers would just find it ugly. **eCPM** is the price of showing the sign a thousand times. An **ad network** is the company that finds advertisers for you. **Consent** is the person saying “yes, you may use my information for this”, and the app has to ask politely and respect the answer. And **test ads** are pretend ads that let you try everything without cheating the system.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced builders.** Ad revenue is a function of impressions, fill rate and eCPM, and each of them moves with geography, format, placement and the consent rate, because users who refuse personalised ads usually earn less. Before building, model revenue per user per day under pessimistic eCPM, and compare it with the cost of lost retention: a modest drop in day-seven retention can outweigh a lot of impressions. Treat the ad SDK as a third-party dependency with real costs: app size, start-up time, crash surface, memory, privacy disclosures in each store’s forms, and a new set of policy obligations such as consent flows, age handling and per-country requirements. Prefer rewarded and well-placed formats, cap frequency, and do not ship the SDK in builds for children’s apps. If you will also sell a subscription, decide how the paid tier removes ads and test that purchase restoration removes them again on a new phone.',
      },
      {
        type: 'takeaways',
        items: [
          'Ads pay a tiny amount per view, so they only matter with very many users who open the app very often.',
          'Revenue is users × ads per user × eCPM ÷ 1000; use your network’s real eCPM, not a figure from an article or an AI answer.',
          'Rewarded ads are opt-in and usually the least resented; badly placed interstitials hurt trust and may break store rules.',
          'Tracking needs explicit permission (App Tracking Transparency on iPhone) and the ad network’s consent flow; children’s apps have extra restrictions.',
          'Test with test ads and sample IDs, and weigh the revenue against lost retention and trust.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-06-code-challenge-1',
          kind: 'code-challenge',
          title: 'What does a day of ads earn?',
          prompt: 'Write `adRevenue(users, adsPerUser, ecpm)`. The day’s ad views are `users × adsPerUser`; the earnings are the views times `ecpm`, divided by 1000. Round the result to two decimal places (multiply by 100, round, divide by 100).',
          concept: 'ad revenue arithmetic',
          language: 'javascript',
          starter: `function adRevenue(users, adsPerUser, ecpm) {
  // earnings for one day, rounded to two decimals
}`,
          tests: {
            kind: 'function',
            fn: 'adRevenue',
            cases: [
              { args: [1000, 5, 2], expected: 10, label: '5000 views at an eCPM of 2' },
              { args: [200, 3, 1.5], expected: 0.9, label: 'small app, small number' },
              { args: [12000, 4, 0.75], expected: 36, label: 'bigger audience' },
              { args: [0, 5, 2], expected: 0, label: 'no users' },
              { args: [333, 3, 1.25], expected: 1.25, label: 'rounds to two decimals' },
            ],
          },
          solution: `function adRevenue(users, adsPerUser, ecpm) {
  const views = users * adsPerUser;
  return Math.round((views * ecpm / 1000) * 100) / 100;
}`,
          hints: [
            'First work out the number of ad views in a day.',
            'Multiply the views by ecpm and divide by 1000, then round to two decimals.',
            'return Math.round((views * ecpm / 1000) * 100) / 100.',
          ],
          explanation: 'eCPM is the price per thousand views, so earnings are views × eCPM ÷ 1000. Rounding to cents with Math.round keeps the figure tidy. Small audiences give small numbers, which is the lesson.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-06-match-1',
          kind: 'match',
          title: 'Which ad format fits this moment?',
          prompt: 'Match each situation to the ad format that treats the user most fairly.',
          concept: 'ad formats',
          labels: { terms: 'The situation', meanings: 'A fair format' },
          pairs: [
            { term: 'A puzzle game where the player is stuck and could use an extra hint', definition: 'A rewarded ad the player chooses to watch for the hint', note: 'The user opts in and gets something in return.' },
            { term: 'A news app with a list of articles the reader scrolls through', definition: 'A native ad styled like an article in the list', note: 'It matches the content and does not cover it.' },
            { term: 'A quiz app where each round ends and the next has not started', definition: 'An interstitial at the natural pause, with a clear close button', note: 'The break is already there, so nobody is interrupted mid-task.' },
            { term: 'A tool shopkeepers use while serving customers at the counter', definition: 'No ad on the working screens; consider another model instead', note: 'An interruption at a busy moment costs real money to the user.' },
          ],
          hints: [
            'For each situation, ask when the user would least mind being interrupted.',
            'A format the user chooses is fairer than one forced on them.',
            'Stuck player goes with rewarded; a natural pause fits an interstitial; busy counter work fits no ad.',
          ],
          explanation: 'Fair ads respect what the person is doing: opt-in when you can, a natural pause when you cannot, and nothing at moments where an interruption has a real cost.',
        },
      },
    ],
    quiz: [
      {
        id: 'app-monetization-06-q1',
        prompt: 'An app has 500 daily users who see 4 ads each, at a pretend eCPM of 1.5. What are the day’s earnings?',
        choices: ['0.75', '3', '30', '300'],
        answer: 1,
        explanation: '500 × 4 = 2000 views; 2000 × 1.5 ÷ 1000 = 3. Skipping the division by 1000 gives 3000, dividing by 100 instead gives 30, and 0.75 comes from dividing twice.',
      },
      {
        id: 'app-monetization-06-q2',
        prompt: 'Which kind of app is most likely to earn a meaningful income from ads?',
        choices: [
          'A tool opened a few times a month by several hundred accountants',
          'A free game that millions of casual players open many times a day',
          'A mobile app used by one company’s technicians, for work they are paid to do',
          'A children’s learning app aimed at users under thirteen, with third-party ads',
        ],
        answer: 1,
        explanation: 'Ads need volume and frequency. Small professional audiences earn little, and children’s apps have strict restrictions on ordinary third-party advertising.',
      },
      {
        id: 'app-monetization-06-q3',
        prompt: 'What does an interstitial ad need, according to Apple’s ad rules in the guidelines?',
        choices: [
          'A timer that stops the close button from working for ten seconds so people see the whole advertisement',
          'A small, faint close icon in one corner so that the ad is not crowded by buttons or other marks',
          'The same advertisement for every user, so that the network’s report stays consistent from day to day',
          'Clear labelling, no tricks to get a tap, and a large close or skip button that is easy to see',
        ],
        answer: 3,
        explanation: 'Apple’s rule asks for clear labelling, no tricks, and a large visible close or skip button. Hidden or delayed close buttons are the opposite.',
      },
      {
        id: 'app-monetization-06-q4',
        prompt: 'While building your ads, what should you use?',
        choices: [
          'Real ads, tapped many times, to check that the earnings report moves',
          'Test ads and the sample app ID, until the integration is verified',
          'No ads at all, then add them in the same release you send to the store',
          'The ad units of another developer, copied from a tutorial, so you do not need an account',
        ],
        answer: 1,
        explanation: 'Test ads and sample IDs let you check everything safely. Tapping your own live ads can be treated as invalid activity, and using someone else’s units would send them your earnings.',
      },
      {
        id: 'app-monetization-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is “eCPM”?',
        choices: [
          'The number of people who have installed the app so far, counted across both stores',
          'How much you earn for each thousand times an ad is shown',
          'The time an ad stays on the screen before it disappears by itself',
        ],
        answer: 1,
        explanation: 'eCPM is the earnings per thousand ad views, which is how ad networks report what a view is worth.',
      },
      {
        id: 'app-monetization-06-q6',
        audience: { min: 'advanced' },
        prompt: 'An interstitial after every action adds impressions, but day-seven retention falls noticeably. How do you decide whether to keep it?',
        choices: [
          'Weigh added ad revenue against revenue lost to lower retention, and try fewer or rewarded ads',
          'Keep it, because impressions are exactly the thing the ad network pays you for in the end, so more is better',
          'Remove all ads at once, because any drop in retention proves that ads can never work for the app',
          'Move the ad to a screen few people visit, so that the retention number no longer shows any drop',
        ],
        answer: 0,
        explanation: 'Revenue is only part of the picture: lost retention lowers later revenue, ratings and recommendations. Weigh both, and test gentler placements before abandoning ads.',
      },
    ],
    task: {
      title: 'Decide whether ads fit your app',
      steps: [
        'Estimate how many people would open your app each day and how many ad views each would see in a gentle design. Write both numbers as guesses.',
        'Look up your ad network’s current reported eCPM range for your country and format, or write that you do not know yet. Calculate a pessimistic and an optimistic day of earnings with the function from this lesson.',
        'Compare it with what a small share of users paying a subscription could bring in. Which is steadier, and which fits your users?',
        'Write the consent steps your app would follow on first launch, in order, and what the app does if the person says no.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain eCPM with a tricycle-advertising example, then show me how it would change if my app had ten times fewer users.” Check its arithmetic yourself with the function.'] },
      { audience: { min: 'advanced' }, steps: ['Write a one-page experiment plan for ad placement: the metric you protect (retention), the metric you want (revenue per user), the duration, and the result that would make you remove the ads.'] },
    ],
  },
  {
    id: 'app-monetization-07',
    day: 7,
    title: 'Testing prices and reading your numbers',
    summary: 'The few numbers that matter for a paid app, how to compute them, and how to test a price without fooling yourself.',
    minutes: 27,
    skills: ['metrics'],
    intro: {
      objectives: [
        'Define and compute conversion rate, churn, monthly recurring revenue and a simple lifetime value',
        'Run a price or paywall test that changes one thing and waits long enough to mean something',
        'Notice when a difference between two numbers is probably just luck',
      ],
      why: 'Numbers are how you find out whether your price and paywall work, but small numbers lie easily. A few well-defined metrics, and the habit of asking “could this be chance?”, stop you from making big decisions on tiny evidence.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'After launch, your app produces numbers: how many people saw the paywall, how many bought, how many cancelled. Numbers can tell you **what** happened. They rarely tell you **why**, so use them to decide what to ask and test next, and talk to the users behind them. You do not need dozens of charts. Four metrics cover most of what a small paid app needs, and each has a plain definition you can compute with a few lines of code. Defining them yourself matters, because dashboards use their own definitions and a word like “churn” can mean different things in different tools.',
      },
      { type: 'heading', text: 'Four numbers worth knowing' },
      {
        type: 'table',
        headers: ['Metric', 'In plain words', 'How to compute it'],
        rows: [
          ['Conversion rate', 'Of the people who saw the paywall, how many bought', 'buyers ÷ people who saw it, as a percentage'],
          ['Monthly churn', 'Of the customers you had at the start of a month, how many were gone by its end', 'customers lost ÷ customers at the start, as a percentage'],
          ['MRR (monthly recurring revenue)', 'The money subscriptions bring in per month, with yearly plans spread over twelve months', 'for each active plan, price ÷ months in its period, added up'],
          ['Lifetime value (simple)', 'How much a typical customer is expected to pay before leaving', 'monthly revenue per customer ÷ monthly churn (as a fraction)'],
        ],
        caption: 'Count revenue after the store’s share if you want to know what you actually keep.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The four metrics in code (pretend numbers)',
        code: `function conversionRate(views, buyers) {
  if (views === 0) return 0;
  return Math.round((buyers / views) * 1000) / 10;
}

function monthlyChurn(startCount, lost) {
  if (startCount === 0) return 0;
  return Math.round((lost / startCount) * 1000) / 10;
}

function mrr(subs) {
  let total = 0;
  for (const sub of subs) total += sub.price / sub.months;
  return Math.round(total * 100) / 100;
}

function lifetimeValue(monthlyRevenue, churnPercent) {
  return Math.round((monthlyRevenue / (churnPercent / 100)) * 100) / 100;
}

console.log(conversionRate(400, 18));  // 4.5 (percent)
console.log(monthlyChurn(200, 14));    // 7 (percent)
console.log(mrr([
  { price: 100, months: 1 },
  { price: 1200, months: 12 },
  { price: 100, months: 1 },
]));                                   // 300
console.log(lifetimeValue(100, 7));    // 1428.57`,
      },
      {
        type: 'paragraph',
        text: 'Read each one. `conversionRate` divides buyers by views and multiplies by 1000 before rounding, then divides by 10, which gives a percentage with one decimal (18 of 400 is 4.5%). The first line guards against dividing by zero. `monthlyChurn` is the same idea with customers lost over customers at the start (14 of 200 is 7%). `mrr` turns every plan into a per-month amount: the yearly plan of 1200 counts as 100 a month, so the three plans give 300. `lifetimeValue` uses a simple rule: a customer who pays 100 a month and has a 7% chance each month of leaving is expected to stay about 1 ÷ 0.07 months, so the value is 100 ÷ 0.07, about 1428.57. It assumes churn stays the same and ignores the store’s share, so treat it as a rough guide, never a promise.',
      },
      { type: 'heading', text: 'Testing a price without fooling yourself' },
      {
        type: 'paragraph',
        text: 'To test a price or a paywall, show version A to some people and version B to others, change **one** thing, and compare. The traps are easy to fall into. **Small numbers are noisy:** if both versions truly convert at 5%, and 200 people see each, a difference of four or more buyers between them still happens about 42% of the time just by luck (we computed this exactly for two groups of 200). So “B got 12 buyers and A got 8” proves almost nothing yet. **Look too early:** stopping the moment B is ahead makes you pick winners that are really noise. **Wait for the whole cycle:** a seven-day trial hasn’t told you anything about paid conversion until the seventh day has passed, and a yearly plan about retention only after the year. **Compare like with like:** a campaign that brought friends will convert far better than strangers, so track where each person came from. Decide the sample size and the stopping rule *before* you start, and write down what result would change your mind.',
      },
      {
        type: 'table',
        headers: ['Habit', 'Why it protects you'],
        rows: [
          ['Change one thing at a time', 'If price and wording both changed, you will not know which one mattered.'],
          ['Decide how long and how many people before starting', 'It stops you declaring a winner the moment the numbers wobble your way.'],
          ['Look at revenue per visitor, not only conversion', 'A cheaper plan can convert more and still earn less: revenue per visitor is conversion × price.'],
          ['Check refunds and cancellations later', 'A change that wins today may bring regret in a month.'],
          ['Talk to a few buyers and a few non-buyers', 'Numbers say what happened; people tell you why.'],
        ],
        caption: 'Tools and dashboards differ between the stores and subscription services, and so do the experiments they allow; check what yours offers.',
      },
      {
        type: 'version',
        text: 'Google’s Play Billing documentation lists the subscription states (active, cancelled, in grace period, on hold, paused, expired) and says a user is considered churned at expiration, which means a cancelled user who still has paid access is not yet counted as churned there. Apple limits each customer to one introductory offer per subscription group, so trial numbers in a group reflect first-time customers. Dashboards define “churn”, “trial” and “revenue” in their own ways, including whether revenue is shown before or after the store’s share; read each tool’s definition before you compare numbers across tools.',
        checked: CHECKED,
        sources: [DOCS.googleIntegrate, DOCS.appleIntro],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Run a small shop in your mind. *Conversion* is how many of the people who walked in actually bought something. *Churn* is how many of your regular customers stopped coming this month. *MRR* is how much your regulars pay you in a normal month, counting a yearly payer as one twelfth each month. *Lifetime value* is a guess at how much a regular will spend before they stop coming. And the big warning: if only eight people out of two hundred bought on Monday and twelve out of two hundred on Tuesday, that does not prove Tuesday’s sign is better. A few lucky customers can make that difference, the way a coin can land heads three times in a row. Wait for more people before you decide.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced builders.** Prefer cohort views: group customers by the month they started and follow each group’s retention curve, because aggregate churn hides the difference between a growing base of new, fragile customers and a stable base of loyal ones. Use a sample-size calculation for the smallest change you care about, and avoid peeking, or use a sequential method designed for it. Report intervals, not just point estimates, and treat many segment cuts as exploration that needs a fresh test. Net revenue should reflect store share, taxes, refunds and chargebacks, and trial-to-paid should be analysed by the trial length and the plan. Simple lifetime value assumes constant churn, which is rarely true; early churn is usually higher, so fit a retention curve if you will spend money acquiring users, and compare LTV with acquisition cost over a realistic horizon. If an AI tool analyses your export, make it show the formulas, then reproduce two figures by hand or with a script: assistants often misread a column or use a different definition of churn.',
      },
      {
        type: 'takeaways',
        items: [
          'Four metrics cover most needs: conversion rate, monthly churn, MRR and a simple lifetime value; define them yourself and compute them the same way each time.',
          'MRR spreads each plan over its months, so a yearly plan counts as one twelfth each month.',
          'Small numbers are noisy: two identical offers can easily show a gap of a few buyers, so do not choose a winner on tiny samples.',
          'Change one thing at a time, fix the sample size and stopping rule first, wait for the whole trial or billing cycle, and compare like with like.',
          'Revenue per visitor and later refunds and cancellations tell you more than conversion alone.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-07-code-challenge-1',
          kind: 'code-challenge',
          title: 'Add up the monthly recurring revenue',
          prompt: 'Write `mrr(subs)`. Each subscriber is an object with `price` (what they pay each billing period) and `months` (how many months that period covers). Return the monthly recurring revenue: the sum of `price ÷ months` for every subscriber, rounded to two decimal places (multiply by 100, round, divide by 100). With no subscribers, return 0.',
          concept: 'monthly recurring revenue',
          language: 'javascript',
          starter: `function mrr(subs) {
  // add up what each subscriber brings in per month
}`,
          tests: {
            kind: 'function',
            fn: 'mrr',
            cases: [
              { args: [[{ price: 100, months: 1 }, { price: 1200, months: 12 }, { price: 100, months: 1 }]], expected: 300, label: 'a yearly plan counts as one twelfth a month' },
              { args: [[{ price: 500, months: 3 }, { price: 60, months: 1 }]], expected: 226.67, label: 'a three-monthly plan, rounded to two decimals' },
              { args: [[]], expected: 0, label: 'no subscribers' },
              { args: [[{ price: 240, months: 12 }]], expected: 20, label: 'one yearly subscriber' },
            ],
          },
          solution: `function mrr(subs) {
  let total = 0;
  for (const sub of subs) {
    total += sub.price / sub.months;
  }
  return Math.round(total * 100) / 100;
}`,
          hints: [
            'Keep a running total and visit every subscriber.',
            'Each one adds sub.price divided by sub.months to the total.',
            'After the loop, return Math.round(total * 100) / 100.',
          ],
          explanation: 'MRR puts every plan on the same monthly footing, so a yearly plan counts as one twelfth each month. Rounding at the end, rather than per subscriber, avoids piling up small rounding errors.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-07-predict-output-1',
          kind: 'predict-output',
          title: 'Read the dashboard',
          prompt: 'Predict the three lines this program prints. Take care with which number is divided by which.',
          concept: 'reading metrics',
          language: 'javascript',
          code: `function conversionRate(views, buyers) {
  if (views === 0) return 0;
  return Math.round((buyers / views) * 1000) / 10;
}
function monthlyChurn(startCount, lost) {
  if (startCount === 0) return 0;
  return Math.round((lost / startCount) * 1000) / 10;
}
function lifetimeValue(monthlyRevenue, churnPercent) {
  return Math.round((monthlyRevenue / (churnPercent / 100)) * 100) / 100;
}

const rate = conversionRate(250, 10);
const churn = monthlyChurn(100, 5);
console.log('conversion: ' + rate);
console.log('churn: ' + churn);
console.log('lifetime: ' + lifetimeValue(80, churn));`,
          choices: [
            'conversion: 4\nchurn: 5\nlifetime: 16',
            'conversion: 4\nchurn: 5\nlifetime: 1600',
            'conversion: 25\nchurn: 5\nlifetime: 1600',
            'conversion: 4\nchurn: 20\nlifetime: 400',
          ],
          wrongNotes: {
            'conversion: 4\nchurn: 5\nlifetime: 16': 'The lifetime function turns the churn percent into a fraction first: 5 becomes 0.05, and 80 ÷ 0.05 is 1600, not 80 ÷ 5.',
            'conversion: 25\nchurn: 5\nlifetime: 1600': 'Conversion divides buyers by views (10 ÷ 250), not views by buyers, so it is 4 percent, not 25.',
            'conversion: 4\nchurn: 20\nlifetime: 400': 'Churn divides the customers lost by the customers at the start (5 ÷ 100), which is 5 percent, not 20.',
          },
          hints: [
            'Work out each function’s answer separately, starting with conversionRate(250, 10).',
            'Conversion is buyers over views, churn is lost over start, and lifetime divides revenue by churn as a fraction.',
            '10 ÷ 250 is 4%, 5 ÷ 100 is 5%, and 80 ÷ 0.05 is 1600.',
          ],
          explanation: 'Each metric is a ratio with a clear top and bottom: buyers over views, lost over start. The lifetime value then uses churn as a fraction, so 5% becomes 0.05 and 80 ÷ 0.05 gives 1600.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-07-scenario-1',
          kind: 'scenario',
          title: 'B looks better. Now what?',
          prompt: 'Choose the best decision.',
          concept: 'judging a test',
          situation: 'You showed paywall A to 200 people and paywall B to another 200 over one weekend. A got 8 buyers and B got 12. B has a bigger discount. Your teammate says “B wins by 50%, ship it to everyone”. Refunds and later cancellations take weeks to show.',
          options: [
            { text: 'Keep testing: you have few buyers, a gap of four is easy to get by chance, and B’s discount may cost revenue per visitor and bring refunds later. Decide the sample size first and compare revenue per visitor.', consequence: 'You avoid acting on noise and look at what the business really needs. The decision will rest on evidence from many more people.', quality: 'best' },
            { text: 'Ship B now: 12 is clearly more than 8, and waiting wastes sales.', consequence: 'With so few buyers, a gap of four is ordinary luck. You might ship a worse paywall with a larger discount and never find out.', quality: 'poor' },
            { text: 'Keep A, because 8 buyers are enough to show that A is fine.', consequence: 'Eight is just as noisy as twelve. You have not shown that A is better; you have only shown there is not enough evidence.', quality: 'poor' },
            { text: 'Ship B to half of all users and watch conversion for another weekend.', consequence: 'A step in the right direction, with more people, but a weekend is still short, and you are watching conversion only, not revenue per visitor or refunds.', quality: 'acceptable' },
          ],
          hints: [
            'How big is the sample, and how easily could a gap of four buyers happen by chance?',
            'Conversion alone ignores the discount: compare revenue per visitor and look at refunds later.',
            'Keep the test running with a planned sample size and compare revenue per visitor, not only buyers.',
          ],
          explanation: 'Few buyers make any difference easy to produce by luck, and a deeper discount can raise conversion while lowering revenue per visitor. Plan the sample, compare revenue per visitor, and wait for refunds before declaring a winner.',
        },
      },
    ],
    quiz: [
      {
        id: 'app-monetization-07-q1',
        prompt: '400 people saw the paywall and 18 bought. What is the conversion rate?',
        choices: ['0.45%', '22%', '18%', '4.5%'],
        answer: 3,
        explanation: '18 ÷ 400 = 0.045, which is 4.5%. Dividing the other way gives about 22, and 18% confuses the buyers count with a percentage.',
      },
      {
        id: 'app-monetization-07-q2',
        prompt: 'You had 250 paying customers on the first of the month, and 10 of them were gone by the end. What is that month’s churn?',
        choices: ['4%', '10%', '25%', '2.5%'],
        answer: 0,
        explanation: 'Churn is customers lost divided by customers at the start: 10 ÷ 250 = 0.04, or 4%.',
      },
      {
        id: 'app-monetization-07-q3',
        prompt: 'Why does MRR divide a yearly plan’s price by twelve?',
        choices: [
          'Because stores only pay you for yearly plans in twelve monthly instalments, so the money arrives that way',
          'Because the plan is cheaper than a monthly one, so its price must be lowered to compare fairly',
          'Because users often cancel after a month, so only one twelfth of the yearly price is certain',
          'To count every plan as money per month, so different plan lengths can be added up fairly',
        ],
        answer: 3,
        explanation: 'MRR puts all plans on a monthly footing so they can be summed. It is not about how the store pays, a discount, or cancellations.',
      },
      {
        id: 'app-monetization-07-q4',
        prompt: 'Which habit best protects a price test from fooling you?',
        choices: [
          'Stopping the test as soon as one version leads, so that you do not waste visitors on the weaker one',
          'Changing the price, the wording and the picture together, so that you test as many ideas as possible at once',
          'Deciding the sample size and stopping rule first, changing one thing, and waiting for the full trial cycle',
          'Sending the test only to your friends, who will answer quickly and can explain what they felt',
        ],
        answer: 2,
        explanation: 'A planned sample and stopping rule prevents picking a winner from noise, and one change at a time tells you what mattered. Friends are not typical customers.',
      },
      {
        id: 'app-monetization-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does “churn” measure?',
        choices: [
          'How many new customers signed up during the month',
          'How much money each customer spent last month in total',
          'How many of your customers left during the month',
        ],
        answer: 2,
        explanation: 'Churn is the share of customers who left in a period. Joining and spending are different measures.',
      },
      {
        id: 'app-monetization-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Aggregate monthly churn looks stable at 6%, yet your growth is slowing. What is the most useful next analysis?',
        choices: [
          'Follow retention by monthly cohort, to see if newer customers leave faster than older ones',
          'Raise prices, because stable churn means that customers are happy with the app at any price',
          'Average churn over a whole year, since a longer window smooths out the noise in the figure',
          'Remove the refunds from the data, so that the churn figure looks cleaner to everyone',
        ],
        answer: 0,
        explanation: 'An aggregate figure can hide new, fragile customers inside a stable base. Cohort retention shows whether recent customers behave differently, and averaging or removing refunds hides the problem.',
      },
    ],
    task: {
      title: 'Build your numbers sheet',
      steps: [
        'Write the four metrics at the top of a note or spreadsheet with the formula you will use for each, and the exact meaning of “customer” and “month” in your app.',
        'Make up a week of pretend numbers for your app (views, buyers, customers at the start, customers lost, plans) and compute all four by hand, then with the functions from this lesson.',
        'Write one price or paywall test you would run: the one thing you change, how many people you will wait for, how long, and the result that would make you keep or drop it.',
        'Ask an AI tool to review your plan for any way you could fool yourself, and note which of its points you agree with.',
      ],
      minutes: 18,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain conversion and churn with a small shop example, then give me three practice numbers to compute myself.” Do the sums before looking at its answers.'] },
      { audience: { min: 'advanced' }, steps: ['Add a cohort table to your sheet (rows are start months, columns are months since starting) and write the question it would answer that the single churn number cannot.'] },
    ],
  },
  {
    id: 'app-monetization-08',
    day: 8,
    title: 'Project: a monetization plan and paywall for your app',
    summary: 'Put the course together into a one-page plan and a paywall design, and have an AI tool argue against it before you build.',
    minutes: 28,
    skills: ['monetization-plan'],
    intro: {
      objectives: [
        'Write a one-page monetization plan that names the model, price, plans, store setup, paywall, ads decision and numbers',
        'Turn the plan into a paywall specification you can give to an AI coding tool',
        'Use an AI critic and a launch checklist to find what is missing before you build',
      ],
      why: 'A plan on one page forces the decisions you have been putting off and gives your AI tool something precise to build. It also gives a client or a teammate something to react to, and it is the proof that you can run the money side of an app.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'This lesson ties the course together. You will write a **one-page monetization plan** and a **paywall specification** for your own app (or for Lista if you have no app yet). The plan is short on purpose: one page is long enough to hold the decisions and short enough to be read and changed. It is also exactly the kind of input an AI coding tool needs. “Build me a paywall” gets you a generic screen; a precise specification gets you the screen you meant. And once the plan exists you can ask an AI tool to attack it, which costs nothing and finds weak spots before they cost you real users.',
      },
      { type: 'heading', text: 'The seven parts of the plan' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Who pays, for what, and the model.** One sentence from Lesson 1, with the reason: how often users get value and what it costs you.',
          '**Price and plans.** The floor from Lesson 2 (monthly costs, the store’s share, break-even customers), the ceiling you heard from real people, and the plans you will offer. Write the method, not just the number.',
          '**What is free and what is paid.** The free limit tied to what grows with the user’s success, and the entitlement name.',
          '**Store setup.** The product types from Lesson 3, the subscription group or base plans, any free trial or offer, and who verifies purchases (Lesson 5).',
          '**The paywall.** Where it appears, the exact price and renewal lines, the trial terms, restore, close, links, and what happens to the user’s data when a plan ends (Lesson 4).',
          '**Ads: yes or no, and why.** With the arithmetic from Lesson 6 and the consent steps if yes.',
          '**Numbers and decisions.** The metrics you will track (Lesson 7), the first test, and the result that would make you change the plan, plus the date you will recheck store rules.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        label: 'Lista’s plan, shortened (all numbers left for you to fill in from your own method)',
        code: `LISTA: MONETIZATION PLAN (v1)

1. Model: subscription. Owners open Lista daily and it stores their records
   in the cloud, so value and running costs both repeat every month.
   Backup: one-time unlock is the fallback if owners will not subscribe.

2. Price: floor = monthly costs / (price x (1 - store share)); break-even =
   <customers>. Ceiling: five owners called the notebook "free", so we must
   show clear extra value (never lose a record, polite reminders). Plans:
   monthly and yearly. Price chosen by the three-anchor method, <price>.

3. Free vs paid: free for up to <N> customers on the list. Paid ("pro"
   entitlement): unlimited customers, backup and reminders. One entitlement
   named "pro", unlocked by both plans.

4. Store setup: auto-renewable subscription in one group (Apple); one
   subscription with two base plans (Google). Trial: none in v1.
   Verification: a subscription service; the app reads the "pro" entitlement.

5. Paywall: shown when an owner adds customer <N + 1>. Headline shows the
   amount charged and its period, says it renews until cancelled, shows the
   store's own price text, has Restore, a normal close button, and links to
   terms and privacy. When a plan ends: paid features are hidden, every record
   is kept.

6. Ads: no. Few users, daily use at the counter, and interruptions cost
   owners money.

7. Numbers: conversion at the paywall, monthly churn, MRR. First test: wording
   of the benefits list (one change). Decide after <sample size> views. Change
   the plan if monthly churn stays above <limit> for 3 months.
   Store rules last checked: <date>. Recheck before every release.`,
      },
      { type: 'heading', text: 'From plan to a specification an AI tool can build' },
      {
        type: 'paragraph',
        text: 'A paywall specification lists what the screen shows and what the code must do, in words a tool cannot misread. The prompt below turns parts 3 to 5 of the plan into one. Notice what it forbids as well as what it asks for: the pushy patterns you learned to avoid. Always read what comes back against the fair-paywall list from Lesson 4, and check that unlocking depends on the entitlement and nothing else.',
      },
      {
        type: 'prompt',
        label: 'A paywall specification prompt (for anyone)',
        text: 'Build a paywall screen for my Expo app Lista. It appears when the owner tries to add customer number 11 on the free plan. Show: a short list of what Pro gives (unlimited customers, backup, reminders); two plans, monthly and yearly, with the price text taken from the store product, never typed by us; under each price a line stating the amount charged, its period, and that it renews until cancelled; a Restore purchases button; a normal-sized Close button that returns to the free app; links to terms and privacy. Do not pre-select a plan, do not add countdowns or fake urgency, and do not hide any price. Unlock features only when the “pro” entitlement is active, never from a flag saved on the phone. When Pro ends, hide paid features but never delete the owner’s records. Tell me anything in this spec you could not do.',
      },
      {
        type: 'prompt',
        audience: { min: 'advanced' },
        label: 'A critic prompt with acceptance criteria (for experienced builders)',
        text: 'Act as a skeptical reviewer of the monetization plan below. Context: consumer subscription app, iOS and Android, Expo, entitlement via a subscription service. Task: list (1) assumptions the plan makes without evidence, (2) ways it could violate current App Store and Google Play subscription, payment or ad policies (cite the policy section and mark anything you are not sure about as UNVERIFIED), (3) failure modes in the purchase and entitlement flow, (4) metrics that could look healthy while the business is not, and (5) the smallest experiment for each top risk, with a stopping rule. Do not invent statistics. Plan: <paste plan>',
      },
      { type: 'heading', text: 'Argue against your own plan' },
      {
        type: 'paragraph',
        text: 'Paste the plan into an AI tool and ask it to argue **against** it: what assumptions are unproven, which store rule might be broken, what would make the numbers look good while the business is not. AI tools lean toward agreeing with you, so ask for objections explicitly and ask it to mark anything it is unsure of. Then use your own judgement: keep objections you can trace to a real rule or a real customer, and drop the rest. The same applies to the launch: start with a small group, watch the numbers for a while, and widen only when the first group behaves.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The route from plan to launch. Each step makes the next one cheaper to get right.',
        source: `flowchart TD
  A[One-page plan] --> B[AI critic: find the weak spots]
  B --> C[Set up store products and the entitlement]
  C --> D[Build the paywall from the specification]
  D --> E[Test with sandbox or license testers]
  E --> F[Review against the fair-paywall list]
  F --> G[Release to a small group]
  G --> H[Watch the numbers and talk to users]
  H -->|plan holds| I(Widen the release)
  H -->|something is off| A`,
      },
      {
        type: 'version',
        text: 'Store requirements that most often surprise first-time sellers, as stated in the stores’ own documentation at the time of checking: Apple requires your first auto-renewable subscription and subscription group to be submitted with a new app version, requires a restore mechanism for restorable purchases, a privacy policy easy to reach in the app, and clear subscription information before asking someone to subscribe; Google requires that purchases are acknowledged within three days, that subscription terms and free-trial conversion are disclosed, and that your Play Billing Library version is supported for new apps and updates. All of these change, so recheck them when you plan each release.',
        checked: CHECKED,
        sources: [DOCS.appleSubs, DOCS.appleGuidelines, DOCS.googleIntegrate, DOCS.googleMonetization, DOCS.googleDeprecation],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Planning your app’s money is like planning a small stall before opening day. You decide what you sell, what you charge, what customers get free to try, how they pay, and how you will know whether it is going well. Writing it on **one page** means a friend can read it in two minutes and tell you what is unclear. A **specification** is simply a careful description of what you want built, so that the AI tool (or a human) does not have to guess. If you are not sure about a part, write “I do not know yet” and add the question you will ask to find out. That is better than inventing a number.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced builders.** Treat the plan as a living artefact in the repository, next to your instructions file for the coding agent, with its assumptions separated from its facts and each assumption linked to the metric that will confirm or kill it. Put policy checks in the release routine rather than in memory: a checklist that pulls the current store text for the sections you rely on, a test that fails if the paywall lacks price, renewal and restore, and an entitlement test table covering every subscription state. Keep a decision log for pricing changes, because a change affects existing subscribers and needs the stores’ own notice and consent flows. For clients, split the deliverable into the plan, the specification, the built flow and a handover with the dashboards and the review dates, so they can run the monetization after you leave.',
      },
      {
        type: 'takeaways',
        items: [
          'A one-page plan has seven parts: model, price and plans, free versus paid, store setup, paywall, ads decision, and numbers with decision rules.',
          'Write the method for each number, not only the number, and mark unknowns as questions instead of inventing figures.',
          'Turn the plan into a precise paywall specification, including what the screen must not do, before asking an AI tool to build it.',
          'Ask an AI tool to argue against your plan, then keep only the objections you can trace to a real rule or a real customer.',
          'Test with sandbox or license testers, release to a small group, watch the numbers, and recheck store rules before every release.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-08-arrange-1',
          kind: 'arrange',
          title: 'Order the route to launch',
          prompt: 'Arrange these steps in the order a careful builder would do them, from the plan to widening the release.',
          concept: 'launch order',
          language: 'text',
          solution: [
            'Write the one-page plan and let an AI critic challenge it',
            'Set up the store products and the entitlement',
            'Build the paywall from the specification',
            'Test the purchase flow with sandbox or license testers',
            'Review the paywall against the fair-paywall list',
            'Release to a small group and watch the numbers',
            'Widen the release if the first group behaves',
          ],
          reasons: [
            'The decisions and their objections come before any building.',
            'Products and the entitlement must exist before the paywall can show them.',
            'The paywall is built from the specification, using the store’s own prices.',
            'You test payments with pretend money before real customers see them.',
            'A last review against the fair list catches pushy or missing pieces.',
            'A small group limits the damage of any mistake.',
            'Only widen once the small group shows the plan holds.',
          ],
          hints: [
            'What has to exist before you can build or test anything?',
            'Test before you review, and review before you release.',
            'Plan, products, paywall, tests, review, small release, wider release.',
          ],
          explanation: 'Each step makes the next cheaper to get right: decide, set up, build, test with pretend money, review for fairness, release small, then widen once the evidence says so.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-08-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete part of Lista’s plan',
          prompt: 'Fill the blanks using what the course taught. Pick from the bank; some words are not used.',
          concept: 'writing the plan',
          language: 'text',
          code: `We charge by ___ because owners use Lista every day and it costs us every month to store their data.
The one question the app asks about access is: does this person have the ___ entitlement?
The paywall appears when the owner reaches the ___ limit.
When a plan ends we ___ the paid features but keep every ___ the owner entered.`,
          blanks: [
            { answers: ['subscription'], feedback: 'The model should follow how value and costs repeat: a subscription, not ads or a one-time unlock.' },
            { answers: ['pro'], feedback: 'The entitlement is the single access question; in this plan it is named pro.' },
            { answers: ['free'], feedback: 'The paywall appears when the owner meets the free plan’s limit, after feeling the value.' },
            { answers: ['hide'], feedback: 'Lock without deleting: hide the paid features rather than removing anything.' },
            { answers: ['record'], feedback: 'Everything the owner entered, every record, stays when a plan ends.' },
          ],
          bank: ['subscription', 'pro', 'free', 'hide', 'record', 'delete', 'ads', 'banner'],
          hints: [
            'Think back to the lesson on choosing a model for an app used daily with running costs.',
            'The first blank is a model, the second the entitlement name, the third a plan, and the last two say what happens at the end of a plan.',
            'subscription, pro, free, then hide the paid features and keep every record.',
          ],
          explanation: 'The sentences restate the plan’s decisions: a subscription fits daily use with running costs, one entitlement guards access, the paywall appears at the free limit, and when a plan ends the paid features are hidden but every record stays.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'app-monetization-08-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Pre-launch check: what is the answer?',
          prompt: 'Read each question on the front, say your answer aloud, then tap to compare.',
          concept: 'pre-launch review',
          cards: [
            { front: 'Which single line of the paywall must show the real charge, and what else sits beside it?', back: 'The price line shows the amount charged and its period, and says the plan renews until cancelled. A monthly equivalent may only appear as a smaller extra.' },
            { front: 'What do you do when a customer’s plan ends?', back: 'Hide or block the paid features and keep everything the customer created, so coming back is easy.' },
            { front: 'Where does the app learn that someone has paid?', back: 'From a verified entitlement (your server or a subscription service), never from a flag saved on the phone.' },
            { front: 'How do you test the purchase flow?', back: 'With Apple’s sandbox, StoreKit testing or TestFlight, and Google license testers, never with your own card.' },
            { front: 'What must you recheck before every release?', back: 'The stores’ current policies on payments, subscriptions and ads, your Play Billing Library version, and the consent steps.' },
          ],
          hints: [],
          explanation: 'These five answers are the heart of the plan: an honest price line, no deleting, verified access, safe testing, and a habit of rechecking the rules.',
        },
      },
    ],
    quiz: [
      {
        id: 'app-monetization-08-q1',
        prompt: 'Which pair of items belongs in the “numbers and decisions” part of the plan?',
        choices: [
          'The metrics you will track, and the result that would make you change the plan',
          'The colour of the Subscribe button, and the screen it opens when the user taps it',
          'The names of other apps in the store, and the number of stars each of them has',
          'The list of countries where the app will not be sold, and the reasons for each',
        ],
        answer: 0,
        explanation: 'The last part says what you will measure and what outcome would change your mind. Design details and market lists belong elsewhere in the plan.',
      },
      {
        id: 'app-monetization-08-q2',
        prompt: 'An AI critic lists ten objections to your plan. What do you do?',
        choices: [
          'Fix all ten at once, because the critic has read more store policies than you have',
          'Ignore them, because a tool that is built to find fault is never reliable about anything',
          'Ask a second AI tool to rank them and follow its ranking without checking any of them',
          'Keep those you can trace to a real store rule or customer, and test or drop the rest',
        ],
        answer: 3,
        explanation: 'The critic is a source of questions, not rulings. Policy claims must be checked on the store’s own page, and customer-based objections can be tested with people.',
      },
      {
        id: 'app-monetization-08-q3',
        prompt: 'Why release to a small group first?',
        choices: [
          'Because the stores only allow a small number of users to buy during the first week',
          'Because a mistake then affects few people, and you can watch the numbers before widening',
          'Because small groups always convert better, so your numbers will look strong at the start',
          'Because it removes the need for sandbox or license testers, since real users are enough',
        ],
        answer: 1,
        explanation: 'A small release limits the damage of any error and gives you real behaviour to read. It does not replace testing, and it is not about making numbers look good.',
      },
      {
        id: 'app-monetization-08-q4',
        prompt: 'In your plan you have no figure yet for the cost of running the app. What is the best way to write it?',
        choices: [
          'Write the number an AI tool suggests, so that the plan looks complete to anyone who reads it',
          'Leave the section empty, because plans with unknowns are not worth writing down at all',
          'Write “unknown”, add the question you will ask or measure to find out, and date the entry',
          'Copy the cost from a similar app you found online, and treat it as your own measured figure',
        ],
        answer: 2,
        explanation: 'An honest unknown with a way to resolve it beats an invented figure. A plan is a working document, and each gap becomes a task.',
      },
      {
        id: 'app-monetization-08-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a “specification” for a paywall?',
        choices: [
          'A careful written description of what the screen must show and do, so nobody guesses',
          'The file where the app stores its customers’ names and the plans they have chosen so far',
          'A picture of the screen drawn quickly, which the tool is free to change however it likes',
        ],
        answer: 0,
        explanation: 'A specification states clearly what you want built, including what it must not do, so an AI tool or a person can build it without guessing.',
      },
      {
        id: 'app-monetization-08-q6',
        audience: { min: 'advanced' },
        prompt: 'You hand a client the finished subscription flow. Which handover best lets them run the monetization without you?',
        choices: [
          'The built flow and your admin password, with a note to ask you whenever something needs changing',
          'A recording of the app working on your phone, plus the invoice for the work you have done for them',
          'The source code only, since any competent person can work out the rest by reading through it',
          'The plan, specification, entitlement tests, dashboards with metric definitions, and recheck dates',
        ],
        answer: 3,
        explanation: 'A handover has the reasoning (plan and specification), proof it works (tests), the means to watch it (dashboards with definitions) and the maintenance dates. Code or passwords alone leave the client dependent.',
      },
    ],
    task: {
      title: 'Write the plan, then attack it',
      steps: [
        'Write your one-page plan using the seven parts. Mark every unknown as a question with a way to find the answer.',
        'Write the paywall specification from parts 3 to 5, including what the screen must not do.',
        'Paste the plan into an AI tool with the critic prompt, then check each objection against a store page or a real person.',
        'Update the plan with what you decided, and add the date on which you will recheck store rules.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Read your plan aloud to a friend and ask them to point to the first sentence they do not understand. Rewrite that sentence in plainer words.'] },
      { audience: { min: 'advanced' }, steps: ['Turn your entitlement test table into real tests for the states of Lesson 3, and write the release checklist item that blocks a build if the paywall lacks price, renewal or restore.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'app-monetization-p1',
    title: 'A monetization plan and paywall for your app',
    summary: 'Write a one-page monetization plan and a paywall specification for an app you are building, have an AI critic challenge it, and compute the numbers you will track.',
    outcome: 'A clear, evidence-based plan and paywall design that shows a client or an employer you can decide how an app earns, price it with a method, and build a fair paywall.',
    unlockAfterDay: 7,
    steps: [
      { id: 'app-monetization-p1-s1', text: 'Write the one-page plan with its seven parts: model, price and plans, free versus paid, store setup, paywall, ads decision, and numbers with decision rules. Use your own app or Lista.' },
      { id: 'app-monetization-p1-s2', text: 'Show the arithmetic behind your price: monthly costs, the store’s share as you read it on the store’s current page, the break-even number of customers, and what real people told you about a bargain and a too-expensive price.' },
      { id: 'app-monetization-p1-s3', text: 'Write the paywall specification: when it appears, the exact price and renewal lines for each plan, trial terms if any, restore, close, links, and what happens to the user’s data when a plan ends. Add a sketch.' },
      { id: 'app-monetization-p1-s4', text: 'Paste the plan into an AI tool and ask it to argue against it. List the objections you kept (with the rule or the customer evidence behind each one) and the ones you dropped, with your reason.' },
      { id: 'app-monetization-p1-s5', text: 'Write the numbers sheet: the four metrics with your formulas, a week of pretend numbers computed with code, and the first test you would run with its sample size and stopping rule.' },
      { id: 'app-monetization-p1-s6', audience: { max: 'beginner' }, text: 'Keep it small and guided: choose only a model, a free limit and one paid plan. Ask the AI to explain each decision to you in plain words, and write “I do not know yet” plus a question for anything you cannot answer.' },
      { id: 'app-monetization-p1-s7', audience: { min: 'intermediate' }, text: 'Add the product setup as the stores would see it: product types, the entitlement and its plans, the subscription states your app must handle, and who verifies purchases.' },
      { id: 'app-monetization-p1-s8', audience: { min: 'advanced' }, text: 'Add a risk review: policy sections you rely on with their current text checked, refund and revocation handling, a cohort view in your numbers sheet, and the release checklist items that stop a build lacking price, renewal or restore on the paywall.' },
      { id: 'app-monetization-p1-s9', audience: { min: 'professional' }, text: 'Add the engineering workflow: the plan and specification stored in the repository next to your agent instructions, an entitlement test table, and the review evidence for any AI-generated purchase or paywall code.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your plan and paywall specification',
      placeholder: 'Paste the one-page plan, the paywall specification, the objections you kept and dropped, and your numbers sheet.',
      hint: 'A good submission names the model with its reason, shows the price method and break-even arithmetic, gives exact paywall lines, and says what would change the plan.',
    },
    rubric: [
      'The model matches how users get value and what the app costs to run, with a stated reason.',
      'The price comes from a method (floor, ceiling and neighbours) and the arithmetic is shown, with unknowns marked rather than invented.',
      'The paywall specification states the real charge, renewal, trial terms, restore, a visible close and what happens to the user’s data, and does not use pushy patterns.',
      'Access depends on one verified entitlement, not on a flag saved on the phone.',
      'The numbers sheet defines the metrics and includes a test with a planned sample size and a stopping rule.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The plan is small but complete for its scope, and every unknown is written as a question with a way to find out.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The store setup names the product types, the entitlement and the subscription states the app handles.', 'The ads decision includes the arithmetic and, if ads are used, the consent steps.'] },
      { audience: { min: 'advanced' }, items: ['Policy claims are tied to the stores’ current text, and refunds, revocations and price changes for existing subscribers are considered.', 'The numbers use cohort retention and revenue after the store’s share, and the release checklist blocks an unfair or incomplete paywall.'] },
      { audience: { min: 'professional' }, items: ['The workflow shows the plan and specification in the repository, with tests and review evidence for generated purchase code.'] },
    ],
  },
];

export const appMonetizationCourse: Course = {
  id: 'app-monetization',
  kind: 'standard',
  title: 'App Monetization and Subscriptions',
  level: 'intermediate',
  tagline: 'Choose a money model, set a fair price and build a paywall that respects the people who use your app.',
  description: 'Learn how apps earn money and how to decide for your own app. You will choose a model, work out a price with a method, understand subscriptions and the app stores’ payment rules, design a fair paywall, weigh ads, and read your numbers.',
  finishLine: ['A monetization plan for your app with a first price and its reasoning', 'A paywall design that follows the stores’ transparency rules', 'A short list of numbers you will track and how to compute them'],
  objectives: [
    'Choose a monetization model by matching how users get value to how you charge',
    'Calculate a break-even price and place a price between cost and value',
    'Explain how subscriptions, entitlements and the app stores’ payment systems fit together',
    'Design a paywall that states price, renewal and cancellation honestly',
    'Decide whether ads fit an app and handle consent responsibly',
    'Compute conversion, churn, recurring revenue and lifetime value and read them with care',
  ],
  audiences: ['builder', 'career-changer', 'experienced-dev'],
  skills: [
    { id: 'earning-models', label: 'Choosing a money model' },
    { id: 'pricing-method', label: 'Pricing method' },
    { id: 'product-types', label: 'Subscriptions and purchases' },
    { id: 'paywall-design', label: 'Respectful paywalls' },
    { id: 'store-payments', label: 'App store payments' },
    { id: 'ads-and-consent', label: 'Ads and consent' },
    { id: 'metrics', label: 'Reading your numbers' },
    { id: 'monetization-plan', label: 'Monetization planning' },
  ],
  lessons,
  projects,
  icon: 'payments',
  updated: '2026-11-14',
};
