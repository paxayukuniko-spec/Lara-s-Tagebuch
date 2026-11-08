/**
 * Datenbank- und Typenstruktur für Lara's Tagebuch
 * Verwaltet verknüpfte Mediendateien und Tagebucheinträge
 */

export type MediaType = 'image' | 'sketch' | 'artifact_scan';

export interface MediaItem {
  id: string;
  entryId: string;
  type: MediaType;
  title: string;
  caption: string;
  url: string; // Pfad oder Base64 (z.B. /src/assets/images/...)
  isPlaceholder: boolean; // Markiert leere Slots für spätere Benutzerbilder
  dateAdded: string;
  tags: string[];
  dimensions?: { width: number; height: number };
  fileSize?: string;
  notes?: string;
}

export interface StereoTrack {
  id: string;
  title: string;
  originalName: string;
  url: string;
  description: string;
}

export interface DiaryEntry {
  id: string;
  entryNumber: number;
  chapter: string; // z.B. "Kapitel 1: Peru"
  levelTitle: string; // z.B. "Die Höhlen (Caves)"
  date: string; // z.B. "24. Oktober 1996"
  location: string; // z.B. "Vilcabamba-Massiv, Peru"
  coordinates: string;
  relic: string; // z.B. "Scion-Fragment von Qualopec"
  secrets: string; // z.B. "3 / 3 Geheimnisse"
  summary: string;
  content: string; // Ausführlicher Tagebucheintrag im Lara-Stil
  handwrittenNotes: string[]; // Randnotizen auf dem Pergament
  media: MediaItem[]; // Verknüpfte Mediendateien / Platzhalter
  voiceName: 'Kore'; // Standardstimme für die Sprachausgabe
  estimatedReadTime: string;
  mood: 'mystisch' | 'gefährlich' | 'nachdenklich' | 'triumphierend' | 'heroisch';
}

export interface DiaryDatabaseState {
  version: string;
  lastUpdated: string;
  entries: DiaryEntry[];
  activeEntryId: string;
  settings: {
    voice: string;
    paperTexture: 'aged' | 'vellum' | 'dark_leather';
    showHandwriting: boolean;
  };
}
