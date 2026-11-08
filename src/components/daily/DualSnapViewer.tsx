/**
 * DualSnapViewer: Authentic BeReal-style dual-camera Picture-in-Picture viewer
 * Renders the main photo full-width with a draggable, floating PiP thumbnail of the selfie.
 * Tapping the thumbnail triggers a smooth 3D flip camera swap.
 */
import React, { useState } from 'react';
import { DualSnap } from '../../types/orbit';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface DualSnapViewerProps {
  snap: DualSnap;
  onReact?: (snapId: string, emoji: string) => void;
}

export const DualSnapViewer: React.FC<DualSnapViewerProps> = ({ snap, onReact }) => {
  const [swapped, setSwapped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [reactions, setReactions] = useState(snap.reactions);

  const handleSwap = () => {
    haptics.medium();
    setIsFlipping(true);
    setTimeout(() => {
      setSwapped((prev) => !prev);
      setIsFlipping(false);
    }, 150);
  };

  const handleReactionClick = (emoji: string) => {
    haptics.light();
    setReactions((prev) =>
      prev.map((r) => {
        if (r.emoji === emoji) {
          const nextByMe = !r.byMe;
          return {
            ...r,
            count: nextByMe ? r.count + 1 : Math.max(0, r.count - 1),
            byMe: nextByMe,
          };
        }
        return r;
      })
    );
    if (onReact) onReact(snap.id, emoji);
  };

  const mainSource = swapped ? snap.secondaryUri : snap.primaryUri;
  const pipSource = swapped ? snap.primaryUri : snap.secondaryUri;

  return (
    <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#1D1B20] border border-black/[0.08] dark:border-white/[0.1] shadow-lg mb-4">
      {/* Author and Timestamp Header */}
      <div className="flex items-center justify-between p-3.5">
        <div className="flex items-center gap-2.5">
          <img
            src={snap.avatarUri}
            alt={snap.authorName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#6750A4] dark:ring-[#D0BCFF]"
          />
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              <span>{snap.authorName}</span>
              <span className="text-[10px] text-slate-400">· {snap.timestamp}</span>
            </div>
            {snap.location && (
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <MapPin className="w-2.5 h-2.5 text-rose-500" />
                <span>{snap.location}</span>
              </div>
            )}
          </div>
        </div>

        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
          On Time ⚡
        </span>
      </div>

      {/* Picture-in-Picture Dual Camera Viewport */}
      <div className="relative w-full aspect-4/3 bg-black overflow-hidden select-none">
        {/* Full-size main photo with 3D Flip animation */}
        <motion.div
          animate={{ scale: isFlipping ? 0.98 : 1, rotateY: isFlipping ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="w-full h-full"
        >
          <img
            src={mainSource}
            alt="Main camera"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Draggable Picture-in-Picture floating selfie */}
        <motion.div
          drag
          dragConstraints={{ left: 12, right: 180, top: 12, bottom: 160 }}
          dragElastic={0.1}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwap}
          className="absolute top-3 left-3 w-28 aspect-3/4 rounded-2xl border-2 border-white/90 shadow-2xl overflow-hidden cursor-pointer bg-slate-900 z-10"
        >
          <img
            src={pipSource}
            alt="Selfie thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 inset-x-0 text-center pointer-events-none">
            <span className="text-[8px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-full">
              Tap to swap
            </span>
          </div>
        </motion.div>
      </div>

      {/* Caption & Quick Reaction Bar */}
      <div className="p-3.5">
        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-2.5">
          {snap.caption}
        </p>

        {/* Reaction Emoji Chips */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex-wrap">
          {reactions.map((r) => (
            <button
              key={r.emoji}
              onClick={() => handleReactionClick(r.emoji)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                r.byMe
                  ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] ring-1 ring-purple-300'
                  : 'bg-black/[0.04] dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:bg-black/[0.08]'
              }`}
            >
              <span>{r.emoji}</span>
              <span className="text-[10px] font-mono">{r.count}</span>
            </button>
          ))}

          {/* Quick add emoji reactions */}
          {['😍', '😂', '🔥', '👍'].map((em) => {
            if (reactions.some((r) => r.emoji === em)) return null;
            return (
              <button
                key={em}
                onClick={() => {
                  haptics.light();
                  setReactions((prev) => [...prev, { emoji: em, count: 1, byMe: true }]);
                  if (onReact) onReact(snap.id, em);
                }}
                className="w-7 h-7 rounded-full bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.08] flex items-center justify-center text-xs transition-colors"
                title={`React with ${em}`}
              >
                {em}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
