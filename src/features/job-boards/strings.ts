import { defineStrings } from '@/lib/i18n';

export const jobBoardStrings = defineStrings({
  en: {
    title: 'Job boards',
    headline: 'Where to look for work',
    intro: 'Open a board, or read its strategy first. A few good matches beat sending everything everywhere.',
    groups: { all: 'All', tech: 'Tech', ph: 'Philippines', remote: 'Remote', freelance: 'Freelance' },
    groupTitles: { tech: 'Tech and AI jobs', ph: 'Philippine job sites', remote: 'Remote job boards', freelance: 'Freelance marketplaces' },
    count: (n: number) => (n === 1 ? '1 board' : `${n} boards`),
    open: (name: string) => `Open ${name}`,
    strategy: 'Strategy',
    hideStrategy: 'Hide strategy',
    caution: 'Never pay to get a job, and check that a post is real before you share personal details. Talino isn’t affiliated with these sites.',
    openError: 'That page couldn’t be opened. Try again in a moment.',
  },
  fil: {
    title: 'Mga job board',
    headline: 'Saan maghahanap ng trabaho',
    intro: 'Buksan ang isang board, o basahin muna ang diskarte nito. Mas mabuti ang ilang tamang aplikasyon kaysa ipadala ang lahat kahit saan.',
    groups: { all: 'Lahat', tech: 'Tech', ph: 'Pilipinas', remote: 'Remote', freelance: 'Freelance' },
    groupTitles: { tech: 'Trabaho sa tech at AI', ph: 'Job site sa Pilipinas', remote: 'Mga remote job board', freelance: 'Mga freelance marketplace' },
    count: (n: number) => (n === 1 ? '1 board' : `${n} board`),
    open: (name: string) => `Buksan ang ${name}`,
    strategy: 'Diskarte',
    hideStrategy: 'Itago ang diskarte',
    caution: 'Huwag magbayad para makakuha ng trabaho, at tiyaking totoo ang post bago mo ibigay ang personal na detalye. Walang kaugnayan ang Talino sa mga site na ito.',
    openError: 'Hindi mabuksan ang page. Subukan ulit mamaya.',
  },
});
