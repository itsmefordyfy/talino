import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';

import { chunkForSpeech } from '@/lib/speech-chunks';

/**
 * Reads a partner's line aloud with the phone's own voice (expo-speech), one line at a time: starting another stops the first, and leaving
 * the screen stops everything. This is the whole of the app's speaking support: it never records or analyses a voice.
 */
export function useReadAloud() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const current = useRef<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      current.current = null;
      void Speech.stop();
    };
  }, []);

  const finish = (id: string) => {
    // A line that was stopped for the next one must not clear the next one's state.
    if (current.current !== id) return;
    current.current = null;
    if (mounted.current) setSpeakingId(null);
  };

  const stop = () => {
    current.current = null;
    setSpeakingId(null);
    void Speech.stop();
  };

  const speak = (id: string, text: string) => {
    void Speech.stop();
    current.current = id;
    setSpeakingId(id);
    try {
      const pieces = chunkForSpeech(text, Math.min(Speech.maxSpeechInputLength || 3500, 3500));
      if (pieces.length === 0) return finish(id);
      pieces.forEach((piece, index) => Speech.speak(piece, { language: 'en', onDone: index === pieces.length - 1 ? () => finish(id) : undefined, onStopped: () => finish(id), onError: () => finish(id) }));
    } catch {
      // No voice on this device: the button simply returns to "Hear the reply".
      finish(id);
    }
  };

  return { speakingId, speak, stop };
}
