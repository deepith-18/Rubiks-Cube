import React from 'react';
import PropTypes from 'prop-types';

function Button({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyle = 'px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };
  const disabledStyle = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? disabledStyle : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;