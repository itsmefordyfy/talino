import { defineStrings } from '@/lib/i18n';

// Owner rule (2026-11-15): no Filipino is written, so `fil` is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of
// strings-parity.test.ts and in PENDING_TRANSLATION of registry-fil.test.ts.
const en = {
  workbench: {
    title: 'Architecture diagram workbench',
    summary: 'Write a C4, sequence, data-flow or ER diagram as text, draw it, edit it, copy the source and keep it for your project.',
    description: 'Pick a starting diagram or write your own as Mermaid text, including C4 context, container and component views. The diagram is drawn as you edit, mistakes are explained line by line, and you can copy the source, save the diagram on this phone or compare two versions side by side.',
    topics: ['architecture', 'diagram', 'c4', 'context diagram', 'container diagram', 'component diagram', 'sequence diagram', 'data flow', 'mermaid', 'diagram as code', 'uml'],
  },
  tradeoff: {
    title: 'Trade-off matrix',
    summary: 'Weigh two or more architecture options against the qualities that matter to you, and see where the answer is close.',
    description: 'Name the options, set how much each quality matters, and score each option from one to five. Weighted totals are shown with the margin between the options, and a close result says so instead of declaring a winner. Your matrix can be saved on this phone.',
    topics: ['architecture', 'trade-off', 'decision matrix', 'weighted scoring', 'quality attributes', 'compare options', 'alternatives', 'microservices', 'monolith'],
  },
  adr: {
    title: 'Architecture decision record builder',
    summary: 'Write an ADR from your own reasoning: context, options, decision and consequences, checked by simple rules and saved on this phone.',
    description: 'Fill in the title, status, context, options considered, the decision and its consequences. The builder checks for what a useful record needs (at least two real options, a reason, a cost you accept), writes it as Markdown you can copy, and keeps your records on this phone.',
    topics: ['adr', 'architecture decision record', 'decision', 'documentation', 'trade-off', 'consequences', 'markdown', 'architecture'],
  },
  assistant: {
    title: 'Architecture assistant',
    summary: 'Describe an application, choose what you want from the assistant, and open a coaching chat that starts from your description.',
    description: 'Describe your application in a few lines, pick a request such as requirements analysis, component decomposition or a security review, and open Tali with a ready prompt. The assistant states its assumptions, asks for missing information and explains its reasoning. Its answers are drafts to check, not guarantees.',
    topics: ['architecture assistant', 'requirements analysis', 'architecture recommendation', 'component decomposition', 'database design', 'api design', 'security review', 'scalability', 'cost', 'trade-offs', 'tali'],
  },
};

export const architectureVisualStrings = defineStrings({ en, fil: en });
