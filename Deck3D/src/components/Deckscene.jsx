import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import Card from './Card';

function DeckScene({ mainDeck, activeCard, discardDeck, onCardClick, theme }) {
  const activeRef = useRef();

  // Animação de entrada da carta ativa
  useEffect(() => {
    if (activeCard && activeRef.current) {
      // Começa de uma posição mais afastada e de baixo
      gsap.fromTo(
        activeRef.current.position,
        { z: -5, y: -2, x: 0 },
        { z: 0, y: 0, x: 0, duration: 0.7, ease: 'power3.out' }
      );
      // E também uma leve rotação na entrada
      gsap.fromTo(
        activeRef.current.rotation,
        { y: -Math.PI / 4, z: -0.2 },
        { y: 0, z: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, [activeCard]);

  return (
    // Suspense mostra um fallback (neste caso, nada) enquanto os assets (modelos/texturas) carregam
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} shadows>
        {/* Iluminação melhorada para dar mais profundidade */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[8, 15, 8]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048} // Sombras de maior qualidade
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.2} />
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Baralho principal (à esquerda) */}
        {mainDeck.map((card, i) => (
          <Card
            key={card.id}
            cardData={card}
            theme={theme}
            position={[-3.5, 0, -i * 0.02]} // Posição ajustada
            rotation={[0, 0, -0.1]}
            // --- AJUSTE: A carta está virada para baixo e é clicável ---
            faceUp={false}
            onClick={() => onCardClick(card)}
          />
        ))}

        {/* Carta ativa (no centro) */}
        {activeCard && (
          <group ref={activeRef}>
            <Card
              cardData={activeCard}
              theme={theme}
              // --- AJUSTE: A carta está sempre virada para cima ---
              faceUp={true}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={true}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 2.2}
            />
          </group>
        )}

        {/* Baralho de descarte (à direita) */}
        {discardDeck.map((card, i) => (
          <Card
            key={card.id}
            cardData={card}
            theme={theme}
            position={[3.5, 0, i * 0.02]} // Posição ajustada
            rotation={[0, 0, 0.1]}
            // --- AJUSTE: A carta fica virada para cima no descarte ---
            faceUp={true}
            // Não é clicável
          />
        ))}

        {/* Efeitos de Pós-processamento */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            height={300}
            intensity={theme.bloom || 1}
          />
        </EffectComposer>
      </Canvas>
    </Suspense>
  );
}

export default DeckScene;