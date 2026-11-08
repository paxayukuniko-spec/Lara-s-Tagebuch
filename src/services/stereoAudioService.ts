import { STEREO_TRACKS, StereoTrack } from '../components/StereoPlayerModal';

export type StereoPlayerListener = () => void;
export type MusicMood = 'abenteuer' | 'spannung' | 'ruhe';

class StereoAudioService {
  private audio: HTMLAudioElement | null = null;
  private currentTrackIndex = 0;
  private isPlaying = false;
  private currentTime = 0;
  private duration = 0;
  private volume = 0.85;
  private isMuted = false;
  private error: string | null = null;
  private listeners: Set<StereoPlayerListener> = new Set();
  private isModalOpen = false;
  private currentMood: MusicMood = 'abenteuer';
  private autoMood = true;

  // Kaminfeuer Ambient Audio für das Wohnzimmer
  private kaminAudio: HTMLAudioElement | null = null;
  private kaminVolume = 0.6;
  private kaminMuted = false;
  private isKaminPlaying = false;

  // Mood zu Track-Indizes Mapping (NUR vorhandene gespeicherte MP3-Dateien)
  private moodTracks: Record<MusicMood, number[]> = {
    abenteuer: [0, 3, 4, 6], // arnak, das-verlorene-tal, theme, vilcabamba
    spannung: [1, 5, 8, 9, 12], // hotel, die-hoelen, kellergewoelbe, atlantis-tagebuch, secret
    ruhe: [2, 7, 10, 11, 13], // imperial-hotel, arbeitszimmer, dad, tee, kamin-feuer
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
      this.initKaminAudio();
    }
  }

  private initAudio() {
    if (this.audio) return;
    try {
      this.audio = new Audio();
      this.audio.preload = 'metadata';
      this.audio.volume = this.volume;
      this.audio.muted = this.isMuted;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.error = null;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio) {
          this.currentTime = this.audio.currentTime;
          this.notify();
        }
      });

      this.audio.addEventListener('loadedmetadata', () => {
        if (this.audio) {
          this.duration = this.audio.duration || 0;
          this.error = null;
          this.notify();
        }
      });

      this.audio.addEventListener('ended', () => {
        this.nextTrack();
      });

      this.audio.addEventListener('error', () => {
        this.isPlaying = false;
        this.error = `MP3-Datei nicht gefunden oder nicht abspielbar: ${this.getCurrentTrack().url}`;
        this.notify();
      });
    } catch (e) {
      console.warn('Audio initialization warning:', e);
    }
  }

  private initKaminAudio() {
    if (this.kaminAudio) return;
    try {
      this.kaminAudio = new Audio('/music/kamin-feuer.mp3');
      this.kaminAudio.loop = true;
      this.kaminAudio.volume = this.kaminVolume;
      this.kaminAudio.muted = this.kaminMuted;
      this.kaminAudio.preload = 'auto';

      this.kaminAudio.addEventListener('play', () => {
        this.isKaminPlaying = true;
        this.notify();
      });

      this.kaminAudio.addEventListener('pause', () => {
        this.isKaminPlaying = false;
        this.notify();
      });
    } catch (e) {
      console.warn('Kamin audio init warning:', e);
    }
  }

  public playKamin() {
    this.initKaminAudio();
    if (!this.kaminAudio) return;
    this.kaminAudio.volume = this.kaminMuted ? 0 : this.kaminVolume;
    const playPromise = this.kaminAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isKaminPlaying = true;
        this.notify();
      }).catch((err) => {
        console.info('Kaminfeuer Autoplay Hinweis:', err);
      });
    }
  }

  public stopKamin() {
    if (this.kaminAudio) {
      this.kaminAudio.pause();
      this.kaminAudio.currentTime = 0;
      this.isKaminPlaying = false;
      this.notify();
    }
  }

  public setKaminfeuerVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.kaminVolume = clamped;
    if (this.kaminAudio) {
      this.kaminAudio.volume = this.kaminMuted ? 0 : clamped;
    }
    this.notify();
  }

  public getKaminfeuerVolume(): number {
    return this.kaminVolume;
  }

  public getIsKaminMuted(): boolean {
    return this.kaminMuted;
  }

  public getIsKaminPlaying(): boolean {
    return this.isKaminPlaying;
  }

  public toggleKaminMute() {
    this.kaminMuted = !this.kaminMuted;
    if (this.kaminAudio) {
      this.kaminAudio.volume = this.kaminMuted ? 0 : this.kaminVolume;
    }
    this.notify();
  }

  public unlockKaminfeuer() {
    this.playKamin();
  }

  public subscribe(listener: StereoPlayerListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (_) {}
    });
  }

  public getCurrentTrack(): StereoTrack {
    return STEREO_TRACKS[this.currentTrackIndex] || STEREO_TRACKS[0];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getError(): string | null {
    return this.error;
  }

  public getIsModalOpen(): boolean {
    return this.isModalOpen;
  }

  public setModalOpen(open: boolean) {
    this.isModalOpen = open;
    this.notify();
  }

  public getMood(): MusicMood {
    return this.currentMood;
  }

  public getAutoMood(): boolean {
    return this.autoMood;
  }

  public setAutoMood(auto: boolean) {
    this.autoMood = auto;
    this.notify();
  }

  public setMood(mood: MusicMood, userInitiated = true) {
    if (userInitiated) {
      this.autoMood = false;
    }
    this.currentMood = mood;
    const indices = this.moodTracks[mood] || this.moodTracks.abenteuer;
    const randomIndex = indices[Math.floor(Math.random() * indices.length)] || 0;
    this.selectTrack(randomIndex);
  }

  public syncWithEntryMood(entryMood: string) {
    if (!this.autoMood) return;
    let targetMood: MusicMood = 'abenteuer';
    if (entryMood === 'triumphierend' || entryMood === 'heroisch') {
      targetMood = 'abenteuer';
    } else if (entryMood === 'gefährlich' || entryMood === 'mystisch') {
      targetMood = 'spannung';
    } else if (entryMood === 'nachdenklich') {
      targetMood = 'ruhe';
    }
    if (this.currentMood !== targetMood) {
      this.currentMood = targetMood;
      const indices = this.moodTracks[targetMood] || this.moodTracks.abenteuer;
      const randomIndex = indices[Math.floor(Math.random() * indices.length)] || 0;
      this.selectTrack(randomIndex);
    }
  }

  public selectTrack(index: number) {
    if (index < 0 || index >= STEREO_TRACKS.length) return;
    this.initAudio();
    if (!this.audio) return;

    this.currentTrackIndex = index;
    const track = STEREO_TRACKS[index];
    this.audio.src = track.url;
    this.currentTime = 0;
    this.error = null;
    this.notify();

    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.notify();
      })
      .catch((err) => {
        console.info(`Hinweis: ${track.url} Autoplay blockiert oder noch nicht geladen:`, err.message);
        this.isPlaying = false;
        this.error = `MP3-Datei unter "${track.url}" wird im Ordner "public/music/" erwartet.`;
        this.notify();
      });
  }

  public playUrl(url: string) {
    this.initAudio();
    if (!this.audio) return;
    this.audio.src = url;
    this.currentTime = 0;
    this.error = null;
    this.notify();

    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.notify();
      })
      .catch((err) => {
        console.info(`Hinweis: ${url} Autoplay blockiert:`, err.message);
        this.isPlaying = false;
        this.error = `MP3-Datei unter "${url}" konnte nicht automatisch abgespielt werden.`;
        this.notify();
      });
  }

  public togglePlay() {
    this.initAudio();
    if (!this.audio) return;

    if (!this.audio.src || this.audio.src === '' || this.audio.src === window.location.href) {
      this.selectTrack(this.currentTrackIndex);
      return;
    }

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.error = null;
          this.notify();
        })
        .catch((err) => {
          this.error = `Wiedergabe nicht gestartet: ${err.message}`;
          this.notify();
        });
    }
  }

  public pause() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public nextTrack() {
    const indices = this.moodTracks[this.currentMood] || Array.from({ length: STEREO_TRACKS.length }, (_, i) => i);
    const currentPos = indices.indexOf(this.currentTrackIndex);
    const nextPos = (currentPos + 1) % indices.length;
    this.selectTrack(indices[nextPos] ?? 0);
  }

  public prevTrack() {
    const indices = this.moodTracks[this.currentMood] || Array.from({ length: STEREO_TRACKS.length }, (_, i) => i);
    const currentPos = indices.indexOf(this.currentTrackIndex);
    const prevPos = (currentPos - 1 + indices.length) % indices.length;
    this.selectTrack(indices[prevPos] ?? 0);
  }

  public seek(seconds: number) {
    if (!this.audio) return;
    try {
      this.audio.currentTime = seconds;
      this.currentTime = seconds;
      this.notify();
    } catch (_) {}
  }

  public setVolume(vol: number) {
    if (!this.audio) return;
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    this.audio.volume = clamped;
    if (clamped > 0 && this.isMuted) {
      this.isMuted = false;
      this.audio.muted = false;
    }
    this.notify();
  }

  public toggleMute() {
    if (!this.audio) return;
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    this.notify();
  }
}

export const stereoAudio = new StereoAudioService();
