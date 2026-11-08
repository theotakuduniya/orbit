/**
 * Realtime Media & Synced Music Player Context
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TrackItem } from '../types/orbit';
import { INITIAL_TRACKS } from '../utils/mockData';
import { haptics } from '../utils/haptics';

interface PlayerContextType {
  tracks: TrackItem[];
  currentTrack: TrackItem;
  isPlaying: boolean;
  progressMs: number;
  isSyncedWithPartner: boolean;
  isPlayerExpanded: boolean;
  togglePlay: () => void;
  playTrack: (track: TrackItem) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleSync: () => void;
  seekTo: (ms: number) => void;
  setIsPlayerExpanded: (expanded: boolean) => void;
  addTrack: (track: Omit<TrackItem, 'id' | 'addedAt'>) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<TrackItem[]>(INITIAL_TRACKS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progressMs, setProgressMs] = useState<number>(45000);
  const [isSyncedWithPartner, setIsSyncedWithPartner] = useState<boolean>(true);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState<boolean>(false);

  const currentTrack = tracks[currentIndex] || tracks[0];

  // Simulated playback timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressMs((prev) => {
          if (prev >= currentTrack.durationMs) {
            // Next track
            setCurrentIndex((idx) => (idx + 1) % tracks.length);
            return 0;
          }
          return prev + 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.durationMs, tracks.length]);

  const togglePlay = () => {
    haptics.light();
    setIsPlaying((prev) => !prev);
  };

  const playTrack = (track: TrackItem) => {
    haptics.selection();
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
    setProgressMs(0);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    haptics.light();
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
    setProgressMs(0);
  };

  const prevTrack = () => {
    haptics.light();
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgressMs(0);
  };

  const toggleSync = () => {
    haptics.medium();
    setIsSyncedWithPartner((prev) => !prev);
  };

  const seekTo = (ms: number) => {
    haptics.selection();
    setProgressMs(Math.max(0, Math.min(ms, currentTrack.durationMs)));
  };

  const addTrack = (trackData: Omit<TrackItem, 'id' | 'addedAt'>) => {
    haptics.success();
    const newTrack: TrackItem = {
      ...trackData,
      id: `trk_${Date.now()}`,
      addedAt: 'Just now',
    };
    setTracks((prev) => [newTrack, ...prev]);
  };

  return (
    <PlayerContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        progressMs,
        isSyncedWithPartner,
        isPlayerExpanded,
        togglePlay,
        playTrack,
        nextTrack,
        prevTrack,
        toggleSync,
        seekTo,
        setIsPlayerExpanded,
        addTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
