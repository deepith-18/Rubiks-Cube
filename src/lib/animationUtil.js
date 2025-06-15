// Utility functions for animations, potentially related to 3D rendering interpolation

/**
 * Calculates intermediate rotation steps for smooth animation.
 * @param {string} move - The move being animated (e.g., "R", "U'").
 * @param {number} progress - Animation progress (0 to 1).
 * @returns {object} Rotation data (e.g., axis, angle) for the 3D model.
 */
export const calculateIntermediateRotation = (move, progress) => {
    // TODO: Implement logic based on your 3D library (Three.js, etc.)
    // This would determine which pieces move, along which axis, and by how much angle.
    // console.log(`Calculating rotation for move: ${move} at progress: ${progress}`);
    return { axis: 'y', angle: 0 }; // Placeholder
  };
  
  /**
   * Determines the duration for a single animation step based on speed.
   * @param {number} animationSpeedMs - The speed setting in milliseconds.
   * @returns {number} Duration for the step.
   */
  export const getStepDuration = (animationSpeedMs) => {
    // Could add logic here if certain moves should take longer/shorter
    return animationSpeedMs;
  };
  
  /**
   * Gets the inverse of a standard Rubik's cube move notation.
   * @param {string} move - e.g., "R", "U'", "F2"
   * @returns {string} The inverse move - e.g., "R'", "U", "F2"
   */
  export const getInverseMove = (move) => {
      if (!move) return '';
      if (move.endsWith("'")) {
          return move.slice(0, -1); // R' -> R
      }
      if (move.endsWith("2")) {
          return move; // R2 -> R2
      }
      return move + "'"; // R -> R'
  }