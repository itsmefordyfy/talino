import type { PracticeItem } from '../types';

/**
 * Prompt labs of Generative AI module 4, AI Image Generation and Visual Creativity (`kind: 'lab'`). Written 2026-11-17; see docs/content/GENAI_BRIEF.md.
 * No image is made or read in these labs: the learner works with text (a brief, an author's notes, a written description of a picture), and the
 * practice with a real image tool happens outside Talino. Every business, person and picture below is invented.
 */
export const items: PracticeItem[] = [
  {
    id: 'lab-04-brief-to-image-prompt',
    kind: 'lab',
    title: 'Turn a client brief into an image prompt',
    experiment: 'text-generation',
    situation:
      'You are a freelance designer. A small bike workshop sent the brief in the material. You want one image prompt that you could paste into an image tool outside Talino. No picture is made here: the assistant writes the prompt, and you judge it against the brief.',
    goal: 'Get one image prompt that covers subject, style, composition, light and what to avoid, and that follows every requirement in the brief.',
    material:
      'Client: Hillview Bike Repair, a small neighbourhood workshop.\nNeed: one picture for a flyer announcing a free Saturday tire check.\nSubject: a city bicycle, parked, with a tire pump leaning against it.\nMood: friendly, bright, outdoors, morning.\nColours: sky blue and warm yellow; no black backgrounds.\nLayout: the bottom third of the picture must stay plain, for the flyer text.\nDo not include: people, any text, logos or brand names, cars.\nUse: printed A5 flyer, portrait (tall).',
    starterPrompt: 'Make an image prompt from this brief.',
    system:
      'You are a helpful assistant that writes prompts for image-generation tools. Follow the user\'s request and use the brief provided with it as your facts.',
    maxRuns: 5,
    output: { format: 'text' },
    criteria: [
      { id: 'subject', label: 'Asks for a specific subject with details from the brief (the bicycle and the pump)' },
      { id: 'style-mood', label: 'Covers style and mood in words a picture can show' },
      { id: 'composition', label: 'Carries the composition requirements: plain bottom third and portrait shape' },
      { id: 'light', label: 'Names the light and the colours from the brief' },
      { id: 'avoid', label: 'Lists what to keep out: people, text, logos and brand names, cars, black backgrounds' },
      { id: 'brief-only', label: 'Tells the assistant to add nothing that the brief does not say' },
    ],
    tips: [
      'Pull each requirement out of the brief and decide which of the five decisions it belongs to: subject, style, composition, light, or what to avoid.',
      'Say what the answer should look like: one image prompt, written as a description of the scene, under a word limit.',
      'Ask for visible details instead of praise words such as beautiful or stunning.',
      'Tell the assistant to use only the brief. Assistants like to add a brand name, a person or a slogan.',
      'After the run, tick the brief line by line, and watch for text, people or logos that crept in.',
    ],
    example: {
      prompt:
        'Using only the brief in the material, write one image prompt of under 70 words, as a description of the scene. Cover the subject, the style and mood, the composition (including the plain bottom third and the portrait shape), the light and colours, and what to leave out. Do not add anything the brief does not say.',
      outcome:
        'One short scene description of a parked city bicycle with a tire pump leaning against it, in bright friendly morning light, in sky blue and warm yellow, in a tall portrait frame with a plain bottom third, and with no people, text, logos, cars or black backgrounds.',
    },
    verify: [
      'Every requirement of the brief appears in the prompt: the bicycle, the pump, the mood, the colours, the plain bottom third, the portrait shape.',
      'Everything on the "do not include" line is kept out, and no brand name or slogan has been added.',
      'The prompt describes things a picture can show, with no empty praise words.',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'lab-04-style-block',
    kind: 'lab',
    title: 'A style block, a character sheet and three scene prompts',
    experiment: 'text-generation',
    situation:
      'You are helping a teacher make a picture book. The author\'s notes in the material describe the character and the look of the book. You want a reusable style block, a character sheet, and three scene prompts that repeat both word for word, so that you can paste them into an image tool outside Talino. No picture is made here.',
    goal: 'Get a style block, a character sheet and three scene prompts that keep every fixed detail identical and change only the scene.',
    material:
      'Author\'s notes for the picture book "Pip and the Rainy Day" (12 pages, ages 4 to 6)\nMain character: Pip, a young red fox. Orange-red fur, white chest, big round eyes, a bent left ear, and a green knitted scarf with one yellow stripe.\nStyle: soft watercolor on cream paper texture, gentle brown pencil outlines, muted colors, soft daylight.\nSetting: a small village on a hill, many rainy days.\nScenes to prompt:\n- Page 1: Pip wakes up and looks out of the window at the rain.\n- Page 2: Pip puts on a yellow rain hat in the hallway.\n- Page 3: Pip jumps into a puddle next to a small duck.\nRules: no text inside any picture; leave the bottom fifth of each picture plain for the story text; the pictures are landscape.',
    starterPrompt: 'Write image prompts for the three pages.',
    system:
      'You are a helpful assistant that prepares prompts for image-generation tools. Follow the user\'s request and use the author\'s notes provided with it as your facts.',
    maxRuns: 6,
    output: { format: 'text' },
    criteria: [
      { id: 'sheet', label: 'Asks for a character sheet that holds every fixed visible detail from the notes' },
      { id: 'style', label: 'Asks for a style block with the medium, the lines, the palette and the light' },
      { id: 'verbatim', label: 'Says that the sheet and the style block must be repeated word for word, in full, in every scene prompt' },
      { id: 'scene-only', label: 'Says that only the scene line changes from page to page' },
      { id: 'rules', label: 'Carries the rules: no text in the pictures, a plain bottom fifth, landscape shape' },
      { id: 'no-invention', label: 'Tells the assistant not to add details that are not in the notes' },
    ],
    tips: [
      'Spell out the output: first the character sheet, then the style block, then three scene prompts, each built from the same three pieces.',
      'Say that the first two pieces must be copied exactly, and not summarised or reworded, in all three prompts.',
      'Name the details that must not change, such as the scarf colours and the bent left ear, so you can check them afterwards.',
      'Include the rules from the notes in every prompt, not only the first.',
      'After the run, lay the three prompts side by side and compare the character and style lines word for word.',
    ],
    example: {
      prompt:
        'Using only the author\'s notes, write (1) a character sheet of Pip\'s fixed visible details, (2) a style block, and (3) three scene prompts, one per page. Each scene prompt must repeat the character sheet and the style block word for word and in full, and only the scene line may change. Include the rules from the notes in every prompt. Do not add any detail the notes do not give.',
      outcome:
        'A character sheet and a style block, followed by three scene prompts whose first two parts are identical, with only the scene line (window and rain, rain hat in the hallway, puddle and duck) different, and with the rules in each.',
    },
    verify: [
      'The character details (orange-red fur, white chest, big round eyes, bent left ear, green scarf with one yellow stripe) are identical in all three prompts.',
      'The style words are identical in all three prompts, and only the scene line changes.',
      'No detail has been added that the notes do not give, and the rules (no text, plain bottom fifth, landscape) are in every prompt.',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'lab-04-image-check',
    kind: 'lab',
    title: 'Check a picture description against the brief',
    experiment: 'document-analysis',
    situation:
      'A school ordered a poster picture from an image tool. The material holds the school\'s brief and a teacher\'s written description of the picture the tool produced. The assistant cannot see the picture: it reads only these words. Write a prompt that makes it list where the description does not match the brief, quote the description, and say "not stated" where the description is silent.',
    goal: 'Get a checked list of mismatches that stays inside the description, quotes it, and says "not stated" instead of guessing.',
    material:
      'BRIEF (from the school):\n1. Three children, about 10 years old, around a table.\n2. A model volcano on the table.\n3. A banner that reads SCIENCE FAIR.\n4. A bright daytime classroom.\n5. The children wear safety goggles.\n6. No logos or brand names anywhere.\n\nDESCRIPTION OF THE GENERATED PICTURE (written by a teacher who looked at it):\nThere are four children around a table. They look about 10 years old. A red model volcano is in the middle of the table. A banner above them reads SCIENCE FAIER. The room is bright, with light from large windows. One child\'s left hand shows six fingers. A cardboard box on the table has a logo that looks like a sports brand.',
    starterPrompt: 'Does the description match the brief?',
    system:
      'You are a helpful assistant that compares texts. Follow the user\'s request and use only the text provided with it as your source.',
    maxRuns: 5,
    output: { format: 'text' },
    facts: [
      'The description mentions four children, while the brief asks for three.',
      'The children look about 10 years old, as the brief asks.',
      'A red model volcano is on the table, as the brief asks.',
      'The banner reads SCIENCE FAIER, while the brief asks for SCIENCE FAIR.',
      'The room is bright with light from windows, as the brief asks.',
      'The description says one child\'s left hand shows six fingers, a flaw the brief does not mention.',
      'A box on the table has a logo that looks like a sports brand, while the brief says no logos or brand names.',
      'The description does not say whether the children wear safety goggles.',
    ],
    criteria: [
      { id: 'per-item', label: 'Goes through the brief one numbered item at a time' },
      { id: 'quotes', label: 'Quotes the matching words from the description for each item' },
      { id: 'not-stated', label: 'Says "not stated" when the description does not mention an item, and does not guess' },
      { id: 'separate', label: 'Keeps flaws in the picture itself (such as a hand) apart from mismatches with the brief' },
      { id: 'words-only', label: 'Stays inside the description and does not claim to have seen the picture' },
    ],
    tips: [
      'Ask for one line per brief item, in order, with the result (matches, mismatch or not stated) and a quote from the description.',
      'Tell the assistant to write "not stated" if the description is silent, and never to guess what the picture shows.',
      'Ask for a second short list for flaws the description mentions that the brief did not ask about.',
      'Say that the assistant must use only the two texts in the material.',
      'After the run, check each quote against the description and look for any problem that the description never mentions.',
    ],
    example: {
      prompt:
        'Compare the description with the brief, using only the two texts in the material. Go through the brief item by item. For each item, say "matches", "mismatch" or "not stated", and quote the words of the description that support it. If the description does not say, write "not stated" and do not guess. After the list, give a separate list of flaws in the picture that the description mentions but the brief does not.',
      outcome:
        'A numbered list with six lines, one per brief item, each with a result and a quote. The count of children, the banner spelling and the logo are marked as mismatches, the goggles item is marked "not stated", and the six fingers appear in the separate list of flaws.',
    },
    verify: [
      'Every quote appears in the description exactly as written.',
      'The goggles item is marked "not stated", and nothing is said that the description does not state.',
      'Mismatches with the brief (four children, SCIENCE FAIER, the logo) are separate from the flaw the brief did not mention (the six fingers).',
    ],
    difficulty: 'realistic',
  },
];
