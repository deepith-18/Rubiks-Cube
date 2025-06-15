// RubiksCubeSolver.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// --- Utility Functions (keep as is) ---
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

const solveCubeReverseScramble = (scrambleSequence) => {
  console.log("Demo 'solving' by reversing scramble:", scrambleSequence);
  if (!scrambleSequence) return Promise.resolve("");
  const moves = scrambleSequence.split(' ').filter(m => m);
  const inverseMoves = moves.map(getInverseMove).reverse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(inverseMoves.join(' '));
    }, 100);
  });
};
// --- End Utility Functions ---


export default function RubiksCubeSolver() {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [cube, setCube] = useState(null); // THREE.Group for the Rubik's Cube

  // Refs for THREE.js objects and interaction state
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseNDCRef = useRef(new THREE.Vector2()); // Normalized Device Coordinates

  const dragStateRef = useRef({
    isDraggingFace: false,
    startPointerScreenPos: new THREE.Vector2(), // Screen pixels
    intersectedCubelet: null,
    intersectedFaceLocalNormal: null, // Normal in cubelet's local space
    moveExecutedInDrag: false,
    originalOrbitControlsEnabled: true,
  });


  const [isLoading, setIsLoading] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [moveSequence, setMoveSequence] = useState('');
  const [solution, setSolution] = useState('');
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
    newCamera.position.set(6, 6, 9);
    newCamera.lookAt(0, 0, 0);
    cameraRef.current = newCamera; // Store in ref

    const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    newRenderer.setSize(rect.width, rect.height);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = newRenderer; // Store in ref
    currentMount.appendChild(newRenderer.domElement);

    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.minDistance = 5;
    newControls.maxDistance = 25;
    controlsRef.current = newControls; // Store in ref

    setScene(newScene);

    const handleResize = () => {
      if (!currentMount || !cameraRef.current || !rendererRef.current) return;
      const resizeRect = currentMount.getBoundingClientRect();
      cameraRef.current.aspect = resizeRect.width / resizeRect.height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(resizeRect.width, resizeRect.height);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controlsRef.current.update();
      rendererRef.current.render(newScene, cameraRef.current);
    };
    animate();
    console.log("Scene useEffect: Setup complete, animation started.");

    return () => {
      console.log("Scene useEffect: Cleaning up...");
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controlsRef.current.dispose();
      if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode === currentMount) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
      console.log("Scene useEffect: Cleanup finished.");
    };
  }, []); // Mount and unmount only

  // Cube Creation Effect (remains largely the same)
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
          // Store initial position for potential resets or complex logic
          cubelet.userData.initialX = x;
          cubelet.userData.initialY = y;
          cubelet.userData.initialZ = z;
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


  const getFaceCubelets = useCallback((faceSymbol) => {
    if (!cube) return [];
    const faceCubelets = [];
    const threshold = (1 * (1 + 0.07)) * 0.4; // cubeletSize * (1 + spacing_factor_approx) * 0.4

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
  }, [cube]);

  const rotateFace = useCallback(async (move) => {
    if (!cube || !scene || isLoading || isSolving) {
      console.warn("rotateFace: Conditions not met.", { cube:!!cube, scene:!!scene, isLoading, isSolving });
      return;
    }
    if (!move || move.length === 0) {
      console.warn("rotateFace: Empty move received.");
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
      default: console.warn(`Unknown move base: ${baseFace} in move: ${move}`); return;
    }

    const selectedCubelets = getFaceCubelets(baseFace);
    if (selectedCubelets.length === 0) {
      console.warn(`No cubelets found for face ${baseFace}. Move: ${move}, Total children: ${cube.children.length}`);
      return;
    }

    const pivot = new THREE.Object3D();
    scene.add(pivot);
    selectedCubelets.forEach(cubelet => pivot.attach(cubelet));

    return new Promise(resolve => {
      const initialPivotOrientation = new THREE.Quaternion();
      const targetPivotOrientation = new THREE.Quaternion().setFromAxisAngle(axisVector.normalize(), angle);
      const animationDuration = 200;
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
            cubelet.updateMatrixWorld(true); // Ensure world matrix is up-to-date
            cube.attach(cubelet); // Re-attach to the main cube group
          });
          scene.remove(pivot);
          resolve();
        }
      };
      animateRotation();
    });
  }, [cube, scene, isLoading, isSolving, getFaceCubelets]);


  // --- Mouse Interaction Logic ---
  useEffect(() => {
    const domElement = rendererRef.current?.domElement;
    if (!domElement || !cube || !cameraRef.current || !controlsRef.current) return;

    const handlePointerDown = async (event) => {
      if (isLoading || isSolving) return;

      const rect = domElement.getBoundingClientRect();
      mouseNDCRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDCRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseNDCRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(cube.children);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        if (intersection.object.isMesh) {
          dragStateRef.current.isDraggingFace = true;
          dragStateRef.current.startPointerScreenPos.set(event.clientX, event.clientY);
          dragStateRef.current.intersectedCubelet = intersection.object;
          // face.normal is in object local space. For a non-rotated cubelet, this is fine.
          // After rotations, cubelet's quaternion matters for world normal.
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
      if (!dragState.isDraggingFace || dragState.moveExecutedInDrag || isLoading || isSolving) {
        return;
      }

      const deltaX = event.clientX - dragState.startPointerScreenPos.x;
      const deltaY = event.clientY - dragState.startPointerScreenPos.y;
      const dragThreshold = 15; // pixels

      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        dragState.moveExecutedInDrag = true; // Only one move per drag action

        const { intersectedCubelet, intersectedFaceLocalNormal } = dragState;
        if (!intersectedCubelet || !intersectedFaceLocalNormal) return;

        // Determine World Normal of Clicked Sticker
        const cubeletWorldQuaternion = intersectedCubelet.getWorldQuaternion(new THREE.Quaternion());
        const worldStickerNormal = intersectedFaceLocalNormal.clone().applyQuaternion(cubeletWorldQuaternion).round(); // .round() to snap to axes

        // Determine dominant axis of this worldStickerNormal
        let stickerMainAxisIndex = 0; // 0:X, 1:Y, 2:Z
        if (Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.x) && Math.abs(worldStickerNormal.y) > Math.abs(worldStickerNormal.z)) {
            stickerMainAxisIndex = 1; // Y-axis dominant (U/D face sticker)
        } else if (Math.abs(worldStickerNormal.z) > Math.abs(worldStickerNormal.x)) {
            stickerMainAxisIndex = 2; // Z-axis dominant (F/B face sticker)
        } // Else X-axis is dominant (R/L face sticker)

        const horizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);
        let moveChar = '';
        let directionSign = 1; // 1 for normal, -1 for prime
        
        // Simplified mapping:
        // This logic is highly dependent on camera view and may need significant refinement for intuitive control from all angles.
        const cubeletPos = intersectedCubelet.position;
        const facePosThreshold = 0.5; // Approx half of cubeletSize

        if (stickerMainAxisIndex === 0) { // Clicked R/L sticker (X-dominant normal)
            if (horizontalDrag) { // Rotate U/D slice
                moveChar = cubeletPos.y > facePosThreshold ? 'U' : (cubeletPos.y < -facePosThreshold ? 'D' : '');
                directionSign = (deltaX * worldStickerNormal.x > 0) ? -1 : 1; // drag right on R face (norm.x >0) should be U'
            } else { // Rotate F/B slice
                moveChar = cubeletPos.z > facePosThreshold ? 'F' : (cubeletPos.z < -facePosThreshold ? 'B' : '');
                directionSign = (deltaY * worldStickerNormal.x < 0) ? -1 : 1; // drag up on R face (norm.x >0) should be F
            }
        } else if (stickerMainAxisIndex === 1) { // Clicked U/D sticker (Y-dominant normal)
            if (horizontalDrag) { // Rotate F/B slice
                moveChar = cubeletPos.z > facePosThreshold ? 'F' : (cubeletPos.z < -facePosThreshold ? 'B' : '');
                directionSign = (deltaX * worldStickerNormal.y < 0) ? -1 : 1; // drag right on U face (norm.y >0) should be F
            } else { // Rotate R/L slice
                moveChar = cubeletPos.x > facePosThreshold ? 'R' : (cubeletPos.x < -facePosThreshold ? 'L' : '');
                directionSign = (deltaY * worldStickerNormal.y > 0) ? -1 : 1; // drag up on U face (norm.y >0) should be R'
            }
        } else { // Clicked F/B sticker (Z-dominant normal)
            if (horizontalDrag) { // Rotate U/D slice
                moveChar = cubeletPos.y > facePosThreshold ? 'U' : (cubeletPos.y < -facePosThreshold ? 'D' : '');
                directionSign = (deltaX * worldStickerNormal.z < 0) ? -1 : 1; // drag right on F face (norm.z >0) should be U
            } else { // Rotate R/L slice
                moveChar = cubeletPos.x > facePosThreshold ? 'R' : (cubeletPos.x < -facePosThreshold ? 'L' : '');
                directionSign = (deltaY * worldStickerNormal.z < 0) ? -1 : 1; // drag up on F face (norm.z >0) should be R
            }
        }

        if (moveChar) {
          let finalMove = moveChar;
          if (directionSign === -1) finalMove += "'";
          
          // Prevent self-rotation on center pieces if logic implies it (e.g. U from U-center)
          const isCenterPiece = (intersectedCubelet.userData.initialX === 0 && intersectedCubelet.userData.initialY === 0) ||
                                (intersectedCubelet.userData.initialX === 0 && intersectedCubelet.userData.initialZ === 0) ||
                                (intersectedCubelet.userData.initialY === 0 && intersectedCubelet.userData.initialZ === 0);
          if (isCenterPiece && moveChar.toLowerCase() === ['r','l','u','d','f','b'][stickerMainAxisIndex*2 + (worldStickerNormal.getComponent(stickerMainAxisIndex) > 0 ? 0 : 1)]) {
             console.log("Skipping self-rotation of center piece sticker.");
          } else {
            setIsLoading(true); // Visually indicate processing the move
            await rotateFace(finalMove);
            setIsLoading(false);
          }
        } else {
            console.log("Could not determine move (likely middle slice drag or center piece confusion).");
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
    
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove); // Use window for move to catch drags outside canvas
    window.addEventListener('pointerup', handlePointerUp); // Use window for up

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [cube, rotateFace, isLoading, isSolving]); // Dependencies for setting up listeners


  // --- Action Handlers (scramble, solve, etc.) ---
  const handleScramble = async () => {
    if (isLoading || isSolving || dragStateRef.current.isDraggingFace) return;
    setIsLoading(true);
    setSolution(''); setCurrentStep(0);
    const newScrambleSequence = generateRandomState();
    setMoveSequence(newScrambleSequence);
    if (cube) cube.quaternion.identity();
    const moves = newScrambleSequence.split(' ').filter(m => m);
    for (const move of moves) {
      await rotateFace(move);
    }
    setIsLoading(false);
  };

  const handleSolve = async () => {
    if (isLoading || isSolving || dragStateRef.current.isDraggingFace) return;
    setIsSolving(true);
    setCurrentStep(0);
    try {
      const solutionSequence = await solveCubeReverseScramble(moveSequence);
      setSolution(solutionSequence);
    } catch (error) {
      console.error('Error solving cube:', error); setSolution('');
    } finally {
      setIsSolving(false);
    }
  };

  const executeSingleStep = async () => {
    if (!solution || isLoading || isSolving || dragStateRef.current.isDraggingFace) return;
    const moves = solution.split(' ').filter(m => m);
    if (currentStep >= moves.length) return;
    setIsLoading(true);
    const currentMove = moves[currentStep];
    await rotateFace(currentMove);
    setCurrentStep(prev => prev + 1);
    setIsLoading(false);
  };

  const executeAllSolutionSteps = async () => {
    if (!solution || isLoading || isSolving || dragStateRef.current.isDraggingFace) return;
    const moves = solution.split(' ').filter(m => m);
    if (currentStep >= moves.length) return;
    setIsLoading(true);
    let tempStep = currentStep;
    try {
      while (tempStep < moves.length) {
        const currentMove = moves[tempStep];
        await rotateFace(currentMove);
        tempStep++;
        setCurrentStep(tempStep);
      }
    } catch (error) {
      console.error("Error during executeAllSolutionSteps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleColorMode = () => {
    if (isLoading || isSolving || dragStateRef.current.isDraggingFace) {
      console.warn("Cannot change color mode while an operation is in progress.");
      return;
    }
    setMoveSequence(''); setSolution(''); setCurrentStep(0);
    setColorMode(prevMode => prevMode === 'standard' ? 'colorblind' : 'standard');
  };

  // --- JSX (no changes from your provided good version) ---
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
              disabled={isLoading || isSolving || dragStateRef.current.isDraggingFace}
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
              <li>Click and drag the cube background to rotate your view.</li>
              <li>Click and drag on a cube face to rotate that slice.</li>
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
                <div className={`animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 ${isSolving ? 'border-green-500' : (dragStateRef.current.isDraggingFace ? 'border-purple-500' : 'border-blue-500') }`}></div>
                <p className="font-medium text-md sm:text-lg text-gray-700">
                  {isSolving ? 'Processing...' : (isLoading ? (solution && currentStep < solution.split(' ').filter(m=>m).length && !dragStateRef.current.isDraggingFace ? 'Applying Solution...' : (dragStateRef.current.isDraggingFace ? 'Rotating...' : 'Scrambling...')) : '')}
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
              <div className="grid grid-cols-1 gap-3"> 
                <button onClick={handleScramble} disabled={isLoading || isSolving || dragStateRef.current.isDraggingFace} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  Scramble
                </button>
                <button onClick={handleSolve} disabled={isLoading || isSolving || !moveSequence || dragStateRef.current.isDraggingFace} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400">
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
                          style={{ width: `${(currentStep / (Math.max(1,solution.split(' ').filter(m => m).length))) * 100}%` }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={executeSingleStep}
                    disabled={isLoading || isSolving || currentStep >= solution.split(' ').filter(m => m).length || dragStateRef.current.isDraggingFace}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Next Step
                  </button>
                  <button
                    onClick={executeAllSolutionSteps}
                    disabled={isLoading || isSolving || currentStep >= solution.split(' ').filter(m => m).length || dragStateRef.current.isDraggingFace}
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