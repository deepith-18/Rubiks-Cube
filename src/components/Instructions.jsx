import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

const Instructions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const instructionSteps = [
    {
      title: 'Interact with the Cube',
      details: 'Click and drag on the cube to rotate it and view all sides. Hold Shift while dragging to rotate individual faces.'
    },
    {
      title: 'Input the Cube State',
      details: 'Select a color from the color picker, then click on the cube faces to apply the color to each square.'
    },
    {
      title: 'Solve the Cube',
      details: 'Once you\'ve entered your cube\'s state, click "Solve" to find the solution. The solution will be animated on the 3D cube.'
    },
    {
      title: 'View Solution Steps',
      details: 'Each move of the solution is displayed in standard cube notation. Click on any step to jump to that point in the solution.'
    },
    {
      title: 'Reset or Randomize',
      details: 'Use the "Reset" button to clear your input, or "Randomize" to create a random scramble.'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-white bg-gray-700 hover:bg-gray-600 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          <Lightbulb size={18} className="mr-2" />
          <span className="font-medium">How to Use the Cube Solver</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-3 text-gray-300"
          >
            <ol className="space-y-4">
              {instructionSteps.map((step, index) => (
                <li key={index} className="pb-3 border-b border-gray-700 last:border-0">
                  <h3 className="font-medium text-white mb-1">{index + 1}. {step.title}</h3>
                  <p className="text-sm">{step.details}</p>
                </li>
              ))}
            </ol>
            <div className="mt-4 pt-3 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                <span className="font-bold">Tip:</span> For best results, make sure your cube input is accurate. 
                The standard color scheme has white opposite yellow, blue opposite green, and red opposite orange.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Instructions;