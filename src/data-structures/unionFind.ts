/**
 * Union-Find (Disjoint Set Union)
 *
 * Summary: Data structure for tracking disjoint sets.
 * Operations: Find O(α(n)), Union O(α(n)) where α is inverse Ackermann
 * Space: O(n)
 * Use: Kruskal's MST, connected components, equivalence classes.
 */

export class UnionFind {
  private parent: number[];
  private rank: number[];
  private size: number[];
  private count: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.size = Array(n).fill(1);
    this.count = n;
  }

  // Find with path compression
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  // Union by rank
  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.rank[rootX]++;
    }

    this.count--;
    return true;
  }

  // Check if x and y are connected
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }

  // Get number of disjoint sets
  getCount(): number {
    return this.count;
  }

  // Get size of set containing x
  getSize(x: number): number {
    return this.size[this.find(x)];
  }

  // Get all elements in the same set as x
  getSet(x: number): number[] {
    const root = this.find(x);
    const result: number[] = [];
    for (let i = 0; i < this.parent.length; i++) {
      if (this.find(i) === root) {
        result.push(i);
      }
    }
    return result;
  }

  // Get all sets
  getAllSets(): number[][] {
    const sets = new Map<number, number[]>();
    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      if (!sets.has(root)) {
        sets.set(root, []);
      }
      sets.get(root)!.push(i);
    }
    return Array.from(sets.values());
  }
}

// Weighted Union-Find (with path weight tracking)
export class WeightedUnionFind {
  private parent: number[];
  private weight: number[]; // weight[i] = weight of edge from i to parent[i]

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.weight = Array(n).fill(0);
  }

  find(x: number): { root: number; weight: number } {
    if (this.parent[x] !== x) {
      const result = this.find(this.parent[x]);
      this.weight[x] += result.weight;
      this.parent[x] = result.root;
    }
    return { root: this.parent[x], weight: this.weight[x] };
  }

  // Union with weight: weight of x relative to y is w
  // i.e., value[x] - value[y] = w
  union(x: number, y: number, w: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);

    if (rx.root === ry.root) {
      // Check consistency
      return Math.abs(rx.weight - ry.weight - w) < 1e-9;
    }

    this.parent[rx.root] = ry.root;
    this.weight[rx.root] = ry.weight - rx.weight + w;
    return true;
  }

  // Get relative weight between x and y
  getRelativeWeight(x: number, y: number): number | null {
    const rx = this.find(x);
    const ry = this.find(y);

    if (rx.root !== ry.root) return null;
    return rx.weight - ry.weight;
  }
}

// Union-Find with rollback (for offline queries)
export class UnionFindWithRollback {
  private parent: number[];
  private rank: number[];
  private history: { x: number; px: number; rankX: number }[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.history = [];
  }

  find(x: number): number {
    while (this.parent[x] !== x) {
      x = this.parent[x];
    }
    return x;
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    // Always attach smaller rank to larger
    if (this.rank[rootX] < this.rank[rootY]) {
      this.history.push({ x: rootX, px: this.parent[rootX], rankX: this.rank[rootX] });
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.history.push({ x: rootY, px: this.parent[rootY], rankX: this.rank[rootY] });
      this.parent[rootY] = rootX;
    } else {
      this.history.push({ x: rootY, px: this.parent[rootY], rankX: this.rank[rootY] });
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }

  save(): number {
    return this.history.length;
  }

  rollback(checkpoint: number): void {
    while (this.history.length > checkpoint) {
      const { x, px, rankX } = this.history.pop()!;
      this.parent[x] = px;
      this.rank[x] = rankX;
    }
  }
}

export function demo(): string {
  console.log('Union-Find Demo');
  console.log('===============');

  const uf = new UnionFind(10);

  console.log('Initial sets:', uf.getCount());

  uf.union(0, 1);
  uf.union(2, 3);
  uf.union(0, 2);
  uf.union(4, 5);
  uf.union(6, 7);
  uf.union(5, 6);

  console.log('After unions:', uf.getCount());
  console.log('0 and 3 connected:', uf.connected(0, 3));
  console.log('0 and 4 connected:', uf.connected(0, 4));
  console.log('4 and 7 connected:', uf.connected(4, 7));

  console.log('\nAll sets:');
  uf.getAllSets().forEach((set, i) => console.log(`  Set ${i}: [${set.join(', ')}]`));

  return `Number of disjoint sets: ${uf.getCount()}`;
}
