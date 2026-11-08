import { DiaryEntry, MediaItem, DiaryDatabaseState } from '../types/database';
import { INITIAL_DIARY_ENTRIES } from '../data/tombRaider1996Data';

function parseGermanDate(dateStr: string): number {
  if (!dateStr) return 0;
  const months: Record<string, number> = {
    januar: 0, jänner: 0,
    februar: 1,
    märz: 2, maerz: 2,
    april: 3,
    mai: 4,
    juni: 5,
    juli: 6,
    august: 7,
    september: 8,
    oktober: 9,
    november: 10,
    dezember: 11
  };
  
  const match = dateStr.match(/(\d{1,2})\.?\s*([A-Za-zäöüß]+)\s*(\d{4})/i);
  if (match) {
    const day = parseInt(match[1], 10);
    const mStr = match[2].toLowerCase();
    let month = 0;
    for (const [mName, mIdx] of Object.entries(months)) {
      if (mStr.startsWith(mName.slice(0, 3))) {
        month = mIdx;
        break;
      }
    }
    const year = parseInt(match[3], 10);
    return new Date(year, month, day).getTime();
  }

  const cleaned = dateStr.toLowerCase().replace(/[^a-z0-9äöüß]/g, ' ').trim();
  const parts = cleaned.split(/\s+/);
  let day = 1;
  let month = 0;
  let year = 1996;

  for (const p of parts) {
    if (!isNaN(Number(p))) {
      const num = Number(p);
      if (num > 31) year = num;
      else if (num > 12) day = num;
      else if (day === 1) day = num;
      else if (year === 1996 && num <= 12) month = num - 1;
    } else {
      for (const [mName, mIdx] of Object.entries(months)) {
        if (p.startsWith(mName.slice(0, 3))) {
          month = mIdx;
          break;
        }
      }
    }
  }

  return new Date(year, month, day).getTime();
}

export function sortEntriesByDateDesc(entries: DiaryEntry[]): DiaryEntry[] {
  return [...entries].sort((a, b) => {
    const timeA = parseGermanDate(a.date);
    const timeB = parseGermanDate(b.date);
    if (timeB !== timeA) {
      return timeB - timeA; // Neuestes Datum zuerst (z.B. 2026, dann 2025, dann 1996)
    }
    return a.entryNumber - b.entryNumber;
  }).map((entry, index) => ({
    ...entry,
    entryNumber: index + 1
  }));
}

const STORAGE_KEY = 'laras_tagebuch_db_v9';
const LEGACY_STORAGE_KEYS = [
  'laras_tagebuch_db_v1',
  'laras_tagebuch_db_v2',
  'laras_tagebuch_db_v3',
  'laras_tagebuch_db_v4',
  'laras_tagebuch_db_v5',
  'laras_tagebuch_db_v6',
  'laras_tagebuch_db_v7',
  'laras_tagebuch_db_v8',
];

function purgeLegacyStorage(): void {
  try {
    for (const key of LEGACY_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
  } catch (_) {
    // ignore
  }
}

export class DiaryDatabaseService {
  private static instance: DiaryDatabaseService;
  private state: DiaryDatabaseState;
  private listeners: Array<() => void> = [];

  private constructor() {
    purgeLegacyStorage();
    this.state = this.loadInitialState();
  }

  public static getInstance(): DiaryDatabaseService {
    if (!DiaryDatabaseService.instance) {
      DiaryDatabaseService.instance = new DiaryDatabaseService();
    }
    return DiaryDatabaseService.instance;
  }

  private loadInitialState(): DiaryDatabaseState {
    try {
      let stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        for (const legacyKey of LEGACY_STORAGE_KEYS) {
          stored = localStorage.getItem(legacyKey);
          if (stored) break;
        }
      }

      // Einmalige Bereinigung aller alten Schlüssel nach dem Einlesen
      purgeLegacyStorage();

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.entries && Array.isArray(parsed.entries) && parsed.entries.length > 0) {
          let updatedAny = false;
          const initialMap = new Map(INITIAL_DIARY_ENTRIES.map((e) => [e.id, e]));

          // Aktualisiere Standardkapitel mit den verifizierten Bildern & Texten
          parsed.entries = parsed.entries.map((entry: DiaryEntry) => {
            const initialEntry = initialMap.get(entry.id);
            if (initialEntry) {
              return {
                ...entry,
                levelTitle: initialEntry.levelTitle,
                chapter: initialEntry.chapter,
                relic: initialEntry.relic,
                secrets: initialEntry.secrets,
                summary: initialEntry.summary,
                content: initialEntry.content,
                handwrittenNotes: initialEntry.handwrittenNotes,
                media: initialEntry.media.map((m) => {
                  const fileName = m.url.split('/').pop() || '';
                  return {
                    ...m,
                    url: `/src/assets/images/${fileName}`,
                  };
                }),
              };
            }

            // Für benutzerdefinierte Einträge: Stelle sicher, dass keine Pfade zu musik/ führen
            const sanitizedMedia = entry.media.map((m) => {
              if (m.url && m.url.includes('/musik/')) {
                updatedAny = true;
                const fileName = m.url.split('/').pop() || '';
                return {
                  ...m,
                  url: `/src/assets/images/${fileName}`,
                };
              }
              return m;
            });

            return {
              ...entry,
              media: sanitizedMedia,
            };
          });

          // Entferne eventuelle Audio-Playlists
          if (parsed.audioPlaylist) {
            delete parsed.audioPlaylist;
            updatedAny = true;
          }

          const existingIds = new Set(parsed.entries.map((e: DiaryEntry) => e.id));
          const missingEntries = INITIAL_DIARY_ENTRIES.filter((e) => !existingIds.has(e.id));
          if (missingEntries.length > 0) {
            parsed.entries = [...parsed.entries, ...missingEntries];
            updatedAny = true;
          }

          parsed.entries = sortEntriesByDateDesc(parsed.entries);

          if (updatedAny || !localStorage.getItem(STORAGE_KEY)) {
            this.safePersist(STORAGE_KEY, parsed);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Hinweis beim Laden aus localStorage:', e);
    }

    const sortedDefault = sortEntriesByDateDesc(INITIAL_DIARY_ENTRIES);
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      entries: sortedDefault,
      activeEntryId: sortedDefault[0]?.id || '',
      settings: {
        voice: 'Kore',
        paperTexture: 'aged',
        showHandwriting: true,
      },
    };
  }

  /**
   * Quota-sicheres Speichern in localStorage mit automatischer Bereinigung
   * und Fallback ohne blockierende Fehlermeldungen.
   */
  private safePersist(key: string, data: DiaryDatabaseState): boolean {
    const serialized = JSON.stringify(data);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch (e: any) {
      // 1. Bereinige alle Altversionen aus localStorage
      purgeLegacyStorage();

      try {
        localStorage.setItem(key, serialized);
        return true;
      } catch (e2) {
        // 2. Erstelle kompakte Version: Kürze übergroße Data-URLs (>200KB) bei Benutzerbildern
        try {
          const compactData: DiaryDatabaseState = {
            ...data,
            entries: data.entries.map((entry) => ({
              ...entry,
              media: entry.media.map((m) => {
                if (m.url && m.url.startsWith('data:') && m.url.length > 200000) {
                  // Ersetze übergroße Data-URL durch sicheres Platzhalter-Asset
                  return {
                    ...m,
                    url: '/src/assets/images/scion.jpg',
                    caption: `${m.caption || ''} (Bildgröße für Speicherplatz optimiert)`,
                  };
                }
                return m;
              }),
            })),
          };
          localStorage.setItem(key, JSON.stringify(compactData));
          return true;
        } catch (e3) {
          // 3. Fallback: sessionStorage oder speicherintern
          try {
            sessionStorage.setItem(key, serialized);
          } catch (_) {}
          console.warn('LocalStorage-Quota erreicht. Änderungen bleiben für diese Sitzung im Speicher erhalten.');
          return false;
        }
      }
    }
  }

  private saveState(): void {
    this.state.lastUpdated = new Date().toISOString();
    this.safePersist(STORAGE_KEY, this.state);
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('Error in db listener:', err);
      }
    }
  }

  public getState(): DiaryDatabaseState {
    return this.state;
  }

  public getEntries(): DiaryEntry[] {
    return this.state.entries;
  }

  public getEntry(id: string): DiaryEntry | undefined {
    return this.state.entries.find((e) => e.id === id);
  }

  public getActiveEntry(): DiaryEntry {
    return (
      this.state.entries.find((e) => e.id === this.state.activeEntryId) ||
      this.state.entries[0]
    );
  }

  public setActiveEntryId(id: string): void {
    this.state.activeEntryId = id;
    this.saveState();
  }

  public updateEntry(updated: DiaryEntry): void {
    this.state.entries = sortEntriesByDateDesc(
      this.state.entries.map((entry) => (entry.id === updated.id ? updated : entry))
    );
    this.saveState();
  }

  public addEntry(newEntry: DiaryEntry): void {
    this.state.entries = sortEntriesByDateDesc([...this.state.entries, newEntry]);
    this.state.activeEntryId = newEntry.id;
    this.saveState();
  }

  public deleteEntry(id: string): void {
    this.state.entries = this.state.entries.filter((e) => e.id !== id);
    if (this.state.activeEntryId === id && this.state.entries.length > 0) {
      this.state.activeEntryId = this.state.entries[0].id;
    }
    this.saveState();
  }

  public updateMediaItem(entryId: string, updatedMedia: MediaItem): void {
    const entry = this.getEntry(entryId);
    if (!entry) return;

    entry.media = entry.media.map((m) => (m.id === updatedMedia.id ? updatedMedia : m));
    this.updateEntry(entry);
  }

  public addMediaItem(entryId: string, mediaItem: MediaItem): void {
    const entry = this.getEntry(entryId);
    if (!entry) return;

    entry.media.push(mediaItem);
    this.updateEntry(entry);
  }

  public removeMediaItem(entryId: string, mediaId: string): void {
    const entry = this.getEntry(entryId);
    if (!entry) return;

    entry.media = entry.media.filter((m) => m.id !== mediaId);
    this.updateEntry(entry);
  }

  public updateSettings(settings: Partial<DiaryDatabaseState['settings']>): void {
    this.state.settings = { ...this.state.settings, ...settings };
    this.saveState();
  }

  public exportDatabaseJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public importDatabaseJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.entries && Array.isArray(parsed.entries)) {
        parsed.entries = sortEntriesByDateDesc(parsed.entries);
        this.state = parsed;
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error('Import fehlerhaft:', e);
    }
    return false;
  }

  public resetToDefaults(): void {
    const sortedDefault = sortEntriesByDateDesc(INITIAL_DIARY_ENTRIES);
    this.state = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      entries: sortedDefault,
      activeEntryId: sortedDefault[0]?.id || '',
      settings: {
        voice: 'Kore',
        paperTexture: 'aged',
        showHandwriting: true,
      },
    };
    this.saveState();
  }
}

export const db = DiaryDatabaseService.getInstance();
