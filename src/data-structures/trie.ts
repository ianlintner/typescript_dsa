/**
 * Trie (Prefix Tree)
 *
 * Summary: Tree data structure for efficient string operations.
 * Insert/Search/Delete: O(m) where m is string length
 * Space: O(alphabet_size * m * n) for n strings
 * Use: Autocomplete, spell checking, IP routing, dictionary operations.
 */

class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  count: number; // Number of words with this prefix
  wordCount: number; // Number of times this word was inserted

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.count = 0;
    this.wordCount = 0;
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  // Insert a word into the trie
  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
      node.count++;
    }
    node.isEndOfWord = true;
    node.wordCount++;
  }

  // Search for a word
  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  // Check if any word starts with the given prefix
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  // Count words with given prefix
  countWordsWithPrefix(prefix: string): number {
    const node = this.findNode(prefix);
    return node ? node.count : 0;
  }

  // Get all words with given prefix
  getWordsWithPrefix(prefix: string): string[] {
    const node = this.findNode(prefix);
    if (!node) return [];

    const words: string[] = [];
    this.collectWords(node, prefix, words);
    return words;
  }

  // Delete a word from the trie
  delete(word: string): boolean {
    return this.deleteHelper(this.root, word, 0);
  }

  // Get all words in the trie
  getAllWords(): string[] {
    const words: string[] = [];
    this.collectWords(this.root, '', words);
    return words;
  }

  private findNode(prefix: string): TrieNode | null {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return null;
      }
      node = node.children.get(char)!;
    }
    return node;
  }

  private collectWords(node: TrieNode, prefix: string, words: string[]): void {
    if (node.isEndOfWord) {
      for (let i = 0; i < node.wordCount; i++) {
        words.push(prefix);
      }
    }
    for (const [char, child] of node.children) {
      this.collectWords(child, prefix + char, words);
    }
  }

  private deleteHelper(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      if (!node.isEndOfWord) return false;
      node.isEndOfWord = false;
      node.wordCount = 0;
      return node.children.size === 0;
    }

    const char = word[index];
    const child = node.children.get(char);
    if (!child) return false;

    child.count--;
    const shouldDeleteChild = this.deleteHelper(child, word, index + 1);

    if (shouldDeleteChild) {
      node.children.delete(char);
      return !node.isEndOfWord && node.children.size === 0;
    }

    return false;
  }
}

// Trie with wildcard search (supports '.' as any character)
export class WildcardTrie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  // Search with '.' matching any single character
  search(word: string): boolean {
    return this.searchHelper(this.root, word, 0);
  }

  private searchHelper(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      return node.isEndOfWord;
    }

    const char = word[index];
    if (char === '.') {
      for (const child of node.children.values()) {
        if (this.searchHelper(child, word, index + 1)) {
          return true;
        }
      }
      return false;
    } else {
      const child = node.children.get(char);
      if (!child) return false;
      return this.searchHelper(child, word, index + 1);
    }
  }
}

// Trie for XOR maximum
export class XORTrie {
  private root: TrieNode;
  private maxBits: number;

  constructor(maxBits: number = 30) {
    this.root = new TrieNode();
    this.maxBits = maxBits;
  }

  insert(num: number): void {
    let node = this.root;
    for (let i = this.maxBits - 1; i >= 0; i--) {
      const bit = (num >> i) & 1;
      const bitStr = bit.toString();
      if (!node.children.has(bitStr)) {
        node.children.set(bitStr, new TrieNode());
      }
      node = node.children.get(bitStr)!;
    }
  }

  // Find maximum XOR with any number in trie
  findMaxXOR(num: number): number {
    let node = this.root;
    let maxXor = 0;

    for (let i = this.maxBits - 1; i >= 0; i--) {
      const bit = (num >> i) & 1;
      const oppositeBit = (1 - bit).toString();
      const sameBit = bit.toString();

      if (node.children.has(oppositeBit)) {
        maxXor |= 1 << i;
        node = node.children.get(oppositeBit)!;
      } else if (node.children.has(sameBit)) {
        node = node.children.get(sameBit)!;
      } else {
        break;
      }
    }

    return maxXor;
  }
}

export function demo(): string {
  console.log('Trie Demo');
  console.log('=========');

  const trie = new Trie();
  const words = ['apple', 'app', 'application', 'apply', 'banana', 'band'];

  console.log('Inserting words:', words);
  words.forEach((word) => trie.insert(word));

  console.log('\nSearch results:');
  console.log('  "apple":', trie.search('apple'));
  console.log('  "app":', trie.search('app'));
  console.log('  "appl":', trie.search('appl'));

  console.log('\nPrefix operations:');
  console.log('  Starts with "app":', trie.startsWith('app'));
  console.log('  Words with "app" prefix:', trie.getWordsWithPrefix('app'));
  console.log('  Count with "app" prefix:', trie.countWordsWithPrefix('app'));

  console.log('\nAll words:', trie.getAllWords());

  trie.delete('app');
  console.log('After deleting "app":', trie.getAllWords());

  console.log('\nWildcard Trie:');
  const wildcardTrie = new WildcardTrie();
  wildcardTrie.insert('bad');
  wildcardTrie.insert('dad');
  wildcardTrie.insert('mad');
  console.log('  Search ".ad":', wildcardTrie.search('.ad'));
  console.log('  Search "b..":', wildcardTrie.search('b..'));

  return `Words with prefix "app": [${trie.getWordsWithPrefix('app').join(', ')}]`;
}
