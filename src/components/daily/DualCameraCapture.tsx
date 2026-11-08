/**
 * DualCameraCapture: Interactive front/back sequential flow for capturing today's BeReal-style dual-snap
 */
import React, { useState, useEffect } from 'react';
import { DualSnap } from '../../types/orbit';
import { CURRENT_USER } from '../../utils/mockData';
import { Camera, RefreshCw, X, Check, MapPin } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface DualCameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSnap: (newSnap: DualSnap) => void;
}

export const DualCameraCapture: React.FC<DualCameraCaptureProps> = ({
  isOpen,
  onClose,
  onPostSnap,
}) => {
  const [step, setStep] = useState<'rear' | 'front' | 'preview'>('rear');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [rearPhoto, setRearPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  );
  const [frontPhoto, setFrontPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [caption, setCaption] = useState('Study date with iced lattes ☕');
  const [location, setLocation] = useState('Coffee Lab & Roastery');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown !== null && countdown > 0) {
      haptics.selection();
      timer = setTimeout(() => setCountdown(countdown - 1), 700);
    } else if (countdown === 0) {
      haptics.shutter();
      setCountdown(null);
      if (step === 'rear') {
        setStep('front');
      } else if (step === 'front') {
        setStep('preview');
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, step]);

  if (!isOpen) return null;

  const triggerSnap = () => {
    setCountdown(2);
  };

  const handlePost = () => {
    haptics.success();
    const newSnap: DualSnap = {
      id: `snap_${Date.now()}`,
      authorName: CURRENT_USER.name,
      authorId: CURRENT_USER.id,
      avatarUri: CURRENT_USER.avatar,
      primaryUri: rearPhoto,
      secondaryUri: frontPhoto,
      caption: caption.trim() || "Today's moment",
      timestamp: 'Just now',
      dateStr: 'Today',
      location: location.trim() || undefined,
      reactions: [
        { emoji: '💖', count: 1, byMe: true },
        { emoji: '✨', count: 1, byMe: false },
      ],
    };
    onPostSnap(newSnap);
    onClose();
    setStep('rear');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#141218] text-white p-5 shadow-2xl border border-white/10 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-purple-300">
            {step === 'rear'
              ? 'Back camera'
              : step === 'front'
              ? 'Selfie camera'
              : 'Preview BeReal'}
          </span>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Frame */}
        <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-black shadow-inner mb-4 border border-white/20">
          <img
            src={step === 'rear' ? rearPhoto : step === 'front' ? frontPhoto : rearPhoto}
            alt="Viewfinder"
            className="w-full h-full object-cover"
          />

          {/* If preview step, show floating PiP */}
          {step === 'preview' && (
            <div className="absolute top-2 left-2 w-24 aspect-3/4 rounded-xl overflow-hidden border-2 border-white shadow-xl">
              <img src={frontPhoto} alt="Front selfie" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-6xl font-black text-white animate-ping">
                {countdown}
              </span>
            </div>
          )}

          {/* Viewfinder Target Reticle */}
          {step !== 'preview' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 border border-white/40 rounded-xl" />
            </div>
          )}
        </div>

        {/* Action Controls */}
        {step !== 'preview' ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={triggerSnap}
              disabled={countdown !== null}
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-white" />
            </button>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add caption..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
            />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location..."
                className="bg-transparent border-none text-white focus:outline-none text-xs w-full"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep('rear')}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white"
              >
                Retake
              </button>
              <button
                onClick={handlePost}
                className="flex-1 py-2.5 rounded-xl bg-[#D0BCFF] text-[#381E72] font-bold text-xs shadow-md active:scale-95 transition-transform"
              >
                Post BeReal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
