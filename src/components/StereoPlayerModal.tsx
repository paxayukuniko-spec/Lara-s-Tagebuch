import React from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Disc3,
  X,
  Music,
  Radio,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';
import { StereoTrack } from '../types/database';
import { useStereoAudio } from '../hooks/useStereoAudio';

export type { StereoTrack };

export const STEREO_TRACKS: StereoTrack[] = [
  {
    id: 'arnak',
    title: 'Die verlorenen Ruinen von Arnak (02.10.2025)',
    originalName: 'arnak.mp3',
    url: '/music/arnak.mp3',
    description: 'Atmosphärischer Soundtrack für die verlorenen Ruinen von Arnak.',
  },
  {
    id: 'hotel',
    title: 'Imperial Hotel, Kalkutta (03.10.2026)',
    originalName: 'hotel.mp3',
    url: '/music/hotel.mp3',
    description: 'Atmosphärischer Soundtrack für das Treffen mit Larson Conway im Imperial Hotel.',
  },
  {
    id: 'imperial-hotel',
    title: 'Imperial Hotel (Atmosphäre & Bar)',
    originalName: 'imperial-hotel.mp3',
    url: '/music/imperial-hotel.mp3',
    description: 'Dichte Klavier- und Bar-Atmosphäre in Kalkutta.',
  },
  {
    id: 'das-verlorene-tal',
    title: 'Das Verlorene Tal (The Lost Valley)',
    originalName: 'das-verlorene-tal.mp3',
    url: '/music/das-verlorene-tal.mp3',
    description: 'Atmosphärischer Soundtrack für Das Verlorene Tal und den T-Rex.',
  },
  {
    id: 'theme',
    title: 'Hauptthema (Tomb Raider 1996)',
    originalName: 'startseite.mp3',
    url: '/music/startseite.mp3',
    description: 'Das ikonische Hauptthema von Nathan McCree (Tomb Raider 1996).',
  },
  {
    id: 'die-hoelen',
    title: 'Level 1: Die Höhlen von Peru',
    originalName: 'die-hoelen.mp3',
    url: '/music/die-hoelen.mp3',
    description: 'Der atmosphärische Soundtrack für Die Höhlen.',
  },
  {
    id: 'vilcabamba',
    title: 'Die Stadt Vilcabamba',
    originalName: 'vilcabamba.mp3',
    url: '/music/vilcabamba.mp3',
    description: 'Inka-Ruinen und antike Tempel in den Anden.',
  },
  {
    id: 'arbeitszimmer',
    title: 'Arbeitszimmer (Lord Croft Manuskripte)',
    originalName: 'arbeitszimmer.mp3',
    url: '/music/arbeitszimmer.mp3',
    description: 'Ruhige Studienzimmer-Atmosphäre aus Laras Anwesen.',
  },
  {
    id: 'kellergewoelbe',
    title: 'Kellergewölbe & Expeditionslager',
    originalName: 'kellergewoelbe.mp3',
    url: '/music/kellergewoelbe.mp3',
    description: 'Geheimnisvolles Gewölbe- und Ausrüstungs-Ambiente.',
  },
  {
    id: 'atlantis-tagebuch',
    title: 'Das geheime Tagebuch von Atlantis',
    originalName: 'atlantis-tagebuch.mp3',
    url: '/music/atlantis-tagebuch.mp3',
    description: 'Alte Aufzeichnungen und Mythen der Urzeit.',
  },
  {
    id: 'dad',
    title: 'Lord Crofts Vermächtnis an Lara',
    originalName: 'dad.mp3',
    url: '/music/dad.mp3',
    description: 'Persönliche Sprachnotiz von Richard Croft.',
  },
  {
    id: 'tee',
    title: 'Winston Smiths Teestunde & Croft Manor',
    originalName: 'tee.mp3',
    url: '/music/tee.mp3',
    description: 'Tee-Service und klassisches Anwesen-Ambiente.',
  },
  {
    id: 'secret',
    title: 'Geheimnis gefunden (Tomb Raider Jingle)',
    originalName: 'tr_secret.mp3',
    url: '/music/tr_secret.mp3',
    description: 'Der legendäre Tomb Raider Secret-Sound.',
  },
  {
    id: 'kamin-feuer',
    title: 'Kaminfeuer-Knistern (Wohnzimmer & Gemach)',
    originalName: 'kamin-feuer.mp3',
    url: '/music/kamin-feuer.mp3',
    description: 'Warmes, beruhigendes Kaminfeuer-Ambiente in Croft Manor.',
  },
];

export interface StereoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayStateChange?: (isPlaying: boolean, currentTrackTitle: string) => void;
  isWinstonAnimActive?: boolean;
}

export const StereoPlayerModal: React.FC<StereoPlayerModalProps> = ({
  isOpen,
  onClose,
  onPlayStateChange,
  isWinstonAnimActive = false,
}) => {
  const {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    error,
    currentMood,
    autoMood,
    kaminVolume,
    isKaminMuted,
    isKaminPlaying,
    selectTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    setMood,
    setAutoMood,
    setKaminfeuerVolume,
    toggleKaminMute,
  } = useStereoAudio();

  // Informiere Parent über Playback-Zustand
  React.useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying, currentTrack.title);
    }
  }, [isPlaying, currentTrack.title, onPlayStateChange]);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        display: isOpen ? 'flex' : 'none',
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #24160c 0%, #150c06 100%)',
          border: '2px solid #d4af37',
          borderRadius: '12px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 25px rgba(212,175,55,0.25)',
          maxWidth: '580px',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: '#e8d7be',
          fontFamily: 'serif',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fenster-Kopfzeile */}
        <div
          style={{
            background: 'linear-gradient(90deg, #331f10 0%, #201309 100%)',
            borderBottom: '1px solid #7c5828',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #d4af37, #85581c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#150c06',
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
              }}
            >
              <Radio style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '18px',
                  color: '#ffd992',
                  letterSpacing: '0.05em',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Laras Stereoanlage & Mood-Switcher</span>
              </h2>
              <span style={{ fontSize: '11px', color: '#a8947b', fontStyle: 'italic' }}>
                Ausschließlich gespeicherte MP3-Dateien (Keine Computersounds)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Fenster schließen (Musik läuft im Hintergrund weiter)"
            style={{
              background: '#2a1a0f',
              border: '1px solid #7c5828',
              color: '#d4af37',
              borderRadius: '6px',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            className="hover:scale-105 hover:bg-[#3d2514] active:scale-95"
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Inhalt mit Scroll */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
          
          {/* MOOD-SWITCHER BEREICH */}
          <div
            style={{
              background: '#1c1109',
              border: '1px solid #664320',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: '#ffd992',
                fontWeight: 'bold',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles style={{ width: '14px', height: '14px', color: '#d4af37' }} />
                <span>Mood-Switcher (Stimmungs-Regler)</span>
              </span>
              <label
                style={{
                  fontSize: '11px',
                  color: '#a8947b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
                title="Musik automatisch an den gewählten Tagebucheintrag anpassen"
              >
                <input
                  type="checkbox"
                  checked={autoMood}
                  onChange={(e) => setAutoMood(e.target.checked)}
                  style={{ accentColor: '#d4af37' }}
                />
                <span>Auto nach Tagebuch</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                onClick={() => setMood('abenteuer')}
                style={{
                  background:
                    currentMood === 'abenteuer'
                      ? 'linear-gradient(135deg, #d4af37, #966723)'
                      : '#2a1a0f',
                  color: currentMood === 'abenteuer' ? '#1a0f07' : '#ffd992',
                  border: '1.5px solid #d4af37',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  boxShadow: currentMood === 'abenteuer' ? '0 0 10px rgba(212,175,55,0.4)' : 'none',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <span>🌴 Abenteuer</span>
                <span style={{ fontSize: '9px', opacity: 0.8, fontWeight: 'normal' }}>Episch & Aktiv</span>
              </button>

              <button
                onClick={() => setMood('spannung')}
                style={{
                  background:
                    currentMood === 'spannung'
                      ? 'linear-gradient(135deg, #d4af37, #966723)'
                      : '#2a1a0f',
                  color: currentMood === 'spannung' ? '#1a0f07' : '#ffd992',
                  border: '1.5px solid #d4af37',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  boxShadow: currentMood === 'spannung' ? '0 0 10px rgba(212,175,55,0.4)' : 'none',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <span>⚡ Spannung</span>
                <span style={{ fontSize: '9px', opacity: 0.8, fontWeight: 'normal' }}>Gräber & Gefahr</span>
              </button>

              <button
                onClick={() => setMood('ruhe')}
                style={{
                  background:
                    currentMood === 'ruhe'
                      ? 'linear-gradient(135deg, #d4af37, #966723)'
                      : '#2a1a0f',
                  color: currentMood === 'ruhe' ? '#1a0f07' : '#ffd992',
                  border: '1.5px solid #d4af37',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  boxShadow: currentMood === 'ruhe' ? '0 0 10px rgba(212,175,55,0.4)' : 'none',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <span>🍵 Ruhe</span>
                <span style={{ fontSize: '9px', opacity: 0.8, fontWeight: 'normal' }}>Studie & Atempause</span>
              </button>
            </div>
          </div>

          {/* AMBIENT AUDIO MIXER (KAMINFEUER) */}
          <div
            style={{
              background: '#1c1109',
              border: isWinstonAnimActive ? '2px solid #58a6ff' : '1.5px solid #d4af37',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: isWinstonAnimActive ? '0 0 20px rgba(88,166,255,0.5)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: isWinstonAnimActive ? '#79c0ff' : '#ffd992',
                fontWeight: 'bold',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders style={{ width: '14px', height: '14px', color: isWinstonAnimActive ? '#58a6ff' : '#d4af37' }} />
                <span>Ambient Audio Mixer (Kaminfeuer)</span>
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: isWinstonAnimActive ? '#79c0ff' : (isKaminPlaying ? '#50fa7b' : '#a8947b'),
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                }}
                className={isWinstonAnimActive ? 'animate-pulse' : ''}
              >
                {isWinstonAnimActive ? '❄️ SCHLOSS FRIERT EIN...' : (isKaminPlaying ? '🔥 KAMIN AKTIV' : '⏸ WOHNZIMMER LEER')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`text-xl ${isWinstonAnimActive ? 'animate-bounce animate-pulse text-cyan-300' : ''}`} style={{ transition: 'all 0.3s' }}>
                  {isWinstonAnimActive ? '❄️🔒' : '🔥'}
                </span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: isWinstonAnimActive ? '#79c0ff' : '#e8d7be' }}>
                    {isWinstonAnimActive ? 'Winston-Event: Schloss friert ein!' : 'Kaminfeuer-Knistern'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#a8947b' }}>
                    Spielt automatisch im Wohnzimmer (Endlosschleife)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={toggleKaminMute}
                  title={isKaminMuted ? 'Ton an' : 'Stummschalten'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isKaminMuted ? '#e06c75' : '#ffd992',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {isKaminMuted || kaminVolume === 0 ? (
                    <VolumeX style={{ width: '16px', height: '16px' }} />
                  ) : (
                    <Volume2 style={{ width: '16px', height: '16px' }} />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isKaminMuted ? 0 : kaminVolume}
                  onChange={(e) => setKaminfeuerVolume(Number(e.target.value))}
                  style={{
                    width: '85px',
                    accentColor: '#d4af37',
                    cursor: 'pointer',
                  }}
                  title={`Kaminfeuer Lautstärke: ${Math.round((isKaminMuted ? 0 : kaminVolume) * 100)}%`}
                />
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#ffd992', minWidth: '30px', textAlign: 'right' }}>
                  {Math.round((isKaminMuted ? 0 : kaminVolume) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Vintage Hi-Fi Display (LCD-Panel) */}
          <div
            style={{
              background: '#0a0d0a',
              border: '2px solid #33261a',
              borderRadius: '8px',
              padding: '14px 18px',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Disc3
                  style={{
                    width: '18px',
                    height: '18px',
                    color: isPlaying ? '#ffb338' : '#776249',
                    animation: isPlaying ? 'spin 3s linear infinite' : 'none',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: isPlaying ? '#ffba42' : '#8c765c',
                    fontWeight: 'bold',
                    letterSpacing: '0.08em',
                  }}
                >
                  AKTIVER MOOD: {currentMood.toUpperCase()}
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  letterSpacing: '0.08em',
                  color: isPlaying ? '#50fa7b' : '#ffb86c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: isPlaying ? '#50fa7b' : '#ffb86c',
                    boxShadow: isPlaying ? '0 0 8px #50fa7b' : 'none',
                  }}
                />
                <span>{isPlaying ? 'PLAYING ▶' : 'PAUSED ❚❚'}</span>
              </div>
            </div>

            {/* Titelanzeige */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  fontSize: '17px',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  color: '#ffd992',
                  letterSpacing: '0.04em',
                  textShadow: '0 0 10px rgba(255,217,146,0.3)',
                }}
              >
                {currentTrack.title}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#9e8c75',
                  marginTop: '2px',
                  fontFamily: 'sans-serif',
                }}
              >
                {currentTrack.description}
              </div>
            </div>

            {/* Zeitanzeige & Equalizer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '12px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px' }}>
                {[60, 90, 40, 100, 75, 45, 85, 30].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      backgroundColor: isPlaying ? '#ffb338' : '#4a3b2b',
                      height: isPlaying ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : '20%',
                      borderRadius: '1px',
                      transition: 'height 0.2s ease',
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: '#ffd992',
                  letterSpacing: '0.06em',
                }}
              >
                <span>{formatTime(currentTime)}</span>
                <span style={{ color: '#776249', margin: '0 4px' }}>/</span>
                <span style={{ color: '#a8947b' }}>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Steuerungstasten & Lautstärke */}
          <div
            style={{
              background: '#1c1109',
              border: '1px solid #664320',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={prevTrack}
                  title="Vorheriger Track"
                  style={{
                    background: '#2a1a0f',
                    border: '1px solid #7c5828',
                    color: '#ffd992',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className="hover:bg-[#3d2514] active:scale-95"
                >
                  <SkipBack style={{ width: '15px', height: '15px' }} />
                </button>

                <button
                  onClick={togglePlay}
                  title={isPlaying ? 'Pause' : 'Abspielen'}
                  style={{
                    background: 'linear-gradient(135deg, #d4af37, #966723)',
                    border: '1px solid #ffe299',
                    color: '#1a0f07',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    padding: '7px 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <>
                      <Pause style={{ width: '16px', height: '16px' }} />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play style={{ width: '16px', height: '16px', fill: '#1a0f07' }} />
                      <span>Play</span>
                    </>
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  title="Nächster Track"
                  style={{
                    background: '#2a1a0f',
                    border: '1px solid #7c5828',
                    color: '#ffd992',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className="hover:bg-[#3d2514] active:scale-95"
                >
                  <SkipForward style={{ width: '15px', height: '15px' }} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={toggleMute}
                  title={isMuted ? 'Ton an' : 'Stummschalten'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isMuted ? '#e06c75' : '#ffd992',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX style={{ width: '16px', height: '16px' }} />
                  ) : (
                    <Volume2 style={{ width: '16px', height: '16px' }} />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  style={{
                    width: '80px',
                    accentColor: '#d4af37',
                    cursor: 'pointer',
                  }}
                  title={`Lautstärke: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>
            </div>
          </div>

          {/* Fehlerhinweis */}
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(120, 53, 15, 0.4)',
                border: '1px solid #b45309',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '11px',
                color: '#fef3c7',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <Info style={{ width: '15px', height: '15px', flexShrink: 0, marginTop: '2px', color: '#f59e0b' }} />
              <div>
                <div style={{ fontWeight: 'bold' }}>MP3-Hinweis:</div>
                <div style={{ fontFamily: 'monospace', marginTop: '2px', color: '#fde68a' }}>
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Trackliste */}
          <div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#ffd992',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Music style={{ width: '14px', height: '14px', color: '#d4af37' }} />
                <span>Gespeicherte MP3-Titel ({tracks.length})</span>
              </span>
              <span style={{ fontSize: '11px', color: '#9e8c75', fontStyle: 'italic' }}>
                Klicken zum Abspielen
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                maxHeight: '180px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {tracks.map((track, idx) => {
                const isSelected = idx === currentTrackIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(idx)}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(90deg, #3d2514 0%, #29180d 100%)'
                        : '#1e130a',
                      border: isSelected ? '1px solid #d4af37' : '1px solid #4a301a',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-amber-400 hover:bg-[#2e1c10]"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isSelected ? (isPlaying ? '#d4af37' : '#85581c') : '#2a1a0f',
                          color: isSelected && isPlaying ? '#1a0f07' : '#ffd992',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 'bold',
                        }}
                      >
                        {isSelected && isPlaying ? (
                          <Pause style={{ width: '12px', height: '12px' }} />
                        ) : (
                          <Play style={{ width: '12px', height: '12px', marginLeft: '1px' }} />
                        )}
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            color: isSelected ? '#ffd992' : '#e8d7be',
                          }}
                        >
                          {track.title}
                        </div>
                        <div
                          style={{
                            fontSize: '10px',
                            color: '#9e8c75',
                            fontFamily: 'monospace',
                          }}
                        >
                          {track.url}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span
                        style={{
                          fontSize: '10px',
                          color: isPlaying ? '#50fa7b' : '#ffb86c',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(0,0,0,0.4)',
                        }}
                      >
                        {isPlaying ? 'AKTIV ▶' : 'GELADEN'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fußzeile */}
        <div
          style={{
            background: '#1a1008',
            borderTop: '1px solid #4a301a',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#a18b70',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles style={{ width: '13px', height: '13px', color: '#d4af37' }} />
            <span>Musik läuft beim Schließen im Hintergrund weiter.</span>
          </span>

          <button
            onClick={onClose}
            style={{
              background: '#331f10',
              border: '1px solid #d4af37',
              color: '#ffd992',
              borderRadius: '6px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
            className="hover:scale-105 active:scale-95 transition-transform"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
