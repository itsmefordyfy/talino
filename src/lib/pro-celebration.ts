import { useSyncExternalStore } from 'react';

let showing = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/**
 * Celebrates Talino Pro just bought (a happy Tali and confetti), over whatever screen is open. Kept outside React state, so the
 * purchase code needs no provider (copied from Pawfetti's, CarMind's and Ulamin's `lib/pro-celebration`, owner's request 2026-11-15).
 */
export function celebratePro(): void {
  showing += 1;
  emit();
}

/** How long a sheet takes to slide away, with some to spare. */
export const SHEET_CLOSE_MS = 600;

/**
 * Celebrates once the paywall that sold Pro has closed. iOS drops a modal presented while a sheet is still sliding away, so this
 * waits for the close.
 */
export function celebrateProAfterClose(): void {
  setTimeout(celebratePro, SHEET_CLOSE_MS);
}

export function endProCelebration(): void {
  showing = 0;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The celebration showing now: a new number for each one, 0 for none. */
export function currentProCelebration(): number {
  return showing;
}

/** A new number for each celebration (0 when none), for the one ProCelebrationHost in the app's hosts. */
export function useProCelebration(): number {
  return useSyncExternalStore(subscribe, currentProCelebration);
}
