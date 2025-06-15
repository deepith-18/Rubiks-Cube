import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of Link for programmatic navigation
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RubiksCube from '../models/RubiksCube'; // Assuming this component renders your 3D cube
import Instructions from '../components/shared/Instructions'; // Adjusted path assuming shared component
import PlayGameButton from '../components/home/PlayGameButton'; // Import the new button

const Home = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/dashboard'); // Navigate to the new dashboard route
  };

  return (
    // Use a container that allows centering the main intro vertically and horizontally
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white overflow-hidden">

      {/* Main Intro Section - Combine Text, Cube, and Button */}
      <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left mb-16 md:mb-24">

        {/* Text Content */}
        <motion.div
          className="z-10 md:flex-1 order-2 md:order-1" // Text first on mobile, second on desktop
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-blue-400 leading-tight">
            Interactive 3D <br /> Rubik's Cube Solver
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Solve, explore patterns, learn interactively, <br /> and animate the solution!
          </p>
          {/* Use the new PlayGameButton */}
           <PlayGameButton onClick={handleEnter} />
        </motion.div>

        {/* 3D Cube Visualization */}
        {/* Make cube take up significant space, potentially overlapping or adjacent */}
        <motion.div
          className="h-[250px] w-[250px] sm:h-[350px] sm:w-[350px] md:h-[400px] md:w-[400px] order-1 md:order-2 relative z-0" // Cube second on mobile, first on desktop
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <Canvas
             className="w-full h-full cursor-grab active:cursor-grabbing" // Add cursor styles
             camera={{ position: [4, 4, 6], fov: 50 }} // Adjusted camera slightly
           >
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 15, 5]} intensity={1.2} />
            <RubiksCube
              isInteractive={false} // Keep it non-interactive on home
              autoRotate={true} // Keep auto-rotation for animation
              rotationSpeed={0.008} // Adjust speed if needed
            />
            <OrbitControls
              enableZoom={false} // Keep zoom disabled
              enablePan={false} // Keep pan disabled
              autoRotate={true} // Controlled by the component now
              autoRotateSpeed={0.5} // Slower OrbitControls rotation, main rotation via component prop
              minPolarAngle={Math.PI / 4} // Prevent looking too far up/down
              maxPolarAngle={Math.PI - Math.PI / 4}
            />
          </Canvas>
        </motion.div>
      </div>

       {/* Optional: Keep lower sections if desired, animate them in */}
       {/* You can remove these if you want a cleaner landing page */}
       <motion.div
         className="w-full max-w-4xl space-y-12"
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }} // Animate when scrolling into view
         viewport={{ once: true, amount: 0.3 }} // Trigger animation once when 30% visible
         transition={{ duration: 0.6, delay: 0.3 }}
       >
         {/* How It Works Section - Simplified */}
         <section id="how-it-works" className="panel bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg">
           <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-300">How It Works</h2>
           {/* Using the same Instructions component */}
           <Instructions currentMode="home" /> {/* Pass a mode if needed by Instructions */}
         </section>

         {/* Features Section - Simplified */}
          <section className="panel bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg">
           <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-300">Features</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
             <div className="p-4">
               <h3 className="text-xl font-semibold mb-2 text-blue-400">Play & Solve</h3>
               <p className="text-gray-300 text-sm">
                 Tackle random scrambles or input your own cube state.
               </p>
             </div>
             <div className="p-4">
               <h3 className="text-xl font-semibold mb-2 text-blue-400">Explore Patterns</h3>
               <p className="text-gray-300 text-sm">
                 Discover and apply classic Rubik's Cube patterns instantly.
               </p>
             </div>
             <div className="p-4">
               <h3 className="text-xl font-semibold mb-2 text-blue-400">Animated Solutions</h3>
               <p className="text-gray-300 text-sm">
                 Watch the step-by-step solution animation unfold.
               </p>
             </div>
           </div>
         </section>
       </motion.div>

    </div>
  );
};

export default Home;