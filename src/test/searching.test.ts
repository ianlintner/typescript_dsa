import { describe, it, expect } from 'vitest';
import { linearSearch, linearSearchAll } from '../algorithms/searching/linearSearch';
import { binarySearch, lowerBound, upperBound } from '../algorithms/searching/binarySearch';
import { kthSmallest, kthLargest, findMedian } from '../algorithms/searching/quickSelect';
import { exponentialSearch } from '../algorithms/searching/advancedSearch';

describe('Searching Algorithms', () => {
  describe('Linear Search', () => {
    it('should find element in array', () => {
      expect(linearSearch([1, 3, 5, 7, 9], 5)).toBe(2);
    });

    it('should return -1 if not found', () => {
      expect(linearSearch([1, 3, 5, 7, 9], 4)).toBe(-1);
    });

    it('should find all occurrences', () => {
      expect(linearSearchAll([1, 2, 3, 2, 4, 2], 2)).toEqual([1, 3, 5]);
    });

    it('should handle empty array', () => {
      expect(linearSearch([], 1)).toBe(-1);
    });
  });

  describe('Binary Search', () => {
    const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it('should find element in sorted array', () => {
      expect(binarySearch(sortedArray, 5)).toBe(4);
    });

    it('should return -1 if not found', () => {
      expect(binarySearch(sortedArray, 11)).toBe(-1);
    });

    it('should find lower bound', () => {
      expect(lowerBound([1, 2, 2, 2, 3], 2)).toBe(1);
    });

    it('should find upper bound', () => {
      expect(upperBound([1, 2, 2, 2, 3], 2)).toBe(4);
    });

    it('should handle empty array', () => {
      expect(binarySearch([], 1)).toBe(-1);
    });
  });

  describe('Quick Select', () => {
    it('should find median', () => {
      expect(findMedian([3, 2, 1, 5, 4])).toBe(3);
    });

    it('should find kth largest', () => {
      expect(kthLargest([3, 2, 1, 5, 6, 4], 2)).toBe(5);
    });

    it('should find kth smallest', () => {
      expect(kthSmallest([3, 2, 1, 5, 6, 4], 2)).toBe(2);
    });
  });

  describe('Advanced Search', () => {
    it('should work with exponential search', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(exponentialSearch(arr, 5)).toBe(4);
    });
  });
});
