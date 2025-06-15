import React from 'react';
// Remove direct Router imports if AppRoutes handles BrowserRouter
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the Context Provider - ESSENTIAL
import { CubeProvider } from './store/CubeContext';

// Import the Centralized Routing Component - ESSENTIAL
import AppRoutes from './routes/AppRoutes';

// Import Shared Components (like Navigation, if used globally)
import Navigation from './components/shared/Navigation'; // Ensure this path is correct

// Import global styles (e.g., Tailwind base)
import './styles/index.css';

function App() {
  return (
    // 1. Wrap the entire application (or the parts needing state) in CubeProvider
    <CubeProvider>
      {/* 2. Use a main div for layout and potential global background styling */}
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        {/* 3. Global Navigation (optional, but often useful) */}
        {/* Navigation sits outside AppRoutes if it's always visible */}
        <Navigation />

        {/* 4. Main content area */}
        <main className="flex-grow container mx-auto px-4 py-6">
          {/* 5. Render the AppRoutes component */}
          {/* AppRoutes now contains BrowserRouter and all the Route definitions */}
          <AppRoutes />
        </main>

        {/* 6. Global Footer (optional) */}
        <footer className="bg-gray-200 dark:bg-gray-800 py-4 text-center text-gray-600 dark:text-gray-400 text-sm mt-auto"> {/* mt-auto pushes footer down */}
          <div className="container mx-auto">
            © {new Date().getFullYear()} React Rubik's Solver
            {/* Simplified footer text */}
          </div>
        </footer>
      </div>
    </CubeProvider>
  );
}

export default App;