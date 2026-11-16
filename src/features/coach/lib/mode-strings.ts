/**
 * Tagalog (`fil`) names and descriptions of Tali's modes, by mode id. English lives in `modes.ts` (the three open
 * modes) and in each course's `coachRole` (the course roles); a role's `instructions` are for the model and stay
 * English. Voice and glossary: `docs/i18n/tagalog-style-guide.md`.
 */
export const MODE_TEXT_FIL: Record<string, { label: string; description: string }> = {
  general: { label: 'Career coach', description: 'Ang AI career mo sa tech: ano ang aaralin, ano ang bubuuin, at ano ang susunod na gagawin.' },
  freelancing: { label: 'Freelancing', description: 'Mga client sa Upwork, OnlineJobs.ph at Fiverr, proposal, pricing, contract, at pagkuha ng bayad.' },
  'ai-engineering': { label: 'AI engineering', description: 'Pagtawag sa mga AI model mula sa code, prompts, RAG, agents, pag-test ng mga AI feature, at ang daan papunta sa trabaho bilang AI engineer.' },
  'build-buddy': { label: 'Build buddy', description: 'Hakbang-hakbang na tulong kapag nasira ang app mo: isang maliit na step kada beses, kasama ang eksaktong prompt na ipe-paste mo sa builder mo.' },
  'lesson-planner': { label: 'Lesson plan at rubric', description: 'Dina-draft ni Tali ang mga lesson plan, activity at rubric mula sa topic at level mo, at minamarkahan niya kung ano ang dapat mong i-check.' },
  'mock-interviewer': { label: 'Mock interviewer', description: 'Nagpapatakbo si Tali ng technical at behavioral na mock interview, isang tanong kada beses, na may score at feedback pagkatapos ng bawat sagot.' },
  'code-reviewer': { label: 'Code reviewer', description: 'I-paste ang code o diff at ire-review ito ni Tali na parang senior engineer: tama muna, tapos security, tapos readability.' },
  'proposal-reviewer': { label: 'Proposal reviewer', description: 'I-paste ang proposal o ang pricing ng isang gig at sasabihin ni Tali kung ano ang puputulin, ano ang gagawing personal, at ano ang itatanong.' },
};
