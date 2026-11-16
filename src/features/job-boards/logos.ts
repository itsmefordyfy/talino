/**
 * Each job board's own mark, bundled with the app (192 px squares on white, so they read the same on light and dark), shown beside its name.
 * They are the boards' trademarks, shown only to say which board a card is; Talino is not affiliated with any of them. Sources, 2026-11-15:
 * each site's own icon (its apple-touch or favicon file), and for Upwork, Wellfound and Hacker News the open-licensed (CC0) Simple Icons
 * vector or the site's own SVG, drawn at full size because the site's icon file was too small. A test checks that every board has one.
 */
export const BOARD_LOGOS: Record<string, number> = {
  linkedin: require('@/assets/images/job-boards/linkedin.png'),
  wellfound: require('@/assets/images/job-boards/wellfound.png'),
  'hn-jobs': require('@/assets/images/job-boards/hn-jobs.png'),
  'onlinejobs-ph': require('@/assets/images/job-boards/onlinejobs-ph.png'),
  kalibrr: require('@/assets/images/job-boards/kalibrr.png'),
  'jobstreet-ph': require('@/assets/images/job-boards/jobstreet-ph.png'),
  'indeed-ph': require('@/assets/images/job-boards/indeed-ph.png'),
  weworkremotely: require('@/assets/images/job-boards/weworkremotely.png'),
  remoteok: require('@/assets/images/job-boards/remoteok.png'),
  remotive: require('@/assets/images/job-boards/remotive.png'),
  himalayas: require('@/assets/images/job-boards/himalayas.png'),
  workingnomads: require('@/assets/images/job-boards/workingnomads.png'),
  flexjobs: require('@/assets/images/job-boards/flexjobs.png'),
  upwork: require('@/assets/images/job-boards/upwork.png'),
  fiverr: require('@/assets/images/job-boards/fiverr.png'),
  freelancer: require('@/assets/images/job-boards/freelancer.png'),
  toptal: require('@/assets/images/job-boards/toptal.png'),
  contra: require('@/assets/images/job-boards/contra.png'),
  peopleperhour: require('@/assets/images/job-boards/peopleperhour.png'),
};
