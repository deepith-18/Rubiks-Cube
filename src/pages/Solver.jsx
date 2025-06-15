// import { useState, useEffect } from 'react'; // Removed unused useRef
// import { motion } from 'framer-motion';
// import React from 'react';
// import useCube from '../hooks/useCube';
// import CubeControls from '../components/CubeControls';
// import ColorPicker from '../components/ColorPicker';
// import SolutionSteps from '../components/SolutionSteps';
// import LoadingSpinner from '../components/LoadingSpinner';
// import StatusMessage from '../components/StatusMessage';
// import { solveCube } from '../api/solverAPI';

// const Solver = () => {
//     // --- Hook Call ---
//     const {
//         containerRef,
//         // cubeState,
//         resetCube,
//         applyMove,
//         isSolved,
//         scrambleCube, // Keep, used by button
//         getStateString
//     } = useCube();

//     // --- UI & Solver State ---
//     const [selectedColor, setSelectedColor] = useState('W');
//     const [editingMode, setEditingMode] = useState(false);
//     // eslint-disable-next-line no-unused-vars
//     const [editingFace, setEditingFace] = useState(null); // Keep for UI logic, disable warning
//     const [solutionSteps, setSolutionSteps] = useState([]);
//     const [currentStep, setCurrentStep] = useState(-1);
//     const [isAnimating, setIsAnimating] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     console.log('[Solver] Rendering... Container Ref available:', !!containerRef);

//     // --- Effects ---
//     useEffect(() => {
//         let timer;
//         if (errorMessage) { timer = setTimeout(() => setErrorMessage(''), 5000); }
//         if (successMessage) { timer = setTimeout(() => setSuccessMessage(''), 5000); }
//         return () => clearTimeout(timer);
//     }, [errorMessage, successMessage]);

//     // --- Actions ---
//      const handleSolve = async () => {
//         if (isSolved) { setErrorMessage("Cube is already solved!"); return; }
//         setIsLoading(true);
//         setErrorMessage(''); setSuccessMessage(''); setSolutionSteps([]); setCurrentStep(-1); setEditingMode(false);
//         try {
//             const stateString = getStateString();
//             console.log('[Solver] Sending state string to solver:', stateString);
//             const solution = await solveCube(stateString);
//             if (solution && solution.moves && Array.isArray(solution.moves) && solution.moves.length > 0) {
//                 setSolutionSteps(solution.moves);
//                 setSuccessMessage(`Solution found (${solution.moves.length} moves)! Click "Play" or step through.`);
//             } else {
//                 setErrorMessage( (solution && solution.error) ? `Solver Error: ${solution.error}. Check cube state.` : 'Could not find a solution. Ensure the cube configuration is valid and solvable.');
//             }
//         } catch (error) {
//             setErrorMessage(`Error connecting to solver API: ${error.message || 'Please try again.'}`);
//             console.error('[Solver] Error solving cube:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const playAnimation = async () => {
//         // Simplified cancellation check
//         if (solutionSteps.length === 0 || isAnimating) return;
//         let currentAnimationId = Math.random(); // ID for this specific play request
//         setIsAnimating(currentAnimationId); // Store the ID
//         setErrorMessage(''); setCurrentStep(-1);

//         for (let i = 0; i < solutionSteps.length; i++) {
//              if (isAnimating !== currentAnimationId) { // Check if another action cancelled this run
//                   console.log('[Solver] Play animation cancelled by new action.');
//                   break;
//              }
//             setCurrentStep(i);
//             applyMove(solutionSteps[i]);
//             await new Promise(resolve => setTimeout(resolve, 500));
//         }

//         // Only update state if this specific animation run completed
//         if (isAnimating === currentAnimationId) {
//              setSuccessMessage('Cube solved successfully!');
//              setIsAnimating(false);
//              setCurrentStep(-1);
//         }
//     };


//     const applySingleSolutionMove = (moveIndex) => {
//         if (isAnimating || moveIndex < 0 || moveIndex >= solutionSteps.length) return;
//         setCurrentStep(moveIndex);
//         applyMove(solutionSteps[moveIndex]);
//     };

//      const handleReset = () => {
//         setIsAnimating(false); // Stop any ongoing animation
//         resetCube();
//         setSolutionSteps([]); setCurrentStep(-1); setErrorMessage(''); setSuccessMessage('Cube reset to solved state.'); setEditingMode(false);
//     };

//     const handleScramble = () => {
//          if (isAnimating) return;
//          setIsAnimating(false); // Stop any potential animation just in case
//          const scrambleSequence = scrambleCube();
//          setSolutionSteps([]); setCurrentStep(-1); setErrorMessage(''); setSuccessMessage(`Applied scramble: ${scrambleSequence}`); setEditingMode(false);
//     };


//     const toggleEditingMode = () => {
//         if (isAnimating) return;
//         setIsAnimating(false); // Ensure animation stops
//         setEditingMode(!editingMode);
//         setEditingFace(null);
//         setSuccessMessage(!editingMode ? "Entering Edit Mode: Select a color, then click stickers (Feature Pending)." : "Exited Edit Mode.");
//     };

//     // Placeholder - Functionality requires hook changes
//     // eslint-disable-next-line no-unused-vars
//     const handleStickerClick = (face, index) => {
//         if (!editingMode || isAnimating) return;
//         console.warn(`Sticker clicked (Edit Mode): Face=${face}, Index=${index}, Color=${selectedColor}. Functionality requires hook modification.`);
//         setErrorMessage("Editing stickers is not yet implemented in the core logic.");
//     };


//     // --- Render ---
//     return (
//         <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-150px)] min-h-[600px]">

//             {/* === 3D Cube Viewer Area === */}
//             <motion.div
//                 className="flex-1 lg:min-w-[400px] min-h-[300px] md:min-h-[400px] aspect-square panel relative bg-gray-200 rounded-lg shadow-lg overflow-hidden border-2 border-transparent" // Removed debug border
//                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
//             >
//                 {/* Div for Canvas Injection */}
//                 <div ref={containerRef} className="w-full h-full bg-transparent"> {/* Removed debug bg */}
//                     {/* Canvas injected here by useCube */}
//                 </div>
//                  {/* Overlays */}
//                  {isLoading && ( <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10"><LoadingSpinner /></div> )}
//                  {(errorMessage || successMessage) && ( <div className="absolute top-4 left-4 right-4 z-20"><StatusMessage error={errorMessage} success={successMessage} onDismiss={() => { setErrorMessage(''); setSuccessMessage(''); }}/></div> )}
//             </motion.div>

//             {/* === Controls Area === */}
//             <motion.div
//                 className="w-full lg:w-[400px] lg:max-w-sm flex flex-col gap-4 overflow-y-auto border-2 border-transparent" // Removed debug border
//                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
//             >
//                  {/* --- Main Controls Panel --- */}
//                  <div className="panel bg-white p-4 rounded-lg shadow">
//                     <h2 className="text-xl font-semibold mb-4 border-b pb-2">Controls</h2>
//                      <div className="flex flex-col gap-4">
//                          <div className="flex gap-2 flex-wrap">
//                             <button className={`btn flex-grow ${editingMode ? 'btn-warning' : 'btn-outline'}`} onClick={toggleEditingMode} disabled={isAnimating} title={editingMode ? 'Exit color editing mode' : 'Enter mode to manually set sticker colors (Feature Pending)'} > {editingMode ? 'Exit Edit Mode' : 'Edit Stickers'} </button>
//                             <button className="btn btn-secondary" onClick={handleReset} disabled={isAnimating} title="Reset cube to solved state" > Reset </button>
//                             <button className="btn btn-accent btn-outline" onClick={handleScramble} disabled={isAnimating} title="Apply a random scramble" > Scramble </button>
//                          </div>
//                          {editingMode && ( <> <div className="mt-2 border-t pt-3"> <h3 className="text-md font-semibold mb-2 text-gray-700">1. Select Color to Apply:</h3> <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} /> <p className="text-xs text-gray-500 mt-1">Click a sticker on the cube to change its color (Feature Pending).</p> </div> </> )}
//                          {!editingMode && ( <div className="mt-2 border-t pt-3"> <h3 className="text-md font-semibold mb-2 text-gray-700">Rotate Faces:</h3> <CubeControls performMove={applyMove} disabled={isAnimating} /> <p className="text-xs text-gray-500 mt-1">Use buttons to turn faces or use mouse to rotate view.</p> </div> )}
//                          <div className="flex gap-2 mt-4 border-t pt-4"> <button className="btn btn-primary flex-grow" onClick={handleSolve} disabled={isAnimating || isLoading || isSolved} title={isSolved ? "Cube is already solved" : "Attempt to find solution steps"} > {isLoading ? 'Solving...' : 'Solve Cube'} </button> {solutionSteps.length > 0 && ( <button className="btn btn-success btn-outline" onClick={playAnimation} disabled={isAnimating || isLoading} title="Animate the solution steps" > {isAnimating ? 'Playing...' : 'Play Solution'} </button> )} </div>
//                     </div>
//                  </div>
//                  {/* --- Solution Steps Panel --- */}
//                  {solutionSteps.length > 0 && !editingMode && ( <div className="panel bg-white p-4 rounded-lg shadow"> <h2 className="text-xl font-semibold mb-4 border-b pb-2">Solution Steps</h2> <SolutionSteps steps={solutionSteps} currentStep={currentStep} applyMove={applySingleSolutionMove} disabled={isAnimating || isLoading} /> </div> )}
//             </motion.div>
//         </div>
//     );
// };

// export default Solver;



// // src/pages/Solver.jsx
// import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
// // import React from 'react'; // Already imported via useState etc.
// import useCube from '../hooks/useCube';
// // import CubeControls from '../components/CubeControls'; // We will inline simple button controls or make a new one
// import SolutionSteps from '../components/SolutionSteps';
// import LoadingSpinner from '../components/LoadingSpinner';
// import StatusMessage from '../components/StatusMessage';
// import { solveCube as callSolverAPI } from '../api/solverAPI'; // Renamed to avoid conflict

// // --- Utility functions for UI that were in RubiksCubeSolver.jsx ---
// const generateRandomStateForScrambleButton = () => { // Only for displaying in UI if needed, actual scramble uses hook
//   const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
//   const modifiers = ["", "'", "2"];
//   const moves = [];
//   const numMoves = Math.floor(Math.random() * 10) + 10; // Scramble length for button
//   for (let i = 0; i < numMoves; i++) {
//     const face = faces[Math.floor(Math.random() * faces.length)];
//     const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
//     moves.push(face + modifier);
//   }
//   return moves.join(' ');
// };


// const Solver = () => {
//     const [uiIsLoading, setUiIsLoading] = useState(false); // For UI feedback like spinners
//     const [isAnimatingSolution, setIsAnimatingSolution] = useState(false); // Specifically for solution playback

//     // Callback for useCube to update our UI loading state
//     const handleCubeLoadingState = useCallback((isLoading, isChecking = false) => {
//         if (isChecking) return uiIsLoading; // If just checking, return current state
//         setUiIsLoading(isLoading);
//         return undefined;
//     }, [uiIsLoading]);

//     const {
//         containerRef,
//         // cubeState, // Not directly used in UI for now, but available
//         isSolved,
//         resetCube,
//         applyMove, // This is the key function from useCube for any move
//         scrambleCube,
//         getStateString,
//         toggleCubeColorMode, // From useCube
//         isDraggingFace // From useCube
//     } = useCube(handleCubeLoadingState); // Pass the callback

//     const [colorModeDisplay, setColorModeDisplay] = useState('standard'); // For the button text
//     const [showInstructions, setShowInstructions] = useState(false);

//     const [scrambleSequenceDisplay, setScrambleSequenceDisplay] = useState(''); // For the "Scramble Applied" text box
//     const [solutionSteps, setSolutionSteps] = useState([]);
//     const [currentSolutionStepIndex, setCurrentSolutionStepIndex] = useState(-1);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     // console.log('[Solver] Rendering. UI Loading:', uiIsLoading, 'Solution Animating:', isAnimatingSolution, 'Dragging:', isDraggingFace);

//     useEffect(() => {
//         let timer;
//         if (errorMessage) { timer = setTimeout(() => setErrorMessage(''), 5000); }
//         if (successMessage) { timer = setTimeout(() => setSuccessMessage(''), 5000); }
//         return () => clearTimeout(timer);
//     }, [errorMessage, successMessage]);

//     const handleSolveCube = async () => {
//         if (isSolved) { setErrorMessage("Cube is already solved!"); return; }
//         setUiIsLoading(true);
//         setErrorMessage(''); setSuccessMessage(''); setSolutionSteps([]); setCurrentSolutionStepIndex(-1);
//         try {
//             const stateString = getStateString();
//             // console.log('[Solver] Sending state string to solver API:', stateString);
//             const solution = await callSolverAPI(stateString); // Use renamed import
//             if (solution && solution.moves && Array.isArray(solution.moves) && solution.moves.length > 0) {
//                 setSolutionSteps(solution.moves);
//                 setSuccessMessage(`Solution found (${solution.moves.length} moves)!`);
//             } else {
//                 setErrorMessage( (solution && solution.error) ? `Solver Error: ${solution.error}. Check cube state.` : 'Could not find a solution. Ensure cube is valid.');
//             }
//         } catch (error) {
//             setErrorMessage(`Error connecting to solver API: ${error.message || 'Please try again.'}`);
//             console.error('[Solver] Error solving cube via API:', error);
//         } finally {
//             setUiIsLoading(false);
//         }
//     };

//     const playSolutionAnimation = async () => {
//         if (solutionSteps.length === 0 || isAnimatingSolution || uiIsLoading) return;
        
//         setIsAnimatingSolution(true);
//         setUiIsLoading(true); // General loading state for cube operations
//         setErrorMessage(''); 
        
//         for (let i = 0; i < solutionSteps.length; i++) {
//             // A simple check if component unmounted or animation was cancelled
//             if (!containerRef.current || !isAnimatingSolution) { 
//                 // console.log('[Solver] Play animation cancelled or component unmounted.');
//                 break; 
//             }
//             setCurrentSolutionStepIndex(i);
//             await applyMove(solutionSteps[i]); // applyMove from useCube now handles visual + logical
//             await new Promise(resolve => setTimeout(resolve, 300)); // Animation step delay
//         }
        
//         // Only update state if this specific animation run completed and wasn't cancelled
//         if (containerRef.current && isAnimatingSolution) { // Check if still mounted and this animation is the active one
//              setSuccessMessage('Cube solved successfully!');
//              setIsAnimatingSolution(false);
//              setCurrentSolutionStepIndex(-1); // Reset step index
//         }
//         setUiIsLoading(false);
//     };
    
//     // Stop solution animation if user interacts or resets
//     const stopSolutionAnimation = () => {
//         if (isAnimatingSolution) {
//             setIsAnimatingSolution(false);
//             // console.log('[Solver] Solution animation stopped.');
//         }
//     };

//     const applySingleSolutionStep = async (moveIndex) => {
//         if (isAnimatingSolution || uiIsLoading || moveIndex < 0 || moveIndex >= solutionSteps.length) return;
//         stopSolutionAnimation(); // Stop full animation if user steps manually
//         setUiIsLoading(true);
//         setCurrentSolutionStepIndex(moveIndex);
//         await applyMove(solutionSteps[moveIndex]);
//         setUiIsLoading(false);
//     };

//      const handleResetCube = () => {
//         stopSolutionAnimation();
//         resetCube();
//         setSolutionSteps([]); setCurrentSolutionStepIndex(-1); setErrorMessage(''); setSuccessMessage('Cube reset.');
//         setScrambleSequenceDisplay('');
//     };

//     const handleScrambleCube = async () => {
//          if (uiIsLoading || isAnimatingSolution) return;
//          stopSolutionAnimation();
//          setUiIsLoading(true);
//          const appliedScramble = await scrambleCube(15); // Call scramble from useCube
//          setScrambleSequenceDisplay(appliedScramble);
//          setSolutionSteps([]); setCurrentSolutionStepIndex(-1); setErrorMessage(''); 
//          setSuccessMessage(`Applied scramble: ${appliedScramble.substring(0, 30)}...`);
//          setUiIsLoading(false);
//     };

//     const handleToggleColorMode = () => {
//         if (uiIsLoading || isAnimatingSolution) return;
//         stopSolutionAnimation();
//         toggleCubeColorMode(); // From useCube
//         setColorModeDisplay(prev => prev === 'standard' ? 'Colorblind Mode (TODO)' : 'Standard Colors');
//         // Reset sequences as color mode change might reset the visual cube in useCube
//         setScrambleSequenceDisplay(''); 
//         setSolutionSteps([]);
//         setCurrentSolutionStepIndex(-1);
//     };
    
//     // --- Face Rotation Buttons (Simplified from old CubeControls) ---
//     const faceButtons = ['U', 'D', 'L', 'R', 'F', 'B'];
//     const handleFaceButtonClick = async (face, isPrime = false) => {
//         if (uiIsLoading || isAnimatingSolution || isDraggingFace) return;
//         stopSolutionAnimation(); // Stop solution if user interacts
//         setUiIsLoading(true);
//         await applyMove(face + (isPrime ? "'" : ""));
//         setUiIsLoading(false);
//         // When user manually turns, it invalidates current solution/scramble display
//         setSolutionSteps([]);
//         setCurrentSolutionStepIndex(-1);
//         // setScrambleSequenceDisplay(prev => prev + " " + face + (isPrime ? "'" : "")); // Optionally append to a manual sequence
//     };


//     return (
//         <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
//             {/* Header */}
//             <header className="bg-blue-600 text-white p-4 shadow-md">
//                 <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-2">
//                     <h1 className="text-xl sm:text-2xl font-bold">Interactive Rubik's Cube</h1>
//                     <div className="flex items-center space-x-2 sm:space-x-4">
//                         <button
//                             onClick={() => setShowInstructions(!showInstructions)}
//                             className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         >
//                             {showInstructions ? 'Hide' : 'Show'} Instructions
//                         </button>
//                         <button
//                             onClick={handleToggleColorMode}
//                             disabled={uiIsLoading || isAnimatingSolution || isDraggingFace}
//                             className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         >
//                             {colorModeDisplay === 'standard' ? 'Colorblind Mode' : 'Standard Colors'}
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* Instructions Panel */}
//             {showInstructions && (
//                 <div className="bg-white p-4 shadow-md border-b border-gray-200">
//                     <div className="container mx-auto">
//                         <h2 className="text-lg font-semibold mb-2 text-gray-700">How to Use:</h2>
//                         <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-gray-600">
//                             <li>Click and drag cube background: Rotate view.</li>
//                             <li>Click and drag on a cube sticker: Rotate that face/slice.</li>
//                             <li>Use mouse wheel: Zoom in/out.</li>
//                             <li>Buttons: Control cube state, solve, and view solution.</li>
//                         </ul>
//                     </div>
//                 </div>
//             )}

//             {/* Main Content Area */}
//             <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
//                 {/* 3D Cube Viewer Area (Canvas injected by useCube) */}
//                 <div className="flex-grow h-1/2 md:h-auto md:w-2/3 relative bg-gray-300"> {/* Changed bg for canvas visibility */}
//                     <div ref={containerRef} className="w-full h-full">
//                         {/* Canvas injected here by useCube */}
//                     </div>
//                     {(uiIsLoading || isAnimatingSolution) && (
//                         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
//                             <div className="bg-white p-5 sm:p-6 rounded-lg shadow-xl flex items-center space-x-3 sm:space-x-4">
//                                 <div className={`animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 ${isAnimatingSolution ? 'border-green-500' : 'border-blue-500'}`}></div>
//                                 <p className="font-medium text-md sm:text-lg text-gray-700">
//                                     {isAnimatingSolution ? 'Playing Solution...' : (uiIsLoading ? 'Processing...' : '')}
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                      {(errorMessage || successMessage) && !uiIsLoading && ( <div className="absolute top-4 left-1/2 -translate-x-1/2 w-auto max-w-[90%] z-20"><StatusMessage error={errorMessage} success={successMessage} onDismiss={() => { setErrorMessage(''); setSuccessMessage(''); }}/></div> )}
//                 </div>

//                 {/* Controls Panel */}
//                 <div className="bg-white w-full md:w-1/3 p-4 shadow-lg md:shadow-inner overflow-y-auto border-t md:border-t-0 md:border-l border-gray-300">
//                     <div className="space-y-5">
//                         {/* Cube Actions */}
//                         <div>
//                             <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">Cube Actions</h2>
//                             <div className="grid grid-cols-2 gap-3 mb-3">
//                                 <button onClick={handleScrambleCube} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-warning">Scramble</button>
//                                 <button onClick={handleResetCube} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-neutral">Reset</button>
//                             </div>
//                              <button onClick={handleSolveCube} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace || isSolved || solutionSteps.length > 0} className="btn btn-primary w-full">
//                                 {isSolved ? 'Cube Solved' : (solutionSteps.length > 0 ? 'Solution Ready' : 'Solve Cube API')}
//                             </button>
//                         </div>

//                         {/* Manual Face Rotations */}
//                         <div>
//                             <h3 className="text-md font-semibold mb-2 text-gray-700">Rotate Faces (Buttons):</h3>
//                             <div className="grid grid-cols-3 gap-2">
//                                 {faceButtons.map(face => (
//                                     <div key={face} className="flex flex-col gap-1">
//                                         <button onClick={() => handleFaceButtonClick(face, false)} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-sm btn-outline">{face}</button>
//                                         <button onClick={() => handleFaceButtonClick(face, true)} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-sm btn-outline">{face}'</button>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
                        
//                         {/* Scramble Display */}
//                         <div>
//                             <h2 className="text-base sm:text-lg font-semibold mb-1.5 text-gray-700">Scramble Applied</h2>
//                             <div className="bg-gray-100 p-3 rounded-md min-h-[60px] text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
//                                 {scrambleSequenceDisplay || <span className="text-gray-400">N/A</span>}
//                             </div>
//                         </div>

//                         {/* Solution Steps Panel */}
//                         {solutionSteps.length > 0 && (
//                             <div className="border-t border-gray-200 pt-5 space-y-3">
//                                 <h2 className="text-base sm:text-lg font-semibold text-gray-700">Solution Steps ({solutionSteps.length})</h2>
//                                 <div className="bg-gray-100 p-3 rounded-md max-h-32 overflow-y-auto text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
//                                     {solutionSteps.join(' ')}
//                                 </div>
//                                 <div>
//                                     {(solutionSteps.length > 0) && (
//                                         <>
//                                             <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
//                                                 <span className="font-medium text-gray-600">
//                                                     Step {currentSolutionStepIndex + 1} of {solutionSteps.length}
//                                                 </span>
//                                                 {(currentSolutionStepIndex +1) === solutionSteps.length && !isAnimatingSolution && (
//                                                     <span className="text-green-600 font-semibold">Complete!</span>
//                                                 )}
//                                             </div>
//                                             <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
//                                                 <div
//                                                     className="h-full bg-blue-500 transition-all duration-150 ease-linear"
//                                                     style={{ width: `${((currentSolutionStepIndex + 1) / (solutionSteps.length || 1)) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <button onClick={() => applySingleSolutionStep(currentSolutionStepIndex + 1)} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace || currentSolutionStepIndex + 1 >= solutionSteps.length} className="btn btn-info">
//                                         Next Step
//                                     </button>
//                                     <button onClick={playSolutionAnimation} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace || currentSolutionStepIndex + 1 >= solutionSteps.length} className="btn btn-success">
//                                         {isAnimatingSolution ? 'Playing...' : 'Play All'}
//                                     </button>
//                                 </div>
//                                  <SolutionSteps 
//                                      steps={solutionSteps} 
//                                      currentStep={currentSolutionStepIndex} 
//                                      applyMove={(idx) => applySingleSolutionStep(idx)} // Pass correct function
//                                      disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} 
//                                  />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <footer className="bg-gray-800 text-gray-400 p-3 text-center text-xs sm:text-sm">
//                 Rubik's Cube Demo © {new Date().getFullYear()}
//             </footer>
//         </div>
//     );
// };

// export default Solver;


//   Today   skjblsadkjvbs;adkjvba;kjvba;


// // src/pages/Solver.jsx
// import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion'; // Unused
// import useCube from '../hooks/useCube';
// import SolutionSteps from '../components/SolutionSteps';
// // import LoadingSpinner from '../components/LoadingSpinner'; // Unused, custom spinner used
// import StatusMessage from '../components/StatusMessage';
// import { solveCube as callSolverAPI } from '../api/solverAPI';

// // Unused function, can be removed or commented out if planned for later
// // const generateRandomStateForScrambleButton = () => {
// //   const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
// //   const modifiers = ["", "'", "2"];
// //   const moves = [];
// //   const numMoves = Math.floor(Math.random() * 10) + 10;
// //   for (let i = 0; i < numMoves; i++) {
// //     const face = faces[Math.floor(Math.random() * faces.length)];
// //     const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
// //     moves.push(face + modifier);
// //   }
// //   return moves.join(' ');
// // };


// const Solver = () => {
//     const [uiIsLoading, setUiIsLoading] = useState(false);
//     const [isAnimatingSolution, setIsAnimatingSolution] = useState(false);

//     const handleCubeLoadingState = useCallback((isLoading, isChecking = false) => {
//         if (isChecking) return uiIsLoading;
//         setUiIsLoading(isLoading);
//         return undefined;
//     }, [uiIsLoading]);

//     const {
//         containerRef,
//         cubeState, // Use this object state for the solver API
//         isSolved,
//         resetCube,
//         applyMove,
//         scrambleCube,
//         // getStateString, // Not directly needed for solver if passing cubeState object
//         toggleCubeColorMode,
//         isDraggingFace
//     } = useCube(handleCubeLoadingState);

//     const [colorModeDisplay, setColorModeDisplay] = useState('standard');
//     const [showInstructions, setShowInstructions] = useState(false);

//     const [scrambleSequenceDisplay, setScrambleSequenceDisplay] = useState('');
//     const [solutionSteps, setSolutionSteps] = useState([]);
//     const [currentSolutionStepIndex, setCurrentSolutionStepIndex] = useState(-1);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     useEffect(() => {
//         let timer;
//         if (errorMessage) { timer = setTimeout(() => setErrorMessage(''), 5000); }
//         if (successMessage) { timer = setTimeout(() => setSuccessMessage(''), 5000); }
//         return () => clearTimeout(timer);
//     }, [errorMessage, successMessage]);

//     const handleSolveCube = async () => {
//         if (isSolved) { setErrorMessage("Cube is already solved!"); return; }
//         setUiIsLoading(true);
//         setErrorMessage(''); setSuccessMessage(''); setSolutionSteps([]); setCurrentSolutionStepIndex(-1);
//         try {
//             // const stateString = getStateString(); // Not needed if solverAPI takes object
//             // console.log('[Solver] Sending cube state object to solver API:', cubeState);
            
//             // Pass the object representation of the cube state
//             const apiResult = await callSolverAPI(cubeState); 
            
//             // Adjusted to match simulateSolver's return structure: { success, solution, message, moveCount }
//             if (apiResult && apiResult.success && apiResult.solution) {
//                 const movesArray = apiResult.solution.split(' ').filter(Boolean); // Ensure no empty strings
//                 if (movesArray.length > 0) {
//                     setSolutionSteps(movesArray);
//                     setSuccessMessage(`Solution found (${movesArray.length} moves)!`);
//                 } else if (isSolved) { // If solution is empty string and cube is solved
//                     setSolutionSteps([]);
//                     setSuccessMessage(apiResult.message || 'Cube is already solved.');
//                 } else {
//                      setErrorMessage(apiResult.message || 'Solver returned an empty solution for an unsolved cube.');
//                 }
//             } else if (apiResult && apiResult.success && apiResult.solution === '' && isSolved) {
//                  setSolutionSteps([]);
//                  setSuccessMessage(apiResult.message || 'Cube is already solved.');
//             }
//             else {
//                 setErrorMessage( (apiResult && apiResult.message) ? `Solver: ${apiResult.message}` : 'Could not find a solution. Ensure cube is valid.');
//             }
//         } catch (error) {
//             setErrorMessage(`Error calling solver: ${error.message || 'Please try again.'}`);
//             console.error('[Solver] Error solving cube via API:', error);
//         } finally {
//             setUiIsLoading(false);
//         }
//     };

//     const playSolutionAnimation = async () => {
//         if (solutionSteps.length === 0 || isAnimatingSolution || uiIsLoading) return;
        
//         setIsAnimatingSolution(true);
//         setUiIsLoading(true); 
//         setErrorMessage(''); 
        
//         // Store current animating steps to prevent race conditions if solutionSteps change
//         const stepsToPlay = [...solutionSteps];

//         for (let i = 0; i < stepsToPlay.length; i++) {
//             if (!containerRef.current || !isAnimatingSolution) { 
//                 break; 
//             }
//             setCurrentSolutionStepIndex(i);
//             await applyMove(stepsToPlay[i]); 
//             await new Promise(resolve => setTimeout(resolve, 300));
//         }
        
//         if (containerRef.current && isAnimatingSolution) {
//              setSuccessMessage('Cube solved successfully!');
//              setIsAnimatingSolution(false);
//              setCurrentSolutionStepIndex(-1);
//         }
//         // Ensure loading is set to false even if animation was interrupted early
//         setUiIsLoading(false); 
//     };
    
//     const stopSolutionAnimation = () => {
//         if (isAnimatingSolution) {
//             setIsAnimatingSolution(false);
//         }
//     };

//     const applySingleSolutionStep = async (moveIndex) => {
//         if (isAnimatingSolution || uiIsLoading || moveIndex < 0 || moveIndex >= solutionSteps.length) return;
//         stopSolutionAnimation();
//         setUiIsLoading(true);
//         setCurrentSolutionStepIndex(moveIndex);
//         await applyMove(solutionSteps[moveIndex]);
//         setUiIsLoading(false);
//     };

//      const handleResetCube = () => {
//         stopSolutionAnimation();
//         resetCube();
//         setSolutionSteps([]); setCurrentSolutionStepIndex(-1); setErrorMessage(''); setSuccessMessage('Cube reset.');
//         setScrambleSequenceDisplay('');
//     };

//     const handleScrambleCube = async () => {
//          if (uiIsLoading || isAnimatingSolution) return;
//          stopSolutionAnimation();
//          setUiIsLoading(true);
//          const appliedScramble = await scrambleCube(15);
//          setScrambleSequenceDisplay(appliedScramble);
//          setSolutionSteps([]); setCurrentSolutionStepIndex(-1); setErrorMessage(''); 
//          setSuccessMessage(`Applied scramble: ${appliedScramble.substring(0, 30)}...`);
//          setUiIsLoading(false);
//     };

//     const handleToggleColorMode = () => {
//         if (uiIsLoading || isAnimatingSolution) return;
//         stopSolutionAnimation();
//         toggleCubeColorMode();
//         setColorModeDisplay(prev => prev === 'standard' ? 'Colorblind Mode (TODO)' : 'Standard Colors');
//         setScrambleSequenceDisplay(''); 
//         setSolutionSteps([]);
//         setCurrentSolutionStepIndex(-1);
//     };
    
//     const faceButtons = ['U', 'D', 'L', 'R', 'F', 'B'];
//     const handleFaceButtonClick = async (face, isPrime = false) => {
//         if (uiIsLoading || isAnimatingSolution || isDraggingFace) return;
//         stopSolutionAnimation();
//         setUiIsLoading(true);
//         await applyMove(face + (isPrime ? "'" : ""));
//         setUiIsLoading(false);
//         setSolutionSteps([]);
//         setCurrentSolutionStepIndex(-1);
//     };


//     return (
//         <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
//             {/* Header */}
//             <header className="bg-blue-600 text-white p-4 shadow-md">
//                 <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-2">
//                     <h1 className="text-xl sm:text-2xl font-bold">Interactive Rubik's Cube</h1>
//                     <div className="flex items-center space-x-2 sm:space-x-4">
//                         <button
//                             onClick={() => setShowInstructions(!showInstructions)}
//                             className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         >
//                             {showInstructions ? 'Hide' : 'Show'} Instructions
//                         </button>
//                         <button
//                             onClick={handleToggleColorMode}
//                             disabled={uiIsLoading || isAnimatingSolution || isDraggingFace}
//                             className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         >
//                             {colorModeDisplay === 'standard' ? 'Colorblind Mode' : 'Standard Colors'}
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* Instructions Panel */}
//             {showInstructions && (
//                 <motion.div 
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="bg-white p-4 shadow-md border-b border-gray-200 overflow-hidden"
//                 >
//                     <div className="container mx-auto">
//                         <h2 className="text-lg font-semibold mb-2 text-gray-700">How to Use:</h2>
//                         <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-gray-600">
//                             <li>Click and drag cube background: Rotate view.</li>
//                             <li>Click and drag on a cube sticker: Rotate that face/slice.</li>
//                             <li>Use mouse wheel: Zoom in/out.</li>
//                             <li>Buttons: Control cube state, solve, and view solution.</li>
//                         </ul>
//                     </div>
//                 </motion.div>
//             )}

//             {/* Main Content Area */}
//             <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
//                 <div className="flex-grow h-1/2 md:h-auto md:w-2/3 relative bg-gray-300">
//                     <div ref={containerRef} className="w-full h-full"></div>
//                     {(uiIsLoading || isAnimatingSolution) && (
//                         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
//                             <div className="bg-white p-5 sm:p-6 rounded-lg shadow-xl flex items-center space-x-3 sm:space-x-4">
//                                 <div className={`animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 ${isAnimatingSolution ? 'border-green-500' : 'border-blue-500'}`}></div>
//                                 <p className="font-medium text-md sm:text-lg text-gray-700">
//                                     {isAnimatingSolution ? 'Playing Solution...' : (uiIsLoading ? 'Processing...' : '')}
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                      {(errorMessage || successMessage) && !uiIsLoading && ( <div className="absolute top-4 left-1/2 -translate-x-1/2 w-auto max-w-[90%] z-20"><StatusMessage error={errorMessage} success={successMessage} onDismiss={() => { setErrorMessage(''); setSuccessMessage(''); }}/></div> )}
//                 </div>

//                 <div className="bg-white w-full md:w-1/3 p-4 shadow-lg md:shadow-inner overflow-y-auto border-t md:border-t-0 md:border-l border-gray-300">
//                     <div className="space-y-5">
//                         <div>
//                             <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">Cube Actions</h2>
//                             <div className="grid grid-cols-2 gap-3 mb-3">
//                                 <button onClick={handleScrambleCube} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-warning">Scramble</button>
//                                 <button onClick={handleResetCube} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-neutral">Reset</button>
//                             </div>
//                              <button onClick={handleSolveCube} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace || isSolved || (solutionSteps.length > 0 && !isSolved) } className="btn btn-primary w-full">
//                                 {isSolved ? 'Cube Solved' : (solutionSteps.length > 0 ? 'Solution Ready' : 'Solve Cube')}
//                             </button>
//                         </div>

//                         <div>
//                             <h3 className="text-md font-semibold mb-2 text-gray-700">Rotate Faces (Buttons):</h3>
//                             <div className="grid grid-cols-3 gap-2">
//                                 {faceButtons.map(face => (
//                                     <div key={face} className="flex flex-col gap-1">
//                                         <button onClick={() => handleFaceButtonClick(face, false)} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-sm btn-outline">{face}</button>
//                                         <button onClick={() => handleFaceButtonClick(face, true)} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-sm btn-outline">{face}'</button>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
                        
//                         <div>
//                             <h2 className="text-base sm:text-lg font-semibold mb-1.5 text-gray-700">Scramble Applied</h2>
//                             <div className="bg-gray-100 p-3 rounded-md min-h-[60px] text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
//                                 {scrambleSequenceDisplay || <span className="text-gray-400">N/A</span>}
//                             </div>
//                         </div>

//                         {solutionSteps.length > 0 && (
//                             <div className="border-t border-gray-200 pt-5 space-y-3">
//                                 <h2 className="text-base sm:text-lg font-semibold text-gray-700">Solution Steps ({solutionSteps.length})</h2>
//                                 <div className="bg-gray-100 p-3 rounded-md max-h-32 overflow-y-auto text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
//                                     {solutionSteps.join(' ')}
//                                 </div>
//                                 <div>
//                                     {(solutionSteps.length > 0) && (
//                                         <>
//                                             <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
//                                                 <span className="font-medium text-gray-600">
//                                                     Step {Math.max(0, currentSolutionStepIndex + 1)} of {solutionSteps.length}
//                                                 </span>
//                                                 {(currentSolutionStepIndex +1) === solutionSteps.length && !isAnimatingSolution && (
//                                                     <span className="text-green-600 font-semibold">Complete!</span>
//                                                 )}
//                                             </div>
//                                             <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
//                                                 <div
//                                                     className="h-full bg-blue-500 transition-all duration-150 ease-linear"
//                                                     style={{ width: `${((Math.max(0, currentSolutionStepIndex + 1)) / (solutionSteps.length || 1)) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <button onClick={() => applySingleSolutionStep(currentSolutionStepIndex + 1)} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace || currentSolutionStepIndex + 1 >= solutionSteps.length} className="btn btn-info">
//                                         Next Step
//                                     </button>
//                                     <button onClick={playSolutionAnimation} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace || currentSolutionStepIndex + 1 >= solutionSteps.length || isSolved} className="btn btn-success">
//                                         {isAnimatingSolution ? 'Playing...' : 'Play All'}
//                                     </button>
//                                 </div>
//                                  <SolutionSteps 
//                                      steps={solutionSteps} 
//                                      currentStep={currentSolutionStepIndex} 
//                                      applyMove={(idx) => applySingleSolutionStep(idx)}
//                                      disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} 
//                                  />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <footer className="bg-gray-800 text-gray-400 p-3 text-center text-xs sm:text-sm">
//                 Rubik's Cube Demo © {new Date().getFullYear()}
//             </footer>
//         </div>
//     );
// };

// export default Solver;


// src/pages/Solver.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; // Ensure this is uncommented
import useCube from '../hooks/useCube';
import SolutionSteps from '../components/SolutionSteps';
import StatusMessage from '../components/StatusMessage';
import { solveCube as callSolverAPI } from '../api/solverAPI';

const Solver = () => {
    const [uiIsLoading, setUiIsLoading] = useState(false);
    const [isAnimatingSolution, setIsAnimatingSolution] = useState(false);

    const handleCubeLoadingState = useCallback((isLoading, isChecking = false) => {
        if (isChecking) return uiIsLoading;
        setUiIsLoading(isLoading);
        return undefined;
    }, [uiIsLoading]);

    const {
        containerRef,
        cubeState,
        isSolved, // This tells us the actual state of the cube
        resetCube,
        applyMove,
        scrambleCube,
        toggleCubeColorMode,
        isDraggingFace
    } = useCube(handleCubeLoadingState);

    const [colorModeDisplay, setColorModeDisplay] = useState('standard');
    const [showInstructions, setShowInstructions] = useState(false);

    const [scrambleSequenceDisplay, setScrambleSequenceDisplay] = useState('');
    const [solutionSteps, setSolutionSteps] = useState([]);
    const [currentSolutionStepIndex, setCurrentSolutionStepIndex] = useState(-1);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        let timer;
        if (errorMessage) { timer = setTimeout(() => setErrorMessage(''), 5000); }
        if (successMessage) { timer = setTimeout(() => setSuccessMessage(''), 5000); }
        return () => clearTimeout(timer);
    }, [errorMessage, successMessage]);

    // This useEffect will run when the animation finishes to set the correct message
    useEffect(() => {
        // Only act if an animation was running and has now stopped,
        // and we are not in another general loading state.
        if (!isAnimatingSolution && !uiIsLoading && solutionSteps.length > 0 && currentSolutionStepIndex === -1) {
            if (isSolved) {
                setSuccessMessage('Cube solved successfully!');
            } else {
                setErrorMessage('Played all steps, but the cube is not solved. (Simulated solution may not match current scramble)');
            }
        }
    // We want this to run when isAnimatingSolution becomes false after an animation.
    // isSolved is the key state to check. uiIsLoading prevents premature messages.
    // solutionSteps.length > 0 ensures this is for after a solution attempt.
    // currentSolutionStepIndex === -1 indicates the animation loop has fully completed or reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAnimatingSolution, isSolved, uiIsLoading, currentSolutionStepIndex]);


    const handleSolveCube = async () => {
        if (isSolved) { setErrorMessage("Cube is already solved!"); return; }
        setUiIsLoading(true);
        setErrorMessage(''); setSuccessMessage(''); setSolutionSteps([]); setCurrentSolutionStepIndex(-1);
        try {
            const apiResult = await callSolverAPI(cubeState);
            if (apiResult && apiResult.success && apiResult.solution) {
                const movesArray = apiResult.solution.split(' ').filter(Boolean);
                if (movesArray.length > 0) {
                    setSolutionSteps(movesArray);
                    setSuccessMessage(`Solution found (${movesArray.length} moves)! Ready to play.`);
                } else if (isSolved) {
                    setSolutionSteps([]);
                    setSuccessMessage(apiResult.message || 'Cube is already solved.');
                } else {
                     setErrorMessage(apiResult.message || 'Solver returned an empty solution for an unsolved cube.');
                }
            } else if (apiResult && apiResult.success && apiResult.solution === '' && isSolved) {
                 setSolutionSteps([]);
                 setSuccessMessage(apiResult.message || 'Cube is already solved.');
            }
            else {
                setErrorMessage( (apiResult && apiResult.message) ? `Solver: ${apiResult.message}` : 'Could not find a solution. Ensure cube is valid.');
            }
        } catch (error) {
            setErrorMessage(`Error calling solver: ${error.message || 'Please try again.'}`);
            console.error('[Solver] Error solving cube via API:', error);
        } finally {
            setUiIsLoading(false);
        }
    };

    const playSolutionAnimation = async () => {
        if (solutionSteps.length === 0 || isAnimatingSolution || uiIsLoading) return;
        
        setIsAnimatingSolution(true);
        setUiIsLoading(true); 
        setErrorMessage(''); 
        setSuccessMessage(''); // Clear message before starting animation

        const stepsToPlay = [...solutionSteps];

        for (let i = 0; i < stepsToPlay.length; i++) {
            if (!containerRef.current || !isAnimatingSolution) { 
                break; 
            }
            setCurrentSolutionStepIndex(i);
            await applyMove(stepsToPlay[i]); 
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // After the loop, whether it completed or was broken out of:
        if (containerRef.current && isAnimatingSolution) {
             // If animation was not externally stopped, mark it as complete for the useEffect
             setCurrentSolutionStepIndex(-1); 
        }
        // Let the useEffect handle the final message based on the actual 'isSolved' state
        setIsAnimatingSolution(false);
        setUiIsLoading(false); 
    };
    
    const stopSolutionAnimation = () => {
        if (isAnimatingSolution) {
            setIsAnimatingSolution(false);
            // If stopping manually, we might not want the useEffect to show "not solved"
            // Or, we let it, and it's accurate. For now, this is fine.
        }
    };

    const applySingleSolutionStep = async (moveIndex) => {
        if (isAnimatingSolution || uiIsLoading || moveIndex < 0 || moveIndex >= solutionSteps.length) return;
        stopSolutionAnimation();
        setUiIsLoading(true);
        setCurrentSolutionStepIndex(moveIndex);
        await applyMove(solutionSteps[moveIndex]);
        setUiIsLoading(false);
        // After a single step, check if solved
        if (isSolved && moveIndex === solutionSteps.length - 1) {
            setSuccessMessage('Cube solved successfully!');
        } else if (moveIndex === solutionSteps.length - 1 && !isSolved) {
            setErrorMessage('Last step played, but the cube is not solved.');
        }
    };

     const handleResetCube = () => {
        stopSolutionAnimation();
        resetCube();
        setSolutionSteps([]); setCurrentSolutionStepIndex(-1); setErrorMessage(''); setSuccessMessage('Cube reset.');
        setScrambleSequenceDisplay('');
    };

    const handleScrambleCube = async () => {
         if (uiIsLoading || isAnimatingSolution) return;
         stopSolutionAnimation();
         setUiIsLoading(true);
         setSolutionSteps([]); setCurrentSolutionStepIndex(-1); // Clear previous solution
         setErrorMessage(''); setSuccessMessage('');
         const appliedScramble = await scrambleCube(15);
         setScrambleSequenceDisplay(appliedScramble);
         setSuccessMessage(`Applied scramble.`); // Simplified message
         setUiIsLoading(false);
    };

    const handleToggleColorMode = () => {
        if (uiIsLoading || isAnimatingSolution) return;
        stopSolutionAnimation();
        toggleCubeColorMode();
        setColorModeDisplay(prev => prev === 'standard' ? 'Colorblind Mode (TODO)' : 'Standard Colors');
        setScrambleSequenceDisplay(''); 
        setSolutionSteps([]);
        setCurrentSolutionStepIndex(-1);
    };
    
    const faceButtons = ['U', 'D', 'L', 'R', 'F', 'B'];
    const handleFaceButtonClick = async (face, isPrime = false) => {
        if (uiIsLoading || isAnimatingSolution || isDraggingFace) return;
        stopSolutionAnimation();
        setUiIsLoading(true);
        await applyMove(face + (isPrime ? "'" : ""));
        setUiIsLoading(false);
        setSolutionSteps([]); // Manual move invalidates current solution
        setCurrentSolutionStepIndex(-1);
        setSuccessMessage(''); setErrorMessage(''); // Clear messages
    };


    return (
       <div className="flex flex-col h-screen bg-transparent text-gray-800">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-2">
                    <h1 className="text-xl sm:text-2xl font-bold">Interactive Rubik's Cube</h1>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {showInstructions ? 'Hide' : 'Show'} Instructions
                        </button>
                        <button
                            onClick={handleToggleColorMode}
                            disabled={uiIsLoading || isAnimatingSolution || isDraggingFace}
                            className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {colorModeDisplay === 'standard' ? 'Colorblind Mode' : 'Standard Colors'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Instructions Panel */}
            {showInstructions && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white p-4 shadow-md border-b border-gray-200 overflow-hidden"
                >
                    <div className="container mx-auto">
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">How to Use:</h2>
                        <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-gray-600">
                            <li>Click and drag cube background: Rotate view.</li>
                            <li>Click and drag on a cube sticker: Rotate that face/slice.</li>
                            <li>Use mouse wheel: Zoom in/out.</li>
                            <li>Buttons: Control cube state, solve, and view solution.</li>
                        </ul>
                    </div>
                </motion.div>
            )}

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                <div className="flex-grow h-1/2 md:h-auto md:w-2/3 relative bg-transparent">
                    <div ref={containerRef} className="w-full h-full"></div>
                    {(uiIsLoading || isAnimatingSolution) && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
                            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-xl flex items-center space-x-3 sm:space-x-4">
                                <div className={`animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 ${isAnimatingSolution ? 'border-green-500' : 'border-blue-500'}`}></div>
                                <p className="font-medium text-md sm:text-lg text-gray-700">
                                    {isAnimatingSolution ? 'Playing Solution...' : (uiIsLoading ? 'Processing...' : '')}
                                </p>
                            </div>
                        </div>
                    )}
                     {(errorMessage || successMessage) && !uiIsLoading && !isAnimatingSolution && ( <div className="absolute top-4 left-1/2 -translate-x-1/2 w-auto max-w-[90%] z-20"><StatusMessage error={errorMessage} success={successMessage} onDismiss={() => { setErrorMessage(''); setSuccessMessage(''); }}/></div> )}
                </div>

               <div className="bg-[rgba(255,255,255,0.9)] w-full md:w-1/3 p-4 shadow-lg md:shadow-inner overflow-y-auto border-t md:border-t-0 md:border-l border-gray-300">
                    <div className="space-y-5">
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">Cube Actions</h2>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <button onClick={handleScrambleCube} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-warning">Scramble</button>
                                <button onClick={handleResetCube} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-neutral">Reset</button>
                            </div>
                             <button onClick={handleSolveCube} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace || (isSolved && solutionSteps.length === 0) } className="btn btn-primary w-full">
                                {(isSolved && solutionSteps.length === 0) ? 'Cube Solved' : (solutionSteps.length > 0 ? 'Solution Ready' : 'Get Solution (Simulated)')}
                            </button>
                        </div>

                        <div>
                            <h3 className="text-md font-semibold mb-2 text-gray-700">Rotate Faces (Buttons):</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {faceButtons.map(face => (
                                    <div key={face} className="flex flex-col gap-1">
                                        <button onClick={() => handleFaceButtonClick(face, false)} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-sm btn-outline">{face}</button>
                                        <button onClick={() => handleFaceButtonClick(face, true)} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} className="btn btn-sm btn-outline">{face}'</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold mb-1.5 text-gray-700">Scramble Applied</h2>
                            <div className="bg-gray-100 p-3 rounded-md min-h-[60px] text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
                                {scrambleSequenceDisplay || <span className="text-gray-400">N/A</span>}
                            </div>
                        </div>

                        {solutionSteps.length > 0 && (
                            <div className="border-t border-gray-200 pt-5 space-y-3">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-700">Solution Steps ({solutionSteps.length})</h2>
                                <div className="bg-gray-100 p-3 rounded-md max-h-32 overflow-y-auto text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
                                    {solutionSteps.join(' ')}
                                </div>
                                <div>
                                    {(solutionSteps.length > 0) && (
                                        <>
                                            <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
                                                <span className="font-medium text-gray-600">
                                                    Step {currentSolutionStepIndex === -1 ? solutionSteps.length : Math.max(0, currentSolutionStepIndex + 1)} of {solutionSteps.length}
                                                </span>
                                                {(currentSolutionStepIndex +1) === solutionSteps.length && !isAnimatingSolution && isSolved && (
                                                    <span className="text-green-600 font-semibold">Complete & Solved!</span>
                                                )}
                                                 {(currentSolutionStepIndex +1) === solutionSteps.length && !isAnimatingSolution && !isSolved && (
                                                    <span className="text-orange-600 font-semibold">Complete (Not Solved)</span>
                                                )}
                                            </div>
                                            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full bg-blue-500 transition-all duration-150 ease-linear"
                                                    style={{ width: `${((currentSolutionStepIndex === -1 ? solutionSteps.length : Math.max(0, currentSolutionStepIndex + 1)) / (solutionSteps.length || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => applySingleSolutionStep(currentSolutionStepIndex + 1)} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace || currentSolutionStepIndex + 1 >= solutionSteps.length} className="btn btn-info">
                                        Next Step
                                    </button>
                                    <button onClick={playSolutionAnimation} disabled={uiIsLoading || isAnimatingSolution || isDraggingFace || currentSolutionStepIndex + 1 >= solutionSteps.length || (isSolved && currentSolutionStepIndex === -1)} className="btn btn-success">
                                        {isAnimatingSolution ? 'Playing...' : 'Play All'}
                                    </button>
                                </div>
                                 <SolutionSteps 
                                     steps={solutionSteps} 
                                     currentStep={currentSolutionStepIndex} 
                                     applyMove={(idx) => applySingleSolutionStep(idx)}
                                     disabled={uiIsLoading || isAnimatingSolution || isDraggingFace} 
                                 />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="bg-gray-800 text-gray-400 p-3 text-center text-xs sm:text-sm">
                Rubik's Cube Demo © {new Date().getFullYear()}
            </footer>
        </div>
    );
};

export default Solver;