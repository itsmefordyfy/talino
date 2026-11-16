import { createContext, type ReactNode } from 'react';

/**
 * True while a lesson's audio is describing the visual this wraps (Listening Mode): the visual's step player (`useStepper`) then starts
 * from its first step and plays by itself, so the learner sees it while it is being explained; it stops when the voice moves on. Outside
 * a lesson (the Concept Lab) nothing provides it, and visuals play only when the learner presses Play, as always.
 */
export const VisualAutoplayContext = createContext(false);

export function VisualAutoplay({ active, children }: { active: boolean; children: ReactNode }) {
  return <VisualAutoplayContext value={active}>{children}</VisualAutoplayContext>;
}
