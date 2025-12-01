import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    icon: '📊',
    description: 'Compare elements and rearrange in order',
    count: 8,
  },
  {
    id: 'searching',
    name: 'Searching Algorithms',
    icon: '🔍',
    description: 'Find elements or patterns in data structures',
    count: 6,
  },
  {
    id: 'graphs',
    name: 'Graph Algorithms',
    icon: '🕸️',
    description: 'Traverse, search, and optimize graph structures',
    count: 8,
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    icon: '🧩',
    description: 'Optimal substructure and overlapping subproblems',
    count: 8,
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    icon: '🏗️',
    description: 'Efficient data organization and manipulation',
    count: 7,
  },
  {
    id: 'strings',
    name: 'String Algorithms',
    icon: '📝',
    description: 'Pattern matching and string manipulation',
    count: 5,
  },
  {
    id: 'patterns',
    name: 'Problem Patterns',
    icon: '🎯',
    description: 'Common algorithmic patterns for interviews',
    count: 6,
  },
  {
    id: 'math',
    name: 'Math Utilities',
    icon: '🔢',
    description: 'Number theory and mathematical algorithms',
    count: 15,
  },
];

export default function Home() {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2>Data Structures & Algorithms Workbook</h2>
        <p className="description" style={{ maxWidth: '700px', margin: '0 auto' }}>
          Interactive TypeScript implementations of 50+ algorithms and data structures.
          Visualize, learn, and practice for technical interviews.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Link to="/visualizer">
            <button>🎬 Try Visualizer</button>
          </Link>
          <Link to="/big-o">
            <button style={{ background: 'transparent', border: '1px solid #4cc9f0', color: '#4cc9f0' }}>
              📈 Big-O Guide
            </button>
          </Link>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Algorithm Categories</h2>
      <div className="categories">
        {categories.map((category) => (
          <Link
            to={`/category/${category.id}`}
            key={category.id}
            className="category-card"
          >
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <span className="category-count">{category.count} algorithms</span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', background: '#16213e', borderRadius: '16px' }}>
        <h3 style={{ color: 'white' }}>🚀 Static Web App Ready</h3>
        <p className="description">
          This application runs 100% in the browser and can be deployed as a static site
          to Azure Static Web Apps, GitHub Pages, Netlify, or any static hosting provider.
        </p>
      </div>
    </div>
  );
}
