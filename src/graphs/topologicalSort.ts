/**
 * Topological Sort
 *
 * Summary: Order vertices such that for every edge (u,v), u comes before v.
 * Time: O(V+E)
 * Space: O(V)
 * Notes: Only works on DAGs (Directed Acyclic Graphs).
 */

import type { Graph } from './bfsDfs';

export interface TopSortStep {
  inDegree: Map<number, number>;
  queue: number[];
  result: number[];
  current: number | null;
  description: string;
}

// Kahn's Algorithm (BFS-based)
export function topologicalSortKahn(graph: Graph): number[] | null {
  const inDegree = new Map<number, number>();
  const result: number[] = [];

  // Initialize in-degrees
  for (const node of graph.keys()) {
    if (!inDegree.has(node)) inDegree.set(node, 0);
    for (const neighbor of graph.get(node) || []) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
    }
  }

  // Add all nodes with in-degree 0 to queue
  const queue: number[] = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) queue.push(node);
  }

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    for (const neighbor of graph.get(node) || []) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If result doesn't contain all nodes, there's a cycle
  if (result.length !== graph.size) {
    return null;
  }

  return result;
}

export function topologicalSortKahnWithSteps(graph: Graph): TopSortStep[] {
  const steps: TopSortStep[] = [];
  const inDegree = new Map<number, number>();
  const result: number[] = [];

  // Initialize in-degrees
  for (const node of graph.keys()) {
    if (!inDegree.has(node)) inDegree.set(node, 0);
    for (const neighbor of graph.get(node) || []) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
    }
  }

  steps.push({
    inDegree: new Map(inDegree),
    queue: [],
    result: [],
    current: null,
    description: 'Calculated in-degrees for all nodes',
  });

  // Add all nodes with in-degree 0 to queue
  const queue: number[] = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) queue.push(node);
  }

  steps.push({
    inDegree: new Map(inDegree),
    queue: [...queue],
    result: [...result],
    current: null,
    description: `Nodes with in-degree 0: [${queue.join(', ')}]`,
  });

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    steps.push({
      inDegree: new Map(inDegree),
      queue: [...queue],
      result: [...result],
      current: node,
      description: `Processing node ${node}`,
    });

    for (const neighbor of graph.get(node) || []) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);

      if (newDegree === 0) {
        queue.push(neighbor);
        steps.push({
          inDegree: new Map(inDegree),
          queue: [...queue],
          result: [...result],
          current: node,
          description: `Decreased in-degree of ${neighbor} to 0, added to queue`,
        });
      }
    }
  }

  if (result.length !== graph.size) {
    steps.push({
      inDegree: new Map(inDegree),
      queue: [],
      result: [...result],
      current: null,
      description: 'Cycle detected! Topological sort not possible.',
    });
  } else {
    steps.push({
      inDegree: new Map(inDegree),
      queue: [],
      result: [...result],
      current: null,
      description: `Topological sort complete: [${result.join(', ')}]`,
    });
  }

  return steps;
}

// DFS-based topological sort
export function topologicalSortDFS(graph: Graph): number[] | null {
  const visited = new Set<number>();
  const recStack = new Set<number>();
  const result: number[] = [];
  let hasCycle = false;

  function dfs(node: number): void {
    if (hasCycle) return;

    visited.add(node);
    recStack.add(node);

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      } else if (recStack.has(neighbor)) {
        hasCycle = true;
        return;
      }
    }

    recStack.delete(node);
    result.unshift(node);
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(node);
      if (hasCycle) return null;
    }
  }

  return result;
}

// All topological orderings (for small graphs)
export function allTopologicalOrders(graph: Graph): number[][] {
  const inDegree = new Map<number, number>();
  const allOrders: number[][] = [];

  // Initialize in-degrees
  for (const node of graph.keys()) {
    if (!inDegree.has(node)) inDegree.set(node, 0);
    for (const neighbor of graph.get(node) || []) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
    }
  }

  const visited = new Set<number>();
  const currentOrder: number[] = [];

  function backtrack(): void {
    let foundZero = false;

    for (const [node, degree] of inDegree) {
      if (!visited.has(node) && degree === 0) {
        foundZero = true;

        // Include this node
        visited.add(node);
        currentOrder.push(node);

        // Decrease in-degrees
        for (const neighbor of graph.get(node) || []) {
          inDegree.set(neighbor, (inDegree.get(neighbor) || 1) - 1);
        }

        backtrack();

        // Backtrack
        visited.delete(node);
        currentOrder.pop();
        for (const neighbor of graph.get(node) || []) {
          inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
        }
      }
    }

    if (!foundZero && currentOrder.length === graph.size) {
      allOrders.push([...currentOrder]);
    }
  }

  backtrack();
  return allOrders;
}

// Check if graph has a valid topological order (is a DAG)
export function isDAG(graph: Graph): boolean {
  return topologicalSortKahn(graph) !== null;
}

export function demo(): string {
  console.log('Topological Sort Demo');
  console.log('=====================');

  // Course schedule example
  const graph: Graph = new Map([
    [0, [1, 2]], // Course 0 is prerequisite for 1, 2
    [1, [3]],    // Course 1 is prerequisite for 3
    [2, [3]],    // Course 2 is prerequisite for 3
    [3, [4]],    // Course 3 is prerequisite for 4
    [4, []],     // Course 4 has no prerequisites
  ]);

  console.log('Course dependencies:');
  for (const [course, deps] of graph) {
    console.log(`  Course ${course} → [${deps.join(', ')}]`);
  }

  const kahnOrder = topologicalSortKahn(graph);
  console.log("\nKahn's algorithm:", kahnOrder?.join(' → '));

  const dfsOrder = topologicalSortDFS(graph);
  console.log('DFS-based:', dfsOrder?.join(' → '));

  console.log('Is DAG:', isDAG(graph));

  return `Topological order: ${kahnOrder?.join(' → ')}`;
}
