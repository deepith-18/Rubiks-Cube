import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming you use React Router

function Navigation() {
  const location = useLocation();

  // Basic navigation - expand as needed
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
          Rubik's Cube Solver
        </Link>
        <div className="space-x-4">
           {/* Add more links here if needed */}
           {/* Example: Conditionally show Dashboard link if not already there */}
            {location.pathname !== '/dashboard' && (
                 <Link to="/dashboard" className="hover:text-blue-200 transition-colors">
                     Dashboard
                 </Link>
             )}
            {/* <Link to="/about" className="hover:text-blue-200 transition-colors">About</Link> */}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;