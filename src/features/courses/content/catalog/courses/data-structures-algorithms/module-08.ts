import type { Lesson, Project } from '../../../types';

const CHECKED = '2026-11-16';

// Every page below was opened on CHECKED.
const DOCS = {
  mdnCharCodeAt: { label: 'MDN: String.prototype.charCodeAt()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt' },
  mdnMap: { label: 'MDN: Map', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map' },
  specMap: { label: 'ECMAScript specification: Keyed collections', url: 'https://tc39.es/ecma262/multipage/keyed-collections.html' },
};

export const lessons: Lesson[] = [
  {
    id: 'data-structures-algorithms-27',
    day: 27,
    title: 'What Hashing and Hash Functions Are',
    summary: 'Turn a key into a number that says where to look, so a value can be found without scanning for it.',
    intro: {
      objectives: [
        'Explain what a hash function is and why a hash table uses the remainder to pick a slot',
        'Name three qualities of a good hash function: deterministic, well spread and fast',
        'Write a small string hash from character codes and show why a plain sum is weak',
        'Say what a collision is and why it cannot be avoided',
      ],
      why: 'Fast lookup by key is behind caches, indexes, deduplication and nearly every Map an AI writes for you. If you know what hashing does, you can tell when a lookup really is fast and when a poor key choice quietly makes it slow.',
    },
    minutes: 25,
    skills: ['hashing', 'complexity'],
    body: [
      { type: 'paragraph', text: "Finding a customer by id in an array means looking at records one after another until you meet the right one. With a million customers that is a lot of looking. A **hash function** takes a different approach: it does a little arithmetic on the key itself and gets back a number that says *where the record lives*. No searching, just a calculation. This lesson explains that idea and builds a small hash function. The next three lessons use it to make a real table." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Imagine a mailroom with ten pigeonholes numbered 0 to 9. The clerk has a rule that turns a person's name into a number, for example by adding up the letters in some way and keeping the last digit. To file a letter for Nena, the clerk applies the rule, gets 4 and drops the letter into hole 4. To find it later, the clerk applies the same rule to the same name and walks straight to hole 4. Nobody searches the room." },
      { type: 'paragraph', text: "Where the picture stops working: two different names can produce the same number, so two people's letters may share a hole. That is called a **collision**, and it is not a flaw in one clerk's rule. It is unavoidable whenever there are more possible names than holes, and the next lesson deals with it." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "A **hash function** takes a key (a string, a number, an id) and returns an integer called its **hash**. A hash table is an array of slots, and the slot a key goes to is `hash % capacity`, where `capacity` is the number of slots. The remainder is needed because a hash can be a huge number, while the array only has slots numbered 0 to capacity - 1. The remainder always lands inside that range." },
      { type: 'paragraph', text: "Three qualities make a hash function good for a table:" },
      {
        type: 'list',
        items: [
          '**Deterministic.** The same key must give the same hash every time, in every run. If it did not, a key stored today could never be found tomorrow.',
          '**Well spread.** Different keys should land in different slots as evenly as possible. If most keys share a few slots, those slots become crowded and lookups slow down.',
          '**Fast.** Computing the hash must be cheaper than the search it replaces. A good string hash looks at each character once, so its cost depends on the length of the key, not on how many keys are stored.',
        ],
      },
      { type: 'paragraph', text: "Notice what is *not* required: two different keys are allowed to share a hash. Equal keys must give equal hashes, but equal hashes do not prove the keys are equal." },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a hash function is a recipe that turns a key, like the word \"Nena\", into a number. The recipe always gives the same number for the same word, so you can use the number as an address. If the array has 10 slots, you divide the number by 10 and keep the remainder, which is a number from 0 to 9. That tells you which slot to open. Finding something is then one calculation and one look, instead of a search through everything." },
      { type: 'visual', id: 'hash-table-collisions', caption: 'Insert a few keys and watch each one get its slot from the hash. Look for two keys that end up in the same slot: that is a collision.' },
      { type: 'paragraph', text: "To hash a string we need a number for each character. In JavaScript `key.charCodeAt(i)` gives the number that stands for the character at position `i` (for example `'a'` is 97 and `'b'` is 98). The simplest idea is to add up all the codes. It is deterministic and fast, but it has a problem you can see in the code below: it does not care about the *order* of the characters, so anagrams such as `abc` and `bca` get the same hash, and so do ids like `SKU-001`, `SKU-010` and `SKU-100`. A better recipe lets position matter: at every step multiply the running total by a small number (here 31) before adding the next character. We also keep the total below 1,000,003 with `%` as we go, so the numbers stay small and exact." },
      { type: 'version', text: "MDN describes charCodeAt() as returning an integer from 0 to 65535, the UTF-16 code unit at that index, and NaN when the index is out of range. A character outside the basic range, such as many emoji, is stored as two code units, so the hash below sees two numbers for it. That is fine for hashing, but it is the reason MDN points to codePointAt() when you need the whole character.", checked: CHECKED, sources: [DOCS.mdnCharCodeAt] },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "First the plain sum, and what goes wrong with it." },
      {
        type: 'code',
        language: 'javascript',
        label: 'A hash that adds up the character codes',
        code: `function hashSum(key) {
  let total = 0;
  for (let i = 0; i < key.length; i++) {
    total += key.charCodeAt(i);
  }
  return total;
}
console.log(hashSum('cab'), hashSum('abc'), hashSum('bca'));
console.log(hashSum('cab') % 10);
console.log('SKU-001', hashSum('SKU-001'), 'SKU-010', hashSum('SKU-010'), 'SKU-100', hashSum('SKU-100'));`,
      },
      { type: 'paragraph', text: "Now the version where position matters, with the remainder that picks a slot, and a deliberately bad hash (the length of the key) for comparison." },
      {
        type: 'code',
        language: 'javascript',
        label: 'A better hash, a slot, and a bad hash',
        code: `function hashPoly(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % 1000003;
  }
  return h;
}
function slotFor(key, capacity) {
  return hashPoly(key) % capacity;
}
console.log(hashPoly('cab'), hashPoly('abc'), hashPoly('bca'));
const names = ['Nena', 'Ben', 'Joy', 'Rico', 'Lita', 'Ana'];
for (const name of names) {
  console.log(name, '->', slotFor(name, 10));
}
console.log(slotFor('Nena', 10), slotFor('Nena', 10));
console.log(slotFor('Nena', 7));
function hashLength(key) {
  return key.length;
}
for (const name of names) {
  console.log(name, '->', hashLength(name) % 10);
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**hashSum.** For `cab` it adds 99 + 97 + 98 = 294, and `abc` and `bca` add the same three numbers in another order, so all three print 294. The slot in a 10-slot table is 294 % 10 = 4. The three SKU ids contain the same characters in different places, so they all print 433.',
          '**hashPoly.** For `cab` the running value goes 0, then 99, then 99 * 31 + 97 = 3166, then 3166 * 31 + 98 = 98244. The other two orders give 96354 and 97344, so the order of letters now matters.',
          '**slotFor.** The six names go to slots 0, 7, 6, 1, 8 and 2, six different slots. That is luck: with only six keys in ten slots a collision was possible, and the next lesson shows how likely it is. Asking for `Nena` twice prints `0 0` because the function is deterministic, and changing the capacity to 7 gives slot 4, so the slot depends on the capacity as well as the key.',
          '**hashLength.** The names have lengths 4, 3, 3, 4, 4 and 3, so they only ever land in slots 3 and 4 (the output is `Nena -> 4`, `Ben -> 3`, and so on). That is a hash that is deterministic and fast but not spread out, and it would make a table crowd into a couple of slots.',
        ],
      },
      {
        type: 'table',
        headers: ['After reading', 'running value h', 'Calculation'],
        rows: [
          ['(start)', '0', ''],
          ['c (99)', '99', '0 * 31 + 99'],
          ['a (97)', '3166', '99 * 31 + 97'],
          ['b (98)', '98244', '3166 * 31 + 98'],
        ],
        caption: 'Tracing hashPoly(\'cab\'). Because the running value is multiplied each step, an earlier letter counts differently from a later one.',
      },
      { type: 'warning', text: "A hash function for a table is not a security tool. Password and file hashes (SHA-256 and friends) have a different job: they must be impossible to reverse. A table hash only needs to be quick and well spread. Never store passwords with a toy hash like the ones here." },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "Design details engineers worry about: a good hash should *avalanche* (a one-character change flips about half of the output bits), tables often size themselves to powers of two or primes to interact well with `%`, and some systems seed the hash with a random value at startup so an attacker cannot craft many keys that collide and degrade the table to a linear scan (hash flooding). Also, only immutable data should be a key: hashing an object by its contents and then changing the contents makes the stored key unfindable. JavaScript's Map hashes objects by identity, not by content, and does not expose its hash at all." },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Use any assistant. Work out your own answers first, then let it check you." },
      { type: 'prompt', label: 'Test my hash by hand', text: "I am learning hash functions in JavaScript. Show me a tiny hash function that adds the character codes of a short string and takes the remainder by 8. Give me four short keys, one at a time, and ask me to compute each key's slot by hand (tell me the character codes I need). Do not give me the answer until I reply. Then ask me to find two keys that collide." },
      { type: 'prompt', label: 'Is this hash any good?', text: "Here are three ideas for hashing customer names into 1,000 slots: the length of the name, the first letter, and a loop that multiplies the running total by 31 before adding each character code. Without telling me which is best, ask me to rank them and explain which qualities (deterministic, well spread, fast) each one has. After I answer, tell me where I am right and where I am wrong." },
      { type: 'paragraph', text: "What to look for: the assistant should tie each claim to a quality, for instance \"the length hash is not well spread because few lengths exist\". An assistant can mislead you by saying a hash function \"avoids collisions\". No hash function can, when there are more keys than slots; the best you can do is spread keys out and handle collisions when they happen." },
      {
        type: 'takeaways',
        items: [
          'A hash function turns a key into an integer; the slot is hash % capacity, which always lies between 0 and capacity - 1.',
          'A good hash is deterministic, well spread and fast; hashing a string costs time proportional to its length, not to how many keys are stored.',
          'A plain sum of character codes ignores order, so anagrams and ids like SKU-001 and SKU-100 collide; multiplying as you go makes position matter.',
          'Equal keys must have equal hashes, but different keys can share one: that is a collision, and it can never be fully avoided.',
          'A hash for a table is not a security hash.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-27-predict-output-1',
          kind: 'predict-output',
          title: 'Hash it by hand',
          prompt: 'Predict what this prints. The character codes you need: a is 97, b is 98, d is 100.',
          concept: 'sum hash and remainder',
          language: 'javascript',
          code: `function hashSum(key) {
  let total = 0;
  for (let i = 0; i < key.length; i++) {
    total += key.charCodeAt(i);
  }
  return total;
}
console.log(hashSum('ad'));
console.log(hashSum('da'));
console.log(hashSum('ad') % 8);
console.log(hashSum('ab') % 8);`,
          choices: ['197\n197\n5\n3', '197\n179\n5\n3', '197\n197\n3\n5', '98\n98\n2\n3'],
          wrongNotes: {
            '197\n179\n5\n3': 'The sum ignores order: ad and da add the same two codes, so they give the same total.',
            '197\n197\n3\n5': 'Compute each remainder separately: 197 % 8 is 5 (8 * 24 = 192, and 197 - 192 = 5), and 195 % 8 is 3.',
            '98\n98\n2\n3': 'The hash adds the codes of both letters (97 + 100), it does not use the length or only one letter.',
          },
          hints: ['ad is 97 + 100. What is da?', 'Divide 197 by 8: 8 * 24 is 192. What is left over?', 'ab is 97 + 98 = 195. What is 195 % 8?'],
          explanation: 'Both ad and da sum to 197 because order does not matter to a sum. 197 % 8 is 5, and ab sums to 195, with 195 % 8 equal to 3.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-27-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the hash',
          prompt: 'Fill in the blanks so that hashPoly reads every character code and slotFor keeps the result inside the table. It should print 0 then 7.',
          concept: 'string hash and slot',
          language: 'javascript',
          code: `function hashPoly(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.___(i)) % 1000003;
  }
  return h;
}
function slotFor(key, capacity) {
  return hashPoly(key) ___ capacity;
}
console.log(slotFor('Nena', 10));
console.log(slotFor('Ben', 10));`,
          blanks: [
            { answers: ['charCodeAt'], feedback: 'Which string method turns the character at a position into its number?' },
            { answers: ['%'], feedback: 'To keep a big number inside 0 to capacity - 1, take the remainder after dividing by the capacity.' },
          ],
          bank: ['charCodeAt', 'charAt', '%', '/', 'length'],
          tests: { kind: 'output', expected: ['0', '7'] },
          hints: ['The hash needs a number for the character at position i.', 'charAt gives a letter, not a number.', 'The second blank is the operator that returns the remainder.'],
          explanation: 'charCodeAt(i) supplies the number for each character, and the remainder by capacity maps any hash into a valid slot.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-27-fix-bug-1',
          kind: 'fix-bug',
          title: 'A slot that does not exist',
          prompt: 'The table has 5 slots, but the program makes the array much longer and puts Ben in the wrong place. It should print 5 and then 2. Tap the faulty line, then choose the fix.',
          concept: 'keeping a hash inside the table',
          language: 'javascript',
          code: `function hashPoly(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % 1000003;
  }
  return h;
}
const table = new Array(5).fill(null);
function put(key) {
  const slot = hashPoly(key);
  table[slot] = key;
}
put('Nena');
put('Ben');
put('Joy');
console.log(table.length);
console.log(table.indexOf('Ben'));`,
          bugLine: 10,
          fixes: [
            { line: '  const slot = hashPoly(key) % table.length;', correct: true, why: 'The remainder by the number of slots always gives a valid index from 0 to 4.' },
            { line: '  const slot = hashPoly(key) % (table.length - 1);', correct: false, why: 'This can never use the last slot, and it moves Ben to a different slot than the remainder by the real capacity.' },
            { line: '  const slot = Math.min(hashPoly(key), table.length - 1);', correct: false, why: 'This sends every large hash to the last slot, so keys pile up there instead of spreading out.' },
          ],
          tests: { kind: 'output', expected: ['5', '2'] },
          hints: ['Look at how large hashPoly(\'Ben\') is (it is 66667) and how many slots the table has.', 'The slot must be between 0 and 4. Which operator brings any number into a range?', 'Use the remainder after dividing by the number of slots, table.length.'],
          explanation: 'Without the remainder the hash itself is used as an index, so the array grows to over 66,000 entries. The remainder by table.length keeps every key inside the five slots.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-27-scenario-1',
          kind: 'scenario',
          title: 'Choose a hash for product names',
          prompt: 'Pick the best hash function.',
          concept: 'good hash functions',
          situation: 'A store wants to look up 1,000 product names (like "Instant coffee 25g") in a table with 1,500 slots. Three hash functions are proposed.',
          options: [
            { text: 'Multiply a running total by 31 and add each character code, keeping the total small with %, then take the remainder by 1,500.', consequence: 'Correct. It is deterministic, fast (one pass over the name), and because position matters it spreads similar names well.', quality: 'best' },
            { text: 'Add up all the character codes, then take the remainder by 1,500.', consequence: 'It works, and it is deterministic and fast, but anagrams and similar names collide, and sums of short names fall into a narrow range, so many slots go unused.', quality: 'acceptable' },
            { text: 'Use the length of the name.', consequence: 'Names are only a few dozen characters long at most, so almost every name lands in the same handful of slots out of 1,500.', quality: 'poor' },
          ],
          hints: ['Which function uses every character and also the position?', 'How many different values can the length of a product name take?', 'The sum is acceptable but ignores order; the multiplying version does not.'],
          explanation: 'A good hash uses the whole key and lets position matter, so similar keys are scattered. The length can take only a few values, so it cannot spread 1,000 names.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-27-match-1',
          kind: 'match',
          title: 'What breaks without it?',
          prompt: 'Each quality of a hash function protects against a problem. Match the quality to what goes wrong without it.',
          concept: 'qualities of a hash function',
          labels: { terms: 'If the hash function is not...', meanings: 'Then this goes wrong' },
          pairs: [
            { term: 'deterministic', definition: 'A key stored today gets a different slot tomorrow, so it is never found again' },
            { term: 'well spread', definition: 'Most keys pile into a few slots and those slots become slow to search' },
            { term: 'fast', definition: 'Computing the hash costs more than the scan it was supposed to avoid' },
            { term: 'able to give two keys the same hash', definition: 'Nothing: it is allowed, and the table simply has to tell such keys apart' },
          ],
          hints: ['The last pair is the trick: which quality is not actually required?', 'A key that moves between slots can never be located.', 'Think about the length of the work done before the lookup even starts.'],
          explanation: 'Determinism lets a key be found again, a good spread keeps slots short, and speed keeps the lookup cheap. Different keys sharing a hash cannot be forbidden, so the table has to handle it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-27-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write slotFor',
          story: 'Your team agreed on one exact hash recipe.',
          prompt: 'Write `slotFor(key, capacity)`. Start with `h = 0`. For each character in order, update `h = (h * 31 + code) % 1000003`, where `code` comes from `charCodeAt`. At the end return `h % capacity`. An empty key gives 0.',
          concept: 'writing a string hash',
          language: 'javascript',
          starter: `function slotFor(key, capacity) {
  // hash every character, then return a slot from 0 to capacity - 1
  return 0;
}`,
          solution: `function slotFor(key, capacity) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % 1000003;
  }
  return h % capacity;
}`,
          tests: {
            kind: 'function',
            fn: 'slotFor',
            cases: [
              { label: 'Nena in 10 slots', args: ['Nena', 10], expected: 0 },
              { label: 'Ben in 10 slots', args: ['Ben', 10], expected: 7 },
              { label: 'Lita in 10 slots', args: ['Lita', 10], expected: 8 },
              { label: 'the capacity changes the slot', args: ['Nena', 7], expected: 4 },
              { label: 'an empty key', args: ['', 10], expected: 0 },
              { label: 'a long key needs the remainder inside the loop', args: ['Barangay San Isidro Water District', 100], expected: 99, hidden: true },
            ],
          },
          hints: ['Loop over the positions of the key from 0 to key.length - 1.', 'Inside the loop apply the % 1000003 every time, not only at the end.', 'After the loop, the answer is h % capacity.'],
          explanation: 'Taking % 1000003 at every step keeps h small and exact. If you leave it until the end, a long key makes h larger than JavaScript can hold exactly and the slot comes out wrong.',
        },
      },
      {
        type: 'activity',
        audience: { max: 'beginner' },
        activity: {
          id: 'data-structures-algorithms-27-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Hash words in plain language',
          prompt: 'Tap each card to check yourself.',
          concept: 'hashing vocabulary',
          cards: [
            { front: 'What is a hash?', back: 'The number a hash function produces for a key. The same key always gives the same number.' },
            { front: 'Why take the remainder by the number of slots?', back: 'A hash can be huge, but the array only has slots 0 to capacity - 1. The remainder always lands in that range.' },
            { front: 'What is a collision?', back: 'Two different keys that end up with the same slot.' },
            { front: 'Why is "the length of the name" a poor hash?', back: 'Many names have the same length, so they all go to the same few slots.' },
          ],
          hints: [],
          explanation: 'Hash, remainder and collision are the three words the rest of this module builds on.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-27-q1',
        prompt: 'hashSum(\'abc\') and hashSum(\'bca\') are both 294. What does that show about the sum-of-codes hash?',
        choices: [
          'It is not deterministic, because the same letters gave two different answers',
          'It is too slow to use on keys that are longer than three characters',
          'It ignores the order of the characters, so anagrams always collide',
          'It always produces numbers that are larger than the number of slots',
        ],
        answer: 2,
        explanation: 'Addition does not care about order, so every rearrangement of the same letters has the same total. That is why the better version multiplies as it goes.',
      },
      {
        id: 'data-structures-algorithms-27-q2',
        prompt: 'Why does a table compute hash % capacity instead of using the hash directly as the slot number?',
        choices: [
          'A hash can be huge, but the array only has slots 0 to capacity - 1',
          'The remainder makes every key land in its own slot, which removes collisions',
          'The remainder hides the key so that nobody can read it back later on',
          'JavaScript arrays cannot be indexed by numbers larger than 255 at all',
        ],
        answer: 0,
        explanation: 'Only the remainder is guaranteed to be a valid index. It does not remove collisions (different hashes can share a remainder) and it has nothing to do with secrecy.',
      },
      {
        id: 'data-structures-algorithms-27-q3',
        prompt: 'You hash keys that are always 10 characters long. As the number of stored keys grows from 1,000 to 1,000,000, how does the work to hash one key change?',
        choices: [
          'It grows with the number of keys, because the hash is compared with every stored hash',
          'It grows with the square of the number of keys, because every pair is compared',
          'It shrinks, because a bigger table has more empty slots to choose from',
          'It stays about the same, because it reads each of the 10 characters once',
        ],
        answer: 3,
        explanation: 'The loop runs once per character of the key, so the cost depends on the key length (10), not on how many keys are stored.',
      },
      {
        id: 'data-structures-algorithms-27-q4',
        prompt: 'A teammate suggests hashing 100,000 customer names by name length. What is the main problem?',
        choices: [
          'The result is different every time the program runs, so keys are lost',
          'Few lengths exist, so most names land in the same few slots',
          'It takes longer to compute than searching a list of 100,000 names would',
          'Lengths are too large to be used with the remainder operator at all',
        ],
        answer: 1,
        explanation: 'The hash is deterministic and fast, but names only have a few dozen possible lengths, so the keys are not spread out and those slots would be crowded.',
      },
      {
        id: 'data-structures-algorithms-27-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does a hash function do?',
        choices: [
          'Turns a key such as a name into a number that picks its slot',
          'Sorts the keys into alphabetical order so they can be searched',
          'Hides the key so that nobody else can read it or change it',
          'Counts how many keys have already been stored in the table',
        ],
        answer: 0,
        explanation: 'A hash function turns a key into a number, and that number (after the remainder) is the address of the slot. It does not sort, hide or count anything.',
      },
      {
        id: 'data-structures-algorithms-27-q6',
        audience: { min: 'advanced' },
        prompt: 'Some systems seed their hash function with a random value chosen at startup. Why?',
        choices: [
          'So the hash of a key is different on every call, which spreads keys better',
          'So the table can store two different values under the same key',
          'So an attacker cannot predict which keys collide and flood one slot',
          'So the hash can be reversed to recover the original key when needed',
        ],
        answer: 2,
        explanation: 'If the hash is fixed and public, an attacker can craft many keys that land in one slot and turn lookups into slow scans (hash flooding). A secret seed per process makes those collisions unpredictable. The hash is still the same for the whole run, so lookups work.',
      },
    ],
    task: {
      title: 'Test your own hash',
      steps: [
        'Open Talino\'s code runner or any free JavaScript playground and paste hashPoly and slotFor from this lesson.',
        'Create 30 product names such as \'Item-01\' to \'Item-30\' with a loop. Count how many land in each of 10 slots and print the counts.',
        'Replace hashPoly with the length of the name and run the same count. Write down the biggest number in any one slot for each hash.',
        'Pick two names that you predict collide (try an anagram) with the sum-of-codes hash, and confirm by running it.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before you run the counts, guess on paper which hash will crowd the most keys into one slot and why. Then check your guess against the numbers.', 'Ask an AI assistant to explain hashPoly line by line, then compare its explanation with the trace table in this lesson.'] },
      { audience: { min: 'advanced' }, steps: ['Measure the spread with a single number, for example the largest bucket divided by the average bucket size, and report it for three hash functions on 10,000 keys such as \'user-0001\' to \'user-10000\'.', 'Change the multiplier 31 to 2 and then to 1 and describe what happens to the spread and why.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-28',
    day: 28,
    title: 'Hash Tables: Key-Value Storage and Collisions',
    summary: 'Store values by key in an array of slots, see what happens when two keys want the same slot, and learn why the load factor matters.',
    intro: {
      objectives: [
        'Describe a hash table as an array of slots plus a hash function, with set, get, has and delete operations',
        'Explain what a collision is and show one happening',
        'Calculate a load factor and say why a table grows and rehashes',
        'Explain why each stored entry keeps its key as well as its value',
      ],
      why: 'A Map or an object in generated code is a hash table underneath. Knowing how collisions and the load factor work tells you why lookups are usually instant, when they are not, and why a hand-written table that ignores collisions silently loses data.',
    },
    minutes: 30,
    skills: ['hashing', 'complexity'],
    body: [
      { type: 'paragraph', text: "A hash function gives you a slot number for any key. A **hash table** puts that to work: it is an array of slots plus a hash function, and it stores a **value** under a **key** (an id, a name, a product code). You ask for the value by key and the table computes the slot and looks there. This lesson builds the simplest possible table, shows that it loses data, and explains the two ideas that fix the problem: handling collisions (next lesson) and keeping the table from getting too full." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Go back to the mailroom with pigeonholes. Each pigeonhole holds a slip with a name and the person's room number. To find Nena's room, you compute her pigeonhole, take out the slip and read it. Now suppose the clerk files a new slip for Rico and his pigeonhole is the same as Joy's. If the clerk simply drops the new slip on top and throws the old one away, Joy's room number is lost for good." },
      { type: 'paragraph', text: "That is the danger. The picture stops working in one way: a clerk would notice the clash. A program does not notice anything unless you write code that checks." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "The abstract data type is often called a **dictionary** or a **map**: it stores key-value pairs and offers four operations. `set(key, value)` stores a pair (replacing the value if the key exists). `get(key)` returns the value, or `undefined` when the key is missing. `has(key)` says whether the key is stored. `delete(key)` removes it. The hash table is the usual way to build it, and its promise is that these operations take about the same time whether it holds ten keys or ten million." },
      { type: 'paragraph', text: "Each slot holds an **entry**, a small object `{ key, value }`, not just the value. The reason comes from collisions. A **collision** happens when two different keys map to the same slot. With a fixed number of slots it must happen sometimes: the pigeonhole principle says that if you put more than `capacity` keys into `capacity` slots, two share one. And it happens sooner than people expect. For 23 people and 365 birthdays, the chance that two share a birthday is already about one half. For a table with 10 slots and an ideal hash, 5 keys give about a 70% chance of at least one collision. So `get` must compare the key stored in the slot with the key it was asked about: if they differ, the entry belongs to someone else and the answer is \"not found\"." },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Six keys in a table with 5 slots. Joy and Rico both hash to slot 1, and Ben and Ana both hash to slot 2: two collisions.',
        source: 'flowchart LR\n  N[Nena] --> S0[slot 0]\n  J[Joy] --> S1[slot 1]\n  R[Rico] --> S1\n  B[Ben] --> S2[slot 2]\n  A[Ana] --> S2\n  L[Lita] --> S3[slot 3]',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a hash table is a row of boxes. To store something, you work out which box the key belongs to and put a small label-and-value pair in it. To fetch it, you work out the same box and read the pair. Sometimes two keys belong to the same box. A careless table would keep only the last one. A careful table needs a plan for sharing a box, and it also checks the label on the pair so it never hands you someone else's value by mistake." },
      { type: 'paragraph', text: "The second idea is the **load factor**: the number of stored entries divided by the number of slots, `count / capacity`. A load factor of 0.5 means half as many entries as slots; 1.2 means more entries than slots. The fuller the table, the likelier a collision and the longer the lookups. So real tables keep the load factor below a limit (a common choice is around 0.75, but it is a design choice, not a law). When the limit is passed, the table builds a bigger array, usually twice the size, and **rehashes**: it puts every entry in again. Every key must be slotted again because the slot is `hash % capacity`, and a different capacity gives a different remainder." },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "Here is the simplest table: one entry per slot and no plan for collisions. It uses the `hashPoly` from the last lesson. `slotOf` is a small helper that both `set` and `get` use, so they always agree on the slot." },
      {
        type: 'code',
        language: 'javascript',
        label: 'A naive hash table that ignores collisions',
        code: `function hashPoly(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % 1000003;
  }
  return h;
}

class NaiveTable {
  constructor(capacity) {
    this.capacity = capacity;
    this.slots = new Array(capacity).fill(undefined);
  }
  slotOf(key) {
    return hashPoly(key) % this.capacity;
  }
  set(key, value) {
    this.slots[this.slotOf(key)] = { key, value };
  }
  get(key) {
    const entry = this.slots[this.slotOf(key)];
    if (entry !== undefined && entry.key === key) {
      return entry.value;
    }
    return undefined;
  }
}

const cities = new NaiveTable(5);
cities.set('Nena', 'Naga');
cities.set('Ben', 'Legazpi');
cities.set('Joy', 'Pili');
cities.set('Rico', 'Iriga');
cities.set('Lita', 'Naga');
cities.set('Ana', 'Pili');
for (const name of ['Nena', 'Ben', 'Joy', 'Rico', 'Lita', 'Ana', 'Zed']) {
  console.log(name, '->', cities.get(name));
}`,
      },
      { type: 'paragraph', text: "Next, how the slots change when the table grows, and the load factor each time. We use the same hash for the same six names." },
      {
        type: 'code',
        language: 'javascript',
        label: 'The same keys in 5 slots and in 10 slots',
        code: `const names = ['Nena', 'Ben', 'Joy', 'Rico', 'Lita', 'Ana'];
function slotsFor(keys, capacity) {
  return keys.map((key) => key + ':' + (hashPoly(key) % capacity)).join(' ');
}
console.log('load', names.length / 5, slotsFor(names, 5));
console.log('load', names.length / 10, slotsFor(names, 10));`,
      },
      { type: 'paragraph', text: "Finally, a small simulation of how likely collisions are. It stands in for an ideal hash by choosing slots from a repeatable pseudo-random sequence (a tiny generator that always gives the same numbers). It asks, 500 times, whether 5 keys placed in 10 slots ever share one." },
      {
        type: 'code',
        language: 'javascript',
        label: 'How often do 5 keys collide in 10 slots?',
        code: `let seed = 42;
function randomSlot(capacity) {
  seed = (seed * 16807) % 2147483647;
  return seed % capacity;
}
function anyCollision(keys, capacity) {
  const taken = new Array(capacity).fill(false);
  for (let i = 0; i < keys; i++) {
    const slot = randomSlot(capacity);
    if (taken[slot]) {
      return true;
    }
    taken[slot] = true;
  }
  return false;
}
function chanceOfCollision(keys, capacity, trials) {
  let hits = 0;
  for (let t = 0; t < trials; t++) {
    if (anyCollision(keys, capacity)) {
      hits++;
    }
  }
  return hits / trials;
}
console.log(chanceOfCollision(5, 10, 500));`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**NaiveTable.** With 5 slots the six names go to slots 0, 2, 1, 1, 3 and 2. Rico lands in the same slot as Joy and overwrites her entry, and Ana overwrites Ben. So `get` prints `Nena -> Naga`, `Ben -> undefined`, `Joy -> undefined`, `Rico -> Iriga`, `Lita -> Naga`, `Ana -> Pili`, and `Zed -> undefined` (his slot is empty). Two customers have silently disappeared.',
          '**The key check.** In `get`, `entry.key === key` stops the table from returning Rico\'s city when you ask for Joy: it answers `undefined` instead of a wrong value. A missing answer is a problem; a wrong answer is worse.',
          '**Load factor and rehash.** In 5 slots the load factor is 6 / 5 = 1.2 and the slots are `Nena:0 Ben:2 Joy:1 Rico:1 Lita:3 Ana:2`, with two collisions. In 10 slots it is 0.6 and the slots are `Nena:0 Ben:7 Joy:6 Rico:1 Lita:8 Ana:2`, with none. Several keys moved (Ben from 2 to 7), which is why a rehash must re-slot every entry.',
          '**Simulation.** The call prints 0.706: in about 70% of the trials, 5 keys in 10 slots shared a slot, matching the calculation 1 - (10 * 9 * 8 * 7 * 6) / 10^5 = 0.6976. A table does not have to be nearly full for collisions to appear.',
        ],
      },
      {
        type: 'table',
        headers: ['Step', 'Slot of the key (5 slots)', 'What the table holds (slot 0 to 4)'],
        rows: [
          ['set Nena', '0', 'Nena, _, _, _, _'],
          ['set Ben', '2', 'Nena, _, Ben, _, _'],
          ['set Joy', '1', 'Nena, Joy, Ben, _, _'],
          ['set Rico', '1 (collision)', 'Nena, Rico, Ben, _, _   (Joy lost)'],
          ['set Lita', '3', 'Nena, Rico, Ben, Lita, _'],
          ['set Ana', '2 (collision)', 'Nena, Rico, Ana, Lita, _   (Ben lost)'],
        ],
        caption: 'A trace of the naive table. Each collision overwrites an entry.',
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "Real tables decide the resize policy explicitly. Growing by a constant factor (for example doubling) when the load factor passes a threshold makes the cost of insertion amortized O(1): a resize costs O(n), but after it the table has room for about as many further inserts as it already holds, so the cost averages out the way it does for a dynamic array. Shrinking is the mirror image and needs a gap between the grow and shrink thresholds to avoid thrashing. Also remember that the hash is computed from the key, so keys must be immutable while stored, and that a rehash briefly doubles memory, which can matter in a latency-sensitive service." },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Ask an assistant to explain and quiz you, but write your own prediction first." },
      { type: 'prompt', label: 'Predict the lost entries', text: "I am learning hash tables. I will give you a hash function that returns the first letter's character code, a table with 4 slots, and five keys. Before I run anything, ask me to work out the slot of each key and tell you which entries a table without collision handling would lose. Do not give me the answer; wait for my reply, then check it step by step." },
      { type: 'prompt', label: 'Review a hand-made table', text: "Here is a hash table class I wrote in JavaScript (paste your NaiveTable or your own). Do not rewrite it. List the problems you can find, such as collisions, a missing key check, an unbounded load factor, and a missing delete, as questions for me to think about, one at a time. Do not paste any private data." },
      { type: 'paragraph', text: "What to look for: the assistant should notice the lost entries and the key check without being told. It can mislead you by calling a hash table \"O(1)\" with no condition. That is the average case with a good hash and a bounded load factor, and the next lesson shows where it breaks down." },
      {
        type: 'takeaways',
        items: [
          'A hash table is an array of slots plus a hash function; it stores entries of key and value and offers set, get, has and delete.',
          'Collisions (two keys, one slot) are unavoidable, and they appear sooner than expected: 5 keys in 10 slots collide about 70% of the time with an ideal hash.',
          'A table that ignores collisions silently overwrites data, and a get that does not compare keys returns wrong values.',
          'The load factor is count divided by capacity; when it passes a limit the table grows and rehashes every entry, because the slot depends on the capacity.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-28-predict-output-1',
          kind: 'predict-output',
          title: 'Which entries survive?',
          prompt: 'This table has 2 slots and hashes by the first character code (a is 97, b is 98, c is 99, d is 100). Predict what it prints.',
          concept: 'collisions overwrite entries',
          language: 'javascript',
          code: `const slots = new Array(2).fill(undefined);
function slotOf(key) {
  return key.charCodeAt(0) % 2;
}
function set(key, value) {
  slots[slotOf(key)] = { key, value };
}
function get(key) {
  const entry = slots[slotOf(key)];
  if (entry !== undefined && entry.key === key) {
    return entry.value;
  }
  return 'not found';
}
set('a', 1);
set('b', 2);
set('c', 3);
console.log(get('a'));
console.log(get('b'));
console.log(get('c'));
console.log(get('d'));`,
          choices: ['not found\n2\n3\nnot found', '1\n2\n3\nnot found', 'not found\n2\n3\n2', '1\n2\n3\n3'],
          wrongNotes: {
            '1\n2\n3\nnot found': 'a (97) and c (99) are both odd, so both go to slot 1, and c overwrites a.',
            'not found\n2\n3\n2': 'd would map to slot 0, where the entry is for b. The key check fails, so it must answer not found, not return b\'s value.',
            '1\n2\n3\n3': 'a and c share slot 1 and the later set replaces the earlier one. Also get checks the key, so it never hands back another key\'s value.',
          },
          hints: ['Work out each slot: 97 % 2, 98 % 2, 99 % 2, 100 % 2.', 'a and c go to the same slot. Which one is stored after the three sets?', 'get(\'d\') looks in slot 0, which holds b. Does the stored key match d?'],
          explanation: 'a goes to slot 1, b to slot 0, and c to slot 1, replacing a. So get(\'a\') finds c\'s entry whose key is not a: not found. b and c are found. d maps to slot 0, which holds b, so the key check fails and the answer is not found.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-28-fill-blank-1',
          kind: 'fill-blank',
          title: 'Check the key',
          prompt: 'Complete get so that it only returns a value when the entry in the slot belongs to the requested key. The program should print Naga, then undefined.',
          concept: 'comparing keys in get',
          language: 'javascript',
          code: `const slots = new Array(4).fill(undefined);
function slotOf(key) {
  return key.length % 4;
}
function set(key, value) {
  slots[slotOf(key)] = { key, value };
}
function get(key) {
  const entry = slots[slotOf(key)];
  if (entry !== undefined && entry.___ === ___) {
    return entry.value;
  }
  return undefined;
}
set('Nena', 'Naga');
console.log(get('Nena'));
console.log(get('Joey'));`,
          blanks: [
            { answers: ['key'], feedback: 'Each entry stores its own key next to its value. Which field holds it?' },
            { answers: ['key'], feedback: 'Compare the stored key with the key that get was asked for, which is its parameter.' },
          ],
          bank: ['key', 'key', 'value', 'slot'],
          tests: { kind: 'output', expected: ['Naga', 'undefined'] },
          hints: ['Joey and Nena both have 4 letters, so both look in the same slot.', 'The slot holds an entry with a key field and a value field.', 'You must compare the entry\'s key with the key passed to get.'],
          explanation: 'Joey shares Nena\'s slot, so without the comparison get would return Naga. Comparing entry.key with the requested key makes it answer undefined for Joey.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-28-fix-bug-1',
          kind: 'fix-bug',
          title: 'The wrong customer\'s city',
          prompt: 'The table returns a city for a customer who was never stored. It should print Naga, then undefined. Tap the faulty line, then choose the fix.',
          concept: 'wrong values after a collision',
          language: 'javascript',
          code: `const slots = new Array(4).fill(undefined);
function slotOf(key) {
  return key.length % 4;
}
function set(key, value) {
  slots[slotOf(key)] = { key, value };
}
function get(key) {
  const entry = slots[slotOf(key)];
  if (entry !== undefined) {
    return entry.value;
  }
  return undefined;
}
set('Nena', 'Naga');
console.log(get('Nena'));
console.log(get('Joey'));`,
          bugLine: 10,
          fixes: [
            { line: '  if (entry !== undefined && entry.key === key) {', correct: true, why: 'A slot can hold another key\'s entry. Comparing the stored key with the requested key makes get answer only for the right key.' },
            { line: '  if (entry !== undefined && entry.value === key) {', correct: false, why: 'This compares the stored value (a city) with the key (a name), so even Nena is not found.' },
            { line: '  if (entry !== undefined || entry.key === key) {', correct: false, why: 'With || the first part alone is enough when the entry exists, which is the original bug, and when the slot is empty it tries to read entry.key from undefined and fails.' },
          ],
          tests: { kind: 'output', expected: ['Naga', 'undefined'] },
          hints: ['Joey and Nena both have four letters. What does get do for Joey?', 'The entry found in the slot might belong to a different key.', 'Check that the entry\'s key equals the key you were asked for.'],
          explanation: 'Because Joey hashes to the slot where Nena is stored, get must verify that the entry\'s key is the one requested. Without that check a collision turns into a wrong answer.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-28-scenario-1',
          kind: 'scenario',
          title: 'The table that slowed down',
          prompt: 'Choose the best response.',
          concept: 'load factor and rehashing',
          situation: 'A table has 100 slots and holds 90 entries (it handles collisions, so nothing is lost). Over the weeks lookups have been getting slower, and 30 more entries are coming.',
          options: [
            { text: 'Build a table with about 200 slots, rehash all entries into it, and keep a rule to grow again when the load factor passes a limit.', consequence: 'Correct. The load factor drops from 0.9 to 0.45, collisions fall, and lookups speed up. Rehashing is needed because every slot depends on the new capacity.', quality: 'best' },
            { text: 'Keep the 100 slots and make the hash function faster.', consequence: 'Hashing a key was never the slow part. The slowness comes from crowded slots, which a faster hash does not change.', quality: 'poor' },
            { text: 'Just copy each entry into a 200-slot array at the same index it had before.', consequence: 'Entries would sit in slots that no longer match hash % 200, so get would look in the wrong place and miss them.', quality: 'poor' },
          ],
          hints: ['What is the load factor now, and what happens to lookups when it is close to 1?', 'The slot of a key is hash % capacity. What changes if the capacity changes?', 'You need a bigger array and every key must be slotted again.'],
          explanation: 'A load factor of 0.9 means slots are crowded. A bigger table brings it down, and a rehash is mandatory because the slot of each key depends on the capacity.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-28-match-1',
          kind: 'match',
          title: 'Name what you see',
          prompt: 'Match each situation to the term for it.',
          concept: 'hash table vocabulary',
          labels: { terms: 'Situation', meanings: 'Term' },
          pairs: [
            { term: 'Joy and Rico both belong in slot 1', definition: 'Collision' },
            { term: '90 entries are stored in 100 slots', definition: 'Load factor of 0.9' },
            { term: 'The table doubles and every key is slotted again', definition: 'Rehash' },
            { term: 'A slot stores { key: \'Nena\', value: \'Naga\' } rather than just \'Naga\'', definition: 'Entry' },
          ],
          hints: ['Which one is about count divided by capacity?', 'Which one describes putting everything in again?', 'Which one is the pair stored in a slot?'],
          explanation: 'Two keys in one slot is a collision, entries over slots is the load factor, putting every key in again after growing is a rehash, and the stored key-and-value pair is an entry.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-28-code-challenge-1',
          kind: 'code-challenge',
          title: 'Count the collisions',
          story: 'You want to know whether a table size is big enough for your keys.',
          prompt: 'Write `countCollisions(keys, capacity)`. Place the keys one by one into `capacity` slots with `hashPoly(key) % capacity` (hashPoly is given). Count every key whose slot is already taken by an earlier key and return that count. Use an array of booleans as the slots.',
          concept: 'measuring collisions',
          language: 'javascript',
          starter: `function hashPoly(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % 1000003;
  }
  return h;
}

function countCollisions(keys, capacity) {
  // mark each slot as taken when a key lands in it
  return 0;
}`,
          solution: `function hashPoly(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % 1000003;
  }
  return h;
}

function countCollisions(keys, capacity) {
  const taken = new Array(capacity).fill(false);
  let collisions = 0;
  for (const key of keys) {
    const slot = hashPoly(key) % capacity;
    if (taken[slot]) {
      collisions++;
    } else {
      taken[slot] = true;
    }
  }
  return collisions;
}`,
          tests: {
            kind: 'function',
            fn: 'countCollisions',
            cases: [
              { label: 'six names in 5 slots', args: [['Nena', 'Ben', 'Joy', 'Rico', 'Lita', 'Ana'], 5], expected: 2 },
              { label: 'six names in 10 slots', args: [['Nena', 'Ben', 'Joy', 'Rico', 'Lita', 'Ana'], 10], expected: 0 },
              { label: 'no keys', args: [[], 8], expected: 0 },
              { label: 'the same slot every time', args: [['Nena', 'Nena', 'Nena'], 10], expected: 2 },
              { label: 'twenty names in 10 slots', args: [['Nena', 'Ben', 'Joy', 'Rico', 'Lita', 'Ana', 'Ramon', 'Cora', 'Dante', 'Elena', 'Fe', 'Gil', 'Hilda', 'Isko', 'Jun', 'Kiko', 'Lorna', 'Mario', 'Nora', 'Oscar'], 10], expected: 10, hidden: true },
            ],
          },
          hints: ['Make an array of capacity booleans, all false, to record which slots are taken.', 'For each key compute its slot. If taken[slot] is already true, count a collision.', 'Otherwise mark that slot as taken.'],
          explanation: 'Each key either finds its slot free (mark it) or taken (a collision). Counting the taken cases gives the number of keys that would overwrite or share a slot.',
        },
      },
      {
        type: 'activity',
        audience: { max: 'beginner' },
        activity: {
          id: 'data-structures-algorithms-28-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Why each step is there',
          prompt: 'Tap each card for the reason.',
          concept: 'hash table basics',
          cards: [
            { front: 'Why does a slot keep the key as well as the value?', back: 'Another key can share the slot. The stored key lets get check that the entry really belongs to the key you asked for.' },
            { front: 'What is the load factor?', back: 'The number of entries divided by the number of slots. The closer to 1 (or above), the more crowded the table.' },
            { front: 'Why grow the table?', back: 'A bigger table has more slots per key, so there are fewer collisions and lookups stay quick.' },
            { front: 'Why must every key be slotted again after growing?', back: 'The slot comes from hash % capacity, and a new capacity gives different remainders.' },
          ],
          hints: [],
          explanation: 'Entries, load factor and rehashing all come from the same fact: slots are limited, and keys compete for them.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-28-q1',
        prompt: 'A table has 8 slots and holds 6 entries. What is its load factor?',
        choices: ['6', '8', '1.33', '0.75'],
        answer: 3,
        explanation: 'Load factor is entries divided by slots: 6 / 8 = 0.75. The other numbers divide the wrong way round or are just the counts.',
      },
      {
        id: 'data-structures-algorithms-28-q2',
        prompt: 'Why does every slot of a hash table store the key together with the value?',
        choices: [
          'So a lookup can check the entry belongs to the key it was asked for',
          'So the table can sort all of its entries by key whenever it needs to',
          'So the value can be recomputed from the key if it is ever lost on disk',
          'So two different keys can never end up with the same hash value',
        ],
        answer: 0,
        explanation: 'A slot may hold an entry for a different key that collided with yours. Comparing the stored key prevents returning the wrong value. The stored key does not sort anything and cannot stop collisions.',
      },
      {
        id: 'data-structures-algorithms-28-q3',
        prompt: 'A table doubles its capacity. Why must it hash every existing key again instead of copying entries to the same slot numbers?',
        choices: [
          'Because the hash of a key changes whenever the array is copied into a bigger one',
          'Because JavaScript cannot copy an array of objects safely without rebuilding it',
          'Because the slot is hash % capacity, so a new capacity usually gives a new slot',
          'Because the old keys must be sorted before they can be moved',
        ],
        answer: 2,
        explanation: 'The hash of a key stays the same, but the remainder by the new capacity differs, so get would look in a different slot than where the entry was copied.',
      },
      {
        id: 'data-structures-algorithms-28-q4',
        prompt: 'You place 5 keys at random into 10 slots (an ideal hash). About how likely is it that at least two share a slot?',
        choices: ['Under 1 in 100', 'About 7 in 10', 'About 1 in 2', 'Exactly 5 in 10, one for each key'],
        answer: 1,
        explanation: 'The chance that all 5 land in different slots is 10 * 9 * 8 * 7 * 6 / 10^5, about 0.30, so a collision has about a 70% chance. The simulation printed 0.706.',
      },
      {
        id: 'data-structures-algorithms-28-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a collision in a hash table?',
        choices: [
          'A key that cannot be found in the table',
          'A table that has no empty slots left',
          'Two different keys that belong in the same slot',
          'A hash that changes every time the program runs',
        ],
        answer: 2,
        explanation: 'A collision is two different keys sent to the same slot. It is not a missing key or a full table, though a full table makes collisions certain.',
      },
      {
        id: 'data-structures-algorithms-28-q6',
        audience: { min: 'advanced' },
        prompt: 'A hash table doubles its capacity whenever the load factor passes 0.75, rehashing all entries. Why can insertion still be called amortized O(1)?',
        choices: [
          'Because a rehash is always O(1) when the hash function is fast, whatever the size of the table',
          'Because the table only grows when it has no entries yet',
          'Because rehashing copies only the entries that collided, not the others',
          'Because an O(n) rehash happens rarely and many cheap inserts after it share its cost',
        ],
        answer: 3,
        explanation: 'After a doubling the table has room for about as many inserts as it already holds, so the O(n) rehash is spread over those inserts, exactly like the doubling of a dynamic array.',
      },
    ],
    task: {
      title: 'Break and fix a table',
      steps: [
        'Paste NaiveTable and hashPoly from this lesson into a free JavaScript playground. Store the six names and print each get, to see the two lost entries.',
        'Change the capacity from 5 to 10 and run it again. Which entries now survive, and why?',
        'Add a `size()` method that counts how many entries are stored (not slots) and a `loadFactor()` method that divides it by the capacity. Print both after the six sets for capacity 5 and 10.',
        'Write down in one sentence why a larger capacity cannot guarantee that no collision happens.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['On paper draw 5 boxes numbered 0 to 4. Using the slots in the lesson (Nena 0, Ben 2, Joy 1, Rico 1, Lita 3, Ana 2), write each name in its box in order and cross out whichever name gets replaced.', 'Ask an AI assistant to explain what a collision is using a classroom locker example, then compare it with your boxes.'] },
      { audience: { min: 'advanced' }, steps: ['Run countCollisions on 1,000 generated keys for capacities 1,000, 2,000 and 4,000 and report how the count falls. Compare with the expected number n^2 / (2 * capacity) for small load factors.', 'Explain what would happen to your measurements if the hash returned only the key length, and show it with a run.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-29',
    day: 29,
    title: 'Separate Chaining, Open Addressing and Hash Table Complexity',
    summary: 'Write the two classic ways to survive collisions from scratch, and see when hash table operations are O(1) and when they are O(n).',
    intro: {
      objectives: [
        'Write a hash table that uses separate chaining, with get, set, delete and a resize',
        'Write a hash table that uses open addressing with linear probing, including deletion with a marker',
        'Explain average O(1) and worst case O(n), and what makes each happen',
        'Compare chaining and open addressing and say when each fits',
      ],
      why: 'Hash tables are "O(1)" only under conditions. If you know the two collision strategies and what breaks them, you can judge claims about lookups in generated code and spot the key choice or the table size that makes them slow.',
    },
    minutes: 30,
    skills: ['hashing', 'complexity'],
    body: [
      { type: 'paragraph', text: "Last lesson's table lost data because each slot held only one entry. There are two classic fixes. **Separate chaining** lets a slot hold several entries. **Open addressing** keeps one entry per slot but moves a colliding key to another slot. In this lesson you write both, and then count operations to see where the promise of O(1) comes from and where it breaks." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "Take the mailroom again. With chaining, each pigeonhole is a small tray: when Joy and Rico share hole 1, both slips go in the tray, and to find Rico's you flip through the tray, comparing names. With open addressing the holes only hold one slip: when Rico finds hole 1 taken, he walks to the next free hole, and later whoever looks for Rico starts at hole 1 and walks forward until the slip is found or an empty hole proves it is not there." },
      { type: 'paragraph', text: "The picture stops working in one place: removing a slip. If a clerk takes Joy's slip out of hole 1 and leaves it empty, a later search for Rico stops at the empty hole and wrongly concludes Rico is absent. Open addressing needs a way around that." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "**Separate chaining.** Every slot holds a list (here an array) of entries. `set` looks through that list: if the key is there, update its value; otherwise add a new entry. `get` and `delete` look through the same list. Chains can be longer than one without any problem, so the load factor may even go above 1. Resizing keeps the lists short." },
      { type: 'paragraph', text: "**Open addressing with linear probing.** Every slot holds at most one entry. To find a key, start at its slot and step forward one slot at a time (wrapping around with `%`) until you find the key or meet an empty slot, which proves the key is absent. To insert, take the first free slot on that walk. The table must never fill up completely, so the load factor stays below 1. Deletion is the delicate part: emptying a slot would break the walks that pass through it, so a deleted slot is marked with a special **tombstone** (here `REMOVED`). A lookup walks past a tombstone, and an insert may reuse it." },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: both designs answer \"what do we do when two keys want the same box?\". Chaining says \"put both in the box, as a little list\". Open addressing says \"the box holds one thing, so the newcomer takes the next empty box along, and anyone looking for it checks box after box until they find it or reach an empty box\". When something is removed under open addressing, we leave a marker so people searching do not stop too early." },
      { type: 'visual', id: 'hash-table-collisions', caption: 'Switch between chaining and open addressing and insert keys that collide. Compare where the second key ends up and how many steps a lookup takes.' },
      { type: 'paragraph', text: "**Complexity.** Count the steps of `get`: compute the hash (the length of the key, treated as constant for short keys), go to the slot, then compare keys along the chain or the probe run. If the hash spreads keys well and the load factor is kept bounded, the run is short, a constant on average, so `get`, `set` and `delete` are **O(1) on average**. In the worst case every key lands in the same slot, one chain or one run holds all n entries, and each operation is **O(n)**. A resize costs O(n) but happens rarely, so insertion is **amortized O(1)**, like a dynamic array." },
      {
        type: 'table',
        headers: ['', 'Separate chaining', 'Open addressing (linear probing)'],
        rows: [
          ['A collision goes to', 'A list at the same slot', 'The next free slot along the table'],
          ['Load factor', 'May be above 1; lists just get longer', 'Must stay below 1; probe runs grow fast near full'],
          ['Delete', 'Remove from the list', 'Mark the slot with a tombstone'],
          ['Memory', 'Extra lists and objects', 'One array, entries side by side'],
          ['Weak point', 'Long chains when keys pile up', 'Clusters: runs of full slots that keep growing'],
        ],
        caption: 'The two strategies side by side.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "First chaining. The class takes the hash function as a parameter (so we can try a bad one later), counts key comparisons in `comparisons`, and doubles its size when the load factor passes `maxLoad`. The `for (const entry of bucket)` loops read each entry of one chain." },
      {
        type: 'code',
        language: 'javascript',
        label: 'A hash table with separate chaining',
        code: `function hashPoly(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % 1000003;
  }
  return h;
}

class ChainedTable {
  constructor(capacity, hashFn = hashPoly, maxLoad = 0.75) {
    this.hashFn = hashFn;
    this.maxLoad = maxLoad;
    this.count = 0;
    this.comparisons = 0;
    this.makeBuckets(capacity);
  }
  makeBuckets(capacity) {
    this.capacity = capacity;
    this.buckets = [];
    for (let i = 0; i < capacity; i++) {
      this.buckets.push([]);
    }
  }
  bucketOf(key) {
    return this.buckets[this.hashFn(key) % this.capacity];
  }
  set(key, value) {
    const bucket = this.bucketOf(key);
    for (const entry of bucket) {
      this.comparisons++;
      if (entry.key === key) {
        entry.value = value;
        return;
      }
    }
    bucket.push({ key, value });
    this.count++;
    if (this.count / this.capacity > this.maxLoad) {
      this.resize(this.capacity * 2);
    }
  }
  get(key) {
    for (const entry of this.bucketOf(key)) {
      this.comparisons++;
      if (entry.key === key) {
        return entry.value;
      }
    }
    return undefined;
  }
  delete(key) {
    const bucket = this.bucketOf(key);
    for (let i = 0; i < bucket.length; i++) {
      this.comparisons++;
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        this.count--;
        return true;
      }
    }
    return false;
  }
  resize(newCapacity) {
    const old = this.buckets;
    this.makeBuckets(newCapacity);
    for (const bucket of old) {
      for (const entry of bucket) {
        this.bucketOf(entry.key).push(entry);
      }
    }
  }
}

const noGrow = new ChainedTable(5, hashPoly, 100);
const cities = [['Nena', 'Naga'], ['Ben', 'Legazpi'], ['Joy', 'Pili'], ['Rico', 'Iriga'], ['Lita', 'Naga'], ['Ana', 'Pili']];
for (const [name, city] of cities) {
  noGrow.set(name, city);
}
console.log(noGrow.buckets.map((bucket) => bucket.map((entry) => entry.key).join('+')).join(' | '));
console.log(noGrow.get('Joy'), noGrow.get('Rico'), noGrow.get('Ben'), noGrow.get('Ana'), noGrow.get('Zed'));
console.log(noGrow.delete('Joy'), noGrow.get('Rico'), noGrow.count);

const growing = new ChainedTable(5);
for (const [name, city] of cities) {
  growing.set(name, city);
}
console.log(growing.capacity, growing.count, growing.get('Ben'));`,
      },
      { type: 'paragraph', text: "Now open addressing. `find` is the shared walk: it returns the slot holding the key, or -1. The loops run at most `capacity` steps so a full table can never loop for ever." },
      {
        type: 'code',
        language: 'javascript',
        label: 'A hash table with linear probing and tombstones',
        code: `const REMOVED = { removed: true };

class ProbingTable {
  constructor(capacity) {
    this.capacity = capacity;
    this.slots = new Array(capacity).fill(undefined);
  }
  find(key) {
    let slot = hashPoly(key) % this.capacity;
    for (let step = 0; step < this.capacity; step++) {
      const entry = this.slots[slot];
      if (entry === undefined) {
        return -1;
      }
      if (entry !== REMOVED && entry.key === key) {
        return slot;
      }
      slot = (slot + 1) % this.capacity;
    }
    return -1;
  }
  set(key, value) {
    const found = this.find(key);
    if (found !== -1) {
      this.slots[found].value = value;
      return true;
    }
    let slot = hashPoly(key) % this.capacity;
    for (let step = 0; step < this.capacity; step++) {
      const entry = this.slots[slot];
      if (entry === undefined || entry === REMOVED) {
        this.slots[slot] = { key, value };
        return true;
      }
      slot = (slot + 1) % this.capacity;
    }
    return false;
  }
  get(key) {
    const found = this.find(key);
    return found === -1 ? undefined : this.slots[found].value;
  }
  delete(key) {
    const found = this.find(key);
    if (found === -1) {
      return false;
    }
    this.slots[found] = REMOVED;
    return true;
  }
}

function show(table) {
  return table.slots.map((entry) => (entry === undefined ? '_' : entry === REMOVED ? 'x' : entry.key)).join(' ');
}
const t = new ProbingTable(5);
const people = [['Nena', 'Naga'], ['Ben', 'Legazpi'], ['Joy', 'Pili'], ['Rico', 'Iriga'], ['Lita', 'Naga']];
for (const [name, city] of people) {
  console.log('set', name, t.set(name, city));
}
console.log(show(t));
console.log(t.set('Ana', 'Pili'));
console.log(t.delete('Joy'), show(t));
console.log(t.get('Rico'), t.get('Joy'));
console.log(t.set('Ana', 'Pili'), show(t));`,
      },
      { type: 'paragraph', text: "Finally, the worst case. The same chained table is given a hash that sends every key to slot 0 (`() => 0`), and we count key comparisons while setting and then getting n keys." },
      {
        type: 'code',
        language: 'javascript',
        label: 'Good hash versus a hash that sends everything to one slot',
        code: `function work(n, hashFn) {
  const table = new ChainedTable(100, hashFn);
  for (let i = 1; i <= n; i++) {
    table.set('Item-' + i, i);
  }
  for (let i = 1; i <= n; i++) {
    table.get('Item-' + i);
  }
  return table.comparisons;
}
for (const n of [10, 20, 40]) {
  console.log(n, 'keys: good hash', work(n, hashPoly), 'comparisons, one-slot hash', work(n, () => 0));
}`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Chaining, no growth.** The five slots print as `Nena | Joy+Rico | Ben+Ana | Lita | ` (slot 4 is empty). Every name can now be found: `Pili Iriga Legazpi Pili undefined`. Deleting Joy returns `true` and Rico is still found (`Iriga`) with 5 entries left.',
          '**Chaining, growing.** With the default `maxLoad` of 0.75 the fourth insert makes the load 4 / 5 = 0.8, so the table doubles to 10 and re-slots every entry. After six sets it prints `10 6 Legazpi`.',
          '**Probing.** All five sets succeed and the slots read `Nena Joy Ben Rico Lita`: Rico (slot 1) found Joy there and Ben at slot 2, so he settled in slot 3, and Lita (slot 3) went on to slot 4. A sixth key cannot fit, so `set` prints `false`. After deleting Joy the table shows `Nena x Ben Rico Lita`. A lookup for Rico starts at slot 1, walks past the tombstone and finds him at slot 3, while Joy is correctly not found. Setting Ana (start slot 2) walks all the way round and reuses the tombstone: `Nena Ana Ben Rico Lita`.',
          '**Worst case.** With a good hash each key costs about one comparison (10, 20 and 40 in total). With the one-slot hash the totals are 100, 400 and 1600: doubling n multiplies the work by four, which is n² in total, so O(n) per operation.',
        ],
      },
      {
        type: 'table',
        headers: ['Step (capacity 5)', 'Start slot', 'Walk', 'Slots after'],
        rows: [
          ['set Nena', '0', 'free', 'Nena _ _ _ _'],
          ['set Ben', '2', 'free', 'Nena _ Ben _ _'],
          ['set Joy', '1', 'free', 'Nena Joy Ben _ _'],
          ['set Rico', '1', '1 taken, 2 taken, 3 free', 'Nena Joy Ben Rico _'],
          ['set Lita', '3', '3 taken, 4 free', 'Nena Joy Ben Rico Lita'],
          ['delete Joy', '1', 'found at 1: mark removed', 'Nena x Ben Rico Lita'],
        ],
        caption: 'Linear probing step by step. Rico is stored two slots after the one he hashes to.',
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "Things to know when you pick or review an implementation. Linear probing suffers from primary clustering: a run of full slots makes it likelier that the next key lands at its end, so the run grows; expected probes rise steeply as the load factor approaches 1, which is why real open-addressing tables resize well below full. Tombstones accumulate, so tables also rebuild when too many are present. Chaining degrades more gracefully but pays for pointers and allocations, and long chains can be turned into balanced trees in some implementations. Whichever you use, the O(1) claim assumes a hash that spreads the actual keys; adversarial or patterned keys can force the worst case." },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'In your own projects you have most likely used an object or a Map as a lookup table without ever thinking about collisions, because the language handles them for you. The reason to build one by hand is to see what the average O(1) promise depends on: keys spread out evenly, and a load factor kept low. When a lookup table gets slow in a real program, those are the two things to check first.',
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Use an assistant as a reviewer. State your own prediction before you ask." },
      { type: 'prompt', label: 'Trace linear probing with me', text: "I will give you a table with 5 slots that uses linear probing, where a key's start slot is its first letter's character code % 5. Give me four keys to insert, then ask me to write the final slots. Do not give the answer until I reply. Then ask me what happens when I delete the second key and look up the third, and why a tombstone is needed." },
      { type: 'prompt', label: 'Find the worst case', text: "Here is my hash table in JavaScript (paste your ChainedTable or ProbingTable; no private data). Do not rewrite it. Ask me which input would make every operation O(n), and what in the code makes that happen. After my answer, tell me whether I am right and what a test for that case would look like." },
      { type: 'paragraph', text: "What to look for: a careful reply names the two conditions for O(1), a well-spread hash and a bounded load factor, and says what happens when either fails. An assistant can mislead you by saying open addressing needs no extra memory: it needs spare empty slots, and it must also deal with deleted slots." },
      {
        type: 'takeaways',
        items: [
          'Separate chaining keeps a list at each slot; open addressing keeps one entry per slot and moves a colliding key to the next free slot (linear probing).',
          'Open addressing needs the load factor below 1 and marks deleted slots with a tombstone so that lookups do not stop early.',
          'get, set and delete are O(1) on average with a well-spread hash and a bounded load factor, and O(n) in the worst case when many keys share a slot.',
          'Doubling the table when it gets too full makes insertion amortized O(1); the resize itself is O(n).',
          'The O(1) claim depends on the hash and the keys: counting comparisons shows the difference (n against n squared in total).',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-29-predict-output-1',
          kind: 'predict-output',
          title: 'Walk the probe',
          prompt: 'The slot of a key is its first character code % 5 (a is 97, b is 98, f is 102, k is 107). Predict the final slots; `_` means empty.',
          concept: 'linear probing',
          language: 'javascript',
          code: `const slots = new Array(5).fill('_');
function put(key) {
  let slot = key.charCodeAt(0) % 5;
  while (slots[slot] !== '_') {
    slot = (slot + 1) % 5;
  }
  slots[slot] = key;
}
put('a');
put('f');
put('k');
put('b');
console.log(slots.join(' '));`,
          choices: ['b _ a f k', '_ _ a f k', 'a f k b _', 'f b a _ k'],
          wrongNotes: {
            '_ _ a f k': 'There are four keys, so four slots must be filled. b starts at slot 3, which is taken.',
            'a f k b _': 'Each key starts at its own slot (a at 2, not 0). Only a taken slot makes a key move along.',
            'f b a _ k': 'a is placed first at slot 2, and f, which also starts at 2, moves forward to 3, not backward.',
          },
          hints: ['97 % 5 is 2, 102 % 5 is 2, 107 % 5 is 2, and 98 % 5 is 3. Which keys collide?', 'a takes slot 2. f finds 2 taken and steps to 3. k tries 2 and 3, then 4.', 'b starts at 3 (taken), then 4 (taken), then wraps with % 5 to slot 0.'],
          explanation: 'a goes to 2, f to 3, k to 4 and b (start 3) finds 3 and 4 taken, wraps to 0. The slots are b _ a f k.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-29-fill-blank-1',
          kind: 'fill-blank',
          title: 'A chain lookup',
          prompt: 'Complete this tiny chained table. Keys a, d and g all share a bucket. The program should print 4, 7, then undefined.',
          concept: 'separate chaining',
          language: 'javascript',
          code: `const buckets = [[], [], []];
function slotOf(key) {
  return key.charCodeAt(0) % 3;
}
function add(key, value) {
  buckets[slotOf(key)].___({ key, value });
}
function find(key) {
  for (const entry of buckets[slotOf(key)]) {
    if (entry.key ___ key) {
      return entry.value;
    }
  }
  return ___;
}
add('a', 1);
add('d', 4);
add('g', 7);
console.log(find('d'));
console.log(find('g'));
console.log(find('x'));`,
          blanks: [
            { answers: ['push'], feedback: 'A new entry joins the end of the list in that slot.' },
            { answers: ['==='], feedback: 'Each entry in the chain must be compared with the requested key for equality.' },
            { answers: ['undefined'], feedback: 'After checking the whole chain with no match, the lookup has nothing to return.' },
          ],
          bank: ['push', 'pop', '===', '!==', 'undefined', 'null'],
          tests: { kind: 'output', expected: ['4', '7', 'undefined'] },
          hints: ['a (97), d (100) and g (103) all give remainder 1 when divided by 3.', 'The chain is an array, and add must put an entry at the end of it.', 'Return undefined when the loop ends without a match, as the lesson\'s get does.'],
          explanation: 'push adds an entry to the chain, === finds the entry whose key matches, and a lookup that finds nothing returns undefined. Because x lands in an empty bucket, it prints undefined.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-29-fix-bug-1',
          kind: 'fix-bug',
          title: 'The deleted key that hides its neighbours',
          prompt: 'This open-addressing table deletes a by emptying its slot. Afterwards has(\'f\') says false, although f is still stored. It should print false, true, true. Tap the faulty line, then choose the fix.',
          concept: 'tombstones',
          language: 'javascript',
          code: `const REMOVED = 'removed';
const slots = new Array(5).fill(undefined);
function start(key) {
  return key.charCodeAt(0) % 5;
}
function put(key) {
  let slot = start(key);
  while (slots[slot] !== undefined && slots[slot] !== REMOVED) {
    slot = (slot + 1) % 5;
  }
  slots[slot] = key;
}
function has(key) {
  let slot = start(key);
  for (let step = 0; step < 5; step++) {
    if (slots[slot] === undefined) {
      return false;
    }
    if (slots[slot] === key) {
      return true;
    }
    slot = (slot + 1) % 5;
  }
  return false;
}
function remove(key) {
  let slot = start(key);
  for (let step = 0; step < 5; step++) {
    if (slots[slot] === key) {
      slots[slot] = undefined;
      return;
    }
    slot = (slot + 1) % 5;
  }
}
put('a');
put('f');
put('k');
remove('a');
console.log(has('a'));
console.log(has('f'));
console.log(has('k'));`,
          bugLine: 30,
          fixes: [
            { line: '      slots[slot] = REMOVED;', correct: true, why: 'A tombstone is not undefined, so searches keep walking past it and still reach f and k.' },
            { line: '      slots[slot] = key;', correct: false, why: 'This writes the same key back, so a is still found after it was removed.' },
            { line: '      slots[slot] = undefined;', correct: false, why: 'This is the original line. An empty slot ends a search, so f and k, stored after it, can no longer be found.' },
          ],
          tests: { kind: 'output', expected: ['false', 'true', 'true'] },
          hints: ['a, f and k all start at slot 2, so they sit in slots 2, 3 and 4. What does has(\'f\') see at slot 2 after the removal?', 'An undefined slot makes the search stop with false.', 'The removed slot needs a marker that is not undefined and is never equal to a key. The code already has one.'],
          explanation: 'Emptying slot 2 makes the search for f stop at once. Marking it with REMOVED lets the search continue to slot 3 where f is, and put can still reuse the slot.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-29-scenario-1',
          kind: 'scenario',
          title: 'Why are the lookups slow?',
          prompt: 'Choose the best diagnosis and fix.',
          concept: 'worst-case hash table behaviour',
          situation: 'A school looks up students by id in a chained table with 1,000 slots, using hash = id % 1000. The ids are 1000, 2000, 3000 and so on, up to 50,000. Lookups have become very slow even though the load factor is only 0.05.',
          options: [
            { text: 'Every id is a multiple of 1000, so every id lands in slot 0. Use a hash that mixes all of the id (for example the string hash of the id).', consequence: 'Correct. One chain holds all 50 students, so each lookup scans it. A hash that uses every digit spreads the ids over many slots.', quality: 'best' },
            { text: 'Make the table 10,000 slots so there is more room.', consequence: 'A bigger table helps a little, but id % 10000 still sends all multiples of 1000 to just 10 slots. The pattern in the keys, not the room, is the problem.', quality: 'acceptable' },
            { text: 'Switch from chaining to linear probing.', consequence: 'All the ids would still want slot 0, so probing would build one huge cluster, which is no better and probably worse.', quality: 'poor' },
          ],
          hints: ['Work out id % 1000 for 1000, 2000 and 3000.', 'A low load factor says the table is not too full, so what else could make chains long?', 'The cure is a hash that does not leave out part of the key.'],
          explanation: 'The hash throws away everything but the last three digits, so the patterned ids all collide. The load factor is low, but the spread is terrible, and the worst case O(n) appears.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-29-match-1',
          kind: 'match',
          title: 'How much does it cost?',
          prompt: 'Match each situation to its cost.',
          concept: 'hash table complexity',
          labels: { terms: 'Situation', meanings: 'Cost' },
          pairs: [
            { term: 'get with a good hash and a load factor under 0.75', definition: 'O(1) on average' },
            { term: 'get when every key hashes to the same slot', definition: 'O(n): one chain or run holds everything' },
            { term: 'The single insert that triggers a resize', definition: 'O(n) for that insert, but rare' },
            { term: 'Inserting n keys when the table doubles as needed', definition: 'O(1) amortized per insert' },
          ],
          hints: ['Which ones are about a single operation, and which about many?', 'A resize touches every entry.', 'Amortized means the average over a long run of operations.'],
          explanation: 'Typical cases are constant, the all-in-one-slot case scans everything, a resize is linear but rare, and spreading that cost over many inserts gives amortized O(1).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-29-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write set and get for a chained table',
          story: 'You are finishing a small table that handles collisions.',
          prompt: 'Complete `set` and `get` in `ChainedTable`. `set(key, value)` must update the value when the key is already in its bucket and otherwise add `{ key, value }` to the bucket. `get(key)` returns the value for the key, or `undefined` when it is missing. `lookupAll` is written for you (it uses `??`, which gives the value on its right when the value on its left is undefined).',
          concept: 'separate chaining',
          language: 'javascript',
          starter: `function hashPoly(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % 1000003;
  }
  return h;
}

class ChainedTable {
  constructor(capacity) {
    this.capacity = capacity;
    this.buckets = [];
    for (let i = 0; i < capacity; i++) {
      this.buckets.push([]);
    }
  }
  bucketOf(key) {
    return this.buckets[hashPoly(key) % this.capacity];
  }
  set(key, value) {
    // update the entry if the key is already in the bucket, otherwise add one
  }
  get(key) {
    // return the value, or undefined when the key is not there
  }
}

function lookupAll(pairs, queries, capacity) {
  const table = new ChainedTable(capacity);
  for (const [key, value] of pairs) {
    table.set(key, value);
  }
  return queries.map((key) => table.get(key) ?? null);
}`,
          solution: `function hashPoly(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % 1000003;
  }
  return h;
}

class ChainedTable {
  constructor(capacity) {
    this.capacity = capacity;
    this.buckets = [];
    for (let i = 0; i < capacity; i++) {
      this.buckets.push([]);
    }
  }
  bucketOf(key) {
    return this.buckets[hashPoly(key) % this.capacity];
  }
  set(key, value) {
    const bucket = this.bucketOf(key);
    for (const entry of bucket) {
      if (entry.key === key) {
        entry.value = value;
        return;
      }
    }
    bucket.push({ key, value });
  }
  get(key) {
    for (const entry of this.bucketOf(key)) {
      if (entry.key === key) {
        return entry.value;
      }
    }
    return undefined;
  }
}

function lookupAll(pairs, queries, capacity) {
  const table = new ChainedTable(capacity);
  for (const [key, value] of pairs) {
    table.set(key, value);
  }
  return queries.map((key) => table.get(key) ?? null);
}`,
          tests: {
            kind: 'function',
            fn: 'lookupAll',
            cases: [
              { label: 'found and missing', args: [[['Nena', 'Naga'], ['Ben', 'Legazpi']], ['Ben', 'Zed'], 5], expected: ['Legazpi', null] },
              { label: 'setting a key again updates it', args: [[['a', 1], ['a', 2]], ['a'], 5], expected: [2] },
              { label: 'everything in one bucket', args: [[['a', 1], ['b', 2], ['c', 3]], ['c', 'a', 'b', 'd'], 1], expected: [3, 1, 2, null] },
              { label: 'no pairs', args: [[], ['x'], 3], expected: [null] },
              { label: 'many keys in few buckets', args: [Array.from({ length: 300 }, (_, i) => ['k' + i, i]), ['k0', 'k150', 'k299', 'k300'], 10], expected: [0, 150, 299, null], hidden: true },
            ],
          },
          hints: ['In set, first loop over the bucket and compare each entry.key with key.', 'If you find the key, change entry.value and return. If the loop ends without finding it, push a new entry.', 'get walks the same bucket and returns entry.value on a match, or undefined after the loop.'],
          explanation: 'Both methods search only one bucket. set updates in place when it finds the key, so the same key never appears twice, and adds a new entry otherwise. get returns the matching value or undefined.',
        },
      },
      {
        type: 'activity',
        audience: { max: 'beginner' },
        activity: {
          id: 'data-structures-algorithms-29-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Two plans for a shared box',
          prompt: 'Tap each card to check yourself.',
          concept: 'collision strategies',
          cards: [
            { front: 'Chaining in one sentence', back: 'Each box holds a small list, so colliding keys sit together in the same box.' },
            { front: 'Open addressing in one sentence', back: 'Each box holds one thing, so a newcomer takes the next empty box along.' },
            { front: 'Why a marker (tombstone) when deleting in open addressing?', back: 'An empty box tells a searcher to stop. A marker says "something was here, keep looking".' },
            { front: 'When can a hash table lookup become slow?', back: 'When many keys land in the same box, because of a poor hash or a table that is too full.' },
          ],
          hints: [],
          explanation: 'Both plans keep colliding keys apart; they differ in where the second key lives.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-29-q1',
        prompt: 'A chained table has 5 slots and holds 12 entries. What is its load factor, and what does it mean for lookups?',
        choices: [
          '2.4: chains hold 2 to 3 entries, so it works but lookups slow down',
          '0.42: the table is less than half full, so lookups are at their fastest',
          '12: every slot is crowded and the table can no longer store anything',
          '5: the table must be rebuilt before it can answer another get',
        ],
        answer: 0,
        explanation: 'Load factor is 12 / 5 = 2.4. With chaining that is legal because slots hold lists, but each lookup now scans a list of 2 to 3 entries on average, so a resize would help.',
      },
      {
        id: 'data-structures-algorithms-29-q2',
        prompt: 'Why can an open-addressing table not just empty a slot when a key is deleted?',
        choices: [
          'A slot that has been used once cannot ever hold another key afterwards in JavaScript',
          'The array would become shorter and every index after it would shift down by one',
          'An empty slot ends a lookup, so keys stored further along would not be found',
          'JavaScript does not allow a slot to be set back to undefined once it holds an entry',
        ],
        answer: 2,
        explanation: 'A lookup stops at the first empty slot because it proves the key is absent. If a deleted slot becomes empty, keys that were placed after it because of a collision look as if they are missing. A tombstone keeps the walk going.',
      },
      {
        id: 'data-structures-algorithms-29-q3',
        prompt: 'When does get on a hash table degrade from O(1) on average to O(n)?',
        choices: [
          'Whenever the table holds more than a hundred entries, whatever the hash is',
          'Whenever a key is missing from the table, since it must scan everything',
          'Whenever the keys are strings instead of numbers, because strings are longer',
          'When many keys share a slot, so one chain or run holds most of the entries',
        ],
        answer: 3,
        explanation: 'The cost of get is the length of the chain or run it must scan. That stays short with a good spread and a bounded load factor, and grows toward n when the keys pile up in one place.',
      },
      {
        id: 'data-structures-algorithms-29-q4',
        prompt: 'The one-slot hash needed 100, 400 and 1600 comparisons for 10, 20 and 40 keys. What does this show?',
        choices: [
          'The work grows only in step with the number of keys, so each operation is O(1)',
          'Doubling the keys quadruples the total work: n squared in total, O(n) per operation',
          'The work stays constant after the first resize of the table, whatever n is',
          'Collisions make the table faster, because every key is then found in the very first slot checked',
        ],
        answer: 1,
        explanation: 'From 10 to 20 to 40 keys the totals go up by a factor of four each time, the signature of n squared work: n operations that each scan a chain of length up to n.',
      },
      {
        id: 'data-structures-algorithms-29-q5',
        audience: { max: 'beginner' },
        prompt: 'In separate chaining, what happens when two keys belong in the same slot?',
        choices: [
          'The second key replaces the first one',
          'Both are kept in a small list at that slot',
          'The second key is refused and an error is shown',
          'The table doubles in size straight away',
        ],
        answer: 1,
        explanation: 'Chaining stores colliding entries together in a list at the slot. Replacing the first key would lose data, and growing the table is a separate decision based on the load factor.',
      },
      {
        id: 'data-structures-algorithms-29-q6',
        audience: { min: 'advanced' },
        prompt: 'Which statement about linear probing at a high load factor is correct?',
        choices: [
          'Lookups stay O(1) right up to a load factor of exactly 1, so resizing is only ever optional',
          'Chains are lists that can always be balanced, so clustering is never a concern here',
          'Runs of full slots grow, so probes rise sharply and tables resize well before full',
          'Tombstones make every lookup faster, because they shorten each probe run that passes them',
        ],
        answer: 2,
        explanation: 'A long run of occupied slots makes the next collision likelier to extend it. Expected probe counts climb steeply as the table fills, so real tables grow at a load factor well below 1, and tombstones, which do not shorten runs, are cleaned up when they pile up.',
      },
    ],
    task: {
      title: 'Count what the table costs',
      steps: [
        'Paste hashPoly, ChainedTable and the `work` function from this lesson into a free JavaScript playground and run the comparison for n = 10, 20 and 40.',
        'Run it for n = 80 with the good hash and write down the number of comparisons. Then predict what the one-slot hash will give for n = 80 before running it (hint: it follows n squared).',
        'Paste ProbingTable and try to insert a sixth key into the 5-slot table. Write down what happens and why.',
        'Delete a key from the middle of a probe run and look up a key stored after it. Then change the delete to set the slot to undefined and run it again. Describe the difference.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw 5 boxes. Insert a, f, k and b as in the lesson\'s probing activity, moving along one box at a time. Mark a box with an x when you delete a key, and check that your search still finds the others.', 'Ask an AI assistant to explain tombstones with an example of a parking lot, and compare it with your drawing.'] },
      { audience: { min: 'advanced' }, steps: ['Add a counter of probes to ProbingTable and compare average probes per successful get at load factors 0.25, 0.5, 0.75 and 0.9 for 1,000 generated keys. Describe the curve.', 'Make ProbingTable resize (rebuild into twice the capacity, dropping tombstones) when load including tombstones passes 0.7, and show a test where tombstones alone trigger the rebuild.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-30',
    day: 30,
    title: 'Maps, Sets, and Choosing Between Objects, Maps and Sets',
    summary: 'Use JavaScript\'s built-in Map and Set, know what a plain object cannot do, and pick the right one for counting, lookup and removing duplicates.',
    intro: {
      objectives: [
        'Use Map and Set for lookup, counting, membership and removing duplicates',
        'Explain how a Map differs from a plain object: key types, order, size and prototype keys',
        'Choose between an object, a Map, a Set and an array for a given job',
        'Replace a repeated search with a Set or Map lookup and show the saving by counting',
      ],
      why: 'In real JavaScript you rarely write a hash table by hand; you ask for a Map or a Set. The skill is choosing the right one and seeing the slow pattern, a loop that searches an array again and again, that an AI so often writes and that a Map or a Set removes.',
    },
    minutes: 30,
    skills: ['hashing', 'choose-structure'],
    body: [
      { type: 'paragraph', text: "You now know what is inside a hash table: slots, a hash function, a plan for collisions and a load factor. JavaScript ships with two ready-made tables, **Map** and **Set**, and plain objects work like a table too. This lesson shows how to use them well, where a plain object lets you down, and how to choose. It also shows the most useful habit in this module: when code searches an array over and over, ask whether a Map or a Set could answer the question in one step instead." },
      { type: 'heading', text: 'A real-world picture' },
      { type: 'paragraph', text: "A **Map** is a phone book: each name (the key) is attached to one number (the value), and you look a number up by name. A **Set** is a guest list at a barangay event: it only holds names, each at most once, and the one question it answers is \"is this person on the list?\". A plain object is more like a printed form with labelled boxes (name, city, plan), meant for describing one thing with fixed fields." },
      { type: 'paragraph', text: "Where the picture stops working: a paper phone book is sorted alphabetically. A Map is not sorted at all; it remembers the order in which entries were added, which is a different thing." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "A **Map** stores key-value pairs. `set(key, value)` adds or replaces, `get(key)` reads (`undefined` when missing), `has(key)` tests, `delete(key)` removes, and `size` is how many pairs it holds. Keys can be **any value**: numbers, strings, even objects. Two keys are the same when they are \"the same value\", where `NaN` counts as equal to `NaN` and objects count only when they are the very same object (the same reference), not merely the same contents. A Map remembers insertion order, and a `for...of` loop over it gives `[key, value]` pairs in that order." },
      { type: 'paragraph', text: "A **Set** stores unique values: `add(value)`, `has(value)`, `delete(value)` and `size`. Adding a value that is already there does nothing, which makes a Set the natural tool for **removing duplicates** and for asking \"have I seen this before?\". To turn a Set back into an array you write `[...set]`: the three dots (spread) lay out the items one by one inside the new array." },
      { type: 'paragraph', text: "A **plain object** also maps keys to values, but with differences that matter when the data is not a fixed record:" },
      {
        type: 'list',
        items: [
          '**Key types.** Object keys are always strings (or symbols). The number 1 and the string \'1\' are the same key, whereas a Map keeps them apart.',
          '**Inherited keys.** An object starts with properties from its prototype, so `\'toString\' in {}` is true and `{}[\'constructor\']` is a function. A fresh Map holds only what you put in. Counting words typed by users in an object can therefore go wrong for a word like `constructor`.',
          '**Order.** In an object, keys that look like whole numbers are listed first in ascending order, then the other keys in the order they were added. A Map lists keys purely in insertion order. (MDN advises not to rely on object key order at all.)',
          '**Size and iteration.** A Map has `size` and is directly iterable. An object needs `Object.keys(obj).length` and `Object.entries`.',
        ],
      },
      {
        type: 'table',
        headers: ['You need', 'Best fit', 'Why'],
        rows: [
          ['One record with fixed, known fields ({ sku, name, qty, price })', 'Object', 'Readable, works with JSON, the fields are decided in advance'],
          ['A changing collection of keys: lookups, counts, caches', 'Map', 'Any key type, insertion order, size, no inherited keys, fast add and remove'],
          ['Unique values, or "have I seen this?"', 'Set', 'Stores each value once; add and has are fast'],
          ['Items in order, repeats allowed, mostly looped over', 'Array', 'Order and position matter; no lookup by key is needed'],
        ],
        caption: 'Choosing between an object, a Map, a Set and an array.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: use a Map when you want to say \"for this key, remember that value\", like a price list or a counter of how many times each word appears. Use a Set when you only care whether something is in the group and you never want it twice, like a list of customers who already got a message. Use an object to describe one thing, like one product. Use an array when the order of items matters and you mostly go through all of them. A Map and a Set can both answer \"is this here?\" in one step, where an array has to look through its items." },
      { type: 'paragraph', text: "What do they cost? In this course `get`, `set`, `has`, `add` and `delete` on a Map or Set are **O(1) on average**. Be precise about what the language promises: the ECMAScript specification requires Map and Set to be implemented with hash tables or other mechanisms that are, on average, **sublinear** in the number of elements. It does not promise exactly O(1), so treat O(1) as the usual, expected behaviour rather than a guarantee. Looping over all entries is O(n), as for any collection." },
      { type: 'version', text: "MDN's Map page lists the differences from Object used above: a Map holds only keys you add, accepts any value as a key, iterates in insertion order, exposes size directly, and compares keys by SameValueZero (so NaN matches NaN and two different objects with equal contents do not match). The ECMAScript specification's section on Map and Set objects says each must be implemented with hash tables or other mechanisms that, on average, give access times sublinear in the number of elements.", checked: CHECKED, sources: [DOCS.mdnMap, DOCS.specMap] },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: "First a Map and a Set in action: adding, replacing, removing, looping and removing duplicates." },
      {
        type: 'code',
        language: 'javascript',
        label: 'Map and Set basics',
        code: `const prices = new Map();
prices.set('SKU-001', 7);
prices.set('SKU-002', 12);
prices.set('SKU-001', 8);
console.log(prices.get('SKU-001'), prices.has('SKU-003'), prices.size);
prices.delete('SKU-002');
prices.set('SKU-003', 25);
for (const [sku, price] of prices) {
  console.log(sku, price);
}

const towns = new Set(['Naga', 'Pili', 'Naga', 'Iriga', 'Pili']);
console.log(towns.size, towns.has('Pili'), towns.has('Legazpi'));
towns.add('Legazpi');
towns.delete('Pili');
console.log([...towns]);
console.log([...new Set(['Naga', 'Pili', 'Naga', 'Iriga', 'Pili'])]);`,
      },
      { type: 'paragraph', text: "Next, counting words, a pattern you will use constantly. `(x ?? 0)` means \"use x, or 0 if there is no value yet\". Run in Node, the object version is quietly wrong for the word `constructor`." },
      {
        type: 'code',
        language: 'javascript',
        label: 'Counting with an object and with a Map',
        code: `const words = ['to', 'be', 'or', 'not', 'to', 'be', 'constructor'];
const asObject = {};
for (const word of words) {
  asObject[word] = (asObject[word] ?? 0) + 1;
}
console.log(asObject['to'], asObject['constructor']);
const asMap = new Map();
for (const word of words) {
  asMap.set(word, (asMap.get(word) ?? 0) + 1);
}
console.log(asMap.get('to'), asMap.get('constructor'));
console.log('toString' in {}, new Map().has('toString'));`,
      },
      { type: 'paragraph', text: "Then the key-type and order differences, side by side." },
      {
        type: 'code',
        language: 'javascript',
        label: 'Key types and order',
        code: `const obj = {};
obj[1] = 'one';
obj['1'] = 'uno';
console.log(Object.keys(obj), obj[1]);
const map = new Map();
map.set(1, 'one');
map.set('1', 'uno');
console.log(map.size, map.get(1), map.get('1'));
const key = { id: 1 };
map.set(key, 'object key');
console.log(map.get(key), map.get({ id: 1 }));
console.log(Object.keys({ b: 1, 2: 'x', a: 1, 1: 'y' }));
console.log([...new Map([['b', 1], [2, 'x'], ['a', 1], [1, 'y']]).keys()]);`,
      },
      { type: 'paragraph', text: "Finally the habit that matters most: replacing a repeated search with a Set. Both functions return the first id that appears twice and count the checks they make. (Each \"check\" in the fast version is one Set lookup.)" },
      {
        type: 'code',
        language: 'javascript',
        label: 'The first duplicate: a nested search against a Set',
        code: `function firstDuplicateSlow(ids) {
  let checks = 0;
  for (let i = 0; i < ids.length; i++) {
    for (let j = 0; j < i; j++) {
      checks++;
      if (ids[j] === ids[i]) {
        return { id: ids[i], checks };
      }
    }
  }
  return { id: null, checks };
}
function firstDuplicateFast(ids) {
  const seen = new Set();
  let checks = 0;
  for (const id of ids) {
    checks++;
    if (seen.has(id)) {
      return { id, checks };
    }
    seen.add(id);
  }
  return { id: null, checks };
}
const ids = [];
for (let i = 1; i <= 100; i++) {
  ids.push(i);
}
console.log(firstDuplicateSlow(ids).checks, firstDuplicateFast(ids).checks);
ids.push(50);
console.log(firstDuplicateSlow(ids).checks, firstDuplicateFast(ids).checks);`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Basics.** Setting `SKU-001` twice replaces its price, so `get` prints 8, `has(\'SKU-003\')` is `false` and the size is 2. After deleting `SKU-002` and adding `SKU-003`, the loop prints `SKU-001 8` and `SKU-003 25` in the order they were added. The Set drops the repeats: size 3, `true`, `false`, then `[ \'Naga\', \'Iriga\', \'Legazpi\' ]` after adding Legazpi and deleting Pili, and the last line prints `[ \'Naga\', \'Pili\', \'Iriga\' ]`.',
          '**Counting.** Both versions count `to` as 2. For `constructor`, the object already has a `constructor` property (a function) inherited from its prototype, so `asObject[\'constructor\'] ?? 0` finds that function, and adding 1 turns it into a string that starts with `function Object() { [native code] }1`. The Map has no such entry, so it correctly prints 1. The last line is `true false`: the object seems to contain `toString`; the Map does not.',
          '**Key types.** The object treats 1 and \'1\' as one key, so `Object.keys` shows only `[ \'1\' ]` and `obj[1]` is `uno`. The Map keeps both (size 2). Looking up `{ id: 1 }` with a new object prints `undefined`, because the key was a different object. The object lists whole-number keys first, `[ \'1\', \'2\', \'b\', \'a\' ]`; the Map keeps insertion order, `[ \'b\', 2, \'a\', 1 ]`.',
          '**Duplicates.** With 100 distinct ids the nested loops make 0 + 1 + ... + 99 = 4950 checks, while the Set version makes 100. When 50 is added again at the end, the slow version needs 5000 checks and the fast one 101. The Set grows linearly; the nested search grows with n squared.',
        ],
      },
      {
        type: 'table',
        headers: ['Number of ids n', 'Nested search checks (no duplicate)', 'Set lookups (no duplicate)'],
        rows: [
          ['50', '1,225', '50'],
          ['100', '4,950', '100'],
          ['200', '19,900', '200'],
          ['400', '79,800', '400'],
        ],
        caption: 'Doubling n doubles the Set work but multiplies the nested search by about four. The nested count is n * (n - 1) / 2.',
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "Details worth knowing. Key equality in Map and Set is SameValueZero, so `+0` and `-0` are one key and `NaN` is a valid key, but objects compare by identity: to use records as keys, key by a stable id or a canonical string instead. Never mutate something you used as a key. A Map has no JSON form, so serialising means converting to entries and back. For dictionaries built from untrusted input, a Map avoids prototype-key bugs and prototype pollution, which is why it is the safer default there. MDN says a Map generally performs better than an object for frequent additions and removals; measure rather than assume for your workload, and note that building an index costs O(n) time and O(n) extra memory, which pays off only when you look things up repeatedly." },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Ask the assistant to challenge your choices, and give your own answer first." },
      { type: 'prompt', label: 'Object, Map, Set or array?', text: "I am learning when to use an object, a Map, a Set or an array in JavaScript. Give me six short app situations (for example counting tickets per customer, remembering who already got a message, one product record, a list of recent searches). For each one, ask me to choose and explain. Do not give the answer until I reply, then tell me whether my reasoning holds, and name any key-type or ordering trap I missed." },
      { type: 'prompt', label: 'Find the slow lookup', text: "Here is a JavaScript function that uses includes or find inside a loop (paste your own, with no private data). Do not rewrite it yet. Ask me to count how many checks it makes for 100 items and for 200 items, and to say which Set or Map I would use. After my answer, show me the faster version and ask me to explain what it costs in extra memory." },
      { type: 'paragraph', text: "What to look for: a good answer names the extra memory the Map or Set uses and says the lookup is O(1) on average. An assistant can mislead you by calling a Map lookup \"always O(1)\" or by turning every array into a Map without asking whether the data is looked up more than once. Ask for the count of checks before and after." },
      {
        type: 'takeaways',
        items: [
          'A Map stores key-value pairs with any key type and remembers insertion order; a Set stores each value once and answers "is it here?".',
          'A plain object is for fixed records: its keys are strings, it inherits keys like constructor and toString, and it orders whole-number keys first.',
          'Map and Set operations are O(1) on average; the language specification only requires them to be sublinear on average.',
          'Count with `map.set(key, (map.get(key) ?? 0) + 1)` and remove duplicates with `[...new Set(array)]`.',
          'Replacing a nested search with a Set or Map lookup turns about n squared checks into about n, at the price of O(n) extra memory.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-30-predict-output-1',
          kind: 'predict-output',
          title: 'Which keys are the same?',
          prompt: 'Predict what this program prints. Remember how a Map decides whether two keys are the same.',
          concept: 'Map key equality',
          language: 'javascript',
          code: `const m = new Map();
m.set(1, 'number');
m.set('1', 'string');
m.set(NaN, 'not a number');
const a = { id: 1 };
m.set(a, 'object');
console.log(m.size);
console.log(m.get(NaN));
console.log(m.get({ id: 1 }));
console.log(m.get(a));`,
          choices: ['4\nnot a number\nundefined\nobject', '3\nnot a number\nobject\nobject', '4\nundefined\nobject\nobject', '2\nnot a number\nundefined\nobject'],
          wrongNotes: {
            '3\nnot a number\nobject\nobject': 'A Map compares objects by identity: a new { id: 1 } is a different key from a, so that lookup finds nothing. And 1 and \'1\' stay two keys.',
            '4\nundefined\nobject\nobject': 'A Map treats NaN as equal to NaN, so NaN works as a key. A new { id: 1 } is not the same object as a, so it finds nothing.',
            '2\nnot a number\nundefined\nobject': 'A Map keeps 1 and \'1\' as two separate keys, unlike an object. All four keys are different, so the size is 4.',
          },
          hints: ['Count the set calls: are any two keys the same? Think about 1 and \'1\'.', 'NaN is equal to NaN as a Map key.', 'The object in the lookup is a new object. Is it the same as a?'],
          explanation: 'All four keys are different: 1, \'1\', NaN and the object a, so the size is 4. NaN finds its value because a Map treats NaN as equal to NaN. A new { id: 1 } is a different object from a, so it finds nothing (undefined).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-30-fill-blank-1',
          kind: 'fill-blank',
          title: 'Count and deduplicate',
          prompt: 'Fill in the blanks. The program should print 3, 3 and 2.',
          concept: 'counting with a Map and removing duplicates with a Set',
          language: 'javascript',
          code: `const counts = new Map();
for (const w of ['a', 'b', 'a', 'c', 'a', 'b']) {
  counts.___(w, (counts.get(w) ?? 0) + 1);
}
console.log(counts.get('a'));
console.log(counts.___);
const unique = [...new ___(['a', 'b', 'a'])];
console.log(unique.length);`,
          blanks: [
            { answers: ['set'], feedback: 'Storing a new count under a word is the Map operation that adds or replaces.' },
            { answers: ['size'], feedback: 'The number of distinct words is the number of pairs in the Map. It is a property, not a method.' },
            { answers: ['Set'], feedback: 'Which built-in keeps each value only once?' },
          ],
          bank: ['set', 'add', 'size', 'length', 'Set', 'Map'],
          tests: { kind: 'output', expected: ['3', '3', '2'] },
          hints: ['A Map stores a pair with set, a Set stores a value with add.', 'A Map reports how many pairs it holds with size, without parentheses.', 'Spreading a collection that keeps each value once removes the duplicates.'],
          explanation: 'counts.set stores each new tally, a is seen three times, and counts.size is 3 because there are three distinct words. new Set(...) removes the repeat of a, leaving two values.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-30-fix-bug-1',
          kind: 'fix-bug',
          title: 'Two customers or three?',
          prompt: 'A customer list holds the same customer twice (same id, a slightly different name) plus one other. The program should print 2, the number of different ids, but it prints 3. Tap the faulty line, then choose the fix.',
          concept: 'Set of objects compares by identity',
          language: 'javascript',
          code: `const customers = [
  { id: 1, name: 'Nena' },
  { id: 1, name: 'Nena R.' },
  { id: 2, name: 'Ben' },
];
const unique = new Set(customers);
console.log(unique.size);`,
          bugLine: 6,
          fixes: [
            { line: 'const unique = new Set(customers.map((c) => c.id));', correct: true, why: 'Numbers are compared by value, so the two records with id 1 become one entry. The Set holds the ids 1 and 2.' },
            { line: 'const unique = new Set(customers.map((c) => c.name));', correct: false, why: 'The two records for id 1 have different names, so this still counts three.' },
            { line: 'const unique = new Set(customers.map((c) => [c.id]));', correct: false, why: 'Each [c.id] is a new array, and arrays are compared by identity, so all three stay different.' },
          ],
          tests: { kind: 'output', expected: ['2'] },
          hints: ['Does a Set compare two objects by their contents or by identity?', 'Three different objects are three different values, even when two share an id.', 'Put something that is compared by value into the Set: a number or a string.'],
          explanation: 'A Set compares objects by identity, so records with the same id are still different values. Putting the ids themselves in the Set lets equal ids collapse into one.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-30-scenario-1',
          kind: 'scenario',
          title: 'Tickets per customer, in the order first seen',
          prompt: 'Choose the structure that fits best.',
          concept: 'choosing a Map',
          situation: 'A support tool counts tickets per customer id (numbers such as 1042, 7 and 300) and must show customers in the order each one first appeared. New customers show up all day.',
          options: [
            { text: 'A Map from customer id to count.', consequence: 'Correct. Number keys stay numbers, it remembers insertion order, size is built in, and adding a new customer is one set call.', quality: 'best' },
            { text: 'A plain object keyed by customer id.', consequence: 'It counts correctly, but whole-number keys are listed in ascending order (7, 300, 1042), not in the order first seen, so the display order would be wrong.', quality: 'acceptable' },
            { text: 'A Set of customer ids.', consequence: 'A Set can say whether a customer has appeared, but it has nowhere to keep a count.', quality: 'poor' },
          ],
          hints: ['What two things must be stored: the id, and what else?', 'In an object, how are keys that look like whole numbers ordered?', 'Which structure keeps counts and insertion order and accepts number keys?'],
          explanation: 'Counts per key call for a Map or an object, and insertion order tips the choice to the Map because an object would reorder numeric-looking keys.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-30-match-1',
          kind: 'match',
          title: 'Pick the structure',
          prompt: 'Match each job to the best structure.',
          concept: 'identifying the appropriate data structure',
          labels: { terms: 'Job', meanings: 'Structure' },
          pairs: [
            { term: 'One product with a sku, a name, a quantity and a price', definition: 'A plain object' },
            { term: 'Which customer ids already received today\'s message (yes or no)', definition: 'A Set' },
            { term: 'How many tickets each customer has, with new customers appearing all the time', definition: 'A Map' },
            { term: 'The last ten searches, oldest first, repeats allowed', definition: 'An array' },
          ],
          hints: ['Which job has fixed fields decided in advance?', 'Which one needs only a yes or no, never a number or a value?', 'Which one cares about order and allows repeats, so a key makes no sense?'],
          explanation: 'Fixed fields suit an object, yes-or-no membership suits a Set, counts per changing key suit a Map, and an ordered list with repeats suits an array.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-30-code-challenge-1',
          kind: 'code-challenge',
          title: 'Make the duplicate check fast',
          story: 'A signup form checks each new id against all earlier ones.',
          prompt: 'The function `firstDuplicate(values)` returns the first value that has already appeared earlier in the array, or `null` if there is none. The version below is correct but so slow that large lists time out. Rewrite it so it makes a single pass using a Set.',
          concept: 'optimising with a Set',
          language: 'javascript',
          starter: `function firstDuplicate(values) {
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < i; j++) {
      if (values[j] === values[i]) {
        return values[i];
      }
    }
  }
  return null;
}`,
          solution: `function firstDuplicate(values) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
  }
  return null;
}`,
          tests: {
            kind: 'function',
            fn: 'firstDuplicate',
            cases: [
              { label: 'a repeat in the middle', args: [[3, 1, 4, 1, 5, 9, 2, 6, 5]], expected: 1 },
              { label: 'no repeat', args: [[1, 2, 3]], expected: null },
              { label: 'empty', args: [[]], expected: null },
              { label: 'strings', args: [['Naga', 'Pili', 'Naga']], expected: 'Naga' },
              { label: 'a large list with the repeat at the end', args: [Array.from({ length: 20000 }, (_, i) => i).concat([7])], expected: 7, hidden: true },
            ],
          },
          hints: ['The slow version compares every value with all earlier ones. What could remember the earlier values and answer "seen already?" in one step?', 'Create a Set before the loop. For each value, ask seen.has(value).', 'If it is in the Set, return it. Otherwise add it to the Set and carry on.'],
          explanation: 'The Set remembers every value seen so far. Each value costs one has and one add, so the whole list takes a single pass of about n steps instead of about n squared.',
        },
      },
      {
        type: 'activity',
        audience: { max: 'beginner' },
        activity: {
          id: 'data-structures-algorithms-30-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Map, Set or object?',
          prompt: 'Tap each card for the rule of thumb.',
          concept: 'Map, Set and object',
          cards: [
            { front: 'When do I reach for a Map?', back: 'When I want to remember a value for each key and the keys keep changing: prices by code, counts by word.' },
            { front: 'When do I reach for a Set?', back: 'When I only care whether something is in the group, and I never want it twice.' },
            { front: 'When is a plain object the right choice?', back: 'To describe one thing with a few known fields, like one product or one customer.' },
            { front: 'What is one trap of using an object to count words?', back: 'Words like constructor or toString already exist on every object, so the counts can come out wrong.' },
          ],
          hints: [],
          explanation: 'Pair the structure with the question you are asking: a value per key (Map), is it in the group (Set), one thing with fields (object).',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-30-q1',
        prompt: 'You need to count how many times each customer id appears. New ids keep arriving. Which structure fits best?',
        choices: [
          'A Set of ids',
          'An array of ids, searched with includes',
          'A Map from id to count',
          'A sorted array of ids',
        ],
        answer: 2,
        explanation: 'A count must be stored per key, which a Map does with one set and one get. A Set cannot keep counts, and searching or sorting an array for every id is much more work.',
      },
      {
        id: 'data-structures-algorithms-30-q2',
        prompt: 'What does `new Set([3, 1, 3, 2, 1]).size` give?',
        choices: ['3', '5', '2', '4'],
        answer: 0,
        explanation: 'A Set keeps each value once, so it holds 3, 1 and 2: three values. The five is the length of the array, not of the Set.',
      },
      {
        id: 'data-structures-algorithms-30-q3',
        prompt: 'Why can a plain object give wrong results when it counts words typed by users?',
        choices: [
          'Objects cannot store numbers as values, so a count cannot be kept at all',
          'Objects are always slower than arrays whenever they are used for counting the words in a text',
          'Object keys must be written in lowercase, so mixed-case words are rejected',
          'Words like constructor already exist on every object, so lookups find what was never counted',
        ],
        answer: 3,
        explanation: 'A fresh object already inherits properties like constructor. Looking up that word finds the inherited function, not a missing key, so the count is wrong. A Map holds only what you add.',
      },
      {
        id: 'data-structures-algorithms-30-q4',
        prompt: 'You store a value in a Map under the object `{ id: 1 }`, then call `map.get({ id: 1 })` with another object written the same way. What do you get?',
        choices: [
          'The stored value, because both objects have exactly the same contents and the same fields',
          'undefined: a Map compares objects by identity, and these are two different objects',
          'An error is thrown, because objects cannot be used as Map keys at all',
          'The stored value only if both objects were created on the very same line of code',
        ],
        answer: 1,
        explanation: 'Object keys match only when they are the same object (the same reference). Two objects with equal contents are still two keys, so the lookup finds nothing.',
      },
      {
        id: 'data-structures-algorithms-30-q5',
        audience: { max: 'beginner' },
        prompt: 'Which one keeps each value only once?',
        choices: ['A Map', 'An array', 'An object', 'A Set'],
        answer: 3,
        explanation: 'A Set ignores a value it already holds. An array allows repeats, and a Map or an object stores values under keys, not as a unique group.',
      },
      {
        id: 'data-structures-algorithms-30-q6',
        audience: { min: 'advanced' },
        prompt: 'The ECMAScript specification says Map and Set must use hash tables or other mechanisms that are, on average, sublinear in the number of elements. What can you rely on?',
        choices: [
          'Every operation is exactly O(1) in every JavaScript engine, so measuring is never needed',
          'Lookups are sublinear on average and O(1) is the usual expectation, not a promise',
          'The worst case of every single operation is guaranteed to be O(log n)',
          'The order of iteration is unspecified, so it may change from one run to the next',
        ],
        answer: 1,
        explanation: 'The specification promises sublinear average time, not exactly O(1), so O(1) is the expected behaviour in practice rather than a guarantee. Iteration order for Map and Set is specified: insertion order.',
      },
    ],
    task: {
      title: 'Count, deduplicate and measure',
      steps: [
        'Open Talino\'s code runner or any free JavaScript playground. Write a function that takes an array of words and returns a Map of how many times each appears. Test it on a sentence of your own.',
        'Write a function that removes duplicates from an array using a Set and keeps the first occurrence order. Test it with strings and with numbers.',
        'Paste firstDuplicateSlow and firstDuplicateFast from this lesson. Run them with 50, 100 and 200 distinct ids and write down the checks each makes.',
        'Try the word-counting code with an object and the word \'constructor\' and describe in one sentence what you see.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before running step 3, predict on paper how many checks the slow version makes for 10 ids (add 0 + 1 + 2 + ... + 9) and compare with the code.', 'Ask an AI assistant to explain the difference between a Map and an object with a phonebook example, and note one sentence you would not have thought of.'] },
      { audience: { min: 'advanced' }, steps: ['Group an array of tickets by customer into a Map of arrays and then find the customer with the most tickets in a single pass over the Map. State the cost of each step.', 'Show with a small experiment that a Map keyed by JSON.stringify of a record finds records that a Map keyed by the record object itself misses, and list two risks of the string-key approach.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'data-structures-algorithms-p6',
  title: 'Fast customer lookup with a hash map',
  summary: 'Build a small customer directory twice, once with a plain array search and once with Map indexes, keep the indexes correct when customers change, and measure the saving by counting checks.',
  outcome: 'A working customer directory with indexes, a counted comparison of two designs and a written explanation of why a hash map is faster and what it costs: evidence that you can replace a slow search and defend the trade-off.',
  unlockAfterDay: 30,
  steps: [
    { id: 'data-structures-algorithms-p6-s1', text: 'Write `makeCustomers(n)` that returns n customers like { id: 1001, name: "Customer 1", city: "Naga", plan: "basic" }, with ids starting at 1001, cities taken in turn from a list of five towns, and plans alternating between "basic" and "plus". No dates and no randomness: the data must come out the same every run.' },
    { id: 'data-structures-algorithms-p6-s2', text: 'Write the slow directory: `findByIdSlow(customers, id)` and `customersInCitySlow(customers, city)`. Each loops over the array and counts every record it looks at in a counter you can read afterwards.' },
    { id: 'data-structures-algorithms-p6-s3', text: 'Write `buildIndexes(customers)` that returns { byId, byCity }: a Map from id to customer, and a Map from city to an array of customers. Write `findById` and `customersInCity` that use them. Print the same lookups from both designs and check that the answers match.' },
    { id: 'data-structures-algorithms-p6-s4', text: 'Keep the indexes correct. Write `addCustomer` (refuse an id that already exists), `moveCustomer(id, newCity)` (the customer must leave the old city list and join the new one) and `removeCustomer(id)`. After each operation print the city list and the byId size to show the two indexes still agree.' },
    { id: 'data-structures-algorithms-p6-s5', text: 'Measure with counts, not clocks. For 100, 200 and 400 customers, look up 50 ids with both designs and print the total records checked by each. Also count the work of building the indexes once. Describe what you see in two sentences using the words average and worst case.' },
    { id: 'data-structures-algorithms-p6-s6', text: 'Write your explanation: why Map rather than a plain object for byId; what a key must satisfy (unique and not changing while stored); what the indexes cost in memory and in extra work when data changes; and when the plain array search would still be the better choice.' },
    { id: 'data-structures-algorithms-p6-s7', audience: { max: 'beginner' }, text: 'Make it smaller: use 5 customers written by hand instead of makeCustomers, build only byId, and write findByIdSlow and findById. Add a comment above each function explaining it in your own words, and skip steps 4 and 5; instead count by hand how many records the slow search looks at for the last customer in the list.' },
    { id: 'data-structures-algorithms-p6-s8', audience: { min: 'advanced' }, text: 'Replace the Map for byId with your own ChainedTable from lesson 29 and print how many key comparisons it makes for 50 lookups at 100, 200 and 400 customers. Then give it the one-slot hash on purpose and show the worst case, with the numbers.' },
    { id: 'data-structures-algorithms-p6-s9', audience: { min: 'advanced' }, text: 'Add a third index, byName, keyed by the lowercase name, where several customers may share a name (so each value is an array). Write consistency checks that run after every add, move and remove, and report if any index disagrees with the customer list.' },
  ],
  submission: {
    kind: 'text',
    label: 'Your code and explanation',
    placeholder: 'Paste your code, the printed output of your checks and counts, and your written explanation.',
    hint: 'Include: the slow and fast versions, the output showing they agree, the output of your add, move and remove checks, the counts for 100, 200 and 400 customers, and your explanation of why the Map is faster, what it costs and when it is not worth it.',
  },
  rubric: [
    'Correctness: both designs return the same answers, and the indexes stay consistent after add, move and remove (including a refused duplicate id)',
    'Efficiency: the counts show about one check per id lookup for the Map against a growing number for the array, and the costs are named correctly (average O(1) lookup, O(n) to build)',
    'Code organisation: small functions with clear names, the index code kept apart from the sample data, and no repeated logic for keeping the indexes in step',
    'Explanation of trade-offs: says why a Map and not an object, what a key must satisfy, what the indexes cost in memory and update work, and when the simple search is enough',
    'The measurements are reproducible: the output can be re-run and gives the same numbers',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The code runs and prints the same customer from both versions, and your comments explain in your own words why the Map version needs fewer checks'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['Includes at least five small tests (a missing id, a duplicate id, moving to the same city, removing then looking up, an empty directory) that print pass or fail'] },
    { audience: { min: 'advanced' }, items: ['Your own hash table is used for byId and the worst case with the one-slot hash is shown with counts', 'The consistency checks catch a deliberately introduced bug, such as forgetting to remove a customer from the old city list'] },
  ],
};
