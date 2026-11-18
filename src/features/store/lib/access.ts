import type { CourseKind } from '@/features/courses/content/types';

import type { CustomerInfo } from '../types';
import { ALL_ACCESS_ENTITLEMENT, courseEntitlement } from './catalog';

/** The free starter course is everyone's; any other course needs its own entitlement or All-Access. */
export function ownsCourse(info: Pick<CustomerInfo, 'entitlements'> | null | undefined, course: { id: string; kind: CourseKind }): boolean {
  if (course.kind === 'starter') return true;
  if (!info) return false;
  return info.entitlements.includes(courseEntitlement(course.id)) || info.entitlements.includes(ALL_ACCESS_ENTITLEMENT);
}

/** The first lesson of every course is free, a taste of it (owner, 2026-11-18); the rest, its projects and its certificate need Talino Pro. */
export function isFreeLesson(course: { lessons: readonly { id: string }[] }, lessonId: string): boolean {
  return course.lessons[0]?.id === lessonId;
}

/** A lesson can be opened by whoever has its course, and by anyone for the course's first lesson. */
export function canOpenLesson(info: Pick<CustomerInfo, 'entitlements'> | null | undefined, course: { id: string; kind: CourseKind; lessons: readonly { id: string }[] }, lessonId: string): boolean {
  return ownsCourse(info, course) || isFreeLesson(course, lessonId);
}

export function hasAllAccess(info: Pick<CustomerInfo, 'entitlements'> | null | undefined): boolean {
  return !!info?.entitlements.includes(ALL_ACCESS_ENTITLEMENT);
}

/** Has bought anything (a course, a mini-course, the bundle, All-Access): Tali's fair use then applies. */
export function hasAnyPurchase(info: Pick<CustomerInfo, 'entitlements'> | null | undefined): boolean {
  return !!info && info.entitlements.length > 0;
}
