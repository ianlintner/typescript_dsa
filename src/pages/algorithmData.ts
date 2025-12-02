// Import sorting algorithms
import * as bubbleSort from '../algorithms/sorting/bubbleSort';
import * as selectionSort from '../algorithms/sorting/selectionSort';
import * as insertionSort from '../algorithms/sorting/insertionSort';
import * as mergeSort from '../algorithms/sorting/mergeSort';
import * as quickSort from '../algorithms/sorting/quickSort';
import * as heapSort from '../algorithms/sorting/heapSort';
import * as countingSort from '../algorithms/sorting/countingSort';
import * as radixSort from '../algorithms/sorting/radixSort';

// Import searching algorithms
import * as linearSearch from '../algorithms/searching/linearSearch';
import * as binarySearch from '../algorithms/searching/binarySearch';
import * as advancedSearch from '../algorithms/searching/advancedSearch';
import * as quickSelect from '../algorithms/searching/quickSelect';

// Import graph algorithms
import * as bfsDfs from '../graphs/bfsDfs';
import * as dijkstra from '../graphs/dijkstra';
import * as bellmanFord from '../graphs/bellmanFord';
import * as floydWarshall from '../graphs/floydWarshall';
import * as aStar from '../graphs/aStar';
import * as mst from '../graphs/mst';
import * as topologicalSort from '../graphs/topologicalSort';

// Import DP algorithms
import * as fibonacci from '../dp/fibonacci';
import * as coinChange from '../dp/coinChange';
import * as knapsack from '../dp/knapsack';
import * as lcs from '../dp/lcs';
import * as editDistance from '../dp/editDistance';
import * as lis from '../dp/lis';
import * as bitmaskTsp from '../dp/bitmaskTsp';
import * as stateCompressionGrid from '../dp/stateCompressionGrid';

// Import data structures
import * as unionFind from '../data-structures/unionFind';
import * as trie from '../data-structures/trie';
import * as lruCache from '../data-structures/lruCache';
import * as lfuCache from '../data-structures/lfuCache';
import * as fenwickTree from '../data-structures/fenwickTree';
import * as segmentTree from '../data-structures/segmentTree';
import * as heapPatterns from '../data-structures/heapPatterns';

// Import string algorithms
import * as kmp from '../strings/kmp';
import * as rabinKarp from '../strings/rabinKarp';
import * as zAlgorithm from '../strings/zAlgorithm';
import * as manacher from '../strings/manacher';
import * as suffixArray from '../strings/suffixArray';

// Import patterns
import * as slidingWindow from '../patterns/slidingWindow';
import * as twoPointers from '../patterns/twoPointers';
import * as monotonicStack from '../patterns/monotonicStack';
import * as backtracking from '../patterns/backtracking';
import * as meetInTheMiddle from '../patterns/meetInTheMiddle';
import * as binarySearchOnAnswer from '../patterns/binarySearchOnAnswer';

// Import math utilities
import * as numberTheory from '../math-utils/numberTheory';

export interface AlgorithmInfo {
  name: string;
  code: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  demo: () => string;
  whenToUse?: string[];
}

export const algorithmInfo: Record<string, Record<string, AlgorithmInfo>> = {
  sorting: {
    bubble: {
      name: 'Bubble Sort',
      description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      timeComplexity: 'Best: O(n), Average: O(n²), Worst: O(n²)',
      spaceComplexity: 'O(1) - In-place',
      code: `function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 0; i < result.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < result.length - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return result;
}`,
      demo: bubbleSort.demo,
      whenToUse: ['Teaching and learning purposes', 'Very small arrays', 'Nearly sorted data'],
    },
    selection: {
      name: 'Selection Sort',
      description: 'Selection Sort divides the input into sorted and unsorted regions, repeatedly selecting the smallest element from unsorted.',
      timeComplexity: 'Best: O(n²), Average: O(n²), Worst: O(n²)',
      spaceComplexity: 'O(1) - In-place',
      code: `function selectionSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 0; i < result.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < result.length; j++) {
      if (result[j] < result[minIdx]) minIdx = j;
    }
    [result[i], result[minIdx]] = [result[minIdx], result[i]];
  }
  return result;
}`,
      demo: selectionSort.demo,
      whenToUse: ['When memory is limited', 'When number of swaps matters', 'Small datasets'],
    },
    insertion: {
      name: 'Insertion Sort',
      description: 'Insertion Sort builds the final sorted array one item at a time by inserting elements into their correct position.',
      timeComplexity: 'Best: O(n), Average: O(n²), Worst: O(n²)',
      spaceComplexity: 'O(1) - In-place',
      code: `function insertionSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 1; i < result.length; i++) {
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
      whenToUse: ['Nearly sorted data', 'Small datasets', 'Online sorting (streaming data)'],
    },
    merge: {
      name: 'Merge Sort',
      description: 'Merge Sort is a divide-and-conquer algorithm that divides the array, recursively sorts halves, then merges them.',
      timeComplexity: 'Best: O(n log n), Average: O(n log n), Worst: O(n log n)',
      spaceComplexity: 'O(n) - Auxiliary space for merging',
      code: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr];
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
      demo: mergeSort.demo,
      whenToUse: ['Stable sort required', 'Guaranteed O(n log n)', 'External sorting (large files)'],
    },
    quick: {
      name: 'Quick Sort',
      description: 'Quick Sort picks a pivot and partitions the array around it, recursively sorting the partitions.',
      timeComplexity: 'Best: O(n log n), Average: O(n log n), Worst: O(n²)',
      spaceComplexity: 'O(log n) - Stack space for recursion',
      code: `function quickSort(arr: number[]): number[] {
  const result = [...arr];
  quickSortHelper(result, 0, result.length - 1);
  return result;
}`,
      demo: quickSort.demo,
      whenToUse: ['General purpose sorting', 'In-place sorting needed', 'Average case performance'],
    },
    heap: {
      name: 'Heap Sort',
      description: 'Heap Sort builds a max heap then repeatedly extracts the maximum element.',
      timeComplexity: 'Best: O(n log n), Average: O(n log n), Worst: O(n log n)',
      spaceComplexity: 'O(1) - In-place',
      code: `function heapSort(arr: number[]): number[] {
  const result = [...arr];
  // Build max heap, then extract elements
  for (let i = Math.floor(result.length / 2) - 1; i >= 0; i--) heapify(result, result.length, i);
  for (let i = result.length - 1; i > 0; i--) {
    [result[0], result[i]] = [result[i], result[0]];
    heapify(result, i, 0);
  }
  return result;
}`,
      demo: heapSort.demo,
      whenToUse: ['O(1) extra memory requirement', 'Guaranteed O(n log n)', 'No stable sort required'],
    },
    counting: {
      name: 'Counting Sort',
      description: 'Counting Sort counts occurrences of each element and rebuilds the sorted array. Works for integers with limited range.',
      timeComplexity: 'O(n + k) where k is the range',
      spaceComplexity: 'O(n + k)',
      code: `function countingSort(arr: number[]): number[] {
  const min = Math.min(...arr), max = Math.max(...arr);
  const count = new Array(max - min + 1).fill(0);
  for (const num of arr) count[num - min]++;
  const result = [];
  for (let i = 0; i < count.length; i++) {
    while (count[i]-- > 0) result.push(i + min);
  }
  return result;
}`,
      demo: countingSort.demo,
      whenToUse: ['Integer inputs with limited range', 'When k = O(n)', 'Stable sorting needed'],
    },
    radix: {
      name: 'Radix Sort',
      description: 'Radix Sort sorts by individual digits using counting sort as a subroutine.',
      timeComplexity: 'O(d·(n+k)) where d is digits, k is base',
      spaceComplexity: 'O(n + k)',
      code: `function radixSort(arr: number[]): number[] {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  return arr;
}`,
      demo: radixSort.demo,
      whenToUse: ['Large integers with limited digits', 'When d is small', 'Linear time sorting needed'],
    },
  },
  searching: {
    linear: {
      name: 'Linear Search',
      description: 'Linear Search scans sequentially until the element is found or the end is reached.',
      timeComplexity: 'Best: O(1), Average: O(n), Worst: O(n)',
      spaceComplexity: 'O(1)',
      code: `function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      demo: linearSearch.demo,
      whenToUse: ['Unsorted data', 'Small datasets', 'One-time search'],
    },
    binary: {
      name: 'Binary Search',
      description: 'Binary Search repeatedly halves the search interval in a sorted array.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1) iterative, O(log n) recursive',
      code: `function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      demo: binarySearch.demo,
      whenToUse: ['Sorted arrays', 'Large datasets', 'Repeated searches'],
    },
    rotated: {
      name: 'Search Rotated Array',
      description: 'Binary search variant for arrays that have been rotated at some pivot.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `function searchRotated(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[left] <= arr[mid]) {
      if (arr[left] <= target && target < arr[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (arr[mid] < target && target <= arr[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
      demo: advancedSearch.demo,
      whenToUse: ['Rotated sorted arrays', 'Finding pivot point', 'Modified binary search problems'],
    },
    exponential: {
      name: 'Exponential Search',
      description: 'Exponential Search finds the range then applies binary search. Good for unbounded arrays.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `function exponentialSearch(arr: number[], target: number): number {
  if (arr[0] === target) return 0;
  let bound = 1;
  while (bound < arr.length && arr[bound] <= target) bound *= 2;
  return binarySearch(arr, target, bound/2, Math.min(bound, arr.length-1));
}`,
      demo: advancedSearch.demo,
      whenToUse: ['Unbounded/infinite arrays', 'Element near beginning', 'Unknown array size'],
    },
    quickselect: {
      name: 'QuickSelect',
      description: 'QuickSelect finds the kth smallest element using partition similar to QuickSort.',
      timeComplexity: 'Average: O(n), Worst: O(n²)',
      spaceComplexity: 'O(1)',
      code: `function quickSelect(arr: number[], k: number): number {
  const result = [...arr];
  return quickSelectHelper(result, 0, result.length - 1, k);
}`,
      demo: quickSelect.demo,
      whenToUse: ['Finding kth smallest/largest', 'Finding median', 'Partial sorting'],
    },
    peak: {
      name: 'Find Peak Element',
      description: 'Binary search variant to find a local maximum in an array.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `function findPeakElement(arr: number[]): number {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] > arr[mid + 1]) right = mid;
    else left = mid + 1;
  }
  return left;
}`,
      demo: advancedSearch.demo,
      whenToUse: ['Finding local maximum', 'Mountain arrays', 'Bitonic sequences'],
    },
  },
  graphs: {
    bfs: {
      name: 'Breadth-First Search',
      description: 'BFS explores graph level by level using a queue. Finds shortest path in unweighted graphs.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      code: `function bfs(graph: Map<number, number[]>, start: number): number[] {
  const visited = new Set<number>(), result: number[] = [], queue = [start];
  visited.add(start);
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) { visited.add(neighbor); queue.push(neighbor); }
    }
  }
  return result;
}`,
      demo: bfsDfs.demo,
      whenToUse: ['Shortest path (unweighted)', 'Level-order traversal', 'Finding connected components'],
    },
    dfs: {
      name: 'Depth-First Search',
      description: 'DFS explores as far as possible along each branch before backtracking.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      code: `function dfs(graph: Map<number, number[]>, start: number): number[] {
  const visited = new Set<number>(), result: number[] = [];
  function dfsHelper(node: number) {
    visited.add(node); result.push(node);
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) dfsHelper(neighbor);
    }
  }
  dfsHelper(start);
  return result;
}`,
      demo: bfsDfs.demo,
      whenToUse: ['Cycle detection', 'Topological sorting', 'Path finding', 'Tree traversal'],
    },
    dijkstra: {
      name: "Dijkstra's Algorithm",
      description: "Dijkstra's finds shortest paths from a source to all vertices in a weighted graph with non-negative edges.",
      timeComplexity: 'O((V + E) log V) with heap',
      spaceComplexity: 'O(V)',
      code: `function dijkstra(graph: WeightedGraph, start: number): Map<number, number> {
  const distances = new Map<number, number>();
  const pq: [number, number][] = [[0, start]];
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [dist, node] = pq.shift()!;
    if (distances.has(node)) continue;
    distances.set(node, dist);
    for (const [neighbor, weight] of graph.get(node) || []) {
      if (!distances.has(neighbor)) pq.push([dist + weight, neighbor]);
    }
  }
  return distances;
}`,
      demo: dijkstra.demo,
      whenToUse: ['Shortest path with non-negative weights', 'GPS navigation', 'Network routing'],
    },
    astar: {
      name: 'A* Search',
      description: 'A* uses heuristics to guide the search, combining actual cost with estimated cost to goal.',
      timeComplexity: 'O(b^d) where b is branching factor',
      spaceComplexity: 'O(b^d)',
      code: `function aStar(start: Node, goal: Node, heuristic: (a: Node, b: Node) => number): Path {
  const openSet = new PriorityQueue();
  openSet.enqueue(start, 0);
  const gScore = new Map([[start, 0]]);
  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    if (current === goal) return reconstructPath(current);
    for (const neighbor of getNeighbors(current)) {
      const tentativeG = gScore.get(current)! + cost(current, neighbor);
      if (tentativeG < (gScore.get(neighbor) ?? Infinity)) {
        gScore.set(neighbor, tentativeG);
        openSet.enqueue(neighbor, tentativeG + heuristic(neighbor, goal));
      }
    }
  }
}`,
      demo: aStar.demo,
      whenToUse: ['Pathfinding with heuristics', 'Game AI', 'Maze solving', 'Map navigation'],
    },
    'bellman-ford': {
      name: 'Bellman-Ford',
      description: 'Bellman-Ford finds shortest paths and can handle negative edge weights and detect negative cycles.',
      timeComplexity: 'O(V·E)',
      spaceComplexity: 'O(V)',
      code: `function bellmanFord(graph: Edge[], V: number, src: number): number[] {
  const dist = Array(V).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i < V - 1; i++) {
    for (const { u, v, w } of graph) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  return dist;
}`,
      demo: bellmanFord.demo,
      whenToUse: ['Negative edge weights', 'Detecting negative cycles', 'Currency arbitrage'],
    },
    'floyd-warshall': {
      name: 'Floyd-Warshall',
      description: 'Floyd-Warshall finds shortest paths between all pairs of vertices.',
      timeComplexity: 'O(V³)',
      spaceComplexity: 'O(V²)',
      code: `function floydWarshall(graph: number[][]): number[][] {
  const dist = graph.map(row => [...row]);
  const n = graph.length;
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
      }
    }
  }
  return dist;
}`,
      demo: floydWarshall.demo,
      whenToUse: ['All-pairs shortest paths', 'Dense graphs', 'Transitive closure'],
    },
    mst: {
      name: 'MST (Kruskal/Prim)',
      description: 'Minimum Spanning Tree algorithms find the subset of edges connecting all vertices with minimum total weight.',
      timeComplexity: 'O(E log V)',
      spaceComplexity: 'O(V)',
      code: `function kruskal(edges: Edge[], V: number): Edge[] {
  edges.sort((a, b) => a.weight - b.weight);
  const uf = new UnionFind(V);
  const mst: Edge[] = [];
  for (const edge of edges) {
    if (uf.find(edge.u) !== uf.find(edge.v)) {
      uf.union(edge.u, edge.v);
      mst.push(edge);
    }
  }
  return mst;
}`,
      demo: mst.demo,
      whenToUse: ['Network design', 'Clustering', 'Approximation algorithms'],
    },
    topological: {
      name: 'Topological Sort',
      description: 'Topological Sort orders vertices in a DAG so that for every edge (u,v), u comes before v.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      code: `function topologicalSort(graph: Map<number, number[]>): number[] {
  const visited = new Set<number>(), result: number[] = [];
  function dfs(node: number) {
    visited.add(node);
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) dfs(neighbor);
    }
    result.unshift(node);
  }
  for (const node of graph.keys()) if (!visited.has(node)) dfs(node);
  return result;
}`,
      demo: topologicalSort.demo,
      whenToUse: ['Task scheduling', 'Build systems', 'Course prerequisites'],
    },
  },
  dp: {
    fibonacci: {
      name: 'Fibonacci',
      description: 'Classic DP example showing memoization and bottom-up approaches.',
      timeComplexity: 'O(n) with DP',
      spaceComplexity: 'O(1) iterative',
      code: `function fibIterative(n: number): number {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1; prev1 = current;
  }
  return prev1;
}`,
      demo: fibonacci.demo,
      whenToUse: ['Learning DP concepts', 'Optimization problems', 'Counting problems'],
    },
    'coin-change': {
      name: 'Coin Change',
      description: 'Find minimum coins or count ways to make change for an amount.',
      timeComplexity: 'O(amount × coins)',
      spaceComplexity: 'O(amount)',
      code: `function coinChange(coins: number[], amount: number): number {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      demo: coinChange.demo,
      whenToUse: ['Making change', 'Minimum coins', 'Counting combinations'],
    },
    knapsack: {
      name: '0/1 Knapsack',
      description: 'Maximize value while staying within weight capacity, each item used at most once.',
      timeComplexity: 'O(n × W)',
      spaceComplexity: 'O(W)',
      code: `function knapsack(weights: number[], values: number[], W: number): number {
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}`,
      demo: knapsack.demo,
      whenToUse: ['Resource allocation', 'Budget optimization', 'Subset selection'],
    },
    lcs: {
      name: 'Longest Common Subsequence',
      description: 'Find the longest subsequence common to two sequences.',
      timeComplexity: 'O(n × m)',
      spaceComplexity: 'O(min(n, m))',
      code: `function lcs(s1: string, s2: string): number {
  const m = s1.length, n = s2.length;
  const dp = Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    let prev = 0;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      dp[j] = s1[i-1] === s2[j-1] ? prev + 1 : Math.max(dp[j], dp[j-1]);
      prev = temp;
    }
  }
  return dp[n];
}`,
      demo: lcs.demo,
      whenToUse: ['Diff tools', 'DNA sequencing', 'Version control'],
    },
    'edit-distance': {
      name: 'Edit Distance',
      description: 'Minimum operations (insert, delete, replace) to transform one string into another.',
      timeComplexity: 'O(n × m)',
      spaceComplexity: 'O(min(n, m))',
      code: `function editDistance(s1: string, s2: string): number {
  const m = s1.length, n = s2.length;
  let dp = Array.from({length: n + 1}, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const newDp = [i];
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) newDp[j] = dp[j-1];
      else newDp[j] = 1 + Math.min(dp[j-1], dp[j], newDp[j-1]);
    }
    dp = newDp;
  }
  return dp[n];
}`,
      demo: editDistance.demo,
      whenToUse: ['Spell checking', 'DNA analysis', 'Fuzzy matching'],
    },
    lis: {
      name: 'Longest Increasing Subsequence',
      description: 'Find the longest strictly increasing subsequence.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      code: `function lis(nums: number[]): number {
  const tails: number[] = [];
  for (const num of nums) {
    let left = 0, right = tails.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (tails[mid] < num) left = mid + 1;
      else right = mid;
    }
    tails[left] = num;
  }
  return tails.length;
}`,
      demo: lis.demo,
      whenToUse: ['Sequence analysis', 'Patience sorting', 'Box stacking'],
    },
    tsp: {
      name: 'TSP (Bitmask DP)',
      description: 'Traveling Salesman Problem using state compression with bitmasks.',
      timeComplexity: 'O(n² × 2ⁿ)',
      spaceComplexity: 'O(n × 2ⁿ)',
      code: `function tsp(dist: number[][]): number {
  const n = dist.length;
  const dp = Array.from({length: 1 << n}, () => Array(n).fill(Infinity));
  dp[1][0] = 0;
  for (let mask = 1; mask < (1 << n); mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;
        dp[mask | (1 << v)][v] = Math.min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v]);
      }
    }
  }
  return Math.min(...dp[(1 << n) - 1].map((d, i) => d + dist[i][0]));
}`,
      demo: bitmaskTsp.demo,
      whenToUse: ['Route optimization', 'Circuit design', 'Logistics'],
    },
    grid: {
      name: 'Grid DP',
      description: 'Dynamic programming on grids with state compression.',
      timeComplexity: 'O(n × 2^m)',
      spaceComplexity: 'O(2^m)',
      code: `function gridDP(grid: number[][]): number {
  const m = grid.length, n = grid[0].length;
  const dp = Array(n).fill(0);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) dp[j] = grid[i][j];
      else if (i === 0) dp[j] = dp[j-1] + grid[i][j];
      else if (j === 0) dp[j] = dp[j] + grid[i][j];
      else dp[j] = Math.min(dp[j-1], dp[j]) + grid[i][j];
    }
  }
  return dp[n-1];
}`,
      demo: stateCompressionGrid.demo,
      whenToUse: ['Path counting', 'Minimum path sum', 'Robot navigation'],
    },
  },
  'data-structures': {
    'union-find': {
      name: 'Union-Find (DSU)',
      description: 'Disjoint Set Union with path compression and union by rank for near-constant operations.',
      timeComplexity: 'O(α(n)) amortized',
      spaceComplexity: 'O(n)',
      code: `class UnionFind {
  parent: number[]; rank: number[];
  constructor(n: number) {
    this.parent = Array.from({length: n}, (_, i) => i);
    this.rank = Array(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x: number, y: number): void {
    const px = this.find(x), py = this.find(y);
    if (this.rank[px] < this.rank[py]) this.parent[px] = py;
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
    else { this.parent[py] = px; this.rank[px]++; }
  }
}`,
      demo: unionFind.demo,
      whenToUse: ['Connected components', 'Kruskal MST', 'Cycle detection'],
    },
    trie: {
      name: 'Trie',
      description: 'Prefix tree for efficient string operations like autocomplete and spell checking.',
      timeComplexity: 'O(m) per operation',
      spaceComplexity: 'O(Σ × m × n)',
      code: `class Trie {
  root = new TrieNode();
  insert(word: string) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) node.children.set(char, new TrieNode());
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }
  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }
}`,
      demo: trie.demo,
      whenToUse: ['Autocomplete', 'Spell checking', 'IP routing', 'Word games'],
    },
    lru: {
      name: 'LRU Cache',
      description: 'Least Recently Used cache with O(1) get and put operations.',
      timeComplexity: 'O(1) get/put',
      spaceComplexity: 'O(capacity)',
      code: `class LRUCache {
  cache = new Map<number, number>();
  constructor(private capacity: number) {}
  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key: number, value: number): void {
    this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}`,
      demo: lruCache.demo,
      whenToUse: ['Caching', 'Memory management', 'Browser history'],
    },
    lfu: {
      name: 'LFU Cache',
      description: 'Least Frequently Used cache evicting items with lowest access count.',
      timeComplexity: 'O(1) get/put',
      spaceComplexity: 'O(capacity)',
      code: `class LFUCache {
  // Uses HashMap + LinkedHashSet per frequency
  // Tracks min frequency for O(1) eviction
  get(key: number): number { /* ... */ }
  put(key: number, value: number): void { /* ... */ }
}`,
      demo: lfuCache.demo,
      whenToUse: ['Caching hot data', 'CDN caching', 'Database query caching'],
    },
    fenwick: {
      name: 'Fenwick Tree (BIT)',
      description: 'Binary Indexed Tree for efficient prefix sums and point updates.',
      timeComplexity: 'O(log n) update/query',
      spaceComplexity: 'O(n)',
      code: `class FenwickTree {
  tree: number[];
  constructor(n: number) { this.tree = Array(n + 1).fill(0); }
  update(i: number, delta: number): void {
    for (++i; i < this.tree.length; i += i & (-i)) this.tree[i] += delta;
  }
  query(i: number): number {
    let sum = 0;
    for (++i; i > 0; i -= i & (-i)) sum += this.tree[i];
    return sum;
  }
}`,
      demo: fenwickTree.demo,
      whenToUse: ['Range sum queries', 'Inversions counting', 'Dynamic cumulative frequency'],
    },
    segment: {
      name: 'Segment Tree',
      description: 'Tree for range queries and updates with lazy propagation support.',
      timeComplexity: 'O(log n) query/update',
      spaceComplexity: 'O(n)',
      code: `class SegmentTree {
  tree: number[];
  constructor(arr: number[]) {
    this.tree = Array(4 * arr.length).fill(0);
    this.build(arr, 0, 0, arr.length - 1);
  }
  query(l: number, r: number): number { return this.queryHelper(0, 0, this.n-1, l, r); }
  update(idx: number, val: number): void { this.updateHelper(0, 0, this.n-1, idx, val); }
}`,
      demo: segmentTree.demo,
      whenToUse: ['Range queries', 'Range updates', 'Interval problems'],
    },
    heap: {
      name: 'Heap Patterns',
      description: 'Priority queue patterns for top-k, median finding, and scheduling.',
      timeComplexity: 'O(log n) insert/extract',
      spaceComplexity: 'O(n)',
      code: `class MinHeap<T> {
  heap: T[] = [];
  push(val: T): void {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const result = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return result;
  }
}`,
      demo: heapPatterns.demo,
      whenToUse: ['Priority scheduling', 'Top-K elements', 'Median finding'],
    },
  },
  strings: {
    kmp: {
      name: 'KMP Algorithm',
      description: 'Knuth-Morris-Pratt pattern matching using prefix function for O(n+m) search.',
      timeComplexity: 'O(n + m)',
      spaceComplexity: 'O(m)',
      code: `function kmpSearch(text: string, pattern: string): number[] {
  const prefix = buildPrefixTable(pattern);
  const matches: number[] = [];
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = prefix[j - 1];
    if (text[i] === pattern[j]) j++;
    if (j === pattern.length) { matches.push(i - pattern.length + 1); j = prefix[j - 1]; }
  }
  return matches;
}`,
      demo: kmp.demo,
      whenToUse: ['Pattern matching', 'Text search', 'Substring finding'],
    },
    'rabin-karp': {
      name: 'Rabin-Karp',
      description: 'Rolling hash algorithm for pattern matching, good for multiple pattern search.',
      timeComplexity: 'O(n + m) average',
      spaceComplexity: 'O(1)',
      code: `function rabinKarp(text: string, pattern: string): number[] {
  const d = 256, q = 101;
  let pHash = 0, tHash = 0, h = 1;
  const matches: number[] = [];
  for (let i = 0; i < pattern.length - 1; i++) h = (h * d) % q;
  for (let i = 0; i < pattern.length; i++) {
    pHash = (d * pHash + pattern.charCodeAt(i)) % q;
    tHash = (d * tHash + text.charCodeAt(i)) % q;
  }
  // Slide pattern over text...
  return matches;
}`,
      demo: rabinKarp.demo,
      whenToUse: ['Multiple pattern search', 'Plagiarism detection', 'DNA matching'],
    },
    'z-algorithm': {
      name: 'Z-Algorithm',
      description: 'Builds Z-array where Z[i] is length of longest substring starting at i that matches prefix.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function zAlgorithm(s: string): number[] {
  const z = Array(s.length).fill(0);
  let l = 0, r = 0;
  for (let i = 1; i < s.length; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < s.length && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) { l = i; r = i + z[i]; }
  }
  return z;
}`,
      demo: zAlgorithm.demo,
      whenToUse: ['Pattern matching', 'String period', 'Prefix matching'],
    },
    manacher: {
      name: "Manacher's Algorithm",
      description: "Finds longest palindromic substring in linear time.",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function manacher(s: string): string {
  const t = '#' + s.split('').join('#') + '#';
  const p = Array(t.length).fill(0);
  let c = 0, r = 0;
  for (let i = 0; i < t.length; i++) {
    if (i < r) p[i] = Math.min(r - i, p[2 * c - i]);
    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < t.length && t[i - p[i] - 1] === t[i + p[i] + 1]) p[i]++;
    if (i + p[i] > r) { c = i; r = i + p[i]; }
  }
  // Extract longest palindrome...
}`,
      demo: manacher.demo,
      whenToUse: ['Longest palindrome', 'Palindrome counting', 'String analysis'],
    },
    'suffix-array': {
      name: 'Suffix Array',
      description: 'Sorted array of all suffixes enabling efficient pattern matching and string analysis.',
      timeComplexity: 'O(n log n) construction',
      spaceComplexity: 'O(n)',
      code: `function buildSuffixArray(s: string): number[] {
  const n = s.length;
  const sa = Array.from({length: n}, (_, i) => i);
  sa.sort((a, b) => s.slice(a).localeCompare(s.slice(b)));
  return sa;
}`,
      demo: suffixArray.demo,
      whenToUse: ['Pattern matching', 'Longest common prefix', 'String compression'],
    },
  },
  patterns: {
    'sliding-window': {
      name: 'Sliding Window',
      description: 'Maintain a window with two pointers to efficiently process subarrays/substrings.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1) or O(k)',
      code: `function maxSumSubarray(arr: number[], k: number): number {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
      demo: slidingWindow.demo,
      whenToUse: ['Subarray problems', 'String matching', 'Running statistics'],
    },
    'two-pointers': {
      name: 'Two Pointers',
      description: 'Use two pointers moving toward each other or in same direction to solve array problems.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function twoSum(arr: number[], target: number): [number, number] | null {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}`,
      demo: twoPointers.demo,
      whenToUse: ['Sorted array problems', 'Pair finding', 'Container problems'],
    },
    'monotonic-stack': {
      name: 'Monotonic Stack',
      description: 'Stack maintaining monotonic order for next greater/smaller element problems.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function nextGreaterElement(arr: number[]): number[] {
  const result = Array(arr.length).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[stack[stack.length - 1]] < arr[i]) {
      result[stack.pop()!] = arr[i];
    }
    stack.push(i);
  }
  return result;
}`,
      demo: monotonicStack.demo,
      whenToUse: ['Next greater element', 'Histogram problems', 'Stock span'],
    },
    backtracking: {
      name: 'Backtracking',
      description: 'Explore all possibilities with pruning, building solutions incrementally.',
      timeComplexity: 'O(b^d)',
      spaceComplexity: 'O(d)',
      code: `function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  function backtrack(path: number[], used: boolean[]) {
    if (path.length === nums.length) { result.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      backtrack(path, used);
      path.pop(); used[i] = false;
    }
  }
  backtrack([], Array(nums.length).fill(false));
  return result;
}`,
      demo: backtracking.demo,
      whenToUse: ['Permutations', 'Combinations', 'Sudoku', 'N-Queens'],
    },
    'meet-middle': {
      name: 'Meet in the Middle',
      description: 'Split problem in half, solve independently, combine results for exponential speedup.',
      timeComplexity: 'O(2^(n/2))',
      spaceComplexity: 'O(2^(n/2))',
      code: `function meetInMiddle(arr: number[], target: number): boolean {
  const n = arr.length, mid = n >> 1;
  const left = generateSums(arr.slice(0, mid));
  const right = new Set(generateSums(arr.slice(mid)));
  for (const sum of left) {
    if (right.has(target - sum)) return true;
  }
  return false;
}`,
      demo: meetInTheMiddle.demo,
      whenToUse: ['Subset sum variants', 'Large state spaces', 'Cryptographic attacks'],
    },
    'binary-answer': {
      name: 'Binary Search on Answer',
      description: 'Binary search on the answer space when the answer has monotonic property.',
      timeComplexity: 'O(log(range) × n)',
      spaceComplexity: 'O(1)',
      code: `function minDays(bloomDay: number[], m: number, k: number): number {
  function canMake(days: number): boolean {
    let bouquets = 0, flowers = 0;
    for (const day of bloomDay) {
      if (day <= days) { if (++flowers === k) { bouquets++; flowers = 0; } }
      else flowers = 0;
    }
    return bouquets >= m;
  }
  let left = Math.min(...bloomDay), right = Math.max(...bloomDay);
  while (left < right) {
    const mid = (left + right) >> 1;
    if (canMake(mid)) right = mid;
    else left = mid + 1;
  }
  return canMake(left) ? left : -1;
}`,
      demo: binarySearchOnAnswer.demo,
      whenToUse: ['Optimization problems', 'Minimizing maximum', 'Capacity problems'],
    },
  },
  math: {
    'gcd-lcm': {
      name: 'GCD / LCM',
      description: 'Greatest Common Divisor and Least Common Multiple using Euclidean algorithm.',
      timeComplexity: 'O(log min(a,b))',
      spaceComplexity: 'O(1)',
      code: `function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}`,
      demo: numberTheory.demo,
      whenToUse: ['Fraction simplification', 'Scheduling', 'Number theory'],
    },
    'mod-exp': {
      name: 'Modular Exponentiation',
      description: 'Compute (base^exp) mod m efficiently using binary exponentiation.',
      timeComplexity: 'O(log exp)',
      spaceComplexity: 'O(1)',
      code: `function modPow(base: number, exp: number, m: number): number {
  let result = 1;
  base = base % m;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % m;
    exp = Math.floor(exp / 2);
    base = (base * base) % m;
  }
  return result;
}`,
      demo: numberTheory.demo,
      whenToUse: ['Cryptography', 'Large power calculations', 'Modular arithmetic'],
    },
    sieve: {
      name: 'Sieve of Eratosthenes',
      description: 'Find all prime numbers up to n efficiently.',
      timeComplexity: 'O(n log log n)',
      spaceComplexity: 'O(n)',
      code: `function sieve(n: number): number[] {
  const isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) isPrime[j] = false;
    }
  }
  return isPrime.map((p, i) => p ? i : -1).filter(i => i > 0);
}`,
      demo: numberTheory.demo,
      whenToUse: ['Prime generation', 'Factorization prep', 'Number theory'],
    },
    'prime-factor': {
      name: 'Prime Factorization',
      description: 'Decompose a number into its prime factors.',
      timeComplexity: 'O(√n)',
      spaceComplexity: 'O(log n)',
      code: `function primeFactors(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  for (let i = 2; i * i <= n; i++) {
    while (n % i === 0) {
      factors.set(i, (factors.get(i) || 0) + 1);
      n = Math.floor(n / i);
    }
  }
  if (n > 1) factors.set(n, 1);
  return factors;
}`,
      demo: numberTheory.demo,
      whenToUse: ['Divisibility', 'GCD/LCM', 'Cryptography'],
    },
    'euler-totient': {
      name: "Euler's Totient",
      description: 'Count integers up to n that are coprime with n.',
      timeComplexity: 'O(√n)',
      spaceComplexity: 'O(1)',
      code: `function eulerTotient(n: number): number {
  let result = n;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      while (n % i === 0) n = Math.floor(n / i);
      result -= Math.floor(result / i);
    }
  }
  if (n > 1) result -= Math.floor(result / n);
  return result;
}`,
      demo: numberTheory.demo,
      whenToUse: ['RSA cryptography', 'Modular multiplicative inverse', 'Group theory'],
    },
    binomial: {
      name: 'Binomial Coefficients',
      description: 'Calculate C(n,k) - number of ways to choose k items from n.',
      timeComplexity: 'O(k)',
      spaceComplexity: 'O(1)',
      code: `function binomial(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}`,
      demo: numberTheory.demo,
      whenToUse: ['Combinations', 'Probability', 'Pascal triangle'],
    },
  },
};
