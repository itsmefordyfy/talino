/**
 * Tagalog (`fil`) wording of the "Pick your next course" quiz (`RECOMMEND_QUESTIONS`), by question id. The choices are in
 * the same order as the English ones, so each keeps its course. Voice and glossary: `docs/i18n/tagalog-style-guide.md`.
 */
export const RECOMMEND_QUESTIONS_FIL: Record<string, { prompt: string; choices: readonly string[] }> = {
  want: {
    prompt: 'Ano ang pinakagusto mong mangyari sa susunod na anim na buwan?',
    choices: ['Ang una kong trabaho bilang developer', 'Online income mula sa mga client', 'Manatiling in-demand sa trabaho ko bilang developer', 'Mas mahusay na pagtuturo sa mga estudyante ko', 'Sarili kong app o website'],
  },
  code: {
    prompt: 'Gaano ka na kagaling mag-code ngayon?',
    choices: ['Hindi pa talaga', 'Konti lang, mula sa school o mga tutorial', 'Nagko-code ako bilang trabaho', 'Nagtuturo ako ng coding', 'Sapat na para sa mga simpleng tool at website'],
  },
  day: {
    prompt: 'Saan ka madalas gumugugol ng araw mo sa trabaho?',
    choices: ['Sa school, o naghahanap ng unang trabaho', 'Sa office, BPO, o admin job', 'Sa isang development team', 'Sa classroom', 'Sa sarili kong negosyo o channel'],
  },
  earn: {
    prompt: 'Paano mo gustong kumita?',
    choices: ['Sweldo sa isang tech company', 'Mga client na nahahanap ko online', 'Taas-sweldo o promotion sa kinalalagyan ko ngayon', 'Sa pagtuturo', 'Mula sa sarili kong product'],
  },
  proof: {
    prompt: 'Alin ang pinakamapagmamalaki mong maipakita?',
    choices: ['Tatlong AI project sa GitHub', 'Freelance profile at ang una kong proposal', 'Case study kung gaano ako bumilis magtrabaho', 'Isang AI-ready na lesson module', 'Sarili kong app, live na sa internet'],
  },
};
