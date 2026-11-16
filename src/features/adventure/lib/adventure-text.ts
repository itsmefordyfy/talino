/**
 * Tagalog (`fil`) wording of the game layer's data: level titles, profile titles and the course
 * worlds. English stays where the rules are (`xp.ts`, `unlocks.ts`, `world-themes.ts`); ids never change. Rank-like
 * titles in tech slang (Bug Spotter, Code Tinkerer, Problem Solver, Sharp Debugger, Talino Mentor, Bug Hunter…) stay in
 * English on purpose, like a game rank; the rest is plain Tagalog. Voice and glossary: `docs/i18n/tagalog-style-guide.md`.
 */

/** Same order as `LEVEL_TITLES`. */
export const LEVEL_TITLES_FIL = [
  'Mausisang Baguhan',
  'Masigasig na Learner',
  'Bug Spotter',
  'Code Tinkerer',
  'Matatag na Builder',
  'Problem Solver',
  'Sharp Debugger',
  'Maaasahang Teammate',
  'Batikang Maker',
  'Talino Mentor',
] as const;

/** By `ProfileTitle.id`. */
export const PROFILE_TITLES_FIL: Record<string, string> = {
  'talino-master': 'Talino Master',
  graduate: 'Graduate',
  'consistency-champion': 'Consistency Champion',
  'code-explorer': 'Code Explorer',
  'logic-master': 'Logic Master',
  'bug-hunter': 'Bug Hunter',
  'project-builder': 'Project Builder',
  'ai-builder': 'AI Builder',
};

export type WorldTextFil = { name: string; premise: string; mission: string };

/** By course id; the English themes and icons are in `world-themes.ts`. */
export const WORLD_TEXT_FIL: Record<string, WorldTextFil> = {
  starter: {
    name: 'Basecamp',
    premise: 'Sa Basecamp nagsisimula ang bawat paglalakbay sa tech, kung saan may marka ang mga daan at nakasindi ang mga ilaw.',
    mission: 'Sasamahan ka ni Tali sa mga unang hakbang. Sa sarili mong bilis lang.',
  },
  developer: {
    name: 'Developer Academy',
    premise: 'Kailangan ng Developer Academy ang tulong mo: bukas na ang mga workshop at welcome ang bagong batch ng mga builder.',
    mission: 'Tapusin ang bawat mission, at magtapos sa isang project na nagpapakita ng kaya mo.',
  },
  freelancer: {
    name: 'Freelance Harbor',
    premise: 'Sa Freelance Harbor, naglalayag ang mga independent na worker dala ang sarili nilang offer at sarili nilang bilis.',
    mission: 'Pag-aralan ang craft, isang mission kada beses, tapos ilunsad ang trabahong totoong sa’yo.',
  },
  builder: {
    name: 'Workshop ng Builder',
    premise: 'May mga mesa, tools, at isang ideyang naghihintay na buhayin ng isang tulad mo sa Workshop.',
    mission: 'Sundan ang mga mission at buuin ang sarili mong app o site, hakbang-hakbang.',
  },
  experienced: {
    name: 'Senior Summit',
    premise: 'Sa Summit, nagpapalitan ng kuro-kuro ang mga bihasang developer at hinahasa ang kanilang craft.',
    mission: 'Gawin ang bawat mission, itago ang kapaki-pakinabang, at ibalik ito sa team mo.',
  },
  educator: {
    name: 'Grove ng mga Guro',
    premise: 'Sa Grove, nagbabahagi ang mga guro ng mga gumagana at nagtutulungang lumago.',
    mission: 'Tapusin ang mga mission at umuwi na may mga ideya at materyales na handa para sa classroom mo.',
  },
  'mini-python-ai': {
    name: 'Python Forge',
    premise: 'Mainit na ang Forge at handa na ang palihan para sa isang maliit pero matalas na project.',
    mission: 'Limang maiikling mission, tapos isang project na maiuuwi mo.',
  },
  'mini-ai-engineering': {
    name: 'AI Engineering Lab',
    premise: 'Tahimik ang Lab, maayos ang mga mesa, at may espasyo para sa mga eksperimento mo.',
    mission: 'Subukan ang bawat mission, tapos tapusin sa isang project.',
  },
  'mini-ai-qa': {
    name: 'Bug Patrol',
    premise: 'Naghahanap ang Bug Patrol ng mga matang maingat at isipang mausisa.',
    mission: 'Gawin ang limang mission, tapos harapin ang huling kaso.',
  },
  'mini-ai-data': {
    name: 'Data Observatory',
    premise: 'Mula sa Observatory, lumilitaw ang mga pattern sa data para sa mga tumitingin nang mabuti.',
    mission: 'Limang maiikling mission at isang project: tumingin nang mabuti at matuto.',
  },
  'mini-no-code-automation': {
    name: 'Automation Garage',
    premise: 'Umuugong ang Garage sa mga maliliit na makinang nakakatipid ng oras ng mga tao.',
    mission: 'Buuin ang sarili mo, isang mission kada beses, at magtapos sa isang project.',
  },
  'mini-sell-your-app': {
    name: 'Launch Market',
    premise: 'Bukas na ang Market at naghihintay ang mga puwesto ng bagay na karapat-dapat ipakita.',
    mission: 'Limang maiikling mission, tapos isang project para mailabas mo ang gawa mo.',
  },
  'ai-dev-intro': {
    name: 'Signal Station',
    premise: 'Sa Signal Station, natututo ang mga developer na basahin ang isang bagong uri ng teammate: mabilis, matatas, at minsan ay mali.',
    mission: 'Alamin kung paano ito mag-isip at kung saan ito nadadapa, tapos itakda ang mga patakarang susundin mo.',
  },
  'ai-dev-chatgpt': {
    name: 'Conversation Hall',
    premise: 'Sa Conversation Hall, ang magagandang tanong ang nagbubukas ng pinto na isinasara ng mga hindi magandang tanong.',
    mission: 'Magtanong nang malinaw, i-check ang lahat, at bumuo ng totoong bagay mula sa mga sagot.',
  },
  'ai-dev-claude': {
    name: 'Reading Room',
    premise: 'Sa Reading Room, nakalatag sa mahahabang mesa ang buong codebase, handang intindihin.',
    mission: 'Tapusin ang bawat mission at iwan ang bawat repository na mas malinaw kaysa nang datnan mo ito.',
  },
  'ai-dev-claude-code': {
    name: 'Terminal Tower',
    premise: 'Sa tuktok ng Terminal Tower, may agent na naghihintay ng planong karapat-dapat isagawa.',
    mission: 'Magplano muna, i-approve ang bawat step, at i-ship ang feature na ikaw mismo ang nag-check.',
  },
  'ai-dev-cursor': {
    name: 'Forge ng Editor',
    premise: 'Sa Forge, maraming file ang hinuhubog nang sabay-sabay at sinisiyasat ang bawat pagbabago bago ito lumamig.',
    mission: 'Itakda ang mga rule mo, gabayan ang trabaho, at i-review ang bawat diff bago ito pumasok.',
  },
  'ai-dev-codex': {
    name: 'Delegation Docks',
    premise: 'Sa Docks, nilalagyan ng malinaw na instruction ang mga task at ipinapadala sa dagat.',
    mission: 'Sumulat ng mga task na kayang tapusin ng agent, tapos suriin ang bawat kargamentong bumabalik.',
  },
  'ai-dev-advanced': {
    name: 'Summit ng Architect',
    premise: 'Sa Summit nagpapasya ang mga team kung paano magtutulungang bumuo ang mga tao at agent.',
    mission: 'Idisenyo ang workflow, patunayang gumagana ito, at magtapos sa isang application na sarili mo.',
  },
  // The AI-first catalog (2026-11-14).
  'ai-coding-beginners': {
    name: 'First Light Farm',
    premise: 'Gising na ang farm bago pa ang lahat, at ngayon itatanim mo ang una mong pananim sa web.',
    mission: 'Ilang maiikling mission: humingi, tumingin, magbago, mag-ayos, at ipakita sa mundo.',
  },
  'prompt-engineering-dev': {
    name: 'The Clear Words Workshop',
    premise: 'Sa Workshop, ang malinaw na hiling ay kasing totoong gamit ng martilyo.',
    mission: 'Matutong humingi nang husto para ang balik na gawa ay malapit sa naisip mo.',
  },
  'understanding-ai-code': {
    name: 'The Annotated Library',
    premise: 'Tahimik ang Library, at bawat estante ay may code na sinulat ng iba.',
    mission: 'Matutong basahin ito, ipaliwanag ito, at alamin kung kailan ito pagkakatiwalaan.',
  },
  'debugging-with-ai': {
    name: 'The Repair Bay',
    premise: 'Sa Repair Bay, walang itinatapon hangga\'t hindi naiintindihan.',
    mission: 'Alamin kung ano ang nasira at bakit, at ayusin ito nang tuluyan, magkasama.',
  },
  'ai-coding-practices': {
    name: 'Safe Harbour',
    premise: 'Sa Safe Harbour, ang maingat na gawi ang nagpapalutang sa mga bangka.',
    mission: 'Maliliit na hakbang, tapat na review, at checklist na tunay na sa\'yo.',
  },
  'build-website-ai': {
    name: 'Storefront Street',
    premise: 'Naghihintay ang Storefront Street ng isa pang bintana na may pangalan mo sa itaas.',
    mission: 'I-plano, hubugin, i-test, at buksan ang pinto.',
  },
  'build-mobile-app-ai': {
    name: 'Pocket Town',
    premise: 'Kasya sa kamay ang lahat sa Pocket Town, at lilipat na doon ang app mo.',
    mission: 'Iguhit ang mga screen, i-direct ang build, at makita ito sa sarili mong phone.',
  },
  'build-fullstack-ai': {
    name: 'The Whole Machine Works',
    premise: 'Umuugong ang Works sa mga bahaging dapat magkasya: ang nakikita ng tao at ang hindi nila nakikita.',
    mission: 'I-direct ang bawat bahagi, tapos i-test ang buong makina.',
  },
  'build-ai-app': {
    name: 'Spark Lab',
    premise: 'Sa Spark Lab, natututong mag-isip nang kaunti ang mga ordinaryong gamit.',
    mission: 'Bigyan ng utak ang produkto mo, panatilihing ligtas, at bantayan.',
  },
  'build-saas-ai': {
    name: 'Launch Pad',
    premise: 'Malinaw na ang Launch Pad at ikaw ang magsisimula ng countdown.',
    mission: 'Mula sa unang ideya hanggang sa unang customer, isang maingat na hakbang bawat oras.',
  },
  'idea-to-product': {
    name: 'The Idea Greenhouse',
    premise: 'Sa Greenhouse, sinusubukan muna ang mga ideya bago itanim.',
    mission: 'Hanapin kung ano ang sulit buuin, tapos buuin ang pinakamaliit na kapaki-pakinabang na bersyon.',
  },
  'improve-existing-ai': {
    name: 'The Renovation District',
    premise: 'Puno ang District ng mga gusaling nakatayo na at mas gaganda pa.',
    mission: 'Kilalanin muna ang gusali, tapos pagandahin ito nang hindi ito giniba.',
  },
  'ai-dev-copilot': {
    name: 'Pair Hangar',
    premise: 'Sa Hangar, magkasalo ang dalawang upuan sa iisang cockpit.',
    mission: 'Lumipad kasama ang partner na nagmumungkahi, at ikaw pa rin ang may hawak.',
  },
  'ai-dev-gemini': {
    name: 'Aurora Observatory',
    premise: 'Malawak at malayo ang tanaw ng Observatory, tapos nagzo-zoom sa mahalaga.',
    mission: 'Alamin kung saan pinakamahusay ang tool na ito, at gamitin ito.',
  },
  'choose-ai-tool': {
    name: 'The Crossroads Market',
    premise: 'Sa Crossroads, bawat daan ay may magandang patutunguhan, pero hindi pareho.',
    mission: 'Matutong pumili ng tamang tool para sa gawain, at para sa\'yo.',
  },
  'context-engineering': {
    name: 'The Archive of Context',
    premise: 'Ang Archive ay nag-iingat lang ng sulit tandaan, at inilalagay ito kung saan ito makikita.',
    mission: 'Pagpasyahan kung ano ang dapat makita ng AI, at kailan.',
  },
  'spec-driven-dev': {
    name: 'Blueprint Hall',
    premise: 'Sa Blueprint Hall, walang binubuo hangga\'t hindi malinaw na naiguguhit.',
    mission: 'Isulat ang gusto mo nang napakalinaw para maging madali ang pagbuo.',
  },
  'ai-project-planning': {
    name: 'The Map Room',
    premise: 'May mesa, lampara, at mahabang daan na wala pang marka sa Map Room.',
    mission: 'Markahan ang ruta, pangalanan ang mga panganib, at gawin ang unang kilos.',
  },
  'ai-ui-ux': {
    name: 'Studio Lumen',
    premise: 'Sa Studio Lumen, kasing halaga ng paggana ang pakiramdam ng isang bagay.',
    mission: 'I-direct ang design, hatulan ang resulta, at subukan ito sa totoong tao.',
  },
  'ai-backend-dev': {
    name: 'The Engine Room',
    premise: 'Sa ibaba ng deck, pinapagalaw ng Engine Room ang lahat kung saan walang tumitingin.',
    mission: 'Tukuyin ito, suriin ito, at siguraduhing ligtas ito.',
  },
  'ai-database-design': {
    name: 'The Ledger Vault',
    premise: 'Hawak ng Vault ang tinatandaan ng isang app, at dapat itong maayos.',
    mission: 'Hubugin ang data mo nang maingat, at baguhin ito nang walang nawawala.',
  },
  'ai-api-integration': {
    name: 'Bridge Quarter',
    premise: 'Ikinokonekta ng Bridge Quarter ang app mo sa mga serbisyo sa kabilang ibayo.',
    mission: 'Kumonekta nang ligtas, asahan ang problema, at mag-test nang hindi sinisira ang totoo.',
  },
  'ai-code-review': {
    name: 'The Review Gallery',
    premise: 'Sa Gallery, dalawang beses tinitingnan ang bawat obra bago isabit.',
    mission: 'Magbasa nang maingat, magbigay ng feedback na nakakatulong, at hulihin ang nakalusot.',
  },
  'ai-testing-qa': {
    name: 'Proving Grounds',
    premise: 'Sa Proving Grounds, walang pinagkakatiwalaan hangga\'t hindi nate-test.',
    mission: 'I-test ang ginagawa ng user, at siguraduhing puwedeng pumalya ang mga test mismo.',
  },
  'ai-deployment': {
    name: 'Harbour Lights',
    premise: 'Ang ilaw ng Harbour ang nagmamarka ng daan mula sa mesa mo hanggang sa bukas na dagat.',
    mission: 'Mag-live nang kalmado, at alamin kung paano umatras.',
  },
  'agentic-coding': {
    name: 'The Agent Docks',
    premise: 'Sa Docks, nilalagyan ng malinaw na utos ang mga gawain at ipinapadala sa dagat.',
    mission: 'Mag-delegate nang maingat, bantayan ang bumabalik, at ikaw pa rin ang may hawak.',
  },
  'multi-agent-dev': {
    name: 'The Convoy Yard',
    premise: 'Sa Yard, naghihintay ang buong team ng katulong ng planong pipigil sa kanilang magbanggaan.',
    mission: 'Hatiin ang trabaho, bigyan ng sariling lane ang bawat katulong, at pagsamahin ang lahat.',
  },
  'mcp-dev': {
    name: 'Connector Junction',
    premise: 'Sa Junction, kumakabit ang mga bagong tool sa mga pinagkakatiwalaan mo na.',
    mission: 'Kumonekta nang maingat, at pagpasyahan kung ano ang puwedeng hawakan ng bawat tool.',
  },
  'ai-architecture': {
    name: 'The Drafting Tower',
    premise: 'Mula sa Tower, makikita nang sabay ang buong lungsod.',
    mission: 'Timbangin ang mga opsyon, itala ang mga desisyon, at magdisenyo ng kayang lumago.',
  },
  'production-ai-apps': {
    name: 'Steadfast Works',
    premise: 'Buong gabing gumagana ang Works para may maasahan ang mga tao sa binuo mo.',
    mission: 'Patibayin ito, bantayan ito, at humanda sa hindi inaasahan.',
  },
  'ai-coding-security': {
    name: 'The Lock Foundry',
    premise: 'Sa Foundry, sinusubukan ang bawat kandado laban sa magnanakaw na wala pa roon.',
    mission: 'Tukuyin ang mga panganib ng code na gawa ng AI at pigilan ito nang maaga.',
  },
  'managing-ai-projects': {
    name: 'Command Deck',
    premise: 'Sa Command Deck, maraming kamay ang gumagawa at iisang plano ang nagbubuklod.',
    mission: 'Hatiin ang trabaho, magtakda ng mga gate, at panatilihing iisa ang direksyon ng lahat.',
  },
  'app-monetization': {
    name: 'The Fair Exchange',
    premise: 'Sa Exchange, nagpapalitan ng halaga at dapat pakiramdam ng lahat ay patas.',
    mission: 'Pumili ng presyo, magdisenyo ng patas na paywall, at basahin ang sinasabi ng mga numero.',
  },
  'launch-marketing': {
    name: 'Megaphone Square',
    premise: 'Puno ang Megaphone Square ng mga taong hindi pa nakakarinig sa\'yo.',
    mission: 'Sabihin nang malinaw ang iniaalok mo at hayaang makita ito ng mga unang tao.',
  },
  'freelance-ai-dev': {
    name: 'The Open Workshop',
    premise: 'Bukas ang pinto ng Workshop para sa sinumang may ipapagawa.',
    mission: 'Hanapin ang una mong client, i-scope nang tapat, at i-deliver nang maayos.',
  },
  'ai-software-business': {
    name: 'Founders Row',
    premise: 'Sa Founders Row, ang maliit na karatula ngayon ay puwedeng maging totoong negosyo bukas.',
    mission: 'Pumili ng model, kunin ang una mong customer, at panatilihin ang bilis na kaya mong tagalan.',
  },
  'build-with-lovable': {
    name: 'Pop-Up Plaza',
    premise: 'Sa Pop-Up Plaza, puwedeng magbukas ang isang idea para sa mga bisita bago matapos ang araw.',
    mission: 'I-plano, i-prompt, at salubungin ang una mong mga bisita.',
  },
  'publish-to-app-stores': {
    name: 'Harbor Gate',
    premise: 'Sa Harbor Gate, naghihintay ng berdeng ilaw ang bawat barko bago maglayag.',
    mission: 'Ihanda ang mga papeles mo, ipasa ang check, at maglayag.',
  },
  'deploy-with-vercel': {
    name: 'Switchyard Station',
    premise: 'Pinapadala ng Switchyard Station ang bawat natapos na proyekto sa tamang riles patungo sa mundo.',
    mission: 'Ikonekta ito, i-ship, at alamin kung paano bumalik kapag nagbago ang signal.',
  },
};

/** The world of a course that has no hand-written story: its own title in a plain sentence. */
export function fallbackWorldStoryFil(courseTitle: string): { premise: string; mission: string } {
  return { premise: `Ang ${courseTitle} ay sarili nitong mundo, na may mga mission na nagkakaugnay.`, mission: 'Isa-isahin lang natin.' };
}
