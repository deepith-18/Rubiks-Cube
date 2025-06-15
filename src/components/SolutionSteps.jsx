import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCw, SkipBack, SkipForward, Rewind, FastForward } from 'lucide-react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
const SolutionSteps = ({ 
  solution = [], 
  currentStep = -1, 
  isPlaying = false,
  onPlay,
  onPause,
  onReset,
  onStepSelect,
  onStepForward,
  onStepBackward,
  onSpeedUp,
  onSpeedDown,
  playbackSpeed = 1
}) => {
  const stepsContainerRef = useRef(null);
  const activeStepRef = useRef(null);

  // Description of notation 
  const notationGuide = {
    'F': 'Front face clockwise',
    'F\'': 'Front face counter-clockwise',
    'F2': 'Front face 180°',
    'B': 'Back face clockwise',
    'B\'': 'Back face counter-clockwise',
    'B2': 'Back face 180°',
    'U': 'Up face clockwise',
    'U\'': 'Up face counter-clockwise',
    'U2': 'Up face 180°',
    'D': 'Down face clockwise',
    'D\'': 'Down face counter-clockwise',
    'D2': 'Down face 180°',
    'L': 'Left face clockwise',
    'L\'': 'Left face counter-clockwise',
    'L2': 'Left face 180°',
    'R': 'Right face clockwise',
    'R\'': 'Right face counter-clockwise',
    'R2': 'Right face 180°',
  };

  // Scroll to active step when it changes
  useEffect(() => {
    if (activeStepRef.current && stepsContainerRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentStep]);

  // If no solution, show a message
  if (solution.length === 0) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg text-gray-300 text-center">
        <p>No solution available. Enter your cube state and click "Solve" to begin.</p>
      </div>
    );
  }

  // Format the solution for display including move counts
  const moveCount = solution.length;
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 text-white">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Solution Steps</h3>
          <div className="text-sm">
            <span className="text-green-400 font-mono">{moveCount}</span> moves
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
              aria-label="Reset"
            >
              <RotateCw size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onStepBackward}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white" 
              aria-label="Step backward"
              disabled={currentStep <= 0}
            >
              <SkipBack size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={isPlaying ? onPause : onPlay}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onStepForward}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
              aria-label="Step forward"
              disabled={currentStep >= solution.length - 1}
            >
              <SkipForward size={16} />
            </motion.button>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onSpeedDown}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
              aria-label="Slow down"
              disabled={playbackSpeed <= 0.5}
            >
              <Rewind size={16} />
            </motion.button>
            <span className="text-white text-sm">
              {playbackSpeed}x
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onSpeedUp}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
              aria-label="Speed up"
              disabled={playbackSpeed >= 2}
            >
              <FastForward size={16} />
            </motion.button>
          </div>
        </div>

        {/* Steps display */}
        <div 
          ref={stepsContainerRef}
          className="flex flex-wrap gap-2 overflow-y-auto max-h-36 p-2 bg-gray-900 rounded-md"
        >
          {solution.map((move, index) => (
            <motion.button
              key={index}
              ref={index === currentStep ? activeStepRef : null}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStepSelect(index)}
              className={`
                min-w-8 h-8 px-2 rounded flex items-center justify-center font-mono text-sm
                ${index === currentStep 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                  : index < currentStep 
                    ? 'bg-gray-600 text-gray-300' 
                    : 'bg-gray-700 text-gray-400'
                }
                transition-colors
              `}
              title={notationGuide[move] || move}
            >
              {move}
            </motion.button>
          ))}
        </div>

        {/* Current move description */}
        {currentStep >= 0 && currentStep < solution.length && (
          <div className="mt-3 text-gray-300 text-sm">
            <p className="italic">
              {notationGuide[solution[currentStep]] || `Performing move: ${solution[currentStep]}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionSteps;