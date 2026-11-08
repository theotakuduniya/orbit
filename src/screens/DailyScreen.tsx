/**
 * DailyScreen
 * Features:
 * - BeReal module with authentic dual-camera PiP feed & camera capture
 * - Mood tracer with emoji-driven logging and 30-day paired emoji matrix
 * - Clean, concise layout without unnecessary text
 */
import React, { useState } from 'react';
import { DualSnapViewer } from '../components/daily/DualSnapViewer';
import { DualCameraCapture } from '../components/daily/DualCameraCapture';
import { MoodHeatmapMatrix } from '../components/daily/MoodHeatmapMatrix';
import { DualSnap } from '../types/orbit';
import { INITIAL_DUAL_SNAPS, CURRENT_USER } from '../utils/mockData';
import { Camera, Plus } from 'lucide-react';
import { haptics } from '../utils/haptics';

export const DailyScreen: React.FC = () => {
  const [segment, setSegment] = useState<'bereal' | 'mood'>('bereal');
  const [snaps, setSnaps] = useState<DualSnap[]>(INITIAL_DUAL_SNAPS);
  const [isCameraCaptureOpen, setIsCameraCaptureOpen] = useState(false);

  const handlePostSnap = (newSnap: DualSnap) => {
    setSnaps((prev) => [newSnap, ...prev]);
  };

  const hasPostedToday = snaps.some(
    (s) => s.authorId === CURRENT_USER.id && s.dateStr.toLowerCase().includes('today')
  );

  const BeRealSection = (
    <div className="space-y-3.5">
      {/* BeReal Top Action Bar */}
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-3xl bg-white dark:bg-[#1D1B20] border border-black/[0.08] dark:border-white/[0.1] shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xs">
            BR
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              BeReal.
            </h3>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
              ⚠️ 2 min left
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            haptics.medium();
            setIsCameraCaptureOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold shadow-xs active:scale-95 transition-transform shrink-0"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{hasPostedToday ? 'Retake' : 'Post BeReal'}</span>
        </button>
      </div>

      {/* Feed of BeReal Posts */}
      <div className="space-y-4">
        {snaps.map((snap) => (
          <DualSnapViewer key={snap.id} snap={snap} />
        ))}
      </div>

      {/* BeReal Camera Modal */}
      <DualCameraCapture
        isOpen={isCameraCaptureOpen}
        onClose={() => setIsCameraCaptureOpen(false)}
        onPostSnap={handlePostSnap}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Mobile-Only Segmented Control */}
      <div className="lg:hidden px-1">
        <div className="flex items-center p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] gap-1 max-w-sm mx-auto">
          <button
            onClick={() => {
              haptics.selection();
              setSegment('bereal');
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              segment === 'bereal'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>BeReal</span>
          </button>

          <button
            onClick={() => {
              haptics.selection();
              setSegment('mood');
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              segment === 'mood'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <span className="text-xs">😊</span>
            <span>Mood</span>
          </button>
        </div>
      </div>

      {/* Desktop (lg+): 2-Column Side-by-Side View */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: BeReal */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
              <span>BeReal</span>
            </h2>
            <span className="text-[11px] text-slate-400">Daily snapshot</span>
          </div>
          {BeRealSection}
        </div>

        {/* Right Column: Mood Tracer & Matrix */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>😊</span>
              <span>Mood</span>
            </h2>
            <span className="text-[11px] text-slate-400">30-day paired matrix</span>
          </div>
          <MoodHeatmapMatrix />
        </div>
      </div>

      {/* Mobile/Tablet View (< lg): Segmented View */}
      <div className="lg:hidden flex-1 overflow-y-auto">
        {segment === 'bereal' && BeRealSection}
        {segment === 'mood' && <MoodHeatmapMatrix />}
      </div>
    </div>
  );
};
