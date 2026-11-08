/**
 * VoiceReactionModal: Record and attach a 5-second voice reaction snippet to any meme
 */
import React, { useState, useEffect } from 'react';
import { Mic, Square, Play, Pause, X, Check, Sparkles } from 'lucide-react';
import { VoiceReaction } from '../../types/orbit';
import { CURRENT_USER } from '../../utils/mockData';
import { haptics } from '../../utils/haptics';

interface VoiceReactionModalProps {
  memeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveReaction: (reaction: VoiceReaction) => void;
}

export const VoiceReactionModal: React.FC<VoiceReactionModalProps> = ({
  memeId,
  isOpen,
  onClose,
  onSaveReaction,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<boolean>(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSecs((s) => {
          if (s >= 5) {
            setIsRecording(false);
            setRecordedAudio(true);
            haptics.success();
            return 5;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isOpen) return null;

  const startRecording = () => {
    haptics.medium();
    setRecordSecs(0);
    setRecordedAudio(false);
    setIsRecording(true);
  };

  const stopRecording = () => {
    haptics.light();
    setIsRecording(false);
    setRecordedAudio(true);
  };

  const handleSave = () => {
    haptics.success();
    const newReaction: VoiceReaction = {
      id: `vr_${Date.now()}`,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      durationSec: recordSecs || 3,
      timestamp: 'Just now',
      waveform: [0.3, 0.7, 0.9, 0.5, 0.8, 0.6, 0.4, 0.9, 0.3],
    };
    onSaveReaction(newReaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xs p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10 text-center">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-rose-500" />
            Voice Reaction (5s max)
          </span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Audio Visualizer Wave */}
        <div className="my-6 h-16 flex items-center justify-center gap-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-2xl p-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isRecording
                  ? 'bg-rose-500 animate-pulse'
                  : recordedAudio
                  ? 'bg-purple-500'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
              style={{
                height: isRecording
                  ? `${Math.max(12, Math.random() * 48)}px`
                  : recordedAudio
                  ? `${[16, 28, 40, 24, 36, 44, 20, 32, 24, 18, 30, 16][i]}px`
                  : '8px',
              }}
            />
          ))}
        </div>

        {/* Recording Status / Timer */}
        <div className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 mb-4">
          {isRecording ? `00:0${recordSecs} / 00:05` : recordedAudio ? `00:0${recordSecs} Recorded!` : 'Tap record'}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!recordedAudio ? (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-7 h-7" />}
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  haptics.light();
                  setIsPlayingPreview(!isPlayingPreview);
                }}
                className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 flex items-center justify-center active:scale-95 transition-transform"
              >
                {isPlayingPreview ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={startRecording}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Re-record
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2.5 rounded-2xl bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <Check className="w-4 h-4" />
                <span>Attach</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
