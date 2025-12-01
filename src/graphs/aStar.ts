/**
 * A* Search Algorithm
 *
 * Summary: A* search using f(n)=g(n)+h(n) with admissible heuristic.
 * Time: Depends on heuristic; up to O(b^d) worst-case
 * Space: O(b^d) for open/closed sets
 * Notes: Admissible and consistent heuristics ensure optimality; common h: Manhattan/Euclidean.
 */

export interface AStarStep {
  openSet: [number, number][];
  closedSet: Set<string>;
  current: [number, number] | null;
  gScore: Map<string, number>;
  fScore: Map<string, number>;
  cameFrom: Map<string, string>;
  description: string;
}

export interface AStarResult {
  path: [number, number][];
  distance: number;
  nodesExplored: number;
}

type Heuristic = (a: [number, number], b: [number, number]) => number;

export const manhattanDistance: Heuristic = (a, b) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

export const euclideanDistance: Heuristic = (a, b) =>
  Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));

export const chebyshevDistance: Heuristic = (a, b) =>
  Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));

export function aStar(
  grid: number[][],
  start: [number, number],
  end: [number, number],
  heuristic: Heuristic = manhattanDistance
): AStarResult | null {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const key = (r: number, c: number) => `${r},${c}`;
  const startKey = key(start[0], start[1]);
  const endKey = key(end[0], end[1]);

  const openSet = new Map<string, [number, number]>();
  openSet.set(startKey, start);

  const closedSet = new Set<string>();
  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  gScore.set(startKey, 0);

  const fScore = new Map<string, number>();
  fScore.set(startKey, heuristic(start, end));

  let nodesExplored = 0;

  while (openSet.size > 0) {
    // Get node with lowest fScore
    let current: [number, number] | null = null;
    let currentKey = '';
    let lowestF = Infinity;

    for (const [k, pos] of openSet) {
      const f = fScore.get(k) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        current = pos;
        currentKey = k;
      }
    }

    if (!current) break;
    nodesExplored++;

    if (currentKey === endKey) {
      // Reconstruct path
      const path: [number, number][] = [];
      let curr = endKey;
      while (curr) {
        const [r, c] = curr.split(',').map(Number);
        path.unshift([r, c]);
        curr = cameFrom.get(curr)!;
      }
      return {
        path,
        distance: gScore.get(endKey)!,
        nodesExplored,
      };
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    for (const [dr, dc] of directions) {
      const newRow = current[0] + dr;
      const newCol = current[1] + dc;
      const neighborKey = key(newRow, newCol);

      if (
        newRow < 0 ||
        newRow >= rows ||
        newCol < 0 ||
        newCol >= cols ||
        grid[newRow][newCol] === 1 ||
        closedSet.has(neighborKey)
      ) {
        continue;
      }

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;

      if (!openSet.has(neighborKey)) {
        openSet.set(neighborKey, [newRow, newCol]);
      } else if (tentativeG >= (gScore.get(neighborKey) ?? Infinity)) {
        continue;
      }

      cameFrom.set(neighborKey, currentKey);
      gScore.set(neighborKey, tentativeG);
      fScore.set(neighborKey, tentativeG + heuristic([newRow, newCol], end));
    }
  }

  return null;
}

export function aStarWithSteps(
  grid: number[][],
  start: [number, number],
  end: [number, number],
  heuristic: Heuristic = manhattanDistance
): AStarStep[] {
  const steps: AStarStep[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const key = (r: number, c: number) => `${r},${c}`;
  const startKey = key(start[0], start[1]);
  const endKey = key(end[0], end[1]);

  const openSet = new Map<string, [number, number]>();
  openSet.set(startKey, start);

  const closedSet = new Set<string>();
  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  gScore.set(startKey, 0);

  const fScore = new Map<string, number>();
  fScore.set(startKey, heuristic(start, end));

  steps.push({
    openSet: Array.from(openSet.values()),
    closedSet: new Set(closedSet),
    current: start,
    gScore: new Map(gScore),
    fScore: new Map(fScore),
    cameFrom: new Map(cameFrom),
    description: `Starting A* search from (${start[0]}, ${start[1]}) to (${end[0]}, ${end[1]})`,
  });

  while (openSet.size > 0) {
    let current: [number, number] | null = null;
    let currentKey = '';
    let lowestF = Infinity;

    for (const [k, pos] of openSet) {
      const f = fScore.get(k) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        current = pos;
        currentKey = k;
      }
    }

    if (!current) break;

    if (currentKey === endKey) {
      steps.push({
        openSet: Array.from(openSet.values()),
        closedSet: new Set(closedSet),
        current,
        gScore: new Map(gScore),
        fScore: new Map(fScore),
        cameFrom: new Map(cameFrom),
        description: `Found goal at (${end[0]}, ${end[1]})! Path length: ${gScore.get(endKey)}`,
      });
      break;
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    steps.push({
      openSet: Array.from(openSet.values()),
      closedSet: new Set(closedSet),
      current,
      gScore: new Map(gScore),
      fScore: new Map(fScore),
      cameFrom: new Map(cameFrom),
      description: `Exploring (${current[0]}, ${current[1]}) with f=${lowestF.toFixed(1)}`,
    });

    for (const [dr, dc] of directions) {
      const newRow = current[0] + dr;
      const newCol = current[1] + dc;
      const neighborKey = key(newRow, newCol);

      if (
        newRow < 0 ||
        newRow >= rows ||
        newCol < 0 ||
        newCol >= cols ||
        grid[newRow][newCol] === 1 ||
        closedSet.has(neighborKey)
      ) {
        continue;
      }

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;

      if (!openSet.has(neighborKey)) {
        openSet.set(neighborKey, [newRow, newCol]);
      } else if (tentativeG >= (gScore.get(neighborKey) ?? Infinity)) {
        continue;
      }

      cameFrom.set(neighborKey, currentKey);
      gScore.set(neighborKey, tentativeG);
      const h = heuristic([newRow, newCol], end);
      fScore.set(neighborKey, tentativeG + h);
    }
  }

  return steps;
}

// Greedy Best-First Search (uses only heuristic, no g-score)
export function greedyBestFirst(
  grid: number[][],
  start: [number, number],
  end: [number, number],
  heuristic: Heuristic = manhattanDistance
): AStarResult | null {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const key = (r: number, c: number) => `${r},${c}`;
  const endKey = key(end[0], end[1]);

  const openSet: [number, [number, number]][] = [[heuristic(start, end), start]];
  const closedSet = new Set<string>();
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  gScore.set(key(start[0], start[1]), 0);

  let nodesExplored = 0;

  while (openSet.length > 0) {
    openSet.sort((a, b) => a[0] - b[0]);
    const [, current] = openSet.shift()!;
    const currentKey = key(current[0], current[1]);

    if (closedSet.has(currentKey)) continue;
    closedSet.add(currentKey);
    nodesExplored++;

    if (currentKey === endKey) {
      const path: [number, number][] = [];
      let curr = endKey;
      while (curr) {
        const [r, c] = curr.split(',').map(Number);
        path.unshift([r, c]);
        curr = cameFrom.get(curr)!;
      }
      return {
        path,
        distance: path.length - 1,
        nodesExplored,
      };
    }

    for (const [dr, dc] of directions) {
      const newRow = current[0] + dr;
      const newCol = current[1] + dc;
      const neighborKey = key(newRow, newCol);

      if (
        newRow < 0 ||
        newRow >= rows ||
        newCol < 0 ||
        newCol >= cols ||
        grid[newRow][newCol] === 1 ||
        closedSet.has(neighborKey)
      ) {
        continue;
      }

      if (!gScore.has(neighborKey)) {
        gScore.set(neighborKey, (gScore.get(currentKey) ?? 0) + 1);
        cameFrom.set(neighborKey, currentKey);
        openSet.push([heuristic([newRow, newCol], end), [newRow, newCol]]);
      }
    }
  }

  return null;
}

export function demo(): string {
  console.log('A* Algorithm Demo');
  console.log('=================');

  // 0 = passable, 1 = obstacle
  const grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
  ];

  console.log('Grid (0=path, 1=wall):');
  grid.forEach((row, i) => console.log(`  ${i}: [${row.join(', ')}]`));

  const start: [number, number] = [0, 0];
  const end: [number, number] = [4, 4];

  const result = aStar(grid, start, end);
  if (result) {
    console.log(`\nPath found! Distance: ${result.distance}`);
    console.log('Path:', result.path.map((p) => `(${p[0]},${p[1]})`).join(' → '));
    console.log('Nodes explored:', result.nodesExplored);
  } else {
    console.log('No path found');
  }

  return result
    ? `A* path: ${result.path.map((p) => `(${p[0]},${p[1]})`).join(' → ')}`
    : 'No path found';
}
