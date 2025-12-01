import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

// Import sorting algorithms
import * as bubbleSort from '../algorithms/sorting/bubbleSort';
import * as selectionSort from '../algorithms/sorting/selectionSort';
import * as insertionSort from '../algorithms/sorting/insertionSort';
import * as mergeSort from '../algorithms/sorting/mergeSort';
import * as quickSort from '../algorithms/sorting/quickSort';
import * as heapSort from '../algorithms/sorting/heapSort';

interface AlgorithmInfo {
  name: string;
  code: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  demo: () => string;
}

const algorithmInfo: Record<string, Record<string, AlgorithmInfo>> = {
  sorting: {
    bubble: {
      name: 'Bubble Sort',
      description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
      timeComplexity: 'Best: O(n), Average: O(n²), Worst: O(n²)',
      spaceComplexity: 'O(1) - In-place',
      code: `function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Early exit if no swaps
  }
  return result;
}`,
      demo: bubbleSort.demo,
    },
    selection: {
      name: 'Selection Sort',
      description: 'Selection Sort divides the input list into a sorted and an unsorted region. It repeatedly selects the smallest element from the unsorted region and moves it to the sorted region.',
      timeComplexity: 'Best: O(n²), Average: O(n²), Worst: O(n²)',
      spaceComplexity: 'O(1) - In-place',
      code: `function selectionSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (result[j] < result[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [result[i], result[minIdx]] = [result[minIdx], result[i]];
    }
  }
  return result;
}`,
      demo: selectionSort.demo,
    },
    insertion: {
      name: 'Insertion Sort',
      description: 'Insertion Sort builds the final sorted array one item at a time. It takes each element and inserts it into its correct position in the already sorted portion of the array.',
      timeComplexity: 'Best: O(n), Average: O(n²), Worst: O(n²)',
      spaceComplexity: 'O(1) - In-place',
      code: `function insertionSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 1; i < n; i++) {
    const key = result[i];
    let j = i - 1;
    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }
    result[j + 1] = key;
  }
  return result;
}`,
      demo: insertionSort.demo,
    },
    merge: {
      name: 'Merge Sort',
      description: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.',
      timeComplexity: 'Best: O(n log n), Average: O(n log n), Worst: O(n log n)',
      spaceComplexity: 'O(n) - Auxiliary space for merging',
      code: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr];

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
      demo: mergeSort.demo,
    },
    quick: {
      name: 'Quick Sort',
      description: 'Quick Sort picks a pivot element and partitions the array around it. Elements smaller than the pivot go to the left, and elements greater go to the right. It then recursively sorts the partitions.',
      timeComplexity: 'Best: O(n log n), Average: O(n log n), Worst: O(n²)',
      spaceComplexity: 'O(log n) - Stack space for recursion',
      code: `function quickSort(arr: number[]): number[] {
  const result = [...arr];
  quickSortHelper(result, 0, result.length - 1);
  return result;
}

function quickSortHelper(arr: number[], low: number, high: number): void {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSortHelper(arr, low, pivotIndex - 1);
    quickSortHelper(arr, pivotIndex + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      demo: quickSort.demo,
    },
    heap: {
      name: 'Heap Sort',
      description: 'Heap Sort first builds a max heap from the input data, then repeatedly extracts the maximum element from the heap and rebuilds the heap until all elements are sorted.',
      timeComplexity: 'Best: O(n log n), Average: O(n log n), Worst: O(n log n)',
      spaceComplexity: 'O(1) - In-place',
      code: `function heapSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(result, n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [result[0], result[i]] = [result[i], result[0]];
    heapify(result, i, 0);
  }
  return result;
}

function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
      demo: heapSort.demo,
    },
  },
};

export default function AlgorithmPage() {
  const { categoryId, algorithmId } = useParams<{ categoryId: string; algorithmId: string }>();
  const [demoResult, setDemoResult] = useState<string>('');

  const info = algorithmInfo[categoryId || '']?.[algorithmId || ''];

  const runDemo = useCallback(() => {
    if (info?.demo) {
      try {
        const result = info.demo();
        setDemoResult(result);
      } catch (e) {
        setDemoResult(`Error: ${e}`);
      }
    }
  }, [info]);

  // Reset demo result when algorithm changes - this is intentional
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDemoResult('');
  }, [categoryId, algorithmId]);

  if (!info) {
    return (
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/category/${categoryId}`}>{categoryId}</Link>
          <span>/</span>
          <span>Not Found</span>
        </div>
        <h2>Algorithm Not Found</h2>
        <p>The algorithm you're looking for doesn't exist or hasn't been implemented yet.</p>
        <Link to={`/category/${categoryId}`}>
          <button>Back to Category</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/category/${categoryId}`}>{categoryId}</Link>
        <span>/</span>
        <span>{info.name}</span>
      </div>

      <h2>{info.name}</h2>
      
      <div className="tags">
        <span className="tag">Time: {info.timeComplexity}</span>
        <span className="tag">Space: {info.spaceComplexity}</span>
      </div>

      <p className="description">{info.description}</p>

      <div className="grid-2">
        <div>
          <h3>Implementation</h3>
          <div className="code-block">
            <pre>{info.code}</pre>
          </div>
        </div>

        <div>
          <h3>Demo</h3>
          <button onClick={runDemo} style={{ marginBottom: '1rem' }}>
            ▶️ Run Demo
          </button>
          {demoResult && (
            <div className="info-box">
              <h4>Result</h4>
              <p>{demoResult}</p>
            </div>
          )}

          <div className="info-box" style={{ marginTop: '1rem' }}>
            <h4>When to Use</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              {categoryId === 'sorting' && algorithmId === 'bubble' && (
                <>
                  <li>Teaching and learning purposes</li>
                  <li>Very small arrays</li>
                  <li>Nearly sorted data (with early exit)</li>
                </>
              )}
              {categoryId === 'sorting' && algorithmId === 'selection' && (
                <>
                  <li>When memory is limited</li>
                  <li>When number of swaps matters</li>
                  <li>Small datasets</li>
                </>
              )}
              {categoryId === 'sorting' && algorithmId === 'insertion' && (
                <>
                  <li>Nearly sorted data</li>
                  <li>Small datasets</li>
                  <li>Online sorting (streaming data)</li>
                </>
              )}
              {categoryId === 'sorting' && algorithmId === 'merge' && (
                <>
                  <li>Stable sort required</li>
                  <li>Guaranteed O(n log n)</li>
                  <li>External sorting (large files)</li>
                </>
              )}
              {categoryId === 'sorting' && algorithmId === 'quick' && (
                <>
                  <li>General purpose sorting</li>
                  <li>In-place sorting needed</li>
                  <li>Average case performance</li>
                </>
              )}
              {categoryId === 'sorting' && algorithmId === 'heap' && (
                <>
                  <li>O(1) extra memory requirement</li>
                  <li>Guaranteed O(n log n)</li>
                  <li>No stable sort required</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <Link to="/visualizer">
        <button style={{ marginTop: '2rem' }}>
          🎬 See in Visualizer
        </button>
      </Link>
    </div>
  );
}
