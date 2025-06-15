import React from 'react';
import { motion } from 'framer-motion';

const CUBE_COLORS = [
  { name: 'white', hex: '#FFFFFF', border: '#CCCCCC' },
  { name: 'yellow', hex: '#FFFF00', border: '#CCCC00' },
  { name: 'green', hex: '#00FF00', border: '#00CC00' },
  { name: 'blue', hex: '#0000FF', border: '#0000CC' },
  { name: 'red', hex: '#FF0000', border: '#CC0000' },
  { name: 'orange', hex: '#FFA500', border: '#CC8400' },
];

const ColorPicker = ({ selectedColor, setSelectedColor }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white text-lg font-medium mb-3">Select Color</h3>
      <div className="grid grid-cols-3 gap-3">
        {CUBE_COLORS.map((color) => (
          <motion.button
            key={color.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedColor(color.name)}
            className={`w-10 h-10 rounded-md flex items-center justify-center ${
              selectedColor === color.name ? 'ring-2 ring-white' : ''
            }`}
            style={{
              backgroundColor: color.hex,
              border: `2px solid ${color.border}`,
            }}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
      <div className="mt-4 text-gray-300 text-sm">
        <p>Selected: <span className="font-bold capitalize">{selectedColor}</span></p>
      </div>
    </div>
  );
};

export default ColorPicker;