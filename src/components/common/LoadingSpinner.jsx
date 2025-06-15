import React from 'react';

// Simple Tailwind CSS based spinner
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center my-4" aria-label="Loading">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
}

// // Alternative SVG Spinner (more customizable)
// function LoadingSpinnerSVG() {
//   return (
//     <div className="flex justify-center items-center my-4" aria-label="Loading">
//        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//       </svg>
//       <span className="ml-3 text-gray-600">Loading...</span>
//     </div>
//   );
// }


export default LoadingSpinner; // Or LoadingSpinnerSVG