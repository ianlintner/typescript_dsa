import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import AlgorithmPage from './pages/AlgorithmPage';
import BigOPage from './pages/BigOPage';
import VisualizerPage from './pages/VisualizerPage';

// Get base path from Vite's import.meta.env.BASE_URL
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function Header() {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>TypeScript DSA</h1>
        </Link>
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/visualizer" className={`nav-link ${location.pathname === '/visualizer' ? 'active' : ''}`}>
            Visualizer
          </Link>
          <Link to="/big-o" className={`nav-link ${location.pathname === '/big-o' ? 'active' : ''}`}>
            Big-O Guide
          </Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/algorithm/:categoryId/:algorithmId" element={<AlgorithmPage />} />
          <Route path="/big-o" element={<BigOPage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
