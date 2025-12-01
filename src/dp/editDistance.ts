/**
 * Edit Distance (Levenshtein Distance)
 *
 * Summary: Minimum operations to transform one string to another.
 * Time: O(nm), Space: O(min(n,m))
 */

export type EditOperation = 
  | { type: 'insert'; char: string; position: number }
  | { type: 'delete'; char: string; position: number }
  | { type: 'replace'; from: string; to: string; position: number }
  | { type: 'match'; char: string; position: number };

// Basic edit distance
export function editDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;

  // Space optimization: only need previous row
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

// Edit distance with operations reconstruction
export function editDistanceWithOps(
  s1: string,
  s2: string
): { distance: number; operations: EditOperation[] } {
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j - 1], // Replace
          dp[i - 1][j],     // Delete
          dp[i][j - 1]      // Insert
        );
      }
    }
  }

  // Backtrack to find operations
  const operations: EditOperation[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
      operations.unshift({ type: 'match', char: s1[i - 1], position: i - 1 });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      operations.unshift({
        type: 'replace',
        from: s1[i - 1],
        to: s2[j - 1],
        position: i - 1,
      });
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      operations.unshift({ type: 'delete', char: s1[i - 1], position: i - 1 });
      i--;
    } else {
      operations.unshift({ type: 'insert', char: s2[j - 1], position: i });
      j--;
    }
  }

  return { distance: dp[m][n], operations };
}

// Weighted edit distance (custom costs)
export function weightedEditDistance(
  s1: string,
  s2: string,
  insertCost: number = 1,
  deleteCost: number = 1,
  replaceCost: number = 1
): number {
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i * deleteCost;
  for (let j = 0; j <= n; j++) dp[0][j] = j * insertCost;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + replaceCost,
          dp[i - 1][j] + deleteCost,
          dp[i][j - 1] + insertCost
        );
      }
    }
  }

  return dp[m][n];
}

// Damerau-Levenshtein distance (includes transpositions)
export function damerauLevenshtein(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,           // Delete
        dp[i][j - 1] + 1,           // Insert
        dp[i - 1][j - 1] + cost     // Replace/Match
      );

      // Transposition
      if (
        i > 1 &&
        j > 1 &&
        s1[i - 1] === s2[j - 2] &&
        s1[i - 2] === s2[j - 1]
      ) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }

  return dp[m][n];
}

// Check if edit distance is at most k (early termination)
export function isWithinEditDistance(
  s1: string,
  s2: string,
  k: number
): boolean {
  const m = s1.length;
  const n = s2.length;

  // Quick check: length difference
  if (Math.abs(m - n) > k) return false;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(k + 1)
  );

  for (let i = 0; i <= Math.min(m, k); i++) dp[i][0] = i;
  for (let j = 0; j <= Math.min(n, k); j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    // Only compute within band of width 2k+1
    const lo = Math.max(1, i - k);
    const hi = Math.min(n, i + k);

    for (let j = lo; j <= hi; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }

    // Early termination: if minimum in row > k
    const minInRow = Math.min(...dp[i].slice(lo, hi + 1));
    if (minInRow > k) return false;
  }

  return dp[m][n] <= k;
}

export function demo(): string {
  console.log('Edit Distance Demo');
  console.log('==================');

  const s1 = 'kitten';
  const s2 = 'sitting';

  console.log('String 1:', s1);
  console.log('String 2:', s2);
  console.log('Edit distance:', editDistance(s1, s2));

  const result = editDistanceWithOps(s1, s2);
  console.log('\nOperations:');
  result.operations.forEach((op) => {
    switch (op.type) {
      case 'match':
        console.log(`  Keep '${op.char}' at position ${op.position}`);
        break;
      case 'replace':
        console.log(`  Replace '${op.from}' with '${op.to}' at position ${op.position}`);
        break;
      case 'delete':
        console.log(`  Delete '${op.char}' at position ${op.position}`);
        break;
      case 'insert':
        console.log(`  Insert '${op.char}' at position ${op.position}`);
        break;
    }
  });

  console.log('\nDamerau-Levenshtein (with transpositions):');
  console.log('ca -> ac:', damerauLevenshtein('ca', 'ac'));

  return `Edit distance: ${result.distance}`;
}
