import { describe, it, expect } from 'vitest';
import { bubbleSort, bubbleSortWithSteps } from '../algorithms/sorting/bubbleSort';
import { selectionSort } from '../algorithms/sorting/selectionSort';
import { insertionSort } from '../algorithms/sorting/insertionSort';
import { mergeSort } from '../algorithms/sorting/mergeSort';
import { quickSort } from '../algorithms/sorting/quickSort';
import { heapSort } from '../algorithms/sorting/heapSort';
import { countingSort } from '../algorithms/sorting/countingSort';
import { radixSort } from '../algorithms/sorting/radixSort';

describe('Sorting Algorithms', () => {
  const testCases = [
    { input: [64, 34, 25, 12, 22, 11, 90], expected: [11, 12, 22, 25, 34, 64, 90] },
    { input: [5, 1, 4, 2, 8], expected: [1, 2, 4, 5, 8] },
    { input: [1], expected: [1] },
    { input: [], expected: [] },
    { input: [3, 3, 3], expected: [3, 3, 3] },
    { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
  ];

  describe('Bubble Sort', () => {
    testCases.forEach(({ input, expected }) => {
      it(`should sort ${JSON.stringify(input)}`, () => {
        expect(bubbleSort([...input])).toEqual(expected);
      });
    });

    it('should generate steps for visualization', () => {
      const steps = bubbleSortWithSteps([3, 1, 2]);
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[steps.length - 1].array).toEqual([1, 2, 3]);
    });
  });

  describe('Selection Sort', () => {
    testCases.forEach(({ input, expected }) => {
      it(`should sort ${JSON.stringify(input)}`, () => {
        expect(selectionSort([...input])).toEqual(expected);
      });
    });
  });

  describe('Insertion Sort', () => {
    testCases.forEach(({ input, expected }) => {
      it(`should sort ${JSON.stringify(input)}`, () => {
        expect(insertionSort([...input])).toEqual(expected);
      });
    });
  });

  describe('Merge Sort', () => {
    testCases.forEach(({ input, expected }) => {
      it(`should sort ${JSON.stringify(input)}`, () => {
        expect(mergeSort([...input])).toEqual(expected);
      });
    });
  });

  describe('Quick Sort', () => {
    testCases.forEach(({ input, expected }) => {
      it(`should sort ${JSON.stringify(input)}`, () => {
        expect(quickSort([...input])).toEqual(expected);
      });
    });
  });

  describe('Heap Sort', () => {
    testCases.forEach(({ input, expected }) => {
      it(`should sort ${JSON.stringify(input)}`, () => {
        expect(heapSort([...input])).toEqual(expected);
      });
    });
  });

  describe('Counting Sort', () => {
    const countingTestCases = testCases.filter(tc => 
      tc.input.length === 0 || tc.input.every(x => x >= 0)
    );
    countingTestCases.forEach(({ input, expected }) => {
      it(`should sort ${JSON.stringify(input)}`, () => {
        expect(countingSort([...input])).toEqual(expected);
      });
    });
  });

  describe('Radix Sort', () => {
    const radixTestCases = testCases.filter(tc => 
      tc.input.length === 0 || tc.input.every(x => x >= 0)
    );
    radixTestCases.forEach(({ input, expected }) => {
      it(`should sort ${JSON.stringify(input)}`, () => {
        expect(radixSort([...input])).toEqual(expected);
      });
    });
  });
});
