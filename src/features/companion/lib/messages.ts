import type { TaliMood } from '@/components/brand/tali';
import type { Language } from '@/lib/i18n';

/**
 * What Tali says, as a friendly personal tutor: warm, short, about the lesson in front of the learner and how they
 * are really doing, never the same line on every screen. Every function is pure and deterministic: the same lesson
 * and situation give the same words (so nothing flickers on a re-render) while different lessons and situations vary
 * (`pick` chooses from the wording by a stable hash of `seed`). Nothing here gives away an answer: after a wrong
 * answer Tali encourages and points to the explanation, and hints stay the activity's own.
 *
 * Every function also takes the learner's `language` (English when left out). Tagalog is a parallel set of wording
 * written for the same situations (same meaning, same facts, same moods), not a translation of the English strings; its
 * tone and glossary are in `docs/i18n/tagalog-style-guide.md`.
 */
export type Line = { text: string; mood: TaliMood };

/** A stable pick from `options` for `seed` (the same seed always gives the same one). */
export function pick<T>(options: readonly T[], seed: string): T {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return options[hash % options.length];
}

const first = (name: string) => name.trim().split(/\s+/)[0] ?? '';
/** ", Ford" or nothing, so a line reads right with or without a name. */
const comma = (name: string) => (first(name) ? `, ${first(name)}` : '');
const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const trimDot = (text: string) => text.replace(/[.!?]+$/, '');
/** " Ford" or nothing ("Hi Ford!"), the Tagalog counterpart of `comma` for greetings that take the name without a comma. */
const space = (name: string) => (first(name) ? ` ${first(name)}` : '');

export type CourseFacts = { id: string; title: string; kind: 'starter' | 'career' | 'mini' | 'path' | 'standard'; lessons: number };

/** Opening a course: a welcome the first time, a "where you are" after that, and a congratulation at the end. */
export function courseIntroLine(input: { name: string; course: CourseFacts; lessonsDone: number; nextLessonTitle: string | null; hasCertificate: boolean; language?: Language }): Line {
  const { course, lessonsDone, nextLessonTitle } = input;
  const seed = `course:${course.id}`;
  if (input.language === 'fil') {
    if (lessonsDone >= course.lessons) {
      return {
        text: input.hasCertificate ? `Natapos mo na ang ${course.title}${comma(input.name)}! Ready na ang certificate mo. Sobrang proud ako sa'yo!` : `Natapos mo na ang ${course.title}${comma(input.name)}! Malaking bagay 'yan. Sobrang proud ako sa'yo!`,
        mood: 'accomplished',
      };
    }
    if (lessonsDone > 0) {
      return {
        text: `Nandito ka na ulit${comma(input.name)}! ${lessonsDone} sa ${course.lessons} lesson na ang tapos mo, ${course.lessons - lessonsDone} na lang ang natitira.${nextLessonTitle ? ` Susunod: ${trimDot(nextLessonTitle)}.` : ''} Tuloy na ba tayo?`,
        mood: 'happy',
      };
    }
    const howFil = {
      starter: 'Magsisimula tayo sa basics, isang maliit na hakbang sa bawat pagkakataon.',
      career: 'Sa dulo, may certificate kang maipagmamalaki, at sasamahan kita hanggang matapos.',
      mini: 'Maikli lang ito, kaya matatapos mo agad at masarap sa pakiramdam.',
      path: 'Gagamitin natin ang AI tools nang maingat: ikaw ang masusunod, at titingnan natin ang bawat resulta.',
      standard: 'Sa bawat lesson, may turo muna, tapos quiz, tapos practice na ikaw mismo ang gagawa. Nandito lang ako kung nahihirapan ka.',
    }[course.kind];
    return {
      text: pick([`Hello${comma(input.name)}! Ready ka na bang matuto ng bago? ${howFil}`, `Hi${space(input.name)}! Ito ang ${course.title}: ${course.lessons} lesson. ${howFil}`, `Uy${comma(input.name)}! Tara, simulan natin ang ${course.title}! ${howFil}`], seed),
      mood: 'excited',
    };
  }
  if (lessonsDone >= course.lessons) {
    return {
      text: input.hasCertificate ? `You finished ${course.title}${comma(input.name)}! Your certificate is ready. I'm so proud of you.` : `You finished ${course.title}${comma(input.name)}! That's a real achievement. I'm so proud of you.`,
      mood: 'accomplished',
    };
  }
  if (lessonsDone > 0) {
    const left = course.lessons - lessonsDone;
    return {
      text: `Welcome back${comma(input.name)}! ${lessonsDone} of ${course.lessons} lessons done, ${plural(left, 'to go', 'to go')}.${nextLessonTitle ? ` Next up: ${trimDot(nextLessonTitle)}.` : ''} Shall we?`,
      mood: 'happy',
    };
  }
  const how = {
    starter: 'We start with the basics, one small step at a time.',
    career: 'It ends with a certificate you can show, and I will be beside you the whole way.',
    mini: 'It is a short one, so you can finish it quickly and feel good about it.',
    path: 'We will use AI tools the careful way: you stay in charge, and we check everything.',
    standard: 'Each lesson teaches first, then checks what you learned, then lets you try it yourself. I am right here if you get stuck.',
  }[course.kind];
  return { text: pick([`Hey${comma(input.name)}! Ready to learn something new? ${how}`, `Hi${comma(input.name)}! This is ${course.title}: ${plural(course.lessons, 'lesson')}. ${how}`], seed), mood: 'excited' };
}

/** The start of a lesson: what we will learn today (from the lesson's own objective), and a nudge that fits where it sits in the course. */
export function lessonIntroLine(input: { name: string; lesson: { id: string; title: string; day: number; intro?: { objectives: string[] } }; courseLessons: number; done: boolean; courseTitle: string; language?: Language }): Line {
  const { lesson, courseLessons, done } = input;
  if (input.language === 'fil') {
    const goalFil = lesson.intro?.objectives[0] ? `Ang goal natin: ${trimDot(lesson.intro.objectives[0])}.` : '';
    const title = trimDot(lesson.title);
    if (done) return { text: `Natapos mo na ang lesson na 'to${comma(input.name)}. Magandang balikan ulit para tumatak. ${goalFil}`.trim(), mood: 'learning' };
    if (lesson.day === 1) return { text: `Araw 1${comma(input.name)}, kaya tara, simulan natin! Ngayon: ${title}. ${goalFil} Gagabayan kita step by step.`.replace(/\s+/g, ' '), mood: 'excited' };
    if (lesson.day === courseLessons) return { text: `Ito na ang huling lesson${comma(input.name)}! Ngayon: ${title}. ${goalFil} Tapusin natin nang buong lakas!`.replace(/\s+/g, ' '), mood: 'determined' };
    return {
      text: pick(
        [`Tara, simulan natin ang lesson! Ngayon, pag-aaralan natin ang ${title}. ${goalFil} Gagabayan kita step by step!`, `Araw ${lesson.day}: ${title}. ${goalFil} Dahan-dahan lang, nandito lang ako.`, `Ready ka na${comma(input.name)}? Ngayon: ${title}. ${goalFil}`],
        `lesson:${lesson.id}`,
      ).replace(/\s+/g, ' '),
      mood: 'curious',
    };
  }
  const goal = lesson.intro?.objectives[0] ? `By the end you'll be able to ${lower(trimDot(lesson.intro.objectives[0]))}.` : '';
  if (done) return { text: `You've done this lesson${comma(input.name)}. Reading it again is a great way to make it stick. ${goal}`.trim(), mood: 'learning' };
  if (lesson.day === 1) return { text: `Day 1${comma(input.name)}, so let's begin! Today: ${trimDot(lesson.title)}. ${goal} I'll guide you step by step.`.replace(/\s+/g, ' '), mood: 'excited' };
  if (lesson.day === courseLessons) return { text: `The last lesson${comma(input.name)}! Today: ${trimDot(lesson.title)}. ${goal} Let's finish strong.`.replace(/\s+/g, ' '), mood: 'determined' };
  return {
    text: pick(
      [`Today we're learning ${lower(trimDot(lesson.title))}. ${goal} I'll guide you step by step!`, `Day ${lesson.day}: ${trimDot(lesson.title)}. ${goal} Take your time, I'm right here.`, `Ready${comma(input.name)}? Today is ${lower(trimDot(lesson.title))}. ${goal}`],
      `lesson:${lesson.id}`,
    ).replace(/\s+/g, ' '),
    mood: 'curious',
  };
}

/** After the reading, before the quiz: connects what was just learned to what is about to be asked, and says what to expect. */
export function beforeQuizLine(input: { lessonId: string; takeaways: number; questions: number; retake: boolean; language?: Language }): Line {
  if (input.language === 'fil') {
    if (input.retake) return { text: `Subukan ulit natin ang quiz. Naka-save pa rin ang best score mo, kaya wala kang mawawala.`, mood: 'encouraging' };
    const learnedFil = input.takeaways > 0 ? `Napag-aralan mo na ang ${input.takeaways} key idea.` : `Nabasa mo na ang lesson.`;
    return {
      text: pick([`${learnedFil} Tingnan natin kung gaano karami ang naintindihan mo! ${input.questions} tanong lang, at ipapaliwanag ko ang bawat sagot.`, `${learnedFil} Ready ka na ba sa mabilis na check? ${input.questions} tanong, walang pressure.`], `quiz:${input.lessonId}`),
      mood: 'encouraging',
    };
  }
  if (input.retake) return { text: `Let's try the quiz again. Your best score is kept, so there is nothing to lose.`, mood: 'encouraging' };
  const learned = input.takeaways > 0 ? `You've been through ${plural(input.takeaways, 'key idea')}.` : `You've read the lesson.`;
  return {
    text: pick([`${learned} Let's see how much you've understood! ${plural(input.questions, 'quick question')}, and I'll explain every answer.`, `${learned} Ready for a quick check? ${plural(input.questions, 'question')}, no pressure.`], `quiz:${input.lessonId}`),
    mood: 'encouraging',
  };
}

/** After each quiz answer: celebrates a right one (more when there is a run of them), and stays kind about a wrong one. */
export function quizAnswerLine(input: { lessonId: string; index: number; total: number; correct: boolean; streak: number; missedInRow: number; language?: Language }): Line {
  const seed = `answer:${input.lessonId}:${input.index}`;
  const last = input.index === input.total - 1;
  if (input.language === 'fil') {
    if (input.correct) {
      if (input.streak >= 2) return { text: `${input.streak + 1} sunod-sunod na tama! Gets na gets mo 'to.`, mood: 'celebrating' };
      return { text: pick(['Nice! Tama ang sagot mo!', 'Tama! Ang galing mo!', last ? 'Tama ulit, at ito na ang huling tanong!' : 'Tama! Nakukuha mo na ang takbo nito.'], seed), mood: 'excited' };
    }
    if (input.missedInRow >= 2) return { text: `Okay lang 'yan. Medyo tricky ang mga ito. Basahin mo ang paliwanag sa ibaba, makakatulong 'yon sa susunod.`, mood: 'supportive' };
    return { text: pick([`Okay lang 'yan! Alamin natin kung saan nagkamali.`, `Malapit na, pero hindi pa ngayon. Ito ang nangyari.`, `Magandang try! Sa pagkakamali tayo natututo. Tingnan mo ito.`], seed), mood: 'supportive' };
  }
  if (input.correct) {
    if (input.streak >= 2) return { text: `That's ${input.streak + 1} in a row! You really get this.`, mood: 'celebrating' };
    return { text: pick(['Awesome! You got it right!', 'Yes, exactly! Nicely done.', last ? 'Right again, and that was the last one!' : 'Correct! You are getting the hang of this.'], seed), mood: 'excited' };
  }
  if (input.missedInRow >= 2) return { text: `That's okay. These ones are tricky. Read the explanation below; it will help with the next one.`, mood: 'supportive' };
  return { text: pick([`Not quite! That's okay. Let's understand why.`, `Close, but not this time. Here is what is going on.`, `Good try! Mistakes are how we learn. Look at this.`], seed), mood: 'supportive' };
}

/** A quiz that was not passed: what happened and what to do next, without making it a failure. */
export function quizMissedLine(input: { name: string; correct: number; total: number; language?: Language }): Line {
  if (input.language === 'fil') return { text: `${input.correct} sa ${input.total}${comma(input.name)}. Hindi pa tayo doon, pero okay lang 'yan! Tingnan mo sa ibaba ang mga namali mo, balikan ang lesson, at subukan ulit.`, mood: 'supportive' };
  return { text: `${input.correct} of ${input.total}${comma(input.name)}. Not there yet, and that's okay! Look at what you missed below, review the lesson, and try again.`, mood: 'supportive' };
}

/** A quiz passed again, after the lesson was already done. */
export function quizRetakePassedLine(input: { correct: number; total: number; language?: Language }): Line {
  if (input.language === 'fil') return { text: input.correct === input.total ? `Perfect score ngayon! Ibig sabihin, talagang naintindihan mo.` : `${input.correct} sa ${input.total}, at pasado ka ulit. Naka-save pa rin ang best score mo.`, mood: input.correct === input.total ? 'celebrating' : 'happy' };
  return { text: input.correct === input.total ? `A perfect score this time! That is real understanding.` : `${input.correct} of ${input.total}, and you passed again. Your best score is kept.`, mood: input.correct === input.total ? 'celebrating' : 'happy' };
}

/** Starting the practice: it uses what the lesson just taught, and the learner is in control. */
export function exerciseIntroLine(input: { lessonId: string; activities: number; concept: string | null; score: { correct: number; total: number } | null; language?: Language }): Line {
  if (input.language === 'fil') {
    const aboutFil = input.concept ? ` ${input.activities} activity tungkol sa ${input.concept}.` : input.activities > 0 ? ` ${input.activities} activity na puwede mong subukan.` : '';
    const quizFil = input.score ? `${input.score.correct} sa ${input.score.total} sa quiz!` : '';
    return { text: `${quizFil} Ikaw naman! Gamitin natin sa practice ang natutunan mo.${aboutFil} Nandiyan ang mga hint kung kailangan mo.`.trim().replace(/\s+/g, ' '), mood: input.score && input.score.correct === input.score.total ? 'excited' : 'determined' };
  }
  const about = input.concept ? ` ${plural(input.activities, 'activity', 'activities')} on ${input.concept}.` : input.activities > 0 ? ` ${plural(input.activities, 'activity', 'activities')} to try.` : '';
  const quiz = input.score ? `${input.score.correct} of ${input.score.total} on the quiz!` : '';
  return { text: `${quiz} Your turn! Let's put what you've learned into practice.${about} Hints are there if you want them.`.trim().replace(/\s+/g, ' '), mood: input.score && input.score.correct === input.score.total ? 'excited' : 'determined' };
}

/** Above a hint: the first is a gentle nudge, later ones are closer, and the last says so. Never the answer itself. */
export function hintLine(input: { number: number; total: number; language?: Language }): Line {
  if (input.language === 'fil') {
    if (input.total > 1 && input.number >= input.total) return { text: `Ito na ang pinakamalapit na magagawa ko nang hindi ako ang gumagawa para sa'yo. Kaya mo 'yan!`, mood: 'encouraging' };
    if (input.number === 1) return { text: `Kailangan mo ba ng konting tulong? May hint ako para sa'yo. Subukan mo ito!`, mood: 'thinking' };
    return { text: `Isa pang hint, mas malapit na ngayon.`, mood: 'thinking' };
  }
  if (input.total > 1 && input.number >= input.total) return { text: `This is the closest I can get without doing it for you. You've got this!`, mood: 'encouraging' };
  if (input.number === 1) return { text: `Need a little help? Here's a clue to get you started.`, mood: 'thinking' };
  return { text: `Another clue, a bit closer this time.`, mood: 'thinking' };
}

/** After an activity attempt: names what happened (no hints, a hard-won solve, a miss) and keeps the learner going. */
export function activityResultLine(input: { activityId: string; solved: boolean; wrongTries: number; hintsUsed: number; language?: Language }): Line {
  const seed = `activity:${input.activityId}:${input.wrongTries}`;
  if (input.language === 'fil') {
    if (input.solved) {
      if (input.wrongTries === 0 && input.hintsUsed === 0) return { text: pick(['Perfect, at walang hint! Galing!', 'First try, walang hint. Ang galing!'], seed), mood: 'celebrating' };
      if (input.hintsUsed > 0 && input.wrongTries === 0) return { text: `Nakuha mo! Matalino ang gumamit ng hint, hindi 'yan shortcut. Ayos!`, mood: 'excited' };
      return { text: `Hindi ka sumuko at nalutas mo! Ganyan dapat.`, mood: 'excited' };
    }
    if (input.wrongTries >= 2) return { text: `Mahirap 'to, 'no? Makakatulong ang hint, at walang masama kung gagamitin mo ito.`, mood: 'supportive' };
    return { text: pick([`Hindi pa 'yan. Tingnan mo ulit: ano kaya ang naiiba?`, `Malapit na! Tingnan mo ulit, kaya mo 'yan.`], seed), mood: 'supportive' };
  }
  if (input.solved) {
    if (input.wrongTries === 0 && input.hintsUsed === 0) return { text: pick(['Perfect, and with no hints! Great work!', 'First try, no hints. Brilliant!'], seed), mood: 'celebrating' };
    if (input.hintsUsed > 0 && input.wrongTries === 0) return { text: `You got it, and using a hint is smart, not a shortcut. Well done!`, mood: 'excited' };
    return { text: `You stuck with it and solved it! That's how it's done.`, mood: 'excited' };
  }
  if (input.wrongTries >= 2) return { text: `Hard one, isn't it? A hint can help, and there's no shame in taking it.`, mood: 'supportive' };
  return { text: pick([`Not quite. Look at it once more: what could be different?`, `Almost! Take another look, you can do this.`], seed), mood: 'supportive' };
}

/** The lesson is finished: celebrates what this learner really did and points to what comes next. */
export function lessonCompleteLine(input: { name: string; lessonTitle: string; xp: number; perfect: boolean; nextTitle: string | null; lessonsDone: number; courseLessons: number; courseDone: boolean; language?: Language }): Line {
  if (input.language === 'fil') {
    if (input.courseDone) return { text: `Natapos mo na ang buong course${comma(input.name)}! Sobrang proud ako sa'yo!`, mood: 'accomplished' };
    const perfectFil = input.perfect ? ' Perfect pa ang quiz mo!' : '';
    const nextFil = input.nextTitle ? ` Susunod: ${trimDot(input.nextTitle)}. Ready ka na ba?` : ' Ready ka na ba sa susunod na challenge?';
    return { text: `Ayos${comma(input.name)}! Natapos mo na ang ${trimDot(input.lessonTitle)}.${perfectFil} +${input.xp} XP.${nextFil}`, mood: input.perfect ? 'celebrating' : 'excited' };
  }
  if (input.courseDone) return { text: `You did it${comma(input.name)}: the whole course! I'm so proud of you.`, mood: 'accomplished' };
  const perfect = input.perfect ? ' A perfect quiz, too!' : '';
  const next = input.nextTitle ? ` Ready for the next one, ${lower(trimDot(input.nextTitle))}?` : ' Ready for the next challenge?';
  return { text: `Fantastic work${comma(input.name)}! You've completed ${trimDot(input.lessonTitle)}.${perfect} +${input.xp} XP.${next}`, mood: input.perfect ? 'celebrating' : 'excited' };
}

export function badgeLine(input: { title: string; name: string; language?: Language }): Line {
  if (input.language === 'fil') return { text: `May bagong badge ka${comma(input.name)}: ${input.title}! Pinaghirapan mo 'yan.`, mood: 'celebrating' };
  return { text: `A new badge${comma(input.name)}: ${input.title}! You earned that.`, mood: 'celebrating' };
}

/** The Today tab: the right greeting for the hour, and one useful next thing. */
export function todayLine(input: { name: string; hour: number; streak: number; doneToday: boolean; nextLessonTitle: string | null; /** False where a greeting is already on screen (Today's own header). */ withGreeting?: boolean; language?: Language }): Line {
  if (input.language === 'fil') {
    const greetingFil = input.hour < 5 ? 'Gising ka pa pala' : input.hour < 12 ? 'Magandang umaga' : input.hour < 18 ? 'Magandang hapon' : 'Magandang gabi';
    const leadFil = input.withGreeting === false ? '' : `${greetingFil}${comma(input.name)}! `;
    if (input.doneToday) return { text: `${leadFil}Tapos na ang lesson mo ngayon${input.streak > 1 ? `, at ${input.streak} araw na sunod-sunod na 'yan` : ''}. Magpahinga ka muna, o ituloy mo kung gusto mo!`, mood: 'proud' };
    if (input.nextLessonTitle) return { text: `${leadFil}${input.streak > 0 ? `Ituloy mo ang ${input.streak}-day streak mo: ` : 'Susunod: '}${trimDot(input.nextLessonTitle)}.`, mood: 'happy' };
    return { text: `${leadFil}Ready ka na bang pumili ng bagong aaralin?`, mood: 'curious' };
  }
  const greeting = input.hour < 5 ? 'Up late' : input.hour < 12 ? 'Good morning' : input.hour < 18 ? 'Good afternoon' : 'Good evening';
  const lead = input.withGreeting === false ? '' : `${greeting}${comma(input.name)}! `;
  if (input.doneToday) return { text: `${lead}${lead ? "Today's" : "Today's"} lesson is done${input.streak > 1 ? `, and that's ${input.streak} days in a row` : ''}. Rest, or keep going if you like!`, mood: 'proud' };
  if (input.nextLessonTitle) return { text: `${lead}${input.streak > 0 ? `Keep your ${input.streak}-day streak going: ` : 'Next up: '}${trimDot(input.nextLessonTitle)}.`, mood: 'happy' };
  return { text: `${lead}Ready to pick something new to learn?`, mood: 'curious' };
}

/** The Courses tab and recommendations. */
export function coursesLine(input: { name: string; started: number; goalCourse: string | null; language?: Language }): Line {
  if (input.language === 'fil') {
    if (input.started === 0) return { text: `Uy${comma(input.name)}! Hindi sigurado kung saan magsisimula? Umpisahan mo sa libreng course, tapos pumili ng path${input.goalCourse ? `. Sa tingin ko, bagay sa'yo ang ${input.goalCourse}` : ''}.`, mood: 'curious' };
    return { text: `Nandito ka na ulit${comma(input.name)}! Ituloy mo kung saan ka huminto, o pumili ng bago.`, mood: 'happy' };
  }
  if (input.started === 0) return { text: `Hey${comma(input.name)}! Not sure where to begin? Start with the free course, then pick a path${input.goalCourse ? `. I think ${input.goalCourse} suits you` : ''}.`, mood: 'curious' };
  return { text: `Welcome back${comma(input.name)}! Carry on where you left off, or pick something new.`, mood: 'happy' };
}

/**
 * The line at the top of Discover. Picks are the sections chosen for this learner; a learner who has not told us anything gets
 * friendly first steps and an invitation, never a list that pretends to know them. Nothing is hidden by what they answered.
 */
export function discoverLine(input: { name: string; personalized: boolean; hasPicks: boolean; started: number; language?: Language }): Line {
  if (input.language === 'fil') {
    if (!input.personalized) return { text: `Hi${space(input.name)}! Hindi sigurado kung saan magsisimula? Ito ang mga madaling unang hakbang. Sabihin mo sa akin ang mga goal mo at pipili ako ng mga course para sa'yo.`, mood: 'curious' };
    if (!input.hasPicks) return { text: `Gusto mo bang mag-explore ng bago${comma(input.name)}? Libutin mo lang, bukas para sa'yo ang lahat ng course.`, mood: 'inspired' };
    if (input.started > 0) return { text: `Nandito ka na ulit${comma(input.name)}! Ituloy mo kung saan ka huminto. May ilan pa akong napili para sa'yo.`, mood: 'happy' };
    return { text: `Pinili ko ang mga course na ito base sa mga interest mo${comma(input.name)}!`, mood: 'happy' };
  }
  if (!input.personalized) return { text: `Hi${comma(input.name)}! Not sure where to begin? These are friendly first steps. Tell me your goals and I'll pick courses just for you.`, mood: 'curious' };
  if (!input.hasPicks) return { text: `Want to explore something new${comma(input.name)}? Have a look around. Every course is open to you.`, mood: 'inspired' };
  if (input.started > 0) return { text: `Welcome back${comma(input.name)}! Carry on where you left off. I picked a few more for you too.`, mood: 'happy' };
  return { text: `I picked these courses based on your interests${comma(input.name)}!`, mood: 'happy' };
}

/** Above the courses from areas the learner has not looked at yet. */
export function discoverNewGroundLine(input: { categories: number; language?: Language }): Line {
  if (input.language === 'fil') return { text: input.categories > 1 ? `Gusto mo bang mag-explore ng bago? Ito ang madaling unang hakbang sa ${input.categories} area na hindi mo pa nasusubukan.` : `Gusto mo bang mag-explore ng bago? Ito ang madaling unang hakbang sa isang area na hindi mo pa nasusubukan.`, mood: 'curious' };
  return { text: input.categories > 1 ? `Want to explore something new? Here is a gentle first step into ${input.categories} areas you haven't tried.` : `Want to explore something new? Here is a gentle first step into an area you haven't tried.`, mood: 'curious' };
}

/** When a search or filters match nothing: say so kindly and offer the way out. */
export function discoverEmptyLine(input: { text: string; filters: number; language?: Language }): Line {
  const text = input.text.trim();
  if (input.language === 'fil') {
    if (text && input.filters > 0) return { text: `Wala akong makitang "${text}" sa mga filter na 'yan. Subukan mong tanggalin ang isa o dalawang filter.`, mood: 'supportive' };
    if (text) return { text: `Wala akong makitang "${text}". Subukan mo ang mas maikling salita, tulad ng "react" o "python".`, mood: 'supportive' };
    return { text: `Walang tugma kapag pinagsama ang mga filter na 'yan. Alisin mo ang isa at ipapakita ko kung ano ang meron.`, mood: 'supportive' };
  }
  if (text && input.filters > 0) return { text: `I couldn't find "${text}" with those filters. Try removing a filter or two.`, mood: 'supportive' };
  if (text) return { text: `I couldn't find "${text}". Try a shorter word, like "react" or "python".`, mood: 'supportive' };
  return { text: `Those filters together match nothing. Take one away and I'll show you what is there.`, mood: 'supportive' };
}

/** Empty places: say what will be here and what to do first. */
export function emptyLine(kind: 'history' | 'courses' | 'plan', language: Language = 'en'): Line {
  if (language === 'fil') {
    if (kind === 'history') return { text: `Wala pang chat. Magtanong ka lang tungkol sa tech career mo at ise-save ko rito.`, mood: 'curious' };
    if (kind === 'courses') return { text: `Wala pa rito. Simulan mo ang libreng course at lalabas dito ang progress mo.`, mood: 'learning' };
    return { text: `Wala pa akong plan para sa'yo. Sagutin mo ang ilang tanong at gagawa tayo ng plan nang magkasama.`, mood: 'explaining' };
  }
  if (kind === 'history') return { text: `No chats yet. Ask me anything about your tech career and I'll save it here.`, mood: 'curious' };
  if (kind === 'courses') return { text: `Nothing here yet. Start the free course and your progress will show up.`, mood: 'learning' };
  return { text: `I haven't got your plan yet. Answer a few questions and I'll build one with you.`, mood: 'explaining' };
}

/** Finishing a whole course from the lesson screen's result (the lesson-complete line carries a name and the next lesson; this one just celebrates). */
export function courseFinishedLine(input: { courseTitle: string; language?: Language }): Line {
  if (input.language === 'fil') return { text: `Natapos mo na ang ${input.courseTitle}! Sobrang proud ako sa'yo.`, mood: 'accomplished' };
  return { text: `You finished ${input.courseTitle}! I'm so proud of you.`, mood: 'accomplished' };
}

/** A tip or a warning in the lesson. */
export function noteMood(kind: 'tip' | 'warning'): TaliMood {
  return kind === 'tip' ? 'explaining' : 'surprised';
}
