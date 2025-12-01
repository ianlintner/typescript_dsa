/**
 * Binary Search on Answer Pattern
 *
 * Summary: Use binary search when the answer space is monotonic.
 * Use: Optimization problems, minimize/maximize with constraints.
 */

// Minimum capacity to ship packages within D days
export function shipWithinDays(weights: number[], days: number): number {
  let left = Math.max(...weights);
  let right = weights.reduce((a, b) => a + b, 0);

  function canShip(capacity: number): boolean {
    let currentLoad = 0;
    let requiredDays = 1;

    for (const weight of weights) {
      if (currentLoad + weight > capacity) {
        requiredDays++;
        currentLoad = 0;
      }
      currentLoad += weight;
    }

    return requiredDays <= days;
  }

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canShip(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

// Koko eating bananas - minimum eating speed
export function minEatingSpeed(piles: number[], h: number): number {
  let left = 1;
  let right = Math.max(...piles);

  function canFinish(speed: number): boolean {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / speed);
    }
    return hours <= h;
  }

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canFinish(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

// Split array largest sum - minimize the largest sum when splitting into m parts
export function splitArray(nums: number[], m: number): number {
  let left = Math.max(...nums);
  let right = nums.reduce((a, b) => a + b, 0);

  function canSplit(maxSum: number): boolean {
    let parts = 1;
    let currentSum = 0;

    for (const num of nums) {
      if (currentSum + num > maxSum) {
        parts++;
        currentSum = 0;
      }
      currentSum += num;
    }

    return parts <= m;
  }

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canSplit(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

// Allocate minimum pages
export function allocateBooks(pages: number[], students: number): number {
  if (students > pages.length) return -1;

  let left = Math.max(...pages);
  let right = pages.reduce((a, b) => a + b, 0);

  function isValid(maxPages: number): boolean {
    let studentsNeeded = 1;
    let currentPages = 0;

    for (const p of pages) {
      if (currentPages + p > maxPages) {
        studentsNeeded++;
        currentPages = 0;
      }
      currentPages += p;
    }

    return studentsNeeded <= students;
  }

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (isValid(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

// Find kth smallest element in sorted matrix
export function kthSmallestInMatrix(matrix: number[][], k: number): number {
  const n = matrix.length;
  let left = matrix[0][0];
  let right = matrix[n - 1][n - 1];

  function countLessOrEqual(target: number): number {
    let count = 0;
    let row = n - 1;
    let col = 0;

    while (row >= 0 && col < n) {
      if (matrix[row][col] <= target) {
        count += row + 1;
        col++;
      } else {
        row--;
      }
    }

    return count;
  }

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (countLessOrEqual(mid) >= k) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

// Aggressive cows - maximize minimum distance
export function aggressiveCows(positions: number[], cows: number): number {
  positions.sort((a, b) => a - b);
  let left = 1;
  let right = positions[positions.length - 1] - positions[0];

  function canPlace(minDist: number): boolean {
    let cowsPlaced = 1;
    let lastPos = positions[0];

    for (let i = 1; i < positions.length; i++) {
      if (positions[i] - lastPos >= minDist) {
        cowsPlaced++;
        lastPos = positions[i];
      }
    }

    return cowsPlaced >= cows;
  }

  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    if (canPlace(mid)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }

  return left;
}

export function demo(): string {
  console.log('Binary Search on Answer Demo');
  console.log('============================');

  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  console.log('Ship weights within 5 days:', shipWithinDays(weights, 5));

  const piles = [3, 6, 7, 11];
  console.log('Min eating speed for piles', piles, 'in 8 hours:', minEatingSpeed(piles, 8));

  const nums = [7, 2, 5, 10, 8];
  console.log('Split array', nums, 'into 2 parts, min largest sum:', splitArray(nums, 2));

  const matrix = [
    [1, 5, 9],
    [10, 11, 13],
    [12, 13, 15],
  ];
  console.log('8th smallest in matrix:', kthSmallestInMatrix(matrix, 8));

  const positions = [1, 2, 4, 8, 9];
  console.log('Aggressive cows (3 cows):', aggressiveCows(positions, 3));

  return `Ship capacity for 5 days: ${shipWithinDays(weights, 5)}`;
}
