import React from 'react';

import { useCubeContext } from '../store/CubeContext'; // Adjust path
import CubeViewer from '../components/cube/CubeViewer';
import CubeControls from '../components/cube/CubeControls'; // May need adjustment
import ModeSelector, { MODES } from '../components/dashboard/ModeSelector';
import PlayModeControls from '../components/dashboard/PlayModeControls';
import InputModeControls from '../components/dashboard/InputModeControls';
import PatternGallery from '../components/patterns/PatternGallery';
import SolutionSteps from '../components/shared/SolutionSteps';
import Instructions from '../components/shared/Instructions';
import StatusMessage from '../components/common/StatusMessage';
import LoadingSpinner from '../components/common/LoadingSpinner'; // Assuming you have this

function Dashboard() {
  const {
    cubeState,
    setMode,
    currentMode,
    isLoading,
    error,
    solutionSteps,
    clearError,
  } = useCubeContext();

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-start lg:space-x-8">
       {/* Left Side / Main Interaction Area */}
      <div className="w-full lg:w-2/3 flex flex-col items-center">
        <ModeSelector currentMode={currentMode} onSelectMode={setMode} />

        {isLoading && <LoadingSpinner />}
        {error && <StatusMessage message={error} type="error" onClose={clearError} />}

        {/* Conditionally render controls based on mode */}
        {currentMode === MODES.PLAY && <PlayModeControls />}
        {currentMode === MODES.INPUT && <InputModeControls />}
        {/* PatternGallery is rendered below or could be here too */}

        <div className="my-6 w-full max-w-md aspect-square relative">
           {/* Aspect ratio container for the cube */}
          <CubeViewer cubeState={cubeState} />
          {/* Add CubeControls potentially positioned absolutely or nearby */}
          {/* <CubeControls /> */}
        </div>

         {/* Instructions could be dynamic based on mode */}
         <Instructions currentMode={currentMode} />

      </div>

       {/* Right Side / Info Area */}
      <div className="w-full lg:w-1/3 mt-8 lg:mt-0">

        {/* Pattern Gallery - Show only in pattern mode */}
        {currentMode === MODES.PATTERNS && <PatternGallery />}

         {/* Solution/Animation Controls - Show if solution exists */}
         {solutionSteps && solutionSteps.length > 0 && (
            <div className="mt-6 p-4 border rounded shadow-md bg-gray-50">
               <h3 className="text-lg font-semibold mb-2 text-center">Solution Steps</h3>
               <SolutionSteps /> {/* This component will use useAnimation hook */}
           </div>
         )}

        {/* Cube Controls might live here as well */}
        <div className="mt-6 p-4 border rounded shadow-md bg-gray-50">
           <h3 className="text-lg font-semibold mb-2 text-center">Cube Controls</h3>
           <CubeControls /> {/* Pass necessary props/callbacks */}
           <p className="text-xs text-gray-500 mt-2 text-center">
             (Implement controls: Rotate cube view, Rotate faces)
           </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;