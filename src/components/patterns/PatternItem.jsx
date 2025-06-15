import React from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

function PatternItem({ pattern, onApply, disabled }) {
  return (
    <div className="border rounded-lg p-2 flex flex-col items-center text-center shadow hover:shadow-md transition-shadow">
      <img
        // Use require for static assets in CRA, or adjust based on your bundler setup
        src={require(`../../assets/images/${pattern.previewImage}`)}
        alt={pattern.name}
        className="w-full h-24 object-contain mb-2 border" // Adjust styling as needed
      />
      <p className="text-sm font-medium mb-2">{pattern.name}</p>
      <Button onClick={onApply} variant="secondary" size="sm" disabled={disabled} className="w-full text-xs">
        Apply Pattern
      </Button>
    </div>
  );
}

PatternItem.propTypes = {
  pattern: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    previewImage: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired, // The cube state string for this pattern
  }).isRequired,
  onApply: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default PatternItem;