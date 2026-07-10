/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BadgeConfig, DaySchedule } from './types';

// Svg paths for stickers. These can be filled with customizable colors.
export const STICKER_SVGS: Record<string, { viewBox: string; path: string }> = {
  sparkle: {
    viewBox: "0 0 24 24",
    path: "M12 2l2.4 5.6L20 10l-5.6 2.4L12 22l-2.4-5.6L4 14l5.6-2.4L12 2Z"
  },
  heart: {
    viewBox: "0 0 24 24",
    path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
  },
  fire: {
    viewBox: "0 0 24 24",
    path: "M17.55 11.2C16 9.7 15.75 7.5 15.75 6c0-1.88-.47-2.78-.47-2.78s-.6 1.45-1.78 3.14c-1.35 1.95-3.35 4.35-3.35 7.64 0 3.52 2.45 6 5.85 6 3.4 0 5.85-2.5 5.85-6 0-3.3-2.1-5.15-4.3-6.8zM11.66 16c.1.1.15.2.15.35 0 .75-.75 1.5-1.5 1.5-.75 0-1.5-.75-1.5-1.5 0-1.15.6-1.95 1.5-2.7.25-.2.5-.1.5.25.1.4.3.75.85 1.1z"
  },
  trophy: {
    viewBox: "0 0 24 24",
    path: "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.44 1.72 4.44 4 4.9V19H4v2h16v-2h-3v-4.1c2.28-.46 4-2.46 4-4.9V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3z"
  },
  coffee: {
    viewBox: "0 0 24 24",
    path: "M2 21h18v-2H2v2zM20 8h-2V5h2v3zm-4-5H4c-1.11 0-2 .89-2 2v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-1h2c1.1 0 2-.9 2-2V8c0-2.76-2.24-5-5-5zM4 16V5h12v11H4z"
  },
  alarm: {
    viewBox: "0 0 24 24",
    path: "M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"
  },
  rocket: {
    viewBox: "0 0 24 24",
    path: "M12 2C6.48 2 2 6.48 2 12c0 1.95.56 3.77 1.52 5.31L2 22l4.69-1.52C8.23 21.44 10.05 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"
  },
  pin: {
    viewBox: "0 0 24 24",
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
  },
  star: {
    viewBox: "0 0 24 24",
    path: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
  },
  bell: {
    viewBox: "0 0 24 24",
    path: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
  },
  gift: {
    viewBox: "0 0 24 24",
    path: "M20 6h-4.18c.26-.36.43-.81.43-1.3a2.7 2.7 0 00-5.4 0c0 .12.01.24.04.36L12 5.2l-1.1-.84c.03-.12.04-.24.04-.36a2.7 2.7 0 00-5.4 0c0 .49.17.94.43 1.3H2v3h2v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9h2V6zM9.3 4.7c0-.39.31-.7.7-.7s.7.31.7.7c0 .16-.06.31-.15.42L9.3 4.7zm5.4 0c0-.39.31-.7.7-.7s.7.31.7.7l-1.25.42c-.09-.11-.15-.26-.15-.42zM19 19H5V9h14v10z"
  },
  target: {
    viewBox: "0 0 24 24",
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
  }
};

export const STICKER_EMOJIS = [
  "🚀", "🎉", "🔥", "⭐", "💡", "📅", "⏰", "🍕", 
  "☕", "💬", "🎮", "🎨", "🌈", "🍀", "💖", "📌", 
  "🌟", "🎯", "🍿", "🍔", "🍺", "🎧", "📷", "💡",
  "💼", "🏋️", "🎓", "🛫", "🌍", "🐱", "🐾", "✌️"
];

// Preset themes with nice palettes
export const THEMES = {
  minimal: {
    name: "Minimal Slate",
    backgroundColor: "#F8FAFC",
    textColor: "#0F172A",
    borderColor: "#E2E8F0",
    accentColor: "#3B82F6",
    cardBackgroundColor: "#FFFFFF",
    cardTextColor: "#1E293B",
    borderRadius: 16,
    borderWidth: 1,
    showShadow: true,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: "font-sans"
  },
  glass: {
    name: "Ice Glass",
    backgroundColor: "#0F172A", // Dark parent background so glass pops
    textColor: "#FFFFFF",
    borderColor: "rgba(255, 255, 255, 0.15)",
    accentColor: "#818CF8",
    cardBackgroundColor: "rgba(255, 255, 255, 0.07)",
    cardTextColor: "#F1F5F9",
    borderRadius: 24,
    borderWidth: 1,
    showShadow: true,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    fontFamily: "font-sans"
  },
  brutalist: {
    name: "Neo Brutalist",
    backgroundColor: "#FACC15", // Bold yellow
    textColor: "#000000",
    borderColor: "#000000",
    accentColor: "#FF5E5E",
    cardBackgroundColor: "#FFFFFF",
    cardTextColor: "#000000",
    borderRadius: 0,
    borderWidth: 4,
    showShadow: true,
    shadowColor: "#000000",
    fontFamily: "font-grotesk"
  },
  retro: {
    name: "8-Bit Arcade",
    backgroundColor: "#2E0854", // Deep retro purple
    textColor: "#00FFFF", // Cyan
    borderColor: "#FF00FF", // Neon Pink
    accentColor: "#FF00FF",
    cardBackgroundColor: "#180230",
    cardTextColor: "#F1F5F9",
    borderRadius: 8,
    borderWidth: 3,
    showShadow: true,
    shadowColor: "#FF00FF",
    fontFamily: "font-mono"
  },
  sunset: {
    name: "Warm Sunset",
    backgroundColor: "#FFF7ED", // Off white warm
    textColor: "#431407", // Dark warm brown
    borderColor: "#FED7AA", // Peach border
    accentColor: "#F97316", // Orange accent
    cardBackgroundColor: "#FFFFFF",
    cardTextColor: "#7C2D12",
    borderRadius: 20,
    borderWidth: 1,
    showShadow: true,
    shadowColor: "rgba(249, 115, 22, 0.1)",
    fontFamily: "font-serif"
  },
  forest: {
    name: "Sage Forest",
    backgroundColor: "#ECEFEE", // Pale sage
    textColor: "#1C2D24", // Deep forest green
    borderColor: "#CBD5E1",
    accentColor: "#10B981", // Emerald accent
    cardBackgroundColor: "#FFFFFF",
    cardTextColor: "#1E293B",
    borderRadius: 16,
    borderWidth: 1,
    showShadow: true,
    shadowColor: "rgba(28, 45, 36, 0.05)",
    fontFamily: "font-playful"
  },
  artistic: {
    name: "Artistic Flair",
    backgroundColor: "#FAF6F0", // Elegant soft warm paper canvas
    textColor: "#2E1A47", // Elegant deep purple-indigo
    borderColor: "#2E1A47", // Solid hand-drawn dark border
    accentColor: "#D946EF", // Artistic magenta/fuchsia accent
    cardBackgroundColor: "#FFFFFF",
    cardTextColor: "#2E1A47",
    borderRadius: 20,
    borderWidth: 2,
    showShadow: true,
    shadowColor: "#E879F9", // Bright artistic glow shadow
    fontFamily: "font-serif" // Elegant Playfair Display typography
  }
};

// Preset default state
export const DEFAULT_CONFIG: BadgeConfig = {
  type: 'daily',
  theme: 'artistic',
  width: 320,
  height: 400,
  borderRadius: 20,
  borderWidth: 2,
  borderColor: '#2E1A47',
  backgroundColor: '#FAF6F0',
  textColor: '#2E1A47',
  accentColor: '#D946EF',
  cardBackgroundColor: '#FFFFFF',
  cardTextColor: '#2E1A47',
  fontFamily: 'font-serif',
  showShadow: true,
  shadowColor: '#E879F9',
  
  showHeader: true,
  headerTitle: "PROSSIMO EVENTO",
  showStatusDot: true,
  statusDotColor: "#D946EF",
  statusText: "LIVE",

  daily: {
    dayName: "Venerdì",
    dayNumber: "10",
    monthName: "Luglio",
    year: "2026",
    time: "15:00 - 16:30 CEST",
    title: "Workshop: UI Design",
    description: "Impariamo a progettare badge e micro-widget reattivi con Tailwind.",
    tagText: "Importante",
    tagBgColor: "#FDF2F8",
    tagTextColor: "#D946EF"
  },

  weekly: {
    subtitle: "Orario Settimana 10-16 Lug",
    days: [
      { id: '1', enabled: true, dayName: "LUN", dateLabel: "10", title: "Team Alignment", time: "09:30", tagText: "Staff", tagBgColor: "#FAF6F0", tagTextColor: "#2E1A47" },
      { id: '2', enabled: true, dayName: "MAR", dateLabel: "11", title: "Review Progetto", time: "11:00", tagText: "Review", tagBgColor: "#FDF2F8", tagTextColor: "#D946EF" },
      { id: '3', enabled: true, dayName: "MER", dateLabel: "12", title: "Mentorship Call", time: "15:00", tagText: "Mentoring", tagBgColor: "#FAF6F0", tagTextColor: "#2E1A47" },
      { id: '4', enabled: true, dayName: "GIO", dateLabel: "13", title: "Scrittura Doc", time: "10:00", tagText: "Focus", tagBgColor: "#FAF6F0", tagTextColor: "#2E1A47" },
      { id: '5', enabled: true, dayName: "VEN", dateLabel: "14", title: "Community Live Q&A", time: "16:00", tagText: "Live", tagBgColor: "#FDF2F8", tagTextColor: "#D946EF" },
    ]
  },

  stickers: [
    { id: 's1', type: 'svg', value: 'sparkle', x: 80, y: 15, size: 36, rotation: 15, color: '#D946EF' },
    { id: 's2', type: 'emoji', value: '🚀', x: 12, y: 80, size: 30, rotation: -10 }
  ],
  texts: [
    { id: 't1', text: "Nuovo!", x: 14, y: 18, fontSize: 13, fontWeight: 'bold', color: '#D946EF', rotation: -12, fontFamily: 'font-serif' }
  ]
};

// UTF-8 base64 encoding
export function encodeConfig(config: BadgeConfig): string {
  try {
    const json = JSON.stringify(config);
    const utf8Bytes = new TextEncoder().encode(json);
    let binary = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  } catch (e) {
    console.error("Error encoding badge config:", e);
    return "";
  }
}

// UTF-8 base64 decoding
export function decodeConfig(base64: string): BadgeConfig | null {
  try {
    if (!base64) return null;
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as BadgeConfig;
  } catch (e) {
    console.error("Error decoding badge config:", e);
    return null;
  }
}
