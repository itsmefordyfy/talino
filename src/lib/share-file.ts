/**
 * Sharing a file the phone made (a report). The native modules (print, sharing, files) are loaded
 * when an export runs, not when its screen opens, so a build without them still shows the screen
 * and only the export reports the problem. Adapted from Pawfetti's `share-file.ts`.
 */

/**
 * A page in points (1/72 inch); the print module's default is US Letter with no margins. The margins are passed to the print
 * module itself: iOS's print renderer ignores CSS `@page` margins and would print text against the paper's edge.
 */
export type PageSize = { width: number; height: number; margins?: { top: number; right: number; bottom: number; left: number } };

/** Prints the HTML to a PDF in the cache, named `fileName` (an older file of that name is replaced). Returns its uri. */
export async function printPdf(html: string, fileName: string, page?: PageSize): Promise<string> {
  const [{ File, Paths }, Print] = await Promise.all([import('expo-file-system'), import('expo-print')]);
  const printed = await Print.printToFileAsync(page ? { html, width: page.width, height: page.height, margins: page.margins } : { html });
  const file = new File(Paths.cache, fileName);
  if (file.exists) file.delete();
  new File(printed.uri).move(file);
  return file.uri;
}

/** Prints the HTML to a PDF and opens the share sheet. False when sharing isn't available here. */
export async function sharePdf(html: string, fileName: string, page?: PageSize): Promise<boolean> {
  const Sharing = await import('expo-sharing');
  if (!(await Sharing.isAvailableAsync())) return false;
  const uri = await printPdf(html, fileName, page);
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: fileName });
  return true;
}

/** Writes bytes to a file in the cache (an older file of that name is replaced) and opens the share sheet. False when sharing isn't available here. */
export async function shareBytes(bytes: Uint8Array, fileName: string, type: { mimeType: string; uti: string }): Promise<boolean> {
  const [{ File, Paths }, Sharing] = await Promise.all([import('expo-file-system'), import('expo-sharing')]);
  if (!(await Sharing.isAvailableAsync())) return false;
  const file = new File(Paths.cache, fileName);
  file.create({ overwrite: true, intermediates: true });
  await file.write(bytes);
  await Sharing.shareAsync(file.uri, { mimeType: type.mimeType, UTI: type.uti, dialogTitle: fileName });
  return true;
}
