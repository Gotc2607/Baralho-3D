import React, { useState } from 'react';
import DeckScene from './components/Deckscene';
import CustomizationPanel from './components/CustomizationPaneil';
import './style/App.css';

function App() {
  // 🃏 Geração inicial do baralho de exemplo
  const initialDeck = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    suit: ['♥', '♦', '♣', '♠'][i % 4],
    value: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'][i % 10],
  }));

  const initialTheme = {
  name: 'classic',
  colors: { base: '#8b0000', border: '#ffd700', eye: '#ffffff' },
  bloom: 0.8,
};

  // === ESTADOS ===
  const [mainDeck, setMainDeck] = useState(initialDeck);
  const [activeCard, setActiveCard] = useState(null);
  const [discardDeck, setDiscardDeck] = useState([]);
  const [theme, setTheme] = useState(initialTheme);

  // === LÓGICA DE CLIQUE NAS CARTAS ===
  const handleCardClick = (card) => {
    // Se não há carta ativa → destaca a clicada
    if (!activeCard) {
      setActiveCard(card);
      setMainDeck(mainDeck.filter((c) => c.id !== card.id));
    } else {
      // Move carta ativa para o descarte e ativa a nova
      setDiscardDeck([activeCard, ...discardDeck]);
      setActiveCard(card);
      setMainDeck(mainDeck.filter((c) => c.id !== card.id));
    }
  };

  // === TROCA DE TEMA ===
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#0c0020] to-[#1a0035] relative">
      {/* 🎴 Cena 3D principal */}
      <DeckScene
        mainDeck={mainDeck}
        activeCard={activeCard}
        discardDeck={discardDeck}
        onCardClick={handleCardClick}
        theme={theme}
      />

      {/* 🎨 Painel lateral de customização */}
      <CustomizationPanel theme={theme} onThemeChange={handleThemeChange} />

      {/* ℹ️ Instruções */}
      <div className="absolute bottom-4 left-4 text-white/80 text-sm leading-relaxed">
        <p>• Clique em uma carta do monte esquerdo para destacá-la</p>
        <p>• Arraste a carta central para rotacionar e ver frente/verso</p>
        <p>• Cartas usadas vão para o monte direito (verso com caveira)</p>
      </div>
    </div>
  );
}

export default App;
