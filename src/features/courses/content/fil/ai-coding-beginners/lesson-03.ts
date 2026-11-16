import type { Lesson } from '../../types';
import { FIL_CHECKED, FIL_DOCS } from './meta';

export const aiCodingBeginnersLesson03Fil: Lesson = {
  id: 'ai-coding-beginners-03',
  day: 3,
  title: 'Ang una mong prompt: isang one-page na website',
  summary: 'Sumulat ng malinaw na request na may goal, facts at itsura, at gawing totoong page sa screen mo ang sagot ng AI.',
  intro: {
    objectives: [
      'Sumulat ng prompt na may goal, totoong facts, itsura at anyo ng sagot',
      'I-save ang sagot ng AI bilang index.html at buksan ito sa browser',
      'Ihambing ang malabong request sa malinaw na request at sabihin kung bakit mas gumagana ang isa',
    ],
    why: 'Ito ang sandaling nagiging totoo ang course: ang sarili mong mga salita ay nagiging page na matitingnan mo. Ang malinaw na unang prompt ay makakatipid sa iyo ng ilang round ng pag-aayos mamaya.',
  },
  minutes: 25,
  skills: ['write-prompts', 'read-generated-code'],
  body: [
    { type: 'paragraph', text: 'Ngayon, hihingi ka ng una mong page. Gagamit tayo ng gawa-gawang shop, ang Mila’s Kakanin, isang pwesto sa Naga City na nagbebenta ng homemade na kakanin. Papalitan mo ito ng sarili mong totoong tao o negosyo para sa sarili mong page. Ang skill na pinapraktis mo ay gagamitin mo habambuhay sa AI: ang pag-ask nang sobrang linaw na malapit na sa gusto mo ang sagot sa unang subok pa lang.' },
    { type: 'heading', text: 'Ano ang nagpapalinaw sa isang request' },
    { type: 'paragraph', text: 'Ihambing ang dalawang request. Ang una ay: “Gawan mo ako ng website.” Kailangang hulaan ng AI ang lahat: para saan, para kanino, ano ang sinasabi, ano ang itsura. Huhulaan nito, at generic na page tungkol sa wala ang magiging resulta. Ang pangalawang request ay ibinibigay sa AI ang kailangan nito. Apat na sangkap ang nagpapagana sa karamihan ng request:' },
    {
      type: 'list',
      items: [
        '**Goal:** para saan ang page at sino ang babasa (“one-page na site para makita ng mga customer sa Naga City kung ano ang binebenta namin at makapag-order sila sa email”).',
        '**Context at totoong facts:** mga pangalan, presyo, oras, contact details. Totoo ang mga ito at nakasulat nang buo, para wala nang maiimbento ang AI.',
        '**Itsura at limits:** ang pakiramdam na gusto mo (“mainit at simple, brown at cream, madaling basahin sa phone”) at anumang dapat iwasan.',
        '**Anyo ng sagot:** kung paano mo gustong ihatid ang sagot (“lahat sa isang file na tinatawag na index.html, at simpleng mga hakbang para i-save at buksan ito”).',
      ],
    },
    {
      type: 'prompt',
      label: 'Isang unang prompt, kopyahin at i-adapt mo',
      text: 'Hindi pa ako nakakapagsulat ng code. Pakigawa ako ng one-page na website para sa maliit kong negosyo. Ang pangalan nito ay Mila’s Kakanin. Nagbebenta kami ng homemade na kakanin sa Naga City, Philippines: biko na ₱80 kada tray, puto na ₱60 kada dosena, at sapin-sapin na ₱120 kada tray. Nag-o-order ang mga customer sa email isang araw bago. Bukas kami Lunes hanggang Sabado, 6 AM hanggang 12 noon. Gawin itong mainit at simple, na may brown at cream na kulay, madaling basahin sa phone. Ibigay mo sa akin ang lahat sa iisang file na tinatawag na index.html, at sabihin mo sa simpleng mga hakbang kung paano ito i-save at buksan.',
    },
    { type: 'paragraph', text: 'Pansinin na walang kailangang kaalaman sa code sa prompt na iyan. Sinasabi nito kung sino, ano, magkano, kailan at anong pakiramdam. Pansinin din ang mga salitang “Hindi pa ako nakakapagsulat ng code”: ang pagsasabi sa AI ng level mo ay nagpapabago sa paraan ng pagpapaliwanag nito.' },
    { type: 'heading', text: 'Ano ang bumabalik' },
    { type: 'paragraph', text: 'Sumasagot ang AI ng maikling mensahe at isang block ng code. Nasa ibaba ang totoong sagot na ganito: isang file na may lahat ng kailangan ng browser. (Magkakaiba nang kaunti ang code na isinusulat ng iba’t ibang tool, at kahit ng iisang tool sa ibang araw. Normal iyon.) Huwag mo munang subukang intindihin ang lahat. Dadaanan ito ng lesson 4 nang pira-piraso. Dalawang maliit na bagay ang makakatulong na para mabasa mo ito: ang mga salita sa loob ng `<title>` ay lumalabas sa tab ng browser, hindi sa page, at ang anumang nakasulat sa pagitan ng `<!--` at `-->` ay **comment**, isang note para sa mga taong nagbabasa ng code na nilalaktawan ng browser.' },
    {
      type: 'code',
      language: 'html',
      label: 'index.html (ang ipinadala pabalik ng AI)',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mila's Kakanin</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      color: #3b2a20;
      background: #fff8ee;
    }
    header {
      background: #7a3e1d;
      color: white;
      padding: 32px 16px;
      text-align: center;
    }
    main {
      max-width: 600px;
      margin: 0 auto;
      padding: 16px;
    }
    h2 {
      color: #7a3e1d;
    }
    .button {
      display: inline-block;
      background: #7a3e1d;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
    }
    footer {
      text-align: center;
      padding: 16px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <header>
    <h1>Mila's Kakanin</h1>
    <p>Homemade rice cakes, made fresh every morning.</p>
  </header>
  <main>
    <h2>What we sell</h2>
    <ul>
      <li>Biko: ₱80 per tray</li>
      <li>Puto: ₱60 per dozen</li>
      <li>Sapin-sapin: ₱120 per tray</li>
    </ul>
    <h2>How to order</h2>
    <p>Message us one day before. We deliver within Naga City.</p>
    <a class="button" href="mailto:mila@example.com">Email us to order</a>
  </main>
  <footer>
    Open Monday to Saturday, 6 AM to 12 noon
  </footer>
</body>
</html>`,
    },
    { type: 'heading', text: 'Mula sa chat papunta sa screen mo' },
    { type: 'paragraph', text: 'Text lang sa chat page ang code block. Para gawin itong website, sine-save mo ito sa isang file at binubuksan ang file sa browser mo. Laging pareho ang mga hakbang:' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Gamitin ang copy button sa code block (o piliin ang lahat ng laman nito at i-copy).',
        'Buksan ang plain text editor mo, i-paste, at i-save ang file bilang `index.html` sa loob ng `my-first-site` folder mo. Tiyaking hindi nagtatapos sa `.txt` ang pangalan.',
        'I-double-click ang `index.html`. Bubuksan ito ng browser mo. Iyon na ang page mo, nasa sarili mong computer, wala pa sa internet.',
      ],
    },
    {
      type: 'diagram',
      format: 'mermaid',
      caption: 'Nagiging code sa chat ang mga salita mo; sine-save mo ito bilang file; ginagawang page ng browser mo ang file.',
      source: 'sequenceDiagram\n  participant You\n  participant AI as AI assistant\n  participant File as index.html\n  participant Browser\n  You->>AI: Prompt: goal, facts, look, form of the answer\n  AI-->>You: Reply with code\n  You->>File: Paste and save as index.html\n  You->>Browser: Open the file\n  Browser-->>You: Shows the page',
    },
    {
      type: 'version',
      text: 'Inilalarawan ng beginner guide ng MDN ang parehong workflow: gumawa ng folder, gumawa ng file na pinangalanang index.html sa loob nito, ilagay ang code, at buksan ang file na iyon sa web browser. Binabanggit din nito na kahit anong editor na nagse-save ng plain text file ay puwede. May mga chat tool na kayang magpakita ng web page mismo sa conversation (halimbawa, ang artifacts ng Claude ay available sa free plan nito at kailangang naka-on ang file-creation setting nito), pero gumagana sa lahat ng tool ang pagkopya ng file palabas at pagbukas nito mismo, at iyon ang pinapraktis natin.',
      checked: FIL_CHECKED,
      sources: [FIL_DOCS.mdnContent, FIL_DOCS.claudeArtifacts],
    },
    { type: 'warning', text: 'May example na email address ang page sa itaas, ang mila@example.com. Kapag ginamit mo ang prompt para sa totoong page, siguraduhing sa iyo ang mga contact details, at tingnan kung ano ang aktuwal na isinulat ng AI. Huwag kailanman ipagpalagay na tama ang phone number o email sa page dahil lang mukhang tapos na ito.' },
    {
      type: 'paragraph',
      audience: { max: 'beginner' },
      text: 'Sa simpleng salita: may dalawang parte ang sagot ng AI. Ang madaldal na parte ay para sa iyo (“Heto ang page mo, i-save mo ito nang ganito”). Ang block ng code ay ang laman ng file, parang mga salita ng recipe. Hindi pagkain ang recipe hangga’t walang nagluluto, at hindi page ang code hangga’t hindi ito binabasa ng browser mo. Ang pag-save nito bilang `index.html` ay parang paglalagay ng recipe sa card na may tamang pangalan sa harap; ang pag-double-click ay pag-abot ng card sa nagluluto. Ang salitang *browser* ay ang program lang na ginagamit mo na para tumingin ng mga website.',
    },
    {
      type: 'paragraph',
      audience: { min: 'intermediate', max: 'intermediate' },
      text: 'Kung nakagawa ka na ng maliliit na project, baka mas gusto mong humingi ng hiwa-hiwalay na structure mula sa simula: index.html, style.css at isang images folder, na may relative paths. Pinapanatili nitong maliit ang mga diff kapag nagpabago ka na mamaya. Iisang file ang pinili rito para iisa lang ang ise-save at bubuksan ng complete beginner, at dahil maliit ang failure surface sa unang takbo.',
    },
    {
      type: 'paragraph',
      audience: { min: 'advanced' },
      text: 'Ituring na lightweight spec ang unang prompt: goal, audience, konkretong content, constraints, at output contract (isang file, tumatakbo nang walang build step). Ang contract na iyon ang nagpapahintulot sa iyong mag-verify sa loob ng ilang segundo: bumubukas ito, tugma ito sa content table, nababasa ito sa lapad ng phone. Anumang iniwang bukas ng prompt ay desisyong tahimik na ginagawa ng model para sa iyo, kaya ang mga nalimutang requirement ay nagiging mga assumption na hindi na-review. Inaalis din ng pagbibigay ng totoong data sa prompt ang pinakakaraniwang hallucination: imbentong business facts.',
    },
    {
      type: 'takeaways',
      items: [
        'Ang malinaw na request ay may goal, totoong facts, itsura at anyo ng sagot na gusto mo.',
        'Ang pagsasabi sa AI na beginner ka ay nagpapabago sa paraan ng pagpapaliwanag nito.',
        'Text lang ang code block ng AI hangga’t hindi mo ito sine-save bilang file na pinangalanang index.html at binubuksan ang file na iyon sa browser mo.',
        'I-check mo mismo ang mga detalye sa page, lalo na ang mga pangalan, presyo at contact information.',
      ],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-03-scenario-1',
        kind: 'scenario',
        title: 'Aling request ang mas malinaw?',
        prompt: 'Piliin ang request na pinakamalamang na magbigay ng kapaki-pakinabang na unang page.',
        concept: 'writing a clear prompt',
        conceptLabel: 'pagsulat ng malinaw na prompt',
        situation: 'Nag-aayos ng bisikleta si Ben sa Iloilo City. Gusto niya ng page na nagsasabi sa mga customer kung ano ang inaayos niya, magkano at kailan siya bukas. Heto ang apat na puwede niyang i-type.',
        options: [
          { text: 'Gawan mo ako ng website para sa bike shop ko.', consequence: 'Mag-iimbento ang AI ng pangalan ng shop, mga serbisyo at presyo. Halos bawat linya ay kailangang ituwid ni Ben.', quality: 'poor' },
          { text: "Gawan mo ako ng one-page na site para sa Ben's Bike Repair sa Iloilo City. Mga serbisyo: flat tire fix ₱100, chain replacement ₱250, full tune-up ₱500. Bukas Martes hanggang Linggo, 8 AM hanggang 5 PM. Tumatawag ang mga customer sa 0917 000 0000. Gumamit ng blue at white, madaling basahin sa phone. Ilagay ang lahat sa isang file na tinatawag na index.html at sabihin kung paano ito i-save at buksan.", consequence: 'Nasa page na agad sa unang subok ang totoong pangalan, serbisyo at oras ni Ben, sa itsurang hiningi niya, sa file na kaya niyang buksan.', quality: 'best' },
          { text: 'Gawan mo ako ng professional, modern at amazing na website para sa bike shop ko na may magandang design.', consequence: 'Mukhang kahanga-hanga ang mga salita pero walang tiyak na sinasabi, kaya pupunan ng AI ang mga puwang gamit ang sarili nitong mga idea.', quality: 'poor' },
          { text: "Gawan mo ako ng site para sa Ben's Bike Repair na may mga serbisyo at presyo at oras.", consequence: 'Tama ang pangalan ng shop, pero iimbentuhin ng AI ang mga serbisyo, presyo at oras dahil hindi ito ibinigay ni Ben.', quality: 'acceptable' },
        ],
        hints: [
          'Aling request ang walang iniiwang maiimbento ang AI?',
          'Maghanap ng totoong facts, itsura, at pangalan ng file.',
          'Ang mahaba na may mga pangalan, presyo, oras at format ng file.',
        ],
        explanation: 'Ang tiyak na facts, sinabing itsura at pinangalanang output file ay walang iniiwang huhulaan ang AI. Ang malabong papuri tulad ng “professional” at “amazing” ay walang sinasabing magagamit nito.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-03-predict-1',
        kind: 'predict-output',
        title: 'Ano ang ipapakita ng page?',
        story: 'Sine-save mo ang file na ito at binubuksan sa browser mo.',
        prompt: 'Aling mga salita ang lumalabas sa mismong page (hindi sa tab ng browser)? Isang linya bawat isa, mula taas pababa.',
        concept: 'what a browser shows',
        conceptLabel: 'kung ano ang ipinapakita ng browser',
        language: 'html',
        code: `<html>
<head><title>Kakanin shop</title></head>
<body>
  <!-- TODO: add prices -->
  <h1>Mila's Kakanin</h1>
  <p>Fresh biko every morning.</p>
</body>
</html>`,
        expected: "Mila's Kakanin\nFresh biko every morning.",
        choices: [
          "Mila's Kakanin\nFresh biko every morning.",
          "Kakanin shop\nMila's Kakanin\nFresh biko every morning.",
          "TODO: add prices\nMila's Kakanin\nFresh biko every morning.",
          "Mila's Kakanin",
        ],
        wrongNotes: {
          "Kakanin shop\nMila's Kakanin\nFresh biko every morning.": 'Sa tab ng browser lumalabas ang title, hindi sa page.',
          "TODO: add prices\nMila's Kakanin\nFresh biko every morning.": 'Ang text sa pagitan ng mga comment marker ay note para sa mga taong nagbabasa ng code. Nilalaktawan ito ng browser.',
          "Mila's Kakanin": 'Nasa page rin ang paragraph na may linya tungkol sa biko.',
        },
        hints: [
          'Ang text sa pagitan ng mga less-than at greater-than sign na may salitang title ay ipinapakita sa tab.',
          'Ang linyang nagsisimula sa exclamation mark at dalawang dash ay note na hindi pinapansin ng browser.',
          'Ang heading at ang paragraph lang ang iginuguhit sa page.',
        ],
        explanation: 'Sa tab ng browser pumupunta ang `title`, nilalaktawan ang comment, at iginuguhit ang heading at ang paragraph. (Na-check ito sa pamamagitan ng pag-load ng snippet sa browser.)',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-03-arrange-1',
        kind: 'arrange',
        title: 'Mula prompt hanggang page',
        prompt: 'Ayusin ang mga hakbang ayon sa pagkakasunod-sunod na gagawin mo para makita ang una mong page.',
        concept: 'saving and opening a page',
        conceptLabel: 'pag-save at pagbukas ng page',
        language: 'text',
        solution: [
          'Make a folder called my-first-site',
          'Ask the AI for a one-page website in one file',
          'Copy the code the AI wrote',
          'Paste it into a plain text file saved as index.html in your folder',
          'Double-click index.html to open it in your browser',
        ],
        alternatives: [
          [
            'Ask the AI for a one-page website in one file',
            'Make a folder called my-first-site',
            'Copy the code the AI wrote',
            'Paste it into a plain text file saved as index.html in your folder',
            'Double-click index.html to open it in your browser',
          ],
        ],
        reasons: [
          'Sa folder titira ang file.',
          'Kailangan mo muna ang code bago mo ito ma-copy.',
          'Kino-copy mo ang sagot bago i-paste.',
          'Dapat may file na at tama ang pangalan nito bago mo ito buksan.',
          'Ang pagbukas ang huling hakbang: ipinapakita nito kung gumagana ang page.',
        ],
        hints: [
          'Hindi ka puwedeng mag-paste kung hindi ka pa nakakapag-copy.',
          'Puwedeng salit-salitan ang folder at ang request sa AI, pero parehong nauuna sa pag-copy.',
          'Ang pagbukas ng page sa browser ang huling hakbang.',
        ],
        explanation: 'Folder at request sa kahit anong pagkakasunod, tapos copy, tapos paste sa index.html, tapos buksan. Ang pagbukas sa huli ang nagsasabi kung gumana ito.',
      },
    },
  ],
  quiz: [
    {
      id: 'ai-coding-beginners-03-q1',
      prompt: 'Aling sangkap ang pumipigil sa AI na mag-imbento ng mga presyo mo?',
      choices: [
        'Ang pag-ask dito na maging “professional”',
        'Ang pagsulat ng totoong mga presyo sa prompt',
        'Ang pag-ask dito nang dalawang beses at pagpili ng sagot na mas maganda sa pandinig mo',
      ],
      answer: 1,
      explanation: 'Pinupunan ng AI ng hula ang mga puwang. Ang totoong facts sa prompt ay walang puwang na pupunan.',
    },
    {
      id: 'ai-coding-beginners-03-q2',
      prompt: 'Na-paste mo ang code ng AI sa isang file at na-double-click mo ito. Ano ang nagpapabukas dito bilang page?',
      choices: [
        'Dapat nagtatapos sa .html ang pangalan ng file, tapos bubuksan ito ng browser mo',
        'Kahit anong pangalan ay okay lang, dahil binabasa ng browser ang code sa loob at naiintindihan ito',
        'Kailangan mo muna itong i-upload sa internet',
        'Ang AI ang dapat magbukas nito para sa iyo',
      ],
      answer: 0,
      explanation: 'Ang pagtatapos sa .html ang nagsasabi sa computer mo na buksan ang file sa browser. Umiiral na ang page sa computer mo bago pa man ito mapunta sa internet.',
    },
    {
      id: 'ai-coding-beginners-03-q3',
      prompt: 'Alin sa mga ito ang bahagi ng “anyo ng sagot” sa isang prompt?',
      choices: [
        'Isang kulay na gusto mo',
        'Ang oras ng bukas mo',
        'Kung para kanino ang page at ano ang dapat nitong tulungang magawa ng bawat isa sa kanila pagdating nila',
        'Lahat sa isang file na tinatawag na index.html, na may simpleng mga hakbang para buksan ito',
      ],
      answer: 3,
      explanation: 'Sinasabi ng anyo ng sagot kung paano mo gustong ihatid ang sagot. Ang kulay ay itsura, ang oras ay facts, at ang audience ay ang goal.',
    },
    {
      id: 'ai-coding-beginners-03-q4',
      prompt: 'Sa example na page, sinasabi ng footer na bukas ang shop ng 6 AM hanggang 12 noon. Saan ito nakuha ng AI?',
      choices: [
        'Hinanap nito sa internet ang shop bago isulat ang page',
        'Hinulaan nito ang oras sa pagtingin sa karaniwang ginagawa ng ibang bakery',
        'Mula sa prompt, kung saan isinulat ito ng may-ari',
      ],
      answer: 2,
      explanation: 'Dapat galing sa prompt mo ang mga facts sa page. Kapag kulang ang mga ito, humuhula ang AI, kaya ikaw ang nagbibigay nito.',
    },
    {
      id: 'ai-coding-beginners-03-q5',
      audience: { max: 'beginner' },
      prompt: 'Sa paghahambing sa recipe, ano ang pag-double-click sa index.html?',
      choices: [
        'Pag-abot ng card sa nagluluto, ang browser, para maging page ito',
        'Pagsulat ng bagong-bagong recipe para sa page mula sa simula',
        'Pagbura sa card',
      ],
      answer: 0,
      explanation: 'Ang file ang recipe; ang browser ang nagluluto. Ang pagbukas ng file ang nagpapakita ng browser nito bilang page.',
    },
    {
      id: 'ai-coding-beginners-03-q6',
      audience: { min: 'advanced' },
      prompt: 'Bakit nakakatulong sa review mo ang “output contract” ng prompt (isang file, tumatakbo nang walang build step)?',
      choices: [
        'Mas pinaiikli at pinapasimple nito ang code, kaya halos hindi na ito kailangang i-review pagkatapos',
        'Nabe-verify mo ang resulta sa loob ng ilang segundo sa pagbukas nito, nang walang kailangang i-set up',
        'Sinisigurado nitong hindi magkakamali ang model',
      ],
      answer: 1,
      explanation: 'Ang constrained at runnable na artefact ay may mabilis at murang check. Hindi nito pinipigilan ang mga pagkakamali; ipinapakita nitong agad ang mga ito.',
    },
  ],
  task: {
    title: 'Gawin at buksan ang sarili mong unang page',
    minutes: 20,
    steps: [
      'I-adapt ang prompt mula sa lesson na ito sa totoong tao o negosyo mo gamit ang limang facts na inilista mo sa lesson 1. Huwag mag-iwan ng kahit isang fact.',
      'I-paste ito sa chat assistant mo at basahin ang sagot.',
      'I-copy ang code, i-save ito sa `my-first-site` bilang `index.html`, at buksan sa browser mo.',
      'I-check ang bawat pangalan, numero at oras sa page laban sa totoo. Isulat ang anumang mali.',
      'Isulat ang prompt mo sa isang note na tinatawag na “prompt log” kasama ang petsa. Dadagdagan mo ito sa buong course.',
    ],
  },
  taskExtra: [
    { audience: { max: 'beginner' }, steps: ['Kung kakaiba ang itsura ng page o blangko ito, huwag mag-alala: tungkol mismo riyan ang lesson 6. Sa ngayon, sabihin sa AI sa isang pangungusap kung ano ang nakikita mo at i-ask dito na ipaliwanag kung ano ang nagkamali.'] },
    { audience: { min: 'advanced' }, steps: ['Isulat ulit ang prompt mo bilang maikling spec na may acceptance criteria (content table, lapad na 360 px, walang external requests) at ihambing ang makukuha mo sa una at mas maluwag na version.'] },
  ],
};
