// Defines the available patterns
// 'state' should be the full cube state string representation
// (e.g., Kociemba format: UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB)
// 'previewImage' should match a file in src/assets/images/

export const patterns = [
    {
      id: 'checkerboard',
      name: 'Checkerboard',
      previewImage: 'pattern_checkerboard.png', // Make sure you have this image
      // Example state (verify this matches your cube model's solved state colors)
      state: 'UDUDUDUDURLRLRLRLRFBFBFBFBFDUDUDUDUDLRLRLRLRLBFBFBFBFB',
    },
    {
      id: 'dot',
      name: 'Six Spots',
      previewImage: 'pattern_dot.png', // Make sure you have this image
      // Example state (verify this!) - Center piece swapped with opposite face center
      state: 'UUUUWUUUURRRRBRRRRFFFFGFFFFDDDDYDDDDLLLLORLLLLBBBB UBBBB', // Replace W,B,G,Y,O,U with your actual center colors
    },
    // Add more patterns here...
    // {
    //   id: 'cube_in_cube',
    //   name: 'Cube in Cube',
    //   previewImage: 'pattern_cube_in_cube.png',
    //   state: '...',
    // },
  ];