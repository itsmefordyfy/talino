import type { CourseKind } from '@/features/courses/content/types';

import type { CustomerInfo } from '../types';
import { ALL_ACCESS_ENTITLEMENT, courseEntitlement } from './catalog';

/** The free starter course is everyone's; any other course needs its own entitlement or All-Access. */
export function ownsCourse(info: Pick<CustomerInfo, 'entitlements'> | null | undefined, course: { id: string; kind: CourseKind }): boolean {
  if (course.kind === 'starter') return true;
  if (!info) return false;
  return info.entitlements.includes(courseEntitlement(course.id)) || info.entitlements.includes(ALL_ACCESS_ENTITLEMENT);
}

export function hasAllAccess(info: Pick<CustomerInfo, 'entitlements'> | null | undefined): boolean {
  return !!info?.entitlements.includes(ALL_ACCESS_ENTITLEMENT);
}

/** Has bought anything (a course, a mini-course, the bundle, All-Access): Tali's fair use then applies. */
export function hasAnyPurchase(info: Pick<CustomerInfo, 'entitlements'> | null | undefined): boolean {
  return !!info && info.entitlements.length > 0;
}
