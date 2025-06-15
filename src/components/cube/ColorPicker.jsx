import React from 'react';
import PropTypes from 'prop-types';

// Define your cube face colors (match these with your RubiksCube model/viewer)
const CUBE_COLORS = {
  // Example using common notation, adjust keys/values as needed
  U: { name: 'White', code: '#FFFFFF', textColor: 'text-black border border-gray-300' },
  F: { name: 'Green', code: '#009B48', textColor: 'text-white' },
  R: { name: 'Red', code: '#B71234', textColor: 'text-white' },
  B: { name: 'Blue', code: '#0046AD', textColor: 'text-white' },
  L: { name: 'Orange', code: '#FF5800', textColor: 'text-white' },
  D: { name: 'Yellow', code: '#FFD500', textColor: 'text-black border border-gray-400' },
  // Add a 'Gray' or 'Empty' color if needed for resetting stickers
  // Empty: { name: 'Empty', code: '#808080', textColor: 'text-white' },
};

function ColorPicker({ selectedColorKey, onSelectColor }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-2 bg-gray-100 rounded-md">
      {Object.entries(CUBE_COLORS).map(([key, color]) => (
        <button
          key={key}
          onClick={() => onSelectColor(key)} // Pass the key (e.g., 'U', 'F') back
          className={`w-10 h-10 rounded-md ${color.textColor} flex items-center justify-center font-bold text-sm shadow transition-transform duration-150 ease-in-out ${selectedColorKey === key ? 'ring-2 ring-offset-1 ring-black scale-110' : 'hover:scale-105'}`}
          style={{ backgroundColor: color.code }}
          title={color.name}
          aria-label={`Select ${color.name} color`}
        >
          {/* Optionally display the key (U, F, R...) */}
           {/* {key} */}
        </button>
      ))}
    </div>
  );
}

ColorPicker.propTypes = {
  // The key ('U', 'F', etc.) of the currently selected color
  selectedColorKey: PropTypes.string,
  // Function to call when a color is selected, passing the color key
  onSelectColor: PropTypes.func.isRequired,
};

export default ColorPicker;