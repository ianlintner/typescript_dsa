/**
 * Segment Tree
 *
 * Summary: Tree structure for range queries and updates.
 * Build: O(n), Query: O(log n), Update: O(log n)
 * Space: O(n)
 * Use: Range min/max/sum/gcd, lazy propagation for range updates.
 */

type CombineFunction<T> = (a: T, b: T) => T;

export class SegmentTree<T> {
  private tree: T[];
  private n: number;
  private combine: CombineFunction<T>;
  private identity: T;

  constructor(
    arr: T[],
    combine: CombineFunction<T>,
    identity: T
  ) {
    this.n = arr.length;
    this.combine = combine;
    this.identity = identity;
    this.tree = new Array(4 * this.n).fill(identity);
    if (this.n > 0) {
      this.build(arr, 1, 0, this.n - 1);
    }
  }

  private build(arr: T[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(arr, 2 * node, start, mid);
      this.build(arr, 2 * node + 1, mid + 1, end);
      this.tree[node] = this.combine(this.tree[2 * node], this.tree[2 * node + 1]);
    }
  }

  // Update index i to value
  update(i: number, value: T): void {
    this.updateHelper(1, 0, this.n - 1, i, value);
  }

  private updateHelper(
    node: number,
    start: number,
    end: number,
    i: number,
    value: T
  ): void {
    if (start === end) {
      this.tree[node] = value;
    } else {
      const mid = Math.floor((start + end) / 2);
      if (i <= mid) {
        this.updateHelper(2 * node, start, mid, i, value);
      } else {
        this.updateHelper(2 * node + 1, mid + 1, end, i, value);
      }
      this.tree[node] = this.combine(this.tree[2 * node], this.tree[2 * node + 1]);
    }
  }

  // Query range [l, r]
  query(l: number, r: number): T {
    return this.queryHelper(1, 0, this.n - 1, l, r);
  }

  private queryHelper(
    node: number,
    start: number,
    end: number,
    l: number,
    r: number
  ): T {
    if (r < start || end < l) {
      return this.identity;
    }
    if (l <= start && end <= r) {
      return this.tree[node];
    }
    const mid = Math.floor((start + end) / 2);
    const leftResult = this.queryHelper(2 * node, start, mid, l, r);
    const rightResult = this.queryHelper(2 * node + 1, mid + 1, end, l, r);
    return this.combine(leftResult, rightResult);
  }
}

// Segment Tree with Lazy Propagation
export class LazySegmentTree {
  private tree: number[];
  private lazy: number[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.lazy = new Array(4 * this.n).fill(0);
    if (this.n > 0) {
      this.build(arr, 1, 0, this.n - 1);
    }
  }

  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(arr, 2 * node, start, mid);
      this.build(arr, 2 * node + 1, mid + 1, end);
      this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }
  }

  private pushDown(node: number, start: number, end: number): void {
    if (this.lazy[node] !== 0) {
      const mid = Math.floor((start + end) / 2);
      
      // Update children
      this.tree[2 * node] += this.lazy[node] * (mid - start + 1);
      this.tree[2 * node + 1] += this.lazy[node] * (end - mid);
      
      // Mark children as lazy
      this.lazy[2 * node] += this.lazy[node];
      this.lazy[2 * node + 1] += this.lazy[node];
      
      this.lazy[node] = 0;
    }
  }

  // Range update: add delta to all elements in [l, r]
  rangeUpdate(l: number, r: number, delta: number): void {
    this.rangeUpdateHelper(1, 0, this.n - 1, l, r, delta);
  }

  private rangeUpdateHelper(
    node: number,
    start: number,
    end: number,
    l: number,
    r: number,
    delta: number
  ): void {
    if (r < start || end < l) {
      return;
    }
    
    if (l <= start && end <= r) {
      this.tree[node] += delta * (end - start + 1);
      this.lazy[node] += delta;
      return;
    }
    
    this.pushDown(node, start, end);
    
    const mid = Math.floor((start + end) / 2);
    this.rangeUpdateHelper(2 * node, start, mid, l, r, delta);
    this.rangeUpdateHelper(2 * node + 1, mid + 1, end, l, r, delta);
    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
  }

  // Query sum in range [l, r]
  query(l: number, r: number): number {
    return this.queryHelper(1, 0, this.n - 1, l, r);
  }

  private queryHelper(
    node: number,
    start: number,
    end: number,
    l: number,
    r: number
  ): number {
    if (r < start || end < l) {
      return 0;
    }
    
    if (l <= start && end <= r) {
      return this.tree[node];
    }
    
    this.pushDown(node, start, end);
    
    const mid = Math.floor((start + end) / 2);
    return (
      this.queryHelper(2 * node, start, mid, l, r) +
      this.queryHelper(2 * node + 1, mid + 1, end, l, r)
    );
  }
}

// Factory functions for common segment trees
export function createSumSegmentTree(arr: number[]): SegmentTree<number> {
  return new SegmentTree(arr, (a, b) => a + b, 0);
}

export function createMinSegmentTree(arr: number[]): SegmentTree<number> {
  return new SegmentTree(arr, Math.min, Infinity);
}

export function createMaxSegmentTree(arr: number[]): SegmentTree<number> {
  return new SegmentTree(arr, Math.max, -Infinity);
}

export function createGcdSegmentTree(arr: number[]): SegmentTree<number> {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  return new SegmentTree(arr, gcd, 0);
}

export function demo(): string {
  console.log('Segment Tree Demo');
  console.log('=================');

  const arr = [1, 3, 5, 7, 9, 11];
  console.log('Array:', arr);

  const sumTree = createSumSegmentTree(arr);
  const minTree = createMinSegmentTree(arr);
  const maxTree = createMaxSegmentTree(arr);

  console.log('\nRange queries [1, 4]:');
  console.log('  Sum:', sumTree.query(1, 4));
  console.log('  Min:', minTree.query(1, 4));
  console.log('  Max:', maxTree.query(1, 4));

  console.log('\nUpdate: arr[2] = 15');
  sumTree.update(2, 15);
  minTree.update(2, 15);
  maxTree.update(2, 15);

  console.log('Range queries [1, 4] after update:');
  console.log('  Sum:', sumTree.query(1, 4));
  console.log('  Min:', minTree.query(1, 4));
  console.log('  Max:', maxTree.query(1, 4));

  console.log('\nLazy Segment Tree demo:');
  const lazyST = new LazySegmentTree([1, 2, 3, 4, 5]);
  console.log('Initial sum [0, 4]:', lazyST.query(0, 4));
  console.log('Range update: add 10 to [1, 3]');
  lazyST.rangeUpdate(1, 3, 10);
  console.log('Sum [0, 4]:', lazyST.query(0, 4));
  console.log('Sum [1, 3]:', lazyST.query(1, 3));

  return `Sum query [1, 4] = ${sumTree.query(1, 4)}`;
}
