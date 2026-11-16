import type { Lesson } from '../../types';

export const starterLesson01Fil: Lesson = {
  id: 'starter-01',
  day: 1,
  title: 'Ano ang AI assistant (at ano ang hindi)',
  summary: 'Simpleng paliwanag kung paano gumagana ang mga AI model, saan sila magaling at saan sila pumapalya.',
  intro: {
    objectives: [
      'Ipaliwanag sa simpleng salita kung paano sumusulat ng sagot ang isang language model.',
      'Pangalanan ang mga bagay na magaling gawin ng AI assistant at ang apat na limitasyon nito.',
      'Alamin kung bakit puwedeng mali ang sagot kahit mukhang sigurado ito.',
    ],
    why: 'Lahat ng susunod sa course na ito ay nakabase sa malinaw na pagkaunawa kung ano talaga ang AI. Kapag naiintindihan mo iyan, alam mo kung kailan ka puwedeng magtiwala rito at kung kailan mo ito dapat i-double-check, anuman ang trabaho o pinag-aaralan mo.',
  },
  minutes: 15,
  skills: ['ai-fundamentals', 'verification'],
  body: [
    {
      type: 'paragraph',
      text: 'Welcome sa Talino! Bago ka gumamit ng AI para sa totoong trabaho, makakatulong na alam mo kung ano talaga ang nangyayari kapag nag-type ka ng tanong at may lumabas na sagot. Hindi mo kailangan ng math para rito. Kailangan mo lang ng malinaw na mental picture.',
    },
    { type: 'heading', text: 'Humuhula ng text ang model' },
    {
      type: 'paragraph',
      text: 'Ang AI assistant tulad ng ChatGPT, Gemini o Claude ay tumatakbo sa isang **large language model**. Na-train ang model na ito sa napakaraming text at code. Mula sa training na iyon, natutunan nito ang mga pattern: kung anong mga salita, pangungusap at code ang karaniwang sumusunod sa iba. Kapag nagtanong ka, isinusulat nito ang sagot nang paisa-isang maliit na piraso, at sa bawat piraso ay pumipili ito ng malamang na susunod.',
    },
    {
      type: 'paragraph',
      text: 'Ang simpleng idea na iyan ang nagpapaliwanag sa marami. Kaya nga magaling sumulat ang AI ng maayos at natural na English, magaling mag-translate, at nakakagawa ng gumaganang code para sa mga karaniwang gawain. Kaya rin ito puwedeng magmukhang sigurado kahit mali. Gumagawa ang model ng text na mukhang tama, hindi ito naghahanap ng facts sa isang mapagkakatiwalaang database.',
    },
    {
      type: 'visual',
      id: 'ai-model-input-output',
      caption: 'Pinasimpleng ilustrasyon: binibigyan ng score ng model ang mga posibleng susunod na piraso ng text, pumipili ito ng isa, at humahaba ang sagot.',
    },
    { type: 'heading', text: 'Saan magaling ang mga assistant' },
    {
      type: 'list',
      items: [
        'Pag-draft: mga email, outline, report, lesson plan, at unang bersyon ng code.',
        'Pagpapaliwanag: isang konsepto, isang error message, o code na hindi mo maintindihan.',
        'Pagbabago ng anyo ng text: pag-summarize, pagsulat muli para sa ibang babasa, paggawa ng table mula sa notes.',
        'Brainstorming: mga idea, pangalan, test case, at mga tanong na nalimutan mong itanong.',
      ],
    },
    { type: 'heading', text: 'Ano ang hindi sila' },
    {
      type: 'list',
      items: [
        '**Hindi search engine.** May ilang assistant na kayang mag-search sa web, pero ang model mismo ay puwedeng mag-imbento ng sources, numero o quotes.',
        '**Hindi laging up to date.** Humihinto ang training nito sa isang punto, kaya puwedeng wala pa ang mga bagong pagbabago.',
        '**Hindi ka kilala nito.** Ang alam lang nito ay ang nasa conversation, maliban kung may memory feature ang tool na in-on mo.',
        '**Hindi mananagot.** Kapag mali ang sagot, ikaw ang gumamit nito, kaya ikaw ang mananagot.',
      ],
    },
    {
      type: 'activity',
      activity: {
        id: 'starter-01-match-1',
        kind: 'match',
        title: 'Aling limitasyon ang tumama sa kanila?',
        prompt: 'Nagtiwala sa assistant ang bawat tao sa ibaba at napahamak sila. Pagtapatin ang bawat pangyayari at ang limitasyon ng AI assistant na dahilan nito.',
        concept: 'limits of ai assistants',
        conceptLabel: 'mga limitasyon ng AI assistant',
        labels: { terms: 'Ang nangyari', meanings: 'Ang limitasyong dahilan nito' },
        pairs: [
          {
            term: 'Humingi si Lea ng tatlong study na sumusuporta sa thesis claim niya. Naglista ang assistant ng mga title at author na hindi niya mahanap kahit saan.',
            definition: 'Hindi search engine',
          },
          {
            term: 'Tinanong ni Marco kung ano ang nagbago sa isang tool na ginagamit niya, at ang sagot ay naglalarawan ng lumang version na parang ito ang pinakabago.',
            definition: 'Hindi laging up to date',
          },
          {
            term: 'Sa bagong chat, nag-type si Joy ng "improve my resume" at generic na payo ang nakuha niya para sa trabahong hindi naman niya ina-applyan.',
            definition: 'Hindi ka kilala nito',
          },
          {
            term: 'Nagpadala si Ben sa client ng quote na dinraft ng AI na mali ang total, at pinanindigan ng client ang presyong iyon sa kanya.',
            definition: 'Hindi mananagot',
          },
        ],
        hints: [
          'Sa bawat pangyayari, itanong: ano ang hindi nagawa ng assistant: mag-look up ng impormasyon, malaman ang mga bagong balita, kilalanin ang tao, o akuin ang sisi?',
          'Ang mga source na hindi umiiral ay galing sa model na gumagawa ng text na mukhang tama, hindi sa pag-look up ng kahit ano.',
          'Ang bagong chat ay nagsisimula lang sa mga isinulat mo rito; at kapag may maling sagot na lumabas sa pangalan mo, ikaw ang responsable.',
        ],
        explanation: 'Ang mga imbentong study ay patunay na hindi search engine ang model, ang lumang version ay patunay na humihinto ang training nito sa isang punto, ang generic na payo ay patunay na ang alam lang nito ay ang nasa conversation, at ang maling quote ay patunay na ang taong gumamit ng sagot ang mananagot.',
      },
    },
    {
      type: 'tip',
      text: 'Isipin mong ang AI assistant ay parang mabilis at maraming nabasang intern. Magaling sa unang draft, kailangan ng malinaw na instruction, at dapat mong i-review ang gawa nito bago ilabas.',
    },
    {
      type: 'paragraph',
      text: 'Subukan mo mismo. I-paste ang prompt sa ibaba sa kahit anong AI assistant na ginagamit mo na. Tapos basahin ang sagot na may isang tanong sa isip: aling mga bahagi ang kailangan mong i-check bago ka magtiwala?',
    },
    {
      type: 'prompt',
      label: 'Tingnan mo mismo ang mga limitasyon',
      text: 'Ipaliwanag mo sa simpleng Tagalog (okay lang ang Taglish) kung paano ka, bilang isang AI language model, gumagawa ng sagot. Pagkatapos, maglista ng tatlong uri ng tanong kung saan madalas na mali ang mga sagot mo, at sabihin mo kung paano ko dapat i-double-check ang bawat uri.',
    },
    {
      type: 'warning',
      text: 'Huwag ituring na patunay ang kumpiyansang tono. Pareho lang ang tunog ng maling sagot at ng tamang sagot.',
    },
    {
      type: 'takeaways',
      items: [
        'Sumusulat ang isang language model sa pamamagitan ng paghula ng malamang na susunod na piraso ng text, gamit ang mga pattern na natutunan sa training.',
        'Kaya maayos itong sumulat, at kaya ring magmukhang sigurado kahit mali.',
        'Malakas ito sa pag-draft, pagpapaliwanag, pagbabago ng anyo ng text, at brainstorming.',
        'Hindi ito search engine, hindi laging up to date, hindi ka nito kilala at hindi ito mananagot: ikaw ang mananagot.',
        'Hindi kailanman patunay ang kumpiyansang tono. I-check ang mga mahalaga.',
      ],
    },
  ],
  quiz: [
    {
      id: 'starter-01-q1',
      prompt: 'Ano ang pangunahing ginagawa ng isang language model kapag sumusulat ito ng sagot?',
      choices: [
        'Hinahanap ang sagot sa isang verified na database',
        'Hinuhulaan ang malamang na susunod na piraso ng text batay sa mga pattern na natutunan nito',
        'Kinokopya ang isang web page na tugma sa tanong mo',
      ],
      answer: 1,
      explanation:
        'Gumagawa ng text ang language model sa pamamagitan ng paghula kung ano ang malamang na susunod. Kaya maayos itong sumulat, at kaya rin itong magkamali kahit mukhang sigurado.',
    },
    {
      id: 'starter-01-q2',
      prompt: 'Aling gawain ang karaniwang malakas ang AI assistant?',
      choices: [
        'Pagtiyak na kasalukuyan pa ang isang legal na fact',
        'Pagkaalam sa mga pribadong patakaran ng kumpanya mo nang hindi sinasabi sa kanya',
        'Pag-convert ng magulong meeting notes sa malinaw na summary',
        'Pag-akin ng responsibilidad sa maling sagot',
      ],
      answer: 2,
      explanation:
        'Pangunahing lakas nito ang pagbabago ng text na ibinigay mo, tulad ng pag-summarize ng notes. Hindi ito ang malakas sa kanya: ang mga pinakabagong fact at mga bagay na pribado lang sa iyo.',
    },
    {
      id: 'starter-01-q3',
      prompt: 'May ibinigay na statistic ang assistant na may source, at mukha itong sigurado. Ano ang dapat mong gawin?',
      choices: [
        'Buksan ang source at kumpirmahin kung talagang nandoon ang numero',
        'Gamitin na ito, dahil may binanggit naman itong source',
        'Tanungin ang assistant kung sigurado ito, at paniwalaan ang oo nito',
      ],
      answer: 0,
      explanation:
        'Puwedeng mag-imbento ng sources at numero ang mga model. Ang totoong source lang ang makakakumpirma, at hindi check ang pagtatanong ulit sa model.',
    },
  ],
  task: {
    title: 'Hanapin ang mga hangganan',
    minutes: 10,
    steps: [
      'Magbukas ng AI assistant na magagamit mo (okay na ang libreng version).',
      'I-paste ang prompt na "Tingnan mo mismo ang mga limitasyon" at basahin ang sagot.',
      'Magtanong dito ng isang bagay na kabisado mo, tulad ng course mo, trabaho mo o bayan mo.',
      'Isulat ang isang bagay na tama ang sagot nito at isang bagay na mali, malabo o kulang.',
    ],
  },
};
