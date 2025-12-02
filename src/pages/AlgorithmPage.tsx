import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { algorithmInfo } from './algorithmData';

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
              {info.whenToUse?.map((use, index) => (
                <li key={index}>{use}</li>
              ))}
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
