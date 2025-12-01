/**
 * Manacher's Algorithm
 *
 * Summary: Find longest palindromic substring in O(n) time.
 * Time: O(n)
 * Space: O(n)
 */

// Find longest palindromic substring
export function longestPalindrome(s: string): string {
  if (s.length <= 1) return s;

  // Transform: "abc" -> "#a#b#c#"
  const t = '#' + s.split('').join('#') + '#';
  const n = t.length;
  const p = new Array(n).fill(0);

  let c = 0; // Center of rightmost palindrome
  let r = 0; // Right boundary of rightmost palindrome

  for (let i = 0; i < n; i++) {
    if (i < r) {
      const mirror = 2 * c - i;
      p[i] = Math.min(r - i, p[mirror]);
    }

    // Expand around i
    let left = i - p[i] - 1;
    let right = i + p[i] + 1;
    while (left >= 0 && right < n && t[left] === t[right]) {
      p[i]++;
      left--;
      right++;
    }

    // Update center and right boundary
    if (i + p[i] > r) {
      c = i;
      r = i + p[i];
    }
  }

  // Find the maximum
  let maxLen = 0;
  let centerIndex = 0;
  for (let i = 0; i < n; i++) {
    if (p[i] > maxLen) {
      maxLen = p[i];
      centerIndex = i;
    }
  }

  // Extract original palindrome
  const start = (centerIndex - maxLen) / 2;
  return s.slice(start, start + maxLen);
}

// Get all palindromic radii
export function palindromeRadii(s: string): number[] {
  const t = '#' + s.split('').join('#') + '#';
  const n = t.length;
  const p = new Array(n).fill(0);

  let c = 0;
  let r = 0;

  for (let i = 0; i < n; i++) {
    if (i < r) {
      p[i] = Math.min(r - i, p[2 * c - i]);
    }

    let left = i - p[i] - 1;
    let right = i + p[i] + 1;
    while (left >= 0 && right < n && t[left] === t[right]) {
      p[i]++;
      left--;
      right++;
    }

    if (i + p[i] > r) {
      c = i;
      r = i + p[i];
    }
  }

  // Convert back to original string indices
  const radii: number[] = [];
  for (let i = 1; i < n - 1; i += 2) {
    radii.push(p[i]);
  }

  return radii;
}

// Count palindromic substrings
export function countPalindromes(s: string): number {
  const t = '#' + s.split('').join('#') + '#';
  const n = t.length;
  const p = new Array(n).fill(0);

  let c = 0;
  let r = 0;
  let count = 0;

  for (let i = 0; i < n; i++) {
    if (i < r) {
      p[i] = Math.min(r - i, p[2 * c - i]);
    }

    let left = i - p[i] - 1;
    let right = i + p[i] + 1;
    while (left >= 0 && right < n && t[left] === t[right]) {
      p[i]++;
      left--;
      right++;
    }

    if (i + p[i] > r) {
      c = i;
      r = i + p[i];
    }

    // Count palindromes centered at i
    // Each radius contributes (radius + 1) / 2 palindromes
    count += Math.floor((p[i] + 1) / 2);
  }

  return count;
}

// Find all distinct palindromic substrings
export function distinctPalindromes(s: string): string[] {
  const result = new Set<string>();

  for (let i = 0; i < s.length; i++) {
    // Odd length palindromes
    let left = i;
    let right = i;
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      result.add(s.slice(left, right + 1));
      left--;
      right++;
    }

    // Even length palindromes
    left = i;
    right = i + 1;
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      result.add(s.slice(left, right + 1));
      left--;
      right++;
    }
  }

  return Array.from(result).sort((a, b) => a.length - b.length || a.localeCompare(b));
}

export function demo(): string {
  console.log("Manacher's Algorithm Demo");
  console.log('=========================');

  const s = 'babad';
  console.log('String:', s);
  console.log('Longest palindrome:', longestPalindrome(s));

  const s2 = 'abacdfgdcaba';
  console.log('\nString:', s2);
  console.log('Longest palindrome:', longestPalindrome(s2));

  const s3 = 'abaaba';
  console.log('\nString:', s3);
  console.log('Count of palindromic substrings:', countPalindromes(s3));
  console.log('Distinct palindromes:', distinctPalindromes(s3));

  return `Longest palindrome of "${s}": "${longestPalindrome(s)}"`;
}
