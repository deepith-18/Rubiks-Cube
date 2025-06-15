// src/models/RubiksCube.js

// Face names to standard colors (can be adjusted if needed)
export const faceColors = {
  U: '#ffffff', // White
  D: '#ffd500', // Yellow
  F: '#009b48', // Green
  B: '#0045ad', // Blue
  L: '#ff5800', // Orange
  R: '#b71234', // Red
};

// REMOVED UNUSED VARIABLE:
// const faceIndices = { U: 0, D: 1, F: 2, B: 3, L: 4, R: 5 };

export default class RubiksCube {
  constructor() {
    this.resetCube(); // Initialize state on creation
  }

  // ... (rest of the RubiksCube class remains the same) ...

  // Resets the cube to the solved state
  _internalReset() {
    this.faces = {
      U: Array(9).fill('W'), // Up face - White
      D: Array(9).fill('Y'), // Down face - Yellow
      F: Array(9).fill('G'), // Front face - Green
      B: Array(9).fill('B'), // Back face - Blue
      L: Array(9).fill('O'), // Left face - Orange
      R: Array(9).fill('R'), // Right face - Red
    };
  }

  // Public method expected by the hook to reset the cube state
  resetCube() {
    this._internalReset();
    console.log("Cube logic reset to solved state.");
  }

  // Returns the current state of the cube faces
  getCubeState() {
    return JSON.parse(JSON.stringify(this.faces));
  }

  // Rotates a face clockwise
  _rotateFaceCW(face) {
    const f = this.faces[face];
    this.faces[face] = [
      f[6], f[3], f[0],
      f[7], f[4], f[1],
      f[8], f[5], f[2],
    ];
  }

  // Rotates a face counter-clockwise
  _rotateFaceCCW(face) {
    const f = this.faces[face];
    this.faces[face] = [
      f[2], f[5], f[8],
      f[1], f[4], f[7],
      f[0], f[3], f[6],
    ];
  }

  // Applies a move notation (e.g., "U", "R'", "F2")
  move(notation) {
    const moves = notation.trim().split(/\s+/);
    moves.forEach(move => {
      if (!move) return;
      const face = move[0]?.toUpperCase();
      if (!this.faces[face]) {
        console.warn(`Invalid move face: ${face} in move ${move}`);
        return;
      }
      const isDouble = move.length === 2 && move[1] === '2';
      const isInverse = move.length === 2 && move[1] === "'";
      const times = isDouble ? 2 : 1;
      // console.log(`Applying move: ${move} (Face: ${face}, Inverse: ${isInverse}, Times: ${times})`); // Noisy log
      for (let i = 0; i < times; i++) {
        this._performRotation(face, isInverse);
      }
    });
     // console.log("Cube state after moves:", this.getCubeState()); // Noisy log
  }

  _performRotation(face, inverse = false) {
     const adjacentStickers = {
        U: [['B', 0, 1, 2], ['R', 0, 1, 2], ['F', 0, 1, 2], ['L', 0, 1, 2]],
        D: [['F', 6, 7, 8], ['R', 6, 7, 8], ['B', 6, 7, 8], ['L', 6, 7, 8]],
        F: [['U', 6, 7, 8], ['R', 0, 3, 6], ['D', 2, 1, 0], ['L', 8, 5, 2]],
        B: [['U', 2, 1, 0], ['L', 0, 3, 6], ['D', 6, 7, 8], ['R', 8, 5, 2]],
        L: [['U', 0, 3, 6], ['F', 0, 3, 6], ['D', 0, 3, 6], ['B', 8, 5, 2]],
        R: [['U', 8, 5, 2], ['B', 0, 3, 6], ['D', 8, 5, 2], ['F', 8, 5, 2]],
     };
    const sequence = adjacentStickers[face];
    if (!sequence) return;
    const temp = sequence.map(([adjFace, ...indices]) =>
        indices.map(idx => this.faces[adjFace][idx])
    );
    if (inverse) {
        for (let i = 0; i < 4; i++) {
            const [currentFace, ...currentIndices] = sequence[i];
            const sourceColors = temp[(i + 1) % 4];
            currentIndices.forEach((targetIndex, k) => {
                this.faces[currentFace][targetIndex] = sourceColors[k];
            });
        }
        this._rotateFaceCCW(face);
    } else {
        for (let i = 0; i < 4; i++) {
            const [currentFace, ...currentIndices] = sequence[i];
            const sourceColors = temp[(i + 3) % 4];
            currentIndices.forEach((targetIndex, k) => {
                this.faces[currentFace][targetIndex] = sourceColors[k];
            });
        }
        this._rotateFaceCW(face);
    }
  }

  scramble(movesCount = 20) {
    const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
    const modifiers = ['', "'", '2'];
    const moves = [];
    let lastFace = '';
    for (let i = 0; i < movesCount; i++) {
       let face;
       do {
            face = faces[Math.floor(Math.random() * faces.length)];
       } while (face === lastFace || (
           (face === 'L' && lastFace === 'R') || (face === 'R' && lastFace === 'L') ||
           (face === 'U' && lastFace === 'D') || (face === 'D' && lastFace === 'U') ||
           (face === 'F' && lastFace === 'B') || (face === 'B' && lastFace === 'F')
       ));
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      moves.push(face + modifier);
      lastFace = face;
    }
    const scrambleString = moves.join(' ');
    console.log("Applying scramble:", scrambleString);
    this.move(scrambleString);
    return scrambleString;
  }

  isSolved() {
    for (const faceKey of Object.keys(this.faces)) {
        const face = this.faces[faceKey];
        const centerColor = face[4];
        for (let i = 0; i < 9; i++) {
            if (face[i] !== centerColor) {
                return false;
            }
        }
    }
    return true;
  }

  getStateString() {
     const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
     return faceOrder.map(face => this.faces[face].join('')).join('');
   }

  toString() {
    return JSON.stringify(this.faces, null, 2);
  }
}