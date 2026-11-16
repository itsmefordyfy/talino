import type { Lesson } from '../../types';

export const starterLesson04Fil: Lesson = {
  id: 'starter-04',
  day: 4,
  title: 'Ligtas at tapat na paggamit ng AI',
  summary: 'Protektahan ang mga secret at personal data, sundin ang mga patakaran sa pinagtatrabahuhan o pinag-aaralan mo, at sabihin kapag gumamit ka ng AI.',
  intro: {
    objectives: [
      'Ilista kung ano ang hindi dapat i-paste sa AI tool: mga secret, personal data at materyal na hindi mo puwedeng ibahagi.',
      'Palitan ng pekeng detalye ang mga totoong detalye bago ka humingi ng tulong.',
      'Kumilos agad kapag may na-leak na key o password.',
      'Sabihin na gumamit ka ng AI kung inaasahan iyon ng school, client o employer mo.',
    ],
    why: 'Ang tina-type mo sa AI tool ay napapadala sa labas ng laptop mo, kaya isang pabayang paste lang ay puwedeng mag-expose ng client, customer o sarili mong account. Pinoprotektahan ng mga ligtas na habit ang trabaho mo, ang grades mo at ang ibang tao.',
  },
  minutes: 15,
  skills: ['responsible-ai', 'ai-fundamentals'],
  body: [
    {
      type: 'paragraph',
      text: 'Malaking tulong ang mga AI tool, pero napapadala sa labas ng laptop mo ang anumang tina-type mo sa mga ito. Depende sa tool at sa mga setting nito, puwede itong i-store, ipa-review sa tao o gamitin para pagandahin ang serbisyo. Pinoprotektahan ka ng magagandang habit dito, pati ang employer, mga client at mga estudyante mo.',
    },
    { type: 'heading', text: 'Huwag i-paste ang mga ito' },
    {
      type: 'list',
      items: [
        '**Mga secret:** passwords, API keys, tokens, private keys, database connection strings.',
        '**Personal data:** mga pangalang may kasamang contact details, government ID numbers, payslips, health records, grades ng mga estudyante.',
        '**Materyal ng client o kumpanya** na hindi mo puwedeng ibahagi, kasama ang source code ng kumpanya, maliban kung aprubado ang tool para doon.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Kung kailangan mo ng tulong sa totoong data, palitan mo muna ito ng pekeng data. Gawin mong "Customer A, 0900 000 0000" ang "Juan Dela Cruz, 0917 123 4567". Matutulungan ka pa rin ng AI sa istruktura.',
    },
    {
      type: 'warning',
      text: 'Kapag nakapag-paste ka ng totoong API key o password sa chat o sa public repo, ituring mo na itong na-leak. I-revoke ito at gumawa agad ng bago. Hindi sapat na burahin ang message.',
    },
    { type: 'heading', text: 'Sundin ang mga patakaran sa trabaho o school mo' },
    {
      type: 'paragraph',
      text: 'Maraming kumpanya ang may listahan ng mga aprubadong AI tool at kung para saan lang puwedeng gamitin ang mga ito. May sarili ring patakaran sa academic honesty ang mga school at unibersidad. Magtanong muna sa halip na magpalagay. Sa Pilipinas, pinoprotektahan ng **Data Privacy Act** ang personal na impormasyon, kaya may totoong consequences kapag pabaya ka sa paghawak ng data ng ibang tao. Pangkalahatang paliwanag lang ito. Para sa payong akma sa eksaktong sitwasyon mo, tingnan ang policy ng kumpanya mo, ng school mo, o ng National Privacy Commission.',
    },
    { type: 'heading', text: 'Maging tapat tungkol sa tulong ng AI' },
    {
      type: 'list',
      items: [
        'Kung hinihingi ng school, client o employer mo na sabihin kung gumamit ka ng AI, sabihin mo.',
        'Huwag mong ipasa bilang buong-buo mong sariling gawa ang ginawa ng AI kung hindi iyon pinapayagan.',
        'Igalang ang mga license. Puwedeng gumawa ang AI ng text o code na halos kapareho ng umiiral nang gawa ng iba, kaya huwag mong isiping libre mong magagamit ang lahat ng ibinibigay nito.',
        'Ikaw ang mananagot sa anumang ilalabas mo, kahit sino pa ang gumawa ng draft.',
      ],
    },
    {
      type: 'tip',
      text: 'Puwede sa karamihan ng lugar ang simpleng disclosure line: "Gumamit ako ng AI assistant para gumawa ng draft ng outline at mag-check ng grammar. Ako mismo ang gumawa ng analysis at ng mga huling edit."',
    },
    {
      type: 'activity',
      activity: {
        id: 'starter-04-match-1',
        kind: 'match',
        title: 'Ano ang gagawin mo?',
        prompt: 'I-match ang bawat sitwasyon sa ligtas na habit mula sa lesson na ito.',
        concept: 'safe ai use',
        conceptLabel: 'ligtas na paggamit ng AI',
        pairs: [
          {
            term: 'Totoong API key na na-paste sa chat',
            definition: 'Ituring itong na-leak: i-revoke at gumawa ng bago. Hindi sapat na burahin ang message.',
          },
          {
            term: 'Pangalan at phone number ng customer sa text mo',
            definition: 'Palitan muna ng pekeng data, gaya ng "Customer A, 0900 000 0000".',
          },
          {
            term: 'Source code ng kumpanya',
            definition: 'Huwag i-paste maliban kung aprubado ang tool para doon.',
          },
          {
            term: 'School na nag-require na sabihin mo kung tinulungan ka ng AI',
            definition: 'Sabihin kung paano mo ito ginamit, halimbawa sa isang maikling disclosure line.',
          },
        ],
        hints: [
          'Pinaka-urgent ang mga secret: ano ang gagawin kapag wala na sa kontrol mo ang mga ito?',
          'Napapanatili ng pekeng data ang istruktura ng text mo nang walang taong na-expose.',
          'Tungkol sa pagiging tapat ang disclosure, samantalang ang tatlo pa ay tungkol sa kung ano ang napapadala sa labas ng laptop mo.',
        ],
        explanation: 'Napapadala sa labas ng laptop mo ang tina-type mo sa isang tool, kaya hindi dapat isama ang mga secret at personal data, kailangan ng aprubadong tool para sa materyal ng kumpanya, at dapat kang maging bukas tungkol sa tulong ng AI kung saan ito hinihingi ng mga patakaran.',
      },
    },
    {
      type: 'prompt',
      label: 'I-anonymize bago ka magtanong',
      text: 'May ipe-paste akong text. Palitan mo ang bawat pangalan ng tao, phone number, email address, ID number, address at pangalan ng kumpanya ng placeholder na gaya ng [NAME 1] o [PHONE 1]. Ibalik mo lang ang nilinis na text at ang listahan ng mga placeholder na ginamit mo. Huwag mong isama o ulitin ang orihinal na mga detalye.',
    },
    {
      type: 'paragraph',
      text: 'Tandaan tungkol sa prompt na iyon: ipinapadala pa rin nito ang orihinal na text sa tool. Gamitin lang ito sa aprubadong tool, o ikaw mismo ang maglinis ng text kapag sensitibo ang data.',
    },
    {
      type: 'takeaways',
      items: [
        'Huwag mag-paste ng mga secret, personal data, o materyal ng client o kumpanya na hindi mo puwedeng ibahagi.',
        'Palitan ng pekeng detalye ang mga totoo bago ka humingi ng tulong sa istruktura.',
        'Kailangang i-revoke o palitan ang na-leak na key o password; hindi sapat na burahin ang message.',
        'Sundin ang mga patakaran ng kumpanya o school mo, at sabihin na gumamit ka ng AI kung saan ito hinihingi.',
        'Ikaw ang mananagot sa anumang ilalabas mo, kahit sino pa ang gumawa ng draft.',
      ],
    },
  ],
  quiz: [
    {
      id: 'starter-04-q1',
      prompt: 'Nakapag-paste ka ng totoong API key sa isang AI chat nang hindi sinasadya. Ano ang dapat mong gawin?',
      choices: [
        'Burahin ang chat at magpatuloy na lang',
        'I-revoke ang key at gumawa ng bago',
        'Wala, dahil hindi kailanman nag-i-store ng kahit ano ang mga AI tool',
      ],
      answer: 1,
      explanation:
        'Kapag wala na sa kontrol mo ang isang secret, ituring itong na-leak. Ang pag-revoke lang ang maaasahang solusyon.',
    },
    {
      id: 'starter-04-q2',
      prompt: 'Gusto mong magpatulong sa AI sa pag-format ng customer list ng isang client. Ano ang pinakaligtas na paraan?',
      choices: [
        'I-paste ang buong listahan sa kahit anong libreng chatbot',
        'I-email muna sa sarili mo ang listahan',
        'Ipa-paste sa client ang listahan para sa iyo',
        'Palitan ng pekeng detalye ang mga totoo, o gumamit ng tool na aprubado ng kumpanya mo para sa data na iyon',
      ],
      answer: 3,
      explanation:
        'Napapanatili ng pekeng data ang istruktura nang walang taong na-expose. Ang mga aprubadong tool ang eksepsyon, dahil nasuri na ito ng kumpanya mo.',
    },
    {
      id: 'starter-04-q3',
      prompt: 'Pinapayagan ng instructor mo ang AI para sa brainstorming pero kailangang sabihin mo kung ginamit mo ito. Ano ang gagawin mo?',
      choices: [
        'Magdagdag ng maikling note kung paano mo ginamit ang AI',
        'Gamitin lang ang AI sa gabi para hindi ito mabilang',
        'Huwag nang mag-disclose kung maliit lang ang parte ng AI',
      ],
      answer: 0,
      explanation:
        'Kapag hinihingi ang disclosure, mag-disclose ka, kahit maliit na tulong lang. Sapat na ang isang line na note sa karamihan ng kaso.',
    },
    {
      id: 'starter-04-q4',
      prompt: 'Sino ang mananagot sa bug sa code na isinulat ng AI pero ikaw ang naglabas?',
      choices: [
        'Ang kumpanya ng AI',
        'Walang mananagot, dahil makina ang sumulat nito',
        'Ikaw, dahil ikaw ang pumili na gamitin at ilabas ito',
      ],
      answer: 2,
      explanation:
        'Tool lang ang AI. Ang nag-review at naglabas ng gawa ang mananagot sa resulta.',
    },
  ],
  task: {
    title: 'Ang sarili mong mga patakaran sa AI',
    minutes: 10,
    steps: [
      'Alamin kung may AI policy ang kumpanya o school mo. Hanapin sa intranet, handbook o syllabus, o magtanong.',
      'Tingnan ang mga setting ng data o privacy ng AI tool na pinakamadalas mong gamitin, at isulat kung puwedeng gamitin sa training ang mga chat mo.',
      'Sumulat ng limang maikling patakaran para sa sarili mo, halimbawa: "Walang totoong pangalan sa mga prompt."',
      'I-save ang mga ito sa lugar na makikita mo, gaya ng note sa laptop mo.',
    ],
  },
};
