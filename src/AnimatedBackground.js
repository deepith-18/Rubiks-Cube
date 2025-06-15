// src/AnimatedBackground.js
import React, { useCallback, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react'; // Import from new package
import { loadFull } from 'tsparticles'; // This will load all features

const AnimatedBackground = () => {
  const [init, setInit] = useState(false);

  // This useEffect initializes the tsParticles engine once on component mount
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // console.log("Particles engine initialization started", engine);
      // You can load a specific preset (full, slim, basic) or individual components
      // loadFull is equivalent to loading all features
      await loadFull(engine);
      // console.log("Particles engine initialized with loadFull");
    }).then(() => {
      // console.log("initParticlesEngine promise resolved");
      setInit(true); // Set initialized to true, so Particles component can render
    }).catch((error) => {
      console.error("Error initializing tsParticles engine:", error);
    });
  }, []); // Empty dependency array ensures this runs only once

  const particlesLoaded = useCallback(async (container) => {
    // await console.log("Particles loaded:", container);
  }, []);

  const particleOptions = {
    fpsLimit: 60,
    particles: {
      number: {
        value: 40,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: "#aaaaaa",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.25,
      },
      size: {
        value: { min: 1, max: 3 },
      },
      links: {
        enable: true,
        color: "#bbbbbb",
        distance: 150,
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.4,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    detectRetina: true,
    style: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: -1,
    },
  };

  // Only render the Particles component after the engine is initialized
  if (!init) {
    return null; // Or you can return a loading spinner
  }

  return (
    <Particles
      id="tsparticles"
      // The `init` prop is no longer used this way. Engine is initialized via `initParticlesEngine`.
      loaded={particlesLoaded}
      options={particleOptions}
    />
  );
};

export default AnimatedBackground;