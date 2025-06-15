import React from 'react';
import PropTypes from 'prop-types';
import { MODES } from '../dashboard/ModeSelector'; // Import modes constant

function Instructions({ currentMode }) {
  let instructions;

  switch (currentMode) {
    case MODES.PLAY:
      instructions = (
        <>
          <li>Click <strong>Scramble</strong> to mix up the cube randomly.</li>
          <li>Use the <strong>Cube Controls</strong> (if available) or drag the cube to inspect it.</li>
          <li>Click <strong>Solve</strong> to get the step-by-step solution.</li>
          <li>Use the <strong>Solution Steps</strong> controls below the cube to watch the animation.</li>
        </>
      );
      break;
    case MODES.INPUT:
      instructions = (
        <>
          <li>Select a color from the <strong>Color Picker</strong> above the cube.</li>
          <li>Click on the individual stickers on the <strong>3D Cube</strong> to set their colors.</li>
          <li>Ensure all 54 stickers are colored correctly to match your physical cube.</li>
          <li>Click <strong>Solve This State</strong> to get the solution for your input.</li>
          <li>Use <strong>Reset Input</strong> (WIP) to clear your color entries.</li>
        </>
      );
      break;
    case MODES.PATTERNS:
      instructions = (
        <>
          <li>Browse the available <strong>Patterns</strong> in the gallery.</li>
          <li>Click <strong>Apply Pattern</strong> on any pattern to see it on the 3D cube.</li>
          <li>You can then click <strong>Solve Current Pattern</strong> to see how to solve it from that state.</li>
        </>
      );
      break;
    case 'home': // Instructions for the home page
      instructions = (
         <>
            <li>Our solver helps you solve any valid Rubik's Cube state.</li>
            <li>Use the <strong>Interactive 3D Cube</strong> on the dashboard to input your scramble.</li>
            <li>Explore preset <strong>Patterns</strong> or tackle random scrambles.</li>
            <li>Watch the <strong>Step-by-Step Animation</strong> to learn the solution.</li>
         </>
      );
      break;
    default:
      instructions = (
        <li>Select a mode (Play, Input, Patterns) to get started.</li>
      );
  }

  return (
    <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-md shadow mt-4">
      <h4 className="font-semibold mb-2 text-gray-800">Instructions:</h4>
      <ul className="list-disc list-inside space-y-1">
        {instructions}
      </ul>
    </div>
  );
}

Instructions.propTypes = {
  // The current active mode ('play', 'input', 'patterns', 'home', or other identifier)
  currentMode: PropTypes.string,
};

export default Instructions;