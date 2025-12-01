/**
 * Z-Algorithm
 *
 * Summary: Build Z-array where z[i] = length of longest substring starting at i
 *          that is also a prefix of the string.
 * Time: O(n)
 * Space: O(n)
 */

// Build Z-array
export function buildZArray(s: string): number[] {
  const n = s.length;
  const z = new Array(n).fill(0);

  if (n === 0) return z;

  z[0] = n;
  let l = 0;
  let r = 0;

  for (let i = 1; i < n; i++) {
    if (i >= r) {
      l = r = i;
      while (r < n && s[r - l] === s[r]) {
        r++;
      }
      z[i] = r - l;
    } else {
      const k = i - l;
      if (z[k] < r - i) {
        z[i] = z[k];
      } else {
        l = i;
        while (r < n && s[r - l] === s[r]) {
          r++;
        }
        z[i] = r - l;
      }
    }
  }

  return z;
}

// Pattern matching using Z-algorithm
export function zSearch(text: string, pattern: string): number[] {
  if (pattern.length === 0 || pattern.length > text.length) return [];

  // Create concatenated string: pattern + separator + text
  const concat = pattern + '\0' + text;
  const z = buildZArray(concat);
  const matches: number[] = [];

  for (let i = pattern.length + 1; i < concat.length; i++) {
    if (z[i] === pattern.length) {
      matches.push(i - pattern.length - 1);
    }
  }

  return matches;
}

// Find all periods of a string
export function findPeriods(s: string): number[] {
  const n = s.length;
  const z = buildZArray(s);
  const periods: number[] = [];

  for (let i = 1; i < n; i++) {
    if (i + z[i] === n) {
      periods.push(i);
    }
  }

  periods.push(n); // Full string is always a period
  return periods;
}

// Count distinct substrings using Z-algorithm
export function countDistinctSubstrings(s: string): number {
  const n = s.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    const suffix = s.slice(i);
    const z = buildZArray(suffix);
    let maxZ = 0;

    // Count new substrings starting at position i
    for (let j = 1; j < z.length; j++) {
      maxZ = Math.max(maxZ, z[j]);
    }

    // New substrings = length - max prefix match
    count += suffix.length - maxZ;
  }

  return count;
}

export function demo(): string {
  console.log('Z-Algorithm Demo');
  console.log('================');

  const s = 'aabxaabxcaabxaabxay';
  console.log('String:', s);
  console.log('Z-array:', buildZArray(s));

  const text = 'ABABDABACDABABCABAB';
  const pattern = 'ABAB';
  console.log('\nPattern matching:');
  console.log('Text:', text);
  console.log('Pattern:', pattern);
  console.log('Matches at:', zSearch(text, pattern));

  const periodic = 'abcabcabc';
  console.log('\nPeriods of "' + periodic + '":', findPeriods(periodic));

  const distinct = 'abc';
  console.log('\nDistinct substrings of "' + distinct + '":', countDistinctSubstrings(distinct));

  return `Z-array: [${buildZArray(s).slice(0, 10).join(', ')}...]`;
}
