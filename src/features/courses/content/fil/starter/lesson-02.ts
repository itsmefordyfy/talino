import type { Lesson } from '../../types';

export const starterLesson02Fil: Lesson = {
  id: 'starter-02',
  day: 2,
  title: 'Paano mag-prompt nang maayos',
  summary: 'Magbigay ng context, role, halimbawa at constraints, tapos pagandahin ang sagot nang paunti-unti.',
  intro: {
    objectives: [
      'Sumulat ng prompt na may context, role, task, halimbawa at constraints.',
      'Ayusin ang halos tamang sagot gamit ang mga follow-up sa parehong chat, sa halip na magsimula ulit.',
      'Ipa-interview ka sa assistant kapag hindi ka sigurado kung anong impormasyon ang kailangan nito.',
    ],
    why: 'Generic na sagot ang ibibigay ng malabong prompt, at kailangan mo pa itong ayusin. Kapag sinabi mo sa prompt kung sino ka, sino ang babasa ng resulta at ano ang kailangan mo, makakatipid ka sa ilang beses na pagsusulat ulit, kahit sa paghahanap ng trabaho, sa mismong trabaho o sa school.',
  },
  minutes: 15,
  skills: ['prompting'],
  body: [
    {
      type: 'paragraph',
      text: 'Karamihan ng pangit na sagot ng AI ay dahil sa maikli at malabong prompt. Kapag "Sumulat ng cover letter" lang ang sinabi mo, generic na letter ang makukuha mo. Hindi nababasa ng assistant ang isip mo, kaya nakadepende ang kalidad ng sagot sa kung ano ang ibinigay mo.',
    },
    { type: 'heading', text: 'Ang limang bahagi ng mabisang prompt' },
    {
      type: 'list',
      ordered: true,
      items: [
        '**Context:** sino ka, ano ang sitwasyon, at sino ang babasa ng resulta.',
        '**Role:** ang expert na gusto mong gampanan nito, tulad ng "isang senior recruiter" o "isang matiyagang Python tutor".',
        '**Task:** eksakto kung ano ang gusto mong gawin nito, gamit ang malinaw na verb: mag-draft, magpaliwanag, mag-compare, maglista, mag-ayos.',
        '**Halimbawa:** sample ng istilo o format na gusto mo. Mas mabisa ang isang magandang halimbawa kaysa sa isang buong paragraph na paglalarawan.',
        '**Constraints:** haba, tono, format, ano ang iiwasan, at ano ang gagawin kapag hindi ito sigurado.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Hindi mo kailangan ang lahat ng lima sa bawat pagkakataon. Sa mabilis na tanong, sapat na ang context at malinaw na task. Pero kung gagamitin mo talaga ang sagot, isama ang lahat.',
    },
    {
      type: 'activity',
      activity: {
        id: 'starter-02-match-1',
        kind: 'match',
        title: 'Hanapin ang mga bahagi sa totoong prompt',
        prompt: 'Galing ang mga linyang ito sa iisang prompt na isinulat ng isang job seeker. I-match ang bawat linya sa bahagi ng mabisang prompt na kinakatawan nito.',
        concept: 'prompt structure',
        conceptLabel: 'istruktura ng prompt',
        labels: { terms: 'Mga linya mula sa prompt', meanings: 'Bahagi ng prompt' },
        pairs: [
          {
            term: 'Nurse ako na lilipat sa healthcare account sa isang BPO. Ang babasa nito ay isang hiring manager sa Cebu.',
            definition: 'Context',
          },
          {
            term: 'Ikaw ay isang career coach na sampung taon nang nagha-hire ng mga call center agent.',
            definition: 'Role',
          },
          {
            term: 'Mag-draft ng tatlong resume bullet point tungkol sa pag-handle ng mga tawag ng mga pasyente.',
            definition: 'Task',
          },
          {
            term: 'Ganito ang bullet na gusto ko: "Answered patient questions by phone and logged every call the same day."',
            definition: 'Halimbawa',
          },
          {
            term: 'Dapat wala pang 20 salita ang bawat bullet. Iwasan ang mga buzzword, at sabihin mo sa akin kung may hindi malinaw sa ibinigay ko.',
            definition: 'Constraints',
          },
        ],
        hints: [
          'Itanong sa bawat linya: tungkol ba ito sa akin, sa kung sino ang magiging AI, sa ipapagawa, sa sample, o sa limitasyon?',
          'Ang linyang may malinaw na verb (mag-draft) ang task; ang linyang nagsisimula sa "Ikaw ay isang" ang nagbibigay ng role sa AI.',
          'Ang sample ng istilong gusto mo ay halimbawa; ang limitasyon sa dami ng salita at ang "sabihin mo kung hindi malinaw" ay mga constraint.',
        ],
        explanation: 'Ang kung sino ka at kung sino ang babasa ay context, ang "Ikaw ay isang" ang nagtatakda ng role, ang malinaw na verb ang task, ang sample na bullet ay halimbawa, at ang limitasyon sa salita, ang pag-iwas sa buzzword at ang "sabihin mo kung hindi malinaw" ay mga constraint.',
      },
    },
    { type: 'heading', text: 'Bago at pagkatapos' },
    {
      type: 'paragraph',
      text: 'Mahina: "Ipaliwanag ang mga API." Mas mabisa: ang prompt sa ibaba. Pansinin kung paano nito sinasabi kung sino ang babasa, gaano kahaba ang sagot at anong format ang gagamitin.',
    },
    {
      type: 'prompt',
      label: 'Isang kumpletong prompt',
      text: 'Ikaw ay isang friendly na IT instructor. Fresh graduate ako sa Pilipinas at naghahanda para sa una kong developer interview. Ipaliwanag mo kung ano ang API sa wala pang 150 salita, gamit ang isang GCash payment bilang halimbawa. Pagkatapos, bigyan mo ako ng dalawang interview question tungkol sa mga API, na may maikling model answer ang bawat isa. Gumamit ng simpleng Taglish. Kung may bagay na nakadepende sa kumpanya, sabihin mo iyon sa halip na manghula.',
    },
    {
      type: 'table',
      headers: ['Bahagi', 'Sa kumpletong prompt sa itaas'],
      rows: [
        [
          'Context',
          'Isang fresh graduate sa Pilipinas na naghahanda para sa unang developer interview.',
        ],
        ['Role', 'Isang friendly na IT instructor.'],
        [
          'Task',
          'Ipaliwanag kung ano ang API, tapos magbigay ng dalawang interview question na may maiikling model answer.',
        ],
        ['Halimbawa', 'Humihingi ng konkretong halimbawa sa sagot: isang GCash payment.'],
        [
          'Constraints',
          'Wala pang 150 salita, simpleng Taglish, at sabihin kapag may nakadepende sa kumpanya sa halip na manghula.',
        ],
      ],
      caption: 'Ang limang bahagi na makikita sa kumpletong prompt sa itaas',
    },
    { type: 'heading', text: 'Mag-iterate, huwag magsimula ulit' },
    {
      type: 'paragraph',
      text: 'Draft din ang una mong prompt. Basahin ang sagot, tapos gabayan ito ng mga follow-up: "Paikliin mo." "Gumamit ka ng table." "Masyadong technical ang halimbawa mo para sa hindi taga-IT." "Akala mo Windows ang gamit ko, pero Mac ang gamit ko." Nakabatay ang bawat follow-up sa buong conversation, kaya papalapit nang papalapit ang sagot sa gusto mo sa bawat turn.',
    },
    {
      type: 'activity',
      activity: {
        id: 'starter-02-scenario-1',
        kind: 'scenario',
        title: 'Malapit na, pero hindi pa',
        prompt: 'Piliin ang pinakamagandang paraan para maayos ang halos tamang draft hanggang sa maging tama ito.',
        concept: 'prompt iteration',
        conceptLabel: 'pag-iterate sa prompt',
        situation: 'Nagpa-draft ka sa assistant ng mensahe para sa team lead mo. Maganda ang draft, pero humihingi ito ng isang buong araw na leave, at Biyernes ng umaga lang ang kailangan mo.',
        options: [
          {
            text: 'Magbukas ng bagong chat at i-type ulit ang buong prompt, kasama na ang pagtatama.',
            consequence: 'Gagana naman, pero nasasayang ang context na nabuo na sa chat na ito, at kailangan mo itong buuin ulit.',
            quality: 'poor',
          },
          {
            text: 'Mag-reply sa parehong chat: "Biyernes ng umaga lang ang kailangan ko. Palitan mo at gawing wala pang 80 salita."',
            consequence: 'Alam pa rin ng assistant ang naunang context, kaya sapat na ang isang maikling follow-up para maitama ang draft.',
            quality: 'best',
          },
          {
            text: 'I-copy ang draft at ayusin ang mga detalye nang mano-mano.',
            consequence: 'Makukuha mo ang kailangan mo, pero hindi mo nagagamit ang mabilis na paggabay na puwede sa parehong chat.',
            quality: 'acceptable',
          },
        ],
        hints: [
          'Isipin kung ano na ang alam ng chat.',
          'Draft din ang unang prompt.',
          'Ang maikling follow-up sa parehong conversation ay nakabatay sa lahat ng nasabi na.',
        ],
        explanation: 'Nananatili ang context kapag nag-iterate ka sa parehong conversation, kaya papalapit nang papalapit ang draft sa gusto mo sa bawat maikling follow-up. Nasasayang naman ang context na iyon kapag nagsimula ka ulit.',
      },
    },
    {
      type: 'tip',
      text: 'Ipatanong mo muna sa assistant. Madalas, nakakatipid ng ilang ikot ang pagdagdag ng "Bago ka sumagot, magtanong ka ng hanggang tatlong tanong tungkol sa anumang hindi malinaw."',
    },
    {
      type: 'prompt',
      label: 'Ipa-interview ka sa kanya',
      text: 'Kailangan ko ng tulong sa pagsulat ng maikling mensahe sa team lead ko para humingi ng isang araw na leave sa susunod na linggo. Bago ka magsulat ng kahit ano, magtanong ka ng hanggang tatlong tanong tungkol sa mga bagay na kailangan mong malaman. Pagkatapos, isulat mo ang mensahe sa magalang at propesyonal na tono, wala pang 80 salita.',
    },
    {
      type: 'warning',
      text: 'Okay lang ang mahahabang prompt, pero huwag maglagay ng mga pribadong detalye. Sa Day 4, malalaman mo kung ano mismo ang hindi dapat isama.',
    },
    {
      type: 'takeaways',
      items: [
        'Ang maikli at malabong prompt ay nagbibigay ng generic na sagot. Nakadepende ang kalidad sa ibinibigay mo.',
        'Ang mabisang prompt ay may context, role, task, halimbawa at constraints; sa mabilis na tanong, sapat na ang context at task.',
        'Draft din ang una mong prompt: gabayan ito ng mga follow-up sa parehong chat sa halip na magsimula ulit.',
        'Ipa-interview ka muna sa assistant kapag hindi ka sigurado kung ano ang kailangan nitong malaman.',
        'Huwag maglagay ng pribadong detalye sa mahahabang prompt.',
      ],
    },
  ],
  quiz: [
    {
      id: 'starter-02-q1',
      prompt: 'Aling prompt ang malamang na magbibigay ng pinakamagandang sagot?',
      choices: [
        '"Sumulat ng resume summary."',
        '"Sumulat ng magandang resume summary, pakigawa nang maganda."',
        '"Ikaw ay isang recruiter. Sumulat ng resume summary na 3 pangungusap para sa isang fresh IT graduate na nag-a-apply sa junior QA role. Propesyonal ang tono, walang buzzword."',
      ],
      answer: 2,
      explanation:
        'May role, context, malinaw na task at mga constraint ito. Wala ring naidaragdag na magagamit ng model ang pagiging magalang o ang salitang "maganda".',
    },
    {
      id: 'starter-02-q2',
      prompt: 'Bakit nakakatulong ang pagdagdag ng halimbawa sa prompt mo?',
      choices: [
        'Ipinapakita nito ang eksaktong istilo o format na gusto mo, na mahirap ilarawan',
        'Pinapa-search nito sa internet ang model',
        'Kailangan ito, kung hindi ay tatanggi ang model',
        'Ginagawa nitong laging tama ang sagot',
      ],
      answer: 0,
      explanation:
        'Direktang ipinapakita ng halimbawa ang format at tono. Mas tumutugma ang sagot sa gusto mo, pero hindi nito ginagawang tama ang laman.',
    },
    {
      id: 'starter-02-q3',
      prompt: 'Halos tama na ang sagot pero masyadong mahaba at masyadong pormal. Ano ang pinakamagandang susunod na gawin?',
      choices: [
        'Magsimula ng bagong chat at i-type ulit ang parehong prompt',
        'Mag-reply sa parehong chat: "Gawing kalahati ang haba at mas casual."',
        'Tanggapin na lang ito, dahil hindi naaayos ang mga sagot ng AI',
      ],
      answer: 1,
      explanation:
        'Nananatili ang context kapag nag-iterate ka sa parehong conversation, kaya mabilis na naitatama ng maikling follow-up ang sagot.',
    },
    {
      id: 'starter-02-q4',
      prompt: 'Ano ang ginagawa ng constraint na "Kapag hindi ka sigurado, sabihin mo sa halip na manghula"?',
      choices: [
        'Sinisigurong walang magiging mali',
        'Pinahahaba ang sagot',
        'Pinapatay ang training ng model',
        'Hinihikayat ang model na ipaalam kung hindi ito sigurado, kaya mas madaling mag-check',
      ],
      answer: 3,
      explanation:
        'Madalas itong nakakatulong para umamin ang model kapag may kulang o hindi ito sigurado, pero hindi ito garantiya. I-check mo pa rin ang resulta.',
    },
  ],
  task: {
    title: 'I-upgrade ang isang prompt',
    minutes: 15,
    steps: [
      'Sumulat ng isang-linyang prompt para sa bagay na talagang kailangan mo ngayong linggo (isang mensahe, paliwanag, o plano).',
      'I-run ito at i-save ang sagot.',
      'Isulat ulit ang prompt na may context, role, task, halimbawa o format, at constraints. I-run ulit.',
      'Bigyan ito ng dalawang follow-up na instruction para pagandahin ang sagot.',
      'Ikumpara ang una at huling sagot, at isulat kung alin ang pinakamalaking nagpabago sa resulta.',
    ],
  },
};
