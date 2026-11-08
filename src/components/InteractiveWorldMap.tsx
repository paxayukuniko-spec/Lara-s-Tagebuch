import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  BookOpen,
  ChevronRight,
  Shield,
  Sparkles,
  ExternalLink,
  X,
  Crosshair,
  Filter,
  Info,
} from 'lucide-react';
import { EXPEDITION_LOCATIONS, ExpeditionLocation, EXPEDITION_STATS } from '../data/tombRaiderExpeditionsData';
import { LAYOUT_IMAGES } from '../utils/imageAssets';
import { sounds } from '../utils/soundEffects';

interface InteractiveWorldMapProps {
  onOpenDiaryEntry?: (diaryEntryId: string) => void;
  onNavigateToDiary?: () => void;
}

type GameFilter = 'all' | 'tr1' | 'tr2' | 'tr3';

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  onOpenDiaryEntry,
  onNavigateToDiary,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ExpeditionLocation | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [hoveredLocation, setHoveredLocation] = useState<ExpeditionLocation | null>(null);

  // Zoom & Pan Zustand
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Gefilterte Orte basierend auf Spiel und Suchanfrage
  const filteredLocations = useMemo(() => {
    return EXPEDITION_LOCATIONS.filter((loc) => {
      if (selectedGame !== 'all' && loc.game !== selectedGame) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        loc.locationName.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q) ||
        loc.relic.toLowerCase().includes(q) ||
        loc.levels.some((lvl) => lvl.toLowerCase().includes(q)) ||
        loc.bossOrAntagonists.some((boss) => boss.toLowerCase().includes(q))
      );
    });
  }, [selectedGame, searchQuery]);

  // Routenpunkte nach Spiel geordnet
  const routesByGame = useMemo(() => {
    const tr1 = EXPEDITION_LOCATIONS.filter((l) => l.game === 'tr1').sort((a, b) => a.order - b.order);
    const tr2 = EXPEDITION_LOCATIONS.filter((l) => l.game === 'tr2').sort((a, b) => a.order - b.order);
    const tr3 = EXPEDITION_LOCATIONS.filter((l) => l.game === 'tr3').sort((a, b) => a.order - b.order);
    return { tr1, tr2, tr3 };
  }, []);

  // Zoom Funktionen
  const handleZoomIn = () => {
    sounds.playClick();
    setZoom((prev) => Math.min(prev + 0.35, 2.8));
  };

  const handleZoomOut = () => {
    sounds.playClick();
    setZoom((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetView = () => {
    sounds.playClick();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Maus-Drag zum Verschieben
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Nur linke Maustaste
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Fokussiere auf einen Ort bei Klick
  const handleSelectLocation = (loc: ExpeditionLocation) => {
    sounds.playClick();
    setSelectedLocation(loc);

    // Zentriere die Karte leicht auf diesen Punkt bei höheren Zoomstufen
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const targetX = -(loc.x / 100 - 0.5) * rect.width * (zoom > 1 ? 0.6 : 0);
      const targetY = -(loc.y / 100 - 0.5) * rect.height * (zoom > 1 ? 0.6 : 0);
      setPan({ x: targetX, y: targetY });
    }
  };

  // Farbpaletten nach Spiel
  const getGameBadge = (game: 'tr1' | 'tr2' | 'tr3') => {
    switch (game) {
      case 'tr1':
        return {
          label: 'TR 1',
          bg: 'bg-cyan-950/80',
          border: 'border-cyan-500/70',
          text: 'text-cyan-300',
          pin: 'bg-cyan-500 border-white text-black shadow-cyan-500/50',
          route: '#06b6d4',
        };
      case 'tr2':
        return {
          label: 'TR 2',
          bg: 'bg-amber-950/80',
          border: 'border-amber-500/70',
          text: 'text-amber-300',
          pin: 'bg-amber-500 border-white text-black shadow-amber-500/50',
          route: '#f59e0b',
        };
      case 'tr3':
        return {
          label: 'TR 3',
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500/70',
          text: 'text-emerald-300',
          pin: 'bg-emerald-500 border-white text-black shadow-emerald-500/50',
          route: '#10b981',
        };
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full bg-[#0d0806] text-[#e8d7be] flex flex-col select-none overflow-hidden font-serif">
      {/* OBERE KOPFLEISTE DER WELTKARTE */}
      <div className="relative z-20 w-full bg-[#180f0a]/95 border-b border-[#5c3a1c] px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Titel & Info */}
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#ffd992] animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-[#ffd992] tracking-wider">
                Lara Crofts Weltkarte
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#b89f82] font-cinzel mt-0.5">
              <span>Expeditionen aus Tomb Raider 1 – 3</span>
              <span aria-hidden="true">·</span>
              <span>{filteredLocations.length} Stationen verzeichnet</span>
              <span aria-hidden="true">·</span>
              <span className="hidden sm:inline">1996 – 1998</span>
            </div>
          </div>

          {/* Steuerelemente: Filter, Routen & Suche */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Spiel-Filter Segmented Buttons */}
            <div className="flex items-center bg-[#25170f] border border-[#5c3a1c] rounded-lg p-0.5">
              <button
                onClick={() => {
                  sounds.playClick();
                  setSelectedGame('all');
                }}
                className={`px-2.5 py-1 text-xs font-cinzel font-semibold rounded transition cursor-pointer whitespace-nowrap ${
                  selectedGame === 'all'
                    ? 'bg-[#4a2e1b] text-[#ffd992] shadow-sm'
                    : 'text-[#a89078] hover:text-[#e8d7be]'
                }`}
              >
                Alle (TR 1-3)
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setSelectedGame('tr1');
                }}
                className={`px-2 py-1 text-xs font-cinzel font-semibold rounded transition cursor-pointer whitespace-nowrap ${
                  selectedGame === 'tr1'
                    ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-700/50'
                    : 'text-[#a89078] hover:text-cyan-300'
                }`}
              >
                TR I
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setSelectedGame('tr2');
                }}
                className={`px-2 py-1 text-xs font-cinzel font-semibold rounded transition cursor-pointer whitespace-nowrap ${
                  selectedGame === 'tr2'
                    ? 'bg-amber-900/80 text-amber-200 border border-amber-700/50'
                    : 'text-[#a89078] hover:text-amber-300'
                }`}
              >
                TR II
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setSelectedGame('tr3');
                }}
                className={`px-2 py-1 text-xs font-cinzel font-semibold rounded transition cursor-pointer whitespace-nowrap ${
                  selectedGame === 'tr3'
                    ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/50'
                    : 'text-[#a89078] hover:text-emerald-300'
                }`}
              >
                TR III
              </button>
            </div>

            {/* Routen-Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowRoutes(!showRoutes);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel rounded border transition cursor-pointer ${
                showRoutes
                  ? 'bg-[#3b2314] text-[#ffd992] border-[#a06835]'
                  : 'bg-[#1b110b] text-[#8e7660] border-[#3d2719] hover:text-[#d6c4ae]'
              }`}
              title="Reiserouten auf der Weltkarte ein-/ausblenden"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Routen</span>
            </button>

            {/* Suchfeld */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8e7660]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ort, Relikt, Gegner..."
                className="w-36 sm:w-48 pl-8 pr-3 py-1 bg-[#120a06] border border-[#5c3a1c] focus:border-[#ffd992] rounded text-xs text-[#e8d7be] placeholder-[#6e5540] focus:outline-none font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8e7660] hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HAUPTBEREICH: INTERAKTIVE KARTE + EXPEDITIONS-DOSSIER */}
      <div className="relative flex-1 w-full flex overflow-hidden">
        {/* KARTEN-VIEWPORT */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative flex-1 h-[calc(100vh-7.5rem)] overflow-hidden bg-[#0d0907] flex items-center justify-center cursor-grab active:cursor-grabbing`}
        >
          {/* Zoom & Pan Container */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="relative w-full max-w-[1408px] aspect-[1408/768] shadow-2xl rounded-sm border-2 border-[#5c3a1c]/70 select-none overflow-hidden"
          >
            {/* DAS GEWÜNSCHTE BILD: lara´s-weltkarte.jpg */}
            <img
              src={LAYOUT_IMAGES.worldMap}
              alt="Laras Weltkarte - Reiserouten Tomb Raider 1 bis 3"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />

            {/* Antiker Pergament-Overlay / Vignette für maximale historische Atmosphäre */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

            {/* SVG REISEROUTEN (Fahrt- & Fluglinien zwischen den Stationen) */}
            {showRoutes && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* TR 1 Reiseroute (Cyan / Gold) */}
                {(selectedGame === 'all' || selectedGame === 'tr1') && (
                  <g opacity={selectedGame === 'all' ? 0.75 : 0.95}>
                    {routesByGame.tr1.map((loc, idx) => {
                      if (idx === 0) return null;
                      const prev = routesByGame.tr1[idx - 1];
                      // Berechne leichten Bogen für Flugroute
                      const midX = (prev.x + loc.x) / 2;
                      const midY = (prev.y + loc.y) / 2 - 4;
                      return (
                        <path
                          key={`route-tr1-${loc.id}`}
                          d={`M ${prev.x} ${prev.y} Q ${midX} ${midY} ${loc.x} ${loc.y}`}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="0.35"
                          strokeDasharray="0.8 0.6"
                          className="animate-pulse"
                        />
                      );
                    })}
                  </g>
                )}

                {/* TR 2 Reiseroute (Amber / Crimson) */}
                {(selectedGame === 'all' || selectedGame === 'tr2') && (
                  <g opacity={selectedGame === 'all' ? 0.75 : 0.95}>
                    {routesByGame.tr2.map((loc, idx) => {
                      if (idx === 0) return null;
                      const prev = routesByGame.tr2[idx - 1];
                      const midX = (prev.x + loc.x) / 2;
                      const midY = (prev.y + loc.y) / 2 - 3;
                      return (
                        <path
                          key={`route-tr2-${loc.id}`}
                          d={`M ${prev.x} ${prev.y} Q ${midX} ${midY} ${loc.x} ${loc.y}`}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="0.35"
                          strokeDasharray="0.8 0.6"
                        />
                      );
                    })}
                  </g>
                )}

                {/* TR 3 Reiseroute (Emerald / Green) */}
                {(selectedGame === 'all' || selectedGame === 'tr3') && (
                  <g opacity={selectedGame === 'all' ? 0.75 : 0.95}>
                    {routesByGame.tr3.map((loc, idx) => {
                      if (idx === 0) return null;
                      const prev = routesByGame.tr3[idx - 1];
                      const midX = (prev.x + loc.x) / 2;
                      const midY = (prev.y + loc.y) / 2 - 5;
                      return (
                        <path
                          key={`route-tr3-${loc.id}`}
                          d={`M ${prev.x} ${prev.y} Q ${midX} ${midY} ${loc.x} ${loc.y}`}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="0.35"
                          strokeDasharray="0.8 0.6"
                        />
                      );
                    })}
                  </g>
                )}
              </svg>
            )}

            {/* INTERAKTIVE EXPEDITIONS-PINS */}
            {filteredLocations.map((loc) => {
              const badge = getGameBadge(loc.game);
              const isSelected = selectedLocation?.id === loc.id;
              const isHovered = hoveredLocation?.id === loc.id;

              return (
                <div
                  key={loc.id}
                  style={{
                    left: `${loc.x}%`,
                    top: `${loc.y}%`,
                  }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
                >
                  {/* Pin Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLocation(loc);
                    }}
                    onMouseEnter={() => setHoveredLocation(loc)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    className={`relative flex items-center justify-center cursor-pointer transition-transform duration-200 focus:outline-none ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                    }`}
                  >
                    {/* Pulsierender Halo bei Auswahl */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full border-2 border-[#ffd992] animate-ping opacity-75" />
                    )}

                    {/* Pin-Körper */}
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-cinzel text-[10px] sm:text-xs font-bold shadow-lg border-2 ${
                        isSelected
                          ? 'bg-[#ffd992] text-black border-white ring-2 ring-[#ffd992]/80 scale-110'
                          : badge.pin
                      }`}
                    >
                      {loc.order}
                    </div>

                    {/* Fester kleiner Titel unter Pin für bessere Lesbarkeit auf Desktop */}
                    <span className="hidden lg:block absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-cinzel font-semibold tracking-wider px-1.5 py-0.5 rounded bg-black/85 text-[#ffd992] border border-[#5c3a1c] pointer-events-none drop-shadow-md">
                      {loc.country}
                    </span>
                  </button>

                  {/* HOVER TOOLTIP */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-48 sm:w-56 p-2 rounded-lg bg-[#1a0f09]/95 border border-[#8b5a2b] shadow-2xl text-left pointer-events-none z-40 animate-fadeIn backdrop-blur-md">
                      <div className="flex items-center justify-between text-[10px] font-cinzel text-[#ffd992]">
                        <span>{loc.gameTitle}</span>
                        <span className="opacity-80">#{loc.order}</span>
                      </div>
                      <div className="text-xs font-bold text-white font-cinzel mt-0.5">
                        {loc.locationName}
                      </div>
                      <div className="text-[11px] text-[#cfbeaa] mt-1 line-clamp-2">
                        {loc.summary}
                      </div>
                      <div className="mt-1 text-[10px] text-[#ffd992] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span className="truncate">{loc.relic}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* KARTEN-STEUERUNG (ZOOM, RESET, KOORDINATEN) */}
          <div className="absolute right-4 bottom-4 z-20 flex flex-col items-center gap-1.5 bg-[#1a100b]/90 border border-[#5c3a1c] p-1.5 rounded-lg shadow-xl backdrop-blur-sm">
            <button
              onClick={handleZoomIn}
              className="p-2 text-[#ffd992] hover:bg-[#3d2719] rounded transition cursor-pointer"
              title="Vergrößern (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 text-[#ffd992] hover:bg-[#3d2719] rounded transition cursor-pointer"
              title="Verkleinern (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2 text-[#ffd992] hover:bg-[#3d2719] rounded transition cursor-pointer"
              title="Ansicht zurücksetzen"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* HINWEIS-BADGE UNTEN LINKS */}
          <div className="absolute left-4 bottom-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#120905]/85 border border-[#5c3a1c] text-[11px] font-cinzel text-[#b89f82]">
            <Compass className="w-3.5 h-3.5 text-[#ffd992]" />
            <span>Klicke auf einen Pin für das vollständige Expeditions-Dossier</span>
          </div>
        </div>

        {/* EXPEDITIONS-DOSSIER SEITENPANEL */}
        {selectedLocation ? (
          <aside className="w-full sm:w-96 md:w-[420px] bg-[#160d08]/98 border-l-2 border-[#8b5a2b] shadow-2xl flex flex-col z-30 animate-fadeIn overflow-y-auto">
            {/* Header des Dossiers */}
            <div className="relative p-4 border-b border-[#5c3a1c] bg-[#22140d]/90">
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute right-3 top-3 p-1.5 text-[#b89f82] hover:text-white hover:bg-[#3d2719] rounded-full transition cursor-pointer"
                title="Dossier schließen"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-cinzel font-bold border ${
                    getGameBadge(selectedLocation.game).bg
                  } ${getGameBadge(selectedLocation.game).text} ${
                    getGameBadge(selectedLocation.game).border
                  }`}
                >
                  {selectedLocation.gameTitle} ({selectedLocation.year})
                </span>
                <span className="text-[11px] text-[#b89f82] font-cinzel">
                  Station #{selectedLocation.order}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-cinzel font-bold text-[#ffd992] mt-1.5">
                {selectedLocation.locationName}
              </h2>

              <div className="flex items-center gap-2 text-xs text-[#d6c4ae] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#ffd992] shrink-0" />
                <span>{selectedLocation.region}</span>
              </div>
              <div className="text-[11px] font-mono text-[#a88a6d] mt-0.5">
                {selectedLocation.coordinatesDisplay}
              </div>
            </div>

            {/* Inhalt des Dossiers */}
            <div className="p-4 sm:p-5 space-y-5 text-sm">
              {/* Relikt / Bergungsgut */}
              <div className="p-3.5 rounded-lg bg-[#24150d] border border-[#a06835]/70 flex items-start gap-3">
                {selectedLocation.relicImage ? (
                  <div className="w-16 h-16 rounded overflow-hidden border border-[#ffd992]/50 shrink-0 bg-black">
                    <img
                      src={selectedLocation.relicImage}
                      alt={selectedLocation.relic}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded border border-[#a06835] bg-[#1a0f0a] flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-[#ffd992]" />
                  </div>
                )}
                <div>
                  <div className="text-[10px] font-cinzel text-[#ffd992] font-bold uppercase tracking-wider">
                    Hauptrelikt / Bergungsziel
                  </div>
                  <div className="text-sm font-bold text-white font-cinzel mt-0.5">
                    {selectedLocation.relic}
                  </div>
                  <p className="text-xs text-[#cfbeaa] mt-1 leading-relaxed">
                    {selectedLocation.summary}
                  </p>
                </div>
              </div>

              {/* Laras Feldnotizen / Zitat */}
              <div className="relative p-4 rounded-lg bg-[#2a1a11]/60 border-l-4 border-[#ffd992] italic text-[#f1e3d3] leading-relaxed">
                <div className="not-italic text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#ffd992] mb-1.5">
                  Laras Expeditions-Tagebuch
                </div>
                "{selectedLocation.journalExcerpt}"
              </div>

              {/* Level der Region */}
              <div>
                <div className="text-xs font-cinzel font-bold text-[#ffd992] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#ffd992]" />
                  <span>Schauplätze & Level</span>
                </div>
                <div className="space-y-1">
                  {selectedLocation.levels.map((lvl, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1.5 rounded bg-[#1c100a] border border-[#3d2719] text-xs text-[#d6c4ae] flex items-center justify-between"
                    >
                      <span>{lvl}</span>
                      <span className="text-[10px] text-[#8e7660] font-mono">0{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widersacher & Gefahren */}
              {selectedLocation.bossOrAntagonists.length > 0 && (
                <div>
                  <div className="text-xs font-cinzel font-bold text-[#ffd992] uppercase tracking-wider mb-2">
                    Widersacher & Begegnungen
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLocation.bossOrAntagonists.map((boss, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#20120b] border border-[#5c3a1c] text-xs text-[#e8d7be]"
                      >
                        {boss}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fahrzeuge & Ausrüstung */}
              {selectedLocation.vehicles && selectedLocation.vehicles.length > 0 && (
                <div>
                  <div className="text-xs font-cinzel font-bold text-[#ffd992] uppercase tracking-wider mb-2">
                    Fahrzeuge & Transport
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLocation.vehicles.map((v, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#28180e] border border-[#8b5a2b]/60 text-xs text-[#ffd992]"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verknüpfung zum Tagebuch (für Tomb Raider 1) */}
              {selectedLocation.diaryEntryId && onOpenDiaryEntry && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      sounds.playPageTurn();
                      onOpenDiaryEntry(selectedLocation.diaryEntryId!);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#ffd992] hover:bg-white text-black font-cinzel font-bold text-xs tracking-wider transition-all duration-200 shadow-lg cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>IM TAGEBUCH AUFSCHLAGEN</span>
                  </button>
                </div>
              )}
            </div>
          </aside>
        ) : (
          /* Schnellauswahl-Leiste wenn kein Ort angewählt */
          <aside className="hidden xl:flex w-80 bg-[#140b07]/95 border-l border-[#5c3a1c] flex-col p-4 overflow-y-auto">
            <div className="text-xs font-cinzel font-bold text-[#ffd992] uppercase tracking-wider pb-2 border-b border-[#3d2719] flex items-center justify-between">
              <span>Reise-Etappen</span>
              <span className="text-[10px] text-[#8e7660]">({filteredLocations.length})</span>
            </div>

            <div className="mt-3 space-y-1.5">
              {filteredLocations.map((loc) => {
                const badge = getGameBadge(loc.game);
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full text-left p-2.5 rounded bg-[#1c100a] hover:bg-[#2e1d14] border border-[#3d2719] hover:border-[#8b5a2b] transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-cinzel font-bold px-1.5 py-0.2 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-[#8e7660] font-cinzel">
                        {loc.country}
                      </span>
                    </div>
                    <div className="text-xs font-cinzel font-bold text-[#e8d7be] group-hover:text-[#ffd992] mt-1 truncate">
                      {loc.locationName}
                    </div>
                    <div className="text-[11px] text-[#a89078] truncate mt-0.5">
                      {loc.relic}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
