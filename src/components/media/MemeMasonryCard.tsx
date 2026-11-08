/**
 * MemeMasonryCard: Fast image card with double-tap reactions and voice memo chips
 */
import React, { useState, useRef } from 'react';
import { MemeItem, VoiceReaction } from '../../types/orbit';
import { Heart, Flame, Mic, Play, Pause, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { haptics } from '../../utils/haptics';
import { VoiceReactionModal } from './VoiceReactionModal';

interface MemeMasonryCardProps {
  meme: MemeItem;
  onUpdateMeme: (updated: MemeItem) => void;
}

export const MemeMasonryCard: React.FC<MemeMasonryCardProps> = ({ meme, onUpdateMeme }) => {
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showFlameBurst, setShowFlameBurst] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const lastTapRef = useRef<number>(0);

  // Handle double tap
  const handleCardTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected!
      haptics.medium();
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);

      const nextLikes = meme.userLiked ? meme.likes : meme.likes + 1;
      onUpdateMeme({
        ...meme,
        likes: nextLikes,
        userLiked: true,
      });
    } else {
      // Single tap
    }
    lastTapRef.current = now;
  };

  const toggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.light();
    const nextUserLiked = !meme.userLiked;
    onUpdateMeme({
      ...meme,
      userLiked: nextUserLiked,
      likes: nextUserLiked ? meme.likes + 1 : Math.max(0, meme.likes - 1),
    });
  };

  const toggleFire = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.light();
    const nextUserFired = !meme.userFired;
    if (nextUserFired) {
      setShowFlameBurst(true);
      setTimeout(() => setShowFlameBurst(false), 700);
    }
    onUpdateMeme({
      ...meme,
      userFired: nextUserFired,
      fires: nextUserFired ? meme.fires + 1 : Math.max(0, meme.fires - 1),
    });
  };

  const handleVoicePlay = (e: React.MouseEvent, vrId: string) => {
    e.stopPropagation();
    haptics.selection();
    if (playingVoiceId === vrId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(vrId);
      setTimeout(() => setPlayingVoiceId(null), 3500);
    }
  };

  const handleAddVoiceReaction = (reaction: VoiceReaction) => {
    onUpdateMeme({
      ...meme,
      voiceReactions: [reaction, ...meme.voiceReactions],
    });
  };

  return (
    <>
      <div
        onClick={handleCardTap}
        className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#1D1B20] border border-black/[0.08] dark:border-white/[0.1] shadow-xs transition-transform active:scale-[0.99] mb-3 break-inside-avoid cursor-pointer"
      >
        {/* Main Meme Image */}
        <div className="relative overflow-hidden bg-black/5 aspect-auto">
          <img
            src={meme.imageUrl}
            alt={meme.caption}
            className="w-full h-auto object-cover"
            loading="lazy"
          />

          {/* Double tap heart burst animation */}
          <AnimatePresence>
            {showHeartBurst && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <Heart className="w-16 h-16 fill-rose-500 text-white drop-shadow-lg" />
              </motion.div>
            )}
            {showFlameBurst && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <Flame className="w-16 h-16 fill-amber-500 text-white drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Author Tag on Top Left */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium">
            <img
              src={meme.authorAvatar}
              alt={meme.authorName}
              className="w-3.5 h-3.5 rounded-full object-cover"
            />
            <span>{meme.authorName}</span>
          </div>

          {/* Zoom button on Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              haptics.selection();
              setIsLightboxOpen(true);
            }}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white transition-opacity opacity-0 group-hover:opacity-100 shadow-sm z-10"
            title="Full view"
          >
            <span className="text-[10px] leading-none">🔍</span>
          </button>

          {/* Voice Memo Chip overlay (if any exists) */}
          {meme.voiceReactions.length > 0 && (
            <div className="absolute bottom-12 left-2.5 z-10">
              {meme.voiceReactions.slice(0, 1).map((vr) => {
                const isPlaying = playingVoiceId === vr.id;
                return (
                  <button
                    key={vr.id}
                    onClick={(e) => handleVoicePlay(e, vr.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-[10px] shadow-md transition-transform active:scale-95"
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-[#D0BCFF] text-[#381E72] flex items-center justify-center shrink-0">
                      {isPlaying ? <Pause className="w-2 h-2 fill-current" /> : <Play className="w-2 h-2 fill-current ml-0.5" />}
                    </div>
                    <span className="font-mono text-[9px]">0:0{Math.round(vr.durationSec)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* REACTION ICONS OVER MEME CARD (Bottom Bar overlay - no bottom caption text) */}
          <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between pointer-events-none z-10">
            <div className="flex items-center gap-1.5 bg-black/55 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-white shadow-lg pointer-events-auto">
              <button
                onClick={toggleHeart}
                className={`flex items-center gap-1 transition-transform active:scale-125 ${
                  meme.userLiked ? 'text-rose-400 font-bold' : 'text-white/80 hover:text-white'
                }`}
                title="Like meme"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${meme.userLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                />
                <span className="text-[10px] font-mono">{meme.likes}</span>
              </button>

              <div className="w-[1px] h-3 bg-white/20 mx-0.5" />

              <button
                onClick={toggleFire}
                className={`flex items-center gap-1 transition-transform active:scale-125 ${
                  meme.userFired ? 'text-amber-400 font-bold' : 'text-white/80 hover:text-white'
                }`}
                title="Fire reaction"
              >
                <Flame
                  className={`w-3.5 h-3.5 ${meme.userFired ? 'fill-amber-500 text-amber-500' : ''}`}
                />
                <span className="text-[10px] font-mono">{meme.fires}</span>
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                haptics.light();
                setIsVoiceModalOpen(true);
              }}
              className="p-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/70 shadow-lg pointer-events-auto transition-transform active:scale-90"
              title="Add voice reaction"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Voice Recorder Modal */}
      <VoiceReactionModal
        memeId={meme.id}
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSaveReaction={handleAddVoiceReaction}
      />

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={meme.imageUrl}
              alt={meme.caption}
              className="w-full max-h-[75vh] object-contain rounded-2xl mb-4 shadow-2xl"
            />
            <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md text-white flex items-center justify-between text-xs">
              <span className="font-medium">Shared by {meme.authorName}</span>
              <span className="text-white/60 text-[11px]">{meme.timestamp}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
