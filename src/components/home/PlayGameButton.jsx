import React from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import '../../styles/animations.css'; // Ensure this path is correct

function PlayGameButton({ onClick }) {
  return (
    <div className="mt-8 flex justify-center">
      <Button
        onClick={onClick}
        variant="primary"
        className="text-xl px-8 py-4 rounded-full shadow-lg transform hover:scale-105 play-button-pulse" // Added pulse animation class
      >
        Enter Solver
      </Button>
    </div>
  );
}

PlayGameButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default PlayGameButton;