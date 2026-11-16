const slug = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** "ana-cruz-resume": the exported file's name before its extension (the person's name, else the résumé's name, else "my"). */
export function exportFileBase(personName: string, documentName: string): string {
  const base = slug(personName) || slug(documentName) || 'my';
  return `${base.slice(0, 40).replace(/-+$/g, '')}-resume`;
}
