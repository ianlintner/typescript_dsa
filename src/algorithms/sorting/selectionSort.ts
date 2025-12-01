/**
 * Selection Sort
 *
 * Summary: Repeatedly select min element and place it at the front.
 * Time: Best/Avg/Worst O(n^2)
 * Space: O(1) in-place
 * Stability: Not stable (simple implementations)
 * When to use: Tiny inputs, minimal swaps needed situations.
 */

import { SortStep } from './bubbleSort';

export function selectionSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (result[j] < result[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [result[i], result[minIdx]] = [result[minIdx], result[i]];
    }
  }

  return result;
}

export function selectionSortWithSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const result = [...arr];
  const n = result.length;
  const sorted: number[] = [];

  steps.push({
    array: [...result],
    sorted: [...sorted],
    description: 'Initial array',
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...result],
      comparing: [i, i],
      sorted: [...sorted],
      description: `Starting pass ${i + 1}: Looking for minimum element from index ${i}`,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...result],
        comparing: [minIdx, j],
        sorted: [...sorted],
        description: `Comparing current min ${result[minIdx]} with ${result[j]}`,
      });

      if (result[j] < result[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...result],
          comparing: [minIdx, minIdx],
          sorted: [...sorted],
          description: `New minimum found: ${result[minIdx]} at index ${minIdx}`,
        });
      }
    }

    if (minIdx !== i) {
      [result[i], result[minIdx]] = [result[minIdx], result[i]];
      steps.push({
        array: [...result],
        swapped: [i, minIdx],
        sorted: [...sorted],
        description: `Swapped ${result[minIdx]} and ${result[i]}`,
      });
    }

    sorted.push(i);
    steps.push({
      array: [...result],
      sorted: [...sorted],
      description: `Pass ${i + 1} complete. Element ${result[i]} is now in final position.`,
    });
  }

  sorted.push(n - 1);
  steps.push({
    array: [...result],
    sorted: [...sorted],
    description: 'Sorting complete!',
  });

  return steps;
}

export function demo(): string {
  const arr = [64, 25, 12, 22, 11];
  console.log('Selection Sort Demo');
  console.log('==================');
  console.log('Input:', arr);
  console.log('Output:', selectionSort(arr));
  return `Sorted: [${selectionSort(arr).join(', ')}]`;
}
