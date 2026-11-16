import { makeMutable } from 'react-native-reanimated';

/**
 * 1 while a tab is showing its skeleton for a fold or unfold of the iPhone Duo (`useViewportSettling`), else 0. A
 * Reanimated value, so the cover that hides the half-switched layout (`ViewportCover`, on the UI thread) can read it
 * without waiting for JavaScript.
 */
export const skeletonShowing = makeMutable(0);
