import type { Course } from './types';

export const educatorCourse: Course = {
  id: 'educator',
  kind: 'career',
  level: 'intermediate',
  title: 'Educator: Teach Tech with AI',
  tagline: 'Use AI in your own prep, and teach your students to use it well.',
  description:
    "For IT instructors and professors in colleges, universities, senior high ICT and bootcamps whose courses were written before AI. In 20 short lessons you use AI for your own preparation, redesign assessments so they still measure learning, write a fair class AI-use policy, and teach students to prompt, verify and program with AI responsibly.",
  finishLine: [
    'An AI-ready lesson or course module you can teach next term',
    'A class AI-use policy and a rubric that values process, not just the final output',
    'A Talino certificate for your faculty file',
  ],
  audiences: ['educator'],
  skills: [
    { id: 'ai-prep', label: 'AI for lesson prep' },
    { id: 'assessment-design', label: 'Assessment design' },
    { id: 'ai-policy', label: 'AI policy and academic honesty' },
    { id: 'teaching-ai-skills', label: 'Teaching prompting and verification' },
    { id: 'ai-programming-pedagogy', label: 'Teaching AI-assisted programming' },
    { id: 'responsible-ai', label: 'Privacy, ethics and accessibility' },
  ],
  lessons: [
    {
      id: 'educator-01',
      day: 1,
      title: 'What changed for your students',
      summary: 'What AI now does for students in seconds, and what it still cannot give them.',
      intro: {
        objectives: [
          'Name what AI can now do for students in seconds, and what it still cannot give them.',
          'Describe avoiders, over-relyers and power users, and why banning AI alone does not help them.',
          'Test one of your own assignments with AI and write down what it no longer proves.',
        ],
        why: 'Your course outline was written before every student had an AI assistant, so you need to see what your assignments still prove before you change anything. This lesson gives you that starting point for the rest of the course.',
      },
      minutes: 15,
      skills: ['assessment-design', 'teaching-ai-skills'],
      body: [
        {
          type: 'paragraph',
          text: "Your course outline was probably written before every student had an AI assistant on their phone. Today a student can paste your lab exercise into a chatbot and get working code in seconds. That does not make your course useless. It changes what your course has to prove.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Some words first. A **chatbot** is a program you type to and it types back. An **AI assistant** is a chatbot trained on huge amounts of text and code, so it can write both. **Code** is a set of written instructions a computer follows, like a recipe. A **lab exercise** is the question you give students to practise with. When a student pastes your lab exercise into an assistant, it hands back a finished recipe in seconds. That is like copying the answer from the back of the book: the answer may be right, but the practice never happened. So this course does not ask whether the tool is allowed. It asks what your assignments still prove about the student.",
        },
        { type: 'heading', text: 'What students can now do in seconds' },
        {
          type: 'list',
          items: [
            'Get a working first draft of most intro programming exercises.',
            'Have an error message explained in plain language.',
            'Summarize a reading or a set of slides.',
            'Produce a fluent reflection paper or lab report.',
            'Generate SQL queries, HTML pages, network configs and test data.',
          ],
        },
        { type: 'heading', text: 'What AI still cannot give them' },
        {
          type: 'list',
          items: [
            '**Judgment:** knowing whether an answer is right, safe and fit for the user.',
            '**Debugging skill:** fixing things when the AI is confidently wrong.',
            '**Understanding:** knowing a system well enough to change it later.',
            '**Practice:** the slow repetition that turns knowledge into skill.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "educator-01-match-1",
            kind: "match",
            title: "What was missing?",
            prompt: "Each student below used AI and still struggled. Match each moment with the thing AI could not give them.",
            concept: "what ai cannot give students",
            labels: { terms: "Classroom moments", meanings: "What was missing" },
            pairs: [
              {
                term: "An AI-written lab report looks polished, but one step would be unsafe, and the student didn't notice.",
                definition: "Judgment",
              },
              {
                term: "The AI's code fails with an error, and the student keeps pasting it back and getting the same broken fix.",
                definition: "Debugging skill",
              },
              {
                term: "Two months later, the student can't add a small feature to their own capstone project.",
                definition: "Understanding",
              },
              {
                term: "The student passed every take-home exercise but freezes when asked to write a short loop in a live interview.",
                definition: "Practice",
              },
            ],
            hints: [
              "For each moment, ask what the student would have needed to handle it alone.",
              "Spotting a problem in a good-looking answer is different from fixing broken code.",
              "Freezing without help points to the skill that only grows by doing the work again and again.",
            ],
            explanation: "AI can produce answers in seconds, but judgment, debugging, understanding and practice still have to be built by the student, which is what your course now has to prove.",
          },
        },
        {
          type: 'paragraph',
          text: "That last point matters most. Skill grows from productive struggle. If AI removes all of the struggle, a student can finish with good grades and little ability. It shows up in technical interviews and in the first week of OJT, when a supervisor asks them to explain their own code.",
        },
        { type: 'heading', text: 'Three kinds of students in your class' },
        {
          type: 'paragraph',
          text: "Most classes now have **avoiders** (afraid of being accused, so they never touch AI), **over-relyers** (who paste everything and read nothing) and **power users** (who use AI to learn faster). Your job is to move the first two groups toward the third. Banning AI helps the avoiders feel safe but leaves them unprepared. Ignoring it rewards the over-relyers.",
        },
        {
          type: "table",
          headers: ["Type of student", "What they do", "What the lesson says"],
          rows: [
            [
              "Avoiders",
              "Afraid of being accused, so they never touch AI",
              "Banning AI helps them feel safe but leaves them unprepared",
            ],
            ["Over-relyers", "Paste everything and read nothing", "Ignoring AI rewards them"],
            [
              "Power users",
              "Use AI to learn faster",
              "Your job is to move the first two groups toward this one",
            ],
          ],
          caption: "Three kinds of students in your class",
        },
        {
          type: 'tip',
          text: "Before you change anything, ask your students. A short anonymous survey tells you more than guessing, and it shows them you want an honest conversation, not a trap. Make it anonymous: students who fear being accused will hide how they really use AI, and anonymity is what lets them answer honestly.",
        },
        {
          type: 'prompt',
          label: 'Draft a student AI-use survey',
          text: "Help me write a short anonymous survey (6 to 8 questions) for my [subject] class at [level, e.g. 2nd-year BSIT]. I want to learn how students use AI tools for schoolwork: which tools, for which tasks, how often they check the output, and what worries them. Use plain language, mix multiple choice with one open question, and avoid questions that force students to admit breaking rules.",
        },
        {
          type: 'paragraph',
          text: "Your role shifts from gatekeeper of answers to coach of judgment. Over the next 20 lessons you will build a class AI-use policy, a rubric that values process, and a full AI-ready module you can teach next term.",
        },
        {
          type: 'warning',
          text: "Not every student has the same access. Some have only a phone and prepaid data, others only free tiers. Design activities so no one is graded down for the tools they can afford.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "You already know the shift from industry: code generation made typing cheap and made reading, specifying, testing and reviewing the scarce skills. Redesign outcomes around those. Examples: given a spec, write tests that fail for a plausible but wrong implementation; review a diff for defects; debug a failing system where the first suggested fix is wrong. Then audit what you assess today. For each assessment, name the outcome it evidences and run it unassisted through a current model. If the model produces the same evidence, the artefact no longer discriminates, so you need process evidence, a live component or a different task. Also teach AI-assisted development as a subject in its own right: when to use an assistant, how to constrain it, and how to verify what it produces.",
        },
        {
          type: "takeaways",
          items: [
            "A student can now paste a lab exercise into a chatbot and get working code in seconds; your course has to prove more than that.",
            "AI still cannot give students judgment, debugging skill, understanding or practice.",
            "Skill grows from productive struggle. If AI removes all of it, grades can rise while ability does not.",
            "Move avoiders and over-relyers toward power users; banning or ignoring AI both fail.",
            "Ask your students first, and do not grade anyone down for the tools they can afford.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-01-q1',
          prompt: 'Why does AI change what a typical programming exercise proves?',
          choices: [
            'Because AI-written code never runs',
            'Because a working final answer no longer shows that the student can produce or understand it',
            'Because students are no longer allowed to write code',
            'Because programming is no longer taught in colleges',
          ],
          answer: 1,
          explanation:
            'AI can produce a working answer in seconds, so the final output alone no longer proves the student understands it. You need evidence of understanding too.',
        },
        {
          id: 'educator-01-q2',
          prompt: 'Which of these does AI still not give a student?',
          choices: [
            'A summary of a reading',
            'An explanation of an error message',
            'The practice that turns knowledge into skill',
          ],
          answer: 2,
          explanation:
            'AI can explain and summarize, but skill only grows through the student’s own repeated practice and struggle.',
        },
        {
          id: 'educator-01-q3',
          prompt: 'What is the main risk of simply banning AI in your class?',
          choices: [
            'Students who follow the rule finish unprepared for workplaces that use AI',
            'The school will lose its accreditation',
            'Students will stop attending class',
            'Nothing; banning solves the problem',
          ],
          answer: 0,
          explanation:
            'A ban protects the rule-followers from accusation but leaves them without AI skills, while it does little to stop over-relyers.',
        },
        {
          id: 'educator-01-q4',
          prompt: 'Why make the first student survey anonymous?',
          choices: [
            'Because surveys must be anonymous by law',
            'So the results are faster to tally',
            'So students can answer honestly without fear of being accused',
            'So you never have to read the results',
          ],
          answer: 2,
          explanation:
            'Students hide AI use when they fear punishment. Anonymity gets you honest data and signals that you want a real conversation.',
        },
        {
          id: "educator-01-q5",
          audience: { max: "beginner" },
          prompt: "A student pastes your lab exercise into an AI assistant and gets working code in seconds. In plain words, what does that change for you?",
          choices: [
            "It proves the student broke the rules and should be reported",
            "A correct final answer no longer proves the student could write or understand it alone",
            "It shows the exercise was badly written and must be deleted",
            "It means students no longer need to learn the topic at all",
          ],
          answer: 1,
          explanation: "A working answer used to be good evidence that the student did the thinking. Now it can come from a tool, so you need other evidence, such as how the work was made or a short explanation from the student.",
        },
        {
          id: "educator-01-q6",
          audience: { min: "advanced" },
          prompt: "You are auditing a course for an AI-era redesign. Which first step gives you the most useful information?",
          choices: [
            "List each assessment, name the outcome it evidences, and run it unassisted through a current model to see whether the evidence is reproduced",
            "Ask students to sign a form promising not to use AI tools",
            "Replace every take-home task with a longer written exam",
            "Rank the assessments by how long each one takes you to grade",
          ],
          answer: 0,
          explanation: "The audit shows which assessments still separate students who understand from students who only submitted an artefact. Where a model reproduces the evidence, you add process evidence or a live component.",
        },
      ],
      task: {
        title: 'Test your own assignment',
        steps: [
          'Use the prompt above to draft your student survey and edit it to fit your class.',
          'Pick one current assignment and paste its instructions (no student data) into an AI assistant.',
          'Write down what the AI got right, what it got wrong and how long it took.',
          'Note one thing this assignment no longer proves on its own.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask an AI assistant: \"Explain what a chatbot, code and a lab exercise are, using a classroom analogy.\" Then write, in your own words, what it means that the answer can be right while the practice never happened, using one of your own assignments as the example.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Make a table of your course's assessments with three columns: the outcome each one evidences, whether an unassisted run through a current model reproduces that evidence, and what extra evidence (history, live part, oral check) you would add.",
          ],
        },
      ],
    },
    {
      id: 'educator-02',
      day: 2,
      title: 'AI for your own prep: lesson plans',
      summary: 'Draft a lesson plan with AI in minutes, then check it like a reviewer would.',
      intro: {
        objectives: [
          'Write a lesson plan prompt with real context: level, prior knowledge, time, resources and outcomes.',
          'Review an AI draft for accuracy, alignment with outcomes, timing and fit with your class.',
          'Verify curriculum codes and references against the official CHED, DepEd or TESDA documents.',
          "Ask the AI to critique its own plan from a struggling and a fast student's point of view.",
        ],
        why: 'Using AI for your own prep is the quickest way to learn what it can and cannot do, and it gives you back hours each week. Careful checking keeps invented codes and small mistakes out of the plans you submit.',
      },
      minutes: 15,
      skills: ['ai-prep'],
      body: [
        {
          type: 'paragraph',
          text: "The fastest way to learn what AI can do for your students is to use it for your own work first. Lesson planning is a good place to start. AI will not replace your knowledge of your class, but it can give you a solid first draft in minutes, so your time goes into judgment instead of formatting.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **prompt** is simply the message you type to the assistant. Giving it **context** means telling it who your students are, what they already know and how long the class is, like briefing a substitute teacher who has never met your class. A **learning outcome** is one sentence saying what students should be able to do by the end, for example \"write a query that joins two tables\". A plan is **aligned** when every activity points at an outcome. Treat the assistant's first answer like a draft from a new teaching assistant: useful, but you read and fix it before class.",
        },
        { type: 'heading', text: 'Give it real context' },
        {
          type: 'paragraph',
          text: "A vague request gets a generic plan. Tell the AI who your students are, what they already know, how long the session is, what resources you have and which learning outcomes you must meet. The more specific you are, the less you rewrite.",
        },
        {
          type: 'prompt',
          label: 'Lesson plan draft',
          text: "You are an experienced IT instructor. Draft a [90-minute] lesson plan on [topic, e.g. SQL JOINs] for [level, e.g. 2nd-year BSIT students] who already know [prior knowledge, e.g. SELECT, WHERE and ORDER BY]. Learning outcomes: [paste your outcomes]. Resources: [e.g. a computer lab with 20 PCs, slow internet, students share some units]. Include: a 5-minute hook, direct instruction, a guided activity, independent practice, a quick check for understanding and a wrap-up, with minutes for each part. Use local examples where natural. At the end, list every assumption you made and anything I should verify.",
        },
        { type: 'heading', text: 'Check it like a reviewer' },
        {
          type: 'list',
          items: [
            '**Accuracy:** is every technical statement correct? Run any code or query yourself.',
            '**Alignment:** does each activity serve a learning outcome, and does the check actually measure it?',
            '**Time:** could your real class finish each part in the minutes given?',
            '**Context:** does it fit your lab, your students and your syllabus?',
          ],
        },
        {
          type: 'paragraph',
          text: "Then make the AI work for you a second time. Ask it to critique its own draft from the point of view of a struggling student and a fast student. You will often get useful ideas for scaffolds and extensions.",
        },
        {
          type: 'prompt',
          label: 'Ask for a critique',
          text: "Review the lesson plan above as a strict department chair. Point out where the timing is unrealistic, where an activity does not match a learning outcome, and where a struggling student would get lost. Then suggest one extension task for students who finish early.",
        },
        {
          type: 'warning',
          text: "AI often invents curriculum codes, competency numbers and references that look official. Always check them against your actual CHED syllabus, DepEd curriculum guide or TESDA training regulation before you submit a plan.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-02-scenario-1",
            kind: "scenario",
            title: "Codes that look official",
            prompt: "What do you do?",
            concept: "verifying ai lesson plans",
            situation: "The AI's lesson plan lists a \"CHED memorandum\" number and a competency code that look completely official. You are about to submit the plan.",
            options: [
              {
                text: "Keep them. They look official, so they must be real.",
                consequence: "AI often invents curriculum codes, competency numbers and references that look official. A wrong code in a submitted plan reflects on you.",
                quality: "poor",
              },
              {
                text: "Check each one against your actual CHED syllabus, DepEd curriculum guide or TESDA training regulation before you submit.",
                consequence: "The real document is the only source of truth, and it takes a few minutes.",
                quality: "best",
              },
              {
                text: "Ask the AI to confirm the code and trust its answer.",
                consequence: "The same model that wrote it will tend to agree with itself. It is not a check.",
                quality: "poor",
              },
            ],
            hints: [
              "Where do real curriculum codes come from?",
              "AI invents official-looking codes, so appearance proves nothing.",
              "Compare against your actual syllabus, guide or training regulation.",
            ],
            explanation: "Treat AI lesson plans as drafts. Check codes, references and technical claims against the real documents, and run any code yourself.",
          },
        },
        {
          type: 'tip',
          text: "Keep your voice. Edit the draft so it sounds like you and reflects how you actually teach. A plan you believe in will go better than a perfect plan that feels borrowed.",
        },
        {
          type: 'paragraph',
          text: "Use your school's approved AI tool or account if it has one, and leave out student names and records. Your prep is about the topic and the class level, not about individual students, so you rarely need any personal data at all.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat the draft as you would a design document from a junior colleague. Anchor it with a traceability table, outcome to activity to evidence of attainment, and have the model produce it, then audit it yourself for activities that serve no outcome and outcomes that nothing tests. Pin versions: say which language and tool versions your lab image uses, because drafts quietly target the newest release or an older tutorial. Check sequencing by prerequisite: does the plan use a concept such as recursion, joins or async code before your students have met it? If your programme follows a framework such as the ACM/IEEE-CS/AAAI Computer Science Curricula 2023, which has an Artificial Intelligence knowledge area, map outcomes to it, but check the mapping against the document, since a model can paraphrase a standard loosely.",
        },
        {
          type: "takeaways",
          items: [
            "Give the AI real context: students, prior knowledge, session length, resources and learning outcomes.",
            "Check a draft like a reviewer: accuracy, alignment with outcomes, time, and fit with your class.",
            "Ask the AI to critique its own plan from a struggling student's and a fast student's point of view.",
            "Verify curriculum codes and references against the official documents.",
            "Keep your voice and leave student names and records out.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-02-q1',
          prompt: 'What makes an AI-drafted lesson plan need fewer rewrites?',
          choices: [
            'Asking for it in capital letters',
            'Giving real context: level, prior knowledge, time, resources and outcomes',
            'Asking for the longest plan possible',
            'Using a different AI tool each time',
          ],
          answer: 1,
          explanation:
            'Specific context lets the AI fit the plan to your class, so you edit less and the plan is more realistic.',
        },
        {
          id: 'educator-02-q2',
          prompt: 'The AI draft cites a competency code you have never seen. What should you do?',
          choices: [
            'Keep it; AI knows the curriculum',
            'Delete the whole plan',
            'Check it against your actual curriculum document before using it',
          ],
          answer: 2,
          explanation:
            'AI can invent official-looking codes and references. Verify them against the real CHED, DepEd or TESDA document.',
        },
        {
          id: 'educator-02-q3',
          prompt: 'Why ask the AI to critique its own lesson plan?',
          choices: [
            'To surface weak timing, misaligned activities and ideas for struggling or fast students',
            'Because AI critiques are always correct',
            'To make the plan longer',
            'To avoid reading the plan yourself',
          ],
          answer: 0,
          explanation:
            'A second pass from a different point of view often finds gaps and scaffolding ideas, which you still judge yourself.',
        },
        {
          id: 'educator-02-q4',
          prompt: 'Which check makes sure the lesson actually teaches what you must assess?',
          choices: ['Time', 'Formatting', 'Word count', 'Alignment with the learning outcomes'],
          answer: 3,
          explanation:
            'Alignment means every activity and check serves a learning outcome, so what you teach matches what you assess.',
        },
        {
          id: "educator-02-q5",
          audience: { max: "beginner" },
          prompt: "What does it mean to give an AI assistant \"context\" when asking for a lesson plan?",
          choices: [
            "Writing the request in a very formal style with long sentences",
            "Asking it to guess the topic from the title of your course",
            "Pasting a list of your students with their grades",
            "Telling it who your students are, what they already know, how long the session is and what outcomes you need",
          ],
          answer: 3,
          explanation: "Context is the information the assistant cannot see for itself. The more of it you give, the less you rewrite. It does not include student names or grades.",
        },
        {
          id: "educator-02-q6",
          audience: { min: "advanced" },
          prompt: "An AI-drafted plan puts a lab on asynchronous code in week 3, before your students have met callbacks. Which review step would have caught this?",
          choices: [
            "Asking the model to rate its own plan out of ten",
            "Counting the minutes in each part of the session",
            "Checking the sequence against your course map by prerequisite, concept by concept",
            "Checking that every learning outcome uses an action verb",
          ],
          answer: 2,
          explanation: "Models draft in a sensible-looking order that may not be your order. A prerequisite check against your own course map finds a concept used before it is taught.",
        },
      ],
      task: {
        title: 'Draft and review one real lesson',
        steps: [
          'Choose a lesson you will teach in the next two weeks.',
          'Fill in the lesson plan prompt with your real context and run it.',
          'Run the critique prompt and note two changes you agree with.',
          'Mark every technical claim or code snippet you still need to verify, then verify one now.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write your lesson's learning outcome as one sentence starting \"By the end, students can...\" and put it into the prompt. Then ask the assistant to explain any word in its draft that you do not know, in everyday words.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Ask the model for an outcome, activity and evidence table, then mark any outcome with no evidence and any activity with no outcome. Add the language and tool versions of your lab to the prompt and check whether the code in the draft still fits them.",
          ],
        },
      ],
    },
    {
      id: 'educator-03',
      day: 3,
      title: 'Examples, exercises and slide outlines',
      summary: 'Generate local examples, leveled exercises and slide outlines, and test every one.',
      intro: {
        objectives: [
          'Ask for local, leveled exercises and tell the AI that the numbers are examples.',
          'Run an AI-written solution with assert lines before you hand it out.',
          'Trace a small function by hand, including an edge case such as rounding up.',
          'Ask for a slide outline first and fix the structure before the design.',
        ],
        why: "Good examples take hours to invent and AI can draft many in minutes. An exercise sheet with a wrong expected output costs you your students' trust, so the habit that matters is running everything first.",
      },
      minutes: 15,
      skills: ['ai-prep', 'teaching-ai-skills'],
      body: [
        {
          type: 'paragraph',
          text: "Good examples make or break a tech lesson. Students remember a concept better when it is attached to something they know. AI is very good at producing many examples quickly, which frees you to pick the best one instead of inventing all of them.",
        },
        { type: 'heading', text: 'Local examples students recognize' },
        {
          type: 'paragraph',
          text: "Ask for examples from your students' world: a sari-sari store inventory for arrays and loops, an e-wallet transfer like GCash for transactions, a jeepney fare calculator for conditionals, a barangay clearance queue for data structures. Always tell the AI the numbers are examples, so it does not pretend to know official fares or fees.",
        },
        {
          type: 'prompt',
          label: 'Leveled exercises',
          text: "Create three exercises on [concept, e.g. Python conditionals] for [level]. Use one local Filipino context, e.g. a jeepney fare calculator with made-up example rates. Make one basic, one intermediate and one challenge exercise. For each, give the instructions, two sample inputs with expected outputs, and a reference solution with test cases. Mark clearly that the rates are examples, not official fares.",
        },
        { type: 'heading', text: 'Run every solution' },
        {
          type: 'paragraph',
          text: "Never hand out an AI-written solution or expected output that you have not run. Small mistakes are common, especially in edge cases. Add a few `assert` lines so you know the code does what the exercise says. This is the same habit you will later teach your students.",
        },
        {
          type: 'code',
          language: 'python',
          label: 'A checked example solution',
          code: `import math


def fare(distance_km: float, base: float = 13.0, base_km: float = 4.0, per_km: float = 2.0) -> float:
    """Example fare (not the official rate): a flat base for the first base_km,
    then per_km for each extra kilometre or part of one."""
    if distance_km < 0:
        raise ValueError("distance must not be negative")
    extra_km = max(0, math.ceil(distance_km - base_km))
    return base + extra_km * per_km


assert fare(3) == 13.0
assert fare(4) == 13.0
assert fare(4.2) == 15.0
assert fare(7) == 19.0
print("all checks passed")`,
        },
        {
          type: 'paragraph',
          text: "Trace how it works before you trust it. The first `base_km` kilometres cost the flat base. `math.ceil` rounds a number up to the next whole number, so any part of an extra kilometre counts as a full one. For 4.2 km, `distance_km - base_km` is 0.2, which `math.ceil` turns into 1 extra kilometre, so the fare is 13.0 + 1 x 2.0 = 15.0. For 7 km the extra distance is 3, so the fare is 13.0 + 3 x 2.0 = 19.0. Working an edge case by hand like this is how you catch a wrong expected output.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Two small ideas make the code above easier to follow. A **test case** is a question whose right answer you already know, such as \"a 4 km ride costs 13.0\". An **assert** line says \"stop and complain if this is not true\", like checking your change against the receipt before you leave the shop. Each `assert` in the example is one test case. An **edge case** is an unusual input at the boundary, such as exactly 4 km, where mistakes like to hide. Running the example means pressing run and reading what it prints, not trusting that it looks right.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-03-predict-output-1",
            kind: "predict-output",
            title: "Run the fare before you hand it out",
            prompt: "Read the example fare function. What do these two calls print? Each extra kilometre, or part of one, costs `per_km`.",
            concept: "checking ai-written solutions",
            language: "python",
            code: "import math\n\ndef fare(distance_km: float, base: float = 13.0, base_km: float = 4.0, per_km: float = 2.0) -> float:\n    \"\"\"Example fare (not the official rate): a flat base for the first base_km,\n    then per_km for each extra kilometre or part of one.\"\"\"\n    if distance_km < 0:\n        raise ValueError(\"distance must not be negative\")\n    extra_km = max(0, math.ceil(distance_km - base_km))\n    return base + extra_km * per_km\n\nprint(fare(4.2))\nprint(fare(8.5))",
            expected: "15.0\n23.0",
            choices: ["15.0\n23.0", "13.0\n21.0", "15.0\n21.0", "13.0\n23.0"],
            wrongNotes: {
              "13.0\n21.0": "That rounds the extra distance down. The docstring says each extra kilometre or part of one counts, and the code uses `math.ceil`.",
              "15.0\n21.0": "The first call is right, but 8.5 km is 4.5 km past the base, which rounds up to 5 extra km.",
              "13.0\n23.0": "The second call is right, but 4.2 km has 0.2 km past the base, and part of a kilometre counts.",
            },
            hints: [
              "Start from the flat base for the first 4 km.",
              "How many extra kilometres, or parts of one, are in 4.2 km? In 8.5 km?",
              "`math.ceil` rounds up: 0.2 extra km counts as 1, and 4.5 extra km counts as 5.",
            ],
            explanation: "4.2 km is 0.2 km past the base distance, which rounds up to 1 extra km: 13 + 2 = 15. 8.5 km has 4.5 extra km, rounded up to 5: 13 + 10 = 23. Small edge cases like this are why you run every AI solution.",
          },
        },
        { type: 'heading', text: 'Slide outlines, not finished slides' },
        {
          type: 'paragraph',
          text: "Ask for an outline first: one idea per slide, a short title, two or three points and speaker notes. Fix the structure before anyone spends time on design. A clear outline also becomes a handout for students who were absent or learn better by reading.",
        },
        {
          type: 'prompt',
          label: 'Slide outline',
          text: "Outline a 12-slide deck on [topic] for [level]. One idea per slide: a title, at most three short points and two sentences of speaker notes. Include one slide with a worked example, one with a common mistake, and a final slide with three check-for-understanding questions. Do not write paragraphs on the slides.",
        },
        {
          type: 'tip',
          text: "Keep a folder of examples that worked well in class. Next term, paste the best ones into your prompt as a style guide so new examples match.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-03-scenario-1",
            kind: "scenario",
            title: "The sheet and the run disagree",
            prompt: "What do you do?",
            concept: "verifying ai exercises",
            situation: "The AI-written exercise sheet says a sample input should give 16.0. When you run its reference solution it prints 15.0.",
            options: [
              {
                text: "Hand out the sheet as it is; students will sort it out.",
                consequence: "Students will lose time and confidence on a mistake that was yours to catch.",
                quality: "poor",
              },
              {
                text: "Work out which one is right from the exercise statement, fix the sheet or the code, and add assert lines so the solution is checked.",
                consequence: "The statement decides the right answer. Fixing it and adding checks gives you a sheet you can trust.",
                quality: "best",
              },
              {
                text: "Ask the AI which one is right and trust its answer.",
                consequence: "It can be wrong about its own output. The statement and a run are the evidence.",
                quality: "poor",
              },
            ],
            hints: [
              "Never hand out an expected output you have not run.",
              "What does the exercise statement say the answer should be?",
              "Add a few `assert` lines so you know the code does what the exercise says.",
            ],
            explanation: "Run every solution. When the output and the sheet disagree, find out which is right from the problem itself, and keep the asserts.",
          },
        },
        {
          type: 'warning',
          text: "Watch for examples that stereotype people by gender, region or income. AI repeats patterns from its training data. Swap names and roles so every student can see themselves in your examples.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Asserts are fine in a handout but weak as a grading harness: CPython generates no code for an `assert` when run with the `-O` option, so use a real test framework such as pytest or unittest that reports each failure. More valuable is checking the checker. Run your tests against deliberately wrong variants, rounding down instead of up or `>` instead of `>=`, and confirm they fail; that is mutation testing done by hand. Have the model write a reference solution and two plausible wrong ones, then verify all three by execution. Watch for a shared oracle: if the model wrote both solution and tests, a common misreading of the spec passes silently, so derive expected values from the written spec independently. Keep hidden tests for graded work.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "In CPython, an assert statement generates no code when optimization is requested at compile time with the -O command-line option, so asserts are not a dependable test harness. Checked against the Python 3 language reference.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Python language reference: the assert statement",
              url: "https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "AI is good at producing many examples quickly, leaving you to pick the best.",
            "Use local, familiar contexts, and tell the AI the numbers are examples, not official rates.",
            "Never hand out an AI-written solution or expected output you have not run; add `assert` lines.",
            "Ask for slide outlines first: one idea per slide, short points and speaker notes.",
            "Watch for stereotypes in examples and swap names and roles.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-03-q1',
          prompt: 'Why tell the AI that rates in an exercise are made-up examples?',
          choices: [
            'So it does not present invented numbers as official fares or fees',
            'Because AI cannot do arithmetic with real numbers',
            'Because local examples are not allowed',
          ],
          answer: 0,
          explanation:
            'Saying the numbers are examples stops the AI from presenting guesses as official facts, and stops students from treating them as real.',
        },
        {
          id: 'educator-03-q2',
          prompt: 'In the fare example, what does `fare(4.2)` return?',
          choices: ['13.0', '13.4', '15.0', '17.0'],
          answer: 2,
          explanation:
            '4.2 km is 0.2 km past the 4 km base, which rounds up to 1 extra km: 13.0 + 1 x 2.0 = 15.0.',
        },
        {
          id: 'educator-03-q3',
          prompt: 'What is the best first step before handing out an AI-written solution?',
          choices: [
            'Format it nicely',
            'Add your name to it',
            'Ask the AI if it is correct',
            'Run it, ideally with a few test cases',
          ],
          answer: 3,
          explanation:
            'Running the code with tests is the only reliable check. Asking the AI again can repeat the same error.',
        },
        {
          id: 'educator-03-q4',
          prompt: 'Why ask for a slide outline before finished slides?',
          choices: [
            'Outlines are required by CHED',
            'You can fix the structure cheaply before spending time on design',
            'AI cannot make slides',
            'Students prefer slides with no titles',
          ],
          answer: 1,
          explanation:
            'Fixing the order and content in an outline is fast. Fixing a finished, designed deck takes much longer.',
        },
        {
          id: "educator-03-q5",
          audience: { max: "beginner" },
          prompt: "In plain words, what does an `assert` line in the fare example do?",
          choices: [
            "It checks that something you expect is true and stops with a complaint if it is not",
            "It prints the fare on the screen for the student to read",
            "It saves the answer so the program runs faster next time",
            "It asks the AI assistant to confirm the result",
          ],
          answer: 0,
          explanation: "An assert is a built-in check. In the fare example, `assert fare(4) == 13.0` stops the program with an error if the function does not return 13.0.",
        },
        {
          id: "educator-03-q6",
          audience: { min: "advanced" },
          prompt: "Your AI-generated test suite passes against the AI-generated reference solution. Which extra step best shows the tests are any good?",
          choices: [
            "Run the same suite a second time on a faster computer",
            "Ask the model whether it is confident in its own tests",
            "Run them against deliberately wrong variants of the solution and confirm that each variant fails",
            "Add more tests of the same normal case to raise the count",
          ],
          answer: 2,
          explanation: "Tests that pass a correct solution say little. If they also fail on plausible wrong versions, they are doing their job. A model checking its own work shares its own misreadings.",
        },
      ],
      task: {
        title: 'Make and test a leveled exercise set',
        steps: [
          'Run the leveled exercises prompt for a concept you teach this month.',
          'Copy each reference solution into a file and run it with its tests.',
          'Fix or discard anything that fails, and note what the AI got wrong.',
          'Run the slide outline prompt for the same topic and save the outline.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask an AI assistant: \"What is a test case? Explain it with a shopping receipt analogy.\" Then write two of your own test cases for the fare function, each with an input and the answer you expect, and check them against what the code prints.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write two wrong versions of the fare function (round down instead of up, and `>` where `>=` is needed). Run your tests against both and fix any test that still passes. Move the checks into pytest or unittest.",
          ],
        },
      ],
    },
    {
      id: 'educator-04',
      day: 4,
      title: 'Assignments that still measure learning',
      summary: 'Redesign assignments to be AI-aware instead of hoping they are AI-proof.',
      intro: {
        objectives: [
          'Red-team one of your assignments by completing it with AI as a student would.',
          'Choose two or three of the six moves that make an assignment AI-aware.',
          'Redesign a take-home project with stages, process evidence and a short live part.',
          'Explain why strange, obscure tasks do not stop AI.',
        ],
        why: 'No take-home assignment is AI-proof, so a grade on the final file may no longer show what a student knows. Redesigning around evidence keeps your grades meaningful without making grading much heavier.',
      },
      minutes: 15,
      skills: ['assessment-design'],
      body: [
        {
          type: 'paragraph',
          text: "There is no such thing as an AI-proof take-home assignment. If a task can be described in text, an AI can attempt it. The better goal is an **AI-aware** assignment: one where the evidence you collect still shows what the student knows and can do, whether or not AI was used.",
        },
        { type: 'heading', text: 'First, red-team your own assignment' },
        {
          type: 'paragraph',
          text: "Before you redesign anything, see how easy it is to complete with AI. Paste the instructions into an AI assistant, as a student would, and look at the result honestly. If the AI gets full marks in one try, the assignment measures the AI, not the student.",
        },
        {
          type: 'prompt',
          label: 'Red-team an assignment',
          text: "Here is an assignment I give my [level] students: [paste instructions, no student data]. Complete it as a student would. Then, as an assessment expert, tell me which parts you could do fully, which parts would expose a student who did not understand, and what evidence I could ask for that would better show real learning.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A take-home assignment is like homework done at the kitchen table: you cannot see who helped. **AI-aware** means you plan for helpers and collect evidence that still shows what the student knows. **Red-team** simply means testing your own work by trying to beat it, as a friend might look for the holes in your plan. **Process evidence** is proof of how the work was made, such as earlier saved versions, a written plan or a short chat with you about it. A final file alone cannot show that. A final file plus a plan, a few saved versions and a five-minute walkthrough can.",
        },
        { type: 'heading', text: 'Six moves that make assignments AI-aware' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Grade the process:** ask for a plan, drafts, commit history or a short log of what they tried.',
            '**Use their own context:** a system for a real local business they interview, their own data, their barangay or school.',
            '**Stage it:** proposal, checkpoint, final. Each stage is short and gets feedback.',
            '**Add a live part:** a short in-class build, a walkthrough or an oral check.',
            '**Make AI the subject:** give them AI output to critique, test and improve.',
            '**Ask for reflection:** what they changed, why, and what they would do differently.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "educator-04-match-1",
            kind: "match",
            title: "Which move is that?",
            prompt: "A department redesigned six assignments. Match each change with the move that makes it AI-aware.",
            concept: "ai-aware assignments",
            labels: { terms: "Changes to an assignment", meanings: "Move it uses" },
            pairs: [
              {
                term: "For the inventory system project, students now submit their Git history, not just the final zip.",
                definition: "Grade the process",
              },
              {
                term: "Instead of a generic library system, each group builds one for a sari-sari store owner they interview.",
                definition: "Use their own context",
              },
              {
                term: "The capstone has a proposal in week 2, a working checkpoint in week 6 and the final in week 10, each with feedback.",
                definition: "Stage it",
              },
              {
                term: "In the last ten minutes of lab, each student adds a small feature to their own code while you watch.",
                definition: "Add a live part",
              },
              {
                term: "Students get a ChatGPT-written login function and must find its flaws and write tests that expose them.",
                definition: "Make AI the subject",
              },
              {
                term: "Each submission ends with a paragraph on what they changed after testing, and why.",
                definition: "Ask for reflection",
              },
            ],
            hints: [
              "Some changes collect evidence over time, some happen in the room, and one turns AI output into the thing being studied.",
              "Git history is evidence of how the work was done; a proposal, checkpoint and final split the work into stages.",
              "A real local store makes the task personal; a written paragraph on what they changed is reflection.",
            ],
            explanation: "Git history grades the process, an interviewed store owner is their own context, three checkpoints stage it, the watched feature is a live part, critiquing AI code makes AI the subject, and the closing paragraph is reflection.",
          },
        },
        {
          type: 'paragraph',
          text: "You do not need all six. Pick two or three that fit the assignment. A database project, for example, could keep the same final system but add a schema plan due in week one, a commit history requirement and a ten-minute walkthrough at the end.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-04-scenario-1",
            kind: "scenario",
            title: "The database project",
            prompt: "Which redesign fits?",
            concept: "redesigning assignments",
            situation: "Your final database project can be finished by an AI in one try: schema, queries and report. You want to redesign it without making grading much heavier.",
            options: [
              {
                text: "Replace it with a strange, unrealistic task so the AI gets confused.",
                consequence: "Obscure tasks frustrate honest students and rarely stop AI for long.",
                quality: "poor",
              },
              {
                text: "Keep the same final system, but add a schema plan due in week one, a commit history requirement and a ten-minute walkthrough at the end.",
                consequence: "Process evidence and a short live part show what the student understands, with checkpoints that make grading easier to spread out.",
                quality: "best",
              },
              {
                text: "Ban AI in the syllabus and leave the assignment as it is.",
                consequence: "The assignment still measures the AI, and students cannot be checked on a rule that has no evidence.",
                quality: "poor",
              },
            ],
            hints: [
              "Real, personal, process-heavy work is the stronger defence.",
              "Which option adds evidence of how the student worked?",
              "A staged assignment often takes less time to grade than one large submission.",
            ],
            explanation: "Keep the learning outcomes, add stages, process evidence and one short live part. Avoid artificially obscure tasks.",
          },
        },
        {
          type: 'prompt',
          label: 'Redesign it',
          text: "Redesign the assignment above to be AI-aware without making it much longer to grade. Keep the same learning outcomes: [paste outcomes]. Add stages, process evidence and one short live component. Show the new instructions as the students would read them, and a list of what I should grade at each stage.",
        },
        {
          type: 'tip',
          text: "Watch your grading load. A staged assignment with short checkpoints often takes less time overall than one large submission, because you catch problems early instead of writing long comments at the end.",
        },
        {
          type: 'warning',
          text: "Avoid making assignments artificially obscure just to confuse AI. Strange, unrealistic tasks frustrate honest students and rarely stop AI for long. Real, personal and process-heavy work is the stronger defence.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Design for evidence quality, not for detection. For each outcome, name the observable behaviour that separates understanding from a copied artefact, then pick the cheapest instrument that elicits it: a live modification, a defended design decision, a debugging task on code the student did not write, a review of a supplied diff. Make version control part of the contract: a commit cadence and a history you can read with `git log --stat`, plus a short design log. Weight process so a perfect artefact with no history cannot pass. Tier by stakes: low-stakes work open with disclosure, high-stakes components supervised or oral. Re-run the red-team each term against current models, because tasks a model could not do tend to become tasks it can, and date the result.",
        },
        {
          type: "takeaways",
          items: [
            "No take-home task is AI-proof; aim for AI-aware assignments whose evidence still shows what the student can do.",
            "Red-team your own assignment first: paste it into an AI as a student would.",
            "Six moves: grade the process, use their own context, stage it, add a live part, make AI the subject, ask for reflection.",
            "You do not need all six; pick two or three that fit.",
            "Avoid obscure tasks that only frustrate honest students.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-04-q1',
          prompt: 'What is an AI-aware assignment?',
          choices: [
            'One that AI tools cannot attempt at all',
            'One whose evidence still shows real learning whether or not AI was used',
            'One that must be done only on paper',
            'One that bans every digital tool',
          ],
          answer: 1,
          explanation:
            'No take-home task is truly AI-proof. An AI-aware design collects evidence of the student’s own understanding and process.',
        },
        {
          id: 'educator-04-q2',
          prompt: 'The AI completes your assignment with full marks in one try. What does that tell you?',
          choices: [
            'The assignment is too easy for any student',
            'The AI tool is cheating',
            'The final output alone is not showing the student’s own learning',
          ],
          answer: 2,
          explanation:
            'If the AI can fully complete it, the output measures the AI. You need process evidence or a live component too.',
        },
        {
          id: 'educator-04-q3',
          prompt: 'Which change adds the strongest evidence of understanding to a take-home database project?',
          choices: [
            'A short walkthrough where the student explains the schema and queries',
            'A longer page limit',
            'A stricter font requirement',
            'A shorter deadline',
          ],
          answer: 0,
          explanation:
            'Explaining their own design live shows understanding in a way a pasted submission cannot.',
        },
        {
          id: 'educator-04-q4',
          prompt: 'Why avoid making tasks deliberately strange just to confuse AI?',
          choices: [
            'Because it is against CHED rules',
            'Because AI never struggles with strange tasks',
            'Because students like easy tasks',
            'It frustrates honest students and rarely stops AI for long',
          ],
          answer: 3,
          explanation:
            'Obscure tasks hurt learning and are quickly beaten. Real, personal, staged work is a better defence.',
        },
        {
          id: "educator-04-q5",
          audience: { max: "beginner" },
          prompt: "What is \"process evidence\" in an assignment?",
          choices: [
            "The final file the student hands in on the deadline",
            "A statement from the student saying they worked alone",
            "Proof of how the work was made, such as a plan, saved versions or a short explanation by the student",
            "A longer list of rules printed on the assignment sheet",
          ],
          answer: 2,
          explanation: "Process evidence shows how the work was made, not only what it looks like at the end. That is why it still means something when a tool could have produced the final file.",
        },
        {
          id: "educator-04-q6",
          audience: { min: "advanced" },
          prompt: "A capstone repository is flawless but holds a single commit made the night before the deadline. What fits an AI-aware assessment design?",
          choices: [
            "Treat the single commit as proof of misconduct and report it",
            "Apply the evidence requirements you set in advance: ask for the design log and history, and add a short walkthrough, before drawing any conclusion",
            "Ignore it because the final product works and meets the spec",
            "Run the repository through an AI detector and use the score",
          ],
          answer: 1,
          explanation: "The contract said what evidence counts, so you ask for it. A single commit is a reason to look closer, not a verdict, and a short walkthrough tells you far more than a guess about the files.",
        },
      ],
      task: {
        title: 'Red-team and redesign one assignment',
        steps: [
          'Pick the assignment you worry about most.',
          'Run the red-team prompt and read the AI’s attempt honestly.',
          'Run the redesign prompt and choose two or three of the six moves.',
          'Rewrite the instructions in your own words and save them for your module.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask an AI assistant: \"Explain red-teaming my own assignment in everyday words, with an example from a classroom.\" Then list three kinds of process evidence you could ask your students for, one sentence each.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Pick one outcome of the assignment and write the cheapest instrument that shows it: a live change, a defended decision or a debugging task. State the required commit cadence and the stakes tier, and decide what you will do if a student arrives with no history.",
          ],
        },
      ],
    },
    {
      id: 'educator-05',
      day: 5,
      title: 'Academic honesty and AI detectors',
      summary: 'Why a detector score is not evidence, and what to do instead when you suspect misuse.',
      intro: {
        objectives: [
          'Explain why an AI detector score is a guess and not proof.',
          'Name the main limits of detectors, including bias against non-native English writers.',
          'Follow a fair process when you suspect misuse: class work, process evidence, a calm conversation and the school process.',
          'Explain why student work should not go into an unapproved detector site.',
        ],
        why: 'Accusing an honest student on a detector score can hurt them and your own credibility, and in a classroom where English is a second language the risk is real. A fair process protects your students and you.',
      },
      minutes: 15,
      skills: ['ai-policy', 'responsible-ai'],
      body: [
        {
          type: 'paragraph',
          text: "When AI writing became common, many schools reached for AI detectors. It is easy to see why: they promise a quick answer. But a detector cannot prove that a student used AI, and relying on one alone can lead to unfair accusations against honest students.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "An **AI detector** is a program that looks at a piece of writing and guesses, as a percentage, how likely it is that a machine wrote it. A guess is not a measurement. Think of someone guessing a person's age from a photo: sometimes close, sometimes far off, and nobody would write the guess on a birth certificate. A **false positive** means the detector says \"AI\" about a student's own honest work. **Non-native** writers are people whose first language is not English. That is why a score alone is never enough to accuse anyone, and why the next sections show what to look at instead.",
        },
        { type: 'heading', text: 'Why detectors are unreliable' },
        {
          type: 'list',
          items: [
            '**They guess.** A detector gives a probability based on how predictable the text looks, not a record of how it was written.',
            '**False positives happen.** Plain, formal or formulaic writing can be flagged even when a student wrote every word.',
            '**Bias is a real concern.** Research has found that detectors flag writing by non-native English speakers more often, which matters in a Filipino classroom where English is a second language for many students.',
            '**They are easy to evade.** Light paraphrasing or another AI pass can change the score.',
            '**Code is harder still.** Short programs look alike, so similarity alone says little.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "educator-05-tap-reveal-1",
            kind: "tap-reveal",
            title: "Why a detector score is not evidence",
            prompt: "Tap each reason to see what it means for a fair decision.",
            concept: "ai detector limits",
            cards: [
              {
                front: "They guess",
                back: "A detector gives a probability based on how predictable the text looks, not a record of how it was written.",
              },
              {
                front: "False positives happen",
                back: "Plain, formal or formulaic writing can be flagged even when a student wrote every word.",
              },
              {
                front: "Bias is a real concern",
                back: "Research has found that detectors flag writing by non-native English speakers more often, which matters where English is a second language.",
              },
              {
                front: "They are easy to evade",
                back: "Light paraphrasing or another AI pass can change the score.",
              },
              {
                front: "Code is harder still",
                back: "Short programs look alike, so similarity alone says little.",
              },
            ],
            hints: [
              "Open the cards in any order.",
              "You are done when all five are open.",
              "Look for the card that matters most in a class where English is a second language.",
            ],
            explanation: "A detector result is at most a reason to look closer, never proof.",
          },
        },
        {
          type: 'paragraph',
          text: "Even AI companies have withdrawn or warned about their own detection tools because of accuracy limits. Treat any detector result as, at most, a reason to look closer, never as proof.",
        },
        { type: 'heading', text: 'What to do instead' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Compare the work with what you have seen the student do in class.',
            'Look at the process evidence: drafts, version history, commits, logs.',
            'Have a calm conversation where the student explains the work.',
            'Follow your school’s academic integrity process for anything formal.',
          ],
        },
        {
          type: 'paragraph',
          text: "A conversation is often the best evidence you have. A student who wrote the code can usually explain why a line is there and change it on the spot. A student who cannot may still deserve a chance to show what they know, but now you have a fair basis for next steps.",
        },
        {
          type: 'prompt',
          label: 'Plan a fair conversation',
          text: "I teach [subject] at [level]. A submission looks very different from the student's in-class work, and I want to talk with them fairly, without accusing them. Write a short conversation plan: an opening that is calm and non-accusatory, five questions that let the student explain their work and process, and how to close the meeting whatever happens. Do not assume guilt.",
        },
        {
          type: 'warning',
          text: "Never accuse a student based on a detector score alone. Also, do not paste student work into a detector website your school has not approved: the work may contain personal data, and you may be sharing it with a third party.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-05-scenario-1",
            kind: "scenario",
            title: "The score says 87%",
            prompt: "What do you do?",
            concept: "academic honesty",
            situation: "A submission looks very different from what a student does in class. A detector reports \"87% likely AI\". The student writes English as a second language.",
            options: [
              {
                text: "Report the student: the score is evidence enough.",
                consequence: "A detector cannot prove how the work was written, and it can flag honest writers. You risk an unfair accusation.",
                quality: "poor",
              },
              {
                text: "Treat the score as at most a reason to look closer: check process evidence such as drafts, history and commits, then talk calmly with the student and follow the school's integrity process.",
                consequence: "A conversation where the student explains and changes their work is often the best evidence you have.",
                quality: "best",
              },
              {
                text: "Paste the work into a second detector to confirm.",
                consequence: "Two guesses are still guesses, and the work may contain personal data you should not share with an unapproved site.",
                quality: "poor",
              },
            ],
            hints: [
              "What does a detector score really measure?",
              "Which evidence do you have besides the score?",
              "Someone who wrote the code can usually explain it and change it on the spot.",
            ],
            explanation: "Rely on what you have seen in class, the process evidence and a calm conversation, and follow your school's process. Never accuse on a detector score alone.",
          },
        },
        {
          type: 'tip',
          text: "The best prevention is design, not detection. Clear rules, process evidence and short live checks make misuse less tempting and honest work easier to recognize.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat detector output as an unvalidated classifier whose error rates in your population are unknown. Liang et al. (2023) tested several GPT detectors and found that they consistently misclassified writing by non-native English speakers as AI-generated, and that simple prompting could get past them; the authors cautioned against use in evaluative settings. Base rates matter: even a low false-positive rate flags some honest students when many are checked, and you cannot estimate the rate for your own class. Code is harder still, since short idiomatic solutions to one exercise look alike. Build a proportionate process instead: a standard of evidence written before any case arises (history, in-class samples, oral explanation), the same steps for every student, and a record of what you looked at. Clear tool policy and staged work mean fewer disputed cases.",
        },
        {
          type: "takeaways",
          items: [
            "A detector cannot prove that a student used AI, and relying on one can wrongly accuse honest students.",
            "Detectors guess, give false positives, can be biased against non-native writers and are easy to evade.",
            "Compare with in-class work, look at process evidence, and have a calm conversation.",
            "Follow your school's academic integrity process for anything formal.",
            "Do not paste student work into detector sites your school has not approved.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-05-q1',
          prompt: 'What does an AI detector score actually tell you?',
          choices: [
            'A guess about how predictable the text looks',
            'A record of which tool the student used',
            'Proof that the student cheated',
            'The exact percentage the student copied',
          ],
          answer: 0,
          explanation:
            'Detectors estimate a probability from the text itself. They cannot see how the work was produced.',
        },
        {
          id: 'educator-05-q2',
          prompt: 'Why should Filipino teachers be especially careful with detectors?',
          choices: [
            'Detectors do not work on Philippine internet',
            'Research has found detectors flag non-native English writing more often',
            'Detectors are illegal in the Philippines',
          ],
          answer: 1,
          explanation:
            'Many Filipino students write in English as a second language, and detectors have been found to flag such writing more often.',
        },
        {
          id: 'educator-05-q3',
          prompt: 'A detector flags a submission at a high score. What is the fair next step?',
          choices: [
            'Give the student a zero immediately',
            'Report it to the dean as confirmed cheating',
            'Ignore it completely',
            'Look at process evidence and talk with the student, following school process',
          ],
          answer: 3,
          explanation:
            'A score is at most a reason to look closer. Evidence and a fair conversation, within your school’s process, come next.',
        },
        {
          id: 'educator-05-q4',
          prompt: 'Why not paste student work into any free detector website?',
          choices: [
            'It is too slow',
            'The results are always correct, so it is unnecessary',
            'It may share student personal data with an unapproved third party',
            'Detector websites only accept PDF files',
          ],
          answer: 2,
          explanation:
            'Student work can contain personal data. Only use tools your school has approved for that data.',
        },
        {
          id: "educator-05-q5",
          audience: { max: "beginner" },
          prompt: "In plain words, what is a \"false positive\" from an AI detector?",
          choices: [
            "The detector says work is human-written when a machine wrote it",
            "The detector refuses to read work that is too short",
            "The detector gives a score and the student agrees with it",
            "The detector says a piece of work is AI-written when the student really wrote it themselves",
          ],
          answer: 3,
          explanation: "A false positive is a wrong accusation by the tool. Because detectors guess, honest students, especially non-native English writers, can be flagged.",
        },
        {
          id: "educator-05-q6",
          audience: { min: "advanced" },
          prompt: "Your department proposes flagging every submission above a detector threshold for a misconduct case. Which objection is best grounded?",
          choices: [
            "Nobody knows the detector's error rates for your students, published research found bias against non-native writers, so a threshold turns a guess into evidence",
            "Detectors are illegal in colleges and universities",
            "A threshold would flag too few submissions to be worth using",
            "Detectors cannot read text written in a programming language",
          ],
          answer: 0,
          explanation: "The objection is about validity and fairness: unknown error rates, documented bias in a published study, and a process that treats a score as proof. Better evidence is history, in-class work and a conversation.",
        },
      ],
      task: {
        title: 'Write your integrity playbook',
        steps: [
          'Find your school’s academic integrity policy and note the official process.',
          'Run the conversation prompt and adapt the questions to your subject.',
          'Write three sentences on how you will (and will not) use detector results.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write, in your own words, what a false positive is and give a classroom example with a student whose English is a second language. Ask an AI assistant to explain the difference between \"probably\" and \"proven\" with a weather example, and note what you learn.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write a one-page evidence standard: what you will look at and in what order, who is told, what is recorded and how a student can respond. Test it on two imagined cases, including one where a non-native writer scores high on a detector.",
          ],
        },
      ],
    },
    {
      id: 'educator-06',
      day: 6,
      title: 'Your class AI-use policy',
      summary: 'Write a clear policy with three levels: allowed, allowed with disclosure, not allowed.',
      intro: {
        objectives: [
          'Describe the three AI-use levels: allowed, allowed with disclosure and not allowed.',
          'Choose the right level for a given activity and explain why.',
          'Write a simple disclosure format that students attach to their work.',
          'State what your policy does about honest disclosure and about undisclosed use.',
        ],
        why: 'Students cannot follow rules they have to guess, and the honest ones lose most when the rules are unclear. A one-page policy gives you a fair basis if something goes wrong.',
      },
      minutes: 15,
      skills: ['ai-policy'],
      body: [
        {
          type: 'paragraph',
          text: "Students should never have to guess whether AI is allowed. Unclear rules punish the honest ones, who avoid AI out of fear, and reward the ones who take the risk. A short, clear class policy fixes this, and it gives you a fair basis if something goes wrong.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **policy** is a short set of rules everyone can read, like the signs in a laboratory: \"goggles required\", \"no food\". A class AI policy works the same way with three signs. Green means allowed. Yellow means allowed if you tell me how you used it. Red means not allowed. **Disclosure** simply means saying honestly how you used a tool, the way you would name a book you copied from. The sign goes on each task, not on the whole course, because a practice exercise and a final project need different rules, and students should never have to guess.",
        },
        { type: 'heading', text: 'Three levels, set per activity' },
        {
          type: 'list',
          items: [
            '**Allowed:** use AI freely, for example to explain an error or generate practice questions.',
            '**Allowed with disclosure:** use AI, but say how. For example, drafting code you then test and explain.',
            '**Not allowed:** do it yourself, for example a fundamentals quiz or a first exercise on a new concept.',
          ],
        },
        {
          type: 'paragraph',
          text: "The level belongs to each activity, not to the whole course. Early fundamentals might be 'not allowed' so students build the base. Later projects might be 'allowed with disclosure' so they practise working with AI like professionals do. Label every assignment so there is no doubt.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-06-match-1",
            kind: "match",
            title: "Which level?",
            prompt: "Three activities from one term of your course. Match each with the AI-use level the lesson's reasoning points to.",
            concept: "ai-use levels",
            labels: { terms: "Activities in your course", meanings: "AI-use level" },
            pairs: [
              {
                term: "Before the midterm, students use AI to make extra practice problems on stacks for their own review; nothing is submitted.",
                definition: "Allowed",
              },
              {
                term: "In the web development final project, students may use AI to draft pages, then must test and explain them.",
                definition: "Allowed with disclosure",
              },
              {
                term: "The first loops exercise in week 2 of Programming 1.",
                definition: "Not allowed",
              },
            ],
            hints: [
              "Ask what each activity is for: building the base, practising, or working like a professional on a project.",
              "A first exercise on a new concept is where students build the base they will later judge AI against.",
              "Practice that is never graded can be relaxed; a graded project drafted with AI needs the student to say how.",
            ],
            explanation: "Ungraded practice questions can be allowed freely, a project drafted with AI and then tested and explained is allowed with disclosure, and a first exercise on loops is not allowed so students build the base.",
          },
        },
        { type: 'heading', text: 'A simple disclosure format' },
        {
          type: 'code',
          language: 'text',
          label: 'AI-use disclosure students attach',
          code: `AI USE DISCLOSURE
Tool(s) used: [name of the AI assistant]
What I used it for: [e.g. explaining an error, suggesting test cases]
What I changed or checked myself: [e.g. rewrote the loop, ran all tests]
Prompts I used (main ones): [paste or summarize]
I can explain every part of this work: yes / no (if no, say which part)`,
        },
        {
          type: 'paragraph',
          text: "Disclosure is not a confession. Make it clear that honest disclosure within the rules is never penalized. Undisclosed use where disclosure was required is the problem, and your policy should say what happens then by pointing to the school's academic integrity process.",
        },
        {
          type: 'prompt',
          label: 'Draft your policy',
          text: "Help me write a one-page AI-use policy for my [subject] class at [level]. Use three levels: allowed, allowed with disclosure, not allowed. Explain why each level exists in student-friendly language. Include: how assignments will be labelled, a short disclosure format, that honest disclosure is never penalized, what happens with undisclosed use (refer to the school's academic integrity process, do not invent penalties), a privacy reminder not to paste personal data into AI tools, and a note that the policy may be updated as tools change.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-06-scenario-1",
            kind: "scenario",
            title: "Who disclosed?",
            prompt: "What do you do?",
            concept: "ai-use policy",
            situation: "One student honestly discloses that AI drafted part of an assignment marked \"allowed with disclosure\". Another used AI on the same assignment and said nothing.",
            options: [
              {
                text: "Penalise the student who disclosed: they admitted using AI.",
                consequence: "It punishes honesty and teaches everyone not to disclose.",
                quality: "poor",
              },
              {
                text: "Never penalise honest disclosure within the rules. Handle the undisclosed use through the school's academic integrity process, as your policy says.",
                consequence: "Honest disclosure is safe, and undisclosed use is the problem, handled by a process your school recognises.",
                quality: "best",
              },
              {
                text: "Invent a penalty for the other student on the spot.",
                consequence: "Do not set penalties your school does not recognise. It also weakens the policy.",
                quality: "poor",
              },
            ],
            hints: [
              "What does the policy promise about honest disclosure?",
              "Which process handles undisclosed use?",
              "Penalties must come from the school, not from you in the moment.",
            ],
            explanation: "Honest disclosure within the rules is never penalised. Undisclosed use where disclosure was required goes to the school's academic integrity process.",
          },
        },
        {
          type: 'tip',
          text: "Explain the 'why' to your students in class. When they understand that 'not allowed' activities build the skills they need for interviews and OJT, they are far more likely to respect the rule.",
        },
        {
          type: 'warning',
          text: "Your class policy must fit your school's and department's rules. Check the student handbook and any institutional AI guidance first, and do not set penalties your school does not recognize.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Write the policy like an interface contract: each activity carries a label, a rationale tied to its learning outcome, and the evidence you will collect. Specify tool classes, such as chat assistant, in-editor completion and autonomous coding agent, rather than product names, because products change faster than syllabi, and say what each class may see: no credentials, student data or employer code. Decide how agents are treated, since a tool that edits files and runs commands raises different disclosure questions from a chat answer. Define the disclosure artefact (tool, purpose, main prompts, what was changed, how it was verified) and where it lives, ideally in the repository next to the work. Date and version the policy, publish a change log, and align with institutional rules before adding class-specific ones.",
        },
        {
          type: "takeaways",
          items: [
            "Students should never have to guess whether AI is allowed.",
            "Three levels, set per activity: allowed, allowed with disclosure, not allowed.",
            "A simple disclosure format: tool, what you used it for, what you changed or checked, main prompts, and whether you can explain it.",
            "Honest disclosure is never penalised; undisclosed use goes through the school's process.",
            "Your policy must fit the school's rules and may be updated as tools change.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-06-q1',
          prompt: 'Why set the AI-use level per activity instead of once for the whole course?',
          choices: [
            'Different activities build different skills, so the right level differs',
            'Because it is required by law',
            'Because students prefer more rules',
            'It makes no difference',
          ],
          answer: 0,
          explanation:
            'Fundamentals may need AI off while later projects benefit from disclosed AI use. Per-activity labels make this clear.',
        },
        {
          id: 'educator-06-q2',
          prompt: 'A student honestly discloses AI use on an "allowed with disclosure" task. What should happen?',
          choices: [
            'A small deduction for using AI',
            'Nothing negative; grade the work by the rubric',
            'Report it to the integrity office',
            'Ask them to redo it without AI',
          ],
          answer: 1,
          explanation:
            'Penalizing honest disclosure teaches students to hide AI use. Within the rules, disclosure is never penalized.',
        },
        {
          id: 'educator-06-q3',
          prompt: 'What should your policy say about penalties for undisclosed use?',
          choices: [
            'Invent strict penalties to scare students',
            'Nothing at all',
            'Point to the school’s academic integrity process',
          ],
          answer: 2,
          explanation:
            'Class policies must fit school rules. Referring to the official process keeps consequences fair and consistent.',
        },
        {
          id: 'educator-06-q4',
          prompt: 'Which item belongs in a good disclosure format?',
          choices: [
            'The student’s GCash number',
            'The price of the AI tool',
            'A promise never to use AI again',
            'What the student changed or checked themselves',
          ],
          answer: 3,
          explanation:
            'Knowing what the student verified or changed shows their own contribution and judgment.',
        },
        {
          id: "educator-06-q5",
          audience: { max: "beginner" },
          prompt: "What does \"disclosure\" mean in a class AI policy?",
          choices: [
            "Honestly saying how you used an AI tool, for example what you asked it and what you changed yourself",
            "Sending your password to the teacher so they can read your chats",
            "Deleting your work if an AI tool helped with any part",
            "Promising never to use any AI tool for any subject",
          ],
          answer: 0,
          explanation: "Disclosure is a short, honest note about AI use, like naming a source. It is not a confession, and honest disclosure within the rules should never be penalised.",
        },
        {
          id: "educator-06-q6",
          audience: { min: "advanced" },
          prompt: "A policy says \"ChatGPT is allowed with disclosure\". A student uses a coding agent that edits their repository and runs commands. What is the main design flaw in the policy?",
          choices: [
            "It allows AI tools at all, which students will abuse",
            "It asks for disclosure, which takes too long for students",
            "It names one product instead of a class of tool and says nothing about agents, which change files and run commands on their own",
            "It does not state a number of points for each AI-assisted task",
          ],
          answer: 2,
          explanation: "Product names go stale and leave gaps. Describing tool classes, and treating agents explicitly, lets the same policy cover tools that did not exist when it was written.",
        },
      ],
      task: {
        title: 'Draft your class policy',
        steps: [
          'Read your school handbook section on academic integrity and any AI guidance.',
          'Run the policy prompt with your subject and level.',
          'Edit the draft so it fits your school rules and sounds like you.',
          'Label your next three assignments as allowed, allowed with disclosure or not allowed.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Draw your three signs (green, yellow, red) in a small table and write one real task from your own class under each. Ask an AI assistant to explain any policy word you are unsure of in everyday language.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Rewrite one line of your policy in terms of tool classes rather than product names and add a line about coding agents. Put the disclosure template into the repository of a sample student project and check that it is easy to fill in.",
          ],
        },
      ],
    },
    {
      id: 'educator-07',
      day: 7,
      title: 'Rubrics that value process',
      summary: 'Build a rubric that rewards planning, testing and explanation, not just the final output.',
      intro: {
        objectives: [
          'List the six criteria of a process rubric and the evidence that shows each one.',
          'Put 40 to 60 percent of a grade on process and explain why.',
          'Rewrite a vague descriptor such as "Shows effort" as something any teacher can check.',
          'Test a rubric by grading an AI attempt with it.',
        ],
        why: 'A rubric that grades only the final output rewards whoever has the best tool. A process rubric tells students what you value and gives you a defensible way to grade work that AI helped with.',
      },
      minutes: 15,
      skills: ['assessment-design', 'ai-policy'],
      body: [
        {
          type: 'paragraph',
          text: "If your rubric only grades the final output, students learn that the output is all that matters, and AI is very good at outputs. A rubric that values process tells students what you actually care about: understanding the problem, making decisions, testing, and being able to explain the work.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **rubric** is a grading table. Each row names something you look for, and the columns describe how well it was done, from excellent to just beginning. **Observable** means you, or another teacher, can see it, such as \"three saved versions with clear notes\", instead of a feeling such as \"tried hard\". **Weight** is how many points a row is worth. **Process** rows, such as plan, drafts, testing and explanation, give credit for how the work was made, not only for the finished product. That is how an honest student who struggled can still do well, and a pasted answer with nothing behind it cannot.",
        },
        { type: 'heading', text: 'Criteria worth grading' },
        {
          type: 'list',
          items: [
            '**Problem understanding:** restates the problem, lists inputs, outputs and constraints.',
            '**Plan:** a design, pseudocode or schema before building.',
            '**Iteration:** evidence of drafts, commits or attempts, including what failed.',
            '**Verification:** tests run, edge cases checked, AI output questioned.',
            '**Explanation:** can explain how and why it works, in writing or live.',
            '**Final product:** works, is readable and meets the requirements.',
          ],
        },
        {
          type: 'paragraph',
          text: "The final product still counts, often the biggest single criterion, but no longer all of it. When process carries 40 to 60 percent of the grade, a pasted answer with no plan, no tests and no explanation cannot score well, while an honest student who struggled visibly can.",
        },
        {
          type: 'code',
          language: 'text',
          label: 'Example weighting for a programming project',
          code: `Criterion               Weight  Excellent (4)                          Developing (2)
Problem understanding   10%     Clear inputs, outputs, constraints     Partly restated
Plan                    15%     Design done before code, followed      Plan written after the fact
Iteration               15%     Several meaningful commits or drafts   One final upload
Verification            20%     Tests for normal and edge cases        Ran it once by hand
Explanation             15%     Explains every part, can modify live   Explains some parts
Final product           25%     Works, readable, meets requirements    Works partly`,
        },
        {
          type: "activity",
          activity: {
            id: "educator-07-match-1",
            kind: "match",
            title: "Which criterion does this evidence show?",
            prompt: "You are grading one student's project with the process rubric. Match each piece of evidence with the criterion it supports.",
            concept: "process rubrics",
            labels: { terms: "Evidence in a submission", meanings: "Rubric criterion" },
            pairs: [
              {
                term: "The README opens by restating the task: the inputs, the expected outputs and the 500-record limit.",
                definition: "Problem understanding",
              },
              {
                term: "An ER diagram dated a week before the first commit, which the final schema follows.",
                definition: "Plan",
              },
              {
                term: "Fourteen commits, including one titled \"Revert: search broke on empty input\".",
                definition: "Iteration",
              },
              {
                term: "A test file covering an empty cart, a negative quantity and a normal order.",
                definition: "Verification",
              },
              {
                term: "In a five-minute walkthrough, the student changes the sort order on request and says why it worked.",
                definition: "Explanation",
              },
              {
                term: "You run the app: every requirement in the brief works, and the code is easy to follow.",
                definition: "Final product",
              },
            ],
            hints: [
              "Ask when each piece of evidence was made: before building, while building, or at the end.",
              "A design made before code is the plan; many commits, including a failure, show iteration.",
              "Tests for edge cases are verification; changing code live and explaining it is explanation.",
            ],
            explanation: "Restating inputs, outputs and limits shows problem understanding, the earlier ER diagram is the plan, the commits and the revert show iteration, edge-case tests show verification, the live change shows explanation, and working requirements are the final product.",
          },
        },
        {
          type: 'prompt',
          label: 'Draft a process rubric',
          text: "Create an analytic rubric for this assignment: [paste assignment]. Learning outcomes: [paste]. Use these criteria: problem understanding, plan, iteration, verification, explanation, final product. Suggest weights that put 40 to 60 percent on process. For each criterion write four performance levels (4 Excellent, 3 Proficient, 2 Developing, 1 Beginning) as observable behaviours a second teacher could grade the same way. Include how AI disclosure fits in, without penalizing honest disclosure.",
        },
        {
          type: 'tip',
          text: "Share the rubric when you give the assignment, not when you return grades. Students who know process is graded will keep their drafts and commits.",
        },
        {
          type: 'paragraph',
          text: "Test the rubric before you use it. Grade one old submission (with names removed) and the AI's attempt from your red-team exercise. If the AI attempt still scores very high with no process evidence, adjust the weights or descriptors until the rubric rewards what you value.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-07-scenario-1",
            kind: "scenario",
            title: "\"Shows effort\"",
            prompt: "How do you fix the descriptor?",
            concept: "observable rubric descriptors",
            situation: "Your draft rubric says \"Shows effort\" under Iteration. Two teachers grade the same submission and give very different marks.",
            options: [
              {
                text: "Keep it and average the two grades.",
                consequence: "The disagreement comes from the descriptor, so averaging hides it.",
                quality: "poor",
              },
              {
                text: "Rewrite it as something anyone can check, such as \"Has at least three commits with clear messages\".",
                consequence: "Any teacher can verify it, so the same work gets the same level.",
                quality: "best",
              },
              {
                text: "Add the word \"significant\" so it sounds stricter.",
                consequence: "It is still a feeling, not something you can count or see.",
                quality: "poor",
              },
            ],
            hints: [
              "Why did the two teachers disagree?",
              "Which words can two people check the same way?",
              "A count of commits is something anyone can see.",
            ],
            explanation: "Make descriptors observable so a second teacher could grade the same way. Share the rubric with the assignment so students keep their drafts and commits.",
          },
        },
        {
          type: 'warning',
          text: "Make descriptors observable. 'Shows effort' is hard to grade fairly. 'Has at least three commits with clear messages' is something any teacher can check.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "A rubric is a measurement instrument, so check reliability and validity. Calibrate: two graders mark the same five anonymised submissions independently, compare, and rewrite any descriptor where they differ by more than one level. Test validity by asking whether a high score is possible without the thing you care about, and run the AI attempt, a minimal-effort submission and a strong honest one through the rubric. Avoid double-counting, such as one bug lowering verification, explanation and final product at once, and score criteria independently. Prefer evidence a script can collect, such as commit history, test results and CI status, for mechanical criteria, and keep human judgment for design reasoning and explanation. Publish the rubric before the task and revise it each term from what you saw.",
        },
        {
          type: "takeaways",
          items: [
            "If a rubric only grades the final output, students learn that the output is all that matters, and AI is good at outputs.",
            "Grade problem understanding, plan, iteration, verification, explanation and final product.",
            "Put 40 to 60 percent of the grade on process.",
            "Write observable descriptors, and share the rubric when you give the assignment.",
            "Test it by grading the AI attempt from your red-team exercise.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-07-q1',
          prompt: 'Why does a final-output-only rubric fit poorly with AI?',
          choices: [
            'AI is very good at producing final outputs, so the rubric mostly measures the tool',
            'Final outputs are not allowed anymore',
            'It takes too long to grade',
          ],
          answer: 0,
          explanation:
            'When only the output counts, a pasted AI answer can score as well as real work. Process criteria restore the balance.',
        },
        {
          id: 'educator-07-q2',
          prompt: 'Which descriptor is the most observable and fair?',
          choices: [
            'Shows great effort',
            'Seems to understand the topic',
            'Has tests for at least one normal case and two edge cases',
            'Work feels original',
          ],
          answer: 2,
          explanation:
            'A specific, checkable behaviour lets different graders reach the same result.',
        },
        {
          id: 'educator-07-q3',
          prompt: 'When should students see the rubric?',
          choices: [
            'Only after grades are released',
            'When the assignment is given',
            'Never; it is for teachers',
            'Only if they ask',
          ],
          answer: 1,
          explanation:
            'Seeing the rubric early tells students to keep process evidence like drafts and commits.',
        },
        {
          id: 'educator-07-q4',
          prompt: 'How can you test whether your rubric values process?',
          choices: [
            'Ask the AI if the rubric is good',
            'Make it longer',
            'Remove the final product criterion',
            'Grade your red-team AI attempt with it and check it cannot score very high without process evidence',
          ],
          answer: 3,
          explanation:
            'If an output-only AI attempt still earns top marks, the weights or descriptors need adjusting.',
        },
        {
          id: "educator-07-q5",
          audience: { max: "beginner" },
          prompt: "Which rubric row is \"observable\", so any teacher could check it?",
          choices: [
            "Shows a good attitude towards the subject",
            "At least three saved versions, each with a note saying what changed",
            "Seems to have worked hard on the project",
            "Appears to understand the problem well",
          ],
          answer: 1,
          explanation: "You can count saved versions and read their notes. Words like attitude, effort and \"appears\" depend on who is looking, so two teachers may grade them differently.",
        },
        {
          id: "educator-07-q6",
          audience: { min: "advanced" },
          prompt: "Two graders differ by two levels on \"Explanation\" for the same submission. What is the best next step?",
          choices: [
            "Average the two marks and move on to the next submission",
            "Remove the criterion because graders cannot agree on it",
            "Let the more senior grader decide every disputed case",
            "Rewrite the descriptors as concrete observable behaviours, then re-calibrate on fresh anonymised work",
          ],
          answer: 3,
          explanation: "A gap of that size means the descriptors can be read in more than one way. Making them observable and checking agreement again improves the instrument itself.",
        },
      ],
      task: {
        title: 'Build and test your rubric',
        steps: [
          'Run the rubric prompt for the assignment you redesigned on day 4.',
          'Rewrite any vague descriptor as an observable behaviour.',
          'Grade the AI attempt from day 4 with it and adjust the weights if needed.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Choose one row of your rubric and ask an AI assistant: \"Turn 'shows effort' into something a teacher can count or see, and give four example descriptors.\" Pick the clearest one and rewrite it in your own words.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Ask a colleague to grade three anonymised submissions with your rubric, compare results and rewrite any descriptor where you differ. Write a short script or command (for example with `git log`) that counts the commits of a student repository for the Iteration row.",
          ],
        },
      ],
    },
    {
      id: 'educator-08',
      day: 8,
      title: 'Teaching AI-assisted programming',
      summary: 'Treat AI as a pair programmer: the student drives, decides and understands every line.',
      intro: {
        objectives: [
          'Explain the model where the student drives and the AI navigates.',
          'Place AI off, AI as tutor and AI as pair in the phases of a term.',
          'Write a tutor-mode prompt that asks for hints and questions, not full solutions.',
          'Teach the pair-session habits: plan first, ask for small pieces, run every line, keep tests and commit often.',
        ],
        why: 'Your graduates will work with AI coding assistants on the job. A clear way to teach them protects the fundamentals while it prepares students for the workplace.',
      },
      minutes: 15,
      skills: ['ai-programming-pedagogy', 'teaching-ai-skills'],
      body: [
        {
          type: 'paragraph',
          text: "Your graduates will likely work with AI coding assistants such as GitHub Copilot, Cursor or Claude Code. Teaching them to use these tools well is now part of teaching programming. The model that works best in class is familiar: **pair programming**, with the student always in charge.",
        },
        { type: 'heading', text: 'The student drives, the AI navigates' },
        {
          type: 'paragraph',
          text: "In classic pair programming the driver types and the navigator reviews and suggests. With AI, the student is the one who decides. The AI suggests, explains and reviews, but nothing goes into the code unless the student understands it and agrees with it. If they cannot explain a line, it does not stay.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**Pair programming** means two people work on one program: the **driver** types and the **navigator** watches and suggests. Here the student drives and the AI navigates. A **tutor-mode prompt** is the first message you give the assistant, telling it to act like a coach who asks questions and gives hints instead of the full answer, like a teacher who says \"what do you think happens next?\". A **test** is a small automatic check that tells you whether the program still gives the right answers after a change. Students run the tests after every change, so a wrong suggestion shows up quickly.",
        },
        { type: 'heading', text: 'Phase it through the term' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**AI off for fundamentals:** variables, loops, functions, first data structures. Students need a base to judge AI output against.',
            '**AI as tutor:** hints, explanations and error messages, but no full solutions.',
            '**AI as pair:** larger tasks where AI drafts and the student plans, reviews, tests and explains.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "educator-08-match-1",
            kind: "match",
            title: "Which phase is the class in?",
            prompt: "Three moments from one programming term. Match each moment with the phase it belongs to.",
            concept: "teaching ai-assisted programming",
            labels: { terms: "Moments in the term", meanings: "Phase" },
            pairs: [
              {
                term: "Week 3 of Programming 1: students write their first while loops with AI tools closed.",
                definition: "AI off for fundamentals",
              },
              {
                term: "Stuck on an error, a student asks the AI what it means and gets a guiding question back, not fixed code.",
                definition: "AI as tutor",
              },
              {
                term: "For the final project, the AI drafts the API endpoints; the student planned them, reviews each one, adds tests and explains them in the demo.",
                definition: "AI as pair",
              },
            ],
            hints: [
              "The phases go from no AI help, to hints only, to drafts the student reviews.",
              "First loops are fundamentals: students need a base before they can judge AI output.",
              "A guiding question instead of a solution is tutoring; drafting code the student plans and reviews is pairing.",
            ],
            explanation: "First loops without AI build the base, a guiding question instead of a solution is AI as tutor, and AI drafting while the student plans, reviews, tests and explains is AI as pair, with the student always driving.",
          },
        },
        {
          type: 'paragraph',
          text: "Give students a tutor-mode prompt they can paste at the start of a session. It sets the rules for the AI and reminds the student what kind of help they are asking for.",
        },
        {
          type: 'prompt',
          label: 'Tutor mode for students',
          text: "Act as my programming tutor for [course]. I am learning [topic]. Do not write the full solution for me. When I am stuck, ask me a guiding question first, then give a hint, and only show a small code example if I ask twice. When I share my code, point out problems and explain why, but let me fix them. Check that I understand by asking me to explain my fix.",
        },
        { type: 'heading', text: 'Pair-session habits to teach' },
        {
          type: 'list',
          items: [
            'Write the plan or pseudocode before asking the AI anything.',
            'Ask for small pieces, never the whole program at once.',
            'Read every suggested line and run it before accepting the next one.',
            'Write or keep tests, and run them after every change.',
            'Commit often with honest messages, including what AI helped with.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "educator-08-scenario-1",
            kind: "scenario",
            title: "The block nobody can explain",
            prompt: "What do you ask of the student?",
            concept: "student as driver",
            situation: "During a pair session a student accepts a large block of AI code they cannot explain, because it passes the sample test.",
            options: [
              {
                text: "Keep it: it passes and the deadline is close.",
                consequence: "Passing one test does not mean they understand it. If they cannot explain a line, it does not stay.",
                quality: "poor",
              },
              {
                text: "Keep it, but add a comment saying that AI wrote it.",
                consequence: "Honest, but not the same as understanding. The student still cannot change or debug it.",
                quality: "poor",
              },
              {
                text: "Have them ask the AI to explain it, then test and explain it in their own words. Anything they still cannot explain is removed.",
                consequence: "The student stays the driver: nothing goes into the code unless they understand it and agree with it.",
                quality: "best",
              },
            ],
            hints: [
              "The student drives; the AI navigates.",
              "What does the lesson say about a line they cannot explain?",
              "Use the AI as a tutor to explain it, and check by explaining it back.",
            ],
            explanation: "Nothing goes into the code unless the student understands it and agrees with it. If they cannot explain a line, it does not stay.",
          },
        },
        {
          type: 'tip',
          text: "Model it live. Project your screen and do a short pair session with an AI assistant in front of the class, including a moment where the AI is wrong and you catch it. Students learn the habit by watching you.",
        },
        {
          type: 'warning',
          text: "Remind students never to paste API keys, passwords or code from an internship or employer into AI tools that the company has not approved. Good habits in school become good habits at work.",
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "You have built small projects, so use one as your demo. Write a failing test, ask the assistant for the smallest change that makes it pass, read the whole change it proposes, run the tests and commit. Seeing a test go red and then green teaches students why tests matter more than the assistant's confidence. Choose a project you know well, so you can spot the wrong turn the moment it happens.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Teach the workflow professionals use around assistants and agents: a written spec or failing test first, small scoped requests, review of every diff, and tests and linters as the arbiter. Teach students to give the tool project context in a repository instructions file; several tools read one, for example Claude Code reads CLAUDE.md and GitHub Copilot reads .github/copilot-instructions.md or AGENTS.md. Have them treat a generated change like a pull request: read it, run it, explain it, and revert what they cannot justify. Assess the loop, not only the output: the test they wrote, the prompt history, the suggestions they rejected and why. Include threat awareness. Generated code can contain insecure patterns or outdated APIs, and an agent that can run commands needs permission boundaries.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Claude Code reads CLAUDE.md files as persistent project instructions and can also read a repository's AGENTS.md files. GitHub Copilot supports repository instructions in .github/copilot-instructions.md and in AGENTS.md files. Tool behaviour changes, so check each tool's documentation for the version you use.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Claude Code: how Claude remembers your project (CLAUDE.md, AGENTS.md)",
              url: "https://code.claude.com/docs/en/memory",
            },
            {
              label: "GitHub Docs: repository custom instructions for Copilot",
              url: "https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Teach AI-assisted programming as pair programming where the student always drives.",
            "Phase it: AI off for fundamentals, AI as tutor, then AI as pair.",
            "Give students a tutor-mode prompt that asks for guiding questions and hints, not full solutions.",
            "Teach habits: plan first, ask for small pieces, read and run every line, keep tests, commit often.",
            "Model it live, including a moment where the AI is wrong.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-08-q1',
          prompt: 'In AI pair programming, who decides what goes into the code?',
          choices: ['The AI assistant', 'The student', 'Whichever suggestion is longest'],
          answer: 1,
          explanation:
            'The student drives. The AI suggests and explains, but only code the student understands and agrees with stays.',
        },
        {
          id: 'educator-08-q2',
          prompt: 'Why keep AI off for the first fundamentals?',
          choices: [
            'AI cannot write simple code',
            'It saves internet data',
            'Students need a base of their own to judge AI output against',
            'Fundamentals are not graded',
          ],
          answer: 2,
          explanation:
            'Without fundamentals, students cannot tell good AI suggestions from bad ones.',
        },
        {
          id: 'educator-08-q3',
          prompt: 'What is the purpose of the tutor-mode prompt?',
          choices: [
            'To make the AI give hints and questions instead of full solutions',
            'To make the AI work faster',
            'To unlock paid features',
            'To hide AI use from the teacher',
          ],
          answer: 0,
          explanation:
            'It sets rules for the AI so the student keeps doing the thinking and learning.',
        },
        {
          id: 'educator-08-q4',
          prompt: 'Which habit best protects a student from accepting wrong AI code?',
          choices: [
            'Asking for the whole program at once',
            'Accepting suggestions quickly to save time',
            'Never committing until the end',
            'Running tests after every change',
          ],
          answer: 3,
          explanation:
            'Tests catch mistakes immediately, before wrong code piles up and becomes hard to trace.',
        },
        {
          id: "educator-08-q5",
          audience: { max: "beginner" },
          prompt: "In AI pair programming, what is a \"tutor-mode prompt\" for?",
          choices: [
            "It tells the assistant to coach with questions and hints instead of handing over the full solution",
            "It makes the assistant type faster so students finish early",
            "It hides the assistant's answers until the teacher approves them",
            "It turns off the tests so the program always passes",
          ],
          answer: 0,
          explanation: "The prompt sets the rules of the session. It keeps the student doing the thinking while still getting help when stuck.",
        },
        {
          id: "educator-08-q6",
          audience: { min: "advanced" },
          prompt: "A student's agent-generated change passes every test but touches twelve files for a one-line request. What should your workflow teach?",
          choices: [
            "Accept it, since passing tests means the change is correct",
            "Review the diff for scope, revert changes the student cannot justify, and narrow the request before trying again",
            "Ask the agent to write more tests until the diff looks smaller",
            "Switch the assistant off for the rest of the term",
          ],
          answer: 1,
          explanation: "Passing tests shows only what the tests cover. Reading the diff and reverting what you cannot explain is the professional habit, and a narrower request keeps agents in scope.",
        },
      ],
      task: {
        title: 'Run a pair session yourself',
        steps: [
          'Paste the tutor-mode prompt into an AI assistant and pretend to be a student stuck on one of your exercises.',
          'Notice whether it follows the rules; tighten the prompt if it gives away the answer.',
          'Write a one-page handout of pair-session habits for your students.',
          'Plan where the three phases fall in your current term.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask an AI assistant: \"What is a test in programming? Explain it with a classroom quiz analogy.\" Then ask it to explain, line by line, one short test from your course and write one sentence of your own about each line.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "Take a small project you have built, write one failing test, ask an assistant for the smallest change that passes it, read the whole change, then run the tests and commit. Note what you would tell students about the moment the test went from red to green.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write a short repository instructions file for a course project (language and tool versions, the test command, house style, and rules such as \"no new dependencies without asking\") and check whether your assistant follows it. Write down one case where it did not.",
          ],
        },
      ],
    },
    {
      id: 'educator-09',
      day: 9,
      title: 'Explain-your-code checks and oral defense',
      summary: 'Short, fair live checks that show whether students understand the code they submit.',
      intro: {
        objectives: [
          'Choose among four quick checks: walkthrough, predict the output, change request and find the bug.',
          'Trace a small function by hand and name the error that an empty list causes.',
          'Plan a fair 10 to 15-minute oral defense with the same questions and rubric for every student.',
          'Protect student data and nervous students when you run these checks.',
        ],
        why: 'A student who can explain and change their code has shown understanding, whether or not AI wrote the first draft. Short live checks give you that evidence in a few minutes.',
      },
      minutes: 15,
      skills: ['ai-programming-pedagogy', 'assessment-design'],
      body: [
        {
          type: 'paragraph',
          text: "The simplest evidence that a student understands their code is that they can explain it and change it. An explain-your-code check takes a few minutes, works whether or not AI was used, and is something employers do in technical interviews anyway.",
        },
        { type: 'heading', text: 'Four quick check formats' },
        {
          type: 'list',
          items: [
            '**Walkthrough:** in three minutes, explain what your program does and why it is built that way.',
            '**Predict the output:** what will this function return for this input?',
            '**Change request:** make it handle an empty list, or add one feature, live.',
            '**Find the bug:** here is your code with one line changed. What broke?',
          ],
        },
        {
          type: 'paragraph',
          text: "You can run these in a lab while others work, two or three students at a time. You do not need to check everyone on every assignment. Random, announced checks keep everyone prepared.",
        },
        {
          type: 'code',
          language: 'python',
          label: 'A predict-the-output check',
          code: `def average(scores):
    total = 0
    for s in scores:
        total += s
    return total / len(scores)


print(average([85, 90, 78]))
print(average([]))`,
        },
        {
          type: 'paragraph',
          text: "Ask: what does the first line print, what happens on the second, and how would you fix it? A student who understands sees that the second call divides by zero and raises `ZeroDivisionError`, and can suggest returning `0` or raising a clearer error for an empty list.",
        },
        {
          type: 'paragraph',
          text: "Tracing the first line by hand takes seconds: 85 + 90 + 78 is 253. In Python `/` is true division, so it keeps the decimals, and 253 / 3 prints `84.33333333333333`, not a rounded or whole number. A student who can do this on paper is reading their code, not guessing. For the empty list, the fix has to come before the division, for example `return total / len(scores) if scores else 0`.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Explaining code is like explaining a recipe you cooked yourself: if you made it, you can say why you added the salt and what happens if you leave it out. **Predict the output** means reading the code and saying what it will print before running it. A **live change request** asks the student to alter their own program while you watch. In the average example above, the empty list has no scores, so the program tries to divide by zero. That is not allowed in maths, so Python stops with an error called `ZeroDivisionError`. A student who understands their code can say this without running it.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-09-predict-output-1",
            kind: "predict-output",
            title: "Predict the output",
            prompt: "This is the predict-the-output check from the lesson. What does the first print show?",
            concept: "explain-your-code checks",
            language: "python",
            code: "def average(scores):\n    total = 0\n    for s in scores:\n        total += s\n    return total / len(scores)\n\nprint(average([85, 90, 78]))",
            expected: "84.33333333333333",
            choices: ["84.33333333333333", "84", "253", "84.3"],
            wrongNotes: {
              "84": "In Python `/` is true division, not whole-number division, so the decimals stay.",
              "253": "253 is the total. The function divides it by the number of scores before returning.",
              "84.3": "Python prints the full value, not a rounded one, because nothing rounds it.",
            },
            hints: [
              "Add the three scores first.",
              "Then divide by how many scores there are.",
              "`/` in Python is true division, so the result keeps its decimals.",
            ],
            explanation: "85 + 90 + 78 = 253, and 253 / 3 is 84.33333333333333. The question is a quick way to see whether a student can read their own code.",
          },
        },
        {
          type: "activity",
          activity: {
            id: "educator-09-fix-bug-1",
            kind: "fix-bug",
            title: "The empty list",
            prompt: "The second call in the lesson, `average([])`, crashes with ZeroDivisionError. Find the line, then pick a fix that returns 0 for an empty list.",
            concept: "change requests in code checks",
            language: "python",
            code: "def average(scores):\n    total = 0\n    for s in scores:\n        total += s\n    return total / len(scores)\n\nprint(average([]))",
            bugLine: 5,
            fixes: [
              {
                line: "return total / len(scores) if scores else 0",
                correct: true,
                why: "Yes. For an empty list it returns 0 instead of dividing by zero.",
              },
              {
                line: "return total // len(scores)",
                correct: false,
                why: "Whole-number division still divides by zero for an empty list, and it would also change normal averages.",
              },
              {
                line: "return total / (len(scores) + 1)",
                correct: false,
                why: "It avoids the crash, but gives wrong averages for every normal list.",
              },
            ],
            lineNote: "That line is fine. The crash comes from the line that divides.",
            hints: [
              "Which line divides by the number of scores?",
              "What is `len([])`?",
              "Check whether the list is empty before dividing.",
            ],
            explanation: "An empty list has length 0, so dividing by it raises `ZeroDivisionError`. Returning 0 (or raising a clearer error) is a fix a student who understands the code can suggest on the spot.",
          },
        },
        { type: 'heading', text: 'Oral defense for bigger projects' },
        {
          type: 'paragraph',
          text: "For a final project, a 10 to 15-minute defense works well: a short demo, two or three questions about design decisions, one live change and one question about testing. Use the same question bank and rubric for every student, and take short notes so your decision is documented.",
        },
        {
          type: 'prompt',
          label: 'Defense questions from code',
          text: "Here is a student project's code with all names and identifying details removed: [paste code]. Write 8 oral defense questions for a [level] student: 3 about design decisions, 2 predict-the-output questions with the expected answers, 2 small live change requests, and 1 about testing. Keep each question answerable in under two minutes.",
        },
        {
          type: 'warning',
          text: "Only paste student code into AI tools your school approves, with names, ID numbers and comments that identify the student removed first. Day 15 covers this in detail.",
        },
        {
          type: 'tip',
          text: "Be kind to nervous students. Let them look at their code, think aloud and use their notes. You are checking understanding, not memory or confidence under pressure. Offer a written alternative where a student has a documented accommodation.",
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Because you have built small projects, you can make a find-the-bug check yourself in minutes. Copy a working submission and plant one realistic mistake, such as an off-by-one in a loop bound or a missing guard for empty input. Run it and write down the exact input that fails. That failing input is your answer key. Keep both versions, so you can reuse the check with the next class.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Design checks as an instrument. Draw questions from a bank keyed to outcomes, vary parameters so prepared answers do not transfer, and give every student the same questions and a short rubric, recording evidence at the time. Prefer tasks that need the student's own artefact: modify it live, trace a failing test, justify a design alternative. Time-box, and offer documented accommodations such as a written or recorded alternative. Sample rather than examine everyone every time, but announce that the sampling is random. Decide in advance what a failed check triggers: a retry with different questions, not a sanction, with any formal step going through the school process on corroborating evidence. To scale, use two examiners, a shared bank and rotating pairs, and log results to see which outcomes students cannot explain.",
        },
        {
          type: "takeaways",
          items: [
            "The simplest evidence a student understands their code is that they can explain it and change it.",
            "Four quick checks: walkthrough, predict the output, change request, find the bug.",
            "Run short, announced, random checks; you do not need to check everyone on every assignment.",
            "For a final project, use a 10 to 15-minute defense with the same questions and rubric for everyone.",
            "Be kind to nervous students and offer a written alternative where there is a documented accommodation.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-09-q1',
          prompt: 'What happens when `average([])` runs in the example?',
          choices: [
            'It returns 0',
            'It returns None',
            'It raises ZeroDivisionError',
            'It prints an empty line',
          ],
          answer: 2,
          explanation:
            '`len([])` is 0, so `total / len(scores)` divides by zero and Python raises `ZeroDivisionError`.',
        },
        {
          id: 'educator-09-q2',
          prompt: 'Why is a live change request strong evidence of understanding?',
          choices: [
            'Changing code correctly requires knowing how it works',
            'It is faster than reading the code',
            'AI tools cannot run during class',
          ],
          answer: 0,
          explanation:
            'A student who only pasted the code usually struggles to modify it correctly, while one who wrote it can.',
        },
        {
          id: 'educator-09-q3',
          prompt: 'What makes an oral defense fair across students?',
          choices: [
            'Asking each student completely different questions',
            'Grading on confidence',
            'Keeping no notes',
            'The same question bank, the same rubric and short notes for each student',
          ],
          answer: 3,
          explanation:
            'Consistent questions, criteria and documentation make results comparable and defensible.',
        },
        {
          id: 'educator-09-q4',
          prompt: 'Before pasting student code into an AI tool to generate questions, you should:',
          choices: [
            'Add the student’s full name so the AI can personalize',
            'Remove identifying details and use only a school-approved tool',
            'Post it publicly first',
            'Nothing; code is never personal data',
          ],
          answer: 1,
          explanation:
            'Code can contain names, ID numbers and comments that identify a student. Remove them and use approved tools only.',
        },
        {
          id: "educator-09-q5",
          audience: { max: "beginner" },
          prompt: "What is a \"live change request\" in an explain-your-code check?",
          choices: [
            "The student emails you a new version of the program later",
            "You change the student's program while they watch",
            "The student changes their own program while you watch, for example to handle an empty list",
            "The class votes on which change the student should make",
          ],
          answer: 2,
          explanation: "A live change shows whether the student understands their own code well enough to alter it. Someone who wrote it can usually do it calmly; someone who pasted it often cannot.",
        },
        {
          id: "educator-09-q6",
          audience: { min: "advanced" },
          prompt: "A student fails a short explain-your-code check on their own project. Which next step fits the design?",
          choices: [
            "Offer a retry with different questions, and if concerns remain, gather other evidence and follow the school process",
            "Record a zero for the project straight away",
            "Add the student's name to a list of suspected cheaters",
            "Repeat the identical questions until they are answered correctly",
          ],
          answer: 0,
          explanation: "One short check is a reason to look closer, and nerves are real. A retry on different questions, then corroborating evidence and the school process, keeps the decision fair and defensible.",
        },
      ],
      task: {
        title: 'Prepare one explain-your-code check',
        steps: [
          'Pick a small exercise your students submitted recently.',
          'Write one predict-the-output question and one live change request for it.',
          'Draft a five-line rubric for a three-minute walkthrough.',
          'Decide which week you will run the first checks and announce them in advance.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Look at the average function and, in your own words, write what each line does and what happens with an empty list. Then ask an AI assistant to check your explanation and tell you which parts you missed.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "Plant one realistic bug in a small working program you have written, run it, and write the exact failing input as your answer key. Ask a colleague to find the bug in under three minutes and time them.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Build a bank of twelve questions keyed to your outcomes, each with a parameterised variant. Pilot the checks with three students and record which outcome the most students could not explain.",
          ],
        },
      ],
    },
    {
      id: 'educator-10',
      day: 10,
      title: 'Teaching students to prompt',
      summary: 'Prompting is specification writing; teach it with a simple pattern and a makeover activity.',
      intro: {
        objectives: [
          'Explain why prompting is specification writing.',
          'Use the five-part pattern: context, task, constraints, format and check.',
          'Run a prompt makeover activity and teach students to follow up and iterate.',
          'Explain why students should submit their main prompts.',
        ],
        why: 'Students who prompt well also write clearer requirements and bug reports, which employers already want. A simple pattern helps them get better answers and shows you where they misunderstand the task.',
      },
      minutes: 15,
      skills: ['teaching-ai-skills'],
      body: [
        {
          type: 'paragraph',
          text: "Prompting is not a trick. It is clear communication: saying what you want, for whom, with what limits and in what form. That is the same skill as writing good requirements, a bug report or a client brief, so teaching it strengthens skills your course already values.",
        },
        { type: 'heading', text: 'A simple pattern students can remember' },
        {
          type: 'list',
          items: [
            '**Context:** who I am and what I am working on.',
            '**Task:** exactly what I want done.',
            '**Constraints:** language, version, rules, what not to do.',
            '**Format:** how I want the answer shaped.',
            '**Check:** ask the AI to state assumptions or uncertainties.',
          ],
        },
        {
          type: 'paragraph',
          text: "Show the difference with a before-and-after. A weak prompt: 'make a login page'. A stronger one names the stack, the fields, the validation rules, what to leave out and asks for an explanation of each part. The second answer is more useful and easier to check.",
        },
        {
          type: 'prompt',
          label: 'Student prompt template',
          text: "Context: I am a [year] [course] student working on [project]. Task: [what you want, e.g. explain why my query returns duplicate rows]. Constraints: [e.g. use MySQL, do not rewrite my whole query, explain in simple English]. Format: [e.g. a short explanation, then the corrected line]. Check: list any assumptions you made and anything I should test.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **prompt** is the message you give the assistant. A clear prompt works like a clear note to a taxi driver: where you are, where you are going and what to avoid. The five-part pattern is a checklist for that note. **Context** is who you are and what you are working on. **Task** is what you want. **Constraints** are the rules, such as \"use only what we learned this week\". **Format** is how the answer should look. **Check** asks the assistant to say what it assumed. The assistant cannot see your classroom, so anything you leave out, it has to guess.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-10-match-1",
            kind: "match",
            title: "Find the pattern in a student's prompt",
            prompt: "A student wrote this prompt for help with her Java project. Match each line with the part of the pattern it supplies.",
            concept: "prompt pattern for students",
            labels: { terms: "Lines from a student's prompt", meanings: "Part of the pattern" },
            pairs: [
              {
                term: "I am a second-year BSCS student building an inventory app in Java for our OOP class.",
                definition: "Context",
              },
              {
                term: "Explain why my program throws ConcurrentModificationException when I remove items from an ArrayList inside a for-each loop.",
                definition: "Task",
              },
              {
                term: "Use Java 17, no external libraries, and do not rewrite my whole class.",
                definition: "Constraints",
              },
              {
                term: "Give me two sentences of explanation, then only the lines I need to change.",
                definition: "Format",
              },
              {
                term: "Tell me what you assumed about my code and what I should test after the fix.",
                definition: "Check",
              },
            ],
            hints: [
              "Ask of each line: is it about who is asking, what to do, the limits, the shape of the answer, or what the AI is unsure of?",
              "Versions, libraries and \"do not rewrite\" are limits; \"two sentences, then the lines\" is a shape.",
              "Asking the AI to state its assumptions is the part that prepares the student to check the answer.",
            ],
            explanation: "Her year, course and project are context, the exception question is the task, Java 17 and no rewrite are constraints, two sentences then the changed lines is the format, and asking for assumptions and tests is the check.",
          },
        },
        { type: 'heading', text: 'Classroom activity: prompt makeover' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Give pairs a weak prompt and the poor answer it produced.',
            'They rewrite the prompt using the pattern and run it.',
            'They compare both answers and note what changed.',
            'Two or three pairs share; the class picks what made the biggest difference.',
          ],
        },
        {
          type: 'paragraph',
          text: "Also teach iteration. A first prompt is rarely the last. Students should learn to follow up: 'that uses a library I cannot install, use only the standard library', or 'explain step 3 more slowly'. Treat the conversation as a draft that improves.",
        },
        {
          type: 'tip',
          text: "Connect prompting to work they already know. A good prompt for an AI assistant looks a lot like a good ticket for a teammate or a clear message to a client on OnlineJobs.ph: what is needed, why, what done looks like and what to avoid. Students who learn to write one learn to write the other.",
        },
        {
          type: 'tip',
          text: "Ask students to submit their main prompts with disclosed AI work. Reading prompts shows you how they think about the problem, and weak prompts often reveal misunderstanding you can address in class.",
        },
        {
          type: 'warning',
          text: "A better prompt gives a better answer, not a correct one. Every prompting lesson should end with checking the output, which is the next lesson.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "For students with software experience, frame a prompt as a specification with acceptance criteria: inputs, outputs, error cases, style limits and an executable test the result must pass. Teach context engineering at student scale: which files, error output and conventions the tool needs, and what to leave out so irrelevant text does not dilute the request. Teach decomposition into small requests with checks between them, iteration from a failing test rather than blind rewording, and starting a fresh conversation when earlier turns keep steering the answer. Have students keep a prompt log and assess it: did they state constraints, give an example, ask for assumptions and verify the result? Treat prompt injection as part of the syllabus: instructions hidden in pasted pages or files can steer a tool, so untrusted text deserves the suspicion you give untrusted input.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "OWASP lists Prompt Injection as LLM01:2025 in its Top 10 for LLM Applications 2025.",
          checked: "2026-11-14",
          sources: [
            {
              label: "OWASP Top 10 for LLM Applications 2025",
              url: "https://genai.owasp.org/llm-top-10/",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Prompting is clear communication, the same skill as good requirements, a bug report or a client brief.",
            "A simple pattern: context, task, constraints, format, check.",
            "Run a prompt makeover: pairs rewrite a weak prompt, compare the answers and share what changed.",
            "Teach iteration: follow up and steer; the conversation is a draft.",
            "A better prompt gives a better answer, not a correct one: always check the output.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-10-q1',
          prompt: 'Why is prompting a useful skill to teach in a tech course?',
          choices: [
            'It is clear specification writing, like requirements and bug reports',
            'It replaces the need to learn programming',
            'It guarantees correct answers',
          ],
          answer: 0,
          explanation:
            'Good prompts need the same clarity as good requirements, which is a core professional skill.',
        },
        {
          id: 'educator-10-q2',
          prompt: 'Which part of the pattern asks the AI to state assumptions?',
          choices: ['Context', 'Format', 'Task', 'Check'],
          answer: 3,
          explanation:
            'The Check part asks for assumptions and uncertainties, which tells the student what to verify.',
        },
        {
          id: 'educator-10-q3',
          prompt: 'What does the prompt makeover activity mainly teach?',
          choices: [
            'How to type faster',
            'How specific context and constraints change the quality of an answer',
            'Which AI tool is the best',
            'How to avoid checking answers',
          ],
          answer: 1,
          explanation:
            'Comparing weak and strong prompts side by side shows students what specificity does.',
        },
        {
          id: 'educator-10-q4',
          prompt: 'Why ask students to submit their main prompts?',
          choices: [
            'To grade their spelling',
            'To catch them using AI',
            'Prompts show how they think about the problem and reveal misunderstandings',
            'Because AI tools require it',
          ],
          answer: 2,
          explanation:
            'A prompt is a window into the student’s understanding of the task, which helps you teach.',
        },
        {
          id: "educator-10-q5",
          audience: { max: "beginner" },
          prompt: "In the five-part prompt pattern, what is a \"constraint\"?",
          choices: [
            "The assistant's own list of things it refuses to do",
            "A rule or limit for the answer, such as \"use only what we learned this week\"",
            "The maximum number of words the student may type",
            "A mistake the assistant made in its last answer",
          ],
          answer: 1,
          explanation: "Constraints are the limits you set so the answer fits your class: tools, versions, topics to leave out. Without them the assistant fills the gaps with guesses.",
        },
        {
          id: "educator-10-q6",
          audience: { min: "advanced" },
          prompt: "A student's prompt keeps producing code that fails, and they reword it each time. Which technique should you teach instead?",
          choices: [
            "Add more polite words and capital letters to the request",
            "Ask for the entire program again from the beginning each time",
            "Give up on the tool and write the code by hand",
            "Run it, give the tool the failing test or error output and the expected behaviour, and iterate from that evidence",
          ],
          answer: 3,
          explanation: "Rewording without new information changes little. A failing test or error message is evidence the tool can use, and it ties the iteration to a check rather than a feeling.",
        },
      ],
      task: {
        title: 'Build a prompt makeover activity',
        steps: [
          'Write one weak prompt related to your current topic and run it.',
          'Rewrite it with the five-part pattern and run it again.',
          'Save both prompts and answers as the activity handout.',
          'Add the student prompt template to your class materials.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write a note to the assistant as if it were a taxi driver: where you are, where you are going and what to avoid. Compare your note with the five-part pattern and mark which part each sentence covers.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Take your prompt from the makeover and rewrite it as a specification with three acceptance criteria and a small test the answer must pass. Run both versions, compare the answers, and keep a prompt log with one line on what changed each time.",
          ],
        },
      ],
    },
    {
      id: 'educator-11',
      day: 11,
      title: 'Teaching students to verify AI output',
      summary: 'Make checking a habit: run it, test it, look it up, and question confident answers.',
      intro: {
        objectives: [
          'Name the typical mistakes AI makes in technical work.',
          'Spot a SQL query built from user text and replace it with a parameterized query.',
          'Match each kind of AI mistake to the check on the six-step student checklist that catches it.',
          'Explain why asking the AI "are you sure?" is not verification.',
        ],
        why: 'AI sounds just as confident when it is wrong, so checking is the skill that separates a professional from someone who copies. Your students need that habit before their first job or OJT.',
      },
      minutes: 15,
      skills: ['teaching-ai-skills', 'ai-programming-pedagogy'],
      body: [
        {
          type: 'paragraph',
          text: "AI answers sound confident whether they are right or wrong. That is the single most important thing your students need to learn about these tools. Verification is what separates a professional who uses AI from a student who copies it.",
        },
        { type: 'heading', text: 'What AI gets wrong in tech' },
        {
          type: 'list',
          items: [
            'Functions, options or libraries that do not exist.',
            'Code written for an older version of a library or framework.',
            'Insecure patterns, such as building SQL from user input.',
            'Citations and links that look real but lead nowhere.',
            'Code that works for the example and fails on edge cases.',
          ],
        },
        {
          type: 'paragraph',
          text: "Show a real example. The code below finds a student by name. AI tools sometimes suggest the commented-out version, which builds the query from user text and is open to SQL injection. The parameterized version is the safe habit to teach.",
        },
        {
          type: 'code',
          language: 'python',
          label: 'Unsafe versus safe query',
          code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT)")
conn.execute("INSERT INTO students (name) VALUES (?)", ("Ana",))

name = input("Name to find: ")

# Unsafe: builds SQL from user text (a pattern AI tools sometimes suggest)
# rows = conn.execute(f"SELECT * FROM students WHERE name = '{name}'").fetchall()

# Safe: a parameterized query
rows = conn.execute("SELECT * FROM students WHERE name = ?", (name,)).fetchall()
print(rows)`,
        },
        {
          type: 'paragraph',
          text: "The safe version puts a placeholder, here `?`, in the SQL and passes the value separately, so the database treats the text only as data. Joining the text into the query with `+` or an f-string is the same mistake. Changing the text first, for example with `.lower()`, does not help either, because it is still pasted into the SQL.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "AI writes in a confident tone whether it is right or wrong, like a classmate who always sounds sure. To **verify** means to check with something other than the AI: run the code, read the official documentation, try unusual inputs. An **edge case** is an unusual input such as an empty list or zero. **SQL injection** is what happens when text typed by a user is glued into a database command, so the text can change the command itself. The safe version above uses the placeholder `?`: the database treats the typed text as plain data, like a name written in a form box rather than an instruction to the clerk.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-11-fix-bug-1",
            kind: "fix-bug",
            title: "Unsafe query",
            prompt: "This AI-suggested function finds a student by name. Find the line with the security bug, then pick the safe version.",
            concept: "sql injection",
            language: "python",
            code: "import sqlite3\n\nconn = sqlite3.connect(\":memory:\")\n\ndef find_student(name):\n    return conn.execute(f\"SELECT * FROM students WHERE name = '{name}'\").fetchall()",
            bugLine: 6,
            fixes: [
              {
                line: "return conn.execute(\"SELECT * FROM students WHERE name = ?\", (name,)).fetchall()",
                correct: true,
                why: "Yes. A parameterized query keeps the user's text separate from the SQL, so it cannot change the query.",
              },
              {
                line: "return conn.execute(\"SELECT * FROM students WHERE name = '\" + name + \"'\").fetchall()",
                correct: false,
                why: "Joining strings with + is the same mistake as the f-string: user text becomes part of the SQL.",
              },
              {
                line: "return conn.execute(f\"SELECT * FROM students WHERE name = '{name.lower()}'\").fetchall()",
                correct: false,
                why: "Changing the case does nothing about quotes or SQL fragments. The text is still pasted into the query.",
              },
            ],
            lineNote: "That line is fine. The risk is in the line that builds the query.",
            hints: [
              "Look for the line that builds the SQL from the user's text.",
              "Anything that glues `name` into the query string is a risk.",
              "Use a placeholder in the SQL and pass the value separately.",
            ],
            explanation: "Building SQL from user text lets the input change the query. The parameterized version is the safe habit to teach.",
          },
        },
        { type: 'heading', text: 'A verification checklist for students' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Run it.** Does it actually work?',
            '**Test the edges.** Empty input, zero, very large values, wrong types.',
            '**Check the docs.** Does that function exist in the version we use?',
            '**Check security.** Any user input going straight into a query, command or page?',
            '**Check sources.** Does each citation or link exist and say what the AI claims?',
            '**Explain it.** Can I explain every line in my own words?',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "educator-11-match-1",
            kind: "match",
            title: "Which check catches it?",
            prompt: "Match each kind of AI mistake to the check on the student checklist that catches it.",
            concept: "verification habits",
            pairs: [
              {
                term: "A function or library option that does not exist",
                definition: "Check the docs: does it exist in the version we use?",
              },
              {
                term: "SQL built from user input",
                definition: "Check security: does user input go straight into a query, command or page?",
              },
              {
                term: "A citation or link that leads nowhere",
                definition: "Check sources: does each citation or link exist and say what the AI claims?",
              },
              {
                term: "Code that works for the example but fails on edge cases",
                definition: "Test the edges: empty input, zero, very large values, wrong types",
              },
            ],
            hints: [
              "Think about which of the six checks could reveal each one.",
              "Some mistakes only show when you look up the official documentation.",
              "A link that leads nowhere has to be opened.",
            ],
            explanation: "Each check targets a typical mistake. Students who run them learn that checking is worth it, which is what separates a professional from someone who copies.",
          },
        },
        {
          type: 'prompt',
          label: 'Make a spot-the-error exercise',
          text: "Write a short [language] solution to this exercise: [exercise]. Plant exactly two realistic mistakes that an AI assistant might make: one logic error that only shows on an edge case and one security or outdated-API problem. Then give me, separately, an answer key that explains each mistake and the fix.",
        },
        {
          type: 'paragraph',
          text: "Use the planted-error exercise in class. Students who find both mistakes learn that checking is worth it. Students who miss them learn it even more. Run the answer key yourself before class, since the AI can be wrong about its own planted mistakes too.",
        },
        {
          type: 'tip',
          text: "Grade verification, not just correctness. A student who submits a wrong answer but documents good tests that found a problem they could not yet fix is showing exactly the habit you want.",
        },
        {
          type: 'warning',
          text: "Asking the same AI 'are you sure?' is not verification. It may agree with itself or change a correct answer. Real checks come from running code, tests and official documentation.",
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Since you have built small projects, try this on one of yours. Ask the assistant for a function, then write three tests before you read its code: a normal case, an empty input and a wrong type. Run them. When one fails, you have found something that a sure-sounding answer hid. That small experience is exactly the one to give your students, and it is more convincing than any warning from you.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Teach verification as layers with different strengths: static (linters, type checkers, dependency audits), dynamic (tests, including edge cases and property-based ones) and review against the documentation of the exact version in use. Add the supply-chain habit: confirm that a suggested package exists, is the intended project and is maintained before installing it. Name the risk classes students will meet: OWASP's Top 10 for LLM Applications lists Improper Output Handling and Misinformation, and the ordinary OWASP Top 10 still applies to the application code an assistant generates. Ask for a verification log: what was run, what failed, what changed. A planted-error exercise works at this level with subtler faults, such as an authorisation check enforced only in the interface, a timing assumption or a deprecated API.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "OWASP's Top 10 for LLM Applications 2025 lists LLM05:2025 Improper Output Handling and LLM09:2025 Misinformation among its ten entries.",
          checked: "2026-11-14",
          sources: [
            {
              label: "OWASP Top 10 for LLM Applications 2025",
              url: "https://genai.owasp.org/llm-top-10/",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "AI answers sound confident whether right or wrong: verification is the habit to teach.",
            "Typical mistakes: functions that do not exist, old library versions, insecure patterns, fake citations, edge-case failures.",
            "Student checklist: run it, test the edges, check the docs, check security, check sources, explain it.",
            "Use planted-error exercises, and run the answer key yourself first.",
            "Asking the AI \"are you sure?\" is not verification.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-11-q1',
          prompt: 'Why is the commented-out f-string query in the example unsafe?',
          choices: [
            'It is slower than the parameterized version',
            'It builds SQL from user text, which allows SQL injection',
            'f-strings do not work with sqlite3',
          ],
          answer: 1,
          explanation:
            'Putting user input directly into SQL lets crafted input change the query. Parameters keep data separate from the SQL.',
        },
        {
          id: 'educator-11-q2',
          prompt: 'Which is real verification of AI-generated code?',
          choices: [
            'Asking the AI "are you sure?"',
            'Checking that it looks professional',
            'Counting the lines',
            'Running it with tests that include edge cases',
          ],
          answer: 3,
          explanation:
            'Running code with edge-case tests gives evidence. Asking the AI again does not.',
        },
        {
          id: 'educator-11-q3',
          prompt: 'An AI answer uses a function you cannot find in the library docs. What is most likely?',
          choices: [
            'The function may not exist or may be from a different version',
            'The docs are always out of date',
            'The function is secret',
            'It will work anyway',
          ],
          answer: 0,
          explanation:
            'AI tools often invent functions or mix versions. The official docs for your version decide.',
        },
        {
          id: 'educator-11-q4',
          prompt: 'Why grade verification and not only correctness?',
          choices: [
            'Because correctness does not matter',
            'To make grading faster',
            'It rewards the checking habit students need when using AI',
            'Because AI answers are always correct',
          ],
          answer: 2,
          explanation:
            'Verification is the key professional habit with AI. Grading it tells students it matters.',
        },
        {
          id: "educator-11-q5",
          audience: { max: "beginner" },
          prompt: "In plain words, what does it mean to \"verify\" an AI answer?",
          choices: [
            "Ask the same AI whether it is sure about its answer",
            "Read the answer twice and see whether it sounds right",
            "Check it with something other than the AI, such as running the code or reading the official documentation",
            "Copy it into a document and send it to a classmate",
          ],
          answer: 2,
          explanation: "AI sounds just as confident when it is wrong, so tone proves nothing. Running the code, testing edge cases and reading the official source give real evidence.",
        },
        {
          id: "educator-11-q6",
          audience: { min: "advanced" },
          prompt: "An assistant adds a package you have never heard of to a student project. What should the verification routine include?",
          choices: [
            "Confirm on the official registry that it exists, is the intended project and is maintained, before installing it",
            "Install it first and uninstall it if the program breaks",
            "Trust it because the assistant chose the name itself",
            "Check only that the package name is spelled the way the assistant wrote it",
          ],
          answer: 0,
          explanation: "Suggested package names can be wrong or point to something unintended. Checking the registry, the project and its maintenance before installing is a basic supply-chain habit.",
        },
      ],
      task: {
        title: 'Create a spot-the-error exercise',
        steps: [
          'Run the planted-error prompt for an exercise from your course.',
          'Find the two mistakes yourself before reading the answer key.',
          'Run the code to confirm the answer key is correct.',
          'Turn the verification checklist into a one-page handout.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask an AI assistant: \"What is SQL injection? Explain it with a restaurant order slip analogy.\" Then explain in your own words why the `?` placeholder in the safe example makes the database treat the typed text as data.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "Ask an assistant for a small function, write three tests (normal, empty and wrong type) before reading its code, and run them. Write down what each test showed and what you would tell students about it.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Plant a subtler fault in a short program: an authorisation check enforced only in the interface, or a deprecated call. Ask a colleague to review it using a verification log, and note which layer (static, dynamic or documentation review) caught it.",
          ],
        },
      ],
    },
    {
      id: 'educator-12',
      day: 12,
      title: 'Feedback at scale, with you in charge',
      summary: 'Let AI draft rubric-based comments while you review, edit and decide every grade.',
      intro: {
        objectives: [
          'Follow the five-step workflow for AI-drafted feedback, with you reviewing every comment.',
          'Ask the AI to quote the part of the submission it comments on, so invented problems show up.',
          'Recognize feedback that is specific, actionable, kind and brief.',
          'Explain why the grade is always your decision.',
        ],
        why: 'With 40 or more students in a section, detailed feedback takes hours. AI can draft it faster, but only if you stay in charge of accuracy, fairness and the final grade.',
      },
      minutes: 15,
      skills: ['ai-prep', 'assessment-design', 'responsible-ai'],
      body: [
        {
          type: 'paragraph',
          text: "Good feedback is one of the most powerful things you give students, and one of the most time-consuming. With 40 or more students per section, detailed comments on every submission are hard. AI can help you draft feedback faster, as long as you stay the one who reads, edits and decides.",
        },
        { type: 'heading', text: 'A safe workflow' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**You write the rubric** and a few example comments in your own voice.',
            '**You remove identifiers:** names, ID numbers, emails, anything that identifies the student.',
            '**AI drafts comments** against the rubric, using only a school-approved tool.',
            '**You review every comment,** fix errors, add what only you know about the student.',
            '**You decide the grade.** AI never assigns a final mark.',
          ],
        },
        {
          type: 'prompt',
          label: 'Draft rubric-based feedback',
          text: "You are helping a teacher draft feedback. Rubric: [paste rubric]. Example comments in my voice: [paste two or three]. Student submission (anonymized): [paste]. For each rubric criterion, write: one specific strength, one specific improvement with a concrete next step, and a suggested level with a one-sentence reason. Quote the exact part of the submission you refer to. Do not invent problems that are not in the text. Keep it encouraging and under 200 words. I will review and decide the final grade.",
        },
        {
          type: 'paragraph',
          text: "Asking the AI to quote the exact part it refers to makes checking fast. If a comment points to something that is not in the submission, you know immediately that the AI invented it. This happens, so read every comment before it reaches a student.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-12-scenario-1",
            kind: "scenario",
            title: "The function that is not there",
            prompt: "What do you do?",
            concept: "reviewing ai feedback",
            situation: "The AI drafts a comment: \"Your calculate_total function does not handle discounts.\" You search the submission and there is no calculate_total function.",
            options: [
              {
                text: "Send it anyway; the student can say if it is wrong.",
                consequence: "The student gets feedback about code they never wrote, and trust in your feedback drops.",
                quality: "poor",
              },
              {
                text: "Delete the comment: the AI invented it. Then check every other comment against the submission before it reaches a student.",
                consequence: "Asking the AI to quote the exact part makes this check fast. You read every comment before it goes out.",
                quality: "best",
              },
              {
                text: "Ask the AI to turn it into a question and send that.",
                consequence: "A question about code that does not exist is just as confusing for the student.",
                quality: "poor",
              },
            ],
            hints: [
              "Does the submission contain what the comment refers to?",
              "This happens, so read every comment before it reaches a student.",
              "You stay the one who reads, edits and decides.",
            ],
            explanation: "AI can invent problems that are not in the text. Quote requirements make that visible, and you decide every grade.",
          },
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**Feedback** means the comments you give on a student's work. An AI can draft those comments from your rubric in seconds, like a teaching assistant who writes first drafts that you always read and change. To **anonymize** means to remove anything that identifies the student, like covering the name on an exam paper before another teacher marks it. **Quote the exact part** means the AI must point to the words or lines it is talking about, so you can check each comment in seconds. If a comment points to something that is not there, the AI made it up. The grade always stays with you.",
        },
        { type: 'heading', text: 'What good feedback looks like' },
        {
          type: 'list',
          items: [
            '**Specific:** names the function, query or paragraph.',
            '**Actionable:** says what to do next, not only what was wrong.',
            '**Kind:** firm about problems, respectful about the person.',
            '**Brief:** two or three priorities beat ten small notes.',
          ],
        },
        {
          type: 'tip',
          text: "Build a comment bank. As you edit AI drafts, save the comments you like best by rubric criterion. Over a term you will have a bank in your own voice that you can reuse with or without AI.",
        },
        {
          type: 'warning',
          text: "AI can be inconsistent: two similar submissions may get different suggested levels, and it may judge writing style unfairly. That is why the grade is always your decision. If your school requires disclosure of AI-assisted feedback, tell students how you use it.",
        },
        {
          type: 'paragraph',
          text: "Use the time you save for the feedback only you can give: a quick word in the lab, a note to a student who is falling behind, or a follow-up with someone who improved. AI handles the first draft; you handle the relationship.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat model-assisted feedback as a pipeline with controls. Fix the rubric and examples in the prompt or an instructions file, and record the model and settings you used so a student query can be answered. Audit by sampling: grade a random sample by hand each batch and compare, and test consistency by submitting the same anonymised work twice, plus near-duplicates, to see whether suggestions vary. Constrain the output to JSON or a fixed table so comments, quoted excerpts and suggested levels can be validated mechanically, for example by checking that every quoted span appears in the submission. Keep marks human and use the model for comments only where it adds value. Check institutional rules on AI-assisted evaluation and on data processing first, and tell students how you used it.",
        },
        {
          type: "takeaways",
          items: [
            "You write the rubric and example comments, remove identifiers, let AI draft, then review every comment yourself.",
            "The grade is always your decision.",
            "Ask the AI to quote the exact part of the submission it refers to, so you can spot invented problems.",
            "Good feedback is specific, actionable, kind and brief.",
            "Spend the time you save on feedback only you can give.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-12-q1',
          prompt: 'In the safe feedback workflow, who assigns the final grade?',
          choices: ['The AI tool', 'The teacher', 'The student', 'Whoever is faster'],
          answer: 1,
          explanation:
            'AI drafts comments only. The teacher reviews every comment and decides the grade.',
        },
        {
          id: 'educator-12-q2',
          prompt: 'Why ask the AI to quote the part of the submission it comments on?',
          choices: [
            'It makes it fast to spot comments about things that are not in the work',
            'Quotes make feedback longer and look more serious',
            'The AI cannot write comments without quotes',
          ],
          answer: 0,
          explanation:
            'If the quoted text is not in the submission, the comment was invented. Quotes make checking quick.',
        },
        {
          id: 'educator-12-q3',
          prompt: 'What should you do before pasting a submission into an AI tool?',
          choices: [
            'Add the student’s section and ID for accuracy',
            'Translate it into another language',
            'Nothing, submissions are not personal data',
            'Remove identifiers and use a school-approved tool',
          ],
          answer: 3,
          explanation:
            'Submissions can identify students. Remove identifiers and use only tools your school approves.',
        },
        {
          id: 'educator-12-q4',
          prompt: 'Which feedback comment is most useful?',
          choices: [
            'Good job overall.',
            'Needs improvement.',
            'Your `calculate_total` skips the last item; change the loop to include it and add a test for a one-item list.',
            'Please be more careful next time.',
          ],
          answer: 2,
          explanation:
            'It is specific, names the code, and gives a concrete next step and a test to add.',
        },
        {
          id: "educator-12-q5",
          audience: { max: "beginner" },
          prompt: "What does it mean to \"anonymize\" a submission before using an AI tool?",
          choices: [
            "Delete the parts of the work that are wrong",
            "Remove names and anything else that shows which student wrote it",
            "Translate the work into another language",
            "Print the work and read it aloud to the class",
          ],
          answer: 1,
          explanation: "Anonymizing is like covering the name on an exam paper. The tool only needs the work, not the person, and removing identifiers keeps personal data out of it.",
        },
        {
          id: "educator-12-q6",
          audience: { min: "advanced" },
          prompt: "You ask a model for rubric-based comments, each with a quoted excerpt. Which automatic check is the most valuable?",
          choices: [
            "Check that every comment is under fifty words",
            "Check that the comments use the same tone as the rubric",
            "Check that every submission receives the same suggested level",
            "Check that every quoted excerpt appears word for word in the submission",
          ],
          answer: 3,
          explanation: "A quote that does not appear in the submission is a sign the model invented the point. A mechanical check finds this across a whole batch faster than reading each comment.",
        },
      ],
      task: {
        title: 'Try the feedback workflow on one submission',
        steps: [
          'Pick one old submission and remove every identifier.',
          'Run the feedback prompt with your rubric and two example comments.',
          'Check each comment against the submission and edit it.',
          'Save your two best edited comments in a new comment bank.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Cover the name on a practice submission with a code such as S001 and write one sentence on why this matters. Then ask an AI assistant to explain \"quote the exact part\" with an example, and try it on one comment.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Ask the model to return comments as a table with a quoted excerpt for each. Write a short script that checks every quoted span appears in the submission, run it on five drafts and count the mismatches.",
          ],
        },
      ],
    },
    {
      id: 'educator-13',
      day: 13,
      title: 'Quizzes and question banks with AI',
      summary: 'Generate aligned questions with good distractors, then check every single item.',
      intro: {
        objectives: [
          'Write a prompt for aligned questions with distractors based on real misconceptions.',
          'Check an AI-written item for a wrong key, a second right answer, clues and unclear English.',
          'Read a quiz item written in Moodle GIFT format.',
          'Explain why to tag items by outcome and rotate them each term.',
        ],
        why: 'Writing good questions and good wrong answers takes time, so a question bank is a natural job for AI. One wrong key is unfair to your students, so every item needs your check before it is used.',
      },
      minutes: 15,
      skills: ['ai-prep', 'assessment-design'],
      body: [
        {
          type: 'paragraph',
          text: "Writing good quiz questions takes time, and writing good wrong answers takes even longer. AI can draft a large question bank quickly. The catch: some items will have a wrong key, two right answers or a clue in the wording. You must check every item before students see it.",
        },
        { type: 'heading', text: 'Ask for aligned questions' },
        {
          type: 'paragraph',
          text: "Tell the AI which learning outcome each question serves and what level of thinking you want, from remembering to applying and analysing (Bloom's taxonomy is a useful shared language here). Ask for distractors based on real student misconceptions, so a wrong choice tells you something about what the student misunderstood.",
        },
        {
          type: 'prompt',
          label: 'Draft a question bank',
          text: "Write 10 multiple-choice questions on [topic] for [level], aligned to this outcome: [outcome]. Mix levels: 3 remember, 4 apply, 3 analyse. Each question has 4 choices and exactly one correct answer. Base each wrong choice on a common student misconception and name that misconception. Include short code snippets where useful. After each question give the correct answer and a one-sentence explanation.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **distractor** is a wrong choice in a multiple-choice question. A good one is wrong in a way a real misunderstanding would choose, like picking 4 because you forgot to count from zero. The **key** is the marked right answer, and **aligned** means the question tests the outcome you taught. AI can write many questions fast, but sometimes the key is wrong or two choices are right, like an answer sheet with a typo. So you work out each answer yourself first, then compare. If you find one wrong key, check the others, because the same mistake is often repeated.",
        },
        { type: 'heading', text: 'Check every item' },
        {
          type: 'list',
          items: [
            'Is the marked answer actually correct? Run any code.',
            'Is there exactly one right answer?',
            'Does the stem give away the answer, for example through grammar or length?',
            'Is the language clear for students who use English as a second language?',
            'Does it test the outcome, not trivia or trick wording?',
          ],
        },
        {
          type: 'paragraph',
          text: "Run code questions yourself. In Python, `//` is whole-number (floor) division, so `print(10 // 3)` prints 3, while `10 / 3` prints 3.3333333333333335. An AI can mark the wrong key on exactly this kind of item. If you find one wrong key, check the others in the bank, because the same kind of mistake is often repeated.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-13-scenario-1",
            kind: "scenario",
            title: "The marked answer",
            prompt: "What do you do with the item?",
            concept: "checking quiz items",
            situation: "An AI-written item reads: \"What does print(10 // 3) print? A) 3  B) 3.33  C) 3.0  D) 1\". The AI marked B as the key. You run the code and it prints 3.",
            options: [
              {
                text: "Keep B: the AI explained it clearly.",
                consequence: "Students who answer correctly would lose marks, and the bank carries a wrong key.",
                quality: "poor",
              },
              {
                text: "Fix the key to A, and check the other items for the same kind of mistake.",
                consequence: "Running code is how you catch a wrong key. One mistake suggests there may be others.",
                quality: "best",
              },
              {
                text: "Remove option A, so the AI's key is the only one left that looks right.",
                consequence: "Now the item has no correct answer at all.",
                quality: "poor",
              },
            ],
            hints: [
              "Run the code and compare it with the marked key.",
              "Is there exactly one right answer?",
              "A wrong key in one item can mean wrong keys elsewhere.",
            ],
            explanation: "Check every item before students see it: the marked answer, exactly one right answer, no clues in the wording, clear English and a match with the outcome.",
          },
        },
        {
          type: 'prompt',
          label: 'Second-pass review',
          text: "Review these quiz items as a strict test editor: [paste items]. For each, flag a wrong key, more than one defensible answer, clues in the wording, unclear English, or a mismatch with the outcome. Suggest a fixed version only for items that need one.",
        },
        {
          type: 'paragraph',
          text: "Many learning management systems import questions from text. Moodle, for example, reads the GIFT format below. Check your own LMS's import documentation, since formats differ.",
        },
        {
          type: 'code',
          language: 'text',
          label: 'Two items in Moodle GIFT format',
          code: `::py-01:: What does len("GCash") return? {=5 ~4 ~6 ~an error}

::py-02:: Which keyword starts a loop that repeats while a condition is true? {=while ~for ~if ~def}`,
        },
        {
          type: 'paragraph',
          text: "In GIFT, the `::name::` at the start labels the question, `=` marks the correct choice and `~` marks each wrong one. So in the first item the answer is 5, because \"GCash\" has five characters.",
        },
        {
          type: 'tip',
          text: "Tag every item with its outcome and level in your bank. Later you can build balanced quizzes quickly and see which outcomes students keep missing.",
        },
        {
          type: 'warning',
          text: "Students can paste your quiz into an AI too. For quizzes that count, use the 'not allowed' level from your policy with supervised conditions, and rotate items each term so a leaked bank does little harm.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat the bank as a measurement asset. Tag each item with outcome, cognitive level and expected difficulty. After delivery, run item analysis: the proportion who answered correctly and how well the item separates stronger from weaker students; an item that stronger students miss more often than weaker ones often has a wrong key or an ambiguous stem. For code items, compute the key by running the snippet from a script instead of asserting it, and randomise parameters to generate variants, which also limits the damage from a leaked bank. Mind validity: items a model answers instantly mostly test public recall, so keep supervised or live components for high stakes. Version and review the bank each term, and keep an audit trail of which items were AI-drafted.",
        },
        {
          type: "takeaways",
          items: [
            "AI can draft a large question bank quickly, but some items will have a wrong key, two right answers or a clue in the wording.",
            "Tell the AI the outcome and level of thinking, and base distractors on real misconceptions.",
            "Check every item: correct key, exactly one right answer, no clues, clear English, tests the outcome.",
            "Tag items with outcome and level, and rotate them each term.",
            "For quizzes that count, use the \"not allowed\" level with supervised conditions.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-13-q1',
          prompt: 'Why base distractors on real misconceptions?',
          choices: [
            'So wrong choices reveal what the student misunderstood',
            'So the quiz is harder for everyone',
            'Because AI cannot write random distractors',
          ],
          answer: 0,
          explanation:
            'A misconception-based distractor gives you diagnostic information when a student picks it.',
        },
        {
          id: 'educator-13-q2',
          prompt: 'In the GIFT example, what is the correct answer to `len("GCash")`?',
          choices: ['4', '6', 'an error', '5'],
          answer: 3,
          explanation:
            '"GCash" has five characters, so `len` returns 5. In GIFT the `=` marks the correct choice.',
        },
        {
          id: 'educator-13-q3',
          prompt: 'Which problem must you check for in every AI-written item?',
          choices: [
            'Whether it uses enough emojis',
            'Whether the marked answer is truly correct and the only right one',
            'Whether it is long enough',
            'Whether the AI liked it',
          ],
          answer: 1,
          explanation:
            'Wrong keys and double answers are common in AI-drafted items and unfair to students.',
        },
        {
          id: 'educator-13-q4',
          prompt: 'Why rotate quiz items each term?',
          choices: [
            'Because GIFT files expire',
            'Because AI tools forget old questions',
            'So a leaked or shared bank does little harm',
            'Because outcomes change every term',
          ],
          answer: 2,
          explanation:
            'Banks spread between batches. Rotation keeps quizzes meaningful.',
        },
        {
          id: "educator-13-q5",
          audience: { max: "beginner" },
          prompt: "What is a \"distractor\" in a multiple-choice question?",
          choices: [
            "A wrong choice that looks believable because it matches a common mistake",
            "The question that takes the longest time to read",
            "The one right answer, marked in the answer sheet",
            "A joke choice added to make the quiz more fun",
          ],
          answer: 0,
          explanation: "A good distractor is wrong in a useful way. When a student picks it, you learn what they misunderstood.",
        },
        {
          id: "educator-13-q6",
          audience: { min: "advanced" },
          prompt: "After a quiz, an AI-written item was answered correctly mostly by students whose overall scores were lowest. What should you investigate first?",
          choices: [
            "Whether the lowest-scoring students studied harder than the others",
            "Whether the item should simply be given more marks next time",
            "Whether the key is wrong or the stem is ambiguous, since the item separates students backwards",
            "Whether the quiz was taken on slower computers",
          ],
          answer: 2,
          explanation: "An item that strong students miss while weak students pass is often mis-keyed or unclear. Item analysis points you to the items worth rechecking.",
        },
      ],
      task: {
        title: 'Build and check a 10-item bank',
        steps: [
          'Run the question bank prompt for one outcome you will assess soon.',
          'Check every item with the list above, running any code.',
          'Run the second-pass review prompt and compare its flags with yours.',
          'Save the fixed items with their outcome and level tags.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write one multiple-choice question yourself with three wrong choices, each tied to a mistake students really make. Then ask an AI assistant to name the mistake behind each wrong choice and compare its answers with yours.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "For five code items, write a script that runs each snippet and computes the key, then compare with the AI's keys. After your next quiz, record the percent correct for each item and flag any item that stronger students miss more than weaker ones.",
          ],
        },
      ],
    },
    {
      id: 'educator-14',
      day: 14,
      title: 'Accessibility and differentiated instruction',
      summary: 'Use AI to make materials easier to access and to offer leveled versions, then check them.',
      intro: {
        objectives: [
          'List useful versions of one material: plain language, Filipino or Taglish, three levels, alt text and checklists.',
          'Write three leveled versions of an exercise that keep the same learning outcome.',
          'Check an AI-simplified or translated explanation for accuracy.',
          "Ask for accommodations by type of support, without sharing a student's personal details.",
        ],
        why: 'Your class includes slow readers in English, students with disabilities and students far ahead, and one handout rarely fits them all. AI makes several versions realistic, if you check them and keep private details out.',
      },
      minutes: 15,
      skills: ['responsible-ai', 'ai-prep'],
      body: [
        {
          type: 'paragraph',
          text: "Every class has students who learn differently: some read slowly in English, some have a disability, some are far ahead, some missed weeks of class. Preparing several versions of the same material used to be too much work. AI makes it realistic, as long as you check what it produces.",
        },
        { type: 'heading', text: 'Useful versions to make' },
        {
          type: 'list',
          items: [
            '**Plain-language version** of a dense handout or lab instruction.',
            '**Filipino or Taglish explanation** of a hard concept, alongside the English one.',
            '**Three levels** of the same exercise: scaffolded, standard and extension.',
            '**Alt text** for diagrams, flowcharts and screenshots in your slides.',
            '**Step-by-step checklists** for long procedures like setting up a dev environment.',
          ],
        },
        {
          type: 'paragraph',
          text: "This follows the idea behind Universal Design for Learning: give students more than one way to take in the material, to work with it and to show what they know. The goal is the same outcome for everyone, reached by different paths.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**Accessibility** means making materials usable by people who read, see, hear or learn differently. **Alt text** is a short written description of a picture. A **screen reader**, a program that reads the screen aloud for people who cannot see it, speaks the alt text instead of showing the picture. **Differentiated** means offering more than one version of the same task, like a recipe with a step-by-step card and a short card for experienced cooks, while the dish stays the same. AI can write the versions fast. Your job is to check that nothing important changed, especially in the simplified one.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-14-match-1",
            kind: "match",
            title: "Useful versions",
            prompt: "Match each version to what it is for.",
            concept: "differentiated instruction",
            pairs: [
              {
                term: "Plain-language version",
                definition: "A dense handout or lab instruction made easier to read",
              },
              {
                term: "Filipino or Taglish explanation",
                definition: "A hard concept explained alongside the English one",
              },
              {
                term: "Three levels of an exercise",
                definition: "Scaffolded, standard and extension, with the same learning outcome",
              },
              {
                term: "Alt text",
                definition: "Descriptions of diagrams, flowcharts and screenshots in your slides",
              },
              {
                term: "Step-by-step checklist",
                definition: "A long procedure such as setting up a dev environment",
              },
            ],
            hints: [
              "Some versions change the language, others change the difficulty.",
              "Alt text is for students who cannot see the image.",
              "Three levels keep the outcome the same but change how much help the student gets.",
            ],
            explanation: "Offer more than one way to take in the material, work with it and show what they know. The goal is the same outcome for everyone, reached by different paths.",
          },
        },
        {
          type: 'prompt',
          label: 'Three levels of one exercise',
          text: "Here is an exercise for [level]: [paste exercise]. Create three versions with the same learning outcome. Version A (scaffolded): break it into steps with hints and a partly completed starter. Version B (standard): the original, with clearer wording. Version C (extension): add one realistic extra requirement. Keep the language simple and do not change what is being assessed.",
        },
        {
          type: 'prompt',
          label: 'Alt text for a diagram',
          text: "Write alt text for this diagram, described here in words: [describe the diagram, e.g. an ER diagram with three tables, Students, Enrollments and Courses, linked one-to-many]. Give a short alt text (one sentence) and a longer description that a screen reader user could follow to understand the relationships.",
        },
        {
          type: 'paragraph',
          text: "Check the results carefully. A simplified explanation can quietly become wrong. A Filipino translation of a technical term can be awkward or misleading, and sometimes the English term is clearer. Read every version as if you were the student who needs it.",
        },
        {
          type: 'warning',
          text: "Never paste a student's diagnosis, disability or accommodation details into an AI tool. Work from the type of support needed, such as 'larger steps with more hints', not from the student's personal information, and follow your school's accommodation process.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-14-scenario-1",
            kind: "scenario",
            title: "The accommodation details",
            prompt: "What do you give the AI?",
            concept: "privacy and accommodations",
            situation: "A student has an accommodation on file. You want AI help to make a gentler version of an exercise and are tempted to paste the accommodation details so it can \"tailor\" it.",
            options: [
              {
                text: "Paste the diagnosis with the student's name; it will tailor better.",
                consequence: "Never paste a student's diagnosis, disability or accommodation details into an AI tool.",
                quality: "poor",
              },
              {
                text: "Paste the diagnosis, but remove the name.",
                consequence: "The details are still sensitive, and may point to one student even without a name.",
                quality: "poor",
              },
              {
                text: "Describe only the type of support needed, such as \"larger steps with more hints\", and follow your school's accommodation process.",
                consequence: "You get a useful version without sharing anything personal.",
                quality: "best",
              },
            ],
            hints: [
              "What can you ask for without describing the student?",
              "Work from the type of support, not from personal information.",
              "The school's accommodation process still applies.",
            ],
            explanation: "Work from the type of support needed, not from the student's personal information, and check every version for accuracy.",
          },
        },
        {
          type: 'tip',
          text: "Offer versions to everyone instead of assigning them. Students often pick the scaffolded version when they need it if no one has to know why, and strong students enjoy the extension.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat accessibility as a requirement of the materials you generate and of the tools students use. For digital content, WCAG 2.2 gives testable criteria, starting with text alternatives for non-text content, then captions, contrast and keyboard operability. Use AI for first drafts of alt text, but a diagram's alt text must carry the instructional point rather than describe shapes, and that judgment is yours. Check generated HTML with automated tools and with a keyboard-only and screen-reader pass, because automated tools cannot judge whether alt text is meaningful. Teach students that AI-generated interfaces are not accessible by default, and add accessibility to web project rubrics: semantic elements, labels, contrast and focus order. Keep one source of truth for leveled versions so a correction reaches all of them.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "WCAG 2.2 Success Criterion 1.1.1 (Non-text content, Level A) requires that non-text content presented to the user has a text alternative that serves the equivalent purpose.",
          checked: "2026-11-14",
          sources: [
            {
              label: "W3C: Understanding Success Criterion 1.1.1 Non-text Content (WCAG 2.2)",
              url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "AI makes several versions of the same material realistic: plain language, Filipino or Taglish, three levels, alt text and checklists.",
            "The idea is Universal Design for Learning: more than one way to take in, work with and show learning.",
            "Check every version: a simplified explanation can quietly become wrong, and a translated technical term can mislead.",
            "Never paste a diagnosis, disability or accommodation details into an AI tool.",
            "Offer versions to everyone instead of assigning them.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-14-q1',
          prompt: 'What should stay the same across three leveled versions of an exercise?',
          choices: [
            'The exact wording',
            'The number of hints',
            'The learning outcome being assessed',
            'The length',
          ],
          answer: 2,
          explanation:
            'Differentiation changes the path and support, not the outcome everyone is working toward.',
        },
        {
          id: 'educator-14-q2',
          prompt: 'Which information should never go into an AI tool when preparing accommodations?',
          choices: [
            'A student’s diagnosis or disability details',
            'The type of support needed, such as more hints',
            'The exercise text',
            'The learning outcome',
          ],
          answer: 0,
          explanation:
            'Health and disability information is highly sensitive. Work from the kind of support needed instead.',
        },
        {
          id: 'educator-14-q3',
          prompt: 'Why read an AI-simplified explanation carefully?',
          choices: [
            'Simplified text is always longer',
            'Simplifying can quietly make a technical point wrong',
            'AI cannot write in plain language',
          ],
          answer: 1,
          explanation:
            'Simplification can drop or distort important details, so the teacher must check accuracy.',
        },
        {
          id: 'educator-14-q4',
          prompt: 'Why offer leveled versions to everyone instead of assigning them?',
          choices: [
            'It is required by law',
            'It removes the need to grade',
            'AI works better that way',
            'Students can choose the support they need without being singled out',
          ],
          answer: 3,
          explanation:
            'Open choice avoids stigma, so students who need support are more likely to use it.',
        },
        {
          id: "educator-14-q5",
          audience: { max: "beginner" },
          prompt: "What is \"alt text\" for?",
          choices: [
            "It lets the teacher change the colours of the picture later",
            "It makes the picture load faster on a slow connection",
            "It is the title of the slide that holds the picture",
            "It describes a picture in words so a screen reader can speak it to someone who cannot see the picture",
          ],
          answer: 3,
          explanation: "Alt text is the written stand-in for an image. A screen reader reads it aloud, so a student who cannot see the diagram can still follow the lesson.",
        },
        {
          id: "educator-14-q6",
          audience: { min: "advanced" },
          prompt: "A model writes the alt text for a database flowchart as \"a diagram with boxes and arrows\". What is the problem?",
          choices: [
            "It describes shapes, not the instructional point, such as the steps and what flows between them",
            "It is too short for the screen reader to read aloud",
            "It uses the word \"diagram\", which is not allowed in alt text",
            "It should list the colours of each box and arrow",
          ],
          answer: 0,
          explanation: "Alt text should give a reader the same understanding the picture gives. For a flowchart that means the sequence and relationships, not a list of shapes.",
        },
      ],
      task: {
        title: 'Make one exercise accessible',
        steps: [
          'Run the three-levels prompt on an exercise you will give soon.',
          'Check each version for accuracy and that the outcome is unchanged.',
          'Write alt text for one diagram in your slides using the second prompt.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write the alt text for one picture in your slides in your own words, then ask an AI assistant to improve it and explain what changed. Which version would help a student who cannot see the picture more?",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Have a model generate the HTML for a short handout, then test it with the keyboard only and with a screen reader. List three failures, fix them, and add the three checks to the rubric of a web project.",
          ],
        },
      ],
    },
    {
      id: 'educator-15',
      day: 15,
      title: 'Student data privacy',
      summary: 'Keep identifiable student data out of unapproved AI tools, and anonymize before any AI step.',
      intro: {
        objectives: [
          'Name the kinds of student data that are identifiable.',
          'State the one rule: no identifiable student data in an unapproved AI tool.',
          'Read a script that replaces names with codes and keeps the key private.',
          'Check the text of answers for names and IDs, and know what to do if data was shared by mistake.',
        ],
        why: 'Teachers hold names, IDs, grades and sometimes health details, and your students never agreed to share them with an AI company. Good habits here protect them, and they are the habits you want students to bring to their first job.',
      },
      minutes: 15,
      skills: ['responsible-ai', 'ai-policy'],
      body: [
        {
          type: 'paragraph',
          text: "Teachers handle a lot of personal data: names, ID numbers, grades, contact details, photos, sometimes health and family information. In the Philippines, the Data Privacy Act of 2012 sets rules for how personal information is collected, used and shared, and the National Privacy Commission oversees it. The law treats some information, including certain education and health records, as sensitive. This lesson gives general habits; for specifics, ask your school's Data Protection Officer.",
        },
        { type: 'heading', text: 'The one rule to remember' },
        {
          type: 'paragraph',
          text: "**Never paste identifiable student data into an AI tool your school has not approved.** When you use an AI tool, the text you enter may be stored, reviewed or used by the provider depending on the tool and its settings. Your students did not agree to that, and you may not have the authority to share it.",
        },
        { type: 'heading', text: 'What counts as identifiable' },
        {
          type: 'list',
          items: [
            'Names, student numbers, emails, phone numbers, addresses.',
            'Grades and class records tied to a person.',
            'Photos, screenshots of your LMS or group chats.',
            'Unique details that point to one student even without a name.',
            'Health, disability, family or financial circumstances.',
          ],
        },
        { type: 'heading', text: 'Anonymize before any AI step' },
        {
          type: 'paragraph',
          text: "If your school approves a tool for this work, remove identifiers first anyway. The script below replaces names in a CSV with codes and saves the key separately, so the anonymized file can go to the tool and the key never leaves your computer.",
        },
        {
          type: 'code',
          language: 'python',
          label: 'Replace names with codes',
          code: `import csv

# Replace student names with codes before any AI step.
# Keep key.csv private, offline, and out of any AI tool.
with open("submissions.csv", newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

key = {}
for i, row in enumerate(rows, start=1):
    code = f"S{i:03d}"
    key[code] = row["name"]
    row["name"] = code

with open("submissions_anonymized.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)

with open("key.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["code", "name"])
    writer.writerows(key.items())`,
        },
        {
          type: 'paragraph',
          text: "Here is how the script works. `enumerate(rows, start=1)` counts the rows from 1, and the format `:03d` pads each number to three digits with zeros, so the first student becomes `S001` and the second `S002`. The `key` dictionary maps each code to the real name, so looking up a code gives back a name. It is saved to `key.csv`, which stays on your computer. Only the anonymized file goes to a tool, and later you can use the key to match feedback to the right student.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**Personal data** is any information that points to a real person: a name, a student number, grades, a photo. To **anonymize** means to replace those details with codes, like putting a number on an exam paper instead of a name. The script above swaps each name for a code such as S001 and saves the list of which code belongs to whom in a separate file called the **key**. Only the codes go to a tool. The key stays with you, like a locked drawer. An **approved tool** is one your school's Data Protection Officer has agreed may handle this kind of data.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-15-predict-output-1",
            kind: "predict-output",
            title: "Codes instead of names",
            prompt: "This is a small version of the lesson's anonymizing script. What does it print?",
            concept: "anonymizing data",
            language: "python",
            code: "names = [\"Ana\", \"Ben\", \"Cy\"]\nkey = {}\nfor i, name in enumerate(names, start=1):\n    key[f\"S{i:03d}\"] = name\nprint(list(key.keys()))\nprint(key[\"S002\"])",
            expected: "['S001', 'S002', 'S003']\nBen",
            choices: [
              "['S001', 'S002', 'S003']\nBen",
              "['S000', 'S001', 'S002']\nBen",
              "['S001', 'S002', 'S003']\nS002",
              "['S1', 'S2', 'S3']\nBen",
            ],
            wrongNotes: {
              "['S000', 'S001', 'S002']\nBen": "The count starts at 1 because of `start=1`, so there is no S000.",
              "['S001', 'S002', 'S003']\nS002": "The key maps a code to a name, so `key[\"S002\"]` is the name, not the code.",
              "['S1', 'S2', 'S3']\nBen": "`:03d` pads each number to three digits.",
            },
            hints: [
              "`enumerate(names, start=1)` starts counting at 1.",
              "`:03d` pads the number to three digits with zeros.",
              "The key maps each code to a name, so looking up \"S002\" gives back a name.",
            ],
            explanation: "The codes are S001, S002 and S003. The key keeps the connection to the real names, which is why it stays private and offline while only the coded file goes to a tool.",
          },
        },
        {
          type: 'warning',
          text: "The script only changes the name column. Students often write their names, ID numbers or classmates' names inside their answers and code comments. Read the text too before it goes anywhere.",
        },
        {
          type: 'prompt',
          label: 'Privacy checklist for your class',
          text: "Help me write a one-page checklist for a [level] IT teacher in the Philippines on using AI tools with student work. Cover: what counts as identifiable data, anonymizing before any AI step, using only school-approved tools and accounts, checking tool settings about data use, what to do if data was shared by mistake (tell the school's Data Protection Officer), and teaching students the same habits. Keep legal points general and tell me to confirm details with the Data Protection Officer.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-15-scenario-1",
            kind: "scenario",
            title: "Names inside the answers",
            prompt: "What do you do?",
            concept: "student data privacy",
            situation: "You replaced the name column with codes and the file is ready for an approved tool. One answer begins: \"Hi, I'm Ana from section B, my ID is 2023-0142.\"",
            options: [
              {
                text: "Send it: the name column is anonymised.",
                consequence: "The name and ID are still in the data you send.",
                quality: "poor",
              },
              {
                text: "Read the text columns too, and remove such details before the file goes anywhere.",
                consequence: "Students often write names, IDs or classmates' names inside answers and code comments, so the whole file has to be read.",
                quality: "best",
              },
              {
                text: "Ask the AI to ignore the names.",
                consequence: "The text has already been sent to the tool by then. Asking it to ignore them does not undo that.",
                quality: "poor",
              },
            ],
            hints: [
              "Which parts of the file did the script change?",
              "Where else can a student put their name?",
              "Anonymise before any AI step, including the free text.",
            ],
            explanation: "The script changes only the name column. Read the text too, and keep the key private and offline.",
          },
        },
        {
          type: 'paragraph',
          text: "If you do paste student data into an unapproved tool by mistake, do not hide it or just delete the chat. Report it promptly to your school's Data Protection Officer and follow their guidance, because the school has a process for data incidents and can only act if it knows.",
        },
        {
          type: 'tip',
          text: "Teach this to students too. Their capstone systems will collect real users' data, and the habits they see you practise become the habits they bring to their first job.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Think in data flows. For each AI use, map what leaves your device, where it is processed, whether it is retained or used to improve the provider's models, which agreements cover the provider, and what your institution allows. Minimise: send the smallest de-identified text that does the job. Know the difference between anonymisation, which cannot be reversed, and pseudonymisation, where a key can restore identity; the lesson's script is pseudonymisation, and free-text answers can re-identify a student. In the Philippines the Data Privacy Act of 2012 requires processing to follow the principles of transparency, legitimate purpose and proportionality (Section 11); have your Data Protection Officer decide whether a tool and purpose qualify, and agree an incident response before you need it. For student projects that handle real users' data, require minimisation and a short privacy impact assessment.",
        },
        {
          type: "takeaways",
          items: [
            "Never paste identifiable student data into an AI tool your school has not approved.",
            "Identifiable means names, numbers, grades tied to a person, photos, unique details and sensitive circumstances.",
            "Anonymise before any AI step, even with an approved tool, and keep the key private.",
            "Read the text too: students put names and IDs inside answers and comments.",
            "Teach students the same habits; their capstones will hold real users' data.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-15-q1',
          prompt: 'Who should you ask about your school’s specific data privacy rules?',
          choices: [
            'The AI tool itself',
            'The school’s Data Protection Officer',
            'Your students',
            'Nobody; the law is the same everywhere',
          ],
          answer: 1,
          explanation:
            'The Data Protection Officer knows your institution’s obligations and approved tools.',
        },
        {
          id: 'educator-15-q2',
          prompt: 'Which of these is identifiable student data?',
          choices: [
            'A screenshot of your LMS gradebook',
            'A generic exercise about loops',
            'Your course outline',
          ],
          answer: 0,
          explanation:
            'A gradebook screenshot shows names and grades tied to real people.',
        },
        {
          id: 'educator-15-q3',
          prompt: 'After running the anonymizing script, what must you still check?',
          choices: [
            'That the file is under 1 MB',
            'That the key file was uploaded too',
            'Nothing; the data is fully anonymous',
            'Names or IDs written inside the answers and comments',
          ],
          answer: 3,
          explanation:
            'The script changes only the name column. Identifiers inside the text must be removed by reading it.',
        },
        {
          id: 'educator-15-q4',
          prompt: 'You realize you pasted a class list into an unapproved tool. What should you do?',
          choices: [
            'Delete the chat and tell no one',
            'Paste it again in a different tool',
            'Report it to your school’s Data Protection Officer and follow their guidance',
            'Ask students to change their names',
          ],
          answer: 2,
          explanation:
            'The school has a process for data incidents. Reporting promptly lets the right people respond.',
        },
        {
          id: "educator-15-q5",
          audience: { max: "beginner" },
          prompt: "In the anonymizing script, what is the \"key\" file?",
          choices: [
            "A password the AI tool asks you to type",
            "A private list that says which code belongs to which student, kept on your own computer",
            "The anonymized file that you send to the AI tool",
            "A list of the questions students got wrong",
          ],
          answer: 1,
          explanation: "The key lets you match codes back to names later. It must never go to a tool, so you keep it separate and private.",
        },
        {
          id: "educator-15-q6",
          audience: { min: "advanced" },
          prompt: "Your pseudonymised CSV has a free-text \"reflection\" column. What is the main remaining risk?",
          choices: [
            "The reflections will be too long for the tool to process",
            "The reflections will contain grammar mistakes that confuse the tool",
            "Students may write names or details that re-identify them, and data with a key still counts as personal data",
            "The reflection column was already anonymised by the script",
          ],
          answer: 2,
          explanation: "The script changed only the name column. Free text can name people or give details that point to one student, and while a key exists, identities can be restored, so treat the data with care.",
        },
      ],
      task: {
        title: 'Set up your privacy habits',
        steps: [
          'Find out who your school’s Data Protection Officer is and which AI tools are approved.',
          'Run the checklist prompt and edit it with what you learned.',
          'Try the anonymizing script on a small made-up CSV with a `name` column.',
          'Add a privacy line to your class AI-use policy.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Make a made-up table of three students with names and scores on paper. Replace the names with codes, write the key on a separate sheet, and explain in one sentence why the key must stay private.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Draw a data-flow map for one AI use in your teaching: what leaves your device, where it is processed, whether it is retained, and who is responsible. Send it to your Data Protection Officer for review. Extend the script to flag any name from the key found in free-text columns.",
          ],
        },
      ],
    },
    {
      id: 'educator-16',
      day: 16,
      title: 'Capstone advising with AI',
      summary: 'Help capstone teams scope, plan and defend their projects, with honest AI use.',
      intro: {
        objectives: [
          'Use AI to scope a capstone proposal, find risks and plan milestones.',
          'Require students to open and keep every source they cite.',
          'Ask teams for an AI-use log and a disclosure section.',
          'Insist on made-up test data and consent when a capstone system collects real data.',
        ],
        why: 'Capstones are where AI can help or hurt students most, and where you advise teams on real client work. Clear rules on sources, disclosure and data keep the project honest and the defense meaningful.',
      },
      minutes: 15,
      skills: ['ai-programming-pedagogy', 'ai-policy'],
      body: [
        {
          type: 'paragraph',
          text: "Capstone and thesis projects are where students bring everything together, and where AI can help or hurt the most. Used well, it helps teams scope realistic projects, plan their work and prepare for the panel. Used badly, it produces a polished paper and a system nobody on the team can explain.",
        },
        { type: 'heading', text: 'Where AI helps capstone teams' },
        {
          type: 'list',
          items: [
            '**Scoping:** is this doable in the time and with the skills we have?',
            '**Risks:** what could go wrong with data, users, hosting or the schedule?',
            '**Planning:** breaking the project into milestones and tasks.',
            '**Research start:** search terms and topics to explore, never the final sources.',
            '**User testing:** drafting interview questions and test scripts.',
            '**Defense practice:** mock panel questions on their own system.',
          ],
        },
        {
          type: 'prompt',
          label: 'Scope check for a proposal',
          text: "Act as a strict capstone adviser. Here is a team's proposal summary (no names): [paste]. The team has [number] members, [months] months and these skills: [list]. Assess: Is the scope realistic? What is the riskiest part? Which features should move to 'future work'? What personal data does the system collect, and what consent and protection does it need? Give a list of questions the team must answer before approval.",
        },
        {
          type: 'warning',
          text: "AI tools can invent research papers, authors and DOIs that look completely real. Require students to open every source they cite and to keep a copy or link. A related literature section full of nonexistent papers is a serious integrity problem.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **capstone** is the big final project students do near graduation, often in a team. **Scope** means how much the project includes: too much and it will not finish, too little and it proves nothing. A **citation** names the book or paper an idea came from, and it must be real. AI sometimes invents references that look genuine, like a fake receipt. An **AI-use log** is a simple diary of when the team used AI and what for. At the defense, the panel can then see which parts the students did themselves, and every team member should be able to explain the parts they built.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-16-scenario-1",
            kind: "scenario",
            title: "References that look perfect",
            prompt: "What do you require?",
            concept: "citation integrity",
            situation: "In a capstone proposal you find five references in the related literature that look perfect. A quick search finds no trace of two of them. The team says the AI suggested them.",
            options: [
              {
                text: "Accept them: it is only a literature review.",
                consequence: "A related literature section full of nonexistent papers is a serious integrity problem.",
                quality: "poor",
              },
              {
                text: "Require the team to open every source they cite, keep a copy or link, and remove any they cannot find.",
                consequence: "Every cited source has to exist and say what it is claimed to say.",
                quality: "best",
              },
              {
                text: "Ask the AI to double-check its own references.",
                consequence: "It can invent papers, authors and DOIs that look real, and will not reliably catch its own inventions.",
                quality: "poor",
              },
            ],
            hints: [
              "AI tools can invent papers, authors and DOIs that look real.",
              "What could you open and check yourself?",
              "Use AI for search terms and topics, not final sources.",
            ],
            explanation: "Use AI to start research, never to supply the final sources. Teams open and keep every source they cite.",
          },
        },
        { type: 'heading', text: 'Disclosure and ownership' },
        {
          type: 'paragraph',
          text: "Ask teams to keep an AI-use log through the project and to describe their AI use in the methodology or a disclosure section, following your school's research guidelines. The panel defense remains the key check: every member should be able to explain the architecture, the database and the parts they built.",
        },
        {
          type: 'paragraph',
          text: "Many capstone systems are built for real clients: a clinic, a cooperative, a barangay office or a small business. These collect real personal data. Remind teams that privacy obligations apply to them too, that they need consent from users, and that test data should be made up, not copied from the client's real records.",
        },
        {
          type: 'tip',
          text: "Hold a mock defense two or three weeks before the real one. Use AI to draft panel questions from the team's documentation, then ask them yourself. Teams that rehearse explaining their system do far better under pressure.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Advise capstones at the level of engineering process. Require an architecture decision record for each significant choice (the options, why this one, who decided), a repository with a protected main branch, pull requests with reviewers, and CI that runs the tests, so the history shows who understood and decided what. Use AI for risk reviews and threat-modelling prompts, then require a real test plan to validate them. Treat literature claims strictly: every cited source is opened and archived. Set a dependency and licence inventory and a data policy for real clients. Make defense questions individual: each member explains and changes code they authored, chosen from the commit log. Calibrate AI use by phase: open for scaffolding with disclosure in the methodology, supervised for the core algorithm.",
        },
        {
          type: "takeaways",
          items: [
            "AI helps capstone teams scope, find risks, plan, start research, draft test scripts and practice defense.",
            "Require teams to open every source they cite; AI can invent papers that look real.",
            "Ask for an AI-use log and a disclosure section, following your school's research guidelines.",
            "Every member should be able to explain the architecture, database and their own parts.",
            "Capstone systems with real clients collect real data: use consent and made-up test data.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-16-q1',
          prompt: 'Which capstone task is AI least suited to do on its own?',
          choices: [
            'Suggesting milestones',
            'Brainstorming risks',
            'Drafting mock panel questions',
            'Providing final, citable research sources',
          ],
          answer: 3,
          explanation:
            'AI can invent papers and DOIs. Students must find, open and keep every source themselves.',
        },
        {
          id: 'educator-16-q2',
          prompt: 'What is the key check that a team understands its own system?',
          choices: [
            'A long, polished paper',
            'The panel defense, where every member explains the parts they built',
            'The number of features',
          ],
          answer: 1,
          explanation:
            'Explaining architecture, database and code live shows real understanding.',
        },
        {
          id: 'educator-16-q3',
          prompt: 'A team’s system for a local clinic needs test data. What should they use?',
          choices: [
            'Made-up records, not the clinic’s real patient data',
            'A copy of the clinic’s real records',
            'Their classmates’ personal data',
            'Data scraped from social media',
          ],
          answer: 0,
          explanation:
            'Real patient data is sensitive and needs proper consent and protection. Fake test data avoids the risk.',
        },
        {
          id: 'educator-16-q4',
          prompt: 'Why ask teams to keep an AI-use log?',
          choices: [
            'To catch them cheating',
            'Because AI tools require it',
            'It supports honest disclosure in their paper and shows their process',
            'To make the project longer',
          ],
          answer: 2,
          explanation:
            'A log makes disclosure accurate and gives you process evidence across the project.',
        },
        {
          id: "educator-16-q5",
          audience: { max: "beginner" },
          prompt: "What is an \"AI-use log\" for?",
          choices: [
            "It records when the team used AI and for what, so the panel can see which work the students did themselves",
            "It counts how many hours each student sat at the computer",
            "It is a list of AI tools the school has banned",
            "It replaces the written report at the final defense",
          ],
          answer: 0,
          explanation: "The log is an honest diary of AI use. Together with the defense, it shows what the team understands and built.",
        },
        {
          id: "educator-16-q6",
          audience: { min: "advanced" },
          prompt: "Two weeks before the defense, a team repository shows one member authored ninety percent of the commits. What best fits good advising practice?",
          choices: [
            "Fail the team because contribution was not equal",
            "Ignore the pattern, since the final system works",
            "Tell the whole team to disable commit history from now on",
            "Ask about it openly, make defense questions individual, and ask each member to explain and change code from the history",
          ],
          answer: 3,
          explanation: "Commit counts can have innocent causes, such as pairing on one laptop. Open questions and individual explanations give each member a fair chance to show what they understand.",
        },
      ],
      task: {
        title: 'Prepare your capstone advising kit',
        steps: [
          'Run the scope-check prompt on a past or current proposal with names removed.',
          'Write a one-paragraph AI-use and citation rule for your capstone teams.',
          'Draft five mock defense questions you would ask any team.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask an AI assistant to give three examples of a capstone idea that is too big and three that are the right size for your students. Pick which are right-sized and write one sentence explaining each choice.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Draft a one-page repository standard for capstone teams: protected main branch, pull requests with a reviewer, tests on every change, an architecture decision record template and a dependency and licence list. Decide how you will use the commit history in the defense.",
          ],
        },
      ],
    },
    {
      id: 'educator-17',
      day: 17,
      title: 'Teaching AI ethics and bias',
      summary: 'Bring bias, privacy, licensing and job impact into class with hands-on, local cases.',
      intro: {
        objectives: [
          'Name the six ethics topics worth covering: bias, privacy, licensing, misinformation, work and jobs, and accountability.',
          'Match a classroom case to the ethics topic it raises.',
          'Run a same-request, small-change activity so students test for bias themselves.',
          'Add a risks-and-harms section to capstone proposals.',
        ],
        why: 'Many of your students will build systems that include AI, and they need to ask who could be harmed. Concrete local cases make ethics a design habit instead of a list to memorize.',
      },
      minutes: 15,
      skills: ['responsible-ai', 'teaching-ai-skills'],
      body: [
        {
          type: 'paragraph',
          text: "Your students will not only use AI; many will build systems that include it. They need to think about who could be harmed, who is left out and who is responsible. Ethics sticks best when it is concrete, local and hands-on, not a list of principles to memorize.",
        },
        { type: 'heading', text: 'Topics worth covering' },
        {
          type: 'list',
          items: [
            '**Bias:** models learn patterns from their training data, including unfair ones about gender, region, language or class.',
            '**Privacy:** what happens to data people type into AI tools, and what systems should collect.',
            '**Licensing and ownership:** generated code can resemble licensed code; students must respect licences.',
            '**Misinformation and deepfakes:** realistic fake text, images and voices.',
            '**Work and jobs:** how tasks change, and why judgment and communication matter more.',
            '**Accountability:** when an AI-assisted system makes a wrong decision, who is responsible?',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "educator-17-match-1",
            kind: "match",
            title: "Name the ethics topic",
            prompt: "Six cases for a class discussion. Match each case with the ethics topic it raises.",
            concept: "ai ethics topics",
            labels: { terms: "What happened", meanings: "Ethics topic" },
            pairs: [
              {
                term: "A resume-screening tool trained on past hires keeps ranking applicants from the provinces lower.",
                definition: "Bias",
              },
              {
                term: "A student pastes classmates' names and grades into a public chatbot to make a summary.",
                definition: "Privacy",
              },
              {
                term: "A student copies a long AI-suggested function into her capstone without checking whether it matches licensed code.",
                definition: "Licensing and ownership",
              },
              {
                term: "A video of a mayor saying something he never said spreads in the class group chat.",
                definition: "Misinformation and deepfakes",
              },
              {
                term: "A BPO uses AI to draft first replies, and agents' work shifts to checking them and handling hard cases.",
                definition: "Work and jobs",
              },
              {
                term: "A school chatbot wrongly tells a student she missed the enrolment deadline, and nobody knows who should fix it.",
                definition: "Accountability",
              },
            ],
            hints: [
              "Some cases are about data, some about what people may reuse, and some about who is harmed or responsible.",
              "Unfair patterns learned from past data are bias; personal data typed into a tool is privacy.",
              "A fake video is misinformation; a wrong decision with no one responsible is accountability.",
            ],
            explanation: "Ranking provinces lower repeats unfair training patterns (bias), classmates' grades in a chatbot is privacy, unchecked generated code is licensing, the fake video is a deepfake, shifting agent work is work and jobs, and the wrong deadline with no owner is accountability.",
          },
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**Bias** here means a system treats some people less fairly, usually because the examples it learned from were uneven, like a student who learned a subject from only one textbook. **Licensing** is the owner's rules for using their work. In the activity below you change one detail of a request, such as the person's hometown, and compare the answers. If the answers change in a way that is unfair, you have found a sign of bias. **Accountable** means a named human is responsible for what a system does, not \"the AI did it\".",
        },
        { type: 'heading', text: 'A hands-on bias activity' },
        {
          type: 'paragraph',
          text: "Have students run the same request with small changes and compare results: a job description for a 'programmer' and for a 'nurse', a story about a manager from Manila and one from a rural province, or the same question in English and in Filipino. They document differences and discuss whether they are fair. The results vary by tool and over time, which is itself a lesson: claims must be tested, not assumed.",
        },
        {
          type: 'prompt',
          label: 'Generate a local ethics case',
          text: "Write a realistic, one-page case study for [level] IT students in the Philippines about an ethical problem with an AI-assisted system, e.g. a loan app that scores applicants, a school chatbot or an automated hiring screen. Include the stakeholders, what went wrong, and five discussion questions with no single right answer. Keep it balanced and do not name real companies.",
        },
        {
          type: 'paragraph',
          text: "Use debate and design, not lecture. After discussing a case, ask teams to propose one change to the system that would reduce harm: a human review step, a clearer consent screen, a test with more varied data, or an appeal process for people affected.",
        },
        {
          type: 'tip',
          text: "Connect ethics to their capstone. A short 'risks and harms' section in every proposal, reviewed by the panel, turns ethics from a lecture topic into a design habit.",
        },
        {
          type: 'warning',
          text: "Keep discussions respectful and balanced. Avoid presenting AI as either all good or all bad, and do not ask students to share personal experiences of discrimination in front of the class unless they choose to.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "For software students, make ethics an engineering practice. Introduce a risk-management vocabulary: the NIST AI Risk Management Framework is organised around four functions, Govern, Map, Measure and Manage. Have teams map who is affected and how, then measure with counterfactual tests (change one attribute, hold the rest fixed) and report counts and uncertainty rather than anecdotes, using enough cases to see variation, since outputs differ between runs. Add mitigations a team can build: human review, an appeal path, logging, data minimisation and limits on what the system may decide alone. On code licensing, require students to know the licence of any code they include, whether typed, copied or generated, and to follow their organisation's rules. Keep the discussion on decisions and trade-offs, not slogans.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "The NIST AI Risk Management Framework (AI RMF 1.0, NIST AI 100-1, released January 26, 2023) is organised around four functions: Govern, Map, Measure and Manage.",
          checked: "2026-11-14",
          sources: [
            {
              label: "NIST: AI Risk Management Framework",
              url: "https://www.nist.gov/itl/ai-risk-management-framework",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Students will build AI-including systems, so ethics belongs in class: bias, privacy, licensing, misinformation, work and accountability.",
            "Run the same request with small changes and compare results; claims must be tested, not assumed.",
            "Use debate and design: ask teams to propose one change that would reduce harm.",
            "Connect ethics to capstones with a \"risks and harms\" section.",
            "Keep discussions balanced and respectful; do not ask students to share experiences of discrimination unless they choose to.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-17-q1',
          prompt: 'Where does bias in AI models mainly come from?',
          choices: [
            'Patterns in the data the model learned from',
            'The colour of the app',
            'The student’s internet speed',
          ],
          answer: 0,
          explanation:
            'Models learn from large amounts of human-produced data, including unfair patterns in it.',
        },
        {
          id: 'educator-17-q2',
          prompt: 'Why is the "same request, small change" activity useful?',
          choices: [
            'It proves every AI tool is biased in the same way',
            'It speeds up the AI',
            'It lets students test for differences themselves instead of assuming',
            'It teaches students to avoid AI',
          ],
          answer: 2,
          explanation:
            'Students gather their own evidence, and learn that results vary and must be tested.',
        },
        {
          id: 'educator-17-q3',
          prompt: 'Which proposal best reduces harm in an automated loan-scoring system?',
          choices: [
            'Hide how scores are calculated',
            'Remove all human review to be consistent',
            'Collect more personal data by default',
            'Add a human review and an appeal process for rejected applicants',
          ],
          answer: 3,
          explanation:
            'Human review and appeals give affected people a way to correct mistakes.',
        },
        {
          id: 'educator-17-q4',
          prompt: 'How can ethics become a design habit rather than just a lecture topic?',
          choices: [
            'By giving a long exam on principles',
            'By adding a risks-and-harms section to every capstone proposal',
            'By banning AI in capstones',
            'By skipping it in technical courses',
          ],
          answer: 1,
          explanation:
            'Requiring teams to analyse risks in their own projects makes ethics part of how they build.',
        },
        {
          id: "educator-17-q5",
          audience: { max: "beginner" },
          prompt: "In the \"same request, small change\" activity, what might show that a system is unfair?",
          choices: [
            "The answers come back more slowly when the request is longer",
            "The answers are written in a different font each time",
            "The answers change in an unfair way when only one detail, such as hometown, is changed",
            "The system asks you to sign in before it answers",
          ],
          answer: 2,
          explanation: "Changing one detail and holding everything else fixed isolates its effect. If the answer shifts unfairly, that is a sign of bias worth reporting and discussing.",
        },
        {
          id: "educator-17-q6",
          audience: { min: "advanced" },
          prompt: "A team says their loan-scoring prototype is unbiased after trying three prompts. What is the strongest critique?",
          choices: [
            "Loan prototypes cannot be tested for bias at all",
            "Three prompts are too few to show variation, so they need systematic counterfactual tests with many cases and reported variation",
            "They should have asked the model itself whether it is biased",
            "Three prompts is the correct number for a student project",
          ],
          answer: 1,
          explanation: "Outputs vary between runs and between cases. A claim of fairness needs many controlled cases, counts and an honest statement of uncertainty, not a handful of tries.",
        },
      ],
      task: {
        title: 'Plan one ethics session',
        steps: [
          'Run the case-study prompt and edit the case for your students.',
          'Try the bias activity yourself with two small prompt changes and note the results.',
          'Write the one change-the-system question you will end the session with.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Try two versions of a request that differ in one detail, for example a different hometown or name. Write what changed between the answers and whether it felt fair to you, and why.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Design a counterfactual test table for a small system: the attribute you vary, twenty cases, how you will count results, and how you will handle run-to-run variation. Write one paragraph on what the test cannot show.",
          ],
        },
      ],
    },
    {
      id: 'educator-18',
      day: 18,
      title: 'Building an AI-ready module',
      summary: 'Put everything together into one module you can teach next term.',
      intro: {
        objectives: [
          'List what an AI-ready module contains.',
          'Start from learning outcomes, then choose an AI-use level for each activity.',
          'Mix AI-off practice, AI-assisted practice and an AI-critique activity.',
          'Use [CHECK] marks to track what you must verify before you teach.',
        ],
        why: 'This lesson turns the earlier ones into one module you can teach next term. A module you test with real students is worth more than a perfect one that stays in a folder.',
      },
      minutes: 15,
      skills: ['assessment-design', 'ai-prep', 'ai-programming-pedagogy'],
      body: [
        {
          type: 'paragraph',
          text: "You now have the pieces: AI-assisted prep, AI-aware assignments, a policy, a process rubric, explain-your-code checks, prompting and verification activities, feedback and quiz workflows, accessibility and privacy habits. Today you assemble them into one module, one to three weeks of a course, that is ready for a world with AI.",
        },
        { type: 'heading', text: 'What an AI-ready module contains' },
        {
          type: 'code',
          language: 'text',
          label: 'Module template',
          code: `MODULE: [title]                      COURSE / LEVEL: [e.g. IT 213, 2nd-year BSIT]
DURATION: [e.g. 2 weeks, 4 sessions]

1. Learning outcomes (3 to 5, measurable)
2. AI-use level per activity (allowed / disclosed / not allowed) and why
3. Sessions
   - Hook and direct instruction
   - AI-off practice (fundamentals)
   - AI-assisted practice (tutor mode or pair mode)
   - AI critique activity (prompt makeover or spot-the-error)
4. Assessment
   - Staged deliverables with process evidence
   - Explain-your-code check or short oral defense
   - Process rubric with weights
5. Quiz items (checked, tagged by outcome and level)
6. Accessibility: leveled versions, plain-language notes, alt text
7. Privacy notes: approved tools, what never goes into AI
8. Teacher checks: what to verify before each session
9. Student reflection prompt`,
        },
        {
          type: 'paragraph',
          text: "Start from outcomes, not tools. For each outcome decide how students will show it, then decide the AI-use level that serves that evidence. A module where every activity is 'AI allowed' is as unbalanced as one where AI is banned.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **module** is a small unit of a course, one to three weeks long. Building one is like planning a short chapter in a recipe book: the dish you want (the outcomes), who may use which shortcuts (the AI-use level for each activity), the steps (the sessions) and how you taste-test it (the assessment). The AI can arrange your notes into the template for you. The `[CHECK]` marks it leaves are your to-do list: each one is something you must confirm by running code, reading the real document or asking a colleague, before any student sees it.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-18-scenario-1",
            kind: "scenario",
            title: "Where do you start?",
            prompt: "Where do you start?",
            concept: "designing an ai-ready module",
            situation: "You are planning a module. Your first idea: \"Let students use AI for everything, so it feels modern.\"",
            options: [
              {
                text: "Go ahead and label every activity \"allowed\".",
                consequence: "A module where every activity is \"AI allowed\" is as unbalanced as one where AI is banned.",
                quality: "poor",
              },
              {
                text: "Ban AI everywhere to be safe.",
                consequence: "Students never practise working with AI, and the avoiders and over-relyers stay as they are.",
                quality: "poor",
              },
              {
                text: "Start from the outcomes: decide how students will show each one, then choose the AI-use level that serves that evidence.",
                consequence: "The mix then includes AI-off practice, AI-assisted practice and an AI-critique activity, each with a reason.",
                quality: "best",
              },
            ],
            hints: [
              "Start from outcomes, not tools.",
              "For each outcome, how will students show it?",
              "The level follows from the evidence you want.",
            ],
            explanation: "An AI-ready module is built from outcomes, with an AI-use level per activity and a mix of AI-off, AI-assisted and AI-critique work.",
          },
        },
        {
          type: 'prompt',
          label: 'Assemble your module',
          text: "Help me assemble an AI-ready module from my notes. Course and level: [ ]. Topic: [ ]. Duration: [ ]. Outcomes: [ ]. My class AI-use policy: [paste]. My rubric: [paste]. Use this structure: outcomes, AI-use level per activity with a reason, sessions (including one AI-off practice, one AI-assisted practice and one AI-critique activity), staged assessment with process evidence and an explain-your-code check, accessibility versions, privacy notes and a student reflection prompt. Mark anything I must verify or adapt with [CHECK].",
        },
        {
          type: 'paragraph',
          text: "Then do the work only you can do. Run every code example and solution. Check every quiz item. Estimate time per session against your real class. Replace generic examples with ones from your students' world. Remove every [CHECK] mark by actually checking.",
        },
        {
          type: 'tip',
          text: "Pick a module you will really teach soon. A module you test with real students next term is worth more than a perfect one that stays in a folder. Your second project is exactly this module.",
        },
        {
          type: 'warning',
          text: "If you put the module in a shared document, share it with view access only and keep student data out of it. A teaching module should contain no names, grades or class records.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Package the module like a maintained software artefact: a repository or shared folder with the outline, student handouts, instructor guide, rubric, question bank and test files, a version number and a change log. Keep an alignment matrix from outcomes to activities to evidence, and a policy label per activity. Pilot in one section, then revise using the evidence from lesson 20. Keep your own prompts beside the materials, with an instructions file that records the course level, tool versions, house style and rules such as \"run the tests before declaring done\"; tools such as Claude Code and GitHub Copilot read such files, so you, or a colleague next term, can regenerate consistent materials. Add a re-test routine: each term, rerun the key assignments against current models and log what changed.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Claude Code reads CLAUDE.md files as persistent project instructions and can also read a repository's AGENTS.md files. GitHub Copilot supports repository instructions in .github/copilot-instructions.md and in AGENTS.md files. Check each tool's documentation for the version you use.",
          checked: "2026-11-14",
          sources: [
            {
              label: "Claude Code: how Claude remembers your project (CLAUDE.md, AGENTS.md)",
              url: "https://code.claude.com/docs/en/memory",
            },
            {
              label: "GitHub Docs: repository custom instructions for Copilot",
              url: "https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "An AI-ready module has outcomes, AI-use levels per activity, sessions, staged assessment, accessibility, privacy notes and a reflection prompt.",
            "Start from outcomes, not tools.",
            "Include AI-off practice, AI-assisted practice and an AI-critique activity.",
            "Run every example and check every quiz item before you teach it.",
            "Keep student names, grades and records out of shared documents.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-18-q1',
          prompt: 'What should you design first in an AI-ready module?',
          choices: [
            'The AI tool students will use',
            'The slide design',
            'The learning outcomes and how students will show them',
          ],
          answer: 2,
          explanation:
            'Outcomes come first. AI-use levels and activities follow from the evidence each outcome needs.',
        },
        {
          id: 'educator-18-q2',
          prompt: 'Why include an AI-off practice activity in the module?',
          choices: [
            'Students build fundamentals they need to judge AI output',
            'AI tools are unreliable on certain weekdays',
            'To save school internet',
            'It is required in every course by law',
          ],
          answer: 0,
          explanation:
            'Fundamentals practised without AI give students the base for checking AI suggestions later.',
        },
        {
          id: 'educator-18-q3',
          prompt: 'What do the [CHECK] marks in the assembled draft mean?',
          choices: [
            'Parts the AI is certain about',
            'Parts to delete',
            'Parts students should check',
            'Parts you must verify or adapt before teaching',
          ],
          answer: 3,
          explanation:
            'They flag what the teacher must verify. The module is not ready until every mark is resolved.',
        },
        {
          id: 'educator-18-q4',
          prompt: 'A module where every activity is "AI allowed" is:',
          choices: [
            'The most modern design possible',
            'As unbalanced as one where AI is banned',
            'Required by CHED',
            'Easier for students to learn from',
          ],
          answer: 1,
          explanation:
            'Students need a mix: some AI-off practice for fundamentals and some AI-assisted work for real-world skills.',
        },
        {
          id: "educator-18-q5",
          audience: { max: "beginner" },
          prompt: "In plain words, what is a \"module\" in a course?",
          choices: [
            "A single quiz question with four choices",
            "A small unit of a course, one to three weeks long, with its own outcomes, activities and assessment",
            "A computer program that grades students automatically",
            "The list of rules for how students behave in the lab",
          ],
          answer: 1,
          explanation: "A module is one planned stretch of teaching. Planning it as a whole lets you decide outcomes, AI-use levels and assessment together.",
        },
        {
          id: "educator-18-q6",
          audience: { min: "advanced" },
          prompt: "You want a colleague to regenerate your module's materials next term with consistent results. What should be kept in the repository?",
          choices: [
            "The prompts and an instructions file with level, tool versions and style, plus the alignment matrix and a change log",
            "Only the final PDF handouts that students received",
            "A list of the AI tools you used with their prices",
            "Screenshots of the chat conversations you had",
          ],
          answer: 0,
          explanation: "Prompts, instructions and the alignment matrix are the source of the materials, like source code. With a change log, they make the module reproducible and reviewable.",
        },
      ],
      task: {
        title: 'Start your module',
        steps: [
          'Choose the module you will teach next term and write its outcomes.',
          'Copy the template into a document and fill in sections 1 and 2.',
          'Run the assemble prompt with your policy and rubric.',
          'List every [CHECK] item and verify the first three.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write your module's outcomes and one AI-use sign (green, yellow or red) for each session in a small table. Ask an AI assistant to read it back to you as if explaining it to a new teacher, and note anything unclear.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Create a repository for the module with the outline, rubric, tests, an instructions file (course level, tool versions, house style, rules) and an alignment matrix. Tag the first version and write the first change-log entry.",
          ],
        },
      ],
    },
    {
      id: 'educator-19',
      day: 19,
      title: 'Working with your department',
      summary: 'Share what works, start small with colleagues and help your department agree on common ground.',
      intro: {
        objectives: [
          'Start small with one or two curious colleagues and a one-term pilot.',
          "Respond respectfully to colleagues' concerns about cheating, workload and control.",
          'Propose common ground: shared labels, a disclosure format, approved tools and a learning circle.',
          'Check school policy yourself before you cite an agency in a proposal.',
        ],
        why: 'Students notice when one teacher allows AI and another treats it as cheating with no explanation. Shared language across the department makes the rules fairer, and it starts with your own pilot.',
      },
      minutes: 15,
      skills: ['ai-policy', 'responsible-ai'],
      body: [
        {
          type: 'paragraph',
          text: "Changes in one classroom help your students. Changes across a department help every student in the program. Students also notice when one teacher allows AI and another treats it as cheating with no explanation; shared language makes the rules fairer and easier to follow.",
        },
        { type: 'heading', text: 'Start small' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Find one or two colleagues who are curious, not necessarily experts.',
            'Share your policy and rubric and ask for honest feedback.',
            'Pilot one AI-aware assignment in two sections for one term.',
            'Share what happened, including what did not work.',
          ],
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **pilot** is a small trial before a big change, like testing a new menu item on one table before changing the whole restaurant. **Common ground** means the few rules everyone agrees on, while each teacher still decides the details of their own class. Bring **evidence** from your own classes, such as survey answers and results of explain-your-code checks, because colleagues trust what happened in your room more than what an article says. A **learning circle** is a small group of teachers who meet regularly to share what worked and what did not.",
        },
        { type: 'heading', text: 'Listen to the concerns' },
        {
          type: 'paragraph',
          text: "Colleagues may worry about cheating, extra workload, losing control of their courses or being replaced. These are fair concerns. Answer them with your own experience: the assignment you redesigned, the time the feedback workflow saved, the conversation that worked better than a detector. Respect colleagues who choose to keep AI out of certain courses; the aim is clarity, not uniformity.",
        },
        { type: 'heading', text: 'Propose common ground, not one rule for all' },
        {
          type: 'list',
          items: [
            'Shared labels for AI-use levels (allowed / disclosed / not allowed).',
            'A shared disclosure format students learn once.',
            'An agreement that detector scores alone are not evidence.',
            'A list of approved tools and privacy rules, agreed with IT and the Data Protection Officer.',
            'A short faculty learning circle that meets once a month.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "educator-19-scenario-1",
            kind: "scenario",
            title: "A colleague who says no",
            prompt: "How do you respond?",
            concept: "working with your department",
            situation: "A colleague wants to keep AI out of her programming fundamentals course because she fears students will cheat.",
            options: [
              {
                text: "Push the department to make every course adopt your policy.",
                consequence: "The aim is clarity, not uniformity. Pushing creates resistance.",
                quality: "poor",
              },
              {
                text: "Listen, share what worked for you, and propose shared labels and a disclosure format so rules are clear without being identical.",
                consequence: "Her concern is fair, and a course with AI off can be a labelled level in the shared system.",
                quality: "best",
              },
              {
                text: "Drop the conversation: some colleagues cannot be persuaded.",
                consequence: "You lose a colleague whose concerns your pilot could address.",
                quality: "poor",
              },
            ],
            hints: [
              "Her concern about cheating is a fair one.",
              "Which common ground can include her choice?",
              "Respect colleagues who keep AI out of certain courses.",
            ],
            explanation: "Start small, listen to concerns, and propose common ground rather than one rule for all.",
          },
        },
        {
          type: 'prompt',
          label: 'One-page proposal to your chair',
          text: "Help me write a one-page proposal to my department chair at a [college / university / senior high school] in the Philippines. I want to propose: shared AI-use labels for assignments, a common disclosure format, a principle that AI detector results alone are not evidence of misconduct, and a monthly faculty learning circle. Include the problem, the proposal, a small pilot plan for one term, the support needed, and how we will measure results. Mention checking alignment with existing school policy and any guidance from the relevant agency (CHED, DepEd or TESDA). Keep the tone collaborative.",
        },
        {
          type: 'tip',
          text: "Bring evidence, not opinions. One page of results from your own pilot (student feedback, explain-your-code check results, time saved) persuades more than any article about AI.",
        },
        {
          type: 'warning',
          text: "Do not assume what national agencies or your school require. Check the current institutional policy and any official guidance yourself before you cite it in a proposal.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "At department level you are doing governance and change management. Define a light decision structure: who approves tools, who owns the policy, how exceptions are requested and how often it is reviewed. Build the approved-tools list with IT, the Data Protection Officer and procurement against stated criteria: data handling and retention, accessibility, cost to students and fair access for students on prepaid data. Set an assessment standard: shared AI-use labels, a common disclosure format, a written evidence standard for integrity cases, and a requirement that high-stakes assessments include a supervised or oral element. Run the pilot with measures declared in advance and a stop condition. Keep shared course artefacts in a common repository with version history, and align with institutional and national guidance that you have checked yourself rather than citing it from memory.",
        },
        {
          type: "takeaways",
          items: [
            "Changes in one classroom help your students; changes across a department help the whole program.",
            "Start small: one or two curious colleagues, a pilot in two sections, and honest sharing of what did not work.",
            "Listen to concerns about cheating, workload and control; respect those who keep AI out of some courses.",
            "Propose common ground: shared labels, a disclosure format, detector scores alone are not evidence, approved tools, a faculty learning circle.",
            "Bring evidence from your pilot, and check school policy before citing agencies.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-19-q1',
          prompt: 'What is a good first step for bringing AI practices to your department?',
          choices: [
            'Ask the dean to make a strict rule for everyone immediately',
            'Pilot with one or two curious colleagues and share results',
            'Wait until every teacher agrees',
          ],
          answer: 1,
          explanation:
            'A small pilot builds evidence and allies without forcing anyone, and shows what works locally.',
        },
        {
          id: 'educator-19-q2',
          prompt: 'Which proposal gives students clarity without forcing one rule on every course?',
          choices: [
            'Ban AI in all courses',
            'Allow AI in all courses',
            'Let each teacher decide silently',
            'Shared AI-use labels each teacher applies to their own assignments',
          ],
          answer: 3,
          explanation:
            'Shared labels keep the language consistent while each teacher still sets the level per activity.',
        },
        {
          id: 'educator-19-q3',
          prompt: 'A colleague worries AI will make cheating impossible to control. What is the best response?',
          choices: [
            'Share your own experience with redesigned assignments and explain-your-code checks',
            'Tell them they are wrong',
            'Recommend a detector tool',
            'Avoid the topic',
          ],
          answer: 0,
          explanation:
            'Concrete experience addresses the concern respectfully and shows practical alternatives.',
        },
        {
          id: 'educator-19-q4',
          prompt: 'Before citing an agency’s AI guidance in your proposal, you should:',
          choices: [
            'Ask an AI tool what the guidance says',
            'Assume it exists',
            'Read the current official guidance yourself',
            'Leave out the source',
          ],
          answer: 2,
          explanation:
            'AI tools can be wrong or outdated about policy. Check the official, current source directly.',
        },
        {
          id: "educator-19-q5",
          audience: { max: "beginner" },
          prompt: "What is a \"pilot\" when changing how a department works?",
          choices: [
            "A rule that every teacher must follow from next week",
            "A person who flies the school's drones",
            "A survey that only the department chair answers",
            "A small trial, for example in two sections for one term, before deciding on a bigger change",
          ],
          answer: 3,
          explanation: "A pilot lets you try an idea on a small scale and learn what works before asking everyone to change. It also gives you evidence from your own school.",
        },
        {
          id: "educator-19-q6",
          audience: { min: "advanced" },
          prompt: "Your chair asks whether to buy an AI tool licence for all students. Which set of criteria is the most defensible?",
          choices: [
            "How well known the tool is and how many users it has",
            "Which tool the most senior teacher already uses at home",
            "Data handling and retention, accessibility, cost and access for students on prepaid data, and evidence of learning from a pilot",
            "Which tool has the longest list of features on its website",
          ],
          answer: 2,
          explanation: "A defensible decision rests on privacy, accessibility, fairness of access and evidence from your own students. Popularity and feature lists say little about whether it fits your school.",
        },
      ],
      task: {
        title: 'Draft your department proposal',
        steps: [
          'Name one or two colleagues you could pilot with.',
          'Run the proposal prompt and edit it to fit your school.',
          'Check your school’s current policy and note anything the proposal must align with.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write three sentences to a colleague explaining what a pilot would look like in their class: what you would try, for how long, and what you would look at afterwards. Ask an AI assistant to make it friendlier and compare.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Draft a one-page tool-evaluation checklist (data handling, retention, accessibility, cost and access) and a pilot protocol with measures declared in advance and a stop condition. Ask your Data Protection Officer to review the checklist.",
          ],
        },
      ],
    },
    {
      id: 'educator-20',
      day: 20,
      title: 'Measuring results and keeping up',
      summary: 'Check whether your changes help students learn, and build a light habit for keeping current.',
      intro: {
        objectives: [
          'Choose what to measure: learning, understanding, habits, student experience and your own time.',
          'Read a short script that compares pre-test and post-test scores.',
          "Explain why one small section's results are a signal to discuss, not proof.",
          'Plan a light habit for keeping up with new tools.',
        ],
        why: 'You have changed how you prepare, assess and teach, and now you need honest evidence that it helps. A simple measure each term, and a small monthly habit, keep your course current without burning you out.',
      },
      minutes: 15,
      skills: ['assessment-design', 'teaching-ai-skills'],
      body: [
        {
          type: 'paragraph',
          text: "You have changed how you prepare, assess and teach. The last step is finding out whether it works. You do not need a research study, just simple, honest evidence you collect along the way and look at once a term.",
        },
        { type: 'heading', text: 'What to measure' },
        {
          type: 'list',
          items: [
            '**Learning:** pre-test and post-test scores on the module outcomes.',
            '**Understanding:** results of explain-your-code checks and oral defenses.',
            '**Habits:** how many students submit tests, disclosures and process evidence.',
            '**Experience:** a short anonymous student survey at the end of the module.',
            '**Your time:** hours spent on prep and feedback, before and after.',
          ],
        },
        {
          type: 'code',
          language: 'python',
          label: 'Compare pre-test and post-test scores',
          code: `from statistics import mean

# Scores out of 20 for the same students, in the same order. Use codes, not names.
pre = [12, 15, 9, 18, 14, 11, 16]
post = [16, 17, 13, 19, 18, 12, 18]

gains = [after - before for before, after in zip(pre, post)]

print(f"Average pre-test: {mean(pre):.1f}")
print(f"Average post-test: {mean(post):.1f}")
print(f"Average gain: {mean(gains):.1f}")
print(f"Students who improved: {sum(g > 0 for g in gains)} of {len(gains)}")`,
        },
        {
          type: 'paragraph',
          text: "Here is how the script works. `zip(pre, post)` pairs each student's two scores, so `gains` holds one number per student: the post-test score minus the pre-test score. `mean` from the `statistics` module averages a list, and `:.1f` prints one decimal place. `sum(g > 0 for g in gains)` counts the students whose gain is above zero, because each true comparison counts as 1. With this made-up data the gains are 4, 2, 4, 1, 4, 1 and 2, so the average gain is 18 divided by 7, about 2.6, and all 7 students improved.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "To check whether a change helped, compare before and after. A **pre-test** is a short test at the start and a **post-test** is the same kind of test at the end. A **gain** is the score after minus the score before. The **average** (the mean) adds up all the gains and divides by the number of students, which the script above does for you. With a small class, a good result is a hint, not a proof, like one rainy day not making a rainy season. Use it to start a conversation with your colleagues and your students.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-20-predict-output-1",
            kind: "predict-output",
            title: "What do the scores say?",
            prompt: "This is a trimmed version of the lesson's script. What does it print?",
            concept: "comparing pre-test and post-test scores",
            language: "python",
            code: "from statistics import mean\n\npre = [12, 15, 9, 18, 14, 11, 16]\npost = [16, 17, 13, 19, 18, 12, 18]\ngains = [after - before for before, after in zip(pre, post)]\nprint(f\"Average gain: {mean(gains):.1f}\")\nprint(f\"Students who improved: {sum(g > 0 for g in gains)} of {len(gains)}\")",
            expected: "Average gain: 2.6\nStudents who improved: 7 of 7",
            choices: [
              "Average gain: 2.6\nStudents who improved: 7 of 7",
              "Average gain: 2.6\nStudents who improved: 5 of 7",
              "Average gain: 18.0\nStudents who improved: 7 of 7",
              "Average gain: 2.5\nStudents who improved: 7 of 7",
            ],
            wrongNotes: {
              "Average gain: 18.0\nStudents who improved: 7 of 7": "18 is the sum of the gains. `mean` divides it by 7.",
              "Average gain: 2.6\nStudents who improved: 5 of 7": "Every gain is positive (the smallest is 1), so all 7 improved.",
              "Average gain: 2.5\nStudents who improved: 7 of 7": "18 / 7 is 2.571..., which rounds to 2.6 with one decimal.",
            },
            hints: [
              "Work out each student's gain: post minus pre.",
              "The gains are 4, 2, 4, 1, 4, 1, 2. Add them up and divide by 7.",
              "`g > 0` is true for every gain here, and `.1f` keeps one decimal.",
            ],
            explanation: "The gains sum to 18, so the mean is 18 / 7, which is about 2.6. Every gain is above zero, so all 7 students improved. Even so, a small sample is a signal to discuss, not proof.",
          },
        },
        {
          type: 'paragraph',
          text: "Read your numbers with care. One section of 30 students is a small sample, sections differ, and many things change at once. Treat results as signals to discuss with colleagues, not proof. If explain-your-code checks show many students cannot explain their work, that is useful even without statistics.",
        },
        {
          type: "activity",
          activity: {
            id: "educator-20-scenario-1",
            kind: "scenario",
            title: "Higher than before",
            prompt: "How do you read the result?",
            concept: "honest evaluation",
            situation: "In one section of 30 students the post-test average is higher than the pre-test. A colleague says this proves your new module works.",
            options: [
              {
                text: "Agree and tell the department the module is proven.",
                consequence: "One small section, many things changed at once, and sections differ. It is a signal, not proof.",
                quality: "poor",
              },
              {
                text: "Treat it as a signal to discuss: note the small sample, and look at the explain-your-code checks and the student survey as well.",
                consequence: "Several honest kinds of evidence together say more than one average.",
                quality: "best",
              },
              {
                text: "Ignore the data: one section is too small to learn anything.",
                consequence: "Small samples still tell you something, and explain-your-code results can be useful even without statistics.",
                quality: "poor",
              },
            ],
            hints: [
              "How many students and sections is this?",
              "What else changed during the term?",
              "Combine several kinds of evidence instead of one number.",
            ],
            explanation: "Read your numbers with care: small samples, differing sections and many simultaneous changes mean results are signals, not proof.",
          },
        },
        { type: 'heading', text: 'Keeping up without burning out' },
        {
          type: 'list',
          items: [
            'Block 30 minutes a month to try one new feature or tool on a real task.',
            'Follow the official documentation or release notes of the tools you actually use.',
            'Re-test your key assignments with AI each term, since tools improve.',
            'Update your policy each term and tell students what changed.',
            'Join or start a small community of teachers to share what works.',
          ],
        },
        {
          type: 'prompt',
          label: 'Term review',
          text: "Help me review my AI-ready module after one term. Here is my data (anonymized): pre/post averages [ ], explain-your-code check results [ ], number of students submitting process evidence [ ], survey highlights [ ], my time on prep and feedback [ ]. Tell me what the data suggests, what it cannot tell me, three changes to try next term, and one question to ask my students. Be cautious about conclusions from a small sample.",
        },
        {
          type: 'tip',
          text: "You do not need to chase every new tool. The core habits in this course (clear outcomes, AI-aware assessment, verification, privacy and honest disclosure) stay useful no matter which tools come next.",
        },
        {
          type: 'paragraph',
          text: "Finish your AI-ready module project and your certificate is ready for your faculty file. More importantly, your students will leave your class able to use AI with judgment, which is what they will need most.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat your evaluation as a small quasi-experiment and be honest about its limits. Fix the measures before the term, use the same pre and post instrument, and record context such as section size, schedule and tool access. Compare like with like, perhaps two sections with the same outcomes, but remember that sections differ and students are not randomly assigned. Report the gain with its spread, not a bare average, and look at the distribution, not only the mean. Triangulate with explain-your-code results, process evidence submitted and survey themes; when they disagree, investigate rather than choosing the favourable one. Analyse coded data only. For staying current, keep a regression suite of your own: key assignments and prompts re-run against current models each term, dated, so you notice when an assessment stops separating students who understand from those who do not.",
        },
        {
          type: "takeaways",
          items: [
            "Check whether your changes help students learn, with simple honest evidence once a term.",
            "Measure learning (pre and post tests), understanding (explain-your-code checks), habits, student experience and your own time.",
            "Treat results from a small sample as signals to discuss, not proof.",
            "Keep up lightly: a monthly 30 minutes, re-test your assignments each term and update your policy.",
            "The core habits last longer than any tool.",
          ],
        },
      ],
      quiz: [
        {
          id: 'educator-20-q1',
          prompt: 'In the script, what does `gains` hold?',
          choices: [
            'The difference between each student’s post-test and pre-test score',
            'The average of all scores',
            'The highest score in each test',
          ],
          answer: 0,
          explanation:
            'It pairs each student’s scores with `zip` and subtracts pre from post, one gain per student.',
        },
        {
          id: 'educator-20-q2',
          prompt: 'Your section’s average gain rose this term. What is the right conclusion?',
          choices: [
            'The module definitely caused it',
            'It is a positive signal worth discussing, not proof',
            'The data is useless',
            'You should stop measuring',
          ],
          answer: 1,
          explanation:
            'Small samples and many changing factors mean results are signals, not proof of cause.',
        },
        {
          id: 'educator-20-q3',
          prompt: 'Why re-test your key assignments with AI each term?',
          choices: [
            'Because students forget them',
            'Because AI tools never change',
            'To raise the passing grade',
            'Because tools improve and may now complete what they could not before',
          ],
          answer: 3,
          explanation:
            'An assignment that measured learning last term may be fully solvable by AI this term.',
        },
        {
          id: 'educator-20-q4',
          prompt: 'Which habit keeps you current without burning out?',
          choices: [
            'Trying every new tool the day it appears',
            'Ignoring AI news completely',
            'A regular 30 minutes a month on one tool or feature, on a real task',
            'Reading every AI article online',
          ],
          answer: 2,
          explanation:
            'A small, regular, practical habit beats both chasing everything and ignoring change.',
        },
        {
          id: "educator-20-q5",
          audience: { max: "beginner" },
          prompt: "Why is one good result in one small class only a hint, not a proof?",
          choices: [
            "Many things change at once, and a small class can be lucky, so the result may not repeat",
            "Small classes always give worse results than big ones",
            "Results only count if the teacher did not see them",
            "Averages cannot be calculated for fewer than a hundred students",
          ],
          answer: 0,
          explanation: "With few students, one strong or weak group can move the average, and sections differ in many ways. Treat the result as a signal to discuss with other evidence.",
        },
        {
          id: "educator-20-q6",
          audience: { min: "advanced" },
          prompt: "Section A used the new module, section B did not, and A's average gain is higher. What is the most defensible statement?",
          choices: [
            "The module caused the higher gain, so every section should adopt it",
            "It is consistent with the module helping, but sections differ and were not assigned at random, so check it against other evidence",
            "The result is meaningless because the sections have different students",
            "The higher average proves that section B's teacher taught poorly",
          ],
          answer: 1,
          explanation: "The comparison is a signal, not proof. Differences between sections and the lack of random assignment mean you should look at the distribution and other evidence before concluding anything.",
        },
      ],
      task: {
        title: 'Set up your measurement and learning habit',
        steps: [
          'Write a five-question pre-test for your AI-ready module’s outcomes.',
          'Run the script with made-up scores to see how it works.',
          'Put a recurring 30-minute monthly block in your calendar.',
          'Plan when you will run the term review prompt.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Take the made-up scores in the script, work out the gain for three students by hand (post minus pre), and check your answers against what the script prints. Write one sentence on why a small class gives only a hint.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Extend the script to print the minimum, median and maximum gain and the number of students whose gain is below zero. Write a one-paragraph limitations note for your evaluation: section differences, no random assignment and sample size.",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      id: 'educator-p1',
      title: 'Your class AI-use policy and rubric',
      summary:
        'Write a class AI-use policy with three levels and a disclosure format, plus a rubric that values process for one real assignment.',
      outcome: 'A ready-to-use policy and rubric you can share with students, your chair or a faculty evaluation.',
      unlockAfterDay: 8,
      steps: [
        {
          id: 'educator-p1-s1',
          text: 'Choose one course you teach and one major assignment in it.',
        },
        {
          id: 'educator-p1-s2',
          text: 'Read your student handbook’s academic integrity section and any school AI guidance, and note what your policy must align with.',
        },
        {
          id: 'educator-p1-s3',
          text: 'Draft the policy with the three levels (allowed, allowed with disclosure, not allowed), a disclosure format, a privacy line and how undisclosed use is handled through the school process.',
        },
        {
          id: 'educator-p1-s4',
          text: 'Write a process rubric for the assignment with observable descriptors and 40 to 60 percent of the weight on process.',
        },
        {
          id: 'educator-p1-s5',
          text: 'Test the rubric by grading an AI attempt at the assignment, and adjust it if that attempt scores very high without process evidence.',
        },
        {
          id: 'educator-p1-s6',
          text: 'Ask one colleague to read both, then paste the final policy and rubric below (no student names or data).',
        },
        {
          id: "educator-p1-s7",
          audience: { max: "beginner" },
          text: "Scaffold for newcomers: keep the policy to one page and the rubric to four rows (plan, testing, explanation, final product). Ask an AI assistant to explain any word you do not know in everyday language, and write one sentence of your own for each row saying how you would check it.",
        },
        {
          id: "educator-p1-s8",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Test your rubric on two real submissions with the names removed, as well as on the AI attempt. Note any descriptor where you hesitated or where the AI attempt scored too well, and rewrite it so another teacher could check it.",
        },
        {
          id: "educator-p1-s9",
          audience: { min: "advanced" },
          text: "Describe tool classes (chat assistant, in-editor completion, coding agent) instead of product names, and add a line on agents that edit files and run commands. Keep a disclosure template in a repository, write a short evidence standard for integrity cases that does not rely on detector scores, and date the policy. Calibrate the rubric with a colleague on three anonymised submissions and record where you disagreed.",
        },
        {
          id: "educator-p1-s10",
          audience: { min: "professional" },
          text: "Add a one-line rationale for each AI-use level tied to a learning outcome, a change-log entry for the policy, and a plan to re-run your red-team of the assignment each term against current models and record the date.",
        },
      ],
      submission: {
        kind: 'text',
        label: 'Your policy and rubric',
        placeholder: 'Paste your class AI-use policy, then the rubric for your chosen assignment…',
        hint: 'Include the course and level, the three AI-use levels with examples, the disclosure format, and the rubric with criteria, weights and performance levels.',
      },
      rubric: [
        'Defines allowed, allowed with disclosure and not allowed, each with a concrete example from the course',
        'Includes a disclosure format and states that honest disclosure is not penalized',
        'Handles undisclosed use through the school’s integrity process and does not rely on detector scores alone',
        'Rubric puts meaningful weight on process (plan, iteration, verification, explanation) with observable descriptors',
        'Includes a privacy line about not pasting personal data into AI tools',
        'Written in plain language a student at that level can follow',
      ],
      rubricExtra: [
        {
          audience: { max: "beginner" },
          items: [
            "A one-page policy and a four-row rubric are enough if every row has an observable descriptor and the learner can explain in plain words what each AI-use level means.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          items: [
            "The rubric was tried on at least two anonymised submissions and the AI attempt, and the learner records which descriptors were rewritten as a result.",
          ],
        },
        {
          audience: { min: "advanced" },
          items: [
            "The policy names tool classes rather than products, covers coding agents, includes a disclosure template and an evidence standard that does not rely on detector scores, and carries a date; the rubric was calibrated with a second grader.",
          ],
        },
        {
          audience: { min: "professional" },
          items: [
            "Each AI-use level has a short rationale tied to an outcome, the policy has a change log, and there is a dated plan to re-test the assignment against current models.",
          ],
        },
      ],
    },
    {
      id: 'educator-p2',
      title: 'An AI-ready lesson module',
      summary:
        'Build a one-to-three-week module with outcomes, AI-use levels per activity, staged assessment with process evidence, accessibility versions and privacy notes.',
      outcome: 'A complete, teachable module that shows your department how a course can work in a world with AI.',
      unlockAfterDay: 18,
      steps: [
        {
          id: 'educator-p2-s1',
          text: 'Pick a module you will actually teach next term and write 3 to 5 measurable learning outcomes.',
        },
        {
          id: 'educator-p2-s2',
          text: 'Copy the module template from day 18 into a document or slide deck.',
          link: 'https://docs.google.com',
        },
        {
          id: 'educator-p2-s3',
          text: 'Plan the sessions with at least one AI-off practice, one AI-assisted practice and one AI-critique activity, each labelled with its AI-use level.',
        },
        {
          id: 'educator-p2-s4',
          text: 'Add the assessment: staged deliverables, an explain-your-code check or short defense, your process rubric and checked quiz items.',
        },
        {
          id: 'educator-p2-s5',
          text: 'Add accessibility versions, privacy notes and a student reflection prompt, and verify every code example and quiz item.',
        },
        {
          id: 'educator-p2-s6',
          text: 'Remove any student data, set sharing to view-only for anyone with the link, and submit the link.',
        },
        {
          id: "educator-p2-s7",
          audience: { max: "beginner" },
          text: "Scaffold for newcomers: plan just one week with two sessions. Fill each section of the template in plain sentences, keep one AI-off and one AI-assisted practice, and ask an AI assistant to read your module back and tell you what a new teacher would find unclear.",
        },
        {
          id: "educator-p2-s8",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Add a small automatic check for one exercise, even a few `assert` lines. Run the reference solution against it, then run a deliberately wrong version and show that it fails.",
        },
        {
          id: "educator-p2-s9",
          audience: { min: "advanced" },
          text: "Keep the module in a repository with the outline, handouts, rubric, question bank, tests and an instructions file (course level, tool versions, house style, rules such as \"run tests before declaring done\"), plus an alignment matrix from outcomes to activities to evidence and a change log.",
        },
        {
          id: "educator-p2-s10",
          audience: { min: "professional" },
          text: "Pilot the module in one section with measures declared in advance and a stop condition, write a one-page evaluation that states its limits, and add a routine that re-runs the key assignments against current models each term and logs what changed.",
        },
      ],
      submission: {
        kind: 'url',
        label: 'Link to your module',
        placeholder: 'https://docs.google.com/…',
        hint: 'A view-only link to a document or slides with outcomes, AI-use levels per activity, sessions, assessment with rubric, accessibility and privacy notes. No student names or records.',
      },
      rubric: [
        'Outcomes are measurable and every activity and assessment connects to one',
        'Each activity has an AI-use level with a reason, and the mix includes AI-off and AI-assisted work',
        'Assessment collects process evidence and includes an explain-your-code check or defense',
        'Includes at least one accessibility or differentiated version of an activity',
        'Privacy notes name what must never go into AI tools, and the module contains no student data',
        'Content is accurate: code examples and quiz items have been checked',
      ],
      rubricExtra: [
        {
          audience: { max: "beginner" },
          items: [
            "One week of two sessions is enough if each session has an outcome, an AI-use sign and a way to check learning, and the learner can explain the plan in plain words.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          items: [
            "At least one exercise has an automatic check that passes the reference solution and fails a deliberately wrong version.",
          ],
        },
        {
          audience: { min: "advanced" },
          items: [
            "The repository holds the module files, an instructions file, an alignment matrix and a change log, and a colleague could regenerate consistent materials from it.",
          ],
        },
        {
          audience: { min: "professional" },
          items: [
            "A pilot with pre-declared measures and a stop condition was run or planned, the evaluation states its limits, and there is a dated re-test routine for current models.",
          ],
        },
      ],
    },
  ],
  coachRole: {
    id: 'lesson-planner',
    label: 'Lesson plan & rubric drafter',
    description: 'Tali drafts lesson plans, activities and rubrics from your topic and level, and marks what you should check.',
    instructions:
      "You are helping an IT instructor or professor draft lesson plans, class activities and rubrics. Ask for the topic, the student level, the session length and the learning outcomes if they are missing, and fit the draft to Philippine classrooms (colleges, senior high ICT, bootcamps) and realistic lab conditions. Always label each activity with an AI-use level (allowed, allowed with disclosure, not allowed) and give rubrics observable descriptors with meaningful weight on process. Mark every technical claim, code snippet, curriculum code or reference the teacher must verify with [CHECK], and never invent official CHED, DepEd or TESDA codes. Never ask for or include student names, grades or other personal data, and remind the teacher to remove it if they paste any.",
  },
  icon: 'cast_for_education',
  updated: '2026-11-13',
};
