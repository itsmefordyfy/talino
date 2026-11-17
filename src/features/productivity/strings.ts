import { defineStrings } from '@/lib/i18n';

import type { DayAdvice } from './lib/day-plan';
import { formatDuration } from './lib/time';
import type { BlockKind, Finding, FixedKind, PlanDimension, Quadrant } from './types';

// Owner rule (2026-11-15): no Filipino is written. The `fil` table is the same English text, a placeholder and not a translation; it is listed in
// ENGLISH_ONLY of strings-parity.test.ts. Every sentence a learner reads in the productivity tools lives here, never in a component.
const en = {
  quadrants: {
    do: { title: 'Do now', subtitle: 'Urgent and important' },
    plan: { title: 'Schedule it', subtitle: 'Important, not urgent' },
    delegate: { title: 'Hand it off', subtitle: 'Urgent, not important' },
    drop: { title: 'Let it go', subtitle: 'Neither urgent nor important' },
  } satisfies Record<Quadrant, { title: string; subtitle: string }>,
  dimensions: {
    prioritization: 'Prioritization',
    timeAllocation: 'Time allocation',
    realisticPlanning: 'Realistic planning',
    interruptions: 'Handling the interruption',
    decisionMaking: 'Decision making',
  } satisfies Record<PlanDimension, string>,

  // Eisenhower matrix
  matrixTitle: 'Eisenhower matrix',
  matrixIntro: 'Add your own tasks, then tap a task and choose its box. Ask two questions: does it need attention soon, and does it matter to something you care about?',
  matrixUnplaced: 'Not sorted yet',
  matrixAddLabel: 'Add a task',
  matrixAddPlaceholder: 'A task, for example "Send the invoice"',
  matrixAdd: 'Add',
  matrixRemove: (title: string) => `Remove ${title}`,
  matrixMoveTo: (title: string) => `Move "${title}" to`,
  matrixClear: 'Take it off the board',
  matrixEmpty: 'The board is empty. Add a task you are putting off, or the first thing on your mind.',
  matrixCount: (placed: number, total: number) => `${placed} of ${total} sorted`,
  matrixAsk: 'Two questions',
  matrixUrgent: 'Does it need attention soon?',
  matrixImportant: 'Does it matter to a goal or someone you care about?',
  matrixYes: 'Yes',
  matrixNo: 'No',
  matrixSuggest: (box: string) => `That puts it in "${box}".`,
  matrixReset: 'Clear the board',
  matrixInBox: (title: string, box: string) => `${title}, in ${box}`,
  matrixRight: 'Right box',
  matrixWrong: 'Look again',

  // Matrix board and tool: extra words (the board component and the free Eisenhower visual)
  matrixBoxEmpty: 'Nothing here yet',
  matrixBoxLabel: (title: string, subtitle: string, count: number) => `${title}, ${subtitle}. ${count === 1 ? '1 task' : `${count} tasks`}`,
  matrixSelected: 'Selected',
  matrixTapToSort: 'Tap a task, then choose its box.',
  matrixMoveHere: (box: string) => `Move to ${box}`,
  matrixRemoveTask: 'Remove from my list',
  matrixAskOpen: 'Not sure? Answer two questions',
  matrixAskClose: 'Hide the two questions',
  matrixPutIn: (box: string) => `Put it in "${box}"`,
  matrixFull: (max: number) => `Your board holds ${max} tasks. Remove one to add another.`,
  matrixResetAsk: 'Remove every task and start with an empty board?',
  matrixResetYes: 'Yes, clear the board',
  matrixResetKeep: 'Keep my board',
  matrixSaveError: 'That change was not saved. Try again.',
  matrixLoadError: 'Your board could not be opened.',
  matrixRetry: 'Try again',
  matrixSaved: 'Kept on this phone.',
  sortWhyDisabled: (count: number) => `${count} ${count === 1 ? 'task is' : 'tasks are'} not placed yet. Place every task, then check.`,
  sortBoardLabel: 'Your sorting',

  // Planning activity: sorting
  sortCheck: 'Check my sorting',
  sortAllRight: (total: number) => `Well sorted: all ${total} tasks are in a box you can defend.`,
  sortMostRight: (right: number, total: number) => `${right} of ${total} sorted well. A few to look at again:`,
  sortSomeRight: (right: number, total: number) => `${right} of ${total} so far. Think about what each task is really waiting for, then look again:`,
  sortUnplaced: (count: number) => `${count} ${count === 1 ? 'task is' : 'tasks are'} still not placed. Sort every task before you check.`,
  sortWrongLine: (title: string, why: string) => `"${title}": ${why}`,

  // Daily schedule builder
  dayTitle: 'Daily schedule builder',
  dayIntro: 'Add tasks with an estimate, give each a start time, add breaks, and watch for conflicts. A good day has rest and room for surprises.',
  dayAddTask: 'Add a task',
  dayTaskName: 'Task name',
  dayTaskPlaceholder: 'For example "Write the report"',
  dayMinutes: 'Minutes',
  dayPriority: 'Priority',
  dayPriorities: { high: 'High', medium: 'Medium', low: 'Low' },
  dayStart: 'Start time',
  dayWindow: (start: string, end: string) => `Your day: ${start} to ${end}`,
  dayWindowEdit: 'Day hours',
  dayAddBreak: 'Add a break',
  dayBreak: 'Break',
  dayBuffer: 'Buffer',
  dayPlace: 'Place in the day',
  dayRemove: (title: string) => `Remove ${title}`,
  dayEarlier: (title: string) => `Start ${title} 15 minutes earlier`,
  dayLater: (title: string) => `Start ${title} 15 minutes later`,
  dayLonger: (title: string) => `Make ${title} 15 minutes longer`,
  dayShorter: (title: string) => `Make ${title} 15 minutes shorter`,
  dayFixed: 'Already in your day',
  dayTasksTitle: 'To do today',
  dayTimeline: 'Your day',
  dayNothing: 'Nothing planned yet. Add a task, then give it a time.',
  dayFree: (duration: string) => `${duration} free`,
  dayNotPlaced: 'Not placed',
  dayReview: 'Review my day',
  dayConflict: (a: string, b: string) => `${a} overlaps ${b}`,
  dayOutside: (title: string) => `${title} runs outside the day`,
  daySummary: (planned: string, rest: string, free: string) => `${planned} of work, ${rest} of rest, ${free} free`,
  dayClear: 'Clear the day',
  dayDecisionFor: (title: string) => `What will you do about "${title}"?`,
  dayDecisions: { defer: 'Do it another day', delegate: 'Hand it to someone', decline: 'Say no', automate: 'Automate it' },
  dayNoDecision: 'Decide later',

  // ---- Day planner screens (the planner, the free tool, the graded day). Added with the day-planner UI.
  dayFixedKinds: { meeting: 'Meeting', class: 'Class', personal: 'Personal time', meal: 'Meal', rest: 'Rest', commute: 'Commute', interruption: 'Interruption' } satisfies Record<FixedKind, string>,
  dayBlockKinds: { task: 'Task', break: 'Break', buffer: 'Buffer' } satisfies Record<BlockKind, string>,
  dayFixedTag: (kind: string) => `Fixed, ${kind}`,
  dayBufferNote: 'Kept free for surprises',
  dayAddBuffer: 'Add a buffer',
  dayWork: 'Work',
  dayRest: 'Rest',
  dayFreeLabel: 'Free',
  dayLegendFixed: 'Fixed',
  dayRemoveBlock: 'Remove',
  dayEstimateLess: 'Make the estimate 15 minutes shorter',
  dayEstimateMore: 'Make the estimate 15 minutes longer',
  dayEstimate: (duration: string) => `Estimate ${duration}`,
  dayDeadline: (time: string) => `Done by ${time}`,
  dayMust: 'Must do today',
  dayPriorityTag: (label: string) => `${label} priority`,
  dayPlacedLine: (duration: string, time: string) => `Placed: ${duration} from ${time}`,
  dayPartial: (placed: string, total: string) => `${placed} of ${total} placed`,
  dayAdjust: 'Adjust',
  dayRange: (start: string, end: string) => `${start} to ${end}`,
  dayLength: 'Length',
  dayStartValue: (time: string) => `Starts at ${time}`,
  dayBlockHint: 'Tap a block to change its time or length.',
  dayGapAdd: 'Add a break here',
  dayTasksEmpty: 'No tasks yet. Add the first thing you need to do today.',
  dayTaskLimit: (limit: number) => `You can keep up to ${limit} tasks. Remove one to add another.`,
  dayNameRequired: 'Give the task a name first.',
  dayPlacedNote: (title: string, time: string) => `${title} placed at ${time}.`,
  dayPlacedPart: (title: string, time: string, duration: string) => `${title}: only ${duration} fit at ${time}. Place the rest in another free stretch, or decide about it.`,
  dayNoRoom: 'There is no free stretch left in the day. Make room, shorten something or decide about a task.',
  dayWatchTitle: 'Watch for',
  dayAdvice: (advice: DayAdvice): string => {
    switch (advice.code) {
      case 'overlap':
        return `${advice.params.count} ${advice.params.count === 1 ? 'clash' : 'clashes'}: two things are planned for the same time.`;
      case 'outside':
        return `${advice.params.count} ${advice.params.count === 1 ? 'block runs' : 'blocks run'} outside the hours of your day.`;
      case 'longRun':
        return `${formatDuration(advice.params.minutes)} of work in a row. This day allows ${formatDuration(advice.params.limit)} before a break.`;
      case 'overPacked':
        return `${formatDuration(advice.params.planned)} of work is more than this day can hold (${formatDuration(advice.params.limit)}).`;
      case 'noRest':
        return `No break or rest yet. Plan at least ${formatDuration(advice.params.needed)}.`;
      case 'littleRest':
        return `${formatDuration(advice.params.rest)} of rest. Plan at least ${formatDuration(advice.params.needed)}.`;
      case 'littleFree':
        return `${formatDuration(advice.params.free)} free. Keep at least ${formatDuration(advice.params.needed)} for what runs over.`;
      case 'clear':
        return `Nothing clashes, and ${formatDuration(advice.params.free)} is left free.`;
    }
  },
  dayAdviceLevel: { problem: 'Problem', note: 'Worth a look', ok: 'All clear' },
  dayConflictTag: 'Conflict',
  dayScoreOk: 'On track',
  dayScoreLow: 'Needs work',
  dayResultTitle: 'What the check found',
  dayHoursStart: 'Day starts',
  dayHoursEnd: 'Day ends',
  dayHoursEarlier: (label: string) => `${label}: 30 minutes earlier`,
  dayHoursLater: (label: string) => `${label}: 30 minutes later`,
  dayToolClearTitle: 'Clear your day?',
  dayToolClearBody: 'Your tasks and your plan are removed from this phone. This cannot be undone.',
  dayToolCancel: 'Cancel',
  dayToolEmptyTitle: 'Your day is empty',
  dayToolEmptyBody: 'Add what you need to do today, with an estimate, then place each task where it fits.',
  dayToolLoadFailed: 'Your day could not be loaded. Nothing is lost.',
  dayToolSaveFailed: 'Your last change could not be saved on this phone.',
  dayToolRetry: 'Try again',
  dayToolClear: 'Clear my day',
  dayToolSavedHere: 'Your day is kept on this phone.',
  dayToolNoCheck: 'This is your own planning space: nothing is scored here.',

  // Planning activity: scheduling
  planStart: 'Start the day',
  planInterrupt: 'Something happens',
  planAfter: 'Rebuild your plan around it, then check it.',
  planCheck: 'Check my plan',
  planCheckBefore: 'Check this plan first',
  planYourPlan: 'Your plan',
  planDecisions: 'Not in your day',
  planPassed: 'This plan could work. Read what it did well, and what could be better.',
  planNotYet: 'Not yet. A plan has to be something you could live through.',
  planBlockers: 'Fix these first',
  planNotes: 'Could be stronger',
  planGood: 'Working well',
  planOverall: (score: number) => `Overall ${score} out of 100`,
  planScore: (label: string, score: number) => `${label}: ${score}`,
  planCheckStatus: { blocker: 'Must fix', issue: 'Could be stronger', good: 'Working well' },
  planExplain: 'In your own words: why did you plan it this way?',
  planExplainPlaceholder: 'Write two or three sentences about the choices you made and what you gave up.',
  planExplainHint: 'Not scored. Your own explanation is part of the learning.',
  planDayRules: 'The rules for this day',
  planRuleFocus: (limit: string) => `No more than ${limit} of work in a row without a break.`,
  planRuleBreak: (total: string, minimum: string) => `At least ${total} of break and rest in all (meals count). A break counts from ${minimum}.`,
  planRuleSlack: (free: string) => `Keep at least ${free} free or as a buffer, because something always runs over.`,
  planRuleCap: (limit: string) => `No more than ${limit} of tasks in the day.`,
  planRuleMust: 'Tasks marked "Must do today" have to be in the plan, finished in time.',
  planRuleDecide: 'Whatever does not fit: decide what happens to it.',
  planStartHint: 'Build your plan first. When it is ready, start the day and see what happens.',
  planInterruptionTitle: 'It is happening now',
  planChanged: 'You changed your plan after this check. Check again to see how it scores.',

  // Pomodoro timer
  timerTitle: 'Pomodoro focus timer',
  timerIntro: 'Work in short, focused rounds with a break after each one. Set the lengths that suit you.',
  timerPhase: { work: 'Focus', short: 'Short break', long: 'Long break' },
  timerStart: 'Start',
  timerPause: 'Pause',
  timerResume: 'Resume',
  timerReset: 'Reset',
  timerSkip: 'Skip',
  timerRound: (round: number, total: number) => `Round ${round} of ${total}`,
  timerSettings: 'Session lengths',
  timerWork: 'Focus (minutes)',
  timerShort: 'Short break (minutes)',
  timerLong: 'Long break (minutes)',
  timerRounds: 'Rounds before a long break',
  timerAuto: 'Start the next round automatically',
  timerToday: (sessions: number, duration: string) => `Today: ${sessions} ${sessions === 1 ? 'session' : 'sessions'}, ${duration}`,
  timerWeek: (sessions: number, duration: string) => `Last 7 days: ${sessions} ${sessions === 1 ? 'session' : 'sessions'}, ${duration}`,
  timerDone: (phase: string) => `${phase} finished`,
  timerFocusDone: 'Focus round finished. Take your break.',
  timerBreakDone: 'Break over. Ready for the next round?',
  timerTaskLabel: 'What are you working on?',
  timerTaskPlaceholder: 'One small task for this round',
  timerKeepOpen: 'The timer keeps the real time while the app is in the background. It does not send a notification when a round ends.',
  timerLog: 'Finished focus rounds',
  timerLogEmpty: 'No finished rounds yet.',

  // Prompt playground
  promptTitle: 'AI prompt playground',
  promptIntro: 'Pick a prompt, replace the [brackets] with your own details, then copy it into the AI assistant you use. Everything here is a checklist: it does not run an AI, and it cannot tell you whether a prompt will work.',
  promptPick: 'Choose a prompt',
  promptWhen: 'When to use it',
  promptEdit: 'Your prompt',
  promptCopy: 'Copy prompt',
  promptCopied: 'Copied',
  promptReset: 'Start again from the template',
  promptCheckTitle: 'Structure check',
  promptCheckNote: 'A word-pattern check of the structure. It does not run an AI and cannot judge quality.',
  promptScore: (present: number, total: number) => `${present} of ${total} parts present`,
  promptPlaceholders: (count: number) => `${count} ${count === 1 ? 'bracket is' : 'brackets are'} still to fill in`,
  promptExplainTitle: 'What each part is for',
  promptImproveTitle: 'Ideas to make it better',
  promptVerifyTitle: 'Before you use the answer, check',
  promptPrivacy: { email: 'It looks like there is an email address in your prompt.', phone: 'It looks like there is a phone number in your prompt.', secret: 'It looks like there may be a password or key in your prompt.' },
  promptPrivacyLead: 'Before you paste this into any AI tool:',
  promptPrivacyAdvice: 'Remove or replace private details. What you paste may be stored by the tool.',
  promptPresent: 'Present',
  promptMissing: 'Missing',
  promptAskTali: 'Ask Tali to try it',
  promptNoAi: 'Not an AI. A checklist.',

  // ── Pomodoro timer and prompt playground screens: extra words (the focus-timer and playground UI; the sections above are the logic's).
  timerStatus: { idle: 'Ready', running: 'Running', paused: 'Paused' },
  timerRingLabel: (phase: string, time: string) => `${phase}, ${time} left`,
  timerLoadError: 'Your timer and its settings could not be loaded.',
  timerSaveError: 'Your latest change could not be saved on this phone. The timer still works while this screen is open.',
  timerNoTask: 'Focus round',
  timerLogEmptyNext: 'Start a focus round. When it ends, it is counted here.',
  timerLogShown: (count: number) => `Showing the latest ${count} rounds.`,
  timerRoundsDone: (done: number, total: number) => `${done} of ${total} rounds done before the long break`,
  promptLoadError: 'Your saved prompt could not be loaded.',
  promptSaveError: 'Your latest edit could not be saved on this phone. The text above is still here while this screen is open.',
  promptEmptyText: 'The prompt is empty. Write one, or start again from the template.',
  promptCopyFailed: 'Could not copy. Select the text in the box and copy it by hand.',
  promptSuggestionsTitle: 'What to add',
  promptSuggestionsNone: 'Every part is there. Read it once more as the AI would, knowing nothing about you except what is written here.',
  promptBracketsNone: 'No brackets are left to fill in.',
  sectionShow: (title: string) => `Show: ${title}`,
  sectionHide: (title: string) => `Hide: ${title}`,
  promptPartState: (label: string, present: boolean) => `${label}: ${present ? 'present' : 'missing'}`,

  findings: (finding: Finding): string => {
    const p = finding.params;
    switch (finding.code) {
      case 'overlap':
        return `"${p.a}" and "${p.b}" are planned for the same time.`;
      case 'outsideWindow':
        return `"${p.block}" runs outside the hours you have for this day.`;
      case 'mustDoMissing':
        return `"${p.task}" has to be done today, and it is not in your plan.`;
      case 'mustDoDeferred':
        return `"${p.task}" cannot wait. It needs a place in today's plan, not a "later".`;
      case 'mustDoLate':
        return `"${p.task}" would finish after its deadline.`;
      case 'deadlineMissed':
        return `"${p.task}" would finish after its deadline.`;
      case 'tooShort':
        return `"${p.task}" has ${p.minutes} minutes in the plan, but you estimated ${p.estimate}.`;
      case 'tooLong':
        return `"${p.task}" has ${p.minutes} minutes for a ${p.estimate}-minute job. Padding like that crowds out other work.`;
      case 'noBreak':
        return 'There is no break or rest anywhere in this day. People do worse work, and get tired sooner, without them.';
      case 'tooLittleBreak':
        return `The day has ${p.rest} minutes of rest and needs at least ${p.needed}.`;
      case 'focusRunTooLong':
        return `${p.minutes} minutes of work in a row is longer than the ${p.limit} this day allows. Add a break.`;
      case 'overPacked':
        return `${p.planned} minutes of tasks is more than this day can hold (${p.limit}).`;
      case 'noSlack':
        return `Only ${p.slack} minutes are free. Keep at least ${p.needed}, because something always runs over.`;
      case 'inversion':
        return `"${p.first}" comes before "${p.later}", which matters more.`;
      case 'lowBeforeHigh':
        return `"${p.low}" is planned while "${p.high}", a high-priority task, is left out.`;
      case 'interruptionUnhandled':
        return `Start the day first: "${p.interruption}" has not happened in your plan yet.`;
      case 'interruptionOverlap':
        return `"${p.block}" is still planned on top of "${p.interruption}". Move it, shorten it or decide about it.`;
      case 'decisionMissing':
        return `"${p.task}" is not in your day, and you did not decide what happens to it.`;
      case 'decisionPoor':
        return `For "${p.task}", "${p.action}" is not the best call here.`;
      case 'allFit':
        return 'Everything fit. No task had to be left out.';
      case 'ruleKept':
        return `Rest and free time are in the plan: ${p.rest} minutes of rest and ${p.slack} free.`;
    }
  },
};

export const productivityStrings = defineStrings({ en, fil: en });
export type ProductivityText = typeof productivityStrings.en;
