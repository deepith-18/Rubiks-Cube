// Utility functions for Rubik's Cube operations

// Map notations to move descriptions
export const MOVE_DESCRIPTIONS = {
    'U': 'Top face clockwise',
    'U\'': 'Top face counter-clockwise',
    'U2': 'Top face 180°',
    'D': 'Bottom face clockwise',
    'D\'': 'Bottom face counter-clockwise',
    'D2': 'Bottom face 180°',
    'F': 'Front face clockwise',
    'F\'': 'Front face counter-clockwise',
    'F2': 'Front face 180°',
    'B': 'Back face clockwise',
    'B\'': 'Back face counter-clockwise',
    'B2': 'Back face 180°',
    'R': 'Right face clockwise',
    'R\'': 'Right face counter-clockwise',
    'R2': 'Right face 180°',
    'L': 'Left face clockwise',
    'L\'': 'Left face counter-clockwise',
    'L2': 'Left face 180°'
  };
  
  // Standard colors for cube faces
  export const FACE_COLORS = {
    'U': { name: 'white', hex: '#FFFFFF' },
    'D': { name: 'yellow', hex: '#FFFF00' },
    'F': { name: 'red', hex: '#FF0000' },
    'B': { name: 'orange', hex: '#FF8800' },
    'R': { name: 'green', hex: '#00FF00' },
    'L': { name: 'blue', hex: '#0000FF' }
  };
  
  // Parse solution string into an array of moves
  export const parseSolution = (solutionString) => {
    if (!solutionString || solutionString.trim() === '') {
      return [];
    }
    
    // Replace double spaces with single space, then split by space
    return solutionString.replace(/\s+/g, ' ').trim().split(' ');
  };
  
  // Check if a cube state is valid
  export const validateCubeState = (state) => {
    // Check if all required faces are present
    const requiredFaces = ['U', 'D', 'F', 'B', 'R', 'L'];
    for (const face of requiredFaces) {
      if (!state[face] || !Array.isArray(state[face]) || state[face].length !== 9) {
        return {
          valid: false,
          message: `Face ${face} is missing or incomplete. Each face should have exactly 9 stickers.`
        };
      }
    }
  
    // Count the number of each color
    const colorCount = {};
    requiredFaces.forEach(face => {
      state[face].forEach(color => {
        colorCount[color] = (colorCount[color] || 0) + 1;
      });
    });
  
    // Each color should appear exactly 9 times
    for (const face of requiredFaces) {
      if (!colorCount[face] || colorCount[face] !== 9) {
        return {
          valid: false,
          message: `Invalid color distribution. Each color should appear exactly 9 times.`
        };
      }
    }
  
    // Check center pieces (they define the face colors)
    const centers = {
      'U': state.U[4],
      'D': state.D[4],
      'F': state.F[4],
      'B': state.B[4],
      'R': state.R[4],
      'L': state.L[4]
    };
  
    for (const face of requiredFaces) {
      if (centers[face] !== face) {
        return {
          valid: false,
          message: `Center piece of face ${face} has incorrect color ${centers[face]}.`
        };
      }
    }
  
    return { valid: true };
  };
  
  // Group solution moves into logical steps
  export const groupSolutionIntoStages = (solution) => {
    // This is a simple grouping - in a real solver, you might have better information
    // about which moves belong to which stage of the solution
    const stages = [
      { name: 'Cross', moves: [] },
      { name: 'F2L (First Two Layers)', moves: [] },
      { name: 'OLL (Orient Last Layer)', moves: [] },
      { name: 'PLL (Permute Last Layer)', moves: [] }
    ];
    
    // Simple distribution - divide the solution roughly into the 4 stages
    // This is just for demonstration; a real solver would provide actual stages
    const movesPerStage = Math.ceil(solution.length / 4);
    
    for (let i = 0; i < solution.length; i++) {
      const stageIndex = Math.min(Math.floor(i / movesPerStage), 3);
      stages[stageIndex].moves.push(solution[i]);
    }
    
    return stages.filter(stage => stage.moves.length > 0);
  };
  
  // Check if the cube is in a solved state
  export const isSolved = (state) => {
    for (const face in state) {
      const centerColor = state[face][4]; // Center piece color
      for (const color of state[face]) {
        if (color !== centerColor) {
          return false;
        }
      }
    }
    return true;
  };
  
  // Generate a sequence of random moves
  export const generateScramble = (moveCount = 20) => {
    const moves = ['U', 'D', 'F', 'B', 'R', 'L'];
    const modifiers = ['', '\'', '2'];
    const scramble = [];
    let lastFace = null;
    
    for (let i = 0; i < moveCount; i++) {
      let face;
      // Avoid moving the same face twice in a row
      do {
        face = moves[Math.floor(Math.random() * moves.length)];
      } while (face === lastFace);
      
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      scramble.push(`${face}${modifier}`);
      lastFace = face;
    }
    
    return scramble;
  };
  
  // Convert face notation to readable name
  export const faceToName = (face) => {
    switch(face) {
      case 'U': return 'Top';
      case 'D': return 'Bottom';
      case 'F': return 'Front';
      case 'B': return 'Back';
      case 'R': return 'Right';
      case 'L': return 'Left';
      default: return face;
    }
  };