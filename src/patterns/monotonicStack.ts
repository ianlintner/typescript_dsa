/**
 * Monotonic Stack Pattern
 *
 * Summary: Stack maintaining monotonic order for next greater/smaller element problems.
 * Time: O(n), Space: O(n)
 */

// Next Greater Element
export function nextGreaterElement(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack: number[] = []; // Store indices

  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[i]) {
      stack.pop();
    }
    if (stack.length > 0) {
      result[i] = nums[stack[stack.length - 1]];
    }
    stack.push(i);
  }

  return result;
}

// Next Smaller Element
export function nextSmallerElement(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack: number[] = [];

  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] >= nums[i]) {
      stack.pop();
    }
    if (stack.length > 0) {
      result[i] = nums[stack[stack.length - 1]];
    }
    stack.push(i);
  }

  return result;
}

// Previous Greater Element
export function previousGreaterElement(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack: number[] = [];

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[i]) {
      stack.pop();
    }
    if (stack.length > 0) {
      result[i] = nums[stack[stack.length - 1]];
    }
    stack.push(i);
  }

  return result;
}

// Largest Rectangle in Histogram
export function largestRectangleArea(heights: number[]): number {
  const n = heights.length;
  const stack: number[] = [];
  let maxArea = 0;

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i];

    while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
      const height = heights[stack.pop()!];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }

    stack.push(i);
  }

  return maxArea;
}

// Maximum Rectangle in Binary Matrix
export function maximalRectangle(matrix: number[][]): number {
  if (matrix.length === 0) return 0;

  const rows = matrix.length;
  const cols = matrix[0].length;
  const heights = new Array(cols).fill(0);
  let maxArea = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      heights[j] = matrix[i][j] === 0 ? 0 : heights[j] + 1;
    }
    maxArea = Math.max(maxArea, largestRectangleArea(heights));
  }

  return maxArea;
}

// Daily Temperatures
export function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack: number[] = [];

  for (let i = n - 1; i >= 0; i--) {
    while (
      stack.length > 0 &&
      temperatures[stack[stack.length - 1]] <= temperatures[i]
    ) {
      stack.pop();
    }
    if (stack.length > 0) {
      result[i] = stack[stack.length - 1] - i;
    }
    stack.push(i);
  }

  return result;
}

// Stock Span Problem
export function calculateSpan(prices: number[]): number[] {
  const n = prices.length;
  const span = new Array(n).fill(1);
  const stack: number[] = [0];

  for (let i = 1; i < n; i++) {
    while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
      stack.pop();
    }
    span[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
    stack.push(i);
  }

  return span;
}

export function demo(): string {
  console.log('Monotonic Stack Demo');
  console.log('====================');

  const nums = [2, 1, 2, 4, 3];
  console.log('Array:', nums);
  console.log('Next greater:', nextGreaterElement(nums));
  console.log('Next smaller:', nextSmallerElement(nums));
  console.log('Previous greater:', previousGreaterElement(nums));

  const heights = [2, 1, 5, 6, 2, 3];
  console.log('\nHistogram heights:', heights);
  console.log('Largest rectangle area:', largestRectangleArea(heights));

  const temps = [73, 74, 75, 71, 69, 72, 76, 73];
  console.log('\nDaily temperatures:', temps);
  console.log('Days until warmer:', dailyTemperatures(temps));

  const prices = [100, 80, 60, 70, 60, 75, 85];
  console.log('\nStock prices:', prices);
  console.log('Stock span:', calculateSpan(prices));

  return `Largest rectangle: ${largestRectangleArea(heights)}`;
}
