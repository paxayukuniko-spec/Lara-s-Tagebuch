import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Database,
  Trash2,
  Plus,
  Check,
  Download,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { db } from '../services/db';
import { DiaryEntry, MediaItem } from '../types/database';
import { sounds } from '../utils/soundEffects';
import { resolveImageUrl, ALL_IMAGE_PRESETS } from '../utils/imageAssets';

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEntryId: string;
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
  isOpen,
  onClose,
  activeEntryId,
}) => {
  const [activeTab, setActiveTab] = useState<'images' | 'database'>('images');
  const [selectedEntryId, setSelectedEntryId] = useState<string>(activeEntryId);
  const [entries, setEntries] = useState<DiaryEntry[]>(db.getEntries());
  const [jsonText, setJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Form State für neues Bild
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaTags, setMediaTags] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentEntry = entries.find((e) => e.id === selectedEntryId) || entries[0];

  const refreshData = () => {
    setEntries([...db.getEntries()]);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1000;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve((event.target?.result as string) || '');
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          // 0.82 JPEG komprimiert ein Bild auf schlanke ~80-120KB
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => resolve((event.target?.result as string) || '');
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedUrl = await compressImage(file);
      if (optimizedUrl) {
        setMediaUrl(optimizedUrl);
        if (!mediaTitle) {
          setMediaTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    } catch (_) {
      // Fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditMedia = (media: MediaItem) => {
    setEditingMedia(media);
    setMediaTitle(media.title.replace(/^\[Platzhalter\]\s*/, ''));
    setMediaCaption(media.caption);
    setMediaUrl(media.url);
    setMediaTags(media.tags.join(', '));
  };

  const saveMediaItem = () => {
    if (!editingMedia || !currentEntry) return;

    const updated: MediaItem = {
      ...editingMedia,
      title: mediaTitle || 'Neues Bild',
      caption: mediaCaption,
      url: mediaUrl,
      isPlaceholder: !mediaUrl.trim(),
      tags: mediaTags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    db.updateMediaItem(currentEntry.id, updated);
    refreshData();
    setEditingMedia(null);
    sounds.playClick();
  };

  const addNewPlaceholderSlot = () => {
    if (!currentEntry) return;

    const newSlot: MediaItem = {
      id: `media-${Date.now()}`,
      entryId: currentEntry.id,
      type: 'image',
      title: '[Platzhalter] Neues Foto / Skizze',
      caption: 'Klicken zum Zuweisen eines Bildes oder Eintragen einer Datei.',
      url: '',
      isPlaceholder: true,
      dateAdded: new Date().toISOString().split('T')[0],
      tags: ['Platzhalter', currentEntry.levelTitle],
    };

    db.addMediaItem(currentEntry.id, newSlot);
    refreshData();
    openEditMedia(newSlot);
    sounds.playClick();
  };

  const handleDeleteMedia = (mediaId: string) => {
    if (!currentEntry) return;
    db.removeMediaItem(currentEntry.id, mediaId);
    refreshData();
    sounds.playClick();
  };

  const handleExportJSON = () => {
    const data = db.exportDatabaseJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laras_tagebuch_db_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playClick();
  };

  const handleImportJSON = () => {
    if (!jsonText.trim()) return;
    const ok = db.importDatabaseJSON(jsonText);
    if (ok) {
      setImportStatus('Erfolgreich importiert!');
      refreshData();
    } else {
      setImportStatus('Fehler beim Import. Bitte JSON-Format prüfen.');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Wirklich auf die Standardeinträge von Tomb Raider 1996 zurücksetzen?')) {
      db.resetToDefaults();
      refreshData();
      sounds.playClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#1a110c] border-2 border-[#8b5a2b] rounded-2xl shadow-2xl overflow-hidden text-[#e6dac6]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#241710] to-[#362114] border-b border-[#8b5a2b]/60">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-[#ffd992]" />
            <div>
              <h2 className="text-xl font-cinzel font-bold text-[#ffd992] tracking-wider">
                Medien- & Datenbank-Verwaltung
              </h2>
              <p className="text-xs text-[#b89e83] font-serif">
                Verknüpfte Bilder in <code className="text-[#ffd992] bg-[#120a06] px-1 py-0.5 rounded">src/assets/images/</code> & JSON-Speicher
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#c9b497] hover:text-white hover:bg-[#4a2e1d] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#5c3a1c] bg-[#150d08] px-6">
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-cinzel font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'images'
                ? 'border-[#ffd992] text-[#ffd992] bg-[#241710]/50'
                : 'border-transparent text-[#9f856c] hover:text-[#e6dac6]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Bilder & Platzhalter</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-cinzel font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'border-[#ffd992] text-[#ffd992] bg-[#241710]/50'
                : 'border-transparent text-[#9f856c] hover:text-[#e6dac6]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Datenbank JSON & Backup</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BILDER & PLATZHALTER */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Tagebucheintrag-Auswahl */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#241710] p-3 rounded-xl border border-[#5c3a1c]">
                <label className="text-xs font-cinzel text-[#ffd992] font-semibold">
                  Tagebucheintrag auswählen:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedEntryId}
                    onChange={(e) => setSelectedEntryId(e.target.value)}
                    className="bg-[#150d08] text-[#e6dac6] border border-[#8b5a2b] rounded-lg px-3 py-1.5 text-xs font-serif focus:outline-none focus:border-[#ffd992]"
                  >
                    {entries.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        Nr. {entry.entryNumber}: {entry.levelTitle} ({entry.media.length} Medien)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addNewPlaceholderSlot}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b5a2b] hover:bg-[#a66b33] text-white text-xs font-cinzel rounded-lg shadow transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Neuen Platzhalter hinzufügen</span>
                  </button>
                </div>
              </div>

              {/* Mediengalerie für aktuellen Eintrag */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEntry?.media.map((item) => (
                  <div
                    key={item.id}
                    className={`relative p-3 rounded-xl border transition-all ${
                      item.isPlaceholder
                        ? 'border-dashed border-[#e4c478]/50 bg-[#21160f]/60'
                        : 'border-[#8b5a2b]/70 bg-[#241710]'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Bild oder Platzhalter-Icon */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#150d08] border border-[#5c3a1c] shrink-0 flex items-center justify-center relative">
                        {item.url ? (
                          <img
                            src={resolveImageUrl(item.url)}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const fallback = resolveImageUrl(item.url.split('/').pop());
                              if (e.currentTarget.src !== fallback) {
                                e.currentTarget.src = fallback;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-center text-[#c9b497]">
                            <ImageIcon className="w-6 h-6 text-[#ffd992]/60 mb-1" />
                            <span className="text-[10px] font-cinzel leading-tight">
                              Platzhalter leer
                            </span>
                          </div>
                        )}
                        {item.isPlaceholder && (
                          <span className="absolute top-1 right-1 px-1 text-[9px] font-bold bg-[#8b5a2b] text-[#ffd992] rounded">
                            Frei
                          </span>
                        )}
                      </div>

                      {/* Info & Aktionen */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h4 className="text-sm font-cinzel font-bold text-[#ffd992] truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#bfa78f] font-serif line-clamp-2 mt-1">
                            {item.caption || 'Keine Beschreibung hinterlegt.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#3d2719]">
                          <button
                            onClick={() => openEditMedia(item)}
                            className="px-2.5 py-1 text-[11px] font-cinzel bg-[#3d2719] hover:bg-[#5c3a1c] text-[#ffd992] rounded border border-[#8b5a2b] transition cursor-pointer"
                          >
                            {item.isPlaceholder ? 'Bild einfügen' : 'Bearbeiten'}
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(item.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition cursor-pointer ml-auto"
                            title="Löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bearbeitungs-Formular wenn ausgewählt */}
              {editingMedia && (
                <div className="p-4 bg-[#241710] border-2 border-[#ffd992]/60 rounded-xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#5c3a1c] pb-2">
                    <h3 className="text-sm font-cinzel font-bold text-[#ffd992] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ffd992]" />
                      Bildplatzhalter bearbeiten / Bild hochladen
                    </h3>
                    <button
                      onClick={() => setEditingMedia(null)}
                      className="text-xs text-[#9f856c] hover:text-white"
                    >
                      Abbrechen
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
                        Titel / Bildname:
                      </label>
                      <input
                        type="text"
                        value={mediaTitle}
                        onChange={(e) => setMediaTitle(e.target.value)}
                        placeholder="z.B. Höhlentor Skizze oder Foto"
                        className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
                        Tags (kommagetrennt):
                      </label>
                      <input
                        type="text"
                        value={mediaTags}
                        onChange={(e) => setMediaTags(e.target.value)}
                        placeholder="Peru, Skizze, Artefakt"
                        className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
                        Bildunterschrift / Archäologische Notiz:
                      </label>
                      <textarea
                        value={mediaCaption}
                        onChange={(e) => setMediaCaption(e.target.value)}
                        rows={2}
                        placeholder="Genaue Beschreibung oder Entdeckungsnotiz eingeben..."
                        className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-cinzel text-[#ffd992]">
                        Bildquelle wählen:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8b5a2b] hover:bg-[#a66b33] text-white rounded text-xs font-cinzel font-semibold cursor-pointer shadow"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Vom Computer / Handy hochladen</span>
                        </button>

                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            placeholder="Oder Bildpfad z.B. /src/assets/images/mein_bild.jpg"
                            className="flex-1 bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
                          />
                        </div>
                      </div>

                      {/* Schnell-Auswahl aller verfügbaren Tomb Raider Bilder aus src/assets/images */}
                      <div className="mt-3 p-3 bg-[#170e09] border border-[#5c3a1c] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="block text-[11px] font-cinzel font-bold text-[#ffd992]">
                            Verfügbare Fundstücke aus src/assets/images ({ALL_IMAGE_PRESETS.length} Bilder):
                          </span>
                          <span className="text-[10px] text-[#a88a6d] font-serif">
                            Klicken zum Auswählen
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                          {ALL_IMAGE_PRESETS.map((preset) => {
                            const fullPath = `/src/assets/images/${preset.file}`;
                            const isSelected = mediaUrl === fullPath || mediaUrl.endsWith(preset.file);
                            return (
                              <button
                                key={preset.file}
                                type="button"
                                onClick={() => {
                                  setMediaUrl(fullPath);
                                  if (!mediaTitle || mediaTitle === 'Neues Bild' || mediaTitle.includes('Platzhalter')) {
                                    setMediaTitle(preset.defaultTitle);
                                  }
                                  sounds.playClick();
                                }}
                                className={`flex items-center gap-2 p-1.5 rounded border text-left text-[11px] font-serif transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#3d2719] border-[#ffd992] text-[#ffd992] shadow-sm'
                                    : 'bg-[#241710] border-[#5c3a1c] hover:border-[#8b5a2b] text-[#d6c4ae]'
                                }`}
                              >
                                <img
                                  src={preset.resolvedUrl}
                                  alt={preset.name}
                                  className="w-7 h-7 object-cover rounded border border-[#8b5a2b]/40 shrink-0"
                                />
                                <span className="truncate">{preset.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#3d2719]">
                    <button
                      onClick={() => setEditingMedia(null)}
                      className="px-4 py-1.5 bg-[#3d2719] hover:bg-[#523522] text-[#c9b497] rounded text-xs font-cinzel cursor-pointer"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={saveMediaItem}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#8b5a2b] to-[#c68344] text-white font-cinzel font-bold text-xs rounded shadow cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Speichern</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DATENBANK JSON & BACKUP */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#241710] border border-[#5c3a1c] rounded-xl text-center">
                  <div className="text-2xl font-cinzel font-bold text-[#ffd992]">
                    {entries.length}
                  </div>
                  <div className="text-xs text-[#b89e83] font-serif">Tagebucheinträge</div>
                </div>
                <div className="p-4 bg-[#241710] border border-[#5c3a1c] rounded-xl text-center">
                  <div className="text-2xl font-cinzel font-bold text-[#ffd992]">
                    {entries.reduce((acc, e) => acc + e.media.length, 0)}
                  </div>
                  <div className="text-xs text-[#b89e83] font-serif">Verknüpfte Medien / Slots</div>
                </div>
              </div>

              {/* Export & Import Aktionen */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 px-4 py-2 bg-[#8b5a2b] hover:bg-[#a66b33] text-white rounded-lg text-xs font-cinzel font-semibold cursor-pointer shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Datenbank als JSON exportieren</span>
                </button>

                <button
                  onClick={handleResetDefaults}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4a1f18] hover:bg-[#682c22] text-[#fca5a5] rounded-lg text-xs font-cinzel font-semibold cursor-pointer ml-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Auf Tomb Raider 1996 zurücksetzen</span>
                </button>
              </div>

              {/* JSON Import Bereich */}
              <div className="p-4 bg-[#241710] border border-[#5c3a1c] rounded-xl space-y-3">
                <h4 className="text-xs font-cinzel font-bold text-[#ffd992]">
                  JSON Backup importieren:
                </h4>
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  rows={4}
                  placeholder="Füge hier ein exportiertes JSON-Backup ein..."
                  className="w-full bg-[#150d08] border border-[#8b5a2b] rounded p-2 text-xs font-mono text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
                />
                <button
                  onClick={handleImportJSON}
                  disabled={!jsonText.trim()}
                  className="px-4 py-1.5 bg-[#5c3a1c] hover:bg-[#7a4e25] text-white rounded text-xs font-cinzel disabled:opacity-50 cursor-pointer"
                >
                  Import anwenden
                </button>
                {importStatus && (
                  <span className="text-xs text-[#ffd992] ml-3 italic">{importStatus}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
