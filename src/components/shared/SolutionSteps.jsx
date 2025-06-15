import React, { useState } from 'react';
import useAnimation from '../../hooks/useAnimation'; // The hook managing animation state
import { useCubeContext } from '../../store/CubeContext'; // To get solution steps array
import Button from '../common/Button';
// Import icons if desired
// import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo, FaFastForward, FaStop } from 'react-icons/fa';

function SolutionSteps() {
  const { solutionSteps } = useCubeContext();
  const {
    isPlaying,
    currentStepIndex,
    animationSpeed,
    play,
    pause,
    resetAnimation, // Needs proper implementation in useAnimation (state restoration)
    nextStep,
    prevStep, // Needs proper implementation in useAnimation (inverse moves)
    goToStep, // Needs proper implementation in useAnimation
    changeSpeed,
    totalSteps,
  } = useAnimation();

  const [speedInput, setSpeedInput] = useState(animationSpeed); // Local state for slider/input

  if (!solutionSteps || solutionSteps.length === 0) {
    return <p className="text-center text-gray-500 text-sm my-4">No solution steps available.</p>;
  }

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value, 10);
    setSpeedInput(newSpeed);
    changeSpeed(newSpeed);
  };

  const handleSliderChange = (e) => {
       const stepIndex = parseInt(e.target.value, 10);
       goToStep(stepIndex); // Go to the selected step index
  };

  return (
    <div className="space-y-4">
       {/* Display Current Step / Total Steps */}
       <p className="text-center font-medium text-gray-700">
         Step: {currentStepIndex + 1} / {totalSteps}
       </p>
       <p className="text-center text-lg font-mono bg-gray-100 p-2 rounded">
          {currentStepIndex >= 0 && currentStepIndex < totalSteps
            ? solutionSteps[currentStepIndex]
            : (currentStepIndex === -1 ? 'Start' : 'End')}
       </p>

      {/* Progress Slider */}
       <div className="px-2">
        <input
            type="range"
            min="-1" // -1 represents the state before step 0
            max={totalSteps - 1}
            value={currentStepIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={totalSteps === 0} // Disable if no steps
            aria-label="Solution step slider"
        />
         <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
             <span>Start</span>
             <span>End</span>
         </div>
       </div>


      {/* Playback Controls */}
      <div className="flex justify-center items-center space-x-2">
        <Button onClick={resetAnimation} disabled={currentStepIndex < 0} variant="secondary" title="Reset Animation">
           {/* <FaRedo /> */} Reset
        </Button>
        <Button onClick={prevStep} disabled={currentStepIndex < 0} variant="secondary" title="Previous Step">
           {/* <FaStepBackward /> */} Prev
        </Button>

        {isPlaying ? (
          <Button onClick={pause} variant="warning" title="Pause Animation">
             {/* <FaPause /> */} Pause
          </Button>
        ) : (
          <Button onClick={play} disabled={currentStepIndex >= totalSteps - 1} variant="success" title="Play Animation">
             {/* <FaPlay /> */} Play
          </Button>
        )}

        <Button onClick={nextStep} disabled={currentStepIndex >= totalSteps - 1} variant="secondary" title="Next Step">
           {/* <FaStepForward /> */} Next
        </Button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center justify-center space-x-2 mt-2">
         <label htmlFor="speedControl" className="text-sm text-gray-600">Speed:</label>
          {/* <FaFastForward className="text-gray-500"/> */}
         <input
            id="speedControl"
            type="range"
            min="50" // ms per step (faster)
            max="2000" // ms per step (slower)
            step="50"
            value={speedInput}
            onChange={handleSpeedChange}
            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Animation speed control"
          />
         <span className="text-xs text-gray-500 w-12 text-right">{speedInput} ms</span>
       </div>

       {/* Optional: Display full sequence (can be long) */}
        {/* <div className="mt-4 max-h-32 overflow-y-auto p-2 border rounded bg-gray-50">
            <p className="text-xs font-mono break-all">{solutionSteps.join(' ')}</p>
        </div> */}

    </div>
  );
}

export default SolutionSteps;