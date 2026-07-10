/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StickerInstance {
  id: string;
  type: 'emoji' | 'svg';
  value: string; // Emoji character or SVG name
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  size: number; // Size in pixels
  rotation: number; // Degrees -180 to 180
  color?: string; // Custom fill color for SVGs
}

export interface TextInstance {
  id: string;
  text: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  fontSize: number; // Size in pixels
  fontWeight: 'normal' | 'medium' | 'bold' | 'black';
  color: string;
  rotation: number; // Degrees -180 to 180
  fontFamily: string;
}

export interface DaySchedule {
  id: string;
  enabled: boolean;
  dayName: string; // e.g., "LUN"
  dateLabel: string; // e.g., "12"
  title: string; // e.g., "Design Sync"
  time: string; // e.g., "10:00"
  tagText: string; // e.g., "Live"
  tagBgColor: string;
  tagTextColor: string;
}

export interface BadgeConfig {
  type: 'daily' | 'weekly';
  theme: 'minimal' | 'glass' | 'brutalist' | 'retro' | 'sunset' | 'forest' | 'artistic' | 'custom';
  
  // Dimensions and layout
  width: number; // in pixels
  height: number; // in pixels
  borderRadius: number; // in pixels
  borderWidth: number; // in pixels
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  cardBackgroundColor: string;
  cardTextColor: string;
  fontFamily: string;
  showShadow: boolean;
  shadowColor: string;

  // Header options
  showHeader: boolean;
  headerTitle: string; // e.g., "PROSSIMO EVENTO"
  showStatusDot: boolean;
  statusDotColor: string;
  statusText: string;

  // Daily Mode specific
  daily: {
    dayName: string; // e.g., "Venerdì"
    dayNumber: string; // e.g., "10"
    monthName: string; // e.g., "Luglio"
    year: string; // e.g., "2026"
    time: string; // e.g., "14:30 - 16:00"
    title: string;
    description: string;
    tagText: string;
    tagBgColor: string;
    tagTextColor: string;
  };

  // Weekly Mode specific
  weekly: {
    subtitle: string; // e.g., "Settimana 10-16 Luglio"
    days: DaySchedule[]; // Usually 5 or 7 elements
  };

  // Stickers & custom texts placed on top
  stickers: StickerInstance[];
  texts: TextInstance[];
}
