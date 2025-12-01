import { Link, useParams } from 'react-router-dom';

interface Algorithm {
  id: string;
  name: string;
  complexity: { time: string; space: string };
  description: string;
}

const algorithmsByCategory: Record<string, Algorithm[]> = {
  sorting: [
    { id: 'bubble', name: 'Bubble Sort', complexity: { time: 'O(n²)', space: 'O(1)' }, description: 'Repeatedly swap adjacent elements that are out of order' },
    { id: 'selection', name: 'Selection Sort', complexity: { time: 'O(n²)', space: 'O(1)' }, description: 'Select minimum element and place at front' },
    { id: 'insertion', name: 'Insertion Sort', complexity: { time: 'O(n²)', space: 'O(1)' }, description: 'Build sorted array by inserting elements one by one' },
    { id: 'merge', name: 'Merge Sort', complexity: { time: 'O(n log n)', space: 'O(n)' }, description: 'Divide and conquer, merge sorted halves' },
    { id: 'quick', name: 'Quick Sort', complexity: { time: 'O(n log n)', space: 'O(log n)' }, description: 'Partition around pivot, recursively sort' },
    { id: 'heap', name: 'Heap Sort', complexity: { time: 'O(n log n)', space: 'O(1)' }, description: 'Build max heap and extract elements' },
    { id: 'counting', name: 'Counting Sort', complexity: { time: 'O(n+k)', space: 'O(k)' }, description: 'Count occurrences for integer sorting' },
    { id: 'radix', name: 'Radix Sort', complexity: { time: 'O(d·n)', space: 'O(n+k)' }, description: 'Sort by individual digits' },
  ],
  searching: [
    { id: 'linear', name: 'Linear Search', complexity: { time: 'O(n)', space: 'O(1)' }, description: 'Scan sequentially until element found' },
    { id: 'binary', name: 'Binary Search', complexity: { time: 'O(log n)', space: 'O(1)' }, description: 'Halve search space in sorted array' },
    { id: 'rotated', name: 'Search Rotated Array', complexity: { time: 'O(log n)', space: 'O(1)' }, description: 'Binary search on rotated sorted array' },
    { id: 'exponential', name: 'Exponential Search', complexity: { time: 'O(log n)', space: 'O(1)' }, description: 'Find range then binary search' },
    { id: 'quickselect', name: 'QuickSelect', complexity: { time: 'O(n)', space: 'O(1)' }, description: 'Find kth smallest/largest element' },
    { id: 'peak', name: 'Find Peak Element', complexity: { time: 'O(log n)', space: 'O(1)' }, description: 'Binary search for local maximum' },
  ],
  graphs: [
    { id: 'bfs', name: 'BFS', complexity: { time: 'O(V+E)', space: 'O(V)' }, description: 'Level-order traversal using queue' },
    { id: 'dfs', name: 'DFS', complexity: { time: 'O(V+E)', space: 'O(V)' }, description: 'Depth-first traversal using stack/recursion' },
    { id: 'dijkstra', name: "Dijkstra's Algorithm", complexity: { time: 'O((V+E)log V)', space: 'O(V)' }, description: 'Single source shortest paths (non-negative)' },
    { id: 'astar', name: 'A* Search', complexity: { time: 'O(b^d)', space: 'O(b^d)' }, description: 'Heuristic-guided pathfinding' },
    { id: 'bellman-ford', name: 'Bellman-Ford', complexity: { time: 'O(V·E)', space: 'O(V)' }, description: 'Shortest paths with negative edges' },
    { id: 'floyd-warshall', name: 'Floyd-Warshall', complexity: { time: 'O(V³)', space: 'O(V²)' }, description: 'All-pairs shortest paths' },
    { id: 'mst', name: 'MST (Kruskal/Prim)', complexity: { time: 'O(E log V)', space: 'O(V)' }, description: 'Minimum spanning tree algorithms' },
    { id: 'topological', name: 'Topological Sort', complexity: { time: 'O(V+E)', space: 'O(V)' }, description: 'Linear ordering of DAG vertices' },
  ],
  dp: [
    { id: 'fibonacci', name: 'Fibonacci', complexity: { time: 'O(n)', space: 'O(1)' }, description: 'Classic DP example with memoization' },
    { id: 'coin-change', name: 'Coin Change', complexity: { time: 'O(n·m)', space: 'O(n)' }, description: 'Minimum coins or ways to make change' },
    { id: 'knapsack', name: '0/1 Knapsack', complexity: { time: 'O(n·W)', space: 'O(W)' }, description: 'Maximize value with weight constraint' },
    { id: 'lcs', name: 'Longest Common Subsequence', complexity: { time: 'O(n·m)', space: 'O(min(n,m))' }, description: 'Find longest matching subsequence' },
    { id: 'edit-distance', name: 'Edit Distance', complexity: { time: 'O(n·m)', space: 'O(min(n,m))' }, description: 'Minimum operations to transform strings' },
    { id: 'lis', name: 'Longest Increasing Subsequence', complexity: { time: 'O(n log n)', space: 'O(n)' }, description: 'Find longest strictly increasing subsequence' },
    { id: 'tsp', name: 'TSP (Bitmask DP)', complexity: { time: 'O(n²·2ⁿ)', space: 'O(n·2ⁿ)' }, description: 'Traveling salesman using state compression' },
    { id: 'grid', name: 'Grid DP', complexity: { time: 'O(n·2^m)', space: 'O(2^m)' }, description: 'State compression for grid problems' },
  ],
  'data-structures': [
    { id: 'union-find', name: 'Union-Find (DSU)', complexity: { time: 'O(α(n))', space: 'O(n)' }, description: 'Disjoint set operations with path compression' },
    { id: 'trie', name: 'Trie', complexity: { time: 'O(m)', space: 'O(Σ·m·n)' }, description: 'Prefix tree for string operations' },
    { id: 'lru', name: 'LRU Cache', complexity: { time: 'O(1)', space: 'O(n)' }, description: 'Least recently used eviction' },
    { id: 'lfu', name: 'LFU Cache', complexity: { time: 'O(1)', space: 'O(n)' }, description: 'Least frequently used eviction' },
    { id: 'fenwick', name: 'Fenwick Tree (BIT)', complexity: { time: 'O(log n)', space: 'O(n)' }, description: 'Prefix sums and point updates' },
    { id: 'segment', name: 'Segment Tree', complexity: { time: 'O(log n)', space: 'O(n)' }, description: 'Range queries and updates' },
    { id: 'heap', name: 'Heap Patterns', complexity: { time: 'O(log n)', space: 'O(n)' }, description: 'Priority queue and related patterns' },
  ],
  strings: [
    { id: 'kmp', name: 'KMP', complexity: { time: 'O(n+m)', space: 'O(m)' }, description: 'Pattern matching with failure function' },
    { id: 'rabin-karp', name: 'Rabin-Karp', complexity: { time: 'O(n+m)', space: 'O(1)' }, description: 'Rolling hash substring search' },
    { id: 'z-algorithm', name: 'Z-Algorithm', complexity: { time: 'O(n)', space: 'O(n)' }, description: 'Build Z-array for prefix matching' },
    { id: 'manacher', name: "Manacher's", complexity: { time: 'O(n)', space: 'O(n)' }, description: 'Longest palindromic substring' },
    { id: 'suffix-array', name: 'Suffix Array', complexity: { time: 'O(n log n)', space: 'O(n)' }, description: 'Sorted suffixes for pattern matching' },
  ],
  patterns: [
    { id: 'sliding-window', name: 'Sliding Window', complexity: { time: 'O(n)', space: 'O(k)' }, description: 'Fixed or variable window over array' },
    { id: 'two-pointers', name: 'Two Pointers', complexity: { time: 'O(n)', space: 'O(1)' }, description: 'Pair pointers moving toward/along array' },
    { id: 'monotonic-stack', name: 'Monotonic Stack', complexity: { time: 'O(n)', space: 'O(n)' }, description: 'Next greater/smaller element problems' },
    { id: 'backtracking', name: 'Backtracking', complexity: { time: 'O(b^d)', space: 'O(d)' }, description: 'Explore all possibilities with pruning' },
    { id: 'meet-middle', name: 'Meet in the Middle', complexity: { time: 'O(2^(n/2))', space: 'O(2^(n/2))' }, description: 'Split problem, combine results' },
    { id: 'binary-answer', name: 'Binary Search on Answer', complexity: { time: 'O(log(range)·n)', space: 'O(1)' }, description: 'Search on monotonic answer space' },
  ],
  math: [
    { id: 'gcd-lcm', name: 'GCD / LCM', complexity: { time: 'O(log n)', space: 'O(1)' }, description: 'Greatest common divisor and least common multiple' },
    { id: 'mod-exp', name: 'Modular Exponentiation', complexity: { time: 'O(log n)', space: 'O(1)' }, description: 'Fast power under modulo' },
    { id: 'sieve', name: 'Sieve of Eratosthenes', complexity: { time: 'O(n log log n)', space: 'O(n)' }, description: 'Find all primes up to n' },
    { id: 'prime-factor', name: 'Prime Factorization', complexity: { time: 'O(√n)', space: 'O(log n)' }, description: 'Decompose number into prime factors' },
    { id: 'euler-totient', name: "Euler's Totient", complexity: { time: 'O(√n)', space: 'O(1)' }, description: 'Count coprimes up to n' },
    { id: 'binomial', name: 'Binomial Coefficients', complexity: { time: 'O(k)', space: 'O(1)' }, description: 'n choose k combinations' },
  ],
};

const categoryNames: Record<string, string> = {
  sorting: 'Sorting Algorithms',
  searching: 'Searching Algorithms',
  graphs: 'Graph Algorithms',
  dp: 'Dynamic Programming',
  'data-structures': 'Data Structures',
  strings: 'String Algorithms',
  patterns: 'Problem Patterns',
  math: 'Math Utilities',
};

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const algorithms = algorithmsByCategory[categoryId || ''] || [];
  const categoryName = categoryNames[categoryId || ''] || 'Unknown Category';

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{categoryName}</span>
      </div>

      <h2>{categoryName}</h2>
      <p className="description">
        {algorithms.length} algorithms in this category
      </p>

      <div className="algorithm-list">
        {algorithms.map((algo) => (
          <Link
            to={`/algorithm/${categoryId}/${algo.id}`}
            key={algo.id}
            className="algorithm-item"
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{algo.name}</h3>
            <p style={{ margin: '0 0 0.5rem 0', color: '#888', fontSize: '0.9rem' }}>
              {algo.description}
            </p>
            <div className="tags">
              <span className="tag">Time: {algo.complexity.time}</span>
              <span className="tag">Space: {algo.complexity.space}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
