import type { PracticeItem } from '../../types';
import { items as module01 } from './module-01';
import { items as module02 } from './module-02';
import { items as module03 } from './module-03';
import { items as module04 } from './module-04';
import { items as module05 } from './module-05';
import { items as module06 } from './module-06';
import { items as module07 } from './module-07';
import { items as module08 } from './module-08';
import { items as module09 } from './module-09';
import { items as module10 } from './module-10';

/** The role-plays and message tasks of Time Management and Productivity (ids start `prod-`), read by the practice engine by id like every other item. */
export const PRODUCTIVITY_ITEMS: readonly PracticeItem[] = [...module01, ...module02, ...module03, ...module04, ...module05, ...module06, ...module07, ...module08, ...module09, ...module10];
