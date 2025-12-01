/**
 * Heap Sort
 *
 * Summary: Build max-heap, repeatedly extract max to end.
 * Time: Best/Avg/Worst O(n log n)
 * Space: O(1) in-place (array heap)
 * Stability: Not stable
 * When to use: O(1) extra memory requirement with predictable O(n log n).
 */

import type { SortStep } from './bubbleSort';

export function heapSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(result, n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [result[0], result[i]] = [result[i], result[0]];
    heapify(result, i, 0);
  }

  return result;
}

function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

export function heapSortWithSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const result = [...arr];
  const n = result.length;
  const sorted: number[] = [];

  steps.push({
    array: [...result],
    description: 'Initial array',
  });

  // Build max heap
  steps.push({
    array: [...result],
    description: 'Building max heap...',
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifyWithSteps(result, n, i, steps, sorted);
  }

  steps.push({
    array: [...result],
    description: `Max heap built: [${result.join(', ')}]. Maximum element ${result[0]} is at root.`,
  });

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      array: [...result],
      comparing: [0, i],
      sorted: [...sorted],
      description: `Swapping root ${result[0]} with last unsorted element ${result[i]}`,
    });

    [result[0], result[i]] = [result[i], result[0]];
    sorted.unshift(i);

    steps.push({
      array: [...result],
      swapped: [0, i],
      sorted: [...sorted],
      description: `Element ${result[i]} is now in its final position`,
    });

    heapifyWithSteps(result, i, 0, steps, sorted);
  }

  sorted.unshift(0);
  steps.push({
    array: [...result],
    sorted: [...sorted],
    description: 'Sorting complete!',
  });

  return steps;
}

function heapifyWithSteps(
  arr: number[],
  n: number,
  i: number,
  steps: SortStep[],
  sorted: number[]
): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  steps.push({
    array: [...arr],
    comparing: [i, left < n ? left : i],
    sorted: [...sorted],
    description: `Heapifying at index ${i} (value: ${arr[i]})`,
  });

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    steps.push({
      array: [...arr],
      comparing: [i, largest],
      sorted: [...sorted],
      description: `Child ${arr[largest]} at index ${largest} is larger than parent ${arr[i]}`,
    });

    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    steps.push({
      array: [...arr],
      swapped: [i, largest],
      sorted: [...sorted],
      description: `Swapped ${arr[largest]} and ${arr[i]}`,
    });

    heapifyWithSteps(arr, n, largest, steps, sorted);
  }
}

export function demo(): string {
  const arr = [12, 11, 13, 5, 6, 7];
  console.log('Heap Sort Demo');
  console.log('==============');
  console.log('Input:', arr);
  console.log('Output:', heapSort(arr));
  return `Sorted: [${heapSort(arr).join(', ')}]`;
}
