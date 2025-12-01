/**
 * Bitmask TSP (Traveling Salesman Problem)
 *
 * Summary: Held–Karp DP for TSP.
 * Time: O(n^2 2^n), Space: O(n 2^n)
 * Use: Small n exact TSP; else heuristics/approximation.
 */

// TSP - minimum cost to visit all cities and return to start
export function tsp(distances: number[][]): { cost: number; path: number[] } {
  const n = distances.length;
  if (n === 0) return { cost: 0, path: [] };
  if (n === 1) return { cost: 0, path: [0] };

  const ALL_VISITED = (1 << n) - 1;
  const INF = Infinity;

  // dp[mask][i] = min cost to reach city i with visited cities = mask
  const dp: number[][] = Array.from({ length: 1 << n }, () =>
    Array(n).fill(INF)
  );
  const parent: number[][] = Array.from({ length: 1 << n }, () =>
    Array(n).fill(-1)
  );

  // Start from city 0
  dp[1][0] = 0;

  for (let mask = 1; mask <= ALL_VISITED; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue; // u not in mask
      if (dp[mask][u] === INF) continue;

      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue; // v already visited
        if (distances[u][v] === INF) continue;

        const newMask = mask | (1 << v);
        const newCost = dp[mask][u] + distances[u][v];

        if (newCost < dp[newMask][v]) {
          dp[newMask][v] = newCost;
          parent[newMask][v] = u;
        }
      }
    }
  }

  // Find minimum cost to complete tour (return to city 0)
  let minCost = INF;
  let lastCity = -1;

  for (let u = 1; u < n; u++) {
    if (dp[ALL_VISITED][u] === INF) continue;
    const cost = dp[ALL_VISITED][u] + distances[u][0];
    if (cost < minCost) {
      minCost = cost;
      lastCity = u;
    }
  }

  if (minCost === INF) {
    return { cost: INF, path: [] };
  }

  // Reconstruct path
  const path: number[] = [0];
  let mask = ALL_VISITED;
  let current = lastCity;

  while (current !== -1 && current !== 0) {
    path.push(current);
    const prevCity = parent[mask][current];
    mask ^= 1 << current;
    current = prevCity;
  }

  path.reverse();
  path.push(0); // Return to start

  return { cost: minCost, path };
}

// TSP without returning to start (shortest path visiting all nodes)
export function shortestHamiltonianPath(distances: number[][]): {
  cost: number;
  path: number[];
} {
  const n = distances.length;
  if (n === 0) return { cost: 0, path: [] };
  if (n === 1) return { cost: 0, path: [0] };

  const ALL_VISITED = (1 << n) - 1;
  const INF = Infinity;

  const dp: number[][] = Array.from({ length: 1 << n }, () =>
    Array(n).fill(INF)
  );
  const parent: number[][] = Array.from({ length: 1 << n }, () =>
    Array(n).fill(-1)
  );

  // Can start from any city
  for (let i = 0; i < n; i++) {
    dp[1 << i][i] = 0;
  }

  for (let mask = 1; mask <= ALL_VISITED; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;
      if (dp[mask][u] === INF) continue;

      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;
        if (distances[u][v] === INF) continue;

        const newMask = mask | (1 << v);
        const newCost = dp[mask][u] + distances[u][v];

        if (newCost < dp[newMask][v]) {
          dp[newMask][v] = newCost;
          parent[newMask][v] = u;
        }
      }
    }
  }

  // Find minimum cost ending at any city
  let minCost = INF;
  let lastCity = -1;

  for (let u = 0; u < n; u++) {
    if (dp[ALL_VISITED][u] < minCost) {
      minCost = dp[ALL_VISITED][u];
      lastCity = u;
    }
  }

  if (minCost === INF) {
    return { cost: INF, path: [] };
  }

  // Reconstruct path
  const path: number[] = [];
  let mask = ALL_VISITED;
  let current = lastCity;

  while (current !== -1) {
    path.push(current);
    const prevCity = parent[mask][current];
    mask ^= 1 << current;
    current = prevCity;
  }

  path.reverse();

  return { cost: minCost, path };
}

// Check if a Hamiltonian path exists
export function hasHamiltonianPath(adjMatrix: boolean[][]): boolean {
  const n = adjMatrix.length;
  if (n === 0) return true;
  if (n === 1) return true;

  const ALL_VISITED = (1 << n) - 1;

  // dp[mask][i] = true if we can reach state (mask, i)
  const dp: boolean[][] = Array.from({ length: 1 << n }, () =>
    Array(n).fill(false)
  );

  for (let i = 0; i < n; i++) {
    dp[1 << i][i] = true;
  }

  for (let mask = 1; mask <= ALL_VISITED; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;
      if (!dp[mask][u]) continue;

      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;
        if (!adjMatrix[u][v]) continue;

        dp[mask | (1 << v)][v] = true;
      }
    }
  }

  for (let u = 0; u < n; u++) {
    if (dp[ALL_VISITED][u]) return true;
  }

  return false;
}

export function demo(): string {
  console.log('Bitmask TSP Demo');
  console.log('================');

  // Distance matrix for 4 cities
  const distances = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0],
  ];

  console.log('Distance matrix:');
  distances.forEach((row, i) => console.log(`  ${i}: [${row.join(', ')}]`));

  const result = tsp(distances);
  console.log('\nTSP (with return):');
  console.log('  Minimum cost:', result.cost);
  console.log('  Path:', result.path.join(' → '));

  const hamiltonianResult = shortestHamiltonianPath(distances);
  console.log('\nShortest Hamiltonian path (no return):');
  console.log('  Minimum cost:', hamiltonianResult.cost);
  console.log('  Path:', hamiltonianResult.path.join(' → '));

  return `TSP cost: ${result.cost}, Path: ${result.path.join(' → ')}`;
}
