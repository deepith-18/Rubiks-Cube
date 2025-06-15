// src/index.js (or src/main.jsx if using Vite)

import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Import the main App component - THIS IS THE CRUCIAL PART
import App from './App';

// 2. Import your global CSS / Tailwind base styles
import './styles/index.css'; // Make sure this path is correct

// --- Remove any imports for Solver, CubeViewer, RubiksCube, or useCube here ---
// --- DO NOT import or use Solver directly in this file anymore! ---

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 3. Render ONLY the App component here */}
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// Optional: import reportWebVitals from './reportWebVitals';
// reportWebVitals();