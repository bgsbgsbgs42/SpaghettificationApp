# Spaghettification Learning Experience


## Features

- 🤖 **Animated Avatar**: A friendly emoji-based guide named Astro that leads students through the lesson
- 📹 **Webcam Integration**: Shows students' video feed alongside educational content
- 🔊 **Text-to-Speech**: Avatar speaks the lesson content aloud with adjustable volume
- 📊 **Interactive 3D Visualization**: Shows how objects stretch near black holes with physics simulation
- 🎮 **Hands-on Learning**: Students can adjust parameters to see how mass affects gravitational forces
- 📝 **Interactive Quiz**: 5-question assessment with immediate feedback
- 🏆 **Badge System**: Students earn the "Black Hole Explorer" badge upon successful completion
- 💾 **Progress Tracking**: Firebase integration saves student progress

## Technologies Used

- **React**: Front-end framework for building the user interface
- **Three.js/React Three Fiber**: 3D visualization of black holes and spaghettification
- **Rapier Physics**: Realistic physics simulation for tidal force demonstration
- **Tailwind CSS**: Styling and responsive design
- **Firebase**: Authentication and progress tracking (optional implementation)
- **Web APIs**: Speech synthesis and webcam integration

## Installation

```bash
# Clone the repository
git clone 
cd spaghettificationapp

# Install dependencies
npm install

# Start development server
npm run dev
```

## Firebase Setup (Optional)

To enable user accounts and progress tracking:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database with collections for users, progress, and badges
4. Add your Firebase configuration to `src/firebaseConfig.js`:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Project Structure

```
src/
├── components/
│   ├── SpaghettificationLesson.jsx    # Main lesson component
│   
├── assets/
│   └── spaghettification-visualization.svg   # Animated visualization
├── hooks/
│   └── useFirebase.js                 # Firebase integration hooks
├── App.jsx                            # Entry point
└── main.jsx                           # React initialization
```

## Physics Simulation

The enhanced visualization uses accurate physics to demonstrate:

- Black hole Schwarzschild radius calculation
- Tidal force differential equations
- Gravitational force comparisons between neutron stars and black holes
- Spaghettification simulation using deformation matrices

Parameters can be adjusted to show how different masses affect the stretching phenomenon.

## Educational Content

The lesson covers:

1. Introduction to black holes and their gravitational effects
2. Explanation of tidal forces and their role in spaghettification
3. Comparison of events at different distances from a black hole
4. The physics behind Einstein's theory of general relativity
5. Differences between small and supermassive black holes
6. Comparison with neutron stars and other dense celestial objects

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Stephen Hawking for popularizing the term "spaghettification"
- NASA and ESA for black hole visualization references

---

Built with ❤️ for the next generation of space explorers!
