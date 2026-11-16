import type { Lesson } from '../../types';
import { FIL_CHECKED, FIL_DOCS } from './meta';

export const aiCodingBeginnersLesson06Fil: Lesson = {
  id: 'ai-coding-beginners-06',
  day: 6,
  title: 'Kapag nasira: pagbasa ng error kasama ang AI',
  summary: 'Alamin kung ano ang mali sa isang page gamit ang browser mo, at i-report ito para maayos ito ng AI nang sabay-sabay.',
  intro: {
    objectives: [
      'Gawin ang mga unang check kapag mali ang itsura ng page o blangko ito',
      'Buksan ang developer tools ng browser at basahin ang isang mensahe roon',
      'Sumulat ng bug report na nagbibigay sa AI ng kailangan nito para maayos ang problema',
    ],
    why: 'May masisira. Normal iyon, at hindi ibig sabihing may nagawa kang mali. Ang mga taong bumubuo gamit ang AI ay hindi ang mga taong hindi kailanman nasisiraan ng page; sila ang mga marunong tumingin at marunong mag-ask.',
  },
  minutes: 25,
  skills: ['change-and-fix'],
  body: [
    { type: 'paragraph', text: 'Maaga o huli, magmumukhang mali ang page, wala itong ipapakita o may link na walang pupuntahan. Huwag mag-panic at huwag magsimulang muli. Impormasyon ang sirang page, at sapat na ang alam mo ngayon para tingnan ito. Binibigyan ka ng lesson na ito ng maikling routine para malaman kung ano ang mali, at paraan para maibigay sa AI ang lahat ng kailangan nito para makatulong.' },
    { type: 'heading', text: 'Bakit tahimik ang browser tungkol sa mga pagkakamali' },
    { type: 'paragraph', text: 'Hindi humihinto at sumisigaw ang browser kapag may nakita itong hindi nito naiintindihan. Ginagawa nito ang makakaya para ipakita ang kaya nito at tahimik na nilalaktawan ang iba. Magiliw iyan para sa mga bisita at nakakalito para sa iyo. Ang maling spelling sa CSS ay basta na lang hindi pinapansin, at makikita mo ang page na wala ang style na iyon. Walang nagsasabi kung bakit. Kaya nagsisimula ang routine sa pagtingin.' },
    { type: 'heading', text: 'Tatlong uri ng sira' },
    {
      type: 'list',
      items: [
        '**Walang lumalabas, o plain text ang page.** Karaniwang problema sa file: maling pangalan ng file, lumang kopya ang nabuksan, o bahagi lang ng code ang nakopya.',
        '**Mali ang itsura.** Kulay na hindi lumalabas, text na hindi mabasa, layout na nagbago. Karaniwang may mali sa CSS, o may tag na hindi naisara.',
        '**May hindi gumagana.** Picture na wala, link na walang pupuntahan. Karaniwang pangalan o address na hindi tugma.',
      ],
    },
    { type: 'heading', text: 'Ang mga unang check mo' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Na-**save** mo ba ang file pagkatapos mag-paste? Pindutin ang refresh sa browser (Ctrl+R sa Windows, Cmd+R sa Mac).',
        '**Tamang file** ba ang nakabukas? Madaling mabuksan ang lumang kopya.',
        'Nagtatapos ba sa `.html` ang pangalan ng file at hindi sa `.html.txt`? (Lesson 2.)',
        'Na-paste mo ba ang **lahat** ng code, mula sa `<!DOCTYPE html>` hanggang sa `</html>`?',
      ],
    },
    { type: 'heading', text: 'Pagtingin sa loob ng browser' },
    { type: 'paragraph', text: 'May built-in na **developer tools** ang bawat pangunahing browser: panel para tumingin sa loob ng page na tinitingnan mo. Sa Chrome, binubuksan ito sa pamamagitan ng pag-right-click kahit saan sa page at pagpili ng Inspect. Ang **Console** ang bahaging naglilista ng mga mensahe kapag may nagkamali, kadalasan sa pula. Kapag hindi na-load ang isang picture, karaniwang sinasabi ito ng console at pinapangalanan ang file na hindi nito nahanap. Ang pangalang iyon mismo ang ibibigay mo sa AI.' },
    {
      type: 'version',
      text: 'Inilalista ng documentation ng Chrome ang mga shortcut na ito: i-right-click ang isang element at piliin ang Inspect; buksan ang Console gamit ang Ctrl+Shift+J sa Windows o Linux at Cmd+Option+J sa Mac; buksan ang huling ginamit na panel gamit ang F12 o Ctrl+Shift+I sa Windows at Linux (Fn+F12 o Cmd+Option+I sa Mac). May parehong mga tool ang ibang browser sa magkakatulad na pangalan, at puwedeng lumipat ang mga menu sa pagitan ng mga version.',
      checked: FIL_CHECKED,
      sources: [FIL_DOCS.devtools],
    },
    { type: 'heading', text: 'Pagsasabi sa AI kung ano ang mali' },
    { type: 'paragraph', text: 'Apat na bagay ang ibinibigay ng magandang bug report sa AI: ano ang sinusubukan mong gawin, ano ang inaasahan mo, ano ang aktuwal mong nakikita, at ang ebidensya. Ang ebidensya ay ang eksaktong mga salita ng anumang mensahe mula sa console, ang bahagi ng code na may kinalaman (o ang buong file para sa ganito kaliit na page) at, kung pinapayagan ng tool mo ang mga picture, isang screenshot. Ihambing ang dalawang report na ito:' },
    { type: 'prompt', label: 'Mahinang report', text: 'Ayaw gumana, ayusin mo.' },
    { type: 'prompt', label: 'Magandang report', text: 'Hiniling ko sa iyong gawing brown ang header ng page ko na may puting text. Sa browser ko, brown ang header, pero dark brown ang mga salitang Mila’s Kakanin, at halos hindi ko mabasa. Puting text ang inaasahan ko. Heto ang buong index.html ko: [paste the file]. Walang lumalabas na mensahe sa browser console. Ano ang mali? Pakisabi kung aling linya, ipaliwanag sa isang pangungusap, at ipadala ang naitamang file. Huwag galawin ang iba.' },
    { type: 'paragraph', text: 'Heto ang makikita ng AI sa ganoong kaso. May linya sa CSS rule ng header na British ang spelling:' },
    { type: 'code', language: 'css', label: 'Ang rule na may mali', code: 'header {\n  background: #7a3e1d;\n  colour: white;\n  padding: 32px 16px;\n}' },
    { type: 'paragraph', text: 'Ang alam lang ng CSS ay ang American spelling, `color`. Tahimik na hindi pinapansin ng browser ang hindi kilalang property na `colour`, kaya nananatili ang default na dark na kulay ng text. Isang salita lang ang ayos. Pansinin na walang sinabi sa iyo ang browser tungkol dito; nahanap mo ito dahil inilarawan mo kung ano ang nakikita mo at inihambing ito ng AI sa code.' },
    { type: 'diagram', format: 'mermaid', caption: 'Routine para sa sirang page: check, tingnan, i-report, isang ayos, tingnan ulit.', source: 'flowchart TD\n  A[Something looks wrong] --> B[Save and refresh. Right file? Right name?]\n  B --> C[Open the Console and read any message]\n  C --> D[Send the AI: goal, expected, what you see, evidence]\n  D --> E[Apply one fix and look at the page]\n  E --> F{Fixed?}\n  F -->|yes| G[Add it to your prompt log]\n  F -->|no, tried 3 times| H[New chat: paste the file and describe it fresh]\n  F -->|no| C' },
    { type: 'heading', text: 'Mga rule sa pag-aayos' },
    {
      type: 'list',
      items: [
        '**Isang ayos kada beses** at tumingin pagkatapos ng bawat isa. Kung tatlo ang sabay mong ia-apply, hindi mo malalaman kung alin ang gumana.',
        '**Basahin ang paliwanag ng AI.** Kung hindi ito malinaw sa iyo, i-ask: “Ipaliwanag mo iyan nang mas simple.”',
        '**Humingi ng pinakamaliit na ayos.** Kung ang iminumungkahi ng AI ay isulat muli ang lahat, sabihin: “Ayusin mo lang ang problema, huwag galawin ang iba.”',
        '**Pagkatapos ng tatlong bigong subok, mag-restart.** Magbukas ng bagong chat, i-paste ang kasalukuyan mong file at ilarawan ang problema nang bago. Puwedeng ma-stuck sa loop ang mahabang chat.',
        '**Huwag kailanman magpatakbo ng command na hindi mo naiintindihan,** kahit imungkahi pa ito ng AI. Hindi kailanman nangangailangan ng kahit isa ang one-page na site.',
      ],
    },
    {
      type: 'paragraph',
      audience: { max: 'beginner' },
      text: 'Sa simpleng salita: kapag pumunta ka sa doktor, ang “masama ang pakiramdam ko” ay magbibigay ng maraming tanong. Ang “masakit ang lalamunan ko mula pa Lunes, walang lagnat, at mas masakit lumunok sa umaga” ay mabilis na magbibigay ng tulong. Ganyan din gumagana ang bug report sa AI: ang gusto mo, ang nakikita mo, at anumang eksaktong mensahe. Ang console ay parang thermometer ng doktor: sinusukat nito ang bagay na hindi mo makikita sa pagtingin lang. At ang AI ang doktor, na kailangan ng paglalarawan mo dahil hindi nito nakikita ang screen mo.',
    },
    {
      type: 'paragraph',
      audience: { min: 'advanced' },
      text: 'Debugging pa rin ang pag-debug gamit ang assistant: i-reproduce, i-minimise, bumuo ng hypothesis, i-test ito. Humingi sa model ng mga hypothesis na may ranking at isang murang experiment para sa bawat isa, sa halip na ayos, at ibigay dito ang mga artefact na hindi nito nakikita (console at network output, ang bumagsak na request, minimal na reproduction). Bantayan ang mga ayos na pinapatahimik ang sintomas (isang try/catch, isang !important, isang binurang linya) sa halip na ang sanhi, at ang mga loop na magkakasalungat ang magkakasunod na patch: iyon ang hudyat para i-reset ang context at ulitin ang pagsasabi ng problema. Kung may mga test, gawing unang deliverable ang bumabagsak na test.',
    },
    {
      type: 'takeaways',
      items: [
        'Tahimik na hindi pinapansin ng mga browser ang hindi nila naiintindihan, kaya madalas na kulang na epekto lang ang nakikita kapag may pagkakamali.',
        'Mga unang check: na-save, na-refresh, tamang file, tamang pangalan, na-paste lahat ng code.',
        'Kayang pangalanan ng browser console ang nawawalang file o ang error; ibigay sa AI ang eksaktong mga salitang iyon.',
        'Ang magandang bug report ay may goal, ang inaasahan mo, ang nakikita mo at ang ebidensya; mag-apply ng isang ayos kada beses.',
      ],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-06-fix-bug-1',
        kind: 'fix-bug',
        title: 'Ang header na hindi mabasa',
        story: 'Dapat puti ang mga salita sa brown ang header ng page ni Mila, pero madilim ang mga salita at mahirap basahin.',
        prompt: 'Isang linya ng CSS na ito ang dahilan. I-tap ito, tapos piliin ang ayos.',
        concept: 'finding a typo in css',
        conceptLabel: 'paghahanap ng typo sa CSS',
        language: 'css',
        code: `header {
  background: #7a3e1d;
  colour: white;
  padding: 32px 16px;
  text-align: center;
}`,
        bugLine: 3,
        fixes: [
          { line: '  color: white;', correct: true, why: 'color ang spelling sa CSS. Hindi pinansin ng browser ang colour, kaya nanatiling madilim ang text; sa tamang spelling, nagiging puti ito.' },
          { line: '  font-color: white;', correct: false, why: 'Walang font-color na property sa CSS, kaya hindi rin papansinin ng browser ang linyang ito.' },
          { line: '  background: white;', correct: false, why: 'Ginagawa nitong puti ang buong header, kaya nababasa na ang madilim na mga salita pero nawala ang brown, na hindi ang gusto ni Mila.' },
          { line: '  colour: white !important;', correct: false, why: 'Hindi nakakatulong ang pagdagdag ng diin kapag mali mismo ang pangalan. Hindi pa rin kilala ng browser ang colour.' },
        ],
        hints: [
          'Mukhang tama ang ibang linya sa rule. Isang salita ang hindi kilala ng CSS.',
          'Tingnan ang spelling ng property na dapat magpabago sa kulay ng text.',
          'American spelling ang gamit ng CSS: color.',
        ],
        explanation: 'Hindi pinapansin ng mga browser ang mga property na hindi nila kilala, kaya walang ginawa ang `colour`. Ang pag-spell nito bilang `color` ang nagpapaputi sa mga salita. Ang tahimik na pagkabigo ang dahilan kung bakit inilalarawan mo ang nakikita mo at hinahayaan mong ipakita ng code ang pagkakaiba.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-06-scenario-1',
        kind: 'scenario',
        title: 'Ang pinakamagandang bug report',
        prompt: 'Piliin ang mensaheng pinakamalamang na makakuha ng ayos sa unang subok.',
        concept: 'reporting a problem',
        conceptLabel: 'pag-report ng problema',
        situation: 'Nagpapakita ang page ni Ben ng picture frame na may maliit na sirang icon kung saan dapat ang photo ng shop niya. Sa browser console, may nakikita siyang pulang linya na nagsasabing hindi na-load ang file na tinatawag na images/shop.jpg. Nakopya na niya ang buong index.html niya.',
        options: [
          { text: 'Sira ang picture, ayusin mo.', consequence: 'Kailangang manghula ng AI: maling pangalan, maling folder, nawawalang file? Magmumungkahi ito ng mga pagbabagong baka hindi tumugma sa kahit ano.', quality: 'poor' },
          { text: 'Dapat nagpapakita ang page ko ng photo ng shop ko sa ilalim ng heading. Sa halip, may sirang icon. Sinasabi ng console na hindi na-load ang images/shop.jpg. Ang folder ko ay may index.html at file na tinatawag na Shop.JPG sa parehong level ng index.html, at walang images folder. Heto ang buong file: [paste]. Ano ang mali? Huwag galawin ang iba.', consequence: 'Napapansin ng AI na images/shop.jpg ang nakasulat sa path pero nasa tabi ng page ang photo na may ibang pangalan at malalaking letra, at ipinapadala nito ang eksaktong naitamang linya.', quality: 'best' },
          { text: 'Sira ang lahat, suko na ako. Baka dapat gumamit na lang ako ng ibang tool.', consequence: 'Ang bagong tool ay mahaharap sa parehong problema, dahil ang problema ay ang pangalan at path ng file, hindi ang tool.', quality: 'poor' },
          { text: 'Sira ang picture at sinasabi ng console na hindi na-load ang images/shop.jpg. Ayusin mo.', consequence: 'Kapaki-pakinabang na ebidensya, pero kung walang file, walang layout ng folder at walang goal, kailangan pa ring hulaan ng AI kung ano ang gusto ni Ben.', quality: 'acceptable' },
        ],
        hints: [
          'Aling mensahe ang nagsasabi sa AI kung ano ang gusto mo, ano ang nakikita mo at ano ang sinabi ng console?',
          'Nakakatulong ding sabihin kung ano ang laman ng folder mo.',
          'Ang mahaba na may goal, ang mensahe ng console, ang folder at ang file.',
        ],
        explanation: 'Ang magandang report ay may goal, ang inaasahan mo, ang nakikita mo, ang eksaktong salita ng console at kung ano ang laman ng folder mo. Dahil dito, makikita ng AI ang hindi pagtutugma ng mga pangalan at iyon lang ang aayusin.',
      },
    },
  ],
  quiz: [
    {
      id: 'ai-coding-beginners-06-q1',
      prompt: 'May maling spelling ng pangalan ng property ang CSS mo. Ano ang ginagawa ng browser?',
      choices: [
        'Nagpapakita ito ng malaking error at tumatangging buksan ang page',
        'Hinuhulaan nito ang ibig mong sabihin at tahimik na inaayos ang spelling para sa iyo',
        'Tahimik nitong hindi pinapansin ang linyang iyon at ipinapakita ang natitirang bahagi ng page',
      ],
      answer: 2,
      explanation: 'Nilalaktawan ng mga browser ang hindi nila naiintindihan at nagpapatuloy sila. Kaya madalas na kulang na epekto lang ang nakikita kapag may typo.',
    },
    {
      id: 'ai-coding-beginners-06-q2',
      prompt: 'Plain text ang ipinapakita ng page na kitang-kita ang lahat ng code. Aling unang check ang pinakamalamang na makalutas nito?',
      choices: [
        'Humingi sa AI ng bagong design',
        'Bumili ng bayad na plan para maayos ng AI ang pangalan ng file para sa iyo',
        'Palitan ang color theme ng browser',
        'I-check kung nagtatapos sa .html at hindi sa .html.txt ang pangalan ng file',
      ],
      answer: 3,
      explanation: 'Kung text ang turing ng computer sa file, ipapakita nito ang code bilang text. Ang extension ang nagpapasya kung paano bubuksan ang file.',
    },
    {
      id: 'ai-coding-beginners-06-q3',
      prompt: 'Ano ang sinasabi ng lesson na isama sa bug report, bukod sa goal?',
      choices: [
        'Ang inaasahan mo, ang nakikita mo at ang ebidensya tulad ng eksaktong salita ng console at ang code',
        'Ang salitang “sira” lang, na nakasulat sa capital letters para mas mabilis mapansin ng AI ang problema',
        'Listahan ng ibang tool na puwede mong gamitin',
      ],
      answer: 0,
      explanation: 'Dahil sa mga detalyeng iyon, nakikita ng AI ang agwat ng inaasahan at ng resulta. Ang “sira” ay walang naibibigay na magagamit nito.',
    },
    {
      id: 'ai-coding-beginners-06-q4',
      prompt: 'Sinubukan mo ang tatlong ayos ng AI nang sunud-sunod at walang gumana. Ano ang pinakamagandang susunod na gawin?',
      choices: [
        'I-apply ang lahat ng mungkahi nang sabay',
        'Magsimula ng bagong chat, i-paste ang kasalukuyan mong file at ilarawan ang problema nang bago',
        'Burahin ang file at simulan ulit ang buong site mula sa pinakaunang prompt',
      ],
      answer: 1,
      explanation: 'Puwedeng ma-stuck sa pag-uulit ang mahabang chat. Ang bagong chat na may kasalukuyan mong file at bagong paglalarawan ay madalas na bumabasag sa loop.',
    },
    {
      id: 'ai-coding-beginners-06-q5',
      audience: { max: 'beginner' },
      prompt: 'Sa paghahambing sa doktor, ano ang katumbas ng console?',
      choices: [
        'Ang thermometer ng doktor, na sumusukat sa hindi mo makikita',
        'Ang pangalan ng pasyente, na isinusulat ng doktor sa itaas ng mga note',
        'Ang waiting room',
      ],
      answer: 0,
      explanation: 'Ipinapakita ng console ang mga mensahe tungkol sa mga bagay na hindi mo makikita sa pagtingin lang sa page, gaya ng pagpapakita ng thermometer ng temperatura.',
    },
    {
      id: 'ai-coding-beginners-06-q6',
      audience: { min: 'advanced' },
      prompt: 'Ang “ayos” ng assistant sa bumabagsak na request ay balutin ito sa try/catch na lumulunok ng error. Ano ang concern?',
      choices: [
        'Hindi ito magko-compile',
        'Itinatago nito ang sintomas at iniiwan ang sanhi',
        'Nagpapabagal ito nang kapansin-pansin sa request para sa bawat bisitang gumagamit ng page',
        'Binabago nito ang layout ng page',
      ],
      answer: 1,
      explanation: 'Ang paglunok sa error ay pinapatahimik ang ebidensya sa halip na ayusin ang sanhi. Humingi ng root cause at ng test na nagpapakita nito.',
    },
  ],
  task: {
    title: 'Sirain nang sadya ang page mo, tapos ayusin ito kasama ang AI',
    minutes: 20,
    steps: [
      'Gumawa ng kopya ng gumaganang `index.html` mo na tinatawag na `index-working.html`.',
      'Sa `index.html`, sirain ang isang maliit na bagay: palitan ang `color` ng `colour` sa isang rule, o burahin ang isang closing tag. I-refresh at itala kung ano ang nagbago.',
      'Buksan ang browser console (right-click, Inspect, tapos ang Console) at tingnan kung may lumalabas na mensahe.',
      'Sumulat ng bug report na may goal, ang inaasahan mo, ang nakikita mo at ang buong file, ipadala ito sa AI at i-apply ang nag-iisang ayos nito.',
      'Idagdag ang bug report at ang ayos sa prompt log mo.',
    ],
  },
  taskExtra: [
    { audience: { max: 'beginner' }, steps: ['Kung pakiramdam mo ay stuck ka, kopyahin pabalik ang gumaganang file sa ibabaw ng sira. Iyon mismo ang dahilan kung bakit gumawa tayo ng gumaganang kopya.'] },
    { audience: { min: 'advanced' }, steps: ['Humingi sa AI ng tatlong hypothesis na may ranking at isang experiment para sa bawat isa bago ito magmungkahi ng ayos, at ihambing ang ranking nito sa nahanap mo.'] },
  ],
};
