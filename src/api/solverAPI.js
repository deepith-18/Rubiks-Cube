// // API service for the Rubik's Cube solver backend

// // Base URL for the solver API
// // In a real application, this would be replaced with an actual backend URL
// const API_BASE_URL = '/api';

// // Helper function to handle API responses
// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
//     throw new Error(errorData.message || `API error: ${response.status}`);
//   }
//   return response.json();
// };

// // Transform cube state into the format expected by the API
// const formatCubeState = (state) => {
//   // Example format for API: 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
//   const faces = ['U', 'R', 'F', 'D', 'L', 'B']; // Order expected by many Rubik's Cube solvers
//   let formattedState = '';
  
//   faces.forEach(face => {
//     formattedState += state[face].join('');
//   });
  
//   return formattedState;
// };

// // Fetch the solution from the backend
// export const fetchSolution = async (cubeState) => {
//   try {
//     // In a real application, this would make an actual API call
//     // For demo purposes, we'll simulate a backend solver
    
//     // Uncomment for real API implementation:
//     /*
//     const response = await fetch(`${API_BASE_URL}/solve`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         state: formatCubeState(cubeState)
//       }),
//     });
    
//     return handleResponse(response);
//     */
    
//     // Simulated API response for demonstration
//     return await simulateSolver(cubeState);
//   } catch (error) {
//     console.error('Error fetching solution:', error);
//     return {
//       success: false,
//       message: error.message || 'Failed to connect to solver API'
//     };
//   }
// };

// // This simulates the backend solver for demonstration purposes
// const simulateSolver = async (cubeState) => {
//   // Add a small delay to simulate API latency
//   await new Promise(resolve => setTimeout(resolve, 1000));
  
//   // Check if the cube is already solved
//   const isSolved = Object.keys(cubeState).every(face => {
//     const centerColor = cubeState[face][4]; // Center sticker
//     return cubeState[face].every(sticker => sticker === centerColor);
//   });
  
//   if (isSolved) {
//     return {
//       success: true,
//       solution: '',
//       message: 'Cube is already solved'
//     };
//   }
  
//   // Check if the cube state is valid
//   const allStickers = Object.values(cubeState).flat();
//   const counts = {};
//   allStickers.forEach(sticker => {
//     counts[sticker] = (counts[sticker] || 0) + 1;
//   });
  
//   const isValid = Object.keys(counts).every(color => counts[color] === 9);
  
//   if (!isValid) {
//     return {
//       success: false,
//       message: 'Invalid cube state. Each color must appear exactly 9 times.'
//     };
//   }
  
//   // For demo purposes, return a simulated solution
//   // In a real application, this would come from the actual solver algorithm
//   const simulatedSolution = "R U R' U' R' F R2 U' R' U' R U R' F' U2";
  
//   return {
//     success: true,
//     solution: simulatedSolution,
//     moveCount: simulatedSolution.split(' ').length
//   };
// };

// // Check API connectivity
// export const checkApiStatus = async () => {
//   try {
//     // Uncomment for real API implementation:
//     /*
//     const response = await fetch(`${API_BASE_URL}/status`);
//     return response.ok;
//     */
    
//     // Simulated API status check
//     return true;
//   } catch (error) {
//     console.error('API connectivity check failed:', error);
//     return false;
//   }
// };

// // Validate a cube state on the server
// export const validateCubeState = async (cubeState) => {
//   try {
//     // Uncomment for real API implementation:
//     /*
//     const response = await fetch(`${API_BASE_URL}/validate`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         state: formatCubeState(cubeState)
//       }),
//     });
    
//     return handleResponse(response);
//     */
    
//     // Simulate validation
//     const isValid = Object.keys(cubeState).every(face => cubeState[face].length === 9);
//     return {
//       valid: isValid,
//       message: isValid ? 'Cube state is valid' : 'Invalid cube state'
//     };
//   } catch (error) {
//     console.error('Error validating cube state:', error);
//     return {
//       valid: false,
//       message: error.message || 'Failed to validate cube state'
//     };
//   }
// };

// // Add this function to your solverAPI.js file
// export const solveCube = async (cubeState) => {
//   // This should call your solution API or algorithm
//   const solution = await fetchSolution(cubeState);
//   return solution;
// };

// // No need for this export statement as these functions are already exported above
// // export { checkApiStatus, fetchSolution, validateCubeState };



// src/api/solverAPI.js

// Base URL for the solver API
const API_BASE_URL = '/api'; // Example, not used by simulateSolver

// Helper function to handle API responses (for real API)
// eslint-disable-next-line no-unused-vars
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Transform cube state into the format expected by a real API (if needed)
// eslint-disable-next-line no-unused-vars
const formatCubeState = (state) => {
  const faces = ['U', 'R', 'F', 'D', 'L', 'B'];
  let formattedState = '';
  faces.forEach(face => {
    if (state[face] && Array.isArray(state[face])) { // Add a check
        formattedState += state[face].join('');
    } else {
        console.warn(`[solverAPI] formatCubeState: Face ${face} is missing or not an array in state:`, state);
    }
  });
  return formattedState;
};

// Fetch the solution from the backend
export const fetchSolution = async (cubeStateObject) => { // Renamed to cubeStateObject for clarity
  try {
    // IF USING A REAL API that expects a string:
    /*
    const formattedApiState = formatCubeState(cubeStateObject);
    const response = await fetch(`${API_BASE_URL}/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ state: formattedApiState }),
    });
    return handleResponse(response);
    */
    
    // Simulated API response using the object directly
    return await simulateSolver(cubeStateObject);
  } catch (error) {
    console.error('Error fetching solution:', error);
    return {
      success: false,
      solution: '', // Ensure solution is always a string
      message: error.message || 'Failed to connect to solver API'
    };
  }
};

// This simulates the backend solver for demonstration purposes
const simulateSolver = async (cubeState) => { // Expects cubeState as { U: [...], ... }
  await new Promise(resolve => setTimeout(resolve, 500)); // Shorter delay for testing
  
  // Validate cubeState structure first
  if (!cubeState || typeof cubeState !== 'object' || Object.keys(cubeState).length === 0) {
    console.error('[solverAPI] simulateSolver: Invalid cubeState received:', cubeState);
    return { success: false, solution: '', message: 'Invalid cube state format received by solver.' };
  }

  const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
  for (const face of faces) {
      if (!cubeState[face] || !Array.isArray(cubeState[face]) || cubeState[face].length !== 9) {
          console.error(`[solverAPI] simulateSolver: Invalid data for face ${face}:`, cubeState[face]);
          return { success: false, solution: '', message: `Invalid cube state: Face ${face} data is incorrect.` };
      }
  }

  // Check if the cube is already solved
  // The error "cubeState[face].every is not a function" should be fixed now
  // as cubeState[face] will be an array.
  const isCubeSolved = faces.every(faceName => {
    const faceArray = cubeState[faceName];
    const centerColor = faceArray[4]; 
    return faceArray.every(sticker => sticker === centerColor);
  });
  
  if (isCubeSolved) {
    return {
      success: true,
      solution: '', // Empty string for solution when already solved
      message: 'Cube is already solved'
    };
  }
  
  // Check if the cube state sticker counts are valid
  const allStickers = Object.values(cubeState).flat();
  const counts = {};
  allStickers.forEach(sticker => {
    counts[sticker] = (counts[sticker] || 0) + 1;
  });
  
  // Assuming standard 6 colors, 9 stickers each
  const isValidCounts = Object.values(counts).every(count => count === 9) && Object.keys(counts).length === 6;
  
  if (!isValidCounts) {
    return {
      success: false,
      solution: '',
      message: 'Invalid cube state. Each color must appear exactly 9 times, and there should be 6 unique colors.'
    };
  }
  
  const simulatedSolution = "R U R' U' R' F R2 U' R' U' R U R' F'"; // Standard sexy move + sledgehammer
  
  return {
    success: true,
    solution: simulatedSolution,
    moveCount: simulatedSolution.split(' ').length,
    message: 'Solution found (simulated).'
  };
};

export const checkApiStatus = async () => {
  try {
    // return await fetch(`${API_BASE_URL}/status`).then(res => res.ok);
    return true; // Simulated
  } catch (error) {
    console.error('API connectivity check failed:', error);
    return false;
  }
};

export const validateCubeState = async (cubeState) => { // Expects object form
  try {
    // const formattedApiState = formatCubeState(cubeState);
    /*
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ state: formattedApiState }),
    });
    return handleResponse(response);
    */
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const isValid = faces.every(faceName => cubeState[faceName] && Array.isArray(cubeState[faceName]) && cubeState[faceName].length === 9);
    return {
      valid: isValid,
      message: isValid ? 'Cube state is valid (simulated)' : 'Invalid cube state (simulated)'
    };
  } catch (error) {
    console.error('Error validating cube state:', error);
    return {
      valid: false,
      message: error.message || 'Failed to validate cube state'
    };
  }
};

// Renamed to avoid conflict with useCube's solveCube if it existed
export const solveCube = async (cubeStateObject) => {
  return await fetchSolution(cubeStateObject);
};