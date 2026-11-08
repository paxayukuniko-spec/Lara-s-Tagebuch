import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Compass,
  ArrowLeft,
  BookOpen,
  Library,
  Sparkles,
  Radio,
  Music,
  DoorClosed,
  DoorOpen,
  Scroll,
  X,
  Info,
  Package,
  Bed,
  Crosshair,
} from 'lucide-react';
import { LAYOUT_IMAGES } from '../utils/imageAssets';
import { sounds } from '../utils/soundEffects';
import { Ruhmeshalle } from './Ruhmeshalle';
import { StereoPlayerModal } from './StereoPlayerModal';
import { TtsReader } from './TtsReader';
import { stereoAudio } from '../services/stereoAudioService';

export type RaumStatus = 'aussenansicht' | 'eingangshalle' | 'ruhmeshalle' | 'bibliothek' | 'arbeitszimmer' | 'kellergewoelbe' | 'schlafgemach' | 'grosses-wohnzimmer';

export interface CroftManorProps {
  onNavigateToRuhmeshalle?: () => void;
  onOpenDiary?: (entryId?: string) => void;
  onOpenMap?: () => void;
  onBackToHome?: () => void;
}

export function CroftManor({
  onNavigateToRuhmeshalle,
  onOpenDiary,
  onOpenMap,
  onBackToHome,
}: CroftManorProps = {}) {
  // Start mit der Außenansicht von Croft Manor (croft-manor.jpg)
  const [aktuellerRaum, setAktuellerRaum] = useState<RaumStatus>('aussenansicht');

  // Zustand für Laras Stereoanlage
  const [isStereoModalOpen, setIsStereoModalOpen] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [playingTrackTitle, setPlayingTrackTitle] = useState<string>('');

  // Zustand für das geheime Bücherregal in der Bibliothek
  const [isGeheimregalOffen, setIsGeheimregalOffen] = useState<boolean>(false);

  // Zustand für das geöffnete Info-Fenster in der Bibliothek (Maske oder Schriftrolle)
  const [aktivesGeheimnisInfo, setAktivesGeheimnisInfo] = useState<'maske' | 'schriftrolle' | null>(null);

  // Zustand für das Arbeitszimmer von Lord Croft
  const [isDeskGeheimfachOffen, setIsDeskGeheimfachOffen] = useState<boolean>(false);

  // Zustand für das geöffnete Info-Fenster im Arbeitszimmer (Chronometer, Brief, Forschungsnotizen oder geheimes Tagebuch)
  const [aktivesArbeitszimmerInfo, setAktivesArbeitszimmerInfo] = useState<
    'chronometer' | 'brief' | 'forschungsnotizen' | 'geheimes-tagebuch' | null
  >(null);

  const [canPlayTts, setCanPlayTts] = useState<boolean>(false);

  const handleOpenGeheimesTagebuch = () => {
    if (arbeitszimmerAudioRef.current) {
      arbeitszimmerAudioRef.current.loop = false;
      arbeitszimmerAudioRef.current.volume = 0.05; // 5%
    }

    setCanPlayTts(false);
    setAktivesArbeitszimmerInfo('geheimes-tagebuch');

    try {
      const clickAudio = new Audio('/music/click-button.mp3');
      clickAudio.volume = 1.0;
      clickAudio.onended = () => {
        try {
          const secretAudio = new Audio('/music/tr_secret.mp3');
          secretAudio.volume = 0.9;
          secretAudio.onended = () => {
            try {
              const dadAudio = new Audio('/music/dad.mp3');
              dadAudio.volume = 1.0;
              dadAudio.onended = () => {
                setCanPlayTts(true);
              };
              dadAudio.play().catch(() => {
                setCanPlayTts(true);
              });
            } catch (_) {
              setCanPlayTts(true);
            }
          };
          secretAudio.play().catch(() => {
            setCanPlayTts(true);
          });
        } catch (_) {
          setCanPlayTts(true);
        }
      };
      clickAudio.play().catch(() => {
        setCanPlayTts(true);
      });
    } catch (e) {
      setCanPlayTts(true);
    }
  };

  const handleCloseArbeitszimmerModal = () => {
    try {
      sounds.playClick();
    } catch (_) {}
    setAktivesArbeitszimmerInfo(null);
  };

  useEffect(() => {
    if (aktuellerRaum !== 'arbeitszimmer') {
      // Room left cleanup
    }
  }, [aktuellerRaum]);

  // Handhabung für Öffnen/Schließen des Bücherregals mit Geräusch
  // Anforderung 1: GEHEIMNIS-SOUND: spiele SOFORT /music/tr_secret.mp3 ab
  const handleOpenGeheimregal = () => {
    try {
      sounds.playTrSecret();
    } catch (_) {}
    setIsGeheimregalOffen(true);
  };

  const handleCloseGeheimregal = () => {
    try {
      sounds.playSecretMechanism();
    } catch (_) {}
    setIsGeheimregalOffen(false);
    setAktivesGeheimnisInfo(null);
  };

  // Handhabung für Öffnen/Schließen des Schreibtisch-Geheimfachs mit Geräusch
  // Anforderung 1: GEHEIMNIS-SOUND: spiele SOFORT /music/tr_secret.mp3 ab
  const handleOpenDeskGeheimfach = () => {
    try {
      sounds.playTrSecret();
    } catch (_) {}
    setIsDeskGeheimfachOffen(true);
  };

  const handleCloseDeskGeheimfach = () => {
    try {
      sounds.playSecretMechanism();
    } catch (_) {}
    setIsDeskGeheimfachOffen(false);
    setAktivesArbeitszimmerInfo(null);
  };

  // Zustand für das Kellergewölbe (Expedition / Ausrüstung / Vitrine / Geheimgang)
  const [isExpeditionSachenAktiv, setIsExpeditionSachenAktiv] = useState<boolean>(false);
  const [isVitrineModalOpen, setIsVitrineModalOpen] = useState<boolean>(false);
  const [aktivesVitrineItem, setAktivesVitrineItem] = useState<'vasen' | 'muenzen' | 'bueste' | null>(null);
  const [isGeheimgangOffen, setIsGeheimgangOffen] = useState<boolean>(false);

  // Zustand für Laras Schlafgemach (Nachttisch/Pistolen, Schreibtisch/Tagebuch, Kamin/Expeditionsplanung)
  const [aktivesZimmerInfo, setAktivesZimmerInfo] = useState<
    'pistolen' | 'tagebuch' | 'expeditionsplanung' | null
  >(null);

  // Zustand für das Winston Easter-Egg im Wohnzimmer (Wein- und Spirituosenregal)
  const [isWinstonModalOpen, setIsWinstonModalOpen] = useState<boolean>(false);
  const [isWinstonAnimActive, setIsWinstonAnimActive] = useState<boolean>(false);
  const winstonAudioRef = useRef<HTMLAudioElement | null>(null);

  // Zustand für Kaminfeuer in Wohnzimmer und Schlafgemach (Flackern, An/Aus)
  const [isLivingRoomFireBurning, setIsLivingRoomFireBurning] = useState<boolean>(true);
  const [isBedroomFireBurning, setIsBedroomFireBurning] = useState<boolean>(true);

  // Zustand für das Atlantis-Tagebuch im Wohnzimmer (Buch-Hotspot)
  const [isLivingRoomBookOpen, setIsLivingRoomBookOpen] = useState<boolean>(false);
  const [previousKaminVolume, setPreviousKaminVolume] = useState<number>(0.6);
  const atlantisAudioRef = useRef<HTMLAudioElement | null>(null);

  // Zustand für das animierte Veo Kaminfeuer-Video im Wohnzimmer
  const [fireplaceVideoUrl, setFireplaceVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState<string>('');

  const handleGenerateVeoVideo = async () => {
    if (isGeneratingVideo) return;
    try {
      setIsGeneratingVideo(true);
      setVideoStatusMessage('Starte Veo Video-Generierung für das Kaminfeuer...');
      
      const res = await fetch('/api/generate-fireplace-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok || !data.operationName) {
        throw new Error(data.error || 'Fehler beim Starten der Videogenerierung.');
      }
      
      const operationName = data.operationName;
      setVideoStatusMessage('Veo animiert das Kaminfeuer als nahtloses 16:9 Loop-Video (dies kann 1-2 Minuten dauern)...');

      const maxAttempts = 40;
      let attempts = 0;
      let done = false;

      while (!done && attempts < maxAttempts) {
        attempts++;
        await new Promise((r) => setTimeout(r, 5000));
        
        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });
        const statusData = await statusRes.json();
        if (statusData.error) {
          throw new Error(statusData.error.message || 'Fehler bei der Veo Videogenerierung.');
        }
        if (statusData.done) {
          done = true;
        } else {
          setVideoStatusMessage(`Veo verarbeitet das Kaminfeuer (Versuch ${attempts}/${maxAttempts})...`);
        }
      }

      if (!done) {
        throw new Error('Zeitüberschreitung bei der Veo Videogenerierung.');
      }

      setVideoStatusMessage('Lade das finale Veo Loop-Video herunter...');
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        throw new Error('Fehler beim Herunterladen des Veo Videos.');
      }

      const videoBlob = await downloadRes.blob();
      const videoUrl = URL.createObjectURL(videoBlob);
      setFireplaceVideoUrl(videoUrl);
      setIsGeneratingVideo(false);
      setVideoStatusMessage('');
      try { sounds.playTrSecret(); } catch (_) {}
    } catch (err: any) {
      console.error(err);
      setIsGeneratingVideo(false);
      setVideoStatusMessage(`Fehler: ${err.message || 'Generierung fehlgeschlagen'}`);
    }
  };

  const handleOpenLivingRoomBook = () => {
    try {
      sounds.playPageTurn();
    } catch (_) {}
    const currentVol = stereoAudio.getKaminfeuerVolume();
    setPreviousKaminVolume(currentVol);
    // Dim kamin-feuer.mp3 volume by 50%
    stereoAudio.setKaminfeuerVolume(currentVol * 0.5);

    if (!atlantisAudioRef.current) {
      atlantisAudioRef.current = new Audio('/music/atlantis-tagebuch.mp3');
    }
    const audio = atlantisAudioRef.current;
    audio.volume = 1.0;
    audio.currentTime = 0;
    audio.onended = () => {
      stereoAudio.setKaminfeuerVolume(currentVol);
    };
    audio.play().catch((err) => {
      console.info('Atlantis-tagebuch autoplay note:', err);
    });

    setIsLivingRoomBookOpen(true);
  };

  const handleCloseLivingRoomBook = () => {
    try {
      sounds.playClick();
    } catch (_) {}
    if (atlantisAudioRef.current) {
      atlantisAudioRef.current.pause();
      atlantisAudioRef.current.currentTime = 0;
    }
    stereoAudio.setKaminfeuerVolume(previousKaminVolume);
    setIsLivingRoomBookOpen(false);
  };

  const handleWinstonClick = () => {
    try {
      sounds.playTrSecret();
    } catch (_) {}
    if (!winstonAudioRef.current) {
      winstonAudioRef.current = new Audio('/music/tee.mp3');
    }
    const audio = winstonAudioRef.current;
    audio.volume = 1.0;
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.info('Tee audio autoplay note:', err);
    });

    setIsWinstonModalOpen(true);
    setIsWinstonAnimActive(true);
    setTimeout(() => {
      setIsWinstonAnimActive(false);
    }, 4000);
  };

  const handleCloseWinstonModal = () => {
    try {
      sounds.playClick();
    } catch (_) {}
    if (winstonAudioRef.current) {
      winstonAudioRef.current.pause();
      winstonAudioRef.current.currentTime = 0;
    }
    setIsWinstonModalOpen(false);
  };

  // Referenz für die Eingangshallen-Hintergrundmusik (/music/track001.mp3)
  const eingangshalleAudioRef = useRef<HTMLAudioElement | null>(null);

  // AUTOMATISCHE HINTERGRUNDMUSIK FÜR DIE EINGANGSHALLE:
  // 1. Sobald der Spieler die Eingangshalle betritt (aktuellerRaum === 'eingangshalle'),
  //    soll automatisch die Musikdatei "/music/track001.mp3" abgespielt werden.
  // 2. Die Musik muss in einer Endlosschleife (loop) laufen und leise im Hintergrund eingestellt sein (Lautstärke/Volume auf ca. 0.3).
  // 3. Wenn der Spieler die Eingangshalle verlässt (z.B. ins Arbeitszimmer, ins Expeditionslager,
  //    in Laras Zimmer wechselt oder zurück zum Vorgarten geht), muss dieser Track001 SOFORT komplett stoppen.
  useEffect(() => {
    let audio = eingangshalleAudioRef.current;
    if (!audio) {
      audio = new Audio('/music/track001.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audio.preload = 'auto';
      eingangshalleAudioRef.current = audio;
    } else {
      audio.loop = true;
      audio.volume = 0.3;
    }

    let removeInteractionListener: (() => void) | null = null;

    if (aktuellerRaum === 'eingangshalle') {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.info('Eingangshalle Autoplay Hinweis:', err.message);
          const handleFirstClick = () => {
            if (audio && audio.paused && eingangshalleAudioRef.current === audio) {
              audio.play().catch(() => {});
            }
          };
          window.addEventListener('click', handleFirstClick, { once: true });
          removeInteractionListener = () => {
            window.removeEventListener('click', handleFirstClick);
          };
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      if (removeInteractionListener) {
        removeInteractionListener();
      }
      audio.pause();
      audio.currentTime = 0;
    };
  }, [aktuellerRaum]);

  // Referenz für die Kellergewölbe-Hintergrundmusik (/music/kellergewoelbe.mp3)
  const kellerAudioRef = useRef<HTMLAudioElement | null>(null);

  // Anforderung 2: KELLER-MUSIK
  // Sobald man das Expeditionslager im Kellergewölbe betritt (expedition_raum.jpg),
  // soll im Hintergrund automatisch die Datei "/music/kellergewoelbe.mp3" in einer Endlosschleife (loop) abgespielt werden.
  // Wenn man den Raum verlässt, stoppt die Musik wieder.
  useEffect(() => {
    let audio = kellerAudioRef.current;
    if (!audio) {
      audio = new Audio('/music/kellergewoelbe.mp3');
      audio.loop = true;
      audio.volume = 0.75;
      audio.preload = 'auto';
      kellerAudioRef.current = audio;
    }

    if (aktuellerRaum === 'kellergewoelbe') {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.info('Kellergewölbe Autoplay Hinweis:', err.message);
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [aktuellerRaum]);

  // Referenz für die Arbeitszimmer-Hintergrundmusik (/music/arbeitszimmer.mp3)
  const arbeitszimmerAudioRef = useRef<HTMLAudioElement | null>(null);

  // ARBEITSZIMMER-MUSIK: Spiele arbeitszimmer.mp3 beim Öffnen des Arbeitszimmers und stoppe sofort beim Verlassen.
  useEffect(() => {
    let audio = arbeitszimmerAudioRef.current;
    if (!audio) {
      audio = new Audio('/music/arbeitszimmer.mp3');
      audio.loop = true;
      audio.volume = 0.75;
      audio.preload = 'auto';
      arbeitszimmerAudioRef.current = audio;
    }

    if (aktuellerRaum === 'arbeitszimmer') {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.info('Arbeitszimmer Autoplay Hinweis:', err.message);
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [aktuellerRaum]);

  // WOHNZIMMER & SCHLAFGEMACH KAMINFEUER-AUDIO:
  useEffect(() => {
    if (
      (aktuellerRaum === 'grosses-wohnzimmer' && isLivingRoomFireBurning) ||
      (aktuellerRaum === 'schlafgemach' && isBedroomFireBurning)
    ) {
      stereoAudio.playKamin();
    } else {
      stereoAudio.stopKamin();
      if (aktuellerRaum !== 'grosses-wohnzimmer' && aktuellerRaum !== 'schlafgemach') {
        if (winstonAudioRef.current) {
          winstonAudioRef.current.pause();
          winstonAudioRef.current.currentTime = 0;
        }
        setIsWinstonModalOpen(false);
      }
    }
    return () => {
      stereoAudio.stopKamin();
    };
  }, [aktuellerRaum, isLivingRoomFireBurning, isBedroomFireBurning]);

  // Wenn der Raum gewechselt wird, Keller- und Zimmerzustände zurücksetzen
  useEffect(() => {
    if (aktuellerRaum !== 'kellergewoelbe') {
      setIsGeheimgangOffen(false);
      setIsExpeditionSachenAktiv(false);
      setIsVitrineModalOpen(false);
    }
    if (aktuellerRaum !== 'schlafgemach') {
      setAktivesZimmerInfo(null);
    }
  }, [aktuellerRaum]);

  // Handhabung für Ausrüstung einpacken / Koffer schließen
  const handlePackeAusrustungEin = () => {
    try {
      sounds.playClick();
    } catch (_) {}
    setIsExpeditionSachenAktiv(false);
  };

  // Handhabung für Öffnen des Geheimgangs im Kellergewölbe
  // Anforderung 3: Sobald man darauf klickt, spiele sofort das Secret-Geräusch "/music/tr_secret.mp3" ab und wechsle das Hintergrundbild auf "/images/geheimgang.jpg".
  const handleOpenGeheimgang = () => {
    try {
      sounds.playTrSecret();
    } catch (_) {}
    try {
      const secAudio = new Audio('/music/tr_secret.mp3');
      secAudio.volume = 0.9;
      secAudio.play().catch(() => {});
    } catch (_) {}
    setIsGeheimgangOffen(true);
    setIsExpeditionSachenAktiv(false);
  };

  // Anforderung 5: Button "Geheimgang schließen", falls man doch im Keller bleiben und das Bild wieder auf "/images/expedition_raum.jpg" zurückstellen möchte.
  const handleCloseGeheimgang = () => {
    try {
      sounds.playSecretMechanism();
    } catch (_) {}
    setIsGeheimgangOffen(false);
  };

  // Anforderung 4: Hotspot auf die Steintreppe: Bei Klick darauf ändert sich der Raum und man gelangt direkt zurück in die Eingangshalle (eingangshalle.jpg).
  const handleStairsToEingangshalle = () => {
    try {
      sounds.playClick();
    } catch (_) {}
    setIsGeheimgangOffen(false);
    setIsExpeditionSachenAktiv(false);
    setIsVitrineModalOpen(false);
    setAktuellerRaum('eingangshalle');
  };

  return (
    <>
      {/* --- RENDERING FÜR DIE RUHMESHALLE --- */}
      {aktuellerRaum === 'ruhmeshalle' && (
        <Ruhmeshalle
          onBackToManor={() => setAktuellerRaum('eingangshalle')}
          onBackToHome={onBackToHome}
          onOpenDiaryEntry={onOpenDiary}
          onOpenMap={onOpenMap}
        />
      )}

      {/* --- RENDERING FÜR DIE BIBLIOTHEK (MIT STEREOANLAGE & GEHEIMREGAL) --- */}
      {aktuellerRaum === 'bibliothek' && (
        <div
          style={{
            background: '#1a1008',
            minHeight: '85vh',
            padding: '20px',
            color: 'white',
            textAlign: 'center',
            fontFamily: 'serif',
          }}
        >
          {/* Top Header-Leiste mit Zurück-Button, Schließen-Button & Stereoanlagen-Schnellzugriff */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto 16px auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Zurück-Button zur Eingangshalle */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  handleCloseGeheimregal();
                  setAktuellerRaum('eingangshalle');
                }}
                style={{
                  background: '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <ArrowLeft style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                <span>Zurück zur Eingangshalle</span>
              </button>

              {/* 
                Anforderung 4: Wenn das Geheimfach offen ist, füge einen kleinen Button
                "Regal wieder schließen" hinzu.
              */}
              {isGeheimregalOffen && (
                <button
                  onClick={handleCloseGeheimregal}
                  style={{
                    background: 'linear-gradient(135deg, #44240e, #291508)',
                    color: '#ffd992',
                    border: '1.5px solid #d4af37',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 15px rgba(212,175,55,0.4)',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                  title="Geheimfach verbergen und Bücherregal zurückschieben"
                >
                  <DoorClosed style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                  <span>Regal wieder schließen</span>
                </button>
              )}

              {/* Schnelltaste: Laras Stereoanlage */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setIsStereoModalOpen(true);
                }}
                style={{
                  background: isMusicPlaying
                    ? 'linear-gradient(135deg, #3d2514, #26160b)'
                    : '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Laras Stereoanlage öffnen"
              >
                <Radio style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                <span>Laras Stereoanlage</span>
                {isMusicPlaying && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#50fa7b',
                      boxShadow: '0 0 8px #50fa7b',
                    }}
                    className="animate-pulse"
                  />
                )}
              </button>

              {onBackToHome && (
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    onBackToHome();
                  }}
                  style={{
                    background: '#2a1a0f',
                    color: '#bca78c',
                    border: '1px solid #7c4f24',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Home style={{ width: '14px', height: '14px' }} />
                  <span>Zur Startseite</span>
                </button>
              )}
            </div>

            <span
              style={{
                fontSize: '12px',
                color: '#d4af37',
                backgroundColor: 'rgba(36, 23, 13, 0.8)',
                border: '1px solid #663d1a',
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              {isGeheimregalOffen
                ? 'Westflügel • Geheimarchiv (Geheimfach offen)'
                : 'Westflügel • Croft Manor Bibliothek'}
            </span>
          </div>

          {/* Titel und Beschreibung */}
          <h1
            style={{
              fontFamily: 'serif',
              color: '#d4af37',
              marginBottom: '6px',
              fontSize: '2rem',
              letterSpacing: '0.05em',
            }}
          >
            {isGeheimregalOffen ? 'Das Geheime Bücherregal' : 'Die Bibliothek'}
          </h1>
          <p
            style={{
              color: '#a1927d',
              fontSize: '14px',
              marginBottom: '20px',
              fontStyle: 'italic',
            }}
          >
            {isGeheimregalOffen
              ? 'Das linke Bücherregal ist zur Seite gewichen und offenbart Laras verborgenes Archivfach.'
              : 'Lara Crofts privates Studienzimmer und historische Foliantensammlung.'}
          </p>

          {/* Bild-Container der Bibliothek */}
          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              border: '2px solid #8b6528',
            }}
          >
            {/* 
              HINTERGRUNDBILD DER ANSICHT:
              Standard: "/images/bibliothek.jpg" (Bibliothek mit Lara)
              Offenes Geheimfach: "/images/geheimfach.jpg" (Geheimes Wandarchiv ohne Lara)
            */}
            <img
              key={isGeheimregalOffen ? 'geheimfach_aktiv' : 'bibliothek_standard'}
              src={isGeheimregalOffen ? '/images/geheimfach.jpg' : '/images/bibliothek.jpg'}
              alt={isGeheimregalOffen ? 'Offenes Geheimfach von Croft Manor' : 'Bibliothek von Croft Manor'}
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (isGeheimregalOffen) {
                  e.currentTarget.src = LAYOUT_IMAGES.geheimfach || '/images/geheimfach.jpg';
                } else {
                  e.currentTarget.src = LAYOUT_IMAGES.bibliothek || '/images/bibliotek.jpg';
                }
              }}
              style={{
                width: '100%',
                display: 'block',
                filter: 'brightness(95%) contrast(105%)',
                transition: 'filter 0.3s ease',
              }}
            />

            {/* --- ZUSTAND A: NORMALES BILD (bibliothek.jpg) --- */}
            {!isGeheimregalOffen && (
              <>
                {/* 
                  UNSICHTBARER HOTSPOT AUF DEM LINKEN GROSSEN BÜCHERREGAL:
                  Anforderung 2: Platziere einen unsichtbaren Hotspot auf dem linken großen Bücherregal.
                  Anforderung 3: Sobald man auf dieses Regal klickt, wechselt das Hintergrundbild
                  der Ansicht auf das neue Bild mit dem offenen Geheimfach!
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleOpenGeheimregal}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleOpenGeheimregal();
                    }
                  }}
                  title="Linkes Bücherregal untersuchen (Klicken zum Öffnen des Geheimfachs)"
                  aria-label="Linkes Bücherregal untersuchen"
                  style={{
                    position: 'absolute',
                    top: '8%',
                    left: '2%',
                    width: '38%',
                    height: '80%',
                    cursor: 'pointer',
                    zIndex: 20,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  {/* Unsichtbar, zeigt bei Berührung (Hover) einen dezenten antiken Schimmer */}
                  <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/10 group-hover:border group-hover:border-amber-400/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                      <span className="font-semibold tracking-wide">Bücherregal untersuchen</span>
                    </div>
                  </div>
                </div>

                {/* Hotspot auf die Stereoanlage (Rechte Seite) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    setIsStereoModalOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsStereoModalOpen(true);
                    }
                  }}
                  title="Laras Stereoanlage (Klicken zum Öffnen)"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '73%',
                    width: '18%',
                    height: '24%',
                    cursor: 'pointer',
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  className="group"
                >
                  <div
                    style={{
                      backgroundColor: 'rgba(22, 13, 7, 0.88)',
                      border: '1.5px solid #d4af37',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 12px rgba(212,175,55,0.35)',
                      backdropFilter: 'blur(3px)',
                      transition: 'all 0.2s ease',
                    }}
                    className="group-hover:scale-110 group-hover:border-amber-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.7)]"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Radio style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffd992', letterSpacing: '0.03em' }}>
                        Stereoanlage
                      </span>
                    </div>
                    {isMusicPlaying ? (
                      <span style={{ fontSize: '10px', color: '#50fa7b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Läuft im Hintergrund</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#a8947b' }}>
                        Klicken zum Öffnen
                      </span>
                    )}
                  </div>
                </div>

                {/* Infobereich für die normale Bibliothek */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(18, 11, 7, 0.85)',
                    border: '1px solid #d4af37',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    backdropFilter: 'blur(6px)',
                    maxWidth: '90%',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd992', fontSize: '14px', fontWeight: 'bold' }}>
                    <BookOpen style={{ width: '18px', height: '18px', color: '#d4af37' }} />
                    <span>Privatbibliothek & Archiv</span>
                  </div>
                  <p style={{ margin: 0, color: '#e0cfba', fontSize: '13px', lineHeight: '1.4', maxWidth: '500px' }}>
                    Hier lagern seltene Bücher, Expeditionskarten und alte Manuskripte über Atlantis und vergangene Zivilisationen.
                  </p>
                  <button
                    onClick={() => {
                      try { sounds.playClick(); } catch (_) {}
                      setAktuellerRaum('eingangshalle');
                    }}
                    style={{
                      background: '#3a2412',
                      color: '#ffd992',
                      border: '1px solid #d4af37',
                      padding: '6px 18px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '4px',
                    }}
                    className="hover:scale-105 active:scale-95 transition-transform"
                  >
                    <ArrowLeft style={{ width: '14px', height: '14px' }} />
                    <span>Zurück zur Eingangshalle</span>
                  </button>
                </div>
              </>
            )}

            {/* --- ZUSTAND B: GEHEIMFACH OFFEN (bibliothek_offen.jpg) --- */}
            {isGeheimregalOffen && (
              <>
                {/* 
                  Anforderung 4: Schneller Schließen-Button direkt im oberen rechten Bereich des Bildes
                */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 30,
                  }}
                >
                  <button
                    onClick={handleCloseGeheimregal}
                    style={{
                      background: 'rgba(26, 16, 8, 0.92)',
                      color: '#ffd992',
                      border: '1.5px solid #d4af37',
                      padding: '7px 15px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(212,175,55,0.4)',
                      backdropFilter: 'blur(4px)',
                    }}
                    className="hover:scale-105 active:scale-95 transition-transform"
                    title="Regal wieder schließen"
                  >
                    <DoorClosed style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                    <span>Regal wieder schließen</span>
                  </button>
                </div>

                {/* 
                  HOTSPOT 1: GOLDENE MASKE
                  Exakt auf der goldenen Maske im linken Bereich platziert
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    try { sounds.playPageTurn(); } catch (_) {}
                    setAktivesGeheimnisInfo('maske');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setAktivesGeheimnisInfo('maske');
                    }
                  }}
                  title="Die goldene Maske der Ewigkeit untersuchen"
                  aria-label="Die goldene Maske der Ewigkeit untersuchen"
                  style={{
                    position: 'absolute',
                    top: '16%',
                    left: '6%',
                    width: '32%',
                    height: '46%',
                    cursor: 'pointer',
                    zIndex: 25,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  {/* Edler interaktiver Rahmen und pulsierender Schimmer bei Berührung */}
                  <div className="w-full h-full rounded-lg transition-all duration-300 group-hover:bg-amber-400/20 group-hover:border-2 group-hover:border-amber-400/60 flex items-center justify-center relative">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span className="font-semibold tracking-wide">Die goldene Maske der Ewigkeit</span>
                    </div>
                  </div>
                </div>

                {/* 
                  HOTSPOT 2: SCHRIFTROLLE
                  Exakt über der Schriftrolle auf /images/geheimfach.jpg platziert
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    try { sounds.playPageTurn(); } catch (_) {}
                    setAktivesGeheimnisInfo('schriftrolle');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setAktivesGeheimnisInfo('schriftrolle');
                    }
                  }}
                  title="Schriftrolle untersuchen (Klicken für Pergament-Großansicht)"
                  aria-label="Schriftrolle untersuchen"
                  style={{
                    position: 'absolute',
                    top: '46%',
                    left: '46%',
                    width: '34%',
                    height: '36%',
                    cursor: 'pointer',
                    zIndex: 25,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  {/* Edler interaktiver Rahmen und pulsierender Schimmer bei Berührung */}
                  <div className="w-full h-full rounded-lg transition-all duration-300 group-hover:bg-amber-400/20 group-hover:border-2 group-hover:border-amber-400/60 flex items-center justify-center relative">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Scroll className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span className="font-semibold tracking-wide">Schriftrolle untersuchen</span>
                    </div>
                  </div>
                </div>

                {/* Infobereich für das geöffnete Geheimfach mit Aktions-Buttons */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(18, 11, 7, 0.92)',
                    border: '1.5px solid #d4af37',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    backdropFilter: 'blur(6px)',
                    maxWidth: '92%',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.85), 0 0 15px rgba(212,175,55,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 28,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd992', fontSize: '14px', fontWeight: 'bold' }}>
                    <Sparkles style={{ width: '18px', height: '18px', color: '#d4af37' }} />
                    <span>Geheimes Wandarchiv geöffnet</span>
                  </div>
                  <p style={{ margin: 0, color: '#e0cfba', fontSize: '13px', lineHeight: '1.4', maxWidth: '560px' }}>
                    Klicke direkt im Wandarchiv auf <strong>Die goldene Maske der Ewigkeit</strong> oder die <strong>Schriftrolle</strong>.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                    {/* Direkter Button für die Maske */}
                    <button
                      onClick={() => {
                        try { sounds.playPageTurn(); } catch (_) {}
                        setAktivesGeheimnisInfo('maske');
                      }}
                      style={{
                        background: '#2b1a0e',
                        color: '#ffd992',
                        border: '1px solid #d4af37',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                    >
                      <Sparkles style={{ width: '14px', height: '14px', color: '#ffd992' }} />
                      <span>Maske ansehen</span>
                    </button>

                    {/* Direkter Button für die Schriftrolle */}
                    <button
                      onClick={() => {
                        try { sounds.playPageTurn(); } catch (_) {}
                        setAktivesGeheimnisInfo('schriftrolle');
                      }}
                      style={{
                        background: '#2b1a0e',
                        color: '#ffd992',
                        border: '1px solid #d4af37',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                    >
                      <Scroll style={{ width: '14px', height: '14px', color: '#ffd992' }} />
                      <span>Schriftrolle ansehen</span>
                    </button>

                    {/* Regal wieder schließen */}
                    <button
                      onClick={handleCloseGeheimregal}
                      style={{
                        background: 'linear-gradient(135deg, #44240e, #291508)',
                        color: '#ffd992',
                        border: '1.5px solid #d4af37',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform"
                    >
                      <DoorClosed style={{ width: '14px', height: '14px' }} />
                      <span>Regal wieder schließen</span>
                    </button>

                    <button
                      onClick={() => {
                        try { sounds.playClick(); } catch (_) {}
                        handleCloseGeheimregal();
                        setAktuellerRaum('eingangshalle');
                      }}
                      style={{
                        background: '#2a1a0f',
                        color: '#bca78c',
                        border: '1px solid #7c4f24',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ArrowLeft style={{ width: '14px', height: '14px' }} />
                      <span>Eingangshalle</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 
            INFO-FENSTER (MODAL) FÜR DIE GOLDENE MASKE & SCHRIFTROLLE:
          */}
          {aktivesGeheimnisInfo && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.82)',
                backdropFilter: 'blur(6px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
              onClick={() => {
                try { sounds.playClick(); } catch (_) {}
                setAktivesGeheimnisInfo(null);
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(145deg, #25160b, #150d06)',
                  border: '2px solid #d4af37',
                  borderRadius: '12px',
                  maxWidth: aktivesGeheimnisInfo === 'schriftrolle' ? '920px' : '560px',
                  width: '100%',
                  color: '#e7d8c5',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.35)',
                  padding: aktivesGeheimnisInfo === 'schriftrolle' ? '20px' : '24px',
                  position: 'relative',
                  textAlign: 'left',
                  maxHeight: '92vh',
                  overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Schließen-Kreuz oben rechts */}
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    setAktivesGeheimnisInfo(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(42, 26, 15, 0.85)',
                    border: '1px solid #7c4f24',
                    color: '#ffd992',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                  className="hover:scale-110 active:scale-95 transition-transform hover:border-amber-300"
                  title="Schließen"
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>

                {/* MODAL-INHALT: DIE GOLDENE MASKE DER EWIGKEIT */}
                {aktivesGeheimnisInfo === 'maske' && (
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <Sparkles style={{ width: '22px', height: '22px', color: '#d4af37' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#d4af37',
                          fontWeight: 'bold',
                        }}
                      >
                        Croft Manor Archiv • Relikt der Ahnen
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'serif',
                        color: '#ffd992',
                        fontSize: '1.7rem',
                        margin: '0 0 16px 0',
                        lineHeight: '1.2',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      Die goldene Maske der Ewigkeit
                    </h2>

                    {/* Bild des Relikts */}
                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #8b6528',
                        marginBottom: '16px',
                        backgroundColor: '#120a04',
                        display: 'flex',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                        padding: '6px',
                      }}
                    >
                      <img
                        src="/images/goldene-maske.jpg"
                        alt="Die goldene Maske der Ewigkeit"
                        onError={(e) => {
                          e.currentTarget.src = LAYOUT_IMAGES.goldeneMaske || '/images/goldene-maske.jpg';
                        }}
                        style={{
                          maxHeight: '230px',
                          width: '100%',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    </div>

                    {/* Kurzer mystischer Text über ihre Herkunft */}
                    <div
                      style={{
                        backgroundColor: 'rgba(32, 20, 11, 0.75)',
                        borderLeft: '3px solid #d4af37',
                        padding: '14px 18px',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '20px',
                        fontSize: '13.5px',
                        lineHeight: '1.65',
                        color: '#ded3c3',
                      }}
                    >
                      <p style={{ margin: '0 0 10px 0' }}>
                        Geschmiedet in den Feuern eines versunkenen Zeitalters, lange bevor die ersten menschlichen Reiche entstanden. Uralte Überlieferungen berichten, dass diese Totenmaske den Geist ihres Trägers vor dem Verfall der Äonen bewahrt und die astrale Lebensessenz der unsterblichen Herrscher von Atlantis in sich bindet.
                      </p>
                      <p style={{ margin: 0 }}>
                        Ihr ungetrübtes, kosmisches Goldglühen überdauerte Jahrtausende des Vergessens tief im eisigen Permafrost des Nordens. Lara Croft barg das Artefakt während einer entlegenen Expedition und schützt es seither im verborgenen Wandtresor ihrer Privatbibliothek.
                      </p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <TtsReader
                        title="Die goldene Maske der Ewigkeit"
                        text="Geschmiedet in den Feuern eines versunkenen Zeitalters, lange bevor die ersten menschlichen Reiche entstanden. Uralte Überlieferungen berichten, dass diese Totenmaske den Geist ihres Trägers vor dem Verfall der Äonen bewahrt und die astrale Lebensessenz der unsterblichen Herrscher von Atlantis in sich bindet. Ihr ungetrübtes, kosmisches Goldglühen überdauerte Jahrtausende des Vergessens tief im eisigen Permafrost des Nordens. Lara Croft barg das Artefakt während einer entlegenen Expedition und schützt es seither im verborgenen Wandtresor ihrer Privatbibliothek."
                        autoPlay={true}
                      />
                    </div>

                    {/* Schließen Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          try { sounds.playClick(); } catch (_) {}
                          setAktivesGeheimnisInfo(null);
                        }}
                        style={{
                          background: '#3a2412',
                          color: '#ffd992',
                          border: '1px solid #d4af37',
                          padding: '8px 24px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                        className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                )}

                {/* 
                  MODAL-INHALT: SCHRIFTROLLE (PERGAMENTROLLE)
                  Anforderung: Großes Info-Fenster, das AUSSCHLIESSLICH das Bild "/images/pergament_rolle.jpg"
                  im edlen Rahmen anzeigt, OHNE zusätzlichen Beschreibungstext, mit Schließen-Button.
                */}
                {aktivesGeheimnisInfo === 'schriftrolle' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Edler Rahmen für das hochauflösende Detailbild der Pergamentrolle */}
                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '3px solid #d4af37',
                        backgroundColor: '#0c0703',
                        boxShadow: 'inset 0 0 25px rgba(0,0,0,0.85), 0 8px 30px rgba(0,0,0,0.9), 0 0 22px rgba(212,175,55,0.35)',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '6px',
                      }}
                    >
                      <img
                        src="/images/pergament_rolle.jpg"
                        alt="Pergamentrolle - Geheimnis der Ahnen"
                        onError={(e) => {
                          e.currentTarget.src = LAYOUT_IMAGES.pergamentRolle || '/images/pergament_rolle.jpg';
                        }}
                        style={{
                          width: '100%',
                          maxHeight: '76vh',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    {/* Schließen Button */}
                    <div style={{ width: '100%', marginTop: '14px', marginBottom: '8px' }}>
                      <TtsReader
                        title="Pergamentrolle"
                        text="Eine antike, vergilbte Pergamentrolle aus dem verbotenen Archiv der Bibliothek von Croft Manor. Sie enthält mystische Aufzeichnungen und Wegbeschreibungen zu vergessenen Tempeln."
                        autoPlay={true}
                      />
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          try { sounds.playClick(); } catch (_) {}
                          setAktivesGeheimnisInfo(null);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #44240e, #291508)',
                          color: '#ffd992',
                          border: '1.5px solid #d4af37',
                          padding: '9px 36px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          letterSpacing: '0.04em',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.7), 0 0 12px rgba(212,175,55,0.3)',
                        }}
                        className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- RENDERING FÜR DAS ARBEITSZIMMER (LORD CROFTS ARBEITSZIMMER & SCHREIBTISCH) --- */}
      {aktuellerRaum === 'arbeitszimmer' && (
        <div
          style={{
            background: '#1a1008',
            minHeight: '85vh',
            padding: '20px',
            color: 'white',
            textAlign: 'center',
            fontFamily: 'serif',
          }}
        >
          {/* Top Header-Leiste mit Zurück-Button, Schließen-Button & Stereoanlagen-Schnellzugriff */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto 16px auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Zurück-Button zur Eingangshalle */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  handleCloseDeskGeheimfach();
                  setAktuellerRaum('eingangshalle');
                }}
                style={{
                  background: '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <ArrowLeft style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                <span>Zurück zur Eingangshalle</span>
              </button>

              {/* 
                Anforderung 4: Wenn das Bild "/images/schreibtisch_geheimfach.jpg" aktiv ist,
                füge einen Button "Schreibtisch schließen" hinzu, der das Bild wieder auf
                "/images/schreibtisch.jpg" zurückstellt.
              */}
              {isDeskGeheimfachOffen && (
                <button
                  onClick={handleCloseDeskGeheimfach}
                  style={{
                    background: 'linear-gradient(135deg, #44240e, #291508)',
                    color: '#ffd992',
                    border: '1.5px solid #d4af37',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 15px rgba(212,175,55,0.4)',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                  title="Geheimfach verbergen und Schreibtisch schließen"
                >
                  <DoorClosed style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                  <span>Schreibtisch schließen</span>
                </button>
              )}

              {/* Schnelltaste: Laras Stereoanlage */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setIsStereoModalOpen(true);
                }}
                style={{
                  background: isMusicPlaying
                    ? 'linear-gradient(135deg, #3d2514, #26160b)'
                    : '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Laras Stereoanlage öffnen"
              >
                <Radio style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                <span>Laras Stereoanlage</span>
                {isMusicPlaying && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#50fa7b',
                      boxShadow: '0 0 8px #50fa7b',
                    }}
                    className="animate-pulse"
                  />
                )}
              </button>

              {onBackToHome && (
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    onBackToHome();
                  }}
                  style={{
                    background: '#2a1a0f',
                    color: '#bca78c',
                    border: '1px solid #7c4f24',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Home style={{ width: '14px', height: '14px' }} />
                  <span>Zur Startseite</span>
                </button>
              )}
            </div>

            <span
              style={{
                fontSize: '12px',
                color: '#d4af37',
                backgroundColor: 'rgba(36, 23, 13, 0.8)',
                border: '1px solid #663d1a',
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              {isDeskGeheimfachOffen
                ? 'Ostflügel • Arbeitszimmer (Geheimfach geöffnet)'
                : 'Ostflügel • Arbeitszimmer von Lord Croft'}
            </span>
          </div>

          {/* Titel und Beschreibung */}
          <h1
            style={{
              fontFamily: 'serif',
              color: '#d4af37',
              marginBottom: '6px',
              fontSize: '2rem',
              letterSpacing: '0.05em',
            }}
          >
            {isDeskGeheimfachOffen ? 'Das Geheimfach im Schreibtisch' : 'Das Arbeitszimmer von Lord Croft'}
          </h1>
          <p
            style={{
              color: '#a1927d',
              fontSize: '14px',
              marginBottom: '20px',
              fontStyle: 'italic',
            }}
          >
            {isDeskGeheimfachOffen
              ? 'Die verborgene Schublade ist aufgesprungen und enthüllt persönliche Relikte von Laras Vater.'
              : 'Der alte Schreibtisch von Lord Henshingly Richard Croft. Hier plante er seine letzten Wüstenexpeditionen.'}
          </p>

          {/* Bild-Container des Arbeitszimmers */}
          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              border: '2px solid #8b6528',
            }}
          >
            {/* 
              HINTERGRUNDBILD DES ARBEITSZIMMERS:
              Standard: "/images/schreibtisch.jpg"
              Offenes Geheimfach: "/images/schreibtisch_geheimfach.jpg"
            */}
            <img
              key={isDeskGeheimfachOffen ? 'desk_geheimfach_aktiv' : 'desk_standard'}
              src={isDeskGeheimfachOffen ? '/images/schreibtisch_geheimfach.jpg' : '/images/schreibtisch.jpg'}
              alt={isDeskGeheimfachOffen ? 'Offenes Geheimfach am Schreibtisch von Lord Croft' : 'Arbeitszimmer und Schreibtisch von Lord Croft'}
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (isDeskGeheimfachOffen) {
                  e.currentTarget.src = LAYOUT_IMAGES.schreibtischGeheimfach || '/images/schreibtisch_geheimfach.jpg';
                } else {
                  e.currentTarget.src = LAYOUT_IMAGES.schreibtisch || '/images/schreibtisch.jpg';
                }
              }}
              style={{
                width: '100%',
                display: 'block',
                filter: 'brightness(95%) contrast(105%)',
                transition: 'filter 0.3s ease',
              }}
            />

            {/* --- ZUSTAND A: NORMALES BILD (schreibtisch.jpg) --- */}
            {!isDeskGeheimfachOffen && (
              <>
                {/* 
                  Anforderung 2: Platziere auf dem Bild "/images/schreibtisch.jpg" einen unsichtbaren
                  Klick-Hotspot auf die linke untere Seite des Schreibtischs (wo sich das Geheimfach befindet).
                  Anforderung 3: Wenn man auf diesen Bereich klickt, soll das Hintergrundbild sofort
                  auf "/images/schreibtisch_geheimfach.jpg" wechseln.
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleOpenDeskGeheimfach}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleOpenDeskGeheimfach();
                    }
                  }}
                  title="Linke untere Seite des Schreibtischs untersuchen (Geheimfach öffnen)"
                  aria-label="Linke untere Seite des Schreibtischs untersuchen"
                  style={{
                    position: 'absolute',
                    top: '40%',
                    left: '15%',
                    width: '24%',
                    height: '38%',
                    cursor: 'pointer',
                    zIndex: 20,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  {/* Unsichtbar, zeigt bei Berührung einen dezenten antiken Schimmer */}
                  <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/10 group-hover:border group-hover:border-amber-400/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                      <span className="font-semibold tracking-wide">Geheimfach untersuchen</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Koffer unten rechts im Arbeitszimmer: Öffnet geheimes-tagebuch.jpg und spielt sofort dad.mp3 ab */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleOpenGeheimesTagebuch}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpenGeheimesTagebuch();
                }
              }}
              title="Koffer unten rechts untersuchen (Geheimes Tagebuch öffnen)"
              aria-label="Koffer unten rechts untersuchen"
              style={{
                position: 'absolute',
                top: '60%',
                left: '72%',
                width: '26%',
                height: '38%',
                cursor: 'pointer',
                zIndex: 22,
                background: 'transparent',
              }}
              className="group focus:outline-none"
            >
              <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/15 group-hover:border group-hover:border-amber-400/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                <div className="bg-[#1a1008]/95 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform z-30">
                  <BookOpen className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="font-semibold tracking-wide">Geheimes Tagebuch im Koffer öffnen</span>
                </div>
              </div>
            </div>

            {/* --- ZUSTAND B: OFFENES GEHEIMFACH (schreibtisch_geheimfach.jpg) --- */}
            {isDeskGeheimfachOffen && (
              <>
                {/* 
                  Anforderung 5: Erstelle auf dem offenen Geheimfach ("/images/schreibtisch_geheimfach.jpg")
                  drei klickbare Hotspots für die Fundstücke:
                  1. Die Taschenuhr/Kompass: Öffnet ein Info-Fenster mit dem Titel "Lord Crofts Chronometer"
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    try { sounds.playPageTurn(); } catch (_) {}
                    setAktivesArbeitszimmerInfo('chronometer');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setAktivesArbeitszimmerInfo('chronometer');
                    }
                  }}
                  title="Lord Crofts Chronometer (Klicken zum Untersuchen)"
                  aria-label="Lord Crofts Chronometer untersuchen"
                  style={{
                    position: 'absolute',
                    top: '51%',
                    left: '18.5%',
                    width: '8.5%',
                    height: '13%',
                    cursor: 'pointer',
                    zIndex: 25,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  <div className="w-full h-full rounded-full transition-all duration-300 group-hover:bg-amber-400/25 group-hover:border-2 group-hover:border-amber-400/70 flex items-center justify-center relative">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3 py-1 rounded-full shadow-2xl flex items-center gap-1.5 backdrop-blur-sm pointer-events-none transform -translate-y-2 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-30">
                      <Compass className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span className="font-semibold">Lord Crofts Chronometer</span>
                    </div>
                  </div>
                </div>

                {/* 
                  2. Der versiegelte Brief: Öffnet ein Info-Fenster mit dem Titel "Ein ungeöffneter Brief aus Kairo"
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    try { sounds.playPageTurn(); } catch (_) {}
                    setAktivesArbeitszimmerInfo('brief');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setAktivesArbeitszimmerInfo('brief');
                    }
                  }}
                  title="Ein ungeöffneter Brief aus Kairo (Klicken zum Untersuchen)"
                  aria-label="Ein ungeöffneter Brief aus Kairo untersuchen"
                  style={{
                    position: 'absolute',
                    top: '46%',
                    left: '25.5%',
                    width: '12%',
                    height: '16.5%',
                    cursor: 'pointer',
                    zIndex: 25,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  <div className="w-full h-full rounded-lg transition-all duration-300 group-hover:bg-amber-400/25 group-hover:border-2 group-hover:border-amber-400/70 flex items-center justify-center relative">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3 py-1 rounded-full shadow-2xl flex items-center gap-1.5 backdrop-blur-sm pointer-events-none transform -translate-y-2 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-30">
                      <Scroll className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span className="font-semibold">Ein ungeöffneter Brief aus Kairo</span>
                    </div>
                  </div>
                </div>

                {/* 
                  3. Das Skarabäus-Notizbuch: Öffnet ein Info-Fenster mit dem Titel "Forschungsnotizen: Das Grab des Seth"
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    try { sounds.playPageTurn(); } catch (_) {}
                    setAktivesArbeitszimmerInfo('forschungsnotizen');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setAktivesArbeitszimmerInfo('forschungsnotizen');
                    }
                  }}
                  title="Forschungsnotizen: Das Grab des Seth (Klicken zum Untersuchen)"
                  aria-label="Forschungsnotizen: Das Grab des Seth untersuchen"
                  style={{
                    position: 'absolute',
                    top: '64.5%',
                    left: '21%',
                    width: '16%',
                    height: '14%',
                    cursor: 'pointer',
                    zIndex: 25,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  <div className="w-full h-full rounded-lg transition-all duration-300 group-hover:bg-amber-400/25 group-hover:border-2 group-hover:border-amber-400/70 flex items-center justify-center relative">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3 py-1 rounded-full shadow-2xl flex items-center gap-1.5 backdrop-blur-sm pointer-events-none transform -translate-y-2 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-30">
                      <BookOpen className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span className="font-semibold">Forschungsnotizen: Das Grab des Seth</span>
                    </div>
                  </div>
                </div>

                {/* Infobereich für das geöffnete Schreibtisch-Geheimfach mit Aktions-Buttons */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(18, 11, 7, 0.92)',
                    border: '1.5px solid #d4af37',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    backdropFilter: 'blur(6px)',
                    maxWidth: '94%',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.85), 0 0 15px rgba(212,175,55,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 28,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd992', fontSize: '14px', fontWeight: 'bold' }}>
                    <Sparkles style={{ width: '18px', height: '18px', color: '#d4af37' }} />
                    <span>Geheimfach des Schreibtischs geöffnet</span>
                  </div>
                  <p style={{ margin: 0, color: '#e0cfba', fontSize: '13px', lineHeight: '1.4', maxWidth: '640px' }}>
                    Wähle ein Fundstück im Geheimfach oder nutze die Schaltflächen:
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                    {/* Button: Chronometer */}
                    <button
                      onClick={() => {
                        try { sounds.playPageTurn(); } catch (_) {}
                        setAktivesArbeitszimmerInfo('chronometer');
                      }}
                      style={{
                        background: '#2b1a0e',
                        color: '#ffd992',
                        border: '1px solid #d4af37',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                    >
                      <Compass style={{ width: '14px', height: '14px', color: '#ffd992' }} />
                      <span>Lord Crofts Chronometer</span>
                    </button>

                    {/* Button: Brief */}
                    <button
                      onClick={() => {
                        try { sounds.playPageTurn(); } catch (_) {}
                        setAktivesArbeitszimmerInfo('brief');
                      }}
                      style={{
                        background: '#2b1a0e',
                        color: '#ffd992',
                        border: '1px solid #d4af37',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                    >
                      <Scroll style={{ width: '14px', height: '14px', color: '#ffd992' }} />
                      <span>Brief aus Kairo</span>
                    </button>

                    {/* Button: Notizbuch */}
                    <button
                      onClick={() => {
                        try { sounds.playPageTurn(); } catch (_) {}
                        setAktivesArbeitszimmerInfo('forschungsnotizen');
                      }}
                      style={{
                        background: '#2b1a0e',
                        color: '#ffd992',
                        border: '1px solid #d4af37',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                    >
                      <BookOpen style={{ width: '14px', height: '14px', color: '#ffd992' }} />
                      <span>Forschungsnotizen</span>
                    </button>

                    {/* Anforderung 4: Schreibtisch schließen Button */}
                    <button
                      onClick={handleCloseDeskGeheimfach}
                      style={{
                        background: 'linear-gradient(135deg, #44240e, #291508)',
                        color: '#ffd992',
                        border: '1.5px solid #d4af37',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform"
                    >
                      <DoorClosed style={{ width: '14px', height: '14px' }} />
                      <span>Schreibtisch schließen</span>
                    </button>

                    <button
                      onClick={() => {
                        try { sounds.playClick(); } catch (_) {}
                        handleCloseDeskGeheimfach();
                        setAktuellerRaum('eingangshalle');
                      }}
                      style={{
                        background: '#2a1a0f',
                        color: '#bca78c',
                        border: '1px solid #7c4f24',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ArrowLeft style={{ width: '14px', height: '14px' }} />
                      <span>Eingangshalle</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 
            INFO-FENSTER (MODALS) FÜR DIE 3 FUNDSTÜCKE DES ARBEITSZIMMERS:
            - Lord Crofts Chronometer
            - Ein ungeöffneter Brief aus Kairo
            - Forschungsnotizen: Das Grab des Seth
          */}
          {aktivesArbeitszimmerInfo && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.82)',
                backdropFilter: 'blur(6px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
              onClick={handleCloseArbeitszimmerModal}
            >
              <div
                style={{
                  background: 'linear-gradient(145deg, #25160b, #150d06)',
                  border: '2px solid #d4af37',
                  borderRadius: '12px',
                  maxWidth: '600px',
                  width: '100%',
                  color: '#e7d8c5',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.35)',
                  padding: '24px',
                  position: 'relative',
                  textAlign: 'left',
                  maxHeight: '92vh',
                  overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Schließen-Kreuz oben rechts */}
                <button
                  onClick={handleCloseArbeitszimmerModal}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(42, 26, 15, 0.85)',
                    border: '1px solid #7c4f24',
                    color: '#ffd992',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                  className="hover:scale-110 active:scale-95 transition-transform hover:border-amber-300"
                  title="Schließen"
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>

                {/* MODAL 1: LORD CROFTS CHRONOMETER */}
                {aktivesArbeitszimmerInfo === 'chronometer' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <Compass style={{ width: '22px', height: '22px', color: '#d4af37' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#d4af37',
                          fontWeight: 'bold',
                        }}
                      >
                        Lord Crofts Geheimfach • Zeitmesser & Kompass
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'serif',
                        color: '#ffd992',
                        fontSize: '1.7rem',
                        margin: '0 0 16px 0',
                        lineHeight: '1.2',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      Lord Crofts Chronometer
                    </h2>

                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #8b6528',
                        marginBottom: '16px',
                        backgroundColor: '#120a04',
                        display: 'flex',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                        padding: '6px',
                      }}
                    >
                      <img
                        src="/images/lord_croft_chronometer.jpg"
                        alt="Lord Crofts Chronometer"
                        onError={(e) => {
                          e.currentTarget.src = LAYOUT_IMAGES.lordCroftChronometer || '/images/lord_croft_chronometer.jpg';
                        }}
                        style={{
                          maxHeight: '220px',
                          width: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(32, 20, 11, 0.75)',
                        borderLeft: '3px solid #d4af37',
                        padding: '14px 18px',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '20px',
                        fontSize: '13.5px',
                        lineHeight: '1.65',
                        color: '#ded3c3',
                      }}
                    >
                      <p style={{ margin: '0 0 10px 0' }}>
                        Ein meisterhaft gefertigtes Chronometer aus massivem, vergoldetem Messing und feinstem Saphirglas. Es vereint ein hochpräzises Schweizer Uhrwerk mit einer astronomischen Kompassrose zur Orientierung an den nächtlichen Sternenbildern der Sahara.
                      </p>
                      <p style={{ margin: '0 0 10px 0' }}>
                        Dieses Instrument begleitete Laras Vater Richard Croft auf jeder seiner gewagten archäologischen Expeditionen. Auf dem aufklappbaren Innendeckel hat er in feiner Kursivschrift eine persönliche Widmung eingravieren lassen:
                      </p>
                      <p style={{ margin: 0, fontStyle: 'italic', color: '#ffd992' }}>
                        „Für meine geliebte Lara – Möge die Zeit dir stets den wahren Pfad weisen und die Sterne deine Schritte im Dunkeln leiten. In Liebe, dein Vater.“
                      </p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <TtsReader
                        title="Lord Crofts Chronometer"
                        text="Ein meisterhaft gefertigtes Chronometer aus massivem, vergoldetem Messing und feinstem Saphirglas. Es vereint ein hochpräzises Schweizer Uhrwerk mit einer astronomischen Kompassrose zur Orientierung an den nächtlichen Sternenbildern der Sahara. Dieses Instrument begleitete Laras Vater Richard Croft auf jeder seiner gewagten archäologischen Expeditionen."
                        autoPlay={true}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          try { sounds.playClick(); } catch (_) {}
                          setAktivesArbeitszimmerInfo(null);
                        }}
                        style={{
                          background: '#3a2412',
                          color: '#ffd992',
                          border: '1px solid #d4af37',
                          padding: '8px 24px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                        className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL 2: EIN UNGEÖFFNETER BRIEF AUS KAIRO */}
                {aktivesArbeitszimmerInfo === 'brief' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <Scroll style={{ width: '22px', height: '22px', color: '#d4af37' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#d4af37',
                          fontWeight: 'bold',
                        }}
                      >
                        Lord Crofts Geheimfach • Dringende Korrespondenz
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'serif',
                        color: '#ffd992',
                        fontSize: '1.7rem',
                        margin: '0 0 16px 0',
                        lineHeight: '1.2',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      Ein ungeöffneter Brief aus Kairo
                    </h2>

                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #8b6528',
                        marginBottom: '16px',
                        backgroundColor: '#120a04',
                        display: 'flex',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                        padding: '6px',
                      }}
                    >
                      <img
                        src="/images/brief_aus_kairo.jpg"
                        alt="Ein ungeöffneter Brief aus Kairo"
                        onError={(e) => {
                          e.currentTarget.src = LAYOUT_IMAGES.briefAusKairo || '/images/brief_aus_kairo.jpg';
                        }}
                        style={{
                          maxHeight: '220px',
                          width: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(32, 20, 11, 0.75)',
                        borderLeft: '3px solid #d4af37',
                        padding: '14px 18px',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '20px',
                        fontSize: '13.5px',
                        lineHeight: '1.65',
                        color: '#ded3c3',
                      }}
                    >
                      <p style={{ margin: '0 0 10px 0' }}>
                        Ein vergilbtes Pergamentkuvert aus schwerem Büttenpapier, versiegelt mit tiefrotem Siegelwachs und dem Prägestempel eines Antiquars aus dem Khan el-Khalili in Kairo. Das Wachssiegel ist vollkommen unberührt.
                      </p>
                      <p style={{ margin: '0 0 10px 0' }}>
                        Die Poststempel weisen auf ein Eintreffen kurz vor Lord Crofts letzter schicksalhafter Reise hin. Auf der Vorderseite ist handschriftlich mit schwarzer Tusche vermerkt:
                      </p>
                      <p style={{ margin: '0 0 10px 0', fontStyle: 'italic', color: '#ffd992' }}>
                        „An Lord Henshingly Croft – Höchste Dringlichkeit! Die Ausgrabungen in Karnak haben ein Steintablett freigelegt, das den Standort des Seth-Heiligtums exakt beschreibt. Verrate niemandem deine Abreise.“
                      </p>
                      <p style={{ margin: 0 }}>
                        Aus Furcht vor Verfolgern versteckte Laras Vater den Brief im Geheimfach seines Schreibtischs, wo er über die Jahre unversehrt auf seine Entdeckung wartete.
                      </p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <TtsReader
                        title="Ein ungeöffneter Brief aus Kairo"
                        text="Ein vergilbtes Pergamentkuvert aus schwerem Büttenpapier, versiegelt mit tiefrotem Siegelwachs und dem Prägestempel eines Antiquars aus dem Khan el-Khalili in Kairo. Das Wachssiegel ist vollkommen unberührt. Die Poststempel weisen auf ein Eintreffen kurz vor Lord Crofts letzter schicksalhafter Reise hin."
                        autoPlay={true}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          try { sounds.playClick(); } catch (_) {}
                          setAktivesArbeitszimmerInfo(null);
                        }}
                        style={{
                          background: '#3a2412',
                          color: '#ffd992',
                          border: '1px solid #d4af37',
                          padding: '8px 24px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                        className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL 3: FORSCHUNGSNOTIZEN: DAS GRAB DES SETH */}
                {aktivesArbeitszimmerInfo === 'forschungsnotizen' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <BookOpen style={{ width: '22px', height: '22px', color: '#d4af37' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#d4af37',
                          fontWeight: 'bold',
                        }}
                      >
                        Lord Crofts Geheimfach • Expeditions-Feldtagebuch
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'serif',
                        color: '#ffd992',
                        fontSize: '1.7rem',
                        margin: '0 0 16px 0',
                        lineHeight: '1.2',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      Forschungsnotizen: Das Grab des Seth
                    </h2>

                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #8b6528',
                        marginBottom: '16px',
                        backgroundColor: '#120a04',
                        display: 'flex',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                        padding: '6px',
                      }}
                    >
                      <img
                        src="/images/forschungsnotizen_seth.jpg"
                        alt="Forschungsnotizen: Das Grab des Seth"
                        onError={(e) => {
                          e.currentTarget.src = LAYOUT_IMAGES.forschungsnotizenSeth || '/images/forschungsnotizen_seth.jpg';
                        }}
                        style={{
                          maxHeight: '220px',
                          width: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(32, 20, 11, 0.75)',
                        borderLeft: '3px solid #d4af37',
                        padding: '14px 18px',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '20px',
                        fontSize: '13.5px',
                        lineHeight: '1.65',
                        color: '#ded3c3',
                      }}
                    >
                      <p style={{ margin: '0 0 10px 0' }}>
                        Ein in dunkles Leder gebundenes Notizbuch mit einem kunstvoll eingeprägten Skarabäus auf dem Buchdeckel. Seine vergilbten Seiten sind dicht mit Skizzen altägyptischer Fallen, Grabkammern und Hieroglyphenübersetzungen gefüllt.
                      </p>
                      <p style={{ margin: '0 0 10px 0' }}>
                        Auf den letzten Seiten hat Lord Croft seine wichtigsten Erkenntnisse über das Grabmal des Gottes Seth zusammengefasst:
                      </p>
                      <p style={{ margin: '0 0 10px 0', fontStyle: 'italic', color: '#ffd992' }}>
                        „Wer die Grabstätte betritt, muss den geflügelten Skarabäus in die Kammer der Urzeit einsetzen. Doch Vorsicht: Das Amulett des Horus darf unter keinen Umständen vom Steinsarkophag entfernt werden, sonst wird Seth aus seinem ewigen Schlummer geweckt.“
                      </p>
                      <p style={{ margin: 0 }}>
                        Dieses Tagebuch diente Lara Croft später als entscheidender Leitfaden bei ihren eigenen Abenteuern in Ägypten.
                      </p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <TtsReader
                        title="Forschungsnotizen: Das Grab des Seth"
                        text="Ein in dunkles Leder gebundenes Notizbuch mit einem kunstvoll eingeprägten Skarabäus auf dem Buchdeckel. Seine vergilbten Seiten sind dicht mit Skizzen altägyptischer Fallen, Grabkammern und Hieroglyphenübersetzungen gefüllt."
                        autoPlay={true}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleCloseArbeitszimmerModal}
                        style={{
                          background: '#3a2412',
                          color: '#ffd992',
                          border: '1px solid #d4af37',
                          padding: '8px 24px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                        className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL: GEHEIMES TAGEBUCH */}
                {aktivesArbeitszimmerInfo === 'geheimes-tagebuch' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <BookOpen style={{ width: '22px', height: '22px', color: '#d4af37' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#d4af37',
                          fontWeight: 'bold',
                        }}
                      >
                        Lord Crofts Koffer • Geheimes Dokument
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'serif',
                        color: '#ffd992',
                        fontSize: '1.7rem',
                        margin: '0 0 16px 0',
                        lineHeight: '1.2',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      Geheimes Tagebuch von Lord Croft
                    </h2>

                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #8b6528',
                        marginBottom: '16px',
                        backgroundColor: '#120a04',
                        display: 'flex',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                        padding: '6px',
                      }}
                    >
                      <img
                        src="/images/geheimes-tagebuch.jpg"
                        alt="Geheimes Tagebuch von Lord Croft"
                        onError={(e) => {
                          e.currentTarget.src = LAYOUT_IMAGES.geheimesTagebuch || '/images/geheimes-tagebuch.jpg';
                        }}
                        style={{
                          maxHeight: '320px',
                          width: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(32, 20, 11, 0.75)',
                        borderLeft: '3px solid #d4af37',
                        padding: '14px 18px',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '20px',
                        fontSize: '13.5px',
                        lineHeight: '1.65',
                        color: '#ded3c3',
                      }}
                    >
                      <p style={{ margin: '0 0 10px 0' }}>
                        Ein im Reisekoffer verborgenes, handgeschriebenes Dokument mit vertraulichen Aufzeichnungen und persönlichen Notizen von Laras Vater.
                      </p>
                      <p style={{ margin: 0, fontStyle: 'italic', color: '#ffd992' }}>
                        „Die Reise nach Kairo und die Suche nach dem Artefakt werden mein Leben für immer verändern.“
                      </p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      {!canPlayTts && (
                        <div style={{ fontSize: '11px', color: '#ffd992', fontStyle: 'italic', marginBottom: '8px', padding: '6px 10px', backgroundColor: 'rgba(26, 15, 10, 0.9)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '6px' }}>
                          Hintergrundmusik (arbeitszimmer.mp3) auf 5%. Spiele Sound-Sequenz (click-button, tr_secret, dad.mp3) ab. Am Ende startet die Kore-Stimme...
                        </div>
                      )}
                      <TtsReader
                        title="Geheimes Tagebuch"
                        text="Ein im Reisekoffer verborgenes, handgeschriebenes Dokument mit vertraulichen Aufzeichnungen und persönlichen Notizen von Laras Vater."
                        autoPlay={canPlayTts}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleCloseArbeitszimmerModal}
                        style={{
                          background: '#3a2412',
                          color: '#ffd992',
                          border: '1px solid #d4af37',
                          padding: '8px 24px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                        className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- RENDERING FÜR DAS KELLERGEWÖLBE (EXPEDITIONSRAUM / VITRINE / AUSRÜSTUNG) --- */}
      {aktuellerRaum === 'kellergewoelbe' && (
        <div
          style={{
            background: '#1a1008',
            minHeight: '85vh',
            padding: '20px',
            color: 'white',
            textAlign: 'center',
            fontFamily: 'serif',
          }}
        >
          {/* Top Header-Leiste mit Zurück-Button, Einpacken-Button & Stereoanlage */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto 16px auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Zurück-Button zur Eingangshalle */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setIsExpeditionSachenAktiv(false);
                  setIsVitrineModalOpen(false);
                  setAktuellerRaum('eingangshalle');
                }}
                style={{
                  background: '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <ArrowLeft style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                <span>Zurück zur Eingangshalle</span>
              </button>

              {/* 
                Anforderung 4: Wenn das Bild "/images/expedition_sachen.jpg" aktiv ist,
                blende einen Button "Ausrüstung einpacken" ein. Wenn man darauf klickt,
                springt das Hintergrundbild wieder zurück auf das Standardbild "/images/expedition_raum.jpg".
              */}
              {isExpeditionSachenAktiv && !isGeheimgangOffen && (
                <button
                  onClick={handlePackeAusrustungEin}
                  style={{
                    background: 'linear-gradient(135deg, #44240e, #291508)',
                    color: '#ffd992',
                    border: '1.5px solid #d4af37',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 15px rgba(212,175,55,0.4)',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                  title="Ausrüstung wieder im Koffer verstauen"
                >
                  <Package style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                  <span>Ausrüstung einpacken</span>
                </button>
              )}

              {/* 
                Anforderung 5: Wenn der Geheimgang aktiv ist, füge einen Button "Geheimgang schließen" hinzu,
                falls man doch im Keller bleiben und das Bild wieder auf "/images/expedition_raum.jpg" zurückstellen möchte.
              */}
              {isGeheimgangOffen && (
                <button
                  onClick={handleCloseGeheimgang}
                  style={{
                    background: 'linear-gradient(135deg, #44240e, #291508)',
                    color: '#ffd992',
                    border: '1.5px solid #d4af37',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 15px rgba(212,175,55,0.4)',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                  title="Geheimgang schließen und im Kellergewölbe bleiben"
                >
                  <DoorClosed style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                  <span>Geheimgang schließen</span>
                </button>
              )}

              {/* Schnelltaste: Laras Stereoanlage */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setIsStereoModalOpen(true);
                }}
                style={{
                  background: isMusicPlaying
                    ? 'linear-gradient(135deg, #3d2514, #26160b)'
                    : '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Laras Stereoanlage öffnen"
              >
                <Radio style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                <span>Laras Stereoanlage</span>
                {isMusicPlaying && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#50fa7b',
                      boxShadow: '0 0 8px #50fa7b',
                    }}
                    className="animate-pulse"
                  />
                )}
              </button>

              {onBackToHome && (
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    onBackToHome();
                  }}
                  style={{
                    background: '#2a1a0f',
                    color: '#bca78c',
                    border: '1px solid #7c4f24',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Home style={{ width: '14px', height: '14px' }} />
                  <span>Zur Startseite</span>
                </button>
              )}
            </div>

            <span
              style={{
                fontSize: '12px',
                color: '#d4af37',
                backgroundColor: 'rgba(36, 23, 13, 0.8)',
                border: '1px solid #663d1a',
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              {isGeheimgangOffen
                ? 'Kellergewölbe • Verborgener Geheimgang zur Eingangshalle'
                : isExpeditionSachenAktiv
                ? 'Kellergewölbe • Expeditionsausrüstung (Bereitgestellt)'
                : 'Kellergewölbe • Croft Manor Expeditionslager'}
            </span>
          </div>

          {/* Titel und Beschreibung */}
          <h1
            style={{
              fontFamily: 'serif',
              color: '#d4af37',
              marginBottom: '6px',
              fontSize: '2rem',
              letterSpacing: '0.05em',
            }}
          >
            {isGeheimgangOffen
              ? 'Der verborgene Geheimgang'
              : isExpeditionSachenAktiv
              ? 'Laras Expeditionsausrüstung'
              : 'Das Kellergewölbe'}
          </h1>
          <p
            style={{
              color: '#a1927d',
              fontSize: '14px',
              marginBottom: '20px',
              fontStyle: 'italic',
            }}
          >
            {isGeheimgangOffen
              ? 'Eine geheime Wendeltreppe aus uraltem Stein windet sich hinauf zur großen Eingangshalle des Anwesens.'
              : isExpeditionSachenAktiv
              ? 'Laras doppelte Pistolen, Lederjacke und Überlebensausrüstung liegen bereit für den nächsten Einsatz.'
              : 'Laras Expeditionsdepot mit Relikt-Holzvitrine und Reisegepäck.'}
          </p>

          {/* Bild-Container des Kellergewölbes */}
          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              border: '2px solid #8b6528',
            }}
          >
            {/* 
              HINTERGRUNDBILD DES KELLERGEWÖLBES:
              Anforderung 1: Standardmäßig zeigt das Kellergewölbe das Bild "/images/expedition_raum.jpg".
              Anforderung 3: Bei Klick auf den Geheimgang wechselt das Bild sofort auf "/images/geheimgang.jpg".
              Bei Klick auf den offenen Koffer wechselt das Bild auf "/images/expedition_sachen.jpg".
            */}
            <img
              key={isGeheimgangOffen ? 'geheimgang_aktiv' : isExpeditionSachenAktiv ? 'expedition_sachen_aktiv' : 'expedition_raum_standard'}
              src={
                isGeheimgangOffen
                  ? '/images/geheimgang.jpg'
                  : isExpeditionSachenAktiv
                  ? '/images/expedition_sachen.jpg'
                  : '/images/expedition_raum.jpg'
              }
              alt={
                isGeheimgangOffen
                  ? 'Verborgener Geheimgang mit Steintreppe im Kellergewölbe'
                  : isExpeditionSachenAktiv
                  ? 'Laras Expeditionsausrüstung'
                  : 'Kellergewölbe von Croft Manor'
              }
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (isGeheimgangOffen) {
                  e.currentTarget.src = LAYOUT_IMAGES.geheimgang || '/images/geheimgang.jpg';
                } else if (isExpeditionSachenAktiv) {
                  e.currentTarget.src = LAYOUT_IMAGES.expeditionSachen || '/images/expedition_sachen.jpg';
                } else {
                  e.currentTarget.src = LAYOUT_IMAGES.expeditionRaum || '/images/expedition_raum.jpg';
                }
              }}
              style={{
                width: '100%',
                display: 'block',
                filter: 'brightness(95%) contrast(105%)',
                transition: 'filter 0.3s ease',
              }}
            />

            {/* --- ZUSTAND A: NORMALES BILD (expedition_raum.jpg) --- */}
            {!isExpeditionSachenAktiv && !isGeheimgangOffen && (
              <>
                {/* 
                  Anforderung 2: Platziere auf diesem Bild einen unsichtbaren Klick-Hotspot auf die
                  große Holzvitrine auf der linken Seite. Wenn man darauf klickt, öffnet sich ein
                  großes Info-Fenster (Modal), das das Detailbild "/images/vitrine.jpg" in voller
                  Pracht anzeigt. Füge einen "Schließen"-Button hinzu.
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    try { sounds.playPageTurn(); } catch (_) {}
                    setIsVitrineModalOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsVitrineModalOpen(true);
                    }
                  }}
                  title="Große Holzvitrine untersuchen (Klicken für Detailansicht)"
                  aria-label="Große Holzvitrine untersuchen"
                  style={{
                    position: 'absolute',
                    top: '5%',
                    left: '1.5%',
                    width: '34%',
                    height: '86%',
                    cursor: 'pointer',
                    zIndex: 20,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/10 group-hover:border group-hover:border-amber-400/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                      <span className="font-semibold tracking-wide">Große Holzvitrine untersuchen</span>
                    </div>
                  </div>
                </div>

                {/* 
                  Anforderung 2: Platziere einen unsichtbaren Klick-Hotspot im Hintergrund des Raumes (wo sich der Geheimgang verbirgt).
                  Anforderung 3: Sobald man darauf klickt, spiele sofort das Secret-Geräusch "/music/tr_secret.mp3" ab und wechsle das Hintergrundbild auf "/images/geheimgang.jpg".
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleOpenGeheimgang}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleOpenGeheimgang();
                    }
                  }}
                  title="Verborgenen Geheimgang im Hintergrund untersuchen (Klicken zum Öffnen)"
                  aria-label="Verborgenen Geheimgang im Hintergrund untersuchen"
                  style={{
                    position: 'absolute',
                    top: '12%',
                    left: '42%',
                    width: '32%',
                    height: '36%',
                    cursor: 'pointer',
                    zIndex: 20,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/10 group-hover:border group-hover:border-amber-400/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                      <span className="font-semibold tracking-wide">Geheimgang untersuchen</span>
                    </div>
                  </div>
                </div>

                {/* 
                  Anforderung 3: Platziere auf dem Hauptbild (/images/expedition_raum.jpg) einen
                  zweiten unsichtbaren Klick-Hotspot auf den offenen Koffer. Wenn man darauf klickt,
                  wechselt das Hintergrundbild der Ansicht sofort auf "/images/expedition_sachen.jpg"
                  (wo die Pistolen und die Lederjacke auf dem Boden liegen).
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    setIsExpeditionSachenAktiv(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsExpeditionSachenAktiv(true);
                    }
                  }}
                  title="Offenen Koffer untersuchen (Klicken für Ausrüstung)"
                  aria-label="Offenen Koffer untersuchen"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '36%',
                    width: '44%',
                    height: '44%',
                    cursor: 'pointer',
                    zIndex: 20,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/10 group-hover:border group-hover:border-amber-400/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                    <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Package className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span className="font-semibold tracking-wide">Offenen Koffer untersuchen</span>
                    </div>
                  </div>
                </div>

                {/* Infobereich für das normale Kellergewölbe */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(18, 11, 7, 0.88)',
                    border: '1px solid #d4af37',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    backdropFilter: 'blur(6px)',
                    maxWidth: '92%',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 25,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd992', fontSize: '14px', fontWeight: 'bold' }}>
                    <Package style={{ width: '18px', height: '18px', color: '#d4af37' }} />
                    <span>Laras Expeditionslager & Kellergewölbe</span>
                  </div>
                  <p style={{ margin: 0, color: '#e0cfba', fontSize: '13px', lineHeight: '1.4', maxWidth: '580px' }}>
                    Untersuche die <strong>Holzvitrine</strong> links, klicke auf den <strong>offenen Koffer</strong> oder erforsche die <strong>Hintergrundmauer</strong> nach Geheimnissen.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      onClick={() => {
                        try { sounds.playPageTurn(); } catch (_) {}
                        setIsVitrineModalOpen(true);
                      }}
                      style={{
                        background: '#2b1a0e',
                        color: '#ffd992',
                        border: '1px solid #d4af37',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                    >
                      <Sparkles style={{ width: '14px', height: '14px', color: '#ffd992' }} />
                      <span>Vitrine betrachten</span>
                    </button>

                    <button
                      onClick={() => {
                        try { sounds.playClick(); } catch (_) {}
                        setIsExpeditionSachenAktiv(true);
                      }}
                      style={{
                        background: '#2b1a0e',
                        color: '#ffd992',
                        border: '1px solid #d4af37',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                    >
                      <Package style={{ width: '14px', height: '14px', color: '#ffd992' }} />
                      <span>Koffer untersuchen</span>
                    </button>

                    <button
                      onClick={() => {
                        try { sounds.playClick(); } catch (_) {}
                        setAktuellerRaum('eingangshalle');
                      }}
                      style={{
                        background: '#3a2412',
                        color: '#ffd992',
                        border: '1px solid #d4af37',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform"
                    >
                      <ArrowLeft style={{ width: '14px', height: '14px' }} />
                      <span>Zurück zur Eingangshalle</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* --- ZUSTAND B: AUSRÜSTUNG AKTIV (expedition_sachen.jpg) --- */}
            {isExpeditionSachenAktiv && !isGeheimgangOffen && (
              <>
                {/* 
                  Anforderung 4: Schwebender Button "Ausrüstung einpacken" oben rechts
                */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 30,
                  }}
                >
                  <button
                    onClick={handlePackeAusrustungEin}
                    style={{
                      background: 'rgba(26, 16, 8, 0.92)',
                      color: '#ffd992',
                      border: '1.5px solid #d4af37',
                      padding: '7px 15px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(212,175,55,0.4)',
                      backdropFilter: 'blur(4px)',
                    }}
                    className="hover:scale-105 active:scale-95 transition-transform"
                    title="Ausrüstung wieder einpacken"
                  >
                    <Package style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                    <span>Ausrüstung einpacken</span>
                  </button>
                </div>

                {/* Infobereich für die ausgebreitete Ausrüstung */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(18, 11, 7, 0.92)',
                    border: '1.5px solid #d4af37',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    backdropFilter: 'blur(6px)',
                    maxWidth: '92%',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.85), 0 0 15px rgba(212,175,55,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 28,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd992', fontSize: '14px', fontWeight: 'bold' }}>
                    <Sparkles style={{ width: '18px', height: '18px', color: '#d4af37' }} />
                    <span>Ausrüstung ausgepackt: Pistolen & Lederjacke</span>
                  </div>
                  <p style={{ margin: 0, color: '#e0cfba', fontSize: '13px', lineHeight: '1.4', maxWidth: '600px' }}>
                    Laras ikonische Doppel-Pistolen und ihre abriebfeste Lederjacke liegen bereit auf dem Steinboden.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                    {/* Anforderung 4: Button "Ausrüstung einpacken" */}
                    <button
                      onClick={handlePackeAusrustungEin}
                      style={{
                        background: 'linear-gradient(135deg, #44240e, #291508)',
                        color: '#ffd992',
                        border: '1.5px solid #d4af37',
                        padding: '7px 22px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 0 15px rgba(212,175,55,0.4)',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform"
                    >
                      <Package style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                      <span>Ausrüstung einpacken</span>
                    </button>

                    <button
                      onClick={() => {
                        try { sounds.playClick(); } catch (_) {}
                        setIsExpeditionSachenAktiv(false);
                        setAktuellerRaum('eingangshalle');
                      }}
                      style={{
                        background: '#2a1a0f',
                        color: '#bca78c',
                        border: '1px solid #7c4f24',
                        padding: '7px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ArrowLeft style={{ width: '14px', height: '14px' }} />
                      <span>Eingangshalle</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* --- ZUSTAND C: GEHEIMGANG AKTIV (geheimgang.jpg) --- */}
            {isGeheimgangOffen && (
              <>
                {/* 
                  Anforderung 5: Schwebender Button "Geheimgang schließen" oben rechts,
                  falls man doch im Keller bleiben und das Bild wieder auf "/images/expedition_raum.jpg" zurückstellen möchte.
                */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 30,
                  }}
                >
                  <button
                    onClick={handleCloseGeheimgang}
                    style={{
                      background: 'rgba(26, 16, 8, 0.92)',
                      color: '#ffd992',
                      border: '1.5px solid #d4af37',
                      padding: '7px 15px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(212,175,55,0.4)',
                      backdropFilter: 'blur(4px)',
                    }}
                    className="hover:scale-105 active:scale-95 transition-transform"
                    title="Geheimgang wieder schließen"
                  >
                    <DoorClosed style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                    <span>Geheimgang schließen</span>
                  </button>
                </div>

                {/* 
                  Anforderung 4: Wenn das Bild "/images/geheimgang.jpg" aktiv ist, füge einen Hotspot
                  auf die Steintreppe im Bild hinzu: Bei Klick darauf ändert sich der Raum und man
                  gelangt direkt zurück in die Eingangshalle (eingangshalle.jpg).
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleStairsToEingangshalle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleStairsToEingangshalle();
                    }
                  }}
                  title="Steintreppe zur Eingangshalle hinaufsteigen"
                  aria-label="Steintreppe zur Eingangshalle hinaufsteigen"
                  style={{
                    position: 'absolute',
                    top: '22%',
                    left: '16%',
                    width: '68%',
                    height: '72%',
                    cursor: 'pointer',
                    zIndex: 25,
                    background: 'transparent',
                  }}
                  className="group focus:outline-none"
                >
                  <div className="w-full h-full rounded-xl transition-all duration-300 group-hover:bg-amber-400/15 group-hover:border-2 group-hover:border-amber-400/50 flex items-center justify-center relative">
                    <div className="bg-[#1a1008]/95 border border-[#d4af37] text-[#ffd992] text-xs sm:text-sm px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-md pointer-events-none transform -translate-y-2 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                      <ArrowLeft className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span className="font-bold tracking-wide">Steintreppe zur Eingangshalle hinaufsteigen</span>
                    </div>
                  </div>
                </div>

                {/* Infobereich für den Geheimgang */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(18, 11, 7, 0.92)',
                    border: '1.5px solid #d4af37',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    backdropFilter: 'blur(6px)',
                    maxWidth: '92%',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.85), 0 0 15px rgba(212,175,55,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 28,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd992', fontSize: '14px', fontWeight: 'bold' }}>
                    <Sparkles style={{ width: '18px', height: '18px', color: '#d4af37' }} />
                    <span>Verborgener Geheimgang geöffnet</span>
                  </div>
                  <p style={{ margin: 0, color: '#e0cfba', fontSize: '13px', lineHeight: '1.4', maxWidth: '600px' }}>
                    Eine antike Steintreppe führt direkt hinauf in die Haupthalle von Croft Manor. Klicke auf die Steintreppe, um hinaufzugehen, oder schließe den Gang wieder.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                    {/* Anforderung 4: Button Steintreppe */}
                    <button
                      onClick={handleStairsToEingangshalle}
                      style={{
                        background: 'linear-gradient(135deg, #44240e, #291508)',
                        color: '#ffd992',
                        border: '1.5px solid #d4af37',
                        padding: '7px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 0 15px rgba(212,175,55,0.4)',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform"
                    >
                      <ArrowLeft style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                      <span>Zur Eingangshalle (Steintreppe)</span>
                    </button>

                    {/* Anforderung 5: Button "Geheimgang schließen" */}
                    <button
                      onClick={handleCloseGeheimgang}
                      style={{
                        background: '#2b1a0e',
                        color: '#ffd992',
                        border: '1px solid #d4af37',
                        padding: '7px 18px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                    >
                      <DoorClosed style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                      <span>Geheimgang schließen</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 
            Anforderung 2: INFO-FENSTER (MODAL) FÜR DIE GROSSE HOLZVITRINE
            Zeigt das Detailbild "/images/vitrine.jpg" in voller Pracht an mit Schließen-Button.
          */}
          {isVitrineModalOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(6px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
              onClick={() => {
                try { sounds.playClick(); } catch (_) {}
                setIsVitrineModalOpen(false);
                setAktivesVitrineItem(null);
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(145deg, #25160b, #150d06)',
                  border: '2px solid #d4af37',
                  borderRadius: '12px',
                  maxWidth: '860px',
                  width: '100%',
                  color: '#e7d8c5',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.35)',
                  padding: '24px',
                  position: 'relative',
                  textAlign: 'left',
                  maxHeight: '94vh',
                  overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Schließen-Kreuz oben rechts */}
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    setIsVitrineModalOpen(false);
                    setAktivesVitrineItem(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(42, 26, 15, 0.85)',
                    border: '1px solid #7c4f24',
                    color: '#ffd992',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 30,
                  }}
                  className="hover:scale-110 active:scale-95 transition-transform hover:border-amber-300"
                  title="Schließen"
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <Sparkles style={{ width: '22px', height: '22px', color: '#d4af37' }} />
                    <span
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#d4af37',
                        fontWeight: 'bold',
                      }}
                    >
                      Croft Manor Kellergewölbe • Reliktesammlung
                    </span>
                  </div>

                  <h2
                    style={{
                      fontFamily: 'serif',
                      color: '#ffd992',
                      fontSize: '1.7rem',
                      margin: '0 0 16px 0',
                      lineHeight: '1.2',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    Die große Holzvitrine
                  </h2>

                  {/* Großes Detailbild "/images/vitrine.jpg" in voller Pracht mit 3 Hotspots */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid #8b6528',
                      marginBottom: '16px',
                      backgroundColor: '#0c0703',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,0,0.8)',
                      lineHeight: 0,
                    }}
                  >
                    <img
                      src="/images/vitrine.jpg"
                      alt="Die große Holzvitrine mit Relikten"
                      onError={(e) => {
                        e.currentTarget.src = LAYOUT_IMAGES.vitrine || '/images/vitrine.jpg';
                      }}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        filter: 'brightness(98%) contrast(104%)',
                      }}
                    />

                    {/* 
                      HOTSPOT 1: "Antike Vasen" (auf den tönernen Vasen im Regal)
                      Titel: 🏺 Griechische Amphoren
                    */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        try { sounds.playPageTurn(); } catch (_) {}
                        setAktivesVitrineItem('vasen');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          try { sounds.playPageTurn(); } catch (_) {}
                          setAktivesVitrineItem('vasen');
                        }
                      }}
                      title="Antike Vasen untersuchen: 🏺 Griechische Amphoren"
                      aria-label="Antike Vasen untersuchen: 🏺 Griechische Amphoren"
                      style={{
                        position: 'absolute',
                        top: '21%',
                        left: '32%',
                        width: '28%',
                        height: '18%',
                        cursor: 'pointer',
                        zIndex: 20,
                        background: 'transparent',
                      }}
                      className="group focus:outline-none"
                    >
                      <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/20 group-hover:border-2 group-hover:border-amber-400/60 flex items-center justify-center relative">
                        <div className="bg-[#1a1008]/92 border border-[#d4af37] text-[#ffd992] text-xs px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform -translate-y-1 group-hover:translate-y-0 transition-all whitespace-nowrap z-30">
                          <span className="text-sm">🏺</span>
                          <span className="font-semibold tracking-wide">Griechische Amphoren</span>
                        </div>
                      </div>
                    </div>

                    {/* 
                      HOTSPOT 2: "Römische Münzen" (auf den glänzenden Münzen/Schalen)
                      Titel: 🪙 Denare des Marcus Aurelius
                    */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        try { sounds.playPageTurn(); } catch (_) {}
                        setAktivesVitrineItem('muenzen');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          try { sounds.playPageTurn(); } catch (_) {}
                          setAktivesVitrineItem('muenzen');
                        }
                      }}
                      title="Römische Münzen untersuchen: 🪙 Denare des Marcus Aurelius"
                      aria-label="Römische Münzen untersuchen: 🪙 Denare des Marcus Aurelius"
                      style={{
                        position: 'absolute',
                        top: '38%',
                        left: '56%',
                        width: '23%',
                        height: '24%',
                        cursor: 'pointer',
                        zIndex: 20,
                        background: 'transparent',
                      }}
                      className="group focus:outline-none"
                    >
                      <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/20 group-hover:border-2 group-hover:border-amber-400/60 flex items-center justify-center relative">
                        <div className="bg-[#1a1008]/92 border border-[#d4af37] text-[#ffd992] text-xs px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform -translate-y-1 group-hover:translate-y-0 transition-all whitespace-nowrap z-30">
                          <span className="text-sm">🪙</span>
                          <span className="font-semibold tracking-wide">Denare des Marcus Aurelius</span>
                        </div>
                      </div>
                    </div>

                    {/* 
                      HOTSPOT 3: "Marmor-Büste" (auf der steinernen Statue/Kopf)
                      Titel: 🗿 Büste der Athena
                    */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        try { sounds.playPageTurn(); } catch (_) {}
                        setAktivesVitrineItem('bueste');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          try { sounds.playPageTurn(); } catch (_) {}
                          setAktivesVitrineItem('bueste');
                        }
                      }}
                      title="Marmor-Büste untersuchen: 🗿 Büste der Athena"
                      aria-label="Marmor-Büste untersuchen: 🗿 Büste der Athena"
                      style={{
                        position: 'absolute',
                        top: '65%',
                        left: '26%',
                        width: '24%',
                        height: '24%',
                        cursor: 'pointer',
                        zIndex: 20,
                        background: 'transparent',
                      }}
                      className="group focus:outline-none"
                    >
                      <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/20 group-hover:border-2 group-hover:border-amber-400/60 flex items-center justify-center relative">
                        <div className="bg-[#1a1008]/92 border border-[#d4af37] text-[#ffd992] text-xs px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform -translate-y-1 group-hover:translate-y-0 transition-all whitespace-nowrap z-30">
                          <span className="text-sm">🗿</span>
                          <span className="font-semibold tracking-wide">Büste der Athena</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DETAIL-ANZEIGE FÜR DAS GEWÄHLTE FUNDSTÜCK (HOTSPOT-TEXTE) */}
                  {aktivesVitrineItem && (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(38, 24, 14, 0.95), rgba(20, 12, 7, 0.98))',
                        border: '2px solid #d4af37',
                        borderRadius: '8px',
                        padding: '16px 20px',
                        marginBottom: '18px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.8), 0 0 15px rgba(212,175,55,0.25)',
                        position: 'relative',
                      }}
                    >
                      {/* Schließen-Kreuz für das Fundstück */}
                      <button
                        onClick={() => {
                          try { sounds.playClick(); } catch (_) {}
                          setAktivesVitrineItem(null);
                        }}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(42, 26, 15, 0.85)',
                          border: '1px solid #7c4f24',
                          color: '#ffd992',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        className="hover:scale-110 active:scale-95 transition-transform hover:border-amber-300"
                        title="Fundstück schließen"
                      >
                        <X style={{ width: '14px', height: '14px' }} />
                      </button>

                      {aktivesVitrineItem === 'vasen' && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '26px' }}>🏺</span>
                            <div>
                              <h3 style={{ margin: 0, color: '#ffd992', fontFamily: 'serif', fontSize: '1.25rem' }}>
                                🏺 Griechische Amphoren
                              </h3>
                              <span style={{ fontSize: '11px', color: '#c29b38', letterSpacing: '0.05em' }}>
                                Fundort: Palast von Midas • Antikes Griechenland
                              </span>
                            </div>
                          </div>
                          <p style={{ margin: '10px 0 14px 0', color: '#f3e5d3', fontSize: '14px', lineHeight: '1.65' }}>
                            Diese gut erhaltenen Tonschiffe stammen aus einer Ausgrabung im Palast von Midas. Sie zeigen feine Malereien, die alte Legenden abbilden. Lara hat sie unbemerkt an den Wachen vorbeigeschmuggelt.
                          </p>
                        </div>
                      )}

                      {aktivesVitrineItem === 'muenzen' && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '26px' }}>🪙</span>
                            <div>
                              <h3 style={{ margin: 0, color: '#ffd992', fontFamily: 'serif', fontSize: '1.25rem' }}>
                                🪙 Denare des Marcus Aurelius
                              </h3>
                              <span style={{ fontSize: '11px', color: '#c29b38', letterSpacing: '0.05em' }}>
                                Fundort: Katakomben von Rom • Vermächtnis von Richard Croft
                              </span>
                            </div>
                          </div>
                          <p style={{ margin: '10px 0 14px 0', color: '#f3e5d3', fontSize: '14px', lineHeight: '1.65' }}>
                            Eine Sammlung seltener römischer Silbermünzen. Sie wurden tief in den Katakomben von Rom gefunden. Richard Croft war zeit seines Lebens fasziniert von der Prägung auf der Rückseite, die ein unentdecktes Aquädukt zeigt.
                          </p>
                        </div>
                      )}

                      {aktivesVitrineItem === 'bueste' && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '26px' }}>🗿</span>
                            <div>
                              <h3 style={{ margin: 0, color: '#ffd992', fontFamily: 'serif', fontSize: '1.25rem' }}>
                                🗿 Büste der Athena
                              </h3>
                              <span style={{ fontSize: '11px', color: '#c29b38', letterSpacing: '0.05em' }}>
                                Schutzgöttin der Weisheit • Ruinen Griechenlands
                              </span>
                            </div>
                          </div>
                          <p style={{ margin: '10px 0 14px 0', color: '#f3e5d3', fontSize: '14px', lineHeight: '1.65' }}>
                            Diese kunstvoll gemeißelte Marmorbüste der Göttin der Weisheit bewacht Laras private Fundstücke. Sie verweist auf die Prüfungen, die Lara in den Ruinen Griechenlands bestehen musste.
                          </p>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid rgba(212,175,55,0.2)' }}>
                        <span style={{ fontSize: '11px', color: '#a8947f' }}>Weitere Fundstücke ansehen:</span>
                        {aktivesVitrineItem !== 'vasen' && (
                          <button
                            onClick={() => {
                              try { sounds.playPageTurn(); } catch (_) {}
                              setAktivesVitrineItem('vasen');
                            }}
                            style={{
                              background: '#24140b',
                              color: '#ffd992',
                              border: '1px solid #7c4f24',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-400"
                          >
                            <span>🏺</span>
                            <span>Griechische Amphoren</span>
                          </button>
                        )}
                        {aktivesVitrineItem !== 'muenzen' && (
                          <button
                            onClick={() => {
                              try { sounds.playPageTurn(); } catch (_) {}
                              setAktivesVitrineItem('muenzen');
                            }}
                            style={{
                              background: '#24140b',
                              color: '#ffd992',
                              border: '1px solid #7c4f24',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-400"
                          >
                            <span>🪙</span>
                            <span>Denare des Marcus Aurelius</span>
                          </button>
                        )}
                        {aktivesVitrineItem !== 'bueste' && (
                          <button
                            onClick={() => {
                              try { sounds.playPageTurn(); } catch (_) {}
                              setAktivesVitrineItem('bueste');
                            }}
                            style={{
                              background: '#24140b',
                              color: '#ffd992',
                              border: '1px solid #7c4f24',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-400"
                          >
                            <span>🗿</span>
                            <span>Büste der Athena</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            try { sounds.playClick(); } catch (_) {}
                            setAktivesVitrineItem(null);
                          }}
                          style={{
                            marginLeft: 'auto',
                            background: 'transparent',
                            color: '#d4af37',
                            border: 'none',
                            textDecoration: 'underline',
                            fontSize: '11.5px',
                            cursor: 'pointer',
                          }}
                        >
                          Ansicht zurücksetzen
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fundstücke Schnellzugriff & Beschreibung */}
                  <div
                    style={{
                      backgroundColor: 'rgba(32, 20, 11, 0.75)',
                      borderLeft: '3px solid #d4af37',
                      padding: '14px 18px',
                      borderRadius: '0 6px 6px 0',
                      marginBottom: '20px',
                      fontSize: '13.5px',
                      lineHeight: '1.65',
                      color: '#ded3c3',
                    }}
                  >
                    <p style={{ margin: '0 0 10px 0' }}>
                      Diese massive, aus dunklem Mahagoni handgefertigte Vitrine hütet einige von Laras bedeutendsten archäologischen Entdeckungen. Hinter den facettierten Glasscheiben funkeln antike Schätze, ägyptische Götterstatuen und kostbare Artefakte aus vergessenen Zivilisationen.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      <span style={{ color: '#ffd992', fontWeight: 'bold', fontSize: '12px' }}>
                        Wähle einen Klick-Hotspot auf dem Bild oder nutze die Schaltflächen:
                      </span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            try { sounds.playPageTurn(); } catch (_) {}
                            setAktivesVitrineItem('vasen');
                          }}
                          style={{
                            background: aktivesVitrineItem === 'vasen' ? '#5a3512' : '#2b1a0e',
                            color: '#ffd992',
                            border: aktivesVitrineItem === 'vasen' ? '1.5px solid #ffd992' : '1px solid #d4af37',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: aktivesVitrineItem === 'vasen' ? '0 0 10px rgba(212,175,55,0.5)' : 'none',
                          }}
                          className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                        >
                          <span>🏺</span>
                          <span>Griechische Amphoren</span>
                        </button>

                        <button
                          onClick={() => {
                            try { sounds.playPageTurn(); } catch (_) {}
                            setAktivesVitrineItem('muenzen');
                          }}
                          style={{
                            background: aktivesVitrineItem === 'muenzen' ? '#5a3512' : '#2b1a0e',
                            color: '#ffd992',
                            border: aktivesVitrineItem === 'muenzen' ? '1.5px solid #ffd992' : '1px solid #d4af37',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: aktivesVitrineItem === 'muenzen' ? '0 0 10px rgba(212,175,55,0.5)' : 'none',
                          }}
                          className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                        >
                          <span>🪙</span>
                          <span>Denare des Marcus Aurelius</span>
                        </button>

                        <button
                          onClick={() => {
                            try { sounds.playPageTurn(); } catch (_) {}
                            setAktivesVitrineItem('bueste');
                          }}
                          style={{
                            background: aktivesVitrineItem === 'bueste' ? '#5a3512' : '#2b1a0e',
                            color: '#ffd992',
                            border: aktivesVitrineItem === 'bueste' ? '1.5px solid #ffd992' : '1px solid #d4af37',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: aktivesVitrineItem === 'bueste' ? '0 0 10px rgba(212,175,55,0.5)' : 'none',
                          }}
                          className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                        >
                          <span>🗿</span>
                          <span>Büste der Athena</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Schließen-Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        try { sounds.playClick(); } catch (_) {}
                        setIsVitrineModalOpen(false);
                        setAktivesVitrineItem(null);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #44240e, #291508)',
                        color: '#ffd992',
                        border: '1.5px solid #d4af37',
                        padding: '8px 26px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        letterSpacing: '0.03em',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                      }}
                      className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                    >
                      Schließen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- RENDERING FÜR LARAS SCHLAFGEMACH --- */}
      {aktuellerRaum === 'schlafgemach' && (
        <div
          style={{
            background: '#1a1008',
            minHeight: '85vh',
            padding: '20px',
            color: 'white',
            textAlign: 'center',
            fontFamily: 'serif',
          }}
        >
          {/* Top Header-Leiste mit Zurück-Button & Stereoanlagen-Schnellzugriff */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto 16px auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Zurück-Button zur Eingangshalle */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setAktivesZimmerInfo(null);
                  setAktuellerRaum('eingangshalle');
                }}
                style={{
                  background: '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Zurück zur Eingangshalle"
              >
                <ArrowLeft style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                <span>Zurück zur Eingangshalle</span>
              </button>

              {/* Schnelltaste: Laras Stereoanlage */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setIsStereoModalOpen(true);
                }}
                style={{
                  background: isMusicPlaying
                    ? 'linear-gradient(135deg, #3d2514, #26160b)'
                    : '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Laras Stereoanlage öffnen"
              >
                <Radio style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                <span>Laras Stereoanlage</span>
                {isMusicPlaying && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#50fa7b',
                      boxShadow: '0 0 8px #50fa7b',
                    }}
                    className="animate-pulse"
                  />
                )}
              </button>

              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  const nextState = !isBedroomFireBurning;
                  setIsBedroomFireBurning(nextState);
                  if (nextState) {
                    stereoAudio.playKamin();
                  } else {
                    stereoAudio.stopKamin();
                  }
                }}
                style={{
                  background: isBedroomFireBurning
                    ? 'linear-gradient(135deg, #44240e, #291508)'
                    : '#2a1a0f',
                  color: '#ffd992',
                  border: '1.5px solid #d4af37',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Kaminfeuer im Schlafzimmer an- oder ausschalten"
              >
                <span>🔥</span>
                <span>{isBedroomFireBurning ? 'Kaminfeuer an 🔥' : 'Kaminfeuer aus'}</span>
              </button>

              {onBackToHome && (
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    onBackToHome();
                  }}
                  style={{
                    background: '#2a1a0f',
                    color: '#bca78c',
                    border: '1px solid #7c4f24',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                >
                  <Home style={{ width: '14px', height: '14px' }} />
                  <span>Zur Startseite</span>
                </button>
              )}
            </div>

            <span
              style={{
                fontSize: '12px',
                color: '#d4af37',
                backgroundColor: 'rgba(36, 23, 13, 0.8)',
                border: '1px solid #663d1a',
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              Ostflügel • Laras privates Schlafgemach
            </span>
          </div>

          {/* Titel und Beschreibung */}
          <h1
            style={{
              fontFamily: 'serif',
              color: '#d4af37',
              marginBottom: '6px',
              fontSize: '2rem',
              letterSpacing: '0.05em',
            }}
          >
            Laras Schlafgemach
          </h1>
          <p
            style={{
              color: '#a1927d',
              fontSize: '14px',
              marginBottom: '20px',
              fontStyle: 'italic',
            }}
          >
            Laras privater Rückzugsort – umgeben von Expeditionskarten, Artefakten und ihren treuesten Begleitern.
          </p>

          {/* Bild-Container des Schlafgemachs */}
          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.85), 0 0 20px rgba(212,175,55,0.15)',
              border: '2px solid #8b6528',
            }}
          >
            {/* 
              Anforderung 2: Platziere oben links über dem Bild einen sauberen "Anwesen betreten"- bzw. "Zurück"-Button.
            */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 25,
              }}
            >
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setAktivesZimmerInfo(null);
                  setAktuellerRaum('eingangshalle');
                }}
                style={{
                  background: 'rgba(26, 16, 8, 0.92)',
                  color: '#ffd992',
                  border: '1.5px solid #d4af37',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(212,175,55,0.4)',
                  backdropFilter: 'blur(4px)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                title="Zurück zur Eingangshalle"
              >
                <ArrowLeft style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                <span>Zurück zur Eingangshalle</span>
              </button>
            </div>

            {/* Hintergrundbild "/images/laras_zimmer.jpg" */}
            <img
              src="/images/laras_zimmer.jpg"
              alt="Laras Schlafgemach"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = LAYOUT_IMAGES.larasZimmer || '/images/laras_zimmer.jpg';
              }}
              style={{
                width: '100%',
                display: 'block',
                filter: 'brightness(97%) contrast(104%)',
                transition: 'filter 0.3s ease',
              }}
            />

            {/* 
              HOTSPOT 1 (Der Nachttisch links im Vordergrund mit den Waffen):
              Öffnet ein Info-Fenster mit dem Titel "Ikonische Doppelpistolen"
              und einer kurzen Beschreibung über Laras treueste Begleiter.
            */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                try { sounds.playPageTurn(); } catch (_) {}
                setAktivesZimmerInfo('pistolen');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  try { sounds.playPageTurn(); } catch (_) {}
                  setAktivesZimmerInfo('pistolen');
                }
              }}
              title="Nachttisch mit Doppelpistolen untersuchen"
              aria-label="Ikonische Doppelpistolen untersuchen"
              style={{
                position: 'absolute',
                top: '55%',
                left: '2%',
                width: '30%',
                height: '42%',
                cursor: 'pointer',
                zIndex: 20,
                background: 'transparent',
              }}
              className="group focus:outline-none"
            >
              <div className="w-full h-full rounded-lg transition-all duration-300 group-hover:bg-amber-400/15 group-hover:border-2 group-hover:border-amber-400/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 relative">
                <div className="bg-[#1a1008]/92 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                  <Crosshair className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="font-semibold tracking-wide">Ikonische Doppelpistolen</span>
                </div>
              </div>
            </div>

            {/* 
              HOTSPOT 2 (Der Schreibtisch rechts mit dem aufgeschlagenen Buch):
              Öffnet ein Info-Fenster mit dem Titel "Laras privates Tagebuch".
            */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                try { sounds.playPageTurn(); } catch (_) {}
                setAktivesZimmerInfo('tagebuch');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  try { sounds.playPageTurn(); } catch (_) {}
                  setAktivesZimmerInfo('tagebuch');
                }
              }}
              title="Schreibtisch mit aufgeschlagenem Buch untersuchen"
              aria-label="Laras privates Tagebuch untersuchen"
              style={{
                position: 'absolute',
                top: '46%',
                left: '68%',
                width: '30%',
                height: '44%',
                cursor: 'pointer',
                zIndex: 20,
                background: 'transparent',
              }}
              className="group focus:outline-none"
            >
              <div className="w-full h-full rounded-lg transition-all duration-300 group-hover:bg-amber-400/15 group-hover:border-2 group-hover:border-amber-400/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 relative">
                <div className="bg-[#1a1008]/92 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                  <BookOpen className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="font-semibold tracking-wide">Laras privates Tagebuch</span>
                </div>
              </div>
            </div>

            {/* 
              HOTSPOT 3 (Der Kamin mit der großen Weltkarte darüber):
              Öffnet ein Info-Fenster mit dem Titel "Kommende Expedition: Legacy of Atlantis".
            */}
            {/* Animiertes Flackerndes Kaminfeuer im Schlafzimmer (rechts unten im Kamin unter der Weltkarte) */}
            {isBedroomFireBurning && (
              <div
                style={{
                  position: 'absolute',
                  top: '58%',
                  left: '75%',
                  width: '10%',
                  height: '16%',
                  pointerEvents: 'none',
                  zIndex: 15,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,140,0,0.9) 0%, rgba(220,60,0,0.65) 50%, transparent 80%)',
                }}
                className="animate-fire-flicker"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ember absolute" style={{ bottom: '12px', left: '30%' }} />
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-ember absolute" style={{ bottom: '10px', right: '35%', animationDelay: '0.7s' }} />
                  <div className="w-2 h-2 bg-amber-200 rounded-full animate-ember absolute" style={{ bottom: '18px', left: '50%', animationDelay: '1.2s' }} />
                </div>
              </div>
            )}

            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                try { sounds.playPageTurn(); } catch (_) {}
                setAktivesZimmerInfo('expeditionsplanung');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  try { sounds.playPageTurn(); } catch (_) {}
                  setAktivesZimmerInfo('expeditionsplanung');
                }
              }}
              title="Weltkarte über dem Kamin untersuchen (Kommende Expedition: Legacy of Atlantis)"
              aria-label="Kommende Expedition: Legacy of Atlantis untersuchen"
              style={{
                position: 'absolute',
                top: '12%',
                left: '35%',
                width: '30%',
                height: '62%',
                cursor: 'pointer',
                zIndex: 20,
                background: 'transparent',
              }}
              className="group focus:outline-none"
            >
              <div className="w-full h-full rounded-lg transition-all duration-300 group-hover:bg-amber-400/15 group-hover:border-2 group-hover:border-amber-400/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 relative">
                <div className="bg-[#1a1008]/92 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-sm pointer-events-none transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                  <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-semibold tracking-wide">Kommende Expedition: Legacy of Atlantis</span>
                </div>
              </div>
            </div>
          </div>

          {/* 
            INFO-FENSTER (MODALS) FÜR DIE DREI HOTSPOTS
          */}
          {aktivesZimmerInfo && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(6px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
              onClick={() => {
                try { sounds.playClick(); } catch (_) {}
                setAktivesZimmerInfo(null);
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(145deg, #25160b, #150d06)',
                  border: '2px solid #d4af37',
                  borderRadius: '12px',
                  maxWidth: aktivesZimmerInfo === 'expeditionsplanung' ? '680px' : '620px',
                  width: '100%',
                  color: '#e7d8c5',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.35)',
                  padding: '24px',
                  position: 'relative',
                  textAlign: 'left',
                  maxHeight: '92vh',
                  overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Schließen-Kreuz oben rechts */}
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    setAktivesZimmerInfo(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(42, 26, 15, 0.85)',
                    border: '1px solid #7c4f24',
                    color: '#ffd992',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                  className="hover:scale-110 active:scale-95 transition-transform hover:border-amber-300"
                  title="Schließen"
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>

                {/* MODAL 1: IKONISCHE DOPPELPISTOLEN */}
                {aktivesZimmerInfo === 'pistolen' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <Crosshair style={{ width: '22px', height: '22px', color: '#d4af37' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#d4af37',
                          fontWeight: 'bold',
                        }}
                      >
                        Croft Manor Schlafgemach • Laras treueste Begleiter
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'serif',
                        color: '#ffd992',
                        fontSize: '1.7rem',
                        margin: '0 0 16px 0',
                        lineHeight: '1.2',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      Ikonische Doppelpistolen
                    </h2>

                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #8b6528',
                        marginBottom: '16px',
                        backgroundColor: '#120a04',
                        display: 'flex',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                        padding: '6px',
                      }}
                    >
                      <img
                        src="/images/expedition_sachen.jpg"
                        alt="Ikonische Doppelpistolen"
                        onError={(e) => {
                          e.currentTarget.src = LAYOUT_IMAGES.expeditionSachen || '/images/expedition_sachen.jpg';
                        }}
                        style={{
                          maxHeight: '220px',
                          width: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(32, 20, 11, 0.75)',
                        borderLeft: '3px solid #d4af37',
                        padding: '14px 18px',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '20px',
                        fontSize: '13.5px',
                        lineHeight: '1.65',
                        color: '#ded3c3',
                      }}
                    >
                      <p style={{ margin: '0 0 10px 0' }}>
                        Die maßgefertigten 9mm-Doppelpistolen sind Lara Crofts unverkennbarstes Markenzeichen. Mit ihrem unverwechselbaren Klang und grenzenloser Zuverlässigkeit haben sie Lara durch die tödlichsten Katakomben, Höhlen und Tempelanlagen der Welt begleitet.
                      </p>
                      <p style={{ margin: '0 0 10px 0' }}>
                        Egal ob wilde Bestien im Verlorenen Tal, uralte Krieger im Kolosseum von Rom oder finstere Schergen von Jacqueline Natla – auf ihre zwei treuesten Gefährten kann sich die Archäologin in jeder Sekunde blind verlassen.
                      </p>
                      <p style={{ margin: 0, fontStyle: 'italic', color: '#ffd992' }}>
                        Auf dem Nachttisch neben ihrem Bett liegen die beiden Waffen stets gereinigt, geölt und griffbereit – bereit für das nächste unvorhergesehene Abenteuer.
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        onClick={() => {
                          try { sounds.playClick(); } catch (_) {}
                          setAktivesZimmerInfo(null);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #44240e, #291508)',
                          color: '#ffd992',
                          border: '1.5px solid #d4af37',
                          padding: '8px 24px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                        className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL 2: LARAS PRIVATES TAGEBUCH */}
                {aktivesZimmerInfo === 'tagebuch' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <BookOpen style={{ width: '22px', height: '22px', color: '#d4af37' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#d4af37',
                          fontWeight: 'bold',
                        }}
                      >
                        Croft Manor Schlafgemach • Persönliche Notizen
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'serif',
                        color: '#ffd992',
                        fontSize: '1.7rem',
                        margin: '0 0 16px 0',
                        lineHeight: '1.2',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      Laras privates Tagebuch
                    </h2>

                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #8b6528',
                        marginBottom: '16px',
                        backgroundColor: '#120a04',
                        display: 'flex',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                        padding: '6px',
                      }}
                    >
                      <img
                        src="/images/laras-tagebuch.jpg"
                        alt="Laras privates Tagebuch"
                        onError={(e) => {
                          e.currentTarget.src = LAYOUT_IMAGES.larasTagebuch || '/images/laras-tagebuch.jpg';
                        }}
                        style={{
                          maxHeight: '220px',
                          width: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(32, 20, 11, 0.75)',
                        borderLeft: '3px solid #d4af37',
                        padding: '14px 18px',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '20px',
                        fontSize: '13.5px',
                        lineHeight: '1.65',
                        color: '#ded3c3',
                      }}
                    >
                      <p style={{ margin: '0 0 10px 0' }}>
                        Aufgeschlagen auf dem zierlichen Schreibtisch liegt Laras persönliches Reisetagebuch. Hier dokumentiert sie die geheimsten Details ihrer Expeditionen, philosophische Gedanken über die Vergänglichkeit großer Imperien und intime Erinnerungen an ihren Vater Lord Richard Croft.
                      </p>
                      <p style={{ margin: '0 0 10px 0' }}>
                        Zwischen den vergilbten Buchseiten finden sich Skizzen antiker Schriftzeichen, kryptische Passagen aus atlantischen Schriften und persönliche Reflexionen, die sie mit niemandem sonst teilt.
                      </p>
                      <p style={{ margin: 0, fontStyle: 'italic', color: '#ffd992' }}>
                        „Manche Geheimnisse sollten für immer im Dunkeln ruhen – andere wiederum fordern uns heraus, Licht in die tiefsten Schatten der Vergangenheit zu bringen.“
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                      {onOpenDiary && (
                        <button
                          onClick={() => {
                            try { sounds.playPageTurn(); } catch (_) {}
                            setAktivesZimmerInfo(null);
                            onOpenDiary();
                          }}
                          style={{
                            background: '#2b1a0e',
                            color: '#ffd992',
                            border: '1.5px solid #d4af37',
                            padding: '8px 20px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                        >
                          <BookOpen style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                          <span>Tagebuch aufschlagen & lesen</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          try { sounds.playClick(); } catch (_) {}
                          setAktivesZimmerInfo(null);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #44240e, #291508)',
                          color: '#ffd992',
                          border: '1.5px solid #d4af37',
                          padding: '8px 24px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                        className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL 3: KOMMENDE EXPEDITION: LEGACY OF ATLANTIS */}
                {aktivesZimmerInfo === 'expeditionsplanung' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <Compass style={{ width: '22px', height: '22px', color: '#d4af37' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#d4af37',
                          fontWeight: 'bold',
                        }}
                      >
                        Croft Manor Schlafgemach • Weltkarte über dem Kamin
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'serif',
                        color: '#ffd992',
                        fontSize: '1.75rem',
                        margin: '0 0 16px 0',
                        lineHeight: '1.25',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      Kommende Expedition: Legacy of Atlantis
                    </h2>

                    {/* Ganz oben: Neues Teaser-Bild mit edlem goldenen Rahmen, sauber zentriert, unverzerrt */}
                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid #d4af37',
                        marginBottom: '18px',
                        backgroundColor: '#0c0704',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.85), 0 0 15px rgba(212,175,55,0.3)',
                        padding: '4px',
                      }}
                    >
                      <img
                        src="/images/laras_reise.jpg"
                        alt="Kommende Expedition: Legacy of Atlantis"
                        onError={(e) => {
                          e.currentTarget.src = LAYOUT_IMAGES.larasReise || '/images/laras_reise.jpg';
                        }}
                        style={{
                          objectFit: 'contain',
                          width: '100%',
                          maxHeight: '350px',
                          display: 'block',
                          margin: '0 auto',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    {/* Direkt darunter der Text zur Ankündigung */}
                    <div
                      style={{
                        backgroundColor: 'rgba(32, 20, 11, 0.75)',
                        borderLeft: '3px solid #d4af37',
                        padding: '16px 20px',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '20px',
                        fontSize: '14px',
                        lineHeight: '1.7',
                        color: '#ded3c3',
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        Die Koordinaten sind berechnet, die Ausrüstung ist verpackt. Am 12.02.2027 beginnt Laras nächste große Reise in &apos;Lara Croft: Legacy of Atlantis&apos;. Nach Jahren der Recherche hat sie neue Hinweise auf eine unentdeckte Kammer tief unter dem Ozean gefunden, die das wahre Erbe der versunkenen Zivilisation bergen soll. Das Abenteuer wartet...
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                      {onOpenMap && (
                        <button
                          onClick={() => {
                            try { sounds.playPageTurn(); } catch (_) {}
                            setAktivesZimmerInfo(null);
                            onOpenMap();
                          }}
                          style={{
                            background: '#2b1a0e',
                            color: '#ffd992',
                            border: '1.5px solid #d4af37',
                            padding: '8px 20px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          className="hover:scale-105 active:scale-95 transition-transform hover:bg-[#3d2412]"
                        >
                          <Compass style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                          <span>Interaktive Weltkarte öffnen</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          try { sounds.playClick(); } catch (_) {}
                          setAktivesZimmerInfo(null);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #44240e, #291508)',
                          color: '#ffd992',
                          border: '1.5px solid #d4af37',
                          padding: '8px 24px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                        className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- RENDERING FÜR DIE AUSSENANSICHT (STARTSEITE VON CROFT MANOR) --- */}
      {aktuellerRaum === 'aussenansicht' && (
        <div
          style={{
            background: '#1a1008',
            minHeight: '85vh',
            padding: '20px',
            color: 'white',
            textAlign: 'center',
            fontFamily: 'serif',
          }}
        >
          {/* Top Header-Leiste mit Rücksprung-Optionen & Stereoanlage */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto 14px auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {onBackToHome && (
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    onBackToHome();
                  }}
                  style={{
                    background: '#2a1a0f',
                    color: '#ffd992',
                    border: '1px solid #7c4f24',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                >
                  <Home style={{ width: '14px', height: '14px' }} />
                  <span>Zur Startseite</span>
                </button>
              )}

              {onOpenMap && (
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    onOpenMap();
                  }}
                  style={{
                    background: '#2a1a0f',
                    color: '#ffd992',
                    border: '1px solid #7c4f24',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                >
                  <Compass style={{ width: '14px', height: '14px' }} />
                  <span>Weltkarte</span>
                </button>
              )}

              {/* Schnelltaste: Laras Stereoanlage */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setIsStereoModalOpen(true);
                }}
                style={{
                  background: isMusicPlaying
                    ? 'linear-gradient(135deg, #3d2514, #26160b)'
                    : '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Laras Stereoanlage öffnen"
              >
                <Radio style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                <span>Laras Stereoanlage</span>
                {isMusicPlaying && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#50fa7b',
                      boxShadow: '0 0 8px #50fa7b',
                    }}
                    className="animate-pulse"
                  />
                )}
              </button>
            </div>

            <span
              style={{
                fontSize: '12px',
                color: '#d4af37',
                backgroundColor: 'rgba(36, 23, 13, 0.8)',
                border: '1px solid #663d1a',
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              Grafschaft Surrey • Croft Manor Anwesen
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'serif',
              color: '#d4af37',
              marginBottom: '6px',
              fontSize: '2.2rem',
              letterSpacing: '0.05em',
            }}
          >
            Croft Manor
          </h1>
          <p
            style={{
              color: '#a1927d',
              fontSize: '14.5px',
              marginBottom: '20px',
              fontStyle: 'italic',
            }}
          >
            Der historische Familiensitz der Crofts in der Grafschaft Surrey, England.
          </p>

          {/* Bild-Container Außenansicht */}
          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0,0,0,0.85), 0 0 20px rgba(212,175,55,0.15)',
              border: '2px solid #8b6528',
              cursor: 'pointer',
            }}
            onClick={() => {
              try { sounds.playClick(); } catch (_) {}
              setAktuellerRaum('eingangshalle');
            }}
            title="Klicken, um das Anwesen zu betreten"
          >
            <img
              src="/images/croft-manor.jpg"
              alt="Croft Manor - Das Anwesen der Familie Croft"
              onError={(e) => {
                e.currentTarget.src = LAYOUT_IMAGES.croftManor || '/images/croft-manor.jpg';
              }}
              style={{
                width: '100%',
                display: 'block',
                filter: 'brightness(98%) contrast(104%)',
                transition: 'transform 0.4s ease, filter 0.4s ease',
              }}
              className="hover:scale-[1.02]"
            />
          </div>

          {/* Schöner Button "Anwesen betreten" direkt unter dem Bild */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '22px auto 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              onClick={() => {
                try { sounds.playClick(); } catch (_) {}
                setAktuellerRaum('eingangshalle');
              }}
              style={{
                background: 'linear-gradient(135deg, #44240e 0%, #291508 100%)',
                color: '#ffd992',
                border: '2px solid #d4af37',
                padding: '14px 44px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '17px',
                fontWeight: 'bold',
                fontFamily: 'serif',
                letterSpacing: '0.06em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 6px 25px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.35)',
                transition: 'all 0.25s ease',
              }}
              className="hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(212,175,55,0.65)] hover:border-amber-300"
              title="Das Anwesen betreten und zur Eingangshalle gehen"
            >
              <DoorOpen style={{ width: '22px', height: '22px', color: '#ffd992' }} />
              <span>Anwesen betreten</span>
            </button>
            <p style={{ margin: 0, color: '#8f7b68', fontSize: '13px', fontStyle: 'italic' }}>
              Tritt ein durch das Hauptportal in die Eingangshalle des Croft-Anwesens
            </p>
          </div>
        </div>
      )}

      {/* --- RENDERING FÜR DIE EINGANGSHALLE --- */}
      {aktuellerRaum === 'eingangshalle' && (
        <div
          style={{
            background: '#1a1008',
            minHeight: '85vh',
            padding: '20px',
            color: 'white',
            textAlign: 'center',
            fontFamily: 'serif',
          }}
        >
          {/* Top Header-Leiste mit Rücksprung-Optionen */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto 12px auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Zurück zur Außenansicht */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setAktuellerRaum('aussenansicht');
                }}
                style={{
                  background: '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Das Anwesen verlassen und zur Außenansicht zurückkehren"
              >
                <ArrowLeft style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                <span>Nach draußen (Außenansicht)</span>
              </button>

              {onBackToHome && (
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    onBackToHome();
                  }}
                  style={{
                    background: '#2a1a0f',
                    color: '#ffd992',
                    border: '1px solid #7c4f24',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                >
                  <Home style={{ width: '14px', height: '14px' }} />
                  <span>Zur Startseite</span>
                </button>
              )}

              {onOpenMap && (
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    onOpenMap();
                  }}
                  style={{
                    background: '#2a1a0f',
                    color: '#ffd992',
                    border: '1px solid #7c4f24',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  className="hover:scale-105 active:scale-95 transition-transform"
                >
                  <Compass style={{ width: '14px', height: '14px' }} />
                  <span>Weltkarte</span>
                </button>
              )}

              {/* Schnelltaste: Laras Stereoanlage */}
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setIsStereoModalOpen(true);
                }}
                style={{
                  background: isMusicPlaying
                    ? 'linear-gradient(135deg, #3d2514, #26160b)'
                    : '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Laras Stereoanlage öffnen"
              >
                <Radio style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                <span>Laras Stereoanlage</span>
                {isMusicPlaying && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#50fa7b',
                      boxShadow: '0 0 8px #50fa7b',
                    }}
                    className="animate-pulse"
                  />
                )}
              </button>
            </div>

            <span
              style={{
                fontSize: '12px',
                color: '#d4af37',
                backgroundColor: 'rgba(36, 23, 13, 0.8)',
                border: '1px solid #663d1a',
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              Grafschaft Surrey • Croft Manor Eingangshalle
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'serif',
              color: '#d4af37',
              marginBottom: '6px',
              fontSize: '2rem',
              letterSpacing: '0.05em',
            }}
          >
            Eingangshalle
          </h1>
          <p
            style={{
              color: '#a1927d',
              fontSize: '14px',
              marginBottom: '18px',
              fontStyle: 'italic',
            }}
          >
            Butler Winston empfängt dich in der großen Halle. Wähle einen Raum oder Flügel des Anwesens:
          </p>

          {/* 
            BILD-CONTAINER:
            Sauber oben im Zentrum platziert, VOLLKOMMEN FREI von Buttons!
            Winston der Butler und die Treppenhalle sind 100% unbedeckt und sauber sichtbar.
          */}
          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.85), 0 0 20px rgba(212,175,55,0.15)',
              border: '2px solid #8b6528',
            }}
          >
            <img
              src="/images/eingangshalle.jpg"
              alt="Eingangshalle von Croft Manor mit Butler Winston"
              onError={(e) => {
                e.currentTarget.src = LAYOUT_IMAGES.eingangshalle || '/images/eingangshalle.jpg';
              }}
              style={{
                width: '100%',
                display: 'block',
                borderRadius: '6px',
                filter: 'brightness(98%) contrast(104%)',
              }}
            />
          </div>

          {/* 
            DIE VIER RAUM-BUTTONS:
            Komplett nach UNTEN verschoben, in eine ordentliche Reihe direkt unterhalb des Bildes!
            Schickes dunkles Holz- & Gold-Design mit Icons und Vorschaubildern.
          */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '22px auto 0 auto',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              {/* Button 1: Ruhmeshalle */}
              <button
                onClick={() => {
                  try { sounds.playPageTurn(); } catch (_) {}
                  if (onNavigateToRuhmeshalle) {
                    onNavigateToRuhmeshalle();
                  } else {
                    setAktuellerRaum('ruhmeshalle');
                  }
                }}
                style={{
                  background: 'linear-gradient(180deg, #2b1a0e 0%, #170d06 100%)',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.3)',
                  transition: 'all 0.2s ease',
                }}
                className="group hover:scale-105 active:scale-95 hover:border-amber-300 hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)]"
                title="Ruhmeshalle von Croft Manor betreten"
              >
                {/* Bild-Preview */}
                <div style={{ position: 'relative', height: '110px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src="/images/ruhmeshalle-01.jpg"
                    alt="Ruhmeshalle"
                    onError={(e) => {
                      e.currentTarget.src = LAYOUT_IMAGES.ruhmeshalle01 || '/images/ruhmeshalle-01.jpg';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    className="group-hover:scale-110"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(23,13,6,0.95) 0%, rgba(23,13,6,0.1) 60%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      fontSize: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    }}
                  >
                    🏛️
                  </span>
                </div>
                {/* Text-Inhalt */}
                <div style={{ padding: '10px 14px 12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#ffd992', fontFamily: 'serif', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.03em' }}>
                    Ruhmeshalle
                  </div>
                  <div style={{ color: '#a8947f', fontSize: '12px', marginTop: '2px', lineHeight: '1.3' }}>
                    Relikte, Scion & Trophäen
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(212,175,55,0.2)',
                      color: '#d4af37',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Raum betreten</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>

              {/* Button 2: Arbeitszimmer */}
              <button
                onClick={() => {
                  try { sounds.playPageTurn(); } catch (_) {}
                  setAktuellerRaum('arbeitszimmer');
                }}
                style={{
                  background: 'linear-gradient(180deg, #2b1a0e 0%, #170d06 100%)',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.3)',
                  transition: 'all 0.2s ease',
                }}
                className="group hover:scale-105 active:scale-95 hover:border-amber-300 hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)]"
                title="Das Arbeitszimmer von Lord Croft betreten"
              >
                {/* Bild-Preview */}
                <div style={{ position: 'relative', height: '110px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src="/images/schreibtisch.jpg"
                    alt="Arbeitszimmer"
                    onError={(e) => {
                      e.currentTarget.src = LAYOUT_IMAGES.schreibtisch || '/images/schreibtisch.jpg';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    className="group-hover:scale-110"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(23,13,6,0.95) 0%, rgba(23,13,6,0.1) 60%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      fontSize: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    }}
                  >
                    🖋️
                  </span>
                </div>
                {/* Text-Inhalt */}
                <div style={{ padding: '10px 14px 12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#ffd992', fontFamily: 'serif', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.03em' }}>
                    Arbeitszimmer
                  </div>
                  <div style={{ color: '#a8947f', fontSize: '12px', marginTop: '2px', lineHeight: '1.3' }}>
                    Lord Crofts Schreibtisch & Geheimfach
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(212,175,55,0.2)',
                      color: '#d4af37',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Raum betreten</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>

              {/* Button 3: Bibliothek */}
              <button
                onClick={() => {
                  try { sounds.playPageTurn(); } catch (_) {}
                  setAktuellerRaum('bibliothek');
                }}
                style={{
                  background: 'linear-gradient(180deg, #2b1a0e 0%, #170d06 100%)',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.3)',
                  transition: 'all 0.2s ease',
                }}
                className="group hover:scale-105 active:scale-95 hover:border-amber-300 hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)]"
                title="Die Bibliothek von Croft Manor betreten"
              >
                {/* Bild-Preview */}
                <div style={{ position: 'relative', height: '110px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src="/images/bibliothek.jpg"
                    alt="Bibliothek"
                    onError={(e) => {
                      e.currentTarget.src = LAYOUT_IMAGES.bibliothek || '/images/bibliothek.jpg';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    className="group-hover:scale-110"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(23,13,6,0.95) 0%, rgba(23,13,6,0.1) 60%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      fontSize: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    }}
                  >
                    📚
                  </span>
                </div>
                {/* Text-Inhalt */}
                <div style={{ padding: '10px 14px 12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#ffd992', fontFamily: 'serif', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.03em' }}>
                    Bibliothek
                  </div>
                  <div style={{ color: '#a8947f', fontSize: '12px', marginTop: '2px', lineHeight: '1.3' }}>
                    Folianten & Laras Stereoanlage
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(212,175,55,0.2)',
                      color: '#d4af37',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Raum betreten</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>

              {/* Button 4: Laras Schlafgemach */}
              <button
                onClick={() => {
                  try { sounds.playPageTurn(); } catch (_) {}
                  setAktuellerRaum('schlafgemach');
                }}
                style={{
                  background: 'linear-gradient(180deg, #2b1a0e 0%, #170d06 100%)',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.3)',
                  transition: 'all 0.2s ease',
                }}
                className="group hover:scale-105 active:scale-95 hover:border-amber-300 hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)]"
                title="Laras Schlafgemach betreten"
              >
                {/* Bild-Preview */}
                <div style={{ position: 'relative', height: '110px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src="/images/laras_zimmer.jpg"
                    alt="Laras Schlafgemach"
                    onError={(e) => {
                      e.currentTarget.src = LAYOUT_IMAGES.larasZimmer || '/images/laras_zimmer.jpg';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    className="group-hover:scale-110"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(23,13,6,0.95) 0%, rgba(23,13,6,0.1) 60%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      fontSize: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    }}
                  >
                    🛏️
                  </span>
                </div>
                {/* Text-Inhalt */}
                <div style={{ padding: '10px 14px 12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#ffd992', fontFamily: 'serif', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.03em' }}>
                    Laras Schlafgemach
                  </div>
                  <div style={{ color: '#a8947f', fontSize: '12px', marginTop: '2px', lineHeight: '1.3' }}>
                    Doppelpistolen, Kamin & Tagebuch
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(212,175,55,0.2)',
                      color: '#d4af37',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Raum betreten</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>

              {/* Button: Großes Wohnzimmer */}
              <button
                onClick={() => {
                  try { sounds.playPageTurn(); } catch (_) {}
                  setAktuellerRaum('grosses-wohnzimmer');
                }}
                style={{
                  background: 'linear-gradient(180deg, #2b1a0e 0%, #170d06 100%)',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.3)',
                  transition: 'all 0.2s ease',
                }}
                className="group hover:scale-105 active:scale-95 hover:border-amber-300 hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)]"
                title="Das Große Wohnzimmer von Croft Manor betreten"
              >
                {/* Bild-Preview */}
                <div style={{ position: 'relative', height: '110px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src="/images/wohnzimmer.jpg"
                    alt="Großes Wohnzimmer"
                    onError={(e) => {
                      e.currentTarget.src = LAYOUT_IMAGES.wohnzimmer || '/images/wohnzimmer.jpg';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    className="group-hover:scale-110"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(23,13,6,0.95) 0%, rgba(23,13,6,0.1) 60%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      fontSize: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    }}
                  >
                    🛋️
                  </span>
                </div>
                {/* Text-Inhalt */}
                <div style={{ padding: '10px 14px 12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#ffd992', fontFamily: 'serif', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.03em' }}>
                    Großes Wohnzimmer
                  </div>
                  <div style={{ color: '#a8947f', fontSize: '12px', marginTop: '2px', lineHeight: '1.3' }}>
                    Kamin, Sitzecke & Knistern
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(212,175,55,0.2)',
                      color: '#d4af37',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Raum betreten</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>

              {/* Button 5: Expeditionslager (Kellergewölbe) */}
              <button
                onClick={() => {
                  try { sounds.playPageTurn(); } catch (_) {}
                  setAktuellerRaum('kellergewoelbe');
                }}
                style={{
                  background: 'linear-gradient(180deg, #2b1a0e 0%, #170d06 100%)',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.3)',
                  transition: 'all 0.2s ease',
                }}
                className="group hover:scale-105 active:scale-95 hover:border-amber-300 hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)]"
                title="Das Expeditionslager und Kellergewölbe betreten"
              >
                {/* Bild-Preview */}
                <div style={{ position: 'relative', height: '110px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src="/images/expedition_raum.jpg"
                    alt="Expeditionslager"
                    onError={(e) => {
                      e.currentTarget.src = LAYOUT_IMAGES.expeditionRaum || '/images/expedition_raum.jpg';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    className="group-hover:scale-110"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(23,13,6,0.95) 0%, rgba(23,13,6,0.1) 60%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      fontSize: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    }}
                  >
                    📦
                  </span>
                </div>
                {/* Text-Inhalt */}
                <div style={{ padding: '10px 14px 12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#ffd992', fontFamily: 'serif', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.03em' }}>
                    Expeditionslager
                  </div>
                  <div style={{ color: '#a8947f', fontSize: '12px', marginTop: '2px', lineHeight: '1.3' }}>
                    Kellergewölbe & Ausrüstung
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(212,175,55,0.2)',
                      color: '#d4af37',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Raum betreten</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- RENDERING FÜR DAS GROSSE WOHNZIMMER --- */}
      {aktuellerRaum === 'grosses-wohnzimmer' && (
        <div
          style={{
            background: '#1a1008',
            minHeight: '85vh',
            padding: '20px',
            color: 'white',
            textAlign: 'center',
            fontFamily: 'serif',
          }}
        >
          {/* Top Header-Leiste */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto 16px auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setAktuellerRaum('eingangshalle');
                }}
                style={{
                  background: '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <ArrowLeft style={{ width: '16px', height: '16px', color: '#ffd992' }} />
                <span>Zurück zur Eingangshalle</span>
              </button>

              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  setIsStereoModalOpen(true);
                }}
                style={{
                  background: isMusicPlaying
                    ? 'linear-gradient(135deg, #3d2514, #26160b)'
                    : '#2a1a0f',
                  color: '#ffd992',
                  border: '1px solid #d4af37',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Laras Stereoanlage & Ambient Mixer öffnen"
              >
                <Radio style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                <span>Stereoanlage & Ambient Mixer</span>
              </button>

              <button
                onClick={() => {
                  try { sounds.playClick(); } catch (_) {}
                  const nextState = !isLivingRoomFireBurning;
                  setIsLivingRoomFireBurning(nextState);
                  if (nextState) {
                    stereoAudio.playKamin();
                  } else {
                    stereoAudio.stopKamin();
                  }
                }}
                style={{
                  background: isLivingRoomFireBurning
                    ? 'linear-gradient(135deg, #44240e, #291508)'
                    : '#2a1a0f',
                  color: '#ffd992',
                  border: '1.5px solid #d4af37',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Wohnzimmer-Kaminfeuer an- oder ausschalten"
              >
                <span>🔥</span>
                <span>{isLivingRoomFireBurning ? 'Kaminfeuer an 🔥' : 'Kaminfeuer aus'}</span>
              </button>

              <button
                onClick={handleOpenLivingRoomBook}
                style={{
                  background: '#2a1a0f',
                  color: '#ffd992',
                  border: '1.5px solid #d4af37',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Atlantis-Tagebuch öffnen"
              >
                <BookOpen style={{ width: '15px', height: '15px', color: '#ffd992' }} />
                <span>Atlantis-Tagebuch</span>
              </button>

              <button
                onClick={handleGenerateVeoVideo}
                disabled={isGeneratingVideo}
                style={{
                  background: 'linear-gradient(135deg, #44240e, #291508)',
                  color: '#ffd992',
                  border: '1.5px solid #d4af37',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  cursor: isGeneratingVideo ? 'wait' : 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Mit Veo Kaminfeuer als nahtloses Loop-Video animieren"
              >
                <Sparkles style={{ width: '15px', height: '15px', color: '#ffd992' }} className={isGeneratingVideo ? 'animate-spin' : ''} />
                <span>{isGeneratingVideo ? 'Veo generiert Video...' : fireplaceVideoUrl ? 'Veo Kamin-Video aktiv 🔥' : 'Mit Veo Kaminfeuer animieren 🔥'}</span>
              </button>

              {onBackToHome && (
                <button
                  onClick={() => {
                    try { sounds.playClick(); } catch (_) {}
                    onBackToHome();
                  }}
                  style={{
                    background: '#2a1a0f',
                    color: '#bca78c',
                    border: '1px solid #7c4f24',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Home style={{ width: '14px', height: '14px' }} />
                  <span>Zur Startseite</span>
                </button>
              )}
            </div>

            <span
              style={{
                fontSize: '12px',
                color: '#d4af37',
                backgroundColor: 'rgba(36, 23, 13, 0.8)',
                border: '1px solid #663d1a',
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              Hauptflügel • Das Große Wohnzimmer (Kaminfeuer freigeschaltet 🔥)
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'serif',
              color: '#d4af37',
              marginBottom: '6px',
              fontSize: '2.2rem',
              letterSpacing: '0.05em',
            }}
          >
            Das Große Wohnzimmer
          </h1>
          <p
            style={{
              color: '#a1927d',
              fontSize: '14px',
              marginBottom: '20px',
              fontStyle: 'italic',
            }}
          >
            Laras prunkvoller Aufenthaltsraum mit antikem Kamin und gemütlichen Sitzgelegenheiten. Das Kaminfeuer-Knistern wurde im Ambient Audio Mixer freigeschaltet!
          </p>

          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              border: '2px solid #8b6528',
            }}
          >
            {videoStatusMessage && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15, 9, 4, 0.88)',
                  backdropFilter: 'blur(6px)',
                  zIndex: 30,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  textAlign: 'center',
                  color: '#ffd992',
                }}
              >
                <Sparkles className="w-10 h-10 text-amber-300 animate-spin mb-4" />
                <h3 style={{ fontFamily: 'serif', fontSize: '1.4rem', marginBottom: '8px', color: '#ffd992' }}>
                  Veo generiert Kaminfeuer-Animation
                </h3>
                <p style={{ fontSize: '14px', color: '#e0cfba', maxWidth: '500px', lineHeight: '1.6', margin: 0 }}>
                  {videoStatusMessage}
                </p>
              </div>
            )}

            {fireplaceVideoUrl ? (
              <video
                src={fireplaceVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  display: 'block',
                  filter: 'brightness(96%) contrast(105%)',
                }}
              />
            ) : (
              <img
                src="/images/wohnzimmer.jpg"
                alt="Das Große Wohnzimmer von Croft Manor"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = LAYOUT_IMAGES.wohnzimmer || '/images/wohnzimmer.jpg';
                }}
                style={{
                  width: '100%',
                  display: 'block',
                  filter: 'brightness(96%) contrast(105%)',
                }}
              />
            )}

            {/* Hotspot auf den Kamin / Kaminfeuer */}
            {/* Animiertes Flackerndes Kaminfeuer im Wohnzimmer */}
            {isLivingRoomFireBurning && !fireplaceVideoUrl && (
              <div
                style={{
                  position: 'absolute',
                  top: '44%',
                  left: '42%',
                  width: '16%',
                  height: '22%',
                  pointerEvents: 'none',
                  zIndex: 15,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,140,0,0.9) 0%, rgba(220,60,0,0.65) 50%, transparent 80%)',
                }}
                className="animate-fire-flicker"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ember absolute" style={{ bottom: '15px', left: '30%' }} />
                  <div className="w-2 h-2 bg-amber-200 rounded-full animate-ember absolute" style={{ bottom: '22px', right: '35%', animationDelay: '0.5s' }} />
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-ember absolute" style={{ bottom: '10px', left: '50%', animationDelay: '1.1s' }} />
                </div>
              </div>
            )}

            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                try { sounds.playPageTurn(); } catch (_) {}
                const nextState = !isLivingRoomFireBurning;
                setIsLivingRoomFireBurning(nextState);
                if (nextState) {
                  stereoAudio.playKamin();
                  if (stereoAudio.getKaminfeuerVolume() === 0) {
                    stereoAudio.setKaminfeuerVolume(0.5);
                  }
                } else {
                  stereoAudio.stopKamin();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const nextState = !isLivingRoomFireBurning;
                  setIsLivingRoomFireBurning(nextState);
                  if (nextState) {
                    stereoAudio.playKamin();
                    if (stereoAudio.getKaminfeuerVolume() === 0) {
                      stereoAudio.setKaminfeuerVolume(0.5);
                    }
                  } else {
                    stereoAudio.stopKamin();
                  }
                }
              }}
              title="Antiken Kamin untersuchen (Kaminfeuer an- oder ausschalten)"
              style={{
                position: 'absolute',
                top: '30%',
                left: '35%',
                width: '30%',
                height: '40%',
                cursor: 'pointer',
                zIndex: 20,
                background: 'transparent',
              }}
              className="group focus:outline-none"
            >
              <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/15 group-hover:border-2 group-hover:border-amber-400/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                <div className="bg-[#1a1008]/90 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm pointer-events-none">
                  <span className="text-base">🔥</span>
                  <span className="font-semibold tracking-wide">Kaminfeuer knistern lassen</span>
                </div>
              </div>
            </div>

            {/* 
              HOTSPOT AUF DAS WEIN- UND SPIRITUOSENREGAL (RECHTE SEITE):
              Winston Easter-Egg Hotspot
            */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleWinstonClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleWinstonClick();
                }
              }}
              title="Wein- und Spirituosenregal untersuchen (Winston Easter-Egg)"
              style={{
                position: 'absolute',
                top: '28%',
                left: '68%',
                width: '26%',
                height: '45%',
                cursor: 'pointer',
                zIndex: 20,
                background: 'transparent',
              }}
              className="group focus:outline-none"
            >
              <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-cyan-400/15 group-hover:border-2 group-hover:border-cyan-400/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                <div className="bg-[#1a1008]/95 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm pointer-events-none">
                  <span className="text-base">🧊</span>
                  <span className="font-semibold tracking-wide">Weinregal & Winston untersuchen</span>
                </div>
              </div>
            </div>

            {/* 
              HOTSPOT AUF DAS BUCH / TAGEBUCH (WOHNZIMMER):
              Öffnet das Pergament-Fenster mit dem Atlantis-Tagebucheintrag und atlantis-tagebuch.mp3
            */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleOpenLivingRoomBook}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpenLivingRoomBook();
                }
              }}
              title="Atlantis-Tagebuch auf dem Tisch untersuchen"
              style={{
                position: 'absolute',
                top: '58%',
                left: '38%',
                width: '24%',
                height: '32%',
                cursor: 'pointer',
                zIndex: 20,
                background: 'transparent',
              }}
              className="group focus:outline-none"
            >
              <div className="w-full h-full rounded transition-all duration-300 group-hover:bg-amber-400/15 group-hover:border-2 group-hover:border-amber-400/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                <div className="bg-[#1a1008]/95 border border-[#d4af37] text-[#ffd992] text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm pointer-events-none">
                  <BookOpen className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="font-semibold tracking-wide">Atlantis-Tagebuch lesen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        PERGAMENT-FENSTER FÜR DAS ATLANTIS-TAGEBUCH IM WOHNZIMMER
      */}
      {isLivingRoomBookOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={handleCloseLivingRoomBook}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #e7d8bd, #d6c4a8)',
              border: '3px solid #8b5a2b',
              borderRadius: '12px',
              maxWidth: '720px',
              width: '100%',
              color: '#1a1008',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.4)',
              padding: '28px',
              position: 'relative',
              textAlign: 'left',
              maxHeight: '92vh',
              overflowY: 'auto',
              fontFamily: 'serif',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Schließen-Kreuz oben rechts */}
            <button
              onClick={handleCloseLivingRoomBook}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(139, 90, 43, 0.2)',
                border: '1px solid #8b5a2b',
                color: '#2d180c',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
              className="hover:scale-110 active:scale-95 transition-transform hover:bg-[#8b5a2b]/30"
              title="Schließen"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <BookOpen style={{ width: '20px', height: '20px', color: '#8b5a2b' }} />
              <span
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#8b5a2b',
                  fontWeight: 'bold',
                }}
              >
                Croft Manor Wohnzimmer • Pergament-Notiz
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'serif',
                color: '#2d180c',
                fontSize: '1.6rem',
                margin: '0 0 16px 0',
                lineHeight: '1.2',
                borderBottom: '2px solid rgba(139,90,43,0.3)',
                paddingBottom: '8px',
              }}
            >
              Expeditions-Aufzeichnungen: Atlantis
            </h2>

            <div
              style={{
                backgroundColor: '#f1e6cf',
                border: '1.5px solid rgba(139,90,43,0.5)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                fontSize: '15.5px',
                lineHeight: '1.8',
                color: '#1a1008',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.08)',
              }}
            >
              <p style={{ margin: '0 0 14px 0' }}>
                Die Legenden über das dreiteilige Artefakt der Herrscher Qualopec, Tihocan und Natla scheinen wahr zu sein. Die Fragmente bergen eine unvorstellbare, evolutionäre Kraft. Meine Ausrüstung ist bereit, die Koordinaten sind berechnet.
              </p>
              <p style={{ margin: '0 0 14px 0' }}>
                Es ist ein riskantes Unterfangen, aber die Geheimnisse, die tief im versunkenen Kontinent vergraben liegen, dürfen nicht in die falschen Hände geraten. Ich spüre, dass dies mein bisher größtes Abenteuer wird.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                Nächstes Expeditionsziel: Atlantis.
              </p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                Aufbruch am: 12.02.2027.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseLivingRoomBook}
                style={{
                  background: 'linear-gradient(135deg, #8b5a2b, #5c3a1c)',
                  color: '#ffd992',
                  border: '1.5px solid #ffd992',
                  padding: '9px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                Tagebuch schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        WINSTON EASTER-EGG TEXTFENSTER (IM TOMB-RAIDER-STIL)
      */}
      {isWinstonModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={handleCloseWinstonModal}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #25160b, #150d06)',
              border: '2px solid #d4af37',
              borderRadius: '12px',
              maxWidth: '620px',
              width: '100%',
              color: '#e7d8c5',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.35)',
              padding: '24px',
              position: 'relative',
              textAlign: 'left',
              maxHeight: '94vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Schließen-Kreuz oben rechts */}
            <button
              onClick={handleCloseWinstonModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(42, 26, 15, 0.85)',
                border: '1px solid #7c4f24',
                color: '#ffd992',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
              className="hover:scale-110 active:scale-95 transition-transform hover:border-amber-300"
              title="Schließen"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '22px' }}>🧊</span>
              <span
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#d4af37',
                  fontWeight: 'bold',
                }}
              >
                Croft Manor • Butler Winston Easter-Egg
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'serif',
                color: '#ffd992',
                fontSize: '1.6rem',
                margin: '0 0 16px 0',
                lineHeight: '1.2',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              Winston Smith & das Weinregal
            </h2>

            {/* Bild butler.jpg */}
            <div
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #8b6528',
                marginBottom: '16px',
                backgroundColor: '#120a04',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                padding: '6px',
              }}
            >
              <img
                src="/images/butler.jpg"
                alt="Butler Winston"
                onError={(e) => {
                  e.currentTarget.src = '/butler.jpg';
                }}
                style={{
                  maxHeight: '320px',
                  width: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: '4px',
                }}
              />
            </div>

            {/* Direkt unter dem Bild wird der Text eingeblendet */}
            <div
              style={{
                backgroundColor: 'rgba(15, 10, 5, 0.9)',
                borderLeft: '4px solid #d4af37',
                padding: '16px 18px',
                borderRadius: '0 8px 8px 0',
                marginBottom: '20px',
                fontStyle: 'italic',
                fontSize: '15px',
                lineHeight: '1.7',
                color: '#f3e5d3',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              „Winston, bringen Sie mir bitte eine frische Kanne Tee – und schließen Sie danach bitte die Kühlschranktür von innen.“
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseWinstonModal}
                style={{
                  background: 'linear-gradient(135deg, #44240e, #291508)',
                  color: '#ffd992',
                  border: '1.5px solid #d4af37',
                  padding: '8px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                }}
                className="hover:scale-105 active:scale-95 transition-transform hover:border-amber-300"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        LARAS STEREOANLAGE MODAL (HTML5 Audio Player)
        WICHTIG: Bleibt gemountet, sodass die Musik auch beim Schließen des Fensters
        vorkommen kann!
      */}
      <StereoPlayerModal
        isOpen={isStereoModalOpen}
        onClose={() => setIsStereoModalOpen(false)}
        onPlayStateChange={(playing, title) => {
          setIsMusicPlaying(playing);
          setPlayingTrackTitle(title);
        }}
        isWinstonAnimActive={isWinstonAnimActive}
      />

      {/* 
        Subtile Status-Pille, wenn Musik im Hintergrund läuft und das Modal geschlossen ist.
        Erlaubt jederzeitiges Wiederöffnen von Laras Stereoanlage.
      */}
      {isMusicPlaying && !isStereoModalOpen && (
        <div
          onClick={() => setIsStereoModalOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'rgba(26, 16, 8, 0.95)',
            border: '1.5px solid #d4af37',
            borderRadius: '24px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.8), 0 0 15px rgba(212,175,55,0.3)',
            zIndex: 1000,
            backdropFilter: 'blur(6px)',
          }}
          className="hover:scale-105 transition-transform"
          title="Laras Stereoanlage öffnen"
        >
          <Radio style={{ width: '16px', height: '16px', color: '#ffd992' }} />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ffd992' }}>
              ♫ {playingTrackTitle || 'Stereoanlage'}
            </span>
            <span style={{ fontSize: '9px', color: '#50fa7b' }}>
              Läuft im Hintergrund • Klicken zum Öffnen
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default CroftManor;
