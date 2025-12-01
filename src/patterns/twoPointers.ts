/**
 * Two Pointers Pattern
 *
 * Summary: Pair pointers moving toward/along an array.
 * Typical Time: O(n), Space: O(1)
 * Use: Two-sum in sorted array, dedup, merging, partitioning.
 */

// Two Sum in sorted array
export function twoSumSorted(nums: number[], target: number): [number, number] | null {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return null;
}

// Three Sum
export function threeSum(nums: number[]): number[][] {
  const result: number[][] = [];
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

// Container with most water
export function maxArea(heights: number[]): number {
  let maxWater = 0;
  let left = 0;
  let right = heights.length - 1;

  while (left < right) {
    const width = right - left;
    const height = Math.min(heights[left], heights[right]);
    maxWater = Math.max(maxWater, width * height);

    if (heights[left] < heights[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

// Remove duplicates from sorted array (in-place)
export function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let writeIdx = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[writeIdx] = nums[i];
      writeIdx++;
    }
  }

  return writeIdx;
}

// Merge two sorted arrays
export function mergeSorted(nums1: number[], nums2: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      result.push(nums1[i]);
      i++;
    } else {
      result.push(nums2[j]);
      j++;
    }
  }

  while (i < nums1.length) {
    result.push(nums1[i]);
    i++;
  }

  while (j < nums2.length) {
    result.push(nums2[j]);
    j++;
  }

  return result;
}

// Partition array (Dutch National Flag)
export function partition(nums: number[], pivot: number): void {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] < pivot) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] > pivot) {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    } else {
      mid++;
    }
  }
}

// Is palindrome
export function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }

  return true;
}

// Sort colors (Dutch National Flag)
export function sortColors(nums: number[]): void {
  partition(nums, 1);
}

// Trapping rain water
export function trap(height: number[]): number {
  if (height.length === 0) return 0;

  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }

  return water;
}

export function demo(): string {
  console.log('Two Pointers Demo');
  console.log('=================');

  const sorted = [1, 2, 3, 4, 6];
  const target = 6;
  console.log('Two sum sorted:', twoSumSorted(sorted, target));

  const nums = [-1, 0, 1, 2, -1, -4];
  console.log('\nThree sum:', threeSum(nums));

  const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  console.log('\nContainer with most water:', maxArea(heights));

  const s = 'A man, a plan, a canal: Panama';
  console.log(`\nIs "${s}" palindrome:`, isPalindrome(s));

  const rainHeight = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
  console.log('\nTrapping rain water:', trap(rainHeight));

  return `Two sum: ${JSON.stringify(twoSumSorted(sorted, target))}`;
}
