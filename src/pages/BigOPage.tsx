import { Link } from 'react-router-dom';

const complexityData = [
  { notation: 'O(1)', name: 'Constant', color: 'complexity-good', examples: 'Array access, Hash lookup' },
  { notation: 'O(log n)', name: 'Logarithmic', color: 'complexity-good', examples: 'Binary search, Balanced BST ops' },
  { notation: 'O(n)', name: 'Linear', color: 'complexity-ok', examples: 'Linear search, Array iteration' },
  { notation: 'O(n log n)', name: 'Linearithmic', color: 'complexity-ok', examples: 'Merge sort, Quick sort (avg)' },
  { notation: 'O(n²)', name: 'Quadratic', color: 'complexity-bad', examples: 'Bubble sort, Nested loops' },
  { notation: 'O(n³)', name: 'Cubic', color: 'complexity-bad', examples: 'Floyd-Warshall, Matrix mult' },
  { notation: 'O(2ⁿ)', name: 'Exponential', color: 'complexity-bad', examples: 'Recursive Fibonacci, Subsets' },
  { notation: 'O(n!)', name: 'Factorial', color: 'complexity-bad', examples: 'Permutations, TSP brute-force' },
];

const sortingComparison = [
  { algorithm: 'Bubble Sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes' },
  { algorithm: 'Selection Sort', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'No' },
  { algorithm: 'Insertion Sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes' },
  { algorithm: 'Merge Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: 'Yes' },
  { algorithm: 'Quick Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: 'No' },
  { algorithm: 'Heap Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: 'No' },
  { algorithm: 'Counting Sort', best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)', stable: 'Yes' },
  { algorithm: 'Radix Sort', best: 'O(d·n)', average: 'O(d·n)', worst: 'O(d·n)', space: 'O(n+k)', stable: 'Yes' },
];

const dataStructureComparison = [
  { ds: 'Array', access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
  { ds: 'Linked List', access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
  { ds: 'Stack', access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
  { ds: 'Queue', access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
  { ds: 'Hash Table', access: 'N/A', search: 'O(1)*', insert: 'O(1)*', delete: 'O(1)*' },
  { ds: 'BST (balanced)', access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
  { ds: 'Heap', access: 'O(1)**', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)' },
];

export default function BigOPage() {
  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Big-O Guide</span>
      </div>

      <h2>Big-O Complexity Guide</h2>
      <p className="description">
        Big-O notation describes the upper bound of an algorithm's time or space complexity
        as the input size grows. Understanding Big-O is essential for writing efficient code.
      </p>

      <h3>Common Complexities</h3>
      <table className="complexity-table">
        <thead>
          <tr>
            <th>Notation</th>
            <th>Name</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          {complexityData.map((item) => (
            <tr key={item.notation}>
              <td className={item.color}><strong>{item.notation}</strong></td>
              <td>{item.name}</td>
              <td>{item.examples}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="info-box" style={{ marginTop: '2rem' }}>
        <h4>Rule of Thumb</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li><strong>O(1) - O(log n)</strong>: Excellent - scales very well</li>
          <li><strong>O(n) - O(n log n)</strong>: Good - acceptable for most problems</li>
          <li><strong>O(n²)</strong>: Fair - may be slow for large inputs (n &gt; 10,000)</li>
          <li><strong>O(2ⁿ) - O(n!)</strong>: Poor - only practical for small inputs (n &lt; 20-30)</li>
        </ul>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Sorting Algorithms Comparison</h3>
      <table className="complexity-table">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Best</th>
            <th>Average</th>
            <th>Worst</th>
            <th>Space</th>
            <th>Stable</th>
          </tr>
        </thead>
        <tbody>
          {sortingComparison.map((item) => (
            <tr key={item.algorithm}>
              <td><strong>{item.algorithm}</strong></td>
              <td className="complexity-good">{item.best}</td>
              <td className="complexity-ok">{item.average}</td>
              <td className="complexity-bad">{item.worst}</td>
              <td>{item.space}</td>
              <td>{item.stable}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '2rem' }}>Data Structure Operations</h3>
      <table className="complexity-table">
        <thead>
          <tr>
            <th>Data Structure</th>
            <th>Access</th>
            <th>Search</th>
            <th>Insert</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {dataStructureComparison.map((item) => (
            <tr key={item.ds}>
              <td><strong>{item.ds}</strong></td>
              <td>{item.access}</td>
              <td>{item.search}</td>
              <td>{item.insert}</td>
              <td>{item.delete}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
        * Average case, O(n) worst case with collisions<br />
        ** O(1) for peek/max, O(n) for arbitrary access
      </p>

      <div style={{ marginTop: '2rem', padding: '2rem', background: '#16213e', borderRadius: '16px' }}>
        <h3 style={{ color: 'white', marginTop: 0 }}>🎯 Interview Tips</h3>
        <ul style={{ color: '#b0b0b0', lineHeight: 1.8 }}>
          <li>Always analyze both <strong>time</strong> and <strong>space</strong> complexity</li>
          <li>Consider <strong>best, average, and worst</strong> cases when relevant</li>
          <li>Know the trade-offs between different approaches</li>
          <li>Practice explaining your complexity analysis verbally</li>
          <li>Don't forget hidden costs (e.g., sorting, string operations)</li>
        </ul>
      </div>
    </div>
  );
}
