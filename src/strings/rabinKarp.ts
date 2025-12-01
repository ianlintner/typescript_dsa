/**
 * Rabin-Karp String Matching Algorithm
 *
 * Summary: Rolling hash substring search.
 * Time: Avg O(n+m), Worst O(nm) with many collisions
 * Space: O(1) extra
 * Notes: Great for multiple pattern search with hashing.
 */

const PRIME = 1000000007;
const BASE = 256;

// Compute hash of a string
export function computeHash(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * BASE + s.charCodeAt(i)) % PRIME;
  }
  return hash;
}

// Find all occurrences using Rabin-Karp
export function rabinKarpSearch(text: string, pattern: string): number[] {
  const n = text.length;
  const m = pattern.length;

  if (m === 0 || m > n) return [];

  const matches: number[] = [];
  const patternHash = computeHash(pattern);

  // Compute highest power of BASE needed
  let basePow = 1;
  for (let i = 0; i < m - 1; i++) {
    basePow = (basePow * BASE) % PRIME;
  }

  // Initial hash of first window
  let windowHash = computeHash(text.slice(0, m));

  for (let i = 0; i <= n - m; i++) {
    if (windowHash === patternHash) {
      // Verify to avoid hash collisions
      if (text.slice(i, i + m) === pattern) {
        matches.push(i);
      }
    }

    // Slide window: remove first char, add next char
    if (i < n - m) {
      windowHash = (windowHash - text.charCodeAt(i) * basePow) % PRIME;
      windowHash = (windowHash * BASE + text.charCodeAt(i + m)) % PRIME;
      if (windowHash < 0) windowHash += PRIME;
    }
  }

  return matches;
}

// Search for multiple patterns
export function rabinKarpMultiPattern(
  text: string,
  patterns: string[]
): Map<string, number[]> {
  const result = new Map<string, number[]>();

  for (const pattern of patterns) {
    result.set(pattern, rabinKarpSearch(text, pattern));
  }

  return result;
}

// Find longest duplicate substring
export function longestDuplicateSubstring(s: string): string {
  const n = s.length;
  if (n <= 1) return '';

  // Binary search on length
  let lo = 1;
  let hi = n - 1;
  let result = '';

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const dup = findDuplicateOfLength(s, mid);
    if (dup) {
      result = dup;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return result;
}

function findDuplicateOfLength(s: string, len: number): string | null {
  const seen = new Map<number, number[]>();

  let basePow = 1;
  for (let i = 0; i < len - 1; i++) {
    basePow = (basePow * BASE) % PRIME;
  }

  let hash = computeHash(s.slice(0, len));
  seen.set(hash, [0]);

  for (let i = 1; i <= s.length - len; i++) {
    hash = (hash - s.charCodeAt(i - 1) * basePow) % PRIME;
    hash = (hash * BASE + s.charCodeAt(i + len - 1)) % PRIME;
    if (hash < 0) hash += PRIME;

    if (seen.has(hash)) {
      const substring = s.slice(i, i + len);
      for (const prevIndex of seen.get(hash)!) {
        if (s.slice(prevIndex, prevIndex + len) === substring) {
          return substring;
        }
      }
      seen.get(hash)!.push(i);
    } else {
      seen.set(hash, [i]);
    }
  }

  return null;
}

export function demo(): string {
  console.log('Rabin-Karp Algorithm Demo');
  console.log('=========================');

  const text = 'ABABDABACDABABCABAB';
  const pattern = 'ABAB';

  console.log('Text:', text);
  console.log('Pattern:', pattern);
  console.log('Matches at:', rabinKarpSearch(text, pattern));

  console.log('\nMultiple pattern search:');
  const patterns = ['AB', 'CD', 'DA'];
  console.log('Patterns:', patterns);
  const results = rabinKarpMultiPattern(text, patterns);
  for (const [p, matches] of results) {
    console.log(`  "${p}": [${matches.join(', ')}]`);
  }

  console.log('\nLongest duplicate substring:');
  const s = 'banana';
  console.log('String:', s);
  console.log('Result:', longestDuplicateSubstring(s));

  return `Pattern "${pattern}" found at: [${rabinKarpSearch(text, pattern).join(', ')}]`;
}
