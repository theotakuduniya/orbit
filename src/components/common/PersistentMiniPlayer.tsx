/**
 * PersistentMiniPlayer: Floating bottom player dock with synced audio pulse
 * Features live audio visualizer bars, play/pause, next, and full player expansion modal
 */
import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Volume2,
  ChevronDown,
  Sparkles,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { haptics } from '../../utils/haptics';

export const PersistentMiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    progressMs,
    isSyncedWithPartner,
    isPlayerExpanded,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleSync,
    seekTo,
    setIsPlayerExpanded,
    tracks,
    playTrack,
  } = usePlayer();

  const progressPercent = (progressMs / currentTrack.durationMs) * 100;

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      {/* Floating Mini Player Dock */}
      <div className="sticky bottom-14 md:bottom-4 z-30 px-3 sm:px-6 max-w-2xl mx-auto w-full">
        <div
          onClick={() => {
            haptics.selection();
            setIsPlayerExpanded(true);
          }}
          className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#E8DEF8]/95 dark:bg-[#211F26]/95 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.1] shadow-lg shadow-black/5 dark:shadow-black/20 p-2 transition-transform active:scale-[0.99]"
        >
          {/* Subtle Progress Bar Underneath */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
            <div
              className="h-full bg-[#6750A4] dark:bg-[#D0BCFF] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Left: Album Cover + Synced Visualizer Pulse */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover transition-transform ${isPlaying ? 'scale-105' : 'scale-100'}`}
                />
                {/* Audio pulse bars overlay */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-0.5">
                    <span className="w-1 bg-white rounded-full h-3 animate-pulse" />
                    <span className="w-1 bg-white rounded-full h-5 animate-pulse delay-75" />
                    <span className="w-1 bg-white rounded-full h-2 animate-pulse delay-150" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {currentTrack.title}
                  </h4>
                  {isSyncedWithPartner && (
                    <span className="flex items-center gap-0.5 text-[9px] font-semibold text-[#6750A4] dark:text-[#D0BCFF] bg-[#EADDFF] dark:bg-[#4F378B]/70 px-1.5 py-0.2 rounded-full whitespace-nowrap">
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                      Synced
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                  {currentTrack.artist} · <span className="text-[10px]">Added by {currentTrack.addedBy.name}</span>
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-9 h-9 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] flex items-center justify-center shadow-md active:scale-95 transition-transform"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextTrack();
                }}
                className="w-8 h-8 rounded-full text-slate-700 dark:text-slate-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] flex items-center justify-center active:scale-95 transition-transform"
                aria-label="Next track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Full Player Bottom Sheet */}
      <AnimatePresence>
        {isPlayerExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsPlayerExpanded(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 z-50 max-w-lg mx-auto bg-[#FEF7FF] dark:bg-[#1D1B20] rounded-t-[32px] p-6 shadow-2xl border-t border-black/[0.08] dark:border-white/[0.1] max-h-[90vh] overflow-y-auto"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setIsPlayerExpanded(false)}
                  className="p-2 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-slate-600 dark:text-slate-300"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    Playing from shared crate
                  </span>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Us 💖 vibes
                  </div>
                </div>
                <button
                  onClick={toggleSync}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    isSyncedWithPartner
                      ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF]'
                      : 'bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSyncedWithPartner ? 'In Sync' : 'Solo'}</span>
                </button>
              </div>

              {/* Album Art with Glow */}
              <div className="relative my-4 aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Track Title and Attribution */}
              <div className="flex items-center justify-between mt-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    {currentTrack.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {currentTrack.artist} · {currentTrack.album}
                  </p>
                </div>
                <button
                  onClick={() => haptics.light()}
                  className="p-2 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-rose-500"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </button>
              </div>

              {/* Partner Listening Indicator */}
              <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-200 text-xs">
                <Radio className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF] animate-pulse" />
                <span>Sam is tuned in · Listening together simultaneously</span>
              </div>

              {/* Progress Scrubber */}
              <div className="mt-6">
                <input
                  type="range"
                  min="0"
                  max={currentTrack.durationMs}
                  value={progressMs}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#6750A4] dark:accent-[#D0BCFF]"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
                  <span>{formatTime(progressMs)}</span>
                  <span>{formatTime(currentTrack.durationMs)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button
                  onClick={prevTrack}
                  className="p-3 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1" />
                  )}
                </button>
                <button
                  onClick={nextTrack}
                  className="p-3 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>

              {/* Shared Queue Preview */}
              <div className="mt-8 border-t border-black/[0.06] dark:border-white/[0.08] pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Next in shared queue
                  </span>
                  <Volume2 className="w-4 h-4 text-slate-400" />
                </div>
                <div className="space-y-2">
                  {tracks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => playTrack(t)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                        t.id === currentTrack.id
                          ? 'bg-[#EADDFF] dark:bg-[#4F378B]/50'
                          : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={t.coverUrl}
                          alt={t.title}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {t.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {t.artist} · Added by {t.addedBy.name}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {formatTime(t.durationMs)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
