/**
 * Insertion Sort
 *
 * Summary: Build sorted prefix by inserting each element into position.
 * Time: Best O(n), Avg/Worst O(n^2)
 * Space: O(1) in-place
 * Stability: Stable
 * When to use: Nearly sorted data, small arrays, as base-case for hybrid sorts.
 */

import type { SortStep } from './bubbleSort';

export function insertionSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 1; i < n; i++) {
    const key = result[i];
    let j = i - 1;

    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }
    result[j + 1] = key;
  }

  return result;
}

export function insertionSortWithSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const result = [...arr];
  const n = result.length;
  const sorted: number[] = [0];

  steps.push({
    array: [...result],
    sorted: [...sorted],
    description: 'Initial array. First element is considered sorted.',
  });

  for (let i = 1; i < n; i++) {
    const key = result[i];
    let j = i - 1;

    steps.push({
      array: [...result],
      comparing: [i, i],
      sorted: [...sorted],
      description: `Inserting element ${key} into sorted portion`,
    });

    while (j >= 0 && result[j] > key) {
      steps.push({
        array: [...result],
        comparing: [j, i],
        sorted: [...sorted],
        description: `Comparing ${result[j]} > ${key}, shifting ${result[j]} right`,
      });

      result[j + 1] = result[j];
      j--;

      steps.push({
        array: [...result],
        swapped: [j + 1, j + 2],
        sorted: [...sorted],
        description: `Shifted element to position ${j + 2}`,
      });
    }

    result[j + 1] = key;
    sorted.push(i);

    steps.push({
      array: [...result],
      sorted: [...sorted],
      description: `Inserted ${key} at position ${j + 1}. Sorted portion now has ${i + 1} elements.`,
    });
  }

  steps.push({
    array: [...result],
    sorted: [...sorted],
    description: 'Sorting complete!',
  });

  return steps;
}

export function demo(): string {
  const arr = [12, 11, 13, 5, 6];
  console.log('Insertion Sort Demo');
  console.log('==================');
  console.log('Input:', arr);
  console.log('Output:', insertionSort(arr));
  return `Sorted: [${insertionSort(arr).join(', ')}]`;
}
