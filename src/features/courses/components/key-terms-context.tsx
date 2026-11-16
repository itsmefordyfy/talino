import { createContext, use, type ReactNode } from 'react';

import type { KeyTerm } from '../lib/key-terms';

// Empty outside a lesson (Tali's answers draw lesson blocks too), so nothing is bolded there.
const KeyTermsContext = createContext<readonly KeyTerm[]>([]);

/** The open lesson's key terms (`lessonKeyTerms`), for the reading text inside it to bold. */
export function KeyTermsProvider({ terms, children }: { terms: readonly KeyTerm[]; children: ReactNode }) {
  return <KeyTermsContext value={terms}>{children}</KeyTermsContext>;
}

export function useKeyTerms(): readonly KeyTerm[] {
  return use(KeyTermsContext);
}
