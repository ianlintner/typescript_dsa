/**
 * BFS and DFS Graph Traversal
 *
 * BFS Time: O(V+E), Space: O(V) queue; shortest paths in unweighted graphs.
 * DFS Time: O(V+E), Space: O(V) stack; useful for cycles, topological order, components.
 */

export type Graph = Map<number, number[]>;

export interface TraversalStep {
  visited: Set<number>;
  queue?: number[];
  stack?: number[];
  current: number | null;
  description: string;
  level?: number;
  parent?: Map<number, number>;
}

export function bfs(graph: Graph, start: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];
  const queue: number[] = [start];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}

export function bfsWithSteps(graph: Graph, start: number): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const visited = new Set<number>();
  const queue: number[] = [start];
  const parent = new Map<number, number>();
  const level = new Map<number, number>();

  visited.add(start);
  level.set(start, 0);

  steps.push({
    visited: new Set(visited),
    queue: [...queue],
    current: start,
    level: 0,
    parent: new Map(parent),
    description: `Starting BFS from node ${start}`,
  });

  while (queue.length > 0) {
    const node = queue.shift()!;
    const currentLevel = level.get(node) || 0;

    steps.push({
      visited: new Set(visited),
      queue: [...queue],
      current: node,
      level: currentLevel,
      parent: new Map(parent),
      description: `Visiting node ${node} at level ${currentLevel}`,
    });

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        parent.set(neighbor, node);
        level.set(neighbor, currentLevel + 1);

        steps.push({
          visited: new Set(visited),
          queue: [...queue],
          current: node,
          level: currentLevel,
          parent: new Map(parent),
          description: `Discovered node ${neighbor} from ${node}, added to queue`,
        });
      }
    }
  }

  steps.push({
    visited: new Set(visited),
    queue: [],
    current: null,
    parent: new Map(parent),
    description: `BFS complete. Visited ${visited.size} nodes.`,
  });

  return steps;
}

export function dfs(graph: Graph, start: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];

  function dfsHelper(node: number): void {
    visited.add(node);
    result.push(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  }

  dfsHelper(start);
  return result;
}

export function dfsIterative(graph: Graph, start: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];
  const stack: number[] = [start];

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);

      const neighbors = graph.get(node) || [];
      // Add in reverse order to maintain left-to-right order
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i])) {
          stack.push(neighbors[i]);
        }
      }
    }
  }

  return result;
}

export function dfsWithSteps(graph: Graph, start: number): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const visited = new Set<number>();
  const stack: number[] = [start];
  const parent = new Map<number, number>();

  steps.push({
    visited: new Set(visited),
    stack: [...stack],
    current: start,
    parent: new Map(parent),
    description: `Starting DFS from node ${start}`,
  });

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (!visited.has(node)) {
      visited.add(node);

      steps.push({
        visited: new Set(visited),
        stack: [...stack],
        current: node,
        parent: new Map(parent),
        description: `Visiting node ${node}`,
      });

      const neighbors = graph.get(node) || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          if (!parent.has(neighbor)) {
            parent.set(neighbor, node);
          }

          steps.push({
            visited: new Set(visited),
            stack: [...stack],
            current: node,
            parent: new Map(parent),
            description: `Added neighbor ${neighbor} to stack`,
          });
        }
      }
    }
  }

  steps.push({
    visited: new Set(visited),
    stack: [],
    current: null,
    parent: new Map(parent),
    description: `DFS complete. Visited ${visited.size} nodes.`,
  });

  return steps;
}

// Find shortest path using BFS (unweighted graph)
export function shortestPath(
  graph: Graph,
  start: number,
  end: number
): number[] | null {
  if (start === end) return [start];

  const visited = new Set<number>();
  const queue: number[] = [start];
  const parent = new Map<number, number>();

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift()!;

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, node);

        if (neighbor === end) {
          // Reconstruct path
          const path: number[] = [end];
          let current = end;
          while (parent.has(current)) {
            current = parent.get(current)!;
            path.unshift(current);
          }
          return path;
        }

        queue.push(neighbor);
      }
    }
  }

  return null;
}

// Detect cycle in directed graph using DFS
export function hasCycle(graph: Graph): boolean {
  const visited = new Set<number>();
  const recStack = new Set<number>();

  function hasCycleHelper(node: number): boolean {
    visited.add(node);
    recStack.add(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycleHelper(neighbor)) {
          return true;
        }
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(node);
    return false;
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      if (hasCycleHelper(node)) {
        return true;
      }
    }
  }

  return false;
}

// Count connected components in undirected graph
export function countComponents(graph: Graph, numNodes: number): number {
  const visited = new Set<number>();
  let count = 0;

  for (let i = 0; i < numNodes; i++) {
    if (!visited.has(i)) {
      bfsComponent(graph, i, visited);
      count++;
    }
  }

  return count;
}

function bfsComponent(graph: Graph, start: number, visited: Set<number>): void {
  const queue: number[] = [start];
  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift()!;
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

export function demo(): string {
  console.log('BFS/DFS Demo');
  console.log('============');

  const graph: Graph = new Map([
    [0, [1, 2]],
    [1, [0, 3, 4]],
    [2, [0, 5]],
    [3, [1]],
    [4, [1, 5]],
    [5, [2, 4]],
  ]);

  console.log('Graph adjacency list:');
  for (const [node, neighbors] of graph) {
    console.log(`  ${node}: [${neighbors.join(', ')}]`);
  }

  console.log('\nBFS from 0:', bfs(graph, 0));
  console.log('DFS from 0:', dfs(graph, 0));
  console.log('Shortest path 0->5:', shortestPath(graph, 0, 5));

  return `BFS: [${bfs(graph, 0).join(', ')}], DFS: [${dfs(graph, 0).join(', ')}]`;
}
