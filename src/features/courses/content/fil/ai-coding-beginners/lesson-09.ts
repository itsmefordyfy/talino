import type { Lesson } from '../../types';
import { FIL_CHECKED, FIL_DOCS } from './meta';

export const aiCodingBeginnersLesson09Fil: Lesson = {
  id: 'ai-coding-beginners-09',
  day: 9,
  title: 'Pagpapaganda: mga kulay, layout at mga salita',
  summary: 'Gawing mas madaling basahin at mas magandang gamitin ang page mo gamit ang ilang design habit, at i-ask ang mga ito sa AI sa tiyak na mga salita.',
  intro: {
    objectives: [
      'Pumili ng nababasang mga kulay at laki ng text, at i-check ang contrast',
      'Humingi sa AI ng tiyak na design change sa halip na “pagandahin mo”',
      'Sumulat ng headline at button na nagsasabi sa mga bisita kung ano ang gagawin',
    ],
    why: 'Ang page na madaling basahin sa phone at malinaw na nagsasabi ng inaalok mo ay nakakakuha ng mas maraming customer kaysa sa magarang page na walang makabasa. Ang magandang itsura rito ay nangangahulugang malinaw, hindi puro dekorasyon.',
  },
  minutes: 25,
  skills: ['forms-and-design'],
  body: [
    { type: 'paragraph', text: 'Ang “pagandahin mo” ang pinakakaraniwang design request, at ito rin ang pinakakaunting silbi. Paano pagagandahin? Babaguhin ng AI ang mga kulay, font at spacing sa mga paraang hindi mo pinili. Ang design para sa maliit na page ay hindi tungkol sa panlasa; ito ay iilang habit na nagpapadali sa pagbasa at pag-act sa page. Matutunan ang mga habit, at makakahingi ka ng eksaktong gusto mo.' },
    { type: 'heading', text: 'Limang habit na pinakamahalaga' },
    {
      type: 'list',
      ordered: true,
      items: [
        '**Nababasang text.** Body text na nasa 16 hanggang 18 pixels, may espasyo sa pagitan ng mga linya (line height na mga 1.5 o 1.6) at maiikling linya. Ang maliit at siksik na text ang unang nagpapapagod sa page.',
        '**Sapat na contrast.** Dapat lumitaw ang text mula sa background nito. Hinihiling ng accessibility guidelines ang contrast ratio na hindi bababa sa 4.5 to 1 para sa normal na text at 3 to 1 para sa malaking text. Madaling pumasa ang dark brown sa cream. Hindi pumapasa ang light grey sa cream.',
        '**Kaunting kulay.** Sapat na ang isang background, isang text color at isang accent color para sa mga heading at button. Mabilis na nagmumukhang magulo ang mas marami.',
        '**Lugar para huminga.** Espasyo sa pagitan ng mga section at sa loob ng mga button. Mukhang mura ang siksik na page.',
        '**Phone muna.** Karamihan ng bisita mo ay darating gamit ang phone. Kailangan ng page ang viewport line sa head nito (karaniwang isinasama ito ng AI) para ipakita ito ng phone sa sarili nitong lapad sa halip na paliitin ang page na pang-desktop.',
      ],
    },
    {
      type: 'version',
      text: 'Ayon sa paliwanag ng W3C sa WCAG 2.2 success criterion 1.4.3, ang level AA ay nangangailangan ng contrast ratio na hindi bababa sa 4.5 to 1 para sa normal na text at 3 to 1 para sa malaking text (hindi bababa sa 18 point, o 14 point na bold). Sinasabi ng MDN na ang viewport meta tag na may width=device-width ay nagpapagamit sa mga mobile browser ng totoong lapad ng screen ng device sa halip na mas malawak na virtual na lapad na saka pa paliliitin para magkasya. Bilang reference, ang dark brown na text ng page sa cream na background nito ay may ratio na mga 13 to 1, at ang light grey (#cccccc) sa parehong cream ay mga 1.5 to 1.',
      checked: FIL_CHECKED,
      sources: [FIL_DOCS.wcagContrast, FIL_DOCS.mdnViewport],
    },
    { type: 'heading', text: 'Paghingi ng design sa tiyak na mga salita' },
    {
      type: 'table',
      headers: ['Sa halip na ito', 'I-ask ito'],
      rows: [
        ['Gawin itong nababasa', 'Gawing 18 pixels ang body text na may line height na 1.6'],
        ['Gawin itong makulay', 'Brown, cream at isang green na accent color lang ang gamitin, at panatilihing madaling basahin ang text'],
        ['Gawin itong may hangin', 'Dagdagan ang espasyo sa itaas ng bawat h2 heading at ang padding sa loob ng button'],
        ['Pagandahin ang button', 'Gawing mas malaki ang order button, na may hindi bababa sa 14 pixels na padding, para madaling i-tap sa phone'],
      ],
      caption: 'Ang mga tiyak na request ay nagbibigay sa AI ng masusukat. Ang mga malabo ay nagbibigay dito ng permiso na manghula.',
    },
    { type: 'prompt', label: 'Isang design request', text: 'Sa index.html ko, gawin ang mga change na ito at wala nang iba: gawing 18 pixels ang body text na may line height na 1.6, dagdagan ang espasyo sa itaas ng bawat h2 heading, at gawing mas madaling i-tap ang order button gamit ang mas malaking padding. Panatilihin ang parehong mga kulay. Ipadala mo sa akin ang buong updated na file.' },
    { type: 'code', language: 'css', label: 'Ang klase ng change na makikita mo', code: 'body {\n  font-family: Arial, sans-serif;\n  font-size: 18px;\n  line-height: 1.6;\n  margin: 0;\n  color: #3b2a20;\n  background: #fff8ee;\n}\nh2 {\n  color: #7a3e1d;\n  margin-top: 32px;\n}\n.button {\n  display: inline-block;\n  background: #7a3e1d;\n  color: white;\n  padding: 14px 24px;\n  border-radius: 8px;\n  text-decoration: none;\n}' },
    { type: 'paragraph', text: 'Isang bagay na dapat malaman kapag nagbabasa ng CSS na idinagdag ng AI: kapag dalawang rule ang nagtatakda ng parehong property para sa parehong piraso, at magkapantay ang pagiging tiyak nila, ang nasa ibabang bahagi ng file ang nananalo. Kaya puwedeng tahimik na mapalitan ng dagdag na rule ng AI sa ibaba ang isang rule malapit sa itaas, at kaya minsan ay parang walang nangyari sa isang change: may ibang rule na nananalo pa rin.' },
    { type: 'heading', text: 'Kasing-halaga ng mga kulay ang mga salita' },
    { type: 'paragraph', text: 'Ilang segundo lang ang kailangan ng bisita para magpasya kung para sa kanya ang page. Dapat sagutin ng unang screen ang tatlong tanong: ano ito, para kanino ito, at ano ang gagawin ko sunod. Ang “Welcome to our website” ay walang sinasagot sa mga iyon. Ang “Fresh homemade kakanin in Naga City. Order a day before” ay sumasagot sa unang dalawa. Ang button na nagsasabing “Order by email” ay sumasagot sa pangatlo, mas mahusay kaysa sa button na “Submit” o “Click here”. Isulat mo mismo ang mga salita, o humingi sa AI ng tatlong option at pumili at magtama ng isa, dahil ikaw ang nakakakilala sa mga bisita mo.' },
    { type: 'tip', text: 'I-check ang page sa lapad ng phone. Gawing napakakitid ng window ng browser mo, o buksan ang page sa phone mo kapag na-publish na ito. Kung maliit ang text o kailangan mong mag-scroll patagilid, sabihin sa AI nang eksakto kung ano ang nakikita mo.' },
    {
      type: 'paragraph',
      audience: { max: 'beginner' },
      text: 'Sa simpleng salita: ang pag-design ng page ay parang pag-aayos ng display window ng tindahan. Mabilis na dumadaan ang mga tao. Kung maliit ang karatula at nag-aaway ang mga kulay, tuloy lang sila sa paglakad. Kung malaki, malinaw at nagsasabi ng ibinebenta mo ang karatula, titigil sila. Ang contrast ay kung nababasa ba ang karatula mula sa kabilang kalye. Ang espasyo ay hindi pag-iiwan ng bakanteng window: ito ay ang hindi pagpapatong-patong ng lahat. At ang “pagandahin mo” ay parang pag-ask sa katulong na “ayusin mo nang mas maganda ang window” nang hindi sinasabi kung ano ang ibinebenta mo: panlasa nila ang makukuha mo, hindi ang sa iyo.',
    },
    {
      type: 'paragraph',
      audience: { min: 'advanced' },
      text: 'Mas mainam na ipahayag ang mga design constraint bilang mga token at check kaysa mga pang-uri: maikling palette na may pinangalanang custom property, type scale, spacing scale, minimum na laki ng touch target, at contrast threshold na ma-verify mo gamit ang tool. Ipa-keep sa model ang mga ito bilang variable para manatiling consistent ang mga susunod na edit, at i-verify ang resulta gamit ang mga automated check (contrast, viewport, tap target) sa halip na sa mata. Ang cascade order at specificity ang karaniwang dahilan kung bakit nag-aaway ang mga generated style; magtabi ng isang stylesheet, iwasan ang !important at alisin ang mga napalitang rule.',
    },
    {
      type: 'takeaways',
      items: [
        'Mas mahalaga kaysa dekorasyon ang nababasang text, sapat na contrast, kaunting kulay, espasyo at phone-first na page.',
        'Kailangan ng normal na text ng contrast ratio na hindi bababa sa 4.5 to 1; i-check ang light na text sa light na background.',
        'Humingi ng tiyak at masusukat na mga change at sabihing “huwag galawin ang iba”.',
        'Dapat sabihin ng headline at ng button kung ano ang inaalok mo at kung ano ang gagawin sunod.',
      ],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-09-fix-bug-1',
        kind: 'fix-bug',
        title: 'Ang footer na walang makabasa',
        story: 'Nasa footer ang opening hours ni Mila, pero sa cream niyang background ay halos hindi ito makita.',
        prompt: 'Isang linya ang nagpapahirap basahin sa footer. I-tap ito, tapos piliin ang pinakamagandang ayos.',
        concept: 'contrast',
        conceptLabel: 'contrast',
        language: 'css',
        code: `footer {
  text-align: center;
  padding: 16px;
  font-size: 14px;
  color: #cccccc;
}`,
        bugLine: 5,
        fixes: [
          { line: '  color: #3b2a20;', correct: true, why: 'Ito ang parehong dark brown ng text ng page, na may contrast ratio na mga 13 to 1 sa cream na background, mas mataas pa sa 4.5 to 1.' },
          { line: '  color: #dddddd;', correct: false, why: 'Mas light pa ito, kaya mas mahirap basahin ang footer kaysa dati.' },
          { line: '  color: #999999;', correct: false, why: 'Mas dark kaysa dati, pero 2.7 to 1 lang ang naaabot nito sa cream, mas mababa pa rin sa 4.5 to 1 na kailangan ng normal na text.' },
          { line: '  color: #ffffff;', correct: false, why: 'Halos hindi makita ang puti sa cream, na may ratio na mga 1 to 1.' },
        ],
        hints: [
          'Aling linya ang nagtatakda ng kulay ng text ng footer?',
          'Dapat mas dark nang malaki ang text kaysa sa cream na background.',
          'Gamitin ang parehong dark brown ng ibang text.',
        ],
        explanation: 'Mga 1.5 to 1 lang ang contrast ratio ng light grey sa cream. Ang dark brown sa cream ay mga 13 to 1, komportableng mas mataas sa 4.5 to 1 na guideline para sa normal na text.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-09-predict-1',
        kind: 'predict-output',
        title: 'Aling rule ang nananalo?',
        story: 'Nagdagdag ang AI ng pangalawang rule malapit sa ibaba ng style section.',
        prompt: 'Anong kulay ang magiging text ng paragraph?',
        concept: 'later rule wins',
        conceptLabel: 'nananalo ang mas huling rule',
        language: 'html',
        code: `<style>
  p { color: blue; }
  p { color: green; }
</style>
<p>Open Monday to Saturday</p>`,
        expected: 'green',
        choices: ['green', 'blue', 'a mix of blue and green', 'black'],
        wrongNotes: {
          blue: 'Parehong nag-a-apply sa p ang dalawang rule at magkapantay ang pagiging tiyak nila, kaya ang mas huli ang nangingibabaw sa mas nauna.',
          'a mix of blue and green': 'Hindi naghahalo ang mga kulay: para sa isang property, isang panalo ang pinipili ng browser.',
          black: 'Ang black ay default na kulay lang kapag walang rule na nagtatakda nito. Dalawang rule ang nagtatakda nito rito.',
        },
        hints: [
          'Parehong tungkol sa iisang bagay sa iisang piraso ang dalawang rule.',
          'Kapag magkapantay ang pagiging tiyak, ang pagkakasunod-sunod sa file ang nagpapasya.',
          'Ang rule na mas mababa sa file ang nananalo.',
        ],
        explanation: 'Dalawang magkapantay na tiyak na rule para sa parehong property sa parehong piraso: ang mas huli ang nananalo, kaya green ang paragraph. (Na-check sa browser: ang computed color ay rgb(0, 128, 0).)',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-coding-beginners-09-scenario-1',
        kind: 'scenario',
        title: 'Aling headline ang gumagana?',
        prompt: 'Piliin ang headline at button na pinakabagay sa unang screen.',
        concept: 'clear words',
        conceptLabel: 'malilinaw na salita',
        situation: 'May headline at button sa itaas ng page ng Mila’s Kakanin. Galing ang mga bisita sa link sa isang lokal na community page, gamit ang phone nila.',
        options: [
          { text: 'Headline: “Welcome to our website”. Button: “Submit”.', consequence: 'Hindi masabi ng mga bisita kung ano ang ibinebenta ng shop o kung ano ang ginagawa ng button, at maraming umaalis.', quality: 'poor' },
          { text: 'Headline: “Fresh homemade kakanin in Naga City”. Subline: “Order one day before.” Button: “Order by email”.', consequence: 'Sa ilang segundo, alam ng mga bisita kung ano ito, nasaan ito at ano ang gagawin sunod.', quality: 'best' },
          { text: 'Headline: “The Finest, Most Exceptional Artisanal Rice Cakes Experience”. Button: “Click here”.', consequence: 'Kaunti ang sinasabi ng malalaking salita, at hindi sinasabi ng “Click here” kung ano ang mangyayari.', quality: 'poor' },
          { text: 'Headline: “Mila’s Kakanin”. Button: “Order”.', consequence: 'Mas mabuti kaysa wala. Pero baka hindi alam ng mga bisita kung ano ang ibinebenta ni Mila o saan.', quality: 'acceptable' },
        ],
        hints: [
          'I-check ang tatlong tanong: ano ito, para kanino ito, ano ang gagawin ko?',
          'Dapat sabihin ng button kung ano ang mangyayari kapag pinindot ito.',
          'Ang headline na may pagkain, lugar at tagubilin sa pag-order.',
        ],
        explanation: 'Dapat sabihin ng unang screen kung ano ang inaalok mo, saan, at kung ano ang gagawin. Mas mahusay ang payak at tiyak na mga salita kaysa sa magagarang salita.',
      },
    },
  ],
  quiz: [
    {
      id: 'ai-coding-beginners-09-q1',
      prompt: 'Anong contrast ratio ang hinihingi ng accessibility guidelines para sa normal na laki ng text?',
      choices: ['Hindi bababa sa 4.5 to 1', 'Hindi bababa sa 1.5 to 1', 'Hindi bababa sa 20 to 1', 'Eksaktong 3 to 1'],
      answer: 0,
      explanation: 'Ang level AA ay humihingi ng hindi bababa sa 4.5 to 1 para sa normal na text at 3 to 1 para sa malaking text.',
    },
    {
      id: 'ai-coding-beginners-09-q2',
      prompt: 'Aling design request ang magbibigay sa iyo ng pinakamaraming kontrol?',
      choices: [
        'Gawing mas moderno at maganda ang buong site',
        'Magdagdag ng mga cool na effect at animation para mas maging exciting ang buong page sa mga bisita',
        'Gawing 18 pixels ang body text na may line height na 1.6, at huwag galawin ang iba',
      ],
      answer: 2,
      explanation: 'Ang masusukat na request ay nagbibigay sa AI ng eksaktong gagawin. Ang mga salitang tulad ng “maganda” ay nagpapapili sa kanya para sa iyo.',
    },
    {
      id: 'ai-coding-beginners-09-q3',
      prompt: 'Bakit kailangan ng page ang viewport line sa head nito para sa mga phone?',
      choices: [
        'Para maganda ang print ng page sa papel, sa tamang kulay, kapag nagpasya ang bisitang i-print ito',
        'Para ipakita ng phone ang page sa sarili nitong lapad sa halip na paliitin ang mas malawak na page',
        'Para mag-load ang page sa loob ng isang segundo',
        'Para mas maliwanag ang mga kulay',
      ],
      answer: 1,
      explanation: 'Kung wala ito, maraming phone ang gumuguhit ng page na parang mas malapad ang screen, at pinaliliit ito, kaya nagiging napakaliit ng text.',
    },
    {
      id: 'ai-coding-beginners-09-q4',
      prompt: 'Nagdagdag ka ng bagong CSS rule sa ibaba, pero hindi nagbabago ang kulay ng heading. May rule na mas mataas na nagtatakda ng parehong kulay para sa parehong piraso. Ano ang pinakamalamang?',
      choices: [
        'Kailangang ganap na i-restart ang browser at alisan ng laman ang mga naka-save nitong file bago lumabas ang anumang bagong rule',
        'Nakalimutan ng AI kung paano magsulat ng CSS',
        'Dapat manalo ang mas huling rule kung magkapantay ang pagiging tiyak, kaya hanapin kung may mas tiyak na rule o typo',
      ],
      answer: 2,
      explanation: 'Para sa mga rule na magkapantay ang pagiging tiyak, ang mas huli ang nananalo. Kung hindi ito nanalo, may ibang rule na mas tiyak o may mali sa spelling.',
    },
    {
      id: 'ai-coding-beginners-09-q5',
      audience: { max: 'beginner' },
      prompt: 'Sa paghahambing sa display window ng tindahan, ano ang contrast?',
      choices: [
        'Kung nababasa ba ang karatula mula sa kabilang kalye',
        'Kung ilang magkakaibang karatula ang kasya sa display window nang sabay-sabay',
        'Ang presyo ng karatula',
      ],
      answer: 0,
      explanation: 'Ang contrast ay kung gaano kalinaw na lumilitaw ang text mula sa background nito, parang karatulang nababasa mula sa malayo.',
    },
    {
      id: 'ai-coding-beginners-09-q6',
      audience: { min: 'advanced' },
      prompt: 'Patuloy na nag-aaway ang mga generated style pagkatapos ng ilang AI edit. Ano ang pinakaepektibong structural na ayos?',
      choices: [
        'Magdagdag ng !important sa bawat declaration',
        'Pagsama-samahin sa isang stylesheet na may mga pinangalanang custom property, at alisin ang mga napalitang rule',
        'Ipasulat sa model ang parehong mga rule sa ibang pagkakasunod-sunod sa bawat pagkakataon, hanggang may gumana',
        'I-inline ang bawat style sa bawat element',
      ],
      answer: 1,
      explanation: 'Galing sa naipong mga override ang mga nag-aaway na rule. Ang iisang pinagmulan ng mga design value at ang pag-alis ng mga patay na rule ang nagpapahulaan sa mga susunod na edit.',
    },
  ],
  task: {
    title: 'Gawing madaling basahin ang page mo',
    minutes: 20,
    steps: [
      'Mag-save ng kopya ng kasalukuyan mong page. Humingi ng isang tiyak na change sa laki ng text at line height, tapos i-check ito.',
      'I-check sa mata ang contrast ng text mo laban sa background nito, at kung may light sa light, humingi ng mas dark na kulay.',
      'Isulat ulit ang headline at button mo para sabihin ng unang screen kung ano ang inaalok mo, saan, at kung ano ang gagawin. Ipa-apply sa AI nang eksakto ang mga salita mo.',
      'Buksan ang page sa phone o sa napakakitid na window at itala kung ano pa ang babaguhin mo.',
    ],
  },
  taskExtra: [
    { audience: { max: 'beginner' }, steps: ['I-ask sa AI: “May anumang bagay ba sa page ko na mahihirapang basahin ng taong mahina ang paningin?” at magpasya kung alin sa mga sagot nito ang sang-ayon ka.'] },
    { audience: { min: 'advanced' }, steps: ['Palitan ng mga pinangalanang custom property ang mga hex value at sukatin ang bawat pares ng text at background laban sa 4.5 to 1.'] },
  ],
};
