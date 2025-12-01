/**
 * Strongly Connected Components (Tarjan's Algorithm)
 *
 * Summary: Find all SCCs in a directed graph.
 * Time: O(V+E)
 * Space: O(V)
 * Use: Collapse SCCs to DAG, reasoning about cycles and components.
 */

import { Graph } from './bfsDfs';

export interface SCCResult {
  components: number[][];
  componentMap: Map<number, number>; // node -> component index
}

// Tarjan's Algorithm
export function tarjanSCC(graph: Graph): SCCResult {
  let index = 0;
  const stack: number[] = [];
  const onStack = new Set<number>();
  const indices = new Map<number, number>();
  const lowLinks = new Map<number, number>();
  const components: number[][] = [];
  const componentMap = new Map<number, number>();

  function strongConnect(node: number): void {
    indices.set(node, index);
    lowLinks.set(node, index);
    index++;
    stack.push(node);
    onStack.add(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!indices.has(neighbor)) {
        // Successor not yet visited
        strongConnect(neighbor);
        lowLinks.set(
          node,
          Math.min(lowLinks.get(node)!, lowLinks.get(neighbor)!)
        );
      } else if (onStack.has(neighbor)) {
        // Successor is on stack, part of current SCC
        lowLinks.set(
          node,
          Math.min(lowLinks.get(node)!, indices.get(neighbor)!)
        );
      }
    }

    // If node is a root, pop the SCC
    if (lowLinks.get(node) === indices.get(node)) {
      const component: number[] = [];
      let w: number;
      do {
        w = stack.pop()!;
        onStack.delete(w);
        component.push(w);
        componentMap.set(w, components.length);
      } while (w !== node);
      components.push(component);
    }
  }

  for (const node of graph.keys()) {
    if (!indices.has(node)) {
      strongConnect(node);
    }
  }

  return { components, componentMap };
}

// Kosaraju's Algorithm (alternative)
export function kosarajuSCC(graph: Graph): number[][] {
  const visited = new Set<number>();
  const order: number[] = [];

  // First DFS to compute finish order
  function dfs1(node: number): void {
    visited.add(node);
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        dfs1(neighbor);
      }
    }
    order.push(node);
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs1(node);
    }
  }

  // Build reverse graph
  const reverseGraph: Graph = new Map();
  for (const node of graph.keys()) {
    if (!reverseGraph.has(node)) reverseGraph.set(node, []);
    for (const neighbor of graph.get(node) || []) {
      if (!reverseGraph.has(neighbor)) reverseGraph.set(neighbor, []);
      reverseGraph.get(neighbor)!.push(node);
    }
  }

  // Second DFS on reverse graph in reverse finish order
  visited.clear();
  const components: number[][] = [];

  function dfs2(node: number, component: number[]): void {
    visited.add(node);
    component.push(node);
    for (const neighbor of reverseGraph.get(node) || []) {
      if (!visited.has(neighbor)) {
        dfs2(neighbor, component);
      }
    }
  }

  while (order.length > 0) {
    const node = order.pop()!;
    if (!visited.has(node)) {
      const component: number[] = [];
      dfs2(node, component);
      components.push(component);
    }
  }

  return components;
}

// Condensation graph (DAG of SCCs)
export function condensationGraph(
  graph: Graph,
  sccResult: SCCResult
): Graph {
  const condensed: Graph = new Map();
  const numComponents = sccResult.components.length;

  for (let i = 0; i < numComponents; i++) {
    condensed.set(i, []);
  }

  const addedEdges = new Set<string>();

  for (const [node, neighbors] of graph) {
    const srcComponent = sccResult.componentMap.get(node)!;
    for (const neighbor of neighbors) {
      const dstComponent = sccResult.componentMap.get(neighbor)!;
      if (srcComponent !== dstComponent) {
        const edgeKey = `${srcComponent}-${dstComponent}`;
        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          condensed.get(srcComponent)!.push(dstComponent);
        }
      }
    }
  }

  return condensed;
}

// Check if graph is strongly connected
export function isStronglyConnected(graph: Graph): boolean {
  const result = tarjanSCC(graph);
  return result.components.length === 1;
}

// Find articulation points (cut vertices)
export function findArticulationPoints(
  n: number,
  edges: [number, number][]
): number[] {
  const graph: Graph = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  const visited = new Set<number>();
  const disc = new Map<number, number>();
  const low = new Map<number, number>();
  const parent = new Map<number, number>();
  const ap = new Set<number>();
  let time = 0;

  function dfs(u: number): void {
    let children = 0;
    visited.add(u);
    disc.set(u, time);
    low.set(u, time);
    time++;

    for (const v of graph.get(u) || []) {
      if (!visited.has(v)) {
        children++;
        parent.set(v, u);
        dfs(v);

        low.set(u, Math.min(low.get(u)!, low.get(v)!));

        // u is an articulation point if:
        // 1. u is root and has two or more children
        // 2. u is not root and low[v] >= disc[u]
        if (!parent.has(u) && children > 1) {
          ap.add(u);
        }
        if (parent.has(u) && low.get(v)! >= disc.get(u)!) {
          ap.add(u);
        }
      } else if (v !== parent.get(u)) {
        low.set(u, Math.min(low.get(u)!, disc.get(v)!));
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      dfs(i);
    }
  }

  return Array.from(ap);
}

// Find bridges (cut edges)
export function findBridges(
  n: number,
  edges: [number, number][]
): [number, number][] {
  const graph: Graph = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  const visited = new Set<number>();
  const disc = new Map<number, number>();
  const low = new Map<number, number>();
  const parent = new Map<number, number>();
  const bridges: [number, number][] = [];
  let time = 0;

  function dfs(u: number): void {
    visited.add(u);
    disc.set(u, time);
    low.set(u, time);
    time++;

    for (const v of graph.get(u) || []) {
      if (!visited.has(v)) {
        parent.set(v, u);
        dfs(v);

        low.set(u, Math.min(low.get(u)!, low.get(v)!));

        if (low.get(v)! > disc.get(u)!) {
          bridges.push([u, v]);
        }
      } else if (v !== parent.get(u)) {
        low.set(u, Math.min(low.get(u)!, disc.get(v)!));
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      dfs(i);
    }
  }

  return bridges;
}

export function demo(): string {
  console.log('SCC Algorithms Demo');
  console.log('===================');

  const graph: Graph = new Map([
    [0, [1]],
    [1, [2]],
    [2, [0, 3]],
    [3, [4]],
    [4, [5]],
    [5, [3]],
  ]);

  console.log('Graph:');
  for (const [node, neighbors] of graph) {
    console.log(`  ${node} → [${neighbors.join(', ')}]`);
  }

  const tarjanResult = tarjanSCC(graph);
  console.log("\nTarjan's SCCs:", tarjanResult.components);

  const kosarajuResult = kosarajuSCC(graph);
  console.log("Kosaraju's SCCs:", kosarajuResult);

  console.log('Is strongly connected:', isStronglyConnected(graph));

  return `SCCs: ${tarjanResult.components.map(c => `[${c.join(',')}]`).join(', ')}`;
}
