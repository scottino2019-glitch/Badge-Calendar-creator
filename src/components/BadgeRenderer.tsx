/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { BadgeConfig, StickerInstance, TextInstance } from '../types';
import { STICKER_SVGS } from '../data';
import { Sparkles, Calendar, Clock, MapPin, Star, Trash2 } from 'lucide-react';

interface BadgeRendererProps {
  config: BadgeConfig;
  isEmbedMode?: boolean;
  selectedElement?: { id: string; kind: 'sticker' | 'text' } | null;
  onSelectElement?: (element: { id: string; kind: 'sticker' | 'text' } | null) => void;
  onUpdateElementPosition?: (id: string, kind: 'sticker' | 'text', x: number, y: number) => void;
  onDeleteElement?: (id: string, kind: 'sticker' | 'text') => void;
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({
  config,
  isEmbedMode = false,
  selectedElement = null,
  onSelectElement,
  onUpdateElementPosition,
  onDeleteElement,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle pointer down for dragging stickers or texts
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    id: string,
    kind: 'sticker' | 'text'
  ) => {
    if (isEmbedMode) return;
    e.stopPropagation();
    e.preventDefault();

    if (onSelectElement) {
      onSelectElement({ id, kind });
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !onUpdateElementPosition) return;

    setIsDragging(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const xPct = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100));
      const yPct = Math.max(0, Math.min(100, ((moveEvent.clientY - rect.top) / rect.height) * 100));
      onUpdateElementPosition(id, kind, Math.round(xPct), Math.round(yPct));
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Setup font-family class
  const fontClass = config.fontFamily;

  // Custom theme background styling
  const getBadgeStyle = (): React.CSSProperties => {
    const shadowStyle = config.showShadow
      ? config.theme === 'brutalist'
        ? { boxShadow: `6px 6px 0px 0px ${config.shadowColor || '#000000'}` }
        : config.theme === 'artistic'
          ? { boxShadow: `8px 8px 0px 0px ${config.shadowColor || '#E879F9'}` }
          : { boxShadow: `0 10px 25px -5px ${config.shadowColor || 'rgba(0,0,0,0.1)'}` }
      : {};

    // For glass theme we can use a linear gradient or background opacity
    if (config.theme === 'glass') {
      return {
        width: '100%',
        maxWidth: `${config.width}px`,
        height: `${config.height}px`,
        borderRadius: `${config.borderRadius}px`,
        borderWidth: `${config.borderWidth}px`,
        borderColor: config.borderColor,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: config.textColor,
        ...shadowStyle,
      };
    }

    return {
      width: '100%',
      maxWidth: `${config.width}px`,
      height: `${config.height}px`,
      borderRadius: `${config.borderRadius}px`,
      borderWidth: `${config.borderWidth}px`,
      borderColor: config.borderColor,
      backgroundColor: config.backgroundColor,
      color: config.textColor,
      ...shadowStyle,
    };
  };

  // Theme-dependent card styles
  const getCardStyle = (): React.CSSProperties => {
    if (config.theme === 'glass') {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        color: config.cardTextColor,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: '1px',
        borderRadius: `${Math.max(4, config.borderRadius - 4)}px`,
      };
    }
    
    if (config.theme === 'brutalist') {
      return {
        backgroundColor: config.cardBackgroundColor,
        color: config.cardTextColor,
        borderColor: '#000000',
        borderWidth: '2px',
        borderRadius: '0px',
        boxShadow: '3px 3px 0px 0px #000000',
      };
    }

    if (config.theme === 'artistic') {
      return {
        backgroundColor: config.cardBackgroundColor,
        color: config.cardTextColor,
        borderColor: config.borderColor || '#2E1A47',
        borderWidth: '2px',
        borderRadius: '12px',
        boxShadow: `4px 4px 0px 0px ${config.borderColor || '#2E1A47'}`,
      };
    }

    return {
      backgroundColor: config.cardBackgroundColor,
      color: config.cardTextColor,
      borderColor: config.theme === 'minimal' ? '#E2E8F0' : 'transparent',
      borderWidth: config.theme === 'minimal' ? '1px' : '0px',
      borderRadius: `${Math.max(4, config.borderRadius - 4)}px`,
    };
  };

  const activeElementId = selectedElement?.id || null;

  return (
    <div
      id="custom-badge-canvas"
      ref={canvasRef}
      style={getBadgeStyle()}
      onClick={() => !isDragging && onSelectElement && onSelectElement(null)}
      className={`relative overflow-hidden flex flex-col p-5 select-none transition-all ${fontClass} duration-200 cursor-default`}
    >
      {/* Background aesthetics for organic themes */}
      {config.theme === 'sunset' && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-transparent pointer-events-none" />
      )}
      {config.theme === 'artistic' && (
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-violet-500/5 to-transparent pointer-events-none" />
      )}
      {config.theme === 'glass' && (
        <>
          <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />
        </>
      )}

      {/* HEADER SECTION */}
      {config.showHeader && (
        <div className="flex items-center justify-between mb-4 border-b pb-2" style={{ borderColor: config.theme === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2">
            {config.showStatusDot && (
              <span 
                className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0" 
                style={{ backgroundColor: config.statusDotColor }}
              />
            )}
            <span className="text-xs font-bold tracking-wider uppercase opacity-85">
              {config.headerTitle || "CALENDARIO"}
            </span>
          </div>
          {config.statusText && (
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
              style={{ 
                backgroundColor: config.theme === 'glass' ? 'rgba(255,255,255,0.15)' : `${config.accentColor}15`,
                color: config.theme === 'glass' ? '#FFFFFF' : config.accentColor
              }}
            >
              {config.statusText}
            </span>
          )}
        </div>
      )}

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col justify-center">
        {config.type === 'daily' ? (
          /* DAILY EVENT LAYOUT */
          <div className="flex flex-col gap-3">
            {/* BIG DATE DISPLAY */}
            <div className="flex items-center gap-3">
              <div 
                className="flex flex-col items-center justify-center p-2 min-w-[70px] aspect-square shadow-sm text-center"
                style={getCardStyle()}
              >
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-75 leading-none mb-1">
                  {config.daily.dayName.substring(0, 3)}
                </span>
                <span className="text-3xl font-black tracking-tight leading-none">
                  {config.daily.dayNumber}
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider opacity-90 mt-1 leading-none">
                  {config.daily.monthName.substring(0, 4)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                {config.daily.tagText && (
                  <span 
                    className="inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold mb-1"
                    style={{ 
                      backgroundColor: config.daily.tagBgColor, 
                      color: config.daily.tagTextColor 
                    }}
                  >
                    {config.daily.tagText}
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-xs opacity-80 font-medium">
                  <Clock size={12} className="shrink-0" />
                  <span className="truncate">{config.daily.time}</span>
                </div>
              </div>
            </div>

            {/* EVENT TITLE & DESCRIPTION CARD */}
            <div className="p-4 flex-1 flex flex-col gap-1.5" style={getCardStyle()}>
              <h3 className="font-bold text-base leading-snug tracking-tight text-left">
                {config.daily.title || "Nuovo Evento"}
              </h3>
              {config.daily.description && (
                <p className="text-xs opacity-75 line-clamp-3 leading-relaxed text-left">
                  {config.daily.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* WEEKLY SCHEDULE LAYOUT */
          <div className="flex flex-col gap-2 h-full justify-start">
            {config.weekly.subtitle && (
              <div className="text-[11px] font-bold opacity-75 mb-1 flex items-center gap-1.5">
                <Calendar size={12} />
                <span>{config.weekly.subtitle}</span>
              </div>
            )}
            
            <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1 max-h-[260px]">
              {config.weekly.days
                .filter(day => day.enabled)
                .map((day) => (
                  <div 
                    key={day.id}
                    className="p-2.5 flex items-center justify-between gap-2.5 text-xs transition-all border border-transparent"
                    style={getCardStyle()}
                  >
                    {/* Day indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div 
                        className="w-10 h-10 flex flex-col items-center justify-center rounded font-black text-center"
                        style={{ 
                          backgroundColor: `${config.accentColor}15`, 
                          color: config.textColor,
                          borderLeft: `3px solid ${config.accentColor}`
                        }}
                      >
                        <span className="text-[9px] leading-none opacity-80 uppercase">{day.dayName}</span>
                        <span className="text-sm leading-none mt-0.5 font-bold">{day.dateLabel}</span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="font-bold truncate text-sm leading-tight text-left">
                          {day.title || "Nessun evento"}
                        </span>
                        <span className="text-[11px] opacity-75 flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {day.time}
                        </span>
                      </div>
                    </div>

                    {/* Tag badge */}
                    {day.tagText && (
                      <span 
                        className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0"
                        style={{ 
                          backgroundColor: day.tagBgColor || `${config.accentColor}15`, 
                          color: day.tagTextColor || config.accentColor 
                        }}
                      >
                        {day.tagText}
                      </span>
                    )}
                  </div>
                ))}

              {config.weekly.days.filter(d => d.enabled).length === 0 && (
                <div className="text-center py-8 text-xs opacity-50 italic">
                  Nessun giorno abilitato.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACCENT / BRAND / DATE */}
      <div className="mt-4 pt-2 flex items-center justify-between text-[10px] opacity-60 border-t" style={{ borderColor: config.theme === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.06)' }}>
        <span>🗓️ Badge Creato con Successo</span>
        <span>{config.type === 'daily' ? `${config.daily.year}` : 'Badge Settimanale'}</span>
      </div>

      {/* STICKERS LAYER */}
      {config.stickers.map((sticker) => {
        const isActive = activeElementId === sticker.id;
        return (
          <div
            key={sticker.id}
            onPointerDown={(e) => handlePointerDown(e, sticker.id, 'sticker')}
            style={{
              position: 'absolute',
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
              width: `${sticker.size}px`,
              height: `${sticker.size}px`,
              zIndex: isActive ? 50 : 30,
              touchAction: 'none',
            }}
            className={`group cursor-grab active:cursor-grabbing flex items-center justify-center ${
              !isEmbedMode ? 'hover:outline-dashed hover:outline-1 hover:outline-blue-500 hover:outline-offset-2' : ''
            } ${isActive && !isEmbedMode ? 'outline-2 outline-solid outline-blue-600 outline-offset-4 ring-2 ring-blue-500/20' : ''}`}
          >
            {sticker.type === 'emoji' ? (
              <span style={{ fontSize: `${sticker.size * 0.8}px` }} className="select-none leading-none block">
                {sticker.value}
              </span>
            ) : (
              <svg
                viewBox={STICKER_SVGS[sticker.value]?.viewBox || "0 0 24 24"}
                style={{ width: '100%', height: '100%' }}
                fill={sticker.color || config.accentColor}
                className="drop-shadow-sm select-none"
              >
                <path d={STICKER_SVGS[sticker.value]?.path || ""} />
              </svg>
            )}

            {/* Quick action buttons for active stickers in editor */}
            {isActive && !isEmbedMode && (
              <div 
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-lg flex items-center gap-1.5 shrink-0 whitespace-nowrap z-50 pointer-events-auto"
              >
                <span className="opacity-70 font-medium">Muovi</span>
                <div className="w-px h-3 bg-slate-700" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement?.(sticker.id, 'sticker');
                  }}
                  className="text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5 cursor-pointer"
                  title="Elimina sticker"
                >
                  <Trash2 size={10} />
                  <span>Elimina</span>
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* CUSTOM TEXT LABELS LAYER */}
      {config.texts.map((textInst) => {
        const isActive = activeElementId === textInst.id;
        const textFontClass = textInst.fontFamily || config.fontFamily;
        
        return (
          <div
            key={textInst.id}
            onPointerDown={(e) => handlePointerDown(e, textInst.id, 'text')}
            style={{
              position: 'absolute',
              left: `${textInst.x}%`,
              top: `${textInst.y}%`,
              transform: `translate(-50%, -50%) rotate(${textInst.rotation}deg)`,
              fontSize: `${textInst.fontSize}px`,
              color: textInst.color,
              fontFamily: textFontClass,
              fontWeight: textInst.fontWeight === 'bold' ? 'bold' : textInst.fontWeight === 'black' ? 900 : textInst.fontWeight === 'medium' ? 500 : 'normal',
              zIndex: isActive ? 50 : 31,
              touchAction: 'none',
            }}
            className={`group cursor-grab active:cursor-grabbing select-none leading-none whitespace-nowrap px-1 py-0.5 ${
              !isEmbedMode ? 'hover:outline-dashed hover:outline-1 hover:outline-blue-500 hover:outline-offset-2' : ''
            } ${isActive && !isEmbedMode ? 'outline-2 outline-solid outline-blue-600 outline-offset-4 ring-2 ring-blue-500/20' : ''}`}
          >
            {textInst.text}

            {/* Quick action buttons for active text in editor */}
            {isActive && !isEmbedMode && (
              <div 
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-lg flex items-center gap-1.5 shrink-0 whitespace-nowrap z-50 pointer-events-auto"
              >
                <span className="opacity-70 font-medium">Muovi</span>
                <div className="w-px h-3 bg-slate-700" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement?.(textInst.id, 'text');
                  }}
                  className="text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5 cursor-pointer"
                  title="Elimina testo"
                >
                  <Trash2 size={10} />
                  <span>Elimina</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
