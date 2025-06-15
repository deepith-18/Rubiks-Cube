// Abstraction layer for getting solutions
// It can decide whether to use the API or a client-side solver

import { solveCubeAPI } from '../api/solverAPI'; // Your API call function
import { solveCubeClientSide } from '../lib/cubeSolver'; // Your client-side function

// Configuration flag (could come from .env or elsewhere)
const USE_API_SOLVER = true; // Set to false to use client-side solver

/**
 * Gets the solution steps for a given cube state.
 * Delegates to either the API or the client-side solver based on configuration.
 * @param {string} cubeStateString - The state of the cube to solve.
 * @returns {Promise<string[]>} A promise resolving to an array of move strings.
 */
export const getSolution = async (cubeStateString) => {
  if (USE_API_SOLVER) {
    console.log("Using API Solver...");
    try {
      const solution = await solveCubeAPI(cubeStateString);
      // Assume API returns moves directly or needs parsing
      return solution; // Adjust parsing as needed based on API response
    } catch (error) {
      console.error("API Solver failed:", error);
      // Optional: Fallback to client-side solver?
      // try {
      //   console.log("API failed, falling back to client-side solver...");
      //   return await solveCubeClientSide(cubeStateString);
      // } catch (clientError) {
      //   console.error("Client-side fallback failed:", clientError);
      //   throw error; // Re-throw original API error or a combined one
      // }
       throw error; // Re-throw API error if no fallback
    }
  } else {
    console.log("Using Client-Side Solver...");
    try {
       return await solveCubeClientSide(cubeStateString);
    } catch (error) {
       console.error("Client-side solver failed:", error);
       throw error; // Re-throw client-side error
    }
  }
};