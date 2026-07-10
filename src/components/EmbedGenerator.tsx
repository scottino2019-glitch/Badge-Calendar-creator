/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BadgeConfig } from '../types';
import { encodeConfig } from '../data';
import { Code, Copy, Check, FileCode, Monitor, Share2, HelpCircle } from 'lucide-react';

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
  style="border: none; border-radius: ${config.borderRadius}px; overflow: hidden; width: 100%; max-width: ${config.width}px;" 
  scrolling="no" 
  title="${config.headerTitle || 'Calendario Badge'}"
></iframe>`;

  // 2. STATIC HTML/CSS CODE (inline Tailwind styles recreated for standalone)
  // Let's create an elegant, fully inline static HTML version for fast load!
  const shadowValue = config.showShadow 
    ? config.theme === 'brutalist' 
      ? `box-shadow: 6px 6px 0px 0px ${config.shadowColor || '#000000'};` 
      : config.theme === 'artistic'
        ? `box-shadow: 8px 8px 0px 0px ${config.shadowColor || '#E879F9'};`
        : `box-shadow: 0 10px 25px -5px ${config.shadowColor || 'rgba(0,0,0,0.1)'};`
    : '';

  const borderStyle = `${config.borderWidth}px solid ${config.borderColor}`;
  const fontStyles = {
    'font-sans': `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;`,
    'font-mono': `font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;`,
    'font-grotesk': `font-family: "Space Grotesk", sans-serif;`,
    'font-serif': `font-family: Georgia, Cambria, "Times New Roman", Times, serif;`,
    'font-playful': `font-family: "Fredoka", sans-serif;`,
  };

  const selectedFont = fontStyles[config.fontFamily as keyof typeof fontStyles] || fontStyles['font-sans'];

  const htmlCode = `<!-- Badge Calendario ${config.type === 'daily' ? 'Giornaliero' : 'Settimanale'} -->
<div style="
  position: relative;
  width: 100%;
  max-width: ${config.width}px;
  height: ${config.height}px;
  border-radius: ${config.borderRadius}px;
  border: ${borderStyle};
  background-color: ${config.theme === 'glass' ? '#0f172a' : config.backgroundColor};
  color: ${config.textColor};
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${selectedFont}
  ${shadowValue}
">
  ${config.showHeader ? `
  <!-- Header -->
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 8px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      ${config.showStatusDot ? `<span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${config.statusDotColor}; display: inline-block;"></span>` : ''}
      <span style="font-size: 11px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase;">${config.headerTitle}</span>
    </div>
    ${config.statusText ? `<span style="font-size: 10px; padding: 2px 8px; border-radius: 9999px; font-weight: bold; background-color: ${config.accentColor}15; color: ${config.accentColor};">${config.statusText}</span>` : ''}
  </div>` : ''}

  <!-- Event Content -->
  <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
    ${config.type === 'daily' ? `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          min-width: 70px;
          height: 70px;
          background-color: ${config.cardBackgroundColor};
          color: ${config.cardTextColor};
          border: 1px solid #e2e8f0;
          border-radius: ${Math.max(4, config.borderRadius - 4)}px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        ">
          <span style="font-size: 10px; text-transform: uppercase; font-weight: bold; opacity: 0.75; margin-bottom: 4px;">${config.daily.dayName.substring(0, 3)}</span>
          <span style="font-size: 24px; font-weight: 900; line-height: 1;">${config.daily.dayNumber}</span>
        </div>
        <div>
          ${config.daily.tagText ? `<span style="font-size: 10px; background-color: ${config.daily.tagBgColor}; color: ${config.daily.tagTextColor}; padding: 2px 8px; border-radius: 9999px; font-weight: bold; display: inline-block; margin-bottom: 4px;">${config.daily.tagText}</span>` : ''}
          <div style="font-size: 12px; opacity: 0.8; font-weight: 500;">⏰ ${config.daily.time}</div>
        </div>
      </div>
      <div style="
        padding: 16px;
        background-color: ${config.cardBackgroundColor};
        color: ${config.cardTextColor};
        border-radius: ${Math.max(4, config.borderRadius - 4)}px;
        border: 1px solid #e2e8f0;
      ">
        <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: bold;">${config.daily.title}</h3>
        <p style="margin: 0; font-size: 12px; opacity: 0.75; line-height: 1.5;">${config.daily.description}</p>
      </div>
    </div>` : `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${config.weekly.subtitle ? `<div style="font-size: 11px; font-weight: bold; opacity: 0.75; margin-bottom: 4px;">📅 ${config.weekly.subtitle}</div>` : ''}
      ${config.weekly.days.filter(d => d.enabled).map(day => `
      <div style="
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        background-color: ${config.cardBackgroundColor};
        color: ${config.cardTextColor};
        border-radius: ${Math.max(4, config.borderRadius - 4)}px;
        border: 1px solid #e2e8f0;
        font-size: 12px;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 34px; height: 34px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 4px; background-color: ${config.accentColor}15; color: ${config.textColor}; font-weight: bold; line-height: 1.1; font-size: 10px;">
            <span style="font-size: 8px; opacity: 0.8;">${day.dayName}</span>
            <span>${day.dateLabel}</span>
          </div>
          <div>
            <div style="font-weight: bold;">${day.title}</div>
            <div style="font-size: 10px; opacity: 0.75;">⏰ ${day.time}</div>
          </div>
        </div>
        ${day.tagText ? `<span style="font-size: 9px; padding: 2px 6px; border-radius: 9999px; background-color: ${day.tagBgColor}; color: ${day.tagTextColor}; font-weight: bold;">${day.tagText}</span>` : ''}
      </div>`).join('')}
    </div>`}
  </div>

  <!-- Decorative Stickers -->
  ${config.stickers.map(st => `
  <div style="
    position: absolute;
    left: ${st.x}%;
    top: ${st.y}%;
    transform: translate(-50%, -50%) rotate(${st.rotation}deg);
    font-size: ${st.size * 0.8}px;
    line-height: 1;
    z-index: 10;
  ">${st.type === 'emoji' ? st.value : '✦'}</div>`).join('')}

  <div style="margin-top: 16px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 10px; opacity: 0.6; display: flex; justify-content: space-between;">
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
