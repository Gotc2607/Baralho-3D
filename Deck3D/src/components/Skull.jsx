// src/components/Skull.jsx

import React, { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { SkullMaterial } from '../materials'; // Importamos o nosso material

function Skull({ theme }) {
  const model = useLoader(OBJLoader, '/models/skull5.obj');
  const materialRef = useRef();

  // A animação do shader da caveira vive aqui, completamente encapsulada.
  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.time += delta;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={2} position={[10, 10, 5]} />
      <mesh>
        <primitive object={model} scale={8} rotation-y={Math.PI} />
        {/* Usamos o nosso material importado */}
        <skullMaterial
          ref={materialRef}
          color0={theme.colors.border}
          color1={theme.colors.base}
        />
      </mesh>
      {/* Esferas para os olhos */}
      <mesh position={[-2.2, -2.2, 6.6]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color={theme.colors.eye} toneMapped={false} />
      </mesh>
      <mesh position={[2.2, -2.2, 6.6]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color={theme.colors.eye} toneMapped={false} />
      </mesh>
    </>
  );
}

export default Skull;