import React from 'react';
import Button from '../common/Button';
import { useCubeContext } from '../../store/CubeContext'; // Adjust path
import ColorPicker from '../cube/ColorPicker'; // Assuming you have this

function InputModeControls() {
  const { solveCube, resetCubeState, selectedColor, setSelectedColor, currentMode, isLoading } = useCubeContext();

   if (currentMode !== 'input') return null; // Only show if in input mode

   const handleApplyToCube = () => {
     // TODO: Logic to link selectedColor with clicking on CubeViewer faces/stickers
     // This might involve state within CubeViewer or passing callbacks
     console.log("Applying color logic needs implementation in CubeViewer/useCube");
   };

   const handleResetInput = () => {
     // TODO: Implement logic to reset only the user's input colors,
     // potentially reverting to a solved or default state for input.
     // Or maybe just reset the selected color picker state.
     console.log("Reset input colors logic needed");
     // Example: resetCubeState(); // or a more specific reset function
   }

  return (
    <div className="mt-4 flex flex-col items-center space-y-4">
       <p className="text-sm text-gray-600">Select a color, then click on the cube faces/stickers (Implementation needed in CubeViewer).</p>
       <ColorPicker
         selectedColor={selectedColor}
         onSelectColor={setSelectedColor}
       />
      <div className="flex space-x-2 justify-center">
        {/* <Button onClick={handleApplyToCube} disabled={isLoading} variant="secondary">
          Apply Color (WIP)
        </Button> */}
        <Button onClick={handleResetInput} disabled={isLoading} variant="secondary">
           Reset Input (WIP)
        </Button>
        <Button onClick={solveCube} disabled={isLoading} variant="success">
          {isLoading ? 'Solving...' : 'Solve This State'}
        </Button>
      </div>
    </div>
  );
}

export default InputModeControls;