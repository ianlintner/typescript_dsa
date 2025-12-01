/**
 * Merge Sort
 *
 * Summary: Divide-and-conquer; recursively sort halves then merge.
 * Time: Best/Avg/Worst O(n log n)
 * Space: O(n) auxiliary (linked-list variant can be O(1))
 * Stability: Stable
 * When to use: Guaranteed O(n log n), external sorting, stable requirement.
 */

import { SortStep } from './bubbleSort';

export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr];

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

export function mergeSortWithSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const result = [...arr];

  steps.push({
    array: [...result],
    description: 'Initial array',
  });

  function mergeSortHelper(
    arr: number[],
    start: number,
    end: number
  ): number[] {
    if (end - start <= 1) {
      return arr.slice(start, end);
    }

    const mid = Math.floor((start + end) / 2);

    steps.push({
      array: [...result],
      comparing: [start, end - 1],
      description: `Dividing array from index ${start} to ${end - 1} at mid point ${mid}`,
    });

    const left = mergeSortHelper(arr, start, mid);
    const right = mergeSortHelper(arr, mid, end);

    const merged = mergeWithSteps(left, right, start);

    for (let i = 0; i < merged.length; i++) {
      result[start + i] = merged[i];
    }

    return merged;
  }

  function mergeWithSteps(
    left: number[],
    right: number[],
    startIdx: number
  ): number[] {
    const merged: number[] = [];
    let i = 0,
      j = 0;

    steps.push({
      array: [...result],
      description: `Merging [${left.join(', ')}] and [${right.join(', ')}]`,
    });

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }
    }

    const finalMerged = merged.concat(left.slice(i)).concat(right.slice(j));

    for (let k = 0; k < finalMerged.length; k++) {
      result[startIdx + k] = finalMerged[k];
    }

    steps.push({
      array: [...result],
      sorted: Array.from(
        { length: finalMerged.length },
        (_, idx) => startIdx + idx
      ),
      description: `Merged result: [${finalMerged.join(', ')}]`,
    });

    return finalMerged;
  }

  mergeSortHelper(result, 0, result.length);

  steps.push({
    array: [...result],
    sorted: Array.from({ length: result.length }, (_, i) => i),
    description: 'Sorting complete!',
  });

  return steps;
}

export function demo(): string {
  const arr = [38, 27, 43, 3, 9, 82, 10];
  console.log('Merge Sort Demo');
  console.log('===============');
  console.log('Input:', arr);
  console.log('Output:', mergeSort(arr));
  return `Sorted: [${mergeSort(arr).join(', ')}]`;
}
