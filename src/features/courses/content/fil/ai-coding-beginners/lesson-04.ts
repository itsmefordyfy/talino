import type { Lesson } from '../../types';
import { FIL_CHECKED, FIL_DOCS } from './meta';

export const aiCodingBeginnersLesson04Fil: Lesson = {
  id: 'ai-coding-beginners-04',
  day: 4,
  title: 'Pagbasa sa ginawa ng AI: mga file, folder at code sa simpleng salita',
  summary: 'Basahin ang nabuong page nang pira-piraso: mga tag, ang head at ang body, at ilang linya ng CSS, para ma-guide mo ang AI gamit ang totoong mga salita.',
  intro: {
    objectives: [
      'Ibahin ang head ng page sa body, at sabihin kung ano ang ipinapakita ng bawat isa',
      'Basahin ang opening tag, ang content nito at ang closing tag',
      'Basahin ang CSS rule bilang selector, property at value',
    ],
    why: 'Hindi mo kailangang sumulat ng code, pero kailangan mong makilala ang mga parte nito. Kapag nasasabi mong “ang heading sa header” sa halip na “iyong nasa itaas”, naiintindihan ka ng AI at sa tamang lugar tumatama ang mga pagbabago mo.',
  },
  minutes: 25,
  skills: ['read-generated-code', 'change-and-fix'],
  body: [
    { type: 'paragraph', text: 'Noong nakaraang lesson, binigyan ka ng AI ng mga animnapung linya ng code, at hindi mo kinailangang intindihin ang kahit isa para magkaroon ng page. Ngayon, matututo kang basahin ito na parang nagbabasa ka ng menu: hindi bawat salita, pero sapat para malaman kung alin ang alin. Ang pagbasa ng code ang paraan para ikaw ang may hawak. Hinahayaan ka nitong i-check ang gawa ng AI at sabihin dito nang eksakto kung aling parte ang babaguhin.' },
    { type: 'heading', text: 'Ang page ay set ng mga may-label na piraso' },
    { type: 'paragraph', text: 'Gawa sa mga **element** ang HTML. Bawat element ay piraso ng page na may label na nagsasabi kung ano ito. Ang label ay **tag**, at karamihan ng element ay may opening tag at closing tag, na ang content ay nasa pagitan ng dalawa. Kapareho ng opening tag ang closing tag pero may dagdag na slash.' },
    { type: 'code', language: 'html', label: 'Isang element', code: "<h1>Mila's Kakanin</h1>" },
    {
      type: 'list',
      items: [
        'Ang `<h1>` ang opening tag. Ang `h1` ay ang pinakamalaking heading, ang title ng page.',
        "Ang `Mila's Kakanin` ang content: ang mga salitang lumalabas.",
        'Ang `</h1>` ang closing tag. Sinasabi ng slash: dito nagtatapos ang piraso.',
      ],
    },
    { type: 'paragraph', text: 'May mga tag na may dalang dagdag na impormasyon sa loob ng opening tag, na tinatawag na **attribute**. Isinusulat ang mga ito bilang pangalan, equals sign at value na nasa quotes. Sa example na page, ang button ay `<a class="button" href="mailto:mila@example.com">Email us to order</a>`. Ang tag na `a` ay gumagawa ng link. Sinasabi ng attribute na `href` kung saan pupunta ang link (dito, sa email address, dahil nagsisimula ito sa `mailto:`). Ang attribute na `class` ay palayaw na ginagamit ng CSS para i-style ito. May isa pang makikita mo: ang text sa pagitan ng `<!--` at `-->` ay **comment**, isang note para sa mga taong nagbabasa ng code. Nilalaktawan ito ng browser.' },
    { type: 'heading', text: 'Ang head at ang body' },
    { type: 'paragraph', text: 'Bawat page ay may dalawang malaking parte. Hawak ng **head** ang impormasyon tungkol sa page na hindi iginuguhit dito: ang title na lumalabas sa tab ng browser, ang text encoding, isang note para sa mga phone at ang CSS. Hawak naman ng **body** ang lahat ng talagang nakikita mo.' },
    {
      type: 'table',
      headers: ['Sa file', 'Ano ang ginagawa nito sa page'],
      rows: [
        ['`<title>`', 'Ang mga salita sa tab ng browser, at kung ano ang tawag sa isang bookmark'],
        ['`<h1>`, `<h2>`', 'Mga heading: ang h1 ang pangunahing title, ang h2 ay mga title ng section'],
        ['`<p>`', 'Isang paragraph ng text'],
        ['`<ul>` at `<li>`', 'Bulleted list (ul) at ang bawat item nito (li)'],
        ['`<a href="...">`', 'Isang link: ang mga salitang kino-click mo, at kung saan ito pupunta'],
        ['`<header>`, `<main>`, `<footer>`', 'Mga label para sa itaas na parte, sa pangunahing parte at sa ibabang parte ng page'],
        ['`<style>`', 'Hawak ang CSS: ang mga rule kung ano ang itsura ng lahat'],
      ],
      caption: 'Ang iilang tag sa una mong page. Paulit-ulit na ginagamit ng AI ang parehong mga ito.',
    },
    { type: 'paragraph', text: 'Pansinin na nakapugad ang mga tag na parang mga kahon sa loob ng mga kahon: ang mga `<li>` ay nasa loob ng `<ul>`, na nasa loob ng `<main>`, na nasa loob ng `<body>`. Kapag sinabi mo sa AI na “ilagay ang opening hours sa footer”, alam nito kung aling kahon ang tinutukoy mo.' },
    { type: 'heading', text: 'Pagbasa ng kaunting CSS' },
    { type: 'paragraph', text: 'Listahan ng mga rule ang CSS. May tatlong parte ang isang rule: ang **selector** na nagsasabi kung ano ang i-style, at sa loob ng curly brackets ay isa o higit pang **property** kasama ang mga **value** nila. Heto ang isang rule mula sa page:' },
    { type: 'code', language: 'css', label: 'Isang CSS rule', code: 'header {\n  background: #7a3e1d;\n  color: white;\n  padding: 32px 16px;\n  text-align: center;\n}' },
    {
      type: 'list',
      items: [
        'Ang `header` ang selector: i-style ang pirasong may label na header.',
        'Ang `background: #7a3e1d;` ay ginagawang dark brown ang background. Ang kakaibang code ay **hex color**, isang paraan ng pagsulat ng kulay bilang mga letra at numero. Puwede mong laging i-ask sa AI ang kulay sa pangalan nito.',
        'Ang `color: white;` ay ginagawang puti ang kulay ng text. (Ganyan ang spelling ng CSS sa American, walang u. Mahalaga ito sa lesson 6.)',
        'Ang `padding: 32px 16px;` ay bakanteng espasyo sa loob ng kahon: 32 pixels sa itaas at ibaba, 16 sa mga gilid.',
        'Ang `text-align: center;` ay inilalagay sa gitna ang mga salita.',
        'Bawat property ay nagtatapos sa semicolon, at ang buong rule ay nagtatapos sa closing curly bracket.',
      ],
    },
    { type: 'heading', text: 'Mga file at folder' },
    { type: 'paragraph', text: 'Sa ngayon, iisang file, ang `index.html`, sa loob ng iisang folder ang buong site mo. Sapat na iyon para sa one-page na site. Puwedeng lumaki ang site mamaya: isang folder ng mga picture, isang hiwalay na CSS file. Ituturo na ng page ang mga file na iyon sa pamamagitan ng mga pangalan nila, tulad ng `images/biko.jpg`. Kapag hindi eksaktong tugma ang pangalan o ang folder, mawawala ang picture. Isa iyan sa karaniwang dahilan ng sirang page, at ipinapakita ng lesson 6 kung paano ito mahahanap.' },
    {
      type: 'prompt',
      label: 'I-ask sa AI na ipaliwanag, tapos i-test',
      text: 'Heto ang index.html ko. Ipaliwanag mo ito sa akin na parang hindi pa ako nakakapag-code kahit kailan, nang magkakasunod mula taas pababa, sa maiikling simpleng pangungusap. Sabihin mo kung aling parte ang head at alin ang body, at kung ano ang ginagawa ng bawat tag sa page. Pagkatapos, bigyan mo ako ng isang maliit na change na puwede kong gawin para makita kong nagbabago ang page, para ma-check ko kung tama ang paliwanag mo.',
    },
    { type: 'tip', text: 'Huwag basta maniwala sa paliwanag: i-test ito. Palitan ang isang salita, tulad ng text ng heading, i-save ang file, at pindutin ang refresh sa browser. Kung nagbago ang page gaya ng sinabi ng AI, naiintindihan mo na talaga ang parteng iyon.' },
    {
      type: 'version',
      text: 'Inilalista ng beginner guide ng MDN ang parehong pangunahing structure: isang doctype line, isang html element na may lang attribute, isang head na may meta charset, isang viewport meta tag at isang title, at isang body na may nakikitang content. Ang viewport tag ang nagpapa-render sa page sa lapad ng screen ng phone sa halip na paliitin ang page na sinukat para sa desktop.',
      checked: FIL_CHECKED,
      sources: [FIL_DOCS.mdnContent, FIL_DOCS.mdnViewport],
    },
    {
      type: 'paragraph',
      audience: { max: 'beginner' },
      text: 'Sa simpleng salita: isipin mong lilipat ka ng bahay. Nagsusulat ka ng label sa mga kahon: kusina, babasagin, libro. Ang mga HTML tag ay ang mga label na iyon: sinasabi nila kung ano ang bawat piraso. Ang head ay ang papeles tungkol sa paglipat (ang address, sino ang lilipat); ang body ay ang mga gamit na ilalagay sa bagong bahay. Ang CSS ay ang set ng mga tagubilin kung paano aayusin ang mga bagay: ilagay ang sofa sa tabi ng pader, isabit nang mataas ang mga picture. Ang selector ay ang label na tinutukoy ng tagubilin, at ang property ay isang bagay na aayusin. Kapag sinasabi mo sa AI ang gusto mo, ang pagbanggit sa label (ang heading, ang footer, ang button) ang nagpapabago sa tamang kahon.',
    },
    {
      type: 'paragraph',
      audience: { min: 'advanced' },
      text: 'Kapag nire-review mo ang generated na front-end code, basahin ito para sa structure at para sa kung ano ang lumalabas sa page, hindi para sa style. I-check kung semantic ang mga element (header, main, footer, mga heading na magkakasunod, alt text sa mga image), na walang naglo-load mula sa mga third-party host na hindi mo kilala, na walang inline script na higit pa ang ginagawa sa hiniling mo, at na walang key o token sa source (nakikita ito ng bawat bisita). Mas piliin ang hiwalay na stylesheet kapag lumaki na ang page, dahil ang mga laban sa specificity sa loob ng isang style block ang nagpapahirap hulaan ng mga susunod na AI edit.',
    },
    {
      type: 'takeaways',
      items: [
        'Gawa sa mga element ang HTML: opening tag, content at closing tag na may slash; nasa loob ng opening tag ang mga attribute.',
        'Hawak ng head ang impormasyon tungkol sa page (title, encoding, CSS); hawak ng body ang nakikita mo.',
        'Ang CSS rule ay selector, tapos mga property at value sa loob ng curly brackets, na bawat isa ay nagtatapos sa semicolon.',
        'Pangalanan ang piraso (heading, footer, button) kapag humihingi ng pagbabago, at i-test ang paliwanag ng AI sa pamamagitan ng pagbago ng isang bagay.',
      ],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-04-match-1',
        kind: 'match',
        title: 'Aling piraso ito?',
        prompt: 'Itambal ang bawat gusto mo sa parte ng page na kumokontrol dito.',
        concept: 'tags and attributes',
        conceptLabel: 'mga tag at attribute',
        labels: { terms: 'Ang gusto mo', meanings: 'Ang kumokontrol dito' },
        pairs: [
          { term: 'Ang pangalan ng shop bilang pinakamalaking title sa page', definition: 'Isang h1 heading sa body', note: 'Ang h1 tag ang pangunahing title.' },
          { term: 'Ang mga salitang lumalabas sa tab ng browser', definition: 'Ang title tag sa head', note: 'Ang text sa head ay impormasyon tungkol sa page, hindi iginuguhit dito.' },
          { term: 'Ang pupuntahan ng link kapag kino-click', definition: 'Ang href attribute sa a tag', note: 'Ang href ang attribute na may hawak ng address ng link.' },
          { term: 'Ang bakanteng espasyo sa loob ng header box', definition: 'Ang padding property sa isang CSS rule', note: 'Ang padding ang espasyo sa loob ng kahon.' },
        ],
        hints: [
          'Isipin kung tag, attribute o CSS property ang bawat isa.',
          'Sa head, hindi sa body, nabibilang ang text ng tab.',
          'Sa href nakalagay ang mga address ng link; sa CSS ang spacing.',
        ],
        explanation: 'Mga tag ang mga heading at title, mga attribute ang mga address ng link, at CSS property ang spacing. Ang pag-alam kung anong klaseng bagay ang itinatanong mo ay nakakatulong para malinaw mo itong ma-ask.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-04-predict-1',
        kind: 'predict-output',
        title: 'Ilang bullet?',
        story: 'Nag-iwan ang AI ng note sa list. Binuksan mo ang page.',
        prompt: 'Ilang bullet point ang ipapakita ng browser?',
        concept: 'reading html',
        conceptLabel: 'pagbasa ng HTML',
        language: 'html',
        code: `<ul>
  <li>Biko</li>
  <!-- <li>Puto</li> -->
  <li>Sapin-sapin</li>
</ul>`,
        expected: '2',
        choices: ['2', '3', '1', '0'],
        wrongNotes: {
          '3': 'Nasa pagitan ng mga comment marker ang linya ng Puto, kaya nilalaktawan ito ng browser.',
          '1': 'Dalawang li element ang nasa labas ng comment: ang Biko at ang Sapin-sapin.',
          '0': 'Dalawang buhay na item ang hawak ng ul element.',
        },
        hints: [
          'Tingnan ang linyang nagsisimula sa exclamation mark at dalawang dash.',
          'Lahat ng nasa pagitan ng mga comment marker ay hindi pinapansin ng browser.',
          'Bilangin lang ang mga list item na nasa labas ng comment.',
        ],
        explanation: 'Itinatago ng comment ang laman nito sa page, kaya ang Biko at Sapin-sapin lang ang ipinapakita. (Na-check sa pamamagitan ng pag-load ng snippet sa browser at pagbilang ng mga list item.)',
      },
    },
  ],
  quiz: [
    {
      id: 'ai-coding-beginners-04-q1',
      prompt: 'Aling linya ang kumpletong heading element?',
      choices: [
        '<h2>What we sell<h2>',
        '</h2>What we sell<h2>',
        '<h2>What we sell</h2>',
        '<h2 What we sell h2>',
      ],
      answer: 2,
      explanation: 'Ang element ay opening tag, ang content at closing tag, na kapareho ng pangalan pero may slash.',
    },
    {
      id: 'ai-coding-beginners-04-q2',
      prompt: 'Gusto mong puti ang text ng heading. Saan ilalagay ang tagubilin?',
      choices: [
        'Sa isang CSS rule, bilang property na color na may value na white',
        'Sa title tag sa head, para mag-apply ito sa buong page',
        'Sa href attribute ng heading',
      ],
      answer: 0,
      explanation: 'CSS ang tungkol sa itsura ng mga bagay. Pinipili ng rule ang piraso (ang selector) at itinatakda ang color nito. Pinapangalanan lang ng title tag ang tab.',
    },
    {
      id: 'ai-coding-beginners-04-q3',
      prompt: 'Sa `<a class="button" href="mailto:mila@example.com">`, ano ang `href`?',
      choices: [
        'Isang element na nagsasara ng link at nagtatapos ng paragraph',
        'Ang kulay ng link',
        'Isang attribute na nagsasabi kung saan pupunta ang link',
      ],
      answer: 2,
      explanation: 'Nasa loob ng opening tag ang mga attribute bilang pangalan at value. Hawak ng href ang pupuntahan ng link.',
    },
    {
      id: 'ai-coding-beginners-04-q4',
      prompt: 'Sinabi ng AI na inilipat nito ang opening hours “sa footer”. Aling parte ng page ang titingnan mo?',
      choices: [
        'Ang mga salita sa pinakataas ng page, sa ibabaw ng unang heading',
        'Ang ibabang parte ng page, kung nasaan ang footer element',
        'Ang mga salita sa tab ng browser',
        'Ang listahan ng mga item sa ilalim ng What we sell',
      ],
      answer: 1,
      explanation: 'Ang footer ang label para sa ibaba ng page. Ang pag-alam kung ano ang tawag sa bawat kahon ang nagsasabi kung saan titingin.',
    },
    {
      id: 'ai-coding-beginners-04-q5',
      audience: { max: 'beginner' },
      prompt: 'Sa paghahambing sa paglipat ng bahay, ano ang mga HTML tag?',
      choices: [
        'Ang mismong bagong bahay, na nasa loob na ang lahat ng muwebles',
        'Ang mga mover',
        'Ang mga label sa mga kahon na nagsasabi kung ano ang bawat piraso',
      ],
      answer: 2,
      explanation: 'Nilalagyan ng label ng mga tag ang bawat piraso ng page: heading, list, footer. Binabasa ng browser ang mga label para malaman kung paano ipapakita ang bawat piraso.',
    },
    {
      id: 'ai-coding-beginners-04-q6',
      audience: { min: 'advanced' },
      prompt: 'Habang nire-review mo ang isang generated na page, may nakita kang script tag na naglo-load ng code mula sa host na hindi mo kilala. Ano ang tamang gawin?',
      choices: [
        'Hayaan lang, dahil hindi kailanman magdadagdag ang AI ng bagay na hindi naman talaga kailangan ng page para gumana',
        'Alamin kung para saan ito at alisin maliban kung kailangan, dahil patatakbuhin ito ng bawat bisita',
        'Magdagdag pa ng mga script mula sa parehong host para tumugma',
        'Ilipat ito sa footer para mas huli itong mag-load',
      ],
      answer: 1,
      explanation: 'Tumatakbo para sa bawat bisita ang third-party code na hindi hiniling. Alamin kung ano ang ginagawa nito, at alisin maliban kung kailangan mo ito.',
    },
  ],
  task: {
    title: 'Basahin ang sarili mong page',
    minutes: 15,
    steps: [
      'Buksan ang `index.html` mo sa editor mo sa tabi ng page sa browser mo.',
      'Hanapin ang head at ang body, at ituro ang title, ang pangunahing heading at isang link sa code.',
      'Patakbuhin ang explain prompt mula sa lesson na ito na naka-paste ang file mo, at basahin ang sagot sa tabi ng code.',
      'Gawin ang maliit na test change na iminungkahi ng AI, i-save, i-refresh, at isulat kung nagbago ang page gaya ng sinabi nito.',
    ],
  },
  taskExtra: [
    { audience: { max: 'beginner' }, steps: ['Iguhit sa papel ang page mo bilang mga kahon (header, main, footer) at isulat ang pangalan ng tag sa bawat kahon.'] },
    { audience: { min: 'advanced' }, steps: ['Patakbuhin ang page sa isang validator o sa accessibility check ng browser mo at ilista kung ano ang unang ipapa-fix mo sa AI, kasama ang dahilan.'] },
  ],
};
