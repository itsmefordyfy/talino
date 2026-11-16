import type { Lesson } from '../../types';

export const starterLesson05Fil: Lesson = {
  id: 'starter-05',
  day: 5,
  title: 'AI para sa araw-araw na tech work',
  summary: 'Gamitin ang AI sa pagsusulat, research, mas mabilis na pag-aaral at pag-intindi ng code, sa tulong ng mga prompt na puwede mong gamitin ulit.',
  intro: {
    objectives: [
      'Matukoy ang apat na pang-araw-araw na gamit ng AI: pagsusulat, research, pag-aaral at pag-intindi ng code.',
      'Gamitin ang AI para sa unang draft o outline ng topic, tapos ikaw mismo ang mag-check at mag-edit.',
      'Utusan ang assistant na i-quiz ka, hindi lang basta magpaliwanag.',
      'Basahin ang maikling code at sabihin kung ano ang ipi-print nito.',
    ],
    why: 'Sakop ng apat na gamit na ito ang malaking bahagi ng araw ng isang developer, VA, teacher o first-time builder. Sa ilang prompt na puwede mong gamitin ulit, mas mabilis kang makakasimula sa mga gawain at ikaw pa rin ang may hawak ng resulta.',
  },
  minutes: 15,
  skills: ['ai-workflow', 'prompting', 'responsible-ai'],
  body: [
    {
      type: 'paragraph',
      text: 'Ngayon, gawin nating bahagi ng normal mong araw ang AI. Developer ka man, VA, teacher o kakasimula pa lang gumawa ng unang website, ito rin ang apat na gamit na paulit-ulit mong makikita: pagsusulat, research, pag-aaral at pag-intindi ng code.',
    },
    {
      type: 'table',
      headers: ['Gamit', 'Ano ang ginagawa ng AI', 'Ano ang trabaho mo pa rin'],
      rows: [
        [
          'Pagsusulat',
          'Tinutulungan kang makalampas sa blangkong page gamit ang isang draft.',
          'I-edit para tama ang laman at para ikaw pa rin ang tunog.',
        ],
        [
          'Research',
          'Nag-o-outline ng topic: mga pangunahing idea, key terms, mga tanong na dapat itanong.',
          'Basahin mo mismo ang mga totoong source.',
        ],
        [
          'Pag-aaral',
          'Nagpapaliwanag ayon sa level mo at nagku-quiz sa iyo.',
          'Ikaw mismo ang sasagot sa mga tanong.',
        ],
        [
          'Pag-intindi ng code',
          'Ipinapaliwanag ang isang snippet line by line.',
          'Mag-share lang ng code na pinapayagan kang i-share.',
        ],
      ],
      caption: 'Ang apat na pang-araw-araw na gamit',
    },
    { type: 'heading', text: '1. Pagsusulat' },
    {
      type: 'paragraph',
      text: 'Gamitin ang AI para makalampas sa blangkong page, tapos gawin mong sa iyo ang resulta. Puwede itong gumawa ng draft ng email, status update, documentation at proposal. Laging i-edit para tama ang laman at para ikaw pa rin ang tunog. Napapansin ng mga bumabasa kapag generic ang text na gawa ng AI.',
    },
    {
      type: 'prompt',
      label: 'Status update',
      text: 'Gawin mong maikling status update para sa manager ko ang mga rough notes na ito. Tatlong section: Done, In progress, Blocked. Gamitin mo hangga\'t maaari ang mga salita ko, hindi hihigit sa 120 salita, at huwag kang magdagdag ng hindi ko binanggit. Notes: [i-paste ang notes mo]',
    },
    {
      type: 'paragraph',
      text: 'Kahit ganyan na kalinaw ang instruction, puwede pa ring may mapasok na detalyeng hindi mo naman ibinigay, tulad ng task na nakalagay na "finished" pero sinimulan mo pa lang. Ikumpara ang draft sa notes mo, line by line, burahin ang anumang wala sa notes, at tandaan na ikaw ang mananagot sa bawat pangungusap na ipapadala mo.',
    },
    { type: 'heading', text: '2. Research' },
    {
      type: 'paragraph',
      text: 'Magaling ang AI sa mabilis na pag-outline ng isang topic: ang mga pangunahing idea, ang key terms, ang mga tanong na dapat itanong. Gamitin ito para planuhin ang research mo, tapos basahin ang mga totoong source. May mga assistant na may web search at nakakapagbigay ng link sa mga source, pero ikaw pa rin ang magbubukas at magbabasa ng mga iyon.',
    },
    { type: 'heading', text: '3. Pag-aaral' },
    {
      type: 'paragraph',
      text: 'Humingi ng paliwanag na akma sa level mo, tapos ipa-quiz ka. Tumatatak ang natutunan kapag ikaw mismo ang sumasagot sa mga tanong, hindi kapag nagbasa ka lang.',
    },
    {
      type: 'prompt',
      label: 'Tutor mode',
      text: 'Ituro mo sa akin kung ano ang Git branches, na parang beginner pa lang ako. Gumamit ka ng maikling halimbawa. Pagkatapos, magtanong ka ng tatlong tanong, isa-isa, at hintayin mo ang sagot ko bago ka magbigay ng feedback. Huwag mong ibigay ang mga sagot hangga\'t hindi ako sumusubok.',
    },
    { type: 'heading', text: '4. Pag-intindi ng code' },
    {
      type: 'paragraph',
      text: 'I-paste ang snippet na pinapayagan kang i-share at itanong kung ano ang ginagawa nito, line by line. Malaking tulong ito sa mga estudyante, sa mga developer na nagbabasa ng lumang codebase, at sa mga builder na gustong intindihin ang ginawa ng isang vibe-coding tool.',
    },
    {
      type: 'code',
      language: 'javascript',
      label: 'Subukang ipaliwanag ito',
      code: `const prices = [120, 85, 300, 45];
const total = prices
  .filter((p) => p >= 50)
  .reduce((sum, p) => sum + p, 0);
console.log(\`Total of items 50 pesos and up: \${total}\`);`,
    },
    {
      type: 'paragraph',
      text: 'Kaya mo itong basahin nang mag-isa. Pinapanatili ng `filter` ang mga presyong pumasa sa test, dito ay 50 pataas, kaya natatanggal ang 45. Pagkatapos, `reduce` ang nagdadagdag ng lahat ng natira, simula sa 0. Intindihin mo muna ito bago magtanong sa assistant. Pagkatapos, gamitin ang assistant para kumpirmahin kung tama ang pagkaintindi mo at para ipaliwanag ang anumang line na hindi mo nasundan.',
    },
    {
      type: 'prompt',
      label: 'Ipaliwanag ang code',
      text: 'Ipaliwanag mo ang code na ito line by line para sa taong may alam sa basic programming. Pagkatapos, sabihin mo kung ano ang ipi-print nito, at isang paraan kung paano ito puwedeng pumalpak. [i-paste ang code]',
    },
    {
      type: 'activity',
      activity: {
        id: 'starter-05-scenario-1',
        kind: 'scenario',
        title: 'Ang linyang hindi mo isinulat',
        prompt: 'Ano ang dapat mong gawin sa draft?',
        concept: 'checking ai drafts',
        conceptLabel: 'pag-check sa mga draft ng AI',
        situation: 'Pinagawa mo sa isang assistant ng status update ang notes mo. Maayos ang basa ng draft, pero may nakalagay na "Finished the payment tests" na wala naman sa notes mo.',
        options: [
          {
            text: 'I-send na. Maayos ang tunog ng draft at nakatipid ka pa sa oras.',
            consequence: 'Ngayon, akala ng manager mo na tapos na ang mga test na hindi mo naman nabanggit. Ikaw ang mananagot sa anumang ipapadala mo.',
            quality: 'poor',
          },
          {
            text: 'Burahin ang line na iyon, at i-check kung tugma sa notes mo ang bawat iba pang pangungusap.',
            consequence: 'Ang update mo ay nagsasabi lang ng ginawa mo talaga, at ang pag-check sa iba pang pangungusap ay nakakahuli ng iba pang naidagdag.',
            quality: 'best',
          },
          {
            text: 'Tanungin ang assistant ng "Sigurado ka ba?" at panatilihin ang linya kung oo ang sagot nito.',
            consequence: 'Hindi pag-check ang pagtatanong ulit. Ang tanging mapagkakatiwalaang source dito ay ang sarili mong notes.',
            quality: 'poor',
          },
        ],
        hints: [
          'Ikumpara ang draft sa talagang isinulat mo.',
          'Puwedeng magdagdag ang draft ng AI ng mga bagay na hindi mo sinabi.',
          'Ikaw ang mananagot sa ipapadala mo, kaya dapat tugma sa notes mo ang bawat sinasabi.',
        ],
        explanation: 'Kasing-totoo lang ng notes mo ang draft. Dapat tama ang mga detalye, at ang sinasabi lang ng update ay ang talagang ginawa mo.',
      },
    },
    {
      type: 'tip',
      text: 'I-save mo sa isang note ang mga prompt na gumagana para sa iyo. Makakatipid ka ng oras linggu-linggo sa sarili mong prompt library.',
    },
    {
      type: 'warning',
      text: 'Bago ka mag-paste ng work code o documents, alalahanin ang Day 4: ang pinapayagan lang na i-share, at sa tool lang na pinapayagan kang gamitin.',
    },
    {
      type: 'takeaways',
      items: [
        'Apat ang pang-araw-araw na gamit: pagsusulat, research, pag-aaral at pag-intindi ng code.',
        'Gamitin ang AI para sa unang draft o sa outline ng topic, tapos gawin mong sa iyo ang resulta at i-check ito.',
        'Ipa-quiz ka sa assistant; ang pagsagot mo mismo sa mga tanong ang paraan para tumatak ang natutunan.',
        'I-save ang mga prompt na gumagana sa isang personal na prompt library.',
        'Mag-paste lang ng pinapayagan kang i-share, sa tool na pinapayagan kang gamitin.',
      ],
    },
  ],
  quiz: [
    {
      id: 'starter-05-q1',
      prompt: 'Ano ang pinakamagandang paraan ng paggamit ng AI sa research?',
      choices: [
        'Gamitin ito para i-outline ang topic at malaman kung ano ang babasahin, tapos basahin ang mga totoong source',
        'Kopyahin ang sagot nito bilang final na research',
        'Huwag itong gamitin sa research',
      ],
      answer: 0,
      explanation:
        'Mabilis ang AI mag-outline ng topic, pero ang mga fact ay dapat galing sa mga source na ikaw mismo ang nakabasa.',
    },
    {
      id: 'starter-05-q2',
      prompt: 'Bakit dapat mong ipa-quiz sa AI ang sarili mo, at hindi lang ipapaliwanag ang topic?',
      choices: [
        'Mas kaunti ang tokens na nagagamit ng mga quiz',
        'Nakakatulong sa pag-alala at nakikita mo kung ano pa ang hindi mo alam kapag ikaw mismo ang sumasagot',
        'Mas magaling magpaliwanag ang AI kapag nagtatanong ito',
        'Tuluyan nitong napipigilan ang hallucination',
      ],
      answer: 1,
      explanation:
        'Ang active recall, ibig sabihin ay pagsagot mula sa alaala, ay isa sa mga pinakamaaasahang paraan ng pag-aaral.',
    },
    {
      id: 'starter-05-q3',
      prompt: 'Sa JavaScript na halimbawa, ano ang ipi-print ng code?',
      choices: [
        'Total of items 50 pesos and up: 550',
        'Total of items 50 pesos and up: 465',
        'Total of items 50 pesos and up: 505',
      ],
      answer: 2,
      explanation:
        'Naiiwan ang 120, 85 at 300 pagkatapos ng filter (natatanggal ang 45), at 120 + 85 + 300 = 505.',
    },
    {
      id: 'starter-05-q4',
      prompt: 'Ano ang dapat mong gawin sa email na ginawa ng AI bago mo ito i-send?',
      choices: [
        'I-send na lang ito nang walang binabago, dahil perpekto naman ang grammar ng AI',
        'Dagdagan ang subject ng "Sent by AI"',
        'Paikliin ito sa isang linya',
        'I-check ang bawat fact at i-edit para ikaw pa rin ang tunog',
      ],
      answer: 3,
      explanation:
        'Ikaw ang mananagot sa ipinapadala mo. Dapat tama ang mga fact, at ang sarili mong boses ang pumipigil para hindi ito magmukhang generic.',
    },
  ],
  task: {
    title: 'Simulan ang prompt library mo',
    minutes: 15,
    steps: [
      'Pumili ng dalawa sa apat na gamit na pinakabagay sa trabaho mo (pagsusulat, research, pag-aaral, code).',
      'Gumamit ng isang prompt mula sa lesson na ito para sa bawat isa, sa totoong gawain, at ibagay ang mga nasa bracket sa sitwasyon mo.',
      'I-edit ang mga resulta hanggang sa puwede mo na talagang gamitin ang mga ito.',
      'I-save ang dalawang prompt sa isang note na may pangalang "My prompts", kasama ang isang linya kung kailan gagamitin ang bawat isa.',
    ],
  },
};
