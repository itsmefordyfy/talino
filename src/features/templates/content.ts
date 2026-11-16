import type { MaterialSymbolName } from '@/components/ui/material-symbols';

/**
 * The ready-to-use templates (the business plan: "LinkedIn, proposal and cover-letter templates",
 * filled from the profile, with Copy). `{{name}}`-style placeholders Talino knows are filled in
 * (lib/fill.ts); any other placeholder (`{{company}}`) stays as a bracketed blank for the learner.
 * Written by Claude, 2026-11-13; English, like the documents employers and clients read.
 */
export const TEMPLATE_GROUPS = ['profile', 'job', 'freelance'] as const;
export type TemplateGroup = (typeof TEMPLATE_GROUPS)[number];

export type TemplateDefinition = {
  id: string;
  /** Where it sits on the list: your profile, finding a job, or working with clients. */
  group: TemplateGroup;
  title: string;
  /** One line on the list: when to use it. */
  description: string;
  icon: MaterialSymbolName;
  /** Which of Tali's specialties improves it. */
  coachMode: 'freelancing' | 'general';
  /** What it is, inside "Improve this … for me". */
  kind: string;
  /** What to tell Tali before she writes it (the placeholder of the notes box): the one thing that makes this message specific. */
  aiHint: string;
  body: string;
};

export const TEMPLATES: readonly TemplateDefinition[] = [
  {
    id: 'linkedin-headline',
    group: 'profile',
    title: 'LinkedIn headline',
    description: 'The line under your name: what you do and what you’re good at.',
    icon: 'badge',
    coachMode: 'general',
    kind: 'LinkedIn headline',
    aiHint: 'What you do, who you help, and anything you want to be found for',
    body: '{{headline}} | {{skills}} | Building with AI',
  },
  {
    id: 'linkedin-about',
    group: 'profile',
    title: 'LinkedIn About',
    description: 'Your story in a few short paragraphs, ending with how to reach you.',
    icon: 'person',
    coachMode: 'general',
    kind: 'LinkedIn About section',
    aiHint: 'What you want next, a project you are proud of, how you work',
    body: `Hi, I’m {{name}}, {{headline}}.

I work with {{skills}}, and I use AI tools every day to build faster without cutting corners: I check what they write, test it and keep it maintainable.

Recently I built {{topProject}} ({{topProjectLink}}) as part of {{course}} on Talino.

I’m looking for {{whatYouWant}}. You can see my work at {{portfolioLink}}, or message me here.`,
  },
  {
    id: 'upwork-proposal',
    group: 'freelance',
    title: 'Upwork proposal',
    description: 'A short, specific reply to one job post. Clients skim; lead with their problem.',
    icon: 'send',
    coachMode: 'freelancing',
    kind: 'Upwork proposal',
    aiHint: 'Paste the job post, or what the client asked for',
    body: `Hi {{clientName}},

You need {{whatTheClientNeeds}}. I can do this, and here’s how I’d start: {{firstStep}}.

A similar piece of work: {{topProject}} ({{topProjectLink}}). I work with {{skills}}.

I can deliver the first version by {{deliveryDate}} and keep you updated along the way. One question so I scope it right: {{questionForTheClient}}

Thanks,
{{name}}
{{portfolioLink}}`,
  },
  {
    id: 'onlinejobs-application',
    group: 'job',
    title: 'OnlineJobs.ph application',
    description: 'For a remote job post: who you are, proof you can do it, and when you can start.',
    icon: 'work',
    coachMode: 'freelancing',
    kind: 'OnlineJobs.ph application',
    aiHint: 'Paste the job post, plus any experience you want to mention',
    body: `Subject: Application for {{jobTitle}} – {{name}}

Hello {{employerName}},

I’m applying for your {{jobTitle}} post. I’m {{headline}}, and I work with {{skills}}.

What I can bring to this role:
- {{relevantExperience}}
- I built {{topProject}}: {{topProjectLink}}
- I finished {{course}} on Talino, so I use AI tools to work faster and check the results carefully.

I can work {{hoursAndTimeZone}} and can start {{startDate}}. My portfolio: {{portfolioLink}}

Thank you for your time,
{{name}}`,
  },
  {
    id: 'cover-letter',
    group: 'job',
    title: 'Cover letter',
    description: 'One page for a job application: why this role, and the proof you can do it.',
    icon: 'description',
    coachMode: 'general',
    kind: 'cover letter',
    aiHint: 'Paste the job post, and why you want this role or company',
    body: `Dear {{hiringManager}},

I’m writing to apply for the {{role}} position at {{company}}. I’m {{headline}}, and {{whyThisCompany}}.

I work with {{skills}}. Most recently I built {{topProject}} ({{topProjectLink}}) during {{course}} on Talino, where my work was reviewed against real project requirements.

In this role I would {{whatYouWouldDo}}. I’d welcome the chance to talk about how I can help your team.

You can see more of my work at {{portfolioLink}}.

Sincerely,
{{name}}`,
  },
  {
    id: 'follow-up-email',
    group: 'job',
    title: 'Follow-up after applying',
    description: 'A polite nudge about a week after you applied.',
    icon: 'mail',
    coachMode: 'general',
    kind: 'follow-up email',
    aiHint: 'Who you applied to, when, and anything new you have done since',
    body: `Subject: Following up on my application for {{role}}

Hi {{hiringManager}},

I applied for the {{role}} position at {{company}} on {{dateApplied}} and wanted to check in. I’m still very interested in the role.

Since applying I’ve {{somethingNew}}. My portfolio is at {{portfolioLink}} if it’s helpful.

Is there anything else I can send you?

Best regards,
{{name}}`,
  },
  {
    id: 'thank-you',
    group: 'job',
    title: 'Thank-you after an interview',
    description: 'Send it the same day: thanks, one thing you discussed, and your interest.',
    icon: 'favorite',
    coachMode: 'general',
    kind: 'thank-you note after an interview',
    aiHint: 'Who interviewed you and one thing you talked about',
    body: `Subject: Thank you – {{role}} interview

Hi {{interviewer}},

Thank you for talking with me today about the {{role}} role at {{company}}. I enjoyed hearing about {{topicDiscussed}}.

Our conversation made me even more interested in the role. If it helps, here’s an example of my work: {{topProject}} ({{topProjectLink}}).

I look forward to hearing from you.

Best regards,
{{name}}`,
  },
  {
    id: 'tell-me-about-yourself',
    group: 'profile',
    title: 'Tell me about yourself',
    description: 'A 30-second answer for the first interview question, or for any introduction.',
    icon: 'record_voice_over',
    coachMode: 'general',
    kind: 'spoken answer to “Tell me about yourself”',
    aiHint: 'The role you are interviewing for, and one thing you want them to remember',
    body: `I’m {{name}}, {{headline}}.

I work with {{skills}}, and lately I’ve been building {{topProject}} as part of {{course}} on Talino.

What I enjoy most is {{whatYouEnjoy}}. I’m looking for {{whatYouWant}}, and that’s why this {{role}} role caught my eye.`,
  },
  {
    id: 'linkedin-project-post',
    group: 'profile',
    title: 'LinkedIn post about a project',
    description: 'Share something you built: what it does, what you learned, and where to see it.',
    icon: 'campaign',
    coachMode: 'general',
    kind: 'LinkedIn post about a project',
    aiHint: 'What the project does, what was hard, and what you learned',
    body: `I just finished {{topProject}}.

It {{whatItDoes}}. I built it with {{skills}} while taking {{course}} on Talino.

The hardest part was {{whatWasHard}}. What I learned: {{whatYouLearned}}.

You can see it here: {{topProjectLink}}

If you work on something similar, I’d love to hear how you approach it. – {{name}}`,
  },
  {
    id: 'recruiter-outreach',
    group: 'job',
    title: 'Message a recruiter or hiring manager',
    description: 'A short first message on LinkedIn: who you are, the role, and one proof of your work.',
    icon: 'forum',
    coachMode: 'general',
    kind: 'first message to a recruiter or hiring manager',
    aiHint: 'The role or company, and how you found them or the post',
    body: `Hi {{hiringManager}},

I’m {{name}}, {{headline}}. I saw the {{role}} role at {{company}} and I’d like to be considered.

I work with {{skills}}. One thing I built: {{topProject}} ({{topProjectLink}}).

Could I send my résumé, or is there a better way to apply? Thank you for your time.`,
  },
  {
    id: 'referral-request',
    group: 'job',
    title: 'Ask for a referral',
    description: 'Ask someone you know at a company to refer you, in a way that is easy to say yes to.',
    icon: 'group_add',
    coachMode: 'general',
    kind: 'referral request',
    aiHint: 'Who the person is, how you know them, and the role you want',
    body: `Hi {{contactName}},

I hope you’re doing well. I’m applying for the {{role}} role at {{company}} ({{jobLink}}), and I’d be grateful for a referral if you feel comfortable giving one.

A quick summary so you don’t have to guess: I’m {{headline}}, I work with {{skills}}, and my best recent work is {{topProject}} ({{topProjectLink}}).

No pressure at all, and thank you for reading this. – {{name}}`,
  },
  {
    id: 'coffee-chat',
    group: 'job',
    title: 'Ask for a 15-minute chat',
    description: 'Ask someone in a role you want to share how they got there. Short, specific, easy to accept.',
    icon: 'coffee',
    coachMode: 'general',
    kind: 'request for a short career chat',
    aiHint: 'Who they are, what you admire about their work, and one thing you want to ask',
    body: `Hi {{contactName}},

I’m {{name}}, {{headline}}. I came across your work on {{whatYouNoticed}} and it’s the kind of work I want to do.

Would you have 15 minutes for a quick chat, online or by message? I’d like to ask {{yourQuestion}}.

If you’re too busy, I understand. Thanks for considering it.`,
  },
  {
    id: 'offer-negotiation',
    group: 'job',
    title: 'Reply to a job offer',
    description: 'Thank them, then ask for what you need (pay, start date, hours) clearly and politely.',
    icon: 'handshake',
    coachMode: 'general',
    kind: 'reply to a job offer',
    aiHint: 'The offer you got, what you would like changed, and why',
    body: `Subject: Re: Offer for {{role}}

Hi {{hiringManager}},

Thank you for the offer for the {{role}} role at {{company}}. I’m excited about the team and the work.

Before I accept, I’d like to ask about {{whatYouWantToAsk}}. {{yourReason}}

I’m happy to talk it through, and I’d like to be able to give you an answer by {{replyDate}}.

Thank you again,
{{name}}`,
  },
  {
    id: 'fiverr-gig',
    group: 'freelance',
    title: 'Fiverr gig description',
    description: 'Describe one clear service: what the buyer gets, how it works, and what you need from them.',
    icon: 'storefront',
    coachMode: 'freelancing',
    kind: 'Fiverr gig description',
    aiHint: 'The one service you offer, who it is for, and how long it takes',
    body: `I’m {{name}}, {{headline}}. I’ll {{theService}} for you.

What you get:
- {{deliverableOne}}
- {{deliverableTwo}}
- {{revisions}} revisions so it’s right

I work with {{skills}}. Here’s a recent example: {{topProject}} ({{topProjectLink}}).

To start, send me {{whatYouNeedFromTheBuyer}}. I usually deliver in {{deliveryTime}}.

Message me before ordering if you’re not sure it fits. I’m happy to say so honestly.`,
  },
  {
    id: 'rate-reply',
    group: 'freelance',
    title: 'Reply to “What’s your rate?”',
    description: 'Answer a client’s price question without undercharging or scaring them off.',
    icon: 'payments',
    coachMode: 'freelancing',
    kind: 'reply to a client asking for my rate',
    aiHint: 'What the client wants done, and the price or range you have in mind',
    body: `Hi {{clientName}},

Thanks for asking. For {{theProject}}, my price is {{price}}, which includes {{whatIsIncluded}}.

That’s based on {{howYouPriced}}. If your budget is different, tell me what matters most and I can suggest what to adjust.

I can start on {{startDate}}. Would you like me to send a short proposal?

{{name}}`,
  },
  {
    id: 'client-update',
    group: 'freelance',
    title: 'Progress update to a client',
    description: 'A short update that shows progress, flags problems early and says what you need.',
    icon: 'update',
    coachMode: 'freelancing',
    kind: 'progress update to a client',
    aiHint: 'What is done, what is next, and anything blocking you',
    body: `Hi {{clientName}},

Quick update on {{theProject}}:

Done: {{whatIsDone}}
Next: {{whatIsNext}}
I need from you: {{whatYouNeed}}

{{anyRisk}}

I’m on track to finish by {{deliveryDate}}. Tell me if anything should change.

{{name}}`,
  },
  {
    id: 'scope-change',
    group: 'freelance',
    title: 'Extra work request',
    description: 'A client asks for more than agreed. Say yes kindly, and be clear about the cost and time.',
    icon: 'rule',
    coachMode: 'freelancing',
    kind: 'reply to a client asking for extra work',
    aiHint: 'What was agreed, what they are now asking for, and what it would cost or delay',
    body: `Hi {{clientName}},

Thanks for the idea. {{whatTheyAsked}} wasn’t part of what we agreed ({{whatWasAgreed}}), but I can add it.

It would add {{extraCost}} and move the delivery to {{newDate}}. If you’d rather keep the original date and price, I can do it after this version is delivered.

Which would you prefer?

{{name}}`,
  },
  {
    id: 'payment-reminder',
    group: 'freelance',
    title: 'Payment reminder',
    description: 'A polite, firm reminder when an invoice is late.',
    icon: 'request_quote',
    coachMode: 'freelancing',
    kind: 'payment reminder for a late invoice',
    aiHint: 'The invoice number, the amount and how late it is',
    body: `Subject: Invoice {{invoiceNumber}} – reminder

Hi {{clientName}},

A friendly reminder that invoice {{invoiceNumber}} for {{amount}} was due on {{dueDate}}. I haven’t seen the payment yet.

You can pay by {{paymentMethod}}. If it’s already sent, please share the reference so I can check on my side.

If there’s a problem with the invoice, tell me and I’ll fix it right away. Thank you.

{{name}}`,
  },
  {
    id: 'testimonial-request',
    group: 'freelance',
    title: 'Ask a client for a review',
    description: 'After a job goes well, ask for a short review. Make it easy by saying what to mention.',
    icon: 'star',
    coachMode: 'freelancing',
    kind: 'request for a client review',
    aiHint: 'What you did for them and one thing they said they liked',
    body: `Hi {{clientName}},

Thank you for working with me on {{theProject}}. I enjoyed it, and I’m glad {{whatWentWell}}.

If you’re happy with the result, would you write two or three sentences about what we did and how it went? It helps me a lot as I take on new clients, and you can post it {{whereToPost}}.

Thanks again,
{{name}}`,
  },
];

export function getTemplate(id: string | undefined): TemplateDefinition | undefined {
  return TEMPLATES.find((template) => template.id === id);
}

export function templatesInGroup(group: TemplateGroup, templates: readonly TemplateDefinition[] = TEMPLATES): TemplateDefinition[] {
  return templates.filter((template) => template.group === group);
}
