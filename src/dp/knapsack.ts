/**
 * 0/1 Knapsack Problem
 *
 * Summary: 0/1 knapsack DP over items and capacity.
 * Time: O(nW), Space: O(W) with rolling array
 * Notes: Pseudo-polynomial; NP-hard in general.
 */

export interface Item {
  weight: number;
  value: number;
  name?: string;
}

// Basic 0/1 Knapsack
export function knapsack01(items: Item[], capacity: number): number {
  const n = items.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (item.weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - item.weight] + item.value);
      }
    }
  }

  return dp[n][capacity];
}

// Space-optimized knapsack
export function knapsack01Optimized(items: Item[], capacity: number): number {
  const dp = new Array(capacity + 1).fill(0);

  for (const item of items) {
    // Traverse backwards to avoid using same item twice
    for (let w = capacity; w >= item.weight; w--) {
      dp[w] = Math.max(dp[w], dp[w - item.weight] + item.value);
    }
  }

  return dp[capacity];
}

// Knapsack with item reconstruction
export function knapsack01WithItems(
  items: Item[],
  capacity: number
): { value: number; selectedItems: Item[] } {
  const n = items.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (item.weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - item.weight] + item.value);
      }
    }
  }

  // Reconstruct solution
  const selectedItems: Item[] = [];
  let w = capacity;
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(items[i - 1]);
      w -= items[i - 1].weight;
    }
  }

  return { value: dp[n][capacity], selectedItems };
}

// Unbounded Knapsack (can use each item multiple times)
export function knapsackUnbounded(items: Item[], capacity: number): number {
  const dp = new Array(capacity + 1).fill(0);

  for (let w = 1; w <= capacity; w++) {
    for (const item of items) {
      if (item.weight <= w) {
        dp[w] = Math.max(dp[w], dp[w - item.weight] + item.value);
      }
    }
  }

  return dp[capacity];
}

// Bounded Knapsack (each item has a limited count)
export interface BoundedItem extends Item {
  count: number;
}

export function knapsackBounded(
  items: BoundedItem[],
  capacity: number
): number {
  const dp = new Array(capacity + 1).fill(0);

  for (const item of items) {
    // For each count of this item
    for (let w = capacity; w >= item.weight; w--) {
      for (let k = 1; k <= item.count && k * item.weight <= w; k++) {
        dp[w] = Math.max(
          dp[w],
          dp[w - k * item.weight] + k * item.value
        );
      }
    }
  }

  return dp[capacity];
}

// Subset Sum (special case of knapsack)
export function subsetSum(nums: number[], target: number): boolean {
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let t = target; t >= num; t--) {
      dp[t] = dp[t] || dp[t - num];
    }
  }

  return dp[target];
}

// Partition Equal Subset Sum
export function canPartition(nums: number[]): boolean {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2 !== 0) return false;
  return subsetSum(nums, sum / 2);
}

export function demo(): string {
  console.log('Knapsack Demo');
  console.log('=============');

  const items: Item[] = [
    { weight: 10, value: 60, name: 'Item 1' },
    { weight: 20, value: 100, name: 'Item 2' },
    { weight: 30, value: 120, name: 'Item 3' },
  ];
  const capacity = 50;

  console.log('Items:');
  items.forEach((item) =>
    console.log(`  ${item.name}: weight=${item.weight}, value=${item.value}`)
  );
  console.log('Capacity:', capacity);

  const result = knapsack01WithItems(items, capacity);
  console.log('\nMaximum value:', result.value);
  console.log('Selected items:', result.selectedItems.map((i) => i.name));

  console.log('\nUnbounded knapsack:', knapsackUnbounded(items, capacity));

  console.log('\nSubset Sum test:');
  const nums = [3, 1, 5, 9, 12];
  console.log('Array:', nums);
  console.log('Can sum to 15?', subsetSum(nums, 15));
  console.log('Can sum to 14?', subsetSum(nums, 14));

  console.log('\nPartition test:');
  console.log('[1, 5, 11, 5] can partition:', canPartition([1, 5, 11, 5]));
  console.log('[1, 2, 3, 5] can partition:', canPartition([1, 2, 3, 5]));

  return `Maximum value: ${result.value}`;
}
