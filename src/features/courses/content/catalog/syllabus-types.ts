import type { CategoryId, CourseLevel, LearningGoalId } from '../types';

/**
 * One course of the wider catalog (`kind: 'standard'`): everything the catalog needs to know about it before a
 * lesson is written. The course file follows this entry (one lesson per topic, in this order, this level), and
 * `meta.ts` builds the course's catalog metadata from it, so none of this is typed twice.
 */
export type SyllabusEntry = {
  /** Also the course id and its file name (`courses/<id>.ts`). kebab-case, unique across the app. */
  id: string;
  title: string;
  level: CourseLevel;
  category: CategoryId;
  /** Course ids to take first. Advice, never a lock; the catalog's "next course" logic reads it. */
  prerequisites: string[];
  /** Ids from `technologies.ts`. */
  technologies: string[];
  goals: LearningGoalId[];
  /** Extra search words ("hooks", "interview", "pgvector"), lower case. */
  tags: string[];
  /**
   * A fast-moving subject (frameworks, cloud, AI, security): most lessons state product facts, so most lessons carry a
   * dated, officially-sourced `version` note (`lib/standard-rules.ts`). A stable subject (an algorithm, a pattern) doesn't need them.
   */
  volatile: boolean;
  /** Lesson titles, one lesson each, in teaching order. 5 to 15. */
  topics: string[];
  /** What sets this course apart from its neighbours, so a writer doesn't repeat another course (`docs/content/OVERLAPS.md`). */
  scope: string;
};
