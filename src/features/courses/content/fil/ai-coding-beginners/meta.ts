import type { Course, Project } from '../../types';

/**
 * The official pages the English course cites (same urls; the labels are Tagalog renderings of the pages' English titles, product names kept).
 * Lessons import the ones they need from here.
 */
export const FIL_DOCS = {
  geminiLimits: { label: 'Gemini Apps Help: Mga usage limit', url: 'https://support.google.com/gemini/answer/16275805' },
  geminiActivity: { label: 'Gemini Apps Help: Pag-manage at pagbura ng activity mo', url: 'https://support.google.com/gemini/answer/13278892' },
  geminiPrivacy: { label: 'Gemini Apps Privacy Hub', url: 'https://support.google.com/gemini/answer/13594961' },
  chatgptPlans: { label: 'Mga plan ng ChatGPT (chatgpt.com/pricing)', url: 'https://chatgpt.com/pricing' },
  chatgptData: { label: 'OpenAI Help Center: Mga data control sa ChatGPT', url: 'https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt' },
  claudeArtifacts: { label: 'Claude Help Center: Ano ang artifacts at paano ito gamitin?', url: 'https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them' },
  claudePrivacy: { label: 'Claude Help Center: Sensitive data sa mga chat, at sino ang puwedeng makakita ng mga conversation ko', url: 'https://support.claude.com/en/articles/8325621-i-would-like-to-input-sensitive-data-into-my-chats-with-claude-who-can-view-my-conversations' },
  cursorPricing: { label: 'Presyo ng Cursor', url: 'https://cursor.com/pricing' },
  cursorDocs: { label: 'Cursor docs', url: 'https://cursor.com/docs' },
  mdnContent: { label: 'MDN: Paggawa ng content ng una mong website', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content' },
  mdnViewport: { label: 'MDN: Ang viewport meta element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport' },
  mdnForm: { label: 'MDN: Ang una mong form', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Your_first_form' },
  devtools: { label: 'Chrome for Developers: Pagbukas ng Chrome DevTools', url: 'https://developer.chrome.com/docs/devtools/open' },
  wcagContrast: { label: 'W3C: Pag-unawa sa WCAG 2.2, Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html' },
  ghAccount: { label: 'GitHub Docs: Paggawa ng account sa GitHub', url: 'https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github' },
  ghRepo: { label: 'GitHub Docs: Quickstart para sa mga repository', url: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories' },
  ghUpload: { label: 'GitHub Docs: Pagdagdag ng file sa repository', url: 'https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository' },
  ghCommits: { label: 'GitHub Docs: Tungkol sa mga commit', url: 'https://docs.github.com/en/pull-requests/reference/commits' },
  ghWhatPages: { label: 'GitHub Docs: Ano ang GitHub Pages?', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages' },
  ghCreatePages: { label: 'GitHub Docs: Paggawa ng GitHub Pages site', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site' },
  ghSource: { label: 'GitHub Docs: Pag-configure ng publishing source para sa GitHub Pages site mo', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site' },
  ghPush: { label: 'GitHub Docs: Tungkol sa push protection', url: 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection' },
  cloudflareUpload: { label: 'Cloudflare Pages docs: Direct Upload', url: 'https://developers.cloudflare.com/pages/get-started/direct-upload/' },
  googleForms: { label: 'Google Docs Editors Help: Paggawa at pag-share ng form', url: 'https://support.google.com/docs/answer/2839588' },
};

/** The date every cited page was opened (the English course's `CHECKED`). */
export const FIL_CHECKED = '2026-11-14';

export const aiCodingBeginnersFilMeta: Pick<Course, 'title' | 'tagline' | 'description' | 'finishLine' | 'objectives' | 'skills'> = {
  title: 'Coding gamit ang AI para sa Complete Beginners',
  tagline: 'Gumawa at mag-publish ng totoong one-page na website sa pamamagitan ng pag-ask sa AI, kahit wala kang coding experience.',
  description:
    'Ito ang unang course para sa kahit sino na hindi pa nakakapagsulat ng code. Matututo kang pumili ng free AI tool, humingi ng page sa malinaw na salita, basahin ang ginawa nito, ayusin kapag may sira, i-save ang gawa mo, i-publish ito at panatilihin itong ligtas. Sa dulo, may totoo kang site para sa totoong tao o negosyo.',
  finishLine: [
    'Isang one-page na website para sa totoong tao o negosyo, naka-publish na sa internet',
    'Isang prompt log ng mga request na gumana, at isang checklist ng mga bagay na hindi dapat i-paste kahit kailan',
    'Ang ugaling mag-ask, magbasa, mag-run at mag-check bago ka mag-publish',
  ],
  objectives: [
    'Sumulat ng malilinaw na prompt para humingi sa AI tool ng maliit na website',
    'Basahin sa simpleng salita ang nabuong HTML at CSS at baguhin ito sa pamamagitan ng pag-ask',
    'I-diagnose ang sirang page gamit ang browser at i-report ito nang malinaw sa AI',
    'Mag-save ng mga version ng gawa mo at i-undo ang mga pagkakamali',
    'Mag-publish ng static site nang libre at i-check ito sa phone',
    'Ilayo ang mga secret, password at private na data sa mga prompt at public na file',
  ],
  skills: [
    { id: 'ai-building-basics', label: 'Paano gumagana ang pagbuo gamit ang AI' },
    { id: 'choose-tools', label: 'Pagpili ng AI tool' },
    { id: 'write-prompts', label: 'Pagsulat ng prompt' },
    { id: 'read-generated-code', label: 'Pagbasa ng generated code' },
    { id: 'change-and-fix', label: 'Pagbago at pag-fix sa pamamagitan ng pag-ask' },
    { id: 'save-versions', label: 'Pag-save at pag-undo' },
    { id: 'forms-and-design', label: 'Mga form, kulay at layout' },
    { id: 'publish-site', label: 'Pag-publish ng site' },
    { id: 'stay-safe', label: 'Ligtas na paggamit ng AI' },
  ],
};

export const aiCodingBeginnersFilProjects: Project[] = [
  {
    id: 'ai-coding-beginners-p1',
    title: 'Isang naka-publish na page para sa totoong tao o negosyo',
    summary:
      'Gumawa, mag-check at mag-publish ng one-page na website para sa totoong tao o maliit na negosyo, gamit lang ang mga AI prompt, at itabi ang prompt log at workflow card mo.',
    outcome:
      'Isang live na link papunta sa totoong page na ginawa mo gamit ang AI, kasama ang prompt log na nagpapakita kung paano ka nag-ask, nag-check at nag-fix: patunay na kaya mong dalhin ang maliit na web job mula sa idea hanggang sa internet nang ligtas.',
    unlockAfterDay: 11,
    steps: [
      {
        id: 'ai-coding-beginners-p1-s1',
        text: 'Pumili ng totoong tao o maliit na negosyo at kausapin sila. Magkasundo kung para saan ang page, kunin ang totoong facts (pangalan, ano ang inaalok, presyo o detalye, oras ng bukas, paano sila makokontak) at kunin ang pahintulot nilang i-publish ang pangalan, contact details at anumang photo nila.',
      },
      {
        id: 'ai-coding-beginners-p1-s2',
        text: 'Isulat ang una mong prompt na may goal, ang totoong facts, ang itsura at request para sa isang file. I-save ang sagot bilang index.html, buksan ito sa browser mo at i-check ang bawat fact kasama ang may-ari.',
      },
      {
        id: 'ai-coding-beginners-p1-s3',
        text: 'Gumawa ng kahit limang pagbabago, isa-isa, na pinapangalanan ang piraso at sinasabing “huwag galawin ang iba”. I-commit ang bawat magandang version sa isang GitHub repository na may malinaw na note.',
      },
      {
        id: 'ai-coding-beginners-p1-s4',
        text: 'Magdagdag ng paraan para maabot ng mga bisita ang may-ari: email link o naka-embed na Google Form. Magpadala ng totoong test at kumpirmahing dumating ito.',
      },
      {
        id: 'ai-coding-beginners-p1-s5',
        text: 'Gawing madaling basahin ang page: i-check ang laki ng text, ang contrast at ang unang screen sa phone.',
      },
      {
        id: 'ai-coding-beginners-p1-s6',
        text: 'Patakbuhin ang pre-publish checklist at ang prompt na “Review bago ka mag-publish”. Alisin ang anumang private o secret sa bawat file at siguraduhing may pahintulot ka para sa bawat pangalan at photo.',
      },
      {
        id: 'ai-coding-beginners-p1-s7',
        text: 'I-publish gamit ang GitHub Pages at buksan ang address sa phone. Ipadala ito sa may-ari.',
        link: 'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site',
      },
      {
        id: 'ai-coding-beginners-p1-s8',
        audience: { max: 'beginner' },
        text: 'Panatilihing maliit ang scope: isang page, tatlo hanggang limang facts, isang action. Isulat sa prompt log mo kung ano ang in-ask mo at ano ang natutunan mo para sa kahit limang prompt, at ipaliwanag sa AI ang anumang bahagi ng code na hindi mo maintindihan.',
      },
      {
        id: 'ai-coding-beginners-p1-s9',
        audience: { min: 'advanced' },
        text: 'Magtrabaho na parang may client: sumulat ng tatlong acceptance criteria bago ka magsimula, magtabi ng mga screenshot sa dalawang width bilang review evidence, magdagdag ng pre-deploy check (links, contrast, secret scan) at maikling handover note na nagsasabi kung sino ang may-ari ng content at ng repository.',
      },
    ],
    submission: {
      kind: 'url',
      label: 'Link ng live na page mo',
      placeholder: 'https://your-name.github.io/my-first-site/',
      hint: 'Ang public na address ng naka-publish mong page. Sa mga note mo, sabihin kung para kanino ito at i-paste ang limang pinakamagandang prompt mo mula sa log.',
    },
    rubric: [
      'Live ang page sa public na address at gumagana ito sa phone pati sa computer',
      'Totoo ang mga pangalan, presyo, oras at contact details, at nakumpirma na ito ng tao o negosyo',
      'May isang malinaw na action ang mga bisita, at natanggap ang test message na ipinadala sa form o email link',
      'Madaling basahin ang text: tamang laki, malakas na contrast at malinaw na unang screen',
      'Walang password, key o private na detalye sa kahit anong file o sa repository, at may pahintulot para sa bawat pangalan at photo',
      'May prompt log na nagpapakita kung ano ang in-ask, ano ang binago at ano ang natutunan',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['Kayang ipaliwanag ng learner sa simpleng salita kung ano ang ginagawa ng head, ng body at ng isang CSS rule ng page niya'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['Hiwalay na HTML at CSS file ang site, o ipinapaliwanag ng learner kung bakit iisang file ang pinili niya'] },
      {
        audience: { min: 'advanced' },
        items: [
          'Naisulat ang acceptance criteria bago bumuo, may review evidence para sa bawat isa (diff o screenshot sa dalawang width)',
          'May automated o scripted na pre-deploy check para sa links, contrast at secrets, at may handover note na nagsasabi kung sino ang may-ari ng content at ng repository access',
        ],
      },
    ],
  },
];
