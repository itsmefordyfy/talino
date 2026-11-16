import type { PlacementTier } from './ai-placement';

/**
 * Tagalog (`fil`) wording of "Where should I start?" (`ai-placement.ts`): the tier names and the eight questions, by
 * question id. Choices keep the English order, so `answer` still points at the right one. Voice and glossary:
 * `docs/i18n/tagalog-style-guide.md`.
 */
export const PLACEMENT_TIER_LABELS_FIL: Record<PlacementTier, string> = {
  1: 'Mga pundasyon',
  2: 'Paggamit ng mga chat assistant',
  3: 'Paggamit ng mga coding agent',
  4: 'Advanced AI engineering',
};

export type PlacementQuestionFil = { prompt: string; choices: string[]; explanation: string };

export const PLACEMENT_QUESTIONS_FIL: Record<string, PlacementQuestionFil> = {
  'ai-placement-q1': {
    prompt: 'Sinabi ng isang AI assistant na mag-install ka ng package na hindi mo pa naririnig para ayusin ang isang bug. Ano ang una mong gagawin?',
    choices: ['I-install ito at i-run ang mga test', 'Hanapin ito sa official package registry: totoo ba ito, sino ang nag-publish, at pinapanatili pa ba?', 'Tanungin ang assistant kung ligtas ang package', 'I-install ito gamit ang flag na nilalaktawan ang mga warning'],
    explanation: 'Minsan gumagawa ng pekeng pangalan ng package ang mga model, at nirerehistro ng mga attacker ang mga pangalang iyon na may kasamang mapaminsalang code. Tingnan muna ang registry at ang project bago mag-install ng kahit ano.',
  },
  'ai-placement-q2': {
    prompt: 'Bakit puwedeng magkamali ang isang coding assistant tungkol sa project mo kahit mukhang sigurado siya?',
    choices: ['Naghuhula ito ng malamang na kasunod na text mula sa ibinigay sa kanya, at ang alam lang niya sa project mo ay ang nasa context niya', 'Lumang kopya ng server mo ang binabasa niya', 'Ni-run niya ang code mo pero mali ang pagkabasa niya sa output', 'Palagi siyang sumasagot mula sa web search'],
    explanation: 'Ang language model ay sumusulat ng pinakamalamang na kasunod ng context nito. Kung wala sa context ang kailangang code o docs, mapupunan niya ang kulang nang matatas pero mali.',
  },
  'ai-placement-q3': {
    prompt: 'Alin sa mga request na ito ang pinakamalamang na magbigay ng tamang ayos para sa isang function na pumapalya?',
    choices: ['"Ayusin mo ang code ko."', 'Ang function, ang eksaktong error at stack trace, ang input na pumapalya, ang inaasahan mo laban sa nangyari, at ang mga constraint mo', '"Umarte kang senior developer at i-improve ito."', 'Ang error message lang, para maikli ang sagot'],
    explanation: 'Ang kaya lang pag-isipan ng assistant ay ang ibinigay mo. Ang input na pumapalya, ang totoong error at ang inaasahang resulta ang nagpapalit sa hula bilang diagnosis.',
  },
  'ai-placement-q4': {
    prompt: 'Ni-rewrite ng isang assistant ang 200-line na module para sa’yo. Ano ang pinakamatibay na check bago mo ito i-merge?',
    choices: ['Nag-compile ito nang walang error', 'Basahin ang diff, i-run ang mga existing test, at magdagdag ng test para sa behavior na nabago nito', 'Tanungin ang assistant kung nagbago ang behavior', 'Tingnan kung mas maikli ang bagong version'],
    explanation: 'Kaunti lang ang napapatunayan ng pag-compile, at hindi makakapagpatunay ang model para sa sarili niya. Ang mga test na nagbabantay sa behavior, kasama ang sarili mong pagbasa sa diff, ang nakakahuli ng tahimik na pagbabago.',
  },
  'ai-placement-q5': {
    prompt: 'Hiniling mo sa isang coding agent na magdagdag ng feature sa repository na hindi pa niya nakikita. Ano ang dapat mangyari bago siya mag-edit ng kahit anong file?',
    choices: ['Bigyan siya ng buong permission para mabilis siyang kumilos', 'Ie-explore niya ang code at magmumungkahi ng plano: ang mga file na babaguhin niya at kung paano niya ito te-test, at ire-review mo ang planong iyon', 'I-paste ang buong repository sa isang prompt', 'Pasimulan siya sa README'],
    explanation: 'Mura ang magplano muna, at nahuhuli nito ang maling assumption bago pa kumalat sa mga file. Ikaw ang mag-a-approve ng plano; saka lang siya mag-i-implement at magte-test.',
  },
  'ai-placement-q6': {
    prompt: 'Ano ang dapat nasa project instructions file para sa isang coding agent?',
    choices: ['Ang kasaysayan ng kumpanya, para maintindihan niya ang misyon', 'Kung paano mag-build, mag-test at mag-lint, ang mga convention ng project, at ang mga bagay na hindi niya dapat galawin', 'Ang mga API key mo, para makapag-deploy siya', 'Listahan ng bawat file sa repository'],
    explanation: 'Binabasa ng mga agent ang file na ito sa bawat task, kaya dapat nandoon ang mga bagay na hindi nila madaling matutuklasan at ang mga bawal nilang gawin. Hindi kailanman inilalagay doon ang mga secret.',
  },
  'ai-placement-q7': {
    prompt: 'Isang agent ang sumusulat ng code at isa pa ang nagre-review nito, pareho ang model at pareho ang context. Ano ang pangunahing panganib?',
    choices: ['Magiging masyadong mabagal ito', 'Pareho ng blind spot ng sumulat ang reviewer, kaya kailangan mo pa rin ng independent na check: mga test, malinaw na criteria, isang tao, o ibang setup', 'Ire-reject niya ang lahat', 'Palagi itong mas mura kaysa sa isang agent'],
    explanation: 'Ang dalawang kopya ng iisang pangangatwiran ay madalas magkasundo sa iisang pagkakamali. Ang independent na ebidensya, lalo na ang mga test at malinaw na acceptance criteria, ang nagbibigay ng saysay sa review.',
  },
  'ai-placement-q8': {
    prompt: 'Dumoble ang token use matapos kang magdagdag ng mahabang instructions file at maraming tool integration. Aling pagbabago ang malamang na makakatulong nang hindi nasisira ang quality?',
    choices: ['Gamitin ang pinakamalaking model sa bawat task', 'Panatilihing maikli ang mga standing instruction, i-load lang ang detalyadong docs at tools kapag kailangan ng task, at magsimula ulit sa bago tuwing hindi magkaugnay ang mga task', 'Alisin ang mga test sa context', 'I-paste ang buong repository tuwing gagamitin para walang binabasang ulit'],
    explanation: 'Binabayaran ang lahat ng nasa context sa bawat turn. Ang payat na standing context, detalye kapag kailangan lang, at malinis na simula sa pagitan ng mga task ay nagpapababa ng gastos at kadalasang nagpapabuti ng focus.',
  },
};
