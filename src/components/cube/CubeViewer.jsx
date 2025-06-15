import React, { useRef, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RubiksCubeModel from '../../models/RubiksCube'; // IMPORT YOUR ACTUAL 3D CUBE MODEL COMPONENT
import { useCubeContext } from '../../store/CubeContext'; // Adjust path

// Placeholder for fallback content while the model loads
function Loader() {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}


function CubeViewer({ cubeState }) {
  const { currentMode, selectedColorKey, setCubeState } = useCubeContext(); // Get context state/setters
  const controlsRef = useRef(); // Ref for OrbitControls if needed

  // --- CLICK HANDLING FOR INPUT MODE ---
  const handleStickerClick = (faceIndex, stickerIndex) => {
      if (currentMode !== 'input' || !selectedColorKey) {
          console.log("Click ignored: Not in input mode or no color selected.");
          return; // Only handle clicks in input mode with a color selected
      }

      console.log(`Clicked on Face ${faceIndex}, Sticker ${stickerIndex}. Applying color: ${selectedColorKey}`);

      // TODO: Implement the logic to update the cubeState string based on the click.
      // This is the complex part and depends HEAVILY on how your cubeState string
      // is structured and how you map face/sticker indices to string positions.
      setCubeState(prevState => {
          // 1. Calculate the string index corresponding to faceIndex/stickerIndex
          // const stringIndex = calculateStringIndex(faceIndex, stickerIndex); // You need this function
          // 2. Create the new state string by replacing the character at stringIndex
          // const newStateArray = prevState.split('');
          // newStateArray[stringIndex] = selectedColorKey; // Use the selected color KEY ('U', 'F', etc.)
          // return newStateArray.join('');
          console.warn("Color application logic not implemented in CubeViewer/setCubeState");
          return prevState; // Return previous state until implemented
      });
  };


  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg">
      <Canvas camera={{ position: [4, 4, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -5, -10]} intensity={0.5} color="#AAAAFF" />

        <Suspense fallback={<Loader />}>
          {/* Replace RubiksCubeModel with YOUR actual 3D cube component */}
          {/* Pass necessary props: */}
          <RubiksCubeModel
            cubeStateString={cubeState} // Pass the state string to your model
            isInteractive={currentMode === 'input'} // Enable interaction only in input mode
            onStickerClick={handleStickerClick} // Pass the click handler
            // Add any other props your model needs (size, position, animation state?)
            position={[0, 0, 0]}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true} // Allow rotation
          // Configure rotation limits, damping, etc. as needed
          // minPolarAngle={Math.PI / 4}
          // maxPolarAngle={Math.PI - Math.PI / 4}
          // dampingFactor={0.1}
        />
      </Canvas>
    </div>
  );
}

CubeViewer.propTypes = {
  // The string representation of the cube's state
  cubeState: PropTypes.string.isRequired,
};

export default CubeViewer;