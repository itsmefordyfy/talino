import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { nextGreetingChange } from '@/lib/greeting';

/**
 * The current time for the greeting and the date on Home: refreshed when the app comes back to
 * the front, and at the next moment the greeting or the date changes (5:00, 12:00, 18:00,
 * midnight), so a screen left open overnight says good morning on its own.
 */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = (from: Date) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const next = new Date();
        setNow(next);
        schedule(next);
      }, Math.max(1000, nextGreetingChange(from).getTime() - from.getTime()));
    };
    schedule(now);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      const next = new Date();
      setNow(next);
      schedule(next);
    });
    return () => {
      if (timer) clearTimeout(timer);
      subscription.remove();
    };
    // Scheduled from the time this effect ran; each firing reschedules itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return now;
}
