/**
 * Bellman-Ford Algorithm
 *
 * Summary: Single-source shortest paths, handles negative weights.
 * Time: O(V * E)
 * Space: O(V)
 * Notes: Can detect negative cycles. Slower than Dijkstra for non-negative weights.
 */

import { WeightedGraph } from './dijkstra';

export interface BellmanFordResult {
  distances: Map<number, number>;
  previous: Map<number, number>;
  hasNegativeCycle: boolean;
}

export function bellmanFord(
  vertices: number[],
  edges: [number, number, number][], // [from, to, weight]
  start: number
): BellmanFordResult {
  const distances = new Map<number, number>();
  const previous = new Map<number, number>();

  // Initialize distances
  for (const v of vertices) {
    distances.set(v, Infinity);
  }
  distances.set(start, 0);

  // Relax edges V-1 times
  const V = vertices.length;
  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, weight] of edges) {
      const distU = distances.get(u) ?? Infinity;
      const distV = distances.get(v) ?? Infinity;

      if (distU !== Infinity && distU + weight < distV) {
        distances.set(v, distU + weight);
        previous.set(v, u);
      }
    }
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  for (const [u, v, weight] of edges) {
    const distU = distances.get(u) ?? Infinity;
    const distV = distances.get(v) ?? Infinity;

    if (distU !== Infinity && distU + weight < distV) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { distances, previous, hasNegativeCycle };
}

// Helper to convert weighted graph to edge list
export function graphToEdges(
  graph: WeightedGraph
): [number, number, number][] {
  const edges: [number, number, number][] = [];

  for (const [u, neighbors] of graph) {
    for (const [v, weight] of neighbors) {
      edges.push([u, v, weight]);
    }
  }

  return edges;
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

// Detect negative cycle and return the cycle nodes
export function findNegativeCycle(
  vertices: number[],
  edges: [number, number, number][]
): number[] | null {
  const distances = new Map<number, number>();
  const previous = new Map<number, number>();

  for (const v of vertices) {
    distances.set(v, Infinity);
  }
  // Start from first vertex
  if (vertices.length > 0) {
    distances.set(vertices[0], 0);
  }

  const V = vertices.length;

  // Relax V-1 times
  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, weight] of edges) {
      const distU = distances.get(u) ?? Infinity;
      const distV = distances.get(v) ?? Infinity;

      if (distU !== Infinity && distU + weight < distV) {
        distances.set(v, distU + weight);
        previous.set(v, u);
      }
    }
  }

  // Find a vertex on the negative cycle
  let cycleVertex: number | null = null;
  for (const [u, v, weight] of edges) {
    const distU = distances.get(u) ?? Infinity;
    const distV = distances.get(v) ?? Infinity;

    if (distU !== Infinity && distU + weight < distV) {
      cycleVertex = v;
      break;
    }
  }

  if (cycleVertex === null) {
    return null;
  }

  // Trace back to find the cycle
  const visited = new Set<number>();
  let current = cycleVertex;

  // Go back V times to ensure we're in the cycle
  for (let i = 0; i < V; i++) {
    current = previous.get(current) ?? current;
  }

  // Now trace the cycle
  const cycle: number[] = [current];
  let next = previous.get(current)!;

  while (next !== current) {
    if (visited.has(next)) break;
    visited.add(next);
    cycle.push(next);
    next = previous.get(next)!;
  }

  cycle.push(current);
  return cycle.reverse();
}

export function demo(): string {
  console.log('Bellman-Ford Algorithm Demo');
  console.log('===========================');

  const vertices = [0, 1, 2, 3, 4];
  const edges: [number, number, number][] = [
    [0, 1, 4],
    [0, 2, 1],
    [2, 1, 2],
    [1, 3, 1],
    [2, 3, 5],
    [3, 4, 3],
  ];

  console.log('Graph edges:');
  edges.forEach(([u, v, w]) => console.log(`  ${u} → ${v} (weight: ${w})`));

  const result = bellmanFord(vertices, edges, 0);

  console.log('\nShortest distances from 0:');
  for (const [node, dist] of result.distances) {
    console.log(`  ${node}: ${dist}`);
  }

  console.log('Has negative cycle:', result.hasNegativeCycle);

  // Test with negative cycle
  console.log('\nTesting with negative cycle:');
  const edgesWithCycle: [number, number, number][] = [
    [0, 1, 1],
    [1, 2, -1],
    [2, 3, -1],
    [3, 1, -1],
  ];

  const resultWithCycle = bellmanFord([0, 1, 2, 3], edgesWithCycle, 0);
  console.log('Has negative cycle:', resultWithCycle.hasNegativeCycle);

  return `Shortest path 0→4: ${result.distances.get(4)}`;
}
