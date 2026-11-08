import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  MapPin,
  Calendar,
  Compass,
  Award,
  Sparkles,
  Plus,
  Edit3,
  Sliders,
  Maximize2,
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
  PenTool,
  RotateCcw,
  FastForward,
} from 'lucide-react';
import { DiaryEntry, MediaItem } from '../types/database';
import { TtsReader } from './TtsReader';
import { sounds } from '../utils/soundEffects';
import { resolveImageUrl, LAYOUT_IMAGES } from '../utils/imageAssets';
import diaryBgHero from '../assets/images/startseite_hero_1790788872670.jpg';
import laraDeskHero from '../assets/images/lara_desk_hero_1790787354278.jpg';

interface DiaryBookViewProps {
  entries: DiaryEntry[];
  activeEntryId: string;
  onSelectEntry: (id: string) => void;
  onBackToHome: () => void;
  onOpenMap?: () => void;
  onOpenMediaManager: () => void;
  onOpenEntryEditor: (entry?: DiaryEntry) => void;
}

export const DiaryBookView: React.FC<DiaryBookViewProps> = ({
  entries,
  activeEntryId,
  onSelectEntry,
  onBackToHome,
  onOpenMap,
  onOpenMediaManager,
  onOpenEntryEditor,
}) => {
  const currentIndex = entries.findIndex((e) => e.id === activeEntryId);
  const activeEntry = entries[currentIndex] || entries[0];

  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
  const [selectedMediaForPreview, setSelectedMediaForPreview] = useState<MediaItem | null>(null);

  const handleExitDiary = () => {
    onBackToHome();
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      sounds.playPageTurn();
      onSelectEntry(entries[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < entries.length - 1) {
      sounds.playPageTurn();
      onSelectEntry(entries[currentIndex + 1].id);
    }
  };

  // Tastatur-Navigation (Pfeiltasten Links / Rechts zum Vor- und Zurückblättern)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          sounds.playPageTurn();
          onSelectEntry(entries[currentIndex - 1].id);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < entries.length - 1) {
          sounds.playPageTurn();
          onSelectEntry(entries[currentIndex + 1].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, entries, onSelectEntry]);

  // Handschrift-Echtzeit-Schreibanimation
  const [revealedCharCount, setRevealedCharCount] = useState<number>(0);
  const [isWriting, setIsWriting] = useState<boolean>(true);
  const writingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Wenn ein neuer Eintrag geöffnet wird: Text wird in Echtzeit von Hand geschrieben
  useEffect(() => {
    if (writingTimerRef.current) {
      clearTimeout(writingTimerRef.current);
    }

    const fullText = activeEntry?.content || '';
    const totalLength = fullText.length;
    let currentIdx = 0;
    setRevealedCharCount(0);
    setIsWriting(true);

    const step = () => {
      if (currentIdx >= totalLength) {
        setRevealedCharCount(totalLength);
        setIsWriting(false);
        return;
      }

      const nextChar = fullText[currentIdx] || '';
      const isPunctuation = nextChar === '.' || nextChar === '!' || nextChar === '?';
      const isNewline = nextChar === '\n';

      // Schreibe in dynamischen Strichen (2-4 Zeichen)
      const chunkSize = isPunctuation || isNewline ? 1 : Math.floor(Math.random() * 3) + 2;
      currentIdx = Math.min(totalLength, currentIdx + chunkSize);
      setRevealedCharCount(currentIdx);

      // Sanftes Federkratzen auf Pergament
      if (Math.random() < 0.22) {
        sounds.playPenScratch();
      }

      let delay = 18;
      if (isPunctuation) delay = 140;
      else if (isNewline) delay = 180;

      writingTimerRef.current = setTimeout(step, delay);
    };

    // Nach kurzer Umblätter-Pause beginnt das Schreiben
    writingTimerRef.current = setTimeout(step, 120);

    return () => {
      if (writingTimerRef.current) {
        clearTimeout(writingTimerRef.current);
      }
    };
  }, [activeEntry?.id]);

  const handleSkipWriting = () => {
    if (writingTimerRef.current) {
      clearTimeout(writingTimerRef.current);
    }
    setRevealedCharCount(activeEntry?.content?.length || 0);
    setIsWriting(false);
  };

  const handleReplayWriting = () => {
    if (writingTimerRef.current) {
      clearTimeout(writingTimerRef.current);
    }
    const fullText = activeEntry?.content || '';
    const totalLength = fullText.length;
    let currentIdx = 0;
    setRevealedCharCount(0);
    setIsWriting(true);

    const step = () => {
      if (currentIdx >= totalLength) {
        setRevealedCharCount(totalLength);
        setIsWriting(false);
        return;
      }
      const nextChar = fullText[currentIdx] || '';
      const isPunctuation = nextChar === '.' || nextChar === '!' || nextChar === '?';
      const isNewline = nextChar === '\n';
      const chunkSize = isPunctuation || isNewline ? 1 : Math.floor(Math.random() * 3) + 2;
      currentIdx = Math.min(totalLength, currentIdx + chunkSize);
      setRevealedCharCount(currentIdx);

      if (Math.random() < 0.22) {
        sounds.playPenScratch();
      }

      let delay = 18;
      if (isPunctuation) delay = 140;
      else if (isNewline) delay = 180;

      writingTimerRef.current = setTimeout(step, delay);
    };

    sounds.playClick();
    writingTimerRef.current = setTimeout(step, 80);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0d0907] flex flex-col items-center justify-between p-2 sm:p-6 select-none overflow-x-hidden">
      {/* Atmosphärischer Raum-Hintergrund für das Tagebuch */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <img
          src={diaryBgHero || LAYOUT_IMAGES.diaryBackground}
          alt="Lara Croft Tagebuch Hintergrund"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-[#0d0907]/85" />
      </div>

      {/* Top Navigationsleiste */}
      <header className="relative z-20 w-full max-w-6xl mx-auto flex items-center justify-between py-2 sm:py-4 px-2">
        <button
          onClick={() => {
            sounds.playClick();
            handleExitDiary();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#241710]/90 border border-[#8b5a2b] text-[#ffd992] hover:bg-[#3d2719] text-xs font-cinzel transition cursor-pointer shadow-md backdrop-blur-sm"
          title="Tagebuch schließen und Musik beenden"
        >
          <ArrowLeft className="w-4 h-4 text-[#ffd992]" />
          <span>Tagebuch schließen</span>
        </button>

        {/* Lesezeichen / Kapitel-Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              sounds.playClick();
              setIsBookmarkOpen(!isBookmarkOpen);
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#3a2215] border border-[#ffd992]/60 text-[#ffd992] hover:bg-[#4d2f1e] text-xs font-cinzel font-bold transition cursor-pointer shadow-lg"
          >
            <Bookmark className="w-4 h-4 text-[#ffd992]" />
            <span>Kapitel-Verzeichnis ({activeEntry.entryNumber} / {entries.length})</span>
          </button>

          {isBookmarkOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#1e130c] border-2 border-[#8b5a2b] rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="text-[11px] font-cinzel text-[#ffd992] font-bold px-3 py-1.5 border-b border-[#5c3a1c]">
                Tomb Raider 1996 • Tagebuch-Index
              </div>
              <div className="max-h-72 overflow-y-auto py-1 divide-y divide-[#3d2719]">
                {entries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      sounds.playPageTurn();
                      onSelectEntry(entry.id);
                      setIsBookmarkOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex flex-col transition cursor-pointer ${
                      entry.id === activeEntry.id
                        ? 'bg-[#3d2719] text-[#ffd992]'
                        : 'hover:bg-[#2e1d14] text-[#d6c4ae]'
                    }`}
                  >
                    <span className="text-[10px] text-[#b3753b] font-cinzel">
                      Eintrag {entry.entryNumber} • {entry.date}
                    </span>
                    <span className="text-xs font-cinzel font-bold truncate">
                      {entry.levelTitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Aktionen: Weltkarte, Medien & Neuer Eintrag */}
        <div className="flex items-center gap-2">
          {onOpenMap && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenMap();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14231a] border border-[#2d6a4f] text-[#a7d9b9] hover:bg-[#1d3326] text-xs font-cinzel transition cursor-pointer shadow-md"
              title="Zur interaktiven Weltkarte (TR 1-3)"
            >
              <Compass className="w-3.5 h-3.5 text-[#52b788]" />
              <span className="hidden sm:inline">Weltkarte</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onOpenEntryEditor(activeEntry);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241710] border border-[#8b5a2b] text-[#ffd992] hover:bg-[#3d2719] text-xs font-cinzel transition cursor-pointer"
            title="Diesen Eintrag bearbeiten"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bearbeiten</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenMediaManager();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3a2215] border border-[#ffd992]/60 text-[#ffd992] hover:bg-[#4d2f1e] text-xs font-cinzel transition cursor-pointer"
            title="Medien & Bilder verwalten"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Medien verwalten</span>
          </button>
        </div>
      </header>

      {/* DAS TAGEBUCH (LEDER-EINBAND & PERGAMENT) */}
      <main className="relative z-10 w-full max-w-6xl my-auto py-2">
        {/* Desktop Seitliche Blätter-Buttons (für schnelles und bequemes Vor- und Zurückblättern) */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="hidden xl:flex absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-24 bg-[#241710]/95 hover:bg-[#3d2719] border-2 border-[#8b5a2b] hover:border-[#ffd992] text-[#ffd992] rounded-l-2xl items-center justify-center cursor-pointer transition-all duration-200 shadow-2xl z-30 group"
            title="Vorherige Seite (Taste: ←)"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        {currentIndex < entries.length - 1 && (
          <button
            onClick={goToNext}
            className="hidden xl:flex absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-24 bg-[#241710]/95 hover:bg-[#3d2719] border-2 border-[#8b5a2b] hover:border-[#ffd992] text-[#ffd992] rounded-r-2xl items-center justify-center cursor-pointer transition-all duration-200 shadow-2xl z-30 group"
            title="Nächste Seite (Taste: →)"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        <div className="relative leather-cover rounded-3xl p-3 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-4 border-[#4a2e1d]">
          {/* Antike Buch-Ecken aus vergoldetem Messing */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#ffd992] rounded-tl-lg pointer-events-none" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#ffd992] rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#ffd992] rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#ffd992] rounded-br-lg pointer-events-none" />

          {/* Mittleres rotes Lesezeichen-Band */}
          <div className="hidden lg:block absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-16 bg-gradient-to-b from-[#8b1e1e] to-[#591010] shadow-md z-30 rounded-b-md border-b-2 border-[#ffcc80]" />

          {/* Buchseiten-Container (2 Seiten auf Desktop, 1 Seite scrollbar auf Mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-0 bg-[#e7d8bd] rounded-2xl overflow-hidden parchment-texture parchment-edge book-spine-shadow min-h-[620px]">
            
            {/* LINKE BUCHSEITE: TEXT & NARRATIVE */}
            <div className="p-4 sm:p-7 pt-4 sm:pt-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#8b5a2b]/30 relative">
              {/* Leichter Schatten für Buchfalz */}
              <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black/15 to-transparent pointer-events-none" />

              <div>
                {/* Kapitel-Kopfzeile - Kompakt & nach oben versetzt */}
                <div className="flex items-center justify-between border-b-2 border-[#8b5a2b]/40 pb-2 mb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-cinzel font-bold tracking-widest text-[#7a481c]">
                      {activeEntry.chapter}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#2d180c] leading-tight">
                      {activeEntry.levelTitle}
                    </h2>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-[11px] font-serif text-[#6b3e15] bg-[#dfcfb0] px-2 py-0.5 rounded-md border border-[#8b5a2b]/30">
                      <Calendar className="w-3 h-3" />
                      <span>{activeEntry.date}</span>
                    </div>
                  </div>
                </div>

                {/* Standort & Geokoordinaten Stempel - Schlank & dezent */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-serif text-[#613b19] mb-2.5 bg-[#ecdcc0]/70 py-1.5 px-2.5 rounded-lg border border-[#8b5a2b]/20">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8b5a2b]" />
                    <span className="font-semibold">{activeEntry.location}</span>
                  </div>
                  <span className="text-[#8b5a2b]/50">•</span>
                  <div className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#8b5a2b]" />
                    <span>{activeEntry.coordinates}</span>
                  </div>
                  {activeEntry.relic && (
                    <>
                      <span className="text-[#8b5a2b]/50">•</span>
                      <div className="flex items-center gap-1 text-[#8b1e1e] font-semibold">
                        <Award className="w-3 h-3" />
                        <span>{activeEntry.relic}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* VORLESEFUNKTION (STIMME: KORE ODER MP3 OVERRIDE) */}
                <div className="mb-2.5">
                  <TtsReader
                    title={`${activeEntry.levelTitle}`}
                    text={activeEntry.content}
                    voiceName={activeEntry.voiceName}
                    audioFileOverride={
                      activeEntry.id === 'tr1996-01-kalkutta' || activeEntry.levelTitle.includes('Imperial Hotel')
                        ? '/music/imperial-hotel.mp3'
                        : activeEntry.id === 'tr1996-02-caves' || activeEntry.levelTitle.includes('Höhlen')
                        ? '/music/die-hoelen.mp3'
                        : undefined
                    }
                  />
                </div>

                {/* TAGEBUCH-TEXT (HISTORISCHE SERIFEN, REINES SCHWARZ, ETWAS KLEINER, WEITER OBEN PLATZIERT) */}
                <div className="relative">
                  {/* Statuszeile & Schreibkontrollen */}
                  <div className="flex items-center justify-between pb-1 mb-2 border-b border-[#8b5a2b]/30 text-xs font-cinzel">
                    <div className="flex items-center gap-1.5">
                      {isWriting ? (
                        <span className="flex items-center gap-1.5 text-[#8b1e1e] font-semibold animate-pulse text-[11px]">
                          <PenTool className="w-3 h-3 -rotate-45" />
                          <span>Lara schreibt gerade...</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[#442911] text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-[#2e6930]" />
                          <span>Expeditions-Eintrag</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isWriting ? (
                        <button
                          onClick={handleSkipWriting}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#dfcfb0] hover:bg-[#d0be9b] text-[#4d2a0d] border border-[#8b5a2b]/40 text-[10px] font-cinzel font-semibold transition cursor-pointer shadow-sm"
                          title="Animation überspringen und Text sofort vollständig anzeigen"
                        >
                          <FastForward className="w-3 h-3 text-[#8b1e1e]" />
                          <span>Sofort anzeigen</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleReplayWriting}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#dfcfb0] hover:bg-[#d0be9b] text-[#4d2a0d] border border-[#8b5a2b]/40 text-[10px] font-cinzel font-semibold transition cursor-pointer shadow-sm"
                          title="Schreib-Animation erneut abspielen"
                        >
                          <RotateCcw className="w-3 h-3 text-[#7a481c]" />
                          <span>Neu schreiben</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Eleganter Tagebuchtext: Historische Serif-Schrift, reines Schwarz, etwas kleiner, weiter oben platziert */}
                  <div
                    onClick={() => {
                      if (isWriting) handleSkipWriting();
                    }}
                    className="font-diary-serif diary-text-black text-[15px] sm:text-[16px] leading-[1.7] sm:leading-[1.75] space-y-3.5 max-h-[460px] lg:max-h-[500px] overflow-y-auto pr-2 select-text cursor-pointer text-black"
                    title={isWriting ? 'Klicken, um den Text sofort vollständig anzuzeigen' : undefined}
                  >
                    {activeEntry.content
                      .slice(0, revealedCharCount)
                      .split('\n\n')
                      .map((paragraph, idx, arr) => {
                        const isLastParagraph = idx === arr.length - 1;
                        if (idx === 0) {
                          if (paragraph.length === 0) return null;
                          const firstChar = paragraph.charAt(0);
                          const rest = paragraph.slice(1);
                          return (
                            <p key={idx} className="relative text-black">
                              <span className="float-left text-3xl sm:text-4xl font-cinzel font-bold text-black pr-2 pt-0.5 leading-none select-none">
                                {firstChar}
                              </span>
                              <span className="text-black">{rest}</span>
                              {isWriting && isLastParagraph && (
                                <span className="inline-flex items-center ml-1 align-baseline text-black select-none">
                                  <span className="inline-block w-1.5 h-4 bg-black rounded-sm animate-blink" />
                                  <PenTool className="w-3.5 h-3.5 ml-0.5 text-black -rotate-45" />
                                </span>
                              )}
                            </p>
                          );
                        }
                        return (
                          <p key={idx} className="relative text-black">
                            <span className="text-black">{paragraph}</span>
                            {isWriting && isLastParagraph && (
                              <span className="inline-flex items-center ml-1 align-baseline text-black select-none">
                                <span className="inline-block w-1.5 h-4 bg-black rounded-sm animate-blink" />
                                <PenTool className="w-3.5 h-3.5 ml-0.5 text-black -rotate-45" />
                              </span>
                            )}
                          </p>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Seitenfuß mit Seitenzahl */}
              <div className="pt-3 border-t border-[#8b5a2b]/30 flex items-center justify-between text-xs font-serif text-[#7a481c] mt-3">
                <span>Geheimnisse: <strong className="text-black">{activeEntry.secrets}</strong></span>
                <span className="font-cinzel font-bold">~ Seite {activeEntry.entryNumber * 2 - 1} ~</span>
              </div>
            </div>

            {/* RECHTE BUCHSEITE: BILDER, PLATZHALTER & NOTIZEN */}
            <div className="p-4 sm:p-7 pt-4 sm:pt-6 flex flex-col justify-between relative bg-[#f1e6cf]/80">
              {/* Leichter Schatten für Buchfalz */}
              <div className="hidden lg:block absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/15 to-transparent pointer-events-none" />

              <div>
                <div className="flex items-center justify-between border-b-2 border-[#8b5a2b]/40 pb-2 mb-3">
                  <h3 className="text-sm font-cinzel font-bold text-[#7a481c] tracking-wider uppercase flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#8b5a2b]" />
                    Expeditionsfunde & Skizzen
                  </h3>
                  <button
                    onClick={onOpenMediaManager}
                    className="text-xs font-cinzel text-[#8b5a2b] hover:text-[#5c3a1c] underline cursor-pointer"
                  >
                    + Bild / Platzhalter hinzufügen
                  </button>
                </div>

                {/* Bilder & Platzhalter Galerie */}
                <div className={activeEntry.media.length > 2 ? "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4" : "space-y-3 mb-4"}>
                  {activeEntry.media.length === 0 ? (
                    <div className="p-6 rounded-xl border-2 border-dashed border-[#8b5a2b]/40 text-center col-span-full">
                      <ImageIcon className="w-8 h-8 text-[#8b5a2b]/50 mx-auto mb-2" />
                      <p className="text-xs text-[#7a481c] font-serif">
                        Noch keine Bilder oder Platzhalter für diesen Eintrag hinterlegt.
                      </p>
                      <button
                        onClick={onOpenMediaManager}
                        className="mt-3 px-3 py-1 bg-[#8b5a2b] text-white text-xs font-cinzel rounded shadow"
                      >
                        Jetzt hinzufügen
                      </button>
                    </div>
                  ) : (
                    activeEntry.media.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                          item.isPlaceholder
                            ? 'border-2 border-dashed border-[#8b5a2b]/60 bg-[#e4d3b4]/60 p-4 text-center'
                            : 'border border-[#8b5a2b]/40 bg-[#dfceb0]/40 shadow-md p-2.5'
                        }`}
                      >
                        {item.isPlaceholder ? (
                          /* Interaktiver Platzhalter */
                          <div className="flex flex-col items-center justify-center py-4">
                            <div className="w-12 h-12 rounded-full bg-[#8b5a2b]/20 flex items-center justify-center mb-2">
                              <ImageIcon className="w-6 h-6 text-[#7a481c]" />
                            </div>
                            <h4 className="text-sm font-cinzel font-bold text-[#2d180c]">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#6e431e] font-serif max-w-xs mt-1 mb-3">
                              {item.caption || 'Hier kannst du später dein Bild, Screenshot oder Foto einfügen.'}
                            </p>
                            <button
                              onClick={onOpenMediaManager}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-[#8b5a2b] to-[#b3753b] hover:from-[#a06832] hover:to-[#c68344] text-white text-xs font-cinzel font-semibold rounded-lg shadow transition cursor-pointer flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Bild hier einfügen</span>
                            </button>
                          </div>
                        ) : (
                          /* Echtes Bild / Skizze mit Lupe */
                          <div className="flex flex-col h-full justify-between">
                            <div
                              onClick={() => setSelectedMediaForPreview(item)}
                              className={`relative group rounded-lg overflow-hidden cursor-pointer bg-[#2b180c] ${
                                activeEntry.media.length > 2 ? 'h-32 sm:h-36' : 'max-h-44 h-40'
                              }`}
                            >
                              <img
                                src={resolveImageUrl(item.url)}
                                alt={item.title}
                                className="w-full h-full object-cover object-center filter sepia-[0.2] group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  // Fallback auf resolveImageUrl falls Pfad abweicht
                                  const fallback = resolveImageUrl(item.url.split('/').pop());
                                  if (e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback;
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-cinzel font-bold">
                                <Maximize2 className="w-4 h-4" />
                                <span>Vergrößern</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-start justify-between gap-1">
                              <div className="min-w-0">
                                <h4 className="text-xs font-cinzel font-bold text-[#2d180c] truncate">
                                  {item.title}
                                </h4>
                                <p className={`text-[11px] text-[#6e431e] font-serif italic mt-0.5 ${
                                  activeEntry.media.length > 2 ? 'line-clamp-2' : ''
                                }`}>
                                  {item.caption}
                                </p>
                              </div>
                              <button
                                onClick={onOpenMediaManager}
                                className="text-[11px] text-[#8b5a2b] hover:underline shrink-0 ml-1.5"
                              >
                                Ändern
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* EXPEDITIONS-RANDNOTIZEN (ELEGANTE SERIFEN, REINES SCHWARZ) */}
                <div className="p-3.5 bg-[#ede0c8] border-l-4 border-[#8b1e1e] rounded-r-xl shadow-sm">
                  <div className="text-xs font-cinzel font-bold text-[#8b1e1e] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Laras Randnotizen & Warnungen:
                  </div>
                  <ul className="space-y-1.5 text-sm sm:text-[15px] font-diary-serif diary-text-black leading-snug">
                    {activeEntry.handwrittenNotes.map((note, nIdx) => (
                      <li key={nIdx} className="flex items-start gap-1.5 text-black">
                        <span className="text-[#8b1e1e] font-bold select-none">•</span>
                        <span className="text-black">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Seitenfuß mit Seitenzahl */}
              <div className="pt-3 border-t border-[#8b5a2b]/30 flex items-center justify-between text-xs font-serif text-[#7a481c] mt-3">
                <span>Stimmung: <strong className="text-black capitalize">{activeEntry.mood}</strong></span>
                <span className="font-cinzel font-bold">~ Seite {activeEntry.entryNumber * 2} ~</span>
              </div>
            </div>

          </div>
        </div>

        {/* BLÄTTERN-KONTROLLEN (VOR / ZURÜCK) */}
        <div className="flex items-center justify-between max-w-xl mx-auto mt-6 mb-8 px-4 pb-4">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#241710] border-2 border-[#8b5a2b] text-[#ffd992] hover:bg-[#3d2719] hover:border-[#ffd992] text-xs font-cinzel font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-lg active:scale-95"
            title="Vorherige Seite (oder Pfeiltaste Links drücken)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Vorherige Seite</span>
            <span className="hidden sm:inline text-[10px] text-[#ffd992]/60 font-mono">(←)</span>
          </button>

          <span className="text-xs font-cinzel font-bold text-[#ffd992]/90 bg-[#241710]/90 px-3.5 py-1.5 rounded-lg border border-[#8b5a2b]/60 shadow">
            Eintrag {currentIndex + 1} von {entries.length}
          </span>

          <button
            onClick={goToNext}
            disabled={currentIndex === entries.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#241710] border-2 border-[#8b5a2b] text-[#ffd992] hover:bg-[#3d2719] hover:border-[#ffd992] text-xs font-cinzel font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-lg active:scale-95"
            title="Nächste Seite (oder Pfeiltaste Rechts drücken)"
          >
            <span className="hidden sm:inline text-[10px] text-[#ffd992]/60 font-mono">(→)</span>
            <span>Nächste Seite</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* BILD-VORSCHAU / LIGHTBOX MODAL */}
      {selectedMediaForPreview && (
        <div
          onClick={() => setSelectedMediaForPreview(null)}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-[#1a110c] border-2 border-[#8b5a2b] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-black">
              <img
                src={resolveImageUrl(selectedMediaForPreview.url)}
                alt={selectedMediaForPreview.title}
                className="max-w-full max-h-[70vh] object-contain"
                onError={(e) => {
                  const fallback = resolveImageUrl(selectedMediaForPreview.url.split('/').pop());
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
              />
            </div>
            <div className="p-4 bg-[#241710] border-t border-[#8b5a2b] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-cinzel font-bold text-[#ffd992]">
                  {selectedMediaForPreview.title}
                </h3>
                <p className="text-xs text-[#d1b99a] font-serif mt-1">
                  {selectedMediaForPreview.caption}
                </p>
              </div>
              <button
                onClick={() => setSelectedMediaForPreview(null)}
                className="px-4 py-1.5 bg-[#8b5a2b] hover:bg-[#a66b33] text-white text-xs font-cinzel rounded-lg cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
