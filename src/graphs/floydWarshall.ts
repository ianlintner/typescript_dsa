/**
 * Floyd-Warshall Algorithm
 *
 * Summary: All-pairs shortest paths.
 * Time: O(V^3)
 * Space: O(V^2)
 * Notes: Works with negative weights, can detect negative cycles.
 */

export interface FloydWarshallResult {
  distances: number[][];
  next: (number | null)[][];
  hasNegativeCycle: boolean;
}

export function floydWarshall(
  n: number,
  edges: [number, number, number][]
): FloydWarshallResult {
  // Initialize distance matrix
  const dist: number[][] = Array.from({ length: n }, () =>
    Array(n).fill(Infinity)
  );
  const next: (number | null)[][] = Array.from({ length: n }, () =>
    Array(n).fill(null)
  );

  // Self-loops have distance 0
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
    next[i][i] = i;
  }

  // Initialize with edge weights
  for (const [u, v, weight] of edges) {
    dist[u][v] = weight;
    next[u][v] = v;
  }

  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  // Check for negative cycles (negative value on diagonal)
  let hasNegativeCycle = false;
  for (let i = 0; i < n; i++) {
    if (dist[i][i] < 0) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { distances: dist, next, hasNegativeCycle };
}

// Reconstruct path from u to v
export function getPath(
  next: (number | null)[][],
  u: number,
  v: number
): number[] | null {
  if (next[u][v] === null) {
    return null;
  }

  const path: number[] = [u];
  let current = u;

  while (current !== v) {
    current = next[current][v]!;
    path.push(current);
  }

  return path;
}

// Find transitive closure (reachability matrix)
export function transitiveClosure(n: number, edges: [number, number][]): boolean[][] {
  const reachable: boolean[][] = Array.from({ length: n }, () =>
    Array(n).fill(false)
  );

  // Self-reachability
  for (let i = 0; i < n; i++) {
    reachable[i][i] = true;
  }

  // Direct edges
  for (const [u, v] of edges) {
    reachable[u][v] = true;
  }

  // Warshall's algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        reachable[i][j] = reachable[i][j] || (reachable[i][k] && reachable[k][j]);
      }
    }
  }

  return reachable;
}

// Detect all nodes affected by negative cycles
export function findNodesAffectedByNegativeCycle(
  n: number,
  edges: [number, number, number][]
): Set<number> {
  const result = floydWarshall(n, edges);
  const affected = new Set<number>();

  if (!result.hasNegativeCycle) {
    return affected;
  }

  // A node is affected if it can reach and be reached from a node in a negative cycle
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        // If k is in a negative cycle and i can reach k and k can reach j
        if (
          result.distances[k][k] < 0 &&
          result.distances[i][k] !== Infinity &&
          result.distances[k][j] !== Infinity
        ) {
          affected.add(i);
          affected.add(j);
        }
      }
    }
  }

  return affected;
}

export function demo(): string {
  console.log('Floyd-Warshall Algorithm Demo');
  console.log('=============================');

  const n = 4;
  const edges: [number, number, number][] = [
    [0, 1, 3],
    [0, 3, 5],
    [1, 0, 2],
    [1, 3, 4],
    [2, 1, 1],
    [3, 2, 2],
  ];

  console.log('Graph edges:');
  edges.forEach(([u, v, w]) => console.log(`  ${u} → ${v} (weight: ${w})`));

  const result = floydWarshall(n, edges);

  console.log('\nDistance matrix:');
  console.log('   ', Array.from({ length: n }, (_, i) => i).join('   '));
  result.distances.forEach((row, i) => {
    console.log(
      ` ${i}: ${row.map((d) => (d === Infinity ? '∞' : d.toString().padStart(2))).join('  ')}`
    );
  });

  console.log('\nShortest paths:');
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && result.distances[i][j] !== Infinity) {
        const path = getPath(result.next, i, j);
        console.log(`  ${i} → ${j}: ${path?.join(' → ')} (dist: ${result.distances[i][j]})`);
      }
    }
  }

  console.log('\nHas negative cycle:', result.hasNegativeCycle);

  return `Distance 0→2: ${result.distances[0][2]}`;
}
