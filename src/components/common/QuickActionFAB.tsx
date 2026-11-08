/**
 * QuickActionFAB: Speed dial FAB for rapid micro-actions across tabs
 */
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Camera, Image, Pin, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { haptics } from '../../utils/haptics';

interface QuickActionFABProps {
  onSelectAction: (action: 'snap' | 'pin' | 'meme' | 'mood') => void;
}

export const QuickActionFAB: React.FC<QuickActionFABProps> = ({ onSelectAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    haptics.light();
    setIsOpen((prev) => !prev);
  };

  const handleAction = (act: 'snap' | 'pin' | 'meme' | 'mood') => {
    haptics.medium();
    setIsOpen(false);
    onSelectAction(act);
  };

  // Passive event listeners: auto-dismiss speed dial on outside touch or scroll without blocking page scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideTouch = (e: TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        haptics.light();
        setIsOpen(false);
      }
    };

    const handlePassiveScroll = () => {
      setIsOpen(false);
    };

    // Explicitly declare { passive: true } to guarantee fluid 60/120fps touch performance
    window.addEventListener('touchstart', handleOutsideTouch, { passive: true });
    window.addEventListener('scroll', handlePassiveScroll, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleOutsideTouch);
      window.removeEventListener('scroll', handlePassiveScroll);
    };
  }, [isOpen]);

  return (
    <>
      {/* Tap-outside dismiss backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              haptics.light();
              setIsOpen(false);
            }}
            className="fixed inset-0 z-35 bg-black/25 backdrop-blur-[2px] transition-opacity"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        className="fixed bottom-32 sm:bottom-32 md:bottom-8 right-4 sm:right-6 md:right-8 z-40 select-none"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              role="menu"
              aria-label="Quick action speed dial"
              className="flex flex-col items-end gap-3 mb-3"
            >
              <motion.button
                role="menuitem"
                initial={{ scale: 0.8, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 12 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleAction('snap')}
                className="min-h-[48px] min-w-[150px] px-4 py-2.5 rounded-full bg-white/95 dark:bg-[#211F26]/95 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-lg shadow-black/10 dark:shadow-black/30 border border-black/[0.08] dark:border-white/[0.1] active:scale-95 touch-manipulation flex items-center justify-between gap-3 backdrop-blur-md cursor-pointer"
              >
                <span>Post BeReal</span>
                <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                </div>
              </motion.button>

              <motion.button
                role="menuitem"
                initial={{ scale: 0.8, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 12 }}
                transition={{ duration: 0.15, delay: 0.03 }}
                onClick={() => handleAction('pin')}
                className="min-h-[48px] min-w-[150px] px-4 py-2.5 rounded-full bg-white/95 dark:bg-[#211F26]/95 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-lg shadow-black/10 dark:shadow-black/30 border border-black/[0.08] dark:border-white/[0.1] active:scale-95 touch-manipulation flex items-center justify-between gap-3 backdrop-blur-md cursor-pointer"
              >
                <span>Pin Note</span>
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                  <Pin className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                </div>
              </motion.button>

              <motion.button
                role="menuitem"
                initial={{ scale: 0.8, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 12 }}
                transition={{ duration: 0.15, delay: 0.06 }}
                onClick={() => handleAction('meme')}
                className="min-h-[48px] min-w-[150px] px-4 py-2.5 rounded-full bg-white/95 dark:bg-[#211F26]/95 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-lg shadow-black/10 dark:shadow-black/30 border border-black/[0.08] dark:border-white/[0.1] active:scale-95 touch-manipulation flex items-center justify-between gap-3 backdrop-blur-md cursor-pointer"
              >
                <span>Drop Meme</span>
                <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center shrink-0">
                  <Image className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                </div>
              </motion.button>

              <motion.button
                role="menuitem"
                initial={{ scale: 0.8, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 12 }}
                transition={{ duration: 0.15, delay: 0.09 }}
                onClick={() => handleAction('mood')}
                className="min-h-[48px] min-w-[150px] px-4 py-2.5 rounded-full bg-white/95 dark:bg-[#211F26]/95 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-lg shadow-black/10 dark:shadow-black/30 border border-black/[0.08] dark:border-white/[0.1] active:scale-95 touch-manipulation flex items-center justify-between gap-3 backdrop-blur-md cursor-pointer"
              >
                <span>Log Mood</span>
                <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-pink-600 dark:text-pink-300" />
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary FAB Button (56px x 56px touch target) */}
        <button
          onClick={toggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close speed dial' : 'Open quick actions'}
          className={`w-14 h-14 min-w-[56px] min-h-[56px] rounded-full flex items-center justify-center shadow-xl shadow-black/20 dark:shadow-black/40 transition-all duration-200 active:scale-90 touch-manipulation cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6750A4] ${
            isOpen
              ? 'bg-slate-800 text-white rotate-45'
              : 'bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72]'
          }`}
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </>
  );
};
