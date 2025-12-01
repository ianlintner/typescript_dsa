import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bubbleSortWithSteps, SortStep } from '../algorithms/sorting/bubbleSort';
import { selectionSortWithSteps } from '../algorithms/sorting/selectionSort';
import { insertionSortWithSteps } from '../algorithms/sorting/insertionSort';
import { mergeSortWithSteps } from '../algorithms/sorting/mergeSort';
import { quickSortWithSteps } from '../algorithms/sorting/quickSort';
import { heapSortWithSteps } from '../algorithms/sorting/heapSort';

type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';

const algorithmOptions: { value: SortAlgorithm; label: string }[] = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'heap', label: 'Heap Sort' },
];

function generateRandomArray(size: number, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
}

function getSteps(algorithm: SortAlgorithm, arr: number[]): SortStep[] {
  switch (algorithm) {
    case 'bubble': return bubbleSortWithSteps(arr);
    case 'selection': return selectionSortWithSteps(arr);
    case 'insertion': return insertionSortWithSteps(arr);
    case 'merge': return mergeSortWithSteps(arr);
    case 'quick': return quickSortWithSteps(arr);
    case 'heap': return heapSortWithSteps(arr);
    default: return [];
  }
}

export default function VisualizerPage() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState(15);
  const [speed, setSpeed] = useState(200);
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputArray, setInputArray] = useState('');
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize array
  useEffect(() => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [arraySize]);

  // Generate steps when algorithm or array changes
  const generateSteps = useCallback(() => {
    if (array.length === 0) return;
    const newSteps = getSteps(algorithm, array);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithm, array]);

  // Play animation
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleNewArray = () => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleCustomArray = () => {
    try {
      const parsed = inputArray.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
      if (parsed.length > 0) {
        setArray(parsed);
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
      }
    } catch {
      // Invalid input
    }
  };

  const handlePlay = () => {
    if (steps.length === 0) {
      generateSteps();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (steps.length === 0) generateSteps();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const displayArray = currentStepData?.array || array;
  const maxValue = Math.max(...displayArray, 1);

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Sorting Visualizer</span>
      </div>

      <h2>Sorting Algorithm Visualizer</h2>
      <p className="description">
        Watch sorting algorithms in action! Select an algorithm, generate an array, and step through the sorting process.
      </p>

      <div className="visualization">
        <div className="visualization-controls">
          <select
            value={algorithm}
            onChange={(e) => {
              setAlgorithm(e.target.value as SortAlgorithm);
              setSteps([]);
              setCurrentStep(0);
              setIsPlaying(false);
            }}
          >
            {algorithmOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <div className="speed-control">
            <label>Speed:</label>
            <input
              type="range"
              min="50"
              max="500"
              value={550 - speed}
              onChange={(e) => setSpeed(550 - parseInt(e.target.value, 10))}
            />
          </div>

          <div className="speed-control">
            <label>Size:</label>
            <input
              type="range"
              min="5"
              max="30"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value, 10))}
            />
            <span>{arraySize}</span>
          </div>

          <button onClick={handleNewArray}>🔀 Random</button>
        </div>

        <div className="visualization-controls" style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Custom array: 5, 2, 8, 1, 9"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            style={{ width: '200px' }}
          />
          <button onClick={handleCustomArray}>Use Custom</button>
        </div>

        <div className="visualization-array">
          {displayArray.map((value, index) => {
            const isComparing = currentStepData?.comparing?.includes(index);
            const isSwapped = currentStepData?.swapped?.includes(index);
            const isSorted = currentStepData?.sorted?.includes(index);
            
            let className = 'array-bar';
            if (isSorted) className += ' sorted';
            else if (isSwapped) className += ' swapped';
            else if (isComparing) className += ' comparing';

            return (
              <div
                key={index}
                className={className}
                style={{ height: `${(value / maxValue) * 200 + 20}px` }}
              >
                {displayArray.length <= 20 && value}
              </div>
            );
          })}
        </div>

        <div className="visualization-controls" style={{ marginTop: '1rem' }}>
          <button onClick={handleStepBack} disabled={currentStep === 0}>⏮️</button>
          {isPlaying ? (
            <button onClick={handlePause}>⏸️ Pause</button>
          ) : (
            <button onClick={handlePlay}>▶️ Play</button>
          )}
          <button onClick={handleStepForward} disabled={steps.length === 0 || currentStep >= steps.length - 1}>⏭️</button>
          <button onClick={handleReset}>🔄 Reset</button>

          {steps.length > 0 && (
            <span className="step-counter">
              Step {currentStep + 1} / {steps.length}
            </span>
          )}
        </div>

        {currentStepData?.description && (
          <div className="info-box" style={{ marginTop: '1rem' }}>
            <p style={{ margin: 0 }}>{currentStepData.description}</p>
          </div>
        )}
      </div>

      <div className="grid-2" style={{ marginTop: '2rem' }}>
        <div className="info-box">
          <h4>Algorithm: {algorithmOptions.find(a => a.value === algorithm)?.label}</h4>
          <p style={{ margin: '0.5rem 0' }}>
            {algorithm === 'bubble' && 'Compares adjacent elements and swaps if out of order.'}
            {algorithm === 'selection' && 'Selects the minimum element and places it at the front.'}
            {algorithm === 'insertion' && 'Builds sorted portion by inserting elements one by one.'}
            {algorithm === 'merge' && 'Divides array in half, sorts each half, then merges.'}
            {algorithm === 'quick' && 'Partitions around a pivot, recursively sorts partitions.'}
            {algorithm === 'heap' && 'Builds a max heap, extracts maximum repeatedly.'}
          </p>
        </div>

        <div className="info-box">
          <h4>Legend</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: 'linear-gradient(180deg, #4cc9f0, #4361ee)', borderRadius: '4px' }}></div>
              <span>Unsorted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: 'linear-gradient(180deg, #f72585, #b5179e)', borderRadius: '4px' }}></div>
              <span>Comparing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: 'linear-gradient(180deg, #ff9f1c, #ffbf69)', borderRadius: '4px' }}></div>
              <span>Swapping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: 'linear-gradient(180deg, #06d6a0, #1b9aaa)', borderRadius: '4px' }}></div>
              <span>Sorted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
