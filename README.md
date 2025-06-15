#  Rubik's Cube Solver & Animator

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub top language](https://img.shields.io/github/languages/top/deepith-18/Rubik-s-Cube?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/deepith-18/Rubik-s-Cube?style=for-the-badge)

A web-based application built with React to solve a scrambled Rubik's Cube and visualize the solution with step-by-step animations.

<!-- 
  RECOMMENDATION: Create a short GIF of your app in action (e.g., scrambling, solving, and animating) 
  and replace the placeholder image below. It's the best way to showcase your project!
-->


---

##  Live Demo

**[🚀 View the live project here!](https://your-deployment-link.com)**

*(Replace the link above with your actual deployment URL from services like Vercel, Netlify, or GitHub Pages.)*

---

## ✨ Features

*   **Interactive 3D Cube:** A fully interactive Rubik's Cube (presumed, as is standard for such projects).
*   **Automatic Solver:** Click a button to get the solution steps for the current cube state.
*   **Animated Solution Playback:** Watch the cube solve itself with smooth animations.
*   **Full Playback Controls:**
    *   ▶️ **Play/Pause:** Start and stop the animation at any time.
    *   ⏪ **Previous Step:** Revert the last move in the solution.
    *   ⏩ **Next Step:** Manually apply the next move in the solution.
    *   🔄 **Reset:** Return the cube to its scrambled state before the animation began.
    *   📊 **Scrubber/Slider:** Jump to any specific step in the solution sequence (via `goToStep`).
*   **Adjustable Speed:** Control the speed of the solution playback.

---

## 🛠️ Tech Stack

*   **Frontend:** [React](https://reactjs.org/)
*   **State Management:** [React Context API](https://reactjs.org/docs/context.html) (`useCubeContext`)
*   **3D Rendering:** *(Likely [Three.js](https://threejs.org/) / [React Three Fiber](https://github.com/pmndrs/react-three-fiber))*
*   **Styling:** *(e.g., CSS Modules, Styled Components, Tailwind CSS)*
*   **Solver Logic:** Currently uses a **simulated backend API** (`solverAPI.js`) for demonstration purposes. It returns a pre-defined solution string.

---

## 📦 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

*   [Node.js](https://nodejs.org/en/) (which includes npm)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/deepith-18/Rubik-s-Cube.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd Rubik-s-Cube
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
    (or `yarn install` if you use Yarn)

4.  **Run the development server:**
    ```sh
    npm start
    ```
    This will open the project in your browser at `http://localhost:3000`.

---

## 💻 Code Overview

The project's core logic is organized into hooks, services, and state management for a clean architecture.

*   `src/hooks/useAnimation.js`: A powerful custom hook that encapsulates all the logic for the animation playback. It manages the play/pause state, current step, animation speed, and provides functions to control the sequence.

*   `src/api/solverAPI.js`: This service handles the logic for solving the cube. In its current state, it **simulates an API call**, performs basic validation, and returns a hardcoded solution string. This makes the frontend fully functional without a complex backend, perfect for demonstration.

*   `src/store/CubeContext.js`: Utilizes React's Context API to provide a global state for the application. This likely holds the cube's current facelet configuration, the solution steps, and core functions to manipulate the cube state, making them accessible to any component.

---

## 🎯 Future Improvements & To-Do

This project has a solid foundation. Here are some potential next steps based on the `//TODO` and `console.warn` comments in the code:

*   **Implement Inverse Moves:** Complete the `prevStep` functionality by creating a helper function that can calculate the inverse of any move (e.g., `R` becomes `R'`, `U'` becomes `U`).
*   **Efficient State Jumping:** The `goToStep` function can be optimized. Instead of re-playing all moves from the start, cache intermediate states or develop a more direct way to calculate the cube's state at any given step.
*   **Integrate a Real Solver:** Replace the `simulateSolver` with an actual solving algorithm. This could be:
    *   A JavaScript implementation of an algorithm like Kociemba's.
    *   An API call to a real backend server that runs a solver.
*   **UI/UX Enhancements:**
    *   Add tooltips to control buttons.
    *   Improve visual feedback for cube interactions.
    *   Create a more polished and responsive layout.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.
