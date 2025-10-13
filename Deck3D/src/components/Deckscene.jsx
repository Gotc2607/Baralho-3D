// src/components/DeckScene.jsx

import React, { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Card from './Card';

// Cores exatas do 'options' no projeto de referência
const referenceTheme = {
  colors: {
    border: '#C551F5', // color0
    base: '#4100AA',   // color1
    eye: '#0096FF'     // color2
  },
};

function DeckScene() {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />

      <Card theme={referenceTheme} />
      <OrbitControls />

      {/* Configuração do Bloom igual à do projeto de referência */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </Suspense>
  );
}

export default DeckScene;