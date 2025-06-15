import { gsap } from 'gsap';

// Animation settings with default values
const defaults = {
  duration: 0.5,
  ease: 'power2.out'
};

// Animate UI element transitions
export const animateElement = (element, properties, options = {}) => {
  const settings = { ...defaults, ...options };
  return gsap.to(element, {
    ...properties,
    duration: settings.duration,
    ease: settings.ease,
    ...options
  });
};

// Fade-in animation for components
export const fadeIn = (element, options = {}) => {
  const settings = { ...defaults, ...options };
  gsap.set(element, { opacity: 0 });
  return gsap.to(element, {
    opacity: 1,
    duration: settings.duration,
    ease: settings.ease,
    ...options
  });
};

// Fade-out animation for components
export const fadeOut = (element, options = {}) => {
  const settings = { ...defaults, ...options };
  return gsap.to(element, {
    opacity: 0,
    duration: settings.duration,
    ease: settings.ease,
    ...options
  });
};

// Scale-in animation (appearing)
export const scaleIn = (element, options = {}) => {
  const settings = { ...defaults, ...options };
  gsap.set(element, { scale: 0.5, opacity: 0 });
  return gsap.to(element, {
    scale: 1,
    opacity: 1,
    duration: settings.duration,
    ease: settings.ease,
    ...options
  });
};

// Slide-in animation from bottom
export const slideInFromBottom = (element, options = {}) => {
  const settings = { ...defaults, ...options };
  gsap.set(element, { y: 50, opacity: 0 });
  return gsap.to(element, {
    y: 0,
    opacity: 1,
    duration: settings.duration,
    ease: settings.ease,
    ...options
  });
};

// Slide-in animation from top
export const slideInFromTop = (element, options = {}) => {
  const settings = { ...defaults, ...options };
  gsap.set(element, { y: -50, opacity: 0 });
  return gsap.to(element, {
    y: 0,
    opacity: 1,
    duration: settings.duration,
    ease: settings.ease,
    ...options
  });
};

// Stagger animation for list items
export const staggerItems = (elements, animation = 'fadeIn', options = {}) => {
  const settings = { ...defaults, stagger: 0.1, ...options };
  const animations = {
    fadeIn: { opacity: 0, to: { opacity: 1 } },
    slideIn: { y: 20, opacity: 0, to: { y: 0, opacity: 1 } },
    scaleIn: { scale: 0.8, opacity: 0, to: { scale: 1, opacity: 1 } }
  };
  
  const selectedAnim = animations[animation] || animations.fadeIn;
  
  gsap.set(elements, selectedAnim);
  return gsap.to(elements, {
    ...selectedAnim.to,
    duration: settings.duration,
    ease: settings.ease,
    stagger: settings.stagger,
    ...options
  });
};

// Pulse animation (highlight)
export const pulse = (element, options = {}) => {
  const settings = { ...defaults, ...options };
  return gsap.to(element, {
    scale: 1.05,
    duration: settings.duration / 2,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: 1,
    ...options
  });
};

// Rotate animation for 3D objects
export const rotateCube = (object, targetRotation, options = {}) => {
  const settings = { ...defaults, duration: 1.0, ...options };
  return gsap.to(object.rotation, {
    x: targetRotation.x,
    y: targetRotation.y,
    z: targetRotation.z,
    duration: settings.duration,
    ease: settings.ease,
    ...options
  });
};

// Animation for status messages
export const animateStatus = (element, options = {}) => {
  const settings = { ...defaults, ...options };
  gsap.set(element, { y: -20, opacity: 0 });
  const tl = gsap.timeline();
  
  tl.to(element, {
    y: 0,
    opacity: 1,
    duration: settings.duration,
    ease: 'back.out'
  });
  
  if (settings.autoHide) {
    tl.to(element, {
      opacity: 0,
      delay: settings.displayDuration || 2,
      duration: settings.duration,
      ease: 'power2.in'
    });
  }
  
  return tl;
};

// Animation sequence for solution steps
export const animateSolutionStep = (element, index, total, options = {}) => {
  const settings = { ...defaults, ...options };
  const delay = index * (settings.staggerDelay || 0.1);
  
  gsap.set(element, { x: 20, opacity: 0 });
  return gsap.to(element, {
    x: 0,
    opacity: 1,
    delay,
    duration: settings.duration,
    ease: settings.ease,
    ...options
  });
};

// Button click animation
export const buttonClickEffect = (element, options = {}) => {
  const settings = { ...defaults, duration: 0.2, ...options };
  const tl = gsap.timeline();
  
  tl.to(element, {
    scale: 0.95,
    duration: settings.duration / 2,
    ease: 'power2.in'
  });
  
  tl.to(element, {
    scale: 1,
    duration: settings.duration / 2,
    ease: 'power2.out'
  });
  
  return tl;
};