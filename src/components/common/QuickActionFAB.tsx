/**
 * QuickActionFAB: Speed dial FAB for rapid micro-actions across tabs
 */
import React, { useState } from 'react';
import { Plus, X, Camera, Image, Pin, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { haptics } from '../../utils/haptics';

interface QuickActionFABProps {
  onSelectAction: (action: 'snap' | 'pin' | 'meme' | 'mood') => void;
}

export const QuickActionFAB: React.FC<QuickActionFABProps> = ({ onSelectAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    haptics.light();
    setIsOpen(!isOpen);
  };

  const handleAction = (act: 'snap' | 'pin' | 'meme' | 'mood') => {
    haptics.medium();
    setIsOpen(false);
    onSelectAction(act);
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-2.5 mb-2.5">
            <motion.button
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 10 }}
              onClick={() => handleAction('snap')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#211F26] text-slate-800 dark:text-slate-100 text-xs font-bold shadow-lg border border-black/[0.08] dark:border-white/[0.1] active:scale-95"
            >
              <span>Post BeReal</span>
              <Camera className="w-4 h-4 text-purple-500" />
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 10 }}
              transition={{ delay: 0.04 }}
              onClick={() => handleAction('pin')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#211F26] text-slate-800 dark:text-slate-100 text-xs font-bold shadow-lg border border-black/[0.08] dark:border-white/[0.1] active:scale-95"
            >
              <span>Pin Note</span>
              <Pin className="w-4 h-4 text-amber-500" />
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 10 }}
              transition={{ delay: 0.08 }}
              onClick={() => handleAction('meme')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#211F26] text-slate-800 dark:text-slate-100 text-xs font-bold shadow-lg border border-black/[0.08] dark:border-white/[0.1] active:scale-95"
            >
              <span>Drop Meme</span>
              <Image className="w-4 h-4 text-rose-500" />
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 10 }}
              transition={{ delay: 0.12 }}
              onClick={() => handleAction('mood')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#211F26] text-slate-800 dark:text-slate-100 text-xs font-bold shadow-lg border border-black/[0.08] dark:border-white/[0.1] active:scale-95"
            >
              <span>Log Mood</span>
              <Heart className="w-4 h-4 text-pink-500" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={toggle}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${
          isOpen
            ? 'bg-slate-800 text-white rotate-45'
            : 'bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72]'
        }`}
        aria-label="Quick Action"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
