import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ isLoading, message = "Solving cube..." }) => {
  if (!isLoading) return null;

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1.5
  };

  const cubeColors = ['#FFA500', '#FF0000', '#FFFFFF', '#FFFF00', '#00FF00', '#0000FF'];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="flex flex-col items-center">
        <div className="relative h-16 w-16">
          {cubeColors.map((color, index) => (
            <motion.div
              key={index}
              className="absolute top-0 left-0 right-0 bottom-0 rounded-md"
              style={{
                backgroundColor: color,
                opacity: 0.8,
              }}
              initial={{ scale: 0.5, rotate: index * 60 }}
              animate={{
                scale: [0.5, 0.8, 0.5],
                rotate: [index * 60, index * 60 + 360]
              }}
              transition={{
                scale: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: index * 0.1,
                  repeatType: "reverse"
                },
                rotate: {
                  ...spinTransition,
                  delay: index * 0.1
                }
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-white font-medium"
        >
          {message}
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-1 bg-blue-500 rounded-full mt-2"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;