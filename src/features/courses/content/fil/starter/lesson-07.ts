import type { Lesson } from '../../types';

export const starterLesson07Fil: Lesson = {
  id: 'starter-07',
  day: 7,
  title: 'Pagpili ng path mo',
  summary: 'Kilalanin ang limang career course ng Talino at piliin ang pinakabagay sa kung nasaan ka ngayon.',
  intro: {
    objectives: [
      'Ilarawan kung para kanino ang bawat isa sa limang career course ng Talino.',
      'Piliin ang course na bagay sa gusto mong marating sa susunod na anim na buwan.',
      'Sabihin kung ano ang pinatutunayan ng mga project ng course, at kung ano ang hindi kayang ipangako ng kahit anong course.',
    ],
    why: 'Ang pinakamagandang course ay ang magbibigay sa iyo ng totoong maipapakita agad, trabaho man ito, mga client, mas magagandang klase o isang live na site. Kapag para sa susunod na anim na buwan ang pinipili mo, nagiging realistic at kayang gawin ang plano mo.',
  },
  minutes: 15,
  skills: ['career-direction', 'ai-workflow'],
  body: [
    {
      type: 'paragraph',
      text: 'Nakarating ka na sa Day 7! Alam mo na ngayon kung paano gumagana ang mga AI assistant, paano mag-prompt sa kanila, paano i-check ang mga sagot nila at paano sila gamitin nang ligtas. Susunod, mas lalalim ka sa direksyong bagay sa sitwasyon mo ngayon. May limang career course ang Talino.',
    },
    { type: 'heading', text: 'Ang limang course' },
    {
      type: 'list',
      items: [
        '**Developer:** para sa mga bagong graduate ng IT at CS at sa mga baguhang developer. Gagawa ka ng totoong mga project gamit ang AI coding assistant, matututo kang mag-review ng code nito, at maghahanda ng portfolio at mga sagot sa interview para sa una mong role.',
        '**Experienced Developer:** para sa mga developer na halos by hand pa rin ang pag-code. Isama ang AI sa workflow na mayroon ka na: reviews, tests, refactoring, documentation, at ang pag-alam kung kailan hindi ito dapat gamitin.',
        '**Freelancer & VA:** para sa mga career changer at freelancer. Mag-offer ng mga serbisyong may tulong ng AI, magsulat ng mas magagandang proposal para sa mga platform tulad ng OnlineJobs.ph, at makipagtrabaho sa mga client nang propesyonal.',
        '**Educator:** para sa mga IT instructor at professor. Magplano ng mga lesson at assessment gamit ang AI, mag-design ng mga activity na sumusukat pa rin kung may natutunan talaga ang estudyante, at gabayan ang mga estudyante sa tapat na paggamit ng AI.',
        '**Builder:** para sa mga hindi taga-tech na gustong magkaroon ng sariling app o website. Mula sa idea hanggang sa gumaganang site gamit ang mga vibe-coding tool, at matuto ng sapat para manatili itong ligtas at tumatakbo.',
      ],
    },
    {
      type: 'table',
      headers: ['Course', 'Para kanino', 'Ano ang gagawin mo'],
      rows: [
        [
          'Developer',
          'Mga bagong graduate ng IT at CS at mga baguhang developer',
          'Gumawa ng totoong mga project gamit ang AI coding assistant, i-review ang code nito, at maghanda ng portfolio at mga sagot sa interview.',
        ],
        [
          'Experienced Developer',
          'Mga developer na halos by hand pa rin ang pag-code',
          'Isama ang AI sa workflow mo: reviews, tests, refactoring, documentation, at ang pag-alam kung kailan hindi ito dapat gamitin.',
        ],
        [
          'Freelancer & VA',
          'Mga career changer at freelancer',
          'Mag-offer ng mga serbisyong may tulong ng AI at magsulat ng mas magagandang proposal para sa mga platform tulad ng OnlineJobs.ph.',
        ],
        [
          'Educator',
          'Mga IT instructor at professor',
          'Magplano ng mga lesson at assessment gamit ang AI at gabayan ang mga estudyante sa tapat na paggamit ng AI.',
        ],
        [
          'Builder',
          'Mga hindi taga-tech na gustong magkaroon ng sariling app o website',
          'Mula sa idea hanggang sa gumaganang site gamit ang mga vibe-coding tool, at panatilihin itong ligtas at tumatakbo.',
        ],
      ],
      caption: 'Ang limang career course ng Talino',
    },
    {
      type: 'activity',
      activity: {
        id: 'starter-07-match-1',
        kind: 'match',
        title: 'Sino ang bagay sa aling course?',
        prompt: 'Basahin kung nasaan ngayon ang bawat tao at ano ang gusto nilang marating sa susunod na anim na buwan. Ipares ang bawat isa sa course na bagay sa kanya.',
        concept: 'career direction',
        conceptLabel: 'direksyon ng career',
        labels: { terms: 'Mga tao', meanings: 'Bagay na course' },
        pairs: [
          {
            term: 'Nag-graduate si Mika ng BSIT noong nakaraang April at gusto niya ng junior developer job, na may mga project na maipapakita sa interview.',
            definition: 'Developer',
          },
          {
            term: 'Walong taon nang nagsusulat ng Java sa isang bangko si Rafael, lahat by hand, at gusto niya ng tulong sa reviews at tests.',
            definition: 'Experienced Developer',
          },
          {
            term: 'Umalis si Joy sa call center job niya at gusto niya ng mga online client na magbabayad para sa AI-assisted admin support.',
            definition: 'Freelancer & VA',
          },
          {
            term: 'Nagtuturo si Sir Ramos ng Programming 2 at palagi siyang nakakatanggap ng take-home code na masyadong perpekto ang hitsura.',
            definition: 'Educator',
          },
          {
            term: 'May catering business si Aling Nena at gusto niya ng sariling website na may menu niya, nang hindi kailangang matutong mag-code.',
            definition: 'Builder',
          },
        ],
        hints: [
          'Itanong kung ano ang gusto ng bawat isa sa loob ng anim na buwan: unang trabaho, mas magandang workflow, clients, mas magagandang klase o isang site.',
          'Dalawa sa kanila ay developer: ang isa ay nagsisimula pa lang, ang isa ay ilang taon nang nagko-code.',
          'Ang mga client na nagbabayad para sa serbisyo ay tumuturo sa isang course; ang mga assignment na sumusukat pa rin kung may natutunan talaga ang estudyante ay tumuturo sa iba.',
        ],
        explanation: 'Kailangan ni Mika ng unang trabaho at patunay, marunong nang mag-code si Rafael at gusto lang niyang isama ang AI sa workflow niya, gusto ni Joy ng mga client na nagbabayad, kailangan ni Sir Ramos ng mga assessment na sumusukat pa rin kung may natutunan talaga ang estudyante, at gusto ni Aling Nena ng gumaganang site nang hindi nagiging programmer.',
      },
    },
    { type: 'heading', text: 'Paano pumili' },
    {
      type: 'paragraph',
      text: 'Piliin ang course na bagay sa gusto mo sa susunod na anim na buwan, hindi habambuhay. Puwede kang kumuha ng iba sa susunod. Kung dalawa ang bagay sa iyo, simulan sa isa na mas mabilis magbibigay ng maipapakita mo: isang portfolio project, isang client proposal, isang lesson plan o isang live na site.',
    },
    {
      type: 'tip',
      text: 'Bawat course ay nagtatapos sa mga project na nire-review ni Tali. Ang mga project na iyon ang patunay mo. Ipinapakita nila ang skills mo sa isang employer, client o school. Walang course na makakapangako ng trabaho o mga client, pero malaking tulong ang totoong patunay para mas lumakas ang tsansa mo.',
    },
    {
      type: 'prompt',
      label: 'Pag-usapan natin',
      text: 'Tulungan mo akong pumili ng learning path. Tungkol sa akin: [ang background ko, kasalukuyang trabaho o pag-aaral, at ilang oras sa isang linggo ang kaya kong ilaan sa pag-aaral]. Ang goal ko sa susunod na anim na buwan: [goal]. Ang mga option ay: Developer, Experienced Developer, Freelancer & VA, Educator, Builder. Magtanong ka muna ng hanggang tatlong tanong, tapos magrekomenda ka ng isa at ipaliwanag mo kung bakit sa wala pang 120 salita. Maging tapat ka kung kulang ang oras ko para sa goal ko.',
    },
    { type: 'heading', text: 'Bago ka umalis: ang una mong project' },
    {
      type: 'paragraph',
      text: 'Na-unlock na ngayon ang starter project mo. Gagamit ka ng assistant para gumawa ng maliit pero totoong bagay, tapos ikaw na mismo ang mag-iimprove nito. Pinagsasama nito ang lahat ng natutunan mo ngayong linggo: isang magandang prompt, maingat na pag-check, ligtas na habit at ang sarili mong judgement.',
    },
    {
      type: 'warning',
      text: 'Mag-ingat sa kahit anong course, coach o post na nangangako ng garantisadong sweldo o kita mula sa AI. Magbuo ka ng skills at patunay, at hayaan mong sumunod ang resulta.',
    },
    {
      type: 'takeaways',
      items: [
        'May limang career course ang Talino: Developer, Experienced Developer, Freelancer & VA, Educator at Builder.',
        'Pumili para sa susunod na anim na buwan, hindi habambuhay; puwede kang kumuha ng iba sa susunod.',
        'Kung dalawa ang bagay sa iyo, simulan sa isa na mas mabilis magbibigay ng maipapakita mo.',
        'Ang mga project ay patunay ng skills; walang course na makakapangako ng trabaho o kita.',
        'Mag-ingat sa sinumang nangangako ng garantisadong kita mula sa AI.',
      ],
    },
  ],
  quiz: [
    {
      id: 'starter-07-q1',
      prompt: 'Isang senior Java developer na bihirang gumamit ng AI ang gustong bumilis ang trabaho nang hindi bumababa ang quality. Aling course ang pinakabagay?',
      choices: ['Builder', 'Experienced Developer', 'Educator', 'Freelancer & VA'],
      answer: 1,
      explanation:
        'Isinasama ng Experienced Developer course ang AI sa coding workflow na mayroon ka na, kaya tugma ito sa goal na ito.',
    },
    {
      id: 'starter-07-q2',
      prompt: 'Isang may-ari ng maliit na bakery na walang background sa coding ang gustong magkaroon ng online order page. Aling course ang bagay?',
      choices: ['Builder', 'Developer', 'Experienced Developer'],
      answer: 0,
      explanation:
        'Dinadala ng Builder course ang mga hindi taga-tech mula sa isang idea hanggang sa gumaganang site gamit ang mga vibe-coding tool.',
    },
    {
      id: 'starter-07-q3',
      prompt: 'Ano ang ibinibigay sa iyo ng mga project ng course?',
      choices: [
        'Garantisadong job offer',
        'Nakatakdang buwanang kita',
        'Patunay ng skills mo na maipapakita mo sa mga employer, client o school',
      ],
      answer: 2,
      explanation:
        'Ipinapakita ng mga project ang kaya mong gawin. Walang course na makakapagbigay ng garantiya sa trabaho o kita.',
    },
    {
      id: 'starter-07-q4',
      prompt: 'Parehong bagay sa iyo ang dalawang course. Ano ang magandang paraan para magdesisyon?',
      choices: [
        'Piliin ang mas maraming lesson',
        'Huwag magdesisyon, kunin ang dalawa nang sabay',
        'Piliin ang pinili ng mga kaibigan mo',
        'Simulan sa isa na mas mabilis magbibigay ng maipapakita mo',
      ],
      answer: 3,
      explanation:
        'Ang maagang patunay ay nagpapanatili ng gana mo at nagpapakitang may silbi ka. Puwede mong kunin ang isa pang course sa susunod.',
    },
  ],
  task: {
    title: 'Pumili at magplano',
    minutes: 10,
    steps: [
      'I-run ang "Pag-usapan natin" na prompt gamit ang totoong detalye mo.',
      'Pumili ng isa sa limang course.',
      'Mag-block ng oras sa calendar mo para sa pag-aaral sa susunod na dalawang linggo, mga 15 minuto kada araw.',
      'Buksan ang starter project at basahin ang mga step nito.',
    ],
  },
};
