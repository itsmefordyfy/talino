import { defineStrings } from '@/lib/i18n';

const quote = (key: string) => `"${key}"`;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

const hashTable = {
  title: 'Hash table collisions',
  summary: 'A hash table turns each key into a bucket number so a lookup can jump straight to the right place, until two keys land in the same bucket.',
  description: 'Type a short word or pick one, then insert it, look it up or delete it. The hash is the sum of the letters\' character codes, mod 7, and the caption shows the arithmetic. Switch between separate chaining (a list in each bucket) and open addressing with linear probing (try the next slot). Collisions are marked in red, and the counters show the load factor, the slots probed and the keys compared.',
  topics: ['hash table', 'hash map', 'hashing', 'hash function', 'collision', 'collisions', 'separate chaining', 'chaining', 'open addressing', 'linear probing', 'probing', 'load factor', 'bucket', 'dictionary', 'tombstone', 'lookup', 'O(1)', 'data structure'],
  keyLabel: 'Key (1 to 8 letters or digits)',
  presetsLabel: 'Try a word',
  modeLabel: 'Collision strategy',
  modes: { chaining: 'Separate chaining', probing: 'Linear probing' },
  buttons: { insert: 'Insert', lookup: 'Look up', delete: 'Delete', reset: 'Reset table' },
  bucketLabel: 'Bucket',
  slotLabel: 'Slot',
  emptyBucket: 'empty',
  deletedMark: 'deleted',
  chainEnd: 'null',
  loadFactor: (count: number, size: number) => `Load factor: ${count}/${size} = ${(count / size).toFixed(2)}`,
  probes: (n: number) => `Probes: ${n}`,
  compares: (n: number) => `Compares: ${n}`,
  collisions: (n: number) => `Collisions: ${n}`,
  operationNames: { insert: 'Insert', lookup: 'Look up', delete: 'Delete' },
  operationLabel: 'Operation',
  noOperation: 'none yet',
  loadNote: (mode: 'chaining' | 'probing', load: number) =>
    load < 0.5 ? 'Plenty of room: most keys get a bucket to themselves, so collisions are rare.' : load <= 0.75 ? 'Getting full: collisions are becoming common.' : mode === 'chaining' ? 'Heavily loaded: chains are long, so each lookup compares many keys.' : 'Nearly full: probing has to try many slots. Real tables are resized well before this.',
  complexity: 'Average O(1) when keys spread out and the load factor stays low. Worst case O(n) when many keys pile into one bucket or one run of slots.',
  legend: { collision: 'Collision', looking: 'Looking here', stored: 'Stored', found: 'Found', removed: 'Removed' },
  hashRule: 'Hash = (sum of the characters\' codes) mod 7',
  tableLabel: (mode: 'chaining' | 'probing', entries: readonly string[]) => `${mode === 'chaining' ? 'Hash table with separate chaining' : 'Hash table with linear probing'}. ${entries.join('. ')}`,
  bucketEntry: (index: number, keys: readonly string[]) => `Bucket ${index}: ${keys.length === 0 ? 'empty' : keys.join(', then ')}`,
  slotEntry: (index: number, state: string) => `Slot ${index}: ${state}`,
  intro: (mode: 'chaining' | 'probing', count: number) => `This table holds ${count} words in 7 ${mode === 'chaining' ? 'buckets' : 'slots'}. Insert "sun": it hashes to the same place as "dog", so it collides.`,
  switched: (mode: 'chaining' | 'probing', dropped: number, size: number) => `Switched to ${mode === 'chaining' ? 'separate chaining' : 'linear probing'}: the same keys were inserted again in the same order.${dropped > 0 ? ` Only the first ${size} fit in ${size} slots, so ${dropped} ${dropped === 1 ? 'was' : 'were'} dropped.` : ''}`,
  badKey: 'Type a key first: 1 to 8 lowercase letters or digits.',
  hashed: (key: string, parts: readonly string[], sum: number, size: number, bucket: number) => `Hash ${quote(key)}: ${parts.join(' + ')}${parts.length > 1 ? ` = ${sum}` : ''}, and ${sum} mod ${size} = ${bucket}. So ${quote(key)} belongs at index ${bucket}.`,
  tableFullChaining: (key: string, max: number) => `The picture holds at most ${max} keys, so ${quote(key)} was not added.`,
  tableFullProbing: (key: string, size: number) => `All ${size} slots are taken, so ${quote(key)} cannot be stored. Open addressing needs spare slots, which is why real tables grow before they fill.`,
  duplicate: (key: string) => `${quote(key)} is already stored, so nothing is added.`,
  // separate chaining
  chainVisit: (bucket: number, keys: readonly string[]) => (keys.length === 0 ? `Look in bucket ${bucket}: it is empty.` : `Look in bucket ${bucket}: its chain holds ${keys.map(quote).join(' → ')}.`),
  chainCollision: (bucket: number, key: string, keys: readonly string[]) => `Collision: bucket ${bucket} already holds ${keys.map(quote).join(' → ')}, but ${quote(key)} hashes there too. With chaining, a new key can join the chain, after a check that it is not already in it.`,
  compare: (stored: string, target: string, equal: boolean) => (equal ? `Compare ${quote(stored)} with ${quote(target)}: they match.` : `Compare ${quote(stored)} with ${quote(target)}: different.`),
  chainPlaceEmpty: (key: string, bucket: number) => `Bucket ${bucket} was empty: store ${quote(key)} there. No collision.`,
  chainPlaceEnd: (key: string, bucket: number, length: number) => `Not in the chain, so ${quote(key)} is added at its end. Bucket ${bucket} now holds ${plural(length, 'key')}, and every lookup there has to compare them one by one.`,
  chainFound: (key: string, bucket: number, compares: number) => `Found ${quote(key)} in bucket ${bucket} after ${plural(compares, 'comparison')}.`,
  chainMissEmpty: (key: string, bucket: number) => `Bucket ${bucket} is empty, so ${quote(key)} is not stored.`,
  chainMissEnd: (key: string, bucket: number, compares: number) => `Compared all ${plural(compares, 'key')} in bucket ${bucket}: ${quote(key)} is not stored.`,
  chainRemoved: (key: string, bucket: number) => `Removed ${quote(key)} from bucket ${bucket}'s chain.`,
  // linear probing
  probeEmptyInsert: (slot: number, key: string, first: boolean) => (first ? `Slot ${slot} is empty: ${quote(key)} can go right here. No collision.` : `Slot ${slot} is empty, so ${quote(key)} is not stored further along. Probing stops here.`),
  probeFull: (slot: number, stored: string, own: number, next: number) => `Slot ${slot} holds ${quote(stored)} (its own hash is ${own}). Not our key: a collision. Linear probing moves on to the next slot, ${next}.`,
  probeTomb: (slot: number) => `Slot ${slot} holds a deleted marker (a tombstone). A lookup must go past it, because the key may sit further on. An insert may reuse it, after checking the rest of the run.`,
  probePlace: (key: string, slot: number, collisions: number) => `Store ${quote(key)} in slot ${slot}${collisions > 0 ? ` after ${plural(collisions, 'collision')}` : ''}.`,
  probePlaceTomb: (key: string, slot: number) => `${quote(key)} is not stored anywhere in the run, so reuse the first deleted slot, ${slot}, for it.`,
  probeFound: (key: string, slot: number, compares: number) => `Found ${quote(key)} in slot ${slot} after ${plural(compares, 'comparison')}.`,
  probeMissEmpty: (slot: number, key: string) => `Slot ${slot} is empty, so ${quote(key)} cannot be further along: it is not stored.`,
  probeMissAll: (key: string, probes: number) => `Probed all ${plural(probes, 'slot')} and ${quote(key)} is not stored.`,
  probeRemoved: (key: string, slot: number) => `Removed ${quote(key)} from slot ${slot}, leaving a deleted marker instead of an empty slot, so lookups for keys that probed past this slot still work.`,
  deleteMissing: (key: string) => `${quote(key)} is not stored, so there is nothing to delete.`,
};

export const hashTableStrings = defineStrings({
  en: hashTable,
  // Placeholder, not a translation: the owner's rule is no Filipino text, so this stays English until a translation is commissioned.
  fil: hashTable,
});
