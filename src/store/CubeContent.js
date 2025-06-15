import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { generateScramble } from '../lib/cubeSolver'; // For scrambling
import { getSolution } from '../services/SolverService'; // Use the abstraction
import { patterns } from '../config/patterns'; // Import patterns config

// --- Default State ---
// Define your solved state string according to your cube model's representation
const SOLVED_CUBE_STATE = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'; // Example Kociemba format

const initialState = {
  cubeState: SOLVED_CUBE_STATE, // Current visual state of the cube
  initialStateBeforeSolve: SOLVED_CUBE_STATE, // State before solve/animation started
  solvedStateString: SOLVED_CUBE_STATE, // The target solved state
  currentMode: 'play', // 'play', 'input', 'patterns'
  selectedColor: 'W', // For input mode (use your color codes)
  solutionSteps: [], // Array of moves, e.g., ["R", "U", "F'"]
  isLoading: false,
  error: null, // Error message string
};

// --- Create Context ---
const CubeContext = createContext(initialState);

// --- Create Provider Component ---
export const CubeProvider = ({ children }) => {
  const [cubeState, setCubeState] = useState(initialState.cubeState);
  const [initialStateBeforeSolve, setInitialStateBeforeSolve] = useState(initialState.initialStateBeforeSolve);
  const [currentMode, setCurrentMode] = useState(initialState.currentMode);
  const [selectedColor, setSelectedColor] = useState(initialState.selectedColor);
  const [solutionSteps, setSolutionSteps] = useState(initialState.solutionSteps);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [error, setError] = useState(initialState.error);

  const clearError = useCallback(() => setError(null), []);

  const setMode = useCallback((mode) => {
      clearError();
      setSolutionSteps([]); // Clear solution when changing mode
      setCurrentMode(mode);
      // Reset to solved state when switching modes? Or keep current state? User choice.
      // setCubeState(SOLVED_CUBE_STATE); // Option: Reset cube on mode change
  }, [clearError]);


  // TODO: Implement the actual cube state manipulation logic here or in useCube/models
  const applyMove = useCallback((move) => {
      // This function needs to take the current cubeState, apply the move,
      // and return the new state. It depends heavily on your RubiksCube.js model.
      console.log("Applying move:", move, "(Needs implementation)");
      // Example: setCubeState(prevState => yourCubeModel.applyMove(prevState, move));
      // Placeholder: Just log for now
      setCubeState(prevState => {
          // --- Placeholder Logic ---
          // In a real app, call your cube model's method:
          // return RubiksCube.applyMove(prevState, move);
          console.log(`Simulating applying move ${move} to state ${prevState}`);
          // Return previous state until implemented
          return prevState;
          // --- End Placeholder ---
      });
  }, []); // Add dependencies if it uses external state/props

  // TODO: Implement the actual cube state manipulation logic
  const applySequence = useCallback((moves) => {
    // Apply multiple moves sequentially
    console.log("Applying sequence:", moves, "(Needs implementation)");
    // Example: setCubeState(prevState => yourCubeModel.applySequence(prevState, moves));
     setCubeState(prevState => {
          // --- Placeholder Logic ---
          let newState = prevState;
          // for (const move of moves) {
          //     newState = RubiksCube.applyMove(newState, move);
          // }
          // return newState;
           console.log(`Simulating applying sequence ${moves.join(' ')} to state ${prevState}`);
           return prevState; // Return previous state until implemented
          // --- End Placeholder ---
      });
  }, []);


  const scrambleCube = useCallback(async () => {
    clearError();
    setSolutionSteps([]);
    setIsLoading(true);
    try {
      // Generate scramble sequence
      const scrambleMoves = generateScramble(20); // Get sequence like ["R", "U'", ...]
      // Apply sequence to the solved state to get the scrambled state
      // This needs RubiksCube.applySequence(SOLVED_CUBE_STATE, scrambleMoves)
      console.log("Scrambling... (Needs implementation to apply moves)");
      // --- Placeholder Logic ---
       // Simulate applying scramble to solved state
       // const scrambledState = RubiksCube.applySequence(SOLVED_CUBE_STATE, scrambleMoves);
       // setCubeState(scrambledState);
       // For now, just set a dummy non-solved state
       setCubeState("RUBFUBRULUULFLDLFFRBRBLDRBUDRRDDFDLFUULDLLLBBURUDRBDB"); // Dummy scramble
       setInitialStateBeforeSolve(cubeState); // Store the state before solving
      // --- End Placeholder ---

    } catch (err) {
       console.error("Scramble failed:", err);
       setError("Failed to scramble the cube.");
    } finally {
        setIsLoading(false);
    }
  }, [clearError]); // Add applySequence when implemented


  const solveCube = useCallback(async () => {
    clearError();
    setSolutionSteps([]); // Clear previous solution
    setIsLoading(true);
    setInitialStateBeforeSolve(cubeState); // Store the current state before solving
    try {
      const solution = await getSolution(cubeState); // Call the service
      setSolutionSteps(solution);
      if (solution.length === 0 && cubeState !== SOLVED_CUBE_STATE) {
          // Solver returned empty but not solved - maybe an issue?
          // Or it might legitimately be solved already.
          console.log("Solver returned no steps. Cube might be already solved or solver issue.");
      } else if (solution.length === 0 && cubeState === SOLVED_CUBE_STATE) {
          console.log("Cube is already solved.");
      }
    } catch (err) {
      console.error("Solving failed:", err);
      setError(err.message || "Failed to get solution.");
      setSolutionSteps([]); // Ensure solution is empty on error
    } finally {
      setIsLoading(false);
    }
  }, [cubeState, clearError]);

  const loadPattern = useCallback((patternState) => {
      clearError();
      setSolutionSteps([]);
      setIsLoading(true); // Optional: show loading while applying
      try {
          setCubeState(patternState);
          setInitialStateBeforeSolve(patternState); // Store pattern state
          console.log("Loaded pattern state.");
      } catch(err) {
          console.error("Failed to load pattern:", err);
          setError("Could not load pattern state.");
      } finally {
          setIsLoading(false);
      }

  }, [clearError]);

   const resetCubeState = useCallback((state = SOLVED_CUBE_STATE) => {
       clearError();
       setSolutionSteps([]);
       setCubeState(state);
       setInitialStateBeforeSolve(state);
       console.log("Cube state reset.");
   }, [clearError]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    cubeState,
    setCubeState, // Expose raw setter if needed elsewhere (use carefully)
    initialStateBeforeSolve, // Expose initial state for reset/animation purposes
    solvedStateString: SOLVED_CUBE_STATE, // Expose solved state const
    currentMode,
    setMode,
    selectedColor,
    setSelectedColor, // Allow setting selected color for input mode
    solutionSteps,
    isLoading,
    error,
    clearError,
    scrambleCube,
    solveCube,
    applyMove, // Expose basic move application
    applySequence, // Expose sequence application
    loadPattern, // Expose pattern loading
    resetCubeState, // Expose reset function
  }), [
      cubeState, initialStateBeforeSolve, currentMode, setMode, selectedColor,
      solutionSteps, isLoading, error, clearError, scrambleCube,
      solveCube, applyMove, applySequence, loadPattern, resetCubeState
  ]);

  return <CubeContext.Provider value={value}>{children}</CubeContext.Provider>;
};

// --- Custom Hook for consuming the context ---
export const useCubeContext = () => {
  const context = useContext(CubeContext);
  if (context === undefined) {
    throw new Error('useCubeContext must be used within a CubeProvider');
  }
  return context;
};