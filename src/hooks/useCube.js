// import { useState, useEffect, useRef, useCallback } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import RubiksCubeLogic, { faceColors } from '../models/RubiksCube'; // Check path

// // Constants
// const CUBELET_SIZE = 0.95;
// const CUBELET_SPACING = 1.0;

// // Helper function to create the visual representation of the cube
// const createVisualCube = (logicCube) => {
//   console.log('[useCube] createVisualCube running...');
//   if (!logicCube) { // Check if logic cube exists
//       console.error("[useCube] createVisualCube: logicCube input is null/undefined!");
//       return undefined; // Return undefined explicitly if input is bad
//   }

//   const group = new THREE.Group();
//   const materials = { /* ... same materials definition ... */
//     R: new THREE.MeshStandardMaterial({ color: faceColors.R, side: THREE.FrontSide }), L: new THREE.MeshStandardMaterial({ color: faceColors.L, side: THREE.FrontSide }),
//     U: new THREE.MeshStandardMaterial({ color: faceColors.U, side: THREE.FrontSide }), D: new THREE.MeshStandardMaterial({ color: faceColors.D, side: THREE.FrontSide }),
//     F: new THREE.MeshStandardMaterial({ color: faceColors.F, side: THREE.FrontSide }), B: new THREE.MeshStandardMaterial({ color: faceColors.B, side: THREE.FrontSide }),
//     Inside: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, side: THREE.FrontSide }),
//   };

//   for (let x = -1; x <= 1; x++) {
//     for (let y = -1; y <= 1; y++) {
//       for (let z = -1; z <= 1; z++) {
//         if (x === 0 && y === 0 && z === 0) continue;
//         const geometry = new THREE.BoxGeometry(CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE);
//         const cubeletMaterials = [
//           x === 1 ? materials.R : materials.Inside, x === -1 ? materials.L : materials.Inside,
//           y === 1 ? materials.U : materials.Inside, y === -1 ? materials.D : materials.Inside,
//           z === 1 ? materials.F : materials.Inside, z === -1 ? materials.B : materials.Inside,
//         ];
//         const cubelet = new THREE.Mesh(geometry, cubeletMaterials);
//         cubelet.position.set(x * CUBELET_SPACING, y * CUBELET_SPACING, z * CUBELET_SPACING);
//         cubelet.userData = { initialX: x, initialY: y, initialZ: z, currentPos: { x, y, z } };
//         group.add(cubelet);
//       }
//     }
//   }
//   console.log('[useCube] createVisualCube finished, returning group:', group); // Log before returning
//   return group; // Ensure group is returned
// };


// // --- The Hook ---
// const useCube = () => {
//   const containerRef = useRef(null);
//   const rendererRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const visualCubeGroupRef = useRef(null);
//   const logicCubeRef = useRef(new RubiksCubeLogic());
//   const frameIdRef = useRef(null);

//   const [cubeState, setCubeState] = useState(() => logicCubeRef.current.getCubeState());
//   const [isSolvedState, setIsSolvedState] = useState(() => logicCubeRef.current.isSolved());

//   const updateVisuals = useCallback((group, state) => { /* Needs implementation */ }, []);

//   const initScene = useCallback(() => {
//     let currentContainer = containerRef.current;
//     if (!currentContainer) { console.error('[useCube] initScene: containerRef is null!'); return () => {}; }
//     console.log(`[useCube] initScene running. Container: ${currentContainer.tagName}, Dimensions: ${currentContainer.clientWidth}x${currentContainer.clientHeight}`);

//     try {
//       const width = currentContainer.clientWidth; const height = currentContainer.clientHeight;
//       const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf0f0f0); sceneRef.current = scene;
//       const camera = new THREE.PerspectiveCamera(45, width > 0 && height > 0 ? width / height : 1, 0.1, 100); camera.position.set(5, 6, 7); camera.lookAt(0, 0, 0); cameraRef.current = camera;
//       const renderer = new THREE.WebGLRenderer({ antialias: true }); if (width > 0 && height > 0) renderer.setSize(width, height); renderer.setPixelRatio(window.devicePixelRatio); rendererRef.current = renderer; currentContainer.appendChild(renderer.domElement);
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); scene.add(ambientLight); const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); directionalLight.position.set(5, 10, 7); scene.add(directionalLight);

//       const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.1; controls.minDistance = 4; controls.maxDistance = 20; controls.target.set(0, 0, 0);
//       controlsRef.current = controls;

//       // --- ADD LOGGING AND CHECK BEFORE ADDING CUBE ---
//       console.log('[useCube] Calling createVisualCube...');
//       const visualCubeGroup = createVisualCube(logicCubeRef.current);
//       console.log('[useCube] visualCubeGroup returned from createVisualCube:', visualCubeGroup);

//       // Check if it's a valid Object3D before adding
//       if (visualCubeGroup instanceof THREE.Object3D) {
//         scene.add(visualCubeGroup);
//         visualCubeGroupRef.current = visualCubeGroup; // Store ref only if valid
//         console.log('[useCube] Visual cube added to scene successfully.');
//         updateVisuals(visualCubeGroup, logicCubeRef.current.getCubeState()); // Initial update
//       } else {
//         // Log an error if it's not valid - this helps diagnose the invisible cube
//         console.error('[useCube] FAILED TO ADD CUBE TO SCENE: createVisualCube returned invalid object!', visualCubeGroup);
//       }
//       // --- END LOGGING AND CHECK ---


//       let isActive = true;
//       const animate = () => {
//         if (!isActive) return;
//         frameIdRef.current = requestAnimationFrame(animate);

//         // --- FIX no-unused-expressions ---
//         // Explicitly check controls before updating
//         if (controlsRef.current) {
//           controlsRef.current.update();
//         }
//         // --- END FIX ---

//         if (rendererRef.current && sceneRef.current && cameraRef.current) {
//           rendererRef.current.render(sceneRef.current, cameraRef.current);
//         }
//       };
//       animate();

//       const handleResize = () => { /* ... */ }; window.addEventListener('resize', handleResize); handleResize();

//       // Cleanup function
//       return () => {
//         console.log('[useCube] Running cleanup...');
//         isActive = false;
//         window.removeEventListener('resize', handleResize);
//         if (frameIdRef.current) { cancelAnimationFrame(frameIdRef.current); frameIdRef.current = null; }
//         if (controlsRef.current) { controlsRef.current.dispose(); } // Check before dispose
//         // if (visualCubeGroupRef.current && sceneRef.current) { sceneRef.current.remove(visualCubeGroupRef.current); /* dispose children */ } // Use ref for removal
//         if (rendererRef.current) {
//           rendererRef.current.dispose();
//           if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode === currentContainer) {
//             currentContainer.removeChild(rendererRef.current.domElement);
//           }
//         }
//         console.log("[useCube] Cleanup finished.");
//       };

//     } catch (error) {
//       console.error('[useCube] Error during initScene:', error);
//       return () => {}; // Return empty cleanup on error
//     }
//      // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [updateVisuals]); // Keep dependency minimal

//   useEffect(() => { const cleanup = initScene(); return cleanup; }, [initScene]);

//   // --- Action Functions --- (No changes needed here)
//   const applyMove = useCallback((move) => { /* ... */ }, [updateVisuals]);
//   const resetCube = useCallback(() => { /* ... */ }, [updateVisuals]);
//   const scrambleCube = useCallback(() => { /* ... */ }, [updateVisuals]);
//   const getStateString = useCallback(() => { /* ... */ }, []);

//   return { containerRef, cubeState, isSolved: isSolvedState, resetCube, applyMove, scrambleCube, getStateString };
// };

// export default useCube;




// // src/hooks/useCube.js
// import { useState, useEffect, useRef, useCallback } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import RubiksCubeLogic, { faceColors } from '../models/RubiksCube'; // Check path

// // Constants
// const CUBELET_SIZE = 0.95;
// const CUBELET_SPACING = 1.0;

// // Helper to create the visual cube (remains mostly the same)
// const createVisualCube = (logicCube) => {
//   // console.log('[useCube] createVisualCube running...'); // Keep for debugging if needed
//   if (!logicCube) {
//       console.error("[useCube] createVisualCube: logicCube input is null/undefined!");
//       return undefined;
//   }

//   const group = new THREE.Group();
//   const materials = {
//     R: new THREE.MeshStandardMaterial({ color: faceColors.R, side: THREE.FrontSide, name: 'R_material' }),
//     L: new THREE.MeshStandardMaterial({ color: faceColors.L, side: THREE.FrontSide, name: 'L_material' }),
//     U: new THREE.MeshStandardMaterial({ color: faceColors.U, side: THREE.FrontSide, name: 'U_material' }),
//     D: new THREE.MeshStandardMaterial({ color: faceColors.D, side: THREE.FrontSide, name: 'D_material' }),
//     F: new THREE.MeshStandardMaterial({ color: faceColors.F, side: THREE.FrontSide, name: 'F_material' }),
//     B: new THREE.MeshStandardMaterial({ color: faceColors.B, side: THREE.FrontSide, name: 'B_material' }),
//     Inside: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, side: THREE.FrontSide, name: 'Inside_material' }),
//   };

//   for (let x = -1; x <= 1; x++) {
//     for (let y = -1; y <= 1; y++) {
//       for (let z = -1; z <= 1; z++) {
//         if (x === 0 && y === 0 && z === 0) continue; // Skip center invisible piece
//         const geometry = new THREE.BoxGeometry(CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE);
//         const cubeletMaterials = [
//           x === 1 ? materials.R : materials.Inside, x === -1 ? materials.L : materials.Inside,
//           y === 1 ? materials.U : materials.Inside, y === -1 ? materials.D : materials.Inside,
//           z === 1 ? materials.F : materials.Inside, z === -1 ? materials.B : materials.Inside,
//         ];
//         const cubelet = new THREE.Mesh(geometry, cubeletMaterials);
//         cubelet.position.set(x * CUBELET_SPACING, y * CUBELET_SPACING, z * CUBELET_SPACING);
//         // Store original logical position for reference after rotations
//         cubelet.userData = { initialX: x, initialY: y, initialZ: z, currentPos: { x, y, z } };
//         group.add(cubelet);
//       }
//     }
//   }
//   // console.log('[useCube] createVisualCube finished, returning group:', group);
//   return group;
// };


// // --- The Hook ---
// const useCube = ( // Add callbacks for isLoading and potentially isSolving from parent
//     setIsLoadingCallback // Function to set loading state in Solver.jsx
// ) => {
//   const containerRef = useRef(null);
//   const rendererRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null); // OrbitControls
//   const visualCubeGroupRef = useRef(null); // The THREE.Group of cubelets
//   const logicCubeRef = useRef(new RubiksCubeLogic());
//   const frameIdRef = useRef(null);

//   // For mouse interaction
//   const raycasterRef = useRef(new THREE.Raycaster());
//   const mouseNDCRef = useRef(new THREE.Vector2());
//   const dragStateRef = useRef({
//     isDraggingFace: false,
//     startPointerScreenPos: new THREE.Vector2(),
//     intersectedCubelet: null,
//     intersectedFaceLocalNormal: null,
//     moveExecutedInDrag: false,
//     originalOrbitControlsEnabled: true,
//   });

//   const [cubeState, setCubeState] = useState(() => logicCubeRef.current.getCubeState());
//   const [isSolvedState, setIsSolvedState] = useState(() => logicCubeRef.current.isSolved());
//   const [currentColorMode, setCurrentColorMode] = useState('standard'); // For potential color changes

//   // --- Visual Update ---
//   // This function will re-color the cubelets based on the logicCubeRef's state.
//   // This is crucial if your RubiksCubeLogic model changes internal sticker colors.
//   // For now, we'll assume createVisualCube handles initial colors based on 'faceColors'.
//   // If you implement color editing, this function will need to be more sophisticated.
//   const updateVisuals = useCallback(() => {
//     if (!visualCubeGroupRef.current || !logicCubeRef.current) return;
    
//     // For now, a full rebuild on color mode change. Simpler than recoloring each sticker individually
//     // based on a complex mapping if the logical state is also rebuilt.
//     if (sceneRef.current && visualCubeGroupRef.current) {
//         sceneRef.current.remove(visualCubeGroupRef.current);
//         visualCubeGroupRef.current.traverse(child => {
//             if (child.isMesh) {
//                 if (child.geometry) child.geometry.dispose();
//                 if (Array.isArray(child.material)) {
//                     child.material.forEach(material => material.dispose());
//                 } else if (child.material) {
//                     child.material.dispose();
//                 }
//             }
//         });
//     }
//     const newVisualCube = createVisualCube(logicCubeRef.current); // Recreate with potentially new faceColors if currentColorMode affects it
//     if (newVisualCube instanceof THREE.Object3D && sceneRef.current) {
//         sceneRef.current.add(newVisualCube);
//         visualCubeGroupRef.current = newVisualCube;
//     }
//     setCubeState(logicCubeRef.current.getCubeState());
//     setIsSolvedState(logicCubeRef.current.isSolved());
//   }, [currentColorMode]); // Re-run if color mode changes and requires a visual rebuild

//   // --- Get Cubelets for a Face (for rotation) ---
//   const getFaceCubelets = useCallback((faceSymbol) => {
//     if (!visualCubeGroupRef.current) return [];
//     const faceCubelets = [];
//     // Use a small epsilon for float comparisons if positions change slightly
//     const threshold = (CUBELET_SIZE / 2) + (CUBELET_SPACING - CUBELET_SIZE) / 2 - 0.1;


//     visualCubeGroupRef.current.children.forEach(cubelet => {
//       if (!cubelet.isMesh) return;
//       // Get world position to account for any group transforms, though cube group itself is at origin
//       const worldPos = cubelet.getWorldPosition(new THREE.Vector3());

//       switch (faceSymbol) {
//         case 'R': if (worldPos.x > threshold) faceCubelets.push(cubelet); break;
//         case 'L': if (worldPos.x < -threshold) faceCubelets.push(cubelet); break;
//         case 'U': if (worldPos.y > threshold) faceCubelets.push(cubelet); break;
//         case 'D': if (worldPos.y < -threshold) faceCubelets.push(cubelet); break;
//         case 'F': if (worldPos.z > threshold) faceCubelets.push(cubelet); break;
//         case 'B': if (worldPos.z < -threshold) faceCubelets.push(cubelet); break;
//         default: break;
//       }
//     });
//     return faceCubelets;
//   }, []);


//   // --- Rotate Face Logic (adapted from RubiksCubeSolver.jsx) ---
//   const performVisualRotation = useCallback(async (move) => {
//     if (!visualCubeGroupRef.current || !sceneRef.current ) {
//       console.warn("rotateFace: Visuals not ready.");
//       return;
//     }
//     if (!move || move.length === 0) {
//       console.warn("rotateFace: Empty move received.");
//       return;
//     }
//     // console.log(`[useCube] Visual Rotate: ${move}`);

//     let axisVector = new THREE.Vector3();
//     let angle = 0;
//     const prime = move.includes("'");
//     const double = move.includes("2");
//     const baseFace = move.charAt(0).toUpperCase();

//     switch (baseFace) {
//       case 'R': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'L': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       case 'U': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'D': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       case 'F': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'B': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       default: console.warn(`[useCube] Unknown move base: ${baseFace} in move: ${move}`); return;
//     }

//     const selectedCubelets = getFaceCubelets(baseFace);
//     if (selectedCubelets.length === 0) {
//       // console.warn(`[useCube] No visual cubelets found for face ${baseFace}. Move: ${move}`);
//       return; // Can happen if called before cube fully initialized or with bad move
//     }

//     const pivot = new THREE.Object3D();
//     sceneRef.current.add(pivot);
//     selectedCubelets.forEach(cubelet => pivot.attach(cubelet)); // Preserves world transform

//     return new Promise(resolve => {
//       const initialPivotOrientation = new THREE.Quaternion(); // Pivot starts at identity
//       const targetPivotOrientation = new THREE.Quaternion().setFromAxisAngle(axisVector.normalize(), angle);
//       const animationDuration = 200; // ms
//       const startTime = Date.now();

//       const animateRotation = () => {
//         const elapsed = Date.now() - startTime;
//         let progress = Math.min(elapsed / animationDuration, 1);
//         progress = 1 - Math.pow(1 - progress, 3); // EaseOutCubic
//         pivot.quaternion.slerpQuaternions(initialPivotOrientation, targetPivotOrientation, progress);

//         if (progress < 1) {
//           requestAnimationFrame(animateRotation);
//         } else {
//           pivot.quaternion.copy(targetPivotOrientation); // Ensure exact final state
//           selectedCubelets.forEach(cubelet => {
//             cubelet.updateMatrixWorld(true); // Update world matrix based on pivot's transformation
//             visualCubeGroupRef.current.attach(cubelet); // Re-attach to main cube group, preserving new world transform
//           });
//           sceneRef.current.remove(pivot);
//           pivot.clear(); // Dispose of pivot object
//           resolve();
//         }
//       };
//       animateRotation();
//     });
//   }, [getFaceCubelets]);


//   // --- Main Scene Initialization and Animation Loop ---
//   const initScene = useCallback(() => {
//     let currentContainer = containerRef.current;
//     if (!currentContainer) { /* console.error('[useCube] initScene: containerRef is null!'); */ return () => {}; }
//     // console.log(`[useCube] initScene running. Container: ${currentContainer.tagName}, Dimensions: ${currentContainer.clientWidth}x${currentContainer.clientHeight}`);

//     try {
//       const width = currentContainer.clientWidth; const height = currentContainer.clientHeight;
//       const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf0f0f0); sceneRef.current = scene;
//       const camera = new THREE.PerspectiveCamera(45, width > 0 && height > 0 ? width / height : 1, 0.1, 100); camera.position.set(5, 6, 7); camera.lookAt(0, 0, 0); cameraRef.current = camera;
      
//       // Check if renderer already exists from a previous init (e.g. strict mode double invoke)
//       if (rendererRef.current && rendererRef.current.domElement.parentElement === currentContainer) {
//         currentContainer.removeChild(rendererRef.current.domElement);
//         rendererRef.current.dispose();
//       }
//       const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha for potential bg transparency
//       if (width > 0 && height > 0) renderer.setSize(width, height); renderer.setPixelRatio(window.devicePixelRatio); rendererRef.current = renderer; currentContainer.appendChild(renderer.domElement);
      
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); scene.add(ambientLight); const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); directionalLight.position.set(5, 10, 7); scene.add(directionalLight);

//       // Check if controls already exist
//       if (controlsRef.current) {
//         controlsRef.current.dispose();
//       }
//       const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.05; controls.minDistance = 4; controls.maxDistance = 20; controls.target.set(0, 0, 0);
//       controlsRef.current = controls;

//       // Remove old visual cube if it exists
//       if (visualCubeGroupRef.current && sceneRef.current.children.includes(visualCubeGroupRef.current)) {
//           sceneRef.current.remove(visualCubeGroupRef.current);
//           visualCubeGroupRef.current.traverse(child => { /* dispose geometry/material */ });
//       }
//       const visualCubeGroup = createVisualCube(logicCubeRef.current);
//       if (visualCubeGroup instanceof THREE.Object3D) {
//         scene.add(visualCubeGroup);
//         visualCubeGroupRef.current = visualCubeGroup;
//         // updateVisuals(); // Initial state is set by createVisualCube based on logicCube
//       } else {
//         console.error('[useCube] FAILED TO ADD CUBE TO SCENE: createVisualCube returned invalid object!', visualCubeGroup);
//       }

//       let isActive = true;
//       const animate = () => {
//         if (!isActive || !frameIdRef) return; // Check frameIdRef itself if it's nullified in cleanup
//         frameIdRef.current = requestAnimationFrame(animate);
//         if (controlsRef.current) controlsRef.current.update();
//         if (rendererRef.current && sceneRef.current && cameraRef.current) {
//           rendererRef.current.render(sceneRef.current, cameraRef.current);
//         }
//       };
//       if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current); // Clear any old animation frame
//       animate();

//       const handleResize = () => {
//           if(!currentContainer || !cameraRef.current || !rendererRef.current) return;
//           const newWidth = currentContainer.clientWidth;
//           const newHeight = currentContainer.clientHeight;
//           if (newWidth > 0 && newHeight > 0) {
//             cameraRef.current.aspect = newWidth / newHeight;
//             cameraRef.current.updateProjectionMatrix();
//             rendererRef.current.setSize(newWidth, newHeight);
//           }
//       };
//       window.addEventListener('resize', handleResize);
//       handleResize(); // Initial size set

//       return () => {
//         // console.log('[useCube] Running cleanup...');
//         isActive = false;
//         window.removeEventListener('resize', handleResize);
//         if (frameIdRef.current) { cancelAnimationFrame(frameIdRef.current); frameIdRef.current = null; }
//         if (controlsRef.current) { controlsRef.current.dispose(); controlsRef.current = null; }
//         if (visualCubeGroupRef.current && sceneRef.current) {
//             sceneRef.current.remove(visualCubeGroupRef.current);
//             visualCubeGroupRef.current.traverse(child => {
//                 if (child.isMesh) {
//                     if (child.geometry) child.geometry.dispose();
//                     if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
//                     else if (child.material) child.material.dispose();
//                 }
//             });
//             visualCubeGroupRef.current = null;
//         }
//         if (rendererRef.current) {
//           if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode === currentContainer) {
//             currentContainer.removeChild(rendererRef.current.domElement);
//           }
//           rendererRef.current.dispose();
//           rendererRef.current = null;
//         }
//         if (sceneRef.current) {
//             // Dispose lights, etc. if necessary, or clear the scene
//             while(sceneRef.current.children.length > 0){
//                 sceneRef.current.remove(sceneRef.current.children[0]);
//             }
//             sceneRef.current = null;
//         }
//         cameraRef.current = null;
//         // console.log("[useCube] Cleanup finished.");
//       };
//     } catch (error) {
//       console.error('[useCube] Error during initScene:', error);
//       return () => {};
//     }
//   }, []); // Removed updateVisuals from deps, it's called explicitly or by colorMode

//   useEffect(() => {
//     const cleanup = initScene();
//     return cleanup;
//   }, [initScene]); // Rerun initScene if its definition changes (which it shouldn't often)

//   // --- Mouse Interaction Logic (Integrated) ---
//   useEffect(() => {
//     const domElement = rendererRef.current?.domElement;
//     if (!domElement || !visualCubeGroupRef.current || !cameraRef.current || !controlsRef.current || !sceneRef.current) return;
//     // console.log('[useCube] Attaching pointer event listeners.');

//     const handlePointerDown = async (event) => {
//       if (dragStateRef.current.isDraggingFace || (setIsLoadingCallback && typeof setIsLoadingCallback === 'function' && setIsLoadingCallback(null, true) /* check if already loading */)) return;

//       const rect = domElement.getBoundingClientRect();
//       mouseNDCRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       mouseNDCRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

//       raycasterRef.current.setFromCamera(mouseNDCRef.current, cameraRef.current);
//       const intersects = raycasterRef.current.intersectObjects(visualCubeGroupRef.current.children, true); // Recursive true

//       if (intersects.length > 0) {
//         const intersection = intersects[0];
//         if (intersection.object.isMesh) {
//           dragStateRef.current.isDraggingFace = true;
//           dragStateRef.current.startPointerScreenPos.set(event.clientX, event.clientY);
//           dragStateRef.current.intersectedCubelet = intersection.object;
//           dragStateRef.current.intersectedFaceLocalNormal = intersection.face.normal.clone();
//           dragStateRef.current.moveExecutedInDrag = false;
          
//           if (controlsRef.current) {
//             dragStateRef.current.originalOrbitControlsEnabled = controlsRef.current.enabled;
//             controlsRef.current.enabled = false; // Disable orbit controls during face drag
//           }
//         }
//       }
//     };

//     const handlePointerMove = async (event) => {
//       const dragState = dragStateRef.current;
//       if (!dragState.isDraggingFace || dragState.moveExecutedInDrag || (setIsLoadingCallback && typeof setIsLoadingCallback === 'function' && setIsLoadingCallback(null, true))) {
//         return;
//       }

//       const deltaX = event.clientX - dragState.startPointerScreenPos.x;
//       const deltaY = event.clientY - dragState.startPointerScreenPos.y;
//       const dragThreshold = 10; // pixels

//       if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
//         dragState.moveExecutedInDrag = true;

//         const { intersectedCubelet, intersectedFaceLocalNormal } = dragState;
//         if (!intersectedCubelet || !intersectedFaceLocalNormal) return;

//         const cubeletWorldQuaternion = intersectedCubelet.getWorldQuaternion(new THREE.Quaternion());
//         const worldStickerNormal = intersectedFaceLocalNormal.clone().applyQuaternion(cubeletWorldQuaternion).round();

//         let stickerMainAxisIndex = 0;
//         if (Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.x) && Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.z)) stickerMainAxisIndex = 1;
//         else if (Math.abs(worldStickerNormal.z) > Math.abs(worldStickerNormal.x)) stickerMainAxisIndex = 2;

//         const horizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);
//         let moveChar = '';
//         let directionSign = 1;
        
//         const cubeletPos = intersectedCubelet.getWorldPosition(new THREE.Vector3()); // Use world pos for consistency
//         const facePosThreshold = CUBELET_SPACING * 0.5; // Half of spacing

//         // This logic needs to be robust, might need refinement
//         if (stickerMainAxisIndex === 0) { // R/L sticker
//             if (horizontalDrag) {
//                 moveChar = worldStickerNormal.x > 0 ? (deltaX > 0 ? 'B' : 'F') : (deltaX > 0 ? 'F' : 'B');
//                 directionSign = worldStickerNormal.x * deltaX > 0 ? 1 : -1;
//                  if (cubeletPos.y > facePosThreshold) moveChar = 'U'; else if (cubeletPos.y < -facePosThreshold) moveChar = 'D'; else moveChar = ''; // Slice move instead
//                  directionSign = (deltaX * worldStickerNormal.x > 0) ? -1 : 1;

//             } else {
//                 moveChar = worldStickerNormal.x > 0 ? (deltaY > 0 ? 'D' : 'U') : (deltaY > 0 ? 'U' : 'D');
//                 directionSign = worldStickerNormal.x * deltaY < 0 ? 1 : -1;
//                  if (cubeletPos.z > facePosThreshold) moveChar = 'F'; else if (cubeletPos.z < -facePosThreshold) moveChar = 'B'; else moveChar = ''; // Slice
//                  directionSign = (deltaY * worldStickerNormal.x < 0) ? -1 : 1;
//             }
//         } else if (stickerMainAxisIndex === 1) { // U/D sticker
//             if (horizontalDrag) {
//                 moveChar = worldStickerNormal.y > 0 ? (deltaX > 0 ? 'L' : 'R') : (deltaX > 0 ? 'R' : 'L');
//                 directionSign = worldStickerNormal.y * deltaX < 0 ? 1 : -1;
//                  if (cubeletPos.z > facePosThreshold) moveChar = 'F'; else if (cubeletPos.z < -facePosThreshold) moveChar = 'B'; else moveChar = '';
//                  directionSign = (deltaX * worldStickerNormal.y < 0) ? -1 : 1;
//             } else {
//                 moveChar = worldStickerNormal.y > 0 ? (deltaY > 0 ? 'F' : 'B') : (deltaY > 0 ? 'B' : 'F');
//                 directionSign = worldStickerNormal.y * deltaY > 0 ? 1 : -1;
//                  if (cubeletPos.x > facePosThreshold) moveChar = 'R'; else if (cubeletPos.x < -facePosThreshold) moveChar = 'L'; else moveChar = '';
//                  directionSign = (deltaY * worldStickerNormal.y > 0) ? -1 : 1;
//             }
//         } else { // F/B sticker
//             if (horizontalDrag) {
//                 moveChar = worldStickerNormal.z > 0 ? (deltaX > 0 ? 'L' : 'R') : (deltaX > 0 ? 'R' : 'L');
//                 directionSign = worldStickerNormal.z * deltaX < 0 ? 1 : -1;
//                  if (cubeletPos.y > facePosThreshold) moveChar = 'U'; else if (cubeletPos.y < -facePosThreshold) moveChar = 'D'; else moveChar = '';
//                  directionSign = (deltaX * worldStickerNormal.z < 0) ? -1 : 1;
//             } else {
//                 moveChar = worldStickerNormal.z > 0 ? (deltaY > 0 ? 'D' : 'U') : (deltaY > 0 ? 'U' : 'D');
//                 directionSign = worldStickerNormal.z * deltaY < 0 ? 1 : -1;
//                  if (cubeletPos.x > facePosThreshold) moveChar = 'R'; else if (cubeletPos.x < -facePosThreshold) moveChar = 'L'; else moveChar = '';
//                  directionSign = (deltaY * worldStickerNormal.z < 0) ? -1 : 1;
//             }
//         }


//         if (moveChar) {
//           let finalMove = moveChar.toUpperCase();
//           if (directionSign === -1) finalMove += "'";
          
//           // Prevent self-rotation on center piece stickers, or if moveChar ended up empty (middle slice idea)
//           const isCenterSticker = Math.abs(intersectedCubelet.userData.initialX) + Math.abs(intersectedCubelet.userData.initialY) + Math.abs(intersectedCubelet.userData.initialZ) === 1;
//           const faceMapping = { 'R':0, 'L':0, 'U':1, 'D':1, 'F':2, 'B':2 };

//           if (isCenterSticker && faceMapping[finalMove.charAt(0)] === stickerMainAxisIndex) {
//             // console.log("[useCube] Skipping self-rotation of center piece sticker for move:", finalMove);
//           } else {
//             if (setIsLoadingCallback) setIsLoadingCallback(true); // Notify parent
//             await applyMove(finalMove, true); // true indicates it's a user direct move
//             if (setIsLoadingCallback) setIsLoadingCallback(false);
//           }
//         } else {
//             // console.log("[useCube] Could not determine move from drag.");
//         }
//       }
//     };

//     const handlePointerUp = () => {
//       const dragState = dragStateRef.current;
//       if (dragState.isDraggingFace) {
//         if (controlsRef.current) {
//           controlsRef.current.enabled = dragState.originalOrbitControlsEnabled;
//         }
//         dragState.isDraggingFace = false;
//         dragState.intersectedCubelet = null;
//         dragState.intersectedFaceLocalNormal = null;
//       }
//     };
    
//     domElement.addEventListener('pointerdown', handlePointerDown, { passive: false });
//     window.addEventListener('pointermove', handlePointerMove, { passive: false });
//     window.addEventListener('pointerup', handlePointerUp, { passive: false });

//     return () => {
//       // console.log('[useCube] Removing pointer event listeners.');
//       domElement.removeEventListener('pointerdown', handlePointerDown);
//       window.removeEventListener('pointermove', handlePointerMove);
//       window.removeEventListener('pointerup', handlePointerUp);
//     };
//   // Add setIsLoadingCallback if used inside, ensure it's stable or wrapped in useCallback in parent
//   }, [performVisualRotation, setIsLoadingCallback]); // Dependencies for mouse interaction


//   // --- Action Functions ---
//   const applyMove = useCallback(async (move, isUserDirectMove = false) => {
//     if (!logicCubeRef.current) return;
//     logicCubeRef.current.applyMove(move); // Update logical state first
//     await performVisualRotation(move);    // Then animate visual state
    
//     setCubeState(logicCubeRef.current.getCubeState()); // Update React state for UI
//     setIsSolvedState(logicCubeRef.current.isSolved());
//     // If it's a direct user move from dragging, we don't want to clear solution steps in Solver.jsx
//     // The Solver.jsx will manage solutionSteps based on its own actions (Solve, Scramble)
//     return !isUserDirectMove; // Return true if it was NOT a direct user move (e.g. from solution playback)
//   }, [performVisualRotation]);

//   const resetCube = useCallback(() => {
//     if (!logicCubeRef.current) return;
//     logicCubeRef.current.reset();
//     // Visuals need to be reset. Easiest is to rebuild.
//     if (sceneRef.current && visualCubeGroupRef.current) {
//         sceneRef.current.remove(visualCubeGroupRef.current);
//         // Proper disposal of children's geometry and materials
//         visualCubeGroupRef.current.traverse(child => {
//             if (child.isMesh) {
//                 if (child.geometry) child.geometry.dispose();
//                 if (Array.isArray(child.material)) {
//                     child.material.forEach(material => material.dispose());
//                 } else if (child.material) {
//                     child.material.dispose();
//                 }
//             }
//         });
//     }
//     const newVisualCube = createVisualCube(logicCubeRef.current);
//     if (newVisualCube instanceof THREE.Object3D && sceneRef.current) {
//         sceneRef.current.add(newVisualCube);
//         visualCubeGroupRef.current = newVisualCube;
//     }
//     setCubeState(logicCubeRef.current.getCubeState());
//     setIsSolvedState(logicCubeRef.current.isSolved());
//   }, []);

//   const scrambleCube = useCallback(async (numMoves = 15) => {
//     if (!logicCubeRef.current) return "";
//     const scrambleSequence = logicCubeRef.current.scramble(numMoves); // Scramble logic model
    
//     // Apply scramble visually, one move at a time for better UX than instant change
//     // Or, for faster scramble, rebuild visual cube based on new logic state:
//     // resetCube(); // This rebuilds visuals based on the now scrambled logicCubeRef.current

//     // For animated scramble (slower but shows moves):
//     const moves = scrambleSequence.split(' ');
//     if (setIsLoadingCallback) setIsLoadingCallback(true);
//     for (const move of moves) {
//         if (move) await performVisualRotation(move);
//     }
//     if (setIsLoadingCallback) setIsLoadingCallback(false);
    
//     setCubeState(logicCubeRef.current.getCubeState());
//     setIsSolvedState(logicCubeRef.current.isSolved());
//     return scrambleSequence;
//   }, [performVisualRotation, setIsLoadingCallback, resetCube]); // Added resetCube if you prefer instant visual scramble

//   const getStateString = useCallback(() => {
//     return logicCubeRef.current ? logicCubeRef.current.getStateString() : "";
//   }, []);

//   const toggleCubeColorMode = useCallback(() => {
//     // This is a placeholder. For actual colorblind mode, you'd need to:
//     // 1. Define colorblind faceColors
//     // 2. Update the materials in createVisualCube or have a separate material set
//     // 3. Trigger a visual update.
//     setCurrentColorMode(prev => prev === 'standard' ? 'colorblind_TODO' : 'standard');
//     // This will trigger updateVisuals if it's in its dependency array and currentColorMode is used by createVisualCube
//     updateVisuals(); // Force a visual refresh
//     console.log("Color mode toggled. Visual update needs proper implementation.");
//   }, [updateVisuals]);


//   return {
//     containerRef,
//     // Expose refs for potential advanced use by parent, though direct manipulation is discouraged
//     // sceneRef, cameraRef, rendererRef, controlsRef, visualCubeGroupRef,
//     cubeState,
//     isSolved: isSolvedState,
//     resetCube,
//     applyMove, // This is the main function to apply moves (logical + visual)
//     scrambleCube,
//     getStateString,
//     toggleCubeColorMode, // For the colorblind button
//     // No need to expose performVisualRotation directly if applyMove handles it
//     isDraggingFace: dragStateRef.current.isDraggingFace // Expose for disabling buttons
//   };
// };

// export default useCube;


// // src/hooks/useCube.js
// import { useState, useEffect, useRef, useCallback } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import RubiksCubeLogic, { faceColors } from '../models/RubiksCube'; // Ensure this path is correct

// // Constants
// const CUBELET_SIZE = 0.95;
// const CUBELET_SPACING = 1.0;

// // Helper to create the visual cube
// const createVisualCube = (logicCube) => {
//   if (!logicCube) {
//       console.error("[useCube] createVisualCube: logicCube input is null/undefined!");
//       return undefined;
//   }

//   const group = new THREE.Group();
//   const materials = {
//     R: new THREE.MeshStandardMaterial({ color: faceColors.R, side: THREE.FrontSide, name: 'R_material' }),
//     L: new THREE.MeshStandardMaterial({ color: faceColors.L, side: THREE.FrontSide, name: 'L_material' }),
//     U: new THREE.MeshStandardMaterial({ color: faceColors.U, side: THREE.FrontSide, name: 'U_material' }),
//     D: new THREE.MeshStandardMaterial({ color: faceColors.D, side: THREE.FrontSide, name: 'D_material' }),
//     F: new THREE.MeshStandardMaterial({ color: faceColors.F, side: THREE.FrontSide, name: 'F_material' }),
//     B: new THREE.MeshStandardMaterial({ color: faceColors.B, side: THREE.FrontSide, name: 'B_material' }),
//     Inside: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, side: THREE.FrontSide, name: 'Inside_material' }),
//   };

//   for (let x = -1; x <= 1; x++) {
//     for (let y = -1; y <= 1; y++) {
//       for (let z = -1; z <= 1; z++) {
//         if (x === 0 && y === 0 && z === 0) continue;
//         const geometry = new THREE.BoxGeometry(CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE);
//         const cubeletMaterials = [
//           x === 1 ? materials.R : materials.Inside, x === -1 ? materials.L : materials.Inside,
//           y === 1 ? materials.U : materials.Inside, y === -1 ? materials.D : materials.Inside,
//           z === 1 ? materials.F : materials.Inside, z === -1 ? materials.B : materials.Inside,
//         ];
//         const cubelet = new THREE.Mesh(geometry, cubeletMaterials);
//         cubelet.position.set(x * CUBELET_SPACING, y * CUBELET_SPACING, z * CUBELET_SPACING);
//         cubelet.userData = { initialX: x, initialY: y, initialZ: z, currentPos: { x, y, z } };
//         group.add(cubelet);
//       }
//     }
//   }
//   return group;
// };


// // --- The Hook ---
// const useCube = (setIsLoadingCallback) => {
//   const containerRef = useRef(null);
//   const rendererRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const visualCubeGroupRef = useRef(null);
//   const logicCubeRef = useRef(new RubiksCubeLogic());
//   const frameIdRef = useRef(null);

//   const raycasterRef = useRef(new THREE.Raycaster());
//   const mouseNDCRef = useRef(new THREE.Vector2());
//   const dragStateRef = useRef({
//     isDraggingFace: false,
//     startPointerScreenPos: new THREE.Vector2(),
//     intersectedCubelet: null,
//     intersectedFaceLocalNormal: null,
//     moveExecutedInDrag: false,
//     originalOrbitControlsEnabled: true,
//   });

//   const [cubeState, setCubeState] = useState(() => logicCubeRef.current.getCubeState());
//   const [isSolvedState, setIsSolvedState] = useState(() => logicCubeRef.current.isSolved());
//   const [currentColorMode, setCurrentColorMode] = useState('standard');

//   const updateVisuals = useCallback(() => {
//     if (!visualCubeGroupRef.current || !logicCubeRef.current) return;
    
//     if (sceneRef.current && visualCubeGroupRef.current) {
//         sceneRef.current.remove(visualCubeGroupRef.current);
//         visualCubeGroupRef.current.traverse(child => {
//             if (child.isMesh) {
//                 if (child.geometry) child.geometry.dispose();
//                 if (Array.isArray(child.material)) {
//                     child.material.forEach(material => material.dispose());
//                 } else if (child.material) {
//                     child.material.dispose();
//                 }
//             }
//         });
//     }
//     const newVisualCube = createVisualCube(logicCubeRef.current);
//     if (newVisualCube instanceof THREE.Object3D && sceneRef.current) {
//         sceneRef.current.add(newVisualCube);
//         visualCubeGroupRef.current = newVisualCube;
//     }
//     // Assuming getCubeState and isSolved are methods on your RubiksCubeLogic instance
//     if (logicCubeRef.current && typeof logicCubeRef.current.getCubeState === 'function') {
//         setCubeState(logicCubeRef.current.getCubeState());
//     }
//     if (logicCubeRef.current && typeof logicCubeRef.current.isSolved === 'function') {
//         setIsSolvedState(logicCubeRef.current.isSolved());
//     }
//   }, []); // Removed currentColorMode as it's not directly used inside; updateVisuals is called by toggleCubeColorMode

//   const getFaceCubelets = useCallback((faceSymbol) => {
//     if (!visualCubeGroupRef.current) return [];
//     const faceCubelets = [];
//     const threshold = (CUBELET_SIZE / 2) + (CUBELET_SPACING - CUBELET_SIZE) / 2 - 0.1;

//     visualCubeGroupRef.current.children.forEach(cubelet => {
//       if (!cubelet.isMesh) return;
//       const worldPos = cubelet.getWorldPosition(new THREE.Vector3());
//       switch (faceSymbol) {
//         case 'R': if (worldPos.x > threshold) faceCubelets.push(cubelet); break;
//         case 'L': if (worldPos.x < -threshold) faceCubelets.push(cubelet); break;
//         case 'U': if (worldPos.y > threshold) faceCubelets.push(cubelet); break;
//         case 'D': if (worldPos.y < -threshold) faceCubelets.push(cubelet); break;
//         case 'F': if (worldPos.z > threshold) faceCubelets.push(cubelet); break;
//         case 'B': if (worldPos.z < -threshold) faceCubelets.push(cubelet); break;
//         default: break;
//       }
//     });
//     return faceCubelets;
//   }, []);

//   const performVisualRotation = useCallback(async (move) => {
//     if (!visualCubeGroupRef.current || !sceneRef.current ) {
//       console.warn("[useCube] performVisualRotation: Visuals not ready.");
//       return;
//     }
//     if (!move || move.length === 0) {
//       console.warn("[useCube] performVisualRotation: Empty move received.");
//       return;
//     }

//     let axisVector = new THREE.Vector3();
//     let angle = 0;
//     const prime = move.includes("'");
//     const double = move.includes("2");
//     const baseFace = move.charAt(0).toUpperCase();

//     switch (baseFace) {
//       case 'R': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'L': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       case 'U': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'D': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       case 'F': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'B': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       default: console.warn(`[useCube] Unknown move base: ${baseFace} in move: ${move}`); return;
//     }

//     const selectedCubelets = getFaceCubelets(baseFace);
//     if (selectedCubelets.length === 0) {
//       return;
//     }

//     const pivot = new THREE.Object3D();
//     sceneRef.current.add(pivot);
//     selectedCubelets.forEach(cubelet => pivot.attach(cubelet));

//     return new Promise(resolve => {
//       const initialPivotOrientation = new THREE.Quaternion();
//       const targetPivotOrientation = new THREE.Quaternion().setFromAxisAngle(axisVector.normalize(), angle);
//       const animationDuration = 200;
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
//             visualCubeGroupRef.current.attach(cubelet);
//           });
//           sceneRef.current.remove(pivot);
//           pivot.clear();
//           resolve();
//         }
//       };
//       animateRotation();
//     });
//   }, [getFaceCubelets]);

//   const applyMove = useCallback(async (move, isUserDirectMove = false) => {
//     console.log('[useCube] applyMove called with:', move, 'Logic cube ref:', logicCubeRef.current); // DEBUG LOG
//     if (!logicCubeRef.current) {
//         console.error('[useCube] logicCubeRef.current is null or undefined in applyMove!');
//         return false; // Indicate failure or no action
//     }
//     if (typeof logicCubeRef.current.applyMove !== 'function') {
//         console.error('[useCube] logicCubeRef.current.applyMove IS NOT A FUNCTION. Object is:', logicCubeRef.current); // DEBUG LOG
//         if (logicCubeRef.current) {
//             console.log('[useCube] Prototype of logicCubeRef.current:', Object.getPrototypeOf(logicCubeRef.current)); // DEBUG LOG
//         }
//         return false;
//     }

//     logicCubeRef.current.applyMove(move);
//     await performVisualRotation(move);
    
//     if (logicCubeRef.current && typeof logicCubeRef.current.getCubeState === 'function') {
//         setCubeState(logicCubeRef.current.getCubeState());
//     }
//     if (logicCubeRef.current && typeof logicCubeRef.current.isSolved === 'function') {
//         setIsSolvedState(logicCubeRef.current.isSolved());
//     }
//     return !isUserDirectMove;
//   }, [performVisualRotation]); // Removed setCubeState, setIsSolvedState setters from deps

//   const initScene = useCallback(() => {
//     let currentContainer = containerRef.current;
//     if (!currentContainer) return () => {};

//     try {
//       const width = currentContainer.clientWidth; const height = currentContainer.clientHeight;
//       const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf0f0f0); sceneRef.current = scene;
//       const camera = new THREE.PerspectiveCamera(45, width > 0 && height > 0 ? width / height : 1, 0.1, 100); camera.position.set(5, 6, 7); camera.lookAt(0, 0, 0); cameraRef.current = camera;
      
//       if (rendererRef.current && rendererRef.current.domElement.parentElement === currentContainer) {
//         currentContainer.removeChild(rendererRef.current.domElement);
//         rendererRef.current.dispose();
//       }
//       const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//       if (width > 0 && height > 0) renderer.setSize(width, height); renderer.setPixelRatio(window.devicePixelRatio); rendererRef.current = renderer; currentContainer.appendChild(renderer.domElement);
      
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); scene.add(ambientLight); const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); directionalLight.position.set(5, 10, 7); scene.add(directionalLight);

//       if (controlsRef.current) {
//         controlsRef.current.dispose();
//       }
//       const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.05; controls.minDistance = 4; controls.maxDistance = 20; controls.target.set(0, 0, 0);
//       controlsRef.current = controls;

//       if (visualCubeGroupRef.current && sceneRef.current.children.includes(visualCubeGroupRef.current)) {
//           sceneRef.current.remove(visualCubeGroupRef.current);
//           visualCubeGroupRef.current.traverse(child => { 
//             if (child.isMesh) {
//                 if (child.geometry) child.geometry.dispose();
//                 if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
//                 else if (child.material) child.material.dispose();
//             }
//            });
//       }
//       const visualCubeGroup = createVisualCube(logicCubeRef.current);
//       if (visualCubeGroup instanceof THREE.Object3D) {
//         scene.add(visualCubeGroup);
//         visualCubeGroupRef.current = visualCubeGroup;
//       } else {
//         console.error('[useCube] FAILED TO ADD CUBE TO SCENE: createVisualCube returned invalid object!', visualCubeGroup);
//       }

//       let isActive = true;
//       const animate = () => {
//         if (!isActive || !frameIdRef) return;
//         frameIdRef.current = requestAnimationFrame(animate);
//         if (controlsRef.current) controlsRef.current.update();
//         if (rendererRef.current && sceneRef.current && cameraRef.current) {
//           rendererRef.current.render(sceneRef.current, cameraRef.current);
//         }
//       };
//       if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
//       animate();

//       const handleResize = () => {
//           if(!currentContainer || !cameraRef.current || !rendererRef.current) return;
//           const newWidth = currentContainer.clientWidth;
//           const newHeight = currentContainer.clientHeight;
//           if (newWidth > 0 && newHeight > 0) {
//             cameraRef.current.aspect = newWidth / newHeight;
//             cameraRef.current.updateProjectionMatrix();
//             rendererRef.current.setSize(newWidth, newHeight);
//           }
//       };
//       window.addEventListener('resize', handleResize);
//       handleResize();

//       return () => {
//         isActive = false;
//         window.removeEventListener('resize', handleResize);
//         if (frameIdRef.current) { cancelAnimationFrame(frameIdRef.current); frameIdRef.current = null; }
//         if (controlsRef.current) { controlsRef.current.dispose(); controlsRef.current = null; }
//         if (visualCubeGroupRef.current && sceneRef.current) {
//             sceneRef.current.remove(visualCubeGroupRef.current);
//             visualCubeGroupRef.current.traverse(child => {
//                 if (child.isMesh) {
//                     if (child.geometry) child.geometry.dispose();
//                     if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
//                     else if (child.material) child.material.dispose();
//                 }
//             });
//             visualCubeGroupRef.current = null;
//         }
//         if (rendererRef.current) {
//           if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode === currentContainer) {
//             currentContainer.removeChild(rendererRef.current.domElement);
//           }
//           rendererRef.current.dispose();
//           rendererRef.current = null;
//         }
//         if (sceneRef.current) {
//             while(sceneRef.current.children.length > 0){
//                 const child = sceneRef.current.children[0];
//                 sceneRef.current.remove(child);
//                 if (child.dispose) child.dispose(); // If it has a dispose method (like lights)
//             }
//             sceneRef.current = null;
//         }
//         cameraRef.current = null;
//       };
//     } catch (error) {
//       console.error('[useCube] Error during initScene:', error);
//       return () => {};
//     }
//   }, []);

//   useEffect(() => {
//     const cleanup = initScene();
//     return cleanup;
//   }, [initScene]);

//   useEffect(() => {
//     const domElement = rendererRef.current?.domElement;
//     if (!domElement || !visualCubeGroupRef.current || !cameraRef.current || !controlsRef.current || !sceneRef.current) return;

//     const handlePointerDown = async (event) => {
//       if (dragStateRef.current.isDraggingFace || (setIsLoadingCallback && typeof setIsLoadingCallback === 'function' && setIsLoadingCallback(null, true))) return;

//       const rect = domElement.getBoundingClientRect();
//       mouseNDCRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       mouseNDCRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

//       raycasterRef.current.setFromCamera(mouseNDCRef.current, cameraRef.current);
//       const intersects = raycasterRef.current.intersectObjects(visualCubeGroupRef.current.children, true);

//       if (intersects.length > 0) {
//         const intersection = intersects[0];
//         if (intersection.object.isMesh) {
//           dragStateRef.current.isDraggingFace = true;
//           dragStateRef.current.startPointerScreenPos.set(event.clientX, event.clientY);
//           dragStateRef.current.intersectedCubelet = intersection.object;
//           dragStateRef.current.intersectedFaceLocalNormal = intersection.face.normal.clone();
//           dragStateRef.current.moveExecutedInDrag = false;
          
//           if (controlsRef.current) {
//             dragStateRef.current.originalOrbitControlsEnabled = controlsRef.current.enabled;
//             controlsRef.current.enabled = false;
//           }
//         }
//       }
//     };

//     const handlePointerMove = async (event) => {
//       const dragState = dragStateRef.current;
//       if (!dragState.isDraggingFace || dragState.moveExecutedInDrag || (setIsLoadingCallback && typeof setIsLoadingCallback === 'function' && setIsLoadingCallback(null, true))) {
//         return;
//       }

//       const deltaX = event.clientX - dragState.startPointerScreenPos.x;
//       const deltaY = event.clientY - dragState.startPointerScreenPos.y;
//       const dragThreshold = 10;

//       if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
//         dragState.moveExecutedInDrag = true;

//         const { intersectedCubelet, intersectedFaceLocalNormal } = dragState;
//         if (!intersectedCubelet || !intersectedFaceLocalNormal) return;

//         const cubeletWorldQuaternion = intersectedCubelet.getWorldQuaternion(new THREE.Quaternion());
//         const worldStickerNormal = intersectedFaceLocalNormal.clone().applyQuaternion(cubeletWorldQuaternion).round();

//         let stickerMainAxisIndex = 0;
//         if (Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.x) && Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.z)) stickerMainAxisIndex = 1;
//         else if (Math.abs(worldStickerNormal.z) > Math.abs(worldStickerNormal.x)) stickerMainAxisIndex = 2;

//         const horizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);
//         let moveChar = '';
//         let directionSign = 1;
        
//         const cubeletPos = intersectedCubelet.getWorldPosition(new THREE.Vector3());
//         const facePosThreshold = CUBELET_SPACING * 0.5;

//         if (stickerMainAxisIndex === 0) { // R/L sticker
//             if (horizontalDrag) {
//                  if (cubeletPos.y > facePosThreshold) moveChar = 'U'; else if (cubeletPos.y < -facePosThreshold) moveChar = 'D'; else moveChar = '';
//                  directionSign = (deltaX * worldStickerNormal.x > 0) ? -1 : 1;
//             } else {
//                  if (cubeletPos.z > facePosThreshold) moveChar = 'F'; else if (cubeletPos.z < -facePosThreshold) moveChar = 'B'; else moveChar = '';
//                  directionSign = (deltaY * worldStickerNormal.x < 0) ? -1 : 1;
//             }
//         } else if (stickerMainAxisIndex === 1) { // U/D sticker
//             if (horizontalDrag) {
//                  if (cubeletPos.z > facePosThreshold) moveChar = 'F'; else if (cubeletPos.z < -facePosThreshold) moveChar = 'B'; else moveChar = '';
//                  directionSign = (deltaX * worldStickerNormal.y < 0) ? -1 : 1;
//             } else {
//                  if (cubeletPos.x > facePosThreshold) moveChar = 'R'; else if (cubeletPos.x < -facePosThreshold) moveChar = 'L'; else moveChar = '';
//                  directionSign = (deltaY * worldStickerNormal.y > 0) ? -1 : 1;
//             }
//         } else { // F/B sticker
//             if (horizontalDrag) {
//                  if (cubeletPos.y > facePosThreshold) moveChar = 'U'; else if (cubeletPos.y < -facePosThreshold) moveChar = 'D'; else moveChar = '';
//                  directionSign = (deltaX * worldStickerNormal.z < 0) ? -1 : 1;
//             } else {
//                  if (cubeletPos.x > facePosThreshold) moveChar = 'R'; else if (cubeletPos.x < -facePosThreshold) moveChar = 'L'; else moveChar = '';
//                  directionSign = (deltaY * worldStickerNormal.z < 0) ? -1 : 1;
//             }
//         }

//         if (moveChar) {
//           let finalMove = moveChar.toUpperCase();
//           if (directionSign === -1) finalMove += "'";
          
//           const isCenterSticker = Math.abs(intersectedCubelet.userData.initialX) + Math.abs(intersectedCubelet.userData.initialY) + Math.abs(intersectedCubelet.userData.initialZ) === 1;
//           const faceMapping = { 'R':0, 'L':0, 'U':1, 'D':1, 'F':2, 'B':2 };

//           if (isCenterSticker && finalMove.charAt(0) in faceMapping && faceMapping[finalMove.charAt(0)] === stickerMainAxisIndex) {
//             // console.log("[useCube] Skipping self-rotation of center piece sticker for move:", finalMove);
//           } else {
//             console.log('[useCube] In handlePointerMove, about to call applyMove. logicCubeRef.current:', logicCubeRef.current); // DEBUG LOG
//             if (typeof logicCubeRef.current.applyMove !== 'function') {
//                  console.error('[useCube] In handlePointerMove, logicCubeRef.current.applyMove IS NOT A FUNCTION!'); // DEBUG LOG
//             } else {
//                  if (setIsLoadingCallback) setIsLoadingCallback(true);
//                  await applyMove(finalMove, true); 
//                  if (setIsLoadingCallback) setIsLoadingCallback(false);
//             }
//           }
//         }
//       }
//     };

//     const handlePointerUp = () => {
//       const dragState = dragStateRef.current;
//       if (dragState.isDraggingFace) {
//         if (controlsRef.current) {
//           controlsRef.current.enabled = dragState.originalOrbitControlsEnabled;
//         }
//         dragState.isDraggingFace = false;
//         dragState.intersectedCubelet = null;
//         dragState.intersectedFaceLocalNormal = null;
//       }
//     };
    
//     domElement.addEventListener('pointerdown', handlePointerDown, { passive: true }); // Changed to passive true where appropriate
//     window.addEventListener('pointermove', handlePointerMove, { passive: true });
//     window.addEventListener('pointerup', handlePointerUp, { passive: true });

//     return () => {
//       domElement.removeEventListener('pointerdown', handlePointerDown);
//       window.removeEventListener('pointermove', handlePointerMove);
//       window.removeEventListener('pointerup', handlePointerUp);
//     };
//   }, [performVisualRotation, setIsLoadingCallback, applyMove]); // Added applyMove

//   const resetCube = useCallback(() => {
//     if (!logicCubeRef.current) return;
//     if (typeof logicCubeRef.current.reset !== 'function') {
//         console.error('[useCube] logicCubeRef.current.reset IS NOT A FUNCTION'); return;
//     }
//     logicCubeRef.current.reset();
//     updateVisuals(); // Call updateVisuals to rebuild the cube visually
//   }, [updateVisuals]);

//   const scrambleCube = useCallback(async (numMoves = 15) => {
//     if (!logicCubeRef.current) return "";
//     if (typeof logicCubeRef.current.scramble !== 'function') {
//         console.error('[useCube] logicCubeRef.current.scramble IS NOT A FUNCTION'); return "";
//     }
//     const scrambleSequence = logicCubeRef.current.scramble(numMoves);
    
//     if (setIsLoadingCallback) setIsLoadingCallback(true);
//     const moves = scrambleSequence.split(' ');
//     for (const move of moves) {
//         if (move) await performVisualRotation(move);
//     }
//     if (setIsLoadingCallback) setIsLoadingCallback(false);
    
//     if (logicCubeRef.current && typeof logicCubeRef.current.getCubeState === 'function') {
//         setCubeState(logicCubeRef.current.getCubeState());
//     }
//     if (logicCubeRef.current && typeof logicCubeRef.current.isSolved === 'function') {
//         setIsSolvedState(logicCubeRef.current.isSolved());
//     }
//     return scrambleSequence;
//   }, [performVisualRotation, setIsLoadingCallback]); // Removed resetCube from deps

//   const getStateString = useCallback(() => {
//     return (logicCubeRef.current && typeof logicCubeRef.current.getStateString === 'function') 
//            ? logicCubeRef.current.getStateString() 
//            : "";
//   }, []);

//   const toggleCubeColorMode = useCallback(() => {
//     setCurrentColorMode(prev => prev === 'standard' ? 'colorblind_TODO' : 'standard');
//     updateVisuals(); // Force a visual refresh
//     console.log("[useCube] Color mode toggled. Visual update needs proper colorblind_TODO colors in createVisualCube.");
//   }, [updateVisuals]);


//   return {
//     containerRef,
//     cubeState,
//     isSolved: isSolvedState,
//     resetCube,
//     applyMove,
//     scrambleCube,
//     getStateString,
//     toggleCubeColorMode,
//     isDraggingFace: dragStateRef.current.isDraggingFace
//   };
// };

// export default useCube;



// 16 May


// // src/hooks/useCube.js
// import { useState, useEffect, useRef, useCallback } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import RubiksCubeLogic, { faceColors } from '../models/RubiksCube'; // RubiksCubeLogic is alias for RubiksCube class

// // Constants
// const CUBELET_SIZE = 0.95;
// const CUBELET_SPACING = 1.0;

// // Helper to create the visual cube
// const createVisualCube = (logicCube) => {
//   if (!logicCube) {
//       console.error("[useCube] createVisualCube: logicCube input is null/undefined!");
//       return undefined;
//   }
//   // Check if logicCube is an instance RIGHT BEFORE using it for creating visuals
//   if (!(logicCube instanceof RubiksCubeLogic)) {
//     console.error("[useCube] createVisualCube: logicCube is NOT an instance of RubiksCubeLogic!", logicCube);
//     // Potentially return a default or error visual representation
//   }

//   const group = new THREE.Group();
//   const materials = {
//     R: new THREE.MeshStandardMaterial({ color: faceColors.R, side: THREE.FrontSide, name: 'R_material' }),
//     L: new THREE.MeshStandardMaterial({ color: faceColors.L, side: THREE.FrontSide, name: 'L_material' }),
//     U: new THREE.MeshStandardMaterial({ color: faceColors.U, side: THREE.FrontSide, name: 'U_material' }),
//     D: new THREE.MeshStandardMaterial({ color: faceColors.D, side: THREE.FrontSide, name: 'D_material' }),
//     F: new THREE.MeshStandardMaterial({ color: faceColors.F, side: THREE.FrontSide, name: 'F_material' }),
//     B: new THREE.MeshStandardMaterial({ color: faceColors.B, side: THREE.FrontSide, name: 'B_material' }),
//     Inside: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, side: THREE.FrontSide, name: 'Inside_material' }),
//   };

//   for (let x = -1; x <= 1; x++) {
//     for (let y = -1; y <= 1; y++) {
//       for (let z = -1; z <= 1; z++) {
//         if (x === 0 && y === 0 && z === 0) continue;
//         const geometry = new THREE.BoxGeometry(CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE);
//         const cubeletMaterials = [
//           x === 1 ? materials.R : materials.Inside, x === -1 ? materials.L : materials.Inside,
//           y === 1 ? materials.U : materials.Inside, y === -1 ? materials.D : materials.Inside,
//           z === 1 ? materials.F : materials.Inside, z === -1 ? materials.B : materials.Inside,
//         ];
//         const cubelet = new THREE.Mesh(geometry, cubeletMaterials);
//         cubelet.position.set(x * CUBELET_SPACING, y * CUBELET_SPACING, z * CUBELET_SPACING);
//         cubelet.userData = { initialX: x, initialY: y, initialZ: z, currentPos: { x, y, z } };
//         group.add(cubelet);
//       }
//     }
//   }
//   return group;
// };


// // --- The Hook ---
// const useCube = (setIsLoadingCallback) => {
//   const containerRef = useRef(null);
//   const rendererRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const visualCubeGroupRef = useRef(null);
//   const logicCubeRef = useRef(new RubiksCubeLogic()); // Correctly initialized
//   const frameIdRef = useRef(null);

//   const raycasterRef = useRef(new THREE.Raycaster());
//   const mouseNDCRef = useRef(new THREE.Vector2());
//   const dragStateRef = useRef({
//     isDraggingFace: false,
//     startPointerScreenPos: new THREE.Vector2(),
//     intersectedCubelet: null,
//     intersectedFaceLocalNormal: null,
//     moveExecutedInDrag: false,
//     originalOrbitControlsEnabled: true,
//   });

//   const [cubeState, setCubeState] = useState(() => logicCubeRef.current.getCubeState());
//   const [isSolvedState, setIsSolvedState] = useState(() => logicCubeRef.current.isSolved());
//   // currentColorMode is declared but its value not directly used to change colors yet.
//   // eslint-disable-next-line no-unused-vars
//   const [currentColorMode, setCurrentColorMode] = useState('standard');


//   const updateVisuals = useCallback(() => {
//     if (!visualCubeGroupRef.current || !logicCubeRef.current) return;
    
//     // DIAGNOSTIC: Check instance type before major visual update
//     if (!(logicCubeRef.current instanceof RubiksCubeLogic)) {
//         console.error('[useCube] updateVisuals: logicCubeRef.current is NOT an instance of RubiksCubeLogic!', logicCubeRef.current);
//         // Potentially stop or handle this error state
//     }

//     if (sceneRef.current && visualCubeGroupRef.current) {
//         sceneRef.current.remove(visualCubeGroupRef.current);
//         visualCubeGroupRef.current.traverse(child => {
//             if (child.isMesh) {
//                 if (child.geometry) child.geometry.dispose();
//                 if (Array.isArray(child.material)) {
//                     child.material.forEach(material => material.dispose());
//                 } else if (child.material) {
//                     child.material.dispose();
//                 }
//             }
//         });
//     }
//     const newVisualCube = createVisualCube(logicCubeRef.current);
//     if (newVisualCube instanceof THREE.Object3D && sceneRef.current) {
//         sceneRef.current.add(newVisualCube);
//         visualCubeGroupRef.current = newVisualCube;
//     }

//     if (logicCubeRef.current && typeof logicCubeRef.current.getCubeState === 'function') {
//         setCubeState(logicCubeRef.current.getCubeState());
//     } else {
//         console.error('[useCube] updateVisuals: logicCubeRef.current.getCubeState is not a function or logicCubeRef.current is invalid.');
//     }
//     if (logicCubeRef.current && typeof logicCubeRef.current.isSolved === 'function') {
//         setIsSolvedState(logicCubeRef.current.isSolved());
//     } else {
//         console.error('[useCube] updateVisuals: logicCubeRef.current.isSolved is not a function or logicCubeRef.current is invalid.');
//     }
//   }, []);

//   const getFaceCubelets = useCallback((faceSymbol) => {
//     if (!visualCubeGroupRef.current) return [];
//     const faceCubelets = [];
//     const threshold = (CUBELET_SIZE / 2) + (CUBELET_SPACING - CUBELET_SIZE) / 2 - 0.1;

//     visualCubeGroupRef.current.children.forEach(cubelet => {
//       if (!cubelet.isMesh) return;
//       const worldPos = cubelet.getWorldPosition(new THREE.Vector3());
//       switch (faceSymbol) {
//         case 'R': if (worldPos.x > threshold) faceCubelets.push(cubelet); break;
//         case 'L': if (worldPos.x < -threshold) faceCubelets.push(cubelet); break;
//         case 'U': if (worldPos.y > threshold) faceCubelets.push(cubelet); break;
//         case 'D': if (worldPos.y < -threshold) faceCubelets.push(cubelet); break;
//         case 'F': if (worldPos.z > threshold) faceCubelets.push(cubelet); break;
//         case 'B': if (worldPos.z < -threshold) faceCubelets.push(cubelet); break;
//         default: break;
//       }
//     });
//     return faceCubelets;
//   }, []);

//   const performVisualRotation = useCallback(async (move) => {
//     if (!visualCubeGroupRef.current || !sceneRef.current ) {
//       console.warn("[useCube] performVisualRotation: Visuals not ready.");
//       return;
//     }
//     if (!move || move.length === 0) {
//       console.warn("[useCube] performVisualRotation: Empty move received.");
//       return;
//     }

//     let axisVector = new THREE.Vector3();
//     let angle = 0;
//     const prime = move.includes("'");
//     const double = move.includes("2");
//     const baseFace = move.charAt(0).toUpperCase();

//     switch (baseFace) {
//       case 'R': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'L': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       case 'U': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'D': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       case 'F': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
//       case 'B': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
//       default: console.warn(`[useCube] Unknown move base: ${baseFace} in move: ${move}`); return;
//     }

//     const selectedCubelets = getFaceCubelets(baseFace);
//     if (selectedCubelets.length === 0) {
//       return;
//     }

//     const pivot = new THREE.Object3D();
//     sceneRef.current.add(pivot);
//     selectedCubelets.forEach(cubelet => pivot.attach(cubelet));

//     return new Promise(resolve => {
//       const initialPivotOrientation = new THREE.Quaternion();
//       const targetPivotOrientation = new THREE.Quaternion().setFromAxisAngle(axisVector.normalize(), angle);
//       const animationDuration = 200;
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
//             visualCubeGroupRef.current.attach(cubelet);
//           });
//           sceneRef.current.remove(pivot);
//           pivot.clear(); // Dispose of pivot if it has resources
//           resolve();
//         }
//       };
//       animateRotation();
//     });
//   }, [getFaceCubelets]);

//   const applyMove = useCallback(async (moveString, isUserDirectMove = false) => {
//     console.log('[useCube] applyMove (hook) called with:', moveString, 'Logic cube ref:', logicCubeRef.current);
//     if (!logicCubeRef.current) {
//         console.error('[useCube] CRITICAL: logicCubeRef.current is null or undefined in applyMove!');
//         return false;
//     }
    
//     // CRITICAL DIAGNOSTIC
//     const isInstance = logicCubeRef.current instanceof RubiksCubeLogic;
//     console.log('[useCube] In applyMove: logicCubeRef.current instanceof RubiksCubeLogic?', isInstance);
//     if (!isInstance) {
//         console.error('[useCube] CRITICAL: logicCubeRef.current is NOT an instance of RubiksCubeLogic in applyMove. Object:', logicCubeRef.current);
//         console.log('[useCube] Prototype:', Object.getPrototypeOf(logicCubeRef.current));
//         return false;
//     }

//     // Check for the CORRECT method name 'move'
//     if (typeof logicCubeRef.current.move !== 'function') {
//         console.error('[useCube] logicCubeRef.current.move IS NOT A FUNCTION. This should not happen if it is an instance.');
//         return false;
//     }

//     logicCubeRef.current.move(moveString); // Use 'move' method from RubiksCube.js
//     await performVisualRotation(moveString);
    
//     // Update React state after logical and visual move
//     // No need to check typeof again if instance check passed
//     setCubeState(logicCubeRef.current.getCubeState());
//     setIsSolvedState(logicCubeRef.current.isSolved());
    
//     return !isUserDirectMove; // Original logic for return value
//   }, [performVisualRotation]);

//   const initScene = useCallback(() => {
//     let currentContainer = containerRef.current;
//     if (!currentContainer) return () => {};

//     try {
//       const width = currentContainer.clientWidth; const height = currentContainer.clientHeight;
//       const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf0f0f0); sceneRef.current = scene;
//       const camera = new THREE.PerspectiveCamera(45, width > 0 && height > 0 ? width / height : 1, 0.1, 100); camera.position.set(5, 6, 7); camera.lookAt(0, 0, 0); cameraRef.current = camera;
      
//       if (rendererRef.current && rendererRef.current.domElement.parentElement === currentContainer) {
//         currentContainer.removeChild(rendererRef.current.domElement);
//         rendererRef.current.dispose();
//       }
//       const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//       if (width > 0 && height > 0) renderer.setSize(width, height); renderer.setPixelRatio(window.devicePixelRatio); rendererRef.current = renderer; currentContainer.appendChild(renderer.domElement);
      
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); scene.add(ambientLight); const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); directionalLight.position.set(5, 10, 7); scene.add(directionalLight);

//       if (controlsRef.current) {
//         controlsRef.current.dispose();
//       }
//       const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.05; controls.minDistance = 4; controls.maxDistance = 20; controls.target.set(0, 0, 0);
//       controlsRef.current = controls;

//       if (visualCubeGroupRef.current && sceneRef.current.children.includes(visualCubeGroupRef.current)) {
//           sceneRef.current.remove(visualCubeGroupRef.current);
//           visualCubeGroupRef.current.traverse(child => { 
//             if (child.isMesh) {
//                 if (child.geometry) child.geometry.dispose();
//                 if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
//                 else if (child.material) child.material.dispose();
//             }
//            });
//       }
//        // DIAGNOSTIC: Check instance type before creating visual cube in initScene
//       if (!(logicCubeRef.current instanceof RubiksCubeLogic)) {
//           console.error('[useCube] initScene: logicCubeRef.current is NOT an instance of RubiksCubeLogic before createVisualCube!', logicCubeRef.current);
//       }
//       const visualCubeGroup = createVisualCube(logicCubeRef.current); // Pass the RubiksCube instance
//       if (visualCubeGroup instanceof THREE.Object3D) {
//         scene.add(visualCubeGroup);
//         visualCubeGroupRef.current = visualCubeGroup;
//       } else {
//         console.error('[useCube] FAILED TO ADD CUBE TO SCENE: createVisualCube returned invalid object!', visualCubeGroup);
//       }

//       let isActive = true;
//       const animate = () => {
//         if (!isActive || !frameIdRef) return;
//         frameIdRef.current = requestAnimationFrame(animate);
//         if (controlsRef.current) controlsRef.current.update();
//         if (rendererRef.current && sceneRef.current && cameraRef.current) {
//           rendererRef.current.render(sceneRef.current, cameraRef.current);
//         }
//       };
//       if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
//       animate();

//       const handleResize = () => {
//           if(!currentContainer || !cameraRef.current || !rendererRef.current) return;
//           const newWidth = currentContainer.clientWidth;
//           const newHeight = currentContainer.clientHeight;
//           if (newWidth > 0 && newHeight > 0) {
//             cameraRef.current.aspect = newWidth / newHeight;
//             cameraRef.current.updateProjectionMatrix();
//             rendererRef.current.setSize(newWidth, newHeight);
//           }
//       };
//       window.addEventListener('resize', handleResize);
//       handleResize(); // Initial resize

//       return () => {
//         isActive = false;
//         window.removeEventListener('resize', handleResize);
//         if (frameIdRef.current) { cancelAnimationFrame(frameIdRef.current); frameIdRef.current = null; }
//         if (controlsRef.current) { controlsRef.current.dispose(); controlsRef.current = null; }
//         if (visualCubeGroupRef.current && sceneRef.current && sceneRef.current.children.includes(visualCubeGroupRef.current)) { // Check if still child
//             sceneRef.current.remove(visualCubeGroupRef.current);
//             visualCubeGroupRef.current.traverse(child => {
//                 if (child.isMesh) {
//                     if (child.geometry) child.geometry.dispose();
//                     if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
//                     else if (child.material) child.material.dispose();
//                 }
//             });
//             visualCubeGroupRef.current = null;
//         }
//         if (rendererRef.current) {
//           if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode === currentContainer) {
//             currentContainer.removeChild(rendererRef.current.domElement);
//           }
//           rendererRef.current.dispose();
//           rendererRef.current = null;
//         }
//         if (sceneRef.current) {
//             while(sceneRef.current.children.length > 0){
//                 const child = sceneRef.current.children[0];
//                 sceneRef.current.remove(child);
//                 if (child instanceof THREE.Light && typeof child.dispose === 'function') { // Be more specific with dispose
//                     child.dispose();
//                 } else if (child instanceof THREE.Object3D) {
//                     // For other Object3D, ensure proper cleanup if needed
//                 }
//             }
//             sceneRef.current = null;
//         }
//         cameraRef.current = null;
//       };
//     } catch (error) {
//       console.error('[useCube] Error during initScene:', error);
//       return () => {}; // Ensure a function is always returned
//     }
//   }, []); // initScene dependencies are implicitly stable (refs, new THREE objects)

//   useEffect(() => {
//     const cleanup = initScene();
//     return cleanup;
//   }, [initScene]);

//   useEffect(() => {
//     const domElement = rendererRef.current?.domElement;
//     if (!domElement || !visualCubeGroupRef.current || !cameraRef.current || !controlsRef.current || !sceneRef.current) return;

//     const handlePointerDown = async (event) => {
//       if (dragStateRef.current.isDraggingFace || (setIsLoadingCallback && typeof setIsLoadingCallback === 'function' && setIsLoadingCallback(null, true))) return;

//       const rect = domElement.getBoundingClientRect();
//       mouseNDCRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       mouseNDCRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

//       raycasterRef.current.setFromCamera(mouseNDCRef.current, cameraRef.current);
//       const intersects = raycasterRef.current.intersectObjects(visualCubeGroupRef.current.children, true);

//       if (intersects.length > 0) {
//         const intersection = intersects[0];
//         if (intersection.object.isMesh && intersection.face) { // Ensure face exists
//           dragStateRef.current.isDraggingFace = true;
//           dragStateRef.current.startPointerScreenPos.set(event.clientX, event.clientY);
//           dragStateRef.current.intersectedCubelet = intersection.object;
//           dragStateRef.current.intersectedFaceLocalNormal = intersection.face.normal.clone();
//           dragStateRef.current.moveExecutedInDrag = false;
          
//           if (controlsRef.current) {
//             dragStateRef.current.originalOrbitControlsEnabled = controlsRef.current.enabled;
//             controlsRef.current.enabled = false;
//           }
//         }
//       }
//     };

//     const handlePointerMove = async (event) => {
//       const dragState = dragStateRef.current;
//       if (!dragState.isDraggingFace || dragState.moveExecutedInDrag || (setIsLoadingCallback && typeof setIsLoadingCallback === 'function' && setIsLoadingCallback(null, true))) {
//         return;
//       }

//       const deltaX = event.clientX - dragState.startPointerScreenPos.x;
//       const deltaY = event.clientY - dragState.startPointerScreenPos.y;
//       const dragThreshold = 10;

//       if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
//         dragState.moveExecutedInDrag = true;

//         const { intersectedCubelet, intersectedFaceLocalNormal } = dragState;
//         if (!intersectedCubelet || !intersectedFaceLocalNormal) return;

//         const cubeletWorldQuaternion = intersectedCubelet.getWorldQuaternion(new THREE.Quaternion());
//         const worldStickerNormal = intersectedFaceLocalNormal.clone().applyQuaternion(cubeletWorldQuaternion).round();

//         let stickerMainAxisIndex = 0;
//         if (Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.x) && Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.z)) stickerMainAxisIndex = 1;
//         else if (Math.abs(worldStickerNormal.z) > Math.abs(worldStickerNormal.x)) stickerMainAxisIndex = 2;

//         const horizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);
//         let moveChar = '';
//         let directionSign = 1;
        
//         const cubeletPos = intersectedCubelet.getWorldPosition(new THREE.Vector3());
//         const facePosThreshold = CUBELET_SPACING * 0.5;

//         if (stickerMainAxisIndex === 0) { // R/L sticker
//             if (horizontalDrag) {
//                  if (cubeletPos.y > facePosThreshold) moveChar = 'U'; else if (cubeletPos.y < -facePosThreshold) moveChar = 'D'; else moveChar = '';
//                  directionSign = (deltaX * worldStickerNormal.x > 0) ? -1 : 1;
//             } else {
//                  if (cubeletPos.z > facePosThreshold) moveChar = 'F'; else if (cubeletPos.z < -facePosThreshold) moveChar = 'B'; else moveChar = '';
//                  directionSign = (deltaY * worldStickerNormal.x < 0) ? -1 : 1;
//             }
//         } else if (stickerMainAxisIndex === 1) { // U/D sticker
//             if (horizontalDrag) {
//                  if (cubeletPos.z > facePosThreshold) moveChar = 'F'; else if (cubeletPos.z < -facePosThreshold) moveChar = 'B'; else moveChar = '';
//                  directionSign = (deltaX * worldStickerNormal.y < 0) ? -1 : 1;
//             } else {
//                  if (cubeletPos.x > facePosThreshold) moveChar = 'R'; else if (cubeletPos.x < -facePosThreshold) moveChar = 'L'; else moveChar = '';
//                  directionSign = (deltaY * worldStickerNormal.y > 0) ? -1 : 1;
//             }
//         } else { // F/B sticker
//             if (horizontalDrag) {
//                  if (cubeletPos.y > facePosThreshold) moveChar = 'U'; else if (cubeletPos.y < -facePosThreshold) moveChar = 'D'; else moveChar = '';
//                  directionSign = (deltaX * worldStickerNormal.z < 0) ? -1 : 1;
//             } else {
//                  if (cubeletPos.x > facePosThreshold) moveChar = 'R'; else if (cubeletPos.x < -facePosThreshold) moveChar = 'L'; else moveChar = '';
//                  directionSign = (deltaY * worldStickerNormal.z < 0) ? -1 : 1;
//             }
//         }

//         if (moveChar) {
//           let finalMove = moveChar.toUpperCase();
//           if (directionSign === -1) finalMove += "'";
          
//           const isCenterSticker = Math.abs(intersectedCubelet.userData.initialX) + Math.abs(intersectedCubelet.userData.initialY) + Math.abs(intersectedCubelet.userData.initialZ) === 1;
//           const faceMapping = { 'R':0, 'L':0, 'U':1, 'D':1, 'F':2, 'B':2 };

//           if (isCenterSticker && finalMove.charAt(0) in faceMapping && faceMapping[finalMove.charAt(0)] === stickerMainAxisIndex) {
//             // Skipping self-rotation of center piece sticker for move
//           } else {
//             // Call the hook's applyMove, which then calls logicCubeRef.current.move
//             if (setIsLoadingCallback) setIsLoadingCallback(true);
//             await applyMove(finalMove, true); 
//             if (setIsLoadingCallback) setIsLoadingCallback(false);
//           }
//         }
//       }
//     };

//     const handlePointerUp = () => {
//       const dragState = dragStateRef.current;
//       if (dragState.isDraggingFace) {
//         if (controlsRef.current) {
//           controlsRef.current.enabled = dragState.originalOrbitControlsEnabled;
//         }
//         dragState.isDraggingFace = false;
//         dragState.intersectedCubelet = null;
//         dragState.intersectedFaceLocalNormal = null;
//       }
//     };
    
//     domElement.addEventListener('pointerdown', handlePointerDown, { passive: true });
//     window.addEventListener('pointermove', handlePointerMove, { passive: true });
//     window.addEventListener('pointerup', handlePointerUp, { passive: true });

//     return () => {
//       domElement.removeEventListener('pointerdown', handlePointerDown);
//       window.removeEventListener('pointermove', handlePointerMove);
//       window.removeEventListener('pointerup', handlePointerUp);
//     };
//   }, [performVisualRotation, setIsLoadingCallback, applyMove]); // 'applyMove' is correctly listed

//   // Renamed to resetCubeHook internally to avoid confusion if RubiksCube class also had 'resetCube'
//   const resetCubeHook = useCallback(() => {
//     if (!logicCubeRef.current) {
//         console.error('[useCube] CRITICAL: logicCubeRef.current is null or undefined in resetCubeHook!');
//         return;
//     }

//     // CRITICAL DIAGNOSTIC
//     const isInstance = logicCubeRef.current instanceof RubiksCubeLogic;
//     console.log('[useCube] In resetCubeHook: logicCubeRef.current instanceof RubiksCubeLogic?', isInstance);
//     if (!isInstance) {
//         console.error('[useCube] CRITICAL: logicCubeRef.current is NOT an instance of RubiksCubeLogic in resetCubeHook. Object:', logicCubeRef.current);
//         console.log('[useCube] Prototype:', Object.getPrototypeOf(logicCubeRef.current));
//         return;
//     }
    
//     // Check for the CORRECT method name 'resetCube'
//     if (typeof logicCubeRef.current.resetCube !== 'function') {
//         console.error('[useCube] logicCubeRef.current.resetCube IS NOT A FUNCTION. This should not happen if it is an instance.');
//         return;
//     }
//     logicCubeRef.current.resetCube(); // Use 'resetCube' method from RubiksCube.js
//     updateVisuals();
//   }, [updateVisuals]);

//   const scrambleCube = useCallback(async (numMoves = 15) => {
//     if (!logicCubeRef.current) {
//         console.error('[useCube] CRITICAL: logicCubeRef.current is null or undefined in scrambleCube!');
//         return "";
//     }

//     // CRITICAL DIAGNOSTIC
//     const isInstance = logicCubeRef.current instanceof RubiksCubeLogic;
//     console.log('[useCube] In scrambleCube: logicCubeRef.current instanceof RubiksCubeLogic?', isInstance);
//     if (!isInstance) {
//         console.error('[useCube] CRITICAL: logicCubeRef.current is NOT an instance of RubiksCubeLogic in scrambleCube. Object:', logicCubeRef.current);
//         console.log('[useCube] Prototype:', Object.getPrototypeOf(logicCubeRef.current));
//         return "";
//     }
    
//     if (typeof logicCubeRef.current.scramble !== 'function') {
//         console.error('[useCube] logicCubeRef.current.scramble IS NOT A FUNCTION. This should not happen if it is an instance.');
//         return "";
//     }
//     const scrambleSequence = logicCubeRef.current.scramble(numMoves);
    
//     if (setIsLoadingCallback) setIsLoadingCallback(true);
//     const moves = scrambleSequence.split(' ');
//     for (const move of moves) {
//         if (move) await performVisualRotation(move);
//     }
//     if (setIsLoadingCallback) setIsLoadingCallback(false);
    
//     setCubeState(logicCubeRef.current.getCubeState());
//     setIsSolvedState(logicCubeRef.current.isSolved());
//     return scrambleSequence;
//   }, [performVisualRotation, setIsLoadingCallback, updateVisuals]); // Added updateVisuals as it's called implicitly by setCubeState/setIsSolvedState through potential re-renders. Better to be explicit or rely on state updates. Or call updateVisuals() directly if needed. For now, performVisualRotation updates visuals per move. Final state update by setCubeState/setIsSolvedState is for React state.

//   const getStateString = useCallback(() => {
//     if (!logicCubeRef.current || !(logicCubeRef.current instanceof RubiksCubeLogic)) return "";
//     return (typeof logicCubeRef.current.getStateString === 'function') 
//            ? logicCubeRef.current.getStateString() 
//            : "";
//   }, []);

//   const toggleCubeColorMode = useCallback(() => {
//     setCurrentColorMode(prev => {
//         const newMode = prev === 'standard' ? 'colorblind_TODO' : 'standard';
//         console.log("[useCube] Color mode toggled to:", newMode, ". Visual update needs proper colorblind_TODO colors in createVisualCube.");
//         // TODO: When colorblind mode is implemented, ensure createVisualCube uses currentColorMode.
//         // For now, updateVisuals will re-render with the same standard colors.
//         return newMode;
//     });
//     updateVisuals(); // Force a visual refresh
//   }, [updateVisuals]); // updateVisuals is dependency. currentColorMode is implicitly handled by setCurrentColorMode.

//   return {
//     containerRef,
//     cubeState, // This is the object form {U: [...], ...}
//     isSolved: isSolvedState,
//     resetCube: resetCubeHook, // Exporting the hook's reset function
//     applyMove,
//     scrambleCube,
//     getStateString,
//     toggleCubeColorMode,
//     isDraggingFace: dragStateRef.current.isDraggingFace // This is a snapshot, consider a state if it needs to trigger re-renders
//   };
// };

// export default useCube;


// After clearing error

// src/hooks/useCube.js
import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import RubiksCubeLogic, { faceColors } from '../models/RubiksCube'; // RubiksCubeLogic is alias for RubiksCube class

// Constants
const CUBELET_SIZE = 0.95;
const CUBELET_SPACING = 1.0;

// Helper to create the visual cube
const createVisualCube = (logicCube) => {
  if (!logicCube) {
      console.error("[useCube] createVisualCube: logicCube input is null/undefined!");
      return undefined;
  }
  if (!(logicCube instanceof RubiksCubeLogic)) {
    console.error("[useCube] createVisualCube: logicCube is NOT an instance of RubiksCubeLogic!", logicCube);
  }

  const group = new THREE.Group();
  const materials = {
    R: new THREE.MeshStandardMaterial({ color: faceColors.R, side: THREE.FrontSide, name: 'R_material' }),
    L: new THREE.MeshStandardMaterial({ color: faceColors.L, side: THREE.FrontSide, name: 'L_material' }),
    U: new THREE.MeshStandardMaterial({ color: faceColors.U, side: THREE.FrontSide, name: 'U_material' }),
    D: new THREE.MeshStandardMaterial({ color: faceColors.D, side: THREE.FrontSide, name: 'D_material' }),
    F: new THREE.MeshStandardMaterial({ color: faceColors.F, side: THREE.FrontSide, name: 'F_material' }),
    B: new THREE.MeshStandardMaterial({ color: faceColors.B, side: THREE.FrontSide, name: 'B_material' }),
    Inside: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, side: THREE.FrontSide, name: 'Inside_material' }),
  };

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        const geometry = new THREE.BoxGeometry(CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE);
        const cubeletMaterials = [
          x === 1 ? materials.R : materials.Inside, x === -1 ? materials.L : materials.Inside,
          y === 1 ? materials.U : materials.Inside, y === -1 ? materials.D : materials.Inside,
          z === 1 ? materials.F : materials.Inside, z === -1 ? materials.B : materials.Inside,
        ];
        const cubelet = new THREE.Mesh(geometry, cubeletMaterials);
        cubelet.position.set(x * CUBELET_SPACING, y * CUBELET_SPACING, z * CUBELET_SPACING);
        cubelet.userData = { initialX: x, initialY: y, initialZ: z, currentPos: { x, y, z } };
        group.add(cubelet);
      }
    }
  }
  return group;
};


// --- The Hook ---
const useCube = (setIsLoadingCallback) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const visualCubeGroupRef = useRef(null);
  const logicCubeRef = useRef(new RubiksCubeLogic());
  const frameIdRef = useRef(null);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseNDCRef = useRef(new THREE.Vector2());
  const dragStateRef = useRef({
    isDraggingFace: false,
    startPointerScreenPos: new THREE.Vector2(),
    intersectedCubelet: null,
    intersectedFaceLocalNormal: null,
    moveExecutedInDrag: false,
    originalOrbitControlsEnabled: true,
  });

  const [cubeState, setCubeState] = useState(() => logicCubeRef.current.getCubeState());
  const [isSolvedState, setIsSolvedState] = useState(() => logicCubeRef.current.isSolved());
  // eslint-disable-next-line no-unused-vars
  const [currentColorMode, setCurrentColorMode] = useState('standard');


  const updateVisuals = useCallback(() => {
    if (!visualCubeGroupRef.current || !logicCubeRef.current) return;
    
    if (!(logicCubeRef.current instanceof RubiksCubeLogic)) {
        console.error('[useCube] updateVisuals: logicCubeRef.current is NOT an instance of RubiksCubeLogic!', logicCubeRef.current);
    }

    if (sceneRef.current && visualCubeGroupRef.current) {
        sceneRef.current.remove(visualCubeGroupRef.current);
        visualCubeGroupRef.current.traverse(child => {
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else if (child.material) {
                    child.material.dispose();
                }
            }
        });
    }
    const newVisualCube = createVisualCube(logicCubeRef.current);
    if (newVisualCube instanceof THREE.Object3D && sceneRef.current) {
        sceneRef.current.add(newVisualCube);
        visualCubeGroupRef.current = newVisualCube;
    }

    if (logicCubeRef.current && typeof logicCubeRef.current.getCubeState === 'function') {
        setCubeState(logicCubeRef.current.getCubeState());
    } else {
        console.error('[useCube] updateVisuals: logicCubeRef.current.getCubeState is not a function or logicCubeRef.current is invalid.');
    }
    if (logicCubeRef.current && typeof logicCubeRef.current.isSolved === 'function') {
        setIsSolvedState(logicCubeRef.current.isSolved());
    } else {
        console.error('[useCube] updateVisuals: logicCubeRef.current.isSolved is not a function or logicCubeRef.current is invalid.');
    }
  }, []); // setCubeState and setIsSolvedState are stable, no need to list them.

  const getFaceCubelets = useCallback((faceSymbol) => {
    if (!visualCubeGroupRef.current) return [];
    const faceCubelets = [];
    const threshold = (CUBELET_SIZE / 2) + (CUBELET_SPACING - CUBELET_SIZE) / 2 - 0.1;

    visualCubeGroupRef.current.children.forEach(cubelet => {
      if (!cubelet.isMesh) return;
      const worldPos = cubelet.getWorldPosition(new THREE.Vector3());
      switch (faceSymbol) {
        case 'R': if (worldPos.x > threshold) faceCubelets.push(cubelet); break;
        case 'L': if (worldPos.x < -threshold) faceCubelets.push(cubelet); break;
        case 'U': if (worldPos.y > threshold) faceCubelets.push(cubelet); break;
        case 'D': if (worldPos.y < -threshold) faceCubelets.push(cubelet); break;
        case 'F': if (worldPos.z > threshold) faceCubelets.push(cubelet); break;
        case 'B': if (worldPos.z < -threshold) faceCubelets.push(cubelet); break;
        default: break;
      }
    });
    return faceCubelets;
  }, []);

  const performVisualRotation = useCallback(async (move) => {
    if (!visualCubeGroupRef.current || !sceneRef.current ) {
      console.warn("[useCube] performVisualRotation: Visuals not ready.");
      return;
    }
    if (!move || move.length === 0) {
      console.warn("[useCube] performVisualRotation: Empty move received.");
      return;
    }

    let axisVector = new THREE.Vector3();
    let angle = 0;
    const prime = move.includes("'");
    const double = move.includes("2");
    const baseFace = move.charAt(0).toUpperCase();

    switch (baseFace) {
      case 'R': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
      case 'L': axisVector.set(1, 0, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
      case 'U': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
      case 'D': axisVector.set(0, 1, 0); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
      case 'F': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? -Math.PI / 2 : Math.PI / 2); break;
      case 'B': axisVector.set(0, 0, 1); angle = double ? Math.PI : (prime ? Math.PI / 2 : -Math.PI / 2); break;
      default: console.warn(`[useCube] Unknown move base: ${baseFace} in move: ${move}`); return;
    }

    const selectedCubelets = getFaceCubelets(baseFace);
    if (selectedCubelets.length === 0) {
      return;
    }

    const pivot = new THREE.Object3D();
    if (sceneRef.current) { // Check sceneRef.current before adding
        sceneRef.current.add(pivot);
    } else {
        console.warn("[useCube] performVisualRotation: sceneRef.current is null, cannot add pivot.");
        return;
    }
    selectedCubelets.forEach(cubelet => pivot.attach(cubelet));

    return new Promise(resolve => {
      const initialPivotOrientation = new THREE.Quaternion();
      const targetPivotOrientation = new THREE.Quaternion().setFromAxisAngle(axisVector.normalize(), angle);
      const animationDuration = 200;
      const startTime = Date.now();

      const animateRotation = () => {
        const elapsed = Date.now() - startTime;
        let progress = Math.min(elapsed / animationDuration, 1);
        progress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        pivot.quaternion.slerpQuaternions(initialPivotOrientation, targetPivotOrientation, progress);

        if (progress < 1) {
          requestAnimationFrame(animateRotation);
        } else {
          pivot.quaternion.copy(targetPivotOrientation);
          selectedCubelets.forEach(cubelet => {
            cubelet.updateMatrixWorld(true); // Ensure matrix is updated before reattaching
            if (visualCubeGroupRef.current) { // Check visualCubeGroupRef before attaching
                visualCubeGroupRef.current.attach(cubelet);
            }
          });
          if (sceneRef.current) sceneRef.current.remove(pivot);
          if (typeof pivot.clear === 'function') pivot.clear(); 
          resolve();
        }
      };
      animateRotation();
    });
  }, [getFaceCubelets]);

  const applyMove = useCallback(async (moveString, isUserDirectMove = false) => {
    // console.log('[useCube] applyMove (hook) called with:', moveString, 'Logic cube ref:', logicCubeRef.current);
    if (!logicCubeRef.current) {
        console.error('[useCube] CRITICAL: logicCubeRef.current is null or undefined in applyMove!');
        return false;
    }
    
    const isInstance = logicCubeRef.current instanceof RubiksCubeLogic;
    // console.log('[useCube] In applyMove: logicCubeRef.current instanceof RubiksCubeLogic?', isInstance);
    if (!isInstance) {
        console.error('[useCube] CRITICAL: logicCubeRef.current is NOT an instance of RubiksCubeLogic in applyMove. Object:', logicCubeRef.current);
        console.log('[useCube] Prototype:', Object.getPrototypeOf(logicCubeRef.current));
        return false;
    }

    if (typeof logicCubeRef.current.move !== 'function') {
        console.error('[useCube] logicCubeRef.current.move IS NOT A FUNCTION. This should not happen if it is an instance.');
        return false;
    }

    logicCubeRef.current.move(moveString);
    await performVisualRotation(moveString);
    
    setCubeState(logicCubeRef.current.getCubeState());
    setIsSolvedState(logicCubeRef.current.isSolved());
    
    return !isUserDirectMove;
  }, [performVisualRotation]); // setCubeState, setIsSolvedState are stable

  const initScene = useCallback(() => {
    let currentContainer = containerRef.current;
    if (!currentContainer) return () => {};

    try {
      const width = currentContainer.clientWidth; const height = currentContainer.clientHeight;
      const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf0f0f0); sceneRef.current = scene;
      const camera = new THREE.PerspectiveCamera(45, width > 0 && height > 0 ? width / height : 1, 0.1, 100); camera.position.set(5, 6, 7); camera.lookAt(0, 0, 0); cameraRef.current = camera;
      
      if (rendererRef.current && rendererRef.current.domElement.parentElement === currentContainer) {
        currentContainer.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      if (width > 0 && height > 0) renderer.setSize(width, height); renderer.setPixelRatio(window.devicePixelRatio); rendererRef.current = renderer; currentContainer.appendChild(renderer.domElement);
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); scene.add(ambientLight); const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); directionalLight.position.set(5, 10, 7); scene.add(directionalLight);

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.05; controls.minDistance = 4; controls.maxDistance = 20; controls.target.set(0, 0, 0);
      controlsRef.current = controls;

      if (visualCubeGroupRef.current && sceneRef.current.children.includes(visualCubeGroupRef.current)) {
          sceneRef.current.remove(visualCubeGroupRef.current);
          visualCubeGroupRef.current.traverse(child => { 
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else if (child.material) child.material.dispose();
            }
           });
      }
      if (!(logicCubeRef.current instanceof RubiksCubeLogic)) {
          console.error('[useCube] initScene: logicCubeRef.current is NOT an instance of RubiksCubeLogic before createVisualCube!', logicCubeRef.current);
      }
      const visualCubeGroup = createVisualCube(logicCubeRef.current);
      if (visualCubeGroup instanceof THREE.Object3D) {
        scene.add(visualCubeGroup);
        visualCubeGroupRef.current = visualCubeGroup;
      } else {
        console.error('[useCube] FAILED TO ADD CUBE TO SCENE: createVisualCube returned invalid object!', visualCubeGroup);
      }

      let isActive = true;
      const animate = () => {
        if (!isActive || !frameIdRef) return; // Check frameIdRef as well if it's being nulled
        frameIdRef.current = requestAnimationFrame(animate);
        if (controlsRef.current) controlsRef.current.update();
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      animate();

      const handleResize = () => {
          if(!containerRef.current || !cameraRef.current || !rendererRef.current) return; // Check containerRef.current as well
          const newWidth = containerRef.current.clientWidth; // Use containerRef.current
          const newHeight = containerRef.current.clientHeight; // Use containerRef.current
          if (newWidth > 0 && newHeight > 0) {
            cameraRef.current.aspect = newWidth / newHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(newWidth, newHeight);
          }
      };
      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        isActive = false;
        window.removeEventListener('resize', handleResize);
        if (frameIdRef.current) { cancelAnimationFrame(frameIdRef.current); frameIdRef.current = null; }
        if (controlsRef.current) { controlsRef.current.dispose(); controlsRef.current = null; }
        
        if (visualCubeGroupRef.current && sceneRef.current && sceneRef.current.children.includes(visualCubeGroupRef.current)) {
            sceneRef.current.remove(visualCubeGroupRef.current);
            visualCubeGroupRef.current.traverse(child => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose();
                    if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                    else if (child.material) child.material.dispose();
                }
            });
            visualCubeGroupRef.current = null;
        }
        
        if (rendererRef.current) {
          // Check parentNode before removeChild
          if (currentContainer && rendererRef.current.domElement && rendererRef.current.domElement.parentNode === currentContainer) {
            currentContainer.removeChild(rendererRef.current.domElement);
          }
          rendererRef.current.dispose();
          rendererRef.current = null;
        }

        if (sceneRef.current) {
            const lights = sceneRef.current.children.filter(child => child instanceof THREE.Light);
            lights.forEach(light => {
                if (typeof light.dispose === 'function') light.dispose();
                sceneRef.current.remove(light);
            });
            // Remove other objects if necessary, e.g., helper objects
            while(sceneRef.current.children.length > 0){
                const child = sceneRef.current.children[0];
                sceneRef.current.remove(child);
                // Add more specific disposal if needed for other object types
            }
            sceneRef.current = null;
        }
        cameraRef.current = null;
        // currentContainer is a local variable, no need to null it here. Refs are handled by React.
      };
    } catch (error) {
      console.error('[useCube] Error during initScene:', error);
      return () => {};
    }
  }, []);

  useEffect(() => {
    const cleanup = initScene();
    return cleanup;
  }, [initScene]);

  useEffect(() => {
    const domElement = rendererRef.current?.domElement;
    if (!domElement || !visualCubeGroupRef.current || !cameraRef.current || !controlsRef.current || !sceneRef.current) return;

    const handlePointerDown = async (event) => {
      // Guard against setIsLoadingCallback not being a function or returning undefined
      const isLoadingCheck = setIsLoadingCallback && typeof setIsLoadingCallback === 'function' ? setIsLoadingCallback(null, true) : false;
      if (dragStateRef.current.isDraggingFace || isLoadingCheck) return;

      const rect = domElement.getBoundingClientRect();
      mouseNDCRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDCRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseNDCRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(visualCubeGroupRef.current.children, true);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        if (intersection.object.isMesh && intersection.face) {
          dragStateRef.current.isDraggingFace = true;
          dragStateRef.current.startPointerScreenPos.set(event.clientX, event.clientY);
          dragStateRef.current.intersectedCubelet = intersection.object;
          dragStateRef.current.intersectedFaceLocalNormal = intersection.face.normal.clone();
          dragStateRef.current.moveExecutedInDrag = false;
          
          if (controlsRef.current) {
            dragStateRef.current.originalOrbitControlsEnabled = controlsRef.current.enabled;
            controlsRef.current.enabled = false;
          }
        }
      }
    };

    const handlePointerMove = async (event) => {
      const dragState = dragStateRef.current;
      const isLoadingCheck = setIsLoadingCallback && typeof setIsLoadingCallback === 'function' ? setIsLoadingCallback(null, true) : false;
      if (!dragState.isDraggingFace || dragState.moveExecutedInDrag || isLoadingCheck) {
        return;
      }

      const deltaX = event.clientX - dragState.startPointerScreenPos.x;
      const deltaY = event.clientY - dragState.startPointerScreenPos.y;
      const dragThreshold = 10;

      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        dragState.moveExecutedInDrag = true;

        const { intersectedCubelet, intersectedFaceLocalNormal } = dragState;
        if (!intersectedCubelet || !intersectedFaceLocalNormal) return;

        const cubeletWorldQuaternion = intersectedCubelet.getWorldQuaternion(new THREE.Quaternion());
        const worldStickerNormal = intersectedFaceLocalNormal.clone().applyQuaternion(cubeletWorldQuaternion).round();

        let stickerMainAxisIndex = 0;
        if (Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.x) && Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.z)) stickerMainAxisIndex = 1;
        else if (Math.abs(worldStickerNormal.z) > Math.abs(worldStickerNormal.x)) stickerMainAxisIndex = 2;

        const horizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);
        let moveChar = '';
        let directionSign = 1;
        
        const cubeletPos = intersectedCubelet.getWorldPosition(new THREE.Vector3());
        const facePosThreshold = CUBELET_SPACING * 0.5;

        if (stickerMainAxisIndex === 0) { // R/L sticker
            if (horizontalDrag) {
                 if (cubeletPos.y > facePosThreshold) moveChar = 'U'; else if (cubeletPos.y < -facePosThreshold) moveChar = 'D'; else moveChar = '';
                 directionSign = (deltaX * worldStickerNormal.x > 0) ? -1 : 1;
            } else {
                 if (cubeletPos.z > facePosThreshold) moveChar = 'F'; else if (cubeletPos.z < -facePosThreshold) moveChar = 'B'; else moveChar = '';
                 directionSign = (deltaY * worldStickerNormal.x < 0) ? -1 : 1;
            }
        } else if (stickerMainAxisIndex === 1) { // U/D sticker
            if (horizontalDrag) {
                 if (cubeletPos.z > facePosThreshold) moveChar = 'F'; else if (cubeletPos.z < -facePosThreshold) moveChar = 'B'; else moveChar = '';
                 directionSign = (deltaX * worldStickerNormal.y < 0) ? -1 : 1;
            } else {
                 if (cubeletPos.x > facePosThreshold) moveChar = 'R'; else if (cubeletPos.x < -facePosThreshold) moveChar = 'L'; else moveChar = '';
                 directionSign = (deltaY * worldStickerNormal.y > 0) ? -1 : 1;
            }
        } else { // F/B sticker
            if (horizontalDrag) {
                 if (cubeletPos.y > facePosThreshold) moveChar = 'U'; else if (cubeletPos.y < -facePosThreshold) moveChar = 'D'; else moveChar = '';
                 directionSign = (deltaX * worldStickerNormal.z < 0) ? -1 : 1;
            } else {
                 if (cubeletPos.x > facePosThreshold) moveChar = 'R'; else if (cubeletPos.x < -facePosThreshold) moveChar = 'L'; else moveChar = '';
                 directionSign = (deltaY * worldStickerNormal.z < 0) ? -1 : 1;
            }
        }

        if (moveChar) {
          let finalMove = moveChar.toUpperCase();
          if (directionSign === -1) finalMove += "'";
          
          const isCenterSticker = intersectedCubelet.userData && (Math.abs(intersectedCubelet.userData.initialX) + Math.abs(intersectedCubelet.userData.initialY) + Math.abs(intersectedCubelet.userData.initialZ) === 1);
          const faceMapping = { 'R':0, 'L':0, 'U':1, 'D':1, 'F':2, 'B':2 };

          if (isCenterSticker && finalMove.charAt(0) in faceMapping && faceMapping[finalMove.charAt(0)] === stickerMainAxisIndex) {
            // Skipping self-rotation of center piece sticker for move
          } else {
            if (setIsLoadingCallback && typeof setIsLoadingCallback === 'function') setIsLoadingCallback(true);
            await applyMove(finalMove, true); 
            if (setIsLoadingCallback && typeof setIsLoadingCallback === 'function') setIsLoadingCallback(false);
          }
        }
      }
    };

    const handlePointerUp = () => {
      const dragState = dragStateRef.current;
      if (dragState.isDraggingFace) {
        if (controlsRef.current) {
          controlsRef.current.enabled = dragState.originalOrbitControlsEnabled;
        }
        dragState.isDraggingFace = false;
        dragState.intersectedCubelet = null;
        dragState.intersectedFaceLocalNormal = null;
      }
    };
    
    domElement.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [performVisualRotation, setIsLoadingCallback, applyMove]);

  const resetCubeHook = useCallback(() => {
    if (!logicCubeRef.current) {
        console.error('[useCube] CRITICAL: logicCubeRef.current is null or undefined in resetCubeHook!');
        return;
    }

    const isInstance = logicCubeRef.current instanceof RubiksCubeLogic;
    // console.log('[useCube] In resetCubeHook: logicCubeRef.current instanceof RubiksCubeLogic?', isInstance);
    if (!isInstance) {
        console.error('[useCube] CRITICAL: logicCubeRef.current is NOT an instance of RubiksCubeLogic in resetCubeHook. Object:', logicCubeRef.current);
        console.log('[useCube] Prototype:', Object.getPrototypeOf(logicCubeRef.current));
        return;
    }
    
    if (typeof logicCubeRef.current.resetCube !== 'function') {
        console.error('[useCube] logicCubeRef.current.resetCube IS NOT A FUNCTION. This should not happen if it is an instance.');
        return;
    }
    logicCubeRef.current.resetCube();
    updateVisuals();
  }, [updateVisuals]);

  const scrambleCube = useCallback(async (numMoves = 15) => {
    if (!logicCubeRef.current) {
        console.error('[useCube] CRITICAL: logicCubeRef.current is null or undefined in scrambleCube!');
        return "";
    }

    const isInstance = logicCubeRef.current instanceof RubiksCubeLogic;
    // console.log('[useCube] In scrambleCube: logicCubeRef.current instanceof RubiksCubeLogic?', isInstance);
    if (!isInstance) {
        console.error('[useCube] CRITICAL: logicCubeRef.current is NOT an instance of RubiksCubeLogic in scrambleCube. Object:', logicCubeRef.current);
        console.log('[useCube] Prototype:', Object.getPrototypeOf(logicCubeRef.current));
        return "";
    }
    
    if (typeof logicCubeRef.current.scramble !== 'function') {
        console.error('[useCube] logicCubeRef.current.scramble IS NOT A FUNCTION. This should not happen if it is an instance.');
        return "";
    }
    const scrambleSequence = logicCubeRef.current.scramble(numMoves);
    
    if (setIsLoadingCallback && typeof setIsLoadingCallback === 'function') setIsLoadingCallback(true);
    const moves = scrambleSequence.split(' ');
    for (const move of moves) {
        if (move) await performVisualRotation(move);
    }
    if (setIsLoadingCallback && typeof setIsLoadingCallback === 'function') setIsLoadingCallback(false);
    
    setCubeState(logicCubeRef.current.getCubeState());
    setIsSolvedState(logicCubeRef.current.isSolved());
    return scrambleSequence;
  // Line 1794 from your error log points to this useCallback. Removing 'updateVisuals'.
  }, [performVisualRotation, setIsLoadingCallback]); // <<<<====== 'updateVisuals' REMOVED HERE

  const getStateString = useCallback(() => {
    if (!logicCubeRef.current || !(logicCubeRef.current instanceof RubiksCubeLogic)) return "";
    return (typeof logicCubeRef.current.getStateString === 'function') 
           ? logicCubeRef.current.getStateString() 
           : "";
  }, []);

  const toggleCubeColorMode = useCallback(() => {
    setCurrentColorMode(prev => {
        const newMode = prev === 'standard' ? 'colorblind_TODO' : 'standard';
        console.log("[useCube] Color mode toggled to:", newMode, ". Visual update needs proper colorblind_TODO colors in createVisualCube.");
        return newMode;
    });
    updateVisuals();
  }, [updateVisuals]); // updateVisuals is correctly a dependency here because it's called.

  return {
    containerRef,
    cubeState,
    isSolved: isSolvedState,
    resetCube: resetCubeHook,
    applyMove,
    scrambleCube,
    getStateString,
    toggleCubeColorMode,
    isDraggingFace: dragStateRef.current.isDraggingFace
  };
};

export default useCube;