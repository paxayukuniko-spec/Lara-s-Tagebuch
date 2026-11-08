import { useState, useEffect } from 'react';
import { stereoAudio, MusicMood } from '../services/stereoAudioService';
import { STEREO_TRACKS } from '../components/StereoPlayerModal';

export function useStereoAudio() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = stereoAudio.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  return {
    tracks: STEREO_TRACKS,
    currentTrack: stereoAudio.getCurrentTrack(),
    currentTrackIndex: stereoAudio.getCurrentTrackIndex(),
    isPlaying: stereoAudio.getIsPlaying(),
    currentTime: stereoAudio.getCurrentTime(),
    duration: stereoAudio.getDuration(),
    volume: stereoAudio.getVolume(),
    isMuted: stereoAudio.getIsMuted(),
    error: stereoAudio.getError(),
    isModalOpen: stereoAudio.getIsModalOpen(),
    currentMood: stereoAudio.getMood(),
    autoMood: stereoAudio.getAutoMood(),
    kaminVolume: stereoAudio.getKaminfeuerVolume(),
    isKaminMuted: stereoAudio.getIsKaminMuted(),
    isKaminPlaying: stereoAudio.getIsKaminPlaying(),
    openModal: () => stereoAudio.setModalOpen(true),
    closeModal: () => stereoAudio.setModalOpen(false),
    selectTrack: (idx: number) => stereoAudio.selectTrack(idx),
    togglePlay: () => stereoAudio.togglePlay(),
    nextTrack: () => stereoAudio.nextTrack(),
    prevTrack: () => stereoAudio.prevTrack(),
    seek: (time: number) => stereoAudio.seek(time),
    setVolume: (vol: number) => stereoAudio.setVolume(vol),
    toggleMute: () => stereoAudio.toggleMute(),
    setMood: (mood: MusicMood) => stereoAudio.setMood(mood),
    setAutoMood: (auto: boolean) => stereoAudio.setAutoMood(auto),
    setKaminfeuerVolume: (vol: number) => stereoAudio.setKaminfeuerVolume(vol),
    toggleKaminMute: () => stereoAudio.toggleKaminMute(),
    playKamin: () => stereoAudio.playKamin(),
    stopKamin: () => stereoAudio.stopKamin(),
  };
}
