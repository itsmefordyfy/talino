import type { Lesson } from '../../types';
import { FIL_CHECKED, FIL_DOCS } from './meta';

export const aiCodingBeginnersLesson02Fil: Lesson = {
  id: 'ai-coding-beginners-02',
  day: 2,
  title: 'Pagpili at pag-set up ng una mong AI coding tool',
  summary: 'Pumili ng free AI assistant, mag-set up ng folder at plain text editor, at alamin kung ano ang kasama at hindi kasama sa mga free plan.',
  intro: {
    objectives: [
      'Pumili ng free AI assistant at gumawa ng account dito',
      'Gumawa ng project folder at pangalanan nang tama ang mga file',
      'Ipaliwanag kung ano ang nililimitahan ng mga free plan, at kung bakit ikaw mismo ang nagche-check ng kasalukuyang limits',
    ],
    why: 'Ang tool na isi-set up mo ngayon ang gagamitin sa lahat ng susunod na lesson. Ang maliit pero tamang setup ngayon ay magliligtas sa iyo sa mga nakakalitong problema mamaya, tulad ng file na palihim palang pinangalanang index.html.txt.',
  },
  minutes: 20,
  skills: ['choose-tools'],
  body: [
    { type: 'paragraph', text: 'Para makabuo ng page gamit ang AI, ilang bagay lang ang kailangan mo: AI assistant na magsusulat ng code, lugar sa computer mo para itago ang mga file, paraan para gawing file ang isinulat ng AI, at browser para tingnan ito. Sine-set up ng lesson na ito ang apat na iyan. Hindi mo kailangang magbayad ng kahit ano para masundan ang course na ito, pero may limits ang mga free plan, at magiging tapat kami tungkol doon.' },
    { type: 'heading', text: 'Dalawang uri ng AI tool' },
    { type: 'paragraph', text: 'Ang **chat assistant** ay website o app kung saan nagta-type ka ng request at binabasa mo ang sagot. Ikaw mismo ang magko-copy ng code na isinulat nito papunta sa isang file. Chat assistant ang ChatGPT, Claude at Gemini, at bawat isa ay may free plan. Ang **AI code editor** naman ay program na ini-install mo sa computer mo kung saan nagtatrabaho ang AI sa loob ng project folder mo at kaya nitong baguhin ang mga file mo para sa iyo. Isa ang Cursor dito. Mas makapangyarihan ito, pero mas marami rin itong button na kailangang maintindihan.' },
    { type: 'paragraph', text: 'Para sa una mong site, sapat na ang chat assistant, at ito ang gagamitin ng course na ito. Hindi ka nakakulong dito: pareho ang paraan ng pag-ask sa bawat tool, kaya lahat ng matututunan mo ay madadala mo sa editor mamaya.' },
    {
      type: 'table',
      headers: ['Tool', 'Uri', 'Ano ang inaalok ng free plan nito (i-check ang kasalukuyang limits)'],
      rows: [
        ['ChatGPT', 'Chat assistant', 'Mga text chat, projects at ilang file upload at image creation, na may limits na puwedeng magbago at mas maliit na context kaysa sa mga bayad na plan'],
        ['Claude', 'Chat assistant', 'Free plan na may usage limits kada session; puwedeng gumawa ng artifacts ang mga free user (mga page at maliliit na tool na lumalabas sa tabi ng chat)'],
        ['Gemini', 'Chat assistant', 'Mga standard limits na nagre-refresh paglipas ng oras at puwedeng magbago nang walang abiso; limitadong context window'],
        ['Cursor', 'AI code editor', 'Free plan na may limitadong agent at chat request; ini-install mo ito at binubuksan ang isang project folder'],
      ],
      caption: 'May paraan ang apat na ito para magsimula nang libre ngayon. Nagbabago ang mga plan at limits; tingnan ang sariling page ng bawat tool bago ka magdesisyon.',
    },
    {
      type: 'version',
      text: 'Ayon sa petsang 2026-11-14, nakalista sa plans page ng ChatGPT ang mga text chat, chat history at projects sa Free plan, at may limit ang file upload, image creation, memory at ilan pang feature, at mas maliit ang context window kaysa sa mga bayad na plan. Sinasabi ng help page ng Gemini na standard limits ang nakukuha ng mga free user, na nagre-refresh at puwedeng magbago nang walang abiso. Sinasabi ng help center ng Claude na puwedeng gumawa ng artifacts ang mga free user. Naglilista ang pricing page ng Cursor ng Free plan na may limitadong agent at chat request. Madalas magbago ang mga pangalan ng plan at ang limits; hindi umaasa ang course na ito sa presyo o sa eksaktong numero.',
      checked: FIL_CHECKED,
      sources: [FIL_DOCS.chatgptPlans, FIL_DOCS.geminiLimits, FIL_DOCS.claudeArtifacts, FIL_DOCS.cursorPricing],
      plans: 'Mga Free plan ng ChatGPT, Claude, Gemini at Cursor',
    },
    { type: 'heading', text: 'Paano pumili' },
    {
      type: 'list',
      items: [
        '**Pumili ng isa at manatili rito sa buong course.** Kapag nagpalit ka ng tool sa gitna ng project, mahirap malaman kung ano ang nagkamali. Subukan mo ang iba mamaya.',
        '**Gamitin ang kaya mong ma-sign in ngayon.** Kung gumagamit ka na ng isa sa mga ito, iyon na ang gamitin mo.',
        '**Piliin ang official na website o app.** I-type mo mismo ang address o gamitin ang store listing ng mismong kumpanya. May mga look-alike na site.',
        '**Basahin ang screen na nagsasabi ng limits.** Kapag naabot mo ang limit, sinasabi ng tool kung kailan ka makakapagpatuloy. Normal iyon sa free plan, hindi mo kasalanan.',
      ],
    },
    { type: 'heading', text: 'Ang natitira sa setup mo' },
    { type: 'paragraph', text: 'Gumawa ng **folder** (lalagyan ng mga file, parang papel na folder) na pinangalanang `my-first-site` sa lugar na madaling hanapin, tulad ng Documents folder mo. Lahat ng para sa website mo ay ilalagay sa folder na ito. Susunod, kailangan mo ng paraan para makagawa ng **plain text file**: file na walang font, walang bold at walang layout, puro letra lang. Kaya iyon ng Notepad sa Windows at ng TextEdit sa Mac (gawing plain text gamit ang Format, tapos Make Plain Text). Puwede rin ang code editor. Huwag gumamit ng word processor tulad ng Word.' },
    { type: 'paragraph', text: 'May dalawang bitag na madalas mahulog ang mga first-timer. Una, may pangalan at **extension** ang file, ang mga letra pagkatapos ng tuldok na nagsasabi sa computer mo kung anong klase ng file ito. Ang `index.html` ay may extension na `.html`. May mga computer na nagtatago ng extension, kaya ang file na pinangalanan mong `index.html` ay puwedeng `index.html.txt` pala, na hindi ituturing ng browser mo na web page. I-on ang “show file extensions” sa file manager mo, at i-check. Pangalawa, huwag kailanman palitan ang pangalan ng file ng tulad ng `final-final2.html` bago ka mag-publish: karaniwang `index.html` ang tawag sa front page ng site, at ipinaliliwanag ng lesson 10 kung bakit.' },
    { type: 'tip', text: 'Mag-test muna nang maliit ngayon. I-ask sa assistant mo: “Isulat ang mga salitang Hello world bilang napakaliit na web page sa isang file na tinatawag na index.html.” I-save ang sagot sa folder mo bilang index.html at i-double-click ito. Kung may lumabas na mga salita sa browser, gumagana ang setup mo.' },
    {
      type: 'prompt',
      label: 'Ang setup test mo',
      text: 'Hindi pa ako nakakapagsulat ng code. Pakisulat ng napakaliit na web page na nagpapakita ng mga salitang "Hello world". Ibigay mo sa akin ang lahat sa iisang file na tinatawag na index.html, at sabihin mo, sa simpleng mga hakbang, kung paano ito i-save sa computer ko at buksan sa browser ko.',
    },
    {
      type: 'paragraph',
      audience: { max: 'beginner' },
      text: 'Sa simpleng salita: ang chat assistant ay parang pagte-text sa isang kaibigang napakaraming alam. Nagta-type ka, sumasagot siya, at ikaw ang magdedesisyon kung ano ang gagawin sa sagot. Ang AI code editor naman ay parang ang kaibigang iyon na nakaupo sa mesa mo, kayang buksan ang folder mo at baguhin ang mga papel sa loob. Okay ang dalawa; mas madaling simulan ang kaibigang ka-text. Ang *free plan* ay parang libreng sample: puwede mo itong subukan, pero may limit, at puwedeng palitan ng tindahan ang limit. Kaya lagi naming sinasabing i-check mo ang sariling page ng tool sa halip na magtiwala sa numero sa isang course.',
    },
    {
      type: 'paragraph',
      audience: { min: 'advanced' },
      text: 'Kung nagtatrabaho ka na sa editor o terminal, ang kapaki-pakinabang na pagkakaiba ay kung paano nakakakuha ng context ang bawat tool at kung ano ang puwede nitong baguhin. Ang nakikita lang ng chat tool ay ang pini-paste mo; ang editor agent ay nakikita ang repository, kayang mag-edit ng mga file at puwedeng magpatakbo ng mga command, kaya kailangan nito ng permission settings, review ng mga diff at project na nasa version control. Para sa ganito kaliit na site, pinakamaliit ang blast radius ng chat route, at napapanatili mo ang disiplina ng pagbasa sa bawat change. Ituring na variable na infrastructure ang free-plan quotas at context size: idisenyo ang workflow mo para ang nawalang session ay magkakahalaga lang ng re-paste, hindi ng buong project.',
    },
    {
      type: 'takeaways',
      items: [
        'Ang chat assistant ay sumusulat ng code na kino-copy mo sa mga file; ang AI code editor ay nagtatrabaho sa loob ng project folder mo. Sapat na ang chat assistant para sa course na ito.',
        'May libreng paraan ng pagsisimula ang ChatGPT, Claude, Gemini at Cursor, na may limits na nagbabago: i-check ang sariling page ng tool.',
        'Gumawa ng isang project folder, gumamit ng plain text file at tiyaking index.html talaga ang pangalan, hindi index.html.txt.',
        'Gamitin ang official na site o app ng tool, at manatili sa isang tool sa buong course.',
      ],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-02-scenario-1',
        kind: 'scenario',
        title: 'Anong unang hakbang?',
        prompt: 'Piliin ang pinakamagandang paraan para magsimula si Ana.',
        concept: 'choosing a first tool',
        conceptLabel: 'pagpili ng unang tool',
        situation: 'May maliit na laundry shop si Ana. May laptop siya na may browser at wala siyang sobrang oras. Gusto niya ng one-page na site at hindi pa siya nakakapagsulat ng code. Sinabi ng kaibigan niyang mag-install muna siya ng tatlong program, isang terminal at isang code editor.',
        options: [
          { text: 'Mag-sign in sa isang free chat assistant, gumawa ng folder na my-first-site at i-ask dito ang maliit na page na puwede niyang i-save bilang index.html.', consequence: 'May page na sa screen niya sa loob ng ilang minuto, gamit ang mga tool na kaya na niyang gamitin. Puwede siyang lumipat sa editor mamaya kung gusto niya.', quality: 'best' },
          { text: 'I-install muna ang lahat ng inilista ng kaibigan niya bago siya sumubok ng kahit ano.', consequence: 'Magugugol ang buong gabi niya sa pakikipagbuno sa mga installer at susuko siya bago pa makakita ng kahit isang page.', quality: 'poor' },
          { text: 'Maghintay hanggang makabayad siya sa pinakamahal na plan ng isang AI tool.', consequence: 'Magbabayad siya para sa mga feature na hindi niya kailangan, at hindi mas gaganda ang unang page.', quality: 'poor' },
          { text: 'Sumubok ng tatlong chat assistant nang sabay at pagsamahin ang mga piraso na isinulat nila.', consequence: 'Magkakaiba ang pagsulat ng bawat tool, kaya hindi magkakasya ang mga piraso at hindi niya malalaman kung alin ang may kasalanan sa mga problema.', quality: 'acceptable' },
        ],
        hints: [
          'Ano ang pinakamaliit na setup na magbibigay sa kanya ng page na makikita niya ngayon?',
          'Browser, assistant at isang file lang ang kailangan niya.',
          'Magsimula sa isang free chat assistant at isang folder.',
        ],
        explanation: 'Ang pinakamabilis na paraan para matuto ay makakita ng page nang maaga na pinakakaunti ang gumagalaw na parte. Sapat na ang isang free assistant at isang folder, at madadala mo ang lahat ng ito sa mas magagarang tool mamaya.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-02-match-1',
        kind: 'match',
        title: 'Aling tool ang bagay sa sitwasyon?',
        prompt: 'Itambal ang bawat sitwasyon sa uri ng tool na pinakabagay dito.',
        concept: 'chat assistant versus code editor',
        conceptLabel: 'chat assistant laban sa code editor',
        labels: { terms: 'Ang sitwasyon', meanings: 'Ang pinakabagay' },
        pairs: [
          { term: 'Gusto mong mag-paste ng tanong at magbasa ng sagot, walang ini-install', definition: 'Isang chat assistant sa browser mo', note: 'Walang kailangang i-install sa chat assistant: binabasa mo ang sagot at kino-copy ang kailangan mo.' },
          { term: 'Gusto mong direktang baguhin ng AI ang mga file sa project folder mo', definition: 'Isang AI code editor na nakabukas sa folder mo', note: 'Sa loob ng folder nagtatrabaho ang editor, kaya kaya nitong mag-edit ng mga file para sa iyo.' },
          { term: 'Ayaw bumukas ng file mo bilang web page at index.html.txt ang lumalabas na pangalan nito', definition: 'Ayusin ang pangalan ng file at i-on ang file extensions', note: 'Walang AI tool na makakaayos nito: mali mismo ang pangalan, kaya palitan ito ng index.html.' },
        ],
        hints: [
          'Aling sitwasyon ang may hinahawakang file ang AI?',
          'Isa sa tatlo ay hindi tungkol sa AI tool.',
          'Ang pangalang nagtatapos sa .txt ay nangangahulugang plain text ang turing dito ng computer.',
        ],
        explanation: 'Sumasagot ang mga chat assistant; kumikilos ang mga editor sa folder mo; at may mga problema, tulad ng maling pangalan ng file, na ikaw lang ang makakaayos.',
      },
    },
  ],
  quiz: [
    {
      id: 'ai-coding-beginners-02-q1',
      prompt: 'Ano ang pangunahing pagkakaiba ng chat assistant at ng AI code editor?',
      choices: [
        'Sa phone lang gumagana ang chat assistant',
        'Kaya ng editor na baguhin ang mga file sa folder mo; ang chat assistant ay nagbibigay ng sagot na kokopyahin mo',
        'HTML lang ang isinusulat ng chat assistant, samantalang CSS lang ang sa editor at wala nang iba',
      ],
      answer: 1,
      explanation: 'Ang pangunahing pagkakaiba ay kung saan nagtatrabaho ang AI. Kayang mag-edit ng editor ng mga file sa folder mo; ang chat assistant ay nagbibigay ng text na ikaw mismo ang maglalagay sa mga file.',
    },
    {
      id: 'ai-coding-beginners-02-q2',
      prompt: 'Na-save mo ang page mo at na-double-click, pero bumubukas ito bilang plain text sa text editor. Ano ang pinakamalamang na dahilan?',
      choices: [
        'Palihim na pinangalanang index.html.txt ang file',
        'Luma na ang browser mo',
        'Sa maling language isinulat ng AI ang page',
        'Naubos mo na ang free plan mo',
      ],
      answer: 0,
      explanation: 'Madalas na ginagawang index.html.txt ng mga nakatagong extension ang index.html, na ituturing ng computer na plain text. I-show ang file extensions at palitan ang pangalan ng file.',
    },
    {
      id: 'ai-coding-beginners-02-q3',
      prompt: 'Sinasabi ng isang course na “puwede kang magpadala ng 50 message kada araw sa free plan”. Ano ang makatwirang gawin dito?',
      choices: [
        'Pagkatiwalaan ito nang buo, dahil laging kasalukuyan ang mga numero sa isang course',
        'Ituring itong pangkalahatang idea lang, at i-check sa sariling page ng tool ang totoong kasalukuyang limits',
        'Huwag itong pansinin, dahil walang limits ang mga free plan',
      ],
      answer: 1,
      explanation: 'Nagbabago ang limits nang walang abiso. Ang sariling page ng tool at ang mensaheng ipinapakita nito kapag naabot mo ang limit ang mga pagkakatiwalaan mong source.',
    },
    {
      id: 'ai-coding-beginners-02-q4',
      prompt: 'Bakit iminumungkahi ng course na manatili sa isang AI tool sa buong project?',
      choices: [
        'Dahil hindi ligtas ang ibang tool at dapat iwasan ng bawat beginner',
        'Dahil hindi nila kayang magbasa ng HTML',
        'Dahil kapag nagpalit ka sa gitna ng project, mahirap malaman kung ano ang sanhi ng problema',
      ],
      answer: 2,
      explanation: 'Magkakaiba ang pagsulat ng bawat tool. Ang paggamit ng isa habang nag-aaral ka ay nagpapakita sa iyo ng epekto ng sarili mong mga request.',
    },
    {
      id: 'ai-coding-beginners-02-q5',
      audience: { max: 'beginner' },
      prompt: 'Sa paghahambing na “nagte-text sa kaibigan”, ano ang free plan?',
      choices: [
        'Libreng sample na may limit na puwedeng palitan ng tindahan',
        'Permanenteng pangako ng walang-limit na paggamit na hindi na babawiin ng kumpanya',
        'Ibang internet na mas maliit',
      ],
      answer: 0,
      explanation: 'Hinahayaan ka ng free plan na subukan ang tool, sa loob ng limits na may karapatang palitan ng kumpanya.',
    },
    {
      id: 'ai-coding-beginners-02-q6',
      audience: { min: 'advanced' },
      prompt: 'Papayagan mo sa unang pagkakataon ang isang editor-based agent na baguhin ang mga file sa isang repository. Aling setup choice ang pinakamalaki ang naibabawas sa risk?',
      choices: [
        'I-disable ang review para makapagtrabaho ang agent nang walang abala',
        'Gamitin ang repository kung ano ito ngayon at umasa sa sariling summary ng agent kung ano ang ginawa nito',
        'Panatilihin ang project sa ilalim ng version control at i-review ang bawat diff bago tanggapin ang mga change',
        'I-paste na lang ang buong repository sa isang chat assistant',
      ],
      answer: 2,
      explanation: 'Ang version control at diff review ang nagpapakitang nakikita at nababawi ang anumang change ng agent. Ang pagtitiwala sa summary o pag-disable ng review ay nag-aalis ng safety net mo.',
    },
  ],
  task: {
    title: 'I-set up ang tool at folder mo',
    minutes: 15,
    steps: [
      'Pumili ng isang chat assistant (ChatGPT, Claude o Gemini) at mag-sign in o gumawa ng free account sa official na website o app nito.',
      'Gumawa ng folder na `my-first-site` sa lugar na mahahanap mo, at i-on ang pagpapakita ng file extensions sa file settings ng computer mo.',
      'Patakbuhin ang setup test prompt mula sa lesson na ito at i-save ang sagot sa folder bilang index.html. I-double-click ito para buksan sa browser mo.',
      'Kung plain text ang lumalabas, tingnan ang pangalan ng file: ayusin ito para .html lang ang dulo.',
    ],
  },
  taskExtra: [
    { audience: { max: 'beginner' }, steps: ['I-ask sa assistant: “Ipaliwanag mo, na parang hindi pa ako nakakapag-code kahit kailan, kung ano ang ginagawa ng bawat linya ng file na ito.” Basahin ang sagot sa tabi ng file.'] },
    { audience: { min: 'advanced' }, steps: ['Itala ang context limit at message limit na ipinapakita ng free plan na pinili mo, at isulat kung paano mo ire-restart ang isang session gamit ang pinakakaunting kailangan mong i-paste ulit.'] },
  ],
};
