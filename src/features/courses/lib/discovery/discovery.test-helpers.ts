import { buildCourseFacts, type CourseFacts } from '../catalog-facts';
import { fullCatalog } from '../full-catalog.test-helpers';

let cached: CourseFacts[] | null = null;

/** Facts of the whole planned catalog (real courses plus stubs), built once per test file. */
export function fullCatalogFacts(): CourseFacts[] {
  if (!cached) cached = buildCourseFacts(fullCatalog());
  return cached;
}

/** The ids of search results, for readable expectations. */
export const ids = (items: readonly { id: string }[]) => items.map((item) => item.id);
