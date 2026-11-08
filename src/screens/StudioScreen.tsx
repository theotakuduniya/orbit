/**
 * StudioScreen: Creative Studio Tab
 * Sub-segments: [Moodboards] | [Live Doodle] | [Tier List]
 */
import React, { useState } from 'react';
import { MoodboardCanvas } from '../components/studio/MoodboardCanvas';
import { SkiaDoodleCanvas } from '../components/studio/SkiaDoodleCanvas';
import { MobileTierStudio } from '../components/studio/MobileTierStudio';
import { LayoutGrid, PenTool, Layers } from 'lucide-react';
import { haptics } from '../utils/haptics';

export const StudioScreen: React.FC = () => {
  const [segment, setSegment] = useState<'moodboard' | 'doodle' | 'tier'>('moodboard');

  return (
    <div className="flex flex-col h-full">
      {/* Horizontal Pill Segments */}
      <div className="px-4 py-2 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#FEF7FF]/50 dark:bg-[#141218]/50 backdrop-blur-xs">
        <div className="flex items-center p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] gap-1">
          <button
            onClick={() => {
              haptics.selection();
              setSegment('moodboard');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              segment === 'moodboard'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Moodboard</span>
          </button>

          <button
            onClick={() => {
              haptics.selection();
              setSegment('doodle');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              segment === 'doodle'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Live Doodle</span>
          </button>

          <button
            onClick={() => {
              haptics.selection();
              setSegment('tier');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              segment === 'tier'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tier Maker</span>
          </button>
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto">
        {segment === 'moodboard' && <MoodboardCanvas />}
        {segment === 'doodle' && <SkiaDoodleCanvas />}
        {segment === 'tier' && <MobileTierStudio />}
      </div>
    </div>
  );
};
