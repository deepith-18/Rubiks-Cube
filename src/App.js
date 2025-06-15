import React from 'react';
import Solver from './pages/Solver';
import AnimatedBackground from './AnimatedBackground'; // Import the new component
import './App.css'; // Your existing App styles

function App() {
  return (
    <div className="App">
      <AnimatedBackground /> {/* Render the animated background first */}
      <Solver />
    </div>
  );
}

export default App;