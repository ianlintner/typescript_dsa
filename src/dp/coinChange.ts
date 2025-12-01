/**
 * Coin Change Problem
 *
 * Summary: Find minimum coins to make amount / count ways to make change.
 * Time: O(amount * coins), Space: O(amount)
 */

// Minimum coins to make amount
export function coinChangeMin(coins: number[], amount: number): number {
  if (amount === 0) return 0;

  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Reconstruct the coins used
export function coinChangeWithCoins(
  coins: number[],
  amount: number
): { count: number; coins: number[] } {
  if (amount === 0) return { count: 0, coins: [] };

  const dp = new Array(amount + 1).fill(Infinity);
  const parent = new Array(amount + 1).fill(-1);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        parent[i] = coin;
      }
    }
  }

  if (dp[amount] === Infinity) {
    return { count: -1, coins: [] };
  }

  // Reconstruct
  const usedCoins: number[] = [];
  let current = amount;
  while (current > 0) {
    usedCoins.push(parent[current]);
    current -= parent[current];
  }

  return { count: dp[amount], coins: usedCoins };
}

// Count number of ways to make change
export function coinChangeWays(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
  }

  return dp[amount];
}

// Count ways with combinations (order matters)
export function coinChangePermutations(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] += dp[i - coin];
      }
    }
  }

  return dp[amount];
}

// Get all ways to make change (combinations)
export function coinChangeCombinations(
  coins: number[],
  amount: number
): number[][] {
  const result: number[][] = [];

  function backtrack(
    remaining: number,
    start: number,
    current: number[]
  ): void {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }

    for (let i = start; i < coins.length; i++) {
      if (coins[i] <= remaining) {
        current.push(coins[i]);
        backtrack(remaining - coins[i], i, current);
        current.pop();
      }
    }
  }

  backtrack(amount, 0, []);
  return result;
}

export function demo(): string {
  console.log('Coin Change Demo');
  console.log('================');

  const coins = [1, 5, 10, 25];
  const amount = 30;

  console.log('Coins:', coins);
  console.log('Amount:', amount);
  console.log('Minimum coins:', coinChangeMin(coins, amount));

  const withCoins = coinChangeWithCoins(coins, amount);
  console.log('Coins used:', withCoins.coins);
  console.log('Number of ways:', coinChangeWays(coins, amount));

  const smallAmount = 11;
  console.log(`\nAll ways to make ${smallAmount}:`);
  const combinations = coinChangeCombinations(coins, smallAmount);
  combinations.forEach((c) => console.log('  ', c));

  return `Minimum coins for ${amount}: ${coinChangeMin(coins, amount)}`;
}
