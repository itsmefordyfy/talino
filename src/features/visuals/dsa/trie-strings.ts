import { defineStrings } from '@/lib/i18n';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const where = (prefix: string) => (prefix === '' ? 'the root' : `"${prefix}"`);

const trie = {
  title: 'Trie and autocomplete',
  summary: 'A trie stores words one letter per node, so words with the same beginning share a path and every word that starts with a prefix sits below a single node.',
  description: 'The tree shows each stored word as a path of letters from the root; a square node marks the end of a word. Type a word, then insert it, search for it, or type a prefix to autocomplete: the path is highlighted and the words below the prefix are listed as suggestions. The counters show how many nodes each operation visited, and the complexity note says what that costs.',
  topics: ['trie', 'prefix tree', 'autocomplete', 'prefix search', 'typeahead', 'search suggestions', 'dictionary', 'end of word', 'string search', 'tree', 'data structure', 'O(L)'],
  wordLabel: 'Word or prefix (letters a to z, up to 8)',
  presetsLabel: 'Try one',
  buttons: { insert: 'Insert word', search: 'Search word', prefix: 'Autocomplete prefix', reset: 'Reset words' },
  operationNames: { insert: 'Insert', search: 'Search', prefix: 'Autocomplete' },
  operationLabel: 'Operation',
  noOperation: 'none yet',
  visited: (n: number) => `Nodes visited: ${n}`,
  created: (n: number) => `New nodes: ${n}`,
  stored: (n: number, max: number) => `Words stored: ${n} of ${max}`,
  suggestionsLabel: 'Autocomplete suggestions',
  suggestionsEmpty: 'none yet: run Autocomplete prefix',
  noSuggestions: 'no stored word starts with this prefix',
  rootLabel: 'root',
  complexityLabel: 'Cost',
  complexity: 'Insert and search cost O(L), where L is the length of the word, however many words are stored. An autocomplete costs O(L) to reach the prefix, plus the size of the subtree below it.',
  legend: { path: 'On the path', current: 'Current letter', fresh: 'New node', found: 'Found', endOfWord: 'End of a word (square)' },
  treeLabel: (words: readonly string[]) => (words.length === 0 ? 'Empty trie' : `Trie holding ${plural(words.length, 'word')}: ${words.join(', ')}`),
  intro: (count: number) => `This trie holds ${count} words. Insert a word, search for one, or type a prefix to see suggestions.`,
  badWord: 'Type a word first: 1 to 8 letters from a to z.',
  full: (max: number) => `The picture holds at most ${max} words, so nothing was added.`,
  // insert
  insertStart: (word: string) => `Insert "${word}": start at the root and follow, or create, one node per letter.`,
  follow: (letter: string, prefix: string) => `"${letter}" already exists below ${where(prefix)}: follow it. This part of the path is shared with other words.`,
  create: (letter: string, prefix: string) => `There is no "${letter}" below ${where(prefix)}: create a new node for it.`,
  markEnd: (word: string) => `Mark the last node as the end of a word, so "${word}" is stored.`,
  markEndExisting: (word: string) => `Every letter of "${word}" was already on a path (it is the start of a longer word). Mark its last node as the end of a word, so "${word}" is stored too.`,
  alreadyStored: (word: string) => `"${word}" is already stored: every node exists and the last one is already marked as the end of a word. Nothing changes.`,
  // search
  searchStart: (word: string) => `Search for "${word}": follow its letters down from the root.`,
  searchStep: (letter: string, prefix: string) => `Follow "${letter}" below ${where(prefix)}.`,
  searchMissing: (letter: string, prefix: string, word: string) => `There is no "${letter}" below ${where(prefix)}, so "${word}" is not stored. The search stopped without looking at any other word.`,
  searchFound: (word: string, visited: number) => `Reached the last letter and its node is marked as the end of a word: "${word}" is stored. ${plural(visited, 'node')} visited, one per letter.`,
  searchPrefixOnly: (word: string) => `The path for "${word}" exists, but its last node is not marked as the end of a word. It is only the start of longer words, so "${word}" itself is not stored.`,
  // autocomplete
  prefixStart: (prefix: string) => `Autocomplete "${prefix}": first walk down to the node for the prefix.`,
  prefixMissing: (letter: string, prefix: string, word: string) => `There is no "${letter}" below ${where(prefix)}, so no stored word starts with "${word}". No suggestions.`,
  prefixReached: (prefix: string) => `Reached the node for "${prefix}". Every word that starts with it is somewhere below this node, so collect them in alphabetical order.`,
  prefixWord: (word: string) => `Reached the end of a word: "${word}" is a suggestion.`,
  prefixDone: (prefix: string, count: number, visited: number) => `${plural(count, 'suggestion')} for "${prefix}". ${plural(visited, 'node')} visited: the prefix's letters plus the nodes below it. Words stored elsewhere in the trie were never touched.`,
};

export const trieStrings = defineStrings({
  en: trie,
  // Placeholder, not a translation: the owner's rule is no Filipino text, so this stays English until a translation is commissioned.
  fil: trie,
});
