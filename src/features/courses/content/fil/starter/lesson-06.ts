import type { Lesson } from '../../types';

export const starterLesson06Fil: Lesson = {
  id: 'starter-06',
  day: 6,
  title: 'Ang mapa ng mga AI tool',
  summary: 'Chat assistants, coding assistants, vibe-coding builders at automation tools: para saan ang bawat isa.',
  intro: {
    objectives: [
      'Mailarawan ang pagkakaiba ng chat assistants, coding assistants, vibe-coding builders at automation tools.',
      'I-match ang totoong trabaho sa uri ng tool na bagay dito.',
      'Suriin ang kahit anong bagong tool ayon sa uri nito, sa paghawak nito ng data, at kung mae-export mo ba ang gawa mo.',
    ],
    why: 'Bawat buwan, may bagong tool na lumalabas, at mabilis magpalit ang mga pangalan. Kapag alam mo ang apat na uri, makakapili ka ng tool para sa sarili mong trabaho, at malalaman mo kung alin ang hype at alin ang tunay na tulong, nang hindi hinahabol ang bawat bagong labas.',
  },
  minutes: 15,
  skills: ['ai-workflow', 'ai-fundamentals', 'career-direction'],
  body: [
    {
      type: 'paragraph',
      text: 'Bawat buwan may lumalabas na bagong AI tool, at mabilis magpalit ang mga pangalan. Sa halip na habulin ang bawat bagong labas, alamin ang apat na pangunahing uri. Kapag alam mo na ang uri, kaya mo nang suriin ang kahit anong bagong tool sa loob ng ilang minuto.',
    },
    { type: 'heading', text: '1. Chat assistants' },
    {
      type: 'paragraph',
      text: 'Mga general-purpose na katulong na kausap mo sa isang chat window, tulad ng ChatGPT, Gemini o Claude. Magaling sila sa pagsusulat, pagpapaliwanag, pagpaplano at pag-analyze ng mga document. Marami sa kanila ang kayang magbasa ng files, mag-search sa web o gumawa ng images, depende sa plan at settings.',
    },
    { type: 'heading', text: '2. AI coding assistants' },
    {
      type: 'paragraph',
      text: 'Mga tool na gumagana sa loob ng code editor o terminal mo, tulad ng GitHub Copilot, Cursor o Claude Code. Nagmumungkahi sila ng code habang nagta-type ka, nagpapaliwanag at nagre-refactor ng existing code, gumagawa ng tests at kayang magbago ng ilang file nang sabay. Ginawa sila para sa mga taong marunong magbasa at mag-review ng code.',
    },
    { type: 'heading', text: '3. Vibe-coding builders' },
    {
      type: 'paragraph',
      text: 'Mga tool kung saan ilalarawan mo sa simpleng salita ang isang app o website at gagawa sila ng gumaganang version, tulad ng Lovable, Bolt, Replit o v0. Magaling para sa mga prototype at simpleng site, at magandang panimula sa tech para sa mga hindi programmer. Habang lumalaki ang project, kailangan mo pa ring intindihin ang ginawa nito, lalo na pagdating sa logins, payments at data.',
    },
    { type: 'heading', text: '4. Automation tools' },
    {
      type: 'paragraph',
      text: 'Mga tool na nagkokonekta ng mga app at nagpapatakbo ng mga step para sa iyo, tulad ng Zapier, Make o n8n, na madalas may AI step sa loob. Halimbawa: kapag may bagong inquiry na dumating sa email, isang AI step ang nagso-sort nito at may idinadagdag na row sa spreadsheet. Malaking tulong sa mga VA, maliliit na negosyo at sinumang may paulit-ulit na gawain.',
    },
    {
      type: 'tip',
      text: 'Karamihan sa mga tool na ito ay may free tier o trial, at madalas magbago ang mga plan. Tingnan ang mismong site ng tool para sa kasalukuyang features at limits bago ka mag-commit, lalo na kung para sa trabaho ng client.',
    },
    {
      type: 'table',
      headers: ['Uri', 'Mga halimbawa', 'Bagay para sa'],
      rows: [
        [
          'Chat assistants',
          'ChatGPT, Gemini, Claude',
          'Pagsusulat, pagpapaliwanag, pagpaplano at pag-analyze ng mga document.',
        ],
        [
          'AI coding assistants',
          'GitHub Copilot, Cursor, Claude Code',
          'Pagmumungkahi, pagpapaliwanag at pag-refactor ng code, para sa mga taong kayang mag-review nito.',
        ],
        [
          'Vibe-coding builders',
          'Lovable, Bolt, Replit, v0',
          'Mga prototype at simpleng site mula sa paglalarawan sa simpleng salita.',
        ],
        [
          'Automation tools',
          'Zapier, Make, n8n',
          'Pagkokonekta ng mga app at paulit-ulit na trabaho, madalas may AI step sa loob.',
        ],
      ],
      caption: 'Ang apat na uri. Mga halimbawa lang ang mga pangalan; nagbabago ang mga plan, kaya tingnan ang mismong site ng bawat tool.',
    },
    {
      type: 'activity',
      activity: {
        id: 'starter-06-match-1',
        kind: 'match',
        title: 'Anong uri ng tool?',
        prompt: 'May kanya-kanyang gagawin ang apat na tao. I-match ang bawat isa sa uri ng AI tool na bagay dito.',
        concept: 'ai tool kinds',
        conceptLabel: 'mga uri ng AI tool',
        labels: { terms: 'Ang trabaho', meanings: 'Uri ng tool' },
        pairs: [
          {
            term: 'Gusto ng isang teacher ng friendly na sulat para sa mga magulang tungkol sa field trip sa susunod na linggo, sa English at sa Filipino.',
            definition: 'Chat assistant',
          },
          {
            term: 'Gusto ng isang junior developer na ipagawa ng mga test ang isang function sa project na kasalukuyang bukas niya, at babasahin at susuriin niya ang bawat line.',
            definition: 'AI coding assistant',
          },
          {
            term: 'Gusto ng may-ari ng barbershop, na hindi pa nakapag-code kahit kailan, ng simpleng booking page na ilalarawan lang niya sa simpleng salita.',
            definition: 'Vibe-coding builder',
          },
          {
            term: 'Gusto ng isang maliit na bakery na isang AI step ang mag-sort ng bawat bagong entry sa order form at magkopya nito sa delivery sheet nila, nang walang gumagawa nito nang mano-mano.',
            definition: 'Automation tool',
          },
        ],
        hints: [
          'Tingnan kung saan nagaganap ang trabaho: sa chat window, sa code editor, sa builder kung saan mo ilalarawan ang gusto mo, o sa mga magkakakonektang app.',
          'Ang trabahong kusang tatakbo tuwing may bagong dumarating ay tumuturo sa isang uri; ang code na susuriin pa ng tao ay tumuturo sa iba.',
          'Ang taong hindi marunong mag-code pero gusto ng gumaganang page ay nangangailangan ng tool na gumagawa mula sa paglalarawan; ang pagsusulat ng sulat ay simpleng chat work lang.',
        ],
        explanation: 'Ang pagsusulat ng sulat ay chat work, ang tests sa loob ng bukas na project ay para sa coding assistant na gagamitin ng taong marunong mag-review ng code, ang page na ginawa mula sa simpleng paglalarawan ay vibe-coding builder, at ang mga step na tumatakbo tuwing may bagong order ay automation.',
      },
    },
    { type: 'heading', text: 'Paano suriin ang kahit anong bagong tool' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Anong uri ito? Chat, coding, builder o automation.',
        'Ano ang ginagawa nito sa data ko? Basahin ang privacy page.',
        'Makikita at maie-export ko ba ang ginagawa nito, o naka-lock in ako rito?',
        'Nalulutas ba nito ang problemang mayroon talaga ako ngayong linggo?',
      ],
    },
    {
      type: 'prompt',
      label: 'Pumili ng tool para sa isang trabaho',
      text: 'Isa akong [ang role mo, hal. VA / fresh CS graduate / teacher / may-ari ng maliit na negosyo]. Ang pinaka-paulit-ulit kong gawain ay: [ilarawan ito]. Anong uri ng AI tool ang pinakabagay: chat assistant, coding assistant, vibe-coding builder o automation tool? Ipaliwanag mo kung bakit sa loob ng 150 salita, at ilista mo kung ano ang dapat kong i-check tungkol sa privacy bago ako gumamit ng isa. Pangalanan mo lang ang mga tool bilang halimbawa, at paalalahanan mo akong kumpirmahin ang kasalukuyang features sa mismong site ng bawat isa.',
    },
    {
      type: 'warning',
      text: 'Walang tool na mananatiling "pinakamahusay" habambuhay. Ang mga skill tulad ng prompting, pag-check ng output at pag-intindi sa ginawa ng isang tool ay madadala mo sa kahit anong tool na susunod na lalabas.',
    },
    {
      type: 'takeaways',
      items: [
        'May apat na pangunahing uri ng AI tool: chat assistants, coding assistants, vibe-coding builders at automation tools.',
        'Kapag alam mo ang uri, kaya mo nang suriin ang kahit anong bagong tool sa loob ng ilang minuto.',
        'I-check kung ano ang ginagawa ng tool sa data mo at kung mae-export mo ba ang gawa mo.',
        'Ang mga app na ginawa ng AI ay kailangan pa ring tingnang mabuti pagdating sa logins, payments at data.',
        'Ang mga skill tulad ng prompting at pag-check ay madadala mo sa kahit anong tool na susunod na lalabas.',
      ],
    },
  ],
  quiz: [
    {
      id: 'starter-06-q1',
      prompt: 'Gusto ng isang VA na awtomatikong ma-summarize at madagdag sa spreadsheet ang mga bagong client inquiry mula sa isang form. Anong uri ng tool ang bagay?',
      choices: [
        'Isang vibe-coding builder',
        'Isang AI coding assistant',
        'Isang automation tool na may AI step',
      ],
      answer: 2,
      explanation:
        'Ang mga automation tool ay nagkokonekta ng mga app at nagpapatakbo ng mga step kapag may trigger, at kayang gawin ng isang AI step ang pag-summarize.',
    },
    {
      id: 'starter-06-q2',
      prompt: 'Para kanino pangunahing ginawa ang mga AI coding assistant?',
      choices: [
        'Para sa mga taong marunong magbasa at mag-review ng code',
        'Para sa mga taong ayaw makakita ng code kahit kailan',
        'Para lang sa malalaking kumpanya',
        'Para lang sa mga designer',
      ],
      answer: 0,
      explanation:
        'Pinapabilis nila ang pag-code, pero kailangan pa rin ng taong marunong mag-review ng mga mungkahi nila.',
    },
    {
      id: 'starter-06-q3',
      prompt: 'Isang hindi programmer ang gumawa ng shop site gamit ang vibe-coding tool at gusto na niyang magdagdag ng customer logins at payments. Ano ang matalinong gawin?',
      choices: [
        'I-launch agad, ang tool na ang bahala sa security',
        'Alamin kung paano gumagana ang mga bahaging iyon, o magpa-review sa developer, bago mag-go live',
        'Itago na lang ang payment details sa isang spreadsheet',
      ],
      answer: 1,
      explanation:
        'Ang logins, payments at personal na data ang mga bahaging pinakamadalas na kailangang suriing mabuti sa mga app na gawa ng AI.',
    },
    {
      id: 'starter-06-q4',
      prompt: 'Ano ang dapat mong i-check muna kapag sumusubok ng kahit anong bagong AI tool?',
      choices: [
        'Ilan ang followers nito',
        'Kung may dark mode ito',
        'Kung ito ba ang pinakabago',
        'Kung ano ang ginagawa nito sa data mo, at kung mae-export mo ba ang gawa mo',
      ],
      answer: 3,
      explanation:
        'Mas mahalaga ang paghawak sa data at ang lock-in kaysa sa kasikatan, lalo na sa trabaho ng client o ng kumpanya.',
    },
  ],
  task: {
    title: 'I-map ang sarili mong mga tool',
    minutes: 15,
    steps: [
      'Ilista ang bawat AI tool na nagamit mo o narinig mo na sa trabaho o sa school.',
      'Ilagay ang bawat tool sa isa sa apat na uri: chat, coding, builder, automation.',
      'I-run ang prompt na "Pumili ng tool para sa isang trabaho" gamit ang totoong paulit-ulit mong gawain.',
      'Buksan ang privacy page ng tool na ire-recommend nito at magsulat ng isang linya kung ano ang ginagawa nito sa data mo.',
    ],
  },
};
