import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, RotateCcw, Sparkles, Loader2, Mic } from 'lucide-react';

interface TtsReaderProps {
  text: string;
  title: string;
  voiceName?: string; // Default: 'Kore'
  autoPlay?: boolean;
  audioFileOverride?: string;
}

const VOICES = [
  { id: 'Kore', label: 'Kore (Erzählstimme)' },
];

export const TtsReader: React.FC<TtsReaderProps> = ({
  text,
  title,
  voiceName = 'Kore',
  autoPlay = false,
  audioFileOverride,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(voiceName);
  const [useFallback, setUseFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, setAudioProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stimmen im Browser vorab initialisieren
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoices);
      };
    }
  }, []);

  // Stoppe Audio beim Wechsel des Eintrags
  useEffect(() => {
    stopPlayback();
    setErrorMessage(null);
  }, [text, title]);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  // Automatisches Vorlesen beim Öffnen des Artefakts wenn autoPlay aktiv ist
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        handlePlayToggle();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, text, title]);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsLoading(false);
    setAudioProgress(0);
  };

  const handleSpeechSynthesisFallback = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setErrorMessage('Sprachausgabe im Browser nicht unterstützt.');
      setIsLoading(false);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = `${title}. ${text.replace(/[\n\r]+/g, ' ')}`;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'de-DE';
    utterance.rate = 1.1;
    utterance.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('de') &&
          (v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('anna') ||
            v.name.toLowerCase().includes('marlene') ||
            v.name.toLowerCase().includes('katja') ||
            v.name.toLowerCase().includes('hedda') ||
            v.name.toLowerCase().includes('claudia') ||
            v.name.toLowerCase().includes('helena') ||
            v.name.toLowerCase().includes('vicki') ||
            v.name.toLowerCase().includes('amelie'))
      ) ||
      voices.find((v) => v.lang.startsWith('de')) ||
      voices[0];

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setUseFallback(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setAudioProgress(100);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis Event:', e);
      setIsPlaying(false);
      setIsLoading(false);
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayToggle = async () => {
    if (isPlaying) {
      if (audioRef.current && !useFallback) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else if (typeof window !== 'undefined' && window.speechSynthesis && useFallback) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (audioRef.current && audioRef.current.src && !useFallback && audioRef.current.currentTime > 0) {
      audioRef.current.play().catch(() => handleSpeechSynthesisFallback());
      setIsPlaying(true);
      return;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis && useFallback && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (audioFileOverride || title.includes('Imperial Hotel') || title.includes('Höhlen')) {
        const audioUrl = audioFileOverride || (title.includes('Höhlen') ? '/music/die-hoelen.mp3' : '/music/imperial-hotel.mp3');
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = audioUrl;

        audioRef.current.ontimeupdate = () => {
          if (audioRef.current && audioRef.current.duration) {
            setAudioProgress(
              (audioRef.current.currentTime / audioRef.current.duration) * 100
            );
          }
        };

        audioRef.current.onended = () => {
          setIsPlaying(false);
          setAudioProgress(100);
        };

        audioRef.current.onerror = () => {
          console.warn('Audio playback error for override file');
          setErrorMessage('Audiodatei konnte nicht geladen werden.');
          setIsLoading(false);
          setIsPlaying(false);
        };

        await audioRef.current.play();
        setIsLoading(false);
        setIsPlaying(true);
        setUseFallback(false);
        return;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${title}. ${text}`,
          voice: selectedVoice,
        }),
      });

      const data = await response.json().catch(() => null);

      if (data && data.audioUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = data.audioUrl;

        audioRef.current.ontimeupdate = () => {
          if (audioRef.current && audioRef.current.duration) {
            setAudioProgress(
              (audioRef.current.currentTime / audioRef.current.duration) * 100
            );
          }
        };

        audioRef.current.onended = () => {
          setIsPlaying(false);
          setAudioProgress(100);
        };

        audioRef.current.onerror = () => {
          console.warn('Audio playback error, fallback to Web Speech');
          handleSpeechSynthesisFallback();
        };

        await audioRef.current.play();
        setIsLoading(false);
        setIsPlaying(true);
        setUseFallback(false);
      } else {
        handleSpeechSynthesisFallback();
      }
    } catch (_err) {
      handleSpeechSynthesisFallback();
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVoice = e.target.value;
    setSelectedVoice(newVoice);
    if (isPlaying) {
      stopPlayback();
    }
  };

  return (
    <div className="flex flex-col gap-2.5 bg-[#241710]/90 border border-[#8b5a2b]/60 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayToggle}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8b5a2b] to-[#b3753b] hover:from-[#a06832] hover:to-[#c68344] text-[#fff8ec] font-cinzel text-xs font-semibold rounded-lg shadow-md transition-all duration-200 active:scale-95 disabled:opacity-60 cursor-pointer"
            title="Tagebucheintrag mit natürlicher KI-Stimme vorlesen"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#ffd992]" />
                <span>Generiere Stimme...</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-[#ffd992]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#ffd992]" />
                <span>Natürlich Vorlesen</span>
              </>
            )}
          </button>

          {isPlaying && (
            <button
              onClick={stopPlayback}
              className="p-2 text-[#d1b99a] hover:text-[#fff] hover:bg-[#3d2719] rounded-lg transition-colors cursor-pointer"
              title="Wiedergabe stoppen"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stimm-Auswahl */}
        {audioFileOverride || title.includes('Imperial Hotel') || title.includes('Höhlen') ? (
          <div className="flex items-center gap-1.5 bg-[#1a0f0a] px-2.5 py-1 rounded-lg border border-[#5c3a1c] text-xs text-[#ffd992] font-serif">
            <Sparkles className="w-3.5 h-3.5 text-[#e4c478]" />
            <span className="font-semibold">Original-Audio: {audioFileOverride ? audioFileOverride.split('/').pop() : title.includes('Höhlen') ? 'die-hoelen.mp3' : 'imperial-hotel.mp3'}</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#c9b497] font-serif">
            <span className="flex items-center gap-1.5 bg-[#1a0f0a] px-2.5 py-1 rounded-lg border border-[#5c3a1c]">
              <Mic className="w-3.5 h-3.5 text-[#e4c478]" />
              <select
                value={selectedVoice}
                onChange={handleVoiceChange}
                className="bg-transparent text-[#ffd992] font-semibold outline-none cursor-pointer"
                title="Sprecherstimme wählen"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-[#241710] text-[#ffd992]">
                    {v.label}
                  </option>
                ))}
              </select>
            </span>

            {useFallback ? (
              <span className="text-[10px] text-[#e8a862] italic">
                (Browser-Synthese)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-[#86efac] font-medium">
                <Sparkles className="w-3 h-3 text-[#4ade80]" />
                Studio KI-Sprache
              </span>
            )}
          </div>
        )}

        {/* Visuelle Audiowellen-Animation während der Wiedergabe */}
        {isPlaying && (
          <div className="flex items-center gap-1 ml-auto">
            <span className="w-1 bg-[#e4c478] rounded-full animate-bounce [animation-delay:0.1s] h-4"></span>
            <span className="w-1 bg-[#e4c478] rounded-full animate-bounce [animation-delay:0.3s] h-6"></span>
            <span className="w-1 bg-[#e4c478] rounded-full animate-bounce [animation-delay:0.2s] h-5"></span>
            <span className="w-1 bg-[#e4c478] rounded-full animate-bounce [animation-delay:0.4s] h-3"></span>
          </div>
        )}
      </div>

      {errorMessage && (
        <span className="text-[11px] text-red-300">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
