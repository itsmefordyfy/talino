import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';

import { selectNotesSeen, selectOnboarded, whatsNewSeen } from '@/features/settings/settings-slice';
import { releaseVersion } from '@/lib/app-version';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { notesFor } from '../lib/release-notes';
import { whatsNewAction } from '../lib/whats-new-rule';

/** A moment after the app is in front, so it doesn't open on top of the launch. */
const DELAY_MS = 1500;

/**
 * After an update, once: opens the release notes of the new version. A fresh install has nothing to announce (it is marked as up to
 * date while the welcome is up), and a version with no notes is left alone. The sheet marks the version seen when it opens, so closing
 * it any way counts. Mounted once with the other hosts.
 */
export function WhatsNewHost() {
  const dispatch = useAppDispatch();
  const onboarded = useAppSelector(selectOnboarded);
  const lastSeen = useAppSelector(selectNotesSeen);
  const pathname = usePathname();
  const version = releaseVersion();
  const action = whatsNewAction({ version, lastSeen, onboarded, hasNotes: notesFor(version).length > 0, pathname });

  useEffect(() => {
    if (action === 'mark') dispatch(whatsNewSeen(version));
    if (action !== 'show') return;
    const timer = setTimeout(() => router.push('/whats-new'), DELAY_MS);
    return () => clearTimeout(timer);
  }, [action, dispatch, version]);

  return null;
}
