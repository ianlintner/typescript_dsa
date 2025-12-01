/**
 * Linear Search
 *
 * Summary: Scan sequentially until element found or end.
 * Time: Best O(1), Avg/Worst O(n)
 * Space: O(1)
 * When to use: Unsorted data, tiny inputs.
 */

export interface SearchStep {
  array: number[];
  currentIndex: number;
  found: boolean;
  target: number;
  description: string;
}

export function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

export function linearSearchWithSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];

  steps.push({
    array: [...arr],
    currentIndex: -1,
    found: false,
    target,
    description: `Starting linear search for ${target}`,
  });

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        currentIndex: i,
        found: true,
        target,
        description: `Found ${target} at index ${i}!`,
      });
      return steps;
    }

    steps.push({
      array: [...arr],
      currentIndex: i,
      found: false,
      target,
      description: `Checking index ${i}: ${arr[i]} ≠ ${target}`,
    });
  }

  steps.push({
    array: [...arr],
    currentIndex: -1,
    found: false,
    target,
    description: `${target} not found in array`,
  });

  return steps;
}

// Find all occurrences
export function linearSearchAll<T>(arr: T[], target: T): number[] {
  const indices: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      indices.push(i);
    }
  }
  return indices;
}

export function demo(): string {
  const arr = [64, 34, 25, 12, 22, 11, 90];
  const target = 22;
  console.log('Linear Search Demo');
  console.log('==================');
  console.log('Array:', arr);
  console.log('Target:', target);
  console.log('Index:', linearSearch(arr, target));
  return `Found ${target} at index ${linearSearch(arr, target)}`;
}
