import React from 'react';
import { useCubeContext } from '../../store/CubeContext';
import { patterns } from '../../config/patterns'; // Adjust path
import PatternItem from './PatternItem';
import Button from '../common/Button';

function PatternGallery() {
  const { loadPattern, solveCube, currentMode, isLoading } = useCubeContext();

  if (currentMode !== 'patterns') return null; // Only show if in patterns mode

  return (
    <div className="mt-4 px-4">
      <h3 className="text-lg font-semibold text-center mb-4">Click To Reveal The Patterns In The Gallery:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {patterns.map((pattern) => (
          <PatternItem
            key={pattern.id}
            pattern={pattern}
            onApply={() => loadPattern(pattern.state)} // Pass the target state string
            disabled={isLoading}
          />
        ))}
      </div>
       <div className="flex justify-center mt-4">
         {/* Button to solve the currently displayed pattern */}
         <Button onClick={solveCube} disabled={isLoading} variant="success">
            {isLoading ? 'Solving...' : 'Solve Current Pattern'}
         </Button>
       </div>
    </div>
  );
}

export default PatternGallery;