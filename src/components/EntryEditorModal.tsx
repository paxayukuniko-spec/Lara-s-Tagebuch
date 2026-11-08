import React, { useState } from 'react';
import { X, Check, BookPlus, Sparkles } from 'lucide-react';
import { DiaryEntry } from '../types/database';
import { db } from '../services/db';
import { sounds } from '../utils/soundEffects';

interface EntryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit?: DiaryEntry | null;
  onSaved: (entryId: string) => void;
}

export const EntryEditorModal: React.FC<EntryEditorModalProps> = ({
  isOpen,
  onClose,
  entryToEdit,
  onSaved,
}) => {
  const isEditing = !!entryToEdit;

  const [chapter, setChapter] = useState(entryToEdit?.chapter || 'Peru – Die Anden');
  const [levelTitle, setLevelTitle] = useState(entryToEdit?.levelTitle || '');
  const [date, setDate] = useState(entryToEdit?.date || 'Oktober 1996');
  const [location, setLocation] = useState(entryToEdit?.location || 'Vilcabamba, Peru');
  const [coordinates, setCoordinates] = useState(entryToEdit?.coordinates || '13°10\'00"S 72°30\'00"W');
  const [relic, setRelic] = useState(entryToEdit?.relic || '');
  const [secrets, setSecrets] = useState(entryToEdit?.secrets || '3 / 3 Geheimnisse');
  const [summary, setSummary] = useState(entryToEdit?.summary || '');
  const [content, setContent] = useState(entryToEdit?.content || '');
  const [notesStr, setNotesStr] = useState(entryToEdit?.handwrittenNotes.join('\n') || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!levelTitle.trim() || !content.trim()) return;

    const notes = notesStr
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean);

    if (isEditing && entryToEdit) {
      const updated: DiaryEntry = {
        ...entryToEdit,
        chapter,
        levelTitle,
        date,
        location,
        coordinates,
        relic,
        secrets,
        summary,
        content,
        handwrittenNotes: notes,
      };
      db.updateEntry(updated);
      sounds.playClick();
      onSaved(updated.id);
      onClose();
    } else {
      const existing = db.getEntries();
      const newEntry: DiaryEntry = {
        id: `entry-${Date.now()}`,
        entryNumber: existing.length + 1,
        chapter,
        levelTitle,
        date,
        location,
        coordinates,
        relic,
        secrets,
        summary,
        content,
        handwrittenNotes: notes,
        media: [
          {
            id: `media-new-${Date.now()}-1`,
            entryId: `entry-${Date.now()}`,
            type: 'image',
            title: '[Platzhalter] Neues Expeditionsfoto',
            caption: 'Klicken zum Zuweisen eines Bildes.',
            url: '',
            isPlaceholder: true,
            dateAdded: new Date().toISOString().split('T')[0],
            tags: ['Neu', levelTitle],
          },
        ],
        voiceName: 'Kore',
        estimatedReadTime: `${Math.max(1, Math.round(content.split(/\s+/).length / 150))} Min.`,
        mood: 'mystisch',
      };
      db.addEntry(newEntry);
      sounds.playClick();
      onSaved(newEntry.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#1a110c] border-2 border-[#8b5a2b] rounded-2xl shadow-2xl overflow-hidden text-[#e6dac6]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#241710] to-[#362114] border-b border-[#8b5a2b]/60">
          <div className="flex items-center gap-3">
            <BookPlus className="w-6 h-6 text-[#ffd992]" />
            <h2 className="text-xl font-cinzel font-bold text-[#ffd992] tracking-wider">
              {isEditing ? 'Tagebucheintrag bearbeiten' : 'Neuen Tagebucheintrag verfassen'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#c9b497] hover:text-white hover:bg-[#4a2e1d] rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
                Kapitel / Region:
              </label>
              <input
                type="text"
                required
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="z.B. Peru – Das Verlorene Reich"
                className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
                Level / Titel des Eintrags:
              </label>
              <input
                type="text"
                required
                value={levelTitle}
                onChange={(e) => setLevelTitle(e.target.value)}
                placeholder="z.B. Die Zisterne / St. Francis Folly"
                className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
                Datum:
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="z.B. 28. Oktober 1996"
                className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
                Ort / Expeditionsschauplatz:
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="z.B. Vilcabamba-Höhlen, Peru"
                className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
                Geographische Koordinaten:
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="z.B. 13°09'47S 72°32'44W"
                className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
                Relikt / Artefakt:
              </label>
              <input
                type="text"
                value={relic}
                onChange={(e) => setRelic(e.target.value)}
                placeholder="z.B. Erstes Fragment des Scion"
                className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
              Kurze Zusammenfassung:
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ein kurzer Überblick für den Buchdeckel / Index..."
              className="w-full bg-[#150d08] border border-[#8b5a2b] rounded px-3 py-1.5 text-xs text-[#e6dac6] focus:outline-none focus:border-[#ffd992]"
            />
          </div>

          <div>
            <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
              Lara's Tagebuchtext (Pergamenttext):
            </label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Schreibe deinen Tagebucheintrag aus Laras Ich-Perspektive..."
              className="w-full bg-[#150d08] border border-[#8b5a2b] rounded p-3 text-sm font-serif leading-relaxed text-[#f4ecd8] focus:outline-none focus:border-[#ffd992]"
            />
          </div>

          <div>
            <label className="block text-xs font-cinzel text-[#ffd992] mb-1">
              Handschriftliche Randnotizen (eine pro Zeile):
            </label>
            <textarea
              rows={3}
              value={notesStr}
              onChange={(e) => setNotesStr(e.target.value)}
              placeholder="Fallenmechanismus an Decke beachten.&#10;Munitionsvorrat knapp."
              className="w-full bg-[#150d08] border border-[#8b5a2b] rounded p-2 text-xs font-handwriting text-[#ffd992] focus:outline-none focus:border-[#ffd992]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#3d2719]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#3d2719] hover:bg-[#523522] text-[#c9b497] rounded-lg text-xs font-cinzel cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#8b5a2b] to-[#c68344] text-white font-cinzel font-bold text-xs rounded-lg shadow-lg hover:brightness-110 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Änderungen speichern' : 'Eintrag hinzufügen'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
