import { useState, useEffect, useCallback, useRef } from 'react';
import { useCubeContext } from '../store/CubeContext'; // Adjust path

const DEFAULT_SPEED_MS = 500; // Milliseconds per move

function useAnimation() {
  const { solutionSteps, applyMove, setCubeState, solvedStateString } = useCubeContext(); // Get applyMove from context
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1); // -1 means not started/at initial state
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_SPEED_MS);
  const intervalRef = useRef(null);

  const clearAnimationInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Function to go to a specific step in the animation
  const goToStep = useCallback((stepIndex) => {
      clearAnimationInterval();
      setIsPlaying(false);
      // TODO: Need a more robust way to reset to the state *before* step 0
      // This might require storing the initial scrambled state separately.
      // For now, resetting to solved, then applying moves up to stepIndex.
      if (stepIndex < 0) {
          // Reset to the state *before* the solution started
          // This logic depends on how you store the initial state
           console.warn("goToStep(-1) needs initial state restoration logic.");
           // Placeholder: reset to solved if no better state is known
           // setCubeState(solvedStateString);
           setCurrentStepIndex(-1);
           return;
      }

      if (!solutionSteps || solutionSteps.length === 0) return;

       // Apply moves from the beginning up to the target step
       // NOTE: This can be slow for long solutions. A better approach
       // would be to calculate the state at stepIndex directly if possible,
       // or cache intermediate states.
       let tempState = solvedStateString; // Or the initial scrambled state
       // TODO: Apply moves from 0 to stepIndex to tempState
       // You need a function in your cube model/utils: applyMultipleMoves(initialState, moves)
       console.warn("goToStep requires applying moves sequentially - implement this.");

       setCurrentStepIndex(stepIndex);
       // setCubeState(resultingStateAfterMoves); // Update cube view

  }, [solutionSteps, setCubeState, solvedStateString]); // Add dependencies


  useEffect(() => {
    // Cleanup interval on component unmount or when solution changes
    return () => clearAnimationInterval();
  }, [solutionSteps]);


  useEffect(() => {
    clearAnimationInterval(); // Clear existing interval if speed/playing state changes

    if (isPlaying && solutionSteps && currentStepIndex < solutionSteps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < solutionSteps.length) {
            const move = solutionSteps[nextIndex];
            applyMove(move); // Apply the next move to the actual cube state via context
            return nextIndex;
          } else {
            // Reached the end
            clearAnimationInterval();
            setIsPlaying(false);
            return prevIndex; // Stay at the last index
          }
        });
      }, animationSpeed);
    }

    // Cleanup on effect change
    return () => clearAnimationInterval();

  }, [isPlaying, animationSpeed, solutionSteps, currentStepIndex, applyMove]);

  const play = useCallback(() => {
    if (!solutionSteps || solutionSteps.length === 0) return;
    // If already at the end, maybe reset first? Or just do nothing.
    if (currentStepIndex >= solutionSteps.length - 1) {
        // Option: reset and play from start
        // goToStep(-1); // Requires initial state handling
        // setIsPlaying(true);
        console.log("Animation already at the end.");
        return;
    }
    setIsPlaying(true);
  }, [solutionSteps, currentStepIndex]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearAnimationInterval();
  }, []);

  const resetAnimation = useCallback(() => {
    pause();
    // Resetting requires knowing the state *before* the animation started
    // This is often the scrambled state or the loaded pattern state.
    goToStep(-1); // Go back to the initial state representation
    console.warn("Reset Animation needs initial state restoration logic.");
  }, [pause, goToStep]);


  const nextStep = useCallback(() => {
     if (!solutionSteps || currentStepIndex >= solutionSteps.length - 1) return;
     pause(); // Pause playback if manually stepping
     const nextIndex = currentStepIndex + 1;
     const move = solutionSteps[nextIndex];
     applyMove(move);
     setCurrentStepIndex(nextIndex);
  }, [solutionSteps, currentStepIndex, pause, applyMove]);

  const prevStep = useCallback(() => {
     // Going backwards requires applying the *inverse* move
     if (!solutionSteps || currentStepIndex < 0) return;
     pause();
     const move = solutionSteps[currentStepIndex];
     // TODO: Need a function to get the inverse of a move (e.g., R becomes R')
     // const inverseMove = getInverseMove(move);
     // applyMove(inverseMove);
     console.warn("Previous step requires applying inverse moves - implement getInverseMove and use it.");
     setCurrentStepIndex(prev => prev - 1);
  }, [solutionSteps, currentStepIndex, pause, applyMove]); // Add applyMove dependency


  const changeSpeed = useCallback((newSpeed) => {
    const speedMs = Math.max(50, newSpeed); // Ensure minimum speed
    setAnimationSpeed(speedMs);
  }, []);

  // Effect to reset animation state when the solution itself changes
  useEffect(() => {
      setCurrentStepIndex(-1);
      setIsPlaying(false);
      clearAnimationInterval();
      // Don't automatically reset cube state here, let the user/component decide
  }, [solutionSteps]);


  return {
    isPlaying,
    currentStepIndex,
    animationSpeed,
    play,
    pause,
    resetAnimation,
    nextStep,
    prevStep,
    goToStep, // Expose goToStep
    changeSpeed,
    totalSteps: solutionSteps?.length ?? 0,
  };
}

export default useAnimation;