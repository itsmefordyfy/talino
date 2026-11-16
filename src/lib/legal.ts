import * as WebBrowser from 'expo-web-browser';

import { FACEBOOK_URL, LEGAL_URLS } from '@/constants/support';
import { reportError } from '@/lib/monitoring';

export type LegalPage = keyof typeof LEGAL_URLS;

/** Opens the Terms of Use or Privacy Policy in the in-app browser. */
export async function openLegalPage(page: LegalPage): Promise<void> {
  try {
    await WebBrowser.openBrowserAsync(LEGAL_URLS[page]);
  } catch (error) {
    reportError(error, 'app', { step: 'legal', page });
  }
}

/** Opens Talino's Facebook page in the in-app browser. */
export async function openFacebookPage(): Promise<void> {
  try {
    await WebBrowser.openBrowserAsync(FACEBOOK_URL);
  } catch (error) {
    reportError(error, 'app', { step: 'facebook' });
  }
}
