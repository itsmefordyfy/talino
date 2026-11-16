import type { Lesson } from '../../types';

export const starterLesson03Fil: Lesson = {
  id: 'starter-03',
  day: 3,
  title: 'Pag-check ng output ng AI',
  summary: 'Kilalanin ang mga hallucination at i-verify ang facts, code at numbers bago mo gamitin ang mga ito.',
  intro: {
    objectives: [
      'Makilala ang hallucination: maling output na ipinapakitang parang totoo.',
      'Piliin ang tamang paraan ng pag-check para sa facts, quotes, code, numbers at advice.',
      'I-test ang code na gawa ng AI gamit ang mga input na alam mo na ang tamang sagot.',
      'Itapat ang higpit ng pag-check sa laki ng nakataya.',
    ],
    why: 'Ang pag-check ng sagot bago mo ito gamitin ang pinagkaiba ng maingat na propesyonal sa taong nabibiktima ng imbentong source o maling numero. Ito ang habit na mas pinagkakatiwalaan ng mga employer, client at teacher.',
  },
  minutes: 15,
  skills: ['verification', 'prompting'],
  body: [
    {
      type: 'paragraph',
      text: 'Kahapon, natutunan mo kung paano makakuha ng mas magagandang sagot. Ngayon, ituturo ko sa iyo ang habit na nagpapaiba sa maingat na propesyonal sa iba: ang pag-check ng sagot bago mo ito gamitin.',
    },
    { type: 'heading', text: 'Ano ang hitsura ng hallucination' },
    {
      type: 'paragraph',
      text: 'Ang **hallucination** ay kapag may ginawang mali ang AI pero ipinakita nitong parang totoo. Karaniwang halimbawa: libro o article na wala naman talaga, section ng batas na mali ang numero, function o option ng library na hindi naman talaga umiiral, o statistic na walang source. Kamukha ito ng totoong sagot, kaya delikado.',
    },
    { type: 'heading', text: 'I-check ayon sa uri ng output' },
    {
      type: 'list',
      items: [
        '**Facts, petsa, batas, presyo:** kumpirmahin sa official o primary source, gaya ng website ng gobyerno, mismong page ng kumpanya o ang orihinal na paper.',
        '**Quotes at citations:** buksan ang source at hanapin ang eksaktong mga salita. Kung hindi mo makita, huwag mong gamitin.',
        '**Code:** i-run ito. Basahin ito line by line. I-test gamit ang normal na input, empty na input at maling input. Siguraduhing totoong umiiral sa official docs ang bawat library at function.',
        '**Numbers at math:** i-compute ulit nang ikaw mismo, o gumamit ng spreadsheet.',
        '**Advice (legal, tax, health, pera):** ituring lang itong panimulang gabay, at kumpirmahin sa taong qualified o sa official na opisina.',
      ],
    },
    {
      type: 'tip',
      text: 'Kapag mas mahalaga ang bagay, mas mahigpit dapat ang pag-check. Sapat na ang mabilis na basa para sa brainstorm ng mga blog title. Pero ang deliverable sa client, grade o pag-deploy sa production ay kailangan ng totoong verification.',
    },
    {
      type: 'activity',
      activity: {
        id: 'starter-03-match-1',
        kind: 'match',
        title: 'I-match ang output sa tamang check',
        prompt: 'Magkakaiba ang check na kailangan ng iba\'t ibang uri ng output. I-match ang bawat isa.',
        concept: 'verifying ai output',
        conceptLabel: 'pag-verify ng output ng AI',
        pairs: [
          {
            term: 'Petsa o numero ng section ng batas',
            definition: 'Kumpirmahin sa official o primary source.',
          },
          {
            term: 'Quote o citation',
            definition: 'Buksan ang source at hanapin ang eksaktong mga salita.',
          },
          {
            term: 'Code na gawa ng AI',
            definition: 'I-run ito, basahin, at i-test gamit ang normal, empty at maling input.',
          },
          {
            term: 'Numbers at math',
            definition: 'I-compute ulit nang ikaw mismo, o gumamit ng spreadsheet.',
          },
          {
            term: 'Advice tungkol sa batas, tax, kalusugan o pera',
            definition: 'Panimulang gabay lang: kumpirmahin sa taong qualified o sa official na opisina.',
          },
        ],
        hints: [
          'Itanong kung ano ang puwedeng magkamali sa bawat uri ng output.',
          'Puwedeng imbento ang mga quote, kaya ang check ay hanapin ang eksaktong mga salita sa source.',
          'Ang code lang ang talagang puwede mong i-run.',
        ],
        explanation: 'Kapag mas mahalaga ang bagay, mas mahigpit ang pag-check, at may sariling check ang bawat uri ng output: source para sa facts, eksaktong mga salita para sa quotes, pag-run para sa code, at sarili mong math para sa numbers.',
      },
    },
    { type: 'heading', text: 'Ipatulong sa assistant ang pag-check' },
    {
      type: 'paragraph',
      text: 'Puwede mong hilingin sa AI na ituro ang sarili nitong mga mahinang bahagi. Hindi nito pinapalitan ang sarili mong pag-check, dahil puwede rin itong magkamali tungkol sa sarili nito, pero masasabi nito kung saan ka dapat unang tumingin.',
    },
    {
      type: 'prompt',
      label: 'Hanapin ang mga mahinang bahagi',
      text: 'Suriin mo ang huli mong sagot. Ilista mo ang bawat factual claim, numero, pangalan o code function na nandoon. Para sa bawat isa, sabihin mo kung gaano ka-confident ang sagot mo rito (high, medium, low), at ituro mo nang eksakto kung saan ko ito ma-verify mula sa isang official source.',
    },
    {
      type: 'paragraph',
      text: 'Sa code, maraming pagkakamali ang nahuhuli ng mabilis na test na gaya ng nasa ibaba. Dito, sinusubukan ang function na gawa ng AI gamit ang mga input na alam mo na ang tamang sagot.',
    },
    {
      type: 'code',
      language: 'python',
      label: 'I-test bago ka magtiwala',
      code: `def peso_to_centavos(amount: float) -> int:
    return round(amount * 100)

assert peso_to_centavos(1) == 100
assert peso_to_centavos(19.99) == 1999
assert peso_to_centavos(0) == 0
print("All checks passed")`,
    },
    {
      type: 'paragraph',
      text: 'Bakit `round` at hindi `int`? Iniimbak ng computer ang decimal na gaya ng 19.99 bilang napakalapit na approximation lang, kaya ang 19.99 * 100 ay puwedeng lumabas na 1998.9999999999998 imbes na eksaktong 1999. Tinatanggal ng `int` ang decimal part kaya 1998 ang ibibigay nito, samantalang ang `round` ay kumukuha ng pinakamalapit na buong numero, 1999. Ito ang klase ng pagkakamaling hindi halata, na nahuhuli ng test na may alam na sagot pero hindi ng mabilis na basa.',
    },
    {
      type: 'visual',
      id: 'ai-llm-workflow',
      caption: 'Sundan ang isang prompt papunta sa model hanggang sa na-check na sagot, at tingnan kung ano ang ginagawa ng check kapag may nakitang problema.',
    },
    {
      type: 'activity',
      activity: {
        id: 'starter-03-fix-bug-1',
        kind: 'fix-bug',
        title: 'Ang mga centavo na nawala',
        prompt: 'Isinulat ng AI ang `peso_to_centavos`, at dapat pumasa ang dalawang check nito. Pero isa ang pumapalpak. Hanapin ang line na may bug, tapos piliin ang fix.',
        concept: 'testing ai code',
        conceptLabel: 'pag-test ng code na gawa ng AI',
        language: 'python',
        code: 'def peso_to_centavos(amount: float) -> int:\n    return int(amount * 100)\n\nassert peso_to_centavos(1) == 100\nassert peso_to_centavos(19.99) == 1999\nprint("All checks passed")',
        bugLine: 2,
        fixes: [
          {
            line: 'return round(amount * 100)',
            correct: true,
            why: 'Tama. Ang 19.99 * 100 ay lumalabas na 1998.9999999999998, at kinukuha ng `round` ang pinakamalapit na buong centavo, 1999.',
          },
          {
            line: 'return int(amount * 100) + 1',
            correct: false,
            why: 'Dahil dito, 101 ang ibabalik ng `peso_to_centavos(1)`, kaya babagsak ang unang check.',
          },
          {
            line: 'return amount * 100',
            correct: false,
            why: 'Float ang ibinabalik nito, at ang 19.99 * 100 ay 1998.9999999999998, kaya babagsak pa rin ang pangalawang check.',
          },
        ],
        lineNote: 'Ayos naman ang line na \'yan. Nasa line na nagko-convert ng amount sa centavos ang bug.',
        hints: [
          'Alin sa dalawang check ang pumapalpak? Iyong may decimal.',
          'Iniimbak ng computer ang mga decimal na gaya ng 19.99 bilang malapit na approximation lang. Ano ang lumalabas kapag ginawa ang 19.99 * 100?',
          'Tinatanggal ng `int` ang decimal part imbes na i-round sa pinakamalapit na value.',
        ],
        explanation: 'Bahagyang kulang sa 1999 ang product, at tinatanggal ng `int` ang fraction, kaya 1998 ang lumalabas. Naaayos ito kapag nag-round sa pinakamalapit na value. Ang pag-run ng test na alam mo na ang tamang sagot ang nakahuli nito.',
      },
    },
    {
      type: 'warning',
      text: 'Hindi verification ang pagtatanong ng "Sigurado ka ba?". Puwedeng gawing mali ng model ang tamang sagot dahil lang mukhang nagdududa ka.',
    },
    {
      type: 'takeaways',
      items: [
        'Ang hallucination ay maling output na ipinapakitang parang totoo: imbentong sources, batas, function o statistic.',
        'I-check ayon sa uri: official sources para sa facts, eksaktong mga salita para sa quotes, pag-run at pag-test para sa code, sarili mong math para sa numbers.',
        'Itapat ang higpit ng pag-check sa laki ng nakataya.',
        'Hindi verification ang pagtatanong ng "Sigurado ka ba?"; source o test ang verification.',
      ],
    },
  ],
  quiz: [
    {
      id: 'starter-03-q1',
      prompt: 'May assistant na nagbanggit ng "Section 14 ng isang batas sa Pilipinas" para sa isang claim. Ano ang tamang paraan para i-verify ito?',
      choices: [
        'Hilingin sa assistant na i-quote ulit ang section',
        'Ipagpalagay na tama ito, dahil nagbigay naman ng numero ng section',
        'Hanapin ang batas sa official o mapagkakatiwalaang legal source at basahin ang section na iyon',
      ],
      answer: 2,
      explanation:
        'Karaniwang hallucination ang mga numero ng section. Ang mismong teksto lang ng batas ang makakapagkumpirma nito.',
    },
    {
      id: 'starter-03-q2',
      prompt: 'Ano ang pinakamagandang unang check para sa code na gawa ng AI?',
      choices: [
        'I-run ito at i-test gamit ang mga input na alam mo ang tamang resulta',
        'Tingnan kung may comments ito',
        'Tingnan kung maikli ito',
        'Ipa-rate sa AI ang sarili nitong code',
      ],
      answer: 0,
      explanation:
        'Ipinapakita ng pag-run at pag-test kung ano talaga ang ginagawa ng code. Walang sinasabi ang comments o haba ng code kung tama ito.',
    },
    {
      id: 'starter-03-q3',
      prompt: 'Bakit mahinang paraan ng pag-verify ang "Sigurado ka ba?"',
      choices: [
        'Dahil laging oo ang sagot ng model',
        'Dahil puwedeng baguhin ng model ang sagot nito kapag kinuwestiyon mo, tama man o mali ito',
        'Dahil nauubos nito ang free messages mo',
      ],
      answer: 1,
      explanation:
        'Puwedeng baguhin ng model ang tamang sagot dahil lang kinontra mo ito. Ang totoong verification ay gumagamit ng source o test.',
    },
    {
      id: 'starter-03-q4',
      prompt: 'Aling output ang nangangailangan ng pinakamaingat na pag-check?',
      choices: [
        'Sampung ideya para sa theme ng team lunch',
        'Mas friendly na rewrite ng message na naisulat mo na',
        'Listahan ng mga kasingkahulugan ng "mabilis"',
        'Deadline ng tax na sasabihin mo sa client',
      ],
      answer: 3,
      explanation:
        'Itapat ang higpit ng pag-check sa laki ng nakataya. Puwedeng magdulot ng totoong problema ang maling deadline na sinabi sa client, kaya kumpirmahin ito sa official na opisina.',
    },
  ],
  task: {
    title: 'Manghuli ng pagkakamali',
    minutes: 15,
    steps: [
      'Magtanong sa assistant ng factual na tanong tungkol sa field mo, na may sagot na puwedeng i-check (isang definition, petsa o parameters ng isang function).',
      'I-run ang prompt na "Hanapin ang mga mahinang bahagi" sa sagot nito.',
      'I-verify ang dalawang claim na pinakamababa ang confidence, gamit ang official source o sa pag-run ng code.',
      'Magsulat ng isang line para sa bawat isa: tama, bahagyang tama o mali, at ang source na ginamit mo.',
    ],
  },
};
