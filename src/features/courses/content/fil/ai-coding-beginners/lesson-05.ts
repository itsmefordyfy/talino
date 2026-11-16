import type { Lesson } from '../../types';
import { FIL_CHECKED, FIL_DOCS } from './meta';

export const aiCodingBeginnersLesson05Fil: Lesson = {
  id: 'ai-coding-beginners-05',
  day: 5,
  title: 'Pagbago sa pamamagitan ng pag-ask: maliliit at malilinaw na request',
  summary: 'Baguhin ang page mo sa isang malinaw na request kada beses, at manatiling may hawak sa pamamagitan ng pagpapangalan sa piraso, pagsasabi kung ano ang itatabi at pag-check sa resulta.',
  intro: {
    objectives: [
      'Sumulat ng change request na nagpapangalan sa isang piraso ng page at nagsasabi kung ano ang itatabi',
      'I-check kung ano talaga ang nagbago, hindi lang kung ano ang hiningi mo',
      'Mag-restart ng mahabang chat nang hindi nawawala ang page mo',
    ],
    why: 'Karamihan ng pagbuo gamit ang AI ay pagbabago ng kung ano ang mayroon na. Ang maliliit at malilinaw na request ay nagbibigay ng mga page na gumaganda sa bawat hakbang; ang malalaki at malalabo ay nagbibigay ng mga sorpresa.',
  },
  minutes: 25,
  skills: ['write-prompts', 'change-and-fix'],
  body: [
    { type: 'paragraph', text: 'Unang draft ang una mong page, at hindi ito magiging eksaktong tama. Ang skill na nagpapalit sa draft bilang page na gusto mo ay ang pagbago nito sa pamamagitan ng pag-ask. Maliit na skill ito na may ilang rule, at kapag nasa iyo na ang mga ito, mababago mo ang hugis ng page nang hindi mo hinahawakan ang code.' },
    { type: 'heading', text: 'Apat na rule para sa magandang change request' },
    {
      type: 'list',
      ordered: true,
      items: [
        '**Isang change kada beses.** Kung may tatlong mali pagkatapos, hindi mo malalaman kung aling request ang may sanhi ng alin. Isang change, tapos tumingin ka.',
        '**Pangalanan ang piraso.** Gamitin ang mga salita mula sa nakaraang lesson: ang heading, ang list sa ilalim ng What we sell, ang footer, ang button. Ang “iyong nasa taas” ay pinipilit ang AI na manghula.',
        '**Sabihin kung ano ang itatabi.** Gusto ng mga AI tool na pagandahin ang mga bagay na hindi mo hiningi. Pinoprotektahan ng “huwag galawin ang iba” ang mga parteng gusto mo na.',
        '**Sabihin kung paano mo gustong ihatid ang sagot.** Para sa maliit na page, hingin ang buong updated na file, para palitan mo nang buo ang luma at hindi mo na kailangang hanapin kung saan ilalagay ang mga linya.',
      ],
    },
    { type: 'paragraph', text: 'Heto ang tatlong totoong request na magkakasunod sa page ng Mila’s Kakanin, na may kasunod na bahagi ng code na nagbago sa bawat isa.' },
    { type: 'prompt', label: 'Request 1: isang kulay', text: 'Sa file na ginawa mo, palitan ng dark green ang kulay ng dalawang h2 heading (What we sell at How to order). Huwag galawin ang iba. Ipadala mo sa akin ang buong updated na file.' },
    { type: 'code', language: 'css', label: 'Bago at pagkatapos (ang h2 rule)', code: '/* before */\nh2 {\n  color: #7a3e1d;\n}\n\n/* after */\nh2 {\n  color: #2e5e3e;\n}' },
    { type: 'prompt', label: 'Request 2: bagong content', text: 'Magdagdag ng pang-apat na item sa list sa ilalim ng What we sell: Kutsinta, ₱50 kada dosena. Ilagay ito pagkatapos ng Sapin-sapin. Huwag galawin ang iba. Ipadala mo sa akin ang buong updated na file.' },
    { type: 'code', language: 'html', label: 'Ang list ngayon', code: '<ul>\n  <li>Biko: ₱80 per tray</li>\n  <li>Puto: ₱60 per dozen</li>\n  <li>Sapin-sapin: ₱120 per tray</li>\n  <li>Kutsinta: ₱50 per dozen</li>\n</ul>' },
    { type: 'prompt', label: 'Request 3: ang button', text: 'Gawing Order by email ang sinasabi ng text ng button, at gawing buong bilog ang mga sulok ng button. Huwag galawin ang iba. Ipadala mo sa akin ang buong updated na file.' },
    { type: 'code', language: 'css', label: 'Ang button rule pagkatapos ng change', code: '.button {\n  display: inline-block;\n  background: #7a3e1d;\n  color: white;\n  padding: 12px 20px;\n  border-radius: 999px;\n  text-decoration: none;\n}' },
    { type: 'paragraph', text: 'Pagkatapos ng bawat request, dalawang bagay ang parehong ginagawa mo. Una, palitan ang laman ng file mo ng bagong version at i-refresh ang browser. Pangalawa, tingnan ang buong page, hindi lang ang parteng binago mo. Kung may ibang gumalaw, sabihin ito sa susunod mong request: “Iba na ang pagka-center ng text ng footer ngayon kaysa dati. Ibalik mo kung ano ito dati.”' },
    { type: 'heading', text: 'Kapag humaba na ang chat' },
    { type: 'paragraph', text: 'Gumagana ang chat assistant batay sa conversation hanggang ngayon, at may limit kung gaano karami ang kaya nitong hawakan nang sabay, na tinatawag na **context window**. Pagkatapos ng mahabang palitan, puwede nitong makalimutan o paghalu-haluin ang mga naunang detalye, tulad ng change na ginawa mo sampung mensahe na ang nakaraan. Malayong mas mababa sa limit ang ganito kaliit na page, pero puwede pa ring magkamali ang mahabang chat na puno ng mga pini-paste na file. Simple lang ang solusyon: magsimula ng bagong chat at i-paste ang kasalukuyan mong file kasama ang maikling note kung ano ang gusto mo sunod.' },
    { type: 'prompt', label: 'Pag-restart ng chat', text: 'Heto ang kasalukuyang index.html ng website ko para sa Mila’s Kakanin. Huwag mo munang galawin ang kahit ano. Sabihin mo lang sa akin sa dalawang pangungusap kung ano ang laman ng page, tapos hintayin mo ang susunod kong request.' },
    {
      type: 'version',
      text: 'Puwedeng limitado ang context window ng mga free plan. Nakalista sa help page ng Gemini ang 32,000-token na context window para sa mga free user, at nakalista sa plans page ng ChatGPT ang humigit-kumulang 27,000 token para sa mga standard na sagot sa Free plan nito. Ang token ay maliit na piraso ng text, halos tatlong-kapat ng isang salita. Nagbabago ang mga numerong ganito, kaya ang ugali ang mahalaga, hindi ang numero: panatilihing nasa kamay ang kasalukuyan mong file para makapag-restart ka ng chat anumang oras.',
      checked: FIL_CHECKED,
      sources: [FIL_DOCS.geminiLimits, FIL_DOCS.chatgptPlans],
    },
    {
      type: 'paragraph',
      audience: { max: 'beginner' },
      text: 'Sa simpleng salita: isipin mong nagsasabi ka sa sastre ng ipapabago. Ang “pagandahin mo” ay nagbibigay ng sorpresa. Ang “paiklian mo ang manggas ng dalawang sentimetro at iwan mo ang lahat ng iba nang eksakto kung ano ang mga ito” ay nagbibigay ng gusto mo. Ang manggas ang pirasong pinangalanan mo, ang dalawang sentimetro ang isang malinaw na change, at ang “lahat ng iba” ang hiniling mong itabi. Pagkatapos ng bawat fitting, isusuot mo ang jacket at titingnan mo ang lahat ng ito, hindi lang ang manggas. Ang context window ay ang alaala ng sastre para sa isang pagbisita: pagkatapos ng napakahabang pagbisita, nakakatulong ang mabilis na bagong note kung ano ang mayroon ka ngayon.',
    },
    {
      type: 'paragraph',
      audience: { min: 'advanced' },
      text: 'Ituring na maliit at nare-review na change ang bawat request na may sinabing invariant (“huwag galawin ang iba”) at mag-verify gamit ang diff sa halip na sa mata: madalas na nire-reformat o lumilihis ang mga edit ng model sa mga bahaging hindi dapat galawin. Gawing sariling commit ang bawat tinanggap na change para madaling i-revert ang masama, at itago sa maikling block na ipe-paste mo ulit ang mga instruction na dapat manatili (palette, fonts, content rules), dahil bumababa ang recall ng mga naunang constraint sa mahahabang context. Para sa anumang mas malaki sa isang page, humingi muna ng plan at aprubahan ito bago isulat ang anumang code.',
    },
    {
      type: 'takeaways',
      items: [
        'Isang change kada request, na pinapangalanan ang piraso, sinasabi kung ano ang itatabi at kung paano mo gustong ihatid ang sagot.',
        'Pagkatapos ng bawat change, palitan ang file, i-refresh, at tingnan ang buong page.',
        'Kung may ibang nagbago, sabihin ito at ipabalik.',
        'Sa mahabang chat, magsimulang muli gamit ang kasalukuyan mong file at maikling note.',
      ],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-05-scenario-1',
        kind: 'scenario',
        title: 'Aling change request ang mas maganda?',
        prompt: 'Piliin ang request na pinakamalamang na magbago lang ng gusto mo.',
        concept: 'small clear requests',
        conceptLabel: 'maliliit at malilinaw na request',
        situation: 'Nakabukas ang page ng Mila’s Kakanin. Gusto ni Mila na medyo mas maliit ang pangunahing heading, at gusto niya ang lahat ng iba nang eksakto kung ano ang mga ito.',
        options: [
          { text: 'Pagandahin mo.', consequence: 'Babaguhin ng AI ang mga kulay, font at layout. Mawawala kay Mila ang mga gusto niya.', quality: 'poor' },
          { text: 'Paliitin mo ang h1 heading, mga 28 pixels, at huwag galawin ang iba. Ipadala mo ang buong updated na file.', consequence: 'Ang laki lang ng heading ang magbabago, at mapapalitan ni Mila ang file niya at ma-check ito sa loob ng ilang segundo.', quality: 'best' },
          { text: 'Masyadong malaki ang itaas, ayusin mo ang itaas at ayusin mo na rin ang iba habang nandiyan ka.', consequence: 'Baka lumiit ang heading, pero ire-rewrite ng “pag-aayos” ang mga parte ng page na maayos naman.', quality: 'poor' },
          { text: 'Paliitin mo ang heading.', consequence: 'Malamang gagana ito, pero kung walang “huwag galawin ang iba” at walang sukat, baka baguhin ng AI ang ibang bagay o pumili ng sukat na hindi bagay.', quality: 'acceptable' },
        ],
        hints: [
          'Hanapin ang request na nagpapangalan sa piraso, isang change at kung ano ang itatabi.',
          'Alin ang nagbibigay ng sukat at nagsasabing huwag galawin ang iba?',
          'Ang h1 request na may 28 pixels at ang buong file.',
        ],
        explanation: 'Isang piraso, isang change, nasusukat na laki at pangakong hindi gagalawin ang iba: iyan ang nagbibigay sa iyo ng kontrol at mabilis na paraan para mag-check.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-05-predict-1',
        kind: 'predict-output',
        title: 'Ano ang nagalaw ng change?',
        story: 'Hiniling mo sa AI na gawing dark green ang pangunahing heading. Ito ang ipinadala nito.',
        prompt: 'Aling mga salita ang nagiging dark green?',
        concept: 'what a css rule affects',
        conceptLabel: 'kung ano ang tinatamaan ng CSS rule',
        language: 'html',
        code: `<style>
  h1 { color: darkgreen; }
</style>
<h1>Mila's Kakanin</h1>
<h2>What we sell</h2>`,
        expected: "Only Mila's Kakanin",
        choices: ["Only Mila's Kakanin", 'Only What we sell', 'Both lines', 'Neither line'],
        wrongNotes: {
          'Only What we sell': 'Para sa h1 ang rule, na siyang unang linya. Ang pangalawang linya ay h2.',
          'Both lines': 'Ang h1 na selector ay tumutugma lang sa mga h1 element. Kailangan ng sarili nitong rule ang h2.',
          'Neither line': 'Tumutugma ang rule sa h1, kaya nagiging green ang heading na iyon.',
        },
        hints: [
          'Basahin ang selector sa simula ng rule.',
          'Aling linya sa body ang h1?',
          'Ang rule ay tumatama lang sa mga pirasong pinangalanan ng selector nito.',
        ],
        explanation: 'Ang selector na `h1` ay tumutugma lang sa mga h1 element, kaya ang unang linya lang ang nagbabago. (Na-check sa browser: naging dark green ang h1 at nanatili ang default na kulay ng h2.)',
      },
    },
  ],
  quiz: [
    {
      id: 'ai-coding-beginners-05-q1',
      prompt: 'Bakit idinaragdag ng lesson ang “huwag galawin ang iba” sa isang request?',
      choices: [
        'Para mas mabilis sumagot ang AI at mas kaunting salita ang gamitin sa bawat sagot',
        'Para pigilan ang AI na pagandahin ang mga parteng hindi mo hiningi',
        'Para makatipid ng espasyo sa chat',
      ],
      answer: 1,
      explanation: 'Madalas na inaayos o ini-restyle ng mga AI tool ang mga bagay na hindi mo binanggit. Ang pagsasabi kung ano ang itatabi ay pinoprotektahan ang mga parteng gusto mo na.',
    },
    {
      id: 'ai-coding-beginners-05-q2',
      prompt: 'Matapos baguhin ng AI ang kulay ng heading, napansin mong gumalaw ang text ng footer. Ano ang pinakamagandang tugon?',
      choices: [
        'Tanggapin at magpatuloy, dahil tama ang heading at maliit na bagay lang ang footer',
        'Magsimulang muli mula sa unang prompt',
        'Sabihin sa AI na gumalaw ang text ng footer at ipabalik ito kung ano ito dati',
      ],
      answer: 2,
      explanation: 'Ang pagtingin sa buong page pagkatapos ng bawat change ang nakakahuli ng mga hindi sinasadyang side effect. Pangalanan kung ano ang nagbago at ipabalik nang eksakto iyon.',
    },
    {
      id: 'ai-coding-beginners-05-q3',
      prompt: 'Humaba na ang chat at pinaghahalo-halo na ng AI ang mga naunang change. Ano ang pinakamalaking tulong?',
      choices: [
        'Magsimula ng bagong chat, i-paste ang kasalukuyan mong file at sabihin kung ano ang gusto mo sunod',
        'Ulit-ulitin ang parehong tanong, sa capital letters, hanggang makinig ito',
        'I-ask itong kalimutan ang lahat',
        'Lumipat sa ibang tool at umasa na lang',
      ],
      answer: 0,
      explanation: 'Ang bagong chat na may kasalukuyan mong file ay nagbibigay sa AI ng malinis at maliit na context. Ang file sa folder mo ang totoo, hindi ang chat.',
    },
    {
      id: 'ai-coding-beginners-05-q4',
      prompt: 'Alin sa mga request na ito ang nagpapangalan sa isang piraso ng page?',
      choices: [
        'Gawin ulit iyong nasa taas, tulad ng ginawa mo dati',
        'Gawing mas malaki ang text ng list sa ilalim ng What we sell',
        'Pasikatin mo',
      ],
      answer: 1,
      explanation: 'Ang list sa ilalim ng What we sell ay may pangalang piraso. Ang “iyong nasa taas” at “pasikatin mo” ay pinapahula sa AI.',
    },
    {
      id: 'ai-coding-beginners-05-q5',
      audience: { max: 'beginner' },
      prompt: 'Sa paghahambing sa sastre, ano ang “lahat ng iba nang eksakto kung ano ang mga ito”?',
      choices: [
        'Ang parteng gusto mong baguhin',
        'Ang hiniling mong huwag galawin',
        'Ang bayad sa sastre sa dulo ng pagbisita',
      ],
      answer: 1,
      explanation: 'Ang pagsasabi sa sastre kung ano ang iiwan ay kapareho ng pagsasabing huwag galawin ang iba.',
    },
    {
      id: 'ai-coding-beginners-05-q6',
      audience: { min: 'advanced' },
      prompt: 'Heading lang “daw” ang binago ng edit ng model, pero pinaghihinalaan mong may lumihis sa ibang lugar. Ano ang pinakamapagkakatiwalaang check?',
      choices: [
        'Basahin ang bagong file mula taas pababa at magtiwala sa alaala mo sa luma',
        'Itanong sa model kung may iba pa itong binago',
        'Ihambing ang bagong file sa luma gamit ang diff',
        'I-refresh ang browser at heading lang ang tingnan',
      ],
      answer: 2,
      explanation: 'Ipinapakita ng diff nang eksakto kung ano ang nagbago. Parehong puwedeng makaligtaan ng sariling salaysay ng model at ng pagtingin sa page gamit ang mata ang mga tahimik na edit.',
    },
  ],
  task: {
    title: 'Gumawa ng tatlong change, isa-isa',
    minutes: 20,
    steps: [
      'Gumawa ng kopya ng `index.html` mo na tinatawag na `index-before.html` sa parehong folder, para makapaghambing ka mamaya.',
      'Humingi ng isang pagbabago ng kulay, na pinapangalanan ang piraso at sinasabing “huwag galawin ang iba”. Palitan ang file mo, i-refresh, at tingnan ang buong page.',
      'Humingi ng isang change sa mga salita (presyo, item, pangungusap), tapos isang change sa itsura. I-check pagkatapos ng bawat isa.',
      'Idagdag ang tatlong request sa prompt log mo, kasama ang note kung ginawa ba ng bawat isa ang gusto mo sa unang subok.',
    ],
  },
  taskExtra: [
    { audience: { max: 'beginner' }, steps: ['Kung may ginawa ang isang request na hindi mo inaasahan, i-copy ito sa chat at i-ask: “Bakit mo binago rin iyon?” Basahin ang dahilan.'] },
    { audience: { min: 'advanced' }, steps: ['I-diff ang `index-before.html` laban sa bagong file gamit ang editor mo at isulat ang anumang change na hindi mo hiningi.'] },
  ],
};
