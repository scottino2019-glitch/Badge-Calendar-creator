/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BadgeConfig, StickerInstance, TextInstance, DaySchedule } from './types';
import { DEFAULT_CONFIG, THEMES, STICKER_SVGS, STICKER_EMOJIS, encodeConfig, decodeConfig } from './data';
import { BadgeRenderer } from './components/BadgeRenderer';
import { EmbedGenerator } from './components/EmbedGenerator';
import html2canvas from 'html2canvas';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Calendar, 
  Clock, 
  Layers, 
  Palette, 
  Smile, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Heart, 
  Flame, 
  Trophy, 
  Type, 
  Maximize, 
  Coffee, 
  Bell, 
  Gift, 
  Check, 
  Code,
  Info,
  ExternalLink,
  Sliders,
  Bold
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<BadgeConfig>(DEFAULT_CONFIG);
  const [selectedElement, setSelectedElement] = useState<{ id: string; kind: 'sticker' | 'text' } | null>(null);
  const [isEmbed, setIsEmbed] = useState(false);
  const [embedConfig, setEmbedConfig] = useState<BadgeConfig | null>(null);
  const [activePresetTab, setActivePresetTab] = useState<'daily' | 'weekly'>('daily');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  // Parse embed hash on mount and when hash changes
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#embed=')) {
        const decoded = decodeConfig(hash.substring(7));
        if (decoded) {
          setEmbedConfig(decoded);
          setIsEmbed(true);
          return;
        }
      } else if (hash.startsWith('#badge=')) {
        const decoded = decodeConfig(hash.substring(7));
        if (decoded) {
          setEmbedConfig(decoded);
          setIsEmbed(true);
          return;
        }
      }
      setIsEmbed(false);
      setEmbedConfig(null);
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Update a sticker or text element's position
  const handleUpdateElementPosition = (
    id: string,
    kind: 'sticker' | 'text',
    x: number,
    y: number
  ) => {
    setConfig((prev) => {
      if (kind === 'sticker') {
        return {
          ...prev,
          stickers: prev.stickers.map((s) => (s.id === id ? { ...s, x, y } : s)),
        };
      } else {
        return {
          ...prev,
          texts: prev.texts.map((t) => (t.id === id ? { ...t, x, y } : t)),
        };
      }
    });
  };

  // Change full theme preset
  const handleApplyTheme = (themeName: keyof typeof THEMES) => {
    const theme = THEMES[themeName];
    setConfig((prev) => ({
      ...prev,
      theme: themeName as any,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      borderColor: theme.borderColor,
      accentColor: theme.accentColor,
      cardBackgroundColor: theme.cardBackgroundColor,
      cardTextColor: theme.cardTextColor,
      borderRadius: theme.borderRadius,
      borderWidth: theme.borderWidth,
      showShadow: theme.showShadow,
      shadowColor: theme.shadowColor,
      fontFamily: theme.fontFamily,
    }));
  };

  // Helper to add a new Emoji Sticker
  const addEmojiSticker = (emoji: string) => {
    const newSticker: StickerInstance = {
      id: `sticker-${Date.now()}`,
      type: 'emoji',
      value: emoji,
      x: 50,
      y: 50,
      size: 32,
      rotation: 0,
    };
    setConfig((prev) => ({
      ...prev,
      stickers: [...prev.stickers, newSticker],
    }));
    setSelectedElement({ id: newSticker.id, kind: 'sticker' });
  };

  // Helper to add a new SVG icon Sticker
  const addSvgSticker = (svgName: string) => {
    const newSticker: StickerInstance = {
      id: `sticker-${Date.now()}`,
      type: 'svg',
      value: svgName,
      x: 50,
      y: 50,
      size: 36,
      rotation: 0,
      color: config.accentColor,
    };
    setConfig((prev) => ({
      ...prev,
      stickers: [...prev.stickers, newSticker],
    }));
    setSelectedElement({ id: newSticker.id, kind: 'sticker' });
  };

  // Helper to add a custom absolute text
  const addCustomText = () => {
    const newText: TextInstance = {
      id: `text-${Date.now()}`,
      text: 'Scritta Live ✦',
      x: 50,
      y: 55,
      fontSize: 14,
      fontWeight: 'bold',
      color: config.accentColor,
      rotation: 0,
      fontFamily: config.fontFamily,
    };
    setConfig((prev) => ({
      ...prev,
      texts: [...prev.texts, newText],
    }));
    setSelectedElement({ id: newText.id, kind: 'text' });
  };

  // Delete any sticker or text element
  const deleteElement = (id: string, kind: 'sticker' | 'text') => {
    setConfig((prev) => {
      if (kind === 'sticker') {
        return {
          ...prev,
          stickers: prev.stickers.filter((s) => s.id !== id),
        };
      } else {
        return {
          ...prev,
          texts: prev.texts.filter((t) => t.id !== id),
        };
      }
    });
    setSelectedElement((prev) => (prev?.id === id ? null : prev));
  };

  // Delete selected sticker or text
  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    deleteElement(selectedElement.id, selectedElement.kind);
  };

  // Reset config to defaults
  const handleReset = () => {
    if (window.confirm("Sicuro di voler resettare il badge alle impostazioni iniziali?")) {
      setConfig(DEFAULT_CONFIG);
      setSelectedElement(null);
    }
  };

  // Handle selected element editing helper
  const getSelectedElementData = () => {
    if (!selectedElement) return null;
    const { id, kind } = selectedElement;
    if (kind === 'sticker') {
      return config.stickers.find((s) => s.id === id);
    } else {
      return config.texts.find((t) => t.id === id);
    }
  };

  const updateSelectedElementValue = (field: string, val: any) => {
    if (!selectedElement) return;
    const { id, kind } = selectedElement;
    setConfig((prev) => {
      if (kind === 'sticker') {
        return {
          ...prev,
          stickers: prev.stickers.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
        };
      } else {
        return {
          ...prev,
          texts: prev.texts.map((t) => (t.id === id ? { ...t, [field]: val } : t)),
        };
      }
    });
  };

  // Simple PNG downloader
  const downloadPNG = () => {
    const element = document.getElementById('custom-badge-canvas');
    if (!element) return;

    // Temporarily clear selection so the exported PNG doesn't contain the active editing outlines or "Elimina" bubbles
    const previousSelection = selectedElement;
    if (previousSelection) {
      setSelectedElement(null);
    }

    // Wait a brief moment for React to flush the DOM update without selected outlines
    setTimeout(() => {
      const updatedElement = document.getElementById('custom-badge-canvas');
      if (!updatedElement) {
        if (previousSelection) setSelectedElement(previousSelection);
        return;
      }

      // Save original styles to restore later so the responsive preview isn't permanently broken
      const originalWidth = updatedElement.style.width;
      const originalHeight = updatedElement.style.height;
      const originalMinWidth = updatedElement.style.minWidth;
      const originalMinHeight = updatedElement.style.minHeight;
      const originalMaxWidth = updatedElement.style.maxWidth;
      const originalMaxHeight = updatedElement.style.maxHeight;
      const originalFlexShrink = updatedElement.style.flexShrink;

      // Force exact designed pixel dimensions for html2canvas so that text doesn't wrap or truncate
      updatedElement.style.width = `${config.width}px`;
      updatedElement.style.height = `${config.height}px`;
      updatedElement.style.minWidth = `${config.width}px`;
      updatedElement.style.minHeight = `${config.height}px`;
      updatedElement.style.maxWidth = `${config.width}px`;
      updatedElement.style.maxHeight = `${config.height}px`;
      updatedElement.style.flexShrink = '0';

      // Setup temporary overrides to prevent html2canvas oklab/oklch parser crashes
      const originalGetComputedStyle = window.getComputedStyle;
      const originalGetPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;
      const originalStyleSheets = document.styleSheets;
      const originalStyleSheetsDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'styleSheets') || 
                                             Object.getOwnPropertyDescriptor(document, 'styleSheets');

      // 1. Intercept window.getComputedStyle
      window.getComputedStyle = function (elt, pseudoElt) {
        const style = originalGetComputedStyle(elt, pseudoElt);
        return new Proxy(style, {
          get(target, prop) {
            if (prop === 'getPropertyValue') {
              return function(propertyName: string) {
                const val = target.getPropertyValue(propertyName);
                if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
                  return val.replace(/(oklch|oklab)\([^)]+\)/g, 'rgba(0,0,0,0)');
                }
                return val;
              };
            }
            const val = target[prop as keyof CSSStyleDeclaration];
            if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
              return val.replace(/(oklch|oklab)\([^)]+\)/g, 'rgba(0,0,0,0)');
            }
            if (typeof val === 'function') {
              return val.bind(target);
            }
            return val;
          }
        });
      };

      // 2. Intercept CSSStyleDeclaration.prototype.getPropertyValue
      CSSStyleDeclaration.prototype.getPropertyValue = function(propertyName: string) {
        const val = originalGetPropertyValue.call(this, propertyName);
        if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
          return val.replace(/(oklch|oklab)\([^)]+\)/g, 'rgba(0,0,0,0)');
        }
        return val;
      };

      // 3. Intercept document.styleSheets
      let proxiedStyleSheets: any = null;
      try {
        const stylesheetProxies = Array.from(originalStyleSheets).map(sheet => {
          return new Proxy(sheet, {
            get(target, prop) {
              if (prop === 'cssRules' || prop === 'rules') {
                try {
                  const rules = target.cssRules || target.rules;
                  if (!rules) return rules;
                  const filteredRules = Array.from(rules).filter(rule => {
                    if (rule.cssText && (rule.cssText.includes('oklch') || rule.cssText.includes('oklab'))) {
                      return false; // Skip rules with oklch/oklab to avoid crashes
                    }
                    return true;
                  });
                  return filteredRules;
                } catch (e) {
                  return [];
                }
              }
              const val = target[prop as keyof CSSStyleSheet];
              if (typeof val === 'function') {
                return val.bind(target);
              }
              return val;
            }
          });
        });

        proxiedStyleSheets = new Proxy(originalStyleSheets, {
          get(target, prop) {
            if (prop === 'length') {
              return stylesheetProxies.length;
            }
            const idx = Number(prop);
            if (!isNaN(idx)) {
              return stylesheetProxies[idx];
            }
            if (prop === 'item') {
              return (index: number) => stylesheetProxies[index];
            }
            if (prop === Symbol.iterator) {
              return function* () {
                for (const proxy of stylesheetProxies) {
                  yield proxy;
                }
              };
            }
            const val = target[prop as keyof StyleSheetList];
            if (typeof val === 'function') {
              return val.bind(target);
            }
            return val;
          }
        });

        Object.defineProperty(document, 'styleSheets', {
          get: () => proxiedStyleSheets,
          configurable: true
        });
      } catch (e) {
        console.warn("Could not patch document.styleSheets:", e);
      }

      // Restore function to be called in .finally() / catch / then
      const restoreAll = () => {
        window.getComputedStyle = originalGetComputedStyle;
        CSSStyleDeclaration.prototype.getPropertyValue = originalGetPropertyValue;
        try {
          if (originalStyleSheetsDescriptor) {
            Object.defineProperty(document, 'styleSheets', originalStyleSheetsDescriptor);
          } else {
            delete (document as any).styleSheets;
          }
        } catch (e) {
          console.warn("Could not restore document.styleSheets:", e);
        }

        // Restore dimensions of the element so the live preview goes back to normal responsive mode
        updatedElement.style.width = originalWidth;
        updatedElement.style.height = originalHeight;
        updatedElement.style.minWidth = originalMinWidth;
        updatedElement.style.minHeight = originalMinHeight;
        updatedElement.style.maxWidth = originalMaxWidth;
        updatedElement.style.maxHeight = originalMaxHeight;
        updatedElement.style.flexShrink = originalFlexShrink;
      };

      html2canvas(updatedElement, {
        scale: 3, // High quality retina scale
        backgroundColor: null, // Keep background transparent/original
        useCORS: true,
        allowTaint: true,
        logging: false,
      }).then((canvas) => {
        restoreAll();
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `badge-calendario-${config.type}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Restore previous selection
        if (previousSelection) {
          setSelectedElement(previousSelection);
        }
      }).catch((err) => {
        restoreAll();
        console.error("html2canvas drawing error:", err);
        alert("Errore nell'esportazione PNG. Puoi comunque copiare il codice HTML o l'Iframe, che funzionano ovunque!");
        if (previousSelection) {
          setSelectedElement(previousSelection);
        }
      });
    }, 80);
  };

  // Embed view rendering
  if (isEmbed && embedConfig) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-transparent overflow-hidden p-0 m-0 no-scrollbar">
        <BadgeRenderer 
          config={embedConfig} 
          isEmbedMode={true} 
        />
      </div>
    );
  }

  const selectedData = getSelectedElementData();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* GLOBAL HEADER */}
      <header className="bg-white border-b border-slate-100 py-3.5 px-6 shrink-0 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Calendar size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 leading-none mb-1">
                Badge Calendar Creator
                <span className="text-[10px] py-0.5 px-1.5 font-bold uppercase rounded bg-blue-50 text-blue-600 border border-blue-100">
                  v1.2
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Disegna e incorpora micro-widget calendario personalizzati sul tuo sito
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <a
              href="https://ai.studio/build"
              target="_blank"
              rel="noreferrer"
              className="text-white bg-slate-900 hover:bg-slate-800 transition-colors px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              Google AI Studio
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: VISUAL BUILDER CONTROLS (5 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* BADGE TYPE TOGGLE */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Tipo di Calendario
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
              <button
                onClick={() => setConfig(prev => ({ ...prev, type: 'daily' }))}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  config.type === 'daily'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock size={14} />
                Giornaliero
              </button>
              <button
                onClick={() => setConfig(prev => ({ ...prev, type: 'weekly' }))}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  config.type === 'weekly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar size={14} />
                Settimanale
              </button>
            </div>
          </div>

          {/* PALETTE & THEMES */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Palette className="text-blue-500" size={16} />
              Temi e Colori
            </h3>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(THEMES).map((themeKey) => {
                const isSelected = config.theme === themeKey;
                const themeData = THEMES[themeKey as keyof typeof THEMES];
                return (
                  <button
                    key={themeKey}
                    onClick={() => handleApplyTheme(themeKey as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20'
                        : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div 
                      className="w-7 h-7 rounded-lg shadow-inner border border-black/5 flex items-center justify-center text-xs font-black overflow-hidden"
                      style={{ backgroundColor: themeData.backgroundColor, color: themeData.textColor }}
                    >
                      A
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 tracking-tight leading-none">
                      {themeData.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Tuning */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Colori Manuali</span>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Customizer</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Sfondo Widget</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value, theme: 'custom' }))}
                      className="w-7 h-7 rounded cursor-pointer border border-slate-200"
                    />
                    <span className="text-xs font-mono">{config.backgroundColor.toUpperCase()}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Testo Principale</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value, theme: 'custom' }))}
                      className="w-7 h-7 rounded cursor-pointer border border-slate-200"
                    />
                    <span className="text-xs font-mono">{config.textColor.toUpperCase()}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Sfondo Scheda</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={config.cardBackgroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, cardBackgroundColor: e.target.value, theme: 'custom' }))}
                      className="w-7 h-7 rounded cursor-pointer border border-slate-200"
                    />
                    <span className="text-xs font-mono">{config.cardBackgroundColor.toUpperCase()}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Brand / Accento</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, accentColor: e.target.value, theme: 'custom' }))}
                      className="w-7 h-7 rounded cursor-pointer border border-slate-200"
                    />
                    <span className="text-xs font-mono">{config.accentColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LAYOUT & GEOMETRY */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Settings className="text-blue-500" size={16} />
              Geometria & Layout
            </h3>

            {/* Width and Height Slider */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 flex justify-between mb-1">
                  <span>Larghezza</span>
                  <span className="font-mono text-slate-400">{config.width}px</span>
                </label>
                <input
                  type="range"
                  min="260"
                  max="400"
                  step="10"
                  value={config.width}
                  onChange={(e) => setConfig(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 flex justify-between mb-1">
                  <span>Altezza</span>
                  <span className="font-mono text-slate-400">{config.height}px</span>
                </label>
                <input
                  type="range"
                  min="320"
                  max="520"
                  step="10"
                  value={config.height}
                  onChange={(e) => setConfig(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            {/* Rounded, border, shadow controls */}
            <div className="flex flex-col gap-3 pt-2">
              <div>
                <label className="text-xs font-medium text-slate-500 flex justify-between mb-1">
                  <span>Arrotondamento Angoli</span>
                  <span className="font-mono text-slate-400">{config.borderRadius}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="28"
                  value={config.borderRadius}
                  onChange={(e) => setConfig(prev => ({ ...prev, borderRadius: parseInt(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 flex justify-between mb-1">
                  <span>Spessore Bordo</span>
                  <span className="font-mono text-slate-400">{config.borderWidth}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={config.borderWidth}
                  onChange={(e) => setConfig(prev => ({ ...prev, borderWidth: parseInt(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-slate-500">Ombra Esterna</span>
                <input
                  type="checkbox"
                  checked={config.showShadow}
                  onChange={(e) => setConfig(prev => ({ ...prev, showShadow: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
              </div>

              {/* Font Family Selector */}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Stile Carattere (Font)</label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => setConfig(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="font-sans">Inter (Pulito & Moderno)</option>
                  <option value="font-grotesk">Space Grotesk (Tecnologico)</option>
                  <option value="font-serif">Playfair Display (Classico ed Elegante)</option>
                  <option value="font-mono">JetBrains Mono (Sviluppatore / Arcade)</option>
                  <option value="font-playful">Fredoka (Arrotondato & Amichevole)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: PREVIEW & STICKERS PALETTE (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 items-center">
          
          {/* BADGE RENDERER CONTAINER */}
          <div className="bg-slate-200/50 rounded-3xl p-6 border border-slate-200/60 w-full flex flex-col items-center justify-center min-h-[460px] relative shadow-inner group">
            <span className="absolute top-2 left-4 text-[9px] font-bold text-slate-400 bg-slate-100 py-0.5 px-2 rounded-full">
              Canvas di Anteprima {config.width}x{config.height}px
            </span>
            
            {/* Real React Badge preview container */}
            <div className="relative transform scale-100 transition-transform duration-300">
              <BadgeRenderer
                config={config}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onUpdateElementPosition={handleUpdateElementPosition}
                onDeleteElement={deleteElement}
              />
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-5 leading-relaxed">
              💡 Clicca e trascina sticker o testi per riposizionarli sul badge!
            </p>
          </div>

          {/* DYNAMIC ACTIONS PANEL */}
          <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Elementi Decorativi
              </span>
              <button
                onClick={addCustomText}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
              >
                <Plus size={12} />
                + Aggiungi Testo
              </button>
            </div>

            {/* Sticker Add Options */}
            <div className="flex flex-col gap-2.5">
              {/* Emojis list */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Aggiungi Emoji</span>
                <div className="flex gap-1 overflow-x-auto pb-1.5 no-scrollbar max-w-[340px]">
                  {STICKER_EMOJIS.slice(0, 16).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmojiSticker(emoji)}
                      className="text-lg hover:bg-slate-50 p-1.5 rounded-lg active:scale-95 transition-all cursor-pointer block"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vector Icons list */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Aggiungi Icona Vettoriale (SVG)</span>
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar max-w-[340px]">
                  {Object.keys(STICKER_SVGS).map((svgKey) => (
                    <button
                      key={svgKey}
                      onClick={() => addSvgSticker(svgKey)}
                      className="p-2 border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-lg flex items-center justify-center shrink-0"
                      title={svgKey}
                    >
                      <svg viewBox={STICKER_SVGS[svgKey].viewBox} className="w-4 h-4 fill-slate-700 hover:fill-blue-600">
                        <path d={STICKER_SVGS[svgKey].path} />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 my-1" />

            {/* Elements list / Layers */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Livelli Badge ({config.stickers.length + config.texts.length})
              </span>

              {(config.stickers.length === 0 && config.texts.length === 0) ? (
                <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  Nessun elemento aggiunto. Usa i pulsanti sopra per inserire emoji, icone o testi personalizzati!
                </p>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {/* Render texts list */}
                  {config.texts.map((t) => {
                    const isSelected = selectedElement?.id === t.id && selectedElement?.kind === 'text';
                    return (
                      <div 
                        key={t.id}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium shadow-sm' 
                            : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-700'
                        }`}
                        onClick={() => setSelectedElement({ id: t.id, kind: 'text' })}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-wider px-1.5 py-0.5 bg-blue-100 rounded">TESTO</span>
                          <span className="truncate">"{t.text}"</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(t.id, 'text');
                          }}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Elimina testo"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}

                  {/* Render stickers list */}
                  {config.stickers.map((s) => {
                    const isSelected = selectedElement?.id === s.id && selectedElement?.kind === 'sticker';
                    return (
                      <div 
                        key={s.id}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium shadow-sm' 
                            : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-700'
                        }`}
                        onClick={() => setSelectedElement({ id: s.id, kind: 'sticker' })}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {s.type === 'emoji' ? (
                            <span className="text-sm px-1.5 py-0.5 bg-slate-100 rounded">{s.value}</span>
                          ) : (
                            <div className="p-1 rounded bg-slate-100 flex items-center justify-center shrink-0">
                              <svg viewBox={STICKER_SVGS[s.value]?.viewBox || "0 0 24 24"} className="w-3.5 h-3.5" fill={s.color || config.textColor}>
                                <path d={STICKER_SVGS[s.value]?.path || ""} />
                              </svg>
                            </div>
                          )}
                          <span className="truncate">
                            {s.type === 'emoji' ? `Emoji` : `Icona ${s.value}`}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(s.id, 'sticker');
                          }}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Elimina sticker"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE SELECTION CONTROL POPUP IN-PLACE */}
          {selectedElement && selectedData && (
            <div className="w-full bg-slate-900 text-slate-100 p-4 rounded-2xl shadow-xl flex flex-col gap-3 relative animate-fadeIn border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase flex items-center gap-1">
                  <Sliders size={12} />
                  Modifica Elemento
                </span>
                <button
                  onClick={deleteSelectedElement}
                  className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-slate-800 transition-colors"
                  title="Elimina"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Editing controls */}
              <div className="flex flex-col gap-2.5">
                {selectedElement.kind === 'text' && (
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Scritta Personalizzata</label>
                    <input
                      type="text"
                      value={(selectedData as TextInstance).text}
                      onChange={(e) => updateSelectedElementValue('text', e.target.value)}
                      className="w-full bg-slate-800 text-white text-xs border border-slate-700 rounded p-1.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Dimensione ({selectedData.size ?? (selectedData as TextInstance).fontSize}px)</label>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={selectedData.size ?? (selectedData as TextInstance).fontSize}
                      onChange={(e) => updateSelectedElementValue(selectedElement.kind === 'sticker' ? 'size' : 'fontSize', parseInt(e.target.value))}
                      className="w-full accent-blue-400 h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Rotazione ({selectedData.rotation}°)</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={selectedData.rotation}
                      onChange={(e) => updateSelectedElementValue('rotation', parseInt(e.target.value))}
                      className="w-full accent-blue-400 h-1"
                    />
                  </div>
                </div>

                {/* Specific Colors & Position Tuning sliders */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedElement.kind === 'sticker' && (selectedData as StickerInstance).type === 'svg' && (
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Colore SVG</label>
                      <input
                        type="color"
                        value={(selectedData as StickerInstance).color || config.textColor}
                        onChange={(e) => updateSelectedElementValue('color', e.target.value)}
                        className="w-full bg-transparent h-6 cursor-pointer"
                      />
                    </div>
                  )}
                  {selectedElement.kind === 'text' && (
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Colore Testo</label>
                      <input
                        type="color"
                        value={(selectedData as TextInstance).color || config.textColor}
                        onChange={(e) => updateSelectedElementValue('color', e.target.value)}
                        className="w-full bg-transparent h-6 cursor-pointer"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Carattere (Font)</label>
                    <select
                      value={selectedData.fontFamily ?? config.fontFamily}
                      onChange={(e) => updateSelectedElementValue('fontFamily', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-[10px] text-white"
                    >
                      <option value="font-sans">Sans</option>
                      <option value="font-mono">Mono</option>
                      <option value="font-grotesk">Grotesk</option>
                      <option value="font-serif">Serif</option>
                      <option value="font-playful">Playful</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Posizione X ({selectedData.x}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedData.x}
                      onChange={(e) => updateSelectedElementValue('x', parseInt(e.target.value))}
                      className="w-full accent-blue-400 h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Posizione Y ({selectedData.y}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedData.y}
                      onChange={(e) => updateSelectedElementValue('y', parseInt(e.target.value))}
                      className="w-full accent-blue-400 h-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DATA CONTENT EDITING (3 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* CONTENT DATA PANEL */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Informazioni Badge ({config.type === 'daily' ? 'Giornaliero' : 'Settimanale'})
              </h3>
            </div>

            {/* HEADER DESIGN SUB-PANEL */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Intestazione (Header)</span>
                <input
                  type="checkbox"
                  checked={config.showHeader}
                  onChange={(e) => setConfig(prev => ({ ...prev, showHeader: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
              </div>

              {config.showHeader && (
                <div className="grid grid-cols-1 gap-2.5 pl-3 border-l-2 border-slate-100">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Titolo Intestazione</label>
                    <input
                      type="text"
                      value={config.headerTitle}
                      onChange={(e) => setConfig(prev => ({ ...prev, headerTitle: e.target.value }))}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Testo Status</label>
                      <input
                        type="text"
                        value={config.statusText}
                        onChange={(e) => setConfig(prev => ({ ...prev, statusText: e.target.value }))}
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                        placeholder="Es: LIVE"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Colore Dot</label>
                      <input
                        type="color"
                        value={config.statusDotColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, statusDotColor: e.target.value }))}
                        className="w-full h-8 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CONDITIONAL CONTROLS: DAILY MODE */}
            {config.type === 'daily' ? (
              <div className="flex flex-col gap-3.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 block">Dati dell'Evento</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Giorno (Testo)</label>
                    <input
                      type="text"
                      value={config.daily.dayName}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        daily: { ...prev.daily, dayName: e.target.value }
                      }))}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                      placeholder="Es: Venerdì"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Giorno (Numero)</label>
                    <input
                      type="text"
                      value={config.daily.dayNumber}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        daily: { ...prev.daily, dayNumber: e.target.value }
                      }))}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                      placeholder="Es: 10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Mese</label>
                    <input
                      type="text"
                      value={config.daily.monthName}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        daily: { ...prev.daily, monthName: e.target.value }
                      }))}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                      placeholder="Es: Luglio"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Anno / Località</label>
                    <input
                      type="text"
                      value={config.daily.year}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        daily: { ...prev.daily, year: e.target.value }
                      }))}
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                      placeholder="Es: 2026"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Titolo Evento</label>
                  <input
                    type="text"
                    value={config.daily.title}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      daily: { ...prev.daily, title: e.target.value }
                    }))}
                    className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold"
                    placeholder="Es: Lancio Prodotto"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Descrizione Evento</label>
                  <textarea
                    rows={2}
                    value={config.daily.description}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      daily: { ...prev.daily, description: e.target.value }
                    }))}
                    className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                    placeholder="Aggiungi una breve descrizione..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Orario o Dettaglio</label>
                  <input
                    type="text"
                    value={config.daily.time}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      daily: { ...prev.daily, time: e.target.value }
                    }))}
                    className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                    placeholder="Es: 15:00 - 16:30 CEST"
                  />
                </div>

                {/* Event tag customizing */}
                <div className="border-t border-slate-50 pt-2.5 flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Etichetta Evento (Tag)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Testo Tag</label>
                      <input
                        type="text"
                        value={config.daily.tagText}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          daily: { ...prev.daily, tagText: e.target.value }
                        }))}
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                        placeholder="Es: Importante"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Colore Tag</label>
                      <input
                        type="color"
                        value={config.daily.tagBgColor}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          daily: { ...prev.daily, tagBgColor: e.target.value }
                        }))}
                        className="w-full h-8 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* CONDITIONAL CONTROLS: WEEKLY MODE */
              <div className="flex flex-col gap-3.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 block">Orario Settimanale</span>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Sottotitolo / Settimana</label>
                  <input
                    type="text"
                    value={config.weekly.subtitle}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      weekly: { ...prev.weekly, subtitle: e.target.value }
                    }))}
                    className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold"
                    placeholder="Es: Settimana 10-16 Luglio"
                  />
                </div>

                {/* Mini day editor tabs */}
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Giorni della Settimana</label>
                  <div className="flex gap-1 overflow-x-auto pb-1 max-w-[340px] no-scrollbar">
                    {config.weekly.days.map((day, idx) => (
                      <button
                        key={day.id}
                        onClick={() => setActiveDayIndex(idx)}
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all shrink-0 border ${
                          activeDayIndex === idx
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {day.dayName || `Gg ${idx + 1}`}
                      </button>
                    ))}
                  </div>

                  {/* Active Day detailed edits */}
                  {config.weekly.days[activeDayIndex] && (
                    <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          Modifica {config.weekly.days[activeDayIndex].dayName}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">Abilita giorno</span>
                          <input
                            type="checkbox"
                            checked={config.weekly.days[activeDayIndex].enabled}
                            onChange={(e) => {
                              const updatedDays = [...config.weekly.days];
                              updatedDays[activeDayIndex] = { ...updatedDays[activeDayIndex], enabled: e.target.checked };
                              setConfig(prev => ({ ...prev, weekly: { ...prev.weekly, days: updatedDays } }));
                            }}
                            className="w-3.5 h-3.5 text-blue-600 rounded cursor-pointer"
                          />
                        </div>
                      </div>

                      {config.weekly.days[activeDayIndex].enabled ? (
                        <div className="flex flex-col gap-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block">Sigla Giorno</label>
                              <input
                                type="text"
                                value={config.weekly.days[activeDayIndex].dayName}
                                onChange={(e) => {
                                  const updatedDays = [...config.weekly.days];
                                  updatedDays[activeDayIndex] = { ...updatedDays[activeDayIndex], dayName: e.target.value.toUpperCase() };
                                  setConfig(prev => ({ ...prev, weekly: { ...prev.weekly, days: updatedDays } }));
                                }}
                                className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs uppercase"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block">Data (Giorno)</label>
                              <input
                                type="text"
                                value={config.weekly.days[activeDayIndex].dateLabel}
                                onChange={(e) => {
                                  const updatedDays = [...config.weekly.days];
                                  updatedDays[activeDayIndex] = { ...updatedDays[activeDayIndex], dateLabel: e.target.value };
                                  setConfig(prev => ({ ...prev, weekly: { ...prev.weekly, days: updatedDays } }));
                                }}
                                className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block">Titolo Evento Giorno</label>
                            <input
                              type="text"
                              value={config.weekly.days[activeDayIndex].title}
                              onChange={(e) => {
                                const updatedDays = [...config.weekly.days];
                                updatedDays[activeDayIndex] = { ...updatedDays[activeDayIndex], title: e.target.value };
                                setConfig(prev => ({ ...prev, weekly: { ...prev.weekly, days: updatedDays } }));
                              }}
                              className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-medium"
                              placeholder="Es: Call, Live, Lancio..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block">Orario</label>
                              <input
                                type="text"
                                value={config.weekly.days[activeDayIndex].time}
                                onChange={(e) => {
                                  const updatedDays = [...config.weekly.days];
                                  updatedDays[activeDayIndex] = { ...updatedDays[activeDayIndex], time: e.target.value };
                                  setConfig(prev => ({ ...prev, weekly: { ...prev.weekly, days: updatedDays } }));
                                }}
                                className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                                placeholder="Es: 10:00"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block">Testo Etichetta</label>
                              <input
                                type="text"
                                value={config.weekly.days[activeDayIndex].tagText}
                                onChange={(e) => {
                                  const updatedDays = [...config.weekly.days];
                                  updatedDays[activeDayIndex] = { ...updatedDays[activeDayIndex], tagText: e.target.value };
                                  setConfig(prev => ({ ...prev, weekly: { ...prev.weekly, days: updatedDays } }));
                                }}
                                className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                                placeholder="Es: Live"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-xs opacity-50 italic py-4">Giorno disattivato. Spunta "Abilita giorno" per attivarlo.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RASTER DOWNLOAD & COMPACT CODE OPTIONS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Download className="text-blue-500" size={16} />
              Download Rapido
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Esporta il tuo design istantaneamente come immagine da salvare o condividere.
            </p>
            <button
              onClick={downloadPNG}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 transition-all cursor-pointer"
            >
              <Download size={14} />
              Scarica Badge PNG
            </button>
          </div>
        </div>

        {/* FULL WIDTH BOTTOM COLUMN: CODE GENERATION / COPY-PASTE (12 Cols) */}
        <div className="lg:col-span-12 mt-4">
          <EmbedGenerator config={config} />
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-12 shrink-0">
        <p className="mb-1">Badge Calendar Creator — 100% Client-Side & Reattivo</p>
        <p>Lancia su qualsiasi piattaforma web, da WordPress a Shopify, Webflow e siti custom.</p>
      </footer>
    </div>
  );
}
