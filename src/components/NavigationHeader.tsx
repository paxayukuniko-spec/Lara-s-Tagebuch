import React from 'react';
import { Compass, BookOpen, Home, Castle, Radio, Download } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { LAYOUT_IMAGES } from '../utils/imageAssets';
import { stereoAudio } from '../services/stereoAudioService';
import { useStereoAudio } from '../hooks/useStereoAudio';

export type NavTab = 'home' | 'croft-manor' | 'tagebuch' | 'weltkarte' | 'ruhmeshalle';

interface NavigationHeaderProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onOpenMediaManager?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onNavigate,
}) => {
  const { isPlaying } = useStereoAudio();

  const handleTabChange = (tab: NavTab) => {
    try {
      if (tab === 'tagebuch') {
        sounds.playPageTurn();
      } else {
        sounds.playClick();
      }
    } catch (_) {}
    onNavigate(tab);
  };

  return (
    <header className="relative z-30 w-full bg-[#120b07]/90 backdrop-blur-md border-b border-[#5c3a1c]/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Zone 1: Brand Title with Circular App Icon */}
        <button
          onClick={() => handleTabChange('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#d4af37]/80 shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0">
            <img
              src={LAYOUT_IMAGES.appIcon}
              alt="Lara Croft App Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-cinzel text-base sm:text-lg font-bold text-[#ffd992] tracking-wider transition-colors group-hover:text-white">
            Lara Croft <span className="text-[#a06835] font-normal text-xs sm:text-sm tracking-normal">Archiv</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links / Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleTabChange('home')}
            className={activeTab === 'home' ? 'tab-active' : 'tab'}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">STARTSEITE</span>
          </button>

          <button
            onClick={() => handleTabChange('croft-manor')}
            className={activeTab === 'croft-manor' ? 'tab-active' : 'tab'}
          >
            <Castle className="w-3.5 h-3.5 text-[#ffd992]" />
            <span>CROFT MANOR</span>
          </button>

          <button
            onClick={() => handleTabChange('tagebuch')}
            className={activeTab === 'tagebuch' ? 'tab-active' : 'tab'}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>TAGEBUCH</span>
          </button>

          <button
            onClick={() => handleTabChange('weltkarte')}
            className={activeTab === 'weltkarte' ? 'tab-active' : 'tab'}
          >
            <Compass className="w-3.5 h-3.5 text-[#ffd992]" />
            <span>WELTKARTE</span>
          </button>
        </nav>

        {/* Zone 3: Stereo & Mood-Switcher & Hostinger Export */}
        <div className="flex items-center gap-2">
          <a
            href="/lara_tagebuch_hostinger_webspace.zip"
            download="lara_tagebuch_hostinger_webspace.zip"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1c120b] border border-[#a06835]/60 text-[#ffd992] hover:bg-[#321e12] hover:border-[#ffd992] text-xs font-cinzel transition cursor-pointer shadow-md"
            title="Fertiges Hostinger-Paket (.ZIP) für den Ordner public_html herunterladen"
          >
            <Download className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden lg:inline">Hostinger ZIP</span>
          </a>

          <button
            onClick={() => {
              try { sounds.playClick(); } catch (_) {}
              stereoAudio.setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241710] border border-[#d4af37]/60 text-[#ffd992] hover:bg-[#3d2719] text-xs font-cinzel transition cursor-pointer shadow-md relative"
            title="Laras Stereoanlage & Mood-Switcher öffnen"
          >
            <Radio className="w-3.5 h-3.5 text-[#ffd992]" />
            <span className="hidden md:inline">Stereo & Mood</span>
            {isPlaying && (
              <span className="w-2 h-2 rounded-full bg-[#50fa7b] shadow-[0_0_8px_#50fa7b] animate-pulse ml-1" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
