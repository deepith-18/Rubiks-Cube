import React from 'react';
import { useCubeContext } from '../../store/CubeContext'; // Adjust path if needed
import Button from '../common/Button'; // Assuming you have a Button component
// Import icons if you have them (e.g., from react-icons)
// import { FaUndo, FaRedo, FaArrowsAltH, FaArrowsAltV } from 'react-icons/fa';

function CubeControls() {
  const { applyMove } = useCubeContext(); // Get applyMove function

  // --- Placeholder Functions ---
  // These would interact with your 3D viewer's controls (e.g., OrbitControls instance)
  const handleRotateViewHorizontal = (direction) => {
    console.log(`TODO: Rotate view horizontally (${direction > 0 ? 'right' : 'left'})`);
    // Example: access OrbitControls ref and call rotateLeft/rotateRight
  };

  const handleRotateViewVertical = (direction) => {
    console.log(`TODO: Rotate view vertically (${direction > 0 ? 'down' : 'up'})`);
    // Example: access OrbitControls ref and call rotateUp/rotateDown
  };

  const handleResetView = () => {
     console.log("TODO: Reset camera view to default position");
     // Example: access OrbitControls ref and call reset()
  };

  // --- Face Turn Functions ---
  // These call the applyMove function from the context
  const handleFaceTurn = (move) => {
    if (applyMove) {
      applyMove(move);
    } else {
      console.error("applyMove function is not available in CubeContext");
    }
  };

  // Example face turn buttons (add more as needed)
  // You might want a more visual interface than just buttons for turns
  const faceMoves = ['U', 'U\'', 'F', 'F\'', 'R', 'R\'', 'L', 'L\'', 'B', 'B\'', 'D', 'D\''];
  // Add middle layer moves if desired: M, M', E, E', S, S'
  // Add wide moves if desired: u, u', f, f', r, r', l, l', b', b', d, d'

  return (
    <div className="p-4 space-y-4">

       {/* View Controls (Placeholder) */}
      {/* <div className="space-y-2">
        <h4 className="font-semibold text-center text-sm text-gray-600">View Controls</h4>
        <div className="flex justify-center space-x-2">
           <Button onClick={() => handleRotateViewHorizontal(-1)} size="sm" title="Rotate Left"> L </Button>
           <Button onClick={() => handleRotateViewVertical(1)} size="sm" title="Rotate Up"> U </Button>
           <Button onClick={() => handleRotateViewVertical(-1)} size="sm" title="Rotate Down"> D </Button>
           <Button onClick={() => handleRotateViewHorizontal(1)} size="sm" title="Rotate Right"> R </Button>
        </div>
         <div className="text-center">
             <Button onClick={handleResetView} size="sm" variant="secondary">Reset View</Button>
         </div>
      </div> */}


      {/* Face Turn Controls (Example) */}
      <div className="space-y-2">
         <h4 className="font-semibold text-center text-sm text-gray-600">Face Turns</h4>
         <div className="grid grid-cols-4 gap-2">
            {faceMoves.map(move => (
              <Button
                key={move}
                onClick={() => handleFaceTurn(move)}
                variant="secondary"
                className="text-xs sm:text-sm" // Smaller text on small screens
                title={`Perform ${move} move`}
              >
                {move}
              </Button>
            ))}
         </div>
      </div>

       {/* Add more controls as needed (e.g., full cube rotation X, Y, Z) */}

    </div>
  );
}

// No props needed if using context directly, but might need callbacks otherwise
// CubeControls.propTypes = {};

export default CubeControls;