/**
 * Longest Increasing Subsequence (LIS)
 *
 * Summary: Find longest strictly increasing subsequence.
 * Time: O(n log n) with binary search, O(n^2) with basic DP
 * Space: O(n)
 */

// O(n^2) DP solution
export function lisDP(nums: number[]): number {
  if (nums.length === 0) return 0;

  const n = nums.length;
  const dp = new Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
}

// O(n log n) solution with binary search
export function lis(nums: number[]): number {
  if (nums.length === 0) return 0;

  const tails: number[] = [];

  for (const num of nums) {
    // Binary search for position
    let left = 0;
    let right = tails.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }

  return tails.length;
}

// LIS with reconstruction
export function lisWithSequence(nums: number[]): { length: number; sequence: number[] } {
  if (nums.length === 0) return { length: 0, sequence: [] };

  const n = nums.length;
  const tails: number[] = [];
  const tailIndices: number[] = [];
  const predecessors = new Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    const num = nums[i];
    let left = 0;
    let right = tails.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    if (left > 0) {
      predecessors[i] = tailIndices[left - 1];
    }

    if (left === tails.length) {
      tails.push(num);
      tailIndices.push(i);
    } else {
      tails[left] = num;
      tailIndices[left] = i;
    }
  }

  // Reconstruct sequence
  const sequence: number[] = [];
  let idx = tailIndices[tailIndices.length - 1];
  while (idx !== -1) {
    sequence.unshift(nums[idx]);
    idx = predecessors[idx];
  }

  return { length: tails.length, sequence };
}

// Longest Non-Decreasing Subsequence
export function lnds(nums: number[]): number {
  if (nums.length === 0) return 0;

  const tails: number[] = [];

  for (const num of nums) {
    let left = 0;
    let right = tails.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] <= num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }

  return tails.length;
}

// Number of LIS (count all longest increasing subsequences)
export function countLIS(nums: number[]): number {
  if (nums.length === 0) return 0;

  const n = nums.length;
  const lengths = new Array(n).fill(1);
  const counts = new Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        if (lengths[j] + 1 > lengths[i]) {
          lengths[i] = lengths[j] + 1;
          counts[i] = counts[j];
        } else if (lengths[j] + 1 === lengths[i]) {
          counts[i] += counts[j];
        }
      }
    }
  }

  const maxLen = Math.max(...lengths);
  let total = 0;
  for (let i = 0; i < n; i++) {
    if (lengths[i] === maxLen) {
      total += counts[i];
    }
  }

  return total;
}

// Longest Bitonic Subsequence (increasing then decreasing)
export function longestBitonicSubsequence(nums: number[]): number {
  if (nums.length === 0) return 0;

  const n = nums.length;

  // LIS ending at each position
  const lisEnding = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        lisEnding[i] = Math.max(lisEnding[i], lisEnding[j] + 1);
      }
    }
  }

  // LDS (Longest Decreasing Subsequence) starting at each position
  const ldsStarting = new Array(n).fill(1);
  for (let i = n - 2; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] > nums[j]) {
        ldsStarting[i] = Math.max(ldsStarting[i], ldsStarting[j] + 1);
      }
    }
  }

  // Find maximum bitonic length
  let maxLen = 0;
  for (let i = 0; i < n; i++) {
    maxLen = Math.max(maxLen, lisEnding[i] + ldsStarting[i] - 1);
  }

  return maxLen;
}

export function demo(): string {
  console.log('LIS Demo');
  console.log('========');

  const nums = [10, 9, 2, 5, 3, 7, 101, 18];
  console.log('Array:', nums);
  console.log('LIS length (DP):', lisDP(nums));
  console.log('LIS length (Binary Search):', lis(nums));

  const result = lisWithSequence(nums);
  console.log('LIS sequence:', result.sequence);

  console.log('Count of LIS:', countLIS(nums));

  const bitonic = [1, 11, 2, 10, 4, 5, 2, 1];
  console.log('\nBitonic sequence:', bitonic);
  console.log('Longest bitonic:', longestBitonicSubsequence(bitonic));

  return `LIS: [${result.sequence.join(', ')}] (length ${result.length})`;
}
