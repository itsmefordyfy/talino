import { useEffect, useState } from 'react';

import { addOnlineListener, getIsOnlineAsync } from '@/lib/network';

/** Whether the phone has an internet connection, updated as it changes. Starts optimistic. Use it to explain, never to block what works on the phone. */
export function useIsOnline(): boolean {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    let active = true;
    void getIsOnlineAsync().then((value) => {
      if (active) setOnline(value);
    });
    const unsubscribe = addOnlineListener(setOnline);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);
  return online;
}
