import React from 'react';
import { BookOpen } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import heroImage from '../assets/images/startseite_hero_1790788872670.jpg';

interface HomePageProps {
  onOpenDiary: () => void;
  onOpenMap?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenDiary,
}) => {
  const handleOpenClick = () => {
    // 1. Sound-Effekt Pergament-Umblättern
    try {
      sounds.playPageTurn();
    } catch (_) {}
    // 2. Tagebuch öffnen
    onOpenDiary();
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-between items-center bg-[#0d0907] text-[#e8d7be] overflow-hidden select-none">
      {/* Hero Hintergrund mit Laras Schreibtisch (Hell & Detailreich) */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Lara Crofts Schreibtisch mit Tagebuch, Pistolen und Rucksack"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />

        {/* Subtiler Vignette-Effekt für hervorragende Lesbarkeit, ohne das Bild abzudunkeln */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
      </div>

      {/* Haupttitel: Weiter oben im Bild, in schwarzer Tinte, etwas kleiner und in authentischer Tagebuch-Schrift */}
      <header className="relative z-10 w-full pt-8 sm:pt-12 md:pt-14 flex flex-col items-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['Marck_Script',var(--font-caveat),cursive] font-normal text-black tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] drop-shadow-[0_2px_12px_rgba(255,235,190,0.45)]">
          Lara´s Tagebuch
        </h1>
      </header>

      {/* Freier Mittelbereich: Rucksack, Tagebuch, Pistolen und Schreibtisch bleiben voll sichtbar */}
      <main className="relative z-10 flex-1 w-full pointer-events-none" />

      {/* Unten: Aktionsleiste - TAGEBUCH ÖFFNEN */}
      <footer className="relative z-10 w-full pb-8 sm:pb-12 flex flex-wrap justify-center items-center gap-3.5 px-4">
        <button
          onClick={handleOpenClick}
          className="flex items-center gap-2.5 px-7 py-3 bg-[#1b110b]/85 hover:bg-[#2c1b11] border border-[#a06835]/75 hover:border-[#ffd992] rounded-full text-[#ffd992] font-cinzel text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 shadow-xl hover:shadow-[#ffd992]/25 active:scale-95 cursor-pointer backdrop-blur-md group"
        >
          <BookOpen className="w-4 h-4 text-[#e4c478] transition-transform duration-200 group-hover:scale-110" />
          <span>TAGEBUCH ÖFFNEN</span>
        </button>

      </footer>
    </div>
  );
};
