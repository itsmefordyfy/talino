import type { Lesson, Project } from '../../../types';

/**
 * Module 12, Tries and Specialized Data Structures (lessons 41 to 43, project p9). A trie with insert and search, then prefix matching and
 * autocomplete (counting, collecting, ranking, memory), then union-find and a rule for when a specialized structure earns its place. Every output
 * printed in a code comment or a walkthrough was produced by running the code with Node; the activities are run by the activity validator
 * (the in-app runner).
 */

export const lessons: Lesson[] = [
  {
    id: 'data-structures-algorithms-41',
    day: 41,
    title: 'Tries: Prefix Trees, Inserting and Searching Words',
    summary: 'Store words one character per node so that words with the same beginning share a path, and search by walking that path.',
    minutes: 26,
    skills: ['trees-heaps', 'hashing'],
    intro: {
      objectives: [
        'Explain how a trie stores words as paths of characters and why every node carries an end-of-word flag',
        'Insert a word into a trie and trace the nodes that are created',
        'Search for a whole word and for a prefix, and say why the two answers differ',
        'State the cost of insert and search in terms of the word length, not the number of words',
      ],
      why: 'Every search box that suggests words as you type, from a phone keyboard to a shop catalogue, answers a question a plain Set cannot answer well: "which words start with these letters?". A trie is the structure built for that question.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A `Set` answers "is this exact word in my list?" very well. It cannot answer "which words begin with `ca`?" without looking at every word. A **trie** (said "try", from the word *retrieval*) is a tree built for that second question. Instead of storing each word whole, it stores the words one character at a time along a path, so all words that begin the same way share the beginning of their path. To find every word starting with `ca`, you walk to the node for `c` then `a`, and everything below that node is your answer. This lesson builds the trie and its two basic questions: is this a word, and is this a prefix? The next lesson turns that into autocomplete.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Think of directions on a long road trip. Many destinations share the same first stretch of road: one highway out of town, then a fork for the north, a fork for the south, and so on. Each word in a trie is a route, and each character is a turn. Routes that begin the same way share the same road, and they only split where the words differ. A stop sign marks where a route can end. That sign matters because one stop can also be on the way to a farther one: the word `car` ends at a stop, and `card` and `care` carry on from it.',
      },
      {
        type: 'paragraph',
        text: 'The picture stops being honest in one place: on real roads, two routes can later meet again. In a trie, once two words split they never rejoin, because every node has exactly one parent.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'A trie is a tree (the Trees module) in which every node stands for one prefix. The **root** stands for the empty prefix. A node has two parts: a **Map from the next character to the child node**, and a flag, **`isWord`**, that says whether the prefix at this node is a complete word. We use a `Map` for the children rather than a plain object because it has no inherited keys to trip over (the Maps and Sets lesson explains why).',
      },
      {
        type: 'list',
        items: [
          '**Insert a word:** start at the root. For each character, follow the child for that character, or create it if it is missing. After the last character, set `isWord` on the node you stand on.',
          '**Search for a whole word:** walk the characters from the root. If a character has no child, the word is not stored. If you reach the end, the word is stored only if that node\'s `isWord` is true.',
          '**Check a prefix:** walk the same way. If you reach the end of the prefix, at least one stored word starts with it, whatever the flag says.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Why a separate flag? Because `ca` is a prefix of `car` but is not a word in our list, while `car` is both a word and a prefix of `card`. A node cannot tell these apart by having children or not. Only the flag says "a word ends here".',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The trie for car, card, care, cat and dog. Nodes marked "word" have isWord set. The shared path c, a holds four of the five words.',
        source: 'flowchart TD\n  R[root] --> C[c]\n  R --> D0[d]\n  C --> A[a]\n  A --> R1[r word]\n  A --> T[t word]\n  R1 --> D1[d word]\n  R1 --> E[e word]\n  D0 --> O[o]\n  O --> G[g word]',
      },
      {
        type: 'paragraph',
        text: 'Count the cost in steps. Each step of a walk is one `Map` lookup, which is average O(1) in the model of this course, and a walk takes one step per character. So insert, search and prefix check are all **O(L)**, where L is the length of the word or prefix, and **they do not depend on how many words the trie holds**. Be fair to the `Set`: to look up a string it must also read the whole string to hash it, so an exact-word lookup is also proportional to L in practice. The trie\'s real advantage is not exact lookups but everything about prefixes.',
      },
      {
        type: 'paragraph',
        text: 'The trie also stores less than it looks like. Those five words have 3 + 4 + 4 + 3 + 3 = 17 characters in total, but the trie needs only 9 character nodes (plus the root), because `c`, `a` and `r` are stored once and shared. The number of nodes is never more than the total number of characters, plus the root. How much memory that really is depends on what a node costs, which the next lesson weighs.',
      },
      { type: 'visual', id: 'trie-autocomplete', caption: 'Insert the words one by one and watch only the missing nodes appear. Then type a prefix and see which node you stand on when the prefix ends.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: picture a family tree of letters. The top is empty. Under it you hang the first letter of each word. Under each letter you hang the letters that can come next. A word is a path from the top, and we put a small flag on the letter where a word is complete. To check a word you follow its letters downwards; if you ever have to step onto a letter that is not there, the word is not in the list. To add a word you follow the same path and, wherever the next letter is missing, you add it. The code below keeps each letter\'s children in a `Map`, which is a lookup table from a letter to the next box.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: a node and the trie\'s `insert`. A class is a blueprint that creates objects with the same shape and methods; here it only keeps the root and the methods together. `for (const ch of word)` visits the characters of a string one at a time.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'A node and insert',
        code: `function createNode() {
  return { children: new Map(), isWord: false };
}

class Trie {
  constructor() {
    this.root = createNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, createNode());
      }
      node = node.children.get(ch);
    }
    node.isWord = true;
  }
}`,
      },
      { type: 'paragraph', text: 'Step 2: add the walk that search and the prefix check share. `findNode` returns the node where the text ends, or `null` if the walk falls off the trie. Then the two questions are one line each.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'findNode, search and startsWith (extends the class of step 1)',
        code: `class Trie {
  constructor() {
    this.root = createNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, createNode());
      }
      node = node.children.get(ch);
    }
    node.isWord = true;
  }

  findNode(text) {
    let node = this.root;
    for (const ch of text) {
      node = node.children.get(ch);
      if (node === undefined) return null;
    }
    return node;
  }

  search(word) {
    const node = this.findNode(word);
    return node !== null && node.isWord;
  }

  startsWith(prefix) {
    return this.findNode(prefix) !== null;
  }
}`,
      },
      { type: 'paragraph', text: 'Step 3: use it, and count the nodes with a short recursive function (recursion from the Recursion module: a node counts itself plus all its children\'s subtrees).' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Using the trie (continues step 2)',
        code: `const trie = new Trie();
for (const word of ['car', 'card', 'care', 'cat', 'dog']) {
  trie.insert(word);
}

console.log(trie.search('car')); // true
console.log(trie.search('ca')); // false: a prefix, not a word
console.log(trie.startsWith('ca')); // true
console.log(trie.search('cart')); // false
console.log(trie.startsWith('x')); // false

function countNodes(node) {
  let total = 1;
  for (const child of node.children.values()) {
    total += countNodes(child);
  }
  return total;
}

console.log(countNodes(trie.root)); // 10: nine characters plus the root`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** `insert` starts at the root and, for each character, creates a child only if `has` says it is missing, then moves onto the child. After the loop, `node` is the node for the whole word, so setting `isWord` there marks the end. Inserting a word that is already stored just sets the same flag again, so duplicates do no harm.',
          '**Step 2.** `findNode` walks the same way but never creates anything. `children.get(ch)` returns `undefined` for a missing character, which means the text is not in the trie, so it returns `null`. `search` is true only if the walk ended on a node that has `isWord`; `startsWith` is true as soon as the walk ended anywhere.',
          '**Step 3.** `car` ends on a node with the flag set, so `search` is true. `ca` ends on a node with no flag, so `search` is false but `startsWith` is true. `cart` falls off the trie at `t` under `car`. `countNodes` adds 1 for the node itself and the node counts of its children, and gives 10: the root and nine characters.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The `search` of `ca` traced step by step, so you can see where the answer comes from:',
      },
      {
        type: 'table',
        headers: ['Call', 'Walk', 'Ends on', 'isWord', 'Result'],
        rows: [
          ['search("car")', 'root, c, a, r', 'the r node', 'true', 'true'],
          ['search("ca")', 'root, c, a', 'the a node', 'false', 'false'],
          ['startsWith("ca")', 'root, c, a', 'the a node', 'not needed', 'true'],
          ['search("cart")', 'root, c, a, r, then t is missing', 'nowhere (null)', 'not needed', 'false'],
        ],
        caption: 'The two questions use the same walk. They differ only in what they ask at the end.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Storing children in a `Map` costs a per-node overhead, which is large in JavaScript, where each node is an object holding a `Map`. A fixed array of 26 slots makes lookups index-based and fast, but wastes space when most slots are empty and does not suit non-Latin alphabets. A **compressed** (radix) trie merges chains of single-child nodes into one edge labelled with a string, which cuts node counts for sparse word sets. Note that `for...of` over a string yields code points, not user-perceived characters, so an emoji with modifiers or a letter with a combining accent can span several steps; normalize text (for example lower-casing and `normalize()`) before inserting if the input is not plain ASCII. Deletion needs care: unset the flag, then prune nodes that have no children and no flag on the way back up, or the trie keeps dead branches.',
      },
      {
        type: 'warning',
        text: 'A word that is a prefix of another word, such as `car` and `card`, is the easy place to go wrong. If your `search` returns `node !== null` and forgets the flag, it will say that `ca` is a stored word. Always test with a word and its own prefix.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Trace the trie with me',
        text: 'I am learning tries in JavaScript. I will insert these words into an empty trie, in this order: tea, ten, to, ted. Do not draw the final trie for me. Ask me, one word at a time, which new nodes the insert creates, and tell me whether I am right. Then ask me how many nodes (not counting the root) the trie has and why it is fewer than the total number of letters. After that, ask me for the result of search("te"), startsWith("te") and search("ted"), and make me explain each answer.',
      },
      {
        type: 'paragraph',
        text: 'Check the assistant\'s statements against your own trace: `tea`, `ten`, `to` and `ted` have 3 + 3 + 2 + 3 = 11 letters but need only 6 nodes (`t`, `e`, `a`, `n`, `o`, `d`). An assistant may claim that `search("te")` is true because "te" starts several words. That is the prefix question, not the word question. It may also say a trie "uses less memory than a Set" in every case. That depends on how much the words overlap and on what a node costs.',
      },
      {
        type: 'takeaways',
        items: [
          'A trie stores words one character per node, so words with the same beginning share a path from the root. Every node holds a Map of children and an isWord flag.',
          'The flag is essential: ca is a prefix of car without being a word, and car is both a word and a prefix of card.',
          'Insert, search and prefix check are O(L), the length of the word, no matter how many words are stored.',
          'search asks "does a word end here?" (walk, then check isWord); startsWith asks "can the walk be completed?" (walk, check not null).',
          'The node count never exceeds the total number of characters plus the root, and is smaller when words share beginnings.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-41-predict-output-1',
          kind: 'predict-output',
          title: 'Words and prefixes',
          prompt: 'Predict the single line this program prints. Think about which calls ask for a whole word and which only ask for a prefix.',
          concept: 'trie search and prefix',
          language: 'javascript',
          code: `function createNode() {
  return { children: new Map(), isWord: false };
}

class Trie {
  constructor() {
    this.root = createNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, createNode());
      }
      node = node.children.get(ch);
    }
    node.isWord = true;
  }

  findNode(text) {
    let node = this.root;
    for (const ch of text) {
      node = node.children.get(ch);
      if (node === undefined) return null;
    }
    return node;
  }

  search(word) {
    const node = this.findNode(word);
    return node !== null && node.isWord;
  }

  startsWith(prefix) {
    return this.findNode(prefix) !== null;
  }
}

const trie = new Trie();
for (const word of ['tap', 'tape', 'tab']) {
  trie.insert(word);
}
console.log(trie.search('tap'), trie.search('ta'), trie.startsWith('ta'), trie.search('tapes'), trie.startsWith('tape'));`,
          expected: 'true false true false true',
          choices: ['true false true false true', 'true true true false true', 'true false true true true', 'false false true false false'],
          wrongNotes: {
            'true true true false true': 'search("ta") asks for a whole word, and only tap, tape and tab were inserted. The node for "ta" has no isWord flag.',
            'true false true true true': 'search("tapes") walks t, a, p, e and then has no s to follow, so the walk falls off the trie and the answer is false.',
            'false false true false false': 'tap was inserted, so search("tap") is true, and "tape" is a stored word, so startsWith("tape") is true.',
          },
          hints: [
            'Draw the trie: t, a, then p and b under a, then e under p. Mark p, e and b as words.',
            'search needs the flag; startsWith only needs the walk to succeed.',
            'For "tapes": after t, a, p, e there is no s, so the walk stops.',
          ],
          explanation: 'tap is stored (true). ta is a prefix but not a stored word (false), and it is a prefix (true). tapes would need a node for s after tape, which does not exist (false). tape is a stored word, so it is also a prefix (true).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-41-arrange-1',
          kind: 'arrange',
          title: 'Put insert in order',
          prompt: 'These lines insert the word cat into a trie and then check the result. Put them in the right order. The two lines that are just a closing brace are the same line; either order works.',
          concept: 'trie insert',
          language: 'javascript',
          solution: [
            'const root = { children: new Map(), isWord: false };',
            'let node = root;',
            "for (const ch of 'cat') {",
            '  if (!node.children.has(ch)) {',
            '    node.children.set(ch, { children: new Map(), isWord: false });',
            '  }',
            '  node = node.children.get(ch);',
            '}',
            'node.isWord = true;',
            "console.log(root.children.has('c'), node.isWord);",
          ],
          reasons: [
            'The root has to exist before anything can be walked.',
            'The walk starts at the root, so node must point at it before the loop.',
            'The loop visits the characters one at a time.',
            'First ask whether the next character already has a child.',
            'If not, create that child.',
            'This closes the if: creating happens only when the child is missing.',
            'Move onto the child, whether it was just made or was already there.',
            'This closes the loop.',
            'Only after the whole word is walked do we mark where it ends.',
            'Finally print a check: the c child exists and the last node is a word.',
          ],
          tests: { kind: 'output', expected: ['true true'] },
          hints: [
            'You need the root and the walking pointer before the loop starts.',
            'Inside the loop: create the child only if it is missing, then step onto it.',
            'The flag is set once, after the loop, on the last node.',
          ],
          explanation: 'Insert always has the same shape: start at the root, for each character create the missing child and step onto it, and after the loop mark the node you stand on as a word. Marking inside the loop would mark every prefix as a word.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-41-fix-bug-1',
          kind: 'fix-bug',
          title: 'The trie that finds words that were never added',
          prompt: 'This trie says that ca is a stored word, although only car and card were inserted. Tap the faulty line, then choose the fix.',
          concept: 'end-of-word flag',
          language: 'javascript',
          code: `function createNode() {
  return { children: new Map(), isWord: false };
}

const root = createNode();
for (const word of ['car', 'card']) {
  let node = root;
  for (const ch of word) {
    if (!node.children.has(ch)) {
      node.children.set(ch, createNode());
    }
    node = node.children.get(ch);
  }
  node.isWord = true;
}

function search(word) {
  let node = root;
  for (const ch of word) {
    node = node.children.get(ch);
    if (node === undefined) return false;
  }
  return true;
}

console.log(search('car'), search('ca'), search('cart'));`,
          bugLine: 23,
          fixes: [
            { line: '  return node.isWord;', correct: true, why: 'After a successful walk, the word is stored only if a word ends on that node, which is what the flag records.' },
            { line: '  return node.children.size === 0;', correct: false, why: 'A node with no children is a leaf. That is true for card but false for car, which has the child d, so a stored word would be reported missing.' },
            { line: '  return node !== undefined;', correct: false, why: 'node is never undefined here, because the loop already returned false when it was. This still says that every prefix is a word.' },
            { line: '  return node.isWord === false;', correct: false, why: 'That reverses the answer: it is true only for prefixes that are not words.' },
          ],
          lineNote: 'The loop is right: it walks and gives up when a character is missing. What does the function say once the walk has succeeded?',
          tests: { kind: 'output', expected: ['true false false'] },
          hints: [
            'The walk for "ca" succeeds, because c and a exist. Why is that not enough?',
            'A node can be on the way to a word without being the end of one. Which field records the end?',
            'Return the flag of the last node.',
          ],
          explanation: 'Reaching the end of the walk only proves that the text is a prefix of some word. To be a stored word it must also end on a node whose isWord is true. Without that check, search behaves like startsWith.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-41-code-challenge-1',
          kind: 'code-challenge',
          title: 'Build a trie from scratch',
          prompt: 'Complete the Trie class: insert(word) adds a word, search(word) is true only for a stored word, startsWith(prefix) is true when some stored word begins with the prefix. Walk character by character; do not use a Set or an array of all words. The function run is already written and calls your class.',
          concept: 'implementing a trie',
          language: 'javascript',
          starter: `function createNode() {
  return { children: new Map(), isWord: false };
}

class Trie {
  constructor() {
    this.root = createNode();
  }

  insert(word) {
    // walk the characters, create missing nodes, mark the last one
  }

  search(word) {
    // true only if this exact word was inserted
  }

  startsWith(prefix) {
    // true if any inserted word begins with prefix
  }
}

function run(words, queries) {
  const trie = new Trie();
  for (const word of words) trie.insert(word);
  return queries.map((query) => [trie.search(query), trie.startsWith(query)]);
}`,
          tests: {
            kind: 'function',
            fn: 'run',
            cases: [
              {
                label: 'car, card, care, cat, dog',
                args: [['car', 'card', 'care', 'cat', 'dog'], ['car', 'ca', 'card', 'cart', 'dog', 'do', 'd', 'x']],
                expected: [[true, true], [false, true], [true, true], [false, false], [true, true], [false, true], [false, true], [false, false]],
              },
              { label: 'an empty trie', args: [[], ['a']], expected: [[false, false]] },
              { label: 'the same word twice', args: [['tap', 'tap'], ['tap', 'ta', 'tape']], expected: [[true, true], [false, true], [false, false]] },
              {
                label: 'a hidden case with spaces and shared beginnings',
                args: [['instant coffee', 'instant noodles', 'iodized salt', 'instant'], ['instant', 'instant ', 'instant coffee', 'instant cof', 'ice', 'io']],
                expected: [[true, true], [false, true], [true, true], [false, true], [false, false], [false, true]],
                hidden: true,
              },
            ],
          },
          solution: `function createNode() {
  return { children: new Map(), isWord: false };
}

class Trie {
  constructor() {
    this.root = createNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, createNode());
      }
      node = node.children.get(ch);
    }
    node.isWord = true;
  }

  findNode(text) {
    let node = this.root;
    for (const ch of text) {
      node = node.children.get(ch);
      if (node === undefined) return null;
    }
    return node;
  }

  search(word) {
    const node = this.findNode(word);
    return node !== null && node.isWord;
  }

  startsWith(prefix) {
    return this.findNode(prefix) !== null;
  }
}

function run(words, queries) {
  const trie = new Trie();
  for (const word of words) trie.insert(word);
  return queries.map((query) => [trie.search(query), trie.startsWith(query)]);
}`,
          hints: [
            'search and startsWith both need the same walk. Write a helper findNode(text) that returns the last node, or null if a character is missing.',
            'insert: for each character, create the child if it is missing, then move onto it. Set isWord on the last node.',
            'search is findNode(word) !== null and the node has isWord; startsWith is just findNode(prefix) !== null.',
          ],
          explanation: 'All three methods walk the characters. insert creates what is missing and marks the end; search checks the walk succeeded and that a word ends there; startsWith only checks that the walk succeeded. Each costs O(L) for a word of length L.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-41-q1',
        prompt: 'The words to, tea, ten and ted are inserted into an empty trie. How many nodes does it have, not counting the root?',
        choices: ['4', '11', '9', '6'],
        answer: 3,
        explanation: 'The nodes are t, o, e, a, n and d: six. The words share t, and tea, ten and ted share te. The total number of letters is 2 + 3 + 3 + 3 = 11, but shared beginnings are stored once.',
      },
      {
        id: 'data-structures-algorithms-41-q2',
        prompt: 'Why does every trie node need an isWord flag instead of treating "has no children" as the end of a word?',
        choices: ["A word can end on a node that still has children, such as car on the way to card", "Children are kept in a Map, and a Map with no entries cannot be created for a node", "The flag makes each walk faster than checking whether a node has any children left", "Leaf nodes cannot be reached by a walk, so words could never end on them at all"],
        answer: 0,
        explanation: 'A word that is a prefix of a longer word ends in the middle of a path. Only a flag can say that car is a word although it has the child d. The other options are not true statements about tries.',
      },
      {
        id: 'data-structures-algorithms-41-q3',
        prompt: 'A trie holds 50,000 words. How does the cost of search("table") depend on the number of words?',
        choices: ["It grows with the number of words, so it is O(n) and gets slower as words are added", "It grows with the log of the number of words, as in a balanced search tree", "It does not depend on it: the walk takes one step per character of \"table\", so 5 steps", "It is O(1) for any word, because a Map is used and a Map lookup never takes more than one step"],
        answer: 2,
        explanation: 'The walk visits one node per character, so the cost is O(L). A longer word costs more steps, but a bigger trie does not.',
      },
      {
        id: 'data-structures-algorithms-41-q4',
        prompt: 'A school app must show every club name that starts with what the student has typed so far. A teammate suggests a Set of club names. What is the weakness of that choice?',
        choices: ["A Set cannot hold strings, so the club names would first have to be turned into numbers", "A Set only tests whole names, so a prefix query has to check every name in the set", "A Set loses the order of the names, so nothing can be shown to the student at all", "A Set lookup is O(n) even for exact names, because it scans the whole collection"],
        answer: 1,
        explanation: 'A Set answers "is this exact name present?". For "which start with ca?" it must look at all names. A trie walks to the prefix and reads what lies below it.',
      },
      {
        id: 'data-structures-algorithms-41-q5',
        audience: { max: 'beginner' },
        prompt: 'In a trie, what do the words "cat" and "car" have in common?',
        choices: ["They are stored in two separate lists that are joined together when a word is searched", "They are stored as one single word, because their first two letters are the same", "They must have the same flag value, because they share most of their letters", "They share the same path for \"ca\" and split only at the last letter"],
        answer: 3,
        explanation: 'Words that begin with the same letters share the beginning of their path. Only where the letters differ do the paths split.',
      },
      {
        id: 'data-structures-algorithms-41-q6',
        audience: { min: 'advanced' },
        prompt: 'A product catalogue has 2 million names in several languages. An engineer proposes a trie whose nodes hold a 26-slot array of children. What is the main problem?',
        choices: ["Arrays cannot be nested inside objects in JavaScript, so a node could not hold one", "The trie would then be slower than a Set even for exact look-ups, because arrays are always slower than a hash table", "Most slots stay empty and 26 slots cannot index non-Latin text; a Map per node or a compressed trie fits better", "A trie cannot hold more than a million words, because JavaScript limits the depth of such a tree"],
        answer: 2,
        explanation: 'A fixed array wastes memory when the alphabet is large and most children are absent, and it needs a mapping for every character used. A Map per node handles any character, and a radix trie merges long single-child chains to reduce node count.',
      },
    ],
    task: {
      title: 'Draw and count your own trie',
      minutes: 15,
      steps: [
        'Choose six words that share some beginnings (for example names of people in your family or places in your town). On paper, draw the trie: one circle per character, marking the circles where a word ends.',
        'Count the circles (not counting the root) and the total number of letters in the six words. Write down both numbers and what the difference tells you.',
        'In any free JavaScript environment, paste the Trie class and countNodes from this lesson, insert your six words, and check that the node count equals your drawing plus one for the root. Then try search and startsWith on a word, one of its prefixes, and a word that is not stored.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain, with your own six words, why search("ca") and startsWith("ca") can give different answers, then compare it with your drawing.'] },
      { audience: { min: 'advanced' }, steps: ['Add a delete(word) method that unsets the flag and prunes nodes that have no children and no flag on the way back up. Test deleting a word that is a prefix of another, and one that is not.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-42',
    day: 42,
    title: 'Prefix Matching and Autocomplete Systems',
    summary: 'Count the words under a prefix, collect them, rank the best few, and weigh a trie against a Set and a plain scan.',
    minutes: 28,
    skills: ['trees-heaps', 'choose-structure'],
    intro: {
      objectives: [
        'Count the words that start with a prefix without visiting them, by storing a count in each node',
        'Collect every word below a prefix with a recursive walk, then rank and limit the suggestions',
        'Compare a trie, a Set and a plain scan by counting the work for a prefix query',
        'Say when a trie\'s memory is worth paying for and when it is not',
      ],
      why: 'Autocomplete is one of the most visible uses of a data structure: a suggestion has to appear within a keystroke. Counting what each approach does shows you why a trie fits, and just as important, when a plain list is enough.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The last lesson answered "is this a word?" and "is this a prefix?". A search box needs more: given what the person has typed so far, show the few best words that could follow. That is **autocomplete**, and it is three small jobs on top of the trie: walk to the prefix, collect the words below it, and rank them. We also add a count to each node, so that "how many words start with this?" can be answered without visiting any of them. Finally we weigh the cost, because a trie is not free: it can use more memory than a plain list, and for a short list a plain scan is the better choice.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Imagine a sari-sari store with signs hanging over each aisle. A customer says "ins..." and the shop assistant walks straight to the aisle labelled with those letters. She does not look at every shelf in the store. Standing in the aisle, she can see every item that continues "ins...", and she offers the three that sell best. The aisle sign is the prefix, the aisle is the node you walk to, and the items on its shelves are the words below it.',
      },
      {
        type: 'paragraph',
        text: 'A real assistant knows the best sellers from memory. A trie only knows what you wrote into it, so we have to store a **score** (sales, searches, likes) with every word. And a real assistant stops at three items; the trie, as built below, first collects every item in the aisle and only then keeps the best few, which is slow for a huge aisle.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'list',
        items: [
          '**Walk to the prefix** (O(p) for a prefix of p characters). If the walk fails, there are no suggestions.',
          '**Count:** each node stores `count`, the number of words stored at or below it. Insert adds 1 to every node on the word\'s path, including the root. The number of words with a prefix is then the `count` of the node the prefix ends on: O(p) and no visiting of the words.',
          '**Collect:** from the prefix node, walk the whole subtree depth first (recursion). Pass the spelled-out text down, adding one character per step, and whenever a node has `isWord`, record the word. The cost is the number of nodes in that subtree.',
          '**Rank and limit:** every word\'s final node holds its score. Sort the collected words by score, highest first, break ties alphabetically so the order is stable between runs, and keep the first `limit`. Sorting m matches costs O(m log m); the built-in `sort` is used here as a black box, and the Sorting module explains how it works.',
          '**Normalize:** make both the stored words and the typed text lower case and trimmed, so that `Coffee` and `coffee ` are the same.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Where does the time go? For a long prefix, the subtree is small and everything is fast. For a one-letter prefix, the subtree may hold most of the catalogue, and collecting and sorting all of it for the sake of showing five names is wasteful. Real systems avoid this by keeping a short list of the best words at each node, or by keeping only the best `limit` while walking, with a size-limit heap as in the Heaps module. Both cost more code or more memory, and are worth it only when the catalogue is large.',
      },
      { type: 'visual', id: 'trie-autocomplete', caption: 'Type a prefix and watch the visual walk to its node. Then count how many words lie below that node, and compare it with the number of words a plain list would have to check.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: the count on each box says "this many words pass through me". Adding a word adds one to every box on its path, so the box for `in` always knows how many words start with `in`. To list the words, you stand on the `in` box and explore everything below it, spelling the word as you go down: each time you step to a child you add its letter to the text so far, and when you land on a box with a flag, that text is a complete word. Then you sort the list by the score and show the top few. The code below does exactly this in a method called `collect`, which calls itself for every child.',
      },
      {
        type: 'paragraph',
        text: 'Now the memory question, which is where claims go wrong. A `Set` of words stores each word as one string. A trie stores a node for every distinct prefix, and a node in JavaScript is an object holding a `Map` and a few fields, which is more than the single character it represents. So a trie can be **smaller** when many words share long beginnings (product names that all start with the same brand, or town names), because shared prefixes are stored once. It can be **bigger** when words hardly overlap (random codes), where nodes are about as many as characters and each is heavier. The honest answer is to count nodes and characters for your own data, as the code below does, and not to assume.',
      },
      {
        type: 'table',
        headers: ['Approach', 'Exact word look-up', 'All words with a prefix', 'Memory', 'Fits when'],
        rows: [
          ['Array and filter with startsWith', 'O(n), a scan', 'O(n) words checked each time', 'Just the words', 'A few hundred items, or a query now and then'],
          ['Set', 'Average O(1) per lookup in this course\'s model, plus reading the string', 'O(n): every word must be checked', 'Just the words', 'Only whole-word questions'],
          ['Trie', 'O(L)', 'O(p) to find, plus the size of the subtree to list', 'One node per distinct prefix, each heavier than a character', 'Large word sets and a query after every keystroke'],
        ],
        caption: 'n is the number of words, L the length of a word, p the length of the prefix.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: the trie with a count and a score on every node. `insert` first checks whether the word is already stored, so inserting it again only updates its score and never double-counts.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'A trie with counts and scores',
        code: `function createNode() {
  return { children: new Map(), isWord: false, count: 0, score: 0 };
}

class AutoTrie {
  constructor() {
    this.root = createNode();
  }

  findNode(text) {
    let node = this.root;
    for (const ch of text) {
      node = node.children.get(ch);
      if (node === undefined) return null;
    }
    return node;
  }

  insert(word, score = 0) {
    const text = word.trim().toLowerCase();
    const existing = this.findNode(text);
    if (existing !== null && existing.isWord) {
      existing.score = score;
      return;
    }
    let node = this.root;
    node.count += 1;
    for (const ch of text) {
      if (!node.children.has(ch)) {
        node.children.set(ch, createNode());
      }
      node = node.children.get(ch);
      node.count += 1;
    }
    node.isWord = true;
    node.score = score;
  }

  prefixCount(prefix) {
    const node = this.findNode(prefix.trim().toLowerCase());
    return node === null ? 0 : node.count;
  }
}`,
      },
      { type: 'paragraph', text: 'Step 2: add `collect` and `suggest` inside the same class. `collect` calls itself once for each child and carries the text spelled so far in `path`.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Collect and suggest (fragment: two more methods inside the class of step 1)',
        code: `  collect(node, path, results) {
    if (node.isWord) results.push({ word: path, score: node.score });
    for (const [ch, child] of node.children) {
      this.collect(child, path + ch, results);
    }
  }

  suggest(prefix, limit) {
    const text = prefix.trim().toLowerCase();
    const start = this.findNode(text);
    if (start === null) return [];
    const results = [];
    this.collect(start, text, results);
    results.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return a.word < b.word ? -1 : 1;
    });
    return results.slice(0, limit).map((item) => item.word);
  }`,
      },
      { type: 'paragraph', text: 'Step 3: a shop catalogue with units sold as the score. (The class from steps 1 and 2 is assumed above this code.)' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Using the AutoTrie (fragment: needs the class of steps 1 and 2)',
        code: `const shop = new AutoTrie();
const products = [
  ['Instant coffee', 120], ['Instant noodles', 95], ['Iodized salt', 40],
  ['Ice candy', 25], ['Insecticide', 5], ['Canned sardines', 70],
  ['Cooking oil', 60], ['Coconut milk', 15], ['Cola', 30],
];
for (const [name, sold] of products) {
  shop.insert(name, sold);
}

console.log(shop.suggest('in', 2)); // [ 'instant coffee', 'instant noodles' ]
console.log(shop.suggest('I', 3)); // [ 'instant coffee', 'instant noodles', 'iodized salt' ]
console.log(shop.suggest('co', 5)); // [ 'cooking oil', 'cola', 'coconut milk' ]
console.log(shop.suggest('zz', 5)); // []
console.log(shop.prefixCount('in'), shop.prefixCount('co'), shop.prefixCount('x')); // 3 3 0
shop.insert('instant coffee', 130);
console.log(shop.prefixCount('in')); // 3: re-inserting only updated the score`,
      },
      { type: 'paragraph', text: 'Step 4: measure. Generate 1,296 made-up words, store them, and count what a scan and a trie each do for the prefix `kora`.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Counting the work (fragment: needs the class of steps 1 and 2)',
        code: `const syllables = ['ba', 'ko', 'mi', 'ra', 'to', 'su'];
const pairs = [];
for (const a of syllables) {
  for (const b of syllables) pairs.push(a + b);
}
const generated = [];
for (const first of pairs) {
  for (const second of pairs) generated.push(first + second);
}

const big = new AutoTrie();
for (const word of generated) big.insert(word);

function countNodes(node) {
  let total = 1;
  for (const child of node.children.values()) total += countNodes(child);
  return total;
}

console.log(generated.length, generated.join('').length, countNodes(big.root)); // 1296 10368 3109
console.log(generated.filter((word) => word.startsWith('kora')).length); // 36 (a scan checks all 1296 words)
console.log(big.prefixCount('kora'), countNodes(big.findNode('kora'))); // 36 85`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** Every node has `count` and `score` as well as `isWord`. `insert` adds 1 to the root and to each node on the word\'s path, so each node\'s count is the number of words stored at or below it. The early `return` keeps a re-inserted word from being counted twice. Lower-casing and trimming happen once, at the door.',
          '**Step 2.** `collect(node, path, results)` first records the current word if the node ends one, then calls itself for each child with the child\'s letter added to `path`. When the recursion returns, `results` holds every word below the starting node. `suggest` then sorts by score, highest first, and by the word itself on ties, and keeps the first `limit`.',
          '**Step 3.** `in` leads to three words, and with limit 2 the two best sellers are returned. `I` is lower-cased to `i`, so five words match, and the best three are shown. For `co` the scores are 60, 30 and 15. The count of `x` is 0 because the walk fails. Re-inserting `instant coffee` with a new score leaves the count at 3.',
          '**Step 4.** The 1,296 words contain 10,368 characters in all, but the trie needs only 3,109 nodes, because the words are built from a few repeating syllables. A scan for `kora` checks all 1,296 words. The trie walks 4 nodes to reach the prefix and `prefixCount` answers 36 straight away. Listing the 36 words visits the 85 nodes below that point.',
        ],
      },
      {
        type: 'table',
        headers: ['What is done', 'Steps for the prefix kora, 1,296 words stored'],
        rows: [
          ['Array filter with startsWith', '1,296 words checked'],
          ['Trie: how many words start with kora?', '4 steps (the walk), using the stored count'],
          ['Trie: list them', '4 steps plus the 85 nodes below the prefix, then sorting the 36 matches'],
        ],
        caption: 'Counted from the code above. A scan always checks every word; the trie\'s work depends on the prefix and its matches, not on the size of the catalogue.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'The cost model here is only part of the engineering. Collect-then-sort makes the latency of a one-letter prefix proportional to the catalogue, so production autocomplete usually bounds it: a best-k heap while traversing with pruning when a subtree\'s best possible score cannot beat the current k-th, or precomputed top-k lists per node, which make a query O(p) at the price of O(k) extra entries per node and a more expensive update when a score changes. Rankings that depend on the user or on recent popularity do not fit a static score, so the trie often supplies candidates and a second stage ranks them. Insertions during reads need a concurrency story (immutable snapshots swapped atomically, or a rebuild). Always measure memory on real data: node objects with a Map each can cost more than the strings they replace.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Review a suggestion function',
        text: 'I wrote a JavaScript trie method suggest(prefix, limit) that walks to the prefix, collects every word below it recursively, sorts the matches by score and returns the first limit words. I will paste my code after this message. Do not rewrite it. First ask me what happens when the prefix is a single letter in a catalogue of two million products, and let me answer. Then list the edge cases I should test (empty prefix, prefix not found, prefix that is itself a word, limit of 0, upper-case letters) and ask me what each should return. Finally tell me the time complexity of each step and ask me to say which step dominates for a short prefix.',
      },
      {
        type: 'paragraph',
        text: 'Paste your own `suggest` after the prompt. A good review mentions that for a one-letter prefix collecting and sorting everything dominates, and suggests a bounded approach. Watch for these common mistakes in an assistant\'s answer: saying that autocomplete on a trie is "O(1)" (it is O(p) to reach the prefix, plus the matches), claiming the trie always uses less memory than a Set, or forgetting that the prefix itself may be a word that belongs in the results.',
      },
      {
        type: 'takeaways',
        items: [
          'Autocomplete on a trie is: walk to the prefix (O(p)), collect the words below it with a recursive walk that carries the spelled text, then rank by a stored score and keep the best few.',
          'A count stored in each node, maintained by insert, answers "how many words start with this prefix?" in O(p) without visiting a single word.',
          'Collecting costs the size of the subtree, so a short prefix over a big catalogue is expensive; bound it with a best-k heap, or keep a short top list in each node.',
          'A trie wins when many words share beginnings and prefix queries are frequent. A Set or a plain filter is better for exact-only questions or a few hundred items.',
          'Count nodes against characters for your own data before claiming a trie saves memory: a node is heavier than a character.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-42-predict-output-1',
          kind: 'predict-output',
          title: 'Count and suggest',
          prompt: 'Four words with scores are inserted. Predict the four lines. For the second line, remember the order: highest score first, and alphabetical when scores tie.',
          concept: 'prefix count and ranked suggestions',
          language: 'javascript',
          code: `function createNode() {
  return { children: new Map(), isWord: false, count: 0, score: 0 };
}

class AutoTrie {
  constructor() {
    this.root = createNode();
  }

  findNode(text) {
    let node = this.root;
    for (const ch of text) {
      node = node.children.get(ch);
      if (node === undefined) return null;
    }
    return node;
  }

  insert(word, score) {
    let node = this.root;
    node.count += 1;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, createNode());
      }
      node = node.children.get(ch);
      node.count += 1;
    }
    node.isWord = true;
    node.score = score;
  }

  prefixCount(prefix) {
    const node = this.findNode(prefix);
    return node === null ? 0 : node.count;
  }

  collect(node, path, results) {
    if (node.isWord) results.push({ word: path, score: node.score });
    for (const [ch, child] of node.children) {
      this.collect(child, path + ch, results);
    }
  }

  suggest(prefix, limit) {
    const start = this.findNode(prefix);
    if (start === null) return [];
    const results = [];
    this.collect(start, prefix, results);
    results.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return a.word < b.word ? -1 : 1;
    });
    return results.slice(0, limit).map((item) => item.word);
  }
}

const trie = new AutoTrie();
for (const [word, score] of [['cap', 5], ['cape', 9], ['cat', 9], ['car', 1]]) {
  trie.insert(word, score);
}
console.log(trie.prefixCount('ca'));
console.log(trie.suggest('ca', 3).join(' '));
console.log(trie.prefixCount('cap'));
console.log(trie.suggest('x', 3).length);`,
          expected: '4\ncape cat cap\n2\n0',
          choices: ['4\ncape cat cap\n2\n0', '4\ncap cape cat\n2\n0', '4\ncape cat cap\n1\n0', '3\ncape cat cap\n2\nundefined'],
          wrongNotes: {
            '4\ncap cape cat\n2\n0': 'That is the order the words are found in the trie, not the ranked order. The results are sorted by score first: cape and cat have 9, cap has 5.',
            '4\ncape cat cap\n1\n0': 'The node for "cap" has count 2 because two stored words pass through it: cap itself and cape.',
            '3\ncape cat cap\n2\nundefined': 'All four words start with "ca", so its count is 4. A failed suggestion returns an empty array, whose length is 0.',
          },
          hints: [
            'Draw the trie: c, a, then p (word) with e under it, then r (word) and t (word) under a.',
            'The count of a node is the number of words at or below it. How many words pass through "cap"?',
            'Sorted by score: cape (9) and cat (9) tie, so alphabetical puts cape first; then cap (5); car (1) is cut off by the limit of 3.',
          ],
          explanation: 'All four words pass through ca, so its count is 4. cap and cape pass through cap, so 2. The matches sorted by score are cape (9), cat (9, after cape alphabetically), cap (5) and car (1); the limit of 3 drops car. A prefix that is not found returns an empty array, with length 0.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-42-fix-bug-1',
          kind: 'fix-bug',
          title: 'Suggestions with missing beginnings',
          prompt: 'The program should print every stored word that starts with ca, spelled in full: cap cape cat. It prints only fragments. Tap the faulty line, then choose the fix.',
          concept: 'collecting words with recursion',
          language: 'javascript',
          code: `function createNode() {
  return { children: new Map(), isWord: false };
}

const root = createNode();
for (const word of ['cap', 'cape', 'cat', 'dog']) {
  let node = root;
  for (const ch of word) {
    if (!node.children.has(ch)) {
      node.children.set(ch, createNode());
    }
    node = node.children.get(ch);
  }
  node.isWord = true;
}

function collect(node, path, results) {
  if (node.isWord) results.push(path);
  for (const [ch, child] of node.children) {
    collect(child, ch, results);
  }
}

const start = root.children.get('c').children.get('a');
const results = [];
collect(start, 'ca', results);
console.log(results.join(' '));`,
          bugLine: 20,
          fixes: [
            { line: '    collect(child, path + ch, results);', correct: true, why: 'Each step down adds the child\'s letter to the text spelled so far, so the word is complete when a flagged node is reached.' },
            { line: '    collect(child, path, results);', correct: false, why: 'The text never grows, so every word found would be recorded as just "ca".' },
            { line: '    collect(child, ch + path, results);', correct: false, why: 'The letters are added on the wrong side, so cap would come out as "pca".' },
            { line: '    collect(child, path + child, results);', correct: false, why: 'child is a node object, not a letter, so the text would contain "[object Object]".' },
          ],
          lineNote: 'The traversal itself is right. Look at what is passed down as the second argument: what should it hold at each level?',
          tests: { kind: 'output', expected: ['cap cape cat'] },
          hints: [
            'The second parameter is supposed to be the word spelled so far. What does the call pass for the child?',
            'Moving to a child should extend the text with that child\'s letter.',
            'Pass path + ch.',
          ],
          explanation: 'The recursion carries the spelled-out text down with it. Passing just ch forgets everything before the last letter. With path + ch, the text at the node for cap is ca + p = cap, and at the node for cape it is cap + e = cape.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-42-match-1',
          kind: 'match',
          title: 'Pick the structure for each feature',
          prompt: 'Match each feature to the structure that fits it best, counting the work each would do.',
          concept: 'choosing between a trie, a Set, a Map and a plain scan',
          labels: { terms: 'Feature', meanings: 'Best-fitting structure' },
          pairs: [
            { term: 'Check whether a username is taken, once per sign-up', definition: 'A Set of usernames', note: 'Only a whole-word question: a Set answers it directly.' },
            { term: 'Show the top 5 product names after every keystroke, over 100,000 products', definition: 'A trie with a score on each word', note: 'Prefix queries repeated on a large word set are what a trie is for.' },
            { term: 'Count how many orders each barangay has', definition: 'A Map from barangay to a count', note: 'It is counting by key; a Map does that directly.' },
            { term: 'A contact search that runs when the person presses Search, over 40 contacts', definition: 'A plain array and a startsWith filter', note: 'Forty items cost almost nothing to scan, so a trie would be extra code and memory for no gain.' },
          ],
          hints: [
            'Ask for each: is it a whole-word question, a prefix question, a counting question, or a tiny list?',
            'The trie only earns its place when prefix questions are frequent and the word set is large.',
            'Two of the four need no special structure at all beyond a Set or a Map.',
          ],
          explanation: 'Whole-word membership is a Set, counting by key is a Map, prefix queries after every keystroke on a big catalogue are a trie, and a handful of contacts searched occasionally is not worth a structure at all.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-42-code-challenge-1',
          kind: 'code-challenge',
          title: 'List every word under a prefix',
          prompt: 'The Trie class below already has insert and findNode. Write listWords(trie, prefix): every stored word that starts with the prefix, in alphabetical order, or an empty array if there is none. Walk the trie below the prefix with a recursive helper; do not keep a separate array of all the words. The function run is already written.',
          concept: 'collecting words below a prefix',
          language: 'javascript',
          starter: `function createNode() {
  return { children: new Map(), isWord: false };
}

class Trie {
  constructor() {
    this.root = createNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, createNode());
      }
      node = node.children.get(ch);
    }
    node.isWord = true;
  }

  findNode(text) {
    let node = this.root;
    for (const ch of text) {
      node = node.children.get(ch);
      if (node === undefined) return null;
    }
    return node;
  }
}

function listWords(trie, prefix) {
  // find the prefix node, collect every word below it, return them sorted
}

function run(words, prefix) {
  const trie = new Trie();
  for (const word of words) trie.insert(word);
  return listWords(trie, prefix);
}`,
          tests: {
            kind: 'function',
            fn: 'run',
            cases: [
              { label: 'ca in car, card, care, cat, dog', args: [['car', 'card', 'care', 'cat', 'dog'], 'ca'], expected: ['car', 'card', 'care', 'cat'] },
              { label: 'a prefix that is also a word', args: [['car', 'card', 'care', 'cat', 'dog'], 'card'], expected: ['card'] },
              { label: 'a prefix that is not found', args: [['car', 'card', 'care', 'cat', 'dog'], 'x'], expected: [] },
              { label: 'the empty prefix lists everything', args: [['dog', 'car', 'cat'], ''], expected: ['car', 'cat', 'dog'] },
              {
                label: 'a hidden case with spaces',
                args: [['instant noodles', 'iodized salt', 'ice candy', 'insecticide', 'instant coffee', 'canned sardines'], 'in'],
                expected: ['insecticide', 'instant coffee', 'instant noodles'],
                hidden: true,
              },
            ],
          },
          solution: `function createNode() {
  return { children: new Map(), isWord: false };
}

class Trie {
  constructor() {
    this.root = createNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, createNode());
      }
      node = node.children.get(ch);
    }
    node.isWord = true;
  }

  findNode(text) {
    let node = this.root;
    for (const ch of text) {
      node = node.children.get(ch);
      if (node === undefined) return null;
    }
    return node;
  }
}

function collect(node, path, results) {
  if (node.isWord) results.push(path);
  for (const [ch, child] of node.children) {
    collect(child, path + ch, results);
  }
}

function listWords(trie, prefix) {
  const start = trie.findNode(prefix);
  if (start === null) return [];
  const results = [];
  collect(start, prefix, results);
  return results.sort();
}

function run(words, prefix) {
  const trie = new Trie();
  for (const word of words) trie.insert(word);
  return listWords(trie, prefix);
}`,
          hints: [
            'First find the node where the prefix ends with trie.findNode(prefix). If it is null, return an empty array.',
            'Write collect(node, path, results): if the node is a word, push path; then call collect for every child with path + the child\'s letter.',
            'Start the recursion with the prefix as the path, and return results.sort() so the words come out alphabetically.',
          ],
          explanation: 'The prefix node is the root of the subtree that holds all the answers. A depth-first walk carrying the spelled text finds every word in it. Because Map children are in insertion order, not alphabetical order, the final sort makes the result predictable. The work is O(p) plus the size of the subtree.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-42-q1',
        prompt: 'A trie stores a count in every node. How many steps does it take to find how many stored words start with a prefix of length p?',
        choices: ["p steps to walk to the prefix node, then read its count", "One step, since the total count is kept at the root and covers every prefix", "As many steps as there are words below the prefix, because each one must be counted", "p times the number of words stored, since each word is compared with the prefix"],
        answer: 0,
        explanation: 'The walk follows one node per character. The prefix node\'s count already says how many words lie at or below it, so no word is visited.',
      },
      {
        id: 'data-structures-algorithms-42-q2',
        prompt: 'A product search suggests names after each keystroke. With one letter typed, it feels slow, but with five letters it is fast. Why?',
        choices: ["The trie is rebuilt from scratch whenever fewer letters are typed, which takes time", "Sorting is slower for single letters than for words, since there are fewer distinct keys", "The walk to the prefix node takes longer for short prefixes because the root has most children", "A short prefix has a huge subtree, so collecting and sorting its matches costs far more"],
        answer: 3,
        explanation: 'The walk is cheap whatever the prefix. What grows is the number of matches that have to be collected and ranked, which is large for one letter and small for five.',
      },
      {
        id: 'data-structures-algorithms-42-q3',
        prompt: 'A developer says "a trie always uses less memory than a Set of the same words". What is the best response?',
        choices: ["True, because shared beginnings are stored only once and a node is the same size as a character", "False in general: it depends on how much words overlap and what a node costs, so measure", "True, but only for words shorter than five letters, where the sharing is largest", "False, because a Set stores nothing except references to strings that live somewhere else"],
        answer: 1,
        explanation: 'Overlapping names save nodes, but every node is an object with a Map. For words that hardly share beginnings, the trie can use more, so the claim has to be measured.',
      },
      {
        id: 'data-structures-algorithms-42-q4',
        prompt: 'Why does the AutoTrie lower-case and trim a word both when inserting it and when searching for a prefix?',
        choices: ["It makes the trie smaller than any other structure that could hold the same words", "Lower-casing is required by Map, which refuses to store keys that contain capitals", "So \"Coffee\", \"coffee\" and \"coffee \" lead to the same path, not to different ones", "So that the count stored in every node stays at zero until a word is searched for"],
        answer: 2,
        explanation: 'A trie compares characters exactly. Without normalizing, a customer typing "coffee" would not find a product stored as "Coffee". Normalizing at both doors makes the two agree.',
      },
      {
        id: 'data-structures-algorithms-42-q5',
        audience: { max: 'beginner' },
        prompt: 'In the AutoTrie, what does the count on the box for "in" tell you?',
        choices: ["How many words start with \"in\"", "How many letters the word \"in\" has", "How many times someone typed \"in\"", "How many boxes are below the root"],
        answer: 0,
        explanation: 'Every word that starts with "in" passes through that box when it is inserted, adding one each time, so the count is the number of words with that beginning.',
      },
      {
        id: 'data-structures-algorithms-42-q6',
        audience: { min: 'advanced' },
        prompt: 'An autocomplete service must answer in a few milliseconds for a 3-million-entry catalogue, and a one-letter prefix is common. Which design best fits?',
        choices: ["Collect every match under the prefix and sort all of them from scratch on every single keystroke, then cut the list", "Store a precomputed top-k list at each node, so a query is a walk plus k reads, refreshed when scores change", "Replace the trie with a Set of names, because Set look-ups are average O(1) per name", "Scan the whole array of names with startsWith on every keystroke and keep the first few"],
        answer: 1,
        explanation: 'Per-node top-k lists make a query O(p + k) regardless of the subtree size, at the cost of extra memory and more work on updates. Collect-and-sort or a scan costs time proportional to the number of matches or of names, and a Set cannot answer prefix questions.',
      },
    ],
    task: {
      title: 'Autocomplete for your own list',
      minutes: 20,
      steps: [
        'Write down 10 items from your own life with a number for each (songs and times played, foods and times eaten, places and visits). Give some of them the same first letters.',
        'In any free JavaScript environment, paste the AutoTrie class from steps 1 and 2, insert your items with their numbers, and call suggest with three prefixes: a single letter, a longer prefix, and one that matches nothing. Predict each result on paper first.',
        'Call prefixCount for the same prefixes and check that it equals the number of items you expect. Then insert one of your items again with a different number and confirm that the count does not change while the ranking does.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain, in plain words and using your own items, why prefixCount does not need to look at the words themselves.'] },
      { audience: { min: 'advanced' }, steps: ['Make suggest keep only the best `limit` matches while it walks (a best-k structure from the Heaps module instead of collecting and sorting everything), and compare the number of results held in memory for a one-letter prefix on 1,296 generated words.'] },
    ],
  },
  {
    id: 'data-structures-algorithms-43',
    day: 43,
    title: 'Union-Find and Choosing Specialized Data Structures',
    summary: 'Track groups that keep merging with a parent array, and learn a rule for deciding when a heap, trie or union-find earns its place over a plain array, Map or Set.',
    minutes: 30,
    skills: ['trees-heaps', 'choose-structure'],
    intro: {
      objectives: [
        'Explain how union-find represents groups as a forest in a parent array, and trace find and union',
        'Describe what path compression and union by size each prevent',
        'State the cost of union-find honestly, as amortized and nearly constant',
        'Apply a rule for choosing a specialized structure only when counting shows a plain one is too slow',
      ],
      why: 'Heaps, tries and union-find are powerful, and an AI assistant will sometimes reach for one when a plain list would do. Knowing what question each one answers, and what the plain version costs, lets you accept or reject its choice with a reason.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Some questions are about **groups that keep merging**. Two people in a social app become friends: are these two now in the same circle of friends? Two offices are joined by a new cable: are they on the same network? A map app learns about a new road: are these two towns connected at all? Each time, groups only join, and we ask, over and over, "are A and B in the same group?" **Union-find**, also called a disjoint-set structure, answers that with two operations: **find** (which group is this item in?) and **union** (merge two groups). In this lesson we build it, see why a naive version can go slow, and fix it with two small ideas. Then we step back and ask the question that matters most for a working developer: when does a specialized structure like this one, or a heap or a trie, really earn its place?',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Picture clubs in a school. Every club has a leader, and every member knows the person they report to; a leader reports to nobody (in our code, to themselves). To find out whether two students are in the same club, follow each student\'s chain of "who do you report to?" up to a leader and compare the two leaders. To merge two clubs, one leader simply starts reporting to the other. Nothing else changes, and nobody has to be told. The picture is honest about the idea and wrong about one thing: a real club can split again, but union-find can never split a group. It only merges.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'The obvious first idea is an array `group` where `group[i]` names the group of item `i`. Checking two items is one comparison, O(1). But merging two groups means relabelling every member of one of them, which can touch n entries: O(n) per merge. With thousands of merges, that adds up.',
      },
      {
        type: 'paragraph',
        text: 'Union-find stores a **`parent` array** instead. Item `i` points to `parent[i]`. An item whose parent is itself is a **root**, and the root is the group\'s representative (the club leader). **`find(x)`** follows parent links until it reaches a root. **`union(a, b)`** finds both roots and, if they differ, makes one root the parent of the other. Merging is now one assignment after two finds. The groups are a **forest**: a set of trees, one per group, in a plain array.',
      },
      {
        type: 'paragraph',
        text: 'Done naively, this has a flaw. If each union hangs the first group under the second one, a run of unions can build a long chain, and then `find` walks a long way. With 8 items, 7 such unions make a chain, and finding the root of the first item takes 7 hops, which in general is O(n). Two small fixes cure it:',
      },
      {
        type: 'list',
        items: [
          '**Union by size:** keep each root\'s group size, and always hang the **smaller** tree under the **larger** root. A tree then grows deeper only when it merges with one as big as itself, so its depth stays at about log n at most.',
          '**Path compression:** while `find` walks up from `x` to the root, point every item it passes **directly at the root**. The next `find` from any of them takes one hop. It costs nothing extra, because `find` was walking that path anyway.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Together the two fixes make a sequence of operations cost **nearly constant time each, amortized**. The exact bound uses the inverse Ackermann function, written α(n), which grows so slowly that for any input that could ever fit in a computer it is a tiny number (at most 4 or 5). So "practically O(1)" is a fair description, but not "exactly O(1)", and it is an amortized cost over many operations, not a promise for every single call.',
      },
      { type: 'visual', id: 'union-find', caption: 'Press Next through a few unions and watch the parent array change. Then run a find on a deep item and watch path compression flatten its path.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: every item keeps a note saying "my boss is..." and a boss is someone whose note points at themselves. To check whether two items are together, you follow each item\'s notes up to the top boss and compare the two bosses. To join two groups, one top boss writes the other top boss on their note. Joining the smaller group under the bigger one keeps the chains of notes short, and every time you follow a chain you can rewrite the notes on the way so they point straight at the top boss. Then the next trip is one step. The code below keeps the notes in an array called `parent`.',
      },
      { type: 'heading', text: 'See it in code' },
      { type: 'paragraph', text: 'Step 1: the naive version, to see the flaw. A counter `hops` counts the links `find` follows. Seven unions in this order build a chain.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Union-find without the two fixes',
        code: `const parent = [0, 1, 2, 3, 4, 5, 6, 7];
let hops = 0;

function find(x) {
  while (parent[x] !== x) {
    x = parent[x];
    hops += 1;
  }
  return x;
}

function union(a, b) {
  const rootA = find(a);
  const rootB = find(b);
  if (rootA !== rootB) parent[rootB] = rootA;
}

for (let i = 1; i < 8; i++) {
  union(i, i - 1);
}
console.log(parent.join(' ')); // 1 2 3 4 5 6 7 7
hops = 0;
const root = find(0);
console.log(root, hops); // 7 7`,
      },
      { type: 'paragraph', text: 'Step 2: the full class with both fixes, and the same seven unions. `groups` counts the groups left and drops by one for every successful merge.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'UnionFind with path compression and union by size',
        code: `class UnionFind {
  constructor(n) {
    this.parent = [];
    this.size = [];
    for (let i = 0; i < n; i++) {
      this.parent.push(i);
      this.size.push(1);
    }
    this.groups = n;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(a, b) {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false;
    if (this.size[rootA] < this.size[rootB]) {
      const temp = rootA;
      rootA = rootB;
      rootB = temp;
    }
    this.parent[rootB] = rootA;
    this.size[rootA] += this.size[rootB];
    this.groups -= 1;
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

const balanced = new UnionFind(8);
for (let i = 1; i < 8; i++) {
  balanced.union(i, i - 1);
}
console.log(balanced.parent.join(' ')); // 1 1 1 1 1 1 1 1`,
      },
      { type: 'paragraph', text: 'Step 3: eight people and seven friend pairs. The loop prints each pair, whether it merged two groups, the number of groups left, and the parent array.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Friend circles (continues step 2)',
        code: `const friends = new UnionFind(8);
const pairs = [[0, 1], [2, 3], [1, 3], [4, 5], [6, 7], [5, 7], [0, 2]];
for (const [a, b] of pairs) {
  const merged = friends.union(a, b);
  console.log(a, b, merged, friends.groups, friends.parent.join(' '));
}
// 0 1 true 7 0 0 2 3 4 5 6 7
// 2 3 true 6 0 0 2 2 4 5 6 7
// 1 3 true 5 0 0 0 2 4 5 6 7
// 4 5 true 4 0 0 0 2 4 4 6 7
// 6 7 true 3 0 0 0 2 4 4 6 6
// 5 7 true 2 0 0 0 2 4 4 4 6
// 0 2 false 2 0 0 0 2 4 4 4 6
console.log(friends.connected(0, 3), friends.connected(0, 4), friends.connected(4, 7)); // true false true

const chain = new UnionFind(6);
chain.parent = [0, 0, 1, 2, 3, 4]; // a long chain, set by hand to watch compression
console.log(chain.find(5)); // 0
console.log(chain.parent.join(' ')); // 0 0 0 0 0 0`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** Each `union(i, i - 1)` finds the root of `i` (itself) and the root of the chain built so far, and hangs that root under `i`. After seven unions the array reads `1 2 3 4 5 6 7 7`: 0 points to 1, which points to 2, and so on up to 7, the only root. `find(0)` follows seven links, so the cost grew with n.',
          '**Step 2.** `find` is recursive: if `x` is not a root, it asks its parent for the root and then **stores that root as its own parent**, which is path compression. `union` finds both roots, stops if they are equal, swaps them if needed so the bigger group\'s root becomes the parent, and updates the size and the group count. The same seven unions now give `1 1 1 1 1 1 1 1`: one hop from anywhere.',
          '**Step 3.** The table below follows the pairs. When the pair `(0, 2)` arrives, both already share a root, so `union` returns `false` and nothing changes. The last lines build a chain by hand: `find(5)` walks 5, 4, 3, 2, 1 up to 0, and on the way back every item stores 0 as its parent, so the next `find` is one hop.',
        ],
      },
      {
        type: 'table',
        headers: ['Pair', 'Roots found', 'What happens', 'Groups left', 'Parent array after'],
        rows: [
          ['(0, 1)', '0 and 1', '1 joins under 0', '7', '0 0 2 3 4 5 6 7'],
          ['(2, 3)', '2 and 3', '3 joins under 2', '6', '0 0 2 2 4 5 6 7'],
          ['(1, 3)', '0 and 2', 'same size, so 2 joins under 0', '5', '0 0 0 2 4 5 6 7'],
          ['(4, 5)', '4 and 5', '5 joins under 4', '4', '0 0 0 2 4 4 6 7'],
          ['(6, 7)', '6 and 7', '7 joins under 6', '3', '0 0 0 2 4 4 6 6'],
          ['(5, 7)', '4 and 6', 'same size, so 6 joins under 4', '2', '0 0 0 2 4 4 4 6'],
          ['(0, 2)', '0 and 0', 'already in one group: nothing changes', '2', '0 0 0 2 4 4 4 6'],
        ],
        caption: 'The friend circles, one pair at a time. Two groups remain: {0, 1, 2, 3} and {4, 5, 6, 7}.',
      },
      { type: 'heading', text: 'Choosing a specialized structure' },
      {
        type: 'paragraph',
        text: 'You have now met three structures built for one question each. Each is excellent at that question and ordinary at everything else. The mistake to avoid is reaching for one because it sounds clever. A plain array, Map or Set is simpler to write, to read and to test, and for many programs it is fast enough.',
      },
      {
        type: 'table',
        headers: ['Structure', 'The question it answers', 'Its cost', 'The plain way, and its cost'],
        rows: [
          ['Heap (priority queue)', 'Which item is the most urgent right now?', 'O(1) peek, O(log n) insert and remove', 'Scan an unsorted array: O(n) per pick; or keep it sorted: O(n) per insert'],
          ['Trie', 'Which stored words start with this prefix?', 'O(p) to reach the prefix, plus the matches', 'Check every word with startsWith: O(n) words per query'],
          ['Union-find', 'After many merges, are a and b in the same group?', 'Amortized, nearly constant per operation', 'Relabel a group array: O(n) per merge'],
          ['Map or Set', 'Is this key or value present? What belongs to this key?', 'Average O(1) per operation', 'Scan an array: O(n)'],
        ],
        caption: 'Four structures, four questions. A specialized one is the answer to a question that your program asks again and again.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'A rule for choosing. The plain version is the default, and counting is what moves you off it.',
        source: 'flowchart TD\n  A(Start with the plain version) --> B[Count its operations for your real sizes]\n  B --> C{Is the count small enough?}\n  C -->|yes| D(Stop: keep the plain version)\n  C -->|no| E[Name the question your code asks again and again]\n  E --> F{Which question is it?}\n  F -->|most urgent item| G[Heap]\n  F -->|words with a prefix| H[Trie]\n  F -->|same group after merges| I[Union-find]\n  F -->|something else| J[Look at a Map index or another structure]',
      },
      {
        type: 'paragraph',
        text: 'The same rule is how you review an AI assistant\'s answer. If it proposes a trie, ask: what question does it answer, how many words are there, how often is the question asked, and what would a filter over a plain array cost for those sizes? If the answers are "a few dozen words, once in a while", the plain version wins. If they are "two million words, after every keystroke", the trie is justified. A specialized structure also has to be tested against the plain version: both should give the same answers on the same input, and that comparison is a cheap, strong test.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Two cautions from production. First, the amortized bound of union-find hides the cost of an occasional deeper `find`, and recursive `find` can hit a stack limit on a long chain; production code often uses an iterative find with path halving, and union by size or rank keeps depth logarithmic even without compression. Union-find cannot delete or split, so a use that needs "remove this friendship" needs another design (rebuild, or an offline algorithm). Second, specialized structures raise the maintenance cost: more code to test, more state to keep consistent (a count in a trie node, a size array), and more places for an AI-generated edit to break an invariant. The better habit is to keep the plain implementation as a test oracle and to put the specialized one behind a small interface (`connected`, `suggest`, `pop`) so that it can be swapped.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Challenge the structure choice',
        text: 'I am building a small feature in JavaScript and an AI assistant suggested a specialized data structure for it (a heap, a trie or union-find). I will describe the feature, the number of items and how often each operation runs. Do not choose for me. Ask me what question the code asks again and again, what the plain array, Map or Set version would cost for my numbers, and at what size the plain version stops being acceptable. Then ask me to state my own choice and one reason before you give an opinion, and point out anything my reasoning missed.',
      },
      {
        type: 'paragraph',
        text: 'State your numbers honestly (for example 300 contacts searched once a minute, or 2 million names searched on every keystroke). A trustworthy answer compares costs for those numbers instead of saying that one structure is "better". Be careful of an assistant that claims union-find is O(1) (it is amortized and nearly constant), that a trie is always faster than a filter (not for 300 names), or that a heap can look up an item by id quickly (it cannot).',
      },
      {
        type: 'takeaways',
        items: [
          'Union-find keeps groups that only merge in a parent array: find follows parents to a root, union attaches one root under another, and a root is its own parent.',
          'Union by size (hang the smaller tree under the larger root) and path compression (point visited items straight at the root) keep the trees flat: the cost per operation is amortized and nearly constant, not exactly O(1).',
          'Union-find answers "same group?" and "how many groups?" but cannot split a group or list its members cheaply.',
          'A heap answers "which item is the most urgent?", a trie answers "which words start with this?", and union-find answers "are these two connected?". A plain array, Map or Set answers everything else.',
          'Choose by counting: write the plain version, count its operations for your real sizes and frequencies, and move to a specialized structure only when the count is too high.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-43-predict-output-1',
          kind: 'predict-output',
          title: 'Watch the parent array change',
          prompt: 'Predict the four lines. Pay attention to the fourth: what does the find at the end do to the array?',
          concept: 'union by size and path compression',
          language: 'javascript',
          code: `class UnionFind {
  constructor(n) {
    this.parent = [];
    this.size = [];
    for (let i = 0; i < n; i++) {
      this.parent.push(i);
      this.size.push(1);
    }
    this.groups = n;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(a, b) {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false;
    if (this.size[rootA] < this.size[rootB]) {
      const temp = rootA;
      rootA = rootB;
      rootB = temp;
    }
    this.parent[rootB] = rootA;
    this.size[rootA] += this.size[rootB];
    this.groups -= 1;
    return true;
  }
}

const uf = new UnionFind(6);
for (const [a, b] of [[0, 1], [2, 3], [4, 5], [1, 3], [5, 3]]) {
  uf.union(a, b);
}
console.log(uf.parent.join(' '));
console.log(uf.groups);
console.log(uf.find(5), uf.find(4));
console.log(uf.parent.join(' '));`,
          expected: '0 0 0 0 0 4\n1\n0 0\n0 0 0 0 0 0',
          choices: ['0 0 0 0 0 4\n1\n0 0\n0 0 0 0 0 0', '0 0 0 0 0 0\n1\n0 0\n0 0 0 0 0 0', '0 0 2 2 4 4\n3\n0 0\n0 0 0 0 0 0', '0 0 0 0 0 4\n1\n0 0\n0 0 0 0 0 4'],
          wrongNotes: {
            '0 0 0 0 0 0\n1\n0 0\n0 0 0 0 0 0': 'Item 5 was never passed through a find before the first print: the last union found the roots 4 and 0 by walking from 5 only as far as 4, so 5 still points at 4 at that moment.',
            '0 0 2 2 4 4\n3\n0 0\n0 0 0 0 0 0': 'That is the array after the first three unions. The last two unions (1 with 3, then 5 with 3) merge everything into one group.',
            '0 0 0 0 0 4\n1\n0 0\n0 0 0 0 0 4': 'find(5) walks from 5 to 4 to the root 0 and, because of path compression, stores 0 as the parent of 5 on the way.',
          },
          hints: [
            'After the first three unions the groups are {0, 1}, {2, 3} and {4, 5}: parents 0 0 2 2 4 4.',
            'Union (1, 3) merges two groups of size 2: the tie keeps the first root, 0. Union (5, 3) joins a group of 2 to a group of 4: the smaller root, 4, goes under the larger root, 0.',
            'find(5) walks 5, then 4, then 0, and path compression then rewrites the parent of 5.',
          ],
          explanation: 'After the three first unions the parent array is 0 0 2 2 4 4. Union (1, 3) joins roots 0 and 2 (equal sizes, so 2 goes under 0). Union (5, 3) joins roots 4 (size 2) and 0 (size 4), so 4 goes under 0, and item 5 still points at 4. That gives 0 0 0 0 0 4 with one group. find(5) walks 5 to 4 to 0 and sets the parent of 5 to 0, giving 0 0 0 0 0 0.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-43-fix-bug-1',
          kind: 'fix-bug',
          title: 'The union that cuts members loose',
          prompt: 'After these unions, items 0 to 3 and 5 should all be connected, and 4 should be alone, so the program should print true four times and then false. Tap the faulty line and choose the fix.',
          concept: 'union must join roots',
          language: 'javascript',
          code: `const parent = [0, 1, 2, 3, 4, 5];

function find(x) {
  while (parent[x] !== x) {
    x = parent[x];
  }
  return x;
}

function union(a, b) {
  parent[b] = a;
}

union(0, 1);
union(2, 1);
union(3, 0);
union(0, 5);
console.log(find(0) === find(1));
console.log(find(0) === find(2));
console.log(find(0) === find(3));
console.log(find(0) === find(5));
console.log(find(0) === find(4));`,
          bugLine: 11,
          fixes: [
            { line: '  parent[find(b)] = find(a);', correct: true, why: 'Joining two groups means linking their roots. Both finds are needed, so the new link never overwrites the parent of an item in the middle of a tree.' },
            { line: '  parent[b] = find(a);', correct: false, why: 'This still overwrites parent[b] even when b is not a root, so b is cut loose from its old group: union(2, 1) would detach 1 from 0.' },
            { line: '  parent[a] = find(b);', correct: false, why: 'The same mistake on the other side: when a is not a root, its old link is overwritten and its group falls apart.' },
            { line: '  parent[find(a)] = find(a);', correct: false, why: 'This sets a root as its own parent, which it already was, so nothing is ever joined.' },
          ],
          lineNote: 'find is fine. What does union overwrite when b is not the top of its group?',
          tests: { kind: 'output', expected: ['true', 'true', 'true', 'true', 'false'] },
          hints: [
            'Trace union(0, 1) and then union(2, 1). What happens to the link from 1 to 0?',
            'Only a root may be given a new parent, otherwise a link inside a group is lost. How do you get the root of an item?',
            'Link the root of b under the root of a: parent[find(b)] = find(a).',
          ],
          explanation: 'parent[b] = a overwrites whatever b pointed to. When b is already inside a group, that link is the only thing joining it to its leader, so replacing it splits the group. Union must be done on the two roots: parent[find(b)] = find(a).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-43-code-challenge-1',
          kind: 'code-challenge',
          title: 'Count the friend groups',
          prompt: 'Write countGroups(n, pairs): n people numbered 0 to n - 1 start in separate groups, and each pair [a, b] says that two people are friends. Return how many separate groups there are at the end. Use union-find: a parent array, a find with path compression, and a count that goes down by one for each merge of two different groups. Do not change the input.',
          concept: 'implementing union-find',
          language: 'javascript',
          starter: `function countGroups(n, pairs) {
  const parent = [];
  for (let i = 0; i < n; i++) {
    parent.push(i);
  }

  function find(x) {
    // follow parents to the root
  }

  let groups = n;
  for (const [a, b] of pairs) {
    // join the groups of a and b, and count one group fewer when they were different
  }
  return groups;
}`,
          tests: {
            kind: 'function',
            fn: 'countGroups',
            cases: [
              { label: 'nobody yet', args: [0, []], expected: 0 },
              { label: 'five strangers', args: [5, []], expected: 5 },
              { label: 'three groups', args: [6, [[0, 1], [1, 2], [3, 4]]], expected: 3 },
              { label: 'repeated pairs count once', args: [4, [[0, 1], [1, 0], [0, 1]]], expected: 3 },
              { label: 'the friend circles of the lesson', args: [8, [[0, 1], [2, 3], [1, 3], [4, 5], [6, 7], [5, 7], [0, 2]]], expected: 2 },
              {
                label: 'a hidden case: one long chain of 100',
                args: [100, Array.from({ length: 99 }, (_, i) => [i, i + 1])],
                expected: 1,
                hidden: true,
              },
              {
                label: 'a hidden case: even and odd numbers',
                args: [40, Array.from({ length: 38 }, (_, i) => [i, i + 2])],
                expected: 2,
                hidden: true,
              },
            ],
          },
          solution: `function countGroups(n, pairs) {
  const parent = [];
  for (let i = 0; i < n; i++) {
    parent.push(i);
  }

  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  let groups = n;
  for (const [a, b] of pairs) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent[rootB] = rootA;
      groups -= 1;
    }
  }
  return groups;
}`,
          hints: [
            'find(x): if parent[x] is not x, set parent[x] to find(parent[x]); then return parent[x].',
            'For each pair, find both roots. If they are different, link one root under the other and subtract one from groups.',
            'If the roots are equal, do nothing: the two people were already in the same group.',
          ],
          explanation: 'Every merge of two different groups reduces the number of groups by exactly one, and a pair inside one group changes nothing. Comparing roots tells the two cases apart, and path compression keeps each find short. Without it a long chain could make find slow.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-43-scenario-1',
          kind: 'scenario',
          title: 'Neighbour groups in a barangay app',
          prompt: 'Choose the approach you would defend.',
          concept: 'choosing union-find over the plain approach',
          situation: 'A barangay app has 200,000 households. Volunteers keep reporting "these two households are neighbours who share a water line". After each report, the app must answer "are household X and household Y on the same water line network?". Reports only ever join networks, and several thousand arrive every day.',
          options: [
            { text: 'Union-find: each report is a union, each question is a connected check, with union by size and path compression.', consequence: 'Each report and each question costs nearly constant time, however many households there are. The app also gets the number of networks for free. The one thing it could not do is split a network, which the problem never asks for.', quality: 'best' },
            { text: 'A group label for every household; on each report, relabel every household of one of the two networks.', consequence: 'Questions are one comparison, but a report can relabel a large network, up to 200,000 entries. With thousands of reports a day it works but does far more work than needed.', quality: 'acceptable' },
            { text: 'Keep all reports in an array, and answer each question by searching through the reports for a chain between X and Y.', consequence: 'Every question may need to examine many reports and follow chains, and it grows with the number of reports. It is the slowest of the options and the hardest to get right.', quality: 'poor' },
            { text: 'A trie of household names, to find the neighbours of each one.', consequence: 'A trie answers prefix questions about text. It says nothing about which households are linked, so it does not address the problem.', quality: 'poor' },
          ],
          hints: [
            'What does the app do again and again: join two groups, and ask if two items are in the same group?',
            'Reports only join networks. Does anything ever need to split one?',
            'Which approach makes both operations cheap, however large the networks get?',
          ],
          explanation: 'The workload is "merge two groups, ask if two items are in the same group", which is exactly what union-find is for, at nearly constant cost per operation. The relabelling approach is acceptable at a smaller scale, but each merge can cost O(n). The other two do not fit the question at all.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'data-structures-algorithms-43-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Questions to ask before using a special structure',
          prompt: 'Tap each card, answer the question in your head first, then read the back.',
          concept: 'when a specialized structure earns its place',
          cards: [
            { front: 'An AI assistant proposes a trie for a list of 30 contact names searched when the person taps Search. What do you ask first?', back: 'How much work the plain version does: a startsWith filter over 30 names is about 30 checks, once per tap. That is negligible, so the plain version wins on simplicity.' },
            { front: 'Why is a union-find\'s cost called "amortized"?', back: 'Because the cheap operations pay for the rare expensive ones. A single find may walk a few links, but over a long sequence of operations the average cost per operation is nearly constant.' },
            { front: 'Your code needs to remove a friendship and split a group again. Does union-find fit?', back: 'No. Union-find only merges groups. Splitting needs another design, for example rebuilding the structure from the remaining pairs.' },
            { front: 'How do you test a specialized structure you did not write?', back: 'Compare it with the plain version on the same inputs, including edge cases like empty input and duplicates. If the two ever disagree, one of them is wrong, and the plain version is easier to check by eye.' },
          ],
          hints: [
            'Answer from your own numbers: how many items, how often is the question asked?',
            'Think about what each structure cannot do as well as what it can.',
          ],
          explanation: 'A specialized structure is justified by counted cost on realistic sizes, not by how advanced it sounds. Know what question it answers, what it cannot do, and keep the plain version as a test to check it against.',
        },
      },
    ],
    quiz: [
      {
        id: 'data-structures-algorithms-43-q1',
        prompt: 'In union-find, what does path compression do during a find?',
        choices: ["It deletes the items it visited from the parent array so they can no longer be found", "It makes all the group sizes equal so that every tree ends up exactly the same depth", "It points each item it passed straight at the root, so later finds from them take one hop", "It sorts the parent array so that the roots come first and are easy to read directly"],
        answer: 2,
        explanation: 'find was walking up the path anyway, so it rewrites each visited item\'s parent to the root. Nothing is deleted and nothing is sorted; the trees just get flatter.',
      },
      {
        id: 'data-structures-algorithms-43-q2',
        prompt: 'Why does union by size hang the smaller tree under the larger root, and not the other way round?',
        choices: ["The large tree keeps its depth and only the smaller tree's items go one level deeper", "It makes the smaller group the leader, which is simply what the word \"union\" means here", "It reduces the number of groups faster than hanging the larger tree under the smaller root", "It is required for find to be able to return a root at all, whatever the sizes are"],
        answer: 0,
        explanation: 'Hanging the large tree under a small root would push every item of the large tree one level deeper. Hanging the small one under the large root adds one level only to the small tree\'s items.',
      },
      {
        id: 'data-structures-algorithms-43-q3',
        prompt: 'Which task can union-find NOT do well?',
        choices: ["Check whether two items belong to the same group after many merges", "Count how many separate groups remain after all the merges", "Merge two groups into one when a new connection is reported", "Remove one friendship so a group splits into two again"],
        answer: 3,
        explanation: 'The structure only merges: a parent link says nothing about why items were joined, so it cannot undo one join. The other three are exactly what it is designed for.',
      },
      {
        id: 'data-structures-algorithms-43-q4',
        prompt: 'A developer wants to add a trie to a screen that filters 40 saved addresses when a button is pressed. What does the rule from this lesson say to do?',
        choices: ["Use a trie anyway, because it is the fastest structure there is and the list may grow someday", "Count the plain filter's work first: about 40 checks per press is negligible, so keep it", "Use union-find, because addresses can be thought of as grouped by street or barangay", "Use a heap, because the addresses should be kept in order of their street names"],
        answer: 1,
        explanation: 'The plain version is the default. A specialized structure is justified only when counting shows that the plain one does too much work for the real sizes and frequencies.',
      },
      {
        id: 'data-structures-algorithms-43-q5',
        audience: { max: 'beginner' },
        prompt: 'In the school-club picture, how do you check whether two students are in the same club?',
        choices: ["Count the members of each club and see whether the two numbers are the same", "Follow each student's \"who do you report to?\" chain to a leader and compare the leaders", "Ask both students for their names and look the names up in a list of clubs", "Merge the two clubs and see whether anything changes in the list of leaders"],
        answer: 1,
        explanation: 'Two items are in the same group exactly when they lead up to the same root. That walk is what find does.',
      },
      {
        id: 'data-structures-algorithms-43-q6',
        audience: { min: 'advanced' },
        prompt: 'A reviewer reads "union-find operations are O(1)" in an AI-generated explanation. What is the most accurate correction?',
        choices: ["They are O(log n) in every case, never faster, because a tree of n items is log n deep", "They are O(n), because a find may have to walk the whole chain from an item to its root", "They are O(1) in the worst case, because the parent array is indexed by item number", "Amortized O(α(n)) with both fixes, practically constant, but a single call can cost more"],
        answer: 3,
        explanation: 'The bound is amortized over a sequence of operations and uses the inverse Ackermann function, which is at most a handful for any realistic n. Individual finds can be longer, and without the two fixes a find can cost O(n).',
      },
    ],
    task: {
      title: 'Your own groups and a decision',
      minutes: 20,
      steps: [
        'On paper, write 8 items (people, rooms or towns) and 6 connections between them. Draw the parent array after each union, using union by size and the rule that a tie keeps the first root. Write the group count after each step.',
        'In any free JavaScript environment, paste the UnionFind class from step 2, run your 6 connections and compare the parent arrays and group counts with your drawing. Then call connected on three pairs you chose, and predict each answer first.',
        'Pick one feature from an app you use (a search box, a to-do list, friend suggestions) and write down, in three lines, which of the structures in this module could fit it, how many items it deals with, and what the plain array version would cost. Say which one you would use and why.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain, using your 8 items, what path compression changed in your parent array, then check that its description matches your own trace.'] },
      { audience: { min: 'advanced' }, steps: ['Rewrite find iteratively with path halving (point each visited item at its grandparent), keep the union-by-size rule, and write a test that compares countGroups from this lesson with a slow reference that relabels groups, on 200 random pairs.'] },
    ],
  },
];

export const project: Project = {
  id: 'data-structures-algorithms-p9',
  title: 'Autocomplete search for products or contacts',
  summary: 'Build a trie that suggests products or contacts as the user types, ranked by popularity, and show by counting how much less work it does than scanning a plain list.',
  outcome: 'A tested autocomplete built on a trie you wrote yourself, with counted evidence against a plain scan and a written explanation of when a trie is, and is not, the right choice.',
  unlockAfterDay: 42,
  steps: [
    { id: 'data-structures-algorithms-p9-s1', text: 'Choose products or contacts and write at least 30 entries, each with a name and a popularity number (sales, calls, searches). Include names that share beginnings, a name that is a prefix of another, one with a space, one in mixed case, and one duplicated.' },
    { id: 'data-structures-algorithms-p9-s2', audience: { max: 'beginner' }, text: 'Start from the AutoTrie class in lesson 42. Read it line by line, write a comment above each method saying what it does, then load your entries into it and print suggest for three prefixes.' },
    { id: 'data-structures-algorithms-p9-s3', audience: { min: 'intermediate' }, text: 'Write your own trie from a blank file with insert, search, startsWith, prefixCount and suggest(prefix, limit). Normalize input (trim, lower case) in one place, keep a count and a score in each node, and rank by score with alphabetical tie-breaking.' },
    { id: 'data-structures-algorithms-p9-s4', text: 'Write the plain version too: a function that filters your array with startsWith and ranks the matches the same way. For ten prefixes, check that both versions return identical lists.' },
    { id: 'data-structures-algorithms-p9-s5', text: 'Count the work: for single-letter, three-letter and no-match prefixes, print how many entries the plain version checks and how many nodes the trie visits (the walk plus the subtree it collects). Do not time anything.' },
    { id: 'data-structures-algorithms-p9-s6', text: 'Count the memory: print the number of trie nodes and the total number of characters in your entries, and say in one sentence what that means for your data.' },
    { id: 'data-structures-algorithms-p9-s7', text: 'Test the edge cases and print each result: an empty prefix, a prefix that matches nothing, a prefix that is itself an entry, upper-case input, a limit of 0, and an entry inserted twice with different scores.' },
    { id: 'data-structures-algorithms-p9-s8', audience: { min: 'advanced' }, text: 'Add delete(entry) that removes an entry and prunes nodes that are no longer needed, and bound the memory of suggest by keeping only the best `limit` matches while traversing (for example with the heap from module 11) instead of collecting every match. Show with counts that both work.' },
    { id: 'data-structures-algorithms-p9-s9', text: 'Write the explanation: what a trie costs for insert, prefix lookup and listing; why you chose it; for what size of list a plain filter would be enough; and what you would change for ten million entries.' },
  ],
  submission: {
    kind: 'text',
    label: 'Your code and your explanation',
    placeholder: 'Paste your trie and suggest code, the plain version, the output for your test prefixes, your work and memory counts, then your written explanation.',
    hint: 'Include: the code that runs, the output of suggest for at least five prefixes, the proof that the trie and the plain version agree, the counts of entries checked against nodes visited, the node and character counts, and a short explanation in your own words.',
  },
  rubric: [
    'Correctness: suggestions match the prefix, are ranked by popularity with a stable tie-break, handle case and spaces, and the edge cases behave sensibly.',
    'Structure: a real trie with a Map of children and an end-of-word flag, with counts or scores kept in the nodes, not a list of words searched with startsWith.',
    'Efficiency: counts compare the entries a plain scan checks with the nodes the trie visits, for several prefixes, and the memory count is reported honestly.',
    'Code organization: normalization happens in one place, the trie and the plain version are separate and share the same interface, and names are clear.',
    'Explanation: the learner states the costs, says when a plain filter is enough, and names the trade-off of a trie in memory.',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The learner can trace, on paper, how one of their own entries is inserted and which nodes it creates.'] },
    { audience: { min: 'advanced' }, items: ['delete prunes unused nodes and a test shows that the trie still answers correctly afterwards.', 'suggest keeps a bounded number of candidates while it walks, and the counts show the saving for a one-letter prefix.'] },
  ],
};
