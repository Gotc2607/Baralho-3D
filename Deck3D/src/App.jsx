// src/App.jsx

import React from 'react';
import { Canvas } from '@react-three/fiber';
import DeckScene from './components/Deckscene';

function App() {
  return (
    <div className="app-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <DeckScene />
      </Canvas>
    </div>
  );
}

export default App;