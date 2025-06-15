import React, { useEffect, useRef } from 'react';
import { fadeIn } from '../lib/animations';

const CubeViewer = ({ cubeHook }) => {
  const viewerRef = useRef(null);
  
  // Connect the cube hook to the viewer container
  useEffect(() => {
    if (viewerRef.current) {
      cubeHook.containerRef.current = viewerRef.current;
      
      // Apply fade-in animation to viewer
      const viewerElement = viewerRef.current;
      fadeIn(viewerElement, { duration: 0.8 });
    }
  }, [cubeHook]);
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={viewerRef} 
        className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-gradient-to-b from-gray-800 to-gray-900"
      ></div>
      
      {/* Loading indicator */}
      {cubeHook.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-white text-xl animate-pulse">Loading 3D Cube...</div>
        </div>
      )}
      
      {/* Error message */}
      {cubeHook.error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-2 rounded-md shadow-lg">
          <p className="text-sm">{cubeHook.error}</p>
        </div>
      )}
      
      {/* Camera control hints */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded-md">
        <p>Drag to rotate</p>
        <p>Scroll to zoom</p>
      </div>
    </div>
  );
};

export default CubeViewer;