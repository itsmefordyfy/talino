import { items as module01 } from './scenarios/module-01';
import { items as module02 } from './scenarios/module-02';
import { items as module03 } from './scenarios/module-03';
import { items as module04 } from './scenarios/module-04';
import { items as module05 } from './scenarios/module-05';
import { items as module06 } from './scenarios/module-06';
import { items as module07 } from './scenarios/module-07';
import { items as module08 } from './scenarios/module-08';
import { items as module09 } from './scenarios/module-09';
import { items as module10 } from './scenarios/module-10';
import { CLIENT_ITEMS } from './scenarios/clients';
import { PRODUCTIVITY_ITEMS } from './scenarios/productivity';
import { items as lab01 } from './labs/module-01';
import { items as lab02 } from './labs/module-02';
import { items as lab03 } from './labs/module-03';
import { items as lab04 } from './labs/module-04';
import { items as lab05 } from './labs/module-05';
import { items as lab06 } from './labs/module-06';
import { items as lab07 } from './labs/module-07';
import { items as lab08 } from './labs/module-08';
import { items as lab09 } from './labs/module-09';
import { items as lab10 } from './labs/module-10';
import { items as lab11 } from './labs/module-11';
import { items as lab12 } from './labs/module-12';
import type { LabTask, MessageTask, PracticeItem, RoleplayScenario } from './types';

/**
 * Every role-play scenario and message task, by id. Plain data imported by the app (to show the setting and the opening) and by the
 * server route (to build the AI's instructions), so the same catalog answers both and the phone never sends instructions.
 */
export const PRACTICE_ITEMS: readonly PracticeItem[] = [...module01, ...module02, ...module03, ...module04, ...module05, ...module06, ...module07, ...module08, ...module09, ...module10, ...CLIENT_ITEMS, ...PRODUCTIVITY_ITEMS, ...lab01, ...lab02, ...lab03, ...lab04, ...lab05, ...lab06, ...lab07, ...lab08, ...lab09, ...lab10, ...lab11, ...lab12];

const BY_ID = new Map(PRACTICE_ITEMS.map((item) => [item.id, item]));

export const findPracticeItem = (id: string): PracticeItem | undefined => BY_ID.get(id);
export const findScenario = (id: string): RoleplayScenario | undefined => {
  const item = BY_ID.get(id);
  return item?.kind === 'roleplay' ? item : undefined;
};
export const findLab = (id: string): LabTask | undefined => {
  const item = BY_ID.get(id);
  return item?.kind === 'lab' ? item : undefined;
};
export const findMessageTask = (id: string): MessageTask | undefined => {
  const item = BY_ID.get(id);
  return item?.kind === 'message' ? item : undefined;
};
