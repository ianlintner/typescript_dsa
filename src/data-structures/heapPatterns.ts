/**
 * Heap Patterns
 *
 * Common heap-based patterns for interviews.
 */

// Min-Heap implementation
export class MinHeap<T> {
  private heap: T[];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number = (a: T, b: T) => (a as number) - (b as number)) {
    this.heap = [];
    this.compare = compare;
  }

  push(value: T): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return min;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

// Max-Heap
export class MaxHeap<T> extends MinHeap<T> {
  constructor(compare: (a: T, b: T) => number = (a: T, b: T) => (b as number) - (a as number)) {
    super(compare);
  }
}

// Median Finder using two heaps
export class MedianFinder {
  private maxHeap: MaxHeap<number>; // Left half (smaller elements)
  private minHeap: MinHeap<number>; // Right half (larger elements)

  constructor() {
    this.maxHeap = new MaxHeap<number>();
    this.minHeap = new MinHeap<number>();
  }

  addNum(num: number): void {
    // Add to max heap first
    this.maxHeap.push(num);

    // Move largest from max heap to min heap
    this.minHeap.push(this.maxHeap.pop()!);

    // Balance: max heap should have equal or one more element
    if (this.minHeap.size() > this.maxHeap.size()) {
      this.maxHeap.push(this.minHeap.pop()!);
    }
  }

  findMedian(): number {
    if (this.maxHeap.size() > this.minHeap.size()) {
      return this.maxHeap.peek()!;
    }
    return (this.maxHeap.peek()! + this.minHeap.peek()!) / 2;
  }
}

// K Largest Elements
export function kLargest(arr: number[], k: number): number[] {
  const minHeap = new MinHeap<number>();

  for (const num of arr) {
    minHeap.push(num);
    if (minHeap.size() > k) {
      minHeap.pop();
    }
  }

  const result: number[] = [];
  while (!minHeap.isEmpty()) {
    result.push(minHeap.pop()!);
  }
  return result.reverse();
}

// K Smallest Elements
export function kSmallest(arr: number[], k: number): number[] {
  const maxHeap = new MaxHeap<number>();

  for (const num of arr) {
    maxHeap.push(num);
    if (maxHeap.size() > k) {
      maxHeap.pop();
    }
  }

  const result: number[] = [];
  while (!maxHeap.isEmpty()) {
    result.push(maxHeap.pop()!);
  }
  return result.reverse();
}

// Merge K Sorted Arrays
export function mergeKSortedArrays(arrays: number[][]): number[] {
  type HeapItem = { value: number; arrayIndex: number; elementIndex: number };

  const minHeap = new MinHeap<HeapItem>((a, b) => a.value - b.value);
  const result: number[] = [];

  // Initialize with first element from each array
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) {
      minHeap.push({ value: arrays[i][0], arrayIndex: i, elementIndex: 0 });
    }
  }

  while (!minHeap.isEmpty()) {
    const { value, arrayIndex, elementIndex } = minHeap.pop()!;
    result.push(value);

    // Add next element from same array
    if (elementIndex + 1 < arrays[arrayIndex].length) {
      minHeap.push({
        value: arrays[arrayIndex][elementIndex + 1],
        arrayIndex,
        elementIndex: elementIndex + 1,
      });
    }
  }

  return result;
}

// Top K Frequent Elements
export function topKFrequent(nums: number[], k: number): number[] {
  // Count frequencies
  const freq = new Map<number, number>();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Use min heap of size k
  type FreqItem = { num: number; count: number };
  const minHeap = new MinHeap<FreqItem>((a, b) => a.count - b.count);

  for (const [num, count] of freq) {
    minHeap.push({ num, count });
    if (minHeap.size() > k) {
      minHeap.pop();
    }
  }

  const result: number[] = [];
  while (!minHeap.isEmpty()) {
    result.push(minHeap.pop()!.num);
  }
  return result;
}

export function demo(): string {
  console.log('Heap Patterns Demo');
  console.log('==================');

  console.log('Min Heap:');
  const minHeap = new MinHeap<number>();
  [5, 2, 8, 1, 9, 3].forEach((n) => minHeap.push(n));
  const minOrder: number[] = [];
  while (!minHeap.isEmpty()) {
    minOrder.push(minHeap.pop()!);
  }
  console.log('  Sorted:', minOrder);

  console.log('\nMedian Finder:');
  const mf = new MedianFinder();
  [1, 2, 3, 4, 5].forEach((n) => {
    mf.addNum(n);
    console.log(`  After adding ${n}: median = ${mf.findMedian()}`);
  });

  console.log('\nK Largest (k=3):');
  const arr = [3, 1, 4, 1, 5, 9, 2, 6];
  console.log('  Array:', arr);
  console.log('  3 largest:', kLargest(arr, 3));

  console.log('\nMerge K Sorted Arrays:');
  const arrays = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];
  console.log('  Arrays:', arrays);
  console.log('  Merged:', mergeKSortedArrays(arrays));

  console.log('\nTop K Frequent:');
  const nums = [1, 1, 1, 2, 2, 3];
  console.log('  Array:', nums);
  console.log('  Top 2 frequent:', topKFrequent(nums, 2));

  return `K largest: [${kLargest(arr, 3).join(', ')}]`;
}
