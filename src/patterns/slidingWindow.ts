/**
 * Sliding Window Pattern
 *
 * Summary: Maintain a window with two pointers to satisfy constraints.
 * Typical Time: O(n), Space: O(1) or O(k) for counts.
 * Use: Subarrays with sum/unique/count constraints.
 */

// Maximum sum subarray of size k
export function maxSumSubarray(arr: number[], k: number): number {
  if (arr.length < k) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Minimum subarray with sum >= target
export function minSubarrayLen(target: number, nums: number[]): number {
  let minLen = Infinity;
  let sum = 0;
  let left = 0;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];

    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}

// Longest substring without repeating characters
export function lengthOfLongestSubstring(s: string): number {
  const seen = new Map<string, number>();
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right])! >= left) {
      left = seen.get(s[right])! + 1;
    }
    seen.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// Longest substring with at most k distinct characters
export function lengthOfLongestSubstringKDistinct(s: string, k: number): number {
  if (k === 0) return 0;

  const count = new Map<string, number>();
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    count.set(s[right], (count.get(s[right]) || 0) + 1);

    while (count.size > k) {
      const leftChar = s[left];
      count.set(leftChar, count.get(leftChar)! - 1);
      if (count.get(leftChar) === 0) {
        count.delete(leftChar);
      }
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// Find all anagrams in string
export function findAnagrams(s: string, p: string): number[] {
  if (s.length < p.length) return [];

  const result: number[] = [];
  const pCount = new Map<string, number>();
  const sCount = new Map<string, number>();

  for (const char of p) {
    pCount.set(char, (pCount.get(char) || 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    sCount.set(s[i], (sCount.get(s[i]) || 0) + 1);

    if (i >= p.length) {
      const leftChar = s[i - p.length];
      sCount.set(leftChar, sCount.get(leftChar)! - 1);
      if (sCount.get(leftChar) === 0) {
        sCount.delete(leftChar);
      }
    }

    if (i >= p.length - 1 && mapsEqual(sCount, pCount)) {
      result.push(i - p.length + 1);
    }
  }

  return result;
}

function mapsEqual(a: Map<string, number>, b: Map<string, number>): boolean {
  if (a.size !== b.size) return false;
  for (const [key, val] of a) {
    if (b.get(key) !== val) return false;
  }
  return true;
}

// Maximum of all subarrays of size k
export function maxSlidingWindow(nums: number[], k: number): number[] {
  if (nums.length === 0 || k === 0) return [];

  const result: number[] = [];
  const deque: number[] = []; // Store indices

  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }

    // Remove smaller elements
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }

    deque.push(i);

    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}

export function demo(): string {
  console.log('Sliding Window Demo');
  console.log('===================');

  const arr = [1, 4, 2, 10, 23, 3, 1, 0, 20];
  const k = 4;
  console.log('Array:', arr);
  console.log(`Max sum of subarray of size ${k}:`, maxSumSubarray(arr, k));

  const nums = [2, 3, 1, 2, 4, 3];
  const target = 7;
  console.log(`\nMin subarray with sum >= ${target}:`, minSubarrayLen(target, nums));

  const s = 'abcabcbb';
  console.log('\nLongest substring without repeating:', lengthOfLongestSubstring(s));

  const s2 = 'cbaebabacd';
  const p = 'abc';
  console.log(`\nAnagrams of "${p}" in "${s2}":`, findAnagrams(s2, p));

  const slidingNums = [1, 3, -1, -3, 5, 3, 6, 7];
  console.log('\nMax sliding window (k=3):', maxSlidingWindow(slidingNums, 3));

  return `Max sum (k=${k}): ${maxSumSubarray(arr, k)}`;
}
