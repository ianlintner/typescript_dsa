import { describe, it, expect } from 'vitest';
import { fibMemo, fibIterative, fibMatrix, fibSequence } from '../dp/fibonacci';
import { coinChangeMin, coinChangeWays } from '../dp/coinChange';
import { knapsack01 } from '../dp/knapsack';
import { lcsLength, lcs } from '../dp/lcs';
import { editDistance } from '../dp/editDistance';
import { lisDP } from '../dp/lis';

describe('Dynamic Programming', () => {
  describe('Fibonacci', () => {
    const fibExpected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];

    it('should compute fibonacci with memoization', () => {
      fibExpected.forEach((expected, n) => {
        expect(fibMemo(n)).toBe(expected);
      });
    });

    it('should compute fibonacci iteratively', () => {
      fibExpected.forEach((expected, n) => {
        expect(fibIterative(n)).toBe(expected);
      });
    });

    it('should compute fibonacci with matrix exponentiation', () => {
      expect(fibMatrix(10)).toBe(55);
      expect(fibMatrix(20)).toBe(6765);
    });

    it('should generate fibonacci sequence', () => {
      expect(fibSequence(7)).toEqual([0, 1, 1, 2, 3, 5, 8]);
    });
  });

  describe('Coin Change', () => {
    it('should find minimum coins', () => {
      expect(coinChangeMin([1, 2, 5], 11)).toBe(3); // 5+5+1
      expect(coinChangeMin([2], 3)).toBe(-1); // impossible
      expect(coinChangeMin([1], 0)).toBe(0);
    });

    it('should count ways to make change', () => {
      expect(coinChangeWays([1, 2, 5], 5)).toBe(4); // 5, 2+2+1, 2+1+1+1, 1+1+1+1+1
    });
  });

  describe('Knapsack', () => {
    it('should solve 0/1 knapsack', () => {
      const items = [
        { weight: 10, value: 60 },
        { weight: 20, value: 100 },
        { weight: 30, value: 120 },
      ];
      expect(knapsack01(items, 50)).toBe(220); // items 1 and 2
    });
  });

  describe('LCS', () => {
    it('should find length of longest common subsequence', () => {
      expect(lcsLength('ABCDGH', 'AEDFHR')).toBe(3); // ADH
      expect(lcsLength('AGGTAB', 'GXTXAYB')).toBe(4); // GTAB
    });

    it('should find actual LCS string', () => {
      expect(lcs('ABCDGH', 'AEDFHR')).toBe('ADH');
    });
  });

  describe('Edit Distance', () => {
    it('should compute edit distance', () => {
      expect(editDistance('kitten', 'sitting')).toBe(3);
      expect(editDistance('', 'abc')).toBe(3);
      expect(editDistance('abc', '')).toBe(3);
      expect(editDistance('abc', 'abc')).toBe(0);
    });
  });

  describe('LIS', () => {
    it('should find length of longest increasing subsequence', () => {
      expect(lisDP([10, 9, 2, 5, 3, 7, 101, 18])).toBe(4);
      expect(lisDP([0, 1, 0, 3, 2, 3])).toBe(4);
    });
  });
});
