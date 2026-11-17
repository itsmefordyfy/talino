import type { PracticeItem } from '../types';

/**
 * Prompt labs of Generative AI module 5, AI Video and Audio Generation (`kind: 'lab'`). Written 2026-11-17; see docs/content/GENAI_BRIEF.md.
 * Nothing here makes or analyses audio or video: each lab works on TEXT (a script to be read aloud, a transcript a tool already produced, a product
 * sheet, a creative brief). All names, shops and numbers are invented. Used by lessons 24 (lab-05-narration-script), 25 (lab-05-call-action-items),
 * 27 (lab-05-video-shot-prompts) and 28 (lab-05-script-and-shot-list).
 */
export const items: PracticeItem[] = [
  {
    id: 'lab-05-narration-script',
    kind: 'lab',
    title: 'Write a narration script a voice tool can read',
    experiment: 'text-generation',
    situation:
      'You are making a one-minute welcome recording that visitors play on their phones when they walk into a small library. A text-to-speech tool will read it aloud, so the words must be easy to say and easy to hear. The facts are below.',
    goal: 'Get the model to write a spoken script, plus a short pronunciation and pacing note, that uses only the facts in the material.',
    material:
      'Welcome recording, Bayview Public Library (an invented library). Facts to include:\n' +
      '- Open Monday to Saturday, 9:30 AM to 5:00 PM. Closed on Sundays.\n' +
      '- A library card is free. Bring one valid ID to the front desk.\n' +
      '- Study Room 2B is on the second floor. It can be booked for up to 2 hours at the desk or at bayview-library.example.\n' +
      '- Late fee: P5.00 per day for each book, never more than P150.00 in total.\n' +
      '- The children\'s corner is on the ground floor, next to the reading garden.\n' +
      '- The quiet floor is the 3rd floor.\n' +
      '- Head librarian: Ms. Dalisay Villanueva-Quiñones.\n' +
      '- Free Wi-Fi network name: BayviewGuest.\n' +
      'Listeners: first-time visitors with earphones, walking in. Voice: warm and calm. Length: about one minute when read aloud.',
    starterPrompt: 'Write a welcome audio script for the library using the material.',
    system:
      'You are a helpful writing assistant. Do what the user asks, using only the facts in the material. If the user asks for something the material does not support, say so instead of guessing.',
    maxRuns: 4,
    output: { format: 'text' },
    criteria: [
      { id: 'spoken', label: 'Asks for words made for the ear: short sentences, no bullet points, tables or symbols' },
      { id: 'say-it', label: 'Asks for times, money, room codes and the web address to be written the way a person says them' },
      { id: 'pronounce', label: 'Asks for a separate note that lists hard names and shows how to say them' },
      { id: 'pacing', label: 'Names the listener, the voice and the target length, and asks for where the pauses go' },
      { id: 'facts', label: 'Keeps the model to the facts in the material and nothing invented' },
    ],
    tips: [
      'Say who is listening and where: "visitors walking in with earphones" gives the model a reason to keep sentences short.',
      'Ask for numbers "written out the way you would say them aloud". A tool that reads "P150.00" may say something odd; "one hundred fifty pesos" leaves less to chance.',
      'Ask for two separate parts, the script and a note for the tool, so the note does not end up being read aloud.',
      'Give a length in seconds and then read the result aloud with a timer. Your own speaking pace is the measure, not the model\'s guess.',
    ],
    example: {
      prompt:
        'Write a 60-second welcome script for first-time visitors who listen on earphones as they walk in. Use only the material. Short sentences, warm and calm, no lists or symbols. Write times, prices and the room code the way a person says them aloud, and write the web address letter by letter where needed. Mark pauses with a line break. After the script, add a "Pronunciation notes" section for names and anything a voice tool might misread, with a plain respelling for each.',
      outcome:
        'A script of short spoken sentences with one idea each, times written as "nine thirty in the morning", the late fee in words, and a separate notes list that spells out how to say the librarian\'s double surname. Nothing appears that the material did not state. (Illustration of a strong answer, not a real model\'s output.)',
    },
    verify: [
      'Every time, price, room and name in the script matches the material.',
      'Read the script aloud with a timer. Does it fit about one minute at your own pace?',
      'No symbol, abbreviation or web address is left in a form a voice tool could misread.',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'lab-05-call-action-items',
    kind: 'lab',
    title: 'Turn a messy transcript into action items',
    experiment: 'structured-output',
    situation:
      'You are a virtual assistant. A speech-to-text tool transcribed a call with your client, a gift-box shop owner, and a packer. The transcript below is exactly what the tool produced, mistakes and all. You must send a clear task list the same day, as data your client can paste into a tracker.',
    goal: 'Get the model to return the tasks, who owns them, the pickup day and the unsettled points as JSON, and to separate what was decided from what was not.',
    material:
      'TRANSCRIPT (automatic, not corrected). Speakers: Gerard (shop owner), Lourdes (assistant), Paolo (packer).\n' +
      '[00:01] Gerard: Okay we are recording, good. Three things this week. First the Lim wedding gift boxes.\n' +
      '[00:14] Lourdes: How many boxes again?\n' +
      '[00:16] Gerard: Sixty. Six zero. Wait no, the bride wants fifty now, two guests dropped. So fifty.\n' +
      '[00:31] Paolo: Fifty boxes, okay. Do we have enough ribbon?\n' +
      '[00:35] Gerard: Lourdes, please check the ribbon stock today and order more if it is under two rolls.\n' +
      '[00:44] Lourdes: Sure, I will check this afternoon.\n' +
      '[00:49] Gerard: Second, the courier. They said Thursday, no, uh, Wednesday. They pick up Wednesday morning, so the boxes must be packed by Tuesday night. Paolo, that is you.\n' +
      '[01:06] Paolo: Tuesday night, yes. But I need the printed card inserts by Monday.\n' +
      '[01:12] Gerard: Right. Lourdes, send the card text to the printer, the one on, uh, [inaudible], by Saturday end of day, so they have it Monday.\n' +
      '[01:25] Lourdes: And the proof of the card?\n' +
      '[01:28] Gerard: I will send you the proof later. I do not know when yet.\n' +
      '[01:34] Gerard: Third thing, the small boxes for the, the, uh, anniversary order. We will talk about that next week.\n' +
      '[01:41] Paolo: Okay. That is all from me.',
    starterPrompt: 'List the action items from this transcript.',
    system:
      'You are a careful assistant that reads transcripts. Use only what the transcript says. When the transcript does not settle something, say it is unclear instead of choosing an answer. Reply with the JSON the user asks for.',
    maxRuns: 5,
    output: {
      format: 'json',
      fields: [
        { name: 'tasks', type: 'string[]', required: true },
        { name: 'owners', type: 'string[]', required: true },
        { name: 'box_count', type: 'number', required: true },
        { name: 'pickup_day', type: 'string', required: true, oneOf: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        { name: 'has_unclear_items', type: 'boolean', required: true },
        { name: 'unclear_items', type: 'string[]', required: true },
      ],
    },
    key: {
      owners: ['Lourdes', 'Paolo', 'Gerard'],
      box_count: 50,
      pickup_day: 'Wednesday',
      has_unclear_items: true,
    },
    criteria: [
      { id: 'fields', label: 'Names every JSON field and what goes in it, so the answer can be checked by code' },
      { id: 'owner-deadline', label: 'Asks for each task to say who owns it and by when, in the same line' },
      { id: 'corrections', label: 'Tells the model that a speaker may correct themselves and the last version counts' },
      { id: 'unclear', label: 'Asks for unsettled points to be listed, not guessed, including anything the transcript marks as unheard or says is not known yet' },
      { id: 'only', label: 'Keeps the model to what the transcript says' },
    ],
    tips: [
      'People change their minds out loud. Tell the model that when a number or day is corrected, the last one is the one to use.',
      'Describe each field in your prompt, for example "tasks: one string per task in the form Owner: what, by when".',
      'Ask for a place to put what is NOT decided. If you give the model no such place, it tends to fill the gap with a guess.',
      'A transcript can contain a [inaudible] mark. Tell the model to leave that detail unknown and list it, not invent it.',
    ],
    example: {
      prompt:
        'Read this automatic transcript of a call. Return only JSON with these fields: tasks (array of strings, each "Owner: what, by when"), owners (array of first names with at least one task), box_count (number), pickup_day (a weekday name), has_unclear_items (true or false), unclear_items (array of strings). A speaker may correct a number or day: use the last one said. If something is marked [inaudible] or the speakers say they do not know it yet, do not guess; put it in unclear_items. Use only the transcript.',
      outcome:
        'A JSON object listing three owners, a box count of fifty rather than sixty, Wednesday as the pickup day, and an unclear list that includes the printer\'s name and the proof date. (Illustration of a strong answer, not a real model\'s output.)',
    },
    verify: [
      'Check box_count and pickup_day against the corrected numbers in the transcript, not the first ones said.',
      'Every task has an owner who really received it in the call.',
      'Nothing in unclear_items was invented, and nothing that was left open is written as a decision.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-05-video-shot-prompts',
    kind: 'lab',
    title: 'Plan video shots from a product sheet',
    experiment: 'text-generation',
    situation:
      'You run the online shop of a small coffee roaster. You want three short clips for a product page and you will make them in a text-to-video tool outside Talino. Today you only write the prompts. Run two versions of your instruction and compare what changes.',
    goal: 'Get the model to turn the product sheet into three shot prompts, each with a subject, an action, a setting, a camera view, light and mood, and a line saying what to avoid.',
    material:
      'PRODUCT SHEET (invented). Product: Morning Ridge Blend, 250 g bag.\n' +
      '- Medium roast. Tasting notes on the label: chocolate and orange peel.\n' +
      '- Roasted in small batches every Tuesday. Ships within 2 to 3 working days.\n' +
      '- The bag is brown paper with a green label and a small drawing of a hill.\n' +
      '- Price: P420.00. Free shipping on orders over P1,500.00.\n' +
      '- Brand feel: warm, quiet, early morning.\n' +
      '- Not stated anywhere: whether the coffee is organic, fair trade or award-winning.',
    starterPrompt: 'Give me video prompts for this coffee.',
    system:
      'You are a helpful creative assistant. Use only the facts in the material. Do not add claims about the product that the material does not state.',
    compare: 'prompts',
    maxRuns: 6,
    output: { format: 'text' },
    criteria: [
      { id: 'parts', label: 'Asks for each shot to name a subject, an action, a setting, a camera view, light and mood' },
      { id: 'one-thing', label: 'Asks for one simple action per shot rather than a whole story in one clip' },
      { id: 'avoid', label: 'Asks for a "what to avoid" line, for example readable text in the frame or an invented claim' },
      { id: 'brand', label: 'Passes on the brand feel and the real look of the bag from the material' },
      { id: 'claims', label: 'Stops the model from adding organic, fair trade or award claims the sheet does not make' },
    ],
    tips: [
      'A clip is short, so write for one clear action: steam rising, a hand setting the bag down. Several scene changes in one prompt are easy to lose.',
      'Say what the camera does (a slow push in, a fixed view from above) and what the light is (soft window light, early morning).',
      'Add what to avoid, such as text appearing in the frame. Words drawn inside generated video can come out wrong, so many people add the words in editing instead. Check what your own tool does.',
      'Compare run A and run B: what did the extra detail in B actually change in the shots?',
    ],
    example: {
      prompt:
        'Using only the product sheet, write 3 shot prompts for a text-to-video tool, each on its own line labelled Shot 1 to 3. Each shot: one subject, one simple action, the setting, the camera view and movement, the light, and the mood. Keep the brand feel warm, quiet and early morning, and keep the bag as the sheet describes it. End each shot with "Avoid:" and a short list, including any readable text in the frame. Do not claim anything about the coffee that the sheet does not state.',
      outcome:
        'Three labelled shot prompts, each with one calm action and a camera note, a brown paper bag with a green label and a hill drawing, soft morning light, and an "Avoid" line. No organic or award wording appears. (Illustration of a strong answer, not a real model\'s output.)',
    },
    verify: [
      'The bag in each shot matches the sheet: brown paper, green label, a small hill drawing.',
      'No claim appears that the sheet does not make (organic, fair trade, award-winning).',
      'Each shot asks for one action you could picture in a few seconds.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-05-script-and-shot-list',
    kind: 'lab',
    title: 'Script and shot list for a 30-second video',
    experiment: 'structured-output',
    situation:
      'A tutor needs a 30-second promo for her small tutoring hub. You will write the voice-over and the shot list with AI help, check them, and later make the audio and video with your own tools. The creative brief below is all you have.',
    goal: 'Get the model to return a voice-over, a numbered shot list with timings, the total seconds, whether it mentions the price, and the claims you must check before publishing.',
    material:
      'CREATIVE BRIEF (invented). Client: Maya\'s Tutoring Hub, a small after-school centre.\n' +
      '- Offer: small groups of up to 6 students, Grades 4 to 8, Math and English.\n' +
      '- Open Monday to Friday, 3:00 PM to 6:00 PM. Trial class is free.\n' +
      '- Sign up at mayas-hub.example.\n' +
      '- Do NOT mention the price in the video. Prices are given only to parents who ask.\n' +
      '- Length: exactly 30 seconds. Audience: parents. Tone: friendly and honest.\n' +
      '- The tutor says: "Our students usually feel more confident after a few weeks." (This is her opinion, not a study.)\n' +
      '- No results, test scores or rankings may be promised.',
    starterPrompt: 'Write a script and shot list for a 30-second video from this brief.',
    system:
      'You are a helpful assistant for video planning. Use only the brief. Reply with the JSON the user asks for. Do not promise results the brief does not state.',
    maxRuns: 5,
    output: {
      format: 'json',
      fields: [
        { name: 'voiceover', type: 'string', required: true },
        { name: 'shots', type: 'string[]', required: true },
        { name: 'total_seconds', type: 'number', required: true },
        { name: 'mentions_price', type: 'boolean', required: true },
        { name: 'claims_to_check', type: 'string[]', required: true },
      ],
    },
    key: {
      total_seconds: 30,
      mentions_price: false,
    },
    criteria: [
      { id: 'format', label: 'Names each JSON field and says what goes in it, including a time for every shot' },
      { id: 'length', label: 'States the exact length and asks for shot times that add up to it' },
      { id: 'rules', label: 'Passes on the rules in the brief: no price, no promised results' },
      { id: 'check', label: 'Asks for a list of claims the human must check before publishing' },
      { id: 'voice', label: 'Asks for a voice-over written to be spoken, not read' },
    ],
    tips: [
      'Tell the model the total length and ask for each shot to carry its own seconds. Then add them up yourself.',
      'Repeat the rules from the brief inside your prompt (no price, no promised results) and ask the model to confirm them in a field.',
      'Put the tutor\'s opinion in the claims list. "Usually feel more confident" is her view, and a reader may hear it as a promise.',
      'Ask for a voice-over a person could say in about thirty seconds, then read it aloud with a timer.',
    ],
    example: {
      prompt:
        'From the brief, return only JSON with: voiceover (a spoken script for exactly 30 seconds, friendly and honest), shots (array of strings, each "Shot number, seconds, what we see, what we hear"), total_seconds (number, the sum of the shot times), mentions_price (true or false), claims_to_check (array of statements in the script that a human must verify before publishing). Obey the brief: no price, no promised results, and treat the tutor\'s sentence as her opinion, not a fact.',
      outcome:
        'A JSON object whose shots add up to thirty seconds, with a spoken voice-over that gives the hours and the free trial, mentions_price set to false, and a claims list that includes the tutor\'s confidence sentence. (Illustration of a strong answer, not a real model\'s output.)',
    },
    verify: [
      'Add up the shot times yourself: do they equal 30?',
      'The price does not appear anywhere in the voice-over or the shots.',
      'Each hour, grade, group size and web address matches the brief, and no result is promised.',
    ],
    difficulty: 'demanding',
  },
];
