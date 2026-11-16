import * as Clipboard from 'expo-clipboard';

import { tapFeedback } from '@/lib/haptics';

/** Copies text and gives the light tap that confirms it. Returns false when the clipboard refused. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    tapFeedback();
    return true;
  } catch {
    return false;
  }
}
