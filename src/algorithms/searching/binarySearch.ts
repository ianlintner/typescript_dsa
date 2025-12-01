/**
 * Binary Search
 *
 * Summary: Repeatedly halve search interval in sorted data.
 * Time: O(log n)
 * Space: O(1) iterative, O(log n) recursive
 * Requires: Monotonic/sorted sequence, random access preferred.
 */

export interface BinarySearchStep {
  array: number[];
  left: number;
  right: number;
  mid: number;
  target: number;
  found: boolean;
  description: string;
}

export function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

export function binarySearchWithSteps(
  arr: number[],
  target: number
): BinarySearchStep[] {
  const steps: BinarySearchStep[] = [];
  let left = 0;
  let right = arr.length - 1;

  steps.push({
    array: [...arr],
    left,
    right,
    mid: -1,
    target,
    found: false,
    description: `Starting binary search for ${target} in sorted array`,
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      steps.push({
        array: [...arr],
        left,
        right,
        mid,
        target,
        found: true,
        description: `Found ${target} at index ${mid}!`,
      });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({
        array: [...arr],
        left,
        right,
        mid,
        target,
        found: false,
        description: `arr[${mid}] = ${arr[mid]} < ${target}, search right half`,
      });
      left = mid + 1;
    } else {
      steps.push({
        array: [...arr],
        left,
        right,
        mid,
        target,
        found: false,
        description: `arr[${mid}] = ${arr[mid]} > ${target}, search left half`,
      });
      right = mid - 1;
    }
  }

  steps.push({
    array: [...arr],
    left,
    right,
    mid: -1,
    target,
    found: false,
    description: `${target} not found in array`,
  });

  return steps;
}

// Lower bound: first index where arr[i] >= target
export function lowerBound(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}

// Upper bound: first index where arr[i] > target
export function upperBound(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}

// Search range: find [first, last] indices of target
export function searchRange(arr: number[], target: number): [number, number] {
  const first = lowerBound(arr, target);

  if (first >= arr.length || arr[first] !== target) {
    return [-1, -1];
  }

  const last = upperBound(arr, target) - 1;
  return [first, last];
}

// Binary search in 2D sorted matrix (rows and columns sorted)
export function search2D(
  matrix: number[][],
  target: number
): [number, number] | null {
  if (matrix.length === 0 || matrix[0].length === 0) return null;

  const rows = matrix.length;
  const cols = matrix[0].length;
  let row = 0;
  let col = cols - 1;

  while (row < rows && col >= 0) {
    if (matrix[row][col] === target) {
      return [row, col];
    } else if (matrix[row][col] > target) {
      col--;
    } else {
      row++;
    }
  }

  return null;
}

export function demo(): string {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const target = 7;
  console.log('Binary Search Demo');
  console.log('==================');
  console.log('Array:', arr);
  console.log('Target:', target);
  console.log('Index:', binarySearch(arr, target));

  const arr2 = [1, 2, 2, 2, 3, 4, 5];
  console.log('\nBounds Demo:');
  console.log('Array:', arr2);
  console.log('Lower bound of 2:', lowerBound(arr2, 2));
  console.log('Upper bound of 2:', upperBound(arr2, 2));
  console.log('Search range of 2:', searchRange(arr2, 2));

  return `Found ${target} at index ${binarySearch(arr, target)}`;
}
