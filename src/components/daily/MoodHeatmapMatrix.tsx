/**
 * MoodHeatmapMatrix (Mood Tracer & Matrix)
 * Features:
 * - Emoji-based mood tracer (🥰 Radiant, 😊 Chill, ⚡ Busy, 🥱 Tired, 🥺 Low)
 * - Emoji-based 30-day paired matrix displaying Alex & Sam's emojis side-by-side
 * - Emojis used throughout instead of icons (🔥 streak, 💖 harmony)
 * - Minimal, concise text without unnecessary clutter
 */
import React, { useState } from 'react';
import { MoodStage, DailyMoodEntry } from '../../types/orbit';
import { INITIAL_MOOD_HISTORY, CURRENT_USER, PARTNER } from '../../utils/mockData';
import { Check } from 'lucide-react';
import { haptics } from '../../utils/haptics';

const MOOD_OPTIONS: { stage: MoodStage; emoji: string; label: string }[] = [
  { stage: 'radiant', emoji: '🥰', label: 'Radiant' },
  { stage: 'chill', emoji: '😊', label: 'Chill' },
  { stage: 'busy', emoji: '⚡', label: 'Busy' },
  { stage: 'tired', emoji: '🥱', label: 'Tired' },
  { stage: 'low', emoji: '🥺', label: 'Low' },
];

export const MoodHeatmapMatrix: React.FC = () => {
  const [history, setHistory] = useState<DailyMoodEntry[]>(INITIAL_MOOD_HISTORY);
  const [selectedMood, setSelectedMood] = useState<MoodStage>('radiant');
  const [moodNote, setMoodNote] = useState('Feeling accomplished and excited for the weekend!');
  const [inspectedDay, setInspectedDay] = useState<DailyMoodEntry | null>(history[history.length - 1]);
  const [isSavedToday, setIsSavedToday] = useState(true);

  const handleSelectMood = (stage: MoodStage) => {
    haptics.selection();
    setSelectedMood(stage);
    setIsSavedToday(false);
  };

  const handleSaveMood = () => {
    haptics.success();
    setHistory((prev) =>
      prev.map((entry, idx) =>
        idx === prev.length - 1
          ? { ...entry, userMood: selectedMood, userNote: moodNote }
          : entry
      )
    );
    setIsSavedToday(true);
  };

  const getMoodEmoji = (stage: MoodStage | null) => {
    if (!stage) return '·';
    const option = MOOD_OPTIONS.find((o) => o.stage === stage);
    return option ? option.emoji : '·';
  };

  return (
    <div className="flex flex-col h-full space-y-3 pb-16">
      {/* Mood Tracer: Interactive Emoji Selector */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#1D1B20] border border-black/[0.08] dark:border-white/[0.1] shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span>Mood tracer</span>
          </span>
          {isSavedToday && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Logged</span>
            </span>
          )}
        </div>

        {/* 5 Emojis */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 my-1.5">
          {MOOD_OPTIONS.map((opt) => {
            const isSelected = selectedMood === opt.stage;
            return (
              <button
                key={opt.stage}
                onClick={() => handleSelectMood(opt.stage)}
                className={`flex flex-col items-center py-2 px-1 rounded-2xl border-2 transition-all active:scale-95 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 shadow-xs scale-105'
                    : 'border-transparent bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.05]'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-0.5">{opt.emoji}</span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Short Note */}
        <div className="mt-2.5 flex items-center gap-2">
          <input
            type="text"
            value={moodNote}
            onChange={(e) => {
              setMoodNote(e.target.value);
              setIsSavedToday(false);
            }}
            placeholder="Add a quick note..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
          />
          <button
            onClick={handleSaveMood}
            disabled={isSavedToday}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-transform active:scale-95 shrink-0 ${
              isSavedToday
                ? 'bg-slate-200 dark:bg-white/10 text-slate-400'
                : 'bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72]'
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Streak & Harmony Stats (Emojis instead of icons) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-2xl bg-[#EADDFF]/40 dark:bg-[#4F378B]/20 border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2.5">
          <span className="text-2xl leading-none">🔥</span>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 font-mono leading-tight">
              18 days
            </div>
            <div className="text-[10px] text-slate-500">Streak</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2.5">
          <span className="text-2xl leading-none">💖</span>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 font-mono leading-tight">
              84%
            </div>
            <div className="text-[10px] text-slate-500">Harmony</div>
          </div>
        </div>
      </div>

      {/* 30-Day Mood Matrix (Using Emojis!) */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#1D1B20] border border-black/[0.08] dark:border-white/[0.1] shadow-xs flex-1">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            30-day mood matrix
          </h4>
          <span className="text-[10px] text-slate-400">
            Alex & Sam
          </span>
        </div>

        {/* 30-Day Emoji Matrix Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5 p-2 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl">
          {history.map((day) => {
            const isSelected = inspectedDay?.date === day.date;
            const dayNum = day.date.split('-')[2];

            return (
              <button
                key={day.date}
                onClick={() => {
                  haptics.selection();
                  setInspectedDay(day);
                }}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center gap-0.5 border transition-all ${
                  isSelected
                    ? 'border-[#6750A4] dark:border-[#D0BCFF] bg-purple-50 dark:bg-purple-950/40 shadow-xs scale-105'
                    : 'border-transparent bg-white/50 dark:bg-white/[0.03] hover:border-black/10'
                }`}
                title={day.date}
              >
                {/* Paired Emojis (Alex & Sam) */}
                <div className="flex items-center justify-center gap-0.5 text-xs sm:text-sm">
                  <span>{getMoodEmoji(day.userMood)}</span>
                  <span>{getMoodEmoji(day.partnerMood)}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">
                  {dayNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Inspection Card */}
        {inspectedDay && (
          <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
            <div className="text-[11px] font-semibold text-slate-400 mb-2">
              {inspectedDay.date}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <img
                  src={CURRENT_USER.avatar}
                  alt="Alex"
                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <div className="font-bold flex items-center gap-1">
                    <span>Alex:</span>
                    <span>{getMoodEmoji(inspectedDay.userMood)}</span>
                  </div>
                  {inspectedDay.userNote && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                      "{inspectedDay.userNote}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <img
                  src={PARTNER.avatar}
                  alt="Sam"
                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <div className="font-bold flex items-center gap-1">
                    <span>Sam:</span>
                    <span>{getMoodEmoji(inspectedDay.partnerMood)}</span>
                  </div>
                  {inspectedDay.partnerNote && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                      "{inspectedDay.partnerNote}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
