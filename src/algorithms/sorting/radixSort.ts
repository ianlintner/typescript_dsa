/**
 * Radix Sort
 *
 * Summary: Sort by individual digits using a stable sort as subroutine.
 * Time: O(d * (n + k)) where d is number of digits, k is base (usually 10)
 * Space: O(n + k)
 * Stability: Stable
 * When to use: Large integers with limited digits, when d is small.
 */

export function radixSort(arr: number[]): number[] {
  if (arr.length === 0) return [];

  const result = [...arr];
  const max = Math.max(...result);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(result, exp);
  }

  return result;
}

function countingSortByDigit(arr: number[], exp: number): void {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  // Count occurrences of each digit
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  // Cumulative count
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build output array (stable, right to left)
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]--;
    output[count[digit]] = arr[i];
  }

  // Copy back
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}

// Radix sort for arrays with negative numbers
export function radixSortWithNegatives(arr: number[]): number[] {
  if (arr.length === 0) return [];

  const negatives = arr.filter((x) => x < 0).map((x) => -x);
  const positives = arr.filter((x) => x >= 0);

  const sortedNegatives = negatives.length > 0 ? radixSort(negatives) : [];
  const sortedPositives = positives.length > 0 ? radixSort(positives) : [];

  return sortedNegatives
    .reverse()
    .map((x) => -x)
    .concat(sortedPositives);
}

export function demo(): string {
  const arr = [170, 45, 75, 90, 802, 24, 2, 66];
  console.log('Radix Sort Demo');
  console.log('===============');
  console.log('Input:', arr);
  console.log('Output:', radixSort(arr));

  const arrWithNeg = [170, -45, 75, -90, 802, 24, -2, 66];
  console.log('With negatives:', arrWithNeg);
  console.log('Output:', radixSortWithNegatives(arrWithNeg));
  return `Sorted: [${radixSort(arr).join(', ')}]`;
}
