/**
 * KMP String Matching Algorithm
 *
 * Summary: Pattern matching using prefix function.
 * Time: O(n + m)
 * Space: O(m) for prefix table
 */

// Build KMP failure function (prefix table)
export function buildPrefixTable(pattern: string): number[] {
  const m = pattern.length;
  const prefix = new Array(m).fill(0);
  let j = 0;

  for (let i = 1; i < m; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) {
      j = prefix[j - 1];
    }
    if (pattern[i] === pattern[j]) {
      j++;
    }
    prefix[i] = j;
  }

  return prefix;
}

// Find all occurrences of pattern in text
export function kmpSearch(text: string, pattern: string): number[] {
  if (pattern.length === 0) return [];
  if (pattern.length > text.length) return [];

  const prefix = buildPrefixTable(pattern);
  const matches: number[] = [];
  let j = 0;

  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) {
      j = prefix[j - 1];
    }
    if (text[i] === pattern[j]) {
      j++;
    }
    if (j === pattern.length) {
      matches.push(i - pattern.length + 1);
      j = prefix[j - 1];
    }
  }

  return matches;
}

// Check if pattern exists in text
export function kmpContains(text: string, pattern: string): boolean {
  return kmpSearch(text, pattern).length > 0;
}

// Count occurrences (non-overlapping)
export function kmpCountNonOverlapping(text: string, pattern: string): number {
  if (pattern.length === 0) return 0;

  let count = 0;
  let pos = 0;

  while (pos <= text.length - pattern.length) {
    const matches = kmpSearch(text.slice(pos), pattern);
    if (matches.length === 0) break;
    count++;
    pos += matches[0] + pattern.length;
  }

  return count;
}

export function demo(): string {
  console.log('KMP Algorithm Demo');
  console.log('==================');

  const text = 'ABABDABACDABABCABAB';
  const pattern = 'ABABCABAB';

  console.log('Text:', text);
  console.log('Pattern:', pattern);
  console.log('Prefix table:', buildPrefixTable(pattern));
  console.log('Matches at:', kmpSearch(text, pattern));

  const text2 = 'AAAAAA';
  const pattern2 = 'AA';
  console.log('\nOverlapping search:');
  console.log('Text:', text2);
  console.log('Pattern:', pattern2);
  console.log('All matches:', kmpSearch(text2, pattern2));

  return `Pattern found at: [${kmpSearch(text, pattern).join(', ')}]`;
}
