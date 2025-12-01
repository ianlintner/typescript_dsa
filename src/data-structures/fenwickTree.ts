/**
 * Fenwick Tree (Binary Indexed Tree)
 *
 * Summary: Efficient prefix sum and point update data structure.
 * Build: O(n), Update: O(log n), Query: O(log n)
 * Space: O(n)
 * Use: Prefix sums, range updates, counting inversions.
 */

export class FenwickTree {
  private tree: number[];
  private n: number;

  constructor(size: number);
  constructor(arr: number[]);
  constructor(arg: number | number[]) {
    if (typeof arg === 'number') {
      this.n = arg;
      this.tree = new Array(arg + 1).fill(0);
    } else {
      this.n = arg.length;
      this.tree = new Array(this.n + 1).fill(0);
      for (let i = 0; i < arg.length; i++) {
        this.update(i, arg[i]);
      }
    }
  }

  // Add delta to index i (0-indexed)
  update(i: number, delta: number): void {
    i++; // Convert to 1-indexed
    while (i <= this.n) {
      this.tree[i] += delta;
      i += i & -i; // Add LSB
    }
  }

  // Set value at index i (0-indexed)
  set(i: number, value: number): void {
    const current = this.query(i, i);
    this.update(i, value - current);
  }

  // Sum from 0 to i (inclusive, 0-indexed)
  prefixSum(i: number): number {
    i++; // Convert to 1-indexed
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & -i; // Remove LSB
    }
    return sum;
  }

  // Sum from l to r (inclusive, 0-indexed)
  query(l: number, r: number): number {
    if (l > r) return 0;
    if (l === 0) return this.prefixSum(r);
    return this.prefixSum(r) - this.prefixSum(l - 1);
  }

  // Find smallest index i such that prefixSum(i) >= target (0-indexed)
  // Useful for finding k-th element when tree stores frequencies
  findFirst(target: number): number {
    let i = 0;
    let sum = 0;
    let mask = this.highestOneBit(this.n);

    while (mask > 0) {
      const next = i + mask;
      if (next <= this.n && sum + this.tree[next] < target) {
        i = next;
        sum += this.tree[next];
      }
      mask >>= 1;
    }

    return i; // 0-indexed
  }

  private highestOneBit(n: number): number {
    let bit = 1;
    while (bit <= n) bit <<= 1;
    return bit >> 1;
  }
}

// 2D Fenwick Tree
export class FenwickTree2D {
  private tree: number[][];
  private rows: number;
  private cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.tree = Array.from({ length: rows + 1 }, () =>
      new Array(cols + 1).fill(0)
    );
  }

  update(r: number, c: number, delta: number): void {
    r++;
    c++;
    let i = r;
    while (i <= this.rows) {
      let j = c;
      while (j <= this.cols) {
        this.tree[i][j] += delta;
        j += j & -j;
      }
      i += i & -i;
    }
  }

  // Sum from (0,0) to (r,c) inclusive
  prefixSum(r: number, c: number): number {
    r++;
    c++;
    let sum = 0;
    let i = r;
    while (i > 0) {
      let j = c;
      while (j > 0) {
        sum += this.tree[i][j];
        j -= j & -j;
      }
      i -= i & -i;
    }
    return sum;
  }

  // Sum from (r1,c1) to (r2,c2) inclusive
  query(r1: number, c1: number, r2: number, c2: number): number {
    let sum = this.prefixSum(r2, c2);
    if (r1 > 0) sum -= this.prefixSum(r1 - 1, c2);
    if (c1 > 0) sum -= this.prefixSum(r2, c1 - 1);
    if (r1 > 0 && c1 > 0) sum += this.prefixSum(r1 - 1, c1 - 1);
    return sum;
  }
}

// Range update, point query Fenwick Tree
export class RangeUpdateFenwickTree {
  private tree: FenwickTree;

  constructor(size: number) {
    this.tree = new FenwickTree(size);
  }

  // Add delta to all elements from l to r (inclusive)
  rangeUpdate(l: number, r: number, delta: number): void {
    this.tree.update(l, delta);
    this.tree.update(r + 1, -delta);
  }

  // Get value at index i
  pointQuery(i: number): number {
    return this.tree.prefixSum(i);
  }
}

// Count inversions in an array using Fenwick Tree
export function countInversions(arr: number[]): number {
  // Coordinate compression
  const sorted = [...new Set(arr)].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  sorted.forEach((val, i) => rank.set(val, i));

  const n = sorted.length;
  const bit = new FenwickTree(n);
  let inversions = 0;

  // Process from right to left
  for (let i = arr.length - 1; i >= 0; i--) {
    const r = rank.get(arr[i])!;
    inversions += bit.prefixSum(r - 1); // Count elements smaller than arr[i] seen so far
    bit.update(r, 1);
  }

  return inversions;
}

export function demo(): string {
  console.log('Fenwick Tree Demo');
  console.log('=================');

  const arr = [1, 3, 5, 7, 9, 11];
  console.log('Array:', arr);

  const bit = new FenwickTree(arr);

  console.log('\nPrefix sums:');
  for (let i = 0; i < arr.length; i++) {
    console.log(`  prefixSum(${i}) = ${bit.prefixSum(i)}`);
  }

  console.log('\nRange queries:');
  console.log('  query(1, 3) =', bit.query(1, 3));
  console.log('  query(2, 5) =', bit.query(2, 5));

  console.log('\nUpdate: arr[2] += 10');
  bit.update(2, 10);
  console.log('  query(0, 5) =', bit.prefixSum(5));

  console.log('\nCount inversions:');
  const invArr = [3, 1, 2, 5, 4];
  console.log('  Array:', invArr);
  console.log('  Inversions:', countInversions(invArr));

  return `prefixSum(5) = ${bit.prefixSum(5)}`;
}
