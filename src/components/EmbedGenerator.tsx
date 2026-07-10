/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BadgeConfig } from '../types';
import { encodeConfig, STICKER_SVGS } from '../data';
import { Code, Copy, Check, FileCode, Monitor, Share2, HelpCircle } from 'lucide-react';

const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  if (cleanHex.length !== 6) return hex;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface EmbedGeneratorProps {
  config: BadgeConfig;
}

export const EmbedGenerator: React.FC<EmbedGeneratorProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'iframe' | 'html' | 'link'>('iframe');
  const [copied, setCopied] = useState(false);

  // Serialize config
  const encoded = encodeConfig(config);
  
  // Construct self-referential URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const embedUrl = `${origin}${pathname}#embed=${encoded}`;

  // 1. IFRAME EMBED CODE
  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="${config.width}" 
  height="${config.height}" 
  style="border: none; border-radius: ${config.borderRadius}px; overflow: hidden; width: 100%; max-width: ${config.width}px; height: ${config.height}px;" 
  scrolling="no" 
  title="${config.headerTitle || 'Calendario Badge'}"
></iframe>`;

  // 2. STATIC HTML/CSS CODE (inline Tailwind styles recreated for standalone)
  // Let's create an elegant, fully inline static HTML version for fast load!
  const getHtmlCardStyleStr = () => {
    if (config.theme === 'glass') {
      return `
        background-color: rgba(255, 255, 255, 0.06);
        color: ${config.cardTextColor};
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: ${Math.max(4, config.borderRadius - 4)}px;
      `;
    }
    
    if (config.theme === 'brutalist') {
      return `
        background-color: ${config.cardBackgroundColor};
        color: ${config.cardTextColor};
        border: 2px solid #000000;
        border-radius: 0px;
        box-shadow: 3px 3px 0px 0px #000000;
      `;
    }

    if (config.theme === 'artistic') {
      return `
        background-color: ${config.cardBackgroundColor};
        color: ${config.cardTextColor};
        border: 2px solid ${config.borderColor || '#2E1A47'};
        border-radius: 12px;
        box-shadow: 4px 4px 0px 0px ${config.borderColor || '#2E1A47'};
      `;
    }

    const hasBorder = config.theme === 'minimal';
    return `
      background-color: ${config.cardBackgroundColor};
      color: ${config.cardTextColor};
      border: ${hasBorder ? '1px solid #E2E8F0' : 'none'};
      border-radius: ${Math.max(4, config.borderRadius - 4)}px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    `;
  };

  const getHtmlBadgeBackgroundStyleStr = () => {
    if (config.theme === 'glass') {
      return `
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        background-color: #0F172A;
      `;
    }
    return `background-color: ${config.backgroundColor};`;
  };

  const shadowValue = config.showShadow 
    ? config.theme === 'brutalist' 
      ? `box-shadow: 6px 6px 0px 0px ${config.shadowColor || '#000000'};` 
      : config.theme === 'artistic'
        ? `box-shadow: 8px 8px 0px 0px ${config.shadowColor || '#E879F9'};`
        : `box-shadow: 0 10px 25px -5px ${config.shadowColor || 'rgba(0,0,0,0.1)'};`
    : '';

  const borderStyle = `${config.borderWidth}px solid ${config.borderColor}`;
  const fontStyles = {
    'font-sans': `font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`,
    'font-mono': `font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;`,
    'font-grotesk': `font-family: "Space Grotesk", sans-serif;`,
    'font-serif': `font-family: "Playfair Display", Georgia, serif;`,
    'font-playful': `font-family: "Fredoka", sans-serif;`,
  };

  const selectedFont = fontStyles[config.fontFamily as keyof typeof fontStyles] || fontStyles['font-sans'];

  const htmlCode = `<!-- Badge Calendario ${config.type === 'daily' ? 'Giornaliero' : 'Settimanale'} -->
<!-- Import fonts and global scrollbar styles for external render -->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  
  .badge-scroll-container::-webkit-scrollbar {
    display: none;
  }
  .badge-scroll-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .calendario-badge-root {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
  }
  .calendario-badge-root:hover {
    transform: translateY(-5px);
    ${config.showShadow ? (
      config.theme === 'brutalist' 
        ? `box-shadow: 10px 10px 0px 0px ${config.shadowColor || '#000000'} !important;` 
        : config.theme === 'artistic'
          ? `box-shadow: 12px 12px 0px 0px ${config.shadowColor || '#E879F9'} !important;`
          : `box-shadow: 0 20px 35px -8px ${config.shadowColor || 'rgba(0,0,0,0.15)'} !important;`
    ) : ''}
  }

  .calendario-badge-card {
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background-color 0.2s ease;
  }
  .calendario-badge-card:hover {
    transform: scale(1.02);
    ${config.theme !== 'glass' ? `background-color: ${hexToRgba(config.cardBackgroundColor, 0.98)} !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;` : ''}
  }
</style>

<div class="calendario-badge-root" style="
  position: relative;
  width: 100%;
  max-width: ${config.width}px;
  height: ${config.height}px;
  border-radius: ${config.borderRadius}px;
  border: ${borderStyle};
  ${getHtmlBadgeBackgroundStyleStr()}
  color: ${config.textColor};
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${selectedFont}
  ${shadowValue}
">
  <!-- Theme aesthetic background overlays -->
  ${config.theme === 'sunset' ? `<div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(244, 63, 94, 0.05) 50%, transparent 100%); pointer-events: none; z-index: 0;"></div>` : ''}
  ${config.theme === 'artistic' ? `<div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(217, 70, 239, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%); pointer-events: none; z-index: 0;"></div>` : ''}
  ${config.theme === 'glass' ? `
  <div style="position: absolute; top: -48px; left: -48px; width: 112px; height: 112px; border-radius: 50%; background-color: rgba(99, 102, 241, 0.2); filter: blur(40px); pointer-events: none; z-index: 0;"></div>
  <div style="position: absolute; bottom: -48px; right: -48px; width: 128px; height: 128px; border-radius: 50%; background-color: rgba(236, 72, 153, 0.2); filter: blur(40px); pointer-events: none; z-index: 0;"></div>
  ` : ''}

  ${config.showHeader ? `
  <!-- Header -->
  <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid ${config.theme === 'glass' ? 'rgba(255, 255, 255, 0.1)' : hexToRgba(config.textColor, 0.1)}; padding-bottom: 8px;">
    <div style="display: flex; align-items: center;">
      ${config.showStatusDot ? `<span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${config.statusDotColor}; display: inline-block; margin-right: 8px;"></span>` : ''}
      <span style="font-size: 11px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.85;">${config.headerTitle}</span>
    </div>
    ${config.statusText ? `<span style="font-size: 10px; padding: 2px 8px; border-radius: 9999px; font-weight: bold; background-color: ${config.theme === 'glass' ? 'rgba(255,255,255,0.15)' : hexToRgba(config.accentColor, 0.15)}; color: ${config.theme === 'glass' ? '#FFFFFF' : config.accentColor};">${config.statusText}</span>` : ''}
  </div>` : ''}

  <!-- Event Content -->
  <div style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; min-height: 0;">
    ${config.type === 'daily' ? `
    <div style="display: flex; flex-direction: column;">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <div class="calendario-badge-card" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          min-width: 70px;
          height: 70px;
          box-sizing: border-box;
          text-align: center;
          margin-right: 12px;
          ${getHtmlCardStyleStr()}
        ">
          <span style="font-size: 10px; text-transform: uppercase; font-weight: bold; opacity: 0.75; margin-bottom: 1px; letter-spacing: 0.05em; line-height: 1;">${config.daily.dayName.substring(0, 3)}</span>
          <span style="font-size: 30px; font-weight: 900; line-height: 1; letter-spacing: -0.05em;">${config.daily.dayNumber}</span>
          <span style="font-size: 10px; text-transform: uppercase; font-weight: 600; opacity: 0.9; margin-top: 1px; letter-spacing: 0.05em; line-height: 1;">${config.daily.monthName.substring(0, 4)}</span>
        </div>
        <div style="flex: 1; min-width: 0; text-align: left;">
          ${config.daily.tagText ? `<span style="font-size: 10px; background-color: ${config.daily.tagBgColor}; color: ${config.daily.tagTextColor}; padding: 2px 8px; border-radius: 9999px; font-weight: bold; display: inline-block; margin-bottom: 4px;">${config.daily.tagText}</span>` : ''}
          <div style="font-size: 12px; opacity: 0.8; font-weight: 500;">⏰ ${config.daily.time}</div>
        </div>
      </div>
      <div class="calendario-badge-card" style="
        padding: 16px;
        box-sizing: border-box;
        text-align: left;
        overflow: hidden;
        ${getHtmlCardStyleStr()}
      ">
        <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: bold; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
          ${config.daily.title.length > 70 ? config.daily.title.substring(0, 67) + '...' : config.daily.title}
        </h3>
        <p style="margin: 0; font-size: 12px; opacity: 0.75; line-height: 1.5; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
          ${config.daily.description.length > 160 ? config.daily.description.substring(0, 157) + '...' : config.daily.description}
        </p>
      </div>
    </div>` : `
    <div style="display: flex; flex-direction: column; height: 100%; justify-content: start; min-height: 0;">
      ${config.weekly.subtitle ? `<div style="font-size: 11px; font-weight: bold; opacity: 0.75; margin-bottom: 8px; text-align: left;">📅 ${config.weekly.subtitle}</div>` : ''}
      <div class="badge-scroll-container" style="display: flex; flex-direction: column; overflow-y: auto; max-height: 260px;">
        ${config.weekly.days.filter(d => d.enabled).map(day => `
        <div class="calendario-badge-card" style="
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          box-sizing: border-box;
          margin-bottom: 6px;
          ${getHtmlCardStyleStr()}
        ">
          <div style="display: flex; align-items: center; min-width: 0; flex: 1; margin-right: 8px;">
            <div style="
              width: 40px;
              height: 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border-radius: 4px;
              background-color: ${hexToRgba(config.accentColor, 0.15)};
              color: ${config.textColor};
              font-weight: 900;
              line-height: 1;
              text-align: center;
              border-left: 3px solid ${config.accentColor};
              box-sizing: border-box;
              flex-shrink: 0;
              margin-right: 10px;
            ">
              <span style="font-size: 9px; opacity: 0.8; text-transform: uppercase;">${day.dayName}</span>
              <span style="font-size: 14px; font-weight: bold; margin-top: 2px;">${day.dateLabel}</span>
            </div>
            <div style="display: flex; flex-direction: column; min-width: 0; text-align: left; flex: 1;">
              <div style="font-weight: bold; font-size: 13px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${day.title.length > 32 ? day.title.substring(0, 29) + '...' : day.title || 'Nessun evento'}
              </div>
              <div style="font-size: 11px; opacity: 0.75; margin-top: 2px;">⏰ ${day.time}</div>
            </div>
          </div>
          ${day.tagText ? `<span style="font-size: 9px; padding: 2px 8px; border-radius: 9999px; background-color: ${day.tagBgColor || hexToRgba(config.accentColor, 0.15)}; color: ${day.tagTextColor || config.accentColor}; font-weight: bold; text-transform: uppercase; letter-spacing: 0.02em; flex-shrink: 0;">${day.tagText}</span>` : ''}
        </div>`).join('')}
        ${config.weekly.days.filter(d => d.enabled).length === 0 ? `<div style="text-align: center; padding: 32px 0; font-size: 12px; opacity: 0.5; font-style: italic;">Nessun giorno abilitato.</div>` : ''}
      </div>
    </div>`}
  </div>

  <!-- Decorative Stickers -->
  ${config.stickers.map(st => {
    if (st.type === 'emoji') {
      return `
  <div style="
    position: absolute;
    left: ${st.x}%;
    top: ${st.y}%;
    transform: translate(-50%, -50%) rotate(${st.rotation}deg);
    font-size: ${st.size * 0.8}px;
    line-height: 1;
    z-index: 10;
    user-select: none;
  ">${st.value}</div>`;
    } else {
      const svgInfo = STICKER_SVGS[st.value];
      if (!svgInfo) return '';
      return `
  <div style="
    position: absolute;
    left: ${st.x}%;
    top: ${st.y}%;
    transform: translate(-50%, -50%) rotate(${st.rotation}deg);
    width: ${st.size}px;
    height: ${st.size}px;
    z-index: 10;
    user-select: none;
  ">
    <svg viewBox="${svgInfo.viewBox}" style="width: 100%; height: 100%; fill: ${st.color || config.accentColor}; display: block;">
      <path d="${svgInfo.path}" />
    </svg>
  </div>`;
    }
  }).join('')}

  <!-- Decorative Texts -->
  ${config.texts.map(t => {
    const tFont = fontStyles[t.fontFamily as keyof typeof fontStyles] || fontStyles[config.fontFamily as keyof typeof fontStyles] || fontStyles['font-sans'];
    const fontWeight = t.fontWeight === 'bold' ? 'bold' : t.fontWeight === 'black' ? '900' : t.fontWeight === 'medium' ? '500' : 'normal';
    return `
  <div style="
    position: absolute;
    left: ${t.x}%;
    top: ${t.y}%;
    transform: translate(-50%, -50%) rotate(${t.rotation || 0}deg);
    font-size: ${t.fontSize}px;
    color: ${t.color || config.textColor};
    font-weight: ${fontWeight};
    z-index: 11;
    user-select: none;
    line-height: 1;
    white-space: nowrap;
    ${tFont}
  ">${t.text}</div>`;
  }).join('')}

  <div style="position: relative; z-index: 1; margin-top: 16px; padding-top: 8px; border-top: 1px solid ${config.theme === 'glass' ? 'rgba(255, 255, 255, 0.1)' : hexToRgba(config.textColor, 0.08)}; font-size: 10px; opacity: 0.6; display: flex; justify-content: space-between;">
    <span>🗓️ Badge Calendario</span>
    <span>${config.type === 'daily' ? config.daily.year : 'Settimanale'}</span>
  </div>
</div>`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getCodeToCopy = () => {
    if (activeTab === 'iframe') return iframeCode;
    if (activeTab === 'html') return htmlCode;
    return embedUrl;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Code className="text-blue-500" size={18} />
          Esporta & Codice Embed
        </h3>
        <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
          <Check size={12} /> Pronto per l'integrazione
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Scegli il formato che preferisci per incorporare il badge nel tuo sito web. L'opzione <strong>Iframe Reattivo</strong> si aggiornerà automaticamente se apporti modifiche qui!
      </p>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('iframe')}
          className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'iframe'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Monitor size={14} />
          Iframe Reattivo
        </button>
        <button
          onClick={() => setActiveTab('html')}
          className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'html'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileCode size={14} />
          HTML Statico
        </button>
        <button
          onClick={() => setActiveTab('link')}
          className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'link'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Share2 size={14} />
          Link Diretto
        </button>
      </div>

      {/* Tab Content Preview */}
      <div className="relative">
        <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[160px] no-scrollbar">
          <code>{getCodeToCopy()}</code>
        </pre>
        
        <button
          onClick={() => copyToClipboard(getCodeToCopy())}
          className="absolute right-3 top-3 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors flex items-center gap-1.5 text-[11px] font-medium"
        >
          {copied ? (
            <>
              <Check className="text-emerald-400" size={14} />
              Copiato!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copia
            </>
          )}
        </button>
      </div>

      {/* Tips / Instructions */}
      <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 flex gap-2.5 items-start">
        <HelpCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <div className="text-[11px] text-blue-900 leading-relaxed">
          {activeTab === 'iframe' && (
            <span>
              <strong>Iframe Reattivo:</strong> È il metodo consigliato. Incorpora il widget ospitato sul server di AI Studio. Mostra sticker e testi esattamente come li hai disposti, è responsivo e non risente dei CSS del tuo sito.
            </span>
          )}
          {activeTab === 'html' && (
            <span>
              <strong>HTML Statico:</strong> Ottimo se vuoi caricare zero risorse esterne. Genera un badge statico interamente in codice HTML e CSS inline. Facile da modificare a mano nel tuo editor di testo!
            </span>
          )}
          {activeTab === 'link' && (
            <span>
              <strong>Link Diretto:</strong> Condividi questo URL con chiunque per mostrare direttamente il badge a schermo intero (modalità Embed) oppure per permettere ad altri di ricaricare questo editor con il tuo design esatto.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
