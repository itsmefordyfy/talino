import type { PracticeItem } from '../../types';
import { items as module02 } from './module-02';
import { items as module05 } from './module-05';
import { items as module08 } from './module-08';
import { items as module09 } from './module-09';
import { items as module10 } from './module-10';
import { items as module11 } from './module-11';

/** The live prompt labs of Software Architecture with AI (ids start `arch-NN-`), read by the practice engine by id like every other item. */
export const ARCHITECTURE_LABS: readonly PracticeItem[] = [...module02, ...module05, ...module08, ...module09, ...module10, ...module11];
