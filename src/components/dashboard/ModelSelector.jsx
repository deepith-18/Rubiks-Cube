import React from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

const MODES = {
  PLAY: 'play',
  INPUT: 'input',
  PATTERNS: 'patterns',
};

function ModeSelector({ currentMode, onSelectMode }) {
  return (
    <div className="flex space-x-2 my-4 justify-center">
      <Button
        onClick={() => onSelectMode(MODES.PLAY)}
        variant={currentMode === MODES.PLAY ? 'primary' : 'secondary'}
      >
        Play Random
      </Button>
      <Button
        onClick={() => onSelectMode(MODES.INPUT)}
        variant={currentMode === MODES.INPUT ? 'primary' : 'secondary'}
      >
        Input Colors
      </Button>
      <Button
        onClick={() => onSelectMode(MODES.PATTERNS)}
        variant={currentMode === MODES.PATTERNS ? 'primary' : 'secondary'}
      >
        Patterns
      </Button>
    </div>
  );
}

ModeSelector.propTypes = {
  currentMode: PropTypes.string.isRequired,
  onSelectMode: PropTypes.func.isRequired,
};

export { MODES }; // Export MODES constant
export default ModeSelector;