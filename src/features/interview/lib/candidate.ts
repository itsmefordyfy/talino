/**
 * What the interviewer may know about the candidate: their résumé and portfolio as plain text. Built on the phone from what the
 * learner already keeps in Talino (nothing is invented or added), cut to a size the model can use, and sanitized again on the
 * server, which treats it as untrusted text and never as instructions.
 */

export const MAX_CANDIDATE_CHARS = 3600;

type EntryLike = { title: string; organization: string; start: string; end: string; current: boolean; bullets: string[] };

/** The parts of a résumé the interview reads (the app's `ResumeContent` has all of them). */
export type CandidateResume = {
  headline: string;
  summary: string;
  skills: string[];
  experience: EntryLike[];
  projects: EntryLike[];
  education: EntryLike[];
  certifications: EntryLike[];
};

export type CandidateProject = { title: string; summary: string; role: string; tech: string[] };

export type CandidateInput = {
  resume: CandidateResume | null;
  portfolio: readonly CandidateProject[];
  /** The résumé's own career goal and level, as the learner wrote them. */
  goal: string;
  level: string;
};

const line = (value: string, max: number) => value.replace(/\s+/g, ' ').trim().slice(0, max);

function entryLine(entry: EntryLike, bullets: number): string {
  const when = entry.start || entry.end ? ` (${[entry.start, entry.current ? 'present' : entry.end].filter(Boolean).join(' – ')})` : '';
  const head = `- ${line(entry.title, 90)}${entry.organization ? `, ${line(entry.organization, 70)}` : ''}${when}`;
  const detail = entry.bullets.slice(0, bullets).map((bullet) => `  · ${line(bullet, 160)}`);
  return [head, ...detail].join('\n');
}

/**
 * The candidate as text, empty when there is nothing to say. Sections are added in the order an interviewer reads a résumé and
 * the whole is cut at `MAX_CANDIDATE_CHARS` on a line boundary, so a long résumé loses its tail instead of a half sentence.
 */
export function candidateText(input: CandidateInput): string {
  const sections: string[] = [];
  const { resume } = input;
  if (input.goal.trim()) sections.push(`Career goal: ${line(input.goal, 200)}`);
  if (input.level.trim()) sections.push(`Stated level: ${line(input.level, 60)}`);
  if (resume) {
    if (resume.headline.trim()) sections.push(`Headline: ${line(resume.headline, 120)}`);
    if (resume.summary.trim()) sections.push(`Summary: ${line(resume.summary, 500)}`);
    if (resume.skills.length > 0) sections.push(`Skills: ${resume.skills.slice(0, 40).map((skill) => line(skill, 40)).join(', ')}`);
    if (resume.experience.length > 0) sections.push(['Experience:', ...resume.experience.slice(0, 6).map((entry) => entryLine(entry, 3))].join('\n'));
    if (resume.projects.length > 0) sections.push(['Projects on the résumé:', ...resume.projects.slice(0, 5).map((entry) => entryLine(entry, 2))].join('\n'));
    if (resume.education.length > 0) sections.push(['Education:', ...resume.education.slice(0, 3).map((entry) => entryLine(entry, 0))].join('\n'));
    if (resume.certifications.length > 0) sections.push(['Certifications:', ...resume.certifications.slice(0, 6).map((entry) => entryLine(entry, 0))].join('\n'));
  }
  if (input.portfolio.length > 0) {
    sections.push(
      [
        'Portfolio projects:',
        ...input.portfolio.slice(0, 5).map((project) => `- ${line(project.title, 90)}${project.role ? ` (role: ${line(project.role, 60)})` : ''}${project.tech.length > 0 ? ` [${project.tech.slice(0, 8).join(', ')}]` : ''}${project.summary ? `: ${line(project.summary, 200)}` : ''}`),
      ].join('\n'),
    );
  }
  return cutAtLine(sections.join('\n'), MAX_CANDIDATE_CHARS);
}

/** Cuts at a line boundary when the text is too long. */
export function cutAtLine(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastBreak = cut.lastIndexOf('\n');
  return (lastBreak > max * 0.6 ? cut.slice(0, lastBreak) : cut).trimEnd();
}

/** The server's check of what the app sent: text only, no control characters, cut to size. */
export function sanitizeCandidate(value: unknown): string {
  if (typeof value !== 'string') return '';
  return cutAtLine(value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/\r/g, '').trim(), MAX_CANDIDATE_CHARS);
}
