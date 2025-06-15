// src/routes/AppRoutes.jsx - Basic Structure Check
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Correct imports
import Home from '../pages/Home';         // Correct import?
import Dashboard from '../pages/Dashboard'; // Correct import?

function AppRoutes() {
  // Add console log to check if it renders
  console.log("AppRoutes component rendering");
  return (
    <BrowserRouter> {/* MUST wrap Routes */}
      <Routes>    {/* MUST wrap Route */}
        <Route path="/" element={<Home />} /> {/* Check path and element */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Check path and element */}
        {/* Optional: Fallback route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;