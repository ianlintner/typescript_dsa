/**
 * State Compression Grid DP
 *
 * Techniques for grid problems using bitmask state compression.
 * Example: Tiling dominoes, profile DP, etc.
 */

// Count ways to tile an m x n grid with 1x2 dominoes
export function countDominoTilings(m: number, n: number): number {
  // Ensure m <= n for efficiency
  if (m > n) [m, n] = [n, m];

  if ((m * n) % 2 !== 0) return 0; // Impossible if odd cells

  const fullRow = (1 << m) - 1;

  // dp[col][mask] = number of ways to fill up to column col with profile mask
  let dp = new Map<number, number>();
  dp.set(fullRow, 1);

  for (let col = 0; col < n; col++) {
    const newDp = new Map<number, number>();

    // Try all possible ways to fill this column
    function fill(row: number, prevMask: number, currMask: number): void {
      if (row === m) {
        // Completed this column
        const count = dp.get(prevMask) || 0;
        if (count > 0) {
          newDp.set(currMask, (newDp.get(currMask) || 0) + count);
        }
        return;
      }

      if (prevMask & (1 << row)) {
        // Cell was filled by horizontal domino from previous column
        fill(row + 1, prevMask, currMask);
      } else {
        // Place horizontal domino going into next column
        fill(row + 1, prevMask, currMask | (1 << row));

        // Place vertical domino (if room)
        if (row + 1 < m && !(prevMask & (1 << (row + 1)))) {
          fill(row + 2, prevMask, currMask);
        }
      }
    }

    for (const prevMask of dp.keys()) {
      fill(0, prevMask, 0);
    }

    dp = newDp;
  }

  return dp.get(0) || 0;
}

// Maximum number of non-attacking rooks on an n x n board with some cells blocked
export function maxNonAttackingRooks(
  n: number,
  blocked: Set<string>
): number {
  const isBlocked = (r: number, c: number) => blocked.has(`${r},${c}`);

  // dp[mask] = max rooks using columns in mask
  let dp = new Map<number, number>();
  dp.set(0, 0);

  for (let row = 0; row < n; row++) {
    const newDp = new Map<number, number>();

    for (const [mask, count] of dp) {
      // Option 1: Don't place a rook in this row
      if (!newDp.has(mask) || (newDp.get(mask) as number) < count) {
        newDp.set(mask, count);
      }

      // Option 2: Place a rook in an unused column
      for (let col = 0; col < n; col++) {
        if (mask & (1 << col)) continue; // Column already used
        if (isBlocked(row, col)) continue; // Cell blocked

        const newMask = mask | (1 << col);
        const newCount = count + 1;

        if (!newDp.has(newMask) || (newDp.get(newMask) as number) < newCount) {
          newDp.set(newMask, newCount);
        }
      }
    }

    dp = newDp;
  }

  let maxRooks = 0;
  for (const count of dp.values()) {
    maxRooks = Math.max(maxRooks, count);
  }

  return maxRooks;
}

// Cherry pickup from grid (two passes)
export function cherryPickup(grid: number[][]): number {
  const n = grid.length;
  if (n === 0) return 0;

  // dp[r1][c1][r2] where c2 = r1 + c1 - r2
  // Two people moving from (0,0) to (n-1,n-1) simultaneously
  const dp: number[][][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Array(n).fill(-Infinity))
  );

  dp[0][0][0] = grid[0][0];

  // Total steps from (0,0) to (n-1,n-1) is 2*(n-1)
  for (let step = 1; step <= 2 * (n - 1); step++) {
    const newDp: number[][][] = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => Array(n).fill(-Infinity))
    );

    for (let r1 = Math.max(0, step - (n - 1)); r1 <= Math.min(n - 1, step); r1++) {
      const c1 = step - r1;
      if (c1 < 0 || c1 >= n) continue;
      if (grid[r1][c1] === -1) continue;

      for (let r2 = Math.max(0, step - (n - 1)); r2 <= Math.min(n - 1, step); r2++) {
        const c2 = step - r2;
        if (c2 < 0 || c2 >= n) continue;
        if (grid[r2][c2] === -1) continue;

        // Cherries collected at this step
        let cherries = grid[r1][c1];
        if (r1 !== r2 || c1 !== c2) {
          cherries += grid[r2][c2];
        }

        // Try all previous states
        for (const [pr1, pc1] of [
          [r1 - 1, c1],
          [r1, c1 - 1],
        ]) {
          if (pr1 < 0 || pc1 < 0) continue;

          for (const [pr2, pc2] of [
            [r2 - 1, c2],
            [r2, c2 - 1],
          ]) {
            if (pr2 < 0 || pc2 < 0) continue;

            if (dp[pr1][pc1][pr2] !== -Infinity) {
              newDp[r1][c1][r2] = Math.max(
                newDp[r1][c1][r2],
                dp[pr1][pc1][pr2] + cherries
              );
            }
          }
        }
      }
    }

    for (let r1 = 0; r1 < n; r1++) {
      for (let c1 = 0; c1 < n; c1++) {
        for (let r2 = 0; r2 < n; r2++) {
          dp[r1][c1][r2] = newDp[r1][c1][r2];
        }
      }
    }
  }

  return Math.max(0, dp[n - 1][n - 1][n - 1]);
}

export function demo(): string {
  console.log('State Compression Grid DP Demo');
  console.log('==============================');

  console.log('Domino tilings:');
  for (let m = 1; m <= 4; m++) {
    for (let n = 1; n <= 6; n++) {
      const count = countDominoTilings(m, n);
      if (count > 0) {
        console.log(`  ${m}x${n} grid: ${count} ways`);
      }
    }
  }

  console.log('\nMax non-attacking rooks on 4x4 board:');
  const blocked = new Set(['1,1', '2,2']);
  console.log('  Blocked cells:', Array.from(blocked));
  console.log('  Max rooks:', maxNonAttackingRooks(4, blocked));

  console.log('\nCherry pickup:');
  const grid = [
    [0, 1, -1],
    [1, 0, -1],
    [1, 1, 1],
  ];
  console.log('  Grid:');
  grid.forEach((row) => console.log(`    [${row.join(', ')}]`));
  console.log('  Max cherries:', cherryPickup(grid));

  return `Domino tilings 2x4: ${countDominoTilings(2, 4)}`;
}
