/**
 * Quickselect
 *
 * Summary: Partition (QuickSort-style) to find k-th statistic.
 * Time: Avg O(n), Worst O(n^2)
 * Space: O(1) extra; recursion stack O(log n) avg
 * Tip: Randomized pivots reduce worst-case likelihood. Median-of-medians -> O(n) worst-case.
 */

export function quickSelect(arr: number[], k: number): number {
  if (k < 0 || k >= arr.length) {
    throw new Error('k is out of bounds');
  }

  const result = [...arr];
  return quickSelectHelper(result, 0, result.length - 1, k);
}

function quickSelectHelper(
  arr: number[],
  left: number,
  right: number,
  k: number
): number {
  if (left === right) {
    return arr[left];
  }

  // Random pivot for better average case
  const pivotIndex =
    left + Math.floor(Math.random() * (right - left + 1));
  const newPivotIndex = partition(arr, left, right, pivotIndex);

  if (k === newPivotIndex) {
    return arr[k];
  } else if (k < newPivotIndex) {
    return quickSelectHelper(arr, left, newPivotIndex - 1, k);
  } else {
    return quickSelectHelper(arr, newPivotIndex + 1, right, k);
  }
}

function partition(
  arr: number[],
  left: number,
  right: number,
  pivotIndex: number
): number {
  const pivotValue = arr[pivotIndex];
  // Move pivot to end
  [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];

  let storeIndex = left;
  for (let i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      [arr[storeIndex], arr[i]] = [arr[i], arr[storeIndex]];
      storeIndex++;
    }
  }

  // Move pivot to its final place
  [arr[storeIndex], arr[right]] = [arr[right], arr[storeIndex]];
  return storeIndex;
}

// Find kth smallest element (1-indexed)
export function kthSmallest(arr: number[], k: number): number {
  return quickSelect(arr, k - 1);
}

// Find kth largest element (1-indexed)
export function kthLargest(arr: number[], k: number): number {
  return quickSelect(arr, arr.length - k);
}

// Find median
export function findMedian(arr: number[]): number {
  const n = arr.length;
  if (n % 2 === 1) {
    return quickSelect(arr, Math.floor(n / 2));
  } else {
    const left = quickSelect(arr, Math.floor(n / 2) - 1);
    const right = quickSelect(arr, Math.floor(n / 2));
    return (left + right) / 2;
  }
}

// Deterministic O(n) selection using median-of-medians
export function medianOfMedians(arr: number[], k: number): number {
  const result = [...arr];
  return medianOfMediansHelper(result, 0, result.length - 1, k);
}

function medianOfMediansHelper(
  arr: number[],
  left: number,
  right: number,
  k: number
): number {
  if (left === right) {
    return arr[left];
  }

  const pivotIndex = medianOfMediansPivot(arr, left, right);
  const newPivotIndex = partitionAround(arr, left, right, arr[pivotIndex]);

  if (k === newPivotIndex) {
    return arr[k];
  } else if (k < newPivotIndex) {
    return medianOfMediansHelper(arr, left, newPivotIndex - 1, k);
  } else {
    return medianOfMediansHelper(arr, newPivotIndex + 1, right, k);
  }
}

function medianOfMediansPivot(
  arr: number[],
  left: number,
  right: number
): number {
  const n = right - left + 1;
  if (n < 5) {
    return insertionSortAndMedian(arr, left, right);
  }

  // Divide into groups of 5
  const medians: number[] = [];
  for (let i = left; i <= right; i += 5) {
    const groupRight = Math.min(i + 4, right);
    const medianIdx = insertionSortAndMedian(arr, i, groupRight);
    medians.push(arr[medianIdx]);
  }

  // Find median of medians recursively
  const medianArr = [...medians];
  const mid = Math.floor(medianArr.length / 2);
  const mom = medianOfMediansHelper(medianArr, 0, medianArr.length - 1, mid);

  // Find index of mom in original array
  for (let i = left; i <= right; i++) {
    if (arr[i] === mom) return i;
  }

  return left;
}

function insertionSortAndMedian(
  arr: number[],
  left: number,
  right: number
): number {
  for (let i = left + 1; i <= right; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= left && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return Math.floor((left + right) / 2);
}

function partitionAround(
  arr: number[],
  left: number,
  right: number,
  pivot: number
): number {
  let pivotIndex = left;
  for (let i = left; i <= right; i++) {
    if (arr[i] === pivot) {
      pivotIndex = i;
      break;
    }
  }

  [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];

  let storeIndex = left;
  for (let i = left; i < right; i++) {
    if (arr[i] < pivot) {
      [arr[storeIndex], arr[i]] = [arr[i], arr[storeIndex]];
      storeIndex++;
    }
  }

  [arr[storeIndex], arr[right]] = [arr[right], arr[storeIndex]];
  return storeIndex;
}

export function demo(): string {
  const arr = [3, 2, 1, 5, 6, 4];
  console.log('Quickselect Demo');
  console.log('================');
  console.log('Array:', arr);
  console.log('2nd smallest (k=2):', kthSmallest(arr, 2));
  console.log('2nd largest:', kthLargest(arr, 2));
  console.log('Median:', findMedian(arr));
  return `2nd smallest: ${kthSmallest(arr, 2)}`;
}
