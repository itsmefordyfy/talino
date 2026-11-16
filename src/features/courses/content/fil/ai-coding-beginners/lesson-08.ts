import type { Lesson } from '../../types';
import { FIL_CHECKED, FIL_DOCS } from './meta';

export const aiCodingBeginnersLesson08Fil: Lesson = {
  id: 'ai-coding-beginners-08',
  day: 8,
  title: 'Pagdagdag ng form at pag-save ng ipinapadala ng mga tao',
  summary: 'Magdagdag ng paraan para makapagpadala ng impormasyon sa iyo ang mga bisita, unawain kung bakit hindi ito kayang i-save ng page lang, at hawakan nang responsable ang mga detalye ng ibang tao.',
  intro: {
    objectives: [
      'Basahin ang mga parte ng HTML form: label, input, name at button',
      'Ipaliwanag kung bakit walang kayang i-save nang mag-isa ang form sa page na gawa sa mga plain file',
      'Magdagdag ng paraan para tumanggap ng mga sagot at sabihin kung ano ang gagawin mo sa mga ito',
    ],
    why: 'Maraming totoong page ang nangangailangan ng ipapadala ng mga bisita: order, tanong, booking. Mas masama pa kaysa sa walang form ang form na mukhang tama pero tahimik na nawawalan ng mga sagot, kaya sulit itong gawin nang maayos.',
  },
  minutes: 25,
  skills: ['forms-and-design', 'stay-safe'],
  body: [
    { type: 'paragraph', text: 'Sa ngayon, nakikipag-usap lang ang page mo sa mga bisita. Para makasagot sila pabalik, tulad ng pag-order ng tray ng biko o pagtatanong, kailangan mo ng paraan para makarating sa iyo ang mga salita nila. Ang pinakasimpleng paraan ay email link, na mayroon na ang page mo. Kapag gusto mo ng mga sagot sa maayos na listahan, tulad ng pangalan, item at araw ng pickup, form ang kailangan mo. May isang bitag na halos lahat ay nahuhulog, at sulit itong maintindihan bago ka magdagdag ng form.' },
    { type: 'heading', text: 'Ano ang bumubuo sa isang form' },
    { type: 'paragraph', text: 'Ang **form** ay grupo ng mga kahon at isang button. Heto ang maliit na form sa paraan ng pagsulat ng AI:' },
    {
      type: 'code',
      language: 'html',
      label: 'Isang maliit na order form',
      code: `<form action="https://example.com/send" method="post">
  <label for="name">Your name</label>
  <input type="text" id="name" name="name">
  <label for="msg">What would you like to order?</label>
  <textarea id="msg" name="message"></textarea>
  <button type="submit">Send</button>
</form>`,
    },
    {
      type: 'list',
      items: [
        'Binabalot ng `<form>` ang lahat. Ang `action` attribute nito ay ang address kung saan ipinapadala ang mga sagot kapag may pumindot sa button, at sinasabi ng `method` kung paano.',
        'Ang `<label>` ay ang mga salita sa tabi ng kahon. Tumutugma ang `for` nito sa `id` ng kahon, kaya ang pag-tap sa mga salita ay pumipili sa kahon, at binabasa ito ng mga screen reader.',
        'Ang `<input>` ay one-line na kahon; ang `<textarea>` ay mas malaking kahon para sa mas mahabang text.',
        'Ang `name` ay ang label na dinadaanan ng sagot, tulad ng `name` o `message`. Ang kahong walang `name` ay karaniwang naiiwan sa ipinapadala.',
        'Ipinapadala ng `<button type="submit">` ang form.',
      ],
    },
    { type: 'heading', text: 'Ang bitag: saan pumupunta ang mga sagot?' },
    { type: 'paragraph', text: 'Tingnan ulit ang address ng `action`. Kapag may pumindot sa Send, ipinapadala ng browser ang mga sagot nila sa address na iyon, at kailangang may **program** na tumatakbo sa isang computer doon para tumanggap at mag-save ng mga ito. Ang site mo ay iilang file lang: wala itong ganoong program. Kung walang kapaki-pakinabang na pinupuntahan ang address, pupunta pa rin doon ang browser, karaniwang makakakuha ng error page, at itatapon ang mga sagot ng bisita. Mukhang maayos ang form at tahimik na nawawalan ng bawat order. Madalas na ganito ang isinusulat ng mga AI tool na form, na may imbentong address, dahil humingi ka ng form at hindi mo sinabi kung saan dapat pumunta ang mga sagot.' },
    { type: 'heading', text: 'Tatlong paraan para tumanggap ng ipinapadala ng mga tao' },
    {
      type: 'table',
      headers: ['Paraan', 'Paano ito gumagana', 'Mabuting malaman'],
      rows: [
        ['Email link', 'Ang link tulad ng mailto:mila@example.com ay nagbubukas ng email app ng bisita na may nakalagay nang address mo', 'Pinakasimple. Gumagana lang ito kung naka-set up ang email ng bisita sa device na iyon'],
        ['Isang Google Form sa page mo', 'Gagawin mo ang form sa Google Forms at ipapakita ito sa page mo bilang link o naka-embed na frame; mag-iipon ang mga sagot sa Google account mo', 'Libre para magsimula. Naka-store sa account mo ang mga sagot, kaya ikaw ang responsable sa mga ito'],
        ['Isang form service', 'Binibigyan ka ng kumpanya ng address na ilalagay sa `action`; tinatanggap nito ang mga sagot at ie-email o ise-store ang mga ito', 'Nagkakaiba at nagbabago ang mga plan at limits; basahin kung ano ang ginagawa nila sa data bago ka gumamit ng isa'],
      ],
      caption: 'Para sa unang site, ang email link o Google Form ang pinakaligtas na simula.',
    },
    { type: 'paragraph', text: 'Heto ang ruta ng Google Forms. Gawin ang form sa Google Forms, idagdag ang mga tanong mo (pangalan, paano sila makokontak, ano ang gusto nila, araw ng pickup), i-publish ito, at kopyahin ang link o gamitin ang embed option ng form, na nagbibigay sa iyo ng maliit na piraso ng code na nagpapakita ng form sa loob ng page mo. Tapos ibigay ang code na iyon sa AI:' },
    { type: 'prompt', label: 'Idagdag ang Google Form sa page', text: 'Heto ang embed code mula sa Google Form ko: [paste the code]. Sa index.html ko, magdagdag ng section na tinatawag na Order form pagkatapos ng How to order, at ilagay ang code na ito roon para lumabas ang form sa loob ng page. Huwag galawin ang iba. Ipadala mo sa akin ang buong updated na file.' },
    {
      type: 'code',
      language: 'html',
      label: 'Ganito ang itsura ng section pagkatapos (example na address, iba ang sa iyo)',
      code: `<h2>Order form</h2>
<iframe src="https://docs.google.com/forms/d/e/EXAMPLE_FORM_ID/viewform?embedded=true"
        width="100%" height="700" title="Order form">
  Loading...
</iframe>`,
    },
    { type: 'paragraph', text: 'Ang `iframe` ay bintana sa loob ng page mo na nagpapakita ng ibang page, dito ay ang form mo. Ang mga sagot ng bawat bisita ay pumupunta sa response sheet ng Google Form mo, hindi sa sarili mong computer o sa page mo.' },
    {
      type: 'version',
      text: 'Ipinapaliwanag ng MDN na ang action ng form ay ang URL kung saan ipinapadala ang nakolektang data at ang method ay ang HTTP method na ginagamit, at na ang name ay ang label na dinadaanan ng bawat value. Sinasabi ng help page ng Google na kailangang naka-publish ang form bago ito magamit ng mga tao, at na may Embed HTML option sa More menu para ilagay ito sa website. I-check ang kasalukuyang mga hakbang sa Google Forms, dahil nagbabago ang mga pangalan ng menu.',
      checked: FIL_CHECKED,
      sources: [FIL_DOCS.mdnForm, FIL_DOCS.googleForms],
    },
    { type: 'heading', text: 'Hawak mo na ngayon ang impormasyon ng ibang tao' },
    {
      type: 'list',
      items: [
        '**Itanong lang ang kailangan mo.** Pangalan at paraan para maabot sila para sa order; hindi ang home address nila maliban kung nagde-deliver ka.',
        '**Huwag kailanman humingi ng password, card number o government ID number** sa form ng maliit na site.',
        '**Sabihin kung ano ang gagawin mo rito** sa isang pangungusap sa ilalim ng form (“Ginagamit lang namin ang mga detalye mo para ihanda ang order mo”).',
        '**Panatilihing private ang mga sagot,** huwag i-share ang response sheet at burahin ang mga sagot na hindi mo na kailangan.',
      ],
    },
    { type: 'tip', text: 'I-test mismo ang form bilang bisita: punan ito sa phone mo, pindutin ang Send, at i-check kung dumating ang sagot sa inaasahan mong lugar. Ang form na hindi mo kailanman na-test ay form na baka nawawalan ng mga order.' },
    {
      type: 'paragraph',
      audience: { max: 'beginner' },
      text: 'Sa simpleng salita: ang form ay papel na order slip na iniaabot mo sa kabilang panig ng counter. Ang mga kahon ang mga linyang pupunan, at ang `name` ng bawat kahon ay ang heading na nakalimbag sa ibabaw ng linya, para malaman ng sinumang magbabasa ng slip kung aling sagot ang alin. Ang problema ay nasa likod ng tindahan. Ang form sa plain page ay parang slip na may address pero walang tao sa address na iyon: iniaabot ang mga slip at nawawala. Ang Google Form ay tunay na receiving desk na iba ang nag-aalaga para sa iyo, at ang email link ay nagri-ring lang ng sarili mong doorbell. Alinman ang piliin mo, kailangang may tao sa kabilang dulo.',
    },
    {
      type: 'paragraph',
      audience: { min: 'advanced' },
      text: 'Sa static hosting, ang tanong ay kung aling third-party endpoint ang tatanggap ng POST, at may trade-off ang bawat pagpili: spam at bot abuse (honeypot field, rate limits, CAPTCHA), data retention at residency, consent at privacy notice, reliability ng delivery, at kung ano ang mangyayari kapag naka-disable ang JavaScript. Huwag maglagay ng credentials para sa backend sa page; public ang anumang nasa client code. Kung kailangan mo ng sarili mong handling mamaya, ang pattern ay maliit na serverless function na may hawak ng mga secret, na nagpo-post ang page rito, at validation sa server sa halip na sa browser lang.',
    },
    {
      type: 'takeaways',
      items: [
        'Ang form ay may mga label, mga kahon na may pangalan, isang button at isang action address na nagsasabi kung saan pupunta ang mga sagot.',
        'Hindi kayang mag-save ng mga sagot ang page na gawa sa mga plain file: kung walang nasa action address, nawawala ang mga sagot.',
        'Ang email link o Google Form ay ligtas na paraan para magsimulang tumanggap ng mga sagot.',
        'Itanong lang ang kailangan mo, huwag kailanman humingi ng password o card number, at i-test ang form bilang bisita.',
      ],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-08-fix-bug-1',
        kind: 'fix-bug',
        title: 'Ang sagot na hindi kailanman dumarating',
        story: 'Tine-test ni Mila ang form niya. Dumarating ang mensahe, pero laging nawawala ang name box sa natatanggap niya.',
        prompt: 'Isang linya ang dahilan. I-tap ito, tapos piliin ang ayos.',
        concept: 'form fields need a name',
        conceptLabel: 'kailangan ng name ang mga form field',
        language: 'html',
        code: `<form action="https://example.com/send" method="post">
  <label for="name">Your name</label>
  <input type="text" id="name">
  <label for="msg">Message</label>
  <textarea id="msg" name="message"></textarea>
  <button type="submit">Send</button>
</form>`,
        bugLine: 3,
        fixes: [
          { line: '  <input type="text" id="name" name="name">', correct: true, why: 'Ang name ang label na dinadaanan ng sagot. Kapag mayroon nito, naipapadala ang pangalan ng bisita kasama ng mensahe.' },
          { line: '  <input type="text" name="name">', correct: false, why: 'Naipapadala nito ang pangalan, pero kung walang id, hindi na nakakabit ang label sa kahon, kaya walang nangyayari kapag tina-tap ang mga salita.' },
          { line: '  <input type="text" id="name" value="name">', correct: false, why: 'Pinupunan ng value ang kahon ng panimulang salita. Hindi ito nagbibigay sa sagot ng label na dadaanan.' },
          { line: '  <input type="text" id="name" for="name">', correct: false, why: 'Sa label nabibilang ang for attribute, hindi sa kahon, at hindi nito pinapangalanan ang sagot.' },
        ],
        hints: [
          'Gumagana ang message box at hindi ang name box. Ano ang mayroon ang message box na wala sa name box?',
          'Ihambing ang linya ng textarea sa linya ng input.',
          'Idagdag ang name attribute sa input, panatilihin ang id.',
        ],
        explanation: 'Ang mga kahon lang na may name ang kasama sa ipinapadala ng form. Ang id at label ay para sa mga tao; ang name ay para sa sagot.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-08-scenario-1',
        kind: 'scenario',
        title: 'Ang mga order na naglaho',
        prompt: 'Piliin ang pinakamagandang ayos.',
        concept: 'where form answers go',
        conceptLabel: 'saan pumupunta ang mga sagot ng form',
        situation: 'Sinulatan si Ben ng AI niya ng contact form na may action="/send". Na-publish na niya ang page. Pumipindot ng Send ang mga customer at error page ang nakikita nila. Hindi alam ni Ben kung ilang mensahe ang nawala.',
        options: [
          { text: 'Palitan ang form ng Google Form na ipinapakita sa page, panatilihin ang email link bilang backup, at i-test ito sa phone niya.', consequence: 'Dumarating na ang mga sagot sa response sheet na hawak ni Ben, at na-check na niyang dumarating ang mga ito.', quality: 'best' },
          { text: 'I-ask sa AI na “gawing nagse-save ng data ang form” nang hindi sinasabi kung saan.', consequence: 'Baka mag-imbento ang AI ng server na hindi umiiral, at mabibigo ang form sa bagong paraan.', quality: 'poor' },
          { text: 'Magdagdag ng mensaheng “Salamat!” pagkatapos ng Send para magmukhang gumana.', consequence: 'Iisipin ng mga customer na dumating ang mga order nila. Hindi dumating. Itinatago nito ang problema at pinalalala pa.', quality: 'poor' },
          { text: 'Alisin ang form at iwan ang email link lang.', consequence: 'Gumagana ito at tapat, bagaman mawawala kay Ben ang maayos na listahan ng mga sagot.', quality: 'acceptable' },
        ],
        hints: [
          'Saan dapat dumating ang mga sagot para makita ni Ben?',
          'Huwag kailanman magkunwaring gumana ang form kung hindi mo pa nata-check.',
          'Gumamit ng bagay na talagang tumatanggap ng mga sagot, at i-test ito.',
        ],
        explanation: 'Kailangan ng tatanggap ang form. Talagang naghahatid ang Google Form o email link; ang pekeng “salamat” ay nagtatago lang ng pagkawala.',
      },
    },
  ],
  quiz: [
    {
      id: 'ai-coding-beginners-08-q1',
      prompt: 'Ang action ng form mo ay nakaturo sa address na walang naka-set up na tatanggap. Ano ang mangyayari kapag pumindot ng Send ang bisita?',
      choices: [
        'Ise-save ang mga sagot sa phone ng bisita para basahin mo mamaya',
        'Awtomatikong ie-email sa iyo ng browser ang mga sagot, kahit anong address',
        'Pupunta roon ang browser, karaniwang magpapakita ng error at mawawala ang mga sagot',
      ],
      answer: 2,
      explanation: 'Nagpapadala lang ang form. May kailangang tumanggap at mag-save sa kabilang dulo. Kung wala, itinatapon ang mga sagot.',
    },
    {
      id: 'ai-coding-beginners-08-q2',
      prompt: 'Ano ang ginagawa ng name attribute sa isang input?',
      choices: [
        'Binibigyan nito ang sagot ng label na dadaanan, tulad ng name o message',
        'Pinalalaki nito ang kahon at ginagawang mas madaling basahin ng mga bisita ang text sa loob',
        'Itinatakda nito ang kulay ng kahon',
        'Sinasabi nito sa browser kung aling page ang bubuksan sunod',
      ],
      answer: 0,
      explanation: 'Ang name ang label ng sagot sa ipinapadala ng form. Kung wala nito, karaniwang naiiwan ang value.',
    },
    {
      id: 'ai-coding-beginners-08-q3',
      prompt: 'Alin sa mga ito ang HINDI dapat hingin ng order form mo?',
      choices: [
        'Ang first name ng bisita',
        'Card number o password',
        'Phone number para i-arrange ang pickup',
      ],
      answer: 1,
      explanation: 'Hindi dapat mangolekta ng card number o password ang maliit na site. Itanong lang ang kailangan mo para magawa ang trabaho.',
    },
    {
      id: 'ai-coding-beginners-08-q4',
      prompt: 'Bakit dapat mong i-test mismo ang form mo sa phone?',
      choices: [
        'Para mas mabilis mag-load ang page',
        'Para matiyak na talagang dumarating ang mga sagot sa inaasahan mong lugar, dahil tahimik na nawawalan ng mga order ang sirang form',
        'Para palitan ang kulay ng Send button, at para magmukhang mas friendly ang buong form sa mga bisita',
        'Dahil hiniling ito ng AI',
      ],
      answer: 1,
      explanation: 'Puwedeng mukhang perpekto ang form at mawalan pa rin ng lahat. Ang pagpapadala lang ng test na sagot ang nagpapatunay na dumarating ito.',
    },
    {
      id: 'ai-coding-beginners-08-q5',
      audience: { max: 'beginner' },
      prompt: 'Sa paghahambing sa order slip, ano ang problema ng form sa plain page?',
      choices: [
        'Masyadong maliit ang mga slip para sulatan ng kapaki-pakinabang, kaya iniiwang blangko ng mga tao',
        'May address sa slip pero walang tao sa address na iyon na kukuha ng mga ito',
        'May gastos ang pag-print ng mga slip',
      ],
      answer: 1,
      explanation: 'Kailangan ng form ng tatanggap sa kabilang dulo ng mga sagot. Walang nandoon sa plain page.',
    },
    {
      id: 'ai-coding-beginners-08-q6',
      audience: { min: 'advanced' },
      prompt: 'Nagpo-post ang isang static site ng contact form nito sa third-party endpoint. Aling concern ang nabibilang sa review list mo?',
      choices: [
        'Kung maganda ang kulay ng button ng form at may magiliw na pangungusap sa ibabaw ng mga kahon',
        'Kung may malaking letra ang pangalan ng HTML file',
        'Spam abuse, data retention, consent at kung ano ang ginagawa ng service sa data',
        'Kung may h1 ang page',
      ],
      answer: 2,
      explanation: 'Nagdudulot ng mga tanong sa abuse, retention at privacy ang mga third-party form endpoint. Mas mahalaga ang mga ito kaysa sa styling kapag hawak mo na ang data ng ibang tao.',
    },
  ],
  task: {
    title: 'Magdagdag ng form na talagang gumagana',
    minutes: 20,
    steps: [
      'Gumawa ng Google Form na may tatlong tanong na kailangan ng page mo (halimbawa pangalan, paano ka makokontak, ano ang gusto nila). I-publish ito.',
      'Kopyahin ang embed code nito at ipadagdag sa AI sa page mo sa bagong section, na may malinaw na prompt na nagsasabing huwag galawin ang iba.',
      'Punan ang form mismo sa phone mo at i-check kung nakarating ang sagot sa Google account mo.',
      'Sumulat ng isang pangungusap sa ilalim ng form na nagsasabi kung ano ang gagawin mo sa mga sagot. Idagdag ang mga prompt sa prompt log mo.',
    ],
  },
  taskExtra: [
    { audience: { max: 'beginner' }, steps: ['Kung ayaw mong gumamit ng Google Forms, email link lang ang gamitin: ipadagdag sa AI ang malinaw na button na “Email us to order” na may address mo, at i-test ito.'] },
    { audience: { min: 'advanced' }, steps: ['Ilista ang mga panganib sa spam, retention at privacy ng receiver na pinili mo, at magdagdag ng isang mitigation para sa bawat isa sa mga note mo.'] },
  ],
};
