// src/components/Card.jsx

import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Plane, useFBO } from '@react-three/drei';
import * as THREE from 'three';
import { BackCardMaterial } from '../materials'; // Importa apenas o material do verso
import Skull from './Skull';                   // Importa o nosso novo componente da caveira

function Card({ theme }) {
  const [frontTexture, backTexture] = useTexture([
    '/textures/card_front_ace.png',
    '/textures/card_back_template.png',
  ]);

  // A lógica de RTT continua aqui, pois é o Cartão que orquestra a renderização.
  const skullScene = useMemo(() => <Skull theme={theme} />, [theme]);
  const camera = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(30, 1, 1, 10000);
    cam.position.z = 30; // Posição da câmara da caveira, como no projeto de referência
    return cam;
  }, []);

  const renderTarget = useFBO();

  useFrame((state) => {
    state.gl.setRenderTarget(renderTarget);
    state.gl.render(skullScene, camera);
    state.gl.setRenderTarget(null);
  });

  return (
    <group>
      {/* Frente da Carta */}
      <Plane args={[3.5, 5]}>
        <meshStandardMaterial map={frontTexture} transparent={true} />
      </Plane>

      {/* Verso da Carta */}
      <Plane args={[3.5, 5]} rotation-y={Math.PI}>
        {/* O nosso material importado. Muito mais limpo! */}
        <BackCardMaterial
          cardTemplate={backTexture}
          skullRender={renderTarget.texture}
        />
      </Plane>
    </group>
  );
}

export default Card;