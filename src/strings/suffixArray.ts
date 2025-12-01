/**
 * Suffix Array and LCP Array
 *
 * Summary: Suffix array for string pattern matching and more.
 * Build: O(n log n)
 * Space: O(n)
 */

// Build suffix array using O(n log^2 n) algorithm
export function buildSuffixArray(s: string): number[] {
  const n = s.length;
  if (n === 0) return [];

  // Create suffix indices with initial ranking
  const suffixes = Array.from({ length: n }, (_, i) => ({
    index: i,
    rank: [s.charCodeAt(i), i + 1 < n ? s.charCodeAt(i + 1) : -1],
  }));

  suffixes.sort((a, b) => {
    if (a.rank[0] !== b.rank[0]) return a.rank[0] - b.rank[0];
    return a.rank[1] - b.rank[1];
  });

  const ind = new Array(n); // Index in sorted array

  for (let k = 4; k < 2 * n; k *= 2) {
    // Assign new rank
    let rank = 0;
    let prevRank = suffixes[0].rank;
    suffixes[0].rank[0] = 0;
    ind[suffixes[0].index] = 0;

    for (let i = 1; i < n; i++) {
      if (
        suffixes[i].rank[0] === prevRank[0] &&
        suffixes[i].rank[1] === prevRank[1]
      ) {
        suffixes[i].rank[0] = rank;
      } else {
        prevRank = [...suffixes[i].rank];
        rank++;
        suffixes[i].rank[0] = rank;
      }
      ind[suffixes[i].index] = i;
    }

    // Assign next rank
    for (let i = 0; i < n; i++) {
      const nextIndex = suffixes[i].index + k / 2;
      suffixes[i].rank[1] = nextIndex < n ? suffixes[ind[nextIndex]].rank[0] : -1;
    }

    suffixes.sort((a, b) => {
      if (a.rank[0] !== b.rank[0]) return a.rank[0] - b.rank[0];
      return a.rank[1] - b.rank[1];
    });
  }

  return suffixes.map((s) => s.index);
}

// Build LCP array using Kasai's algorithm - O(n)
export function buildLCPArray(s: string, suffixArray: number[]): number[] {
  const n = s.length;
  if (n === 0) return [];

  const lcp = new Array(n).fill(0);
  const rank = new Array(n);

  for (let i = 0; i < n; i++) {
    rank[suffixArray[i]] = i;
  }

  let k = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i] === n - 1) {
      k = 0;
      continue;
    }

    const j = suffixArray[rank[i] + 1];
    while (i + k < n && j + k < n && s[i + k] === s[j + k]) {
      k++;
    }

    lcp[rank[i]] = k;
    if (k > 0) k--;
  }

  return lcp;
}

// Pattern search using suffix array (binary search)
export function searchPattern(
  s: string,
  suffixArray: number[],
  pattern: string
): number[] {
  const n = s.length;
  const m = pattern.length;

  if (m === 0 || m > n) return [];

  // Find lower bound
  let lo = 0;
  let hi = n - 1;
  let start = -1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const suffix = s.slice(suffixArray[mid]);
    const cmp = suffix.slice(0, m).localeCompare(pattern);

    if (cmp >= 0) {
      if (cmp === 0) start = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  if (start === -1) return [];

  // Find upper bound
  lo = start;
  hi = n - 1;
  let end = start;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const suffix = s.slice(suffixArray[mid]);
    const cmp = suffix.slice(0, m).localeCompare(pattern);

    if (cmp <= 0) {
      if (cmp === 0) end = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return suffixArray.slice(start, end + 1).sort((a, b) => a - b);
}

// Count distinct substrings using suffix array and LCP
export function countDistinctSubstrings(s: string): number {
  const n = s.length;
  if (n === 0) return 0;

  const sa = buildSuffixArray(s);
  const lcp = buildLCPArray(s, sa);

  // Total substrings - duplicates counted by LCP
  const total = (n * (n + 1)) / 2;
  const duplicates = lcp.reduce((sum, l) => sum + l, 0);

  return total - duplicates;
}

// Find longest repeated substring
export function longestRepeatedSubstring(s: string): string {
  if (s.length <= 1) return '';

  const sa = buildSuffixArray(s);
  const lcp = buildLCPArray(s, sa);

  let maxLCP = 0;
  let maxIndex = 0;

  for (let i = 0; i < lcp.length; i++) {
    if (lcp[i] > maxLCP) {
      maxLCP = lcp[i];
      maxIndex = i;
    }
  }

  if (maxLCP === 0) return '';
  return s.slice(sa[maxIndex], sa[maxIndex] + maxLCP);
}

export function demo(): string {
  console.log('Suffix Array Demo');
  console.log('=================');

  const s = 'banana';
  console.log('String:', s);

  const sa = buildSuffixArray(s);
  console.log('Suffix array:', sa);

  console.log('Suffixes in sorted order:');
  sa.forEach((i, rank) => console.log(`  ${rank}: ${s.slice(i)} (index ${i})`));

  const lcp = buildLCPArray(s, sa);
  console.log('LCP array:', lcp);

  const pattern = 'ana';
  console.log(`\nSearch for "${pattern}":`, searchPattern(s, sa, pattern));

  console.log('\nDistinct substrings:', countDistinctSubstrings(s));
  console.log('Longest repeated substring:', longestRepeatedSubstring(s));

  return `Suffix array: [${sa.join(', ')}]`;
}
