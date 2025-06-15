// // // CubeControls.jsx (or RubiksCubeSolver.jsx)
// // import React, { useRef, useState, useEffect } from 'react';
// // import * as THREE from 'three';
// // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// // // Utility function to generate a random cube state (scramble sequence)
// // const generateRandomState = () => {
// //   const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
// //   const modifiers = ["", "'", "2"];
// //   const moves = [];
// //   const numMoves = Math.floor(Math.random() * 12) + 8; // Scramble length 8-19 moves
// //   for (let i = 0; i < numMoves; i++) {
// //     const face = faces[Math.floor(Math.random() * faces.length)];
// //     const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
// //     moves.push(face + modifier);
// //   }
// //   return moves.join(' ');
// // };

// // // Mock function to simulate solving the cube
// // const solveCube = (currentState) => {
// //   console.log("Mock solving input state (scramble sequence):", currentState);
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       resolve("R U R' U' R' F R2 U' R' U' R U R' F'"); // Fixed mock solution
// //     }, 500);
// //   });
// // };

// // export default function RubiksCubeSolver() {
// //   const mountRef = useRef(null);
// //   const [scene, setScene] = useState(null);
// //   // const [camera, setCamera] = useState(null); // Removed as it's not used after being set
// //   // const [renderer, setRenderer] = useState(null); // Removed as it's not used after being set
// //   const [cube, setCube] = useState(null); // THREE.Group for the Rubik's Cube

// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isSolving, setIsSolving] = useState(false);
// //   const [moveSequence, setMoveSequence] = useState('');
// //   const [solution, setSolution] = useState('');
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [showInstructions, setShowInstructions] = useState(false);
// //   const [colorMode, setColorMode] = useState('standard');

// //   // Scene Setup Effect
// //   useEffect(() => {
// //     let currentMount = mountRef.current;
// //     if (!currentMount) return;

// //     console.log("Scene useEffect: Initializing...");
// //     const newScene = new THREE.Scene();
// //     newScene.background = new THREE.Color(0xf0f0f0);
// //     const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
// //     newScene.add(ambientLight);
// //     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
// //     directionalLight.position.set(5, 10, 7.5);
// //     newScene.add(directionalLight);

// //     const rect = currentMount.getBoundingClientRect();
// //     const newCamera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 1000);
// //     newCamera.position.set(6, 6, 9);
// //     newCamera.lookAt(0, 0, 0);

// //     const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// //     newRenderer.setSize(rect.width, rect.height);
// //     newRenderer.setPixelRatio(window.devicePixelRatio);
// //     currentMount.appendChild(newRenderer.domElement);

// //     const newControls = new OrbitControls(newCamera, newRenderer.domElement);
// //     newControls.enableDamping = true;
// //     newControls.dampingFactor = 0.05;
// //     newControls.minDistance = 5;
// //     newControls.maxDistance = 25;

// //     setScene(newScene);
// //     // setCamera(newCamera); // Not setting state if not used
// //     // setRenderer(newRenderer); // Not setting state if not used

// //     const handleResize = () => {
// //       if (!currentMount || !newCamera || !newRenderer) return;
// //       const resizeRect = currentMount.getBoundingClientRect();
// //       newCamera.aspect = resizeRect.width / resizeRect.height;
// //       newCamera.updateProjectionMatrix();
// //       newRenderer.setSize(resizeRect.width, resizeRect.height);
// //     };
// //     window.addEventListener('resize', handleResize);

// //     let animationFrameId;
// //     const animate = () => {
// //       animationFrameId = requestAnimationFrame(animate);
// //       newControls.update();
// //       newRenderer.render(newScene, newCamera);
// //     };
// //     animate();
// //     console.log("Scene useEffect: Setup complete, animation started.");

// //     return () => {
// //       console.log("Scene useEffect: Cleaning up...");
// //       cancelAnimationFrame(animationFrameId);
// //       window.removeEventListener('resize', handleResize);
// //       newControls.dispose();
// //       if (newRenderer.domElement && newRenderer.domElement.parentNode === currentMount) {
// //         currentMount.removeChild(newRenderer.domElement);
// //       }
// //       newRenderer.dispose();
// //       // Clean up scene's direct children if necessary (lights, etc.)
// //       // newScene.clear(); // Or traverse and dispose
// //       console.log("Scene useEffect: Cleanup finished.");
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []); // Mount and unmount only

// //   // Cube Creation Effect
// //   useEffect(() => {
// //     if (!scene) {
// //       console.log("Cube useEffect: Waiting for scene...");
// //       return;
// //     }
// //     console.log("Cube useEffect: Running. Color mode:", colorMode);

// //     // The cleanup function of the *previous* run of this effect
// //     // is responsible for removing the *previous* newCubeGroup.
// //     // So, no need for an `if (cube)` removal block here.

// //     console.log("Cube useEffect: Creating new cube group...");
// //     const newCubeGroup = new THREE.Group();
// //     const standardColors = { front: 0xff0000, back: 0xffa500, up: 0xffffff, down: 0xffff00, right: 0x0000ff, left: 0x00ff00 };
// //     const colorblindColors = { front: 0xff0000, back: 0x0080ff, up: 0xffffff, down: 0xffff00, right: 0x8000ff, left: 0x00cc00 };
// //     const currentColors = colorMode === 'standard' ? standardColors : colorblindColors;
// //     const innerColor = 0x202020;
// //     const cubeletSize = 1;
// //     const spacing = 0.07;

// //     for (let x = -1; x <= 1; x++) {
// //       for (let y = -1; y <= 1; y++) {
// //         for (let z = -1; z <= 1; z++) {
// //           const geometry = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);
// //           const materials = [
// //             new THREE.MeshStandardMaterial({ color: x === 1 ? currentColors.right : innerColor, roughness: 0.4, metalness: 0.0 }),
// //             new THREE.MeshStandardMaterial({ color: x === -1 ? currentColors.left : innerColor, roughness: 0.4, metalness: 0.0 }),
// //             new THREE.MeshStandardMaterial({ color: y === 1 ? currentColors.up : innerColor, roughness: 0.4, metalness: 0.0 }),
// //             new THREE.MeshStandardMaterial({ color: y === -1 ? currentColors.down : innerColor, roughness: 0.4, metalness: 0.0 }),
// //             new THREE.MeshStandardMaterial({ color: z === 1 ? currentColors.front : innerColor, roughness: 0.4, metalness: 0.0 }),
// //             new THREE.MeshStandardMaterial({ color: z === -1 ? currentColors.back : innerColor, roughness: 0.4, metalness: 0.0 })
// //           ];
// //           const cubelet = new THREE.Mesh(geometry, materials);
// //           cubelet.position.set(
// //             x * (cubeletSize + spacing),
// //             y * (cubeletSize + spacing),
// //             z * (cubeletSize + spacing)
// //           );
// //           newCubeGroup.add(cubelet);
// //         }
// //       }
// //     }
// //     scene.add(newCubeGroup);
// //     setCube(newCubeGroup); // Update state with the new cube group
// //     console.log("Cube useEffect: New cube created and added to scene.");

// //     // Cleanup function for *this* effect's instance of newCubeGroup
// //     return () => {
// //       console.log("Cube useEffect: Cleanup for this instance (on scene/colorMode change or unmount).");
// //       if (newCubeGroup && scene && newCubeGroup.parent === scene) {
// //         scene.remove(newCubeGroup);
// //         newCubeGroup.traverse(child => {
// //           if (child.isMesh) {
// //             if (child.geometry) child.geometry.dispose();
// //             if (Array.isArray(child.material)) {
// //               child.material.forEach(material => material.dispose());
// //             } else if (child.material) {
// //               child.material.dispose();
// //             }
// //           }
// //         });
// //         console.log("Cube useEffect: newCubeGroup instance removed/disposed from cleanup.");
// //       }
// //       // setCube(null); // Avoid if it causes issues, let new effect run set new cube
// //     };
// //   }, [scene, colorMode]); // This effect runs when scene is ready or colorMode changes


// //   // Helper to get cubelets for a face
// //   const getFaceCubelets = (faceSymbol) => {
// //     if (!cube) return [];
// //     const faceCubelets = [];
// //     // Approximate center of the outer layer cubelets from the cube's origin
// //     // (cubeletSize / 2) would be the surface, give a bit of leeway.
// //     const threshold = (1 * (1 + 0.07)) * 0.4; // cubeletSize * (1 + spacing_factor_approx) * 0.4

// //     cube.children.forEach(cubelet => {
// //       if (!cubelet.isMesh) return;
// //       // Use world position if cube group itself might be transformed,
// //       // but here cube group is at origin, so local position is fine.
// //       const pos = cubelet.position;
// //       switch (faceSymbol) {
// //         case 'R': if (pos.x > threshold) faceCubelets.push(cubelet); break;
// //         case 'L': if (pos.x < -threshold) faceCubelets.push(cubelet); break;
// //         case 'U': if (pos.y > threshold) faceCubelets.push(cubelet); break;
// //         case 'D': if (pos.y < -threshold) faceCubelets.push(cubelet); break;
// //         case 'F': if (pos.z > threshold) faceCubelets.push(cubelet); break;
// //         case 'B': if (pos.z < -threshold) faceCubelets.push(cubelet); break;
// //         default: break;
// //       }
// //     });
// //     return faceCubelets;
// //   };

// //   // Rotate Face Logic
// //   const rotateFace = async (move) => {
// //     if (!cube || !scene || isLoading || isSolving) {
// //       console.warn("rotateFace: Conditions not met.", { cube:!!cube, scene:!!scene, isLoading, isSolving });
// //       return;
// //     }
// //     console.log(`Rotate Face: ${move}`);

// //     let axisVector = new THREE.Vector3();
// //     let angle = 0;
// //     const prime = move.includes("'");
// //     const double = move.includes("2");
// //     const baseFace = move.charAt(0);

// //     switch (baseFace) {
// //       case 'R': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
// //       case 'L': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break; // Note: L axis is same as R, angle inverted
// //       case 'U': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
// //       case 'D': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break; // Note: D axis is same as U, angle inverted
// //       case 'F': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
// //       case 'B': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break; // Note: B axis is same as F, angle inverted
// //       default: console.warn(`Unknown move: ${move}`); return;
// //     }

// //     const selectedCubelets = getFaceCubelets(baseFace);
// //     if (selectedCubelets.length === 0) {
// //       console.warn(`No cubelets found for face ${baseFace}. Total children: ${cube.children.length}`);
// //       return;
// //     }

// //     const pivot = new THREE.Object3D();
// //     scene.add(pivot); // Pivot is at world origin

// //     // Store original world matrices to correctly re-attach
// //     const originalMatrices = new Map();
// //     selectedCubelets.forEach(cubelet => {
// //       originalMatrices.set(cubelet, cubelet.matrix.clone()); // Store local matrix relative to cube group
// //       pivot.attach(cubelet); // Attaches cubelet to pivot, preserving world transform
// //     });

// //     return new Promise(resolve => {
// //       const initialPivotOrientation = new THREE.Quaternion(); // Pivot's own orientation starts at identity
// //       const targetPivotOrientation = new THREE.Quaternion().setFromAxisAngle(axisVector.normalize(), angle);
// //       const animationDuration = 250;
// //       const startTime = Date.now();

// //       const animateRotation = () => {
// //         const elapsed = Date.now() - startTime;
// //         let progress = Math.min(elapsed / animationDuration, 1);
// //         progress = 1 - Math.pow(1 - progress, 3); // EaseOutCubic

// //         // Use instance method slerpQuaternions
// //         pivot.quaternion.slerpQuaternions(initialPivotOrientation, targetPivotOrientation, progress);

// //         if (progress < 1) {
// //           requestAnimationFrame(animateRotation);
// //         } else {
// //           pivot.quaternion.copy(targetPivotOrientation); // Ensure exact final state for pivot

// //           // Detach cubelets and re-attach to main cube group
// //           // After pivot rotation, cubelet's world matrix has changed.
// //           // We want to re-parent them to 'cube' (the main group)
// //           // such that their new world orientation/position is preserved.
// //           selectedCubelets.forEach(cubelet => {
// //             // Update cubelet's matrix based on pivot's transformation
// //             cubelet.updateMatrixWorld(true); // Ensure world matrix is up-to-date
// //             cube.attach(cubelet); // Re-attach to the main cube group, preserving new world transform
// //           });

// //           scene.remove(pivot);
// //           resolve();
// //         }
// //       };
// //       animateRotation();
// //     });
// //   };

// //   const handleScramble = async () => {
// //     if (isLoading || isSolving) return;
// //     console.log("Scrambling...");
// //     setIsLoading(true);
// //     setSolution(''); setCurrentStep(0);

// //     const scrambleSequence = generateRandomState();
// //     setMoveSequence(scrambleSequence);

// //     if (cube) cube.quaternion.identity(); // Reset whole cube's visual rotation (if any)

// //     const moves = scrambleSequence.split(' ').filter(m => m);
// //     for (const move of moves) {
// //       await rotateFace(move);
// //     }

// //     setIsLoading(false);
// //     console.log("Scramble complete:", scrambleSequence);
// //   };

// //   const handleSolve = async () => {
// //     if (isLoading || isSolving) return;
// //     console.log("Solving...");
// //     setIsSolving(true); setSolution(''); setCurrentStep(0);
// //     try {
// //       const currentLogicState = moveSequence;
// //       const solutionSequence = await solveCube(currentLogicState);
// //       setSolution(solutionSequence);
// //       if (cube) cube.quaternion.identity(); // Reset visual rotation for applying solution
// //       console.log("Mock solution found:", solutionSequence);
// //     } catch (error) {
// //       console.error('Error solving cube:', error);
// //     } finally {
// //       setIsSolving(false);
// //     }
// //   };

// //   const executeSingleStep = async () => {
// //     if (!solution || isLoading || isSolving) return;
// //     const moves = solution.split(' ').filter(m => m);
// //     if (currentStep >= moves.length) return;

// //     setIsLoading(true);
// //     const currentMove = moves[currentStep];
// //     await rotateFace(currentMove);
// //     setCurrentStep(prev => prev + 1);
// //     setIsLoading(false);
// //   };

// //   const executeAllSolutionSteps = async () => {
// //     if (!solution || isLoading || isSolving) return;
// //     const moves = solution.split(' ').filter(m => m);
// //     if (currentStep >= moves.length) return;

// //     setIsLoading(true);
// //     let tempStep = currentStep;
// //     try {
// //       while (tempStep < moves.length) {
// //         const currentMove = moves[tempStep];
// //         await rotateFace(currentMove);
// //         tempStep++;
// //         setCurrentStep(tempStep);
// //       }
// //       console.log("Finished executing all solution steps.");
// //     } catch (error) {
// //       console.error("Error during executeAllSolutionSteps:", error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const toggleColorMode = () => {
// //     if (isLoading || isSolving) {
// //         console.warn("Cannot change color mode while an operation is in progress.");
// //         return;
// //     }
// //     setColorMode(prevMode => prevMode === 'standard' ? 'colorblind' : 'standard');
// //   };

// //   // --- JSX Return ---
// //   // (Using the improved JSX from your thought process for better UI/UX)
// //   return (
// //     <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
// //       {/* Header */}
// //       <header className="bg-blue-600 text-white p-4 shadow-md">
// //         <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-2">
// //           <h1 className="text-xl sm:text-2xl font-bold">Interactive Rubik's Cube</h1>
// //           <div className="flex items-center space-x-2 sm:space-x-4">
// //             <button
// //               onClick={() => setShowInstructions(!showInstructions)}
// //               className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
// //             >
// //               {showInstructions ? 'Hide' : 'Show'} Instructions
// //             </button>
// //             <button
// //               onClick={toggleColorMode}
// //               disabled={isLoading || isSolving}
// //               className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
// //             >
// //               {colorMode === 'standard' ? 'Colorblind Mode' : 'Standard Colors'}
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Instructions Panel */}
// //       {showInstructions && (
// //         <div className="bg-white p-4 shadow-md border-b border-gray-200">
// //           <div className="container mx-auto">
// //             <h2 className="text-lg font-semibold mb-2 text-gray-700">How to Use:</h2>
// //             <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-gray-600">
// //               <li>Click and drag the cube to rotate your view.</li>
// //               <li>Use mouse wheel to zoom in/out.</li>
// //               <li><b>Scramble:</b> Applies a random sequence of moves to the cube.</li>
// //               <li><b>Solve:</b> Gets a (currently mock) solution sequence.</li>
// //               <li><b>Next Step / Execute All:</b> Animates the solution moves on the cube.</li>
// //               <li>Face rotations are now animated!</li>
// //             </ul>
// //           </div>
// //         </div>
// //       )}

// //       {/* Main Content */}
// //       <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
// //         {/* 3D Cube Container */}
// //         <div className="flex-grow h-1/2 md:h-auto md:w-2/3 relative bg-gray-200">
// //           <div ref={mountRef} className="w-full h-full"></div>
// //           {(isLoading || isSolving) && (
// //             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
// //               <div className="bg-white p-5 sm:p-6 rounded-lg shadow-xl flex items-center space-x-3 sm:space-x-4">
// //                 <div className={`animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 ${isSolving ? 'border-green-500' : 'border-blue-500'}`}></div>
// //                 <p className="font-medium text-md sm:text-lg text-gray-700">
// //                   {isSolving ? 'Solving...' : (isLoading ? (solution ? 'Applying Solution...' : 'Scrambling...') : '')}
// //                 </p>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Controls Panel */}
// //         <div className="bg-white w-full md:w-1/3 p-4 shadow-lg md:shadow-inner overflow-y-auto border-t md:border-t-0 md:border-l border-gray-300">
// //           <div className="space-y-5">
// //             <div>
// //               <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Actions</h2>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <button onClick={handleScramble} disabled={isLoading || isSolving} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400">
// //                   Scramble
// //                 </button>
// //                 <button onClick={handleSolve} disabled={isLoading || isSolving} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400">
// //                   Solve
// //                 </button>
// //               </div>
// //             </div>

// //             <div>
// //               <h2 className="text-base sm:text-lg font-semibold mb-1.5 text-gray-700">Scramble Applied</h2>
// //               <div className="bg-gray-100 p-3 rounded-md min-h-[4.5rem] text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
// //                 {moveSequence || <span className="text-gray-400">N/A</span>}
// //               </div>
// //             </div>

// //             {solution && (
// //               <div className="border-t border-gray-200 pt-5 space-y-3">
// //                 <h2 className="text-base sm:text-lg font-semibold text-gray-700">Solution Steps</h2>
// //                 <div className="bg-gray-100 p-3 rounded-md min-h-[4.5rem] text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
// //                   {solution}
// //                 </div>
// //                 <div>
// //                   {(solution.split(' ').filter(m => m).length > 0) && (
// //                     <>
// //                       <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
// //                         <span className="font-medium text-gray-600">
// //                           Step {currentStep} of {solution.split(' ').filter(m => m).length}
// //                         </span>
// //                         {currentStep >= solution.split(' ').filter(m => m).length && (
// //                             <span className="text-green-600 font-semibold">Complete!</span>
// //                         )}
// //                       </div>
// //                       <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
// //                         <div
// //                           className="h-full bg-blue-500 transition-all duration-300 ease-out"
// //                           style={{ width: `${(currentStep / (solution.split(' ').filter(m => m).length || 1)) * 100}%` }}
// //                         ></div>
// //                       </div>
// //                     </>
// //                   )}
// //                 </div>
// //                 <div className="grid grid-cols-2 gap-3">
// //                   <button
// //                     onClick={executeSingleStep}
// //                     disabled={isLoading || isSolving || currentStep >= solution.split(' ').filter(m => m).length}
// //                     className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
// //                   >
// //                     Next Step
// //                   </button>
// //                   <button
// //                     onClick={executeAllSolutionSteps}
// //                     disabled={isLoading || isSolving || currentStep >= solution.split(' ').filter(m => m).length}
// //                     className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400"
// //                   >
// //                     Execute All
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       <footer className="bg-gray-800 text-gray-400 p-3 text-center text-xs sm:text-sm">
// //         Rubik's Cube Demo © {new Date().getFullYear()}
// //       </footer>
// //     </div>
// //   );
// // }

// // RubiksCubeSolver.jsx (formerly CubeControls.jsx)
// import React, { useRef, useState, useEffect } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// // --- Utility Functions ---
// const generateRandomState = () => {
//   const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
//   const modifiers = ["", "'", "2"];
//   const moves = [];
//   const numMoves = Math.floor(Math.random() * 12) + 8;
//   for (let i = 0; i < numMoves; i++) {
//     const face = faces[Math.floor(Math.random() * faces.length)];
//     const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
//     moves.push(face + modifier);
//   }
//   return moves.join(' ');
// };

// const getInverseMove = (move) => {
//   if (move.length === 0) return "";
//   if (move.endsWith("'")) {
//     return move.slice(0, -1);
//   } else if (move.endsWith("2")) {
//     return move;
//   } else {
//     return move + "'";
//   }
// };

// // DEMONSTRATION "SOLVER" - Reverses the scramble. NOT A REAL SOLVER.
// const solveCubeReverseScramble = (scrambleSequence) => {
//   console.log("Demo 'solving' by reversing scramble:", scrambleSequence);
//   if (!scrambleSequence) return Promise.resolve("");
//   const moves = scrambleSequence.split(' ').filter(m => m);
//   const inverseMoves = moves.map(getInverseMove).reverse();
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(inverseMoves.join(' '));
//     }, 100); // Shorter delay for demo
//   });
// };
// // --- End Utility Functions ---


// export default function RubiksCubeSolver() {
//   const mountRef = useRef(null);
//   const [scene, setScene] = useState(null);
//   // Removed camera and renderer from state as they are not used after being set in useEffect
//   const [cube, setCube] = useState(null); // THREE.Group for the Rubik's Cube

//   const [isLoading, setIsLoading] = useState(false);
//   const [isSolving, setIsSolving] = useState(false); // Kept for UI, even if solver is mock
//   const [moveSequence, setMoveSequence] = useState(''); // The scramble applied
//   const [solution, setSolution] = useState('');       // The "solution" to apply
//   const [currentStep, setCurrentStep] = useState(0);
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [colorMode, setColorMode] = useState('standard');

//   // Scene Setup Effect
//   useEffect(() => {
//     let currentMount = mountRef.current;
//     if (!currentMount) return;

//     console.log("Scene useEffect: Initializing...");
//     const newScene = new THREE.Scene();
//     newScene.background = new THREE.Color(0xf0f0f0);
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
//     newScene.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
//     directionalLight.position.set(5, 10, 7.5);
//     newScene.add(directionalLight);

//     const rect = currentMount.getBoundingClientRect();
//     const newCamera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 1000);
//     newCamera.position.set(6, 6, 9); // Adjusted camera position
//     newCamera.lookAt(0, 0, 0);

//     const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     newRenderer.setSize(rect.width, rect.height);
//     newRenderer.setPixelRatio(window.devicePixelRatio);
//     currentMount.appendChild(newRenderer.domElement);

//     const newControls = new OrbitControls(newCamera, newRenderer.domElement);
//     newControls.enableDamping = true;
//     newControls.dampingFactor = 0.05;
//     newControls.minDistance = 5;
//     newControls.maxDistance = 25;

//     setScene(newScene);

//     const handleResize = () => {
//       if (!currentMount || !newCamera || !newRenderer) return;
//       const resizeRect = currentMount.getBoundingClientRect();
//       newCamera.aspect = resizeRect.width / resizeRect.height;
//       newCamera.updateProjectionMatrix();
//       newRenderer.setSize(resizeRect.width, resizeRect.height);
//     };
//     window.addEventListener('resize', handleResize);

//     let animationFrameId;
//     const animate = () => {
//       animationFrameId = requestAnimationFrame(animate);
//       newControls.update();
//       newRenderer.render(newScene, newCamera);
//     };
//     animate();
//     console.log("Scene useEffect: Setup complete, animation started.");

//     return () => {
//       console.log("Scene useEffect: Cleaning up...");
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener('resize', handleResize);
//       newControls.dispose();
//       if (newRenderer.domElement && newRenderer.domElement.parentNode === currentMount) {
//         currentMount.removeChild(newRenderer.domElement);
//       }
//       newRenderer.dispose();
//       // newScene.clear(); // Consider if scene itself needs clearing of lights etc.
//       console.log("Scene useEffect: Cleanup finished.");
//     };
//   }, []); // Mount and unmount only

//   // Cube Creation Effect
//   useEffect(() => {
//     if (!scene) {
//       console.log("Cube useEffect: Waiting for scene...");
//       return;
//     }
//     console.log("Cube useEffect: Running. Color mode:", colorMode);

//     const newCubeGroup = new THREE.Group();
//     const standardColors = { front: 0xff0000, back: 0xffa500, up: 0xffffff, down: 0xffff00, right: 0x0000ff, left: 0x00ff00 };
//     const colorblindColors = { front: 0xff0000, back: 0x0080ff, up: 0xffffff, down: 0xffff00, right: 0x8000ff, left: 0x00cc00 };
//     const currentColors = colorMode === 'standard' ? standardColors : colorblindColors;
//     const innerColor = 0x202020;
//     const cubeletSize = 1;
//     const spacing = 0.07;

//     for (let x = -1; x <= 1; x++) {
//       for (let y = -1; y <= 1; y++) {
//         for (let z = -1; z <= 1; z++) {
//           const geometry = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);
//           const materials = [
//             new THREE.MeshStandardMaterial({ color: x === 1 ? currentColors.right : innerColor, roughness: 0.4, metalness: 0.0 }),
//             new THREE.MeshStandardMaterial({ color: x === -1 ? currentColors.left : innerColor, roughness: 0.4, metalness: 0.0 }),
//             new THREE.MeshStandardMaterial({ color: y === 1 ? currentColors.up : innerColor, roughness: 0.4, metalness: 0.0 }),
//             new THREE.MeshStandardMaterial({ color: y === -1 ? currentColors.down : innerColor, roughness: 0.4, metalness: 0.0 }),
//             new THREE.MeshStandardMaterial({ color: z === 1 ? currentColors.front : innerColor, roughness: 0.4, metalness: 0.0 }),
//             new THREE.MeshStandardMaterial({ color: z === -1 ? currentColors.back : innerColor, roughness: 0.4, metalness: 0.0 })
//           ];
//           const cubelet = new THREE.Mesh(geometry, materials);
//           cubelet.position.set(
//             x * (cubeletSize + spacing),
//             y * (cubeletSize + spacing),
//             z * (cubeletSize + spacing)
//           );
//           newCubeGroup.add(cubelet);
//         }
//       }
//     }
//     scene.add(newCubeGroup);
//     setCube(newCubeGroup);
//     console.log("Cube useEffect: New cube created and added to scene.");

//     return () => {
//       console.log("Cube useEffect: Cleanup for this instance.");
//       if (newCubeGroup && scene && newCubeGroup.parent === scene) {
//         scene.remove(newCubeGroup);
//         newCubeGroup.traverse(child => {
//           if (child.isMesh) {
//             if (child.geometry) child.geometry.dispose();
//             if (Array.isArray(child.material)) {
//               child.material.forEach(material => material.dispose());
//             } else if (child.material) {
//               child.material.dispose();
//             }
//           }
//         });
//         console.log("Cube useEffect: newCubeGroup instance removed/disposed.");
//       }
//     };
//   }, [scene, colorMode]);


//   const getFaceCubelets = (faceSymbol) => {
//     if (!cube) return [];
//     const faceCubelets = [];
//     const threshold = (1 * (1 + 0.07)) * 0.4;

//     cube.children.forEach(cubelet => {
//       if (!cubelet.isMesh) return;
//       const pos = cubelet.position;
//       switch (faceSymbol) {
//         case 'R': if (pos.x > threshold) faceCubelets.push(cubelet); break;
//         case 'L': if (pos.x < -threshold) faceCubelets.push(cubelet); break;
//         case 'U': if (pos.y > threshold) faceCubelets.push(cubelet); break;
//         case 'D': if (pos.y < -threshold) faceCubelets.push(cubelet); break;
//         case 'F': if (pos.z > threshold) faceCubelets.push(cubelet); break;
//         case 'B': if (pos.z < -threshold) faceCubelets.push(cubelet); break;
//         default: break;
//       }
//     });
//     return faceCubelets;
//   };

//   const rotateFace = async (move) => {
//     if (!cube || !scene || isLoading || isSolving) {
//       console.warn("rotateFace: Conditions not met.", { cube:!!cube, scene:!!scene, isLoading, isSolving });
//       return;
//     }
//     console.log(`Rotate Face: ${move}`);

//     let axisVector = new THREE.Vector3();
//     let angle = 0;
//     const prime = move.includes("'");
//     const double = move.includes("2");
//     const baseFace = move.charAt(0);

//     switch (baseFace) {
//       case 'R': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'L': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       case 'U': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'D': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       case 'F': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'B': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       default: console.warn(`Unknown move: ${move}`); return;
//     }

//     const selectedCubelets = getFaceCubelets(baseFace);
//     if (selectedCubelets.length === 0 && move.length > 0) { // check move.length to avoid warning on empty moves
//       console.warn(`No cubelets found for face ${baseFace}. Move: ${move}, Total children: ${cube.children.length}`);
//       return;
//     }
//     if(selectedCubelets.length === 0) return; // if move was empty or no cubelets

//     const pivot = new THREE.Object3D();
//     scene.add(pivot);

//     selectedCubelets.forEach(cubelet => {
//       pivot.attach(cubelet);
//     });

//     return new Promise(resolve => {
//       const initialPivotOrientation = new THREE.Quaternion();
//       const targetPivotOrientation = new THREE.Quaternion().setFromAxisAngle(axisVector.normalize(), angle);
//       const animationDuration = 200; // slightly faster
//       const startTime = Date.now();

//       const animateRotation = () => {
//         const elapsed = Date.now() - startTime;
//         let progress = Math.min(elapsed / animationDuration, 1);
//         progress = 1 - Math.pow(1 - progress, 3);

//         pivot.quaternion.slerpQuaternions(initialPivotOrientation, targetPivotOrientation, progress);

//         if (progress < 1) {
//           requestAnimationFrame(animateRotation);
//         } else {
//           pivot.quaternion.copy(targetPivotOrientation);
//           selectedCubelets.forEach(cubelet => {
//             cubelet.updateMatrixWorld(true);
//             cube.attach(cubelet);
//           });
//           scene.remove(pivot);
//           resolve();
//         }
//       };
//       animateRotation();
//     });
//   };

//   const handleScramble = async () => {
//     if (isLoading || isSolving) return;
//     console.log("Scrambling...");
//     setIsLoading(true);
//     setSolution(''); setCurrentStep(0); // Clear previous solution

//     // Optional: Reset cube to a visually "solved" state before scrambling IF you want scrambles to be from solved
//     // This is tricky if your internal LOGICAL state isn't also reset.
//     // For now, we assume the visual cube IS the state.
//     if (cube) {
//         // A simple way to reset rotations of all cubelets (doesn't reset to initial colored state)
//         // cube.children.forEach(c => { c.quaternion.identity(); c.position.copy(c.userData.initialPosition_IF_STORED) });
//         // For a full visual reset to solved, you'd rebuild the cube or have a dedicated reset function.
//         // The current structure rebuilds on colorMode change, which effectively resets.
//     }


//     const newScrambleSequence = generateRandomState();
//     setMoveSequence(newScrambleSequence);

//     if (cube) cube.quaternion.identity(); // Reset overall cube group rotation

//     const moves = newScrambleSequence.split(' ').filter(m => m);
//     for (const move of moves) {
//       await rotateFace(move);
//     }

//     setIsLoading(false);
//     console.log("Scramble complete:", newScrambleSequence);
//   };

//   const handleSolve = async () => {
//     if (isLoading || isSolving) return;
//     console.log("Solving...");
//     setIsSolving(true);
//     // setSolution(''); // Don't clear solution until new one is fetched
//     setCurrentStep(0);
//     try {
//       const currentLogicState = moveSequence; // This is the scramble sequence
      
//       // Replace this with a real solver call eventually
//       const solutionSequence = await solveCubeReverseScramble(currentLogicState); 
      
//       setSolution(solutionSequence);
//       // Optional: Reset visual cube to its state *before* the scramble if you are applying the solution from there
//       // Or, if solution is applied to current state, no need to reset overall cube.quaternion here.
//       // if (cube) cube.quaternion.identity(); // Maybe not needed if solution applies to current visual state
//       console.log("Demo 'solution' (reverse scramble) found:", solutionSequence);
//     } catch (error) {
//       console.error('Error solving cube:', error);
//       setSolution(''); // Clear solution on error
//     } finally {
//       setIsSolving(false);
//     }
//   };

//   const executeSingleStep = async () => {
//     if (!solution || isLoading || isSolving) return;
//     const moves = solution.split(' ').filter(m => m);
//     if (currentStep >= moves.length) return;

//     setIsLoading(true); // Use general isLoading for step execution
//     const currentMove = moves[currentStep];
//     await rotateFace(currentMove);
//     setCurrentStep(prev => prev + 1);
//     setIsLoading(false);
//   };

//   const executeAllSolutionSteps = async () => {
//     if (!solution || isLoading || isSolving) return;
//     const moves = solution.split(' ').filter(m => m);
//     if (currentStep >= moves.length) return;

//     setIsLoading(true); // Use general isLoading
//     let tempStep = currentStep; // Start from the current step
//     try {
//       while (tempStep < moves.length) {
//         const currentMove = moves[tempStep];
//         await rotateFace(currentMove);
//         tempStep++;
//         setCurrentStep(tempStep); // Update React state for progress bar
//         // await new Promise(res => setTimeout(res, 50)); // Optional small delay between moves
//       }
//       console.log("Finished executing all solution steps.");
//     } catch (error) {
//       console.error("Error during executeAllSolutionSteps:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleColorMode = () => {
//     if (isLoading || isSolving) {
//         console.warn("Cannot change color mode while an operation is in progress.");
//         return;
//     }
//     // Reset sequences when changing color mode, as it rebuilds the cube visually "solved"
//     setMoveSequence(''); 
//     setSolution('');
//     setCurrentStep(0);
//     setColorMode(prevMode => prevMode === 'standard' ? 'colorblind' : 'standard');
//   };

//   // JSX (no changes from your last provided good version)
//   return (
//     <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
//       {/* Header */}
//       <header className="bg-blue-600 text-white p-4 shadow-md">
//         <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-2">
//           <h1 className="text-xl sm:text-2xl font-bold">Interactive Rubik's Cube</h1>
//           <div className="flex items-center space-x-2 sm:space-x-4">
//             <button
//               onClick={() => setShowInstructions(!showInstructions)}
//               className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
//             >
//               {showInstructions ? 'Hide' : 'Show'} Instructions
//             </button>
//             <button
//               onClick={toggleColorMode}
//               disabled={isLoading || isSolving}
//               className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
//             >
//               {colorMode === 'standard' ? 'Colorblind Mode' : 'Standard Colors'}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Instructions Panel */}
//       {showInstructions && (
//         <div className="bg-white p-4 shadow-md border-b border-gray-200">
//           <div className="container mx-auto">
//             <h2 className="text-lg font-semibold mb-2 text-gray-700">How to Use:</h2>
//             <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-gray-600">
//               <li>Click and drag the cube to rotate your view.</li>
//               <li>Use mouse wheel to zoom in/out.</li>
//               <li><b>Scramble:</b> Applies a random sequence of moves to the cube.</li>
//               <li><b>Solve:</b> Gets a sequence to "undo" the scramble (demo).</li>
//               <li><b>Next Step / Execute All:</b> Animates the solution moves on the cube.</li>
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
//         {/* 3D Cube Container */}
//         <div className="flex-grow h-1/2 md:h-auto md:w-2/3 relative bg-gray-200">
//           <div ref={mountRef} className="w-full h-full"></div>
//           {(isLoading || isSolving) && (
//             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
//               <div className="bg-white p-5 sm:p-6 rounded-lg shadow-xl flex items-center space-x-3 sm:space-x-4">
//                 <div className={`animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 ${isSolving ? 'border-green-500' : 'border-blue-500'}`}></div>
//                 <p className="font-medium text-md sm:text-lg text-gray-700">
//                   {isSolving ? 'Processing...' : (isLoading ? (solution && currentStep < solution.split(' ').filter(m=>m).length ? 'Applying Moves...' : 'Scrambling...') : '')}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Controls Panel */}
//         <div className="bg-white w-full md:w-1/3 p-4 shadow-lg md:shadow-inner overflow-y-auto border-t md:border-t-0 md:border-l border-gray-300">
//           <div className="space-y-5">
//             <div>
//               <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Actions</h2>
//               <div className="grid grid-cols-2 gap-3">
//                 <button onClick={handleScramble} disabled={isLoading || isSolving} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400">
//                   Scramble
//                 </button>
//                 <button onClick={handleSolve} disabled={isLoading || isSolving || !moveSequence} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400">
//                   Solve (Undo Scramble)
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h2 className="text-base sm:text-lg font-semibold mb-1.5 text-gray-700">Scramble Applied</h2>
//               <div className="bg-gray-100 p-3 rounded-md min-h-[4.5rem] text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
//                 {moveSequence || <span className="text-gray-400">N/A</span>}
//               </div>
//             </div>

//             {solution && (
//               <div className="border-t border-gray-200 pt-5 space-y-3">
//                 <h2 className="text-base sm:text-lg font-semibold text-gray-700">Solution Steps</h2>
//                 <div className="bg-gray-100 p-3 rounded-md min-h-[4.5rem] text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
//                   {solution}
//                 </div>
//                 <div>
//                   {(solution.split(' ').filter(m => m).length > 0) && (
//                     <>
//                       <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
//                         <span className="font-medium text-gray-600">
//                           Step {currentStep} of {solution.split(' ').filter(m => m).length}
//                         </span>
//                         {currentStep >= solution.split(' ').filter(m => m).length && (
//                             <span className="text-green-600 font-semibold">Complete!</span>
//                         )}
//                       </div>
//                       <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
//                         <div
//                           className="h-full bg-blue-500 transition-all duration-300 ease-out"
//                           style={{ width: `${(currentStep / (Math.max(1,solution.split(' ').filter(m => m).length))) * 100}%` }} // Avoid division by zero
//                         ></div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={executeSingleStep}
//                     disabled={isLoading || isSolving || currentStep >= solution.split(' ').filter(m => m).length}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   >
//                     Next Step
//                   </button>
//                   <button
//                     onClick={executeAllSolutionSteps}
//                     disabled={isLoading || isSolving || currentStep >= solution.split(' ').filter(m => m).length}
//                     className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400"
//                   >
//                     Execute All
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <footer className="bg-gray-800 text-gray-400 p-3 text-center text-xs sm:text-sm">
//         Rubik's Cube Demo © {new Date().getFullYear()}
//       </footer>
//     </div>
//   );
// }

// RubiksCubeSolver.jsx (formerly CubeControls.jsx)
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// --- Utility Functions ---
const generateRandomState = () => {
  const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
  const modifiers = ["", "'", "2"];
  const moves = [];
  const numMoves = Math.floor(Math.random() * 12) + 8;
  for (let i = 0; i < numMoves; i++) {
    const face = faces[Math.floor(Math.random() * faces.length)];
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    moves.push(face + modifier);
  }
  return moves.join(' ');
};

const getInverseMove = (move) => {
  if (move.length === 0) return "";
  if (move.endsWith("'")) {
    return move.slice(0, -1);
  } else if (move.endsWith("2")) {
    return move;
  } else {
    return move + "'";
  }
};

// DEMONSTRATION "SOLVER" - Reverses the scramble. NOT A REAL SOLVER.
const solveCubeReverseScramble = (scrambleSequence) => {
  console.log("Demo 'solving' by reversing scramble:", scrambleSequence);
  if (!scrambleSequence) return Promise.resolve("");
  const moves = scrambleSequence.split(' ').filter(m => m);
  const inverseMoves = moves.map(getInverseMove).reverse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(inverseMoves.join(' '));
    }, 100); // Shorter delay for demo
  });
};
// --- End Utility Functions ---


export default function RubiksCubeSolver() {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  // Removed camera and renderer from state as they are not used after being set in useEffect
  const [cube, setCube] = useState(null); // THREE.Group for the Rubik's Cube

  const [isLoading, setIsLoading] = useState(false);
  const [isSolving, setIsSolving] = useState(false); // Kept for UI, even if solver is mock
  const [moveSequence, setMoveSequence] = useState(''); // The scramble applied
  const [solution, setSolution] = useState('');       // The "solution" to apply
  const [currentStep, setCurrentStep] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [colorMode, setColorMode] = useState('standard');

  // Scene Setup Effect
  useEffect(() => {
    let currentMount = mountRef.current;
    if (!currentMount) return;

    console.log("Scene useEffect: Initializing...");
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xf0f0f0);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    newScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 7.5);
    newScene.add(directionalLight);

    const rect = currentMount.getBoundingClientRect();
    const newCamera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 1000);
    newCamera.position.set(6, 6, 9); // Adjusted camera position
    newCamera.lookAt(0, 0, 0);

    const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    newRenderer.setSize(rect.width, rect.height);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(newRenderer.domElement);

    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.minDistance = 5;
    newControls.maxDistance = 25;

    setScene(newScene);

    const handleResize = () => {
      if (!currentMount || !newCamera || !newRenderer) return;
      const resizeRect = currentMount.getBoundingClientRect();
      newCamera.aspect = resizeRect.width / resizeRect.height;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(resizeRect.width, resizeRect.height);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      newControls.update();
      newRenderer.render(newScene, newCamera);
    };
    animate();
    console.log("Scene useEffect: Setup complete, animation started.");

    return () => {
      console.log("Scene useEffect: Cleaning up...");
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      newControls.dispose();
      if (newRenderer.domElement && newRenderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(newRenderer.domElement);
      }
      newRenderer.dispose();
      // newScene.clear(); // Consider if scene itself needs clearing of lights etc.
      console.log("Scene useEffect: Cleanup finished.");
    };
  }, []); // Mount and unmount only

  // Cube Creation Effect
  useEffect(() => {
    if (!scene) {
      console.log("Cube useEffect: Waiting for scene...");
      return;
    }
    console.log("Cube useEffect: Running. Color mode:", colorMode);

    const newCubeGroup = new THREE.Group();
    const standardColors = { front: 0xff0000, back: 0xffa500, up: 0xffffff, down: 0xffff00, right: 0x0000ff, left: 0x00ff00 };
    const colorblindColors = { front: 0xff0000, back: 0x0080ff, up: 0xffffff, down: 0xffff00, right: 0x8000ff, left: 0x00cc00 };
    const currentColors = colorMode === 'standard' ? standardColors : colorblindColors;
    const innerColor = 0x202020;
    const cubeletSize = 1;
    const spacing = 0.07;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geometry = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);
          const materials = [
            new THREE.MeshStandardMaterial({ color: x === 1 ? currentColors.right : innerColor, roughness: 0.4, metalness: 0.0 }),
            new THREE.MeshStandardMaterial({ color: x === -1 ? currentColors.left : innerColor, roughness: 0.4, metalness: 0.0 }),
            new THREE.MeshStandardMaterial({ color: y === 1 ? currentColors.up : innerColor, roughness: 0.4, metalness: 0.0 }),
            new THREE.MeshStandardMaterial({ color: y === -1 ? currentColors.down : innerColor, roughness: 0.4, metalness: 0.0 }),
            new THREE.MeshStandardMaterial({ color: z === 1 ? currentColors.front : innerColor, roughness: 0.4, metalness: 0.0 }),
            new THREE.MeshStandardMaterial({ color: z === -1 ? currentColors.back : innerColor, roughness: 0.4, metalness: 0.0 })
          ];
          const cubelet = new THREE.Mesh(geometry, materials);
          cubelet.position.set(
            x * (cubeletSize + spacing),
            y * (cubeletSize + spacing),
            z * (cubeletSize + spacing)
          );
          newCubeGroup.add(cubelet);
        }
      }
    }
    scene.add(newCubeGroup);
    setCube(newCubeGroup);
    console.log("Cube useEffect: New cube created and added to scene.");

    return () => {
      console.log("Cube useEffect: Cleanup for this instance.");
      if (newCubeGroup && scene && newCubeGroup.parent === scene) {
        scene.remove(newCubeGroup);
        newCubeGroup.traverse(child => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });
        console.log("Cube useEffect: newCubeGroup instance removed/disposed.");
      }
    };
  }, [scene, colorMode]);


  const getFaceCubelets = (faceSymbol) => {
    if (!cube) return [];
    const faceCubelets = [];
    const threshold = (1 * (1 + 0.07)) * 0.4;

    cube.children.forEach(cubelet => {
      if (!cubelet.isMesh) return;
      const pos = cubelet.position;
      switch (faceSymbol) {
        case 'R': if (pos.x > threshold) faceCubelets.push(cubelet); break;
        case 'L': if (pos.x < -threshold) faceCubelets.push(cubelet); break;
        case 'U': if (pos.y > threshold) faceCubelets.push(cubelet); break;
        case 'D': if (pos.y < -threshold) faceCubelets.push(cubelet); break;
        case 'F': if (pos.z > threshold) faceCubelets.push(cubelet); break;
        case 'B': if (pos.z < -threshold) faceCubelets.push(cubelet); break;
        default: break;
      }
    });
    return faceCubelets;
  };

  const rotateFace = async (move) => {
    if (!cube || !scene || isLoading || isSolving) {
      console.warn("rotateFace: Conditions not met.", { cube:!!cube, scene:!!scene, isLoading, isSolving });
      return;
    }
    console.log(`Rotate Face: ${move}`);

    let axisVector = new THREE.Vector3();
    let angle = 0;
    const prime = move.includes("'");
    const double = move.includes("2");
    const baseFace = move.charAt(0);

    switch (baseFace) {
      case 'R': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
      case 'L': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
      case 'U': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
      case 'D': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
      case 'F': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
      case 'B': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
      default: console.warn(`Unknown move: ${move}`); return;
    }

    const selectedCubelets = getFaceCubelets(baseFace);
    if (selectedCubelets.length === 0 && move.length > 0) { // check move.length to avoid warning on empty moves
      console.warn(`No cubelets found for face ${baseFace}. Move: ${move}, Total children: ${cube.children.length}`);
      return;
    }
    if(selectedCubelets.length === 0) return; // if move was empty or no cubelets

    const pivot = new THREE.Object3D();
    scene.add(pivot);

    selectedCubelets.forEach(cubelet => {
      pivot.attach(cubelet);
    });

    return new Promise(resolve => {
      const initialPivotOrientation = new THREE.Quaternion();
      const targetPivotOrientation = new THREE.Quaternion().setFromAxisAngle(axisVector.normalize(), angle);
      const animationDuration = 200; // slightly faster
      const startTime = Date.now();

      const animateRotation = () => {
        const elapsed = Date.now() - startTime;
        let progress = Math.min(elapsed / animationDuration, 1);
        progress = 1 - Math.pow(1 - progress, 3);

        pivot.quaternion.slerpQuaternions(initialPivotOrientation, targetPivotOrientation, progress);

        if (progress < 1) {
          requestAnimationFrame(animateRotation);
        } else {
          pivot.quaternion.copy(targetPivotOrientation);
          selectedCubelets.forEach(cubelet => {
            cubelet.updateMatrixWorld(true);
            cube.attach(cubelet);
          });
          scene.remove(pivot);
          resolve();
        }
      };
      animateRotation();
    });
  };

  const handleScramble = async () => {
    if (isLoading || isSolving) return;
    console.log("Scrambling...");
    setIsLoading(true);
    setSolution(''); setCurrentStep(0); // Clear previous solution

    // Optional: Reset cube to a visually "solved" state before scrambling IF you want scrambles to be from solved
    // This is tricky if your internal LOGICAL state isn't also reset.
    // For now, we assume the visual cube IS the state.
    if (cube) {
        // A simple way to reset rotations of all cubelets (doesn't reset to initial colored state)
        // cube.children.forEach(c => { c.quaternion.identity(); c.position.copy(c.userData.initialPosition_IF_STORED) });
        // For a full visual reset to solved, you'd rebuild the cube or have a dedicated reset function.
        // The current structure rebuilds on colorMode change, which effectively resets.
    }


    const newScrambleSequence = generateRandomState();
    setMoveSequence(newScrambleSequence);

    if (cube) cube.quaternion.identity(); // Reset overall cube group rotation

    const moves = newScrambleSequence.split(' ').filter(m => m);
    for (const move of moves) {
      await rotateFace(move);
    }

    setIsLoading(false);
    console.log("Scramble complete:", newScrambleSequence);
  };

  const handleSolve = async () => {
    if (isLoading || isSolving) return;
    console.log("Solving...");
    setIsSolving(true);
    // setSolution(''); // Don't clear solution until new one is fetched
    setCurrentStep(0);
    try {
      const currentLogicState = moveSequence; // This is the scramble sequence
      
      // Replace this with a real solver call eventually
      const solutionSequence = await solveCubeReverseScramble(currentLogicState); 
      
      setSolution(solutionSequence);
      // Optional: Reset visual cube to its state *before* the scramble if you are applying the solution from there
      // Or, if solution is applied to current state, no need to reset overall cube.quaternion here.
      // if (cube) cube.quaternion.identity(); // Maybe not needed if solution applies to current visual state
      console.log("Demo 'solution' (reverse scramble) found:", solutionSequence);
    } catch (error) {
      console.error('Error solving cube:', error);
      setSolution(''); // Clear solution on error
    } finally {
      setIsSolving(false);
    }
  };

  const executeSingleStep = async () => {
    if (!solution || isLoading || isSolving) return;
    const moves = solution.split(' ').filter(m => m);
    if (currentStep >= moves.length) return;

    setIsLoading(true); // Use general isLoading for step execution
    const currentMove = moves[currentStep];
    await rotateFace(currentMove);
    setCurrentStep(prev => prev + 1);
    setIsLoading(false);
  };

  const executeAllSolutionSteps = async () => {
    if (!solution || isLoading || isSolving) return;
    const moves = solution.split(' ').filter(m => m);
    if (currentStep >= moves.length) return;

    setIsLoading(true); // Use general isLoading
    let tempStep = currentStep; // Start from the current step
    try {
      while (tempStep < moves.length) {
        const currentMove = moves[tempStep];
        await rotateFace(currentMove);
        tempStep++;
        setCurrentStep(tempStep); // Update React state for progress bar
        // await new Promise(res => setTimeout(res, 50)); // Optional small delay between moves
      }
      console.log("Finished executing all solution steps.");
    } catch (error) {
      console.error("Error during executeAllSolutionSteps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleColorMode = () => {
    if (isLoading || isSolving) {
        console.warn("Cannot change color mode while an operation is in progress.");
        return;
    }
    // Reset sequences when changing color mode, as it rebuilds the cube visually "solved"
    setMoveSequence(''); 
    setSolution('');
    setCurrentStep(0);
    setColorMode(prevMode => prevMode === 'standard' ? 'colorblind' : 'standard');
  };

  // JSX (no changes from your last provided good version)
  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
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
              onClick={toggleColorMode}
              disabled={isLoading || isSolving}
              className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {colorMode === 'standard' ? 'Colorblind Mode' : 'Standard Colors'}
            </button>
          </div>
        </div>
      </header>

      {/* Instructions Panel */}
      {showInstructions && (
        <div className="bg-white p-4 shadow-md border-b border-gray-200">
          <div className="container mx-auto">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">How to Use:</h2>
            <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-gray-600">
              <li>Click and drag the cube to rotate your view.</li>
              <li>Use mouse wheel to zoom in/out.</li>
              <li><b>Scramble:</b> Applies a random sequence of moves to the cube.</li>
              <li><b>Solve:</b> Gets a sequence to "undo" the scramble (demo).</li>
              <li><b>Next Step / Execute All:</b> Animates the solution moves on the cube.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* 3D Cube Container */}
        <div className="flex-grow h-1/2 md:h-auto md:w-2/3 relative bg-gray-200">
          <div ref={mountRef} className="w-full h-full"></div>
          {(isLoading || isSolving) && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-white p-5 sm:p-6 rounded-lg shadow-xl flex items-center space-x-3 sm:space-x-4">
                <div className={`animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 ${isSolving ? 'border-green-500' : 'border-blue-500'}`}></div>
                <p className="font-medium text-md sm:text-lg text-gray-700">
                  {isSolving ? 'Processing...' : (isLoading ? (solution && currentStep < solution.split(' ').filter(m=>m).length ? 'Applying Moves...' : 'Scrambling...') : '')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="bg-white w-full md:w-1/3 p-4 shadow-lg md:shadow-inner overflow-y-auto border-t md:border-t-0 md:border-l border-gray-300">
          <div className="space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Actions</h2>
              {/* MODIFIED LINE BELOW */}
              <div className="grid grid-cols-1 gap-3"> 
                <button onClick={handleScramble} disabled={isLoading || isSolving} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  Scramble
                </button>
                <button onClick={handleSolve} disabled={isLoading || isSolving || !moveSequence} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400">
                  Solve (Undo Scramble)
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-1.5 text-gray-700">Scramble Applied</h2>
              <div className="bg-gray-100 p-3 rounded-md min-h-[4.5rem] text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
                {moveSequence || <span className="text-gray-400">N/A</span>}
              </div>
            </div>

            {solution && (
              <div className="border-t border-gray-200 pt-5 space-y-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700">Solution Steps</h2>
                <div className="bg-gray-100 p-3 rounded-md min-h-[4.5rem] text-xs sm:text-sm font-mono break-words text-gray-600 shadow-sm">
                  {solution}
                </div>
                <div>
                  {(solution.split(' ').filter(m => m).length > 0) && (
                    <>
                      <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
                        <span className="font-medium text-gray-600">
                          Step {currentStep} of {solution.split(' ').filter(m => m).length}
                        </span>
                        {currentStep >= solution.split(' ').filter(m => m).length && (
                            <span className="text-green-600 font-semibold">Complete!</span>
                        )}
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300 ease-out"
                          style={{ width: `${(currentStep / (Math.max(1,solution.split(' ').filter(m => m).length))) * 100}%` }} // Avoid division by zero
                        ></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={executeSingleStep}
                    disabled={isLoading || isSolving || currentStep >= solution.split(' ').filter(m => m).length}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Next Step
                  </button>
                  <button
                    onClick={executeAllSolutionSteps}
                    disabled={isLoading || isSolving || currentStep >= solution.split(' ').filter(m => m).length}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    Execute All
                  </button>
                </div>
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
}