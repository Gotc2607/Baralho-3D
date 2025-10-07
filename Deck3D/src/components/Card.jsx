// src/components/Card.jsx

import React, { useRef, useMemo, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { useTexture, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// Componente para a Caveira, para manter o código organizado
function Skull({ theme }) {
  const model = useLoader(OBJLoader, '/models/skull5.obj');

  // useMemo otimiza a performance, recriando o material apenas quando o tema mudar
  const skullMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: theme.colors.border,
      emissive: theme.colors.eye,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.3,
    });
  }, [theme]);

  // Aplica o material a todos os meshes dentro do modelo .obj
  useEffect(() => {
    model.traverse(child => {
      if (child.isMesh) {
        child.material = skullMaterial;
      }
    });
  }, [model, skullMaterial]);

  return <primitive object={model} scale={8} rotation-y={Math.PI} />;
}


// Componente Principal do Card
function Card({ cardData, theme, faceUp = false, ...props }) {
  const groupRef = useRef();

  // Carrega as texturas do cartão
  const [frontTemplate, backTemplate] = useTexture([
    '/textures/cardtemplate3.png',
    '/textures/cardtemplateback4.png'
  ]);

  // Gera a textura dinâmica com o valor e o naipe da carta
  const frontTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    if (frontTemplate.image) {
      ctx.drawImage(frontTemplate.image, 0, 0, 512, 768);

      const color = cardData.suit === '♥' || cardData.suit === '♦' ? '#D40000' : '#222222';

      ctx.font = 'bold 100px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.fillText(cardData.value + cardData.suit, 256, 384);
    }
    return new THREE.CanvasTexture(canvas);
  }, [cardData, frontTemplate]);

  // Animação de rotação suave para o verso
  useFrame(() => {
    if (groupRef.current) {
      // Rotaciona para a posição correta (faceUp ou faceDown)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        faceUp ? 0 : Math.PI,
        0.05 // Velocidade da animação
      );
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Frente da Carta */}
      <Plane args={[2, 3]} rotation-y={0}>
        <meshStandardMaterial map={frontTexture} side={THREE.FrontSide} />
      </Plane>

      {/* Verso da Carta */}
      <Plane args={[2, 3]} rotation-y={Math.PI}>
        <meshStandardMaterial map={backTemplate} side={THREE.FrontSide} />
        {/* A caveira é um "filho" do verso, então só aparece quando o verso está visível */}
        <group position-z={0.15}>
          <Skull theme={theme} />
        </group>
      </Plane>
    </group>
  );
}

export default Card;