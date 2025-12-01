/**
 * Advanced Search Algorithms
 *
 * Search in rotated sorted array, exponential search, unknown size array search.
 */

// Search in rotated sorted array (no duplicates)
export function searchRotated(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    // Left half is sorted
    if (arr[left] <= arr[mid]) {
      if (arr[left] <= target && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (arr[mid] < target && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

// Search in rotated sorted array (with duplicates)
export function searchRotatedWithDuplicates(
  arr: number[],
  target: number
): boolean {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return true;
    }

    // Handle duplicates at boundaries
    if (arr[left] === arr[mid] && arr[mid] === arr[right]) {
      left++;
      right--;
      continue;
    }

    // Left half is sorted
    if (arr[left] <= arr[mid]) {
      if (arr[left] <= target && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (arr[mid] < target && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return false;
}

// Find minimum in rotated sorted array
export function findMinRotated(arr: number[]): number {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] > arr[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return arr[left];
}

// Exponential search for unbounded/infinite arrays
export function exponentialSearch(arr: number[], target: number): number {
  if (arr.length === 0) return -1;

  if (arr[0] === target) return 0;

  let bound = 1;
  while (bound < arr.length && arr[bound] <= target) {
    bound *= 2;
  }

  // Binary search in the found range
  let left = Math.floor(bound / 2);
  let right = Math.min(bound, arr.length - 1);

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

// Search in array of unknown size (uses accessor function)
export function searchUnknownSize(
  accessor: (index: number) => number | undefined,
  target: number
): number {
  // Find the bounds first
  let bound = 1;
  while (accessor(bound) !== undefined && (accessor(bound) as number) < target) {
    bound *= 2;
  }

  let left = Math.floor(bound / 2);
  let right = bound;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const val = accessor(mid);

    if (val === undefined) {
      right = mid - 1;
    } else if (val === target) {
      return mid;
    } else if (val < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// Find peak element (element greater than its neighbors)
export function findPeakElement(arr: number[]): number {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] > arr[mid + 1]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

export function demo(): string {
  console.log('Advanced Search Demo');
  console.log('====================');

  const rotated = [4, 5, 6, 7, 0, 1, 2];
  console.log('Rotated array:', rotated);
  console.log('Search for 0:', searchRotated(rotated, 0));
  console.log('Min element:', findMinRotated(rotated));

  const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  console.log('\nExponential search in:', sorted);
  console.log('Search for 13:', exponentialSearch(sorted, 13));

  const peaks = [1, 2, 1, 3, 5, 6, 4];
  console.log('\nPeak element in:', peaks);
  console.log('Peak index:', findPeakElement(peaks));

  return `Rotated search: Found 0 at index ${searchRotated(rotated, 0)}`;
}
