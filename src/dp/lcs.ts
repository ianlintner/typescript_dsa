/**
 * Longest Common Subsequence (LCS)
 *
 * Summary: Longest Common Subsequence DP.
 * Time: O(nm), Space: O(min(n,m)) with Hirschberg
 * Use: Diff tools, sequence similarity.
 */

// LCS length only
export function lcsLength(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;

  // Space optimization: only need previous row
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

// LCS with reconstruction
export function lcs(s1: string, s2: string): string {
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find LCS
  let i = m;
  let j = n;
  const lcsChars: string[] = [];

  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      lcsChars.unshift(s1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcsChars.join('');
}

// Get all LCS strings (may be multiple)
export function allLCS(s1: string, s2: string): string[] {
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result = new Set<string>();

  function backtrack(i: number, j: number, current: string): void {
    if (i === 0 || j === 0) {
      result.add(current);
      return;
    }

    if (s1[i - 1] === s2[j - 1]) {
      backtrack(i - 1, j - 1, s1[i - 1] + current);
    } else {
      if (dp[i - 1][j] >= dp[i][j - 1]) {
        backtrack(i - 1, j, current);
      }
      if (dp[i][j - 1] >= dp[i - 1][j]) {
        backtrack(i, j - 1, current);
      }
    }
  }

  backtrack(m, n, '');
  return Array.from(result);
}

// Shortest Common Supersequence
export function shortestCommonSupersequence(s1: string, s2: string): string {
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  // Fill first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct
  let i = m;
  let j = n;
  const result: string[] = [];

  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      result.unshift(s1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] < dp[i][j - 1]) {
      result.unshift(s1[i - 1]);
      i--;
    } else {
      result.unshift(s2[j - 1]);
      j--;
    }
  }

  while (i > 0) {
    result.unshift(s1[i - 1]);
    i--;
  }
  while (j > 0) {
    result.unshift(s2[j - 1]);
    j--;
  }

  return result.join('');
}

// Diff-style output
export function diff(s1: string, s2: string): string[] {
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: string[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
      result.unshift(` ${s1[i - 1]}`);
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift(`+${s2[j - 1]}`);
      j--;
    } else {
      result.unshift(`-${s1[i - 1]}`);
      i--;
    }
  }

  return result;
}

export function demo(): string {
  console.log('LCS Demo');
  console.log('========');

  const s1 = 'ABCBDAB';
  const s2 = 'BDCAB';

  console.log('String 1:', s1);
  console.log('String 2:', s2);
  console.log('LCS length:', lcsLength(s1, s2));
  console.log('LCS:', lcs(s1, s2));
  console.log('All LCS:', allLCS(s1, s2));
  console.log('SCS:', shortestCommonSupersequence(s1, s2));

  console.log('\nDiff:');
  diff(s1, s2).forEach((d) => console.log('  ' + d));

  return `LCS of "${s1}" and "${s2}": "${lcs(s1, s2)}"`;
}
