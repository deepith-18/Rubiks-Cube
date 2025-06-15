module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all relevant files
    './src/styles/index.css',     // Include your CSS file
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#1a1a1a',       // Define custom colors
        'panel-bg': '#2a2a2a',
      },
    },
  },
  plugins: [],
};