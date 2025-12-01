/**
 * Bubble Sort
 *
 * Summary: Repeatedly swap adjacent out-of-order pairs; pushes largest to the end each pass.
 * Time: Best O(n) (already sorted + early exit), Avg O(n^2), Worst O(n^2)
 * Space: O(1) in-place
 * Stability: Stable
 * When to use: Teaching, tiny inputs, nearly-sorted with early exit.
 */

export interface SortStep {
  array: number[];
  comparing?: [number, number];
  swapped?: [number, number];
  sorted?: number[];
  description: string;
}

export function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }

  return result;
}

export function bubbleSortWithSteps(arr: number[]): SortStep[] {
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
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...result],
        comparing: [j, j + 1],
        sorted: [...sorted],
        description: `Comparing ${result[j]} and ${result[j + 1]}`,
      });

      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
        steps.push({
          array: [...result],
          swapped: [j, j + 1],
          sorted: [...sorted],
          description: `Swapped ${result[j + 1]} and ${result[j]}`,
        });
      }
    }
    sorted.unshift(n - 1 - i);
    steps.push({
      array: [...result],
      sorted: [...sorted],
      description: `Pass ${i + 1} complete. Element ${result[n - 1 - i]} is now in final position.`,
    });

    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) {
        if (!sorted.includes(k)) sorted.push(k);
      }
      steps.push({
        array: [...result],
        sorted: [...sorted],
        description: 'No swaps in this pass - array is sorted!',
      });
      break;
    }
  }

  if (sorted.length < n) {
    for (let k = 0; k < n; k++) {
      if (!sorted.includes(k)) sorted.push(k);
    }
  }

  steps.push({
    array: [...result],
    sorted: [...sorted],
    description: 'Sorting complete!',
  });

  return steps;
}

export function demo(): string {
  const arr = [64, 34, 25, 12, 22, 11, 90];
  console.log('Bubble Sort Demo');
  console.log('================');
  console.log('Input:', arr);
  console.log('Output:', bubbleSort(arr));
  return `Sorted: [${bubbleSort(arr).join(', ')}]`;
}
