/**
 * Meet in the Middle Pattern
 *
 * Summary: Split problem in half, solve each half, combine results.
 * Time: O(2^(n/2)) instead of O(2^n)
 * Use: Large subset problems, two-part search.
 */

// Count subsets with sum equal to target (Meet in the Middle)
export function countSubsetsWithSum(nums: number[], target: number): number {
  const n = nums.length;
  const mid = Math.floor(n / 2);

  // Generate all subset sums for first half
  const leftSums: number[] = [];
  for (let mask = 0; mask < (1 << mid); mask++) {
    let sum = 0;
    for (let i = 0; i < mid; i++) {
      if (mask & (1 << i)) {
        sum += nums[i];
      }
    }
    leftSums.push(sum);
  }

  // Generate all subset sums for second half
  const rightSums: number[] = [];
  for (let mask = 0; mask < (1 << (n - mid)); mask++) {
    let sum = 0;
    for (let i = 0; i < n - mid; i++) {
      if (mask & (1 << i)) {
        sum += nums[mid + i];
      }
    }
    rightSums.push(sum);
  }

  // Sort right sums and use binary search
  rightSums.sort((a, b) => a - b);

  let count = 0;
  for (const leftSum of leftSums) {
    const needed = target - leftSum;
    // Count occurrences of 'needed' in rightSums
    const lower = lowerBound(rightSums, needed);
    const upper = upperBound(rightSums, needed);
    count += upper - lower;
  }

  return count;
}

function lowerBound(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}

function upperBound(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] <= target) left = mid + 1;
    else right = mid;
  }
  return left;
}

// Find subset with sum closest to half of total (balanced partition)
export function balancedPartition(nums: number[]): {
  partition: [number[], number[]];
  difference: number;
} {
  const total = nums.reduce((a, b) => a + b, 0);
  const n = nums.length;
  const mid = Math.floor(n / 2);

  // Generate all subset sums for first half with subsets
  const leftSums: Map<number, number[]> = new Map();
  for (let mask = 0; mask < (1 << mid); mask++) {
    let sum = 0;
    const subset: number[] = [];
    for (let i = 0; i < mid; i++) {
      if (mask & (1 << i)) {
        sum += nums[i];
        subset.push(nums[i]);
      }
    }
    leftSums.set(sum, subset);
  }

  // Generate all subset sums for second half
  const rightSums: { sum: number; subset: number[] }[] = [];
  for (let mask = 0; mask < (1 << (n - mid)); mask++) {
    let sum = 0;
    const subset: number[] = [];
    for (let i = 0; i < n - mid; i++) {
      if (mask & (1 << i)) {
        sum += nums[mid + i];
        subset.push(nums[mid + i]);
      }
    }
    rightSums.push({ sum, subset });
  }

  rightSums.sort((a, b) => a.sum - b.sum);
  const rightSumValues = rightSums.map((x) => x.sum);

  const halfTotal = total / 2;
  let bestSum = 0;
  let bestSubset: number[] = [];

  for (const [leftSum, leftSubset] of leftSums) {
    const needed = halfTotal - leftSum;
    // Find closest sum in right
    const idx = lowerBound(rightSumValues, needed);

    for (const i of [idx - 1, idx, idx + 1]) {
      if (i >= 0 && i < rightSums.length) {
        const currentSum = leftSum + rightSums[i].sum;
        if (
          currentSum <= halfTotal &&
          (bestSubset.length === 0 || currentSum > bestSum)
        ) {
          bestSum = currentSum;
          bestSubset = [...leftSubset, ...rightSums[i].subset];
        }
      }
    }
  }

  // Build the second partition based on indices not in bestSubset
  const partition1Indices = new Set<number>();
  for (const val of bestSubset) {
    const idx = nums.findIndex((n, i) => n === val && !partition1Indices.has(i));
    if (idx !== -1) partition1Indices.add(idx);
  }

  return {
    partition: [bestSubset, nums.filter((_, i) => !partition1Indices.has(i))],
    difference: Math.abs(total - 2 * bestSum),
  };
}

// 4-Sum using Meet in the Middle
export function fourSum(nums: number[], target: number): number[][] {
  const n = nums.length;
  if (n < 4) return [];

  // Generate all pairs with their sum
  const pairSums = new Map<number, [number, number][]>();
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sum = nums[i] + nums[j];
      if (!pairSums.has(sum)) pairSums.set(sum, []);
      pairSums.get(sum)!.push([i, j]);
    }
  }

  const result: number[][] = [];
  const seen = new Set<string>();

  for (const [sum, pairs] of pairSums) {
    const complement = target - sum;
    if (!pairSums.has(complement)) continue;

    for (const [i, j] of pairs) {
      for (const [k, l] of pairSums.get(complement)!) {
        // Ensure all indices are distinct
        if (i !== k && i !== l && j !== k && j !== l) {
          const quad = [nums[i], nums[j], nums[k], nums[l]].sort((a, b) => a - b);
          const key = quad.join(',');
          if (!seen.has(key)) {
            seen.add(key);
            result.push(quad);
          }
        }
      }
    }
  }

  return result;
}

export function demo(): string {
  console.log('Meet in the Middle Demo');
  console.log('=======================');

  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const target = 15;
  console.log('Array:', nums);
  console.log(`Subsets with sum ${target}:`, countSubsetsWithSum(nums, target));

  const partNums = [1, 6, 11, 5];
  console.log('\nBalanced partition of', partNums);
  const partition = balancedPartition(partNums);
  console.log('Minimum difference:', partition.difference);

  const fourSumNums = [1, 0, -1, 0, -2, 2];
  console.log('\n4-Sum in', fourSumNums, 'with target 0:');
  console.log(fourSum(fourSumNums, 0));

  return `Subsets with sum ${target}: ${countSubsetsWithSum(nums, target)}`;
}
