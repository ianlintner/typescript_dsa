/**
 * Counting Sort
 *
 * Summary: Count occurrences and rebuild array.
 * Time: O(n + k) where k is the range of input
 * Space: O(n + k)
 * Stability: Stable (with proper implementation)
 * When to use: Integer inputs with limited range, when k = O(n).
 */

export function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return [];

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min + 1;

  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  // Count occurrences
  for (const num of arr) {
    count[num - min]++;
  }

  // Cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build output array (stable)
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];
    count[num - min]--;
    output[count[num - min]] = num;
  }

  return output;
}

export function demo(): string {
  const arr = [4, 2, 2, 8, 3, 3, 1];
  console.log('Counting Sort Demo');
  console.log('==================');
  console.log('Input:', arr);
  console.log('Output:', countingSort(arr));
  return `Sorted: [${countingSort(arr).join(', ')}]`;
}
