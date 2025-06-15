import React from 'react';
import PropTypes from 'prop-types';

function StatusMessage({ message, type = 'info', onClose }) {
  if (!message) return null;

  const baseStyle = 'p-4 rounded-md my-4 shadow relative';
  const typeStyles = {
    error: 'bg-red-100 border border-red-400 text-red-700',
    success: 'bg-green-100 border border-green-400 text-green-700',
    info: 'bg-blue-100 border border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]}`} role="alert">
      <p>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3 text-lg font-semibold"
          aria-label="Close message"
        >
           × {/* Multiplication sign for close 'X' */}
        </button>
      )}
    </div>
  );
}

StatusMessage.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
  onClose: PropTypes.func, // Callback function to close/dismiss the message
};

export default StatusMessage;