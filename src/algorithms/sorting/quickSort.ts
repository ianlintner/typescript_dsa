/**
 * Quick Sort
 *
 * Summary: Partition around a pivot; recursively sort partitions.
 * Time: Best/Avg O(n log n), Worst O(n^2) (poor pivots)
 * Space: O(log n) average stack, O(n) worst stack
 * Stability: Not stable (typical in-place)
 * Notes: Use randomized/median-of-three pivot; switch to insertion sort for small slices.
 */

import { SortStep } from './bubbleSort';

export function quickSort(arr: number[]): number[] {
  const result = [...arr];
  quickSortHelper(result, 0, result.length - 1);
  return result;
}

function quickSortHelper(arr: number[], low: number, high: number): void {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSortHelper(arr, low, pivotIndex - 1);
    quickSortHelper(arr, pivotIndex + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

export function quickSortWithSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const result = [...arr];
  const sorted: Set<number> = new Set();

  steps.push({
    array: [...result],
    description: 'Initial array',
  });

  function quickSortHelperWithSteps(low: number, high: number): void {
    if (low < high) {
      steps.push({
        array: [...result],
        comparing: [low, high],
        sorted: Array.from(sorted),
        description: `Partitioning subarray from index ${low} to ${high}`,
      });

      const pivotIndex = partitionWithSteps(low, high);

      sorted.add(pivotIndex);
      steps.push({
        array: [...result],
        sorted: Array.from(sorted),
        description: `Pivot ${result[pivotIndex]} is now in its final position at index ${pivotIndex}`,
      });

      quickSortHelperWithSteps(low, pivotIndex - 1);
      quickSortHelperWithSteps(pivotIndex + 1, high);
    } else if (low === high) {
      sorted.add(low);
    }
  }

  function partitionWithSteps(low: number, high: number): number {
    const pivot = result[high];
    let i = low - 1;

    steps.push({
      array: [...result],
      comparing: [high, high],
      sorted: Array.from(sorted),
      description: `Choosing pivot: ${pivot} (last element)`,
    });

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...result],
        comparing: [j, high],
        sorted: Array.from(sorted),
        description: `Comparing ${result[j]} with pivot ${pivot}`,
      });

      if (result[j] <= pivot) {
        i++;
        if (i !== j) {
          [result[i], result[j]] = [result[j], result[i]];
          steps.push({
            array: [...result],
            swapped: [i, j],
            sorted: Array.from(sorted),
            description: `${result[j]} <= ${pivot}, swapped positions ${i} and ${j}`,
          });
        }
      }
    }

    [result[i + 1], result[high]] = [result[high], result[i + 1]];
    steps.push({
      array: [...result],
      swapped: [i + 1, high],
      sorted: Array.from(sorted),
      description: `Placed pivot ${pivot} at its correct position ${i + 1}`,
    });

    return i + 1;
  }

  quickSortHelperWithSteps(0, result.length - 1);

  for (let i = 0; i < result.length; i++) {
    sorted.add(i);
  }

  steps.push({
    array: [...result],
    sorted: Array.from(sorted),
    description: 'Sorting complete!',
  });

  return steps;
}

// Three-way partition for arrays with many duplicates
export function quickSort3Way(arr: number[]): number[] {
  const result = [...arr];
  quickSort3WayHelper(result, 0, result.length - 1);
  return result;
}

function quickSort3WayHelper(arr: number[], low: number, high: number): void {
  if (low >= high) return;

  const pivot = arr[low];
  let lt = low;
  let gt = high;
  let i = low + 1;

  while (i <= gt) {
    if (arr[i] < pivot) {
      [arr[lt], arr[i]] = [arr[i], arr[lt]];
      lt++;
      i++;
    } else if (arr[i] > pivot) {
      [arr[i], arr[gt]] = [arr[gt], arr[i]];
      gt--;
    } else {
      i++;
    }
  }

  quickSort3WayHelper(arr, low, lt - 1);
  quickSort3WayHelper(arr, gt + 1, high);
}

// Iterative quick sort using explicit stack
export function quickSortIterative(arr: number[]): number[] {
  const result = [...arr];
  const stack: [number, number][] = [[0, result.length - 1]];

  while (stack.length > 0) {
    const [low, high] = stack.pop()!;

    if (low < high) {
      const pivotIndex = partition(result, low, high);

      stack.push([low, pivotIndex - 1]);
      stack.push([pivotIndex + 1, high]);
    }
  }

  return result;
}

export function demo(): string {
  const arr = [10, 7, 8, 9, 1, 5];
  console.log('Quick Sort Demo');
  console.log('===============');
  console.log('Input:', arr);
  console.log('Standard:', quickSort(arr));
  console.log('3-Way:', quickSort3Way(arr));
  console.log('Iterative:', quickSortIterative(arr));
  return `Sorted: [${quickSort(arr).join(', ')}]`;
}
