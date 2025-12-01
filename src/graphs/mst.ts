/**
 * Minimum Spanning Tree Algorithms
 *
 * Kruskal: Sort edges by weight; add if it doesn't form a cycle (Union-Find).
 * Time: O(E log E) ≈ O(E log V)
 *
 * Prim: Grow MST from a start node using PQ of crossing edges.
 * Time: O(E log V) with binary heap
 */

// Union-Find data structure for Kruskal's
class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }
}

export interface MSTStep {
  edges: [number, number, number][];
  currentEdge?: [number, number, number];
  mstEdges: [number, number, number][];
  description: string;
  totalWeight: number;
}

export interface MSTResult {
  edges: [number, number, number][];
  totalWeight: number;
}

// Kruskal's Algorithm
export function kruskal(
  n: number,
  edges: [number, number, number][]
): MSTResult {
  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n);
  const mstEdges: [number, number, number][] = [];
  let totalWeight = 0;

  for (const [u, v, weight] of sortedEdges) {
    if (uf.union(u, v)) {
      mstEdges.push([u, v, weight]);
      totalWeight += weight;

      if (mstEdges.length === n - 1) break;
    }
  }

  return { edges: mstEdges, totalWeight };
}

export function kruskalWithSteps(
  n: number,
  edges: [number, number, number][]
): MSTStep[] {
  const steps: MSTStep[] = [];
  const sortedEdges = [...edges].sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n);
  const mstEdges: [number, number, number][] = [];
  let totalWeight = 0;

  steps.push({
    edges: sortedEdges,
    mstEdges: [],
    totalWeight: 0,
    description: `Starting Kruskal's algorithm with ${edges.length} edges, sorted by weight`,
  });

  for (const edge of sortedEdges) {
    const [u, v, weight] = edge;

    if (uf.union(u, v)) {
      mstEdges.push(edge);
      totalWeight += weight;

      steps.push({
        edges: sortedEdges,
        currentEdge: edge,
        mstEdges: [...mstEdges],
        totalWeight,
        description: `Added edge (${u}, ${v}) with weight ${weight}. MST now has ${mstEdges.length} edges.`,
      });

      if (mstEdges.length === n - 1) break;
    } else {
      steps.push({
        edges: sortedEdges,
        currentEdge: edge,
        mstEdges: [...mstEdges],
        totalWeight,
        description: `Skipped edge (${u}, ${v}) - would form a cycle`,
      });
    }
  }

  steps.push({
    edges: sortedEdges,
    mstEdges: [...mstEdges],
    totalWeight,
    description: `MST complete! Total weight: ${totalWeight}`,
  });

  return steps;
}

// Prim's Algorithm
export function prim(
  n: number,
  adjList: Map<number, [number, number][]>,
  start: number = 0
): MSTResult {
  const mstEdges: [number, number, number][] = [];
  const inMST = new Set<number>();
  let totalWeight = 0;

  // Priority queue: [weight, from, to]
  const pq: [number, number, number][] = [];

  inMST.add(start);
  const neighbors = adjList.get(start) || [];
  for (const [neighbor, weight] of neighbors) {
    pq.push([weight, start, neighbor]);
  }

  while (pq.length > 0 && mstEdges.length < n - 1) {
    pq.sort((a, b) => a[0] - b[0]);
    const [weight, from, to] = pq.shift()!;

    if (inMST.has(to)) continue;

    inMST.add(to);
    mstEdges.push([from, to, weight]);
    totalWeight += weight;

    const toNeighbors = adjList.get(to) || [];
    for (const [neighbor, w] of toNeighbors) {
      if (!inMST.has(neighbor)) {
        pq.push([w, to, neighbor]);
      }
    }
  }

  return { edges: mstEdges, totalWeight };
}

export function primWithSteps(
  n: number,
  adjList: Map<number, [number, number][]>,
  start: number = 0
): MSTStep[] {
  const steps: MSTStep[] = [];
  const mstEdges: [number, number, number][] = [];
  const inMST = new Set<number>();
  let totalWeight = 0;

  const pq: [number, number, number][] = [];

  steps.push({
    edges: [],
    mstEdges: [],
    totalWeight: 0,
    description: `Starting Prim's algorithm from node ${start}`,
  });

  inMST.add(start);
  const neighbors = adjList.get(start) || [];
  for (const [neighbor, weight] of neighbors) {
    pq.push([weight, start, neighbor]);
  }

  steps.push({
    edges: pq.map((e) => [e[1], e[2], e[0]]),
    mstEdges: [...mstEdges],
    totalWeight,
    description: `Added edges from node ${start} to priority queue`,
  });

  while (pq.length > 0 && mstEdges.length < n - 1) {
    pq.sort((a, b) => a[0] - b[0]);
    const [weight, from, to] = pq.shift()!;

    if (inMST.has(to)) {
      steps.push({
        edges: pq.map((e) => [e[1], e[2], e[0]]),
        currentEdge: [from, to, weight],
        mstEdges: [...mstEdges],
        totalWeight,
        description: `Skipped edge (${from}, ${to}) - node ${to} already in MST`,
      });
      continue;
    }

    inMST.add(to);
    mstEdges.push([from, to, weight]);
    totalWeight += weight;

    steps.push({
      edges: pq.map((e) => [e[1], e[2], e[0]]),
      currentEdge: [from, to, weight],
      mstEdges: [...mstEdges],
      totalWeight,
      description: `Added edge (${from}, ${to}) with weight ${weight}. Added node ${to} to MST.`,
    });

    const toNeighbors = adjList.get(to) || [];
    for (const [neighbor, w] of toNeighbors) {
      if (!inMST.has(neighbor)) {
        pq.push([w, to, neighbor]);
      }
    }
  }

  steps.push({
    edges: [],
    mstEdges: [...mstEdges],
    totalWeight,
    description: `MST complete! Total weight: ${totalWeight}`,
  });

  return steps;
}

// Helper to convert edge list to adjacency list for Prim's
export function edgesToAdjList(
  edges: [number, number, number][]
): Map<number, [number, number][]> {
  const adjList = new Map<number, [number, number][]>();

  for (const [u, v, weight] of edges) {
    if (!adjList.has(u)) adjList.set(u, []);
    if (!adjList.has(v)) adjList.set(v, []);
    adjList.get(u)!.push([v, weight]);
    adjList.get(v)!.push([u, weight]); // Undirected
  }

  return adjList;
}

export function demo(): string {
  console.log('MST Algorithms Demo');
  console.log('===================');

  const n = 5;
  const edges: [number, number, number][] = [
    [0, 1, 2],
    [0, 3, 6],
    [1, 2, 3],
    [1, 3, 8],
    [1, 4, 5],
    [2, 4, 7],
    [3, 4, 9],
  ];

  console.log('Graph edges:');
  edges.forEach(([u, v, w]) => console.log(`  ${u} -- ${v} (weight: ${w})`));

  const kruskalResult = kruskal(n, edges);
  console.log("\nKruskal's MST:");
  console.log('Edges:', kruskalResult.edges.map(([u, v, w]) => `(${u},${v}:${w})`).join(', '));
  console.log('Total weight:', kruskalResult.totalWeight);

  const adjList = edgesToAdjList(edges);
  const primResult = prim(n, adjList, 0);
  console.log("\nPrim's MST:");
  console.log('Edges:', primResult.edges.map(([u, v, w]) => `(${u},${v}:${w})`).join(', '));
  console.log('Total weight:', primResult.totalWeight);

  return `MST total weight: ${kruskalResult.totalWeight}`;
}
