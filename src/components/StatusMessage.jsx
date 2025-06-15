import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, XCircle, AlertCircle } from 'lucide-react';

const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

const StatusMessage = ({
  message,
  type = MESSAGE_TYPES.INFO,
  isVisible = false,
  duration = 5000,
  onClose
}) => {
  // Auto-hide message after duration
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
     
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // Return null if not visible
  if (!message || !isVisible) return null;

  // Determine styles based on message type
  const getTypeStyles = () => {
    switch (type) {
      case MESSAGE_TYPES.SUCCESS:
        return {
          bg: 'bg-green-600',
          icon: <CheckCircle size={20} />,
          border: 'border-green-400'
        };
      case MESSAGE_TYPES.ERROR:
        return {
          bg: 'bg-red-600',
          icon: <AlertTriangle size={20} />,
          border: 'border-red-400'
        };
      case MESSAGE_TYPES.WARNING:
        return {
          bg: 'bg-yellow-600',
          icon: <AlertTriangle size={20} />,
          border: 'border-yellow-400'
        };
      case MESSAGE_TYPES.INFO:
      default:
        return {
          bg: 'bg-blue-600',
          icon: <Info size={20} />,
          border: 'border-blue-400'
        };
    }
  };

  const { bg, icon, border } = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg ${bg} text-white shadow-lg border-l-4 ${border} max-w-md`}
        >
          <div className="mr-3 flex-shrink-0">
            {icon}
          </div>
          <div className="mr-2 flex-grow">
            <p className="text-sm">{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto flex-shrink-0 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
         
          {/* Progress bar for auto-close */}
          {duration > 0 && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Export the component and message types
export { StatusMessage, MESSAGE_TYPES };
export default StatusMessage;