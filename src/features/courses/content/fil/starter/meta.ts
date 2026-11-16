import type { Course, Project } from '../../types';

export const starterFilMeta: Pick<Course, 'title' | 'tagline' | 'description' | 'finishLine' | 'skills'> = {
  title: 'AI Basics para sa Tech',
  tagline: 'Pitong maiikling araw para matutunan mong gamitin ang AI nang maayos, ligtas at gamit ang sarili mong judgement.',
  description:
    'Dito ka magsimula, kahit ano pa ang background mo. Sa pitong 15-minutong lesson, malalaman mo kung ano talaga ang AI assistant, paano mag-prompt dito, paano i-check ang mga sagot nito at paano ito gamitin nang ligtas sa trabaho o sa school. Sa huling araw, pipiliin mo ang career path na bagay sa iyo.',
  finishLine: [
    'Kaya mong ipaliwanag sa simpleng salita kung ano ang kaya at hindi kaya ng isang AI assistant.',
    'Nagsusulat ka ng malinaw na prompt na may context, role, halimbawa at constraints, at unti-unti mo itong napapabuti.',
    'Bago mo gamitin ang sagot ng AI, i-check mo muna ito, at alam mo kung ano ang hindi dapat i-paste sa isang tool.',
    'May una ka nang maliit pero totoong gawa na ginawa mo gamit ang AI, at may sarili kang mga pagbabago rito.',
    'Alam mo na kung aling Talino career course ang susunod mong kukunin.',
  ],
  skills: [
    { id: 'ai-fundamentals', label: 'Paano gumagana ang AI' },
    { id: 'prompting', label: 'Prompting' },
    { id: 'verification', label: 'Pag-check ng sagot ng AI' },
    { id: 'responsible-ai', label: 'Ligtas at tapat na paggamit ng AI' },
    { id: 'ai-workflow', label: 'AI sa araw-araw na trabaho' },
    { id: 'career-direction', label: 'Direksyon ng career' },
  ],
};

export const starterFilProjects: Project[] = [
  {
    id: 'starter-p1',
    title: 'Ang una mong mini project na may tulong ng AI',
    summary:
      'Gumamit ng AI assistant para gumawa ng maliit pero totoong bagay na kailangan mo, tulad ng one-page plan, maikling guide o simpleng script. Pagkatapos, ikaw na mismo ang mag-improve nito at magpaliwanag kung ano ang binago mo.',
    outcome:
      'Isang totoong gawa na nagpapakitang kaya mong mag-prompt, mag-check at mag-improve ng output ng AI gamit ang sarili mong judgement.',
    unlockAfterDay: 7,
    steps: [
      {
        id: 'starter-p1-s1',
        text: 'Pumili ng maliit na bagay na talagang kailangan mo: isang one-page na study o work plan, isang maikling how-to guide para sa katrabaho o kaklase, o isang maliit na script na makakatipid sa oras mo.',
      },
      {
        id: 'starter-p1-s2',
        text: 'Sumulat ng buong prompt na may context, role, task, halimbawa o format, at constraints. Gumamit ng pekeng data sa halip na totoong personal o client details.',
      },
      {
        id: 'starter-p1-s3',
        text: 'Pagandahin ang draft gamit ang kahit dalawang follow-up na instruction sa parehong chat.',
      },
      {
        id: 'starter-p1-s4',
        text: 'I-check ito: i-verify ang bawat fact sa totoong source, o i-run ang script at i-test ito gamit ang kahit tatlong input.',
      },
      {
        id: 'starter-p1-s5',
        text: 'I-edit mo mismo ang resulta hanggang sa kaya mo nang ilagay ang pangalan mo rito.',
      },
      {
        id: 'starter-p1-s6',
        text: 'Ilagay ang final version sa Google Doc, GitHub Gist o Notion page na naka-set sa "anyone with the link can view". Sa dulo, magdagdag ng "What I changed" section: ano ang inayos, binawas o dinagdag mo matapos ang draft ng AI, at paano mo ito na-check.',
        link: 'https://gist.github.com',
      },
    ],
    submission: {
      kind: 'url',
      label: 'Link ng project mo',
      placeholder: 'https://docs.google.com/… o https://gist.github.com/…',
      hint: 'Isang link na mabubuksan ng iba, papunta sa final na gawa mo. May "What I changed" section ito sa dulo: ang prompt mo, ang mga binago mo sa draft ng AI at kung paano mo ito na-check.',
    },
    rubric: [
      'Maliit, tapos na at may silbi sa totoong sitwasyon ang gawa.',
      'May context, malinaw na task at constraints ang prompt.',
      'Nakalista sa "What I changed" section ang mga eksaktong edit na ginawa mo matapos ang draft ng AI.',
      'Na-check ang mga fact sa totoong source, o na-run at na-test ang script.',
      'Walang secrets, totoong personal na data o confidential na materyal ng client o kumpanya.',
    ],
  },
];
