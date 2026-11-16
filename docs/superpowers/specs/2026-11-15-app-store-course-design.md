# Course: Publish Your App to the App Store and Google Play (design)

Owner's brief, 2026-11-15: "create a course about how to deploy your apps in app store and play store". Everything below the brief is Claude's call.

## Intent
A beginner course (`publish-to-app-stores`, `kind: 'standard'`, 14 lessons) that takes a learner with a finished phone app (or a web app wrapped for the stores) to a live listing on both the Apple App Store and Google Play, step by step, in the order the work really happens:
accounts, app identity and version numbers, the build files each store accepts, app records, privacy and data forms, listing assets, testing tracks, submitting for review on each store, handling a rejection, phased rollouts and updates, and life after launch.

## Why a course and not more lessons
Talino already has one lesson on this ("Build and submit to the stores" in Build a Mobile App with AI, conceptual and EAS-centred), a store-listing lesson in Launching and Marketing AI-Built Products and store payments in App Monetization.
Neither walks through each store's real steps for a first release, which is the part that takes learners longest and blocks them most. This course is that walkthrough; it points to those lessons instead of repeating them.

## Goals
- The learner can name every step and every account/file/form a first release needs on each store, in order, and what usually holds each one up.
- The learner can build, upload and test a release (TestFlight, Play testing tracks) and submit it, and knows what to do when a review says no.
- A learner with no paid accounts still finishes: the capstone has a no-account path (a complete submission pack: listing text, privacy policy, screenshots, data-safety answers, a release checklist) like the existing mobile course.

## Non-goals and anti-goals
- Not a tutorial on Expo, React Native or Xcode/Android Studio: they appear because they are how the files are made. No price figures (fees and plans are described in words), no screenshots of the stores (none we may use), no claim that cannot be traced to an official Apple, Google or Expo page opened by the writer.
- Never implies the stores accept anything automatically: review, policy and the learner's own accounts are theirs.
- No private details of the owner's own apps or accounts appear in the course; examples use a generic app.

## Lessons (titles are the syllabus's, in order)
1 The road to the stores  2 Your developer accounts  3 Identity, versions and build numbers  4 Build the files the stores accept  5 Create your app in App Store Connect and Play Console  6 Privacy, data safety and first-release rules
7 Screenshots, descriptions and the store listing  8 TestFlight and Play testing tracks  9 Submit to the App Store  10 Submit to Google Play  11 When the review says no  12 Release, phased rollout and updates  13 After launch  14 Project

## Constraints
`volatile: true` (dated, officially sourced `version` notes in at least 60% of lessons; hosts `apple.com`, `google.com`, `android.com`, `expo.dev`, `reactnative.dev` are allowed); level pieces in every lesson and project (`docs/content/ADAPTATION_BRIEF.md`); every rule in `docs/content/WRITING_BRIEF.md`.
Store rules change often (review guidelines, privacy forms, new-account testing requirements, target API levels): every such statement is a dated version note, and the writer re-opens each official page it cites.

## Approach
One writer agent writes the course file from the brief (the repo's established process, used for the Lovable course the same day); the result is run through `CHECK_COURSE=publish-to-app-stores` and reviewed by me against the cited pages.
