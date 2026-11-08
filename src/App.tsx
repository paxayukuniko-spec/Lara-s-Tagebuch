import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { DiaryBookView } from './components/DiaryBookView';
import { InteractiveWorldMap } from './components/InteractiveWorldMap';
import { CroftManor } from './components/CroftManor';
import { Ruhmeshalle } from './components/Ruhmeshalle';
import { NavigationHeader, NavTab } from './components/NavigationHeader';
import { MediaManagerModal } from './components/MediaManagerModal';
import { EntryEditorModal } from './components/EntryEditorModal';
import { StereoPlayerModal } from './components/StereoPlayerModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { db } from './services/db';
import { DiaryEntry } from './types/database';
import { stereoAudio } from './services/stereoAudioService';
import { useStereoAudio } from './hooks/useStereoAudio';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [entries, setEntries] = useState<DiaryEntry[]>(db.getEntries());
  const [activeEntryId, setActiveEntryId] = useState<string>('tr1996-arnak-ruins');

  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  const [isEntryEditorOpen, setIsEntryEditorOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<DiaryEntry | null>(null);

  const stereo = useStereoAudio();

  useEffect(() => {
    // Spiele sofort die MP3 arnak.mp3 ab, sobald die Seite geöffnet wird
    stereoAudio.playUrl('/music/arnak.mp3');

    const handleFirstInteraction = () => {
      stereoAudio.playUrl('/music/arnak.mp3');
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setEntries([...db.getEntries()]);
      const currentActive = db.getActiveEntry();
      if (currentActive) {
        setActiveEntryId(currentActive.id);
      }
    });
    return () => unsubscribe();
  }, []);

  // Automatische Synchronisation des Mood-Switchers bei Tagebucheintrag-Wechsel (nur wenn im Tagebuch)
  useEffect(() => {
    if (activeTab === 'tagebuch') {
      const activeEntry = entries.find((e) => e.id === activeEntryId);
      if (activeEntry) {
        if (activeEntry.id === 'tr1996-arnak-ruins' || activeEntry.levelTitle.includes('Arnak')) {
          stereoAudio.playUrl('/music/arnak.mp3');
        } else if (activeEntry.id === 'tr1996-00-kalkutta-dads-diary' || activeEntry.levelTitle.includes('Imperial Hotel')) {
          stereoAudio.playUrl('/music/hotel.mp3');
        } else if (activeEntry.id === 'tr1996-04-lost-valley' || activeEntry.levelTitle.includes('Verlorene Tal') || activeEntry.levelTitle.includes('Lost Valley')) {
          stereoAudio.playUrl('/music/das-verlorene-tal.mp3');
        } else if (activeEntry.id === 'tr1996-03-vilcabamba' || activeEntry.levelTitle.includes('Vilcabamba')) {
          stereoAudio.playUrl('/music/vilcabamba.mp3');
        } else if (activeEntry.id === 'tr1996-02-caves' || activeEntry.levelTitle.includes('Höhlen')) {
          stereoAudio.playUrl('/music/die-hoelen.mp3');
        } else if (activeEntry.mood) {
          stereoAudio.syncWithEntryMood(activeEntry.mood);
        }
      }
    } else if (activeTab === 'home') {
      stereoAudio.playUrl('/music/startseite.mp3');
    } else {
      // Wenn das Tagebuch verlassen wird, Musik stoppen
      stereoAudio.pause();
    }
  }, [activeTab, activeEntryId, entries]);

  // Unsichtbarer Hintergrund-Analysator für MP3-Dateien mit Gemini Transkription
  useEffect(() => {
    const runBackgroundAudioSync = async () => {
      try {
        const isAlreadyProcessed = localStorage.getItem('laras_background_audio_transcribed_v1');
        if (isAlreadyProcessed) return;

        const res = await fetch('/api/transcribe-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackName: 'Tomb Raider 1 Master Audio Collection (68 Tracks)' }),
        });
        const data = await res.json().catch(() => null);

        if (data && data.transcribedText) {
          const currentEntries = db.getEntries();
          if (currentEntries.length > 0) {
            const firstEntry = currentEntries[0];
            if (!firstEntry.content.includes('[Gemini Audio-Analyse]')) {
              db.updateEntry({
                ...firstEntry,
                content: `${firstEntry.content}\n\n[Gemini Audio-Analyse & Transkription im Hintergrund: "${data.transcribedText}"]`,
              });
            }
          }
        }
        localStorage.setItem('laras_background_audio_transcribed_v1', 'true');
      } catch (e) {
        console.warn('Background audio transcription notice:', e);
      }
    };

    runBackgroundAudioSync();
  }, []);

  const [manorSessionKey, setManorSessionKey] = useState(0);

  const handleOpenDiary = (entryId?: string) => {
    if (entryId) {
      db.setActiveEntryId(entryId);
      setActiveEntryId(entryId);
    }
    
    setActiveTab('tagebuch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMap = () => {
    setActiveTab('weltkarte');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenManor = () => {
    setActiveTab('croft-manor');
    setManorSessionKey((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRuhmeshalle = () => {
    setActiveTab('ruhmeshalle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEntry = (id: string) => {
    db.setActiveEntryId(id);
    setActiveEntryId(id);
    if (activeTab === 'tagebuch') {
      const entry = entries.find((e) => e.id === id);
      if (entry && entry.mood) {
        stereoAudio.syncWithEntryMood(entry.mood);
      }
    }
  };

  const handleOpenEntryEditor = (entry?: DiaryEntry) => {
    setEntryToEdit(entry || null);
    setIsEntryEditorOpen(true);
  };

  return (
    <ErrorBoundary>
      <style>{`
        .diary-text-style, [class*="diary-content"], [class*="entry-text"], .font-diary-serif {
          color: #000000 !important;
          font-size: 1.2em !important;
          font-family: 'Caveat', 'Marck Script', 'Kalam', cursive !important;
          font-weight: 600 !important;
          transform: translateY(-10px);
          line-height: 1.45;
        }
      `}</style>

      <div className="min-h-screen bg-[#0d0907] text-[#e8d7be] flex flex-col font-serif select-none">
        {/* Haupt-Reiterleiste (Navigation Header) */}
        <NavigationHeader
          activeTab={activeTab}
          onNavigate={(tab) => {
            if (tab === 'tagebuch') {
              handleOpenDiary();
            } else if (tab === 'weltkarte') {
              handleOpenMap();
            } else if (tab === 'croft-manor') {
              handleOpenManor();
            } else if (tab === 'ruhmeshalle') {
              handleOpenRuhmeshalle();
            } else {
              handleBackToHome();
            }
          }}
          onOpenMediaManager={() => setIsMediaManagerOpen(true)}
        />

        {activeTab === 'home' && (
          <HomePage
            onOpenDiary={handleOpenDiary}
            onOpenMap={handleOpenMap}
          />
        )}

        {activeTab === 'croft-manor' && (
          <CroftManor
            key={manorSessionKey}
            onNavigateToRuhmeshalle={handleOpenRuhmeshalle}
            onOpenDiary={handleOpenDiary}
            onOpenMap={handleOpenMap}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'ruhmeshalle' && (
          <Ruhmeshalle
            onBack={handleOpenManor}
            onBackToManor={handleOpenManor}
            onBackToHome={handleBackToHome}
            onOpenDiaryEntry={handleOpenDiary}
            onOpenMap={handleOpenMap}
          />
        )}

        {activeTab === 'weltkarte' && (
          <InteractiveWorldMap
            onOpenDiaryEntry={handleOpenDiary}
            onNavigateToDiary={handleOpenDiary}
          />
        )}

        {activeTab === 'tagebuch' && (
          <DiaryBookView
            entries={entries}
            activeEntryId={activeEntryId}
            onSelectEntry={handleSelectEntry}
            onBackToHome={handleBackToHome}
            onOpenMap={handleOpenMap}
            onOpenMediaManager={() => setIsMediaManagerOpen(true)}
            onOpenEntryEditor={handleOpenEntryEditor}
          />
        )}

        <MediaManagerModal
          isOpen={isMediaManagerOpen}
          onClose={() => setIsMediaManagerOpen(false)}
          activeEntryId={activeEntryId}
        />

        <EntryEditorModal
          isOpen={isEntryEditorOpen}
          onClose={() => setIsEntryEditorOpen(false)}
          entryToEdit={entryToEdit}
          onSaved={(id) => handleSelectEntry(id)}
        />

        <StereoPlayerModal
          isOpen={stereo.isModalOpen}
          onClose={stereo.closeModal}
        />
      </div>
    </ErrorBoundary>
  );
}
