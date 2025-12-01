/**
 * Dijkstra's Algorithm
 *
 * Summary: Single-source shortest paths on non-negative weights.
 * Time: O((V+E) log V) with binary heap; O(V^2) with adjacency matrix
 * Space: O(V)
 * Requires: Non-negative edge weights. For negatives, use Bellman-Ford.
 */

export type WeightedGraph = Map<number, [number, number][]>; // node -> [[neighbor, weight], ...]

export interface DijkstraStep {
  distances: Map<number, number>;
  visited: Set<number>;
  current: number | null;
  description: string;
  path?: Map<number, number>;
}

export interface DijkstraResult {
  distances: Map<number, number>;
  previous: Map<number, number>;
}

export function dijkstra(graph: WeightedGraph, start: number): DijkstraResult {
  const distances = new Map<number, number>();
  const previous = new Map<number, number>();
  const visited = new Set<number>();

  // Initialize distances
  for (const node of graph.keys()) {
    distances.set(node, Infinity);
  }
  distances.set(start, 0);

  // Priority queue using simple array (for simplicity)
  // In production, use a proper min-heap
  const pq: [number, number][] = [[0, start]]; // [distance, node]

  while (pq.length > 0) {
    // Get node with minimum distance
    pq.sort((a, b) => a[0] - b[0]);
    const [dist, node] = pq.shift()!;

    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = graph.get(node) || [];
    for (const [neighbor, weight] of neighbors) {
      if (visited.has(neighbor)) continue;

      const newDist = dist + weight;
      const currentDist = distances.get(neighbor) ?? Infinity;

      if (newDist < currentDist) {
        distances.set(neighbor, newDist);
        previous.set(neighbor, node);
        pq.push([newDist, neighbor]);
      }
    }
  }

  return { distances, previous };
}

export function dijkstraWithSteps(
  graph: WeightedGraph,
  start: number
): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const distances = new Map<number, number>();
  const previous = new Map<number, number>();
  const visited = new Set<number>();

  // Initialize distances
  for (const node of graph.keys()) {
    distances.set(node, Infinity);
  }
  distances.set(start, 0);

  steps.push({
    distances: new Map(distances),
    visited: new Set(visited),
    current: start,
    path: new Map(previous),
    description: `Starting Dijkstra from node ${start}. All distances set to ∞ except start.`,
  });

  const pq: [number, number][] = [[0, start]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [dist, node] = pq.shift()!;

    if (visited.has(node)) continue;
    visited.add(node);

    steps.push({
      distances: new Map(distances),
      visited: new Set(visited),
      current: node,
      path: new Map(previous),
      description: `Visiting node ${node} with distance ${dist}`,
    });

    const neighbors = graph.get(node) || [];
    for (const [neighbor, weight] of neighbors) {
      if (visited.has(neighbor)) continue;

      const newDist = dist + weight;
      const currentDist = distances.get(neighbor) ?? Infinity;

      if (newDist < currentDist) {
        distances.set(neighbor, newDist);
        previous.set(neighbor, node);
        pq.push([newDist, neighbor]);

        steps.push({
          distances: new Map(distances),
          visited: new Set(visited),
          current: node,
          path: new Map(previous),
          description: `Updated distance to ${neighbor}: ${currentDist === Infinity ? '∞' : currentDist} → ${newDist} via ${node}`,
        });
      }
    }
  }

  steps.push({
    distances: new Map(distances),
    visited: new Set(visited),
    current: null,
    path: new Map(previous),
    description: `Dijkstra complete. Shortest paths from ${start} found.`,
  });

  return steps;
}

// Reconstruct path from start to end
export function getPath(
  previous: Map<number, number>,
  start: number,
  end: number
): number[] | null {
  if (!previous.has(end) && start !== end) {
    return null;
  }

  const path: number[] = [end];
  let current = end;

  while (current !== start) {
    const prev = previous.get(current);
    if (prev === undefined) {
      return null;
    }
    path.unshift(prev);
    current = prev;
  }

  return path;
}

// Dijkstra for 2D grid with obstacles
export function dijkstraGrid(
  grid: number[][],
  start: [number, number],
  end: [number, number]
): { path: [number, number][]; distance: number } | null {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const key = (r: number, c: number) => `${r},${c}`;

  distances.set(key(start[0], start[1]), 0);

  const pq: [number, number, number][] = [[0, start[0], start[1]]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [dist, row, col] = pq.shift()!;

    const currentKey = key(row, col);
    if (dist > (distances.get(currentKey) ?? Infinity)) continue;

    if (row === end[0] && col === end[1]) {
      // Reconstruct path
      const path: [number, number][] = [];
      let curr = key(end[0], end[1]);
      while (curr) {
        const [r, c] = curr.split(',').map(Number);
        path.unshift([r, c]);
        curr = previous.get(curr)!;
      }
      return { path, distance: dist };
    }

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] !== 1 // 1 = obstacle
      ) {
        const weight = grid[newRow][newCol] === 0 ? 1 : grid[newRow][newCol];
        const newDist = dist + weight;
        const neighborKey = key(newRow, newCol);

        if (newDist < (distances.get(neighborKey) ?? Infinity)) {
          distances.set(neighborKey, newDist);
          previous.set(neighborKey, currentKey);
          pq.push([newDist, newRow, newCol]);
        }
      }
    }
  }

  return null;
}

export function demo(): string {
  console.log("Dijkstra's Algorithm Demo");
  console.log('=========================');

  const graph: WeightedGraph = new Map([
    [
      0,
      [
        [1, 4],
        [2, 1],
      ],
    ],
    [
      1,
      [
        [3, 1],
      ],
    ],
    [
      2,
      [
        [1, 2],
        [3, 5],
      ],
    ],
    [[3, []]],
  ]);

  console.log('Graph:');
  for (const [node, neighbors] of graph) {
    console.log(
      `  ${node}: [${neighbors.map(([n, w]) => `(${n}, w=${w})`).join(', ')}]`
    );
  }

  const result = dijkstra(graph, 0);
  console.log('\nShortest distances from 0:');
  for (const [node, dist] of result.distances) {
    console.log(`  ${node}: ${dist}`);
  }

  const path = getPath(result.previous, 0, 3);
  console.log('Path 0 → 3:', path?.join(' → '));

  return `Shortest path 0→3: ${path?.join(' → ')} (distance: ${result.distances.get(3)})`;
}
