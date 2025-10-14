// src/App.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import DeckScene from './components/Deckscene';

function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 40 }}
      style={{ width: '100vw', height: '100vh', background: '#000' }}
    >
      <DeckScene />
    </Canvas>
  );
}

export default App;
