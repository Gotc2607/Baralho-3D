import React from 'react';

const CustomizationPanel = ({ theme, onThemeChange }) => {
  // 🎮 Temas predefinidos
  const themes = {
    classic: {
      name: 'classic',
      colors: { base: '#8b0000', border: '#ffd700', eye: '#ffffff' },
      bloom: 0.8,
    },
    neon: {
      name: 'neon',
      colors: { base: '#C551F5', border: '#4100AA', eye: '#00BFFF' },
      bloom: 1.5,
    },
    dark: {
      name: 'dark',
      colors: { base: '#0A0A0A', border: '#4B0082', eye: '#9400D3' },
      bloom: 1.0,
    },
    cyberpunk: {
      name: 'cyberpunk',
      colors: { base: '#00FFD1', border: '#FF007F', eye: '#FFEA00' },
      bloom: 1.8,
    },
  };

  // 🔄 Atualiza o tema
  const handlePresetChange = (preset) => {
    onThemeChange(themes[preset]);
  };

  // 🎨 Atualiza cores individualmente
  const handleColorChange = (key, value) => {
    onThemeChange({
      ...theme,
      colors: { ...theme.colors, [key]: value },
    });
  };

  // 💡 Atualiza intensidade do Bloom
  const handleBloomChange = (value) => {
    onThemeChange({
      ...theme,
      bloom: parseFloat(value),
    });
  };

  const currentColors = theme.colors || themes.classic.colors;

  return (
    <div className="fixed top-4 right-4 w-72 bg-white/90 p-5 rounded-2xl shadow-lg z-10 backdrop-blur-md border border-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">🎨 Customização</h2>

      {/* Seletor de temas */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.keys(themes).map((key) => (
          <button
            key={key}
            onClick={() => handlePresetChange(key)}
            className={`p-2 rounded-lg text-sm font-semibold transition-all ${
              theme.name === key
                ? 'bg-indigo-600 text-white shadow-md scale-105'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {themes[key].name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Controles de cor */}
      <div className="space-y-2 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Borda da Caveira</label>
          <input
            type="color"
            value={currentColors.border}
            onChange={(e) => handleColorChange('border', e.target.value)}
            className="w-full h-8 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Base da Caveira</label>
          <input
            type="color"
            value={currentColors.base}
            onChange={(e) => handleColorChange('base', e.target.value)}
            className="w-full h-8 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Olhos</label>
          <input
            type="color"
            value={currentColors.eye}
            onChange={(e) => handleColorChange('eye', e.target.value)}
            className="w-full h-8 rounded"
          />
        </div>
      </div>

      {/* Controle de Bloom */}
      <div className="mt-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Intensidade do Brilho (Bloom)
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={theme.bloom || 1}
          onChange={(e) => handleBloomChange(e.target.value)}
          className="w-full accent-indigo-600"
        />
      </div>
    </div>
  );
};

export default CustomizationPanel;
