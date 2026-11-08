/**
 * Web Audio API Sound Effekte für authentische Atmosphäre
 * (Pergament-Umblättern, Klick-Töne und prozeduraler Ambient-Sound)
 */

class SoundManager {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Geräusch eines umblätternden Pergament-Papiers
   */
  public playPageTurn() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Weiches Rauschen für Papierreibung
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.25);
      filter.Q.setValueAtTime(2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {
      // Ignorieren falls Audio gesperrt
    }
  }



  /**
   * Spielt immer bei allen Sachen, die geöffnet werden, "click-button.mp3"
   * und wenn es ein Geheimnis ist, sofort im Anschluss "tr_secret.mp3".
   */
  public playOpenSound(isSecret = false) {
    try {
      this.initContext();
      const clickAudio = new Audio('/music/click-button.mp3');
      clickAudio.volume = 1.0;
      clickAudio.play().catch(() => {});

      if (isSecret) {
        clickAudio.onended = () => {
          try {
            const secretAudio = new Audio('/music/tr_secret.mp3');
            secretAudio.volume = 0.9;
            secretAudio.play().catch(() => {});
          } catch (_) {}
        };
      }
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Synthetischer mystischer Geheimnis-Sound oder MP3
   */
  public playTrSecret() {
    this.playOpenSound(true);
  }

  /**
   * Klick-Interaktion / Öffnen von Sachen, Türen etc.
   */
  public playClick() {
    this.playOpenSound(false);
  }

  /**
   * Zartes Kratzen einer antiken Feder / Füllfederhalter auf Pergament
   */
  public playPenScratch() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600 + Math.random() * 800, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      // AudioContext nicht verfügbar
    }
  }

  /**
   * Geheimmechanismus (Verschieben des Bücherregals)
   */
  public playSecretMechanism() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const duration = 0.55;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.6));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      // Ignorieren falls nicht verfügbar
    }
  }
}

export const sounds = new SoundManager();
