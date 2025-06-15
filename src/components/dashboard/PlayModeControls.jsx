import React from 'react';
import Button from '../common/Button';
import { useCubeContext } from '../../store/CubeContext'; // Adjust path if needed

function PlayModeControls() {
  const { scrambleCube, solveCube, isLoading, currentMode } = useCubeContext();

  if (currentMode !== 'play') return null; // Only show if in play mode

  return (
    <div className="flex space-x-2 justify-center mt-4">
      <Button onClick={scrambleCube} disabled={isLoading} variant="secondary">
        Scramble
      </Button>
      <Button onClick={solveCube} disabled={isLoading} variant="success">
        {isLoading ? 'Solving...' : 'Solve'}
      </Button>
    </div>
  );
}

export default PlayModeControls;